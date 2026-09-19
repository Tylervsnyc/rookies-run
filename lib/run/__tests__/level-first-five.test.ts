/**
 * The level-first five of 2026-09-19 — Castle, Catapult, Mirror, Ricochet,
 * Avalanche — plus the two terrain rules they bring: R3 (a stone that slides
 * or lands into lava: both vanish, open ground) and R4 (stone is a mirror for
 * Ricochet; lava is not). Design: docs/new-abilities-2026-09-19.md.
 *
 * One core rule and one edge case per card.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  abilityLegalMoves,
  abilityPreviewFor,
  applyAbilityActivate,
  applyAbilityTargeted,
  avalancheOutcome,
  canMoveAllyAt,
  canRewind,
  castleLanding,
  catapultThrowsFrom,
  mirrorEchoLanding,
  pushEnemyPhaseSnapshot,
  swapTargets,
} from '../abilities';
import { applyRookieMove } from '../engine';
import { ricochetPaths, rookieLegalMoves } from '../movement';
import { stepEnemyTurn } from '../pawn-ai';
import { puzzleToBoardState } from '../seed';
import { fromSquare, toSquare } from '../types';
import type { AbilityId, AbilityTier } from '../abilities';
import type { AllyPiece, BoardState, EnemyPiece, Hazard } from '../types';

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });
const STONE = (sq: string, fixed = false): Hazard => ({ ...fromSquare(sq), kind: 'stone', ...(fixed ? { fixed } : {}) });
const LAVA = (sq: string): Hazard => ({ ...fromSquare(sq), kind: 'lava' });
const sqs = (cs: { file: number; rank: number }[]) => cs.map(toSquare).sort();

function board(opts: {
  rookie: string;
  enemies: EnemyPiece[];
  hazards?: Hazard[];
  kit: [AbilityId, AbilityTier][];
  allies?: AllyPiece[];
  kingPen?: string[];
}): BoardState {
  const start = puzzleToBoardState(
    {
      level: 5,
      rookieStart: fromSquare(opts.rookie),
      pieces: opts.enemies,
      hazards: opts.hazards ?? [],
      winCondition: 'king',
      kingBehavior: 'flee',
      kingPen: opts.kingPen,
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

/** Run the enemy phase to completion. */
function settle(s: BoardState): BoardState {
  let cur = s;
  for (let i = 0; i < 64 && cur.turn === 'enemy' && cur.status === 'playing'; i++) cur = stepEnemyTurn(cur);
  return cur;
}

// ---------------------------------------------------------------------------
// Castle
// ---------------------------------------------------------------------------

test('castle: through a wall — he jumps two toward her, she lands on the square he crossed; it ends the turn', () => {
  // A lava wall on d5/e5 stands between them; both landings (f5 his, g5 hers) are open.
  const s = board({
    rookie: 'a5',
    enemies: [E('h5', 'king')],
    hazards: [LAVA('d5'), LAVA('e5')],
    kit: [['castle', 1]],
    kingPen: ['h5', 'h4', 'h6'],
  });
  assert.deepEqual(castleLanding(s), { kingFrom: fromSquare('h5'), king: fromSquare('f5'), rookie: fromSquare('g5'), short: false });
  const armed = applyAbilityActivate(s, 'castle');
  assert.deepEqual(sqs(abilityLegalMoves(armed, 'castle')), ['f5', 'g5']);
  // Both hops are drawn before she commits.
  assert.equal(abilityPreviewFor(armed)?.arrows.length, 2);
  const after = applyAbilityTargeted(armed, 'castle', fromSquare('f5'));
  assert.equal(toSquare(after.rookie), 'g5');
  assert.equal(toSquare(after.pieces.find((p) => p.type === 'king')!), 'f5');
  assert.equal(after.turn, 'enemy');
  assert.equal(after.moveCount, s.moveCount + 1);
  // He left his room: the pen is now his landing square plus its open neighbours (never the lava).
  assert.ok(after.kingPen!.includes('f5') && after.kingPen!.includes('f6') && after.kingPen!.includes('g4'));
  assert.ok(!after.kingPen!.includes('e5') && !after.kingPen!.includes('h5'));
});

