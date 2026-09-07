/**
 * revenge-37 — THE PERCH. Built 2026-09-07 for the signature pair
 * MAGNET + BISHOP STEP ("new-lines-for-line-tools" in
 * data/run-playtest/pair-hypotheses.json, confidence 4 — the entry whose
 * mechanism is one line of engine code: `magnetDirs` reads `state.form`).
 * Kit = bishop-step / magnet / rewind / decoy (`allowedAbilities` IS the kit).
 * All four cards are LIVE.
 *
 * ── THE VERDICT, UP FRONT: THIS RUN DOES NOT GATE. ──────────────────────────
 * It is a complete, playable, well-behaved run — 18% full clears with random
 * picks, 95% when the player takes the pair — and it fails the combo contract
 * for a reason that is worth more than the run is. There is NO TIER AT WHICH
 * MAGNET + BISHOP STEP IS BOTH FINDABLE AND NECESSARY. At Bishop Step T1 the
 * pair's payoff needs THREE actions in one turn (transform, pull, move) and the
 * playtest bot never chains three — pair 0% on all four finales. At T2 the
 * transform lasts two moves, so the bot no longer needs the pull at all and
 * Bishop Step SOLOS the finales at 25-50%. The tier that makes the trick
 * findable is the same tier that makes it unnecessary. Numbers below.
 * `pipeline.ts add` only. NOT marked built; it is not on the playtest page.
 *
 * WHY THIS PAIR. BISHOP STEP is the last LIVE card in the catalogue that has
 * never been in a shipped kit — not once in twenty-three runs. It is banned
 * everywhere by the universal-solvent rule (.claude/run-level-design.md, "A
 * universal solvent in a terrain kit"), and that rule has one exception: a
 * solvent may be in the kit when it IS half the signature pair. MAGNET has
 * been half of exactly one pair before (shove + magnet, The Quarry) and is
 * otherwise the catalogue's most-used TRAP filler.
 *
 * THE VERB: MOVE A GUARD YOU CAN NEVER REACH. Not crossing a wall (The Moat),
 * not baiting hunters (The Alley), not a poison timer (The Switchback), not
 * blowing a hole (The Briar), not caging with his own guard (The Alcove), not
 * a double door (The Millstone), not a two-rook net (The Parapet), not buying
 * a body time (The Lattice), not moving the wall (The Quarry), not an undo
 * (The Dogleg), not a capture you do not survive (The Picket), not stopping
 * his running (The Turnstile). Every other run answers "how do I GET
 * somewhere". This one answers "how do I MOVE something no line of mine will
 * ever touch" — and the answer is that Magnet's grab lines are not Magnet's,
 * they are whatever shape Rookie happens to be.
 *
 * THE MECHANISM, read out of lib/run/abilities.ts and verified by running it:
 *   - `magnetDirs(form)` returns ALLY_BISHOP_DIRS in bishop form and
 *     ALLY_ROOK_DIRS otherwise, and `magnetTargets` walks those directions and
 *     BREAKS ON A HAZARD. So a piece whose orthogonal neighbours are stone can
 *     never be a rook-form Magnet target — at T1, at T5, at any tier, for
 *     ever. The geometry refuses the card; the card list does not have to.
 *     (Same tier-proofing as The Quarry's `fixed: true` stones — and it is why
 *     `magnet` reads 0% on every finale here without a tier cap.)
 *   - Both halves are FREE actions, so the trick is one turn: become a bishop,
 *     reel the guard in, take him.
 *   - `transformDurationForTier('bishop-step', 1)` is ONE ROOKIE MOVE, so the
 *     player gets exactly one diagonal move per level. Every finale line has
 *     to fit inside it.
 *   - Verified directly against the shipped engine, L7, Rookie on f5:
 *       form rook   -> magnetTargets = []                 (d7 is unreachable)
 *       activate bishop-step -> form bishop
 *       form bishop -> magnetTargets = [d7], landings = [e6]
 *     So the intended turn IS legal: cast, pull d7 -> e6, bishop-move f5 -> e6
 *     capturing the doorman, and next move e6 -> e7 takes the king.
 *
 * CONSTANT SIGNATURE — THE PERCHES. Every level draws at least one PERCH: a
 * single free square whose orthogonal neighbours are all stone (or, on the
 * finales, stone plus the king's own body). The catalogue's silhouettes are
 * bands (Moat), columns (Colonnade), boxes (Vault, Glasshouse), offset bars
 * (Switchback), a hedge (Briar), shafts (Stacks), one long diagonal (Slash,
 * Cliff), an alley (Alley), a solid rank (Parapet), a checker field (Lattice),
 * a wheel (Millstone), a slot (Alcove), a ring (Keep), a roof (Hayloft), a
 * burrow (Warren), a quarry face (Quarry), a back wall and a step (Picket) and
 * a court with a door and a post (Turnstile). A perch is none of them: it is a
 * stone PLUS SIGN with one square of air in the middle, and it means exactly
 * one thing —
 *
 *   NOTHING THAT MOVES IN STRAIGHT LINES CAN EVER TOUCH WHAT STANDS THERE.
 *   No rook, no rook-form Magnet, no marching pawn, no ally, no boulder line.
 *   Only a 45-degree move, and the pull only from two squares away.
 *
 * A BLACK PAWN on a perch is the whole cast. The stone in front of it means it
 * can never advance (the one pawn structure in the catalogue that does not
 * march — see "Pawn walls march", Briar), and it covers exactly two squares.
 * One of them is always THE DOOR: the single square from which anything can
 * ever look at the throne.
 *
 * KIT ROLES — the per-card KEY/TRAP map by level:
 *   MAGNET      L3 KEY, L6 KEY (drag the cork sideways out of the file — the
 *               one job rook-form Magnet is good at). TRAP L4, L5. Half the
 *               pair L7-L10; 0% alone on every finale at every tier, by
 *               geometry rather than by tier cap.
 *   BISHOP STEP L5 KEY (a throne sealed to every rank and file with one
 *               diagonal left open). TRAP L3, L4, L6. Half the pair L7-L10;
 *               0% alone on every finale, because the door is covered by the
 *               doorman and the doorman is covered by the backstop.
 *   DECOY       L4 KEY (mark the cork, let the court eat it). Inert on the
 *               finales BY GEOMETRY: nothing on those boards can reach a perch.
 *   REWIND      Pure TRAP. `candidatesForAbility` only offers Rewind when an
 *               ally has died or an enemy attacks Rookie, and this kit has no
 *               summons — the seat the design doc keeps for a card that can
 *               never be a key and never a solvent.
 *
 * THE FOUR FINALE LINES, as designed (NONE of them validated — see the
 * verdict): L7 reel the doorman one square onto the door and take him there;
 * L8 the same lock built left-handed, so the launch square moves from f5 to
 * c5; L9 L7's board with two hunters and one move less, so the turn has to be
 * spent the first time it is available; L10 the mirror with two hunters,
 * `enemiesPerTurn: 2` and ten moves.
 *
 * ── MEASURED, 2026-09-07. Normal, T5 bot, 32 trials/cell, difficulty=normal.
 * SERIAL (`--jobs=1`), one invocation, 60 cells in 635s, kit at T1:
 * `revenge.ts matrix --run=revenge-37 --difficulty=normal
 *  --loadouts=none,bishop-step,magnet,rewind,decoy,bishop-step+magnet
 *  --trials=32 --jobs=1`
 *
 *    L    none  bishop-step  magnet  rewind  decoy | bishop-step+magnet
 *    1    100%     100%       100%    100%   100%  |   100%   free
 *    2    100%     100%       100%    100%   100%  |   100%   free
 *    3    100%     100%       100%    100%   100%  |   100%   MISS (dead end 3)
 *    4    100%     100%       100%    100%   100%  |   100%   MISS (dead end 3)
 *    5      0%     100%         0%      0%     0%  |   100%   bishop-step KEY
 *    6    100%     100%       100%    100%   100%  |   100%   MISS (dead end 3)
 *    7      0%       0%         0%      0%     0%  |     0%   FINALE — MISS
 *    8      0%       0%         0%      0%     0%  |     0%   FINALE — MISS
 *    9      0%       0%         0%      0%     0%  |     0%   FINALE — MISS
 *   10      0%       0%         0%      0%     0%  |     0%   FINALE — MISS
 *
 * TIER SWEEP on the finale, 32 trials, `--jobs=2` — the read that explains the
 * whole run:
 *
 *    L   bishop-step:1  bishop-step:2  bishop-step:5  magnet:5 | bs:2 + magnet:1
 *    7        0%            25%             0%           0%    |      84%
 *    8        0%            41%             0%           0%    |      53%
 *    9        0%             9%             0%           0%    |      22%
 *   10        0%            50%             0%           0%    |      50%
 *
 * Read the three columns left to right and the run's whole problem is in them:
 *   - T1 (one bishop MOVE): the pair is necessary and unfindable. 0% / 0%.
 *   - T2 (two bishop moves): Bishop Step is a SOLVENT — 25-50% alone, five to
 *     six times the 8% bar — because two moves are enough to take the doorman
 *     where it stands and step off the square it died on, which is exactly what
 *     the pull was there to avoid. So `abilityTierCaps: {'bishop-step': 1}`
 *     would restore the gate and make the run UNWINNABLE. No cap is shipped.
 *   - T5 (bishop for ever, one use): 0% on all four, and this one is a small
 *     piece of good news — a permanent bishop can never take a king whose four
 *     diagonal neighbours are stone, and can never revert to rook to use the
 *     door. The throne geometry is solvent-proof at the top of the ladder even
 *     though it leaks in the middle.
 *   - MAGNET IS 0% AT EVERY TIER INCLUDING T5, on all four finales, with no cap
 *     — the perch denies it structurally (`magnetTargets` breaks on a hazard),
 *     the way The Quarry's `fixed: true` stones deny Shove. That part of the
 *     design worked exactly as drawn.
 *
 * FULL RUNS, 40 runs each, T5, `revenge.ts runs --run=revenge-37
 * --difficulty=normal --runs=40`:
 *   - random picks: 7/40 = 18% full clears. Per level 100/100/100/100/43/100
 *     then 76/92/67/88 on the finale. The 43% wall is L5, the one honest
 *     single-card gate in the run (bishop-step or nothing), and it is what
 *     stops most runs — which is the shape the rubric wants, in the wrong place.
 *   - `--pool=bishop-step,magnet`: 38/40 = 95% full clears, finale 100/98/100/97.
 *     That is the highest pair-pool number in the catalogue and it is not a
 *     compliment: it is the T2-solvent column above, seen from the other end.
 *     The 18% random figure is BELOW the 25% the rubric expects, for once, and
 *     for the same reason — L5 is a hard single-card wall early.
 *
 * ── DEAD ENDS ───────────────────────────────────────────────────────────────
 *
 * 1. A THREE-ACTION TURN IS ONE ACTION DEEPER THAN THE BOT SEARCHES, AND THE
 *    TIER THAT FIXES THAT IS THE TIER THAT BREAKS THE GATE. The finding, and it
 *    is new. Every gated finale in this catalogue is won by a TWO-action turn:
 *    one free cast plus the move (Alcove: become-king + a stone, then step;
 *    Vault: vanguard, then swap; Turnstile: smoke, then step). The Perch needs
 *    THREE: transform (free) -> pull (free) -> move. Traced on L7 with the pair
 *    in hand at T1, the bot walked to f5 — the exact launch square, the pull
 *    legal, the win two moves away — and shuffled f5-g5-f5-g5 to the move limit
 *    without ever casting Magnet after transforming. The engine is not the
 *    problem; the same position was run directly against the shipped code:
 *      rook form   -> magnetTargets []            (d7 is unreachable by a rank)
 *      cast bishop-step -> form bishop
 *      bishop form -> magnetTargets [d7], landings [e6]
 *    So the turn is legal and it wins. The bot will not find it, and a level the
 *    bot cannot solve is not shippable ("Provable but unfindable", Glasshouse L7
 *    v1-v3). Give the transform a second move so the bot can afford to explore,
 *    and the transform alone crosses the level.
 *    COROLLARY, and the reason to write this down: a pair where ONE CARD CHANGES
 *    WHAT THE OTHER CARD CAN TARGET is a three-action turn by construction, and
 *    is therefore unmeasurable by this harness. That is the entire
 *    `new-lines-for-line-tools` archetype in pair-hypotheses.json — magnet +
 *    bishop-step (confidence 4) and magnet + queen-pulse (confidence 4). Both
 *    should be struck off, or the harness's action chaining deepened first.
 *
 * 2. A PERCH CANNOT GATE A TWO-SQUARE PEN AGAINST BISHOP STEP. Four finale
 *    builds went in the bin on one contradiction. To stop a lone bishop taking a
 *    king out of a 2-square pen, every diagonal neighbour of both pen squares
 *    must be stone. The perched doorman's DOOR is diagonally adjacent to the
 *    perch by construction, and the launch square for the pull is the next
 *    square along that same diagonal — always one of the pen's diagonal
 *    neighbours. The stone that denies the bishop denies the pull. Measured on
 *    the way through:
 *      - open 2x2 pen (kingPen g7/g8/h7/h8, no walls): none 31-50%, magnet
 *        13-31%, bishop-step 100%. A rook walks INTO a 2x2 and then one bishop
 *        move takes the opposite corner — g8, then g8->h7, is the whole level.
 *      - walled 2x2 court with a single door: none 29%, bishop-step 100%, same
 *        diagonal.
 *      - two-square rank pen with a sealed corridor: singles 0%, pair 0%,
 *        because the launch square had to be stone. Unwinnable, not hard.
 *    The build that ships is the resolution: a ONE-SQUARE pen whose four
 *    diagonal neighbours are stone; the doorman standing on the throne's own
 *    doorstep so the KING'S OWN BODY is the doorman's fourth wall; and a
 *    BACKSTOP pawn perched behind it covering the doorstep, so a bishop that
 *    takes the doorman where it stands is recaptured. That structure holds every
 *    single card at 0% at T1 and holds Magnet at 0% at every tier. Reuse it.
 *
 * 3. A CORK ON A FILE IS NOT A SINGLE-CARD PUZZLE (L3, L4, L6 — all 100% with no
 *    ability). Each was meant to be "a defended pawn plugs the only road; drag it
 *    sideways, or let the court eat it". Each leaks the same way: a defended
 *    chain ENDS somewhere, and a bare rook eats it from the tail for two or three
 *    free capture-stuns and walks in. Same lesson as "Pawns beside the pen on an
 *    open file" (Dead Bolt L10 v1), now with three more data points. A cork level
 *    needs its defender to be UNREACHABLE, not merely defended — which on this
 *    run's own terms means the defender has to be perched too. L5 is the level
 *    that got it right, and it got it right with terrain instead of a chain.
 */

