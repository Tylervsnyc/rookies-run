/**
 * ENDLESS — the mode where the KIT is random and the LEVELS have to cope.
 *
 * Why it exists (Tyler, 2026-09-07): "all the ladder runs are so dependent on
 * the abilities of the run, so there needs to be an endless mode where you
 * randomly pick 5 abilities and see how far you can get."
 *
 * The Ladder's newer runs are combo-GATED — each is authored so exactly one
 * ability PAIR beats its finale (see `RunDef.abilityTierCaps` and
 * `data/run-playtest/finale-remeasure-2026-09-06.json`). That makes every run
 * a riddle with one answer, and a random kit useless. Endless inverts it: roll
 * a kit first, then serve levels that a kit — any kit — can actually solve.
 *
 * Shape of a session:
 *   - 5 abilities rolled from EVERY player-facing card (approved|live in the
 *     content pipeline). NOT the player's unlocked set — Endless must not
 *     depend on ladder progress.
 *   - Those 5 are the session's OFFER POOL (BoardState.testkit), exactly the
 *     way the daily's four work (lib/run/daily-kit.ts). You still hold up to
 *     MAX_OWNED_ABILITIES at a time and still upgrade through offers.
 *   - Levels stream in from the whole library, escalating FOREVER (see
 *     `endlessRamp`). There is no last level and no win screen.
 *   - ONE life. No retries at any depth, whatever the difficulty mode says.
 *     Fail = session over. Score = levels cleared.
 *
 * Everything is derived from ONE integer seed, so the session survives a
 * reload through the URL (`/?endless=<seed>`) with no stored state.
 *
 * ── THE LEVEL-SELECTION RULE (written down because it is the whole design) ──
 *
 * A level goes in the pool unless one of these two says it is pair-gated:
 *
 *   RULE A — the run's own offer pool.  A run whose `allowedAbilities` is a
 *   SHORT list (<= COMBO_RUN_POOL_MAX ids) is a COMBO run: authored around one
 *   pair, and validated ONLY with that pair. EVERY level of it is excluded —
 *   not just the finale.
 *
 *   That is deliberately blunter than the design intent, because the design
 *   intent does not hold: an audit on 2026-09-07 found revenge-12's L9 gate
 *   BROKEN (a single card clears it 69%), i.e. the documented "L7-L10 is the
 *   gate, L1-L6 is the teaching half" split is not reliable across the
 *   library. With no per-level measurement for a combo run's early levels
 *   either, the honest move is to keep the whole run out. Today this drops
 *   revenge-12 and revenge-13 (4 cards each); the other 12 player-facing runs
 *   carry the full 23-card pool and stay.
 *
 *   What stands behind the 12 that remain is not silence — it is the DAILY.
 *   Every day, `lib/run/daily-kit.ts` serves one of those runs end-to-end with
 *   a RANDOM FOUR-card kit. Endless serves the same levels with a random FIVE.
 *   That is the closest thing to a live measurement the library has, and it is
 *   why "no measurement -> exclude" is applied to combo runs (never daily-run
 *   levels, and narrow by construction) rather than to the whole catalogue,
 *   which would leave Endless with nothing to serve.
 *
 *   RULE B — the measurement.  `finale-remeasure-2026-09-06.json` records, per
 *   run, what each loadout cleared on L7-L10. A level where EVERY single-card
 *   loadout reads below SINGLE_CLEAR_FLOOR% while some PAIR reads at or above
 *   PAIR_CLEAR_CEILING% is gated by evidence, and is excluded. This currently
 *   fires on revenge-13 L8-L10 (confirming Rule A) and on revenge-14..27,
 *   which are all still `testing` — so it costs nothing today and does the
 *   right thing automatically the moment one of them is approved.
 *
 * NOT used: the runtime solver (`lib/run/solver.ts`). Its contract is
 * one-sided — it returns "not proven unwinnable" for anything it cannot model
 * (allies, drones, most abilities, no move limit), so at level START it would
 * clear essentially every position. It is a fail-safe, not a filter. The
 * honest pre-check is the measured data above.
 */

import { ALL_ABILITY_IDS, type AbilityId } from './abilities';
import { isPlayerFacing } from '../content/pipeline';
import { mulberry32 } from './seed';
import { REVENGE_RUN_IDS, getRunById } from './runs';
import type { DifficultyId } from './difficulty';
import type { RunPuzzle } from './types';
import remeasureRaw from '../../data/run-playtest/finale-remeasure-2026-09-06.json';