test('castle: refused when his landing is blocked or she has no landing at all, on a file at T1, and out of rook form', () => {
  // The square he crosses (g5) is taken: she pulls up short, beside his landing on HER side (e5).
  const crossedTaken = board({ rookie: 'a5', enemies: [E('h5', 'king'), E('g5', 'pawn')], kit: [['castle', 1]] });
  assert.deepEqual(castleLanding(crossedTaken), { kingFrom: fromSquare('h5'), king: fromSquare('f5'), rookie: fromSquare('e5'), short: true });
  // ...and with e5 taken too there is nowhere for her: the cast is refused.
  const blocked = board({
    rookie: 'a5',
    enemies: [E('h5', 'king'), E('g5', 'pawn')],
    hazards: [STONE('e5')],
    kit: [['castle', 1]],
  });
  assert.equal(castleLanding(blocked), null);
  assert.equal(applyAbilityActivate(blocked, 'castle').activeAbility, null);
  const stoneOnHis = board({ rookie: 'a5', enemies: [E('h5', 'king')], hazards: [STONE('f5')], kit: [['castle', 1]] });
  assert.equal(castleLanding(stoneOnHis), null);
  const onFile = (tier: AbilityTier) => board({ rookie: 'd1', enemies: [E('d8', 'king')], kit: [['castle', tier]] });
  assert.equal(castleLanding(onFile(1)), null);
  assert.deepEqual(castleLanding(onFile(2))?.king, fromSquare('d6'));
  assert.equal(castleLanding({ ...onFile(2), form: 'knight' }), null);
});

test('castle: a castled king does not swing at her the next phase — he runs; T4 lands him stunned', () => {
  const s = board({ rookie: 'a5', enemies: [E('h5', 'king')], kit: [['castle', 1]] });
  const after = settle(cast(s, 'castle', 'g5'));
  assert.equal(after.status, 'playing', 'she is touching him and survives the phase');
  assert.notEqual(toSquare(after.pieces.find((p) => p.type === 'king')!), 'f5', 'he fled her line');
  assert.equal(after.kingCastled, undefined, 'the grace lasts exactly one phase');
  const t4 = cast(board({ rookie: 'a5', enemies: [E('h5', 'king')], kit: [['castle', 4]] }), 'castle', 'g5');
  assert.equal(t4.kingStunTurns, 1);
});

test('castle: a king on a 1-square island ringed by lava is brought out; she pulls up short beside him on her own side', () => {
  // e5 is his island; all eight squares round it are lava, so the square he
  // crosses (d5) is lava. He lands on c5; she lands on b5 — beside him, her side.
  const ring = ['d4', 'd5', 'd6', 'e4', 'e6', 'f4', 'f5', 'f6'].map((sq) => LAVA(sq));
  const s = board({ rookie: 'a5', enemies: [E('e5', 'king')], hazards: ring, kit: [['castle', 1]], kingPen: ['e5'] });
  assert.deepEqual(castleLanding(s), { kingFrom: fromSquare('e5'), king: fromSquare('c5'), rookie: fromSquare('b5'), short: true });
  const armed = applyAbilityActivate(s, 'castle');
  // Both landing squares glow before she commits.
  assert.deepEqual(sqs(abilityLegalMoves(armed, 'castle')), ['b5', 'c5']);
  assert.deepEqual(sqs(abilityPreviewFor(armed)!.marks.map((m) => m.square)), ['b5', 'c5']);
  const after = applyAbilityTargeted(armed, 'castle', fromSquare('c5'));
  assert.equal(toSquare(after.pieces.find((p) => p.type === 'king')!), 'c5');
  assert.equal(toSquare(after.rookie), 'b5');
  assert.equal(after.turn, 'enemy');
  assert.equal(after.kingCastled, true);
  // He is off the island for good: the new pen is c5 and its open neighbours.
  assert.ok(after.kingPen!.includes('c5') && !after.kingPen!.includes('e5') && !after.kingPen!.includes('d5'));
  // At distance 3 the short square is the one she already stands on: she stays put.
  const close = board({ rookie: 'b5', enemies: [E('e5', 'king')], hazards: ring, kit: [['castle', 1]], kingPen: ['e5'] });
  assert.deepEqual(castleLanding(close)?.rookie, fromSquare('b5'));
  const stayed = cast(close, 'castle', 'c5');
  assert.equal(toSquare(stayed.rookie), 'b5');
  assert.equal(toSquare(stayed.pieces.find((p) => p.type === 'king')!), 'c5');
  assert.equal(stayed.turn, 'enemy');
});

