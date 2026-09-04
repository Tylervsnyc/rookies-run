'use client';

import { useEffect, useState } from 'react';
import { fireConfetti } from '@/lib/confetti';
import type { RunStats } from '@/lib/run/history';
import type { RunStars } from '@/lib/run/scoring';
import { SHARE_URL, buildShareText, encodeShareCard, type ShareCardData } from '@/lib/run/share';
import { REVENGE_RED, REVENGE_RED_DARK } from './RookiesRevengeLogo';
import { SHARE_CARD_H, SHARE_CARD_W, ShareCard } from './ShareCard';
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
  /** The run ended on the move budget, not a capture. */
  outOfMoves?: boolean;
  stats: RunStats;
  /** Plain-text share line — the last-resort fallback (clipboard). */
  shareString: string;
  /**
   * The share IMAGE's data (final board, kit, moves, stars). When set, Share
   * sends the rendered card (`/api/og/run`) through the share sheet and a
   * thumbnail in the button row opens a full preview.
   */
  shareCard?: ShareCardData | null;
  onReplay: () => void;
  /** X in the corner: leave the card (back to the home screen). */
  onClose?: () => void;
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
  /** Run stars (lib/run/scoring starsForRun). Only shown on a completed run. */
  stars?: RunStars;
  /** One-line star rule, e.g. "No retries · 32 moves, par 35". */
  starLine?: string;
}

const GOLD = '#FFC800';
const MUTED = 'rgba(255,255,255,0.6)';

