/**
 * Turn back from a transform (Tyler's playtest, 2026-09-21: "after Knight
 * Hop, there's no way to revert to normal piece").
 *
 *   - Before she moves in the form: tapping the card again undoes the cast and
 *     refunds the charge (unchanged — the cancellableActivation path).
 *   - After she has moved in it: tapping the card again makes her a rook on
 *     the spot. Free (her move is still in hand), no refund, works at 0 charges.
 *   - Never on the enemy turn; never from a level-locked form.
 *   - Bots are never offered it; the solver models it (a win that needs the
 *     rook back must not read as dead) and cannot loop on it.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  applyAbilityActivate,
  cardStatusFor,
  formCardFor,
  maxUsesForTier,
  type AbilityId,
  type AbilityTier,
} from '../abilities';
import { applyRookieMove } from '../engine';
import { rookieLegalMoves } from '../movement';
import { runEnemyTurn } from '../pawn-ai';
import { puzzleToBoardState } from '../seed';
import { isUnwinnable } from '../solver';
import { fromSquare, toSquare } from '../types';
import type { BoardState, EnemyPiece } from '../types';

// The bots live under scripts/run-playtest, which tsconfig excludes (and which
// does not type-check on its own). A non-literal specifier keeps tsc out of it;
// tsx still loads the real module at test time.
const BOTS_SHARED = '../../../scripts/run-playtest/bots/shared';
type Candidate = { kind: string; abilityId?: AbilityId };
async function botCandidates(s: BoardState): Promise<Candidate[]> {
  const mod = (await import(BOTS_SHARED)) as {
    legalCandidates: (state: BoardState, excluded: ReadonlySet<AbilityId>) => Candidate[];
  };
  return mod.legalCandidates(s, new Set());
}

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });

function board(rookie: string, pieces: EnemyPiece[], id: AbilityId, tier: AbilityTier): BoardState {
  const start = puzzleToBoardState(
    { level: 3, rookieStart: fromSquare(rookie), pieces, winCondition: 'king', kingBehavior: 'still' },
    { aiRngSeed: 7 },
  );
  return {
    ...start,
    rookie: fromSquare(rookie),
    pendingOffer: null,
    abilities: [{ id, tier, mutations: [], usesLeftThisLevel: maxUsesForTier(id, tier) }],
  };
}

const squares = (s: BoardState) => rookieLegalMoves(s).map(toSquare);

test('before moving: tapping Knight Hop again still undoes the cast and refunds the charge', () => {
  const s0 = board('d1', [E('h8', 'king')], 'knight-hop', 2);
  const cast = applyAbilityActivate(s0, 'knight-hop');
  assert.equal(cast.form, 'knight');
  assert.equal(cast.abilities[0].usesLeftThisLevel, 0);
  const undone = applyAbilityActivate(cast, 'knight-hop');
  assert.equal(undone.form, 'rook');
  assert.equal(undone.formMovesLeft, 0);
  assert.equal(undone.abilities[0].usesLeftThisLevel, 1, 'charge refunded');
  assert.equal(undone.cancellableActivation, undefined);
  assert.equal(undone.turn, 'rookie');
});

test('after moving: tapping Knight Hop again turns her back — free, no refund, rook moves next', () => {
  let s = board('d1', [E('h8', 'king'), E('a7', 'pawn')], 'knight-hop', 2);
  s = applyAbilityActivate(s, 'knight-hop');
  s = applyRookieMove(s, fromSquare('e3')); // knight move, 1 knight move left
  assert.equal(s.form, 'knight');
  assert.equal(s.formMovesLeft, 1);

  // Enemy turn: the card does nothing.
  assert.equal(s.turn, 'enemy');
  assert.equal(formCardFor(s), 'knight-hop', 'card stays lit on the enemy turn');
  assert.equal(applyAbilityActivate(s, 'knight-hop'), s, 'no turn-back on the enemy turn');

  s = runEnemyTurn(s);
  assert.equal(s.turn, 'rookie');
  assert.equal(s.status, 'playing');
  assert.equal(s.form, 'knight');
  const moveCount = s.moveCount;
  assert.match(cardStatusFor(s)?.text ?? '', /turn back into a rook/);

  const back = applyAbilityActivate(s, 'knight-hop');
  assert.equal(back.form, 'rook');
  assert.equal(back.formMovesLeft, 0);
  assert.equal(back.abilities[0].usesLeftThisLevel, 0, 'no refund once she has moved');
  assert.equal(back.turn, 'rookie', 'turning back does not use her turn');
  assert.equal(back.moveCount, moveCount);
  assert.equal(formCardFor(back), null);
  assert.ok(squares(back).includes('e8'), 'rook move straight up the file');
  assert.ok(!squares(back).includes('f5'), 'no knight moves left');

  // A second tap (0 charges, already a rook) is a no-op — nothing to gain.
  assert.equal(applyAbilityActivate(back, 'knight-hop'), back);

  const moved = applyRookieMove(back, fromSquare('e6'));
  assert.equal(toSquare(moved.rookie), 'e6');
  assert.equal(moved.form, 'rook');
});

test('turning back keeps Surge bonus moves, and a pending Surge undo cannot hand the old form back', () => {
  let s = board('d1', [E('h8', 'king')], 'knight-hop', 3);
  s = { ...s, abilities: [...s.abilities, { id: 'surge', tier: 1, mutations: [], usesLeftThisLevel: 1 }] };
  s = applyAbilityActivate(s, 'knight-hop');
  s = applyAbilityActivate(s, 'surge'); // +1 bonus move; Surge is now the undoable cast
  s = applyRookieMove(s, fromSquare('e3')); // spends the bonus move: still her turn
  assert.equal(s.turn, 'rookie');
  assert.equal(s.form, 'knight');
  const back = applyAbilityActivate(s, 'knight-hop');
  assert.equal(back.form, 'rook');
  assert.equal(back.turn, 'rookie');
  assert.equal(back.bonusMovesLeft, s.bonusMovesLeft);

  // Knight form, then Surge (undoable), then turn back, then undo Surge.
  let t = board('d1', [E('h8', 'king')], 'knight-hop', 3);
  t = { ...t, form: 'knight', formMovesLeft: 2, abilities: [...t.abilities, { id: 'surge', tier: 1, mutations: [], usesLeftThisLevel: 1 }] };
  t = applyAbilityActivate(t, 'surge');
  t = applyAbilityActivate(t, 'knight-hop'); // turn back
  assert.equal(t.form, 'rook');
  t = applyAbilityActivate(t, 'surge'); // undo surge
  assert.equal(t.form, 'rook', 'the surge undo does not restore the knight');
  assert.equal(t.bonusMovesLeft, 0);
});

test('Become King: turning back ends every king-form protection — the pawn takes her', () => {
  // As if she had cast Become King (T3, 2 enemy turns) and one turn is gone.
  const base = board('d3', [E('h8', 'king'), E('e5', 'pawn')], 'become-king', 3);
  const king: BoardState = { ...base, form: 'king', formMovesLeft: 1, moveCount: 1 };

  // Control: still a king, she steps onto the pawn's diagonal and is bounced.
  const safe = runEnemyTurn(applyRookieMove(king, fromSquare('d4')));
  assert.equal(safe.status, 'playing', 'king form is impervious');

  // Turn back, same square: a rook there is fair game.
  const back = applyAbilityActivate(king, 'become-king');
  assert.equal(back.form, 'rook');
  assert.equal(back.formMovesLeft, 0);
  assert.equal(back.abilities[0].usesLeftThisLevel, base.abilities[0].usesLeftThisLevel, 'no refund');
  const taken = runEnemyTurn(applyRookieMove(back, fromSquare('d4')));
  assert.equal(taken.status, 'lost', 'no bounce once she is a rook');
});

test('a level-locked form (not from a card) cannot be turned back', () => {
  const s = { ...board('d1', [E('h8', 'king')], 'knight-hop', 2), form: 'knight' as const, formMovesLeft: -1 };
  assert.equal(formCardFor(s), null);
  const tapped = applyAbilityActivate(s, 'knight-hop');
  assert.notEqual(tapped.form, 'rook', 'the tap is a normal cast, never a turn-back');
});

test('bots are never offered the turn-back, so they cannot toggle', async () => {
  let s = board('d1', [E('h8', 'king'), E('a7', 'pawn')], 'knight-hop', 4); // 2 charges
  s = applyAbilityActivate(s, 'knight-hop');
  s = runEnemyTurn(applyRookieMove(s, fromSquare('e3')));
  assert.equal(s.form, 'knight');
  assert.ok(s.abilities[0].usesLeftThisLevel > 0, 'charges left, so only the form gates it');
  const offered = await botCandidates(s);
  assert.ok(
    !offered.some((c) => c.kind === 'activate-ability' && c.abilityId === 'knight-hop'),
    'no transform-card action while she is in its form',
  );
});

test('solver: a win that needs the rook back is not called dead', () => {
  // Knight on a1, one move left, king still on a8: only a rook reaches him.
  const base = board('a1', [E('a8', 'king')], 'knight-hop', 2);
  const s: BoardState = {
    ...base,
    form: 'knight',
    formMovesLeft: 1,
    moveLimit: base.moveCount + 1,
    abilities: [{ ...base.abilities[0], usesLeftThisLevel: 0 }],
  };
  assert.equal(isUnwinnable(s), false, 'turn back, then a1-a8 takes the king');
  // Without the card there is no way back — genuinely dead.
  assert.equal(isUnwinnable({ ...s, abilities: [] }), true);
  // And the real engine agrees: turn back, capture.
  const won = applyRookieMove(applyAbilityActivate(s, 'knight-hop'), fromSquare('a8'));
  assert.equal(won.status, 'won');
});
