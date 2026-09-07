/**
 * Rookie's Revenge — The Ladder. A fixed 10-rung progression, easiest to
 * hardest, rebuilt 2026-09-07 on the COMBO-GATED runs (revenge-12..26) that
 * shipped 2026-09-05/06. The old ladder listed revenge-1..10, none of which
 * are built to the combo gate.
 *
 * ── HOW THE TEN WERE CHOSEN ────────────────────────────────────────────────
 * Eligibility, all three required:
 *   1. Pipeline stage `testing` or better (`idea` runs — The Alley, The
 *      Candle, The Hearth, The Warren — honestly failed their gate and are
 *      excluded).
 *   2. A MET combo gate in the run's own MEASURED block: every single card in
 *      its 4-card kit <= 8% on L7-L10, the signature pair >= 60%.
 *   3. EVERY CARD IN THE KIT IS A `live` ABILITY. This one is load-bearing:
 *      `sanitize()` in profile.ts strips any ability that is not player-facing,
 *      so a kit containing a TESTING ability (snare, shove, coup, hourglass,
 *      scarecrow) can never be granted to a real player and the run would be
 *      unplayable on the ladder. That rules out The Hayloft (scarecrow), The
 *      Squint (coup), The Quarry (shove + hourglass) — all three are
 *      /playtest-only by design, which is correct, not a bug.
 *
 * Distinctness: every rung has a DIFFERENT signature ability pair and a
 * DIFFERENT terrain signature. Collisions resolved:
 *   - bishop-squire + swap: The Moat (revenge-12) over The Colonnade (13).
 *   - become-king + boulder: The Alcove (25) over The Keep (26) — the Alcove's
 *     pair reads 67% avg, inside Tyler's 60-80% band; the Keep reads 90%.
 *   - "king in a box" terrain: The Glasshouse (18) over The Vault (14).
 *
 * ORDER = THE POWER CURVE, not the clear rate (Tyler, 2026-09-07: "we should
 * save dragon for like the last ability since it's so powerful"). The rungs run
 * from cards that extend what a starter already does (Boulder, Vanguard) up to
 * the ones that rewrite the board (Become King, Convert, Dragon).
 *
 * This REPLACED an order by measured random-pick clear rate, and the two
 * genuinely disagree: the Dragon runs measured as the EASIEST full runs (Briar
 * 55%), which put Dragon on rung 1 and handed it to a brand-new profile on
 * first launch. They measured easy *because* Dragon is strong enough that a
 * careless picker still wins — so clear rate was reading power as gentleness.
 * The ladder's job is unlocking, so power sets the order; difficulty is fixed
 * per-run instead (see the finale rework below).
 *
 *  #  run         name            signature pair            unlocks       pair avg
 *  1  revenge-21  The Slash       boulder + knight-hop      Boulder         100
 *  2  revenge-18  The Glasshouse  freeze-ray + vanguard     Vanguard         88
 *  3  revenge-15  The Stacks      magnet + boulder          Decoy           100
 *  4  revenge-23  The Parapet     knight-hop + twin         Twin            100
 *  5  revenge-12  The Moat        bishop-squire + swap      Swap, Squire      —
 *  6  revenge-24  The Lattice     duchess + decoy           Duchess          94
 *  7  revenge-25  The Alcove      become-king + boulder     Become King      67
 *  8  revenge-19  The Cliff       convert + summon-knight   Convert          71
 *  9  revenge-22  The Millstone   dragon + duchess          DRAGON           79
 * 10  revenge-17  The Briar       dragon + sacrifice        Sacrifice        79
 *
 * The grants are unchanged in total (17 abilities) — only when you get them.
 *
 * ── KNOWN DEBT: the gate is a floor with no ceiling ────────────────────────
 * `pair avg` above is the pair's mean clear rate on L7-L10
 * (`data/run-playtest/finale-remeasure-2026-09-06.json`). A run qualifies at
 * >= 60%, which proves the combo is REQUIRED but never that it is HARD — and
 * The Slash, The Stacks and The Parapet all read 100/100/100/100, i.e. the
 * finale solves itself the moment you hold both cards. That is exactly the
 * "later levels are too easy" note from Tyler's 2026-09-07 playtest. The rule
 * should be a 60-80% BAND (The Alcove at 67 is the model). Adding the ceiling
 * to the nightly harness is queued; the three 100% finales are being reworked
 * first.
 *
 * ── UNLOCKS ────────────────────────────────────────────────────────────────
 * A combo run's kit NAMES the two cards its finale requires, and `rollOffer`
 * will not offer a card the player has not unlocked — so a fresh profile could
 * never be offered Dragon in the Dragon run. The ladder therefore GRANTS the
 * kit: every rung that is `open` or `cleared` contributes its own
 * `allowedAbilities` to the player's unlocked set (`ladderUnlockedAbilities`).
 * Rung 1 is always open, so its kit is unlocked from the first launch; clearing
 * rung N opens rung N+1, which unlocks exactly the cards rung N+1 needs.
 *
 * There is NO second hand-kept list — the grant is derived from the RunDef, so
 * editing a run's kit or reordering the ladder can never leave the two out of
 * sync. Achievements remain a parallel unlock path (profile.ts folds both), and
 * an ability once unlocked is never taken away.
 *
 * Ids that `isKnownRunId` can't resolve render as "Coming soon" rungs — never
 * crash, never fall back to RUNS[0].
 */

