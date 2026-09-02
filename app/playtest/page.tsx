/**
 * /playtest — Tyler's playtest funnel, v3.
 *
 * "Pick a run, pick 3 abilities, hit PLAY." The server component builds:
 *   - the testing-stage runs from the registry (run dropdown — a play is
 *     the WHOLE run from level 1)
 *   - one card per player-relevant ability (ABILITY_DEFS minus retired),
 *     with type line + description so the picker SHOWS what each one does;
 *     testing-stage abilities badged and sorted first
 * The client tracks coverage (runs played + abilities tried) in localStorage
 * and loads the real game in an iframe via /?run=<id>&loadout=<a:t,...>.
 * Comments POST to /api/playtest-feedback -> Slack (API unchanged).
 */

import type { Metadata } from 'next';

import { REGISTRY, stageOf } from '@/lib/content/pipeline';
import { ABILITY_DEFS } from '@/lib/run/abilities';
import { PlaytestClient, type PlaytestAbility, type PlaytestRun } from './PlaytestClient';

export const metadata: Metadata = {
  title: "Playtest — Rookie's Revenge",
  robots: { index: false, follow: false },
};

export default function PlaytestPage() {
  // Every TESTING-stage run — played whole, from level 1.
  const runs: PlaytestRun[] = REGISTRY.items
    .filter((i) => i.stage === 'testing' && i.kind === 'run')
    .map((i) => ({ id: i.id, name: i.name }));

  // Every player-relevant ability: ABILITY_DEFS minus retired-stage ids.
  // Testing-stage abilities first (they're what needs eyes), then the rest.
  const abilities: PlaytestAbility[] = Object.values(ABILITY_DEFS)
    .filter((d) => stageOf(d.id) !== 'retired')
    .map((d) => ({
      id: d.id,
      name: d.name,
      typeLine: d.typeLine,
      description: d.description,
      testing: stageOf(d.id) === 'testing',
    }))
    .sort((a, b) => (a.testing === b.testing ? a.name.localeCompare(b.name) : a.testing ? -1 : 1));

  return <PlaytestClient runs={runs} abilities={abilities} />;
}
