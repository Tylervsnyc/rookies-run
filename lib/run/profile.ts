/**
 * Rookie's Revenge — player profile (local-first meta-progression).
 *
 * ONE object in localStorage: difficulty, unlocked abilities, earned
 * achievements, lifetime counters. Every read goes through `readProfile()`,
 * every write through `updateProfile()`. Sync to Supabase later — the shape
 * is JSON-safe on purpose.
 */

import { ALL_ABILITY_IDS, type AbilityId } from './abilities';
import { isPlayerFacing, stageOf } from '../content/pipeline';
import {
  ACHIEVEMENTS,
  bumpCounters,
  evaluateAchievements,
  type AchievementDef,
  type Counters,
  type RunEvent,
} from './achievements';
import { DEFAULT_DIFFICULTY, isDifficultyId, type DifficultyId } from './difficulty';
import { ladderUnlockedAbilities } from './ladder';

export const PROFILE_KEY = 'rookies-revenge-profile-v1';

/**
 * What a brand-new player holds. Knight Hop first — the tutorial teaches it:
 * a rook alone usually can't reach the king, so she borrows the knight's legs.
 * Surge + Freeze Ray are the other two ways to close the gap. (Drones was cut —
 * a swarm doesn't fit a king-hunt.)
 */
export const STARTER_KIT_CATALOG: ReadonlyArray<AbilityId> = [
  'knight-hop',
  'surge',
  'freeze-ray',
  // Squire — a knight you control. In the kit once approved in the registry.
  'summon-knight',
];

/**
 * What a brand-new player actually holds: the kit catalog filtered to
 * approved|live content in `data/content/pipeline.json`. Anything still in
 * `testing` (Squire, 2026-08-31) is only reachable via `?loadout=`.
 */
export const STARTER_ABILITIES: ReadonlyArray<AbilityId> = STARTER_KIT_CATALOG.filter((id) => isPlayerFacing(id));

/**
 * Cut from Revenge (stage `retired` in the registry). Stripped from saved
 * profiles on load so old kits lose them.
 */
export const RETIRED_ABILITIES: ReadonlySet<string> = new Set(ALL_ABILITY_IDS.filter((id) => stageOf(id) === 'retired'));

export interface EarnedAchievement {
  unlockedAt: string; // ISO
  seen: boolean;
}

/** One rung's result at one difficulty. */
export interface LadderAttempt {
  cleared: boolean;
  bestLevels: number;
  score: number;
}

/**
 * A rung's stored result. The top-level fields are the AGGREGATE across every
 * difficulty (`cleared` = cleared on ANY mode, which is what opens the next
 * rung) — they are exactly the pre-2026-09-07 shape, so profiles saved before
 * per-difficulty tracking keep working untouched. `byDifficulty` is the new
 * per-mode breakdown and is absent on those old saves.
 */
export interface LadderRungResult extends LadderAttempt {
  byDifficulty?: Partial<Record<DifficultyId, LadderAttempt>>;
}

export interface PlayerProfile {
  v: 1;
  createdAt: string;
  difficulty: DifficultyId;
  unlockedAbilities: AbilityId[];
  achievements: Record<string, EarnedAchievement>;
  counters: Counters;
  bestByDifficulty: Partial<Record<DifficultyId, { levels: number; score: number }>>;
  /** The Ladder — best result per rung run id (see lib/run/ladder.ts). */
  ladder: Record<string, LadderRungResult>;
  /** Best star count per difficulty per run id (lib/run/scoring starsForRun). */
  bestStars?: Record<string, Record<string, number>>;
}

export function freshProfile(now = new Date()): PlayerProfile {
  return foldLadderUnlocks({
    v: 1,
    createdAt: now.toISOString(),
    difficulty: DEFAULT_DIFFICULTY,
    unlockedAbilities: [...STARTER_ABILITIES],
    achievements: {},
    counters: {},
    bestByDifficulty: {},
    ladder: {},
  });
}

/**
 * Fold THE LADDER's derived grants into a profile's unlocked set.
 *
 * The ladder grants the kit of every rung that is open or cleared
 * (`ladderUnlockedAbilities`) — rung 1 is always open, so even a brand new
 * profile can be offered the cards rung 1's finale requires, and clearing a
 * rung unlocks exactly what the next one needs. Derived from each RunDef's own
 * `allowedAbilities`, so there is no second list to drift.
 *
 * Idempotent, additive, and applied on EVERY load: an ability is never taken
 * away, and a profile saved before this shipped picks its grants up silently.
 */