/** URL/leaderboard id. Distinct so Endless never pollutes a daily run's board. */
export const ENDLESS_RUN_ID = 'endless';
/** How many powers a session rolls. */
export const ENDLESS_KIT_SIZE = 5;
/** Personal best, localStorage. */
export const ENDLESS_BEST_KEY = 'rookies-revenge-endless-best';

/**
 * Kill switch, same shape as the one game flag this repo already has
 * (`NEXT_PUBLIC_HOME_CLASSIC` in app/page.tsx). On by default; set
 * `NEXT_PUBLIC_ENDLESS=0` to take the entry point and the mode away.
 */
export const ENDLESS_ENABLED = process.env.NEXT_PUBLIC_ENDLESS !== '0';

/** A run with at most this many offerable cards was authored around one pair. */
const COMBO_RUN_POOL_MAX = 6;
/** Rule B: no single card may reach this clear-% ... */
const SINGLE_CLEAR_FLOOR = 20;
/** ... while some pair reaches this one. */
const PAIR_CLEAR_CEILING = 50;

type Remeasure = Record<string, Record<string, Record<string, number>>>;
const REMEASURE = remeasureRaw as Remeasure;

/** Every card a real player can be dealt (approved|live in the pipeline). */
export function endlessAbilityPool(): AbilityId[] {
  return ALL_ABILITY_IDS.filter((id) => isPlayerFacing(id));
}

/** Rule A — this run is a combo run (short authored offer pool). */
export function isComboRun(runId: string): boolean {
  const allowed = getRunById(runId).allowedAbilities;
  return !!allowed && allowed.length <= COMBO_RUN_POOL_MAX;
}

/**
 * Rule B — the remeasure says only a PAIR clears this level.
 *
 * A second, better measurement now exists:
 * `data/run-playtest/multi-route-audit-2026-09-07.json` (32 trials/cell, same
 * loadout -> level -> pct shape). It CONFIRMS Rule A rather than changing the
 * pool: it found revenge-12 L9 soloed by bishop-squire at 47% and L10 by
 * knight-hop at 38% — the documented "one pair only" gate is broken there —
 * which is exactly why Rule A drops combo runs whole instead of trusting the
 * L7-L10 split. It is deliberately NOT imported here: it is a live artifact
 * another job is still writing, and a half-written JSON would break the build.
 * When a NEW combo run is approved, fold its audited cells into this function
 * (same predicate, same thresholds) instead of widening Rule A.
 */
export function isMeasuredPairGate(runId: string, level: number): boolean {
  const loads = REMEASURE[runId];
  if (!loads) return false;
  const singles: number[] = [];
  const pairs: number[] = [];
  for (const [name, byLevel] of Object.entries(loads)) {
    const pct = byLevel[String(level)];
    if (typeof pct !== 'number') continue;
    (name.includes('+') ? pairs : singles).push(pct);
  }
  if (singles.length === 0 || pairs.length === 0) return false;
  return singles.every((s) => s < SINGLE_CLEAR_FLOOR) && pairs.some((p) => p >= PAIR_CLEAR_CEILING);
}

/** The one predicate. `level` is 1-based, matching the run's own numbering. */
export function isPairGatedLevel(runId: string, level: number): boolean {
  if (isComboRun(runId)) return true;
  return isMeasuredPairGate(runId, level);
}

/** One level in the library, with the difficulty estimate Endless orders by. */
export interface EndlessLevelRef {
  runId: string;
  /** 0-based index into RunDef.levels (what puzzleForDate wants). */
  levelIndex: number;
  /**
   * Difficulty band 1-10 = the level's own number inside its run. The authored
   * escalation IS the difficulty estimate — every Revenge run ramps L1 -> L10,
   * and it is the only per-level signal the whole library shares.
   */
  band: number;
  /** For the HUD / share line. */
  runName: string;
}

/** Every level Endless is willing to serve, cheapest signal first. */
export function endlessLevelPool(): EndlessLevelRef[] {
  const pool: EndlessLevelRef[] = [];
  for (const runId of REVENGE_RUN_IDS) {
    const run = getRunById(runId);
    for (let i = 0; i < run.levels.length; i++) {
      const level = i + 1;
      if (isPairGatedLevel(runId, level)) continue;
      pool.push({ runId, levelIndex: i, band: Math.min(10, level), runName: run.name });
    }
  }
  return pool;
}

