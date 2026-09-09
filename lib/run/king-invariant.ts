/**
 * The king invariant (2026-09-09).
 *
 * Under the 'king' win condition the enemy king leaves the board ONE way:
 * Rookie (or a summon she steers) captures him, and the level is WON. Every
 * other piece-removing path — a sacrifice blast, poison, a boulder, a snare,
 * an ally's capture, an Aegis kill, a rewind — must leave him standing.
 *
 * Tyler's 2026-09-09 endless run ended with the king simply gone (no win,
 * no loss): a permanent T5 Aegis "killed the attacker", and the attacker was
 * the king walking into the shield. Every public state transition now runs
 * through `enforceKingInvariant`: in dev a violation throws (so it is found
 * at the keyboard, not on a phone); in prod the removal is refused — the king
 * is put back where he stood — and the violation is logged.
 */
import { toSquare } from './types';
import type { BoardState } from './types';

export class KingInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KingInvariantError';
  }
}

function kingOf(state: BoardState) {
  return state.pieces.find((p) => p.type === 'king');
}

/**
 * Check a transition `before → after` produced by `path`. Returns `after`
 * unchanged when the king is still there (or the transition won the level);
 * otherwise throws in dev / restores the king in prod.
 */
export function enforceKingInvariant(
  before: BoardState,
  after: BoardState,
  path: string,
): BoardState {
  if (after === before) return after;
  if (before.winCondition !== 'king') return after;
  if (after.status === 'won') return after;
  const king = kingOf(before);
  if (!king) return after;
  if (kingOf(after)) return after;

  const message =
    `King invariant violated in ${path}: the enemy king left the board without a win ` +
    `(status=${after.status}, turn=${after.turn}, rookie=${toSquare(after.rookie)}, ` +
    `king stood on ${toSquare(king)}, level ${after.level}).`;
  if (process.env.NODE_ENV !== 'production') {
    throw new KingInvariantError(message);
  }
  console.error(message);
  // Refuse the removal: he stands back where he was. If something else has
  // since landed on that square the overlap is visible and logged above —
  // far better than a run that silently cannot be won.
  return { ...after, pieces: [...after.pieces, { ...king }] };
}
