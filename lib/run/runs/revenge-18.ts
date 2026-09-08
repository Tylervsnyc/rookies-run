/**
 * revenge-18 — THE GLASSHOUSE. Built 2026-09-05 around the pair
 * freeze-ray + vanguard ("pin-and-parachute"). Kit =
 * freeze-ray / vanguard / poison-dart / magnet (`allowedAbilities` IS the
 * daily kit — daily-kit.ts draws all four).
 *
 * CONSTANT SIGNATURE: he is not behind a wall drawn across the board (that is
 * The Moat) and not in a hall of columns (that is The Colonnade) — he is
 * inside a GLASSHOUSE. Every level draws a BOX of hazards around his corner of
 * the board, and the only question the run ever asks is about SIGHTLINES
 * through it. L1-L6 the box has exactly one square missing — the PANE — and
 * something is looking at it. L7-L10 he bricks the window up, and the only
 * sightline left in the level is HIS: a king in a glass room can see you
 * coming, and he moves.
 *
 * THE ARC
 *   L1-L2  the house, no ability. Walk the window; then learn that the eye
 *          watching it has to die first (it is still on your side of the
 *          glass, so you can just take it).
 *   L3-L5  his room is TWO squares on a DIAGONAL (f7/g8 and mirrors) with the
 *          squares between them glassed, so NO rook square in the world sees
 *          both. Threaten one and he steps to the other. Chasing is not a
 *          plan — FREEZE him and the step never happens. Single-ability
 *          puzzles: freeze is the key on all three.
 *   L6     the hinge. The window g6 has glass above it: you can stand IN the
 *          window and still not pass, and no rook line enters the room at all.
 *          Only a body dropped over the wall reaches him — VANGUARD, alone.
 *   L7-L10 the finale, COMBO-GATED, and it stacks the two lessons:
 *          Lock 1 — the house is sealed. No rook line on the board touches the
 *                   room, so the rook is out of the game and a body must go
 *                   over the glass. freeze / poison / magnet / no-ability all
 *                   read 0%.
 *          Lock 2 — the room is DEEP. The one square that attacks his square is
 *                   never inside Rookie's drop radius, so the knight can never
 *                   be parachuted onto the kill. It lands in a POCKET — a free
 *                   square sealed on all four sides, that no rook can ever
 *                   stand on — and it has to WALK, and that costs a turn, and
 *                   in that turn he steps to his other square. A lone knight
 *                   can never watch both squares of his room, because no
 *                   knight attacks two squares side by side. So a parachute
 *                   alone chases him until the clock runs out: 0%.
 *          The pair is the whole level: FREEZE him where he stands, drop the
 *          knight in the pocket, walk it onto the kill square, take him inside
 *          the pin.
 *
 * ── 2026-09-07 REWORK: L7-L10, four DIFFERENT uses of the same pair ──
 * Tyler played the run and 3-starred it: "the design is really cool but later
 * levels need more difficulty, and ways to solve. I love the combination of
 * abilities, it's just too easy." He was right, and the diagnosis was sharper
 * than "not enough clock": L7-L10 were the SAME line four times. Every finale
 * put the pocket two ranks under the house on an open floor, so on all four
 * levels the answer was "walk to the square facing the room, drop, freeze,
 * hop, take" — 2 body-moves out of a 7-move budget, discovered once on L7 and
 * executed three more times.
 *
 * The lever that fixed it is GEOMETRY, not the clock: WHERE Rookie is allowed
 * to stand when she throws the knight, and WHERE the corridor out of the
 * pocket goes. Two of the four levels got MORE clock, not less (L7 7->9).
 *
 * Each level now asks a different question of the same pair:
 *   L7  THE SILL — the house grows an unbroken stone shelf a4-d4. The pocket
 *       b5 is unchanged and so is the corridor b5->c7, but the square Rookie
 *       wants to stand on (the one facing the room) and the corner beside it
 *       are both stone. The only squares left in range of the pocket are on
 *       the rank BELOW the sill. DEMAND: you cannot throw the knight from
 *       where you want to stand — find the square that can.
 *   L8  THE TWO ARMS — the mid house gets a shelf either side of its pocket
 *       (c4/e4/f4), which also pushes the second kill square e6 out of
 *       Rookie's radius. The pocket d5 now serves TWO corridors that do not
 *       connect: d5->e7 kills him on c8, d5->c7->e6 kills him on d8, and no
 *       knight step crosses between e7 and e6. DEMAND: pin him BEFORE the
 *       knight lands. Land first and he steps into the other arm, and the
 *       knight has to go all the way back through the pocket to follow.
 *   L9  TWO A TURN — the east house, unchanged, and the level that is about
 *       TEMPO rather than shape: two enemies a turn and a knight that is the
 *       one hunter which can follow her onto the launch squares under g5.
 *       DEMAND: the two clear turns the pin-and-walk needs have to be bought.
 *   L10 THE TALL ROOM — a new silhouette. His room is a COLUMN (a7/a8), not a
 *       shelf; the pocket d5 is sealed on all four sides; c7 is the only
 *       square in the world that attacks a8 and NOTHING attacks a7. The
 *       corridor is one-way and there is no second door. DEMAND: he only has
 *       to take one step up for the level to be unwinnable — so the pin has
 *       to be right, first time, with a knight walking at her two a turn.
 *
 * MEASURED after the rework (32 trials/cell, T5 bot, T1 cards, Normal,
 * matrixParallel jobs=4, and taken on the bytes that shipped):
 *    L        none  freezeray   vanguard  poisondar     magnet  |  pair
 *    7          0%         0%         0%         0%         0%  |   78%
 *    8          0%         0%         0%         0%         0%  |   72%
 *    9          0%         0%         0%         0%         0%  |   66%
 *   10          0%         0%         0%         0%         0%  |   72%
 * PAIR MEAN 72.0 (was 87.8: 100/94/66/91). Gate holds — every single card and
 * no-ability read 0% on every finale level, worst single cell 0%.
 *
 * A NOTE ON WHAT THE HARNESS WILL NOT LET YOU BUILD. The obvious escalation —
 * lengthen the knight's WALK from one hop to two — is not reachable inside this
 * vocabulary. Vanguard T1 drops within 2 squares of Rookie, and any interior
 * square on rank 5 is inside that radius from rank 3, so forcing a two-hop
 * entry means sealing the whole approach; every layout that did so also sealed
 * the square Rookie's search anchors on (the one square beside the wall) and
 * the pair fell off a cliff to 0% at EVERY clock, including 12 moves. Measured
 * three times: seal a4-e4 and the level is provable and unfindable. The rule
 * that came out of it: NEVER stone the square Rookie naturally stands on
 * beside the house — narrow the drop radius from the sides instead.
 * ──
 *
 * KIT ROLES (KEY = solves it, TRAP = looks like it does)
 *   freeze-ray  — KEY on L3/L4/L5 (pin the king who is reading your line) and
 *                 half of the key on L7-L10. TRAP on L6: nothing there is
 *                 looking at you and he cannot run anywhere useful; the WALL
 *                 is the problem, and a pin does not open a wall.
 *   vanguard    — KEY on L6 (the first parachute) and half the key on L7-L10;
 *                 a second answer on L3/L4/L5, where a drop can sometimes
 *                 reach his diagonal cell. TRAP on L1-L2 (nothing to solve).
 *   poison-dart — KEY nowhere. The run's sharpest trap: it is the card that
 *                 kills a sightline, which is exactly the right idea two to
 *                 three turns too late, and on the finale killing a guard does
 *                 nothing at all — the thing watching you is the KING, and no
 *                 dart may touch him. 0% on every finale level.
 *   magnet      — KEY nowhere. Dragging a watcher off its post is the obvious
 *                 answer to a sightline, but the pull runs along ROOKIE's own
 *                 rook lines and in this house every one of those lines ends
 *                 in glass; the king (below T5) cannot be pulled at all. 0%
 *                 on L4 and on the whole finale.
 * bishop-step / knight-hop / become-king are absent as universal solvents.
 * boulder is absent for a sharper reason: a stone is a permanent wall, and in
 * a house built out of walls it would either seal his room for free or seal
 * her own line — measured on The Colonnade as an active negative.
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
 * FINALE, numbers of record. `revenge.ts matrix --run=revenge-18 --levels=7,8,9,10
 * --loadouts=<none + kit + pair> --trials=32 --jobs=8`, T1 cards, Normal:
 *    L       none  freezeray     magnet  poisondar   vanguard  |  freeze-ray+vanguard
 *    7         0%         0%         0%         0%         0%  |  100%
 *    8         0%         0%         0%         0%         0%  |  94%
 *    9         0%         0%         0%         0%         0%  |  66%
 *   10         0%         0%         0%         0%         0%  |  91%
 * GATE HOLDS: no card in the kit clears a finale level alone (worst single cell 0%); the pair reads 100/94/66/91.
 * THESE FINALE ROWS ARE SUPERSEDED by the 2026-09-07 rework above — they are the
 * numbers that made Tyler call the run too easy. L1-L6 below are still current.
 * The header below reads 100/88/72/81 for the pair and is CONFIRMED (max drift 10 points,
 * inside 32-trial binomial noise) — but it was taken with the flawed method, so these
 * are the numbers of record.
 * ──
 * MEASURED (Normal, T5 bot, 32 trials/cell, --jobs=1 SERIAL — parallel matrix
 * cells cross-talk when other sims share the machine, so these are the numbers
 * of record; 2026-09-05):
 *   L      none  freeze  vanguard  poison  magnet  |  freeze+vanguard
 *   1-2    100%   100%     100%     100%    100%   |   100%   (teaching)
 *   3       19%   100%      88%      28%     19%   |   100%
 *   4        0%   100%     100%     100%      0%   |   100%
 *   5       59%   100%     100%      84%     66%   |   100%
 *   6        0%     0%     100%       0%      0%   |   100%
 *   7        0%     0%       0%       0%      0%   |   100%
 *   8        0%     0%       0%       0%      0%   |    88%
 *   9        0%     0%       0%       0%      0%   |    72%
 *   10       0%     0%       0%       0%      0%   |    81%
 * Full runs (40 each, serial): 43% clear with RANDOM offer picks, 70% when the
 * player takes freeze-ray + vanguard. That random figure is above The Moat's
 * 25% — the honest reason is that a 4-card kit with offers on L1/L3/L6/L9 means
 * a random picker almost always ends up holding both halves of the pair by L7;
 * the finale gate itself is clean (every single card 0%).
 *
 * A NOTE ON WHY THE FINALE PINS THE KING RATHER THAN A GUARD. The first three
 * builds of L7-L10 put the eye on the window and asked for a pre-emptive
 * freeze — freeze the watcher, THEN step into the square it was covering. The
 * solver proves those levels (W3 forced wins) but the playtest bot never finds
 * them: it will not spend a card on a piece that is not attacking it yet, so
 * the pair measured 0-21% while the geometry was perfect. The bot uses freeze
 * fluently on a fleeing KING (revenge-1: 38% -> 100%). Pinning him is the same
 * idea one level up — it is still "kill the sightline, then arrive" — and it
 * is measurable. Provable-but-unfindable is not shippable.
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

/** The FINISHERS every Revenge offer slate carries (mirrors runs.ts). */
const REVENGE_CORE: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

