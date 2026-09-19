/**
 * revenge-54 — THE CALDERA. Built 2026-09-19 (ten-run batch) for the signature
 * pair PUPPET + DRAGON. Kit = puppet / dragon / aegis / hourglass
 * (`allowedAbilities` IS the kit). ABILITY-FIRST: the levels exist to show off
 * Puppet. The partner stayed Dragon — no swap was needed.
 *
 * THE VERB: PULL HIS STRING. Every finale has a king no rook line, queen line
 * or walk can ever reach — he stands inside a lava crater (or in a stone cell
 * behind a lava lake) and the ONLY geometry that crosses lava is a knight's
 * jump, or one diagonal slit. Every square that jump or slit needs is held by
 * one of his own guards, frozen on the crater's rim, DEFENDED, so nothing can
 * take it and live. Puppet makes that guard take one legal move of its own —
 * into the lava (rule R1), or into his own court — and the Dragon lands where
 * it stood, the same turn.
 *
 * WHY THIS PAIR, read out of lib/run/abilities.ts:
 *   - PUPPET (T1): one charge, a FREE action. Targets the first guard on her
 *     rook lines at any distance. The first lava square along one of its own
 *     moves is a legal destination and burns it (her capture, king stunned).
 *     "Nobody walks into lava on their own" is what makes a rim guard
 *     authorable at all: a knight whose only jumps are lava is frozen forever
 *     under the enemy AI and still has a Puppet move. Same trick without
 *     lava: guards never step INTO the king's pen on their own (pawn-ai
 *     `approachMove`), so a knight whose only jump is a pen square is frozen
 *     for the AI and walkable for the player (L5's quiet move is the third
 *     kind: a square that is never strictly closer to her).
 *   - DRAGON (T1): one charge, spawns BESIDE her only, two turns, queen +
 *     knight moves, may move the turn it lands. So "cast, spawn on the vacated
 *     post, leap the lava" is ONE turn and he never gets a reaction.
 *   - Fillers: AEGIS (tempting: "take the defended sentry and eat the reply" —
 *     she survives and is standing on the post herself, with nothing that can
 *     jump) and HOURGLASS (the catalogue's proven inert filler).
 *
 * ── CONSTANT SIGNATURE — THE CRATER ────────────────────────────────────────
 * Every level draws a lava crater and posts guards on its rim. The crater
 * changes shape, size and place on every level (the terrain experiment):
 *   L1 3x3 ring, centre      L2 4x3 ring with a knight INSIDE it
 *   L3 ring on the east edge L4 ring top-centre, he is on the island
 *   L5 ring on the west edge L6 tall ring running off the top of the board
 *   L7 ring in the NW corner L8 a SOLID 3x3 lake, no island, centre
 *   L9 a 4-square corner pool  L10 a wide 2-island ring with a lava VEIN
 *   leaking down the c-file under a rim pawn.
 * From L3 on the board is carved from solid stone (the Warren / Oubliette
 * rules): one shaft per level, the key square at the TOP of the shaft and the
 * nearest reachable square to the king, so the bot's Chebyshev term climbs
 * monotonically to it. L7-L10 open ranks 1-2 as a floor for hunters.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none   — crater drawn, walk round it. Still king.
 *   L2  none   — first fleeing king, one-square pen; a knight hops out of the
 *                crater to hunt.
 *   L3  PUPPET KEY (the burn). A knight plugs her file to him, two frozen
 *                knights defend it. Make it jump into the crater; the file is
 *                open and she takes him the same turn. AEGIS is a co-key
 *                (take the plug, eat the reply). Dragon 0%: it trades itself
 *                for the plug and a defender becomes the new plug.
 *   L4  DRAGON KEY (the leap). He is on the island; one post is empty. Stand
 *                under it, summon on it, jump the lava.
 *   L5  PUPPET KEY (the quiet move). Same plug, NO lava in reach: walk it
 *                sideways off the file. AEGIS co-key again.
 *   L6  DRAGON KEY (take the sentry). The post is occupied but undefended:
 *                the dragon eats the sentry (stun) and leaps next turn.
 *   L7-L10 the pair. none / puppet / dragon / aegis / hourglass all 0%.
 *
 * ── THE FOUR FINALE LINES ──────────────────────────────────────────────────
 *   L7  THE SENTRY. K c7 on the island (ring b6-d8). Knight d5 stands on his
 *       one reachable knight-square, defended by a sealed knight f6.
 *       Line: Rd1-d4; Puppet d5 -> b6 (lava, burns); Dragon on d5; Dd5xc7.
 *       DECISION (8 words): burn the sentry, land on its post, leap.
 *
 *   L8  THE SLIT. No island: a solid lake d3-f5, and he is in a stone cell at
 *       e7 whose only opening is the diagonal e7-d6-c5-b4. Knight c5 plugs it
 *       (pawn b6 defends; pawn c7 covers d6 so nothing may STAND there).
 *       Line: Rc1-c4; Puppet c5 -> d3/e4 (lava); Dragon on b4; Db4xe7 down
 *       the slit. A LINE, not a leap, and the dragon goes BESIDE her, not on
 *       the vacated square.
 *       DECISION: burn the plug; fire along the rim.
 *
 *   L9  THE WATCHER. Corner pool (a7 b7 c7 c8), K b8. The sentry on the post
 *       is pawn d7 — pinned, no legal move, so Puppet CANNOT touch it — and
 *       knight c5 watches it (pawn d6 defends the watcher).
 *       Line: Rc1-c4; Puppet c5 -> b7 (lava); Dragon on c5; Dc5xd7 (stun);
 *       next turn Dd7xb8. Two turns: she must survive a phase on c4 with
 *       hunters on the floor.
 *       DECISION: burn the watcher, not the sentry; dragon eats.
 *
 *  L10  THE TWO WATCHERS. K e8 on a two-square island. Sentry pawn f6 is
 *       watched TWICE: bishop d4 (on her shaft, undefended) and knight d5
 *       behind it (defended by rim pawn c6, which stands over the lava vein).
 *       The bishop is the first thing her line hits, it is Puppet-able (c5 is
 *       lava) — and spending the string on it loses, because the knight then
 *       has no answer. Line: Rd1xd4 (the ROOK takes the first watcher);
 *       Puppet d5 -> c7/e7 (lava); Dragon on d5 (or e5); Dxf6; next turn
 *       Df6xe8.
 *       DECISION: rook takes one watcher; save the string.
 *
 * What each adds that L7 does not cover: L8 turns the leap into a line and
 * moves the spawn square; L9 makes the target the DEFENDER and the payoff two
 * turns; L10 makes the first legal Puppet target the wrong one.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, `revenge.ts matrix` ──────────
 * Numbers of record: 32 trials, --jobs=2 (shared machine, per the brief), T1
 * cards, T5 bot.
 *
 *   L    none  puppet  dragon  aegis  hourglass | puppet+dragon
 *   7      0%     0%      0%     0%      0%     |     69%
 *   8      0%     0%      0%     0%      0%     |     72%
 *   9      0%     0%      0%     0%      0%     |     84%
 *  10      0%     0%      0%     0%      0%     |     72%
 *
 * THE GATE IS MET: 20 cells of zero, pair 69/72/84/72 (L9 four points over
 * the band). HONESTY NOTE ON WHAT THE PAIR NUMBER MEASURES: without hunters
 * every finale read 100% for the pair even at a zero-slack clock — the lines
 * are short and forced, and the T5 bot never misses them. The spread above is
 * bought entirely with floor hunters + `enemiesPerTurn: 2`, and it is very
 * sensitive to WHERE the knights start (L7: a2/h2 100%, b2/g2 69%, a2/e2/h2
 * 34%; L9: f2/h2 84%, a2/g2 53%; L10: a2/g2 97%, g2/h2 72%). The bot's
 * losses are mostly dithering on the floor and, sometimes, spending the
 * string on a hunter — a real human mistake too. Read the 0% singles as solid
 * and the 69-84% as "tuned pressure", not as proof the puzzle itself is hard.
 *
 * TIER LADDER, L7-L10, 32 trials:
 *   dragon  T1 0/0/0/0   T2 0/0/0/53   T3 0/0/0/75   T5 41/31/28/100
 *   puppet  T1 0/0/0/0   T3 0/0/0/0    T5 0/0/0/0
 * `abilityTierCaps: { dragon: 1 }`. The break is the third dragon TURN on
 * L10: rook takes the bishop, then the dragon has time to eat a watcher AND
 * the sentry. Puppet needs no cap at any tier — nothing she owns crosses lava.
 *
 * MID-RUN, 16 trials:
 *   L    none  puppet  dragon  aegis  hourglass
 *   1-2  100%   100%    100%   100%    100%
 *   3      0%   100%      0%   100%      0%   (puppet KEY, aegis co-key)
 *   4      0%     0%    100%     0%      0%   (dragon KEY, clean)
 *   5      0%   100%      0%   100%      0%   (puppet KEY, aegis co-key)
 *   6      0%     0%    100%     0%      0%   (dragon KEY, clean)
 *
 * FULL RUNS, 24 runs, T5 (read before the cap went in): random picks 2/24 =
 * 8%; `--pool=puppet,dragon` 2/24 = 8%. Low because L3-L6 are hard 0%/100%
 * gates: a run that does not hold the right half on the right level ends
 * there. The cheap lever, if Tyler wants it softer, is offering on L2.
 *
 * ── DEAD ENDS ──────────────────────────────────────────────────────────────
 * 1. A CRATER IN THE DEAD CENTRE IS UNMEASURABLE. With the king mid-board
 *    every square two away scores the same, and a failed rollout returns a
 *    flat -100 at the move limit, so the bot shuffles on rank 1 (pair 0-17% on
 *    four correct builds). King high, shaft vertical, key at the shaft's top.
 * 2. PAWN SENTRIES ABOVE LAVA PUT THE KEY ON THE FAR RIM (pawns only step
 *    down), a four-move flat approach. Finale sentries are knights: a knight
 *    on a king's knight-square ALWAYS has exactly one jump into the ring.
 * 3. A DEFENDER STANDING ON ANOTHER POST is a free dragon solo (eat it, leap
 *    from there): 83-92%. Defenders live on sealed non-post squares.
 * 4. AN UNDEFENDED WATCHER lets the ROOK do Puppet's job (dragon 75%).
 * 5. A PAWN DEFENDER RECAPTURES AND THEN MARCHES OFF the file (L3/L5 v1:
 *    dragon 100%). Frozen knight defenders stay put.
 * 6. NICHES ABOVE THE FLOOR (hunters parked on rank 3) are bot traps: she
 *    takes the knight and shuffles in the niche. Hunters start ON the floor.
 * 7. "Dragon first, THEN pull the string" (an order level) could not be
 *    built: any square she can see the plug from is beside the dragon's line.
 */

