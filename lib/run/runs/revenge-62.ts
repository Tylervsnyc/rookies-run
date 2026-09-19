/**
 * revenge-62 — THE SCREE. Built 2026-09-19 for the signature pair
 * AVALANCHE + BOULDER. Kit = avalanche / boulder / aegis / hourglass
 * (`allowedAbilities` IS the kit). Avalanche is a TESTING card
 * (docs/new-abilities-2026-09-19.md, level-first #10); the partner is the
 * design-intent partner — it was NOT swapped.
 *
 * LEVEL-FIRST. The crazy level came before the card: rows of loose stone
 * hanging over a pen with no roof, a gutter of lava between her and it, and
 * nothing on the board she can push. Avalanche was invented to solve it —
 * every LOOSE stone slides one square the way she points, all at once.
 *
 * THE VERB: READ THE NEXT PICTURE. Every other terrain card in the game edits
 * one square. This one edits the whole board with one tap, so the question is
 * never "where do I put it" but "what does the hillside look like one square
 * over, in each of four directions" — which stone sinks, which stone lands on
 * his flee square, which stone rolls out of the doorway, which stone lands on
 * the sentry, and which ones are rib and will not move at all.
 *
 * WHY THIS PAIR, read out of lib/run/abilities.ts:
 *   - AVALANCHE (T1): one cast. Loose stones only (`isLooseStone`: not lava,
 *     not `fixed`). Far side first; a stone stops at a rib, at a stone that did
 *     not move, at her, at the king. INTO LAVA both vanish — a ford (R3). A
 *     pawn under a stone is crushed, credited to her, and the king is stunned.
 *     It can do three things Boulder never can: ford lava, crush at T1, and
 *     take a stone OUT of a square.
 *   - BOULDER (T1): two stones, any empty square, and a dropped stone is LOOSE.
 *     It can do the one thing Avalanche never can: put a stone where the
 *     mountain did not. It cannot land on lava, so alone it never fords.
 *   So on a board whose scree is all in the wrong place, Boulder is the
 *   AMMUNITION and Avalanche is the GUN, and neither fires alone. The doc's
 *   standing note — "Boulder has so far never gated a level with any partner"
 *   — ends here: R3 is the first rule in the game that gives a dropped stone
 *   something to do that the drop itself cannot.
 *   - AEGIS and HOURGLASS are the fillers. Hourglass is the catalogue's proven
 *     inert card (0% alone on every finale ever measured). Aegis is a trap on
 *     every finale (he is behind lava; a shield crosses nothing) and a co-key
 *     on L4 and L6 (measured, accepted, reported below). No universal solvent.
 *
 * ── CONSTANT SIGNATURE — THE SCREE ─────────────────────────────────────────
 * Every level is drawn with the same four glyphs (see `draw`):
 *   1. THE SCREE  `o` — rows of loose stone on the high ranks, over the pen.
 *   2. THE RIBS   `#` — `fixed` stone. The finales are carved out of it.
 *   3. THE GUTTER `~` — a full-width row of lava between her floor and his
 *      pen. L8 adds a single VENT inside his corridor and a dry ISLAND in the
 *      gutter; L10 turns the gutter on end into a VEIN down the d-file.
 *   4. THE ROOFLESS PEN — his pen is open on top, so a stone can fall into it.
 *
 * ── TERRAIN EXPERIMENT ─────────────────────────────────────────────────────
 * Loose-vs-fixed IS the puzzle: the two kinds of stone look alike in a sketch
 * and behave oppositely on the cast. New shapes for the catalogue: a full-width
 * lava gutter that is forded rather than walked round; a one-square dry island
 * INSIDE the gutter that exists only to be an ammunition niche (L8); a lava
 * vent inside his own corridor (L8); a vertical lava vein (L10); scree columns
 * stacked two deep so that the far stone pins the near one in one direction
 * and not the other (L9).
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none       — the hillside, drawn. He is on her side of the gutter.
 *   L2  none       — the gutter has a gap under him. Walk it.
 *   L3  AVALANCHE  — a scree stone sits on the road right above the gutter.
 *                    SOUTH sinks it: cork and lava gone in one motion.
 *   L4  BOULDER    — two fords, a two-square pen: the boulder trick (a lid on
 *                    his other square). AEGIS co-key (she may stand beside him).
 *   L5  AVALANCHE  — the ford is built but a stone corks the road above it.
 *                    Only WEST rolls it into the alcove; south leaves it on
 *                    the road, north and east leave it where it is. Direction is the level.
 *   L6  AVALANCHE  — a pinned sentry pawn watches the corner she must stop on.
 *                    SOUTH drops the stone hanging over it: a crush, from
 *                    across the gutter. AEGIS co-key (eat the pawn's capture).
 *   L7-L10 the pair. Avalanche, Boulder, Aegis, Hourglass alone: 0%.
 *
 * ── THE FOUR FINALE LINES (as built) ───────────────────────────────────────
 *   L7  TWO STONES, TWO JOBS. Road c1-c3, gutter c4, corner c5, corridor
 *       d5-e5, king f5 with a chimney f6 to run up. Boulder f6 (the lid),
 *       boulder c5 (the ammunition), Avalanche SOUTH (c5 sinks into c4),
 *       Rc3-c5, Rxf5. (Boulder c3 + NORTH is the mirror answer.) A knight
 *       hunts the six-square yard. `moveLimit: 6`.
 *       DECISION: one stone to sink, one stone to shut.
 *   L8  ONE SHOUT, TWO FORDS. Road e1-e4, gutter e5, corner e6, a lava VENT
 *       on f6 between the corner and the king on g6. f5 is a dry island in
 *       the gutter. Stand on e3; boulder e4 AND boulder f5; Avalanche NORTH —
 *       f5 sinks into the vent, e4 sinks into the gutter, one cast; Re3-e6,
 *       Rxg6. No lid is left over, so the pen is one square. `moveLimit: 8`.
 *       DECISION: both stones are ammunition; find the second niche.
 *   L9  THE SCREE SHUTS THE PEN. Road g1-g3, gutter g4, corner g5, king d5
 *       with TWO flee squares, c6 and e6 — one more than she has stones for
 *       once one stone is ammunition. Over each hangs a column of two loose
 *       stones (c7/c8, e7/e8). NORTH fords (boulder g3) and moves no scree:
 *       c8/e8 are against the edge and pin c7/e7. SOUTH fords (boulder g5)
 *       AND drops c7->c6, e7->e6. Boulder g5, Avalanche SOUTH, Rg3-g5, Rxd5.
 *       A bishop and a knight hunt the yard, two enemies per turn.
 *       DECISION: north or south — both ford, one also shuts the pen.
 *  L10  THE VEIN. The gutter stands on end: lava d1-d4. Road a3-c3, vein d3,
 *       corner e3, a loose CORK on e4, second corner e5, corridor f5-g5, king
 *       h5 with a chimney h6. A sentry pawn on f4 (pinned by f3) watches e3.
 *       A knight on a1 covers b3. Boulder c3, boulder h6, Avalanche EAST:
 *       c3 sinks into d3 (ford), the cork rolls e4->f4 ONTO the sentry (door
 *       and crush in one stone). Ra3-e3, Re3-e5, Rxh5. WEST is the trap: a
 *       boulder on e3 sinks into d3 and the cork sinks into d4 — a cleaner
 *       looking board with the sentry still alive over the corner.
 *       `moveLimit: 8`.
 *       DECISION: east or west — which way does the cork roll.
 *
 * What each of L8-L10 adds that L7's line does not cover: L8 spends BOTH
 * stones as ammunition and hides the second niche inside the gutter; L9 has
 * more flee squares than stones, so the lids must come from the scree and
 * the DIRECTION is the answer; L10 makes one loose stone do two jobs (door,
 * crush) and offers a wrong direction that looks better than the right one.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, `revenge.ts matrix` ──────────
 * Numbers of record: 32 trials, `--jobs=2` (ten authors shared the machine),
 * T5 bot, the run's own 4-card kit.
 *
 *   L    none  avalanche  boulder  aegis  hourglass | avalanche+boulder
 *   7      0%      0%        0%      0%      0%     |       75%
 *   8      0%      0%        0%      0%      0%     |       66%
 *   9      0%      0%        0%      0%      0%     |       84%
 *  10      0%      0%        0%      0%      0%     |       59%
 *
 * THE GATE IS MET: 20 cells of zero, the pair means 71%. L9 is 4 points over
 * the band and L10 one point under, both inside 32-trial noise. HONEST NOTES
 * on where the difficulty comes from: with no hunters and a generous clock
 * the bot reads L7, L9 and (first build) L10 at 100% — it finds the cast
 * every time, and the clock is NOT a usable knob (L7 and L9 stayed 100% at the
 * perfect-play move limit). The spread comes from the hunters in the yards
 * (L7 knight, L9 bishop + knight at two enemies per turn, L10 the a1 knight
 * covering b3) and, on L8, from the bot climbing onto e4 — the ammunition
 * square, the nearest square to him — and having to step back off it. For a
 * human the difficulty is the reading, which the bot does not price.
 *
 * TIER LADDER, L7-L10, 32 trials, each card alone:
 *   avalanche  T1-T5  0/0/0/0 at every tier
 *   boulder    T1-T5  0/0/0/0 at every tier
 * Pair at raised tiers, 16 trials: avalanche:1+boulder:2 63/69/94/69;
 * avalanche:4+boulder:1 100/94/100/94; avalanche:3+boulder:3 100/100/100/100;
 * avalanche:1+boulder:4 81/94/100/0. `abilityTierCaps: { boulder: 3,
 * avalanche: 2 }` — see the field for why. Neither cap is needed by the gate.
 *
 * MID-RUN, 16 trials:
 *   L    none  avalanche  boulder  aegis  hourglass
 *   1    100%    100%      100%    100%     100%
 *   2    100%    100%      100%    100%     100%
 *   3      0%    100%        0%      0%       0%   (avalanche KEY, clean)
 *   4     19%     13%      100%    100%      31%   (boulder KEY, aegis co-key)
 *   5      0%    100%        0%      0%       0%   (avalanche KEY, clean)
 *   6      0%    100%        0%    100%       0%   (avalanche KEY, aegis co-key)
 * L4 leaks 13-31% without its key: his flee tie-break sometimes walks him
 * back onto her file. Aegis solves any level where she can stand beside him.
 *
 * FULL RUNS, 24 runs, T5, no retries:
 *   random picks from the whole kit    1/24 =  4%  (L3 17% — 20 of 24 runs
 *                                       die there holding no Avalanche)
 *   `--pool=avalanche,boulder`         7/24 = 29%  (L3 71%, L4 59%, then
 *                                       L7 80 / L8 100 / L9 100 / L10 88)
 * The wall is L3, not the finale: there is ONE offer before it (L1) and L3
 * has exactly one key. If Tyler wants the ladder softer, move the Avalanche
 * teach to L4 and the Boulder lid to L3 (aegis co-keys it) — one swap, the
 * gate untouched.
 *
 * ── ENGINE NOTES (nothing fixed, nothing altered) ──────────────────────────
 *   - No Avalanche bug found. `avalancheOutcome` matched every hand
 *     prediction (rib stops, edge-pinned columns, far-side-first, ford, crush).
 *   - BOT LIMIT that shapes this run: `candidatesForAbility` only offers a
 *     Boulder square within Chebyshev 2 of Rookie or 1 of the king
 *     (scripts/run-playtest/bots/shared.ts). A player may drop the stone
 *     anywhere. First-build L8 (gutters on ranks 3 and 5, ammunition e2+e4)
 *     read 0% for the pair for that reason alone; every finale here keeps both
 *     ammunition squares within 2 of one standing square.
 *   - Avalanche is only a bot candidate when it crushes, fords, lands beside
 *     him or opens her line; a pure "open a door for later" cast is invisible.
 */
