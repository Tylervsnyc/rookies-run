'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import {
  REVENGE_RED,
  REVENGE_RED_DARK,
  RevengeMarkSvg,
  RookiesRevengeLogo,
} from '@/components/run/RookiesRevengeLogo';

/**
 * /test/revenge-home — ROUND 2. Five home-screen worlds for Rookie's Revenge.
 * Every one still carries the three windows (Daily Challenge · Global
 * Leaderboard · Unlock Ladder) but none of them is a stack of cards.
 * Round 1 (the safe layouts) lives at /test/revenge-home/round1.
 */

// ── Mock data ────────────────────────────────────────────────────────────────
const TODAY = 'Sat, Aug 30';
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
const NEXT = LADDER.find((r) => r.state === 'next') as Rung & { unlock: string };

// ── Shared ───────────────────────────────────────────────────────────────────
function Phone({ children, bg = '#eef6fc', text = '#2A3C45', style }: { children: ReactNode; bg?: string; text?: string; style?: CSSProperties }) {
  return (
    <div className="relative w-[360px] h-[760px] shrink-0 rounded-[36px] border-[6px] border-[#1a1a1a] overflow-hidden shadow-xl" style={{ background: bg, color: text, ...style }}>
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
/** Tiny rainbow rook (5x6 blocks) used for "you" / other players. */
function TinyRook({ size = 18 }: { size?: number }) {
  const b = size / 5;
  const cols = ['#FF4B4B', '#FF9500', '#FFD700', '#58CC02', '#1CB0F6'];
  const shape = [
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
  ];
  return (
    <svg width={size} height={(size / 5) * 6} viewBox={`0 0 ${size} ${(size / 5) * 6}`} aria-hidden>
      {shape.map((row, r) => row.map((on, c) => (on ? <rect key={`${r}${c}`} x={c * b} y={r * b} width={b * 0.9} height={b * 0.9} fill={cols[c]} /> : null)))}
    </svg>
  );
}
function King({ size = 28, color = '#111' }: { size?: number; color?: string }) {
  return <span style={{ fontSize: size, lineHeight: 1, color }} aria-hidden>♚</span>;
}
function Reticle({ size, color = REVENGE_RED, pulse }: { size: number; color?: string; pulse?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden className={`absolute inset-0 ${pulse ? 'animate-pulse' : ''}`}>
      <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="5" />
      <circle cx="50" cy="50" r="28" fill="none" stroke={color} strokeWidth="3" opacity=".55" />
      {[[50, 2, 50, 16], [50, 84, 50, 98], [2, 50, 16, 50], [84, 50, 98, 50]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5" strokeLinecap="round" />
      ))}
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Concept 6 — THE BOARD IS THE MENU
// The whole home screen is one chessboard. Ranks = ladder (conquered ranks
// glow). Enemy pieces = the leaderboard (top hunters ARE the army). The king
// on h8 in a reticle = today's challenge. Your rook on a1 = you.
// ═════════════════════════════════════════════════════════════════════════════
function ConceptBoard() {
  const size = 336;
  const cell = size / 8;
  const ranksLit = Math.round((DONE / LADDER.length) * 8); // 4 of 8
  // enemy placements (row 0 = rank 8): leaderboard top 5 as pieces
  const enemies: { r: number; c: number; glyph: string; p: (typeof BOARD)[number] }[] = [
    { r: 0, c: 3, glyph: '♛', p: BOARD[0] },
    { r: 0, c: 5, glyph: '♝', p: BOARD[1] },
    { r: 1, c: 2, glyph: '♞', p: BOARD[2] },
    { r: 1, c: 6, glyph: '♜', p: BOARD[3] },
    { r: 2, c: 4, glyph: '♟', p: BOARD[4] },
  ];
  const unlockByRank: Record<number, Rung | undefined> = {};
  LADDER.filter((r) => r.unlock).forEach((r) => {
    const rank = Math.min(8, Math.ceil((r.lvl / LADDER.length) * 8));
    if (!unlockByRank[rank]) unlockByRank[rank] = r;
  });
  return (
    <Phone bg="#0b0f14" text="#fff">
      <div className="pt-10 px-3 flex flex-col items-center gap-2">
        <div className="w-full flex items-center justify-between px-1">
          <RookiesRevengeLogo scale={0.36} dark />
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">{TODAY}</span>
        </div>

        <div className="relative" style={{ width: size + 24, height: size }}>
          {/* rank labels = ladder */}
          <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col">
            {Array.from({ length: 8 }).map((_, i) => {
              const rank = 8 - i;
              const lit = rank <= ranksLit;
              const u = unlockByRank[rank];
              return (
                <div key={rank} className="flex-1 flex items-center justify-center relative">
                  <span className={`text-[10px] font-black ${lit ? 'text-white' : 'text-white/25'}`}>{rank}</span>
                  {u && (
                    <span className={`absolute -left-0.5 -bottom-0.5 w-1.5 h-1.5 rounded-full ${u.state === 'done' ? 'bg-chess-green' : ''}`} style={u.state !== 'done' ? { background: REVENGE_RED } : undefined} />
                  )}
                </div>
              );
            })}
          </div>
          {/* the board */}
          <div className="absolute left-6 top-0 rounded-md overflow-hidden ring-1 ring-white/10" style={{ width: size, height: size }}>
            {Array.from({ length: 64 }).map((_, i) => {
              const r = Math.floor(i / 8), c = i % 8;
              const rank = 8 - r;
              const lit = rank <= ranksLit;
              const light = (r + c) % 2 === 0;
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: c * cell, top: r * cell, width: cell, height: cell,
                    background: lit ? (light ? '#f7e7c8' : '#c99a6b') : (light ? '#2a3038' : '#1a1f26'),
                    boxShadow: lit ? 'inset 0 0 12px rgba(255,190,80,.25)' : undefined,
                  }}
                />
              );
            })}
            {/* frontier line */}
            <div className="absolute left-0 right-0 h-[2px]" style={{ top: (8 - ranksLit) * cell - 1, background: REVENGE_RED, boxShadow: `0 0 10px ${REVENGE_RED}` }} />
            {/* enemies = leaderboard */}
            {enemies.map(({ r, c, glyph, p }) => (
              <div key={p.name} className="absolute flex flex-col items-center justify-center" style={{ left: c * cell, top: r * cell, width: cell, height: cell }}>
                <span className="text-[24px] leading-none text-[#0b0f14] drop-shadow" style={{ WebkitTextStroke: '0.5px #fff' }}>{glyph}</span>
                <span className="absolute -bottom-1 text-[7px] font-black px-1 rounded bg-black/70 text-white whitespace-nowrap">#{p.rank} {p.name.slice(0, 9)}</span>
              </div>
            ))}
            {/* the king = daily */}
            <div className="absolute" style={{ left: 7 * cell - cell * 0.35, top: -cell * 0.35, width: cell * 1.7, height: cell * 1.7 }}>
              <Reticle size={cell * 1.7} pulse />
            </div>
            <div className="absolute flex items-center justify-center" style={{ left: 7 * cell, top: 0, width: cell, height: cell }}>
              <King size={30} color="#fff" />
            </div>
            <div className="absolute -top-0.5 right-0 translate-x-1 -translate-y-full text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ background: REVENGE_RED }}>today</div>
            {/* you */}
            <div className="absolute flex flex-col items-center justify-center" style={{ left: 0, top: 7 * cell, width: cell, height: cell }}>
              <TinyRook size={22} />
              <span className="absolute -bottom-1 text-[7px] font-black px-1 rounded text-white" style={{ background: REVENGE_RED }}>you · #{YOU.rank}</span>
            </div>
            {/* your beaten path */}
            {[6, 5, 4].map((r, i) => (
              <div key={r} className="absolute rounded-full" style={{ left: (i + 0.5) * cell + cell * 0.35, top: r * cell + cell * 0.35, width: cell * 0.3, height: cell * 0.3, background: 'rgba(229,57,53,.55)' }} />
            ))}
          </div>
        </div>

        {/* one line of HUD under the board */}
        <div className="w-full grid grid-cols-3 gap-2 mt-1">
          {[
            ['Rank ' + ranksLit + ' / 8', `${DONE} levels beaten`],
            ['#' + YOU.rank, `of ${HUNTING.toLocaleString()} hunting`],
            [COUNTDOWN, 'until he moves'],
          ].map(([n, l]) => (
            <div key={l} className="rounded-xl bg-white/5 border border-white/10 p-2 text-center">
              <div className="text-[13px] font-black font-mono leading-none">{n}</div>
              <div className="text-[8.5px] uppercase tracking-wider text-white/45 mt-1">{l}</div>
            </div>
          ))}
        </div>

        <div className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: REVENGE_RED }} />
          <p className="text-[11px] text-white/80 flex-1">Cross rank 5 to unlock <b className="text-white">{NEXT.unlock}</b>. <span className="text-white/45">Tap the king to start.</span></p>
        </div>
        <button type="button" className="w-full min-h-[52px] rounded-2xl font-black text-[16px] tracking-wide text-white mt-1" style={{ background: REVENGE_RED, boxShadow: `0 4px 0 ${REVENGE_RED_DARK}, 0 0 28px rgba(229,57,53,.35)` }}>
          STONE CITADEL · LEVEL {NEXT.lvl}
        </button>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Concept 7 — ROOKIE'S EVIDENCE WALL
