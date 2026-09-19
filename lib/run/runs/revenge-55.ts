/**
 * revenge-55 — THE CRYPT. Built 2026-09-19 (the ten-run batch) for the
 * signature pair RAISE + SACRIFICE. Kit = raise / sacrifice / shove /
 * hourglass (`allowedAbilities` IS the kit). ABILITY-FIRST: the levels exist
 * to show off Raise.
 *
 * THE VERB: WHAT YOU EAT IS WHAT EXPLODES. Raise stands the LAST piece she
 * captured up beside her; Sacrifice detonates a summon in the shape it moves
 * (pawn = its two forward diagonals, knight = its 8 jumps, bishop = 4
 * diagonals x 2 — blockers IGNORED, the blast goes through stone and over
 * lava). Both are free actions. So the level decides the corpse, the corpse
 * decides the shape, and the shape decides the ONE square she has to be
 * standing next to. The kill is always: eat, stand, raise, burn, take — and
 * the last three happen in one turn.
 *
 * WHY THE PAIR, read out of lib/run/abilities.ts:
 *   - RAISE (T1): one charge, `graveOf` = the LAST credited capture, spawn on
 *     a free square beside her, DAZED the turn it stands up, 6 enemy turns.
 *   - SACRIFICE (T1): one charge, a free action on any controlled summon —
 *     a dazed one included — `sacrificeBlastSquares`, reach 2, no blockers.
 *     Any victim stuns him a turn.
 *   - Alone, Sacrifice has nothing to burn (0% everywhere, every tier), and a
 *     raised body alone can only SUICIDE into a door that a second mourner
 *     then re-corks, or gets eaten overnight (L10).
 *   - SHOVE refuses `fixed` stone, and every wall, lid and coffin in this run
 *     is `fixed`; the only loose stone in the run is the rubble in L4's
 *     doorway. HOURGLASS is the catalogue's proven pure trap.
 *
 * ── CONSTANT SIGNATURE — THE CRYPT ─────────────────────────────────────────
 * Carved out of solid masonry (12-25 open squares a level). Every level draws:
 *   1. THE TOMB   — his bed on rank 8, stone on every side but the nave.
 *   2. THE NAVE   — one file up to him (two on the 1x2-tomb levels).
 *   3. THE DOOR   — from L6 on, a piece standing in the nave with TWO MOURNERS
 *                   (pawns) on the rank above watching it. Take the door and a
 *                   mourner takes you; trade a body for it and the mourner
 *                   re-corks it with the other still watching. Every door
 *                   piece and every coffin occupant is IMMOBILE by
 *                   construction — all its move squares are stone, lava or
 *                   its own side — so nothing in a coffin ever wanders.
 *   4. THE COFFINS — sealed 1x1 / 1x2 cells off the nave with one open end,
 *                   a body inside. Which coffins are open is which corpse she
 *                   can have. L9 stacks two bodies in one upright 1x2 coffin.
 * TERRAIN EXPERIMENT: `fixed` masonry vs loose rubble as a designed
 * distinction (rubble exists once, as L4's whole puzzle); sealed cells whose
 * occupant still guards through the wall (L10's h6 pawn, the mourners);
 * lava as a FONT flanking the tomb (L9) and as GUTTERS down both sides of
 * the nave (L10) that the knight's blast flies over.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none      — the crypt, drawn. His tomb has no door yet.
 *   L2  none      — a door with no mourners: take it, take him.
 *   L3  RAISE KEY — a 1x2 tomb, two naves; a lone rook can never close it.
 *                   The raised knight watches one bed while she takes the other.
 *   L4  SHOVE KEY — loose rubble in the doorway. The only movable stone in
 *                   the run; push it aside from f6.
 *   L5  RAISE KEY — no rank or file touches him at all; one diagonal does.
 *                   Eat the bishop, stand it on the diagonal, it takes him.
 *   L6  THE PAIR, taught — first mourned door. A pawn marches down the nave
 *                   into her mouth; its blast is two forward diagonals.
 *   L7-L10 the pair. SHOVE / HOURGLASS / SACRIFICE are traps on all four.
 *
 * ── THE FOUR FINALE LINES (as built) ───────────────────────────────────────
 *   L7  THE MOURNERS. K e8, door N e6, mourners d7 f7, corpse B f5 in the
 *       niche beside the nave head. e1-e5, e5xf5, f5-e5, RAISE d5 (or f5),
 *       SACRIFICE (bishop: e6 + the far mourner), e5xe8 — all one turn.
 *       A knight hunts the lower hall; its grave is useless here (every
 *       knight-square of e6 is stone), so eating it LAST ruins the grave.
 *       DECISION: none — the plain statement. Blow the door from the file.
 *   L8  THE LID. K c8, door B c6, mourners b7 d7. b5/d5 are stone, so nothing
 *       stands diagonally under the door: the bishop must burn from e4, two
 *       squares out, THROUGH the lid on d5. c1-c4, c4xg4, g4-d4, RAISE e4,
 *       SACRIFICE (d5 lid ignored, c6 dies), d4-c4, c4xc8. Three corpses are
 *       on offer and the grave keeps the last: the bishop works from e4, the
 *       hunting knight works from d4, the pinned pawn on d3 works from
 *       nowhere (b5/d5 are stone) — eat it last and the level is lost.
 *       DECISION: which body, and therefore which square.
 *   L9  THE DOUBLE COFFIN. 1x2 tomb d8/e8 between lava fonts, two naves, NO
 *       door — and no way to hold him: he steps to the other bed for ever.
 *       One upright coffin holds two pawns, g6 under g7. e1-e6, e6xg6, RAISE
 *       f6, SACRIFICE (pawn: e7 + g7 — the cellmate dies, he is stunned),
 *       g6-d6, d6xd8. The blast opens nothing. It is only there for the stun.
 *       DECISION: the blast is a stun, not a door — burn first, THEN arrive.
 *  L10  THE WAKE. Two doors in series, B e6 and B e4, each with its own pair
 *       of mourners, lava gutters down both sides. Only a knight forks them,
 *       and only from g5 — a square the sealed pawn on h6 watches, so a body
 *       left there overnight is eaten. h1xh4 (the knight in the open coffin),
 *       RAISE g5 + SACRIFICE in the same breath (e6, e4 and f7 die),
 *       h4-h1, h1-e1, e1xe8. A second knight hunts the hall.
 *       DECISION: one blast, two doors, and the body cannot wait a turn.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, `revenge.ts matrix` ──────────
 * Numbers of record: 32 trials, `--jobs=2` (machine shared by ten authors),
 * T1 cards, T5 bot.
 *
 *   L    none  raise  sacrifice  shove  hourglass | raise+sacrifice
 *   7      0%     0%       0%      0%       0%    |      100%
 *   8      0%     3%       0%      0%       0%    |       59%
 *   9      0%     0%       0%      0%       0%    |      100%
 *  10      0%     0%       0%      0%       0%    |       63%
 *
 * THE GATE IS CLEAN on the singles (19 cells of zero, worst 3%). The PAIR is
 * honest but not in band on two levels: L7 and L9 read 100%. Both are fully
 * static boards with a 4-6 move line, and the bot plays a static board
 * perfectly — the clock has no middle (L9: 100% at 6 moves with a 6-move
 * line; L8 without its hunter read 100% at 8 and 16% at 6). The only lever
 * that produced a middle was a HUNTER (L8 100 -> 59-69, L10 100 -> 63), and
 * L9 cannot take one: on a two-nave board any mobile piece that steps onto a
 * nave is a free key (none read 44% with a bishop or knight loose). L7 kept
 * 100% even with a hunter and a 5-move clock. I left L7 one move of slack
 * (it is the statement level) and L9 at zero slack.
 *
 * TIER LADDER, L7-L10, 32 trials:
 *   raise      T1 0/3/0/0   T2 0/0/0/0   T3 0/25/0/0   T4 0/31/0/0  T5 0/22/0/0
 *   sacrifice  T5 0/0/0/0   shove T3 0/0/0/0  T5 0/0/0/0   hourglass T5 0/0/0/0
 * `abilityTierCaps: { raise: 2 }` — T3 is Raise's SECOND USE (and queens),
 * and on L8 two bodies out of three corpses break the door alone.
 *
 * MID-RUN, 16-32 trials:
 *   L    none  raise  sacrifice  shove  hourglass  pair
 *   1    100%   100%     100%    100%     100%     100%
 *   2    100%   100%     100%    100%     100%     100%
 *   3      0%    84%       0%      0%       0%      31%   (raise KEY)
 *   4      0%     0%       0%    100%       0%       0%   (shove KEY)
 *   5      0%   100%       0%      0%       0%     100%   (raise KEY)
 *   6      0%     0%       0%      0%       0%     100%   (the pair, taught)
 * L3's pair column is a BOT artifact, not a level property: holding
 * Sacrifice as well, the search splits its budget and stops fetching the
 * knight (raise+shove+hourglass reads 81% on the same board).
 *
 * FULL RUNS, T5, normal: random picks from the kit 0/24; pool
 * raise,sacrifice,shove 3/40 (L3 48%, L4 37%, L6 57%, then L7-L10
 * 100/75/100/100). The ladder is a hard filter BEFORE the finale: L3, L4, L5
 * and L6 each demand one specific card, and a random picker takes Hourglass.
 * A thinking player skips the obvious dud and holds the other three by L4.
 * Several of those mid-run losses are `dead-end` — see the bug below.
 *
 * ── DEAD ENDS / WHAT THE BOTS TAUGHT ───────────────────────────────────────
 * 1. DECOY CANNOT SHARE A KIT WITH A MOURNED DOOR. First kit had decoy: it
 *    read 100% alone on every door level. The KING eats a mark beside him
 *    and walks out of his tomb; a mourner eats a marked door and the pawn
 *    that re-corks it then MARCHES off its defended square; a knight door
 *    hops out to eat a marked corpse. Swapped for Shove, which `fixed`
 *    stone makes inert by construction.
 * 2. NOTHING IN A COFFIN MAY HAVE A LEGAL MOVE. Every early leak was a door
 *    or corpse that found one open square (a knight door hopping to the
 *    empty niche; a bishop door sliding out when a mourner recaptured and
 *    vacated its diagonal). Knights within two files of a nave always touch
 *    it. Check all eight squares, every time.
 * 3. THE CORPSE MUST BE BESIDE THE NAVE HEAD. The bot shuffles on the
 *    reachable square nearest the king (the Oubliette rule) and will not
 *    walk three ranks down a side arm for a body: 0% -> 100% by moving the
 *    coffin to the head of the nave. And a corpse a door-knight can jump to
 *    is DEFENDED — she will not eat it.
 * 4. A KNIGHT BODY KILLS HIM THROUGH HIS OWN MOURNERS. f6/d6 are knight
 *    squares of e8: a mourner standing there is a stepping stone (raise
 *    alone 100% on an early L10). And the square under a door is a knight
 *    square of both mourners — a raised knight eats a mourner, the door
 *    recaptures, the nave is open (raise alone 33% on the first L7).
 * 5. START SQUARES ON A NAVE ARE A FREE WIN on the two-nave levels (none 25%
 *    on the first L9) — the naves start at rank 2 there.
 *
 * ENGINE BUG FOUND (not fixed — reported): RAISE CAN SOFT-LOCK HER.
 * `raiseSpawnSquares` offers every free square beside her with no strand
 * check (Boulder / Eruption / Catapult / Avalanche all refuse a cast that
 * leaves her no move). In a one-wide dead end — Rookie on h6, walls all
 * round, only exit h5 — Raise on h5 puts a DAZED body on her only exit:
 * zero legal Rookie moves and the body cannot move this turn either. The
 * harness files it as `dead-end`; a player would be stuck.
 */

