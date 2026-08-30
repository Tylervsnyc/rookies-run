/**
 * Rookie's Revenge nightly analysis — the math behind the digest.
 *
 *   band            the target no-ability curve per level + tolerance
 *   correlate       Pearson of every feature vs a target (no-ability %, finisher floor)
 *   ridge           multivariate ridge on standardized features (ported from regression.ts)
 *   compareNights   cell deltas vs the previous night (movers, new stalls, band exits)
 *   hypotheses      3 concrete level/budget tweaks per night, each with a prediction,
 *                   then RUN as in-process experiments (mutated puzzle → matrix cell)
 */

import type { RunPuzzle, EnemyPiece, PieceType } from '../../lib/run/types';
import { fromSquare, toSquare } from '../../lib/run/types';
import { FEATURE_KEYS, FEATURE_LABELS, type FeatureKey, type RevengeFeatures } from './revenge-features';
import { FINISHERS, puzzleFor, runMatrixCell, winPct, type Cell, type RevengeCfg, type RunsReport, type SolveResult } from './revenge-core';

// ─────────────────────────────────────────────────────────────────────────────
// Band — the curve Tyler signed off on (no-ability, realistic tiers, T5 bot)

/** Target no-ability win % per level (L1..L10). Levels past 10 reuse the last value. */
export const BAND_TARGET: ReadonlyArray<number> = [100, 100, 100, 100, 90, 50, 55, 50, 30, 30];
export const BAND_TOLERANCE = 15;
export const FINISHER_FLOOR_MIN = 80;

export function bandFor(level: number): { target: number; low: number; high: number } {
  const target = BAND_TARGET[Math.min(level, BAND_TARGET.length) - 1];
  return { target, low: Math.max(0, target - BAND_TOLERANCE), high: Math.min(100, target + BAND_TOLERANCE) };
}

export interface LevelSummary {
  level: number;
  nonePct: number;
  noneCell: Cell;
  bestFinisher: { id: string; pct: number };
  worstFinisher: { id: string; pct: number };
  finisherFloor: number;
  worstAny: { id: string; pct: number };
  stalls: number;
  moveLimit: number | null;
  avgMovesNone: number;
  inBand: boolean;
  bandNote: '' | 'too easy' | 'too hard';
}

/** Per-level read of a matrix (one run, one mode). */
export function summarizeLevels(cells: Cell[], moveLimits: Record<number, number | null>): LevelSummary[] {
  const levels = [...new Set(cells.map((c) => c.level))].sort((a, b) => a - b);
  const out: LevelSummary[] = [];
  for (const lv of levels) {
    const row = cells.filter((c) => c.level === lv);
    const none = row.find((c) => c.loadout === 'none');
    if (!none) continue;
    const fins = row.filter((c) => FINISHERS.includes(c.loadout)).map((c) => ({ id: c.loadout, pct: winPct(c) }));
    const others = row.filter((c) => c.loadout !== 'none').map((c) => ({ id: c.loadout, pct: winPct(c) }));
    const best0 = fins.reduce((a, b) => (b.pct > a.pct ? b : a), fins[0] ?? { id: '-', pct: 0 });
    const tiedTop = fins.filter((f) => f.pct === best0.pct).length;
    const best = tiedTop >= 2 ? { id: `${tiedTop} tied`, pct: best0.pct } : best0;
    const worst = fins.reduce((a, b) => (b.pct < a.pct ? b : a), fins[0] ?? { id: '-', pct: 0 });
    const worstAny = others.reduce((a, b) => (b.pct < a.pct ? b : a), others[0] ?? { id: '-', pct: 0 });
    const nonePct = winPct(none);
    const band = bandFor(lv);
    const inBand = nonePct >= band.low && nonePct <= band.high;
    out.push({
      level: lv,
      nonePct,
      noneCell: none,
      bestFinisher: best,
      worstFinisher: worst,
      finisherFloor: worst.pct,
      worstAny,
      stalls: row.reduce((s, c) => s + c.stall, 0),
      moveLimit: moveLimits[lv] ?? null,
      avgMovesNone: Math.round(none.avgMoves * 10) / 10,
      inBand,
      bandNote: inBand ? '' : nonePct > band.high ? 'too easy' : 'too hard',
    });
  }
  return out;
}

/**
 * Player simulations — full runs with the offer pool the app would actually
 * roll for that player, offers taken (never dismissed), retries like the mode.
 *   starter*  = a NEW player: only the 3 starter abilities unlocked
 *   veteran*  = every ability unlocked
 */
export interface PlayerSims {
  starterRookie?: RunsReport;
  starterNormal?: RunsReport;
  veteranRookie?: RunsReport;
  veteranNormal?: RunsReport;
}

/** Full-run clear % (0..100) or null when the sim didn't run. */
export function clearPct(r?: RunsReport): number | null {
  if (!r || !r.runs) return null;
  return Math.round((r.fullClears / r.runs) * 100);
}

/** THE difficulty bands (Tyler, 2026-08-30): new-player full-run clear on Normal 40–60 %, Rookie ≥ 70 %. */
export const NEWPLAYER_NORMAL_LOW = 40;
export const NEWPLAYER_NORMAL_HIGH = 60;
export const NEWPLAYER_NORMAL_TOO_EASY = 85;
export const NEWPLAYER_ROOKIE_MIN = 70;

