/**
 * revenge-21 — THE SLASH. Built 2026-09-05 for the signature pair
 * BOULDER + KNIGHT-HOP ("cage-and-take" in data/run-playtest/pair-hypotheses.json).
 * Kit = boulder / knight-hop / aegis / magnet (`allowedAbilities` IS the kit).
 *
 * WHY THIS PAIR. Boulder drops permanent stone anywhere, for free — and stone
 * walls Rookie's own rays exactly like it walls his. The knight is the one
 * form in the game that jumps its own walls. So this is the pair that can
 * brick a king's room shut and still arrive. Boulder had never gated a level
 * with any partner before this run (bishop-squire, magnet and swap all
 * failed): in a hall or a colonnade a stone is as likely to wall the
 * player's line as the king's exit. The fix is to give the stone a job no
 * other card can do — REMOVE THE SQUARES HE RUNS TO — on a board where the
 * rook can always find his line and he can always step off it.
 *
 * CONSTANT SIGNATURE — THE SLASH. One diagonal of stone runs corner to
 * corner across the whole board (a1-h8, or a8-h1 on the mirrored levels).
 * A diagonal cuts EVERY file and EVERY rank exactly once, so no rook line,
 * no pawn, and no bishop of the slash's own colour ever crosses it: the
 * board is two triangles, hers and his. Not a band across rank 5 (The
 * Moat), not a box (The Vault / The Glasshouse), not offset bars (The
 * Switchback), not a hedge (The Briar): one line, and everything is about
 * which side of it you are on.
 *
 *   L1-L2  the slash has a FORD (one missing stone). Walk through it.
 *   L3     first flee king, ford open. His room is two squares in a ROW —
 *          one rook on rank 8 sees both, he has nowhere to step. Free.
 *   L4     the ford is PLUGGED by a bishop frozen in a knot of stone and
 *          defended by a stump pawn no rook can reach. Take the plug, eat
 *          the reply: AEGIS.
 *   L5     the ford is open but his room is a 2x2 — a rook can never hold a
 *          2x2 against a stepping king. Two stones make it a 1x2: BOULDER.
 *   L6     no ford. Row room again — so the rook owns it — but the only way
 *          over the slash is a jump: KNIGHT-HOP.
 *   L7-L10 no ford AND a room a rook cannot hold. Jump the slash (only the
 *          knight does), then stone the squares he would step to and slide
 *          onto his line (only the stone does). The pair, and nothing else
 *          in the kit — and each of the four asks for a DIFFERENT stone
 *          pattern (see "THE FOUR DEMANDS" below).
 *
 * WHY THE SINGLES FAIL ON THE FINALE (kit-relative, measured below):
 *   none        no line crosses the slash. 0%.
 *   boulder     stones seal, they never open; the rook stays on her side.
 *   knight-hop  T1 = ONE knight move, then she is a rook again on his side
 *               of the wall with a 2x2 room in front of her: she attacks a
 *               file or a rank, he steps to the other column, forever. His
 *               side of the slash holds nothing to capture (no stun) and no
 *               line she can build. Two hunters that CAN cross are the risk
 *               here, so every finale hunter is a bishop of the slash's own
 *               colour (sealed) or a pawn (never crosses).
 *   aegis       a shield does not open a wall; on his side nothing hits her.
 *   magnet      pulls run along her rook lines and every one of them ends
 *               in the slash; nothing on his side to pull, and the king
 *               (below T5) cannot be pulled at all. knight-hop + magnet is
 *               a listed anti-pair (knight form falls back to rook pulls).
 *
 * KEY / TRAP map:
 *   boulder     KEY L5, half of L7-L10. TRAP L1-L4/L6 (a stone in a ford
 *               level is a wall she built for herself).
 *   knight-hop  KEY L6, half of L7-L10. Second answer on L3-L5 where the
 *               room is a row (it crosses anywhere and the rook owns a row).
 *   aegis       KEY L4. TRAP everywhere else: nothing on his side ever
 *               attacks her, and a shield does not stop him stepping.
 *   magnet      KEY nowhere by design — the trap card. On L4 it looks right
 *               (pull the plug out of the ford) and is fatal: the pulled
 *               bishop lands on d2/d3 under a frozen pawn column and blocks
 *               the file it came from.
 *
 * THE FOUR DEMANDS (reworked 2026-09-07 — Tyler: "the design is really cool
 * but later levels need more difficulty, and ways to solve. I love the
 * combination of abilities, it's just too easy."). The old finale was one
 * line restated four times — corner 2x2, stone both flight squares, arrive
 * along rank 8 — and the pair read 100/100/100/100. The rework varies TWO
 * axes of his room, shape and position, so the four levels are the four
 * cells of that matrix and each needs a different use of the same pair:
 *
 *   L7  THE CAGE       SMALL room, IN the corner (a7/a8/b7/b8, a1-h8 slash).
 *                      The stones FLANK it — a7 + b7 — which seals both
 *                      files and means the only road left is rank 8, from
 *                      OUTSIDE, at c8 or beyond. Four moves, four on the
 *                      clock: the pattern is fixed, the tempo is the test.
 *   L8  THE LONG ROOM  LONG room (2x3: f7-h8), still in the corner, mirrored
 *                      slash. A rook line can only ever cover ONE of its two
 *                      rows, so the stones stop flanking and become a BAR:
 *                      both on the same row, on the two squares he can drop
 *                      to, while the rook owns the other row. Pick the wrong
 *                      row and the four moves are gone.
 *   L9  OFF THE CORNER SMALL room LIFTED off the wall (b7/b8/c7/c8). Now the
 *                      a-file AND rank 8 both see it, so there is no fixed
 *                      pair of squares to stone: the answer depends on which
 *                      side of the room you crossed onto. A choice, not a
 *                      pattern — and two enemies a turn while you make it.
 *   L10 THE FAR ROOM   LONG room, LIFTED off the corner (e7-g8, mirrored) —
 *                      both wrinkles at once, two a turn, four moves. The
 *                      bar has to be laid on the right row AND on the right
 *                      end of it, because the open h-file behind him is a
 *                      door the corner rooms did not have.
 *
 * Boulder is 2 stones a level at T1 and knight-hop is ONE knight move, so
 * every one of these is exactly two stones and one jump — the difficulty is
 * never "more resource", it is which squares and in which order.
 *
 * SECOND ANSWERS MID-RUN (honest): knight-hop also solves L3-L5. On a ford
 * level the rook is already on his side, and a knight that lasts one move
 * is a finisher — stand a knight's jump from where he rests (a rook there
 * does not threaten him, so he does not step) and hop onto him. That is
 * exactly the move the finale removes by making the jump the only way over
 * the wall: the one knight move is spent crossing, and on his side she is a
 * rook again against a room she cannot hold.
 *
 * ON THE BOT AND THE STONES: the playtest bot only considers drops adjacent
 * to the king or within two of Rookie. That is precisely the cage, and it
 * finds it — the stone plans here are one turn deep (drop two, slide onto the line), which
 * is the depth the bot models well. The prior "Boulder never gates" reads
 * were levels where the stone's job was to wall a guard's lane several
 * turns ahead, not to delete his flight squares this turn.
 *
 * ── 2026-09-07 REWORKED FOR DIFFICULTY (L7-L10 only) ──
 * The gate was never the problem: every single card in the kit read 0% and the
 * pair read 100/100/100/100, which proves the combo is REQUIRED and never that
 * it is HARD. The combo-gate contract is a floor with no ceiling; Tyler solved
 * the finale once and then executed it three more times. L7-L10 were rebuilt to
 * the 60-80% band (the Alcove, revenge-25, is the model at 67%).
 *
 * WHAT ACTUALLY MOVES THE NUMBER ON THIS RUN (measured, 32 trials each):
 *   - THE CLOCK, and almost nothing else. The intended line is four moves from
 *     every start file; at moveLimit 5 the pair reads 100/100/100/91 and at 4 it
 *     reads 78/72/59/47. One spare move is the whole difference between "solved"
 *     and "no wasted step allowed", so all four finales now sit at moveLimit 4.
 *   - enemiesPerTurn is NOT a knob here (L7 with 2/turn at clock 5 still read
 *     100%) — the same reason this run already pins Hard's enemy delta to 0.
 *   - A BIGGER ROOM IS NOT HARDER. A 2x3 corner room at clock 6 read 100%: one
 *     rook line covers a row of three and two stones cover the rest. Room shape
 *     changes WHICH squares you stone (the point of the rework), not how hard.
 *   - NOTHING CAPTURABLE MAY STAND ON HIS SIDE. A sealed dark bishop parked on
 *     his side of the slash took knight-hop ALONE from 0% to 100%: the capture
 *     is a stun, and stuns are what let a lone rook hold a 2x2. Every hunter in
 *     the finale stays on her side of the wall. (This is the single most
 *     load-bearing constraint in the run — do not add a piece above the slash.)
 *   - A THREE-SQUARE ROOM IS TOO SMALL. An L of three (the diagonal cutting the
 *     corner off) read knight-hop alone 78%. A full 2x2 is the minimum.
 *
 * DIFFICULTY PIN (new, and the cost of a 4-move clock): Hard and Nightmare carry
 * moveLimitDelta -2, which on a four-move line is unwinnable, so this run now
 * pins both to 0 alongside the existing enemy-count pin. Hard/Nightmare keep
 * their fleeing-from-L1 king, retry count and scoring.
 *
 * FINALE, numbers of record. Normal, T5 bot, kit at T1, 32 trials, jobs=4
 * (matrixParallel over levels 7-10 x none + each kit card + the pair):
 *    L       none      aegis    boulder  knighthop     magnet  |  boulder+knight-hop
 *    7         0%         0%         0%         0%         0%  |   78%
 *    8         0%         0%         0%         0%         0%  |   66%
 *    9         0%         0%         0%         0%         0%  |   72%
 *   10         0%         0%         0%         0%         0%  |   69%
 * GATE HOLDS (every single card 0%, worst cell 0%) and the pair mean is 71.3%,
 * inside the 60-80 band with no level at 100. Before the rework, the same read
 * gave 100/100/100/100 with knight-hop 3% on L9.
 * Nothing below L7 changed.
 *
 * DID BOULDER EARN ITS PLACE: yes, by construction and by number. On every
 * finale level knight-hop alone reads 0% and the pair reads 66-78% — the only
 * difference between the two cells is the stones. A lone rook on his side of
 * the slash can attack one file or one rank of his room and he steps off it,
 * and nothing on his side can be captured for a stun. The stone's job is one
 * turn deep (drop two, slide onto the line), which is why the bot finds it.
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
  name: 'The Slash',
  blurb: 'One line of stone. He thinks a line is a wall.',
  allowedAbilities: ['boulder', 'knight-hop', 'aegis', 'magnet'],
  // PER-RUN DIFFICULTY OVERRIDE (2026-09-07). Hard's global `+1 enemy per turn`
  // makes THIS run EASIER, measured twice: no-retry 50% Normal vs 50% Hard, real-retry 55% vs 60%. The cause is the
  // documented one (.claude/run-level-design.md, "Pawn walls march") — the
  // enemy phase is what drains a narrow corridor open, so an extra enemy move
  // per turn is a GIFT on a stone/wall run. Hard keeps its tighter clock
  // (moveLimitDelta -2) and its fleeing king; only the enemy-count delta is
  // pinned to 0.
  // The move-limit halves of the pin are NEW (2026-09-07): the reworked
  // L7-L10 sit at moveLimit 4, which IS the length of the intended line, so
  // Hard/Nightmare's global -2 would make the finale unwinnable rather than
  // hard. Both keep their fleeing-from-L1 king, retry count and scoring.
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
    // L1 — THE FORD. The slash a1-h8 with d4 missing. Still king a8. Ride
    // the d-file through the ford to d8, run the rank (the c8 pawn is free
    // tempo), take him.
    make(1, [pawn(3, 8), king(1, 8)], {
      ...STILL,
      moveLimit: 6,
      hazards: SLASH(4),
      kingPen: ['a8'],
    }),
    // L2 — THE OTHER SLASH. Mirrored: a8-h1 with e4 missing, still king h8
    // in the far corner. Up the e-file through the ford, along rank 8. A
    // light bishop (sealed on her side by a light slash) hunts her.
    make(2, [bishop(2, 1), pawn(7, 8), king(8, 8)], {
      ...STILL,
      moveLimit: 7,
      hazards: BACKSLASH(5),
      kingPen: ['h8'],
    }),
    // L3 — HE RUNS. First flee king: a8 in a two-square ROW (a8/b8). Ford
    // at e5. Cross, get onto rank 8: a rook on the eighth sees both his
    // squares, so he has nowhere to step. Free — this is the lesson the
    // finale inverts.
    make(3, [bishop(8, 2), king(1, 8)], {
      ...FLEE,
      moveLimit: 7,
      hazards: SLASH(5),
      kingPen: ['a8', 'b8'],
    }),
    // L4 — THE PLUG. Ford at d4, and a bishop stands in it, frozen in a
    // knot: c3/e5 are slash, c5 holds a pawn, e3 holds a pawn. The c5 pawn
    // defends d4 and is a stump (c4 is stone), and no line from her side
    // reaches c5 (c3 and e5 are slash). He stands STILL on d8, straight up
    // the file behind the plug, with c8/e8 stone so the only line onto him
    // is the d-file. Take the plug and the pawn takes her back — unless the
    // shield is up: AEGIS, then d4xd8. The e3/e4 pawn column (frozen by e2)
    // covers d2 and d3, so a pulled plug is defended where it lands and
    // still blocks the file: magnet is the trap.
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
    // L5 — THE ROOM. Ford at e5, open. His room is a 2x2 (a7/a8/b7/b8): a
    // rook sees one file or one rank of it and he steps to the other,
    // forever. Two stones on the squares he steps to make it a row again.
    // BOULDER.
    make(5, [bishop(7, 1), king(1, 8)], {
      ...FLEE,
      moveLimit: 8,
      hazards: SLASH(5),
      kingPen: ['a8', 'b8', 'a7', 'b7'],
    }),
    // L6 — THE JUMP. No ford. Row room (a8/b8), so a rook on rank 8 owns
    // it — but nothing walks over the slash. Jump it: KNIGHT-HOP, alone.
    make(6, [bishop(6, 2), king(1, 8)], {
      ...FLEE,
      moveLimit: 7,
      hazards: SLASH(),
      kingPen: ['a8', 'b8'],
    }),
    // L7 — THE CAGE. Small room, in the corner. Jump the slash, FLANK his
    // room with the two stones (a7 + b7), and the only road left is rank 8
    // from outside — a8/b8 can no longer be reached up either file. Four
    // moves for a four-move line: no step to spare.
    make(7, [bishop(6, 2), king(1, 8)], {
      ...FLEE,
      moveLimit: 4,
      hazards: SLASH(),
      kingPen: ['a8', 'b8', 'a7', 'b7'],
    }),
    // L8 — THE LONG ROOM. Same corner, twice as wide (2x3, f7-h8), mirrored
    // slash. One rook line can only ever hold ONE of the two rows, so the
    // stones stop flanking and lie as a BAR across the row he is not on.
    // Choose the row, then take the other one with the rook.
    make(8, [bishop(2, 1), bishop(4, 1), king(8, 8)], {
      ...FLEE,
      moveLimit: 4,
      hazards: BACKSLASH(),
      kingPen: ['f8', 'g8', 'h8', 'f7', 'g7', 'h7'],
    }),
    // L9 — OFF THE CORNER. Small room lifted off the wall (b7/b8/c7/c8), so
    // the a-file and rank 8 both see it and there is no fixed pair to stone:
    // from d8 stone b7 + c7, from a6 stone c7 + c8. Which two depends on
    // where you crossed. Two enemies a turn.
    make(9, [bishop(6, 2), bishop(8, 4), king(2, 8)], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 4,
      hazards: SLASH(),
      kingPen: ['b8', 'c8', 'b7', 'c7'],
    }),
    // L10 — THE FAR ROOM. Both wrinkles at once: a LONG room (e7-g8) LIFTED
    // off the corner, mirrored slash, two a turn, four moves. The bar has to
    // go on the right row AND cover the right end of it — the open h-file
    // behind him is the door the corner rooms never had.
    make(10, [bishop(2, 1), bishop(4, 1), king(6, 8)], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 4,
      hazards: BACKSLASH(),
      kingPen: ['e8', 'f8', 'g8', 'e7', 'f7', 'g7'],
    }),
  ],
};

export { RUN_REVENGE_21 };
export default RUN_REVENGE_21;
