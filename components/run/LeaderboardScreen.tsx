'use client';

import { useMemo, useState } from 'react';
import {
  getLeaderboard,
  myLeaderRow,
  LEADERBOARD_IS_SAMPLE,
  type LeaderboardWindow,
} from '@/lib/run/leaderboard';
import { DIFFICULTIES } from '@/lib/run/difficulty';
import type { RunStats } from '@/lib/run/history';
import type { PlayerProfile } from '@/lib/run/profile';
import { BackButton } from './JourneyScreen';
import { RookiesRevengeLogo } from './RookiesRevengeLogo';

interface LeaderboardScreenProps {
  profile: PlayerProfile;
  stats: RunStats;
  onBack: () => void;
  onPlay: () => void;
}

/**
 * Standings. The rows are SAMPLE DATA until there's an endpoint — see
 * lib/run/leaderboard.ts. The banner says so on screen so a screenshot of this
 * can never be mistaken for real numbers.
 */
export function LeaderboardScreen({ profile, stats, onBack, onPlay }: LeaderboardScreenProps) {
  const [range, setRange] = useState<LeaderboardWindow>('week');
  const me = useMemo(() => myLeaderRow(profile, stats), [profile, stats]);
  const rows = useMemo(() => getLeaderboard(range, me), [range, me]);

  return (
    <div className="h-full w-full overflow-auto bg-chess-page text-chess-text">
      <div className="mx-auto w-full max-w-[420px] md:max-w-[520px] px-4 pt-4 pb-10 flex flex-col gap-3">
        <header className="flex items-center gap-3">
          <BackButton onClick={onBack} />
          <RookiesRevengeLogo scale={0.34} />
        </header>

        <div>
          <h1 className="text-[22px] font-black leading-tight">Leaderboard</h1>
          <p className="text-[12px] text-chess-text-muted leading-snug mt-0.5">
            Ranked by pieces taken on your best run. Difficulty is the tiebreak
            nobody agrees with.
          </p>
        </div>

        {LEADERBOARD_IS_SAMPLE && (
          <div className="rounded-xl bg-amber-100 text-amber-900 px-3 py-2 text-[11px] font-bold leading-snug">
            Sample standings. Real ones arrive when runs sync to an account —
            your own row below is your actual best.
          </div>
        )}

        {/* Range toggle */}
        <div
          role="radiogroup"
          aria-label="Leaderboard range"
          className="grid grid-cols-2 gap-1 rounded-xl bg-chess-surface p-1 border border-chess-text/10"
        >
          {(['week', 'all'] as LeaderboardWindow[]).map((w) => (
            <button
              key={w}
              type="button"
              role="radio"
              aria-checked={range === w}
              onClick={() => setRange(w)}
              className={`min-h-[40px] rounded-lg text-[12px] font-black transition-colors ${
                range === w ? 'bg-chess-text text-white' : 'text-chess-text-muted active:bg-chess-text/10'
              }`}
            >
              {w === 'week' ? 'This week' : 'All time'}
            </button>
          ))}
        </div>

        <ol className="flex flex-col gap-1.5">
          {rows.map((r) => (
            <li
              key={`${r.rank}-${r.name}`}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${
                r.you
                  ? 'bg-white border-chess-text/25 shadow-sm'
                  : 'bg-chess-surface border-chess-text/10'
              }`}
            >
              {/* Medal colours as a chip, not emoji — emoji medals render as
                  mush in a few Android/Windows font stacks. */}
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[12.5px] font-black tabular-nums shrink-0"
                style={
                  r.rank <= 3
                    ? { background: ['#d9a520', '#9aa8b2', '#c07a3e'][r.rank - 1], color: '#fff' }
                    : { color: '#94a3b8' }
                }
              >
                {r.rank}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[13px] font-black text-chess-text truncate">
                  {r.name}
                  {r.you && (
                    <span className="ml-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-chess-text-muted">
                      you
                    </span>
                  )}
                </span>
                <span className="block text-[10.5px] text-chess-text-muted">
                  L{r.levels} · {DIFFICULTIES[r.difficulty].name} · {r.streak}🔥
                </span>
              </span>
              <span className="text-right shrink-0">
                <span className="block text-[15px] font-black text-chess-text tabular-nums leading-none">
                  {r.score}
                </span>
                <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-faint mt-0.5">
                  taken
                </span>
              </span>
            </li>
          ))}
        </ol>

        {!me && (
          <p className="text-[11.5px] text-chess-text-muted text-center leading-snug px-3">
            You are not on the board yet. Finish a run and you will be.
          </p>
        )}

        <button
          type="button"
          onClick={onPlay}
          className="w-full py-3 rounded-2xl bg-chess-text text-white font-black text-[14px] tracking-wide active:translate-y-px transition-transform"
          style={{ boxShadow: '0 4px 0 #1a2c33, 0 6px 12px rgba(0,0,0,0.12)' }}
        >
          Go take some pieces <span className="opacity-80">→</span>
        </button>
      </div>
    </div>
  );
}
