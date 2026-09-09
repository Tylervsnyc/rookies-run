/**
 * revenge-42 — THE INLAY. Built 2026-09-08 for the signature pair
 * CHEQUER + PAGE. Kit = chequer / page / aegis / magnet (`allowedAbilities`
 * IS the kit). CHEQUER IS A NEW ABILITY, built for this run and left at the
 * TESTING stage, so this run is /playtest-only.
 *
 * ***THIS RUN DOES NOT MEET THE COMBO GATE. It ships as `idea`, not `built`.***
 * The numbers, the reason, and the engine fact that killed it are at the
 * bottom (MEASURED / DEAD ENDS). Read that before building on this file. The
 * CARD came out clean and is the part worth keeping.
 *
 * THE VERB: HALVE HIS COMPASS, AND COVER THE HALF THAT IS LEFT WITH A BODY
 * THAT CAN NEVER TOUCH HIM. Not crossing a wall (The Moat), not baiting
 * hunters (The Alley), not a poison timer (The Switchback), not blowing a
 * hole (The Briar), not caging with his own guard (The Alcove), not a double
 * door (The Millstone), not a two-rook net (The Parapet), not buying a body
 * time (The Lattice), not moving the wall (The Quarry), not an undo (The
 * Dogleg), not a suicide capture (The Picket), not a lure (The Pinch), not
 * zugzwang (The Niche). Every one of those argues about WHICH squares he has
 * or WHETHER he moves. This one argues about HOW he moves.
 *
 * ---------------------------------------------------------------------------
 * THE NEW CARD — CHEQUER (`chequer`, testing)
 * ---------------------------------------------------------------------------
 * Instant, free action, exactly one enemy phase at every tier (uses 1/1/2/2/3
 * — quantity only, for Panic's reason: a duration ladder on a card like this
 * is a second sealed enemy phase, the classic gate-breaker). While it is up
 * THE KING MAY NOT SET FOOT ON A SQUARE OF HIS OWN COLOUR. It is one
 * candidate filter, `chequerForbids` in lib/run/pawn-ai.ts, shared by all
 * three of his move modes (the flee, the Gauntlet answer, the Panic step), so
 * the direction is gone however he came to be moving. It never compels a step
 * and never prevents one: walled in with his four orthogonals gone he simply
 * stands, and thrown into a room with one spare orthogonal square it has
 * bought a sidestep and spent a card.
 *
 * THE GEOMETRY IS THE WHOLE DESIGN, and it is exact:
 *
 *   a king's four DIAGONAL neighbours are always HIS OWN colour;
 *   his four ORTHOGONAL neighbours are always THE OTHER ONE.
 *
 * So a chequer does not take half his room at random. It deletes every
 * diagonal step and hands him a flight set that is entirely one colour — and
 * one body of that colour covers all of it at once. That is why the card
 * cannot be a solvent (alone it leaves him four squares) and why its partner
 * is forced. THE MEASUREMENTS BEAR THIS OUT: 0% alone on L7 and L8 at T1 AND
 * at T5, 0% on every mid-run level it is not the key of, and it never breaks
 * a level open by itself anywhere in the run. Whatever else is wrong with
 * this run, the card is not it.
 *
 * ---------------------------------------------------------------------------
 * WHY THE KING IS ALWAYS ON A DARK SQUARE, AND WHY THE PARTNER IS A PAWN
 * ---------------------------------------------------------------------------
 * THE KING STANDS ON A DARK SQUARE ON EVERY LEVEL OF THIS RUN. Therefore his
 * diagonal doors are DARK (only Chequer deletes them) and his orthogonal
 * doors are LIGHT — and a body standing on a LIGHT square covers light
 * squares and can never, ever capture him. Each card is exactly one half of
 * his room and neither half is a kill.
 *
 * The partner started as BISHOP SQUIRE, which is the prettiest fit in the
 * catalogue: a light-squared bishop at d7 plugs the middle door and shoots
 * c8 and e8 down its two diagonals. It measured 100% ALONE on all ten levels
 * and was replaced by PAGE after a trace (see DEAD ENDS §1). A summoned pawn
 * covers exactly the same two light squares from the same square, cannot
 * capture a king on dark, and — the reason it was chosen — CANNOT CHASE: it
 * moves one square forward and never back, so a failed threat is a spent
 * body, where a bishop just keeps hunting.
 *
 * The tempo works because both halves are FREE ACTIONS: Chequer is an
 * instant, a summon's spawn is a free action, and only Rookie's own move ends
 * the turn. So the combo is ONE TURN and it is a REACTION TO A PRESENT
 * THREAT, the only shape the MCTS bot reliably finds (Glasshouse L7 v1-v3).
 * The order is forced and it is the thing the player has to learn: CAST AND
 * SUMMON FROM THE SQUARE YOU ARE STANDING ON, THEN MOVE ONTO HIS LINE. A
 * summon spawns adjacent to Rookie's PRE-MOVE square, so the square she casts
 * from and the square she threatens from are never the same one, and finding
 * that PAIR OF SQUARES is the puzzle on every finale.
 *
 * ---------------------------------------------------------------------------
 * CONSTANT SIGNATURE — THE INLAY
 * ---------------------------------------------------------------------------
 * Every level draws the same three things and nothing else:
 *
 *  1. THE PANEL — a six-square chamber inlaid into the back rank, c7-e8. His
 *     throne is the DARK middle square of its top row, d8. The chamber is
 *     framed in stone on every side: b7 b8 west, f7 f8 east, d6 the sill.
 *  2. TWO SHAFTS — the c-file and the e-file, one square wide, running from
 *     rank 1 to the two lower corners of the panel (c6 and e6). They are the
 *     only floor between the board's edge and his room.
 *  3. THE SHAFTS NEVER MEET except on rank 1, and from L3 on, ONE OF THEM IS
 *     CAPPED. Crossing from one to the other costs three moves down and back,
 *     which is the run's clock and the reason a wrong probe is fatal.
 *
 * Behind the panel each finale hides a BOLT-HOLE: a dark staircase (f6-g5 on
 * the west-approach levels, b6-a5 on the east-approach ones) that runs out of
 * one of his dark doors into squares NO ROOK LINE ON THIS BOARD CAN EVER
 * REACH. Let him take that door once and the level is over — which is what
 * makes Chequer, the only card that deletes a dark door, worth its slot.
 *
 * Not a band of water (The Moat), not pillars (The Colonnade), not a sealed
 * strongbox (The Vault), not offset bars (The Switchback), not a pawn hedge
 * (The Briar), not a glass box (The Glasshouse), not stacks with shafts cut
 * through solid stone (The Stacks — those shafts open into a gallery, these
 * open into a ROOM), not a walled alley (The Alley), not a lattice of panes
 * (The Lattice), not a doorstep alcove (The Alcove), not a roof (The
 * Hayloft), not a face and a ledge (The Quarry), not a burrow (The Warren),
 * not a ring with a throat (The Cairn). 24-27 empty squares per level, inside
 * the band the Warren lesson asks for.
 *
 * ---------------------------------------------------------------------------
 * KEY / TRAP MAP, by level
 * ---------------------------------------------------------------------------
 *   L1  none    — the panel, for nothing. Still king.
 *   L2  none    — his pawn is pinned by the sill; take it, take him.
 *   L3  CHEQUER — key (0 / 47 / 0 / 0 / 0 at 32 trials: the only card).
 *   L4  PAGE    — key (0 / 0 / 100 / 0 / 0: the only card).
 *   L5  PAGE, magnet partly — 0 / 0 / 97 / 0 / 31.
 *   L6  intended AEGIS — MISSED, bare-winnable at 100% (see DEAD ENDS §3).
 *   L7  PAIR    — the hinge.
 *   L8  PAIR    — the blade.
 *   L9  PAIR    — the wrong corner.
 *   L10 PAIR    — one shot, and a back door.
 *   Chequer is a TRAP on L4-L6; the Page is a TRAP on L3; Magnet and Aegis
 *   are TRAPS on all four finales (0% and 0-6% at 32 trials).
 *
 * ---------------------------------------------------------------------------
 * THE FOUR FINALE LINES — ALL DIFFERENT, AND THE L7 LINE LOSES ON L8/L9/L10
 * ---------------------------------------------------------------------------
 * L7 — THE HINGE. All five doors open, the e-shaft capped at e4, the
 *   staircase f6-g5 out of e7. Ride the c-shaft to c7, cast Chequer, summon
 *   the Page BELOW you on c6 — the one square outside the room that covers
 *   d7 — then slide c7-c8. c8 hers, c7 on her file and chequered, e7
 *   chequered, d7 the Page's. Zero.
 *
 * L8 — THE BLADE. c8, e8 and d7 are stone: NO ROOK LINE REACHES HIM, so the
 *   roles swap and she never threatens him at all. Stand on c6, cast Chequer,
 *   summon the Page on C7 — a DARK square, the only colour that sees d8 — and
 *   the body does the killing. The L7 line is not merely worse here, it is
 *   illegal: a light body covers nothing that exists.
 *
 * L9 — THE WRONG CORNER. c8 is bricked and the c-shaft capped, so the west
 *   corner is not a threatening square any more and the staircase has moved
 *   west with it (b6-a5, out of c7). Ride the e-shaft to e6, step to E7 — a
 *   square that does not attack him — cast Chequer, summon the Page BEHIND
 *   you on e6, slide e7-e8. THE BODY GOES WHERE SHE HAS JUST BEEN.
 *
 * L10 — ONE SHOT. The c-shaft is capped and his pen runs out of c7 through b7
 *   and b6 to a5, three squares no line reaches. Take that door once and the
 *   level is gone. Eight moves, two guards a turn, the far shaft, the Page
 *   back on the hinge: stand on e6, cast Chequer, summon on d7, slide e6-e8.
 *
 * Four squire squares (c6 / c7-dark / e6 / d7), two approach shafts, and one
 * level where she does not move at all.
 *
 * ---------------------------------------------------------------------------
 * MEASURED — 2026-09-08, difficulty=normal, T5 bot, harness clean
 * ---------------------------------------------------------------------------
 * NUMBERS OF RECORD, L7-L10, `--trials=32 --jobs=1`, T1 cards:
 *
 *   L    none  chequer   page   aegis  magnet   chequer+page
 *    7     0%       0%    66%      0%      0%            56%
 *    8     0%       0%   100%      0%      0%            88%
 *    9     0%      72%    41%      0%      6%            47%
 *   10     0%      25%    75%      0%      0%            63%
 *
 * MID-RUN, `--trials=32 --jobs=3`:
 *
 *   L    none  chequer   page   aegis  magnet
 *    1   100%     100%   100%    100%    100%
 *    2   100%     100%   100%    100%    100%
 *    3     0%      47%     0%      0%      0%
 *    4     0%       0%   100%      0%      0%
 *    5     0%       0%    97%      0%     31%
 *    6   100%     100%   100%    100%    100%
 *
 * TIER PROBE, L7-L10, 32 trials, jobs=1, explicit pins:
 *   page:4     50 / 94 / 38 / 66   (no worse than T1 — the Page's ladder is
 *                                   not what breaks this run)
 *   chequer:5   0 /  0 / 69 / 28   (IDENTICAL to T1 within noise: the
 *                                   uses-only ladder is tier-proof, exactly
 *                                   as intended. No `abilityTierCaps` needed
 *                                   for the new card.)
 *
 * FULL RUNS, `runs --runs=40`:
 *   random picks      0/40 full clears  (ladder dies at L3: 28% clear, 23
 *                                        dead-ends; L4 18%)
 *   pool=chequer,page 2/40 full clears  (L3 48%, L4 37%, then 86/100/67/100/
 *                                        50/100 up the finale)
 *
 * VERDICT — THE GATE IS MISSED, on one card and one level:
 *   - no-ability ~0% on all four finales                          PASS
 *   - aegis and magnet <= 8% on all four finales (0-6%)           PASS
 *   - CHEQUER <= 8% on L7 and L8 (0%, at T1 and T5)               PASS
 *   - CHEQUER on L9 (72%) and L10 (25%)                           FAIL
 *   - PAGE alone 41-100%                                          FAIL, hard
 *   - the pair 47-88%, i.e. BELOW its own single on three levels   FAIL
 *   - L6 bare-winnable at 100%                                    FAIL
 * The run is therefore single-key content, not a combo gate, and is filed at
 * `idea`. It is NOT marked `built` and does NOT appear on the playtest page.
 *
 * ---------------------------------------------------------------------------
 * DEAD ENDS
 * ---------------------------------------------------------------------------
 * 1. A SUMMON DROPPED DIAGONALLY BELOW THE KING KILLS HIM THE SAME TURN, and
 *    this is the finding that sank the run. The spawn is a FREE action and
 *    the body-move IS the turn, so summon-then-strike resolves before the
 *    enemy phase — the king never gets his flee. Traced on L8: Page spawned
 *    on c7, `squire-move c7->d8`, `end: won`, four moves, no Chequer. The
 *    same trace on the first build showed Bishop Squire doing it from d8
 *    after a flee, which is why that card read 100% on ALL TEN levels.
 *    CONVERT HAS A DAZE FOR EXACTLY THIS REASON (2026-09-06, Tyler: "some
 *    levels too easy where you can just capture the king on the first move");
 *    THE SUMMON FAMILY DOES NOT. Consequence for any future colour-gated
 *    design: the two squares diagonally BELOW a back-rank king are killing
 *    squares for a pawn and a bishop alike, and Rookie must stand orthogonally
 *    beside him to threaten him with a rook — which always puts one of those
 *    two squares within spawn range. The geometry is unwinnable on the back
 *    rank. THE FIX FOR THE NEXT BUILD: put the king on rank 6 or 7 and stone
 *    his LOWER diagonals, so his dark doors are his UPPER ones — a pawn can
 *    never capture upward-backward, so a body dropped there covers without
 *    ever killing. That is the build this run should have been.
 * 2. THE BOLT-HOLE WORKS, AND IT IS THE PART TO KEEP. Adding an unreachable
 *    dark staircase off one dark door took no-ability from 0/56/0/75 to 0/0/
 *    0/0 and aegis and magnet to 0% across all four finales, because a failed
 *    probe now LOSES THE KING PERMANENTLY instead of resetting. Every clean
 *    column in the table above is that change.
 * 3. TIGHTENING THE CLOCK CANNOT SEPARATE THE PAIR FROM THE BODY when both
 *    lines are the same length. L7's pair and L7's page-alone line are both
 *    four moves; cutting the limit from 10 to 7 moved them together (pair
 *    44%, page 38%) and cutting further just made the level unwinnable. The
 *    clock is a difficulty knob, never a gate knob, whenever the cheat and
 *    the intended line share a move count.
 * 4. L6 WAS NEVER AN AEGIS LEVEL. The intended toll (take his defended pawn
 *    on d7 behind the shield) is bypassed entirely: from c8 she threatens
 *    him, he steps to e7, she slides c8-e8 and the six-square panel has no
 *    safe square left. 100% for every loadout including none, at move limits
 *    from 6 to 11. A six-square room is matable by a lone rook; the mid-run
 *    levels of this run need the bolt-hole too, not just the finales.
 * 5. THE LADDER IS TOO STEEP AT L3. 23 of 40 random runs dead-end there and
 *    only 28% clear, so almost nobody reaches the finale (0/40 full clears
 *    with random picks). L3's chequer line is a four-move exact answer with
 *    no second chance and one shaft; it should be the run's third level, not
 *    its wall. Loosening the limit 8 -> 12 moved it 44% -> 47%: the failure
 *    is the single route, not the clock.
 */

