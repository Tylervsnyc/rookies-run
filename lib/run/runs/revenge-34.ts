/**
 * revenge-34 — THE DOGLEG. Built 2026-09-07 for the signature pair
 * TWIN + REWIND ("insurance on a one-charge body",
 * data/run-playtest/pair-hypotheses.json; the discovery harness found it
 * gating a generated checker level at 67% under the kit [rewind twin page
 * smoke] while each half read 0% alone —
 * data/run-playtest/combo-library/rewind+twin/).
 * Kit = twin / rewind / magnet / poison-dart (`allowedAbilities` IS the kit).
 *
 * THE VERB: SPEND A BODY WHERE NOTHING SURVIVES, THEN TAKE THE KILLING BACK.
 * Not crossing a wall (The Moat), not baiting hunters (The Alley), not a
 * poison timer (The Switchback), not blowing a hole (The Briar), not caging
 * with his own guard (The Alcove), not a double door (The Millstone), not a
 * two-rook net (The Parapet), not buying a body time (The Lattice), not
 * moving the wall (The Quarry). This run is the only one in the catalogue
 * whose answer is an UNDO.
 *
 * WHY THIS PAIR, read out of lib/run/abilities.ts (applyRewind,
 * pushEnemyPhaseSnapshot, summonSpawnSquares) and lib/run/pawn-ai.ts
 * (chooseEnemyAction's capture priority, kingFleeMove):
 *   - TWIN summons a second rook YOU control on one of the EIGHT SQUARES
 *     BESIDE ROOKIE, as a free action. That is the whole trick this run is
 *     built on: a rook line cannot turn a corner, but a summon does not
 *     travel — it is BORN. One charge at T1, four enemy turns of leash.
 *   - REWIND puts the enemy side back to the start of their last turn and
 *     leaves Rookie's side exactly as it is: her square, her captures, her
 *     tempo, her charges. `pushEnemyPhaseSnapshot` takes the board as her
 *     side left it, so an ally the court ATE in that phase comes back alive,
 *     on the square it died on, with her move still in hand. It is the only
 *     card in the game that gives a spent body back.
 *   - Enemies value a summoned rook at major-piece level and CAPTURE BEFORE
 *     THEY APPROACH, so a rook standing where the court can reach it is dead
 *     that phase, every time. Rookie standing there is dead too — and that is
 *     the level. The post is a square only a body you can get back may stand
 *     on.
 *   - The playtest bot only ever considers Rewind when the last enemy turn
 *     HURT — `allyDied || threatened` in scripts/run-playtest/bots/shared.ts.
 *     So every finale line here is built around the body actually dying: a
 *     pre-emptive or delayed use of the card is not findable, which matches
 *     the Glasshouse rule ("design the payoff as a reaction to a present
 *     threat, resolved in one turn").
 *
 * KIT ROLES — KEY / TRAP by level:
 *   twin    KEY on L4 and L6 (the corridor is unguarded there: born, slide,
 *           kill) and half the pair on L7-L10. TRAP on L1-L3 and L5, where
 *           the wall has a gap and Rookie walks in herself — a body is a
 *           slower rook.
 *   rewind  TRAP on L1-L6, every one of them: with nothing of hers inside
 *           the wall there is no enemy reply worth deleting. It is a dead
 *           charge for six levels and the answer on four.
 *   magnet  KEY on L3 (drag the plug out of its pawn's cover and take it on
 *           the floor). TRAP on L4/L6 (no line crosses the wall) and on the
 *           whole finale.
 *   poison  KEY on L5 (the plug is adjacent to Rookie with nowhere to be
 *   -dart   dragged, and defended, so the only answer is a dart that needs no
 *           line). Second answer on L3. TRAP everywhere else: it can kill any
 *           piece on the board and killing a piece has never opened this wall.
 *
 * THE FOUR FINALE LINES ARE FOUR DIFFERENT JOBS FOR THE BODY — the run's
 * answer to "One line, four times" (.claude/run-level-design.md, Tyler
 * 2026-09-06). Same two cards, four different sequences:
 *   L7  DIE ON THE POST. One slide from the nook (h5-h8) puts her on the only
 *       square that attacks him, and the knight on g6 takes her there. Rewind,
 *       slide, done. Seven moves on the clock: the lesson, at speed.
 *   L8  BUY THE POST. The post is OCCUPIED — a bishop knotted into the a8
 *       corner. The L7 slide is illegal; the body's one move has to be a
 *       CAPTURE, and the rewind returns her with the bishop still dead.
 *   L9  WAIT FIRST. The king is one rank down (f7), so the top of the shaft
 *       is not a post any more, it is a WAITING ROOM: the body must turn the
 *       corner, live through an enemy phase at h8 where nothing can reach it,
 *       and only then take f8 and be killed on it. Die one square early and
 *       the rewind hands you a body in a corridor with the card spent.
 *   L10 BOTH, ON THE LONGEST WALK. The waiting room AND the toll, mirrored,
 *       with two bishops on the floor and twelve moves: wait at a8, take c8,
 *       be taken, rewind, kill. Four body-moves against a four-turn leash.
 *
 * ── MEASURED (2026-09-07, Normal, T5 bot, cards at T1 unless a tier is
 * written) ─────────────────────────────────────────────────────────────────
 *
 * FINALE, NUMBERS OF RECORD. `revenge.ts matrix --run=<id>
 * --difficulty=normal --levels=7,8,9,10
 * --loadouts=none,twin,rewind,magnet,poison-dart,twin+rewind --trials=32
 * --jobs=1`:
 *
 *      L    none    twin  rewind  magnet  poison-dart | twin+rewind
 *      7      0%      0%      0%      0%      0%      |    69%
 *      8      0%      0%      0%      0%      0%      |    78%
 *      9      0%      0%      0%      0%      0%      |    63%
 *     10      0%      0%      0%      0%      0%      |    63%
 *
 * GATE MET. No-ability 0% on all four, every single card in the kit 0% on all
 * four (the ceiling is 8%), and the signature pair 63-78% — inside the 60-80%
 * band Tyler asked for after the Lattice and the Alcove, not the 90-100% the
 * earlier combo runs shipped at.
 *
 * EVERY OTHER PAIR IN THE KIT (32 trials, jobs=2) — the pair is the only
 * answer:
 *      L   twin+magnet  twin+poison  rewind+magnet  rewind+poison  magnet+poison
 *      7        0%           9%            0%             0%             0%
 *      8        0%           3%            0%             0%             0%
 *      9        0%           0%            0%             0%             0%
 *     10        0%           6%            0%             0%             0%
 * twin+poison-dart is the only one that scores at all, and only because the
 * dart can kill the executioner outright — it needs to be thrown three enemy
 * turns before the body arrives, which is the pre-emptive play the bot does
 * not find and a human might. 9% is the honest top of it.
 *
 * L1-L6 (16 trials/cell, 24 on L6):
 *      L    none    twin  rewind  magnet  poison   note
 *      1    100%    100%    100%    100%    100%   free — the road
 *      2    100%    100%    100%    100%    100%   free — one plug
 *      3      0%    100%      0%    100%    100%   magnet KEY (poison 2nd)
 *      4      0%    100%      0%      0%      0%   twin KEY, clean
 *      5      0%     75%      0%     75%    100%   poison KEY
 *      6      0%     96%      0%      0%      0%   twin KEY, clean (mirror)
 *
 * TIER SWEEP (finale, one loadout column per invocation, 32 trials):
 *   twin:1   0/0/0/0     twin:2   0/0/0/0
 *   twin:3  75/66/3/3   ← BREAKS on L7 and L8. T3 is the SECOND CHARGE
 *           (maxUses 1/1/2/2/2): the first body trades itself for the
 *           executioner and the second one walks the empty corridor. Exactly
 *           the rule in run-level-design.md — "the break is almost always the
 *           tier that grants a second use".
 *   twin:4  84/75/0/6   twin:5   0/3/0/0 (T5's free ally move re-orders her
 *           turn and the bot stops finding the line at all).
 *   rewind:5 0/0/0/0    magnet:5 0/0/0/0    poison-dart:5 0/0/0/0 — no cap
 *           needed on any of the three. Rewind cannot break this gate at ANY
 *           tier for a structural reason: undo is worth nothing until
 *           something of yours is inside the wall.
 *   → `abilityTierCaps: { twin: 2 }`, the highest tier at which every single
 *     kit card still reads 0%. Note L9 and L10 are gated at EVERY twin tier
 *     (0-6%); the cap is bought by L7 and L8 alone — see DEAD ENDS.
 *
 * FULL RUNS (40 each, Normal, T5, never skipping an offer):
 *   RANDOM offer picks   0/40. The ladder: 100 / 100 / 95 / 47 / 94 / 82 /
 *     50 / 57 / 50 / 0. Two walls, and both are honest. L4 is the twin-ONLY
 *     level sitting one offer after the first slate, so half the random
 *     pickers simply do not hold the card (the Squint hit the same wall at
 *     L3). And the finale is deliberately NOT a formality any more: four
 *     levels at 63-78% multiply to about a fifth of the arrivals, where a
 *     90-100% finale multiplied to nearly all of them. This is the price of
 *     the band Tyler asked for, stated rather than hidden: the 10-25% random
 *     target in the rubric was written when finales read 100%.
 *   POOL PINNED TO THE PAIR  5/40 = 13%, ladder 100 / 100 / 80 / 81 / 62 /
 *     88 / 93 / 77 / 60 / 83. With only twin and rewind on offer the run
 *     leaks in the MIDDLE instead (L5 62% — the poison level, answered the
 *     slow way), and the finale behaves.
 *   picks across the random sweep: poison-dart 37, twin 36, rewind 29,
 *     magnet 26.
 *
 * DEAD ENDS, 2026-09-07:
 *   - A HUNTER THAT CAN ATTACK THE LAUNCH SQUARE COSTS 50 POINTS. The nook is
 *     entered from ONE square (g4 / b4) and that square is a cul-de-sac by
 *     construction — three of its four orthogonal neighbours are the wall. The
 *     body has to be summoned from it and the rewind cast from it, so Rookie
 *     stands there for two enemy phases. With a knight or a same-colour bishop
 *     on the floor the bot simply refuses to go: L7 read 6-25% at every clock
 *     from 5 to 9 and at one or two enemies a turn, and the loss mode was
 *     MOVE-LIMIT with `usedAbility 1/16` — it never even summoned. With NO
 *     floor piece it read 79%. The fix is a rule, not a number: **the floor
 *     hunter must be a bishop of the colour the launch square is not.** g4 is
 *     light, so L7/L9 hunt with dark bishops (c1, c3); b4 is dark, so L8/L10
 *     hunt with light ones (f1, f3, e2). One such bishop reads 75%, two read
 *     33%, and a pawn added to one reads 54%.
 *   - THE EXECUTIONER STANDING ON THE WALL IS A PIECE THE BODY CAN EAT. Every
 *     boundary square of the corridor is, by definition, orthogonally adjacent
 *     to a corridor square — so the knight on g6, which exists to take
 *     whatever stands on the post, was itself takeable from h6. At a 4-turn
 *     leash the detour (h5-h6, h6xg6, back, up, kill) does not fit; at T2's 6
 *     turns it does, and twin ALONE read 59%/53% on L7/L8. Fixed by JAMMING
 *     THE DETOUR RATHER THAN THE CARD: a black pawn on f7 (c7 in the mirror),
 *     itself unreachable on every line and unable to march (the square in
 *     front of it is wall), defends the executioner. Taking the executioner
 *     now costs the body for nothing. twin:2 fell to 0%/0%.
 *   - PUT THE EXECUTIONER IN A POCKET AND THE LEVEL IS TIER-PROOF. L9 and L10
 *     do exactly that — the knights on d7 / e7 are knight-distance from the
 *     post and orthogonally adjacent to NO corridor square, so no body can
 *     ever reach them — and they read 0-6% for twin at every tier including
 *     T4 "stays the rest of the level". The short dogleg cannot do it: the
 *     only two squares in the game that attack h8 are f7 and g6, and both
 *     touch the corridor. That asymmetry is the whole reason this run needs a
 *     cap at all.
 *   - A GAP IN THE WALL MAKES EVERY PLUG-REMOVER A KEY. L9 v1 was "the charge"
 *     — the corner left open, the plug defended from inside, the body sent in
 *     to kill the DEFENDER and die for it so that Rookie could take the plug
 *     herself. It is a lovely line and it does not survive measurement:
 *     magnet 94%, poison-dart 94%, twin 63%, because once the wall has a hole
 *     anything that removes one piece opens a road. Combo gates need the seal
 *     to be absolute; the gap belongs in L1-L5, where it is the tutorial.
 *   - THE KING'S PEN IS ALSO A NO-MARCH ZONE. `chooseEnemyAction` refuses a
 *     pawn push into `kingPen` (the `intoPen` guard). L3 and L5 need the pawn
 *     on h6 to hold its post as the plug's defender for the whole level, and
 *     h5 in the pen does it — no stone, no second defender, and the king
 *     still cannot use the square because it is not adjacent to him.
 *   - LONGER CLOCKS MADE THE FINALE HARDER, NOT EASIER. L7 read 19% at
 *     moveLimit 7 and 6% at 9 (two floor hunters); with the hunters fixed it
 *     reads 69% at 7 and 75-84% at 8. More moves is more enemy phases beside
 *     a cul-de-sac, and a deeper horizon for a search that is already
 *     struggling to see past the summon. Tune this run's clock DOWN.
 */

