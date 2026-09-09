/**
 * revenge-49 — THE OUBLIETTE. Built 2026-09-09 for the signature pair
 * AEGIS + DRAGON. Kit = aegis / dragon / magnet / poison-dart
 * (`allowedAbilities` IS the kit). All four cards are LIVE.
 *
 * ***THIS RUN DOES NOT MEET THE COMBO GATE. It ships as `idea`, not `built`.***
 * The geometry is sound and a human can play it — but the playtest bot cannot,
 * and the reason is a general fact about the bot that is worth more than the
 * run is. Numbers and the full diagnosis are at the bottom (MEASURED / DEAD
 * ENDS). READ THE LAST SECTION BEFORE BUILDING ANOTHER RUN AROUND A SHIELD.
 *
 * CONCEPT (A): an unbuilt pair the discovery harness has already proved can
 * gate — `aegis+dragon` gates moat-L10-v14-s249 at 80% with a UNIQUE answer
 * under the kit [aegis queen-pulse boulder dragon], where every single card
 * reads 0% (data/run-playtest/combo-library/aegis+dragon/). It is the only
 * L10-slot entry in SYNERGY.md with a unique answer besides dragon+vanguard,
 * and AEGIS is the thinnest socket left that is buildable: it appears in
 * exactly two gating pairs out of 253, and the other one (`aegis+bishop-step`)
 * is half universal solvent. Aegis has been a filler in nine shipped kits and
 * half of one signature (page + aegis, The Picket, where its job was to eat a
 * RECAPTURE). This run asked it to do the other thing a shield can do, and the
 * thing no run has been built on: LET HER STAND ON A SQUARE THAT KILLS HER.
 * That distinction is exactly where it broke — see DEAD ENDS §4.
 *
 * THE VERB: BE THE DOOR — STAND IN THE ONE SQUARE THAT KILLS YOU, TAKE THE
 * BLOW, AND LET THE THING YOU BROUGHT DO THE KILLING. Not crossing a wall
 * (The Moat), not baiting hunters (The Alley), not a poison timer (The
 * Switchback), not blowing a hole (The Briar), not caging with his own guard
 * (The Alcove), not a double door (The Millstone), not a two-rook net (The
 * Parapet), not buying a body time (The Lattice), not moving the wall (The
 * Quarry), not an undo (The Dogleg), not a capture you do not survive (The
 * Picket), not zugzwang (The Niche), not a lure (The Pinch), not breaking a
 * ring (The Kennel). Every one of those runs is about getting Rookie ONTO a
 * square that matters. This is the first run where the square she stands on
 * can never hurt him — her body is a delivery address and nothing else.
 *
 * ── CONSTANT SIGNATURE — THE OUBLIETTE ─────────────────────────────────────
 * An oubliette is a cell with no door: the only way in is one hole in the
 * ceiling. On every level of this run:
 *
 *   1. ALL EIGHT of the king's neighbours are stone (or a pinned pawn, which
 *      is stone that can bite). So no rank, no file and no diagonal in the
 *      game ends on his square. A rook can never take him. A queen could not
 *      either. Nothing that moves in straight lines can.
 *   2. Exactly ONE of his eight KNIGHT squares is cut open. That is THE HOLE.
 *      It is the only square on the board from which anything can capture him,
 *      and only a piece with knight geometry can do it from there.
 *   3. The hole is a dead pocket: every one of ITS neighbours is stone too,
 *      except exactly one — THE LIP. The lip is DIAGONAL to the hole, so a
 *      rook may stand beside the hole for ever and never step into it.
 *   4. The hole is WATCHED by a pinned pawn, so a body posted in the hole that
 *      waits one enemy phase is eaten: whatever goes in has to arrive and
 *      strike in the same turn, which only a summon cast FROM the lip can do.
 *   5. The lip, or the one square the lip is entered from, is COVERED.
 *      Standing there is death.
 *
 * That is the whole run, restated ten times: A CELL WITH NO DOOR, ONE HOLE IN
 * ITS CEILING, AND A LIP YOU CANNOT STAND ON. Not a band of water, not a hall
 * of pillars, not a sealed box, not a hedge, not a lattice, not an alcove, not
 * a niche with dogs — a hole with a lethal lip.
 *
 * ── WHY THIS PAIR, read out of lib/run/abilities.ts ────────────────────────
 *
 *   1. `summonSpawnSquares` for the dragon is ALLY_QUEEN_DIRS around Rookie —
 *      THE DRAGON ALWAYS LANDS BESIDE YOU, at every tier (abilities.ts:3874,
 *      Tyler 2026-09-08: "too OP bro"). So the dragon cannot be posted into
 *      the hole from across the room. Somebody has to be standing on the lip.
 *   2. The dragon is the AMAZON: queen rays PLUS knight jumps
 *      (`ally.source === 'dragon'` adds ALLY_KNIGHT_DELTAS, abilities.ts:4013).
 *      With knight-hop and every other summon banned from the kit it is the
 *      only thing in the run that can strike a square whose eight neighbours
 *      are all stone.
 *   3. There is no summoning sickness (reverted 2026-09-09, commit 51012ba):
 *      a summon may be cast AND moved on the same turn. That is why the dragon
 *      never has to survive an enemy phase — and why the watched hole (§4
 *      above) refuses every other delivery.
 *   4. Casting is FREE; MOVING A BODY IS THE TURN. So she cannot arrive on the
 *      lip and deliver in the same turn: arriving IS her move. She has to be
 *      standing on a killing square when exactly one enemy phase resolves.
 *   5. `tryAegisIntercept` fires BEFORE the capture lands and, at T1, spends
 *      the shield and cancels it. One shield = one enemy phase survived on a
 *      square that kills — exactly the quantity the geometry asks for.
 *
 * ── WHY EACH HALF IS DEAD ALONE (and this part MEASURED CLEAN) ─────────────
 *   aegis alone — 0% on all four finales, 32 trials. She can stand on the lip
 *     all day; a rook on the lip attacks the lip's rank and file and the cell
 *     is stone on every one of them. No sequence of rook moves in this run
 *     ends on his square.
 *   dragon alone — 0% on all four finales, 32 trials, and it took three
 *     separate seals to get there (DEAD ENDS §1-3). The delivery address is
 *     the lip; the lip (or its doorstep) kills her before her next turn; and
 *     every walk-in route ends with a body sitting in a watched hole.
 *   magnet, poison-dart — 0% everywhere: every mouth and every watcher in the
 *     finale is a pawn walled on its own rank AND file, so there is no rook
 *     line to it from any square she can occupy, and sight is the same line.
 *
 * ── KIT: aegis / dragon / MAGNET / POISON-DART ─────────────────────────────
 * No universal solvent (bishop-step, knight-hop, become-king absent). No
 * second summon — one body-move a turn. No rabies-dart beside a summon.
 * `magnet+poison-dart` is one of SYNERGY.md's proven never-gates pairs (17
 * levels) and neither has ever gated with dragon. Both are keys in the
 * mid-run, which is the job of a filler: a live card, not a dead one, and a
 * trap only where the gate lives.
 *
 * ── PER-CARD KEY / TRAP MAP (as MEASURED, not as intended) ─────────────────
 *   L        aegis        dragon      magnet    poison-dart
 *   1-3      100          100         13-100    100     (bare wins L1-L2)
 *   4        KEY 100      94          0         81
 *   5        100          100         19        KEY 100
 *   6        0            KEY 100     0         0       (a clean single gate)
 *   7-10     0            0           0         0       (nothing wins: MISS)
 * L6 is the one level in the run that came out exactly as designed: bare 0%,
 * every card 0%, dragon 100%, and it is gated by pure geometry rather than by
 * a clock. It is worth lifting into another run's mid-game as it stands.
 *
 * ── THE FOUR FINALE LINES (written before building; they DO differ) ────────
 * All four are provable by hand and none is reachable by the bot.
 *   L7  THE LIP. Cell at e7, hole at f5, lip at g4, and the doorstep g3 is
 *       covered by the pawn on h4 (pinned against h3, sealed on file h, and
 *       its only open knight square is f3). g2 is stone, so g3 can only be
 *       entered along rank 3 and left along file g: she HAS to stop there.
 *       Take the bite on the shield, step to the clean lip, cast into f5,
 *       jump. DECISION: the shield is the fare for the doorstep.
 *   L8  THE ELBOW. Cell at d7, hole at c5, lip at b4, and the same trick
 *       mirrored onto the queenside with the mouth on a4 — but here the
 *       geometry is an L, not a straight file: b3 is entered along rank 3 and
 *       left along file b, and a3/a5/b5/c4 are stone so nothing else touches
 *       either square. DECISION: same fare, one move longer, and the mouth is
 *       on the far side of the lip so the reflex of "keep west" loses.
 *   L9  THE LIP IS TAKEN, NOT WALKED. Cell at c7, hole at d5, lip at e4 — and
 *       one of his knights is STANDING on e4, walled on all eight jump squares
 *       so it cannot be chased off. Her arrival is a CAPTURE and the pawn on
 *       f5 is the recapture, so the shield has to be raised before she takes,
 *       not after she looks. `enemiesPerTurn: 2` puts two hunters on the floor
 *       at double speed while she spends the moves.
 *       DECISION: the door is taken, and the shield is committed one move
 *       before she knows the road is clear.
 *   L10 BOTH TOLLS, ONE SHIELD. L7's cell with the lip ALSO plugged by a
 *       walled knight: the doorstep g3 is covered by h4 and the lip g4 has to
 *       be captured. Nine moves. The only line that fits is to slide the whole
 *       g-file in one move — g3 is passed through, never stood on — so the
 *       shield is spent on the recapture at the lip and not on the doorstep.
 *       DECISION: do not stop to get set; the toll you skip is the one that
 *       pays for the door. (This is the level the last three have trained the
 *       player to misplay.)
 *
 * ══ MEASURED — 2026-09-09, difficulty=normal, `revenge.ts matrix` ══════════
 * Numbers of record: 32 trials, `--jobs=1`, the run's own 4-card kit, T1 cards.
 *
 *   L    none   aegis  dragon  magnet  poison-dart | aegis+dragon
 *   7      0%      0%      0%      0%       0%     |      0%
 *   8      0%      0%      0%      0%       0%     |      0%
 *   9      0%      0%      0%      0%       0%     |     16%
 *  10      0%      0%      0%      0%       0%     |      0%
 *
 * Half the contract is met perfectly — no-ability 0%, every single card 0%,
 * on all four finales, which is the hardest half and is usually where runs
 * fail. THE PAIR READS 0/0/16/0 against a required 60-80%, so the gate is not
 * met: this is a run with a lock and no measurable key. It is the mirror image of the usual
 * miss (a finale one card walks through) and it is a HARNESS result, not a
 * design result — see DEAD ENDS §4 for why, and for the rule it produces.
 *
 * MID-RUN, 16 trials, jobs=2 (L1-L2 free bare; L3-L6 impossible bare):
 *   L    none   aegis  dragon  magnet  poison-dart
 *   1    100%    100%    100%    100%    100%
 *   2    100%    100%    100%    100%    100%
 *   3      0%    100%    100%     13%    100%
 *   4      0%    100%     94%      0%     81%
 *   5      0%    100%    100%     19%    100%
 *   6      0%      0%    100%      0%      0%
 * L3 was DESIGNED as the magnet level and is not one: magnet reads 13%, and
 * aegis / poison / dragon all walk it. L5 was designed as poison's and three
 * cards clear it. Only L4 (aegis) and L6 (dragon) are honest single-card
 * gates. The mid-run contract — bare 0% on L3-L6, some card at 90%+ — is met.
 *
 * FULL RUNS, 40 runs, T5, difficulty=normal — AND THE ONE PIECE OF GOOD NEWS:
 *   random picks   3/40 full clears ( 7.5%)  picks {dragon 54, poison 49,
 *                                             aegis 41, magnet 39}
 *   pool=aegis,dragon  8/40 full clears (20%)  picks {dragon 115, aegis 99}
 *   per level, pool=aegis+dragon:
 *     L1-L6  100/100/100/95/100/95      L7 75%   L8 100%   L9 33%   L10 89%
 * The finale that reads 0/0/16/0 in the matrix reads 75/100/33/89 inside a
 * real run. The difference is TIER: the matrix hands out T1 cards, and a run
 * upgrades them on L1/L3/L6/L9. A T5 dragon has two charges and five turns,
 * which is enough to walk a body in over several enemy phases instead of
 * arriving and striking in one — the leaks of DEAD ENDS §1 all reopen above
 * T1. So the run is COMPLETABLE and the pair is what completes it (20% of
 * full runs versus 7.5% with random picks, and L9 is the wall at 33%), but
 * what carries it is the dragon's tier and not the shield. That is not the
 * gate this run was built for, and it is why nothing here is marked `built`.
 * If the gate cannot be shown at T1, `abilityTierCaps` cannot rescue it
 * either: capping the dragon at 1 would only make the finale unwinnable.
 *
 * ══ DEAD ENDS (all traced, all 2026-09-09) ════════════════════════════════
 *
 * 1. THE DRAGON WALKS. Three separate leaks, each found by `revenge.ts trace`
 *    and each fatal on its own, all of the same family: the dragon has queen
 *    rays AND knight jumps, so "the only square that reaches the king" has to
 *    mean the only square reachable by a BODY over several turns, not the only
 *    square reachable in one.
 *      (a) The watcher's own square was a knight square of the king. A dragon
 *          summoned on the lip ate the watcher and stood one step from him.
 *      (b) The lip, the hole and the watcher were COLLINEAR: g4-f5-e6 is a
 *          diagonal, and with the hole empty the dragon slid straight through
 *          it onto the watcher. Two moves, dragon alone, 100%.
 *      (c) The mouth pawn was pinned by nothing, marched off its square, and
 *          left a free square that WAS a knight jump from the watcher.
 *    The seal that works: put the watcher on the same side of the hole as the
 *    lip (the square between them is then an orthogonal neighbour of the hole,
 *    which is stone), stone every knight square of the watcher, and pin every
 *    pawn with stone directly in front of it.
 *
 * 2. THE BOT'S POSITIONAL TERM IS A TRAP ON AN OPEN BOARD. `fastScore` in
 *    scripts/run-playtest/bots/mcts.ts scores `(8 - chebyshev(rookie, king))
 *    * 3`. On the first build of this file, rank 3 was open across the board
 *    and the bot walked to c5 — two squares from the king, behind a wall,
 *    useless — and shuffled there for the whole move limit, because c5 scores
 *    18 and the lip scores 15. THE LIP MUST BE THE NEAREST REACHABLE SQUARE
 *    TO THE KING, and every square nearer than it must be stone. That is a
 *    stronger statement of the Warren's "carve the finale out of solid stone",
 *    and it applies to any kit, not just to cards that target empty squares.
 *    A partial funnel is worse than none: with rank 3 stoned except one file,
 *    the bot climbed to rank 3 in the wrong file and could not cross.
 *
 * 3. A CORK DEFENDED BY THE KING IS NOT DEFENDED. L3 v1 put a walled knight in
 *    the king's one doorway and let the king be its only defender. It read
 *    100% bare. Any capture credited to Rookie's side stuns him for a turn
 *    (engine.ts:123), so the recapture never comes: taking a king-defended
 *    piece is FREE, always, in every level in this game. A defender has to be
 *    a piece that is not the king — here, a pawn pinned on f7.
 *
 * 4. **THE VERDICT, AND THE RULE: A SHIELD CANNOT BE HALF A GATE UNLESS ITS
 *    PAYOFF IS A CAPTURE THE BOT ALREADY WANTS.** This run's finale asks the
 *    bot to walk onto a square where it will be captured, having first spent a
 *    free cast on a shield, for a reward two plies later. It never does it,
 *    on any of the six finale geometries built and traced today, at any clock,
 *    with or without hunters, with the lip clean or occupied. Three things in
 *    the bot make that a wall, and they compound:
 *      - `ability-eval.ts:aegisBonus` returns 25 only when `rookieInThreat`
 *        is already true and 5 otherwise, so a PRE-EMPTIVE shield is worth
 *        almost nothing to the search.
 *      - without the shield, every rollout that steps onto the lip dies, so
 *        `doomed` in mcts.ts marks the move as a loss and it is chosen only
 *        when literally everything else is also doomed (in one trace the bot
 *        finally played it on its last legal move of the move limit).
 *      - `fastScore` subtracts 20 for a pawn one diagonal step away, which is
 *        the exact configuration the whole design puts her in.
 *    This is the Glasshouse's "provable but unfindable" (run-level-design.md,
 *    2026-09-05) with a sharper edge, and it generalises past Aegis to Smoke,
 *    Become King and any future card whose value is SURVIVING A TURN: the bot
 *    will not buy safety it does not yet need. Note what the combo library's
 *    one gating `aegis+dragon` level does instead — its recorded reason is
 *    "the shield converts a defended blocker into a TAKEABLE one". There the
 *    shield's payoff is a capture, which the bot's evaluation is built to
 *    chase. So the shield gate that CAN be measured is "take the defended
 *    thing and eat the reply", not "stand where you die". The Picket
 *    (revenge-35, page + aegis) is the shipped run that already does it that
 *    way, and it is the shape any future Aegis run has to use.
 *    L9 of this file is the closest this run got to that shape — the lip is
 *    taken, not walked — and it is the only finale that ever produced a
 *    non-zero pair reading — 16% at 32 trials serial, the only cell in the
 *    finale that is not a flat zero, and the shape it uses is exactly the
 *    "take the defended thing" shape above.
 *    Rebuilding all four finales as capture-arrivals is the obvious next
 *    attempt and is left for whoever picks this up: the CELL is right, and
 *    L6 proves the geometry gates a single card cleanly.
 */