function foldLadderUnlocks(p: PlayerProfile): PlayerProfile {
  const set = new Set<AbilityId>(p.unlockedAbilities);
  const before = set.size;
  for (const id of ladderUnlockedAbilities(p)) set.add(id);
  return set.size === before ? p : { ...p, unlockedAbilities: [...set] };
}

const KNOWN_ABILITIES = new Set<string>(ALL_ABILITY_IDS);

/** Shape-check any JSON blob into a well-formed profile (used by the cloud merge too). */
export function sanitizeProfile(raw: unknown): PlayerProfile {
  return sanitize(raw);
}

function sanitize(raw: unknown): PlayerProfile {
  const p = freshProfile();
  // NOT an early return on a missing/!object raw: the achievement and ladder
  // folds at the bottom must run for a brand-new profile too.
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<PlayerProfile>;
  if (typeof r.createdAt === 'string') p.createdAt = r.createdAt;
  if (isDifficultyId(r.difficulty)) p.difficulty = r.difficulty;
  if (Array.isArray(r.unlockedAbilities)) {
    const set = new Set<AbilityId>(STARTER_ABILITIES);
    for (const id of r.unlockedAbilities) {
      // Only player-facing content survives a reload: retired kits AND
      // still-in-testing abilities (a dev-hook session can leave one behind).
      if (typeof id === 'string' && KNOWN_ABILITIES.has(id) && !RETIRED_ABILITIES.has(id) && isPlayerFacing(id)) {
        set.add(id as AbilityId);
      }
    }
    p.unlockedAbilities = [...set];
  }
  if (r.achievements && typeof r.achievements === 'object') {
    for (const [id, e] of Object.entries(r.achievements)) {
      if (e && typeof e === 'object' && typeof (e as EarnedAchievement).unlockedAt === 'string') {
        p.achievements[id] = { unlockedAt: (e as EarnedAchievement).unlockedAt, seen: !!(e as EarnedAchievement).seen };
      }
    }
  }
  if (r.counters && typeof r.counters === 'object') {
    for (const [k, v] of Object.entries(r.counters)) {
      if (typeof v === 'number' && Number.isFinite(v)) p.counters[k] = v;
    }
  }
  if (r.bestByDifficulty && typeof r.bestByDifficulty === 'object') {
    p.bestByDifficulty = { ...(r.bestByDifficulty as PlayerProfile['bestByDifficulty']) };
  }
  if (r.bestStars && typeof r.bestStars === 'object') {
    const out: Record<string, Record<string, number>> = {};
    for (const [d, runs] of Object.entries(r.bestStars)) {
      if (!runs || typeof runs !== 'object') continue;
      for (const [runId, n] of Object.entries(runs as Record<string, unknown>)) {
        if (typeof n === 'number' && Number.isFinite(n) && n > 0) (out[d] ??= {})[runId] = Math.min(3, Math.round(n));
      }
    }
    if (Object.keys(out).length > 0) p.bestStars = out;
  }
  if (r.ladder && typeof r.ladder === 'object') {
    for (const [runId, entry] of Object.entries(r.ladder)) {
      if (!entry || typeof entry !== 'object') continue;
      const e = entry as Partial<LadderRungResult>;
      const next: LadderRungResult = {
        cleared: !!e.cleared,
        bestLevels: typeof e.bestLevels === 'number' && Number.isFinite(e.bestLevels) ? e.bestLevels : 0,
        score: typeof e.score === 'number' && Number.isFinite(e.score) ? e.score : 0,
      };
      // Per-difficulty breakdown (added 2026-09-07). Absent on older saves —
      // those keep only the aggregate, and bestClearedDifficulty reports the
      // Normal the old ladder forced.
      if (e.byDifficulty && typeof e.byDifficulty === 'object') {
        const by: Partial<Record<DifficultyId, LadderAttempt>> = {};
        for (const [d, a] of Object.entries(e.byDifficulty as Record<string, unknown>)) {
          if (!isDifficultyId(d) || !a || typeof a !== 'object') continue;
          const at = a as Partial<LadderAttempt>;
          by[d] = {
            cleared: !!at.cleared,
            bestLevels: typeof at.bestLevels === 'number' && Number.isFinite(at.bestLevels) ? at.bestLevels : 0,
            score: typeof at.score === 'number' && Number.isFinite(at.score) ? at.score : 0,
          };
        }
        if (Object.keys(by).length > 0) next.byDifficulty = by;
      }
      p.ladder[runId] = next;
    }
  }
  // Achievements already earned always grant their ability (handles catalog
  // edits + abilities that shipped after the achievement was earned).
  for (const a of ACHIEVEMENTS) {
    if (a.unlocks && p.achievements[a.id] && KNOWN_ABILITIES.has(a.unlocks)) {
      if (!p.unlockedAbilities.includes(a.unlocks as AbilityId)) {
        p.unlockedAbilities.push(a.unlocks as AbilityId);
      }
    }
  }
  // THE LADDER grants the kits of the rungs it has opened. Achievements above
  // stay a parallel path — both are additive, neither removes anything.
  return foldLadderUnlocks(p);
}