import { type RunDef, make, FLEE, STILL } from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

/**
 * THE PICTURE. Eight strings, rank 8 first, file a first. The run is authored
 * as drawings because the whole puzzle is reading a drawing's NEXT state.
 *   #  RIB    — `fixed` stone. Avalanche never moves it.
 *   o  SCREE  — loose stone. Every one of these moves on a cast.
 *   ~  GUTTER — lava. A loose stone slid into it: both vanish, a ford (R3).
 *   K p n b q — his men.      .  open ground.
 */
function draw(rows: string[]): { pieces: EnemyPiece[]; hazards: Hazard[] } {
  if (rows.length !== 8 || rows.some((r) => r.length !== 8)) throw new Error('revenge-62: a picture is 8x8');
  const pieces: EnemyPiece[] = [];
  const hazards: Hazard[] = [];
  const types = { K: 'king', p: 'pawn', n: 'knight', b: 'bishop', q: 'queen' } as const;
  rows.forEach((row, i) => {
    const rank = 8 - i;
    [...row].forEach((ch, j) => {
      const file = j + 1;
      if (ch === '#') hazards.push({ file, rank, kind: 'stone', fixed: true });
      else if (ch === 'o') hazards.push({ file, rank, kind: 'stone' });
      else if (ch === '~') hazards.push({ file, rank, kind: 'lava' });
      else if (ch in types) pieces.push({ type: types[ch as keyof typeof types], color: 'black', file, rank });
      else if (ch !== '.') throw new Error(`revenge-62: unknown glyph ${ch}`);
    });
  });
  return { pieces, hazards };
}

