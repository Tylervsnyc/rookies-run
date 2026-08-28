'use client';

import { useMemo } from 'react';
import { REVENGE_TAGLINE, RevengeMarkSvg, RookiesRevengeLogo } from './RookiesRevengeLogo';
import { TrophyGlyph } from './AchievementToast';
import { ACHIEVEMENTS } from '@/lib/run/achievements';
import { unlockableAbilityIds, type PlayerProfile } from '@/lib/run/profile';
import { DIFFICULTIES } from '@/lib/run/difficulty';
import type { RunHistoryEntry, RunStats } from '@/lib/run/history';
import { clearedCount, currentMap, journeyProgress, JOURNEY_MAPS } from '@/lib/run/journey';

interface RunHomeProps {
  /** Today's date, YYYY-MM-DD in the player's timezone. */
  iso: string;
  profile: PlayerProfile;
  history: RunHistoryEntry[];
  stats: RunStats;
  onDaily: () => void;
  onJourney: () => void;
  onLeaderboard: () => void;
  onTrophies: () => void;
  onHowToPlay: () => void;
}

function dateLabel(iso: string): string {
  try {
    return new Date(iso + 'T00:00:00')
      .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      .toUpperCase();
  } catch {
    return '';
  }
}

/**
 * The front door. Every session starts here: pick today's run, walk the
 * journey, or look at the board. Nothing here starts a game by itself — the
 * old behaviour (open the app, get handed a difficulty picker) is gone.
 */
