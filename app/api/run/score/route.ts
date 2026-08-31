import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidDate } from '@/lib/run/daily';

/**
 * POST /api/run/score
 * Body: { playerId, handle, runDate, runId, difficulty, levelsCleared, totalLevels, captures, completed }
 * Upserts the player's best for (player, date, run) — never lowers a score.
 * Silent no-op ({ recorded:false }) when Supabase / the table isn't there.
 */
const HANDLE_RE = /^[a-zA-Z0-9_.-]{2,16}$/;

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

  if (
    !playerId || playerId.length > 64 || !HANDLE_RE.test(handle) || !isValidDate(runDate) || !runId ||
    !Number.isInteger(levelsCleared) || levelsCleared < 0 || !Number.isInteger(totalLevels) || totalLevels <= 0 ||
    !Number.isInteger(captures) || captures < 0 || levelsCleared > totalLevels
  ) {
    return NextResponse.json({ error: 'bad fields' }, { status: 400 });
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ recorded: false, reason: 'no-supabase' });
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('run_scores')
    .select('levels_cleared, captures')
    .eq('player_id', playerId).eq('run_date', runDate).eq('run_id', runId)
    .maybeSingle();

  if (existing) {
    const better =
      levelsCleared > existing.levels_cleared ||
      (levelsCleared === existing.levels_cleared && captures > existing.captures);
    if (!better) {
      // Still let a handle rename through.
      await supabase.from('run_scores').update({ handle, updated_at: new Date().toISOString() })
        .eq('player_id', playerId).eq('run_date', runDate).eq('run_id', runId);
      return NextResponse.json({ recorded: true, improved: false });
    }
  }

  const { error } = await supabase.from('run_scores').upsert(
    {
      player_id: playerId, handle, run_date: runDate, run_id: runId, difficulty,
      levels_cleared: levelsCleared, total_levels: totalLevels, captures, completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'player_id,run_date,run_id' },
  );
  if (error) {
    console.error('run_scores upsert failed', error.message);
    return NextResponse.json({ recorded: false, reason: 'write-failed' });
  }
  return NextResponse.json({ recorded: true, improved: true });
}
