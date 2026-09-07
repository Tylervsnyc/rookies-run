/**
 * revenge-36 — THE TURNSTILE. Built 2026-09-07 for the signature pair
 * QUEEN PULSE + SMOKE ("he only stands still when you are not there").
 * Kit = queen-pulse / smoke / aegis / magnet (`allowedAbilities` IS the kit).
 * All four cards are LIVE, so this run is promotable as it stands.
 *
 * WHY THIS PAIR. It is the top unbuilt entry left on the priority list and the
 * discovery harness has already proved it can gate: `queen-pulse+smoke` gates
 * checker-L9-v19-s249 at 70% with a UNIQUE answer under two different kits
 * (data/run-playtest/combo-library/queen-pulse+smoke/), while every single card
 * in those kits reads 0%. QUEEN PULSE has never been a signature card in any
 * shipped run — it has only ever sat in the inert `REVENGE_CORE` offer list —
 * and SMOKE has been half of exactly one pair before this (smoke +
 * rabies-dart, The Alley, where its job was to blind a rabid court, not to
 * touch the king at all).
 *
 * THE VERB: MAKE HIM STOP RUNNING, THEN ARRIVE ON A LINE NO ROOK CAN WALK.
 * Not crossing a wall (The Moat), not baiting hunters (The Alley), not a
 * poison timer (The Switchback), not blowing a hole (The Briar), not caging
 * with his own guard (The Alcove), not a double door (The Millstone), not a
 * two-rook net (The Parapet), not buying a body time (The Lattice), not moving
 * the wall (The Quarry), not an undo (The Dogleg), not a capture you do not
 * survive (The Picket), not swapping him onto a post (The Squint), not making
 * him run the WRONG way (The Hayloft). This run stops the running altogether.
 * Every other card in the game that beats a fleeing king MOVES something —
 * him, a guard, a stone, a body. Smoke moves nothing: it deletes Rookie from
 * the court's eyes, and `kingReaction` returns null before it ever asks where
 * he could go.
 *
 * THE MECHANISM, read out of lib/run/pawn-ai.ts and lib/run/abilities.ts:
 *   - `kingReaction` (pawn-ai.ts) opens with `if (isSmoked(state)) return null`.
 *     A smoked Rookie is not a threat he can see, so the free sidestep that
 *     makes a 2x2 pen unbeatable for a lone rook simply does not happen. The
 *     same flag makes hunters hold their posts (`if (smoked) continue`) and
 *     deletes her from every capture target list, so the cover is armour on the
 *     approach as well as a hold on the throne. It is a FREE action.
 *   - Smoke at T1 is ONE use covering ONE enemy turn (`smokeTurns`), and
 *     `breakSmokeOnCapture` ends it below T5 the moment ROOKIE captures
 *     anything. So the card is not "be safe for a while" — it is one enemy
 *     turn, spent exactly once, and a capture on the way spends it for nothing.
 *   - Queen Pulse at T1 is ONE use and ONE move (`maxUsesForTier` 1,
 *     `transformDurationForTier` 1, decremented in engine.ts applyRookieMove).
 *     It is not "be a queen" — it is ONE move on a line a rook does not have,
 *     and she is a rook again before the enemy turn begins. A queen is blocked
 *     by stone exactly where a rook is, so unlike bishop-step / knight-hop /
 *     become-king it is NOT a universal solvent: all it adds is the diagonal.
 *   - A lone rook never corners a fleeing king in a 2x2 (The Vault, The
 *     Alcove): he steps to the line she is not on, forever. That is the whole
 *     back half of this run, and smoke is the only thing in the kit that ends
 *     it.
 *
 * CONSTANT SIGNATURE — THE COURT, THE DOOR AND THE POST. Every level of this
 * run draws the same three things in the same corner:
 *   1. THE COURT. A 2x2 room of free squares in the north-east (g7/g8/h7/h8),
 *      walled on the west by f7+f8 and on the south by f6+h6.
 *   2. THE DOOR. Exactly one square of that wall is missing — g6 — and it is
 *      the only way in or out of the court for anything that moves on lines.
 *   3. THE POST. A single stone set directly OUTSIDE the door, at g5, in the
 *      door's own file.
 * The post is the run. It is one stone and it does one thing: it means NO RANK
 * AND NO FILE PASSES THROUGH THE DOOR. g6's four orthogonal neighbours are
 * g5 (the post), f6 and h6 (the wall) and g7 (inside). A rook, a pawn, a
 * marching wall, a pulled guard — anything that moves in straight lines —
 * stands on f5 or h5 and looks at a door it can see through and cannot enter.
 * The only move in the game that steps around a post is a 45-degree one.
 * A doorway you can only enter sideways is a TURNSTILE, and that is the name.
 *
 * Not a band across rank 5 (The Moat), not columns (The Colonnade), not a
 * sealed box (The Vault / The Glasshouse), not offset bars (The Switchback),
 * not a hedge (The Briar), not shafts (The Stacks), not a diagonal of stone
 * (The Slash / The Cliff), not an alley (The Alley), not a diamond round a
 * pillar (The Millstone), not a solid rank (The Parapet), not a checker field
 * (The Lattice), not a one-wide slot (The Alcove), not a ring (The Keep), not
 * a roof (The Hayloft), not a burrow (The Warren), not a quarry face (The
 * Quarry), not a corridor with a bend (The Dogleg), not a back wall with a
 * gate (The Picket), not a cell with a slit of light (The Squint): a room with
 * ONE door and ONE stone standing in front of it.
 *
 * TWO HARD RULES THIS GEOMETRY IMPOSES (both learned the expensive way, see
 * DEAD ENDS):
 *   - NOTHING CAPTURABLE MAY EVER STAND INSIDE THE COURT ON L7-L10. Any
 *     capture credited to Rookie stuns the king, and a stun is a smoke
 *     substitute: one guard inside the room turns queen-pulse into a solo
 *     answer (take the guard from g7, he is stunned, take him next move).
 *     The court holds the king and nothing else. All pressure lives on
 *     the floor, on the far side of a wall she has to cross anyway.
 *   - NO SUMMON MAY EVER BE IN THIS KIT. A summon spawns on one of the eight
 *     squares beside Rookie, and g6 — the door — is diagonally adjacent to h7
 *     and orthogonally adjacent to g7. A body dropped from the doorway lands
 *     INSIDE the court, and the run is over. Same reason there is no
 *     freeze-ray (a frozen king does not flee — `frozenSquares` is checked in
 *     `kingReaction` two lines below the smoke check, so it is literally the
 *     same card), no scarecrow, no snare, no boulder, no poison-dart, no
 *     decoy, no sacrifice, no convert: every one of them either stops him
 *     moving or hands her a capture-stun, and either is smoke by another name.
 *
 * ONE FACT ABOUT THE DOOR THAT COST THREE REVISIONS. The post kills every
 * rank and file through g6, but it does NOT kill the diagonal — the line
 * f5-g6-h7 runs straight through the doorway into the court, so a queen
 * launching from f5 lands INSIDE in one move, not in the doorway. h5's
 * diagonal is the other one, h5-g6-f7, and f7 is wall, so from h5 she gets
 * exactly the door square and no more. That asymmetry is now a design knob
 * rather than a bug: leave f5 open and the level has a short road and a long
 * one (L7); stone f5 and there is one road and it ends at the door (L4, L5,
 * L8, L10).
 *
 * THE ARC
 *   L1     the post is not there yet. Ride the g-file through the open door.
 *   L2     same door, and he RUNS — a two-square pen a bare rook can still
 *          close. The last level no ability is needed.
 *   L3     THE POST APPEARS. The court is sealed to every straight line in the
 *          game and he is standing still. QUEEN PULSE, once, to step around it.
 *   L4     the post is there but the wall has a POSTERN at h6, corked by a
 *          bishop a jammed knight defends. MAGNET drags the cork out of the
 *          knight's cover; AEGIS pays the knight instead.
 *   L5     a SENTRY stands on the door itself — a jammed pawn that covers both
 *          f5 and h5, so the diagonal is shut too — and the bishop jamming the
 *          h-file is the thing it defends. AEGIS.
 *   L6     THE POST IS GONE AGAIN. Walk straight in through the open door, and
 *          discover that getting in was never the problem: his room is a 2x2
 *          and a rook in a 2x2 never closes it. SMOKE, once, and he is a
 *          statue.
 *   L7-L10 the wall is whole and the post is back. Only the turnstile, and
 *          only the pair.
 *
 * KIT = queen-pulse / smoke / aegis / magnet.
 *   queen-pulse  KEY on L3. Half of L7-L10 — the door. TRAP on L4/L5 (the
 *                turnstile pocket is dead-ended by stone on those levels, so
 *                the diagonal buys a square with nothing behind it) and on
 *                L6/L2 (getting in was never the problem there). Alone in the
 *                finale it walks through the door and then dances in the 2x2
 *                forever.
 *   smoke        KEY on L6. Half of L7-L10 — the hold. TRAP on L1-L5: nothing
 *                on those levels is decided by whether he sidesteps, and on
 *                L4/L5 spending it on the guard costs the level its clock.
 *                Alone in the finale it is armour on a road that dead-ends at
 *                the post.
 *   aegis        KEY on L4 and L5 (100% on both) — the paid answer to a
 *                defended cork, the one shape the Picket proved this card is
 *                findable in. TRAP everywhere else: a shield is not a line,
 *                and nothing inside the court ever attacks her at all.
 *   magnet       The kit's pure TRAP, in the seat The Squint's magnet held.
 *                Second answer on L4 (81% — drag the cork below the knight's
 *                cover and take it for free) and a thin one on L5 (38%). 0%
 *                on every other level and on all four finales. The fact that
 *                makes it safe here is worth writing down: a pull runs along
 *                ROOKIE'S OWN rank or file and moves the target TOWARD her, so
 *                it can never clear a blocker out of the road she is
 *                travelling, and none of her lines ever enter the court.
 *   No universal solvents (bishop-step, knight-hop, become-king all cross a
 *   turnstile trivially), no second transform, no summons, no capture-stun
 *   cards. `offerCore` is deliberately UNSET: the usual REVENGE_CORE list
 *   contains queen-pulse, and with `offerCoreMin: 2` against a four-card pool
 *   that would have forced half the signature pair onto every single slate.
 *
 * THE FOUR FINALE DECISIONS (written before building, per "One line, four
 * times"). Same two cards, a different decision on each level:
 *   L7  THE TURNSTILE — the teaching level, and the only one with TWO ROADS.
 *       He is on h8, which the door has no line on. From h5 the diagonal stops
 *       at the door and the cover is spent two moves later, on g8, the move
 *       that first threatens him; from f5 the same diagonal carries her to h7
 *       inside the room and both cards go down together. Either works, which
 *       is what makes this the forgiving one.
 *   L8  THE DOOR IS THE LINE — SMOKE COMES FIRST, in the SAME TURN. He is on
 *       g8, so the door square g6 already looks straight up the g-file at him.
 *       Step through unsmoked and he is gone to h7/h8 before she moves again,
 *       with her one queen move spent and no second door. Both cards on one
 *       turn or the level is unwinnable. The post is two stones wide (f5+g5),
 *       so h5 is the only launch square.
 *   L9  THE SIDE DOOR — the post MOVES. The south face is solid (g6 and h6
 *       both stone) and the turnstile is cut into the WEST wall instead: f7 is
 *       the door and e7 is its post. So the approach is not up the middle of
 *       the board but along its flank, the launch squares are e6 and e8 (e8 is
 *       on his own back rank, the long way round), and the walk inside runs
 *       along rank 7 rather than up the g-file. A level built to prove the
 *       signature is the POST and not the corner it happens to sit in.
 *       (An earlier build stoned e6 to force the back-rank route and the bot
 *       read the pair at 0% — see DEAD ENDS.)
 *   L10 THE STEP INTO HIS ROOM — the kill square is INSIDE the pen. He is on
 *       h7, and the only squares in the level with a line on h7 are g7 and h8,
 *       both inside his own room and both squares he can flee to. So the last
 *       move is a step into the room and it must carry the cover; and she gets
 *       exactly one move from the doorway to pick the right line (g7 holds h7,
 *       g8 holds h8). TWO ENEMIES A TURN — the only level in the run that has
 *       it — with the knights hunting her the whole way up.
 *
 * ===========================================================================
 * MEASURED — 2026-09-07, difficulty=normal, `revenge.ts matrix`. The finale
 * and tier rows are the NUMBERS OF RECORD: 32 trials, `--jobs=1`, serial.
 *
 * THE GATE (L7-L10, kit cards at T1, the run's own four-card kit):
 *
 *   L    none  queen-pulse  smoke  aegis  magnet  |  queen-pulse+smoke
 *   L7     0%           0%     0%     0%      0%  |               72%
 *   L8     0%           0%     0%     0%      0%  |               63%
 *   L9     0%           0%     0%     0%      0%  |               72%
 *   L10    0%           0%     0%     0%      0%  |               72%
 *
 * No-ability 0% on all four, every single card in the kit 0% on all four (the
 * ceiling is 8%), and the signature pair 63-72% — inside the 60-80% band Tyler
 * asked for after the Lattice and the Alcove read 100%. Nothing here is a
 * rounding call: the singles are not "low", they are zero, twenty-eight cells
 * of it.
 *
 * THE TIER LADDER (L7-L10, 32 trials, serial, one card pinned at a time):
 *
 *   queen-pulse:1   0 /  0 /  0 /  0     <- shipped tier
 *   queen-pulse:2 100 /  0 /100 / 59
 *   queen-pulse:3 100 /100 /100 /100
 *   queen-pulse:4 100 /100 /100 /100
 *   queen-pulse:5 100 /100 /100 /100
 *   smoke:3         0 /  0 /  0 /  0
 *   smoke:5         0 /  0 /  0 /  0
 *   aegis:5         0 /  0 /  0 /  0
 *   magnet:5        0 /  0 /  0 /  0
 *
 * The break is T2 and the reason is the one the design doc predicts: T2 is
 * where `transformDurationForTier` goes 1 -> 2, and a SECOND queen move is the
 * difference between "step around the post" and "step around the post AND
 * stand on a square that covers his whole room". A queen adjacent to a king in
 * a 2x2 attacks all four squares of it, so he cannot sidestep and she does not
 * need the smoke at all. There is no geometry fix — any 2x2 is covered from
 * inside it — so the cap is the answer and it can only be 1. Every other card
 * in the kit is 0% at its own ceiling, so `abilityTierCaps: { 'queen-pulse': 1 }`
 * is the whole cap list, and `tier-cap-audit.ts` passes it (352000 slates,
 * 966000 options, 0 violations; offered as a new pick 1339 times, never above
 * the cap). Note L8 is 0% even at T2: on that level the door itself is the
 * line, so an unsmoked crossing has already lost the level before the second
 * queen move exists.
 *
 * THE LADDER (L1-L6, 24-32 trials, --jobs=3):
 *
 *   L    none  queen-pulse  smoke  aegis  magnet
 *   L1   100%         100%   100%   100%    100%   free
 *   L2   100%         100%   100%   100%    100%   free
 *   L3     0%         100%     0%     0%      0%   queen-pulse, alone
 *   L4     0%         100%     0%   100%     42%   aegis / the f5 diagonal
 *   L5     0%         100%     0%   100%     25%   aegis / the west door
 *   L6     0%         100%   100%     0%     13%   smoke / the room itself
 *
 * L1-L2 are winnable with nothing, L3-L6 with nothing are 0%, and each of
 * L3-L6 has at least one card at 100%. Both halves of the signature pair get a
 * level that teaches exactly what they do: L3 is the door, L6 is the room.
 *
 * FULL RUNS (`revenge.ts runs --runs=40`, normal):
 *   random picks       4/40 = 10% full clears
 *   pool=queen-pulse,smoke  16/40 = 40% full clears
 *
 * The pair pool at 40% sits with the Glasshouse (43%) and below the Colonnade
 * (55%); the random-pick 10% is LOW for this catalogue, and the per-level
 * breakdown says exactly why, with no mystery in it: L3 clears 28% and every
 * level after it clears 100%, 100%, 100%, 64%, 57%, 100%, 100%. L3 is the
 * run's first gate and it is gated on QUEEN PULSE specifically — and the bot's
 * offer heuristic does not like Queen Pulse. Across the 40 random runs it took
 * magnet 43 times, smoke 32, aegis 31 and queen-pulse 11. That is an offer-
 * preference number, not a level-difficulty number, and it is the one thing in
 * this run worth a second opinion from Tyler: the alternative is to soften L3
 * so a second card opens it, at the cost of the level that teaches the door.
 *
 * ===========================================================================
 * DEAD ENDS (what was measured and thrown away)
 *
 * 1. THE DIAGONAL DOES NOT STOP AT THE DOOR (L4 v1, measured 100% for
 *    queen-pulse on a level meant to be an aegis puzzle). The post kills every
 *    rank and file through g6 and it was assumed to make the door a one-square
 *    step. It does not: f5-g6-h7 is a single straight diagonal and a queen
 *    launching from f5 lands two squares in, INSIDE the room, in one move. The
 *    other launch square is safe by luck of geometry — h5-g6-f7 runs into the
 *    wall. Stoning f5 is now the deliberate switch that turns the door from a
 *    two-square road into a one-square one (L8 and L10 use it), and L7 leaves
 *    it open on purpose to give the teaching level a short road and a long one.
 *
 * 2. KNIGHTS JUMP INTO A SEALED ROOM, AND A CAPTURE INSIDE IT IS SMOKE (L8 v2,
 *    measured: queen-pulse alone 13% at 16 trials, then 25% at 24). The court
 *    is sealed against every line in the game but g7 is a knight's jump from
 *    f5, h5, e6 and e8. A knight that hops in is a free capture, a capture
 *    stuns the king, and a stunned king does not sidestep — which is precisely
 *    what smoke is for. On L8 and L10 the door's own line runs at the king, so
 *    the relay is a whole solo answer: cross, take the knight from the doorway,
 *    take him from the square the knight was standing on. THE FIX, and the
 *    reusable fact: an EVEN-squared (dark) bishop can never enter this court.
 *    The court's two even squares are g7 and h8, g7's four diagonal neighbours
 *    are f6, h6, f8 (all wall) and h8, so {g7, h8} is an island — the only
 *    bishop colour that is sealed out by the same stones that seal the room.
 *    L8 and L10 use dark bishops for that reason. L7 and L9 keep their knights
 *    because there the door's line does not reach the king, so a stun bought
 *    inside the room is spent on a square he is not standing on: harmless, and
 *    measured 0% for queen-pulse alone on both.
 *
 * 3. A CAPTURE ANYWHERE ON A LINE INTO THE ROOM IS THE SAME BUG (L6 v1-v2,
 *    measured no-ability 75%, then 44% after the hunter was changed). L6 has
 *    an open door, so a bare rook gets in — and a wandering enemy on the road
 *    turned that into a win: take it, the king freezes, walk the file. Even
 *    with the hunter removed the level still read 44%, because with the
 *    postern open the h-file ran clean from rank 1 to his throne and one
 *    Rookie start in eight was an immediate capture. L6 ships with the wall
 *    whole, the POST REMOVED instead, and one pawn on the far side of the
 *    board that has no line into anything. It is the cleanest statement the
 *    run makes: the door is wide open, walk in, and it does not help you.
 *
 * 4. A LEVEL THE BOT CANNOT FIND IS NOT A LEVEL (L9 v1, measured 0% for the
 *    pair). The first side-door build stoned e6 as well as e7 so that the only
 *    square able to step around the west post was e8, on the king's own back
 *    rank, reached up the d-file and along rank 8. The line is real and about
 *    seven moves; the bot never went there once, and the trace shows it
 *    shuffling between e5 and f5 looking for the south door that no longer
 *    existed. Same lesson as the Glasshouse: a pre-emptive walk away from the
 *    king with no reward on the way is invisible to the search. e6 shipped
 *    open, e8 stayed as the long way round for a human, and the pair went to
 *    72%.
 *
 * 5. MAGNET NEVER EARNED A KEY LEVEL, AND THE REASON IS GENERAL. A magnet pull
 *    runs along ROOKIE'S OWN rank or file and drags the target TOWARD her, so
 *    against a blocker sitting in the road she is travelling it can only ever
 *    move the blocker further down that same road. The only thing it buys is a
 *    FREE capture — drag the cork below its defender's cover and take it on
 *    open ground — which is exactly the shape aegis also answers, by paying
 *    instead. Measured across four attempts at a magnet-only level in this
 *    corner (42%, 38%, 25%, 6%) against aegis's 100% on all of them. The
 *    geometry is too tight for a cross-line pull: everything that matters is
 *    on the h-file or the g-file, and she approaches along them. Magnet ships
 *    as the kit's pure TRAP, the seat it holds in The Squint and The Millstone,
 *    and it is a GOOD trap here: 0% on all four finales at every tier, and the
 *    card is never dead weight in an offer because it does answer L4 two times
 *    in five.
 *
 * 6. THE CLOCK IS NOT THE KNOB ON A SHORT LINE (L8, measured). L8's whole line
 *    is "reach h5, smoke and cross, capture" — four or five moves — so cutting
 *    the move limit from 12 to 8 to 7 to 6 moved the pair 92% -> 92% -> 88%.
 *    What actually moved it was a fourth dark bishop with two enemies a turn:
 *    67%. Pressure that can kill her is worth more than a clock she was never
 *    going to run out of. The opposite is true on L10, where the line ends
 *    INSIDE his room and the clock is the difference between 59% and 72%.
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

/**
 * THE COURT WALL — f6/f7/f8 down the west face and h6 closing the south-east.
 * g6 is the hole in it: THE DOOR. Present on all ten levels; on L4-L5 the
 * south face is opened at h6 (the POSTERN) and on L4/L5 g7 is stone so the
 * doorway pocket dead-ends.
 */
