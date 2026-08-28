'use client';

import { useEffect, useMemo, useState } from 'react';
import { JOURNEY_MAPS, journeyProgress, mapLockHint, type MapProgress } from '@/lib/run/journey';
import type { RunHistoryEntry } from '@/lib/run/history';
import { RookiesRevengeLogo } from './RookiesRevengeLogo';

interface JourneyScreenProps {
  history: RunHistoryEntry[];
  /** Fired with the map's runId — the caller loads that run. */
  onPlay: (runId: string, mapId: string) => void;
  onBack: () => void;
}

/**
 * Map select. A vertical ladder of chapters: cleared, playable, locked behind
 * the chapter before it, or not built yet. Progress is derived from local run
 * history (see lib/run/journey.ts) — this screen stores nothing.
 */
export function JourneyScreen({ history, onPlay, onBack }: JourneyScreenProps) {
  const progress = useMemo(() => journeyProgress(history), [history]);
  const [hint, setHint] = useState<string | null>(null);
  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), 2200);
    return () => clearTimeout(t);
  }, [hint]);

  return (
    <div className="h-full w-full overflow-auto bg-chess-page text-chess-text">
      <div className="mx-auto w-full max-w-[420px] md:max-w-[520px] px-4 pt-4 pb-10 flex flex-col gap-3">
        <header className="flex items-center gap-3">
          <BackButton onClick={onBack} />
          <RookiesRevengeLogo scale={0.34} />
        </header>

        <div>
          <h1 className="text-[22px] font-black leading-tight">The Journey</h1>
          <p className="text-[12px] text-chess-text-muted leading-snug mt-0.5">
            Five maps between her and the throne. Clear one to open the next.
            Powers you unlock along the way stay unlocked.
          </p>
        </div>

        <p className="text-[11.5px] font-black text-chess-text min-h-[16px]" aria-live="polite">
          {hint}
        </p>

        <ol className="flex flex-col">
          {progress.map((p, i) => (
            <MapNode
              key={p.map.id}
              p={p}
              last={i === progress.length - 1}
              onPick={() => {
                if (p.status === 'open' || p.status === 'cleared') {
                  if (p.map.runId) onPlay(p.map.runId, p.map.id);
                  return;
                }
                setHint(mapLockHint(progress, i));
              }}
            />
          ))}
        </ol>

        <p className="text-[10.5px] text-chess-text-faint text-center leading-snug px-4 mt-1">
          Chapters 2–{JOURNEY_MAPS.length} are being built. Chapter 1 is the full
          ten-level hunt — clear it and the rest arrive angrier.
        </p>
      </div>
    </div>
  );
}

function MapNode({ p, last, onPick }: { p: MapProgress; last: boolean; onPick: () => void }) {
  const playable = p.status === 'open' || p.status === 'cleared';
  const accent = playable ? p.map.accent : '#94a3b8';
  return (
    <li className="flex gap-3">
      {/* Rail */}
      <div className="flex flex-col items-center shrink-0 w-11">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-[17px] shrink-0"
          style={{
            background: playable ? accent : 'rgba(42,60,69,0.10)',
            color: playable ? '#fff' : '#94a3b8',
          }}
        >
          {p.status === 'cleared' ? '★' : p.status === 'open' ? p.map.n : <LockGlyph />}
        </div>
        {!last && (
          <div
            className="w-1 flex-1 min-h-[18px] my-1 rounded-full"
            style={{ background: p.status === 'cleared' ? accent : 'rgba(42,60,69,0.12)' }}
          />
        )}
      </div>

      {/* Card */}
      <button
        type="button"
        onClick={onPick}
        data-testid={`journey-map-${p.map.id}`}
        aria-disabled={!playable}
        className={`flex-1 min-w-0 text-left rounded-2xl border px-3.5 py-3 mb-2 transition-transform active:scale-[0.99] ${
          playable
            ? 'bg-chess-surface border-chess-text/12 shadow-sm'
            : 'bg-chess-surface/60 border-chess-text/8'
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <h2
            className={`text-[15px] font-black leading-tight ${
              playable ? 'text-chess-text' : 'text-chess-text-faint'
            }`}
          >
            {p.map.name}
          </h2>
          {p.status === 'cleared' && <Tag tone="green">Cleared</Tag>}
          {p.status === 'open' && p.bestLevel > 0 && <Tag tone="amber">Best L{p.bestLevel}</Tag>}
          {p.status === 'soon' && <Tag tone="grey">In the works</Tag>}
          {p.status === 'locked' && <Tag tone="grey">Locked</Tag>}
        </div>
        <p
          className={`text-[11.5px] leading-snug mt-1 ${
            playable ? 'text-chess-text-muted' : 'text-chess-text-faint'
          }`}
        >
          {p.map.blurb}
        </p>
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-chess-text-faint">
            {p.levels} levels
          </span>
          {playable && (
            <span className="text-[11.5px] font-black" style={{ color: accent }}>
              {p.status === 'cleared' ? 'Run it again' : p.bestLevel > 0 ? 'Continue' : 'Enter'} →
            </span>
          )}
        </div>
      </button>
    </li>
  );
}

function Tag({ tone, children }: { tone: 'green' | 'amber' | 'grey'; children: React.ReactNode }) {
  const tones: Record<string, string> = {
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

function LockGlyph() {
  return (
    <svg width="13" height="16" viewBox="0 0 9 11" aria-hidden>
      <rect x="0.5" y="4.5" width="8" height="6" rx="1.2" fill="currentColor" />
      <path d="M2 4.5V3a2.5 2.5 0 0 1 5 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function BackButton({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-11 h-11 rounded-xl bg-chess-surface shadow-sm flex items-center justify-center active:scale-90 transition-transform shrink-0"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-chess-text-muted">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
