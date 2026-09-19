/**
 * The ten of 2026-09-19 were built as two fives in parallel. These are the
 * places they meet: Promote on a Mirror echo and on a Raised piece, Chain on
 * an echo capture, Catapult on a Raised piece, and Rewind carrying all of it.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  abilityLegalMoves,
  applyAbilityActivate,
  applyAbilityTargeted,
  canRewind,
  chainPreview,
  mirrorEchoOf,
  promoteTargets,
  pushEnemyPhaseSnapshot,
} from '../abilities';
import { applyRookieMove } from '../engine';
import { puzzleToBoardState } from '../seed';
import { fromSquare, toSquare } from '../types';
import type { AbilityId, AbilityTier } from '../abilities';
import type { AllyPiece, BoardState, EnemyPiece, Hazard } from '../types';

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });
const sqs = (cs: { file: number; rank: number }[]) => cs.map(toSquare).sort();

function board(opts: {
  rookie: string;
  enemies: EnemyPiece[];
  hazards?: Hazard[];
  kit: [AbilityId, AbilityTier][];
  allies?: AllyPiece[];
}): BoardState {
  const start = puzzleToBoardState(
    {
      level: 5,
      rookieStart: fromSquare(opts.rookie),
      pieces: opts.enemies,
      hazards: opts.hazards ?? [],
      winCondition: 'king',
      kingBehavior: 'flee',
    },
    { aiRngSeed: 3 },
  );
  return {
    ...start,
    rookie: fromSquare(opts.rookie),
    allies: opts.allies ?? [],
    abilities: opts.kit.map(([id, tier]) => ({ id, tier, mutations: [], usesLeftThisLevel: 2 })),
  };
}

const cast = (s: BoardState, id: AbilityId, ...taps: string[]): BoardState => {
  let cur = applyAbilityActivate(s, id);
  for (const t of taps) cur = applyAbilityTargeted(cur, id, fromSquare(t));
  return cur;
};

const raised = (sq: string, type: AllyPiece['type']): AllyPiece => ({
  id: 7,
  type,
  ...fromSquare(sq),
  source: 'raise',
  turnsLeft: 9,
});

test('promote: a Mirror echo and a Raised piece are both targets; the echo keeps copying her', () => {
  const s = cast(
    board({ rookie: 'b2', enemies: [E('h8', 'king')], kit: [['mirror', 1], ['promote', 1]], allies: [raised('c2', 'pawn')] }),
    'mirror',
    'g2',
  );
  assert.equal(toSquare(mirrorEchoOf(s)!), 'g2');
  assert.deepEqual(sqs(promoteTargets(s)), ['c2', 'g2']);
  const up = cast(cast(s, 'promote', 'g2'), 'promote', 'c2');
  assert.equal(mirrorEchoOf(up)!.type, 'queen');
  assert.equal(up.allies.find((a) => a.source === 'raise')!.type, 'knight');
  // Still an echo: b2-b4 sends it g2-g4.
  const moved = applyRookieMove(up, fromSquare('b4'));
  assert.equal(toSquare(mirrorEchoOf(moved)!), 'g4');
});

test('chain: an armed Chain her own move does not spend fires on the echo capture', () => {
  // Echo on g2; pawns g4-h5 are a chain. b2-b4 takes nothing; the echo takes g4.
  const s = cast(
    board({ rookie: 'b2', enemies: [E('a8', 'king'), E('g4', 'pawn'), E('h5', 'pawn')], kit: [['mirror', 1], ['chain', 1]] }),
    'mirror',
    'g2',
  );
  assert.ok(chainPreview(s).some((c) => toSquare(c.head) === 'g4' && sqs(c.links).includes('h5')));
  const armed = applyAbilityActivate(s, 'chain');
  assert.equal(armed.chainArmed, true);
  const after = applyRookieMove(armed, fromSquare('b4'));
  assert.equal(toSquare(mirrorEchoOf(after)!), 'g4');
  assert.deepEqual(after.pieces.map((p) => p.type), ['king']);
  assert.deepEqual(after.captures.slice(-2), ['pawn', 'pawn']);
  assert.ok(!after.chainArmed);
});

test('catapult: a Raised piece beside her is a payload', () => {
  const s = board({ rookie: 'b2', enemies: [E('h8', 'king')], kit: [['catapult', 1]], allies: [raised('b3', 'knight')] });
  const armed = applyAbilityActivate(s, 'catapult');
  assert.deepEqual(sqs(abilityLegalMoves(armed, 'catapult')), ['b3']);
  const flung = cast(s, 'catapult', 'b3', 'b6');
  const body = flung.allies.find((a) => a.source === 'raise')!;
  assert.equal(toSquare(body), 'b6');
  assert.equal(body.type, 'knight');
});

test('rewind: the snapshot carries the grave floor, a raised + promoted body, the echo and a castled pen', () => {
  const base = cast(
    board({ rookie: 'b2', enemies: [E('h8', 'king'), E('d6', 'pawn')], kit: [['mirror', 5], ['rewind', 1]], allies: [raised('c2', 'rook')] }),
    'mirror',
    'g2',
  );
  const snapState: BoardState = { ...base, graveFloor: 3, kingPen: ['h8', 'g8'], kingCastled: true, ricochetBanks: 0 };
  // The enemy phase: the pawn steps; then she rewinds it.
  const pawnMoved: BoardState = {
    ...pushEnemyPhaseSnapshot(snapState),
    pieces: snapState.pieces.map((p) => (p.type === 'pawn' ? { ...p, rank: 5 } : p)),
    turn: 'rookie',
  };
  assert.ok(canRewind(pawnMoved));
  const back = applyAbilityActivate(pawnMoved, 'rewind');
  assert.equal(toSquare(back.pieces.find((p) => p.type === 'pawn')!), 'd6');
  assert.equal(back.graveFloor, 3);
  assert.deepEqual(back.kingPen, ['h8', 'g8']);
  assert.equal(toSquare(mirrorEchoOf(back)!), 'g2');
  assert.equal(back.allies.find((a) => a.source === 'raise')!.type, 'rook');
});
