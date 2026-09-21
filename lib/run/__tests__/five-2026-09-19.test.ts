/**
 * The ability-first five of 2026-09-19 — Promote, Puppet, Raise, Eruption,
 * Chain (docs/new-abilities-2026-09-19.md). One core rule and one edge case
 * per card, plus the two terrain rules they bring (R1 lava burns what is
 * forced into it; R2 lava can spread) and the Rewind snapshot contract.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  abilityLegalMoves,
  applyAbilityActivate,
  applyAbilityTargeted,
  applyControlledAllyMove,
  canArmChain,
  chainPreview,
  chainVictims,
  consequenceTint,
  eruptionFloodAll,
  eruptionFloodSquares,
  eruptionVents,
  graveOf,
  maxUsesForTier,
  promotedType,
  promoteChoices,
  promoteOptions,
  applyPromoteChoice,
  promoteTargets,
  puppetDestinations,
  puppetTargets,
  raiseSpawnSquares,
  sacrificeTargets,
  swapTargets,
} from '../abilities';
import { applyRookieMove } from '../engine';
import { runEnemyTurn } from '../pawn-ai';
import { puzzleToBoardState } from '../seed';
import { fromSquare, toSquare } from '../types';
import type { AbilityId, AbilityTier } from '../abilities';
import type { AllyPiece, BoardState, EnemyPiece, Hazard } from '../types';

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });
const A = (id: number, sq: string, type: AllyPiece['type'], source: AllyPiece['source'], extra: Partial<AllyPiece> = {}): AllyPiece => ({
  id,
  type,
  source,
  ...fromSquare(sq),
  ...extra,
});
const LAVA = (sq: string): Hazard => ({ ...fromSquare(sq), kind: 'lava' });
const STONE = (sq: string): Hazard => ({ ...fromSquare(sq), kind: 'stone' });
const squares = (cs: { file: number; rank: number }[]) => cs.map(toSquare).sort();

function board(
  id: AbilityId,
  tier: AbilityTier,
  rookie: string,
  enemies: EnemyPiece[],
  opts: { allies?: AllyPiece[]; hazards?: Hazard[]; extra?: AbilityId[] } = {},
): BoardState {
  const start = puzzleToBoardState(
    { level: 5, rookieStart: fromSquare(rookie), pieces: enemies, hazards: opts.hazards, winCondition: 'king', kingBehavior: 'flee' },
    { aiRngSeed: 3 },
  );
  return {
    ...start,
    rookie: fromSquare(rookie),
    allies: opts.allies ?? [],
    abilities: [id, ...(opts.extra ?? [])].map((a) => ({
      id: a,
      tier,
      mutations: [],
      usesLeftThisLevel: maxUsesForTier(a, tier),
    })),
  };
}

/** Activate, then tap each square in order (two-step cards take two). */
function cast(state: BoardState, id: AbilityId, ...taps: string[]): BoardState {
  let s = applyAbilityActivate(state, id);
  for (const t of taps) s = applyAbilityTargeted(s, id, fromSquare(t));
  return s;
}

// --- Promote ----------------------------------------------------------------

test('promote: the ladder is pawn, knight, bishop, rook, queen — up to one rung at T1, two at T3, queen at T5', () => {
  assert.equal(promotedType('pawn', 1), 'knight');
  assert.equal(promotedType('knight', 1), 'bishop');
  assert.equal(promotedType('bishop', 2), 'rook');
  assert.equal(promotedType('rook', 1), 'queen');
  assert.equal(promotedType('pawn', 3), 'bishop');
  assert.equal(promotedType('bishop', 4), 'queen');
  assert.equal(promotedType('rook', 3), 'queen'); // clamps at the top
  assert.equal(promotedType('pawn', 5), 'queen');
  assert.equal(promotedType('queen', 5), null);
});

