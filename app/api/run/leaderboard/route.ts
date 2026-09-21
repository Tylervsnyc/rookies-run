import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidDate } from '@/lib/run/daily';
import { ENDLESS_RUN_ID } from '@/lib/run/endless';
import { isMissingScoreColumn } from '@/lib/run/score-rules';

/**
 * GET /api/run/leaderboard?date=YYYY-MM-DD&run=revenge-1&player=<id>
 * Today's global board from `run_scores` (public-read). Returns the top 5,
 * the caller's own row + rank (if any), and how many are hunting / finished.
 * Degrades to an empty board if Supabase isn't configured or the table
 * doesn't exist yet — the landing must never break on this.
 *
 * Ranking (2026-09-21):
 *   TODAY (any daily runId): score desc NULLS LAST, then levels_cleared desc,
 *     captures desc, created_at asc. `score` = the run's points as the summary
 *     screen showed them; rows from old builds (no score) sink below every
 *     scored row and keep the old levels/captures order among themselves.
 *   ENDLESS (runId 'endless'): unchanged — depth (levels_cleared), then
 *     captures, then created_at.
 * Before migration 2026-09-21-run-scores-score.sql is applied the `score`
 * column doesn't exist; the read then falls back to the old query and every
 * row carries score: null.
 */
export interface LeaderboardRow {
  rank: number;
  handle: string;
  levels: number;
  captures: number;
  /** The run's points (daily board). null = old build / pre-migration row. */
  score: number | null;
  completed: boolean;
  me?: boolean;
}
export interface LeaderboardResponse {
  rows: LeaderboardRow[];
  me: LeaderboardRow | null;
  total: number;
  finished: number;
  available: boolean;
}

const EMPTY: LeaderboardResponse = { rows: [], me: null, total: 0, finished: 0, available: false };

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') ?? '';
  const runId = request.nextUrl.searchParams.get('run') ?? '';
  const player = request.nextUrl.searchParams.get('player') ?? '';
  if (!isValidDate(date) || !runId) {
    return NextResponse.json({ error: 'bad params' }, { status: 400 });
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(EMPTY);
  }

  const supabase = await createClient();
  const byScore = runId !== ENDLESS_RUN_ID;
  const readBoard = (withScore: boolean) => {
    let q = supabase
      .from('run_scores')
      .select(withScore ? 'player_id, handle, levels_cleared, captures, completed, score' : 'player_id, handle, levels_cleared, captures, completed')
      .eq('run_date', date)
      .eq('run_id', runId);
    if (withScore && byScore) q = q.order('score', { ascending: false, nullsFirst: false });
    return q
      .order('levels_cleared', { ascending: false })
      .order('captures', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(500)
      .returns<Array<{ player_id: string; handle: string; levels_cleared: number; captures: number; completed: boolean; score?: number | null }>>();
  };
  let { data, error } = await readBoard(true);
  if (error && isMissingScoreColumn(error)) {
    // Migration not applied yet — the old board, every score null.
    ({ data, error } = await readBoard(false));
  }

  if (error) {
    // Table missing / RLS — log once, degrade quietly.
    console.error('run_scores read failed', error.message);
    return NextResponse.json(EMPTY);
  }

  const all = (data ?? []).map((r, i) => ({
    rank: i + 1,
    handle: String(r.handle),
    levels: Number(r.levels_cleared),
    captures: Number(r.captures),
    score: r.score == null ? null : Number(r.score),
    completed: Boolean(r.completed),
    me: !!player && r.player_id === player,
  }));
  const me = all.find((r) => r.me) ?? null;
  const body: LeaderboardResponse = {
    rows: all.slice(0, 5),
    me,
    total: all.length,
    finished: all.filter((r) => r.completed).length,
    available: true,
  };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
}
