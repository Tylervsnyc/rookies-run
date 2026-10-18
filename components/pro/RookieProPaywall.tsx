'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { RookieProSheetView } from './RookieProSheet';
import { ProEvents, type ProPlan, type ProPlatform } from '@/lib/analytics/posthog';
import { openFamilyApp } from '@/lib/family/client';
import { createClient } from '@/lib/supabase/client';
import { PRO_ROOKIE_LINES, hasProEntitlement, type ProProfileFields, type ProTrigger } from '@/lib/pro/rules';
import {
  getProOffering,
  initRevenueCat,
  isNativeIap,
  isNativeShellSync,
  purchasePro,
  restorePro,
  type ProOffering,
} from '@/lib/iap/revenuecat';

/**
 * The Rookie Pro paywall — the ONE purchase surface in Revenge. Opened by
 * <ProProvider> (usePro().openPaywall / requireRung / requireEndless).
 *
 * PURCHASE PATHS
 *   iOS app  -> RevenueCat / StoreKit (lib/iap/revenuecat.ts). Apple 3.1.1:
 *               NO web checkout link is ever rendered or opened here.
 *   Web      -> link out to chesspath.app/pricing?plan=<plan>&from=revenge in
 *               a new tab. Stripe checkout lives on chesspath.app only (one
 *               webhook, one entitlement). With SHARED_AUTH_COOKIE on, the
 *               Revenge session cookie is Domain=.chesspath.app, so the user
 *               lands there already signed in as the same account; with it
 *               off they sign in again on chesspath.app (same email). When the
 *               tab comes back, ProProvider refetches the profile and this
 *               sheet closes itself once the entitlement shows up.
 *
 * SIGN-IN: a purchase must belong to a Supabase account (it is what unlocks
 * the other two apps), so a signed-out player who taps the CTA (or Restore)
 * is sent to /auth/login first; the sheet reopens on return
 * (consumePaywallResume). Sign-in is NEVER asked before play — only here.
 */

const RESUME_KEY = 'rr-pro-resume';
const CHESSPATH_PRICING = 'https://chesspath.app/pricing';

function savePaywallResume(trigger: ProTrigger) {
  try {
    sessionStorage.setItem(RESUME_KEY, trigger);
  } catch {
    /* private mode: the player just reopens it by hand */
  }
}

/** One-shot: the trigger to reopen after sign-in, cleared on read. */
export function consumePaywallResume(): ProTrigger | null {
  try {
    const v = sessionStorage.getItem(RESUME_KEY) as ProTrigger | null;
    if (v) sessionStorage.removeItem(RESUME_KEY);
    return v && v in PRO_ROOKIE_LINES ? v : null;
  } catch {
    return null;
  }
}

/** Web only: has this account had a subscription before (trial or paid)? */
function webTrialUsed(profile: ProProfileFields | null | undefined): boolean {
  const s = profile?.subscription_status;
  return (s === 'premium' || s === 'trial') && !hasProEntitlement(profile);
}

export interface RookieProPaywallProps {
  trigger: ProTrigger;
  userId: string | null;
  email: string | null;
  profile: ProProfileFields | null;
  onClose: () => void;
  /** The entitlement is confirmed (StoreKit) — the provider unlocks for this session. */
  onUnlocked: () => void;
  refetchProfile: () => Promise<void>;
}

