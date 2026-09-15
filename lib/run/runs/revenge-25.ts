/**
 * revenge-25 — THE ALCOVE. Signature pair BECOME KING + BOULDER.
 * Kit = become-king / boulder / magnet (`allowedAbilities` IS the kit).
 * VERB: nooks carved in stone — step in untouchable, and let the stone decide
 * who goes where.
 *
 * ===========================================================================
 * 2026-09-15 VARIETY PASS (Tyler played it on Normal: cleared, 1 death on L9,
 * "loved it", Boulder is his favourite card). What he said, level by level:
 * L3 become-king "very fun"; L4 "really fun"; L5-L7 were all "boulder the king
 * in" — "I wish there was a different design"; L8 fine; L9 THE HIGHLIGHT — the
 * bishop on g6 walked out to d3 and he trapped it with a stone on e4: "blocking
 * pieces with boulders is just the best". Data: the king sat in the same g7
 * alcove on L1/L3/L5/L6/L7/L9, and his L9 and L10 were the same line.
 *
 * Changes in this pass:
 *   - Kit 4 -> 3 cards: AEGIS dropped (Phase 3 of the 2026-09-15 plan). L3 and
 *     L4 had Aegis as their key; both now take Become King (Magnet is the slow
 *     second answer on L3/L4, the one place the trap card works).
 *   - The king leaves g7: only L9 (the model level, unchanged) keeps it.
 *   - L5-L7 ask three different things (shield stone / the step / the flush).
 *   - L7-L10 ask four different Become King + Boulder questions, and L10 is new.
 *
 * THE LEVELS (primary question in eight words or fewer):
 *   L1  THE NICHE        d8, still. Ride the open file.                (free)
 *   L2  THE SIDE DOOR    h4, still. Slide the rank past a bishop.      (free)
 *   L3  THE PLUG         d7, still. A defended bishop plugs the door —
 *                        take it as a king.                     BECOME KING
 *   L4  THE BAR          b7, still. A defended bishop bars the file —
 *                        take it as a king, or pull it aside.  BECOME KING / magnet
 *   L5  THE LOOKOUT      h6, still. A walled-in bishop watches the turn
 *                        onto his rank — stone its line of sight.   BOULDER
 *   L6  THE STEP         e6, still, a sill under the door. Step in as a
 *                        king.                                  BECOME KING
 *   L7  THE FLUSH        d7, flees, two doors (e7, e8). Step next to him as
 *                        a king (b6/b8 -> c7) and he runs OUT of his nook —
 *                        always to the diagonal door e8, because e7 is in
 *                        line with his own square. Brick e8 first; he is
 *                        forced onto e7, and the rook slides c7 -> e7.
 *   L8  THE SEAM         b7, flees. Become King spent on TRAVEL through a
 *                        diagonal gap; stone the corner; slide in. (unchanged)
 *   L9  THE PLUG THAT WALKS  g7, flees. Lure the plug out, stone its way
 *                        back, step in. Tyler's favourite. (unchanged)
 *   L10 THE CROWN        f4, boxed in stone. His only neighbour is a bishop
 *                        on e5 whose one way out is f6, and it takes it the
 *                        moment you come for it. From f7 (f6 in your fire, so
 *                        it holds) stone f6, drop to e7, take the bishop (the
 *                        capture stuns him) and the king form steps onto him:
 *                        the one level where the crown itself takes the king.
 *
 * WHY THE FINALE SINGLES FAIL:
 *   none / magnet — no rook line reaches a finale king or the square beside
 *   him; Magnet pulls along her own lines, and every piece that matters sits
 *   in stone off them (on L10 a pull drags the bishop AWAY from the king).
 *   boulder — stone never opens anything: L7 nothing ever threatens him, L8
 *   the pocket is a diagonal away, L9 the doorstep is off every line, L10 a
 *   rook on the bishop's square cannot take a king on the diagonal.
 *   become-king (capped at T1: one step, one protected turn) — L7 he runs to
 *   e8, off every line (the flee AI calls e7 risky: it shares a line with his
 *   own square, which her king form attacks); L8 he steps to a8; L9 he runs
 *   to h8; L10 the bishop walks out the moment she reaches e7, and with it
 *   goes the only stun beside the king (a king step to e6 holds it, but then
 *   the one use is spent before the crown).
 *
 * DISTINCT WINNING LINES (check 7 REPEAT, scripts/run-playtest/line-signature):
 *   L7  boulder@adj > become-king | cap:rook/orth   (no kingPen: the doors are
 *       his neighbours, not a room)
 *   L8  boulder@pen > become-king | cap:rook/orth
 *   L9  boulder@far > boulder@pen > become-king | cap:rook/step
 *   L10 boulder@line > become-king | cap:king/step
 *
 * History: the 2026-09-06 build notes, dead ends (the chimney, the second
 * seam, the back wall, junk stones, bishops cannot hunt here) and the
 * become-king tier sweep that chose the T1 cap live in git history of this
 * file (`git log -p lib/run/runs/revenge-25.ts`). Numbers of record are in
 * data/run-playtest/results/, not here.
 */
