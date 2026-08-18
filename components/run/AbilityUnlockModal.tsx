'use client';

import { useEffect } from 'react';
import { ABILITY_DEFS, blurbDetailForTier, type AbilityId } from '@/lib/run/abilities';
import { abilityUnlockedBy } from '@/lib/run/achievements';
import { AbilityCardFull, preloadAbilityArt } from './AbilityCard';

interface Props {
  abilityId: AbilityId | undefined;
  onClose: () => void;
}

/**
 * "New ability unlocked" reveal — the real card flips in once, with the
 * achievement that earned it. After this the ability shows up in offers.
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
        @keyframes rrUnlockBg { from { opacity: 0 } to { opacity: 1 } }
        @keyframes rrUnlockCard {
          0%   { opacity: 0; transform: perspective(900px) rotateY(90deg) scale(0.9); }
          100% { opacity: 1; transform: perspective(900px) rotateY(0deg) scale(1); }
        }
        @keyframes rrUnlockText {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes rrUnlockRays { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0b1620]/85 backdrop-blur-sm px-4"
        style={{ animation: 'rrUnlockBg 0.25s ease-out backwards' }}
        onClick={onClose}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 w-[140vmax] h-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-30"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0 20deg, #f5cf5a 20deg 24deg, transparent 24deg 60deg, #f5cf5a 60deg 64deg, transparent 64deg 100deg, #f5cf5a 100deg 104deg, transparent 104deg 140deg, #f5cf5a 140deg 144deg, transparent 144deg 180deg, #f5cf5a 180deg 184deg, transparent 184deg 220deg, #f5cf5a 220deg 224deg, transparent 224deg 260deg, #f5cf5a 260deg 264deg, transparent 264deg 300deg, #f5cf5a 300deg 304deg, transparent 304deg 340deg, #f5cf5a 340deg 344deg, transparent 344deg 360deg)',
            animation: 'rrUnlockRays 40s linear infinite',
            maskImage: 'radial-gradient(circle, black 0%, transparent 60%)',
            WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 60%)',
          }}
        />
        <div
          className="relative w-full max-w-xs flex flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center" style={{ animation: 'rrUnlockText 0.4s ease-out 0.15s backwards' }}>
            <div className="text-[10px] uppercase tracking-[0.28em] font-black text-amber-300">
              New ability unlocked
            </div>
            <h2 className="text-2xl font-black text-white leading-tight mt-0.5">{def.name}</h2>
          </div>

          <div
            className="w-[200px]"
            style={{ animation: 'rrUnlockCard 0.6s cubic-bezier(.16,1,.3,1) 0.1s backwards' }}
          >
            <AbilityCardFull
              id={abilityId}
              tier={1}
              description={blurbDetailForTier(abilityId, 1)}
              onClick={onClose}
            />
          </div>

          <div
            className="text-center px-2"
            style={{ animation: 'rrUnlockText 0.4s ease-out 0.5s backwards' }}
          >
            {via && (
              <p className="text-[12px] text-amber-100/90 font-semibold leading-snug">
                Earned with <span className="text-amber-300 font-black">{via.name}</span>
              </p>
            )}
            <p className="text-[12px] text-white/70 leading-snug mt-1">
              It can show up in your next offer.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-1 w-full py-3 rounded-2xl bg-amber-400 text-[#2A3C45] font-black text-[14px] tracking-wide active:translate-y-px transition-transform"
            style={{ boxShadow: '0 4px 0 #b98a1a, 0 6px 12px rgba(0,0,0,0.3)' }}
          >
            Good. Very good.
          </button>
        </div>
      </div>
    </>
  );
}
