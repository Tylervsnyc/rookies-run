/**
 * revenge-21 — THE SLASH. Signature pair BOULDER + KNIGHT-HOP ("cage-and-take").
 * Kit = boulder / knight-hop / aegis (`allowedAbilities` IS the kit; 3 cards
 * since 2026-09-15, magnet dropped — it was a KEY nowhere by design).
 *
 * CONSTANT SIGNATURE — THE SLASH. One diagonal of stone corner to corner
 * (a1-h8, or a8-h1 mirrored). A diagonal cuts every file and every rank once,
 * so no rook line and no bishop of the slash's colour crosses it: the board is
 * two triangles, hers and his. Everything is about which side you are on.
 *
 * ── 2026-09-15 VARIETY PASS (Tyler's ladder playtest) ──
 * Tyler cleared it first try, 2 stars, never took Aegis, loved it — Boulder is
 * his favourite card. What he said and what the traces showed:
 *   - L1-L5 felt samey: one "hop to the knight square" trick solved them, and
 *     the king sat on a8 in 4 of the first 7 levels.
 *   - L6 (boulder back-rank mate) "really fun" — KEPT AS IS.
 *   - Finale lines were one idea four times: wall b8/b7/b6, g8/g7/g6, a7/b7/c7,
 *     e7-h7, then a rook slide (human REPEAT). L10 read 0% for the T1 bot.
 *   - Engine the same day: the king ALWAYS swings when Rookie ends next to him
 *     (a raised Aegis freezes him instead), one tap = one stone. Measured on
 *     the old finale: aegis + knight-hop cleared L7-L10 100/100/100/100 —
 *     hop over, stand next to him with the shield up, he freezes, take him.
 *     Every player holds all three cards, so the old finale was an Aegis walk.
 *
 * So each finale asks a DIFFERENT question of the same two cards, and the
 * shield is priced out where the geometry allows (see AEGIS below):
 *
 *   L1  THE FORD       still king c6; walk through the one gap.
 *   L2  THE CORK       mirrored slash; the gap holds a pawn — take it, go through.
 *   L3  THE COLUMN     first runner, a6 in a 3-high column; a rook below owns
 *                      a column. His knight squares are stone: no hop trick.
 *   L4  THE PLUG       (unchanged) take the defended plug, eat the reply: AEGIS.
 *   L5  THE ROOM       a 2x2 on the h-edge (not a corner); stone the two
 *                      squares he drops to: BOULDER.
 *   L6  THE JUMP       (unchanged, Tyler's favourite) no ford, row room on rank
 *                      8 — jump the slash and own the rank: KNIGHT-HOP.
 *   L7  THE KEYHOLE    still king boxed in stone; ONE knight square (d3), and
 *                      two bishops fire through it. Stone both lanes, step in,
 *                      hop onto him. (boulder BLOCKS HUNTERS; hop CAPTURES.)
 *   L8  THE NUDGE      runner in a four-square cross room behind an open ford.
 *                      Attack him through the ford and he runs to the far
 *                      corner; stone the two far squares so the only safe
 *                      square left is a knight's jump from where you stand.
 *                      (boulder HERDS; hop CAPTURES.)
 *   L9  THE X          runner in an X of five squares cut out of rock — every
 *                      flight diagonal, so a rook never holds him. A pawn sits
 *                      on his head. Crush it (a capture: he is stunned) and hop
 *                      next to him or onto his rank the same turn. (boulder
 *                      STUNS; hop CROSSES.) The one finale that needs Boulder T2.
 *   L10 THE WALL       Tyler's wall, kept as the capstone: a 2x2 on the back
 *                      rank, stone the two squares under him, jump the slash
 *                      and take the back rank — while dark bishops, which DO
 *                      cross this light slash, hunt you, two a turn.
 *                      (boulder WALLS; hop CROSSES.)
 *
 * AEGIS, honestly. A shield block ENDS the enemy phase (pawn-ai.ts), so "two
 * enemies a turn" never beats it; only a king who RUNS does. Measured: every
 * single card reads 0% on L7-L10, but aegis + knight-hop still has a line on
 * L7 (shield through the keyhole), L8 (shield on f4, hop) and L10/L9 (land,
 * step next to him, he freezes). Those lines need the jump too, so the combo
 * gate holds; they are the price of keeping Aegis in the rung-1 kit.
 *
 * NO TIER CAPS (Tyler, 2026-09-15): every card climbs its normal path to T5.
 * The finales are measured against upgraded singles (card:3-5) below.
 */

