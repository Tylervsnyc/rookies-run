'use client';

import { type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { DemoBoard } from './DemoBoard';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { REVENGE_RED, RevengeMarkSvg } from '@/components/run/RookiesRevengeLogo';

/**
 * /test/revenge-home/arena — ROUND 8: the Clash Royale home screen.
 * Game-grade UI: HUD bar on top, the LIVE board as the arena (real RunBoard
 * running a scripted loop — freeze, poison, summon, moves, the King fleeing
 * with the bullseye on him), a huge DAILY REVENGE button, a tab bar. Five
 * takes on what sits around the arena.
 *   J. Arena       — the canonical layout. Ribbon, framed board, top-3 strip.
 *   K. Trophy Road — a reward road under the board; the next rung glows.
 *   L. Power Slots — three power slots under the board (ready / unlocking / locked).
 *   M. Ranks       — leaderboard-forward; the board is the header art.
 *   N. Night Match — stadium lights, scoreboard sign, "you vs. the King" strip.
 * Mock data only.
 */

// ── Mock data ────────────────────────────────────────────────────────────────
const COUNTDOWN = '09:41';
const HUNTING = 2318;
const ME = { handle: 'Tylervsnyc', rank: 47, captures: 12, trophies: 1284, streak: 6 };
const ROWS = [
  { rank: 1, handle: 'kingslayer_ru', captures: 31 },
  { rank: 2, handle: 'pawnstorm', captures: 29 },
  { rank: 3, handle: 'gleasons_gym', captures: 27 },
  { rank: 4, handle: 'moxie.chess', captures: 24 },
  { rank: 5, handle: 'h8_bishops', captures: 22 },
];
const RUNG = 4;
const ROAD = [
  { rung: 1, art: 'surge-1', name: 'Surge' },
  { rung: 2, art: 'freeze-ray-1', name: 'Freeze Ray' },
  { rung: 3, art: 'poison-dart-2', name: 'Poison Dart' },
  { rung: 4, art: 'summon-knight-1', name: 'Summon Knight' },
  { rung: 5, art: 'boulder-1', name: 'Boulder' },
  { rung: 6, art: 'drones-1', name: 'Drones' },
];
const SLOTS = [
  { art: 'freeze-ray-1', name: 'Freeze Ray', state: 'ready' as const },
  { art: 'summon-knight-1', name: 'Summon Knight', state: 'unlocking' as const, note: '2 levels' },
  { art: 'boulder-1', name: 'Boulder', state: 'locked' as const, note: 'Rung 5' },
];

// ── Arena UI kit ─────────────────────────────────────────────────────────────
const NAVY = '#0f1c3f';
const NAVY_2 = '#182a5c';
const PANEL = '#1c2f63';
const PANEL_EDGE = '#3a4f8f';
const GOLD = '#FFC800';
const GOLD_DARK = '#B8860B';
/** Game-UI text: white with a dark outline. */
const OUTLINE: CSSProperties = { color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.45), -1px 0 0 rgba(0,0,0,0.35), 1px 0 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(0,0,0,0.35)' };
const GOLD_TEXT: CSSProperties = { color: GOLD, textShadow: '0 2px 0 rgba(0,0,0,0.5)' };

function Phone({ children, label, note, bg = NAVY }: { children: ReactNode; label: string; note: string; bg?: string }) {
  return (
    <div className="shrink-0 w-[360px]">
      <div className="mb-2 px-1">
        <div className="text-[15px] font-black text-[#2A3C45]">{label}</div>
        <div className="text-[12px] text-[#6b7c8a] leading-snug">{note}</div>
      </div>
      <div className="relative w-[360px] h-[760px] rounded-[36px] border-[6px] border-[#1a1a1a] overflow-hidden shadow-xl text-white" style={{ background: bg }}>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#1a1a1a] z-30" />
        <div className="h-full w-full overflow-auto">{children}</div>
      </div>
    </div>
  );
}

/** Bevelled game panel: lit top edge, dark bottom edge. */
function Panel({ children, className = '', style, tone = PANEL }: { children: ReactNode; className?: string; style?: CSSProperties; tone?: string }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: tone, border: `2px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -3px 0 rgba(0,0,0,0.35), 0 6px 14px rgba(0,0,0,0.35)', ...style }}
    >
      {children}
    </div>
  );
}

/** The arena frame around the live board. */
function Arena({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[20px] p-2 ${className}`} style={{ background: 'linear-gradient(180deg,#3d5297 0%,#1b2b5c 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.4), 0 10px 26px rgba(0,0,0,0.45)' }}>
      <div className="rounded-[14px] overflow-hidden" style={{ boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }}>{children}</div>
    </div>
  );
}

