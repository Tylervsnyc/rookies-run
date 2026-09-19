/**
 * revenge-53 — THE PAWNSHOP. Built 2026-09-19 (ten-run batch) as the
 * ABILITY-FIRST run for PROMOTE. Signature pair CONVERT + PROMOTE.
 * Kit = convert / promote / magnet / hourglass (`allowedAbilities` IS the kit).
 *
 * THE VERB: STEAL IT, THEN CHANGE WHAT IT IS. Convert puts a body of hers
 * inside his court, but the body is a PAWN in a stone box: it cannot march
 * (stone above), it cannot be reached (stone all round) and it attacks two
 * squares that are stone. Promote turns it into a KNIGHT — the one piece in
 * the game that does not care what a case is made of. Which case she steals
 * from decides which squares that knight will attack, and that is the whole
 * run: the shop is full of pawns and exactly one of them is worth having.
 *
 * WHY THIS PAIR, read out of lib/run/abilities.ts:
 *   - CONVERT (T1): one charge, ANY enemy pawn on the board, no line and no
 *     range. The stolen man is a controlled summon and is DAZED the turn he
 *     is taken. A pawn of hers moves toward rank 8 and captures diagonally
 *     forward (the king included).
 *   - PROMOTE (T1-T2): one charge, a free action, one rung: pawn -> knight.
 *     "Only the type changes": the daze stands. A promote-then-capture in one
 *     turn gives the king no reaction; a promote on the turn of the theft
 *     leaves a dazed knight he can SEE (`controlledThreatensSquare` never
 *     consults `dazed`), and he steps away from it.
 *   - Fillers. MAGNET and HOURGLASS are the only two cards found that read 0%
 *     on every finale here. Rejected with numbers (12-32 trials): AEGIS 100%
 *     and DECOY 28% on L9 (both let her walk up BESIDE him: the shield freezes
 *     his swing, and under a live Decoy mark the whole court, his swing
 *     included, plans against the mark), BOULDER 100% and SNARE 100% on L5/L9.
 *     Any level with a road and a two-square pen is soloed by most of the pool.
 *
 * ── CONSTANT SIGNATURE — THE PAWNSHOP ──────────────────────────────────────
 *   1. THE CASES. His pawns stand in 1x1 display cases: all four orthogonal
 *      neighbours are blocked. No rook line reaches one, the pawn can never
 *      march, and a stolen pawn can never be crowned (the square above it is
 *      never open ground). Every case is `fixed` stone or a lava island.
 *   2. THE COUNTER. A band of LAVA separates her floor from his shop on every
 *      level from L2 on. She never crosses it except by a marked door.
 *   3. THE BACK ROOM. His cell is sealed on every line; from L6 on nothing of
 *      hers but a knight can ever touch his square.
 *   4. THE FLOOR WALKER (L7-L10). A QUEEN patrols her floor. One body-move per
 *      turn means every turn Rookie spends running is a turn the stolen man
 *      does not move, so each finale floor has one square the queen cannot
 *      attack (a booth, or the road itself) and the approach is: get her
 *      safe, THEN run the job.
 *
 * TERRAIN EXPERIMENT (this batch): stone display cases, plus lava used as
 * furniture rather than as a moat — a full-width lava COUNTER with a door
 * (L2, L4, L5, L9), a single lava VENT on her own start rank that denies the
 * one start file which would be a free win (L5), cases drawn as 1x1 ISLANDS
 * in a lava lake instead of boxes in stone (L6), a lava sea eating one flank
 * of the shop (L8) and a lava moat round the back room (L10). Honest note:
 * nothing in this kit distinguishes lava from stone mechanically (no Shove,
 * Eruption, Puppet, Avalanche here), so the lava is silhouette and fiction,
 * not rules. Every stone is `fixed`.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none       — the shop window. Two cases, a still king on her floor.
 *   L2  none       — the counter and its door; he is at the end of the aisle.
 *   L3  CONVERT KEY — a case diagonally under his cell: the stolen PAWN takes
 *                    him. (Teaches: a stolen man can strike, next turn.)
 *   L4  MAGNET KEY  — a defended knight corks the aisle; pull it out of its
 *                    defenders' reach and take it. The pair is a second
 *                    answer (its defenders stand on knight-squares of his
 *                    cell) so a pair-only hand is not walled here.
 *   L5  CONVERT KEY — two-square pen and a side road. The stolen pawn covers
 *                    the square he runs to; ROOKIE takes him. (Teaches: a
 *                    stolen man can be a cage bar.)
 *   L6  THE PAIR, plainly — the first level Promote is needed, no pressure.
 *                    (Promote cannot be a single-card key: alone it has no
 *                    target, 0% on all ten levels by construction.)
 *   L7-L10 the pair. MAGNET and HOURGLASS are traps on all four.
 *
 * ── THE FOUR FINALE LINES ──────────────────────────────────────────────────
 *   L7  THE BEAT. King g8, pen g8/h8. Cases b6, d6, f6; only f6 is a knight's
 *       move from g8. Promote on the turn of the theft and he SEES a knight
 *       and steps to h8, which f6 can never attack: the job is dead.
 *       Line: Convert f6, R to h1 (booth). Next turn Promote f6, Nf6xg8.
 *       DECISION: when to promote — wait one beat.
 *   L8  THE FENCE. King c8, pen b8/c8. A BISHOP under glass on d6, the one
 *       knight-square of c8 that is not stone. A pawn cannot take it (not on
 *       its diagonal); a knight from f5 or b5 can, and the capture STUNS him,
 *       which is the only reason he is still on c8 a turn later.
 *       Line: Convert f5 + Promote at once, R to a1. Nf5xd6. Nd6xc8.
 *       A floor knight can jump at the booth, so the booth has a clock.
 *       DECISION: promote FIRST — the knight does the robbing.
 *   L9  THE BAR. King e8, pen d8/e8, and for the only time in the finale a
 *       road for HER (h-file, along rank 5, up the e-file). Bare, he steps to
 *       d8 and sits there for ever. The c6 case is a knight's move from d8,
 *       not from e8: the body is a bar, not a blade.
 *       Line A: Convert c6 + Promote (Nc6 covers d8). Rh-file, Rh5, Re5 —
 *       he has nowhere to go — Rxe8.
 *       Line B (the bot's): Convert c6. Rh-file, Rh5, Re5, he runs to d8;
 *       Promote + Nc6xd8. The h7 case is a trap (its knight only blocks the
 *       road). Two enemy actions per turn, a knight watching h4.
 *       DECISION: steal beside the square he will RUN to, not where he is.
 *  L10  THE HEIST. King d8, pen c8/d8, behind a lava moat. No case is a
 *       knight's move from him, but a knight of HIS is, boxed on e6 — and the
 *       f5 pawn takes e6 on its diagonal. a5xb6 is the wrong robbery (b6 looks
 *       at c8, the square he is not on). The booth is h3, two moves away.
 *       Line: Convert f5, R toward h3. f5xe6. Promote e6, Ne6xd8.
 *       DECISION: rob as a PAWN to get onto the square, then promote.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, `revenge.ts matrix` ──────────
 * Numbers of record: 32 trials, `--jobs=2` (shared machine), T1 cards.
 *
 *   L    none  convert  promote  magnet  hourglass | convert+promote
 *   7      0%     0%       0%      0%       0%     |      94%
 *   8      0%     0%       0%      0%       0%     |      78%
 *   9      0%     0%       0%      0%       3%     |      75%
 *  10      0%     0%       0%      0%       0%     |      69%
 *
 * The gate is met on all four; L7 is ABOVE the 60-80 band and ships there.
 * Its line is two body-moves long (one of hers, one of his), so nothing on
 * the floor can cost her the level: every queen square and clock tried read
 * 94-100%. L8-L10 need two or three moves from the stolen man, which is what
 * lets the floor walker bite. What moved the pair number, in order: a queen
 * on the floor with NO booth 19% (L10) -> booth one move away 91% -> booth
 * two moves away 53-69% by queen start square. Bishops and knights alone as
 * hunters, at any clock down to the exact minimum, never moved it off 100%.
 *
 *   L    none  convert  promote  magnet  hourglass | convert+promote
 *   1    100%   100%     100%    100%     100%     |     100%
 *   2    100%   100%     100%    100%     100%     |     100%
 *   3      0%   100%       0%      0%       0%     |     100%
 *   4      0%     0%       0%    100%       0%     |     100%
 *   5      0%   100%       0%      0%       0%     |     100%
 *   6      0%     0%       0%      0%       0%     |     100%
 *
 * TIER LADDER, L6-L10, 16 trials:
 *   convert alone       T2 0/0/0/0/25    T3 0/0/0/0/100   T5 0/0/0/0/100
 *   convert:1+promote:2     100/100/75/94/81
 *   convert:1+promote:3       0/  0/ 0/ 0/ 0
 *   convert:1+promote:5       0/  0/ 0/ 6/ 0
 * `abilityTierCaps: { convert: 1, promote: 2 }`.
 *   CONVERT breaks at T2 on L10 only: T2 steals minors, and the boxed knight
 *   on e6 already stands a knight's move from him. (It has to be a knight: a
 *   bishop or pawn victim would eat the dazed thief on its own diagonal.)
 *   PROMOTE is capped for the opposite reason — see ABILITY NOTE 1.
 *
 * FULL RUNS, 40 runs, T5, normal:
 *   random picks from the whole kit   2/40 =  5%  (L3 40%, L4 44% — the walls
 *                                     are holding Convert by L3, Magnet or
 *                                     the pair by L4)
 *   `--pool=convert,promote`         16/40 = 40%  (L3 65%, then 100/100/100,
 *                                     finale 92/79/95/89)
 *
 * ── ABILITY NOTES (not fixed here — reported) ──────────────────────────────
 * 1. PROMOTE T3+ SKIPS THE KNIGHT, AND THE KNIGHT IS THE CARD. `promoteSteps`
 *    is 2 at T3-T4 and "straight to queen" at T5, and the player cannot choose
 *    fewer rungs. Pawn -> bishop (or queen) inside a sealed case is a piece
 *    with no move at all, so the pair reads 100/100/75/94/81 at T2 and
 *    0/0/0/0/0 at T3. An upgrade removes the card's function (the Hourglass
 *    T3 lesson). Suggested: let the player stop on any rung up to the tier's
 *    reach. Until then this run caps Promote at T2.
 * 2. A DAZED summon still frightens him (by design, documented for summoning
 *    sickness). With Promote it is the run's best wrinkle (L7), so keep it.
 * 3. Under a live DECOY mark the king does not swing at a Rookie standing
 *    beside him (the court plans against the mark's view). Decoy therefore
 *    solos any level with a road to his door. Not a bug in this run (Decoy is
 *    not in the kit) but it contradicts "the king always swings".
 *
 * ── DEAD ENDS ──────────────────────────────────────────────────────────────
 * 1. THE WALK IS UNFINDABLE. First L8: steal a pawn, march it one square onto
 *    a knight-square, promote, hop. Pair 0/12; the bot never even cast
 *    Convert. A quiet pawn step does not move `fastScore`, so no rollout ever
 *    plays it (ROLLOUT_TOPK = 3) and the theft never pays inside a rollout.
 *    A CAPTURE in the same slot is found at once (+material, +stun): that is
 *    why L8 and L10 are robberies. For a human the walk is a fair puzzle.
 * 2. A CASE ON A KNIGHT-SQUARE OF WHERE HE STANDS IS ALWAYS L7. The first L9
 *    had a "trap" case on g7; the bot stole it, waited a beat and hopped,
 *    100%, no road needed. A bar level may only offer cases that look at the
 *    square he runs TO.
 * 3. A STRAIGHT ROAD IS A FREE WIN FROM ONE START FILE (8-17% bare on the
 *    first L9). Bend it (L9) or put a lava vent on its foot (L5).
 */