// Corkboard, polaroids, red string, marker notes. Rookie is obsessed and it
// shows. Daily = the king's mugshot. Leaderboard = rival hunters pinned up.
// Ladder = index cards chained by string, locked ones face-down.
// ═════════════════════════════════════════════════════════════════════════════
function Pin({ x, y, color = REVENGE_RED }: { x: number; y: number; color?: string }) {
  return <div className="absolute w-3 h-3 rounded-full shadow-md z-20" style={{ left: x - 6, top: y - 6, background: `radial-gradient(circle at 35% 35%, #fff8, ${color} 45%, #7a1010)` }} />;
}
function Polaroid({ x, y, rot, w = 120, children, caption }: { x: number; y: number; rot: number; w?: number; children: ReactNode; caption: string }) {
  return (
    <div className="absolute bg-white p-1.5 pb-5 shadow-lg z-10" style={{ left: x, top: y, width: w, transform: `rotate(${rot}deg)` }}>
      <div className="bg-[#1b1b1b] aspect-[4/3] flex items-center justify-center overflow-hidden relative">{children}</div>
      <p className="absolute bottom-0.5 left-0 right-0 text-center text-[10px] text-[#333]" style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}>{caption}</p>
    </div>
  );
}
function Note({ x, y, rot, w = 110, color = '#fff59d', children }: { x: number; y: number; rot: number; w?: number; color?: string; children: ReactNode }) {
  return (
    <div className="absolute p-2 shadow-md z-10 text-[#222] text-[11px] leading-snug" style={{ left: x, top: y, width: w, background: color, transform: `rotate(${rot}deg)`, fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}>
      {children}
    </div>
  );
}
function ConceptEvidence() {
  const cards = LADDER.filter((r) => r.unlock);
  return (
    <Phone bg="#b98a56" text="#222" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,.08) 1px, transparent 1px), radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '7px 7px, 11px 11px', backgroundPosition: '0 0, 3px 5px' }}>
      <div className="relative w-full" style={{ height: 1180 }}>
        {/* string */}
        <svg className="absolute inset-0 z-[5]" width={348} height={1180} aria-hidden>
          {[
            [176, 150, 60, 330], [176, 150, 292, 330], [176, 150, 176, 345],
            [292, 330, 260, 470], [60, 330, 100, 470], [176, 345, 176, 470],
            [176, 470, 70, 560], [70, 560, 270, 640], [270, 640, 70, 720], [70, 720, 270, 800], [270, 800, 70, 880], [70, 880, 270, 960], [270, 960, 176, 1040],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c62828" strokeWidth="1.6" opacity=".9" />
          ))}
        </svg>

        {/* header note */}
        <div className="absolute top-9 left-3 z-10 bg-white/90 px-2 py-1 shadow" style={{ transform: 'rotate(-2deg)' }}>
          <RookiesRevengeLogo scale={0.34} />
        </div>
        <Note x={228} y={44} rot={3} w={110} color="#ffe082">
          Day 41 of the hunt. <b>{TODAY}</b>. He&apos;s still out there.
        </Note>

        {/* DAILY: king mugshot */}
        <Polaroid x={112} y={112} rot={-3} w={130} caption="TODAY — Stone Citadel">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 opacity-30" style={{ background: 'repeating-linear-gradient(0deg, transparent 0 6px, #fff 6px 7px)' }} />
            <King size={52} color="#f5f5f5" />
            <div className="absolute inset-3"><Reticle size={80} /></div>
          </div>
        </Polaroid>
        <Pin x={176} y={118} />
        <Note x={14} y={190} rot={-6} w={96}>
          <b>{COUNTDOWN}</b> until he moves again. {HUNTING.toLocaleString()} people on his trail. Only 14% got close.
        </Note>
        <button type="button" className="absolute z-20 text-white font-black text-[15px] tracking-[0.2em] px-5 py-3 rounded-md border-4 border-white shadow-lg" style={{ left: 190, top: 262, background: REVENGE_RED, transform: 'rotate(4deg)', boxShadow: `0 4px 0 ${REVENGE_RED_DARK}` }}>
          GO GET HIM
        </button>

        {/* LEADERBOARD: rival hunters */}
        <Note x={130} y={352} rot={1} w={100} color="#fff">
          <span className="text-[9px] uppercase tracking-widest text-[#888]">the competition</span><br />
          Global board. I don&apos;t like any of them.
        </Note>
        {[
          { p: BOARD[0], x: 8, y: 300, rot: -5 },
          { p: BOARD[1], x: 240, y: 300, rot: 5 },
          { p: BOARD[2], x: 40, y: 440, rot: 3 },
          { p: BOARD[3], x: 210, y: 440, rot: -4 },
        ].map(({ p, x, y, rot }) => (
          <div key={p.name}>
            <Polaroid x={x} y={y} rot={rot} w={100} caption={`#${p.rank} ${p.name}`}>
              <div className="flex flex-col items-center gap-1">
                <TinyRook size={26} />
                <span className="text-[9px] font-mono text-white/80">{p.score.toLocaleString()}</span>
              </div>
            </Polaroid>
            <Pin x={x + 50} y={y + 6} color="#333" />
          </div>
        ))}
        <Note x={122} y={470} rot={-2} w={110} color="#ffcdd2">
          <span className="text-[9px] uppercase tracking-widest text-[#888]">you</span><br />
          <b className="text-[16px]">#{YOU.rank}</b> · {YOU.score.toLocaleString()}<br />
          <span className="text-[10px]">2,290 behind #46. Unacceptable.</span>
        </Note>

        {/* LADDER: index cards chained down the wall */}
        <Note x={14} y={548} rot={-3} w={120} color="#fff">
          <span className="text-[9px] uppercase tracking-widest text-[#888]">the plan</span><br />
          Every level I beat, I take something from him.
        </Note>
        {cards.map((r, i) => {
          const left = i % 2 === 0;
          const y = 590 + i * 58;
          const x = left ? 20 : 200;
          return (
            <div key={r.lvl}>
              <div
                className="absolute z-10 shadow-md px-2 py-1.5 w-[130px]"
                style={{
                  left: x, top: y, transform: `rotate(${left ? -2 : 2}deg)`,
                  background: r.state === 'locked' ? '#6d4c41' : r.state === 'next' ? '#fff' : '#f1f8e9',
                  backgroundImage: r.state === 'locked' ? 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(0,0,0,.08) 6px 7px)' : 'repeating-linear-gradient(0deg, transparent 0 11px, rgba(0,0,0,.08) 11px 12px)',
                  border: r.state === 'next' ? `2px solid ${REVENGE_RED}` : undefined,
                }}
              >
                {r.state === 'locked' ? (
                  <div className="flex items-center justify-between text-[#d7ccc8]">
                    <span className="text-[10px] font-mono">LVL {r.lvl}</span>
                    <Lock size={10} />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#777]">LVL {r.lvl}</span>
                      {r.state === 'done' ? <span className="text-[9px] font-black text-[#2e7d32]">TAKEN ✓</span> : <span className="text-[9px] font-black" style={{ color: REVENGE_RED }}>NEXT</span>}
                    </div>
                    <div className="text-[13px] font-black" style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive', textDecoration: r.state === 'done' ? 'line-through' : undefined }}>{r.unlock}</div>
                  </>
                )}
              </div>
              <Pin x={x + 65} y={y + 2} color={r.state === 'next' ? REVENGE_RED : '#333'} />
            </div>
          );
        })}
        <Note x={110} y={1085} rot={2} w={130} color="#ffe082">
          {DONE}/{LADDER.length} floors. Beat level {NEXT.lvl} tonight → <b>{NEXT.unlock}</b>. He won&apos;t see it coming. — R.
        </Note>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Concept 8 — ROOKIE TEXTS YOU
