'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { REVENGE_RED, REVENGE_RED_DARK, RookiesRevengeLogo } from '@/components/run/RookiesRevengeLogo';

/**
 * /test/revenge-home/hero — ROUND 4. Variations on Option C ("The Hero"),
 * stripped down. New structure:
 *   1. DAILY CHALLENGE — one run, no difficulty. The big red thing.
 *   2. THE LADDER — separate runs at each difficulty (Rookie → Cruel).
 *   3. Daily leaderboard.
 *   4. The Codex (powers + trophies).
 */

// ── Mock data ────────────────────────────────────────────────────────────────
const TODAY = 'Aug 31';
const COUNTDOWN = '09:41';
const HUNTING = 2318;
const BOARD = [
  { rank: 1, name: 'kingslayer_ru', lvl: 15, caps: 31 },
  { rank: 2, name: 'pawnstorm', lvl: 14, caps: 29 },
  { rank: 3, name: 'gleasons_gym', lvl: 12, caps: 27 },
];
const ME = { rank: 47, name: 'Tylervsnyc', lvl: 8, caps: 12 };
const LADDER = [
  { name: 'Rookie', sub: 'Cleared', state: 'done' as const },
  { name: 'Normal', sub: 'Best L8 of 15', state: 'open' as const },
  { name: 'Hard', sub: 'Clear Normal to enter', state: 'locked' as const },
  { name: 'Cruel', sub: 'Clear Hard to enter', state: 'locked' as const },
];
const CODEX = { powers: 8, powersTotal: 18, trophies: 21, trophiesTotal: 54 };

// ── Shared bits ──────────────────────────────────────────────────────────────
function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[360px] h-[760px] shrink-0 rounded-[36px] border-[6px] border-[#1a1a1a] overflow-hidden shadow-xl bg-chess-page text-chess-text">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#1a1a1a] z-30" />
      <div className="h-full w-full overflow-auto">{children}</div>
    </div>
  );
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`bg-white rounded-2xl border border-chess-text/10 shadow-sm p-4 ${className}`}>{children}</section>;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-chess-text-faint">{children}</h2>;
}

function LockIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 9 11" aria-hidden className="shrink-0">
      <rect x="0.5" y="4.5" width="8" height="6" rx="1.2" fill="currentColor" />
      <path d="M2 4.5V3a2.5 2.5 0 0 1 5 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function LadderRows({ flat = false }: { flat?: boolean }) {
  return (
    <ul className={flat ? '' : 'divide-y divide-chess-text/5'}>
      {LADDER.map((r) => (
        <li key={r.name}>
          <button
            type="button"
            disabled={r.state === 'locked'}
            className={`w-full min-h-[52px] flex items-center gap-3 text-left ${flat ? 'px-4 bg-white rounded-2xl border border-chess-text/10 shadow-sm mb-2' : 'py-1'} ${
              r.state === 'locked' ? 'opacity-45' : 'active:opacity-70'
            }`}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-black shrink-0"
              style={
                r.state === 'done'
                  ? { background: '#2A3C45', color: '#fff' }
                  : r.state === 'open'
                    ? { background: '#FFEBEE', color: REVENGE_RED }
                    : { background: '#e5edf3', color: '#94a3b8' }
              }
            >
              {r.state === 'done' ? '✓' : r.state === 'locked' ? <LockIcon /> : '♟'}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[14px] font-black leading-tight">{r.name}</span>
              <span className="block text-[11px] text-chess-text-muted">{r.sub}</span>
            </span>
            {r.state !== 'locked' && <span className="text-[13px] font-black text-chess-text-faint">›</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}

function BoardRows() {
  return (
    <ul>
      {BOARD.map((r) => (
        <li key={r.rank} className="flex items-center gap-2.5 py-1.5 text-[13px] border-b border-chess-text/5 last:border-0">
          <span className={`w-5 font-black ${r.rank === 1 ? '' : 'text-chess-text-faint'}`} style={r.rank === 1 ? { color: '#FFB020' } : undefined}>
            {r.rank}
          </span>
          <span className="flex-1 font-bold truncate">{r.name}</span>
          <span className="text-[11px] text-chess-text-faint">L{r.lvl}{r.lvl === 15 ? ' ♚' : ''}</span>
        </li>
      ))}
      <li className="flex items-center gap-2.5 py-1.5 mt-1 text-[13px] font-black rounded-lg px-2 -mx-2" style={{ background: '#FFEBEE', color: REVENGE_RED }}>
        <span className="w-5">{ME.rank}</span>
        <span className="flex-1 truncate">{ME.name} (you)</span>
        <span className="text-[11px] opacity-70">L{ME.lvl}</span>
      </li>
    </ul>
  );
}

function CodexRow({ flat = false }: { flat?: boolean }) {
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-3 text-left active:opacity-70 ${flat ? 'bg-white rounded-2xl border border-chess-text/10 shadow-sm p-4' : ''}`}
    >
      <span className="w-8 h-8 rounded-lg bg-chess-text flex items-center justify-center text-[15px] shrink-0">📖</span>
      <span className="flex-1 min-w-0">
        <span className="block text-[14px] font-black leading-tight">The Codex</span>
        <span className="block text-[11px] text-chess-text-muted">
          {CODEX.powers}/{CODEX.powersTotal} powers · {CODEX.trophies}/{CODEX.trophiesTotal} trophies
        </span>
      </span>
      <span className="text-[13px] font-black text-chess-text-faint">›</span>
    </button>
  );
}

// ── C1: Quiet Hero — small red band, three white cards ───────────────────────
function C1() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="px-4 pt-12 pb-5 text-white" style={{ background: `linear-gradient(180deg, ${REVENGE_RED} 0%, ${REVENGE_RED_DARK} 100%)` }}>
        <div className="flex items-center justify-between">
          <div className="bg-white rounded-xl px-2 py-1"><RookiesRevengeLogo scale={0.3} /></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">Daily · {TODAY}</span>
        </div>
        <h1 className="text-[22px] font-black leading-tight mt-4">Today&apos;s challenge</h1>
        <p className="text-[12px] mt-0.5 opacity-85">One run. {HUNTING.toLocaleString()} hunters. Resets in {COUNTDOWN}.</p>
        <button
          type="button"
          className="mt-3.5 w-full min-h-[52px] rounded-2xl bg-white font-black text-[16px] tracking-wide active:translate-y-px transition-transform"
          style={{ color: REVENGE_RED, boxShadow: '0 4px 0 rgba(0,0,0,0.25)' }}
        >
          GO GET HIM
        </button>
      </div>
      <div className="flex-1 px-3 pt-4 pb-6 flex flex-col gap-3">
        <Card>
          <div className="mb-2"><SectionLabel>Today&apos;s hunters</SectionLabel></div>
          <BoardRows />
        </Card>
        <Card>
          <div className="mb-1"><SectionLabel>The Ladder</SectionLabel></div>
          <LadderRows />
        </Card>
        <Card className="!p-4">
          <CodexRow />
        </Card>
      </div>
    </div>
  );
}

// ── C2: Big Red — half-screen hero, flat rows below, no card chrome ──────────
function C2() {
  return (
    <div className="min-h-full flex flex-col">
      <div
        className="px-5 pt-14 pb-8 text-white flex flex-col justify-end min-h-[340px]"
        style={{ background: `linear-gradient(165deg, ${REVENGE_RED} 0%, ${REVENGE_RED_DARK} 100%)` }}
      >
        <div className="bg-white rounded-xl px-2 py-1 self-start"><RookiesRevengeLogo scale={0.3} /></div>
        <h1 className="text-[30px] font-black leading-[1.02] mt-5">Daily<br />Challenge</h1>
        <p className="text-[12px] mt-2 opacity-85">{TODAY} · {HUNTING.toLocaleString()} hunters · resets {COUNTDOWN}</p>
        <button
          type="button"
          className="mt-4 w-full min-h-[54px] rounded-2xl bg-white font-black text-[17px] tracking-wide active:translate-y-px transition-transform"
          style={{ color: REVENGE_RED, boxShadow: '0 4px 0 rgba(0,0,0,0.25)' }}
        >
          GO GET HIM
        </button>
        <button type="button" className="mt-2.5 self-center text-[11px] font-bold uppercase tracking-[0.15em] opacity-80 underline underline-offset-4 min-h-[32px]">
          Today&apos;s leaderboard · you&apos;re #{ME.rank}
        </button>
      </div>
      <div className="flex-1 px-3 pt-4 pb-6">
        <div className="px-1 mb-2"><SectionLabel>The Ladder</SectionLabel></div>
        <LadderRows flat />
        <div className="px-1 mt-4 mb-2"><SectionLabel>Collection</SectionLabel></div>
        <CodexRow flat />
      </div>
    </div>
  );
}

// ── C3: One Card Each — hero band + exactly three equal rows ─────────────────
function C3() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="px-4 pt-12 pb-5 text-white" style={{ background: REVENGE_RED }}>
        <div className="flex items-center justify-between">
          <div className="bg-white rounded-xl px-2 py-1"><RookiesRevengeLogo scale={0.3} /></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">{TODAY}</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-[20px] font-black leading-tight">Daily Challenge</h1>
            <p className="text-[11px] opacity-85 mt-0.5">Resets in {COUNTDOWN}</p>
          </div>
          <button
            type="button"
            className="min-h-[48px] px-6 rounded-2xl bg-white font-black text-[15px] tracking-wide active:translate-y-px transition-transform shrink-0"
            style={{ color: REVENGE_RED, boxShadow: '0 4px 0 rgba(0,0,0,0.25)' }}
          >
            PLAY
          </button>
        </div>
      </div>
      <div className="flex-1 px-3 pt-4 pb-6 flex flex-col gap-2.5">
        {/* Leaderboard preview strip */}
        <Card className="!p-4">
          <button type="button" className="w-full flex items-center gap-3 text-left active:opacity-70">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0" style={{ background: '#FFF6E0' }}>🏆</span>
            <span className="flex-1 min-w-0">
              <span className="block text-[14px] font-black leading-tight">Today&apos;s leaderboard</span>
              <span className="block text-[11px] text-chess-text-muted">
                <b style={{ color: '#B8860B' }}>{BOARD[0].name}</b> leads · you&apos;re #{ME.rank} of {HUNTING.toLocaleString()}
              </span>
            </span>
            <span className="text-[13px] font-black text-chess-text-faint">›</span>
          </button>
        </Card>
        <Card>
          <div className="mb-1"><SectionLabel>The Ladder</SectionLabel></div>
          <LadderRows />
        </Card>
        <Card className="!p-4">
          <CodexRow />
        </Card>
      </div>
    </div>
  );
}

// ── C4: Whisper — no red band at all; red lives only in the button ───────────
function C4() {
  return (
    <div className="min-h-full px-3 pt-12 pb-6 flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <RookiesRevengeLogo scale={0.36} />
        <span className="text-[10px] uppercase tracking-[0.2em] text-chess-text-muted font-bold">{TODAY}</span>
      </div>
      <Card className="!p-5">
        <SectionLabel>Daily Challenge</SectionLabel>
        <h1 className="text-[20px] font-black leading-tight mt-1">One run. Him at the end.</h1>
        <p className="text-[12px] text-chess-text-muted mt-1">{HUNTING.toLocaleString()} hunters today · resets in {COUNTDOWN}</p>
        <button
          type="button"
          className="mt-3.5 w-full min-h-[52px] rounded-2xl text-white font-black text-[16px] tracking-wide active:translate-y-px transition-transform"
          style={{ background: REVENGE_RED, boxShadow: `0 4px 0 ${REVENGE_RED_DARK}` }}
        >
          GO GET HIM
        </button>
        <button type="button" className="mt-2 w-full text-center text-[11px] font-bold text-chess-text-muted min-h-[32px]">
          Leaderboard · you&apos;re <b style={{ color: REVENGE_RED }}>#{ME.rank}</b> today ›
        </button>
      </Card>
      <Card>
        <div className="mb-1"><SectionLabel>The Ladder</SectionLabel></div>
        <LadderRows />
      </Card>
      <Card className="!p-4">
        <CodexRow />
      </Card>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const OPTIONS = [
  { n: 'C1', title: 'Quiet Hero', pitch: 'Short red band with the daily CTA, then three white cards: leaderboard, ladder, codex. Closest to Option C, just decluttered.', C: C1 },
  { n: 'C2', title: 'Big Red', pitch: 'Hero takes the top half — huge type, one button, leaderboard as a text link. Below: flat rows, no section cards. Most minimal.', C: C2 },
  { n: 'C3', title: 'One Card Each', pitch: 'Compact red band with an inline PLAY. Then exactly three equal rows: leaderboard preview, ladder, codex. Very tidy.', C: C3 },
  { n: 'C4', title: 'Whisper', pitch: 'No red band at all — pure chesspath page, red only in the GO button. The control: is the hero band even needed?', C: C4 },
];

export default function Page() {
  return (
    <main className="min-h-screen w-full overflow-auto bg-[#dfe9f2] text-chess-text p-6">
      <div className="max-w-[1700px] mx-auto">
        <h1 className="text-2xl font-black">Revenge home — Round 4: Hero, minimal</h1>
        <p className="text-sm text-chess-text-muted mt-1 max-w-2xl">
          New structure: <b>Daily Challenge</b> (one run, no difficulty) · <b>The Ladder</b> (separate runs per difficulty) · daily leaderboard · <b>The Codex</b>.
          Round 3 lives at <Link href="/test/revenge-home/normal" className="font-bold text-chess-blue underline">/normal</Link>.
        </p>
        <div className="mt-6 flex gap-8 overflow-x-auto pb-8 items-start">
          {OPTIONS.map(({ n, title, pitch, C }) => (
            <div key={n} className="shrink-0 w-[360px]">
              <h2 className="text-lg font-black leading-tight">{n} · {title}</h2>
              <p className="text-[13px] text-chess-text-muted mt-1 mb-3 leading-snug">{pitch}</p>
              <Phone>
                <C />
              </Phone>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
