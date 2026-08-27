'use client';

import { BreathingRook } from '@/components/ui/BreathingRook';
import { REVENGE_RED, RevengeReticleSvg } from '@/components/run/RookiesRevengeLogo';

/**
 * RevengeLockOn — the hero of the tutorial's closing card. A big breathing
 * Rookie, and the red reticle from the mark HUNTING for her (gun-barrel
 * intro style): it sweeps the card in two smooth arcs, snaps onto her, and
 * locks with a scale-pulse + tick flash. Plays once (~2.5s) on mount, pure
 * CSS keyframes. Reduced motion: the locked state.
 */

const ROOK_W = 200; // BreathingRook xl: 5*36 + 4*5
const ROOK_H = 241; // 6*36 + 5*5
const STAGE_H = 250;
const RETICLE = STAGE_H; // the ring's ticks touch the stage edges, never clip
const ROOK_SCALE = (STAGE_H * 0.64) / ROOK_H; // rook ≈ 64% of the ring, like the mark

export function RevengeLockOn() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: STAGE_H }}
      aria-label="Rookie, locked on"
      role="img"
    >
      <style>{`
        @keyframes rrLockHunt {
          0%   { transform: translate(-110px, -70px) scale(1.15); opacity: 0; }
          8%   { opacity: 1; }
          30%  { transform: translate(100px, -40px) scale(1.1); }
          55%  { transform: translate(-80px, 55px) scale(1.05); }
          72%  { transform: translate(50px, 15px) scale(1.02); }
          82%  { transform: translate(0, 0) scale(1); }
          88%  { transform: translate(0, 0) scale(1.14); }
          94%  { transform: translate(0, 0) scale(0.97); }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes rrLockFlash {
          0%, 82% { opacity: 0; }
          86%     { opacity: 1; }
          92%     { opacity: 0; }
          96%     { opacity: 0.7; }
          100%    { opacity: 0; }
        }
        .rr-lock-reticle {
          animation: rrLockHunt 2500ms cubic-bezier(0.45, 0.05, 0.3, 1) both;
          will-change: transform;
        }
        .rr-lock-flash {
          animation: rrLockFlash 2500ms linear both;
        }
        @media (prefers-reduced-motion: reduce) {
          .rr-lock-reticle { animation: none; transform: none; opacity: 1; }
          .rr-lock-flash { animation: none; opacity: 0; }
        }
      `}</style>

      {/* Rookie, centered */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          width: ROOK_W,
          height: ROOK_H,
          transform: `translate(-50%, -50%) scale(${ROOK_SCALE.toFixed(3)})`,
          transformOrigin: 'center',
        }}
      >
        <BreathingRook size="xl" animate />
      </div>

      {/* The reticle, hunting then locked on her */}
      <div
        className="absolute rr-lock-reticle"
        style={{
          left: '50%',
          top: '50%',
          width: RETICLE,
          height: RETICLE,
          marginLeft: -RETICLE / 2,
          marginTop: -RETICLE / 2,
          pointerEvents: 'none',
        }}
      >
        <RevengeReticleSvg size={RETICLE} style={{ display: 'block' }} />
        {/* lock flash: the ring blinks bright once as it snaps on */}
        <div
          className="absolute inset-0 rounded-full rr-lock-flash"
          style={{
            boxShadow: `inset 0 0 0 10px ${REVENGE_RED}, 0 0 28px 6px rgba(229,57,53,0.55)`,
            margin: 16,
          }}
        />
      </div>
    </div>
  );
}
