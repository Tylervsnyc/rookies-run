'use client';

/**
 * Tab-bar icons drawn in the app's own visual language: the block rook's
 * matte colored blocks (Tyler 2026-09-04 — generated "painted relic" icons
 * read as slop; these share DNA with the mark, the ability cards' frames and
 * the daily rook). Each icon is a small block grid, same block styling as
 * RevengeMarkSvg. Revenge = the mark itself.
 */

import { lighten, darken } from '@/lib/daily-rook-blocks';
import { RevengeMarkSvg } from './RookiesRevengeLogo';

type B = { x: number; y: number; c: string };
const BLUE = '#1CB0F6', CYAN = '#2FCBEF', PURPLE = '#A560E8', GREEN = '#58CC02', GOLD = '#FFC800', ORANGE = '#FF9600', CORAL = '#FF6B6B', RED = '#FF4B4B';
const WHITE = '#F4F6FB';

function BlockGrid({ blocks, cols, rows, size, id }: { blocks: B[]; cols: number; rows: number; size: number; id: string }) {
  const gapR = 3 / 22;
  const span = Math.max(cols, rows);
  const block = 100 / (span + (span - 1) * gapR);
  const gap = block * gapR;
  const w = cols * block + (cols - 1) * gap;
  const h = rows * block + (rows - 1) * gap;
  const x0 = (100 - w) / 2, y0 = (100 - h) / 2;
  blocks = Array.from(new Map(blocks.map((b) => [`${b.x}-${b.y}`, b])).values()); // later blocks overwrite earlier at the same cell
  const colors = Array.from(new Set(blocks.map((b) => b.c)));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <defs>
        {colors.map((c) => (
          <linearGradient key={c} id={`${id}-${c.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lighten(c, 18)} />
            <stop offset="20%" stopColor={lighten(c, 12)} />
            <stop offset="40%" stopColor={c} />
            <stop offset="100%" stopColor={darken(c, 12)} />
          </linearGradient>
        ))}
      </defs>
      {blocks.map((b) => (
        <rect key={`${b.x}-${b.y}`} x={x0 + b.x * (block + gap)} y={y0 + b.y * (block + gap)} width={block} height={block} rx={block * 0.09} fill={`url(#${id}-${b.c.slice(1)})`} stroke="rgba(0,0,0,0.15)" strokeWidth={0.6} />
      ))}
    </svg>
  );
}

// ── Ladder: a staircase of blocks climbing to a gold crown block ─────────────
const LADDER: B[] = [
  ...[0, 1, 2, 3, 4].flatMap((col) => Array.from({ length: col + 1 }, (_, k) => ({ x: col, y: 5 - k, c: [CYAN, GREEN, GOLD, ORANGE, CORAL, PURPLE][(col + k) % 6] }))),
  { x: 4, y: 0, c: GOLD },
  { x: 4, y: -1, c: GOLD },
];
export function LadderBlockIcon({ size = 56 }: { size?: number }) {
  return <BlockGrid id="tb-ladder" blocks={LADDER.map((b) => ({ ...b, y: b.y + 1 }))} cols={5} rows={7} size={size} />;
}

// ── Ranks: a 1-2-3 podium, gold column tallest ───────────────────────────────
const RANKS: B[] = [
  // 2nd (left, cyan), 1st (middle, gold), 3rd (right, coral)
  ...[3, 4, 5].map((y) => ({ x: 0, y, c: CYAN })), ...[3, 4, 5].map((y) => ({ x: 1, y, c: BLUE })),
  ...[1, 2, 3, 4, 5].map((y) => ({ x: 2, y, c: GOLD })), ...[1, 2, 3, 4, 5].map((y) => ({ x: 3, y, c: ORANGE })),
  ...[4, 5].map((y) => ({ x: 4, y, c: CORAL })), ...[4, 5].map((y) => ({ x: 5, y, c: RED })),
  { x: 2, y: -1, c: WHITE }, { x: 3, y: -1, c: WHITE }, // the little star/cup on top
];
export function RanksBlockIcon({ size = 56 }: { size?: number }) {
  return <BlockGrid id="tb-ranks" blocks={RANKS.map((b) => ({ ...b, y: b.y + 1 }))} cols={6} rows={7} size={size} />;
}

// ── Codex: a closed book seen from the front-right — purple spine, blue cover,
// white page edges peeking out on the right and bottom, one gold gem ────────
const CODEX: B[] = [
  ...[0, 1, 2, 3, 4].map((y) => ({ x: 0, y, c: PURPLE })),
  ...[0, 1, 2, 3, 4].flatMap((y) => [1, 2, 3].map((x) => ({ x, y, c: BLUE }))),
  ...[1, 2, 3, 4, 5].map((y) => ({ x: 4, y, c: WHITE })),
  ...[1, 2, 3].map((x) => ({ x, y: 5, c: WHITE })),
  { x: 2, y: 2, c: GOLD },
];
export function CodexBlockIcon({ size = 56 }: { size?: number }) {
  return <BlockGrid id="tb-codex" blocks={CODEX} cols={5} rows={6} size={size} />;
}

export function RevengeBlockIcon({ size = 56 }: { size?: number }) {
  return <RevengeMarkSvg size={size} />;
}

export const TAB_BLOCK_ICONS = { Ladder: LadderBlockIcon, Ranks: RanksBlockIcon, Revenge: RevengeBlockIcon, Codex: CodexBlockIcon } as const;
