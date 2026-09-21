'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { RunBoard } from '@/components/run/Board';
import { ALLY_TICK_MS, ENEMY_TICK_MS, PIECE_SLIDE_MS } from '@/components/run/timing';
import { artFile } from '@/lib/run/ability-art';
import { puzzleToBoardState } from '@/lib/run/seed';
import { applyRookieMove, stepEnemyTurn } from '@/lib/run/engine';
import { stepAllyTurnReactive } from '@/lib/run/pawn-ai';
import { isLegalRookieMove } from '@/lib/run/movement';
import {
  ABILITY_DEFS,
  abilityLegalMoves,
  applyAbilityActivate,
  applyAbilityMove,
  applyAbilityTargeted,
  applyControlledAllyMove,
  canMoveAllyAt,
  controlledAllyAt,
  convertTargets as computeConvertTargets,
  magnetTargets as computeMagnetTargets,
  coupTargets,
  sacrificeBlastPreview,
  maxUsesForTier,
  type AbilityId,
  type OwnedAbility,
} from '@/lib/run/abilities';
import {
  fromSquare,
  toSquare,
  type BoardState,
  type Coord,
  type EnemyPiece,
  type PieceType,
  type RunPuzzle,
} from '@/lib/run/types';

/**
 * AbilityDemo — a short looping demo of one power, PLAYED BY THE REAL ENGINE.
 *
 * The first version of this file hand-wrote every step as a state mutation,
 * and it lied: a king stepped two squares, squares lit up for no reason, and
 * an ability "did" something the game does not do (Tyler, 2026-09-18: "look at
 * these through the eyes of does the app work like this, do the pieces move
 * like this, do the abilities work like this?"). Nothing here mutates the
 * board any more. A demo is a list of TAPS — the same taps a player makes —
 * and every one of them goes through the code the game itself runs:
 *
 *   tap an ability card  -> applyAbilityActivate
 *   tap a target square  -> applyAbilityMove / applyAbilityTargeted
 *   tap Rookie, tap a square -> applyRookieMove
 *   tap a summon, tap a square -> applyControlledAllyMove
 *   the enemy's reply    -> stepEnemyTurn / stepAllyTurnReactive, on the
 *                           game's own ENEMY_TICK_MS / ALLY_TICK_MS cadence
 *
 * Every overlay is derived from the resulting state exactly as app/page.tsx
 * derives it: the target dots are `abilityLegalMoves`, the enemy rings are the
 * real convert/magnet/coup targets, the cast VFX is `state.lastAbilityFx`, the
 * deaths are `state.lastPoisonDeath`, the bounces are the engine's own
 * `lastAegisIntercept` / `lastImperviousBounce`. So a demo can only ever show
 * what the ability really does; if a scripted tap is illegal the engine
 * refuses it and DEV_ASSERT logs it loudly instead of faking the result.
 *
 * Abilities without a script fall back to the card's static square art.
 * NOTHING here changes an ability's rules, numbers or balance.
 */

const DEV = process.env.NODE_ENV !== 'production';

/** One scripted tap. `wait` is the pause BEFORE it, in ms. */
export type Action =
  | { wait: number; card: AbilityId }
  | { wait: number; tap: string }
  | { wait: number; hold: true };

export interface Demo {
  puzzle: RunPuzzle;
  /** Rookie's square (puzzleToBoardState randomizes her starting file). */
  rookie: string;
  /** What she is holding for this demo — the card the demo is about. */
  kit: AbilityId[];
  script: Action[];
  /** Pause on the final position before the loop restarts. */
  hold: number;
}

// ---------------------------------------------------------------------------
// Scenes. Only the STARTING position is authored — nothing moves a piece by
// hand, so no piece can move in a way the game would not allow.
// ---------------------------------------------------------------------------

function enemy(type: PieceType, square: string): EnemyPiece {
  const { file, rank } = fromSquare(square);
  return { type, color: 'black', file, rank };
}

function pawns(...squares: string[]): EnemyPiece[] {
  return squares.map((sq) => enemy('pawn', sq));
}

function scene(
  rookie: string,
  pieces: EnemyPiece[],
  opts: { hazards?: string[]; pen?: string[]; still?: boolean } = {},
): RunPuzzle {
  const hasKing = pieces.some((p) => p.type === 'king');
  return {
    level: 1,
    rookieStart: fromSquare(rookie),
    pieces,
    hazards: (opts.hazards ?? []).map((sq) => ({ ...fromSquare(sq), kind: 'stone' as const })),
    ...(hasKing
      ? {
          winCondition: 'king' as const,
          // 'still' keeps a teaching scene readable; 'flee' shows him running.
          kingBehavior: opts.still ? ('still' as const) : ('flee' as const),
        }
      : {}),
    ...(opts.pen ? { kingPen: opts.pen } : {}),
  };
}

