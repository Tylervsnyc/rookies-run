/**
 * revenge-45 — THE ROOD. Built 2026-09-08 for the signature pair
 * TWIN + SACRIFICE. Kit = twin / sacrifice / magnet / decoy
 * (`allowedAbilities` IS the kit). All four cards are LIVE.
 *
 * CONCEPT (A): an unbuilt pair the discovery harness has already proved can
 * gate — `sacrifice+twin` gates a generated L7 at 60% with a UNIQUE answer
 * under a kit where every single card reads 0%
 * (data/run-playtest/combo-library/SYNERGY.md). SACRIFICE has been half of
 * exactly one pair before this (dragon + sacrifice, The Briar, where its job
 * was to parachute a bomb into a hedge) and it is the thinnest socket in the
 * catalogue: one gating pair, one gated level, in 253. TWIN has been half of
 * two (knight-hop + twin, The Parapet's two-rook net; twin + rewind, The
 * Dogleg's undo) and in neither was the twin ever meant to DIE.
 *
 * THE VERB: AIM. Not crossing a wall (The Moat), not baiting hunters (The
 * Alley), not a poison timer (The Switchback), not blowing a hole (The
 * Briar), not caging with his own guard (The Alcove), not a double door (The
 * Millstone), not a two-rook net (The Parapet), not buying a body time (The
 * Lattice), not moving the wall (The Quarry), not an undo (The Dogleg), not a
 * suicide capture (The Picket), not a lure (The Pinch), not zugzwang (The
 * Niche), not halving his compass (The Inlay), not a body in a hole (The
 * Loophole), not standing on the square that kills you (The Embrasure). Every
 * one of those argues about WHERE ROOKIE GOES or WHAT THE KING DOES. This run
 * argues about WHERE SHE STANDS WHILE SOMETHING ELSE FIRES — because the one
 * thing the player gets to choose about a Twin is the square she is standing
 * on when she makes it.

 * ---------------------------------------------------------------------------
 * WHY THE PAIR WORKS, read out of lib/run/abilities.ts, not the card text:
 *   - `summonSpawnSquares` puts a TWIN on one of the EIGHT SQUARES AROUND
 *     ROOKIE and nowhere else. So the only thing the player chooses about a
 *     Twin is the square SHE is standing on when she makes it. That is the
 *     run.
 *   - `summonPieceFor('twin')` is a ROOK, and `applySacrifice` takes the
 *     blast area from `attackSquaresOfAlly` — for a rook, its whole rank and
 *     its whole file, each ray running until it meets stone, an ally, Rookie
 *     or its first enemy, which it kills. So the bomb is a CROSS with four
 *     arms of unlimited length, and ROOKIE'S OWN BODY STOPS AN ARM DEAD.
 *     Stand orthogonally beside the twin and you smother one arm; stand on
 *     the diagonal and all four fire. No other card in the game has a shape.
 *   - Both halves are FREE ACTIONS. Summoning does not end the turn and
 *     neither does detonating, so a Twin blown up costs NOTHING — the capture
 *     lands and Rookie still has her move. Every other capture in this kit
 *     costs her the move: her own, obviously, and a Twin's, because moving a
 *     body IS the turn's action.
 *   - `applySacrifice` stuns the king TWO turns on any victim (three at T5)
 *     where an ordinary capture stuns one. The blast is also the only capture
 *     in the game with NOTHING LEFT TO RECAPTURE: the body is consumed by its
 *     own explosion.
 *
 * CONSTANT SIGNATURE — THE ROOD AND THE CROOK. A rood is the cross that
 * stands over the screen at the head of a church. Every level of this run
 * draws one, free-standing, in the middle of the board: a VERTICAL ARM up the
 * e-file and a HORIZONTAL ARM along rank 6, crossing at e6, with one stone
 * left out of an arm on some levels — THE GAP — and the king's court tucked
 * into the CROOK on the far side of it. No other run has this silhouette; the
 * catalogue is bands (The Moat), columns (The Colonnade), boxes he sits
 * inside (The Vault, The Glasshouse), offset bars (The Switchback), shafts
 * (The Stacks), a hedge (The Briar), a single diagonal (The Cliff), roofs
 * (The Hayloft), rings (The Keep, The Cairn), burrows (The Warren), a tower
 * and stair (The Candle), a hearth, a quarry face, a rail (The Balcony), a
 * niche, a chequerboard inlay, a mass with a hole in it (The Loophole) and a
 * splayed slot (The Embrasure). A free-standing PLUS of stone is new, and it
 * is the shape of the answer as well as the shape of the problem.
 *
 * Three consequences, on every level:
 *   1. NO ROOK LINE CROSSES AN ARM. Rank 6 is stone from b6 or c6 to h6, so
 *      the c-, d-, f-, g- and h-files are all dead ends; the e-file is stone
 *      from e3 to e7. What is left is one or two roads up the west side and
 *      a crossing along ranks 1-2.
 *   2. THE CROOK HAS A LIP. g7 (the sill) and h8 (the cap) are stone on every
 *      level from L3 on, so his room is g8 with a BOLT-HOLE at h7 — and once
 *      h6 joins the arm, h7 is a square that NO rank, file or diagonal in the
 *      game can ever touch. g7, h6 and h8 are all stone; nothing can stand on
 *      any of them and no line runs through them.
 *   3. THE ARMS JAM HIS COURT. Every guard in the run is boxed by the cross
 *      itself: a pawn on c7 or d7 with stone under it can never march, a
 *      bishop on b5 with a4/c4 stone and a pawn above it can never move.
 *
 * THE GATE, in one paragraph. Because h7 is untouchable, the level is not
 * about reaching him — it is about the ONE TURN in which she is allowed to
 * threaten him. Threaten g8 on a turn of her own choosing and he is in the
 * hole before she moves again, and the level is dead: she can never cover
 * both squares, and he never comes out because nothing ever threatens him
 * there. So the arrival and the stun have to be the SAME TURN. A capture she
 * makes herself costs her move, so she arrives a turn late and the stun is
 * spent. A Twin's capture costs the turn too — a body-move IS the turn. A
 * Magnet pull is not a capture at all, and an Aegis shield is not a capture
 * either. The blast is the only free capture in the kit, and that is the
 * whole gate: measured, no-ability 0% on all four finales, and Sacrifice,
 * Magnet and Aegis alone 0% in eleven of twelve cells.
 *
 * THE FOUR FINALE DECISIONS (written before building; the contract):
 *   L7  THE JAMB, TWO WAYS. b6 is open, so there are two answers and they use
 *       different arms: stand on b6 and the body goes on b7 beside her, EAST
 *       ray into the jammed pawn on c7; or stand on b7 and the body goes on
 *       c8 above it, SOUTH ray into the same pawn. Either way the run up the
 *       b-file is the move the blast pays for.
 *   L8  ONE ROAD. b6 joins the arm, which takes L7's first answer away — she
 *       cannot stand on b6 and fire east because b6 is stone. The a-file is
 *       the only road, a7 the only square on it that is not already a threat,
 *       b7 the only plant. One answer instead of two, two hunters, and two
 *       moves less clock.
 *   L9  THE LONG RAY. The jamb moves to d7, three squares deep along rank 7,
 *       with b7 and c7 empty ground she has no reason to walk on. The body
 *       goes on a7 or b7 and fires EAST down the whole rank to find it: the
 *       one level where the blast travels further than she does, on the
 *       shortest clock in the run.
 *   L10 THE ARM POINTING DOWN. The jamb moves to b7 — the top of the road —
 *       where its capture squares are a6 and c6, one stone and one the last
 *       square of her own road, so a6 is denied, a8 is the threat and a7 is
 *       the only square in the level she may stand on. From a7 the body
 *       cannot go east the way it has all run; it goes UP, onto b8, a square
 *       she may never occupy herself, and fires DOWNWARD. The mirror of every
 *       other level here: the arm that matters points south, and the square
 *       she is buying is the one the body is standing on.
 *   Four different arms, four different plant squares, four different stand
 *   squares, and the road changes under her twice.
 *
 * ===========================================================================
 * MEASURED — 2026-09-08, difficulty=normal, `revenge.ts matrix`. The finale
 * row is the NUMBERS OF RECORD: 32 trials, `--jobs=1`, serial, 147s.
 *
 * THE GATE (L7-L10, kit cards at T1, the run's own four-card kit):
 *
 *   L    none    twin  sacrifice  magnet  aegis | twin+sacrifice
 *   L7     0%      9%         0%      0%     0% |            81%
 *   L8     0%      6%         0%      0%     0% |            72%
 *   L9     0%      9%         0%      0%     0% |            75%
 *   L10    0%      3%         0%      0%     0% |            75%
 *
 * ***THE GATE IS MISSED, BY ONE GAME IN THIRTY-TWO, ON TWO OF THE FOUR
 * FINALES.*** No-ability is 0% on all four. Sacrifice, Magnet and Aegis are
 * 0% in every one of twelve cells — Sacrifice because a kit-legal Sacrifice
 * with no body is a dead card, Magnet because it never produces a capture and
 * cannot land a piece on h7 (no line in the game runs through that square, so
 * it is not a legal landing), Aegis because there is nothing here whose reply
 * is worth surviving. TWIN ALONE reads 9% on L7 and L9 — 3 wins out of 32 —
 * against a contract of 8%, and 6% and 3% on L8 and L10. The contract says
 * <= 8% and 9% is not <= 8%, so this run ships as `idea`, not `built`, and
 * the miss is stated rather than rounded.
 *
 * WHAT THE 9% IS, exactly, because it is a real line and not noise about
 * nothing: the bot plants the Twin on a rank-8 square in the same turn that
 * ROOKIE captures the jammed pawn with her own move. Casts resolve before her
 * move, so the enemy phase sees both at once — the king stunned by her
 * capture and a second rook already sitting on his rank — and he cannot flee
 * from the body he would otherwise have run from. The Twin takes him next
 * turn. It needs her capture square to be adjacent to a rank-8 square with a
 * clear ray, which is true on L7 and L9 and rarer on L8 and L10, and the bot
 * finds it about one game in eleven. Closing it structurally needs the jamb
 * DEFENDED, and on this geometry the only squares that defend c7 or d7 are
 * b8, d8 and a8 — every one of them corks the rank she has to shoot down. So
 * the leak and the level are the same fact. The clock is not a lever on it
 * either: L7 at 8 moves read twin 13% / pair 78%, at 7 moves 9% / 81%, at 6
 * moves 16% / 66% — non-monotone, and the pair falls faster than the leak.
 *
 * THE PAIR reads 72-81%, mean 75.75%, with three of the four inside the
 * 60-80% band Tyler asked for after the Lattice and the Alcove came in at
 * 100%, and L7 one point over the ceiling. Nothing here is a giveaway and
 * nothing is a coin flip.
 *
 * THE TIER LADDER (L7-L10, 32 trials, one card pinned at a time):
 *
 *   twin:1       9 /  6 /  9 /  3     <- shipped tier
 *   twin:2       3 /  9 /  3 /  3
 *   twin:3       6 /  3 / 16 / 13
 *   twin:4       3 /  3 /  3 /  0
 *   twin:5      97 / 84 / 16 / 94     <- the gate is gone
 *   sacrifice:5  0 /  0 /  0 /  0     <- no cap needed, at any tier
 *
 * Sacrifice is not a solvent at ANY tier and needs no cap: it cannot be cast
 * without a body, and the kit contains exactly one body-maker. TWIN breaks
 * hard at T5 and the reason is one line of `summonTurnsFor`: 4/6/8/level/level
 * turns, so T5 is the first tier at which the body NEVER EXPIRES. A permanent
 * second rook is The Parapet's two-rook net, and a net catches him on g8/h7
 * without any stun at all — 97/84/94 on the three levels where both squares
 * have a line. (L9 stays at 16% at T5 because its clock is four moves; the
 * net needs more.) T3 is the first tier that leaks (16%/13% on L9/L10) — two
 * uses and an eight-turn body — so the highest contiguous cap the numbers
 * allow is `abilityTierCaps: { twin: 2 }`, and that is what ships. T4 reads
 * clean (3/3/3/0) but a cap has to hold for every tier below it and T3 does
 * not.
 *
 * THE LADDER (L1-L6, 16 trials):
 *
 *   L    none    twin  sacrifice  magnet  aegis | twin+sacrifice
 *   L1   100%    100%       100%    100%   100% |           100%   free
 *   L2   100%    100%       100%    100%   100% |           100%   free
 *   L3     0%    100%         0%    100%   100% |           100%   the road
 *   L4     0%    100%         0%    100%   100% |           100%   the road
 *   L5     0%    100%         0%     94%     0% |           100%   the cork
 *   L6     0%     19%         0%      0%     6% |            88%   the pair
 *
 * L1-L2 are free and nothing else is. L3-L5 are ROAD levels — his room is
 * f8/g8 there, which one rook line covers, so the only question is the cork
 * in the b-file — and they are honestly MULTI-ANSWER levels rather than
 * single-card puzzles: a cork can be dragged off the road (Magnet), survived
 * (Aegis) or traded off by a body that is not her (Twin). The header claims
 * no more than that. Two honest misses in this block, both reported rather
 * than hidden: L3 and L4 ended up with the SAME cork on the same road, so
 * they are one level twice with a different clock — the silhouette test says
 * redesign one, and it should be redesigned before this run is promoted; and
 * L5 is the only place where the cards separate cleanly (Aegis 0%, because
 * c7 is stone so there is no rank to pull the b7 cork off and no shield worth
 * spending, while Twin and Magnet both get through).
 *
 * L6 is the run's teaching level and the only mid-run level with the
 * bolt-hole: 0% with no ability, 0% for Sacrifice and Magnet, 6% for Aegis,
 * 19% for Twin and 88% for the pair, on a fourteen-move clock. It is the
 * finale's idea with the pressure taken off.
 *
 * FULL RUNS (`revenge.ts runs --runs=40`, normal):
 *   random picks             2/40 = 5%  full clears
 *   pool=twin,sacrifice      2/40 = 5%  full clears
 *
 * Both numbers are FAR below this catalogue's 12-55% and they are low for a
 * reason worth writing down, because it is the cost of this design and not a
 * bug. The pair-pool run is no better than the random one, and the per-level
 * breakdown says exactly why: L3 drops from 88% (random) to 65% (pair pool),
 * because L3-L5 are keyed on Magnet and Aegis and a player who has taken only
 * the signature pair has no answer to a road cork. The run punishes the
 * player who commits to the combo early — which is the opposite of what a
 * combo run should do. THE CHOKE POINT IS L6: 42% with random picks
 * (move-limit 18/18), and the fail mode is not a short clock, it is the
 * bolt-hole. A bot that steps onto rank 8 at the wrong moment has lost the
 * level permanently and then wanders until the clock ends. That is the design
 * working as intended on the finale and working too harshly at L6, where the
 * player is still learning what the hole is. If this run is promoted, L6
 * wants a cork on rank 8 to shelter behind — the thing L7 has and L6 does
 * not.
 *
 * ===========================================================================
 * DEAD ENDS (what was measured and thrown away)
 *
 * 1. A CORK ON RANK 8 IS A FREE WIN UNLESS IT IS DEFENDED TWICE, AND ON THIS
 *    GEOMETRY IT CANNOT BE. Four finale builds put a boxed bishop on b8 or f8
 *    to shelter behind, and every one of them read 94-100% FOR NO ABILITY.
 *    The reason is one sentence: the cork stands on a square that attacks his
 *    cell, so capturing it is a capture-stun delivered ON the firing square,
 *    and a stunned king cannot flee. An undefended cork is not a door, it is a
 *    doorbell. Defending it needs two jammed guards, because a single
 *    defender's recapture LANDS ON THE CORK SQUARE and is then undefended
 *    itself — a Twin trade followed by a Rookie trade walks through it (twin
 *    alone read 50-100% on three such builds). And the only squares that can
 *    defend a rank-8 cork here are knights on d7/h7 and bishops on e7/g7:
 *    e7 and g7 are the cross itself, h7 is the bolt-hole, and a knight on d7
 *    with b6/c5/e5/f6 open is a HUNTER, not a guard — the traces show it
 *    leaving its post on move two every game. Removing the cork entirely, and
 *    building the gate on the TIMING of the stun instead of on a door, is
 *    what made every number in the table above.
 *
 * 2. A WANDERING GUARD IS NOT A GUARD. L4's first build read 100% for no
 *    ability with a bishop corking the b-file on b5. The trace is three
 *    moves long and comic: b5 -> d3 -> c4, the bishop simply walked away down
 *    its own open diagonal and she strolled up the empty road. Bishops box
 *    cheaply (a4 and c4 stone, an ally above) and knights box expensively
 *    (five squares), and this run uses bishops and jammed pawns everywhere
 *    for that reason. Corollary from L4's second build: with
 *    `enemiesPerTurn: 1` a defender may simply choose not to recapture — the
 *    enemy side takes ONE action and a pawn march can out-priority the
 *    reply — so a level whose gate depends on a recapture must run two
 *    enemies a turn.
 *
 * 3. THE VERTICAL ARM MUST NOT REACH RANK 3. With the arm at e3-e7 the board
 *    is cut in half above rank 2, and a Rookie who starts on the east side
 *    has to walk down to rank 1 and back up the far side. Shortening it to
 *    e5-e7 fixed the walk and made the FINALE WORSE, not better: L7 78% ->
 *    63%, L8 72% -> 54%, L10 75% -> 38%, with the singles unchanged. The
 *    thirteen extra empty squares are thirteen more candidates in every
 *    rollout and the bot stops finding the plant square. That is The
 *    Warren's finding (an open board is unmeasurable for placement cards)
 *    reproduced on a kit whose placement card only ever has EIGHT targets —
 *    so the effect is not about the card's target count at all, it is about
 *    the size of the move tree around it. e3-e7 stayed.
 *
 * 4. A LONG CLOCK MAKES A BOLT-HOLE LEVEL HARDER, NOT EASIER. L3's first
 *    build was the finale's geometry with sixteen moves and one enemy, meant
 *    as the gentlest possible teaching level. It read 0% FOR THE PAIR. The
 *    trace shows the bot shuffling g5-h5-g5-h5 in the dead corner of the
 *    board for eleven moves. `fastScore` pays +25 for a move that attacks the
 *    king, so slack is spent walking onto rank 8, which is precisely the move
 *    that ends a bolt-hole level for ever. On these levels the clock is not
 *    a difficulty knob, it is a leash: L6 runs at 14 and reads 88%, L7 at 7,
 *    L9 at 4.
 *
 * 5. FIRING FROM THE BOTTOM OF THE BOARD IS PROVABLE AND UNFINDABLE. One L8
 *    build put the jammed pawn on b4 with the whole a-file as the run-up:
 *    stand on a4, body on b5, blast, then one move the length of the board
 *    onto rank 8. It is a clean line, it closes the Twin leak completely
 *    (nothing planted on rank 4 has a line to his corner), and it read 25-50%
 *    for the pair at every clock from 7 to 11. The bot will not spend a body
 *    on a payoff four ranks away from the payoff's purpose. This is The
 *    Glasshouse's rule again (design the payoff as a reaction to a present
 *    threat, resolved in one turn) with a new edge on it: the blast and the
 *    ARRIVAL have to be within one move of each other, not just within one
 *    turn.
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
} from '../../run-kit';
import type { Coord } from '../../types';

/** 'f4' -> {file:6, rank:4}. Authoring convenience only. */
const sq = (name: string): Coord => X(name.charCodeAt(0) - 96, Number(name.slice(1)));

