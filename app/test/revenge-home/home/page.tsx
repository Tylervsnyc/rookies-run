'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { DemoBoard } from '../arena/DemoBoard';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { REVENGE_RED, REVENGE_RED_DARK, RevengeMarkSvg } from '@/components/run/RookiesRevengeLogo';

/**
 * /test/revenge-home/home — ROUND 9: the home SHELL (Tyler's notes, Sep 2).
 * One screen, NO scroll. The live board is the fixed anchor; the four tabs
 * swap what sits under it. Tab bar has a sliding indicator. DAILY REVENGE
 * uses the Chess Path button pattern (flat face, hard bottom shadow, presses
 * flat). Tapping it flips the board to today's run card: theme, 10 levels,
 * the day's 6-power pool, "score counts toward Ranks", then PLAY.
 * Mock data only.
 */

// ── Mock data ────────────────────────────────────────────────────────────────
const COUNTDOWN = '09:41';
const HUNTING = 2318;
const ME = { handle: 'Tylervsnyc', rank: 47, captures: 12 };
const ROWS = [
  { rank: 1, handle: 'kingslayer_ru', captures: 31 },
  { rank: 2, handle: 'pawnstorm', captures: 29 },
  { rank: 3, handle: 'gleasons_gym', captures: 27 },
  { rank: 4, handle: 'moxie.chess', captures: 24 },
  { rank: 5, handle: 'h8_bishops', captures: 22 },
];
const RUNG = 4;
const RUNGS = ['Open Lines', 'Iron Curtain', 'Pincer', 'The X', 'Stone Citadel', 'Iron Veil', 'Two Keys', 'The Crucible', 'Night Court', 'The Throne'];
const TODAY = {
  theme: 'The Crucible',
  blurb: 'Layered pawn walls. Two defended chains. He is behind all of it.',
  powers: ['freeze-ray-1', 'poison-dart-2', 'summon-knight-1', 'boulder-1', 'smoke-1', 'drones-1'],
  powerNames: ['Freeze Ray', 'Poison Dart', 'Summon Knight', 'Boulder', 'Smoke', 'Drones'],
};
const POWERS = { have: 7, total: 18 };
const TROPHIES = { have: 12, total: 54 };

// ── Kit ──────────────────────────────────────────────────────────────────────
const NAVY = '#0f1c3f';
const NAVY_2 = '#182a5c';
const PANEL = '#1c2f63';
const PANEL_EDGE = '#3a4f8f';
const GOLD = '#FFC800';
const OUTLINE: CSSProperties = { color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.45), -1px 0 0 rgba(0,0,0,0.35), 1px 0 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(0,0,0,0.35)' };
const GOLD_TEXT: CSSProperties = { color: GOLD, textShadow: '0 2px 0 rgba(0,0,0,0.5)' };
const TABS = ['Ladder', 'Ranks', 'Revenge', 'Codex'] as const;
type Tab = (typeof TABS)[number];
const TAB_ART: Record<Tab, string> = { Ladder: 'ladder-b', Ranks: 'ranks-a', Revenge: 'revenge-g', Codex: 'codex-a' };

function Panel({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: PANEL, border: `2px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -3px 0 rgba(0,0,0,0.35), 0 6px 14px rgba(0,0,0,0.35)', ...style }}>
      {children}
    </div>
  );
}

/** Chess Path button pattern: flat face, hard bottom shadow, presses flat. */
function CpButton({ children, color = REVENGE_RED, shadow = REVENGE_RED_DARK, depth = 6, className = '', onClick, textColor = '#fff' }: {
  children: ReactNode; color?: string; shadow?: string; depth?: number; className?: string; onClick?: () => void; textColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cp-press w-full rounded-[16px] font-black flex items-center justify-center gap-3 ${className}`}
      style={{ background: color, color: textColor, boxShadow: `0 ${depth}px 0 ${shadow}`, ['--depth' as string]: `${depth}px` }}
    >
      {children}
    </button>
  );
}

function Medal({ rank }: { rank: number }) {
  const bg = rank === 1 ? GOLD : rank === 2 ? '#CFD8DC' : rank === 3 ? '#D08A4E' : 'rgba(255,255,255,0.12)';
  const fg = rank <= 3 ? '#3a2a00' : '#fff';
  return <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0" style={{ background: bg, color: fg, boxShadow: rank <= 3 ? 'inset 0 -2px 0 rgba(0,0,0,0.25)' : undefined }}>{rank}</span>;
}

