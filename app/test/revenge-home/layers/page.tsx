'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { defaultPieces } from 'react-chessboard';
import { ChessPathBoard } from '@/components/board/ChessPathBoard';
import { RookieCell } from '@/components/run/RookieCell';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { REVENGE_RED, REVENGE_RED_DARK, RevengeMarkSvg, RevengeReticleSvg } from '@/components/run/RookiesRevengeLogo';
import { TrophyGlyph } from '@/components/run/AchievementToast';

/**
 * /test/revenge-home/layers — ROUND 7: LAYERS.
 * Five home screens built on depth: things overlap, sit on top of each other,
 * tilt in 3D, slide over the board. Every board is the REAL game board
 * (ChessPathBoard + the game's piece set, Rookie via RookieCell) and every
 * screen carries a leaderboard with dummy stats.
 *   E. Tilt       — the board leans back in 3D; a white sheet slides over it with the ranks.
 *   F. Podium     — the top 3 stand on blocks ON the board, night arena.
 *   G. The Stack  — three overlapping cards (Hunt / Ranks / Ladder); tap to bring one forward.
 *   H. Spotlight  — full-bleed board in the dark, spotlight on the King, panels float over it.
 *   I. Scoreboard — a hanging red sign with the ranks swings over the top of the board.
 * Mock data only.
 */

// ── Mock data ────────────────────────────────────────────────────────────────
const COUNTDOWN = '09:41';
const HUNTING = 2318;
const RUNG = 4;
const RUNGS = 10;
const POWERS = { have: 7, total: 18 };
const TROPHIES = { have: 12, total: 54 };
const BOARD_ROWS = [
  { rank: 1, handle: 'kingslayer_ru', captures: 31, levels: 10, done: true },
  { rank: 2, handle: 'pawnstorm', captures: 29, levels: 10, done: true },
  { rank: 3, handle: 'gleasons_gym', captures: 27, levels: 9, done: false },
  { rank: 4, handle: 'moxie.chess', captures: 24, levels: 9, done: false },
  { rank: 5, handle: 'h8_bishops', captures: 22, levels: 8, done: false },
];
const ME = { rank: 47, handle: 'Tylervsnyc', captures: 12, levels: 6, done: false };

// Today's hunt, as a real position. Rookie = wR (rendered by RookieCell).
const FEN = '6k1/4bppp/2n5/8/1p2n3/8/1R4P1/8 w - - 0 1';
const KING_SQUARE = 'g8';

// ── Shared bits ──────────────────────────────────────────────────────────────
function Phone({ children, bg = '#eef6fc', text = '#2A3C45', label, note }: { children: ReactNode; bg?: string; text?: string; label: string; note: string }) {
  return (
    <div className="shrink-0 w-[360px]">
      <div className="mb-2 px-1">
        <div className="text-[15px] font-black text-[#2A3C45]">{label}</div>
        <div className="text-[12px] text-[#6b7c8a] leading-snug">{note}</div>
      </div>
      <div className="relative w-[360px] h-[760px] rounded-[36px] border-[6px] border-[#1a1a1a] overflow-hidden shadow-xl" style={{ background: bg, color: text }}>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#1a1a1a] z-30" />
        <div className="h-full w-full overflow-auto">{children}</div>
      </div>
    </div>
  );
}

function Chunky({ children, color = REVENGE_RED, shadow = REVENGE_RED_DARK, textColor = '#fff', className = '', style }: {
  children: ReactNode; color?: string; shadow?: string; textColor?: string; className?: string; style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      className={`rr-press w-full min-h-[56px] rounded-2xl font-black text-[18px] tracking-wide ${className}`}
      style={{ background: color, color: textColor, boxShadow: `0 5px 0 ${shadow}`, ...style }}
    >
      {children}
    </button>
  );
}

