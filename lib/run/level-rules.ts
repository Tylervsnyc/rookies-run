/**
 * "How enemies move here" — the per-level rules strip (2026-09-15).
 *
 * Every line is DERIVED from the live board (king behavior, pen, enemies per
 * turn, difficulty, move limit, kit). Nothing is authored per level, so the
 * copy cannot drift from what the engine does.
 */
import { DIFFICULTIES } from './difficulty';
import type { BoardState } from './types';

export interface LevelRule {
  what: string;
  detail: string;
}

export function levelRules(state: BoardState): LevelRule[] {
  const out: LevelRule[] = [];
  const diff = DIFFICULTIES[state.difficulty ?? 'normal'];
  const owns = (id: string) => state.abilities.some((a) => a.id === id);

  if (state.winCondition === 'king') {
    const flees = state.kingBehavior === 'flee';
    out.push({
      what: flees ? 'King: runs' : 'King: stands still',
      detail: flees
        ? `When you threaten him, he steps to a safe square${state.kingPen?.length ? ' inside his gold room' : ''}.`
        : 'He never moves away. Get a clear line and take him.',
    });
    out.push({
      what: 'Never end next to him',
      detail: owns('aegis')
        ? 'End your move touching the king and he takes you. With a shield up, he freezes instead.'
        : 'End your move touching the king and he takes you.',
    });
    out.push({
      what: 'Captures stun him',
      detail: 'Every piece you take stuns the king for 1 turn. He can not run or take you.',
    });
    if (diff.kingReactsToAllies) {
      out.push({ what: 'He watches your summons', detail: 'He also runs when one of your summons moves.' });
    }
  }

  const n = Math.max(1, state.enemiesPerTurn ?? 1);
  out.push({
    what: `${n} enemy ${n === 1 ? 'move' : 'moves'} per turn`,
    detail: `After your move, ${n === 1 ? 'one enemy piece acts' : `${n} enemy pieces act`}. Pieces that can take you always go first.`,
  });

  if (owns('convert')) {
    out.push({ what: 'Converted pieces rest', detail: 'A piece you convert waits 1 turn before it can act.' });
  }

  if (state.moveLimit !== null) {
    out.push({ what: `${state.moveLimit} moves`, detail: 'Run out of moves and the level is lost.' });
  }

  const retries = diff.retriesPerLevel;
  out.push({
    what: `${diff.name} mode`,
    detail:
      retries === Infinity
        ? 'Unlimited retries on every level.'
        : `${retries} ${retries === 1 ? 'retry' : 'retries'} per level.`,
  });
  return out;
}
