/**
 * revenge-61 — THE BAFFLE, v2. Built 2026-09-19 for the signature pair
 * RICOCHET + BOULDER; repopulated the same day after Tyler's playtest.
 * Kit = ricochet / boulder / magnet — exactly three cards, so the daily kit
 * (drawn FROM `allowedAbilities`) always offers all three. NO tier caps.
 * Ricochet is a TESTING card.
 *
 * LEVEL-FIRST. A king in a cell whose only mouth faces SIDEWAYS, down a
 * dog-leg no straight line enters. The one square that sees him is the corner
 * of the dog-leg, and it touches him — and a king always swings at a rook that
 * touches him. So she may pass THROUGH the corner but never stop on it.
 * Ricochet banks her rook move 90 degrees at a stone (rule R4 — stone is a
 * mirror; lava, pieces and the board edge are not). He only fears her straight
 * lines, so a banked line is one he never reacts to.
 *
 * THE PAIR. A bank needs a stone directly beyond the corner. On the finale the
 * level never offers one — the square beyond the corner (THE CAP) is open
 * ground, a guard, or lava — so BOULDER places the rail and RICOCHET plays the
 * bank shot off it. Boulder is never a block here. It is a cushion.
 *
 * ── CONSTANT SIGNATURE ─────────────────────────────────────────────────────
 * Every level is solid stone with corridors bored through it (the boards are
 * DRAWN in the source, see `draw`). The same things every time:
 *   1. THE CELL    one square, sealed in stone, one mouth (L10: two).
 *   2. THE CORNER  the square outside the mouth. It is drawn GOLD (it is in
 *                  `kingPen`): his doorstep. Guards never step into the pen,
 *                  so no hunter ever corks the corner, and she never stops
 *                  on it.
 *   3. THE LANE    the corridor that runs into the corner at right angles to
 *                  the mouth. Its first square touches him diagonally and is
 *                  as deadly as the corner; she fires from the second or
 *                  further back.
 *   4. THE CAP     the square past the corner, in line with the lane:
 *                    '#' stone  = a LIVE rail, the bank is on        (L3 L5 L6)
 *                    '~' lava   = a DEAD rail: refuses the bank AND the
 *                                 Boulder — dead for good         (L5, L10)
 *                    '.' ground = no rail yet: bring your own    (L7 L8 L10)
 *                    a guard    = no rail and no room for one         (L9)
 *   5. THE BODIES (new in v2). Pieces live IN the stone: knights in one-square
 *      niches that jump out onto the corridors, bishops standing in one-wide
 *      corridors (a bishop there cannot move — it is a plug she must eat),
 *      pawns pinned by the stone in front of them, watching one corridor
 *      square each, and on L10 a queen at the head of the dead lane.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none       the hall runs straight into him (king stands still).
 *   L2  none       a throat two squares long: stand on the far one.
 *   L3  RICOCHET   the corner touches him, the cap is stone. Bank. A pinned
 *                  pawn watches the middle of the lane: fire from either end.
 *   L4  BOULDER    he has a back room and ducks into it. Stone it first.
 *                  (Both rails that would let a bank follow him are lava.)
 *   L5  RICOCHET   two lanes. The near one is capped in lava and plugged.
 *   L6  RICOCHET   a bishop stands in the lane. Eat it — that lands her on
 *                  the firing square — then bank.
 *   L7-L10 the pair. MAGNET is the trap: it moves guards, and no guard is
 *   what stands between her and him. (It has honest small uses — L8's plug
 *   on d1 is only ever takeable after a Magnet pull.)
 *
 * ── THE FOUR FINALE LINES ──────────────────────────────────────────────────
 *   L7  THE RAIL. K e5, corner d5, lane d4-d3, cap d6 open. Two knights on
 *       the floor (e1, g1) watch d3, f3 and g2 between them; a pinned pawn on
 *       h4 watches g3, the other way up. f1xg1, g1xe1, e1-f1, f1-f3, f3-d3,
 *       Boulder d6, Ricochet, d3 up the lane, banks at d5 off d6, x e5.
 *       THE WARDEN: a knight walled in on e7 watches the corner and can never
 *       leave (its only square is the pen). It is why a crush-stun does not
 *       let her walk in. It can be had: g3xg6 (bishop), g6-g7, g7xe7.
 *       DECISION: where does the rail go? (and: clear the watchmen first.)
 *   L8  THE FAR SIDE. K e3, corner d3, and the d-file runs straight through
 *       the corner. The near foot d1 holds a bishop defended by a second
 *       bishop on c2 (which also watches the corner): taking it is death.
 *       So go round: xg2 (knight), g2xg3 (bishop), g3-g5, g5-d5, Boulder d2 —
 *       the rail goes IN THE LANE SHE WANTED — Ricochet, d5-d4-d3 banks off
 *       d2, x e3. Two knights in the roof (c7, f7) jump down onto the gallery;
 *       two enemies act per turn.
 *       DECISION: which side do I fire from — and the rail goes on the other.
 *   L9  THE CHIMNEY. K g6, corner g5, and a bishop STANDS ON THE CAP (h5,
 *       walled in, it can never move). No stone fits there. c1xc3 (knight in
 *       the corridor), c3-c5, c5xh5 THROUGH the corner — the capture stuns
 *       him, which is the only reason she survives standing on h5 — then
 *       Boulder f5 BEHIND the corner, Ricochet, h5-g5 banks off f5, x g6.
 *       A roof knight (d7) watches c5 and e5 and has to be drawn out or
 *       eaten; the warden is the bishop on h4 (takeable from h5).
 *       DECISION: take the cap, then put the rail behind you; fire backwards.
 *  L10  THE TWO MOUTHS. K d6 with a corner on each side. The west lane is
 *       open, straight and inviting — and its cap c7 is LAVA, with a queen
 *       standing at its head (c5) who comes down it at her. The east lane is
 *       plugged by a bishop on e4, and its cap e7 is open ground. b2/g2-e2,
 *       e2xe4 (the capture IS the firing square), Boulder e7, Ricochet,
 *       e4-e5-e6 banks off e7, x d6. Knights in b3 and g4 drop onto the
 *       corridor (b3 watches d2, g4 watches e3 and f2); two act per turn.
 *       DECISION: which mouth can ever hold a rail — read the lava first.
 *   Different use each time: rail ABOVE the mouth / rail on the side she did
 *   NOT come from / capture-stun then rail BEHIND her / choose the live mouth.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, T5 bot, `revenge.ts matrix`,
 *    32 trials, --jobs=6. NO `abilityTierCaps`. ─────────────────────────────
 *
 *   L    none  ricochet  boulder  magnet | ricochet+boulder   enemies  clock
 *   7      0%     0%        0%      0%   |       81%             5       8
 *   8      0%     0%        0%      0%   |       75%             6       6 (2/turn)
 *   9      0%     0%        0%      0%   |       69%             6       8
 *  10      0%     0%        0%      0%   |       75%             5       6 (2/turn)
 *   16 cells of zero; the pair means 75%. L7 is one point over the band,
 *   inside the ~8pp noise (it reads 59% at clock 7 and 81% at 8 — there is
 *   no clock between them).
 *
 * TIER SWEEP, L7/L8/L9/L10, 32 trials, every single card at every tier:
 *   ricochet   T1 0/0/0/0   T2 0/0/0/0   T3 0/0/0/0   T5 0/0/0/0
 *   boulder    T1 0/0/0/0   T2 0/0/0/0   T3 0/0/0/0   T4 0/0/0/0   T5 0/0/0/0
 *   magnet     T1 0/0/0/0   T3 0/0/0/0   T5 0/0/0/0
 *   the pair   T1+T1 81/75/69/75    T2+T2 97/50/63/81    T3+T3 100/91/66/84
 *              R3+B4 100/69/78/63   T5+T5 100/81/69/59
 * The gate is cap-free at every tier. How the geometry does it:
 *   - RICOCHET never breaks it: no authored stone caps a finale lane, so a
 *     second bank (T3) or a third charge (T5) has nothing to bank off.
 *   - BOULDER T2+ (v1's break: crush a pawn = a free stun, walk onto the
 *     corner, take him): L8 and L10 carry NO pawns, so there is nothing to
 *     crush. L7 and L9 do carry one, and there THE WARDEN answers it — a
 *     knight (L7 e7) / bishop (L9 h4) walled in so that its only move is the
 *     corner, which is pen, so it never moves and always bites. A stunned king
 *     does not swing; the warden still does. Killing the warden first and
 *     then crushing costs 9+ moves (L7) or needs two more stuns than L9 has
 *     pawns for.
 *   - MAGNET T3+ pulls on DIAGONALS and T5 yanks the KING one square. The
 *     first v2 build of L7 lost 78% to magnet:5 alone: from c3 she yanked him
 *     e5-d4 down the diagonal through the lane's first square, into the open.
 *     Rule now held on all four: the square two steps from him on any open
 *     diagonal is stone (L7 c3, L8 c5 and c1, L9 e4, L10 b4, f4 and f8). And no
 *     piece can ever stand in line beyond a corner except L9's cap bishop,
 *     where the warden makes the Magnet cork (pull it onto the corner, eat it,
 *     he is stunned) fatal.
 *
 * MID-RUN, 16 trials (non-king enemies in brackets):
 *   L    none  ricochet  boulder  magnet
 *   1 [3] 100%   100%     100%     100%
 *   2 [4] 100%   100%     100%     100%
 *   3 [4]   0%   100%       0%       0%
 *   4 [4]   0%     0%      81%       0%
 *   5 [4]   0%   100%       0%       0%
 *   6 [4]   0%    81%       0%       0%
 *
 * FULL RUNS, T5, offers on L1/L2/L3/L6/L9 (v1 had no L2 offer: with three
 * cards and L3/L4 each needing a different one, random picks read 2/40 = 5%;
 * one more early offer put it in band):
 *   random picks from the kit     4/40 = 10%  (L3 70%, L4 54%, L7 73%, L9 71%)
 *   `--pool=ricochet,boulder`    21/80 = 26%  (L3 84, L4 84, L9 73, L10 72)
 * The pool read is a product of ten honest levels now, not a walk after L4:
 * v1 read 58% here because its finale was ~100% for anyone holding the pair.
 *
 * ── v2 — WHAT CHANGED AND WHY ──────────────────────────────────────────────
 * Tyler, 2026-09-19: "i love the ricochet and boulder one! needs to be harder
 * more pieces!" — and L10 was hard to read with the filler in hand.
 *   - MORE PIECES. Non-king enemies per level, v1 -> v2:
 *       L1 0->3  L2 1->4  L3 0->4  L4 0->4  L5 1->4
 *       L6 0->4  L7 1->5  L8 2->6  L9 3->6  L10 1->5
 *     They are put IN the stone (niches, plugs, pinned pawns), so the finale
 *     is still 13-19 empty squares and Boulder stays measurable.
 *   - KIT 4 -> 3: hourglass dropped (standing decision 2026-09-15).
 *   - NO TIER CAPS ("if an upgrade trivializes a level, fix the board, never
 *     cap the card"). v1 capped boulder at 1; see the sweep above for what
 *     replaced the cap.
 *   - L8-L10 each add a wrinkle L7 does not cover ("once you solved it you
 *     kind of figured it out"): the rail on the side she did not come from /
 *     the capture-stun and the shot fired backwards / two mouths, one of them
 *     dead for good. v1's L10 (THE LONG HALL, an exposed king who ducks) is
 *     gone: any ducking king is a Boulder solo once she has enough stones to
 *     close his back rooms (v1 read boulder:4 22%), and T5 has no limit.
 *   - NOT BUILT: a double-bank level. With one bank at T1 the kill shot always
 *     banks AT the corner, so a level that needs two banks hard-locks a T1
 *     holder, and as an optional line it never came up shorter than the
 *     single bank on these boards. Magnet as a brief key: not built either —
 *     the pair is measured alone, so a level that needs a third card reads 0.
 *
 * ── HONEST NOTES ───────────────────────────────────────────────────────────
 * 1. L10 is where "more pieces" hit the bot's ceiling. The shipped board
 *    (queen, plug, three knights) reads 75% at the floor clock of 6; with the
 *    west knight on b4 instead of b3 it read 59%, but b4 is on his diagonal
 *    (a T5 Magnet yank square once the queen leaves c5), so b4 is stone. A fourth knight on a3 made a real
 *    fortress (it reaches c3 under the queen and watches e2 for ever: 47%,
 *    all move-limit); a second plug read 0% because the bot spends both stones
 *    walling off the queen and has no rail left — a human with two stones has
 *    exactly one to spare; corner bishops read 38% / 6%. The queen is binary:
 *    c5 88-91% alone, c4 100% (free food), c3 0% (rank 2 is dead).
 * 2. With bodies on the board the bot sometimes arms its ONE Ricochet on a
 *    banked capture of a knight and has none left. That is also the human
 *    trap the run wants ("the charge is for him"), but it is part of why the
 *    pair numbers sit lower than v1's with the same line lengths.
 * 3. Two pieces are takeable only with help: L8's bishop on d1 (defended by
 *    c2) only after a Magnet pull, and L8's c2 only from d2, a square beside
 *    the king, i.e. under a stun. (L9's warden h4 falls from h5, which the
 *    intended line visits.) They are small, walled, and
 *    never in her way; flagged because the design doc asks that every enemy
 *    be capturable on a realistic line.
 * 4. The knight wardens hold only while their neighbours do: L7's e7 can hop
 *    to g6 once the g6 bishop is eaten.
 *
 * ── DEAD ENDS (v1's four still stand; v2 adds) ─────────────────────────────
 * 1. A GUARD IN THE MOUTH cannot be built (whatever covers the corner is
 *    itself beside the cap; a chain of king-defended captures is free).
 * 2. THE RANK-1 PLATEAU. `fastScore` pulls her toward his file along the
 *    floor. v2 L8 read 42% with the road up on the h-file (she shuffled
 *    f1-g1) and 83% with it on g; v2 L7 lost every g1 start to a gallery
 *    that came off the floor, so the gallery now comes off the lane row.
 * 3. THE CLOCK DOES NOT BITE, WATCHMEN DO — and a watchman nobody can reach
 *    bites too hard: a niche knight on f4 watching L7's d3 read 28%, a pinned
 *    pawn watching L9's only firing square read 0% (seven-move plan, the bot
 *    shuffles). Watchmen go where they can be eaten or drawn out.
 * 4. THE BANK FOLLOWS HIM INTO THE BACK ROOM (L4's lava studs).
 * 5. A PAWN BESIDE A HORIZONTAL LANE MARCHES INTO IT; one beside a vertical
 *    lane can be pinned. A guard that defends a plug she must eat, with no
 *    way to reach the guard, is a deadlock, not a puzzle (L9 v2a: 0%).
 */

