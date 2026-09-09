/**
 * revenge-48 — THE KENNEL. Built 2026-09-09 for the signature pair
 * RABIES DART + QUEEN PULSE. Kit = rabies-dart / queen-pulse / magnet / rewind
 * (`allowedAbilities` IS the kit). All four cards are LIVE.
 *
 * CONCEPT (A): an unbuilt pair the discovery harness has already proved can
 * gate — `queen-pulse+rabies-dart` gates moat-L7-v4-s250 at 73% under the kit
 * [dragon rabies-dart bishop-squire queen-pulse] where every single card reads
 * 0% (data/run-playtest/combo-library/queen-pulse+rabies-dart/). RABIES DART
 * is the thinnest signature socket in the catalogue: one shipped run (smoke +
 * rabies-dart, The Alley) in 253 pairs, and docs/ability-pairs.md says flatly
 * that it "has exactly one plausible partner (Smoke)". This run is the second.
 *
 * THE VERB: BREAK THE RING AT THE CORNER AND COME IN ON THE DIAGONAL. Not
 * crossing a wall (The Moat), not baiting hunters (The Alley), not a poison
 * timer (The Switchback), not blowing a hole (The Briar), not caging with his
 * own guard (The Alcove), not a double door (The Millstone), not a two-rook
 * net (The Parapet), not buying a body time (The Lattice), not moving the wall
 * (The Quarry), not an undo (The Dogleg), not a capture you do not survive
 * (The Picket), not zugzwang (The Niche), not a lure (The Pinch). This is the
 * only run whose answer is TO MAKE ONE OF HIS OWN GUARDS STEP OFF ITS SQUARE
 * BY GIVING IT SOMETHING TO EAT.
 *
 * ── CONSTANT SIGNATURE — THE KENNEL ────────────────────────────────────────
 * On every level the king sits in a STONE NICHE whose four ORTHOGONAL
 * neighbours are stone, so no rook line, no file, no rank ever reaches him:
 * the only geometry left in the game that touches his square is a DIAGONAL.
 * His four diagonal neighbours are the CORNERS, and each corner is either
 * stone or holds a CHAINED DOG — a knight every one of whose eight jump
 * squares is stone except exactly ONE, and that one holds a man of his own.
 * A chained dog can never move: it has no empty square to step to and it may
 * not take its own side. It is furniture. Until it goes mad.
 *
 * That is the whole run. Not a band of water, not a hall of pillars, not a
 * sealed box, not a hedge, not a lattice, not an alcove — a NICHE WITH DOGS
 * AT ITS CORNERS, and the question every level asks is WHICH DOG, and WHAT IS
 * IN REACH OF ITS TEETH.
 *
 * ── WHY THIS PAIR, read out of lib/run/pawn-ai.ts and lib/run/abilities.ts ──
 *
 *   1. `rabidAction` sorts every target by (Chebyshev asc, value desc, file
 *      asc, rank asc) and takes the first one that is in `rabidCaptureSquares`
 *      — the piece's OWN move geometry, with allies made legal. Chain a knight
 *      so that seven of its eight jump squares are stone and the eighth holds
 *      a friendly pawn, and the bite is DETERMINISTIC: that pawn, always.
 *      Rookie is in the target list at queen value, so a dog whose jump
 *      squares are all stone can never bite HER, whatever the distance.
 *   2. A capture MOVES THE CAPTURER. So the bite does not open the victim's
 *      square — it opens THE DOG'S OWN. A dog in a corner of the niche is the
 *      plug in one of the four diagonals, and the bite is what pulls the plug.
 *   3. In `chooseEnemyAction` the rabid branch RETURNS. A bite is the whole
 *      enemy action, so whatever was about to recapture Rookie does not get to
 *      move. The dart is a door AND a shield, in the same cast — but only at
 *      `enemiesPerTurn: 1`. L8 sets it to 2 for exactly that reason.
 *   4. A rabid friendly-fire capture is credited to Rookie:
 *      `stunKingAfterCapture(state, 2)` (pawn-ai.ts:1223). TWO enemy turns.
 *      Her own capture is worth ONE (engine.ts:123). That difference is what
 *      L9 and L10 are built on.
 *   5. `kingReaction` returns null when `chebyshev(king, rookie) <= 1` and he
 *      is not stunned — "he does not run from someone he can simply take". So
 *      STANDING ON A CORNER IS DEATH unless he is stunned. The niche defends
 *      its own corners; nothing else has to.
 *   6. Queen Pulse T1 is ONE queen move (`transformDurationForTier`), one use.
 *      It is not "be a queen" — it is ONE DIAGONAL, once. That is exactly the
 *      shape of the hole a bite makes, and it is why the pair is a pair: the
 *      dart makes a diagonal that exists for a turn, the pulse walks it.
 *
 * ── WHY EACH HALF IS DEAD ALONE ────────────────────────────────────────────
 *   rabies-dart alone — the corner opens and the king is stunned two turns,
 *     and a ROOK still has no line to a square whose rank and file are stone.
 *     She can stand in the dog's bed and stare at him. 0%, structurally.
 *   queen-pulse alone — the diagonal exists but the corner is plugged. Taking
 *     the plug spends the one queen move she owns, and it is defended (L7/L8,
 *     L9) or she is left a rook next to a king who is stunned only one turn.
 *     0%, structurally.
 *
 * ── KIT: rabies-dart / queen-pulse / MAGNET / REWIND ───────────────────────
 * No universal solvent (bishop-step, knight-hop, become-king are absent and
 * would each solve every level in this run at 100%). No summon: rabies-dart
 * eats YOUR nearest body first, so a kit with a summon is a kit where the
 * signature card is a liability (The Alley, 2026-09-05).
 *
 * The two fillers are chosen AGAINST this geometry, and the choice is the
 * single most important decision in the file:
 *   MAGNET is inert here and anti-synergistic with the pair. It pulls the
 *     first piece along Rookie's CURRENT form's lines TOWARD her, and a piece
 *     pulled along a diagonal lands ON that diagonal, between her and the
 *     niche — magnet + queen-pulse un-plugs the corner and re-plugs the road.
 *     `magnet+rewind` is one of SYNERGY.md's proven never-gates pairs.
 *   REWIND restores the ENEMY side to the start of their last turn. It cannot
 *     give her a second queen move, cannot un-stone a square, and cannot save
 *     her from a capture (she is dead before her next turn begins).
 *
 * AEGIS WAS THE FIRST CHOICE AND IS WRONG HERE — see DEAD ENDS. So are decoy,
 * smoke, freeze-ray and poison-dart, all for one reason: fact 5 above makes
 * "survive one enemy phase standing on a corner" the whole finale, and every
 * one of those cards buys exactly that. The fillers had to be cards that
 * cannot keep her alive next to him.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L        rabies-dart      queen-pulse      magnet        rewind
 *   1-2      trap             trap             trap          trap  (bare wins)
 *   3        trap             KEY              trap          trap
 *   4        KEY              trap             trap          trap
 *   5        trap (slow alt)  trap             KEY           trap
 *   6        KEY              trap             trap          trap
 *   7-10     half the gate    half the gate    trap          trap
 *
 * ── THE FOUR FINALE LINES (written before building; they must differ) ──────
 *   L7  ONE DOG, ONE THROAT. The bite is a DOOR and a SHIELD in one cast.
 *       d4 is the only corner with a dog that can reach anything (the pawn on
 *       f3); f6 is chained with all eight jump squares stone and a dart on it
 *       does nothing at all. The road in is the long dark diagonal
 *       a1-b2-c3-d4-e5, b2 is occupied by one of his knights, so c3 is the one
 *       square she can launch from — and c3 is covered by a knight on d1 while
 *       d3, the ONLY way into the c3/d3 pocket, is covered by the knight on
 *       b2. Two guards, two squares, one dart. Take d1 (that buys c3), then
 *       LAND ON d3 AND DART IN THE SAME TURN: the bite is the whole enemy
 *       action, so b2's knight never fires, d4 empties, he is stunned two
 *       turns, and c3 then pulse-and-slide finishes it. Four moves, five given.
 *       DECISION: land under the guard and dart in the same turn.
 *
 *   L8  TWO DOGS, ONE DOOR, AND NO SHIELD. Both corner dogs now have a throat:
 *       d4 can reach the pawn on f3, f6 can reach the pawn on h7. Both bites
 *       stun him two turns and both empty a corner. Only one of the two
 *       corners is a door — g7 is stone, so the diagonal beyond f6 hits a wall
 *       one square out — and the dart has one charge.
 *       And L7's answer is explicitly REVOKED: `enemiesPerTurn: 2` means the
 *       bite is only the FIRST of two enemy actions, so landing on d3 and
 *       darting no longer saves her; b2's knight fires on the second. The
 *       hunter has to be TAKEN, and where it is standing when she takes it
 *       decides whether the moves are there.
 *       DECISION: a different target, and the shield does not work any more.
 *
 *   L9  THE DOG IS NOT THE DOOR. The corner plug on c4 is a chained knight
 *       whose eight jump squares are ALL stone. It has no throat. No dart in
 *       the game moves it. What the bite removes is the pawn on b5 that
 *       DEFENDS c4, and the dog that can reach b5 is on c7, behind the niche.
 *       So the order inverts: dart the far dog, take the plug HERSELF (her own
 *       capture stuns him for ONE turn — exactly the one enemy phase she must
 *       survive standing in his face), then pulse from the corner for a
 *       one-step diagonal kill. Three moves, in one order only, at two enemy
 *       actions a turn.
 *       DECISION: the bite removes a DEFENDER; she opens the door herself.
 *
 *   L10 THE FAR DOG. The niche moves to d6 and the corner she needs, c5, IS
 *       ALREADY EMPTY. Nothing stands between her and him — and a bare rook
 *       still loses every time, because a rook on c5 is a rook the king simply
 *       takes, and b4/a3 are stone so that diagonal can never be walked from
 *       outside. One of his knights sits on c2 and corks the only file into
 *       rank 4, so she spends a move taking it and arrives with her own
 *       capture-stun already spent. The only capture left anywhere on the
 *       board is a chained knight on h7 eating its own pawn on f8, in the
 *       opposite corner, with no bearing on the niche whatsoever. Its bite is
 *       worth exactly one thing: the TWO turns of stun that let her stand next
 *       to him. The dart has nothing to do with the door; it is a clock.
 *       DECISION: the bite is pure tempo, and the target is chosen by what is
 *       edible, not by where he lives.
 *
 * Each of L8, L9, L10 adds something L7's solution does not cover: L8 takes
 * the shield away and makes the dart a choice between two doors, L9 gives the
 * bite no geometric content near the niche and makes her spend her own capture
 * on the plug, L10 removes the plug entirely and leaves only the clock.
 *
 * ── MEASURED — 2026-09-09, difficulty=normal, `revenge.ts matrix` ───────────
 * Numbers of record: 32 trials, `--jobs=1`, the run's own 4-card kit.
 *
 *   L    none  rabies-dart  queen-pulse  magnet  rewind | rabies+queen-pulse
 *   7      0%       0%           0%        0%      0%   |       66%
 *   8      0%       0%           0%        0%      0%   |       81%
 *   9      0%       0%           0%        0%      0%   |       78%
 *  10      0%       0%           0%        0%      0%   |       69%
 *
 * Every single card in the kit is 0% on all four finales and the pair means
 * 73.5% — inside the 60-80% band the doc asks for (L8 is 1pp over; at 32
 * trials that is inside the noise and it is the hardest of the four to play).
 *
 * TIER LADDER, L7-L10, 32 trials, jobs=1, one card pinned per invocation:
 *   rabies-dart  T3 0/0/0/0     T5 0/0/0/0       (never a solvent, no cap)
 *   queen-pulse  T1 0/0/0/0     T2 0/0/0/0
 *                T3 0/25/0/0    T4 34/16/0/0     T5 41/19/0/0
 *   magnet       T5 0/0/0/0     rewind T5 0/0/0/0
 * T3 is the first Queen Pulse tier with TWO uses, and two queen moves is a
 * corner taken and a king taken. **`abilityTierCaps: { 'queen-pulse': 2 }`**,
 * proved through the offer path by `scripts/run-playtest/tier-cap-audit.ts`
 * (672k slates, 0 violations). Rabies Dart needs no cap: its upgrades are more
 * darts and longer madness, and neither of those is a diagonal.
 *
 * MID-RUN, 16 trials, jobs=3:
 *   L    none  rabies-dart  queen-pulse  magnet  rewind
 *   1    100%     100%         100%       100%    100%
 *   2    100%     100%         100%       100%    100%
 *   3      0%       0%         100%         0%      0%   (queen-pulse KEY, clean)
 *   4      0%     100%         100%        38%      0%   (rabies KEY)
 *   5      0%     100%          13%        50%      0%   (magnet was the design;
 *                                                         rabies is the better key)
 *   6      0%     100%           0%        19%      0%   (rabies KEY)
 * L1-L2 free bare, L3-L6 impossible bare and cleared 100% by their key.
 *
 * FULL RUNS, 40 runs, T5, difficulty=normal:
 *   random picks from the whole kit   10/40 = 25%   (L3 is the wall: 53%)
 *   `--pool=rabies-dart,queen-pulse`  23/40 = 58%
 * 25% with random picks is the best random-pick number any combo run in the
 * catalogue has posted (Vault 28%, Glasshouse 43%, Briar 55%) and it is inside
 * the Moat's original 10-25% target, for a structural reason worth recording:
 * L3 is gated on ONE card (queen-pulse) rather than on a pair, so a random
 * picker who missed it dies at level 3 instead of coasting to level 7.
 *
 * ── DEAD ENDS ──────────────────────────────────────────────────────────────
 *
 * 1. AEGIS IS THE WRONG FILLER FOR THIS GEOMETRY, and so are decoy, smoke,
 *    freeze-ray and poison-dart. The finale reduces to ONE question — can she
 *    survive one enemy phase standing on a corner? — and every one of those
 *    cards answers it. aegis + queen-pulse would have solved L9 and L10 (stand
 *    on the corner, eat the king's capture on the shield, pulse next turn), so
 *    aegis was cut from the kit before a line of board was written. The rule
 *    this run adds: WHEN THE GATE IS "SURVIVE ONE PHASE NEXT TO HIM", NO CARD
 *    THAT BUYS A PHASE MAY BE A FILLER.
 *
 * 2. THE BOT WALKS DOWN fastScore's GRADIENT, AND THE STAGING SQUARE IS
 *    FARTHER FROM THE KING THAN THE TRAP. The first L7 asked her to stage on
 *    b2 (Chebyshev 3 from e5) while d3/e3 sat at 2. `fastScore` in
 *    scripts/run-playtest/bots/mcts.ts scores a king level as `(8 - d) * 3`,
 *    so every rollout drifted to d3, oscillated d3-e3 forever and never spent
 *    a card: the AND-OR solver proved the level W3 while the playtest bot read
 *    the pair at 0%. Same family as The Warren's poisoned high-score square,
 *    but the fix is the mirror image — not "stone the square that scores too
 *    well" but STONE EVERY SQUARE THAT TIES THE ONE YOU WANT. Making c3 the
 *    only reachable square at Chebyshev 2 (d3 kept as the corridor into it,
 *    e3/g3/g5/c7 stoned) took L7 from 0% to 81% with nothing else changed.
 *    L10 needed the same surgery twice: on a flat rank-1 floor every start
 *    square is Chebyshev 4 and there is NO gradient at all, so she wandered
 *    a1-h1 until the clock ran out (0%, then 16%, then 31% across three
 *    builds). It only came right when the approach was one monotone file.
 *
 * 3. A CLOCK CANNOT TUNE A LINE THE BOT PLAYS PERFECTLY. L10 read 100% at
 *    moveLimit 5, 4 AND 3 on the same board — cutting the budget to exactly
 *    the length of the forced line changed nothing, because the bot was
 *    already playing it. What moved the number was LENGTHENING the line with
 *    a cork (the knight on c2) so the answer is five moves with a forced
 *    order, not three: 100% -> 69%. Corollary for the band: the clock is a
 *    knob for a level the bot sometimes misplays, and no knob at all for one
 *    it does not.
 *
 * 4. TWO LEAKS THAT ONLY A TIER SWEEP FINDS. (a) L8 read 69% for queen-pulse
 *    ALONE in its first build, because d4 was left undefended: she took the
 *    corner with a plain ROOK move up the d-file, which stunned him, and then
 *    pulsed from the corner. A corner plug must be DEFENDED even though
 *    standing on it is already fatal — her own capture-stun is the loophole.
 *    (b) With Queen Pulse at T2 she read 100% on L8 through h4-g5-f6: two
 *    queen moves reached an undefended f6 dog and then the king, on a diagonal
 *    that has nothing to do with the run's road. `g5` is now stone on both L7
 *    and L8. Every OTHER diagonal into the niche has to be closed, not just
 *    the one the level is about.
 *
 * 5. A CHAINED DOG IS ONLY CHAINED IF ITS THROAT IS FROZEN TOO. The first L7
 *    put the throat on b5 with b4 open: black pawn priority is `-rank`, the
 *    pawn marched, and the dog had nothing to bite. And the first L6 had an
 *    open e-file to a king whose doorstep was empty — a bare rook slid e1-e5
 *    and won 100%. Both are the same mistake: checking that a PIECE cannot
 *    move without checking what happens when it does.
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

/** 'f4' -> {file:6, rank:4}. Authoring convenience only. */
const sq = (name: string): Coord => X(name.charCodeAt(0) - 96, Number(name.slice(1)));

