/**
 * revenge-60 — THE LOOKING GLASS. Built 2026-09-19 (the ten-run batch) for the
 * signature pair MIRROR + SWAP. Kit = mirror / swap / aegis / magnet
 * (`allowedAbilities` IS the kit). LEVEL-FIRST: the level came first and
 * Mirror was invented to solve it.
 *
 * ── CONSTANT SIGNATURE — THE GLASS ─────────────────────────────────────────
 * A seam of LAVA runs down the d/e files (the glass). On each side of it
 * stands one stone tube, and the two halves of the board are mirror images of
 * each other — file f <-> 9 - f — except for ONE STONE. One stone is missing
 * from her side, or has been moved: that is the whole terrain experiment, and
 * on every level that stone IS the puzzle. The run's constant is THE CORK: the
 * foot of the tube on HIS side of the glass is bricked, the foot of its twin is
 * open. Nothing of hers ever walks into his half. Only a reflection is born
 * there.
 *
 * WHAT MIRROR IS, read out of lib/run/abilities.ts (the code is the truth):
 *   - the echo is born on file 9 - f, same rank, if that square is empty
 *     ground — INSIDE a sealed tube if that is where her twin square is;
 *   - it copies the DISPLACEMENT of each of her moves, flipped left-right, as
 *     far as it legally can: it stops short at a block and stops on (and
 *     takes) the first enemy it meets. So a stone on one side only DESYNCS the
 *     two bodies. That is what "one broken symmetry" buys;
 *   - T1 copies three of her moves; he fears the echo only through a move she
 *     can actually make RIGHT NOW (`mirrorEchoReach`), so an echo sitting on
 *     his line is invisible to him when her own twin stroke is bricked.
 *   SWAP trades her with the echo: a free teleport across the glass. It is
 *   inert alone in this kit (no other summon) — 0% everywhere, by construction.
 *
 * START FILE: `randomizedRookieStart` (lib/run/seed.ts) picks any rank-1 file
 * that is not occupied and has a blocker ahead — on these carved boards that
 * is all eight files. So rank 1 is ALWAYS an open, connected floor (never split
 * by the glass: a start on a bricked-off left floor would be unwinnable), and
 * no design depends on her file: the only thing a start changes is one floor
 * move to the foot of the open tube. Mirror's square is 9 - f of wherever she
 * STANDS, so the designs are written in rungs (ranks of the tube), not files.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none    the glass, drawn; the cork is on the WRONG side. Walk up.
 *   L2  none    his tube is open, a pawn marches down it at her.
 *   L3  MIRROR  THE TWIN — the archetype. Cork b2; climb the twin, cast, one
 *               stroke up and the reflection takes him.
 *   L4  MIRROR  THE RATCHET — her tube is lidded (the stone that belongs on g3
 *               sits on h4). Cast on h3, slide h3-f3 (the echo cannot follow:
 *               b3 is stone), then f3-f7 and the echo runs a3-a7. SOFT: 56%.
 *   L5  AEGIS   THE PLUG — he is on HER side behind a knight a pawn defends.
 *               (MAGNET is a measured co-key: it drags the knight off its
 *               defender. Both fillers get their one level here.)
 *   L6  MIRROR  TWO BODIES — she takes a loose knight on her side (stun) and
 *               the same stroke puts the echo on his rank; step left, it takes.
 *   L7-L10      the pair. Every single card 0% at every tier.
 *   AEGIS / MAGNET are TRAPS on all four finales: nothing of hers is ever
 *   adjacent to him or on a line with anything of his.
 *
 * ── THE FOUR FINALE LINES ──────────────────────────────────────────────────
 *   L7  THE DOOR. Cork b2, her tube lidded at g5 (max up-stroke 3, he is 4
 *       above the cork, so no ratchet reaches him). A pinned pawn h5 watches
 *       the top rung g4. Line: g1-g3, MIRROR (echo b3), SWAP, b3xb7.
 *       DECISION: the echo is not a weapon, it is a door.
 *   L8  ARRIVE UNSEEN. Pen c7/c8 — a rook that WALKS onto rank 7 is seen and
 *       he steps up, forever. Broken stone: g7. Two knights on the floor, two
 *       enemies a turn. Line: h1-h7, MIRROR (echo a7, on his rank; he does not
 *       fear it because g7 bricks her twin stroke), SWAP, a7xc7.
 *       DECISION: stand on the twin of the square you want to strike from.
 *   L9  THE RELAY. Same pen, and the only stun on the board is a knight on g7
 *       that a pinned pawn h8 defends: she cannot take it and live. Broken
 *       stone: f7. Line: g1-g3, MIRROR, SWAP FIRST, then b3-b7 — the same
 *       stroke sends the echo g3xg7. It dies there; he is stunned; b7xc7.
 *       DECISION: swap first — the reflection is the one you can afford to lose.
 *   L10 THE LID. Pen c6/c5; the twin of the kill square a6 is h6, and two
 *       stacked pawns (g6, g7, the upper defended by f8) make h5 and h6 death
 *       to stand on. Broken stone: a7, a lid on HIS tube only. Line: h1-h4,
 *       MIRROR (echo a4), h4-h7 — she slides THROUGH the watched squares, the
 *       echo stops under the lid on a6 — then SWAP LAST, a6xc6.
 *       DECISION: cast first, stroke, swap last. The stone parks the echo.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, T5 bot, `revenge.ts matrix`,
 *    32 trials, --jobs=2 (nine other authors on the machine) ────────────────
 *   L    none  mirror  swap  aegis  magnet | mirror+swap
 *   7      0%     0%    0%     0%     0%   |    100%
 *   8      0%     0%    0%     0%     0%   |     84%
 *   9      0%     0%    0%     0%     0%   |    100%
 *  10      0%     0%    0%     0%     0%   |     72%
 *   also 0% on all four: mirror+aegis, mirror+magnet (12 trials).
 * THE GATE IS CLEAN (20 cells of zero); THE BAND IS NOT MET ON L7 AND L9.
 * Why, honestly: a teleport line is [walk to a rung] + [cast, swap, capture
 * in ONE turn], and the bot never misses a payoff that lands the turn it
 * casts. Minimum clocks, floor knights, two enemies a turn and a poisoned
 * rung all read 100%. The only thing that taxes it is a TURN BETWEEN THE CAST
 * AND THE PAYOFF — L10 (one quiet stroke) reads 50 / 72 / 88% at 7 / 8 / 9
 * moves, L4's ratchet 56%. A two-turn ratchet before the swap read 0% (built
 * twice, cut: provable-but-unfindable). L10's clock is the only knob that
 * moved a number in this run.
 *
 * TIER LADDER, L7-L10, 32 trials: mirror T2/T3/T4/T5 0/0/0/0 each; swap T5,
 * aegis T5, magnet T5 0/0/0/0. NO `abilityTierCaps`: a longer-lived or second
 * echo still cannot make a stroke her side of the glass does not have, and
 * Swap has nothing to trade with. The gate is geometric, not tier-bound.
 *
 * MID-RUN, 16 trials:   none  mirror  swap  aegis  magnet
 *   L1/L2               100    100    100    100    100
 *   L3                    0    100      0      0      0
 *   L4                    0     56      0      0      0   (SOFT — the ratchet)
 *   L5                    0      0      0    100    100   (two filler keys)
 *   L6                    0    100      0      0      0
 *
 * FULL RUNS, 20 runs, random picks from the kit: 0/20. Most die on L3-L5
 * (mirror not yet held, or no filler for L5); 3 reached L7, none held both
 * halves. The ladder is pick-dependent by design; L5's filler gate is the
 * cheap lever if Tyler wants it softer.
 *
 * DEAD ENDS: (1) under PERFECT symmetry mirror-alone == the pair, always — any
 * stroke the echo needs, her twin half can supply; so every finale is cork +
 * exactly one more broken stone, and that stone is what kills mirror-alone.
 * (2) Edible pawns beside her tube leak: she eats her way onto the twin of
 * his cell and strokes (mirror alone 100% on a first L10) — a watcher must be
 * DEFENDED. (3) A twin tube tall enough for a 4-stroke from the floor is a
 * ratchet: down to rank 1 (the cork holds the echo), then up (L7 v2, 100%).
 */
