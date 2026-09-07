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
 *   L7-L10 no ford AND a 2x2 room. Jump the slash (only the knight does),
 *          then stone the two squares he would step to and slide onto his
 *          line (only the stone does). The pair, and nothing else in the kit.
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
 * L7-L10 intended lines (from any rank-1 start; the launch squares are the
 * two files below the slash — b1/c1/c2/d2/... on a1-h8, f1/g1/... on a8-h1 —
 * and each jumps onto the two files above it):
 *   L7  THE CAGE      slide to c1, jump to b3, stone a7+b7, b3→b8: he is on
 *                     a8 with b8 attacked along the rank and nowhere to
 *                     step. Take him. 4 moves, one dark (sealed) bishop
 *                     hunting the dark launch squares, 7 on the clock.
 *   L8  THE FAR SIDE  mirrored slash a8-h1, room g7/g8/h7/h8. Launch from
 *                     f1/g1 onto g3/h2/h3; stone g7+g8, then h3→h6 (or
 *                     h7+h8 and g3→g6): take. Two light (sealed) bishops
 *                     hunt the light launch square f1.
 *   L9  OFF THE CORNER a1-h8, room b7/b8/c7/c8 — not in the corner, so the
 *                     a-file and rank 8 both see it and the stones follow
 *                     the approach: from d8 stone b7+c7 (he is on b8, c8 is
 *                     on her rank); from a6 stone c7+c8. Two enemies a turn,
 *                     two bishops and a pawn on her side, 7 moves.
 *   L10 THE SLASH     a8-h1 again, corner room, two a turn, three sealed
 *                     bishops on her side, and SIX moves for a four-move
 *                     line: one wasted step and the clock takes it.
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
 * found it first read (L7-L10 100/100/100/94 on the direction pass) — the
 * stone plans here are one turn deep (drop two, slide onto the line), which
 * is the depth the bot models well. The prior "Boulder never gates" reads
 * were levels where the stone's job was to wall a guard's lane several
 * turns ahead, not to delete his flight squares this turn.
 *
 * ── 2026-09-06 RE-MEASURED AFTER THE CROSS-TALK FIX (commit 94482af) ──
 * Everything under MEASURED below was taken with a harness whose result depended
 * on the SHAPE of the command: the MCTS bot carried a process-lifetime decision
 * counter into its rollout RNG seed, so a cell read one number alone and another
 * as a later column of a multi-column run (repeating ONE cell four times in one
 * process gave 24/16/21/23 of 32). Rookie's start file was unseeded too. Both are
 * fixed; a cell now depends only on (run, level, loadout, trial, tier) and is
 * reproducible across invocation shapes — guarded by
 * scripts/run-playtest/matrix-determinism-check.ts.
 *
 * FINALE, numbers of record. `revenge.ts matrix --run=revenge-21 --levels=7,8,9,10
 * --loadouts=<none + kit + pair> --trials=32 --jobs=8`, T1 cards, Normal:
 *    L       none      aegis    boulder  knighthop     magnet  |  boulder+knight-hop
 *    7         0%         0%         0%         0%         0%  |  100%
 *    8         0%         0%         0%         0%         0%  |  100%
 *    9         0%         0%         0%         3%         0%  |  100%
 *   10         0%         0%         0%         0%         0%  |  100%
 * GATE HOLDS: no card in the kit clears a finale level alone (worst single cell 3%); the pair reads 100/100/100/100.
 * The header below reads 100/100/100/100 for the pair and is CONFIRMED (max drift 0 points,
 * inside 32-trial binomial noise) — but it was taken with the flawed method, so these
 * are the numbers of record.
 * ──
 * MEASURED (Normal, T5 bot, kit at T1 — the harness default; 2026-09-05).
 *   Direction pass (--jobs=2, 16 trials/cell, all ten levels):
 *   L      none  boulder  knight-hop  aegis  magnet  |  boulder+knight-hop
 *   1-3    100%   100%      100%       100%   100%   |   100%   (teaching)
 *   4        0%     0%      100%       100%    19%   |   100%   (aegis KEY)
 *   5        0%   100%       88%         0%    13%   |   100%   (boulder KEY)
 *   6        0%     0%      100%         0%     0%   |   100%   (knight-hop KEY)
 *   FINALE, numbers of record (--jobs=1 SERIAL, 32 trials/cell):
 *   7        0%     0%        0%         0%     0%   |   100%
 *   8        0%     0%        0%         0%     0%   |   100%
 *   9        0%     0%        0%         0%     0%   |   100%
 *   10       0%     0%        0%         0%     0%   |   100%
 *   (An earlier serial read of the same build, taken while another agent's
 *   edit had briefly dropped this run from extra-runs.ts, gave 100/100/100/91
 *   with knight-hop 3% on L9 — re-measured with the registration guarded;
 *   the table above is the clean read.)
 *   FULL RUNS (40 each, serial, never skipping an offer): 16/40 = 40% clear
 *   with RANDOM picks from the kit (deaths: L4 7, L5 4, L6 3, L7 8 — all
 *   move-limit, i.e. arrived without the card the level asks for); 34/40 =
 *   85% when the player takes only boulder + knight-hop. The random figure
 *   sits above The Moat's 25% for the structural reason the rubric names:
 *   with the pair as half of a 4-card kit and offers on L1/L3/L6/L9, a random
 *   picker usually holds both halves by L7. The gate itself is clean.
 *
 * DID BOULDER EARN ITS PLACE: yes, by construction and by number. On every
 * finale level the pair reads 100% and knight-hop alone reads 0% (serial,
 * 32 trials) — the only difference between the two cells is the stones.
 * The 2x2 room is what makes that true: a lone rook on his side of the
 * slash can attack one file or one rank of it and he steps to the other,
 * and nothing on his side can be captured for a stun. The stone's job is
 * one turn deep (drop two, slide onto the line), which is why the bot finds
 * it — the earlier Boulder failures asked the stone to wall a lane several
 * turns ahead.
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
  difficultyOverrides: { hard: { enemiesPerTurnDelta: 0 } },
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
    // L7 — THE CAGE. No ford, 2x2 room. Jump the slash, stone the two
    // squares he would step to, slide onto his line. The pair.
    make(7, [bishop(6, 2), king(1, 8)], {
      ...FLEE,
      moveLimit: 7,
      hazards: SLASH(),
      kingPen: ['a8', 'b8', 'a7', 'b7'],
    }),
    // L8 — THE FAR SIDE. Mirrored slash, corner room g7/g8/h7/h8. The h2
    // pawn is a stump (h1 is slash) that makes g1 hot for good, so the
    // launch has to be f1 — and two light bishops hunt exactly that.
    make(8, [bishop(2, 1), bishop(4, 1), king(8, 8)], {
      ...FLEE,
      moveLimit: 7,
      hazards: BACKSLASH(),
      kingPen: ['g8', 'h8', 'g7', 'h7'],
    }),
    // L9 — OFF THE CORNER. Room b7/b8/c7/c8: the a-file and rank 8 both
    // see it, so the stones depend on the approach. Two enemies a turn.
    make(9, [bishop(6, 2), bishop(8, 4), pawn(4, 3), king(2, 8)], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 7,
      hazards: SLASH(),
      kingPen: ['b8', 'c8', 'b7', 'c7'],
    }),
    // L10 — THE SLASH. Mirrored, corner room, two a turn, seven moves, the
    // h2 stump and three sealed bishops on her side.
    make(10, [bishop(2, 1), bishop(4, 1), bishop(3, 4), king(8, 8)], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 6,
      hazards: BACKSLASH(),
      kingPen: ['g8', 'h8', 'g7', 'h7'],
    }),
  ],
};

export { RUN_REVENGE_21 };
export default RUN_REVENGE_21;