function Art({ id, size = 44, dim }: { id: string; size?: number; dim?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/abilities/${id}.webp`} alt="" width={size} height={size} className="rounded-lg object-cover shrink-0" style={{ width: size, height: size, filter: dim ? 'grayscale(1) brightness(0.55)' : undefined, boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.4)' }} />
  );
}

// ── The arena: board on the front, today's run card on the back ─────────────
function Arena({ flipped, onBack }: { flipped: boolean; onBack: () => void }) {
  return (
    <div className="relative w-full aspect-square" style={{ perspective: 1200 }}>
      <div className="absolute inset-0 transition-transform duration-[650ms]" style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }}>
        {/* front */}
        <div className="absolute inset-0 rounded-[20px] p-2" style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(180deg,#3d5297 0%,#1b2b5c 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.4), 0 10px 26px rgba(0,0,0,0.45)' }}>
          <div className="rounded-[14px] overflow-hidden h-full" style={{ boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }}><DemoBoard /></div>
        </div>
        {/* back: today's run */}
        <div className="absolute inset-0 rounded-[20px] p-2" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: `linear-gradient(180deg,#5b2030 0%,#2a0f18 100%)`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -4px 0 rgba(0,0,0,0.4), 0 10px 26px rgba(0,0,0,0.45)' }}>
          <div className="rounded-[14px] h-full flex flex-col p-3" style={{ background: 'linear-gradient(180deg,#1c2f63 0%,#0f1c3f 100%)', boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: '#FF6B66' }}>Today&rsquo;s revenge</span>
              <button type="button" onClick={onBack} className="text-[11px] font-black px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>Back</button>
            </div>
            <div className="mt-1.5 text-[24px] font-black leading-none" style={OUTLINE}>{TODAY.theme}</div>
            <div className="mt-1.5 text-[12px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>{TODAY.blurb}</div>
            <div className="mt-2.5 flex items-center gap-3 text-[11px] font-black">
              <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.1)' }}>10 levels</span>
              <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.1)' }}>6 powers</span>
              <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(255,200,0,0.15)', ...GOLD_TEXT }}>Counts toward Ranks</span>
            </div>
            <div className="mt-2.5 text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Today&rsquo;s pool</div>
            <div className="mt-1.5 grid grid-cols-6 gap-1.5">
              {TODAY.powers.map((id, i) => (
                <div key={id} className="flex flex-col items-center gap-1">
                  <Art id={id} size={42} />
                  <span className="text-[8px] font-bold text-center leading-tight" style={{ color: 'rgba(255,255,255,0.75)' }}>{TODAY.powerNames[i]}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <CpButton depth={5} className="min-h-[50px] text-[17px]" color="#58CC02" shadow="#3d8c01">PLAY</CpButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab surrounds ────────────────────────────────────────────────────────────
function RevengeTab({ onGo }: { onGo: () => void }) {
  return (
    <div className="h-full flex flex-col">
      <CpButton onClick={onGo} className="min-h-[70px]">
        <RevengeMarkSvg size={46} ringColor="#fff" />
        <span className="flex flex-col items-start leading-none">
          <span className="text-[24px]" style={{ ...OUTLINE, letterSpacing: '0.02em' }}>DAILY REVENGE</span>
          <span className="text-[12px] font-bold mt-1" style={{ color: '#FFD6D6' }}>Resets in {COUNTDOWN} · you&rsquo;re #{ME.rank} of {HUNTING.toLocaleString()}</span>
        </span>
      </CpButton>

      {/* today's abilities, big */}
      <div className="mt-3.5 flex items-baseline justify-between px-1">
        <span className="text-[14px] font-black" style={OUTLINE}>Today&rsquo;s abilities</span>
        <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>{TODAY.theme}</span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {TODAY.powers.slice(0, 4).map((id, i) => (
          <div key={id} className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-2xl p-1" style={{ background: 'linear-gradient(180deg,#3d5297 0%,#1b2b5c 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.4), 0 5px 12px rgba(0,0,0,0.4)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/abilities/${id}.webp`} alt={TODAY.powerNames[i]} className="w-full h-full object-cover rounded-xl" />
            </div>
            <span className="mt-1.5 text-[11px] font-bold text-center leading-tight" style={{ color: '#fff' }}>{TODAY.powerNames[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LadderTab() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between px-1">
        <span className="text-[13px] font-black" style={OUTLINE}>The Ladder</span>
        <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Rung {RUNG} of 10 · unlocks the Codex</span>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {RUNGS.map((name, i) => {
          const st = i < RUNG - 1 ? 'done' : i === RUNG - 1 ? 'next' : 'locked';
          return (
            <button key={name} type="button" className="cp-press rounded-xl flex flex-col items-center justify-center py-2 gap-1" style={{
              background: st === 'done' ? '#58CC02' : st === 'next' ? REVENGE_RED : '#22305e',
              boxShadow: `0 4px 0 ${st === 'done' ? '#3d8c01' : st === 'next' ? REVENGE_RED_DARK : '#0a1230'}`,
              ['--depth' as string]: '4px', opacity: st === 'locked' ? 0.55 : 1,
            }}>
              <span className="text-[16px] font-black leading-none" style={OUTLINE}>{st === 'done' ? '✓' : i + 1}</span>
              <span className="text-[8px] font-bold leading-tight text-center px-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RanksTab() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between px-1">
        <span className="text-[13px] font-black" style={OUTLINE}>Today&rsquo;s hunters</span>
        <span className="text-[10px] font-black uppercase tracking-wider" style={GOLD_TEXT}>Global</span>
      </div>
      <ul className="mt-1.5">
        {ROWS.map((r) => (
          <li key={r.rank} className="flex items-center gap-2.5 py-[5px] text-[12px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <Medal rank={r.rank} /><span className="flex-1 font-bold truncate">{r.handle}</span>
            <span className="tabular-nums font-black" style={GOLD_TEXT}>{r.captures}<span className="text-[9px] opacity-80"> caps</span></span>
          </li>
        ))}
        <li className="flex items-center gap-2.5 py-[5px] mt-1 text-[12px] font-black rounded-lg px-2 -mx-2" style={{ background: 'rgba(229,57,53,0.28)', border: '1.5px solid rgba(229,57,53,0.6)' }}>
          <Medal rank={ME.rank} /><span className="flex-1 truncate">{ME.handle} (you)</span>
          <span className="tabular-nums" style={GOLD_TEXT}>{ME.captures}<span className="text-[9px] opacity-80"> caps</span></span>
        </li>
      </ul>
    </div>
  );
}

function CodexTab() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between px-1">
        <span className="text-[13px] font-black" style={OUTLINE}>The Codex</span>
        <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Win rungs to fill it</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Panel className="p-3">
          <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>Powers</div>
          <div className="text-[26px] font-black leading-none mt-1" style={GOLD_TEXT}>{POWERS.have}<span className="text-[14px] text-white/60">/{POWERS.total}</span></div>
          <div className="mt-2 flex gap-1">{['freeze-ray-1', 'poison-dart-2', 'summon-knight-1'].map((id) => <Art key={id} id={id} size={30} />)}<Art id="boulder-1" size={30} dim /></div>
        </Panel>
        <Panel className="p-3">
          <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>Trophies</div>
          <div className="text-[26px] font-black leading-none mt-1" style={GOLD_TEXT}>{TROPHIES.have}<span className="text-[14px] text-white/60">/{TROPHIES.total}</span></div>
          <div className="mt-2 h-[30px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)' }}><div className="h-full rounded-full" style={{ width: `${(TROPHIES.have / TROPHIES.total) * 100}%`, background: `linear-gradient(90deg,${GOLD},#F5A800)` }} /></div>
        </Panel>
      </div>
    </div>
  );
}

// ── Tab bar with sliding indicator ───────────────────────────────────────────
function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const i = TABS.indexOf(active);
  return (
    <div className="relative grid grid-cols-4 rounded-2xl p-1" style={{ background: '#0a1230', border: `2px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08)' }}>
      {/* the slider */}
      <div aria-hidden className="absolute top-1 bottom-1 rounded-xl transition-transform duration-300" style={{ left: 4, width: 'calc((100% - 8px) / 4)', transform: `translateX(${i * 100}%)`, transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)', background: 'linear-gradient(180deg,#3d5297,#24397a)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), 0 3px 0 rgba(0,0,0,0.4)' }} />
      {TABS.map((t) => {
        const on = t === active;
        return (
          <button key={t} type="button" onClick={() => onChange(t)} className="relative min-h-[58px] rounded-xl flex flex-col items-center justify-center gap-0.5" aria-pressed={on}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/ui/tabs/${TAB_ART[t]}.webp`} alt="" width={34} height={34} style={{ width: 34, height: 34, transform: on ? 'translateY(-2px) scale(1.12)' : 'none', filter: on ? 'drop-shadow(0 0 6px rgba(255,200,0,0.5))' : 'saturate(0.8) brightness(0.85)', transition: 'transform 200ms cubic-bezier(.22,1,.36,1), filter 200ms' }} />
            <span className="text-[10px] font-black" style={on ? OUTLINE : { color: 'rgba(255,255,255,0.65)' }}>{t}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── The shell ────────────────────────────────────────────────────────────────
function HomeShell() {
  const [tab, setTab] = useState<Tab>('Revenge');
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="h-full flex flex-col px-3 pb-3" style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 60%)` }}>
      {/* HUD: small logo left, username right */}
      <div className="flex items-center justify-between pt-11">
        <div className="flex items-center gap-1.5">
          <RevengeMarkSvg size={26} />
          <span className="text-[12px] font-black leading-none" style={OUTLINE}>Rookie&rsquo;s <span style={{ color: '#FF6B66' }}>REVENGE</span></span>
        </div>
        <div className="rounded-lg px-2.5 py-1" style={{ background: 'rgba(0,0,0,0.3)', border: '1.5px solid rgba(255,255,255,0.12)' }}>
          <span className="text-[11px] font-black" style={OUTLINE}>{ME.handle}</span>
        </div>
      </div>

      {/* the anchor */}
      <div className="mt-3"><Arena flipped={flipped} onBack={() => setFlipped(false)} /></div>

      {/* the surround: fixed height, swaps by tab */}
      <div className="flex-1 min-h-0 mt-3 relative">
        <div key={tab} className="h-full tab-in">
          {tab === 'Revenge' && <RevengeTab onGo={() => setFlipped(true)} />}
          {tab === 'Ladder' && <LadderTab />}
          {tab === 'Ranks' && <RanksTab />}
          {tab === 'Codex' && <CodexTab />}
        </div>
      </div>

      <div className="mt-2"><TabBar active={tab} onChange={(t) => { setTab(t); setFlipped(false); }} /></div>
    </div>
  );
}

function Phone({ children, w, h, label }: { children: ReactNode; w: number; h: number; label: string }) {
  return (
    <div className="shrink-0">
      <div className="mb-2 text-[13px] font-black text-[#2A3C45]">{label}</div>
      <div className="relative rounded-[36px] border-[6px] border-[#1a1a1a] overflow-hidden shadow-xl text-white" style={{ width: w, height: h, background: NAVY }}>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#1a1a1a] z-30" />
        <div className="h-full w-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default function HomeShellPage() {
  return (
    <div className="h-full overflow-auto bg-[#f4f7fa] p-6">
      <style>{`
        .cp-press { transition: transform 80ms ease-out, box-shadow 80ms ease-out; }
        .cp-press:active { transform: translateY(var(--depth, 4px)); box-shadow: 0 0 0 transparent !important; }
        @keyframes tab-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .tab-in { animation: tab-in 220ms cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .tab-in { animation: none; } }
      `}</style>
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-black text-[#2A3C45]">Rookie&rsquo;s Revenge home · Round 9: the shell</h1>
          <p className="text-[13px] text-[#6b7c8a]">One screen, no scroll. Tabs slide. DAILY REVENGE flips the board to today&rsquo;s run. Shown at three phone sizes.</p>
        </div>
        <Link href="/test/revenge-home/arena" className="text-[12px] font-bold text-[#6b7c8a] underline">← round 8 (arena)</Link>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-6 items-start">
        <Phone w={360} h={780} label="Small phone · 360×780"><HomeShell /></Phone>
        <Phone w={393} h={852} label="iPhone 15 · 393×852"><HomeShell /></Phone>
        <Phone w={430} h={932} label="iPhone 15 Pro Max · 430×932"><HomeShell /></Phone>
      </div>
    </div>
  );
}