import { FLEE, LAVA, STILL, X, bishop, king, knight, make, pawn, queen, type RunDef } from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

/**
 * THE PLATE. A level is drawn as eight strings, rank 8 first, file a first:
 *   '#' stone   '~' lava (the glass)   '.' open ground
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
  const { pieces, hazards } = plate(rows);
  return make(n, pieces, { ...opts, hazards });
};

export const RUN_REVENGE_60: RunDef = {
  id: 'revenge-60',
  name: 'The Looking Glass',
  blurb:
    'A seam of lava down the middle of the board, and everything on his side of it is the mirror image of everything on yours — except one stone. The door to his tube is bricked from your side; its twin is open. Nothing of yours will ever walk in there. But a reflection can be born there.',
  allowedAbilities: ['mirror', 'swap', 'aegis', 'magnet'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE GLASS. Decision: walk up the open tube.
    level(1, [
      '###~~###',
      '#k#~~#.#',
      '#.#~~#.#',
      '#.#~~#.#',
      '#.#~~#.#',
      '#.#~~#.#',
      '#.#~~###',
      '........',
    ], { ...STILL, moveLimit: 12 }),
    // L2 — THE PAWN IN THE TUBE. Decision: take the marcher, then him.
    level(2, [
      '###~~###',
      '#k#~~#.#',
      '#.#~~#.#',
      '#p#~~#.#',
      '#.#~~###',
      '#.#~~#.#',
      '#.#~~#.#',
      '........',
    ], { ...FLEE, moveLimit: 12, kingPen: ['b7'] }),
    // L3 — THE TWIN (mirror KEY). Decision: climb the twin, let the echo strike.
    level(3, [
      '###~~###',
      '#k#~~#.#',
      '#.#~~#.#',
      '#.#~~#.#',
      '#.#~~#.#',
      '#.#~~#.#',
      '###~~#.#',
      '........',
    ], { ...FLEE, moveLimit: 10, kingPen: ['b7'] }),
    // L4 — THE RATCHET (mirror KEY). Decision: sidestep where the echo cannot follow.
    // The moved stone: g3's stone sits on h4.
    level(4, [
      '########',
      'k#.~~.#.',
      '.#.~~.#.',
      '.#.~~.#.',
      '.#.~~.##',
      '.#.~~...',
      '##.~~.##',
      '........',
    ], { ...FLEE, moveLimit: 10, kingPen: ['a7'] }),
    // L5 — THE PLUG (aegis KEY, magnet co-key). Decision: take the defended plug, survive.
    level(5, [
      '###~~###',
      '#.#~~#k#',
      '#.#~~#.#',
      '..#~~#.p',
      '#.#~~#n#',
      '#.#~~#.#',
      '###~~#.#',
      '........',
    ], { ...FLEE, moveLimit: 12, kingPen: ['g7'] }),
    // L6 — TWO BODIES (mirror KEY). Decision: her capture stuns, the echo finishes.
    level(6, [
      '##.~~.##',
      '#.k~~.n#',
      '#.#~~#.#',
      '#.#~~#.#',
      '#.#~~#.#',
      '#.#~~#.#',
      '###~~#.#',
      '........',
    ], { ...FLEE, moveLimit: 10, kingPen: ['c7', 'c8'] }),
    // L7 — THE DOOR. Decision: the echo is a door — swap through.
    // Broken stone: lid g5 (b5 open). Pawn h5 (pinned on h4) watches rung g4.
    level(7, [
      '###~~###',
      '#k#~~#.#',
      '#.#~~#.#',
      '..#~~##p',
      '#.#~~#.#',
      '#.#~~#.#',
      '###~~#.#',
      '........',
    ], { ...FLEE, moveLimit: 5, kingPen: ['b7'] }),
    // L8 — ARRIVE UNSEEN. Decision: stand on the twin of the kill square.
    // Broken stone: g7 (b7 open).
    level(8, [
      '##.~~.##',
      '..k~~.#.',
      '.##~~##.',
      '.##~~##.',
      '.##~~##.',
      '.##~~##.',
      '#.n~~n..',
      '........',
    ], { ...FLEE, moveLimit: 4, enemiesPerTurn: 2, kingPen: ['c7', 'c8'] }),
    // L9 — THE RELAY. Decision: swap first; the echo takes the defended knight.
    // Broken stone: f7 (c7 is his cell).
    level(9, [
      '.#.~~.#p',
      '#.k~~#n#',
      '#.#~~#.#',
      '#.#~~#.#',
      '#.#~~#.#',
      '#.#~~#.#',
      '###~~#.#',
      '........',
    ], { ...FLEE, moveLimit: 6, kingPen: ['c7', 'c8'] }),
    // L10 — THE LID. Decision: cast, stroke through the watch, swap last.
    // Broken stone: a7, a lid on his tube only (h7 open).
    level(10, [
      '##.~~p##',
      '#.#~~#p.',
      '..k~~.p.',
      '.#.~~.#.',
      '.##~~##.',
      '.##~~##.',
      '###~~##.',
      '........',
    ], { ...FLEE, moveLimit: 8, kingPen: ['c6', 'c5'] }),
  ],
};

export default RUN_REVENGE_60;
