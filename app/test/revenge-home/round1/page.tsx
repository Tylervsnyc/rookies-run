'use client';

import { useState, type ReactNode } from 'react';
import {
  REVENGE_RED,
  REVENGE_RED_DARK,
  REVENGE_TAGLINE,
  RevengeMarkSvg,
  RookiesRevengeLogo,
} from '@/components/run/RookiesRevengeLogo';
import { TrophyGlyph } from '@/components/run/AchievementToast';

/**
 * /test/revenge-home — 5 home-screen redesign concepts for Rookie's Revenge.
 * Every concept has the same three windows: Daily Challenge, Global
 * Leaderboard, and the Unlock Ladder (beat levels → unlock abilities).
 * Mock data only — nothing here is wired.
 */

// ── Mock data ────────────────────────────────────────────────────────────────
const TODAY = 'Sat, Aug 30';
const COUNTDOWN = '09:41:12';
const YOU = { name: 'Tylervsnyc', rank: 47, best: 8, score: 12_940 };
const BOARD = [
  { rank: 1, name: 'kingslayer_ru', score: 31_200, lvl: 12 },
  { rank: 2, name: 'pawnstorm', score: 29_870, lvl: 12 },
  { rank: 3, name: 'gleasons_gym', score: 27_410, lvl: 11 },
  { rank: 4, name: 'moxie.chess', score: 24_005, lvl: 11 },
  { rank: 5, name: 'h8_bishops', score: 22_390, lvl: 10 },
];
type Rung = { lvl: number; unlock?: string; state: 'done' | 'next' | 'locked' };
const LADDER: Rung[] = [
  { lvl: 1, unlock: 'Surge', state: 'done' },
  { lvl: 2, state: 'done' },
  { lvl: 3, unlock: 'Freeze Ray', state: 'done' },
  { lvl: 4, state: 'done' },
  { lvl: 5, unlock: 'Drones', state: 'done' },
  { lvl: 6, state: 'done' },
  { lvl: 7, unlock: 'Boulder', state: 'done' },
  { lvl: 8, state: 'done' },
  { lvl: 9, unlock: 'Smoke', state: 'next' },
  { lvl: 10, state: 'locked' },
  { lvl: 11, unlock: 'Rewind', state: 'locked' },
  { lvl: 12, unlock: 'Magnet', state: 'locked' },
  { lvl: 13, state: 'locked' },
  { lvl: 14, unlock: 'Bodyguard', state: 'locked' },
  { lvl: 15, unlock: 'Nightmare', state: 'locked' },
];
const DONE = LADDER.filter((r) => r.state === 'done').length;

