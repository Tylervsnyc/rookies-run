'use client';

/**
 * Lava hazard squares — Tyler 2026-09-04 ("Lava is really funny, and people
 * know" → "think lava like Mario" → "I love D, let's use it").
 *
 * One painted seamless tile (public/hazards/lava-mario-seamless.webp, 16KB)
 * rendered as ONE continuous lake: every hazard square samples the tile from
 * a board-shared origin (a tile spans TILE_SQUARES squares), so adjacent
 * hazards join into a river. A thin bevelled stone rim is drawn only on edges
 * that do not touch another hazard, so the river gets a bank instead of a
 * grid of framed windows.
 *
 * The lake lives in the square's own background (react-chessboard
 * `squareStyles`), so legal-move dots / ability rings layer ON TOP of it the
 * same way they already layer over every other square, and pieces (which
 * never stand on hazards — see movement.ts / pawn-ai.ts) are untouched.
 *
 * Motion: one `background-position` loop per square (12s, linear, shared
 * phase so the lake drifts as one body) + one rare bubble per square in a
 * tiny overlay. `prefers-reduced-motion` freezes both. Design page with the
 * rejected alternatives: app/test/lava-squares.
 */

import { LAVA_BUBBLE_KEYFRAME } from '@/lib/run/lava-style';

export {
  LAVA_SRC, TILE_SQUARES, LAVA_FALLBACK, LAVA_DRIFT_KEYFRAME, LAVA_BUBBLE_KEYFRAME, LAVA_CSS,
  lavaReducedMotionCss, lavaOpenEdges, lavaRimShadow, lavaSquareStyle,
} from '@/lib/run/lava-style';
export type { LavaEdges } from '@/lib/run/lava-style';

/** Deterministic per-square jitter so bubbles never sync. */
function jitter(seed: number, salt: number): number {
  const v = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

/**
 * Rare bubbles — one per hazard square, 5–9s apart, de-synced. Absolutely
 * positioned over the board (white orientation). Pointer-events none.
 */
export function LavaBubbles({ hazards }: { hazards: string[] }) {
  if (hazards.length === 0) return null;
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {hazards.map((sq, i) => {
        const file = sq.charCodeAt(0) - 97;
        const row = 8 - Number(sq[1]);
        const period = 5 + 4 * jitter(i, 1);
        const delay = -period * jitter(i, 2);
        const size = 16; // % of a square
        const left = (file + 0.3 + 0.4 * jitter(i, 3)) * 12.5 - (size * 12.5) / 200;
        const top = (row + 0.3 + 0.4 * jitter(i, 4)) * 12.5 - (size * 12.5) / 200;
        return (
          <span
            key={sq}
            className="rr-lava-anim"
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              width: `${(size * 12.5) / 100}%`,
              height: `${(size * 12.5) / 100}%`,
              borderRadius: '50%',
              border: '2px solid #c63e08',
              background: 'radial-gradient(circle at 35% 35%, #fff2a0, #ffd23a 70%)',
              transformOrigin: 'center',
              opacity: 0,
              animation: `${LAVA_BUBBLE_KEYFRAME} ${period.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
