'use client';

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { REVENGE_RED, REVENGE_RED_DARK, RevengeMarkSvg, RookiesRevengeLogo } from '@/components/run/RookiesRevengeLogo';

/**
 * /test/revenge-home/evidence — five calmer variants of "Rookie's Evidence
 * Wall". Every one keeps the three windows (Daily · Leaderboard · Ladder)
 * clearly labelled and readable; the corkboard/string/notes become texture,
 * not noise.
 */

// ── Mock data ────────────────────────────────────────────────────────────────
const TODAY = 'Sun, Aug 31';
const COUNTDOWN = '09:41:12';
const HUNTING = 2318;
const YOU = { name: 'Tylervsnyc', rank: 47, best: 8, score: 12_940 };
const BOARD = [
  { rank: 1, name: 'kingslayer_ru', score: 31_200, lvl: 15 },
  { rank: 2, name: 'pawnstorm', score: 29_870, lvl: 14 },
  { rank: 3, name: 'gleasons_gym', score: 27_410, lvl: 12 },
  { rank: 4, name: 'moxie.chess', score: 24_005, lvl: 11 },
  { rank: 5, name: 'h8_bishops', score: 22_390, lvl: 10 },
];
type Rung = { lvl: number; unlock?: string; state: 'done' | 'next' | 'locked' };
const LADDER: Rung[] = [
  { lvl: 1, unlock: 'Surge', state: 'done' }, { lvl: 2, state: 'done' }, { lvl: 3, unlock: 'Freeze Ray', state: 'done' },
  { lvl: 4, state: 'done' }, { lvl: 5, unlock: 'Drones', state: 'done' }, { lvl: 6, state: 'done' },
  { lvl: 7, unlock: 'Boulder', state: 'done' }, { lvl: 8, state: 'done' }, { lvl: 9, unlock: 'Smoke', state: 'next' },
  { lvl: 10, state: 'locked' }, { lvl: 11, unlock: 'Rewind', state: 'locked' }, { lvl: 12, unlock: 'Magnet', state: 'locked' },
  { lvl: 13, state: 'locked' }, { lvl: 14, unlock: 'Bodyguard', state: 'locked' }, { lvl: 15, unlock: 'Nightmare', state: 'locked' },
];
const DONE = LADDER.filter((r) => r.state === 'done').length;
const NEXT = LADDER.find((r) => r.state === 'next') as Rung & { unlock: string };
const UNLOCKS = LADDER.filter((r) => r.unlock);

const HAND: CSSProperties = { fontFamily: '"Marker Felt", "Bradley Hand", "Comic Sans MS", cursive' };
const TYPE: CSSProperties = { fontFamily: '"Courier New", ui-monospace, monospace' };

// ── Shared bits ──────────────────────────────────────────────────────────────
function Phone({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="relative w-[360px] h-[760px] shrink-0 rounded-[36px] border-[6px] border-[#1a1a1a] overflow-hidden shadow-xl text-[#222]" style={style}>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#1a1a1a] z-30" />
      <div className="h-full w-full overflow-auto">{children}</div>
    </div>
  );
}
function Lock({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 9 11" aria-hidden>
      <rect x="0.5" y="4.5" width="8" height="6" rx="1.2" fill="currentColor" />
      <path d="M2 4.5V3a2.5 2.5 0 0 1 5 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function TinyRook({ size = 18 }: { size?: number }) {
  const b = size / 5;
  const cols = ['#FF4B4B', '#FF9500', '#FFD700', '#58CC02', '#1CB0F6'];
  const shape = [[1, 0, 1, 0, 1], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0], [0, 1, 1, 1, 0], [0, 1, 1, 1, 0], [1, 1, 1, 1, 1]];
  return (
    <svg width={size} height={b * 6} viewBox={`0 0 ${size} ${b * 6}`} aria-hidden>
      {shape.map((row, r) => row.map((on, c) => (on ? <rect key={`${r}${c}`} x={c * b} y={r * b} width={b * 0.9} height={b * 0.9} fill={cols[c]} /> : null)))}
    </svg>
  );
}
function King({ size = 28, color = '#111' }: { size?: number; color?: string }) {
  return <span style={{ fontSize: size, lineHeight: 1, color }} aria-hidden>♚</span>;
}
function Reticle({ size, color = REVENGE_RED, pulse, className = 'absolute inset-0' }: { size: number; color?: string; pulse?: boolean; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden className={`${className} ${pulse ? 'animate-pulse' : ''}`}>
      <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="5" />
      <circle cx="50" cy="50" r="28" fill="none" stroke={color} strokeWidth="3" opacity=".55" />
      {[[50, 2, 50, 16], [50, 84, 50, 98], [2, 50, 16, 50], [84, 50, 98, 50]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5" strokeLinecap="round" />
      ))}
    </svg>
  );
}
function Pin({ color = REVENGE_RED, className = '' }: { color?: string; className?: string }) {
  return <span className={`absolute w-3 h-3 rounded-full shadow z-20 ${className}`} style={{ background: `radial-gradient(circle at 35% 35%, #fff9, ${color} 45%, #6b0f0f)` }} />;
}
function Tape({ className = '' }: { className?: string }) {
  return <span className={`absolute h-4 w-14 bg-[#fff3b0]/80 shadow-sm z-20 ${className}`} style={{ transform: 'rotate(-3deg)' }} />;
}
function KingMug({ size = 100, light }: { size?: number; light?: boolean }) {
  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ width: size, height: size * 0.78, background: light ? '#e9e4d8' : '#1c1c1c' }}>
      <div className="absolute inset-0 opacity-25" style={{ background: `repeating-linear-gradient(0deg, transparent 0 ${size / 8}px, ${light ? '#999' : '#fff'} ${size / 8}px ${size / 8 + 1}px)` }} />
      <King size={size * 0.46} color={light ? '#222' : '#f3f3f3'} />
      <Reticle size={size * 0.6} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
