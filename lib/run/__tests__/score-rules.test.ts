/**
 * The daily leaderboard's SCORE rules (lib/run/score-rules, 2026-09-21):
 * validation of the optional `score` field, the "better" rule the score API
 * uses to decide whether a result replaces the stored row (it must never lower
 * a stored score, and an offline-outbox replay must be a no-op), and the
 * unknown-column detection that keeps the API working before the migration.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isBetterResult, isMissingScoreColumn, MAX_RUN_SCORE, parseRunScore } from '../score-rules';

test('parseRunScore: optional, non-negative integer, capped', () => {
  assert.equal(parseRunScore(undefined), null);
  assert.equal(parseRunScore(null), null);
  assert.equal(parseRunScore(0), 0);
  assert.equal(parseRunScore(1240), 1240);
  assert.equal(parseRunScore(MAX_RUN_SCORE + 5), MAX_RUN_SCORE);
  for (const bad of [-1, 1.5, NaN, Infinity, '1240', true, {}, []]) {
    assert.equal(parseRunScore(bad), 'invalid', `expected invalid for ${String(bad)}`);
  }
});

test('isBetterResult: both scored -> higher score wins, whatever the levels', () => {
  assert.equal(isBetterResult({ levels: 5, captures: 1, score: 1500 }, { levels: 7, captures: 9, score: 1400 }), true);
  assert.equal(isBetterResult({ levels: 10, captures: 20, score: 1300 }, { levels: 7, captures: 2, score: 1400 }), false);
});

test('isBetterResult: equal result is not better (outbox replay is a no-op)', () => {
  const r = { levels: 7, captures: 3, score: 1240 };
  assert.equal(isBetterResult({ ...r }, r), false);
  // A stale, lower replay arriving after a better run never lowers it.
  assert.equal(isBetterResult({ levels: 4, captures: 1, score: 900 }, r), false);
});

test('isBetterResult: falls back to levels then captures when either side has no score', () => {
  // Old build (no score) vs scored row.
  assert.equal(isBetterResult({ levels: 8, captures: 0, score: null }, { levels: 7, captures: 5, score: 1240 }), true);
  assert.equal(isBetterResult({ levels: 7, captures: 5, score: null }, { levels: 7, captures: 5, score: 1240 }), false);
  // Scored result vs old (pre-migration) row.
  assert.equal(isBetterResult({ levels: 6, captures: 9, score: 5000 }, { levels: 7, captures: 0, score: null }), false);
  assert.equal(isBetterResult({ levels: 7, captures: 4, score: 100 }, { levels: 7, captures: 3, score: null }), true);
  // Neither scored: the old rule exactly.
  assert.equal(isBetterResult({ levels: 7, captures: 3, score: null }, { levels: 7, captures: 3, score: null }), false);
  assert.equal(isBetterResult({ levels: 7, captures: 2, score: null }, { levels: 7, captures: 3, score: null }), false);
});

test('isBetterResult: an unscored row that ties on levels+captures takes the score', () => {
  assert.equal(isBetterResult({ levels: 7, captures: 3, score: 1240 }, { levels: 7, captures: 3, score: null }), true);
});

test('isMissingScoreColumn: recognises the read and write errors, nothing else', () => {
  assert.equal(isMissingScoreColumn({ code: '42703', message: 'column run_scores.score does not exist' }), true);
  assert.equal(isMissingScoreColumn({ code: 'PGRST204', message: "Could not find the 'score' column of 'run_scores' in the schema cache" }), true);
  assert.equal(isMissingScoreColumn({ code: '42P01', message: 'relation "public.run_scores" does not exist' }), false);
  assert.equal(isMissingScoreColumn({ code: '42501', message: 'new row violates row-level security policy for table "run_scores"' }), false);
  assert.equal(isMissingScoreColumn(null), false);
});
