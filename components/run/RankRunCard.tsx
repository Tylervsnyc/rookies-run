'use client';

/**
 * One row of the TODAY Ranks board, with its run card (Tyler 2026-09-21: "a
 * more detailed score in the ranks, not just 10/10... how many moves were
 * used? Something cool").
 *
 * Collapsed: medal, handle, three stars, points. Tap -> the row opens in place
 * into a compact run card: difficulty, moves vs par, time, captures, retries,
 * levels. One open at a time (the parent owns `open`). Every number is the one
 * the run-summary screen showed for that run (api/run/score stores them only
 * together with the score).
 *
 * Rows with no stats (builds before 2026-09-21) render exactly as before —
 * points over levels, not tappable.
 */
import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react';
import type { LeaderboardRow } from '@/lib/run/leaderboard-client';
import { DIFFICULTIES, type DifficultyId } from '@/lib/run/difficulty';
import { withClick } from '@/lib/sounds';
import { STAR_PATH } from './StampCard';

// Same kit as ArenaHome's Ranks tab.
const GOLD = '#FFC800';
const GOLD_TEXT: CSSProperties = { color: GOLD, textShadow: '0 2px 0 rgba(0,0,0,0.5)' };
const ME_ROW: CSSProperties = { background: 'rgba(229,57,53,0.28)', border: '1.5px solid rgba(229,57,53,0.6)' };
const MUTED = 'rgba(255,255,255,0.62)';

const DIFF_COLOR: Record<DifficultyId, { bg: string; fg: string }> = {
  rookie: { bg: '#43A047', fg: '#fff' },
  normal: { bg: '#1E88E5', fg: '#fff' },
  hard: { bg: '#FB8C00', fg: '#2a1400' },
  nightmare: { bg: '#8E24AA', fg: '#fff' },
};

