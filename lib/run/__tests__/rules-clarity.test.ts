/**
 * Rules clear enough to plan around (2026-09-15, Phase 1).
 *
 *   - The king ALWAYS swings at a Rookie who ends next to him. Shield down:
 *     she is taken. Shield up: he freezes on it (he does not flee).
 *   - The solver never calls a board dead while Aegis could still matter or
 *     while a guard can still move.
 *   - Boulder: one card tap = one stone, at every tier.
 *   - Magnet reaches diagonals from T3.
 *   - Decoy: who takes the mark is fixed (no RNG), and decoyCapturer names it.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  applyAbilityActivate,
  applyAbilityTargeted,
  magnetTargets,
  maxUsesForTier,
} from '../abilities';
import type { AbilityId, AbilityTier } from '../abilities';
import { decoyCapturer, kingDangerSquares, runEnemyTurn } from '../pawn-ai';
import { puzzleToBoardState } from '../seed';
import { isUnwinnable } from '../solver';
import { fromSquare, toSquare } from '../types';
import type { BoardState, EnemyPiece } from '../types';

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });

function board(
  pieces: EnemyPiece[],
  rookie: string,
  opts: { abilities?: { id: AbilityId; tier: AbilityTier; uses?: number }[]; seed?: number; moveLimit?: number; kingBehavior?: 'flee' | 'still' } = {},
): BoardState {
  const start = puzzleToBoardState(
    {
      level: 5,
      rookieStart: fromSquare(rookie),
      pieces,
      winCondition: 'king',
      kingBehavior: opts.kingBehavior ?? 'flee',
      moveLimit: opts.moveLimit,
    },
    { aiRngSeed: opts.seed ?? 11 },
  );
  return {
    ...start,
    rookie: fromSquare(rookie),
    enemiesPerTurn: 1,
    abilities: (opts.abilities ?? []).map((a) => ({
      id: a.id,
      tier: a.tier,
      mutations: [],
      usesLeftThisLevel: a.uses ?? maxUsesForTier(a.id, a.tier),
    })),
  };
}

// ── King ─────────────────────────────────────────────────────────────────────

test('king captures a Rookie orthogonally next to him (shield down)', () => {
  const s = runEnemyTurn({ ...board([E('e5', 'king')], 'e4'), turn: 'enemy' });
  assert.equal(s.status, 'lost');
});

test('king with shield up, touching orthogonally: he swings, freezes, and does NOT flee', () => {
  let s = applyAbilityActivate(board([E('e5', 'king')], 'e4', { abilities: [{ id: 'aegis', tier: 1 }] }), 'aegis');
  assert.equal(s.shieldUp, true);
  s = runEnemyTurn({ ...s, turn: 'enemy' });
  assert.equal(s.status, 'playing');
  const king = s.pieces.find((p) => p.type === 'king')!;
  assert.equal(toSquare(king), 'e5', 'he stood his ground');
  assert.ok(s.frozenSquares.includes('e5'), 'the shield froze him');
});

test('T5 Aegis does not park the king forever: the 3-turn shield runs out', () => {
  // Rook-form Rookie on e4, king e5 (pen keeps him adjacent). He swings, freezes,
  // thaws, swings again... the shield's clock ends and she is exposed.
  let s = applyAbilityActivate(
    board([E('e5', 'king')], 'e4', { abilities: [{ id: 'aegis', tier: 5, uses: 1 }] }),
    'aegis',
  );
  s = { ...s, kingPen: ['e5'] };
  let lost = false;
  for (let i = 0; i < 10; i++) {
    s = runEnemyTurn({ ...s, turn: 'enemy' });
    if (s.status === 'lost') {
      lost = true;
      break;
    }
  }
  assert.ok(lost, 'once the shield is gone the adjacent king takes her');
});

test('danger squares: the empty squares touching the king; none while he is stunned', () => {
  const s = board([E('e5', 'king'), E('d5', 'pawn')], 'a1');
  const danger = kingDangerSquares(s).map(toSquare).sort();
  assert.ok(danger.includes('e4') && danger.includes('f6'));
  assert.ok(!danger.includes('d5'), 'a capture square is not danger — capturing stuns him');
  assert.equal(kingDangerSquares({ ...s, kingStunTurns: 1 }).length, 0);
  assert.equal(kingDangerSquares({ ...s, frozenSquares: ['e5'], frozenTurnsLeft: { e5: 1 } }).length, 0);
});

// ── Solver ───────────────────────────────────────────────────────────────────

// A hopeless board: king boxed in the h8 corner behind a wall, 1 move left.
function deadBoard(extra: Partial<BoardState> = {}, abilities: { id: AbilityId; tier: AbilityTier; uses?: number }[] = []): BoardState {
  const s = board([E('h8', 'king')], 'a1', { abilities, moveLimit: 1 });
  return {
    ...s,
    hazards: [
      { ...fromSquare('g8'), kind: 'stone' },
      { ...fromSquare('g7'), kind: 'stone' },
      { ...fromSquare('h7'), kind: 'stone' },
    ],
    moveCount: 0,
    moveLimit: 1,
    turn: 'rookie',
    status: 'playing',
    ...extra,
  };
}

test('solver sanity: the boxed-in board is proven unwinnable', () => {
  assert.equal(isUnwinnable(deadBoard()), true);
});

test('solver: not proven lost while an Aegis charge remains', () => {
  assert.equal(isUnwinnable(deadBoard({}, [{ id: 'aegis', tier: 1, uses: 1 }])), false);
});

test('solver: not proven lost while the shield is up', () => {
  assert.equal(isUnwinnable(deadBoard({ shieldUp: true })), false);
});

test('solver: not proven lost while a guard pawn can still move', () => {
  const s = deadBoard();
  assert.equal(isUnwinnable({ ...s, pieces: [...s.pieces, E('c5', 'pawn')] }), false);
  // A pawn that is stuck (blocked by stone) does not count.
  const stuck = { ...s, pieces: [...s.pieces, E('c5', 'pawn')], hazards: [...s.hazards, { ...fromSquare('c4'), kind: 'stone' as const }] };
  assert.equal(isUnwinnable(stuck), true);
});

// ── Boulder ──────────────────────────────────────────────────────────────────

test('boulder T4: one tap = one stone; the next stone needs a fresh card tap', () => {
  let s = board([E('h8', 'king')], 'a1', { abilities: [{ id: 'boulder', tier: 4 }] });
  assert.equal(maxUsesForTier('boulder', 4), 4);
  s = applyAbilityActivate(s, 'boulder');
  assert.equal(s.activeAbility?.id, 'boulder');
  s = applyAbilityTargeted(s, 'boulder', fromSquare('d4'));
  assert.equal(s.hazards.filter((h) => toSquare(h) === 'd4').length, 1);
  assert.equal(s.activeAbility, null, 'the card is NOT re-armed');
  assert.equal(s.abilities[0].usesLeftThisLevel, 3);
  const again = applyAbilityTargeted(s, 'boulder', fromSquare('d5'));
  assert.equal(again, s, 'tapping the board without re-arming does nothing');
});

// ── Magnet ───────────────────────────────────────────────────────────────────

test('magnet: diagonal targets only from T3, in rook form', () => {
  const pieces = [E('d4', 'knight'), E('h8', 'king')];
  const t2 = board(pieces, 'b2', { abilities: [{ id: 'magnet', tier: 2 }] });
  assert.equal(magnetTargets(t2).length, 0);
  const t3 = board(pieces, 'b2', { abilities: [{ id: 'magnet', tier: 3 }] });
  assert.deepEqual(magnetTargets(t3).map(toSquare), ['d4']);
});

// ── Decoy ────────────────────────────────────────────────────────────────────

test('decoy: the capturer is fixed (nearest, then file) whatever the seed, and decoyCapturer names it', () => {
  // Mark the pawn on e5. Bishop c3 and knight g4 (same threat tier) are both
  // 2 away; bishop h8 is 3 away. Nearest ties -> lowest file -> c3.
  const pieces = [E('e5', 'pawn'), E('c3', 'bishop'), E('h8', 'bishop'), E('g4', 'knight'), E('a8', 'king')];
  const picks = new Set<string>();
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    let s = board(pieces, 'a1', { seed });
    s = { ...s, decoyTarget: 'e5', decoyTurnsLeft: 2 };
    const arrow = decoyCapturer(s);
    assert.ok(arrow);
    const after = runEnemyTurn({ ...s, turn: 'enemy' });
    const moved = after.pieces.find((p) => toSquare(p) === 'e5');
    assert.ok(moved, 'someone took the mark');
    picks.add(`${toSquare(arrow.from)}>${moved.type}`);
  }
  assert.equal(picks.size, 1, 'same capturer for every seed');
  assert.equal([...picks][0], 'c3>bishop');
});
