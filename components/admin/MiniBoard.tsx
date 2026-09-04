/**
 * Tiny static 8x8 renderer for the admin dashboard. Pure markup from a level
 * def — never mounts the interactive Board. Rank 8 on top, file a on the left.
 */

import type { LevelView } from '@/lib/admin/content-data';
import { lavaSquareStyle } from '@/lib/run/lava-style';

const GLYPH: Record<string, string> = {
  pawn: '♟',
  knight: '♞',
  bishop: '♝',
  queen: '♛',
  king: '♚',
};

function sq(file: number, rank: number): string {
  return `${String.fromCharCode(96 + file)}${rank}`;
}

export function MiniBoard({ level, size = 112 }: { level: LevelView; size?: number }): React.ReactElement {
  const cell = size / 8;
  const pieces = new Map<string, string>();
  for (const p of level.pieces) pieces.set(sq(p.file, p.rank), p.type);
  const hazards = new Set(level.hazards.map((h) => sq(h.file, h.rank)));
  const pen = new Set(level.kingPen);
  const rookie = sq(level.rookieStart.file, level.rookieStart.rank);

  const cellsOut: React.ReactElement[] = [];
  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 1; file <= 8; file++) {
      const id = sq(file, rank);
      const dark = (file + rank) % 2 === 0;
      let bg = dark ? '#cfe0f0' : '#f4f8fc';
      if (pen.has(id)) bg = dark ? '#f5d58a' : '#fbe7b3';
      const piece = pieces.get(id);
      const isRookie = id === rookie;
      cellsOut.push(
        <div
          key={id}
          style={{
            width: cell, height: cell, background: bg, fontSize: cell * 0.78, lineHeight: `${cell}px`,
            ...(hazards.has(id) ? lavaSquareStyle(id, hazards, { animate: false, rimPx: 1 }) : null),
          }}
          className="flex items-center justify-center select-none"
          title={id}
        >
          {piece ? (
            <span style={{ color: piece === 'king' ? '#b91c1c' : '#111827' }}>{GLYPH[piece]}</span>
          ) : isRookie ? (
            <span style={{ color: '#2563eb', fontWeight: 700 }}>{'♖'}</span>
          ) : null}
        </div>,
      );
    }
  }

  return (
    <div
      className="grid overflow-hidden rounded-md border border-slate-300 shadow-sm"
      style={{ gridTemplateColumns: `repeat(8, ${cell}px)`, width: size, height: size }}
    >
      {cellsOut}
    </div>
  );
}
