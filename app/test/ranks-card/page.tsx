'use client';

import { useState } from 'react';
import { DailyRankRow, RankRowStyles } from '@/components/run/RankRunCard';
import type { LeaderboardRow } from '@/lib/run/leaderboard-client';

/**
 * Review page for the TODAY Ranks run card (components/run/RankRunCard.tsx).
 * Sample rows: stats rows (new builds), a score-only row and a levels-only row
 * (older builds), and a "you" row below the top five. The top board starts
 * with #1 open; the bottom one starts collapsed. Tap any stats row to toggle.
 */
const base = { completed: true, me: false } as const;
const ROWS: LeaderboardRow[] = [
  { ...base, rank: 1, handle: 'KnightOwl', levels: 10, captures: 14, score: 2480, stars: 3, moves: 36, parMoves: 40, timeMs: 192_000, retries: 0, difficulty: 'hard' },
  { ...base, rank: 2, handle: 'Rook-4821', levels: 10, captures: 11, score: 2105, stars: 2, moves: 43, parMoves: 40, timeMs: 251_000, retries: 0, difficulty: 'normal' },
  { ...base, rank: 3, handle: 'pawnstorm_99', levels: 10, captures: 9, score: 1760, stars: 1, moves: 40, parMoves: 40, timeMs: 3_725_000, retries: 2, difficulty: 'rookie' },
  { ...base, rank: 4, handle: 'Castled', levels: 8, captures: 6, score: 1240, stars: null, moves: null, parMoves: null, timeMs: null, retries: null, difficulty: 'normal' },
  { ...base, rank: 5, handle: 'OldBuild', levels: 7, captures: 3, score: null, stars: null, moves: null, parMoves: null, timeMs: null, retries: null, difficulty: 'normal', completed: false },
];
const ME: LeaderboardRow = { rank: 12, handle: 'Tyler', levels: 6, captures: 4, score: 980, stars: 0, moves: 29, parMoves: 40, timeMs: 138_000, retries: 1, difficulty: 'nightmare', completed: false, me: true };

function Board({ initialOpen, withMe }: { initialOpen: string | null; withMe?: boolean }) {
  const [open, setOpen] = useState<string | null>(initialOpen);
  const toggle = (k: string) => () => setOpen((o) => (o === k ? null : k));
  return (
    <div className="rounded-2xl px-3 py-3" style={{ background: 'linear-gradient(180deg,#182a5c 0%,#0f1c3f 60%)' }}>
      <div className="flex items-baseline justify-between px-1">
        <span className="text-[14px] font-black text-white">Today&rsquo;s hunters</span>
        <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#FFC800' }}>37 playing</span>
      </div>
      <ul className="mt-1.5 text-white" data-rank-scroller>
        <RankRowStyles />
        {ROWS.slice(0, withMe ? 4 : 5).map((r) => {
          const k = `${r.rank}-${r.handle}`;
          return <DailyRankRow key={k} row={r} open={open === k} onToggle={toggle(k)} />;
        })}
        {withMe && <DailyRankRow row={ME} className="mt-1" open={open === 'me'} onToggle={toggle('me')} />}
      </ul>
    </div>
  );
}

export default function RanksCardTest() {
  return (
    <div className="h-full overflow-auto p-3 flex flex-col gap-4 items-center" style={{ background: '#0f1c3f' }}>
      <div className="w-full max-w-[430px]"><Board initialOpen="1-KnightOwl" withMe /></div>
      <div className="w-full max-w-[430px]"><Board initialOpen="me" withMe /></div>
      <div className="w-full max-w-[430px]"><Board initialOpen={null} /></div>
    </div>
  );
}