import { FLEE, LAVA, STILL, X, bishop, king, knight, make, pawn, queen, type RunDef } from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

/**
 * THE CARVE, drawn. Eight strings, rank 8 first, files a-h left to right:
 *   '#' stone (a LIVE rail — Ricochet banks off it)
 *   '~' lava  (a DEAD rail — it stops her and refuses the bank; Boulder
 *             cannot be dropped on it either)
 *   '.' open ground        '*' open ground that is part of his pen
 *   'K' the king (his square is always in the pen)
 *   'p' 'n' 'b' 'q' his men
 * Every level is solid stone with a corridor bored through it, so the picture
 * in the source IS the silhouette, and the empty-square count stays small
 * (the Warren rule: Boulder targets empty squares).
 */
function draw(rows: string[]): { pieces: EnemyPiece[]; hazards: Hazard[]; kingPen: string[] } {
  if (rows.length !== 8 || rows.some((r) => r.length !== 8)) throw new Error('revenge-61: a board is 8x8');
  const pieces: EnemyPiece[] = [];
  const hazards: Hazard[] = [];
  const kingPen: string[] = [];
  rows.forEach((row, i) => {
    const rank = 8 - i;
    [...row].forEach((ch, j) => {
      const file = j + 1;
      const name = `${String.fromCharCode(96 + file)}${rank}`;
      switch (ch) {
        case '#': hazards.push(X(file, rank)); break;
        case '~': hazards.push(LAVA(file, rank)); break;
        case '.': break;
        case '*': kingPen.push(name); break;
        case 'K': pieces.push(king(file, rank)); kingPen.push(name); break;
        case 'p': pieces.push(pawn(file, rank)); break;
        case 'n': pieces.push(knight(file, rank)); break;
        case 'b': pieces.push(bishop(file, rank)); break;
        case 'q': pieces.push(queen(file, rank)); break;
        default: throw new Error(`revenge-61: unknown square '${ch}'`);
      }
    });
  });
  return { pieces, hazards, kingPen };
}

