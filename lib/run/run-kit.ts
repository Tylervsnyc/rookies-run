/**
 * Shared builders for AUTHORED runs that live in their own files.
 *
 * `runs.ts` is a 6.9k-line hand-tuned catalogue and defines these helpers
 * privately. When several authors (or agents) build runs at once, all editing
 * that one file guarantees conflicts. So a new run gets its own module under
 * `lib/run/runs/` and imports its builders from here; `extra-runs.ts` is the
 * only shared file, and it holds one import + one array entry per run.
 *
 * These are intentionally byte-equivalent to the private helpers in runs.ts
 * (duplicated rather than extracted, so nothing in that tuned file moves).
 */

import type {
  Coord,
  EnemyPiece,
  KingBehavior,
  RookieForm,
  RunPuzzle,
  WinCondition,
} from './types';
import type { LevelBuilder, RunDef } from './runs';

export type { LevelBuilder, RunDef };

export const pawn = (file: number, rank: number): EnemyPiece => ({ type: 'pawn', color: 'black', file, rank });
export const knight = (file: number, rank: number): EnemyPiece => ({ type: 'knight', color: 'black', file, rank });
export const bishop = (file: number, rank: number): EnemyPiece => ({ type: 'bishop', color: 'black', file, rank });
export const queen = (file: number, rank: number): EnemyPiece => ({ type: 'queen', color: 'black', file, rank });
export const king = (file: number, rank: number): EnemyPiece => ({ type: 'king', color: 'black', file, rank });

/** A board coordinate: file 1-8 = a-h, rank 1-8. */
export const X = (file: number, rank: number): Coord => ({ file, rank });

export const KING_GOAL = { winCondition: 'king' as const };
/** King stands his ground. */
export const STILL = { ...KING_GOAL, kingBehavior: 'still' as const };
/** King runs — the Revenge default. */
export const FLEE = { ...KING_GOAL, kingBehavior: 'flee' as const };

export function make(
  level: number,
  pieces: EnemyPiece[],
  opts: {
    hazards?: Coord[];
    moveLimit?: number;
    allowedForms?: RookieForm[];
    enemiesPerTurn?: number;
    winCondition?: WinCondition;
    kingBehavior?: KingBehavior;
    kingPen?: string[];
  } = {},
): LevelBuilder {
  return (rookieStart) => ({
    level,
    rookieStart,
    pieces: pieces.map((p) => ({ ...p })),
    hazards: opts.hazards?.map((h) => ({ ...h })),
    moveLimit: opts.moveLimit,
    allowedForms: opts.allowedForms,
    enemiesPerTurn: opts.enemiesPerTurn,
    ...(opts.winCondition ? { winCondition: opts.winCondition } : {}),
    ...(opts.kingBehavior ? { kingBehavior: opts.kingBehavior } : {}),
    ...(opts.kingPen ? { kingPen: [...opts.kingPen] } : {}),
  });
}
