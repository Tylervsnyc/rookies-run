/**
 * revenge-57 — THE DAISY CHAIN. Built 2026-09-19 (the ten-run batch) for the
 * signature pair CHAIN + MAGNET. Kit = chain / magnet / shove / hourglass
 * (`allowedAbilities` IS the kit). Chain is `testing`; this is an
 * ABILITY-FIRST run — the levels exist to show off Chain. The partner was NOT
 * swapped: Magnet gates all four finale levels. It had never gated a level
 * with any partner before this run.
 *
 * THE VERB: LIGHT THE FUSE. A pawn that is defended by a pawn is the oldest
 * lock in chess. Chain turns that lock into a bomb: the defender is always a
 * diagonal NEIGHBOUR of the pawn it defends, so an armed capture kills the
 * recapture before it happens, and whatever else is strung along behind it.
 * What a fuse cannot do is burn through a KNIGHT (not the same family below
 * T3) or jump a GAP. Every finale level is one of those two refusals, and
 * Magnet is the hand that moves one piece one or two squares so the fuse runs.
 *
 * WHY THIS PAIR, read out of lib/run/abilities.ts:
 *   - CHAIN (T1): instant, one charge, armed until end of turn, only
 *     armable when a linking capture is on offer (`canArmChain`). The next
 *     capturing MOVE also kills same-type guards in the victim's
 *     8-neighbourhood, and theirs — 2 links deep. Terrain is irrelevant to
 *     adjacency: the spark jumps lava and stone.
 *   - MAGNET (T1): one charge, the FIRST piece on one of her rook lines at
 *     distance >= 2, pulled up to 2 squares toward her, stopping before her,
 *     a piece or any hazard. A free action — so pull, arm and capture are one
 *     turn, and the king never gets a reaction in between.
 *   - SHOVE and HOURGLASS are the trap fillers. Every stone in the run is
 *     `fixed` and the rest is lava (Shove refuses both), and every pawn in
 *     the run is PINNED (see the signature), so a free enemy turn moves
 *     nothing. Neither is a key anywhere — see the honest note in MEASURED.
 *
 * ── CONSTANT SIGNATURE — THE CHAIN OVER THE LAKE ───────────────────────────
 *   1. THE POSTS. Every pawn stands on a stone post: the square directly in
 *      front of it (below it) is fixed stone, another pawn, or his king. So
 *      nothing in this run ever marches, and the position the player reads
 *      is the position he plays. (Pawn priority is `-rank`; an unpinned pawn
 *      walks into its own chain and lights it for free — DEAD END 1.)
 *   2. THE LAKE. The chain floats on LAVA: every square around the pawns that
 *      is not a post is molten, the outer slab is stone. Lava where the
 *      catalogue has only ever used it as a moat or a river: as the FILL of
 *      the puzzle, with the stone reduced to single posts standing in it. The
 *      two halves of a broken chain are separated by lava, and the spark
 *      jumps it diagonally.
 *   3. HIS LINE. One rook line enters his room and one of his men stands on
 *      it (the TAIL). The tail is always covered — by a pawn, which Chain
 *      can burn, or by a sealed KNIGHT, which it cannot.
 *   4. THE SEALED KNIGHT — the odd piece. Every square it could jump to is
 *      stone, lava or its own side, so it never moves until Magnet moves it.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none       — the chain, drawn, irrelevant.
 *   L2  none       — an uncovered man on his line: capture = stun, take him.
 *   L3  CHAIN or MAGNET — the covered blocker. Chain burns the cover with the
 *                    blocker; Magnet drags the blocker out from under it.
 *   L4  CHAIN or MAGNET — two doors. Magnet DELIVERS a victim onto his file
 *                    (capture it there = stun with a line); Chain eats the
 *                    covered pawn on his rank.
 *   L5  CHAIN or MAGNET — the fuse proper. Chain: take the HEAD, the tail on
 *                    his line dies two links away. Magnet: take the head
 *                    plainly, then drag the tail out of its cover.
 *   L6  CHAIN or MAGNET — the brick. Six men go up in one capture.
 *   L7-L10 the pair. Every single card 0%.
 *   Every mid-run level takes EITHER half on purpose: offers land on L1, L3
 *   and L6, so a player holds two cards through L3-L5. The first build keyed
 *   L3 on Chain, L4 on Magnet and L5 on Shove and cleared 1/40 full runs —
 *   three different keys demanded of a two-card hand (DEAD END 4).
 *   SHOVE and HOURGLASS are traps on all ten levels.
 *
 * ── THE FOUR FINALE LINES ──────────────────────────────────────────────────
 *   L7  THE MISSING LINK (Magnet's target: a BRIDGE pawn). Chain a6-b5-c4
 *       runs down to his rank and stops; the tail e4 stands on his line two
 *       files on, covered by a sealed knight (g5). The link that would join
 *       them, e5, sits one square too far east, itself knight-covered (f7).
 *       d1-d5, d5-c5. Then in one turn: Magnet e5 -> d5, arm Chain, c5xc4.
 *       b5 and d5 die at link 1, a6 and e4 at link 2. She stands on c4 with
 *       d4-e4 empty and him stunned on f4. c4xf4.
 *       Chain alone: c4 has no link to e4. Magnet alone: every capture is
 *       covered. DECISION: which pawn closes the gap, and from where.
 *
 *   L8  THE ODD GUARD (Magnet's target: the KNIGHT). The fuse c4-d3-e4 is
 *       whole, but the head c4 is covered by a sealed knight on b6 and Chain
 *       cannot burn a knight. b1-b4. One turn: Magnet b6 -> b5 (from b5 it
 *       no longer sees c4), arm Chain, b4xc4 — d3 and e4 die. c4xf4.
 *       Chain alone: the knight retakes on c4. Magnet alone: take c4 safely,
 *       then e4 is still covered by f5. DECISION: pull the guard, not a link.
 *
 *   L9  THE SLIDER (Magnet's target: the HEAD itself). Row c4-d4 on his rank
 *       with c5 above; the head c4 is covered by a sealed knight (e5). a1-a4.
 *       One turn: Magnet c4 -> b4 — out of the knight's cover and into the
 *       PAWN's (c5 covers b4), which is exactly the cover Chain burns. Arm,
 *       a4xb4: c5 at link 1, d4 at link 2. b4xe4.
 *       Chain alone: the knight retakes on c4. Magnet alone: c5 retakes on
 *       b4. DECISION: trade a cover you cannot burn for one you can.
 *
 *  L10  THE ODD LINK (order reversed, two turns; Magnet's target: the knight
 *       as a VICTIM). A 2x2 brick d4-e4-e5(-f6) and a sealed knight on f4.
 *       c1-c4. Turn one: arm Chain, c4xd4 — e4, e5 and f6 go with it, and his
 *       FILE is suddenly open under him, but she is on d4, not on it, and
 *       stepping onto e4 un-stunned sends him to d7 for good. Turn two:
 *       Magnet f4 -> e4 (the odd link, delivered onto his file), d4xe4 =
 *       stun with a line. e4xe6.
 *       Chain alone: nothing left to capture on his file. Magnet alone: d4
 *       is covered and nothing else is on a line. DECISION: Chain first, and
 *       do not show him the line until he is stunned.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, `revenge.ts matrix` ──────────
 * Numbers of record: 32 trials, `--jobs=2`, T5 bot, T1 cards, the run's kit.
 *
 *   L    none  chain  magnet  shove  hourglass | chain+magnet
 *   7      0%     0%     0%     0%      0%     |     97%
 *   8      0%     0%     0%     0%      0%     |    100%
 *   9      0%     0%     0%     0%      0%     |    100%
 *  10      0%     0%     0%     0%      0%     |     91%
 *   Cross pairs (32 trials): chain+shove, chain+hourglass, magnet+shove,
 *   magnet+hourglass all 0/0/0/0 — chain+magnet is the UNIQUE answer.
 *
 * THE GATE HOLDS AND THE PAIR IS TOO EASY FOR THE BOT. 20 cells of zero, one
 * winning pair — but 97/100/100/91 is above the 60-80 band, and I could not
 * bring it down honestly. The reason is structural: every finale resolves in
 * ONE turn of free actions ending in a capture (the only shape this bot finds
 * — Glasshouse rule), on a carved board with a one-way road, so the bot either
 * sees it or does not. The clock is not a lever (lines are 4-5 moves; L7-L10
 * read identically at the minimum move count and at +1). A roaming hunter is
 * not a lever either: opened to give a knight room, L7 read 0% at three
 * clocks because the bot parks under the king on the open floor (DEAD END 3).
 * The L7 / L10 losses are the one honest trap in the geometry — stepping onto
 * his open line before he is stunned, after which he never comes back.
 *
 * TIER LADDER, L7-L10, 32 trials, single cards:
 *   chain    T1 0/0/0/0  T2 0/0/0/0  T3 0/100/100/0  T4 0/100/100/0  T5 0/97/100/0
 *   magnet   T1-T5 0/0/0/0 at every tier (T5 may even yank the king: still 0)
 *   shove T5 0/0/0/0     hourglass T5 0/0/0/0
 * `abilityTierCaps: { chain: 2 }`. The break is T3, where pawn = knight
 * becomes one family AND the card gains its second use: on L8 and L9 the
 * sealed knight is then just another link. L7 and L10 survive every tier
 * (their knights are never adjacent to the chain). Pair at the cap,
 * chain:2 + magnet:1 — 100/100/100/91; chain:2 + magnet:5 — 91/100/100/91.
 *
 * MID-RUN, 32 trials:
 *   L    none  chain  magnet  shove  hourglass
 *   1    100%   100%   100%   100%    100%
 *   2    100%   100%   100%   100%    100%
 *   3      0%   100%   100%     0%      0%
 *   4      0%   100%   100%     0%      0%
 *   5      0%   100%   100%     0%      0%
 *   6      0%   100%   100%     0%      0%
 *
 * FULL RUNS, 40 runs, T5, difficulty=normal:
 *   random picks from the whole kit   20/40 = 50%  (L3 78%, L7 77%, L10 83%)
 *   `--pool=chain,magnet`             29/40 = 72%
 * Above the Moat's 10-25% for the documented structural reason (the pair is
 * half of a 4-card kit with three offers before L7) plus this run's own: the
 * finale is not hard for a player who holds the pair.
 *
 * HONEST NOTES ON THE FILLERS AND THE TERRAIN BRIEF. (a) Neither filler is a
 * key on any level. A loose-stone Shove door was built for L5 and measured
 * 100% alone, but it made L5 a third key for a two-card hand (DEAD END 4) and
 * the two-door version lost the bot down the side branch; it was cut. So
 * "loose vs fixed stone" is NOT a designed distinction here: every stone is
 * fixed. (b) For this kit lava and fixed stone are mechanically identical
 * (both stop a Magnet pull, pin a pawn, seal a knight, refuse Shove). The lava
 * lake is a SILHOUETTE experiment, not a rules one.
 *
 * ── DEAD ENDS ──────────────────────────────────────────────────────────────
 * 1. AN UNPINNED PAWN LIGHTS ITS OWN FUSE. Every early build had a link whose
 *    front square was open ground on his line; it marched one square on the
 *    first enemy turn, became adjacent to the head, and Chain alone read
 *    100%. The vertical "zipper" (pull a pawn down a pawn-flanked file) is
 *    impossible for the same reason: a pawn that can be pulled down its file
 *    can walk down it. Hence the posts, and hence every pull in the run is
 *    SIDEWAYS along a rank.
 * 2. THE BOT CANNOT FIND A PULL WHOSE SUICIDAL TWIN SCORES +150. `fastScore`
 *    pays 150 for "attacks a stunned king". If the covered piece is the tail
 *    itself, the plain (fatal) capture scores 150 inside every rollout, the
 *    arm scores ~25, and magnet-then-arm-then-capture is never sampled: the
 *    first L8 (pull the knight off the TAIL) read 0% with a proven line. The
 *    findable shape is the brief's own: capture a HEAD that is not on his
 *    line and let the fuse reach the tail. L8 was rebuilt that way: 100%.
 * 3. OPEN FLOOR = THE BOT PARKS UNDER THE KING. Rank 1 is a plateau for
 *    `(8 - chebyshev) * 3`; with more than ~3 start squares the bot shuffles
 *    toward his file and never enters the road. Every level from L3 on has
 *    one to three start squares, all on the road. (Same as The Comb's DEAD
 *    END 1.)
 * 4. THREE KEYS FOR A TWO-CARD HAND. See the KEY/TRAP map. 1/40 -> 20/40.
 * 5. HIS FLEE SQUARE NEXT TO A COVER PAWN IS A BACK DOOR (L4 v1): he stepped
 *    to d8, which put the cover pawn c8 on an open file beside him — take it,
 *    stun, take him. 100% bare. The flee square moved to d6.
 *
 * ENGINE NOTES (not bugs, but authors should know): the MCTS bot always
 * resolves a Magnet pull to the FARTHEST landing (`candidateToAction` drops
 * target2 for magnet), so a level whose answer is a SHORT pull is unmeasurable;
 * every pull here is max-length or stops against her.
 */
