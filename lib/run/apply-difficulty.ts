/**
 * Rookie's Revenge — apply a difficulty mode to an authored level.
 *
 * Called ONCE, inside `puzzleToBoardState` (lib/run/seed.ts), when the carry
 * has a `difficulty`. Everything downstream reads the adjusted puzzle /
 * `state.difficulty` — never re-apply.
 */

import { DIFFICULTIES, type DifficultyId } from './difficulty';
import { getRunById, isKnownRunId } from './runs';
import type { RunPuzzle } from './types';

/** Levels 1–4 are the "early" band for the Rookie mode's still king. */
const STILL_EARLY_MAX_LEVEL = 4;
/** Floor for an adjusted move limit — never make a level physically impossible. */
const MOVE_LIMIT_FLOOR = 6;

export function applyDifficulty(puzzle: RunPuzzle, d: DifficultyId, runId?: string): RunPuzzle {
  const def = DIFFICULTIES[d];
  if (!def) return puzzle;
  // Per-run override (RunDef.difficultyOverrides): a key present replaces that
  // difficulty's global delta FOR THIS RUN ONLY. See the doc comment on
  // RunDef.difficultyOverrides for why a run ever needs one.
  const ov = runId && isKnownRunId(runId) ? getRunById(runId).difficultyOverrides?.[d] : undefined;
  const enemiesPerTurnDelta = ov?.enemiesPerTurnDelta ?? def.enemiesPerTurnDelta;
  const moveLimitDelta = ov?.moveLimitDelta ?? def.moveLimitDelta;
  const out: RunPuzzle = { ...puzzle };
  const authoredEpt = puzzle.enemiesPerTurn ?? 1;
  out.enemiesPerTurn = Math.max(1, authoredEpt + enemiesPerTurnDelta);
  if (typeof puzzle.moveLimit === 'number') {
    out.moveLimit = Math.max(MOVE_LIMIT_FLOOR, puzzle.moveLimit + moveLimitDelta);
  }
  if (puzzle.winCondition === 'king') {
    if (def.king === 'flee') {
      out.kingBehavior = 'flee';
    } else if (def.king === 'still-early') {
      out.kingBehavior =
        puzzle.level <= STILL_EARLY_MAX_LEVEL ? 'still' : (puzzle.kingBehavior ?? 'still');
    }
    // 'authored' → untouched.
  }
  return out;
}