import {
  make,
  pawn,
  knight,
  king,
  X,
  FLEE,
  STILL,
  type LevelBuilder,
  type RunDef,
} from '../../run-kit';
import type { Hazard } from '../../types';

const key = (f: number, r: number) => `${f},${r}`;

/** Rank 1 — the floor, and the only place the two shafts meet. */
const FLOOR: ReadonlyArray<[number, number]> = [
  [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1],
];
/** The c-shaft and the e-shaft: one square wide, rank 2 to rank 6. */
const SHAFTS: ReadonlyArray<[number, number]> = [
  [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],
  [5, 2], [5, 3], [5, 4], [5, 5], [5, 6],
];
/** The panel: the six-square chamber inlaid into the back rank. */
const PANEL: ReadonlyArray<[number, number]> = [
  [3, 7], [4, 7], [5, 7],
  [3, 8], [4, 8], [5, 8],
];

/** His room, as square keys — the default pen. */
const PEN = ['c7', 'd7', 'e7', 'c8', 'd8', 'e8'];

/**
 * Build the inlay. Everything not open is stone. `open` carves extra floor
 * (a pocket for a guard, a ledge, a back door); `close` bricks a square of
 * the default floor (a corner of the panel, a shaft mouth).
 */
function inlay(
  opts: { open?: Array<[number, number]>; close?: Array<[number, number]> } = {},
): Hazard[] {
  const floor = new Set<string>([...FLOOR, ...SHAFTS, ...PANEL].map(([f, r]) => key(f, r)));
  for (const [f, r] of opts.open ?? []) floor.add(key(f, r));
  for (const [f, r] of opts.close ?? []) floor.delete(key(f, r));
  const out: Hazard[] = [];
  for (let f = 1; f <= 8; f++) {
    for (let r = 1; r <= 8; r++) {
      if (floor.has(key(f, r))) continue;
      out.push({ ...X(f, r), fixed: true });
    }
  }
  return out;
}

