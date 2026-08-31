'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { REVENGE_RED, REVENGE_RED_DARK, RookiesRevengeLogo } from '@/components/run/RookiesRevengeLogo';

/**
 * /test/revenge-home/toggle — ROUND 5. C1 (Quiet Hero) + a Daily/Ladder mode
 * toggle at the top. Two toggle treatments, both tappable.
 *   DAILY  = today's one run + leaderboard.
 *   LADDER = permanent difficulty runs (Rookie → Cruel).
 *   Codex lives on both.
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

type Mode = 'daily' | 'ladder';

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

function LadderRows() {
  return (
    <ul className="divide-y divide-chess-text/5">
      {LADDER.map((r) => (
        <li key={r.name}>
          <button
            type="button"
            disabled={r.state === 'locked'}
            className={`w-full min-h-[54px] flex items-center gap-3 text-left py-1 ${r.state === 'locked' ? 'opacity-45' : 'active:opacity-70'}`}
          >
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-black shrink-0"
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
              <span className="block text-[15px] font-black leading-tight">{r.name}</span>
              <span className="block text-[11px] text-chess-text-muted">{r.sub}</span>
            </span>
            {r.state !== 'locked' && <span className="text-[14px] font-black text-chess-text-faint">›</span>}
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

function CodexCard() {
  return (
    <Card className="!p-4">
      <button type="button" className="w-full flex items-center gap-3 text-left active:opacity-70">
        <span className="w-8 h-8 rounded-lg bg-chess-text flex items-center justify-center text-[15px] shrink-0">📖</span>
        <span className="flex-1 min-w-0">
          <span className="block text-[14px] font-black leading-tight">The Codex</span>
          <span className="block text-[11px] text-chess-text-muted">
            {CODEX.powers}/{CODEX.powersTotal} powers · {CODEX.trophies}/{CODEX.trophiesTotal} trophies
          </span>
        </span>
        <span className="text-[13px] font-black text-chess-text-faint">›</span>
      </button>
    </Card>
  );
}

/** Hero band content for each mode. */
function HeroContent({ mode }: { mode: Mode }) {
  if (mode === 'daily') {
    return (
      <>
        <h1 className="text-[22px] font-black leading-tight mt-3">Today&apos;s challenge</h1>
        <p className="text-[12px] mt-0.5 opacity-85">One run. {HUNTING.toLocaleString()} hunters. Resets in {COUNTDOWN}.</p>
        <button
          type="button"
          className="mt-3.5 w-full min-h-[52px] rounded-2xl bg-white font-black text-[16px] tracking-wide active:translate-y-px transition-transform"
          style={{ color: REVENGE_RED, boxShadow: '0 4px 0 rgba(0,0,0,0.25)' }}
        >
          GO GET HIM
        </button>
      </>
    );
  }
  return (
    <>
      <h1 className="text-[22px] font-black leading-tight mt-3">The Ladder</h1>
      <p className="text-[12px] mt-0.5 opacity-85">Four kings, one per difficulty. Beat one to face the next.</p>
      <button
        type="button"
        className="mt-3.5 w-full min-h-[52px] rounded-2xl bg-white font-black text-[16px] tracking-wide active:translate-y-px transition-transform"
        style={{ color: REVENGE_RED, boxShadow: '0 4px 0 rgba(0,0,0,0.25)' }}
      >
        CONTINUE · NORMAL
      </button>
    </>
  );
}

function BelowFold({ mode }: { mode: Mode }) {
  return (
    <div className="flex-1 px-3 pt-4 pb-6 flex flex-col gap-3">
      {mode === 'daily' ? (
        <Card>
          <div className="mb-2"><SectionLabel>Today&apos;s hunters</SectionLabel></div>
          <BoardRows />
        </Card>
      ) : (
        <Card>
          <div className="mb-1"><SectionLabel>Pick your run</SectionLabel></div>
          <LadderRows />
        </Card>
      )}
      <CodexCard />
    </div>
  );
}

