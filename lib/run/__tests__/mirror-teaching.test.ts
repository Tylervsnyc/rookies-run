/**
 * Mirror's teaching layer (2026-09-19): the board previews where the echo
 * lands for each of her moves (`mirrorEchoMoves`) and says why a cast is
 * refused (`mirrorRefusal` / `cardStatusFor`). The preview must agree with
 * what `applyRookieMove` actually does — one source of truth.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applyAbilityActivate, applyAbilityTargeted, cardStatusFor, mirrorEchoMoves, mirrorEchoOf, mirrorRefusal, mirrorTargets } from '../abilities';
import { applyRookieMove } from '../engine';
import { puzzleToBoardState } from '../seed';
import { fromSquare, toSquare } from '../types';
import type { AbilityId, AbilityTier } from '../abilities';
import type { AllyPiece, BoardState, EnemyPiece, Hazard } from '../types';

const E = (sq: string, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', ...fromSquare(sq) });
const STONE = (sq: string): Hazard => ({ ...fromSquare(sq), kind: 'stone', fixed: true });
const ECHO = (sq: string, left = 3): AllyPiece => ({ id: 9, type: 'rook', source: 'mirror', ...fromSquare(sq), echoMovesLeft: left });

function board(opts: { rookie: string; enemies: EnemyPiece[]; hazards?: Hazard[]; kit: [AbilityId, AbilityTier][]; allies?: AllyPiece[] }): BoardState {
  const start = puzzleToBoardState(
    { level: 5, rookieStart: fromSquare(opts.rookie), pieces: opts.enemies, hazards: opts.hazards ?? [], winCondition: 'king', kingBehavior: 'flee' },
    { aiRngSeed: 3 },
  );
  return {
    ...start,
    rookie: fromSquare(opts.rookie),
    allies: opts.allies ?? [],
    abilities: opts.kit.map(([id, tier]) => ({ id, tier, usesLeftThisLevel: 1 })) as BoardState['abilities'],
  };
}

const byDest = (s: BoardState, sq: string) => mirrorEchoMoves(s).find((m) => toSquare(m.dest) === sq);

test('mirrorEchoMoves: names the king capture, a piece capture, a plain slide and a blocked echo', () => {
  // The Looking Glass L3 in miniature: her on g3, echo on b3, king up the b-file, b2 corked.
  const s = board({
    rookie: 'g3',
    enemies: [E('b7', 'king'), E('a3', 'pawn')],
    hazards: [STONE('b2')],
    kit: [['mirror', 1]],
    allies: [ECHO('b3')],
  });
  const up = byDest(s, 'g7')!;
  assert.equal(toSquare(up.land!), 'b7');
  assert.equal(up.victim, 'king');
  assert.equal(toSquare(up.from), 'b3');
  // She goes right (h3) -> the echo goes left and takes the pawn on a3.
  const right = byDest(s, 'h3')!;
  assert.equal(toSquare(right.land!), 'a3');
  assert.equal(right.victim, 'piece');
  // She goes down (g2) -> the echo is corked by the stone on b2: it stays.
  const down = byDest(s, 'g2')!;
  assert.equal(down.land, null);
  assert.equal(down.victim, null);
  // A short step up is a plain slide.
  const step = byDest(s, 'g4')!;
  assert.equal(toSquare(step.land!), 'b4');
  assert.equal(step.victim, null);
});

test('mirrorEchoMoves: every preview matches what the engine then does', () => {
  const s = board({
    rookie: 'g3',
    enemies: [E('b7', 'king'), E('a3', 'pawn'), E('b5', 'pawn')],
    hazards: [STONE('b2')],
    kit: [['mirror', 1]],
    allies: [ECHO('b3')],
  });
  const moves = mirrorEchoMoves(s);
  assert.ok(moves.length > 0);
  for (const m of moves) {
    const after = applyRookieMove(s, m.dest);
    const echo = mirrorEchoOf(after);
    const where = m.land ?? m.from;
    if (echo) assert.equal(toSquare(echo), toSquare(where), `echo after ${toSquare(m.dest)}`);
    if (m.victim === 'king') assert.equal(after.status, 'won');
    if (m.victim === 'piece') {
      assert.ok(!after.pieces.some((p) => p.file === m.land!.file && p.rank === m.land!.rank && p.type !== 'king'), `victim gone after ${toSquare(m.dest)}`);
    }
  }
  // With the pawn on b5 in the way, g7 no longer reaches the king.
  assert.equal(byDest(s, 'g7')!.victim, 'piece');
});

test('mirrorEchoMoves: empty with no echo; mirrorRefusal speaks only when the mirror square has no room', () => {
  const blocked = board({ rookie: 'g2', enemies: [E('b7', 'king')], hazards: [STONE('b2')], kit: [['mirror', 1]] });
  assert.deepEqual(mirrorEchoMoves(blocked), []);
  assert.equal(toSquare(mirrorRefusal(blocked)!.square), 'b2');
  assert.deepEqual(cardStatusFor(blocked), { label: 'Mirror', text: 'No room for a reflection there.' });
  const open = { ...blocked, rookie: fromSquare('g3') };
  assert.equal(mirrorRefusal(open), null);
  const spent = { ...blocked, abilities: blocked.abilities.map((a) => ({ ...a, usesLeftThisLevel: 0 })) };
  assert.equal(mirrorRefusal(spent), null);
  const echoUp = { ...open, allies: [ECHO('b3', 2)] };
  assert.equal(cardStatusFor(echoUp)?.label, 'Reflection · 2 moves');
});

test('Mirror self-lock: a cast whose echo would leave her no legal move is refused, with its own reason', () => {
  // The Reflecting Pool repro: her on d1, stone on d2, a Boulder on c1. The
  // echo would be born on e1 — her last open neighbour.
  const locked = board({
    rookie: 'd1',
    enemies: [E('h8', 'king')],
    hazards: [STONE('d2'), { ...fromSquare('c1'), kind: 'stone' }],
    kit: [['mirror', 1]],
  });
  assert.deepEqual(mirrorTargets(locked), []);
  assert.equal(mirrorRefusal(locked)!.text, 'A reflection there would box you in.');
  assert.equal(toSquare(mirrorRefusal(locked)!.square), 'e1');
  assert.equal(cardStatusFor(locked)!.text, 'A reflection there would box you in.');
  // Forcing the cast is a no-op: no echo, the charge is kept.
  assert.equal(applyAbilityActivate(locked, 'mirror').activeAbility, null);
  const forced = applyAbilityTargeted(locked, 'mirror', fromSquare('e1'));
  assert.equal(mirrorEchoOf(forced), null);
  assert.equal(forced.abilities[0].usesLeftThisLevel, 1);
  // Without the Boulder she keeps c1, so the same cast is allowed.
  const free = board({ rookie: 'd1', enemies: [E('h8', 'king')], hazards: [STONE('d2')], kit: [['mirror', 1]] });
  assert.deepEqual(mirrorTargets(free).map(toSquare), ['e1']);
  assert.equal(mirrorRefusal(free), null);
});
