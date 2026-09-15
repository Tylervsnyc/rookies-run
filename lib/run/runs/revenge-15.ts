/**
 * revenge-15 — THE STACKS. Pair MAGNET + BOULDER. Kit = magnet / boulder / aegis
 * (3 cards, 2026-09-15; Decoy dropped).
 *
 * SIGNATURE: ranks 3-7 are solid stone except one-square-wide SHAFTS. Ranks 1-2
 * are the floor, rank 8 the gallery, and a shaft is the only way between them.
 * One piece in a shaft closes the route. His room is cut into the stone.
 *
 * ── 2026-09-15 REBUILD for the new king (he always swings when Rookie ends
 *    next to him; a capture stuns him one turn; with Aegis up he freezes) ──
 * Tyler played it today and lost L8: L1 killed him on arrival (the shaft top
 * was next to the king), he never saw what Boulder was for so never held the
 * pair, and he won L5-L7 by standing next to the king with Aegis up. Bot: the
 * pair read 0/0/0/0 on the finale; magnet+boulder+aegis cleared it.
 *
 * Rules the whole run now teaches, one per level:
 *  - Never finish a move next to him (unless he is stunned or you are shielded).
 *  - Arrive by sliding 2+ squares onto him, or take something next to him first.
 *  - A king in an ALCOVE is off every line; a STONE in the alcove keeps him on it.
 *
 * KEY / TRAP by level (T1, solver + bot):
 *  L1 anything     L2 anything (boulder = the clean line)
 *  L3 magnet|aegis L4 boulder|aegis   L5 boulder|aegis
 *  L6 magnet|aegis L7-L10 magnet + boulder (aegis T1 has one use; every finale
 *  has two locks, a plug and a room, so aegis alone opens one of them).
 *
 * FINALE, four different questions:
 *  L7  PULL, THEN SEAL — pull the plug, stone BOTH alcoves while he sits on the
 *      gallery line, slide in.         magnet@far > boulder@pen | slide
 *  L8  CUT THE WATCHER — a pocket bishop guards the pawn over his alcove; the
 *      stone goes on the bishop's diagonal, not in his room; take the pawn
 *      (stun), step down onto him.     boulder@adj > magnet@far | step
 *  L9  COME DOWN ON HIM — he lives in a sealed stub of shaft h, reachable only
 *      from the gallery above; the plug is on HIS rank. Stone his side alcove
 *      BEFORE you arrive (once he is in it the square is gone), drop onto h8,
 *      slide down into him.            magnet@line > boulder@pen | slide
 *  L10 LAND IT, THEN WALL IT — choose the pull distance (the far square is
 *      watched), climb, THEN stone the square you just came through to cut the
 *      watcher off the gate pawn, take it (stun), slide in. Hardest.
 *                                      magnet@far > boulder@far | slide
 *
 * MEASURED 2026-09-15 (local, T5 bot, Normal, T1 cards, 8 trials/cell on a
 * machine shared by 10 agents; direction only — the GitHub rung-3 grade at 16
 * trials + arrival tiers is the number of record):
 *    L    none  magnet boulder  aegis | pair  kit(+aegis)
 *    1    100    100    100    100 |
 *    2    100    100    100    100 |
 *    3      0    100      0      0 |          (solver: aegis W5 too)
 *    4      0      0     50    100 |
 *    5      0      0    100    100 |          (solver: magnet W6, bot 0/6)
 *  Finale at 16 trials (real run file):
 *    L    none  magnet boulder  aegis | pair  kit(+aegis)   clock
 *    7      0      0      0      0 |   88    100          9
 *    8      0      0      0      0 |   94    100         10  (100 at 11)
 *    9      0      0      0      0 |   81     88          8
 *   10      0      6      0      6 |   13     ~38          9  (0 at 8; bot rarely finds
 *                                                           "stone behind you")
 * Solver (no-boulder loadouts): none/magnet/aegis no forced win at depth 7 on
 * L7-L10. The pair's losses are move-limit losses (bot hunting stone squares).
 * Every pair line above was replayed by hand and wins.
 *
 * HARNESS NOTE: `solve` cannot be trusted for Boulder. stateKey()
 * (scripts/run-playtest/revenge-core.ts) omits hazards, so two different stone
 * placements with the same uses left share a memo entry and the first (wrong)
 * one poisons the right one. L4 boulder reads no-forced-win while g7+h7 then a
 * slide wins by replay.
 */

