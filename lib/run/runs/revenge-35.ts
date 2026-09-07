/**
 * revenge-35 — THE PICKET. Built 2026-09-07 for the signature pair
 * PAGE + AEGIS ("pay the toll at the gate, then plant your man on his last
 * square"). Kit = page / aegis / magnet / rewind (`allowedAbilities` IS the
 * kit). All four cards are LIVE, so this run is promotable as it stands.
 *
 * THE VERB: TAKE A CAPTURE YOU DO NOT SURVIVE, THEN GROW A BODY ON THE ONE
 * SQUARE HE CANNOT LEAVE. Not crossing a wall (The Moat), not baiting hunters
 * (The Alley), not a poison timer (The Switchback), not blowing a hole (The
 * Briar), not caging with his own guard (The Alcove), not a double door (The
 * Millstone), not a two-rook net (The Parapet), not buying a body time (The
 * Lattice), not moving the wall (The Quarry), not an undo (The Dogleg). This
 * is the only run in the catalogue whose answer is a SUICIDE CAPTURE plus a
 * PAWN.
 *
 * Neither card had a home. Aegis has been a TRAP filler in eight kits (Stacks,
 * Slash, Alcove, Keep, Hayloft, Squint, Warren, Quarry) and has never been half
 * of a signature pair. Page has never been in a shipped kit at all — it is one
 * of the two abilities in the catalogue that no run had ever offered.
 *
 * WHY THIS PAIR, read out of lib/run/abilities.ts (applyAegis,
 * tryAegisIntercept, summonSpawnSquares, allyAttackedSquares,
 * applyControlledAllyMove) and lib/run/pawn-ai.ts (kingFleeMove, the
 * enemy-turn mover phase):
 *
 *   - A PAWN IS THE SMALLEST ATTACK SET IN THE GAME: exactly two squares,
 *     (f-1, r+1) and (f+1, r+1). A rook covers a rank and a file and never two
 *     squares on a diagonal; a pawn covers nothing BUT a diagonal pair. So a
 *     two-square room on a diagonal — a STEP — is the one shape a lone rook
 *     can never hold (he walks g8 -> h7 -> g8 for ever) and one pawn ends.
 *     PAGE is how you put a pawn there: a rainbow pawn you control, born on
 *     any free square beside Rookie as a FREE action, whose move IS her move
 *     at T1-T4. A fresh summon is not dazed (only Convert's theft is), so a
 *     Page born on the door takes the king THE SAME TURN.
 *   - AEGIS is a free action and `tryAegisIntercept` fires BEFORE the capture
 *     lands; below T5 it then calls `endTurn`, so a blocked capture does not
 *     merely save Rookie — it EATS THE WHOLE ENEMY PHASE. It is the only card
 *     in the kit that turns a defended piece into a takeable one.
 *   - Neither buys the other. The shield is not a threat and never opens a
 *     line; the pawn cannot be born on a square Rookie cannot stand on. The
 *     run is one shape: a road with exactly ONE square in it that has to be
 *     captured, that capture defended by something no line in the level can
 *     reach, and the square it wins being the only square a Page can ever be
 *     planted on the door from.
 *
 * CONSTANT SIGNATURE — THE BACK WALL, THE STEP, THE GUARD AND THE GATE. The
 * same corner on every level, mirrored onto the a-file for half of them. No
 * other run has this silhouette (the catalogue is bands, columns, boxes he
 * sits inside, roofs, shafts, diagonals, rings, burrows, a tower with a stair,
 * a chimney, a blind cell, a quarry face and a corridor with a bend):
 *
 *   1. THE BACK WALL — a8-e8 is stone on every level, plus e7 and f7. It is
 *      not decoration. A rainbow pawn that reaches rank 8 PROMOTES to a
 *      controlled QUEEN, and a controlled queen walks to any throne from
 *      anywhere: with the back rank open the Page SOLOED this finale 50-88%
 *      by planting on d6, stepping to d7, promoting on e8 and sweeping f7 then
 *      g8. And f7 is the SECOND DOOR — a pawn attacks (f-1,r+1) and (f+1,r+1),
 *      so f7 as well as h7 lets a Page take g8; with f7 open the Page solos
 *      every finale 88-100% off the open rank 7. Both are measured DEAD ENDS
 *      (below). A run whose signature card is the Page has to take rank 8 and
 *      f7 away from it, and this one does.
 *   2. THE STEP — his room is TWO SQUARES ON A DIAGONAL, g8 and h7 (b8 and a7
 *      mirrored), written into `kingPen`. Exactly two squares in the game see
 *      both ends at once: g7 and h8. L1-L2 leave one of them open and a rook
 *      simply stands there. From L4 on they are both denied and nothing a
 *      rook, bishop or queen ever does can end the level.
 *   3. THE GUARD — from L7 the denial at g7 is not stone but a BISHOP, jammed
 *      solid (f6 stone, h8 stone, h6 its own gate, f8 its own warden: four
 *      diagonals, four blocks, it can never move) and defended by that warden
 *      pawn on f8, which itself can never march (f7 stone) and can never be
 *      reached (e8 and f7 stone, g8 the throne). The guard is the stone in the
 *      wall AND the spear that answers.
 *   4. THE GATE — h6 is the ONLY square from which a Page can ever be planted
 *      on the door (h7's five neighbours are g7 the guard, g8 the king, h8
 *      stone, g6 stone and h6), and from L6 a jammed bishop is standing on it.
 *      On L6 nothing defends it and one card wins. From L7 the guard defends
 *      it, and taking it is a capture Rookie does not survive.
 *   5. THE APRON — c7, d7, d6, e6, f6, g6, g5 stone, so the whole approach
 *      from the west is walled and the h-file is the only road that gets
 *      anywhere near him.
 *
 * KIT ROLES — KEY / TRAP by level:
 *   page    KEY on L4 and L6 (the door is open, or the gate is undefended:
 *           walk up, plant, strike) and half the pair on L7-L10. TRAP on
 *           L1-L3 and L5, where the step still has one of its covering
 *           squares and a rook finishes by walking there.
 *   aegis   KEY on L3 (the guard is the last covering square and taking him is
 *           the win) and second answer on L5; half the pair on L7-L10. TRAP on
 *           L1/L2/L4/L6.
 *   magnet  KEY on L5 (drag the jammed bishop down the file out of its
 *           defender's two squares and take it on open ground). TRAP on the
 *           whole finale, and provably so: every defended piece in the finale
 *           is either adjacent to the only square Rookie can see it from (a
 *           pull of zero is not a pull) or walled off both on its rank and on
 *           its file, and Magnet only travels her own lines. Measured 0% on
 *           all four finale levels.
 *   rewind  TRAP on all ten, and honestly so — it is a dead charge in this
 *           run. Rewind restores the ENEMY side, and every failure here is
 *           Rookie captured: she is dead, there is no turn left to cast it on.
 *           The one thing it could give back is an eaten Page, and the Page in
 *           this run is never eaten — it is born and it kills in the same turn.
 *
 * THE FOUR FINALE LEVELS — and an honest note on "One line, four times"
 * (.claude/run-level-design.md, Tyler 2026-09-06). The pair is used the same
 * way on all four: shield, take the gate, plant the door, strike. What changes
 * between them is WHICH CORNER, HOW MANY EYES ARE ON THE ROAD, and HOW MANY
 * ACTIONS THE COURT GETS PER MOVE OF HERS — so the L7 route is not a route on
 * L8-L10, but the IDEA is the same idea. That is a real gap against the
 * variance note and it is written down here rather than dressed up: the plant
 * is instantaneous (a Page born beside the throne captures it in the same
 * turn), so there is no second beat inside the finish to vary. The variance
 * this run does have is on the ROAD:
 *
 *   L7  THE PICKET. The lesson. One knight on the floor, 13 moves. Shield,
 *       take the gate on h6, plant h7, strike.
 *   L8  THE MIRROR AND THE SECOND HUNTER. The corner on the a-file, TWO
 *       knights on the floor, 12 moves. The shield now has two jobs and one
 *       charge: every look a knight gets is an invitation to spend it, and a
 *       shield spent on the road is a shield the guard eats for free. The
 *       decision is REFUSE THE FREE SHIELD.
 *   L9  THE NEAR SIDE. Back to the h-file corner, two knights, and this time
 *       they start on Rookie's own side of the board (d4 and c2) rather than
 *       across it — so the squares she waits on while she walks up are the
 *       ones being watched, and the L8 habit of loitering low costs the
 *       charge. Twelve moves.
 *   L10 THE LAST GATE. The mirror, two knights, and TWO ENEMIES A TURN: the
 *       court gets two actions per move of hers instead of one, so no square
 *       stays quiet for a whole phase and there is no waiting anywhere. The
 *       clock is 15 moves because the road has to be walked the long way
 *       round; measured, this is the hardest of the four to keep the charge
 *       through.
 *
 * ===========================================================================
 * MEASURED — 2026-09-07, `revenge.ts matrix --difficulty=normal --trials=32`,
 * T5 bot, cards at T1. FINALE NUMBERS OF RECORD taken SERIAL (`--jobs=1`):
 *
 *      L    none    page   aegis  magnet  rewind | page+aegis
 *      7      0%      0%      0%      0%      0% |    66%
 *      8      0%      0%      0%      0%      0% |    75%
 *      9      0%      0%      0%      0%      0% |    66%
 *     10      0%      0%      0%      0%      0% |    66%
 *
 * Every single card in the kit reads ZERO on all four finale levels, no
 * ability reads zero, and the pair sits at 66-75% — inside the 60-80% band
 * Tyler asked for after the Lattice and the Alcove, not the 90-100% the
 * earlier combo runs shipped at.
 *
 * MID-RUN (32 trials, jobs=3):
 *
 *      L    none    page   aegis  magnet
 *      1    100%    100%    100%    100%   warmup, no ability
 *      2    100%    100%    100%    100%   warmup, no ability
 *      3      0%     56%    100%      0%   aegis KEY
 *      4      0%    100%      0%      0%   page KEY
 *      5      0%     13%     38%     81%   magnet KEY (81%, not 90+; honest)
 *      6      0%    100%      0%      0%   page KEY
 *
 * TIER CAP — `abilityTierCaps: { aegis: 1 }`. Swept L7-L10, 32 trials:
 *
 *      loadout   L7    L8    L9   L10
 *      aegis:1    0%    0%    0%    0%   <- the gate
 *      aegis:2  100%  100%  100%  100%   <- broken
 *      aegis:3  100%  100%   97%  100%
 *      aegis:5  100%  100%  100%  100%
 *      page:3     0%    0%    0%    0%   (T3 promotes on rank 7 — walled off)
 *      page:5     0%    0%    0%    0%
 *
 * Exactly the pattern the design doc predicts: the break is the tier that
 * grants a SECOND USE. With two charges Aegis pays the gate AND then tanks the
 * warden's recapture of the guard on g7 — and a rook standing on g7 covers the
 * whole step, so the second charge wins the level by itself. One charge is the
 * whole design; the cap is the smallest one the numbers justify, and Page is
 * left completely uncapped (its promotion tiers are answered by the wall, not
 * by a cap).
 *
 * FULL RUNS (`revenge.ts runs --runs=40 --difficulty=normal`):
 *   random picks     5/40 = 12.5% full clears. Attrition where it should be:
 *                    L3 68%, L5 59%, L7 54%. Aegis was picked only 14 times in
 *                    40 runs (a capped card is never offered as an upgrade, so
 *                    it competes for the "new pick" seat only) — which is why
 *                    this run lands at the Moat's old 10-25% target instead of
 *                    the 28-55% the other combo runs report.
 *   pool=page,aegis  6/40 = 15%. L1-L4 100%, then L5 50% (magnet is the key
 *                    there and is not in the pool — the trap filler doing its
 *                    job), L7 75%, L8 53%, L9 88%, L10 86%.
 *
 * ===========================================================================
 * DEAD ENDS
 *
 * 1. THE PAGE PROMOTES AND THE RUN IS OVER (v1, measured). The first build
 *    left rank 8 open west of the throne. Page alone read 50-88% on the
 *    finale: plant on d6, step to d7, capture the warden on e8, promote to a
 *    controlled QUEEN, sweep f7 and then g8. A promoted Page is a universal
 *    solvent — it is a queen you control with no leash. ANY run that puts Page
 *    in its kit must take rank 8 away from her pawns, and (at T3+, where a
 *    Page promotes on RANK 7) rank 7 as well. This run walls both.
 *
 * 2. THE SECOND DOOR (v2, measured). With rank 8 walled, Page alone still read
 *    88-100%: a pawn attacks BOTH forward diagonals, so f7 takes g8 exactly as
 *    h7 does, and rank 7 was open all the way from a7. When the plant square
 *    is a corner square (h7), remember it has a twin on the other side of the
 *    king. Both have to be denied or the level has two doors.
 *
 * 3. THE KING ON THE DOOR (v4, measured). To make the finale findable the
 *    king was started on h7 instead of g8, so that Rookie standing on h6
 *    ATTACKS him and the bot's rollout eval (`fastScore`: +25 for attacking
 *    the king) would pull her onto the road. It worked and it broke the level:
 *    any capture credited to Rookie stuns the king, so taking the gate on h6
 *    froze him on h7 and she took him from h6 next move. Aegis alone read
 *    100%, no-ability read 100% on the unguarded version. A king one square
 *    from a capture Rookie is about to make is not in a pen; he is in a
 *    two-move mate.
 *
 * 4. PRE-EMPTIVE AEGIS IS UNFINDABLE (v3, measured, and the lesson worth
 *    keeping). The first finale that met the gate on paper asked Rookie to
 *    raise the shield and then WALK ONTO a square a frozen pawn covered —
 *    "stand on the square that kills you". The line works (verified move by
 *    move against the engine) and the playtest bot read it at 0%: the MCTS
 *    never spends a card to make a losing move survivable, exactly as the
 *    Glasshouse taught for Freeze Ray. What IS findable is the same card used
 *    on a CAPTURE: "take the defended piece anyway" is a move the bot already
 *    wants to make, and the shield only has to make it survive. Every Aegis
 *    level in this run is built that way. Corollary, from the same sweep: a
 *    guard that is a PAWN diagonally above the target square costs the square
 *    20 points in `fastScore`'s cheap threat proxy and the rollout policy will
 *    not go there — the guard here is a BISHOP for that reason.
 *
 * 5. HUNTERS ARE THE DIFFICULTY KNOB, AND THEY RAISE THE PAIR RATE. Measured
 *    on L7, 32 trials: an empty floor read 50%, one knight 66%, two knights
 *    75%. Counter-intuitive until you look at why — a knight that gets a look
 *    at Rookie makes the bot raise the shield REACTIVELY (a present threat),
 *    and she then carries the charge to the gate instead of having to plan it.
 *    Pressure that produces a threat she can walk away from is worth more to
 *    findability than it costs in difficulty. `enemiesPerTurn: 2` is the knob
 *    that pushes the other way: L10 read 78% with three knights at one enemy a
 *    turn, 34% with three at two a turn, and 66% with two at two a turn on a
 *    15-move clock, which is where it shipped.
 */

