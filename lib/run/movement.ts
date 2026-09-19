/**
 * Rookie's movement — dispatches by current form (rook | knight | bishop).
 *
 * Sliders (rook, bishop) ray outward in their directions until blocked.
 * Knight jumps to the 8 L-squares, skipping pieces in between.
 *
 * Rookie may never land on a hazard square.
 */

import type { BoardState, Coord, EnemyPiece, RookieForm } from './types';
import { coordEq, toSquare } from './types';

const ROOK_DIRS: ReadonlyArray<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const BISHOP_DIRS: ReadonlyArray<[number, number]> = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const KING_DELTAS: ReadonlyArray<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const KNIGHT_DELTAS: ReadonlyArray<[number, number]> = [
  [1, 2],
  [2, 1],
  [-1, 2],
  [-2, 1],
  [1, -2],
  [2, -1],
  [-1, -2],
  [-2, -1],
];

/** Find an enemy piece at the given square, or undefined. */
export function enemyAt(pieces: EnemyPiece[], at: Coord): EnemyPiece | undefined {
  return pieces.find((p) => p.file === at.file && p.rank === at.rank);
}

function isHazard(hazards: Coord[], at: Coord): boolean {
  return hazards.some((h) => h.file === at.file && h.rank === at.rank);
}

/** True if a friendly ally occupies this square — blocks Rookie's movement. */
function isAlly(state: BoardState, at: Coord): boolean {
  if (state.scarecrow && state.scarecrow.square === toSquare(at)) return true; // the straw is a body
  return (state.allies ?? []).some((a) => a.file === at.file && a.rank === at.rank);
}

function slideMoves(
  state: BoardState,
  dirs: ReadonlyArray<[number, number]>,
): Coord[] {
  const moves: Coord[] = [];
  const { rookie, pieces, hazards } = state;
  for (const [df, dr] of dirs) {
    let f = rookie.file + df;
    let r = rookie.rank + dr;
    while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
      const square = { file: f, rank: r };
      if (isHazard(hazards, square)) break; // hazard blocks the ray
      if (isAlly(state, square)) break; // friendly ally — can't pass through
      const blocker = enemyAt(pieces, square);
      if (blocker) {
        moves.push(square);
        break;
      }
      moves.push(square);
      f += df;
      r += dr;
    }
  }
  return moves;
}

function knightMoves(state: BoardState): Coord[] {
  const moves: Coord[] = [];
  const { rookie, hazards } = state;
  for (const [df, dr] of KNIGHT_DELTAS) {
    const f = rookie.file + df;
    const r = rookie.rank + dr;
    if (f < 1 || f > 8 || r < 1 || r > 8) continue;
    const square = { file: f, rank: r };
    if (isHazard(hazards, square)) continue;
    if (isAlly(state, square)) continue;
    moves.push(square);
  }
  return moves;
}

function pawnMoves(state: BoardState): Coord[] {
  const moves: Coord[] = [];
  const { rookie, pieces, hazards } = state;
  const forward = { file: rookie.file, rank: rookie.rank + 1 };
  if (
    forward.rank <= 8 &&
    !isHazard(hazards, forward) &&
    !enemyAt(pieces, forward) &&
    !isAlly(state, forward)
  ) {
    moves.push(forward);
  }
  for (const df of [-1, 1]) {
    const sq = { file: rookie.file + df, rank: rookie.rank + 1 };
    if (sq.file < 1 || sq.file > 8 || sq.rank > 8) continue;
    if (isHazard(hazards, sq)) continue;
    if (isAlly(state, sq)) continue;
    if (enemyAt(pieces, sq)) moves.push(sq);
  }
  return moves;
}

function kingMoves(state: BoardState): Coord[] {
  const moves: Coord[] = [];
  const { rookie, hazards } = state;
  for (const [df, dr] of KING_DELTAS) {
    const f = rookie.file + df;
    const r = rookie.rank + dr;
    if (f < 1 || f > 8 || r < 1 || r > 8) continue;
    const square = { file: f, rank: r };
    if (isHazard(hazards, square)) continue;
    if (isAlly(state, square)) continue;
    moves.push(square);
  }
  return moves;
}

// ---------------------------------------------------------------------------
// Ricochet (2026-09-19) — rule R4: STONE IS A MIRROR, LAVA IS NOT.
// While armed (`state.ricochetBanks`), a rook slide that reaches the square
// BEFORE a stone may turn 90 degrees, left or right, and keep sliding; she may
// capture at the end of the banked line, the king included. Only a stone
// banks her: lava, a piece, a summon and the board edge all just stop her.
// Each leg must actually slide (at least one square) before it banks.
// Design: docs/new-abilities-2026-09-19.md §9.
// ---------------------------------------------------------------------------