export function RookieProPaywall({ trigger, userId, email, profile, onClose, onUnlocked, refetchProfile }: RookieProPaywallProps) {
  const router = useRouter();
  const [plan, setPlan] = useState<ProPlan>('yearly');
  const [native, setNative] = useState<boolean>(() => isNativeShellSync());
  const [offering, setOffering] = useState<ProOffering | null>(null);
  const [busy, setBusy] = useState<'buy' | 'restore' | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const webCheckoutOpened = useRef(false);
  const platform: ProPlatform = native ? 'ios' : 'web';

  useEffect(() => {
    ProEvents.paywallShown(trigger, isNativeShellSync() ? 'ios' : 'web');
  }, [trigger]);

  // iOS: identify + load the offering (trial-aware: no_trial -> default).
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const n = await isNativeIap();
      if (cancelled) return;
      setNative(n);
      if (n && (await initRevenueCat(userId))) {
        const off = await getProOffering();
        if (!cancelled) setOffering(off);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Web: the checkout finished in the other tab -> the profile now says Pro.
  const entitled = hasProEntitlement(profile);
  useEffect(() => {
    if (!entitled) return;
    if (webCheckoutOpened.current) ProEvents.purchaseCompleted(plan, 'web');
    onClose();
  }, [entitled, plan, onClose]);

  // Escape closes, like every other sheet in the app.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const dismiss = () => {
    ProEvents.paywallDismissed(trigger);
    onClose();
  };

  const goSignIn = () => {
    savePaywallResume(trigger);
    onClose();
    router.push('/auth/login?redirect=/');
  };

  const trialEligible = native ? offering?.trialEligible !== false : !webTrialUsed(profile);

  const buy = async () => {
    if (busy) return;
    setNote(null);
    if (!userId) return goSignIn();
    ProEvents.purchaseStarted(plan, platform, trigger);

    if (!native) {
      // NEVER reached inside the iOS app (native is true there).
      webCheckoutOpened.current = true;
      window.open(`${CHESSPATH_PRICING}?plan=${plan}&from=revenge`, '_blank', 'noopener,noreferrer');
      setNote('Finish on chesspath.app. Pro unlocks here as soon as it goes through.');
      return;
    }

    const pkg = plan === 'monthly' ? offering?.monthly : offering?.yearly;
    if (!pkg) {
      ProEvents.purchaseFailed('ios', 'no_offering');
      setNote('The App Store is still loading. Give it a second and tap again.');
      return;
    }
    setBusy('buy');
    try {
      const res = await purchasePro(pkg);
      if (res.ok) {
        ProEvents.purchaseCompleted(plan, 'ios');
        onUnlocked();
        onClose();
      } else if (res.cancelled) {
        ProEvents.purchaseFailed('ios', 'cancelled');
      } else {
        ProEvents.purchaseFailed('ios', res.error ?? 'store_error');
        setNote('That purchase did not go through. Nothing was charged.');
      }
    } finally {
      setBusy(null);
    }
  };

  const restore = async () => {
    if (busy) return;
    setNote(null);
    if (!userId) return goSignIn();
    ProEvents.restoreTapped(platform);
    setBusy('restore');
    try {
      if (native) {
        const ok = await restorePro();
        ProEvents.restoreResult('ios', ok);
        if (ok) {
          onUnlocked();
          onClose();
        } else {
          setNote('No Rookie Pro found on this Apple ID.');
        }
      } else {
        // Web: the subscription lives on the account — re-read it. If it is
        // there, the `entitled` effect above closes the sheet.
        const { data } = await createClient()
          .from('profiles')
          .select('subscription_status, subscription_expires_at, is_admin')
          .eq('id', userId)
          .maybeSingle();
        const ok = hasProEntitlement(data as ProProfileFields | null);
        ProEvents.restoreResult('web', ok);
        await refetchProfile();
        if (!ok) setNote('No Rookie Pro on this account yet. Bought it on another account? Sign in with that one.');
      }
    } finally {
      setBusy(null);
    }
  };

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center" role="dialog" aria-modal="true" aria-label="Rookie Pro">
      <button type="button" aria-label="Close" onClick={dismiss} className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-[430px] rookie-pro-in">
        <style>{`
          @keyframes rookie-pro-in { from { transform: translateY(28px); opacity: 0; } to { transform: none; opacity: 1; } }
          .rookie-pro-in { animation: rookie-pro-in 260ms cubic-bezier(.22,1,.36,1) both; }
          @media (prefers-reduced-motion: reduce) { .rookie-pro-in { animation: none; } }
        `}</style>
        <RookieProSheetView
          line={PRO_ROOKIE_LINES[trigger]}
          plan={plan}
          onPlan={setPlan}
          monthlyPrice={offering?.monthlyPrice}
          yearlyPrice={offering?.yearlyPrice}
          trialEligible={trialEligible}
          email={email}
          busy={busy}
          note={note}
          siblingAction={native ? 'Get' : 'Open'}
          onSibling={(a) => openFamilyApp(a, native ? 'store' : 'web')}
          onCta={() => void buy()}
          onNotNow={dismiss}
          onRestore={() => void restore()}
        />
      </div>
    </div>,
    document.body,
  );
}
