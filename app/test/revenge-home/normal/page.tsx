'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { REVENGE_RED, REVENGE_RED_DARK, RookiesRevengeLogo } from '@/components/run/RookiesRevengeLogo';

/**
 * /test/revenge-home/normal — ROUND 3. "Just make it look like Chess Path."
 * Light-blue page, white rounded cards, DM Sans, Duolingo-style buttons.
 * Revenge red survives only as the accent + CTA. No wood, no newspaper.
 */

// ── Mock data ────────────────────────────────────────────────────────────────
const TODAY = 'Sun, Aug 31';
const COUNTDOWN = '09:41:12';
const TOTAL_LEVELS = 15;
const BEST = 8;
const HUNTING = 2318;
const BOARD = [
  { rank: 1, name: 'kingslayer_ru', lvl: 15, caps: 31 },
  { rank: 2, name: 'pawnstorm', lvl: 14, caps: 29 },
  { rank: 3, name: 'gleasons_gym', lvl: 12, caps: 27 },
  { rank: 4, name: 'moxie.chess', lvl: 11, caps: 24 },
  { rank: 5, name: 'h8_bishops', lvl: 10, caps: 22 },
];
const ME = { rank: 47, name: 'Tylervsnyc', lvl: 8, caps: 12 };
const DIFFS = ['Rookie', 'Normal', 'Hard', 'Cruel'];
const ACTIVE_DIFF = 'Normal';
const POWER_LEVELS = [1, 3, 5, 7, 9, 11, 12, 14, 15];
const NEXT_POWER = { name: 'Smoke', hint: 'Clear level 9 on any difficulty' };
const POWERS = { have: 8, total: 18 };
const TROPHIES = { have: 21, total: 54 };

// ── Shared bits ──────────────────────────────────────────────────────────────
function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[360px] h-[760px] shrink-0 rounded-[36px] border-[6px] border-[#1a1a1a] overflow-hidden shadow-xl bg-chess-page text-chess-text">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#1a1a1a] z-30" />
      <div className="h-full w-full overflow-auto">{children}</div>
    </div>
  );
}

function GoButton({ label = 'GO GET HIM', sub, color = REVENGE_RED, shadow = REVENGE_RED_DARK }: { label?: string; sub?: string; color?: string; shadow?: string }) {
  return (
    <button
      type="button"
      className="w-full min-h-[52px] rounded-2xl text-white font-black text-[16px] tracking-wide flex flex-col items-center justify-center leading-tight active:translate-y-px transition-transform"
      style={{ background: color, boxShadow: `0 4px 0 ${shadow}` }}
    >
      {label}
      {sub && <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-90">{sub}</span>}
    </button>
  );
}

function DiffPills() {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {DIFFS.map((d) => {
        const active = d === ACTIVE_DIFF;
        const locked = d === 'Cruel';
        return (
          <button
            key={d}
            type="button"
            className={`min-h-[40px] rounded-xl text-[11px] font-black uppercase tracking-wide border-2 ${
              active
                ? 'text-white border-transparent'
                : locked
                  ? 'bg-white text-chess-text-faint border-chess-text/10'
                  : 'bg-white text-chess-text-muted border-chess-text/15'
            }`}
            style={active ? { background: REVENGE_RED, boxShadow: `0 2px 0 ${REVENGE_RED_DARK}` } : undefined}
          >
            {locked ? '🔒 ' : ''}
            {d}
          </button>
        );
      })}
    </div>
  );
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`bg-white rounded-2xl border border-chess-text/10 shadow-sm p-4 ${className}`}>{children}</section>;
}

function CardTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <h2 className="text-[12px] font-black uppercase tracking-[0.15em] text-chess-text-muted">{children}</h2>
      {right}
    </div>
  );
}

