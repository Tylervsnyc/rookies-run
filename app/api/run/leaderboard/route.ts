import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidDate } from '@/lib/run/daily';

/**
 * GET /api/run/leaderboard?date=YYYY-MM-DD&run=revenge-1&player=<id>
 * Today's global board from `run_scores` (public-read). Returns the top 5,
 * the caller's own row + rank (if any), and how many are hunting / finished.
 * Degrades to an empty board if Supabase isn't configured or the table
 * doesn't exist yet — the landing must never break on this.
 */
export interface LeaderboardRow {
  rank: number;
  handle: string;
  levels: number;
  captures: number;
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
  const { data, error } = await supabase
    .from('run_scores')
    .select('player_id, handle, levels_cleared, captures, completed')
    .eq('run_date', date)
    .eq('run_id', runId)
    .order('levels_cleared', { ascending: false })
    .order('captures', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(500);

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