/** Tap a card, pause, tap a square — the two-tap shape most cards have. */
function cast(id: AbilityId, target: string, lead = 1000, gap = 900): Action[] {
  return [
    { wait: lead, card: id },
    { wait: gap, tap: target },
  ];
}

/** Tap Rookie (her real legal moves light up), pause, tap where she goes. */
function walk(rookieSquare: string, target: string, lead = 900, gap = 800): Action[] {
  return [
    { wait: lead, tap: rookieSquare },
    { wait: gap, tap: target },
  ];
}

// ---------------------------------------------------------------------------
// The scripts. One per ability that shows up in the early game (the starter
// kit, the tutorial's offer and the first ladder rungs' kits). Each is three
// beats: the problem sits for a moment, the card is tapped and its real
// targets light up, then the payoff plays out.
// ---------------------------------------------------------------------------

/**
 * The scripts. Exported so the audit harness (scripts/audit-demos.ts) can run
 * every one of them through the engine headlessly and fail on any tap the
 * engine refuses.
 */
export const DEMOS: Partial<Record<AbilityId, Demo>> = {
  // ---- Transforms. At tier 1 each one lasts exactly ONE move
  // (transformDurationForTier) — so each demo shows exactly one. ----
  'knight-hop': {
    // PROBLEM: a pawn wall across rank 4. One hop clears it, and the file
    // behind it is open all the way to him.
    puzzle: scene('c3', [enemy('king', 'd8'), ...pawns('b4', 'c4', 'd4', 'c8', 'e8')], {
      pen: ['c8', 'd8', 'e8'],
      still: true,
    }),
    rookie: 'c3',
    kit: ['knight-hop'],
    script: [{ wait: 1000, card: 'knight-hop' }, ...walk('c3', 'd5', 700, 800), ...walk('d5', 'd8', 1000, 800)],
    hold: 1700,
  },
  'bishop-step': {
    // PROBLEM: boxed in as a rook — pawns on her file AND her rank. One
    // diagonal move is the whole card, and it puts her on his file.
    puzzle: scene('c3', [enemy('king', 'f8'), ...pawns('c4', 'b3', 'd3', 'e8', 'g8')], {
      pen: ['e8', 'f8', 'g8'],
      still: true,
    }),
    rookie: 'c3',
    kit: ['bishop-step'],
    script: [{ wait: 1000, card: 'bishop-step' }, ...walk('c3', 'f6', 700, 800), ...walk('f6', 'f8', 1000, 800)],
    hold: 1700,
  },
  'queen-pulse': {
    // PROBLEM: the king is on the long diagonal — a rook needs two moves and
    // both are blocked. A queen needs the one she has.
    puzzle: scene('c3', [enemy('king', 'g7'), ...pawns('c6', 'g3', 'f7', 'h7')], {
      pen: ['f7', 'g7', 'h7'],
      still: true,
    }),
    rookie: 'c3',
    kit: ['queen-pulse'],
    script: [{ wait: 1000, card: 'queen-pulse' }, ...walk('c3', 'g7', 800, 900)],
    hold: 1900,
  },
  'become-king': {
    // PROBLEM: the knight on f6 covers d5 — the square she has to stand on.
    // As a king she moves ONE square, and for one enemy turn nothing can take
    // her: the knight lunges and bounces off.
    puzzle: scene('d4', [enemy('king', 'd8'), enemy('knight', 'f6'), ...pawns('c8', 'e8')], {
      pen: ['c8', 'd8', 'e8'],
      still: true,
    }),
    rookie: 'd4',
    kit: ['become-king'],
    script: [
      { wait: 1000, card: 'become-king' },
      ...walk('d4', 'd5', 800, 800),
      { wait: 1400, hold: true },
      ...walk('d5', 'd8', 500, 800),
    ],
    hold: 1700,
  },

  // ---- Control: he is still standing there, but his turn is gone. ----
  'freeze-ray': {
    // PROBLEM: the knight on b6 covers a8 — the corner she has to stand on to
    // swing along rank 8. Frozen, it watches her stand there.
    puzzle: scene('a1', [enemy('king', 'h8'), enemy('knight', 'b6'), ...pawns('g7', 'h7')], {
      pen: ['g8', 'h8', 'h7'],
      still: true,
    }),
    rookie: 'a1',
    kit: ['freeze-ray'],
    script: [...cast('freeze-ray', 'b6'), ...walk('a1', 'a8', 1000, 800), { wait: 1400, hold: true }, ...walk('a8', 'h8', 400, 800)],
    hold: 1700,
  },
  'poison-dart': {
    // PROBLEM: a bishop parked on her file, defended by the room behind it.
    // She never touches it: the dart takes its three enemy turns while she
    // waits out of its diagonals, and then the file is hers.
    puzzle: scene('c3', [enemy('king', 'c8'), enemy('bishop', 'c5'), ...pawns('b8', 'd8')], {
      pen: ['b8', 'c8', 'd8'],
      still: true,
    }),
    rookie: 'c3',
    kit: ['poison-dart'],
    script: [
      ...cast('poison-dart', 'c5'),
      ...walk('c3', 'b3', 1000, 700),
      ...walk('b3', 'c3', 800, 700),
      { wait: 1200, hold: true },
      ...walk('c3', 'c8', 300, 800),
    ],
    hold: 1700,
  },
  'rabies-dart': {
    // PROBLEM: two guards. One dart, and the rabid one eats the other.
    puzzle: scene('c3', [enemy('king', 'c8'), enemy('knight', 'd5'), enemy('bishop', 'b6'), ...pawns('b8', 'd8')], {
      pen: ['b8', 'c8', 'd8'],
      still: true,
    }),
    rookie: 'c3',
    kit: ['rabies-dart'],
    script: [...cast('rabies-dart', 'd5'), ...walk('c3', 'c4', 1000, 700), { wait: 1500, hold: true }, ...walk('c4', 'c8', 400, 700)],
    hold: 1800,
  },

  // ---- Tempo: a second turn, and a shield that eats one hit. ----
  surge: {
    // PROBLEM: he is two squares away and he moves every time she does.
    // Surge hands her the second move before he gets his reply.
    puzzle: scene('c5', [enemy('king', 'c7'), ...pawns('b7', 'd7')], { pen: ['b7', 'c7', 'd7', 'c8'] }),
    rookie: 'c5',
    kit: ['surge'],
    script: [{ wait: 1000, card: 'surge' }, ...walk('c5', 'c6', 700, 800), ...walk('c6', 'c7', 700, 800)],
    hold: 1900,
  },
  aegis: {
    // PROBLEM: the knight covers d6. Walking onto it normally ends the run;
    // with the shield up the capture bounces off it instead.
    puzzle: scene('d4', [enemy('king', 'd7'), enemy('knight', 'f5'), ...pawns('c7', 'e7')], {
      pen: ['c7', 'd7', 'e7'],
    }),
    rookie: 'd4',
    kit: ['aegis'],
    script: [
      { wait: 1000, card: 'aegis' },
      ...walk('d4', 'd6', 800, 800),
      { wait: 1500, hold: true },
      ...walk('d6', 'd7', 400, 800),
    ],
    hold: 1700,
  },

  // ---- Terrain: stone that nothing gets past. ----
  boulder: {
    // Tyler's position: seal his escape squares and leave him one door — d7,
    // which is HER file. Boulder is 2 stones a level at tier 1, so the two
    // stones go on c8 and e8 and his own guards hold c7 and e7.
    puzzle: scene('h4', [enemy('king', 'd8'), ...pawns('c7', 'e7')], {
      pen: ['c8', 'd8', 'e8', 'c7', 'd7', 'e7'],
    }),
    rookie: 'h4',
    kit: ['boulder'],
    script: [
      ...cast('boulder', 'c8'),
      ...cast('boulder', 'e8', 900, 800),
      ...walk('h4', 'd4', 1000, 800),
      { wait: 1500, hold: true },
      ...walk('d4', 'd8', 400, 800),
    ],
    hold: 1900,
  },
  shove: {
    // PROBLEM: the only way onto his file is d6 — the rest of it is walled —
    // and a block of stone is standing on exactly that square. Shove doesn't
    // add stone like Boulder does; it MOVES the stone that is in your way.
    puzzle: scene('c6', [enemy('king', 'd8'), ...pawns('c8', 'e8', 'f6')], {
      hazards: ['d6', 'd5', 'd4', 'd3'],
      pen: ['c8', 'd8', 'e8'],
      still: true,
    }),
    rookie: 'c6',
    kit: ['shove'],
    script: [...cast('shove', 'd6'), ...walk('c6', 'd6', 1000, 800), ...walk('d6', 'd8', 900, 800)],
    hold: 1900,
  },

  // ---- Pull, vanish, undo. ----
  magnet: {
    // PROBLEM: the guard sits four squares up her file, out of reach. Magnet
    // is two taps in the game: grab him, then pick how far he comes — and at
    // tier 1 that is two squares, no further.
    puzzle: scene('c3', [enemy('king', 'c8'), enemy('knight', 'c7'), ...pawns('b8', 'd8')], {
      pen: ['b8', 'c8', 'd8'],
      still: true,
    }),
    rookie: 'c3',
    kit: ['magnet'],
    script: [
      { wait: 1000, card: 'magnet' },
      { wait: 900, tap: 'c7' },
      { wait: 900, tap: 'c5' },
      ...walk('c3', 'c5', 1000, 800),
      ...walk('c5', 'c8', 900, 800),
    ],
    hold: 1700,
  },
  smoke: {
    // Tyler's position: e4 is covered by the knight on d6 — she walks onto it
    // anyway, because under Stealth he cannot see her.
    puzzle: scene('b4', [enemy('king', 'e8'), enemy('knight', 'd6'), ...pawns('d8', 'f8')], {
      pen: ['d8', 'e8', 'f8'],
      still: true,
    }),
    rookie: 'b4',
    kit: ['smoke'],
    script: [{ wait: 1100, card: 'smoke' }, ...walk('b4', 'e4', 800, 800), { wait: 1500, hold: true }, ...walk('e4', 'e8', 400, 800)],
    hold: 1900,
  },
  rewind: {
    // Tyler's position: she swings h4 -> c4 onto the king's file with their
    // knight watching from e6. Their reply is the king bolting off the file
    // to d7 — and Rewind deletes it, putting him back on c8 where she can
    // take him. (His version had the knight answering e6 -> c7; the engine's
    // knight holds its post in this position, so the reply that gets undone
    // is the king's escape.)
    puzzle: scene('h4', [enemy('king', 'c8'), enemy('knight', 'e6')], { pen: ['b8', 'c8', 'd8', 'd7', 'c7'] }),
    rookie: 'h4',
    kit: ['rewind'],
    script: [
      ...walk('h4', 'c4', 900, 800),
      { wait: 1400, card: 'rewind' },
      { wait: 1400, hold: true },
      ...walk('c4', 'c8', 400, 800),
    ],
    hold: 1900,
  },

  // ---- Bodies: stolen, summoned, steered. ----
  convert: {
    // PROBLEM: his own pawn guards the door. At tier 1 Convert steals a PAWN
    // — and a pawn takes diagonally, which is exactly where he is standing.
    puzzle: scene('c3', [enemy('king', 'd8'), ...pawns('c7', 'e7')], {
      pen: ['c8', 'd8', 'e8'],
      still: true,
    }),
    rookie: 'c3',
    kit: ['convert'],
    script: [
      ...cast('convert', 'c7'),
      ...walk('c3', 'c4', 1100, 700),
      { wait: 1000, tap: 'c7' },
      { wait: 800, tap: 'd8' },
    ],
    hold: 1800,
  },
  bodyguard: {
    // Tyler's position: Rookie on f4 with their pawns on f5 and g4, and a
    // rook of her own summoned onto g5 to fight from.
    puzzle: scene('f4', [enemy('king', 'h8'), ...pawns('f5', 'g4', 'g7', 'h7')], {
      pen: ['g8', 'h8', 'h7'],
      still: true,
    }),
    rookie: 'f4',
    kit: ['bodyguard'],
    script: [
      { wait: 1000, card: 'bodyguard' },
      { wait: 1200, hold: true },
      ...walk('f4', 'f2', 600, 800),
      { wait: 1400, hold: true },
      ...walk('f2', 'f4', 600, 800),
      { wait: 1400, hold: true },
    ],
    hold: 1900,
  },

  // ---- The summon family: the real spawn squares, the body, then its move. ----
  'summon-knight': {
    puzzle: scene('d4', [enemy('king', 'g6'), ...pawns('d6', 'f4', 'f7', 'g7', 'h7')], {
      pen: ['f6', 'g6', 'h6'],
      still: true,
    }),
    rookie: 'd4',
    kit: ['summon-knight'],
    script: [...cast('summon-knight', 'e5'), { wait: 900, tap: 'e5' }, { wait: 800, tap: 'g6' }],
    hold: 1900,
  },
  'bishop-squire': {
    puzzle: scene('d4', [enemy('king', 'g7'), ...pawns('d6', 'f4', 'f8', 'h8')], {
      pen: ['f7', 'g7', 'h7'],
      still: true,
    }),
    rookie: 'd4',
    kit: ['bishop-squire'],
    script: [...cast('bishop-squire', 'e5'), { wait: 900, tap: 'e5' }, { wait: 800, tap: 'g7' }],
    hold: 1900,
  },
  twin: {
    // Tyler's note: the twin SPENDING ITSELF is the card. The pawn on d6 is
    // defended by the pawn on c7, so she can't take it herself — the twin
    // takes it and dies to the recapture, and that trade is what pulls the
    // defender onto d6 where she CAN take it. Then the road is hers.
    puzzle: scene('d4', [enemy('king', 'd8'), ...pawns('d6', 'c7', 'c8', 'e8')], {
      pen: ['c8', 'd8', 'e8'],
      still: true,
    }),
    rookie: 'd4',
    kit: ['twin'],
    script: [
      ...cast('twin', 'd5', 900, 800),
      { wait: 800, tap: 'd5' },
      { wait: 700, tap: 'd6' },
      { wait: 1400, hold: true },
      ...walk('d4', 'd6', 400, 700),
      { wait: 1100, hold: true },
      ...walk('d6', 'd8', 300, 700),
    ],
    hold: 1900,
  },
  duchess: {
    puzzle: scene('d4', [enemy('king', 'g7'), ...pawns('d6', 'e4', 'f8', 'h8')], {
      pen: ['f7', 'g7', 'h7'],
      still: true,
    }),
    rookie: 'd4',
    kit: ['duchess'],
    script: [...cast('duchess', 'e5'), { wait: 900, tap: 'e5' }, { wait: 800, tap: 'g7' }],
    hold: 1900,
  },
  page: {
    // A pawn is still a body — and a pawn takes diagonally.
    puzzle: scene('d4', [enemy('king', 'f6'), ...pawns('d6', 'e4', 'e7', 'g7')], {
      pen: ['e6', 'f6', 'g6'],
      still: true,
    }),
    rookie: 'd4',
    kit: ['page'],
    script: [...cast('page', 'e5'), { wait: 900, tap: 'e5' }, { wait: 800, tap: 'f6' }],
    hold: 1900,
  },
  vanguard: {
    // Vanguard is the same rainbow knight — dropped up to two squares away,
    // which is the whole card: it starts behind their line, not beside you.
    puzzle: scene('d4', [enemy('king', 'g6'), ...pawns('d6', 'e5', 'f7', 'g7', 'h7')], {
      pen: ['f6', 'g6', 'h6'],
      still: true,
    }),
    rookie: 'd4',
    kit: ['vanguard'],
    script: [...cast('vanguard', 'f4'), { wait: 900, tap: 'f4' }, { wait: 800, tap: 'g6' }],
    hold: 1900,
  },

  swap: {
    // Her knight sneaks into his room and still can't touch him; she is four
    // squares away. Swap trades their places and she finishes it herself.
    puzzle: scene('d4', [enemy('king', 'g7'), ...pawns('f7', 'h7', 'h8')], {
      pen: ['f7', 'g7', 'h7'],
      still: true,
    }),
    rookie: 'd4',
    kit: ['summon-knight', 'swap'],
    script: [
      ...cast('summon-knight', 'e5', 900, 800),
      { wait: 800, tap: 'e5' },
      { wait: 800, tap: 'f7' },
      { wait: 1100, card: 'swap' },
      { wait: 800, tap: 'f7' },
      ...walk('f7', 'g7', 900, 800),
    ],
    hold: 1900,
  },
  decoy: {
    // Tyler's position: the knight on d7 is the ONLY thing between her and
    // the king on d8. Mark the pawn beside it and the knight leaves d7 to take
    // it — that vacancy is the whole card. (His bait square was c6; a knight
    // on d7 cannot reach c6, so the bait sits on c5, which it can.)
    puzzle: scene('d4', [enemy('king', 'd8'), enemy('knight', 'd7'), ...pawns('c5', 'e8')], {
      pen: ['c8', 'd8', 'e8'],
      still: true,
    }),
    rookie: 'd4',
    kit: ['decoy'],
    script: [
      ...cast('decoy', 'c5'),
      ...walk('d4', 'd6', 900, 800),
      { wait: 1500, hold: true },
      ...walk('d6', 'd8', 400, 800),
    ],
    hold: 1900,
  },

  // ---- The level-first cards and the rest of the late game. ----
  mirror: {
    // PROBLEM: he is on the f-file and she is on the c-file, with a guard
    // between them on rank 8. The reflection appears on f3 (her square,
    // flipped across the middle) and copies her move: she runs up the c-file,
    // it runs up the f-file — and it is the echo that takes him.
    puzzle: scene('c3', [enemy('king', 'f8'), ...pawns('e8', 'g8', 'g7')], {
      pen: ['e8', 'f8', 'g8'],
      still: true,
    }),
    rookie: 'c3',
    kit: ['mirror'],
    script: [...cast('mirror', 'f3'), ...walk('c3', 'c8', 1100, 1100)],
    hold: 1900,
  },
  sacrifice: {
    // PROBLEM: three guards wall off his file. Her knight goes in beside
    // them — then blows up in its own move shape, taking every guard on a
    // knight square, and the file is open.
    puzzle: scene('d4', [enemy('king', 'd8'), enemy('bishop', 'd7'), enemy('knight', 'g6'), ...pawns('c6', 'c8', 'e8')], {
      pen: ['c8', 'd8', 'e8'],
      still: true,
    }),
    rookie: 'd4',
    kit: ['summon-knight', 'sacrifice'],
    script: [...cast('summon-knight', 'e5', 900, 800), ...cast('sacrifice', 'e5', 1000, 1000), ...walk('d4', 'd8', 1200, 800)],
    hold: 1900,
  },
  dragon: {
    // PROBLEM: he is walled in on every line a queen could use. The dragon
    // lands beside her and takes him with the one move a queen does not have:
    // the knight's jump.
    puzzle: scene('d4', [enemy('king', 'f7'), ...pawns('d6', 'e6', 'e7', 'g6', 'f6')], {
      pen: ['e8', 'f8', 'g8', 'f7', 'g7'],
      still: true,
    }),
    rookie: 'd4',
    kit: ['dragon'],
    script: [...cast('dragon', 'e5'), { wait: 900, tap: 'e5' }, { wait: 800, tap: 'f7' }],
    hold: 1900,
  },
  ricochet: {
    // PROBLEM: he is on neither of her lines. Armed, her next rook slide
    // banks off the stone: up the b-file, a 90-degree turn at the block,
    // and along rank 6 onto him.
    puzzle: scene('b2', [enemy('king', 'f6'), ...pawns('e7', 'f7', 'g7')], {
      hazards: ['b7'],
      pen: ['e6', 'f6', 'g6'],
      still: true,
    }),
    rookie: 'b2',
    kit: ['ricochet'],
    script: [{ wait: 1000, card: 'ricochet' }, ...walk('b2', 'f6', 800, 1000)],
    hold: 1900,
  },
  hourglass: {
    // PROBLEM: his own pawn stands between them on rank 6. Turn the glass and
    // they play a turn NOW, with her move still in hand — the pawn marches
    // off her line, he has nowhere to run, and she takes him.
    puzzle: scene('a6', [enemy('king', 'h6'), ...pawns('e6')], {
      hazards: ['g7', 'h7', 'g5', 'h5'],
    }),
    rookie: 'a6',
    kit: ['hourglass'],
    script: [{ wait: 1000, card: 'hourglass' }, { wait: 1600, hold: true }, ...walk('a6', 'h6', 400, 800)],
    hold: 1900,
  },
};

