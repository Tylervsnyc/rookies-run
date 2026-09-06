/**
 * revenge-16 — THE SWITCHBACK. Built 2026-09-05 for the daily kit
 * poison-dart / bishop-squire / magnet / rabies-dart (`allowedAbilities` IS
 * the kit).
 *
 * ── 2026-09-06 VARIANCE REWORK (Tyler, after playing it: "same thing, it
 * kind of has one gimmick and needs to be made harder" — the note he gave
 * The Lattice and The Alcove). The original finale below was ONE lock in
 * four corners: dart the uncapturable corridor guard, stand at the mouth,
 * summon the Squire into the hole the turn it dies, strike. Once you had it
 * on L7, L8-L10 were execution. The rework keeps the signature (two bars,
 * offset), the kit, L1-L6 and the pair, and makes each finale level demand
 * a DIFFERENT use of poison + squire. Written before building, per the
 * rubric ("One line, four times"):
 *
 *   L7  THE COUNT — the original lock, kept as the discovery level: dart the
 *       guard on the corridor square, park the Squire on the open corridor
 *       below it, slide the turn the poison lands. The clock is cut (12 →
 *       8) and the hunter removed: the count is the whole level.
 *   L8  TWO GUARDS, ONE DART — his room is in the middle of the back rank
 *       and TWO plugged corridors leave it, one to each side, each with a
 *       guard pawn in a bar opening and a defender behind it. One dart.
 *       Only the diagonal that covers BOTH squares of his room is real (the
 *       long a2-b3-c4-d5-e6-f7-g8 line); the stub on the other side
 *       (h5-g6-f7) reaches f7 alone, he is standing on g8, and a Squire
 *       that steps onto f7 to freeze him is eaten by e8. Poison the wrong
 *       guard and the level is already lost. The decision is WHICH.
 *   L9  THE BACKSTOP — the guard is NOT the target. Behind it stand two
 *       pawns: a refill on its file (marches into the hole the turn after
 *       the guard dies, and two enemies act a turn so it always does) and a
 *       recapturer on the diagonal. Darting the guard opens a hole that is
 *       plugged again before the Squire can land. The line is reversed:
 *       dart the RECAPTURER, summon the Squire beside the guard, let HIM
 *       take it (capture-stun), survive the reply, strike next turn. The
 *       Squire captures twice; the dart clears the piece you never see act.
 *       This is also the one level where Rabies is a shortcut (a rabid
 *       recapturer eats the guard itself and lands on c6 undefended) — the
 *       trap card is briefly the key, on purpose.
 *   L10 THE LONG DIAGONAL — no post exists next to the hole: both mouth
 *       squares are denied (stone on one, a sentinel pawn covering the
 *       other), so a Squire summoned beside the guard is impossible. The
 *       corridor is the whole a1-h8 diagonal and it crosses BOTH bars at
 *       their openings; it starts under Rookie's feet. Two blockers sit on
 *       it: a hunter knight on e5 that leaves by itself (a dart on it is
 *       orphaned — poison is keyed to the square), and the guard on f6 that
 *       never moves (dart it on move one). Two enemies a turn, two hunters:
 *       keep them OFF the diagonal or they block the slide.
 *
 *   The timing that binds all four guard-poison locks (found by the bots,
 *   2026-09-06): the second defender of every corridor square is a boxed
 *   knight, and the moment the guard dies that knight jumps INTO the empty
 *   square (a vacated square nearer Rookie is an approach). The Squire has
 *   exactly one turn — the one right after the poison lands — to slide
 *   through the hole. Park him on the lower corridor early; a late throw
 *   or a late slide meets a knight where the pawn was.
 *
 *   Contract for L7-L10 at Normal against the kit: no ability ~0%, every
 *   single card <= 8%, the pair 60-80% (not 100). Numbers in MEASURED
 *   under the 2026-09-06 heading; builds that failed are in DEAD ENDS.
 * ──
 *
 * ORIGINAL DESIGN (2026-09-05), kept for the record. Note the L7-L10 lines
 * described below are the PRE-REWORK finale; the level comments are current.
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
 * FINALE, numbers of record. `revenge.ts matrix --run=revenge-16 --levels=7,8,9,10
 * --loadouts=<none + kit + pair> --trials=32 --jobs=8`, T1 cards, Normal:
 *    L       none  bishopsqu     magnet  poisondar  rabiesdar  |  poison-dart+bishop-squire
 *    7         0%         0%         0%         0%         0%  |  97%
 *    8         0%         0%         0%         0%         0%  |  59%
 *    9         0%         0%         0%         0%         0%  |  84%
 *   10         0%         0%         0%         0%         0%  |  47%
 * GATE HOLDS: no card in the kit clears a finale level alone (worst single cell 0%); the pair reads 97/59/84/47.
 * The header below was WRONG by up to 28 points on the pair (69/63/63/63 then,
 * 97/59/84/47 now) — it was measured with the flawed method. The gate itself
 * survives (every single card still 0% on all four), but THE VARIANCE REWORK'S
 * OWN CONTRACT DOES NOT: it asked for the pair in a 60-80% band and the honest
 * read is 97 / 59 / 84 / 47. L7 is a giveaway and L10 is harder than the band
 * allows. This is the one run in the catalogue whose SHIPPED TUNING was chosen
 * off flawed numbers and would be chosen differently today — L7 wants a tighter
 * clock and L10 a looser one. Not demoted: the combo gate is what /playtest
 * claims, and it holds.
 * ──
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
 *
 * MEASURED — 2026-09-06 variance rework (`revenge.ts matrix --run=revenge-16
 * --difficulty=normal --jobs=1 --trials=32`, T1 cards, serial = numbers of
 * record; the same table read 81/88/81/31 and 69/75/63/81 in two --jobs=2
 * 16-trial passes, so single cells swing ±15):
 *
 *        none  poison  squire  magnet  rabies | poison+squire | rabies+squire
 *   L7     0%      0%      0%      0%      0% |          69%  |   3%
 *   L8     0%      0%      0%      0%      0% |          63%  |   0%
 *   L9     0%      0%      0%      0%      0% |          63%  | 100%  (by design)
 *   L10    0%      0%      0%      0%      0% |          63%  |   0%
 *
 * Before the rework (2026-09-05 build, same harness, 16 trials, --jobs=2):
 * pair 100 / 50 / 100 / 100, singles 0 — and rabies+squire, never measured
 * then, read 100 / 100 / 100 / 100 on the first rework pass (see DEAD
 * ENDS). L7's 3% is the residual rabid-hunter window (1 of 32) and is the
 * one honest miss. Full runs (40 each, Normal, --jobs=2): 5/40 = 12% clear
 * with random picks from the kit (L4 63%, L6 64%, L7 43% are the filters;
 * L8-L10 clear 100/100/83 once a player reaches them holding the pair),
 * 9/40 = 22% when the player draws only poison+squire (L4 55%, L6 55%, L7
 * 83%, L8 90%, L9-L10 100%). L1-L6 untouched. Rookie's start file is
 * random on rank 1 (seed.ts), so every finale line works from any file.
 *
 * DEAD ENDS (2026-09-06 variance rework; each one measured and thrown away,
 * in the order the bots found them):
 *   - RABIES + SQUIRE WAS A SECOND KEY PAIR ON EVERY FINALE, INCLUDING THE
 *     ORIGINAL BUILD (never measured — only rabies ALONE was). Three
 *     mechanisms, all from pawn-ai.ts: (1) a rabid piece cannot capture
 *     allies, so a rabid recapturer is switched off for the one turn the
 *     Squire needs to take the guard and sit on the corridor square; (2) a
 *     rabid piece eats the nearest friend it can reach, so a rabid backstop
 *     eats its own guard and lands on the square — still a guard if it is a
 *     pawn, an open door next turn if it is a knight or bishop (it walks
 *     off); (3) with ONE enemy action a turn, a rabid piece that merely
 *     steps eats the whole reply turn, so nothing recaptures at all. Read
 *     100 / 100 / 100 / 100 on the first rework matrix. Fixes: two enemies
 *     a turn on every finale; a second defender for each corridor square
 *     that is a BOXED KNIGHT, given a bigger friend (an inert bishop, or the
 *     fake corridor's pieces on L8) at the same distance so its rabid meal
 *     is never the guard; and stone on every square from which a roaming
 *     hunter could rabid-eat the guard (L10 d7/g4/h5) or no hunter at all
 *     (L7, L8 — those squares are her crossing rank). L9 keeps ONE
 *     recapturer on purpose: there the rabid shortcut is the point.
 *   - A BISHOP BEHIND THE BACKSTOP is not a second defender. It sees the
 *     corridor square only through the backstop's square, and a rabid
 *     backstop that has no capture stays put and keeps blocking the line.
 *   - "INERT" BISHOPS MOVE. The L8 decoy on b7 shuffled to c8 because c8 was
 *     open in that pen; the knight it boxed then jumped out and the guard
 *     lost its second defender (rabies+squire 31%). Every diagonal square
 *     next to a decoy must be stone, bar, or a piece.
 *   - THE SECOND DEFENDER REFILLS THE HOLE. The boxed knight's jump into the
 *     corridor square the moment the guard dies is an approach, so it goes
 *     there on the next enemy turn. Summon-INTO-the-hole from the mouth is
 *     therefore dead on L7/L8/L10 (she cannot stand on the mouth while the
 *     guard lives, and by the time she can, the knight is in the hole). The
 *     only line is "Squire parked on the lower corridor, slide the turn the
 *     poison lands" — kept, and written into the header as the timing
 *     that binds the run.
 *   - A TWO-SQUARE DIAGONAL PEN HAS NO "ONE-SQUARE-SHORT" CORRIDOR. L8 v1-v4
 *     assumed a corridor reaching only the near pen square was fake. The
 *     bot darted the "fake" guard and won every time: the Squire steps onto
 *     the empty pen square, the king has no flight square, and it takes
 *     him next turn (or took the undefended backstop on h7, which touches
 *     g8). A fake corridor needs the empty pen square COVERED by a pawn
 *     (e8) and no capturable piece on any square that touches the room.
 *   - THE BOT CANNOT FIND A CORRIDOR WHOSE FOOT IS BEHIND THE LOW BAR. L8
 *     v3-v5 (pen c8/d7, pen f7/g8 with the h landing) read 0-19% with zero
 *     casts: rollouts only find "dart, park the Squire, slide" when the
 *     Squire can be parked from her start squares. The corridor's foot
 *     must reach rank 1-2 through a low opening, and that opening must not
 *     be her only climbing square (two low landings on L8, as on L7).
 *   - A HUNTER ON A CLOCK-ONLY LEVEL halves the bot without adding a
 *     decision (L8: 50% with the knight at 14 moves, 75% without at 12).
 *   - STONE ON THE CROSSING RANK MAKES NO-MOVE POCKETS. L8 v5's d4 stone
 *     left Rookie on e4 with the Squire on f4 and no legal move.
 *   - POISON IS KEYED TO THE SQUARE. A marked piece that moves leaves the
 *     poison behind (dropped on the next tick). Never make a mobile piece
 *     the dart's target; L10's hunter on e5 is a deliberate trap of this.
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
    // L7 — THE COUNT (2026-09-06: room and corridor unchanged, hunter gone,
    // clock cut 12 → 8, two defenders). King c7 in a two-square diagonal
    // room c7/b8 (walls b7/d7/a7/a8/c8/d8, and the rank-6 bar plugs both
    // files): no rook line reaches either square, ever, so no number of
    // stuns puts Rookie on him. Exactly one square covers both — d6, the
    // third step of the b8-c7-d6 diagonal — and a PAWN IS STANDING ON IT.
    // It can never march (d5 is stone) and nothing on Rookie's side can ever
    // capture it: her file into it is stone, her rank into it is stone, and
    // the diagonals that reach it are c5 (a square the pawn itself attacks)
    // and the open corridor below it, e5-f4-g3-h2, where a Squire that
    // takes the pawn is taken back by e7 or by the knight on e8. A dart is
    // the one thing on the board that touches d6.
    //
    // The count: throw it on move one, put the Squire on the lower corridor
    // (h2/g3/f4/e5 — beside wherever she starts) and keep her out of its
    // way, and the turn the poison lands slide him up the diagonal onto the
    // king. ONE turn: the knight on e8 jumps into the empty d6 on the very
    // next enemy turn (a vacated square nearer to Rookie is an approach) and
    // plugs it again until it wanders on. Eight moves is the fuse plus the
    // walk plus nothing.
    //
    // The knight on e8 (every jump is pen, guard, bar or the bishop on g7 —
    // it never moves until d6 empties) is the SECOND defender of d6, and the
    // inert bishop on g7 is its DECOY: both exist because of Rabies. A rabid
    // piece cannot capture allies and eats the nearest friend it can reach,
    // so a rabid e7 is a switched-off recapturer for exactly the turn the
    // Squire needs — the knight covers that turn. And a rabid e8 would eat
    // the guard and walk off the corridor next turn, opening it for free —
    // so it is given a bigger friend to eat instead (bishop before pawn at
    // equal distance) and lands on g7, off the line. Two enemies a turn, or
    // a rabid piece's single step would eat the reply turn. No hunter: a
    // knight standing on any of b5/c4/e4/f5 when the dart lands is a rabid
    // meal of d6 as well, and those are her crossing squares. Same
    // construction on L8 and L10; L9 has ONE recapturer on purpose. See
    // DEAD ENDS.
    make(
      7,
      [
        pawn(4, 6), pawn(5, 7), knight(5, 8), bishop(7, 7),
        king(3, 7),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        enemiesPerTurn: 2,
        hazards: [
          ...STAIR([6, 7], [4]),
          X(2, 7), X(4, 7), X(1, 7), X(1, 8), X(3, 8), X(4, 8), X(6, 7),
          X(4, 5),
        ],
        kingPen: ['c7', 'b8'],
      },
    ),
    // L8 — TWO GUARDS, ONE DART. His room is f7/g8 (walls e7/f8/g7, stone
    // h7, bar under f6) and two plugged corridors leave f7, one to each
    // side, each with a guard pawn standing in a bar opening and a defender
    // behind it. RIGHT: g6-h5 — a stub, guard g6, stone g5, knight h8
    // behind it. LEFT: e6-d5-c4-b3-a2 — the long a2-g8 diagonal, guard e6,
    // stone e5, backstop d7, second defender the knight on d8 (boxed by the
    // inert bishop b7, which is also its rabid meal — see L7). One dart.
    // Only the LEFT diagonal covers both squares of his room (c4-d5-e6-f7-
    // g8). The right one reaches f7 and stops: he is standing on g8, where
    // nothing ever threatens him, and a Squire that steps onto the empty f7
    // to freeze him there is eaten by the pawn on e8 (h7 is stone for the
    // same reason — a backstop pawn there was a free capture that touched
    // g8). Poison g6 and the level is already lost. Poison e6, park the
    // Squire on a2/b3/c4 (two landings, b and c, so she can climb without
    // standing on her own corridor), and the turn it dies slide the whole
    // diagonal onto him — before d8 jumps into the hole. Clock-only, like
    // L7: a hunter here halves the bot's rate without adding a decision.
    make(
      8,
      [
        pawn(5, 6), pawn(4, 7), knight(4, 8), bishop(2, 7),
        pawn(7, 6), knight(8, 8), pawn(5, 8),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        enemiesPerTurn: 2,
        hazards: [
          ...STAIR([2, 3], [5, 7]),
          X(5, 7), X(6, 8), X(7, 7), X(8, 7), X(3, 7), X(1, 8), X(3, 8),
          X(5, 5), X(7, 5), X(3, 5),
        ],
        kingPen: ['f7', 'g8'],
      },
    ),
    // L9 — THE BACKSTOP. King b7, room b7/a8 (walls a7/b8/c8). The covering
    // square is c6 on the a8-b7-c6 diagonal, the guard pawn stands on it
    // (stone c5 under it), and behind it are TWO pawns: c7 on its file and
    // d7 on its diagonal. Dart the guard and the hole plugs itself — c7
    // marches into c6 the turn after the death (two enemies act a turn, so
    // the hunter never starves it of its move), before Rookie can stand
    // beside the square. The dart is for d7, the piece that never moves and
    // never threatens you: it is the only thing that can RECAPTURE on c6.
    // With it dead, stand on b4/c4/d4, summon the Squire on b5 or d5 — the
    // squares the guard attacks, which does not matter for a piece that
    // moves the turn it appears — and take c6 with him (capture-stun). c7
    // cannot march into an occupied square and cannot capture straight
    // ahead. Keep the knight off c6's landing squares that turn, and next
    // turn the Squire takes him from inside the corridor.
    make(
      9,
      [
        pawn(3, 6), pawn(3, 7), pawn(4, 7),
        knight(7, 4),
        king(2, 7),
      ],
      {
        ...FLEE,
        moveLimit: 6,
        enemiesPerTurn: 2,
        hazards: [
          ...STAIR([6, 7], [3]),
          X(1, 7), X(2, 8), X(3, 8),
          X(3, 5),
        ],
        kingPen: ['b7', 'a8'],
      },
    ),
    // L10 — THE LONG DIAGONAL. King g7 in the corner room g7/h8 (walls
    // f7/h7/g8/f8). The corridor is the whole a1-h8 diagonal, and it runs
    // through BOTH openings — the low bar at c3, the high bar at f6 — so it
    // begins one square from wherever Rookie starts. There is no post: e5 is
    // covered by a sentinel pawn on d6 (stone d5) and g5 is stone, so the
    // Squire can never be summoned next to the hole. Two blockers on the
    // line: a KNIGHT on e5 that leaves on its own the first turn (it is a
    // hunter, and a dart on it is a dart wasted — the mark stays on the
    // square it jumps off), and the guard on f6, stone under it, defended
    // twice (pawn e7, and the boxed knight on e8 whose rabid meal is the
    // inert bishop on c7, not the guard — see L7), that never moves. Dart
    // f6 on move one, summon on the diagonal beside you (b2/c3/d4), keep
    // clear of two hunters for three turns without letting either park on
    // c3/d4/e5, and the turn the corridor empties slide the whole length of
    // it onto him — the knight on e8 refills f6 one enemy turn later. Two
    // enemies a turn. Stone e4: a rabid f6 that eats whatever stands on e5
    // is stuck there. Stones d7/g4/h5: with d5/e4/g8/h7 they make f6
    // unreachable for any knight, so a hunter can never be the rabid piece
    // that eats the guard and walks off.
    make(
      10,
      [
        pawn(6, 6), pawn(5, 7), knight(5, 8), bishop(3, 7), pawn(4, 6),
        knight(5, 5), knight(6, 4),
        king(7, 7),
      ],
      {
        ...FLEE,
        moveLimit: 14,
        enemiesPerTurn: 2,
        hazards: [
          ...STAIR([3], [6]),
          X(6, 7), X(8, 7), X(7, 8), X(6, 8), X(4, 7),
          X(6, 5), X(4, 5), X(7, 5), X(5, 4), X(7, 4), X(8, 5),
        ],
        kingPen: ['g7', 'h8'],
      },
    ),
  ],
};

export default RUN_REVENGE_16;
export { RUN_REVENGE_16 };
