/**
 * THE LADDER DENSITY CURVE — enemy count as a function of how far up you are.
 *
 * Tyler, 2026-09-08: "i'm not seeing much difference between the difficulty of
 * levels, can you make sure the more difficult levels have more pieces added?"
 *
 * He is right, and it measures worse than "not much". Authored enemy counts,
 * averaged over each rung's ten levels (2026-09-08):
 *
 *   rung  1 The Slash 2.7 · 2 Glasshouse 1.9 · 3 Stacks 3.7 · 4 Parapet 3.6
 *         5 Moat 4.9 · 6 Lattice 4.9 · 7 Alcove 3.3 · 8 Cliff 4.8
 *         9 Millstone 3.9 · 10 Briar 17.6
 *
 * Rungs 1-9 live between 1.9 and 4.9 with no trend at all — rung 2 holds FEWER
 * pieces than rung 1 — and it is just as flat inside a run: The Slash runs
 * 2,3,2,5,2,2,2,3,3,3, so its L10 is emptier than its L4. The ladder's order is
 * the power curve (see ladder.ts); nothing about the BOARD says "you are near
 * the top" .
 *
 * THE CAVEAT THAT SHAPES THIS FILE: rung 10 already carries 17.6 pieces and is
 * the EASIEST rung on both difficulties (65% Normal / 68% Hard in the
 * 2026-09-08 sweep). Dragon + Sacrifice mows through a crowd. So density is not
 * difficulty on its own, and this curve is a hypothesis to be MEASURED per rung
 * against clear rate, not a knob to crank. Three curves ship here precisely so
 * the sweep picks one instead of me guessing.
 *
 * Two rules keep it safe:
 *   1. It only ever ADDS. `extra = max(0, target - authored)`, so a rung that
 *      already exceeds its target (Briar) is returned untouched. No authored
 *      board is ever thinned, and no hand-built combo gate loses a piece.
 *   2. Placement reuses `withReinforcements` from endless.ts — the same placer
 *      Endless has used at every depth for weeks. It never walls the goal rank,
 *      never drops a piece adjacent to the enemy king, and is seeded, so one
 *      (rung, level) is one board across reloads.
 *
 * Nothing here is wired into the game. `applyLadderDensity` is called by the
 * measurement harness only, until a curve earns its way in.
 */
import { withReinforcements } from './endless';
import type { RunPuzzle } from './types';

export type DensityCurve = 'A' | 'B' | 'C';

/** Never let a curve more than double an authored board, or exceed this. */
const MAX_EXTRA_PER_LEVEL = 10;
const MAX_PIECES = 26;

/**
 * Target enemy count for rung `rungIndex` (0-9), level `levelIndex` (0-9).
 *
 *   A "gentle"      — a shallow climb on both axes; the conservative option.
 *   B "steep"       — rung dominates; the top of the ladder should feel like a
 *                     different game from the bottom.
 *   C "level-heavy" — rung barely matters, the climb happens INSIDE each run,
 *                     which is the axis a player feels in one sitting.
 */
export function ladderTargetPieces(rungIndex: number, levelIndex: number, curve: DensityCurve): number {
  const r = Math.max(0, Math.min(9, rungIndex));
  const l = Math.max(0, Math.min(9, levelIndex));
  switch (curve) {
    case 'A':
      return Math.round(3 + 0.55 * r + 0.25 * l);
    case 'B':
      return Math.round(3 + 1.0 * r + 0.4 * l);
    case 'C':
      return Math.round(2 + 0.4 * r + 0.9 * l);
  }
}

/** Authored puzzle + however many reinforcements the curve asks for. Pure. */
export function applyLadderDensity(
  puzzle: RunPuzzle,
  rungIndex: number,
  levelIndex: number,
  curve: DensityCurve,
  seed = 1,
): RunPuzzle {
  const target = Math.min(MAX_PIECES, ladderTargetPieces(rungIndex, levelIndex, curve));
  const extra = Math.min(MAX_EXTRA_PER_LEVEL, target - puzzle.pieces.length);
  if (extra <= 0) return puzzle; // already at or above target — never thin a board
  return { ...puzzle, pieces: withReinforcements(puzzle, extra, seed, levelIndex + 1) };
}