export function formatRunTime(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

/** A row has a run card once a new build sent its stats with the score. */
export function hasRunCard(r: LeaderboardRow): boolean {
  return r.score != null && r.moves != null;
}

function Medal({ rank }: { rank: number }) {
  const bg = rank === 1 ? GOLD : rank === 2 ? '#CFD8DC' : rank === 3 ? '#D08A4E' : 'rgba(255,255,255,0.12)';
  const fg = rank <= 3 ? '#3a2a00' : '#fff';
  return <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0" style={{ background: bg, color: fg, boxShadow: rank <= 3 ? 'inset 0 -2px 0 rgba(0,0,0,0.25)' : undefined }}>{rank}</span>;
}

export function MiniStars({ stars, size = 12 }: { stars: number; size?: number }) {
  return (
    <span className="inline-flex gap-[1px] shrink-0" role="img" aria-label={`${stars} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden className="block">
          <path
            d={STAR_PATH}
            fill={i < stars ? GOLD : 'rgba(255,255,255,0.10)'}
            stroke={i < stars ? '#8a5a00' : 'rgba(255,255,255,0.32)'}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

/** Pre-card rows: points over levels (unchanged from the score-only board). */
function PlainPoints({ score, levels }: { score: number | null; levels: number }) {
  if (score == null) return <>{levels}/10</>;
  return (
    <span className="inline-flex flex-col items-end leading-none">
      <span>{score.toLocaleString('en-US')}<span className="text-[9px] opacity-80"> pts</span></span>
      <span className="text-[9px] font-bold opacity-70 mt-0.5">{levels}/10</span>
    </span>
  );
}

function Tile({ label, children, sub, subStyle }: { label: string; children: ReactNode; sub?: string; subStyle?: CSSProperties }) {
  return (
    <div className="rounded-lg px-2 py-1.5 min-w-0" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="text-[9px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
      <div className="text-[17px] font-black leading-tight tabular-nums text-white truncate">{children}</div>
      {sub && <div className="text-[10px] font-bold leading-tight truncate" style={subStyle ?? { color: MUTED }}>{sub}</div>}
    </div>
  );
}

function RunCard({ row }: { row: LeaderboardRow }) {
  const diff = (row.difficulty ?? 'normal') as DifficultyId;
  const diffName = DIFFICULTIES[diff]?.name ?? row.difficulty ?? 'Normal';
  const diffColor = DIFF_COLOR[diff] ?? DIFF_COLOR.normal;
  const moves = row.moves ?? 0;
  const par = row.parMoves;
  const delta = par == null ? null : moves - par;
  // Par is for the whole run, so it only means something on a finished one.
  const parLine = delta == null || !row.completed
    ? undefined
    : delta < 0 ? `${-delta} under par` : delta === 0 ? 'on par' : `${delta} over par`;
  const parStyle: CSSProperties | undefined = delta != null && delta <= 0 ? { color: GOLD } : undefined;
  const retries = row.retries;
  return (
    <div className="pt-1.5 pb-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="rounded-md px-1.5 py-[2px] text-[10px] font-black uppercase tracking-wider" style={{ background: diffColor.bg, color: diffColor.fg, boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.25)' }}>
          {diffName}
        </span>
        <span className="text-[11px] font-black text-white tabular-nums">{row.levels}/10<span className="font-bold" style={{ color: MUTED }}> levels</span></span>
        {retries != null && (
          <span className="ml-auto text-[11px] font-black" style={retries === 0 ? { color: GOLD } : { color: MUTED }}>
            {retries === 0 ? 'No retries' : `${retries} ${retries === 1 ? 'retry' : 'retries'}`}
          </span>
        )}
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5">
        <Tile label="Moves" sub={parLine} subStyle={parStyle}>
          {moves}
          {par != null && row.completed && <span className="text-[10px] font-bold" style={{ color: MUTED }}> / {par}</span>}
        </Tile>
        <Tile label="Time">{row.timeMs != null ? formatRunTime(row.timeMs) : '--'}</Tile>
        <Tile label="Captures">{row.captures}</Tile>
      </div>
    </div>
  );
}

export function DailyRankRow({ row, handle, open, onToggle, className = '' }: {
  row: LeaderboardRow;
  /** Display name override (the "you" row below the top five uses the local handle). */
  handle?: string;
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const bodyId = useId();
  const liRef = useRef<HTMLLIElement>(null);
  const card = hasRunCard(row);
  const name = `${handle ?? row.handle}${row.me ? ' (you)' : ''}`;

  // Bring an opened card fully into view once it has grown (the Ranks
  // surround is a short scroller on small phones).
  useEffect(() => {
    if (!open) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // Scroll only the list (data-rank-scroller), never the page around it.
    const t = setTimeout(() => {
      const li = liRef.current;
      const box = li?.closest<HTMLElement>('[data-rank-scroller]');
      if (!li || !box) return;
      const over = li.getBoundingClientRect().bottom - box.getBoundingClientRect().bottom;
      const under = box.getBoundingClientRect().top - li.getBoundingClientRect().top;
      const dy = under > 0 ? -under : over > 0 ? Math.min(over, -under) : 0;
      if (dy) box.scrollBy({ top: dy, behavior: reduced ? 'auto' : 'smooth' });
    }, reduced ? 0 : 230);
    return () => clearTimeout(t);
  }, [open]);

  const rowStyle: CSSProperties = row.me
    ? ME_ROW
    : { borderBottom: '1px solid rgba(255,255,255,0.07)', background: open ? 'rgba(255,255,255,0.06)' : undefined, transition: 'background 160ms ease-out' };

  const head = (
    <>
      <Medal rank={row.rank} />
      <span className={`flex-1 min-w-0 truncate text-left ${row.me ? 'font-black' : 'font-bold'}`}>{name}</span>
      {card ? (
        <>
          <MiniStars stars={row.stars ?? 0} />
          <span className="tabular-nums font-black text-right min-w-[64px]" style={GOLD_TEXT}>
            {(row.score ?? 0).toLocaleString('en-US')}<span className="text-[9px] opacity-80"> pts</span>
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="shrink-0 rr-rank-chev" style={{ transform: open ? 'rotate(180deg)' : undefined }}>
            <path d="M1.5 3.5L5 7l3.5-3.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </>
      ) : (
        <span className="tabular-nums font-black" style={GOLD_TEXT}><PlainPoints score={row.score} levels={row.levels} /></span>
      )}
    </>
  );

  if (!card) {
    return (
      <li className={`flex items-center gap-2.5 min-h-[44px] py-[5px] text-[12px] rounded-lg px-2 -mx-2 ${className}`} style={rowStyle}>
        {head}
      </li>
    );
  }

  return (
    <li ref={liRef} className={`text-[12px] rounded-lg px-2 -mx-2 ${className}`} style={rowStyle}>
      <button
        type="button"
        onClick={withClick(onToggle)}
        aria-expanded={open}
        aria-controls={bodyId}
        aria-label={`${name}, rank ${row.rank}, ${(row.score ?? 0).toLocaleString('en-US')} points, ${row.stars ?? 0} of 3 stars. ${open ? 'Hide' : 'Show'} run`}
        className="w-full flex items-center gap-2.5 min-h-[44px] py-[5px] active:opacity-80"
      >
        {head}
      </button>
      <div id={bodyId} className="rr-rank-body" data-open={open ? 'true' : 'false'} aria-hidden={!open}>
        <div className="min-h-0 overflow-hidden"><RunCard row={row} /></div>
      </div>
    </li>
  );
}

/** Styles for the expand animation — render once wherever rows render. */
export function RankRowStyles() {
  return (
    <style>{`
      .rr-rank-body { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 220ms cubic-bezier(.22,1,.36,1), opacity 160ms ease-out; }
      .rr-rank-body[data-open='true'] { grid-template-rows: 1fr; opacity: 1; }
      .rr-rank-chev { transition: transform 200ms cubic-bezier(.22,1,.36,1); }
      @media (prefers-reduced-motion: reduce) {
        .rr-rank-body, .rr-rank-chev { transition: none; }
      }
    `}</style>
  );
}
