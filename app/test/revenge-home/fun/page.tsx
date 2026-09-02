'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { REVENGE_RED, REVENGE_RED_DARK, RevengeMarkSvg, RevengeReticleSvg } from '@/components/run/RookiesRevengeLogo';
import { PieceBlocks } from '@/components/run/PieceBlocks';
import { TrophyGlyph } from '@/components/run/AchievementToast';

/**
 * /test/revenge-home/fun — ROUND 6: "just make it FUN".
 * Four directions, each one screen, each built around a GAME feeling instead
 * of a layout theme. Same three windows everywhere (Daily · Ladder · Codex,
 * leaderboard as a one-liner) but the daily run is the whole screen.
 *   A. The Chase   — the live board IS the home screen; Rookie hunts the King.
 *   B. VS          — fighting-game character-select. Rookie vs. the King.
 *   C. The Hand    — today's powers fanned like cards you're about to draw.
 *   D. Big Red     — one enormous physical button. Nothing else to think about.
 * Mock data only. Real assets: rook mark, PieceBlocks, ability art.
 */

// ── Mock data ────────────────────────────────────────────────────────────────
const COUNTDOWN = '09:41';
const HUNTING = 2318;
const YOU = { name: 'Tylervsnyc', rank: 47 };
const RUNG = 4;
const RUNGS = 10;
const POWERS = { have: 7, total: 18 };
const TROPHIES = { have: 12, total: 54 };
const TAUNTS = [
  'He thinks he won. Adorable.',
  'Ten levels. One King. I have a list.',
  'The game ended. I did not.',
  'He is somewhere on this board. I can smell the crown.',
];
const HAND = [
  { id: 'surge-1', name: 'Surge' },
  { id: 'freeze-ray-1', name: 'Freeze Ray' },
  { id: 'drones-1', name: 'Drones' },
];

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

/** Chunky Chess-Path style button: flat color, hard bottom shadow that presses flat. */
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

/** Small speech bubble from Rookie. `tail` picks which side the tail points from. */
function Bubble({ children, tail = 'left', dark }: { children: ReactNode; tail?: 'left' | 'bottom' | 'right'; dark?: boolean }) {
  const bg = dark ? '#2A3C45' : '#fff';
  const fg = dark ? '#fff' : '#2A3C45';
  return (
    <div className="relative inline-block rounded-2xl px-3.5 py-2.5 text-[14px] font-bold leading-snug shadow-md" style={{ background: bg, color: fg, maxWidth: 240 }}>
      {children}
      <span
        aria-hidden
        className="absolute w-3.5 h-3.5 rotate-45"
        style={{
          background: bg,
          ...(tail === 'left' ? { left: -5, top: 16 } : tail === 'right' ? { right: -5, top: 16 } : { bottom: -5, left: 24 }),
        }}
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
        return (
          <span
            key={i}
            className="h-2.5 rounded-full transition-all"
            style={{
              width: next ? 18 : 10,
              background: done ? '#58CC02' : next ? REVENGE_RED : dark ? 'rgba(255,255,255,0.25)' : 'rgba(42,60,69,0.15)',
            }}
          />
        );
      })}
    </div>
  );
}

/** Two flat bottom tabs: Ladder + Codex. The secondary stuff, always the same two taps. */
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
        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: dark ? '#fff' : '#2A3C45' }}>
          <TrophyGlyph size={16} />
        </span>
        <span>
          <span className="block text-[13px] font-black leading-tight">The Codex</span>
          <span className="block text-[11px] font-bold mt-0.5" style={{ color: muted }}>{POWERS.have}/{POWERS.total} powers · {TROPHIES.have}/{TROPHIES.total}</span>
        </span>
      </button>
    </div>
  );
}

function HuntersLine({ dark }: { dark?: boolean }) {
  return (
    <p className="text-[12px] font-bold text-center" style={{ color: dark ? 'rgba(255,255,255,0.7)' : '#6b7c8a' }}>
      {HUNTING.toLocaleString()} hunting today · you&rsquo;re <span style={{ color: REVENGE_RED }}>#{YOU.rank}</span> · resets in {COUNTDOWN}
    </p>
  );
}

// ── A. The Chase ─────────────────────────────────────────────────────────────
// The board from the game, alive. Rookie hops toward the King; the reticle
// pulses on him. Tapping GO drops you into exactly this.
const ROOKIE_PATH = [
  [1, 6], [1, 4], [3, 4], [3, 2], [5, 2], [5, 5], [2, 5], [2, 1], [6, 1], [6, 6], [1, 6],
] as const; // [file, rank] 0-based, top-left origin
const KING_AT = [6, 1] as const;
const ENEMIES: ReadonlyArray<readonly [number, number, string]> = [[2, 3, '♞'], [4, 6, '♟'], [7, 4, '♝'], [0, 2, '♟'], [5, 0, '♜']];

