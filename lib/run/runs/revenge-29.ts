/**
 * revenge-29 — THE CANDLE. Signature pair HOURGLASS + POISON DART ("let the fuse burn").
 * Kit = hourglass / poison-dart / magnet / aegis (`allowedAbilities` IS the
 * kit). Hourglass is at the TESTING stage, so this run is /playtest-only.
 *
 * ── READ THIS FIRST: THE GATE IS 3-OF-4, AND THE MISS IS STRUCTURAL ──
 * L7-L10 read 0% for no-ability, 0% for hourglass alone (at EVERY tier), 0%
 * for magnet alone and 0% for aegis alone, and 63-78% for the pair. That is
 * the combo-gate shape. But POISON-DART ALONE reads 75-78% on L7, L8 and L10
 * (13% on L9 only), so the "every single card <= 8%" contract is NOT met.
 * This is not a tuning failure — it cannot be met with this pair, and the
 * reason is worth more than the run. Four facts, all read out of the code:
 *
 *  1. A GLASS-TURN AND AN IDLE ROOKIE MOVE PRODUCE THE SAME NUMBER OF ENEMY
 *     PHASES. The glass's only measurable value is that it saves one MOVE.
 *     Count the two lines on L7: pair = dart, glass (phase 1), move (2),
 *     move (3 — the candle dies, he is stunned), move onto his file (4),
 *     capture = 4 moves / 4 phases. Poison alone = the same 4 phases and
 *     5 moves. Every hourglass level therefore lives or dies on ONE move of
 *     clock, and nothing else.
 *  2. `MOVE_LIMIT_FLOOR = 6` (lib/run/apply-difficulty.ts) clamps every
 *     authored `moveLimit` up to 6 the moment a difficulty is applied. The
 *     poison-alone line on any remote-stun level is 5 moves (3 fuse phases +
 *     a 2-move finish). A one-move gate would need `moveLimit: 5`. There is
 *     no legal clock between them: the gate the implementer asked for — "the
 *     fuse must be LONGER than the walk" — is exactly one move wide and the
 *     floor is one move above it.
 *  3. THE DART HAS NO LINE OF SIGHT AND NO TIMING RESTRICTION
 *     (`visibleEnemySquares` returns every piece on the board), so Rookie can
 *     always throw it LATE and sync the fuse to her arrival. Any level built
 *     so the fuse would burn out before she gets there is answered by
 *     darting three phases later, for free. You cannot author "too early".
 *  4. POISON FOLLOWS ITS PIECE. `applyAction` calls `relocateStatusMarkers`
 *     on every enemy move, so a marked piece carries the mark with it. (The
 *     Switchback's header says the opposite — "poison is keyed to the SQUARE,
 *     a marked piece leaves it behind" — and that is WRONG as of the current
 *     engine; revenge-16 L10's "orphaned dart" trap does not exist.) That
 *     removes the last authorable timing constraint: a marching pawn is as
 *     good a fuse as a walled bishop, so "wait until it jams, then dart" —
 *     the one construction that would have forced a late dart — is dead.
 *
 * What that means for Hourglass: the implementer's note ("weakest of the
 * five; it needs levels where the fuse is longer than the walk") is right
 * about the diagnosis and the cure is unreachable in this engine. To make
 * Hourglass gate anything, ONE of these has to change: lower
 * MOVE_LIMIT_FLOOR to 4, or give the dart a range/line-of-sight limit, or
 * give the king's poison stun 2 turns so the finish can be 3 moves. Until
 * then Hourglass is a comfort card: it makes tight levels 1 move easier and
 * it is never a solo answer (0% at T1 AND at T5 on all four finales).
 *
 * The run still ships as content: the ladder is honest (15% random-pick full
 * clears, inside the 10-25% target), the pair is the intended line on every
 * finale, and three of four kit cards are hard-zero on L7-L10.
 *
 * CONSTANT SIGNATURE — THE GALLERY, THE STAIR AND THE CANDLE. Three parts,
 * on every level, and no other run has this silhouette (the catalogue is
 * bands, columns, boxes, roofs, diagonals, rings and burrows — this is a
 * TOWER with one staircase, and a light burning in a wall):
 *   - THE GALLERY. Ranks 7 and 8 are solid stone on every file except the
 *     turret's two. His room is the one piece of the back two ranks left
 *     standing: a 2x2 tower (g7 g8 h7 h8, or a7 a8 b7 b8 on the mirrored
 *     levels). No rook line, no pawn and no bishop enters it any other way.
 *   - THE STAIR. From L6 the turret's second file is bricked at rank 6 AND
 *     the first five squares of the stair file are bricked, so the ONLY road
 *     into the tower is f-file → f6 → g6 → g7/g8 (three moves from rank 1,
 *     four counting the kill). That single road is the whole point: EVERY
 *     capture anywhere else on the board is three or more moves from it, and
 *     a capture-stun lasts exactly one enemy turn — so on this board a
 *     capture-stun is worthless and only a REMOTE stun pays. That is why no
 *     ability, magnet and aegis all read 0%.
 *   - THE CANDLE. One bishop bricked into a niche on the far file (a6 or h6,
 *     with the three squares that touch it stone). It cannot move — both its
 *     diagonals are walled — and it cannot be captured: its file is stoned
 *     below and above, its rank is stoned beside it. Nothing Rookie owns
 *     reaches it. A dart does. It is the only clock in the room, it burns
 *     whether she moves or not, and its death is a capture credited to her:
 *     the king stiffens for one turn, which is the only turn a lone rook
 *     ever gets against a 2x2 room (revenge-27's finding — she holds one
 *     line, he steps to the other, for ever).
 *   - THE PROCESSION. Pawns walking down the open middle files, one per
 *     enemy turn (pawn priority is -rank, so the lowest one steps first and
 *     you can count them). They are the visible clock and the price of every
 *     glass-turn: turning the glass hands the whole court a free action. They
 *     never touch the stair (no pawn can ever cover a rank-6 square here —
 *     the square that would cover it is on rank 7 and rank 7 is stone), so
 *     they are pressure and tempo, never a wall.
 *
 * KIT ROLES (measured, not guessed):
 *   poison-dart  KEY on L5, L6 and half of every finale. The only remote
 *                stun in the kit and the only thing that touches the candle.
 *                TRAP on L1-L4 (nothing worth killing; the fuse outlives the
 *                level).
 *   hourglass    Half of every finale line and the reason each finale fits
 *                its clock. NEVER a solo key: 0% alone on L7-L10 at T1 and
 *                at T5. Its honest job in this run is the move it gives back.
 *   magnet       KEY on L3 and L4 — the wedged bishop that plugs the stair
 *                is defended where it stands and undefended two squares
 *                lower, and Magnet is the only card that moves it. TRAP on
 *                every other level: its pull line is Rookie's own rook line
 *                and the candle sits behind stone on both its file and its
 *                rank. 0% on all four finales at every tier.
 *   aegis        KEY on L3 and L4 (wear the recapture and take the plug
 *                yourself). TRAP everywhere else — a shield buys her a hit,
 *                and nothing in this run kills her, it out-waits her. 0% on
 *                all four finales at every tier.
 *
 * THE FOUR FINALE DECISIONS (written before building, per "One line, four
 * times"). Same two cards; a different question each level:
 *   L7  THE COUNT — the teaching line, and the only one where the road is
 *       quiet. Dart on move zero, glass on move zero, walk the stair, arrive
 *       on the stun. The level is the arithmetic: the clock is exactly one
 *       move shorter than the walk plus the fuse.
 *   L8  THE WINDOW — mirrored tower, and a knight is working the stair's
 *       foot. Spend the glass on move zero and you hand it the tempo it
 *       needs to sit on the road; the glass has to fall BETWEEN the two
 *       walking moves. WHEN, not whether.
 *   L9  THE FAR STAIR — mirrored (as L8 is): his tower is on a7/a8/b7/b8 and
 *       the road is c-file → c6 → b6, while every enemy on the board stands
 *       on the other side of it. The decision is to walk AWAY from the pieces. (It is
 *       also the one level where the gate closes on its own: poison alone
 *       reads 13% at 64 trials, because the 5-move line is past the bot's
 *       horizon on the long road and the 4-move line is not.)
 *   L10 THE DOUBLE COST — two enemies a turn. The glass is still one move,
 *       but now it buys the court TWO free actions, so it can only be spent
 *       at the one moment the procession is not on top of her.
 *
 * MEASURED — numbers of record. Honest harness (the process-lifetime bot
 * counter and the unseeded start file are both fixed in 94482af);
 * `scripts/run-playtest/matrix-determinism-check.ts` run first: PASS (all
 * three shapes agree, 10/16). `revenge.ts matrix --run=revenge-29
 * --difficulty=normal --trials=32 --jobs=8`, T1 cards:
 *
 *      L    none  hourglass  poison  magnet  aegis | hourglass+poison-dart
 *      1    100%       100%    100%    100%   100% |   100%
 *      2    100%       100%    100%    100%   100% |   100%
 *      3      0%         0%    100%     56%   100% |   100%
 *      4      0%         0%    100%     34%   100% |   100%
 *      5      9%        13%    100%      0%    13% |   100%
 *      6      0%         0%     88%      0%     0% |    78%
 *      7      0%         0%     78%      0%     0% |    63%
 *      8      0%         0%     75%      0%     0% |    69%
 *      9      0%         0%     13%*     0%     0% |    78%
 *     10      3%         0%     78%      0%     0% |    69%
 *
 * (* L9 poison-dart is the widest-swinging cell in the run: 13% at 64
 * trials, 34% at 32. Quote the 64-trial number.)
 *
 * GATE: MET for no-ability, hourglass, magnet and aegis (0% on all four
 * finales); MISSED for poison-dart (75-78% on L7/L8/L10) for the structural
 * reason at the top of this header. The pair lands 63/69/78/69 — inside the
 * 60-80% band Tyler asked for on all four.
 *
 * TIER SWEEP (L7-L10, `--loadouts=<card>:1..:5`, 32 trials, Normal):
 *   hourglass    0/0/0/0 at T1, T2, T3, T4 and T5 (one 9% cell, L10 at T3 =
 *                3 of 32, noise). It is never a solo answer at any tier.
 *   magnet       0% on all four levels at all five tiers.
 *   aegis        0% on all four levels at all five tiers.
 *   poison-dart  L7 78/75/75/69/91 · L8 81/81/72/88/84 · L9 34/34/94/88/78 ·
 *                L10 78/78/72/72/75 — above the gate at EVERY tier.
 * CAP: none. `abilityTierCaps` is deliberately absent and the sweep is why —
 * the three cards that hold, hold all the way to T5, and the one that breaks
 * breaks at T1, where a cap cannot reach it. A cap costs the player agency
 * and would buy nothing here.
 *
 * FULL RUNS (40 each, Normal, `revenge.ts runs`): 6/40 = 15% clear with
 * random picks from the kit — inside the 10-25% target the Moat set, which
 * combo runs have been missing. 4/40 = 10% when the player draws ONLY
 * hourglass + poison-dart, and that inversion is real, not noise: L3 falls
 * from 88% to 65% and L5 rises to 100%, because the plug levels are the
 * fillers' levels. A player who takes the signature pair early pays for it
 * at THE PLUG.
 *
 * DEAD ENDS (each measured and thrown away):
 *   - AN ENTERABLE 2x2 ROOM IS NOT A ROOM. The first build left both turret
 *     files open from rank 1. A lone rook walks in at g7, covers g8 and h7,
 *     and corners him: no-ability read 3-66% across the finale and L8 read
 *     100%. Bricking h6 — so the h side is only ever attacked from INSIDE
 *     the room, never from below — is what turns the tower into revenge-27's
 *     "he steps to the line she is not on, for ever". Every single card
 *     dropped to 0% in one edit.
 *   - A CAPTURE-STUN IS A POISON-STUN. `stunKingAfterCapture` fires for ANY
 *     capture credited to Rookie, so on the first stair build (g-file open
 *     from rank 1) the bare rook just ate a marcher, slid to the g-file
 *     while he was stunned and took him: none read 9-16%. The fix is the
 *     STAIR — brick g1-g5 and e6 so the only road is f6 → g6, which puts
 *     every capture on the board three or more moves from a killing square
 *     while a stun lasts one turn. That single constraint is what holds
 *     three of the four singles at zero.
 *   - MOVE LIMITS BELOW 6 DO NOT EXIST. Four finale levels were authored at
 *     `moveLimit: 4` and every one of them played out over five and six
 *     moves in the trace. `applyDifficulty` clamps to `MOVE_LIMIT_FLOOR = 6`
 *     on every difficulty including Normal. If your level's whole idea is a
 *     tight clock, check that floor before you build it.
 *   - DANGER DOES NOT SEPARATE THE PAIR FROM THE DART. Three passes of
 *     adding hunters and `enemiesPerTurn: 2` to make the extra move fatal:
 *     poison alone and the pair fell together every time (L7 81/78 → 72/72 →
 *     47/56; L10 with two knights and two enemies: 3% and 9%). The extra
 *     move is one move of exposure, and one move of exposure is worth about
 *     ten points to both lines. Difficulty is not a substitute for a gate.
 *   - MIRRORING THE FINALE IS NOT VARIANCE. Putting all four finales on the
 *     a-side (which is what makes L9 gate) made the four levels one level;
 *     L7 and L10 went back to the g-side; the finale reads g / a / a / g.
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

/** THE GALLERY — ranks 7 and 8 are stone on every file except the turret's. */
const GALLERY = (turret: number[]): Coord[] =>
  FILES.filter((f) => !turret.includes(f)).flatMap((f) => [X(f, 7), X(f, 8)]);

