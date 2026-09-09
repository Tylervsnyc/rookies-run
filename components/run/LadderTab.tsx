'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { withClick } from '@/lib/sounds';
import { REVENGE_RED, REVENGE_RED_DARK } from './RookiesRevengeLogo';
import type { PlayerProfile } from '@/lib/run/profile';
import {
  DIFFICULTIES,
  DIFFICULTY_ORDER,
  difficultyLockHint,
  isDifficultyLocked,
  type DifficultyId,
} from '@/lib/run/difficulty';
import { LADDER_RUNG_IDS, bestClearedDifficulty, rungRun, rungStars, rungState } from '@/lib/run/ladder';
import type { RunStars } from '@/lib/run/scoring';

/**
 * The Ladder tab (ArenaHome → Ladder). Ten rungs, 2 columns × 5 rows, sized
 * to fit under the fixed board on an iPhone SE with no scroll. Each rung
 * shows its number, run name, the BEST difficulty it was cleared on and the
 * stars for that clear. Tapping an open/cleared rung opens the difficulty
 * chooser (a bottom sheet): the four modes with the stars earned on each,
 * gated exactly like lib/run/difficulty.ts. Picking one calls
 * `onLadderStart(runId, difficulty)`.
 */
export interface LadderTabProps {
  profile?: PlayerProfile;
  onLadderStart?: (runId: string, difficulty: DifficultyId) => void;
}

// ── Kit (mirrors ArenaHome's palette — kept local so ArenaHome stays untouched) ──
const GOLD = '#FFC800';
const OUTLINE: CSSProperties = { color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.45), -1px 0 0 rgba(0,0,0,0.35), 1px 0 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(0,0,0,0.35)' };
const GOLD_TEXT: CSSProperties = { color: GOLD, textShadow: '0 2px 0 rgba(0,0,0,0.5)' };
const LOCKED_FACE = '#22305e';
const LOCKED_SHADOW = '#0a1230';

/** Face + hard-shadow colour per difficulty (Chess Path flat-face button pattern). */
const DIFF_COLORS: Record<DifficultyId, { face: string; shadow: string }> = {
  rookie: { face: '#58CC02', shadow: '#3d8c01' },
  normal: { face: '#1CB0F6', shadow: '#1385BD' },
  hard: { face: REVENGE_RED, shadow: REVENGE_RED_DARK },
  nightmare: { face: '#8A4DFF', shadow: '#5A2FB8' },
};

function Stars({ n, size = 11 }: { n: RunStars | number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-[1px] leading-none" aria-label={`${n} of 3 stars`} style={{ fontSize: size }}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={i <= n ? { ...GOLD_TEXT } : { color: 'rgba(255,255,255,0.28)' }}>★</span>
      ))}
    </span>
  );
}