const level = (n: number, rows: string[], opts: { still?: boolean; moveLimit: number; enemiesPerTurn?: number }) => {
  const b = draw(rows);
  return make(n, b.pieces, {
    ...(opts.still ? STILL : FLEE),
    moveLimit: opts.moveLimit,
    enemiesPerTurn: opts.enemiesPerTurn,
    hazards: b.hazards,
    kingPen: b.kingPen,
  });
};

export const RUN_REVENGE_61: RunDef = {
  id: 'revenge-61',
  name: 'The Baffle',
  blurb:
    'His cell has one mouth and it faces sideways, down a dog-leg no straight line enters. Stone is a rail: bank off it. Lava is a dead rail: it will not give you the angle. And where the level offers no rail at all, you bring your own.',
  allowedAbilities: ['ricochet', 'boulder', 'magnet'],
  signaturePair: ['ricochet', 'boulder'],
  offerEveryLevel: true,
  offerOnLevels: [1, 2, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE HALL. DECISION: walk the dog-leg; the hall sees him.
    level(1, [
      '########',
      '#K.....#',
      '##p#p#.#',
      '######.#',
      '###....#',
      '###.####',
      '###.####',
      '.......n',
    ], { still: true, moveLimit: 12 }),
    // L2 — THE THROAT. DECISION: stand on the far throat square, not the near.
    level(2, [
      '########',
      '####..K#',
      '###p.###',
      '####.###',
      '#....###',
      '#.##p###',
      '#.######',
      '..n...n.',
    ], { moveLimit: 12 }),
    // L3 — THE BANK (ricochet KEY). Corner d7 touches him; cap d8 is stone. The
    // pawn e5 watches d4. DECISION: pass through the corner, never stop on it.
    level(3, [
      '########',
      '##K*####',
      '###.####',
      '###.p###',
      '###.####',
      '###...n#',
      '######.#',
      'n...n...',
    ], { moveLimit: 10 }),
    // L4 — THE BACK ROOM (boulder KEY). He ducks from g6's line into e7. g7 and
    // d6 are LAVA: no bank follows him. DECISION: stone the back room, then knock.
    level(4, [
      '########',
      '####*#~#',
      '###~K..#',
      '######.#',
      '#####p.#',
      'n#.....#',
      '##.#####',
      '..n....n',
    ], { moveLimit: 10 }),
    // L5 — THE DEAD RAIL (ricochet KEY). d-lane: lava cap, a bishop plug, corner
    // watched by c8. f-lane: stone cap. DECISION: which lane has a live rail?
    level(5, [
      '##p~####',
      '###..*K#',
      '###.#.##',
      '###b#.##',
      '#.....##',
      '#.######',
      '#.######',
      '....n..n',
    ], { moveLimit: 10 }),
    // L6 — THE PLUG (ricochet KEY). A bishop stands in the lane and cannot move.
    // DECISION: eat the guard — that IS the firing square — then bank.
    level(6, [
      '########',
      '#K*#####',
      '##.#####',
      '##.#####',
      '##b#####',
      '##.....#',
      '######.#',
      'n..n..n.',
    ], { moveLimit: 10 }),
    // ══ L7 — THE RAIL. Cap d6 is open ground; knights e1/g1 and pawn h4 watch the
    // way in; warden e7. DECISION: clear the watchmen, drop the rail on the cap.
    level(7, [
      '########',
      '####n..#',
      '###.##b#',
      '###*K#.#',
      '###.##.p',
      '###....#',
      '#####..#',
      '####n.n.',
    ], { moveLimit: 8 }),
    // ══ L8 — THE FAR SIDE. The near foot d1 is a defended plug. DECISION: go
    // round the top, and put the rail in the lane you wanted (d2).
    level(8, [
      '########',
      '##n##n##',
      '########',
      '###....#',
      '###.##.#',
      '###*K#b#',
      '##b.##n#',
      '###b...#',
    ], { moveLimit: 6, enemiesPerTurn: 2 }),
    // ══ L9 — THE CHIMNEY. A walled bishop stands ON the cap. DECISION: take it
    // through the corner (the stun saves her), rail BEHIND on f5, bank backwards.
    level(9, [
      '########',
      '###n####',
      '######K#',
      '##....*b',
      '##.####b',
      '##np####',
      '##.#####',
      '#...n###',
    ], { moveLimit: 8 }),
    // ══ L10 — THE TWO MOUTHS. West: open lane, LAVA cap, a queen at its head.
    // East: plugged, open cap. DECISION: which mouth can ever hold a rail?
    level(10, [
      '########',
      '##~#.###',
      '##*K*###',
      '##q#.###',
      '##.#b#n#',
      '#n.#.###',
      '#......#',
      '#.###n.#',
    ], { moveLimit: 6, enemiesPerTurn: 2 }),
  ],
};

export default RUN_REVENGE_61;