export function RunHome({
  iso,
  profile,
  history,
  stats,
  onDaily,
  onJourney,
  onLeaderboard,
  onTrophies,
  onHowToPlay,
}: RunHomeProps) {
  const progress = useMemo(() => journeyProgress(history), [history]);
  const chapter = currentMap(progress);
  const mapsDone = clearedCount(progress);
  const playedToday = history.some((h) => h.iso === iso);
  const wonToday = history.some((h) => h.iso === iso && h.completed);
  const abilitiesHave = profile.unlockedAbilities.length;
  const abilitiesTotal = unlockableAbilityIds().length;
  const trophiesHave = Object.keys(profile.achievements).length;

  return (
    <div className="h-full w-full overflow-auto bg-chess-page text-chess-text">
      <div className="mx-auto w-full max-w-[420px] md:max-w-[520px] px-4 pt-4 pb-8 flex flex-col gap-3">
        {/* Wordmark + trophy shortcut */}
        <header className="flex items-center justify-between gap-3">
          <RookiesRevengeLogo scale={0.46} />
          <button
            type="button"
            onClick={onTrophies}
            aria-label="Trophy room"
            className="w-11 h-11 rounded-xl bg-chess-surface shadow-sm flex items-center justify-center active:scale-90 transition-transform shrink-0"
          >
            <TrophyGlyph size={18} color="#d9a520" />
          </button>
        </header>

        <p className="text-[11.5px] italic text-chess-text-muted leading-snug -mt-1">
          {REVENGE_TAGLINE}
        </p>

        {/* Lifetime readout */}
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Streak" value={stats.currentStreak} suffix={stats.currentStreak > 0 ? '🔥' : undefined} />
          <Stat label="Runs won" value={stats.wins} />
          <Stat label="Powers" value={abilitiesHave} of={abilitiesTotal} />
        </div>

        {/* 1 — Daily run */}
        <button
          type="button"
          onClick={onDaily}
          data-testid="home-daily"
          className="relative text-left rounded-2xl overflow-hidden bg-chess-surface border border-chess-text/10 shadow-sm active:translate-y-px transition-transform"
        >
          <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: '#E53935' }} />
          <div className="pl-5 pr-4 py-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9.5px] font-black uppercase tracking-[0.18em] text-chess-text-muted">
                  {dateLabel(iso)}
                </span>
                {wonToday ? (
                  <Pill tone="green">Cleared today</Pill>
                ) : playedToday ? (
                  <Pill tone="amber">Try again</Pill>
                ) : (
                  <Pill tone="red">New board</Pill>
                )}
              </div>
              <h2 className="text-[19px] font-black leading-tight mt-0.5">Daily Run</h2>
              <p className="text-[12px] text-chess-text-muted leading-snug mt-0.5">
                One board. Everybody gets the same one. Ten levels, take the king.
              </p>
            </div>
            <RevengeMarkSvg size={44} title="" />
          </div>
          <div
            className="mx-4 mb-4 rounded-xl py-2.5 text-center text-white font-black text-[13.5px] tracking-wide"
            style={{ background: '#E53935', boxShadow: '0 3px 0 #B71C1C' }}
          >
            {playedToday ? 'Play it again' : "Play today's run"} <span className="opacity-80">→</span>
          </div>
        </button>

        {/* 2 — Journey */}
        <button
          type="button"
          onClick={onJourney}
          data-testid="home-journey"
          className="relative text-left rounded-2xl overflow-hidden bg-chess-surface border border-chess-text/10 shadow-sm active:translate-y-px transition-transform"
        >
          <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: chapter.map.accent }} />
          <div className="pl-5 pr-4 py-4 flex flex-col gap-2.5">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-[9.5px] font-black uppercase tracking-[0.18em] text-chess-text-muted">
                  Chapter {chapter.map.n} of {JOURNEY_MAPS.length}
                </span>
                <h2 className="text-[19px] font-black leading-tight mt-0.5">Journey</h2>
                <p className="text-[12px] text-chess-text-muted leading-snug mt-0.5">
                  Fight through his castle one map at a time. Every map you clear
                  opens the next — and the powers you earn are yours for good.
                </p>
              </div>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-[17px] shrink-0"
                style={{ background: chapter.map.accent }}
              >
                {chapter.map.n}
              </div>
            </div>

            {/* Chapter pips */}
            <div className="flex items-center gap-1.5">
              {progress.map((p) => (
                <span
                  key={p.map.id}
                  className="h-1.5 flex-1 rounded-full"
                  style={{
                    background:
                      p.status === 'cleared'
                        ? p.map.accent
                        : p.status === 'open'
                          ? 'rgba(42,60,69,0.28)'
                          : 'rgba(42,60,69,0.10)',
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] font-black text-chess-text truncate">
                {chapter.map.name}
                <span className="text-chess-text-faint font-bold">
                  {' '}· {mapsDone}/{JOURNEY_MAPS.length} cleared
                </span>
              </span>
              <span className="text-[11.5px] font-black text-chess-text-muted shrink-0">
                {mapsDone > 0 ? 'Continue' : 'Start'} →
              </span>
            </div>
          </div>
        </button>

        {/* 3 — Leaderboard */}
        <button
          type="button"
          onClick={onLeaderboard}
          data-testid="home-leaderboard"
          className="relative text-left rounded-2xl overflow-hidden bg-chess-surface border border-chess-text/10 shadow-sm active:translate-y-px transition-transform"
        >
          <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: '#d9a520' }} />
          <div className="pl-5 pr-4 py-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9.5px] font-black uppercase tracking-[0.18em] text-chess-text-muted">
                  This week
                </span>
                <Pill tone="grey">Preview</Pill>
              </div>
              <h2 className="text-[19px] font-black leading-tight mt-0.5">Leaderboard</h2>
              <p className="text-[12px] text-chess-text-muted leading-snug mt-0.5">
                Who took the most pieces getting to him. Sample names for now —
                real standings land with accounts.
              </p>
            </div>
            <span className="text-[26px] shrink-0" aria-hidden>
              🏆
            </span>
          </div>
        </button>

        {/* Footer row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onTrophies}
            className="min-h-[52px] rounded-2xl border border-chess-text/12 bg-chess-surface px-3 py-2 text-left active:scale-[0.99] transition-transform"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-chess-text-muted">
              Trophy room
            </div>
            <div className="text-[12px] font-black text-chess-text tabular-nums mt-0.5">
              {trophiesHave}/{ACHIEVEMENTS.length} trophies
            </div>
          </button>
          <button
            type="button"
            onClick={onHowToPlay}
            className="min-h-[52px] rounded-2xl border border-chess-text/12 bg-chess-surface px-3 py-2 text-left active:scale-[0.99] transition-transform"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-chess-text-muted">
              New here?
            </div>
            <div className="text-[12px] font-black text-chess-text mt-0.5">How to play</div>
          </button>
        </div>

        <p className="text-[10.5px] text-chess-text-faint text-center leading-snug px-2">
          Difficulty: <span className="font-black">{DIFFICULTIES[profile.difficulty].name}</span> ·
          change it on the run screen before you start.
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  of,
  suffix,
}: {
  label: string;
  value: number;
  of?: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl bg-chess-surface border border-chess-text/10 px-2 py-2 text-center">
      <div className="text-[17px] font-black text-chess-text tabular-nums leading-none">
        {value}
        {of !== undefined && <span className="text-chess-text-faint text-[13px]">/{of}</span>}
        {suffix && <span className="text-[13px] ml-0.5">{suffix}</span>}
      </div>
      <div className="text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-muted mt-1">
        {label}
      </div>
    </div>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: 'red' | 'green' | 'amber' | 'grey';
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    red: 'bg-rose-100 text-rose-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-800',
    grey: 'bg-chess-text/10 text-chess-text-muted',
  };
  return (
    <span
      className={`text-[9px] font-black uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-full ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