/** True when this ability has a scripted demo (vs. the static-art fallback). */
export function hasAbilityDemo(id: AbilityId): boolean {
  return DEMOS[id] !== undefined;
}

/** Every ability id with a real demo script — handy for test pages. */
export const DEMO_ABILITY_IDS = Object.keys(DEMOS) as AbilityId[];

export function AbilityDemo({ id, paused = false }: { id: AbilityId; paused?: boolean }) {
  const demo = DEMOS[id];

  if (!demo) {
    // No script — the card's own square art, never a blank box.
    return (
      <div className="relative w-full aspect-square overflow-hidden rounded-[10px] bg-[#1a2b33]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/abilities/${artFile(id)}`} alt="" draggable={false} className="block w-full h-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: 'inset 0 0 0 1.5px rgba(184,133,43,0.65)' }}
        />
      </div>
    );
  }

  return <ScriptedDemo demo={demo} paused={paused} demoId={id} />;
}

// ---------------------------------------------------------------------------
// The player. A tap here does exactly what a tap in app/page.tsx does.
// ---------------------------------------------------------------------------

export function owned(ids: AbilityId[]): OwnedAbility[] {
  return ids.map((id) => ({
    id,
    tier: 1 as const,
    mutations: [],
    usesLeftThisLevel: maxUsesForTier(id, 1),
  }));
}