const NAME = (c: Coord): string => `${'abcdefgh'[c.file - 1]}${c.rank}`;

/** A pane of glass running up file `f`, ranks `r0`-`r1`. */
const GLASS_F = (f: number, r0: number, r1: number): Coord[] => {
  const out: Coord[] = [];
  for (let r = r0; r <= r1; r++) out.push(X(f, r));
  return out;
};

/** A pane of glass running along rank `r`, files `f0`-`f1`. */
const GLASS_R = (r: number, f0: number, f1: number): Coord[] => {
  const out: Coord[] = [];
  for (let f = f0; f <= f1; f++) out.push(X(f, r));
  return out;
};

/** Cut the PANES out of a run of glass — the squares that are missing. */
const PANE = (glass: Coord[], ...panes: string[]): Coord[] =>
  glass.filter((c) => !panes.includes(NAME(c)));


/**
 * The two outer SEALED houses of the finale — the same building read from
 * either side of the board. No pane at all: he bricks the window up, and with
 * it every rook line into the room.
 *
 * EAST (king h8, room g8/h8): wall up the d-file, floor at e5/f5/h5 with the
 * buttress g4 under it, partitions at e7/g6/h6. What is left free inside is
 * e6 f6 g5 f7 g7 h7 e8 f8 — a room a knight can walk and a rook can never
 * enter. The only square that attacks h8 is f7, and f7 is three or more from
 * every square Rookie can stand on, so the knight lands on the stone g5 and
 * has to WALK. WEST is the same house mirrored (king a8, room a8/b8, stone b5,
 * kill square c7).
 */
