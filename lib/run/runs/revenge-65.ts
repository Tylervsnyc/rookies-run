/**
 * revenge-65 — THE KALEIDOSCOPE. Built 2026-09-19 (the Mirror batch) for the
 * signature pair MIRROR + CONVERT. Kit = mirror / convert / swap (3 cards,
 * `allowedAbilities` IS the kit). NO `abilityTierCaps` (Tyler's standing rule).
 *
 * THE IDEA — THREE BODIES, ONE BODY-MOVE A TURN. Her, her reflection, and a
 * stolen piece. Only one body moves per turn — but the echo moves FOR FREE
 * whenever she does, so Mirror is the one way to get two bodies acting in one
 * turn. The finale spine is a tempo trick:
 *     turn A   steal the pawn that stands diagonally under him (free, DAZED)
 *              + her stroke, whose free reflection CAPTURES (he is stunned)
 *     turn A+1 the stolen pawn takes him (a stolen pawn attacks UP the board).
 * Without the stun he simply steps to his other pen square the moment the
 * pawn is stolen, and the card is wasted.
 *
 * ── CONSTANT SIGNATURE — THE THRONE AND THE FURNITURE ──────────────────────
 * An OPEN board with a connected rank-1 floor (any start file works) and
 * left/right SYMMETRIC furniture — pillars, forts with a one-square lane, lava
 * pools — with ONE thing broken per level. From L4 on he sits top-centre on a
 * THRONE no rook line ever reaches: every orthogonal neighbour of his pen is
 * stone or lava, so neither she nor the echo can ever take him (mirror alone
 * is 0% by construction, at every tier). Only a diagonal attacker can — and
 * the only one on the board is his own pawn. Lava is used as furniture with a
 * job: the pool under the throne kills the c7-d6 / e7-f6 diagonals a stolen
 * bishop would use, a lava CORK at the foot of a lane makes it a place where
 * nothing can walk but a reflection can be BORN (L8, L10), and one lava vent
 * (f7) sits where the twin of the stealable pawn would be.
 *
 * WHAT THE CODE SAYS (lib/run/abilities.ts, pawn-ai.ts — the truth):
 *   - the echo copies her DISPLACEMENT flipped left-right, as far as it can,
 *     and takes the first enemy it meets; any capture by her side stuns him;
 *   - Convert has no range; the stolen piece is a controlled summon, dazed the
 *     turn it is taken; the KING never captures a summon, only his men do;
 *   - his men take ONE action a turn and pick the most valuable victim: the
 *     echo (rook, 3) outranks a stolen pawn (1). So a reflection left en prise
 *     is BAIT: it dies and the stolen pawn lives. That is L9/L10.
 *   - a stolen pawn that reaches rank 8 (or captures onto it) PROMOTES to a
 *     queen, and a queen solos a two-square pen: no stealable pawn here can
 *     step or capture onto rank 8 inside the clock.
 *
 * DESIGN RULES THE BOTS TAUGHT (each was a measured leak, then closed):
 *   1. NO FREE CAPTURE for her on any finale. Any capture + a same-turn steal
 *      is the whole line, so every piece is either sealed from rook lines,
 *      defended twice by pawns, or behind a lava cork. (A loose hunter read
 *      convert-alone 100%.) This is why the finales have no roaming hunters —
 *      the hunters live on L4-L5.
 *   2. No stealable piece may CAPTURE ONTO a square that attacks his pen
 *      (stolen bishop a5xc7: convert:3 67%; stolen knight a8xc7 hitting e8:
 *      100%; knight f7xe5 hitting d7: 13%). Hence the stone on b6, the lava on
 *      d6/e6, and the stair pen {d8,e7} wherever a knight bodyguards c7.
 *   3. A pawn bodyguard on b8 is a promotion square for the thief (c7xb8=Q):
 *      the bodyguard is a walled KNIGHT in the corner niche instead.
 *   4. Guards are walled BISHOPS between two sealed pawn sentries: a bishop
 *      does not march, and a stolen one is eaten by its own sentries at once.
 *   5. Bot: a stroke that goes UP after a quiet step back is unfindable (0-22%
 *      three times); strokes start from the floor or FALL from the lane top.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none     the furniture, drawn. A still king; walk round the pool.
 *   L2  none     the throne unsealed; take a marcher on his file, then him.
 *   L3  MIRROR   THE TWIN CHIMNEYS (dead simple): his chimney is corked with
 *                lava, yours is open. Climb, cast, walk up. (CONVERT co-key:
 *                a pawn is walled in beside him — steal, wait, strike. Either
 *                card you picked on L1 teaches itself here.)
 *   L4  CONVERT  THE THIEF. Sealed throne, one-square pen. Two pawns flank it;
 *                only c7 attacks d8. Steal, dodge the knight, strike.
 *   L5  CONVERT  THE STUN. Two-square pen: steal alone and he sidesteps. Take
 *                a knight or a pawn yourself THE SAME TURN you steal.
 *   L6  MIRROR   TWO ROOKS. Open throne: stand under him and he steps aside —
 *                onto the reflection's file. One stroke to rank 8.
 *   L7-L10       the pair. SWAP is a TRAP on all four (nothing of hers ever
 *                has a line to him; swapping onto c7 just gets her swung at).
 *
 * ── THE FOUR FINALE LINES ──────────────────────────────────────────────────
 *   L7  THE STUN. Two forts; the guard bishop stands on b4 on his side, g5 on
 *       hers (offset furniture), each between two sealed sentries: she can
 *       never afford one. Line: (floor) g1, MIRROR (echo b1), CONVERT c7,
 *       g1-g4 — the echo runs b1xb4 — then c7xd8. From the left her stroke is
 *       one square short. DECISION: the reflection takes what you cannot.
 *   L8  BORN INSIDE. His lane is corked with lava (b2): nothing walks in.
 *       Line: g1-g3, MIRROR (echo born b3, above the cork), CONVERT c7,
 *       g3-g5 — echo b3xb5 — c7xd8. DECISION: cast from the rung, not the floor.
 *   L9  THE BAIT. c7 now has a bodyguard (knight a8): a stolen pawn is eaten
 *       the same night. Two guards: a4 is loose behind a cork (take it and
 *       nobody eats the echo — the knight eats the thief), c4 is sentried.
 *       Her own twin landing f4 is watched by g5/h6. Line: f1, MIRROR (c1),
 *       CONVERT c7, f1-f5 (slide PAST f4; the echo stops on c1xc4 and is
 *       eaten in the thief's place), c7xd8. DECISION: you WANT it to die.
 *   L10 THE FALL (the throne reflected: king e8, thief f7, bodyguard h8, she
 *       works from the LEFT). The guard f3 sits on its cork; the only way in
 *       is from above. Line: c1-c5, MIRROR (echo born f5), CONVERT f7, c5-c2
 *       — c3 is watched by b4/a5, slide past — echo falls f5xf3, is eaten;
 *       f7xe8. DECISION: climb first; the reflection falls on him.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, T5 bot, `revenge.ts matrix`,
 *    32 trials, --jobs=4 ────────────────────────────────────────────────────
 *   L    none  mirror  convert  swap | mirror+convert
 *   7      0%     0%      0%     0%  |     72%
 *   8      0%     0%      0%     0%  |     75%
 *   9      0%     0%      0%     0%  |     78%
 *  10      0%     0%      0%     0%  |     78%
 *   TIER LADDER, same four levels, every cell 0%: mirror T2/T3/T5, convert
 *   T2/T3/T5 (minors, queen, the second theft), swap T5; also mirror+swap and
 *   convert+swap 0/0/0/0 — ONE winning pair. The pair upgrades gently:
 *   mirror:3+convert:3 72/72/78/91, T5+T5 91/75/84/94.
 *   MID-RUN, 16 trials:   none  mirror  convert  swap
 *     L1/L2               100    100     100     100
 *     L3                    0    100     100       0
 *     L4                    0      0     100       0
 *     L5                    0      0      88       0
 *     L6                    0    100       0       0
 *   FULL RUNS: 40 runs random picks from the kit 0/40 (L4 68%, L6 68%, L7 29%
 *   — most arrive without both halves); pool=mirror,convert 7/40, finale
 *   82/83/73/64. Pick-dependent by design.
 *   HONEST NOTES: the band is met by geometry + one watched square, not by
 *   hunters — rule 1 forbids them. L7's and L8's player line is the same
 *   sentence with a different cast square; L9/L10 add a real second idea.
 *   Cut as provable-but-unfindable (0%): a corner-stone DESYNC (cast, sidestep
 *   where the echo cannot follow, stroke) and a TWO-CAPTURE lane (echo eats a
 *   marcher, then the guard). Both are good human levels for a later pass.
 *   PIECES (enemies excl. king): L1 2, L2 4, L3 3, L4 5, L5 5, L6 4, L7 7,
 *   L8 4, L9 8, L10 7.
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

export const RUN_REVENGE_65: RunDef = {
  id: 'revenge-65',
  name: 'The Kaleidoscope',
  blurb:
    'Every room is the same room twice, left and right, with one thing out of place. He sits on a throne no rook line reaches. But a stolen pawn strikes upward, a reflection moves for free — and whatever your side captures holds him still for exactly one turn.',
  allowedAbilities: ['mirror', 'convert', 'swap'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE FURNITURE. Decision: walk round the pool to his rank.
    level(1, [
      '...k....',
      '..#..#..',
      '.p....p.',
      '...~~...',
      '...~~...',
      '.#....#.',
      '........',
      '........',
    ], { ...STILL, moveLimit: 12 }),
    // L2 — THE OPEN THRONE. Decision: take the marcher on his file, then him.
    level(2, [
      '..#k.#..',
      '.p....p.',
      '...pp...',
      '.#....#.',
      '...~~...',
      '.#....#.',
      '........',
      '........',
    ], { ...FLEE, moveLimit: 12, kingPen: ['d8', 'e8'] }),
    // L3 — THE TWIN CHIMNEYS (mirror KEY, convert co-key). Decision: climb the twin, cast, walk up.
    level(3, [
      '##k##.##',
      '##.p#.##',
      '##.##.##',
      '##.~~.##',
      '..~~~...',
      '.p....p.',
      '.#....#.',
      '........',
    ], { ...FLEE, moveLimit: 8, kingPen: ['c8'] }),
    // L4 — THE THIEF (convert KEY). Decision: which pawn strikes upward at him?
    level(4, [
      '..#k#...',
      '..p##p..',
      '..#..#..',
      '....n...',
      '.p.~~.p.',
      '...~~...',
      '........',
      '........',
    ], { ...FLEE, moveLimit: 10, kingPen: ['d8'] }),
    // L5 — THE STUN (convert KEY). Decision: capture and steal in the same turn.
    level(5, [
      '..#k.#..',
      '..p##~..',
      '..#~~#..',
      '.n....n.',
      '...~~...',
      '.p.~~.p.',
      '.#....#.',
      '........',
    ], { ...FLEE, moveLimit: 10, kingPen: ['d8', 'e8'] }),
    // L6 — TWO ROOKS (mirror KEY). Decision: he sidesteps onto the reflection's file.
    level(6, [
      '..#k.#..',
      '........',
      '.p....p.',
      '.#~..~#.',
      'p.~..~.p',
      '#......#',
      '...~~...',
      '........',
    ], { ...FLEE, moveLimit: 6, kingPen: ['d8', 'e8'] }),
    // L7 — THE STUN, REFLECTED. Decision: the echo takes the guard you cannot afford.
    // Broken symmetry: his bishop b4, hers g5 (one rank higher); f7 lava where c7 is a pawn.
    level(7, [
      '..#k.#..',
      '..p##~..',
      '###~~p#p',
      'p#p~~#b#',
      '#b#..#.#',
      '#.#..#.#',
      '........',
      '........',
    ], { ...FLEE, moveLimit: 5, kingPen: ['d8', 'e8'] }),
    // L8 — BORN INSIDE. Decision: cast from the rung above the lava cork.
    // Broken symmetry: lava b2 (g2 open); the right fort is empty.
    level(8, [
      '..#k.#..',
      '..p##~..',
      'p#p~~###',
      '#b#~~#.#',
      '#.#~~#.#',
      '#.#..#.#',
      '.~......',
      '........',
    ], { ...FLEE, moveLimit: 6, kingPen: ['d8', 'e8'] }),
    // L9 — THE BAIT. Decision: take the sentried guard; the echo dies for the thief.
    // Broken symmetry: bishops a4/c4 have no twins; g5/h6 watch her twin landing f4.
    level(9, [
      'n##k#...',
      '##p#.###',
      '.##~~##p',
      '#p#p~.p#',
      'b#b#..#.',
      '.#.##.#.',
      '~.......',
      '........',
    ], { ...FLEE, moveLimit: 7, kingPen: ['d8', 'e7'] }),
    // L10 — THE FALL. Decision: climb, cast, stroke DOWN past the watched square.
    // The throne reflected. Broken symmetry: f2 lava + bishop f3; b4/a5 watch c3.
    level(10, [
      '...#k##n',
      '###.#p##',
      '###~~##.',
      'p#.##.#.',
      '#p.~p.p#',
      '.#.##b#.',
      '.#.##~#.',
      '........',
    ], { ...FLEE, moveLimit: 5, kingPen: ['e8', 'd7'] }),
  ],
};

export default RUN_REVENGE_65;