import {
  FLEE,
  STILL,
  bishop,
  king,
  knight,
  make,
  pawn,
  type RunDef,
} from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

/**
 * THE FLOOR PLAN. Every level is drawn as eight strings, rank 8 first, files
 * a-h left to right (spaces ignored):
 *   #  masonry — `fixed` stone (crypt walls, sarcophagus sides and lids)
 *   o  rubble  — loose stone
 *   ~  lava    — a font / gutter of fire
 *   .  open floor
 *   k p n b    his pieces
 */
function plan(rows: string[]): { pieces: EnemyPiece[]; hazards: Hazard[] } {
  const pieces: EnemyPiece[] = [];
  const hazards: Hazard[] = [];
  if (rows.length !== 8) throw new Error('revenge-55: a plan is 8 ranks');
  rows.forEach((raw, i) => {
    const row = raw.replace(/\s+/g, '');
    if (row.length !== 8) throw new Error(`revenge-55: rank ${8 - i} is not 8 wide: "${raw}"`);
    const r = 8 - i;
    [...row].forEach((ch, j) => {
      const f = j + 1;
      if (ch === '#') hazards.push({ file: f, rank: r, fixed: true });
      else if (ch === 'o') hazards.push({ file: f, rank: r });
      else if (ch === '~') hazards.push({ file: f, rank: r, kind: 'lava' });
      else if (ch === 'k') pieces.push(king(f, r));
      else if (ch === 'p') pieces.push(pawn(f, r));
      else if (ch === 'n') pieces.push(knight(f, r));
      else if (ch === 'b') pieces.push(bishop(f, r));
      else if (ch !== '.') throw new Error(`revenge-55: unknown plan glyph "${ch}"`);
    });
  });
  return { pieces, hazards };
}

