'use client';

/**
 * Endless runs started today — the free tier's one-a-day limit (Rookie Pro).
 *
 * Truth depends on who is playing:
 *   - SIGNED IN: the server. Every Endless start inserts a row into
 *     `revenge_endless_plays` (docs/rookie-pro-sql.sql) under RLS, keyed by the
 *     player's LOCAL calendar date, and the count is read back from there — so
 *     reinstalling or clearing the browser does not reset it.
 *   - GUEST: localStorage only. It is a UX hint, not enforcement: a guest who
 *     hits the limit is asked to sign in, and from then on the server counts.
 *
 * Why not `run_scores`? It is keyed by an anonymous localStorage player id,
 * keeps ONE row per (player, date, 'endless'), and is written when a run
 * ENDS — it can't count starts, and it isn't tied to an account.
 *
 * Fails soft everywhere: if the table isn't there yet (SQL not run) the
 * signed-in count falls back to the local one, so a free player is never
 * locked out by a missing migration — at worst they get the local limit.
 */

import { createClient } from '@/lib/supabase/client';

const TABLE = 'revenge_endless_plays';
const LOCAL_KEY = 'rr-endless-plays';

/** The player's local calendar date, YYYY-MM-DD. */
export function localDay(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface LocalPlays {
  day: string;
  count: number;
}

export function readLocalEndlessCount(day: string = localDay()): number {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as LocalPlays;
    return parsed?.day === day && Number.isFinite(parsed.count) ? Math.max(0, parsed.count) : 0;
  } catch {
    return 0;
  }
}

function bumpLocal(day: string): number {
  const next = readLocalEndlessCount(day) + 1;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ day, count: next } satisfies LocalPlays));
  } catch {
    /* private mode — the hint just doesn't persist */
  }
  return next;
}

/** Server count for `userId` today, or null when it can't be read. */
export async function fetchServerEndlessCount(userId: string, day: string = localDay()): Promise<number | null> {
  try {
    const { count, error } = await createClient()
      .from(TABLE)
      .select('user_id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('play_date', day);
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

/**
 * Record one Endless start. Always bumps the local hint; for a signed-in
 * player also inserts the server row (best-effort, never blocks the run).
 * Returns the local count after the bump.
 */
export function recordEndlessStart(userId: string | null, seed: number, day: string = localDay()): number {
  const local = bumpLocal(day);
  if (userId) {
    void (async () => {
      try {
        const { error } = await createClient().from(TABLE).insert({ user_id: userId, play_date: day, seed });
        if (error) console.warn('[endless-quota] insert failed', error.message);
      } catch {
        /* offline — the local hint still counts it */
      }
    })();
  }
  return local;
}
