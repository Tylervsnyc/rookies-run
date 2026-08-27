'use client';

import { ROOK_BLOCKS, lighten, darken } from '@/lib/daily-rook-blocks';
import { REVENGE_RED } from '@/components/run/RookiesRevengeLogo';

/**
 * RevengeLoader — the Rookie's Revenge mark, alive.
 *
 * Same geometry as `RevengeMarkSvg` (never redraw the mark), so a frame at
 * t=0 is pixel-identical to the static logo / native launch image. Then:
 *   - the reticle ticks + outer ring sweep slowly, like a scope locking on
 *   - the inner ring pulses out and fades (a sonar ping)
 *   - the 22 rook blocks breathe in a staggered wave, bottom to top
 *   - the center dot blinks
 *
 * Pure CSS keyframes, no JS timers. Used by NativeSplash and app/loading.tsx.
 */

const COLS = 5;
const ROWS = 6;
const VB = 200;
const C = VB / 2;
const STROKE = 4.5;
const R_OUTER = C - STROKE * 1.5;
const R_INNER = R_OUTER * 0.68;
const TICK = VB * 0.09;
const ROOK_H = VB * 0.56;

export function RevengeLoader({ size = 160, ringColor = REVENGE_RED, className, label = 'Loading' }: {
  size?: number; ringColor?: string; className?: string; label?: string;
}) {
  const block = ROOK_H / (ROWS + (ROWS - 1) * (3 / 22));
  const gap = block * (3 / 22);
  const rookW = COLS * block + (COLS - 1) * gap;
  const x0 = C - rookW / 2;
  const y0 = C - ROOK_H / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`} className={className} role="img" aria-label={label}>
      <title>{label}</title>
      <style>{`
        @keyframes rvLoaderSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rvLoaderPing {
          0%   { transform: scale(0.72); opacity: 0.9; }
          70%  { transform: scale(1.02); opacity: 0.15; }
          100% { transform: scale(1.02); opacity: 0; }
        }
        @keyframes rvLoaderBreathe {
          0%, 100% { filter: brightness(1); transform: translateY(0); }
          50%      { filter: brightness(1.22); transform: translateY(-1.2px); }
        }
        @keyframes rvLoaderBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .rv-sweep { transform-origin: ${C}px ${C}px; animation: rvLoaderSweep 6s linear infinite; }
        .rv-ping  { transform-origin: ${C}px ${C}px; animation: rvLoaderPing 1.8s ease-out infinite; }
        .rv-block { animation: rvLoaderBreathe 1.6s ease-in-out infinite; }
        .rv-dot   { animation: rvLoaderBlink 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rv-sweep, .rv-ping, .rv-block, .rv-dot { animation: none; }
        }
      `}</style>
      <defs>
        {ROOK_BLOCKS.map((b) => (
          <linearGradient key={`g-${b.x}-${b.y}`} id={`rvl-${b.x}${b.y}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lighten(b.color, 18)} />
            <stop offset="20%" stopColor={lighten(b.color, 12)} />
            <stop offset="40%" stopColor={b.color} />
            <stop offset="100%" stopColor={darken(b.color, 12)} />
          </linearGradient>
        ))}
      </defs>

      {/* rook — staggered wave from the bottom row up */}
      {ROOK_BLOCKS.map((b) => (
        <rect
          key={`${b.x}-${b.y}`}
          className="rv-block"
          style={{ animationDelay: `${(ROWS - 1 - b.y) * 110 + b.x * 25}ms` }}
          x={x0 + b.x * (block + gap)}
          y={y0 + b.y * (block + gap)}
          width={block}
          height={block}
          rx={block * 0.09}
          fill={`url(#rvl-${b.x}${b.y})`}
          stroke="rgba(0,0,0,0.15)"
          strokeWidth={0.6}
        />
      ))}

      {/* reticle: outer ring + ticks sweep together */}
      <g className="rv-sweep">
        <circle cx={C} cy={C} r={R_OUTER} fill="none" stroke={ringColor} strokeWidth={STROKE * 1.4} />
        {[0, 90, 180, 270].map((deg) => (
          <line key={deg} x1={C} y1={0} x2={C} y2={TICK} stroke={ringColor} strokeWidth={STROKE * 1.4} transform={`rotate(${deg} ${C} ${C})`} />
        ))}
      </g>
      {/* inner ring: static faint + an expanding ping */}
      <circle cx={C} cy={C} r={R_INNER} fill="none" stroke={ringColor} strokeWidth={STROKE * 0.9} opacity={0.55} />
      <circle className="rv-ping" cx={C} cy={C} r={R_INNER} fill="none" stroke={ringColor} strokeWidth={STROKE * 0.9} />
      <circle className="rv-dot" cx={C} cy={C} r={VB * 0.035} fill={ringColor} />
    </svg>
  );
}
