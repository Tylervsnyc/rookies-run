/**
 * learn-from-tyler — mine Tyler's real runs for bot lessons. No ML, no magic:
 * an honest heuristic-mining pipeline over the human traces in Supabase.
 *
 *   1. FETCH  recent human traces (run_traces table; disk fallback).
 *   2. REPLAY each run through the REAL engine. The trace does not record the
 *      per-attempt aiRngSeed or the difficulty, so enemy tie-breaks can
 *      diverge: we replay each level under several candidate seeds, validate
 *      every Tyler action against the anchors the trace DOES record (rookie
 *      from-square, capture type, tempo after the move, enemy/ally counts,
 *      the death snapshot), and keep only decision points where the
 *      reconstruction is verifiably in sync. Unreconstructable stretches are
 *      counted and reported honestly, never guessed at.
 *   3. COMPARE at every reconstructed decision point: what would the T5 bot
 *      (the same MCTS the harness uses) play from this exact state with
 *      Tyler's loadout? Record agreement/disagreement.
 *   4. MINE  disagreements + an ability frequency table into a markdown
 *      report: data/run-playtest/revenge/tyler-lessons/<date>.md.
 *   5. A/B   (--ab) full-runs sim with --tyler-priors on vs off.
 *
 * Usage:
 *   node --env-file=/path/.env.local --import tsx scripts/run-playtest/learn-from-tyler.ts \
 *     [--days=7] [--max-traces=30] [--rollouts=10] [--ab] [--ab-runs=24] [--json]
 *
 * Exported `watchTyler()` is what the nightly digest calls (skips silently
 * without Supabase creds — it then reads whatever traces are on disk).
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  ABILITY_DEFS,
  abilityLegalMoves,
  applyAbilityActivate,
  applyAbilityCancel,
  applyAbilityMove,
  applyAbilityTargeted,
  applyControlledAllyMove,
  applyDismissOffer,
  applyOfferPick,
  type AbilityId,
  type AbilityOfferOption,
  type AbilityTier,
} from '../../lib/run/abilities';
import { applyRookieMove } from '../../lib/run/engine';
import { getRunById } from '../../lib/run/runs';
import { puzzleForDate, puzzleToBoardState } from '../../lib/run/seed';
import { fromSquare, toSquare, type BoardState, type Coord } from '../../lib/run/types';
import { applyBotAction } from './bots/apply';
import { settleEnemyTurns } from './bots/t3';
import { T5 } from './bots/t5';
import { setTylerPriors } from './bots/mcts';
import { simulateRuns } from './revenge-core';
import type { Bot, BotAction, BotContext } from './types';
import { hashString, rngFromString } from './utils/rng';

// ─────────────────────────────────────────────────────────────────────────────
// Types

interface TraceMeta {
  runId: string;
  iso: string;
  level: number;
  totalLevels: number;
  outcome: 'won' | 'lost' | string;
  startedAt?: string;
}

type TraceEvent = Record<string, unknown> & { kind: string; level: number; t: number };

interface Trace {
  id: string;
  meta: TraceMeta;
  events: TraceEvent[];
}

/** One Tyler decision the replay could verify. */
interface DecisionPoint {
  traceId: string;
  runId: string;
  level: number;
  moveCount: number;
  enemiesLeft: number;
  state: BoardState; // state at decision time (verified in sync)
  tyler: BotAction;
  levelCleared: boolean; // did Tyler eventually clear THIS level
}

interface Comparison extends DecisionPoint {
  bot: BotAction;
  agree: 'exact' | 'same-kind' | 'disagree';
  botReason: string;
}

export interface AbilityRow {
  ability: string;
  casts: number;
  /** Distribution over levels the casts happened on. */
  levels: string;
  avgTurn: number;
  avgEnemiesLeft: number;
  /** Share of casts on levels Tyler went on to clear. */
  clearedPct: number;
}

export interface Lesson {
  title: string;
  detail: string;
}

export interface TylerWatch {
  since: string;
  source: 'supabase' | 'disk' | 'none';
  tracesWatched: number;
  won: number;
  lost: number;
  tylerActions: number;
  reconstructed: number;
  reconstructedPct: number;
  compared: number;
  agreeExact: number;
  agreeKind: number;
  agreementPct: number | null;
  abilityRows: AbilityRow[];
  lessons: Lesson[];
  topLesson: string | null;
  reportPath: string | null;
  caveats: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch

const REPO = process.cwd();
const DISK_DIR = join(REPO, 'data', 'run-playtest', 'human-traces');
const OUT_DIR = join(REPO, 'data', 'run-playtest', 'revenge', 'tyler-lessons');

async function fetchTraces(days: number, caveats: string[]): Promise<{ traces: Trace[]; source: TylerWatch['source']; since: string }> {
  const since = new Date(Date.now() - days * 86400_000).toISOString().slice(0, 10);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(url, key, { auth: { persistSession: false } });
      const { data, error } = await supabase
        .from('run_traces')
        .select('id, run_id, payload, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: true });
      if (error) throw new Error(error.message);
      const traces: Trace[] = [];
      for (const row of data ?? []) {
        const p = row.payload as { meta?: TraceMeta; events?: TraceEvent[] };
        if (!p?.meta || !Array.isArray(p.events)) continue;
        traces.push({ id: String(row.id).slice(0, 8), meta: p.meta, events: p.events });
      }
      return { traces, source: 'supabase', since };
    } catch (e) {
      caveats.push(`Supabase fetch failed (${(e as Error).message.slice(0, 120)}) — falling back to disk traces.`);
    }
  } else {
    caveats.push('No Supabase creds in env — reading traces from disk only.');
  }
  // Disk fallback.
  if (!existsSync(DISK_DIR)) return { traces: [], source: 'none', since };
  const traces: Trace[] = [];
  for (const f of readdirSync(DISK_DIR).filter((x) => x.endsWith('.json'))) {
    try {
      const p = JSON.parse(readFileSync(join(DISK_DIR, f), 'utf8')) as { meta?: TraceMeta; events?: TraceEvent[] };
      if (!p?.meta || !Array.isArray(p.events)) continue;
      const when = (p.meta.startedAt ?? p.meta.iso ?? '').slice(0, 10);
      if (when && when < since) continue;
      traces.push({ id: f.slice(0, 24), meta: p.meta, events: p.events });
    } catch { /* skip unparseable */ }
  }
  return { traces, source: 'disk', since };
}

