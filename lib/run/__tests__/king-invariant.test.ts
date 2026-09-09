/**
 * The enemy king can only leave the board by Rookie's capture (status → won).
 *
 *   npm test
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { enforceKingInvariant, KingInvariantError } from '../king-invariant';
import { stepEnemyTurn } from '../pawn-ai';
import { puzzleToBoardState } from '../seed';
import { fromSquare } from '../types';
import type { BoardState, RunPuzzle } from '../types';

function kingLevel(overrides: Partial<RunPuzzle> = {}): RunPuzzle {
  return {
    level: 19,
    rookieStart: fromSquare('d8'),
    pieces: [{ type: 'king', color: 'black', file: 5, rank: 7 }], // e7, beside her
    winCondition: 'king',
    kingBehavior: 'flee',
    ...overrides,
  };
}

function withAegis(state: BoardState, tier: 1 | 2 | 3 | 4 | 5): BoardState {
  return {
    ...state,
    abilities: [{ id: 'aegis', tier, mutations: [], usesLeftThisLevel: tier === 5 ? -1 : 1 }],
    // The engine randomizes Rookie's start file; pin her beside the king.
    rookie: fromSquare('d8'),
    shieldUp: true,
    turn: 'enemy',
  };
}

test('T5 Aegis never deletes the king when he walks into the shield (2026-09-09 vanish bug)', () => {
  const start = puzzleToBoardState(kingLevel(), { aiRngSeed: 7 });
  let s = withAegis(start, 5);
  // Run the whole enemy phase — the king stands beside Rookie, so the only
  // action the army has is his capture attempt, which the shield answers.
  for (let i = 0; i < 6 && s.turn === 'enemy' && s.status === 'playing'; i++) {
    s = stepEnemyTurn(s);
  }
  assert.equal(s.status, 'playing');
  assert.ok(s.pieces.some((p) => p.type === 'king'), 'the king must still be on the board');
});

test('T1-T4 Aegis blocks the king the same way (shield consumed, king stays)', () => {
  const start = puzzleToBoardState(kingLevel(), { aiRngSeed: 7 });
  let s = withAegis(start, 3);
  for (let i = 0; i < 6 && s.turn === 'enemy' && s.status === 'playing'; i++) {
    s = stepEnemyTurn(s);
  }
  assert.equal(s.status, 'playing');
  assert.ok(s.pieces.some((p) => p.type === 'king'));
});

test('invariant: a transition that drops the king without a win throws in dev', () => {
  const before = puzzleToBoardState(kingLevel(), { aiRngSeed: 1 });
  const after: BoardState = { ...before, pieces: [] };
  assert.throws(() => enforceKingInvariant(before, after, 'test'), KingInvariantError);
});

test('invariant: in production the removal is refused and the king is restored', () => {
  const before = puzzleToBoardState(kingLevel(), { aiRngSeed: 1 });
  const after: BoardState = { ...before, pieces: [] };
  const env = process.env as Record<string, string | undefined>;
  const prev = env.NODE_ENV;
  const err = console.error;
  const logged: string[] = [];
  console.error = (m: string) => logged.push(String(m));
  env.NODE_ENV = 'production';
  try {
    const fixed = enforceKingInvariant(before, after, 'test');
    assert.ok(fixed.pieces.some((p) => p.type === 'king'));
    assert.equal(logged.length, 1);
  } finally {
    env.NODE_ENV = prev;
    console.error = err;
  }
});

test('invariant: a won transition may remove the king; non-king levels are ignored', () => {
  const before = puzzleToBoardState(kingLevel(), { aiRngSeed: 1 });
  const won: BoardState = { ...before, pieces: [], status: 'won' };
  assert.equal(enforceKingInvariant(before, won, 'test'), won);
  const rank8 = puzzleToBoardState(kingLevel({ winCondition: 'rank8' }), { aiRngSeed: 1 });
  const gone: BoardState = { ...rank8, pieces: [] };
  assert.equal(enforceKingInvariant(rank8, gone, 'test'), gone);
});