/** Which band step `step` (0-based) wants. Two levels per band, then band 10 forever. */
export function bandForStep(step: number): number {
  return Math.min(10, 1 + Math.floor(step / 2));
}

export interface EndlessSession {
  seed: number;
  /** The 5 rolled powers — the session's offer pool. */
  kit: AbilityId[];
  /**
   * THE CLIMB — the opening RAMP_STEPS levels, band 1 up to band 10, two per
   * band. This is the only part of a session that serves easy boards.
   */
  plan: EndlessLevelRef[];
  /**
   * THE DEEP — everything served after the climb, forever. Non-combo runs
   * only, band FAIR_DEPTH_MIN_BAND and up, minus whatever the climb already
   * used. At depth the ramp is already supplying the difficulty, so the level
   * itself must be BROAD — many routes, many kits — never a one-pair wall.
   * Shuffled afresh each lap; a repeat that deep is a different board because
   * `endlessRamp` has moved under it.
   */
  deepPool: EndlessLevelRef[];
}

function shuffled<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function newEndlessSeed(): number {
  return ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) || 1;
}

/** Deep levels only come from bands this high and up. */
const FAIR_DEPTH_MIN_BAND = 5;
/** Length of the opening climb: bands 1-10, two levels each. */
const RAMP_STEPS = 20;

/** Everything about a session, from one integer. Pure and stable. */
export function buildEndlessSession(seed: number): EndlessSession {
  const safe = (seed >>> 0) || 1;
  const kit = shuffled(endlessAbilityPool(), mulberry32(safe)).slice(0, ENDLESS_KIT_SIZE);

  // Buckets of remaining levels per band, each pre-shuffled by the same seed.
  const rng = mulberry32((safe * 2654435761) >>> 0);
  const all = shuffled(endlessLevelPool(), rng);
  const buckets = new Map<number, EndlessLevelRef[]>();
  for (const ref of all) {
    const b = buckets.get(ref.band) ?? [];
    b.push(ref);
    buckets.set(ref.band, b);
  }

  const plan: EndlessLevelRef[] = [];
  for (let step = 0; step < RAMP_STEPS; step++) {
    const want = bandForStep(step);
    // Prefer the band the climb asks for, then climb past it. NEVER fall back
    // to an easier band — the whole contract is that difficulty only rises.
    let pick: EndlessLevelRef | undefined;
    for (let b = want; b <= 10 && !pick; b++) pick = buckets.get(b)?.shift();
    if (!pick) break;
    plan.push(pick);
  }

  // Fairness at depth (Tyler 2026-09-07): "bias away from combo-gated finales
  // even harder as depth rises." Rule A already keeps revenge-12/13 out of
  // bands 7-10, so the deep pool is the broad-kit runs (revenge-1..11 +
  // crucible) by construction; the filter states it so it survives a new
  // combo run being approved.
  const used = new Set(plan.map((r) => `${r.runId}:${r.levelIndex}`));
  const deep = all.filter(
    (r) => r.band >= FAIR_DEPTH_MIN_BAND && !isComboRun(r.runId) && !used.has(`${r.runId}:${r.levelIndex}`),
  );

  return { seed: safe, kit, plan, deepPool: deep.length > 0 ? deep : all };
}

/**
 * The level for step `idx` (0-based). NEVER runs out and never gets easier:
 * the climb first (no repeats), then `deepPool` lapped with a lap-derived
 * shuffle. A player deep enough to see a board twice is many minutes in, and
 * the board they see again is not the board they saw — the ramp has moved.
 */
export function endlessLevelAt(session: EndlessSession, idx: number): EndlessLevelRef {
  if (idx < session.plan.length) return session.plan[idx];
  const past = idx - session.plan.length;
  const lap = 1 + Math.floor(past / session.deepPool.length);
  const within = past % session.deepPool.length;
  return shuffled(session.deepPool, mulberry32(((session.seed + lap * 0x9e3779b9) >>> 0) || 1))[within];
}

// ── The ramp — the one place Endless difficulty is tuned ─────────────────────