import {
  make,
  pawn,
  knight,
  bishop,
  queen,
  king,
  X,
  FLEE,
  STILL,
  type RunDef,
} from '../run-kit';
import type { Coord } from '../types';

/** The FINISHERS every Revenge offer slate carries (mirrors runs.ts). */
const REVENGE_CORE_34: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

/**
 * THE NE DOGLEG — the sealed corridor and its wall.
 *
 *   rank 8   #e8   KING(f8)  g8    h8
 *   rank 7   #e7   #f7       #g7   h7
 *   rank 6         #f6       KNIGHT(g6)  h6
 *   rank 5   #e5             #g5   h5 = THE NOOK
 *   rank 4         #f4             #h4
 *
 * ZONE  = { h5 h6 h7 h8 g8 f8 } — an L: up the h-file, then west on rank 8.
 * WALL  = every orthogonal boundary square of the zone is stone (h4 g5 g7 f7
 *         e8) or the knight (g6). So NO rook, bishop or queen ray in the game
 *         enters the zone, no pawn walks in, and Rookie can never stand in it.
 * NOOK  = h5. Its only free neighbour outside the zone is DIAGONAL — g4, the
 *         outside corner of the dogleg. A line cannot turn that corner. A
 *         BODY BORN THERE IS ALREADY INSIDE.
 * The extra stones (f6 e7 e5 f4) are the buttress: f6 puts rank 6 out of
 * reach so the knight on g6 can never be taken, and e5/e7/f4 are the three
 * knight-squares the knight would otherwise hop to when Rookie comes near.
 * Jammed, its ONLY legal move is a capture on h8 — the post.
 */