const EAST_HOUSE: ReadonlyArray<Coord> = [
  X(4, 5), X(4, 6), X(4, 7), X(4, 8),
  X(5, 5), X(6, 5), X(8, 5),
  X(7, 4),
  X(5, 7), X(7, 6), X(8, 6),
];
const WEST_HOUSE: ReadonlyArray<Coord> = [
  X(5, 5), X(5, 6), X(5, 7), X(5, 8),
  X(4, 5), X(3, 5), X(1, 5),
  X(2, 4),
  X(4, 7), X(2, 6), X(1, 6),
];

/**
 * L7's house — the WEST house with the buttress under b5 widened into an
 * unbroken SILL, a4-d4. It changes exactly one thing and that thing is the
 * level: the square Rookie naturally walks to, the one facing the room, is
 * stone, and so is the corner. b5 is still the only pocket a knight can be
 * dropped into, but the only squares left in range of it are on the rank
 * BELOW the sill. You cannot throw the knight from where you want to stand.
 */
const WEST_SILL: ReadonlyArray<Coord> = [
  ...WEST_HOUSE,
  X(1, 4), X(3, 4), X(4, 4),
];

/** MID: the same house built in the middle of the board — king c8, pen c8/d8,
 *  stone d5, kill square e7, and walls on BOTH sides (the a/b files and the
 *  g-file) because in the middle he has two flanks to brick up. */