// ---------------------------------------------------------------------------
// Catapult (+ R3)
// ---------------------------------------------------------------------------

test('catapult: a stone flung into lava makes a ford — both vanish (R3)', () => {
  const s = board({
    rookie: 'd2',
    enemies: [E('d8', 'king')],
    hazards: [STONE('d3'), LAVA('d5'), LAVA('c5'), LAVA('e5')],
    kit: [['catapult', 1]],
  });
  const armed = applyAbilityActivate(s, 'catapult');
  assert.deepEqual(sqs(abilityLegalMoves(armed, 'catapult')), ['d3']);
  const loaded = applyAbilityTargeted(armed, 'catapult', fromSquare('d3'));
  // 2-4 squares from the stone: d5 (lava: ford), d6, d7.
  assert.deepEqual(sqs(abilityLegalMoves(loaded, 'catapult')), ['d5', 'd6', 'd7']);
  assert.deepEqual(abilityPreviewFor(loaded)?.marks, [{ square: fromSquare('d5'), tone: 'ford' }]);
  const after = applyAbilityTargeted(loaded, 'catapult', fromSquare('d5'));
  assert.deepEqual(sqs(after.hazards), ['c5', 'e5']);
  assert.equal(after.turn, 'rookie', 'a free action');
  assert.ok(rookieLegalMoves(after).some((m) => toSquare(m) === 'd8'), 'the ford opened her line to the king');
});

test('catapult: never the king, never a fixed stone or lava; T2 crushes a pawn; a summon lands as it was', () => {
  const mk = (tier: AbilityTier, hazards: Hazard[], enemies: EnemyPiece[], allies: AllyPiece[] = []) =>
    board({ rookie: 'd2', enemies, hazards, kit: [['catapult', tier]], allies });
  const onKing = mk(2, [STONE('d3')], [E('d6', 'king'), E('d5', 'pawn')]);
  const throws = catapultThrowsFrom(onKing, fromSquare('d3'));
  assert.deepEqual(sqs(throws.map((t) => t.to)), ['d5', 'd7']);
  assert.equal(throws.find((t) => toSquare(t.to) === 'd5')!.crushed?.type, 'pawn');
  assert.deepEqual(sqs(catapultThrowsFrom(mk(1, [STONE('d3')], [E('d6', 'king'), E('d5', 'pawn')]), fromSquare('d3')).map((t) => t.to)), ['d7']);
  assert.equal(catapultThrowsFrom(mk(1, [STONE('d3', true)], [E('h8', 'king')]), fromSquare('d3')).length, 0);
  assert.equal(catapultThrowsFrom(mk(1, [LAVA('d3')], [E('h8', 'king')]), fromSquare('d3')).length, 0);
  const crushed = cast(onKing, 'catapult', 'd3', 'd5');
  assert.equal(crushed.pieces.length, 1);
  assert.equal(crushed.kingStunTurns, 1, 'a crush is a Rookie capture');
  const ally: AllyPiece = { id: 7, type: 'knight', source: 'squire', ...fromSquare('e2'), dazed: true };
  const flung = cast(mk(1, [LAVA('g2')], [E('h8', 'king')], [ally]), 'catapult', 'e2', 'h2');
  assert.deepEqual({ sq: toSquare(flung.allies[0]), dazed: flung.allies[0].dazed }, { sq: 'h2', dazed: true });
});