const NE_WALL: ReadonlyArray<Coord> = [
  X(8, 4), // h4  — floor under the nook
  X(7, 5), // g5  — west of the nook
  X(7, 7), // g7  — west of the corridor
  X(6, 7), // f7  — under the king
  X(5, 8), // e8  — west of the king
  X(6, 6), // f6  — rank 6 sealed west of the knight
  X(5, 7), // e7  — knight jam
  X(5, 5), // e5  — knight jam
  X(6, 4), // f4  — knight jam, and rank 4 sealed west of the launch square
];

/**
 * THE LONG DOGLEG (L9) — the same corridor with the king one rank DOWN, at
 * f7, so that h8 no longer sees him:
 *
 *   rank 8   #e8   f8=THE POST  g8   h8
 *   rank 7   #e7   KING(f7)     #g7  h7
 *   rank 6   #e6   #f6          #g6  h6
 *   rank 5   #e5                #g5  h5 = THE NOOK
 *
 * ZONE = { h5 h6 h7 h8 g8 f8 f7 }. Two bends, so the body has to turn the
 * corner: h5-h8 is not a post any more, it is a WAITING ROOM, and the post is
 * f8, one rank-8 slide further on. The executioner moves with it — the knight
 * is on d7, which attacks f8 and NOTHING else on the board (c5 b6 b8 are
 * stone, f6/e5 are stone, and c7/d6/d8/e7 put it out of reach of every line).
 * The waiting room is safe; only the post kills.
 */
