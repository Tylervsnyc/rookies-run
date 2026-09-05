/**
 * revenge-16 — THE SWITCHBACK. Built 2026-09-05 for the daily kit
 * poison-dart / bishop-squire / magnet / rabies-dart (`allowedAbilities` IS
 * the kit).
 *
 * Signature pair: POISON DART + BISHOP SQUIRE ("free-capture-stun" in
 * data/run-playtest/pair-hypotheses.json). Poison is the only card in the
 * game that kills on a CLOCK: you throw it for free, three enemy turns pass,
 * and the death is credited to Rookie. The Bishop Squire is the body that
 * needs exactly that — it appears beside her as a free action and moves the
 * same turn, so it can only ever strike down a line that is ALREADY open.
 * The question every finale asks is not WHICH card but WHEN: throw the dart
 * before you start walking, or the fuse burns out with the corridor still
 * plugged.
 *
 * CONSTANT SIGNATURE — TWO BARS, OFFSET. Rank 3 and rank 6 are solid walls
 * of stone with a small opening in each, and the two openings sit on
 * different sides of the board. Not a single band (The Moat's water on rank
 * 5) and not a field of columns (The Colonnade's pillars) — a staircase with
 * one landing per flight. A rook never travels in a straight line here: she
 * runs the rank-1 highway to the low landing, climbs, and crosses back along
 * ranks 4-5 to reach the high one. Every level charges her moves just to
 * arrive, which is why the clock is the scarce thing and why a dart thrown
 * late is a dart wasted.
 *
 * The second half of the signature is what makes the pair NECESSARY on
 * L7-L10. The king's room is a two-square DIAGONAL sealed in stone — no rook
 * line reaches either square (the files are plugged by the rank-6 bar, the
 * ranks and the back rank by walls), so Rookie herself can never take him no
 * matter how many stuns she buys. The only way in is the long diagonal that
 * runs out of his room, through the rank-6 landing, down to ranks 4-5: a
 * CORRIDOR. And the rank-6 landing — the one square of that corridor a piece
 * could stand on — is occupied by a pawn. It can never march (stone beneath
 * it), no rook line or magnet line reaches it (stone on its file and its
 * rank), and the only diagonals into it are stone or squares it attacks,
 * with a second pawn backstopping it on rank 7. Nothing on Rookie's side can
 * capture that pawn. A dart is the one thing on the board that touches it.
 * Poison it, take your post at the mouth of the corridor, and the turn it
 * dies summon the Squire into the corridor: his first move is the king.
 *
 * Kit roles (measured, not guessed — see MEASURED below):
 *   poison-dart   — KEY on L4 (the stone bishop nothing else can reach), L6,
 *                   and on ALL FOUR finales as half the pair. TRAP on L1-L3
 *                   (nothing worth killing and the fuse outlasts the level)
 *                   and on L5, where killing anything still leaves a corner
 *                   no rook can ever enter.
 *   bishop-squire — KEY on L5 (the diagonal cell, where Rookie is not the
 *                   winning piece) and on L7-L10 as the other half. TRAP on
 *                   L1-L3 and L6: the rook already has the line, or the body
 *                   arrives before the guard is gone and the guard eats it.
 *   magnet        — TRAP on all ten levels, deliberately. It is the card
 *                   that looks like the answer and reaches nothing: its pull
 *                   line is Rookie's own rook line, and every lock in this
 *                   run — L4's corner bishop, L6's, and all four corridor
 *                   pawns — sits behind stone on both its file and its rank.
 *                   Its best reading anywhere is 31% (L5, by accident).
 *   rabies-dart   — KEY on L4 and L6: the stone bishop's ONLY legal move is
 *                   its own pawn, so the madness eats the key for you on the
 *                   next turn where poison takes three. TRAP everywhere
 *                   else, and an active liability beside a summon — a rabid
 *                   piece attacks whatever is nearest, and near the wall
 *                   that is your own Squire.
 *
 * L7-L10, the line for each (all four are the same lock in four corners):
 *   L7  THE NARROW LANDING — room c7/b8, corridor b8-c7-d6-e5-f4, guard pawn
 *       on d6 (stone at d5, backstop e7). Landings f/g low, d high. Dart d6,
 *       climb the f-file to f5, post beside f4, summon f4 the turn it dies.
 *   L8  THE CENTRE LANDING — room d8/e7 in the MIDDLE of the back rank, not
 *       a corner. Corridor d8-e7-f6-g5-h4, guard pawn f6 (stone at f5,
 *       backstop g7). Landings h low, f high — the longest walk of the four.
 *   L9  THE FAR LANDING — room b7/a8, corridor a8-b7-c6-d5-e4, guard pawn c6
 *       (stone at c5, backstop d7). Landings f/g low, c high; one move to
 *       her post, so the whole level is the timing of the dart.
 *   L10 THE LAST LANDING — room g7/h8, corridor h8-g7-f6-e5-d4, guard pawn
 *       f6 (stone at f5, backstop e7). Landings c low, f high, and a knight
 *       on f4 working the squares she needs. Dart f6, run rank 1 to c1,
 *       climb to c4, summon d4 as it dies, and the Squire slides the whole
 *       corridor onto him.
 *
 * MEASURED (2026-09-05, `revenge.ts matrix --difficulty=normal`, 16-32
 * trials/cell). Finale L7-L10: no-ability 0%, poison alone 0%, squire alone
 * 0%, magnet 0%, rabies 0% — every single card in the kit reads ZERO on all
 * four, at 32 trials/cell. The PAIR reads 100 / 63 / 100 / 100. L1-L3 are free (100%
 * with no ability). L4 none 0% / poison 69% / rabies 100% / squire 6%. L5
 * none 0% / squire 100% (the level the Squire is for). L6 none 0% / rabies
 * 69% / poison 31%. Full runs (40 each, Normal): 18% clear with random
 * picks from the kit, 33% when the player draws only poison+squire — pick
 * wrong and the run ends at L7, which is the point. Calibrated against The
 * Moat (singles 0% on its finale, pair 79-100%) and The Colonnade (12%
 * random full runs, 55% on the pair).
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

const FILES = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * The signature: rank 3 and rank 6 are walls with one opening each, and the
 * openings sit on opposite sides. `STAIR([7, 8], [3])` = climb on the right,
 * cross back, climb again on the c-file.
 */