import { FLEE, LAVA, STILL, X, make, type LevelBuilder } from '../run-kit';
import type { RunDef } from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

/**
 * A level drawn as a picture. Eight rows, RANK 8 FIRST, eight characters each:
 *   #  stone      ~  lava       .  open ground
 *   K  the king   _  an empty square of his pen (K's own square is in it too)
 *   p n b q       his guards
 */
function draw(
  level: number,
  rows: string[],
  opts: { moveLimit: number; still?: boolean; enemiesPerTurn?: number },
): LevelBuilder {
  if (rows.length !== 8 || rows.some((r) => r.length !== 8)) {
    throw new Error(`revenge-54 L${level}: a board is 8 rows of 8`);
  }
  const pieces: EnemyPiece[] = [];
  const hazards: Hazard[] = [];
  const pen: string[] = [];
  const TYPES = { p: 'pawn', n: 'knight', b: 'bishop', q: 'queen', K: 'king' } as const;
  rows.forEach((row, i) => {
    const rank = 8 - i;
    [...row].forEach((ch, j) => {
      const file = j + 1;
      const name = `${String.fromCharCode(96 + file)}${rank}`;
      if (ch === '#') hazards.push(X(file, rank));
      else if (ch === '~') hazards.push(LAVA(file, rank));
      else if (ch === '_') pen.push(name);
      else if (ch === '.') return;
      else if (ch in TYPES) {
        pieces.push({ type: TYPES[ch as keyof typeof TYPES], color: 'black', file, rank });
        if (ch === 'K') pen.push(name);
      } else throw new Error(`revenge-54 L${level}: unknown square '${ch}'`);
    });
  });
  return make(level, pieces, {
    ...(opts.still ? STILL : FLEE),
    moveLimit: opts.moveLimit,
    hazards,
    ...(opts.still ? {} : { kingPen: pen }),
    ...(opts.enemiesPerTurn ? { enemiesPerTurn: opts.enemiesPerTurn } : {}),
  });
}

