/**
 * Sacrifice — ONE rule at every tier: the blast is the 5x5 box around the
 * summon. Enemies inside are captured; the king inside is stunned, never
 * captured; nothing outside the box is touched.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  applyAbilityActivate,
  applyAbilityTargeted,
  sacrificeBlastSquares,
  sacrificeKingStunForTier,
} from '../abilities';
import { puzzleToBoardState } from '../seed';
import { fromSquare, toSquare } from '../types';
import type { AbilityTier } from '../abilities';
import type { BoardState, EnemyPiece } from '../types';

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });

function board(tier: AbilityTier): BoardState {
  const start = puzzleToBoardState(
    {
      level: 5,
      rookieStart: fromSquare('d8'),
      pieces: [
        E('g8', 'pawn'), // e6 + (2,2): inside the box
        E('c4', 'king'), // e6 + (-2,-2): inside — stunned, not captured
        E('h6', 'bishop'), // 3 files out: outside
        E('e3', 'pawn'), // 3 ranks out: outside
        E('e7', 'knight'), // beside her: inside
      ],
      winCondition: 'king',
      kingBehavior: 'flee',
    },
    { aiRngSeed: 3 },
  );
  return {
    ...start,
    rookie: fromSquare('d8'),
    allies: [{ id: 1, type: 'queen', file: 5, rank: 6, source: 'duchess', turnsLeft: 4 }], // Duchess on e6
    abilities: [{ id: 'sacrifice', tier, mutations: [], usesLeftThisLevel: 1 }],
  };
}

test('blast squares = the 5x5 box, summon excluded, clipped to the board', () => {
  const center = sacrificeBlastSquares(fromSquare('e6')).map(toSquare).sort();
  assert.equal(center.length, 24);
  assert.ok(center.includes('g8') && center.includes('c4') && center.includes('e7'));
  assert.ok(!center.includes('h6') && !center.includes('e3') && !center.includes('e6'));
  assert.equal(sacrificeBlastSquares(fromSquare('a1')).length, 8);
});

test('detonation captures every enemy in the box, spares the outside, stuns (never captures) the king', () => {
  for (const tier of [1, 2, 3, 4, 5] as const) {
    const s0 = board(tier);
    const armed = applyAbilityActivate(s0, 'sacrifice');
    assert.equal(armed.activeAbility?.id, 'sacrifice');
    const s1 = applyAbilityTargeted(armed, 'sacrifice', fromSquare('e6'));
    assert.notEqual(s1, armed, `tier ${tier}: detonation must apply`);
    const left = s1.pieces.map(toSquare).sort();
    assert.deepEqual(left, ['c4', 'e3', 'h6'], `tier ${tier}: g8 + e7 die, king/outside stay`);
    assert.equal(s1.status, 'playing');
    assert.equal(s1.allies.length, 0, 'the summon is spent');
    assert.equal(s1.kingStunTurns, sacrificeKingStunForTier(tier));
    assert.deepEqual([...s1.captures].sort(), ['knight', 'pawn']);
  }
});

test('a king outside the box is stunned only by the ordinary capture stun', () => {
  const s0 = board(5);
  const far: BoardState = {
    ...s0,
    pieces: s0.pieces.map((p) => (p.type === 'king' ? { ...p, ...fromSquare('a1') } : p)),
  };
  const s1 = applyAbilityTargeted(applyAbilityActivate(far, 'sacrifice'), 'sacrifice', fromSquare('e6'));
  assert.equal(s1.kingStunTurns, 1);
  assert.ok(s1.pieces.some((p) => p.type === 'king'));
});