test('promote: changes the type only — clock, daze and source stand; a queen is not a target', () => {
  const s = board('promote', 1, 'a1', [E('h8', 'king')], {
    allies: [A(1, 'c3', 'pawn', 'convert', { dazed: true }), A(2, 'd4', 'queen', 'duchess', { turnsLeft: 3 }), A(3, 'e2', 'knight', 'squire', { turnsLeft: 5 })],
  });
  assert.deepEqual(squares(promoteTargets(s)), ['c3', 'e2']);
  const after = cast(s, 'promote', 'c3');
  const body = after.allies.find((a) => a.id === 1)!;
  assert.deepEqual({ type: body.type, dazed: body.dazed, source: body.source }, { type: 'knight', dazed: true, source: 'convert' });
  assert.equal(after.turn, 'rookie'); // a free action
  assert.equal(after.abilities[0].usesLeftThisLevel, 0);
  // The Duchess is already the top rung: the tap does nothing.
  assert.equal(cast(s, 'promote', 'd4').abilities[0].usesLeftThisLevel, 1);
});

test('promote: an upgrade never removes the smaller step — T3+ offers every rung in reach', () => {
  assert.deepEqual(promoteOptions('pawn', 1), ['knight']);
  assert.deepEqual(promoteOptions('pawn', 2), ['knight']);
  assert.deepEqual(promoteOptions('pawn', 3), ['knight', 'bishop']);
  assert.deepEqual(promoteOptions('rook', 4), ['queen']);
  assert.deepEqual(promoteOptions('pawn', 5), ['knight', 'bishop', 'rook', 'queen']);
  assert.deepEqual(promoteOptions('queen', 5), []);
});

test('promote T3: the first tap holds the summon, the choice commits — the knight is still on offer', () => {
  const s = board('promote', 3, 'a1', [E('h8', 'king')], {
    allies: [A(1, 'c3', 'pawn', 'convert'), A(2, 'e2', 'rook', 'squire', { turnsLeft: 5 })],
  });
  const held = cast(s, 'promote', 'c3');
  assert.deepEqual(held.activeAbility?.promoteFrom, fromSquare('c3'));
  assert.deepEqual(promoteChoices(held), ['knight', 'bishop']);
  assert.equal(held.abilities[0].usesLeftThisLevel, 2, 'nothing is spent until the rung is picked');
  assert.equal(held.allies.find((a) => a.id === 1)!.type, 'pawn');
  // A rung out of reach is a no-op.
  assert.equal(applyPromoteChoice(held, 'rook'), held);
  const knight = applyPromoteChoice(held, 'knight');
  assert.equal(knight.allies.find((a) => a.id === 1)!.type, 'knight');
  assert.equal(knight.abilities[0].usesLeftThisLevel, 1);
  assert.equal(knight.activeAbility, null);
  assert.equal(applyPromoteChoice(held, 'bishop').allies.find((a) => a.id === 1)!.type, 'bishop');
  // Only one rung in reach (rook, queen): no choice to make, it commits on the tap.
  const queen = cast(s, 'promote', 'e2');
  assert.equal(queen.allies.find((a) => a.id === 2)!.type, 'queen');
  assert.equal(queen.activeAbility, null);
  // Tapping another summon while holding re-aims.
  const reaimed = applyAbilityTargeted(held, 'promote', fromSquare('e2'));
  assert.equal(reaimed.allies.find((a) => a.id === 2)!.type, 'queen');
});

// --- Puppet -----------------------------------------------------------------

test('puppet: first guard on her line, walked one of ITS moves; never the king', () => {
  // Rook on a1. a5 pawn is first on the file; the a7 knight behind it is not
  // reachable. The king on the rank is never a target.
  const s = board('puppet', 1, 'a1', [E('a5', 'pawn'), E('a7', 'knight'), E('h1', 'king')]);
  assert.deepEqual(squares(puppetTargets(s)), ['a5']);
  assert.deepEqual(squares(puppetDestinations(s, fromSquare('a5')).map((d) => d.to)), ['a4']);
  const after = cast(s, 'puppet', 'a5', 'a4');
  assert.ok(after.pieces.some((p) => p.type === 'pawn' && toSquare(p) === 'a4'));
  assert.equal(after.turn, 'rookie');
  // Tapping the king never arms the second step.
  const onKing = applyAbilityTargeted(applyAbilityActivate(s, 'puppet'), 'puppet', fromSquare('h1'));
  assert.equal(onKing.activeAbility?.puppetFrom, undefined);
});

