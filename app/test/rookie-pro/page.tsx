'use client';

import { useEffect, useState } from 'react';
import { RookieProSheetView, GoldLock } from '@/components/pro/RookieProSheet';
import { ProName } from '@/components/pro/ProName';
import { PRO_ROOKIE_LINES, type ProTrigger } from '@/lib/pro/rules';
import type { ProPlan } from '@/lib/analytics/posthog';

/**
 * Review page for the Rookie Pro sheet (components/pro/RookieProSheet.tsx) —
 * the presentational view, wired to nothing (no StoreKit, no checkout).
 * Must fit 375x667 with NO scrolling (Tyler 2026-10-18): the phone frame
 * below is exactly that viewport. `?bare=1` renders ONLY the docked sheet
 * full-viewport, for Playwright screenshots at 375x667. Query knobs:
 * trigger=rung|endless|settings, trial=0 (already used a trial), signedout=1.
 * Container is overflow-auto (body is overflow:hidden globally).
 */
const TRIGGERS: ProTrigger[] = ['rung', 'endless', 'settings'];

export default function RookieProTestPage() {
  const [trigger, setTrigger] = useState<ProTrigger>('rung');
  const [trial, setTrial] = useState(true);
  const [signedIn, setSignedIn] = useState(true);
  const [plan, setPlan] = useState<ProPlan>('yearly');
  const [native, setNative] = useState(true);
  const [bare, setBare] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const t = q.get('trigger') as ProTrigger | null;
    if (t && TRIGGERS.includes(t)) setTrigger(t);
    if (q.get('trial') === '0') setTrial(false);
    if (q.get('signedout') === '1') setSignedIn(false);
    if (q.get('web') === '1') setNative(false);
    setBare(q.get('bare') === '1');
  }, []);

  const sheet = (
    <RookieProSheetView
      line={PRO_ROOKIE_LINES[trigger]}
      plan={plan}
      onPlan={setPlan}
      trialEligible={trial}
      email={signedIn ? 'tyler@example.com' : null}
      siblingAction={native ? 'Get' : 'Open'}
      onSibling={() => {}}
      onCta={() => {}}
      onNotNow={() => {}}
      onRestore={() => {}}
    />
  );

  if (bare) {
    return (
      <div className="h-full overflow-auto relative" style={{ background: '#0f1c3f' }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-0 bottom-0">{sheet}</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-6 md:grid md:grid-cols-[260px_1fr] md:gap-8">
        <aside className="space-y-4 mb-6">
          <div>
            <h1 className="text-xl font-black text-chess-text">Rookie Pro sheet</h1>
            <p className="text-sm text-chess-text-muted mt-1">Revenge port of the approved design. Nothing here charges or unlocks anything.</p>
          </div>
          <Group title="Trigger">
            {TRIGGERS.map((t) => <Chip key={t} on={trigger === t} onClick={() => setTrigger(t)}>{t}</Chip>)}
          </Group>
          <Group title="Variant">
            <Chip on={trial} onClick={() => setTrial((v) => !v)}>Trial available</Chip>
            <Chip on={signedIn} onClick={() => setSignedIn((v) => !v)}>Signed in</Chip>
            <Chip on={native} onClick={() => setNative((v) => !v)}>iOS app</Chip>
          </Group>
          <Group title="Gold bits">
            <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-white" style={{ background: '#0f1c3f' }}>
              <GoldLock size={16} />
              <ProName pro className="text-[12px] font-bold">KnightOwl</ProName>
            </div>
          </Group>
        </aside>

        {/* 375 x 667 (iPhone SE) screen, no scroll inside. */}
        <div className="mx-auto" style={{ width: 375 + 20 }}>
          <div className="relative overflow-hidden rounded-[2.5rem] border-[10px] border-slate-900 shadow-2xl" style={{ height: 667 + 20, background: '#0f1c3f' }}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-x-0 bottom-0">{sheet}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-black uppercase tracking-wide text-chess-text-muted mb-1.5">{title}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[36px] rounded-xl px-3 text-xs font-bold ${on ? 'bg-chess-blue text-white' : 'bg-white text-chess-text shadow-sm'}`}
    >
      {children}
    </button>
  );
}