let cache: PlayerProfile | null = null;

/**
 * Optional observer of every persisted write — the cloud sync
 * (lib/run/profile-sync.ts) registers here when a player is signed in and
 * CLOUD_PROFILE is on. Kept as a plain callback so profile.ts stays free of
 * Supabase imports and the tsx unit test needs no browser.
 */
let writeHook: ((p: PlayerProfile) => void) | null = null;

export function registerProfileWriteHook(fn: ((p: PlayerProfile) => void) | null): void {
  writeHook = fn;
}

export function readProfile(): PlayerProfile {
  if (cache) return cache;
  if (typeof window === 'undefined') return freshProfile();
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    cache = sanitize(raw ? JSON.parse(raw) : null);
  } catch {
    cache = freshProfile();
  }
  return cache;
}

export function writeProfile(input: PlayerProfile): void {
  // Every persisted profile carries the kits of the rungs it has opened. Doing
  // it HERE (the one funnel) means clearing rung N grants rung N+1's kit
  // immediately, in-session — not only after the next page load.
  const p = foldLadderUnlocks(input);
  cache = p;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    window.dispatchEvent(new CustomEvent('rookies-profile-changed'));
  } catch {
    /* quota / private mode — keep the in-memory copy */
  }
  // Cloud push (debounced inside the hook). Never throws into game code.
  if (writeHook) {
    try {
      writeHook(p);
    } catch {
      /* sync is best-effort */
    }
  }
}

/**
 * Feed a profile that arrived from OUTSIDE the reducer (the cloud merge)
 * through the same sanitizer a localStorage load gets, then persist it.
 * Returns the sanitized, folded profile that is now the live one.
 */
export function replaceProfile(raw: unknown): PlayerProfile {
  const p = sanitize(raw);
  writeProfile(p);
  return p;
}

// ---------------------------------------------------------------------------
// Merge — two copies of one player's progress (localStorage vs cloud).
// Pure; no I/O. See lib/run/profile-sync.ts for when it runs.
// ---------------------------------------------------------------------------

function mergeAttempt(a: LadderAttempt | undefined, b: LadderAttempt | undefined): LadderAttempt | undefined {
  if (!a) return b;
  if (!b) return a;
  return {
    cleared: a.cleared || b.cleared,
    bestLevels: Math.max(a.bestLevels, b.bestLevels),
    score: Math.max(a.score, b.score),
  };
}

/**
 * Union two profiles so NOTHING is ever lost:
 *
 * - `difficulty` — local wins (it is what the player is looking at right now).
 * - `createdAt` — the earlier of the two.
 * - `unlockedAbilities` — set union, local order first.
 * - `achievements` — union; when both have one, the EARLIEST `unlockedAt` and
 *   `seen` if either side has seen it (never re-toast an old trophy).
 * - `counters` — per key, the max (they only ever go up on either side).
 * - `bestByDifficulty` — per difficulty, more levels wins, then higher score.
 * - `bestStars` — per difficulty per run, the max.
 * - `ladder` — per rung, aggregate AND per-difficulty entries merged the same
 *   way `recordLadderResult` does: cleared never regresses, bests are maxes.
 *
 * Deterministic and commutative except for the two "local wins" rules
 * (difficulty, ability order). Neither input is mutated.
 */
