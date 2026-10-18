'use client';

import { BreathingRook } from '@/components/ui/BreathingRook';
import { withClick } from '@/lib/sounds';
import { FAMILY_APPS, type FamilyAppId } from '@/lib/family/client';
import { PRO_PRICES, PRO_TRIAL_DAYS } from '@/lib/pro/rules';
import type { ProPlan } from '@/lib/analytics/posthog';

/**
 * The Rookie Pro sheet — PRESENTATION ONLY. Ported from the approved design
 * mock in chess-learning-tree (app/test/pro-family-popup, 2026-10-18): gold
 * hero with an excited, golden Rookie (BreathingRook mood="excited" with a
 * sheen), "Rookie Pro", "One subscription. All three apps.", 7 DAYS FREE pill,
 * a contextual Rookie line, the three-app card (Revenge first, marked Here),
 * yearly/monthly cards, the gold CTA, the signed-in line, Not now / Restore.
 *
 * The sheet is gold/white on purpose even though the app around it is the
 * navy arena (useNavyShell): Pro is the one surface that is meant to look
 * different. Must fit a 375x667 screen with NO scrolling — verify at
 * /test/rookie-pro. All logic (StoreKit, web link-out, sign-in) lives in
 * RookieProPaywall.tsx; this file only renders what it is given.
 */

export const GOLD_GRADIENT = 'linear-gradient(135deg, #FFF3C4 0%, #FFD966 38%, #F5B82E 72%, #E39B12 100%)';
export const GOLD_BUTTON = 'linear-gradient(180deg, #FFE27A 0%, #FFC933 55%, #F2A91C 100%)';

type RowApp = 'revenge' | FamilyAppId;

const APP_ROWS: Record<RowApp, { name: string; pro: string }> = {
  revenge: { name: "Rookie's Revenge", pro: 'Full ladder + unlimited Endless' },
  chesspath: { name: FAMILY_APPS.chesspath.name, pro: 'Unlimited lessons + game reviews' },
  chessboxing: { name: FAMILY_APPS.chessboxing.name, pro: 'Unlimited fights + Puzzle Boxing' },
};
const ROW_ORDER: RowApp[] = ['revenge', 'chesspath', 'chessboxing'];

export interface RookieProSheetViewProps {
  /** Rookie's contextual line (lib/pro/rules PRO_ROOKIE_LINES). */
  line: string;
  plan: ProPlan;
  onPlan: (p: ProPlan) => void;
  monthlyPrice?: string | null;
  yearlyPrice?: string | null;
  /** false = already used a trial: no pill, CTA says "Start Rookie Pro". */
  trialEligible: boolean;
  /** Signed-in email, or null when signed out. */
  email: string | null;
  busy?: 'buy' | 'restore' | null;
  note?: string | null;
  /** "Get" (iOS: App Store) or "Open" (web: the sibling's site). */
  siblingAction: 'Get' | 'Open';
  onSibling: (app: FamilyAppId) => void;
  onCta: () => void;
  onNotNow: () => void;
  onRestore: () => void;
  /** Disable the CTA (e.g. the store has not loaded). */
  ctaDisabled?: boolean;
}

