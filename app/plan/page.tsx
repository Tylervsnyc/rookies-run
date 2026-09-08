import type { Metadata } from 'next';

import { LADDER_RUNG_IDS, rungKit, rungRun } from '@/lib/run/ladder';
import { ABILITY_DEFS } from '@/lib/run/abilities';
import { STARTER_ABILITIES } from '@/lib/run/profile';
import plan from '@/data/ladder-plan.json';

/**
 * /plan — the ladder, as a page you can read on a phone.
 *
 * Built for Tyler 2026-09-07 so the morning's TestFlight launch shows the
 * CURRENT plan, not a description of it that rots. Everything here is derived
 * from lib/run/ladder.ts and each RunDef's own kit — reorder the ladder or
 * edit a kit and this page follows. The only hand-kept file is
 * data/ladder-plan.json, which holds the measured pair rates (they come from
 * the harness, not from code).
 *
 * Read-only. No game state, no profile, nothing to tap wrong.
 */
export const metadata: Metadata = {
  title: "The Ladder — Rookie's Revenge",
  robots: { index: false, follow: false },
};

const NAVY = '#0f1c3f';
const NAVY_2 = '#182a5c';
const PANEL = '#1c2f63';
const EDGE = '#3a4f8f';
const GOLD = '#FFC800';

type PlanEntry = { pair?: number[]; was?: number[]; changed?: string };
const ENTRIES = plan.runs as Record<string, PlanEntry>;
const COVERAGE = (plan as { coverage?: Coverage }).coverage;