// ── Tiny shared bits ─────────────────────────────────────────────────────────
function Lock({ size = 10, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 9 11" aria-hidden className={className}>
      <rect x="0.5" y="4.5" width="8" height="6" rx="1.2" fill="currentColor" />
      <path d="M2 4.5V3a2.5 2.5 0 0 1 5 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function Check({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden>
      <path d="M2 6.5 5 9.5 10 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Crown({ size = 12, color = '#f5cf5a' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M3 18h18l-1.5-9-4.5 4-3-7-3 7-4.5-4L3 18Z" fill={color} />
      <rect x="3" y="19" width="18" height="2.5" rx="1" fill={color} />
    </svg>
  );
}
function Phone({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      className={`relative w-[360px] h-[760px] shrink-0 rounded-[36px] border-[6px] border-[#1a1a1a] overflow-hidden shadow-xl ${
        dark ? 'bg-[#0f1216] text-white' : 'bg-chess-page text-chess-text'
      }`}
    >
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#1a1a1a] z-20" />
      <div className="h-full w-full overflow-auto pt-8 pb-6">{children}</div>
    </div>
  );
}
function BigButton({ label, sub, dark }: { label: string; sub?: string; dark?: boolean }) {
  return (
    <button
      type="button"
      className="w-full min-h-[52px] rounded-2xl font-black text-white text-[16px] tracking-wide flex flex-col items-center justify-center leading-tight active:translate-y-[2px]"
      style={{ background: REVENGE_RED, boxShadow: `0 4px 0 ${REVENGE_RED_DARK}${dark ? ', 0 0 24px rgba(229,57,53,.35)' : ''}` }}
    >
      {label}
      {sub && <span className="text-[10px] font-bold opacity-80 tracking-[0.15em] uppercase">{sub}</span>}
    </button>
  );
}
function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`text-[10px] font-black uppercase tracking-[0.22em] ${dark ? 'text-white/45' : 'text-chess-text-muted'}`}>
      {children}
    </p>
  );
}
function Countdown({ dark }: { dark?: boolean }) {
  return (
    <span className={`font-mono text-[11px] font-bold tabular-nums ${dark ? 'text-white/60' : 'text-chess-text-muted'}`}>
      resets in {COUNTDOWN}
    </span>
  );
}
function MiniBoard({ size = 96 }: { size?: number }) {
  const cell = size / 8;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="rounded-md overflow-hidden">
      {Array.from({ length: 64 }).map((_, i) => {
        const r = Math.floor(i / 8), c = i % 8;
        return <rect key={i} x={c * cell} y={r * cell} width={cell} height={cell} fill={(r + c) % 2 ? '#b58863' : '#f0d9b5'} />;
      })}
      {/* rook at a1 (rainbow-ish), king at h8 (target) */}
      <rect x={cell * 0.2} y={cell * 7.2} width={cell * 0.6} height={cell * 0.6} rx={1} fill="#1CB0F6" />
      <circle cx={cell * 7.5} cy={cell * 0.5} r={cell * 0.42} fill="none" stroke={REVENGE_RED} strokeWidth={2} />
      <circle cx={cell * 7.5} cy={cell * 0.5} r={cell * 0.12} fill={REVENGE_RED} />
      {[1.5, 2.5, 3.5, 4.5, 5.5].map((c, i) => (
        <rect key={i} x={cell * c - cell * 0.25} y={cell * (2 + (i % 3)) + cell * 0.25} width={cell * 0.5} height={cell * 0.5} rx={1} fill="#222" />
      ))}
    </svg>
  );
}

