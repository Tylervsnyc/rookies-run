'use client';

import Link from 'next/link';
import { clickSfx, withClick } from '@/lib/sounds';
import { useUser } from '@/hooks/useUser';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { usePro } from '@/hooks/usePro';
import { GoldLock } from '@/components/pro/RookieProSheet';

/**
 * The one account entry in the game (plan 1.2) — sits at the top of the
 * Trophy Room body. Signed out: sign in / create account. Signed in: the
 * email and a sign-out button. Renders nothing unless ACCOUNTS is on.
 */
export function AccountRow() {
  if (!FEATURE_FLAGS.ACCOUNTS) return null;
  return <AccountRowInner />;
}

const ROW_STYLE = {
  background: '#1c2f63',
  border: '2px solid #3a4f8f',
  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -3px 0 rgba(0,0,0,0.35)',
} as const;

const LINK_CLASS =
  'min-h-[44px] px-3 rounded-xl flex items-center justify-center text-[12px] font-black uppercase tracking-wider active:opacity-70';

/**
 * Rookie Pro line under the account row (PRO_ACTIVE only — `pro.active` is
 * false otherwise and this renders nothing). The settings door to the
 * paywall: sign-in is asked from here or from a Pro gate, never before play.
 */
function ProRow() {
  const pro = usePro();
  if (!pro.active || pro.loading) return null;
  if (pro.isPro) {
    return (
      <div className="w-full rounded-2xl p-3 mt-2 flex items-center justify-between gap-3" style={{ ...ROW_STYLE, borderColor: '#C98200' }}>
        <div className="min-w-0">
          <div className="text-[13px] font-black leading-tight" style={{ color: '#FFD966' }}>Rookie Pro</div>
          <div className="text-[11px] text-chess-text-muted leading-snug">Active in Revenge, Chess Path and Chess Boxing.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full rounded-2xl p-3 mt-2 flex items-center justify-between gap-3" style={ROW_STYLE}>
      <div className="min-w-0">
        <div className="text-[13px] font-black leading-tight flex items-center gap-1.5"><GoldLock size={13} /> Rookie Pro</div>
        <div className="text-[11px] text-chess-text-muted leading-snug">Rungs 5-10, bonus rungs, unlimited Endless.</div>
      </div>
      <button
        type="button"
        onClick={withClick(() => pro.openPaywall('settings'))}
        className={`${LINK_CLASS} shrink-0`}
        style={{ color: '#4A2F00', background: 'linear-gradient(180deg,#FFE27A 0%,#FFC933 55%,#F2A91C 100%)' }}
      >
        Go Pro
      </button>
    </div>
  );
}

function AccountRowInner() {
  return (
    <>
      <AccountIdentity />
      <ProRow />
    </>
  );
}

function AccountIdentity() {
  const { user, loading, signOut } = useUser();

  if (loading) return null;

  if (!user) {
    return (
      <div className="w-full rounded-2xl p-3 flex items-center justify-between gap-3" style={ROW_STYLE}>
        <div className="min-w-0">
          <div className="text-[13px] font-black leading-tight">Keep your trophies</div>
          <div className="text-[11px] text-chess-text-muted leading-snug">One account for the whole family of apps.</div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Link href="/auth/login?redirect=/" onClick={clickSfx} className={LINK_CLASS} style={{ color: '#fff', background: 'rgba(0,0,0,0.3)' }}>
            Sign in
          </Link>
          <Link href="/auth/signup?redirect=/" onClick={clickSfx} className={LINK_CLASS} style={{ color: '#0a1230', background: '#f5cf5a' }}>
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl p-3 flex items-center justify-between gap-3" style={ROW_STYLE}>
      <div className="min-w-0">
        <div className="text-[9px] uppercase tracking-[0.22em] font-black text-chess-text-muted">Signed in</div>
        <div className="text-[13px] font-black truncate">{user.email}</div>
      </div>
      <button
        type="button"
        onClick={withClick(() => void signOut())}
        className={`${LINK_CLASS} shrink-0`}
        style={{ color: '#fff', background: 'rgba(0,0,0,0.3)' }}
      >
        Sign out
      </button>
    </div>
  );
}