export type DifficultyCall = 'too easy' | 'in target' | 'too hard' | 'unmeasured';

export function difficultyCall(players?: PlayerSims): { call: DifficultyCall; normal: number | null; rookie: number | null } {
  const normal = clearPct(players?.starterNormal);
  const rookie = clearPct(players?.starterRookie);
  if (normal === null) return { call: 'unmeasured', normal, rookie };
  if (normal > NEWPLAYER_NORMAL_HIGH) return { call: 'too easy', normal, rookie };
  if (normal < NEWPLAYER_NORMAL_LOW) return { call: 'too hard', normal, rookie };
  return { call: 'in target', normal, rookie };
}

/** How much the powers do: average finisher win minus average no-ability win, all levels. */
export function powersCarry(summary: LevelSummary[], cells: Cell[]): { none: number; finisher: number; lift: number } {
  const none = summary.length ? mean(summary.map((s) => s.nonePct)) : 0;
  const fin = cells.filter((c) => FINISHERS.includes(c.loadout));
  const finisher = fin.length ? mean(fin.map(winPct)) : none;
  return { none: Math.round(none), finisher: Math.round(finisher), lift: Math.round(finisher - none) };
}

export interface ImpossibleLevel {
  level: number;
  loadouts: number;
  /** Share of all trials on that level that ended in stall or move-limit (0..1). */
  stallShare: number;
  /** Solver read: 'no-line' (searched, nothing), 'unknown' (budget blown), 'not-run', or 'forced-win' (contradiction — flagged anyway on 0 %). */
  solver: 'no-line' | 'unknown' | 'not-run' | 'forced-win';
}

/**
 * A level is IMPOSSIBLE when every loadout wins 0 % AND either the solver
 * found no forced line for any loadout or every loss was a stall / move-limit
 * (the king was never reachable). The app's fail-safe would end it with
 * "No way through" — so this is a level-authoring bug, called out loudly.
 */
export function impossibleLevels(cells: Cell[], solver: SolveResult[]): ImpossibleLevel[] {
  const out: ImpossibleLevel[] = [];
  const levels = [...new Set(cells.map((c) => c.level))].sort((a, b) => a - b);
  for (const lv of levels) {
    const row = cells.filter((c) => c.level === lv && c.trials > 0);
    if (!row.length || row.some((c) => c.wins > 0)) continue;
    const trials = row.reduce((n, c) => n + c.trials, 0);
    const stalled = row.reduce((n, c) => n + c.stall + c.moveLimit, 0);
    const stallShare = trials ? stalled / trials : 0;
    const sv = solver.filter((r) => r.level === lv);
    const solverRead: ImpossibleLevel['solver'] = !sv.length
      ? 'not-run'
      : sv.some((r) => r.verdict === 'forced-win') ? 'forced-win'
        : sv.every((r) => r.verdict === 'no-forced-win') ? 'no-line' : 'unknown';
    if (solverRead === 'no-line' || stallShare >= 0.999 || solverRead === 'not-run' || solverRead === 'unknown') {
      out.push({ level: lv, loadouts: row.length, stallShare, solver: solverRead });
    }
  }
  return out;
}

export function describeImpossible(i: ImpossibleLevel): string {
  const sv = i.solver === 'no-line' ? 'solver: no line' : i.solver === 'unknown' ? 'solver: budget blown, no line found' : i.solver === 'not-run' ? 'solver: not run on this level' : 'solver claims a forced line — check the bot';
  return `L${i.level}: IMPOSSIBLE — 0% with every loadout (${i.loadouts} tried), stall/move-limit ${Math.round(i.stallShare * 100)}%, ${sv}, app fail-safe would fire ("No way through")`;
}

export interface Verdict {
  recommendation: 'promote' | 'hold';
  /** Levels no loadout can clear. */
  impossible: ImpossibleLevel[];
  /** Blocking reasons (new-player bands, finisher floor, stalls). */
  reasons: string[];
  /** Informational: no-ability levels outside the legacy band. */
  notes: string[];
}

/** Promote/hold call: new-player clear bands first, then finisher floor and stalls. */
export function verdictFor(summary: LevelSummary[], players?: PlayerSims, cells: Cell[] = [], solver: SolveResult[] = []): Verdict {
  const reasons: string[] = [];
  const notes: string[] = [];
  const impossible = impossibleLevels(cells, solver);
  for (const i of impossible) reasons.push(describeImpossible(i));
  const d = difficultyCall(players);
  if (d.call === 'unmeasured') reasons.push('new-player simulation did not run — no difficulty read');
  else if (d.normal !== null && d.normal > NEWPLAYER_NORMAL_TOO_EASY) reasons.push(`TOO EASY — a new player clears ${d.normal}% of runs on Normal (target ${NEWPLAYER_NORMAL_LOW}-${NEWPLAYER_NORMAL_HIGH}%)`);
  else if (d.call === 'too easy') reasons.push(`too easy — new player clears ${d.normal}% on Normal (target ${NEWPLAYER_NORMAL_LOW}-${NEWPLAYER_NORMAL_HIGH}%)`);
  else if (d.call === 'too hard') reasons.push(`too hard — new player clears ${d.normal}% on Normal (target ${NEWPLAYER_NORMAL_LOW}-${NEWPLAYER_NORMAL_HIGH}%)`);
  if (d.rookie !== null && d.rookie < NEWPLAYER_ROOKIE_MIN) reasons.push(`beginners walled — new player clears only ${d.rookie}% on Rookie (need ${NEWPLAYER_ROOKIE_MIN}%+)`);
  for (const s of summary) {
    if (!s.inBand) notes.push(`L${s.level} no-ability ${s.nonePct}% is ${s.bandNote} for the legacy band (${bandFor(s.level).low}-${bandFor(s.level).high}%)`);
    if (s.finisherFloor < FINISHER_FLOOR_MIN) reasons.push(`L${s.level} ${s.worstFinisher.id} only ${s.worstFinisher.pct}% (every finisher must be at least ${FINISHER_FLOOR_MIN}%)`);
    if (s.stalls > 0) reasons.push(`L${s.level} has ${s.stalls} stall${s.stalls === 1 ? '' : 's'} (king unreachable)`);
  }
  return { recommendation: reasons.length === 0 ? 'promote' : 'hold', impossible, reasons, notes };
}