import { FLEE, LAVA, STILL, X, make, type RunDef } from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

/**
 * THE FLOOR PLAN. Every level is drawn as eight strings, rank 8 first, file a
 * on the left — so the silhouette in this file IS the silhouette on the board.
 *   '#' fixed stone   '~' lava   '.' open ground
 *   'K' his king      'p' pawn   'n' knight   'b' bishop   'q' queen
 */
const PIECE: Record<string, EnemyPiece['type']> = { K: 'king', p: 'pawn', n: 'knight', b: 'bishop', q: 'queen' };

function plan(rows: string[]): { pieces: EnemyPiece[]; hazards: Hazard[] } {
  if (rows.length !== 8 || rows.some((r) => r.length !== 8)) {
    throw new Error(`revenge-53: a floor plan is 8 rows of 8, got ${JSON.stringify(rows)}`);
  }
  const pieces: EnemyPiece[] = [];
  const hazards: Hazard[] = [];
  rows.forEach((row, i) => {
    const rank = 8 - i;
    [...row].forEach((ch, j) => {
      const file = j + 1;
      if (ch === '#') hazards.push({ ...X(file, rank), kind: 'stone', fixed: true });
      else if (ch === '~') hazards.push(LAVA(file, rank));
      else if (PIECE[ch]) pieces.push({ type: PIECE[ch], color: 'black', file, rank });
      else if (ch !== '.') throw new Error(`revenge-53: unknown plan glyph "${ch}"`);
    });
  });
  return { pieces, hazards };
}