// ─────────────────────────────────────────────────────────────────────────────
// Replay — rebuild board states by pushing Tyler's events through the engine.

interface LevelSegment {
  level: number;
  events: TraceEvent[];
}

function segment(events: TraceEvent[]): LevelSegment[] {
  const segs: LevelSegment[] = [];
  for (const ev of events) {
    const lv = Number(ev.level ?? 0);
    const cur = segs[segs.length - 1];
    if (!cur || cur.level !== lv) segs.push({ level: lv, events: [ev] });
    else cur.events.push(ev);
  }
  return segs;
}

/** First rookie-position hint in a segment — the start square of the level. */
function startHint(seg: LevelSegment): Coord | null {
  for (const ev of seg.events) {
    if (ev.kind === 'rookie-move' && typeof ev.from === 'string') return fromSquare(ev.from as string);
    if (ev.kind === 'ability-activate' && typeof ev.rookie === 'string') return fromSquare(ev.rookie as string);
  }
  return null;
}

interface Carry {
  abilities: BoardState['abilities'];
  tempo: number;
  pendingOffer: BoardState['pendingOffer'];
}

function buildLevelState(runId: string, iso: string, level: number, carry: Carry, seed: number, hint: Coord | null): BoardState {
  const puzzle = puzzleForDate(iso, level - 1, runId);
  let st = puzzleToBoardState(puzzle, {
    abilities: carry.abilities,
    tempo: carry.tempo,
    pendingOffer: carry.pendingOffer,
    runId,
    aiRngSeed: seed,
    // Difficulty is NOT recorded in the trace. Normal is what Tyler plays;
    // a wrong guess fails the anchors and the level reports as
    // unreconstructable rather than silently lying.
    difficulty: 'normal',
  });
  if (hint && hint.rank === st.rookie.rank) {
    const occupied = st.pieces.some((p) => p.file === hint.file && p.rank === hint.rank)
      || st.hazards.some((h) => h.file === hint.file && h.rank === hint.rank);
    if (!occupied) st = { ...st, rookie: { ...hint } };
  }
  return st;
}

function offerOption(o: { kind: string; id: string; tier: number }): AbilityOfferOption {
  return {
    kind: o.kind as 'new' | 'upgrade',
    id: o.id as AbilityId,
    tier: o.tier as AbilityTier,
    // description is display-only; applyOfferPick never reads it.
    description: { headline: '', detail: '' } as unknown as AbilityOfferOption['description'],
  };
}

interface ReplayResult {
  /** Verified decision points (state snapshots) collected while in sync. */
  decisions: Array<Omit<DecisionPoint, 'traceId' | 'runId' | 'levelCleared'>>;
  tylerActions: number; // total Tyler decisions in the segment (verified or not)
  verified: number;
  desyncAt: string | null; // why/where sync was lost, null = clean to the end
  endState: BoardState;
  cleared: boolean;
}

/**
 * Replay ONE level segment under one seed. Returns how far we stayed
 * verifiably in sync. Never throws — a broken assumption is a desync.
 *
 * Three trace realities this handles beyond naive replay:
 *  - Offer events are applied even while desynced: the recorded slate + pick
 *    are ground truth for the ability LEDGER, which must stay right for the
 *    next level's carry.
 *  - `tempo` recorded on each rookie-move is adopted, not asserted — the app
 *    spends tempo on offers/mechanics we can't always see, and the recorded
 *    value is ground truth.
 *  - RETRIES: on a loss the app rebuilds the level and Tyler plays on, with
 *    no marker in the stream. When sync breaks and the breaking event looks
 *    like a fresh level start, we rebuild and continue (max 3 restarts).
 */
