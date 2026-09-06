/**
 * revenge-32 — THE QUARRY. Built 2026-09-06 for the
 * signature pair SHOVE + MAGNET ("pull the plug, roll the wall").
 * Kit = shove / magnet / aegis / hourglass (`allowedAbilities` IS the kit).
 * Shove is at the TESTING stage, so this run is /playtest-only.
 *
 * THE VERB: the wall is not a thing you cross, it is a thing you MOVE. Drag
 * the guard out of the cut and take it out on the floor where nothing
 * answers; then roll one loose block of his own quarry into his room so the
 * room is small enough for a rook to hold.
 *
 * CONSTANT SIGNATURE — THE FACE, THE LEDGE, AND ONE LOOSE STONE. Every level
 * draws the same three things:
 *   1. THE FACE — file f is stone from rank 1 to rank 8, ONE SQUARE THICK,
 *      with exactly one square missing: the CUT. It is the only way from the
 *      quarry floor (files a-e, open ground) onto the ledge.
 *   2. THE LEDGE — files g and h, two squares wide, floored with stone at g1
 *      and h1. Two files wide is the point: a rook on the ledge can never get
 *      behind anything, and Rookie's random start file can never land her on
 *      it (seed.ts `randomizedRookieStart` skips files occupied on rank 1, and
 *      f1/g1/h1 are all stone).
 *   3. ONE LOOSE STONE (two on L8). Every hazard in this run is `fixed: true`
 *      except that one — so Shove is refused square by square, and the card
 *      that opens any one-thick wall alone can only ever move the block the
 *      level was built around. That is the answer to Shove's universal-solvent
 *      problem (docs/new-abilities-2026-09-06.md §2.2): it read 0% -> 100%
 *      ALONE on The Keep L5-L7 and The Parapet L5/L7, and here it reads 0% on
 *      every finale level AT EVERY TIER, because the geometry refuses it
 *      rather than the card list.
 *
 * Not a band across rank 5 (The Moat), not solid ranks cut by shafts (The
 * Stacks), not a ring with a throat (The Cairn), not a roof (The Hayloft),
 * not pillars (The Colonnade), not a box (The Vault): a sheer vertical face
 * with one cut in it, and a two-file ledge behind it.
 *
 * THE MECHANISM, read out of lib/run/abilities.ts and lib/run/pawn-ai.ts:
 *   - A pawn standing IN the cut is jammed forever: the square in front of it
 *     is the face. It is the plug, and nothing on the board moves it.
 *   - A bishop or knight set into the ledge with stone (or the plug) on every
 *     one of its moves is frozen: a defender that can only ever recapture.
 *     Standing ON the cut square to take the plug is therefore death — but a
 *     rook may SLIDE THROUGH the empty cut in one move without stopping,
 *     which is exactly why pulling the plug out to the floor is the way in.
 *   - Magnet (T1) grabs the FIRST enemy on one of her rook lines at distance
 *     >= 2 and drags it up to two squares toward her. The plug's only line is
 *     the rank it sits on, running west onto the floor — so ONE stone dropped
 *     on that rank (L4) makes the plug untargetable, and one square of room
 *     removed makes Magnet illegal outright.
 *   - Shove (T1, one use) rolls a loose stone one square directly away from
 *     her. Pushed along her own line the stone lands where the gap just
 *     opened, so every useful shove here is pushed FROM THE SIDE into his
 *     room: a room square dies, and the square the stone left is her way in.
 *   - A rook can never hold a 2x2 room (kingFleeMove: he steps to the square
 *     her cross does not cover, forever). Kill one square of the 2x2 with the
 *     loose stone and the L that is left IS holdable — the corner of the L
 *     attacks the other two squares.
 *
 * KEY / TRAP map:
 *   magnet     KEY L3 (pull the plug out of the cut, take it on the floor),
 *              KEY L6 (the sentry inside the ledge). Half of L7-L10. TRAP on
 *              L4 (no room to pull), on L5 (nothing on the board but the king,
 *              and T1 never grabs a king) and alone on the finale (the plug
 *              comes out, the 2x2 still holds).
 *   shove      KEY L5 (seal the 2x2 into a holdable L). Half of L7-L10, and
 *              the second answer on L4 (roll the slot stone off rank 5 and
 *              Magnet has its two squares back). TRAP on L1-L3 and L6, where
 *              the loose stone is a decoy block on open ground, and alone on
 *              the finale (the plug still stands in the cut).
 *   aegis      KEY L4 — the cut is a SLOT: with d5 blocked the only square
 *              with a line to the plug is e5, one square away, and Magnet
 *              needs two. Take the plug where it stands and eat the reply.
 *              Second answer on L3 and L6. TRAP on the finale, where a shield
 *              gets her through the cut and leaves her in front of a 2x2 room
 *              she cannot hold (0% at T1 AND at T5).
 *   hourglass  KEY nowhere, by design — the trap card. There is no fuse in
 *              this run: every pawn is jammed, every guard frozen. A free
 *              enemy turn buys a step of his and nothing else.
 *
 * THE FOUR FINALE DECISIONS (written before building, per "One line, four
 * times"). Same two cards, a different decision each level:
 *   L7  THE DOOR — the teaching line. His room is the 2x2 in the north corner
 *       of the ledge, the door is h6, the capstone is g6. Pull the plug west,
 *       take it on the floor, slide through the cut to g5, roll g6 into g7,
 *       and go in through the square the stone left. You could walk in first
 *       and shove later; the order is yours.
 *   L8  WHICH STONE — his room is a pocket in the FLOOR of the ledge (the pit
 *       floor sealing it from below), the stone rolls DOWN into it, and there
 *       are TWO loose stones with one shove between them. h5 looks like spare
 *       masonry; it is one of the four squares freezing the sentry bishop on
 *       g6, so rolling it spends the shove his room needed AND frees the only
 *       piece on the board that can come after you.
 *   L9  NO WAY IN BUT THE STONE — the h-file is broken at h5, so the door h6
 *       cannot be reached from below at all: the only route into his room is
 *       the square the capstone is standing on. Here the shove is not the
 *       seal you add after you are inside, it is the door, and the same
 *       motion that opens it kills g7. The L7 habit — get in, look around,
 *       spend the card when you see the shape — does not exist on this level.
 *   L10 THE STEP — he is STANDING on g7, the square the stone has to land on,
 *       and Shove will not drop a rock on the king. Go in through the door,
 *       attack him along rank 7 so he steps to the far corner, walk back out
 *       to g5, roll the stone into the square he just left, and come back for
 *       him. Two enemies a turn and a clock that only fits if you make that
 *       trip once.
 *
 * ── MEASURED, 2026-09-06. Normal, T5 bot, kit at T1, 32 trials/cell,
 * `revenge.ts matrix --run=<id> --loadouts=none,shove,magnet,aegis,hourglass,
 * shove+magnet --trials=32 --jobs=9`. The harness cross-talk bug is fixed
 * (commit 94482af) and `scripts/run-playtest/matrix-determinism-check.ts` was
 * run first and PASSED (revenge-27 L9, 10/16 alone, 10/16 in a 4-column read,
 * 10/16 at --jobs=3), so these cells are shape-independent.
 *
 *    L    none   shove  magnet   aegis  hourgl | shove+magnet
 *    1    100%    100%    100%    100%    100% |  100%   free
 *    2    100%    100%    100%    100%    100% |  100%   free
 *    3      0%      0%     91%    100%      0% |   94%   magnet KEY (aegis 2nd)
 *    4      0%      0%      0%    100%      0% |   69%   aegis KEY
 *    5      0%    100%      0%      0%      0% |  100%   shove KEY (only card)
 *    6      0%      0%     97%    100%      0% |  100%   magnet KEY (aegis 2nd)
 *    7      0%      0%      0%      0%      0% |   72%   FINALE
 *    8      0%      0%      0%      0%      0% |   59%   FINALE
 *    9      0%      0%      0%      0%      0% |   72%   FINALE
 *   10      0%      0%      0%      0%      0% |   66%   FINALE
 *
 * GATE HOLDS. No-ability 0% on L3-L10; every single card in the kit reads 0%
 * on all four finale levels; the pair reads 72/59/72/66 — inside the 60-80%
 * band the rubric asks for (L8 is one point under and is the one honest miss).
 *
 * TIER SWEEP — and the finding worth carrying forward: THIS RUN NEEDS NO
 * `abilityTierCaps`. Every kit card was swept one tier at a time on L7-L10,
 * 32 trials/cell:
 *    shove:1  0/0/0/0     magnet:2  0/0/0/0     aegis:5      0/0/0/0
 *    shove:2  0/0/0/0     magnet:3  0/0/0/0     hourglass:5  0/0/0/0
 *    shove:3  0/0/0/0     magnet:4  0/0/0/0
 *    shove:4  0/0/0/0     magnet:5  0/0/0/0
 *    shove:5  0/0/0/0
 * Five runs in a row have had to pin a signature card because an upgrade broke
 * the gate (Colonnade bishop-squire:3, Parapet knight-hop:4, Lattice duchess:4,
 * Alcove become-king:2, Hayloft knight-hop:2). Shove does not break here at
 * ANY tier — not T3 (crush), not T4 (reach 2), not T5 (unlimited) — because
 * the gate is not "how many stones can you move", it is "which stones exist":
 * every stone but one is `fixed`, the plug is a PIECE (no shove of any tier
 * touches it), and the one loose stone's only useful destination is a square
 * of his room. `fixed` is a stronger gate than a tier cap, and it costs the
 * player no agency. Magnet is the same story from the other side: at T5 it can
 * yank the king one square, and one square inside a 2x2 room changes nothing.
 *
 * FULL RUNS (40 each, Normal, never skipping an offer):
 *   RANDOM picks from the kit — 8/40 = 20% clear. Deaths: L3 6, L4 4, L5 8,
 *   L7 8, L9 4, L10 2, every one of them a move-limit loss (arriving at a
 *   single-card level without that card and burning the clock hunting). 20%
 *   sits inside the Moat's 10-25% target and below every recent combo run
 *   (Vault 28%, Slash 40%, Briar 55%, Hayloft 25%).
 *   PAIR pool (`--pool=shove,magnet`) — 4/40 = 10%, LOWER than random, and
 *   for a reason worth reporting: the finale is fine for a pair player (L7-L10
 *   read 83/70/86/67% there) but the MID-RUN is not — L3 65% and L4 46%,
 *   because L3 wants the pull and L4 wants the shield or the second shove, and
 *   a two-card pool has usually only drawn one of the two by then. This is the
 *   inverse of the structural problem the rubric flags (a random picker holds
 *   both halves by L7 and so clears too often): here the kit's TRAP card is a
 *   genuine key on one mid-level, which costs the pure-pair player more than
 *   the finale does.
 *
 * DEAD ENDS, 2026-09-06:
 *   - THE KING'S START SQUARE WAS THE WHOLE DIFFERENCE BETWEEN 0% AND 72%.
 *     L7 and L10 are the same board apart from where he stands. With the king
 *     on h8 — the corner, which is also the HOLD square of the L the capstone
 *     leaves — the pair read 0/32 across every clock from 11 to 14 moves and
 *     every enemiesPerTurn setting, while the identical board with the king on
 *     g7 read 63% and on g8 read 72%. The line is provable either way (attack
 *     up the h-file, he steps to g8, take h8, he is stuck), but the bot will
 *     not find a hold whose square is occupied at the moment it has to plan
 *     for it. RULE: never start the king on the square the shove makes into
 *     the corner of the L. The same edit took L8 from 6% (king g2, off the
 *     hold) to 47% (king h2 — which for the FLOOR pocket IS the hold square,
 *     the mirror of the rule, because there he must be attacked from the file
 *     first) — the general form is "put him one step from the hold, on the
 *     square the first threat drives him off".
 *   - A WATCHED DOOR IS NOT A DOOR (L9 v3). Second L9 build made the entrance
 *     h6 covered by a frozen knight on g4 that only Magnet could remove, with
 *     the shove needed to reach the square the pull is cast from. Shove ALONE
 *     read 100%: a rook slides h5-h7 THROUGH h6 without ever stopping on it,
 *     so a guard covering a doorway punishes nobody. Only a PIECE standing in
 *     the square, or stone, is a door.
 *   - THE PRE-EMPTIVE SHOVE IS UNFINDABLE (L9 v1-v2). The first L9 was the
 *     one docs/new-abilities-2026-09-06.md sketches: a loose block on e5, in
 *     the middle of the plug's own rank, so the plug cannot be pulled, reached
 *     or captured until the block is rolled off the rank. It is the cleanest
 *     gate in the run on paper — no-ability, shove, magnet, aegis and
 *     hourglass all 0% by construction, aegis dead at every tier because there
 *     is no capture to tank — and the pair read 0/32 with the king on h8 AND
 *     on g8. The bot will not spend a card to clear a line that nothing is
 *     currently contesting; this is the Glasshouse's "provable but unfindable"
 *     exactly, and the fix was to make the same idea a threat the bot can see:
 *     the stone must be moved to get IN, not to make a line. (The idea is
 *     still good for a human. It is in this file's history, not in the run.)
 *   - THE CUT AT RANK 2 IS INVISIBLE TO THE BOT (L6 v1). L6 first put the cut
 *     at f2 with the sentry deep in the ledge; magnet read 0% and traces show
 *     the bot walking UP the e-file to rank 8 and shuffling against the face
 *     for the whole clock. It hunts the king's corner and never looks down.
 *     Moving the cut to f5 (where it is on eight of the ten levels) took the
 *     same lock from 0% to 97%. A door the bot has to walk backwards to reach
 *     is not a door either.
 *   - THE CLOCK IS A LOTTERY BEFORE IT IS A KNOB (the Hayloft's lesson, again).
 *     L7/L8/L9 first shipped at 11/12/12 moves and read 6/31/0%; the pair line
 *     is ~9 moves from a lucky start file and ~13 from an unlucky one, so the
 *     clock was measuring the start file. 14/22/13 put them at 72/59/72%.
 *     L8's 22 is genuinely long and is the price of a room at the far end of
 *     the ledge: the walk down g and back along rank 4 costs six moves nobody
 *     can shorten.
 *   - AEGIS + SHOVE IS A SECOND WINNING PAIR ON L7/L8/L10, and this run does
 *     not stop it. Killing it needs TWO defenders on the cut plus two enemies
 *     a turn, and the only ledge squares that defend the cut are the same
 *     squares the route and the capstone need (g4/g6/h4/h6 in every layout).
 *     It costs nothing measured — aegis alone is 0% at T1 and at T5 — so it is
 *     reported, not hidden. L9 is immune by construction (no capture to tank).
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
import type { Hazard } from '../types';

/** A FIXED stone: authored wall Shove may never push. */
const F = (file: number, rank: number): Hazard => ({ file, rank, fixed: true });

