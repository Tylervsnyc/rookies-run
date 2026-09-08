'use client';

/**
 * Rookie's Revenge — cloud sync for the local player profile (plan 1.2).
 *
 * The profile stays local-first: every read is `readProfile()`, every write is
 * `writeProfile()`, exactly as before. This module adds two things ONLY when
 * the player is signed in AND `FEATURE_FLAGS.CLOUD_PROFILE` is on:
 *
 *   1. `pullAndMerge(userId)` on sign-in — read `revenge_profiles`, union it
 *      with what is in localStorage (`mergeProfiles`), write the result to
 *      BOTH sides. No remote row yet → the local profile is uploaded as-is.
 *   2. A debounced (~2s) push registered as the profile write hook, so play
 *      keeps writing localStorage synchronously and the cloud catches up
 *      after the burst of writes a level generates.
 *
 * Everything is best-effort and never blocks play: a failed pull leaves the
 * local profile untouched, a failed push is retried on the next write.
 * Anonymous players never touch this file's code paths.
 *
 * Writes go through supabase-js from the browser under RLS (owner-only
 * policies in 2026-09-08-revenge-profiles.sql) — no API route, no service
 * role.
 */

import { createClient } from '@/lib/supabase/client';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import {
  mergeProfiles,
  profilesEqual,
  readProfile,
  registerProfileWriteHook,
  replaceProfile,
  sanitizeProfile,
  type PlayerProfile,
} from './profile';

const TABLE = 'revenge_profiles';
const PUSH_DEBOUNCE_MS = 2000;

let activeUserId: string | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pending: PlayerProfile | null = null;
let inFlight: Promise<void> | null = null;

async function pushNow(userId: string, profile: PlayerProfile): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from(TABLE)
    .upsert({ user_id: userId, profile, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (error) console.warn('[profile-sync] push failed', error.message);
}

function schedulePush(profile: PlayerProfile): void {
  if (!activeUserId) return;
  pending = profile;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    const userId = activeUserId;
    const p = pending;
    pending = null;
    if (!userId || !p) return;
    // Serialize pushes so a slow one can't be overtaken by a stale one.
    inFlight = (inFlight ?? Promise.resolve()).then(() => pushNow(userId, p)).catch(() => {});
  }, PUSH_DEBOUNCE_MS);
}

/**
 * Pull the cloud copy for `userId`, merge with local, persist both ways.
 * Returns the merged profile (or the local one on failure). Safe to call
 * repeatedly — the merge is idempotent.
 */
export async function pullAndMerge(userId: string): Promise<PlayerProfile> {
  const local = readProfile();
  if (!FEATURE_FLAGS.CLOUD_PROFILE) return local;

  let remoteRaw: unknown = null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from(TABLE).select('profile').eq('user_id', userId).maybeSingle();
    if (error) {
      console.warn('[profile-sync] pull failed', error.message);
      return local;
    }
    remoteRaw = data?.profile ?? null;
  } catch (err) {
    console.warn('[profile-sync] pull threw', err);
    return local;
  }

  if (!remoteRaw) {
    // First sign-in on this account: the local profile IS the cloud profile.
    void pushNow(userId, local);
    return local;
  }

  // The cloud blob goes through the same sanitizer a localStorage load gets
  // (unknown ids dropped, retired kits stripped) before it meets local.
  const remote = sanitizeProfile(remoteRaw);
  const merged = mergeProfiles(local, remote);

  if (!profilesEqual(merged, local)) {
    // Local gained something: persist (the write hook schedules the push).
    return replaceProfile(merged);
  }
  // Local already had everything; the cloud may still be behind it.
  if (!profilesEqual(local, remote)) void pushNow(userId, local);
  return local;
}

/**
 * Start syncing for a signed-in player: one pull+merge, then the write hook.
 * Call `stopProfileSync()` on sign-out. Idempotent per user id.
 */
export async function startProfileSync(userId: string): Promise<PlayerProfile | null> {
  if (!FEATURE_FLAGS.CLOUD_PROFILE) return null;
  if (activeUserId === userId) return null;
  activeUserId = userId;
  registerProfileWriteHook(schedulePush);
  const merged = await pullAndMerge(userId);
  // The user may have signed out while the pull was in flight.
  return activeUserId === userId ? merged : null;
}

/** Sign-out: stop pushing. The local profile stays — anonymous play continues on it. */
export function stopProfileSync(): void {
  activeUserId = null;
  pending = null;
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  registerProfileWriteHook(null);
}