import { type RunDef, make, FLEE, STILL } from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

/**
 * THE PLAN. A level is drawn as eight strings, rank 8 first, file a first:
 *   #  fixed stone (a post, a wall — Shove may never push it)
 *   o  LOOSE stone (Shove may push it)
 *   ~  lava
 *   p n b q k  his men
 *   +  an empty square of his pen (his own square is always in the pen)
 *   .  open ground
 */
function plan(level: number, rows: string[], opts: { moveLimit: number; still?: boolean; enemiesPerTurn?: number }) {
  if (rows.length !== 8 || rows.some((r) => r.replace(/ /g, '').length !== 8)) {
    throw new Error(`revenge-57 L${level}: a plan is 8 rows of 8`);
  }
  const pieces: EnemyPiece[] = [];
  const hazards: Hazard[] = [];
  const pen: string[] = [];
  const TYPES = { p: 'pawn', n: 'knight', b: 'bishop', q: 'queen', k: 'king' } as const;
  rows.forEach((row, i) => {
    const rank = 8 - i;
    [...row.replace(/ /g, '')].forEach((ch, j) => {
      const file = j + 1;
      const name = `${String.fromCharCode(96 + file)}${rank}`;
      if (ch === '#') hazards.push({ file, rank, fixed: true });
      else if (ch === 'o') hazards.push({ file, rank });
      else if (ch === '~') hazards.push({ file, rank, kind: 'lava' });
      else if (ch === '+') pen.push(name);
      else if (ch in TYPES) {
        const type = TYPES[ch as keyof typeof TYPES];
        pieces.push({ type, color: 'black', file, rank });
        if (type === 'king') pen.push(name);
      } else if (ch !== '.') throw new Error(`revenge-57 L${level}: bad plan char "${ch}"`);
    });
  });
  return make(level, pieces, {
    ...(opts.still ? STILL : FLEE),
    moveLimit: opts.moveLimit,
    hazards,
    kingPen: pen,
    ...(opts.enemiesPerTurn ? { enemiesPerTurn: opts.enemiesPerTurn } : {}),
  });
}

