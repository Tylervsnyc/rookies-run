'use client';

/**
 * Family numbers inside Revenge (plan 1.3).
 *
 * The streak and rating are computed ONCE, on chesspath.app
 * (`/api/workout/streak`, `/api/profile/elo`). Revenge shares the Supabase
 * project, so the signed-in session's JWT verifies on the main API's bearer
 * branch — we just forward it. Nothing is derived here; if the fetch fails
 * (CORS not yet allowed for run.chesspath.app, offline, signed out) every
 * number is `null` and the caller renders blanks. Never throws.
 */

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

export const FAMILY_ORIGIN = 'https://chesspath.app';

export const FAMILY_APPS = {
  chesspath: {
    name: 'Chess Path',
    blurb: 'Learn',
    storeUrl: 'https://apps.apple.com/us/app/id6806865294',
    webUrl: 'https://chesspath.app',
  },
  chessboxing: {
    name: 'Chess Boxing',
    blurb: 'Fight',
    storeUrl: 'https://apps.apple.com/us/app/chess-boxing-by-chess-path/id6796812770',
    webUrl: 'https://chesspath.app/box',
  },
} as const;

export type FamilyAppId = keyof typeof FAMILY_APPS;

/**
 * Bearer fetch against chesspath.app. Resolves to `null` (never rejects) when
 * there is no session, the network fails, CORS blocks it, or the API says no.
 */
export async function familyFetch<T = unknown>(path: string): Promise<T | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return null;
    const res = await fetch(`${FAMILY_ORIGIN}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface FamilyStats {
  /** Family-wide streak (lessons, play, workouts, Revenge runs). */
  streak: number | null;
  completedToday: boolean;
  /** Chess Path rating estimate. */
  rating: number | null;
}

interface StreakResponse {
  current: number;
  longest: number;
  completedToday: boolean;
}

interface EloResponse {
  current: number;
  events: number;
}

/**
 * `null` while loading or when signed out / unreachable. Both calls run in
 * parallel; either may fail independently and the other still lands.
 */
export function useFamilyStats(userId: string | null | undefined): FamilyStats | null {
  const [stats, setStats] = useState<FamilyStats | null>(null);

  useEffect(() => {
    if (!FEATURE_FLAGS.FAMILY_STRIP || !userId) {
      setStats(null);
      return;
    }
    let cancelled = false;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    Promise.all([
      familyFetch<StreakResponse>(`/api/workout/streak?tz=${encodeURIComponent(tz)}`),
      familyFetch<EloResponse>('/api/profile/elo'),
    ]).then(([streak, elo]) => {
      if (cancelled) return;
      setStats({
        streak: typeof streak?.current === 'number' ? streak.current : null,
        completedToday: streak?.completedToday === true,
        rating: typeof elo?.current === 'number' ? Math.round(elo.current) : null,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return stats;
}

/**
 * Open a family app's store page outside the current page: a new tab on the
 * web, the system browser inside the Capacitor shell (so the App Store page
 * shows "Open" when the app is installed — no installed-app detection).
 */
export function openFamilyApp(app: FamilyAppId): void {
  const url = FAMILY_APPS[app].storeUrl;
  const w = window as Window & { Capacitor?: { isNativePlatform?: () => boolean } };
  const target = w.Capacitor?.isNativePlatform?.() === true ? '_system' : '_blank';
  window.open(url, target, 'noopener,noreferrer');
}