const NE_LONG_WALL: ReadonlyArray<Coord> = [
  X(8, 4), // h4
  X(7, 5), // g5
  X(7, 6), // g6
  X(7, 7), // g7
  X(6, 6), // f6
  X(6, 4), // f4
  X(5, 5), // e5
  X(5, 6), // e6
  X(5, 7), // e7
  X(5, 8), // e8
  X(4, 6), // d6  — the knight's pocket
  X(4, 8), // d8
  X(3, 5), // c5  — the knight's jam
  X(3, 7), // c7
  X(2, 6), // b6
  X(2, 8), // b8
];

/** The long dogleg mirrored onto the a-file (file f -> 9-f). */
const NW_LONG_WALL: ReadonlyArray<Coord> = [
  X(1, 4), // a4
  X(2, 5), // b5
  X(2, 6), // b6
  X(2, 7), // b7
  X(3, 6), // c6
  X(3, 4), // c4
  X(4, 5), // d5
  X(4, 6), // d6
  X(4, 7), // d7
  X(4, 8), // d8
  X(5, 6), // e6  — the knight's pocket
  X(5, 8), // e8
  X(6, 5), // f5  — the knight's jam
  X(6, 7), // f7
  X(7, 6), // g6
  X(7, 8), // g8
];

/** The same dogleg mirrored onto the a-file (file f -> 9-f). */
const NW_WALL: ReadonlyArray<Coord> = [
  X(1, 4), // a4
  X(2, 5), // b5
  X(2, 7), // b7
  X(3, 7), // c7
  X(4, 8), // d8
  X(3, 6), // c6
  X(4, 7), // d7
  X(4, 5), // d5
  X(3, 4), // c4
];