/** THE NICHE — the bricked cell on the a-file that holds the candle at (a, r). */
const NICHE_A = (r: number): Coord[] => [X(1, r - 1), X(2, r - 1), X(2, r), X(2, r + 1)];
const NICHE_H = (r: number): Coord[] => [X(8, r - 1), X(7, r - 1), X(7, r), X(7, r + 1)];

/**
 * THE TURRET — gallery + one stair. Room = g7 g8 h7 h8; h6 bricked so the h
 * side is never attacked from below; a lone rook holds one line and he steps
 * to the other, for ever. Only a STUN ever holds him still.
 */
const TURRET_G: Coord[] = [...GALLERY([7, 8]), X(8, 6)];
const TURRET_A: Coord[] = [...GALLERY([1, 2]), X(1, 6)];

/**
 * THE STAIR — the finale form of the turret. The g-file is bricked from rank 1
 * to rank 5 and rank 6 is bricked at e6, so the ONLY road into his room is
 * f-file → f6 → g6 → g7/g8. Three moves from anywhere on rank 1, and every
 * capture anywhere else on the board is at least three moves from that road —
 * which is what makes a capture-stun (one enemy turn long) worthless here and
 * a remote POISON stun the only stun that pays.
 */
const STAIR_G: Coord[] = [
  ...TURRET_G,
  X(7, 1), X(7, 2), X(7, 3), X(7, 4), X(7, 5),
  X(5, 6),
];
const STAIR_A: Coord[] = [
  ...TURRET_A,
  X(2, 1), X(2, 2), X(2, 3), X(2, 4), X(2, 5),
  X(4, 6),
];

