'use client';

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { DemoBoard } from './DemoBoard';
import { REVENGE_RED, REVENGE_RED_DARK, RevengeMarkSvg } from './RookiesRevengeLogo';
import { artFile } from './AbilityCard';
import { ABILITY_DEFS, type AbilityId } from '@/lib/run/abilities';
import { clickSfx, playTabSwitchSound, withClick } from '@/lib/sounds';
import { ACHIEVEMENTS } from '@/lib/run/achievements';
import { unlockableAbilityIds, type PlayerProfile } from '@/lib/run/profile';
import { isDifficultyLocked, type DifficultyId } from '@/lib/run/difficulty';
import { LadderTab } from './LadderTab';
import { getRunById, isKnownRunId } from '@/lib/run/runs';
import { HANDLE_RE, fetchBoard, getHandle, setHandle, type LeaderboardResponse } from '@/lib/run/leaderboard-client';
import { todaysAbilities } from '@/lib/run/daily-kit';
import { getDailyOverride } from '@/lib/run/daily';
import { useNavyShell } from './useNavyShell';
import { FamilyStrip } from './FamilyStrip';
import { autoplayMusicOnHome } from '@/lib/music';
import { ENDLESS_ENABLED, readEndlessBest, ENDLESS_RUN_ID } from '@/lib/run/endless';

/**
 * Rookie's Revenge home — "the Arena" (Tyler, 2026-09-02, replaces HomeLanding).
 * ONE screen, no scroll. The live board (DemoBoard: the real RunBoard running
 * a scripted loop) is the fixed anchor; four tabs swap what sits under it:
 *   Revenge — DAILY REVENGE button + today's abilities (the SAME four the run
 *             offers — lib/run/daily-kit.ts). Tapping the button flips the
 *             board to today's map card and the button itself becomes BEGIN
 *             (Tyler 2026-09-03: no dead button, no second PLAY on the card).
 *   Ladder  — the 10 rungs (real profile state), tap an open rung to play it.
 *   Ranks   — today's hunters, REAL data from `run_scores` via fetchBoard().
 *             Real rows or an honest empty state — never invented numbers
 *             (DUMMY_ROWS shipped fabricated hunters until 2026-09-07).
 *   Codex   — powers + trophies counts; tap opens the Trophy Room.
 * Same page contract as HomeLanding so app/page.tsx swaps cleanly.
 */
interface ArenaHomeProps {
  onStart: (d?: DifficultyId) => void;
  onLadderStart?: (runId: string, difficulty?: DifficultyId) => void;
  /** ENDLESS — the strip under the daily button on the Revenge tab. */
  onEndless?: () => void;
  /**
   * Tab to open on. Leaving a run lands back where it was launched from
   * (a ladder rung → 'Ladder', daily / Endless → 'Revenge') instead of
   * always resetting to the daily tab.
   */
  initialTab?: Tab;
  iso: string;
  runId: string;
  profile?: PlayerProfile;
  onTrophies?: () => void;
}

/**
 * NAME SHEET — the only place a player can choose what the leaderboard calls
 * them (Tyler, 2026-09-08: "where do people pick their names?").
 *
 * They couldn't. A handle is minted on first launch as `Rook-####` from a hash
 * of the random device id, and the rename UI existed only on HomeLanding and
 * DeskLanding — the two landings ArenaHome replaced on 2026-09-02, which
 * nothing has routed to since. The Arena took `getHandle` and left `setHandle`
 * behind, so the name was frozen. It only started to matter today, when
 * `run_scores` was finally created and Ranks began recording anything.
 *
 * Rules are the server's, not new ones: 2-16 chars of [a-zA-Z0-9_.-], spaces
 * folded to underscores by setHandle(). Existing rows keep the old name until
 * the next run — the score route rewrites the handle on every submit, even one
 * that doesn't beat your best.
 */
