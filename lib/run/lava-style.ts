/**
 * Pure style helpers for lava hazard squares — shared by the live Board
 * (client) and the static replay/admin boards (server-safe). Story + design
 * notes live in components/run/LavaHazards.tsx.
 */

import type { CSSProperties } from 'react';

export const LAVA_SRC = '/hazards/lava-mario-seamless.webp';
/** One painted tile spans this many squares. */
export const TILE_SQUARES = 1.75;
/** Fallback colour under the image while it loads (the tile's mid orange). */
export const LAVA_FALLBACK = '#e8460f';
export const LAVA_DRIFT_KEYFRAME = 'rookiesRunLavaDrift';
export const LAVA_BUBBLE_KEYFRAME = 'rookiesRunLavaBubble';

/**
 * background-position percent maths: a p% position offsets the image by
 * (square - image) * p = (1 - TILE_SQUARES) * square * p. So one square of
 * offset is PCT_PER_SQUARE and one full tile is DRIFT_PCT.
 */
const PCT_PER_SQUARE = 100 / (TILE_SQUARES - 1);
const DRIFT_PCT = (100 * TILE_SQUARES) / (TILE_SQUARES - 1);

/**
 * Keyframes + reduced-motion guard. Board.tsx injects this in its <style>
 * block. `--lava-x/--lava-y` are set per square (the shared-origin offset).
 */
export const LAVA_CSS = `
  @keyframes ${LAVA_DRIFT_KEYFRAME} {
    from { background-position: var(--lava-x) var(--lava-y); }
    to   { background-position: calc(var(--lava-x) + ${DRIFT_PCT.toFixed(3)}%) var(--lava-y); }
  }
  @keyframes ${LAVA_BUBBLE_KEYFRAME} {
    0%, 78% { transform: scale(0.2); opacity: 0; }
    88%     { transform: scale(0.85); opacity: 1; }
    95%     { transform: scale(1);    opacity: 1; }
    97%     { transform: scale(1.15); opacity: 0; }
    100%    { transform: scale(0.2);  opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rr-lava-anim { animation: none !important; }
  }
`;

/** Reduced-motion rule for the hazard squares themselves (inline animation needs !important to beat it). */
export function lavaReducedMotionCss(hazards: string[]): string {
  if (hazards.length === 0) return '';
  const sel = hazards.map((sq) => `[data-square="${sq}"]`).join(', ');
  return `@media (prefers-reduced-motion: reduce) { ${sel} { animation: none !important; } }`;
}

export interface LavaEdges { top: boolean; right: boolean; bottom: boolean; left: boolean }

/** Which edges of `sq` are open (do not touch another hazard). */
export function lavaOpenEdges(sq: string, hazards: Set<string>): LavaEdges {
  const f = sq.charCodeAt(0);
  const r = Number(sq[1]);
  const has = (df: number, dr: number) => hazards.has(`${String.fromCharCode(f + df)}${r + dr}`);
  return { top: !has(0, 1), bottom: !has(0, -1), left: !has(-1, 0), right: !has(1, 0) };
}

/**
 * Stone rim as inset box-shadows (light outer line, grey body, dark inner
 * line) on the open edges only. `px` = rim thickness.
 */
export function lavaRimShadow(edges: LavaEdges, px = 4): string {
  const hi = '#d3d6dc';
  const body = '#7e848d';
  const lo = 'rgba(15,15,22,0.6)';
  const out: string[] = [];
  const b = Math.max(1, px - 1);
  if (edges.top) out.push(`inset 0 1px 0 ${hi}`, `inset 0 ${b}px 0 ${body}`, `inset 0 ${px}px 0 ${lo}`);
  if (edges.bottom) out.push(`inset 0 -1px 0 ${hi}`, `inset 0 -${b}px 0 ${body}`, `inset 0 -${px}px 0 ${lo}`);
  if (edges.left) out.push(`inset 1px 0 0 ${hi}`, `inset ${b}px 0 0 ${body}`, `inset ${px}px 0 0 ${lo}`);
  if (edges.right) out.push(`inset -1px 0 0 ${hi}`, `inset -${b}px 0 0 ${body}`, `inset -${px}px 0 0 ${lo}`);
  return out.join(', ');
}

/**
 * Square style for one hazard square. `file` 1-8, `rank` 1-8. The
 * background-position percentages pin the tile to a board-shared origin
 * (a p% position = (square - image) * p, and image = TILE_SQUARES squares).
 */
export function lavaSquareStyle(
  sq: string,
  hazards: Set<string>,
  opts: { animate?: boolean; rimPx?: number } = {},
): CSSProperties {
  const file = sq.charCodeAt(0) - 97;
  const row = 8 - Number(sq[1]);
  const x = `${(file * PCT_PER_SQUARE).toFixed(3)}%`;
  const y = `${(row * PCT_PER_SQUARE).toFixed(3)}%`;
  const style: CSSProperties & Record<string, string> = {
    backgroundColor: LAVA_FALLBACK,
    backgroundImage: `url(${LAVA_SRC})`,
    backgroundSize: `${TILE_SQUARES * 100}% ${TILE_SQUARES * 100}%`,
    backgroundRepeat: 'repeat',
    backgroundPosition: `${x} ${y}`,
    boxShadow: lavaRimShadow(lavaOpenEdges(sq, hazards), opts.rimPx ?? 4),
    '--lava-x': x,
    '--lava-y': y,
  };
  if (opts.animate !== false) {
    style.animation = `${LAVA_DRIFT_KEYFRAME} 12s linear infinite`;
  }
  return style;
}