import { bishop, king, knight, make, pawn, X } from '../run-kit';
import type { RunDef } from '../run-kit';
import type { Coord, EnemyPiece } from '../types';

const STILL = { winCondition: 'king' as const, kingBehavior: 'still' as const };
const FLEE = { winCondition: 'king' as const, kingBehavior: 'flee' as const };

const inB = (f: number, r: number): boolean => f >= 1 && f <= 8 && r >= 1 && r <= 8;
const sq = (f: number, r: number): string => `${'abcdefgh'[f - 1]}${r}`;

interface Alcove {
  hazards: Coord[];
  pieces: EnemyPiece[];
  pen: string[];
}

/**
 * The alcove for a king on (kf, kr), opening toward the board edge at
 * `kf + wall` (so `wall` is +1 for the g-file cell, -1 for the b-file mirror).
 *
 * Stone: the WALL shoulder and the doorstep flank under it, the SENTRY's stump,
 * the CROWN above him, and the two SEALS two files inboard on his rank and on
 * the corner rank. `sentry: false` walls that shoulder too (L5). `sill` adds the
 * stone under the doorstep, which is what takes it off every rook line.
 */
function alcove(
  kf: number,
  kr: number,
  wall: 1 | -1,
  opts: { sill?: boolean; sentry?: boolean; twoCorners?: boolean } = {},
): Alcove {
  const sentry = opts.sentry !== false;
  // 2026-09-06 rework: `twoCorners` leaves the inboard corner OPEN and adds it
  // to his pen — a second flight square (L7 / L9 / L10) that is NOT the one the
  // stone should go on. Still off every rook line: its file is his sentry.
  const twoCorners = opts.twoCorners === true;
  const inboard = kf - wall;
  const hazards: Coord[] = [
    X(kf + wall, kr), // the walled shoulder
    X(kf + wall, kr - 1), // …and the doorstep flank under it
    X(inboard, kr - 1), // the sentry's stump = the other doorstep flank
    X(kf, kr + 1), // the crown
    ...(twoCorners ? [] : [X(inboard, kr + 1)]), // the inboard corner, bricked
    // The BACK WALL: the three squares behind the sentry. Without them a king
    // form standing on any of them captures the sentry diagonally and lands on
    // his rank (measured 2026-09-06: become-king alone read 50-75% via e8xf7).
    X(inboard - wall, kr - 1),
    X(inboard - wall, kr),
    X(inboard - wall, kr + 1),
  ];
  if (!sentry) hazards.push(X(inboard, kr));
  if (opts.sill && inB(kf, kr - 2)) hazards.push(X(kf, kr - 2));
  const pieces: EnemyPiece[] = sentry
    ? [pawn(inboard, kr), king(kf, kr)]
    : [king(kf, kr)];
  return {
    hazards: hazards.filter((c) => inB(c.file, c.rank)),
    pieces,
    pen: [sq(kf, kr), sq(kf + wall, kr + 1), ...(twoCorners ? [sq(inboard, kr + 1)] : [])],
  };
}

const G7_SILL = alcove(7, 7, 1, { sill: true });
/** b-file mirror: king b7, sentry c7, wall a7, corner a8, doorstep b6. */
const B7 = alcove(2, 7, -1);


/**
 * A level drawn as a picture. `rows[0]` is rank 8, each row 8 characters a-h:
 *   '#' stone   'K' king   'p' pawn   'b' bishop   'n' knight   '.' empty
 * Returns pieces + stone; the pen (if any) is passed separately.
 */
