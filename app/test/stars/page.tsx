'use client';

import { useEffect, useState } from 'react';
import { LevelClearedModal } from '@/components/run/LevelClearedModal';
import { RunSummaryModal } from '@/components/run/RunSummaryModal';
import { StampButton, StampCard, StampChip } from '@/components/run/StampCard';
import type { RunStats } from '@/lib/run/history';
import { starRuleLine, starsForRun, type RunStars, type StarInput } from '@/lib/run/scoring';

/**
 * Review page for the per-run star system (docs/stars-research.md).
 * Each button mounts the real RunSummaryModal / StampCard fresh so the
 * star pop-in replays from the start.
 */

const STATS: RunStats = {
  played: 13,
  wins: 9,
  winPct: 69,
  currentStreak: 3,
  maxStreak: 5,
  distribution: { 3: 1, 6: 2, 8: 1, 10: 9 },
  maxBucket: 9,
};

const CASES: Record<RunStars, StarInput> = {
  0: { completed: false, retriesUsed: 1, movesUsed: 21, parMoves: 35 },
  1: { completed: true, retriesUsed: 1, movesUsed: 45, parMoves: 35 },
  2: { completed: true, retriesUsed: 0, movesUsed: 37, parMoves: 35 },
  3: { completed: true, retriesUsed: 0, movesUsed: 32, parMoves: 35 },
};

interface View {
  kind: 'summary' | 'card' | 'level';
  stars: RunStars;
  key: number;
}

export default function StarsTestPage() {
  const [view, setView] = useState<View | null>(null);
  const [n, setN] = useState(0);
  // `?stars=N&view=card|summary` opens straight into a variant (the modal's
  // backdrop covers the buttons); Escape closes whatever is up.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const n = Number(q.get('stars'));
    if (q.has('stars') && n >= 0 && n <= 3) {
      setView({ kind: q.get('view') === 'card' ? 'card' : 'summary', stars: n as RunStars, key: 1 });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const open = (kind: View['kind'], stars: RunStars = 0) => {
    setN((k) => k + 1);
    setView({ kind, stars, key: n + 1 });
  };

  return (
    <div className="h-full overflow-auto p-6 text-white" style={{ background: '#0f1c3f' }}>
      <h1 className="text-2xl font-black">Run stars</h1>
      <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
        1 = finished · 2 = no retries · 3 = no retries and moves ≤ par. Each button remounts the modal so the animation replays.
      </p>

      <section className="mt-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.55)' }}>RunSummaryModal</h2>
        <div className="mt-2 grid grid-cols-2 gap-2 max-w-sm">
          {([1, 2, 3] as RunStars[]).map((s) => (
            <button key={s} type="button" onClick={() => open('summary', s)} className="min-h-[44px] rounded-lg font-black" style={{ background: '#58CC02' }}>
              {s} star{s > 1 ? 's' : ''}
            </button>
          ))}
          <button type="button" onClick={() => open('summary', 0)} className="min-h-[44px] rounded-lg font-black" style={{ background: '#FF3B30' }}>
            Captured (no stars)
          </button>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.55)' }}>StampCard only</h2>
        <div className="mt-2 grid grid-cols-3 gap-2 max-w-sm">
          {([1, 2, 3] as RunStars[]).map((s) => (
            <button key={s} type="button" onClick={() => open('card', s)} className="min-h-[44px] rounded-lg font-black" style={{ background: 'rgba(255,255,255,0.15)' }}>
              {s} star{s > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.55)' }}>LevelClearedModal par chip</h2>
        <div className="mt-2 max-w-sm">
          <button type="button" onClick={() => open('level')} className="w-full min-h-[44px] rounded-lg font-black" style={{ background: 'rgba(255,255,255,0.15)' }}>
            Level cleared · 5 moves, level par 4
          </button>
        </div>
      </section>

      <section className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
        <h2 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.55)' }}>Rule lines</h2>
        <ul className="mt-2 flex flex-col gap-1 tabular-nums">
          {([1, 2, 3] as RunStars[]).map((s) => (
            <li key={s}>
              {s}★ — {starRuleLine(CASES[s], starsForRun(CASES[s]))}
            </li>
          ))}
        </ul>
      </section>

      {view?.kind === 'summary' && (
        <RunSummaryModal
          key={view.key}
          onClose={() => setView(null)}
          iso="2026-09-03"
          totalLevels={10}
          levelReached={view.stars === 0 ? 4 : 10}
          completed={view.stars > 0}
          stats={STATS}
          shareString="Rookie's Revenge test"
          difficultyLabel="Normal"
          score={3335}
          timeMs={290_000}
          stars={view.stars}
          starLine={starRuleLine(CASES[view.stars], view.stars)}
          onReplay={() => setView(null)}
          nextRunName="The Fortress"
          onNextRun={() => setView(null)}
        />
      )}

      {view?.kind === 'card' && (
        <StampCard
          key={view.key}
          kicker="2026-09-03 · Normal"
          level={10}
          totalLevels={10}
          stamp="Run complete"
          tone="won"
          stars={view.stars}
          starLine={starRuleLine(CASES[view.stars], view.stars)}
          chips={<StampChip gold>3335 pts</StampChip>}
        >
          <StampButton color="#58CC02" shadow="#3d8c01" onClick={() => setView(null)}>
            Close
          </StampButton>
        </StampCard>
      )}

      {view?.kind === 'level' && <LevelClearedModal key={view.key} level={4} totalLevels={10} tempo={3} runName="Rookie's Revenge" moves={5} levelPar={4} onNext={() => setView(null)} />}
    </div>
  );
}
