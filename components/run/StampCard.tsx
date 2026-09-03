'use client';

import type { CSSProperties, ReactNode } from 'react';

/**
 * StampCard — the between-level popup (Tyler picked "The Stamp", 2026-09-03,
 * from /test/revenge-popups; "we don't need the stupid quote").
 *
 * One design for both moments: the level number slams down like a gold seal
 * with a shock ring, then a red ink stamp (CLEARED / CAPTURED) hits at an
 * angle, and the 10 progress pips fill one by one. Arena palette, no quip.
 * Ease-out-expo only; reduced motion collapses to a fade.
 */

export const STAMP_NAVY = '#0f1c3f';
const PANEL_EDGE = '#3a4f8f';
const GOLD = '#FFC800';
const INK = '#FF3B30';
const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const STAMP_OUTLINE: CSSProperties = { color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.45), -1px 0 0 rgba(0,0,0,0.35), 1px 0 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(0,0,0,0.35)' };
const GOLD_TEXT: CSSProperties = { color: GOLD, textShadow: '0 3px 0 rgba(0,0,0,0.5)' };
const CARD: CSSProperties = {
  background: `linear-gradient(180deg,#1c2f63 0%,${STAMP_NAVY} 100%)`,
  border: `3px solid ${PANEL_EDGE}`,
  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.18), inset 0 -5px 0 rgba(0,0,0,0.4), 0 20px 50px rgba(0,0,0,0.6)',
};

interface StampCardProps {
  /** Kicker above the number, e.g. "The Fortress · level 4". */
  kicker: string;
  /** The big number that slams in. */
  level: number;
  totalLevels: number;
  /** The ink stamp text. */
  stamp: string;
  /** 'won' = gold number, pips filled through `level`. 'lost' = ghost number, red pip AT `level`, screen shake. */
  tone: 'won' | 'lost';
  /** Small info chips under the pips (difficulty, retries). Optional, never a quote. */
  chips?: ReactNode;
  children: ReactNode;
  testId?: string;
}