test('puppet R1: lava along its move is a destination that kills it — her capture, the king is stunned', () => {
  // Bishop d4: the c5 lava is first on that diagonal; stone on e5 blocks.
  const s = board('puppet', 1, 'd1', [E('d4', 'bishop'), E('h8', 'king')], { hazards: [LAVA('c5'), STONE('e5')] });
  const dests = puppetDestinations(s, fromSquare('d4'));
  assert.equal(dests.find((d) => toSquare(d.to) === 'c5')?.kills, 'lava');
  assert.ok(!dests.some((d) => toSquare(d.to) === 'e5'), 'stone is never a destination');
  assert.ok(!dests.some((d) => toSquare(d.to) === 'b6'), 'nothing slides past the lava');
  assert.deepEqual(squares(consequenceTint({ ...cast(s, 'puppet', 'd4') })!.wash), ['c5']);
  const after = cast(s, 'puppet', 'd4', 'c5');
  assert.ok(!after.pieces.some((p) => p.type === 'bishop'));
  assert.deepEqual(after.captures, ['bishop']);
  assert.equal(after.kingStunTurns, 1);
  assert.ok(after.tempo > s.tempo);
});

test('puppet: friendly fire is T3+, and T4 reaches a guard within 3 with no line', () => {
  const pieces = [E('d4', 'knight'), E('e6', 'pawn'), E('h8', 'king')];
  const t1 = board('puppet', 1, 'd1', pieces);
  assert.ok(!puppetDestinations(t1, fromSquare('d4')).some((d) => d.kills === 'guard'));
  const t3 = board('puppet', 3, 'd1', pieces);
  assert.equal(puppetDestinations(t3, fromSquare('d4')).find((d) => toSquare(d.to) === 'e6')?.kills, 'guard');
  const after = cast(t3, 'puppet', 'd4', 'e6');
  assert.deepEqual(after.captures, ['pawn']);
  assert.ok(after.pieces.some((p) => p.type === 'knight' && toSquare(p) === 'e6'));
  // Off her lines: invisible at T3, grabbable at T4 (Chebyshev 3).
  const off = [E('c4', 'knight'), E('h8', 'king')];
  assert.deepEqual(puppetTargets(board('puppet', 3, 'a1', off)), []);
  assert.deepEqual(squares(puppetTargets(board('puppet', 4, 'a1', off))), ['c4']);
});

// --- Raise ------------------------------------------------------------------

test('raise: not castable with an empty grave', () => {
  const s = board('raise', 1, 'a1', [E('a5', 'pawn'), E('h8', 'king')]);
  assert.equal(graveOf(s), null);
  assert.deepEqual(raiseSpawnSquares(s), []);
  assert.equal(applyAbilityActivate(s, 'raise').activeAbility, null);
});

