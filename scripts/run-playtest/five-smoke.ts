/**
 * five-smoke — does the T5 bot actually CAST the ability-first five of
 * 2026-09-19 when the cast pays off?
 *
 *   npx tsx scripts/run-playtest/five-smoke.ts [--trials=8]
 *
 * One tiny hand-built king level per card. Each has a move limit so tight
 * that the card is the only way through: WITHOUT it the level is lost by
 * construction, WITH it the level is won only if the bot finds the cast
 * (enumerated in bots/shared.ts, scored by `castPayoff` in bots/mcts.ts).
 * Prints, per card: wins without / wins with / games in which it was cast.
 * Exit code 1 if any card is never cast or never wins — keep it green.
 *
 * Not a balance read (the ability-lab and the run matrices are); this is the
 * "the bot can see the card" floor the pipeline's READY verdict rests on.
 */

import { maxUsesForTier } from '../../lib/run/abilities';
import type { AbilityId, AbilityTier } from '../../lib/run/abilities';
import { mulberry32 } from '../../lib/run/seed';
import { puzzleToBoardState } from '../../lib/run/seed';
import { fromSquare } from '../../lib/run/types';
import type { AllyPiece, BoardState, EnemyPiece, Hazard, RunPuzzle } from '../../lib/run/types';
import { applyBotAction } from './bots/apply';
import { settleEnemyTurns } from './bots/t3';
import { T5 } from './bots/t5';
import type { BotContext } from './types';

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });
const STONE = (sq: string): Hazard => ({ ...fromSquare(sq), kind: 'stone' });
const LAVA = (sq: string): Hazard => ({ ...fromSquare(sq), kind: 'lava' });

interface Scenario {
  id: AbilityId;
  tier: AbilityTier;
  why: string;
  puzzle: Omit<RunPuzzle, 'level'>;
  allies?: AllyPiece[];
}

// The king's cell for the "still king" rooms: stone on d8 / f8 / e7 / f7, so
// the only way in is the a4-e8 diagonal through d7 — no rook line reaches him.
const CELL = ['d8', 'f8', 'e7', 'f7'].map(STONE);

const SCENARIOS: Scenario[] = [
  {
    id: 'promote',
    tier: 1,
    why: 'Her Twin (a rook) stands on c6; only a QUEEN has the c6-d7-e8 diagonal. One move allowed.',
    puzzle: { rookieStart: fromSquare('a1'), pieces: [E('e8', 'king')], hazards: CELL, moveLimit: 1, winCondition: 'king', kingBehavior: 'still' },
    allies: [{ id: 1, type: 'rook', source: 'twin', ...fromSquare('c6') }],
  },
  {
    id: 'puppet',
    tier: 1,
    why: 'A bishop on e5 corks the e-file. One move allowed: walk it off (d6 is lava) and take him.',
    puzzle: { rookieStart: fromSquare('e1'), pieces: [E('e5', 'bishop'), E('e8', 'king')], hazards: [LAVA('d6')], moveLimit: 1, winCondition: 'king', kingBehavior: 'still' },
  },
  {
    id: 'raise',
    tier: 1,
    why: 'Only a bishop on the a4-e8 diagonal reaches him. Eat the b4 bishop, raise it on a4, wait out the daze, take him. Three moves.',
    puzzle: { rookieStart: fromSquare('b1'), pieces: [E('b4', 'bishop'), E('e8', 'king')], hazards: CELL, moveLimit: 3, winCondition: 'king', kingBehavior: 'still' },
  },
  {
    id: 'eruption',
    tier: 1,
    why: 'He shuttles e8-d8 for ever. The d7 vent floods d8: no flee square, and the e-file takes him. Three moves.',
    puzzle: {
      rookieStart: fromSquare('b5'),
      pieces: [E('e8', 'king')],
      hazards: [LAVA('d7'), STONE('f8'), STONE('f7'), STONE('c8')],
      kingPen: ['e8', 'd8'],
      moveLimit: 3,
      winCondition: 'king',
      kingBehavior: 'flee',
    },
  },
  {
    id: 'chain',
    tier: 1,
    why: 'Three pawns cork the fifth rank. Two moves: a chained capture on b5 clears c5 and d5 and stuns him; the second takes him.',
    puzzle: {
      rookieStart: fromSquare('a5'),
      pieces: [E('b5', 'pawn'), E('c5', 'pawn'), E('d5', 'pawn'), E('h5', 'king')],
      kingPen: ['h5'],
      moveLimit: 2,
      winCondition: 'king',
      kingBehavior: 'flee',
    },
  },
];

function start(sc: Scenario, withCard: boolean, trial: number): BoardState {
  const base = puzzleToBoardState({ level: 5, ...sc.puzzle }, { aiRngSeed: 11 + trial, startRng: mulberry32(7) });
  return {
    ...base,
    // The harness randomises her start file; a smoke scenario is a fixed board.
    rookie: { ...sc.puzzle.rookieStart },
    allies: (sc.allies ?? []).map((a) => ({ ...a })),
    abilities: withCard
      ? [{ id: sc.id, tier: sc.tier, mutations: [], usesLeftThisLevel: maxUsesForTier(sc.id, sc.tier) }]
      : [],
  };
}

function play(sc: Scenario, withCard: boolean, trial: number): { won: boolean; cast: boolean } {
  const ctx: BotContext = {
    excludedAbilities: new Set(),
    forcedAcceptIds: new Set(),
    forcedSkipIds: new Set(),
    rng: mulberry32(1000 + trial),
    seed: `five-smoke:${sc.id}:${withCard ? 'with' : 'none'}:${trial}`,
  };
  let state = start(sc, withCard, trial);
  let cast = false;
  for (let step = 0; step < 24 && state.status === 'playing'; step++) {
    if (state.turn !== 'rookie') {
      state = settleEnemyTurns(state);
      continue;
    }
    const action = T5.decide(state, ctx);
    if ((action.kind === 'activate-ability' || action.kind === 'ability-target') && action.abilityId === sc.id) cast = true;
    const next = applyBotAction(state, action);
    if (next === state) break;
    state = next;
  }
  return { won: state.status === 'won', cast };
}

const trialsArg = process.argv.find((a) => a.startsWith('--trials='));
const TRIALS = trialsArg ? Math.max(1, parseInt(trialsArg.slice('--trials='.length), 10)) : 8;

let failed = false;
console.log(`[five-smoke] T5 bot, ${TRIALS} trials per cell\n`);
console.log('card      tier  none   with   cast   verdict');
for (const sc of SCENARIOS) {
  let none = 0;
  let wins = 0;
  let casts = 0;
  for (let t = 0; t < TRIALS; t++) {
    if (play(sc, false, t).won) none++;
    const r = play(sc, true, t);
    if (r.won) wins++;
    if (r.cast) casts++;
  }
  const ok = casts > 0 && wins > none;
  if (!ok) failed = true;
  const pct = (n: number) => `${Math.round((n / TRIALS) * 100)}%`.padEnd(6);
  console.log(`${sc.id.padEnd(9)} T${sc.tier}    ${pct(none)} ${pct(wins)} ${pct(casts)} ${ok ? 'ok' : 'FAIL'}`);
  console.log(`          ${sc.why}`);
}
process.exit(failed ? 1 : 0);