interface Coverage {
  playerFacing: number;
  covered: number;
  missing: string[];
  note: string;
  candidates: { id: string; name: string; pair: string; covers: string[]; stage: string; band: string }[];
  result: string;
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/** In band, too easy, or not measured yet. */
function verdict(m: number | null): { label: string; color: string } {
  if (m === null) return { label: 'not measured', color: 'rgba(255,255,255,0.45)' };
  if (m > plan.band.max) return { label: 'too easy', color: '#FF6B66' };
  if (m < plan.band.min) return { label: 'too hard', color: '#FFB020' };
  return { label: 'in band', color: '#58CC02' };
}

function abilityName(id: string): string {
  return ABILITY_DEFS[id as keyof typeof ABILITY_DEFS]?.name ?? id;
}

export default function LadderPlanPage() {
  const starters = new Set<string>(STARTER_ABILITIES as ReadonlyArray<string>);
  const seen = new Set<string>(starters);

  const rungs = LADDER_RUNG_IDS.map((id, i) => {
    const run = rungRun(i);
    const kit = rungKit(i);
    const fresh = kit.filter((a) => !seen.has(a));
    fresh.forEach((a) => seen.add(a));
    const entry = ENTRIES[id];
    const m = entry?.pair ? mean(entry.pair) : null;
    return { id, i, run, kit, fresh, entry, m };
  });

  const inBand = rungs.filter((r) => r.m !== null && r.m >= plan.band.min && r.m <= plan.band.max).length;
  const measured = rungs.filter((r) => r.m !== null).length;

  return (
    <main
      className="min-h-full w-full text-white"
      style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 40%)`, overflowY: 'auto' }}
    >
      <div className="mx-auto w-full max-w-[560px] px-4 pb-16 pt-[calc(env(safe-area-inset-top)+20px)]">
        <h1 className="text-[26px] font-black leading-none">The Ladder</h1>
        <p className="mt-2 text-[13px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.68)' }}>
          Ten rungs, ordered by how much the ability they unlock rewrites the board — gentle first,
          Dragon last. Clearing a rung opens the next one and unlocks exactly the cards it needs.
        </p>

        <div className="mt-4 rounded-2xl p-3" style={{ background: PANEL, border: `1.5px solid ${EDGE}` }}>
          <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
            The band
          </div>
          <div className="mt-1 text-[13px] font-bold leading-snug">
            {inBand} of {measured} measured rungs sit in {plan.band.min}-{plan.band.max}%.
          </div>
          <p className="mt-2 text-[12px] font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.62)' }}>
            {plan.note}
          </p>
        </div>

        <div className="mt-3 text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
          You start with {[...starters].map(abilityName).join(', ')}.
        </div>

        <ol className="mt-3 space-y-2.5">
          {rungs.map(({ id, i, run, kit, fresh, entry, m }) => {
            const v = verdict(m);
            return (
              <li key={id} className="rounded-2xl p-3.5" style={{ background: PANEL, border: `1.5px solid ${EDGE}` }}>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[20px] font-black tabular-nums" style={{ color: GOLD }}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-[16px] font-black leading-tight">
                    {run?.name ?? 'Coming soon'}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wide" style={{ color: v.color }}>
                    {v.label}
                  </span>
                </div>

                <div className="mt-1.5 text-[12px] font-bold" style={{ color: 'rgba(255,255,255,0.66)' }}>
                  Kit: {kit.map(abilityName).join(' · ') || '—'}
                </div>

                {fresh.length > 0 && (
                  <div className="mt-1 text-[12px] font-black" style={{ color: GOLD }}>
                    Unlocks: {fresh.map(abilityName).join(', ')}
                  </div>
                )}

                {entry?.pair && (
                  <div className="mt-2 flex items-center gap-2 text-[12px] font-bold tabular-nums">
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>L7-10</span>
                    <span>{entry.pair.join(' / ')}</span>
                    <span style={{ color: v.color }}>({m!.toFixed(0)}%)</span>
                    {entry.was && (
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                        was {mean(entry.was).toFixed(0)}%
                      </span>
                    )}
                  </div>
                )}

                {entry?.changed && (
                  <div className="mt-1 text-[11px] font-bold" style={{ color: '#58CC02' }}>
                    Reworked {entry.changed} — each of L7-L10 now needs a different use of the pair.
                  </div>
                )}

                {run?.blurb && (
                  <p className="mt-2 text-[12px] font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {run.blurb}
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        {COVERAGE && (
          <section className="mt-6">
            <h2 className="text-[18px] font-black leading-none">Every ability?</h2>
            <div className="mt-1.5 text-[13px] font-bold">
              The ladder grants {COVERAGE.covered} of {COVERAGE.playerFacing}.
            </div>
            <p className="mt-2 text-[12px] font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.62)' }}>
              {COVERAGE.note}
            </p>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {COVERAGE.missing.map((id) => (
                <span
                  key={id}
                  className="rounded-lg px-2 py-1 text-[11px] font-black"
                  style={{ background: 'rgba(229,57,53,0.25)', border: '1.5px solid rgba(229,57,53,0.55)' }}
                >
                  {abilityName(id)}
                </span>
              ))}
            </div>

            <ul className="mt-3 space-y-2">
              {COVERAGE.candidates.map((c) => (
                <li key={c.id} className="rounded-xl p-3" style={{ background: PANEL, border: `1.5px solid ${EDGE}` }}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[14px] font-black">{c.name}</span>
                    <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.stage}</span>
                  </div>
                  <div className="mt-0.5 text-[12px] font-bold" style={{ color: 'rgba(255,255,255,0.66)' }}>{c.pair}</div>
                  <div className="mt-0.5 text-[12px] font-black" style={{ color: GOLD }}>
                    Covers: {c.covers.map(abilityName).join(', ')}
                  </div>
                  <div className="mt-0.5 text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.band}</div>
                </li>
              ))}
            </ul>

            <div className="mt-2.5 text-[12px] font-black" style={{ color: '#58CC02' }}>{COVERAGE.result}</div>
          </section>
        )}

        <p className="mt-6 text-[11px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.42)' }}>
          Numbers are the signature pair&rsquo;s clear rate on levels 7-10, 32 trials at T5 against the
          bot. Every single card in every kit reads 0-8% on those levels — that is what makes the run a
          combo gate rather than a hard level. Updated {plan.updated}.
        </p>
      </div>
    </main>
  );
}
