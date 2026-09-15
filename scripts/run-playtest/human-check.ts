/**
 * HUMAN CHECK — does the bot agree with what a human actually did?
 *
 * 2026-09-15: Tyler played all ten ladder runs on Normal. The audit graded The
 * Slash and The Alcove TOO HARD; he cleared both. The bot is a rollout search
 * that cannot plan a wall-building setup, so a level it reads 0% can be a
 * level a person clears first try. A TOO HARD like that is the bot's blind
 * spot, not the level's difficulty — this step finds those and says so.
 *
 * For every human ladder run (run_traces, READ-ONLY REST GETs):
 *   1. DEDUPE   the app posts a trace at the first death AND at run end; both
 *               carry the same meta.startedAt and the later one holds every
 *               event. Keep one per (run, startedAt). Filter by difficulty.
 *   2. READ     per level: deaths, cleared, first-try clear, the loadout held
 *               when the level was played (folded from offer picks, or the
 *               `level-start` event when present), the winning line's
 *               signature (line-signature.ts).
 *   3. REPLAY   through the real engine (learn-from-tyler.ts replayTrace):
 *               exact when `level-start` seeds exist, 8-seed guessing before.
 *               Reported as sync %, never used to invent a result.
 *   4. BOT      each first-try level at the loadout the human held, T5,
 *               ≥ 16 trials. Bot 95% upper bound < BOT_BLIND_MAX → BOT-BLIND.
 *   5. SOLVER   (--solve) the same cells: a proven forced win the bot missed
 *               is BOT-BLIND evidence too.
 *   6. REPEAT   two of L7-L10 won by the same human line → REPEAT evidence.
 *
 *   npx tsx scripts/run-playtest/human-check.ts --date=2026-09-15 [--handle=Rook-4545]
 *        [--levels=all|finale|7,8] [--trials=16] [--jobs=8] [--difficulty=normal]
 *        [--solve] [--solve-depth=7] [--solve-nodes=150000] [--no-bot] [--json]
 *
 * The nightly merge (revenge-nightly.ts --merge) runs it over the last 7 days
 * of finale levels and folds the flags into the graded ladder rows.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { LADDER_RUNG_IDS } from '../../lib/run/ladder';
import { getRunById, isKnownRunId } from '../../lib/run/runs';
import { isDifficultyId, type DifficultyId } from '../../lib/run/difficulty';
import { puzzleForDate, puzzleToBoardState } from '../../lib/run/seed';
import { replayTrace, segment, type LevelReplay, type Trace, type TraceEvent, type TraceMeta } from './learn-from-tyler';
import { assertValidLoadout, heldLoadoutKey, matrixParallel, solveParallel, type Cell, type SolveResult } from './revenge-core';
import { humanLineSignature, kingHomeOfState } from './line-signature';
import { applyBotBlind, type RungResult } from './ladder-audit';
import { BOT_BLIND_MAX, BUDGET, FINALE_LEVELS, fmtEstimate, rungGrade, wilson, type BotBlindFlag, type Estimate } from './spec';
import { todayISO, writeResult } from './results';

// ── Fetch (READ-ONLY) ───────────────────────────────────────────────────────

interface TraceRow {
  id: string;
  run_id: string;
  run_date: string;
  level: number;
  outcome: string;
  device: string | null;
  created_at: string;
  payload: { meta?: TraceMeta; events?: TraceEvent[] };
}

interface ScoreRow {
  handle: string;
  run_id: string;
  run_date: string;
  difficulty: string;
  created_at: string;
  updated_at: string;
}

/** Fill Supabase creds from the repo's .env.local when the env lacks them (local CLI). */
function loadEnvLocal(): void {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const f = join(process.cwd(), '.env.local');
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

async function restGet<T>(path: string): Promise<T> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('no Supabase creds (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  const res = await fetch(`${url}/rest/v1/${path}`, { method: 'GET', headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`GET ${path.split('?')[0]} -> ${res.status} ${(await res.text()).slice(0, 160)}`);
  return (await res.json()) as T;
}

export interface HumanTrace extends Trace {
  createdAt: string;
  /** How many posted rows this run collapsed from (2 = a retry was used). */
  posts: number;
}

/** One trace per (run, meta.startedAt) — the longest — at the wanted difficulty. */
export function dedupeTraces(rows: Array<{ id: string; created_at: string; payload: TraceRow['payload'] }>, difficulty: string | null, caveats: string[]): HumanTrace[] {
  const groups = new Map<string, HumanTrace>();
  let unknownDifficulty = 0;
  for (const r of rows) {
    const meta = r.payload?.meta;
    const events = r.payload?.events;
    if (!meta || !Array.isArray(events)) continue;
    const d = meta.difficulty ?? (events.find((e) => e.kind === 'level-start')?.difficulty as string | undefined);
    if (!d) unknownDifficulty++;
    if (difficulty && d && d !== difficulty) continue;
    const key = `${meta.runId}|${meta.startedAt ?? r.id}`;
    const prev = groups.get(key);
    const t: HumanTrace = { id: String(r.id).slice(0, 8), meta, events, createdAt: r.created_at, posts: (prev?.posts ?? 0) + 1 };
    if (!prev || events.length > prev.events.length) groups.set(key, t);
    else prev.posts = t.posts;
  }
  if (unknownDifficulty) caveats.push(`${unknownDifficulty} trace row(s) carry no difficulty; kept (pre-2026-09 traces).`);
  return [...groups.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function fetchHumanTraces(o: { date?: string; since?: string; handle?: string; difficulty?: string | null }, caveats: string[]): Promise<HumanTrace[]> {
  const when = o.date ? `run_date=eq.${o.date}` : `run_date=gte.${o.since}`;
  const rows = await restGet<TraceRow[]>(`run_traces?select=id,run_id,run_date,level,outcome,device,created_at,payload&${when}&order=created_at.asc`);
  let traces = dedupeTraces(rows, o.difficulty ?? 'normal', caveats);
  if (rows.length !== traces.length) caveats.push(`${rows.length} trace rows -> ${traces.length} runs after dedupe (retry double-posts collapsed, difficulty ${o.difficulty ?? 'normal'}).`);
  if (o.handle) {
    // Traces carry no player id yet (the device id lands with the level-start
    // events). Match a handle through run_scores: same run, trace posted
    // between the score row's creation and its last update (±3 min).
    const scores = await restGet<ScoreRow[]>(`run_scores?select=handle,run_id,run_date,difficulty,created_at,updated_at&${when}&handle=eq.${encodeURIComponent(o.handle)}`);
    const pad = 180_000;
    const before = traces.length;
    traces = traces.filter((t) => scores.some((s) =>
      s.run_id === t.meta.runId &&
      Date.parse(t.createdAt) >= Date.parse(s.created_at) - pad &&
      Date.parse(t.createdAt) <= Date.parse(s.updated_at) + pad));
    caveats.push(`handle ${o.handle}: ${traces.length}/${before} runs matched via run_scores (created_at..updated_at ±3 min).`);
  }
  return traces;
}

// ── Read one run ────────────────────────────────────────────────────────────

export interface HumanLevel {
  level: number;
  deaths: number;
  cleared: boolean;
  firstTry: boolean;
  /** Loadout the level was played with (heldLoadoutKey form). */
  arrival: string;
  /** Winning line (line-signature.ts); null when not cleared. */
  signature: string | null;
  replay?: LevelReplay;
  bot?: { loadout: string; est: Estimate; lines?: Record<string, number> };
  solver?: SolveResult;
  botBlind: boolean;
}

export interface HumanRun {
  traceId: string;
  createdAt: string;
  runId: string;
  rung: number;
  name: string;
  difficulty: DifficultyId;
  outcome: string;
  endLevel: number;
  posts: number;
  exactReplay: boolean;
  replayedPct: number;
  levels: HumanLevel[];
  /** Two finale levels won by the same human line. */
  repeats: Array<[number, number, string]>;
}

const ACTION_KINDS = new Set(['rookie-move', 'squire-move', 'ability-activate', 'ability-target', 'ability-move']);

/** Loadout held when each level was first played: `level-start` abilities, else folded offer picks. */
export function arrivalsByLevel(events: TraceEvent[]): Record<number, string> {
  const owned = new Map<string, number>();
  const out: Record<number, string> = {};
  const snap = () => heldLoadoutKey([...owned.entries()].map(([id, tier]) => ({ id, tier })));
  for (const e of events) {
    const lv = Number(e.level);
    if (e.kind === 'level-start' && out[lv] === undefined && Array.isArray(e.abilities)) {
      const held = (e.abilities as Array<{ id: string; tier: number }>).map((a) => ({ id: String(a.id), tier: Number(a.tier) || 1 }));
      // A level-start before this level's offer is taken misses the pick; the
      // fold below still overwrites on the first action, so only trust it as
      // the carried set.
      owned.clear();
      for (const h of held) owned.set(h.id, h.tier);
      continue;
    }
    if (e.kind === 'offer-pick') {
      const o = e.option as { id: string; tier: number } | undefined;
      if (o) owned.set(o.id, Number(o.tier) || 1);
      continue;
    }
    if (ACTION_KINDS.has(e.kind) && out[lv] === undefined) out[lv] = snap();
  }
  return out;
}

export function readHumanRun(t: HumanTrace): HumanRun | null {
  const runId = t.meta.runId;
  const rung = LADDER_RUNG_IDS.indexOf(runId) + 1;
  if (!rung || !isKnownRunId(runId)) return null;
  const difficulty = (isDifficultyId(String(t.meta.difficulty)) ? t.meta.difficulty : 'normal') as DifficultyId;
  const segs = segment(t.events);
  const seen = [...new Set(segs.map((s) => s.level))].sort((a, b) => a - b);
  const maxLevel = seen[seen.length - 1] ?? 0;
  const arrivals = arrivalsByLevel(t.events);
  const replay = replayTrace(t);
  const levels: HumanLevel[] = seen.map((level) => {
    const evs = t.events.filter((e) => Number(e.level) === level);
    const deaths = evs.filter((e) => e.kind === 'death').length;
    const cleared = level < maxLevel || (level === maxLevel && t.meta.outcome === 'won');
    const puzzle = puzzleForDate(t.meta.iso, level - 1, runId);
    const home = kingHomeOfState(puzzleToBoardState(puzzle, { runId, abilities: [], difficulty }));
    return {
      level,
      deaths,
      cleared,
      firstTry: cleared && deaths === 0,
      arrival: arrivals[level] ?? 'none',
      signature: cleared ? humanLineSignature(evs, home) : null,
      replay: replay.levels.find((l) => l.level === level),
      botBlind: false,
    };
  });
  const finaleWins = levels.filter((l) => FINALE_LEVELS.includes(l.level) && l.signature);
  const repeats: HumanRun['repeats'] = [];
  for (let i = 0; i < finaleWins.length; i++) for (let j = i + 1; j < finaleWins.length; j++) {
    if (finaleWins[i].signature === finaleWins[j].signature) repeats.push([finaleWins[i].level, finaleWins[j].level, finaleWins[i].signature!]);
  }
  return {
    traceId: t.id, createdAt: t.createdAt, runId, rung, name: getRunById(runId).name, difficulty,
    outcome: t.meta.outcome, endLevel: t.meta.level, posts: t.posts,
    exactReplay: replay.levels.length > 0 && replay.levels.every((l) => l.exact),
    replayedPct: replay.tylerActions ? Math.round((replay.verified / replay.tylerActions) * 100) : 0,
    levels, repeats,
  };
}

// ── The check ───────────────────────────────────────────────────────────────

export interface HumanCheckOpts {
  date?: string;
  since?: string;
  handle?: string;
  difficulty?: string | null;
  /** Levels to put against the bot; default every level. */
  levels?: number[];
  trials?: number;
  jobs?: number;
  bot?: boolean;
  solve?: { depth: number; nodes: number } | null;
  log?: (s: string) => void;
}

export interface HumanCheck {
  date: string | null;
  since: string | null;
  handle: string | null;
  trials: number;
  runs: HumanRun[];
  flags: Record<string, BotBlindFlag[]>;
  caveats: string[];
}

export async function humanCheck(o: HumanCheckOpts): Promise<HumanCheck> {
  loadEnvLocal();
  const log = o.log ?? (() => {});
  const caveats: string[] = [];
  const trials = o.trials ?? BUDGET.humanTrials;
  const traces = await fetchHumanTraces({ date: o.date, since: o.since, handle: o.handle, difficulty: o.difficulty }, caveats);
  const runs = traces.map(readHumanRun).filter((r): r is HumanRun => !!r);
  if (traces.length !== runs.length) caveats.push(`${traces.length - runs.length} run(s) are not ladder rungs — skipped.`);
  if (runs.some((r) => !r.exactReplay)) caveats.push('Traces without level-start events replay under 8 candidate seeds (sync % shown); the bot cells below do NOT depend on replay — they use the loadout folded from the recorded offer picks.');
  if (trials < 16) caveats.push(`${trials} trials/cell: a zero-win cell cannot reach the BOT-BLIND bar (needs ≥ 16).`);

  const flags: Record<string, BotBlindFlag[]> = {};
  if (o.bot !== false) {
    // One matrix call per (run, iso, difficulty); identical cells shared across runs.
    const groups = new Map<string, { runId: string; iso: string; difficulty: DifficultyId; pairs: Map<string, [number, string]> }>();
    for (const r of runs) {
      const iso = traces.find((t) => t.id === r.traceId)!.meta.iso;
      const k = `${r.runId}|${iso}|${r.difficulty}`;
      const g = groups.get(k) ?? { runId: r.runId, iso, difficulty: r.difficulty, pairs: new Map() };
      for (const l of r.levels) {
        if (!l.firstTry || (o.levels && !o.levels.includes(l.level))) continue;
        assertValidLoadout(l.arrival);
        g.pairs.set(`${l.level}:${l.arrival}`, [l.level, l.arrival]);
      }
      groups.set(k, g);
    }
    for (const g of groups.values()) {
      if (!g.pairs.size) continue;
      const cfg = { runId: g.runId, iso: g.iso, difficulty: g.difficulty };
      const t0 = Date.now();
      const cells: Cell[] = await matrixParallel(cfg, { levels: [], loadouts: [], pairs: [...g.pairs.values()], trials, tier: 'T5', realistic: false, jobs: o.jobs, signatures: true });
      log(`${g.runId}: ${cells.length} human-loadout cells × ${trials} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
      let solved: SolveResult[] = [];
      const blindCells = cells.filter((c) => wilson(c.wins, c.trials).hi < BOT_BLIND_MAX);
      if (o.solve && blindCells.length) {
        for (const lo of new Set(blindCells.map((c) => c.loadout))) {
          const lvls = blindCells.filter((c) => c.loadout === lo).map((c) => c.level);
          solved.push(...(await solveParallel(cfg, { levels: lvls, loadouts: [lo], depth: o.solve.depth, nodes: o.solve.nodes, jobs: o.jobs })));
        }
      }
      for (const r of runs.filter((x) => x.runId === g.runId && x.difficulty === g.difficulty)) {
        for (const l of r.levels) {
          const c = cells.find((x) => x.level === l.level && x.loadout === l.arrival);
          if (!c || !l.firstTry) continue;
          const est = wilson(c.wins, c.trials);
          l.bot = { loadout: c.loadout, est, lines: c.signatures };
          l.solver = solved.find((s) => s.level === l.level && s.loadout === l.arrival);
          if (est.hi < BOT_BLIND_MAX) {
            l.botBlind = true;
            (flags[r.runId] ??= []).push({
              level: l.level, source: 'human', loadout: l.arrival, bot: est,
              detail: `${o.handle ?? 'a human'} cleared first try (trace ${r.traceId}) holding ${l.arrival}; bot ${c.wins}/${c.trials} = ${fmtEstimate(est)} at that loadout`,
            });
          }
          if (l.solver?.verdict === 'forced-win' && est.hi < BOT_BLIND_MAX) {
            (flags[r.runId] ??= []).push({
              level: l.level, source: 'solver', loadout: l.arrival, bot: est,
              detail: `solver proves a forced win in ${l.solver.depth} Rookie moves at ${l.arrival}; bot ${fmtEstimate(est)}`,
            });
          }
        }
      }
    }
  }
  return { date: o.date ?? null, since: o.since ?? null, handle: o.handle ?? null, trials, runs, flags, caveats };
}

/** Fold human evidence into graded rows: BOT-BLIND flags, and human REPEATs fail check 7. */
export function applyHumanCheck(rows: RungResult[], hc: HumanCheck): RungResult[] {
  for (const row of rows) {
    const reps = hc.runs.filter((r) => r.runId === row.runId).flatMap((r) => r.repeats);
    if (reps.length) {
      row.humanRepeats = reps;
      row.checks.repeat = false;
    }
    applyBotBlind(row, hc.flags[row.runId] ?? []);
    row.grade = rungGrade(row.checks);
  }
  return rows;
}

export function summarizeHumanCheck(hc: HumanCheck): string {
  const won = hc.runs.filter((r) => r.outcome === 'won').length;
  const first = hc.runs.reduce((a, r) => a + r.levels.filter((l) => l.bot).length, 0);
  const blind = Object.entries(hc.flags).map(([id, fs]) => `${id} L${[...new Set(fs.map((f) => f.level))].join('/')}`);
  const reps = hc.runs.filter((r) => r.repeats.length).map((r) => `${r.runId} ${r.repeats.map(([a, b]) => `L${a}=L${b}`).join(',')}`);
  return `${hc.runs.length} human ladder runs (${won} won); ${first} first-try clears vs bot at ${hc.trials} trials; BOT-BLIND ${blind.join('; ') || 'none'}; human REPEAT ${reps.join('; ') || 'none'}`;
}

export function fileHumanCheck(hc: HumanCheck, jobs?: number): string {
  return writeResult(
    {
      experiment: hc.handle ? `human-check-${hc.handle}` : 'human-check',
      date: hc.date ?? todayISO(),
      budget: { trials: hc.trials, ...(jobs ? { jobs } : {}), seed: 'matrix per (run,level,human loadout,trial)' },
      conclusion: summarizeHumanCheck(hc),
      doc: 'docs/LADDER-SPEC.md',
    },
    hc,
  );
}

export function fmtHumanRun(r: HumanRun): string[] {
  const L: string[] = [];
  const deaths = r.levels.reduce((a, l) => a + l.deaths, 0);
  L.push(`rung ${r.rung} ${r.runId} ${r.name} — ${r.outcome === 'won' ? 'WON' : `LOST at L${r.endLevel}`}, ${deaths} death${deaths === 1 ? '' : 's'} (trace ${r.traceId}, ${r.posts} post${r.posts === 1 ? '' : 's'}, replay ${r.exactReplay ? 'exact' : 'seed-guessed'} ${r.replayedPct}% in sync)`);
  for (const l of r.levels) {
    const bot = l.bot ? `bot ${l.bot.est.wins}/${l.bot.est.n} ${fmtEstimate(l.bot.est)}` : l.firstTry ? 'bot -' : '';
    const solver = l.solver ? ` solver ${l.solver.verdict}${l.solver.depth ? `@${l.solver.depth}` : ''}` : '';
    L.push(`  L${String(l.level).padStart(2)} ${l.cleared ? (l.firstTry ? 'first try' : `cleared after ${l.deaths} death${l.deaths === 1 ? '' : 's'}`) : 'LOST'} · holding ${l.arrival} · ${bot}${solver}${l.botBlind ? ' · BOT-BLIND' : ''}${l.signature && l.level >= 7 ? ` · line ${l.signature}` : ''}`);
  }
  for (const [a, b, sig] of r.repeats) L.push(`  REPEAT L${a} = L${b}: ${sig}`);
  return L;
}

// ── CLI ─────────────────────────────────────────────────────────────────────

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

if (require.main === module) {
  (async () => {
    const lv = arg('levels');
    const levels = !lv || lv === 'all' ? undefined : lv === 'finale' ? [...FINALE_LEVELS] : lv.split(',').map(Number);
    const jobs = Number(arg('jobs') ?? 8);
    const hc = await humanCheck({
      date: arg('date') ?? (arg('since') ? undefined : todayISO()),
      since: arg('since'),
      handle: arg('handle'),
      difficulty: arg('difficulty') ?? 'normal',
      levels,
      trials: Number(arg('trials') ?? BUDGET.humanTrials),
      jobs,
      bot: !process.argv.includes('--no-bot'),
      solve: process.argv.includes('--solve') ? { depth: Number(arg('solve-depth') ?? BUDGET.ceiling.depth), nodes: Number(arg('solve-nodes') ?? BUDGET.ceiling.nodes) } : null,
      log: (s) => console.error(`[human-check] ${s}`),
    });
    if (process.argv.includes('--json')) {
      console.log(JSON.stringify(hc, null, 1));
      return;
    }
    for (const r of hc.runs) console.log(fmtHumanRun(r).join('\n'));
    for (const c of hc.caveats) console.log(`note: ${c}`);
    console.log(`\n${summarizeHumanCheck(hc)}`);
    if (!process.argv.includes('--no-file')) console.log(`filed: ${fileHumanCheck(hc, jobs)}`);
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
