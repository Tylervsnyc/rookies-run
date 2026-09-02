/**
 * Rookies Run scoring.
 *
 * One number, derived from four forces:
 *   - Move economy        (lower = better)
 *   - Capture value       (richer captures = bonus)
 *   - Speed               (fewer seconds = better)
 *   - Level completion    (each cleared level pays a flat bonus)
 *   - Tempo on hand       (leftover tempo at run end pays a small bonus)
 *
 * Formula:
 *   score = BASE
 *         − MOVE_PENALTY × moves
 *         + Σ piece_value(captured)
 *         − TIME_PENALTY × seconds
 *         + LEVEL_BONUS × levelsCleared
 *         + TEMPO_REMAINING_BONUS × tempoRemaining
 *
 * Score is never negative — we clamp at 0.
 */

import { DIFFICULTIES, type DifficultyId } from './difficulty';
import type { BoardState, PieceType, RunPuzzle } from './types';

export const SCORE = {
  BASE: 1000,
  MOVE_PENALTY: 25,
  TIME_PENALTY_PER_SEC: 2,
  LEVEL_BONUS: 250,
  TEMPO_REMAINING_BONUS: 15,
} as const;

export const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 10,
  knight: 30,
  bishop: 30,
  queen: 90,
  king: 100,
};

/** Tempo gained when Rookie captures a piece of the given type. */
export const TEMPO_REWARD: Record<PieceType, number> = {
  pawn: 1,
  knight: 2,
  bishop: 2,
  queen: 4,
  king: 4,
};

/** Maximum tempo Rookie can hold at once (default / rank8 levels). */
export const TEMPO_MAX = 8;

/** Tempo cap on king-capture levels (Rookie's Revenge) — a longer meter. */
export const TEMPO_MAX_KING = 12;

/**
 * Per-level tempo cap. King levels (`winCondition === 'king'`) get the
 * longer meter, sized by difficulty (normal = TEMPO_MAX_KING); everything
 * else keeps TEMPO_MAX.
 */
export function tempoMaxFor(
  state:
    | (Pick<BoardState, 'winCondition'> & { difficulty?: DifficultyId })
    | Pick<RunPuzzle, 'winCondition'>,
): number {
  if (state.winCondition !== 'king') return TEMPO_MAX;
  const d = (state as { difficulty?: DifficultyId }).difficulty;
  return d && DIFFICULTIES[d] ? DIFFICULTIES[d].tempoMaxKing : TEMPO_MAX_KING;
}

/** Difficulty score multiplier (1 when unset / unknown). */
export function scoreMultFor(d: DifficultyId | undefined): number {
  return d && DIFFICULTIES[d] ? DIFFICULTIES[d].scoreMult : 1;
}

export interface ScoreInput {
  moves: number;
  captures: PieceType[];
  elapsedMs: number;
  levelsCleared?: number;
  tempoRemaining?: number;
}

export interface ScoreBreakdown {
  base: number;
  movePenalty: number; // negative number
  captureBonus: number; // positive number
  timePenalty: number; // negative number
  levelBonus: number; // positive number
  tempoBonus: number; // positive number
  seconds: number;
  total: number; // clamped >= 0
}

// ─────────────────────────────────────────────────────────────────────────────
// Timed score (TESTING, 2026-09-02) — computed ALONGSIDE the classic score,
// never submitted to the leaderboard yet. Each cleared level pays
// levelPoints × speedMult, where speedMult scales 1.5 (fast) down to 0.8
// (slow) against a par time of 12s + 4s per enemy on the level. A brisk
// human clearing at par lands at exactly 1.0×.
// ─────────────────────────────────────────────────────────────────────────────

export const TIMED_SCORE = {
  PAR_BASE_MS: 12_000,
  PAR_PER_ENEMY_MS: 4_000,
  MULT_MAX: 1.5,
  MULT_MIN: 0.8,
} as const;

/** One cleared level's split, recorded by the run clock (active play only). */
export interface LevelSplit {
  level: number; // 1-indexed
  ms: number; // active-play ms spent on this level (retries included)
  enemies: number; // enemy pieces on the board at level start
  moves: number; // Rookie moves used on the clearing attempt
  captures: PieceType[]; // pieces captured on the clearing attempt
}

export function parMsFor(enemies: number): number {
  return TIMED_SCORE.PAR_BASE_MS + TIMED_SCORE.PAR_PER_ENEMY_MS * enemies;
}

/**
 * Speed multiplier for one level: 1.0 at par, up to 1.5 when twice as fast,
 * floored at 0.8 for slow clears. Linear in par/elapsed so small speedups
 * always pay a little.
 */
export function speedMultFor(ms: number, parMs: number): number {
  if (ms <= 0) return TIMED_SCORE.MULT_MAX;
  const raw = 0.5 + 0.5 * (parMs / ms);
  return Math.min(TIMED_SCORE.MULT_MAX, Math.max(TIMED_SCORE.MULT_MIN, raw));
}

/** Base points a level is worth before the speed multiplier. */
export function levelPointsFor(split: Pick<LevelSplit, 'captures'>): number {
  return (
    SCORE.LEVEL_BONUS +
    split.captures.reduce((sum, t) => sum + (PIECE_VALUES[t] ?? 0), 0)
  );
}

export interface TimedScoreLevel {
  level: number;
  ms: number;
  parMs: number;
  mult: number;
  points: number; // rounded levelPoints × mult
}

export function computeTimedScore(splits: LevelSplit[]): {
  total: number;
  perLevel: TimedScoreLevel[];
} {
  const perLevel = splits.map((s) => {
    const parMs = parMsFor(s.enemies);
    const mult = speedMultFor(s.ms, parMs);
    return {
      level: s.level,
      ms: s.ms,
      parMs,
      mult,
      points: Math.round(levelPointsFor(s) * mult),
    };
  });
  return { total: perLevel.reduce((sum, l) => sum + l.points, 0), perLevel };
}

export function computeScore(input: ScoreInput): ScoreBreakdown {
  const base = SCORE.BASE;
  const movePenalty = -SCORE.MOVE_PENALTY * input.moves;
  const captureBonus = input.captures.reduce(
    (sum, t) => sum + (PIECE_VALUES[t] ?? 0),
    0,
  );
  const seconds = Math.max(0, Math.round(input.elapsedMs / 1000));
  const timePenalty = -SCORE.TIME_PENALTY_PER_SEC * seconds;
  const levelBonus = SCORE.LEVEL_BONUS * (input.levelsCleared ?? 0);
  const tempoBonus = SCORE.TEMPO_REMAINING_BONUS * (input.tempoRemaining ?? 0);
  const raw =
    base + movePenalty + captureBonus + timePenalty + levelBonus + tempoBonus;
  return {
    base,
    movePenalty,
    captureBonus,
    timePenalty,
    levelBonus,
    tempoBonus,
    seconds,
    total: Math.max(0, raw),
  };
}
