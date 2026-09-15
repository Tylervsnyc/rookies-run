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
 *   L7-L10, four different questions of the same pair (all combo-gated and
 *   UPGRADE-PROOF — no tier caps, see rule 2):
 *   L7  THE BODYGUARD. The one square that attacks e8 (d6) holds a pawn; the
 *       pawn beside him (e7) defends it, and a bishop on f8 waits behind e7.
 *       Freeze e7 — it stays put and blocks the bishop — drop the knight, take
 *       d6 (the capture stuns him), take him.
 *   L8  THE CORNER GUARD. Two captures and the freeze comes LATE: take the
 *       cork e5 first, then freeze b7 (bishop a8 behind it) in the turn you
 *       take c6, then take d8.
 *   L9  THE FAR GUARD. The freeze comes FIRST and lands four files away: the
 *       cork e5 is guarded by d6 with a bishop behind on c7. Freeze d6, take
 *       e5, take g6, take h8.
 *   L10 DOWN HIS FILE. The guard is a bishop on d5, on the king's own file,
 *       with a second bishop on e4 behind it. Freeze d5, take c6, take d8 —
 *       at two enemies a turn with a knight hunting her on the floor.
 *
 * THE RULES THAT CAME OUT OF THE REWORK (engine as of 2026-09-15)
 *  1. A knight dropped ON a square that attacks the king takes him the SAME
 *     turn (the drop is free, its first move is the capture). And every
 *     capture by her side stuns him for the enemy turn, so a knight that
 *     arrives by capture also wins. The only things that stop a lone knight
 *     are a recapture, or a king who steps away from a non-capture arrival.
 *  2. NO TIER CAPS (Tyler, 2026-09-15: every ladder card upgrades to T5).
 *     Vanguard T2-T4 drops 3-4 squares and holds two charges from T3, so the
 *     first rework's finales fell to Vanguard alone at 83-100%. What holds:
 *     - a rank-3 glass FLOOR keeps Rookie on ranks 1-2, so the kill square
 *       is always far and always OCCUPIED (an undroppable square);
 *     - that pawn is defended by a STACK: a guard with a bishop behind it on
 *       the same diagonal. Freeze the guard and it blocks the bishop; take the
 *       pawn and the guard recaptures, then the bishop recaptures the second
 *       knight. Two charges are never enough;
 *     - every guard's knight squares and every pawn's capture squares are
 *       glass, so the stack cannot be picked off or BAITED off its post (L10
 *       leaked 42% to Vanguard T3 through a pawn lured onto b5).
 *  3. "Freeze the king while the knight walks in" (the old L7/L10) cannot be
 *     upgrade-proof AND findable: a T1 drop plus one hop reaches at most 4
 *     squares, which is exactly the T3-T4 drop radius. The floor version is
 *     solver-proven (W5-W6) and the bot reads it 0% even at T6.
 *  4. The bot is a rollout search: a knight walk of 3+ hops, or a pre-emptive
 *     freeze with no capture that turn, reads ~0% while the solver proves it.
 *     Every finale line here captures something every turn.
 *  5. MOVE_LIMIT_FLOOR = 6: a moveLimit under 6 in this file is a comment.
 *
 * KIT ROLES
 *   freeze-ray  — KEY L3 L4 L5 and half of every finale (the guard, never the
 *                 king, on L7-L10). TRAP on L6.
 *   vanguard    — KEY L6, half of every finale, second answer on L3/L4.
 *   poison-dart — KEY nowhere. Slow second answer on L4. Every finale reads 0%
 *                 even at T4: no dart may touch the king, and the rook never
 *                 gets past the floor.
 * boulder / magnet / knight-hop / bishop-step / become-king are absent: stones
 * seal a house built of walls, and the rest are universal solvents.
 *
 * MEASURED 2026-09-15 (local, 16 trials/cell, T5, Normal, jobs=2 — direction;
 * the graded numbers are the GitHub nightly for rung 2):
 *    L    none  freeze:4  poison:4  van  van:3  van:4 | pair T1  freeze:2+van:2
 *    7     0%      0%        0%     0%    0%     0%   |   88%       100%
 *    8     0%      0%        0%     0%    0%     0%   |   63%       100%
 *    9     0%      0%        0%     0%    0%     0%   |   38%        81%
 *   10     0%      0%        0%     0%    0%     0%   |   69%        81%
 * L1-L6 are not gated and only get easier with upgrades.
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