function NameSheet({ current, onSave, onClose }: {
  current: string;
  onSave: (h: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(current);
  const cleaned = draft.trim().replace(/\s+/g, '_');
  const valid = HANDLE_RE.test(cleaned);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); if (valid) onSave(cleaned); }}
        className="w-full max-w-[340px] rounded-2xl p-4"
        style={{ background: PANEL, border: `2px solid ${PANEL_EDGE}`, boxShadow: '0 14px 40px rgba(0,0,0,0.6)' }}
      >
        <div className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Your name on the board
        </div>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={16}
          // A game handle is not a form field: browser autofill offered a
          // saved profile name over the top of it during testing and won.
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          name="revenge-handle"
          aria-label="Your leaderboard name"
          className="mt-2 w-full min-h-[48px] px-3 rounded-xl text-[18px] font-black outline-none"
          style={{ background: NAVY, color: '#fff', border: `2px solid ${valid ? GOLD : '#7d3b3b'}` }}
        />
        <div className="mt-1.5 text-[11px] font-bold" style={{ color: valid ? 'rgba(255,255,255,0.5)' : '#FF9E9E' }}>
          {valid ? '2-16 characters · letters, numbers, _ . -' : 'Needs 2-16 characters: letters, numbers, _ . -'}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={withClick(onClose)}
            className="arena-press flex-1 min-h-[48px] rounded-[14px] text-[14px] font-black"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 4px 0 rgba(0,0,0,0.4)', ['--depth' as string]: '4px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!valid}
            onClick={clickSfx}
            className="arena-press flex-1 min-h-[48px] rounded-[14px] text-[14px] font-black"
            style={{
              background: valid ? REVENGE_RED : 'rgba(255,255,255,0.12)',
              color: '#fff',
              boxShadow: `0 4px 0 ${valid ? REVENGE_RED_DARK : 'rgba(0,0,0,0.4)'}`,
              ['--depth' as string]: '4px',
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Today's global board ────────────────────────────────────────────────────
/**
 * One fetch of `run_scores` for today's run, shared by the Revenge subtitle and
 * the Ranks tab. `available:false` means the board could not be read at all
 * (Supabase down, or `run_scores` not migrated onto the live DB) — treated the
 * same as empty: we say so, we never fill the gap with made-up hunters.
 */
function useDailyBoard(iso: string, runId: string) {
  const [board, setBoard] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBoard(iso, runId).then((b) => {
      if (cancelled) return;
      setBoard(b);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [iso, runId]);
  return { board, loading };
}

// ── Kit ──────────────────────────────────────────────────────────────────────
const NAVY = '#0f1c3f';
const NAVY_2 = '#182a5c';
const PANEL = '#1c2f63';
const PANEL_EDGE = '#3a4f8f';
const GOLD = '#FFC800';
const OUTLINE: CSSProperties = { color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.45), -1px 0 0 rgba(0,0,0,0.35), 1px 0 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(0,0,0,0.35)' };
const GOLD_TEXT: CSSProperties = { color: GOLD, textShadow: '0 2px 0 rgba(0,0,0,0.5)' };
const FRAME: CSSProperties = { background: 'linear-gradient(180deg,#3d5297 0%,#1b2b5c 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.4), 0 10px 26px rgba(0,0,0,0.45)' };
const TABS = ['Ladder', 'Ranks', 'Revenge', 'Codex'] as const;
export type Tab = (typeof TABS)[number];
// Painted-relic set (Tyler 2026-09-03: the cartoon icons clashed with the illustrated ability art above them).
const TAB_ART: Record<Tab, string> = { Ladder: 'ladder-x1', Ranks: 'ranks-p1', Revenge: 'revenge-x1', Codex: 'codex-p1' };

function useCountdownToMidnight(): string {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const d = new Date(now);
  const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0).getTime();
  const s = Math.max(0, Math.floor((midnight - now) / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  return `${hh}:${mm}`;
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: PANEL, border: `2px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -3px 0 rgba(0,0,0,0.35), 0 6px 14px rgba(0,0,0,0.35)' }}>
      {children}
    </div>
  );
}

/** Chess Path button pattern: flat face, hard bottom shadow, presses flat. */
function CpButton({ children, color = REVENGE_RED, shadow = REVENGE_RED_DARK, depth = 6, className = '', onClick, ariaLabel }: {
  children: ReactNode; color?: string; shadow?: string; depth?: number; className?: string; onClick?: () => void; ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={withClick(onClick)}
      aria-label={ariaLabel}
      className={`arena-press w-full rounded-[16px] font-black flex items-center justify-center gap-3 ${className}`}
      style={{ background: color, color: '#fff', boxShadow: `0 ${depth}px 0 ${shadow}`, ['--depth' as string]: `${depth}px` }}
    >
      {children}
    </button>
  );
}

/**
 * Home-screen ability tile, cut like the in-game card (gold frame, art window,
 * name plate) rather than a squashed square — Tyler 2026-09-03: "the icons look
 * so good in the app, they look different on the landing page."
 */
function AbilityTile({ id }: { id: AbilityId }) {
  return (
    <div
      className="w-full rounded-[12px] p-[3px]"
      style={{ background: 'linear-gradient(135deg,#b8852b,#6a4612 30%,#ffd87a 60%,#b8852b)', boxShadow: '0 5px 12px rgba(0,0,0,0.45)' }}
    >
      <div className="w-full rounded-[9px] overflow-hidden flex flex-col" style={{ background: '#f6e7c5' }}>
        {/* Square art window — the files are 1:1, never crop them. */}
        <div className="relative w-full aspect-square" style={{ background: 'radial-gradient(ellipse at center,#ffe9a8 0%,#d49a2a 100%)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/abilities/${artFile(id)}`} alt="" className="absolute inset-0 w-full h-full object-contain" draggable={false} />
        </div>
        <div className="px-1 py-[3px] text-[9.5px] font-black text-center leading-tight truncate" style={{ color: '#3d2806', letterSpacing: '0.02em' }}>{ABILITY_DEFS[id].name}</div>
      </div>
    </div>
  );
}

function Medal({ rank }: { rank: number }) {
  const bg = rank === 1 ? GOLD : rank === 2 ? '#CFD8DC' : rank === 3 ? '#D08A4E' : 'rgba(255,255,255,0.12)';
  const fg = rank <= 3 ? '#3a2a00' : '#fff';
  return <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0" style={{ background: bg, color: fg, boxShadow: rank <= 3 ? 'inset 0 -2px 0 rgba(0,0,0,0.25)' : undefined }}>{rank}</span>;
}

// ── The arena: live board on the front, today's map card on the back ────────
function Arena({ flipped, onBack, runName, runBlurb, poolSize, difficultyName }: {
  flipped: boolean; onBack: () => void; runName: string; runBlurb: string; poolSize: number; difficultyName?: string;
}) {
  // No 3D flip (Tyler 2026-09-03: "it still looks weird"). The board's own
  // transformed layers never respected backface-visibility, so the card
  // flipped with ghosted labels. Now: the board fades + settles back, and
  // the map card rises up over it. Plain opacity/transform — nothing to hide
  // at a magic midpoint.
  const EASE = 'cubic-bezier(.22,1,.36,1)';
  return (
    <div className="relative w-full aspect-square">
      <div
        className="absolute inset-0 rounded-[20px] p-2"
        style={{
          ...FRAME,
          opacity: flipped ? 0 : 1,
          transform: flipped ? 'scale(0.94)' : 'scale(1)',
          visibility: flipped ? 'hidden' : 'visible',
          pointerEvents: flipped ? 'none' : 'auto',
          transition: `opacity 360ms ${EASE}, transform 420ms ${EASE}, visibility 0s linear ${flipped ? '360ms' : '0s'}`,
        }}
      >
        {/* paused while the map is up — nothing keeps moving behind the card */}
        <div className="rounded-[14px] overflow-hidden h-full" style={{ boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }}><DemoBoard paused={flipped} reticle={!flipped} /></div>
      </div>
      <div
        className="absolute inset-0 rounded-[20px] p-2"
        style={{
          opacity: flipped ? 1 : 0,
          transform: flipped ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.97)',
          visibility: flipped ? 'visible' : 'hidden',
          pointerEvents: flipped ? 'auto' : 'none',
          transition: `opacity 360ms ${EASE} ${flipped ? '80ms' : '0s'}, transform 460ms ${EASE} ${flipped ? '80ms' : '0s'}, visibility 0s linear ${flipped ? '0s' : '360ms'}`,
          background: 'linear-gradient(180deg,#5b2030 0%,#2a0f18 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -4px 0 rgba(0,0,0,0.4), 0 10px 26px rgba(0,0,0,0.45)' }}>
          <div className="rounded-[14px] h-full flex flex-col p-3.5" style={{ background: 'linear-gradient(180deg,#1c2f63 0%,#0f1c3f 100%)', boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: '#FF6B66' }}>Today&rsquo;s map</span>
              <button type="button" onClick={withClick(onBack)} className="min-h-[32px] text-[11px] font-black px-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}>Back</button>
            </div>
            <div className="mt-2 text-[30px] font-black leading-none" style={OUTLINE}>{runName}</div>
            <div className="mt-2 text-[13px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>{runBlurb}</div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-black">
              <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.1)' }}>10 levels</span>
              <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.1)' }}>{poolSize} powers</span>
              {difficultyName && <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(229,57,53,0.3)', border: '1px solid rgba(229,57,53,0.6)' }}>{difficultyName}</span>}
              <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(255,200,0,0.15)', ...GOLD_TEXT }}>Counts toward Ranks</span>
            </div>
            <div className="flex-1 min-h-0 flex items-center justify-center py-1 overflow-hidden">
              <RevengeMarkSvg size={72} ringColor="#fff" />
            </div>
            <div className="text-[12px] font-bold text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>Ten levels. One King. Hit BEGIN.</div>
          </div>
      </div>
    </div>
  );
}