function BoardRows({ compact = false }: { compact?: boolean }) {
  return (
    <ul>
      {BOARD.slice(0, compact ? 3 : 5).map((r) => (
        <li key={r.rank} className="flex items-center gap-2.5 py-1.5 text-[13px] border-b border-chess-text/5 last:border-0">
          <span className={`w-5 font-black ${r.rank === 1 ? '' : 'text-chess-text-faint'}`} style={r.rank === 1 ? { color: '#FFB020' } : undefined}>
            {r.rank}
          </span>
          <span className="flex-1 font-bold truncate">{r.name}</span>
          <span className="text-[11px] text-chess-text-faint">L{r.lvl}{r.lvl === TOTAL_LEVELS ? ' ♚' : ''}</span>
          <span className="tabular-nums w-8 text-right text-[12px] text-chess-text-muted">{r.caps}×</span>
        </li>
      ))}
      <li className="flex items-center gap-2.5 py-1.5 mt-1 text-[13px] font-black rounded-lg px-2 -mx-2" style={{ background: '#FFEBEE', color: REVENGE_RED }}>
        <span className="w-5">{ME.rank}</span>
        <span className="flex-1 truncate">{ME.name} (you)</span>
        <span className="text-[11px] opacity-70">L{ME.lvl}</span>
        <span className="tabular-nums w-8 text-right text-[12px]">{ME.caps}×</span>
      </li>
    </ul>
  );
}

/** Horizontal level dots — light version of the route map, no treasure-map styling. */
function LevelDots() {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
        const lvl = i + 1;
        const done = lvl <= BEST;
        const next = lvl === BEST + 1;
        const king = lvl === TOTAL_LEVELS;
        const power = POWER_LEVELS.includes(lvl) && !king;
        return (
          <div
            key={lvl}
            className={`flex-1 rounded-full flex items-center justify-center text-[9px] font-black ${
              king ? 'h-6' : power ? 'h-5' : 'h-3'
            }`}
            style={{
              background: done ? '#2A3C45' : next ? REVENGE_RED : '#dde8f0',
              color: done || next ? '#fff' : '#94a3b8',
            }}
          >
            {king ? '♚' : power ? '★' : ''}
          </div>
        );
      })}
    </div>
  );
}

