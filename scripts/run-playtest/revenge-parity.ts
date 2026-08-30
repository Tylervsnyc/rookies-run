/**
 * Rookie's Revenge — harness vs live-app PARITY check.
 *
 * Proves the headless playtest bot plays the exact same game the real app
 * plays. For each (level, loadout) case it:
 *
 *   1. builds the harness start state exactly like revenge.ts does
 *      (puzzleToBoardState + a pinned enemy-AI seed + a pinned start file),
 *   2. opens the real app in headless Chromium against a local dev server
 *      with the dev-only `?parity=1&seed=&file=&loadout=&difficulty=` hook
 *      (app/page.tsx) so the app starts from the identical BoardState,
 *   3. lets the T5 bot decide each action on the HARNESS state, replays that
 *      action in the UI click by click (moves, ability casts, offer picks /
 *      skips), waits for the app's enemy / ally / drone phase to settle, and
 *      after EVERY ply diffs the app against the harness two ways:
 *        - the DOM (rookie sprite + square, every enemy piece + square, the
 *          king's Frozen / Stunned chip, the moves-left chip, each rack card's
 *          uses-left dots),
 *        - the app's live BoardState (mirrored to window.__rrParity by the
 *          hook): turn, status, moveCount, tempo, form, bonus moves, frozen
 *          squares, king stun, abilities, pending offer, ...
 *   4. asserts the final outcome matches (won / captured / move-limit),
 *      and records when the app's solver fail-safe ended the level early.
 *
 * Usage (dev server must be running; playwright resolved from PLAYWRIGHT_DIR):
 *   npx tsx scripts/run-playtest/revenge-parity.ts
 *     [--base=http://localhost:3011] [--cases=1:none,3:none,6:surge]
 *     [--seed=20260818] [--file=N] [--tier=T5] [--difficulty=normal]
 *     [--run=revenge-1] [--headed] [--json] [--shots=/tmp/dir]
 *
 * Exit code 1 when any case FAILs.
 */

import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

import {
  ABILITY_DEFS,
  ALL_ABILITY_IDS,
  applyDismissOffer,
  applyOfferPick,
  maxUsesForTier,
  type AbilityId,
  type AbilityTier,
  type OwnedAbility,
} from '../../lib/run/abilities';
import { isDifficultyId, type DifficultyId } from '../../lib/run/difficulty';
import { PROFILE_KEY, freshProfile } from '../../lib/run/profile';
import { getRunById } from '../../lib/run/runs';
import { puzzleForDate, puzzleToBoardState } from '../../lib/run/seed';
import { toSquare, type BoardState, type RunPuzzle } from '../../lib/run/types';
import { applyBotAction } from './bots/apply';
import { settleEnemyTurns } from './bots/t3';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import type { Bot, BotAction, BotContext } from './types';
import { hashString, rngFromString } from './utils/rng';

// ─────────────────────────────────────────────────────────────────────────────
// Args

function arg(name: string, def?: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  if (process.argv.includes(`--${name}`)) return 'true';
  return def;
}

const RUN_ID = arg('run', 'revenge-1')!;
/** Same fixed date revenge.ts uses (REVENGE_ISO) — the app gets it via ?date=. */
const ISO = '2026-08-18';
const BASE = arg('base') ?? process.env.PARITY_BASE ?? 'http://localhost:3011';
const SEED_ARG = parseInt(arg('seed', '20260818')!, 10) >>> 0 || 1;
const FILE_ARG = arg('file') ? parseInt(arg('file')!, 10) : null;
const TIER = arg('tier', 'T5')!;
const DIFFICULTY: DifficultyId = (() => {
  const d = arg('difficulty', 'normal');
  return isDifficultyId(d) ? d : 'normal';
})();
const HEADED = arg('headed') === 'true';
/**
 * Pawn promotion draws its piece type from Math.random (pawn-ai.ts
 * applyAction → promotionPool), NOT from aiRngSeed, so the harness and the
 * app roll independently. By default the driver detects that exact
 * signature (same square on rank 1, different type, a pawn just landed
 * there) and adopts the app's roll so the rest of the game can still be
 * compared; every resync is logged and counted. --strict fails instead.
 */
const STRICT = arg('strict') === 'true';
const JSON_OUT = arg('json') === 'true';
const SHOTS = arg('shots') ?? `${process.env.TMPDIR ?? '/tmp'}/revenge-parity`;
const MAX_TURNS = 300;
/** Mirrors components/run/timing.ts (not imported: that module is UI-side). */
const ENEMY_TICK_MS = 420;
const PIECE_SLIDE_MS = 320;

const DEFAULT_CASES = '1:none,3:none,4:none,6:surge,8:freeze-ray,10:knight-hop,10:bishop-step';

interface Case {
  level: number;
  loadout: string;
}

function parseCases(v: string): Case[] {
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [lv, lo] = s.split(':');
      return { level: parseInt(lv, 10), loadout: lo ?? 'none' };
    });
}

