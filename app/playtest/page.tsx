/**
 * /playtest — Tyler's daily playtest funnel.
 *
 * Server component: loads the content registry (data/content/pipeline.json
 * via lib/content/pipeline.ts) and hands the queue to the client. The queue
 * is every item in the `testing` stage — abilities AND runs — so new content
 * (revenge-8/9/10 etc.) appears here automatically once its registry record
 * lands, no hardcoding.
 *
 * Play links load the real game in an iframe:
 *   runs      -> /?run=<id>
 *   abilities -> /?run=revenge-1&loadout=<id>:<tier>
 * Comments POST to /api/playtest-feedback -> Slack.
 */

import type { Metadata } from 'next';

import { REGISTRY, type ContentItem } from '@/lib/content/pipeline';
import { PlaytestClient, type PlaytestItem } from './PlaytestClient';

export const metadata: Metadata = {
  title: "Playtest — Rookie's Revenge",
  robots: { index: false, follow: false },
};

function toItem(i: ContentItem): PlaytestItem {
  return { id: i.id, kind: i.kind, name: i.name, stage: i.stage, notes: firstLine(i.notes) };
}

function firstLine(notes: string): string {
  const line = (notes ?? '').split('\n')[0].trim();
  return line.length > 140 ? line.slice(0, 139) + '…' : line;
}

export default function PlaytestPage() {
  // The daily queue: everything still in `testing`. Abilities first (quick
  // single-level checks), then runs (full climbs).
  const testing = REGISTRY.items.filter((i) => i.stage === 'testing');
  const queue = [
    ...testing.filter((i) => i.kind === 'ability'),
    ...testing.filter((i) => i.kind === 'run'),
  ].map(toItem);

  // Dropdown options for the comment box: all testing + live abilities and runs.
  const options = REGISTRY.items
    .filter((i) => i.stage === 'testing' || i.stage === 'live')
    .map(toItem)
    .sort((a, b) => (a.kind === b.kind ? a.id.localeCompare(b.id) : a.kind === 'ability' ? -1 : 1));

  return <PlaytestClient queue={queue} options={options} />;
}
