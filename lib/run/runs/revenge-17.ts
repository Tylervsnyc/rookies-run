/**
 * revenge-17 — THE BRIAR. Built 2026-09-05 for the signature pair
 * dragon + sacrifice ("parachute the bomb"): both halves are FREE actions,
 * so a body can appear inside his garden and detonate before Rookie has
 * moved at all. The scarce resource is body-moves, not casts.
 *
 * CONSTANT SIGNATURE — THE HEDGE. Every level puts a TWO-DEEP PAWN THICKET
 * on ranks 6 and 7. Because a black pawn on (f,7) defends (f-1,6) and
 * (f+1,6), the back row defends the whole front row, and because the front
 * row occupies the squares the back row would step into, the whole thicket
 * is FROZEN — it is a hedge, not an army. Two consequences drive every
 * level:
 *   1. A rook that captures into the hedge is always recaptured.
 *   2. A gap one or two files wide is still covered at the mouth by the
 *      rank-7 pawns on either side, so "open one file" is never enough.
 * The answer is the blast. A Dragon (queen rays + knight squares) spawned on
 * (f,5) and detonated kills rank 6 on f-1, f and f+1 AND rank 7 on f-1 and
 * f+1 — it opens the TWO FILES BESIDE HER, top to bottom, and stuns the king
 * two turns while she walks up one of them. That geometry is the run.
 *
 * KIT = dragon / sacrifice / aegis / poison-dart (`allowedAbilities` IS the
 * kit — daily-kit.ts draws all four). No universal solvents. Both fillers
 * answer the SAME question the hedge asks ("this key is defended") one guard
 * at a time, which is exactly why they die on the finale, where every key is
 * defended twice and the mouth is covered besides.
 *
 * KEY / TRAP per level:
 *   L1  none needed — walk around the end of the hedge.
 *   L2  none needed — one undefended plug on each flank; pick a side.
 *   L3  none needed — first fleeing king; walk into his room and close it.
 *   L4  poison-dart / aegis KEY (the a-file plug is defended once, from b7:
 *       kill the defender or eat the reply). dragon/sacrifice are TRAPS —
 *       knight d8 posts b7 so no body survives beside it.
 *   L5  aegis KEY (walk onto the h6 plug and TANK the recapture, then take
 *       him through h7). poison-dart is the slow second answer. dragon TRAP
 *       — every body it can reach is covered by knight f8.
 *   L6  dragon KEY, ALONE and only (a7/b7/c8 are walls: NO rook line ever
 *       reaches his corner, so the level cannot be walked — measured 0% for
 *       no-ability, sacrifice, aegis and the dart, 100% for the dragon).
 *   L7  PAIR. Closed hedge b-g, flanks walled, crown above, stumps on d7/e7.
 *   L8  PAIR. Same wall, his room in the far a8/b8 corner — one door (c8).
 *   L9  PAIR. Hedge wall to wall, corner room, one file that can ever open.
 *   L10 PAIR. Wall-to-wall hedge, TWO enemies a turn, seven moves.
 *
 * THE ANTI-DRAIN RUNNER (the tuning that made the finale hold). A 2-deep
 * pawn hedge is not actually static: the front row MARCHES (pawn priority is
 * -rank, so the row on 6 walks down one pawn per enemy turn), and a drained
 * file plus one baited recapture opens a lane no ability paid for — dragon
 * alone read 38-88% and the dart 44-94% while that was live. The fix is a
 * RUNNER: a stacked column of pawns on the far flank (h3/h4/h5 under the
 * hedge, a3/a4/a5 on L9). They are self-blocking, so they out-priority the
 * whole hedge for ~6 enemy turns and then jam solid — the thicket never
 * marches inside the level's clock. Every single-card win vanished the turn
 * they went in. Note also that two enemies a turn made things EASIER before
 * the runner (twice the marching); it is a real difficulty knob only now.
 *
 * MEASURED (32 trials/cell, Normal, --jobs=1, 2026-09-05, `revenge.ts
 * matrix`). NOTE: --jobs=2 cells cross-talk badly when several agents share
 * the machine (L7 no-ability read 44% in one parallel sweep and 0% in three
 * isolated reads) — trust the serial read.
 *          none  dragon  sacrifice  aegis  dart   dragon+sacrifice
 *   L1-L2  100%   100%     100%     100%   100%        100%
 *   L3      91%   100%      84%      84%   100%        100%
 *   L4      34%    66%      28%     100%    94%        100%
 *   L5      41%   100%      56%     100%   100%        100%
 *   L6       0%   100%       0%       0%     0%        100%
 *   L7       0%     0%       0%       0%     0%         84%
 *   L8       0%     0%       0%       0%     3%         78%
 *   L9       0%     0%       0%       0%     0%         81%
 *   L10      0%     0%       0%       0%     0%         84%
 * The finale is combo-gated on the Moat's standard: nothing alone clears
 * L7-L10, the pair clears 78-84%. Full runs (40, Normal): 55% with random
 * picks, 50% with pool=dragon,sacrifice — the two numbers sit on top of each
 * other because the signature pair is HALF a four-card kit, so a random
 * picker converges on it; the run's real filter is L6 (dragon or nothing,
 * ~78% cleared in run context) and the L7-L10 clock.
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
import type { EnemyPiece } from '../types';

/**
 * The finisher list every Revenge slate guarantees. Duplicated here (not
 * imported from runs.ts) because runs.ts imports this module's registry —
 * a value import would close the cycle.
 */
