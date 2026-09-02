/**
 * Apply a BotAction to a BoardState by calling the appropriate engine fn.
 *
 * This is the bridge between the bot's logical "I want to do X" and the
 * engine's primitives (`applyRookieMove`, `applyAbilityActivate`, etc.).
 *
 * For ability-target actions we collapse the two engine steps (activate →
 * targeted-move) into a single call so the bot's decision is atomic.
 *
 * Returned state may still be on Rookie's turn if Surge was activated (no
 * turn handoff) or if an instant ability was tapped — callers should loop.
 *
 * Support v3 (boulder / smoke / magnet / bodyguard) needs no special casing:
 * boulder + magnet are 'targeted' (activate → applyAbilityTargeted), smoke +
 * bodyguard are 'instant'. Rewind is never emitted by `legalCandidates`.
 */

import {
  abilityLegalMoves,
  applyAbilityActivate,
  applyAbilityCancel,
  applyAbilityMove,
  applyAbilityTargeted,
  applyControlledAllyMove,
  applySquireMove,
  boulderTargets,
  stepDroneTurn,
} from '../../../lib/run/abilities';
import { applyRookieMove } from '../../../lib/run/engine';
import { ABILITY_DEFS } from '../../../lib/run/abilities';
import type { BoardState } from '../../../lib/run/types';
import type { BotAction } from '../types';

export function applyBotAction(state: BoardState, action: BotAction): BoardState {
  switch (action.kind) {
    case 'move':
      return applyRookieMove(state, action.target);

    case 'squire-move':
      // `from` names which controlled summon moves; legacy actions without it
      // mean the (single) Squire.
      return action.from
        ? applyControlledAllyMove(state, action.from, action.target)
        : applySquireMove(state, action.target);

    case 'activate-ability': {
      let next = applyAbilityActivate(state, action.abilityId);
      // Drones: the UI ticks the swarm one step at a time; headless, run the
      // whole phase so control returns to Rookie before the bot decides again.
      let guard = 0;
      while (next.turn === 'drones' && next.status === 'playing' && guard < 64) {
        next = stepDroneTurn(next);
        guard++;
      }
      return next;
    }

    case 'ability-target': {
      const activated = applyAbilityActivate(state, action.abilityId);
      if (!activated.activeAbility) {
        // Activation rejected (no uses, no ownership, etc.). Return state untouched.
        return state;
      }
      const def = ABILITY_DEFS[action.abilityId];
      if (def.activation === 'movement') {
        return applyAbilityMove(activated, action.abilityId, action.target);
      }
      if (def.activation === 'targeted') {
        let next = applyAbilityTargeted(activated, action.abilityId, action.target);
        // Magnet is two-step (grab, then CHOOSE the landing square). Resolve
        // the second tap here so the bot's decision stays atomic; without a
        // target2 (legacy actions) fall back to the farthest landing.
        if (
          action.abilityId === 'magnet' &&
          next.activeAbility?.id === 'magnet' &&
          next.activeAbility.step === 'pick-square'
        ) {
          const landing =
            action.target2 ??
            abilityLegalMoves(next, 'magnet')[abilityLegalMoves(next, 'magnet').length - 1];
          next = landing
            ? applyAbilityTargeted(next, 'magnet', landing)
            : applyAbilityCancel(next);
          if (next.activeAbility) next = applyAbilityCancel(next);
        }
        // Boulder T4 owes a FREE second placement (each use drops 2). Resolve
        // it greedily here — nearest legal square to the king (else to
        // Rookie) — so the bot's action stays atomic and no bot ever sees an
        // armed activeAbility.
        if (
          action.abilityId === 'boulder' &&
          next.activeAbility?.id === 'boulder' &&
          (next.boulderDropsLeft ?? 0) > 0
        ) {
          const king = next.pieces.find((p) => p.type === 'king');
          const anchor = king ?? next.rookie;
          const cheb = (a: { file: number; rank: number }) =>
            Math.max(Math.abs(a.file - anchor.file), Math.abs(a.rank - anchor.rank));
          const best = [...boulderTargets(next)].sort((a, b) => cheb(a) - cheb(b))[0];
          next = best ? applyAbilityTargeted(next, 'boulder', best) : applyAbilityCancel(next);
        }
        return next;
      }
      return activated;
    }

    case 'pick-offer':
    case 'dismiss-offer':
      // These are handled separately by the simulate loop, not via applyBotAction.
      return state;
  }
}
