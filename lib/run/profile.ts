/**
 * Rookie's Revenge — player profile (local-first meta-progression).
 *
 * ONE object in localStorage: difficulty, unlocked abilities, earned
 * achievements, lifetime counters. Every read goes through `readProfile()`,
 * every write through `updateProfile()`. Sync to Supabase later — the shape
 * is JSON-safe on purpose.
 */

import { ALL_ABILITY_IDS, type AbilityId } from './abilities';
import {
  ACHIEVEMENTS,
  bumpCounters,
  evaluateAchievements,
  type AchievementDef,
  type Counters,
  type RunEvent,
} from './achievements';
import { DEFAULT_DIFFICULTY, isDifficultyId, type DifficultyId } from './difficulty';

export const PROFILE_KEY = 'rookies-revenge-profile-v1';

/** What a brand-new player holds. Two finishers + one fun support. */
export const STARTER_ABILITIES: ReadonlyArray<AbilityId> = ['surge', 'freeze-ray', 'drones'];

export interface EarnedAchievement {
  unlockedAt: string; // ISO
  seen: boolean;
}

export interface PlayerProfile {
  v: 1;
  createdAt: string;
  difficulty: DifficultyId;
  unlockedAbilities: AbilityId[];
  achievements: Record<string, EarnedAchievement>;
  counters: Counters;
  bestByDifficulty: Partial<Record<DifficultyId, { levels: number; score: number }>>;
}

export function freshProfile(now = new Date()): PlayerProfile {
  return {
    v: 1,
    createdAt: now.toISOString(),
    difficulty: DEFAULT_DIFFICULTY,
    unlockedAbilities: [...STARTER_ABILITIES],
    achievements: {},
    counters: {},
    bestByDifficulty: {},
  };
}

const KNOWN_ABILITIES = new Set<string>(ALL_ABILITY_IDS);

function sanitize(raw: unknown): PlayerProfile {
  const p = freshProfile();
  if (!raw || typeof raw !== 'object') return p;
  const r = raw as Partial<PlayerProfile>;
  if (typeof r.createdAt === 'string') p.createdAt = r.createdAt;
  if (isDifficultyId(r.difficulty)) p.difficulty = r.difficulty;
  if (Array.isArray(r.unlockedAbilities)) {
    const set = new Set<AbilityId>(STARTER_ABILITIES);
    for (const id of r.unlockedAbilities) {
      if (typeof id === 'string' && KNOWN_ABILITIES.has(id)) set.add(id as AbilityId);
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
  // Achievements already earned always grant their ability (handles catalog
  // edits + abilities that shipped after the achievement was earned).
  for (const a of ACHIEVEMENTS) {
    if (a.unlocks && p.achievements[a.id] && KNOWN_ABILITIES.has(a.unlocks)) {
      if (!p.unlockedAbilities.includes(a.unlocks as AbilityId)) {
        p.unlockedAbilities.push(a.unlocks as AbilityId);
      }
    }
  }
  return p;
}

let cache: PlayerProfile | null = null;

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

export function writeProfile(p: PlayerProfile): void {
  cache = p;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    window.dispatchEvent(new CustomEvent('rookies-profile-changed'));
  } catch {
    /* quota / private mode — keep the in-memory copy */
  }
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

/** Abilities that exist in the game AND some achievement can unlock (or are starters). */
export function unlockableAbilityIds(): AbilityId[] {
  const set = new Set<AbilityId>(STARTER_ABILITIES);
  for (const a of ACHIEVEMENTS) {
    if (a.unlocks && KNOWN_ABILITIES.has(a.unlocks)) set.add(a.unlocks as AbilityId);
  }
  return [...set];
}