// ── The chooser ──────────────────────────────────────────────────────────────
function DifficultyChooser({ rungIndex, runId, runName, profile, onPick, onClose }: {
  rungIndex: number;
  runId: string;
  runName: string;
  profile?: PlayerProfile;
  onPick: (d: DifficultyId) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const best = bestClearedDifficulty(profile, runId);
  // Portalled to <body>: the home's tab region is overflow-hidden and sits
  // under a transformed ancestor, which would clip a fixed sheet.
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={`Choose difficulty for rung ${rungIndex + 1}`}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0" style={{ background: 'rgba(3,8,24,0.72)' }} />
      <div
        className="relative w-full max-w-[430px] rounded-t-[22px] px-3 pt-3 pb-[max(env(safe-area-inset-bottom),14px)] ladder-sheet-in"
        style={{ background: 'linear-gradient(180deg,#1c2f63 0%,#0f1c3f 100%)', border: '2px solid #3a4f8f', borderBottom: 'none', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.14), 0 -10px 30px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center justify-between px-1">
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: '#FF6B66' }}>Rung {rungIndex + 1}</div>
            <div className="text-[20px] font-black leading-tight truncate" style={OUTLINE}>{runName}</div>
          </div>
          <button type="button" onClick={withClick(onClose)} className="min-h-[36px] min-w-[44px] text-[11px] font-black px-2.5 rounded-lg shrink-0" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}>Close</button>
        </div>
        <div className="mt-1 px-1 text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>Pick a difficulty. Stars are per mode — clear it on any mode to open the next rung.</div>
        <div className="mt-2.5 flex flex-col gap-2">
          {DIFFICULTY_ORDER.map((d) => {
            const def = DIFFICULTIES[d];
            const locked = isDifficultyLocked(d, profile);
            const stars = rungStars(profile, runId, d);
            const c = locked ? { face: LOCKED_FACE, shadow: LOCKED_SHADOW } : DIFF_COLORS[d];
            return (
              <button
                key={d}
                type="button"
                disabled={locked}
                onClick={withClick(() => onPick(d))}
                data-difficulty={d}
                className="arena-press w-full rounded-[14px] min-h-[52px] px-3 py-2 flex items-center gap-3 text-left"
                style={{
                  background: c.face,
                  boxShadow: `0 5px 0 ${c.shadow}`,
                  ['--depth' as string]: '5px',
                  opacity: locked ? 0.55 : 1,
                  outline: !locked && best === d ? `2px solid ${GOLD}` : undefined,
                  outlineOffset: -2,
                }}
              >
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="text-[15px] font-black leading-none" style={OUTLINE}>{def.name}</span>
                    {best === d && <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-[2px] rounded-md" style={{ background: 'rgba(0,0,0,0.3)', ...GOLD_TEXT }}>Best</span>}
                  </span>
                  <span className="block mt-1 text-[10.5px] font-bold leading-snug truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {locked ? difficultyLockHint(d) : def.tagline}
                  </span>
                </span>
                <span className="flex flex-col items-end shrink-0 gap-[3px]">
                  <Stars n={locked ? 0 : stars} size={14} />
                  <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {locked ? 'Locked' : stars > 0 ? 'Cleared' : 'Not yet'}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ── The tab ──────────────────────────────────────────────────────────────────
export function LadderTab({ profile, onLadderStart }: LadderTabProps) {
  const [choosing, setChoosing] = useState<number | null>(null);
  const rungs = LADDER_RUNG_IDS.map((id, i) => {
    const run = rungRun(i);
    const state = rungState(profile, i);
    return { id, run, state, comingSoon: !run, best: bestClearedDifficulty(profile, id) };
  });
  const openIdx = rungs.findIndex((r) => r.state === 'open' && !r.comingSoon);
  const clearedCount = rungs.filter((r) => r.state === 'cleared').length;
  const chosen = choosing !== null ? rungs[choosing] : null;

  return (
    <div className="h-full flex flex-col">
      <style>{`
        @keyframes ladder-sheet-in { from { transform: translateY(24px); opacity: 0; } to { transform: none; opacity: 1; } }
        .ladder-sheet-in { animation: ladder-sheet-in 240ms cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .ladder-sheet-in { animation: none; } }
      `}</style>
      <div className="flex items-baseline justify-between px-1">
        <span className="text-[14px] font-black" style={OUTLINE}>The Ladder</span>
        <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {clearedCount}/10 cleared{openIdx >= 0 ? ` · next: rung ${openIdx + 1}` : ''}
        </span>
      </div>
      <div className="mt-2 flex-1 min-h-0 grid grid-cols-2 grid-rows-5 gap-x-2 gap-y-[7px]">
        {rungs.map((r, i) => {
          const playable = !r.comingSoon && r.state !== 'locked' && !!onLadderStart;
          const st = r.state === 'cleared' ? 'done' : r.state === 'open' && !r.comingSoon ? 'next' : 'locked';
          const face = st === 'done' ? (r.best ? DIFF_COLORS[r.best].face : '#58CC02') : st === 'next' ? REVENGE_RED : LOCKED_FACE;
          const shadow = st === 'done' ? (r.best ? DIFF_COLORS[r.best].shadow : '#3d8c01') : st === 'next' ? REVENGE_RED_DARK : LOCKED_SHADOW;
          const stars = r.best ? rungStars(profile, r.id, r.best) : 0;
          const meta = r.comingSoon
            ? 'Coming soon'
            : st === 'done'
              ? (r.best ? DIFFICULTIES[r.best].name : 'Cleared')
              : st === 'next'
                ? 'Open · pick a mode'
                : `Clear rung ${i}`;
          return (
            <button
              key={r.id}
              type="button"
              disabled={!playable}
              onClick={withClick(() => { if (playable) setChoosing(i); })}
              data-rung={i + 1}
              data-run-id={r.id}
              data-best={r.best ?? ''}
              data-stars={stars}
              className="arena-press rounded-xl min-h-0 h-full px-2 flex items-center gap-2 text-left"
              style={{
                background: face,
                boxShadow: `0 4px 0 ${shadow}`,
                ['--depth' as string]: '4px',
                opacity: st === 'locked' ? 0.55 : 1,
              }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[14px] font-black shrink-0"
                style={{ background: 'rgba(0,0,0,0.28)', boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.25)', ...OUTLINE }}
              >
                {st === 'done' ? '✓' : i + 1}
              </span>
              <span className="flex-1 min-w-0 flex flex-col justify-center leading-none">
                <span className="text-[11.5px] font-black truncate" style={OUTLINE}>{r.run?.name ?? `Rung ${i + 1}`}</span>
                <span className="mt-[3px] flex items-center gap-1.5">
                  {st === 'done' && <Stars n={stars} size={10} />}
                  <span className="text-[8.5px] font-black uppercase tracking-wider truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>{meta}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {chosen && choosing !== null && (
        <DifficultyChooser
          rungIndex={choosing}
          runId={chosen.id}
          runName={chosen.run?.name ?? `Rung ${choosing + 1}`}
          profile={profile}
          onPick={(d) => { setChoosing(null); onLadderStart?.(chosen.id, d); }}
          onClose={() => setChoosing(null)}
        />
      )}
    </div>
  );
}
