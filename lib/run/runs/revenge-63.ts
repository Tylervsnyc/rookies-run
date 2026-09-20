/**
 * revenge-63 — THE REFLECTING POOL. Built 2026-09-19 (the Mirror batch) for the
 * signature pair MIRROR + BOULDER. Kit = mirror / boulder / hourglass (3 cards,
 * all always offered). NO `abilityTierCaps` — the gate is geometric (see the
 * tier ladder below).
 *
 * THE IDEA. In The Looking Glass the LEVEL supplied the one broken stone. Here
 * the STONE is perfectly left-right symmetric on every level and the PLAYER
 * places the asymmetry: one Boulder next to the echo, so that one of her
 * strokes moves her and not it (or moves it less). Pieces are the only thing
 * that differ between the halves.
 *
 * ── CONSTANT SIGNATURE — THE POOL AND THE TWO BANKS ────────────────────────
 *   - a lava POOL in the middle of the board (a different shape every level:
 *     round, shallow, twin ponds, a ring round a stone, stepping-stone islands);
 *   - one shaft on each bank (the b-file is his, the g-file is hers);
 *   - THE SPLIT FLOOR: d1/e1 are stone, so rank 1 is two jetties. His jetty
 *     (a1-c1) is lined with three footmen, hers (f1-h1) is where she starts.
 *     That does three jobs with symmetric stone: she can never walk to his
 *     bank; every start is 0-1 moves from her shaft; and Mirror can never be
 *     cast from the floor (the mirror square is never empty ground), so the
 *     card cannot be wasted before she has climbed.
 *
 * WHAT THE CODE SAYS (lib/run/abilities.ts), and the theorem it gives:
 *   - the echo copies HER ACTUAL displacement, stops at a block, takes the
 *     first enemy it meets; a cast is free, so [cast + one stroke] has no
 *     enemy phase in it;
 *   - so on symmetric stone, if she can STAND on the twin T' of any square T
 *     that attacks him, Mirror alone wins on the spot (her twin stroke always
 *     exists: his cell's twin is open ground, and if a piece stands on it she
 *     takes it with the same displacement). Therefore every finale makes T'
 *     UNSTANDABLE — a pinned pawn watches it — and the only way to get the
 *     echo onto T is to DESYNC it from her. Symmetric stone never desyncs.
 *     A Boulder does.
 *   - the king takes an adjacent Rookie but not an ally, and every square that
 *     attacks him is ADJACENT to him. The echo may stand there. She may not.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none     the pool, drawn. Walk up her shaft.
 *   L2  none     two footmen march down her shaft at her.
 *   L3  MIRROR   TWO SHAFTS — stand anywhere in yours, cast, slide to the top:
 *                the reflection slides up his and takes him. Nothing else.
 *   L4  BOULDER  THE BOLT-HOLE — he has one diagonal flee square no line
 *                reaches. Stone it, then step onto his file.
 *   L5  MIRROR   FOOTMEN IN THE SHAFT — two pawns march down HER shaft and
 *                he has a bolt-hole (a8). Eat them (each capture stuns him),
 *                then cast and slide: the echo must land in one clean stroke.
 *                (The bot's line: g3, g5, cast, g7.)
 *   L6  BOULDER  TWO BOLT-HOLES — both stones.
 *   L7-L10       the pair. Every single card 0% at every tier.
 *   HOURGLASS is a TRAP on all ten levels (0% alone wherever a card is needed).
 *
 * ── THE FOUR FINALE LINES ──────────────────────────────────────────────────
 *   L7  THE LID. King c6; the only square that attacks him is b6, and its
 *       twin g6 is watched by the pinned pawn f7 (g5 by f6). LINE: g1-g4,
 *       [stone b7, MIRROR -> echo b4], g4-g7 — she slides THROUGH g5/g6, the
 *       echo stops under the stone on b6 — then g7xf7 and the echo takes c6 in
 *       the same stroke (f7 is defended by e8: taking it any other time is
 *       death). A second line exists through the knight's pocket: cast on g7,
 *       stone b5, g7-g4, g4xf4. DECISION: the stone goes ABOVE the echo.
 *   L8  THE FLOOR. King c5, the attack square is b5, its twin g5 is watched
 *       from f6. Two enemies a turn, a knight in the pocket f2 that covers h1
 *       and g4. LINE: g1-g7, [MIRROR -> echo b7, stone b4], g7-g2 (the echo
 *       drops onto b5 and stops), g2xf2 (the echo steps b5xc5).
 *       DECISION: cast high, stone UNDER the echo, come back down.
 *   L9  LID AND BOLT. L7's room, but he has a bolt-hole: the stepping stone d5
 *       in the pool. The park needs an enemy phase, and in it he walks. Both
 *       stones: b7 (the lid) and d5 (the bolt-hole) — or b5 + d5 and the
 *       downward park through the knight's pocket f4 (the bot's usual line).
 *       DECISION: two stones, two jobs — spend one wrong and it is over.
 *  L10  FLOOR AND BOLT. L8's room with the bolt-hole d4, two enemies a turn,
 *       the pocket knight. Stones b4 + d4 (or b6 + d4 and the upward park).
 *       DECISION: which way to park, with nothing to spare.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, T5 bot, `revenge.ts matrix`,
 *    32 trials, --jobs=4 ────────────────────────────────────────────────────
 *   L    none  mirror  boulder  hourglass | mirror+boulder
 *   7      0%     0%      0%       0%     |     100%
 *   8      0%     0%      0%       0%     |     100%
 *   9      0%     0%      0%       0%     |      81%   (88% at 16 after the pool repaint)
 *  10      0%     0%      0%       0%     |      59%   (63% at 16 after the pool repaint)
 *   also 0% on all four: mirror+hourglass, boulder+hourglass.
 * TIER LADDER, L7-L10, 32 trials: mirror T2/T3/T5 0/0/0/0; boulder T2/T3/T5
 * 0/0/0/0; hourglass T5 0/0/0/0. No caps needed: unlimited stones and the
 * crush cannot put HER on his bank, and a longer-lived or second echo still
 * cannot desync on symmetric stone. (The pair gets easier as Boulder upgrades:
 * crush the watcher and T' is standable. That is allowed.)
 * THE GATE IS CLEAN (44 cells of zero). THE BAND IS NOT MET ON L7 AND L8
 * (100%), honestly: a one-stone park is [stone + cast + slide] in one turn and
 * a capture the next, and the bot does not miss it at the minimum clock (4,
 * which is exact from f1/h1). Island knights, a pocket knight and two enemies
 * a turn did not move it. What DID tax the bot is needing BOTH stones right
 * (L9 81%, L10 59%). A knight that covers g1 reads 0-30% but is a true
 * lock-out from f1/h1 (stepping onto g1 is death and nothing else is legal
 * progress), so it was cut rather than shipped as "difficulty".
 *
 * MID-RUN, 16 trials:    none  mirror  boulder  hourglass
 *   L1 / L2              100    100     100      100
 *   L3                     0    100       0        0
 *   L4                     0      0     100        0
 *   L5                     0    100       0        0
 *   L6                     0      0     100        0
 * FULL RUNS, 20, random picks: 1/20. Pick-dependent by design and harsher than
 * the 4-card runs: L3 needs Mirror from the L1 offer and L4 needs Boulder from
 * the L3 offer (10 died on L3, 8 on L4). Cheap lever if Tyler wants it softer:
 * make L4 a second Mirror level so one early pick carries her to L6.
 *
 * PIECES PER LEVEL (king included): 4 / 6 / 4 / 6 / 6 / 6 / 8 / 8 / 8 / 8.
 *
 * BOT NOTES THAT SHAPED THE BOARDS (scripts/run-playtest/bots/shared.ts): the
 * bot only considers Boulder squares within 1 of the KING or within 2 of HER.
 * So every designed stone is adjacent to him. Three richer uses were built and
 * proven by hand but read 0-17% because their stone is next to the ECHO, two
 * or more squares from him: the far ratchet (stone under the echo, stroke from
 * the floor), the sidestep (stone beside the echo, stroke up a second shaft)
 * and the latch (stone behind the echo on the top row). They are the better
 * puzzles for a human and are worth a second run if the candidate filter
 * learns about the echo.
 *
 * DEAD ENDS: (1) an open connected floor: every rollout casts Mirror on rank 1
 * (casts outrank moves on a 6+ piece board) and then, seeing no win, the bot
 * walls itself in on d1/e1 on purpose — a dead end scores better than a
 * run-out clock. (2) Footmen across the whole of rank 1 with no cork: Boulder
 * T2+ solo 100% — eat d1,c1,b1, crush a1 for the stun, step beside him, take
 * him. (3) A bishop on e7 defending f8: d7/e7 are adjacent across the axis, so
 * the halves were connected. (4) A knight as a walled defender always has a
 * landing square in a shaft and leaves its post.
 */