import {
  FLEE,
  STILL,
  X,
  bishop,
  king,
  knight,
  make,
  pawn,
  type RunDef,
} from '../run-kit';
import type { Coord } from '../types';

const REVENGE_CORE_35: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

/**
 * THE CORNER — the same eleven squares on every level, mirrored on half of
 * them. a8-e8 is the back wall (rank 8 is never reachable by a pawn of hers,
 * which is what keeps the Page a pawn instead of a promoted queen); e7 and f7
 * brick the second door (a rainbow pawn attacks (f-1,r+1) and (f+1,r+1), so
 * f7 as well as h7 would let a Page take g8 — leave f7 open and the Page solos
 * every finale, measured 88-100%); f6 and g6 seal rank 6 and the g-file; g5
 * jams the gate.
 */
const NE_BACK: ReadonlyArray<Coord> = [
  X(1, 8), // a8
  X(2, 8), // b8
  X(3, 8), // c8
  X(4, 8), // d8
  X(5, 8), // e8
  X(5, 7), // e7
  X(6, 7), // f7 — the second door, bricked
];

/** g7 + h8: the only two squares that ever cover both halves of the step. */
const G7 = X(7, 7);
const H8 = X(8, 8);

const mirror = (cs: ReadonlyArray<Coord>): Coord[] =>
  cs.map((c) => X(9 - c.file, c.rank));