/**
 * ENDLESS GETS HARDER FOREVER (Tyler 2026-09-07: "increasingly harder and
 * harder until death"). Difficulty at depth `depth` (1-based level number)
 * comes from two stacked sources, both reusing shipped machinery:
 *
 *   1. THE MODE. Walk `lib/run/difficulty.ts` upward — no lock checks, Endless
 *      is not ladder progress:
 *        depth  1-4   Rookie     (still king early, +4 moves, -1 enemy/turn)
 *        depth  5-10  Normal     (the game as authored)
 *        depth 11-18  Hard       (fleeing king, +1 enemy/turn, -2 moves)
 *        depth 19+    Nightmare  (king reacts to allies, tempo cap 14)
 *
 *   2. THE OVERDRIVE, from depth OVERDRIVE_FROM on: every OVERDRIVE_EVERY
 *      levels adds +1 enemiesPerTurn and -1 moveLimit ON TOP of Nightmare,
 *      applied to the AUTHORED puzzle before `applyDifficulty` layers the mode
 *      (so `applyDifficulty`'s MOVE_LIMIT_FLOOR still protects the level from
 *      becoming physically impossible). Move limit is additionally floored
 *      here at MOVE_LIMIT_FLOOR, and enemiesPerTurn is capped at
 *      MAX_ENEMIES_PER_TURN so the enemy phase cannot run away with the clock.
 *
 * Retries are NOT part of the ramp: Endless is one life at every depth, which
 * app/page.tsx enforces by pinning `canRetry` to false for the mode.
 */
const OVERDRIVE_FROM = 19;
const OVERDRIVE_EVERY = 6;
const MOVE_LIMIT_FLOOR = 6;
const MAX_ENEMIES_PER_TURN = 6;

export interface EndlessRamp {
  difficulty: DifficultyId;
  /** Extra enemy moves per turn on top of the mode. */
  enemiesPerTurnDelta: number;
  /** Extra move-limit tightening on top of the mode (negative). */
  moveLimitDelta: number;
  /** 0 = no overdrive yet; 1, 2, 3 ... = how many overdrive steps are live. */
  overdrive: number;
}

export function endlessRamp(depth: number): EndlessRamp {
  const d = Math.max(1, Math.floor(depth));
  const difficulty: DifficultyId = d <= 4 ? 'rookie' : d <= 10 ? 'normal' : d <= 18 ? 'hard' : 'nightmare';
  const overdrive = d < OVERDRIVE_FROM ? 0 : 1 + Math.floor((d - OVERDRIVE_FROM) / OVERDRIVE_EVERY);
  return { difficulty, enemiesPerTurnDelta: overdrive, moveLimitDelta: -overdrive, overdrive };
}

/**
 * Apply the overdrive half of the ramp to an authored puzzle. The mode half is
 * applied downstream by `applyDifficulty` inside `puzzleToBoardState`, which is
 * handed `ramp.difficulty`. Pure; returns the puzzle untouched below
 * OVERDRIVE_FROM.
 */
export function applyEndlessRamp(puzzle: RunPuzzle, depth: number): RunPuzzle {
  const ramp = endlessRamp(depth);
  if (ramp.overdrive === 0) return puzzle;
  const out: RunPuzzle = { ...puzzle };
  out.enemiesPerTurn = Math.min(MAX_ENEMIES_PER_TURN, (puzzle.enemiesPerTurn ?? 1) + ramp.enemiesPerTurnDelta);
  if (typeof puzzle.moveLimit === 'number') {
    out.moveLimit = Math.max(MOVE_LIMIT_FLOOR, puzzle.moveLimit + ramp.moveLimitDelta);
  }
  return out;
}

/** Short HUD line for the current depth, e.g. "HARD" or "NIGHTMARE +2". */
export function endlessRampLabel(depth: number): string {
  const r = endlessRamp(depth);
  const name = r.difficulty.toUpperCase();
  return r.overdrive > 0 ? `${name} +${r.overdrive}` : name;
}

// ── Personal best (localStorage, fails soft like the rest of the app) ────────

export function readEndlessBest(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const n = parseInt(localStorage.getItem(ENDLESS_BEST_KEY) ?? '', 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

/** Stores `levels` if it beats the stored best. Returns true when it did. */
export function recordEndlessBest(levels: number): boolean {
  if (typeof window === 'undefined') return false;
  if (!Number.isFinite(levels) || levels <= 0) return false;
  try {
    if (levels <= readEndlessBest()) return false;
    localStorage.setItem(ENDLESS_BEST_KEY, String(levels));
    return true;
  } catch {
    return false;
  }
}
