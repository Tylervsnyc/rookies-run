/**
 * T3 — Casual. MCTS-rollouts with a low budget.
 *
 * `settleEnemyTurns` is still exported here because simulate.ts and the
 * t4/t5 bots import it from this module. Keep that helper here even though
 * the bot itself is now factory-built.
 */

import { stepAllyTurn, stepDroneTurn } from '../../../lib/run/abilities';
import { stepEnemyTurn } from '../../../lib/run/pawn-ai';
import type { BoardState } from '../../../lib/run/types';
import { createMctsBot } from './mcts';
import type { Bot } from '../types';

export const T3: Bot = createMctsBot({
  id: 'T3',
  name: 'T3 Casual (MCTS-40)',
  rolloutCount: 40,
});

/**
 * Resolve every non-Rookie phase (allies → drones → enemy) until control
 * returns to Rookie or the game ends. The UI ticks these one step at a time;
 * headless we just loop. Allies/drones phases were previously unhandled, so
 * any Squad/Convert loadout stalled the simulator on its first move.
 */
export function settleEnemyTurns(state: BoardState): BoardState {
  let s = state;
  let guard = 0;
  while (s.status === 'playing' && s.turn !== 'rookie' && guard < 256) {
    let next: BoardState;
    if (s.turn === 'allies') next = stepAllyTurn(s);
    else if (s.turn === 'drones') next = stepDroneTurn(s);
    else next = stepEnemyTurn(s);
    if (next === s) break;
    s = next;
    guard++;
  }
  return s;
}
