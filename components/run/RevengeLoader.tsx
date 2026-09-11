'use client';

import { useEffect, useState } from 'react';
import { ROOK_BLOCKS, lighten, darken } from '@/lib/daily-rook-blocks';
import { REVENGE_CRIMSON, REVENGE_CRIMSON_DEEP } from '@/lib/brand';
import { MARK_RADIUS, MARK_ROOK_H } from '@/components/run/RookiesRevengeLogo';

/**
 * RevengeLoader — the Rookie's Revenge mark, alive.
 *
 * Same geometry as `RevengeMarkSvg` (never redraw the mark): a frame at t=0 is
 * pixel-identical to the static logo / native launch image. Then Rookie does
 * one of several things, picked at random per mount (or forced via `animation`):
 *
 *   breathe — staggered brightness wave, bottom to top (the calm default)
 *   build   — blocks pop in from the base up, hold, repeat
 *   hop     — the whole rook hops with squash & stretch
 *   wave    — a side-to-side ripple runs across the columns
 *   rattle  — sore-loser: she sits still, then shakes it off
 *   shimmer — a light sweep passes over the tile
 *
 * Pure CSS keyframes, no JS timers. Used by NativeSplash and app/loading.tsx.
 */

export type LoaderAnimation = 'breathe' | 'build' | 'hop' | 'wave' | 'rattle' | 'shimmer';
export const LOADER_ANIMATIONS: LoaderAnimation[] = ['breathe', 'build', 'hop', 'wave', 'rattle', 'shimmer'];

const COLS = 5;
const ROWS = 6;
const VB = 200;
const C = VB / 2;

export function RevengeLoader({ size = 160, className, label = 'Loading', animation }: {
  size?: number; ringColor?: string; className?: string; label?: string;
  /** Force one animation; omit for a random pick per mount. */
  animation?: LoaderAnimation;
}) {
  // Start calm on the server render, roll the dice after mount (no hydration mismatch).
  const [anim, setAnim] = useState<LoaderAnimation>(animation ?? 'breathe');
  useEffect(() => {
    if (animation) { setAnim(animation); return; }
    setAnim(LOADER_ANIMATIONS[Math.floor(Math.random() * LOADER_ANIMATIONS.length)]);
  }, [animation]);

  const block = MARK_ROOK_H / (ROWS + (ROWS - 1) * 0.15);
  const gap = block * 0.15;
  const rookW = COLS * block + (COLS - 1) * gap;
  const x0 = C - rookW / 2;
  const y0 = C - MARK_ROOK_H / 2;
  const baseY = y0 + MARK_ROOK_H; // rook's feet — hop/rattle pivot

  const blockDelay = (b: { x: number; y: number }) => {
    switch (anim) {
      case 'build':   return `${(ROWS - 1 - b.y) * 140 + b.x * 30}ms`;
      case 'wave':    return `${b.x * 120}ms`;
      case 'breathe': return `${(ROWS - 1 - b.y) * 110 + b.x * 25}ms`;
      default:        return '0ms';
    }
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`} className={className} role="img" aria-label={label} data-anim={anim}>
      <title>{label}</title>
      <style>{`
        @keyframes rvBreathe {
          0%, 100% { filter: brightness(1); transform: translateY(0); }
          50%      { filter: brightness(1.22); transform: translateY(-1.2px); }
        }
        @keyframes rvBuild {
          0%        { transform: scale(0); opacity: 0; }
          10%       { transform: scale(1.18); opacity: 1; }
          16%, 78%  { transform: scale(1); opacity: 1; }
          88%, 100% { transform: scale(0); opacity: 0; }
        }
        @keyframes rvHop {
          0%, 100% { transform: translateY(0) scale(1, 1); }
          12%      { transform: translateY(0) scale(1.08, 0.88); }
          38%      { transform: translateY(-16px) scale(0.96, 1.06); }
          58%      { transform: translateY(0) scale(1.06, 0.9); }
          72%      { transform: translateY(0) scale(1, 1); }
        }
        @keyframes rvWave {
          0%, 100% { transform: translateY(0); }
          30%      { transform: translateY(-5px); }
          60%      { transform: translateY(0); }
        }
        @keyframes rvRattle {
          0%, 55%, 100% { transform: translateX(0) rotate(0); }
          60%  { transform: translateX(-3px) rotate(-2deg); }
          65%  { transform: translateX(3px) rotate(2deg); }
          70%  { transform: translateX(-3px) rotate(-1.5deg); }
          75%  { transform: translateX(3px) rotate(1.5deg); }
          80%  { transform: translateX(-2px) rotate(-1deg); }
          85%  { transform: translateX(2px) rotate(1deg); }
          90%  { transform: translateX(0) rotate(0); }
        }
        @keyframes rvShimmer { from { transform: translateX(-260px); } to { transform: translateX(260px); } }
        .rv-b { transform-box: fill-box; transform-origin: center; }
        .rv-group { transform-box: fill-box; transform-origin: 50% 100%; }
        [data-anim="breathe"] .rv-b { animation: rvBreathe 1.6s ease-in-out infinite; }
        [data-anim="build"]   .rv-b { animation: rvBuild 2.6s ease-out infinite; }
        [data-anim="wave"]    .rv-b { animation: rvWave 1.4s ease-in-out infinite; }
        [data-anim="hop"]     .rv-group { animation: rvHop 1.5s cubic-bezier(.3,.7,.4,1) infinite; }
        [data-anim="rattle"]  .rv-group { animation: rvRattle 2.4s ease-in-out infinite; }
        .rv-shimmer { animation: rvShimmer 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rv-b, .rv-group, .rv-shimmer { animation: none !important; }
        }
      `}</style>
      <defs>
        <linearGradient id="rvl-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={REVENGE_CRIMSON} />
          <stop offset="100%" stopColor={REVENGE_CRIMSON_DEEP} />
        </linearGradient>
        <linearGradient id="rvl-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="rvl-clip"><rect x={0} y={0} width={VB} height={VB} rx={MARK_RADIUS} /></clipPath>
        {ROOK_BLOCKS.map((b) => (
          <linearGradient key={`g-${b.x}-${b.y}`} id={`rvl-${b.x}${b.y}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lighten(b.color, 18)} />
            <stop offset="20%" stopColor={lighten(b.color, 12)} />
            <stop offset="40%" stopColor={b.color} />
            <stop offset="100%" stopColor={darken(b.color, 12)} />
          </linearGradient>
        ))}
      </defs>

      <rect x={0} y={0} width={VB} height={VB} rx={MARK_RADIUS} fill="url(#rvl-tile)" />

      <g className="rv-group" style={{ transformOrigin: `${C}px ${baseY}px` }}>
        {ROOK_BLOCKS.map((b) => (
          <rect
            key={`${b.x}-${b.y}`}
            className="rv-b"
            style={{ animationDelay: blockDelay(b) }}
            x={x0 + b.x * (block + gap)}
            y={y0 + b.y * (block + gap)}
            width={block}
            height={block}
            rx={block * 0.14}
            fill={`url(#rvl-${b.x}${b.y})`}
          />
        ))}
      </g>

      {anim === 'shimmer' && (
        <g clipPath="url(#rvl-clip)">
          <rect className="rv-shimmer" x={0} y={-40} width={90} height={VB + 80} fill="url(#rvl-sheen)" transform="skewX(-18)" />
        </g>
      )}
    </svg>
  );
}
