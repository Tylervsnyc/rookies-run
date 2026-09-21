/**
 * revenge-64 — THE HALL OF MIRRORS. Built 2026-09-19 (the Mirror batch) for the
 * signature pair MIRROR + SACRIFICE. Kit = mirror / sacrifice / hourglass
 * (3 cards, all always offered). NO `abilityTierCaps`.
 *
 * THE VERB: STEER A BOMB. The reflection is a body she drives with her own
 * safe moves into a place she can never stand, and Sacrifice detonates it.
 *
 * READ OUT OF lib/run/abilities.ts (the code is the truth):
 *   - the echo is `type: 'rook'`, `source: 'mirror'`, and 'mirror' IS in
 *     CONTROLLED_SOURCES, so `sacrificeTargets` lists it: the echo is a legal
 *     Sacrifice target, and the bot casts it (shared.ts enumerates it).
 *   - its blast is ROOK-shaped: 4 orthogonal lines x 2 squares, computed on an
 *     EMPTY board — stone, lava and pieces never shorten it. Every non-king
 *     enemy inside dies (pawns, guards, knights alike); stone is untouched; the
 *     king is never killed by a blast, only stunned (in the blast 1/2/3 turns
 *     by tier; 1 turn if anything else died). Sacrifice is a free action.
 *   So the whole run is one sentence: THE BLAST GOES THROUGH WALLS, THE ECHO
 *   DOES NOT. Every finale seals the echo in a cell it cannot leave (mirror
 *   alone = 0 by geometry, at every tier) and puts the thing she needs dead —
 *   a defended door pawn — two squares away on the far side of solid stone.
 *
 * ── CONSTANT SIGNATURE — THE CRACKED PANE ──────────────────────────────────
 * No lava seam, no twin tubes after L4. Each level is solid masonry with HER
 * walk carved on one half and ONE sealed mirror cell on the other: the twin of
 * a single rung of her walk. The terrain experiment: every LAVA square on the
 * board marks a broken symmetry — it sits exactly where her side is open floor
 * and his is not (the foot of the cell, the pin under a door). Read the lava
 * and you have found the cell. Rank 1 is always an open, connected floor (her
 * start file is random); designs are written in rungs, not files.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none       the hall; two marchers come down the tubes.
 *   L2  none       two marchers in her tube, his tube corked with lava.
 *   L3  MIRROR     TWO TUBES. Stand opposite, cast, walk up: the echo takes him.
 *   L4  MIRROR     THE WIND-UP. Her tube is 3 tall, he is 4 up his. Take the
 *                  bishop on b3, cast, step DOWN (the cork holds the echo: a
 *                  desync), stroke up 3.
 *   L5  MIRROR     THE BAIT. A door pawn c7 defended by b8. Cast on e6 (echo d6,
 *                  which the door pawn attacks), step aside: he takes the
 *                  reflection and leaves the door. Enemies capture the echo.
 *   L6  PAIR       THROUGH THE LID, taught. e5, cast (echo d5 under the lid d6),
 *                  detonate: he is stunned through the stone. Step beside him.
 *   L7-L10 PAIR    below. SACRIFICE alone is inert (no other body in the kit);
 *   HOURGLASS is a trap everywhere (0% alone and with mirror, every tier).
 *
 * ── THE FOUR FINALE LINES (each a different way of aiming) ─────────────────
 *   L7  UP THROUGH THE FLOOR. Door e5 (def. f6, pinned on stone e4), king f5.
 *       The cell e3 is under the door's floor. Line: d1-d3, MIRROR, SACRIFICE
 *       (e5 dies through e4, f3+g3 die too), d3-d5, d5xf5. A knight on b2
 *       covers d3, the one casting rung. DECISION: find the one rung; time it.
 *   L8  BLOCK YOUR OWN REFLECTION. Door c7 (def. b8) above stone c6, king b7.
 *       Line: f1-f5, MIRROR (echo c5), f5-d5 — the echo tries to follow and
 *       runs into HER — SACRIFICE (c7 dies through c6, a5+b5 die), d5-d7,
 *       d7xb7. DECISION: walk at it; your body parks it.
 *   L9  ROUND THE CORNER. Door c6, king b6 with a bolt-hole a5 — blow the door
 *       early and he walks. Line: f1-f4, MIRROR (echo c4), f4-e4 (wall d4
 *       parks it), SACRIFICE only now (one move from e6), e4-e6, e6xb6.
 *       DECISION: carry the fuse round the corner; blow it one move out.
 *   L10 UNDER THE LID. Door f7 (def. g8), king g7 with bolt-hole h6, two
 *       enemies a turn, three knights. Line: c1-c4, MIRROR (echo f4), c4-c6
 *       (the lid f6 parks the echo on f5 while she climbs past), c6-d6 (wall),
 *       SACRIFICE (f7 through f6, g5+h5), d6-d7, d7xg7.
 *       DECISION: overshoot — the lid holds the bomb under the door.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, T5 bot, `revenge.ts matrix`,
 *    32 trials, --jobs=4 ──────────────────────────────────────────────────
 *   L    none  mirror  sacrifice  hourglass | mirror+sacrifice
 *   7      0%     0%       0%        0%     |      66%
 *   8      0%     0%       0%        0%     |      78%
 *   9      0%     0%       0%        0%     |      72%
 *  10      0%     0%       0%        0%     |      78%
 *   TIER SWEEP, same read: mirror T2/T3/T5, sacrifice T3/T5, hourglass T5 and
 *   mirror+hourglass: 0% in all 28 cells. Pair at T5+T5 (16 trials):
 *   94/100/94/81 — it gets easier as it upgrades, never solo. No caps.
 *   MID-RUN, 16 trials:   none  mirror  sacrifice  hourglass  pair
 *     L1/L2               100    100      100        100      100
 *     L3                    0    100        0          0      100
 *     L4                    0    100        0          0        0  (see below)
 *     L5                    0     88        0          0       94
 *     L6                    0      0        0          0       94
 *   FULL RUNS, 20, random picks: 1/20. Deaths: L3/L4 without mirror, L6
 *   without both halves. Pick-dependent by design.
 *   HONEST NOTES: (1) L4 reads 0% when the bot ALSO holds sacrifice — a bot
 *   artifact (rollouts add jitter to casts, so they detonate the echo before
 *   the wind-up); the line is three moves for a person. (2) On L7/L8 the
 *   steering is soft: cast-and-detonate from the corner rung also works, so
 *   their difficulty is hunters + clock; L9 and L10 are where the aim is forced.
 *   (3) PIECES (incl. king): 3/3/2/4/5/4/8/8/7/8.
 *
 * DEAD ENDS (all measured): any king with a two-square dodge pen and a rank
 * lane leaks to mirror alone — she stands mid-lane, the echo is born beside
 * him as a second attacker (92-100%). A door the echo can REACH is a free stun
 * the moment she lands on the attack square. Knights on a stun level hop onto
 * the approach square and hand her the stun. A two-move wind-up before the
 * blast is provable and unfindable (0%). Decoy halls nearer the king than her
 * tube park the bot forever.
 */
