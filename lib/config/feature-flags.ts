/**
 * Feature Flags — Rookie's Revenge.
 *
 * Toggle features on/off without removing code. Every flag ships `false`;
 * Tyler flips them. Same shape as Chess Path's `lib/config/feature-flags.ts`
 * so the two repos read the same way.
 */

export const FEATURE_FLAGS = {
  /**
   * Accounts (plan 1.2). Email + password sign-in on run.chesspath.app against
   * the SAME Supabase project as Chess Path / Chess Boxing, so one account
   * spans the family. The /auth/* pages exist regardless of this flag; what it
   * gates is every ENTRY point — the StreakChip "Sign in" link, the account row
   * in the Trophy Room, the FamilyStrip sign-in nudge. Anonymous play is never
   * affected.
   */
  ACCOUNTS: false,
  /**
   * Cloud copy of the local player profile (plan 1.2). When ON and signed in,
   * the profile in localStorage is pulled + merged with `revenge_profiles` on
   * sign-in (union trophies/abilities, max counters, local difficulty wins) and
   * every `writeProfile()` schedules a debounced push. Needs the
   * `2026-09-08-revenge-profiles.sql` migration applied. OFF = localStorage
   * only, exactly as today.
   */
  CLOUD_PROFILE: false,
  /**
   * "Your Chess" strip (plan 1.3): family streak + rating read from
   * chesspath.app with the signed-in bearer token, plus tiles that open the
   * Chess Path and Chess Boxing App Store pages. Requires run.chesspath.app in
   * the main repo's CORS allowlist (`lib/net/cors.ts`) or the numbers stay
   * blank — the strip tolerates that and still shows the tiles.
   */
  FAMILY_STRIP: false,
  /**
   * One web login across chesspath.app and run.chesspath.app (plan 1.4).
   * Supabase auth cookies are written with `Domain=.chesspath.app` (via
   * lib/supabase/cookie-domain.ts) so a sign-in on either site is a sign-in on
   * both, and a sign-out on either clears both. Only on chesspath.app hosts —
   * localhost and *.vercel.app previews keep host-only cookies. The one-time
   * host-only-cookie cleanup lives in the main repo's middleware (chesspath.app
   * is where the legacy cookies are). Must be flipped in BOTH repos together.
   * OFF = cookieOptions omitted, byte-identical to today.
   */
  SHARED_AUTH_COOKIE: false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
