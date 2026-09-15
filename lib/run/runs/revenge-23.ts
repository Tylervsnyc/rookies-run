/**
 * revenge-23 — THE PARAPET. Signature pair KNIGHT-HOP + TWIN (ladder rung 4).
 * Reworked 2026-09-15 (variety pass, 3-card kits). The 2026-09-05..07 build
 * history lives in git; this header describes what ships now.
 *
 * THE SIGNATURE. Rank 6 is one unbroken stone wall, a-file to h-file (a stair
 * gap on L1-L5 and L10 only). The king's court is the two ranks above it. No
 * rook line crosses the wall; a knight hops it. Every level is a question
 * about HOW YOU GET UP, and what the second rook does once you are there.
 *
 * ENGINE FACTS THIS RUN IS BUILT ON (read out of lib/run, 2026-09-15):
 *   - Knight Hop T1 is one knight move (T2 two, T3 three); she is a rook again
 *     after it. A rook standing a knight's jump from the king takes him with
 *     one hop — so every finale stones the rank-5 squares a jump away from him.
 *   - The king takes Rookie whenever she ENDS next to him (never the Twin).
 *     Any capture credited to her side stuns him a turn: he neither flees nor
 *     swings. That stun is what lets Rookie land beside him on L7/L8.
 *   - Twin is free to summon, on the 8 squares beside Rookie, and may take
 *     the king. A summoned Twin that already sees him takes him the same turn.
 *   - DECOY (deterministic since today) does two things a planner must know:
 *     while the mark stands, enemies act against the mark — including the king,
 *     who does not flee and does not swing at Rookie — and a marked pawn
 *     standing next to the king is EATEN BY THE KING (2-turn stun, and he
 *     steps onto the pawn's square). So Decoy is a trap only where no enemy can
 *     act on a mark AND no pawn touches the king. See the KIT map.
 *   - THE BOT (bots/mcts.ts) finds a line whose payoff lands within about one
 *     turn of the landing. Two-turn setups (walk, then summon, then take) read
 *     0% even when a scripted line wins — so every finale's pair line is
 *     "arrive, then summon and finish".
 *
 * KIT = knight-hop / twin / decoy (3 cards; aegis dropped 2026-09-15 — Tyler:
 * "I hate Aegis", and the plan keeps Aegis on rungs 1 and 3 only).
 *   knight-hop  KEY on L6 alone (hop onto a still king). Half of L7-L10.
 *               Solves L4 alone as well (bot 100%). TRAP on L1-L3 (stair open).
 *   twin        KEY on L5 alone (stair open, 2x2 room, one rook short).
 *               Half of L7-L10. TRAP on L1-L4 and L6.
 *   decoy       KEY on L4 — Tyler's model line, KEPT exactly: mark the plug,
 *               d7 eats it, take d7, turn into a knight, take the king.
 *               Also works on L5 (distracts the knight hunter).
 *               FINALES: TRAP on L10 (nothing can act on a mark; Knight Hop +
 *               Decoy 0%). SUPPORTING on L7-L9, and there it is a real second
 *               pair, reported not hidden (Knight Hop + Decoy, T1, 32 trials):
 *               L7 63-75% and L8 56% (mark the pawn beside him, the king eats
 *               it, hop onto him — the L4 chain again, with the king as the
 *               eater), L9 41% (the mark stops him running for a turn, one rook
 *               on the top rank is enough). The pair is still the stronger line
 *               on L7-L9 and the only one on L10.
 *
 * L1-L6 — WARMUP AND SINGLE KEYS
 *   L1 THE STAIR        still king, gap under him: ride up.
 *   L2 THE FAR STAIR    gap on the other side, walk the court.
 *   L3 HE MOVES         first flee king, a two-square cell on rank 8.
 *   L4 THE PLUG         Tyler 2026-09-15: "really satisfying, really fun".
 *                       Decoy + Knight Hop chain (see KIT). Unchanged.
 *   L5 THE OPEN COURT   (was L6 — Tyler: "ideally L5 and L6 would be
 *                       switched") stair open, 2x2 corner room: walk up, bring
 *                       the second rook. Twin 63% alone.
 *   L6 THE EAST DOOR    (new silhouette) no stair; a STILL king in a one-square
 *                       cell on d7, walls both sides; a rook on c5/e5 hops
 *                       straight onto him. Knight Hop 100%, everything else 0%.
 *
 * L7-L10 — FOUR DIFFERENT PAIR QUESTIONS (line signatures differ, check 7)
 *   L7 THE LEDGE      Land ON the pawn at his door. d7 stands on the ledge
 *                     beside a king in {e8,f8,f7}; hop from c5/e5 capturing it
 *                     (the stun lets her stand beside him), summon the Twin on
 *                     d8, the Twin steps in. A queen below moves twice a turn.
 *                     knight-hop>twin@adj | cap:ally/step
 *   L8 THE CORNER     Land ON the pawn INSIDE his room. Room g7/h7/g8/h8 with
 *                     a pawn on g7; e8 watches f7, f8 is stone; hop from f5/h5
 *                     onto g7, the Twin summoned in the room takes him. A queen
 *                     and a bishop move twice a turn below.
 *                     knight-hop>twin@pen | cap:ally/step
 *   L9 THE HIGH RANK  Nothing to capture, ride from range. Room a7/b7/a8/b8;
 *                     rank 7 is stone except d7/e7; hop up from c5-f5, summon
 *                     the Twin on the top rank, it rides into the corner. The
 *                     bishop on b1 is the only hunter (readable: one piece, one
 *                     colour, watching the launch squares).
 *                     knight-hop>twin@line | cap:ally/orth
 *   L10 THE SENTRY    The stair is back and it is guarded. Below the wall is
 *                     stone except rank 1, rank 3 and the e-file corridor; the
 *                     pawn on d7 takes whatever ends on e6. Send the Twin up
 *                     first, the pawn takes it, take the pawn (stun), and from
 *                     e6 hop onto g7. The L4 chain with the Twin as the bait.
 *                     twin@diag>knight-hop | cap:knight/L
 *
 * MEASURED 2026-09-15 (Normal, T5 bot, local, `revenge.ts matrix`, jobs=2;
 * 32 trials unless marked *16). T1 singles: none / knight-hop / twin / decoy
 * are 0% on all of L7-L10, and so are knight-hop:2 and knight-hop:3 alone.
 *   pair            L7   L8   L9   L10
 *   T1 kh+twin      88   66   81   44*
 *   T2 kh:2+twin    88   81   59   56*
 *   T3 kh:3+twin   100   91   69*  63*
 *   kit kh:2+tw+dc  97  100   84   50*
 * Arrival (60 full runs, 1 retry): knight-hop arrives T1/T2/T3 in 16/10/13
 * runs, twin mostly T1. BAND (rung 4: 63-79) reads ~70 at T1 and T2, ~81 at
 * T3. Full runs 28/60 (47%, want 45-65) — L4 is where most runs end.
 * SCALE: 48 pieces (4.8/level), L8-L10 average 6 vs L1-L3 average 3.
 * The GitHub re-grade (48 trials/cell) is the number of record.
 */

