'use client';

import { useEffect, useState } from 'react';
import { fireConfetti } from '@/lib/confetti';
import type { RunStats } from '@/lib/run/history';
import { REVENGE_RED, REVENGE_RED_DARK } from './RookiesRevengeLogo';
import { StampButton, StampCard, StampChip } from './StampCard';

/**
 * Run over — "The Stamp" (Tyler 2026-09-03: "redesign the run complete
 * popup as well, with this new design"). Same card as the level popups:
 * the number of levels cleared slams in, RUN COMPLETE / CAPTURED stamps
 * over it, then the run's stats and the levels-reached history sit under
 * the pips. Confetti on a completed run.
 */
interface RunSummaryModalProps {
  iso: string;
  totalLevels: number;
  /** Level the player reached this run (1-indexed). */
  levelReached: number;
  /** True when the run was completed (all levels cleared). */
  completed: boolean;
  stats: RunStats;
  shareString: string;
  onReplay: () => void;
  nextRunName?: string;
  onNextRun?: () => void;
  /** Difficulty mode name (e.g. "Hard") — shown as a small chip under the pips. */
  difficultyLabel?: string;
  /** Classic score (lib/run/scoring computeScore). */
  score?: number;
  /** Time-based score — TESTING; shown clearly labeled, never submitted. */
  timedScore?: number;
  /** Total active-play ms for the run (the header clock's final reading). */
  timeMs?: number;
}

const GOLD = '#FFC800';
const MUTED = 'rgba(255,255,255,0.6)';

export function RunSummaryModal({
  iso,
  totalLevels,
  levelReached,
  completed,
  stats,
  shareString,
  onReplay,
  nextRunName,
  onNextRun,
  difficultyLabel,
  score,
  timedScore,
  timeMs,
}: RunSummaryModalProps) {
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!completed) return;
    const palette = [GOLD, '#ffffff', REVENGE_RED, '#f5cf5a'];
    const t = setTimeout(() => {
      fireConfetti({ particleCount: 80, angle: 60, spread: 65, origin: { x: 0.15, y: 0.55 }, colors: palette, gravity: 1.1, ticks: 180 });
      fireConfetti({ particleCount: 80, angle: 120, spread: 65, origin: { x: 0.85, y: 0.55 }, colors: palette, gravity: 1.1, ticks: 180 });
    }, 650);
    return () => clearTimeout(t);
  }, [completed]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareString);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch {
      /* no clipboard */
    }
  };

  // Build distribution rows: one per level, 1..totalLevels.
  const rows = Array.from({ length: totalLevels }, (_, i) => {
    const level = i + 1;
    const count = stats.distribution[level] ?? 0;
    const pct = stats.maxBucket === 0 ? 0 : Math.round((count / stats.maxBucket) * 100);
    return { level, count, pct, isToday: level === levelReached };
  });

  const clock =
    timeMs !== undefined ? `${Math.floor(timeMs / 60000)}:${String(Math.floor(timeMs / 1000) % 60).padStart(2, '0')}` : null;

  return (
    <StampCard
      kicker={`${iso}${difficultyLabel ? ` · ${difficultyLabel}` : ''}`}
      level={completed ? totalLevels : levelReached}
      totalLevels={totalLevels}
      stamp={completed ? 'Run complete' : 'Captured'}
      tone={completed ? 'won' : 'lost'}
      chips={
        <>
          {score !== undefined && <StampChip gold>{score} pts</StampChip>}
          {clock && <StampChip>{clock}</StampChip>}
          {timedScore !== undefined && <StampChip>Timed {timedScore} (testing)</StampChip>}
        </>
      }
    >
      <div className="grid grid-cols-4 gap-2">
        <Stat value={stats.played} label="Played" />
        <Stat value={`${stats.winPct}%`} label="Win" />
        <Stat value={stats.currentStreak} label="Streak" />
        <Stat value={stats.maxStreak} label="Max" />
      </div>

      <div className="mt-2 text-left">
        <div className="text-[10px] font-black uppercase tracking-[0.18em] mb-1.5 px-1" style={{ color: MUTED }}>
          Levels reached
        </div>
        <div className="flex flex-col gap-1">
          {rows.map((r, idx) => (
            <div key={r.level} className="flex items-center gap-2 text-sm">
              <div className="w-5 text-right text-[11px] font-black tabular-nums" style={{ color: MUTED }}>
                {r.level}
              </div>
              <div className="flex-1 h-5 rounded overflow-hidden relative" style={{ background: 'rgba(0,0,0,0.35)' }}>
                <div
                  className="h-full flex items-center justify-end pr-2 text-[10px] font-black tabular-nums"
                  style={{
                    width: `${Math.max(r.count > 0 ? 10 : 0, r.pct)}%`,
                    background: r.isToday ? (completed ? GOLD : REVENGE_RED) : 'rgba(255,255,255,0.22)',
                    color: r.isToday && completed ? '#3a2a00' : '#fff',
                    transformOrigin: 'left center',
                    animation: 'rrStampBar 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
                    animationDelay: `${900 + idx * 40}ms`,
                  }}
                >
                  {r.count > 0 ? r.count : ''}
                </div>
                {r.count === 0 && r.isToday && (
                  <div className="absolute inset-0 flex items-center px-2 text-[10px] font-black" style={{ color: '#FF6B66' }}>
                    ← you
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes rrStampBar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
          @media (prefers-reduced-motion: reduce) { [style*="rrStampBar"] { animation: none !important; } }
        `}</style>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {completed && nextRunName && onNextRun ? (
          <StampButton color="#58CC02" shadow="#3d8c01" onClick={onNextRun}>
            Next run · {nextRunName}
          </StampButton>
        ) : (
          <StampButton color={REVENGE_RED} shadow={REVENGE_RED_DARK} onClick={onReplay}>
            {completed ? 'Play again' : 'Try again'}
          </StampButton>
        )}
        <div className="flex gap-2 justify-center">
          <button type="button" onClick={handleCopy} className="min-h-[40px] px-4 text-[12px] font-black rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
            {shareCopied ? 'Copied!' : 'Share'}
          </button>
          {completed && nextRunName && onNextRun && (
            <button type="button" onClick={onReplay} className="min-h-[40px] px-4 text-[12px] font-black" style={{ color: MUTED }}>
              Replay this run
            </button>
          )}
        </div>
      </div>
    </StampCard>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg py-1.5" style={{ background: 'rgba(0,0,0,0.25)' }}>
      <div className="text-[20px] font-black tabular-nums leading-none" style={{ color: GOLD, textShadow: '0 2px 0 rgba(0,0,0,0.5)' }}>
        {value}
      </div>
      <div className="mt-1 text-[9px] font-black uppercase tracking-wide" style={{ color: MUTED }}>
        {label}
      </div>
    </div>
  );
}