const RUN_REVENGE_18: RunDef = {
  id: 'revenge-18',
  signaturePair: ['freeze-ray', 'vanguard'],
  name: 'The Glasshouse',
  blurb: 'One room, one window. Something is watching the window.',
  allowedAbilities: ['freeze-ray', 'vanguard', 'poison-dart'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
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
      [bishop(2, 2), king(6, 7)],
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
      [bishop(3, 2), pawn(1, 4), king(5, 7)],
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
      [knight(3, 4), pawn(7, 3), pawn(2, 5), king(8, 8)],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: [...PANE(GLASS_R(6, 6, 8), 'g6'), ...GLASS_F(5, 6, 8), X(7, 7)],
        kingPen: ['h8'],
      },
    ),
    // L7 — THE BODYGUARD (freeze the guard at his side). See header.
    make(
      7,
      [pawn(4, 6), pawn(5, 7), bishop(6, 8), knight(1, 1), king(5, 8)],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: [
          ...GLASS_R(3, 1, 8),
          X(3, 5), X(5, 5),
          X(4, 5), X(5, 6),
          X(3, 7), X(6, 6), X(7, 7),
          X(4, 8), X(7, 8), X(3, 8), X(3, 6), X(6, 5), X(4, 7), X(8, 7),
        ],
        kingPen: ['e8'],
      },
    ),
    // L8 — THE CORNER GUARD (take the cork, then freeze late). See header.
    make(
      8,
      [pawn(5, 5), pawn(3, 6), pawn(2, 7), bishop(1, 8), king(4, 8)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [
          ...GLASS_R(3, 1, 8),
          X(2, 5), X(4, 5), X(6, 4),
          X(5, 4), X(3, 5), X(2, 6),
          X(1, 5), X(1, 7), X(2, 4), X(2, 8), X(4, 4), X(5, 7),
          X(4, 6), X(5, 6), X(6, 7), X(3, 7),
        ],
        kingPen: ['d8'],
      },
    ),
    // L9 — THE FAR GUARD (freeze first, three captures). See header.
    make(
      9,
      [pawn(7, 6), pawn(5, 5), pawn(4, 6), bishop(3, 7), king(8, 8)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [
          ...GLASS_R(3, 1, 8),
          X(8, 5), X(3, 5), X(4, 4),
          X(7, 5), X(5, 4), X(4, 5),
          X(6, 7), X(5, 7), X(6, 8), X(6, 4), X(8, 4),
          X(3, 4), X(3, 6), X(4, 7),
          X(2, 5), X(2, 7), X(3, 8), X(5, 8), X(6, 5),
          X(1, 6), X(1, 8), X(5, 6), X(2, 6), X(2, 8), X(4, 8),
        ],
        kingPen: ['h8'],
      },
    ),
    // L10 — DOWN HIS FILE (freeze the bishop, two enemies a turn). See header.
    make(
      10,
      [pawn(3, 6), bishop(4, 5), bishop(5, 4), knight(8, 1), king(4, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 7,
        hazards: [
          ...GLASS_R(3, 1, 8),
          X(2, 5),
          X(4, 2), X(6, 2),
          X(3, 5), X(3, 4), X(5, 6), X(6, 5),
          X(2, 4), X(2, 6), X(3, 7), X(5, 7), X(6, 4), X(6, 6),
          X(4, 6), X(7, 5), X(1, 5), X(1, 7), X(2, 8), X(5, 5),
          X(2, 7), X(6, 7),
        ],
        kingPen: ['d8'],
      },
    ),
  ],
};

export { RUN_REVENGE_18 };
export default RUN_REVENGE_18;
