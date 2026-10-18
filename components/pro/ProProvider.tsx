'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';
import { INERT_PRO, ProContext, type ProState } from '@/hooks/usePro';
import {
  PRO_ACTIVE,
  hasProEntitlement,
  isEndlessProLocked,
  isRungProLocked,
  type ProTrigger,
} from '@/lib/pro/rules';
import { fetchServerEndlessCount, localDay, readLocalEndlessCount, recordEndlessStart } from '@/lib/pro/endless-quota';
import { initRevenueCat, isNativeIap, isProActive } from '@/lib/iap/revenuecat';
import { ProEvents } from '@/lib/analytics/posthog';
import { RookieProPaywall, consumePaywallResume } from './RookieProPaywall';

/**
 * Mounted once in the root layout. With PRO_ACTIVE off it renders its
 * children inside the inert context and does NOTHING else — no auth read, no
 * RevenueCat, no paywall — so the app is byte-for-byte today's behaviour.
 */
export function ProProvider({ children }: { children: ReactNode }) {
  if (!PRO_ACTIVE) return <ProContext.Provider value={INERT_PRO}>{children}</ProContext.Provider>;
  return <ProProviderActive>{children}</ProProviderActive>;
}

function ProProviderActive({ children }: { children: ReactNode }) {
  const { user, profile, loading, refetchProfile } = useUser();
  const userId = user?.id ?? null;
  const email = user?.email ?? null;

  // StoreKit says Pro this session (purchase/restore, or the entitlement is
  // already active on the device) — covers the seconds before the webhook
  // writes the profiles row. Reset when the account changes.
  const [iapPro, setIapPro] = useState(false);
  const [paywall, setPaywall] = useState<ProTrigger | null>(null);
  const [endlessUsed, setEndlessUsed] = useState(0);

  const isPro = hasProEntitlement(profile) || iapPro;

  // RevenueCat: identify by Supabase uid as soon as we know it (iOS only).
  useEffect(() => {
    setIapPro(false);
    if (!userId) return;
    let cancelled = false;
    void (async () => {
      if (!(await isNativeIap())) return;
      if (!(await initRevenueCat(userId))) return;
      const active = await isProActive();
      if (!cancelled && active) setIapPro(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Endless used today: local hint first, then the server count for accounts.
  useEffect(() => {
    if (loading) return;
    const day = localDay();
    setEndlessUsed(readLocalEndlessCount(day));
    if (!userId) return;
    let cancelled = false;
    void fetchServerEndlessCount(userId, day).then((n) => {
      if (!cancelled && n !== null) setEndlessUsed(n);
    });
    return () => {
      cancelled = true;
    };
  }, [userId, loading]);

  // Back from sign-in that the paywall asked for: reopen it.
  useEffect(() => {
    if (loading || !userId) return;
    const resume = consumePaywallResume();
    if (resume && !isPro) setPaywall(resume);
  }, [loading, userId, isPro]);

  // Back from the chesspath.app checkout tab: re-read the entitlement.
  useEffect(() => {
    if (!userId) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refetchProfile();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [userId, refetchProfile]);

  const openPaywall = useCallback((trigger: ProTrigger) => setPaywall(trigger), []);

  const requireRung = useCallback(
    (num: number, bonus: boolean) => {
      if (!isRungProLocked(num, bonus, isPro)) return true;
      ProEvents.gateHit(bonus ? 'bonus_rung' : `rung_${num}`);
      setPaywall(bonus ? 'bonus_rung' : 'rung');
      return false;
    },
    [isPro],
  );

  const requireEndless = useCallback(() => {
    if (!isEndlessProLocked(endlessUsed, isPro)) return true;
    ProEvents.limitHit('endless');
    setPaywall('endless');
    return false;
  }, [endlessUsed, isPro]);

  const recordEndless = useCallback(
    (seed: number) => {
      recordEndlessStart(userId, seed);
      setEndlessUsed((n) => n + 1);
    },
    [userId],
  );

  const value = useMemo<ProState>(
    () => ({
      active: true,
      loading,
      isPro,
      userId,
      email,
      endlessUsedToday: endlessUsed,
      endlessLocked: isEndlessProLocked(endlessUsed, isPro),
      rungLocked: (num, bonus) => isRungProLocked(num, bonus, isPro),
      openPaywall,
      requireRung,
      requireEndless,
      recordEndless,
    }),
    [loading, isPro, userId, email, endlessUsed, openPaywall, requireRung, requireEndless, recordEndless],
  );

  return (
    <ProContext.Provider value={value}>
      {children}
      {paywall && (
        <RookieProPaywall
          trigger={paywall}
          userId={userId}
          email={email}
          profile={profile}
          onClose={() => setPaywall(null)}
          onUnlocked={() => {
            setIapPro(true);
            void refetchProfile();
          }}
          refetchProfile={refetchProfile}
        />
      )}
    </ProContext.Provider>
  );
}
