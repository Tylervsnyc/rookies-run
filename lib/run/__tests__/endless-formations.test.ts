/**
 * Endless formations (lib/run/endless-formations.ts) — the fairness contract.
 *
 *   npm test
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  FORMATION_FROM,
  FORMATION_IDS,
  applyFormation,
  formationBlueprint,
  formationForDepth,
  formationIntensityAt,
  isSignatureDepth,
  placeFairly,
  rookPathToKing,
} from '../endless-formations';
import { applyEndlessRamp, buildEndlessSession, effectiveMoveLimitAt, endlessLevelAt, endlessLevelPool } from '../endless';
import { puzzleForDate } from '../seed';
import { fromSquare } from '../types';
import type { RunPuzzle } from '../types';

const ISO = '2026-08-18';
const SEEDS = [1, 777, 12345, 99999, 2026];
const DEPTHS = Array.from({ length: 26 }, (_, i) => FORMATION_FROM + i); // 15..40

function levelAt(seed: number, depth: number): { base: RunPuzzle; ramped: RunPuzzle } {
  const session = buildEndlessSession(seed);
  const ref = endlessLevelAt(session, depth - 1);
  const base = puzzleForDate(ISO, ref.levelIndex, ref.runId);
  return { base, ramped: applyEndlessRamp(base, depth, seed) };
}

test('every level in the endless pool has a plain-rook path to the king inside its move limit', () => {
  for (const ref of endlessLevelPool()) {
    const p = puzzleForDate(ISO, ref.levelIndex, ref.runId);
    const d = rookPathToKing(p);
    assert.ok(d !== null, `${ref.runId} L${ref.levelIndex + 1}: no rook path`);
    if (typeof p.moveLimit === 'number') assert.ok(d <= p.moveLimit, `${ref.runId} L${ref.levelIndex + 1}: path ${d} > limit ${p.moveLimit}`);
  }
});

test('king always present and reachable after the full ramp, within the effective move budget', () => {
  for (const seed of SEEDS) {
    for (const depth of DEPTHS) {
      const { base, ramped } = levelAt(seed, depth);
      const kings = ramped.pieces.filter((p) => p.type === 'king');
      assert.equal(kings.length, 1, `seed ${seed} d${depth}: expected exactly one king`);
      const d = rookPathToKing(ramped);
      assert.ok(d !== null, `seed ${seed} d${depth}: king sealed`);
      const budget = effectiveMoveLimitAt(base, depth);
      if (budget !== undefined) assert.ok(d <= Math.max(budget, rookPathToKing(base)!), `seed ${seed} d${depth}: path ${d} > budget ${budget}`);
    }
  }
});

test('formation applies from L15 on and never below', () => {
  for (const seed of SEEDS) {
    for (let depth = 1; depth < FORMATION_FROM; depth++) {
      assert.equal(formationForDepth(seed, depth), null, `seed ${seed} d${depth} should carry no formation`);
      const { base, ramped } = levelAt(seed, depth);
      // Below L15 the ramp is exactly what it was: formation-off and formation-on agree.
      assert.deepEqual(ramped, applyEndlessRamp(base, depth, seed, { formations: false }));
    }
    for (const depth of DEPTHS) {
      const pick = formationForDepth(seed, depth);
      assert.ok(pick, `seed ${seed} d${depth} should carry a formation`);
      assert.ok((FORMATION_IDS as readonly string[]).includes(pick.id));
      const { base, ramped } = levelAt(seed, depth);
      const off = applyEndlessRamp(base, depth, seed, { formations: false });
      const grew = ramped.pieces.length + (ramped.hazards?.length ?? 0) - (off.pieces.length + (off.hazards?.length ?? 0));
      // Reinforcements are identical in count both ways, so any growth is the formation.
      assert.ok(grew >= 0, `seed ${seed} d${depth}: formation removed material`);
    }
  }
});

test('formation adds material on at least 9 of every 10 deep levels', () => {
  let withMaterial = 0;
  let total = 0;
  for (const seed of SEEDS) {
    for (const depth of DEPTHS) {
      const { base } = levelAt(seed, depth);
      const formed = applyFormation(base, depth, seed, { moveBudget: effectiveMoveLimitAt(base, depth) });
      total++;
      if (formed.pieces.length + (formed.hazards?.length ?? 0) > base.pieces.length + (base.hazards?.length ?? 0)) withMaterial++;
    }
  }
  assert.ok(withMaterial / total >= 0.9, `only ${withMaterial}/${total} deep levels got a formation`);
});

test('intensity is monotone non-decreasing in depth and 0 before L15', () => {
  let prev = 0;
  for (let depth = 1; depth <= 80; depth++) {
    const i = formationIntensityAt(depth);
    if (depth < FORMATION_FROM) assert.equal(i, 0);
    else assert.ok(i >= 1);
    assert.ok(i >= prev, `intensity dropped at d${depth}: ${prev} -> ${i}`);
    prev = i;
  }
  assert.equal(formationIntensityAt(FORMATION_FROM), 1);
  assert.ok(formationIntensityAt(60) > formationIntensityAt(FORMATION_FROM));
});

test('every 3rd level from L15 is a signature with a distinct secondary template', () => {
  for (const seed of SEEDS) {
    for (const depth of DEPTHS) {
      const pick = formationForDepth(seed, depth)!;
      assert.equal(pick.signature, isSignatureDepth(depth));
      assert.equal(isSignatureDepth(depth), (depth - FORMATION_FROM) % 3 === 0);
      if (pick.signature) {
        assert.ok(pick.secondary, 'signature needs a secondary');
        assert.notEqual(pick.secondary, pick.id);
        assert.ok(pick.intensity >= formationIntensityAt(depth));
      } else assert.equal(pick.secondary, undefined);
    }
  }
});

test('nothing on Rookie start rank, the rank ahead, the king pen, or next to the king', () => {
  for (const seed of SEEDS) {
    for (const depth of DEPTHS) {
      const { base, ramped } = levelAt(seed, depth);
      const startRank = base.rookieStart.rank;
      const ahead = startRank <= 4 ? startRank + 1 : startRank - 1;
      const king = ramped.pieces.find((p) => p.type === 'king')!;
      const pen = new Set((base.kingPen ?? []).map((s) => `${fromSquare(s).file},${fromSquare(s).rank}`));
      const authored = new Set(base.pieces.map((p) => `${p.file},${p.rank}`));
      const authoredHaz = new Set((base.hazards ?? []).map((h) => `${h.file},${h.rank}`));
      for (const p of ramped.pieces) {
        const k = `${p.file},${p.rank}`;
        if (authored.has(k)) continue;
        assert.notEqual(p.rank, startRank, `seed ${seed} d${depth}: piece on start rank`);
        assert.notEqual(p.rank, ahead, `seed ${seed} d${depth}: piece on the rank ahead of start`);
        assert.ok(!pen.has(k), `seed ${seed} d${depth}: piece in king pen`);
        assert.ok(Math.max(Math.abs(king.file - p.file), Math.abs(king.rank - p.rank)) > 1, `seed ${seed} d${depth}: piece adjacent to king`);
      }
      for (const h of ramped.hazards ?? []) {
        const k = `${h.file},${h.rank}`;
        if (authoredHaz.has(k)) continue;
        assert.notEqual(h.rank, startRank);
        assert.notEqual(h.rank, ahead);
        assert.ok(!pen.has(k));
      }
      // No two pieces share a square, and no piece stands on a hazard.
      const seen = new Set<string>();
      const haz = new Set((ramped.hazards ?? []).map((h) => `${h.file},${h.rank}`));
      for (const p of ramped.pieces) {
        const k = `${p.file},${p.rank}`;
        assert.ok(!seen.has(k), `seed ${seed} d${depth}: two pieces on ${k}`);
        // (revenge-11 L7 is AUTHORED with a pawn on a hazard square — only added pieces are held to this.)
        if (!authored.has(k)) assert.ok(!haz.has(k), `seed ${seed} d${depth}: piece on hazard ${k}`);
        seen.add(k);
      }
    }
  }
});

test('placeFairly skips a placement that would seal the king', () => {
  // King on h8 walled by stones g6/h6/f8; the only way in is along rank 7
  // through f7. A stone on f7 (two squares from him, so not caught by the
  // adjacency rule) would seal him — the path check must refuse it.
  const puzzle: RunPuzzle = {
    level: 1,
    rookieStart: fromSquare('a1'),
    pieces: [{ type: 'king', color: 'black', file: 8, rank: 8 }],
    hazards: [
      { file: 7, rank: 6, kind: 'stone' },
      { file: 8, rank: 6, kind: 'stone' },
      { file: 6, rank: 8, kind: 'stone' },
    ],
    winCondition: 'king',
  };
  assert.ok(rookPathToKing(puzzle) !== null);
  const sealed = placeFairly(puzzle, [{ file: 6, rank: 7, what: 'stone' }]);
  assert.equal(sealed.hazards?.length, 3, 'the sealing stone must be skipped');
  assert.equal(rookPathToKing({ ...puzzle, hazards: [...puzzle.hazards!, { file: 6, rank: 7 }] }), null, 'f7 really seals');
  const okay = placeFairly(puzzle, [{ file: 4, rank: 5, what: 'knight' }]);
  assert.equal(okay.pieces.length, 2);
});

test('same seed + depth is the same board (reload-safe)', () => {
  for (const seed of SEEDS) {
    for (const depth of [15, 21, 30]) {
      assert.deepEqual(levelAt(seed, depth).ramped, levelAt(seed, depth).ramped);
    }
  }
});

test('every template produces a non-empty blueprint at every intensity', () => {
  const { base } = levelAt(1, 15);
  for (const id of FORMATION_IDS) {
    for (let i = 1; i <= 5; i++) {
      const bp = formationBlueprint(id, base, i, () => 0.5);
      assert.ok(bp.length > 0, `${id}@${i} produced nothing`);
    }
    const lo = formationBlueprint(id, base, 1, () => 0.5).length;
    const hi = formationBlueprint(id, base, 5, () => 0.5).length;
    assert.ok(hi >= lo, `${id}: intensity 5 (${hi}) should place at least as much as intensity 1 (${lo})`);
  }
});