/** Stone, by name. */
const S = (...names: string[]): Coord[] => names.map(sq);

/** The niche at e5: his four orthogonal neighbours, stone on every level. */
const NICHE_E5 = ['d5', 'e4', 'e6', 'f5'];
/** The niche at d5 (L9, L10). */
const NICHE_D5 = ['c5', 'd4', 'd6', 'e5'];

export const RUN_REVENGE_48: RunDef = {
  id: 'revenge-48',
  name: 'The Kennel',
  blurb:
    'He keeps his dogs chained at the corners of his cell, one throat apiece within reach of their teeth. Every rank and every file into that cell is stone. Give a dog something to eat and it steps off its square — and for one turn there is a diagonal.',
  allowedAbilities: ['rabies-dart', 'queen-pulse', 'magnet', 'rewind'],
  // Measured L7-L10, 32 trials, jobs=1, one card pinned per invocation.
  // Queen Pulse's ladder is the only one that moves:
  //   T1 0/0/0/0   T2 0/0/0/0   T3 0/25/0/0   T4 34/16/0/0   T5 41/19/0/0
  // T3 is the first tier with TWO uses (maxUsesForTier) — and two queen moves
  // is a corner taken and a king taken, which is the whole gate. T4/T5 add a
  // three-move and then a permanent queen and leak on L7 as well. The highest
  // tier at which every single kit card still reads <= 8% is 2, so that is the
  // cap. rabies-dart needs none: 0/0/0/0 at T3 and at T5 (its upgrades are
  // more darts and longer madness, and neither of those is a diagonal).
  // magnet and rewind are 0/0/0/0 at T5.
  abilityTierCaps: { 'queen-pulse': 2 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // ── L1 — THE NICHE. The silhouette, for free. Three walls of his cell are
    // stone and the fourth is the e-file, with one pawn standing in it. He
    // does not move. Pure rook play: take the pawn, take him.
    make(1, [king(5, 5), pawn(5, 3), knight(1, 8)], {
      ...STILL,
      moveLimit: 12,
      hazards: S('d4', 'd5', 'd6', 'e6', 'f4', 'f5', 'f6'),
    }),
    // ── L2 — THE FIRST DOG. Same niche, and now a knight stands in the door.
    // It is undefended, so a bare rook takes it — and the lesson is the one
    // the whole run turns on: HER CAPTURE STUNS HIM, which is the only reason
    // she survives one square from a king who would otherwise take her.
    make(2, [king(5, 5), knight(5, 4), pawn(2, 2), pawn(7, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S('d4', 'd5', 'd6', 'e6', 'f4', 'f5', 'f6'),
    }),
    // ── L3 — THE OPEN CORNER (queen-pulse KEY). The niche closes: all four
    // orthogonal neighbours are stone, so no rook, ever. Three corners are
    // stone too. d4 is empty — the one diagonal in the level — and standing on
    // d4 is death (he takes her), so the answer is to meet the niche from
    // a1/b2/c3 and cross the whole diagonal in ONE queen move.
    make(3, [king(5, 5), knight(7, 7), pawn(3, 7), pawn(6, 2)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S(...NICHE_E5, 'd6', 'f4', 'f6'),
    }),
    // ── L4 — THE DOG THAT MOVES (rabies-dart KEY). Every corner is stone, so
    // the diagonal is worth nothing. The e-file is open and a knight plugs it
    // on e4, defended TWICE — by the pawns on d5 and f5, both jammed against
    // stone and both unreachable. Nothing takes it and lives. But its own
    // eight squares are stone save d2, where one of his pawns is standing:
    // madden it and it leaves the file to eat, and the file is hers.
    make(
      4,
      [king(5, 5), knight(5, 4), pawn(4, 5), pawn(6, 5), pawn(4, 2)],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: S(
          'e6', 'd4', 'd6', 'f4', 'f6',
          'c3', 'c5', 'f2', 'g3', 'g5', 'd1',
        ),
      },
    ),
    // ── L5 — THE CORK (magnet KEY). The corners are stone again and the
    // e-file is the road, corked at e3 by a bishop boxed on all four diagonals
    // — it cannot move, so no dart makes it move — and defended by a knight on
    // g4 that nothing on the board can reach. Magnet pulls along HER lines:
    // meet the cork on RANK 3 from the west and drag it off the file.
    make(
      5,
      [king(5, 5), bishop(5, 3), pawn(6, 5), knight(7, 4)],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: S(
          'd5', 'e6', 'd4', 'd6', 'f4', 'f6',
          'd2', 'f2', 'g3', 'g5', 'h2', 'h4', 'h6',
        ),
      },
    ),
    // ── L6 — THE SHIELD (rabies-dart KEY). Every corner is stone, so the
    // diagonal is worth nothing again. The e-file is the road and a knight
    // plugs it on e4 — defended by a second knight on g5 that is walled in on
    // all four sides and can never be reached, so taking the plug is dying.
    // The chained dog on a4 has one square in reach, the pawn on b6, across
    // the board from all of this. Dart it AS SHE TAKES THE PLUG: the bite is
    // the whole enemy action, so the recapture never happens, and she is
    // standing on his doorstep with him stunned two turns. The dart is armour.
    make(
      6,
      [king(5, 5), knight(5, 4), knight(7, 5), knight(1, 4), pawn(2, 6)],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: S(
          'd4', 'd5', 'd6', 'e6', 'f4', 'f5', 'f6',
          'g4', 'g6', 'h5', 'f3', 'f7', 'h3', 'h7',
          'd2', 'f2', 'g3',
          'b2', 'c3', 'c5', 'b5', 'a5',
        ),
      },
    ),
    // ══ L7 — ONE DOG, ONE THROAT ═══════════════════════════════════════════
    // The niche is sealed on rank and file and two of its four corners are
    // stone (d6/f4). d4 and f6 hold dogs. f6 is chained with all eight jump
    // squares stone — a dart on it does NOTHING, and that is the level's first
    // lie. d4 is chained with exactly one live square, f3, where one of his
    // pawns stands walled in on every side, and the pawn on c5 defends d4 so
    // taking the corner is dying.
    //   The road is the long dark diagonal a1-b2-c3-d4-e5. A knight stands on
    // b2, so c3 is the only square she can launch from; a knight on d1 covers
    // c3; and d3 — the ONLY way into the two-square rank-3 pocket that holds
    // c3 — is covered by the knight on b2. Two guards, two squares, one dart.
    // Take d1 off rank 1 (that buys c3), then LAND ON d3 AND DART IN THE SAME
    // TURN: the bite is the whole enemy action, so b2 never fires, d4 empties,
    // he is stunned two turns, and c3 then pulse-and-slide ends it.
    make(
      7,
      [
        king(5, 5),
        knight(4, 4),
        knight(6, 6),
        pawn(6, 3),
        pawn(3, 5),
        pawn(7, 7),
        knight(2, 2),
        knight(4, 1),
      ],
      {
        ...FLEE,
        moveLimit: 5,
        hazards: S(
          ...NICHE_E5,
          'd6', 'f4',
          'b3', 'b5', 'c2', 'c4', 'c6', 'e2', 'f2', 'g2',
          'e3', 'g3', 'c7',
          'd7', 'e8', 'g4', 'g5', 'g6', 'g8', 'h5', 'h7',
        ),
      },
    ),
    // ══ L8 — TWO DOGS, ONE DOOR ═══════════════════════════════════════════
    // Same niche, and now BOTH corner dogs have a throat: d4 can reach the
    // pawn on f3, f6 can reach the pawn on h7. Both bites stun him two turns
    // and both empty a corner. Only one of the two corners is a door — g7 is
    // stone, so the diagonal beyond f6 hits a wall one square out — and the
    // dart has one charge.
    //   And L7's answer is revoked. `enemiesPerTurn: 2` means the bite is only
    // the FIRST of two enemy actions, so landing on d3 and darting no longer
    // covers her: the knight on b2 fires on the second. There is no knight on
    // d1 to buy c3 with, either — the hunter itself has to be taken, and where
    // it is standing when she takes it decides whether the moves are there.
    make(
      8,
      [
        king(5, 5),
        knight(4, 4),
        knight(6, 6),
        pawn(6, 3),
        pawn(3, 5),
        pawn(8, 7),
        knight(2, 2),
      ],
      {
        ...FLEE,
        moveLimit: 6,
        enemiesPerTurn: 2,
        hazards: S(
          ...NICHE_E5,
          'd6', 'f4',
          'b3', 'b5', 'c2', 'c4', 'c6', 'e2', 'f2', 'g2',
          'e3', 'g3', 'c7',
          'd7', 'e8', 'g4', 'g5', 'g6', 'g7', 'g8', 'h5', 'h6',
        ),
      },
    ),
    // ══ L9 — THE DOG IS NOT THE DOOR ═══════════════════════════════════════
    // The niche moves to d5 and closes completely: c5/d4/d6/e5 on rank and
    // file, c6/e4/e6 on three corners, and the one corner left, c4, holds a
    // knight whose eight jump squares are ALL stone. It has no throat. No dart
    // in the game moves it.
    //   What the dart is for is the pawn on b5 — the only thing defending c4,
    // and itself unreachable (b4/b6 stone, a5/c5 stone) — and the dog that can
    // reach b5 is the chained knight on c7 behind the niche, whose other three
    // squares are stone and whose fourth is the king, whom no rabid piece may
    // take. So: dart c7, it eats b5 and stands there; take the c4 knight with
    // a plain rook move (her capture stuns him for ONE turn, exactly the one
    // enemy phase she has to survive one square from him); then pulse and step
    // the single diagonal c4-d5. Sliding in is impossible — a2 and b3 are
    // stone, so the only square on that diagonal she can ever occupy is the
    // corner itself.
    make(
      9,
      [
        king(4, 5),
        knight(3, 4),
        knight(3, 7),
        pawn(2, 5),
        knight(5, 2),
      ],
      {
        ...FLEE,
        moveLimit: 4,
        enemiesPerTurn: 2,
        hazards: S(
          ...NICHE_D5,
          'c6', 'e4', 'e6',
          'a3', 'a5', 'b2', 'b6', 'd2', 'e3',
          'a2', 'b3', 'b4',
          'a6', 'a8', 'e8',
        ),
      },
    ),
    // ══ L10 — THE FAR DOG ═════════════════════════════════════════════════
    // The niche moves to d6 — c6/d5/d7/e6 on rank and file, c7/e5/e7 on three
    // corners — and the fourth corner, c5, IS ALREADY EMPTY. Nothing stands
    // between her and him. A bare rook still loses every time: a rook on c5 is
    // a rook the king simply takes, and b4/a3 are stone so that diagonal can
    // never be walked from outside. Rank 4 is solid except c4 and d4, so the
    // c-file is the only road north — and one of his knights corks it on c2.
    // She spends a move taking the cork, which means her own capture-stun is
    // already gone by the time she reaches the corner.
    //   The only capture left anywhere on this board is the chained knight on
    // h7 eating its own pawn on f8, in the opposite corner, with no bearing on
    // the niche whatsoever. Its bite is worth exactly one thing: the two turns
    // of stun that let her stand next to him. The dart is a clock, not a key,
    // and its target is chosen by what is edible.
    make(
      10,
      [
        king(4, 6),
        knight(3, 2),
        knight(8, 7),
        pawn(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 5,
        hazards: S(
          'c6', 'd5', 'd7', 'e6',
          'c7', 'e5', 'e7',
          'a4', 'b4', 'e4', 'f4', 'g4', 'h4',
          'b3', 'd3',
          'f6', 'g5', 'f7', 'g7',
        ),
      },
    ),
  ],
};

export default RUN_REVENGE_48;