/**
 * THE FACE — file f (6) stone on every rank except the CUT(s). One square
 * thick, so Shove could open it anywhere; every stone in it is fixed, so
 * Shove can open it nowhere.
 */
const FACE = (...cuts: number[]): Hazard[] => {
  const out: Hazard[] = [];
  for (let rank = 1; rank <= 8; rank++) {
    if (!cuts.includes(rank)) out.push(F(6, rank));
  }
  return out;
};

/**
 * The pit floor under the ledge. Also the reason Rookie's random start file
 * (seed.ts `randomizedRookieStart`) can never put her BEHIND the face: rank 1
 * is occupied on f, g and h.
 */
const FLOOR: Hazard[] = [F(7, 1), F(8, 1)];

export const RUN_REVENGE_32: RunDef = {
  id: 'revenge-32',
  name: 'The Quarry',
  blurb: 'One face, one cut, one loose stone. Move the wall.',
  allowedAbilities: ['shove', 'magnet', 'aegis', 'hourglass'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE OPEN CUT. Still king on the ledge, and the face has a two-square
    // cut at ranks 4-5. Slide east along rank 5, straight through the face, up
    // the h-file, take him. Teaches the whole board in one move: there is a
    // wall, it has a hole, he lives behind it.
    make(
      1,
      [pawn(2, 7), king(8, 7)],
      {
        ...STILL,
        moveLimit: 8,
        hazards: [...FACE(4, 5), ...FLOOR, F(3, 3), X(2, 6)],
      },
    ),
    // L2 — THE FAR DOOR. Still king at the BOTTOM of the ledge (g2) and the
    // only cut is at the very TOP (f8). Climb to rank 8, cross, come all the
    // way back down the g-file. Count the walk before you start it.
    make(
      2,
      [pawn(4, 5), king(7, 2)],
      {
        ...STILL,
        moveLimit: 10,
        hazards: [...FACE(8), ...FLOOR, F(4, 4), X(3, 5)],
      },
    ),
    // L3 — THE PLUG. First flee king, and the cut (f5) is plugged by a pawn
    // jammed against the face — the square in front of it is stone, so it
    // never moves. A bishop set into the ledge at g4 is frozen (f3 and f5 and
    // h3 and h5 are all blocked) and defends the cut, so taking the plug
    // where it stands is death. MAGNET: stand back on rank 5, drag it out
    // onto the open floor and take it there for nothing. His room is a ROW,
    // so once you are through, a rook owns it. KEY = magnet.
    make(
      3,
      [pawn(6, 5), bishop(7, 4), king(8, 8)],
      {
        ...FLEE,
        moveLimit: 12,
        kingPen: ['g8', 'h8'],
        hazards: [...FACE(5), ...FLOOR, F(8, 3), F(8, 5), X(2, 4)],
      },
    ),
    // L4 — THE SLOT. Same cut, same plug, same frozen bishop — but a block
    // sits on d5, so rank 5 dead-ends at e5 and the only square with a line to
    // the plug is the one right beside it. Magnet needs TWO squares of room
    // and has one: it cannot even target him. AEGIS: take the plug where it
    // stands, eat the bishop's reply, walk on. KEY = aegis. The block on d5 is
    // the level's LOOSE stone, which is the run's other lesson arriving early:
    // roll it off rank 5 from d4 and Magnet has its two squares back, so
    // shove+magnet is the second answer (69%) and shove alone is still 0%.
    make(
      4,
      [pawn(6, 5), bishop(7, 4), king(8, 8)],
      {
        ...FLEE,
        moveLimit: 11,
        kingPen: ['g8', 'h8'],
        hazards: [...FACE(5), ...FLOOR, F(8, 3), F(8, 5), X(4, 5)],
      },
    ),
    // L5 — THE CAPSTONE. The cut is wide open and there is nothing alive on
    // the board but him — and you still cannot win, because his room is the
    // 2x2 corner and a lone rook can never hold a 2x2: every square she takes
    // covers exactly two of the other three and he steps to the fourth,
    // forever. g6 is the one loose block in the level. SHOVE: stand under it
    // on g5 and roll it into g7. Three squares is an L, an L has a corner,
    // and the corner attacks the other two. KEY = shove, and the only card in
    // the kit that does anything here at all.
    make(
      5,
      [king(7, 8)],
      {
        ...FLEE,
        moveLimit: 10,
        kingPen: ['g7', 'g8', 'h7', 'h8'],
        hazards: [...FACE(5), ...FLOOR, X(7, 6)],
      },
    ),
    // L6 — THE SENTRY. Nothing plugs the cut this time; the lock is one
    // square past it. A bishop sits at g5 — the square every rook coming
    // through the cut has to land on — frozen solid (f4 and f6 are the face,
    // h4 and h6 are stone), and defended by a knight on h7 whose only three
    // jumps are the face twice and the bishop itself. Take it where it stands
    // and the knight takes you. MAGNET: from rank 5, drag the sentry off the
    // ledge and INTO the cut, where nothing defends it, and take it there.
    // KEY = magnet (aegis is the second answer).
    make(
      6,
      [bishop(7, 5), knight(8, 7), king(7, 8)],
      {
        ...FLEE,
        moveLimit: 12,
        kingPen: ['g7', 'g8'],
        hazards: [...FACE(5), ...FLOOR, F(8, 4), F(8, 6), X(3, 4)],
      },
    ),
    // L7 — THE DOOR. The finale starts, and from here every level carries
    // BOTH locks at once: a plug in the cut that no stone can shift, and a
    // 2x2 room that no line can hold. The plug is defended by the knight on
    // h4, whose four jumps are the face (f3), the plug itself (f5), the stone
    // on g2 and the capstone on g6 — it is frozen forever and it lives behind
    // the wall, so it can never be taken and never be pulled. Pull the plug
    // WEST onto the floor, take it there for nothing, slide through the empty
    // cut to g5 (never stopping in it), roll g6 into g7, and go in through
    // the square the stone left. The teaching line. MAGNET + SHOVE.
    make(
      7,
      [pawn(6, 5), knight(8, 4), king(7, 8)],
      {
        ...FLEE,
        moveLimit: 14,
        kingPen: ['g7', 'g8', 'h7', 'h8'],
        hazards: [...FACE(5), ...FLOOR, F(7, 2), X(7, 6)],
      },
    ),
    // L8 — WHICH STONE. His room is a pocket in the FLOOR of the ledge this
    // time (g2 g3 h2 h3, the pit floor sealing it from below) and the stone
    // has to roll DOWN into it: g4 is the capstone, h4 is the door. There are
    // TWO loose stones and one shove. h5 looks like spare masonry; it is one
    // of the four squares that freeze the sentry bishop on g6, and rolling it
    // spends the shove his room needed AND frees the only piece on the board
    // that can come after you. MAGNET + SHOVE.
    make(
      8,
      [pawn(6, 5), bishop(7, 6), king(8, 2)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 22,
        kingPen: ['g2', 'g3', 'h2', 'h3'],
        hazards: [...FACE(5), ...FLOOR, F(8, 7), X(8, 5), X(7, 4)],
      },
    ),
    // L9 — NO WAY IN BUT THE STONE. L7's board with one square changed: h5
    // is stone, so the h-file is cut and the door at h6 cannot be reached
    // from below at all. The only route into his room is g6 — the square the
    // capstone is standing on. Here the shove is not the seal you add once
    // you are inside, it is the DOOR, and the one motion that opens it also
    // kills g7 and turns the 2x2 into an L. Two enemies a turn and three
    // moves less clock than L7. MAGNET then SHOVE, in that order, always.
    make(
      9,
      [pawn(6, 5), knight(8, 4), king(7, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 13,
        kingPen: ['g7', 'g8', 'h7', 'h8'],
        hazards: [...FACE(5), ...FLOOR, F(7, 2), F(8, 5), X(7, 6)],
      },
    ),
    // L10 — THE STEP. Everything is L7 again except one square: he is
    // STANDING on g7, the square the capstone has to land on, and Shove will
    // not drop a rock on the king. Go in through the door, attack him along
    // rank 7 so he steps to the far corner, walk back out to g5, roll the
    // stone into the square he just left, and come back for him. Two enemies
    // a turn and a clock that only fits if you make the trip once.
    make(
      10,
      [pawn(6, 5), knight(8, 4), king(7, 7)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 14,
        kingPen: ['g7', 'g8', 'h7', 'h8'],
        hazards: [...FACE(5), ...FLOOR, F(7, 2), X(7, 6)],
      },
    ),
  ],
};