export function RookieProSheetView({
  line, plan, onPlan, monthlyPrice, yearlyPrice, trialEligible, email, busy, note,
  siblingAction, onSibling, onCta, onNotNow, onRestore, ctaDisabled,
}: RookieProSheetViewProps) {
  const price = (p: ProPlan) => (p === 'monthly' ? monthlyPrice ?? PRO_PRICES.monthly : yearlyPrice ?? PRO_PRICES.yearly);
  const ctaLabel = busy === 'buy' ? 'One moment...' : trialEligible ? `Start ${PRO_TRIAL_DAYS} days free` : 'Start Rookie Pro';
  const fine = trialEligible
    ? `Then ${plan === 'yearly' ? `${price('yearly')} a year` : `${price('monthly')} a month`}. Cancel anytime.`
    : `${plan === 'yearly' ? `${price('yearly')} a year` : `${price('monthly')} a month`}. Cancel anytime.`;

  return (
    <div className="overflow-hidden rounded-t-[28px] bg-white pb-[max(env(safe-area-inset-bottom),14px)]" data-testid="rookie-pro-sheet">
      {/* Gold hero */}
      <div className="relative px-5 pt-2 pb-3 text-center" style={{ background: GOLD_GRADIENT }}>
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-black/15" />
        <Sparkles />
        <div className="relative mx-auto flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_50%_40%,#7A4E00_0%,#3E2700_100%)] ring-2 ring-[#FFE27A] shadow-[0_6px_18px_rgba(140,90,0,0.45),0_0_24px_rgba(255,214,90,0.6)]">
          <BreathingRook size="sm" mood="excited" animate />
          <span className="rookie-pro-sheen pointer-events-none absolute inset-y-0 -left-full w-1/2" />
        </div>
        <style>{`
          .rookie-pro-sheen {
            background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 70%, transparent 100%);
            animation: rookieProSheen 2.8s ease-in-out infinite;
            mix-blend-mode: screen;
          }
          @keyframes rookieProSheen { 0% { transform: translateX(0); } 55%, 100% { transform: translateX(400%); } }
          @media (prefers-reduced-motion: reduce) { .rookie-pro-sheen { animation: none; } }
        `}</style>
        <h2 className="mt-2 text-[28px] font-black leading-none tracking-tight text-[#5A3A00]">Rookie Pro</h2>
        <p className="mt-1 text-[13px] font-bold text-[#6E4A05]">One subscription. All three apps.</p>
        {trialEligible && (
          <span className="mt-2 inline-block rounded-full bg-[#5A3A00] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#FFD966]">
            {PRO_TRIAL_DAYS} days free
          </span>
        )}
      </div>

      <div className="px-4 pt-3">
        <p className="text-center text-[13px] font-semibold leading-snug text-chess-text-muted">{line}</p>

        <ul className="mt-3 divide-y divide-slate-100 rounded-2xl border border-[#F3D78A] bg-[#FFFBEF]">
          {ROW_ORDER.map((a) => {
            const app = APP_ROWS[a];
            return (
              <li key={a} className="flex items-center gap-3 px-3 py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/family/${a}.webp`} alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-[10px] shadow-sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-black leading-tight text-chess-text">{app.name}</div>
                  <div className="text-[11px] font-bold leading-tight text-[#9A6A00]">{app.pro}</div>
                </div>
                {a === 'revenge' ? (
                  <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-chess-text-faint">Here</span>
                ) : (
                  <button
                    type="button"
                    onClick={withClick(() => onSibling(a))}
                    className="min-h-[36px] shrink-0 rounded-lg bg-white px-3 text-[11px] font-black text-chess-text shadow-sm ring-1 ring-slate-200"
                    aria-label={`${siblingAction} ${app.name}`}
                  >
                    {siblingAction}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Plan">
          {(['yearly', 'monthly'] as const).map((p) => {
            const on = plan === p;
            return (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={withClick(() => onPlan(p))}
                className={`relative min-h-[58px] rounded-2xl border-2 px-3 py-2 text-left transition-colors ${on ? 'border-[#F2A91C] bg-[#FFF6D6]' : 'border-slate-200 bg-white'}`}
              >
                {p === 'yearly' && (
                  <span className="absolute -top-2 right-2 rounded-full bg-[#5A3A00] px-2 py-px text-[9px] font-black uppercase tracking-widest text-[#FFD966]">
                    Save 33%
                  </span>
                )}
                <div className="text-[10px] font-black uppercase tracking-wide text-chess-text-muted">{p}</div>
                <div className="text-lg font-black tabular-nums leading-tight text-chess-text">
                  {price(p)}
                  <span className="ml-1 text-[10px] font-black uppercase text-chess-text-faint">{p === 'yearly' ? '/yr' : '/mo'}</span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={withClick(onCta)}
          disabled={!!busy || ctaDisabled}
          data-testid="rookie-pro-cta"
          className="mt-3 w-full min-h-[50px] rounded-2xl text-[17px] font-black text-[#4A2F00] shadow-[0_4px_0_0_#C98200] active:translate-y-[3px] active:shadow-none transition-transform disabled:opacity-60"
          style={{ background: GOLD_BUTTON }}
        >
          {ctaLabel}
        </button>
        <p className="mt-1.5 text-center text-[11px] font-semibold text-chess-text-faint">{note ?? fine}</p>

        <p className="mt-2 text-center text-[11px] font-semibold leading-snug text-chess-text-muted">
          {email ? (
            <>Signed in as <span className="font-black text-chess-text">{email}</span>. Use it in every app.</>
          ) : (
            <>Sign in first, so it works in every app.</>
          )}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <button type="button" onClick={withClick(onNotNow)} className="min-h-[44px] px-2 text-xs font-bold text-chess-text-muted">
            Not now
          </button>
          <button type="button" onClick={withClick(onRestore)} disabled={!!busy} className="min-h-[44px] px-2 text-xs font-bold text-[#9A6A00] disabled:opacity-60">
            {busy === 'restore' ? 'Checking...' : 'Restore purchases'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Sparkles() {
  const dots = [
    { l: '12%', t: '30%', s: 10 },
    { l: '84%', t: '22%', s: 12 },
    { l: '76%', t: '62%', s: 8 },
    { l: '20%', t: '68%', s: 7 },
  ];
  return (
    <>
      {dots.map((d, i) => (
        <svg
          key={i}
          viewBox="0 0 10 10"
          className="pointer-events-none absolute animate-pulse"
          style={{ left: d.l, top: d.t, width: d.s, height: d.s, animationDelay: `${i * 0.4}s` }}
          aria-hidden="true"
        >
          <path d="M5 0l1.2 3.8L10 5 6.2 6.2 5 10 3.8 6.2 0 5l3.8-1.2z" fill="#FFFFFF" opacity="0.85" />
        </svg>
      ))}
    </>
  );
}

/** Small gold lock used on Pro-locked tiles (ladder rungs, Endless). */
export function GoldLock({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="rr-gold-lock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE27A" />
          <stop offset="1" stopColor="#E39B12" />
        </linearGradient>
      </defs>
      <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="url(#rr-gold-lock)" strokeWidth="2.6" strokeLinecap="round" />
      <rect x="4" y="10" width="16" height="11" rx="3" fill="url(#rr-gold-lock)" />
      <circle cx="12" cy="15.5" r="1.8" fill="#5A3A00" />
    </svg>
  );
}
