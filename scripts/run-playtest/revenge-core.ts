/**
 * Rookie's Revenge playtest engine — the reusable half of revenge.ts.
 *
 * Everything here is a pure function of an explicit `RevengeCfg` (run id,
 * difficulty mode, optional puzzle overrides) so the nightly orchestrator,
 * the one-off CLI (revenge.ts) and any experiment can share one
 * implementation. revenge.ts is the CLI + worker entry; this file never
 * touches process.argv and never runs anything at import time.
 *
 *   matrix cell  — runMatrixCell(cfg, level, loadout, trials, tier, realistic)
 *   full run     — simulateRuns(cfg, n, tier)
 *   solver       — solveLevel(cfg, level, loadout, depth, nodes)
 *   parallel     — matrixParallel / solveParallel spawn revenge.ts workers
 */

import { spawn } from 'node:child_process';
import * as os from 'node:os';
import { join } from 'node:path';

import {
  applyDismissOffer,
  applyOfferPick,
  maxUsesForTier,
  refreshAbilityUses,
  type AbilityId,
  type AbilityTier,
  type OwnedAbility,
} from '../../lib/run/abilities';
import { REVENGE_ABILITY_CATALOG, REVENGE_CORE, getRunById } from '../../lib/run/runs';
import { isBuilt } from '../../lib/content/pipeline';
import { puzzleForDate, puzzleToBoardState } from '../../lib/run/seed';
import type { DifficultyId } from '../../lib/run/difficulty';
import type { BoardState, RunPuzzle } from '../../lib/run/types';
import { applyBotAction } from './bots/apply';
import { legalCandidates, type ActionCandidate } from './bots/shared';
import { settleEnemyTurns } from './bots/t3';
import { createMctsBot } from './bots/mcts';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import type { Bot, BotAction, BotContext } from './types';
import { rngFromString } from './utils/rng';

export const REVENGE_ISO = '2026-08-18';
export const MAX_TURNS = 300;
/** Every BUILT ability (testing|approved|live in the registry) — content in testing gets graded nightly too. */
export const ALL_LOADOUTS: ReadonlyArray<string> = ['none', ...REVENGE_ABILITY_CATALOG.filter((id) => isBuilt(id))];
export const FINISHERS: ReadonlyArray<string> = REVENGE_CORE;

export interface RevengeCfg {
  runId: string;
  /** Difficulty mode applied via puzzleToBoardState (undefined = authored). */
  difficulty?: DifficultyId;
  /** Per-level puzzle overrides (1-based) — used by experiments/mutations. */
  puzzles?: Partial<Record<number, RunPuzzle>>;
  iso?: string;
  /**
   * Restrict the OFFER pool to these ability ids (the player's unlocked set —
   * e.g. the 3 starters). Undefined = every ability the run allows.
   */
  pool?: AbilityId[];
}

export type FailMode = 'won' | 'captured' | 'move-limit' | 'stall' | 'dead-end';

