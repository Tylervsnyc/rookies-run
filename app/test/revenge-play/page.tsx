'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { DemoBoard } from '@/components/run/DemoBoard';
import { REVENGE_RED, REVENGE_RED_DARK, RevengeMarkSvg } from '@/components/run/RookiesRevengeLogo';
import { artFile } from '@/components/run/AbilityCard';
import { ABILITY_DEFS, type AbilityId } from '@/lib/run/abilities';
import { TrophyGlyph } from '@/components/run/AchievementToast';

/**
 * MOCK — Revenge play-page restyle (Tyler 2026-09-03: "I love the layout of
 * everything, just mainly the background color… the little rules at the top
 * we'll probably have to take"). Same layout as app/page.tsx, Arena palette,
 * no RulesInline. Plus the between-level popup and three tab-bar options.
 */

// ── Arena kit (copied from ArenaHome, not shared on purpose — this is a mock) ─
const NAVY = '#0f1c3f';
const NAVY_2 = '#182a5c';
const PANEL = '#1c2f63';
const PANEL_EDGE = '#3a4f8f';
const GOLD = '#FFC800';
const GREEN = '#58CC02';
const GREEN_DARK = '#3d8c01';
const OUTLINE: CSSProperties = { color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.45), -1px 0 0 rgba(0,0,0,0.35), 1px 0 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(0,0,0,0.35)' };
const GOLD_TEXT: CSSProperties = { color: GOLD, textShadow: '0 2px 0 rgba(0,0,0,0.5)' };
const FRAME: CSSProperties = { background: 'linear-gradient(180deg,#3d5297 0%,#1b2b5c 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.4), 0 10px 26px rgba(0,0,0,0.45)' };
const PANEL_STYLE: CSSProperties = { background: PANEL, border: `2px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -3px 0 rgba(0,0,0,0.35), 0 4px 10px rgba(0,0,0,0.35)' };
const MUTED: CSSProperties = { color: 'rgba(255,255,255,0.6)' };

function Chip({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1.5 leading-none ${className}`} style={{ ...PANEL_STYLE, ...style }}>{children}</div>;
}

function CpButton({ children, color = REVENGE_RED, shadow = REVENGE_RED_DARK, depth = 6, className = '' }: { children: ReactNode; color?: string; shadow?: string; depth?: number; className?: string }) {
  return (
    <button type="button" className={`w-full rounded-[16px] font-black flex items-center justify-center gap-3 active:translate-y-[4px] active:shadow-none transition-transform ${className}`} style={{ background: color, color: '#fff', boxShadow: `0 ${depth}px 0 ${shadow}` }}>
      {children}
    </button>
  );
}