test('raise: the last capture stands up beside her — controlled, dazed, on a clock; the grave empties', () => {
  const s0 = board('raise', 1, 'a1', [E('a5', 'bishop'), E('h8', 'king')], { extra: ['swap', 'sacrifice'] });
  const s = { ...runEnemyTurn(applyRookieMove(s0, fromSquare('a5'))), turn: 'rookie' as const };
  assert.equal(graveOf(s), 'bishop');
  assert.ok(squares(raiseSpawnSquares(s)).includes('b5'));
  const after = cast(s, 'raise', 'b5');
  const body = after.allies.find((a) => a.source === 'raise')!;
  assert.deepEqual({ type: body.type, dazed: body.dazed, turnsLeft: body.turnsLeft, sq: toSquare(body) }, { type: 'bishop', dazed: true, turnsLeft: 6, sq: 'b5' });
  // An ordinary controlled summon: Swap and Sacrifice may target it.
  assert.deepEqual(squares(swapTargets(after)), ['b5']);
  assert.deepEqual(squares(sacrificeTargets(after)), ['b5']);
  // Dazed: it does not move the turn it is raised.
  assert.equal(applyControlledAllyMove(after, fromSquare('b5'), fromSquare('c6')), after);
  // The grave is spent until the next capture.
  assert.equal(graveOf(after), null);
  assert.deepEqual(raiseSpawnSquares(after), []);
});

test('raise: T1-T2 lift a pawn or a minor only; T3 lifts a queen', () => {
  const withQueen = (tier: AbilityTier) => ({ ...board('raise', tier, 'a1', [E('h8', 'king')]), captures: ['queen' as const] });
  assert.deepEqual(raiseSpawnSquares(withQueen(2)), []);
  assert.ok(raiseSpawnSquares(withQueen(3)).length > 0);
});

test('raise: never offers a square whose body would leave her with no legal move', () => {
  // Rookie h6 in a one-wide dead end: stone on g5, g6, g7 and h7, so h5 is her
  // only exit. A dazed body on h5 would plug it — no move, no loss, stuck.
  const s = {
    ...board('raise', 1, 'h6', [E('a8', 'king')], { hazards: [STONE('g5'), STONE('g6'), STONE('g7'), STONE('h7')] }),
    captures: ['pawn' as const],
  };
  assert.equal(graveOf(s), 'pawn');
  assert.deepEqual(raiseSpawnSquares(s), []);
  assert.equal(cast(s, 'raise', 'h5').allies.length, 0);
  // Open g5 and h5 is still her only MOVE (a rook does not step diagonally),
  // so g5 is offered and h5 is not.
  const wider = { ...s, hazards: s.hazards.filter((h) => toSquare(h) !== 'g5') };
  assert.deepEqual(squares(raiseSpawnSquares(wider)), ['g5']);
});

// --- Eruption ---------------------------------------------------------------

test('eruption R2: T1 floods ONE tapped neighbour with lava and burns a pawn there (capture + stun)', () => {
  const s = board('eruption', 1, 'a1', [E('b3', 'pawn'), E('c2', 'knight'), E('h8', 'king')], { hazards: [LAVA('b2')] });
  assert.deepEqual(squares(eruptionVents(s)), ['b2']);
  // b3 pawn burns; the c2 knight is too big at T1, so c2 is not in the flood.
  assert.deepEqual(squares(eruptionFloodSquares(s, fromSquare('b2')).map((f) => f.square)), ['a2', 'b1', 'b3']);
  const aimed = cast(s, 'eruption', 'b2');
  assert.deepEqual(squares(consequenceTint(aimed)!.kills), ['b3']);
  assert.equal(aimed.abilities[0].usesLeftThisLevel, 1, 'nothing is spent until the flood is tapped');
  const after = cast(s, 'eruption', 'b2', 'b3');
  assert.ok(after.hazards.some((h) => toSquare(h) === 'b3' && h.kind === 'lava'));
  assert.ok(!after.hazards.some((h) => toSquare(h) === 'a2'), 'T1 floods one square only');
  assert.deepEqual(after.captures, ['pawn']);
  assert.equal(after.kingStunTurns, 1);
  assert.equal(after.turn, 'rookie');
});

test('eruption: never the king, her square or a summon; T3 floods all four; out of reach is no vent', () => {
  const s = board('eruption', 3, 'c2', [E('b3', 'king'), E('h8', 'pawn')], {
    hazards: [LAVA('b2'), LAVA('h5')],
    allies: [A(1, 'b1', 'knight', 'squire')],
  });
  // b2's neighbours: a2 (open), c2 (her), b1 (summon), b3 (king) — only a2.
  assert.deepEqual(squares(eruptionFloodSquares(s, fromSquare('b2')).map((f) => f.square)), ['a2']);
  assert.deepEqual(squares(eruptionVents(s)), ['b2'], 'h5 is 5 away: reach is 3 at T3');
});

