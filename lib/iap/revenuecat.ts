'use client';

/**
 * RevenueCat (StoreKit) plumbing for Rookie Pro — the Rookie's Revenge iOS app
 * ONLY. Modeled on chess-learning-tree's lib/iap/revenuecat.ts.
 *
 * Apple 3.1.1: inside the iOS app a digital subscription must be bought
 * through In-App Purchase, and the app may not link out to a web checkout. So
 * the paywall buys through StoreKit here, and the web path (a link to
 * chesspath.app/pricing) is never rendered when `isNativeIap()` is true.
 *
 * ONE RevenueCat project, three apps (Chess Path, Chess Boxing, Revenge), ONE
 * entitlement `pro`. The customer is identified by the Supabase user id — the
 * webhook in chess-learning-tree receives it as `app_user_id` and writes the
 * shared `profiles.subscription_status`, which is what unlocks Pro in all
 * three apps. A purchase therefore requires a signed-in user (the paywall
 * asks for sign-in first; this module refuses to configure anonymously for a
 * purchase).
 *
 *   Products: revenge_pro_monthly / revenge_pro_yearly
 *   Offerings: `default` (7-day trial). Optional `no_trial` for players who
 *              already used a trial — tried first when StoreKit says the
 *              player is not eligible for the intro offer, falling back to
 *              `default` (Apple simply won't apply a trial they're not
 *              eligible for, so `default` is always safe to sell).
 *   Key: NEXT_PUBLIC_REVENUECAT_IOS_KEY_REVENGE (public SDK key, inlined at
 *        build time by scripts/build-offline.mjs, which forwards NEXT_PUBLIC_*).
 *
 * On the web every function is a no-op (`isNativeIap()` false). The plugin is
 * imported lazily so it never ships in the web bundle's critical path.
 */

import type { PurchasesPackage } from '@revenuecat/purchases-capacitor';

export const RC_ENTITLEMENT = 'pro';
export const RC_PRODUCTS = { monthly: 'revenge_pro_monthly', yearly: 'revenge_pro_yearly' } as const;
export const RC_OFFERING_DEFAULT = 'default';
export const RC_OFFERING_NO_TRIAL = 'no_trial';
export const RC_KEY_ENV = 'NEXT_PUBLIC_REVENUECAT_IOS_KEY_REVENGE';
// Must be a literal `process.env.X` read so Next inlines it.
const RC_API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY_REVENGE;

export interface ProOffering {
  monthly: PurchasesPackage | null;
  yearly: PurchasesPackage | null;
  /** Localized price strings straight from StoreKit ("$4.99"). */
  monthlyPrice: string | null;
  yearlyPrice: string | null;
  /** false = StoreKit says this Apple ID already used the intro offer. null = unknown. */
  trialEligible: boolean | null;
  /** Which offering these packages came from. */
  offeringId: string;
}

let configuredFor: string | null = null; // Supabase uid we identified as ('' = anonymous)
let nativeCache: boolean | null = null;

/** True only inside the Capacitor iOS app — never on the web. */
export async function isNativeIap(): Promise<boolean> {
  if (nativeCache !== null) return nativeCache;
  try {
    const { Capacitor } = await import('@capacitor/core');
    nativeCache = Capacitor.isNativePlatform();
  } catch {
    nativeCache = false;
  }
  return nativeCache;
}

/** Sync best guess for render decisions (e.g. never draw a web link in the app). */
export function isNativeShellSync(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as Window & { Capacitor?: { isNativePlatform?: () => boolean } };
  return w.Capacitor?.isNativePlatform?.() === true;
}

async function plugin() {
  const mod = await import('@revenuecat/purchases-capacitor');
  return mod.Purchases;
}

/**
 * Configure once and identify by Supabase uid. Safe to call repeatedly; a
 * different uid switches the customer with logIn (sign-out/sign-in as someone
 * else). Returns false on the web, without a key, or on error.
 */
export async function initRevenueCat(userId: string | null): Promise<boolean> {
  if (!(await isNativeIap())) return false;
  if (!RC_API_KEY) {
    console.warn(`[revenuecat] ${RC_KEY_ENV} missing — IAP disabled`);
    return false;
  }
  try {
    const Purchases = await plugin();
    if (configuredFor === null) {
      await Purchases.configure({ apiKey: RC_API_KEY, appUserID: userId ?? undefined });
      configuredFor = userId ?? '';
    } else if (userId && configuredFor !== userId) {
      await Purchases.logIn({ appUserID: userId });
      configuredFor = userId;
    }
    return true;
  } catch (err) {
    console.error('[revenuecat] configure failed', err);
    return false;
  }
}

