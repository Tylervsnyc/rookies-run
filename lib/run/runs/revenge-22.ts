/**
 * revenge-22 — THE MILLSTONE. Built 2026-09-05 around the pair
 * DRAGON + DUCHESS. Nobody predicted it: the discovery harness found it
 * gating The Moat L6 at 73% (data/run-playtest/combo-library/dragon+duchess/)
 * under a kit where neither summon read above 0% alone, and
 * pair-hypotheses.json lists "any two summons" as an anti-pair because only
 * one body moves per turn. This run is a deliberate test of that claim.
 *
 * WHAT THE MOAT ACTUALLY SHOWED (traced, not guessed). The 73% was two
 * things: a 2x2 corner pen that ONE queen locks from g7 (a single-body lock
 * the singles bot simply did not find), plus a coin-flip DECOY — enemies
 * capture allies at Rookie's own value, one action a turn, so with two
 * queen-tier bodies on the board the knight ate the Duchess and the Dragon
 * finished. Neither is "two summons cover the king together".
 *
 * ── 2026-09-23 REWORK — Tyler: "same pattern 4 levels in a row" ────────────
 * Played live as the daily: "it wasn't that fun b/c it's the same thing for
 * like 4 levels in a row. same pattern that can't happen it kills the
 * creativity and fun. levels need to change patterns so it's not the same move
 * over and over." Confirmed: L7-L10 were all THE DOUBLE DOOR (Duchess takes
 * the door pawn, the watcher recaptures, Dragon takes the re-plug, takes the
 * king — line signature `duchess@far>dragon@far | cap:ally/step` on every
 * finale level; L8 and L10 were the same WEST_LOCK board, L7 its mirror), and
 * L3/L4 shared the e7 door + defended plug, with L4's key (Aegis) no longer
 * in the kit. L1, L2, L3, L5, L6, the kit and the offers are untouched; L4 and
 * L7-L10 are new, each built around a DIFFERENT move, and no finale level has
 * two enemy pieces guarding one square any more — that is the shape that
 * turns into a trade chain (the double door) whatever the board looks like.
 *
 * CONSTANT SIGNATURE — THE MILLSTONE. Every level the king lives on a wheel of
 * ring squares around one stone pillar, with the corners of that 3x3 bricked
 * (or, on L4, filled with his own men) and the orthogonal approaches walled,
 * so a rook line almost never reaches him. Boards L4 and L7-L10 are DRAWN in
 * the source (`drawn`): '#' stone, ',' his pen, letters his pieces.
 *
 * KIT = dragon / duchess / magnet (`allowedAbilities` IS the kit; all three
 * are always offered). NO abilityTierCaps.
 *
 * ── ONE MOVE PER LEVEL (L3-L10), and its line signature ────────────────────
 *   L3  CAPTURE ORDER (no card) — take the bishop, then the plug, then him.
 *       `no-cast | cap:rook/step`
 *   L4  THE CORK (magnet) — core d7, STILL king d6. A knight corks his door
 *       d5, defended by two knights sealed in the stone (b6, f6) and the pawn
 *       tooth c6 (itself covered by b7). Taking it is death. Stand on the
 *       d-file (c1/d1/e1 start), PULL it down to d3/d4 where nothing sees it,
 *       take it, take him. Three defenders, so two summons cannot trade their
 *       way through. `magnet@adj | cap:rook/orth`
 *   L5  THE LINE (a body) — summon beside you on the long diagonal, one slide.
 *       `duchess@diag | cap:ally/diag`
 *   L6  THE THIRD SQUARE (dragon) — jump onto the middle of a broken wheel.
 *       `dragon@near | cap:ally/L`
 *   L7  THE CORKED WINDOW (magnet + a summon) — king g6 (pen g6/f7), the only
 *       line in is the diagonal b1-g6, corked by a knight on d3 that TWO
 *       sealed knights (e5, f4) defend, so a summon that takes it is eaten
 *       and a second body is eaten too. From b3 (or a3/d-file), Magnet yanks
 *       the cork one square off the diagonal to c3; drop a queen on c2 (or on
 *       b1 earlier) and she slides c2-d3-e4-f5 onto him, the same turn. A
 *       threat that does not kill sends him to f7, which nothing reaches.
 *       Pawn a4 marches into the lane, knight b5 hunts a3/c3; two act a turn.
 *       `duchess@diag>magnet@diag | cap:ally/diag`
 *   L8  THE LONG SHOT (dragon + duchess, either order) — west wheel, king c7,
 *       flight square b6. The only line into c7 is the long diagonal
 *       g3-f4-e5-d6, and the only square beside it Rookie can stand on is f2,
 *       which the pinned pawn e3 watches. Body one goes to f2 and is eaten
 *       (or eats e3); Rookie takes whatever stands on f2; body two drops on g3
 *       and shoots the whole diagonal. Knight squares of c7 are all stone —
 *       the Dragon's jump is worth nothing here. Two knights hunt the west.
 *       `dragon@far>duchess@diag | cap:ally/diag`
 *   L9  THE LEAP (duchess clears, dragon jumps) — king g6, flight square f7
 *       (the corner knight h6 eats anything that stands there). Stone on
 *       every line into g6: only a knight jump from f4 reaches him, and f4 is
 *       a spawn square only from the post f3. The bishop on h1 watches f3
 *       down h1-g2-f3. Spend the Duchess on the bishop (take it, stand in its
 *       line, or let it take her off its line), step onto f3, drop the Dragon
 *       on f4, jump. The Duchess cannot jump: alone she is a trap.
 *       `duchess@far>dragon@near | cap:ally/L`
 *  L10  THE FLUSH (dragon scares, duchess shoots) — west wheel, king b6, pen
 *       b6/c7/c5. Nothing ever attacks b6 except a knight on c4 (or a4); the
 *       only line anywhere near him runs g3-f4-e5-d6 onto c7. So: walk
 *       h1-h3-f3, drop the Dragon on e3 and jump to c4 — he runs from b6 to
 *       c7 (c5 is covered by the Dragon) — then drop the Duchess on g3 and
 *       shoot c7. The first body never attacks the square it wins on; it
 *       DRIVES him onto the second body's line. c5 is the anti-cheese: a body
 *       that just parks on c7 sends him to c5 and he is gone. A knight in the
 *       h5 pocket jumps at the route; two enemies act a turn.
 *       `dragon@diag>duchess@far | cap:ally/diag`
 *   Eight different signatures, and different to a human: capture order /
 *   pull / one slide / one jump / pull-then-slide / feed-the-sniper-then-
 *   long-slide / clear-then-jump / scare-into-the-line.
 *   MAGNET is L4's key and half of L7; on L8-L10 it has nothing on her line
 *   worth pulling (0% alone and 0% with either summon).
 *
 * ── MEASURED — 2026-09-23, Normal, T5 bot, `revenge.ts matrix`, 32 trials,
 *    --jobs=2, cards at T1 (L7 re-read after its last tune) ──────────────────
 *   L    none  dragon  duchess  magnet | dra+duch  mag+duch  mag+dra
 *   4      0%     0%      0%     100%  |     0%      100%      100%
 *   7      0%     0%      0%       0%  |     0%      100%      100%
 *   8      0%     0%      0%       0%  |    78%        0%        0%
 *   9      0%     0%      0%       0%  |    72%        0%        0%
 *  10      0%     0%      0%       0%  |    84%        0%        0%
 *   Signatures (most common winning line, intended loadout, 16-32 trials):
 *   L3 no-cast|rook/step  L4 magnet@adj|rook/orth  L5 duchess@diag|ally/diag
 *   L6 dragon@near|ally/L  L7 duchess@diag>magnet@diag|ally/diag
 *   L8 dragon@far>duchess@diag|ally/diag  L9 duchess@far>dragon@near|ally/L
 *   L10 dragon@diag>duchess@far|ally/diag — no two equal.
 *   T5 SINGLES, 32 trials:  L7 0/0/0   L8 dragon 97% duchess 97% magnet 0%
 *                           L9 dragon 59% duchess 0% magnet 0%   L10 0/0/0
 *
 * ── HONEST NOTES ───────────────────────────────────────────────────────────
 *   - L7 reads 100% for its pair at every clock from 2 to 7 and with every
 *     hunter tried; the bot finds pull+drop+slide instantly once it is the
 *     only line. It is above the 55-85 band — the teaching finale. Hunters
 *     that stopped it (a5, c5 knights) either confused the bot's route or
 *     created a decoy line for the wrong pair; they were taken out.
 *   - T5 LEAKS (not capped, per the v2 rule; not fixed): L8 at T5 either
 *     summon has two charges, so charge one is fed to the e3 pawn and charge
 *     two shoots — the pair line with one card. L9 at T4+ the Dragon's
 *     captures stun two turns, so it takes the bishop and walks f3-f4-g6
 *     while he is frozen. Both are "sequential" lines (body one is spent
 *     before body two is needed). L10 (the Dragon must still be on c4 when
 *     the Duchess shoots) and L7 are simultaneous and hold at T5.
 *   - Piece counts are under the v2 targets on L9 (2) and L10 (1): every
 *     hunter added there either became a second key, blocked the only spawn
 *     squares, or lured the bot off the one post (it is drawn to whichever
 *     reachable square is nearest the king). L4 5, L7 5, L8 3.
 *   - L2 and L3 (unchanged) share the signature `no-cast | cap:rook/step`.
 *   - Every enemy is capturable on some line EXCEPT the sealed defenders on
 *     L4 (b6/f6 knights, b7 pawn), L7 (e5/f4 knights) and L9's h6 knight:
 *     they are the wheel's teeth, and a tooth you can take is a skeleton key.
 *
 * Test a level in the app: /?run=revenge-22&level=N&go=1&testkit=dragon,duchess,magnet
 * (offer pool only) or &loadout=magnet:1,duchess:1 to start holding cards.
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

const FILES = 'abcdefgh';
const nameOf = (f: number, r: number): string => `${FILES[f - 1]}${r}`;
const inBounds = (f: number, r: number): boolean => f >= 1 && f <= 8 && r >= 1 && r <= 8;

/**
 * The millstone at (f, r): the core pillar, the four bricked corners of its
 * 3x3, and the four walls two squares out orthogonally (the squares from
 * which a rook could look straight at a ring square). `doors` names stones
 * to leave out; `plus` adds stones (bricked windows, sealed jump squares,
 * a bricked ring square).
 */
