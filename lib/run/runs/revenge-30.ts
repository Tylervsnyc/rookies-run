/**
 * revenge-30 — THE SQUINT. Built 2026-09-06 for the signature pair
 * COUP + DUCHESS ("his sentry on the throne, him on the doorstep").
 * Kit = coup / duchess / aegis / magnet (`allowedAbilities` IS the kit).
 * Coup is at the TESTING stage, so this run is /playtest-only.
 *
 * A squint (a hagioscope) is the slit cut at an angle through a church wall
 * so someone outside can see the altar. That is the run: the throne is sealed
 * against every straight line in the game — rank, file AND diagonal — and the
 * only light in the level is ONE long diagonal that reaches the DOORSTEP
 * beside him and never the throne itself.
 *
 * WHY THIS PAIR, read out of lib/run/abilities.ts (coupTargets / applyCoup,
 * summonSpawnSquares) and lib/run/pawn-ai.ts (kingFleeMove, capture priority):
 *   - COUP trades the king's square with one of his own guards. T1 is a PAWN
 *     at Chebyshev 1, one charge, and it is a FREE action. It moves him; it
 *     never opens a line.
 *   - The DUCHESS is a controlled queen who spawns on one of the eight squares
 *     beside Rookie as a FREE action and may capture the king the same turn
 *     (her move IS Rookie's move). She is the only thing in the kit that
 *     travels a diagonal — and the court eats her the instant she stands next
 *     to it, because enemies value a summoned queen exactly as highly as
 *     Rookie.
 *   - So the run is one sentence: A ROOK CANNOT USE THE SQUINT AND A QUEEN
 *     CANNOT REACH THE THRONE. Coup alone puts him on a post no rook line
 *     touches. The Duchess alone comes down the squint, takes the SENTRY
 *     standing on the doorstep, and the jammed WATCHER takes her back one
 *     move short. Together: swap him onto the post (free), summon her on the
 *     squint (free), slide. Two casts and one move — the same shape as
 *     become-king + boulder on the Alcove.
 *
 * CONSTANT SIGNATURE — THE SQUINT. Every level the king sits in a BLIND CELL
 * whose orthogonal neighbours are stone or a jammed guard, and one DIAGONAL
 * neighbour is his DOORSTEP. Two facts do all the work and both are visible
 * from L1:
 *   1. A ROOK STANDING ON THE DOORSTEP ATTACKS NOTHING. The doorstep is
 *      diagonal to the throne, so taking the sentry that stands there is not a
 *      step toward him — it is a square with a dead end in every direction.
 *      Every other run in the catalogue puts its key square on a rook line;
 *      this one deliberately does not.
 *   2. THE DOORSTEP HAS EXACTLY ONE LINE AND IT IS A DIAGONAL — the squint, an
 *      open lane running down to Rookie's own half. Its file is stoned above
 *      and below, its rank is stoned both sides, its other diagonal is the
 *      wall, and the fourth is the throne.
 * Not a band across rank 5 (The Moat), not columns (The Colonnade), not a
 * sealed box (The Vault / The Glasshouse), not offset bars (The Switchback),
 * not a hedge (The Briar), not shafts (The Stacks), not one diagonal cutting
 * the board in two (The Slash / The Cliff), not an alley (The Alley), not a
 * diamond round a pillar (The Millstone), not a solid rank (The Parapet), not
 * a checker field (The Lattice), not a one-wide slot (The Alcove), not a ring
 * (The Keep), not a roof (The Hayloft), not a burrow (The Warren), not a heap
 * (The Cairn): a corner cell with a slit of light cut across the board at 45
 * degrees, and the run asks WHO IS STANDING IN THE LIGHT.
 *
 * THE JAM RULE (learned the hard way — see DEAD ENDS). A pawn marches, and a
 * bishop or knight walks toward Rookie the moment a move gets it strictly
 * closer. A sentry that can leave the doorstep takes the whole level with it
 * (it opens the diagonal onto the throne), and a watcher that can leave stops
 * defending the doorstep. So every guard here is jammed by stone or by its own
 * king — and the ONE place that rule is deliberately broken is L10.
 *
 * THE ARC
 *   L1-L2  the cell has an open orthogonal DOOR and a still king. Walk in.
 *   L3     the door is shut and the doorstep is a diagonal. Rank 7 reaches the
 *          sentry and taking it is worth NOTHING — put HIM there: COUP.
 *   L4     an orthogonal door again, plugged by a bishop knotted in stone and
 *          defended by a second, jammed bishop. Take it, eat the reply: AEGIS.
 *   L5     the doorstep is EMPTY, so the lane runs through it onto the throne
 *          itself, and no pawn stands beside him (Coup cannot even be cast).
 *          Only a queen looks down a diagonal: DUCHESS.
 *   L6     L3 mirrored and hurried — two hunters, two enemies a turn, seven
 *          moves. COUP again, with no room to wander.
 *   L7-L10 the sentry is on the doorstep, the watcher behind it, the lane stops
 *          at the post. The pair, and nothing else in the kit.
 *
 * KIT = coup / duchess / aegis / magnet.
 *   coup     KEY on L3 and L6 (the only levels where the doorstep is on a rook
 *            line), half of L7-L10. TRAP on L1-L2 (a still king in an open
 *            cell) and on L4 (the pawn beside him stands on a square with no
 *            line in the game). Uncastable on L5 — no pawn stands beside him.
 *            NOTE ON THE OFFER ECONOMY: L1, L2 and L4 each carry a pawn beside
 *            the king SO THAT COUP IS CASTABLE THERE. The offer pre-filter
 *            drops a card with no legal target, and the first build — with
 *            Coup uncastable on four of the first five levels — offered it 17
 *            times in 40 runs against 36-38 for the other three, which starved
 *            half the signature pair. With the pawns it is offered 27 times
 *            and the random full-clear went 5% to 10%.
 *   duchess  KEY on L5, half of L7-L10. TRAP on L3/L6 (she can reach the
 *            doorstep and the watcher takes her back) and on the finale alone.
 *            Honest second answer on L4 — she trades herself for the plug and
 *            the recapture vacates the seal (94%, measured, documented).
 *   aegis    KEY on L4. TRAP everywhere else: nothing in the finale cell ever
 *            attacks Rookie, and a shield is not a line.
 *   magnet   KEY NOWHERE — the pure trap card, the same role it has in The
 *            Millstone. The pull runs along HER lines and none of them enter
 *            the cell; and pulling a guard out only opens a diagonal, which a
 *            rook cannot use. Measured 0% on nine of ten levels.
 * No universal solvents (no bishop-step / knight-hop / become-king), no second
 * summon, no boulder (coup + boulder is the documented BEST pair for this card
 * — a second answer), no freeze-ray (coup + freeze is flagged "possibly too
 * strong"), no convert / rabies-dart / smoke (listed Coup anti-pairs in
 * docs/ability-pairs.md).
 *
 * THE FOUR FINALE DECISIONS (written before building, per "One line, four
 * times"). Same two cards, a different decision each level:
 *   L7  THE SQUINT — the teaching line. NE cell: king h8, sentry g7, watcher
 *       f8, lane e5-f6 stopping at the post. Stand beside a lane square, coup,
 *       summon, slide. Forgiving: four launch squares work.
 *   L8  WHICH GUARD — the choice. NW cell (king a8, sentry b7, watcher c8,
 *       lane c6-d5) with a SECOND pawn beside him: the CROWN on b8, jammed by
 *       his own sentry. Two legal coup targets, ONE charge, and the crown's
 *       square is stopped on its file by the sentry, on its rank by the king
 *       and the watcher, and on both diagonals by stone. The wrong swap is not
 *       a slower win, it is a dead level. The decision is the GUARD, not the
 *       square.
 *   L9  THE SHUTTERED LANE — open it, and stand in the dead man's place. The
 *       L7 cell with e6, f5 and g5 bricked, so of the eight squares beside f6
 *       (the last lane square) seven are stone or his room and the eighth is
 *       e5, where a pawn stands, jammed by the stone under it. The queen
 *       cannot be born anywhere she can reach the post from, so the lane has
 *       to be opened by TAKING the shutter — and the only way to take it is to
 *       stand where it stood. Come along rank 5 from the west (its file is
 *       bricked below), take it, and next turn swap him out and summon her
 *       ABOVE you. Two enemies a turn.
 *   L10 THE THRONE GIVEN BACK — nothing early. The L8 cell with ONE stone
 *       missing (a7 is open) and one pawn added (c6 plugs the lane). Nothing
 *       changes for Rookie: a7 is stopped on its file by the stone below and
 *       on its rank by the sentry, so no line of hers ever touches it. It
 *       changes everything for the guard she deposes — swapped onto the
 *       throne, that sentry is no longer jammed. It marches to a7 on the next
 *       enemy turn, the throne empties, and a king who can see a queen on the
 *       lane walks straight home. And the lane is plugged one square short, so
 *       the Duchess must spend a move taking the plug and SURVIVE an enemy
 *       turn on it before she can strike. Coup early, park her, take a breath
 *       — and he is back on a square with no door. Two hunters, two enemies a
 *       turn, nine moves.
 *
 * WHY THE SINGLES FAIL ON THE FINALE (kit-relative, measured below):
 *   none     no rook line and no diagonal reaches the throne, and the squares
 *            of his cell she CAN reach are worth nothing to stand on.
 *   coup     he lands on the post, and the post is on the squint — a lane a
 *            rook cannot travel. Swapping the crown instead lands him in a
 *            cell inside a cell.
 *   duchess  she comes down the squint and takes the sentry; the watcher —
 *            jammed by stone, unreachable on every line, defending the post by
 *            pawn geometry — takes her back. One charge, one body.
 *   aegis    nothing in the cell ever attacks Rookie. The shield has no job.
 *   magnet   the pull follows her rook lines and none enter the cell.
 *
 * ── MEASURED (2026-09-06, Normal, T5 bot, cards at T1 unless a tier is
 * written; harness verified with scripts/run-playtest/matrix-determinism-check.ts
 * — PASS, all three shapes agreed 10/16 on the revenge-27 probe cell) ──
 *
 * FINALE, numbers of record. `revenge.ts matrix --run=<id> --difficulty=normal
 * --levels=7,8,9,10 --loadouts=none,coup,duchess,aegis,magnet,coup+duchess
 * --trials=32 --jobs=8`:
 *    L     none    coup duchess   aegis  magnet  |  coup+duchess
 *    7       0%      0%      0%      0%      0%  |  94%
 *    8       0%      0%      0%      0%      0%  |  91%
 *    9       0%      0%      0%      0%      0%  |  91%
 *   10       0%      0%      0%      0%      0%  |  94%
 * GATE HOLDS: no card in the kit clears a finale level alone (worst single
 * cell 0%); the pair reads 94/91/91/94.
 *
 * L1-L6 (16 trials/cell):
 *    L    none  coup  duchess  aegis  magnet   note
 *    1    100%  100%    100%   100%    100%    free
 *    2    100%  100%    100%   100%    100%    free (capture order)
 *    3      0%  100%      0%     0%      0%    coup, clean
 *    4      0%    0%    100%   100%     19%    aegis KEY, duchess 2nd answer
 *    5      0%    0%    100%     0%      0%    duchess, clean
 *    6      0%  100%      0%     0%      0%    coup, clean
 *
 * TIER SWEEP (finale, one loadout column per invocation, 32 trials):
 *   coup:1    0/0/0/0     coup:2   0/0/0/0
 *   coup:3  100/100/100/100  ← BREAKS. T3 is "any guard in his room OR within
 *           2 of him", plus a second charge, and the level's HUNTERS wander
 *           within 2 of the cell. Traced: swap him onto the watcher, then swap
 *           him again with a bishop that has walked to within 2 — two free
 *           hops and he is standing next to Rookie in the open board. Coup at
 *           T3+ is a solvent on any level that has mobile pieces, not just
 *           this one.
 *   coup:4  97/97/100/100   coup:5  100/100/100/100
 *   duchess:1 0/0/0/0   duchess:2 0/0/0/0   duchess:3 0/0/0/0
 *   duchess:4 31/31/28/56  ← BREAKS (the second charge: the watcher eats the
 *           first queen and the second one walks in). duchess:5 25/25/31/31.
 *   aegis:5 0/0/0/0   magnet:5 0/0/0/0 — no cap needed.
 *   → `abilityTierCaps: { coup: 2, duchess: 3 }`, the highest tiers at which
 *   every single kit card still reads 0%. Proved through the offer path with
 *   scripts/run-playtest/tier-cap-audit.ts (224k slates, 0 violations).
 *
 * HONEST MISS: the pair reads 91-94% on all four, not the 60-80% Tyler asked
 * for. The reason is structural and worth writing down, because it will bite
 * the next combo run too: THE PAIR'S LINE IS TWO OR THREE MOVES LONG FROM ANY
 * START. A rook reaches any square on an open board in two moves, and both
 * casts are FREE, so the whole finale is "walk to a launch square, then coup +
 * summon + slide". A perfect-information bot does not misstep a three-move
 * walk. Every knob was tried and measured: the clock does nothing (L7 read
 * 100% at moveLimit 3, 4, 5 and 6 alike — the line fits inside three); a queen
 * added to the floor did nothing (94%); three hunters and two enemies a turn
 * took 100% to 91-94%, which is where it stops. The one thing that DOES move
 * the number is making the launch square lethal or the lane long, and that is
 * a CLIFF, not a slope: a jammed pawn covering the only launch square read 3%,
 * a two-pawn shutter chain read 9-13%, and both are the same level for a human
 * (impossible) rather than a harder one. So the difficulty here lives in the
 * DECISIONS, which are real for a player and free for a solver: the L7 habit
 * loses on L8 (the crown swap is a dead level), the L8 habit loses on L9 (the
 * lane is shut and only the shutter's own square launches her), and any of
 * them cast early loses on L10 (the deposed sentry marches off the throne and
 * he walks home). Reported, not hidden.
 *
 * FULL RUNS (40 each, Normal, T5, never skipping an offer):
 *   RANDOM offer picks   4/40 = 10%. The wall is L3 (57% of arrivals clear it):
 *     it is a COUP-ONLY level sitting one offer after the first slate, and a
 *     3-card slate with `offerCoreMin: 2` carries exactly one kit card, so most
 *     random pickers simply do not hold Coup by level 3. That is the bottom of
 *     the 10-25% band the Moat set, and it is the honest cost of a single-card
 *     puzzle placed that early; moving it later would make L3 a second free
 *     level. After L3 the ladder behaves: 91 / 71 / 100 / 60 / 89 / 63 / 80.
 *   POOL PINNED TO THE PAIR  28/40 = 70%, dying at L3 (80%, the runs that were
 *     dealt Duchess twice), L8 and L9 (97/93).
 *   picks across the random sweep: aegis 44, magnet 42, duchess 36, coup 27.
 *
 * DEAD ENDS, 2026-09-06:
 *   - A JAMMED SENTRY AND A ROOK-REACHABLE DOORSTEP ARE MUTUALLY EXCLUSIVE.
 *     A pawn marches, so a sentry keeps its post only if the square in front
 *     of it is blocked — and for a doorstep approached up its own file that
 *     square is the approach. Three L3 builds died on this before the doorstep
 *     was moved onto a RANK (stone under the sentry, rank 7 open to the west),
 *     which is now the shape of every coup level in the run.
 *   - THE WANDERING WATCHER. L5 v1 sealed rank 8 with a bishop on g8 defended
 *     by a bishop on f7 and a knight boxed on h6. The f7 bishop was not jammed
 *     (e8 was free, and a bishop moves whenever a move gets it strictly closer
 *     to Rookie); it stepped to e8, which un-boxed the knight, and a BARE rook
 *     ate the whole chain — none read 100%. Any piece used as a wall must have
 *     every one of its moves blocked, and "it has no reason to move" is not
 *     blocked.
 *   - THE SACRIFICE THAT VACATES THE SEAL. Wherever the piece that SEALS a
 *     line is also the piece that DEFENDS the plug, the Duchess solves the
 *     level alone by dying: she takes the plug, the seal recaptures onto the
 *     plug's square, and the line she could not use is now open for Rookie.
 *     That is the whole of the 94% duchess reading on L4, and it is why the
 *     finale keeps the two jobs on two different pieces (the WATCHER defends
 *     the doorstep, the STONE seals rank 8).
 *   - A CROWN ON AN ORTHOGONAL NEIGHBOUR IS A DOOR. The first "which guard"
 *     build put the second pawn on h7, one square below the throne. Once the
 *     sentry is pulled off g7 by ANY means, rank 7 runs f7-g7-h7 and h7 is on
 *     the king's own file: magnet, aegis and the Duchess all read 100%. The
 *     crown has to sit where the sentry's departure changes nothing — b8 in
 *     the NW cell, stopped on its file by the sentry itself.
 *   - THE ONLY-LAUNCH-SQUARE CLIFF. See HONEST MISS. Covering the single
 *     launch square with a jammed pawn (L9 v2) read 3% for the pair; a
 *     two-pawn chain in front of it (L9 v3) read 9-13% at every clock from 9
 *     to 14 and at one or two enemies a turn. There is no dial between "the
 *     bot always finds the walk" and "the walk is impossible".
 *   - STONE THAT BOXES ROOKIE, NOT HIM. The L9 v3 trace ended with Rookie
 *     shuffling h4-g4-h4 to the move limit: e4/d4/f5/g5/h6/g6 stone had sealed
 *     the south-east corner around her start file. Every stone added to guard
 *     the lane also removes a rook route; check the start squares, not just
 *     the cell.
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
const REVENGE_CORE_30: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

/**
 * THE NE CELL (king h8, doorstep g7, watcher f8) — the finale shape.
 *   rank 8   #e8   f8=WATCHER   #g8    KING
 *   rank 7   #e7   #f7          SENTRY #h7
 *   rank 6                      #g6    #h6
 * h8: rank 8 stopped by g8, the h-file by h7, the diagonal by the sentry.
 * g7: file stopped by g8 above and g6 below, rank by f7/h7, the h6 diagonal by
 *     stone — leaving f6-e5-..., THE SQUINT.
 * f8: file stopped by f7, rank by e8/g8, diagonals by e7 and the sentry — no
 *     line in the game reaches it, and it covers g7 forever.
 */