function Phone({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-sm font-black uppercase tracking-[0.18em]" style={GOLD_TEXT}>{label}</div>
      <div className="relative overflow-hidden rounded-[36px]" style={{ width: 390, height: 800, border: '10px solid #06091a', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', background: NAVY }}>
        {children}
      </div>
    </div>
  );
}

// ── Static game bits ─────────────────────────────────────────────────────────
const RACK: { id: AbilityId; tier: number; uses: number; max: number }[] = [
  { id: 'knight-hop', tier: 2, uses: 1, max: 1 },
  { id: 'rewind', tier: 1, uses: 1, max: 1 },
  { id: 'bishop-step', tier: 1, uses: 0, max: 1 },
];

function RackCard({ id, tier, uses, max }: { id: AbilityId; tier: number; uses: number; max: number }) {
  const spent = uses === 0;
  return (
    <div className="rounded-[12px] p-[3px]" style={{ width: 100, background: 'linear-gradient(135deg,#b8852b,#6a4612 30%,#ffd87a 60%,#b8852b)', boxShadow: '0 5px 12px rgba(0,0,0,0.45)', opacity: spent ? 0.45 : 1, filter: spent ? 'grayscale(0.7)' : undefined }}>
      <div className="rounded-[9px] overflow-hidden flex flex-col" style={{ background: '#f6e7c5' }}>
        <div className="text-[9px] font-black text-center py-[3px] uppercase tracking-wide" style={{ color: '#3d2806' }}>{ABILITY_DEFS[id].name}</div>
        <div className="relative" style={{ height: 78, background: 'radial-gradient(ellipse at center,#ffe9a8 0%,#d49a2a 100%)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/abilities/${artFile(id)}`} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        </div>
        <div className="flex items-center justify-between px-1.5 py-[3px]">
          <div className="flex gap-0.5">{Array.from({ length: max }).map((_, i) => <span key={i} className="w-2 h-2 rounded-full" style={{ background: i < uses ? '#3d2806' : 'rgba(61,40,6,0.25)' }} />)}</div>
          <span className="text-[9px] font-black" style={{ color: '#3d2806' }}>T{tier}</span>
        </div>
      </div>
    </div>
  );
}

function PlayScreen({ dim = false }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col text-white" style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 60%)`, filter: dim ? 'brightness(0.45)' : undefined }}>
      <div className="px-3 pt-4 pb-3 flex flex-col gap-2.5">
        {/* header — same slots as the real page, minus the rules strip */}
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5 pt-1">
            <RevengeMarkSvg size={30} />
            <span className="text-[13px] font-black leading-none" style={OUTLINE}>Rookie&rsquo;s <span style={{ color: '#FF6B66' }}>REVENGE</span></span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5">
              <Chip className="w-8 h-8 !px-0 justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)" aria-hidden><path d="M9 18V6l10-2v12" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></svg></Chip>
              <Chip className="w-8 h-8 !px-0 justify-center"><TrophyGlyph size={16} color={GOLD} /></Chip>
              <Chip><span className="text-[9px] font-black uppercase tracking-[0.14em]" style={MUTED}>Lvl</span><span className="text-sm font-black tabular-nums" style={GOLD_TEXT}>3<span style={{ color: 'rgba(255,255,255,0.45)' }}>/10</span></span></Chip>
            </div>
            <div className="flex items-center gap-1.5">
              <Chip className="!py-1"><span className="text-[10px] font-black tabular-nums" style={MUTED}>1:42</span></Chip>
              <Chip className="!py-1"><span className="text-[9px] font-black uppercase tracking-[0.14em]" style={MUTED}>Normal</span></Chip>
              <Chip className="!py-1"><span className="text-sm font-black tabular-nums" style={OUTLINE}>6</span><span className="text-[9px] font-black uppercase tracking-[0.14em]" style={MUTED}>moves</span></Chip>
            </div>
          </div>
        </header>

        {/* tempo bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg px-2.5 py-1.5 flex items-center gap-2.5" style={PANEL_STYLE}>
            <span className="text-[10px] font-black uppercase tracking-[0.14em] leading-none" style={MUTED}>Tempo</span>
            <div className="flex items-baseline gap-0.5"><span className="text-sm font-black tabular-nums leading-none" style={GOLD_TEXT}>5</span><span className="text-[10px] font-bold leading-none" style={{ color: 'rgba(255,255,255,0.45)' }}>/8</span></div>
            <div className="flex-1 flex gap-0.5">{Array.from({ length: 8 }).map((_, i) => <span key={i} className="flex-1 h-2 rounded-sm" style={{ background: i < 5 ? GOLD : 'rgba(0,0,0,0.35)', boxShadow: i < 5 ? '0 0 6px rgba(255,200,0,0.5)' : undefined }} />)}</div>
            <span className="text-xs font-black leading-none" style={OUTLINE}>Rook</span>
          </div>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black" style={{ background: 'rgba(255,255,255,0.1)', ...MUTED }}>?</div>
        </div>

        {/* board in the home's gold-ish frame */}
        <div className="rounded-[20px] p-2" style={FRAME}>
          <div className="rounded-[14px] overflow-hidden" style={{ boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }}><DemoBoard reticle={false} paused={dim} /></div>
        </div>

        {/* rack */}
        <div className="flex justify-center gap-2.5 pt-1">
          {RACK.map((a) => <RackCard key={a.id} {...a} />)}
          <div className="rounded-[12px] flex items-center justify-center" style={{ width: 100, border: `2px dashed ${PANEL_EDGE}`, background: 'rgba(0,0,0,0.2)' }}><span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Empty</span></div>
        </div>
        <div className="text-center text-[11px] font-bold" style={MUTED}>Fill tempo to claim a power</div>
      </div>
    </div>
  );
}

// ── Popups ───────────────────────────────────────────────────────────────────
function ClearedModal() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-5" style={{ background: 'rgba(0,0,0,0.35)' }}>
      <div className="w-full rounded-[22px] p-[3px]" style={{ background: 'linear-gradient(180deg,#5b2030 0%,#2a0f18 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), 0 16px 40px rgba(0,0,0,0.6)' }}>
        <div className="rounded-[19px] p-5 text-center" style={{ background: 'linear-gradient(180deg,#1c2f63 0%,#0f1c3f 100%)', boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }}>
          <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#FF6B66' }}>The Fortress</div>
          <div className="mt-1 text-[22px] font-black uppercase tracking-wide" style={OUTLINE}>Cleared!</div>
          <div className="mt-2 flex items-baseline justify-center gap-2">
            <div className="text-[64px] leading-none font-black uppercase tracking-tight" style={GOLD_TEXT}>Level 4</div>
            <div className="text-base font-black" style={{ color: 'rgba(255,255,255,0.45)' }}>of 10</div>
          </div>
          <p className="mt-3 text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>He moved his whole court for you. Rude.</p>
          <div className="mt-5"><CpButton color={GREEN} shadow={GREEN_DARK} className="min-h-[54px] text-[18px]"><span style={OUTLINE}>NEXT LEVEL</span></CpButton></div>
        </div>
      </div>
    </div>
  );
}

function LostModal() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-5" style={{ background: 'rgba(0,0,0,0.35)' }}>
      <div className="w-full rounded-[22px] p-[3px]" style={{ background: 'linear-gradient(180deg,#5b2030 0%,#2a0f18 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), 0 16px 40px rgba(0,0,0,0.6)' }}>
        <div className="rounded-[19px] p-5 text-center" style={{ background: 'linear-gradient(180deg,#1c2f63 0%,#0f1c3f 100%)', boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }}>
          <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#FF6B66' }}>Level 5 · The Fortress</div>
          <div className="mt-1 text-[40px] leading-none font-black uppercase tracking-tight" style={{ color: '#FF6B66', textShadow: '0 2px 0 rgba(0,0,0,0.5)' }}>Captured</div>
          <p className="mt-3 text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>The bishop got her. This is fine. This is completely fine.</p>
          <div className="mt-2 flex items-center justify-center gap-2 text-[11px] font-black">
            <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.1)' }}>2 retries left</span>
            <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(255,200,0,0.15)', ...GOLD_TEXT }}>4 captures</span>
          </div>
          <div className="mt-5 flex flex-col gap-2.5">
            <CpButton className="min-h-[54px] text-[18px]"><span style={OUTLINE}>RETRY LEVEL</span></CpButton>
            <button type="button" className="min-h-[40px] text-[12px] font-black" style={MUTED}>Give up the run</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab bar options ──────────────────────────────────────────────────────────
