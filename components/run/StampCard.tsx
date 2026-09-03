'use client';

import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { playCorrectSound } from '@/lib/sounds';

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
/** Ease-out with a slight overshoot — the stars pop past 1× then settle. */
const POP = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
/** Stars start after the pips finish filling (700ms + 10 × 45ms ≈ 1.15s). */
export const STAR_START_MS = 1200;
export const STAR_GAP_MS = 350;
/** Chromatic-scale steps for the per-star ding (major triad, ascending). */
const STAR_NOTES = [12, 16, 19];
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
  /** Run stars (lib/run/scoring starsForRun). When set, three star slots render between the pips and the chips. */
  stars?: 0 | 1 | 2 | 3;
  /** One-line rule under the stars, e.g. "No retries · 32 moves, par 35". */
  starLine?: string;
  children: ReactNode;
  testId?: string;
}

export function StampCard({ kicker, level, totalLevels, stamp, tone, chips, stars, starLine, children, testId }: StampCardProps) {
  const won = tone === 'won';
  const filled = won ? level : level - 1;
  const showStars = stars !== undefined;
  // Chip / button rise waits for the stars when they're on the card.
  const afterStars = showStars ? STAR_START_MS + STAR_GAP_MS * Math.max(1, stars) : 0;
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
        .rr-stamp-star { opacity: 0.25; }
        .rr-stamp-star-fill { opacity: 0; transform: scale(0.2); animation: rrStampStar 220ms ${POP} both; animation-delay: calc(${STAR_START_MS}ms + var(--i, 0) * ${STAR_GAP_MS}ms); }
        @keyframes rrStampStar { from { opacity: 0; transform: scale(0.2); } to { opacity: 1; transform: scale(1); } }
        .rr-stamp-star-ring { animation: rrStampRing 520ms ${EXPO} both; animation-delay: calc(${STAR_START_MS}ms + var(--i, 0) * ${STAR_GAP_MS}ms); }
        .rr-stamp-shake { animation: rrStampFade 220ms ease-out both, rrStampShake 420ms ease-out 200ms both; }
        @keyframes rrStampShake { 0%,100% { transform: none; } 20% { transform: translate(-6px, 2px); } 40% { transform: translate(5px, -2px); } 60% { transform: translate(-3px, 1px); } 80% { transform: translate(2px, 0); } }
        .rr-stamp-press { transition: transform 80ms ease-out, box-shadow 80ms ease-out; }
        .rr-stamp-press:active { transform: translateY(5px); box-shadow: 0 0 0 transparent !important; }
        @media (prefers-reduced-motion: reduce) {
          .rr-stamp-card, .rr-stamp-slam, .rr-stamp-ink, .rr-stamp-pip, .rr-stamp-rise { animation: rrStampFade 200ms ease-out both; }
          .rr-stamp-ring, .rr-stamp-star-ring { display: none; }
          .rr-stamp-star-fill { animation: rrStampFade 300ms ease-out 200ms both; transform: none; }
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

        {showStars && <StampStars stars={stars} line={starLine} />}

        {chips && (
          <div className="rr-stamp-rise mt-4 flex items-center justify-center gap-1.5" style={{ animationDelay: `${750 + afterStars}ms` }}>
            {chips}
          </div>
        )}

        <div className="rr-stamp-rise mt-5 flex flex-col gap-2" style={{ animationDelay: `${850 + afterStars}ms` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const STAR_PATH = 'M12 2.5l2.95 6.2 6.8.85-5 4.7 1.3 6.75L12 17.7 5.95 21l1.3-6.75-5-4.7 6.8-.85z';

function StarGlyph({ fill, stroke, size = 40 }: { fill: string; stroke: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="block">
      <path d={STAR_PATH} fill={fill} stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Three star slots. Every slot draws a hollow outline at 25% white; earned
 * stars pop in gold one at a time (220ms each, 350ms apart, after the pips)
 * with a shock ring and an ascending ding. Unearned slots stay hollow so a
 * 1-star finish visibly leaves two holes.
 */
function StampStars({ stars, line }: { stars: 0 | 1 | 2 | 3; line?: string }) {
  useEffect(() => {
    if (stars === 0) return;
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < stars; i++) {
      const at = reduced ? 200 : STAR_START_MS + STAR_GAP_MS * i;
      timers.push(setTimeout(() => playCorrectSound(STAR_NOTES[i] ?? 12, 0), at));
    }
    return () => timers.forEach(clearTimeout);
  }, [stars]);

  return (
    <div className="mt-4" data-testid="stamp-stars" aria-label={`${stars} of 3 stars`}>
      <div className="flex justify-center gap-3">
        {[0, 1, 2].map((i) => {
          const earned = i < stars;
          return (
            <div key={i} className="relative" style={{ width: 40, height: 40 }}>
              <div className="rr-stamp-star absolute inset-0">
                <StarGlyph fill="none" stroke="#fff" />
              </div>
              {earned && (
                <>
                  <div className="rr-stamp-star-ring absolute rounded-full" style={{ ['--i' as string]: i, inset: -4, border: `3px solid ${GOLD}` }} />
                  <div className="rr-stamp-star-fill absolute inset-0" style={{ ['--i' as string]: i, filter: 'drop-shadow(0 2px 0 rgba(0,0,0,0.45)) drop-shadow(0 0 8px rgba(255,200,0,0.55))' }}>
                    <StarGlyph fill={GOLD} stroke="#c9960a" />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {line && (
        <div className="rr-stamp-rise mt-2 text-[11px] font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.6)', animationDelay: `${STAR_START_MS + STAR_GAP_MS * Math.max(1, stars)}ms` }}>
          {line}
        </div>
      )}
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