const STAIR = (lowGaps: number[], highGaps: number[]): Coord[] => [
  ...FILES.filter((f) => !lowGaps.includes(f)).map((f) => X(f, 3)),
  ...FILES.filter((f) => !highGaps.includes(f)).map((f) => X(f, 6)),
];

const RUN_REVENGE_16: RunDef = {
  id: 'revenge-16',
  name: 'The Switchback',
  blurb: 'Two walls, offset. He thinks you have time.',
  allowedAbilities: ['poison-dart', 'bishop-squire', 'magnet', 'rabies-dart'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: ['surge', 'freeze-ray', 'knight-hop', 'bishop-step', 'queen-pulse'],
  offerCoreMin: 2,
  levels: [
    // L1 — THE FIRST TURN. Still king b8. Low landing on the right (f/g/h),
    // high landing on the left (a/b/c): run the rank-1 highway, climb to
    // rank 5, run BACK across, climb the b-file. Key b7 on his file, and the
    // shell d7/f7 is stone-bound (rank 6 under them). Four moves, and the
    // shape of all ten levels in one picture.
    make(
      1,
      [
        pawn(2, 7),
        pawn(4, 7), pawn(6, 7),
        king(2, 8),
      ],
      { ...STILL, moveLimit: 8, hazards: STAIR([6, 7, 8], [1, 2, 3]) },
    ),
    // L2 — THE SECOND TURN. Mirror image, and the first level that punishes
    // the obvious. Still king g8; key g7 sits on his file but pawn h8 holds
    // it — take it and you are taken. The h-file is the honest road: climb
    // the h landing to h7, take h8 (nothing defends the corner), then along
    // rank 8. Count the moves before you pick a landing.
    make(
      2,
      [
        pawn(7, 7), pawn(8, 8), pawn(5, 7),
        king(7, 8),
      ],
      { ...STILL, moveLimit: 9, hazards: STAIR([1, 2, 3], [6, 7, 8]) },
    ),
    // L3 — THE STUN. First flee king: b8 on a rank-8 strip a8-c8 (wall d8).
    // He steps away from any rook line — so the lesson is that a CAPTURE
    // freezes him for a turn. Climb the right landing, run rank 5 to a5,
    // ride the a-file to a7, take b7 (stun), take him. Knight e4 hunts.
    make(
      3,
      [
        pawn(2, 7), pawn(3, 7),
        knight(5, 4),
        king(2, 8),
      ],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: [...STAIR([7, 8], [1, 2]), X(4, 8)],
        kingPen: ['a8', 'b8', 'c8'],
      },
    ),
    // L4 — THE FUSE. King g8 in a corner room g8/h8 (walls f8/h7). Key g7
    // stands on his file and a BISHOP on h8 holds it — a bishop in the
    // corner whose only diagonal is blocked by its own pawn, so it never
    // moves and never leaves the post. No rook line and no magnet line
    // reaches h8 (h7 is stone, rank 8 runs through his room): a dart is the
    // only thing on the board that can touch it. Poison it on move one,
    // walk the switchback to f7, take the key as it dies (stun), take him
    // before he reaches the corner. Rabies does it faster and dirtier — the
    // bishop's ONLY legal move is its own pawn. The Squire works too: f7 is
    // the one square that sees g8, and the bishop is standing in his exit.
    make(
      4,
      [
        pawn(7, 7), bishop(8, 8),
        knight(3, 4),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: [...STAIR([1, 2], [6]), X(8, 7), X(6, 8)],
        kingPen: ['g8', 'h8'],
      },
    ),
    // L5 — THE DIAGONAL CELL. King f7 in a cell that is a DIAGONAL (f7/g8;
    // walls f8/g7/h7/h8). No rook line ever reaches g8, so every stun in the
    // world is worthless — she can chase him off f7 forever and never take
    // him. A LIGHT bishop on e6 covers f7 and g8 both: summon the Squire on
    // the light squares beside her and walk him to e6. KEY = bishop-squire,
    // and the first level where Rookie herself is not the winning piece.
    make(
      5,
      [
        pawn(3, 7),
        knight(3, 4),
        king(6, 7),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [...STAIR([1, 2], [5, 6]), X(6, 8), X(7, 7), X(8, 7), X(8, 8)],
        kingPen: ['f7', 'g8'],
      },
    ),
    // L6 — THE MADNESS. The L4 lock mirrored — key b7, stone bishop a8
    // standing in his own exit, wall a7 — but seven moves instead of eight,
    // and that is the whole level. The dart's fuse is three turns and it
    // barely fits. Three faster things do: RABIES on the bishop (its only
    // legal move is its own pawn, so the madness eats the key for you on the
    // very next turn), MAGNET on b7 (drag it down the open b-file off the
    // bishop's diagonal and take it in open ground), or a poison thrown
    // before the first step. Knight f4 hunts the crossing — and keeps b7
    // from wandering down the file on its own.
    make(
      6,
      [
        pawn(2, 7), bishop(1, 8),
        knight(6, 4),
        king(2, 8),
      ],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [...STAIR([7, 8], [3]), X(1, 7), X(3, 8)],
        kingPen: ['a8', 'b8'],
      },
    ),
    // L7 — THE NARROW LANDING. King c7 in a two-square diagonal room c7/b8
    // (walls b7/d7/a7/a8/c8/d8, and the rank-6 bar plugs both files): no rook
    // line reaches either square, ever, so no number of stuns puts Rookie on
    // him. Exactly one square covers both — d6, the third step of the
    // b8-c7-d6 diagonal — and a PAWN IS STANDING ON IT. It can never march
    // (d5 is stone) and nothing on Rookie's side can ever capture it: her
    // file into it is stone, her rank into it is stone, and the only
    // diagonals that reach it are e5 (stone) and c5 (a square the pawn
    // itself attacks, with e7 backstopping). A dart is the one thing on the
    // board that touches d6. Throw it, cross the left landing, wait it out
    // on b5, step onto c5 the turn it dies, and summon INTO the hole it
    // left: the Squire appears on d6 and takes him before he can react.
    make(
      7,
      [
        pawn(4, 6), pawn(5, 7),
        knight(8, 2),
        king(3, 7),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [
          ...STAIR([6, 7], [4]),
          X(2, 7), X(4, 7), X(1, 7), X(1, 8), X(3, 8), X(4, 8), X(6, 7),
          X(4, 5),
        ],
        kingPen: ['c7', 'b8'],
      },
    ),
    // L8 — THE CENTRE LANDING. Same lock, no corner: his room is d8/e7 in
    // the MIDDLE of the back rank (walls c7/c8/e8/f8/d7/f7 and the bar under
    // e6). The covering square is f6 on the d8-e7-f6 diagonal, and again a
    // pawn is standing on it, welded there by the stone at f5 and backstopped
    // by g7. Rookie's post is e5 — which is exactly one of the two squares
    // that pawn attacks, so she cannot even stand there until it is dead.
    // Dart it from across the board, ride rank 5 to d5, step up as it dies,
    // summon onto f6, and the Squire's first move is the king.
    make(
      8,
      [
        pawn(6, 6), pawn(7, 7),
        knight(1, 4),
        king(4, 8),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: [
          ...STAIR([8], [6]),
          X(4, 7), X(6, 7), X(3, 7), X(3, 8), X(5, 8), X(6, 8), X(8, 7),
          X(6, 5),
        ],
        kingPen: ['e7', 'd8'],
      },
    ),
    // L9 — THE FAR LANDING. King b7, room b7/a8 (walls a7/c7/b8/c8). The
    // covering square is c6 on the a8-b7-c6 diagonal; the guard pawn stands
    // on it, stone at c5 under it, pawn d7 behind it. Two enemies a turn and
    // NINE moves: the dart has to be thrown before the first step or the
    // fuse burns out with Rookie still on the wrong side of the wall. Her
    // landing is b5, one of the two squares the guard attacks — arrive early
    // and the pawn eats her; arrive late and the clock does.
    make(
      9,
      [
        pawn(3, 6), pawn(4, 7),
        knight(7, 4),
        king(2, 7),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: [
          ...STAIR([6, 7], [3]),
          X(1, 7), X(3, 7), X(2, 8), X(3, 8),
          X(3, 5),
        ],
        kingPen: ['b7', 'a8'],
      },
    ),
    // L10 — THE LAST LANDING. King g7 in the corner room g7/h8 (walls
    // f7/h7/g8/f8). Covering square f6 on the h8-g7-f6 diagonal, guard pawn
    // standing on it, stone at f5 and e5, pawn e7 behind it. The two
    // landings are as far apart as they get — h on rank 3, f on rank 6 — so
    // the walk is h1, h5, and only then across to g5, which is a square the
    // guard attacks: she cannot take her post until the poison has already
    // done its work, and the knight on f4 covers h5 and h3 the whole way up.
    // Two enemies a turn, ten moves, one line: dart the pawn on f6 on move
    // one, climb the h landing, step to g5 as it dies, summon into the hole
    // it left, take him.
    make(
      10,
      [
        pawn(6, 6), pawn(5, 7),
        knight(6, 4),
        king(7, 7),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: [
          ...STAIR([3], [6]),
          X(6, 7), X(8, 7), X(7, 8), X(6, 8),
          X(6, 5),
        ],
        kingPen: ['g7', 'h8'],
      },
    ),
  ],
};

export default RUN_REVENGE_16;
export { RUN_REVENGE_16 };
