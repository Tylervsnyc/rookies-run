'use client';

import { REVENGE_TAGLINE, RookiesRevengeLogo } from './RookiesRevengeLogo';
import { TrophyGlyph } from './AchievementToast';
import { ACHIEVEMENTS } from '@/lib/run/achievements';
import { unlockableAbilityIds, type PlayerProfile } from '@/lib/run/profile';
import { useEffect, useState } from 'react';
import {
  DIFFICULTIES,
  DIFFICULTY_ORDER,
  difficultyLockHint,
  isDifficultyLocked,
  type DifficultyId,
} from '@/lib/run/difficulty';

interface RunLandingProps {
  onStart: () => void;
  /** Optional tagline override (e.g. STC co-brand). */
  tagline?: string;
  /** Optional display date label (e.g. "May 26"). */
  dateLabel?: string;
  /** Meta-progression readout + Trophy Room entry. */
  profile?: PlayerProfile;
  onTrophies?: () => void;
  /** Difficulty picker (Rookie's Revenge). Omit both to hide it. */
  difficulty?: DifficultyId;
  onDifficultyChange?: (d: DifficultyId) => void;
  /** Back to the home screen. Omitted on deep links that have no home to return to. */
  onBack?: () => void;
  /** Start-button label. Defaults to the daily wording. */
  ctaLabel?: string;
}

const VIDEO_SRC = '/run/landing-board.mp4';

const RULES: { n: number; title: string; sub: string }[] = [
  { n: 1, title: 'The goal.',    sub: 'Capture their king. He beat her. Nobody told her it was over.' },
  { n: 2, title: 'The enemies.', sub: 'His whole army, between you and him.' },
  { n: 3, title: 'The morals.',  sub: 'Zero. Earn powers. Win ugly.' },
];