type Opts = NonNullable<Parameters<typeof make>[2]>;
const level = (n: number, rows: string[], opts: Opts) => {
  const { pieces, hazards } = plan(rows);
  return make(n, pieces, { ...opts, hazards });
};

export const RUN_REVENGE_53: RunDef = {
  id: 'revenge-53',
  name: 'The Pawnshop',
  blurb:
    'His pawns sit in stone display cases where no rook can reach them and no pawn can march. Steal one and it is yours, but it is still a pawn in a box. Promote it and it is a knight, and a knight does not care what the box is made of. Every case looks at different squares. One of them is worth having.',
  allowedAbilities: ['convert', 'promote', 'magnet', 'hourglass'],
  abilityTierCaps: { convert: 1, promote: 2 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 THE SHOP WINDOW — free. DECISION: find a line to a still king.
    // Two plus-shaped cases on an open floor; their pawns bite a5/c5 and e5/g5.
    level(
      1,
      [
        '........',
        '.#...#..',
        '#p#.#p#.',
        '.#...#..',
        '...K....',
        '........',
        '........',
        '........',
      ],
      { ...STILL, moveLimit: 12 },
    ),
    // L2 THE COUNTER — free. DECISION: walk the aisle through the counter's door.
    // A knight on the floor costs her a move or gives her a capture.
    level(
      2,
      [
        '####K###',
        '#p#..#p#',
        '.#....#.',
        '~~~..~~~',
        '........',
        '....n...',
        '........',
        '........',
      ],
      { ...FLEE, moveLimit: 14, kingPen: ['e8'] },
    ),
    // L3 THE FIRST THEFT (convert KEY). DECISION: steal the pawn that already attacks him.
    // d7 is diagonally under his cell: Convert d7, next turn d7xe8. b6/g6 are
    // window dressing.
    level(
      3,
      [
        '####K###',
        '###p####',
        '#p####p#',
        '~~~~~~~~',
        '........',
        '........',
        '........',
        '........',
      ],
      { ...FLEE, moveLimit: 8, kingPen: ['e8'] },
    ),
    // L4 THE DOORMAN (magnet KEY; the pair is a second answer). DECISION: pull
    // the cork out from between its defenders. Knight e5 sits in the counter's
    // door, defended by d6 and f6, every square it could jump to is stone. From
    // e1-e3 pull it down the aisle, take it there, and the e-file is hers.
    level(
      4,
      [
        '####K###',
        '####.###',
        '###p.p##',
        '~~~~n~~~',
        '####.###',
        '####.###',
        '####.###',
        '##....##',
      ],
      { ...FLEE, moveLimit: 10, kingPen: ['e8'] },
    ),
    // L5 THE BAR (convert KEY). DECISION: cover his flee square, then threaten him.
    // Pen b8/c8, road up the b-file. The d7 pawn, once hers, attacks c8. The lava
    // vent on b1 denies the one start file that would be a free first-move win.
    level(
      5,
      [
        '#K.#####',
        '#.#p####',
        '#.######',
        '~.~~~~~~',
        '........',
        '........',
        '........',
        '.~......',
      ],
      { ...FLEE, moveLimit: 10, kingPen: ['b8', 'c8'] },
    ),
    // L6 THE APPRAISAL (the pair, plainly). DECISION: which island's pawn becomes the knight.
    // Cases are 1x1 islands in a lava lake. c6 is a knight's move from b8; f6 is
    // not. One-square pen, no floor walker, no clock pressure.
    level(
      6,
      [
        '#K######',
        '~~~~~~~~',
        '~~p~~p~~',
        '~~~~~~~~',
        '........',
        '........',
        '........',
        '........',
      ],
      { ...FLEE, moveLimit: 8, kingPen: ['b8'] },
    ),
    // L7 THE BEAT. DECISION: steal now, promote NEXT turn, never both at once.
    level(
      7,
      [
        '######K.',
        '########',
        '#p#p#p##',
        '########',
        '~~~~~~~~',
        '........',
        '..q...##',
        '........',
      ],
      { ...FLEE, moveLimit: 5, kingPen: ['g8', 'h8'] },
    ),
    // L8 THE FENCE. DECISION: promote first; the knight robs the bishop's case.
    level(
      8,
      [
        '#.K###~~',
        '#####~~~',
        '###b##~~',
        '#p###p#~',
        '~~~~~~~~',
        '.....n..',
        '##.....q',
        '........',
      ],
      { ...FLEE, moveLimit: 6, kingPen: ['b8', 'c8'] },
    ),
    // L9 THE BAR. DECISION: steal beside where he runs, not where he stands.
    level(
      9,
      [
        '###.K###',
        '####.##p',
        '##p#.###',
        '####....',
        '~~~~~~~.',
        'q.......',
        '......n.',
        '........',
      ],
      { ...FLEE, moveLimit: 6, enemiesPerTurn: 2, kingPen: ['d8', 'e8'] },
    ),
    // L10 THE HEIST. DECISION: rob as a pawn, then promote on the spot.
    level(
      10,
      [
        '~~.K~~~~',
        '~~~~~~~~',
        '#n##n###',
        'p####p##',
        '~~~~~~~~',
        '........',
        'q.....##',
        '......##',
      ],
      { ...FLEE, moveLimit: 6, kingPen: ['c8', 'd8'] },
    ),
  ],
};

export default RUN_REVENGE_53;