/**
 * Port of the live square-tap handler (app/page.tsx `onSquareClick`). Kept in
 * the same order as the original: cancel, ability move, ability target, select
 * Rookie, select a summon, move a summon, move Rookie.
 */
export function tapSquare(
  state: BoardState,
  square: string,
  selected: string | null,
): { state: BoardState; selected: string | null } {
  const coord = fromSquare(square);
  if (state.activeAbility) {
    if (square === toSquare(state.rookie)) return { state, selected };
    const def = ABILITY_DEFS[state.activeAbility.id];
    const next =
      def.activation === 'movement'
        ? applyAbilityMove(state, state.activeAbility.id, coord)
        : applyAbilityTargeted(state, state.activeAbility.id, coord);
    return { state: next, selected: null };
  }
  if (square === toSquare(state.rookie)) {
    return { state, selected: selected === square ? null : square };
  }
  const tappedAlly = controlledAllyAt(state, coord);
  if (tappedAlly && canMoveAllyAt(state, tappedAlly)) {
    return { state, selected: selected === square ? null : square };
  }
  if (selected) {
    const selectedAlly = controlledAllyAt(state, fromSquare(selected));
    if (selectedAlly) {
      return { state: applyControlledAllyMove(state, fromSquare(selected), coord), selected: null };
    }
  }
  return { state: applyRookieMove(state, coord), selected: null };
}