import {
  make,
  pawn,
  knight,
  bishop,
  queen,
  king,
  X,
  FLEE,
  STILL,
  type RunDef,
} from '../run-kit';
import type { Coord } from '../types';

/**
 * Core offer guarantee. Slates are filtered to the kit, so of the old
 * finisher list only knight-hop could ever appear; the guarantee always
 * delivered exactly that one card. Stated honestly — same behaviour.
 */
const REVENGE_CORE_23: ReadonlyArray<string> = ['knight-hop'];

/**
 * The parapet: rank 6 in stone from a to h, minus the STAIR files (1-8).
 * Extra stones (the merlons under the court pawns) go in `plus`.
 */
function PARAPET(stairs: number[] = [], plus: Coord[] = []): Coord[] {
  const out: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    if (stairs.includes(f)) continue;
    out.push(X(f, 6));
  }
  for (const c of plus) out.push({ ...c });
  return out;
}

/** A 2x2 room whose lower-left corner is (f, 7). */
function ROOM(f: number): string[] {
  const n = (ff: number, r: number) => `${'abcdefgh'[ff - 1]}${r}`;
  return [n(f, 7), n(f + 1, 7), n(f, 8), n(f + 1, 8)];
}

const RUN_REVENGE_23: RunDef = {
  id: 'revenge-23',
  signaturePair: ['knight-hop', 'twin'],
  name: 'The Parapet',
  blurb: 'A wall the whole width of the board. He is on top of it.',
  allowedAbilities: ['knight-hop', 'twin', 'decoy'],
  // PER-RUN DIFFICULTY OVERRIDE (2026-09-07). Hard's global `+1 enemy per turn`
  // makes THIS run EASIER, measured twice: no-retry 30% Normal vs 37% Hard, real-retry 42% vs 50%. The cause is the
  // documented one (.claude/run-level-design.md, "Pawn walls march") — the
  // enemy phase is what drains a narrow corridor open, so an extra enemy move
  // per turn is a GIFT on a stone/wall run. Hard keeps its tighter clock
  // (moveLimitDelta -2) and its fleeing king; only the enemy-count delta is
  // pinned to 0.
  difficultyOverrides: { hard: { enemiesPerTurnDelta: 0 } },
  // TIER CAP — knight-hop T4 is its only two-use tier (hop up, then hop onto
  // him). Re-checked 2026-09-15 on the new finales: knight-hop:2 and :3 alone
  // read 0% on L7-L10; T4 is never offered.
  abilityTierCaps: { 'knight-hop': 3 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_23,
  offerCoreMin: 1,
  levels: [
    // L1 — THE STAIR. Still king on e8, a one-square cell, and the wall has
    // one gap: e6, straight below him. Ride the e-file up the stair and
    // take him. Two loose pawns below the wall are free tempo.
    make(
      1,
      [
        pawn(3, 4), pawn(7, 3),
        king(5, 8),
      ],
      {
        ...STILL,
        moveLimit: 7,
        hazards: PARAPET([5]),
        kingPen: ['e8'],
      },
    ),
    // L2 — THE FAR STAIR. Still king on b8; the gap is at g6, the other
    // side of the board. Up the g-file, then west along the court. The pawn
    // on e8 sits on your road: take it on the way.
    make(
      2,
      [
        pawn(5, 8),
        pawn(8, 4),
        king(2, 8),
      ],
      {
        ...STILL,
        moveLimit: 9,
        hazards: PARAPET([7]),
        kingPen: ['b8'],
      },
    ),
    // L3 — HE MOVES. First flee king: g8 in a two-square cell f8/g8, both on
    // rank 8. Stair at d6. Up the d-file to d8 and one rook on rank 8 sees
    // both his squares — he has nowhere to step. A knight hunts below.
    make(
      3,
      [
        knight(2, 3),
        pawn(8, 4),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: PARAPET([4]),
        kingPen: ['f8', 'g8'],
      },
    ),
    // L4 — THE PLUG (unchanged; Tyler's model level). Stair at c6, and a
    // bishop frozen in stone stands in it, defended by the jammed pawn on d7.
    // DECOY is the key: mark the bishop, d7 eats it, take d7 (stun), turn into
    // a knight and take the king. Knight Hop alone also clears it.
    make(
      4,
      [
        bishop(3, 6), pawn(4, 7),
        knight(8, 3),
        king(2, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: PARAPET([3], [X(2, 5), X(4, 5), X(2, 7)]),
        kingPen: ['a8', 'b8'],
      },
    ),
    // L5 — THE OPEN COURT. Stair at d6, room g7/h7/g8/h8. Walk up and
    // bring the second rook: one rook never corners him in a 2x2. KEY = twin.
    make(
      5,
      [
        knight(2, 3), bishop(8, 3), pawn(3, 8), pawn(1, 8),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: PARAPET([4], [X(3, 7), X(1, 7)]),
        kingPen: ROOM(7),
      },
    ),
    // L6 — THE EAST DOOR. No stair. A still king in a one-square cell on d7,
    // stone on c7 so his rank opens only to the east. A rook on c5 or e5 is a
    // knight's jump from him: reach the launch square, hop onto him.
    // KEY = knight-hop.
    make(
      6,
      [
        pawn(1, 8), pawn(8, 8),
        knight(6, 3), pawn(2, 4), pawn(8, 5),
        king(4, 7),
      ],
      {
        ...STILL,
        moveLimit: 8,
        hazards: PARAPET([], [X(1, 7), X(3, 7), X(8, 7), X(8, 4)]),
        kingPen: ['d7'],
      },
    ),
    // L7 — THE LEDGE. Hop from c5/e5 onto the d7 pawn beside him (the stun
    // is her shield), summon the Twin on d8, step in. Queen below, 2 a turn.
    make(
      7,
      [
        pawn(4, 7), pawn(1, 8), pawn(8, 8), pawn(7, 8),
        queen(8, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 5,
        hazards: PARAPET([], [X(1, 7), X(2, 8), X(2, 7), X(3, 7), X(5, 7), X(7, 7), X(8, 7)]),
        kingPen: ['e8', 'f8', 'f7'],
      },
    ),
    // L8 — THE CORNER. Hop from f5/h5 onto the g7 pawn inside his room
    // (e8 watches f7, f8 is stone), the Twin summoned in the room takes him.
    make(
      8,
      [
        pawn(7, 7), pawn(5, 8), pawn(2, 8),
        queen(1, 3), bishop(5, 4),
        king(8, 8),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 5,
        hazards: PARAPET([], [X(5, 7), X(6, 8), X(2, 7)]),
        kingPen: ROOM(7),
      },
    ),
    // L9 — THE HIGH RANK. Land on d7 or e7, summon the Twin on the top rank,
    // it rides into the corner. One bishop on b1 hunts the launch squares.
    make(
      9,
      [
        pawn(8, 8), pawn(1, 5), pawn(8, 5), pawn(7, 3),
        bishop(2, 1),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: PARAPET([], [X(3, 7), X(6, 7), X(7, 7), X(8, 7), X(1, 4), X(8, 4), X(7, 2)]),
        kingPen: ROOM(1),
      },
    ),
    // L10 — THE SENTRY. The stair is guarded: d7 takes whatever ends on e6.
    // Twin up the corridor as bait, take the pawn, hop e6-g7. No piece can
    // move, so a Decoy mark buys nothing.
    make(
      10,
      [
        pawn(4, 7), pawn(1, 8), pawn(2, 8), pawn(7, 8), pawn(8, 8),
        king(7, 7),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: PARAPET([5], [
          X(1, 7), X(2, 7), X(3, 7), X(3, 8), X(5, 7), X(6, 7), X(6, 8), X(8, 7),
          X(1, 5), X(2, 5), X(3, 5), X(4, 5), X(6, 5), X(7, 5), X(8, 5),
          X(1, 4), X(2, 4), X(3, 4), X(4, 4), X(6, 4), X(7, 4), X(8, 4),
          X(1, 2), X(2, 2), X(3, 2), X(4, 2), X(6, 2), X(7, 2), X(8, 2),
        ]),
        kingPen: ['g7'],
      },
    ),
  ],
};

export default RUN_REVENGE_23;
export { RUN_REVENGE_23 };