export function StampCard({ kicker, level, totalLevels, stamp, tone, chips, children, testId }: StampCardProps) {
  const won = tone === 'won';
  const filled = won ? level : level - 1;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 rr-stamp-fade ${won ? '' : 'rr-stamp-shake'}`} style={{ background: 'rgba(0,0,0,0.5)' }}>
      <style>{`
        .rr-stamp-fade { animation: rrStampFade 220ms ease-out both; }
        @keyframes rrStampFade { from { opacity: 0; } to { opacity: 1; } }
        .rr-stamp-card { animation: rrStampCard 420ms ${EXPO} both; }
        @keyframes rrStampCard { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: none; } }
        .rr-stamp-slam { animation: rrStampSlam 360ms ${EXPO} 250ms both; }
        @keyframes rrStampSlam { from { opacity: 0; transform: scale(2.4); } to { opacity: 1; transform: scale(1); } }
        .rr-stamp-ring { animation: rrStampRing 600ms ${EXPO} 380ms both; }
        @keyframes rrStampRing { from { opacity: 0.9; transform: scale(0.6); } to { opacity: 0; transform: scale(1.8); } }
        .rr-stamp-ink { animation: rrStampInk 220ms ${EXPO} 620ms both; }
        @keyframes rrStampInk { from { opacity: 0; transform: rotate(-10deg) scale(2); } to { opacity: 1; transform: rotate(-10deg) scale(1); } }
        .rr-stamp-pip { animation: rrStampPip 240ms ${EXPO} both; animation-delay: calc(700ms + var(--i, 0) * 45ms); }
        @keyframes rrStampPip { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
        .rr-stamp-rise { animation: rrStampRise 380ms ${EXPO} both; }
        @keyframes rrStampRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .rr-stamp-shake { animation: rrStampFade 220ms ease-out both, rrStampShake 420ms ease-out 200ms both; }
        @keyframes rrStampShake { 0%,100% { transform: none; } 20% { transform: translate(-6px, 2px); } 40% { transform: translate(5px, -2px); } 60% { transform: translate(-3px, 1px); } 80% { transform: translate(2px, 0); } }
        .rr-stamp-press { transition: transform 80ms ease-out, box-shadow 80ms ease-out; }
        .rr-stamp-press:active { transform: translateY(5px); box-shadow: 0 0 0 transparent !important; }
        @media (prefers-reduced-motion: reduce) {
          .rr-stamp-card, .rr-stamp-slam, .rr-stamp-ink, .rr-stamp-pip, .rr-stamp-rise { animation: rrStampFade 200ms ease-out both; }
          .rr-stamp-ring { display: none; }
          .rr-stamp-shake { animation: rrStampFade 200ms ease-out both; }
        }
      `}</style>

      <div className="rr-stamp-card relative w-full max-w-sm rounded-[24px] p-6 text-center overflow-y-auto overscroll-contain text-white" style={{ ...CARD, maxHeight: 'calc(100dvh - 3rem)' }} data-testid={testId}>
        <div className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.55)' }}>{kicker}</div>

        <div className="relative mt-3 h-[150px] flex items-center justify-center">
          <div className="rr-stamp-ring absolute rounded-full" style={{ width: 150, height: 150, border: `4px solid ${won ? GOLD : '#FF6B66'}` }} />
          <div className="rr-stamp-slam text-[132px] leading-none font-black tabular-nums" style={won ? GOLD_TEXT : { ...GOLD_TEXT, color: 'rgba(255,255,255,0.28)' }}>{level}</div>
          <div
            className="rr-stamp-ink absolute px-4 py-1.5 rounded-lg font-black uppercase tracking-[0.06em] whitespace-nowrap"
            style={{ fontSize: stamp.length > 9 ? 22 : 34, border: `5px solid ${INK}`, color: INK, transform: 'rotate(-10deg)', background: 'rgba(15,28,63,0.75)', mixBlendMode: 'screen' }}
          >
            {stamp}
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-1.5" aria-label={`Level ${level} of ${totalLevels}`}>
          {Array.from({ length: totalLevels }).map((_, i) => {
            const done = i < filled;
            const here = !won && i === level - 1;
            return (
              <span
                key={i}
                className="rr-stamp-pip w-4 h-4 rounded-full"
                style={{ ['--i' as string]: i, background: done ? GOLD : here ? INK : 'rgba(255,255,255,0.14)', boxShadow: done ? '0 0 8px rgba(255,200,0,0.6)' : here ? '0 0 8px rgba(255,59,48,0.6)' : undefined }}
              />
            );
          })}
        </div>

        {chips && (
          <div className="rr-stamp-rise mt-4 flex items-center justify-center gap-1.5" style={{ animationDelay: '750ms' }}>
            {chips}
          </div>
        )}

        <div className="rr-stamp-rise mt-5 flex flex-col gap-2" style={{ animationDelay: '850ms' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Chess Path button: flat face, hard bottom shadow, presses flat. */
export function StampButton({ children, color, shadow, onClick, testId }: { children: ReactNode; color: string; shadow: string; onClick: () => void; testId?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className="rr-stamp-press w-full rounded-[16px] font-black flex items-center justify-center min-h-[54px] text-[18px] uppercase tracking-[0.04em]"
      style={{ background: color, color: '#fff', boxShadow: `0 6px 0 ${shadow}` }}
    >
      <span style={STAMP_OUTLINE}>{children}</span>
    </button>
  );
}

export function StampChip({ children, gold = false }: { children: ReactNode; gold?: boolean }) {
  return (
    <span
      className="rounded-md px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] tabular-nums"
      style={gold ? { background: 'rgba(255,200,0,0.15)', ...GOLD_TEXT } : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}
    >
      {children}
    </span>
  );
}