export interface GameResult {
  win: boolean;
  failMode: FailMode;
  moves: number;
  usedAbility: boolean;
  offersSeen: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Level + loadout builders

export function levelCountFor(runId: string): number {
  return getRunById(runId).levels.length;
}

export function puzzleFor(cfg: RevengeCfg, level: number): RunPuzzle {
  const override = cfg.puzzles?.[level];
  if (override) return override;
  return puzzleForDate(cfg.iso ?? REVENGE_ISO, level - 1, cfg.runId);
}

/** The tier a player realistically holds by this level (T1 on L1–3 … T4 on L10). */
export function realisticTierFor(level: number): AbilityTier {
  return Math.min(5, 1 + Math.floor((level - 1) / 3)) as AbilityTier;
}

/**
 * `id` is normally a single ability id ("twin"). It may also be a `+`-joined
 * compound ("summon-knight+swap") to give the loadout MULTIPLE abilities at
 * once — needed to measure a support card (swap/sacrifice/knighting) paired
 * with the summon it operates on, since matrix mode otherwise only ever
 * grants one owned ability per cell.
 */
export function loadoutFor(id: string, level: number, realistic: boolean): OwnedAbility[] {
  if (id === 'none') return [];
  const defaultTier = realistic ? realisticTierFor(level) : 1;
  return id.split('+').map((part) => {
    // `part` may pin a tier: "magnet:5" / "sacrifice:2" (overrides --realistic).
    const [rawId, rawTier] = part.split(':');
    const aid = rawId as AbilityId;
    const pinned = rawTier ? parseInt(rawTier, 10) : NaN;
    const tier = (pinned >= 1 && pinned <= 5 ? pinned : defaultTier) as AbilityTier;
    return { id: aid, tier, mutations: [], usesLeftThisLevel: maxUsesForTier(aid, tier) };
  });
}

export function startState(
  cfg: RevengeCfg,
  level: number,
  abilities: OwnedAbility[],
  seed: string,
): BoardState {
  const puzzle = puzzleFor(cfg, level);
  const rng = rngFromString(seed);
  const s = puzzleToBoardState(puzzle, {
    runId: cfg.runId,
    abilities,
    aiRngSeed: (Math.floor(rng() * 0xffffffff) >>> 0) || 1,
    ...(cfg.difficulty ? { difficulty: cfg.difficulty } : {}),
    ...(cfg.pool ? { unlockedAbilities: cfg.pool } : {}),
  });
  return { ...s, abilities: refreshAbilityUses(s.abilities) };
}

// ─────────────────────────────────────────────────────────────────────────────
// Bots

/** T6 = the harness's own heavier MCTS (320 rollouts) — the "strongest bot". */
export const T6: Bot = createMctsBot({ id: 'T5', name: 'T6 Revenge (MCTS-320)', rolloutCount: 320 });

export function botFor(tier: string): Bot {
  if (tier === 'T4') return T4;
  if (tier === 'T6') return T6;
  return T5;
}

// ─────────────────────────────────────────────────────────────────────────────
// One game with an offer policy.

export type OfferPolicy = 'dismiss' | 'random' | 'bot';

export function playGame(
  start: BoardState,
  bot: Bot,
  seed: string,
  offerPolicy: OfferPolicy,
  onPick?: (id: AbilityId) => void,
): { result: GameResult; final: BoardState } {
  const rng = rngFromString(seed + ':bot');
  const ctx: BotContext = {
    excludedAbilities: new Set(),
    forcedAcceptIds: new Set(),
    forcedSkipIds: new Set(),
    rng,
  };
  let state = start;
  let prev = state;
  let usedAbility = false;
  let offersSeen = 0;
  let lastOffer: BoardState['pendingOffer'] = null;
  const usesBefore = () => state.abilities.map((a) => a.usesLeftThisLevel).join(',');

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    if (state.status !== 'playing') break;
    if (state.pendingOffer) {
      if (state.pendingOffer !== lastOffer) {
        offersSeen++;
        lastOffer = state.pendingOffer;
      }
      if (offerPolicy === 'dismiss') {
        state = applyDismissOffer(state);
      } else if (offerPolicy === 'random') {
        const opt = state.pendingOffer[Math.floor(rng() * state.pendingOffer.length)];
        if (opt) {
          onPick?.(opt.id);
          state = applyOfferPick(state, opt);
        } else state = applyDismissOffer(state);
      } else {
        const a = bot.decide(state, ctx);
        if (a.kind === 'pick-offer' && state.pendingOffer[a.optionIndex]) {
          const opt = state.pendingOffer[a.optionIndex];
          onPick?.(opt.id);
          state = applyOfferPick(state, opt);
        } else state = applyDismissOffer(state);
      }
      continue;
    }
    if (state.turn !== 'rookie') {
      prev = state;
      state = settleEnemyTurns(state);
      continue;
    }
    const before = usesBefore();
    const action: BotAction = bot.decide(state, ctx);
    prev = state;
    state = applyBotAction(state, action);
    if (usesBefore() !== before) usedAbility = true;
    if (state === prev) break; // no-op → dead end
  }

