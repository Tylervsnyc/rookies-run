/**
 * Unit test for `mergeProfiles` (lib/run/profile.ts). No test runner in this
 * repo, so: `npx tsx scripts/test-merge-profiles.ts` — exits non-zero on the
 * first failed assertion.
 */

import assert from 'node:assert/strict';
import { freshProfile, mergeProfiles, type PlayerProfile } from '../lib/run/profile';

function base(over: Partial<PlayerProfile>): PlayerProfile {
  return { ...freshProfile(new Date('2026-01-01T00:00:00Z')), ...over };
}

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

const local = base({
  createdAt: '2026-03-01T00:00:00Z',
  difficulty: 'hard',
  unlockedAbilities: ['knight-hop', 'surge'],
  achievements: {
    'first-blood': { unlockedAt: '2026-03-02T00:00:00Z', seen: true },
    'both-sides': { unlockedAt: '2026-03-05T00:00:00Z', seen: false },
  },
  counters: { captures: 10, runs: 2 },
  bestByDifficulty: { normal: { levels: 5, score: 900 } },
  bestStars: { normal: { 'revenge-12': 2 } },
  ladder: {
    'revenge-12': { cleared: true, bestLevels: 10, score: 1200, byDifficulty: { normal: { cleared: true, bestLevels: 10, score: 1200 } } },
  },
});

const remote = base({
  createdAt: '2026-02-01T00:00:00Z',
  difficulty: 'rookie',
  unlockedAbilities: ['knight-hop', 'freeze-ray'],
  achievements: {
    'first-blood': { unlockedAt: '2026-02-10T00:00:00Z', seen: false },
    'king-hunter': { unlockedAt: '2026-02-20T00:00:00Z', seen: true },
  },
  counters: { captures: 4, runs: 7, levels: 30 },
  bestByDifficulty: { normal: { levels: 5, score: 1100 }, hard: { levels: 3, score: 400 } },
  bestStars: { normal: { 'revenge-12': 3, 'revenge-13': 1 } },
  ladder: {
    'revenge-12': { cleared: false, bestLevels: 6, score: 700, byDifficulty: { hard: { cleared: false, bestLevels: 6, score: 700 } } },
    'revenge-13': { cleared: true, bestLevels: 10, score: 1500 },
  },
});

const merged = mergeProfiles(local, remote);

test('difficulty = local', () => assert.equal(merged.difficulty, 'hard'));
test('createdAt = earliest', () => assert.equal(merged.createdAt, '2026-02-01T00:00:00Z'));

test('abilities = union', () => {
  for (const id of ['knight-hop', 'surge', 'freeze-ray']) assert.ok(merged.unlockedAbilities.includes(id as never), id);
  assert.equal(new Set(merged.unlockedAbilities).size, merged.unlockedAbilities.length, 'no duplicates');
});

test('achievements = union, earliest unlockedAt, seen if either', () => {
  assert.deepEqual(merged.achievements['first-blood'], { unlockedAt: '2026-02-10T00:00:00Z', seen: true });
  assert.deepEqual(merged.achievements['both-sides'], { unlockedAt: '2026-03-05T00:00:00Z', seen: false });
  assert.deepEqual(merged.achievements['king-hunter'], { unlockedAt: '2026-02-20T00:00:00Z', seen: true });
});

test('counters = max per key', () => {
  assert.deepEqual(merged.counters, { captures: 10, runs: 7, levels: 30 });
});

test('bestByDifficulty = more levels, then higher score', () => {
  assert.deepEqual(merged.bestByDifficulty.normal, { levels: 5, score: 1100 });
  assert.deepEqual(merged.bestByDifficulty.hard, { levels: 3, score: 400 });
});

test('bestStars = max per difficulty per run', () => {
  assert.deepEqual(merged.bestStars, { normal: { 'revenge-12': 3, 'revenge-13': 1 } });
});

test('ladder = cleared never regresses, bests are maxes, per-difficulty merged', () => {
  const r12 = merged.ladder['revenge-12'];
  assert.equal(r12.cleared, true);
  assert.equal(r12.bestLevels, 10);
  assert.equal(r12.score, 1200);
  assert.deepEqual(r12.byDifficulty?.normal, { cleared: true, bestLevels: 10, score: 1200 });
  assert.deepEqual(r12.byDifficulty?.hard, { cleared: false, bestLevels: 6, score: 700 });
  assert.deepEqual(merged.ladder['revenge-13'], { cleared: true, bestLevels: 10, score: 1500 });
});

test('inputs are not mutated', () => {
  assert.deepEqual(local.unlockedAbilities, ['knight-hop', 'surge']);
  assert.deepEqual(remote.counters, { captures: 4, runs: 7, levels: 30 });
});

test('merge is idempotent', () => {
  const again = mergeProfiles(merged, merged);
  assert.deepEqual(again, merged);
});

test('merging with a fresh profile changes nothing but difficulty rule', () => {
  const fresh = freshProfile(new Date('2026-06-01T00:00:00Z'));
  const m = mergeProfiles(fresh, local);
  assert.equal(m.difficulty, fresh.difficulty);
  assert.deepEqual(m.counters, local.counters);
  assert.deepEqual(m.achievements, local.achievements);
});

console.log(`\n${passed} tests passed`);
