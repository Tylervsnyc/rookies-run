'use client';

import { useEffect } from 'react';
import { ABILITY_DEFS, blurbDetailForTier, type AbilityId } from '@/lib/run/abilities';
import { abilityUnlockedBy } from '@/lib/run/achievements';
import { AbilityCardFull, preloadAbilityArt } from './AbilityCard';

interface Props {
  abilityId: AbilityId | undefined;
  onClose: () => void;
}

const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
const SPARKS = 14;

/**
 * "New ability unlocked" reveal — the real card, as big as the phone allows,
 * with the achievement that earned it. After this the ability shows up in
 * offers.
 *
 * Reveal timeline (~1.15s, ease-out-expo, no bounce):
 *   0ms    backdrop + a gold glow swells at center
 *   120ms  the card flips in from the glow and scales up to full size
 *   420ms  burst: a ring expands and 14 sparks fly out behind the card
 *   560ms  "New ability unlocked" eyebrow rises
 *   760ms  the name slams in (short beat after the card lands)
 *   900ms  "Earned with …" + button rise
 * prefers-reduced-motion collapses everything to a 200ms fade, no burst.
 *
 * Sizing: the modal root is a size container, so the card is measured in
 * cq units — it fills the viewport in the app and the phone frame on
 * /test/revenge-popups. Fits 360x667 without scrolling.
 */