import { FLEE, LAVA, STILL, X, bishop, king, knight, make, pawn, queen, type RunDef } from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

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
  const { pieces, hazards } = plate(rows);
  return make(n, pieces, { ...opts, hazards });
};

export const RUN_REVENGE_63: RunDef = {
  id: 'revenge-63',
  name: 'The Reflecting Pool',
  blurb:
    'A pool of lava, and two banks that are the same bank. His footmen line the far jetty; you will never set foot over there. Your reflection will — and it goes exactly where you go, unless you drop a stone in its way.',
  allowedAbilities: ['mirror', 'boulder', 'hourglass'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    level(1, [
      '#.####k#',
      '#.####.#',
      '#.#~~#.#',
      '#.~~~~.#',
      '#.~~~~.#',
      '#.#~~#.#',
      '#.####.#',
      'ppp##...',
    ], { ...STILL, moveLimit: 12 }),
    level(2, [
      '#.####k#',
      '#.####.#',
      '#.####p#',
      '#.####.#',
      '#.~~~~p#',
      '#.~~~~.#',
      '#.####.#',
      'ppp##...',
    ], { ...FLEE, moveLimit: 12, kingPen: ['g8'] }),
    level(3, [
      '#k####.#',
      '#.####.#',
      '#.~~~~.#',
      '#.####.#',
      '#.####.#',
      '#.~~~~.#',
      '#.####.#',
      'ppp##...',
    ], { ...FLEE, moveLimit: 8, kingPen: ['b8'] }),
    level(4, [
      '#..##k.#',
      '##.##.##',
      '#..##..#',
      '#.#~~#.#',
      '#p~~~~.#',
      '#p#~~#.#',
      '#.####.#',
      'ppp##...',
    ], { ...FLEE, moveLimit: 8, kingPen: ['f8', 'g8'] }),
    level(5, [
      '.######.',
      '#k####.#',
      '#.~~~~p#',
      '#.~##~p#',
      '#.~~~~.#',
      '#.####.#',
      '#.####.#',
      'ppp##...',
    ], { ...FLEE, moveLimit: 8, kingPen: ['b7', 'a8'] }),
    level(6, [
      '#....k.#',
      '##.##.##',
      '#..##..#',
      '#.~~~~.#',
      '#p#~~#.#',
      '#p####.#',
      '#.####.#',
      'ppp##...',
    ], { ...FLEE, moveLimit: 8, kingPen: ['f8', 'g8', 'e8'] }),
    level(7, [
      '###.p###',
      '#..##p.#',
      '#.k##p.#',
      '#.#~~#.#',
      '#..~~n.#',
      '#.~~~~.#',
      '#.####.#',
      'ppp##...',
    ], { ...FLEE, moveLimit: 4, kingPen: ['c6'] }),
    level(8, [
      '########',
      '#.#.p#.#',
      '#..##p.#',
      '#.k~~p.#',
      '#.#~~#.#',
      '#.~~~~.#',
      '#..##n.#',
      'ppp##...',
    ], { ...FLEE, moveLimit: 4, enemiesPerTurn: 2, kingPen: ['c5'] }),
    level(9, [
      '###.p###',
      '#..##p.#',
      '#.k##p.#',
      '#.#..#.#',
      '#..~~n.#',
      '#.####.#',
      '#.####.#',
      'ppp##...',
    ], { ...FLEE, moveLimit: 4, kingPen: ['c6', 'd5'] }),
    level(10, [
      '########',
      '#.#.p#.#',
      '#..##p.#',
      '#.k~~p.#',
      '#.#..#.#',
      '#.#~~#.#',
      '#..##n.#',
      'ppp##...',
    ], { ...FLEE, moveLimit: 6, enemiesPerTurn: 2, kingPen: ['c5', 'd4'] }),
  ],
};

export default RUN_REVENGE_63;
