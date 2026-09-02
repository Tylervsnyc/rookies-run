/**
 * /review — Tyler's one-stop content review dashboard (pre-launch).
 *
 * READ-ONLY. Every ability in ABILITY_DEFS and every Revenge run, grouped by
 * pipeline stage, each with a PLAY link. Measured numbers are hardcoded
 * snapshots from the 2026-09-01 playtests (sources labeled inline):
 *   - data/run-playtest/candidate-abilities/2026-09-01/summary.md
 *   - data/run-playtest/revenge/digests/latest.md (2026-09-01)
 * Approve flow: `npx tsx scripts/pipeline.ts approve <id>`.
 *
 * NOTE: `?loadout=` is read only together with `?parity=1`, and only in a
 * dev build (readParityHook in app/page.tsx returns null in production) —
 * so ability PLAY links are for localhost review. Run PLAY links work
 * everywhere. A heavier, interactive version of this surface lives at
 * /admin/content (approve buttons, art audit); this page is the flat
 * read-only review sheet.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';

import {
  ABILITY_DEFS,
  blurbDetailForTier,
  isOneChargePerRun,
  type AbilityId,
  type AbilityTier,
} from '@/lib/run/abilities';
import { getRunById, REVENGE_CANDIDATE_RUN_IDS, REVENGE_RUN_IDS } from '@/lib/run/runs';
import { REGISTRY, stageOf, type ContentStage } from '@/lib/content/pipeline';

export const metadata: Metadata = {
  title: "Content Review — Rookie's Revenge",
  robots: { index: false, follow: false },
};

/**
 * Mirrors artFile() in components/run/AbilityCard.tsx (that module is
 * 'use client', so it cannot be imported into this server component).
 */