test('eruption T3: one tinted square floods that square only; the vent again floods all four', () => {
  const open = board('eruption', 3, 'a1', [E('d3', 'pawn'), E('h8', 'king')], { hazards: [LAVA('c3')] });
  const aimed = cast(open, 'eruption', 'c3');
  assert.deepEqual(squares(abilityLegalMoves(aimed, 'eruption')), ['b3', 'c2', 'c3', 'c4', 'd3']);
  const one = cast(open, 'eruption', 'c3', 'c4');
  assert.deepEqual(squares(one.hazards), ['c3', 'c4']);
  assert.deepEqual(one.captures, []);
  assert.equal(one.abilities[0].usesLeftThisLevel, 1);
  const all = cast(open, 'eruption', 'c3', 'c3');
  assert.deepEqual(squares(all.hazards), ['b3', 'c2', 'c3', 'c4', 'd3']);
  assert.deepEqual(all.captures, ['pawn']);
  assert.equal(all.abilities[0].usesLeftThisLevel, 1);
  // T1: the vent again is just a re-aim, never a flood.
  const t1 = cast(board('eruption', 1, 'a1', [E('h8', 'king')], { hazards: [LAVA('c3')] }), 'eruption', 'c3', 'c3');
  assert.deepEqual(squares(t1.hazards), ['c3']);
  assert.deepEqual(eruptionFloodAll(t1, fromSquare('c3')), []);
});

test('eruption T3: a flood-all that would strand her is refused, the safe single squares are not', () => {
  // Rook a1, stone b1: a2 is her only move. The a3 vent's flood-all takes a2.
  const s = board('eruption', 3, 'a1', [E('h8', 'king')], { hazards: [STONE('b1'), LAVA('a3')] });
  assert.deepEqual(eruptionFloodAll(s, fromSquare('a3')), []);
  assert.deepEqual(squares(eruptionFloodSquares(s, fromSquare('a3')).map((f) => f.square)), ['a4', 'b3']);
  assert.deepEqual(squares(eruptionVents(s)), ['a3']);
  assert.deepEqual(squares(cast(s, 'eruption', 'a3', 'a3').hazards), ['a3', 'b1'], 'the vent again does nothing here');
});

test('eruption: refuses a flood that would leave her with no move', () => {
  // Rook a1 boxed by stone on b1: a2 is her only move, and a3's flood takes it.
  const s = board('eruption', 1, 'a1', [E('h8', 'king')], { hazards: [STONE('b1'), LAVA('a3'), STONE('b3')] });
  assert.ok(!eruptionFloodSquares(s, fromSquare('a3')).some((f) => toSquare(f.square) === 'a2'));
});

// --- Chain ------------------------------------------------------------------

test('chain: depth by tier is 2 / 3 / 4 / any links, same type only below T3', () => {
  // A diagonal pawn line a2-b3-c4-d5-e6-f7, a knight hanging off b3.
  const line = ['a2', 'b3', 'c4', 'd5', 'e6', 'f7'].map((sq) => E(sq, 'pawn'));
  const pieces = [...line, E('a4', 'knight'), E('h1', 'king')];
  const links = (tier: AbilityTier) => squares(chainVictims(board('chain', tier, 'a1', pieces), fromSquare('a2')));
  assert.deepEqual(links(1), ['b3', 'c4']);
  assert.deepEqual(links(2), ['b3', 'c4', 'd5']);
  assert.deepEqual(links(3), ['a4', 'b3', 'c4', 'd5', 'e6'], 'T3: pawns and knights are one family');
  assert.deepEqual(links(4), ['a4', 'b3', 'c4', 'd5', 'e6', 'f7']);
});

