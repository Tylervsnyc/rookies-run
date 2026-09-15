/**
 * revenge-18 — THE GLASSHOUSE. Built 2026-09-05 around the pair
 * freeze-ray + vanguard ("pin-and-parachute"). Kit = freeze-ray / vanguard /
 * poison-dart (3 cards since 2026-09-15; magnet dropped). `allowedAbilities`
 * IS the daily kit.
 *
 * CONSTANT SIGNATURE: he lives inside a GLASSHOUSE — a box of glass around his
 * corner of the board — and every level is a question about SIGHTLINES
 * through it. L1-L6 the box has a pane and something is watching it. L7-L10
 * the box is sealed: no rook line reaches him, so a body has to go over the
 * glass, and the question is what the freeze is FOR.
 *
 * ── 2026-09-15 VARIETY REWORK (Tyler played it: 3 stars, "pretty perfect") ──
 * What he said: glad he started with Freeze Ray; L1-L4 were the same thing
 * every time (freeze the king, take him); L5-L6 good; L7 the highlight ("drop
 * the knight and freeze the king — really fun"); L8 was L7 moved two squares
 * with the same knight path; L9 Vanguard alone solved it; L10 cleared. The
 * data agreed: L3/L4/L5 were one freeze cell mirrored, and L7-L10 were all
 * "freeze, drop the knight on rank 5, hop to rank 7".
 *
 * THE ARC NOW
 *   L1  THE PANE (no card needed). The pane is at the TOP of the wall, so the
 *       rook takes him from across the rank. A bishop watches the obvious
 *       square; freeze it, or stand one square further away.
 *   L2  THE FIRST EYE (no card needed). Mirrored; a knight covers two of the
 *       squares on the rank. Pick the square it cannot see, or freeze it.
 *   L3  HE MOVES — freeze the KING. First fleeing king: a diagonal two-square
 *       room no rook square sees both halves of.
 *   L4  THE WATCHMAN — freeze the GUARD, not the king. He cannot move at all;
 *       the one square that sees him (c5) is covered by a sealed pawn. Freezing
 *       him does nothing — the pawn takes you. Freeze the pawn. (Vanguard and a
 *       slow poison are second answers, so nobody who picked otherwise at L1
 *       is stranded.)
 *   L5  THE LONG ROOM — freeze the king while a bishop hunts you (unchanged).
 *   L6  THE PARACHUTE — vanguard alone, the hinge (unchanged).
 *   L7-L10, four different questions of the same pair (all combo-gated):
 *   L7  THE SILL (kept — Tyler's model). Freeze the KING; the knight is thrown
 *       from BELOW a stone shelf into a pocket and walks b5->c7->a8.
 *   L8  THE DOORMAN. Freeze the DEFENDER, not the king. The one square that
 *       attacks h8 holds a pawn (g6), and h7 defends it. The knight takes g6 —
 *       that capture STUNS him, so he cannot step to g8 — and h7 would take the
 *       knight back. Freeze h7, take g6, take him. Freezing the king instead
 *       loses the knight.
 *   L9  THE CORK. Freeze the king LATE. Rank 5 is a solid glass floor with one
 *       pawn stuck in it (c5), and that pawn watches b4/d4. The only way to b7
 *       (the one square that attacks d8) runs THROUGH c5: throw the knight on
 *       his file (d3), take the cork, then pin him as the knight lands on b7 —
 *       nothing in the world attacks e8, so an unpinned king just steps over.
 *   L10 THE TALL ROOM (kept). His room is a column (a7/a8), the pocket d5 is
 *       sealed, d5->c7 is the only way in and NOTHING attacks a7. One step up
 *       and the level is over, with a knight hunting her at two enemies a turn.
 *
 * THE RULES THAT CAME OUT OF THE REWORK (engine as of 2026-09-15)
 *  1. A knight dropped ON a square that attacks the king takes him the SAME
 *     turn: the drop is free and the knight's first move is the capture, so
 *     he never gets an enemy turn to run. Every square that attacks his room
 *     must be out of drop range from every square Rookie can stand on. L9's
 *     first builds leaked 69-100% to vanguard alone through exactly this (d5
 *     and h5 were two squares from f7).
 *  2. VANGUARD IS CAPPED AT T1 (`abilityTierCaps`). T2 widens the drop to 3
 *     squares, which reaches the kill square directly on L7 (vanguard:2 alone
 *     = 100%) — that is the "Vanguard alone solved L9" Tyler saw, holding T2.
 *  3. With poison-dart in the kit a rook-kill finale is a trap for the
 *     designer: any single enemy piece whose death opens the rook's line also
 *     STUNS the king for the turn she steps onto it (poison death, or a pawn
 *     baited onto the line and recaptured). Three rook-kill builds of L9 leaked
 *     25-100% to poison or vanguard alone. Two sealed pawns can never both
 *     watch one line square either — their forward squares land on the line
 *     or the corridor. So all four finales are knight-kills.
 *  4. The bot is a rollout search: a pre-emptive freeze (freeze the watcher a
 *     turn before you need it) and a knight walk of 3+ hops from a drop zone
 *     that is not the nearest square to the king both read ~0-6% while the
 *     solver proves them. L9 went 6% -> 81% by glassing the equidistant rank-3
 *     squares so the only nearest safe squares are in range of the drop.
 *  5. MOVE_LIMIT_FLOOR = 6: a moveLimit under 6 in this file is a comment.
 *
 * KIT ROLES
 *   freeze-ray  — KEY L3 L4 L5 and half of every finale; the finale asks it to
 *                 hit the king (L7, L9, L10) or the defender (L8). TRAP on L6.
 *   vanguard    — KEY L6, half of every finale, second answer on L3/L4.
 *   poison-dart — KEY nowhere. Slow second answer on L4. Every finale reads 0%:
 *                 no dart may touch the king and every finale is a knight-kill.
 * boulder / magnet / knight-hop / bishop-step / become-king are absent: stones
 * seal a house built of walls, and the rest are universal solvents.
 *
 * MEASURED 2026-09-15 (local, 16 trials/cell, T5, Normal, jobs=2 — direction;
 * the graded numbers are the GitHub nightly for rung 2 on this branch):
 *    L     none  freeze  vanguard  poison | pair T1  pair freeze:2 (arrival)
 *    1     100%   100%     100%     100%  |  100%     100%
 *    2     100%   100%     100%     100%  |  100%     100%
 *    3      25%   100%      75%      13%  |  100%     100%
 *    4       0%    94%     100%     100%  |  100%     100%
 *    5      69%   100%      75%      56%  |  100%     100%
 *    6       0%     0%     100%       0%  |  100%     100%
 *    7       0%     0%       0%       0%  |   81%      81%
 *    8       0%     0%       0%       0%  |   88%     100%
 *    9       0%     0%       0%       0%  |   81%      69%
 *   10       0%     0%       0%       0%  |   69%      56%
 * GATE holds on every finale level (every single card and no-ability 0%,
 * also freeze-ray:2 alone 0%). Solver proves the pair on L7 (W3), L8 (W3),
 * L9 (W4), L10 (W4). Quick-audit signatures: L7 vanguard@far>freeze-ray@king,
 * L9 vanguard@line>freeze-ray@king, L10 vanguard@diag>freeze-ray@king, L8's
 * line freezes the h7 defender. Still open: SCALE (2.1 pieces/level, the
 * contract wants 3.6).
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

/** The FINISHERS every Revenge offer slate carries (mirrors runs.ts). */
const REVENGE_CORE: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