// ---------------------------------------------------------------------------
// Mirror
// ---------------------------------------------------------------------------

test('mirror: the echo appears on the mirror square, copies her move flipped, and cannot be tapped', () => {
  const s = board({ rookie: 'b2', enemies: [E('h8', 'king')], kit: [['mirror', 1], ['swap', 1]] });
  const armed = applyAbilityActivate(s, 'mirror');
  assert.deepEqual(sqs(abilityLegalMoves(armed, 'mirror')), ['g2']);
  const up = applyAbilityTargeted(armed, 'mirror', fromSquare('g2'));
  const echo = up.allies[0];
  assert.deepEqual({ sq: toSquare(echo), type: echo.type, left: echo.echoMovesLeft }, { sq: 'g2', type: 'rook', left: 3 });
  assert.equal(canMoveAllyAt(up, echo), false);
  assert.deepEqual(sqs(swapTargets(up)), ['g2'], 'it is a summon: Swap may target it');
  // b2 -> d2 (two right) sends the echo g2 -> e2 (two left).
  assert.equal(toSquare(mirrorEchoLanding(up, fromSquare('d2'))!), 'e2');
  const moved = applyRookieMove(up, fromSquare('b5'));
  assert.deepEqual({ sq: toSquare(moved.allies[0]), left: moved.allies[0].echoMovesLeft }, { sq: 'g5', left: 2 });
});

test('mirror: the echo stops at a block, captures what it lands on, takes the king, and fades on its last move', () => {
  const echo = (sq: string, left?: number): AllyPiece => ({
    id: 9, type: 'rook', source: 'mirror', ...fromSquare(sq), ...(left !== undefined ? { echoMovesLeft: left } : {}),
  });
  // Block: her b2 -> b7 is five up; the echo on g2 meets a stone on g5 and stops on g4.
  const blocked = board({ rookie: 'b2', enemies: [E('a8', 'king')], hazards: [STONE('g5')], kit: [], allies: [echo('g2', 3)] });
  assert.equal(toSquare(applyRookieMove(blocked, fromSquare('b7')).allies[0]), 'g4');
  // Capture: a pawn on g4 is taken on the way, the echo stops there, the king is stunned.
  const cap = applyRookieMove(
    board({ rookie: 'b2', enemies: [E('a8', 'king'), E('g4', 'pawn')], kit: [], allies: [echo('g2', 3)] }),
    fromSquare('b7'),
  );
  assert.equal(toSquare(cap.allies[0]), 'g4');
  assert.deepEqual(cap.pieces.map((p) => p.type), ['king']);
  assert.equal(cap.kingStunTurns, 1);
  // The king: her b2 -> b6 sends the echo g2 -> g6 onto him.
  const win = applyRookieMove(board({ rookie: 'b2', enemies: [E('g6', 'king')], kit: [], allies: [echo('g2', 3)] }), fromSquare('b6'));
  assert.equal(win.status, 'won');
  // Last copied move: it moves, then it is gone.
  const last = applyRookieMove(board({ rookie: 'b2', enemies: [E('a8', 'king')], kit: [], allies: [echo('g2', 1)] }), fromSquare('b3'));
  assert.equal(last.allies.length, 0);
});

// ---------------------------------------------------------------------------
// Ricochet (+ R4)
// ---------------------------------------------------------------------------