function replayLevel(runId: string, iso: string, seg: LevelSegment, carry: Carry, seed: number): ReplayResult {
  const evs = seg.events;
  const decisions: ReplayResult['decisions'] = [];
  let tylerActions = 0;
  let verified = 0;
  let desyncAt: string | null = null;
  let cleared = false;
  let restartsLeft = 3;

  /** First rookie-position hint at/after index i. */
  const hintFrom = (i: number): Coord | null => {
    for (let j = i; j < evs.length; j++) {
      const ev = evs[j];
      if (ev.kind === 'rookie-move' && typeof ev.from === 'string') return fromSquare(ev.from as string);
      if (ev.kind === 'ability-activate' && typeof ev.rookie === 'string') return fromSquare(ev.rookie as string);
    }
    return null;
  };

  let st = buildLevelState(runId, iso, seg.level, carry, seed, hintFrom(0));
  let inSync = true;

  const isTylerAction = (k: string) => k === 'rookie-move' || k === 'squire-move' || k === 'ability-activate';

  const desync = (why: string, atIdx: number) => {
    if (!inSync) return;
    // Retry detection: the app rebuilds the level on a retry with NO marker.
    // If the breaking event reads like a fresh start (its rookie hint sits on
    // the start rank of a fresh build), rebuild and keep replaying.
    if (restartsLeft > 0) {
      const h = hintFrom(atIdx);
      const fresh = buildLevelState(runId, iso, seg.level, carry, seed, h);
      if (h && h.rank === fresh.rookie.rank && h.file === fresh.rookie.file) {
        restartsLeft--;
        st = fresh;
        return; // still in sync — replay continues on the rebuilt level
      }
    }
    inSync = false;
    desyncAt = why;
  };

  const ensureRookieTurn = () => {
    if (st.status === 'playing' && st.turn !== 'rookie') st = settleEnemyTurns(st);
  };

  for (let i = 0; i < evs.length; i++) {
    const ev = evs[i];
    const kind = ev.kind;
    if (kind === 'death') {
      if (inSync) {
        const snap = (ev.pieces as Array<{ type: string; sq: string }> | undefined) ?? [];
        const ours = new Set(st.pieces.map((p) => `${p.type}@${toSquare(p)}`));
        const mism = snap.filter((p) => !ours.has(`${p.type}@${p.sq}`)).length;
        if (mism > 0) { inSync = false; desyncAt = `death snapshot mismatch (${mism}/${snap.length} pieces off)`; }
      }
      continue;
    }
    if (kind === 'enemy-tick' || kind === 'ally-tick' || kind === 'drone-tick') continue; // informational

    if (kind === 'offer-pick' || kind === 'offer-skip') {
      // Applied even while desynced: the ability ledger must stay truthful
      // for the next level's carry, and the recorded slate is ground truth.
      const choices = (ev.choices as Array<{ kind: string; id: string; tier: number }> | undefined) ?? [];
      const reason = st.pendingOffer ? st.offerReason : st.moveCount === 0 ? ('level' as const) : undefined;
      st = { ...st, pendingOffer: choices.map(offerOption), ...(reason ? { offerReason: reason } : {}) };
      st = kind === 'offer-skip'
        ? applyDismissOffer(st)
        : applyOfferPick(st, offerOption(ev.option as { kind: string; id: string; tier: number }));
      continue;
    }

    if (!inSync) {
      if (isTylerAction(kind)) tylerActions++;
      continue;
    }

    ensureRookieTurn();
    if (st.status !== 'playing' && isTylerAction(kind)) {
      desync(`engine says ${st.status} but Tyler kept playing (${kind} @${i})`, i);
      if (!inSync || st.status !== 'playing') {
        tylerActions++;
        if (!inSync) continue;
      }
    }

    if (kind === 'ability-activate') {
      tylerActions++;
      const ability = ev.ability as AbilityId;
      const rookieSq = ev.rookie as string | undefined;
      if (rookieSq && rookieSq !== toSquare(st.rookie)) {
        desync(`rookie at ${toSquare(st.rookie)}, trace says ${rookieSq} (activate ${ability})`, i);
        if (!inSync) continue;
        if (rookieSq !== toSquare(st.rookie)) { inSync = false; desyncAt = `restart did not line up (activate ${ability})`; continue; }
      }
      const def = ABILITY_DEFS[ability];
      const arming = def && (def.activation === 'movement' || def.activation === 'targeted');
      let followTarget: string | null = null;
      if (arming) {
        for (let j = i + 1; j < evs.length; j++) {
          const k = evs[j].kind;
          if ((k === 'ability-move' || k === 'ability-target') && evs[j].ability === ability) {
            followTarget = evs[j].target as string;
            break;
          }
          if (k === 'rookie-move' || k === 'squire-move' || k === 'ability-activate' || k === 'offer-pick' || k === 'offer-skip' || k === 'death') break;
        }
      }
      const decisionAction: BotAction = arming && followTarget
        ? { kind: 'ability-target', abilityId: ability, target: fromSquare(followTarget) }
        : { kind: 'activate-ability', abilityId: ability };
      const next = applyAbilityActivate(st, ability);
      if (next === st) {
        desync(`activate ${ability} was a no-op in reconstruction`, i);
        continue;
      }
      if (!arming || followTarget) {
        decisions.push({ level: seg.level, moveCount: st.moveCount, enemiesLeft: st.pieces.length, state: st, tyler: decisionAction });
      }
      st = arming && !followTarget ? applyAbilityCancel(next) : next;
      verified++;
      continue;
    }

    if (kind === 'ability-move' || kind === 'ability-target') {
      const ability = ev.ability as AbilityId;
      const target = fromSquare(ev.target as string);
      if (!st.activeAbility || st.activeAbility.id !== ability) {
        desync(`cast ${ability} but no armed ability in reconstruction`, i);
        continue;
      }
      const next = kind === 'ability-move'
        ? applyAbilityMove(st, ability, target)
        : applyAbilityTargeted(st, ability, target);
      if (next === st) {
        desync(`${kind} ${ability}→${ev.target} rejected by engine`, i);
        continue;
      }
      st = next;
      // Magnet became two-step (grab, then choose landing) on 2026-09-02.
      // Legacy traces carry a single magnet ability-target event; when no
      // second one follows, auto-resolve to the farthest landing (= the old
      // fixed max-distance pull).
      if (
        ability === 'magnet' &&
        st.activeAbility?.id === 'magnet' &&
        st.activeAbility.step === 'pick-square' &&
        !(evs[i + 1]?.kind === 'ability-target' && evs[i + 1]?.ability === 'magnet')
      ) {
        const landings = abilityLegalMoves(st, 'magnet');
        const far = landings[landings.length - 1];
        st = far ? applyAbilityTargeted(st, 'magnet', far) : applyAbilityCancel(st);
      }
      continue;
    }

    if (kind === 'squire-move') {
      tylerActions++;
      const from = fromSquare(ev.from as string);
      const target = fromSquare(ev.to as string);
      const snapshot = st;
      const next = applyControlledAllyMove(st, from, target);
      if (next === st) {
        desync(`squire-move ${ev.from}→${ev.to} rejected`, i);
        continue;
      }
      if (typeof ev.enemyCount === 'number' && next.pieces.length !== ev.enemyCount) {
        desync(`squire-move enemyCount ${next.pieces.length} vs trace ${ev.enemyCount}`, i);
        continue;
      }
      decisions.push({
        level: seg.level, moveCount: snapshot.moveCount, enemiesLeft: snapshot.pieces.length, state: snapshot,
        tyler: { kind: 'squire-move', from, target },
      });
      st = typeof ev.tempo === 'number' ? { ...next, tempo: ev.tempo as number } : next;
      verified++;
      continue;
    }

    if (kind === 'rookie-move') {
      tylerActions++;
      const from = ev.from as string;
      const to = ev.to as string;
      if (from !== toSquare(st.rookie)) {
        desync(`rookie at ${toSquare(st.rookie)}, trace moves from ${from}`, i);
        if (!inSync) continue;
        if (from !== toSquare(st.rookie)) { inSync = false; desyncAt = `restart did not line up (move from ${from})`; continue; }
      }
      const target = fromSquare(to);
      const snapshot = st;
      const next = applyRookieMove(st, target);
      if (next === st) {
        desync(`move ${from}→${to} illegal in reconstruction`, i);
        continue;
      }
      // Anchors recorded WITH the move: capture type + enemy count. Tempo is
      // ADOPTED from the trace (ground truth), not asserted — the app spends
      // it on things the trace doesn't itemize.
      const cap = ev.captured as string | null;
      const grew = next.captures.length > snapshot.captures.length;
      const capType = grew ? next.captures[next.captures.length - 1] : null;
      const okCap = (cap ?? null) === (capType ?? null);
      const okEnemies = typeof ev.enemyCount !== 'number' || next.pieces.length === ev.enemyCount;
      if (!okCap || !okEnemies) {
        desync(`move ${from}→${to} anchors off (cap ${capType}/${cap}, enemies ${next.pieces.length}/${ev.enemyCount})`, i);
        continue;
      }
      decisions.push({
        level: seg.level, moveCount: snapshot.moveCount, enemiesLeft: snapshot.pieces.length, state: snapshot,
        tyler: { kind: 'move', target },
      });
      st = typeof ev.tempo === 'number' ? { ...next, tempo: ev.tempo as number } : next;
      verified++;
      if (cap === 'king' || next.status === 'won') cleared = true;
      continue;
    }
  }

  if (st.status === 'won') cleared = true;
  return { decisions, tylerActions, verified, desyncAt, endState: st, cleared };
}


