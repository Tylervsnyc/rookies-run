/**
 * ONE entitlement across the family. `profiles.subscription_status` +
 * `subscription_expires_at` live in the shared Supabase project; Chess Path
 * and Chess Boxing read them through this same function (copied verbatim from
 * the main repo's `lib/subscription.ts`). Never add a second "pro" concept
 * here — when Pro ships, Revenge reads the same row.
 */

export type SubscriptionStatus = 'free' | 'premium' | 'trial';

/**
 * Check if a user has an active premium subscription
 */
export function isPremiumSubscription(
  status: SubscriptionStatus | null | undefined,
  expiresAt: string | null | undefined
): boolean {
  if (!status || status === 'free') return false;
  if (status === 'premium' || status === 'trial') {
    // Check if not expired
    if (expiresAt) {
      return new Date(expiresAt) > new Date();
    }
    return true;
  }
  return false;
}

/** Alias so Pro-flavoured code reads naturally while staying on the one source of truth. */
export const isProSubscription = isPremiumSubscription;