/**
 * What the app's profile will report as unlocked once we seed it with every
 * ability: profile.sanitize keeps every KNOWN id except the RETIRED ones
 * (drones). Passing the same list on the harness side keeps offer slates
 * identical. NOTE: the nightly harness passes `unlockedAbilities: undefined`
 * (= everything, drones included) — see docs/revenge-parity.md.
 */
const UNLOCKED: AbilityId[] = ALL_ABILITY_IDS.filter((id) => id !== 'drones');

// ─────────────────────────────────────────────────────────────────────────────
// Harness side — identical construction to revenge.ts startState

function loadoutFor(id: string): OwnedAbility[] {
  if (id === 'none') return [];
  const [aid, tierRaw] = id.split(':') as [AbilityId, string | undefined];
  if (!(aid in ABILITY_DEFS)) throw new Error(`unknown ability in loadout: ${id}`);
  const tier = Math.min(5, Math.max(1, parseInt(tierRaw ?? '1', 10) || 1)) as AbilityTier;
  return [{ id: aid, tier, mutations: [], usesLeftThisLevel: maxUsesForTier(aid, tier) }];
}

/** Mirror of seed.ts randomizedRookieStart's candidate list (it draws with Math.random). */
function startFiles(puzzle: RunPuzzle): number[] {
  const startRank = puzzle.rookieStart.rank;
  const occupied = new Set<number>();
  const blockersAhead = new Set<number>();
  for (const p of puzzle.pieces) {
    if (p.rank === startRank) occupied.add(p.file);
    if (p.rank > startRank && p.rank <= 8) blockersAhead.add(p.file);
  }
  for (const h of puzzle.hazards ?? []) {
    if (h.rank === startRank) occupied.add(h.file);
    if (h.rank > startRank && h.rank <= 8) blockersAhead.add(h.file);
  }
  const withBlocker = [1, 2, 3, 4, 5, 6, 7, 8].filter((f) => !occupied.has(f) && blockersAhead.has(f));
  if (withBlocker.length > 0) return withBlocker;
  const open = [1, 2, 3, 4, 5, 6, 7, 8].filter((f) => !occupied.has(f));
  return open.length > 0 ? open : [puzzle.rookieStart.file];
}

interface Start {
  state: BoardState;
  seed: number;
  file: number;
  loadout: OwnedAbility[];
}

function buildStart(c: Case): Start {
  const puzzle = puzzleForDate(ISO, c.level - 1, RUN_ID);
  const loadout = loadoutFor(c.loadout);
  // Per-case seed so every case has its own enemy tie-breaks + offer slate.
  const seed = (SEED_ARG ^ hashString(`${c.level}:${c.loadout}`)) >>> 0 || 1;
  const built = puzzleToBoardState(puzzle, {
    runId: RUN_ID,
    abilities: loadout,
    aiRngSeed: seed,
    difficulty: DIFFICULTY,
    unlockedAbilities: UNLOCKED,
  });
  const files = startFiles(puzzle);
  const file = FILE_ARG && files.includes(FILE_ARG) ? FILE_ARG : files[seed % files.length];
  return {
    state: { ...built, rookie: { file, rank: built.rookie.rank } },
    seed,
    file,
    loadout,
  };
}

function botFor(tier: string): Bot {
  return tier === 'T4' ? T4 : T5;
}

// ─────────────────────────────────────────────────────────────────────────────
// Canonical projections used for the diff

interface Projection {
  rookie: string;
  form: string;
  pieces: string[]; // "K@e8"
  allies: string[];
  drones: string[];
  turn: string;
  status: string;
  moveCount: number;
  moveLimit: number | null;
  captures: string;
  tempo: number;
  formMovesLeft: number;
  bonusMovesLeft: number;
  frozen: string[]; // "e8:2"
  kingStunTurns: number;
  shieldUp: boolean;
  decoy: string | null;
  poisoned: string[];
  rabid: string[];
  abilities: string[]; // "surge:T1:u1"
  pendingOffer: string[] | null; // "new:surge:1"
  activeAbility: string | null;
  hazards: string[];
}