export function RunLanding({
  onStart,
  tagline,
  dateLabel,
  profile,
  onTrophies,
  difficulty,
  onDifficultyChange,
  onBack,
  ctaLabel,
}: RunLandingProps) {
  const abilitiesTotal = unlockableAbilityIds().length;
  const showPicker = !!difficulty && !!onDifficultyChange;
  const activeDef = difficulty ? DIFFICULTIES[difficulty] : null;
  const isLocked = (id: DifficultyId): boolean => isDifficultyLocked(id, profile);
  const [lockHint, setLockHint] = useState<string | null>(null);
  // If the saved pick is locked (e.g. an older profile defaulted to Normal
  // before it was gated), fall back to the first open difficulty.
  useEffect(() => {
    if (!showPicker || !difficulty || !isLocked(difficulty)) return;
    const open = DIFFICULTY_ORDER.find((id) => !isLocked(id));
    if (open && open !== difficulty) onDifficultyChange?.(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPicker, difficulty, profile]);
  useEffect(() => {
    if (!lockHint) return;
    const t = setTimeout(() => setLockHint(null), 2200);
    return () => clearTimeout(t);
  }, [lockHint]);
  const abilitiesHave = profile ? profile.unlockedAbilities.length : 0;
  const trophiesHave = profile ? Object.keys(profile.achievements).length : 0;
  return (
    <div className="h-full w-full bg-chess-page text-chess-text flex items-center justify-center px-3 py-2">
      <div className="w-full max-w-[360px] bg-white rounded-2xl p-3 shadow-sm border border-chess-text/10 flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Back to home"
                className="w-9 h-9 -ml-1 rounded-lg flex items-center justify-center active:scale-90 transition-transform shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-chess-text-muted">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <RookiesRevengeLogo scale={0.4} />
          </div>
          {dateLabel && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-chess-text-muted font-bold">
              {dateLabel}
            </span>
          )}
        </div>

        {/* Headline */}
        <div>
          <p className="text-[16px] font-black text-chess-text leading-tight">
            One rook. Their whole army. Take the king.
          </p>
          <p className="text-[11px] text-chess-text-muted italic leading-snug mt-0.5">
            {tagline ?? REVENGE_TAGLINE}
          </p>
        </div>

        {/* Difficulty picker */}
        {showPicker && activeDef && (
          <div className="flex flex-col gap-1" data-testid="difficulty-picker">
            <div
              role="radiogroup"
              aria-label="Difficulty"
              className="grid grid-cols-4 gap-1 rounded-xl bg-chess-page p-1 border border-chess-text/10"
            >
              {DIFFICULTY_ORDER.map((id) => {
                const def = DIFFICULTIES[id];
                const active = id === difficulty;
                const locked = isLocked(id);
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-disabled={locked}
                    data-difficulty={id}
                    onClick={() => {
                      if (locked) {
                        setLockHint(difficultyLockHint(id));
                        return;
                      }
                      setLockHint(null);
                      onDifficultyChange?.(id);
                    }}
                    className={`min-h-[44px] rounded-lg px-0.5 text-[10.5px] font-black leading-tight transition-colors flex items-center justify-center gap-0.5 ${
                      active
                        ? 'bg-chess-text text-white shadow-sm'
                        : locked
                          ? 'text-chess-text-faint opacity-60'
                          : 'text-chess-text-muted active:bg-chess-text/10'
                    }`}
                  >
                    {locked && (
                      <svg width="9" height="11" viewBox="0 0 9 11" aria-hidden className="shrink-0">
                        <rect x="0.5" y="4.5" width="8" height="6" rx="1.2" fill="currentColor" />
                        <path d="M2 4.5V3a2.5 2.5 0 0 1 5 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    )}
                    <span className="truncate">{def.name}</span>
                  </button>
                );
              })}
            </div>
            <p
              className="text-[11px] italic text-chess-text-muted leading-snug px-1 min-h-[14px]"
              aria-live="polite"
            >
              {lockHint ? (
                <span className="not-italic font-bold text-chess-text">{lockHint}</span>
              ) : (
                <>
                  {activeDef.tagline}
                  {isLocked('normal') ? (
                    <span className="not-italic text-chess-text-faint"> · Clear Rookie to unlock Normal and Hard.</span>
                  ) : isLocked('nightmare') ? (
                    <span className="not-italic text-chess-text-faint"> · Nightmare: finish a run on Hard.</span>
                  ) : null}
                </>
              )}
            </p>
          </div>
        )}

        {/* Footage — capped height so the page fits a phone */}
        <div className="relative rounded-xl overflow-hidden border border-chess-text/15 bg-chess-page">
          <video
            src={VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            className="block w-full h-[260px] object-contain"
          />
        </div>

        {/* Rules */}
        <ol className="flex flex-col gap-1">
          {RULES.map((r) => (
            <li key={r.n} className="flex items-baseline gap-2">
              <span className="shrink-0 w-4 h-4 rounded-full bg-chess-text text-white font-black flex items-center justify-center text-[9px]">
                {r.n}
              </span>
              <p className="text-[12px] leading-snug">
                <span className="font-black text-chess-text">{r.title}</span>{' '}
                <span className="text-chess-text-muted">{r.sub}</span>
              </p>
            </li>
          ))}
        </ol>

        {profile && onTrophies && (
          <button
            type="button"
            onClick={onTrophies}
            className="w-full flex items-center justify-between gap-2 rounded-xl border border-chess-text/12 bg-chess-page px-3 py-2 active:scale-[0.99] transition-transform"
            aria-label="Open trophy room"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-chess-text flex items-center justify-center shrink-0">
                <TrophyGlyph size={15} />
              </span>
              <span className="text-[11px] font-black text-chess-text truncate">
                Powers <span className="tabular-nums">{abilitiesHave}/{abilitiesTotal}</span>
                <span className="text-chess-text-faint mx-1.5">·</span>
                Trophies <span className="tabular-nums">{trophiesHave}/{ACHIEVEMENTS.length}</span>
              </span>
            </span>
            <span className="text-[11px] font-black text-chess-text-muted">Trophy Room →</span>
          </button>
        )}

        <button
          type="button"
          onClick={onStart}
          className="w-full py-3 rounded-2xl bg-chess-text text-white font-black text-[14px] tracking-wide active:translate-y-px transition-transform"
          style={{ boxShadow: '0 4px 0 #1a2c33, 0 6px 12px rgba(0,0,0,0.12)' }}
        >
          {ctaLabel ?? "Play Today's Run"} <span className="opacity-80">→</span>
        </button>
      </div>
    </div>
  );
}