export function AbilityUnlockModal({ abilityId, onClose }: Props) {
  useEffect(() => {
    if (abilityId) preloadAbilityArt([abilityId]);
  }, [abilityId]);

  if (!abilityId) return null;
  const def = ABILITY_DEFS[abilityId];
  const via = abilityUnlockedBy(abilityId);

  return (
    <>
      <style>{`
        .rru-bg { animation: rruFade 220ms ease-out both; }
        .rru-glow { animation: rruGlow 700ms ${EXPO} both; }
        .rru-card { animation: rruCard 640ms ${EXPO} 120ms both; }
        .rru-ring { animation: rruRing 560ms ${EXPO} 420ms both; }
        .rru-spark { animation: rruSpark 600ms ${EXPO} both; animation-delay: calc(420ms + var(--i, 0) * 10ms); }
        .rru-eyebrow { animation: rruRise 360ms ${EXPO} 560ms both; }
        .rru-name { animation: rruSlam 360ms ${EXPO} 760ms both; }
        .rru-foot { animation: rruRise 280ms ${EXPO} 900ms both; }
        @keyframes rruFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rruGlow { from { opacity: 0; transform: translate(-50%, -50%) scale(0.2); } 60% { opacity: 1; } to { opacity: 0.55; transform: translate(-50%, -50%) scale(1); } }
        @keyframes rruCard { from { opacity: 0; transform: perspective(1200px) rotateY(80deg) scale(0.35); } 30% { opacity: 1; } to { opacity: 1; transform: perspective(1200px) rotateY(0deg) scale(1); } }
        @keyframes rruRing { from { opacity: 0.9; transform: translate(-50%, -50%) scale(0.5); } to { opacity: 0; transform: translate(-50%, -50%) scale(2.2); } }
        @keyframes rruSpark { from { opacity: 1; transform: rotate(var(--a)) translateX(0) scale(1.3); } to { opacity: 0; transform: rotate(var(--a)) translateX(var(--d)) scale(0.2); } }
        @keyframes rruRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes rruSlam { from { opacity: 0; transform: scale(1.7); } to { opacity: 1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .rru-bg, .rru-glow, .rru-card, .rru-eyebrow, .rru-name, .rru-foot { animation: rruFade 200ms ease-out both !important; }
          .rru-ring, .rru-spark { display: none; }
        }
      `}</style>
      <div
        className="rru-bg fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#0b1620]/88 backdrop-blur-sm"
        style={{
          containerType: 'size',
          padding: '16px 20px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
        onClick={onClose}
      >
        {/* Slow gold rays — ambient, behind everything. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 w-[140vmax] h-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-30"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0 20deg, #f5cf5a 20deg 24deg, transparent 24deg 60deg, #f5cf5a 60deg 64deg, transparent 64deg 100deg, #f5cf5a 100deg 104deg, transparent 104deg 140deg, #f5cf5a 140deg 144deg, transparent 144deg 180deg, #f5cf5a 180deg 184deg, transparent 184deg 220deg, #f5cf5a 220deg 224deg, transparent 224deg 260deg, #f5cf5a 260deg 264deg, transparent 264deg 300deg, #f5cf5a 300deg 304deg, transparent 304deg 340deg, #f5cf5a 340deg 344deg, transparent 344deg 360deg)',
            animation: 'rruRays 40s linear infinite',
            maskImage: 'radial-gradient(circle, black 0%, transparent 60%)',
            WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 60%)',
          }}
        />
        <style>{`@keyframes rruRays { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }`}</style>

        {/* Glow the card is born from. */}
        <div
          aria-hidden
          className="rru-glow pointer-events-none absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 'min(120cqw, 80cqh)',
            height: 'min(120cqw, 80cqh)',
            background: 'radial-gradient(circle, rgba(255,214,90,0.7) 0%, rgba(255,190,40,0.25) 35%, transparent 65%)',
          }}
        />
        {/* Burst ring + sparks. */}
        <div
          aria-hidden
          className="rru-ring pointer-events-none absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 'min(70cqw, 40cqh)',
            height: 'min(70cqw, 40cqh)',
            border: '4px solid #ffd65a',
            boxShadow: '0 0 24px rgba(255,214,90,0.8), inset 0 0 24px rgba(255,214,90,0.5)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
          {Array.from({ length: SPARKS }, (_, i) => (
            <span
              key={i}
              className="rru-spark absolute rounded-full"
              style={{
                ['--i' as string]: i,
                ['--a' as string]: `${(360 / SPARKS) * i + (i % 2 ? 9 : -6)}deg`,
                ['--d' as string]: i % 3 === 0 ? '46cqw' : i % 3 === 1 ? '38cqw' : '30cqw',
                width: i % 2 ? 10 : 7,
                height: i % 2 ? 10 : 7,
                marginLeft: i % 2 ? -5 : -3.5,
                marginTop: i % 2 ? -5 : -3.5,
                background: i % 2 ? '#ffd65a' : '#fff4c2',
                boxShadow: '0 0 10px rgba(255,214,90,0.9)',
                transformOrigin: 'center',
              }}
            />
          ))}
        </div>

        <div
          className="relative flex flex-col items-center"
          style={{ width: 'var(--rr-card-w)', ['--rr-card-w' as string]: 'min(100cqw, (100cqh - 200px) * 0.714, 420px)', gap: 12 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center w-full" style={{ minHeight: 58 }}>
            <div className="rru-eyebrow text-[11px] uppercase tracking-[0.28em] font-black text-amber-300">
              New ability unlocked
            </div>
            <h2
              className="rru-name font-black text-white leading-none mt-1 truncate"
              style={{ fontSize: 'clamp(26px, 10cqw, 40px)', textShadow: '0 3px 0 rgba(0,0,0,0.45), 0 0 24px rgba(255,214,90,0.35)' }}
            >
              {def.name}
            </h2>
          </div>

          <div className="rru-card w-full" style={{ transformOrigin: '50% 50%' }}>
            <AbilityCardFull
              id={abilityId}
              tier={1}
              description={blurbDetailForTier(abilityId, 1)}
              onClick={onClose}
            />
          </div>

          <div className="rru-foot w-full flex flex-col items-center" style={{ gap: 10 }}>
            <div className="text-center px-2" style={{ minHeight: 34 }}>
              {via && (
                <p className="text-[13px] text-amber-100/90 font-semibold leading-snug">
                  Earned with <span className="text-amber-300 font-black">{via.name}</span>
                </p>
              )}
              <p className="text-[12px] text-white/70 leading-snug">
                It can show up in your next offer.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[50px] py-3 rounded-2xl bg-amber-400 text-[#2A3C45] font-black text-[15px] tracking-wide active:translate-y-px transition-transform"
              style={{ boxShadow: '0 4px 0 #b98a1a, 0 6px 12px rgba(0,0,0,0.3)' }}
            >
              Good. Very good.
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