export const RUN_REVENGE_57: RunDef = {
  id: 'revenge-57',
  name: 'The Daisy Chain',
  blurb:
    'His pawns stand on stone posts in a lake of lava, each one guarding the next. That is the oldest lock in chess, and Chain makes it a fuse: take one and every pawn touching it goes too, and every pawn touching those. But a fuse cannot jump a gap or burn through a knight. Magnet moves one piece one square. Find the piece.',
  allowedAbilities: ['chain', 'magnet', 'shove', 'hourglass'],
  // Measured L7-L10, 32 trials, single cards: chain T1 0/0/0/0, T2 0/0/0/0,
  // T3 0/100/100/0 (pawn = knight becomes one family and the second use
  // arrives: the sealed knight on L8/L9 is just another link). Magnet is
  // 0/0/0/0 at every tier and needs no cap.
  abilityTierCaps: { chain: 2 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE CHAIN, DRAWN. Three pawns on posts, a pond of lava, and him alone
    // on an open file. DECISION: none — slide up the file.
    plan(
      1,
      [
        '........',
        '....k...',
        '........',
        '.p.p.~~.',
        '.#p#.~~~',
        '..#...~.',
        '........',
        '........',
      ],
      { moveLimit: 12, still: true },
    ),
    // L2 — THE FIRST SPARK. One uncovered man on his rank. DECISION: capture on
    // his line, he is stunned, take him.
    plan(
      2,
      [
        '########',
        '##~~~###',
        '#~p~p~##',
        '#~#p#~##',
        '#~~#~~#+',
        '....p.k#',
        '....####',
        '....####',
      ],
      { moveLimit: 10 },
    ),
    // L3 — THE COVERED BLOCKER (chain OR magnet). d3 blocks his rank, e4 covers
    // it. Chain: a3xd3 burns e4 with it. Magnet: drag d3 to b3, out of cover.
    // DECISION: burn the cover, or pull the man out from under it.
    plan(
      3,
      [
        '########',
        '########',
        '########',
        '##~~~~##',
        '##~~p~##',
        '...pk###',
        '.#~#~+##',
        '.#######',
      ],
      { moveLimit: 8 },
    ),
    // L4 — TWO DOORS (chain OR magnet). His FILE is open and useless — stand on
    // it and he steps to d6 for good. Magnet: from a4 pull e4 to c4 and take
    // it THERE: stun, on his file. Chain: a7xb7 burns c8 and b6.
    // DECISION: never show him a line until he is stunned.
    plan(
      4,
      [
        '##p#####',
        '.pk#####',
        '.p.+####',
        '.#.~~~##',
        '....p~##',
        '.##~#~##',
        '.#######',
        '.#######',
      ],
      { moveLimit: 8 },
    ),
    // L5 — THE FUSE (chain OR magnet). Head c4, link d3 threaded between the
    // posts, tail e4 on his line under f5's cover. Chain: take the HEAD.
    // Magnet: take the head plainly, then drag the tail to d4.
    // DECISION: light the far end, not the end he is guarding.
    plan(
      5,
      [
        '########',
        '########',
        '###~~~~#',
        '###~~p~#',
        '..p.pk##',
        '.##p##+#',
        '.#~#~###',
        '.#######',
      ],
      { moveLimit: 8 },
    ),
    // L6 — THE BRICK (chain OR magnet). Six pawns, one capture.
    // DECISION: how far does one spark run — count two links.
    plan(
      6,
      [
        '##~~~~~#',
        '##~ppp~#',
        '##~#p#~#',
        '...pk###',
        '.#######',
        '.#######',
        '.#######',
        '.#######',
      ],
      { moveLimit: 8 },
    ),
    // ══ L7 — THE MISSING LINK. Pull the bridge pawn e5 to d5, then c5xc4.
    // DECISION: which pawn closes the gap, and from where.
    plan(
      7,
      [
        '########',
        '~~~##n##',
        'p~~#####',
        '#p..p#n#',
        '~#p.pk##',
        '~~#.#~##',
        '###.####',
        '##...###',
      ],
      { moveLimit: 7 },
    ),
    // ══ L8 — THE ODD GUARD. Pull the knight b6 off the head, then b4xc4.
    // DECISION: pull the guard, not a link.
    plan(
      8,
      [
        '########',
        '#~p~~~~#',
        '#n#~~~~#',
        '#.~~~p~#',
        '#.p.pk##',
        '#.#p#~+#',
        '#.~#~###',
        '...#####',
      ],
      { moveLimit: 6 },
    ),
    // ══ L9 — THE SLIDER. Pull the head c4 to b4: out of the knight's cover, into
    // the pawn's — the cover Chain burns. DECISION: trade covers.
    plan(
      9,
      [
        '########',
        '########',
        '#~~~~~~#',
        '#~p~n~~#',
        '..ppk~##',
        '.###~+~#',
        '.#######',
        '..######',
      ],
      { moveLimit: 6 },
    ),
    // ══ L10 — THE ODD LINK. Chain first (c4xd4 opens his file), THEN Magnet
    // delivers the knight f4 onto e4 and she takes it there.
    // DECISION: order — and do not step onto his file un-stunned.
    plan(
      10,
      [
        '########',
        '#~~+~~~#',
        '#~~~kp~#',
        '#~~~p#~#',
        '##.ppn~#',
        '##.##~##',
        '##.#####',
        '#...####',
      ],
      { moveLimit: 7 },
    ),
  ],
};

export default RUN_REVENGE_57;