const MID_HOUSE: ReadonlyArray<Coord> = [
  X(1, 5), X(1, 6), X(1, 7), X(1, 8),
  X(2, 5), X(2, 6), X(2, 7), X(2, 8),
  X(3, 5), X(3, 6),
  X(4, 4), X(4, 6),
  X(5, 5),
  X(6, 5), X(6, 7),
  X(7, 5), X(7, 6), X(7, 7), X(7, 8),
];

/**
 * L8's house — the MID house with a SHELF (c4/e4/f4) laid either side of the
 * pocket d5, so the drop can only be thrown from the rank below and the
 * second kill square e6 falls out of Rookie's radius entirely.
 */
const MID_SHELF: ReadonlyArray<Coord> = [...MID_HOUSE, X(3, 4), X(5, 4), X(6, 4)];

/**
 * L10's house — the same glasshouse built TALL. His room is a COLUMN, a7/a8,
 * not a shelf; the pocket d5 is sealed on all four sides; and the corridor
 * out of it is one-way. d5 -> c7 is the only knight step that enters the
 * house at all, c7 is the only square that attacks a8, and NOTHING in the
 * world attacks a7. If he takes the step up, the level is over.
 */
const TALL_HOUSE: ReadonlyArray<Coord> = [
  X(1, 5), X(2, 5), X(3, 5),
  X(1, 6), X(2, 6), X(3, 6),
  X(3, 4), X(4, 4), X(4, 6), X(4, 7), X(4, 8),
  X(5, 5), X(5, 6), X(5, 7), X(5, 8),
  X(2, 4), X(6, 4),
];