function abilityArtFile(id: AbilityId): string {
  if (id === 'poison-dart') return 'poison-dart-2.webp';
  if (id === 'rabies-dart') return 'rabies-dart-2.webp';
  if (id === 'freeze-ray') return 'freeze-ray-2.webp';
  if (id === 'become-king') return 'become-king-2.webp';
  return `${id}-1.webp`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Measured snapshots (hardcoded on 2026-09-02 from the 2026-09-01 playtests).

/**
 * The 8 new controllable-summon abilities — measured 2026-09-01 (T5 bot,
 * revenge-1, realistic tiers, 24 trials/cell) in
 * data/run-playtest/candidate-abilities/2026-09-01/summary.md.
 */
const SUMMON_MEASUREMENTS: Partial<Record<AbilityId, string>> = {
  'twin': 'Floor 83% (L9) vs 13% no-ability · +70 at worst cell · KEEP',
  'duchess': 'Floor 96% (L6/L7), 100% on L8-L10 — strongest of the family · KEEP',
  'vanguard': 'Floor 96% (L10), 100% on L6-L9 — ties Duchess for strongest · KEEP',
  'bishop-squire': 'Floor 92% (L6/L8), 100% elsewhere — Squire-parity · KEEP',
  'page': 'Floor 67% (L10) vs 33% no-ability — weakest direct summon · NEEDS TUNING',
  'swap': 'Paired with Squire: +20 (T1 L10) / +17 (realistic L10) · KEEP',
  'sacrifice': 'Paired with Squire: +33 (T1 L10) / +17 (realistic L10) — best support card · KEEP',
  'knighting': 'Paired with Squire: +25 (T1 L10) / +13 (realistic L10) · KEEP',
};

/**
 * No-ability clear curves L1→L10, Normal difficulty, realistic tiers.
 * revenge-1..6: nightly digest 2026-09-01 (data/run-playtest/revenge/digests/latest.md).
 * revenge-7: generation matrix 2026-09-01 (48 trials/cell, pipeline notes).
 */
const RUN_CURVES: Record<string, { curve: string; label: string }> = {
  'revenge-1': { curve: '100/100/100/100/75/25/25/25/0/0', label: 'digest 2026-09-01 · 4 trials/cell' },
  'revenge-2': { curve: '100/100/100/98/88/60/63/55/38/3', label: 'digest 2026-09-01 · 40 trials/cell' },
  'revenge-3': { curve: '100/100/100/100/88/40/53/8/20/28', label: 'digest 2026-09-01 · 40 trials/cell' },
  'revenge-4': { curve: '100/100/100/100/93/55/53/53/38/33', label: 'digest 2026-09-01 · 40 trials/cell' },
  'revenge-5': { curve: '100/100/100/100/100/53/50/100/38/30', label: 'digest 2026-09-01 · 40 trials/cell' },
  'revenge-6': { curve: '100/100/100/100/100/60/80/38/28/13', label: 'digest 2026-09-01 · 40 trials/cell' },
  'revenge-7': { curve: '100/100/100/100/100/67/60/38/15/31', label: 'generation matrix 2026-09-01 · 48 trials/cell' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Data assembly (server-side, at render time).

type Group = 'live' | 'testing' | 'retired';

function groupOf(stage: ContentStage | undefined): Group {
  if (stage === 'retired') return 'retired';
  if (stage === 'live' || stage === 'approved') return 'live';
  return 'testing';
}

interface AbilityRow {
  id: AbilityId;
  name: string;
  typeLine: string;
  description: string;
  stage: ContentStage | 'unregistered';
  art: string | null;
  tierUses: string;
  oneCharge: boolean;
  measured: string | null;
}

function abilityRow(id: AbilityId): AbilityRow {
  const def = ABILITY_DEFS[id];
  const file = abilityArtFile(id);
  const hasArt = existsSync(join(process.cwd(), 'public', 'abilities', file));
  const tiers = ([1, 2, 3, 4, 5] as AbilityTier[]).map((t) => {
    const limit = blurbDetailForTier(id, t).limit;
    return `T${t} ${limit === '' ? 'unlimited' : limit.replace(' per level', '').replace(' per run', '')}`;
  });
  return {
    id,
    name: def.name,
    typeLine: def.typeLine,
    description: def.description,
    stage: stageOf(id) ?? 'unregistered',
    art: hasArt ? `/abilities/${file}` : null,
    tierUses: tiers.join(' · '),
    oneCharge: isOneChargePerRun(id),
    measured: SUMMON_MEASUREMENTS[id] ?? null,
  };
}

const STAGE_BADGE: Record<string, string> = {
  live: 'bg-green-100 text-green-800',
  approved: 'bg-green-100 text-green-800',
  testing: 'bg-amber-100 text-amber-800',
  retired: 'bg-red-100 text-red-700',
  idea: 'bg-slate-200 text-slate-600',
  unregistered: 'bg-slate-200 text-slate-600',
};

function Badge({ stage }: { stage: string }): React.ReactElement {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${STAGE_BADGE[stage] ?? STAGE_BADGE.unregistered}`}>
      {stage}
    </span>
  );
}

function PlayLink({ href }: { href: string }): React.ReactElement {
  return (
    <a
      href={href}
      className="inline-block rounded-lg bg-chess-blue px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-chess-blue-dark"
    >
      PLAY
    </a>
  );
}

function AbilityCardRow({ a }: { a: AbilityRow }): React.ReactElement {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start gap-3">
        {a.art ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.art} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-slate-200" />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg font-bold text-slate-400 ring-1 ring-slate-200">
            {a.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900">{a.name}</span>
            <Badge stage={a.stage} />
            {a.oneCharge ? (
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-purple-700">
                one charge per run
              </span>
            ) : null}
          </div>
          <div className="text-xs font-semibold text-slate-500">{a.typeLine}</div>
        </div>
        <PlayLink href={`/?run=revenge-1&parity=1&loadout=${a.id}:5`} />
      </div>
      <p className="text-sm text-slate-700">{a.description}</p>
      <p className="text-xs text-slate-500">{a.tierUses}</p>
      {a.measured ? (
        <p className="rounded-lg bg-sky-50 px-2 py-1 text-xs text-sky-900">
          <span className="font-bold">Measured 2026-09-01:</span> {a.measured}
        </p>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ReviewPage(): React.ReactElement {
  const allAbilities = (Object.keys(ABILITY_DEFS) as AbilityId[]).map(abilityRow);
  const liveAbilities = allAbilities.filter((a) => groupOf(stageOf(a.id)) === 'live');
  const testingAbilities = allAbilities.filter((a) => groupOf(stageOf(a.id)) === 'testing');
  const retiredAbilities = allAbilities.filter((a) => groupOf(stageOf(a.id)) === 'retired');
  const ideaAbilities = REGISTRY.items.filter((i) => i.kind === 'ability' && i.stage === 'idea');

  const runIds = [...REVENGE_RUN_IDS, ...REVENGE_CANDIDATE_RUN_IDS];
  const runs = runIds.map((id) => {
    const def = getRunById(id);
    const item = REGISTRY.items.find((i) => i.id === id);
    return {
      id,
      name: def.name,
      blurb: def.blurb,
      levels: def.levels.length,
      stage: stageOf(id) ?? 'unregistered',
      verdict: item?.testing?.summary ?? null,
      curve: RUN_CURVES[id] ?? null,
    };
  });

  return (
    <main className="h-dvh overflow-auto bg-sky-50">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-16">
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Rookie&apos;s Revenge — Content Review</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            {liveAbilities.length} abilities live, {testingAbilities.length} in testing · {runs.length} runs
          </p>
          <p className="mt-1 text-xs text-slate-500">
            approve: <code className="rounded bg-slate-200 px-1 py-0.5">npx tsx scripts/pipeline.ts approve &lt;id&gt;</code>
            {' '}· ability PLAY links use the dev-only <code className="rounded bg-slate-200 px-1 py-0.5">?parity=1&amp;loadout=</code> hook
            (works on localhost; ignored in the production build)
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-extrabold text-slate-800">Abilities — Live ({liveAbilities.length})</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {liveAbilities.map((a) => <AbilityCardRow key={a.id} a={a} />)}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-extrabold text-slate-800">Abilities — Testing ({testingAbilities.length})</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {testingAbilities.map((a) => <AbilityCardRow key={a.id} a={a} />)}
          </div>
        </section>

        {retiredAbilities.length > 0 ? (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-extrabold text-slate-800">Abilities — Retired ({retiredAbilities.length})</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {retiredAbilities.map((a) => <AbilityCardRow key={a.id} a={a} />)}
            </div>
          </section>
        ) : null}

        {ideaAbilities.length > 0 ? (
          <section className="mb-8">
            <h2 className="mb-2 text-lg font-extrabold text-slate-800">Abilities — Ideas (design only, {ideaAbilities.length})</h2>
            <ul className="space-y-1">
              {ideaAbilities.map((i) => (
                <li key={i.id} className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
                  <span className="font-bold">{i.name}</span> — {i.notes}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 text-lg font-extrabold text-slate-800">Runs ({runs.length})</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {runs.map((r) => (
              <div key={r.id} className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">{r.name}</span>
                      <Badge stage={r.stage} />
                      <span className="text-xs font-semibold text-slate-500">{r.levels} levels</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700">{r.blurb}</p>
                  </div>
                  <PlayLink href={`/?run=${r.id}`} />
                </div>
                {r.curve ? (
                  <p className="rounded-lg bg-sky-50 px-2 py-1 text-xs text-sky-900">
                    <span className="font-bold">No-ability clears L1→L10:</span>{' '}
                    <span className="font-mono">{r.curve.curve}</span>
                    <span className="text-sky-700"> ({r.curve.label})</span>
                  </p>
                ) : null}
                {r.verdict ? (
                  <p className="text-xs text-amber-800">
                    <span className="font-bold">Nightly verdict:</span> {r.verdict}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
