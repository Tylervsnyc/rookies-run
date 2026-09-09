/**
 * Sacrifice — ONE rule at every tier: the blast is PIECE-SHAPED. It is the
 * squares the summon attacks, capped at 2 out along each line, on an empty
 * board (blockers never shorten it — it is an explosion, not a move).
 * Enemies inside are captured; the king inside is stunned, never captured;
 * nothing outside the shape is touched. Tiers change stun + charges only.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  applyAbilityActivate,
  applyAbilityTargeted,
  sacrificeBlastKind,
  sacrificeBlastPreview,
  sacrificeBlastSquares,
  sacrificeKingStunForTier,
  SACRIFICE_BLAST_TINTS,
} from '../abilities';
import { puzzleToBoardState } from '../seed';
import { fromSquare, toSquare } from '../types';
import type { AbilityTier } from '../abilities';
import type { AllyPiece, BoardState, EnemyPiece } from '../types';

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });
const A = (id: number, sq: string, type: AllyPiece['type'], source: AllyPiece['source']): AllyPiece => ({
  id,
  type,
  source,
  ...fromSquare(sq),
});

const blast = (piece: Pick<AllyPiece, 'type' | 'source'>, sq: string) =>
  sacrificeBlastSquares(piece, fromSquare(sq)).map(toSquare).sort();

function board(tier: AbilityTier, allies: AllyPiece[], enemies: EnemyPiece[]): BoardState {
  const start = puzzleToBoardState(
    { level: 5, rookieStart: fromSquare('a8'), pieces: enemies, winCondition: 'king', kingBehavior: 'flee' },
    { aiRngSeed: 3 },
  );
  return {
    ...start,
    rookie: fromSquare('a8'),
    allies,
    abilities: [{ id: 'sacrifice', tier, mutations: [], usesLeftThisLevel: 1 }],
  };
}

test('pawn: the two diagonal-forward squares (toward rank 8)', () => {
  assert.deepEqual(blast({ type: 'pawn', source: 'page' }, 'e4'), ['d5', 'f5']);
  assert.deepEqual(blast({ type: 'pawn', source: 'convert' }, 'a2'), ['b3']); // edge clips
});

test('knight: the 8 knight squares, with a hole at the distance-1 orthogonals', () => {
  const k = blast({ type: 'knight', source: 'squire' }, 'e4');
  assert.deepEqual(k, ['c3', 'c5', 'd2', 'd6', 'f2', 'f6', 'g3', 'g5']);
  for (const hole of ['e5', 'e3', 'd4', 'f4', 'd5', 'f5', 'e6', 'c4']) assert.ok(!k.includes(hole), hole);
  assert.deepEqual(blast({ type: 'knight', source: 'vanguard' }, 'e4'), k);
  assert.deepEqual(blast({ type: 'knight', source: 'convert' }, 'e4'), k);
});

test('bishop: four diagonals, 2 out = 8', () => {
  assert.deepEqual(blast({ type: 'bishop', source: 'bishop-squire' }, 'e4'), ['c2', 'c6', 'd3', 'd5', 'f3', 'f5', 'g2', 'g6']);
});

test('rook: four orthogonals, 2 out = 8', () => {
  assert.deepEqual(blast({ type: 'rook', source: 'twin' }, 'e4'), ['c4', 'd4', 'e2', 'e3', 'e5', 'e6', 'f4', 'g4']);
});

test('queen: all 8 lines, 2 out = 16; the knight squares are NOT in it', () => {
  const q = blast({ type: 'queen', source: 'duchess' }, 'e4');
  assert.equal(q.length, 16);
  for (const sq of ['c2', 'c4', 'c6', 'e2', 'e6', 'g2', 'g4', 'g6', 'd3', 'd4', 'd5', 'e3', 'e5', 'f3', 'f4', 'f5']) assert.ok(q.includes(sq), sq);
  for (const sq of ['d6', 'f6', 'c5', 'g5']) assert.ok(!q.includes(sq), sq);
  assert.deepEqual(blast({ type: 'queen', source: 'convert' }, 'e4'), q);
});

test('dragon: queen lines + knight squares = the full 5x5 box (24)', () => {
  const d = blast({ type: 'queen', source: 'dragon' }, 'e4');
  assert.equal(d.length, 24);
  const box: string[] = [];
  for (let df = -2; df <= 2; df++) for (let dr = -2; dr <= 2; dr++) if (df || dr) box.push(toSquare({ file: 5 + df, rank: 4 + dr }));
  assert.deepEqual(d, box.sort());
  assert.equal(sacrificeBlastKind({ type: 'queen', source: 'dragon' }), 'dragon');
});

test('edge of the board clips every shape', () => {
  assert.equal(blast({ type: 'queen', source: 'duchess' }, 'a1').length, 6); // a2 a3 b1 c1 b2 c3
  assert.equal(blast({ type: 'knight', source: 'squire' }, 'a1').length, 2); // b3 c2
  assert.equal(blast({ type: 'rook', source: 'twin' }, 'h8').length, 4);
  assert.equal(blast({ type: 'bishop', source: 'bishop-squire' }, 'h1').length, 2);
  assert.equal(blast({ type: 'queen', source: 'dragon' }, 'a1').length, 8);
  assert.equal(blast({ type: 'pawn', source: 'page' }, 'e8').length, 0);
});

test('every blast kind has its own tint, all distinct', () => {
  const kinds = Object.keys(SACRIFICE_BLAST_TINTS).sort();
  assert.deepEqual(kinds, ['bishop', 'dragon', 'knight', 'pawn', 'queen', 'rook']);
  assert.equal(new Set(Object.values(SACRIFICE_BLAST_TINTS).map((t) => t.wash)).size, 6);
});

test('blast ignores blockers: a knight in the way does not shield the enemy behind it', () => {
  // Duchess e4; enemy knight e5 sits between her and the pawn on e6.
  const s0 = board(3, [A(1, 'e4', 'queen', 'duchess')], [E('e5', 'knight'), E('e6', 'pawn'), E('e7', 'pawn'), E('h8', 'king')]);
  const s1 = applyAbilityTargeted(applyAbilityActivate(s0, 'sacrifice'), 'sacrifice', fromSquare('e4'));
  assert.deepEqual(s1.pieces.map(toSquare).sort(), ['e7', 'h8']); // e7 is 3 out: spared
  assert.deepEqual([...s1.captures].sort(), ['knight', 'pawn']);
  assert.equal(s1.allies.length, 0, 'the summon is spent');
});

test('knight blast: the adjacent enemy is untouched (the hole), the L-square enemy dies', () => {
  const s0 = board(2, [A(1, 'c4', 'knight', 'squire')], [E('c5', 'pawn'), E('d6', 'pawn'), E('b2', 'bishop'), E('h8', 'king')]);
  const s1 = applyAbilityTargeted(applyAbilityActivate(s0, 'sacrifice'), 'sacrifice', fromSquare('c4'));
  assert.deepEqual(s1.pieces.map(toSquare).sort(), ['c5', 'h8']);
});

test('the king inside the blast is stunned by tier, never captured; the shape never changes with tier', () => {
  for (const tier of [1, 2, 3, 4, 5] as const) {
    const s0 = board(tier, [A(1, 'e4', 'queen', 'duchess')], [E('g6', 'king'), E('c2', 'pawn'), E('d6', 'pawn')]);
    const s1 = applyAbilityTargeted(applyAbilityActivate(s0, 'sacrifice'), 'sacrifice', fromSquare('e4'));
    assert.deepEqual(s1.pieces.map(toSquare).sort(), ['d6', 'g6'], `tier ${tier}: c2 dies, d6 (knight square) survives`);
    assert.equal(s1.status, 'playing');
    assert.equal(s1.kingStunTurns, sacrificeKingStunForTier(tier));
  }
  assert.deepEqual([1, 2, 3, 4, 5].map((t) => sacrificeKingStunForTier(t as AbilityTier)), [1, 2, 2, 2, 3]);
});

test('a king outside the shape gets only the ordinary capture stun', () => {
  const s0 = board(5, [A(1, 'e4', 'queen', 'duchess')], [E('a8', 'king'), E('c2', 'pawn')]);
  const s1 = applyAbilityTargeted(applyAbilityActivate(s0, 'sacrifice'), 'sacrifice', fromSquare('e4'));
  assert.equal(s1.kingStunTurns, 1);
  assert.ok(s1.pieces.some((p) => p.type === 'king'));
});

test('engine blast == preview squares, per summon, with the right kind', () => {
  const s0 = board(3, [A(1, 'c4', 'knight', 'squire'), A(2, 'f5', 'queen', 'duchess')], [E('h8', 'king')]);
  const preview = sacrificeBlastPreview(s0);
  assert.equal(preview.length, 2);
  const byKind = Object.fromEntries(preview.map((g) => [g.kind, g]));
  assert.deepEqual(byKind.knight.squares.map(toSquare).sort(), blast({ type: 'knight', source: 'squire' }, 'c4'));
  assert.deepEqual(byKind.queen.squares.map(toSquare).sort(), blast({ type: 'queen', source: 'duchess' }, 'f5'));
  assert.equal(toSquare(byKind.knight.summon), 'c4');
  // The engine captures exactly the previewed squares: fill every previewed
  // knight square with a pawn, detonate the knight, all of them die.
  const filled = { ...s0, pieces: [E('h8', 'king'), ...byKind.knight.squares.map((c) => E(toSquare(c), 'pawn'))] };
  const s1 = applyAbilityTargeted(applyAbilityActivate(filled, 'sacrifice'), 'sacrifice', fromSquare('c4'));
  assert.deepEqual(s1.pieces.map(toSquare), ['h8']);
});
