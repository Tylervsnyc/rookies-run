'use client';

import { PieceBlocks } from '@/components/run/PieceBlocks';

/** Dev check: how each rainbow summon sits inside a 48px board cell (the Board's ally wrapper, scale 0.88). */
const PIECES = ['P', 'N', 'B', 'R', 'Q', 'K', 'D'] as const;

export default function AllySizePage() {
  return (
    <div className="h-full overflow-auto p-6" style={{ background: '#0f1c3f' }}>
      <div className="flex gap-3 flex-wrap">
        {PIECES.map((p) => (
          <div key={p} className="flex flex-col items-center gap-1 text-white text-xs font-black">
            <div className="relative" style={{ width: 48, height: 48, background: '#9bb56d', outline: '1px solid #fff' }}>
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(0.88)' }}>
                <PieceBlocks piece={p} blockSize={3} animate={false} />
              </div>
            </div>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