import { FLEE, LAVA, STILL, X, bishop, king, knight, make, pawn, queen, type RunDef } from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

/**
 * THE PLATE. Eight strings, rank 8 first, file a first:
 *   '#' stone   '~' lava (a cracked pane)   '.' open ground
 *   'k' king  'p' pawn  'n' knight  'b' bishop  'q' queen (all his)
 */
function plate(rows: string[]): { pieces: EnemyPiece[]; hazards: Hazard[] } {
  const pieces: EnemyPiece[] = [];
  const hazards: Hazard[] = [];
  rows.forEach((row, i) => {
    const r = 8 - i;
    [...row].forEach((ch, j) => {
      const f = j + 1;
      if (ch === '#') hazards.push(X(f, r));
      else if (ch === '~') hazards.push(LAVA(f, r));
      else if (ch === 'k') pieces.push(king(f, r));
      else if (ch === 'p') pieces.push(pawn(f, r));
      else if (ch === 'n') pieces.push(knight(f, r));
      else if (ch === 'b') pieces.push(bishop(f, r));
      else if (ch === 'q') pieces.push(queen(f, r));
    });
  });
  return { pieces, hazards };
}

type Opts = NonNullable<Parameters<typeof make>[2]>;
const level = (n: number, rows: string[], opts: Opts) => {
  if (rows.length !== 8 || rows.some((r) => r.length !== 8)) throw new Error(`revenge-64 L${n}: bad plate`);
  const { pieces, hazards } = plate(rows);
  return make(n, pieces, { ...opts, hazards });
};