const WALL: ReadonlyArray<Coord> = [
  X(6, 6), // f6
  X(6, 7), // f7
  X(6, 8), // f8
  X(8, 6), // h6
];

/** THE POST — one stone in the door's own file, directly outside it. */
const POST = X(7, 5); // g5

/** The full finale floor: the wall plus the post. Court = g7 g8 h7 h8. */
const COURT: ReadonlyArray<Coord> = [...WALL, POST];

/** His room, on every level from L6 on. */
const PEN = ['g7', 'g8', 'h7', 'h8'];

const RUN_REVENGE_36: RunDef = {
  id: 'revenge-36',
  name: 'The Turnstile',
  blurb:
    'One door, one stone in front of it. Step around the post — then vanish, so he forgets to run.',
  allowedAbilities: ['queen-pulse', 'smoke', 'aegis', 'magnet'],
  // Measured L7-L10, 32 trials, serial: queen-pulse alone is 0/0/0/0 at T1 and
  // 100/0/100/59 at T2 — the tier that turns ONE queen move into two, which is
  // the difference between "step around the post" and "step around the post
  // AND cover his whole room". T3-T5 are 100% on all four. Smoke (T3, T5),
  // aegis (T5) and magnet (T5) all still read 0/0/0/0, so this is the only
  // card whose tier breaks the gate and 1 is the only cap the numbers allow.
  abilityTierCaps: { 'queen-pulse': 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE OPEN DOOR. No post yet: the g-file runs from rank 1 straight
    // through the door to his throne. The silhouette, for nothing.
    make(1, [king(7, 8), pawn(3, 3)], {
      ...STILL,
      moveLimit: 12,
      hazards: [...WALL],
    }),
    // L2 — THE RUNNER. Same open door, and now he runs — but his room is only
    // g8 and h8, and a rook that reaches g7 and then g8 leaves him nowhere on
    // rank 8 to stand. The last level that needs no card.
    make(2, [king(7, 8), knight(4, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: [...WALL],
      kingPen: ['g8', 'h8'],
    }),
    // L3 — THE POST (queen-pulse KEY). One stone at g5 and the whole court is
    // sealed against every rank and every file in the game. He is standing
    // still on h8 and it does not help: no line reaches him. Stand on f5 or
    // h5, step around the post, and the room is yours.
    make(3, [king(8, 8), pawn(3, 3), pawn(5, 2)], {
      ...STILL,
      moveLimit: 12,
      hazards: [...COURT],
    }),
    // L4 — THE POSTERN, CORKED (aegis KEY). h6 is missing from the wall, so the
    // h-file is a road into the court — and a bishop is standing in it, jammed
    // between the post and the stone at g7, with a knight on g8 that e7 and f6
    // have nailed to its square. Three ways past a defended cork, in order of
    // how often the bot finds them: pay the knight behind a shield (100%), step
    // around the post on the f5 diagonal and ignore the road entirely (100%),
    // or drag the cork down the file and take it on ground the knight does not
    // cover (42%).
    make(4, [king(8, 8), bishop(8, 6), knight(7, 8)], {
      ...STILL,
      moveLimit: 12,
      hazards: [X(6, 6), X(6, 7), X(6, 8), POST, X(7, 7), X(5, 7)],
    }),
    // L5 — THE SENTRY IN THE DOORWAY (aegis KEY, queen-pulse the long way
    // round). A pawn is standing ON the south door, jammed by the post beneath
    // it, and because a black pawn on g6 bites f5 and h5 it covers BOTH squares
    // the turnstile can ever be entered from: that door is shut to the diagonal
    // as well as to every line. The h-file is the road instead, and a bishop is
    // sitting in it on h5, jammed by g4 and by the sentry above it — and that
    // sentry is exactly what defends it. Take it anyway, behind the shield.
    // The wall's WEST face carries a second turnstile (f7, post at e7), which
    // is the whole reason this level is passable for a player who took the
    // signature pair and neither trap card: go the long way, round the flank.
    make(5, [king(8, 8), bishop(8, 5), pawn(7, 6), pawn(3, 3)], {
      ...STILL,
      moveLimit: 13,
      hazards: [X(6, 6), X(6, 8), POST, X(7, 4), X(5, 7)],
    }),
    // L6 — THE DANCE (smoke KEY). The postern is wide open, nothing corks it,
    // nothing covers it — walk up the h-file into his room. And then discover
    // the other half of the run: his room is a 2x2 and a rook in a 2x2 never
    // closes it. He steps to the line she is not on, every turn, forever.
    // Vanish for one turn and he is a statue.
    make(6, [king(8, 8), pawn(3, 3)], {
      ...FLEE,
      moveLimit: 14,
      hazards: [...WALL],
      kingPen: PEN,
    }),
    // L7 — THE TURNSTILE (finale, teaching). The postern is bricked: the wall
    // is whole and the post stands in front of the only door. He is on h8,
    // which the door has no line on, so the crossing itself threatens nothing.
    // TWO ROADS, which is what makes this the forgiving one: from h5 the
    // diagonal stops at g6 (f7 is stone behind it) and the cover is spent two
    // moves later on g8, the move that first looks at him; from f5 the same
    // diagonal runs f5-g6-h7 and puts her INSIDE in one move, where both cards
    // go down on the same turn. Three knights on the floor and nine moves.
    make(7, [king(8, 8), knight(3, 4), knight(5, 3), knight(2, 6)], {
      ...FLEE,
      moveLimit: 9,
      hazards: [...COURT],
      kingPen: PEN,
    }),
    // L8 — THE DOOR IS THE LINE. He has moved to g8, and the door square looks
    // straight up the g-file at him. Cross without the cover and he is on h7
    // or h8 before she moves again, with her one queen move gone — the level
    // is over the instant she steps through unsmoked. Both cards, one turn.
    // The post is two stones wide now (f5 and g5), so h5 is the only launch.
    make(8, [king(7, 8), bishop(3, 3), bishop(6, 2), bishop(2, 6), bishop(5, 5)], {
      ...FLEE,
      moveLimit: 6,
      enemiesPerTurn: 2,
      hazards: [...COURT, X(6, 5)],
      kingPen: PEN,
    }),
    // L9 — THE SIDE DOOR. The south face is solid — g6 and h6 are both stone —
    // and the turnstile has moved to the WEST wall: f7 is the door and e7 is
    // its post. e6 is stone too, so the only square in the level that can step
    // around this post is e8, on his own back rank. Up the d-file, along rank
    // 8, in through the side, and the same pair from the other side of him.
    make(
      9,
      [king(8, 8), knight(3, 3), knight(6, 2), knight(2, 4)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [X(6, 6), X(6, 8), X(7, 6), X(8, 6), X(5, 7)],
        kingPen: PEN,
      },
    ),
    // L10 — THE STEP INTO HIS ROOM. He starts on h7. Nothing in the level has
    // a line on h7 except g7 — inside his own room, a square he can flee to —
    // so the last move is a step into the pen and it has to carry the cover.
    // Read where he is standing before you step: from the doorway g6 she is
    // one move from g7 (which holds h7) and one move from g8 (which holds h8),
    // and she only gets one. Three hunters, two of them acting every turn,
    // twelve moves, and f5 is stone so h5 is the only launch.
    make(
      10,
      [king(8, 7), knight(3, 3), knight(2, 6)],
      {
        ...FLEE,
        moveLimit: 14,
        enemiesPerTurn: 2,
        hazards: [...COURT, X(6, 5)],
        kingPen: PEN,
      },
    ),
  ],
};

export { RUN_REVENGE_36 };
export default RUN_REVENGE_36;
