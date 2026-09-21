/**
 * The Ranks run card's stats (lib/run/score-rules, 2026-09-21): validation of
 * the optional { stars, moves, parMoves, timeMs, retries } fields, and the
 * rule that they only ever move TOGETHER with the score — the stored stats
 * always describe the run whose score is stored, never a mix of two runs.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  isBetterResult, isMissingScoreColumn, isMissingStatsColumn, MAX_RUN_MOVES, MAX_RUN_TIME_MS, NO_STATS,
  parseRunStats, statsColumnsForWrite, type RunStats,
} from '../score-rules';

test('parseRunStats: all optional', () => {
  assert.deepEqual(parseRunStats({}), NO_STATS);
  assert.deepEqual(parseRunStats({ stars: null, moves: null }), NO_STATS);
});

test('parseRunStats: non-negative ints, capped; stars 0..3', () => {
  assert.deepEqual(parseRunStats({ stars: 3, moves: 38, parMoves: 40, timeMs: 192_000, retries: 0 }),
    { stars: 3, moves: 38, parMoves: 40, timeMs: 192_000, retries: 0 });
  assert.deepEqual(parseRunStats({ stars: 0, moves: 0, parMoves: 0, timeMs: 0, retries: 0 }),
    { stars: 0, moves: 0, parMoves: 0, timeMs: 0, retries: 0 });
  const capped = parseRunStats({ moves: MAX_RUN_MOVES + 1, timeMs: MAX_RUN_TIME_MS * 3 });
  assert.notEqual(capped, 'invalid');
  assert.equal((capped as RunStats).moves, MAX_RUN_MOVES);
  assert.equal((capped as RunStats).timeMs, MAX_RUN_TIME_MS);
});

test('parseRunStats: any bad field -> invalid', () => {
  for (const bad of [
    { stars: 4 }, { stars: -1 }, { stars: 2.5 }, { stars: '3' },
    { moves: -1 }, { moves: 1.5 }, { moves: '38' }, { parMoves: NaN },
    { timeMs: Infinity }, { timeMs: -5 }, { retries: true }, { retries: {} },
  ]) {
    assert.equal(parseRunStats(bad), 'invalid', `expected invalid for ${JSON.stringify(bad)}`);
  }
});

test('statsColumnsForWrite: all five with the score (explicit nulls), nothing without it', () => {
  const s: RunStats = { stars: 2, moves: 44, parMoves: 40, timeMs: 200_000, retries: 0 };
  assert.deepEqual(statsColumnsForWrite(s, true), { stars: 2, moves: 44, par_moves: 40, time_ms: 200_000, retries: 0 });
  // A scored run with no stats clears the old run's card instead of inheriting it.
  assert.deepEqual(statsColumnsForWrite(NO_STATS, true), { stars: null, moves: null, par_moves: null, time_ms: null, retries: null });
  assert.deepEqual(statsColumnsForWrite(s, false), {});
});

/**
 * A tiny model of /api/run/score's write path: read existing -> isBetterResult
 * -> upsert (score only when present, stats via statsColumnsForWrite) or only
 * touch the handle. Whatever order the submissions (and outbox replays) arrive
 * in, the stored stats must be the stats of the run whose score is stored.
 */
type Sub = { id: string; levels: number; captures: number; score: number | null; stats: RunStats };
type Row = { levels_cleared: number; captures: number; score: number | null; statsOf: string | null; cols: Record<string, number | null> };

function submit(stored: Row | null, sub: Sub): Row {
  if (stored && !isBetterResult(
    { levels: sub.levels, captures: sub.captures, score: sub.score },
    { levels: stored.levels_cleared, captures: stored.captures, score: stored.score },
  )) return stored;
  const scoreWritten = sub.score !== null;
  const statsCols = statsColumnsForWrite(sub.stats, scoreWritten);
  return {
    levels_cleared: sub.levels,
    captures: sub.captures,
    score: scoreWritten ? sub.score : stored?.score ?? null,
    statsOf: scoreWritten ? sub.id : stored?.statsOf ?? null,
    cols: scoreWritten ? statsCols : stored?.cols ?? {},
  };
}