import type { AbilityId } from './abilities';
import { isPlayerFacing } from '../content/pipeline';
import { DIFFICULTY_ORDER, type DifficultyId } from './difficulty';
import { getRunById, isKnownRunId, type RunDef } from './runs';
import type { PlayerProfile } from './profile';

export const LADDER_RUNG_IDS: ReadonlyArray<string> = [
  'revenge-21', // The Slash       — boulder + knight-hop      -> Boulder
  'revenge-18', // The Glasshouse  — freeze-ray + vanguard     -> Vanguard
  'revenge-15', // The Stacks      — magnet + boulder          -> Decoy
  'revenge-23', // The Parapet     — knight-hop + twin         -> Twin
  'revenge-12', // The Moat        — bishop-squire + swap      -> Swap, Bishop Squire
  'revenge-24', // The Lattice     — duchess + decoy           -> Duchess
  'revenge-25', // The Alcove      — become-king + boulder     -> Become King
  'revenge-19', // The Cliff       — convert + summon-knight   -> Convert
  'revenge-22', // The Millstone   — dragon + duchess          -> DRAGON (latest possible)
  'revenge-17', // The Briar       — dragon + sacrifice        -> Sacrifice
];

export type RungState = 'locked' | 'open' | 'cleared';

function clearedRung(profile: PlayerProfile | undefined, runId: string | undefined): boolean {
  if (!runId) return false;
  return !!profile?.ladder?.[runId]?.cleared;
}

/**
 * Rung 1 (index 0) is always open; rung N opens once rung N-1 is cleared.
 *
 * A clear on ANY difficulty opens the next rung (Tyler, 2026-09-07): the
 * ladder is meant to be finished, and difficulty is the replay axis — stars
 * are recorded per mode (`rungStars`) so Hard still has something to earn.
 */
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

/** Index of `runId` on the ladder, or -1. */
export function ladderRungIndex(runId: string): number {
  return LADDER_RUNG_IDS.indexOf(runId);
}

// ---------------------------------------------------------------------------
// Unlocks — derived from the rungs' own kits. ONE source of truth.
// ---------------------------------------------------------------------------

/**
 * The cards a rung's run needs — its `allowedAbilities`, filtered to content a
 * real player may hold. An empty kit (a run with no allowlist) grants nothing.
 */
export function rungKit(index: number): AbilityId[] {
  const run = rungRun(index);
  if (!run?.allowedAbilities) return [];
  return (run.allowedAbilities as ReadonlyArray<string>).filter((id) => isPlayerFacing(id)) as AbilityId[];
}

/**
 * Every ability the ladder has granted this profile: the union of the kits of
 * all rungs currently `open` or `cleared`. Rung 1 is always open, so a brand
 * new profile already holds rung 1's kit and can be offered it on level 1.
 *
 * Derived, not stored — reordering the ladder or editing a run's kit can never
 * drift out of sync, and a profile saved before this shipped picks its grants
 * up on the next load (profile.ts folds this in `sanitize`).
 */
export function ladderUnlockedAbilities(profile: PlayerProfile | undefined): AbilityId[] {
  const out = new Set<AbilityId>();
  for (let i = 0; i < LADDER_RUNG_IDS.length; i++) {
    const st = rungState(profile, i);
    if (st === 'locked') continue;
    for (const id of rungKit(i)) out.add(id);
  }
  return [...out];
}

// ---------------------------------------------------------------------------
// Per-difficulty results
// ---------------------------------------------------------------------------

/** Did the player clear this rung on this difficulty? */
export function rungClearedOn(
  profile: PlayerProfile | undefined,
  runId: string,
  d: DifficultyId,
): boolean {
  return !!profile?.ladder?.[runId]?.byDifficulty?.[d]?.cleared;
}

/**
 * The HARDEST difficulty this rung has been cleared on, or null.
 * A profile saved before per-difficulty tracking has only the aggregate
 * `cleared` flag — report it as Normal, which is what the old ladder forced.
 */
export function bestClearedDifficulty(
  profile: PlayerProfile | undefined,
  runId: string,
): DifficultyId | null {
  const entry = profile?.ladder?.[runId];
  if (!entry?.cleared) return null;
  let best: DifficultyId | null = null;
  for (const d of DIFFICULTY_ORDER) {
    if (entry.byDifficulty?.[d]?.cleared) best = d;
  }
  return best ?? 'normal';
}

/** Stars earned on this rung at this difficulty (0-3). */
export function rungStars(
  profile: PlayerProfile | undefined,
  runId: string,
  d: DifficultyId,
): number {
  return profile?.bestStars?.[d]?.[runId] ?? 0;
}