// ── T1: Segmented pill inside the red band ───────────────────────────────────
function T1() {
  const [mode, setMode] = useState<Mode>('daily');
  return (
    <div className="min-h-full flex flex-col">
      <div className="px-4 pt-12 pb-5 text-white" style={{ background: `linear-gradient(180deg, ${REVENGE_RED} 0%, ${REVENGE_RED_DARK} 100%)` }}>
        <div className="flex items-center justify-between">
          <div className="bg-white rounded-xl px-2 py-1"><RookiesRevengeLogo scale={0.3} /></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">{TODAY}</span>
        </div>
        {/* Segmented control */}
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-black/20 p-1" role="tablist" aria-label="Game mode">
          {(['daily', 'ladder'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`min-h-[42px] rounded-xl text-[13px] font-black uppercase tracking-wide transition-colors ${
                mode === m ? 'bg-white' : 'text-white/75'
              }`}
              style={mode === m ? { color: REVENGE_RED } : undefined}
            >
              {m === 'daily' ? 'Daily' : 'Ladder'}
            </button>
          ))}
        </div>
        <HeroContent mode={mode} />
      </div>
      <BelowFold mode={mode} />
    </div>
  );
}

// ── T2: Two big mode tabs that ARE the header ────────────────────────────────
function T2() {
  const [mode, setMode] = useState<Mode>('daily');
  return (
    <div className="min-h-full flex flex-col">
      <div className="text-white" style={{ background: `linear-gradient(180deg, ${REVENGE_RED} 0%, ${REVENGE_RED_DARK} 100%)` }}>
        <div className="px-4 pt-12 flex items-center justify-between">
          <div className="bg-white rounded-xl px-2 py-1"><RookiesRevengeLogo scale={0.3} /></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">{TODAY}</span>
        </div>
        {/* Big tabs — underline style, mode names with subtitles */}
        <div className="mt-4 px-4 grid grid-cols-2" role="tablist" aria-label="Game mode">
          {(['daily', 'ladder'] as Mode[]).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(m)}
                className={`min-h-[52px] text-left pb-2 border-b-4 transition-colors ${active ? 'border-white' : 'border-transparent'}`}
              >
                <span className={`block text-[16px] font-black leading-tight ${active ? '' : 'opacity-55'}`}>
                  {m === 'daily' ? 'Daily' : 'Ladder'}
                </span>
                <span className={`block text-[10px] font-bold uppercase tracking-wide ${active ? 'opacity-80' : 'opacity-40'}`}>
                  {m === 'daily' ? `today's run` : '4 difficulties'}
                </span>
              </button>
            );
          })}
        </div>
        <div className="px-4 pb-5">
          <HeroContent mode={mode} />
        </div>
      </div>
      <BelowFold mode={mode} />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const OPTIONS = [
  { n: 'T1', title: 'Segmented Pill', pitch: 'App-store-style segmented control in the red band. Tap it — the hero and the content below both switch.', C: T1 },
  { n: 'T2', title: 'Big Tabs', pitch: 'The modes ARE the header — two named tabs with subtitles and an underline. Loudest "two game modes" signal.', C: T2 },
];

export default function Page() {
  return (
    <main className="min-h-screen w-full overflow-auto bg-[#dfe9f2] text-chess-text p-6">
      <div className="max-w-[1700px] mx-auto">
        <h1 className="text-2xl font-black">Revenge home — Round 5: C1 + Daily/Ladder toggle</h1>
        <p className="text-sm text-chess-text-muted mt-1 max-w-2xl">
          Both phones are LIVE — tap Daily/Ladder on them. Daily = today&apos;s run + leaderboard. Ladder = the four difficulty runs. Codex on both.
          Previous rounds: <Link href="/test/revenge-home/hero" className="font-bold text-chess-blue underline">/hero</Link>.
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
