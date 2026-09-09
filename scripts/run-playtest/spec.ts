/**
 * THE CONTRACT — the one place the numbers that grade Rookie's Revenge live.
 *
 * Before 2026-09-09 there were five: a no-ability band in the README, a
 * new-player 40-60% rule in revenge-analysis.ts, a `runDifficulty` score in the
 * same file, a 60-80 pair band in combo-discover.ts, and docs/LADDER-SPEC.md's
 * six checks known only to ladder-audit.ts. Every report graded against a
 * different one, so the same run read TOO EASY in one and PASS in another.
 *
 * This module is docs/LADDER-SPEC.md as code. Change a number here and in that
 * doc, nowhere else. Everything that grades imports from here:
 * ladder-audit.ts, revenge-analysis.ts (verdictFor), revenge-digest.ts,
 * combo-discover.ts, engine-regression.
 *
 * Measurement method every number of record uses: Normal difficulty, T5 bot,
 * T1 cards (`realistic: false`), `--jobs=1` or the sharded-deterministic path
 * (matrix-determinism-check.ts proves both agree).
 */

// ── The six checks (docs/LADDER-SPEC.md) ────────────────────────────────────

/** Rung index is 1-based, 1..10. */
export const RUNG_COUNT = 10;
/** The finale: the four levels the combo gate is measured on. */
export const FINALE_LEVELS: ReadonlyArray<number> = [7, 8, 9, 10];

/** 1. GATE — every single kit card, and no-ability, clears ≤ this on each finale level. */
export const GATE_SINGLE_MAX = 8;
export const GATE_NONE_MAX = 8;

/** 2. USED — pair beats the best single by ≥ USED_MIN_GAP points on ≥ USED_MIN_LEVELS finale levels. */
export const USED_MIN_GAP = 50;
export const USED_MIN_LEVELS = 3;

/** 3. BAND — pair clear mean over the finale, sloped by rung. */
export const bandTarget = (rung: number): number => 80 - 3 * (rung - 1);
export const BAND_TOL = 8;

/** 4. RUN — full-run clear at the real retry budget, sloped by rung. */
export const runTarget = (rung: number): number => 65 - 3.3 * (rung - 1);
export const RUN_TOL = 10;

/** 5. SCALE — average enemy pieces per level ≥ floor; L8-L10 avg ≥ L1-L3 avg + gap. */
export const scaleFloor = (rung: number): number => 3 + 0.6 * (rung - 1);
export const SCALE_LATE_GAP = 2;

/** 6. SHAPE — finale pair clears span ≥ this many points, and L10 ≤ L7. */
export const SHAPE_MIN_SPAN = 15;

/**
 * The combo-gate acceptance window used by combo-discover.ts for a level that
 * is not yet on a rung (so has no rung slope): the flat band Tyler named
 * (2026-09-07), which the rung slope (check 3) refines once the level is placed.
 */
export const PAIR_MIN = 60;
export const PAIR_MAX = 80;

// ── Error bars ──────────────────────────────────────────────────────────────

export interface Estimate {
  wins: number;
  n: number;
  /** Point estimate, percent 0..100. */
  pct: number;
  /** Wilson 95% interval, percent. */
  lo: number;
  hi: number;
}

const Z95 = 1.96;