import { bishop, king, make, pawn, X } from '../run-kit';
import type { RunDef } from '../run-kit';
import type { Coord } from '../types';

/** The a1-h8 diagonal, minus any ford squares (file numbers). */
const SLASH = (...fords: number[]): Coord[] =>
  [1, 2, 3, 4, 5, 6, 7, 8].filter((k) => !fords.includes(k)).map((k) => X(k, k));
/** The a8-h1 diagonal, minus any ford squares (file numbers). */
const BACKSLASH = (...fords: number[]): Coord[] =>
  [1, 2, 3, 4, 5, 6, 7, 8].filter((k) => !fords.includes(k)).map((k) => X(k, 9 - k));
/** Squares by name: S('c2', 'e2'). */
const S = (...names: string[]): Coord[] =>
  names.map((n) => X(n.charCodeAt(0) - 96, Number(n.slice(1))));

const STILL = { winCondition: 'king' as const, kingBehavior: 'still' as const };
const FLEE = { winCondition: 'king' as const, kingBehavior: 'flee' as const };

/** Same five ids every Revenge slate guarantees (runs.ts REVENGE_CORE). */
const REVENGE_CORE_21: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

const RUN_REVENGE_21: RunDef = {
  id: 'revenge-21',
  signaturePair: ['boulder', 'knight-hop'],
  name: 'The Slash',
  blurb: 'One line of stone. He thinks a line is a wall.',
  allowedAbilities: ['boulder', 'knight-hop', 'aegis'],
  // PER-RUN DIFFICULTY OVERRIDE (2026-09-07). Hard's global `+1 enemy per turn`
  // made this stone run EASIER (the enemy phase drains corridors open), and
  // the finales are short exact lines where Hard's moveLimitDelta -2 would be
  // unwinnable, not hard. Hard/Nightmare keep their fleeing king, retries and
  // scoring.
  difficultyOverrides: {
    hard: { enemiesPerTurnDelta: 0, moveLimitDelta: 0 },
    nightmare: { enemiesPerTurnDelta: 0, moveLimitDelta: 0 },
  },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_21,
  offerCoreMin: 2,
  levels: [
    // L1 — THE FORD. a1-h8 slash, e5 missing. Still king c6 in the middle of
    // his triangle. Up the e-file through the ford, along rank 6, take him.
    make(1, [pawn(7, 4), king(3, 6)], {
      ...STILL,
      moveLimit: 6,
      hazards: SLASH(5),
      kingPen: ['c6'],
    }),
    // L2 — THE CORK. Mirrored slash, the ford at d5 holds a pawn that cannot
    // march (d4 is stone). Take the cork along rank 5, climb the d-file, run
    // rank 7 onto the still king g7. A light bishop hunts her (sealed on her
    // side by the light slash).
    make(2, [pawn(4, 5), king(7, 7)], {
      ...STILL,
      moveLimit: 7,
      hazards: [...BACKSLASH(4), ...S('d4')],
      kingPen: ['g7'],
    }),
    // L3 — THE COLUMN. First runner: a6 in a column a5-a7. Through the c3 ford
    // and along rank 3 to a3 — a rook below a column sees all of it, so he has
    // nowhere to step. b4/c5/c7/b8 are stone: every knight square of a6, so
    // the hop trick does not work here.
    make(3, [bishop(5, 3), king(1, 6)], {
      ...FLEE,
      moveLimit: 6,
      hazards: [...SLASH(3), ...S('b4', 'c5', 'c7', 'b8')],
      kingPen: ['a5', 'a6', 'a7'],
    }),
    // L4 — THE PLUG (unchanged). Ford at d4 plugged by a bishop, defended by a
    // stump pawn no rook reaches. Take the plug and eat the reply: AEGIS.
    make(
      4,
      [bishop(4, 4), pawn(3, 5), pawn(5, 3), pawn(5, 4), king(4, 8)],
      {
        ...STILL,
        moveLimit: 7,
        hazards: [...SLASH(4), X(3, 4), X(5, 2), X(3, 8), X(5, 8)],
        kingPen: ['d8'],
      },
    ),
    // L5 — THE ROOM. Mirrored slash, ford e4. His room is a 2x2 on the h-edge
    // (g5/h5/g6/h6), not a corner. From e6 the rook sees rank 6; he drops to
    // rank 5. Stone g5 + h5 first: BOULDER. f7/g8/f5/g4 are stone (his knight
    // squares from h6).
    make(5, [bishop(2, 1), king(8, 6)], {
      ...FLEE,
      moveLimit: 6,
      hazards: [...BACKSLASH(5), ...S('f7', 'g8', 'f5', 'g4')],
      kingPen: ['g5', 'h5', 'g6', 'h6'],
    }),
    // L6 — THE JUMP (unchanged; Tyler 2026-09-15: "really fun"). No ford. Row
    // room a8/b8, so a rook on rank 8 owns it — but only a jump crosses.
    make(6, [bishop(6, 2), king(1, 8)], {
      ...FLEE,
      moveLimit: 7,
      hazards: SLASH(),
      kingPen: ['a8', 'b8'],
    }),
    // L7 — THE KEYHOLE. Still king c5 boxed in stone: nothing can ever stand
    // next to him and no rook line reaches him. His one knight square a rook
    // can stand on is d3 (e4 is stone), and the bishops on b1 and f1 both fire
    // through it (c2 / e2). Rank 1 is walled, so she starts on d1. Stone c2 +
    // e2, climb to d3, hop onto him.
    make(7, [bishop(2, 1), bishop(6, 1), pawn(8, 6), king(3, 5)], {
      ...STILL,
      enemiesPerTurn: 2,
      moveLimit: 3,
      hazards: [
        ...SLASH(),
        ...S('b4', 'b5', 'b6', 'c4', 'c6', 'd5', 'd6', 'e4'),
        // every other knight square of c5 (an upgraded knight walks in).
        ...S('a4', 'a6', 'b3', 'b7', 'd7', 'e6'),
        ...S('a2', 'c1', 'e1', 'f2', 'g1', 'g2', 'h1'),
      ],
      kingPen: ['c5'],
    }),
    // L8 — THE NUDGE. Mirrored slash, ford e4. Runner g4 in a cross room
    // (g4, h3, h5, f5); everything above rank 5 is stone. Rank 1 is walled
    // so she starts on d1. From d4 the rook sees g4 through the
    // ford and he runs to the far corner (h3/h5). Stone h3 + h5 and the only
    // safe square is f5 — a knight's jump from d4. Two moves on the clock:
    // no time to walk around.
    make(
      8,
      [bishop(7, 5), bishop(1, 6), bishop(2, 3), bishop(1, 2), king(7, 4)],
      {
        ...FLEE,
        moveLimit: 3,
        hazards: [
          ...BACKSLASH(5),
          ...S('e5', 'd6', 'e6', 'f6', 'g6', 'h6', 'g3', 'h2', 'h4'),
          ...S('e3', 'f2', 'g1', 'a1', 'b1', 'c1', 'e1', 'f1'),
        ],
        kingPen: ['g4', 'h3', 'h5', 'f5'],
      },
    ),
    // L9 — THE X. Runner c6 in an X (c6, b5, d5, b7, d7) cut out of solid
    // stone; every flight is diagonal, so a rook never holds him. The pawn on
    // c7 guards d6 and is walled from every rook line. Crush it (Boulder T2:
    // a capture, so he is stunned) and hop g5/f4 -> e6 in the same turn; he
    // cannot run, e6 takes c6.
    make(
      9,
      [pawn(3, 7), bishop(3, 1), bishop(7, 1), bishop(8, 2), king(3, 6)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 4,
        hazards: [
          ...SLASH(),
          ...S('a2', 'a3', 'b3', 'a4', 'b4', 'c4', 'a5', 'c5', 'a6', 'b6', 'a7'),
          ...S('e7', 'f7', 'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8'),
                  ],
        kingPen: ['c6', 'b5', 'd5', 'b7', 'd7'],
      },
    ),
    // L10 — THE WALL. Mirrored (light) slash, so DARK bishops cross it.
    // Runner g8 in a 2x2 on the back rank; f6/g6/h7/h8 are stone, so the only
    // road onto him is rank 8 from outside. Stone f7 + g7 under him, jump
    // a6->b8 (or b6/a7->c8, which the e3 bishop watches) and slide. Two
    // enemies a turn, four moves: no time to walk up next to him.
    make(
      10,
      [bishop(5, 3), bishop(7, 1), king(7, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 5,
        hazards: [...BACKSLASH(), ...S('f6', 'g6', 'h7', 'h8')],
        kingPen: ['f8', 'g8', 'f7', 'g7'],
      },
    ),
  ],
};

export { RUN_REVENGE_21 };
export default RUN_REVENGE_21;