test('chain: the king never carries it, even at T5', () => {
  const s = board('chain', 5, 'a1', [E('a2', 'pawn'), E('b3', 'king'), E('c4', 'pawn')]);
  assert.deepEqual(chainVictims(s, fromSquare('a2')), []);
  assert.equal(canArmChain(s), false, 'no chain on offer: the card is not castable');
});

test('chain: arm, capture — the tinted links die with the victim, tempo and stun are hers, the arm is spent', () => {
  const s = board('chain', 1, 'a1', [E('a2', 'pawn'), E('b3', 'pawn'), E('c4', 'pawn'), E('d5', 'pawn'), E('h8', 'king')]);
  assert.deepEqual(chainPreview(s).map((c) => toSquare(c.head)), ['a2']);
  const armed = applyAbilityActivate(s, 'chain');
  assert.equal(armed.chainArmed, true);
  assert.equal(armed.turn, 'rookie');
  assert.deepEqual(squares(consequenceTint(armed)!.kills), ['b3', 'c4']);
  const after = applyRookieMove(armed, fromSquare('a2'));
  assert.deepEqual(squares(after.pieces), ['d5', 'h8']);
  assert.deepEqual(after.captures, ['pawn', 'pawn', 'pawn']);
  assert.equal(after.chainArmed, false);
  assert.equal(after.kingStunTurns, 1);
  assert.ok(after.tempo >= 3);
  // Unarmed, the same capture takes one pawn — existing play is untouched.
  assert.deepEqual(applyRookieMove(s, fromSquare('a2')).captures, ['pawn']);
});

test('chain: a controlled summon carries it; an unspent arm is gone when her turn comes back', () => {
  const s = board('chain', 1, 'h1', [E('b3', 'pawn'), E('c4', 'pawn'), E('h8', 'king')], {
    allies: [A(1, 'a1', 'knight', 'squire')],
  });
  const after = applyControlledAllyMove(applyAbilityActivate(s, 'chain'), fromSquare('a1'), fromSquare('b3'));
  assert.deepEqual(after.captures, ['pawn', 'pawn']);
  assert.equal(after.chainArmed, false);
  // Armed, then a quiet move: the enemy phase clears it.
  const quiet = runEnemyTurn(applyRookieMove(applyAbilityActivate(s, 'chain'), fromSquare('g1')));
  assert.equal(quiet.turn, 'rookie');
  assert.equal(quiet.chainArmed, false);
});

// --- Rewind -----------------------------------------------------------------

test('rewind: the enemy-phase snapshot carries the grave floor, and never restores a stale Chain arm', () => {
  const s0 = board('raise', 1, 'a1', [E('a5', 'knight'), E('c7', 'pawn'), E('h8', 'king')], { extra: ['rewind', 'chain'] });
  // Capture (grave = knight), raise it, move quietly: the snapshot taken at
  // the start of that enemy phase holds the spent grave floor.
  const captured = { ...runEnemyTurn(applyRookieMove(s0, fromSquare('a5'))), turn: 'rookie' as const };
  const raised = cast(captured, 'raise', 'b5');
  assert.equal(raised.graveFloor, 1);
  const next = runEnemyTurn(applyRookieMove({ ...raised, chainArmed: true }, fromSquare('a4')));
  assert.equal(next.chainArmed, false);
  const snap = next.enemyRewindStack![next.enemyRewindStack!.length - 1];
  assert.equal(snap.graveFloor, 1);
  assert.ok(snap.allies.some((a) => a.source === 'raise'));
  const rewound = applyAbilityActivate(next, 'rewind');
  assert.notEqual(rewound, next);
  assert.equal(rewound.graveFloor, 1);
  assert.ok(rewound.allies.some((a) => a.source === 'raise'));
  assert.ok(!rewound.chainArmed, 'last turn\'s unspent arm does not come back');
});