// The home screen is a message thread. Rookie is the over-invested friend
// who won't stop texting about the hunt. Daily / board / ladder arrive as
// attachments. You answer with quick replies.
// ═════════════════════════════════════════════════════════════════════════════
function Bubble({ children, me, attach }: { children: ReactNode; me?: boolean; attach?: boolean }) {
  return (
    <div className={`flex ${me ? 'justify-end' : 'justify-start'} items-end gap-1.5`}>
      {!me && <div className="w-6 h-6 shrink-0 rounded-full bg-white border border-black/10 flex items-center justify-center overflow-hidden"><RevengeMarkSvg size={20} /></div>}
      <div className={`${attach ? 'p-0 overflow-hidden' : 'px-3 py-2'} max-w-[78%] text-[13px] leading-snug rounded-2xl ${me ? 'text-white rounded-br-md' : 'bg-white text-[#1b1b1b] rounded-bl-md border border-black/5'}`} style={me ? { background: REVENGE_RED } : undefined}>
        {children}
      </div>
    </div>
  );
}
function ConceptTexts() {
  return (
    <Phone bg="#f2f4f7" text="#1b1b1b">
      {/* thread header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-black/5 pt-8 pb-2 px-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white border border-black/10 flex items-center justify-center"><RevengeMarkSvg size={32} /></div>
        <div className="flex-1">
          <p className="text-[14px] font-black leading-none">Rookie</p>
          <p className="text-[10px] text-[#666] mt-0.5">is typing…</p>
        </div>
        <span className="text-[10px] font-bold text-[#999] uppercase tracking-widest">{TODAY}</span>
      </div>

      <div className="px-3 py-3 flex flex-col gap-2.5 pb-28">
        <p className="text-center text-[10px] text-[#999] font-bold">7:02 AM</p>
        <Bubble>he moved.</Bubble>
        <Bubble>new board. Stone Citadel. 15 levels between us and him.</Bubble>
        <Bubble attach>
          <div className="w-[230px]">
            <div className="relative h-[120px] bg-[#1b1b1b] flex items-center justify-center">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%)', backgroundSize: '24px 24px', backgroundPosition: '0 0, 12px 12px' }} />
              <King size={44} color="#fff" />
              <div className="absolute inset-[26px]"><Reticle size={68} pulse /></div>
              <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-widest text-white px-1.5 py-0.5 rounded" style={{ background: REVENGE_RED }}>Daily</span>
            </div>
            <div className="p-2.5">
              <p className="text-[13px] font-black">Today&apos;s hunt</p>
              <p className="text-[10.5px] text-[#666] font-mono">resets in {COUNTDOWN} · {HUNTING.toLocaleString()} hunting</p>
            </div>
          </div>
        </Bubble>
        <Bubble me>how many people got him already</Bubble>
        <Bubble>14%. i checked 6 times. don&apos;t ask.</Bubble>
        <p className="text-center text-[10px] text-[#999] font-bold">7:15 AM</p>
        <Bubble>also. the board.</Bubble>
        <Bubble attach>
          <div className="w-[236px] p-2.5">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#999]">Global leaderboard</p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {BOARD.slice(0, 3).map((p) => (
                <li key={p.rank} className="flex items-center gap-2 text-[12px]">
                  <span className="w-4 font-black text-[#999]">{p.rank}</span>
                  <span className="flex-1 font-bold truncate">{p.name}</span>
                  <span className="font-mono text-[11px]">{p.score.toLocaleString()}</span>
                </li>
              ))}
              <li className="text-center text-[10px] text-[#bbb]">· · ·</li>
              <li className="flex items-center gap-2 text-[12px] rounded-lg px-1.5 py-1 -mx-1.5" style={{ background: '#FFEBEE' }}>
                <span className="w-4 font-black" style={{ color: REVENGE_RED }}>{YOU.rank}</span>
                <span className="flex-1 font-black truncate">{YOU.name}</span>
                <span className="font-mono text-[11px]">{YOU.score.toLocaleString()}</span>
              </li>
            </ul>
          </div>
        </Bubble>
        <Bubble>#47 is fine. #47 is a great number. i&apos;m not upset.</Bubble>
        <Bubble>2,290 points to #46. that&apos;s one clean level.</Bubble>
        <Bubble me>what do i get if i beat 9</Bubble>
        <Bubble attach>
          <div className="w-[236px] p-2.5">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#999]">Unlock ladder · {DONE}/{LADDER.length}</p>
            <div className="mt-2 flex gap-[3px]">
              {LADDER.map((r) => (
                <div key={r.lvl} className="flex-1 h-2 rounded-sm" style={{ background: r.state === 'done' ? '#1b1b1b' : r.state === 'next' ? REVENGE_RED : '#e3e6ea' }} />
              ))}
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-[15px]" style={{ background: REVENGE_RED }}>{NEXT.lvl}</div>
              <div>
                <p className="text-[13px] font-black leading-none">{NEXT.unlock}</p>
                <p className="text-[10px] text-[#666] mt-0.5">then Rewind (11), Magnet (12), Bodyguard (14)</p>
              </div>
            </div>
          </div>
        </Bubble>
        <Bubble>SMOKE. you drop it and he can&apos;t see you coming.</Bubble>
        <Bubble>tonight?</Bubble>
        <Bubble>
          <span className="inline-flex gap-1 items-center py-0.5">
            {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#bbb] animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />)}
          </span>
        </Bubble>
      </div>

      {/* quick replies */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-black/5 px-3 pt-2 pb-4 flex flex-col gap-2">
        <div className="flex gap-2 overflow-x-auto">
          {['Show the full board', 'What\'s after Smoke?', 'Change difficulty'].map((q) => (
            <button key={q} type="button" className="shrink-0 min-h-[36px] px-3 rounded-full border border-black/10 text-[11px] font-bold text-[#333] bg-white">{q}</button>
          ))}
        </div>
        <button type="button" className="w-full min-h-[50px] rounded-2xl text-white font-black text-[15px]" style={{ background: REVENGE_RED, boxShadow: `0 4px 0 ${REVENGE_RED_DARK}` }}>
          &ldquo;tonight.&rdquo; — start level {NEXT.lvl}
        </button>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Concept 9 — THE TOWER
// One vertical world: a cross-section of the citadel. Floors = the ladder.
// Other hunters' rooks stand on the floors they've reached = the leaderboard.
// The throne room at the top, pulsing, = today's challenge. You scroll up.
// ═════════════════════════════════════════════════════════════════════════════
function ConceptTower() {
  const floors = [...LADDER].reverse();
  const FLOOR_H = 62;
  const onFloor = (lvl: number) => BOARD.filter((p) => p.lvl === lvl);
  return (
    <Phone bg="#0d0f14" text="#fff" style={{ backgroundImage: 'radial-gradient(60% 40% at 50% 0%, rgba(229,57,53,.25), transparent 70%)' }}>
      <div className="sticky top-0 z-20 pt-8 pb-2 px-4 flex items-center justify-between bg-gradient-to-b from-[#0d0f14] via-[#0d0f14]/90 to-transparent">
        <RookiesRevengeLogo scale={0.36} dark />
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/45 font-black">{TODAY}</p>
          <p className="text-[11px] font-mono text-white/70">{COUNTDOWN}</p>
        </div>
      </div>

      {/* stars */}
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(#fff 0.6px, transparent 0.6px)', backgroundSize: '37px 41px' }} />

      <div className="relative mx-auto pb-28" style={{ width: 300 }}>
        {/* throne room */}
        <div className="relative mx-auto rounded-t-[40px] border border-white/15 overflow-hidden" style={{ width: 220, height: 150, background: 'linear-gradient(180deg, #2a1215, #1a0d0f)' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative w-[84px] h-[84px] flex items-center justify-center">
              <Reticle size={84} pulse />
              <King size={44} color="#fff" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/60 mt-1">Throne room · floor 15</p>
          </div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: REVENGE_RED }}>today: Stone Citadel</div>
          <div className="absolute bottom-1 right-2 text-[8px] text-white/40 font-mono">{Math.round(HUNTING * 0.14)} made it here</div>
        </div>

        {/* floors */}
        <div className="border-x border-white/15 bg-[#151922]">
          {floors.filter((f) => f.lvl !== 15).map((f) => {
            const people = onFloor(f.lvl);
            const isYou = f.lvl === YOU.best;
            const done = f.state === 'done';
            const next = f.state === 'next';
            return (
              <div key={f.lvl} className="relative border-t border-white/10 flex items-center" style={{ height: FLOOR_H, background: done ? 'linear-gradient(90deg, rgba(255,190,90,.14), rgba(255,190,90,.05))' : next ? 'rgba(229,57,53,.12)' : 'transparent' }}>
                {/* windows */}
                <div className="absolute inset-y-3 left-3 right-3 flex justify-between pointer-events-none">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-3 rounded-sm" style={{ background: done ? '#ffcf7a' : next ? REVENGE_RED : '#22262f', opacity: done ? 0.55 : 0.5, boxShadow: done ? '0 0 8px #ffcf7a' : undefined }} />
                  ))}
                </div>
                <div className="relative z-10 w-full flex items-center px-3 gap-2">
                  <span className={`w-7 text-[12px] font-black font-mono ${done ? 'text-[#ffd98a]' : next ? 'text-white' : 'text-white/30'}`}>{String(f.lvl).padStart(2, '0')}</span>
                  {/* unlock shelf */}
                  {f.unlock ? (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${done ? 'border-[#ffd98a]/40 text-[#ffd98a]' : next ? 'text-white' : 'border-white/15 text-white/35'}`} style={next ? { background: REVENGE_RED, borderColor: REVENGE_RED } : undefined}>
                      {f.state === 'locked' ? <span className="inline-flex items-center gap-1"><Lock size={8} /> ???</span> : f.unlock}
                    </span>
                  ) : <span />}
                  <span className="flex-1" />
                  {/* who's on this floor */}
                  <div className="flex items-end gap-1.5">
                    {people.map((p) => (
                      <div key={p.name} className="flex flex-col items-center">
                        <span className="text-[7px] font-bold text-white/60 whitespace-nowrap mb-0.5">#{p.rank}</span>
                        <TinyRook size={14} />
                      </div>
                    ))}
                    {isYou && (
                      <div className="flex flex-col items-center">
                        <span className="text-[7px] font-black whitespace-nowrap mb-0.5 px-1 rounded" style={{ background: REVENGE_RED }}>YOU · #{YOU.rank}</span>
                        <TinyRook size={18} />
                      </div>
                    )}
                  </div>
                </div>
                {next && <div className="absolute left-0 right-0 -bottom-px h-[2px]" style={{ background: REVENGE_RED, boxShadow: `0 0 10px ${REVENGE_RED}` }} />}
              </div>
            );
          })}
          {/* ground */}
          <div className="border-t border-white/10 px-3 py-2 flex items-center justify-between text-[9px] text-white/45 font-mono">
            <span>GROUND · {HUNTING.toLocaleString()} entered today</span>
            <span>{BOARD.length}★ shown</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pt-6 pb-5 bg-gradient-to-t from-[#0d0f14] via-[#0d0f14]/95 to-transparent">
        <button type="button" className="w-full min-h-[52px] rounded-2xl font-black text-[15px] text-white flex flex-col items-center justify-center leading-tight" style={{ background: REVENGE_RED, boxShadow: `0 4px 0 ${REVENGE_RED_DARK}, 0 0 28px rgba(229,57,53,.35)` }}>
          CLIMB TO FLOOR {NEXT.lvl}
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-80">unlocks {NEXT.unlock} · passes #46</span>
        </button>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Concept 10 — ARCADE ATTRACT MODE
// CRT cabinet. The leaderboard is a HIGH SCORE table (its native form), the
// ladder is a STAGE SELECT grid, the daily is TODAY'S STAGE + PRESS START.
// ═════════════════════════════════════════════════════════════════════════════
function ConceptArcade() {
  const mono: CSSProperties = { fontFamily: '"Courier New", ui-monospace, monospace', letterSpacing: '0.08em' };
  const [blink] = useState(true);
  return (
    <Phone bg="#05070a" text="#e8f0ff" style={mono}>
      {/* CRT overlays */}
      <div className="pointer-events-none absolute inset-0 z-30" style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 2px, transparent 2px 4px)' }} />
      <div className="pointer-events-none absolute inset-0 z-30" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.7) 100%)' }} />

      <div className="pt-10 px-4 flex flex-col gap-3">
        {/* title */}
        <div className="text-center">
          <p className="text-[9px] text-[#7ef9ff]">★ ★ ★  1 PLAYER  ★ ★ ★</p>
          <h2 className="text-[26px] font-black leading-none mt-1" style={{ color: '#fff', textShadow: `0 0 6px ${REVENGE_RED}, 0 0 18px ${REVENGE_RED}, 0 0 36px ${REVENGE_RED}` }}>ROOKIE&apos;S</h2>
          <h2 className="text-[30px] font-black leading-none" style={{ color: REVENGE_RED, textShadow: `0 0 8px ${REVENGE_RED}, 0 0 24px ${REVENGE_RED}` }}>REVENGE</h2>
          <div className="mx-auto mt-2 w-[64px] h-[64px] relative flex items-center justify-center">
            <RevengeMarkSvg size={64} />
          </div>
        </div>

        {/* TODAY'S STAGE */}
        <div className="border-2 border-[#7ef9ff]/60 p-2.5 text-center" style={{ boxShadow: '0 0 12px rgba(126,249,255,.25) inset' }}>
          <p className="text-[9px] text-[#7ef9ff]">TODAY&apos;S STAGE  ·  {TODAY.toUpperCase()}</p>
          <p className="text-[16px] font-black mt-0.5" style={{ color: '#ffe066', textShadow: '0 0 8px #ffe066' }}>STONE CITADEL</p>
          <div className="flex justify-between text-[9px] mt-1 text-[#e8f0ff]/70">
            <span>15 STAGES</span><span>CREDITS 3</span><span>NEXT IN {COUNTDOWN}</span>
          </div>
          <p className={`text-[14px] font-black mt-2 ${blink ? 'animate-pulse' : ''}`} style={{ color: REVENGE_RED, textShadow: `0 0 10px ${REVENGE_RED}` }}>▶ PRESS START ◀</p>
        </div>

        {/* HIGH SCORES */}
        <div>
          <p className="text-center text-[11px] font-black" style={{ color: '#ffe066', textShadow: '0 0 8px #ffe066' }}>— HIGH SCORES · WORLD —</p>
          <table className="w-full text-[11px] mt-1">
            <thead>
              <tr className="text-[#7ef9ff]/80 text-[9px]"><th className="text-left font-normal">RNK</th><th className="text-left font-normal">NAME</th><th className="text-right font-normal">STG</th><th className="text-right font-normal">SCORE</th></tr>
            </thead>
            <tbody>
              {BOARD.map((p) => (
                <tr key={p.rank} style={{ color: p.rank === 1 ? '#ffe066' : p.rank === 2 ? '#cfd8dc' : p.rank === 3 ? '#ffab91' : '#e8f0ff' }}>
                  <td className="py-0.5">{String(p.rank).padStart(2, '0')}</td>
                  <td className="uppercase truncate max-w-[130px]">{p.name.replace(/[^a-z0-9]/gi, '').slice(0, 10)}</td>
                  <td className="text-right">{p.lvl}</td>
                  <td className="text-right">{p.score.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="text-[#e8f0ff]/40"><td colSpan={4} className="text-center text-[9px]">. . .</td></tr>
              <tr className="animate-pulse" style={{ color: REVENGE_RED }}>
                <td className="py-0.5">{YOU.rank}</td>
                <td className="uppercase">TYLERVSNYC ◀ YOU</td>
                <td className="text-right">{YOU.best}</td>
                <td className="text-right">{YOU.score.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-center text-[9px] text-[#e8f0ff]/50 mt-1">{HUNTING.toLocaleString()} PLAYERS TODAY · 2,290 PTS TO RANK 46</p>
        </div>

        {/* STAGE SELECT */}
        <div>
          <p className="text-center text-[11px] font-black" style={{ color: '#7ef9ff', textShadow: '0 0 8px #7ef9ff' }}>— STAGE SELECT —</p>
          <div className="grid grid-cols-5 gap-1.5 mt-1.5">
            {LADDER.map((r) => (
              <div
                key={r.lvl}
                className="relative aspect-square border-2 flex flex-col items-center justify-center"
                style={{
                  borderColor: r.state === 'done' ? '#58CC02' : r.state === 'next' ? REVENGE_RED : 'rgba(232,240,255,.2)',
                  color: r.state === 'done' ? '#58CC02' : r.state === 'next' ? '#fff' : 'rgba(232,240,255,.3)',
                  background: r.state === 'next' ? 'rgba(229,57,53,.25)' : 'transparent',
                  boxShadow: r.state === 'next' ? `0 0 12px ${REVENGE_RED}` : r.state === 'done' ? '0 0 6px rgba(88,204,2,.4)' : undefined,
                }}
              >
                <span className="text-[13px] font-black">{String(r.lvl).padStart(2, '0')}</span>
                {r.unlock && (
                  <span className="text-[6.5px] leading-none mt-0.5 text-center px-0.5" style={{ color: r.state === 'locked' ? 'rgba(232,240,255,.35)' : '#ffe066' }}>
                    {r.state === 'locked' ? '?????' : r.unlock.toUpperCase()}
                  </span>
                )}
                {r.state === 'done' && <span className="absolute top-0 right-0.5 text-[8px]">✓</span>}
                {r.unlock && r.state !== 'locked' && <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[6px] px-0.5 bg-[#05070a]" style={{ color: '#ffe066' }}>NEW WEAPON</span>}
              </div>
            ))}
          </div>
          <p className="text-center text-[9px] mt-1.5" style={{ color: '#ffe066' }}>CLEAR STAGE {String(NEXT.lvl).padStart(2, '0')} → {NEXT.unlock.toUpperCase()} UNLOCKED</p>
        </div>

        <button type="button" className="w-full min-h-[52px] border-4 font-black text-[16px] mb-6" style={{ borderColor: REVENGE_RED, color: '#fff', background: 'rgba(229,57,53,.2)', boxShadow: `0 0 18px ${REVENGE_RED}, inset 0 0 18px rgba(229,57,53,.4)`, textShadow: `0 0 8px ${REVENGE_RED}` }}>
          INSERT COIN — STAGE {String(NEXT.lvl).padStart(2, '0')}
        </button>
        <p className="text-center text-[8px] text-[#e8f0ff]/40 pb-6">© 2026 CHESS PATH · THE GAME ENDED. SHE TOOK IT PERSONALLY.</p>
      </div>
    </Phone>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const CONCEPTS = [
  { n: 6, title: 'The Board Is The Menu', pitch: 'No cards at all. The home screen is a chessboard: ranks you’ve conquered glow (ladder), the top hunters stand on it as the enemy army (leaderboard), today’s king sits on h8 in a reticle (daily). Tap the king to play.', C: ConceptBoard },
  { n: 7, title: 'Rookie’s Evidence Wall', pitch: 'A conspiracy corkboard. Red string, polaroids, marker notes — Rookie is unwell about this. King mugshot = daily, rival hunters pinned = leaderboard, index cards chained down the wall = ladder (locked ones face-down).', C: ConceptEvidence },
  { n: 8, title: 'Rookie Texts You', pitch: 'The home screen is a message thread. Rookie texts you about the hunt — daily, leaderboard and ladder arrive as attachments in her voice. You answer with quick replies. Every visit, new messages.', C: ConceptTexts },
  { n: 9, title: 'The Tower', pitch: 'One vertical world: a cross-section of the citadel. Floors = ladder, other hunters’ rooks stand on the floors they reached = leaderboard, the pulsing throne room at the top = today. You literally climb.', C: ConceptTower },
  { n: 10, title: 'Arcade Attract Mode', pitch: 'A CRT cabinet. The leaderboard finally gets its native form — a HIGH SCORE table. Ladder = STAGE SELECT grid with NEW WEAPON tags. Daily = TODAY’S STAGE + a blinking PRESS START.', C: ConceptArcade },
];

export default function RevengeHomeConceptsPage() {
  return (
    <main className="h-full overflow-auto bg-[#e6eef5] text-chess-text">
      <div className="px-6 pt-6 pb-2 max-w-[1900px] mx-auto">
        <h1 className="text-2xl font-black">Rookie&apos;s Revenge — home screen concepts, round 2</h1>
        <p className="text-sm text-chess-text-muted mt-1">
          Five worlds, not five layouts. Each still carries <b>Daily Challenge</b>, <b>Global Leaderboard</b> and <b>Unlock Ladder</b>. Scroll inside each phone.{' '}
          <Link className="underline" href="/test/revenge-home/round1">Round 1 (the safe ones) →</Link>
        </p>
      </div>
      <div className="flex gap-6 px-6 pb-12 overflow-x-auto max-w-[1900px] mx-auto items-start">
        {CONCEPTS.map(({ n, title, pitch, C }) => (
          <div key={n} className="shrink-0 w-[360px] flex flex-col gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: REVENGE_RED }}>Concept {n}</p>
              <h2 className="text-lg font-black leading-tight">{title}</h2>
              <p className="text-[12px] text-chess-text-muted leading-snug mt-1 min-h-[86px]">{pitch}</p>
            </div>
            <C />
          </div>
        ))}
      </div>
    </main>
  );
}
