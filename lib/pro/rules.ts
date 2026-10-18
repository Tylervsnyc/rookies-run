/**
 * Rookie Pro — what is free and what is Pro in Rookie's Revenge (2026-10-18).
 *
 *   FREE: the daily run, ladder rungs 1-4, ONE Endless run per local day,
 *         ranks + trophies.
 *   PRO:  ladder rungs 5-10 + every bonus rung (Hall of Mirrors, Kaleidoscope,
 *         any future one), unlimited Endless, gold name + Pro badge on Ranks.
 *
 * The entitlement itself is NOT decided here: it is the shared
 * `profiles.subscription_status` row (lib/subscription.ts), written only by
 * chess-learning-tree's RevenueCat + Stripe webhooks. Admins count as Pro.
 *
 * Pure functions, no React, safe on the server.
 */

import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { isProSubscription, type SubscriptionStatus } from '@/lib/subscription';

/**
 * The effective Pro switch. PRO without ACCOUNTS would gate content behind a
 * purchase nobody can make (a purchase has to belong to a Supabase account),
 * so both must be on. Every gate reads this, never FEATURE_FLAGS.PRO alone.
 */
export const PRO_ACTIVE: boolean = FEATURE_FLAGS.PRO && FEATURE_FLAGS.ACCOUNTS;

export const PRO_FREE_LIMITS = {
  /** Ladder rungs 1..N are free (1-based). */
  FREE_LADDER_RUNGS: 4,
  /** Endless runs a free player may START per local calendar day. */
  ENDLESS_PER_DAY: 1,
} as const;

export const PRO_PRICES = { monthly: '$4.99', yearly: '$39.99' } as const;
export const PRO_TRIAL_DAYS = 7;

/** The profile columns the entitlement reads (hooks/useUser selects them). */
export interface ProProfileFields {
  subscription_status?: SubscriptionStatus | null;
  subscription_expires_at?: string | null;
  is_admin?: boolean | null;
}

/** Active Pro: a live premium/trial subscription, or an admin. */
export function hasProEntitlement(profile: ProProfileFields | null | undefined): boolean {
  if (!profile) return false;
  if (profile.is_admin === true) return true;
  return isProSubscription(profile.subscription_status ?? null, profile.subscription_expires_at ?? null);
}

/** Is regular rung `num` (1-based) a Pro rung? */
export function isProRungNumber(num: number): boolean {
  return num > PRO_FREE_LIMITS.FREE_LADDER_RUNGS;
}

/** Is this ladder tile locked for this player? Bonus rungs are always Pro. */
export function isRungProLocked(num: number, bonus: boolean, isPro: boolean): boolean {
  if (!PRO_ACTIVE || isPro) return false;
  return bonus || isProRungNumber(num);
}

/** Has a free player used up today's Endless? `used` = runs started today. */
export function isEndlessProLocked(usedToday: number, isPro: boolean): boolean {
  if (!PRO_ACTIVE || isPro) return false;
  return usedToday >= PRO_FREE_LIMITS.ENDLESS_PER_DAY;
}

/** What opened the paywall — the analytics `trigger` and the Rookie line. */
export type ProTrigger = 'rung' | 'bonus_rung' | 'endless' | 'settings';

export const PRO_ROOKIE_LINES: Record<ProTrigger, string> = {
  rung: 'Rungs 5 through 10 are where it gets personal.',
  bonus_rung: 'Rungs 5 through 10 are where it gets personal.',
  endless: 'One more run? I will absolutely be getting my revenge.',
  settings: 'Every rung, every run, every app. I have plans for all of them.',
};