function Label({ children, color = '#8a7d6b' }: { children: ReactNode; color?: string }) {
  return <p className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color }}>{children}</p>;
}
function Cta({ label, sub, className = '' }: { label: string; sub?: string; className?: string }) {
  return (
    <button type="button" className={`min-h-[50px] rounded-xl text-white font-black text-[15px] tracking-wide flex flex-col items-center justify-center leading-tight w-full ${className}`} style={{ background: REVENGE_RED, boxShadow: `0 4px 0 ${REVENGE_RED_DARK}` }}>
      {label}
      {sub && <span className="text-[9px] font-bold uppercase tracking-[0.18em] opacity-85">{sub}</span>}
    </button>
  );
}
/** Leaderboard rows — shared content, styled by wrapper. */
function BoardRows({ rows = 3, dark, mono }: { rows?: number; dark?: boolean; mono?: boolean }) {
  const dim = dark ? 'text-white/50' : 'text-[#8a7d6b]';
  return (
    <ul className="flex flex-col" style={mono ? TYPE : undefined}>
      {BOARD.slice(0, rows).map((p) => (
        <li key={p.rank} className={`flex items-center gap-2 py-1 text-[12px] border-b ${dark ? 'border-white/10' : 'border-black/8'}`}>
          <span className={`w-4 font-black ${p.rank === 1 ? '' : dim}`} style={p.rank === 1 ? { color: REVENGE_RED } : undefined}>{p.rank}</span>
          <span className="flex-1 font-bold truncate">{p.name}</span>
          <span className={`text-[10px] ${dim}`}>L{p.lvl}</span>
          <span className="tabular-nums font-black w-14 text-right">{p.score.toLocaleString()}</span>
        </li>
      ))}
      <li className="flex items-center gap-2 py-1.5 text-[12px] mt-1 rounded-md px-1.5 -mx-1.5" style={{ background: dark ? 'rgba(229,57,53,.2)' : '#FFEBEE' }}>
        <span className="w-4 font-black" style={{ color: REVENGE_RED }}>{YOU.rank}</span>
        <span className="flex-1 font-black truncate">{YOU.name} <span className={`text-[9px] font-bold ${dim}`}>you</span></span>
        <span className={`text-[10px] ${dim}`}>L{YOU.best}</span>
        <span className="tabular-nums font-black w-14 text-right">{YOU.score.toLocaleString()}</span>
      </li>
    </ul>
  );
}
/** Ladder as a single clean row of 15 ticks + next unlock. */
function LadderStrip({ dark }: { dark?: boolean }) {
  return (
    <div>
      <div className="flex gap-[3px]">
        {LADDER.map((r) => (
          <div key={r.lvl} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full h-2.5 rounded-[2px]" style={{ background: r.state === 'done' ? (dark ? '#fff' : '#2a2a2a') : r.state === 'next' ? REVENGE_RED : dark ? 'rgba(255,255,255,.15)' : 'rgba(0,0,0,.1)' }} />
            <span className={`text-[6.5px] font-black ${r.unlock ? '' : 'opacity-0'} ${dark ? 'text-white/70' : 'text-[#666]'}`}>{r.unlock ? (r.state === 'locked' ? '?' : '✓') : '·'}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className={`text-[10px] font-bold ${dark ? 'text-white/60' : 'text-[#8a7d6b]'}`}>{DONE}/{LADDER.length} levels beaten</span>
        <span className="text-[10px] font-black">Beat {NEXT.lvl} → {NEXT.unlock}</span>
      </div>
    </div>
  );
}
function String_({ pts, color = '#c62828', w = 1.4, opacity = 0.85, height }: { pts: number[][]; color?: string; w?: number; opacity?: number; height: number }) {
  return (
    <svg className="absolute inset-0 z-[5] pointer-events-none" width={348} height={height} aria-hidden>
      {pts.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} opacity={opacity} />)}
    </svg>
  );
}
const CORK: CSSProperties = {
  background: '#c4a074',
  backgroundImage: 'radial-gradient(rgba(0,0,0,.07) 1px, transparent 1px), radial-gradient(rgba(255,255,255,.07) 1px, transparent 1px)',
  backgroundSize: '7px 7px, 11px 11px', backgroundPosition: '0 0, 3px 5px',
};

// ═════════════════════════════════════════════════════════════════════════════
// A — THE CASE FILE. Three manila folders, one per window, one string.
// ═════════════════════════════════════════════════════════════════════════════
function Folder({ tab, rot, children, accent }: { tab: string; rot: number; children: ReactNode; accent?: boolean }) {
  return (
    <div className="relative" style={{ transform: `rotate(${rot}deg)` }}>
      <div className="absolute -top-4 left-3 px-2.5 py-1 rounded-t-md text-[9px] font-black uppercase tracking-[0.2em]" style={{ background: accent ? REVENGE_RED : '#e8c98a', color: accent ? '#fff' : '#5a4630' }}>{tab}</div>
      <div className="rounded-md rounded-tl-none p-3 shadow-md" style={{ background: '#f3dfae', border: '1px solid #d9bd80' }}>{children}</div>
    </div>
  );
}
function VariantCaseFile() {
  return (
    <Phone style={CORK}>
      <String_ height={760} pts={[[176, 138, 176, 300], [176, 300, 176, 520]]} />
      <div className="pt-10 px-4 pb-8 flex flex-col gap-8 relative">
        <div className="flex items-center justify-between">
          <div className="bg-white/90 px-2 py-1 shadow-sm" style={{ transform: 'rotate(-1.5deg)' }}><RookiesRevengeLogo scale={0.34} /></div>
          <div className="text-right" style={HAND}>
            <p className="text-[12px] font-bold">Day 41</p>
            <p className="text-[10px] text-[#5a4630]">{TODAY}</p>
          </div>
        </div>

        <Folder tab="Today's target" rot={-1} accent>
          <Pin className="-top-1.5 left-1/2 -translate-x-1/2" />
          <div className="flex gap-3">
            <div className="shadow bg-white p-1 pb-1 shrink-0"><KingMug size={104} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-black leading-tight">Stone Citadel</p>
              <p className="text-[10.5px] text-[#5a4630] italic mt-0.5">15 levels between you and him.</p>
              <p className="text-[10px] mt-2" style={TYPE}>moves in {COUNTDOWN}</p>
              <p className="text-[10px]" style={TYPE}>{HUNTING.toLocaleString()} on his trail · 14% got him</p>
            </div>
          </div>
          <div className="mt-3"><Cta label="GO GET HIM" sub={`Normal · start level ${NEXT.lvl}`} /></div>
        </Folder>

        <Folder tab="Known hunters · global" rot={0.8}>
          <Pin className="-top-1.5 left-1/2 -translate-x-1/2" color="#444" />
          <BoardRows mono />
          <p className="text-[10px] mt-1.5 text-[#5a4630]" style={HAND}>2,290 behind #46. One clean level.</p>
        </Folder>

        <Folder tab="The plan · unlocks" rot={-0.6}>
          <Pin className="-top-1.5 left-1/2 -translate-x-1/2" color="#444" />
          <LadderStrip />
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {UNLOCKS.slice(0, 8).map((r) => (
              <div key={r.lvl} className="rounded px-1 py-1 text-center border" style={{ background: r.state === 'locked' ? 'transparent' : '#fff', borderColor: r.state === 'next' ? REVENGE_RED : '#d9bd80', opacity: r.state === 'locked' ? 0.55 : 1 }}>
                <div className="text-[8px] font-black text-[#8a7d6b]">L{r.lvl}</div>
                <div className="text-[9px] font-black leading-tight flex items-center justify-center min-h-[12px]" style={{ textDecoration: r.state === 'done' ? 'line-through' : undefined, color: r.state === 'next' ? REVENGE_RED : undefined }}>{r.state === 'locked' ? <Lock size={8} /> : r.unlock}</div>
              </div>
            ))}
          </div>
        </Folder>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// B — THREE POLAROIDS. Light linen wall, three big photos in a column.
// ═════════════════════════════════════════════════════════════════════════════
function BigPolaroid({ rot, caption, children, tag }: { rot: number; caption: string; children: ReactNode; tag: string }) {
  return (
    <div className="relative bg-white p-2 pb-8 shadow-lg" style={{ transform: `rotate(${rot}deg)` }}>
      <Tape className="-top-2 left-1/2 -translate-x-1/2" />
      <span className="absolute top-3 right-3 z-10 text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded text-white" style={{ background: REVENGE_RED }}>{tag}</span>
      <div className="bg-[#f7f4ee] border border-black/5 p-2.5">{children}</div>
      <p className="absolute bottom-2 left-3 right-3 text-[12px] text-[#333]" style={HAND}>{caption}</p>
    </div>
  );
}
function VariantPolaroids() {
  return (
    <Phone style={{ background: '#efe9df', backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.025) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,.025) 0 1px, transparent 1px 3px)' }}>
      <String_ height={760} color="#b71c1c" opacity={0.5} pts={[[60, 96, 176, 300], [292, 96, 176, 300], [176, 300, 176, 560]]} />
      <div className="pt-10 px-5 pb-8 flex flex-col gap-6 relative">
        <div className="flex items-center justify-between">
          <RookiesRevengeLogo scale={0.36} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8a7d6b]">{TODAY}</span>
        </div>

        <BigPolaroid rot={-1.2} tag="Today" caption={`Stone Citadel. He moves in ${COUNTDOWN}.`}>
          <div className="flex items-center gap-3">
            <KingMug size={110} />
            <div className="flex-1">
              <Label>Daily challenge</Label>
              <p className="text-[16px] font-black leading-tight mt-0.5">Stone Citadel</p>
              <p className="text-[10px] text-[#8a7d6b] mt-0.5">15 levels · {HUNTING.toLocaleString()} hunting</p>
              <div className="mt-2"><Cta label="HUNT" /></div>
            </div>
          </div>
        </BigPolaroid>

        <BigPolaroid rot={1} tag="Leaderboard" caption="The competition. I don't like any of them.">
          <Label>Global · today</Label>
          <div className="mt-1"><BoardRows /></div>
        </BigPolaroid>

        <BigPolaroid rot={-0.6} tag="Ladder" caption={`Beat ${NEXT.lvl} tonight → ${NEXT.unlock}.`}>
          <Label>Unlocks · {DONE}/{LADDER.length}</Label>
          <div className="mt-2 flex gap-1">
            {LADDER.map((r) => (
              <div key={r.lvl} className="flex-1 aspect-[3/4] rounded-[2px] flex items-center justify-center text-[7px] font-black" style={{ background: r.state === 'done' ? '#2a2a2a' : r.state === 'next' ? REVENGE_RED : '#ddd6c8', color: r.state === 'locked' ? '#8a7d6b' : '#fff' }}>
                {r.lvl}
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {UNLOCKS.map((r) => (
              <span key={r.lvl} className="text-[9px] font-black px-1.5 py-0.5 rounded-full border flex items-center gap-1" style={{ borderColor: r.state === 'next' ? REVENGE_RED : '#ddd6c8', color: r.state === 'locked' ? '#a09484' : r.state === 'next' ? REVENGE_RED : '#333', textDecoration: r.state === 'done' ? 'line-through' : undefined }}>
                {r.state === 'locked' && <Lock size={7} />}{r.unlock}
              </span>
            ))}
          </div>
        </BigPolaroid>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// C — THE DESK. Top-down, papers laid flat, no tilt chaos. Clipping / dossier / map.
// ═════════════════════════════════════════════════════════════════════════════
function VariantDesk() {
  return (
    <Phone style={{ background: '#5b3a24', backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 2px, transparent 2px 46px), linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.15))' }}>
      <div className="pt-10 px-4 pb-8 flex flex-col gap-3 relative">
        <div className="flex items-center justify-between">
          <div className="bg-white px-2 py-1 shadow-md"><RookiesRevengeLogo scale={0.34} /></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{TODAY}</span>
        </div>

        {/* Newspaper clipping = daily */}
        <div className="bg-[#f4efe3] shadow-md p-3 relative" style={{ transform: 'rotate(-0.5deg)' }}>
          <Tape className="-top-2 left-4" />
          <div className="flex items-baseline justify-between border-b-2 border-black pb-1">
            <span className="text-[9px] font-black uppercase tracking-[0.25em]">The Daily Revenge</span>
            <span className="text-[8px]" style={TYPE}>{TODAY} · No. 41</span>
          </div>
          <div className="flex gap-3 mt-2">
            <div className="shrink-0 border border-black/20"><KingMug size={96} light /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-black leading-[1.05] uppercase" style={{ fontFamily: 'Georgia, serif' }}>King spotted in Stone Citadel</p>
              <p className="text-[9.5px] mt-1 leading-snug text-[#333]" style={{ fontFamily: 'Georgia, serif' }}>Fifteen levels of loyal army. {HUNTING.toLocaleString()} hunters already en route; 14% have reached him. Sources say he leaves in {COUNTDOWN}.</p>
            </div>
          </div>
          <div className="mt-2.5"><Cta label="GO GET HIM" sub={`level ${NEXT.lvl} · normal`} /></div>
        </div>

        {/* Typed dossier = leaderboard */}
        <div className="bg-white shadow-md p-3 relative" style={{ transform: 'rotate(0.6deg)' }}>
          <Pin className="-top-1.5 right-5" color="#444" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={TYPE}>Dossier: hunters, global</span>
            <span className="text-[8px] px-1 border border-black/40 uppercase" style={TYPE}>confidential</span>
          </div>
          <div className="mt-1.5"><BoardRows rows={4} mono /></div>
        </div>

        {/* Map with a route = ladder */}
        <div className="bg-[#e8e2cf] shadow-md p-3 relative overflow-hidden" style={{ transform: 'rotate(-0.4deg)', backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(120,140,90,.25) 0 60px, transparent 61px), radial-gradient(circle at 80% 70%, rgba(120,140,90,.2) 0 80px, transparent 81px), repeating-linear-gradient(0deg, rgba(0,0,0,.05) 0 1px, transparent 1px 18px), repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 1px, transparent 1px 18px)' }}>
          <Tape className="-top-2 right-6" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={TYPE}>Route to the citadel · {DONE}/{LADDER.length}</span>
          <svg width="100%" height="118" viewBox="0 0 300 118" className="mt-1" aria-hidden>
            {(() => {
              const pts = LADDER.map((r, i) => ({ r, x: 12 + i * 19.7, y: 70 + Math.sin(i * 0.9) * 28 }));
              return (
                <>
                  <polyline points={pts.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#999" strokeWidth="2" strokeDasharray="3 3" />
                  <polyline points={pts.slice(0, DONE + 1).map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={REVENGE_RED} strokeWidth="2.5" />
                  {pts.map(({ r, x, y }) => (
                    <g key={r.lvl}>
                      <circle cx={x} cy={y} r={r.unlock ? 7 : 4} fill={r.state === 'done' ? '#2a2a2a' : r.state === 'next' ? REVENGE_RED : '#fff'} stroke={r.state === 'locked' ? '#999' : '#2a2a2a'} strokeWidth="1.5" />
                      {r.unlock && <text x={x} y={y + (Math.sin((r.lvl - 1) * 0.9) > 0 ? 20 : -12)} textAnchor="middle" fontSize="7.5" fontWeight="900" fill={r.state === 'locked' ? '#999' : '#222'} style={TYPE}>{r.state === 'locked' ? '???' : r.unlock.toUpperCase()}</text>}
                    </g>
                  ))}
                  <text x={pts[14].x} y={pts[14].y + 4} textAnchor="middle" fontSize="12">♚</text>
                </>
              );
            })()}
          </svg>
          <p className="text-[11px]" style={HAND}>Next stop: level {NEXT.lvl}. Pick up <b>{NEXT.unlock}</b> there.</p>
        </div>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// D — THE WHITEBOARD. Dry-erase, magnets, marker. Cleanest possible read.
// ═════════════════════════════════════════════════════════════════════════════
function Magnet({ color = REVENGE_RED, className = '' }: { color?: string; className?: string }) {
  return <span className={`absolute w-4 h-4 rounded-full shadow z-20 ${className}`} style={{ background: `radial-gradient(circle at 35% 35%, #fff9, ${color} 50%)` }} />;
}
function VariantWhiteboard() {
  const ink = '#1b3a8a';
  return (
    <Phone style={{ background: '#fbfbfa', backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(0,0,0,.02), transparent 60%)' }}>
      <div className="absolute inset-x-0 top-0 h-7 bg-[#cfd3d8] z-20" />
      <div className="absolute inset-x-0 bottom-0 h-3 bg-[#cfd3d8] z-20" />
      <div className="pt-12 px-5 pb-8 flex flex-col gap-4 relative" style={{ color: ink }}>
        <div className="flex items-center justify-between">
          <div className="relative bg-white shadow p-1"><Magnet className="-top-2 left-1/2 -translate-x-1/2" color="#333" /><RookiesRevengeLogo scale={0.34} /></div>
          <p className="text-[16px]" style={HAND}>Day 41 — {TODAY}</p>
        </div>

        {/* photo magneted + marker notes = daily */}
        <div className="flex gap-3 items-start">
          <div className="relative bg-white p-1 shadow-md shrink-0" style={{ transform: 'rotate(-2deg)' }}>
            <Magnet className="-top-2 left-1/2 -translate-x-1/2" />
            <KingMug size={112} />
          </div>
          <div className="flex-1 pt-1" style={HAND}>
            <p className="text-[11px] uppercase tracking-widest opacity-60 font-bold">today</p>
            <p className="text-[20px] font-bold leading-none" style={{ color: REVENGE_RED }}>Stone Citadel</p>
            <p className="text-[13px] mt-1">15 levels. {HUNTING.toLocaleString()} hunting.</p>
            <p className="text-[13px]">he moves in <span className="underline decoration-2">{COUNTDOWN}</span></p>
          </div>
        </div>
        <Cta label="GO GET HIM" sub={`start level ${NEXT.lvl}`} />

        {/* marker list = leaderboard */}
        <div style={HAND}>
          <p className="text-[15px] font-bold underline decoration-2 underline-offset-4">Leaderboard (global)</p>
          <ol className="mt-1.5 flex flex-col gap-0.5">
            {BOARD.slice(0, 3).map((p) => (
              <li key={p.rank} className="flex items-baseline gap-2 text-[14px]">
                <span className="w-5 font-bold">{p.rank}.</span>
                <span className="flex-1">{p.name}</span>
                <span className="text-[12px] opacity-70">{p.score.toLocaleString()}</span>
              </li>
            ))}
            <li className="text-[12px] opacity-40 pl-5">⋮</li>
            <li className="flex items-baseline gap-2 text-[15px] font-bold" style={{ color: REVENGE_RED }}>
              <span className="w-5">{YOU.rank}.</span>
              <span className="flex-1">me <span className="text-[11px] font-normal">(2,290 to #46. fine.)</span></span>
              <span className="text-[12px]">{YOU.score.toLocaleString()}</span>
            </li>
          </ol>
        </div>

        {/* hand-drawn staircase = ladder */}
        <div style={HAND}>
          <p className="text-[15px] font-bold underline decoration-2 underline-offset-4">The ladder — {DONE}/{LADDER.length}</p>
          <svg width="100%" height="150" viewBox="0 0 310 150" className="mt-1" aria-hidden>
            {LADDER.map((r, i) => {
              const x = 6 + i * 20, y = 138 - i * 8.6;
              const done = r.state === 'done', next = r.state === 'next';
              return (
                <g key={r.lvl}>
                  <path d={`M${x},${y} h20 v-8.6`} fill="none" stroke={done ? REVENGE_RED : next ? REVENGE_RED : ink} strokeWidth={done || next ? 3 : 2} opacity={r.state === 'locked' ? 0.45 : 1} strokeLinecap="round" />
                  <text x={x + 10} y={y - 3} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={next ? REVENGE_RED : ink} opacity={r.state === 'locked' ? 0.5 : 1}>{r.lvl}</text>
                  {next && <circle cx={x + 10} cy={y - 6} r="9" fill="none" stroke={REVENGE_RED} strokeWidth="2" />}
                  {r.unlock && (
                    <text x={x + 10} y={y - (next ? 20 : 14)} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={r.state === 'locked' ? '#999' : REVENGE_RED} style={HAND}>{r.state === 'locked' ? '?' : r.unlock}</text>
                  )}
                </g>
              );
            })}
            <text x="300" y="14" textAnchor="end" fontSize="16">♚</text>
          </svg>
          <p className="text-[13px] -mt-1">beat {NEXT.lvl} → <b style={{ color: REVENGE_RED }}>{NEXT.unlock}</b>. he won&apos;t see me coming.</p>
        </div>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// E — THE DARK ROOM. Night wall, one lamp. Only the three pinned items are lit.
// ═════════════════════════════════════════════════════════════════════════════
function VariantDarkRoom() {
  return (
    <Phone style={{ background: '#14161c', backgroundImage: 'radial-gradient(60% 45% at 50% 18%, rgba(255,214,150,.22), transparent 70%)', color: '#f1ede4' }}>
      <String_ height={760} color="#e53935" opacity={0.7} pts={[[176, 250, 70, 372], [176, 250, 282, 372], [176, 250, 176, 480]]} />
      <div className="pt-10 px-4 pb-8 flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
          <RookiesRevengeLogo scale={0.36} dark />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{TODAY}</span>
        </div>

        {/* lit photo = daily */}
        <div className="relative mx-auto bg-[#f7f2e6] p-2 pb-6 shadow-2xl w-[210px]" style={{ transform: 'rotate(-1deg)', boxShadow: '0 20px 40px rgba(0,0,0,.6), 0 0 60px rgba(255,214,150,.15)' }}>
          <Pin className="-top-1.5 left-1/2 -translate-x-1/2" />
          <KingMug size={194} />
          <p className="absolute bottom-1 left-2 right-2 text-[11px] text-[#333] flex justify-between" style={HAND}>
            <span>Stone Citadel</span><span style={TYPE} className="text-[9px]">{COUNTDOWN}</span>
          </p>
          <span className="absolute -top-2 -right-3 text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded text-white" style={{ background: REVENGE_RED, transform: 'rotate(6deg)' }}>Today</span>
        </div>
        <p className="text-center text-[11px] text-white/60 -mt-1">15 levels · {HUNTING.toLocaleString()} hunting · 14% reached him</p>
        <Cta label="GO GET HIM" sub={`level ${NEXT.lvl} · normal`} />

        <div className="grid grid-cols-2 gap-3 mt-1">
          {/* leaderboard card */}
          <div className="relative rounded-sm p-2.5 shadow-xl" style={{ background: '#22252d', border: '1px solid rgba(255,255,255,.08)', transform: 'rotate(0.8deg)' }}>
            <Pin className="-top-1.5 left-1/2 -translate-x-1/2" color="#666" />
            <Label color="rgba(255,255,255,.45)">Leaderboard</Label>
            <ul className="mt-1.5 flex flex-col gap-1" style={TYPE}>
              {BOARD.slice(0, 3).map((p) => (
                <li key={p.rank} className="flex items-center gap-1.5 text-[10.5px]">
                  <span className="w-3 text-white/50">{p.rank}</span><span className="flex-1 truncate font-bold">{p.name}</span>
                </li>
              ))}
              <li className="text-[9px] text-white/30 pl-4">···</li>
              <li className="flex items-center gap-1.5 text-[11px] font-black" style={{ color: REVENGE_RED }}>
                <span className="w-3">{YOU.rank}</span><span className="flex-1">you</span><span className="text-[9px] text-white/50 font-normal">{YOU.score.toLocaleString()}</span>
              </li>
            </ul>
            <p className="text-[9px] text-white/45 mt-1.5">2,290 to #46</p>
          </div>
          {/* ladder card */}
          <div className="relative rounded-sm p-2.5 shadow-xl" style={{ background: '#22252d', border: '1px solid rgba(255,255,255,.08)', transform: 'rotate(-0.8deg)' }}>
            <Pin className="-top-1.5 left-1/2 -translate-x-1/2" color="#666" />
            <Label color="rgba(255,255,255,.45)">Ladder · {DONE}/{LADDER.length}</Label>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {LADDER.map((r) => (
                <div key={r.lvl} className="aspect-square rounded-[3px] flex items-center justify-center text-[8px] font-black" style={{ background: r.state === 'done' ? '#f1ede4' : r.state === 'next' ? REVENGE_RED : 'rgba(255,255,255,.08)', color: r.state === 'done' ? '#14161c' : r.state === 'next' ? '#fff' : 'rgba(255,255,255,.35)', boxShadow: r.state === 'next' ? `0 0 10px ${REVENGE_RED}` : undefined }}>
                  {r.unlock && r.state === 'locked' ? <Lock size={7} /> : r.lvl}
                </div>
              ))}
            </div>
            <p className="text-[9.5px] mt-2 leading-tight"><span className="text-white/45">Beat {NEXT.lvl} →</span> <b>{NEXT.unlock}</b></p>
          </div>
        </div>

        {/* one note, in the shadow */}
        <div className="mx-auto mt-1 bg-[#fff3b0] text-[#333] px-3 py-2 shadow-md w-[230px] text-[11px] leading-snug" style={{ ...HAND, transform: 'rotate(1.5deg)', opacity: 0.9 }}>
          Unlocked so far: {UNLOCKS.filter((u) => u.state === 'done').map((u) => u.unlock).join(', ')}. Tonight: {NEXT.unlock}. — R.
        </div>
      </div>
    </Phone>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const VARIANTS = [
  { k: 'A', title: 'The Case File', pitch: 'Cork stays, chaos goes. Three manila folders — Today’s Target / Known Hunters / The Plan — stacked in a column with one string through them. Tabs label every window.', C: VariantCaseFile },
  { k: 'B', title: 'Three Polaroids', pitch: 'Light linen wall, three big photos, barely tilted. Each polaroid IS a window; the handwritten caption is Rookie’s one line about it. String forms a single triangle.', C: VariantPolaroids },
  { k: 'C', title: 'The Desk', pitch: 'Top-down on her desk, papers laid flat. Newspaper clipping = daily. Typed confidential dossier = leaderboard. Map with a dotted route and stops = ladder.', C: VariantDesk },
  { k: 'D', title: 'The Whiteboard', pitch: 'Dry-erase instead of cork — the cleanest read. Photo under a magnet, marker headings, leaderboard as a numbered list, ladder as a hand-drawn staircase.', C: VariantWhiteboard },
  { k: 'E', title: 'The Dark Room', pitch: 'Night wall, one lamp. Only the king’s photo is fully lit; leaderboard and ladder are two small cards under it; string only connects to the target. Cinematic, focused.', C: VariantDarkRoom },
];

export default function EvidenceWallVariantsPage() {
  return (
    <main className="h-full overflow-auto bg-[#e6eef5] text-chess-text">
      <div className="px-6 pt-6 pb-2 max-w-[1900px] mx-auto">
        <h1 className="text-2xl font-black">Rookie&apos;s Evidence Wall — five calmer variants</h1>
        <p className="text-sm text-chess-text-muted mt-1">
          Same idea, less noise. Every variant labels its three windows — <b>Daily</b>, <b>Leaderboard</b>, <b>Ladder</b> — and keeps one clear button.{' '}
          <Link className="underline" href="/test/revenge-home">← Round 2</Link>
        </p>
      </div>
      <div className="flex gap-6 px-6 pb-12 overflow-x-auto max-w-[1900px] mx-auto items-start">
        {VARIANTS.map(({ k, title, pitch, C }) => (
          <div key={k} className="shrink-0 w-[360px] flex flex-col gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: REVENGE_RED }}>Variant {k}</p>
              <h2 className="text-lg font-black leading-tight">{title}</h2>
              <p className="text-[12px] text-chess-text-muted leading-snug mt-1 min-h-[70px]">{pitch}</p>
            </div>
            <C />
          </div>
        ))}
      </div>
    </main>
  );
}