import {
  make,
  pawn,
  knight,
  bishop,
  X,
  FLEE,
  STILL,
  type RunDef,
  type LevelBuilder,
} from '../run-kit';
import { king } from '../run-kit';

/**
 * The four stones that box a square in. `perch(3, 8)` = c8 is a perch: b8, c7
 * and d8 are stone (rank 9 does not exist). Off-board neighbours are dropped,
 * so an edge square needs fewer stones — the board's own wall does the rest.
 */
function perch(file: number, rank: number) {
  const out = [];
  if (file > 1) out.push(X(file - 1, rank));
  if (file < 8) out.push(X(file + 1, rank));
  if (rank > 1) out.push(X(file, rank - 1));
  if (rank < 8) out.push(X(file, rank + 1));
  return out;
}

const LEVELS: LevelBuilder[] = [
  // L1 — THE EMPTY PERCH.
  make(1, [king(8, 8), pawn(4, 5), pawn(2, 2)], {
    ...STILL,
    moveLimit: 12,
    hazards: [...perch(4, 5)],
  }),
  // L2 — THE RUNNER.
  make(2, [king(8, 8), pawn(4, 5), knight(3, 3)], {
    ...FLEE,
    moveLimit: 12,
    hazards: [...perch(4, 5)],
    kingPen: ['g8', 'h8'],
  }),
  // L3 — THE CORK (magnet KEY).
  make(3, [king(8, 8), pawn(8, 5), pawn(7, 6), pawn(3, 3)], {
    ...STILL,
    moveLimit: 12,
    hazards: [X(7, 8), X(7, 7), X(6, 6), X(6, 7), ...perch(3, 3)],
  }),
  // L4 — THE COURT EATS ITS OWN (decoy KEY).
  make(4, [king(8, 8), bishop(8, 5), pawn(7, 6), knight(6, 4), pawn(3, 3)], {
    ...STILL,
    moveLimit: 12,
    hazards: [X(7, 8), X(7, 7), X(6, 6), X(6, 7), ...perch(3, 3)],
  }),
  // L5 — THE SEALED THRONE (bishop-step KEY).
  make(5, [king(8, 8), knight(3, 5), pawn(4, 2)], {
    ...STILL,
    moveLimit: 12,
    hazards: [X(7, 8), X(8, 7), ...perch(3, 3)],
  }),
  // L6 — THE SECOND CORK (magnet KEY).
  make(6, [king(8, 8), knight(5, 8), pawn(4, 6), pawn(6, 3)], {
    ...FLEE,
    moveLimit: 13,
    hazards: [X(6, 7), X(7, 7), X(8, 7), X(6, 6), ...perch(3, 4)],
    kingPen: ['g8', 'h8'],
  }),
  // L7 — REEL AND TAKE. The throne on e7 is sealed to every rank, every file
  // and every diagonal in the game: d6/d8/f6/f8 brick his four corners, e8 and
  // f7 brick two of his sides, and e5 shuts the e-file under him. The one
  // square left that looks at him is e6 — and a black pawn is standing on d7,
  // where c7/d6/d8 and the king's own body mean no rank and no file will ever
  // touch it, covering e6. Stand on f5, become a bishop, reel the doorman one
  // square down onto e6 and take him there. The backstop pawn on c8 is the
  // second half of the lock: it covers d7, so a bishop that takes the doorman
  // where it stands dies for it.
  make(7, [king(5, 7), pawn(4, 7), pawn(3, 8)], {
    ...FLEE,
    moveLimit: 12,
    hazards: [X(2, 8), X(3, 7), X(4, 6), X(4, 8), X(5, 5), X(5, 8), X(6, 6), X(6, 7), X(6, 8)],
    kingPen: ['e7'],
  }),
  // L8 — THE OTHER HAND. The same lock built left-handed: throne on d7,
  // doorman on e7, backstop on f8, and the launch is c5 instead of f5. Nothing
  // a player learned about WHERE to stand on L7 survives the mirror.
  make(8, [king(4, 7), pawn(5, 7), pawn(6, 8), knight(2, 4)], {
    ...FLEE,
    moveLimit: 12,
    hazards: [X(7, 8), X(6, 7), X(5, 6), X(5, 8), X(4, 5), X(4, 8), X(3, 6), X(3, 7), X(3, 8)],
    kingPen: ['d7'],
  }),
  // L9 — THE CLOCK. L7's board with two hunters on it and two moves less: the
  // walk to the launch square is now contested and the turn has to be spent
  // the first time it is available.
  make(9, [king(5, 7), pawn(4, 7), pawn(3, 8), knight(7, 4), knight(2, 3)], {
    ...FLEE,
    moveLimit: 11,
    hazards: [X(2, 8), X(3, 7), X(4, 6), X(4, 8), X(5, 5), X(5, 8), X(6, 6), X(6, 7), X(6, 8)],
    kingPen: ['e7'],
  }),
  // L10 — BOTH HANDS AND TWO OF THEM MOVING. The mirrored lock, two hunters,
  // `enemiesPerTurn: 2` and ten moves.
  make(10, [king(4, 7), pawn(5, 7), pawn(6, 8), knight(7, 4), knight(2, 3)], {
    ...FLEE,
    moveLimit: 10,
    enemiesPerTurn: 2,
    hazards: [X(7, 8), X(6, 7), X(5, 6), X(5, 8), X(4, 5), X(4, 8), X(3, 6), X(3, 7), X(3, 8)],
    kingPen: ['d7'],
  }),
];

export const RUN_REVENGE_37: RunDef = {
  id: 'revenge-37',
  name: 'The Perch',
  blurb: 'A pawn stands where no rank and no file can reach it.',
  allowedAbilities: ['bishop-step', 'magnet', 'rewind', 'decoy'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: LEVELS,
};

export default RUN_REVENGE_37;