function carve(rows: string[]): { pieces: EnemyPiece[]; hazards: Coord[] } {
  if (rows.length !== 8 || rows.some((r) => r.length !== 8)) throw new Error('carve: need 8 rows of 8');
  const pieces: EnemyPiece[] = [];
  const hazards: Coord[] = [];
  rows.forEach((row, i) => {
    const r = 8 - i;
    [...row].forEach((ch, j) => {
      const f = j + 1;
      if (ch === '#') hazards.push(X(f, r));
      else if (ch === 'K') pieces.push(king(f, r));
      else if (ch === 'p') pieces.push(pawn(f, r));
      else if (ch === 'b') pieces.push(bishop(f, r));
      else if (ch === 'n') pieces.push(knight(f, r));
      else if (ch !== '.') throw new Error(`carve: bad char ${ch}`);
    });
  });
  return { pieces, hazards };
}

const L1 = carve([
  '..#K#...',
  '..#.#...',
  '.p....p.',
  '.#....#.',
  '........',
  '........',
  '........',
  '........',
]);
const L2 = carve([
  '........',
  '...p....',
  '...#....',
  '......##',
  '.......K',
  '......##',
  '..b.....',
  '........',
]);
const L3 = carve([
  '.###....',
  '.#pK#...',
  '.##b#.p.',
  '..#.#.#.',
  '........',
  '........',
  '........',
  '........',
]);
const L5 = carve([
  '........',
  '...#####',
  '..#....K',
  '##..####',
  '#b#..##.',
  '###.#b#.',
  '....###.',
  '........',
]);
const L6 = carve([
  '........',
  '..###...',
  'p.#pK#.p',
  '#.##.#.#',
  '....#...',
  '........',
  '........',
  '........',
]);
const L7 = carve([
  '..##.###',
  '.#.K.###',
  '..######',
  '..######',
  '..######',
  '..######',
  '..######',
  '....####',
]);
const L10 = carve([
  '#.....##',
  '#.....##',
  '#..#..##',
  '#..#b###',
  '#..##K##',
  '#..#####',
  '#..#####',
  '#..#####',
]);

const RUN_REVENGE_25: RunDef = {
  id: 'revenge-25',
  signaturePair: ['become-king', 'boulder'],
  name: 'The Alcove',
  blurb: 'Nooks carved in stone. Step in as a king, and let the stone decide where he goes.',
  allowedAbilities: ['become-king', 'boulder', 'magnet'],
  // TIER CAP (2026-09-06, re-kept 2026-09-15). Become King's second use
  // arrives at T2, and one extra king step solved L7-L10 alone (T2 read
  // 100/19/94/100 on the 2026-09-06 finale). Offerable, never upgradable here.
  abilityTierCaps: { 'become-king': 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    make(1, L1.pieces, { ...STILL, moveLimit: 6, hazards: L1.hazards, kingPen: ['d8'] }),
    make(2, L2.pieces, { ...STILL, moveLimit: 7, hazards: L2.hazards, kingPen: ['h4'] }),
    make(3, L3.pieces, { ...STILL, moveLimit: 6, hazards: L3.hazards, kingPen: ['d7'] }),
    // L4 — THE BAR (unchanged board; Aegis was its key until 2026-09-15).
    make(4, [...B7.pieces, bishop(2, 4), pawn(1, 5)], {
      ...STILL,
      moveLimit: 7,
      hazards: [...B7.hazards, X(1, 3), X(3, 3), X(3, 5), X(1, 4)],
      kingPen: B7.pen,
    }),
    make(5, L5.pieces, { ...STILL, moveLimit: 6, hazards: L5.hazards, kingPen: ['h6'] }),
    make(6, L6.pieces, { ...STILL, moveLimit: 6, hazards: L6.hazards, kingPen: ['e6'] }),
    make(7, L7.pieces, { ...FLEE, moveLimit: 7, hazards: L7.hazards }),
    // L8 — THE SEAM (unchanged).
    make(8, [...B7.pieces, pawn(6, 6)], {
      ...FLEE,
      moveLimit: 7,
      hazards: [...B7.hazards, X(6, 5), X(1, 4), X(1, 5), X(2, 4), X(3, 4), X(4, 5)],
      kingPen: B7.pen,
    }),
    // L9 — THE PLUG THAT WALKS (unchanged; the model level).
    make(9, [...G7_SILL.pieces, pawn(3, 6), pawn(4, 6), bishop(7, 6)], {
      ...FLEE,
      moveLimit: 7,
      hazards: [...G7_SILL.hazards, X(3, 5), X(4, 5), X(8, 5)],
      kingPen: G7_SILL.pen,
    }),
    make(10, L10.pieces, { ...FLEE, moveLimit: 7, hazards: L10.hazards }),
  ],
};

export { RUN_REVENGE_25 };
export default RUN_REVENGE_25;