const A: Sub = { id: 'A', levels: 7, captures: 3, score: 1240, stats: { stars: 0, moves: 30, parMoves: 40, timeMs: 150_000, retries: 1 } };
const B: Sub = { id: 'B', levels: 10, captures: 6, score: 2100, stats: { stars: 3, moves: 38, parMoves: 40, timeMs: 192_000, retries: 0 } };
const C_WORSE: Sub = { id: 'C', levels: 10, captures: 9, score: 1900, stats: { stars: 2, moves: 50, parMoves: 40, timeMs: 400_000, retries: 0 } };
const D_NOSTATS: Sub = { id: 'D', levels: 10, captures: 7, score: 2500, stats: NO_STATS };

test('stats move with the score: better run replaces both, worse run touches neither', () => {
  let row = submit(null, A);
  assert.equal(row.statsOf, 'A');
  assert.equal(row.cols.moves, 30);
  row = submit(row, B);
  assert.equal(row.score, 2100);
  assert.equal(row.statsOf, 'B');
  assert.deepEqual(row.cols, { stars: 3, moves: 38, par_moves: 40, time_ms: 192_000, retries: 0 });
  // More captures but a lower score: not better -> B's score AND B's stats stay.
  row = submit(row, C_WORSE);
  assert.equal(row.score, 2100);
  assert.equal(row.cols.moves, 38);
});

test('stats move with the score: replays (any order) are no-ops', () => {
  let row = submit(submit(null, A), B);
  const before = JSON.stringify(row);
  row = submit(row, B); // same run replayed from the offline outbox
  row = submit(row, A); // a stale, lower run arriving late
  assert.equal(JSON.stringify(row), before);
});

test('stats move with the score: a better scored run WITHOUT stats nulls the old card', () => {
  const row = submit(submit(null, B), D_NOSTATS);
  assert.equal(row.score, 2500);
  assert.equal(row.statsOf, 'D');
  assert.deepEqual(row.cols, { stars: null, moves: null, par_moves: null, time_ms: null, retries: null });
});

test('stats move with the score: an unscored (old build) win keeps score and stats together', () => {
  const old: Sub = { id: 'OLD', levels: 10, captures: 1, score: null, stats: NO_STATS };
  const row = submit(submit(null, A), old); // more levels -> better by the fallback rule
  // The score column isn't touched, so neither is the card: both still A's.
  assert.equal(row.score, 1240);
  assert.equal(row.statsOf, 'A');
  assert.equal(row.cols.moves, 30);
});

test('isMissingStatsColumn: each stats column, read + write shapes; nothing else', () => {
  assert.equal(isMissingStatsColumn({ code: '42703', message: 'column run_scores.stars does not exist' }), true);
  assert.equal(isMissingStatsColumn({ code: '42703', message: 'column run_scores.par_moves does not exist' }), true);
  assert.equal(isMissingStatsColumn({ code: 'PGRST204', message: "Could not find the 'time_ms' column of 'run_scores' in the schema cache" }), true);
  assert.equal(isMissingStatsColumn({ code: 'PGRST204', message: "Could not find the 'retries' column of 'run_scores' in the schema cache" }), true);
  // The score column is its own tier.
  assert.equal(isMissingStatsColumn({ code: '42703', message: 'column run_scores.score does not exist' }), false);
  assert.equal(isMissingScoreColumn({ code: '42703', message: 'column run_scores.moves does not exist' }), false);
  assert.equal(isMissingStatsColumn({ code: '42P01', message: 'relation "public.run_scores" does not exist' }), false);
  assert.equal(isMissingStatsColumn({ code: '23514', message: 'new row violates check constraint "run_scores_moves_check"' }), false);
  assert.equal(isMissingStatsColumn(null), false);
});