type Offering = { availablePackages: PurchasesPackage[]; monthly: PurchasesPackage | null; annual: PurchasesPackage | null };

function split(off: Offering) {
  const monthly =
    off.monthly ?? off.availablePackages.find((p) => p.product.identifier === RC_PRODUCTS.monthly) ?? null;
  const yearly =
    off.annual ?? off.availablePackages.find((p) => p.product.identifier === RC_PRODUCTS.yearly) ?? null;
  return { monthly, yearly };
}

/**
 * StoreKit intro-offer eligibility for the yearly + monthly products.
 * true = eligible, false = already used, null = unknown (treat as eligible in
 * copy only when the product actually has an intro offer).
 */
async function trialEligibility(): Promise<boolean | null> {
  try {
    const Purchases = await plugin();
    const res = await Purchases.checkTrialOrIntroductoryPriceEligibility({
      productIdentifiers: [RC_PRODUCTS.yearly, RC_PRODUCTS.monthly],
    });
    const statuses = Object.values(res).map((e) => (e as { status?: number }).status);
    // INTRO_ELIGIBILITY_STATUS: 0 unknown, 1 ineligible, 2 eligible, 3 no intro offer
    if (statuses.some((s) => s === 2)) return true;
    if (statuses.length > 0 && statuses.every((s) => s === 1 || s === 3)) return false;
    return null;
  } catch {
    return null;
  }
}

/**
 * The packages the paywall renders. Ineligible for a trial -> `no_trial` if it
 * exists, else `default`. Eligible / unknown -> `default` (current).
 */
export async function getProOffering(): Promise<ProOffering | null> {
  if (!(await isNativeIap())) return null;
  try {
    const Purchases = await plugin();
    const offerings = await Purchases.getOfferings();
    const eligible = await trialEligibility();
    const def = offerings.all[RC_OFFERING_DEFAULT] ?? offerings.current;
    const noTrial = offerings.all[RC_OFFERING_NO_TRIAL] ?? null;
    const chosen = eligible === false && noTrial ? noTrial : def;
    if (!chosen) return null;
    const { monthly, yearly } = split(chosen);
    return {
      monthly,
      yearly,
      monthlyPrice: monthly?.product.priceString ?? null,
      yearlyPrice: yearly?.product.priceString ?? null,
      trialEligible: eligible,
      offeringId: chosen.identifier,
    };
  } catch (err) {
    console.error('[revenuecat] getOfferings failed', err);
    return null;
  }
}

/**
 * Buy a package. `ok` = the `pro` entitlement is active afterwards (the
 * webhook flips the DB row moments later; the caller refetches the profile
 * and trusts this result for the current session meanwhile).
 */
export async function purchasePro(pkg: PurchasesPackage): Promise<{ ok: boolean; cancelled: boolean; error?: string }> {
  if (!(await isNativeIap())) return { ok: false, cancelled: false, error: 'not_native' };
  try {
    const Purchases = await plugin();
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    return { ok: !!customerInfo.entitlements.active[RC_ENTITLEMENT], cancelled: false };
  } catch (err) {
    const e = err as { code?: string; message?: string; userCancelled?: boolean };
    const cancelled = e?.userCancelled === true || /cancel/i.test(String(e?.code ?? e?.message ?? ''));
    if (!cancelled) console.error('[revenuecat] purchase failed', err);
    return { ok: false, cancelled, error: String(e?.code ?? e?.message ?? 'unknown') };
  }
}

/**
 * Restore purchases (Apple requires the button). Re-reads customer info once:
 * a purchase made in a sibling app (same uid, same entitlement) can land a
 * beat after `restorePurchases` resolves.
 */
export async function restorePro(): Promise<boolean> {
  if (!(await isNativeIap())) return false;
  try {
    const Purchases = await plugin();
    const { customerInfo } = await Purchases.restorePurchases();
    if (customerInfo.entitlements.active[RC_ENTITLEMENT]) return true;
    const fresh = await Purchases.getCustomerInfo();
    return !!fresh.customerInfo.entitlements.active[RC_ENTITLEMENT];
  } catch (err) {
    console.error('[revenuecat] restore failed', err);
    return false;
  }
}

/** Is the `pro` entitlement active on the device's RevenueCat customer? */
export async function isProActive(): Promise<boolean> {
  if (!(await isNativeIap())) return false;
  try {
    const Purchases = await plugin();
    const { customerInfo } = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active[RC_ENTITLEMENT];
  } catch {
    return false;
  }
}
