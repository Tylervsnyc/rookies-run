/**
 * /playtest — Tyler's playtest funnel, v2.
 *
 * "Pick a level, pick 3 abilities, hit PLAY." The server component builds:
 *   - one chip per (testing-stage run, level) from the registry + run defs
 *   - one chip per player-relevant ability (ABILITY_DEFS minus retired),
 *     testing-stage abilities badged and sorted first
 * The client tracks coverage (what's left to test) in localStorage and loads
 * the real game in an iframe via /?run=<id>&loadout=<a:t,...>&level=<n>.
 * Comments POST to /api/playtest-feedback -> Slack (API unchanged).
 */

import type { Metadata } from 'next';

import { REGISTRY, stageOf } from '@/lib/content/pipeline';
import { ABILITY_DEFS } from '@/lib/run/abilities';
import { getRunById } from '@/lib/run/runs';
import { PlaytestClient, type PlaytestAbility, type PlaytestRun } from './PlaytestClient';

export const metadata: Metadata = {
  title: "Playtest — Rookie's Revenge",
  robots: { index: false, follow: false },
};

export default function PlaytestPage() {
  // Every level of every TESTING-stage run.
  const runs: PlaytestRun[] = REGISTRY.items
    .filter((i) => i.stage === 'testing' && i.kind === 'run')
    .map((i) => {
      const def = getRunById(i.id);
      return { id: i.id, name: i.name, levels: def.id === i.id ? def.levels.length : 0 };
    })
    .filter((r) => r.levels > 0);

  // Every player-relevant ability: ABILITY_DEFS minus retired-stage ids.
  // Testing-stage abilities first (they're what needs eyes), then the rest.
  const abilities: PlaytestAbility[] = Object.values(ABILITY_DEFS)
    .filter((d) => stageOf(d.id) !== 'retired')
    .map((d) => ({ id: d.id, name: d.name, testing: stageOf(d.id) === 'testing' }))
    .sort((a, b) => (a.testing === b.testing ? a.name.localeCompare(b.name) : a.testing ? -1 : 1));

  return <PlaytestClient runs={runs} abilities={abilities} />;
}
