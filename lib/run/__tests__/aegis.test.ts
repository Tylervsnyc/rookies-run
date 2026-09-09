/**
 * Aegis (2026-09-09, Tyler: "Aegis shouldn't capture attacking pieces, just
 * freeze them. It's too powerful and confusing."). At EVERY tier an attacker
 * that hits the shield is FROZEN — the Freeze Ray mechanic — never captured.
 *
 *   T1: block; attacker frozen 1 turn. 1 raise/level.
 *   T2: same; 2 raises/level.
 *   T3: attacker frozen 2 turns. 2 raises/level.
 *   T4: attacker frozen 2 turns. 3 raises/level.
 *   T5: shield lasts 3 turns and does NOT break; every attacker that hits it
 *       is frozen 2 turns. 3 raises/level.
 *
 * A king who bumps the shield is frozen like anyone else — and is never
 * removed from the board.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  AEGIS_T5_TURNS,
  aegisFreezeTurns,
  applyAbilityActivate,
  maxUsesForTier,
  tryAegisIntercept,
} from '../abilities';
import { applyRookieMove } from '../engine';
import { runEnemyTurn, stepEnemyTurn } from '../pawn-ai';
import { puzzleToBoardState } from '../seed';
import { fromSquare, toSquare } from '../types';
import type { AbilityTier } from '../abilities';
import type { BoardState, EnemyPiece } from '../types';

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });

function board(tier: AbilityTier, pieces: EnemyPiece[], rookie = 'a1', enemiesPerTurn = 1): BoardState {
  const start = puzzleToBoardState(
    { level: 3, rookieStart: fromSquare(rookie), pieces, winCondition: 'king', kingBehavior: 'flee' },
    { aiRngSeed: 11 },
  );
  return {
    ...start,
    rookie: fromSquare(rookie),
    enemiesPerTurn,
    abilities: [{ id: 'aegis', tier, mutations: [], usesLeftThisLevel: maxUsesForTier('aegis', tier) }],
  };
}

const count = (s: BoardState, type: EnemyPiece['type']) => s.pieces.filter((p) => p.type === type).length;

test('raises per level: 1/2/2/3/3', () => {
  assert.deepEqual([1, 2, 3, 4, 5].map((t) => maxUsesForTier('aegis', t as AbilityTier)), [1, 2, 2, 3, 3]);
});

test('freeze length: 1 turn at T1-T2, 2 turns at T3-T5', () => {
  assert.deepEqual([1, 2, 3, 4, 5].map((t) => aegisFreezeTurns(t as AbilityTier)), [1, 1, 2, 2, 2]);
});

for (const tier of [1, 2, 3, 4, 5] as AbilityTier[]) {
  test(`T${tier}: the attacker is frozen, not removed; nothing is captured`, () => {
    // A bishop on c3 attacks a1; the king sits far away.
    let s = applyAbilityActivate(board(tier, [E('c3', 'bishop'), E('h8', 'king')]), 'aegis');
    const capturesBefore = s.captures.length;
    s = runEnemyTurn({ ...s, turn: 'enemy' });
    assert.equal(s.status, 'playing');
    assert.equal(count(s, 'bishop'), 1, 'the attacker is still on the board');
    assert.equal(s.captures.length, capturesBefore, 'no capture was credited');
    assert.ok(s.frozenSquares.includes('c3'), 'the attacker is frozen on its square');
    // The end-of-turn tick already ran once; what is left is the turns it misses.
    assert.equal(s.frozenTurnsLeft['c3'], aegisFreezeTurns(tier));
    assert.equal(s.shieldUp, tier === 5, tier === 5 ? 'T5 holds' : 'one hit and the shield is gone');
  });

  test(`T${tier}: the frozen attacker misses exactly ${aegisFreezeTurns(tier)} enemy turn(s)`, () => {
    let s = applyAbilityActivate(board(tier, [E('c3', 'bishop'), E('h8', 'king')]), 'aegis');
    s = runEnemyTurn({ ...s, turn: 'enemy' });
    // Drop the shield (T5) so the only thing keeping her alive is the freeze.
    s = { ...s, shieldUp: false, shieldTurnsLeft: 0 };
    for (let i = 0; i < aegisFreezeTurns(tier); i++) {
      s = runEnemyTurn({ ...s, turn: 'enemy' });
      assert.equal(s.status, 'playing', `frozen through skipped turn ${i + 1}`);
    }
    s = runEnemyTurn({ ...s, turn: 'enemy' });
    assert.equal(s.status, 'lost', 'thawed, and the bishop takes her');
  });
}

test('T5: 3 raises per level, each on a 3-turn clock', () => {
  const s = applyAbilityActivate(board(5, [E('h8', 'king')]), 'aegis');
  assert.equal(s.shieldUp, true);
  assert.equal(s.shieldTurnsLeft, AEGIS_T5_TURNS);
  assert.equal(s.abilities[0].usesLeftThisLevel, 2, 'a T5 raise spends a charge');
});

test('T5 shield drops on its own after 3 enemy turns with nothing hitting it', () => {
  let s = applyAbilityActivate(board(5, [E('h8', 'king')]), 'aegis');
  for (let turn = 1; turn <= AEGIS_T5_TURNS; turn++) {
    assert.equal(s.shieldUp, true, `shield still up entering enemy turn ${turn}`);
    s = runEnemyTurn({ ...s, turn: 'enemy' });
    assert.equal(s.turn, 'rookie');
  }
  assert.equal(s.shieldUp, false, 'the clock ran out');
  assert.equal(s.shieldTurnsLeft, 0);
});

test('T5 multi-hit: two attackers in one turn both bounce, both freeze, shield holds', () => {
  // Bishop c3 and queen a8 both attack a1; two enemies act per turn.
  let s = applyAbilityActivate(board(5, [E('c3', 'bishop'), E('a8', 'queen'), E('h8', 'king')], 'a1', 2), 'aegis');
  s = runEnemyTurn({ ...s, turn: 'enemy' });
  assert.equal(s.status, 'playing');
  assert.equal(count(s, 'bishop'), 1);
  assert.equal(count(s, 'queen'), 1);
  assert.ok(s.frozenSquares.includes('c3'), 'bishop frozen');
  assert.ok(s.frozenSquares.includes('a8'), 'queen frozen');
  assert.equal(s.shieldUp, true, 'the T5 shield does not break');
  assert.equal(s.shieldTurnsLeft, AEGIS_T5_TURNS - 1);
});

test('T5 multi-hit across turns: a second attacker on turn 2 freezes too', () => {
  let s = applyAbilityActivate(board(5, [E('c3', 'bishop'), E('h8', 'king')], 'a1'), 'aegis');
  s = runEnemyTurn({ ...s, turn: 'enemy' });
  assert.ok(s.frozenSquares.includes('c3'));
  // A queen lands on a8 for turn 2.
  s = { ...s, pieces: [...s.pieces, E('a8', 'queen')] };
  s = runEnemyTurn({ ...s, turn: 'enemy' });
  assert.equal(s.status, 'playing');
  assert.equal(count(s, 'queen'), 1);
  assert.ok(s.frozenSquares.includes('a8'), 'second attacker frozen');
  assert.equal(s.shieldUp, true);
});

test('T1-T4 shields hold until hit (no clock)', () => {
  let s = applyAbilityActivate(board(3, [E('h8', 'king')]), 'aegis');
  assert.equal(s.shieldTurnsLeft, 0);
  for (let i = 0; i < 5; i++) s = runEnemyTurn({ ...s, turn: 'enemy' });
  assert.equal(s.shieldUp, true);
});

test('the king keeps running from a shielded Rookie instead of parking beside her', () => {
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

for (const tier of [1, 3, 5] as AbilityTier[]) {
  test(`T${tier}: a king who bumps the shield is frozen, never removed`, () => {
    // Drive the intercept directly with the king as the attacker (the AI
    // makes him flee a shielded Rookie, so the capturers pass rarely picks
    // him — but a cornered king with no flee square still can).
    const base = board(tier, [E('a2', 'king')], 'a1');
    let s = applyAbilityActivate(base, 'aegis');
    const kingBefore = s.pieces.find((p) => p.type === 'king')!;
    const blocked = tryAegisIntercept(s, kingBefore);
    assert.ok(blocked, 'the shield intercepts him');
    assert.equal(count(blocked!, 'king'), 1, 'the king is still on the board');
    assert.equal(blocked!.captures.length, s.captures.length, 'no capture credited');
    assert.ok(blocked!.frozenSquares.includes('a2'), 'the king is frozen');
    assert.equal(blocked!.shieldUp, tier === 5);
    // And the level is still finishable: Rookie takes him through her own move.
    s = { ...blocked!, turn: 'rookie' };
    const won = applyRookieMove(s, fromSquare('a2'));
    assert.equal(won.status, 'won');
  });
}

test('Rookie can still take the king through her own move with a shield up', () => {
  const s = applyAbilityActivate(board(5, [E('a2', 'king')]), 'aegis');
  const won = applyRookieMove(s, fromSquare('a2'));
  assert.equal(won.status, 'won');
});