export function mergeProfiles(local: PlayerProfile, remote: PlayerProfile): PlayerProfile {
  const abilities = new Set<AbilityId>([...local.unlockedAbilities, ...remote.unlockedAbilities]);

  const achievements: Record<string, EarnedAchievement> = {};
  for (const id of new Set([...Object.keys(local.achievements), ...Object.keys(remote.achievements)])) {
    const a = local.achievements[id];
    const b = remote.achievements[id];
    if (a && b) {
      achievements[id] = {
        unlockedAt: a.unlockedAt <= b.unlockedAt ? a.unlockedAt : b.unlockedAt,
        seen: a.seen || b.seen,
      };
    } else {
      achievements[id] = { ...(a ?? b)! };
    }
  }

  const counters: Counters = { ...local.counters };
  for (const [k, v] of Object.entries(remote.counters)) {
    counters[k] = Math.max(counters[k] ?? 0, v);
  }

  const bestByDifficulty: PlayerProfile['bestByDifficulty'] = { ...local.bestByDifficulty };
  for (const [d, r] of Object.entries(remote.bestByDifficulty) as Array<[DifficultyId, { levels: number; score: number }]>) {
    const cur = bestByDifficulty[d];
    if (!cur || r.levels > cur.levels || (r.levels === cur.levels && r.score > cur.score)) {
      bestByDifficulty[d] = { ...r };
    }
  }

  let bestStars: PlayerProfile['bestStars'] | undefined;
  if (local.bestStars || remote.bestStars) {
    bestStars = {};
    for (const src of [local.bestStars ?? {}, remote.bestStars ?? {}]) {
      for (const [d, runs] of Object.entries(src)) {
        const out = (bestStars[d] ??= {});
        for (const [runId, n] of Object.entries(runs)) out[runId] = Math.max(out[runId] ?? 0, n);
      }
    }
  }

  const ladder: Record<string, LadderRungResult> = {};
  for (const runId of new Set([...Object.keys(local.ladder), ...Object.keys(remote.ladder)])) {
    const a = local.ladder[runId];
    const b = remote.ladder[runId];
    const agg = mergeAttempt(a, b)!;
    const next: LadderRungResult = { cleared: agg.cleared, bestLevels: agg.bestLevels, score: agg.score };
    if (a?.byDifficulty || b?.byDifficulty) {
      const by: Partial<Record<DifficultyId, LadderAttempt>> = {};
      const keys = new Set([...Object.keys(a?.byDifficulty ?? {}), ...Object.keys(b?.byDifficulty ?? {})]) as Set<DifficultyId>;
      for (const d of keys) {
        const m = mergeAttempt(a?.byDifficulty?.[d], b?.byDifficulty?.[d]);
        if (m) by[d] = m;
      }
      next.byDifficulty = by;
    }
    ladder[runId] = next;
  }

  const merged: PlayerProfile = {
    v: 1,
    createdAt: local.createdAt <= remote.createdAt ? local.createdAt : remote.createdAt,
    difficulty: local.difficulty,
    unlockedAbilities: [...abilities],
    achievements,
    counters,
    bestByDifficulty,
    ladder,
  };
  if (bestStars && Object.keys(bestStars).length > 0) merged.bestStars = bestStars;
  return foldLadderUnlocks(merged);
}

/** Cheap structural equality for "did the merge change anything" checks. */
export function profilesEqual(a: PlayerProfile, b: PlayerProfile): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function updateProfile(fn: (p: PlayerProfile) => PlayerProfile): PlayerProfile {
  const next = fn(readProfile());
  writeProfile(next);
  return next;
}

/** Dev / QA: wipe progression. */
export function resetProfile(): void {
  cache = null;
  if (typeof window !== 'undefined') localStorage.removeItem(PROFILE_KEY);
}

// ---------------------------------------------------------------------------
// The one reducer: event → counters → achievements → unlocks
// ---------------------------------------------------------------------------

export interface RunEventResult {
  profile: PlayerProfile;
  earned: AchievementDef[];
  /** Abilities newly unlocked by `earned` (only ids that exist in the game). */
  unlockedAbilities: AbilityId[];
}

