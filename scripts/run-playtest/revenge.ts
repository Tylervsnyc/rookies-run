/**
 * Rookie's Revenge playtest harness.
 *
 *   npx tsx scripts/run-playtest/revenge.ts matrix [--trials=30] [--levels=1,2,3] [--loadouts=none,surge] [--tier=T5] [--realistic]
 *   npx tsx scripts/run-playtest/revenge.ts runs   [--runs=100] [--tier=T5]     # full runs, random level pick
 *   npx tsx scripts/run-playtest/revenge.ts solve  [--levels=...] [--loadouts=...] [--depth=6] [--nodes=200000]
 *
 * matrix — every level × every loadout (no ability + each of the 10 abilities
 *          alone) × N trials with the MCTS bot. Records win %, loss modes and
 *          the "stall" share (timeout with the king still alive = the king was
 *          unreachable for that bot).
 * runs   — plays the run L1→L10 the way a player would: takes a RANDOM option
 *          from every free level offer (never skips), plays with the loadout.
 * solve  — AND-OR search: is there a FORCED capture within D Rookie moves,
 *          against every enemy tie-break? Conservative (dismisses offers).
 *
 * All output is JSON on stdout when --json is passed, otherwise a table.
 */

import { spawnSync } from 'node:child_process';
import * as os from 'node:os';

import {
  ALL_ABILITY_IDS,
  applyDismissOffer,
  applyOfferPick,
  maxUsesForTier,
  refreshAbilityUses,
  type AbilityId,
  type AbilityTier,
  type OwnedAbility,
} from '../../lib/run/abilities';
import { rookieLegalMoves } from '../../lib/run/movement';
import { REVENGE_ABILITIES, getRunById } from '../../lib/run/runs';
import { puzzleForDate, puzzleToBoardState } from '../../lib/run/seed';
import type { BoardState, RunPuzzle } from '../../lib/run/types';
import { toSquare } from '../../lib/run/types';
import { applyBotAction } from './bots/apply';
import { legalCandidates, type ActionCandidate } from './bots/shared';
import { settleEnemyTurns } from './bots/t3';
import { createMctsBot } from './bots/mcts';
import { T4 } from './bots/t4';
import { T5 } from './bots/t5';
import type { Bot, BotAction, BotContext } from './types';
import { rngFromString } from './utils/rng';

const RUN_ID = 'revenge-proto';
const ISO = '2026-08-18';
const MAX_TURNS = 300;

type FailMode = 'won' | 'captured' | 'move-limit' | 'stall' | 'dead-end';