function MILL(
  f: number,
  r: number,
  opts: { doors?: string[]; plus?: Coord[] } = {},
): Coord[] {
  const doors = new Set(opts.doors ?? []);
  const raw: Array<[number, number]> = [
    [f, r],
    [f - 1, r - 1], [f + 1, r - 1], [f - 1, r + 1], [f + 1, r + 1],
    [f - 2, r], [f + 2, r], [f, r - 2], [f, r + 2],
  ];
  const out: Coord[] = [];
  for (const [ff, rr] of raw) {
    if (!inBounds(ff, rr)) continue;
    if (doors.has(nameOf(ff, rr))) continue;
    out.push({ file: ff, rank: rr });
  }
  for (const c of opts.plus ?? []) {
    if (!inBounds(c.file, c.rank)) continue;
    if (!out.some((o) => o.file === c.file && o.rank === c.rank)) out.push({ ...c });
  }
  return out;
}

/** The ring: the four squares around the core, as pen names. */
function RING(f: number, r: number, minus: string[] = []): string[] {
  const out: string[] = [];
  for (const [ff, rr] of [[f, r - 1], [f - 1, r], [f + 1, r], [f, r + 1]] as const) {
    if (!inBounds(ff, rr)) continue;
    const n = nameOf(ff, rr);
    if (minus.includes(n)) continue;
    out.push(n);
  }
  return out;
}