function project(s: BoardState): Projection {
  const k = (p: { type: string; file: number; rank: number }) => `${letter(p.type)}@${toSquare(p)}`;
  return {
    rookie: toSquare(s.rookie),
    form: s.form,
    pieces: s.pieces.map(k).sort(),
    allies: (s.allies ?? []).map(k).sort(),
    drones: (s.drones ?? []).filter((d) => d.alive).map((d) => `D@${toSquare(d)}`).sort(),
    turn: s.turn,
    status: s.status,
    moveCount: s.moveCount,
    moveLimit: s.moveLimit,
    captures: s.captures.join(','),
    tempo: s.tempo,
    formMovesLeft: s.formMovesLeft,
    bonusMovesLeft: s.bonusMovesLeft,
    frozen: [...s.frozenSquares].map((q) => `${q}:${s.frozenTurnsLeft[q] ?? '?'}`).sort(),
    kingStunTurns: s.kingStunTurns ?? 0,
    shieldUp: s.shieldUp,
    decoy: s.decoyTarget ? `${s.decoyTarget}:${s.decoyTurnsLeft}` : null,
    poisoned: [...s.poisonedSquares].map((q) => `${q}:${s.poisonedTurnsLeft[q] ?? '?'}`).sort(),
    rabid: [...s.rabidSquares].sort(),
    abilities: s.abilities.map((a) => `${a.id}:T${a.tier}:u${a.usesLeftThisLevel}`),
    pendingOffer: s.pendingOffer ? s.pendingOffer.map((o) => `${o.kind}:${o.id}:${o.tier}`) : null,
    activeAbility: s.activeAbility ? `${s.activeAbility.id}/${s.activeAbility.step}` : null,
    hazards: s.hazards.map((h) => toSquare(h)).sort(),
  };
}

function diffProjection(exp: Projection, act: Projection, skip: Set<string> = new Set()): string[] {
  const out: string[] = [];
  for (const key of Object.keys(exp) as (keyof Projection)[]) {
    if (skip.has(key)) continue;
    const a = JSON.stringify(exp[key]);
    const b = JSON.stringify(act[key]);
    if (a !== b) out.push(`${key}: harness=${a} app=${b}`);
  }
  return out;
}

/** What the DOM must show for a given harness state. */
interface DomView {
  rookie: string | null;
  sprite: string | null;
  pieces: string[]; // "K@e8" from data-piece bK
  kingChip: string | null; // 'Frozen' | 'Stunned' | 'Capture the king' | null
  movesLeft: number | null;
  rack: string[]; // "Surge:u1"
  offerCards: number;
  lostTitle: string | null; // 'No way through.' | 'Captured.' | null
  cleared: boolean;
}

const SPRITE: Record<string, string> = { rook: 'wR', knight: 'wN', bishop: 'wB', queen: 'wQ', king: 'wK', pawn: 'wP' };
/** Piece letter as react-chessboard's data-piece uses it (knight = N). */
const LETTER: Record<string, string> = { pawn: 'P', knight: 'N', bishop: 'B', queen: 'Q', king: 'K', rook: 'R' };
const letter = (t: string) => LETTER[t] ?? t[0].toUpperCase();

/**
 * `viewStatus` is the status the APP is rendering under. It differs from the
 * harness state's status only when the app's solver fail-safe has already
 * ended the level (the harness keeps playing) — visibility rules follow the app.
 */
function expectedDom(s: BoardState, viewStatus: BoardState['status'] = s.status): Omit<DomView, 'offerCards' | 'lostTitle' | 'cleared'> {
  const king = s.pieces.find((p) => p.type === 'king');
  const kingSq = king ? toSquare(king) : null;
  const kingChip =
    viewStatus !== 'playing' || !kingSq || s.winCondition !== 'king'
      ? null
      : s.frozenSquares.includes(kingSq)
        ? 'Frozen'
        : (s.kingStunTurns ?? 0) > 0
          ? 'Stunned'
          : 'Capture the king';
  return {
    rookie: viewStatus === 'lost' ? null : toSquare(s.rookie),
    sprite: viewStatus === 'lost' ? null : SPRITE[s.form],
    pieces: s.pieces
      // On a loss the attacker standing on Rookie's square is drawn as an overlay, not a board piece.
      .filter((p) => !(viewStatus === 'lost' && p.file === s.rookie.file && p.rank === s.rookie.rank))
      .map((p) => `${letter(p.type)}@${toSquare(p)}`)
      .sort(),
    kingChip,
    movesLeft: s.winCondition === 'king' && s.moveLimit !== null ? Math.max(0, s.moveLimit - s.moveCount) : null,
    rack: s.abilities.map((a) => `${ABILITY_DEFS[a.id].name}:u${a.usesLeftThisLevel}`),
  };
}