export interface RicochetPath {
  /** Where she ends up. */
  dest: Coord;
  /** Every square she passes through, corner squares included, ending on `dest`. */
  path: Coord[];
  /** How many times the line banked (1, or 2 from T3). */
  banks: number;
}

/**
 * Every BANKED line open to her right now (straight lines are not listed —
 * those are ordinary rook moves). One path per destination: the one with the
 * fewest banks, first found in a fixed direction order, so the drawn path is
 * always the path she takes.
 */
export function ricochetPaths(state: BoardState): RicochetPath[] {
  const maxBanks = state.ricochetBanks ?? 0;
  if (maxBanks <= 0 || state.form !== 'rook') return [];
  const { rookie, pieces, hazards } = state;
  const straight = new Set(slideMoves(state, ROOK_DIRS).map((m) => toSquare(m)));
  const found = new Map<string, RicochetPath>();
  const walk = (
    from: Coord,
    dir: readonly [number, number],
    banksUsed: number,
    trail: Coord[],
  ): void => {
    let cur = from;
    const leg: Coord[] = [];
    for (;;) {
      const next = { file: cur.file + dir[0], rank: cur.rank + dir[1] };
      if (next.file < 1 || next.file > 8 || next.rank < 1 || next.rank > 8) return;
      const hz = hazards.find((h) => h.file === next.file && h.rank === next.rank);
      if (hz) {
        // Only STONE banks her, and only after a real slide on this leg.
        if (hz.kind !== 'lava' && banksUsed < maxBanks && leg.length > 0) {
          const perps: ReadonlyArray<[number, number]> =
            dir[0] === 0 ? [[-1, 0], [1, 0]] : [[0, 1], [0, -1]];
          for (const perp of perps) walk(cur, perp, banksUsed + 1, [...trail, ...leg]);
        }
        return;
      }
      if (isAlly(state, next)) return;
      if (coordEq(next, rookie)) return; // never back through her own square
      leg.push(next);
      if (banksUsed > 0) {
        const key = toSquare(next);
        const prev = found.get(key);
        if (!straight.has(key) && (!prev || prev.banks > banksUsed)) {
          found.set(key, { dest: next, path: [...trail, ...leg], banks: banksUsed });
        }
      }
      if (enemyAt(pieces, next)) return; // a capture ends the line
      cur = next;
    }
  };
  for (const dir of ROOK_DIRS) walk(rookie, dir, 0, []);
  return [...found.values()];
}

/** Returns the list of squares Rookie can legally move to from her current position. */
export function rookieLegalMoves(state: BoardState): Coord[] {
  switch (state.form) {
    case 'knight':
      return knightMoves(state);
    case 'bishop':
      return slideMoves(state, BISHOP_DIRS);
    case 'queen':
      return [...slideMoves(state, ROOK_DIRS), ...slideMoves(state, BISHOP_DIRS)];
    case 'king':
      return kingMoves(state);
    case 'pawn':
      return pawnMoves(state);
    case 'rook':
    default:
      // Ricochet adds her banked lines — on HER turn only. The court and the
      // king plan against her straight lines (their views are read during the
      // enemy phase), which is the card: a line he does not see coming.
      if ((state.ricochetBanks ?? 0) > 0 && state.turn === 'rookie') {
        return [...slideMoves(state, ROOK_DIRS), ...ricochetPaths(state).map((p) => p.dest)];
      }
      return slideMoves(state, ROOK_DIRS);
  }
}

/** True if `target` is a legal Rookie destination from the current state. */
export function isLegalRookieMove(state: BoardState, target: Coord): boolean {
  return rookieLegalMoves(state).some((m) => coordEq(m, target));
}

/** Cost in tempo to transform into a given form. Rook is free (auto-revert). */
export function transformCost(form: RookieForm): number {
  switch (form) {
    case 'knight':
      return 2;
    case 'bishop':
      return 3;
    case 'queen':
      return 4;
    case 'king':
      return 4;
    case 'pawn':
      return 0;
    case 'rook':
      return 0;
  }
}

/** How many Rookie moves a transformation lasts before auto-revert. */
export const FORM_DURATION = 3;

/**
 * Does landing on `target` (evaluated against the PRE-move state) win the
 * level? Default = reach rank 8. Under the 'king' win condition (Rookie's
 * Revenge) it's capturing the enemy king instead — rank 8 is just a row.
 */
export function isWinningMove(state: BoardState, target: Coord): boolean {
  if (state.winCondition === 'king') {
    return state.pieces.some(
      (p) => p.type === 'king' && p.file === target.file && p.rank === target.rank,
    );
  }
  return target.rank === 8;
}
