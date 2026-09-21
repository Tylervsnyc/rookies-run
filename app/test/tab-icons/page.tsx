'use client';

/** Tab-bar icon picker — Tyler 2026-09-04: "more like Magic: The Gathering." Three painted-artifact options per tab, shown big and inside the real Clash-style bar. */

import { useState, type CSSProperties, type ReactNode } from 'react';
import { TAB_BLOCK_ICONS } from '@/components/run/TabBlockIcons';

const NAVY = '#0f1c3f';
const OUTLINE: CSSProperties = { color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.45), -1px 0 0 rgba(0,0,0,0.35), 1px 0 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(0,0,0,0.35)' };
const TABS = ['Ladder', 'Ranks', 'Revenge', 'Codex'] as const;
type Tab = (typeof TABS)[number];

const OPTIONS: Record<Tab, { id: string; label: string }[]> = {
  Ladder: [
    { id: 'ladder-x1', label: 'A · wooden ladder' },
    { id: 'ladder-x2', label: 'B · stone steps' },
    { id: 'ladder-x3', label: 'C · golden ladder' },
  ],
  Ranks: [
    { id: 'ranks-x1', label: 'A · golden goblet' },
    { id: 'ranks-x2', label: 'B · laurel wreath' },
    { id: 'ranks-x3', label: 'C · plain crown' },
  ],
  Revenge: [
    { id: 'revenge-x1', label: 'A · archery target + arrow' },
    { id: 'revenge-x2', label: 'B · worn bronze bullseye' },
    { id: 'revenge-x3', label: 'C · king in a target ring' },
  ],
  Codex: [
    { id: 'codex-x1', label: 'A · leather tome' },
    { id: 'codex-x2', label: 'B · scroll' },
    { id: 'codex-x3', label: 'C · small chest' },
  ],
};
const CURRENT: Record<Tab, string> = { Ladder: 'ladder-p1', Ranks: 'ranks-p1', Revenge: 'revenge-p1', Codex: 'codex-p1' };

function Icon({ id, tab, size, style }: { id: string; tab: Tab; size: number; style?: CSSProperties }): ReactNode {
  if (id === 'block') { const C = TAB_BLOCK_ICONS[tab]; return <div style={{ width: size, height: size, ...style }}><C size={size} /></div>; }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/ui/tabs/${id}.webp`} alt="" width={size} height={size} style={style} />;
}
const BAR_H = 72;
function Bar({ art, active, onChange }: { art: Record<Tab, string>; active: Tab; onChange: (t: Tab) => void }) {
  const idx = TABS.indexOf(active);
  return (
    <div className="relative grid grid-cols-4" role="tablist" style={{ height: BAR_H, background: 'linear-gradient(180deg,#4b5f88 0%,#3e5178 55%,#354669 100%)', boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.14), inset 0 -2px 0 rgba(0,0,0,0.35), 0 -6px 14px rgba(0,0,0,0.35)', borderTop: '2px solid #22305a' }}>
      {TABS.map((t, i) => {
        const on = t === active;
        return (
          <button key={t} type="button" role="tab" aria-selected={on} onClick={() => onChange(t)} className="relative flex flex-col items-center justify-end select-none"
            style={{ height: on ? BAR_H + 14 : BAR_H, marginTop: on ? -14 : 0, paddingBottom: on ? 11 : 10, background: on ? 'linear-gradient(180deg,#8ea3d3 0%,#6a83bd 40%,#5a72a9 100%)' : 'transparent', boxShadow: on ? 'inset 0 3px 0 rgba(255,255,255,0.35), inset 2px 0 0 rgba(255,255,255,0.12), inset -2px 0 0 rgba(0,0,0,0.25)' : 'none', borderLeft: on || i === 0 ? 'none' : '1px solid rgba(0,0,0,0.28)', borderRadius: on ? '10px 10px 0 0' : 0 }}>
            {i === idx - 1 && <span aria-hidden className="absolute right-1 top-1/2 -translate-y-1/2" style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '8px solid #a7c4ff' }} />}
            {i === idx + 1 && <span aria-hidden className="absolute left-1 top-1/2 -translate-y-1/2" style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '8px solid #a7c4ff' }} />}
            <div style={{ width: 56, height: 56, transform: on ? 'translateY(-10px) scale(1.3)' : 'translateY(2px)', filter: on ? 'drop-shadow(0 4px 4px rgba(0,0,0,0.5))' : 'brightness(0.72) saturate(0.75) drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}>
              <Icon id={art[t]} tab={t} size={56} />
            </div>
            {on && <span className="text-[13px] font-black leading-none -mt-1" style={OUTLINE}>{t}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function TabIconsPage() {
  const [pick, setPick] = useState<Record<Tab, string>>({ Ladder: 'ladder-x1', Ranks: 'ranks-x1', Revenge: 'revenge-x1', Codex: 'codex-x1' });
  const [active, setActive] = useState<Tab>('Revenge');
  return (
    <div className="h-full overflow-auto text-white" style={{ background: NAVY }}>
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <h1 className="text-2xl font-black">Tab icons — old-school card art pass</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Tap an option to load it into the bar below. Tap a tab in the bar to see it raised.</p>

        <div className="sticky top-0 z-10 mt-4 -mx-4 px-4 py-3" style={{ background: NAVY }}>
          <div className="mx-auto max-w-[430px] pt-4">
            <Bar art={pick} active={active} onChange={setActive} />
          </div>
          <div className="mx-auto max-w-[430px] mt-3 text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
            picked: {TABS.map((t) => pick[t]).join(' · ')}
          </div>
        </div>

        {TABS.map((t) => (
          <section key={t} className="mt-8">
            <h2 className="text-lg font-black" style={{ color: '#FFC800' }}>{t}</h2>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[{ id: CURRENT[t], label: 'Current' }, ...OPTIONS[t]].map((o) => {
                const on = pick[t] === o.id;
                return (
                  <button key={o.id} type="button" onClick={() => { setPick((p) => ({ ...p, [t]: o.id })); setActive(t); }} className="rounded-2xl p-3 flex flex-col items-center gap-2 text-left" style={{ background: on ? '#24397a' : '#182a5c', border: `2px solid ${on ? '#FFC800' : '#3a4f8f'}` }}>
                    <Icon id={o.id} tab={t} size={120} />
                    <div className="flex items-end gap-2">
                      <Icon id={o.id} tab={t} size={56} />
                      <Icon id={o.id} tab={t} size={36} style={{ filter: 'brightness(0.72) saturate(0.75)' }} />
                    </div>
                    <div className="text-xs font-bold" style={{ color: on ? '#FFC800' : 'rgba(255,255,255,0.8)' }}>{o.label}</div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