type Opts = NonNullable<Parameters<typeof make>[2]>;
const level = (n: number, rows: string[], opts: Omit<Opts, 'hazards'>) => {
  const { pieces, hazards } = draw(rows);
  return make(n, pieces, { ...opts, hazards });
};

export const RUN_REVENGE_62: RunDef = {
  id: 'revenge-62',
  name: 'The Scree',
  blurb:
    'Rows of loose stone hang over a pen with no roof, and a gutter of lava runs between you and it. Some of the stone is rib — it will never move. The rest all moves at once, one square, whichever way you point. Read the whole hillside before you shout.',
  allowedAbilities: ['avalanche', 'boulder', 'aegis', 'hourglass'],
  // Measured L7-L10, 32 trials: every tier of each signature card ALONE reads
  // 0/0/0/0 (avalanche T1-T5, boulder T1-T5), so the gate needs no cap. The
  // caps are for the PAIR, 16 trials:
  //   avalanche:1 + boulder:4   81 / 94 / 100 /  0   <- T4 Boulder forces a
  //     second stone per use (the Stacks rule) and it walls her own road on
  //     L10's one-wide floor. Boulder is capped at 3.
  //   avalanche:3 + boulder:3  100 / 100 / 100 / 100 <- T3 Avalanche is a
  //     second cast, and with two casts the direction stops being a decision
  //     (north, then south). Avalanche is capped at 2 to keep it one shout.
  abilityTierCaps: { boulder: 3, avalanche: 2 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // ── L1 — THE HILLSIDE. The whole silhouette, and none of it matters: he
    // is standing on her side of the gutter. DECISION: none — take him.
    level(
      1,
      [
        'oooooooo',
        '.oo..oo.',
        '#......#',
        '#......#',
        '~~~~~~~~',
        '...K....',
        '.....p..',
        '........',
      ],
      { ...STILL, moveLimit: 12 },
    ),
    // ── L2 — THE GAP. He is over the gutter, in a one-square pen between two
    // ribs, and the gutter has a gap under him. DECISION: find the one file.
    level(
      2,
      [
        '.oo.ooo.',
        '..o..o..',
        '####K###',
        '####.###',
        '~~~~.~~~',
        '........',
        '.n......',
        '........',
      ],
      { ...FLEE, moveLimit: 14, kingPen: ['e6'] },
    ),
    // ── L3 — THE FIRST SHOUT (avalanche KEY). The gap is gone and a scree
    // stone sits on the road directly above the gutter. South: it sinks, the
    // lava cools, the road is open. DECISION: which way sinks the stone.
    level(
      3,
      [
        '..oooo..',
        '...o.o..',
        '####K###',
        '####o###',
        '~~~~~~~~',
        '........',
        '......n.',
        '........',
      ],
      { ...FLEE, moveLimit: 12, kingPen: ['e6'] },
    ),
    // ── L4 — THE LID (boulder KEY). Two gaps, two roads, and a pen two
    // squares wide: she holds one file, he steps to the other, forever. Drop a
    // stone on the square he is about to run to. DECISION: shut his other door.
    level(
      4,
      [
        '..oo.oo.',
        '........',
        '###.K###',
        '###..###',
        '~~~..~~~',
        '........',
        '........',
        '........',
      ],
      { ...FLEE, moveLimit: 12, kingPen: ['d6', 'e6'] },
    ),
    // ── L5 — THE CORK (avalanche KEY). The gap is there and a loose stone
    // stands on the road above it, with one alcove beside it (d5). West rolls
    // it in. South leaves it on the road, in the gap. DECISION: west, not south.
    level(
      5,
      [
        '..ooo...',
        '...o....',
        '####K###',
        '###.o###',
        '~~~~.~~~',
        '........',
        '..n.....',
        '........',
      ],
      { ...FLEE, moveLimit: 12, kingPen: ['e6'] },
    ),
    // ── L6 — THE SENTRY (avalanche KEY). The road turns a corner at c5 and a
    // pawn on b6 — pinned by the rib under it — watches that corner. A stone
    // hangs over the pawn. South. DECISION: crush what watches the corner.
    level(
      6,
      [
        '.ooo.oo.',
        '.o......',
        '#p######',
        '##....K#',
        '~~.~~~~~',
        '........',
        '........',
        '........',
      ],
      { ...FLEE, moveLimit: 12, kingPen: ['g5'] },
    ),
    // ══ L7 — TWO STONES, TWO JOBS ══════════════════════════════════════════
    // DECISION: one stone to sink, one stone to shut.
    level(
      7,
      [
        '#oooooo#',
        '##o.#.o#',
        '#####.##',
        '##...K##',
        '~~~~~~~~',
        '##.#####',
        'n..#####',
        '...#####',
      ],
      { ...FLEE, moveLimit: 6, kingPen: ['f5', 'f6'] },
    ),
    // ══ L8 — ONE SHOUT, TWO FORDS ══════════════════════════════════════════
    // DECISION: both stones are ammunition; find the niche.
    level(
      8,
      [
        '###oooo#',
        '######.#',
        '####.~K#',
        '~~~~~.~~',
        '####.###',
        '####.###',
        '####.###',
        '#.....##',
      ],
      { ...FLEE, moveLimit: 8, kingPen: ['g6'] },
    ),
    // ══ L9 — THE SCREE SHUTS THE PEN ═══════════════════════════════════════
    // DECISION: north or south — both ford, one shuts him in.
    level(
      9,
      [
        '##o#o###',
        '##o#o###',
        '##.#.###',
        '###K...#',
        '~~~~~~~~',
        '######.#',
        '####.b.n',
        '#####...',
      ],
      { ...FLEE, moveLimit: 6, enemiesPerTurn: 2, kingPen: ['d5', 'c6', 'e6'] },
    ),
    // ══ L10 — THE VEIN ═════════════════════════════════════════════════════
    // DECISION: east or west — which way the cork rolls.
    level(
      10,
      [
        '####oooo',
        '####o.o.',
        '#######.',
        '####...K',
        '###~op##',
        '...~.###',
        '..#~####',
        'n.#~####',
      ],
      { ...FLEE, moveLimit: 8, kingPen: ['h5', 'h6'] },
    ),
  ],
};

export default RUN_REVENGE_62;