import {
  FLEE,
  STILL,
  X,
  knight,
  king,
  make,
  pawn,
  type RunDef,
} from '../../run-kit';
import type { Coord } from '../../types';

/** 'f4' -> {file:6, rank:4}. Authoring convenience only. */
const sq = (name: string): Coord => X(name.charCodeAt(0) - 96, Number(name.slice(1)));

/** Stone, by name. */
const S = (...names: string[]): Coord[] => names.map(sq);

/**
 * A WHOLE RANK OF STONE, minus the named squares. Every level in this run is
 * built rank by rank downward from 8, because the signature is a solid mass
 * with a few squares cut out of it — and because the playtest bot's positional
 * term is `(8 - chebyshev(rookie, king)) * 3`, so any reachable square that is
 * NEARER the king than the sill is a square the bot will stand on instead of
 * the one that wins (traced 2026-09-09; see DEAD ENDS). Solid stone is not
 * decoration here, it is what makes the level findable.
 */
const RANK = (r: number, ...open: string[]): string[] =>
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    .map((f) => `${f}${r}`)
    .filter((n) => !open.includes(n));

export const RUN_REVENGE_49: RunDef = {
  id: 'revenge-49',
  name: 'The Oubliette',
  blurb:
    'He has walled his cell on all eight sides — no rank, no file, no diagonal in the game ends on his square. There is one hole in the ceiling, one lip you can stand on to reach it, and standing on that lip kills you. Take the blow. Drop something through.',
  allowedAbilities: ['aegis', 'dragon', 'magnet', 'poison-dart'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // ── L1 — THE CELL, HALF BUILT. Rank 8 and rank 7 are solid but for his
    // square, and the e-file is the one thing left open. One pawn stands in
    // it; he does not move. The silhouette, for free.
    make(1, [king(5, 7), pawn(5, 4)], {
      ...STILL,
      moveLimit: 12,
      hazards: S(...RANK(8), ...RANK(7, 'e7'), ...RANK(6, 'e6')),
    }),
    // ── L2 — THE CORK. Same cell, and a knight sits in the one door. It is
    // undefended, so a bare rook takes it and slides in — and the lesson is
    // the whole run in one move: a walled cell has exactly one way in.
    make(2, [king(5, 7), knight(5, 5), knight(2, 2)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S(...RANK(8), ...RANK(7, 'e7'), ...RANK(6, 'e6')),
    }),
    // ── L3 — THE CORK HE DEFENDS HIMSELF (magnet KEY). The knight on e6 is
    // the door and the KING is its defender: take it and he takes her back,
    // and nothing in this kit removes a king. But rank 6 runs east of the
    // door, and magnet pulls along HER lines — meet the cork on rank 6 from
    // g6/h6 and drag it sideways off the e-file, then walk up the file.
    // The knight is walled on all eight of its jump squares, so it is a cork
    // and not a hunter: c5/d4/f4/g5 are stone.
    make(3, [king(5, 7), knight(5, 6), pawn(6, 7), knight(2, 2)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S(
        ...RANK(8),
        ...RANK(7, 'e7', 'f7'),
        ...RANK(6, 'e6', 'g6', 'h6'),
        'c5', 'd4', 'f4', 'g5',
      ),
    }),
    // ── L4 — THE COVERED DOORSTEP (aegis KEY). Rank 5 is solid, so the e-file
    // no longer reaches him: the ONE square in the level that attacks e7 is
    // e6, the square he is standing next to. Climb the h-file to h6, slide
    // west onto e6, take the blow, take him. A bare rook dies on the doorstep.
    make(4, [king(5, 7), knight(2, 2), knight(8, 1)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S(
        ...RANK(8),
        ...RANK(7, 'e7'),
        ...RANK(6, 'e6', 'f6', 'g6', 'h6'),
        ...RANK(5, 'h5'),
      ),
    }),
    // ── L5 — THE CORK SHE MUST NOT TOUCH (poison-dart KEY). The door at e6
    // holds a walled knight defended TWICE — by the king and by the pawn on
    // f7, which is pinned against f6 and which no line in the level can see.
    // `enemiesPerTurn: 2` means the shield stops one of those recaptures and
    // the other one still lands, so taking the cork is dying even with Aegis.
    // Magnet cannot help either: the only square that sees e6 is e5, and e5
    // is ADJACENT — there is no room to pull into. The dart kills the cork at
    // the length of the file and she never stands on a covered square at all:
    // when it dies she slides e5-e6-e7 through the empty door.
    make(
      5,
      [king(5, 7), knight(5, 6), pawn(6, 7), knight(2, 2)],
      {
        ...FLEE,
        moveLimit: 14,
        enemiesPerTurn: 2,
        hazards: S(
          ...RANK(8),
          ...RANK(7, 'e7', 'f7'),
          ...RANK(6, 'e6'),
          ...RANK(5, 'e5'),
          'd4', 'f4',
        ),
      },
    ),
    // ── L6 — THE OUBLIETTE, OPEN (dragon KEY). The signature for the first
    // time, with the lip CLEAN. Eight stone sides; one hole at f5; one lip at
    // g4, diagonal to the hole so a rook can stand beside it for ever and
    // never step in. The pawn on g6 watches the hole (pinned against g5,
    // sealed on rank 6 and file g, and no knight square of its own is open),
    // so a body posted in f5 that waits is eaten. Nothing else in the kit
    // reads anything but wall.
    make(
      6,
      [king(5, 7), pawn(7, 6)],
      {
        ...FLEE,
        moveLimit: 14,
        hazards: S(
          ...RANK(8),
          ...RANK(7, 'e7'),
          ...RANK(6, 'g6'),
          ...RANK(5, 'f5'),
          ...RANK(4, 'g4'),
        ),
      },
    ),
    // ══ L7 — THE LIP ═══════════════════════════════════════════════════════
    // The same cell with the lip closed: the pawn on h5 covers g4 and is
    // pinned against h4, walled on rank 5 by g5 and on file h by h4/h6, and
    // its only open knight square is g3 — so no rook line, no magnet, no dart
    // and no sight ever reaches it, and a lone dragon that spends its charge
    // eating it has nothing left to deliver. Walk up the g-file onto g4, TAKE
    // THE BITE ON THE SHIELD, then cast the dragon into f5 and jump.
    make(
      7,
      [king(5, 7), pawn(7, 6), pawn(8, 4)],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: S(
          ...RANK(8),
          ...RANK(7, 'e7'),
          ...RANK(6, 'g6'),
          ...RANK(5, 'f5'),
          ...RANK(4, 'g4', 'h4'),
          'h3', 'g2',
        ),
      },
    ),
    // ══ L8 — THE ELBOW ═════════════════════════════════════════════════════
    // The cell moves to d7, the hole to c5, the lip to b4 — AND THE LIP IS
    // CLEAN. Nothing covers b4. But b4 has exactly one approach: b5 and c4
    // are stone, a3/a5 are stone so the pawn on a4 can be neither reached nor
    // moved, and b2 is stone so the b-file cannot be run from below. b3 must
    // be entered along rank 3 and left along file b — she has to STOP there,
    // and b3 is the one square that pawn covers. Whoever saves the shield for
    // the door dies one square short of it.
    make(
      8,
      [king(4, 7), pawn(2, 6), pawn(1, 4)],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: S(
          ...RANK(8),
          ...RANK(7, 'd7'),
          ...RANK(6, 'b6'),
          ...RANK(5, 'c5'),
          ...RANK(4, 'a4', 'b4'),
          'a3', 'b2',
        ),
      },
    ),
    // ══ L9 — THE LIP IS TAKEN ══════════════════════════════════════════════
    // Cell at c7, hole at d5, lip at e4 — and one of his knights is STANDING
    // on e4, walled on all eight of its jump squares (c3/d2/f2/g3 stone, the
    // rest already), so it is furniture that cannot be chased off. Her arrival
    // is a CAPTURE, which means the shield has to be raised before she takes,
    // not after she looks; the pawn on f5 is the recapture. `enemiesPerTurn:
    // 2` means the two hunters on the floor are moving twice as fast while
    // she spends the moves.
    make(
      9,
      [
        king(3, 7),
        pawn(5, 6),
        pawn(6, 5),
        knight(5, 4),
        knight(1, 1),
        knight(8, 3),
      ],
      {
        ...FLEE,
        moveLimit: 10,
        enemiesPerTurn: 2,
        hazards: S(
          ...RANK(8),
          ...RANK(7, 'c7'),
          ...RANK(6, 'e6'),
          ...RANK(5, 'd5', 'f5'),
          ...RANK(4, 'e4'),
          'c3', 'd2', 'f2', 'g3',
        ),
      },
    ),
    // ══ L10 — DO NOT STOP ══════════════════════════════════════════════════
    // L7's cell with a second mouth: the pawn on h4 covers g3, the square
    // every player stands on to look at the lip. Both mouths are pinned and
    // sealed (h4 against h3, h5 against h4 itself), and one shield cannot pay
    // both tolls. The answer is not to pay the first one: g2 and g3 are empty,
    // so the rook SLIDES from the g-file bottom straight onto g4 in a single
    // move, is bitten once by h5, eats it on the shield and casts. Stop on g3
    // to "get set" — the natural move, and the one the last three levels have
    // trained — and the shield is gone before the lip.
    make(
      10,
      [
        king(5, 7),
        pawn(7, 6),
        pawn(8, 4),
        knight(7, 4),
      ],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: S(
          ...RANK(8),
          ...RANK(7, 'e7'),
          ...RANK(6, 'g6'),
          ...RANK(5, 'f5'),
          ...RANK(4, 'g4', 'h4'),
          'h3', 'g2', 'e3', 'f2', 'h2',
        ),
      },
    ),
  ],
};

export default RUN_REVENGE_49;