// ── Concept 1: The Stack ─────────────────────────────────────────────────────
function ConceptStack() {
  return (
    <Phone>
      <div className="px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <RookiesRevengeLogo scale={0.4} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-chess-text-muted">{TODAY}</span>
        </div>

        {/* Daily */}
        <section className="bg-white rounded-2xl p-3 border border-chess-text/10 shadow-sm">
          <div className="flex items-center justify-between">
            <Eyebrow>Today&apos;s Hunt</Eyebrow>
            <Countdown />
          </div>
          <div className="flex gap-3 mt-2 items-center">
            <MiniBoard size={92} />
            <div className="flex-1">
              <p className="text-[17px] font-black leading-tight">Stone Citadel</p>
              <p className="text-[11px] text-chess-text-muted italic mt-0.5">15 levels · one king · same board for everyone</p>
              <div className="flex gap-3 mt-2 text-[10px] font-bold text-chess-text-muted">
                <span><b className="text-chess-text text-[13px]">2,318</b> hunting</span>
                <span><b className="text-chess-text text-[13px]">14%</b> got him</span>
              </div>
            </div>
          </div>
          <div className="mt-3"><BigButton label="HUNT THE KING" sub="Normal · 3 retries" /></div>
        </section>

        {/* Leaderboard */}
        <section className="bg-white rounded-2xl p-3 border border-chess-text/10 shadow-sm">
          <div className="flex items-center justify-between">
            <Eyebrow>Global Leaderboard</Eyebrow>
            <span className="text-[10px] font-bold text-chess-blue">See all ›</span>
          </div>
          <ul className="mt-2 divide-y divide-chess-text/5">
            {BOARD.slice(0, 3).map((p) => (
              <li key={p.rank} className="flex items-center gap-2 py-1.5">
                <span className="w-5 text-center text-[12px] font-black">{p.rank === 1 ? <Crown /> : p.rank}</span>
                <span className="flex-1 text-[12px] font-bold truncate">{p.name}</span>
                <span className="text-[10px] text-chess-text-muted">L{p.lvl}</span>
                <span className="text-[12px] font-black tabular-nums w-14 text-right">{p.score.toLocaleString()}</span>
              </li>
            ))}
            <li className="flex items-center gap-2 py-1.5 -mx-3 px-3 mt-1 rounded-lg" style={{ background: '#FFEBEE' }}>
              <span className="w-5 text-center text-[12px] font-black" style={{ color: REVENGE_RED }}>{YOU.rank}</span>
              <span className="flex-1 text-[12px] font-black truncate">{YOU.name} <span className="text-[9px] font-bold text-chess-text-muted">(you)</span></span>
              <span className="text-[10px] text-chess-text-muted">L{YOU.best}</span>
              <span className="text-[12px] font-black tabular-nums w-14 text-right">{YOU.score.toLocaleString()}</span>
            </li>
          </ul>
        </section>

        {/* Ladder */}
        <section className="bg-white rounded-2xl p-3 border border-chess-text/10 shadow-sm">
          <div className="flex items-center justify-between">
            <Eyebrow>The Ladder</Eyebrow>
            <span className="text-[10px] font-bold text-chess-text-muted">{DONE}/{LADDER.length} beaten</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-chess-page overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(DONE / LADDER.length) * 100}%`, background: REVENGE_RED }} />
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {LADDER.map((r) => (
              <div
                key={r.lvl}
                className={`rounded-lg p-1 text-center border ${
                  r.state === 'done'
                    ? 'bg-chess-text text-white border-chess-text'
                    : r.state === 'next'
                      ? 'border-2 text-chess-text'
                      : 'bg-chess-page text-chess-text-faint border-transparent'
                }`}
                style={r.state === 'next' ? { borderColor: REVENGE_RED } : undefined}
              >
                <div className="text-[11px] font-black leading-none">{r.lvl}</div>
                <div className="text-[7.5px] font-bold uppercase tracking-wide leading-tight mt-0.5 h-[16px] flex items-center justify-center">
                  {r.unlock ? (r.state === 'locked' ? <Lock size={7} /> : r.unlock) : ''}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-chess-text-muted italic mt-2">Beat level 9 → unlock <b className="not-italic text-chess-text">Smoke</b>.</p>
        </section>
      </div>
    </Phone>
  );
}

// ── Concept 2: The Climb (ladder IS the home screen) ─────────────────────────
function ConceptClimb() {
  const rungs = [...LADDER].reverse();
  return (
    <Phone>
      {/* Pinned daily banner */}
      <div className="sticky top-0 z-10 px-3 pb-2 bg-gradient-to-b from-chess-page via-chess-page to-transparent">
        <div className="rounded-2xl p-3 text-white shadow-md flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${REVENGE_RED}, ${REVENGE_RED_DARK})` }}>
          <RevengeMarkSvg size={44} ringColor="#fff" />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Daily · {TODAY}</p>
            <p className="text-[15px] font-black leading-tight">Stone Citadel</p>
            <p className="text-[10px] opacity-80 font-mono">{COUNTDOWN} left · #{YOU.rank} of 2,318</p>
          </div>
          <button type="button" className="min-h-[44px] px-3 rounded-xl bg-white text-[12px] font-black" style={{ color: REVENGE_RED }}>PLAY</button>
        </div>
      </div>

      {/* Floating rank pill → opens leaderboard sheet */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
        <button type="button" className="min-h-[44px] rounded-full bg-chess-text text-white pl-3 pr-4 flex items-center gap-2 shadow-lg text-[12px] font-black">
          <Crown size={14} /> Global #{YOU.rank} <span className="opacity-60 font-bold">· top 2%</span>
          <span className="opacity-60">▲</span>
        </button>
      </div>

      {/* The climb */}
      <div className="px-6 pt-2 pb-20 relative">
        <div className="flex items-center justify-between mb-2">
          <RookiesRevengeLogo scale={0.36} />
          <span className="text-[10px] font-bold text-chess-text-muted">{DONE}/{LADDER.length}</span>
        </div>
        <div className="absolute left-1/2 top-12 bottom-20 w-1.5 -translate-x-1/2 rounded-full bg-chess-text/10" />
        <div className="absolute left-1/2 bottom-20 w-1.5 -translate-x-1/2 rounded-full" style={{ height: `${(DONE / LADDER.length) * 92}%`, background: REVENGE_RED }} />
        <ul className="relative flex flex-col gap-2.5">
          {rungs.map((r, i) => {
            const left = i % 2 === 0;
            const node = (
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-[14px] border-4 border-chess-page shadow-sm ${
                  r.state === 'done' ? 'bg-chess-text text-white' : r.state === 'next' ? 'text-white animate-pulse' : 'bg-white text-chess-text-faint'
                }`}
                style={r.state === 'next' ? { background: REVENGE_RED } : undefined}
              >
                {r.state === 'locked' ? <Lock size={11} /> : r.state === 'done' ? <Check size={16} /> : r.lvl}
              </div>
            );
            const label = r.unlock ? (
              <div className={`rounded-xl px-2.5 py-1.5 border bg-white shadow-sm ${r.state === 'locked' ? 'opacity-60' : ''}`} style={r.state === 'next' ? { borderColor: REVENGE_RED } : undefined}>
                <p className="text-[8.5px] font-black uppercase tracking-[0.15em] text-chess-text-muted">Lvl {r.lvl} unlocks</p>
                <p className="text-[12px] font-black leading-tight">{r.unlock}</p>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-chess-text-faint">Lvl {r.lvl}</span>
            );
            return (
              <li key={r.lvl} className="grid grid-cols-[1fr_48px_1fr] items-center gap-2">
                <div className="flex justify-end">{left ? label : null}</div>
                {node}
                <div className="flex justify-start">{left ? null : label}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </Phone>
  );
}

// ── Concept 3: The Arena (dark, tabbed windows) ──────────────────────────────
function ConceptArena() {
  const [tab, setTab] = useState<'daily' | 'board' | 'ladder'>('daily');
  const tabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'board', label: 'Leaderboard' },
    { id: 'ladder', label: 'Ladder' },
  ] as const;
  return (
    <Phone dark>
      <div className="px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <RookiesRevengeLogo scale={0.4} dark />
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-black">
            <Crown size={12} /> #{YOU.rank}
          </div>
        </div>

        {/* Hero: the target */}
        <div className="relative rounded-3xl overflow-hidden p-4 border border-white/10" style={{ background: 'radial-gradient(120% 90% at 50% 0%, rgba(229,57,53,.35), rgba(15,18,22,0) 60%)' }}>
          <div className="flex items-center justify-center">
            <div className="relative">
              <RevengeMarkSvg size={150} />
              <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ border: `2px solid ${REVENGE_RED}` }} />
            </div>
          </div>
          <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mt-2">Target acquired · {TODAY}</p>
          <p className="text-center text-[20px] font-black leading-tight">Stone Citadel</p>
          <p className="text-center text-[11px] text-white/55 italic">{REVENGE_TAGLINE}</p>
          <div className="mt-3"><BigButton label="BEGIN THE HUNT" sub={`resets in ${COUNTDOWN}`} dark /></div>
        </div>

        {/* Segmented windows */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/5 p-1 border border-white/10">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`min-h-[40px] rounded-lg text-[11px] font-black ${tab === t.id ? 'bg-white text-[#0f1216]' : 'text-white/60'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-3 min-h-[230px]">
          {tab === 'daily' && (
            <div className="flex flex-col gap-2">
              <Eyebrow dark>Today&apos;s rules</Eyebrow>
              {[
                ['15 levels', 'Same board for every player on Earth.'],
                ['3 retries', 'Normal difficulty. Switch in settings.'],
                ['Score', 'Speed × captures × no-retry bonus.'],
              ].map(([t, s]) => (
                <div key={t} className="flex gap-3 items-start">
                  <span className="text-[12px] font-black w-16 shrink-0" style={{ color: REVENGE_RED }}>{t}</span>
                  <span className="text-[12px] text-white/70">{s}</span>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[['2,318', 'hunting'], ['14%', 'took the king'], ['8', 'your best lvl']].map(([n, l]) => (
                  <div key={l} className="rounded-xl bg-black/30 p-2 text-center">
                    <div className="text-[18px] font-black leading-none">{n}</div>
                    <div className="text-[9px] uppercase tracking-wider text-white/50 mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'board' && (
            <ul className="flex flex-col gap-1">
              {BOARD.map((p) => (
                <li key={p.rank} className="flex items-center gap-2 py-1.5 border-b border-white/5">
                  <span className="w-6 text-center text-[12px] font-black">{p.rank <= 3 ? <Crown color={['#f5cf5a', '#cfd4da', '#d4956a'][p.rank - 1]} /> : p.rank}</span>
                  <span className="flex-1 text-[12px] font-bold truncate">{p.name}</span>
                  <span className="text-[10px] text-white/50">L{p.lvl}</span>
                  <span className="text-[12px] font-black tabular-nums">{p.score.toLocaleString()}</span>
                </li>
              ))}
              <li className="flex items-center gap-2 py-1.5 mt-1 rounded-lg px-2 -mx-2" style={{ background: 'rgba(229,57,53,.18)' }}>
                <span className="w-6 text-center text-[12px] font-black" style={{ color: REVENGE_RED }}>{YOU.rank}</span>
                <span className="flex-1 text-[12px] font-black truncate">{YOU.name}</span>
                <span className="text-[10px] text-white/50">L{YOU.best}</span>
                <span className="text-[12px] font-black tabular-nums">{YOU.score.toLocaleString()}</span>
              </li>
            </ul>
          )}
          {tab === 'ladder' && (
            <div>
              <div className="flex items-center justify-between">
                <Eyebrow dark>Unlocks</Eyebrow>
                <span className="text-[10px] font-bold text-white/50">{DONE}/{LADDER.length}</span>
              </div>
              <div className="mt-2 flex gap-1">
                {LADDER.map((r) => (
                  <div key={r.lvl} className="flex-1 h-2 rounded-sm" style={{ background: r.state === 'done' ? REVENGE_RED : r.state === 'next' ? '#fff' : 'rgba(255,255,255,.12)' }} />
                ))}
              </div>
              <ul className="mt-3 flex flex-col gap-1.5">
                {LADDER.filter((r) => r.unlock).map((r) => (
                  <li key={r.lvl} className={`flex items-center gap-2 text-[12px] ${r.state === 'locked' ? 'text-white/40' : ''}`}>
                    <span className="w-9 text-[10px] font-black uppercase tracking-wider text-white/50">L{r.lvl}</span>
                    <span className="flex-1 font-black">{r.unlock}</span>
                    {r.state === 'done' ? <span className="text-chess-green"><Check size={12} /></span> : r.state === 'next' ? <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded" style={{ background: REVENGE_RED }}>next</span> : <Lock size={9} />}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Phone>
  );
}

// ── Concept 4: The Bento ─────────────────────────────────────────────────────
function ConceptBento() {
  const Tile = ({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => (
    <div className={`rounded-2xl bg-white border border-chess-text/10 shadow-sm p-3 ${className}`} style={style}>{children}</div>
  );
  return (
    <Phone>
      <div className="px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <RookiesRevengeLogo scale={0.4} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-chess-text-muted">{TODAY}</span>
        </div>
        <p className="text-[15px] font-black leading-tight">One rook. Their whole army. Take the king.</p>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Daily — big */}
          <Tile className="col-span-2 text-white border-0" style={{ background: `linear-gradient(160deg, #1f1f1f, #0f1216)` }}>
            <div className="flex items-center justify-between">
              <Eyebrow dark>Daily Challenge</Eyebrow>
              <Countdown dark />
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="rounded-xl overflow-hidden ring-2" style={{ ['--tw-ring-color' as string]: REVENGE_RED }}><MiniBoard size={84} /></div>
              <div className="flex-1">
                <p className="text-[18px] font-black leading-none">Stone Citadel</p>
                <p className="text-[10px] text-white/55 mt-1">15 levels · 2,318 hunting</p>
                <div className="mt-2"><BigButton label="HUNT" dark /></div>
              </div>
            </div>
          </Tile>

          {/* Leaderboard — tall */}
          <Tile className="row-span-2 flex flex-col">
            <Eyebrow>Leaderboard</Eyebrow>
            <ul className="mt-2 flex-1 flex flex-col gap-1.5">
              {BOARD.slice(0, 5).map((p) => (
                <li key={p.rank} className="flex items-center gap-1.5">
                  <span className="w-4 text-[10px] font-black text-chess-text-muted">{p.rank}</span>
                  <span className="flex-1 text-[11px] font-bold truncate">{p.name}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 rounded-xl p-2 text-center" style={{ background: '#FFEBEE' }}>
              <div className="text-[20px] font-black leading-none" style={{ color: REVENGE_RED }}>#{YOU.rank}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-chess-text-muted mt-0.5">you · top 2%</div>
            </div>
          </Tile>

          {/* Ladder — compact ring */}
          <Tile>
            <Eyebrow>Ladder</Eyebrow>
            <div className="flex items-center gap-2 mt-1">
              <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
                <circle cx="28" cy="28" r="23" fill="none" stroke="#eef6fc" strokeWidth="7" />
                <circle cx="28" cy="28" r="23" fill="none" stroke={REVENGE_RED} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(DONE / LADDER.length) * 144.5} 144.5`} transform="rotate(-90 28 28)" />
                <text x="28" y="32" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1f2937">{DONE}</text>
              </svg>
              <div>
                <p className="text-[10px] text-chess-text-muted font-bold">of {LADDER.length} beaten</p>
                <p className="text-[11px] font-black leading-tight mt-0.5">Next: Smoke</p>
                <p className="text-[9px] text-chess-text-muted">beat lvl 9</p>
              </div>
            </div>
          </Tile>

          {/* Arsenal */}
          <Tile>
            <Eyebrow>Arsenal</Eyebrow>
            <div className="grid grid-cols-4 gap-1 mt-1.5">
              {LADDER.filter((r) => r.unlock).slice(0, 8).map((r) => (
                <div key={r.lvl} title={r.unlock} className={`aspect-square rounded-md flex items-center justify-center text-[8px] font-black ${r.state === 'done' ? 'bg-chess-text text-white' : 'bg-chess-page text-chess-text-faint'}`}>
                  {r.state === 'done' ? r.unlock!.slice(0, 2).toUpperCase() : <Lock size={7} />}
                </div>
              ))}
            </div>
          </Tile>

          {/* Difficulty + trophies row */}
          <Tile className="col-span-2 flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <TrophyGlyph size={18} />
              <span className="text-[11px] font-bold">21 / 54 trophies</span>
            </div>
            <div className="flex gap-1 rounded-lg bg-chess-page p-0.5">
              {['Rookie', 'Normal', 'Hard', 'Nightmare'].map((d, i) => (
                <span key={d} className={`px-2 py-1 rounded-md text-[9px] font-black ${i === 1 ? 'bg-chess-text text-white' : i === 3 ? 'text-chess-text-faint' : 'text-chess-text-muted'}`}>{d}</span>
              ))}
            </div>
          </Tile>
        </div>
      </div>
    </Phone>
  );
}

// ── Concept 5: Most Wanted (story-forward) ───────────────────────────────────
function ConceptWanted() {
  const RANKS = ['Pawn', 'Knight', 'Bishop', 'Rook', 'Queen', 'Kingslayer'];
  return (
    <Phone>
      <div className="px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <RookiesRevengeLogo scale={0.4} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-chess-text-muted">{TODAY}</span>
        </div>

        {/* Wanted poster */}
        <section className="rounded-2xl overflow-hidden border-2 border-chess-text shadow-sm bg-[#fbf6e9]">
          <div className="bg-chess-text text-white text-center py-1.5">
            <p className="text-[18px] font-black tracking-[0.3em] leading-none">WANTED</p>
            <p className="text-[8px] uppercase tracking-[0.3em] opacity-70 mt-0.5">today&apos;s king · {TODAY}</p>
          </div>
          <div className="p-3 flex gap-3 items-center">
            <div className="relative shrink-0">
              <div className="w-[88px] h-[88px] rounded-xl bg-white border border-chess-text/20 flex items-center justify-center text-[52px] font-black" style={{ color: '#222' }}>♚</div>
              <div className="absolute -top-2 -right-2 rotate-12 text-[9px] font-black px-1.5 py-0.5 rounded border-2 bg-white" style={{ color: REVENGE_RED, borderColor: REVENGE_RED }}>ALIVE</div>
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-black leading-tight">The King of Stone Citadel</p>
              <p className="text-[10.5px] text-chess-text-muted italic leading-snug mt-0.5">Hiding behind 15 levels of his army. Nobody told him it was over.</p>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-[9px] uppercase tracking-wider font-black text-chess-text-muted">Bounty</span>
                <span className="text-[16px] font-black" style={{ color: REVENGE_RED }}>31,200 pts</span>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3 flex items-center gap-2">
            <div className="flex-1"><BigButton label="GO GET HIM" /></div>
            <div className="text-right">
              <Countdown />
              <p className="text-[9px] text-chess-text-muted">2,318 on his trail</p>
            </div>
          </div>
        </section>

        {/* Most wanted hunters */}
        <section className="bg-white rounded-2xl p-3 border border-chess-text/10 shadow-sm">
          <div className="flex items-center justify-between">
            <Eyebrow>Top Hunters · Global</Eyebrow>
            <span className="text-[10px] font-bold text-chess-blue">Full board ›</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[BOARD[1], BOARD[0], BOARD[2]].map((p, i) => {
              const place = [2, 1, 3][i];
              const h = place === 1 ? 'h-16' : place === 2 ? 'h-12' : 'h-10';
              return (
                <div key={p.rank} className="flex flex-col items-center justify-end">
                  <Crown size={place === 1 ? 18 : 13} color={['#f5cf5a', '#cfd4da', '#d4956a'][place - 1]} />
                  <p className="text-[10px] font-black truncate max-w-full">{p.name}</p>
                  <p className="text-[9px] text-chess-text-muted tabular-nums">{p.score.toLocaleString()}</p>
                  <div className={`w-full ${h} mt-1 rounded-t-lg flex items-start justify-center pt-1 text-[11px] font-black text-white`} style={{ background: place === 1 ? REVENGE_RED : '#1f2937' }}>{place}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between rounded-xl px-3 py-2" style={{ background: '#FFEBEE' }}>
            <span className="text-[11px] font-black">You · #{YOU.rank}</span>
            <span className="text-[10px] font-bold text-chess-text-muted">2,290 pts to #46</span>
          </div>
        </section>

        {/* Rap sheet = ladder as titles */}
        <section className="bg-white rounded-2xl p-3 border border-chess-text/10 shadow-sm">
          <div className="flex items-center justify-between">
            <Eyebrow>Your Rap Sheet</Eyebrow>
            <span className="text-[10px] font-bold text-chess-text-muted">{DONE} levels beaten</span>
          </div>
          <div className="mt-2 flex items-end gap-1">
            {RANKS.map((r, i) => {
              const need = i * 3;
              const done = DONE >= need;
              const current = done && (i === RANKS.length - 1 || DONE < (i + 1) * 3);
              return (
                <div key={r} className="flex-1 flex flex-col items-center gap-1">
                  <span className={`text-[8px] font-black uppercase tracking-wide ${done ? 'text-chess-text' : 'text-chess-text-faint'}`}>{r}</span>
                  <div className={`w-full rounded-md flex items-center justify-center text-white text-[9px] font-black ${done ? '' : 'bg-chess-page'}`} style={{ height: 18 + i * 7, background: done ? (current ? REVENGE_RED : '#1f2937') : undefined }}>
                    {done ? '' : <span className="text-chess-text-faint"><Lock size={7} /></span>}
                  </div>
                  <span className="text-[8px] text-chess-text-muted">L{need || 1}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2.5 flex flex-col gap-1">
            {LADDER.filter((r) => r.unlock && r.state !== 'done').slice(0, 3).map((r) => (
              <div key={r.lvl} className="flex items-center gap-2 text-[11px]">
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black" style={r.state === 'next' ? { background: REVENGE_RED, color: '#fff' } : { background: '#eef6fc', color: '#9aa7b3' }}>{r.lvl}</span>
                <span className={`flex-1 ${r.state === 'next' ? 'font-black' : 'text-chess-text-muted'}`}>Beat level {r.lvl} → <b>{r.unlock}</b></span>
                {r.state === 'next' && <span className="text-[9px] font-black uppercase" style={{ color: REVENGE_RED }}>tonight?</span>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </Phone>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const CONCEPTS = [
  { n: 1, title: 'The Stack', pitch: 'Three clean white windows, top to bottom: Hunt → Board → Ladder. Closest to today’s landing; lowest risk.', C: ConceptStack },
  { n: 2, title: 'The Climb', pitch: 'The ladder IS the home screen (Duolingo path). Daily is a pinned red banner; leaderboard is a floating rank pill that opens a sheet.', C: ConceptClimb },
  { n: 3, title: 'The Arena', pitch: 'Dark, dramatic. Big reticle hero + one CTA, then Daily / Leaderboard / Ladder as tabbed windows (tap them).', C: ConceptArena },
  { n: 4, title: 'The Bento', pitch: 'Everything visible at once, no scrolling: big daily tile, tall leaderboard, progress ring, arsenal grid.', C: ConceptBento },
  { n: 5, title: 'Most Wanted', pitch: 'Story-forward. Daily = WANTED poster for today’s king with a bounty; leaderboard = top hunters podium; ladder = your rap sheet of rank titles.', C: ConceptWanted },
];

export default function RevengeHomeConceptsPage() {
  return (
    <main className="h-full overflow-auto bg-[#e6eef5] text-chess-text">
      <div className="px-6 pt-6 pb-2 max-w-[1900px] mx-auto">
        <h1 className="text-2xl font-black">Rookie&apos;s Revenge — home screen concepts</h1>
        <p className="text-sm text-chess-text-muted mt-1">
          Five directions. Each one has the same three windows — <b>Daily Challenge</b>, <b>Global Leaderboard</b>, <b>Unlock Ladder</b> — arranged differently. Mock data; scroll inside each phone.
        </p>
      </div>
      <div className="flex gap-6 px-6 pb-12 overflow-x-auto max-w-[1900px] mx-auto items-start">
        {CONCEPTS.map(({ n, title, pitch, C }) => (
          <div key={n} className="shrink-0 w-[360px] flex flex-col gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: REVENGE_RED }}>Concept {n}</p>
              <h2 className="text-lg font-black leading-tight">{title}</h2>
              <p className="text-[12px] text-chess-text-muted leading-snug mt-1 min-h-[54px]">{pitch}</p>
            </div>
            <C />
          </div>
        ))}
      </div>
    </main>
  );
}