  let failMode: FailMode;
  if (state.status === 'won') failMode = 'won';
  else if (state.status === 'lost') {
    const captured = state.pieces.some(
      (p) => p.file === prev.rookie.file && p.rank === prev.rookie.rank,
    );
    if (captured) failMode = 'captured';
    else if (state.moveLimit !== null && state.moveCount >= state.moveLimit) failMode = 'move-limit';
    else failMode = 'captured';
  } else if (state.turn === 'rookie' && state.status === 'playing' && state === prev) {
    failMode = 'dead-end';
  } else failMode = 'stall';

  return {
    result: {
      win: state.status === 'won',
      failMode,
      moves: state.moveCount,
      usedAbility,
      offersSeen,
    },
    final: state,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// matrix

export interface Cell {
  level: number;
  loadout: string;
  trials: number;
  wins: number;
  captured: number;
  stall: number;
  moveLimit: number;
  deadEnd: number;
  usedAbility: number;
  avgMoves: number;
}

export function winPct(c: Cell): number {
  return c.trials ? Math.round((c.wins / c.trials) * 100) : 0;
}

export function runMatrixCell(
  cfg: RevengeCfg,
  level: number,
  loadout: string,
  trials: number,
  tier: string,
  realistic: boolean,
  seedPrefix = 'revenge',
): Cell {
  const bot = botFor(tier);
  const cell: Cell = {
    level, loadout, trials, wins: 0, captured: 0, stall: 0, moveLimit: 0, deadEnd: 0, usedAbility: 0, avgMoves: 0,
  };
  let moves = 0;
  for (let t = 0; t < trials; t++) {
    const seed = `${seedPrefix}:${level}:${loadout}:${t}`;
    const start = startState(cfg, level, loadoutFor(loadout, level, realistic), seed);
    const { result } = playGame(start, bot, seed, 'dismiss');
    if (result.win) cell.wins++;
    else if (result.failMode === 'captured') cell.captured++;
    else if (result.failMode === 'stall') cell.stall++;
    else if (result.failMode === 'move-limit') cell.moveLimit++;
    else cell.deadEnd++;
    if (result.usedAbility) cell.usedAbility++;
    moves += result.moves;
  }
  cell.avgMoves = moves / Math.max(1, trials);
  return cell;
}

// ─────────────────────────────────────────────────────────────────────────────
// runs — full run, random level picks

export interface RunsRow {
  level: number;
  reached: number;
  cleared: number;
  clearRate: number | null;
  losses: Record<string, number>;
}

export interface RunsReport {
  tier: string;
  runs: number;
  fullClears: number;
  rows: RunsRow[];
  pickCounts: Record<string, number>;
  seconds: number;
  /** Offer pool the sim rolled from (undefined = every ability the run allows). */
  unlockedAbilities?: string[];
  /** Retries per level the sim allowed (0 = none). */
  retriesPerLevel?: number;
  /** Total retries actually used across all runs. */
  retriesUsed?: number;
  /** Deaths per level INCLUDING the ones a retry rescued. */
  deathsAt?: Record<number, number>;
}

export interface RunsOpts {
  /** Restrict the offer pool like the app does for a player's profile (e.g. the 3 starters). */
  unlockedAbilities?: string[];
  /** Retries per level, like the app's difficulty modes (Infinity is capped at MAX_RETRIES). */
  retriesPerLevel?: number;
  seedPrefix?: string;
}

/** Cap for "unlimited" retries so an unwinnable level can't spin forever (a real player gives up long before this). */
export const MAX_RETRIES = 5;

export function simulateRuns(cfg: RevengeCfg, n: number, tier: string, opts: RunsOpts = {}): RunsReport {
  const bot = botFor(tier);
  const total = levelCountFor(cfg.runId);
  const reached: number[] = new Array(total + 1).fill(0);
  const cleared: number[] = new Array(total + 1).fill(0);
  const pickCounts: Record<string, number> = {};
  const lossAt: Record<number, Record<string, number>> = {};
  const deathsAt: Record<number, number> = {};
  const retries = Math.min(MAX_RETRIES, Math.max(0, opts.retriesPerLevel ?? 0));
  const prefix = opts.seedPrefix ?? 'revenge-run';
  const unlocked = opts.unlockedAbilities ? ([...opts.unlockedAbilities] as NonNullable<BoardState['unlockedAbilities']>) : undefined;
  let retriesUsed = 0;
  const t0 = Date.now();
  for (let r = 0; r < n; r++) {
    let abilities: OwnedAbility[] = [];
    let tempo = 0;
    let pending: BoardState['pendingOffer'] = null;
    for (let lv = 1; lv <= total; lv++) {
      reached[lv]++;
      let won = false;
      let attempt = 0;
      const puzzle = puzzleFor(cfg, lv);
      // Retry loop — the app rebuilds the SAME level with a fresh seed + start
      // file, carrying the abilities / tempo / pending offer Rookie died with.
      for (;;) {
        const seed = `${prefix}:${r}:${lv}${attempt ? `:retry${attempt}` : ''}`;
        const rng = rngFromString(seed);
        const start = puzzleToBoardState(puzzle, {
          runId: cfg.runId,
          abilities,
          tempo,
          pendingOffer: pending,
          aiRngSeed: (Math.floor(rng() * 0xffffffff) >>> 0) || 1,
          ...(unlocked ? { unlockedAbilities: unlocked } : {}),
          ...(cfg.difficulty ? { difficulty: cfg.difficulty } : {}),
        });
        const { result, final } = playGame(start, bot, seed, 'random', (id) => {
          pickCounts[id] = (pickCounts[id] ?? 0) + 1;
        });
        abilities = final.abilities;
        tempo = final.tempo;
        pending = final.pendingOffer;
        if (result.win) { won = true; break; }
        deathsAt[lv] = (deathsAt[lv] ?? 0) + 1;
        if (attempt >= retries) {
          lossAt[lv] = lossAt[lv] ?? {};
          lossAt[lv][result.failMode] = (lossAt[lv][result.failMode] ?? 0) + 1;
          break;
        }
        attempt++;
        retriesUsed++;
      }
      if (!won) break;
      cleared[lv]++;
    }
  }
  const rows: RunsRow[] = [];
  for (let lv = 1; lv <= total; lv++) {
    rows.push({
      level: lv,
      reached: reached[lv],
      cleared: cleared[lv],
      clearRate: reached[lv] ? Math.round((cleared[lv] / reached[lv]) * 100) : null,
      losses: lossAt[lv] ?? {},
    });
  }
  return {
    tier,
    runs: n,
    fullClears: cleared[total],
    rows,
    pickCounts,
    seconds: Math.round((Date.now() - t0) / 1000),
    ...(unlocked ? { unlockedAbilities: [...unlocked] } : {}),
    retriesPerLevel: retries,
    retriesUsed,
    deathsAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// solve — AND-OR forced-capture search

export interface SolveResult {
  level: number;
  loadout: string;
  verdict: 'forced-win' | 'no-forced-win' | 'unknown';
  depth: number | null;
  nodes: number;
}

function stateKey(s: BoardState): string {
  const pcs = s.pieces.map((p) => `${p.type[0]}${p.file}${p.rank}`).sort().join('');
  const al = (s.allies ?? []).map((a) => `${a.type[0]}${a.file}${a.rank}`).sort().join('');
  const fz = s.frozenSquares.map((q) => `${q}${s.frozenTurnsLeft[q]}`).sort().join('');
  const po = s.poisonedSquares.map((q) => `${q}${s.poisonedTurnsLeft[q]}`).sort().join('');
  const dc = s.decoyTarget ? `${s.decoyTarget}${s.decoyTurnsLeft}` : '';
  const ab = s.abilities.map((a) => `${a.id[0]}${a.tier}${a.usesLeftThisLevel}`).join('');
  return `${s.rookie.file}${s.rookie.rank}|${s.form[0]}${s.formMovesLeft}|${s.bonusMovesLeft}|${s.kingStunTurns ?? 0}|${pcs}|${al}|${fz}|${po}|${dc}|${ab}|${s.turn[0]}`;
}

/** Strip tempo/offers so the proof doesn't lean on extra picks. */
function neutral(s: BoardState): BoardState {
  if (!s.pendingOffer && s.tempo === 0) return s;
  let n = s;
  if (n.pendingOffer) n = applyDismissOffer(n);
  return { ...n, tempo: 0 };
}

const ENEMY_SEEDS = [1, 7, 13, 101, 977, 4242];

function enemyResponses(s: BoardState): BoardState[] {
  const out: BoardState[] = [];
  const seen = new Set<string>();
  for (const seed of ENEMY_SEEDS) {
    const r = neutral(settleEnemyTurns({ ...s, aiRngSeed: seed }));
    const k = stateKey(r) + `|${r.status}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
}

function candidateToAction(c: ActionCandidate): BotAction {
  if (c.kind === 'move') return { kind: 'move', target: c.target! };
  if (c.kind === 'squire-move') return { kind: 'squire-move', target: c.target!, ...(c.from ? { from: c.from } : {}) };
  if (c.kind === 'activate-ability') return { kind: 'activate-ability', abilityId: c.abilityId! };
  return { kind: 'ability-target', abilityId: c.abilityId!, target: c.target! };
}

function orderCandidates(s: BoardState, cands: ActionCandidate[]): ActionCandidate[] {
  const king = s.pieces.find((p) => p.type === 'king');
  const score = (c: ActionCandidate): number => {
    if ((c.kind === 'move' || c.kind === 'squire-move') && king && c.target!.file === king.file && c.target!.rank === king.rank) return 1000;
    if (c.kind !== 'move' && c.kind !== 'squire-move') return 50;
    const cap = s.pieces.some((p) => p.file === c.target!.file && p.rank === c.target!.rank);
    let v = cap ? 30 : 0;
    if (king) {
      const d = Math.max(Math.abs(king.file - c.target!.file), Math.abs(king.rank - c.target!.rank));
      v += 8 - d;
    }
    return v;
  };
  return [...cands].sort((a, b) => score(b) - score(a));
}

/** Every rank-1 file Rookie could be spawned on for this level (superset of
 *  randomizedRookieStart's pick — conservative). */
export function startFilesFor(puzzle: RunPuzzle): number[] {
  const occupied = new Set(puzzle.pieces.filter((p) => p.rank === 1).map((p) => p.file));
  for (const h of puzzle.hazards ?? []) if (h.rank === 1) occupied.add(h.file);
  const blockersAhead = new Set(puzzle.pieces.filter((p) => p.rank > 1).map((p) => p.file));
  for (const h of puzzle.hazards ?? []) if (h.rank > 1) blockersAhead.add(h.file);
  const withBlocker = [1, 2, 3, 4, 5, 6, 7, 8].filter((f) => !occupied.has(f) && blockersAhead.has(f));
  if (withBlocker.length > 0) return withBlocker;
  return [1, 2, 3, 4, 5, 6, 7, 8].filter((f) => !occupied.has(f));
}

/** Worst case over every possible start file. */
export function solveLevel(
  cfg: RevengeCfg,
  level: number,
  loadout: string,
  maxDepth: number,
  nodeBudget: number,
): SolveResult {
  const files = startFilesFor(puzzleFor(cfg, level));
  let worst: SolveResult | null = null;
  let totalNodes = 0;
  for (const f of files) {
    const r = solveLevelFrom(cfg, level, loadout, maxDepth, nodeBudget, f);
    totalNodes += r.nodes;
    const rank = (v: SolveResult['verdict']) => (v === 'forced-win' ? 2 : v === 'unknown' ? 1 : 0);
    if (!worst || rank(r.verdict) < rank(worst.verdict) || (r.verdict === worst.verdict && (r.depth ?? 0) > (worst.depth ?? 0))) {
      worst = r;
    }
  }
  return { ...(worst as SolveResult), nodes: totalNodes };
}

function solveLevelFrom(
  cfg: RevengeCfg,
  level: number,
  loadout: string,
  maxDepth: number,
  nodeBudget: number,
  startFile: number,
): SolveResult {
  const abilities = loadoutFor(loadout, level, false);
  const raw = startState(cfg, level, abilities, `solve:${level}:${loadout}`);
  const start = neutral({ ...raw, rookie: { file: startFile, rank: raw.rookie.rank } });
  let nodes = 0;
  const memo = new Map<string, boolean | null>();

  const search = (s: BoardState, depth: number, freeChain: number): boolean | null => {
    if (s.status === 'won') return true;
    if (s.status === 'lost') return false;
    if (depth === 0) return false;
    if (nodes++ > nodeBudget) return null;
    if (s.turn !== 'rookie') {
      const responses = enemyResponses(s);
      let unknown = false;
      for (const r of responses) {
        const v = search(r, depth, 0);
        if (v === false) return false;
        if (v === null) unknown = true;
      }
      return unknown ? null : true;
    }
    const key = `${stateKey(s)}@${depth}`;
    const hit = memo.get(key);
    if (hit !== undefined) return hit;
    memo.set(key, false);
    const cands = orderCandidates(s, legalCandidates(s, new Set()));
    let unknown = false;
    for (const c of cands) {
      if (c.kind !== 'move' && freeChain >= 4) continue;
      const action = candidateToAction(c);
      const next0 = applyBotAction(s, action);
      if (next0 === s) continue;
      const next = neutral(next0);
      const isMove = c.kind === 'move' || next.moveCount > s.moveCount;
      const nd = isMove ? depth - 1 : depth;
      const v = search(next, nd, isMove ? 0 : freeChain + 1);
      if (v === true) {
        memo.set(key, true);
        return true;
      }
      if (v === null) unknown = true;
    }
    const res = unknown ? null : false;
    memo.set(key, res);
    return res;
  };

  for (let d = 1; d <= maxDepth; d++) {
    memo.clear();
    nodes = 0;
    const v = search(start, d, 0);
    if (v === true) return { level, loadout, verdict: 'forced-win', depth: d, nodes };
    if (v === null) return { level, loadout, verdict: 'unknown', depth: d, nodes };
  }
  return { level, loadout, verdict: 'no-forced-win', depth: maxDepth, nodes };
}

// ─────────────────────────────────────────────────────────────────────────────
// Parallel drivers — shard (level, loadout) pairs across CPUs by spawning
// revenge.ts in worker mode. Only the CLI run id / difficulty travel across
// the process boundary, so puzzle overrides (experiments) must run in-process.

const WORKER = join(__dirname, 'revenge.ts');

export function defaultJobs(requested?: number): number {
  return Math.max(1, Math.min(os.cpus().length - 1, requested ?? 8));
}

function runWorker<T>(args: string[]): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const child = spawn('npx', ['tsx', WORKER, ...args], { stdio: ['ignore', 'pipe', 'inherit'] });
    let out = '';
    child.stdout.on('data', (d) => (out += d.toString()));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(`revenge worker exit ${code} (${args.slice(0, 2).join(' ')})`));
      try {
        resolve(JSON.parse(out) as T);
      } catch (e) {
        reject(e);
      }
    });
  });
}

function shard<T>(items: T[], n: number): T[][] {
  const out: T[][] = Array.from({ length: n }, () => []);
  items.forEach((it, i) => out[i % n].push(it));
  return out.filter((s) => s.length > 0);
}

export interface MatrixOpts {
  levels: number[];
  loadouts: string[];
  trials: number;
  tier: string;
  realistic: boolean;
  jobs?: number;
}

export async function matrixParallel(cfg: RevengeCfg, opts: MatrixOpts): Promise<Cell[]> {
  if (cfg.puzzles) throw new Error('matrixParallel cannot ship puzzle overrides to workers — run in-process');
  const jobs: string[] = [];
  for (const lv of opts.levels) for (const lo of opts.loadouts) jobs.push(`${lv}:${lo}`);
  const shards = shard(jobs, defaultJobs(opts.jobs));
  const all = await Promise.all(
    shards.map((s) =>
      runWorker<Cell[]>([
        'matrix',
        '--worker',
        `--pairs=${s.join(',')}`,
        `--trials=${opts.trials}`,
        `--tier=${opts.tier}`,
        `--run=${cfg.runId}`,
        ...(opts.realistic ? ['--realistic'] : []),
        ...(cfg.difficulty ? [`--difficulty=${cfg.difficulty}`] : []),
        ...(cfg.iso ? [`--iso=${cfg.iso}`] : []),
      ]),
    ),
  );
  const cells = all.flat();
  cells.sort((a, b) => a.level - b.level || a.loadout.localeCompare(b.loadout));
  return cells;
}

export interface SolveOpts {
  levels: number[];
  loadouts: string[];
  depth: number;
  nodes: number;
  jobs?: number;
}

export async function solveParallel(cfg: RevengeCfg, opts: SolveOpts): Promise<SolveResult[]> {
  if (cfg.puzzles) throw new Error('solveParallel cannot ship puzzle overrides to workers — run in-process');
  const jobs: string[] = [];
  for (const lv of opts.levels) for (const lo of opts.loadouts) jobs.push(`${lv}:${lo}`);
  const shards = shard(jobs, defaultJobs(opts.jobs));
  const all = await Promise.all(
    shards.map((s) =>
      runWorker<SolveResult[]>([
        'solve',
        `--run=${cfg.runId}`,
        `--pairs=${s.join(',')}`,
        `--depth=${opts.depth}`,
        `--nodes=${opts.nodes}`,
        ...(cfg.difficulty ? [`--difficulty=${cfg.difficulty}`] : []),
        ...(cfg.iso ? [`--iso=${cfg.iso}`] : []),
      ]),
    ),
  );
  const results = all.flat();
  results.sort((a, b) => a.level - b.level || a.loadout.localeCompare(b.loadout));
  return results;
}

/** Full-run simulation in a worker (one process per call — callers fan out by mode). */
export function runsInWorker(cfg: RevengeCfg, n: number, tier: string, opts: RunsOpts = {}): Promise<RunsReport> {
  if (cfg.puzzles) return Promise.resolve(simulateRuns(cfg, n, tier, opts));
  return runWorker<RunsReport>([
    'runs',
    '--json',
    `--runs=${n}`,
    `--tier=${tier}`,
    `--run=${cfg.runId}`,
    ...(cfg.difficulty ? [`--difficulty=${cfg.difficulty}`] : []),
    ...(cfg.iso ? [`--iso=${cfg.iso}`] : []),
    ...(opts.unlockedAbilities ? [`--unlocked=${opts.unlockedAbilities.join(',')}`] : []),
    ...(opts.retriesPerLevel !== undefined ? [`--retries=${opts.retriesPerLevel}`] : []),
    ...(opts.seedPrefix ? [`--seed-prefix=${opts.seedPrefix}`] : []),
  ]);
}