interface GameResult {
  win: boolean;
  failMode: FailMode;
  moves: number;
  usedAbility: boolean;
  offersSeen: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Args

function arg(name: string, def?: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  if (process.argv.includes(`--${name}`)) return 'true';
  return def;
}
const JSON_OUT = process.argv.includes('--json');

// ─────────────────────────────────────────────────────────────────────────────
// Level + loadout builders

function levelCount(): number {
  return getRunById(RUN_ID).levels.length;
}

function puzzleFor(level: number): RunPuzzle {
  return puzzleForDate(ISO, level - 1, RUN_ID);
}

function loadoutFor(id: string, level: number, realistic: boolean): OwnedAbility[] {
  if (id === 'none') return [];
  const tier = realistic
    ? (Math.min(5, 1 + Math.floor((level - 1) / 3)) as AbilityTier)
    : 1;
  const aid = id as AbilityId;
  return [{ id: aid, tier, mutations: [], usesLeftThisLevel: maxUsesForTier(aid, tier) }];
}

function startState(level: number, abilities: OwnedAbility[], seed: string): BoardState {
  const puzzle = puzzleFor(level);
  const rng = rngFromString(seed);
  const s = puzzleToBoardState(puzzle, {
    runId: RUN_ID,
    abilities,
    aiRngSeed: (Math.floor(rng() * 0xffffffff) >>> 0) || 1,
  });
  return { ...s, abilities: refreshAbilityUses(s.abilities) };
}

// ─────────────────────────────────────────────────────────────────────────────
// One game with an offer policy.

type OfferPolicy = 'dismiss' | 'random' | 'bot';

function playGame(
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
  const usesBefore = () =>
    state.abilities.map((a) => a.usesLeftThisLevel).join(',');

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

interface Cell {
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

/** T6 = the harness's own heavier MCTS (320 rollouts) — the "strongest bot". */
const T6: Bot = createMctsBot({ id: 'T5', name: 'T6 Revenge (MCTS-320)', rolloutCount: 320 });

function botFor(tier: string): Bot {
  if (tier === 'T4') return T4;
  if (tier === 'T6') return T6;
  return T5;
}

function runMatrixCell(level: number, loadout: string, trials: number, tier: string, realistic: boolean): Cell {
  const bot = botFor(tier);
  const cell: Cell = {
    level, loadout, trials, wins: 0, captured: 0, stall: 0, moveLimit: 0, deadEnd: 0, usedAbility: 0, avgMoves: 0,
  };
  let moves = 0;
  for (let t = 0; t < trials; t++) {
    const seed = `revenge:${level}:${loadout}:${t}`;
    const start = startState(level, loadoutFor(loadout, level, realistic), seed);
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

function parseList(v: string | undefined, all: string[]): string[] {
  if (!v || v === 'all') return all;
  return v.split(',').map((x) => x.trim()).filter(Boolean);
}

function matrixMain(): void {
  const trials = parseInt(arg('trials', '30')!, 10);
  const tier = arg('tier', 'T5')!;
  const realistic = arg('realistic') === 'true';
  const allLevels = Array.from({ length: levelCount() }, (_, i) => String(i + 1));
  const levels = parseList(arg('levels'), allLevels).map(Number);
  const loadouts = parseList(arg('loadouts'), ['none', ...REVENGE_ABILITIES]);
  const worker = arg('worker') === 'true';

  if (worker) {
    const cells: Cell[] = [];
    for (const lv of levels)
      for (const lo of loadouts) cells.push(runMatrixCell(lv, lo, trials, tier, realistic));
    process.stdout.write(JSON.stringify(cells));
    return;
  }

  // Parent: shard by (level, loadout) across CPUs.
  const jobs: Array<{ level: number; loadout: string }> = [];
  for (const lv of levels) for (const lo of loadouts) jobs.push({ level: lv, loadout: lo });
  const cpus = Math.max(1, Math.min(os.cpus().length - 1, parseInt(arg('jobs', '8')!, 10)));
  const shards: Array<typeof jobs> = Array.from({ length: cpus }, () => []);
  jobs.forEach((j, i) => shards[i % cpus].push(j));
  const t0 = Date.now();
  const cells: Cell[] = [];
  // Run shards in parallel using spawnSync per shard would serialize; use
  // async spawn via Promise.all instead.
  const { spawn } = require('node:child_process') as typeof import('node:child_process');
  const promises = shards
    .filter((s) => s.length > 0)
    .map(
      (shard) =>
        new Promise<Cell[]>((resolve, reject) => {
          // Group shard by loadout list per level to keep args compact: run
          // one worker per shard by passing explicit pairs.
          const pairs = shard.map((j) => `${j.level}:${j.loadout}`).join(',');
          const child = spawn(
            'npx',
            [
              'tsx',
              __filename,
              'matrix',
              '--worker',
              `--pairs=${pairs}`,
              `--trials=${trials}`,
              `--tier=${tier}`,
              ...(realistic ? ['--realistic'] : []),
            ],
            { stdio: ['ignore', 'pipe', 'inherit'] },
          );
          let out = '';
          child.stdout.on('data', (d) => (out += d.toString()));
          child.on('close', (code) => {
            if (code !== 0) return reject(new Error(`worker exit ${code}`));
            try {
              resolve(JSON.parse(out) as Cell[]);
            } catch (e) {
              reject(e);
            }
          });
        }),
    );
  Promise.all(promises).then((all) => {
    for (const c of all) cells.push(...c);
    cells.sort((a, b) => a.level - b.level || a.loadout.localeCompare(b.loadout));
    const dt = ((Date.now() - t0) / 1000).toFixed(0);
    if (JSON_OUT) {
      console.log(JSON.stringify({ tier, trials, realistic, seconds: Number(dt), cells }, null, 1));
      return;
    }
    printMatrix(cells, loadouts, levels);
    console.error(`[revenge matrix] ${cells.length} cells × ${trials} trials in ${dt}s (${tier}${realistic ? ', realistic tiers' : ''})`);
  });
}

function printMatrix(cells: Cell[], loadouts: string[], levels: number[]): void {
  const short = (s: string) => (s === 'none' ? 'none' : s.replace('-', '').slice(0, 7));
  const head = ['L', ...loadouts.map(short)].map((h) => h.padStart(8)).join('');
  console.log(head);
  for (const lv of levels) {
    const row = [String(lv).padStart(8)];
    for (const lo of loadouts) {
      const c = cells.find((x) => x.level === lv && x.loadout === lo);
      if (!c) { row.push('-'.padStart(8)); continue; }
      const pct = Math.round((c.wins / c.trials) * 100);
      const stall = c.stall > 0 ? `s${c.stall}` : '';
      row.push(`${pct}%${stall}`.padStart(8));
    }
    console.log(row.join(''));
  }
}

// Worker entry that takes explicit pairs (used by the parent above).
function matrixWorkerPairs(): boolean {
  const pairs = arg('pairs');
  if (!pairs) return false;
  const trials = parseInt(arg('trials', '30')!, 10);
  const tier = arg('tier', 'T5')!;
  const realistic = arg('realistic') === 'true';
  const cells: Cell[] = [];
  for (const p of pairs.split(',')) {
    const [lv, lo] = p.split(':');
    cells.push(runMatrixCell(Number(lv), lo, trials, tier, realistic));
  }
  process.stdout.write(JSON.stringify(cells));
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// runs — full run, random level picks

function runsMain(): void {
  const n = parseInt(arg('runs', '60')!, 10);
  const tier = arg('tier', 'T5')!;
  const bot = botFor(tier);
  const total = levelCount();
  const reached: number[] = new Array(total + 1).fill(0); // reached[i] = runs that reached level i
  const cleared: number[] = new Array(total + 1).fill(0);
  const pickCounts: Record<string, number> = {};
  const lossAt: Record<number, Record<string, number>> = {};
  const t0 = Date.now();
  for (let r = 0; r < n; r++) {
    let abilities: OwnedAbility[] = [];
    let tempo = 0;
    let pending: BoardState['pendingOffer'] = null;
    for (let lv = 1; lv <= total; lv++) {
      reached[lv]++;
      const seed = `revenge-run:${r}:${lv}`;
      const rng = rngFromString(seed);
      const puzzle = puzzleFor(lv);
      const start = puzzleToBoardState(puzzle, {
        runId: RUN_ID,
        abilities,
        tempo,
        pendingOffer: pending,
        aiRngSeed: (Math.floor(rng() * 0xffffffff) >>> 0) || 1,
      });
      const { result, final } = playGame(start, bot, seed, 'random', (id) => {
        pickCounts[id] = (pickCounts[id] ?? 0) + 1;
      });
      if (!result.win) {
        lossAt[lv] = lossAt[lv] ?? {};
        lossAt[lv][result.failMode] = (lossAt[lv][result.failMode] ?? 0) + 1;
        break;
      }
      cleared[lv]++;
      abilities = final.abilities;
      tempo = final.tempo;
      pending = final.pendingOffer;
    }
  }
  const dt = ((Date.now() - t0) / 1000).toFixed(0);
  const rows = [];
  for (let lv = 1; lv <= total; lv++) {
    rows.push({
      level: lv,
      reached: reached[lv],
      cleared: cleared[lv],
      clearRate: reached[lv] ? Math.round((cleared[lv] / reached[lv]) * 100) : null,
      losses: lossAt[lv] ?? {},
    });
  }
  const full = cleared[total];
  if (JSON_OUT) {
    console.log(JSON.stringify({ tier, runs: n, fullClears: full, rows, pickCounts, seconds: Number(dt) }, null, 1));
    return;
  }
  console.log(`[revenge runs] ${n} runs, ${tier}, random level picks — full clears ${full}/${n} (${dt}s)`);
  for (const row of rows) {
    console.log(
      `L${String(row.level).padStart(2)}  reached ${String(row.reached).padStart(3)}  cleared ${String(row.cleared).padStart(3)}  ${String(row.clearRate ?? '-').padStart(3)}%  ${JSON.stringify(row.losses)}`,
    );
  }
  console.log('picks:', JSON.stringify(pickCounts));
}

// ─────────────────────────────────────────────────────────────────────────────
// solve — AND-OR forced-capture search

interface SolveResult {
  level: number;
  loadout: string;
  verdict: 'forced-win' | 'no-forced-win' | 'unknown';
  depth: number | null;
  nodes: number;
}

function stateKey(s: BoardState): string {
  const pcs = s.pieces
    .map((p) => `${p.type[0]}${p.file}${p.rank}`)
    .sort()
    .join('');
  const al = (s.allies ?? [])
    .map((a) => `${a.type[0]}${a.file}${a.rank}`)
    .sort()
    .join('');
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

/** Enumerate distinct enemy responses (over tie-break seeds). */
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
  if (c.kind === 'activate-ability') return { kind: 'activate-ability', abilityId: c.abilityId! };
  return { kind: 'ability-target', abilityId: c.abilityId!, target: c.target! };
}

function orderCandidates(s: BoardState, cands: ActionCandidate[]): ActionCandidate[] {
  const king = s.pieces.find((p) => p.type === 'king');
  const score = (c: ActionCandidate): number => {
    if (c.kind === 'move' && king && c.target!.file === king.file && c.target!.rank === king.rank) return 1000;
    if (c.kind !== 'move') return 50; // free actions first — they open lines
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
function startFilesFor(level: number): number[] {
  const puzzle = puzzleFor(level);
  const occupied = new Set(puzzle.pieces.filter((p) => p.rank === 1).map((p) => p.file));
  for (const h of puzzle.hazards ?? []) if (h.rank === 1) occupied.add(h.file);
  const blockersAhead = new Set(puzzle.pieces.filter((p) => p.rank > 1).map((p) => p.file));
  for (const h of puzzle.hazards ?? []) if (h.rank > 1) blockersAhead.add(h.file);
  const withBlocker = [1, 2, 3, 4, 5, 6, 7, 8].filter((f) => !occupied.has(f) && blockersAhead.has(f));
  if (withBlocker.length > 0) return withBlocker;
  return [1, 2, 3, 4, 5, 6, 7, 8].filter((f) => !occupied.has(f));
}

/** Worst case over every possible start file. */
function solveLevel(level: number, loadout: string, maxDepth: number, nodeBudget: number): SolveResult {
  const files = startFilesFor(level);
  let worst: SolveResult | null = null;
  let totalNodes = 0;
  for (const f of files) {
    const r = solveLevelFrom(level, loadout, maxDepth, nodeBudget, f);
    totalNodes += r.nodes;
    const rank = (v: SolveResult['verdict']) => (v === 'forced-win' ? 2 : v === 'unknown' ? 1 : 0);
    if (!worst || rank(r.verdict) < rank(worst.verdict) || (r.verdict === worst.verdict && (r.depth ?? 0) > (worst.depth ?? 0))) {
      worst = r;
    }
  }
  return { ...(worst as SolveResult), nodes: totalNodes };
}

function solveLevelFrom(level: number, loadout: string, maxDepth: number, nodeBudget: number, startFile: number): SolveResult {
  const abilities = loadoutFor(loadout, level, false);
  const raw = startState(level, abilities, `solve:${level}:${loadout}`);
  const start = neutral({ ...raw, rookie: { file: startFile, rank: raw.rookie.rank } });
  let nodes = 0;
  const memo = new Map<string, boolean | null>(); // key@depth → win?

  // Returns true = forced win within `depth` Rookie moves, false = not
  // (within depth), null = budget blown.
  const search = (s: BoardState, depth: number, freeChain: number): boolean | null => {
    if (s.status === 'won') return true;
    if (s.status === 'lost') return false;
    if (depth === 0) return false;
    if (nodes++ > nodeBudget) return null;
    if (s.turn !== 'rookie') {
      // enemy (or ally/drone) phase — must win against every response
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
    memo.set(key, false); // cycle guard (free-action loops)
    const cands = orderCandidates(s, legalCandidates(s, new Set()));
    let unknown = false;
    for (const c of cands) {
      if (c.kind !== 'move' && freeChain >= 4) continue; // bound free-action chains
      const action = candidateToAction(c);
      const next0 = applyBotAction(s, action);
      if (next0 === s) continue;
      const next = neutral(next0);
      const isMove = c.kind === 'move' || (next.moveCount > s.moveCount);
      const nd = isMove ? depth - 1 : depth;
      // A move that keeps Rookie's turn (Surge bonus) is still a move.
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

function solveMain(): void {
  const allLevels = Array.from({ length: levelCount() }, (_, i) => String(i + 1));
  const levels = parseList(arg('levels'), allLevels).map(Number);
  const loadouts = parseList(arg('loadouts'), ['none', ...REVENGE_ABILITIES]);
  const depth = parseInt(arg('depth', '6')!, 10);
  const nodes = parseInt(arg('nodes', '150000')!, 10);
  const worker = arg('pairs');
  if (worker) {
    const out: SolveResult[] = [];
    for (const p of worker.split(',')) {
      const [lv, lo] = p.split(':');
      out.push(solveLevel(Number(lv), lo, depth, nodes));
    }
    process.stdout.write(JSON.stringify(out));
    return;
  }
  const jobs: string[] = [];
  for (const lv of levels) for (const lo of loadouts) jobs.push(`${lv}:${lo}`);
  const cpus = Math.max(1, Math.min(os.cpus().length - 1, parseInt(arg('jobs', '8')!, 10)));
  const shards: string[][] = Array.from({ length: cpus }, () => []);
  jobs.forEach((j, i) => shards[i % cpus].push(j));
  const t0 = Date.now();
  const results: SolveResult[] = [];
  for (const shard of shards) {
    if (shard.length === 0) continue;
    // sequential spawnSync per shard is fine for the solver's shorter runs;
    // use async spawn to actually parallelize.
  }
  const { spawn } = require('node:child_process') as typeof import('node:child_process');
  Promise.all(
    shards
      .filter((s) => s.length > 0)
      .map(
        (shard) =>
          new Promise<SolveResult[]>((resolve, reject) => {
            const child = spawn(
              'npx',
              ['tsx', __filename, 'solve', `--pairs=${shard.join(',')}`, `--depth=${depth}`, `--nodes=${nodes}`],
              { stdio: ['ignore', 'pipe', 'inherit'] },
            );
            let out = '';
            child.stdout.on('data', (d) => (out += d.toString()));
            child.on('close', (code) => {
              if (code !== 0) return reject(new Error(`solver worker exit ${code}`));
              try {
                resolve(JSON.parse(out) as SolveResult[]);
              } catch (e) {
                reject(e);
              }
            });
          }),
      ),
  ).then((all) => {
    for (const r of all) results.push(...r);
    results.sort((a, b) => a.level - b.level || a.loadout.localeCompare(b.loadout));
    const dt = ((Date.now() - t0) / 1000).toFixed(0);
    if (JSON_OUT) {
      console.log(JSON.stringify({ depth, nodes, seconds: Number(dt), results }, null, 1));
      return;
    }
    const short = (s: string) => (s === 'none' ? 'none' : s.replace('-', '').slice(0, 7));
    console.log(['L', ...loadouts.map(short)].map((h) => h.padStart(8)).join(''));
    for (const lv of levels) {
      const row = [String(lv).padStart(8)];
      for (const lo of loadouts) {
        const r = results.find((x) => x.level === lv && x.loadout === lo);
        if (!r) { row.push('-'.padStart(8)); continue; }
        row.push(
          (r.verdict === 'forced-win' ? `W${r.depth}` : r.verdict === 'unknown' ? `?${r.depth}` : `no${r.depth}`).padStart(8),
        );
      }
      console.log(row.join(''));
    }
    console.error(`[revenge solve] ${results.length} cells in ${dt}s (depth ${depth}, ${nodes} nodes)`);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// trace — print one game move by move (debug)

function traceMain(): void {
  const level = parseInt(arg('level', '3')!, 10);
  const loadout = arg('loadout', 'none')!;
  const trial = parseInt(arg('trial', '0')!, 10);
  const seed = `revenge:${level}:${loadout}:${trial}`;
  const start = startState(level, loadoutFor(loadout, level, false), seed);
  const bot = botFor(arg('tier', 'T5')!);
  const ctx: BotContext = { excludedAbilities: new Set(), forcedAcceptIds: new Set(), forcedSkipIds: new Set(), rng: rngFromString(seed + ':bot') };
  let s = start;
  const show = (st: BoardState) => {
    const k = st.pieces.find((p) => p.type === 'king');
    return `R@${toSquare(st.rookie)}(${st.form}) K@${k ? toSquare(k) : '-'} stun=${st.kingStunTurns ?? 0} pieces=${st.pieces.map((p) => p.type[0] + toSquare(p)).join(' ')} allies=${st.allies.map((a) => a.type[0] + toSquare(a)).join(' ')} legal=${rookieLegalMoves(st).map(toSquare).join(',')}`;
  };
  console.log(`start: ${show(s)}`);
  for (let i = 0; i < 80 && s.status === 'playing'; i++) {
    if (s.pendingOffer) { s = applyDismissOffer(s); continue; }
    if (s.turn !== 'rookie') { s = settleEnemyTurns(s); console.log(`  enemy → ${show(s)}`); continue; }
    const a = bot.decide(s, ctx);
    const next = applyBotAction(s, a);
    console.log(`R: ${JSON.stringify(a)}`);
    if (next === s) { console.log('  no-op'); break; }
    s = next;
    console.log(`  → ${show(s)}`);
  }
  console.log(`end: ${s.status}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// lint — static read of each level: keys on the king's lines, safe line squares

function lintMain(): void {
  const { enemyAttackedSquares } = require('./bots/shared') as typeof import('./bots/shared');
  const allLevels = Array.from({ length: levelCount() }, (_, i) => String(i + 1));
  const levels = parseList(arg('levels'), allLevels).map(Number);
  for (const lv of levels) {
    const st = startState(lv, [], `lint:${lv}`);
    const king = st.pieces.find((p) => p.type === 'king');
    if (!king) { console.log(`L${lv}: no king`); continue; }
    const attacked = enemyAttackedSquares(st);
    const occupied = (f: number, r: number) =>
      st.pieces.some((p) => p.file === f && p.rank === r) || st.hazards.some((h) => h.file === f && h.rank === r);
    const keys: string[] = [];
    const lineSquares: string[] = [];
    for (const [df, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      let f = king.file + df, r = king.rank + dr;
      while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
        if (st.hazards.some((h) => h.file === f && h.rank === r)) break;
        const piece = st.pieces.find((p) => p.file === f && p.rank === r);
        const sq = toSquare({ file: f, rank: r });
        if (piece) {
          keys.push(`${piece.type}@${sq}${attacked.has(sq) ? '(defended)' : '(FREE KEY)'}`);
          break;
        }
        lineSquares.push(`${sq}${attacked.has(sq) ? '' : '*'}`);
        f += df; r += dr;
      }
    }
    // Pen safe squares vs the king
    const pen = st.kingPen ?? [];
    void occupied;
    console.log(`L${lv} K@${toSquare(king)} pen=[${pen.join(' ')}]`);
    console.log(`   keys on his lines: ${keys.join(', ') || '-'}`);
    console.log(`   line squares (* = not attacked): ${lineSquares.join(' ') || '-'}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

const mode = process.argv[2];
if (mode === 'matrix') {
  if (!matrixWorkerPairs()) matrixMain();
} else if (mode === 'runs') runsMain();
else if (mode === 'solve') solveMain();
else if (mode === 'trace') traceMain();
else if (mode === 'lint') lintMain();
else {
  console.error('usage: revenge.ts matrix|runs|solve|trace [--flags]');
  process.exit(1);
}

void ALL_ABILITY_IDS;
void spawnSync;
