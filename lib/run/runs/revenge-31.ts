/**
 * revenge-31 — THE HEARTH. Built 2026-09-06 to test the hypothesis
 * HOURGLASS + SNARE ("arm it, then make them walk into it").
 *
 * ── READ THIS FIRST: THE COMBO GATE IS NOT MET, AND THE PAIR IS THE REASON ──
 * L6-L10 read 0% for no-ability, 0% for hourglass alone AT EVERY TIER, 0% for
 * aegis alone at every tier and 0% for magnet alone at every tier. The terrain
 * gate is as clean as any run in the catalogue. But SNARE ALONE reads 44-75%
 * on all five, and — the finding that matters — ADDING THE GLASS MAKES THE
 * SNARE LINE WORSE, not better, on almost every level measured:
 *
 *      level        snare alone   snare + hourglass
 *      L3 (v1)          75%              66%
 *      L5 (v1)          69%              63%
 *      L6               75%              66%
 *      L7               63%              63%
 *      L9               72%              53%
 *      L10              44%              38%
 *
 * That is not noise (32 trials each, four independent build revisions, the
 * same sign every time). Hourglass is a NET NEGATIVE beside Snare. Five
 * reasons, all read out of the code, and they generalise past this run:
 *
 *  1. SNARE IS A FREE ACTION AND THE KING'S FLEE IS TRIGGERED BY ROOKIE'S OWN
 *     USEFUL MOVE. `applySnare` costs no body-move, and `kingReaction` fires
 *     on the enemy phase that her threatening move already buys. So "arm the
 *     flight square, then step onto his line" is ONE turn. The enemy phase the
 *     glass would buy is a phase she was getting for free anyway.
 *  2. THE GLASS CANNOT EXTEND THE HOLD. `springSnaresAt` sets
 *     `frozenTurnsLeft = holdTurns + 1` and `endTurn` decrements it at once,
 *     so a T1 spring gives Rookie exactly TWO moves to convert. A glass-turn
 *     is an enemy phase, so it BURNS one of those two — turning the glass
 *     after a spring actively shortens the window. This is why every pair cell
 *     above sits below its snare cell.
 *  3. HOURGLASS IS WORTH EXACTLY ONE ROOKIE MOVE (revenge-29's fact 1, which
 *     re-measures true here: a glass-turn and an idle move produce the same
 *     number of enemy phases). At T1 it has ONE use, so the largest clock gate
 *     it can ever open is one move wide. Unlike The Candle, that gate IS
 *     authorable here — the lines are 7-11 moves and `MOVE_LIMIT_FLOOR = 6` is
 *     not binding — and it was tried: the finales were built at ML 7-8 and
 *     re-read at 32 trials. Snare alone did not fall below 25% and the pair
 *     did not rise above it. The wasted move the glass saves is a move the bot
 *     simply does not need to waste, because…
 *  4. …ROOKIE'S WALK ALREADY SPENDS THE PHASES. Every staging square in this
 *     engine is 3-5 moves from a rank-1 start, so 3-5 enemy phases have
 *     already resolved by the time she is in position. A level can only force
 *     a WAIT if it needs MORE phases than her walk — i.e. a long fuse — and a
 *     long fuse is the construction revenge-29 proved unauthorable. There is
 *     no room between "her walk covers it" and "she can arrive late".
 *  5. AT T3+ THE GLASS DELETES THE ONE LINE THAT WOULD HAVE WORKED.
 *     `kingReaction` opens with `if (state.glassTurn?.holdKing) return null`
 *     and `hourglassHoldsKing(tier) = tier >= 3`. So from T3 the king does NOT
 *     flee during a glass-turn: the single construction where the glass makes
 *     him walk into the trap is removed by the card's own upgrade. The pair is
 *     anti-synergistic by construction, and it gets worse as the player
 *     upgrades. `snare + hourglass` belongs in `antiPairs`, next to
 *     snare + freeze-ray ("two cards for one job") and hourglass + smoke
 *     ("the glass burns the window") — it is both at once.
 *
 * A sixth, softer reason limits the hunter-timing escape hatch: the bot's
 * snare candidates are only squares Chebyshev-1 from the KING or from a
 * non-pawn hunter (`candidatesForAbility` in scripts/run-playtest/bots/
 * shared.ts). A knight's landing is never Chebyshev-1 from it, and pawns are
 * excluded from `hunters` entirely, so "trap the knight's landing" and "brake
 * the marching pawn" are both UNFINDABLE unless the square happens to sit in
 * the king's flight set. Per the "provable but unfindable" anti-pattern, those
 * are not shippable levels.
 *
 * WHAT THIS RUN IS INSTEAD: an honest SINGLE-KEY run on a new signature. The
 * terrain gate is real and total (none / hourglass / aegis / magnet all 0% on
 * L6-L10, every tier), the ladder is inside the Moat's 10-25% target (4/40
 * full clears with random picks, 4/40 with the pair-only pool), and Snare is
 * the key at 44-75%. It is CONTENT, not a combo run, so it goes to the
 * pipeline at stage `idea` and is NOT marked `built` — the revenge-29
 * precedent.
 *
 * CONSTANT SIGNATURE — THE HEARTH. A free-standing stone fireplace whose
 * MOUTH FACES AWAY FROM ROOKIE. Thirteen stones, the same five parts on every
 * level, and no other run has this silhouette (the catalogue is bands,
 * columns, boxes in a corner, roofs, diagonals, rings, burrows, a tower with a
 * stair and a blind cell — this is a chimney-piece standing in open board with
 * its opening on the FAR side):
 *   - THE JAMBS. (m-1, 4..6) and (m+2, 4..6): the two side walls, three deep.
 *     They also seal those two FILES, so neither can be climbed from below.
 *   - THE BACK. (m, 3) and (m+1, 3): the floor of the firebox, facing her
 *     start. Nothing ever enters from underneath.
 *   - THE FIREBOX. (m..m+1) x (4..6) — his 2x3 room, and `kingPen`. A lone
 *     rook standing in one column attacks that column and one rank; he steps
 *     up or down the other column for ever. Measured rook-proof: 0%.
 *   - THE LINTEL. Whichever of the two rank-7 squares over the firebox is not
 *     the throat, in stone. It is what makes the corridor one-way.
 *   - THE HOOD. (m-1 .. m+2, 8) in stone, over the whole structure, so no
 *     rank-8 line and no drop from above ever reaches the throat.
 * THE THROAT is the other rank-7 square. Because the jamb files are walled at
 * 4-6 and hooded at 8, and the lintel seals one side of rank 7, the throat can
 * be reached ONLY by walking along rank 7 from the throat's own side of the
 * board — up an outer file, across the shelf, and in. The road is one-way and
 * it is the same road every level; which SIDE it is on is the level's first
 * question, and L2/L4/L8 put it on the right.
 *
 * KIT ROLES (measured, not guessed):
 *   snare       THE key. The only card in the kit that ends a 2x3 firebox:
 *               arm his flight square, step onto his column, he runs into it
 *               and stands still for the two moves she needs. 44-75% on
 *               L6-L10 at every tier from T1 to T5.
 *   hourglass   Never a key and a measurable liability beside Snare (above).
 *               0% alone on L6-L10 at T1, T2, T3, T4 and T5.
 *   aegis       0% alone on L6-L10 at T1, T3 and T5 — nothing in the firebox
 *               can capture her, so a shield buys nothing; the room out-waits
 *               her, it does not kill her. Its moment is L4's defended plug.
 *   magnet      0% alone on L6-L10 at T1, T3 and T5 — the firebox has stone on
 *               both its files below and its rank beside, so there is never a
 *               pull line into it.
 *
 * TIER SWEEP AND CAPS. L7-L10, 32 trials, difficulty=normal, one loadout
 * column per invocation (the harness is honest as of 94482af;
 * matrix-determinism-check PASS 10/16 before any of these were taken):
 *   snare     T1 63/69/72/44 · T2 44/81/81/31 · T3 53/91/84/28 ·
 *             T4 56/75/91/28 · T5 28/91/91/31
 *   hourglass T1..T5 all 0/0/0/0
 *   aegis     T3 and T5 all 0/0/0/0 · magnet T3 and T5 all 0/0/0/0
 * There is no tier BREAK to cap: snare is already the key at T1 and no tier
 * lifts it materially (T4's bite and T5's re-arm change nothing, because the
 * firebox has no guard to bite and one spring is all the line ever needs).
 * `abilityTierCaps` is therefore deliberately absent — a cap costs the player
 * agency and no number here justifies one.
 *
 * MEASURED — numbers of record. `revenge.ts matrix --run=revenge-31
 * --difficulty=normal --trials=32 --jobs=8`, T1 cards:
 *
 *      L    none   snare  hourglass  aegis  magnet | snare+hourglass
 *      1    100%    100%      100%    100%    100% |   100%
 *      2    100%    100%      100%    100%    100% |   100%
 *      3    100%    100%      100%    100%    100% |   100%
 *      4    100%    100%      100%    100%    100% |   100%
 *      5     84%     66%       81%     94%     94% |    66%
 *      6      0%     75%        0%      0%      0% |    66%
 *      7      0%     63%        0%      0%      0% |    63%
 *      8      0%     69%        0%      0%      0% |    78%
 *      9      0%     72%        0%      0%      0% |    53%
 *     10      0%     44%        0%      0%      0% |    38%
 *
 * Full runs, `revenge.ts runs --run=revenge-31 --difficulty=normal --runs=40`:
 * 4/40 full clears with random picks (L5 80%, L6 53%, L7 76%, L8 85%, L9 82%,
 * L10 44%); `--pool=hourglass,snare` also 4/40. 10% is inside the Moat's
 * 10-25% target, and it is honest here for a reason the combo runs cannot
 * claim: the wall is L6 and it is a CARD wall, not a skill wall — a player who
 * never took Snare cannot pass it.
 *
 * DEAD ENDS (four build revisions, all measured, all discarded):
 *   1. A 2x3 firebox with a JAMMED PAWN inside it to shrink his room. The
 *      pawn is a free capture in the one place a capture-stun is worth a
 *      tempo: no-ability jumped to 69-94% on L6-L10. Nothing capturable may
 *      ever stand inside the pen.
 *   2. A MARCHING PAWN in his column as "a clock the player cannot control".
 *      It is not one: the pawn jams against the king after a single phase, and
 *      the jam either kills him outright (hourglass alone read 38% on that
 *      board — the glass just buys the jam early) or does nothing. A pawn
 *      column drains from the BOTTOM (`-rank` priority, one mover per phase),
 *      so a stack of pawns above a blocker never clears in a level's lifetime.
 *   3. TIGHT CLOCKS (ML 7-8) to open the one-move gate the glass could pay
 *      for. Snare alone floored at 25-28%, the pair at 13-38%: the bot does
 *      not need the wasted move, so there is nothing for the glass to save.
 *   4. THE KING IN THE MIDDLE OF HIS COLUMN. His flight is then a TIE between
 *      up and down (`kingFleeMove` takes the farthest safe square) and one
 *      snare is a coin flip: 41% on both L6 and L7. Moving him to the TOP of
 *      the column makes the flee deterministic and the level readable —
 *      63-75%. If a level's answer is one trap, the flee must not be a tie.
 */