const TABS = ['Ladder', 'Ranks', 'Revenge', 'Codex'] as const;
type Tab = (typeof TABS)[number];
const TAB_ART: Record<Tab, string> = { Ladder: 'ladder-b', Ranks: 'ranks-a', Revenge: 'revenge-g', Codex: 'codex-a' };

function Icon({ t, size, on }: { t: Tab; size: number; on: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/ui/tabs/${TAB_ART[t]}.webp`} alt="" width={size} height={size} style={{ width: size, height: size, filter: on ? 'drop-shadow(0 0 8px rgba(255,200,0,0.6))' : 'saturate(0.5) brightness(0.6)', transition: 'filter 200ms, transform 200ms' }} />;
}

/** A — big icons, gold pill on the active tab, labels only on the active tab. */
function TabBarA() {
  const [active, setActive] = useState<Tab>('Revenge');
  return (
    <div className="grid grid-cols-4 rounded-2xl p-1.5 gap-1" style={{ background: '#0a1230', border: `2px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), 0 4px 0 rgba(0,0,0,0.35)' }}>
      {TABS.map((t) => {
        const on = t === active;
        return (
          <button key={t} type="button" onClick={() => setActive(t)} className="min-h-[76px] rounded-xl flex flex-col items-center justify-center gap-1" style={on ? { background: 'linear-gradient(180deg,#4a63b0,#24397a)', border: `2px solid ${GOLD}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), 0 3px 0 rgba(0,0,0,0.45)' } : undefined}>
            <Icon t={t} size={on ? 50 : 56} on={on} />
            {on && <span className="text-[11px] font-black uppercase tracking-wide" style={{ ...OUTLINE, color: GOLD }}>{t}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** B — Clash-style: the active tab pops UP above the bar as a taller gold tab. */
function TabBarB() {
  const [active, setActive] = useState<Tab>('Revenge');
  return (
    <div className="relative pt-4">
      <div className="grid grid-cols-4 rounded-2xl" style={{ background: '#0a1230', border: `2px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), 0 4px 0 rgba(0,0,0,0.35)' }}>
        {TABS.map((t) => {
          const on = t === active;
          return (
            <button key={t} type="button" onClick={() => setActive(t)} className="relative min-h-[70px] flex flex-col items-center justify-end pb-2 gap-0.5">
              {on ? (
                <div className="absolute left-1 right-1 -top-4 bottom-1 rounded-t-[14px] rounded-b-xl flex flex-col items-center justify-center gap-0.5" style={{ background: `linear-gradient(180deg,${GOLD},#e0a800)`, boxShadow: '0 4px 0 #8a6200, 0 -2px 0 rgba(255,255,255,0.35) inset' }}>
                  <Icon t={t} size={54} on />
                  <span className="text-[12px] font-black uppercase tracking-wide" style={{ color: '#3a2a00' }}>{t}</span>
                </div>
              ) : (
                <>
                  <Icon t={t} size={44} on={false} />
                  <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>{t}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** C — segmented: the active tab fills solid Revenge red, icon scales up. */
function TabBarC() {
  const [active, setActive] = useState<Tab>('Revenge');
  return (
    <div className="grid grid-cols-4 rounded-2xl overflow-hidden" style={{ border: `2px solid ${PANEL_EDGE}`, boxShadow: '0 4px 0 rgba(0,0,0,0.35)' }}>
      {TABS.map((t, i) => {
        const on = t === active;
        return (
          <button key={t} type="button" onClick={() => setActive(t)} className="min-h-[74px] flex flex-col items-center justify-center gap-1" style={{ background: on ? REVENGE_RED : PANEL, borderLeft: i > 0 ? '2px solid rgba(0,0,0,0.35)' : undefined, boxShadow: on ? 'inset 0 -5px 0 ' + REVENGE_RED_DARK : 'inset 0 2px 0 rgba(255,255,255,0.1)' }}>
            <Icon t={t} size={44} on={on} />
            <span className="text-[11px] font-black uppercase tracking-wide" style={on ? OUTLINE : { color: 'rgba(255,255,255,0.5)' }}>{t}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function RevengePlayMock() {
  return (
    <div className="h-full overflow-auto text-white" style={{ background: '#06091a' }}>
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-12">
        <div>
          <h1 className="text-2xl font-black">Revenge restyle — mock, Sep 3</h1>
          <p className="text-sm mt-1" style={MUTED}>Same layout as today, Arena palette, rules strip gone. Nothing here is wired; it&rsquo;s for the look.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          <Phone label="1 · Play page"><PlayScreen /></Phone>
          <Phone label="2 · Level cleared"><PlayScreen dim /><ClearedModal /></Phone>
          <Phone label="2b · Level lost"><PlayScreen dim /><LostModal /></Phone>
        </div>

        <div className="max-w-[390px] w-full mx-auto flex flex-col gap-8">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-center" style={GOLD_TEXT}>3 · Tab bar options (tap to switch)</div>
          <div className="flex flex-col gap-2"><span className="text-xs font-black" style={MUTED}>A — gold pill, big icons, label only on the active tab</span><TabBarA /></div>
          <div className="flex flex-col gap-2"><span className="text-xs font-black" style={MUTED}>B — Clash-style pop-up tab</span><TabBarB /></div>
          <div className="flex flex-col gap-2"><span className="text-xs font-black" style={MUTED}>C — segmented, active fills Revenge red</span><TabBarC /></div>
        </div>
      </div>
    </div>
  );
}