/**
 * The per-attempt aiRngSeed is not in the trace. Enemy tie-breaks depend on
 * it, so we try several seeds per level and keep the replay that stays
 * verifiably in sync the longest. Honest: only in-sync decisions are used.
 */
const CANDIDATE_SEEDS = (traceId: string, level: number): number[] => [
  1, 7, 42, 1337, 99991, 20260818,
  hashString(`${traceId}:${level}`) >>> 0 || 3,
  hashString(`${traceId}:${level}:b`) >>> 0 || 5,
];

interface TraceReplay {
  trace: Trace;
  decisions: DecisionPoint[];
  tylerActions: number;
  verified: number;
  levelNotes: string[]; // desync notes, per level
  levelsCleanlyReplayed: number;
  levelsTotal: number;
}

function replayTrace(trace: Trace): TraceReplay {
  const segs = segment(trace.events);
  const decisions: DecisionPoint[] = [];
  const levelNotes: string[] = [];
  let tylerActions = 0;
  let verified = 0;
  let clean = 0;
  let carry: Carry = { abilities: [], tempo: 0, pendingOffer: null };

  for (let si = 0; si < segs.length; si++) {
    const seg = segs[si];
    let best: ReplayResult | null = null;
    for (const seed of CANDIDATE_SEEDS(trace.id, seg.level)) {
      const r = replayLevel(trace.meta.runId, trace.meta.iso, seg, carry, seed);
      if (!best || r.verified > best.verified) best = r;
      if (r.desyncAt === null) { best = r; break; } // fully clean — stop searching
    }
    if (!best) continue;
    tylerActions += best.tylerActions;
    verified += best.verified;
    if (best.desyncAt === null) clean++;
    else levelNotes.push(`L${seg.level}: sync lost after ${best.verified}/${best.tylerActions} actions — ${best.desyncAt}`);

    // Did Tyler clear this level? True when a later segment has a higher
    // level, or the engine replay saw the win, or the run was won on the
    // final recorded level.
    const nextSeg = segs[si + 1];
    const cleared = best.cleared || (nextSeg ? nextSeg.level > seg.level : trace.meta.outcome === 'won');
    for (const d of best.decisions) {
      decisions.push({ ...d, traceId: trace.id, runId: trace.meta.runId, levelCleared: cleared });
    }
    // Carry into the next level exactly like the app's goToNextLevel:
    // abilities + tempo + pendingOffer from the end state (refreshAbilityUses
    // runs inside puzzleToBoardState). If we desynced, the carried loadout
    // may be slightly off — the next level's anchors will catch it.
    carry = { abilities: best.endState.abilities, tempo: best.endState.tempo, pendingOffer: best.endState.pendingOffer };
  }

  return { trace, decisions, tylerActions, verified, levelNotes, levelsCleanlyReplayed: clean, levelsTotal: segs.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// Compare — ask T5 at every verified decision point.

function actionKey(a: BotAction): string {
  switch (a.kind) {
    case 'move': return `move:${toSquare(a.target)}`;
    case 'squire-move': return `squire:${a.from ? toSquare(a.from) : '?'}:${toSquare(a.target)}`;
    case 'activate-ability': return `cast:${a.abilityId}`;
    case 'ability-target': return `cast:${a.abilityId}:${toSquare(a.target)}`;
    case 'pick-offer': return `pick:${a.optionIndex}`;
    case 'dismiss-offer': return 'dismiss';
  }
}

function kindOf(a: BotAction): string {
  if (a.kind === 'activate-ability' || a.kind === 'ability-target') return `cast:${a.abilityId}`;
  return a.kind;
}

function compareAll(replays: TraceReplay[], bot: Bot): Comparison[] {
  const out: Comparison[] = [];
  for (const r of replays) {
    for (const d of r.decisions) {
      const ctx: BotContext = {
        excludedAbilities: new Set(),
        forcedAcceptIds: new Set(),
        forcedSkipIds: new Set(),
        rng: rngFromString(`${d.traceId}:${d.level}:${d.moveCount}`),
      };
      let botAction: BotAction;
      let reason = '';
      try {
        const dec = bot.decideWithReasoning ? bot.decideWithReasoning(d.state, ctx) : { action: bot.decide(d.state, ctx) };
        botAction = dec.action;
        reason = ('reasoning' in dec ? dec.reasoning : '') ?? '';
      } catch {
        continue;
      }
      const agree = actionKey(botAction) === actionKey(d.tyler)
        ? 'exact' as const
        : kindOf(botAction) === kindOf(d.tyler)
          ? 'same-kind' as const
          : 'disagree' as const;
      out.push({ ...d, bot: botAction, agree, botReason: reason });
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Bot-line rollout — from a disagreement, does the bot's own line clear the level?

function rolloutBotLine(start: BoardState, bot: Bot, seedStr: string, maxDecisions = 60): 'won' | 'lost' | 'undecided' {
  let st = start;
  const ctx: BotContext = {
    excludedAbilities: new Set(), forcedAcceptIds: new Set(), forcedSkipIds: new Set(),
    rng: rngFromString(seedStr),
  };
  for (let i = 0; i < maxDecisions && st.status === 'playing'; i++) {
    if (st.turn !== 'rookie') { st = settleEnemyTurns(st); continue; }
    if (st.pendingOffer) { st = applyDismissOffer(st); continue; }
    let a: BotAction;
    try { a = bot.decide(st, ctx); } catch { return 'undecided'; }
    const next = applyBotAction(st, a);
    if (next === st) return 'undecided';
    st = next;
  }
  if (st.status === 'playing' && st.turn !== 'rookie') st = settleEnemyTurns(st);
  return st.status === 'won' ? 'won' : st.status === 'lost' ? 'lost' : 'undecided';
}

// ─────────────────────────────────────────────────────────────────────────────
// Mining

function abilityTable(traces: Trace[]): AbilityRow[] {
  // Straight from raw events — no reconstruction needed, so it covers 100%
  // of casts even where replay lost sync.
  interface Acc { casts: number; levels: number[]; enemies: number[]; turns: number[]; cleared: number }
  const acc = new Map<string, Acc>();
  for (const tr of traces) {
    const segs = segment(tr.events);
    for (let si = 0; si < segs.length; si++) {
      const seg = segs[si];
      const nextSeg = segs[si + 1];
      const cleared = nextSeg ? nextSeg.level > seg.level : tr.meta.outcome === 'won';
      let movesSoFar = 0;
      for (const ev of seg.events) {
        if (ev.kind === 'rookie-move') movesSoFar++;
        if (ev.kind !== 'ability-target' && ev.kind !== 'ability-move') {
          // Instant/transform casts show up as a bare activate.
          if (ev.kind !== 'ability-activate') continue;
          const def = ABILITY_DEFS[ev.ability as AbilityId];
          if (def && (def.activation === 'movement' || def.activation === 'targeted')) continue; // counted at the cast event
        }
        const id = String(ev.ability);
        const a = acc.get(id) ?? { casts: 0, levels: [], enemies: [], turns: [], cleared: 0 };
        a.casts++;
        a.levels.push(seg.level);
        if (typeof ev.enemyCount === 'number') a.enemies.push(ev.enemyCount as number);
        a.turns.push(movesSoFar);
        if (cleared) a.cleared++;
        acc.set(id, a);
      }
    }
  }
  const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
  const rows: AbilityRow[] = [];
  for (const [ability, a] of acc) {
    const byLevel = new Map<number, number>();
    for (const lv of a.levels) byLevel.set(lv, (byLevel.get(lv) ?? 0) + 1);
    rows.push({
      ability,
      casts: a.casts,
      levels: [...byLevel.entries()].sort((x, y) => x[0] - y[0]).map(([lv, n]) => `L${lv}x${n}`).join(' '),
      avgTurn: Math.round(avg(a.turns) * 10) / 10,
      avgEnemiesLeft: Math.round(avg(a.enemies) * 10) / 10,
      clearedPct: a.casts ? Math.round((a.cleared / a.casts) * 100) : 0,
    });
  }
  return rows.sort((a, b) => b.casts - a.casts);
}

function asciiBoard(st: BoardState): string {
  const grid: string[][] = Array.from({ length: 8 }, () => Array(8).fill('.'));
  for (const h of st.hazards) grid[h.rank - 1][h.file - 1] = '#';
  for (const sq of st.frozenSquares) { const c = fromSquare(sq); grid[c.rank - 1][c.file - 1] = '*'; }
  for (const p of st.pieces) grid[p.rank - 1][p.file - 1] = p.type === 'knight' ? 'n' : p.type[0];
  for (const a of st.allies) grid[a.rank - 1][a.file - 1] = a.type === 'knight' ? 'N' : a.type[0].toUpperCase();
  grid[st.rookie.rank - 1][st.rookie.file - 1] = 'R';
  const lines: string[] = [];
  for (let r = 8; r >= 1; r--) lines.push(`${r} ${grid[r - 1].join(' ')}`);
  lines.push('  a b c d e f g h');
  return lines.join('\n');
}

function describe(a: BotAction): string {
  switch (a.kind) {
    case 'move': return `move to ${toSquare(a.target)}`;
    case 'squire-move': return `squire ${a.from ? toSquare(a.from) : ''}→${toSquare(a.target)}`;
    case 'activate-ability': return `cast ${a.abilityId}`;
    case 'ability-target': return `cast ${a.abilityId} @ ${toSquare(a.target)}`;
    case 'pick-offer': return `pick offer #${a.optionIndex}`;
    case 'dismiss-offer': return 'dismiss offer';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main analysis

export interface WatchOpts {
  days?: number;
  maxTraces?: number;
  /** Max bot-line forward rollouts at disagreement points (they're slow). */
  rollouts?: number;
  writeReport?: boolean;
}

export async function watchTyler(opts: WatchOpts = {}): Promise<TylerWatch> {
  const days = opts.days ?? 7;
  const caveats: string[] = [];
  const { traces: all, source, since } = await fetchTraces(days, caveats);
  // Only runs the engine knows; parity-driver games on a dev box are bot
  // games wearing a human label, but those never reach Supabase.
  const traces = all.filter((t) => !!getRunById(t.meta.runId)).slice(0, opts.maxTraces ?? 40);
  if (all.length !== traces.length) caveats.push(`${all.length - traces.length} trace(s) skipped (unknown run id or over --max-traces).`);

  const empty: TylerWatch = {
    since, source, tracesWatched: 0, won: 0, lost: 0, tylerActions: 0, reconstructed: 0,
    reconstructedPct: 0, compared: 0, agreeExact: 0, agreeKind: 0, agreementPct: null,
    abilityRows: [], lessons: [], topLesson: null, reportPath: null, caveats,
  };
  if (traces.length === 0) return empty;

  caveats.push(
    'The trace does not record aiRngSeed or difficulty; each level is replayed under 8 candidate seeds at Normal and only decisions the anchors verify are used. Unverified stretches are excluded, not guessed.',
  );

  const replays = traces.map(replayTrace);
  const tylerActions = replays.reduce((s, r) => s + r.tylerActions, 0);
  const reconstructed = replays.reduce((s, r) => s + r.verified, 0);

  const comparisons = compareAll(replays, T5);
  const agreeExact = comparisons.filter((c) => c.agree === 'exact').length;
  const agreeKind = comparisons.filter((c) => c.agree === 'same-kind').length;

  const abilityRows = abilityTable(traces);

  // Bot-line rollouts at the most interesting disagreements: Tyler cast an
  // ability (or made a move) on a level he went on to clear, the bot wanted
  // something else — does the bot's own line clear it from here?
  const disagreements = comparisons.filter((c) => c.agree !== 'exact');
  const interesting = [
    ...disagreements.filter((c) => (c.tyler.kind === 'ability-target' || c.tyler.kind === 'activate-ability') && c.levelCleared),
    ...disagreements.filter((c) => c.tyler.kind === 'move' && c.levelCleared && c.level >= 6),
  ].slice(0, opts.rollouts ?? 10);
  const rolled: Array<{ c: Comparison; botLine: 'won' | 'lost' | 'undecided' }> = [];
  for (const c of interesting) {
    rolled.push({ c, botLine: rolloutBotLine(c.state, T5, `${c.traceId}:${c.level}:${c.moveCount}:line`) });
  }

  // ── Lessons (mined, evidence-first) ────────────────────────────────────────
  const lessons: Lesson[] = [];

  // 1. Casts where Tyler's line cleared the level and the bot's line loses it.
  const botLineLoses = rolled.filter((r) => r.botLine !== 'won');
  if (botLineLoses.length > 0) {
    lessons.push({
      title: `${botLineLoses.length}/${rolled.length} sampled disagreements: Tyler's line cleared the level, the bot's own line from the same state did not`,
      detail: botLineLoses.map((r) =>
        `trace ${r.c.traceId} L${r.c.level} (move ${r.c.moveCount}, ${r.c.enemiesLeft} enemies): Tyler ${describe(r.c.tyler)}, bot preferred ${describe(r.c.bot)} — bot line ${r.botLine}`,
      ).join('\n'),
    });
  }

  // 2. Cast-timing pattern: does Tyler cast earlier/later than the bot casts at all?
  const tylerCasts = comparisons.filter((c) => c.tyler.kind === 'ability-target' || c.tyler.kind === 'activate-ability');
  const botWantedMoveInstead = tylerCasts.filter((c) => c.bot.kind === 'move' || c.bot.kind === 'squire-move');
  if (tylerCasts.length >= 5) {
    const pct = Math.round((botWantedMoveInstead.length / tylerCasts.length) * 100);
    if (pct >= 40) {
      const clearedShare = Math.round((tylerCasts.filter((c) => c.levelCleared).length / tylerCasts.length) * 100);
      lessons.push({
        title: `The bot under-casts: at ${pct}% of Tyler's ${tylerCasts.length} verified casts, T5 would have moved instead`,
        detail: `Tyler's casts sit on levels he cleared ${clearedShare}% of the time. The bot's rollout policy only jitters abilities into contention (+rng*3); Tyler treats a cast as the MAIN line when enemies are thick (avg ${Math.round(tylerCasts.reduce((s, c) => s + c.enemiesLeft, 0) / tylerCasts.length)} enemies on board at cast time).`,
      });
    }
  }

  // 3. Late-level charge discipline: share of casts on L>=7 vs early.
  const castsWithLevel = abilityRows.reduce((s, r) => s + r.casts, 0);
  if (castsWithLevel >= 8) {
    let late = 0; let total = 0;
    for (const tr of traces) {
      for (const ev of tr.events) {
        const isCast = ev.kind === 'ability-target' || ev.kind === 'ability-move';
        if (!isCast) continue;
        total++;
        if (Number(ev.level) >= 7) late++;
      }
    }
    if (total > 0) {
      lessons.push({
        title: `Charge discipline: ${Math.round((late / total) * 100)}% of Tyler's targeted casts land on L7+`,
        detail: `Across ${traces.length} runs, ${late}/${total} targeted casts happen on L7-L10 where the move-limit pressure is highest. The bot spends charges whenever rollouts jitter them up, with no notion of saving finishers for the levels that need them.`,
      });
    }
  }

  const agreementPct = comparisons.length ? Math.round((agreeExact / comparisons.length) * 100) : null;

  const watch: TylerWatch = {
    since, source,
    tracesWatched: traces.length,
    won: traces.filter((t) => t.meta.outcome === 'won').length,
    lost: traces.filter((t) => t.meta.outcome !== 'won').length,
    tylerActions,
    reconstructed,
    reconstructedPct: tylerActions ? Math.round((reconstructed / tylerActions) * 100) : 0,
    compared: comparisons.length,
    agreeExact,
    agreeKind,
    agreementPct,
    abilityRows,
    lessons,
    topLesson: lessons[0]?.title ?? null,
    reportPath: null,
    caveats,
  };

  if (opts.writeReport !== false) {
    watch.reportPath = writeReport(watch, replays, comparisons, rolled);
  }
  return watch;
}

// ─────────────────────────────────────────────────────────────────────────────
// Report

function writeReport(
  w: TylerWatch,
  replays: TraceReplay[],
  comparisons: Comparison[],
  rolled: Array<{ c: Comparison; botLine: 'won' | 'lost' | 'undecided' }>,
): string {
  mkdirSync(OUT_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const path = join(OUT_DIR, `${date}.md`);
  const L: string[] = [];
  L.push(`# Watching Tyler — ${date}`);
  L.push('');
  L.push(`Human traces since ${w.since} (${w.source}): **${w.tracesWatched} runs** (${w.won} won, ${w.lost} lost).`);
  L.push('');
  L.push(`## How honest is this?`);
  L.push('');
  L.push(`Traces record Tyler's actions and a few anchors (from-square, capture type, tempo, enemy counts) but NOT the per-attempt enemy RNG seed or difficulty. Each level was replayed through the real engine under 8 candidate seeds at Normal; a decision counts only while every anchor checks out. **${w.reconstructed}/${w.tylerActions} Tyler actions (${w.reconstructedPct}%) were verifiably reconstructed** — the rest are excluded, not guessed.`);
  L.push('');
  for (const c of w.caveats) L.push(`- ${c}`);
  L.push('');
  L.push(`Per-run reconstruction:`);
  L.push('');
  for (const r of replays) {
    L.push(`- \`${r.trace.id}\` ${r.trace.meta.runId} (${r.trace.meta.outcome} @ L${r.trace.meta.level}): ${r.verified}/${r.tylerActions} actions verified, ${r.levelsCleanlyReplayed}/${r.levelsTotal} levels replayed clean.`);
    for (const n of r.levelNotes.slice(0, 3)) L.push(`  - ${n}`);
  }
  L.push('');
  L.push(`## Agreement with T5`);
  L.push('');
  L.push(`At the ${w.compared} reconstructed decision points, T5 (same MCTS-160 the harness uses, Tyler's exact loadout and board): **${w.agreeExact} exact agreements (${w.agreementPct ?? '-'}%)**, ${w.agreeKind} same-kind (both moved / both cast the same ability, different square), ${w.compared - w.agreeExact - w.agreeKind} flat disagreements.`);
  L.push('');
  L.push(`## Ability usage — Tyler's frequency table`);
  L.push('');
  L.push(`From raw events (covers all casts, even unreconstructed stretches). "Cleared" = share of casts on levels Tyler went on to clear.`);
  L.push('');
  L.push(`| Ability | Casts | Levels | Avg move # at cast | Avg enemies left | Cleared |`);
  L.push(`|---|---|---|---|---|---|`);
  for (const r of w.abilityRows) {
    L.push(`| ${r.ability} | ${r.casts} | ${r.levels} | ${r.avgTurn} | ${r.avgEnemiesLeft} | ${r.clearedPct}% |`);
  }
  L.push('');
  L.push(`## Where Tyler's line beat the bot's`);
  L.push('');
  if (rolled.length === 0) {
    L.push(`No disagreement rollouts sampled (too few reconstructed disagreements).`);
  } else {
    for (const { c, botLine } of rolled) {
      L.push(`### trace \`${c.traceId}\` · ${c.runId} L${c.level} · move ${c.moveCount} · ${c.enemiesLeft} enemies left`);
      L.push('');
      L.push('```');
      L.push(asciiBoard(c.state));
      L.push('```');
      L.push('');
      L.push(`- Tyler: **${describe(c.tyler)}** (level was ${c.levelCleared ? 'CLEARED' : 'lost'})`);
      L.push(`- Bot: ${describe(c.bot)}${c.botReason ? ` — ${c.botReason}` : ''}`);
      L.push(`- Bot's own line from this state: **${botLine}**`);
      L.push('');
    }
  }
  L.push(`## Lessons`);
  L.push('');
  if (w.lessons.length === 0) L.push(`Not enough verified evidence for a lesson yet — need more traces.`);
  for (const l of w.lessons) {
    L.push(`### ${l.title}`);
    L.push('');
    L.push(l.detail);
    L.push('');
  }
  writeFileSync(path, L.join('\n'), 'utf8');
  return path;
}

// ─────────────────────────────────────────────────────────────────────────────
// A/B — full-run sims with the Tyler priors on vs off.

function abMeasure(runIds: string[], n: number): string[] {
  const out: string[] = [];
  for (const runId of runIds) {
    setTylerPriors(false);
    const off = simulateRuns({ runId }, n, 'T5', { seedPrefix: 'tyler-ab' });
    setTylerPriors(true);
    const on = simulateRuns({ runId }, n, 'T5', { seedPrefix: 'tyler-ab' });
    out.push(
      `${runId}: full clears ${off.fullClears}/${n} (priors off) → ${on.fullClears}/${n} (priors on), delta ${on.fullClears - off.fullClears >= 0 ? '+' : ''}${on.fullClears - off.fullClears}`,
    );
  }
  setTylerPriors(true);
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI

function argNum(name: string, def: number): number {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!hit) return def;
  const n = Number(hit.slice(name.length + 3));
  return Number.isFinite(n) ? n : def;
}

async function main() {
  const days = argNum('days', 7);
  const w = await watchTyler({
    days,
    maxTraces: argNum('max-traces', 40),
    rollouts: argNum('rollouts', 10),
  });
  if (process.argv.includes('--json')) {
    // Strip the heavy fields for machine consumers (the digest).
    console.log(JSON.stringify(w, null, 1));
    return;
  }
  console.log(`[learn-from-tyler] ${w.tracesWatched} runs since ${w.since} (${w.source}), ${w.won} won / ${w.lost} lost`);
  console.log(`  reconstructed ${w.reconstructed}/${w.tylerActions} Tyler actions (${w.reconstructedPct}%)`);
  console.log(`  T5 agreement at ${w.compared} decision points: ${w.agreeExact} exact (${w.agreementPct ?? '-'}%), ${w.agreeKind} same-kind`);
  for (const r of w.abilityRows) console.log(`  ${r.ability}: ${r.casts} casts (${r.levels}), avg ${r.avgEnemiesLeft} enemies left, cleared ${r.clearedPct}%`);
  for (const l of w.lessons) console.log(`  LESSON: ${l.title}`);
  if (w.reportPath) console.log(`  report -> ${w.reportPath}`);
  if (process.argv.includes('--ab')) {
    const n = argNum('ab-runs', 24);
    console.log(`[learn-from-tyler] A/B priors on vs off, ${n} runs each:`);
    for (const line of abMeasure(['revenge-1', 'crucible'], n)) console.log(`  ${line}`);
  }
}

const isCli = process.argv[1]?.includes('learn-from-tyler');
if (isCli) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