// ─────────────────────────────────────────────────────────────────────────────
// Run difficulty score + ability tier list (Tyler's standing sections)

export interface RunDifficulty {
  /** 100 − average no-ability win % across all levels at realistic tiers. */
  score: number;
  avgNone: number;
  /** Levels where no-ability < 60 %. */
  hardLevels: Array<{ level: number; nonePct: number }>;
}

export function runDifficulty(summary: LevelSummary[]): RunDifficulty {
  const avgNone = summary.length ? mean(summary.map((s) => s.nonePct)) : 0;
  return {
    score: Math.round(100 - avgNone),
    avgNone: Math.round(avgNone),
    hardLevels: summary.filter((s) => s.nonePct < 60).map((s) => ({ level: s.level, nonePct: s.nonePct })),
  };
}

export type TierGrade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface TierRow {
  loadout: string;
  tier: TierGrade;
  /** Avg win % over the contested levels (no-ability < 100; all levels if none). */
  avgWin: number;
  /** Avg (ability − none) over the same levels, in points. */
  lift: number;
  worstLevel: { level: number; pct: number };
  /** usedAbility / trials over the same levels, 0..1. */
  castRate: number;
  /** cast rate < 10 % — the bot never casts it, so the number is a floor. */
  neverCast: boolean;
}

export const NEVER_CAST_RATE = 0.1;

export function gradeFor(avgWin: number): TierGrade {
  if (avgWin >= 95) return 'S';
  if (avgWin >= 85) return 'A';
  if (avgWin >= 70) return 'B';
  if (avgWin >= 50) return 'C';
  return 'D';
}

/** Tier list from a realistic-tier matrix. Sorted by avg win, then lift. */
export function abilityTierList(cells: Cell[]): { rows: TierRow[]; contestedLevels: number[] } {
  const noneBy = new Map(cells.filter((c) => c.loadout === 'none').map((c) => [c.level, c]));
  const allLevels = [...noneBy.keys()].sort((a, b) => a - b);
  let contested = allLevels.filter((lv) => winPct(noneBy.get(lv)!) < 100);
  if (contested.length === 0) contested = allLevels;
  const loadouts = [...new Set(cells.map((c) => c.loadout))].filter((l) => l !== 'none');
  const rows: TierRow[] = [];
  for (const lo of loadouts) {
    const mine = contested.map((lv) => cells.find((c) => c.level === lv && c.loadout === lo)).filter((c): c is Cell => !!c);
    if (mine.length === 0) continue;
    const avgWin = mean(mine.map(winPct));
    const lift = mean(mine.map((c) => winPct(c) - winPct(noneBy.get(c.level)!)));
    const worst = mine.reduce((a, b) => (winPct(b) < winPct(a) ? b : a));
    const trials = mine.reduce((n, c) => n + c.trials, 0);
    const used = mine.reduce((n, c) => n + c.usedAbility, 0);
    const castRate = trials ? used / trials : 0;
    rows.push({
      loadout: lo,
      tier: gradeFor(avgWin),
      avgWin: Math.round(avgWin),
      lift: Math.round(lift),
      worstLevel: { level: worst.level, pct: winPct(worst) },
      castRate,
      neverCast: castRate < NEVER_CAST_RATE,
    });
  }
  rows.sort((a, b) => b.avgWin - a.avgWin || b.lift - a.lift || a.loadout.localeCompare(b.loadout));
  return { rows, contestedLevels: contested };
}

// ─────────────────────────────────────────────────────────────────────────────
// Correlations

export interface Correlation {
  feature: FeatureKey;
  label: string;
  pearson: number;
  meanWhenHigh: number;
  meanWhenLow: number;
  samples: number;
}

export interface Sample {
  features: RevengeFeatures;
  nonePct: number;
  finisherFloor: number;
}

export function correlate(samples: Sample[], target: 'nonePct' | 'finisherFloor'): Correlation[] {
  if (samples.length < 4) return [];
  const ys = samples.map((s) => s[target]);
  const out: Correlation[] = [];
  for (const key of FEATURE_KEYS) {
    const xs = samples.map((s) => Number(s.features[key]));
    if (variance(xs) === 0) continue;
    const q = quartileMeans(xs, ys);
    out.push({
      feature: key,
      label: FEATURE_LABELS[key],
      pearson: pearson(xs, ys),
      meanWhenHigh: q.high,
      meanWhenLow: q.low,
      samples: samples.length,
    });
  }
  out.sort((a, b) => Math.abs(b.pearson) - Math.abs(a.pearson));
  return out;
}

