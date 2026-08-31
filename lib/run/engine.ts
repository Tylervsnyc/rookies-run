/**
 * Engine — applies a Rookie move, then runs enemy AI, then checks win/lose.
 *
 * Public surface:
 *   applyRookieMove(state, target)        → new BoardState
 *
 *   - Captures grant tempo (capped at tempoMaxFor(state) — 8, or 12 on king levels).
 *   - When tempo fills, an ability offer is rolled (see lib/run/abilities).
 *   - moveLimit (if set) ends the run when exceeded.
 */

import {
  isLegalRookieMove,
  isWinningMove,
  rookieLegalMoves,
} from './movement';
import {
  breakSmokeOnCapture,
  clearStatusOnSquare,
  ensureRewindTurnStart,
  offerIsExhausted,
  rollOffer,
  stepAllyTurn,
  stepDroneTurn,
  stunKingAfterCapture,
} from './abilities';
import { stepEnemyTurn } from './pawn-ai';
import { mulberry32 } from './seed';
import { TEMPO_REWARD, tempoMaxFor } from './scoring';
import { toSquare } from './types';
import type { BoardState, Coord, RookieForm } from './types';

function offerRngFor(state: BoardState): () => number {
  // Deterministic per (level, moveCount) so replaying the same daily run
  // produces the same offers.
  const seed =
    (state.level * 7919 + state.moveCount * 31 + state.captures.length) >>> 0;
  return mulberry32(seed);
}

export function applyRookieMove(state: BoardState, target: Coord): BoardState {
  if (state.status !== 'playing' || state.turn !== 'rookie') return state;
  if (!isLegalRookieMove(state, target)) return state;

  // Capture handling.
  const captured = state.pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  const pieces = state.pieces.filter(
    (p) => !(p.file === target.file && p.rank === target.rank),
  );

  const tempoGain = captured ? TEMPO_REWARD[captured.type] ?? 0 : 0;
  const tempoMax = tempoMaxFor(state);
  const rawTempo = state.tempo + tempoGain;
  // Only captures can trigger an offer — prevents spurious offers on plain
  // moves when tempo is already at MAX.
  const filled =
    tempoGain > 0 && rawTempo >= tempoMax && state.pendingOffer === null;
  // When the meter fills, freeze it at MAX visually and queue the offer.
  const nextTempo = filled ? tempoMax : Math.min(tempoMax, rawTempo);

  // Form bookkeeping — decrement, revert to rook when expired.
  // formMovesLeft < 0 = locked form (STC mini-runs); no decrement, no revert.
  // King form is special: its value is invulnerability across enemy turns,
  // not extra moves. Its formMovesLeft counts enemy turns and decrements in
  // stepEnemyTurn.endTurn, NOT here. So Rookie stays king through her own
  // move and reverts at the end of the next enemy turn.
  const formLocked = state.formMovesLeft < 0;
  const isKingProtective = state.form === 'king';
  const movesLeftAfter = formLocked || isKingProtective
    ? state.formMovesLeft
    : state.form === 'rook'
      ? 0
      : state.formMovesLeft - 1;
  const nextForm: RookieForm =
    formLocked || isKingProtective || state.form === 'rook'
      ? state.form
      : movesLeftAfter <= 0
        ? 'rook'
        : state.form;
  const nextFormMovesLeft = formLocked || isKingProtective
    ? state.formMovesLeft
    : nextForm === 'rook'
      ? 0
      : movesLeftAfter;

  const nextMoveCount = state.moveCount + 1;

  // Surge bonus-move bookkeeping. If bonus moves are queued, consume one and
  // keep control with Rookie (no enemy turn between the bonus moves). Tempo
  // gain from captures during bonus moves still accrues normally above.
  const hasBonus = state.bonusMovesLeft > 0;
  const nextTurn: BoardState['turn'] = hasBonus ? 'rookie' : 'enemy';
  const nextBonus = hasBonus ? state.bonusMovesLeft - 1 : state.bonusMovesLeft;

  // If Rookie captured the decoyed piece herself, clear the mark.
  const targetSq = toSquare(target);
  const clearDecoy = state.decoyTarget && state.decoyTarget === targetSq;

  // If Rookie just captured a poisoned / rabid / frozen piece, drop its
  // status markers along with the piece itself.
  const statusOverlay = captured ? clearStatusOnSquare(state, targetSq) : null;

  const afterMove: BoardState = {
    ...state,
    ...(statusOverlay ?? {}),
    rookie: { ...target },
    pieces,
    turn: nextTurn,
    moveCount: nextMoveCount,
    captures: captured ? [...state.captures, captured.type] : state.captures,
    tempo: nextTempo,
    form: nextForm,
    formMovesLeft: nextFormMovesLeft,
    bonusMovesLeft: nextBonus,
    cancellableActivation: undefined,
    decoyTarget: clearDecoy ? null : state.decoyTarget,
    decoyTurnsLeft: clearDecoy ? 0 : state.decoyTurnsLeft,
    // Rookie's Revenge: a capture stuns the king for the next enemy turn.
    ...(captured ? stunKingAfterCapture(state) : {}),
    // Smoke: a capture by Rookie herself blows her cover (T5 keeps it).
    ...(captured ? breakSmokeOnCapture(state) : {}),
    // Rewind: first move of a level records the pre-move board as turn start.
    ...ensureRewindTurnStart(state),
  };

  // When the meter fills, roll an offer — unless every ability is maxed, in
  // which case we just keep the tempo (as a small "blessing") and skip the modal.
  let nextPendingOffer = state.pendingOffer;
  let postOfferTempo = nextTempo;
  if (filled) {
    if (offerIsExhausted(afterMove)) {
      nextPendingOffer = null;
      // Keep tempo full as a visible "blessed" state.
      postOfferTempo = tempoMax;
    } else {
      const rolled = rollOffer(afterMove, offerRngFor(afterMove));
      nextPendingOffer = rolled.length > 0 ? rolled : null;
      if (rolled.length === 0) postOfferTempo = tempoMax;
    }
  }
  const withOffer: BoardState = {
    ...afterMove,
    tempo: postOfferTempo,
    pendingOffer: nextPendingOffer,
  };

  // Win check — reaching rank 8 (or capturing the king under the 'king' win
  // condition) wins the level. Evaluated against the pre-move state so the
  // king is still on the target square.
  if (isWinningMove(state, target)) {
    return resolveWin({ state, afterMove, withOffer, nextTempo, filled, nextPendingOffer });
  }

  // Move-limit loss check — over budget = run ends.
  if (afterMove.moveLimit !== null && nextMoveCount >= afterMove.moveLimit) {
    return { ...withOffer, status: 'lost', turn: 'rookie' };
  }

  // Rainbow allies get their own visible phase between Rookie and enemies.
  // If we're not in a Surge bonus chain and we have allies, redirect turn to
  // 'allies' and the UI ticks stepAllyTurn one ally at a time. Otherwise hand
  // straight to the enemy as before.
  // (The Squire is player-controlled — it never needs an AI ally phase.)
  const allyPhaseNeeded = !hasBonus && withOffer.allies.some((a) => a.source !== 'squire');
  if (allyPhaseNeeded) {
    return {
      ...withOffer,
      turn: 'allies',
      allyTurnIndex: 0,
      enemyMovedSquares: [],
      enemyVacatedSquares: [],
    };
  }
  return { ...withOffer, enemyMovedSquares: [], enemyVacatedSquares: [] };
}