const RUN_REVENGE_34: RunDef = {
  id: 'revenge-34',
  name: 'The Dogleg',
  blurb: 'A line cannot turn that corner. A body born there is already inside.',
  allowedAbilities: ['twin', 'rewind', 'magnet', 'poison-dart'],
  abilityTierCaps: { twin: 2 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_34,
  offerCoreMin: 2,
  levels: [
    // L1 — THE OPEN BEND. The dogleg with its corner stone missing (g5 open),
    // so the corridor is simply a road: up the g-file, right onto rank 5, up
    // the h-file, west along rank 8. Still king, nothing in the way. The
    // silhouette, for nothing.
    make(
      1,
      [king(6, 8), pawn(3, 3)],
      {
        ...STILL,
        moveLimit: 11,
        hazards: NE_WALL.filter((h) => !(h.file === 7 && h.rank === 5)),
        kingPen: ['f8'],
      },
    ),
    // L2 — THE PLUG. Same road, one pawn standing in the corner square. Take
    // it and walk on. A knight wanders the floor while you do.
    make(
      2,
      [king(6, 8), pawn(7, 5), knight(4, 3)],
      {
        ...STILL,
        moveLimit: 12,
        hazards: NE_WALL.filter((h) => !(h.file === 7 && h.rank === 5)),
        kingPen: ['f8'],
      },
    ),
    // L3 — THE DEFENDED CORNER (magnet KEY). The corner is plugged by a bishop
    // and the pawn on h6 defends it: take the plug and the pawn takes you
    // back. The pawn cannot march off the job — h5 is written into his pen, so
    // no pawn will ever step there. Stand on the g-file, drag the bishop down
    // out of the pawn's cover, take it on the floor, then walk the dogleg
    // (the pawn on h6 is in the corridor; take it on the way past).
    make(
      3,
      [king(6, 8), bishop(7, 5), pawn(8, 6), knight(3, 3)],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: NE_WALL.filter((h) => !(h.file === 7 && h.rank === 5)),
        kingPen: ['f8', 'h5'],
      },
    ),
    // L4 — THE NOOK (twin KEY, and the lesson of the run). The wall is whole:
    // no gap, no ray, nothing walks in. But g4 touches h5 on the DIAGONAL, and
    // a summon is born, not walked. Nothing guards the corridor here, so the
    // Twin does it alone: born on h5, up the h-file to h8, west along rank 8
    // onto him.
    make(
      4,
      [king(6, 8), knight(4, 4)],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: [...NE_WALL],
        kingPen: ['f8'],
      },
    ),
    // L5 — THE FAR PLUG (poison-dart KEY). The corner is open again but the
    // plug is a bishop the magnet cannot pull (rank 4 is stone west of g4 and
    // g5 is adjacent — there is nowhere to drag it to) and cannot be traded
    // for (the pawn on h6 recaptures). The dart needs no line: kill the plug
    // where it stands and the road is a road again.
    make(
      5,
      [king(6, 8), bishop(7, 5), pawn(8, 6), knight(4, 2), bishop(3, 2)],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: NE_WALL.filter((h) => !(h.file === 7 && h.rank === 5)),
        kingPen: ['f8', 'h5'],
      },
    ),
    // L6 — THE MIRRORED NOOK (twin KEY, hurried). The dogleg on the a-file,
    // the wall whole, two enemies a turn and a knight already on the floor.
    // Same answer as L4 in a mirror, with no room to wander.
    make(
      6,
      [king(3, 8), bishop(5, 2)],
      {
        ...FLEE,
        enemiesPerTurn: 1,
        moveLimit: 10,
        hazards: [...NW_WALL],
        kingPen: ['c8'],
      },
    ),
    // L7 — THE MARTYR (finale, teaching). The wall is whole and the knight on
    // g6 is awake: jammed on every square but one, it exists to take whatever
    // stands on h8 — the post, the only square in the game that attacks him.
    // A rook standing there dies. So send the one rook you can get back:
    // born on h5, slide to h8, let the knight have her, REWIND — the knight
    // walks backwards off the post and she is standing on it again with your
    // move still in hand — and slide h8-f8. The pawn on f7 replaces that
    // stone of the wall and does the same job (rank 7 is walled either side
    // of it, f6 is stone so it can never march, and no line reaches it), with
    // one addition: it DEFENDS the knight, so eating the executioner from h6
    // costs the body and buys nothing. Seven moves — the lesson, at speed.
    make(
      7,
      [king(6, 8), knight(7, 6), pawn(6, 7), bishop(3, 1)],
      {
        ...FLEE,
        enemiesPerTurn: 1,
        moveLimit: 7,
        hazards: NE_WALL.filter((h) => !(h.file === 6 && h.rank === 7)),
        kingPen: ['f8'],
      },
    ),
    // L8 — THE TOLL (mirror). The post is not empty: a bishop stands on a8,
    // knotted into the corner (its only diagonal is the wall stone on b7), so
    // it never moves and nothing on the board can reach it but a body in the
    // corridor. The L7 slide does not exist here — the Twin's ONE move has to
    // be a CAPTURE, and it is the capture that puts her on the post. Then the
    // knight on b6 takes her back, and the rewind returns the body with the
    // bishop still dead. The pawn on c7 is the mirror of L7's f7: it fills
    // that square of the wall and defends the executioner.
    make(
      8,
      [king(3, 8), bishop(1, 8), knight(2, 6), pawn(3, 7), bishop(6, 1)],
      {
        ...FLEE,
        enemiesPerTurn: 1,
        moveLimit: 10,
        hazards: NW_WALL.filter((h) => !(h.file === 3 && h.rank === 7)),
        kingPen: ['c8'],
      },
    ),
    // L9 — THE WAITING ROOM. Same corridor, king one rank down on f7, so the
    // top of the h-file no longer sees him: h8 is not a post any more, it is
    // somewhere to WAIT. The post is f8, one slide further west, and the
    // knight pocketed on d7 covers f8 and nothing else. So the L7 line does
    // not exist here — the body has to turn the corner, live through an enemy
    // phase in the waiting room, and only THEN take the post and be killed on
    // it. Die one square early and the rewind hands you a body in a corridor
    // with the card spent.
    make(
      9,
      [king(6, 7), knight(4, 7), bishop(3, 3)],
      {
        ...FLEE,
        enemiesPerTurn: 1,
        moveLimit: 11,
        hazards: [...NE_LONG_WALL],
        kingPen: ['f7'],
      },
    ),
    // L10 — THE LAST BEND. Everything the run has taught, in the mirror and
    // on the shortest clock: the long corridor of L9 (the body must wait at
    // a8 before it can turn the corner) AND the toll of L8 (the post c8 is
    // held by a bishop knotted into the corner, so the move that reaches the
    // post has to be a CAPTURE), with the knight pocketed on e7 waiting to
    // take back whatever stands there and two light bishops loose on the
    // floor behind you (b4 is a dark square, so neither can ever touch the
    // launch). Four body-moves against a four-turn leash.
    make(
      10,
      [king(3, 7), bishop(3, 8), knight(5, 7), bishop(6, 3), bishop(5, 2)],
      {
        ...FLEE,
        enemiesPerTurn: 1,
        moveLimit: 12,
        hazards: [...NW_LONG_WALL],
        kingPen: ['c7'],
      },
    ),
  ],
};

export default RUN_REVENGE_34;
export { RUN_REVENGE_34 };