const RUN_REVENGE_29: RunDef = {
  id: 'revenge-29',
  name: 'The Candle',
  blurb: 'It burns whether you move or not.',
  allowedAbilities: ['hourglass', 'poison-dart', 'magnet', 'aegis'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: ['freeze-ray', 'smoke', 'rewind', 'boulder', 'summon-knight'],
  offerCoreMin: 2,
  levels: [
    // L1 — THE GALLERY.
    make(1, [king(7, 8), pawn(3, 5), pawn(4, 4)], {
      ...STILL, moveLimit: 8, hazards: GALLERY([7, 8]),
    }),
    // L2 — THE PROCESSION.
    make(2, [king(7, 8), pawn(3, 6), pawn(4, 6), pawn(5, 6), pawn(4, 4)], {
      ...STILL, moveLimit: 9, hazards: GALLERY([7, 8]),
    }),
    // L3 — THE PLUG. AEGIS (wear the recapture) or MAGNET (drag it off guard).
    make(3, [king(7, 8), bishop(7, 5), pawn(8, 6), pawn(4, 5)], {
      ...FLEE, moveLimit: 6, kingPen: ['g7', 'g8'],
      hazards: [...GALLERY([7]), X(6, 4), X(8, 4), X(6, 6), X(8, 5)],
    }),
    // L4 — THE DOUBLE GUARD. Two defenders and two enemies a turn: the shield
    // is one hit short. MAGNET.
    make(4, [king(7, 8), bishop(7, 5), pawn(8, 6), pawn(6, 6), pawn(4, 5)], {
      ...FLEE, moveLimit: 6, enemiesPerTurn: 2, kingPen: ['g7', 'g8'],
      hazards: [...GALLERY([7]), X(6, 5), X(8, 5), X(5, 6), X(6, 4), X(8, 4)],
    }),
    // L5 — THE CANDLE. Two-square room: a rook never corners him. The bishop
    // in the wall is the only stun on the board, and a dart is the only thing
    // that touches it. POISON.
    make(5, [king(7, 8), bishop(1, 6), pawn(4, 5), pawn(5, 4)], {
      ...FLEE, moveLimit: 8, kingPen: ['g7', 'g8', 'h7', 'h8'],
      hazards: [...TURRET_G, ...NICHE_A(6)],
    }),
    // L6 — THE STAIR. Same candle, and now the only road up is f6 → g6.
    make(6, [king(7, 8), bishop(1, 6), pawn(4, 5), pawn(6, 4)], {
      ...FLEE, moveLimit: 7, kingPen: ['g7', 'g8', 'h7', 'h8'],
      hazards: [...STAIR_G, ...NICHE_A(6)],
    }),
    // L7 — THE COUNT. The teaching finale and the only quiet road: dart on
    // move zero, glass on move zero, walk f-file → f6 → g6, arrive on the
    // stun. One knight, far off on the c-file, to keep her honest.
    make(7, [king(7, 8), bishop(1, 6), knight(3, 3), pawn(3, 5), pawn(4, 4)], {
      ...FLEE, moveLimit: 6, kingPen: ['g7', 'g8', 'h7', 'h8'],
      hazards: [...STAIR_G, ...NICHE_A(6)],
    }),
    // L8 — THE WINDOW. Mirrored tower (a7/a8/b7/b8, road c6 → b6) with a
    // knight working the stair's foot on f3. Spend the glass on move zero
    // and the knight gets the tempo it needs to sit on the road; the glass
    // has to fall BETWEEN the two walking moves.
    make(8, [king(1, 8), bishop(8, 6), knight(6, 3), pawn(5, 6), pawn(7, 4)], {
      ...FLEE, moveLimit: 6, kingPen: ['a7', 'a8', 'b7', 'b8'],
      hazards: [...STAIR_A, ...NICHE_H(6)],
    }),
    // L9 — THE FAR STAIR. Mirrored again, and now every enemy on the board
    // stands on the far side of it: the decision is to walk AWAY from the
    // pieces. The one finale where the gate closes on its own — poison alone
    // reads 13% at 64 trials, because on the long road the 5-move line is
    // past the bot's horizon and the 4-move line is not.
    make(9, [king(1, 8), bishop(8, 6), knight(5, 4), pawn(4, 5), pawn(6, 3)], {
      ...FLEE, moveLimit: 6, kingPen: ['a7', 'a8', 'b7', 'b8'],
      hazards: [...STAIR_A, ...NICHE_H(6)],
    }),
    // L10 — THE DOUBLE COST. Back to the g-side tower, two enemies a turn.
    // The glass is still worth one move, but it now hands the court TWO free
    // actions, so it can only be spent at the one moment the procession is
    // not on top of her.
    make(10, [king(7, 8), bishop(1, 6), knight(4, 4), pawn(3, 5), pawn(4, 2)], {
      ...FLEE, moveLimit: 6, enemiesPerTurn: 2, kingPen: ['g7', 'g8', 'h7', 'h8'],
      hazards: [...STAIR_G, ...NICHE_A(6)],
    }),
  ],
};

export { RUN_REVENGE_29 };