export const RUN_REVENGE_54: RunDef = {
  id: 'revenge-54',
  name: 'The Caldera',
  blurb:
    'A crater of lava, and his guards posted on the rim. Nothing crosses lava but a knight\'s jump — and every square that jump needs has one of his men standing on it, defended. So pull the string: make the guard take one step of its own, into the fire, and put the dragon where it stood.',
  allowedAbilities: ['puppet', 'dragon', 'aegis', 'hourglass'],
  // Measured L7-L10, 32 trials: dragon T1 0/0/0/0, T2 0/0/0/53, T3 0/0/0/75,
  // T5 41/31/28/100. Puppet 0% at T1/T3/T5 — no cap.
  abilityTierCaps: { dragon: 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — walk round the crater (still king).
    draw(1, [
      '........',
      '....K...',
      '..p.p...',
      '..~~~...',
      '..~.~...',
      '..~~~...',
      '........',
      '........',
    ], { still: true, moveLimit: 12 }),
    // L2 — first fleeing king; a knight hops out of the crater.
    draw(2, [
      '#####...',
      '......K#',
      '.....p..',
      '.~~~~...',
      '.~n.~...',
      '.~~~~...',
      '........',
      '........',
    ], { moveLimit: 14 }),
    // L3 PUPPET KEY — make the plug jump into the lava.
    draw(3, [
      '########',
      '##nKn###',
      '###.#~~~',
      '###n#~.~',
      '###.#~~~',
      '###.####',
      '###.####',
      '........',
    ], { moveLimit: 10 }),
    // L4 DRAGON KEY — summon on the empty post, leap the lava.
    draw(4, [
      '########',
      '###~~~##',
      '###~K~##',
      '##p~~~##',
      '###.####',
      '###.####',
      '###.####',
      '........',
    ], { moveLimit: 10 }),
    // L5 PUPPET KEY — no lava in reach: walk the plug sideways.
    draw(5, [
      '########',
      '####nKn#',
      '#p###.#.',
      '~~~##n##',
      '~.~##.##',
      '~~~##.##',
      '#####.##',
      '........',
    ], { moveLimit: 10 }),
    // L6 DRAGON KEY — eat the lone sentry, leap next turn.
    draw(6, [
      '###~~~##',
      '###~K~##',
      '##n~_~##',
      '##.~~~##',
      '##.#####',
      '##.#####',
      '##.#####',
      '........',
    ], { moveLimit: 10 }),
    // L7 THE SENTRY — burn the sentry, land on its post, leap.
    draw(7, [
      '#~~~####',
      '#~K~####',
      '#~~~#n##',
      '###n####',
      '###.####',
      '###.####',
      '.n....n.',
      '........',
    ], { moveLimit: 6, enemiesPerTurn: 2 }),
    // L8 THE SLIT — burn the plug; the dragon fires along the rim.
    draw(8, [
      '########',
      '##p#K###',
      '#p#.####',
      '##n~~~##',
      '#..~~~##',
      '##.~~~##',
      'n....n.n',
      '........',
    ], { moveLimit: 6, enemiesPerTurn: 2 }),
    // L9 THE WATCHER — burn the watcher, not the sentry; dragon eats.
    draw(9, [
      '_K~#####',
      '~~~p####',
      '###p####',
      '##n#####',
      '##.#####',
      '##.#####',
      '.....n.n',
      '........',
    ], { moveLimit: 8, enemiesPerTurn: 2 }),
    // L10 THE TWO WATCHERS — rook takes one watcher; save the string.
    draw(10, [
      '##~_K~##',
      '##~~~~##',
      '##p##p##',
      '##~n.###',
      '###b####',
      '###.####',
      '......nn',
      '........',
    ], { moveLimit: 9, enemiesPerTurn: 2 }),
  ],
};

export default RUN_REVENGE_54;