function ScriptedDemo({ demo, paused, demoId }: { demo: Demo; paused: boolean; demoId: AbilityId }) {
  const base = useMemo(() => {
    const s = puzzleToBoardState(demo.puzzle);
    return { ...s, rookie: fromSquare(demo.rookie), abilities: owned(demo.kit) };
  }, [demo]);

  const [state, setState] = useState<BoardState>(base);
  const [selected, setSelected] = useState<string | null>(null);
  // The board's own slide time. It MUST stay under the turn ticks — timing.ts:
  // "Keep PIECE_SLIDE_MS < each tick so a piece lands before the next one
  // starts moving". This was 380ms against a 420ms enemy tick, which left
  // 40ms of headroom and yanked pieces mid-flight. 0 for one frame on the
  // loop reset, so the scene snaps home instead of sliding everything back.
  const [slide, setSlide] = useState(0);
  const stateRef = useRef(state);
  stateRef.current = state;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  // The enemy and ally phases run themselves, on the game's own cadence —
  // exactly as app/page.tsx ticks them.
  useEffect(() => {
    if (paused) return;
    if (state.turn !== 'enemy' || state.status !== 'playing') return;
    const t = window.setTimeout(() => {
      setState((s) => (s.turn === 'enemy' && s.status === 'playing' ? stepEnemyTurn(s) : s));
    }, ENEMY_TICK_MS);
    return () => clearTimeout(t);
  }, [state, paused]);

  useEffect(() => {
    if (paused) return;
    if (state.turn !== 'allies' || state.status !== 'playing') return;
    const t = window.setTimeout(() => {
      setState((s) => (s.turn === 'allies' && s.status === 'playing' ? stepAllyTurnReactive(s) : s));
    }, ALLY_TICK_MS);
    return () => clearTimeout(t);
  }, [state.turn, state.status, state.allyTurnIndex, paused]);

  // The script: perform each tap in turn, waiting for Rookie's turn first —
  // a player can't tap during the enemy phase either.
  useEffect(() => {
    if (paused) return;
    let cancelled = false;
    const timers: number[] = [];
    const sleep = (ms: number) =>
      new Promise<void>((res) => {
        timers.push(window.setTimeout(res, ms));
      });
    const waitForRookie = async () => {
      for (let i = 0; i < 40 && !cancelled; i++) {
        const s = stateRef.current;
        if (s.turn === 'rookie' || s.status !== 'playing') return;
        await sleep(120);
      }
    };

    const run = async () => {
      while (!cancelled) {
        setSlide(0);
        setState(base);
        setSelected(null);
        await sleep(90);
        if (cancelled) return;
        setSlide(PIECE_SLIDE_MS);

        for (const action of demo.script) {
          if (cancelled) return;
          await sleep(action.wait);
          if (cancelled) return;
          if ('hold' in action) continue;
          await waitForRookie();
          if (cancelled) return;
          const before = stateRef.current;
          // The king is taken: the level is won and the rest of the script is
          // moot. Stop here so the WON frame — the empty square she is
          // standing on — gets the whole hold instead of a run of refused
          // taps (Tyler, 2026-09-18: the payoff is the point of the demo).
          if (before.status !== 'playing') break;
          if ('card' in action) {
            const next = applyAbilityActivate(before, action.card);
            assertChanged(demoId, next !== before, `card ${action.card} did nothing`);
            setState(next);
            setSelected(null);
          } else {
            assertLegalTap(demoId, before, action.tap, selectedRef.current);
            const res = tapSquare(before, action.tap, selectedRef.current);
            assertChanged(
              demoId,
              res.state !== before || res.selected !== selectedRef.current,
              `tap ${action.tap} did nothing`,
            );
            setState(res.state);
            setSelected(res.selected);
          }
        }
        if (cancelled) return;
        // Hold on the payoff before looping — longer when she took the king,
        // because that frame is the whole reason the card is good.
        await sleep(stateRef.current.status === 'won' ? demo.hold + 600 : demo.hold);
      }
    };
    void run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [base, demo, demoId, paused]);

  // Every overlay below is DERIVED from the state, the same way app/page.tsx
  // derives it. Nothing is set by the script.
  const legalAbilityMoves = useMemo(() => {
    if (!state.activeAbility || state.activeAbility.step !== 'pick-square') return undefined;
    return abilityLegalMoves(state, state.activeAbility.id);
  }, [state]);

  const abilityTier = useMemo(
    () => (state.activeAbility ? state.abilities.find((a) => a.id === state.activeAbility!.id)?.tier : undefined),
    [state],
  );

  const convertTargets = useMemo(() => {
    if (state.activeAbility?.id === 'convert') return computeConvertTargets(state);
    if (state.activeAbility?.id === 'magnet' && state.activeAbility.step === 'pick-enemy')
      return computeMagnetTargets(state);
    if (state.activeAbility?.id === 'coup') return coupTargets(state);
    return undefined;
  }, [state]);

  // Sacrifice armed: each summon's piece-shaped blast, tinted — the same
  // preview app/page.tsx passes the board.
  const blastPreview = useMemo(() => {
    if (state.activeAbility?.id !== 'sacrifice' || state.activeAbility.step !== 'pick-square') return undefined;
    return sacrificeBlastPreview(state);
  }, [state]);
  const sacrificeFx = useSacrificeFx(state);

  const abilityFx = useTransient(state.lastAbilityFx, 900);
  const poisonDeathFx = useTransient(state.lastPoisonDeath, 1400);
  const aegisFx = useTransient(state.lastAegisIntercept, 800);
  const imperviousFx = useTransient(state.lastImperviousBounce, 800);
  const enemyCaptureFx = useTransient(state.lastEnemyCaptureFx, 700);

  return (
    <div className="relative w-full">
      <RunBoard
        state={state}
        selectedSquare={selected}
        abilityFx={abilityFx}
        aegisFx={aegisFx}
        imperviousFx={imperviousFx}
        poisonDeathFx={poisonDeathFx}
        enemyCaptureFx={enemyCaptureFx}
        legalAbilityMoves={legalAbilityMoves}
        abilityTier={abilityTier}
        convertTargets={convertTargets}
        blastPreview={blastPreview}
        sacrificeFx={sacrificeFx}
        hideGoalRank
        skipIntro
        onSquareClick={() => {}}
        onPieceDrop={() => false}
        slideMs={slide}
      />
      {/* The demo is a picture, not a control — nothing here is tappable. */}
      <div aria-hidden className="absolute inset-0 z-40" style={{ pointerEvents: 'auto' }} />
    </div>
  );
}

/**
 * Hold the engine's transient signal (`lastAbilityFx`, `lastPoisonDeath`, …)
 * for its animation, then drop it — the same id-tracking app/page.tsx does.
 */
function useTransient<T extends { id: number }>(sig: T | undefined, ms: number): T | null {
  const [fx, setFx] = useState<T | null>(null);
  const lastId = useRef<number | null>(null);
  useEffect(() => {
    if (!sig || lastId.current === sig.id) return;
    lastId.current = sig.id;
    setFx(sig);
  }, [sig]);
  useEffect(() => {
    if (!fx) return;
    const t = window.setTimeout(() => setFx(null), ms);
    return () => clearTimeout(t);
  }, [fx, ms]);
  return fx;
}

/**
 * The Sacrifice detonation burst, found by diffing consecutive states exactly
 * as app/page.tsx does (a Sacrifice charge spent + a summon gone the same
 * step): the summon's square and every enemy square that emptied.
 */
function useSacrificeFx(state: BoardState): { summonSq: string; capturedSqs: string[]; id: number } | null {
  const [fx, setFx] = useState<{ summonSq: string; capturedSqs: string[]; id: number } | null>(null);
  const prevRef = useRef<BoardState | null>(null);
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = state;
    if (!prev) return;
    const prevUses = prev.abilities.find((a) => a.id === 'sacrifice')?.usesLeftThisLevel;
    const nextUses = state.abilities.find((a) => a.id === 'sacrifice')?.usesLeftThisLevel;
    if (prevUses == null || nextUses == null || nextUses >= prevUses) return;
    const gone = prev.allies.find((a) => !state.allies.some((b) => b.id === a.id));
    if (!gone) return;
    const capturedSqs = prev.pieces
      .filter((p) => !state.pieces.some((q) => q.file === p.file && q.rank === p.rank && q.type === p.type))
      .map((p) => toSquare({ file: p.file, rank: p.rank }));
    setFx({ summonSq: toSquare({ file: gone.file, rank: gone.rank }), capturedSqs, id: Date.now() });
  }, [state]);
  useEffect(() => {
    if (!fx) return;
    const t = window.setTimeout(() => setFx(null), 700);
    return () => clearTimeout(t);
  }, [fx]);
  return fx;
}

// ---------------------------------------------------------------------------
// Dev assertions. A scripted tap the engine refuses changes nothing — without
// these it would just look like a beat that never happened.
// ---------------------------------------------------------------------------

function assertChanged(id: AbilityId, ok: boolean, what: string) {
  if (DEV && !ok) console.error(`[AbilityDemo:${id}] ${what} — the engine refused this step.`);
}

/** A tap that is meant to move Rookie must be a move the engine allows. */
function assertLegalTap(id: AbilityId, state: BoardState, square: string, selected: string | null) {
  if (!DEV) return;
  if (state.activeAbility) return; // the ability's own targeting rules judge it
  const coord: Coord = fromSquare(square);
  if (square === toSquare(state.rookie)) return; // selecting her
  if (controlledAllyAt(state, coord)) return; // selecting a summon
  if (selected && controlledAllyAt(state, fromSquare(selected))) return; // summon move
  if (!isLegalRookieMove(state, coord)) {
    console.error(
      `[AbilityDemo:${id}] tap ${square} is NOT a legal Rookie move from ${toSquare(state.rookie)} (form ${state.form}).`,
    );
  }
}