const REVENGE_FINISHERS: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

/** The hedge: a two-deep pawn thicket on ranks 6 and 7 over these files. */
const HEDGE = (...files: number[]): EnemyPiece[] =>
  files.flatMap((f) => [pawn(f, 6), pawn(f, 7)]);
/** The front row of the thicket alone (rank 6). */
const ROW6 = (...files: number[]): EnemyPiece[] => files.map((f) => pawn(f, 6));
/** The back row alone (rank 7) — the row that defends the front. */
const ROW7 = (...files: number[]): EnemyPiece[] => files.map((f) => pawn(f, 7));
/** The crown: rank-8 pawns. Frozen by the hedge in front of them, and they
 *  defend the whole back row from above. Never on one of his own squares. */
const CROWN = (...files: number[]): EnemyPiece[] => files.map((f) => pawn(f, 8));
/** Stumps: hazard squares on rank 7 in front of his room, so the files that
 *  lead straight at him can NEVER open — the way in is always sideways. */
const STUMPS = (...files: number[]) => files.map((f) => X(f, 7));

const RUN_REVENGE_17: RunDef = {
  id: 'revenge-17',
  name: 'The Briar',
  blurb: 'He grew a hedge and called it a kingdom.',
  allowedAbilities: ['dragon', 'sacrifice', 'aegis', 'poison-dart'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_FINISHERS,
  offerCoreMin: 2,
  levels: [
    // L1 — THE GATE. Still king e8 behind a four-file hedge (c-f). Both ends
    // of the hedge are open air: walk round it, up an edge file, and along
    // rank 8. Teaches the shape and that the shape has ends.
    make(1, [...HEDGE(3, 4, 5, 6), king(5, 8)], {
      ...STILL,
      moveLimit: 7,
    }),
    // L2 — THE PLUGS. Still king d8, hedge b-g. Both ends are now plugged by
    // a single pawn (a7 / h7) — each undefended, so each is a free capture
    // and a free stun. Pick the side the knight isn't on.
    make(
      2,
      [...HEDGE(2, 3, 4, 5, 6, 7), pawn(1, 7), pawn(8, 7), knight(6, 4), king(4, 8)],
      { ...STILL, moveLimit: 9 },
    ),
    // L3 — HIS ROOM. First fleeing king. Hedge a-e, hazards f7/f8 wall off
    // the corner, and his room is g7-h8. Walk up an open file into the room:
    // a rook standing in a 2x2 room covers every square he could step to.
    make(
      3,
      [...HEDGE(1, 2, 3, 4, 5), knight(6, 4), king(7, 8)],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: [X(6, 7), X(6, 8)],
        kingPen: ['g7', 'h7', 'g8', 'h8'],
      },
    ),
    // L4 — THE PLUG. King a8 in a 2-square cell (a7/a8) at the end of a b-f
    // hedge, and the a-file — the one line that reaches him — is plugged by
    // a single pawn on a6 that the hedge defends from b7. Take it and b7
    // takes you. The rank-8 walk from the open right is cut by the hazard on
    // f8, and knight d8 is posted so that b7 itself can never be picked off
    // by a body. KEY = poison-dart (kill the defender, then the plug is
    // free) or aegis (take the plug anyway and eat the reply). Waiting for
    // the plug to march itself down the file is the slow, unreliable third
    // answer, and the seven-move clock rarely allows it.
    make(
      4,
      [
        ...HEDGE(2, 3, 4, 5, 6),
        pawn(1, 6),
        knight(4, 8), knight(7, 4), bishop(8, 2),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: [X(6, 8)],
        kingPen: ['a7', 'a8'],
      },
    ),
    // L5 — THE SHIELDED DOOR. King h8, cell h7/h8, hedge b-g, hazard g8. The
    // h-file is wide open to h7 — his doorway — and knight f8 is the only
    // thing covering it (its every other jump is its own hedge, so it can
    // never leave the post). Walk in and EAT the recapture: KEY = aegis. The
    // dart is the slow version; a dragon dropped on h7 dies to the same
    // knight, and the long way round (a-file, rank 8, take the knight) does
    // not fit the clock.
    make(
      5,
      [
        ...HEDGE(2, 3, 4, 5, 6, 7),
        pawn(8, 6),
        knight(6, 8), bishop(1, 2),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [X(7, 8)],
        kingPen: ['h7', 'h8'],
      },
    ),
    // L6 — THE HOLE. King a8 in the corner (a8/b8) with the floor of his
    // room walled (a7/b7) and c8 walled too: NO rook line, ever, reaches
    // either of his squares — the level cannot be walked. But c6/c7 are open
    // air (the hedge starts at d), and a body dropped on c6 knight-jumps to
    // b8, INSIDE the room, where nothing on his side attacks it. KEY =
    // dragon, alone. aegis and the dart are traps: there is no key to take.
    make(
      6,
      [...HEDGE(4, 5, 6, 7, 8), pawn(4, 8), bishop(8, 2), king(1, 8)],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: [X(1, 7), X(2, 7), X(3, 8)],
        kingPen: ['a8', 'b8'],
      },
    ),
    // L7 — THE CLOSED HEDGE. The first finale, and the shape the last four
    // levels all wear. Hedge b-g with the flanks walled (a6/a7/h6/h7); above
    // it the CROWN — a pawn on every rank-8 square but his two — which
    // defends the whole back row and re-seals any file drained by hand; and
    // in front of his door, STUMPS on d7/e7, so the two files that point
    // straight at him can never open at all. The way in is sideways: blow
    // c6+c7 out with one blast (dragon on d5), take the crown pawn on c8,
    // step along rank 8 while he is stunned.
    make(
      7,
      [
        ...ROW6(2, 3, 4, 5, 6, 7),
        ...ROW7(2, 3, 6, 7),
        ...CROWN(1, 2, 3, 6, 7, 8),
        pawn(8, 3), pawn(8, 4), pawn(8, 5),
        bishop(2, 2),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: [X(1, 6), X(1, 7), X(8, 6), X(8, 7), ...STUMPS(4, 5)],
        kingPen: ['d8', 'e8'],
      },
    ),
    // L8 — THE FAR CORNER. Same wall, his room moved to the a8/b8 corner
    // with its floor stumped (a7/b7). The c-file is the only door in the
    // building and the crown pawn on c8 is its handle: park the dragon on d5,
    // detonate, and c6/c7 come out together. Two knights work the approach.
    make(
      8,
      [
        ...ROW6(2, 3, 4, 5, 6, 7, 8),
        ...ROW7(3, 4, 5, 6, 7, 8),
        ...CROWN(3, 4, 5, 6, 7, 8),
        pawn(8, 3), pawn(8, 4), pawn(8, 5),
        knight(7, 3),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [X(1, 6), ...STUMPS(1, 2)],
        kingPen: ['a8', 'b8'],
      },
    ),
    // L9 — WALL TO WALL. The hedge runs a-h, the crown runs a8-f8, and he is
    // in the corner behind stumps on g7/h7: no flank, no straight file, one
    // door (f8). The bomb has to sit on e5 or g5 — anywhere else and the hole
    // opens in a wall instead of the door.
    make(
      9,
      [
        ...ROW6(1, 2, 3, 4, 5, 6, 7, 8),
        ...ROW7(1, 2, 3, 4, 5, 6),
        ...CROWN(1, 2, 3, 4, 5, 6),
        pawn(1, 3), pawn(1, 4), pawn(1, 5),
        bishop(2, 2),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: [X(8, 6), ...STUMPS(7, 8)],
        kingPen: ['g8', 'h8'],
      },
    ),
    // L10 — THE CROWN OF THORNS. Wall-to-wall hedge, a crown of six, a queen
    // on the low bank, TWO enemies a turn and eight moves — the thicket walks
    // at her while she works, and every square she wants to stand on is one
    // pawn-step from being covered. Stand on b4, grow the dragon on c5,
    // detonate: b6 and b7 come out, he is stunned two turns, and the b-file
    // runs from her feet to the crown pawn on b8 with his door beside it.
    make(
      10,
      [
        ...ROW6(1, 2, 3, 4, 5, 6, 7, 8),
        ...ROW7(1, 2, 5, 6, 7, 8),
        ...CROWN(1, 2, 5, 6, 7, 8),
        pawn(8, 3), pawn(8, 4), pawn(8, 5),
        queen(7, 2),
        king(3, 8),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 6,
        hazards: [...STUMPS(3, 4)],
        kingPen: ['c8', 'd8'],
      },
    ),
  ],
};

export default RUN_REVENGE_17;
export { RUN_REVENGE_17 };
