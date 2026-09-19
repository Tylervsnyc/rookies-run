/**
 * revenge-61 — THE BAFFLE. Built 2026-09-19 for the signature pair
 * RICOCHET + BOULDER. Kit = ricochet / boulder / magnet / hourglass
 * (`allowedAbilities` IS the kit). Ricochet is a TESTING card.
 *
 * LEVEL-FIRST. The crazy level came before the card: a king in a cell whose
 * only mouth faces SIDEWAYS, down a dog-leg no straight line enters. The one
 * square that sees him is the corner of the dog-leg, and it touches him — and
 * a king always swings at a rook that touches him. So she may pass THROUGH the
 * corner but never stop on it. Ricochet was invented for exactly that: her
 * rook move banks 90 degrees at a stone (rule R4 — stone is a mirror; lava,
 * pieces and the board edge are not). He only fears her straight lines, so a
 * banked line is one he never reacts to.
 *
 * THE PAIR. A bank needs a stone directly beyond the corner. On the finale the
 * level never offers one — the square beyond the corner (THE CAP) is open
 * ground, a guard, or lava — so BOULDER places the rail and RICOCHET plays the
 * bank shot off it. Boulder had never gated a level as a BLOCK; here it is
 * never a block. It is a cushion.
 *
 * ── CONSTANT SIGNATURE — THE BAFFLE ────────────────────────────────────────
 * Every level is solid stone with one corridor bored through it (the boards
 * are DRAWN in the source, see `draw`). The same four things every time:
 *   1. THE CELL    his room, sealed in stone, one mouth.
 *   2. THE CORNER  the square outside the mouth, where the corridor turns.
 *   3. THE LANE    the leg of the corridor that runs into the corner at right
 *                  angles to the mouth. She fires from the lane.
 *   4. THE CAP     the square past the corner, in line with the lane. What
 *                  the cap is made of is the whole level:
 *                    '#' stone  = a LIVE rail, the bank is on
 *                    '~' lava   = a DEAD rail: stops her, refuses the bank,
 *                                 and refuses a Boulder too — dead for good
 *                    '.' ground = no rail yet: bring your own
 *                    'p' a guard = no rail, and no room for one
 *
 * ── TERRAIN EXPERIMENT — stone is a rail, lava is a dead rail ───────────────
 * Lava is never a moat here. It is used in ones and twos, exactly where a
 * rail would have been: a lava cap on a lane (L5, L8, L10), a lava stud in
 * the wall behind his back room so the bank that would follow him in does not
 * exist (L4 — measured: with stone there Ricochet solos the level 100%, with
 * lava 0%), a lava gutter down the side of the lane that looks like the way
 * in and is not (L8). Which angles exist on a level is decided by which wall
 * squares are stone and which are lava — the player reads the rails before
 * she reads the pieces. No authored stone on L7-L10 caps a lane: ricochet
 * alone reads 0% on all four at T1, T2, T3 and T5 (T3+ banks twice).
 * Every authored stone is plain stone; nothing in this kit moves stone, so
 * `fixed` would be a distinction the player could never see.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none       the hall runs straight into him (king stands still).
 *   L2  none       a throat two squares long: stand on the far one.
 *   L3  RICOCHET   the throat is one square: the corner touches him. The cap
 *                  is stone. Bank.
 *   L4  BOULDER    he has a back room and ducks into it. Stone it first.
 *                  (Both rails that would let a bank follow him are lava.)
 *   L5  RICOCHET   two lanes. The near one is capped in lava. Read the rails.
 *   L6  RICOCHET   he stands in plain sight at the end of a long hall and
 *                  ducks the moment she steps onto it. Bank onto the hall and
 *                  he never sees it. (BOULDER is a second human answer — two
 *                  stones, two back rooms — that the bot does not find: 0%.)
 *   L7-L10 the pair. MAGNET and HOURGLASS are traps on every level of the
 *   run: magnet needs a guard on her line worth moving and there never is
 *   one; a glass-turn buys nothing from a king who is not reacting to her.
 *
 * ── THE FOUR FINALE LINES ──────────────────────────────────────────────────
 *   L7  THE RAIL. K e5, mouth d5, lane d3-d4, cap d6 open. A knight on c1
 *       watches the firing square d3. Rxc1 (or outrun it), e1-e3, e3-d3,
 *       Boulder d6, Ricochet, d3 up the lane, banks at d5 off d6, x e5.
 *       DECISION: where does the rail go? (and: watchman first, or race?)
 *   L8  THE WRONG LANE. K b7, throat c7-d7-e7. The open e-file runs straight
 *       from her floor to the corner e7 — and its cap e8 is LAVA, its corner
 *       is covered by a walled pawn on f8, and its side is a lava gutter. The
 *       live lane is the short one round the dog-leg: e1-e4, e4-c4 (a knight
 *       on d4 is in the way), Boulder c8, Ricochet, c4 up the lane, banks at
 *       c7 off c8, x b7. DECISION: which lane is alive — the natural one is
 *       dead, and no stone will ever revive it.
 *   L9  THE CHIMNEY. K g6, mouth g5, and a pawn STANDS ON THE CAP (h5, walled
 *       in, it can never march). No stone fits there. So: Rxe3 (knight in the
 *       lane), e3-e5, Rxh5 — the capture stuns him, which is the only reason
 *       she survives standing on h5 — then Boulder f5 BEHIND the corner, in
 *       the corridor she came down, Ricochet, h5-g5 banks off f5, x g6.
 *       DECISION: take the cap, then put the rail behind you. Capture first,
 *       bank second, and the shot is fired backwards.
 *  L10  THE LONG HALL. K g6 in plain sight at the end of the hall c6-f6, with
 *       a 2x3 suite behind him (five back rooms — two stones cannot close
 *       it). Touch his rank and he ducks for good. The near lane (e) is capped
 *       in lava. a1-a5, a5-c5 (a knight on e4 watches c5), Boulder c7,
 *       Ricochet, c5-c6 banks off c7 and runs the hall d6-e6-f6 x g6.
 *       DECISION: never step on the line you are about to use.
 *   Different use each time: rail ABOVE the mouth / WHICH rail / capture then
 *   rail BEHIND her / a long bank onto an exposed king who must not be warned.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, T5 bot, `revenge.ts matrix`,
 *    32 trials, --jobs=2 (nine other authors on the machine) ────────────────
 *
 *   L    none  ricochet  boulder  magnet  hourglass | ricochet+boulder
 *   7      0%     0%        0%      0%       0%     |       72%
 *   8      0%     0%        0%      0%       0%     |       81%
 *   9      0%     0%        0%      0%       0%     |       72%
 *  10      0%     0%        0%      0%       0%     |       69%
 *
 * The gate is met: 20 cells of zero, the pair means 73.5%. L8 sits one point
 * over the band (inside the ~8pp noise).
 *
 * TIER LADDER, L7-L10, 32 trials:
 *   ricochet   T1 0/0/0/0   T2 0/0/0/0   T3 0/0/0/0   T5 0/0/0/0
 *   boulder    T1 0/0/0/0   T2 0/100/91/0   T3 0/100/84/0
 *              T4 0/100/81/22   T5 0/100/81/0
 *   magnet T5 0/0/0/0       hourglass T5 0/0/0/0
 * `abilityTierCaps: { boulder: 1 }`. The break is the T2 CRUSH, not a second
 * use: a stone dropped on the walled pawn (f8 on L8, h5 on L9) is a capture,
 * the capture stuns him, and a stunned king does not swing — so she walks
 * onto the corner and takes him with no bank at all. (T4's 22% on L10 is the
 * double drop finally closing the suite.) Ricochet needs no cap: no authored
 * stone caps a finale lane, so a second bank or a second charge buys nothing.
 *
 * MID-RUN, 16 trials:
 *   L    none  ricochet  boulder  magnet  hourglass
 *   1    100%    100%     100%     100%     100%
 *   2    100%    100%     100%     100%     100%
 *   3      0%    100%       0%       0%       0%
 *   4      0%      0%     100%       0%       0%
 *   5      0%    100%       0%       0%       0%
 *   6      0%    100%       0%       0%       0%
 *
 * FULL RUNS, 40 runs, T5:
 *   random picks from the kit      5/40 = 13%  (L3 50%, L4 35%, then ~100%)
 *   `--pool=ricochet,boulder`     23/40 = 58%  (L4 63% — no boulder yet)
 * In the Moat's 10-25% random band. The run is decided at L3/L4, where each
 * half of the pair is the only key; a player who holds both walks the finale
 * (offers upgrade Ricochet to two charges, which makes L7-L10 forgiving).
 *
 * ── DEAD ENDS ──────────────────────────────────────────────────────────────
 * 1. A GUARD IN THE MOUTH ("bank onto the cork, the stun takes the king")
 *    cannot be built. Whatever covers the corner so she cannot simply stand
 *    there and take the cork straight is itself next to the cap, and the cap
 *    must be open ground for the Boulder — so she stands on the cap and eats
 *    the coverer, then the cork, then him. Every capture re-stuns him; a
 *    chain of king-defended captures is always free.
 * 2. THE RANK-1 PLATEAU (The Comb's dead end 1, again). L10 read 17-25% with
 *    a four-square floor: `fastScore` pulls her along rank 1 toward his file
 *    and she shuffles c1-d1 for the whole clock. One start square (a1) at the
 *    foot of the road: 92%, nothing else changed. L7 and L9 put the foot of
 *    the lane on the floor square nearest his file for the same reason.
 * 3. THE CLOCK DOES NOT BITE, WATCHMEN DO. L7 read 97% at 5 AND at 4 moves;
 *    L9 84% at 6 and at 5 with one knight. A knight covering the firing square (L7 c1, L10 e4)
 *    or a second one standing in the lane (L9 e3) brought each into the band.
 * 4. THE BANK FOLLOWS HIM INTO THE BACK ROOM. L4's first build was meant to
 *    be Boulder-only and Ricochet read 100%: she let him duck, then banked
 *    off the wall behind his old square into the room. Two lava studs fixed
 *    it — and that line is now the intended second answer on L6.
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
  allowedAbilities: ['ricochet', 'boulder', 'magnet', 'hourglass'],
  // Boulder T2 crushes the walled pawn on L8/L9 = a stun = she walks onto the
  // corner: T2 0/100/91/0. Ricochet never breaks the gate (0% at T1-T5).
  abilityTierCaps: { boulder: 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE HALL. DECISION: walk the dog-leg; the hall sees him.
    level(1, [
      '########',
      '#K.....#',
      '######.#',
      '######.#',
      '###....#',
      '###.####',
      '###.####',
      '........',
    ], { still: true, moveLimit: 12 }),
    // L2 — THE THROAT. DECISION: stand on the far throat square, not the near.
    level(2, [
      '########',
      '####..K#',
      '####.###',
      '####.###',
      '#....###',
      '#.######',
      '#.######',
      '..n.....',
    ], { moveLimit: 12 }),
    // L3 — THE BANK (ricochet KEY). The corner d7 touches him; the cap d8 is
    // stone. DECISION: pass through the corner, never stop on it.
    level(3, [
      '########',
      '##K.####',
      '###.####',
      '###.####',
      '###.####',
      '###....#',
      '######.#',
      '........',
    ], { moveLimit: 10 }),
    // L4 — THE BACK ROOM (boulder KEY). He ducks from g6's line into e7. g7 and
    // d6 are LAVA: no bank follows him. DECISION: stone the back room before knocking.
    level(4, [
      '########',
      '####*#~#',
      '###~K..#',
      '######.#',
      '######.#',
      '##.....#',
      '##.#####',
      '........',
    ], { moveLimit: 10 }),
    // L5 — THE DEAD RAIL (ricochet KEY). d-lane: lava cap, corner covered by the
    // walled pawn c8. f-lane: stone cap. DECISION: which lane has a live rail?
    level(5, [
      '##p~####',
      '###...K#',
      '###.#.##',
      '###.#.##',
      '#.....##',
      '#.######',
      '#.######',
      '........',
    ], { moveLimit: 10 }),
    // L6 — THE DUCK (ricochet KEY; boulder x2 a human answer). He is in plain
    // sight down the hall. DECISION: bank onto his rank, never step onto it.
    level(6, [
      '########',
      '########',
      '######*#',
      '#.....K#',
      '#.####*#',
      '#.######',
      '#.######',
      '........',
    ], { moveLimit: 10 }),
    // ══ L7 — THE RAIL. Cap d6 is open ground. DECISION: drop the rail on the cap
    // (and deal with the watchman on c1, who covers the firing square d3).
    level(7, [
      '########',
      '########',
      '###.####',
      '###.K###',
      '###.####',
      '###..###',
      '####.###',
      '##n....#',
    ], { moveLimit: 6 }),
    // ══ L8 — THE WRONG LANE. The open e-file ends in a lava cap and a lava
    // gutter; the live lane is c. DECISION: which lane can ever hold a rail?
    level(8, [
      '##.#~p##',
      '#K...###',
      '##.#.~##',
      '##.#.~##',
      '##.n.###',
      '####.###',
      '####.###',
      '......##',
    ], { moveLimit: 6 }),
    // ══ L9 — THE CHIMNEY. A walled pawn stands ON the cap. DECISION: take the
    // cap (the stun saves her), rail BEHIND her on f5, bank backwards.
    level(9, [
      '########',
      '########',
      '######K#',
      '####...p',
      '####.###',
      '####n###',
      '####.###',
      '..n..###',
    ], { moveLimit: 5 }),
    // ══ L10 — THE LONG HALL. Exposed king, five back rooms, near lane lava-capped,
    // one start square. DECISION: never touch the rank you will bank onto.
    level(10, [
      '########',
      '##.#~#**',
      '##....K*',
      '...#.#**',
      '.###n###',
      '.....###',
      '.#######',
      '.#######',
    ], { moveLimit: 8 }),
  ],
};

export default RUN_REVENGE_61;
