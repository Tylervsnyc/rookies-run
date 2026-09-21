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
 * The rungs, their signature pairs and what each unlocks are the comments on
 * LADDER_RUNG_IDS below. Their MEASURED difficulty is NOT recorded here — a
 * table in this header went stale within two days twice (2026-09-07/08). The
 * contract every rung must satisfy is docs/LADDER-SPEC.md; the current numbers
 * come from `npx tsx scripts/run-playtest/ladder-audit.ts` and live in the
 * results ledger under data/run-playtest/, stamped with the engine that
 * produced them.
 *
 * THE LADDER IS THE PRODUCT (Tyler, 2026-09-09): every rung is stage `live` in
 * data/content/pipeline.json, and `REVENGE_RUN_IDS` (daily pool + picker) is
 * exactly these ten runs. The assert below fails the build if a rung is ever
 * not player-facing — there is no second switch.
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

/**
 * ── BONUS RUNGS ("11" and "12") ─────────────────────────────────────────────
 * Tyler, 2026-09-20: two extra runs shown AFTER the ten rungs, tagged NEW, and
 * ALWAYS OPEN to everyone from first launch. They are deliberately a SEPARATE
 * list, not appended to LADDER_RUNG_IDS: the ten-rung spec, the nightly's one
 * job per rung, ladder-audit, the daily pool (REVENGE_RUN_IDS) and the power
 * curve all read LADDER_RUNG_IDS and must not see these.
 *
 *   - never gated by, and never gate, a regular rung;
 *   - a bonus rung that is NOT player-facing (pipeline stage below `approved`)
 *     simply does not exist for players: not rendered, not launchable as a
 *     ladder run, grants nothing. It never fails the build — it appears on its
 *     own the moment `pipeline.ts approve` makes it player-facing;
 *   - a visible bonus rung grants its kit exactly like an open regular rung
 *     (`ladderUnlockedAbilities`), and records results in `profile.ladder`
 *     under its run id like any rung.
 *
 * Kept on ONE line on purpose: `scripts/pipeline.ts lint` reads the regular
 * rungs out of this file by matching `'<id>', // comment` lines.
 *   revenge-64 The Hall of Mirrors (mirror + sacrifice) = "rung 11"
 *   revenge-65 The Kaleidoscope    (mirror + convert)   = "rung 12"
 *   revenge-61 The Baffle          (ricochet + boulder) = "rung 13" (Tyler, 2026-09-21)
 */
export const LADDER_BONUS_RUNG_IDS: ReadonlyArray<string> = ['revenge-64', 'revenge-65', 'revenge-61'];

const BONUS_PREVIEW_KEY = 'rr-bonus-preview';

/**
 * DEV-ONLY display override: `?bonusPreview=1` shows the bonus rungs even
 * while they are still `testing`, so the UI can be checked before approval.
 * Sticky for the tab (sessionStorage) so it survives the launch navigation;
 * `?bonusPreview=0` clears it. Always false in a production build and on the
 * server. It only affects visibility/launch — it never grants a kit.
 */
export function bonusPreviewActive(): boolean {
  if (process.env.NODE_ENV === 'production' || typeof window === 'undefined') return false;
  try {
    const q = new URLSearchParams(window.location.search).get('bonusPreview');
    if (q === '1') window.sessionStorage.setItem(BONUS_PREVIEW_KEY, '1');
    else if (q === '0') window.sessionStorage.removeItem(BONUS_PREVIEW_KEY);
    return window.sessionStorage.getItem(BONUS_PREVIEW_KEY) === '1';
  } catch {
    return false;
  }
}

export interface BonusRung {
  id: string;
  /** Display number: 11, 12, ... (its slot after the regular rungs — stable even if an earlier bonus rung is hidden). */
  rung: number;
  run: RunDef;
}

/**
 * The bonus rungs a player can see right now: player-facing AND resolvable.
 * `facing` is injectable for tests; `preview` is the dev-only display override.
 */
export function visibleBonusRungs(
  opts: { preview?: boolean; facing?: (id: string) => boolean } = {},
): BonusRung[] {
  const facing = opts.facing ?? isPlayerFacing;
  const out: BonusRung[] = [];
  LADDER_BONUS_RUNG_IDS.forEach((id, i) => {
    if (!(opts.preview || facing(id)) || !isKnownRunId(id)) return;
    out.push({ id, rung: LADDER_RUNG_IDS.length + i + 1, run: getRunById(id) });
  });
  return out;
}

/** A visible bonus rung is `open` until cleared — never `locked`. */
export function bonusRungState(profile: PlayerProfile | undefined, runId: string): Exclude<RungState, 'locked'> {
  return clearedRung(profile, runId) ? 'cleared' : 'open';
}

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
/**
 * DEMO BUILDS ONLY — every regular rung is open (Tyler 2026-09-20: "on the app
 * have all levels unlocked on ladder", for the TestFlight build he hands to
 * people). Baked in at build time: `NEXT_PUBLIC_LADDER_ALL_OPEN=1` at build time
 * (the npm script `build:offline:demo`). The website never sets it, so the
 * unlock order — and Dragon being saved for the last rung — is unchanged there.
 * An open rung grants its kit, so a demo build also unlocks every ladder card.
 * TURN IT OFF (build without the variable) before any App Store submission.
 */
export const LADDER_ALL_OPEN: boolean = process.env.NEXT_PUBLIC_LADDER_ALL_OPEN === '1';

export function rungState(profile: PlayerProfile | undefined, index: number): RungState {
  if (index < 0 || index >= LADDER_RUNG_IDS.length) return 'locked';
  if (clearedRung(profile, LADDER_RUNG_IDS[index])) return 'cleared';
  if (index === 0 || LADDER_ALL_OPEN) return 'open';
  return clearedRung(profile, LADDER_RUNG_IDS[index - 1]) ? 'open' : 'locked';
}

/** The RunDef behind a rung, or null while that run hasn't landed in runs.ts yet. */
export function rungRun(index: number): RunDef | null {
  const id = LADDER_RUNG_IDS[index];
  if (!id || !isKnownRunId(id)) return null;
  return getRunById(id);
}

/** True when `runId` is one of the ladder's rungs — a regular rung, or a bonus rung the player can currently see. */
export function isLadderRunId(runId: string, facing: (id: string) => boolean = isPlayerFacing): boolean {
  if (LADDER_RUNG_IDS.includes(runId)) return true;
  return visibleBonusRungs({ preview: bonusPreviewActive(), facing }).some((b) => b.id === runId);
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
  return kitOf(rungRun(index), isPlayerFacing);
}

function kitOf(run: RunDef | null, facing: (id: string) => boolean): AbilityId[] {
  if (!run?.allowedAbilities) return [];
  return (run.allowedAbilities as ReadonlyArray<string>).filter((id) => facing(id)) as AbilityId[];
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
export function ladderUnlockedAbilities(
  profile: PlayerProfile | undefined,
  facing: (id: string) => boolean = isPlayerFacing,
): AbilityId[] {
  const out = new Set<AbilityId>();
  for (let i = 0; i < LADDER_RUNG_IDS.length; i++) {
    const st = rungState(profile, i);
    if (st === 'locked') continue;
    for (const id of kitOf(rungRun(i), facing)) out.add(id);
  }
  // Bonus rungs are always open once player-facing, so their kits are always
  // granted — same derivation, same filter. (Never via the dev preview.)
  for (const b of visibleBonusRungs({ facing })) {
    for (const id of kitOf(b.run, facing)) out.add(id);
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