function ChaseBoard() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % (ROOKIE_PATH.length - 1)), 900);
    return () => clearInterval(t);
  }, []);
  const cell = 100 / 8;
  const [rx, ry] = ROOKIE_PATH[step];
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(42,60,69,0.18)]" style={{ background: '#F0E8C8' }}>
      {/* squares */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
        {Array.from({ length: 64 }, (_, i) => {
          const f = i % 8, r = Math.floor(i / 8);
          return <div key={i} style={{ background: (f + r) % 2 ? '#7A9E4B' : '#F0E8C8' }} />;
        })}
      </div>
      {/* enemies */}
      {ENEMIES.map(([f, r, g]) => (
        <span key={`${f}${r}`} className="absolute flex items-center justify-center text-[#111] select-none" style={{ left: `${f * cell}%`, top: `${r * cell}%`, width: `${cell}%`, height: `${cell}%`, fontSize: 26 }} aria-hidden>{g}</span>
      ))}
      {/* the King + reticle */}
      <div className="absolute flex items-center justify-center" style={{ left: `${KING_AT[0] * cell}%`, top: `${KING_AT[1] * cell}%`, width: `${cell}%`, height: `${cell}%` }}>
        <span className="text-[#111] select-none" style={{ fontSize: 30, lineHeight: 1 }} aria-hidden>♚</span>
        <RevengeReticleSvg size={54} className="absolute rr-lock" style={{ filter: 'drop-shadow(0 0 4px rgba(229,57,53,0.6))' }} />
      </div>
      {/* Rookie hopping */}
      <div
        className="absolute flex items-center justify-center rr-hop"
        style={{ left: `${rx * cell}%`, top: `${ry * cell}%`, width: `${cell}%`, height: `${cell}%`, transition: 'left 420ms cubic-bezier(.22,1,.36,1), top 420ms cubic-bezier(.22,1,.36,1)' }}
      >
        <div className="shrink-0"><RevengeMarkSvg size={78} ringColor="transparent" /></div>
      </div>
    </div>
  );
}