// ── Option A: The Classic — one centered card, exactly the chesspath register ─
function OptionClassic() {
  return (
    <div className="min-h-full flex items-center justify-center px-3 py-8">
      <div className="w-full flex flex-col gap-3">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <RookiesRevengeLogo scale={0.4} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-chess-text-muted font-bold">{TODAY}</span>
          </div>
          <h1 className="text-[20px] font-black leading-tight">Today&apos;s hunt is live.</h1>
          <p className="text-[13px] text-chess-text-muted mt-1 leading-snug">
            {TOTAL_LEVELS} levels between Rookie and the king. {HUNTING.toLocaleString()} hunters on his trail. Resets in {COUNTDOWN}.
          </p>
          <div className="mt-3">
            <DiffPills />
          </div>
          <div className="mt-3">
            <GoButton sub={`Normal · level 1 of ${TOTAL_LEVELS}`} />
          </div>
          <div className="mt-3 pt-3 border-t border-chess-text/10">
            <LevelDots />
            <p className="text-[11px] text-chess-text-muted mt-2">
              Best today: <b className="text-chess-text">L{BEST}</b> · Next power: <b className="text-chess-text">{NEXT_POWER.name}</b> at L9
            </p>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-chess-text-muted">
              You&apos;re <b style={{ color: REVENGE_RED }}>#{ME.rank}</b> of {HUNTING.toLocaleString()} today
            </span>
            <span className="text-[12px] font-black text-chess-blue">Leaderboard →</span>
          </div>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-chess-text-muted">
              Powers <b className="text-chess-text">{POWERS.have}/{POWERS.total}</b> · Trophies <b className="text-chess-text">{TROPHIES.have}/{TROPHIES.total}</b>
            </span>
            <span className="text-[12px] font-black text-chess-blue">Trophy Room →</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Option B: The Stack — scrollable home: hero, leaderboard, progress ───────
function OptionStack() {
  return (
    <div className="min-h-full px-3 pt-10 pb-6 flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <RookiesRevengeLogo scale={0.38} />
        <span className="text-[10px] uppercase tracking-[0.2em] text-chess-text-muted font-bold">{TODAY}</span>
      </div>

      <Card>
        <CardTitle right={<span className="text-[10px] font-bold text-chess-text-faint tabular-nums">resets {COUNTDOWN}</span>}>
          Today&apos;s hunt
        </CardTitle>
        <h1 className="text-[19px] font-black leading-tight">The king thinks it&apos;s over.</h1>
        <p className="text-[13px] text-chess-text-muted mt-1">
          {TOTAL_LEVELS} levels. {HUNTING.toLocaleString()} hunters. Rookie wants him back.
        </p>
        <div className="mt-3">
          <DiffPills />
        </div>
        <div className="mt-3">
          <GoButton sub={`Normal · level 1 of ${TOTAL_LEVELS}`} />
        </div>
      </Card>

      <Card>
        <CardTitle right={<span className="text-[11px] font-black text-chess-blue">Full board →</span>}>Global leaderboard</CardTitle>
        <BoardRows />
      </Card>

      <Card>
        <CardTitle right={<span className="text-[10px] font-bold text-chess-text-faint">best {BEST}/{TOTAL_LEVELS}</span>}>Your progress</CardTitle>
        <LevelDots />
        <p className="text-[12px] text-chess-text-muted mt-2.5 leading-snug">
          Next power: <b className="text-chess-text">{NEXT_POWER.name}</b> — {NEXT_POWER.hint}.
        </p>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-chess-page px-3 py-2.5">
          <span className="text-[12px] font-bold text-chess-text-muted">
            Powers <b className="text-chess-text">{POWERS.have}/{POWERS.total}</b> · Trophies <b className="text-chess-text">{TROPHIES.have}/{TROPHIES.total}</b>
          </span>
          <span className="text-[12px] font-black text-chess-blue">Trophy Room →</span>
        </div>
      </Card>
    </div>
  );
}

// ── Option C: The Hero — big red CTA up top, everything else below the fold ──
function OptionHero() {
  return (
    <div className="min-h-full flex flex-col">
      {/* Red hero band — the one place the brand goes loud */}
      <div className="px-4 pt-12 pb-6 text-white" style={{ background: `linear-gradient(180deg, ${REVENGE_RED} 0%, ${REVENGE_RED_DARK} 100%)` }}>
        <div className="flex items-center justify-between">
          <div className="bg-white rounded-xl px-2 py-1"><RookiesRevengeLogo scale={0.32} /></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-90">{TODAY}</span>
        </div>
        <h1 className="text-[24px] font-black leading-tight mt-4">Capture the king.</h1>
        <p className="text-[13px] mt-1 opacity-90">
          {TOTAL_LEVELS} levels · {HUNTING.toLocaleString()} hunters today · resets {COUNTDOWN}
        </p>
        <div className="mt-4">
          <button
            type="button"
            className="w-full min-h-[52px] rounded-2xl bg-white font-black text-[16px] tracking-wide active:translate-y-px transition-transform"
            style={{ color: REVENGE_RED, boxShadow: '0 4px 0 rgba(0,0,0,0.25)' }}
          >
            GO GET HIM
          </button>
        </div>
        <div className="mt-3">
          <div className="grid grid-cols-4 gap-1.5">
            {DIFFS.map((d) => {
              const active = d === ACTIVE_DIFF;
              const locked = d === 'Cruel';
              return (
                <button
                  key={d}
                  type="button"
                  className={`min-h-[36px] rounded-xl text-[11px] font-black uppercase tracking-wide ${
                    active ? 'bg-white' : locked ? 'bg-white/10 text-white/40' : 'bg-white/15 text-white'
                  }`}
                  style={active ? { color: REVENGE_RED } : undefined}
                >
                  {locked ? '🔒 ' : ''}
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Everything else: normal chesspath cards */}
      <div className="flex-1 px-3 -mt-3 pb-6 flex flex-col gap-3">
        <Card>
          <CardTitle right={<span className="text-[11px] font-black text-chess-blue">Full board →</span>}>Top hunters</CardTitle>
          <BoardRows compact />
        </Card>
        <Card>
          <CardTitle right={<span className="text-[10px] font-bold text-chess-text-faint">best {BEST}/{TOTAL_LEVELS}</span>}>Route to the king</CardTitle>
          <LevelDots />
          <p className="text-[12px] text-chess-text-muted mt-2.5">
            Next power: <b className="text-chess-text">{NEXT_POWER.name}</b> at L9.
          </p>
        </Card>
        <Card className="!p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-chess-text-muted">
              Powers <b className="text-chess-text">{POWERS.have}/{POWERS.total}</b> · Trophies <b className="text-chess-text">{TROPHIES.have}/{TROPHIES.total}</b>
            </span>
            <span className="text-[12px] font-black text-chess-blue">Trophy Room →</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Option D: The Bento — everything on one screen, no scroll ────────────────
function OptionBento() {
  return (
    <div className="h-full px-3 pt-10 pb-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-1">
        <RookiesRevengeLogo scale={0.36} />
        <span className="text-[10px] uppercase tracking-[0.2em] text-chess-text-muted font-bold">{TODAY}</span>
      </div>

      <Card className="!p-3.5">
        <div className="flex items-baseline justify-between">
          <h1 className="text-[17px] font-black leading-tight">Today&apos;s hunt</h1>
          <span className="text-[10px] font-bold text-chess-text-faint tabular-nums">resets {COUNTDOWN}</span>
        </div>
        <p className="text-[12px] text-chess-text-muted mt-0.5">
          {TOTAL_LEVELS} levels · {HUNTING.toLocaleString()} hunters on his trail
        </p>
        <div className="mt-2.5">
          <DiffPills />
        </div>
        <div className="mt-2.5">
          <GoButton sub={`Normal · level 1 of ${TOTAL_LEVELS}`} />
        </div>
      </Card>

      <div className="flex-1 grid grid-cols-2 gap-2.5 min-h-0">
        <Card className="!p-3 overflow-hidden">
          <CardTitle>Hunters</CardTitle>
          <ul className="text-[11.5px]">
            {BOARD.slice(0, 4).map((r) => (
              <li key={r.rank} className="flex items-center gap-1.5 py-1 border-b border-chess-text/5 last:border-0">
                <span className="w-3.5 font-black text-chess-text-faint">{r.rank}</span>
                <span className="flex-1 font-bold truncate">{r.name}</span>
              </li>
            ))}
          </ul>
          <div className="mt-1.5 rounded-lg px-2 py-1 text-[11.5px] font-black" style={{ background: '#FFEBEE', color: REVENGE_RED }}>
            #{ME.rank} you
          </div>
        </Card>
        <div className="flex flex-col gap-2.5 min-h-0">
          <Card className="!p-3 flex-1">
            <CardTitle>Progress</CardTitle>
            <p className="text-[26px] font-black leading-none">
              {BEST}<span className="text-[14px] text-chess-text-faint">/{TOTAL_LEVELS}</span>
            </p>
            <p className="text-[11px] text-chess-text-muted mt-1 leading-snug">
              Next power: <b className="text-chess-text">{NEXT_POWER.name}</b> at L9
            </p>
          </Card>
          <Card className="!p-3 flex-1">
            <CardTitle>Arsenal</CardTitle>
            <p className="text-[26px] font-black leading-none">
              {POWERS.have}<span className="text-[14px] text-chess-text-faint">/{POWERS.total}</span>
            </p>
            <p className="text-[11px] font-black text-chess-blue mt-1">Trophy Room →</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const OPTIONS = [
  { n: 'A', title: 'The Classic', pitch: 'One centered white card, same register as the /play landing. Difficulty pills, red GO, tiny progress strip. Lowest risk, most “chesspath.”', C: OptionClassic },
  { n: 'B', title: 'The Stack', pitch: 'Scrollable home: hero card → leaderboard card → progress card. Everything visible, all white cards on the blue page.', C: OptionStack },
  { n: 'C', title: 'The Hero', pitch: 'One red brand band up top with the CTA, then plain chesspath cards below. Keeps some Revenge drama without the desk clutter.', C: OptionHero },
  { n: 'D', title: 'The Bento', pitch: 'Whole home on one screen, no scroll: daily card + 2×2 tiles for leaderboard, progress, arsenal.', C: OptionBento },
];

export default function Page() {
  return (
    <main className="min-h-screen w-full overflow-auto bg-[#dfe9f2] text-chess-text p-6">
      <div className="max-w-[1700px] mx-auto">
        <h1 className="text-2xl font-black">Rookie&apos;s Revenge home — Round 3: back to normal</h1>
        <p className="text-sm text-chess-text-muted mt-1 max-w-2xl">
          Chesspath design language: light-blue page, white rounded cards, DM Sans, hard-shadow buttons. Revenge red is the accent, not the world.
          Rounds 1–2 (incl. the Desk) live at <Link href="/test/revenge-home" className="font-bold text-chess-blue underline">/test/revenge-home</Link>.
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