/** "Levels with ≥3 pawn-defended keys average X% lower" style split. */
export interface ThresholdFinding {
  feature: FeatureKey;
  label: string;
  threshold: number;
  aboveMean: number;
  belowMean: number;
  aboveN: number;
  belowN: number;
  deltaPts: number;
}

export function thresholdFindings(samples: Sample[], target: 'nonePct' | 'finisherFloor', max = 6): ThresholdFinding[] {
  const out: ThresholdFinding[] = [];
  if (samples.length < 6) return out;
  for (const key of FEATURE_KEYS) {
    const values = [...new Set(samples.map((s) => Number(s.features[key])))].sort((a, b) => a - b);
    if (values.length < 2) continue;
    let best: ThresholdFinding | null = null;
    for (let i = 1; i < values.length; i++) {
      const thr = values[i];
      const above = samples.filter((s) => Number(s.features[key]) >= thr);
      const below = samples.filter((s) => Number(s.features[key]) < thr);
      if (above.length < 3 || below.length < 3) continue;
      const a = mean(above.map((s) => s[target]));
      const b = mean(below.map((s) => s[target]));
      const f: ThresholdFinding = {
        feature: key, label: FEATURE_LABELS[key], threshold: thr,
        aboveMean: a, belowMean: b, aboveN: above.length, belowN: below.length, deltaPts: a - b,
      };
      if (!best || Math.abs(f.deltaPts) > Math.abs(best.deltaPts)) best = f;
    }
    if (best) out.push(best);
  }
  out.sort((a, b) => Math.abs(b.deltaPts) - Math.abs(a.deltaPts));
  return out.slice(0, max);
}

// ─────────────────────────────────────────────────────────────────────────────
// Ridge regression (standardized, λ=0.5 — small n, strong prior)

export interface RidgeFit {
  target: string;
  samples: number;
  holdoutSize: number;
  trainR2: number;
  holdoutR2: number | null;
  yMean: number;
  yStd: number;
  /** Δtarget (pts) per +1 standard deviation of the feature. */
  stdCoef: Record<string, number>;
  /** Δtarget (pts) per +1 unit of the feature (stdCoef / xStd). */
  unitCoef: Record<string, number>;
  xMeans: Record<string, number>;
  xStds: Record<string, number>;
  keys: FeatureKey[];
}

const RIDGE_LAMBDA = 0.5;

export function ridge(samples: Sample[], target: 'nonePct' | 'finisherFloor'): RidgeFit | null {
  if (samples.length < 8) return null;
  // Drop constant features — they carry nothing and break standardization.
  const keys = FEATURE_KEYS.filter((k) => variance(samples.map((s) => Number(s.features[k]))) > 0);
  const n = samples.length;
  const holdoutSize = n >= 15 ? Math.floor(n * 0.2) : 0;
  const order = shuffled(n, hashString(target + n));
  const holdIdx = new Set(order.slice(0, holdoutSize));
  const train = samples.filter((_, i) => !holdIdx.has(i));
  const hold = samples.filter((_, i) => holdIdx.has(i));

  const X = train.map((s) => keys.map((k) => Number(s.features[k])));
  const y = train.map((s) => s[target]);
  const xMeans = colMeans(X);
  const xStds = colStds(X, xMeans);
  const yMean = mean(y);
  const yStd = std(y, yMean) || 1;
  const Xs = X.map((row) => row.map((v, j) => (v - xMeans[j]) / (xStds[j] || 1)));
  const ys = y.map((v) => (v - yMean) / yStd);

  const p = keys.length;
  const A = mulATA(Xs);
  for (let j = 0; j < p; j++) A[j][j] += RIDGE_LAMBDA;
  const b = mulATv(Xs, ys);
  const beta = solve(A, b);

  const predictStd = (s: Sample) =>
    keys.reduce((acc, k, j) => acc + beta[j] * ((Number(s.features[k]) - xMeans[j]) / (xStds[j] || 1)), 0);
  const predict = (s: Sample) => yMean + yStd * predictStd(s);
  const trainR2 = r2(y, train.map(predict));
  const holdoutR2 = hold.length >= 3 ? r2(hold.map((s) => s[target]), hold.map(predict)) : null;

  const stdCoef: Record<string, number> = {};
  const unitCoef: Record<string, number> = {};
  const xm: Record<string, number> = {};
  const xs: Record<string, number> = {};
  keys.forEach((k, j) => {
    stdCoef[k] = beta[j] * yStd;
    unitCoef[k] = xStds[j] ? (beta[j] * yStd) / xStds[j] : 0;
    xm[k] = xMeans[j];
    xs[k] = xStds[j];
  });
  return { target, samples: n, holdoutSize, trainR2, holdoutR2, yMean, yStd, stdCoef, unitCoef, xMeans: xm, xStds: xs, keys };
}