export function RunSummaryModal({
  iso,
  totalLevels,
  levelReached,
  completed,
  outOfMoves = false,
  stats,
  shareString,
  shareCard,
  onReplay,
  onClose,
  nextRunName,
  onNextRun,
  difficultyLabel,
  score,
  timedScore,
  timeMs,
  stars,
  starLine,
}: RunSummaryModalProps) {
  const [shareState, setShareState] = useState<'idle' | 'busy' | 'shared' | 'copied'>('idle');
  const [previewOpen, setPreviewOpen] = useState(false);
  const imageUrl = shareCard ? `/api/og/run?${encodeShareCard(shareCard)}` : null;
  const shareText = shareCard ? buildShareText(shareCard) : shareString;

  // Warm the card render (immutable-cached) so the share sheet opens fast.
  useEffect(() => {
    if (!imageUrl) return;
    fetch(imageUrl).catch(() => {});
  }, [imageUrl]);

  // Confetti scales with stars: 1 star none, 2 stars the usual pair of
  // cannons, 3 stars a double burst (second wave lands with the third star).
  // No stars passed (STC runs) = the usual pair.
  useEffect(() => {
    if (!completed || stars === 1) return;
    const palette = [GOLD, '#ffffff', REVENGE_RED, '#f5cf5a'];
    const burst = () => {
      fireConfetti({ particleCount: 80, angle: 60, spread: 65, origin: { x: 0.15, y: 0.55 }, colors: palette, gravity: 1.1, ticks: 180 });
      fireConfetti({ particleCount: 80, angle: 120, spread: 65, origin: { x: 0.85, y: 0.55 }, colors: palette, gravity: 1.1, ticks: 180 });
    };
    const timers = [setTimeout(burst, 650)];
    if (stars === 3) {
      timers.push(
        setTimeout(() => {
          burst();
          fireConfetti({ particleCount: 120, spread: 100, startVelocity: 40, origin: { x: 0.5, y: 0.4 }, colors: [GOLD, '#f5cf5a', '#ffffff'], gravity: 0.9, ticks: 220 });
        }, 1900),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [completed, stars]);

  /**
   * Share, best effort first: the card as a PNG file through the share sheet
   * (iOS/Android), then text + link through the share sheet, then the
   * clipboard. A dismissed sheet (AbortError) is not a failure — stop there.
   */
  const handleShare = async () => {
    if (shareState === 'busy') return;
    setShareState('busy');
    const settle = (next: 'idle' | 'shared' | 'copied') => {
      setShareState(next);
      if (next !== 'idle') setTimeout(() => setShareState('idle'), 1500);
    };
    const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean };
    const aborted = (e: unknown) => (e as { name?: string } | null)?.name === 'AbortError';

    if (imageUrl && shareCard && typeof nav.share === 'function' && typeof nav.canShare === 'function') {
      try {
        const res = await fetch(imageUrl);
        if (res.ok) {
          const file = new File([await res.blob()], `rookies-revenge-${shareCard.iso}.png`, { type: 'image/png' });
          if (nav.canShare({ files: [file] })) {
            await nav.share({ files: [file], text: shareText, url: SHARE_URL });
            settle('shared');
            return;
          }
        }
      } catch (e) {
        if (aborted(e)) {
          settle('idle');
          return;
        }
      }
    }
    if (typeof nav.share === 'function') {
      try {
        await nav.share({ text: shareText, url: SHARE_URL });
        settle('shared');
        return;
      } catch (e) {
        if (aborted(e)) {
          settle('idle');
          return;
        }
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${SHARE_URL}`);
      settle('copied');
    } catch {
      settle('idle');
    }
  };
  const shareLabel = shareState === 'busy' ? 'Sharing…' : shareState === 'shared' ? 'Shared!' : shareState === 'copied' ? 'Copied!' : 'Share';

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
      stamp={completed ? 'Run complete' : outOfMoves ? 'Out of moves' : 'Captured'}
      tone={completed ? 'won' : 'lost'}
      stars={completed ? stars : undefined}
      starLine={completed ? starLine : undefined}
      onClose={onClose}
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

      {/* Levels reached — ONE compact strip (Tyler 2026-09-03: the card must
          fit one phone screen). Ten columns, bar height = share of runs that
          ended on that level; today's level is lit. */}
      <div className="mt-2 text-left">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: MUTED }}>Levels reached</span>
          <span className="text-[10px] font-bold tabular-nums" style={{ color: MUTED }}>{stats.played} runs</span>
        </div>
        <div className="grid grid-cols-10 gap-1 items-end px-1" style={{ height: 44 }}>
          {rows.map((r, idx) => (
            <div key={r.level} className="relative h-full flex items-end rounded-sm overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)' }}>
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${Math.max(r.count > 0 ? 18 : 0, r.pct)}%`,
                  background: r.isToday ? (completed ? GOLD : REVENGE_RED) : 'rgba(255,255,255,0.22)',
                  transformOrigin: 'bottom center',
                  animation: 'rrStampBar 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
                  animationDelay: `${900 + idx * 40}ms`,
                }}
              />
              {r.isToday && r.count === 0 && (
                <div className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: completed ? GOLD : REVENGE_RED }} />
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-10 gap-1 px-1 mt-0.5">
          {rows.map((r) => (
            <div key={r.level} className="text-center text-[9px] font-black tabular-nums" style={{ color: r.isToday ? (completed ? GOLD : '#FF6B66') : MUTED }}>
              {r.level}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes rrStampBar { from { transform: scaleY(0); } to { transform: scaleY(1); } }
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
        <div className="flex gap-2 justify-center items-center">
          {shareCard && (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              aria-label="Preview share card"
              className="rounded-md overflow-hidden active:scale-95 transition-transform"
              style={{ width: 44, height: 55, boxShadow: '0 0 0 2px rgba(255,255,255,0.25)' }}
            >
              <ShareCardScaled data={shareCard} width={44} />
            </button>
          )}
          <button type="button" onClick={handleShare} disabled={shareState === 'busy'} className="min-h-[40px] px-4 text-[12px] font-black rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
            {shareLabel}
          </button>
          {completed && nextRunName && onNextRun && (
            <button type="button" onClick={onReplay} className="min-h-[40px] px-4 text-[12px] font-black" style={{ color: MUTED }}>
              Replay this run
            </button>
          )}
        </div>
      </div>

      {previewOpen && shareCard && (
        <SharePreview data={shareCard} shareLabel={shareLabel} onShare={handleShare} onClose={() => setPreviewOpen(false)} />
      )}
    </StampCard>
  );
}

/** The card at a given width (the 1080x1350 renderer, CSS-scaled). */
function ShareCardScaled({ data, width }: { data: ShareCardData; width: number }) {
  const scale = width / SHARE_CARD_W;
  return (
    <div style={{ width, height: SHARE_CARD_H * scale, position: 'relative', overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <ShareCard data={data} />
      </div>
    </div>
  );
}

/**
 * Tap-to-preview: the card as large as the phone allows, with Share under it.
 * A thumbnail is all the summary card has room for (it must fit one screen).
 */
function SharePreview({ data, shareLabel, onShare, onClose }: { data: ShareCardData; shareLabel: string; onShare: () => void; onClose: () => void }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Leave room for the buttons (≈130px) and side padding.
      setWidth(Math.floor(Math.min(vw - 32, ((vh - 150) * SHARE_CARD_W) / SHARE_CARD_H, 520)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 px-4" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose} role="dialog" aria-label="Share card preview">
      <div className="rounded-xl overflow-hidden" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }} onClick={(e) => e.stopPropagation()}>
        {width > 0 && <ShareCardScaled data={data} width={width} />}
      </div>
      <div className="flex gap-2 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <StampButton color={REVENGE_RED} shadow={REVENGE_RED_DARK} onClick={onShare}>
          {shareLabel}
        </StampButton>
      </div>
      <button type="button" onClick={onClose} className="min-h-[44px] px-4 text-[13px] font-black" style={{ color: MUTED }}>
        Close
      </button>
    </div>
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