/**
 * Shared win bookkeeping for both win conditions. Capture tempo from the
 * winning move still counts (nextTempo includes it), THEN a flat +2 tempo
 * finish bonus on top, capped at the per-level max; roll an offer if that fills it.
 */
function resolveWin(args: {
  state: BoardState;
  afterMove: BoardState;
  withOffer: BoardState;
  nextTempo: number;
  filled: boolean;
  nextPendingOffer: BoardState['pendingOffer'];
}): BoardState {
  const { state, afterMove, withOffer, nextTempo, filled, nextPendingOffer } = args;
  const tempoMax = tempoMaxFor(state);
  const winTempoRaw = nextTempo + 2;
  const winTempo = Math.min(tempoMax, winTempoRaw);
  let winPendingOffer = state.pendingOffer ?? null;
  if (filled) {
    winPendingOffer = nextPendingOffer;
  } else if (winPendingOffer === null && winTempoRaw >= tempoMax) {
    if (!offerIsExhausted(afterMove)) {
      const rolled = rollOffer(afterMove, offerRngFor(afterMove));
      winPendingOffer = rolled.length > 0 ? rolled : null;
    }
  }
  return {
    ...withOffer,
    status: 'won',
    turn: 'rookie',
    tempo: winPendingOffer ? tempoMax : winTempo,
    pendingOffer: winPendingOffer,
  };
}

/** Re-export the single-step enemy advance for the UI. */
export { stepEnemyTurn };
/** Re-export the single-step ally advance for the UI. */
export { stepAllyTurn };
/** Re-export the single-step drone advance for the UI. */
export { stepDroneTurn };

/** Re-export helpers for the renderer. */
export { rookieLegalMoves };
// Keep RookieForm imported for downstream re-exports / typing parity.
export type { RookieForm };

export {
  applyAbilityActivate,
  applyAbilityCancel,
  applyAbilityMove,
  applyAbilityTargeted,
  applyOfferPick,
  applyDismissOffer,
  abilityLegalMoves,
  applySquireMove,
  squireLegalMoves,
  squireOf,
  canMoveSquire,
} from './abilities';