/**
 * A board DRAWN in the source (the 2026-09-23 rework levels), rank 8 first:
 *   '#' stone   '.' open   ',' his pen (open)   'K' the king (pen)
 *   'p' 'n' 'b' 'q' his pieces.
 */
function drawn(
  level: number,
  rows: string[],
  opts: { moveLimit: number; flee: boolean; enemiesPerTurn?: number },
) {
  if (rows.length !== 8) throw new Error(`revenge-22 L${level}: 8 rows`);
  const pieces: ReturnType<typeof pawn>[] = [];
  const hazards: Coord[] = [];
  const pen: string[] = [];
  rows.forEach((row, i) => {
    const cells = row.replace(/ /g, '');
    if (cells.length !== 8) throw new Error(`revenge-22 L${level}: row ${8 - i} is not 8 wide`);
    const r = 8 - i;
    [...cells].forEach((ch, j) => {
      const f = j + 1;
      if (ch === '#') hazards.push(X(f, r));
      else if (ch === ',') pen.push(nameOf(f, r));
      else if (ch === 'K') { pen.push(nameOf(f, r)); pieces.push(king(f, r)); }
      else if (ch === 'p') pieces.push(pawn(f, r));
      else if (ch === 'n') pieces.push(knight(f, r));
      else if (ch === 'b') pieces.push(bishop(f, r));
      else if (ch === 'q') pieces.push(queen(f, r));
      else if (ch !== '.') throw new Error(`revenge-22 L${level}: bad cell '${ch}'`);
    });
  });
  return make(level, pieces, {
    ...(opts.flee ? FLEE : STILL),
    moveLimit: opts.moveLimit,
    ...(opts.enemiesPerTurn ? { enemiesPerTurn: opts.enemiesPerTurn } : {}),
    hazards,
    kingPen: pen,
  });
}

