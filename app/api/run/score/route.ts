import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidDate } from '@/lib/run/daily';
import { ENDLESS_RUN_ID } from '@/lib/run/endless';
import {
  isBetterResult, isMissingScoreColumn, isMissingStatsColumn, NO_STATS, parseRunScore, parseRunStats,
  statsColumnsForWrite, STATS_COLUMNS, type RunStats,
} from '@/lib/run/score-rules';

/**
 * POST /api/run/score
 * Body: { playerId, handle, runDate, runId, difficulty, levelsCleared, totalLevels, captures, completed, score? }
 * Upserts the player's best for (player, date, run) — never lowers a score.
 * Silent no-op ({ recorded:false }) when Supabase / the table isn't there.
 *
 * `score` (2026-09-21) is the run's points, exactly as the summary screen shows
 * them. Optional: old builds don't send it. "Better" = higher score when both
 * the stored row and this result have one; otherwise levels, then captures
 * (lib/run/score-rules isBetterResult). Endless ignores score — it ranks by
 * depth. Replay-safe for the offline outbox: an equal or worse replay only
 * refreshes the handle.
 *
 * Works before the `run_scores.score` column exists (migration
 * 2026-09-21-run-scores-score.sql): an unknown-column error on the read or the
 * write retries once without `score`, so no run is lost.
 *
 * Run stats (2026-09-21, the Ranks run card): optional { stars, moves,
 * parMoves, timeMs, retries } — the values the run summary showed. Validated
 * like score (non-negative ints, capped; stars 0..3; bad -> 400). They are
 * written ONLY in the same upsert that writes `score`, all five at once (value
 * or NULL), so the stored stats always belong to the stored score's run
 * (lib/run/score-rules statsColumnsForWrite). A non-improving replay touches
 * only the handle. Before migration 2026-09-21-run-scores-stats.sql the write
 * retries without the stats columns (and then without score, if that's
 * missing too).
 */
const HANDLE_RE = /^[a-zA-Z0-9_.-]{2,16}$/;

type Existing = { levels_cleared: number; captures: number; score?: number | null };

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const playerId = String(body.playerId ?? '');
  const handle = String(body.handle ?? '');
  const runDate = String(body.runDate ?? '');
  const runId = String(body.runId ?? '');
  const difficulty = String(body.difficulty ?? 'normal');
  const levelsCleared = Number(body.levelsCleared);
  const totalLevels = Number(body.totalLevels);
  const captures = Number(body.captures ?? 0);
  const completed = Boolean(body.completed);
  const parsedScore = parseRunScore(body.score);
  const parsedStats = parseRunStats(body);

  if (
    !playerId || playerId.length > 64 || !HANDLE_RE.test(handle) || !isValidDate(runDate) || !runId ||
    !Number.isInteger(levelsCleared) || levelsCleared < 0 || !Number.isInteger(totalLevels) || totalLevels <= 0 ||
    !Number.isInteger(captures) || captures < 0 || levelsCleared > totalLevels ||
    parsedScore === 'invalid' || parsedStats === 'invalid'
  ) {
    return NextResponse.json({ error: 'bad fields' }, { status: 400 });
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ recorded: false, reason: 'no-supabase' });
  }
  // Endless ranks by depth; a score there would only confuse "better".
  const score = runId === ENDLESS_RUN_ID ? null : (parsedScore as number | null);
  // Endless shows no run card; its stats would describe nothing on the board.
  const stats = runId === ENDLESS_RUN_ID ? NO_STATS : (parsedStats as RunStats);

  const supabase = await createClient();
  // Does the table have `score` yet? Assume yes; learn otherwise from the read.
  let hasScoreColumn = true;
  const readExisting = async (withScore: boolean) =>
    supabase
      .from('run_scores')
      .select(withScore ? 'levels_cleared, captures, score' : 'levels_cleared, captures')
      .eq('player_id', playerId).eq('run_date', runDate).eq('run_id', runId)
      .maybeSingle<Existing>();
  let read = await readExisting(true);
  if (read.error && isMissingScoreColumn(read.error)) {
    hasScoreColumn = false;
    read = await readExisting(false);
  }
  const existing = read.data;

  if (existing) {
    const better = isBetterResult(
      { levels: levelsCleared, captures, score: hasScoreColumn ? score : null },
      { levels: existing.levels_cleared, captures: existing.captures, score: hasScoreColumn ? existing.score ?? null : null },
    );
    if (!better) {
      // Still let a handle rename through.
      await supabase.from('run_scores').update({ handle, updated_at: new Date().toISOString() })
        .eq('player_id', playerId).eq('run_date', runDate).eq('run_id', runId);
      return NextResponse.json({ recorded: true, improved: false });
    }
  }

  const row: Record<string, unknown> = {
    player_id: playerId, handle, run_date: runDate, run_id: runId, difficulty,
    levels_cleared: levelsCleared, total_levels: totalLevels, captures, completed,
    updated_at: new Date().toISOString(),
  };
  // Only write `score` when we have one: leaving it out of the upsert keeps
  // whatever is stored, so an old build can never null (lower) a stored score.
  // The stats ride with the score and only with it (statsColumnsForWrite).
  if (hasScoreColumn && score !== null) row.score = score;
  Object.assign(row, statsColumnsForWrite(stats, 'score' in row));
  const upsert = (r: Record<string, unknown>) =>
    supabase.from('run_scores').upsert(r, { onConflict: 'player_id,run_date,run_id' });

  let { error } = await upsert(row);
  if (error && STATS_COLUMNS.some((c) => c in row) && isMissingStatsColumn(error)) {
    // Stats migration pending — keep the run and its score, drop the card.
    for (const c of STATS_COLUMNS) delete row[c];
    ({ error } = await upsert(row));
  }
  if (error && 'score' in row && isMissingScoreColumn(error)) {
    // Score column not there yet (migration pending) — keep the run, drop the
    // points and (with them) any stats, which must never outlive their score.
    delete row.score;
    for (const c of STATS_COLUMNS) delete row[c];
    ({ error } = await upsert(row));
  }
  if (error) {
    console.error('run_scores upsert failed', error.message);
    return NextResponse.json({ recorded: false, reason: 'write-failed' });
  }
  return NextResponse.json({ recorded: true, improved: true, scored: 'score' in row, withStats: 'moves' in row });
}