const LEVELS: LevelBuilder[] = [
  // L1 — THE PANEL. A still king on his throne and nothing else. Ride the
  // c-shaft to c8, step onto d8. The silhouette of the whole run in three
  // moves, for nothing.
  make(1, [king(4, 8)], {
    ...STILL,
    moveLimit: 6,
    hazards: inlay(),
    kingPen: PEN,
  }),
  // L2 — THE SILL. He runs now, and his pawn stands in the middle door. The
  // sill (d6) is stone, so the pawn can never advance and never leaves: it is
  // pinned scenery. Ride the c-shaft to c7, take d7 along the rank — the
  // capture stuns him — and step d7-d8. Winnable with nothing.
  make(2, [pawn(4, 7), king(4, 8)], {
    ...FLEE,
    moveLimit: 8,
    hazards: inlay(),
    kingPen: PEN,
  }),
  // L3 — CHEQUER KEY, and the first BOLT-HOLE. d7 and e8 are bricked, so his
  // room is c8, c7 and e7 — and behind e7 a dark staircase runs out to f6 and
  // g5, squares no rook line on this board can ever reach (the e-shaft is
  // capped at e4). Stand on c8: he is on her rank, c7 is on her file, and the
  // one square left to him is e7, DARK. One cast and he has nowhere. Without
  // it he takes e7, then the staircase, and he is gone for good.
  make(3, [king(4, 8)], {
    ...FLEE,
    moveLimit: 12,
    hazards: inlay({ open: [[6, 6], [7, 5]], close: [[4, 7], [5, 8], [5, 6], [5, 5]] }),
    kingPen: ['c7', 'e7', 'c8', 'd8', 'f6', 'g5'],
  }),
  // L4 — SQUIRE KEY. e7 is bricked and c7 is on her file from c8, so both his
  // DARK doors are already gone and a Chequer is a wasted card. What is left
  // is d7 and e8 — two light squares on ONE diagonal, the diagonal through
  // c6. Stand on c7, summon the squire on c6, slide c7-c8. It covers both and
  // can never touch him. Five moves: a bare rook needs more.
  make(4, [king(4, 8)], {
    ...FLEE,
    moveLimit: 8,
    hazards: inlay({ close: [[5, 7], [5, 8]] }),
    kingPen: ['c7', 'd7', 'c8', 'd8'],
  }),
  // L5 — THE PLUG (magnet KEY). A knight stands in the c-shaft at c4 and a
  // second one, set into the stone at a3, defends it and c2 as well; the
  // e-shaft is bricked at its mouth, so there is no way round. Take the plug
  // and the watcher takes you. Pull it down to c3 — the one square of the
  // shaft the watcher does not cover — and take it for free.
  make(5, [knight(3, 4), knight(1, 3), king(4, 8)], {
    ...FLEE,
    moveLimit: 10,
    hazards: inlay({ open: [[1, 3]], close: [[5, 6]] }),
    kingPen: PEN,
  }),
  // L6 — THE TOLL (aegis KEY). His pawn is back in the middle door and a
  // knight at b6 defends it — and covers c8, so the corner she wants is a
  // grave and the bare-rook line of L2 is dead. Take d7 behind the shield,
  // eat the reply, keep the capture-stun, step onto him.
  make(6, [pawn(4, 7), knight(2, 6), king(4, 8)], {
    ...FLEE,
    moveLimit: 6,
    hazards: inlay({ open: [[2, 6]] }),
    kingPen: PEN,
  }),
  // L7 — THE HINGE. Every door of the panel is open, the e-shaft is capped at
  // e4, and the dark staircase f6-g5 runs out of e7. THE LINE: ride the
  // c-shaft to c7, cast Chequer, summon the squire BELOW you on c6 — the one
  // square outside the room whose diagonal covers d7 AND e8 — then slide
  // c7-c8. c8 hers, c7 on her file, e7 and c7 chequered, d7 and e8 the
  // squire's. Zero. Either card alone hands him e7 and the staircase.
  make(7, [knight(1, 4), king(4, 8)], {
    ...FLEE,
    moveLimit: 9,
    hazards: inlay({ open: [[1, 4], [6, 6], [7, 5]], close: [[5, 6], [5, 5]] }),
    kingPen: ['c7', 'd7', 'e7', 'c8', 'd8', 'e8', 'f6', 'g5'],
  }),
  // L8 — THE BLADE. c8, e8 and d7 are stone and d6 is open, so NO ROOK LINE
  // IN THE GAME REACHES HIM. She cannot be the threat, so she is not: the
  // roles swap. Stand on c6, cast Chequer, summon the squire on C7 — a DARK
  // square, the only colour that can see d8 — and move nowhere that matters.
  // He flees, c7 is under the squire, e7 is chequered, he stands, and next
  // turn THE BODY takes the king. A light squire is worth nothing here; the
  // L7 line is not merely worse, it is illegal. Alone, the squire chases him
  // out onto the staircase and loses him.
  make(8, [knight(1, 4), king(4, 8)], {
    ...FLEE,
    moveLimit: 7,
    hazards: inlay({
      open: [[1, 4], [4, 6], [6, 6], [7, 5]],
      close: [[3, 8], [5, 8], [4, 7], [5, 6], [5, 5]],
    }),
    kingPen: ['c7', 'e7', 'd8', 'd6', 'f6', 'g5'],
  }),
  // L9 — THE WRONG CORNER. c8 is bricked and the c-shaft is capped at c4, so
  // the west corner is not a threatening square any more and the only way in
  // is the e-shaft; the staircase has moved with it, running west out of c7
  // to b6 and a5. Ride to e6, step to E7 — a square that does not attack him
  // — then cast Chequer, summon the squire BEHIND you on e6, and slide
  // e7-e8. The squire covers d7 from below, she covers e7 down her own file,
  // c7 is chequered. THE BODY GOES WHERE SHE HAS JUST BEEN.
  make(9, [knight(7, 4), king(4, 8)], {
    ...FLEE,
    moveLimit: 8,
    hazards: inlay({ open: [[7, 4], [2, 6], [1, 5]], close: [[3, 8], [3, 6], [3, 5]] }),
    kingPen: ['c7', 'd7', 'e7', 'd8', 'e8', 'b6', 'a5'],
  }),
  // L10 — ONE SHOT, AND A BACK DOOR. The c-shaft is capped at c4 and his pen
  // runs out of c7 through b7 and b6 to a5 — three squares no line on this
  // board reaches. A probe is not free: take the c7 door once and the level
  // is over. Six moves, two guards a turn, the far shaft, and the squire back
  // on the hinge. Stand on e6, cast Chequer, summon on d7, slide e6-e8.
  make(10, [knight(1, 4), knight(7, 4), king(4, 8)], {
    ...FLEE,
    moveLimit: 8,
    enemiesPerTurn: 2,
    hazards: inlay({
      open: [[1, 4], [7, 4], [2, 7], [2, 6], [1, 5]],
      close: [[3, 6], [3, 5]],
    }),
    kingPen: ['b7', 'c7', 'd7', 'e7', 'c8', 'd8', 'e8', 'b6', 'a5'],
  }),
];

export const RUN_REVENGE_42: RunDef = {
  id: 'revenge-42',
  name: 'The Inlay',
  blurb:
    'A panel of six squares set into the back rank, and two shafts that never meet. Take away half his compass and cover the rest.',
  allowedAbilities: ['chequer', 'page', 'aegis', 'magnet'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: LEVELS,
};

export default RUN_REVENGE_42;
