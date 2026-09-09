'use client';

import { RunBoard } from '@/components/run/Board';
import { puzzleToBoardState } from '@/lib/run/seed';
import type { BoardState, RunPuzzle } from '@/lib/run/types';

/**
 * /test/dragon-cell — containment check for summon sprites. A Dragon on d4
 * boxed in by pawns, a Squire knight on f4, a rainbow pawn (Squad) on b4,
 * and a converted queen on h4, at three board widths (phone / iPad /
 * desktop). Every sprite must sit fully inside its square, centered, and
 * never touch a neighbor.
 */
const PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 1, rank: 1 },
  pieces: [
    { type: 'king', color: 'black', file: 7, rank: 8 },
    { type: 'pawn', color: 'black', file: 3, rank: 4 },
    { type: 'pawn', color: 'black', file: 5, rank: 4 },
    { type: 'pawn', color: 'black', file: 4, rank: 5 },
    { type: 'pawn', color: 'black', file: 4, rank: 3 },
    { type: 'pawn', color: 'black', file: 3, rank: 5 },
    { type: 'pawn', color: 'black', file: 5, rank: 5 },
    { type: 'pawn', color: 'black', file: 3, rank: 3 },
    { type: 'pawn', color: 'black', file: 5, rank: 3 },
    { type: 'knight', color: 'black', file: 7, rank: 4 },
    { type: 'bishop', color: 'black', file: 1, rank: 4 },
  ],
  winCondition: 'king',
  kingBehavior: 'flee',
  kingPen: ['g8', 'h8', 'f8'],
};

function state(): BoardState {
  const s = puzzleToBoardState(PUZZLE);
  return {
    ...s,
    rookie: { file: 1, rank: 1 },
    allies: [
      { id: 1, type: 'queen', file: 4, rank: 4, source: 'dragon', turnsLeft: 3 },
      { id: 2, type: 'knight', file: 6, rank: 4, source: 'squire' },
      { id: 3, type: 'pawn', file: 2, rank: 4, source: 'squad' },
      { id: 4, type: 'queen', file: 8, rank: 4, source: 'convert' },
    ],
  };
}

const WIDTHS = [
  { label: 'phone 360 (board ~315px)', px: 315 },
  { label: 'iPad (board 440px)', px: 440 },
  { label: 'desktop (board 520px)', px: 520 },
];

export default function DragonCellTest() {
  const s = state();
  return (
    <div className="h-full overflow-auto p-4" style={{ background: '#0f1c3f' }}>
      <div className="mx-auto flex max-w-[560px] flex-col gap-6">
        <h1 className="text-lg font-black text-white">Summon containment — Dragon d4</h1>
        {WIDTHS.map((w) => (
          <section key={w.px}>
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-white/60">{w.label}</div>
            <div style={{ width: w.px, maxWidth: '100%' }} className="rounded-[14px] overflow-hidden">
              <RunBoard state={s} selectedSquare={null} onSquareClick={() => {}} onPieceDrop={() => false} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