export function applyRunEvent(ev: RunEvent, now = new Date()): RunEventResult {
  const prev = readProfile();
  const counters = { ...prev.counters };
  bumpCounters(counters, ev);
  const earnedSet = new Set(Object.keys(prev.achievements));
  const earned = evaluateAchievements(counters, earnedSet, ev);
  const achievements = { ...prev.achievements };
  const unlocked = new Set(prev.unlockedAbilities);
  const newly: AbilityId[] = [];
  for (const a of earned) {
    achievements[a.id] = { unlockedAt: now.toISOString(), seen: false };
    if (a.unlocks && KNOWN_ABILITIES.has(a.unlocks) && !unlocked.has(a.unlocks as AbilityId)) {
      unlocked.add(a.unlocks as AbilityId);
      newly.push(a.unlocks as AbilityId);
    }
  }
  const profile: PlayerProfile = {
    ...prev,
    counters,
    achievements,
    unlockedAbilities: [...unlocked],
  };
  writeProfile(profile);
  return { profile, earned, unlockedAbilities: newly };
}

export function markAchievementsSeen(ids: string[]): void {
  if (ids.length === 0) return;
  updateProfile((p) => {
    const achievements = { ...p.achievements };
    for (const id of ids) if (achievements[id]) achievements[id] = { ...achievements[id], seen: true };
    return { ...p, achievements };
  });
}

export function setDifficulty(d: DifficultyId): PlayerProfile {
  return updateProfile((p) => ({ ...p, difficulty: d }));
}

export function recordBest(d: DifficultyId, levels: number, score: number): void {
  updateProfile((p) => {
    const cur = p.bestByDifficulty[d];
    if (cur && (cur.levels > levels || (cur.levels === levels && cur.score >= score))) return p;
    return { ...p, bestByDifficulty: { ...p.bestByDifficulty, [d]: { levels, score } } };
  });
}

/** Stars on a completed run — keeps the max per difficulty per run id. */
export function recordBestStars(d: DifficultyId, runId: string, stars: number): void {
  if (stars <= 0) return;
  updateProfile((p) => {
    const cur = p.bestStars?.[d]?.[runId] ?? 0;
    if (cur >= stars) return p;
    return { ...p, bestStars: { ...(p.bestStars ?? {}), [d]: { ...(p.bestStars?.[d] ?? {}), [runId]: stars } } };
  });
}

/**
 * The Ladder — record a finished rung attempt.
 *
 * Writes BOTH the aggregate (top-level, unchanged shape: `cleared` never
 * regresses to false, `bestLevels`/`score` only improve — this is what opens
 * the next rung, on ANY difficulty) and the per-difficulty entry under
 * `byDifficulty[d]`. `d` is optional so any old caller still compiles; it
 * defaults to Normal, which is the only mode the ladder used to allow.
 */
export function recordLadderResult(
  runId: string,
  levels: number,
  score: number,
  cleared: boolean,
  d: DifficultyId = 'normal',
): PlayerProfile {
  return updateProfile((p) => {
    const cur = p.ladder[runId];
    const merge = (a: LadderAttempt | undefined): LadderAttempt => ({
      cleared: (a?.cleared ?? false) || cleared,
      bestLevels: Math.max(a?.bestLevels ?? 0, levels),
      score: Math.max(a?.score ?? 0, score),
    });
    const agg = merge(cur);
    const curForD = cur?.byDifficulty?.[d];
    const next: LadderRungResult = {
      ...agg,
      byDifficulty: { ...(cur?.byDifficulty ?? {}), [d]: merge(curForD) },
    };
    const unchanged =
      cur &&
      cur.cleared === next.cleared &&
      cur.bestLevels === next.bestLevels &&
      cur.score === next.score &&
      curForD &&
      curForD.cleared === next.byDifficulty![d]!.cleared &&
      curForD.bestLevels === next.byDifficulty![d]!.bestLevels &&
      curForD.score === next.byDifficulty![d]!.score;
    if (unchanged) return p;
    return { ...p, ladder: { ...p.ladder, [runId]: next } };
  });
}

/** Abilities that exist in the game AND some achievement can unlock (or are starters). */
export function unlockableAbilityIds(): AbilityId[] {
  const set = new Set<AbilityId>(STARTER_ABILITIES);
  for (const a of ACHIEVEMENTS) {
    if (a.unlocks && KNOWN_ABILITIES.has(a.unlocks)) set.add(a.unlocks as AbilityId);
  }
  return [...set];
}
