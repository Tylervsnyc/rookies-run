/**
 * Rookie's Revenge — the Journey (map select).
 *
 * A MAP is a named chapter of the campaign that points at a run. Progress is
 * DERIVED from the existing local run history (`lib/run/history.ts`) — there is
 * no journey storage key and no second source of truth. A map with
 * `runId: null` is authored but not built yet: it renders as "In the works".
 *
 * Shipping a new chapter = point its `runId` at a new RunDef in `runs.ts`.
 */

import type { RunHistoryEntry } from './history';
import { getRunById, isKnownRunId } from './runs';

export interface JourneyMap {
  /** Stable id — used for progress lookups and analytics. */
  id: string;
  /** Chapter number on the node. */
  n: number;
  name: string;
  /** Rookie's line for the chapter. */
  blurb: string;
  /** The run this map plays. null = authored, not built yet. */
  runId: string | null;
  /** Level count when the run isn't built yet (built runs report their own). */
  plannedLevels: number;
  /** Node accent (hex) — keeps the path readable as it climbs. */
  accent: string;
}

/**
 * Five chapters. Only the first is built (it is the Revenge run itself);
 * the rest are authored placeholders so the ladder reads honestly instead of
 * pretending the campaign is longer than it is.
 */
export const JOURNEY_MAPS: ReadonlyArray<JourneyMap> = [
  {
    id: 'courtyard',
    n: 1,
    name: 'The Courtyard',
    blurb: 'Where he beat her. Ten levels, one king, no witnesses.',
    runId: 'revenge-1',
    plannedLevels: 10,
    accent: '#E53935',
  },
  {
    id: 'barracks',
    n: 2,
    name: 'The Barracks',
    blurb: 'His army sleeps here. Waking them is rude. She is going to do it anyway.',
    runId: null,
    plannedLevels: 10,
    accent: '#FF9500',
  },
  {
    id: 'cathedral',
    n: 3,
    name: 'The Cathedral',
    blurb: 'Bishops on every diagonal. Somebody should pray. Not her.',
    runId: null,
    plannedLevels: 10,
    accent: '#CE82FF',
  },
  {
    id: 'stables',
    n: 4,
    name: 'The Stables',
    blurb: 'Knights. Nothing here moves in a straight line except her.',
    runId: null,
    plannedLevels: 10,
    accent: '#1CB0F6',
  },
  {
    id: 'throne',
    n: 5,
    name: 'The Throne Room',
    blurb: 'The last door. He is behind it. He knows she is coming.',
    runId: null,
    plannedLevels: 12,
    accent: '#d9a520',
  },
];

export type MapStatus =
  /** Finished at least once. */
  | 'cleared'
  /** Playable now. */
  | 'open'
  /** Built, but the chapter before it isn't cleared. */
  | 'locked'
  /** Not built yet. */
  | 'soon';

export interface MapProgress {
  map: JourneyMap;
  status: MapStatus;
  /** Levels in the map (the run's real count once it exists). */
  levels: number;
  /** Furthest level reached, 0 = never played. */
  bestLevel: number;
  /** Finished runs recorded for this map. */
  attempts: number;
}

function levelsFor(map: JourneyMap): number {
  if (map.runId && isKnownRunId(map.runId)) return getRunById(map.runId).levels.length;
  return map.plannedLevels;
}

/**
 * Fold the local run history into per-map progress. A map unlocks when the
 * chapter before it is cleared; chapter 1 is always open.
 */
export function journeyProgress(history: RunHistoryEntry[]): MapProgress[] {
  const out: MapProgress[] = [];
  let prevCleared = true; // chapter 1 has no gate
  for (const map of JOURNEY_MAPS) {
    const runs = map.runId ? history.filter((h) => h.runId === map.runId) : [];
    const cleared = runs.some((h) => h.completed);
    const bestLevel = runs.reduce((m, h) => (h.levelReached > m ? h.levelReached : m), 0);
    let status: MapStatus;
    if (!map.runId) status = 'soon';
    else if (cleared) status = 'cleared';
    else if (prevCleared) status = 'open';
    else status = 'locked';
    out.push({ map, status, levels: levelsFor(map), bestLevel, attempts: runs.length });
    prevCleared = cleared;
  }
  return out;
}

/** The chapter the "Continue" button should drop you into. */
export function currentMap(progress: MapProgress[]): MapProgress {
  return progress.find((p) => p.status === 'open') ?? progress[0];
}

export function clearedCount(progress: MapProgress[]): number {
  return progress.filter((p) => p.status === 'cleared').length;
}

/** Why a node can't be tapped. */
export function mapLockHint(progress: MapProgress[], index: number): string {
  const p = progress[index];
  if (p.status === 'soon') return 'Still being built. She is pacing.';
  if (p.status === 'locked') {
    const prev = progress[index - 1];
    return prev ? `Clear ${prev.map.name} first.` : 'Locked.';
  }
  return '';
}