/** Wilson score interval — behaves at 0 and 100%, unlike the normal approximation. */
export function wilson(wins: number, n: number): Estimate {
  if (n <= 0) return { wins, n, pct: 0, lo: 0, hi: 100 };
  const p = wins / n;
  const z2 = Z95 * Z95;
  const denom = 1 + z2 / n;
  const centre = (p + z2 / (2 * n)) / denom;
  const half = (Z95 * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return {
    wins,
    n,
    pct: Math.round(p * 1000) / 10,
    lo: Math.max(0, Math.round((centre - half) * 1000) / 10),
    hi: Math.min(100, Math.round((centre + half) * 1000) / 10),
  };
}

/** Mean of several estimates as one estimate (pooled trials). */
export function pooled(es: Estimate[]): Estimate {
  const wins = es.reduce((a, e) => a + e.wins, 0);
  const n = es.reduce((a, e) => a + e.n, 0);
  return wilson(wins, n);
}

export type Verdict = 'PASS' | 'FAIL' | 'INCONCLUSIVE';
export type Direction = 'ok' | 'easy' | 'hard';

export interface Graded {
  verdict: Verdict;
  /** Which way it fails or leans. */
  direction: Direction;
  /** Trials needed for the interval to fit the window, when INCONCLUSIVE. */
  trialsNeeded?: number;
}

/**
 * Grade an estimate against a window. PASS only when the whole interval sits
 * inside the window; FAIL only when the whole interval is outside it; anything
 * that straddles is INCONCLUSIVE — say so, never round it to a verdict.
 */
export function gradeWindow(e: Estimate, low: number, high: number): Graded {
  if (e.lo >= low && e.hi <= high) return { verdict: 'PASS', direction: 'ok' };
  if (e.hi < low) return { verdict: 'FAIL', direction: 'hard' };
  if (e.lo > high) return { verdict: 'FAIL', direction: 'easy' };
  const direction: Direction = e.pct > high ? 'easy' : e.pct < low ? 'hard' : 'ok';
  return { verdict: 'INCONCLUSIVE', direction, trialsNeeded: trialsForHalfWidth((high - low) / 2, e.pct / 100) };
}

/** Grade "≤ max" claims (the gate). PASS when hi ≤ max, FAIL when lo > max. */
export function gradeCeiling(e: Estimate, max: number): Graded {
  if (e.hi <= max) return { verdict: 'PASS', direction: 'ok' };
  if (e.lo > max) return { verdict: 'FAIL', direction: 'easy' };
  return { verdict: 'INCONCLUSIVE', direction: e.pct > max ? 'easy' : 'ok', trialsNeeded: zeroTrialsForCeiling(max) };
}

// ── Budgets, derived from the windows instead of guessed ────────────────────

/** Trials so that a 95% interval around p has this half-width (in percent points). */
export function trialsForHalfWidth(halfWidthPct: number, p = 0.5): number {
  const h = halfWidthPct / 100;
  const pp = Math.min(Math.max(p, 0.05), 0.95);
  return Math.ceil((Z95 * Z95 * pp * (1 - pp)) / (h * h));
}

/**
 * Trials with ZERO wins needed to claim "≤ max%" at 95% (rule of three:
 * upper bound ≈ 3/n). For the 8% gate that is 38 clean trials.
 */
export function zeroTrialsForCeiling(maxPct: number): number {
  return Math.ceil(300 / maxPct);
}

/** The budgets the contract implies. Nightly may run lighter and report INCONCLUSIVE. */
export const BUDGET = {
  /** Band ±8 at p≈0.7 → 96 trials/cell. */
  bandTrials: trialsForHalfWidth(BAND_TOL, 0.7),
  /** Gate ≤8% → 38 zero-win trials. */
  gateTrials: zeroTrialsForCeiling(GATE_SINGLE_MAX),
  /** Run ±10 at p≈0.5 → 96 full runs. */
  runTrials: trialsForHalfWidth(RUN_TOL, 0.5),
  /** What the 4-core CI runner can afford nightly; grades will often be INCONCLUSIVE and say so. */
  nightly: { trials: 48, runs: 40 },
  /** Quick smoke. */
  quick: { trials: 4, runs: 4 },
} as const;

/** Bot cast rate under this → the cell is a floor, not a verdict; exclude it from claims. */
export const NEVER_CAST_RATE = 0.1;

// ── Rung grade ──────────────────────────────────────────────────────────────

export type RungGrade = 'PASS' | 'BROKEN' | 'TOO EASY' | 'TOO HARD' | 'FLAT' | 'INCONCLUSIVE';

export interface RungChecks {
  gate: Graded;
  used: boolean;
  band: Graded;
  run: Graded;
  scale: boolean;
  shape: boolean;
}

/** docs/LADDER-SPEC.md "Grades", with INCONCLUSIVE when the error bars don't settle it. */
export function rungGrade(c: RungChecks): RungGrade {
  if (c.gate.verdict === 'FAIL') return 'BROKEN';
  const offBand = [c.band, c.run].filter((g) => g.verdict === 'FAIL');
  if (offBand.length) return offBand.some((g) => g.direction === 'hard') ? 'TOO HARD' : 'TOO EASY';
  if (c.gate.verdict === 'INCONCLUSIVE' || c.band.verdict === 'INCONCLUSIVE' || c.run.verdict === 'INCONCLUSIVE') return 'INCONCLUSIVE';
  if (!c.scale || !c.shape) return 'FLAT';
  return 'PASS';
}

export function fmtEstimate(e: Estimate): string {
  return `${Math.round(e.pct)}% [${Math.round(e.lo)}-${Math.round(e.hi)}]`;
}