const RUN_REVENGE_18: RunDef = {
  id: 'revenge-18',
  name: 'The Glasshouse',
  blurb: 'One room, one window. Something is watching the window.',
  allowedAbilities: ['freeze-ray', 'vanguard', 'poison-dart', 'magnet'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE,
  offerCoreMin: 2,
  levels: [
    // L1 — THE PANE. Still king h8 in a glasshouse: floor f6-h6, left wall
    // e6-e8. One square of the floor is missing — g6. Walk the g-file, step
    // through the window, take the room. Nothing is watching it yet.
    make(
      1,
      [pawn(7, 4), king(8, 8)],
      {
        ...STILL,
        moveLimit: 8,
        hazards: [...PANE(GLASS_R(6, 6, 8), 'g6'), ...GLASS_F(5, 6, 8)],
      },
    ),
    // L2 — THE FIRST EYE. Still king a8, the house mirrored (floor a6-c6,
    // right wall d6-d8), pane b6. Bishop f2 looks straight up the long
    // diagonal at b6: step into the window and it takes you. It is undefended
    // and still on YOUR side of the glass — take the eye, then walk in. That
    // order is the whole run.
    make(
      2,
      [bishop(6, 2), king(1, 8)],
      {
        ...STILL,
        moveLimit: 9,
        hazards: [...PANE(GLASS_R(6, 1, 3), 'b6'), ...GLASS_F(4, 6, 8)],
      },
    ),
    // L3 — HE MOVES (freeze KEY). First fleeing king, and the first thing this
    // house teaches about him: his room is TWO squares and they sit on a
    // DIAGONAL — f7 and g8 — with f8 and g7 glassed between them. No rook
    // square in the world sees both. Come up the f-file through the window f5
    // and f6 looks straight at f7; he simply steps to g8, and g8 has no line
    // into it at all. Chasing is not a plan. FREEZE him where he stands and
    // the step he was going to take never happens: f6, then take him.
    make(
      3,
      [king(6, 7)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [
          X(4, 6), X(4, 7), X(4, 8),
          X(5, 5), X(5, 6), X(5, 7), X(5, 8),
          X(7, 5), X(8, 5),
          X(6, 8), X(7, 7), X(8, 6),
        ],
        kingPen: ['f7', 'g8'],
      },
    ),
    // L4 — THE OTHER SIDE (freeze KEY, magnet TRAP). The same room mirrored:
    // king c7, his second square b8, window c5. A knight hunts her on the open
    // floor now, so the turn the pin costs is a turn she has to find. Magnet
    // reads 0% here: the only lines she can stand on that reach into the room
    // die in glass, and he cannot be pulled at all. A drop DOES work — c6 sees
    // b8 — which is fine; this is where both keys are still on the table.
    make(
      4,
      [knight(7, 3), king(3, 7)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [
          X(6, 6), X(6, 7), X(6, 8),
          X(5, 5), X(5, 6), X(5, 7), X(5, 8),
          X(3, 5), X(2, 5), X(1, 5),
          X(3, 8), X(2, 7), X(1, 6),
        ],
        kingPen: ['c7', 'b8'],
      },
    ),
    // L5 — THE LONG ROOM (freeze KEY). Same diagonal cell, slid into the
    // middle: king e7, second square f8, window e5 — and this time the h-file
    // is open, so there IS a second line at him (h8 sees f8 across the empty
    // g8). Two lines, and he only ever stands on one of them: walking from one
    // to the other is four moves and he moves for free. A bishop on c2 hunts
    // her while she works it out. The freeze is still the answer; the level is
    // about noticing that the second line is a decoy.
    make(
      5,
      [bishop(3, 2), king(5, 7)],
      {
        ...FLEE,
        moveLimit: 5,
        hazards: [
          X(3, 6), X(3, 7), X(3, 8),
          X(4, 5), X(4, 6), X(4, 7), X(4, 8),
          X(6, 5), X(7, 5),
          X(5, 8), X(6, 7), X(7, 6),
        ],
        kingPen: ['e7', 'f8'],
      },
    ),
    // L6 — THE PARACHUTE (vanguard KEY, freeze TRAP). The pane g6 is still
    // there, but g7 above it is glass too: you can stand IN the window and you
    // still cannot pass. Nothing here is watching you, so a freeze has no
    // target worth spending — the WALL is the problem. The room (f7/f8/g8/h7)
    // cannot be entered by any rook line at all. Drop the knight over the
    // glass onto f7 and let it take him. This is the run's hinge.
    make(
      6,
      [knight(3, 4), pawn(7, 3), king(8, 8)],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: [...PANE(GLASS_R(6, 6, 8), 'g6'), ...GLASS_F(5, 6, 8), X(7, 7)],
        kingPen: ['h8'],
      },
    ),
    // L7 — THE SILL. From here the glasshouse has NO pane at all: the box is
    // sealed, no rook line on the board reaches inside it, so the rook is out
    // of the game and a body has to go over the glass. b5 is the pocket — a
    // square walled on all four sides that no rook can ever stand on — and the
    // corridor out of it is b5->c7, the one square in the world that attacks
    // a8. What this level adds to that is the SILL: the buttress under the
    // house is now an unbroken shelf a4-d4, so the square Rookie wants to
    // stand on (the one facing the room) and the corner beside it are stone.
    // The only squares left within a Vanguard throw of the pocket are on the
    // rank below the sill. DEMAND: you cannot throw the knight from where you
    // want to stand. She gets a LONGER clock than the old build (7 -> 9) and
    // it is still the hardest thing in the run so far — the shape did that,
    // not the timer.
    make(
      7,
      [king(1, 8)],
      { ...FLEE, moveLimit: 9, hazards: [...WEST_SILL], kingPen: ['a8', 'b8'] },
    ),
    // L8 — THE TWO ARMS. The mid house with a shelf laid either side of its
    // pocket (c4/e4/f4), which does two things: it drops the throw down to the
    // rank below again, and it pushes e6 — the square that kills him on d8 —
    // out of Rookie's drop radius entirely. So the pocket d5 now serves TWO
    // corridors that do not connect. d5->e7 takes him on c8; d5->c7->e6 takes
    // him on d8; and no knight step crosses from e7 to e6. DEMAND: pin him
    // BEFORE the knight lands. Land on e7 first and he simply steps to d8, and
    // the knight has to walk all the way back through the pocket to follow him
    // — which is more turns than a Vanguard knight is alive for. A bishop
    // hunts her while she works out which arm she is committing to.
    make(
      8,
      [bishop(8, 2), king(3, 8)],
      { ...FLEE, moveLimit: 7, hazards: [...MID_SHELF], kingPen: ['c8', 'd8'] },
    ),
    // L9 — TWO A TURN. The eastern house, with the shape left alone on
    // purpose: this is the finale level about TEMPO rather than geometry. Two
    // enemies a turn, and the knight is the point — it is the one hunter that
    // can follow her onto the launch squares under g5, so the two clear turns
    // the pin-and-walk needs are turns she has to buy.
    make(
      9,
      [knight(3, 3), king(8, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 7,
        hazards: [...EAST_HOUSE],
        kingPen: ['g8', 'h8'],
      },
    ),
    // L10 — THE TALL ROOM. The glasshouse built as a COLUMN: his room is a7/a8
    // stacked, not two squares side by side, and it is the only silhouette in
    // the run that stands up instead of lying down. The pocket d5 is sealed on
    // all four sides, d5->c7 is the only knight step that enters the house at
    // all, c7 is the only square in the world that attacks a8 — and NOTHING
    // attacks a7. The corridor is one-way and there is no second door: the
    // moment he takes one step up the column, the level is over and no amount
    // of clock brings it back. DEMAND: the pin has to be right the first time,
    // with a knight walking at her two enemies a turn. Everything else — the
    // dart that kills a guard she could have walked around, the magnet with
    // nothing on her lines, the parachute with no pin — watches him take the
    // step.
    make(
      10,
      [knight(7, 4), king(1, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 7,
        hazards: [...TALL_HOUSE],
        kingPen: ['a8', 'a7'],
      },
    ),
  ],
};

export { RUN_REVENGE_18 };
export default RUN_REVENGE_18;