/** Stone, by name. */
const S = (...names: string[]): Coord[] => names.map(sq);

/** His cell and the bolt-hole no line in the game reaches. */
const CELL = ['g8', 'h7'];

export const RUN_REVENGE_45: RunDef = {
  id: 'revenge-45',
  name: 'The Rood',
  blurb:
    'A cross of stone stands on the board and he keeps his court in the crook of it. You cannot walk to the square that matters — but you can build something there, and it goes off pointing four ways at once.',
  allowedAbilities: ['twin', 'sacrifice', 'magnet', 'aegis'],
  // Measured L7-L10, 32 trials, one card pinned at a time. Twin's ladder is
  //   T1  9 / 6 / 9 / 3      T2  3 / 9 / 3 / 3      T3  6 / 3 / 16 / 13
  //   T4  3 / 3 / 3 / 0      T5 97 / 84 / 16 / 94
  // T5 is the first tier at which `summonTurnsFor` gives the body a life of
  // `level` rather than 4/6/8 turns — a permanent second rook is The
  // Parapet's two-rook net, and a net takes g8/h7 with no stun at all. T3
  // already leaks (16%/13%) on two uses and an eight-turn body, so the
  // highest CONTIGUOUS cap the numbers allow is 2. Sacrifice reads 0/0/0/0 at
  // T5 and needs no cap: it cannot be cast without a body, and this kit holds
  // exactly one body-maker.
  abilityTierCaps: { twin: 2 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE CROSS. The silhouette, for free. He stands still on the arm's
    // shoulder and every file she needs is open.
    make(1, [king(7, 8), pawn(3, 3), pawn(6, 2)], {
      ...STILL,
      moveLimit: 12,
      hazards: S('e3', 'e4', 'e5', 'e6', 'e7', 'c6', 'd6', 'f6', 'g6'),
    }),
    // L2 — THE CROOK. Same cross, and now he runs. His room is the two
    // squares f8/g8 on rank 8 — one rook line covers both, so this is still
    // free, and it teaches the shape she will spend the run trying to reach.
    make(2, [king(7, 8), bishop(2, 2), pawn(4, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S('e3', 'e4', 'e5', 'e6', 'e7', 'c6', 'd6', 'f6', 'g6', 'g7', 'h8', 'h7'),
      kingPen: ['f8', 'g8'],
    }),
    // L3 — THE ROAD (first thinking; several cards answer it). No bolt-hole
    // yet — his room is f8/g8 and one rook line covers both — so the level is
    // the ROAD. The arm takes the c-, d-, f-, g- and h-files and a5 is stone,
    // so the b-file is the only way north, and a boxed bishop stands in it on
    // b5 (a4 and c4 stone below it, a jammed pawn on a6 above) with that same
    // pawn defending it. Capture it and the pawn collects. Anything that
    // moves it, shields the reply, or makes a second body that can eat the
    // reply gets her past; nothing does it bare.
    make(3, [king(7, 8), bishop(2, 5), pawn(1, 6), pawn(6, 3)], {
      ...FLEE,
      moveLimit: 14,
      enemiesPerTurn: 2,
      hazards: S('e3', 'e4', 'e5', 'e6', 'e7', 'c6', 'd6', 'f6', 'g6', 'h6', 'g7', 'h8', 'a5', 'a4', 'c4'),
      kingPen: ['f8', 'g8'],
    }),
    // L4 — OFF THE ROAD (magnet KEY). No bolt-hole on this level — his room
    // is f8/g8 and one rook line covers both — so the whole level is the
    // ROAD. a5 is stone and the arm takes the c-, d-, f-, g- and h-files, so
    // the b-file is the only way north, and a bishop stands in it on b5,
    // defended by a pawn on a6 that can never march. Capture it and the pawn
    // collects. Magnet pulls along HER OWN lines, so the answer is to meet
    // the cork on the RANK: stand on rank 5 east of it and drag it off.
    make(4, [king(7, 8), bishop(2, 5), pawn(1, 6)], {
      ...FLEE,
      moveLimit: 13,
      enemiesPerTurn: 2,
      hazards: S('e3', 'e4', 'e5', 'e6', 'e7', 'c6', 'd6', 'f6', 'g6', 'h6', 'g7', 'h8', 'a5', 'a4', 'c4'),
      kingPen: ['f8', 'g8'],
    }),
    // L5 — EAT THE REPLY (aegis KEY). Same one road, and the cork has moved to
    // the top of it on b7, where the only square she can ever see it from is
    // b6 — one square away, which is exactly the range Magnet refuses (a pull
    // needs two squares of run-up, and c7 is stone so there is no rank to
    // meet it on). A jammed pawn on c8 answers the capture. Take it anyway
    // and put the shield up.
    make(5, [king(7, 8), bishop(2, 7), pawn(3, 8)], {
      ...FLEE,
      moveLimit: 13,
      enemiesPerTurn: 2,
      hazards: S('e3', 'e4', 'e5', 'e6', 'e7', 'c6', 'd6', 'f6', 'g6', 'h6', 'g7', 'h8', 'a5', 'a6', 'a8', 'c7'),
      kingPen: ['f8', 'g8'],
    }),
    // L6 — THE FIRST SHOT (twin + sacrifice, taught, with the clock wide
    // open). The cap and the sill are in: h7 is a bolt-hole no rank, file or
    // diagonal in the game can ever touch (g7, h6 and h8 are all stone), so
    // the instant she threatens g8 without holding him, he steps into it and
    // the level is over. Her own capture costs her move, so the stun is spent
    // before she arrives. A Twin blown up costs her NOTHING — the body and the
    // blast are both free actions — so the stun and the arrival happen on the
    // same turn. Stand beside the jammed pawn, make the body, blow it up,
    // and run up the file with him still holding his head.
    make(6, [king(7, 8), pawn(3, 7), pawn(6, 3)], {
      ...FLEE,
      moveLimit: 14,
      hazards: S('e3', 'e4', 'e5', 'e6', 'e7', 'c6', 'd6', 'f6', 'g6', 'h6', 'g7', 'h8'),
      kingPen: CELL,
    }),
    // ── THE FINALE ──────────────────────────────────────────────────────────
    // ROOD (finale form): the vertical arm e3-e7, the horizontal arm b6-h6,
    // the sill g7 and the cap h8. h7 is then a BOLT-HOLE that no rank, file
    // or diagonal in the game can ever touch (g7, h6 and h8 are all stone),
    // and his pen is g8 + h7. So the level is not about reaching him; it is
    // about the ONE TURN in which she is allowed to threaten him. Threaten g8
    // on any turn of her own choosing and he is in the hole before she moves
    // again, and the level is dead. A capture she makes herself costs her
    // move, so the stun is spent by the time she arrives. A Twin blown up
    // costs NOTHING — body and blast are both free actions — so the stun and
    // the arrival happen on the same turn. That is the whole gate.
    //
    // L7 — THE JAMB. One jammed pawn on c7 (c6 is stone under it, so it can
    // never march) and two roads to fire from: stand on b6 and the body goes
    // beside her on b7, east ray into the pawn; or stand on b7 and the body
    // goes on c8, south ray into it. Either way the run up the b-file is the
    // same move that the blast pays for.
    make(7, [king(7, 8), pawn(3, 7), knight(4, 4), pawn(6, 3)], {
      ...FLEE,
      moveLimit: 7,
      enemiesPerTurn: 2,
      hazards: S('e3', 'e4', 'e5', 'e6', 'e7', 'c6', 'd6', 'f6', 'g6', 'h6', 'g7', 'h8'),
      kingPen: CELL,
    }),
    // L8 — ONE ROAD. b6 joins the arm, so the b-file is gone and the a-file is
    // the only way from her half of the board to his. That takes L7's second
    // answer away: she cannot stand on b6 and fire east any more, because b6
    // is stone. She has to come up the a-file to a7 — the one square on the
    // road that is not already a threat — and put the body on b7 beside her,
    // where its east ray runs into the jamb. Two hunters and two moves less
    // clock than L7, on a level with one answer instead of two.
    make(8, [king(7, 8), pawn(3, 7), knight(4, 4), knight(3, 2), pawn(6, 3)], {
      ...FLEE,
      moveLimit: 7,
      enemiesPerTurn: 2,
      hazards: S('e3', 'e4', 'e5', 'e6', 'e7', 'b6', 'c6', 'd6', 'f6', 'g6', 'h6', 'g7', 'h8'),
      kingPen: CELL,
    }),
    // L9 — THE LONG RAY. The only jammed piece left is on d7, three squares
    // deep along rank 7, and b7 and c7 are empty ground she has no reason to
    // stand on. The body has to be planted on a7 or b7 and fire EAST down the
    // whole rank to find it — the one level where the blast travels further
    // than she does.
    make(9, [king(7, 8), pawn(4, 7), knight(3, 4), knight(7, 4), knight(1, 5), pawn(7, 3), pawn(1, 4)], {
      ...FLEE,
      moveLimit: 4,
      enemiesPerTurn: 2,
      hazards: S('e3', 'e4', 'e5', 'e6', 'e7', 'b6', 'c6', 'd6', 'f6', 'g6', 'h6', 'g7', 'h8'),
      kingPen: CELL,
    }),
    // L10 — THE BODY ON RANK 8. b6 is stone again, so the a-file is the road
    // — and the jamb has moved to b7, where it can never march (b6 under it)
    // and where its two capture squares are a6 and c6: one of them is stone
    // and the other is the last square of her own road. So a6 is denied, a8
    // is the threat, and a7 is the only square in the level she may stand on.
    // From a7 the body cannot go east along the rank the way it has all run;
    // it goes UP, onto b8, a square she may never occupy herself, and fires
    // DOWNWARD into the jamb. The mirror of every other level here: the arm
    // that matters points south, and the square she is buying is the one the
    // body is standing on.
    make(10, [king(7, 8), pawn(2, 7), knight(4, 4), pawn(7, 3), pawn(1, 3)], {
      ...FLEE,
      moveLimit: 6,
      enemiesPerTurn: 2,
      hazards: S('e3', 'e4', 'e5', 'e6', 'e7', 'b6', 'c6', 'd6', 'f6', 'g6', 'h6', 'g7', 'h8'),
      kingPen: CELL,
    }),
  ],
};

export default RUN_REVENGE_45;