function Bubble({ children, tail = 'left', dark, className = '' }: { children: ReactNode; tail?: 'left' | 'bottom' | 'right'; dark?: boolean; className?: string }) {
  const bg = dark ? '#2A3C45' : '#fff';
  const fg = dark ? '#fff' : '#2A3C45';
  return (
    <div className={`relative inline-block rounded-2xl px-3.5 py-2.5 text-[14px] font-bold leading-snug shadow-md ${className}`} style={{ background: bg, color: fg, maxWidth: 240 }}>
      {children}
      <span
        aria-hidden
        className="absolute w-3.5 h-3.5 rotate-45"
        style={{ background: bg, ...(tail === 'left' ? { left: -5, top: 16 } : tail === 'right' ? { right: -5, top: 16 } : { bottom: -5, left: 24 }) }}
      />
    </div>
  );
}

function RungPips({ dark }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rung ${RUNG} of ${RUNGS}`}>
      {Array.from({ length: RUNGS }, (_, i) => {
        const done = i < RUNG - 1;
        const next = i === RUNG - 1;
        return <span key={i} className="h-2.5 rounded-full" style={{ width: next ? 18 : 10, background: done ? '#58CC02' : next ? REVENGE_RED : dark ? 'rgba(255,255,255,0.25)' : 'rgba(42,60,69,0.15)' }} />;
      })}
    </div>
  );
}

function BottomTabs({ dark }: { dark?: boolean }) {
  const surface = dark ? 'rgba(255,255,255,0.08)' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.12)' : 'rgba(42,60,69,0.1)';
  const muted = dark ? 'rgba(255,255,255,0.65)' : '#6b7c8a';
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <button type="button" className="rr-press text-left rounded-2xl p-3 min-h-[64px] border" style={{ background: surface, borderColor: border }}>
        <div className="text-[13px] font-black leading-tight">The Ladder</div>
        <div className="mt-1.5"><RungPips dark={dark} /></div>
        <div className="text-[11px] mt-1 font-bold" style={{ color: muted }}>Rung {RUNG} is open</div>
      </button>
      <button type="button" className="rr-press text-left rounded-2xl p-3 min-h-[64px] border flex items-center gap-2.5" style={{ background: surface, borderColor: border }}>
        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: dark ? '#fff' : '#2A3C45' }}><TrophyGlyph size={16} /></span>
        <span>
          <span className="block text-[13px] font-black leading-tight">The Codex</span>
          <span className="block text-[11px] font-bold mt-0.5" style={{ color: muted }}>{POWERS.have}/{POWERS.total} powers · {TROPHIES.have}/{TROPHIES.total}</span>
        </span>
      </button>
    </div>
  );
}

/** Leaderboard rows. `compact` drops the level column. */
function Ranks({ dark, rows = BOARD_ROWS, compact, me = true }: { dark?: boolean; rows?: typeof BOARD_ROWS; compact?: boolean; me?: boolean }) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#94a3b8';
  const line = dark ? 'rgba(255,255,255,0.08)' : 'rgba(42,60,69,0.06)';
  const medal = (r: number) => (r === 1 ? '#FFB020' : r === 2 ? '#B0BEC5' : r === 3 ? '#C77B45' : muted);
  return (
    <ul>
      {rows.map((r) => (
        <li key={r.rank} className="flex items-center gap-2.5 py-[7px] text-[13px]" style={{ borderBottom: `1px solid ${line}` }}>
          <span className="w-5 font-black tabular-nums" style={{ color: medal(r.rank) }}>{r.rank}</span>
          <span className="flex-1 font-bold truncate">{r.handle}</span>
          {!compact && <span className="text-[11px] font-bold" style={{ color: muted }}>L{r.levels}{r.done ? ' ♚' : ''}</span>}
          <span className="tabular-nums w-8 text-right font-black">{r.captures}<span className="font-bold" style={{ color: muted }}>×</span></span>
        </li>
      ))}
      {me && (
        <li className="flex items-center gap-2.5 py-[7px] mt-1 text-[13px] font-black rounded-lg px-2 -mx-2" style={{ background: dark ? 'rgba(229,57,53,0.18)' : '#FFEBEE', color: dark ? '#fff' : REVENGE_RED }}>
          <span className="w-5 tabular-nums">{ME.rank}</span>
          <span className="flex-1 truncate">{ME.handle} (you)</span>
          {!compact && <span className="text-[11px] opacity-70">L{ME.levels}</span>}
          <span className="tabular-nums w-8 text-right">{ME.captures}×</span>
        </li>
      )}
    </ul>
  );
}

/** The REAL board, frozen: ChessPathBoard + game piece set, Rookie via RookieCell, reticle on the King. */
const HOME_PIECES = { ...defaultPieces, wR: () => <RookieCell form="rook" /> };
function HomeBoard({ id, reticle = true, shadow = true }: { id: string; reticle?: boolean; shadow?: boolean }) {
  return (
    <div className="relative w-full aspect-square">
      <ChessPathBoard
        options={{
          id,
          position: FEN,
          pieces: HOME_PIECES,
          showNotation: false,
          allowDragging: false,
          boardOrientation: 'white',
          boardStyle: { borderRadius: 14, boxShadow: shadow ? '0 12px 32px rgba(42,60,69,0.22)' : 'none' },
          squareStyles: reticle ? { [KING_SQUARE]: { boxShadow: 'inset 0 0 0 3px rgba(229,57,53,0.75)' } } : {},
        }}
      />
      {reticle && (
        <div className="absolute pointer-events-none flex items-center justify-center" style={{ right: '12.5%', top: 0, width: '12.5%', height: '12.5%' }}>
          <RevengeReticleSvg size={64} className="rr-lock" style={{ filter: 'drop-shadow(0 0 5px rgba(229,57,53,0.7))' }} />
        </div>
      )}
    </div>
  );
}

function HuntersLine({ dark }: { dark?: boolean }) {
  return (
    <p className="text-[12px] font-bold text-center" style={{ color: dark ? 'rgba(255,255,255,0.7)' : '#6b7c8a' }}>
      {HUNTING.toLocaleString()} hunting today · resets in {COUNTDOWN}
    </p>
  );
}

// ── E. Tilt ──────────────────────────────────────────────────────────────────
function ConceptTilt() {
  return (
    <div className="min-h-full relative flex flex-col" style={{ background: 'linear-gradient(180deg,#cfe7fb 0%,#eef6fc 55%)' }}>
      {/* header */}
      <div className="relative z-20 px-4 pt-11 flex items-center justify-between">
        <RevengeMarkSvg size={36} />
        <span className="text-[11px] font-black uppercase tracking-wider text-[#6b7c8a]">Tue, Sep 2 · {COUNTDOWN} left</span>
      </div>

      {/* layer 1: the board leaning back */}
      <div className="relative mt-3 px-2" style={{ perspective: 700 }}>
        <div className="mx-auto w-[340px]" style={{ transform: 'rotateX(42deg) translateY(-8px) scale(1.04)', transformOrigin: '50% 100%' }}>
          <HomeBoard id="tilt" />
        </div>
      </div>

      {/* layer 2: Rookie standing in front of the board, talking */}
      <div className="relative z-20 -mt-6 px-4 flex items-end gap-2">
        <div className="shrink-0 rr-float"><BreathingRook size="sm" animate mood="neutral" /></div>
        <Bubble tail="left" className="mb-3">He&rsquo;s on g8. He thinks the corner is safe.</Bubble>
      </div>

      {/* layer 3: the sheet with the ranks, sliding over the board's feet */}
      <div className="relative z-10 mt-6 flex-1 bg-white rounded-t-[28px] px-4 pt-5 pb-6 shadow-[0_-12px_30px_rgba(42,60,69,0.12)]">
        {/* layer 4: GO overlapping the seam */}
        <div className="-mt-11 mb-4"><Chunky style={{ boxShadow: `0 5px 0 ${REVENGE_RED_DARK}, 0 14px 28px rgba(229,57,53,0.35)` }}>GO GET HIM</Chunky></div>
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-[15px] font-black">Today&rsquo;s hunters</h2>
          <span className="text-[11px] font-bold text-[#94a3b8]">{HUNTING.toLocaleString()} playing</span>
        </div>
        <Ranks compact />
        <div className="mt-4"><BottomTabs /></div>
      </div>
    </div>
  );
}

// ── F. Podium ────────────────────────────────────────────────────────────────
function ConceptPodium() {
  const top3 = [BOARD_ROWS[1], BOARD_ROWS[0], BOARD_ROWS[2]]; // 2 · 1 · 3
  const heights = [64, 92, 48];
  const colors = ['#B0BEC5', '#FFB020', '#C77B45'];
  return (
    <div className="min-h-full relative flex flex-col overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 20%, #24395f 0%, #0f1a2e 70%)', color: '#fff' }}>
      <div className="relative z-20 px-4 pt-11 flex items-center justify-between">
        <span className="text-[12px] font-black uppercase tracking-[0.2em] opacity-90">Tonight&rsquo;s hunt</span>
        <span className="text-[12px] font-black uppercase tracking-[0.2em]" style={{ color: '#FFB020' }}>{COUNTDOWN} left</span>
      </div>

      {/* layer 1: the board as the arena floor */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[16px] w-[430px]" style={{ perspective: 640 }}>
        <div style={{ transform: 'rotateX(52deg)', transformOrigin: '50% 100%' }}>
          <HomeBoard id="podium" shadow={false} />
        </div>
      </div>
      {/* the floor fades into the dark below the podium */}
      <div aria-hidden className="absolute inset-x-0 top-[250px] h-[200px] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(15,26,46,0) 0%, rgba(15,26,46,0.85) 55%, #0f1a2e 100%)' }} />

      {/* layer 2: the podium standing on the floor */}
      <div className="relative z-10 mt-[178px] px-6 flex items-end justify-center gap-2">
        {top3.map((r, i) => (
          <div key={r.rank} className="flex flex-col items-center" style={{ width: 96 }}>
            <div className="rounded-lg px-2 py-1 mb-1.5 max-w-full text-center" style={{ background: 'rgba(15,26,46,0.8)' }}>
              <div className="text-[12px] font-black truncate">{r.handle}</div>
              <div className="text-[11px] font-bold opacity-75">{r.captures} captures</div>
            </div>
            <div className="w-full rounded-t-xl flex items-start justify-center pt-2 text-[22px] font-black" style={{ height: heights[i], background: colors[i], color: '#1a1a1a', boxShadow: `0 6px 0 rgba(0,0,0,0.35), inset 0 -10px 0 rgba(0,0,0,0.15)` }}>
              {r.rank}
            </div>
          </div>
        ))}
      </div>

      {/* layer 3: Rookie in front, unimpressed, with your rank */}
      <div className="relative z-20 px-4 -mt-2 flex items-end gap-2">
        <div className="shrink-0 rr-float"><BreathingRook size="sm" animate mood="neutral" /></div>
        <Bubble tail="left" dark className="mb-3">You&rsquo;re #{ME.rank}. That podium has room. Trust me.</Bubble>
      </div>

      <div className="relative z-20 px-4 mt-4">
        <Chunky>GO GET HIM</Chunky>
        <div className="mt-2.5"><HuntersLine dark /></div>
      </div>
      <div className="relative z-20 mt-auto px-4 pb-6 pt-4"><BottomTabs dark /></div>
    </div>
  );
}

// ── G. The Stack ─────────────────────────────────────────────────────────────
type CardId = 'hunt' | 'ranks' | 'ladder';
function ConceptStack() {
  const [top, setTop] = useState<CardId>('hunt');
  const order: CardId[] = ['ladder', 'ranks', 'hunt'];
  const stack = order.filter((c) => c !== top).concat(top); // top last = highest z
  const titles: Record<CardId, string> = { hunt: "Today's hunt", ranks: 'Hunters', ladder: 'The Ladder' };
  return (
    <div className="min-h-full relative flex flex-col px-4 pt-11 pb-6" style={{ background: '#eef6fc' }}>
      <div className="flex items-center justify-between">
        <RevengeMarkSvg size={34} />
        <span className="text-[11px] font-black uppercase tracking-wider text-[#6b7c8a]">Tue, Sep 2</span>
      </div>
      <div className="mt-3"><Bubble tail="bottom">Three things on my desk. The first one is the important one.</Bubble></div>

      {/* the stack: each card peeks out above the one in front of it */}
      <div className="relative mt-4 flex-1 min-h-[540px]">
        {stack.map((id, i) => {
          const depth = stack.length - 1 - i; // 0 = front
          const isTop = depth === 0;
          const rot = isTop ? 0 : depth === 1 ? -2.5 : 3;
          return (
            <div
              key={id}
              role="button"
              tabIndex={0}
              onClick={() => setTop(id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setTop(id); }}
              className="absolute left-0 right-0 rounded-[22px] bg-white border border-[#2A3C45]/10 cursor-pointer overflow-hidden"
              style={{
                top: depth * 44,
                height: 520,
                zIndex: i + 1,
                transform: `rotate(${rot}deg) scale(${1 - depth * 0.03})`,
                transformOrigin: '50% 0%',
                boxShadow: isTop ? '0 18px 40px rgba(42,60,69,0.22)' : '0 6px 16px rgba(42,60,69,0.12)',
                transition: 'top 320ms cubic-bezier(.22,1,.36,1), transform 320ms cubic-bezier(.22,1,.36,1), box-shadow 320ms',
              }}
            >
              <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
                <h2 className="text-[15px] font-black">{titles[id]}</h2>
                {id === 'hunt' && <span className="text-[11px] font-bold text-[#94a3b8]">{COUNTDOWN} left</span>}
                {id === 'ranks' && <span className="text-[11px] font-bold text-[#94a3b8]">{HUNTING.toLocaleString()} playing</span>}
                {id === 'ladder' && <span className="text-[11px] font-bold text-[#94a3b8]">Rung {RUNG}/{RUNGS}</span>}
              </div>
              <div className="px-3 pb-3">
                {id === 'hunt' && (
                  <>
                    <HomeBoard id="stack" shadow={false} />
                    <div className="mt-3"><Chunky>GO GET HIM</Chunky></div>
                  </>
                )}
                {id === 'ranks' && (
                  <div className="px-1">
                    <Ranks />
                    <div className="mt-3"><Chunky color="#2A3C45" shadow="#17252c">GO GET HIM</Chunky></div>
                  </div>
                )}
                {id === 'ladder' && (
                  <div className="px-1">
                    <ul>
                      {Array.from({ length: RUNGS }, (_, i) => {
                        const st = i < RUNG - 1 ? 'done' : i === RUNG - 1 ? 'open' : 'locked';
                        return (
                          <li key={i} className="flex items-center gap-3 py-1.5 text-[13px]" style={{ opacity: st === 'locked' ? 0.45 : 1 }}>
                            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-black" style={st === 'done' ? { background: '#58CC02', color: '#fff' } : st === 'open' ? { background: REVENGE_RED, color: '#fff' } : { background: '#e5edf3', color: '#94a3b8' }}>
                              {st === 'done' ? '✓' : i + 1}
                            </span>
                            <span className="font-bold flex-1">Rung {i + 1}</span>
                            {st === 'open' && <span className="text-[11px] font-black" style={{ color: REVENGE_RED }}>PLAY ›</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── H. Spotlight ─────────────────────────────────────────────────────────────
function ConceptSpotlight() {
  return (
    <div className="min-h-full relative flex flex-col overflow-hidden" style={{ background: '#0b1220', color: '#fff' }}>
      {/* layer 0: the board, full-bleed and oversized */}
      <div className="absolute -left-[40px] top-[64px] w-[440px]">
        <HomeBoard id="spot" shadow={false} reticle={false} />
      </div>
      {/* layer 1: darkness with a hole over the King */}
      <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(circle at 317px 91px, rgba(11,18,32,0) 0, rgba(11,18,32,0) 40px, rgba(11,18,32,0.5) 130px, rgba(11,18,32,0.9) 320px)' }} />
      <div className="absolute pointer-events-none" style={{ left: 277, top: 51 }}>
        <RevengeReticleSvg size={80} className="rr-lock" style={{ filter: 'drop-shadow(0 0 8px rgba(229,57,53,0.8))' }} />
      </div>

      <div className="relative z-10 px-4 pt-11 flex items-center justify-between">
        <span className="text-[12px] font-black uppercase tracking-[0.2em] opacity-90">Found him.</span>
        <span className="text-[12px] font-black uppercase tracking-[0.2em]" style={{ color: REVENGE_RED }}>{COUNTDOWN} left</span>
      </div>

      {/* layer 2: Rookie, large, in the foreground */}
      <div className="relative z-10 mt-[170px] px-4 flex items-end gap-2">
        <div className="shrink-0 rr-float"><BreathingRook size="md" animate mood="neutral" /></div>
        <Bubble tail="left" dark className="mb-6">Top right. Cornered. This is going to be quick.</Bubble>
      </div>

      {/* layer 3: the panel floating over the board */}
      <div className="relative z-10 mx-4 -mt-4 rounded-[22px] bg-white text-[#2A3C45] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <Chunky>GO GET HIM</Chunky>
        <div className="flex items-baseline justify-between mt-4 mb-1">
          <h2 className="text-[14px] font-black">Hunters tonight</h2>
          <span className="text-[11px] font-bold text-[#94a3b8]">{HUNTING.toLocaleString()} playing</span>
        </div>
        <Ranks compact rows={BOARD_ROWS.slice(0, 3)} />
      </div>
      <div className="relative z-10 mt-auto px-4 pb-6 pt-4"><BottomTabs dark /></div>
    </div>
  );
}

// ── I. Scoreboard ────────────────────────────────────────────────────────────
function ConceptScoreboard() {
  return (
    <div className="min-h-full relative flex flex-col" style={{ background: 'linear-gradient(180deg,#dcefff 0%,#eef6fc 50%)' }}>
      {/* chains */}
      <div aria-hidden className="absolute top-0 left-[58px] w-[3px] h-[66px] bg-[#8a94a0]" />
      <div aria-hidden className="absolute top-0 right-[58px] w-[3px] h-[66px] bg-[#8a94a0]" />

      {/* layer 2 (drawn first, sits under the sign): the board */}
      <div className="absolute left-4 right-4 top-[252px]"><HomeBoard id="sign" /></div>

      {/* layer 3: the hanging sign, swinging over the board's top edge */}
      <div className="relative z-10 mx-7 mt-[60px] rr-swing" style={{ transformOrigin: '50% -80px' }}>
        <div className="rounded-2xl px-4 pt-3 pb-3.5 text-white" style={{ background: `linear-gradient(180deg, ${REVENGE_RED} 0%, ${REVENGE_RED_DARK} 100%)`, boxShadow: '0 8px 0 #7f1414, 0 24px 40px rgba(183,28,28,0.35)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-90">Today&rsquo;s hunters</span>
            <span className="text-[11px] font-black tabular-nums opacity-90">{COUNTDOWN}</span>
          </div>
          <ul className="mt-1.5">
            {BOARD_ROWS.slice(0, 4).map((r) => (
              <li key={r.rank} className="flex items-center gap-2 py-[3px] text-[13px] font-bold">
                <span className="w-4 font-black tabular-nums" style={{ color: r.rank === 1 ? '#FFD54F' : 'rgba(255,255,255,0.7)' }}>{r.rank}</span>
                <span className="flex-1 truncate">{r.handle}</span>
                <span className="tabular-nums font-black">{r.captures}×</span>
              </li>
            ))}
            <li className="flex items-center gap-2 py-[3px] mt-1 text-[13px] font-black rounded-lg px-2 -mx-2 bg-white" style={{ color: REVENGE_RED }}>
              <span className="w-4 tabular-nums">{ME.rank}</span>
              <span className="flex-1 truncate">{ME.handle} (you)</span>
              <span className="tabular-nums">{ME.captures}×</span>
            </li>
          </ul>
        </div>
      </div>

      {/* spacer for the board's height under the sign */}
      <div className="h-[372px]" />

      {/* layer 4: Rookie peeking up from behind the board's bottom edge */}
      <div className="relative z-10 px-4 mt-1 flex items-end gap-2">
        <div className="shrink-0 rr-float"><BreathingRook size="sm" animate mood="neutral" /></div>
        <Bubble tail="left" className="mb-3">Fourth place has nine captures on you. Rude.</Bubble>
      </div>

      <div className="relative z-10 px-4 mt-3">
        <Chunky>GO GET HIM</Chunky>
        <div className="mt-2.5"><HuntersLine /></div>
      </div>
      <div className="relative z-10 mt-auto px-4 pb-6 pt-4"><BottomTabs /></div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function LayersHomePage() {
  return (
    <div className="h-full overflow-auto bg-[#f4f7fa] p-6">
      <style>{`
        .rr-press { transition: transform 90ms ease-out, box-shadow 90ms ease-out; }
        .rr-press:active { transform: translateY(4px); box-shadow: 0 1px 0 rgba(0,0,0,0.25) !important; }
        @keyframes rr-lock { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: .75; } }
        .rr-lock { animation: rr-lock 1.4s ease-in-out infinite; transform-origin: 50% 50%; }
        @keyframes rr-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .rr-float { animation: rr-float 2.4s ease-in-out infinite; }
        @keyframes rr-swing { 0%,100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.2deg); } }
        .rr-swing { animation: rr-swing 3.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .rr-lock, .rr-float, .rr-swing { animation: none !important; } }
      `}</style>
      <div className="max-w-[2000px] mx-auto">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-black text-[#2A3C45]">Rookie&rsquo;s Revenge home · Round 7: LAYERS</h1>
            <p className="text-[13px] text-[#6b7c8a]">Five depth-first directions. Real board + real pieces, leaderboard on every one. Mock data.</p>
          </div>
          <Link href="/test/revenge-home/fun" className="text-[12px] font-bold text-[#6b7c8a] underline">← round 6 (fun)</Link>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-6">
          <Phone label="E · Tilt" note="The board leans back in 3D. Rookie stands in front of it. A white sheet slides up over its feet carrying the ranks, and GO sits on the seam.">
            <ConceptTilt />
          </Phone>
          <Phone label="F · Podium" note="Night arena. The board is the floor, the top three stand on podium blocks on top of it, Rookie in front telling you there's room." bg="#0f1a2e" text="#fff">
            <ConceptPodium />
          </Phone>
          <Phone label="G · The Stack" note="Three cards piled on the desk: Hunt, Hunters, Ladder. Tap a peeking card to bring it to the front.">
            <ConceptStack />
          </Phone>
          <Phone label="H · Spotlight" note="Full-bleed board in the dark, spotlight on the King, Rookie huge in the foreground, one white panel floating over everything." bg="#0b1220" text="#fff">
            <ConceptSpotlight />
          </Phone>
          <Phone label="I · Scoreboard" note="A red sign hangs from chains over the top of the board and swings. The leaderboard lives on the sign.">
            <ConceptScoreboard />
          </Phone>
        </div>
      </div>
    </div>
  );
}
