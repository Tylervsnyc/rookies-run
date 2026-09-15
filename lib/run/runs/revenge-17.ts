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
 * KIT = dragon / sacrifice / poison-dart (`allowedAbilities` IS the kit;
 * 3 cards since 2026-09-15 — aegis dropped, Aegis lives on early rungs only,
 * which also removed the in-kit aegis+dragon finale bypass). No universal
 * solvents. The dart answers the SAME question the hedge asks ("this key is
 * defended") one guard at a time, and slowly, which is why it is a key on
 * L4/L5 and a helper on L8, and dies on the rest of the finale.
 *
 * KEY / TRAP per level:
 *   L1  none needed — walk around the end of the hedge.
 *   L2  none needed — one undefended plug on each flank; pick a side.
 *   L3  none needed — first fleeing king; walk into his room and close it.
 *   L4  poison-dart KEY (the a-file plug is defended once, from b7: kill
 *       the defender, then the plug is free). The dragon is the slow second
 *       answer; sacrifice alone has nothing to detonate.
 *   L5  poison-dart KEY (dart the h6 plug's defender or the knight on f8,
 *       then walk the h-file). The dragon also gets there. Measured with
 *       aegis gone (16 trials): none 31, dragon 100, sacrifice 63, dart 100.
 *   L6  dragon KEY, ALONE and only (a7/b7/c8 are walls: NO rook line ever
 *       reaches his corner, so the level cannot be walked — measured 0% for
 *       no-ability, sacrifice and the dart, 100% for the dragon). The roaming
 *       dark-squared bishop is GONE (Tyler 2026-09-15: it kept parking on the
 *       squares he wanted to summon from — a gotcha, not a decision).
 *   L7  PAIR — WHERE TO LAUNCH. Closed hedge b-g, crown above, stumps on
 *       d7/e7; stone on b5/c5/d5/g5 leaves f5 as the pad. Blast the right
 *       side open and STEP onto a stunned king. (Tyler's best level. Kept.)
 *   L8  PAIR — THE FAR DOOR. Same wall, his room in the a8/b8 corner, one
 *       door (c8). Dragon close, blast, slide in. (Tyler: "really hard".
 *       Kept untouched; the dart is a real helper here.)
 *   L9  PAIR — POINT-BLANK. A one-wide lane plugged by TWO stone-boxed
 *       bishops, each covered by a frozen knight. Take the one uncovered
 *       square in the gap (d4), grow the dragon in the lane, and blast
 *       THROUGH the first plug. Anything that bites a plug is taken back.
 *   L10 ALL THREE — CLEAR THE POST, THEN BLAST. King off every lane; one
 *       post (b6) that reaches the launch square, watched by a knight. Dart
 *       the knight, take the post, blow his diagonal, run the e-file.
 *       The hardest level on the ladder.
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
 * ── MEASURED 2026-09-15 (3-card kit, L7 launch pad, L9/L10 rebuilt) ──
 * `revenge.ts matrix --run=revenge-17 --levels=1-10 --loadouts=none,dragon,
 * sacrifice,poison-dart,dragon+sacrifice,dragon+sacrifice+poison-dart
 * --trials=16 --jobs=1`, T1 cards, Normal. 16 trials = roughly +/-20 points.
 *    L    none  dragon  sacrifice  dart  |  pair  kit(all 3)
 *    1    100    100      100      100  |  100   100
 *    2    100    100      100      100  |  100   100
 *    3     69    100       94      100  |  100   100
 *    4     38     81       44      100  |  100   100
 *    5     31    100       63      100  |  100   100
 *    6      0    100        0        0  |  100   100
 *    7      0      0        0        0  |   69    94
 *    8      0      0        0        0  |   94    94
 *    9      0      0        0        0  |   63    81
 *   10      0      0        0        0  |    0    56
 * GATE holds on every finale level (no single card clears one). The pair
 * mean over L7-L10 is 56.5, inside rung 10's 45-61 window. L10 is the only
 * level that needs all three cards. Winning lines (bot, pair + kit cells)
 * are four different shapes: L7 dragon@far>sacrifice@far | step; L8 split,
 * no line over 40%; L9 dragon@line>sacrifice@line | orth; L10
 * poison-dart>dragon@diag>sacrifice@diag | orth.
 * Full runs, local (24, Normal, 1 retry): 17/24. Arrival tiers in the sim
 * were all T1.
 * Before today (4-card kit with aegis, old L9/L10): pair 88/94/92/92, full
 * runs 73%, grade TOO EASY, human REPEAT L7 = L10.
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
 * The offer core. It used to be the global REVENGE finisher list (surge,
 * freeze-ray, ...) — none of which are in this run's kit, so the "at least
 * two core cards" guarantee could never be met and silently did nothing.
 * The core is now the signature pair: every slate carries at least one half
 * of it. With a 3-card kit and a 3-wide slate the L1 offer already shows the
 * whole kit; this keeps later refills from ever being dart-only.
 */
const SIGNATURE_PAIR: ReadonlyArray<string> = ['dragon', 'sacrifice'];

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
  signaturePair: ['dragon', 'sacrifice'],
  name: 'The Briar',
  blurb: 'He grew a hedge and called it a kingdom.',
  allowedAbilities: ['dragon', 'sacrifice', 'poison-dart'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: SIGNATURE_PAIR,
  offerCoreMin: 1,
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
    // free). Waiting for
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
    // never leave the post). KEY = poison-dart: kill the knight (or the
    // plug's defender) and walk in. The dragon is the other way through.
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
    // dragon, alone. The dart is a trap: there is no key to take. Nothing
    // on his side moves, so the summon squares are exactly what you see.
    make(
      6,
      [...HEDGE(4, 5, 6, 7, 8), pawn(4, 8), king(1, 8)],
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
    // straight at him can never open at all. The way in is sideways: stand
    // on f4, grow the dragon on f5 (the launch pad the stones leave), blow
    // out the right side of the hedge, climb to f8 and step onto him while
    // he is stunned.
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
        hazards: [
          X(1, 6), X(1, 7), X(8, 6), X(8, 7), ...STUMPS(4, 5),
          // The launch pad (2026-09-15). Stone on b5/c5/d5/g5 takes away the
          // left-side and far-right launch squares; f5 (the square Tyler
          // used) is the pad that works. Pair 94 -> 75, every single card
          // still 0 (16 trials).
          X(2, 5), X(3, 5), X(4, 5), X(7, 5),
        ],
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
    // L9 — THE THORN LANE. A stone row on rank 4 with ONE gap (d4), and
    // the lane above it plugged TWICE: bishops on d6 and d7, boxed in stone
    // so they can never step aside, each covered by a pair of frozen knights
    // (b7/f7 cover d6, b8/f8 cover d7). He sits on d8 at the top of the lane.
    // Anything that TAKES a plug is taken back. The dart kills one plug and
    // the other still stands. The question is point-blank: stand in the gap
    // on d4 (the one square nothing covers), grow the dragon on d5, and
    // detonate. Her blast reaches two squares up THROUGH the first bishop,
    // clears both plugs and both inner knights, and the file is open to him.
    make(
      9,
      [
        pawn(1, 5), pawn(2, 5), pawn(6, 5), pawn(7, 5), pawn(8, 5),
        pawn(1, 6), pawn(2, 6), pawn(6, 6), pawn(7, 6), pawn(8, 6),
        pawn(1, 7), knight(2, 7), bishop(4, 6), bishop(4, 7), knight(6, 7), pawn(7, 7), pawn(8, 7),
        pawn(1, 8), knight(2, 8), knight(6, 8), pawn(7, 8), pawn(8, 8),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: [
          X(1, 4), X(2, 4), X(3, 4), X(5, 4), X(6, 4), X(7, 4), X(8, 4),
          X(3, 5), X(5, 5), X(3, 6), X(5, 6), X(3, 7), X(5, 7), X(3, 8), X(5, 8),
        ],
        kingPen: ['d8'],
      },
    ),
    // L10 — THE CROWN OF THORNS. The hardest level on the ladder, and the
    // only one that needs all three cards. He has stepped OFF every lane:
    // king e8, behind two frozen pawn columns (d5-d7, e5-e7), d8 stone. The
    // only door into the building is the b-file, and the one post at its
    // top that can reach the launch square, b6, is watched by a KNIGHT on
    // a8. Every square a dragon could knight-jump onto him from is stone or
    // pawn, and every square beside him is too, so she can never take him
    // herself. The line: DART the knight first (it is the one guard that
    // moves, so it is a present threat, not a gotcha), take the post on b6,
    // grow the dragon on c6 — his long diagonal, behind the d7 pawn — and
    // detonate. The blast reaches him THROUGH d7, stuns him, and blows out
    // d7, d6, e6, e7 and e5; the rook runs b6-e6 and takes him up the e-file.
    // Dragon + sacrifice without the dart: the knight takes her on b6.
    make(
      10,
      [
        pawn(1, 5), pawn(3, 5), pawn(4, 5), pawn(5, 5), pawn(6, 5), pawn(7, 5), pawn(8, 5),
        pawn(1, 6), pawn(4, 6), pawn(5, 6), pawn(6, 6), pawn(7, 6), pawn(8, 6),
        pawn(4, 7), pawn(5, 7), pawn(7, 7), pawn(8, 7),
        knight(1, 8), pawn(3, 8), pawn(6, 8), knight(7, 8), pawn(8, 8),
        king(5, 8),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 6,
        hazards: [
          X(1, 4), X(3, 4), X(4, 4), X(5, 4), X(6, 4), X(7, 4), X(8, 4),
          X(1, 7), X(3, 7), X(6, 7), X(2, 8), X(4, 8),
        ],
        kingPen: ['e8'],
      },
    ),
  ],
};

export default RUN_REVENGE_17;
export { RUN_REVENGE_17 };
