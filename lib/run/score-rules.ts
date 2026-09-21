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