test('ricochet: banks at stone, draws the path, may take the king; spent by her next rook move', () => {
  // She slides a1 -> a4 (stone on a5), turns right, and runs the 4th rank to the king on e4.
  const s = board({ rookie: 'a1', enemies: [E('e4', 'king')], hazards: [STONE('a5')], kit: [['ricochet', 1]] });
  assert.ok(!rookieLegalMoves(s).some((m) => toSquare(m) === 'e4'));
  const armed = applyAbilityActivate(s, 'ricochet');
  assert.equal(armed.ricochetBanks, 1);
  const path = ricochetPaths(armed).find((p) => toSquare(p.dest) === 'e4')!;
  assert.deepEqual(path.path.map(toSquare), ['a2', 'a3', 'a4', 'b4', 'c4', 'd4', 'e4']);
  assert.ok(abilityPreviewFor(armed)!.paths.some((p) => p.capture), 'the banked capture is drawn');
  // He does not see it coming: on the enemy phase her lines are straight only.
  assert.ok(!rookieLegalMoves({ ...armed, turn: 'enemy' }).some((m) => toSquare(m) === 'e4'));
  assert.equal(applyRookieMove(armed, fromSquare('e4')).status, 'won');
  // A plain move spends it too.
  assert.equal(applyRookieMove(armed, fromSquare('a2')).ricochetBanks, 0);
});

test('ricochet: lava and pieces never bank; two banks only from T3; not castable with no line to gain', () => {
  const atLava = board({ rookie: 'a1', enemies: [E('e4', 'king')], hazards: [LAVA('a5')], kit: [['ricochet', 1]] });
  assert.equal(applyAbilityActivate(atLava, 'ricochet').ricochetBanks, undefined, 'refused: no banked line exists');
  assert.equal(ricochetPaths({ ...atLava, ricochetBanks: 1 }).length, 0);
  const atPiece = board({ rookie: 'a1', enemies: [E('e4', 'king'), E('a5', 'pawn')], kit: [['ricochet', 1]] });
  assert.equal(ricochetPaths({ ...atPiece, ricochetBanks: 1 }).length, 0);
  // Dog-leg: a1 up to a4 (stone a5), right to d4 (stone e4), up to the king on d7.
  const dogleg = (tier: AbilityTier) =>
    applyAbilityActivate(
      board({ rookie: 'a1', enemies: [E('d7', 'king')], hazards: [STONE('a5'), STONE('e4'), STONE('d1'), STONE('d2')], kit: [['ricochet', tier]] }),
      'ricochet',
    );
  assert.ok(!rookieLegalMoves(dogleg(1)).some((m) => toSquare(m) === 'd7'));
  assert.ok(rookieLegalMoves(dogleg(3)).some((m) => toSquare(m) === 'd7'));
  // The move carries its corners so the board walks the line instead of cutting the diagonal.
  const won = applyRookieMove(dogleg(3), fromSquare('d7'));
  assert.deepEqual(
    { from: won.lastRicochetMove?.from, waypoints: won.lastRicochetMove?.waypoints },
    { from: 'a1', waypoints: ['a4', 'd4', 'd7'] },
  );
  // A straight move while armed carries none.
  assert.equal(applyRookieMove(dogleg(3), fromSquare('a2')).lastRicochetMove, undefined);
});

// ---------------------------------------------------------------------------
// Avalanche (+ R3)
// ---------------------------------------------------------------------------

