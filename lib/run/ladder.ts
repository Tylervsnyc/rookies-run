/**
 * Rookie's Revenge — The Ladder. A fixed 10-rung progression, easiest to
 * hardest (ordered by the 2026-09-01 playtest measurements, NOT by id).
 * Rung 1 is always open; rung N opens when rung N-1 is cleared. Ladder runs
 * always play on Normal rules — the difficulty picker is a DAILY concept.
 *
 * Ids that `isKnownRunId` can't resolve yet (revenge-8..10 are being built)
 * render as "Coming soon" rungs — never crash, never fall back to RUNS[0].
 */

import { getRunById, isKnownRunId, type RunDef } from './runs';
import type { PlayerProfile } from './profile';

export const LADDER_RUNG_IDS: ReadonlyArray<string> = [
  'revenge-5',
  'revenge-6',
  'revenge-4',
  'revenge-3',
  'revenge-2',
  'revenge-1',
  'revenge-7',
  'revenge-8',
  'revenge-9',
  'revenge-10',
];

export type RungState = 'locked' | 'open' | 'cleared';

function clearedRung(profile: PlayerProfile | undefined, runId: string | undefined): boolean {
  if (!runId) return false;
  return !!profile?.ladder?.[runId]?.cleared;
}

/** Rung 1 (index 0) is always open; rung N opens once rung N-1 is cleared. */
export function rungState(profile: PlayerProfile | undefined, index: number): RungState {
  if (index < 0 || index >= LADDER_RUNG_IDS.length) return 'locked';
  if (clearedRung(profile, LADDER_RUNG_IDS[index])) return 'cleared';
  if (index === 0) return 'open';
  return clearedRung(profile, LADDER_RUNG_IDS[index - 1]) ? 'open' : 'locked';
}

/** The RunDef behind a rung, or null while that run hasn't landed in runs.ts yet. */
export function rungRun(index: number): RunDef | null {
  const id = LADDER_RUNG_IDS[index];
  if (!id || !isKnownRunId(id)) return null;
  return getRunById(id);
}

/** True when `runId` is one of the ladder's rungs. */
export function isLadderRunId(runId: string): boolean {
  return LADDER_RUNG_IDS.includes(runId);
}