/** The finale floor: the back, both denials, and the corner sealed. */
const NE_CORNER: ReadonlyArray<Coord> = [
  ...NE_BACK,
  H8,
  X(6, 6), // f6 — no pawn of hers ever stands beside the guard
  X(7, 6), // g6 — the g-file dies under the guard
  X(7, 5), // g5 — the gate's other diagonal
  X(4, 6), // d6 \
  X(5, 6), // e6  } THE APRON — the whole approach from the west is stone, so
  X(4, 7), // d7  } the h-file is the only road that gets anywhere near him
  X(3, 7), // c7 /
];

const NW_BACK = mirror(NE_BACK);
const NW_CORNER = mirror(NE_CORNER);
const B7 = X(2, 7);
const A8 = X(1, 8);

const RUN_REVENGE_35: RunDef = {
  id: 'revenge-35',
  name: 'The Picket',
  blurb:
    'One road, one gate, one guard in the wall. Pay the toll, then grow a man on his last square.',
  allowedAbilities: ['page', 'aegis', 'magnet', 'rewind'],
  abilityTierCaps: { aegis: 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_35,
  offerCoreMin: 2,
  levels: [
    // L1 — THE OPEN CORNER. The wall and the throne, h8 open: walk up the
    // h-file, stand on h8, take him. Still king. The silhouette, for nothing.
    make(1, [king(7, 8), pawn(3, 3)], {
      ...STILL,
      moveLimit: 12,
      hazards: [...NE_BACK, G7],
      kingPen: ['g8'],
    }),
    // L2 — THE STEP. He runs, and his room is TWO SQUARES ON A DIAGONAL: g8
    // and h7. Only two squares in the game see both at once — g7 and h8 — and
    // h8 is still one of them. A knight wanders the floor.
    make(2, [king(7, 8), knight(4, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: [...NE_BACK, G7],
      kingPen: ['g8', 'h7'],
    }),
    // L3 — THE GUARD (aegis KEY). h8 is stone, so the only square left that
    // covers the step is g7 — and a pawn is standing on it. He can never march
    // (g6 stone) and only one square in the level attacks him (h7, up the open
    // h-file), and the warden on f8 defends him. Take the guard and the warden
    // takes you back; take him with the shield up and the answer is nothing at
    // all — and the square you land on is the square that ends the level.
    make(3, [king(7, 8), pawn(6, 8), pawn(7, 7), knight(3, 2)], {
      ...FLEE,
      moveLimit: 12,
      hazards: [
        X(1, 8),
        X(2, 8),
        X(3, 8),
        X(4, 8),
        X(5, 8),
        X(5, 7),
        X(6, 7),
        H8,
        X(7, 6), // g6 — freezes the guard
        X(6, 6), // f6
      ],
      kingPen: ['g8', 'h7'],
    }),
    // L4 — THE OPEN DOOR (page KEY). Both covering squares are stone now: no
    // rook, bishop or queen line in the level ever holds the step, and nothing
    // a rook does can end this. But h6 is open, and a rainbow pawn born on h7
    // takes g8 the same turn it is born. One card, one plant.
    make(4, [king(7, 8), knight(4, 4)], {
      ...FLEE,
      moveLimit: 11,
      hazards: [...NE_BACK, G7, H8],
      kingPen: ['g8', 'h7'],
    }),
    // L5 — THE PULL (magnet KEY). h8 is open again, so the h-file is the road
    // to the covering square — and a jammed bishop sits in it on h5 (g4 stone,
    // g6 its own pawn: it attacks nothing and it never moves), with that pawn
    // on g6 defending it. Aegis takes it the L3 way and pays. Magnet does it
    // for free: drag the bishop down the file, out of the pawn's two squares,
    // and take it on open ground.
    make(5, [king(7, 8), bishop(8, 5), pawn(7, 6), knight(3, 3), pawn(5, 2)], {
      ...FLEE,
      moveLimit: 13,
      hazards: [...NE_BACK, G7, X(7, 5), X(7, 4), X(6, 6)],
      kingPen: ['g8', 'h7'],
    }),
    // L6 — THE GATE, UNGUARDED (page KEY). The finale's exact corner: both
    // covering squares stone, rank 6 and the g-file sealed, and a jammed
    // bishop standing on h6 — the one square from which a Page can ever be
    // planted on the door. Nothing defends it. Take it for free, plant, strike.
    make(6, [king(7, 8), bishop(8, 6), knight(4, 4)], {
      ...FLEE,
      moveLimit: 11,
      hazards: [...NE_CORNER, G7],
      kingPen: ['g8', 'h7'],
    }),
    // L7 — THE PICKET (finale, teaching). L6's board with one pawn added: the
    // guard moves onto g7, where he is both the stone in the wall and the
    // spear that answers. He can never march (g6 stone), he can never be
    // reached except from h7 (f7 stone, g6 stone) which is behind the gate,
    // and the warden on f8 defends him. So the bishop on h6 — the only square
    // a Page can be planted on the door from — is a DEFENDED capture, and the
    // shield is the only thing in the kit that survives it.
    make(7, [king(7, 8), pawn(6, 8), bishop(7, 7), bishop(8, 6), knight(4, 4)], {
      ...FLEE,
      moveLimit: 13,
      hazards: [...NE_CORNER],
      kingPen: ['g8', 'h7'],
    }),
    // L8 — THE MIRROR AND THE HUNTER. The same corner on the a-file, and a
    // knight loose on the floor. Every time it looks at Rookie the shield
    // wants to go up, and a shield spent on the road is a shield the guard
    // eats for free. Walk where the knight cannot look.
    make(8, [king(2, 8), pawn(3, 8), bishop(2, 7), bishop(1, 6), knight(5, 4), knight(6, 2)], {
      ...FLEE,
      moveLimit: 12,
      hazards: [...NW_CORNER],
      kingPen: ['b8', 'a7'],
    }),
    // L9 — TWO HUNTERS, ONE CHARGE. The picket of L7 with two knights working
    // the floor and one move fewer. There is no route that never gets looked
    // at; there is only a route that gets looked at where it cannot be caught.
    make(9, [king(7, 8), pawn(6, 8), bishop(7, 7), bishop(8, 6), knight(4, 4), knight(3, 2)], {
      ...FLEE,
      moveLimit: 12,
      hazards: [...NE_CORNER],
      kingPen: ['g8', 'h7'],
    }),
    // L10 — THE LAST GATE (mirror). Everything the run has taught, mirrored,
    // with TWO enemies a turn: the knights get two looks per move instead of
    // one, so the road has to be walked in the fewest squares that exist.
    make(10, [king(2, 8), pawn(3, 8), bishop(2, 7), bishop(1, 6), knight(5, 4), knight(6, 2)], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 15,
      hazards: [...NW_CORNER],
      kingPen: ['b8', 'a7'],
    }),
  ],
};

export default RUN_REVENGE_35;
export { RUN_REVENGE_35 };