const NAME = (c: Coord): string => `${'abcdefgh'[c.file - 1]}${c.rank}`;

/** A pane of glass running up file `f`, ranks `r0`-`r1`. */
const GLASS_F = (f: number, r0: number, r1: number): Coord[] => {
  const out: Coord[] = [];
  for (let r = r0; r <= r1; r++) out.push(X(f, r));
  return out;
};

/** A pane of glass running along rank `r`, files `f0`-`f1`. */
const GLASS_R = (r: number, f0: number, f1: number): Coord[] => {
  const out: Coord[] = [];
  for (let f = f0; f <= f1; f++) out.push(X(f, r));
  return out;
};

/** Cut the PANES out of a run of glass — the squares that are missing. */
const PANE = (glass: Coord[], ...panes: string[]): Coord[] =>
  glass.filter((c) => !panes.includes(NAME(c)));


/** The west house — king a8, room a8/b8, stone b5, kill square c7. */
const WEST_HOUSE: ReadonlyArray<Coord> = [
  X(5, 5), X(5, 6), X(5, 7), X(5, 8),
  X(4, 5), X(3, 5), X(1, 5),
  X(2, 4),
  X(4, 7), X(2, 6), X(1, 6),
];

/**
 * L7's house — the WEST house with the buttress under b5 widened into an
 * unbroken SILL, a4-d4. It changes exactly one thing and that thing is the
 * level: the square Rookie naturally walks to, the one facing the room, is
 * stone, and so is the corner. b5 is still the only pocket a knight can be
 * dropped into, but the only squares left in range of it are on the rank
 * BELOW the sill. You cannot throw the knight from where you want to stand.
 */
const WEST_SILL: ReadonlyArray<Coord> = [
  ...WEST_HOUSE,
  X(1, 4), X(3, 4), X(4, 4),
];