/** Predicted Δtarget for a change in one or more features, using unit coefficients. */
export function predictDelta(fit: RidgeFit | null, deltas: Partial<Record<FeatureKey, number>>): number | null {
  if (!fit) return null;
  let d = 0;
  for (const [k, v] of Object.entries(deltas)) d += (fit.unitCoef[k] ?? 0) * (v ?? 0);
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// Night-over-night comparison

export interface CellMove {
  runId: string;
  mode: string;
  level: number;
  loadout: string;
  before: number;
  after: number;
  delta: number;
}

export interface NightDiff {
  movers: CellMove[];
  newStalls: Array<{ runId: string; mode: string; level: number; loadout: string; stall: number }>;
  bandExits: Array<{ runId: string; level: number; before: number; after: number; note: string }>;
  bandEntries: Array<{ runId: string; level: number; before: number; after: number }>;
  comparedCells: number;
  previousDate: string | null;
}

export interface MatrixSet {
  runId: string;
  mode: string;
  cells: Cell[];
}

export function compareNights(prev: MatrixSet[] | null, cur: MatrixSet[], previousDate: string | null, threshold = 15): NightDiff {
  const diff: NightDiff = { movers: [], newStalls: [], bandExits: [], bandEntries: [], comparedCells: 0, previousDate };
  if (!prev) return diff;
  for (const set of cur) {
    const before = prev.find((p) => p.runId === set.runId && p.mode === set.mode);
    if (!before) continue;
    for (const c of set.cells) {
      const b = before.cells.find((x) => x.level === c.level && x.loadout === c.loadout);
      if (!b) continue;
      diff.comparedCells++;
      const d = winPct(c) - winPct(b);
      if (Math.abs(d) > threshold) diff.movers.push({ runId: set.runId, mode: set.mode, level: c.level, loadout: c.loadout, before: winPct(b), after: winPct(c), delta: d });
      if (c.stall > 0 && b.stall === 0) diff.newStalls.push({ runId: set.runId, mode: set.mode, level: c.level, loadout: c.loadout, stall: c.stall });
      if (set.mode === 'realistic' && c.loadout === 'none') {
        const band = bandFor(c.level);
        const wasIn = winPct(b) >= band.low && winPct(b) <= band.high;
        const isIn = winPct(c) >= band.low && winPct(c) <= band.high;
        if (wasIn && !isIn) diff.bandExits.push({ runId: set.runId, level: c.level, before: winPct(b), after: winPct(c), note: winPct(c) > band.high ? 'too easy' : 'too hard' });
        if (!wasIn && isIn) diff.bandEntries.push({ runId: set.runId, level: c.level, before: winPct(b), after: winPct(c) });
      }
    }
  }
  diff.movers.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  return diff;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations — one minimal change to one level

export type Mutation =
  | { kind: 'move-limit'; delta: number }
  | { kind: 'remove-piece'; square: string; piece: PieceType }
  | { kind: 'add-pawn'; square: string }
  | { kind: 'add-hunter'; square: string; piece: 'knight' | 'bishop' };

export function describeMutation(m: Mutation): string {
  switch (m.kind) {
    case 'move-limit': return `${m.delta > 0 ? 'raise' : 'lower'} the move budget by ${Math.abs(m.delta)}`;
    case 'remove-piece': return `remove the ${m.piece} on ${m.square}`;
    case 'add-pawn': return `add a pawn on ${m.square}`;
    case 'add-hunter': return `add a ${m.piece} on ${m.square}`;
  }
}

export function applyMutation(p: RunPuzzle, m: Mutation): RunPuzzle {
  const out: RunPuzzle = { ...p, pieces: p.pieces.map((x) => ({ ...x })), hazards: p.hazards?.map((h) => ({ ...h })) };
  switch (m.kind) {
    case 'move-limit':
      if (typeof p.moveLimit === 'number') out.moveLimit = Math.max(4, p.moveLimit + m.delta);
      return out;
    case 'remove-piece': {
      const c = fromSquare(m.square);
      out.pieces = out.pieces.filter((x) => !(x.file === c.file && x.rank === c.rank));
      return out;
    }
    case 'add-pawn': {
      const c = fromSquare(m.square);
      out.pieces.push({ type: 'pawn', color: 'black', file: c.file, rank: c.rank });
      return out;
    }
    case 'add-hunter': {
      const c = fromSquare(m.square);
      out.pieces.push({ type: m.piece, color: 'black', file: c.file, rank: c.rank });
      return out;
    }
  }
}

function occupied(p: RunPuzzle, f: number, r: number): boolean {
  return p.pieces.some((x) => x.file === f && x.rank === r) || (p.hazards ?? []).some((h) => h.file === f && h.rank === r);
}
function inBounds(f: number, r: number): boolean {
  return f >= 1 && f <= 8 && r >= 1 && r <= 8;
}

/** The hunter (non-pawn, non-king) nearest the king — the guard whose removal opens him up most. */
export function nearestHunter(p: RunPuzzle): EnemyPiece | null {
  const king = p.pieces.find((x) => x.type === 'king');
  const hunters = p.pieces.filter((x) => x.type !== 'pawn' && x.type !== 'king');
  if (!king || hunters.length === 0) return null;
  const d = (x: EnemyPiece) => Math.max(Math.abs(x.file - king.file), Math.abs(x.rank - king.rank));
  return hunters.reduce((a, b) => (d(b) < d(a) ? b : a));
}

/** A square from which a new pawn would defend an existing key (first piece on a king line). */
export function pawnDefenderSquareForKey(p: RunPuzzle): string | null {
  const king = p.pieces.find((x) => x.type === 'king');
  if (!king) return null;
  const pen = new Set(p.kingPen ?? []);
  for (const [df, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
    let f = king.file + df;
    let r = king.rank + dr;
    while (inBounds(f, r)) {
      if ((p.hazards ?? []).some((h) => h.file === f && h.rank === r)) break;
      const piece = p.pieces.find((x) => x.file === f && x.rank === r);
      if (piece) {
        // A black pawn on (f±1, r+1) attacks (f, r).
        for (const side of [-1, 1]) {
          const pf = f + side;
          const pr = r + 1;
          if (!inBounds(pf, pr) || occupied(p, pf, pr) || pen.has(toSquare({ file: pf, rank: pr }))) continue;
          return toSquare({ file: pf, rank: pr });
        }
        break;
      }
      f += df;
      r += dr;
    }
  }
  return null;
}

/** A free square on the approach (rank 3, then 4) for an extra hunter. */
export function hunterSquare(p: RunPuzzle): string | null {
  const pen = new Set(p.kingPen ?? []);
  for (const r of [3, 4]) {
    for (const f of [4, 5, 3, 6, 2, 7, 1, 8]) {
      if (occupied(p, f, r)) continue;
      const sq = toSquare({ file: f, rank: r });
      if (pen.has(sq)) continue;
      return sq;
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hypotheses + experiments

export interface Hypothesis {
  id: string;
  runId: string;
  level: number;
  mutation: Mutation;
  loadout: string;
  /** What the mutation should do to this loadout's win % (pts). */
  predictedDelta: number;
  predictedPct: number;
  baselinePct: number;
  predictionSource: 'regression' | 'mode-slope' | 'rule-of-thumb';
  text: string;
  why: string;
}

export interface ExperimentResult extends Hypothesis {
  date: string;
  /** Smoke-run result — kept in the ledger for the record but never counts as "tested". */
  quick?: boolean;
  trials: number;
  actualPct: number;
  actualDelta: number;
  verdict: 'confirmed' | 'falsified' | 'inconclusive';
}

export interface HypothesisInput {
  date: string;
  runId: string;
  summary: LevelSummary[];
  /** Realistic-tier cells for this run (authored). */
  cells: Cell[];
  /** Rookie-mode no-ability cells (to read the +4-moves slope) — may be empty. */
  rookieCells: Cell[];
  featuresByLevel: Record<number, RevengeFeatures>;
  fitNone: RidgeFit | null;
  fitFloor: RidgeFit | null;
  prior: ExperimentResult[];
}

const RULE_OF_THUMB: Partial<Record<FeatureKey, number>> = {
  moveLimit: 4,        // +4 pts no-ability per extra move (L6–L10 reading from docs/revenge-playtest.md)
  hunters: -8,
  hunterPower: -1.5,
  pawnDefendedKeys: -15,
  pawns: -3,
  totalEnemies: -4,
};

function clampPct(x: number): number {
  return Math.max(0, Math.min(100, Math.round(x)));
}

function featureDeltaFor(m: Mutation, f: RevengeFeatures | undefined, puzzle: RunPuzzle): Partial<Record<FeatureKey, number>> {
  void f;
  switch (m.kind) {
    case 'move-limit':
      return typeof puzzle.moveLimit === 'number' ? { moveLimit: m.delta, budgetSlack: m.delta } : {};
    case 'remove-piece': {
      const isPawn = m.piece === 'pawn';
      const power = m.piece === 'queen' ? 9 : isPawn ? 0 : 3;
      return {
        totalEnemies: -1,
        hunters: isPawn ? 0 : -1,
        pawns: isPawn ? -1 : 0,
        marchers: isPawn ? -1 : 0,
        hunterPower: -power,
        material: -(isPawn ? 1 : power),
      };
    }
    case 'add-pawn':
      return { totalEnemies: 1, pawns: 1, marchers: 1, material: 1, pawnDefendedKeys: 1, defendedKeys: 1 };
    case 'add-hunter':
      return { totalEnemies: 1, hunters: 1, hunterPower: 3, material: 3 };
  }
}

function predict(
  m: Mutation,
  level: number,
  loadout: string,
  input: HypothesisInput,
): { delta: number; source: Hypothesis['predictionSource'] } {
  const puzzle = puzzleFor({ runId: input.runId }, level);
  const fd = featureDeltaFor(m, input.featuresByLevel[level], puzzle);
  // Move budget: the rookie mode IS a +4-moves experiment on every level — read the slope from it.
  if (m.kind === 'move-limit' && loadout === 'none') {
    const rk = input.rookieCells.find((c) => c.level === level && c.loadout === 'none');
    const base = input.cells.find((c) => c.level === level && c.loadout === 'none');
    if (rk && base && level > 4) {
      const slope = (winPct(rk) - winPct(base)) / 4;
      if (slope > 0) return { delta: slope * m.delta, source: 'mode-slope' };
    }
  }
  const fit = loadout === 'none' ? input.fitNone : input.fitFloor;
  const reg = predictDelta(fit, fd);
  if (reg !== null && fit && fit.samples >= 15 && Math.abs(reg) >= 1) return { delta: reg, source: 'regression' };
  let d = 0;
  for (const [k, v] of Object.entries(fd)) d += (RULE_OF_THUMB[k as FeatureKey] ?? 0) * (v ?? 0);
  return { delta: d, source: 'rule-of-thumb' };
}

function recentlyTested(prior: ExperimentResult[], runId: string, level: number, m: Mutation, days = 7): boolean {
  const cutoff = Date.now() - days * 86400_000;
  return prior.some(
    (e) => !e.quick && e.runId === runId && e.level === level && JSON.stringify(e.mutation) === JSON.stringify(m) && new Date(e.date).getTime() >= cutoff,
  );
}

/** Three concrete, testable tweaks for tonight, from the data. */
export function buildHypotheses(input: HypothesisInput, max = 3): Hypothesis[] {
  const out: Hypothesis[] = [];
  const { runId, summary } = input;
  const cfg: RevengeCfg = { runId };
  const push = (level: number, m: Mutation, loadout: string, why: string) => {
    if (out.length >= max) return;
    if (recentlyTested(input.prior, runId, level, m)) return;
    if (out.some((h) => h.level === level && h.mutation.kind === m.kind && h.loadout === loadout)) return;
    const base = input.cells.find((c) => c.level === level && c.loadout === loadout);
    if (!base) return;
    const baselinePct = winPct(base);
    const { delta, source } = predict(m, level, loadout, input);
    const predictedPct = clampPct(baselinePct + delta);
    const who = loadout === 'none' ? 'no-ability' : loadout;
    out.push({
      id: `${input.date}:${runId}:L${level}:${m.kind}:${loadout}`,
      runId, level, mutation: m, loadout,
      predictedDelta: Math.round(delta), predictedPct, baselinePct, predictionSource: source,
      text: `L${level}: ${describeMutation(m)} → ${who} win goes ${baselinePct}% → about ${predictedPct}%`,
      why,
    });
  };

  // 1) The level furthest outside the band, nudged back with the move budget.
  const late = summary.filter((s) => s.moveLimit !== null);
  const worstMiss = [...summary]
    .filter((s) => !s.inBand)
    .sort((a, b) => Math.abs(b.nonePct - bandFor(b.level).target) - Math.abs(a.nonePct - bandFor(a.level).target))[0];
  if (worstMiss && worstMiss.moveLimit !== null) {
    const dir = worstMiss.bandNote === 'too hard' ? 2 : -2;
    push(worstMiss.level, { kind: 'move-limit', delta: dir }, 'none',
      `L${worstMiss.level} no-ability is ${worstMiss.nonePct}%, ${worstMiss.bandNote} for its band (${bandFor(worstMiss.level).low}-${bandFor(worstMiss.level).high}%). The move budget is the cleanest knob.`);
  } else if (late.length) {
    // Everything in band: probe the tightest late level anyway so we learn the slope.
    const tight = [...late].sort((a, b) => a.nonePct - b.nonePct)[0];
    push(tight.level, { kind: 'move-limit', delta: 2 }, 'none',
      `Every level is in band. L${tight.level} is the tightest (${tight.nonePct}% no-ability) — measuring what +2 moves buys tells us how much room the budget knob has.`);
  }

  // 2) The weakest finisher: remove the guard nearest the king and see if it recovers.
  const weakFin = [...summary].sort((a, b) => a.finisherFloor - b.finisherFloor)[0];
  if (weakFin) {
    const puzzle = puzzleFor(cfg, weakFin.level);
    const h = nearestHunter(puzzle);
    if (h && weakFin.finisherFloor < 100) {
      push(weakFin.level, { kind: 'remove-piece', square: toSquare(h), piece: h.type }, weakFin.worstFinisher.id,
        `${weakFin.worstFinisher.id} is the weakest finisher anywhere (${weakFin.finisherFloor}% on L${weakFin.level}${weakFin.finisherFloor < FINISHER_FLOOR_MIN ? ', below the 80% floor' : ''}). The ${h.type} on ${toSquare(h)} is the hunter closest to the king.`);
    }
  }

  // 3) Piece-count probe on the easiest late level: add a pawn defender to the key,
  //    or if there is no key to defend, add a hunter on the approach.
  const easiestLate = [...summary].filter((s) => s.level >= 5).sort((a, b) => b.nonePct - a.nonePct)[0];
  if (easiestLate) {
    const puzzle = puzzleFor(cfg, easiestLate.level);
    const f = input.featuresByLevel[easiestLate.level];
    const pawnSq = pawnDefenderSquareForKey(puzzle);
    if (pawnSq && f && f.freeKeys > 0) {
      push(easiestLate.level, { kind: 'add-pawn', square: pawnSq }, 'none',
        `L${easiestLate.level} is the softest late level at ${easiestLate.nonePct}% no-ability and its key is undefended. A pawn on ${pawnSq} makes it a pawn-defended key — the pattern L5+ are built on.`);
    } else {
      const sq = hunterSquare(puzzle);
      if (sq) push(easiestLate.level, { kind: 'add-hunter', square: sq, piece: 'knight' }, 'none',
        `L${easiestLate.level} is the softest late level at ${easiestLate.nonePct}% no-ability. One more hunter (knight on ${sq}) tests how steep the piece-count curve is.`);
    }
  }

  // Backfill: opposite-direction budget probe on the hardest level, then a hunter removal.
  if (out.length < max) {
    const hardest = [...summary].filter((s) => s.moveLimit !== null).sort((a, b) => a.nonePct - b.nonePct)[0];
    if (hardest) push(hardest.level, { kind: 'move-limit', delta: 2 }, 'none', `L${hardest.level} is the hardest level (${hardest.nonePct}% no-ability); +2 moves shows how far the budget knob moves it.`);
  }
  if (out.length < max) {
    const mid = [...summary].filter((s) => s.level >= 5).sort((a, b) => Math.abs(a.nonePct - 50) - Math.abs(b.nonePct - 50))[0];
    if (mid) {
      const h = nearestHunter(puzzleFor(cfg, mid.level));
      if (h) push(mid.level, { kind: 'remove-piece', square: toSquare(h), piece: h.type }, 'none', `L${mid.level} sits mid-curve (${mid.nonePct}%); removing its closest hunter (${h.type} ${toSquare(h)}) measures one piece's worth.`);
    }
  }
  return out.slice(0, max);
}

/** Run one hypothesis in-process: mutated puzzle → matrix cell at realistic tier. */
export function runExperiment(h: Hypothesis, date: string, trials: number, quick = false, tier = 'T5'): ExperimentResult {
  const base = puzzleFor({ runId: h.runId }, h.level);
  const mutated = applyMutation(base, h.mutation);
  const cfg: RevengeCfg = { runId: h.runId, puzzles: { [h.level]: mutated } };
  const cell = runMatrixCell(cfg, h.level, h.loadout, trials, tier, true, `exp:${h.id}`);
  const actualPct = winPct(cell);
  const actualDelta = actualPct - h.baselinePct;
  let verdict: ExperimentResult['verdict'] = 'inconclusive';
  const sameDir = Math.sign(actualDelta) === Math.sign(h.predictedDelta) || (Math.abs(actualDelta) <= 5 && Math.abs(h.predictedDelta) <= 5);
  if (sameDir && Math.abs(actualDelta - h.predictedDelta) <= 10) verdict = 'confirmed';
  else if (!sameDir && Math.abs(actualDelta) > 10) verdict = 'falsified';
  else if (Math.abs(actualDelta - h.predictedDelta) > 20) verdict = 'falsified';
  return { ...h, date, quick, trials, actualPct, actualDelta, verdict };
}

// ─────────────────────────────────────────────────────────────────────────────
// Small linear algebra (ported from regression.ts)

export function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}
export function variance(xs: number[]): number {
  const m = mean(xs);
  return xs.length ? xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length : 0;
}
function std(xs: number[], m: number): number {
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, xs.length));
}
export function pearson(xs: number[], ys: number[]): number {
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}
function quartileMeans(xs: number[], ys: number[]): { high: number; low: number } {
  const pairs = xs.map((x, i) => ({ x, y: ys[i] })).sort((a, b) => a.x - b.x);
  const q = Math.max(1, Math.floor(pairs.length / 4));
  return { low: mean(pairs.slice(0, q).map((p) => p.y)), high: mean(pairs.slice(-q).map((p) => p.y)) };
}
function colMeans(X: number[][]): number[] {
  const p = X[0]?.length ?? 0;
  return Array.from({ length: p }, (_, j) => mean(X.map((r) => r[j])));
}
function colStds(X: number[][], means: number[]): number[] {
  return means.map((m, j) => std(X.map((r) => r[j]), m));
}
function mulATA(X: number[][]): number[][] {
  const p = X[0]?.length ?? 0;
  const out = Array.from({ length: p }, () => new Array<number>(p).fill(0));
  for (const row of X) for (let i = 0; i < p; i++) for (let j = 0; j < p; j++) out[i][j] += row[i] * row[j];
  return out;
}
function mulATv(X: number[][], v: number[]): number[] {
  const p = X[0]?.length ?? 0;
  const out = new Array<number>(p).fill(0);
  X.forEach((row, i) => { for (let j = 0; j < p; j++) out[j] += row[j] * v[i]; });
  return out;
}
function solve(aIn: number[][], bIn: number[]): number[] {
  const n = bIn.length;
  const a = aIn.map((r) => [...r]);
  const b = [...bIn];
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(a[r][col]) > Math.abs(a[piv][col])) piv = r;
    [a[col], a[piv]] = [a[piv], a[col]];
    [b[col], b[piv]] = [b[piv], b[col]];
    const d = a[col][col];
    if (Math.abs(d) < 1e-12) continue;
    for (let j = 0; j < n; j++) a[col][j] /= d;
    b[col] /= d;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = a[r][col];
      if (f === 0) continue;
      for (let j = 0; j < n; j++) a[r][j] -= f * a[col][j];
      b[r] -= f * b[col];
    }
  }
  return b;
}
function r2(yTrue: number[], yPred: number[]): number {
  const m = mean(yTrue);
  const ssTot = yTrue.reduce((s, y) => s + (y - m) ** 2, 0);
  const ssRes = yTrue.reduce((s, y, i) => s + (y - yPred[i]) ** 2, 0);
  return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
}
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function shuffled(n: number, seed: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  let s = seed || 1;
  for (let i = n - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}