/** The big one. Revenge red, gold rim, hard bottom, glossy top edge. */
function RevengeButton({ label = 'DAILY REVENGE', sub }: { label?: string; sub?: string }) {
  return (
    <button
      type="button"
      className="rr-press rr-glow relative w-full min-h-[66px] rounded-[16px] flex items-center justify-center gap-3 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #FF6B66 0%, ${REVENGE_RED} 38%, #D32F2F 100%)`,
        border: '2.5px solid #7f1414',
        boxShadow: `0 7px 0 #8E1B1B, 0 7px 0 2.5px #4a0a0a, 0 16px 26px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -3px 0 rgba(0,0,0,0.18)`,
      }}
    >
      {/* gloss sweep */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0))' }} />
      <RevengeMarkSvg size={30} ringColor="#fff" />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[22px] font-black tracking-wide" style={{ ...OUTLINE, letterSpacing: '0.02em' }}>{label}</span>
        {sub && <span className="text-[11px] font-bold mt-1" style={{ color: '#FFD6D6' }}>{sub}</span>}
      </span>
    </button>
  );
}

function Trophy({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M7 3h10v3h3v3a5 5 0 0 1-4 4.9A5 5 0 0 1 13 17v2h3v2H8v-2h3v-2a5 5 0 0 1-3-3.1A5 5 0 0 1 4 9V6h3V3zm0 5H6v1a3 3 0 0 0 1.2 2.4A6 6 0 0 1 7 10V8zm10 0v2c0 .5-.1.9-.2 1.4A3 3 0 0 0 18 9V8h-1z" fill={GOLD} stroke="#7a5a00" strokeWidth="0.8" />
    </svg>
  );
}