/**
 * L10's house — the same glasshouse built TALL. His room is a COLUMN, a7/a8,
 * not a shelf; the pocket d5 is sealed on all four sides; and the corridor
 * out of it is one-way. d5 -> c7 is the only knight step that enters the
 * house at all, c7 is the only square that attacks a8, and NOTHING in the
 * world attacks a7. If he takes the step up, the level is over.
 */
const TALL_HOUSE: ReadonlyArray<Coord> = [
  X(1, 5), X(2, 5), X(3, 5),
  X(1, 6), X(2, 6), X(3, 6),
  X(3, 4), X(4, 4), X(4, 6), X(4, 7), X(4, 8),
  X(5, 5), X(5, 6), X(5, 7), X(5, 8),
  X(2, 4), X(6, 4),
];

const RUN_REVENGE_18: RunDef = {
  id: 'revenge-18',
  signaturePair: ['freeze-ray', 'vanguard'],
  name: 'The Glasshouse',
  blurb: 'One room, one window. Something is watching the window.',
  allowedAbilities: ['freeze-ray', 'vanguard', 'poison-dart'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  abilityTierCaps: { vanguard: 1 },
  offerCore: REVENGE_CORE,
  offerCoreMin: 2,
  levels: [
    // L1 — THE PANE (no card needed). Still king h8 in a glass box: floor
    // f6-h6, wall e6-e7, and the pane is e8 at the TOP of the wall. Any square
    // on rank 8 to the west sees straight through it. The bishop on a5 watches
    // d8, the obvious square; stand on a8-c8 instead, or freeze the eye.
    make(
      1,
      [bishop(1, 5), king(8, 8)],
      {
        ...STILL,
        moveLimit: 8,
        hazards: [...GLASS_R(6, 6, 8), ...GLASS_F(5, 6, 7)],
      },
    ),
    // L2 — THE FIRST EYE (no card needed). The house mirrored: king a8, floor
    // a6-c6, wall d6-d7, pane d8. The knight on g6 covers f8 and h8 — two of
    // the four squares that see through the pane. Take e8 or g8, or freeze it.
    make(
      2,
      [knight(7, 6), king(1, 8)],
      {
        ...STILL,
        moveLimit: 9,
        hazards: [...GLASS_R(6, 1, 3), ...GLASS_F(4, 6, 7)],
      },
    ),
    // L3 — HE MOVES (freeze KEY). First fleeing king, and the first thing this
    // house teaches about him: his room is TWO squares and they sit on a
    // DIAGONAL — f7 and g8 — with f8 and g7 glassed between them. No rook
    // square in the world sees both. Come up the f-file through the window f5
    // and f6 looks straight at f7; he simply steps to g8, and g8 has no line
    // into it at all. Chasing is not a plan. FREEZE him where he stands and
    // the step he was going to take never happens: f6, then take him.
    make(
      3,
      [king(6, 7)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [
          X(4, 6), X(4, 7), X(4, 8),
          X(5, 5), X(5, 6), X(5, 7), X(5, 8),
          X(7, 5), X(8, 5),
          X(6, 8), X(7, 7), X(8, 6),
        ],
        kingPen: ['f7', 'g8'],
      },
    ),
    // L4 — THE WATCHMAN (freeze the GUARD). He cannot move (pen c7 only). The
    // one square that sees him is c5 (c6 is glass-locked above it, c4 below),
    // and the sealed pawn d6 covers c5. Freeze HIM and the pawn takes you; freeze
    // the pawn and take him. A knight hunts her on the floor. Second answers:
    // a drop on b5/e6, or a slow poison on d6.
    make(
      4,
      [pawn(4, 6), knight(7, 3), king(3, 7)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [X(3, 4), X(4, 5), X(2, 6), X(2, 7), X(4, 7), X(3, 8)],
        kingPen: ['c7'],
      },
    ),
    // L5 — THE LONG ROOM (freeze KEY). Same diagonal cell, slid into the
    // middle: king e7, second square f8, window e5 — and this time the h-file
    // is open, so there IS a second line at him (h8 sees f8 across the empty
    // g8). Two lines, and he only ever stands on one of them: walking from one
    // to the other is four moves and he moves for free. A bishop on c2 hunts
    // her while she works it out. The freeze is still the answer; the level is
    // about noticing that the second line is a decoy.
    make(
      5,
      [bishop(3, 2), king(5, 7)],
      {
        ...FLEE,
        moveLimit: 5,
        hazards: [
          X(3, 6), X(3, 7), X(3, 8),
          X(4, 5), X(4, 6), X(4, 7), X(4, 8),
          X(6, 5), X(7, 5),
          X(5, 8), X(6, 7), X(7, 6),
        ],
        kingPen: ['e7', 'f8'],
      },
    ),
    // L6 — THE PARACHUTE (vanguard KEY, freeze TRAP). The pane g6 is still
    // there, but g7 above it is glass too: you can stand IN the window and you
    // still cannot pass. Nothing here is watching you, so a freeze has no
    // target worth spending — the WALL is the problem. The room (f7/f8/g8/h7)
    // cannot be entered by any rook line at all. Drop the knight over the
    // glass onto f7 and let it take him. This is the run's hinge.
    make(
      6,
      [knight(3, 4), pawn(7, 3), king(8, 8)],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: [...PANE(GLASS_R(6, 6, 8), 'g6'), ...GLASS_F(5, 6, 8), X(7, 7)],
        kingPen: ['h8'],
      },
    ),
    // L7 — THE SILL. From here the glasshouse has NO pane at all: the box is
    // sealed, no rook line on the board reaches inside it, so the rook is out
    // of the game and a body has to go over the glass. b5 is the pocket — a
    // square walled on all four sides that no rook can ever stand on — and the
    // corridor out of it is b5->c7, the one square in the world that attacks
    // a8. What this level adds to that is the SILL: the buttress under the
    // house is now an unbroken shelf a4-d4, so the square Rookie wants to
    // stand on (the one facing the room) and the corner beside it are stone.
    // The only squares left within a Vanguard throw of the pocket are on the
    // rank below the sill. DEMAND: you cannot throw the knight from where you
    // want to stand. She gets a LONGER clock than the old build (7 -> 9) and
    // it is still the hardest thing in the run so far — the shape did that,
    // not the timer.
    make(
      7,
      [king(1, 8)],
      { ...FLEE, moveLimit: 9, hazards: [...WEST_SILL], kingPen: ['a8', 'b8'] },
    ),
    // L8 — THE DOORMAN (freeze the DEFENDER). Sealed corner box: king h8, pen
    // g8/h8. The ONLY square that attacks either one is g6, and a pawn stands
    // on it (glass g5 under it); h7 defends it (glass h6). Throw the knight to
    // e5/f4/h4 and take g6 — the capture stuns him, so he cannot step to g8 —
    // and FREEZE h7 in the same turn, or it takes the knight back. Then take
    // him. The trap is the L7 habit: freeze the king, and h7 eats the knight.
    make(
      8,
      [pawn(7, 6), pawn(8, 7), king(8, 8)],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: [X(7, 5), X(6, 6), X(8, 6), X(6, 7), X(5, 7), X(6, 8)],
        kingPen: ['h8', 'g8'],
      },
    ),
    // L9 — THE CORK (freeze the king LATE). Glass box d8/e8; nothing can
    // attack e8 (c7 d6 f6 g7 glass), and the only square that attacks d8 is b7.
    // Rank 5 is a solid glass floor with ONE pawn stuck in it on c5 — it covers
    // b4 and d4, the nearest squares to him. b7 is reached only through c5, and
    // c5 only from d3. Throw the knight onto his file (d3), take the cork, and
    // pin him the turn the knight lands on b7: a free king steps to e8 and a
    // lone knight can never reach him there. Rank 3 east of e3 is glass so the
    // nearest safe squares are the ones in range of d3.
    make(
      9,
      [pawn(3, 5), king(4, 8)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [
          X(3, 8), X(6, 8), X(4, 7), X(5, 7),
          X(3, 7), X(4, 6), X(6, 6), X(7, 7),
          X(3, 6), X(5, 6), X(6, 7), X(1, 6),
          X(1, 5), X(2, 5), X(4, 5), X(5, 5), X(6, 5), X(7, 5), X(8, 5),
          X(3, 4), X(1, 4), X(5, 4), X(6, 4), X(7, 4), X(8, 4),
          X(2, 3), X(6, 3), X(7, 3), X(8, 3),
        ],
        kingPen: ['d8', 'e8'],
      },
    ),
    // L10 — THE TALL ROOM (kept). His room is a column, a7/a8. The pocket d5
    // is sealed on all four sides, d5->c7 is the only knight step into the
    // house, c7 is the only square that attacks a8, and NOTHING attacks a7.
    // One step up the column and the level is over. DEMAND: the pin has to be
    // right the first time, with a knight hunting her at two enemies a turn.
    make(
      10,
      [knight(7, 4), king(1, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 7,
        hazards: [...TALL_HOUSE],
        kingPen: ['a8', 'a7'],
      },
    ),
  ],
};

export { RUN_REVENGE_18 };
export default RUN_REVENGE_18;
