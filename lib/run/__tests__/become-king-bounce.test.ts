/**
 * Become King bounce (2026-09-18, Tyler's endless run, trace 0344a5b3): an
 * attacker that bounces off king-form Rookie has spent its action. It was
 * recorded as "d6" while the re-pick exclude set is keyed "file,rank", so the
 * same queen was re-picked for the whole enemy phase and nothing else moved.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applyAbilityActivate, maxUsesForTier } from '../abilities';
import { applyRookieMove } from '../engine';
import { stepEnemyTurn } from '../pawn-ai';
import { puzzleToBoardState } from '../seed';
import { fromSquare } from '../types';
import type { BoardState, EnemyPiece } from '../types';

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });

test('a bounced attacker is not re-picked: each enemy acts at most once per phase', () => {
  const start = puzzleToBoardState(
    {
      level: 3,
      rookieStart: fromSquare('b5'),
      pieces: [E('d6', 'queen'), E('b6', 'pawn'), E('g4', 'pawn'), E('d4', 'pawn'), E('h8', 'king')],
      winCondition: 'king',
      kingBehavior: 'flee',
    },
    { aiRngSeed: 11 },
  );
  let s: BoardState = {
    ...start,
    rookie: fromSquare('b5'),
    enemiesPerTurn: 3,
    pendingOffer: null,
    abilities: [{ id: 'become-king', tier: 1, mutations: [], usesLeftThisLevel: maxUsesForTier('become-king', 1) }],
  };
  s = applyAbilityActivate(s, 'become-king');
  s = applyRookieMove(s, fromSquare('b6')); // king-form capture, lands beside the queen's line
  assert.equal(s.turn, 'enemy');

  const seen: string[] = [];
  for (let guard = 0; s.turn === 'enemy' && s.status === 'playing' && guard < 20; guard++) {
    s = stepEnemyTurn(s);
    if (s.turn === 'enemy') seen.splice(0, seen.length, ...s.enemyMovedSquares);
  }
  assert.equal(s.status, 'playing');
  assert.ok(seen.length > 0, 'the enemy phase recorded at least one action');
  assert.equal(new Set(seen).size, seen.length, `an enemy acted twice in one phase: ${seen.join(' | ')}`);
  assert.ok(seen.every((k) => /^\d,\d$/.test(k)), `enemyMovedSquares must be "file,rank" keys: ${seen.join(' | ')}`);
});
