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
 * The 10 king-catching tools offered in Rookie's Revenge. See
 * docs/revenge-abilities.md for the "why it catches kings" notes.
 */
export const REVENGE_ABILITIES: ReadonlyArray<string> = [
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
];

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

/** Runs reachable ONLY by explicit id (/?run=...) — never listed anywhere. */
const HIDDEN_RUNS: ReadonlyArray<RunDef> = [];

/**
 * Rookie's Revenge runs — THE game. Daily rotation cycles these only; the
 * classic rank-8 runs below stay playable from the picker / ?run= as
 * "Classic" but are not in the daily pool.
 */
export const REVENGE_RUN_IDS: ReadonlyArray<string> = ['revenge-1'];

export const STC_RUN_IDS = [
  'stc-king',
  'stc-bishop',
  'stc-pawn',
  'stc-knight',
  'stc-queen',
] as const;

export const RUNS: ReadonlyArray<RunDef> = [
  RUN_REVENGE_1,
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

export function getNextRunId(id: string): string {
  const i = getRunIndex(id);
  return RUNS[(i + 1) % RUNS.length].id;
}