function diffDom(s: BoardState, dom: DomView, viewStatus: BoardState['status'] = s.status): string[] {
  const exp = expectedDom(s, viewStatus);
  const out: string[] = [];
  const cmp = (k: keyof typeof exp) => {
    const a = JSON.stringify(exp[k]);
    const b = JSON.stringify(dom[k]);
    if (a !== b) out.push(`dom.${k}: expected=${a} app=${b}`);
  };
  cmp('rookie');
  cmp('sprite');
  cmp('pieces');
  cmp('kingChip');
  cmp('movesLeft');
  cmp('rack');
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Browser side

type Page = import('playwright').Page;

interface Mirror {
  state: BoardState;
  lossReason: 'unwinnable' | null;
  levelIndex: number;
}

async function readMirror(page: Page): Promise<Mirror | null> {
  return page.evaluate(() => {
    const m = (window as unknown as { __rrParity?: Mirror }).__rrParity;
    return m ? (JSON.parse(JSON.stringify(m)) as Mirror) : null;
  });
}

async function readDom(page: Page): Promise<DomView> {
  return page.evaluate(() => {
    const out: DomView = {
      rookie: null,
      sprite: null,
      pieces: [],
      kingChip: null,
      movesLeft: null,
      rack: [],
      offerCards: 0,
      lostTitle: null,
      cleared: false,
    };
    for (const el of document.querySelectorAll('[data-square]')) {
      const sq = el.getAttribute('data-square')!;
      const piece = el.querySelector('[data-piece]');
      if (!piece) continue;
      const kind = piece.getAttribute('data-piece') ?? '';
      if (kind.startsWith('w')) {
        out.rookie = sq;
        out.sprite = kind;
      } else if (kind.startsWith('b')) {
        out.pieces.push(`${kind[1]}@${sq}`);
      }
    }
    out.pieces.sort();
    const chipText = (t: string) =>
      Array.from(document.querySelectorAll('div[aria-hidden]')).some((d) => d.textContent?.trim() === t);
    for (const t of ['Frozen', 'Stunned', 'Capture the king']) {
      if (chipText(t)) {
        out.kingChip = t;
        break;
      }
    }
    const movesEl = Array.from(document.querySelectorAll('span')).find(
      (sp) => sp.textContent?.trim() === 'moves' && sp.previousElementSibling,
    );
    if (movesEl) {
      const n = parseInt(movesEl.previousElementSibling!.textContent ?? '', 10);
      if (!Number.isNaN(n)) out.movesLeft = n;
    }
    for (const b of document.querySelectorAll('button[aria-label*=" — "]')) {
      const label = b.getAttribute('aria-label') ?? '';
      const name = label.split(' — ')[0];
      const usesEl = b.querySelector('[aria-label$="uses left"]');
      let uses: number | null = null;
      if (usesEl) uses = parseInt((usesEl.getAttribute('aria-label') ?? '').split(' ')[0], 10);
      else if (b.textContent?.includes('∞')) uses = -1;
      out.rack.push(`${name}:u${uses ?? '?'}`);
    }
    out.offerCards = document.querySelectorAll('button.offer-card-enter').length;
    for (const h of document.querySelectorAll('h2')) {
      const t = h.textContent?.trim() ?? '';
      if (t === 'No way through.' || t === 'Captured.') out.lostTitle = t;
    }
    out.cleared =
      Array.from(document.querySelectorAll('h2, h1')).some((h) => /cleared/i.test(h.textContent ?? '')) ||
      Array.from(document.querySelectorAll('button')).some((b) => /replay this run/i.test(b.textContent ?? ''));
    return out;
  });
}

/**
 * Mirror + DOM in ONE evaluate so they can't straddle a state change (the
 * solver fail-safe can flip status to 'lost' a beat after control returns).
 * While the app is 'playing' but Rookie has no [data-piece] (entrance sweep,
 * Fast Refresh remount, or a loss in flight) keep polling.
 */
async function snapshot(page: Page, expectRookie: boolean): Promise<{ mirror: Mirror; dom: DomView }> {
  const t0 = Date.now();
  for (;;) {
    const m = await readMirror(page);
    const dom = await readDom(page);
    if (!m) throw new Error('parity mirror missing');
    const transitional = expectRookie && m.state.status === 'playing' && !dom.rookie;
    if (!transitional || Date.now() - t0 > 8_000) return { mirror: m, dom };
    await sleep(100);
  }
}

function sigOf(m: Mirror | null): string {
  if (!m) return '';
  const p = project(m.state);
  return JSON.stringify([p.rookie, p.form, p.pieces, p.turn, p.status, p.moveCount, p.abilities, p.pendingOffer, p.activeAbility, p.bonusMovesLeft, p.frozen, p.shieldUp, m.lossReason]);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Poll the mirror until `pred` holds (or timeout). */
async function waitFor(page: Page, pred: (m: Mirror) => boolean, timeoutMs: number, label: string): Promise<Mirror> {
  const t0 = Date.now();
  let last: Mirror | null = null;
  while (Date.now() - t0 < timeoutMs) {
    last = await readMirror(page);
    if (last && pred(last)) return last;
    await sleep(40);
  }
  throw new Error(`timeout waiting for ${label} (last: ${last ? sigOf(last).slice(0, 200) : 'no mirror'})`);
}

/** Wait until the app has left `prevSig` AND its non-Rookie phases are done. */
async function waitSettled(page: Page, prevSig: string, label: string): Promise<Mirror> {
  await waitFor(page, (m) => sigOf(m) !== prevSig, 20_000, `${label}: state change`);
  const settled = (m: Mirror) =>
    m.state.status !== 'playing' || (m.state.turn === 'rookie' && !m.state.activeAbility);
  let m = await waitFor(page, settled, 60_000, `${label}: settle`);
  // Give the solver fail-safe its beat (it arms ENEMY_TICK_MS after control
  // returns to Rookie and only fires if she pauses), then the piece slide.
  await sleep(ENEMY_TICK_MS + PIECE_SLIDE_MS + 120);
  m = await waitFor(page, settled, 60_000, `${label}: settle (post fail-safe)`);
  return m;
}

async function clickSquare(page: Page, sq: string): Promise<void> {
  await page.locator(`[data-square="${sq}"]`).first().click({ force: true });
}

async function clickRack(page: Page, id: AbilityId): Promise<void> {
  const name = ABILITY_DEFS[id].name;
  await page.locator(`button[aria-label^="${name} — "]`).first().click({ force: true });
}

async function replayAction(page: Page, before: BoardState, action: BotAction): Promise<void> {
  switch (action.kind) {
    case 'move': {
      await clickSquare(page, toSquare(before.rookie));
      await sleep(120);
      await clickSquare(page, toSquare(action.target));
      return;
    }
    case 'activate-ability': {
      await clickRack(page, action.abilityId);
      return;
    }
    case 'ability-target': {
      await clickRack(page, action.abilityId);
      await waitFor(page, (m) => m.state.activeAbility?.id === action.abilityId, 5_000, `${action.abilityId} armed`);
      await sleep(80);
      await clickSquare(page, toSquare(action.target));
      return;
    }
    default:
      return;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// One case

type Outcome = 'won' | 'captured' | 'move-limit' | 'dead-end' | 'stall' | 'unwinnable';

interface PlyLog {
  ply: number;
  action: string;
  harness: string;
  app: string;
}

interface CaseResult {
  level: number;
  loadout: string;
  seed: number;
  file: number;
  pass: boolean;
  plies: number;
  harnessOutcome: Outcome;
  appOutcome: Outcome | 'n/a';
  note: string;
  firstDivergence: { ply: number; action: string; diffs: string[] } | null;
  actions: string[];
  /** Promotion-roll resyncs applied (see STRICT). */
  resyncs: string[];
}

function outcomeOf(s: BoardState, prev: BoardState, deadEnd: boolean): Outcome {
  if (s.status === 'won') return 'won';
  if (s.status === 'lost') {
    const captured = s.pieces.some((p) => p.file === prev.rookie.file && p.rank === prev.rookie.rank);
    if (captured) return 'captured';
    if (s.moveLimit !== null && s.moveCount >= s.moveLimit) return 'move-limit';
    return 'captured';
  }
  return deadEnd ? 'dead-end' : 'stall';
}

function appOutcomeOf(m: Mirror): Outcome | 'n/a' {
  const s = m.state;
  if (s.status === 'won') return 'won';
  if (s.status === 'lost') {
    if (m.lossReason === 'unwinnable') return 'unwinnable';
    const onRookie = s.pieces.some((p) => p.file === s.rookie.file && p.rank === s.rookie.rank);
    if (onRookie) return 'captured';
    if (s.moveLimit !== null && s.moveCount >= s.moveLimit) return 'move-limit';
    return 'captured';
  }
  return 'n/a';
}

/**
 * If the ONLY difference between harness and app is the piece TYPE on
 * rank-1 squares where the harness has a freshly promoted pawn, return the
 * harness state with the app's types adopted. Otherwise null.
 */
function promotionResync(harness: BoardState, app: BoardState, before: BoardState): { state: BoardState; notes: string[] } | null {
  if (harness.pieces.length !== app.pieces.length) return null;
  const bySq = new Map(app.pieces.map((p) => [toSquare(p), p]));
  const notes: string[] = [];
  const pieces = harness.pieces.map((p) => {
    const sq = toSquare(p);
    const a = bySq.get(sq);
    if (!a) return p;
    if (a.type === p.type) return p;
    // Was this square empty (or not this piece) before the enemy turn, and
    // did a pawn have a legal landing here? Promotion happens on rank 1.
    const wasPawnThere = before.pieces.some((q) => q.type === 'pawn' && q.file === p.file && q.rank === p.rank);
    if (p.rank !== 1 || p.type === 'pawn' || a.type === 'pawn' || p.type === 'king' || a.type === 'king' || wasPawnThere) return p;
    notes.push(`promotion at ${sq}: harness rolled ${p.type}, app rolled ${a.type} (Math.random in pawn-ai applyAction) — adopting the app's roll`);
    return { ...p, type: a.type };
  });
  if (notes.length === 0) return null;
  const patched = { ...harness, pieces };
  // Everything else must now agree.
  const rest = diffProjection(project(patched), project(app));
  if (rest.length > 0) return null;
  return { state: patched, notes };
}

function describe(a: BotAction): string {
  if (a.kind === 'move') return `move ${toSquare(a.target)}`;
  if (a.kind === 'activate-ability') return `cast ${a.abilityId}`;
  if (a.kind === 'ability-target') return `cast ${a.abilityId} @${toSquare(a.target)}`;
  if (a.kind === 'pick-offer') return `pick-offer #${a.optionIndex}`;
  return 'dismiss-offer';
}

function short(s: BoardState): string {
  const k = s.pieces.find((p) => p.type === 'king');
  return `R@${toSquare(s.rookie)}(${s.form}) K@${k ? toSquare(k) : '-'} mc=${s.moveCount} t=${s.turn} ${s.status}`;
}

async function runCase(page: Page, c: Case, log: (line: string) => void): Promise<CaseResult> {
  const start = buildStart(c);
  const bot = botFor(TIER);
  const ctx: BotContext = {
    excludedAbilities: new Set(),
    forcedAcceptIds: new Set(),
    forcedSkipIds: new Set(),
    rng: rngFromString(`parity:${c.level}:${c.loadout}:${start.seed}`),
  };
  const result: CaseResult = {
    level: c.level,
    loadout: c.loadout,
    seed: start.seed,
    file: start.file,
    pass: false,
    plies: 0,
    harnessOutcome: 'stall',
    appOutcome: 'n/a',
    note: '',
    firstDivergence: null,
    actions: [],
    resyncs: [],
  };
  const plyLog: PlyLog[] = [];

  const loadoutParam = start.loadout.map((a) => `${a.id}:${a.tier}`).join(',');
  const url =
    `${BASE}/?run=${encodeURIComponent(RUN_ID)}&date=${ISO}&level=${c.level}` +
    `&parity=1&seed=${start.seed}&file=${start.file}&difficulty=${DIFFICULTY}` +
    (loadoutParam ? `&loadout=${encodeURIComponent(loadoutParam)}` : '');
  log(`\n=== L${c.level} loadout=${c.loadout} seed=${start.seed} file=${start.file}`);
  log(`    ${url}`);
  await page.goto(url, { waitUntil: 'networkidle' });
  let mirror = await waitFor(page, () => true, 15_000, 'parity mirror');

  let state = start.state;
  let prev = state;
  let deadEnd = false;
  let unwinnableAt: number | null = null;

  const compare = (m: Mirror, dom: DomView, label: string, skip?: Set<string>): string[] => {
    const viewStatus = m.lossReason === 'unwinnable' && state.status === 'playing' ? 'lost' : state.status;
    const diffs = [...diffProjection(project(state), project(m.state), skip), ...diffDom(state, dom, viewStatus)];
    plyLog.push({ ply: result.plies, action: label, harness: short(state), app: short(m.state) });
    return diffs;
  };

  const fail = async (label: string, diffs: string[]): Promise<CaseResult> => {
    result.firstDivergence = { ply: result.plies, action: label, diffs };
    result.pass = false;
    result.note = `diverged at ply ${result.plies} (${label})`;
    log(`  DIVERGENCE at ply ${result.plies} after "${label}":`);
    for (const d of diffs) log(`    - ${d}`);
    // Debug context: what the DOM holds at Rookie's expected square + every data-piece on the page.
    try {
      const dbg = await page.evaluate((sq: string) => {
        const el = document.querySelector(`[data-square="${sq}"]`);
        const pieces = Array.from(document.querySelectorAll('[data-piece]')).map(
          (p) => `${p.getAttribute('data-piece')}@${p.closest('[data-square]')?.getAttribute('data-square') ?? '?'}`,
        );
        return { sqHtml: el ? el.outerHTML.slice(0, 500) : null, pieces, h2: Array.from(document.querySelectorAll('h2')).map((h) => h.textContent) };
      }, toSquare(state.rookie));
      log(`    debug: pieces=${JSON.stringify(dbg.pieces)} h2=${JSON.stringify(dbg.h2)}`);
      log(`    debug: ${dbg.sqHtml}`);
    } catch {
      /* best effort */
    }
    try {
      mkdirSync(SHOTS, { recursive: true });
      await page.screenshot({ path: `${SHOTS}/L${c.level}-${c.loadout.replace(/[^a-z0-9-]/gi, '_')}-ply${result.plies}.png` });
    } catch {
      /* best effort */
    }
    return result;
  };

  // Ply 0 — identical start. The board plays a ~1.5s strobe-sweep entrance
  // before the real Rookie sprite is placed; wait for her to land.
  {
    const snap = await snapshot(page, true);
    mirror = snap.mirror;
    const diffs = compare(mirror, snap.dom, 'start');
    if (diffs.length) return fail('start', diffs);
    log(`  ply 0 start  ${short(state)}  ok`);
  }

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    if (state.status !== 'playing') break;

    // App-side fail-safe: the solver may have ended the level while the
    // harness would keep playing. Note it, stop replaying, finish the harness alone.
    if (mirror.state.status === 'lost' && mirror.lossReason === 'unwinnable') {
      unwinnableAt = result.plies;
      break;
    }

    // Non-Rookie phases: the app ticks them itself; headless we settle.
    if (state.turn !== 'rookie') {
      prev = state;
      state = settleEnemyTurns(state);
      continue;
    }

    if (state.pendingOffer) {
      const isLevel = state.offerReason === 'level';
      const prevSig = sigOf(mirror);
      let label: string;
      if (isLevel) {
        // The app's free level offer has no skip — take the first card on both sides.
        const opt = state.pendingOffer[0];
        label = `pick-offer ${opt.kind}:${opt.id}:${opt.tier}`;
        state = applyOfferPick(state, opt);
        await page.locator('button.offer-card-enter').nth(0).click({ force: true });
      } else {
        label = 'dismiss-offer';
        state = applyDismissOffer(state);
        await page.getByRole('button', { name: /^Skip/ }).first().click({ force: true });
      }
      result.actions.push(label);
      result.plies++;
      await waitSettled(page, prevSig, label);
      const snap = await snapshot(page, state.status !== 'lost');
      mirror = snap.mirror;
      const diffs = compare(mirror, snap.dom, label);
      if (diffs.length) return fail(label, diffs);
      log(`  ply ${result.plies} ${label.padEnd(28)} ${short(state)}  ok`);
      continue;
    }

    const action = bot.decide(state, ctx);
    const label = describe(action);
    if (action.kind === 'pick-offer' || action.kind === 'dismiss-offer') {
      // Bot asked for an offer action with no offer pending — treat as a no-op.
      deadEnd = true;
      break;
    }
    const next = applyBotAction(state, action);
    if (next === state) {
      deadEnd = true;
      break;
    }
    const prevSig = sigOf(mirror);
    const before = state;
    prev = state;
    state = next;
    result.actions.push(label);
    result.plies++;
    await replayAction(page, before, action);
    // Harness: settle the enemy / ally / drone phases the app runs on its own.
    if (state.status === 'playing' && state.turn !== 'rookie') {
      prev = state;
      state = settleEnemyTurns(state);
    }
    await waitSettled(page, prevSig, label);
    const snap = await snapshot(page, state.status !== 'lost');
    mirror = snap.mirror;
    const dom = snap.dom;
    const skip = new Set<string>();
    if (mirror.state.status === 'lost' && mirror.lossReason === 'unwinnable' && state.status === 'playing') {
      skip.add('status');
      skip.add('turn');
    }
    let diffs = compare(mirror, dom, label, skip);
    if (diffs.length && !STRICT) {
      const rs = promotionResync(state, mirror.state, prev);
      if (rs) {
        state = rs.state;
        for (const n of rs.notes) {
          log(`  WARN ply ${result.plies}: ${n}`);
          result.resyncs.push(`ply ${result.plies}: ${n}`);
        }
        diffs = [
          ...diffProjection(project(state), project(mirror.state), skip),
          ...diffDom(state, dom, skip.has('status') ? 'lost' : state.status),
        ];
      }
    }
    if (diffs.length) return fail(label, diffs);
    log(`  ply ${result.plies} ${label.padEnd(28)} ${short(state)}  ok`);
  }

  // Finish the harness alone if the app called it early.
  if (unwinnableAt !== null) {
    let guard = 0;
    while (state.status === 'playing' && guard++ < MAX_TURNS) {
      if (state.pendingOffer) {
        state = state.offerReason === 'level' ? applyOfferPick(state, state.pendingOffer[0]) : applyDismissOffer(state);
        continue;
      }
      if (state.turn !== 'rookie') {
        prev = state;
        state = settleEnemyTurns(state);
        continue;
      }
      const a = bot.decide(state, ctx);
      if (a.kind === 'pick-offer' || a.kind === 'dismiss-offer') {
        deadEnd = true;
        break;
      }
      const n = applyBotAction(state, a);
      if (n === state) {
        deadEnd = true;
        break;
      }
      prev = state;
      state = n;
    }
  }

  result.harnessOutcome = outcomeOf(state, prev, deadEnd);
  result.appOutcome = appOutcomeOf(mirror);
  const dom = await readDom(page);

  if (unwinnableAt !== null) {
    // The fail-safe is one-sided: it may only fire when NO line wins. The
    // harness bot winning from here would be a solver false positive.
    result.pass = result.harnessOutcome !== 'won';
    result.note = result.pass
      ? `app fail-safe ended level at ply ${unwinnableAt} ("No way through"); harness played on alone and ${result.harnessOutcome} — consistent`
      : `SOLVER FALSE POSITIVE: app declared unwinnable at ply ${unwinnableAt} but the harness bot then WON`;
  } else {
    const same = result.harnessOutcome === result.appOutcome;
    const modal = result.appOutcome === 'won' ? dom.cleared : dom.lostTitle === 'Captured.';
    result.pass = same && (result.appOutcome === 'n/a' ? false : true);
    if (!same) result.note = `outcome mismatch: harness=${result.harnessOutcome} app=${result.appOutcome}`;
    else if (!modal) result.note = `outcome ${result.appOutcome} matched in state; end modal not visible yet (${dom.cleared ? 'cleared' : dom.lostTitle ?? 'none'})`;
    else result.note = `outcome ${result.appOutcome} matched (state + modal)`;
    if (result.harnessOutcome === 'dead-end' || result.harnessOutcome === 'stall') {
      result.pass = false;
      result.note = `harness ended without a result (${result.harnessOutcome}); app=${result.appOutcome}`;
    }
  }
  log(`  end: harness=${result.harnessOutcome} app=${result.appOutcome} → ${result.pass ? 'PASS' : 'FAIL'} — ${result.note}`);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main

async function main(): Promise<void> {
  const cases = parseCases(arg('cases', DEFAULT_CASES)!);
  const run = getRunById(RUN_ID);
  for (const c of cases) {
    if (c.level < 1 || c.level > run.levels.length) throw new Error(`level ${c.level} out of range for ${RUN_ID}`);
  }

  const pwRoot = process.env.PLAYWRIGHT_DIR ?? '/Users/tyler.schwartz/chess-learning-tree';
  const { chromium } = createRequire(`${pwRoot}/package.json`)('playwright') as typeof import('playwright');

  // Reachability check with a clear message (the dev server is not started here).
  try {
    const r = await fetch(`${BASE}/?run=${RUN_ID}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  } catch (e) {
    console.error(`dev server not reachable at ${BASE} (${String(e)}). Start it: npx next dev --turbopack -p 3011`);
    process.exit(2);
  }

  const browser = await chromium.launch({ headless: !HEADED });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  // tsx/esbuild keeps function names by wrapping nested functions in a
  // `__name(...)` helper that doesn't exist inside page.evaluate — shim it.
  await page.addInitScript('window.__name = window.__name || ((f) => f);');
  const pageErrors: string[] = [];
  page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 300)));
  let notFound = 0;
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    // The dev recorder POSTs to /api/dev/run-live, which this repo doesn't
    // serve — one 404 per event. Count, don't list.
    if (/404/.test(m.text())) {
      notFound++;
      return;
    }
    pageErrors.push(m.text().slice(0, 300));
  });

  // Skip onboarding / intro card and seed a profile: chosen difficulty + every
  // ability unlocked (profile.sanitize drops the retired 'drones').
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const profile = { ...freshProfile(), difficulty: DIFFICULTY, unlockedAbilities: UNLOCKED };
  await page.evaluate(
    ({ iso, key, prof }) => {
      localStorage.setItem('rookies-run-onboarded', '1');
      localStorage.setItem(`rookies-run-intro-seen:${iso}`, '1');
      localStorage.setItem(key, JSON.stringify(prof));
    },
    { iso: ISO, key: PROFILE_KEY, prof: profile },
  );

  const lines: string[] = [];
  const log = (l: string) => {
    lines.push(l);
    if (!JSON_OUT) console.log(l);
  };

  const results: CaseResult[] = [];
  for (const c of cases) {
    try {
      results.push(await runCase(page, c, log));
    } catch (e) {
      log(`  ERROR: ${String(e).slice(0, 400)}`);
      results.push({
        level: c.level,
        loadout: c.loadout,
        seed: 0,
        file: 0,
        pass: false,
        plies: 0,
        harnessOutcome: 'stall',
        appOutcome: 'n/a',
        note: `driver error: ${String(e).slice(0, 200)}`,
        firstDivergence: null,
        actions: [],
        resyncs: [],
      });
    }
  }
  await browser.close();

  if (JSON_OUT) {
    console.log(JSON.stringify({ base: BASE, run: RUN_ID, iso: ISO, tier: TIER, difficulty: DIFFICULTY, results, pageErrors }, null, 1));
  } else {
    console.log('\nPARITY');
    console.log(
      ['L', 'loadout', 'seed', 'file', 'plies', 'harness', 'app', 'result'].map((h, i) => h.padEnd([3, 14, 11, 5, 6, 11, 11, 6][i])).join(' '),
    );
    for (const r of results) {
      console.log(
        [
          String(r.level).padEnd(3),
          r.loadout.padEnd(14),
          String(r.seed).padEnd(11),
          String(r.file).padEnd(5),
          String(r.plies).padEnd(6),
          r.harnessOutcome.padEnd(11),
          String(r.appOutcome).padEnd(11),
          r.pass ? (r.resyncs.length ? 'PASS*' : 'PASS') : 'FAIL',
        ].join(' ') + `  ${r.note}${r.resyncs.length ? ` [${r.resyncs.length} promotion resync]` : ''}`,
      );
    }
    if (notFound) console.log(`\n(${notFound} console 404s suppressed — /api/dev/run-live recorder endpoint is absent in this repo)`);
    if (pageErrors.length) {
      console.log(`\npage errors (${pageErrors.length}):`);
      for (const e of pageErrors.slice(0, 10)) console.log(`  ${e}`);
    }
  }
  process.exit(results.every((r) => r.pass) ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
