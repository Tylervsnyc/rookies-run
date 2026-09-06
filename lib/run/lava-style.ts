/**
 * Pure style helpers for HAZARD squares — shared by the live Board (client)
 * and the static replay/admin boards (server-safe). Story + design notes live
 * in components/run/LavaHazards.tsx.
 *
 * A hazard is one of two things (Hazard.kind, default 'stone'):
 *   LAVA  — the painted Mario lava lake: one continuous body, shared-origin
 *           drift, a thin cobble bank on the edges that touch nothing.
 *   STONE — a raised grey block: light top bevel, dark bottom, no animation.
 *           This is what a run's walls/pillars/pens are, and what Boulder
 *           drops and Shove pushes. It must never read as a legal target.
 *
 * Both merge with their OWN kind only, so a stone wall beside a lava river
 * reads as a bank against a river, not one blended mass.
 */

import type { CSSProperties } from 'react';
import type { Hazard } from './types';

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


// ---------------------------------------------------------------------------
// STONE (2026-09-06) — the other half of `hazards`. Tyler: "I don't quite
// understand Shove because we use lava now." Boulder drops rock and Shove
// rolls rock; both were being painted as molten lava. Stone is drawn in the
// SAME grey family as the lava bank above (#d3d6dc / #7e848d) so a stone room
// beyond a lava moat reads as one world, and it never animates — stone does
// not move on its own.
// ---------------------------------------------------------------------------

/** Grey family — deliberately the lava bank's colours (lavaRimShadow). */
export const STONE_HI = '#d3d6dc';
export const STONE_FACE = '#848a94';
export const STONE_LEFT = '#b4b9c2';
export const STONE_RIGHT = '#666b74';
export const STONE_LO = '#42464e';

/** Deterministic per-square chips so a wall is rock, not a painted rectangle. */
function stoneGrain(sq: string): string {
  const seed = sq.charCodeAt(0) * 31 + Number(sq[1]) * 17;
  const r = (n: number) => {
    const v = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  const spots: string[] = [];
  for (let i = 0; i < 3; i++) {
    const x = (14 + 72 * r(i * 3 + 1)).toFixed(1);
    const y = (14 + 72 * r(i * 3 + 2)).toFixed(1);
    const rad = (9 + 9 * r(i * 3 + 3)).toFixed(1);
    const tint = i % 2 === 0 ? 'rgba(58,62,70,0.26)' : 'rgba(228,232,238,0.28)';
    spots.push(`radial-gradient(circle at ${x}% ${y}%, ${tint} 0, rgba(0,0,0,0) ${rad}%)`);
  }
  return spots.join(', ');
}

/**
 * Bevel as inset box-shadows on the OPEN edges only (earlier entries paint on
 * top), so adjacent stone merges into one wall and a lone block is a cube.
 */
export function stoneBevelShadow(edges: LavaEdges, px = 5): string {
  const out: string[] = [];
  const b = Math.max(1, px - 1);
  if (edges.top) out.push('inset 0 1px 0 rgba(255,255,255,0.95)', `inset 0 ${px}px 0 ${STONE_HI}`);
  if (edges.left) out.push('inset 1px 0 0 rgba(255,255,255,0.5)', `inset ${b}px 0 0 ${STONE_LEFT}`);
  if (edges.right) out.push('inset -1px 0 0 rgba(12,14,18,0.45)', `inset -${b}px 0 0 ${STONE_RIGHT}`);
  if (edges.bottom) out.push('inset 0 -1px 0 rgba(10,12,16,0.85)', `inset 0 -${px}px 0 ${STONE_LO}`);
  return out.join(', ');
}

/** Square style for one STONE hazard. `stones` = the stone squares only. */
export function stoneSquareStyle(
  sq: string,
  stones: Set<string>,
  opts: { rimPx?: number } = {},
): CSSProperties {
  return {
    backgroundColor: STONE_FACE,
    backgroundImage: [
      'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.02) 30%, rgba(0,0,0,0.10) 62%, rgba(0,0,0,0.30) 100%)',
      stoneGrain(sq),
    ].join(', '),
    boxShadow: stoneBevelShadow(lavaOpenEdges(sq, stones), opts.rimPx ?? 5),
  };
}

// ---------------------------------------------------------------------------
// Dispatch — split a level's hazards by kind once, then style each square
// against its OWN kind's set so the merge logic never blends the two.
// ---------------------------------------------------------------------------

export interface HazardSets {
  lava: Set<string>;
  stone: Set<string>;
}

/** Hazard.kind, with the documented default (see types.ts). */
export function hazardKind(h: Hazard): 'lava' | 'stone' {
  return h.kind === 'lava' ? 'lava' : 'stone';
}

export function splitHazards(hazards: ReadonlyArray<Hazard>): HazardSets {
  const lava = new Set<string>();
  const stone = new Set<string>();
  for (const h of hazards) {
    const sq = `${String.fromCharCode(96 + h.file)}${h.rank}`;
    (hazardKind(h) === 'lava' ? lava : stone).add(sq);
  }
  return { lava, stone };
}

/** Style for one hazard square, or null when the square is not a hazard. */
export function hazardSquareStyle(
  sq: string,
  sets: HazardSets,
  opts: { animate?: boolean; rimPx?: number } = {},
): CSSProperties | null {
  if (sets.lava.has(sq)) return lavaSquareStyle(sq, sets.lava, opts);
  if (sets.stone.has(sq)) return stoneSquareStyle(sq, sets.stone, opts);
  return null;
}