// ── Tab bar (Clash-style, Tyler 2026-09-04): full-bleed stone bar, the active
// tab is a lighter raised column that pokes up above the bar with a bigger
// icon and its label; little arrows on the neighbours point at it ──────────
const BAR_H = 72;
function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const idx = TABS.indexOf(active);
  return (
    <div
      className="relative grid grid-cols-4 -mx-3 -mb-[max(env(safe-area-inset-bottom),12px)] pb-[env(safe-area-inset-bottom)]"
      role="tablist"
      aria-label="Home sections"
      style={{
        height: `calc(${BAR_H}px + env(safe-area-inset-bottom))`,
        background: 'linear-gradient(180deg,#4b5f88 0%,#3e5178 55%,#354669 100%)',
        boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.14), inset 0 -2px 0 rgba(0,0,0,0.35), 0 -6px 14px rgba(0,0,0,0.35)',
        borderTop: '2px solid #22305a',
      }}
    >
      {TABS.map((t, i) => {
        const on = t === active;
        const leftOfActive = i === idx - 1;
        const rightOfActive = i === idx + 1;
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={on}
            aria-label={t}
            onClick={() => onChange(t)}
            className="relative flex flex-col items-center justify-end select-none"
            style={{
              height: on ? BAR_H + 14 : BAR_H,
              marginTop: on ? -14 : 0,
              paddingBottom: on ? 11 : 10,
              background: on ? 'linear-gradient(180deg,#8ea3d3 0%,#6a83bd 40%,#5a72a9 100%)' : 'transparent',
              boxShadow: on ? 'inset 0 3px 0 rgba(255,255,255,0.35), inset 2px 0 0 rgba(255,255,255,0.12), inset -2px 0 0 rgba(0,0,0,0.25)' : 'none',
              borderLeft: on || i === 0 ? 'none' : '1px solid rgba(0,0,0,0.28)',
              borderRadius: on ? '10px 10px 0 0' : 0,
              transition: 'background 160ms, height 160ms, margin 160ms',
            }}
          >
            {/* side arrows on the neighbours, pointing at the active column */}
            {leftOfActive && <span aria-hidden className="absolute right-1 top-1/2 -translate-y-1/2" style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '8px solid #a7c4ff', filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.5))' }} />}
            {rightOfActive && <span aria-hidden className="absolute left-1 top-1/2 -translate-y-1/2" style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '8px solid #a7c4ff', filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.5))' }} />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/ui/tabs/${TAB_ART[t]}.webp`}
              alt=""
              width={56}
              height={56}
              style={{
                width: 56,
                height: 56,
                transform: on ? 'translateY(-10px) scale(1.3)' : 'translateY(2px)',
                filter: on ? 'drop-shadow(0 4px 4px rgba(0,0,0,0.5))' : 'brightness(0.72) saturate(0.75) drop-shadow(0 2px 2px rgba(0,0,0,0.5))',
                transition: 'transform 200ms cubic-bezier(.22,1,.36,1), filter 200ms',
              }}
            />
            {on && <span className="text-[13px] font-black leading-none -mt-1" style={OUTLINE}>{t}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
/**
 * ENDLESS entry point (Tyler 2026-09-07). Deliberately NOT a fifth tab: the
 * tab bar is a four-column painted set with bespoke art per tab, and adding a
 * column would be a redesign of the home screen. This is the smallest honest
 * addition instead — a strip on the DEFAULT tab, directly under the daily
 * button, where a player who opens the app cannot miss it.
 */
function EndlessStrip({ best, onPlay }: { best: number; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={withClick(onPlay)}
      aria-label="Play Endless"
      data-testid="home-endless"
      className="arena-press w-full rounded-[16px] flex items-center gap-3 px-4 min-h-[70px] text-left"
      style={{ background: 'linear-gradient(180deg,#2b3f7d 0%,#1c2f63 100%)', border: `2px solid ${GOLD}`, boxShadow: '0 5px 0 rgba(0,0,0,0.45)', ['--depth' as string]: '5px' }}
    >
      <span className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[26px] font-black shrink-0" style={{ background: GOLD, color: '#2a1c00' }}>
        &infin;
      </span>
      <span className="flex flex-col leading-none min-w-0">
        <span className="text-[24px] font-black" style={{ ...OUTLINE, letterSpacing: '0.02em' }}>ENDLESS</span>
        <span className="text-[12px] font-bold mt-1 truncate" style={{ color: 'rgba(255,255,255,0.72)' }}>
          5 random powers &middot; how deep can you get?
        </span>
      </span>
      <span className="ml-auto text-[11px] font-black shrink-0 tabular-nums" style={GOLD_TEXT}>
        {best > 0 ? `BEST ${best}` : 'NEW'}
      </span>
    </button>
  );
}

function RevengeTab({ flipped, onGo, onBegin, countdown, runName, abilities, board, endlessBest, onEndless }: {
  flipped: boolean; onGo: () => void; onBegin: () => void; countdown: string; runName: string;
  abilities: AbilityId[]; board: LeaderboardResponse | null;
  endlessBest: number; onEndless?: () => void;
}) {
  // Only ever a real standing: your rank when you've played, the live hunter
  // count when you haven't, and nothing at all when the board is empty.
  const live = board?.available && board.total > 0 ? board : null;
  const standing = !live
    ? ''
    : live.me
      ? ` \u00b7 you\u2019re #${live.me.rank} of ${live.total.toLocaleString()}`
      : ` \u00b7 ${live.total.toLocaleString()} hunting`;
  return (
    <div className={`h-full flex flex-col${flipped ? '' : ' gap-3 justify-center pb-2'}`}>
      {flipped ? (
        <CpButton onClick={onBegin} className="min-h-[70px]" color="#58CC02" shadow="#3d8c01" ariaLabel="Begin today's revenge">
          <RevengeMarkSvg size={46} ringColor="#fff" />
          <span className="flex flex-col items-start leading-none">
            <span className="text-[26px]" style={{ ...OUTLINE, letterSpacing: '0.04em' }}>BEGIN</span>
            <span className="text-[12px] font-bold mt-1 truncate max-w-[220px]" style={{ color: '#E9FFD6' }}>{runName} · counts toward Ranks</span>
          </span>
        </CpButton>
      ) : (
        <CpButton onClick={onGo} className="min-h-[70px]" ariaLabel="Daily Revenge">
          <RevengeMarkSvg size={46} ringColor="#fff" />
          <span className="flex flex-col items-start leading-none">
            <span className="text-[24px]" style={{ ...OUTLINE, letterSpacing: '0.02em' }}>DAILY REVENGE</span>
            <span className="text-[12px] font-bold mt-1" style={{ color: '#FFD6D6' }}>Resets in {countdown}{standing}</span>
          </span>
        </CpButton>
      )}
      {/*
        THE MODE PICKER vs THE MODE SCREEN (Tyler, 2026-09-08 playtest).
        Endless earned a place on the front screen, and with the ability grid
        also sitting there the front screen became two things at once: "this
        probably isn't the right place to put it because it messes up the
        landing screen a little bit ... if we're gonna have Endless here, we
        can put the today's abilities in the Daily Revenge when you click
        that. The today's abilities should just be in that new screen, in the
        mode screen."

        So: UNFLIPPED is the picker — two modes, nothing else. FLIPPED is the
        daily's own screen, and today's four cards live there, next to BEGIN.
      */}
      {flipped ? (
        <>
          <div className="mt-3 flex items-baseline justify-between px-1">
            <span className="text-[14px] font-black" style={OUTLINE}>Today&rsquo;s abilities</span>
            <span className="text-[11px] font-bold truncate ml-3" style={{ color: 'rgba(255,255,255,0.7)' }}>Map: {runName}</span>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {abilities.map((id) => <AbilityTile key={id} id={id} />)}
          </div>
        </>
      ) : (
        ENDLESS_ENABLED && onEndless && <EndlessStrip best={endlessBest} onPlay={onEndless} />
      )}
    </div>
  );
}

/**
 * Ranks. Two boards behind one switch: TODAY (the daily run) and ENDLESS.
 * Endless scores are submitted under runId 'endless' by app/page.tsx, and until
 * 2026-09-07 nothing ever fetched them — the mode kept a board nobody could see.
 * Endless is ranked by DEPTH, so its rows read "n deep", not captures.
 */
type RanksBoard = 'today' | 'endless';

function RanksTab({ handle, board, loading, iso }: {
  handle: string; board: LeaderboardResponse | null; loading: boolean; iso: string;
}) {
  const [which, setWhich] = useState<RanksBoard>('today');
  const endless = useDailyBoard(iso, ENDLESS_RUN_ID);
  const showEndless = which === 'endless' && ENDLESS_ENABLED;
  const shown = showEndless ? endless.board : board;
  const isLoading = showEndless ? endless.loading : loading;
  const live = shown?.available ? shown : null;
  const rows = live?.rows ?? [];
  const me = live?.me ?? null;
  const unit = showEndless ? 'deep' : 'caps';
  // The top rows already carry `me` when you're in them — don't print you twice.
  const meBelow = me && !rows.some((r) => r.me) ? me : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between px-1">
        <span className="text-[14px] font-black" style={OUTLINE}>{showEndless ? 'Deepest runs' : 'Today\u2019s hunters'}</span>
        <span className="text-[10px] font-black uppercase tracking-wider" style={GOLD_TEXT}>
          {live && live.total > 0 ? `${live.total.toLocaleString()} playing` : 'Global'}
        </span>
      </div>

      {ENDLESS_ENABLED && (
        <div className="mt-2 flex gap-1.5" role="tablist" aria-label="Which board">
          {(['today', 'endless'] as const).map((b) => (
            <button
              key={b}
              type="button"
              role="tab"
              aria-selected={which === b}
              onClick={withClick(() => setWhich(b))}
              className="flex-1 rounded-lg py-1.5 text-[11px] font-black uppercase tracking-wider active:opacity-80"
              style={which === b
                ? { background: GOLD, color: '#2a1c00' }
                : { background: 'rgba(0,0,0,0.28)', color: 'rgba(255,255,255,0.62)', border: `1.5px solid ${PANEL_EDGE}` }}
            >
              {b === 'today' ? 'Today' : 'Endless'}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <ul className="mt-1.5" aria-label="Loading the board">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="flex items-center gap-2.5 py-[7px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="h-[18px] w-[18px] rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
              <span className="flex-1 h-[10px] rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </li>
          ))}
        </ul>
      ) : rows.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-5 -mt-2">
          <RevengeMarkSvg size={38} ringColor="rgba(255,255,255,0.75)" />
          <div className="mt-2.5 text-[14px] font-black" style={OUTLINE}>
            {showEndless ? 'Nobody has gone deep yet' : 'No hunters yet today'}
          </div>
          <div className="mt-1 text-[11px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.62)' }}>
            {showEndless
              ? 'Roll five abilities and set the mark. It only ends when you die.'
              : 'Finish today\u2019s Revenge and you hold #1 until somebody takes it off you.'}
          </div>
        </div>
      ) : (
        <ul className="mt-1.5">
          {rows.slice(0, meBelow ? 4 : 5).map((r) => (
            <li
              key={`${r.rank}-${r.handle}`}
              className={`flex items-center gap-2.5 py-[5px] text-[12px] ${r.me ? 'font-black rounded-lg px-2 -mx-2' : ''}`}
              style={r.me
                ? { background: 'rgba(229,57,53,0.28)', border: '1.5px solid rgba(229,57,53,0.6)' }
                : { borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Medal rank={r.rank} />
              <span className="flex-1 font-bold truncate">{r.handle}{r.me ? ' (you)' : ''}</span>
              <span className="tabular-nums font-black" style={GOLD_TEXT}>{showEndless ? r.levels : r.captures}<span className="text-[9px] opacity-80"> {unit}</span></span>
            </li>
          ))}
          {meBelow ? (
            <li className="flex items-center gap-2.5 py-[5px] mt-1 text-[12px] font-black rounded-lg px-2 -mx-2" style={{ background: 'rgba(229,57,53,0.28)', border: '1.5px solid rgba(229,57,53,0.6)' }}>
              <Medal rank={meBelow.rank} />
              <span className="flex-1 truncate">{handle} (you)</span>
              <span className="tabular-nums" style={GOLD_TEXT}>{showEndless ? meBelow.levels : meBelow.captures}<span className="text-[9px] opacity-80"> {unit}</span></span>
            </li>
          ) : !me ? (
            <li className="mt-2 text-center text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {showEndless ? 'No Endless run of yours on the board yet.' : 'You haven\u2019t hunted today. Play the Daily Revenge to take a rank.'}
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
}

function CodexTab({ profile, onTrophies }: { profile?: PlayerProfile; onTrophies?: () => void }) {
  const abilitiesTotal = unlockableAbilityIds().length;
  const have = profile?.unlockedAbilities ?? [];
  const trophiesHave = profile ? Object.keys(profile.achievements).length : 0;
  const preview = have.slice(0, 3);
  const locked = unlockableAbilityIds().find((id) => !have.includes(id));
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between px-1">
        <span className="text-[14px] font-black" style={OUTLINE}>The Codex</span>
        <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Win rungs to fill it</span>
      </div>
      <button type="button" onClick={withClick(onTrophies)} className="mt-2 grid grid-cols-2 gap-2 text-left active:opacity-80" aria-label="Open the Codex">
        <Panel className="p-3">
          <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>Powers</div>
          <div className="text-[26px] font-black leading-none mt-1" style={GOLD_TEXT}>{have.length}<span className="text-[14px] text-white/60">/{abilitiesTotal}</span></div>
          <div className="mt-2 flex gap-1">
            {preview.map((id) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={id} src={`/abilities/${artFile(id)}`} alt="" width={30} height={30} className="rounded-lg object-cover" style={{ width: 30, height: 30 }} />
            ))}
            {locked && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/abilities/${artFile(locked)}`} alt="" width={30} height={30} className="rounded-lg object-cover" style={{ width: 30, height: 30, filter: 'grayscale(1) brightness(0.55)' }} />
            )}
          </div>
        </Panel>
        <Panel className="p-3">
          <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>Trophies</div>
          <div className="text-[26px] font-black leading-none mt-1" style={GOLD_TEXT}>{trophiesHave}<span className="text-[14px] text-white/60">/{ACHIEVEMENTS.length}</span></div>
          <div className="mt-2 h-[30px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (trophiesHave / Math.max(1, ACHIEVEMENTS.length)) * 100)}%`, background: `linear-gradient(90deg,${GOLD},#F5A800)` }} />
          </div>
        </Panel>
      </button>
    </div>
  );
}

// ── The shell ────────────────────────────────────────────────────────────────
export function ArenaHome({ onStart, onLadderStart, onEndless, initialTab, iso, runId, profile, onTrophies }: ArenaHomeProps) {
  const [tab, setTab] = useState<Tab>(initialTab ?? 'Revenge');
  // The shell is unmounted during play, so the initial state covers the common
  // case; this keeps the prop honest if it ever changes while mounted.
  useEffect(() => { if (initialTab) setTab(initialTab); }, [initialTab]);
  const [flipped, setFlipped] = useState(false);
  const countdown = useCountdownToMidnight();
  const [handle, setHandleState] = useState('Rook');
  const [namingOpen, setNamingOpen] = useState(false);
  useEffect(() => { setHandleState(getHandle()); }, []);
  const [endlessBest, setEndlessBest] = useState(0);
  useEffect(() => { setEndlessBest(readEndlessBest()); }, []);
  const { board, loading: boardLoading } = useDailyBoard(iso, runId);
  // Music starts the moment the home screen shows (or on the first tap if
  // the browser blocks autoplay) — not on the first board move.
  useEffect(() => autoplayMusicOnHome(), []);

  useNavyShell(true);

  const run = isKnownRunId(runId) ? getRunById(runId) : null;
  const runName = run?.name ?? "Today's run";
  const runBlurb = run?.blurb ?? 'Ten levels. One King. She has a list.';
  const pool = useMemo(() => todaysAbilities(iso, runId), [iso, runId]);

  // The daily is "just one run": Normal once it's open, Rookie for brand-new players.
  // A pinned daily may force a difficulty (Dead Bolt on Hard, 2026-09-03);
  // players who haven't unlocked it fall back to the normal rule.
  const forced = getDailyOverride(iso)?.difficulty;
  const dailyDifficulty: DifficultyId =
    forced && !isDifficultyLocked(forced, profile) ? forced : isDifficultyLocked('normal', profile) ? 'rookie' : 'normal';

  return (
    <div className="h-full w-full flex justify-center text-white" style={{ background: NAVY }}>
      <style>{`
        .arena-press { transition: transform 80ms ease-out, box-shadow 80ms ease-out; }
        .arena-press:active:not(:disabled) { transform: translateY(var(--depth, 4px)); box-shadow: 0 0 0 transparent !important; }
        @keyframes arena-tab-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .arena-tab-in { animation: arena-tab-in 220ms cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .arena-tab-in { animation: none; } }
      `}</style>
      <div className="h-full w-full max-w-[430px] flex flex-col px-3 pb-[max(env(safe-area-inset-bottom),12px)]" style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 60%)` }}>
        {/* header: small lockup left, handle right */}
        <div className="flex items-center justify-between pt-[calc(env(safe-area-inset-top)+6px)]">
          <div className="flex items-center gap-1.5">
            <RevengeMarkSvg size={26} />
            <span className="text-[12px] font-black leading-none" style={OUTLINE}>Rookie&rsquo;s <span style={{ color: '#FF6B66' }}>REVENGE</span></span>
          </div>
          <button
            type="button"
            onClick={withClick(() => setNamingOpen(true))}
            aria-label={`Change your leaderboard name (currently ${handle})`}
            data-testid="home-handle"
            className="arena-press rounded-lg px-2.5 min-h-[32px] flex items-center gap-1.5"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1.5px solid rgba(255,255,255,0.12)', ['--depth' as string]: '2px' }}
          >
            <span className="text-[11px] font-black" style={OUTLINE}>{handle}</span>
            <span aria-hidden className="text-[10px] leading-none" style={{ color: GOLD }}>&#9998;</span>
          </button>
        </div>
        {/* "Your Chess" strip — family streak + rating + sibling apps. Null unless FAMILY_STRIP. */}
        <div className="mt-2 empty:hidden"><FamilyStrip /></div>

        {/* the anchor — square, and never taller than what leaves room for the surround + tab bar */}
        <div className="mt-3 mx-auto w-full" style={{ maxWidth: 'calc(100dvh - 470px)' }}>
          <Arena flipped={flipped} onBack={() => setFlipped(false)} runName={runName} runBlurb={runBlurb} poolSize={pool.length} difficultyName={forced && dailyDifficulty === forced ? forced.toUpperCase() : undefined} />
        </div>

        {/* the surround */}
        <div className="flex-1 min-h-0 mt-3 relative overflow-hidden">
          <div key={tab} className="h-full arena-tab-in">
            {tab === 'Revenge' && <RevengeTab flipped={flipped} onGo={() => setFlipped(true)} onBegin={() => onStart(dailyDifficulty)} countdown={countdown} runName={runName} abilities={pool} board={board} endlessBest={endlessBest} onEndless={onEndless} />}
            {tab === 'Ladder' && <LadderTab profile={profile} onLadderStart={onLadderStart} />}
            {tab === 'Ranks' && <RanksTab handle={handle} board={board} loading={boardLoading} iso={iso} />}
            {tab === 'Codex' && <CodexTab profile={profile} onTrophies={onTrophies} />}
          </div>
        </div>

        <div className="mt-3 pt-3"><TabBar active={tab} onChange={(t) => { if (t !== tab) void playTabSwitchSound(); setTab(t); setFlipped(false); }} /></div>
      </div>
      {namingOpen && (
        <NameSheet
          current={handle}
          onClose={() => setNamingOpen(false)}
          onSave={(h) => {
            const ok = setHandle(h);
            if (ok) setHandleState(ok);
            setNamingOpen(false);
          }}
        />
      )}
    </div>
  );
}
