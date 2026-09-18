/**
 * What the offline app is allowed to do with each API route.
 *
 * Two deliberately-short allowlists. Everything not named here simply fails
 * when there's no network, which is the correct and safe default — the danger
 * is a route that gets replayed when it shouldn't be, not one that doesn't.
 */

/**
 * Writes that are safe to send LATER, possibly much later, possibly twice.
 *
 * Every entry has to be genuinely replay-safe:
 *   /api/run/complete   upsert on (user_id, run_date) — this is the streak
 *   /api/run/score      upsert on (player, date, run); never lowers a score
 *
 * NOT here, on purpose: /api/run-trace and /api/playtest-feedback. They are
 * diagnostics, not something the player earned — offline they just drop.
 */
const QUEUEABLE_WRITES: RegExp[] = [
  /^\/api\/run\/(complete|score)$/,
];

/**
 * Reads worth keeping a last-known-good copy of, so the home screen shows your
 * real streak and the last leaderboard underground instead of blanks.
 *
 * The cache is only ever consulted when the request FAILS. Online, the server
 * answers and the cache is refreshed — it never shadows a live response, so it
 * can't become a second source of truth.
 */
const CACHEABLE_READS: RegExp[] = [
  /^\/api\/run\/streak$/,
  /^\/api\/run\/leaderboard$/,
];

export function isQueueableWrite(pathname: string, method: string): boolean {
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return false;
  return QUEUEABLE_WRITES.some((re) => re.test(pathname));
}

export function isCacheableRead(pathname: string, method: string): boolean {
  if (method !== 'GET') return false;
  return CACHEABLE_READS.some((re) => re.test(pathname));
}