/** Top HUD: avatar tile + handle, trophies, streak, countdown. */
function Hud({ right }: { right?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 pt-11">
      <div className="flex items-center gap-2 rounded-xl pl-1 pr-3 py-1" style={{ background: 'rgba(0,0,0,0.3)', border: '1.5px solid rgba(255,255,255,0.12)' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#fff' }}><BreathingRook size="xs" animate={false} mood="neutral" /></div>
        <div className="leading-tight">
          <div className="text-[12px] font-black" style={OUTLINE}>{ME.handle}</div>
          <div className="flex items-center gap-1 text-[11px] font-black" style={GOLD_TEXT}><Trophy size={12} />{ME.trophies.toLocaleString()}</div>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        {right ?? (
          <div className="rounded-xl px-2.5 py-1.5 text-[11px] font-black tabular-nums" style={{ background: 'rgba(0,0,0,0.3)', border: '1.5px solid rgba(255,255,255,0.12)', ...GOLD_TEXT }}>
            {COUNTDOWN}
          </div>
        )}
      </div>
    </div>
  );
}

/** Ribbon banner. */
function Ribbon({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-fit -mb-3 z-10">
      <div className="px-5 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-[0.14em]" style={{ background: `linear-gradient(180deg, ${GOLD} 0%, #F5A800 100%)`, color: '#5a3d00', boxShadow: `0 3px 0 ${GOLD_DARK}, 0 6px 12px rgba(0,0,0,0.4)` }}>
        {children}
      </div>
    </div>
  );
}

const TABS = ['Ladder', 'Ranks', 'Revenge', 'Codex'] as const;
/** Generated game-UI icons (gpt-image-1, public/ui/tabs). Swap the file to try the other candidate. */
const TAB_ART: Record<(typeof TABS)[number], string> = { Ladder: 'ladder-a', Ranks: 'ranks-a', Revenge: 'revenge-b', Codex: 'codex-a' };
function TabIcon({ name, active }: { name: (typeof TABS)[number]; active: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/ui/tabs/${TAB_ART[name]}.webp`} alt="" width={34} height={34} style={{ width: active ? 38 : 32, height: active ? 38 : 32, filter: active ? 'drop-shadow(0 0 6px rgba(255,200,0,0.55))' : 'saturate(0.85) brightness(0.9)', transition: 'width 150ms, height 150ms' }} />
  );
}
function TabBar({ active = 'Revenge' }: { active?: (typeof TABS)[number] }) {
  return (
    <div className="mt-auto px-2 pb-3 pt-2">
      <div className="grid grid-cols-4 gap-1 rounded-2xl p-1" style={{ background: '#0a1230', border: `2px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08)' }}>
        {TABS.map((t) => {
          const on = t === active;
          return (
            <button key={t} type="button" className="rr-press min-h-[54px] rounded-xl flex flex-col items-center justify-center gap-0.5" style={on ? { background: `linear-gradient(180deg,#3d5297,#24397a)`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), 0 3px 0 rgba(0,0,0,0.4)', transform: 'translateY(-6px)' } : undefined}>
              <TabIcon name={t} active={on} />
              <span className="text-[10px] font-black" style={on ? OUTLINE : { color: 'rgba(255,255,255,0.7)' }}>{t}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Medal({ rank }: { rank: number }) {
  const bg = rank === 1 ? GOLD : rank === 2 ? '#CFD8DC' : rank === 3 ? '#D08A4E' : 'rgba(255,255,255,0.12)';
  const fg = rank <= 3 ? '#3a2a00' : '#fff';
  return <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0" style={{ background: bg, color: fg, boxShadow: rank <= 3 ? 'inset 0 -2px 0 rgba(0,0,0,0.25)' : undefined }}>{rank}</span>;
}
function RankRows({ rows, me = true }: { rows: typeof ROWS; me?: boolean }) {
  return (
    <ul>
      {rows.map((r) => (
        <li key={r.rank} className="flex items-center gap-2.5 py-[6px] text-[13px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Medal rank={r.rank} />
          <span className="flex-1 font-bold truncate">{r.handle}</span>
          <span className="tabular-nums font-black" style={GOLD_TEXT}>{r.captures}<span className="text-[10px] opacity-80"> caps</span></span>
        </li>
      ))}
      {me && (
        <li className="flex items-center gap-2.5 py-[6px] mt-1 text-[13px] font-black rounded-lg px-2 -mx-2" style={{ background: 'rgba(229,57,53,0.28)', border: '1.5px solid rgba(229,57,53,0.6)' }}>
          <Medal rank={ME.rank} />
          <span className="flex-1 truncate">{ME.handle} (you)</span>
          <span className="tabular-nums" style={GOLD_TEXT}>{ME.captures}<span className="text-[10px] opacity-80"> caps</span></span>
        </li>
      )}
    </ul>
  );
}

function Art({ id, size = 56, dim }: { id: string; size?: number; dim?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/abilities/${id}.webp`} alt="" width={size} height={size} className="rounded-xl object-cover shrink-0" style={{ width: size, height: size, filter: dim ? 'grayscale(1) brightness(0.55)' : undefined, boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.4)' }} />
  );
}

// ── J. Arena ─────────────────────────────────────────────────────────────────
function ConceptArena() {
  return (
    <div className="min-h-full flex flex-col" style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 60%)` }}>
      <Hud />
      <div className="px-3 mt-4">
        <Ribbon>Today&rsquo;s hunt</Ribbon>
        <Arena><DemoBoard /></Arena>
        <div className="flex items-center justify-between mt-2 px-1 text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <span>{HUNTING.toLocaleString()} hunting today</span>
          <span>Resets in <span className="tabular-nums" style={GOLD_TEXT}>{COUNTDOWN}</span></span>
        </div>
      </div>
      <div className="px-3 mt-3"><RevengeButton sub="10 levels · 1 King" /></div>
      <div className="px-3 mt-3">
        <Panel className="px-3 py-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-black" style={OUTLINE}>Top hunters</span>
            <span className="text-[11px] font-black" style={GOLD_TEXT}>You&rsquo;re #{ME.rank}</span>
          </div>
          <RankRows rows={ROWS.slice(0, 3)} me={false} />
        </Panel>
      </div>
      <TabBar />
    </div>
  );
}

// ── K. Trophy Road ───────────────────────────────────────────────────────────
function ConceptRoad() {
  return (
    <div className="min-h-full flex flex-col" style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 60%)` }}>
      <Hud right={<div className="rounded-xl px-2.5 py-1.5 text-[11px] font-black" style={{ background: 'rgba(0,0,0,0.3)', border: '1.5px solid rgba(255,255,255,0.12)', ...GOLD_TEXT }}>#{ME.rank} of {HUNTING.toLocaleString()}</div>} />
      <div className="px-3 mt-4"><Arena><DemoBoard /></Arena></div>
      <div className="px-3 mt-3"><RevengeButton sub={`Resets in ${COUNTDOWN}`} /></div>

      {/* the road */}
      <div className="mt-4">
        <div className="px-4 flex items-baseline justify-between">
          <span className="text-[12px] font-black" style={OUTLINE}>Trophy road</span>
          <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Rung {RUNG} of 10</span>
        </div>
        <div className="relative mt-2 overflow-x-auto px-4 pb-1">
          <div aria-hidden className="absolute left-4 right-0 top-[38px] h-[6px] rounded-full" style={{ background: 'rgba(0,0,0,0.45)' }} />
          <div aria-hidden className="absolute left-4 top-[38px] h-[6px] rounded-full" style={{ width: `${(RUNG - 1) * 84 + 30}px`, background: `linear-gradient(90deg,#58CC02,#8BE83A)` }} />
          <div className="relative flex gap-3 w-max">
            {ROAD.map((r) => {
              const st = r.rung < RUNG ? 'done' : r.rung === RUNG ? 'next' : 'locked';
              return (
                <div key={r.rung} className="flex flex-col items-center w-[72px]">
                  <div className="relative rounded-2xl p-1" style={{ background: st === 'next' ? `linear-gradient(180deg,${GOLD},#F5A800)` : st === 'done' ? '#58CC02' : '#22305e', boxShadow: st === 'next' ? `0 0 0 3px rgba(255,200,0,0.35), 0 4px 0 ${GOLD_DARK}` : '0 4px 0 rgba(0,0,0,0.4)' }}>
                    <Art id={r.art} size={60} dim={st === 'locked'} />
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md text-[10px] font-black" style={{ background: st === 'locked' ? '#0a1230' : '#fff', color: st === 'done' ? '#2e7d0a' : st === 'next' ? '#7a4a00' : 'rgba(255,255,255,0.6)' }}>{st === 'done' ? 'WON' : r.rung}</span>
                  </div>
                  <span className="mt-3 text-[10px] font-bold text-center leading-tight" style={{ color: st === 'locked' ? 'rgba(255,255,255,0.45)' : '#fff' }}>{r.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <TabBar />
    </div>
  );
}

// ── L. Power Slots ───────────────────────────────────────────────────────────
function ConceptSlots() {
  return (
    <div className="min-h-full flex flex-col" style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 60%)` }}>
      <Hud />
      <div className="px-3 mt-4">
        <Ribbon>Today&rsquo;s hunt · {COUNTDOWN}</Ribbon>
        <Arena><DemoBoard /></Arena>
      </div>
      <div className="px-3 mt-3"><RevengeButton /></div>

      {/* next unlocks on the Ladder */}
      <div className="px-4 mt-3 flex items-baseline justify-between">
        <span className="text-[12px] font-black" style={OUTLINE}>Next powers</span>
        <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Won on the Ladder</span>
      </div>
      <div className="px-3 mt-1.5 grid grid-cols-3 gap-2">
        {SLOTS.map((s) => (
          <Panel key={s.name} className="p-2 flex flex-col items-center text-center" tone={s.state === 'ready' ? '#26407f' : PANEL} style={s.state === 'ready' ? { borderColor: GOLD, boxShadow: `0 0 0 3px rgba(255,200,0,0.25), inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -3px 0 rgba(0,0,0,0.35)` } : undefined}>
            <Art id={s.art} size={62} dim={s.state === 'locked'} />
            <span className="mt-1.5 text-[11px] font-black leading-tight" style={OUTLINE}>{s.name}</span>
            <span className="mt-1 px-2 py-0.5 rounded-md text-[10px] font-black" style={s.state === 'ready' ? { background: GOLD, color: '#5a3d00' } : { background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.7)' }}>
              {s.state === 'ready' ? 'READY' : s.state === 'unlocking' ? `IN ${s.note}` : s.note}
            </span>
          </Panel>
        ))}
      </div>
      <div className="px-3 mt-3">
        <Panel className="px-3 py-2 flex items-center gap-3">
          <Medal rank={ME.rank} />
          <span className="text-[12px] font-bold flex-1">You&rsquo;re #{ME.rank} of {HUNTING.toLocaleString()} today</span>
          <span className="text-[11px] font-black" style={GOLD_TEXT}>Ranks ›</span>
        </Panel>
      </div>
      <TabBar />
    </div>
  );
}

// ── M. Ranks ─────────────────────────────────────────────────────────────────
function ConceptRanks() {
  return (
    <div className="min-h-full flex flex-col" style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 60%)` }}>
      <Hud />
      <div className="px-3 mt-4"><Arena><DemoBoard /></Arena></div>
      <div className="px-3 mt-3"><RevengeButton sub={`${HUNTING.toLocaleString()} hunting · resets in ${COUNTDOWN}`} /></div>
      <div className="px-3 mt-3">
        <Panel className="px-3 py-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] font-black" style={OUTLINE}>Today&rsquo;s hunters</span>
            <span className="text-[10px] font-black uppercase tracking-wider" style={GOLD_TEXT}>Global</span>
          </div>
          <RankRows rows={ROWS} />
        </Panel>
      </div>
      <TabBar active="Ranks" />
    </div>
  );
}

// ── N. Night Match ───────────────────────────────────────────────────────────
function ConceptNight() {
  return (
    <div className="min-h-full flex flex-col relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 0%, #2a3f80 0%, #0b1330 60%)' }}>
      {/* stadium beams */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'conic-gradient(from 200deg at 15% -10%, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.09) 12deg, rgba(255,255,255,0) 24deg), conic-gradient(from 130deg at 85% -10%, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.09) 12deg, rgba(255,255,255,0) 24deg)' }} />
      <Hud />
      {/* scoreboard sign */}
      <div className="relative mx-3 mt-3 rounded-xl px-3 py-2 flex items-center justify-between" style={{ background: '#0a1230', border: `2px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), 0 4px 0 rgba(0,0,0,0.4)' }}>
        <span className="text-[11px] font-black uppercase tracking-[0.14em]" style={{ color: '#FF5F5B' }}>Live</span>
        <span className="text-[12px] font-black tabular-nums" style={OUTLINE}>{HUNTING.toLocaleString()} hunting</span>
        <span className="text-[12px] font-black tabular-nums" style={GOLD_TEXT}>{COUNTDOWN}</span>
      </div>
      <div className="relative px-3 mt-3"><Arena><DemoBoard /></Arena></div>

      {/* you vs the king */}
      <div className="relative px-3 mt-3 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-xl p-1.5" style={{ background: 'rgba(28,176,246,0.18)', border: '1.5px solid rgba(28,176,246,0.5)' }}>
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center"><BreathingRook size="xs" animate={false} mood="neutral" /></div>
          <div className="leading-tight"><div className="text-[11px] font-black" style={OUTLINE}>{ME.handle}</div><div className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>#{ME.rank} · streak {ME.streak}</div></div>
        </div>
        <span className="text-[16px] font-black italic" style={GOLD_TEXT}>VS</span>
        <div className="flex-1 flex items-center gap-2 justify-end rounded-xl p-1.5" style={{ background: 'rgba(229,57,53,0.18)', border: '1.5px solid rgba(229,57,53,0.5)' }}>
          <div className="leading-tight text-right"><div className="text-[11px] font-black" style={OUTLINE}>The King</div><div className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>10 levels deep</div></div>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[24px] leading-none" style={{ background: '#1a1a1a', color: '#fff' }}>♚</div>
        </div>
      </div>
      <div className="relative px-3 mt-3"><RevengeButton /></div>
      <div className="relative px-3 mt-3">
        <Panel className="px-3 py-2"><RankRows rows={ROWS.slice(0, 3)} me={false} /></Panel>
      </div>
      <TabBar />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ArenaHomePage() {
  return (
    <div className="h-full overflow-auto bg-[#f4f7fa] p-6">
      <style>{`
        .rr-press { transition: transform 90ms ease-out, box-shadow 90ms ease-out; }
        .rr-press:active { transform: translateY(5px) !important; box-shadow: 0 1px 0 rgba(0,0,0,0.35) !important; }
        @keyframes rr-glow { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.08); } }
        .rr-glow { animation: rr-glow 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .rr-glow { animation: none; } }
      `}</style>
      <div className="max-w-[2000px] mx-auto">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-black text-[#2A3C45]">Rookie&rsquo;s Revenge home · Round 8: ARENA</h1>
            <p className="text-[13px] text-[#6b7c8a]">Clash-style. The board is the real game board running a 16s loop: freeze ray, poison dart, summoned knight, Rookie closing in, the King fleeing under the bullseye. Mock data.</p>
          </div>
          <Link href="/test/revenge-home/layers" className="text-[12px] font-bold text-[#6b7c8a] underline">← round 7 (layers)</Link>
        </div>
        <div className="mb-5 flex items-center gap-3 rounded-2xl p-3 w-fit" style={{ background: PANEL }}>
          <span className="text-[12px] font-black text-white mr-1">Icon candidates</span>
          {['ladder-a', 'ladder-b', 'ranks-a', 'ranks-b', 'revenge-a', 'revenge-b', 'codex-a', 'codex-b'].map((n) => (
            <div key={n} className="flex flex-col items-center gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/ui/tabs/${n}.webp`} alt={n} width={56} height={56} style={{ outline: Object.values(TAB_ART).includes(n) ? `3px solid ${GOLD}` : 'none', borderRadius: 10 }} />
              <span className="text-[10px] font-bold text-white/70">{n}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-8 overflow-x-auto pb-6">
          <Phone label="J · Arena" note="The canonical Clash layout: HUD, ribbon, framed live board, DAILY REVENGE, top-3 strip, tab bar."><ConceptArena /></Phone>
          <Phone label="K · Trophy Road" note="A reward road under the board. Won rungs are green, the next one glows gold, the rest are dimmed art."><ConceptRoad /></Phone>
          <Phone label="L · Power Slots" note="Three power slots like chest slots: one READY, one unlocking in two levels, one locked behind rung 5."><ConceptSlots /></Phone>
          <Phone label="M · Ranks" note="Leaderboard-forward. Full top five with medals and your row, board as the header art."><ConceptRanks /></Phone>
          <Phone label="N · Night Match" note="Stadium beams, a live scoreboard sign, a you-vs-the-King strip under the board." bg="#0b1330"><ConceptNight /></Phone>
        </div>
      </div>
    </div>
  );
}
