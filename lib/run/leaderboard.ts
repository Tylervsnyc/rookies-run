/**
 * Rookie's Revenge — leaderboard.
 *
 * THERE IS NO SERVER YET. `LEADERBOARD_IS_SAMPLE` is true and every row below
 * is invented — the UI says so on screen, so nobody mistakes it for standings.
 * The shape is what a real `GET /api/run/leaderboard` should return, so going
 * live is one function: make `getLeaderboard` fetch and flip the flag.
 */

import { DIFFICULTIES, type DifficultyId } from './difficulty';
import type { RunStats } from './history';
import type { PlayerProfile } from './profile';

export interface LeaderRow {
  rank: number;
  name: string;
  /** Pieces taken across the run — the same number the summary screen shows. */
  score: number;
  levels: number;
  totalLevels: number;
  difficulty: DifficultyId;
  streak: number;
  /** The signed-in player's own row. */
  you?: boolean;
}

/** Flip to false the day this reads a real endpoint. */
export const LEADERBOARD_IS_SAMPLE = true;

export type LeaderboardWindow = 'week' | 'all';

type SampleRow = Omit<LeaderRow, 'rank'>;

const WEEK: ReadonlyArray<SampleRow> = [
  { name: 'kingslayer_88', score: 41, levels: 10, totalLevels: 10, difficulty: 'nightmare', streak: 12 },
  { name: 'rookmomma', score: 38, levels: 10, totalLevels: 10, difficulty: 'nightmare', streak: 7 },
  { name: 'en_passant_ted', score: 36, levels: 10, totalLevels: 10, difficulty: 'hard', streak: 9 },
  { name: 'BishopsRegret', score: 33, levels: 10, totalLevels: 10, difficulty: 'hard', streak: 4 },
  { name: 'h8_crater', score: 31, levels: 10, totalLevels: 10, difficulty: 'hard', streak: 5 },
  { name: 'quietpawn', score: 28, levels: 9, totalLevels: 10, difficulty: 'normal', streak: 3 },
  { name: 'tempo_gremlin', score: 26, levels: 9, totalLevels: 10, difficulty: 'normal', streak: 6 },
  { name: 'not_a_horse', score: 24, levels: 8, totalLevels: 10, difficulty: 'normal', streak: 2 },
  { name: 'castle_doctrine', score: 21, levels: 8, totalLevels: 10, difficulty: 'normal', streak: 1 },
  { name: 'freezerayfan', score: 19, levels: 7, totalLevels: 10, difficulty: 'rookie', streak: 3 },
];

const ALL_TIME: ReadonlyArray<SampleRow> = [
  { name: 'kingslayer_88', score: 64, levels: 10, totalLevels: 10, difficulty: 'nightmare', streak: 31 },
  { name: 'GraveyardShift', score: 59, levels: 10, totalLevels: 10, difficulty: 'nightmare', streak: 22 },
  { name: 'rookmomma', score: 57, levels: 10, totalLevels: 10, difficulty: 'nightmare', streak: 28 },
  { name: 'en_passant_ted', score: 52, levels: 10, totalLevels: 10, difficulty: 'hard', streak: 19 },
  { name: 'h8_crater', score: 49, levels: 10, totalLevels: 10, difficulty: 'hard', streak: 14 },
  { name: 'BishopsRegret', score: 45, levels: 10, totalLevels: 10, difficulty: 'hard', streak: 11 },
  { name: 'tempo_gremlin', score: 42, levels: 10, totalLevels: 10, difficulty: 'normal', streak: 16 },
  { name: 'quietpawn', score: 39, levels: 10, totalLevels: 10, difficulty: 'normal', streak: 8 },
  { name: 'not_a_horse', score: 35, levels: 9, totalLevels: 10, difficulty: 'normal', streak: 5 },
  { name: 'castle_doctrine', score: 30, levels: 9, totalLevels: 10, difficulty: 'normal', streak: 4 },
];

/** The player's own entry, derived from what the profile already stores. */
export function myLeaderRow(
  profile: PlayerProfile | undefined,
  stats: RunStats | undefined,
): SampleRow | null {
  if (!profile) return null;
  let best: { d: DifficultyId; levels: number; score: number } | null = null;
  for (const [d, b] of Object.entries(profile.bestByDifficulty)) {
    if (!b) continue;
    const cand = { d: d as DifficultyId, levels: b.levels, score: b.score };
    const better =
      !best ||
      cand.score * DIFFICULTIES[cand.d].scoreMult > best.score * DIFFICULTIES[best.d].scoreMult;
    if (better) best = cand;
  }
  if (!best) return null;
  return {
    name: 'You',
    score: best.score,
    levels: best.levels,
    totalLevels: best.levels,
    difficulty: best.d,
    streak: stats?.currentStreak ?? 0,
    you: true,
  };
}

/**
 * Sample standings with the player slotted in by score. Ranks are recomputed
 * after the insert so the board always reads 1..n with no gaps.
 */
export function getLeaderboard(
  window: LeaderboardWindow,
  me: SampleRow | null,
): LeaderRow[] {
  const base = [...(window === 'week' ? WEEK : ALL_TIME)];
  if (me) base.push(me);
  base.sort((a, b) => b.score - a.score || b.levels - a.levels);
  return base.map((r, i) => ({ ...r, rank: i + 1 }));
}