import {
  make,
  pawn,
  knight,
  bishop,
  king,
  X,
  STILL,
  FLEE,
  type RunDef,
} from '../run-kit';
import type { Coord } from '../types';

/**
 * THE HEARTH — the constant terrain (see the header). `m` is the left file of
 * the firebox; `throat` is whichever of `m` / `m+1` carries the door.
 */
function HEARTH(m: number, throat: number, extra: Coord[] = []): Coord[] {
  const s: Coord[] = [];
  for (const r of [4, 5, 6]) s.push(X(m - 1, r), X(m + 2, r)); // the jambs
  s.push(X(m, 3), X(m + 1, 3)); // the back
  s.push(X(2 * m + 1 - throat, 7)); // the lintel
  for (const f of [m - 1, m, m + 1, m + 2]) s.push(X(f, 8)); // the hood
  return [...s, ...extra];
}

/** The six squares of the firebox, as square names, for `kingPen`. */
function BOX(m: number): string[] {
  const files = 'abcdefgh';
  const out: string[] = [];
  for (const f of [m, m + 1]) for (const r of [4, 5, 6]) out.push(`${files[f - 1]}${r}`);
  return out;
}

const REVENGE_CORE_31 = ['snare', 'hourglass', 'aegis', 'magnet'];

const RUN_REVENGE_31: RunDef = {
  id: 'revenge-31',
  name: 'The Hearth',
  blurb: 'A fireplace of stone, and its mouth opens away from you.',
  allowedAbilities: ['hourglass', 'snare', 'aegis', 'magnet'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_31,
  offerCoreMin: 2,
  levels: [
    // L1 — THE COLD GRATE. Throat d7, so the shelf is on the left: up the a-
    // or b-file, along rank 7, into the throat, down onto him. He does not
    // move. The whole road, once, with nothing on it.
    make(1, [pawn(5, 6), king(4, 6)], {
      ...STILL,
      moveLimit: 7,
      hazards: HEARTH(4, 4),
      kingPen: ['d6'],
    }),
    // L2 — THE OTHER SIDE. Throat f7: the same road, mirrored. The lintel is
    // now on the left, so the shelf can only be walked from the h-file — the
    // level's only question, and the run asks it again on L4 and L8.
    make(2, [bishop(1, 1), pawn(5, 6), king(6, 6)], {
      ...STILL,
      moveLimit: 7,
      hazards: HEARTH(5, 6),
      kingPen: ['f6'],
    }),
    // L3 — HE STEPS ASIDE. First fleeing king, but his pen is a SHELF: the
    // two rank-6 squares only. A rook that reaches rank 6 sees both, so he has
    // nowhere to stand. The lesson the firebox inverts from L6 on.
    make(3, [king(5, 6)], {
      ...FLEE,
      moveLimit: 8,
      hazards: HEARTH(4, 4),
      kingPen: ['d6', 'e6'],
    }),
    // L4 — THE PLUG. Throat e7, right-hand shelf, a pawn standing in the
    // throat file and a knight on g5 that defends it and watches the shelf.
    // Take the plug and wear the recapture (AEGIS), or unpick the defender
    // first — the one level where the shield is the short road.
    make(4, [pawn(5, 6), knight(7, 5), king(5, 5)], {
      ...STILL,
      moveLimit: 9,
      hazards: HEARTH(4, 5),
      kingPen: ['e5'],
    }),
    // L5 — THE LOW SHELF. m=3: the whole hearth slides west and his shelf
    // drops to rank 5, so the road is longer by the descent, and a bishop
    // works the a-file she has to climb. Still a shelf, still no card needed.
    make(5, [bishop(8, 2), king(4, 5)], {
      ...FLEE,
      moveLimit: 8,
      hazards: HEARTH(3, 3),
      kingPen: ['c5', 'd5'],
    }),
    // L6 — THE FIRST HOLD. The firebox proper, and nothing capturable inside
    // it. He stands at the top of his column; from her column she owns one
    // rank at a time and he steps away for ever. Arm the square he runs to,
    // step onto his column, take him while he is stiff. SNARE.
    make(6, [bishop(1, 2), king(6, 6)], {
      ...FLEE,
      moveLimit: 12,
      hazards: HEARTH(5, 5),
      kingPen: BOX(5),
    }),
    // L7 — THE SHORTER ROAD. Same room, hearth back to the centre, and a
    // bishop on b2 sitting on the b-file climb — the shelf has to be reached
    // from a7, which is one move longer and one file more exposed.
    make(7, [bishop(2, 2), king(5, 6)], {
      ...FLEE,
      moveLimit: 11,
      hazards: HEARTH(4, 4),
      kingPen: BOX(4),
    }),
    // L8 — THE OTHER CORRIDOR. Firebox on the east, throat f7, so the road is
    // the h-file and the shelf runs right-to-left; he stands in the MIDDLE of
    // his column, so the trap is not the far square this time — it is the one
    // the geometry of her arrival leaves him. Eight moves.
    make(8, [knight(8, 3), king(5, 5)], {
      ...FLEE,
      moveLimit: 8,
      hazards: HEARTH(5, 6),
      kingPen: BOX(5),
    }),
    // L9 — THE FAR HEARTH. The western fireplace: the road is the a-file and
    // the shelf is two squares long, while the only hunter on the board stands
    // on the far side of it. The decision is to walk AWAY from the piece.
    make(9, [bishop(8, 3), king(4, 6)], {
      ...FLEE,
      moveLimit: 10,
      hazards: HEARTH(3, 3),
      kingPen: BOX(3),
    }),
    // L10 — THE DOUBLE COST. Two enemies a turn and a bishop on each flank, so
    // both climbs are watched and the shelf is crossed under fire; eight moves
    // for a road that takes four. The trap has to be armed before she starts,
    // because there is no turn on this level with nothing else to do.
    make(10, [bishop(2, 2), bishop(7, 2), king(5, 6)], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 8,
      hazards: HEARTH(4, 4),
      kingPen: BOX(4),
    }),
  ],
};

export { RUN_REVENGE_31 };
export default RUN_REVENGE_31;
