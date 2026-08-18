/**
 * Rookie's Revenge — difficulty modes.
 *
 * Same levels, different knobs. Applied in ONE place (`applyDifficulty` in
 * seed.ts when a level is built); everything else reads `state.difficulty`.
 * The player's choice lives in the profile (lib/run/profile.ts).
 */

export type DifficultyId = 'rookie' | 'normal' | 'hard' | 'nightmare';

export interface DifficultyDef {
  id: DifficultyId;
  /** Display name. */
  name: string;
  /** Rookie's one-liner. */
  tagline: string;
  /** Added to each level's authored enemiesPerTurn (min 1). */
  enemiesPerTurnDelta: number;
  /** Added to each level's authored moveLimit (when it has one). */
  moveLimitDelta: number;
  /** Tempo cap on king levels (rank-8 classic levels keep TEMPO_MAX). */
  tempoMaxKing: number;
  /**
   * King behavior override. 'authored' keeps the level's own setting;
   * 'still-early' = still on L1–4 then authored; 'flee' = flee from L1.
   */
  king: 'still-early' | 'authored' | 'flee';
  /** Fleeing king also avoids squares rainbow allies attack (already true in v2 — nightmare adds reacting to ally moves). */
  kingReactsToAllies: boolean;
  /** Retries per level before the run ends. Infinity = unlimited. */
  retriesPerLevel: number;
  /** Score multiplier. */
  scoreMult: number;
  /** Locked until this achievement is earned (undefined = always open). */
  requiresAchievement?: string;
}

export const DIFFICULTIES: Record<DifficultyId, DifficultyDef> = {
  rookie: {
    id: 'rookie',
    name: 'Rookie',
    tagline: 'Training wheels. No judgment. Some judgment.',
    enemiesPerTurnDelta: -1,
    moveLimitDelta: 4,
    tempoMaxKing: 8,
    king: 'still-early',
    kingReactsToAllies: false,
    retriesPerLevel: Infinity,
    scoreMult: 0.5,
  },
  normal: {
    id: 'normal',
    name: 'Normal',
    tagline: 'The game as she remembers it.',
    enemiesPerTurnDelta: 0,
    moveLimitDelta: 0,
    tempoMaxKing: 12,
    king: 'authored',
    kingReactsToAllies: false,
    retriesPerLevel: 3,
    scoreMult: 1,
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    tagline: "She's furious. He's faster.",
    enemiesPerTurnDelta: 1,
    moveLimitDelta: -2,
    tempoMaxKing: 12,
    king: 'flee',
    kingReactsToAllies: false,
    retriesPerLevel: 1,
    scoreMult: 1.5,
  },
  nightmare: {
    id: 'nightmare',
    name: 'Nightmare',
    tagline: 'One life. He knows you are coming.',
    enemiesPerTurnDelta: 1,
    moveLimitDelta: -2,
    tempoMaxKing: 14,
    king: 'flee',
    kingReactsToAllies: true,
    retriesPerLevel: 0,
    scoreMult: 2,
    requiresAchievement: 'sore-winner',
  },
};

export const DIFFICULTY_ORDER: ReadonlyArray<DifficultyId> = [
  'rookie',
  'normal',
  'hard',
  'nightmare',
];

export const DEFAULT_DIFFICULTY: DifficultyId = 'normal';

export function isDifficultyId(x: unknown): x is DifficultyId {
  return typeof x === 'string' && x in DIFFICULTIES;
}
