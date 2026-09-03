import { ABILITY_DEFS, type AbilityId } from './abilities';
import { unlockableAbilityIds } from './profile';
import { getRunById, isKnownRunId } from './runs';
import { getDailyOverride } from './daily';

/** How many powers a daily run offers. Tyler (2026-09-02): four, so it fits the home screen. */
export const DAILY_KIT_SIZE = 4;

/**
 * Today's kit — the ONE list of abilities a daily run offers, seeded by the
 * ISO date so the home screen and the run itself agree (Tyler 2026-09-03: the
 * home showed one set and the game offered another). Drawn from the run's
 * player-facing pool; ignores what the player has unlocked on purpose — the
 * daily is where you get to try powers before you've earned them.
 */
export function todaysAbilities(iso: string, runId: string, n: number = DAILY_KIT_SIZE): AbilityId[] {
  const run = isKnownRunId(runId) ? getRunById(runId) : null;
  const pool = (run?.allowedAbilities as AbilityId[] | undefined) ?? unlockableAbilityIds();
  const seedText = getDailyOverride(iso)?.kitSeed ?? iso;
  let seed = 0;
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n).filter((id) => id in ABILITY_DEFS);
}
