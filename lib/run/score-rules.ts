/**
 * The daily leaderboard's rules for a run's SCORE (points) — the same number
 * the run-summary screen shows (app/page.tsx `scorePair.classic`). Pure, so the
 * API route and the tests share one definition (lib/run/__tests__/score-rules).
 *
 * `score` is optional everywhere: builds from before 2026-09-21 don't send it,
 * and rows written before `run_scores.score` existed hold NULL. When either
 * side of a comparison lacks a score, the old rule (levels, then captures)
 * decides.
 */

/** Sane ceiling. A perfect run today lands around 5,000; this leaves headroom. */
export const MAX_RUN_SCORE = 1_000_000;

/**
 * Parse the optional `score` field of a POST body.
 * - absent / null  -> null (old build; fine)
 * - non-negative integer -> the number, capped at MAX_RUN_SCORE
 * - anything else  -> 'invalid' (the route answers 400)
 */
export function parseRunScore(raw: unknown): number | null | 'invalid' {
  if (raw === undefined || raw === null) return null;
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0) return 'invalid';
  return Math.min(raw, MAX_RUN_SCORE);
}

export interface RunResult {
  levels: number;
  captures: number;
  score: number | null;
}

/**
 * Should `incoming` replace the stored `existing` row?
 * - Both scored: strictly higher score wins (equal = keep; replays are no-ops).
 * - Otherwise: more levels, then more captures.
 * - The one exception: a stored row with no score that ties on levels AND
 *   captures takes an incoming score, so an old row gains its points the
 *   first time the same result is replayed from a new build.
 */
export function isBetterResult(incoming: RunResult, existing: RunResult): boolean {
  if (incoming.score !== null && existing.score !== null) return incoming.score > existing.score;
  if (incoming.levels !== existing.levels) return incoming.levels > existing.levels;
  if (incoming.captures !== existing.captures) return incoming.captures > existing.captures;
  return incoming.score !== null && existing.score === null;
}

/**
 * True when a Supabase/PostgREST error means "run_scores has no `score` column"
 * (the migration hasn't been applied yet). Reads report Postgres 42703
 * (undefined_column, "column run_scores.score does not exist"); writes report
 * PGRST204 ("Could not find the 'score' column of 'run_scores' in the schema
 * cache").
 */
export function isMissingScoreColumn(err: { code?: string | null; message?: string | null } | null | undefined): boolean {
  if (!err) return false;
  const msg = String(err.message ?? '');
  // \b so the table name `run_scores` alone never matches.
  if (!/\bscore\b/.test(msg)) return false;
  return err.code === '42703' || err.code === 'PGRST204' || /column/i.test(msg);
}

// ── Run stats (2026-09-21) ──────────────────────────────────────────────────
// The Ranks run card: stars, moves, par, time, retries of the run the stored
// score came from — the same values the run-summary screen showed. All
// optional (older builds send none). They describe ONE run, so the API writes
// them only together with `score` (statsColumnsForWrite) and never on their own.

/** Sane ceilings. A daily run is ~10 levels of a few dozen moves. */
export const MAX_RUN_MOVES = 10_000;
/** 24 hours of active play. */
export const MAX_RUN_TIME_MS = 86_400_000;
export const MAX_RUN_RETRIES = 1_000;

export interface RunStats {
  stars: number | null;
  moves: number | null;
  parMoves: number | null;
  timeMs: number | null;
  retries: number | null;
}

export const NO_STATS: RunStats = { stars: null, moves: null, parMoves: null, timeMs: null, retries: null };

function parseCount(raw: unknown, cap: number): number | null | 'invalid' {
  if (raw === undefined || raw === null) return null;
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0) return 'invalid';
  return Math.min(raw, cap);
}

/**
 * Parse the optional stats fields of a POST body
 * ({ stars, moves, parMoves, timeMs, retries }).
 * - each absent / null -> null
 * - non-negative integers, capped (stars must be 0..3 — 4 is a bug, not a cap)
 * - anything else -> 'invalid' (the route answers 400, like a bad score)
 */
export function parseRunStats(body: Record<string, unknown>): RunStats | 'invalid' {
  const stars = body.stars === undefined || body.stars === null
    ? null
    : typeof body.stars === 'number' && Number.isInteger(body.stars) && body.stars >= 0 && body.stars <= 3
      ? body.stars
      : 'invalid';
  const moves = parseCount(body.moves, MAX_RUN_MOVES);
  const parMoves = parseCount(body.parMoves, MAX_RUN_MOVES);
  const timeMs = parseCount(body.timeMs, MAX_RUN_TIME_MS);
  const retries = parseCount(body.retries, MAX_RUN_RETRIES);
  if (stars === 'invalid' || moves === 'invalid' || parMoves === 'invalid' || timeMs === 'invalid' || retries === 'invalid') {
    return 'invalid';
  }
  return { stars, moves, parMoves, timeMs, retries };
}

/**
 * The stats columns to put in the upsert.
 * - The score is being written -> ALL five columns, each the value or NULL.
 *   Explicit NULLs matter: a winning run from a build that sends a score but
 *   no stats must clear the previous run's moves/time, never inherit them.
 * - The score is NOT being written (old build, or no score column yet) ->
 *   nothing, so the stored stats stay with the stored score they belong to.
 */
export function statsColumnsForWrite(stats: RunStats, scoreWritten: boolean): Record<string, number | null> {
  if (!scoreWritten) return {};
  return {
    stars: stats.stars,
    moves: stats.moves,
    par_moves: stats.parMoves,
    time_ms: stats.timeMs,
    retries: stats.retries,
  };
}

export const STATS_COLUMNS = ['stars', 'moves', 'par_moves', 'time_ms', 'retries'] as const;

/**
 * True when a Supabase/PostgREST error means one of the stats columns is
 * missing (migration 2026-09-21-run-scores-stats.sql not applied yet). Same
 * shapes as isMissingScoreColumn: 42703 on reads, PGRST204 on writes.
 */
export function isMissingStatsColumn(err: { code?: string | null; message?: string | null } | null | undefined): boolean {
  if (!err) return false;
  const msg = String(err.message ?? '');
  if (!STATS_COLUMNS.some((c) => new RegExp(`\\b${c}\\b`).test(msg))) return false;
  return err.code === '42703' || err.code === 'PGRST204' || /column/i.test(msg);
}
