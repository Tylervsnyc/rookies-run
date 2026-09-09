/**
 * Aegis T5 nerf (2026-09-09): 3-turn shield, breaks on the first hit, the
 * king keeps running. T1-T4 unchanged: the shield holds until it takes a hit.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AEGIS_T5_TURNS, applyAbilityActivate, maxUsesForTier } from '../abilities';
import { applyRookieMove } from '../engine';
import { runEnemyTurn, stepEnemyTurn } from '../pawn-ai';
import { puzzleToBoardState } from '../seed';
import { fromSquare, toSquare } from '../types';
import type { AbilityTier } from '../abilities';
import type { BoardState, EnemyPiece } from '../types';

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });

function board(tier: AbilityTier, pieces: EnemyPiece[], rookie = 'a1'): BoardState {
  const start = puzzleToBoardState(
    { level: 3, rookieStart: fromSquare(rookie), pieces, winCondition: 'king', kingBehavior: 'flee' },
    { aiRngSeed: 11 },
  );
  return {
    ...start,
    rookie: fromSquare(rookie),
    abilities: [{ id: 'aegis', tier, mutations: [], usesLeftThisLevel: maxUsesForTier('aegis', tier) }],
  };
}

test('T5 is no longer unlimited: 3 raises per level, each on a 3-turn clock', () => {
  assert.equal(maxUsesForTier('aegis', 5), 3);
  const s = applyAbilityActivate(board(5, [E('h8', 'king')]), 'aegis');
  assert.equal(s.shieldUp, true);
  assert.equal(s.shieldTurnsLeft, AEGIS_T5_TURNS);
  assert.equal(s.abilities[0].usesLeftThisLevel, 2, 'a T5 raise spends a charge now');
});

test('T5 shield drops on its own after 3 enemy turns with nothing hitting it', () => {
  // The king is far away and pinned on the far edge; nothing ever reaches her.
  let s = applyAbilityActivate(board(5, [E('h8', 'king')]), 'aegis');
  for (let turn = 1; turn <= AEGIS_T5_TURNS; turn++) {
    assert.equal(s.shieldUp, true, `shield still up entering enemy turn ${turn}`);
    s = runEnemyTurn({ ...s, turn: 'enemy' });
    assert.equal(s.turn, 'rookie');
  }
  assert.equal(s.shieldUp, false, 'the clock ran out');
  assert.equal(s.shieldTurnsLeft, 0);
});

test('T5 shield breaks on the first hit it absorbs — the attacker dies, then she is exposed', () => {
  // A bishop on c3 attacks a1; the king sits far away.
  let s = applyAbilityActivate(board(5, [E('c3', 'bishop'), E('h8', 'king')]), 'aegis');
  s = runEnemyTurn({ ...s, turn: 'enemy' });
  assert.equal(s.status, 'playing');
  assert.ok(!s.pieces.some((p) => p.type === 'bishop'), 'the attacker died');
  assert.equal(s.shieldUp, false, 'one hit and the shield is gone');
  assert.ok(s.pieces.some((p) => p.type === 'king'), 'the king is untouched');
});

test('T1-T4 shields still hold until hit (no clock)', () => {
  let s = applyAbilityActivate(board(3, [E('h8', 'king')]), 'aegis');
  assert.equal(s.shieldTurnsLeft, 0);
  for (let i = 0; i < 5; i++) s = runEnemyTurn({ ...s, turn: 'enemy' });
  assert.equal(s.shieldUp, true);
});

test('the king keeps running from a shielded Rookie instead of parking beside her', () => {
  // King beside Rookie ON HER FILE (so her rook line threatens him): with the
  // shield up he flees rather than standing still to "capture" into it.
  const base = board(5, [E('d5', 'king')], 'd4');
  const shielded: BoardState = { ...applyAbilityActivate(base, 'aegis'), turn: 'enemy' };
  const after = stepEnemyTurn(shielded);
  const king = after.pieces.find((p) => p.type === 'king')!;
  assert.notEqual(toSquare(king), 'd5', 'he moved');
  assert.equal(after.shieldUp, true, 'nothing hit the shield');

  // Without a shield the old rule stands: adjacent, he holds still and takes her.
  const bare: BoardState = { ...base, turn: 'enemy' };
  const afterBare = runEnemyTurn(bare);
  assert.equal(afterBare.status, 'lost');
});

test('Rookie can still take the king through her own move with a shield up', () => {
  const s = applyAbilityActivate(board(5, [E('a2', 'king')]), 'aegis');
  const won = applyRookieMove(s, fromSquare('a2'));
  assert.equal(won.status, 'won');
});