type Opts = NonNullable<Parameters<typeof make>[2]>;
const level = (n: number, rows: string[], opts: Opts) => {
  const { pieces, hazards } = plan(rows);
  return make(n, pieces, { ...opts, hazards });
};

export const RUN_REVENGE_55: RunDef = {
  id: 'revenge-55',
  name: 'The Crypt',
  blurb:
    'Stone coffins, sealed. His tomb has one door and two mourners watching it, so the door cannot be taken — it has to be blown in. Whatever she eats on the way down is what stands up beside her, and the shape it moves in is the shape it explodes in.',
  allowedAbilities: ['raise', 'sacrifice', 'shove', 'hourglass'],
  // Measured L7-L10, 32 trials: raise T1 0/3/0/0, T2 0/0/0/0, T3 0/25/0/0,
  // T4 0/31/0/0, T5 0/22/0/0. T3 is the SECOND USE; L8 offers three corpses
  // and two bodies break its door alone. Sacrifice, Shove and Hourglass read
  // 0% at every tier (nothing to burn / all stone `fixed` / a free wait).
  abilityTierCaps: { raise: 2 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // ── L1 — THE CRYPT. The silhouette, drawn: tomb, nave, coffins. No door yet.
    level(
      1,
      [
        '# # # # k # # #',
        '# # # # . # # #',
        '. . . . . . . .',
        '. # # . . # # .',
        '. . . . . . . .',
        '. # . . . . # .',
        '. # . . . . # .',
        '. . . . . . . .',
      ],
      { ...STILL, moveLimit: 12 },
    ),
    // ── L2 — THE DOOR. A bishop stands in the nave with nobody watching it. Take it, take him.
    level(
      2,
      [
        '# # # # k # # #',
        '# # # # b # # #',
        '# # # # . # # #',
        '. . . . . . . .',
        '. # # . . # # .',
        '. . . . . . . .',
        '# . # . . # . #',
        '. . . . . . . .',
      ],
      { ...FLEE, moveLimit: 12, kingPen: ['e8'] },
    ),
    // ── L3 — THE VIGIL (raise KEY). 1x2 tomb, two naves. Eat the knight in the east coffin, stand it on f6 (it watches e8), take d8.
    level(
      3,
      [
        '# # # k . # # #',
        '# # # . . # # #',
        '# # # . . . . n',
        '# # # . . # # #',
        '# # # . . # # #',
        '# # # . . # # #',
        '# # . . . . # #',
        '# # . # # . # #',
      ],
      { ...FLEE, moveLimit: 12, kingPen: ['d8', 'e8'] },
    ),
    // ── L4 — THE RUBBLE (shove KEY). The one loose stone in the run corks the g-file. Push it from f6 into h6.
    level(
      4,
      [
        '# # # # # # k #',
        '# # # # # # . #',
        '# # # . . . o .',
        '# # # . # # . #',
        '# # # . . . . #',
        '# # # # # # . #',
        '# # # # # # . #',
        '# # # # # . . .',
      ],
      { ...FLEE, moveLimit: 12, kingPen: ['g8'] },
    ),
    // ── L5 — THE DIAGONAL (raise KEY). No rook line touches b8. The bishop in the h3 coffin, raised on f4, takes him down f4-b8.
    level(
      5,
      [
        '# k # # # # # #',
        '# # . # # # # #',
        '# # # . # # # #',
        '# . . . . . . #',
        '# # # # . . . #',
        '# # # # # # . b',
        '# # # # # # . .',
        '# # # # # . . .',
      ],
      { ...FLEE, moveLimit: 12, kingPen: ['b8'] },
    ),
    // ── L6 — THE PALLBEARER (the pair, taught). A pawn walks down the nave; eat it, stand on d5, raise on c5/e5, burn the door d6.
    level(
      6,
      [
        '# # # k # # # #',
        '# # p . p # # #',
        '# # # n # # # #',
        '# # . . . # # #',
        '# # # p # # # #',
        '# # # . # # # #',
        '# # # . # # # #',
        '# # . . . # # #',
      ],
      { ...FLEE, moveLimit: 10, kingPen: ['d8'] },
    ),
    // ── L7 — THE MOURNERS. Bishop corpse f5 beside the nave head; burn the door from the file and take him the same turn.
    level(
      7,
      [
        '# # # # k # # #',
        '# # # p . p # #',
        '# # # # n # # #',
        '# # # . . b # #',
        '# # # # . # # #',
        '# # # # . # # #',
        '# . . . . . . #',
        'n . . . . . . #',
      ],
      { ...FLEE, moveLimit: 6, kingPen: ['e8'] },
    ),
    // ── L8 — THE LID. Three corpses, the grave keeps the last. Bishop from e4 THROUGH the d5 lid; knight from d4; the pawn from nowhere.
    level(
      8,
      [
        '# # k # # # # #',
        '# p . p # # # #',
        '# # b # # # # #',
        '# # . # # # # #',
        '# # . . . . b .',
        '# # . p # # # #',
        '. . . . # # # #',
        'n . . . # # # #',
      ],
      { ...FLEE, moveLimit: 8, kingPen: ['c8'] },
    ),
    // ── L9 — THE DOUBLE COFFIN. No door: two beds. Burn the cellmate for the stun, then arrive.
    level(
      9,
      [
        '# # ~ k . ~ # #',
        '# # ~ . . ~ p #',
        '# # # . . . p #',
        '# # # . . # # #',
        '# # # . . # # #',
        '# # # . . # # #',
        '# # . . . # # #',
        '# # . # . # # #',
      ],
      { ...FLEE, moveLimit: 6, kingPen: ['d8', 'e8'] },
    ),
    // ── L10 — THE WAKE. Two doors, one knight fork from g5 - a square his sealed pawn watches. Raise and burn in one breath.
    level(
      10,
      [
        '# # # # k # # #',
        '# # # p . p # #',
        '# # # # b # # p',
        '# # # p . p . #',
        '# # # ~ b ~ # n',
        '# # # ~ . ~ # .',
        '# . . . . . # .',
        'n . . . . . . .',
      ],
      { ...FLEE, moveLimit: 7, kingPen: ['e8'] },
    ),
  ],
};

export default RUN_REVENGE_55;