import {
  make,
  pawn,
  knight,
  bishop,
  king,
  X,
  FLEE,
  STILL,
  type RunDef,
} from '../run-kit';
import type { Coord } from '../types';

/** The finishers — mirrors REVENGE_CORE in runs.ts (kept local: importing it would cycle). */
const REVENGE_CORE_IDS: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

/** Hollow squares cut out of the stone (alcoves, pockets). */
const carve = (stone: Coord[], ...squares: Coord[]): Coord[] =>
  stone.filter((h) => !squares.some((s) => s.file === h.file && s.rank === h.rank));

const STONE_RANKS = [3, 4, 5, 6, 7] as const;

/**
 * The stone block: ranks 3-7 solid on every file EXCEPT the listed SHAFTS,
 * which are cut open top to bottom.
 */
const STACKS = (...shafts: number[]): Coord[] => {
  const out: Coord[] = [];
  for (let file = 1; file <= 8; file++) {
    if (shafts.includes(file)) continue;
    for (const rank of STONE_RANKS) out.push(X(file, rank));
  }
  return out;
};

export const RUN_REVENGE_15: RunDef = {
  id: 'revenge-15',
  signaturePair: ['magnet', 'boulder'],
  name: 'The Stacks',
  blurb: 'A wall with slots cut in it. He thinks a plug is a wall.',
  allowedAbilities: ['magnet', 'boulder', 'aegis'],
  // Boulder T4/T5 make this run unwinnable (0% on every finale level, measured
  // 2026-09-08) — she walls her own one-wide shaft and cannot afford to undo it.
  // Correctness cap only; see the tier sweep in the header.
  abilityTierCaps: { boulder: 3 },
  // PER-RUN DIFFICULTY OVERRIDE (2026-09-07). Hard's global `+1 enemy per turn`
  // makes THIS run EASIER, measured twice: no-retry 27% Normal vs 30% Hard, real-retry 37% vs 47%. The cause is the
  // documented one (.claude/run-level-design.md, "Pawn walls march") — the
  // enemy phase is what drains a narrow corridor open, so an extra enemy move
  // per turn is a GIFT on a stone/wall run. Hard keeps its tighter clock
  // (moveLimitDelta -2) and its fleeing king; only the enemy-count delta is
  // pinned to 0.
  difficultyOverrides: { hard: { enemiesPerTurnDelta: 0 } },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_IDS,
  offerCoreMin: 2,
  levels: [
    // L1 two shafts: b open, f plugged (bishop f7, pawn g8). Still king d8, two squares
    // from both shaft tops. Any card (or none) wins; magnet opens the near shaft.
    make(1, [bishop(6, 7), pawn(7, 8), king(4, 8)], {
      ...STILL, moveLimit: 8, hazards: STACKS(2, 6),
    }),
    // L2 first flee king in a 2x2 corner (alcoves g7/h7). Pawn f8 is free food:
    // take it and he is stunned beside you. Or stone g7+h7 and slide.
    make(2, [pawn(6, 8), pawn(1, 8), king(7, 8)], {
      ...FLEE, moveLimit: 8, hazards: carve(STACKS(3), X(7, 7), X(8, 7)),
      kingPen: ['g7', 'h7', 'g8', 'h8'],
    }),
    // L3 plug e7 held by d8+f8; king b8 on the gallery line. MAGNET (aegis tanks).
    make(3, [bishop(5, 7), pawn(4, 8), pawn(6, 8), king(2, 8)], {
      ...FLEE, moveLimit: 10, hazards: STACKS(5), kingPen: ['a8', 'b8', 'c8'],
    }),
    // L4 open shaft c, king h8 in the 2x2 corner, nothing to eat near him. BOULDER
    // (stone g7+h7, then slide) or AEGIS (stand beside him).
    make(4, [pawn(1, 8), pawn(2, 8), king(8, 8)], {
      ...FLEE, moveLimit: 10, hazards: carve(STACKS(3), X(7, 7), X(8, 7)),
      kingPen: ['g7', 'h7', 'g8', 'h8'],
    }),
    // L5 king hides in the h7 alcove under pawn h8; a pocket bishop f6 guards h8 via g7.
    // BOULDER on g7 cuts the guard: take h8 (stun), step onto him. AEGIS tanks the bishop.
    make(5, [pawn(8, 8), bishop(6, 6), pawn(1, 8), pawn(2, 8), king(8, 7)], {
      ...FLEE, moveLimit: 8, hazards: carve(STACKS(4), X(8, 7), X(6, 6), X(7, 7)),
      kingPen: ['g8', 'h8', 'h7'],
    }),
    // L6 plug e6 held by knight d8 (its only jump). MAGNET drags it below the jump,
    // AEGIS tanks. King g8 on a one-rank gallery room.
    make(6, [bishop(5, 6), knight(4, 8), pawn(1, 8), pawn(2, 8), king(7, 8)], {
      ...FLEE, moveLimit: 8, hazards: STACKS(5), kingPen: ['f8', 'g8', 'h8'],
    }),
    // L7 PULL, THEN SEAL. Plug d7 held by c8. King g8 on the gallery line; stone g7+h7
    // while he sits there, pull the plug, climb, slide in.
    make(7, [bishop(4, 7), pawn(3, 8), pawn(2, 8), pawn(1, 8), king(7, 8)], {
      ...FLEE, moveLimit: 9,
      hazards: carve(STACKS(4), X(7, 7), X(8, 7)),
      kingPen: ['g7', 'h7', 'g8', 'h8'],
    }),
    // L8 CUT THE WATCHER. Shaft b, plug b7 held by a8+c8. King in the h7 alcove under
    // pawn h8; pocket bishop f6 guards h8 through g7. Stone g7, pull, eat c8, take h8
    // (stun), step down onto him.
    make(8, [bishop(2, 7), pawn(1, 8), pawn(3, 8), pawn(8, 8), bishop(6, 6), king(8, 7)], {
      ...FLEE, moveLimit: 10,
      hazards: carve(STACKS(2), X(8, 7), X(6, 6), X(7, 7)),
      kingPen: ['g8', 'h8', 'h7'],
    }),
    // L9 COME DOWN ON HIM. He lives in a sealed stub of shaft h (h6-h7, side alcove g6),
    // reachable only from h8. Plug c6 (on HIS rank) held by pocket pawn b7. Pull it
    // down, climb, eat e8, drop onto h8, stone g6, slide into him.
    make(9, [bishop(3, 6), pawn(2, 7), pawn(5, 8), pawn(1, 8), king(8, 6)], {
      ...FLEE, moveLimit: 8,
      hazards: carve(STACKS(3), X(8, 6), X(8, 7), X(7, 6), X(2, 7)),
      kingPen: ['h6', 'h7', 'g6'],
    }),
    // L10 LAND IT, THEN WALL IT. Plug d7 held by c8+e8; pocket bishop c6 watches d5 and
    // d7-e8. Pull to d6 (not d5), climb, stone d7 behind you, take e8 (stun), slide in.
    make(10, [bishop(4, 7), pawn(3, 8), pawn(5, 8), bishop(3, 6), pawn(1, 8), king(8, 8)], {
      ...FLEE, moveLimit: 9,
      hazards: carve(STACKS(4), X(3, 6), X(7, 7), X(8, 7)),
      kingPen: ['g7', 'h7', 'g8', 'h8'],
    }),
  ],
};