const NE_CELL: ReadonlyArray<Coord> = [
  X(7, 8), // g8
  X(8, 7), // h7
  X(6, 7), // f7
  X(5, 8), // e8
  X(5, 7), // e7
  X(7, 6), // g6
  X(8, 6), // h6
];

const RUN_REVENGE_30: RunDef = {
  id: 'revenge-30',
  name: 'The Squint',
  blurb: 'His throne has no door. His sentry is standing on the only one.',
  allowedAbilities: ['coup', 'duchess', 'aegis', 'magnet'],
  abilityTierCaps: { coup: 2, duchess: 3 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_30,
  offerCoreMin: 2,
  levels: [
    // L1 — THE OPEN DOOR. The cell with its h-file left open: g8/g7 wall him
    // off to the west, f7/f8 close the shoulder, and the h-file runs straight
    // up to his square. A pawn stands in it as a free key. Still king. The
    // silhouette, for nothing.
    make(
      1,
      [pawn(8, 7), pawn(8, 4), pawn(3, 3), king(8, 8)],
      {
        ...STILL,
        moveLimit: 6,
        hazards: [X(7, 8), X(7, 7), X(6, 7), X(6, 8)],
        kingPen: ['h8'],
      },
    ),
    // L2 — THE CHAIN. The mirror cell, the a-file open. A pawn plugs the file
    // on a5 and a second pawn on b6 defends it: take the defender first (the
    // b-file is open under it), then the plug, then him. Capture order, with a
    // knight cutting the middle while you choose.
    make(
      2,
      [pawn(1, 7), pawn(1, 5), pawn(2, 6), knight(5, 4), king(1, 8)],
      {
        ...STILL,
        moveLimit: 9,
        hazards: [X(2, 8), X(2, 7), X(3, 7), X(3, 8)],
        kingPen: ['a8'],
      },
    ),
    // L3 — THE DOORSTEP (coup KEY). The door is shut: g8 seals rank 8, h7
    // seals the file, and the SENTRY on g7 — jammed by the stone under it —
    // seals the diagonal. Rank 7 runs west of the doorstep, so she can stand
    // on f7 and take the sentry, and it is worth NOTHING: a rook on g7 faces
    // stone on three sides and an empty square on the fourth, and the bishop
    // pocketed on h6 (jammed by its own pawn above and the stone below) takes
    // her back. The square is only worth something if HE is standing on it.
    // Cast the swap, slide, done — one turn, because the swap is free.
    make(
      3,
      [pawn(7, 7), bishop(8, 6), knight(3, 4), king(8, 8)],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: [X(7, 8), X(8, 7), X(7, 6), X(7, 5)],
        kingPen: ['h8', 'g7'],
      },
    ),
    // L4 — THE KNOT (aegis KEY). An orthogonal door again — the h-file — and a
    // bishop knotted into it on h7: its only two diagonals are the stone at g6
    // and its own bishop on g8, so it never moves, and g8 (jammed in turn by
    // f7 and the knot itself) takes back anything that touches it. Take the
    // knot and eat the reply. Neither guard is a pawn, so Coup cannot be cast
    // at all. The Duchess has an honest second answer — trade herself for the
    // knot, and the recapture vacates the seal — two moves slower, which is
    // what the clock is for.
    make(
      4,
      [bishop(8, 7), bishop(7, 8), pawn(7, 7), knight(2, 4), king(8, 8)],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: [X(6, 7), X(6, 8), X(7, 6)],
        kingPen: ['h8'],
      },
    ),
    // L5 — THE LIGHT (duchess KEY). The first time the squint is shown for
    // what it is. g8 and h7 are stone and the doorstep g7 is EMPTY, so the lane
    // a1-b2-c3-d4-e5-f6-g7 runs through the doorstep and onto the throne
    // itself. A rook can stand on g7 all day and attack four walls; a queen
    // looks down the whole lane from Rookie's own half. No pawn stands beside
    // him, so Coup has no target: the card is uncastable.
    make(
      5,
      [knight(3, 5), pawn(2, 6), knight(6, 2), king(8, 8)],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: [X(7, 8), X(8, 7)],
        kingPen: ['h8', 'g7'],
      },
    ),
    // L6 — THE WEST DOORSTEP (coup KEY, hurried). L3 mirrored onto the a-file
    // — b8 seals rank 8, a7 seals the file, the sentry on b7 is jammed by the
    // stone under it and the bishop pocketed on a6 covers it — and this time
    // the board moves twice a turn with two hunters on it and seven moves on
    // the clock. Same answer, no room to wander.
    make(
      6,
      [pawn(2, 7), bishop(1, 6), knight(6, 4), knight(4, 2), king(1, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 7,
        hazards: [X(2, 8), X(1, 7), X(2, 6), X(2, 5)],
        kingPen: ['a8', 'b7'],
      },
    ),
    // L7 — THE SQUINT (finale, teaching). The cell is sealed on every line. The
    // SENTRY stands on the doorstep (jammed by g6) and the WATCHER on f8 —
    // jammed by f7, unreachable on every line, covering g7 by pawn geometry
    // forever. Send the queen down the lane alone and the watcher eats her one
    // move short of him. So put HIM on the post first: the swap is free, the
    // summon is free, and her slide is the move. d4 is bricked, so the lane is
    // e5-f6 and the launch squares are the four free neighbours of e5.
    make(
      7,
      [pawn(7, 7), pawn(6, 8), knight(4, 3), knight(3, 6), bishop(8, 2), king(8, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 6,
        hazards: [...NE_CELL, X(4, 4), X(5, 6), X(6, 5), X(7, 5)],
        kingPen: ['h8', 'g7'],
      },
    ),
    // L8 — WHICH GUARD. The mirror cell, and a second pawn beside him: the
    // CROWN on b8, jammed by his own sentry below it. Two pawns at Chebyshev 1,
    // ONE coup charge. The sentry's post is the end of the lane c6-d5; the
    // crown's square is stopped on its file by the sentry, on its rank by the
    // king and the watcher, and on both diagonals by stone — put him there and
    // he is in a cell inside a cell with the card spent. The decision is the
    // GUARD, not the square.
    make(
      8,
      [pawn(2, 7), pawn(3, 8), pawn(2, 8), knight(4, 3), knight(6, 5), bishop(8, 3), king(1, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 8,
        hazards: [X(1, 7), X(3, 7), X(4, 8), X(4, 7), X(2, 6), X(1, 6), X(5, 4), X(4, 6), X(3, 5)],
        kingPen: ['a8', 'b7'],
      },
    ),
    // L9 — THE SHUTTERED LANE. The L7 cell with e6, f5 and g5 bricked, so of the
    // eight squares beside f6 — the last square of the lane — seven are stone or
    // his room, and the eighth is e5, where a pawn is standing, jammed by the
    // stone under it. The queen cannot be born anywhere she can reach the post
    // from, so the lane has to be opened by taking the shutter, and the only way
    // to take it is to stand where it stood: come along rank 5 from the west
    // (its own file is bricked below it), take it, and next turn swap him out
    // and summon her ABOVE you. Two enemies a turn, three hunters.
    make(
      9,
      [pawn(7, 7), pawn(6, 8), pawn(5, 5), knight(2, 3), knight(4, 3), bishop(1, 3), king(8, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 9,
        hazards: [...NE_CELL, X(5, 6), X(6, 5), X(7, 5), X(5, 4)],
        kingPen: ['h8', 'g7'],
      },
    ),
    // L10 — THE THRONE GIVEN BACK. The L8 cell with ONE stone missing — a7 is
    // open — and one pawn added: c6 plugs the lane one square short of the post.
    // Nothing changes for Rookie (a7 is stopped on its file by the stone below
    // and on its rank by the sentry, so no line of hers ever touches it) and
    // everything changes for the guard she deposes: swapped onto the throne, the
    // sentry is no longer jammed. It marches to a7 on the next enemy turn, the
    // throne empties, and a king who can see a queen on the lane walks straight
    // home to it. And the plug means the queen must spend a move taking c6 and
    // survive an enemy turn standing on it before she can strike. Cast early,
    // park her, take a breath — and he is back on a square with no door.
    make(
      10,
      [pawn(2, 7), pawn(3, 8), pawn(3, 6), knight(5, 5), knight(5, 2), bishop(8, 3), king(1, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 9,
        hazards: [X(2, 8), X(3, 7), X(4, 8), X(4, 7), X(2, 6), X(1, 6), X(3, 5), X(5, 4)],
        kingPen: ['a8', 'b7'],
      },
    ),
  ],
};

export default RUN_REVENGE_30;
export { RUN_REVENGE_30 };