export const RUN_REVENGE_64: RunDef = {
  id: 'revenge-64',
  name: 'The Hall of Mirrors',
  blurb:
    'Solid stone, one walk carved for you, and across the board a sealed cell exactly where your reflection would stand. It cannot get out. It does not need to. Walk it under his door, and let it go.',
  allowedAbilities: ['mirror', 'sacrifice', 'hourglass'],
  signaturePair: ['mirror', 'sacrifice'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE HALL. Decision: climb a tube, sweep the top corridor.
    level(1, [
      '########',
      '#...k..#',
      '#.####.#',
      '#p####p#',
      '#.####.#',
      '#.####.#',
      '#.####.#',
      '........',
    ], { ...STILL, moveLimit: 12 }),
    // L2 — THE MARCHERS. Decision: eat the marchers on the way up.
    level(2, [
      '########',
      '#.....k#',
      '#p####.#',
      '#.####.#',
      '#p####.#',
      '#.####.#',
      '#.####~#',
      '........',
    ], { ...FLEE, moveLimit: 12, kingPen: ['g7'] }),
    // L3 — TWO TUBES (mirror KEY). Decision: stand opposite, cast, walk.
    level(3, [
      '########',
      '#.####k#',
      '#.####.#',
      '#.####.#',
      '#p####.#',
      '#.####.#',
      '#.####~#',
      '........',
    ], { ...FLEE, moveLimit: 10, kingPen: ['g7'] }),
    // L4 — THE WIND-UP (mirror KEY). Decision: step down first; the cork desyncs it.
    level(4, [
      '########',
      '######p#',
      '#####pk#',
      '#.####.#',
      '#.####.#',
      '#b####.#',
      '#.####~#',
      '........',
    ], { ...FLEE, moveLimit: 10, kingPen: ['g6'] }),
    // L5 — THE BAIT (mirror KEY). Decision: feed the reflection to the door guard.
    level(5, [
      '#p######',
      '#kp.####',
      '###...##',
      '#####p##',
      '#####.##',
      '#####.#n',
      '#####.##',
      '........',
    ], { ...FLEE, moveLimit: 12, kingPen: ['b7'] }),
    // L6 — THROUGH THE LID (pair, taught). Decision: the blast passes stone; stun, step beside.
    level(6, [
      '########',
      '###k.###',
      '####p###',
      '###..###',
      '###~.p##',
      '####.###',
      '####.###',
      '........',
    ], { ...FLEE, moveLimit: 12, kingPen: ['d7'] }),
    // L7 — UP THROUGH THE FLOOR. Decision: find the one rung under his door.
    level(7, [
      '########',
      '########',
      '#####p##',
      '#n#.pk##',
      '###.###n',
      '###..pp#',
      '#n#.~###',
      '........',
    ], { ...FLEE, moveLimit: 7, enemiesPerTurn: 2, kingPen: ['f5'] }),
    // L8 — BLOCK YOUR OWN REFLECTION. Decision: walk at it; your body parks it.
    level(8, [
      '#p######',
      '#kp.####',
      '###.##n#',
      'pp....##',
      '##~##.##',
      '#n###.#n',
      '#####.##',
      '........',
    ], { ...FLEE, moveLimit: 10, kingPen: ['b7'] }),
    // L9 — ROUND THE CORNER. Decision: hold the blast until one move out.
    level(9, [
      '########',
      '#p######',
      '#kp..###',
      '.#~#.###',
      'pp.#..##',
      '##~##.#n',
      'n####.##',
      '........',
    ], { ...FLEE, moveLimit: 10, kingPen: ['b6', 'a5'] }),
    // L10 — UNDER THE LID. Decision: overshoot; the lid holds the bomb.
    level(10, [
      '######p#',
      '###..pk#',
      '##..###.',
      '##.##.pp',
      '##.##.##',
      '##.##~#n',
      'n#.##n##',
      '........',
    ], { ...FLEE, moveLimit: 9, enemiesPerTurn: 2, kingPen: ['g7', 'h6'] }),
  ],
};

export default RUN_REVENGE_64;
