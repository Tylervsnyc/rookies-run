/**
 * Run variants — themed sequences of levels.
 *
 * The original 10-level "Daily Climb" is run #1. The 5 new variants below
 * are shorter (5 levels each) focused challenges meant for fast playtesting.
 *
 * Players progress through the runs sequentially; on completing one, the
 * RunSummaryModal offers a "Next Run" button that advances the current
 * run id in localStorage and reloads with the next variant.
 */

import { DAILY_LEVELS } from './daily-levels';
import { isPlayerFacing, stageOf } from '../content/pipeline';
import type {
  Coord,
  EnemyPiece,
  KingBehavior,
  RookieForm,
  RunPuzzle,
  WinCondition,
} from './types';

export type LevelBuilder = (rookieStart: Coord) => RunPuzzle;

export interface RunDef {
  id: string;
  name: string;
  blurb: string;
  levels: ReadonlyArray<LevelBuilder>;
  /**
   * If set, the ability-offer pool is restricted to these ids only.
   * Used by Abilities Test Run to force convert/drones offers (Squad is
   * passive and lives outside the offer pool).
   */
  allowedAbilities?: ReadonlyArray<string>;
  /**
   * Rookie's Revenge — grant a FREE ability offer at the start of every
   * level (before the first move). Level offers never touch tempo and can't
   * be skipped. Tempo offers still roll on top as usual.
   */
  offerEveryLevel?: boolean;
  /**
   * If set with offerEveryLevel, free level offers roll ONLY on these levels
   * (Tyler 2026-08-18: every level was too much — starter at L1, refills at
   * L3/L6/L9; tempo offers earn the rest).
   */
  offerOnLevels?: ReadonlyArray<number>;
  /** How many options an offer shows (default 2). */
  offerSize?: number;
  /**
   * If set, every slate carries at least `coreMin` options whose ability id
   * is in this list (new picks or upgrades). Rookie's Revenge: finishers.
   */
  offerCore?: ReadonlyArray<string>;
  offerCoreMin?: number;
  /**
   * Sandbox runs: offer everything in `allowedAbilities` regardless of the
   * player's unlock progress (meta-progression normally hides un-earned
   * abilities). For playtesting new abilities, never for shipped runs.
   */
  ignoreUnlocks?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Compact builders shared across themed runs.

const pawn = (file: number, rank: number): EnemyPiece => ({
  type: 'pawn',
  color: 'black',
  file,
  rank,
});
const knight = (file: number, rank: number): EnemyPiece => ({
  type: 'knight',
  color: 'black',
  file,
  rank,
});
const bishop = (file: number, rank: number): EnemyPiece => ({
  type: 'bishop',
  color: 'black',
  file,
  rank,
});
const queen = (file: number, rank: number): EnemyPiece => ({
  type: 'queen',
  color: 'black',
  file,
  rank,
});
const king = (file: number, rank: number): EnemyPiece => ({
  type: 'king',
  color: 'black',
  file,
  rank,
});

function make(
  level: number,
  pieces: EnemyPiece[],
  opts: {
    hazards?: Coord[];
    moveLimit?: number;
    allowedForms?: RookieForm[];
    enemiesPerTurn?: number;
    winCondition?: WinCondition;
    kingBehavior?: KingBehavior;
    kingPen?: string[];
  } = {},
): LevelBuilder {
  return (rookieStart) => ({
    level,
    rookieStart,
    pieces: pieces.map((p) => ({ ...p })),
    hazards: opts.hazards?.map((h) => ({ ...h })),
    moveLimit: opts.moveLimit,
    allowedForms: opts.allowedForms,
    enemiesPerTurn: opts.enemiesPerTurn,
    ...(opts.winCondition ? { winCondition: opts.winCondition } : {}),
    ...(opts.kingBehavior ? { kingBehavior: opts.kingBehavior } : {}),
    ...(opts.kingPen ? { kingPen: [...opts.kingPen] } : {}),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Run 1 — Daily Climb (the original 10-level run).

const RUN_DAILY: RunDef = {
  id: 'daily',
  name: 'Daily Climb',
  blurb: 'The original 10-level run. Rookie → Knight → Bishop → Boss Queen.',
  levels: DAILY_LEVELS,
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 2 — Knight Academy: knight transforms from level 1.

const RUN_KNIGHT_ACADEMY: RunDef = {
  id: 'knight-academy',
  name: "Knight's Academy",
  blurb: "Knight moves from level 1. Ten levels of L-shaped chaos.",
  levels: [
    make(
      1,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 5), pawn(4, 5), pawn(6, 5), pawn(8, 5),
        pawn(1, 6), pawn(3, 6), pawn(5, 6), pawn(7, 6),
        knight(4, 7),
      ],
      { allowedForms: ['knight'] },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), knight(6, 5),
        pawn(2, 6), pawn(5, 6), pawn(7, 6),
        pawn(4, 7), pawn(6, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), knight(6, 5),
        pawn(2, 6), pawn(4, 6), pawn(8, 6),
        knight(5, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(3, 4), knight(6, 4),
        pawn(1, 6), pawn(4, 6), pawn(7, 6),
        knight(5, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2, moveLimit: 14 },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), knight(5, 5), knight(7, 5),
        pawn(2, 6), pawn(6, 6),
        pawn(3, 7), pawn(6, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2, moveLimit: 15 },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        knight(2, 5), knight(5, 5), knight(7, 5),
        pawn(4, 6), pawn(8, 6),
        pawn(3, 7), pawn(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2, moveLimit: 15 },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 4), knight(6, 4),
        knight(2, 6), knight(5, 6), knight(8, 6),
        pawn(4, 7), pawn(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), knight(6, 5),
        knight(2, 6), knight(7, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 2, rank: 4 }, { file: 7, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(3, 4), knight(6, 4),
        knight(2, 6), bishop(5, 6), knight(8, 6),
        knight(4, 7), knight(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(2, 4), knight(5, 4), knight(8, 4),
        knight(3, 6), knight(6, 6),
        queen(4, 8), knight(5, 7), knight(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 4, rank: 5 },
          { file: 5, rank: 5 }, { file: 8, rank: 5 },
          { file: 2, rank: 7 }, { file: 8, rank: 7 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 3 — Bishop's Path: diagonals from level 1.

const RUN_BISHOPS_PATH: RunDef = {
  id: 'bishops-path',
  name: "Bishop's Path",
  blurb: 'Bishop moves unlocked from the start. Slide across the diagonals.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 5), pawn(4, 5), pawn(7, 5),
        pawn(3, 6), pawn(6, 6),
        bishop(5, 7),
      ],
      { allowedForms: ['bishop'] },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(4, 3), pawn(7, 3),
        bishop(4, 5), bishop(6, 5),
        pawn(2, 6), pawn(5, 6), pawn(8, 6),
        pawn(4, 7),
      ],
      { allowedForms: ['bishop'], enemiesPerTurn: 2 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        bishop(3, 5), bishop(6, 5),
        pawn(2, 6), pawn(4, 6), pawn(7, 6),
        bishop(5, 7),
      ],
      { allowedForms: ['bishop'], enemiesPerTurn: 2 },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        bishop(3, 4), bishop(6, 4),
        pawn(1, 6), pawn(5, 6), pawn(8, 6),
        bishop(4, 7),
      ],
      { allowedForms: ['bishop', 'knight'], enemiesPerTurn: 2 },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        bishop(3, 5), bishop(5, 5), bishop(7, 5),
        pawn(2, 6), pawn(6, 6),
        pawn(4, 7), pawn(6, 7),
      ],
      { allowedForms: ['bishop', 'knight'], enemiesPerTurn: 2, moveLimit: 14 },
    ),
    make(
      6,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        bishop(3, 5), bishop(6, 5),
        knight(2, 6), knight(7, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      { allowedForms: ['bishop', 'knight'], enemiesPerTurn: 2, moveLimit: 15 },
    ),
    make(
      7,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        bishop(3, 5), bishop(6, 5),
        pawn(2, 6), pawn(5, 6), pawn(8, 6),
        bishop(4, 7), bishop(6, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      8,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        bishop(3, 4), knight(6, 4),
        bishop(2, 6), bishop(7, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        bishop(3, 5), knight(5, 5), bishop(7, 5),
        bishop(2, 6), bishop(6, 6),
        bishop(4, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 2, rank: 4 }, { file: 7, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3),
        bishop(3, 4), bishop(6, 4),
        knight(2, 6), bishop(5, 6), knight(8, 6),
        queen(4, 8), bishop(6, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 4, rank: 5 },
          { file: 5, rank: 5 }, { file: 8, rank: 5 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 4 — Speed Demon: every level is a tight move limit.

const RUN_SPEED_DEMON: RunDef = {
  id: 'speed-demon',
  name: 'Speed Demon',
  blurb: "Tight move limits on every level. Don't waste a single step.",
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        pawn(1, 5), pawn(4, 5), pawn(6, 5), pawn(8, 5),
        pawn(3, 7), pawn(6, 7),
      ],
      { moveLimit: 9 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(4, 3), pawn(7, 3),
        pawn(2, 5), pawn(5, 5), pawn(8, 5),
        knight(4, 6), pawn(7, 6),
        pawn(3, 7),
      ],
      { allowedForms: ['knight'], moveLimit: 10, enemiesPerTurn: 2 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(4, 5), knight(6, 5),
        pawn(3, 6), pawn(7, 6),
        bishop(5, 7), pawn(2, 7),
      ],
      { allowedForms: ['knight', 'bishop'], moveLimit: 11, enemiesPerTurn: 2 },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        bishop(3, 5), knight(5, 5),
        pawn(2, 6), pawn(6, 6),
        pawn(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], moveLimit: 11, enemiesPerTurn: 2 },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        pawn(4, 6), pawn(8, 6),
        knight(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], moveLimit: 11, enemiesPerTurn: 2 },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        pawn(2, 6), pawn(5, 6), pawn(8, 6),
        pawn(4, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        moveLimit: 12,
        enemiesPerTurn: 2,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        bishop(3, 4), knight(6, 4),
        knight(2, 6), bishop(7, 6),
        pawn(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        moveLimit: 12,
        enemiesPerTurn: 3,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        knight(4, 5), bishop(5, 5),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        moveLimit: 13,
        enemiesPerTurn: 3,
        hazards: [
          { file: 4, rank: 4 }, { file: 5, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3),
        knight(3, 5), bishop(6, 5),
        knight(2, 6), bishop(7, 6),
        queen(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        moveLimit: 13,
        enemiesPerTurn: 3,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 4), bishop(6, 4),
        knight(2, 6), bishop(7, 6),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        moveLimit: 14,
        enemiesPerTurn: 3,
        hazards: [
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 4, rank: 7 }, { file: 5, rank: 7 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 5 — Hazard Maze: no-go squares everywhere.

const RUN_HAZARD_MAZE: RunDef = {
  id: 'hazard-maze',
  name: 'Hazard Maze',
  blurb: 'Black squares cannot be touched. Thread the needle.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(6, 3),
        pawn(2, 4), pawn(6, 4),
        pawn(3, 6), pawn(7, 6),
        pawn(4, 7), pawn(5, 7),
      ],
      {
        hazards: [
          { file: 4, rank: 3 }, { file: 5, rank: 3 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        pawn(3, 5), pawn(6, 5),
        knight(4, 6), pawn(8, 6),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
      ],
      {
        hazards: [
          { file: 2, rank: 4 }, { file: 7, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
        allowedForms: ['knight'],
      },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), knight(6, 5),
        pawn(3, 6), pawn(6, 6),
        bishop(5, 7),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 8, rank: 4 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
          { file: 4, rank: 7 }, { file: 6, rank: 7 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        bishop(3, 5), knight(6, 5),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
      ],
      {
        hazards: [
          { file: 2, rank: 4 }, { file: 5, rank: 4 }, { file: 8, rank: 4 },
          { file: 3, rank: 6 }, { file: 6, rank: 6 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        pawn(2, 6), pawn(7, 6),
        pawn(4, 7), pawn(6, 7),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 4, rank: 4 }, { file: 8, rank: 4 },
          { file: 1, rank: 6 }, { file: 5, rank: 6 }, { file: 8, rank: 6 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 15,
      },
    ),
    make(
      6,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(3, 5), bishop(6, 5),
        knight(2, 6), bishop(7, 6),
        pawn(4, 7),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 4, rank: 4 }, { file: 5, rank: 4 }, { file: 8, rank: 4 },
          { file: 2, rank: 6 }, { file: 5, rank: 6 }, { file: 8, rank: 6 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 15,
      },
    ),
    make(
      7,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 4), bishop(6, 4),
        knight(2, 6), knight(7, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        hazards: [
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 3, rank: 7 }, { file: 6, rank: 7 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
      },
    ),
    make(
      8,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(3, 5), bishop(6, 5),
        knight(2, 6), bishop(5, 6), knight(8, 6),
        queen(4, 7),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 4, rank: 4 }, { file: 5, rank: 4 }, { file: 8, rank: 4 },
          { file: 1, rank: 7 }, { file: 7, rank: 7 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
      },
    ),
    make(
      9,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        knight(2, 5), bishop(5, 5), knight(7, 5),
        bishop(3, 7), bishop(6, 7),
        queen(5, 6),
      ],
      {
        hazards: [
          { file: 4, rank: 4 }, { file: 5, rank: 4 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
      },
    ),
    make(
      10,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 4), bishop(6, 4),
        knight(2, 6), bishop(7, 6),
        queen(4, 8), queen(5, 8),
      ],
      {
        hazards: [
          { file: 1, rank: 4 }, { file: 4, rank: 4 }, { file: 5, rank: 4 }, { file: 8, rank: 4 },
          { file: 1, rank: 6 }, { file: 4, rank: 6 }, { file: 5, rank: 6 }, { file: 8, rank: 6 },
          { file: 3, rank: 7 }, { file: 6, rank: 7 },
        ],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 6 — Boss Gauntlet: queens, big pieces, multiple enemies per turn.

const RUN_BOSS_GAUNTLET: RunDef = {
  id: 'boss-gauntlet',
  name: 'Boss Gauntlet',
  blurb: 'A queen on every floor. Bring the heavy artillery.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(4, 5), bishop(6, 5),
        queen(4, 6), pawn(7, 6),
        pawn(3, 7), pawn(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        pawn(2, 6), queen(6, 6),
        pawn(4, 7), pawn(7, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        bishop(3, 5), knight(6, 5),
        queen(5, 6), pawn(7, 6),
        pawn(2, 7), pawn(6, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2, moveLimit: 16 },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        queen(4, 7), pawn(2, 7), pawn(7, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2, moveLimit: 15 },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        queen(4, 7), queen(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 18,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(4, 3), pawn(8, 3),
        knight(3, 4), bishop(6, 4),
        queen(5, 6),
        bishop(2, 7), knight(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        queen(2, 6), queen(7, 6),
        bishop(4, 7), knight(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 4, rank: 4 }, { file: 5, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(4, 3), pawn(8, 3),
        bishop(3, 4), knight(6, 4),
        queen(4, 6), queen(7, 6),
        knight(2, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 2, rank: 6 }, { file: 6, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), bishop(6, 5),
        queen(2, 6), queen(5, 6), queen(8, 6),
        bishop(4, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 4 }, { file: 8, rank: 4 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(4, 3), pawn(8, 3),
        knight(3, 4), bishop(6, 4),
        knight(2, 6), queen(5, 6), bishop(7, 6),
        queen(3, 8), queen(4, 8), queen(5, 8), queen(6, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 20,
        hazards: [
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 1, rank: 7 }, { file: 8, rank: 7 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 7 — Iron Curtain: layered pawn fortresses, knight from L1.
//
// Difficulty knobs vs. existing runs:
//   - More pieces per level (14→19, vs ~10→14 in older runs).
//   - 3 enemies/turn by L3, 4/turn on L9-L10.
//   - Defended pawn chains: capturing one pawn drops you into another's attack.

const RUN_IRON_CURTAIN: RunDef = {
  id: 'iron-curtain',
  name: 'Iron Curtain',
  blurb: 'Layered pawn walls. Every gap is a trap.',
  levels: [
    make(
      1,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        pawn(2, 6), pawn(5, 6), pawn(8, 6),
        knight(4, 7), knight(6, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        knight(3, 6), knight(6, 6),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      3,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(4, 6), knight(5, 6),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
        bishop(3, 7),
      ],
      {
        allowedForms: ['knight'],
        enemiesPerTurn: 3,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        pawn(1, 4), pawn(3, 4), pawn(6, 4), pawn(8, 4),
        knight(3, 6), bishop(6, 6),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
        bishop(4, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      5,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(3, 6), bishop(5, 6), knight(7, 6),
        pawn(2, 7), pawn(4, 7), pawn(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
        ],
      },
    ),
    make(
      6,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(3, 6), knight(5, 6), bishop(7, 6),
        pawn(2, 7), pawn(4, 7), pawn(6, 7),
        bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      7,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 6), bishop(6, 6),
        pawn(2, 7), pawn(5, 7), pawn(7, 7),
        knight(4, 7), knight(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(2, 6), knight(5, 6), bishop(7, 6),
        knight(3, 7), bishop(5, 7), knight(6, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(2, 6), bishop(5, 6), knight(7, 6),
        bishop(3, 7), knight(6, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        knight(2, 6), bishop(4, 6), bishop(5, 6), knight(7, 6),
        bishop(3, 7), knight(6, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 20,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 2, rank: 7 }, { file: 7, rank: 7 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 8 — Crossfire: bishops placed so long diagonals already cross Rookie's
// path. Many squares are "covered without anyone needing to move."

const RUN_CROSSFIRE: RunDef = {
  id: 'crossfire',
  name: 'Crossfire',
  blurb: "Bishops on every long diagonal. Stay off the X.",
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        bishop(1, 5), bishop(8, 5),
        pawn(3, 6), pawn(6, 6),
        bishop(3, 7), bishop(6, 7),
        pawn(4, 7), pawn(5, 7),
      ],
      { allowedForms: ['bishop'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        bishop(2, 5), bishop(7, 5),
        pawn(4, 6), pawn(6, 6),
        bishop(3, 7), bishop(5, 7), bishop(6, 7),
      ],
      { allowedForms: ['bishop'], enemiesPerTurn: 3 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        bishop(1, 4), bishop(8, 4),
        pawn(3, 6), pawn(6, 6),
        bishop(2, 7), bishop(4, 7), bishop(7, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        bishop(2, 4), bishop(7, 4),
        knight(4, 5), knight(5, 5),
        bishop(3, 7), bishop(5, 7), bishop(7, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        bishop(1, 5), bishop(8, 5),
        bishop(3, 6), bishop(6, 6),
        bishop(2, 7), bishop(5, 7), bishop(7, 7),
        knight(4, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        bishop(2, 4), bishop(7, 4),
        knight(4, 5), knight(5, 5),
        bishop(3, 6), bishop(6, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
        ],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        bishop(1, 4), bishop(4, 4), bishop(5, 4), bishop(8, 4),
        knight(3, 6), knight(6, 6),
        bishop(2, 7), bishop(5, 7), bishop(7, 7),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 3, rank: 5 }, { file: 6, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        bishop(2, 4), bishop(7, 4),
        bishop(1, 5), bishop(8, 5),
        knight(3, 6), bishop(5, 6), knight(7, 6),
        bishop(4, 7), bishop(6, 7),
        queen(5, 8),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        bishop(1, 4), bishop(8, 4),
        bishop(3, 5), bishop(6, 5),
        bishop(2, 6), bishop(7, 6),
        bishop(3, 7), knight(5, 7), bishop(6, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        bishop(2, 4), bishop(7, 4),
        bishop(1, 5), bishop(8, 5),
        bishop(3, 6), bishop(6, 6),
        knight(4, 7), knight(5, 7),
        queen(3, 8), queen(6, 8),
      ],
      {
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        moveLimit: 20,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
          { file: 4, rank: 7 }, { file: 5, rank: 7 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 9 — Hornet's Nest: knights placed at fork distance from rookie's likely
// landing squares. Every step lands within an L of something.

const RUN_HORNETS_NEST: RunDef = {
  id: 'hornets-nest',
  name: "Hornet's Nest",
  blurb: 'Every square is forked by a knight. Move like you mean it.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(3, 5), knight(6, 5),
        pawn(2, 6), pawn(5, 6), pawn(8, 6),
        knight(4, 7), knight(5, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        knight(2, 5), knight(4, 5), knight(7, 5),
        pawn(3, 6), pawn(6, 6),
        knight(4, 7), knight(6, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(3, 4), knight(6, 4),
        knight(2, 6), knight(5, 6), knight(8, 6),
        pawn(4, 7), pawn(5, 7),
      ],
      {
        allowedForms: ['knight'],
        enemiesPerTurn: 3,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), knight(5, 5), knight(7, 5),
        pawn(2, 6), pawn(6, 6),
        knight(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(2, 4), knight(5, 4), knight(8, 4),
        knight(3, 6), knight(6, 6),
        pawn(4, 7), pawn(5, 7),
        bishop(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        knight(3, 4), knight(6, 4),
        knight(2, 5), knight(7, 5),
        knight(3, 6), knight(6, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        knight(3, 4), knight(4, 4), knight(5, 4), knight(6, 4),
        pawn(2, 6), pawn(7, 6),
        knight(3, 7), knight(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        knight(2, 5), knight(4, 5), knight(5, 5), knight(7, 5),
        pawn(3, 6), pawn(6, 6),
        knight(4, 7), knight(5, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 1, rank: 4 }, { file: 8, rank: 4 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(3, 4), knight(5, 4), knight(7, 4),
        knight(2, 6), knight(5, 6), knight(8, 6),
        bishop(3, 7), bishop(6, 7),
        queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        knight(2, 4), knight(4, 4), knight(5, 4), knight(7, 4),
        knight(3, 6), knight(6, 6),
        bishop(2, 7), knight(4, 7), knight(5, 7), bishop(7, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 20,
        hazards: [
          { file: 3, rank: 5 }, { file: 6, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 10 — Royal Court: queens behind pawn shields. Take the pawn → queen
// recaptures. Forces patient setup over greedy grabs.

const RUN_ROYAL_COURT: RunDef = {
  id: 'royal-court',
  name: 'Royal Court',
  blurb: 'Queens behind every pawn. Greedy grabs end in tears.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        queen(2, 4), queen(8, 4),
        pawn(3, 6), pawn(6, 6),
        knight(4, 7), knight(5, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        queen(3, 4), queen(7, 4),
        pawn(4, 6), pawn(6, 6),
        knight(3, 7), bishop(5, 7), knight(6, 7),
      ],
      { allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        queen(4, 4), queen(5, 4),
        pawn(3, 6), pawn(6, 6),
        bishop(3, 7), knight(5, 7), bishop(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(7, 3),
        queen(2, 4), queen(7, 4),
        knight(4, 5), bishop(5, 5),
        pawn(3, 6), pawn(6, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(5, 3), pawn(8, 3),
        queen(2, 4), queen(5, 4), queen(8, 4),
        knight(3, 6), bishop(6, 6),
        pawn(4, 7), pawn(5, 7),
        bishop(3, 7), knight(6, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        queen(3, 4), queen(6, 4),
        knight(2, 5), bishop(7, 5),
        pawn(4, 6), pawn(5, 6),
        bishop(4, 7), knight(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        queen(2, 4), queen(4, 4), queen(6, 4), queen(8, 4),
        knight(3, 6), bishop(5, 6), knight(7, 6),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        queen(1, 4), queen(4, 4), queen(5, 4), queen(8, 4),
        knight(3, 6), bishop(6, 6),
        bishop(2, 7), knight(4, 7), knight(5, 7), bishop(7, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        queen(2, 4), queen(4, 4), queen(5, 4), queen(7, 4),
        bishop(3, 6), knight(6, 6),
        bishop(3, 7), knight(5, 7), bishop(6, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(8, 3),
        queen(3, 4), queen(4, 4), queen(5, 4), queen(6, 4),
        knight(2, 6), bishop(5, 6), knight(7, 6),
        bishop(4, 7), bishop(5, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 22,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 11 — The Gauntlet: every difficulty knob turned up. Mixed pieces,
// 4 enemies/turn from L4, queen barricade finale. The hardest run.

const RUN_GAUNTLET: RunDef = {
  id: 'the-gauntlet',
  name: 'The Gauntlet',
  blurb: 'Everything at once. Four enemies move every turn. Good luck.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(3, 5), bishop(6, 5),
        pawn(2, 6), pawn(7, 6),
        bishop(4, 7), knight(5, 7),
      ],
      { allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        bishop(2, 4), knight(7, 4),
        knight(4, 5), bishop(5, 5),
        pawn(3, 6), pawn(6, 6),
        knight(4, 7), bishop(5, 7),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        bishop(1, 4), knight(4, 4), knight(5, 4), bishop(8, 4),
        pawn(3, 6), pawn(6, 6),
        bishop(4, 7), bishop(5, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(4, 3), pawn(5, 3), pawn(8, 3),
        bishop(2, 4), knight(3, 4), knight(6, 4), bishop(7, 4),
        pawn(3, 6), pawn(6, 6),
        bishop(4, 7), bishop(5, 7),
        queen(4, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 2, rank: 5 }, { file: 7, rank: 5 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        knight(3, 4), bishop(6, 4),
        bishop(2, 5), knight(7, 5),
        pawn(3, 6), pawn(6, 6),
        bishop(4, 7), knight(5, 7),
        queen(3, 8), queen(6, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 17,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(3, 3), pawn(6, 3), pawn(8, 3),
        knight(2, 4), bishop(4, 4), bishop(5, 4), knight(7, 4),
        knight(3, 6), bishop(6, 6),
        bishop(4, 7), knight(5, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 17,
        hazards: [
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 4), knight(6, 4),
        bishop(2, 5), bishop(7, 5),
        knight(4, 6), bishop(5, 6),
        bishop(3, 7), knight(6, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
          { file: 4, rank: 6 }, { file: 5, rank: 6 },
        ],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        bishop(2, 4), knight(4, 4), knight(5, 4), bishop(7, 4),
        knight(3, 6), bishop(6, 6),
        bishop(2, 7), knight(4, 7), knight(5, 7), bishop(7, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 18,
        hazards: [
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
          { file: 3, rank: 5 }, { file: 6, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        bishop(1, 4), knight(3, 4), knight(6, 4), bishop(8, 4),
        knight(2, 6), bishop(5, 6), knight(7, 6),
        bishop(3, 7), bishop(6, 7),
        queen(3, 8), queen(4, 8), queen(5, 8), queen(6, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 20,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 2, rank: 6 }, { file: 7, rank: 6 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(8, 3),
        bishop(2, 4), knight(4, 4), knight(5, 4), bishop(7, 4),
        knight(2, 6), bishop(4, 6), bishop(5, 6), knight(7, 6),
        bishop(3, 7), knight(4, 7), knight(5, 7), bishop(6, 7),
        queen(2, 8), queen(4, 8), queen(5, 8), queen(7, 8),
      ],
      {
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 24,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 3, rank: 5 }, { file: 6, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 4, rank: 7 }, { file: 5, rank: 7 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 12 — Trial Run: 5 generator-tested levels promoted from the
// 2026-05-13 candidate batch. Picked for "hard/fun" — T3 win rates
// 20-70%, escalating difficulty. Each level was bot-tested at T3+T4 ×
// 20 trials; full reports in data/run-playtest/candidate-levels/.

const RUN_TRIAL: RunDef = {
  id: 'trial-run',
  name: 'Trial Run',
  blurb: 'Five fresh levels, machine-tested for fun-hard pacing.',
  levels: [
    // L1 — Open Approach v1 (T3 70% / T4 100% — gentle warm-up)
    make(
      1,
      [
        pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
        pawn(1, 5), pawn(2, 5), pawn(3, 5), pawn(4, 5), pawn(5, 5), pawn(7, 5),
        knight(2, 6), pawn(3, 6), knight(5, 6), pawn(6, 6),
        pawn(4, 7), pawn(6, 7),
      ],
      { moveLimit: 16, allowedForms: ['knight', 'bishop'] },
    ),
    // L2 — Strategic Hazards v2 (T3 55% / T4 100% — 4 strategic hazards)
    make(
      2,
      [
        pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3),
        bishop(2, 5), queen(6, 5),
        pawn(3, 6), pawn(4, 6), pawn(5, 6), pawn(7, 6),
      ],
      {
        hazards: [
          { file: 2, rank: 4 }, { file: 6, rank: 4 },
          { file: 1, rank: 5 }, { file: 8, rank: 4 },
        ],
        moveLimit: 17,
        allowedForms: ['knight', 'bishop'],
      },
    ),
    // L3 — Open Approach v4 (T3 55% / T4 100% — race-then-wall)
    make(
      3,
      [
        pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
        pawn(1, 5), pawn(2, 5), pawn(5, 5), pawn(6, 5), pawn(7, 5), pawn(8, 5),
        pawn(2, 6), pawn(4, 6), knight(7, 6),
        pawn(3, 7),
      ],
      { moveLimit: 16, allowedForms: ['knight', 'bishop'] },
    ),
    // L4 — Pawn Wall v3 (T3 40% / T4 100% — sweet-spot fun-hard)
    make(
      4,
      [
        pawn(1, 3), pawn(2, 3), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
        pawn(1, 5), pawn(2, 5), pawn(3, 5), pawn(4, 5), pawn(7, 5),
        pawn(1, 6), pawn(4, 6), pawn(6, 6),
        pawn(5, 7),
      ],
      { moveLimit: 18 },
    ),
    // L5 — Choke Point v5 (T3 20% / T4 90% — the punisher)
    make(
      5,
      [
        pawn(1, 3), pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(7, 3), pawn(8, 3),
        pawn(3, 4), pawn(5, 4), knight(7, 4),
        pawn(1, 5), pawn(4, 5), bishop(6, 5), pawn(8, 5),
        pawn(2, 6), pawn(5, 6),
        pawn(3, 7), pawn(4, 7),
      ],
      { moveLimit: 19, allowedForms: ['knight', 'bishop'] },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 13 — Hourglass: tight clock + close pieces from level 1.
// Pawns at rank 4 immediately threaten Rookie's path through rank 3.

const RUN_HOURGLASS: RunDef = {
  id: 'hourglass',
  name: 'Hourglass',
  blurb: 'Tight clock, close pieces. Every move counts.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        queen(4, 6),
      ],
      {
        moveLimit: 10,
        allowedForms: ['knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(3, 5), knight(6, 5),
        queen(5, 6),
      ],
      {
        moveLimit: 10,
        allowedForms: ['knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(3, 5), bishop(6, 5),
        queen(4, 6),
      ],
      {
        moveLimit: 11,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 5), bishop(6, 5),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 11,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        knight(3, 5), knight(6, 5),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 12,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 5), knight(5, 5), bishop(6, 5),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 12,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(2, 5), knight(4, 5), knight(5, 5), bishop(7, 5),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 12,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(3, 5), bishop(6, 5),
        queen(3, 6), queen(5, 6), queen(7, 6),
      ],
      {
        moveLimit: 13,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(3, 5), bishop(7, 5),
        queen(3, 6), queen(6, 6),
      ],
      {
        moveLimit: 15,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(2, 5), knight(4, 5), knight(5, 5), bishop(7, 5),
        queen(3, 6), queen(4, 6), queen(5, 6), queen(6, 6),
      ],
      {
        moveLimit: 15,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 14 — Bishop's Cathedral: bishops on every diagonal, defended X-rays.
// Bishop is already the bot's top killer — this run leans into it.

const RUN_BISHOPS_CATHEDRAL: RunDef = {
  id: 'bishops-cathedral',
  name: "Bishop's Cathedral",
  blurb: 'Diagonals in your face from move one.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(3, 5), bishop(6, 5),
        queen(4, 6),
      ],
      {
        moveLimit: 10,
        allowedForms: ['bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 5), bishop(6, 5),
        queen(5, 6),
      ],
      {
        moveLimit: 10,
        allowedForms: ['bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(3, 5), bishop(4, 5), bishop(5, 5), bishop(6, 5),
        queen(4, 6),
      ],
      {
        moveLimit: 11,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 5), bishop(4, 5), bishop(5, 5), bishop(6, 5),
        queen(5, 6),
      ],
      {
        moveLimit: 11,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(3, 5), bishop(4, 5), bishop(5, 5), bishop(6, 5),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 12,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 5), bishop(4, 5), bishop(5, 5), bishop(6, 5),
        queen(5, 6),
      ],
      {
        moveLimit: 13,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(3, 5), bishop(4, 5), bishop(5, 5), bishop(6, 5),
        queen(4, 6),
      ],
      {
        moveLimit: 13,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 5), bishop(4, 5), bishop(5, 5), bishop(6, 5),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 13,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(2, 5), bishop(3, 5), bishop(6, 5), bishop(7, 5),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 14,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 5,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 5), bishop(4, 5), bishop(5, 5), bishop(6, 5),
        queen(3, 6), queen(5, 6), queen(7, 6),
      ],
      {
        moveLimit: 14,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 5,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 15 — Royal Procession: a queen waits on every level, escalating to
// four by the finale. Forces aggressive ability use and early transforms.

const RUN_ROYAL_PROCESSION: RunDef = {
  id: 'royal-procession',
  name: 'Royal Procession',
  blurb: 'A queen looms over every level. Closer than you think.',
  levels: [
    make(
      1,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        queen(4, 5), queen(5, 6),
      ],
      {
        moveLimit: 9,
        allowedForms: ['knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
    make(
      2,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(3, 5), knight(6, 5),
        queen(5, 5),
      ],
      {
        moveLimit: 9,
        allowedForms: ['knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
    make(
      3,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        knight(3, 5), knight(6, 5),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 10,
        allowedForms: ['knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      4,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 5), bishop(6, 5),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 10,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        queen(3, 5), queen(6, 5),
        queen(4, 7),
      ],
      {
        moveLimit: 11,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      6,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 5), bishop(6, 5),
        queen(3, 6), queen(5, 6), queen(7, 6),
      ],
      {
        moveLimit: 11,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        queen(4, 5), queen(5, 5),
        queen(4, 7), queen(5, 7),
      ],
      {
        moveLimit: 12,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
    make(
      8,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(3, 5), bishop(6, 5),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 13,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        queen(3, 5), queen(6, 5),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 14,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 7 }, { file: 5, rank: 7 }],
      },
    ),
    make(
      10,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        bishop(2, 5), bishop(7, 5),
        queen(3, 6), queen(4, 6), queen(5, 6), queen(6, 6),
      ],
      {
        moveLimit: 14,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 16 — Cavalry Charge: pure knight gauntlets. No pawns, no other pieces.

const RUN_CAVALRY_CHARGE: RunDef = {
  id: 'cavalry-charge',
  name: 'Cavalry Charge',
  blurb: 'Knights only. L-shapes attacking from everywhere.',
  levels: [
    make(
      1,
      [
        knight(2, 3), knight(4, 3), knight(5, 3), knight(7, 3),
        knight(4, 5), knight(5, 5),
      ],
      {
        moveLimit: 9,
        allowedForms: ['knight'],
        enemiesPerTurn: 3,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      2,
      [
        knight(1, 3), knight(3, 3), knight(5, 3), knight(7, 3),
        knight(2, 5), knight(4, 5), knight(7, 5),
      ],
      {
        moveLimit: 10,
        allowedForms: ['knight'],
        enemiesPerTurn: 3,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      3,
      [
        knight(2, 3), knight(4, 3), knight(6, 3), knight(8, 3),
        knight(3, 5), knight(5, 5), knight(7, 5),
        queen(4, 7),
      ],
      {
        moveLimit: 10,
        allowedForms: ['knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      4,
      [
        knight(1, 3), knight(3, 3), knight(5, 3), knight(7, 3),
        knight(2, 5), knight(4, 5), knight(6, 5), knight(8, 5),
        queen(4, 7),
      ],
      {
        moveLimit: 11,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      5,
      [
        knight(2, 3), knight(4, 3), knight(5, 3), knight(7, 3),
        knight(1, 5), knight(3, 5), knight(6, 5), knight(8, 5),
        queen(4, 7), queen(5, 7),
      ],
      {
        moveLimit: 11,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      6,
      [
        knight(1, 3), knight(3, 3), knight(4, 3), knight(5, 3), knight(7, 3),
        knight(2, 4), knight(7, 4),
        knight(3, 5), knight(6, 5),
        queen(4, 7), queen(5, 7),
      ],
      {
        moveLimit: 12,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      7,
      [
        knight(2, 3), knight(4, 3), knight(5, 3), knight(7, 3),
        knight(1, 4), knight(3, 4), knight(6, 4), knight(8, 4),
        knight(4, 5), knight(5, 5),
        queen(5, 7),
      ],
      {
        moveLimit: 12,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
    make(
      8,
      [
        knight(2, 3), knight(4, 3), knight(5, 3), knight(7, 3),
        knight(1, 4), knight(3, 4), knight(6, 4), knight(8, 4),
        knight(3, 5), knight(6, 5),
        queen(4, 7),
      ],
      {
        moveLimit: 14,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
    make(
      9,
      [
        knight(1, 3), knight(3, 3), knight(5, 3), knight(7, 3),
        knight(2, 4), knight(4, 4), knight(5, 4), knight(7, 4),
        knight(3, 5), knight(6, 5),
        queen(4, 7), queen(5, 7),
      ],
      {
        moveLimit: 14,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
    make(
      10,
      [
        knight(2, 3), knight(4, 3), knight(5, 3), knight(7, 3),
        knight(1, 4), knight(3, 4), knight(6, 4), knight(8, 4),
        knight(3, 5), knight(6, 5),
        queen(4, 7), queen(5, 7),
      ],
      {
        moveLimit: 18,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 17 — Pawn Tsunami: deep pawn walls, nothing else. Pure attrition.

const RUN_PAWN_TSUNAMI: RunDef = {
  id: 'pawn-tsunami',
  name: 'Pawn Tsunami',
  blurb: 'Wave after wave of pawns. Nothing but pawns.',
  levels: [
    make(
      1,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
      ],
      { moveLimit: 11, allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      2,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        pawn(2, 5), pawn(5, 5), pawn(7, 5),
      ],
      { moveLimit: 12, allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      3,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        pawn(1, 5), pawn(3, 5), pawn(5, 5), pawn(7, 5),
      ],
      { moveLimit: 12, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        pawn(2, 5), pawn(4, 5), pawn(6, 5), pawn(8, 5),
        pawn(3, 6), pawn(6, 6),
      ],
      { moveLimit: 13, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      5,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        pawn(1, 5), pawn(3, 5), pawn(5, 5), pawn(7, 5),
        pawn(2, 6), pawn(4, 6), pawn(6, 6), pawn(8, 6),
      ],
      { moveLimit: 13, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      6,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        pawn(2, 5), pawn(4, 5), pawn(6, 5), pawn(8, 5),
        pawn(1, 6), pawn(3, 6), pawn(5, 6), pawn(7, 6),
        pawn(4, 7), pawn(5, 7),
      ],
      {
        moveLimit: 14,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      7,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        pawn(1, 5), pawn(3, 5), pawn(5, 5), pawn(7, 5),
        pawn(2, 6), pawn(4, 6), pawn(6, 6), pawn(8, 6),
        pawn(3, 7), pawn(5, 7), pawn(7, 7),
      ],
      { moveLimit: 14, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      8,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        pawn(2, 5), pawn(4, 5), pawn(6, 5), pawn(8, 5),
        pawn(1, 6), pawn(3, 6), pawn(5, 6), pawn(7, 6),
        pawn(2, 7), pawn(4, 7), pawn(6, 7), pawn(8, 7),
      ],
      {
        moveLimit: 15,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      9,
      [
        pawn(1, 3), pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(4, 4), pawn(6, 4), pawn(7, 4),
        pawn(2, 5), pawn(3, 5), pawn(5, 5), pawn(6, 5), pawn(8, 5),
        pawn(1, 6), pawn(4, 6), pawn(5, 6), pawn(8, 6),
        pawn(3, 7), pawn(6, 7),
      ],
      { moveLimit: 15, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 5 },
    ),
    make(
      10,
      [
        pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        pawn(2, 5), pawn(4, 5), pawn(6, 5), pawn(8, 5),
        pawn(1, 6), pawn(3, 6), pawn(5, 6), pawn(7, 6),
        pawn(2, 7), pawn(4, 7), pawn(7, 7),
      ],
      {
        moveLimit: 17,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 18 — Diagonal Web: scattered bishops on every diagonal. No pawns.

const RUN_DIAGONAL_WEB: RunDef = {
  id: 'diagonal-web',
  name: 'Diagonal Web',
  blurb: 'Bishops scattered across the board. Mind every diagonal.',
  levels: [
    make(
      1,
      [
        bishop(2, 4), bishop(7, 4),
        bishop(4, 6), bishop(5, 6),
      ],
      {
        moveLimit: 9,
        allowedForms: ['bishop'],
        enemiesPerTurn: 3,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      2,
      [
        bishop(1, 4), bishop(3, 4), bishop(6, 4), bishop(8, 4),
        bishop(4, 6), bishop(5, 6),
      ],
      {
        moveLimit: 10,
        allowedForms: ['bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      3,
      [
        bishop(2, 4), bishop(4, 4), bishop(5, 4), bishop(7, 4),
        bishop(3, 6), bishop(6, 6),
      ],
      {
        moveLimit: 10,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      4,
      [
        bishop(1, 4), bishop(4, 4), bishop(5, 4), bishop(8, 4),
        bishop(3, 6), bishop(6, 6),
        bishop(4, 7),
      ],
      {
        moveLimit: 11,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }],
      },
    ),
    make(
      5,
      [
        bishop(2, 4), bishop(7, 4),
        bishop(3, 5), bishop(6, 5),
        bishop(4, 7), bishop(5, 7),
      ],
      {
        moveLimit: 11,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      6,
      [
        bishop(1, 4), bishop(3, 4), bishop(6, 4), bishop(8, 4),
        bishop(4, 5), bishop(5, 5),
        bishop(3, 7), bishop(6, 7),
      ],
      {
        moveLimit: 12,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
    make(
      7,
      [
        bishop(2, 4), bishop(4, 4), bishop(5, 4), bishop(7, 4),
        bishop(3, 6), bishop(6, 6),
        queen(4, 8),
      ],
      {
        moveLimit: 12,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      8,
      [
        bishop(2, 4), bishop(7, 4),
        bishop(3, 5), bishop(6, 5),
        bishop(4, 6), bishop(5, 6),
        queen(5, 8),
      ],
      {
        moveLimit: 13,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      9,
      [
        bishop(2, 4), bishop(4, 4), bishop(5, 4), bishop(7, 4),
        bishop(3, 5), bishop(6, 5),
        queen(4, 8), queen(5, 8),
      ],
      {
        moveLimit: 14,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
    make(
      10,
      [
        bishop(2, 4), bishop(4, 4), bishop(5, 4), bishop(7, 4),
        bishop(3, 5), bishop(6, 5),
        queen(4, 8), queen(5, 8),
      ],
      {
        moveLimit: 15,
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 6 }, { file: 5, rank: 6 }],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 19 — Throne Room: only queens. No pawns, no minor pieces.

const RUN_THRONE_ROOM: RunDef = {
  id: 'throne-room',
  name: 'Throne Room',
  blurb: 'No pawns. No minor pieces. Just queens. Many queens.',
  levels: [
    make(
      1,
      [queen(4, 5), queen(5, 5)],
      { moveLimit: 9, allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [queen(3, 5), queen(6, 5)],
      { moveLimit: 10, allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      3,
      [queen(2, 5), queen(5, 5), queen(7, 5)],
      { moveLimit: 11, allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      4,
      [queen(3, 4), queen(6, 4), queen(4, 6), queen(5, 6)],
      { moveLimit: 11, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      5,
      [
        queen(2, 4), queen(7, 4),
        queen(4, 6), queen(5, 6),
      ],
      {
        moveLimit: 12,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      6,
      [
        queen(2, 5), queen(5, 5), queen(7, 5),
        queen(4, 7),
      ],
      { moveLimit: 12, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      7,
      [
        queen(3, 4), queen(6, 4),
        queen(3, 6), queen(6, 6),
        queen(4, 7),
      ],
      { moveLimit: 13, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      8,
      [
        queen(2, 4), queen(7, 4),
        queen(3, 6), queen(6, 6),
      ],
      {
        moveLimit: 14,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      9,
      [
        queen(2, 4), queen(5, 4), queen(7, 4),
        queen(4, 7),
      ],
      { moveLimit: 14, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      10,
      [
        queen(2, 4), queen(7, 4),
        queen(3, 5), queen(6, 5),
        queen(4, 7),
      ],
      {
        moveLimit: 15,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run 20 — Surrounded: pieces at rank 2 (right in Rookie's face) and rank
// 7-8 (back row). Empty middle creates a gauntlet feel.

const RUN_SURROUNDED: RunDef = {
  id: 'surrounded',
  name: 'Surrounded',
  blurb: 'Knights at your doorstep, queens at the far wall.',
  levels: [
    make(
      1,
      [knight(3, 2), knight(6, 2), queen(4, 8)],
      { moveLimit: 10, allowedForms: ['knight'], enemiesPerTurn: 2 },
    ),
    make(
      2,
      [
        knight(2, 2), knight(5, 2), knight(7, 2),
        queen(4, 8),
      ],
      { moveLimit: 10, allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      3,
      [
        knight(2, 2), knight(3, 2), knight(6, 2), knight(7, 2),
        queen(4, 8),
      ],
      { moveLimit: 11, allowedForms: ['knight'], enemiesPerTurn: 3 },
    ),
    make(
      4,
      [
        knight(2, 2), knight(3, 2), knight(6, 2), knight(7, 2),
        queen(4, 8), queen(5, 8),
      ],
      { moveLimit: 11, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      5,
      [
        knight(2, 2), knight(3, 2), knight(5, 2), knight(7, 2),
        queen(4, 8),
      ],
      {
        moveLimit: 12,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        hazards: [{ file: 4, rank: 4 }, { file: 5, rank: 4 }],
      },
    ),
    make(
      6,
      [
        knight(2, 2), knight(3, 2), knight(4, 2), knight(5, 2), knight(7, 2),
        queen(4, 8), queen(5, 8),
      ],
      { moveLimit: 12, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      7,
      [
        knight(2, 2), knight(4, 2), knight(7, 2),
        queen(4, 8),
      ],
      { moveLimit: 13, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      8,
      [
        knight(2, 2), knight(3, 2), knight(6, 2), knight(7, 2),
        queen(4, 8), queen(5, 8),
      ],
      { moveLimit: 14, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      9,
      [
        knight(1, 2), knight(2, 2), knight(3, 2), knight(6, 2), knight(7, 2), knight(8, 2),
        queen(4, 8), queen(5, 8),
      ],
      { moveLimit: 15, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 },
    ),
    make(
      10,
      [
        knight(2, 2), knight(3, 2), knight(4, 2), knight(5, 2), knight(6, 2), knight(7, 2),
        queen(3, 8), queen(4, 8), queen(5, 8), queen(6, 8),
      ],
      {
        moveLimit: 18,
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 5,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Public registry.


// ─────────────────────────────────────────────────────────────────────────────
// 2026-05-15 Evening session — 6 calibrated 10-level runs.

// Run — Royal Standoff (auto-generated 2026-05-15-evening, sourced from normal-02).
const RUN_ROYAL_STANDOFF: RunDef = {
  id: 'royal-standoff',
  name: 'Royal Standoff',
  blurb: 'A back-rank fortress collapses on you. Carve a path through pawns and queens.',
  levels: [
    make(1, [pawn(3, 7), pawn(6, 7)]),
    make(2, [pawn(3, 7), pawn(6, 7), knight(4, 8)]),
    make(3, [pawn(3, 7), pawn(6, 7), pawn(5, 7), knight(4, 8), bishop(6, 8), pawn(2, 6), pawn(7, 6)]),
    make(4, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6)], { allowedForms: ['knight'] }),
    make(5, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 4), pawn(6, 4)], { allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(6, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4)], { moveLimit: 24, allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(7, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4), pawn(1, 4), pawn(8, 4)], { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 20, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 }),
    make(8, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), knight(7, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4), pawn(1, 4), pawn(8, 4)], { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 18, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(9, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), knight(7, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4), pawn(1, 4), pawn(8, 4), pawn(4, 4), pawn(5, 4), pawn(2, 4), pawn(7, 4), pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3), queen(5, 8)], { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }, { file: 4, rank: 4 }, { file: 5, rank: 4 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(10, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), knight(7, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4), pawn(1, 4), pawn(8, 4), pawn(4, 4), pawn(5, 4), pawn(2, 4), pawn(7, 4), pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3), queen(5, 8)], { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }, { file: 4, rank: 4 }, { file: 5, rank: 4 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
  ],
};

// Run — Endgame Assault (auto-generated 2026-05-15-evening, sourced from normal-04).
const RUN_ENDGAME_ASSAULT: RunDef = {
  id: 'endgame-assault',
  name: 'Endgame Assault',
  blurb: 'Pawns advance, pieces wait. Real-chess pressure meets roguelike chaos.',
  levels: [
    make(1, [pawn(3, 7), pawn(6, 7)]),
    make(2, [pawn(3, 7), pawn(6, 7), pawn(5, 7), knight(4, 8), pawn(2, 6), pawn(7, 6)]),
    make(3, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6)]),
    make(4, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 4), pawn(6, 4)], { allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(5, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4)], { moveLimit: 24, allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(6, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4)], { moveLimit: 24, allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(7, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4), pawn(1, 4), pawn(8, 4)], { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 20, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 2 }),
    make(8, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), knight(7, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4), pawn(1, 4), pawn(8, 4)], { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 18, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(9, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), knight(7, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4), pawn(1, 4), pawn(8, 4), pawn(4, 4), pawn(5, 4), pawn(2, 4), pawn(7, 4), pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3), queen(5, 8)], { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }, { file: 4, rank: 4 }, { file: 5, rank: 4 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(10, [pawn(3, 7), pawn(6, 7), pawn(5, 7), pawn(4, 7), knight(4, 8), bishop(6, 8), queen(4, 8), knight(2, 8), bishop(3, 8), knight(7, 8), pawn(2, 6), pawn(7, 6), pawn(4, 6), pawn(6, 6), pawn(3, 6), pawn(5, 6), pawn(3, 4), pawn(6, 4), pawn(1, 4), pawn(8, 4), pawn(4, 4), pawn(5, 4), pawn(2, 4), pawn(7, 4), pawn(2, 3), pawn(4, 3), pawn(5, 3), pawn(7, 3), queen(5, 8)], { hazards: [{ file: 1, rank: 5 }, { file: 8, rank: 5 }, { file: 4, rank: 4 }, { file: 5, rank: 4 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
  ],
};

// Run — Iron Veil (auto-generated 2026-05-15-evening, sourced from walls-03).
const RUN_IRON_VEIL: RunDef = {
  id: 'iron-veil',
  name: 'Iron Veil',
  blurb: 'Defended chains, layered ranks, no easy capture. Every wall is a trap.',
  levels: [
    make(1, [pawn(2, 3), pawn(5, 3), pawn(7, 3)]),
    make(2, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), knight(4, 6)]),
    make(3, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), knight(4, 6)], { allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(4, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), knight(4, 6), bishop(5, 6), pawn(4, 7)], { allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(5, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), knight(4, 6), bishop(5, 6), knight(3, 6), pawn(4, 7)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }], allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(6, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), pawn(4, 7), queen(4, 8)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }], moveLimit: 22, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(7, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), knight(7, 6), pawn(4, 7), queen(4, 8), pawn(5, 7), bishop(5, 7)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }, { file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 18, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(8, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), knight(7, 6), pawn(4, 7), queen(4, 8), pawn(5, 7), bishop(5, 7)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }, { file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 18, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(9, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), knight(7, 6), pawn(4, 7), queen(4, 8), pawn(5, 7), bishop(5, 7), knight(3, 7)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }, { file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(10, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), knight(7, 6), pawn(4, 7), queen(4, 8), pawn(5, 7), bishop(5, 7), knight(3, 7), queen(5, 8)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }, { file: 1, rank: 5 }, { file: 8, rank: 5 }, { file: 4, rank: 7 }, { file: 5, rank: 7 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 }),
  ],
};

// Run — Stone Citadel (auto-generated 2026-05-15-evening, sourced from walls-02).
const RUN_STONE_CITADEL: RunDef = {
  id: 'stone-citadel',
  name: 'Stone Citadel',
  blurb: 'Walls within walls. Tempo is everything; one wasted move ends you.',
  levels: [
    make(1, [pawn(2, 3), pawn(5, 3), pawn(7, 3)]),
    make(2, [pawn(2, 3), pawn(5, 3), pawn(7, 3)]),
    make(3, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), knight(4, 6)], { enemiesPerTurn: 2 }),
    make(4, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), knight(4, 6), bishop(5, 6), pawn(4, 7)], { allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(5, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), knight(4, 6), bishop(5, 6), knight(3, 6), pawn(4, 7)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }], allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(6, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), pawn(4, 7), queen(4, 8)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }], moveLimit: 22, allowedForms: ['knight'], enemiesPerTurn: 3 }),
    make(7, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), pawn(4, 7), queen(4, 8)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }], moveLimit: 22, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(8, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), knight(7, 6), pawn(4, 7), queen(4, 8), pawn(5, 7), bishop(5, 7)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }, { file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 18, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(9, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), knight(7, 6), pawn(4, 7), queen(4, 8), pawn(5, 7), bishop(5, 7), knight(3, 7)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }, { file: 1, rank: 5 }, { file: 8, rank: 5 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(10, [pawn(2, 3), pawn(5, 3), pawn(7, 3), pawn(3, 4), pawn(6, 4), pawn(1, 3), pawn(3, 3), pawn(1, 4), pawn(8, 4), pawn(4, 3), pawn(6, 3), pawn(8, 3), pawn(2, 4), pawn(5, 4), pawn(7, 4), knight(4, 6), bishop(5, 6), knight(3, 6), bishop(6, 6), knight(7, 6), pawn(4, 7), queen(4, 8), pawn(5, 7), bishop(5, 7), knight(3, 7), queen(5, 8)], { hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }, { file: 1, rank: 5 }, { file: 8, rank: 5 }, { file: 4, rank: 7 }, { file: 5, rank: 7 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 4 }),
  ],
};

// Run — Crossroads (auto-generated 2026-05-15-evening, sourced from mixed-02).
const RUN_CROSSROADS: RunDef = {
  id: 'crossroads',
  name: 'Crossroads',
  blurb: 'Queens cover diagonals, knights cover the middle. Pick your route.',
  levels: [
    make(1, [bishop(2, 6), pawn(4, 4)]),
    make(2, [bishop(2, 6), pawn(4, 4), bishop(7, 6)]),
    make(3, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4)], { enemiesPerTurn: 2 }),
    make(4, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }], allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(5, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }], allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(6, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 22, allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(7, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 18, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(8, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5), bishop(5, 8), pawn(4, 6), pawn(5, 6)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(9, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5), bishop(5, 8), pawn(4, 6), pawn(5, 6), queen(2, 8), queen(7, 8), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), knight(4, 6), knight(5, 6)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }, { file: 4, rank: 6 }, { file: 5, rank: 6 }], moveLimit: 15, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(10, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5), bishop(5, 8), pawn(4, 6), pawn(5, 6), queen(2, 8), queen(7, 8), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), knight(4, 6), knight(5, 6)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }, { file: 4, rank: 6 }, { file: 5, rank: 6 }], moveLimit: 15, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
  ],
};

// Run — Pincer (auto-generated 2026-05-15-evening, sourced from mixed-04).
const RUN_PINCER: RunDef = {
  id: 'pincer',
  name: 'Pincer',
  blurb: 'Squeezed from both flanks. Bishops on one side, queens on the other.',
  levels: [
    make(1, [bishop(2, 6), pawn(4, 4)]),
    make(2, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4)]),
    make(3, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }], enemiesPerTurn: 2 }),
    make(4, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }], allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(5, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 22, allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(6, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 22, allowedForms: ['knight'], enemiesPerTurn: 2 }),
    make(7, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 18, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(8, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5), bishop(5, 8), pawn(4, 6), pawn(5, 6)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }], moveLimit: 16, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(9, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5), bishop(5, 8), pawn(4, 6), pawn(5, 6), queen(2, 8), queen(7, 8), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), knight(4, 6), knight(5, 6)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }, { file: 4, rank: 6 }, { file: 5, rank: 6 }], moveLimit: 15, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
    make(10, [bishop(2, 6), pawn(4, 4), bishop(7, 6), knight(4, 5), pawn(5, 4), pawn(3, 4), pawn(6, 4), queen(5, 6), pawn(2, 3), pawn(7, 3), knight(6, 5), bishop(3, 7), queen(4, 7), pawn(1, 4), pawn(8, 4), knight(2, 5), knight(7, 5), bishop(5, 8), pawn(4, 6), pawn(5, 6), queen(2, 8), queen(7, 8), pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), knight(4, 6), knight(5, 6)], { hazards: [{ file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 1, rank: 4 }, { file: 8, rank: 4 }, { file: 4, rank: 6 }, { file: 5, rank: 6 }], moveLimit: 15, allowedForms: ['knight', 'bishop'], enemiesPerTurn: 3 }),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Story Time Chess co-brand — 5 mini-runs, one per piece, teaching basics.
// Each run pins `allowedForms` to a single piece so Rookie stays in that form
// the whole time (engine treats formMovesLeft=-1 as locked).
// Ability offers are suppressed in the /run page when runId starts with 'stc-'.

const RUN_STC_KING: RunDef = {
  id: 'stc-king',
  name: 'STC · The King’s Stroll',
  blurb: 'Kings move one square at a time. Walk Rookie home.',
  levels: [
    make(1, [], { allowedForms: ['king'] }),
    make(2, [pawn(4, 5)], { allowedForms: ['king'] }),
    make(3, [pawn(3, 5), pawn(6, 5)], { allowedForms: ['king'] }),
  ],
};

const RUN_STC_BISHOP: RunDef = {
  id: 'stc-bishop',
  name: 'STC · The Bishop’s Path',
  blurb: 'Bishops glide on diagonals. Find the line.',
  levels: [
    make(1, [], { allowedForms: ['bishop'] }),
    make(2, [pawn(4, 4)], { allowedForms: ['bishop'] }),
    make(3, [pawn(3, 4), pawn(6, 4), knight(5, 6)], { allowedForms: ['bishop'] }),
  ],
};

const RUN_STC_PAWN: RunDef = {
  id: 'stc-pawn',
  name: 'STC · The Pawn’s March',
  blurb: 'One step forward. Captures go diagonal.',
  levels: [
    make(1, [], { allowedForms: ['pawn'] }),
    make(2, [pawn(4, 3)], { allowedForms: ['pawn'] }),
    make(3, [pawn(3, 3), pawn(5, 3), pawn(4, 4)], { allowedForms: ['pawn'] }),
  ],
};

const RUN_STC_KNIGHT: RunDef = {
  id: 'stc-knight',
  name: 'STC · The Knight’s Dance',
  blurb: 'L-shaped hops. Knights jump over anything.',
  levels: [
    make(1, [], { allowedForms: ['knight'] }),
    make(2, [pawn(3, 3), pawn(4, 3), pawn(5, 3)], { allowedForms: ['knight'] }),
    make(3, [pawn(3, 3), pawn(4, 3), pawn(5, 3), pawn(6, 3), bishop(4, 6)], { allowedForms: ['knight'] }),
  ],
};

const RUN_STC_QUEEN: RunDef = {
  id: 'stc-queen',
  name: 'STC · The Queen’s Power',
  blurb: 'Every direction, any distance. The Queen rules.',
  levels: [
    make(1, [pawn(4, 4)], { allowedForms: ['queen'] }),
    make(2, [pawn(3, 4), pawn(6, 4), knight(5, 6)], { allowedForms: ['queen'] }),
    make(3, [pawn(3, 4), pawn(6, 4), knight(5, 6), bishop(2, 6), bishop(7, 6)], { allowedForms: ['queen'] }),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Abilities Test Run — Convert / Squad (passive) / Drones playable test.
// Squad spawns automatically each level (handled in seed.ts when runId match).
// Offers are filtered to convert + drones only (Squad is passive).

const RUN_ABILITIES_V2: RunDef = {
  id: 'abilities-v2',
  name: 'Abilities Test Run',
  blurb: 'Trying out Convert, Squad, and Drones.',
  allowedAbilities: ['convert', 'drones', 'squad'],
  levels: [
    make(
      1,
      [
        pawn(2, 4), pawn(5, 4), pawn(7, 4),
        pawn(3, 6), pawn(6, 6),
        pawn(4, 7), pawn(6, 7),
      ],
      { enemiesPerTurn: 1 },
    ),
    make(
      2,
      [
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        knight(4, 5),
        pawn(2, 6), pawn(6, 6),
        bishop(5, 7),
      ],
      { enemiesPerTurn: 2 },
    ),
    make(
      3,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(3, 6), knight(6, 6),
        bishop(5, 7),
      ],
      { enemiesPerTurn: 2 },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(3, 6), knight(6, 6),
        queen(5, 7),
      ],
      { enemiesPerTurn: 3, moveLimit: 18 },
    ),
    make(
      5,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(3, 6), bishop(5, 6), knight(7, 6),
        queen(4, 8), queen(5, 8),
      ],
      { enemiesPerTurn: 3, moveLimit: 20 },
    ),
    make(
      6,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(3, 6), knight(5, 6), bishop(7, 6),
        knight(4, 7), bishop(6, 7),
      ],
      { enemiesPerTurn: 3, moveLimit: 20 },
    ),
    make(
      7,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(3, 6), bishop(6, 6),
        bishop(2, 7), knight(5, 7), bishop(7, 7),
        queen(4, 8),
      ],
      {
        enemiesPerTurn: 3,
        moveLimit: 22,
        hazards: [{ file: 4, rank: 5 }, { file: 5, rank: 5 }],
      },
    ),
    make(
      8,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        bishop(2, 6), knight(5, 6), bishop(7, 6),
        knight(3, 7), bishop(5, 7), knight(6, 7),
        queen(4, 8),
      ],
      {
        enemiesPerTurn: 3,
        moveLimit: 22,
        hazards: [
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 1, rank: 6 }, { file: 8, rank: 6 },
        ],
      },
    ),
    make(
      9,
      [
        pawn(1, 3), pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(2, 4), pawn(4, 4), pawn(6, 4), pawn(8, 4),
        knight(2, 6), bishop(5, 6), knight(7, 6),
        bishop(3, 7), knight(6, 7),
        queen(4, 8), queen(5, 8),
      ],
      {
        enemiesPerTurn: 4,
        moveLimit: 24,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
        ],
      },
    ),
    make(
      10,
      [
        pawn(2, 3), pawn(4, 3), pawn(6, 3), pawn(8, 3),
        pawn(1, 4), pawn(3, 4), pawn(5, 4), pawn(7, 4),
        knight(2, 6), bishop(4, 6), bishop(5, 6), knight(7, 6),
        bishop(3, 7), knight(6, 7),
        queen(3, 8), queen(4, 8), queen(5, 8), queen(6, 8),
      ],
      {
        enemiesPerTurn: 4,
        moveLimit: 26,
        hazards: [
          { file: 1, rank: 5 }, { file: 8, rank: 5 },
          { file: 4, rank: 5 }, { file: 5, rank: 5 },
          { file: 2, rank: 7 }, { file: 7, rank: 7 },
        ],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run — The Switchback: two walls force an S-curve.
//
// Wall A (rank 6, files a-g) blocks every file except h.
// Wall B (rank 4, files b-h) blocks every file except a.
// Forced path: a1-area → a-file up to a5 → rank 5 corridor across → h-file
// up through h6 gap → rank 8.
//
// Geometry note: sliders parked ON rank 5 are stuck — all 4 diagonals and
// both file directions hit a wall. Knights are the only mobile threat in
// the corridor, which the level progression leans into.

const SWITCHBACK_WALLS: Coord[] = [
  { file: 1, rank: 6 }, { file: 2, rank: 6 }, { file: 3, rank: 6 },
  { file: 4, rank: 6 }, { file: 5, rank: 6 }, { file: 6, rank: 6 },
  { file: 7, rank: 6 },
  { file: 2, rank: 4 }, { file: 3, rank: 4 }, { file: 4, rank: 4 },
  { file: 5, rank: 4 }, { file: 6, rank: 4 }, { file: 7, rank: 4 },
  { file: 8, rank: 4 },
];

const RUN_SWITCHBACK: RunDef = {
  id: 'switchback',
  name: 'The Switchback',
  blurb: 'Two walls, one path. Up the a-file, across, up the h-file.',
  levels: [
    make(
      1,
      [pawn(2, 5), pawn(8, 7)],
      { hazards: [...SWITCHBACK_WALLS] },
    ),
    make(
      2,
      [pawn(2, 5), pawn(5, 5), pawn(7, 7), pawn(8, 7)],
      { hazards: [...SWITCHBACK_WALLS] },
    ),
    make(
      3,
      [
        pawn(7, 3),
        pawn(2, 5), pawn(5, 5),
        pawn(7, 7), pawn(8, 7),
      ],
      { hazards: [...SWITCHBACK_WALLS] },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(7, 3),
        knight(5, 5),
        pawn(7, 7), pawn(8, 7),
      ],
      {
        hazards: [...SWITCHBACK_WALLS],
        allowedForms: ['knight'],
        moveLimit: 18,
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(7, 3),
        knight(4, 5), knight(6, 5),
        pawn(7, 7), pawn(8, 7),
      ],
      {
        hazards: [...SWITCHBACK_WALLS],
        allowedForms: ['knight'],
        moveLimit: 18,
      },
    ),
    make(
      6,
      [
        pawn(2, 3), pawn(4, 3), pawn(7, 3),
        knight(4, 5), knight(6, 5),
        bishop(4, 7), bishop(6, 7), pawn(8, 7),
      ],
      {
        hazards: [...SWITCHBACK_WALLS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 15,
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(4, 3), pawn(7, 3),
        knight(3, 5), pawn(5, 5), knight(7, 5),
        bishop(7, 7), pawn(8, 7),
      ],
      {
        hazards: [...SWITCHBACK_WALLS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 17,
      },
    ),
    make(
      8,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), knight(5, 5), knight(7, 5),
        knight(4, 7), bishop(6, 7), pawn(8, 7),
      ],
      {
        hazards: [...SWITCHBACK_WALLS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 18,
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(5, 3), pawn(7, 3),
        knight(3, 5), knight(5, 5), knight(7, 5),
        knight(4, 7), bishop(6, 7), queen(8, 7),
      ],
      {
        hazards: [...SWITCHBACK_WALLS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
      },
    ),
    make(
      10,
      [
        pawn(2, 3), pawn(4, 3), pawn(7, 3),
        queen(2, 5), knight(3, 5), queen(8, 5),
        knight(4, 7), bishop(6, 7), pawn(8, 7),
      ],
      {
        hazards: [...SWITCHBACK_WALLS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run — The X: two diagonal hazard lines form a giant X across the board.
//
// Diag NE: a3 → f8.  Diag NW: h3 → c8.
// Every file is blocked partway up. Rooks get trapped in the central
// pocket (max d5/e5). Bishops travel diagonals that run PARALLEL to the
// hazards and can reach corner squares (h8 from e5 NE, a8 from d5 NW)
// in a single slide. The map is fundamentally bishop-required.

const X_HAZARDS: Coord[] = [
  { file: 1, rank: 3 }, { file: 2, rank: 4 }, { file: 3, rank: 5 },
  { file: 4, rank: 6 }, { file: 5, rank: 7 }, { file: 6, rank: 8 },
  { file: 8, rank: 3 }, { file: 7, rank: 4 }, { file: 6, rank: 5 },
  { file: 5, rank: 6 }, { file: 4, rank: 7 }, { file: 3, rank: 8 },
];

// Early-level variant: X with the central crossing-squares (e6, e7) removed
// so a determined rook can race up the e-file. Lets L1-L3 stay rook-friendly
// before the full trap closes in L4+.
const X_HAZARDS_OPEN_E: Coord[] = X_HAZARDS.filter(
  (h) => !(h.file === 5 && (h.rank === 6 || h.rank === 7)),
);

const RUN_X: RunDef = {
  id: 'the-x',
  name: 'The X',
  blurb: 'Two diagonal walls cross the board. Bishops thrive — rooks get stuck.',
  levels: [
    make(
      1,
      [pawn(5, 5)],
      { hazards: [...X_HAZARDS_OPEN_E], allowedForms: ['bishop'] },
    ),
    make(
      2,
      [pawn(5, 3), pawn(5, 5), pawn(4, 5)],
      { hazards: [...X_HAZARDS_OPEN_E], allowedForms: ['bishop'] },
    ),
    make(
      3,
      [
        pawn(3, 3), pawn(5, 3), pawn(7, 3),
        pawn(4, 5), pawn(5, 5),
        knight(4, 4),
      ],
      { hazards: [...X_HAZARDS_OPEN_E], allowedForms: ['bishop'] },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(3, 3), pawn(4, 3),
        pawn(5, 3), pawn(6, 3), pawn(7, 3),
        pawn(4, 5), pawn(5, 5),
      ],
      {
        hazards: [...X_HAZARDS],
        allowedForms: ['bishop', 'knight'],
      },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(3, 3), pawn(4, 3),
        pawn(5, 3), pawn(6, 3), pawn(7, 3),
        pawn(4, 5), pawn(5, 5),
        bishop(2, 7),
      ],
      {
        hazards: [...X_HAZARDS],
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 2,
      },
    ),
    make(
      6,
      [
        pawn(3, 3), pawn(5, 3), pawn(4, 5),
        pawn(6, 6), bishop(2, 7),
      ],
      {
        hazards: [...X_HAZARDS],
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 2,
        moveLimit: 15,
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(3, 3), pawn(4, 3),
        pawn(5, 3), pawn(6, 3), pawn(7, 3),
        pawn(4, 5), pawn(5, 5),
        queen(7, 7),
      ],
      {
        hazards: [...X_HAZARDS],
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 2,
        moveLimit: 18,
      },
    ),
    make(
      8,
      [
        pawn(2, 3), pawn(3, 3), pawn(4, 3),
        pawn(5, 3), pawn(6, 3), pawn(7, 3),
        pawn(4, 5), pawn(5, 5),
        queen(2, 7), queen(7, 7),
      ],
      {
        hazards: [...X_HAZARDS],
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 2,
        moveLimit: 18,
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(3, 3), pawn(4, 3),
        pawn(5, 3), pawn(6, 3), pawn(7, 3),
        pawn(4, 5), pawn(5, 5),
        bishop(2, 5), bishop(7, 5),
        queen(2, 7), queen(7, 7),
      ],
      {
        hazards: [...X_HAZARDS],
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 19,
      },
    ),
    make(
      10,
      [
        pawn(2, 3), pawn(3, 3), pawn(4, 3),
        pawn(5, 3), pawn(6, 3), pawn(7, 3),
        pawn(4, 5), pawn(5, 5),
        bishop(2, 5), bishop(7, 5),
        knight(3, 7), knight(6, 7),
        queen(2, 7), queen(7, 7),
      ],
      {
        hazards: [...X_HAZARDS],
        allowedForms: ['bishop', 'knight'],
        enemiesPerTurn: 3,
        moveLimit: 20,
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run — The Bridge: two rivers, two fords, on opposite ends.
//
// Rank 3 is a wall except g3. Rank 6 is a wall except b6. Rookie must
// sidestep east to cross the first river, traverse the open rank 4-5
// corridor, then sidestep west to cross the second river. Forced zigzag.

const BRIDGE_HAZARDS: Coord[] = [
  { file: 1, rank: 3 }, { file: 2, rank: 3 }, { file: 3, rank: 3 },
  { file: 4, rank: 3 }, { file: 5, rank: 3 }, { file: 6, rank: 3 },
  { file: 8, rank: 3 },
  { file: 1, rank: 6 }, { file: 3, rank: 6 }, { file: 4, rank: 6 },
  { file: 5, rank: 6 }, { file: 6, rank: 6 }, { file: 7, rank: 6 },
  { file: 8, rank: 6 },
];

const RUN_BRIDGE: RunDef = {
  id: 'the-bridge',
  name: 'The Bridge',
  blurb: 'Two rivers, two fords. Knights everywhere — each level a different gauntlet.',
  levels: [
    // L1 — corner knights + center knight
    make(
      1,
      [
        knight(3, 4), knight(7, 4),
        knight(2, 5), knight(5, 5),
        bishop(4, 8),
        pawn(2, 7),
      ],
      { hazards: [...BRIDGE_HAZARDS], allowedForms: ['knight'] },
    ),
    // L2 — alternate knight pattern, shifted right
    make(
      2,
      [
        knight(2, 4), knight(5, 4), knight(8, 4),
        knight(4, 5), knight(7, 5),
        bishop(6, 8),
        pawn(3, 7),
      ],
      {
        hazards: [...BRIDGE_HAZARDS],
        allowedForms: ['knight'],
        enemiesPerTurn: 2,
      },
    ),
    // L3 — dense rank 4
    make(
      3,
      [
        knight(3, 4), knight(5, 4), knight(7, 4),
        knight(2, 5), knight(4, 5), knight(7, 5),
        bishop(3, 8),
        knight(4, 7),
        pawn(2, 7),
      ],
      {
        hazards: [...BRIDGE_HAZARDS],
        allowedForms: ['knight'],
        enemiesPerTurn: 2,
      },
    ),
    // L4 — first queen joins
    make(
      4,
      [
        knight(2, 4), knight(6, 4),
        knight(3, 5), knight(5, 5), knight(8, 5),
        queen(2, 8),
        knight(3, 7), bishop(7, 8),
        pawn(2, 7),
      ],
      {
        hazards: [...BRIDGE_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
      },
    ),
    // L5 — knight wall on rank 5
    make(
      5,
      [
        knight(3, 4), knight(5, 4), knight(7, 4),
        knight(2, 5), knight(4, 5), knight(6, 5), knight(8, 5),
        queen(4, 8),
        knight(5, 7), bishop(3, 8),
      ],
      {
        hazards: [...BRIDGE_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 18,
      },
    ),
    // L6 — twin queens at rank 8 corners
    make(
      6,
      [
        knight(2, 4), knight(4, 4), knight(6, 4), knight(8, 4),
        knight(3, 5), knight(5, 5), knight(7, 5),
        queen(2, 8), queen(7, 8),
        knight(4, 7),
        bishop(5, 8),
      ],
      {
        hazards: [...BRIDGE_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
      },
    ),
    // L7 — queen takes the corridor
    make(
      7,
      [
        knight(3, 4), knight(5, 4), knight(7, 4),
        queen(2, 5), knight(4, 5), knight(6, 5), queen(8, 5),
        queen(7, 8),
        knight(3, 7), knight(5, 7),
        bishop(3, 8),
        pawn(2, 7),
      ],
      {
        hazards: [...BRIDGE_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 15,
      },
    ),
    // L8 — knight wall + queens
    make(
      8,
      [
        knight(2, 4), knight(4, 4), knight(6, 4), queen(8, 4),
        knight(3, 5), queen(5, 5), knight(7, 5),
        queen(2, 8),
        knight(4, 7), knight(6, 7),
        bishop(5, 8), bishop(7, 8),
        pawn(2, 7),
      ],
      {
        hazards: [...BRIDGE_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 14,
      },
    ),
    // L9 — three queens, dense everywhere
    make(
      9,
      [
        knight(3, 4), knight(5, 4), knight(7, 4), queen(2, 4),
        knight(4, 5), queen(6, 5), knight(8, 5),
        queen(3, 8), queen(7, 8),
        knight(5, 7), knight(6, 7),
        bishop(4, 8),
        pawn(2, 7), pawn(3, 7),
      ],
      {
        hazards: [...BRIDGE_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 13,
      },
    ),
    // L10 — boss: ford pawns + multi-layer defense
    make(
      10,
      [
        pawn(7, 3), pawn(2, 6),
        knight(2, 4), knight(5, 4), knight(6, 4), knight(8, 4),
        queen(3, 5), knight(5, 5), knight(7, 5),
        pawn(1, 7), pawn(3, 7),
        knight(4, 7), knight(6, 7),
        bishop(2, 8), knight(7, 8),
        queen(4, 8), queen(8, 8),
      ],
      {
        hazards: [...BRIDGE_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 4,
        moveLimit: 12,
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Run — The Plus: a cross of hazards splits the board into four quadrants.
//
// Vertical bar d3-d7 + horizontal bar b5-f5 (skipping the shared d5 center).
// Files a, g, h are open all the way up — the edges are Rookie's natural
// routes. Late levels fortify the edges with queens, forcing inner-quadrant
// routing.

const PLUS_HAZARDS: Coord[] = [
  { file: 4, rank: 3 }, { file: 4, rank: 4 }, { file: 4, rank: 5 },
  { file: 4, rank: 6 }, { file: 4, rank: 7 },
  { file: 2, rank: 5 }, { file: 3, rank: 5 },
  { file: 5, rank: 5 }, { file: 6, rank: 5 },
];

const RUN_PLUS: RunDef = {
  id: 'the-plus',
  name: 'The Plus',
  blurb: 'A cross of barriers splits the board into four quadrants.',
  levels: [
    make(
      1,
      [pawn(1, 7)],
      { hazards: [...PLUS_HAZARDS] },
    ),
    make(
      2,
      [pawn(1, 7), pawn(8, 7), pawn(2, 3), pawn(7, 3)],
      { hazards: [...PLUS_HAZARDS] },
    ),
    make(
      3,
      [
        pawn(1, 3), pawn(2, 3), pawn(7, 3), pawn(8, 3),
        pawn(1, 7), pawn(8, 7),
      ],
      { hazards: [...PLUS_HAZARDS] },
    ),
    make(
      4,
      [
        pawn(2, 3), pawn(7, 3),
        pawn(1, 7), pawn(8, 7),
        knight(3, 6), knight(6, 6),
      ],
      { hazards: [...PLUS_HAZARDS], allowedForms: ['knight'] },
    ),
    make(
      5,
      [
        pawn(2, 3), pawn(7, 3),
        bishop(1, 5), bishop(8, 5),
        pawn(1, 7), pawn(8, 7),
      ],
      {
        hazards: [...PLUS_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
      },
    ),
    make(
      6,
      [
        pawn(2, 3), pawn(7, 3),
        knight(3, 6), knight(6, 6),
        bishop(1, 5), bishop(8, 5),
      ],
      {
        hazards: [...PLUS_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 15,
      },
    ),
    make(
      7,
      [
        pawn(2, 3), pawn(7, 3),
        knight(3, 6), knight(6, 6),
        queen(1, 7),
      ],
      {
        hazards: [...PLUS_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 15,
      },
    ),
    make(
      8,
      [
        pawn(2, 3), pawn(7, 3),
        knight(3, 6), knight(6, 6),
        queen(1, 7), queen(8, 7),
      ],
      {
        hazards: [...PLUS_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 2,
        moveLimit: 18,
      },
    ),
    make(
      9,
      [
        pawn(2, 3), pawn(7, 3),
        knight(3, 6), knight(6, 6),
        bishop(1, 5), bishop(8, 5),
        queen(1, 7), queen(8, 7),
      ],
      {
        hazards: [...PLUS_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 17,
      },
    ),
    make(
      10,
      [
        pawn(2, 3), pawn(7, 3),
        pawn(1, 6), pawn(8, 6),
        knight(3, 6), knight(6, 6),
        bishop(1, 5), bishop(8, 5),
        knight(2, 8), knight(7, 8),
        queen(1, 7), queen(8, 7),
      ],
      {
        hazards: [...PLUS_HAZARDS],
        allowedForms: ['knight', 'bishop'],
        enemiesPerTurn: 3,
        moveLimit: 18,
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PROTOTYPE — Rookie's Revenge: win by CAPTURING THE KING, not reaching rank 8.
// Hidden run (not in RUNS → not in the picker, daily rotation, or next-run
// cycling). Reach it via /?run=revenge-1.

const KING_GOAL = { winCondition: 'king' as const };
const STILL = { ...KING_GOAL, kingBehavior: 'still' as const };
const FLEE = { ...KING_GOAL, kingBehavior: 'flee' as const };
const X = (file: number, rank: number): Coord => ({ file, rank });

/**
 * Every ability the Revenge system knows about, whatever its pipeline stage.
 * The nightly harness sweeps the built ones (testing/approved/live); real
 * players only ever see `REVENGE_ABILITIES` below. See
 * docs/revenge-abilities.md for the "why it catches kings" notes and
 * docs/content-pipeline.md for the stages.
 */
export const REVENGE_ABILITY_CATALOG: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
  'aegis',
  'drones',
  'convert',
  'poison-dart',
  'decoy',
  // Late unlocks (see lib/run/achievements.ts) — weaker in the harness but
  // they're rewards, and an unlocked ability that never shows up is a bug.
  'squad',
  'rabies-dart',
  'become-king',
  // Support v3 (2026-08-18): terrain, cover, undo, pull, a rook at her side.
  'boulder',
  'smoke',
  'rewind',
  'magnet',
  'bodyguard',
  // Squire (2026-08-31): a rainbow knight the player controls — a second body.
  'summon-knight',
  // Controllable-summon family (2026-09-01): pieces you summon AND steer,
  // plus support cards that operate on them. In `testing` until Tyler approves.
  'bishop-squire',
  'page',
  'twin',
  'duchess',
  'vanguard',
  'swap',
  'sacrifice',
  'knighting',
];

/**
 * The offer pool real players draw from: catalog ∩ (approved | live) in
 * `data/content/pipeline.json`. Content in `testing` is NOT here — it stays
 * reachable through `?loadout=<id>:<tier>` (dev parity hook) only.
 */
export const REVENGE_ABILITIES: ReadonlyArray<string> = REVENGE_ABILITY_CATALOG.filter((id) => isPlayerFacing(id));

/**
 * The FINISHERS — abilities that take the king directly (extra move, pin,
 * surprise geometry). Every offer slate in Rookie's Revenge carries at least
 * two of these (as new picks or as upgrades of an owned one) so a random
 * pick can never brick the run. The other five are SUPPORT (they open the
 * pen / remove guards / cut escapes) and are the fun spice.
 */
export const REVENGE_CORE: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

/**
 * Rookie's Revenge v2 — 10 levels. L1–2 teach the idea (still king), L3+
 * the king FLEES but is penned by walls + his own guards (`kingPen` is the
 * hard guarantee — he never leaves it). Every level is tuned against the
 * playtest harness (scripts/run-playtest/revenge.ts) — see
 * docs/revenge-playtest.md before touching numbers.
 */
const RUN_REVENGE_1: RunDef = {
  id: 'revenge-1',
  name: "Rookie's Revenge",
  blurb: 'Rank 8 is just a row. Take the king.',
  allowedAbilities: REVENGE_ABILITIES,
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE,
  offerCoreMin: 2,
  levels: [
    // L1 — king alone behind 3 pawns. Rank 8 doesn't win; the king does.
    make(1, [pawn(4, 7), pawn(5, 7), pawn(6, 7), king(5, 8)], STILL),
    // L2 — king in the corner with a bishop + pawn shell.
    make(
      2,
      [
        pawn(6, 7), pawn(7, 7), pawn(8, 7),
        pawn(3, 4), pawn(6, 4),
        bishop(6, 6),
        king(8, 8),
      ],
      STILL,
    ),
    // L3 — THE HALLWAY. First fleeing king: pen d8-e8-f8 between two walls,
    // two pawn doors, one knight watching both. Reach his row and he's out of
    // sideways squares — teaches "corner him on his line".
    make(
      3,
      [pawn(4, 7), pawn(6, 7), knight(5, 5), pawn(2, 5), pawn(7, 5), king(5, 8)],
      {
        ...FLEE,
        hazards: [X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8'],
      },
    ),
    // L4 — CORNER OFFICE. 2x2 pen g7-h8, walled on the f-file. The h5 pawn
    // is the KEY: take it and he's stunned on your line — teaches capture-stun.
    make(
      4,
      [pawn(8, 5), knight(5, 6), bishop(3, 3), pawn(3, 4), pawn(6, 4), pawn(2, 6), king(8, 8)],
      {
        ...FLEE,
        hazards: [X(6, 8), X(6, 7)],
        kingPen: ['g8', 'h8', 'g7', 'h7'],
      },
    ),
    // L5 — THRONE ROOM. 3x2 room c7-e8. The d5 key is defended by the c6
    // pawn (pawns hold their posts; hunters roam). Knight + bishop hunt,
    // marchers push for promotion.
    make(
      5,
      [
        pawn(4, 5), pawn(3, 6),
        knight(3, 3), bishop(7, 5),
        pawn(1, 4), pawn(8, 4), pawn(6, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(2, 8), X(6, 8), X(2, 7), X(6, 7)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L6 — THE BALCONY. King on rank 7; the e5 key has two pawn defenders
    // (d6, f6). Knight, bishop and a queen hunt.
    make(
      6,
      [
        pawn(5, 5), pawn(4, 6), pawn(6, 6),
        knight(4, 3), bishop(2, 5), queen(8, 2),
        pawn(2, 3), pawn(7, 4),
        king(5, 7),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(3, 8), X(7, 8), X(3, 7), X(7, 7)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L7 — DOUBLE DOOR. e5 key behind d6/f6 pawn defenders; the hunters are
    // a queen, a bishop and a knight, plus two marchers.
    make(
      7,
      [
        pawn(5, 5), pawn(4, 6), pawn(6, 6),
        bishop(4, 4), queen(7, 4), knight(2, 3),
        pawn(1, 4), pawn(8, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(3, 8), X(7, 8), X(3, 7), X(7, 7)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L8 — THE KEEP. Corner 3x2 room f7-h8. h5 key defended by the g6 pawn.
    // Rank 7 is the open flank. Queen on the long diagonal, bishop + knight.
    make(
      8,
      [
        pawn(8, 5), pawn(7, 6),
        knight(7, 3), queen(4, 4), bishop(3, 6),
        pawn(2, 3), pawn(4, 2), pawn(6, 4),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(5, 8), X(5, 7)],
        kingPen: ['f8', 'g8', 'h8', 'f7', 'g7', 'h7'],
      },
    ),
    // L9 — CROSSFIRE. e5 key defended by d6 + f6 pawns; two queens, a
    // bishop and a knight hunt.
    make(
      9,
      [
        pawn(5, 5), pawn(4, 6), pawn(6, 6),
        queen(2, 4), queen(8, 4), knight(7, 2), bishop(3, 3),
        pawn(1, 3), pawn(8, 2),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(3, 8), X(7, 8), X(3, 7), X(7, 7)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L10 — THE COURT. 3x3 room c6-e8 (walls on b7/b8/f7/f8, rank 6 flanks
    // open). d5 key defended by c6/e6 pawns. Queen, two bishops, two knights.
    make(
      10,
      [
        pawn(4, 5), pawn(3, 6), pawn(5, 6),
        queen(4, 3), bishop(7, 4), bishop(2, 2), knight(2, 4), knight(7, 2),
        pawn(1, 3), pawn(8, 3), pawn(6, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 18,
        hazards: [X(2, 8), X(6, 8), X(2, 7), X(6, 7)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Rookie's Revenge — CANDIDATE runs (2026-08-30). Stage `testing` in
// data/content/pipeline.json (hidden from the daily pool + picker, loadable
// via ?run=) until Tyler approves them there. Direction: difficulty
// comes from the NUMBER OF PIECES (shells, defenders, hunters, marchers);
// walls/pens are the secondary flavour. Every level was drafted by
// scripts/run-playtest/revenge-generate.ts and then tuned by hand against
// scripts/run-playtest/revenge.ts — tables in docs/revenge-runs.md.

/**
 * revenge-2 — PAWN STORM. The pawn shell thickens every level (3 -> 13
 * pawns); hunters stay light (one knight, one bishop late). Lesson of the
 * run: a chain is dismantled from the OUTSIDE IN, and every capture you
 * make on his line is a stun.
 */
const RUN_REVENGE_2: RunDef = {
  id: 'revenge-2',
  name: 'Pawn Storm',
  blurb: 'More pawns every level. Bodies, not brains.',
  allowedAbilities: REVENGE_ABILITIES,
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE,
  offerCoreMin: 2,
  levels: [
    // L1 — FIRST BLOOD. King f8 behind three pawns. Rank 8 does nothing.
    make(1, [pawn(5, 7), pawn(6, 7), pawn(7, 7), king(6, 8)], STILL),
    // L2 — THE SHELL. Two pawn layers (e7-g7, d6/h6, e5/g5) + two marchers.
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7),
        pawn(4, 6), pawn(8, 6), pawn(5, 5), pawn(7, 5),
        pawn(3, 3), pawn(4, 4),
        king(6, 8),
      ],
      STILL,
    ),
    // L3 — THE DOORS. First fleeing king, 3x2 room c7-e8. Key d5 is FREE
    // (capture-stun lesson); door pawns c5/e5 block the side files; marchers b3/g3.
    make(
      3,
      [pawn(4, 5), pawn(3, 5), pawn(5, 5), pawn(2, 3), pawn(7, 3), king(4, 8)],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L4 — ONE GUARD. Key e5 defended by ONE pawn (d6) — take the guard first.
    // Knight c4 hunts; g5 shell; marchers a3/h4.
    make(
      4,
      [pawn(5, 5), pawn(4, 6), knight(3, 4), pawn(7, 5), pawn(1, 3), pawn(8, 4), king(5, 8)],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L5 — THE HEDGE. Key d5 with two defenders (c6/e6) and a side ring
    // (b5/f5). Knight f4 hunts; marcher h3.
    make(
      5,
      [
        pawn(4, 5), pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(6, 4),
        pawn(8, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L6 — THICKET. Same hedge plus a pawn IN FRONT of the key (d4) — the
    // file needs two captures. Knight h3; marchers f3/a4.
    make(
      6,
      [
        pawn(4, 5), pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5), pawn(4, 4),
        knight(8, 3),
        pawn(6, 3), pawn(1, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L7 — BRAMBLE. Key d5, c6/e6 defenders, b5/f5 ring. Knight f3 hunts;
    // marchers a4/g2 — the first level where two marchers race you.
    make(
      7,
      [
        pawn(4, 5), pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(6, 3),
        pawn(1, 4), pawn(7, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L8 — THE WALL OF PAWNS. Key e5, d6/f6 defenders, c5/g5 ring. Knight c3
    // + bishop g3 hunt; marchers h4/b4/c2.
    make(
      8,
      [
        pawn(5, 5), pawn(4, 6), pawn(6, 6),
        pawn(3, 5), pawn(7, 5),
        knight(3, 3), bishop(7, 3),
        pawn(8, 4), pawn(2, 4), pawn(3, 2),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L9 — PAWN STORM. Three rings: key d5, c6/e6, b5/f5, d4 in front, c3/e3
    // under it. Knight g4 + bishop b3; marchers a4/h3/g2.
    make(
      9,
      [
        pawn(4, 5), pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5), pawn(4, 4), pawn(3, 3), pawn(5, 3),
        knight(7, 4), bishop(2, 3),
        pawn(1, 4), pawn(8, 3), pawn(7, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 16,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L10 — [8/30 batch, replaced THE SWARM 2026-09-01: freeze-ray 27-38%] THE LAST TOWER. 3x3 corner room on a8; key a4 on his file, chain runs inward.
    // Key pa4; defended by pb5; shell pb3; hunters qe3 qf2 bd3 kc2; marchers pc4 pf3 pg4.
    make(
      10,
      [
        pawn(1, 4),
        pawn(2, 5),
        pawn(2, 3),
        queen(5, 3), queen(6, 2), bishop(4, 3), knight(3, 2),
        pawn(3, 4), pawn(6, 3), pawn(7, 4),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 18,
        hazards: [X(4, 6), X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7', 'a6', 'b6', 'c6'],
      },
    ),
  ],
};

/**
 * revenge-3 — THE ROYAL GUARD. Few pawns, HEAVY hunters: one bishop at L2,
 * a queen from L6, two queens from L8, five heavies on L10. The pressure is
 * sightlines, not bodies — every open line is somebody's.
 */
const RUN_REVENGE_3: RunDef = {
  id: 'revenge-3',
  name: 'The Royal Guard',
  blurb: 'Few pawns. Heavy pieces. Every line is watched.',
  allowedAbilities: REVENGE_ABILITIES,
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE,
  offerCoreMin: 2,
  levels: [
    // L1 — THE THRONE. King d8 behind c7/d7/e7.
    make(1, [pawn(3, 7), pawn(4, 7), pawn(5, 7), king(4, 8)], STILL),
    // L2 — THE BISHOP. Corner king g8, f7-h7 shell + e6; bishop c5 hunts; marcher b3.
    make(
      2,
      [pawn(6, 7), pawn(7, 7), pawn(8, 7), pawn(5, 6), bishop(3, 5), pawn(2, 3), king(7, 8)],
      STILL,
    ),
    // L3 — THE PAGE. First flee: 3x2 room d7-f8, key e5 FREE (capture-stun
    // lesson), one knight (b4) hunts; marchers a3/h3.
    make(
      3,
      [pawn(5, 5), knight(2, 4), pawn(1, 3), pawn(8, 3), king(5, 8)],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L4 — TWO COURTIERS. Key d5 defended by e6 only; bishop g3 + knight b3
    // hunt; marcher h4.
    make(
      4,
      [pawn(4, 5), pawn(5, 6), bishop(7, 3), knight(2, 3), pawn(8, 4), king(4, 8)],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L5 — THE ESCORT. Key e5, d6/f6 defenders; bishop b3 + knight h4; marchers a3/g2.
    make(
      5,
      [
        pawn(5, 5), pawn(4, 6), pawn(6, 6),
        bishop(2, 3), knight(8, 4),
        pawn(1, 3), pawn(7, 2),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L6 — HER MAJESTY. First queen (g2) + bishop a5. Key e5, d6/f6; marchers h4/b4.
    make(
      6,
      [
        pawn(5, 5), pawn(4, 6), pawn(6, 6),
        queen(7, 2), bishop(1, 5),
        pawn(8, 4), pawn(2, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L7 — THE RETINUE. Queen h3, bishop b5, knight a2. Key e5, d6/f6; marchers c2/a3.
    make(
      7,
      [
        pawn(5, 5), pawn(4, 6), pawn(6, 6),
        queen(8, 3), bishop(2, 5), knight(1, 2),
        pawn(3, 2), pawn(1, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 18,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L8 — TWIN QUEENS. The ARCH: b7/c6/d5/e6/f7 pawns, each defended by the
    // one behind it (b7/f7 are the free ends, but b7 and f7 lead nowhere —
    // b8/f8 are walls). Queens a2 + h3, knight g4; marchers c2/g2. Two
    // enemies move per turn from here on.
    make(
      8,
      [
        pawn(4, 5), pawn(3, 6), pawn(5, 6), pawn(2, 7), pawn(6, 7),
        queen(1, 2), queen(8, 3), knight(7, 4),
        pawn(3, 2), pawn(7, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 14,
        hazards: [X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L9 — THE PRIVY COUNCIL. 4 heavy hunters (queen, queen, bishop, knight) — sightlines, not bodies. Key c4. [generated royal-guard-L9-v2, 2026-09-01]
    // Key pc4; defended by pb5 pd5; shell pa4 pe4; hunters qe2 qa5 bh2 kh5; marchers pa3 pe3.
    make(
      9,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        pawn(1, 4), pawn(5, 4),
        queen(5, 2), queen(1, 5), bishop(8, 2), knight(8, 5),
        pawn(1, 3), pawn(5, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(1, 6), X(5, 6), X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
    // L10 — CROSSHAIRS. two keys — c5 on his file, f7 on his rank; the right wall is gone. [generated double-key-L10-v2, 2026-09-01]
    // Keys pc5 pf7; defended by pb6 pd6 pe8 pg8; shell pa5 pe5; hunters qg4 qg2 ba4 kh3; marchers ph4 pa3 pe3.
    make(
      10,
      [
        pawn(3, 5), pawn(6, 7),
        pawn(2, 6), pawn(4, 6), pawn(5, 8), pawn(7, 8),
        pawn(1, 5), pawn(5, 5),
        queen(7, 4), queen(7, 2), bishop(1, 4), knight(8, 3),
        pawn(8, 4), pawn(1, 3), pawn(5, 3),
        king(3, 7),
      ],
      {
        ...FLEE,
        moveLimit: 19,
        hazards: [X(1, 7), X(1, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
  ],
};

/**
 * revenge-4 — THE FORTRESS. Walls do the shaping here: inner walls that
 * leave one door, corner keeps, and 3x3 courts with 8-wall curtains. Piece
 * count still climbs (4 -> 14) but the ROOM is the character of each level.
 */
const RUN_REVENGE_4: RunDef = {
  id: 'revenge-4',
  name: 'The Fortress',
  blurb: 'Walls make the room. Pawns make the door.',
  allowedAbilities: REVENGE_ABILITIES,
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE,
  offerCoreMin: 2,
  levels: [
    // L1 — THE GATEHOUSE. King d8 behind c7/d7/e7, first walls on b8/f8.
    make(1, [pawn(3, 7), pawn(4, 7), pawn(5, 7), king(4, 8)], { ...STILL, hazards: [X(2, 8), X(6, 8)] }),
    // L2 — THE WALLED SHELL. King c8 walled on a8/e7/e8; b7-d7 shell, e6
    // pawn, bishop f5 hunts; marchers g3/h4.
    make(
      2,
      [pawn(2, 7), pawn(3, 7), pawn(4, 7), pawn(5, 6), bishop(6, 5), pawn(7, 3), pawn(8, 4), king(3, 8)],
      { ...STILL, hazards: [X(1, 8), X(5, 8), X(5, 7)] },
    ),
    // L3 — THE HALLWAY. Linear pen c8-e8 between walls b8/f8, door pawns
    // c7/e7, FREE key d5 on his file. Reach his row and he's out of squares.
    make(
      3,
      [pawn(3, 7), pawn(5, 7), pawn(4, 5), knight(6, 5), pawn(1, 4), pawn(8, 3), king(4, 8)],
      {
        ...FLEE,
        hazards: [X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8'],
      },
    ),
    // L4 — THE PORTCULLIS. 3x2 room d7-f8 with an INNER wall on d6: the only
    // door is the e-file. Key e5 defended by f6; bishop b3; marchers h3/a4.
    make(
      4,
      [pawn(5, 5), pawn(6, 6), bishop(2, 3), pawn(8, 3), pawn(1, 4), king(5, 8)],
      {
        ...FLEE,
        hazards: [X(3, 7), X(3, 8), X(7, 7), X(7, 8), X(4, 6)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L5 — INNER WARD. Room c7-e8, side walls extended to b6/f6. Key d5,
    // c6/e6 defenders; knight g4; marchers a3/h3.
    make(
      5,
      [
        pawn(4, 5), pawn(3, 6), pawn(5, 6),
        knight(7, 4),
        pawn(1, 3), pawn(8, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(2, 6), X(6, 6), X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L6 — THE COURTYARD. Room d7-f8 with 6 walls (c6-c8, g6-g8). Key e5,
    // d6/f6; a queen (c4) is the only hunter; marcher g4.
    make(
      6,
      [
        pawn(5, 5), pawn(4, 6), pawn(6, 6),
        queen(3, 4),
        pawn(7, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(3, 6), X(3, 7), X(3, 8), X(7, 6), X(7, 7), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L7 — THE DONJON. Corner keep a7-c8 walled on d7/d8. Key a5 defended by
    // b6; queen f2, bishop d5, knight e3 hunt; marchers h4/g2.
    make(
      7,
      [
        pawn(1, 5), pawn(2, 6),
        queen(6, 2), bishop(4, 5), knight(5, 3),
        pawn(8, 4), pawn(7, 2),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7'],
      },
    ),
    // L8 — CURTAIN WALL. 3x3 court c6-e8 behind 8 walls (b5-b8, f5-f8). Key
    // d4, c5/e5 defenders; queen b3 + bishop a2 + knight g4 (knights jump
    // walls); marchers f3/a3/g2.
    make(
      8,
      [
        pawn(4, 4), pawn(3, 5), pawn(5, 5),
        queen(2, 3), bishop(1, 2), knight(7, 4),
        pawn(6, 3), pawn(1, 3), pawn(7, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: [X(2, 5), X(2, 6), X(2, 7), X(2, 8), X(6, 5), X(6, 6), X(6, 7), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
    // L9 — THE INNER KEEP. 3x3 court e6-g8 on the h-side (walls d5-d8,
    // h5-h8). Key f4, e5/g5, d4/h4 ring; queen c4, bishop b4, knight c3;
    // marchers a4/h2/d2.
    make(
      9,
      [
        pawn(6, 4), pawn(5, 5), pawn(7, 5), pawn(4, 4), pawn(8, 4),
        queen(3, 4), bishop(2, 4), knight(3, 3),
        pawn(1, 4), pawn(8, 2), pawn(4, 2),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 17,
        hazards: [X(4, 5), X(4, 6), X(4, 7), X(4, 8), X(8, 5), X(8, 6), X(8, 7), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
    // L10 — THE FORTRESS. 3x3 court c6-e8 behind 8 walls. Key d4, c5/e5
    // defenders (no ring — fewer stuns to farm); two queens (f3/b2), bishop b3,
    // knights g2/h5; marchers h3/g3/a4.
    make(
      10,
      [
        pawn(4, 4), pawn(3, 5), pawn(5, 5),
        queen(6, 3), queen(2, 2), bishop(2, 3), knight(7, 2), knight(8, 5),
        pawn(8, 3), pawn(7, 3), pawn(1, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(2, 5), X(2, 6), X(2, 7), X(2, 8), X(6, 5), X(6, 6), X(6, 7), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7', 'c6', 'd6', 'e6'],
      },
    ),
  ],
};

/**
 * revenge-5 — STONEWORK (name TBD by Tyler; alternatives: "The Walled City",
 * "Masonry"). WALLS are the identity: every level is a piece of
 * architecture — a gate, a corridor, a keyhole, a moat, one open file, a
 * double gate, a bastion, a maze, a citadel — and the piece count still
 * climbs underneath it. L1-3 teach, L4-9 are tuned against the STARTER KIT
 * (surge / freeze-ray / drones, offers forced) rather than the no-ability
 * bot. L10 is the vault (see its comment).
 */
const RUN_REVENGE_5: RunDef = {
  id: 'revenge-5',
  name: 'Stonework',
  blurb: 'Every level is a building. Find the door.',
  allowedAbilities: REVENGE_ABILITIES,
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE,
  offerCoreMin: 2,
  levels: [
    // L1 — THE GATE. Walls close his rank (d8/f8); two pawns flank an open
    // e-file. Come up the file.
    make(1, [pawn(4, 7), pawn(6, 7), king(5, 8)], { ...STILL, hazards: [X(4, 8), X(6, 8)] }),
    // L2 — THE CORRIDOR. A walled hallway d3-d6 / f3-f6 leads up the e-file
    // to the king; one pawn stands in it. Marchers a4/h4 outside the walls.
    make(
      2,
      [pawn(5, 5), pawn(1, 4), pawn(8, 4), king(5, 8)],
      { ...STILL, hazards: [X(4, 3), X(4, 4), X(4, 5), X(4, 6), X(6, 3), X(6, 4), X(6, 5), X(6, 6)] },
    ),
    // L3 — THE KEYHOLE. Linear pen c8-e8 behind a rank-7 wall with ONE gap
    // (d7). Free key d5 on his file: take it, step into the keyhole, and once
    // you reach his rank he has no squares. Knight g5; marchers a3/h3.
    make(
      3,
      [pawn(4, 5), knight(7, 5), pawn(1, 3), pawn(8, 3), king(4, 8)],
      {
        ...FLEE,
        hazards: [X(2, 8), X(6, 8), X(3, 7), X(5, 7)],
        kingPen: ['c8', 'd8', 'e8'],
      },
    ),
    // L4 — THE MOAT. Walled court d7-f8 with a moat on rank 4 (d4/f4 walls):
    // the d/f defenders (d6/f6) of the e5 key can only be reached sideways.
    // Bishop b3; marchers a4/h3.
    make(
      4,
      [pawn(5, 5), pawn(4, 6), pawn(6, 6), bishop(2, 3), pawn(1, 4), pawn(8, 3), king(5, 8)],
      {
        ...FLEE,
        hazards: [X(3, 7), X(3, 8), X(7, 7), X(7, 8), X(4, 4), X(6, 4)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L5 — [generated 2026-09-01] THE HEDGE. 5 pawns. 1-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters kf4.
    make(
      5,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(6, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L6 — THE DOUBLE GATE. King on d7 (rank 7) with TWO lines: down the
    // d-file to the d5 key (c6/e6 defend) and along rank 7 to the b7 key
    // (a8 defends). Walls b8/f7/f8 close everything else. Queen h2, knight
    // g4, bishop b3; marchers h4/c2.
    make(
      6,
      [
        pawn(4, 5), pawn(3, 6), pawn(5, 6), pawn(2, 7), pawn(1, 8),
        queen(8, 2), knight(7, 4), bishop(2, 3),
        pawn(8, 4), pawn(3, 2),
        king(4, 7),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 11,
        hazards: [X(2, 8), X(6, 7), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L7 — [generated 2026-09-01] THE BAILEY. 8 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe4; defended by pd5 pf5; hunters qa4 ka3; marchers ph4 pg4.
    make(
      7,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        queen(1, 4), knight(1, 3),
        pawn(8, 4), pawn(7, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(3, 6), X(7, 6), X(3, 7), X(7, 7), X(3, 8), X(7, 8), X(3, 5), X(7, 5)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
    // L8 — THE MAZE. Two wall lines with gaps on opposite sides: rank 3 is
    // walled a3-g3 (gap h3), rank 5 is walled b5-h5 except the a5 gap and
    // the e5 KEY itself. The approach is a zigzag: h3 -> rank 4 -> a5 -> rank
    // 6 -> the d6/f6 defenders. Queen b7 waits by the pen; bishops g4/b4 and
    // knight c4 patrol the middle rank.
    make(
      8,
      [
        pawn(5, 5), pawn(4, 6), pawn(6, 6),
        queen(2, 7), bishop(7, 4), bishop(2, 4), knight(3, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 11,
        hazards: [
          X(3, 7), X(3, 8), X(7, 7), X(7, 8),
          X(1, 3), X(2, 3), X(3, 3), X(4, 3), X(5, 3), X(6, 3), X(7, 3),
          X(2, 5), X(3, 5), X(4, 5), X(6, 5), X(7, 5), X(8, 5),
        ],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L9 — [generated 2026-09-01] THE OUTFLANK. left flank open; 3 knights posted to cover it. Key e4.
    // Key pe4; defended by pd5 pf5; hunters kb6 kc4 kc5 bh3 qg3.
    make(
      9,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        knight(2, 6), knight(3, 4), knight(3, 5), bishop(8, 3), queen(7, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(7, 6), X(7, 7), X(7, 8), X(3, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
    // L10 — CROSSHAIRS. two keys — f5 on his file, c7 on his rank; the left wall is gone. [generated double-key-L10-v1, 2026-09-01]
    // Keys pf5 pc7; defended by pe6 pg6 pb8 pd8; shell pd5 ph5; hunters qa3 qb4 bb3 kh4; marchers pd3 pa4.
    make(
      10,
      [
        pawn(6, 5), pawn(3, 7),
        pawn(5, 6), pawn(7, 6), pawn(2, 8), pawn(4, 8),
        pawn(4, 5), pawn(8, 5),
        queen(1, 3), queen(2, 4), bishop(2, 3), knight(8, 4),
        pawn(4, 3), pawn(1, 4),
        king(6, 7),
      ],
      {
        ...FLEE,
        moveLimit: 21,
        hazards: [X(8, 7), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ABILITY LAB (2026-08-31) — hidden sandbox for playtesting the newest support
// abilities (Boulder / Smoke / Rewind / Magnet / Bodyguard / Squire) with the
// gameplay music. Reach via /?run=ability-lab. 3 short flee levels, a free
// 3-card offer before EVERY level, unlock gating OFF. NOT tuned by the harness —
// it's a toy box, not a run. Delete or promote once the abilities are signed off.

const LAB_ABILITIES: ReadonlyArray<string> = [
  'boulder',
  'smoke',
  'rewind',
  'magnet',
  'bodyguard',
  'summon-knight', // dev sandbox: testing-stage content is fair game here
  // Controllable-summon family (2026-09-01, testing).
  'bishop-squire',
  'page',
  'twin',
  'duchess',
  'vanguard',
  'swap',
  'sacrifice',
  'knighting',
  // two finishers so a slate can't brick the run
  'surge',
  'knight-hop',
];

const RUN_ABILITY_LAB: RunDef = {
  id: 'ability-lab',
  name: 'Ability Lab',
  blurb: 'New toys. Loud music. Take the king.',
  allowedAbilities: LAB_ABILITIES,
  ignoreUnlocks: true,
  offerEveryLevel: true,
  offerSize: 3,
  offerCore: LAB_ABILITIES.filter((id) => id !== 'surge' && id !== 'knight-hop'),
  offerCoreMin: 2,
  levels: [
    // L1 — DRAWBRIDGE. King penned in the h8 corner behind a wall on the
    // f-file. A bishop on b2 owns the long diagonal into g7. Boulder a square
    // on that diagonal (or Magnet the bishop) and the pen is yours.
    make(
      1,
      [bishop(2, 2), pawn(7, 6), pawn(4, 5), king(8, 8)],
      {
        ...FLEE,
        hazards: [X(6, 8), X(6, 7), X(6, 6)],
        kingPen: ['g8', 'h8', 'g7', 'h7'],
      },
    ),
    // L2 — GALLERY. King roams a 3-wide room c8-e8 / c7-e7 hunted by two
    // knights. Smoke to slip past the hunters; Squire gives you a second
    // body to cover an escape square while the rook closes.
    make(
      2,
      [knight(3, 4), knight(6, 5), pawn(2, 5), pawn(7, 4), king(4, 8)],
      {
        ...FLEE,
        hazards: [X(2, 8), X(6, 8), X(2, 7), X(6, 7)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L3 — CLOCK TOWER. 10-move limit, a queen prowling. A misstep costs the
    // level — unless you Rewind it. Bodyguard soaks the queen's tempo.
    make(
      3,
      [queen(1, 3), pawn(4, 6), pawn(5, 6), pawn(3, 5), king(4, 8)],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: [X(2, 8), X(6, 8), X(2, 7), X(6, 7), X(3, 7), X(5, 7)],
        kingPen: ['c8', 'd8', 'e8', 'd7'],
      },
    ),
  ],
};

/**
 * Every Rookie's Revenge run that exists in code, whatever its pipeline
 * stage. Which of these real players see is decided in ONE place:
 * `data/content/pipeline.json` (stage approved|live = player-facing).
 */
/**
 * revenge-6 — TWO KEYS (name TBD by Tyler). The double-key / open-flank
 * archetypes: from L5 the king sits on rank 7 with TWO open lines and a
 * pawn-defended key on each — the second key is the whole point — and the
 * early levels open one flank and post knights to cover it. Generated by
 * scripts/run-playtest/revenge-generate.ts --archetypes=double-key,open-flank
 * (2026-09-01) and tuned against revenge.ts. Level factory loop, iteration 3.
 */
const RUN_REVENGE_6: RunDef = {
  id: 'revenge-6',
  name: 'Two Keys',
  blurb: 'Every door has two locks. Find the second one.',
  allowedAbilities: REVENGE_ABILITIES,
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE,
  offerCoreMin: 2,
  levels: [
    // L1 — FIRST BLOOD. king alone behind three pawns. Rank 8 does nothing; the king does.
    // shell pd7 pe7 pf7.
    make(
      1,
      [
        pawn(4, 7), pawn(5, 7), pawn(6, 7),
        king(5, 8),
      ],
      STILL,
    ),
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pc7 pd7 pe7 pb6 pf6; hunters kg4; marchers pb3 pa3.
    make(
      2,
      [
        pawn(3, 7), pawn(4, 7), pawn(5, 7), pawn(2, 6), pawn(6, 6),
        knight(7, 4),
        pawn(2, 3), pawn(1, 3),
        king(4, 8),
      ],
      STILL,
    ),
    // L3 — SIDE DOOR. left flank open; 1 knight posted to cover it. Key e5.
    // Key pe5; hunters kc4.
    make(
      3,
      [
        pawn(5, 5),
        knight(3, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(7, 7), X(7, 8), X(3, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L4 — THE PICKET. left flank open; 1 knight posted to cover it. Key e5.
    // Key pe5; defended by pd6; hunters kc4.
    make(
      4,
      [
        pawn(5, 5),
        pawn(4, 6),
        knight(3, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(7, 7), X(7, 8), X(3, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L5 — TWO LOCKS. two keys — d5 on his file, g7 on his rank; the right wall is gone.
    // Keys pd5 pg7; defended by pc6 pe6 pf8 ph8; hunters kb3.
    make(
      5,
      [
        pawn(4, 5), pawn(7, 7),
        pawn(3, 6), pawn(5, 6), pawn(6, 8), pawn(8, 8),
        knight(2, 3),
        king(4, 7),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(2, 7), X(2, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L6 — [8/30 batch] THE COURTYARD. 6 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe5; defended by pd6 pf6; hunters qc4 nb3 ng3 (knights added 2026-09-01, was 88% no-ability); marchers pg4.
    make(
      6,
      [
        pawn(5, 5),
        pawn(4, 6), pawn(6, 6),
        queen(3, 4), knight(2, 3), knight(7, 3),
        pawn(7, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8), X(3, 6), X(7, 6)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L7 — THREE HORSES. right flank open; 2 knights posted to cover it. Key d5.
    // Key pd5; defended by pc6 pe6; hunters kf6 kf4 bf2; marchers pb4.
    make(
      7,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        knight(6, 6), knight(6, 4), bishop(6, 2),
        pawn(2, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(2, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L8 — [8/30 batch] DOUBLE BOLT. two keys — e5 on his file, b7 on his rank; the left wall is gone.
    // Keys pe5 pb7; defended by pd6 pf6 pa8 pc8; shell pc5 pg5; hunters kg4 bg3 qa2; marchers pc2 ph3.
    make(
      8,
      [
        pawn(5, 5), pawn(2, 7),
        pawn(4, 6), pawn(6, 6), pawn(1, 8), pawn(3, 8),
        pawn(3, 5), pawn(7, 5),
        knight(7, 4), bishop(7, 3), queen(1, 2),
        pawn(3, 2), pawn(8, 3),
        king(5, 7),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(7, 7), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L9 — THE OUTFLANK. left flank open; 3 knights posted to cover it. Key e4.
    // Key pe4; defended by pd5 pf5; hunters kb6 kc4 kc5 bh3 qg3.
    make(
      9,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        knight(2, 6), knight(3, 4), knight(3, 5), bishop(8, 3), queen(7, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(7, 6), X(7, 7), X(7, 8), X(3, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
    // L10 — CROSSHAIRS. two keys — c5 on his file, f7 on his rank; the right wall is gone.
    // Keys pc5 pf7; defended by pb6 pd6 pe8 pg8; shell pa5 pe5; hunters qg4 qg2 ba4 kh3; marchers ph4 pa3 pe3.
    make(
      10,
      [
        pawn(3, 5), pawn(6, 7),
        pawn(2, 6), pawn(4, 6), pawn(5, 8), pawn(7, 8),
        pawn(1, 5), pawn(5, 5),
        queen(7, 4), queen(7, 2), bishop(1, 4), knight(8, 3),
        pawn(8, 4), pawn(1, 3), pawn(5, 3),
        king(3, 7),
      ],
      {
        ...FLEE,
        moveLimit: 19,
        hazards: [X(1, 7), X(1, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
  ],
};

/**
 * revenge-7 — BRAMBLE CROWN. Pawn-shell dismantling levels (swarm
 * archetype) escalate into heavy-hunter "sightline, not bodies" levels
 * (royal-guard/double-key) by L8-L10. Generated by
 * scripts/run-playtest/revenge-generate.ts --slots=1-10 --trials=12
 * (2026-09-01), best-scoring candidate per slot against the revenge-1
 * difficulty curve, tuned against revenge.ts.
 */
const RUN_REVENGE_7: RunDef = {
  id: 'revenge-7',
  name: 'Bramble Crown',
  blurb: 'Pawns first. Then the court comes out.',
  allowedAbilities: REVENGE_ABILITIES,
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE,
  offerCoreMin: 2,
  levels: [
    // L1 — FIRST BLOOD. king alone behind three pawns. Rank 8 does nothing; the king does.
    // shell pe7 pf7 pg7.
    make(
      1,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7),
        king(6, 8),
      ],
      STILL,
    ),
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pe7 pf7 pg7 pd6 ph6 pe5 pg5; marchers pd2 ph4.
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7), pawn(4, 6), pawn(8, 6), pawn(5, 5), pawn(7, 5),
        pawn(4, 2), pawn(8, 4),
        king(6, 8),
      ],
      STILL,
    ),
    // L3 — THE DOOR. 1 pawns. 0-ring shell around the c5 key; dismantle the chain from the outside in.
    // Key pc5.
    make(
      3,
      [
        pawn(3, 5),
        king(3, 8),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
    // L4 — ONE GUARD. 2 pawns. 0-ring shell around the e5 key; dismantle the chain from the outside in.
    // Key pe5; defended by pd6; hunters kc4.
    make(
      4,
      [
        pawn(5, 5),
        pawn(4, 6),
        knight(3, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L5 — THE HEDGE. 5 pawns. 1-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters kf4.
    make(
      5,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(6, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L6 — THE COURTYARD. 6 walls — side walls plus an inner wall with one door on the e-file.
    // Key pe5; defended by pd6 pf6; hunters qc4; marchers pg4.
    make(
      6,
      [
        pawn(5, 5),
        pawn(4, 6), pawn(6, 6),
        queen(3, 4),
        pawn(7, 4),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(3, 7), X(7, 7), X(3, 8), X(7, 8), X(3, 6), X(7, 6)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L7 — BRAMBLE. 7 pawns. 2-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters kf3; marchers pa4 pg2.
    make(
      7,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(6, 3),
        pawn(1, 4), pawn(7, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L8 — DOUBLE BOLT. two keys — e5 on his file, b7 on his rank; the left wall is gone.
    // Keys pe5 pb7; defended by pd6 pf6 pa8 pc8; shell pc5 pg5; hunters kg4 bg3 qa2; marchers pc2 ph3.
    make(
      8,
      [
        pawn(5, 5), pawn(2, 7),
        pawn(4, 6), pawn(6, 6), pawn(1, 8), pawn(3, 8),
        pawn(3, 5), pawn(7, 5),
        knight(7, 4), bishop(7, 3), queen(1, 2),
        pawn(3, 2), pawn(8, 3),
        king(5, 7),
      ],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [X(7, 7), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7'],
      },
    ),
    // L9 — THE PRIVY COUNCIL. 4 heavy hunters (queen, queen, bishop, knight) — sightlines, not bodies. Key c4.
    // Key pc4; defended by pb5 pd5; shell pa4 pe4; hunters qg3 qf2 ba2 ke2; marchers pe3 pg4.
    make(
      9,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        pawn(1, 4), pawn(5, 4),
        queen(7, 3), queen(6, 2), bishop(1, 2), knight(5, 2),
        pawn(5, 3), pawn(7, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(1, 6), X(5, 6), X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
    // L10 — CROSSHAIRS. two keys — f5 on his file, c7 on his rank; the left wall is gone.
    // Keys pf5 pc7; defended by pe6 pg6 pb8 pd8; shell pd5 ph5; hunters qa3 qb4 bb3 kh4; marchers pd3 pa4.
    // (double-key-L10-v1 2026-09-01 — swapped in twice: royal-guard-L10-v1's freeze-ray losses
    // were mostly CAPTURED, and walled-court-L10-v1's were mostly move-limit but still under 80%
    // even at moveLimit 19; this candidate held zero captures and a clean lint pass at high trials.)
    make(
      10,
      [
        pawn(6, 5), pawn(3, 7),
        pawn(5, 6), pawn(7, 6), pawn(2, 8), pawn(4, 8),
        pawn(4, 5), pawn(8, 5),
        queen(1, 3), queen(2, 4), bishop(2, 3), knight(8, 4),
        pawn(4, 3), pawn(1, 4),
        king(6, 7),
      ],
      {
        ...FLEE,
        moveLimit: 21,
        hazards: [X(8, 7), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
  ],
};

const RUN_REVENGE_8: RunDef = {
  id: 'revenge-8',
  name: 'The Rampart',
  blurb: 'Every wall is thicker on the way up.',
  allowedAbilities: REVENGE_ABILITIES,
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE,
  offerCoreMin: 2,
  levels: [
    // L1 — FIRST BLOOD. king alone behind three pawns. Rank 8 does nothing; the king does.
    // shell pd7 pe7 pf7. (swarm-L1-v1, 2026-09-02-r8)
    make(
      1,
      [
        pawn(4, 7), pawn(5, 7), pawn(6, 7),
        king(5, 8),
      ],
      STILL,
    ),
    // L2 — THE SHELL. a second pawn layer. Still still — find the line, take the key.
    // shell pe7 pf7 pg7 pd6 ph6 pe5 pg5; marchers pd2 ph3. (swarm-L2-v1)
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7), pawn(4, 6), pawn(8, 6), pawn(5, 5), pawn(7, 5),
        pawn(4, 2), pawn(8, 3),
        king(6, 8),
      ],
      STILL,
    ),
    // L3 — CORNER OFFICE. 2x2 corner room on h8; key h5 on his file, chain runs inward.
    // Key ph5; hunters kb3. (corner-keep-L3-v2)
    make(
      3,
      [
        pawn(8, 5),
        knight(2, 3),
        king(8, 8),
      ],
      {
        ...FLEE,
        hazards: [X(6, 7), X(6, 8)],
        kingPen: ['g8', 'h8', 'g7', 'h7'],
      },
    ),
    // L4 — ONE GUARD. 0-ring shell around the d5 key; dismantle the chain from the outside in.
    // Key pd5; defended by pe6; hunters kh5. (swarm-L4-v1)
    make(
      4,
      [
        pawn(4, 5),
        pawn(5, 6),
        knight(8, 5),
        king(4, 8),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L5 — THE HEDGE. 1-ring shell around the f5 key; dismantle the chain from the outside in.
    // Key pf5; defended by pe6 pg6; shell pd5 ph5; hunters kc3; marchers pb3. (swarm-L5-v2 +marcher, budget 12->11)
    make(
      5,
      [
        pawn(6, 5),
        pawn(5, 6), pawn(7, 6),
        pawn(4, 5), pawn(8, 5),
        knight(3, 3),
        pawn(2, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(4, 7), X(8, 7), X(4, 8), X(8, 8)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
      },
    ),
    // L6 — THE OUTER HEDGE. 2-ring shell around the d5 key, a knight patrols the door.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters kf3; marchers pf4 pg2. (swarm-L7-v2, relabeled)
    make(
      6,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(6, 3),
        pawn(6, 4), pawn(7, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L7 — BRAMBLE. 2-ring shell around the d5 key; the knight waits on the far flank.
    // Key pd5; defended by pc6 pe6; shell pb5 pf5; hunters ka4; marchers pg2 pb3. (swarm-L7-v1)
    make(
      7,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        pawn(2, 5), pawn(6, 5),
        knight(1, 4),
        pawn(7, 2), pawn(2, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L8 — THE BASTION. 3x2 corner room on a8; key a5 on his file, chain runs inward.
    // Key pa5; defended by pb6; hunters qe3 bf3 kh3; marchers pf4 pd2 pg4 ph2. (corner-keep-L8-v1 +marcher, budget 15->13)
    make(
      8,
      [
        pawn(1, 5),
        pawn(2, 6),
        queen(5, 3), bishop(6, 3), knight(8, 3),
        pawn(6, 4), pawn(4, 2), pawn(7, 4), pawn(8, 2),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7'],
      },
    ),
    // L9 — THE CITADEL. 3x3 corner room on a8; key a4 on his file, chain runs inward.
    // Key pa4; defended by pb5; shell pb3; hunters qe5 bc4 bf4 kh3; marchers pc3 pd3 pe3. (corner-keep-L9-v2)
    make(
      9,
      [
        pawn(1, 4),
        pawn(2, 5),
        pawn(2, 3),
        queen(5, 5), bishop(3, 4), bishop(6, 4), knight(8, 3),
        pawn(3, 3), pawn(4, 3), pawn(5, 3),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [X(4, 6), X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7', 'a6', 'b6', 'c6'],
      },
    ),
    // L10 — THE LAST TOWER. 3x3 corner room on a8; key a4 on his file, two queens hold the yard.
    // Key pa4; defended by pb5; shell pb3; hunters qd4 qc3 bf5 kc4; marchers pe4 pg4 pf3 ph3. (corner-keep-L10-v3 +marcher, budget 18->13)
    make(
      10,
      [
        pawn(1, 4),
        pawn(2, 5),
        pawn(2, 3),
        queen(4, 4), queen(3, 3), bishop(6, 5), knight(3, 4),
        pawn(5, 4), pawn(7, 4), pawn(6, 3), pawn(8, 3),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 16,
        hazards: [X(4, 6), X(4, 7), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8', 'a7', 'b7', 'c7', 'a6', 'b6', 'c6'],
      },
    ),
  ],
};

const RUN_REVENGE_9: RunDef = {
  id: 'revenge-9',
  name: 'Cold Court',
  blurb: 'The guard is heavy and the walls do not care.',
  allowedAbilities: REVENGE_ABILITIES,
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE,
  offerCoreMin: 2,
  levels: [
    // L1 — FIRST BLOOD. king alone behind three pawns. Rank 8 does nothing; the king does.
    // shell pb7 pc7 pd7. (royal-guard-L1-v1)
    make(
      1,
      [
        pawn(2, 7), pawn(3, 7), pawn(4, 7),
        king(3, 8),
      ],
      STILL,
    ),
    // L2 — THE SHELL. a second pawn layer and one bishop. Still still — find the line, take the key.
    // shell pe7 pf7 pg7 pd6 ph6; hunters bc5; marchers ph3 pc3. (royal-guard-L2-v1)
    make(
      2,
      [
        pawn(5, 7), pawn(6, 7), pawn(7, 7), pawn(4, 6), pawn(8, 6),
        bishop(3, 5),
        pawn(8, 3), pawn(3, 3),
        king(6, 8),
      ],
      STILL,
    ),
    // L3 — THE GATE. 6 walls — side walls plus an inner wall with one door on the c-file.
    // Key pc5. (walled-court-L3-v1)
    make(
      3,
      [
        pawn(3, 5),
        king(3, 8),
      ],
      {
        ...FLEE,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8), X(2, 6), X(4, 6)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
    // L4 — THE BISHOP. 1 heavy hunter (bishop) — sightlines, not bodies. Key d5.
    // Key pd5; defended by pe6; hunters bg4; marchers ph3. (royal-guard-L4-v1)
    make(
      4,
      [
        pawn(4, 5),
        pawn(5, 6),
        bishop(7, 4),
        pawn(8, 3),
        king(4, 8),
      ],
      {
        ...FLEE,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L5 — HER MAJESTY. 1 heavy hunter (queen) — sightlines, not bodies. Key c5.
    // Key pc5; defended by pb6 pd6; hunters qe4; marchers pa3. (royal-guard-L5-v2)
    make(
      5,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        queen(5, 4),
        pawn(1, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 16,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
    // L6 — THE COURTYARD. 6 walls — side walls plus an inner wall with one door on the c-file.
    // Key pc5; defended by pb6 pd6; hunters qf4; marchers pf2. (walled-court-L6-v3)
    make(
      6,
      [
        pawn(3, 5),
        pawn(2, 6), pawn(4, 6),
        queen(6, 4),
        pawn(6, 2),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(1, 7), X(5, 7), X(1, 8), X(5, 8), X(1, 6), X(5, 6)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7'],
      },
    ),
    // L7 — THE RETINUE. 3 heavy hunters (queen, bishop, knight) — sightlines, not bodies. Key d5.
    // Key pd5; defended by pc6 pe6; hunters qa3 bg5 ka4; marchers pf4 pg4. (royal-guard-L7-v1)
    make(
      7,
      [
        pawn(4, 5),
        pawn(3, 6), pawn(5, 6),
        queen(1, 3), bishop(7, 5), knight(1, 4),
        pawn(6, 4), pawn(7, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [X(2, 7), X(6, 7), X(2, 8), X(6, 8)],
        kingPen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
      },
    ),
    // L8 — CURTAIN WALL. 8 walls — side walls plus an inner wall with one door on the f-file.
    // Key pf4; defended by pe5 pg5; shell pd4 ph4; hunters qa4 bc3; marchers pc2 pb2. (walled-court-L8-v2)
    make(
      8,
      [
        pawn(6, 4),
        pawn(5, 5), pawn(7, 5),
        pawn(4, 4), pawn(8, 4),
        queen(1, 4), bishop(3, 3),
        pawn(3, 2), pawn(2, 2),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [X(4, 6), X(8, 6), X(4, 7), X(8, 7), X(4, 8), X(8, 8), X(4, 5), X(8, 5)],
        kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7', 'e6', 'f6', 'g6'],
      },
    ),
    // L9 — THE PRIVY COUNCIL. 4 heavy hunters (queen, queen, bishop, knight) — sightlines, not bodies. Key e4.
    // Key pe4; defended by pd5 pf5; shell pc4 pg4; hunters qg2 qc3 bb4 kb3; marchers ph4 pb2. (royal-guard-L9-v3)
    make(
      9,
      [
        pawn(5, 4),
        pawn(4, 5), pawn(6, 5),
        pawn(3, 4), pawn(7, 4),
        queen(7, 2), queen(3, 3), bishop(2, 4), knight(2, 3),
        pawn(8, 4), pawn(2, 2),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(3, 6), X(7, 6), X(3, 7), X(7, 7), X(3, 8), X(7, 8)],
        kingPen: ['d8', 'e8', 'f8', 'd7', 'e7', 'f7', 'd6', 'e6', 'f6'],
      },
    ),
    // L10 — THE ROYAL GUARD. 5 heavy hunters (queen, queen, bishop, bishop, knight) — sightlines, not bodies. Key c4.
    // Key pc4; defended by pb5 pd5; shell pa4 pe4; hunters qh3 qa3 ba2 bg2 kh5; marchers pf4 pg3. (royal-guard-L10-v3 +marcher, budget 18->16)
    make(
      10,
      [
        pawn(3, 4),
        pawn(2, 5), pawn(4, 5),
        pawn(1, 4), pawn(5, 4),
        queen(8, 3), queen(1, 3), bishop(1, 2), bishop(7, 2), knight(8, 5),
        pawn(6, 4), pawn(7, 3),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: [X(1, 6), X(5, 6), X(1, 7), X(5, 7), X(1, 8), X(5, 8)],
        kingPen: ['b8', 'c8', 'd8', 'b7', 'c7', 'd7', 'b6', 'c6', 'd6'],
      },
    ),
  ],
};

const REVENGE_RUN_CATALOG: ReadonlyArray<RunDef> = [RUN_REVENGE_1, RUN_REVENGE_2, RUN_REVENGE_3, RUN_REVENGE_4, RUN_REVENGE_5, RUN_REVENGE_6, RUN_REVENGE_7, RUN_REVENGE_8, RUN_REVENGE_9];

/** Player-facing Revenge runs (approved|live) — the daily rotation + picker. */
const REVENGE_RUNS: ReadonlyArray<RunDef> = REVENGE_RUN_CATALOG.filter((r) => isPlayerFacing(r.id));

/**
 * Runs reachable ONLY by explicit id (/?run=...) — never listed anywhere:
 * Revenge runs not yet approved (or retired) plus the ability-lab sandbox.
 */
const HIDDEN_RUNS: ReadonlyArray<RunDef> = [...REVENGE_RUN_CATALOG.filter((r) => !isPlayerFacing(r.id)), RUN_ABILITY_LAB];

/**
 * Rookie's Revenge runs — THE game. Daily rotation cycles these only; the
 * classic rank-8 runs below stay playable from the picker / ?run= as
 * "Classic" but are not in the daily pool.
 */
export const REVENGE_RUN_IDS: ReadonlyArray<string> = REVENGE_RUNS.map((r) => r.id);

/**
 * Revenge runs still in playtest (stage `testing` in the registry) —
 * reachable ONLY via `?run=<id>`, never in the daily pool. The nightly
 * harness sweeps these alongside REVENGE_RUN_IDS and writes its verdict
 * back to the registry; `npx tsx scripts/pipeline.ts approve <id>` promotes.
 */
export const REVENGE_CANDIDATE_RUN_IDS: ReadonlyArray<string> = REVENGE_RUN_CATALOG.filter((r) => stageOf(r.id) === 'testing').map((r) => r.id);

export const STC_RUN_IDS = [
  'stc-king',
  'stc-bishop',
  'stc-pawn',
  'stc-knight',
  'stc-queen',
] as const;

export const RUNS: ReadonlyArray<RunDef> = [
  ...REVENGE_RUNS,
  RUN_DAILY,
  RUN_ABILITIES_V2,
  RUN_KNIGHT_ACADEMY,
  RUN_BISHOPS_PATH,
  RUN_SPEED_DEMON,
  RUN_HAZARD_MAZE,
  RUN_BOSS_GAUNTLET,
  RUN_IRON_CURTAIN,
  RUN_CROSSFIRE,
  RUN_HORNETS_NEST,
  RUN_ROYAL_COURT,
  RUN_GAUNTLET,
  RUN_TRIAL,
  RUN_HOURGLASS,
  RUN_BISHOPS_CATHEDRAL,
  RUN_ROYAL_PROCESSION,
  RUN_CAVALRY_CHARGE,
  RUN_PAWN_TSUNAMI,
  RUN_DIAGONAL_WEB,
  RUN_THRONE_ROOM,
  RUN_SURROUNDED,
  RUN_ROYAL_STANDOFF,
  RUN_ENDGAME_ASSAULT,
  RUN_IRON_VEIL,
  RUN_STONE_CITADEL,
  RUN_CROSSROADS,
  RUN_PINCER,
  RUN_STC_KING,
  RUN_STC_BISHOP,
  RUN_STC_PAWN,
  RUN_STC_KNIGHT,
  RUN_STC_QUEEN,
  RUN_SWITCHBACK,
  RUN_X,
  RUN_BRIDGE,
  RUN_PLUS,
];

export const DEFAULT_RUN_ID = RUNS[0].id;

export function getRunById(id: string): RunDef {
  return (
    RUNS.find((r) => r.id === id) ??
    HIDDEN_RUNS.find((r) => r.id === id) ??
    RUNS[0]
  );
}

/** True for any run id that can be loaded (listed OR hidden prototypes). */
export function isKnownRunId(id: string): boolean {
  return RUNS.some((r) => r.id === id) || HIDDEN_RUNS.some((r) => r.id === id);
}

export function getRunIndex(id: string): number {
  const i = RUNS.findIndex((r) => r.id === id);
  return i < 0 ? 0 : i;
}

/**
 * Next run after `id` in the player-facing Rookie's Revenge rotation.
 * The cycle NEVER leaves the Revenge pool — classic rank-8 runs are
 * reachable only via an explicit `?run=` URL, so "Next Run" from a finished
 * run must not land on one. An unknown/classic/hidden id wraps to the first
 * Revenge run. When only one Revenge run is live this returns `id` itself —
 * callers hide the "Next Run" CTA in that case (Replay covers it).
 */
export function getNextRevengeRunId(id: string): string {
  if (REVENGE_RUN_IDS.length === 0) return DEFAULT_RUN_ID;
  const i = REVENGE_RUN_IDS.indexOf(id);
  return REVENGE_RUN_IDS[(i + 1) % REVENGE_RUN_IDS.length];
}