/** The FINISHERS every Revenge offer slate carries (mirrors runs.ts). */
const REVENGE_CORE_22: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

const RUN_REVENGE_22: RunDef = {
  id: 'revenge-22',
  signaturePair: ['dragon', 'duchess'],
  name: 'The Millstone',
  blurb: 'He walks in circles around a stone. Give him nowhere to step.',
  allowedAbilities: ['dragon', 'duchess', 'magnet'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_22,
  offerCoreMin: 2,
  levels: [
    // L1 — THE DOOR. The east wheel (core g7). Still king on g6, and the
    // wall below him (g5) is missing: the g-file is a door. A pawn on g4 is
    // a free key on the way up. Ride the file, take the pawn, take him.
    make(
      1,
      [pawn(7, 4), pawn(2, 3), king(7, 6)],
      {
        ...STILL,
        moveLimit: 6,
        hazards: MILL(7, 7, { doors: ['g5'] }),
        kingPen: RING(7, 7),
      },
    ),
    // L2 — THE PAWN IN THE DOOR (reworked 2026-09-15 — Tyler: "L1-2 same
    // thing: summon the duchess, win"). The west wheel, and now he RUNS: his
    // ring is b6/a7/c7/b8. His own pawn stands in the door d7, jammed by the
    // stone under it. Come along rank 7 behind it and take it: the capture
    // stuns him, and from d7 the rook is already looking at c7. No card.
    make(
      2,
      [knight(5, 4), pawn(8, 5), pawn(4, 7), king(3, 7)],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: MILL(2, 7, { doors: ['d7'], plus: [X(4, 6)] }),
        kingPen: RING(2, 7),
      },
    ),
    // L3 — THE PLUG. East wheel, still king f7, the side door e7 open and a
    // pawn standing in it, pinned there by stone under it (e6). It is
    // defended by a bishop on d8 that cannot move (c7 is stone, e7 is its
    // own pawn) — but the d-file runs straight up to it. Take the bishop
    // FIRST, then the pawn, then him. Take the pawn first and the bishop
    // takes you. Capture order is the whole level.
    make(
      3,
      [bishop(4, 8), pawn(5, 7), knight(8, 3), king(6, 7)],
      {
        ...STILL,
        moveLimit: 7,
        hazards: MILL(7, 7, { doors: ['e7'], plus: [X(5, 6), X(3, 7)] }),
        kingPen: RING(7, 7),
      },
    ),
    // L4 — THE CORK (magnet KEY). NEW 2026-09-23. DECISION: move the plug,
    // don't take it. Knight d5 corks his door; b6/f6 knights and the c6 tooth
    // defend it (b7 covers the tooth). Pull it down the d-file, take it where
    // nothing sees it, walk in. Summons alone: 0% (three defenders).
    drawn(4, [
      '# # # , # # # #',
      '# p , # , # # #',
      '# n p K # n # #',
      '# # # n # # # #',
      '# # # . # # # #',
      '# # # . # # # #',
      '# # # . # # # #',
      '# # . . . # # #',
    ], { moveLimit: 4, flee: false }),
    // L5 — THE LINE (a body's KEY). Still king on h7, the DEEP square of
    // the east wheel: no jump lands on it and no rook line touches it. Both
    // doors are shut. What is open is one window, f5, and through it the
    // long diagonal b1-h7 runs from Rookie's own back rank across g6 onto
    // his square. A rook cannot look down a diagonal. A queen can: summon
    // her beside you on that line and she takes him in one slide. (The
    // Dragon does the same — she is a queen too.) Windows e6/h5 bricked so
    // the other lines do not compete.
    make(
      5,
      [knight(4, 4), pawn(1, 3), king(8, 7)],
      {
        ...STILL,
        moveLimit: 6,
        hazards: MILL(7, 7, { plus: [X(5, 6), X(8, 5)] }),
        kingPen: RING(7, 7),
      },
    ),
    // L6 — THE THIRD SQUARE (dragon KEY). He runs now. And the ring is
    // BROKEN: h7 is stone, so his wheel is a three-square path g6-f7-g8 with
    // a dead end at each end. Every window is bricked (f5/h5/e6/e8) — no
    // line enters. But the jump squares d6/d8/e5 are open, and a knight
    // that lands on f7 stands next to BOTH ends: wherever he is, his only
    // neighbour is the square she is on. Drop the Dragon, jump her onto
    // the middle, take him. The Duchess cannot jump; she is a trap here.
    make(
      6,
      [knight(3, 3), pawn(8, 4), king(6, 7)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: MILL(7, 7, { plus: [X(8, 7), X(6, 5), X(8, 5), X(5, 6), X(5, 8)] }),
        kingPen: RING(7, 7, ['h7']),
      },
    ),
    // L7 — THE CORKED WINDOW (magnet + a summon). NEW 2026-09-23. DECISION:
    // yank the cork off the diagonal and shoot through the gap it leaves.
    // From b3: Magnet d3->c3, queen on c2, c2-d3-e4-f5 x g6 — one turn.
    drawn(7, [
      '# # # # # # # #',
      '# # # # # , # #',
      '# # # # # # K #',
      '# n # # n . # #',
      'p # # # . n # #',
      '. . . n # # # #',
      '. # . # # # # #',
      '. # # # # # # #',
    ], { moveLimit: 4, flee: true, enemiesPerTurn: 2 }),
    // L8 — THE LONG SHOT (dragon + duchess). NEW 2026-09-23. DECISION: feed
    // the sniper, then take the far diagonal. e3 watches f2, the only square
    // beside g3; one body goes to f2, Rookie takes f2, g3-f4-e5-d6 x c7.
    drawn(8, [
      '# # # # # # # #',
      '# # K # # # # #',
      '# , # . # # # #',
      '# # # # . # # #',
      '# # # # # . # #',
      'n n # # p # . #',
      '. . . # # . # #',
      '. . . . . . . .',
    ], { moveLimit: 6, flee: true }),
    // L9 — THE LEAP (duchess clears, dragon jumps). NEW 2026-09-23.
    // DECISION: spend the queen on the bishop, keep the dragon for the jump.
    // Bishop h1 watches f3; neutralise it, step to f3, Dragon f4, x g6.
    drawn(9, [
      '# # # # # # # #',
      '# # # # # , # #',
      '# # # # # # K n',
      '# # # # # # # #',
      '# # # # # . # #',
      '# # # # # . # #',
      '# # # # # . . #',
      '. . . . . . # b',
    ], { moveLimit: 6, flee: true }),
    // L10 — THE FLUSH (dragon scares, duchess shoots). NEW 2026-09-23.
    // DECISION: don't attack him — drive him onto the line. h1-h3-f3,
    // Dragon e3-c4 (he runs b6->c7), Duchess g3, g3-f4-e5-d6 x c7.
    drawn(10, [
      '# # # # # # # #',
      '# # , # # # # #',
      '# K # . # # # #',
      '# # , # . # # n',
      '# # . # # . # #',
      '# # # # . . . .',
      '# # # # # # # .',
      '# # # # # # # .',
    ], { moveLimit: 7, flee: true, enemiesPerTurn: 2 }),
  ],
};

export default RUN_REVENGE_22;
export { RUN_REVENGE_22 };