function ConceptChase() {
  return (
    <div className="min-h-full flex flex-col px-4 pt-11 pb-6" style={{ background: 'linear-gradient(180deg,#dcefff 0%,#eef6fc 40%)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RevengeMarkSvg size={34} />
          <div className="leading-none">
            <div className="text-[13px] font-black text-[#3C3C3C]">Rookie&rsquo;s</div>
            <div className="text-[13px] font-black tracking-tight" style={{ color: REVENGE_RED }}>REVENGE</div>
          </div>
        </div>
        <div className="text-[11px] font-black uppercase tracking-wider text-[#6b7c8a]">Tue, Sep 2</div>
      </div>

      <div className="mt-4 flex items-start gap-2">
        <Bubble tail="bottom">{TAUNTS[3]}</Bubble>
      </div>

      <div className="mt-3"><ChaseBoard /></div>

      <div className="mt-4">
        <Chunky>GO GET HIM</Chunky>
        <div className="mt-2.5"><HuntersLine /></div>
      </div>

      <div className="mt-auto pt-5"><BottomTabs /></div>
    </div>
  );
}

// ── B. VS ────────────────────────────────────────────────────────────────────
function ConceptVs() {
  return (
    <div className="min-h-full flex flex-col relative overflow-hidden" style={{ background: '#1b2a4a', color: '#fff' }}>
      {/* diagonal split */}
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(112deg,#1CB0F6 0%,#1CB0F6 49.5%,#111 50.5%,#111 100%)' }} />
      <div aria-hidden className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(circle at 20% 35%, #fff 0, transparent 40%), radial-gradient(circle at 80% 40%, #E53935 0, transparent 45%)' }} />

      <div className="relative px-4 pt-11">
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] opacity-90">Today&rsquo;s bout</div>
          <div className="text-[12px] font-black uppercase tracking-[0.2em] opacity-90">Round {RUNG}/{RUNGS}</div>
        </div>
      </div>

      {/* fighters */}
      <div className="relative mt-5 h-[300px]">
        <div className="absolute -left-2 top-0 rr-float">
          <RevengeMarkSvg size={215} ringColor="transparent" />
        </div>
        <div className="absolute left-4 bottom-2 text-[26px] font-black leading-none tracking-tight drop-shadow-[0_3px_0_rgba(0,0,0,0.35)]">ROOKIE</div>

        <div className="absolute right-2 top-4 rr-float-slow">
          <div className="relative w-[190px] h-[190px] flex items-center justify-center">
            <span aria-hidden className="select-none" style={{ fontSize: 132, lineHeight: 1, color: '#111', WebkitTextStroke: '2px #fff', filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.5))' }}>♚</span>
            <RevengeReticleSvg size={190} className="absolute inset-0 rr-lock" style={{ opacity: 0.95 }} />
          </div>
        </div>
        <div className="absolute right-4 bottom-2 text-[26px] font-black leading-none tracking-tight text-right drop-shadow-[0_3px_0_rgba(0,0,0,0.5)]" style={{ color: '#fff' }}>THE KING</div>

        {/* VS burst */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-[86px] h-[86px] flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 rr-spin-slow" aria-hidden>
              <polygon points="50,0 61,20 84,12 79,36 100,50 79,64 84,88 61,80 50,100 39,80 16,88 21,64 0,50 21,36 16,12 39,20" fill="#FFC800" stroke="#B8860B" strokeWidth="3" />
            </svg>
            <span className="relative text-[30px] font-black italic tracking-tighter" style={{ color: '#1a1a1a' }}>VS</span>
          </div>
        </div>
      </div>

      <div className="relative px-4 mt-1">
        <Bubble tail="left" dark>{TAUNTS[0]}</Bubble>
      </div>

      <div className="relative px-4 mt-5">
        <Chunky>FIGHT</Chunky>
        <div className="mt-2.5"><HuntersLine dark /></div>
      </div>

      <div className="relative mt-auto px-4 pb-6 pt-5"><BottomTabs dark /></div>
    </div>
  );
}

// ── C. The Hand ──────────────────────────────────────────────────────────────
function ConceptHand() {
  return (
    <div className="min-h-full flex flex-col px-4 pt-11 pb-6" style={{ background: 'linear-gradient(180deg,#eef6fc 0%,#e3f0fb 100%)' }}>
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-wider text-[#6b7c8a]">Tue, Sep 2 · resets in {COUNTDOWN}</div>
        <RevengeMarkSvg size={30} />
      </div>

      <h1 className="mt-5 text-[34px] font-black leading-[0.95] tracking-tight text-[#2A3C45]" style={{ textWrap: 'balance' }}>
        Ten levels.<br />Three powers.<br /><span style={{ color: REVENGE_RED }}>One King.</span>
      </h1>

      <div className="mt-4 flex items-end gap-2">
        <div className="shrink-0 rr-float"><PieceBlocks piece="R" blockSize={5} animate /></div>
        <Bubble tail="left">Pick one when we get there. I already know which.</Bubble>
      </div>

      {/* fanned cards */}
      <div className="relative mt-5 h-[236px]">
        {HAND.map((c, i) => {
          const rot = (i - 1) * 14;
          const dx = (i - 1) * 70;
          return (
            <div
              key={c.id}
              className="absolute left-1/2 bottom-2 rr-deal"
              style={{ transform: `translateX(calc(-50% + ${dx}px)) rotate(${rot}deg)`, transformOrigin: '50% 130%', zIndex: i === 1 ? 2 : 1, animationDelay: `${i * 90}ms` }}
            >
              <div className="w-[136px] rounded-2xl overflow-hidden bg-white p-1.5 shadow-[0_12px_30px_rgba(42,60,69,0.25)] border-2" style={{ borderColor: i === 1 ? REVENGE_RED : '#fff' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/abilities/${c.id}.webp`} alt={c.name} className="w-full aspect-square object-cover rounded-xl" />
                <div className="text-center text-[12px] font-black py-1.5 text-[#2A3C45]">{c.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Chunky>LET&rsquo;S GO</Chunky>
      <div className="mt-2.5"><HuntersLine /></div>

      <div className="mt-auto pt-5"><BottomTabs /></div>
    </div>
  );
}

// ── D. Big Red ───────────────────────────────────────────────────────────────
function ConceptBigRed() {
  return (
    <div className="min-h-full flex flex-col items-center px-4 pt-11 pb-6" style={{ background: '#eef6fc' }}>
      <div className="w-full flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-wider text-[#6b7c8a]">Tue, Sep 2</div>
        <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: REVENGE_RED }}>{COUNTDOWN} left</div>
      </div>

      {/* Rookie peeking over the button */}
      <div className="relative mt-6 w-full flex flex-col items-center">
        <div className="mb-2"><Bubble tail="bottom">{TAUNTS[1]}</Bubble></div>
        <div className="relative z-10 -mb-8 rr-float"><PieceBlocks piece="R" blockSize={7} animate /></div>

        {/* the button */}
        <button
          type="button"
          className="rr-bigpress relative w-[264px] h-[264px] rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 50% 38%, #FF6B6B 0%, ${REVENGE_RED} 55%, ${REVENGE_RED_DARK} 100%)`,
            boxShadow: `0 14px 0 ${REVENGE_RED_DARK}, 0 22px 40px rgba(183,28,28,0.35), inset 0 -8px 0 rgba(0,0,0,0.12), inset 0 6px 0 rgba(255,255,255,0.25)`,
          }}
          aria-label="Start today's run"
        >
          <RevengeReticleSvg size={250} ringColor="rgba(255,255,255,0.22)" className="absolute inset-[7px] rr-spin-slow" />
          <span className="relative text-white font-black text-[40px] leading-none tracking-tight drop-shadow-[0_3px_0_rgba(0,0,0,0.25)]">GO</span>
        </button>
        {/* base plate */}
        <div aria-hidden className="w-[300px] h-[22px] -mt-3 rounded-full" style={{ background: '#2A3C45', boxShadow: '0 5px 0 #17252c' }} />
      </div>

      <div className="mt-6 w-full"><HuntersLine /></div>

      <div className="mt-auto pt-6 w-full"><BottomTabs /></div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function FunHomePage() {
  return (
    <div className="h-full overflow-auto bg-[#f4f7fa] p-6">
      <style>{`
        .rr-press { transition: transform 90ms ease-out, box-shadow 90ms ease-out; }
        .rr-press:active { transform: translateY(4px); box-shadow: 0 1px 0 rgba(0,0,0,0.25) !important; }
        .rr-bigpress { transition: transform 110ms ease-out, box-shadow 110ms ease-out; }
        .rr-bigpress:active { transform: translateY(10px); box-shadow: 0 4px 0 ${REVENGE_RED_DARK}, 0 10px 20px rgba(183,28,28,0.3), inset 0 -8px 0 rgba(0,0,0,0.12) !important; }
        @keyframes rr-lock { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: .75; } }
        .rr-lock { animation: rr-lock 1.4s ease-in-out infinite; transform-origin: 50% 50%; }
        @keyframes rr-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .rr-float { animation: rr-float 2.4s ease-in-out infinite; }
        .rr-float-slow { animation: rr-float 3.4s ease-in-out infinite; }
        @keyframes rr-spin { to { transform: rotate(360deg); } }
        .rr-spin-slow { animation: rr-spin 24s linear infinite; }
        @keyframes rr-hop { 0% { transform: translateY(0) scale(1); } 40% { transform: translateY(-8px) scale(1.06); } 100% { transform: translateY(0) scale(1); } }
        .rr-hop > * { animation: rr-hop 900ms cubic-bezier(.22,1,.36,1) infinite; }
        @keyframes rr-deal { from { opacity: 0; translate: 0 24px; } to { opacity: 1; translate: 0 0; } }
        .rr-deal { animation: rr-deal 420ms cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .rr-lock, .rr-float, .rr-float-slow, .rr-spin-slow, .rr-hop > *, .rr-deal { animation: none !important; }
        }
      `}</style>
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-black text-[#2A3C45]">Rookie&rsquo;s Revenge home · Round 6: FUN</h1>
            <p className="text-[13px] text-[#6b7c8a]">Four one-screen directions. Everything is tappable (press states work). Mock data.</p>
          </div>
          <Link href="/test/revenge-home" className="text-[12px] font-bold text-[#6b7c8a] underline">← earlier rounds</Link>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-6">
          <Phone label="A · The Chase" note="The board IS the home screen. Rookie hops toward the King, the reticle pulses on him. GO drops you straight in.">
            <ConceptChase />
          </Phone>
          <Phone label="B · VS" note="Fighting-game character select. Rookie vs. the King, big and dumb and loud. FIGHT." bg="#1b2a4a" text="#fff">
            <ConceptVs />
          </Phone>
          <Phone label="C · The Hand" note="Today's powers fanned like cards you're about to draw. The loot is the hook.">
            <ConceptHand />
          </Phone>
          <Phone label="D · Big Red" note="One enormous physical button with Rookie peeking over it. Nothing to read, just press it.">
            <ConceptBigRed />
          </Phone>
        </div>
      </div>
    </div>
  );
}