test('avalanche: every loose stone slides one square, far side first; pawns are crushed; lava makes a ford', () => {
  const s = board({
    rookie: 'a1',
    enemies: [E('h8', 'king'), E('c5', 'pawn'), E('f5', 'knight')],
    hazards: [STONE('c4'), STONE('d3'), STONE('d4'), STONE('f4'), STONE('g4'), LAVA('g5')],
    kit: [['avalanche', 1]],
  });
  const o = avalancheOutcome(s, 'N')!;
  // c4 crushes the pawn; d4 then d3 shift as a column; f4 is refused by the knight (T1); g4 sinks.
  assert.deepEqual(
    o.slides.map((m) => `${toSquare(m.from)}>${toSquare(m.to)}${m.ford ? '~' : ''}`).sort(),
    ['c4>c5', 'd3>d4', 'd4>d5', 'g4>g5~'],
  );
  assert.deepEqual(o.crushed.map((p) => p.type), ['pawn']);
  const loaded = cast(s, 'avalanche', 'd3');
  assert.deepEqual(sqs(abilityLegalMoves(loaded, 'avalanche')).includes('d4'), true);
  assert.ok(abilityPreviewFor(loaded)!.arrows.length >= 4, 'every slide is drawn before the tap');
  const after = applyAbilityTargeted(loaded, 'avalanche', fromSquare('d4'));
  assert.deepEqual(sqs(after.hazards), ['c5', 'd4', 'd5', 'f4']);
  assert.equal(after.pieces.length, 2);
  assert.equal(after.kingStunTurns, 1);
  assert.equal(after.turn, 'rookie');
  // T3 crushes the knight as well.
  const t3 = avalancheOutcome({ ...s, abilities: [{ id: 'avalanche', tier: 3, mutations: [], usesLeftThisLevel: 2 }] }, 'N')!;
  assert.deepEqual(t3.crushed.map((p) => p.type).sort(), ['knight', 'pawn']);
});

test('avalanche: respects `fixed`, never moves a stone onto the king, and T4 slides two', () => {
  const s = board({
    rookie: 'a1',
    enemies: [E('e5', 'king')],
    hazards: [STONE('e4'), STONE('c4', true), STONE('g4')],
    kit: [['avalanche', 1]],
  });
  const o = avalancheOutcome(s, 'N')!;
  assert.deepEqual(o.slides.map((m) => `${toSquare(m.from)}>${toSquare(m.to)}`), ['g4>g5']);
  assert.ok(o.hazards.some((h) => h.file === 3 && h.rank === 4 && h.fixed), 'the fixed stone is untouched');
  assert.ok(o.hazards.some((h) => h.file === 5 && h.rank === 4), 'the stone under the king stayed');
  assert.deepEqual(sqs(abilityLegalMoves(applyAbilityActivate(s, 'avalanche'), 'avalanche')), ['e4', 'g4']);
  const t4 = avalancheOutcome({ ...s, abilities: [{ id: 'avalanche', tier: 4, mutations: [], usesLeftThisLevel: 2 }] }, 'N')!;
  assert.deepEqual(t4.slides.map((m) => `${toSquare(m.from)}>${toSquare(m.to)}`), ['g4>g6']);
});

// ---------------------------------------------------------------------------
// Rewind carries the new state
// ---------------------------------------------------------------------------

test('rewind: the snapshot carries the echo, moved stones and the pen; a Ricochet armed since stays armed', () => {
  const echo: AllyPiece = { id: 9, type: 'rook', source: 'mirror', ...fromSquare('g2'), echoMovesLeft: 2 };
  const s = board({
    rookie: 'b2',
    enemies: [E('h8', 'king'), E('d7', 'pawn')],
    hazards: [STONE('b6'), STONE('e5')],
    kit: [['rewind', 1], ['ricochet', 1]],
    allies: [echo],
  });
  const snapped = pushEnemyPhaseSnapshot({ ...s, turn: 'enemy' });
  const snap = snapped.enemyRewindStack![0];
  assert.deepEqual(snap.allies, [echo]);
  assert.deepEqual(sqs(snap.hazards), ['b6', 'e5']);
  // Enemy phase over, her turn again: she arms Ricochet, then rewinds.
  const myTurn: BoardState = { ...snapped, turn: 'rookie' };
  assert.ok(canRewind(myTurn));
  const armed = applyAbilityActivate(myTurn, 'ricochet');
  assert.equal(armed.ricochetBanks, 1);
  const rewound = applyAbilityActivate(armed, 'rewind');
  assert.equal(rewound.ricochetBanks, 1);
  assert.deepEqual(rewound.allies, [echo]);
});
