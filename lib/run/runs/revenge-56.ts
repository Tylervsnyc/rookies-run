/**
 * revenge-56 — THE VENT. Built 2026-09-19 (the ten-run batch) for the signature
 * pair ERUPTION + BOULDER. Kit = eruption / boulder / magnet / hourglass
 * (`allowedAbilities` IS the kit). ABILITY-FIRST: the run exists to show off
 * Eruption, the first card that makes the TERRAIN a resource.
 *
 * THE VERB: THE BOULDER TRICK, IN TWO MATERIALS. A lone rook never catches a
 * king who has one square to step to. Boulder deletes a flight square with
 * stone, anywhere, twice. Eruption deletes one with lava — but only a square
 * that TOUCHES lava, and only while she stands within two of that lava — or
 * burns the pawn standing there. So stone is the general tool and lava is the
 * local one, and every finale is a room that needs THREE things done when
 * stone can only do two of them.
 *
 * WHY THIS PAIR, read out of lib/run/abilities.ts:
 *   - ERUPTION (T1): one use. Tap a lava square within Chebyshev 2 of her, then
 *     ONE orthogonal neighbour: open ground becomes lava, a pawn burns (her
 *     capture: he is stunned for the next enemy phase, and the square is lava
 *     afterwards — so BURNING A BLOCKER NEVER OPENS A ROAD, it only removes a
 *     guard's attack). A free action.
 *   - BOULDER (T1): two stones a level, on any empty square, free.
 *   - Lava stops every line exactly as stone does. The only difference in play
 *     is that lava is something Eruption can grow from.
 *   - MAGNET and HOURGLASS are the fillers. Hourglass is the catalogue's proven
 *     never-a-key card (0% alone on every finale of every run). Magnet needs a
 *     guard on one of her lines, and no finale has one. Neither is a universal
 *     solvent. AEGIS WAS REJECTED: "shield up, step beside him, he swings and
 *     freezes" (The Slash L5) solos any room whose door she can walk up to, and
 *     every room here has a door. SMOKE and FREEZE-RAY solo for the same reason.
 *
 * ── CONSTANT SIGNATURE — THE VEIN AND THE VENT ─────────────────────────────
 * Every level is grey rock with two things painted on it in lava:
 *   1. THE VEIN — a DIAGONAL stroke of lava running across the rock toward his
 *      room. A diagonal cuts every file and rank it spans exactly once, so her
 *      road always meets it at a FORD (one missing square) or runs beside it.
 *      Diagonal lava is new to the catalogue: The Moat is a band, The Bridge a
 *      river, The Caldera a ring. A vein's orthogonal neighbours are all
 *      floodable, so a vein beside her road is also a row of traps — flood the
 *      wrong square and she has cut her own road.
 *   2. THE VENT — a single lava square beside or INSIDE his pen (L10: f7 is one
 *      of the eight squares around him). A vent is the only reason a flight
 *      square can be flooded, and where it sits decides where she has to STAND.
 * The boards are carved out of solid stone (12-19 open squares on the finales)
 * — the Warren rule, because Boulder targets empty squares.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none       — the vein, drawn, beside the point. He stands still.
 *   L2  none       — cross the vein at its ford; his pen is one square.
 *   L3  ERUPTION or BOULDER — TWO MATERIALS. A two-square room between two
 *                    vents: he shuttles, close the square he just left. Either
 *                    material does it, which is the run's thesis said once,
 *                    plainly. (Deliberately the first gated level: the L1 offer
 *                    hands out ONE half of the pair and either half passes.)
 *   L4  BOULDER KEY  — two flight squares and no lava within reach of them.
 *   L5  ERUPTION KEY — THE FUSE. A room too big for stone; burn the pawn beside
 *                    the vent and step onto his file the same turn. He is
 *                    stunned, he cannot run.
 *   L6  ERUPTION KEY — THE SENTRY. A pinned pawn watches the one corner of her
 *                    road. Burn it from two squares away and walk through.
 *   L7-L10 the pair; every single card 0%.
 *   MAGNET and HOURGLASS are TRAPS on all ten levels (0% everywhere).
 *
 * ── THE FOUR FINALE LINES (as built) ───────────────────────────────────────
 * Two shapes of room, each told twice with a different question.
 *
 *   L7  THREE HOLES (flood + stone + stone). King b8; ONE door, the b-file,
 *       entered only at b6. On it he has three flight squares: a8, c8, a7.
 *       Vents a6 (floods a7) and d8 (floods c8) — either is right.
 *       LINE: d1-d5, d5-c5, [flood a7 from a6; stones a8 + c8], c5-c6, c6-b6,
 *       b6xb8. Everything is cast BEFORE she touches the file: step on it early
 *       and he walks to a square no line reaches, for good.
 *       DECISION: seal all three before you step on.
 *
 *   L8  THE SENTRY (burn + stone + stone). King h8, flight squares g8 + g7, the
 *       h-file entered only at h4 — and the corner before it, g4, is watched by
 *       a pawn on f5 that no rook line reaches (pinned on the tip of the vein,
 *       f4). Stone cannot touch a pawn. LINE: g1-g3, [burn f5 from f4; stones
 *       g8 + g7], g3-g4, g4-h4, h4xh8. Five moves from most starts, five on the
 *       clock. The burn's stun is WASTED (she is two moves from his file), which
 *       is exactly why lava alone is not enough.
 *       DECISION: the lava goes on the guard, not the room.
 *
 *   L9  THE WRONG VENT (burn + stone + stone, with a lie in it). King a5,
 *       flight squares a6 + a4, the door is rank 5 entered at c5. The corner d4
 *       is watched from e5 (pinned on e4). And b4 is a vent touching his flight
 *       square a4, in range from the same squares the burn is — d2, d3. She has
 *       ONE eruption. Flood a4 and the room is half shut and the road is shut
 *       completely. LINE: d1-d3, [burn e5 from e4; stones a6 + a4], d3-d4,
 *       d4-c4, c4-c5, c5xa5.
 *       DECISION: one eruption, two vents in reach — which?
 *
 *  L10  THE VENT IN HIS ROOM (flood + stone + stone, under a knight). King e8,
 *       flight squares d8, f8, d7 — and f7, the fourth square of his room, IS
 *       the vent. It floods f8 and nothing else useful (its other neighbours are
 *       her own door e7 and her own perch f6). The veins make a V that points at
 *       his door. A knight lives on d1/f2/h1 — a closed three-square orbit that
 *       can never reach his file — and sits on her road. LINE: f1-f5, [flood f8
 *       from f7; stones d8 + d7], f5-f6, f6-e6, e6xe8.
 *       DECISION: L7 with one vent, three wrong floods and a body on the road.
 *
 * HONEST NOTE ON VARIETY: the contract asks for four different uses of the
 * pair. This run delivers TWO cast-sets (flood+2 stones; burn+2 stones), each
 * asked twice with a different question (either vent / the only vent is inside
 * his room; burn the guard / don't be tempted by the flood). Three more
 * distinct uses were built and could not be measured — see DEAD ENDS 2-4.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, `revenge.ts matrix` ──────────
 * Numbers of record: 32 trials, T5 bot, `--jobs=2` (ten authors on the box).
 *
 *   L    none  eruption  boulder  magnet  hourglass | eruption+boulder
 *   7      0%     0%       0%       0%       0%     |       75%
 *   8      0%     0%       0%       0%       0%     |       94%
 *   9      0%     0%       0%       0%       0%     |       78%
 *  10      0%     0%       0%       0%       0%     |       66%
 *
 * THE GATE IS MET: 20 cells of zero, pair mean 78%. L8 is ABOVE the band at 94%
 * and ships there knowingly: the clock is already exact (5 of 5) and every
 * harder build leaked — a second pawn on the same vent is stun fuel (eruption
 * T2 alone 88%, boulder T2 alone 69%: burn/crush it from g4, step onto h4 with
 * him stunned), and no knight can be added because every orbit from her floor
 * reaches the h-file, where taking it is a free stun ON his line.
 *
 * TIER LADDER, L7-L10, 32 trials (single card pinned; two-guard build of L8):
 *   boulder   T1 0/0/0/0   T2 0/69†/0/0   T3 53/94/84/81   T4 69/97/91/63
 *   eruption  T1 0/0/0/0   T2 0/88†/0/0   T3 0/0/0/0       T5 0/0/0/0
 *   († = the second L8 pawn, since removed; the shipped L8 reads 0% for both
 *   cards at T2, 16 trials.)
 * PAIR under an upgraded Eruption (boulder T1, 16 trials):
 *   eruption T2 44/100/75/19   T3 88/0/0/0   T5 75/0/0/0
 * `abilityTierCaps: { boulder: 2, eruption: 2 }`.
 *   - BOULDER breaks at T3 for the usual reason: the third stone IS the third
 *     thing, and the room no longer needs lava.
 *   - ERUPTION is capped for the OPPOSITE reason, and it is the finding of this
 *     run: at T3+ the flood is all four neighbours, all-or-nothing, and on
 *     L8/L9/L10 one of the four is always her own road or her own door. The
 *     upgrade does not solo the gate — it makes the PAIR unplayable (0/0/0).
 *     An upgrade that removes the single-square flood removes the card's
 *     precision; see the report. (T2's dip on L10 is the bot spending its
 *     second use on e7, her own door, because it is "next to the king".)
 *
 * MID-RUN, 16 trials:
 *   L    none  eruption  boulder  magnet  hourglass
 *   1    100%    100%     100%     100%     100%
 *   2    100%    100%     100%     100%     100%
 *   3      0%    100%     100%       0%       0%   (either material)
 *   4      0%      0%     100%       0%       0%   (boulder KEY, clean)
 *   5      0%    100%       0%       0%       0%   (eruption KEY, clean)
 *   6      0%    100%       0%       0%       0%   (eruption KEY, clean)
 *
 * AT THE CAPS (eruption T2 + boulder T2, 32 trials): singles 0/0/0/0 for both
 * cards; pair 81/88/94/25. L10's 25% is the bot, not the room — with two floods
 * and crush squares in the candidate list the rollout budget thins and the
 * traces never cast at all (they walk d1 to eat the knight and run out the
 * clock). The human line is unchanged by the second charge.
 *
 * FULL RUNS, 40 runs, T5, difficulty=normal:
 *   random picks from the whole kit   2/40 =  5%  (L3 78, L4 71, L7 42, L10 29)
 *   `--pool=eruption,boulder`         9/40 = 23%  (L4 65 — no boulder yet —
 *                                                  then L7-L10 81/81/88/60)
 * Inside the Moat's 10-25% target with the pair, below it without: the two
 * fillers are dead on all ten levels, so every filler pick is a wasted offer.
 *
 * ── DEAD ENDS (each one cost a build; all are rules for the next author) ───
 *
 * 1. THE CASTING SQUARE MUST BE TWO MOVES FROM HIS LINE. L7's first build let
 *    her cast from d5 with b5 — on his file — one slide away. Pair 0-8%, the
 *    bot never cast once. `fastScore` pays +25 for a move that attacks the
 *    king, a cast earns 0-8, and rollouts sample the top 3: with an attacking
 *    move on offer no rollout ever seals three squares first. Moving the door
 *    so the perch is a DOG-LEG from it (c5 -> c6 -> b6) took the same room
 *    from 8% to 67% with nothing else changed. Two casts survive a one-move
 *    door (L8 read 100%); three do not.
 *
 * 2. SHE WALKS INTO HIS ROOM. Pen squares are open ground to her. Three builds
 *    leaked 17-75% to a SINGLE card because after he fled she strolled through
 *    a flight square and took a second line from inside (L9 v2: boulder alone
 *    75% — one stone on b8, walk c8-c7, take rank 7). **Rule: every flight
 *    square must touch L1, the door square beside him, and nothing else she
 *    can stand on.** L1 is fatal while he is adjacent to it (he swings), and
 *    if every flight square touches L1 he is always adjacent to it. That caps
 *    a room at the four squares N(king) ∩ N(L1), which is why every finale
 *    here is an edge king with two or three of those four open.
 *
 * 3. A BURN NEXT TO THE DOOR IS A SOLO. Burn a pawn, step onto his line the
 *    same turn, he is stunned: Eruption alone, every time (that is L5, on
 *    purpose). A finale may only hold a burnable pawn where every square
 *    within 2 of its vent is 2+ moves from the door.
 *
 * 4. THE BOT WILL NOT BLIND HIM FIRST (provable, unfindable). The best idea
 *    that did not ship: her only road has a forced stop ON his file far below
 *    him, so she must wall her own line with a stone before she walks past —
 *    stone blinds, lava closes, stone closes. 0% over 12 trials, never cast:
 *    it is The Oubliette's law again (the bot does not buy safety it does not
 *    yet need). A human would find it; it cannot be measured. Same fate for
 *    THE FAR VENT (flood from a pocket on the wrong side, then walk round: 0%,
 *    the bot never detours 3 moves for a +5 cast).
 *
 * 5. A START FILE THAT SEES HIM IS A FREE WIN. She moves first: L3 v1 (open
 *    h-file) and L10 v2 read 17-58% bare from trial-0 captures. Every door here
 *    is closed to rank 1 by stone, and rank 1 is trimmed on the finales so the
 *    far-corner starts that the bot cannot walk back from (The Comb's "two
 *    feet" rule) do not exist.
 */
import {
  FLEE,
  LAVA,
  STILL,
  X,
  king,
  knight,
  make,
  pawn,
  type LevelBuilder,
  type RunDef,
} from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

/**
 * THE MAP. Every level is drawn as eight strings, rank 8 first, file a first.
 *   #  stone        ~  LAVA (a vein square or a vent)
 *   .  open ground  o  open ground inside his pen
 *   K  the king (his square is in the pen)
 *   p n      his guards
 */
function level(
  n: number,
  rows: string[],
  opts: { still?: boolean; moveLimit: number; enemiesPerTurn?: number },
): LevelBuilder {
  const pieces: EnemyPiece[] = [];
  const hazards: Hazard[] = [];
  const pen: string[] = [];
  rows.forEach((row, i) => {
    const r = 8 - i;
    const cells = row.replace(/\s+/g, '');
    if (cells.length !== 8) throw new Error(`revenge-56 L${n} rank ${r}: "${row}"`);
    [...cells].forEach((ch, j) => {
      const f = j + 1;
      const name = `${String.fromCharCode(96 + f)}${r}`;
      if (ch === '#') hazards.push(X(f, r));
      else if (ch === '~') hazards.push(LAVA(f, r));
      else if (ch === 'o') pen.push(name);
      else if (ch === 'K') {
        pieces.push(king(f, r));
        pen.push(name);
      } else if (ch === 'p') pieces.push(pawn(f, r));
      else if (ch === 'n') pieces.push(knight(f, r));
      else if (ch !== '.') throw new Error(`revenge-56 L${n}: bad cell "${ch}"`);
    });
  });
  return make(n, pieces, {
    ...(opts.still ? STILL : FLEE),
    moveLimit: opts.moveLimit,
    hazards,
    ...(opts.enemiesPerTurn ? { enemiesPerTurn: opts.enemiesPerTurn } : {}),
    ...(opts.still ? {} : { kingPen: pen }),
  });
}

export const RUN_REVENGE_56: RunDef = {
  id: 'revenge-56',
  name: 'The Vent',
  blurb:
    'Grey rock with a vein of lava running through it on the diagonal, and one lone vent beside his room. A stone closes any square. Lava closes only a square it already touches, and only while you stand close enough to feel the heat — or it burns the guard standing there. His room always needs three things done, and stone only ever does two.',
  allowedAbilities: ['eruption', 'boulder', 'magnet', 'hourglass'],
  // Measured L7-L10, 32 trials (see MEASURED in the header):
  //   boulder   T1 0/0/0/0   T2 0/0/0/0   T3 53/94/84/81  -> cap 2 (the third
  //             stone is the third hole; the room stops needing lava).
  //   eruption  0% alone at EVERY tier — capped for the opposite reason: at T3+
  //             the flood is all four neighbours, all-or-nothing, one of them
  //             is always her own road or door, and the PAIR reads 0/0/0 on
  //             L8-L10. The upgrade walls the player (the Stacks lesson).
  abilityTierCaps: { boulder: 2, eruption: 2 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // ── L1 — THE CRACK. The vein and a vent, drawn, and beside the point: he
    // stands still on her side of the rock. DECISION: none — walk up and take him.
    level(
      1,
      [
        '. . . . . . K ~',
        '. . . . . . . .',
        '. . . . . ~ . .',
        '. . . . ~ . . .',
        '. . . ~ . . . .',
        '. . ~ . . p . .',
        '. . . . . . . .',
        '. . . . . . . .',
      ],
      { still: true, moveLimit: 12 },
    ),
    // ── L2 — THE FORD. The vein a3-(b4)-c5-d6-e7 is missing one square, and it
    // is the one on his file. His pen is b8 alone, a vent at his shoulder.
    // DECISION: cross the vein where it is missing.
    level(
      2,
      [
        '~ K # . . . . .',
        '# . # . ~ . . .',
        '. . . ~ . . . .',
        '. . ~ . . n . .',
        '. . . . . . . .',
        '~ . . . . . . .',
        '. . . . . . . .',
        '. . . . . . . .',
      ],
      { moveLimit: 14 },
    ),
    // ── L3 — TWO MATERIALS (eruption OR boulder). His room is a5 + a6, a vent
    // above it (a7) and a vent below it (a4). Threaten one square and he steps to
    // the other, forever. Close the square he just left — flood it from the vent
    // that touches it, or drop a stone on it — and take the rank he is on.
    // DECISION: he shuttles; close the square he left.
    level(
      3,
      [
        '# # # # # # # #',
        '~ # # # # # # #',
        'o . . . # ~ # #',
        'K . . . ~ # # #',
        '~ # # . # # # #',
        '# # ~ . # # # #',
        '# ~ # . # # # #',
        '. . . . . . . .',
      ],
      { moveLimit: 12 },
    ),
    // ── L4 — TWO STONES (boulder KEY). King a8, flight squares a7 + b7, the
    // door is rank 8 from e8. The vein a2-d5 never comes within reach of his room,
    // so lava has nothing to say here. Stone both, then take the rank.
    // DECISION: both flight squares, before she takes the rank.
    level(
      4,
      [
        'K . . . . # # #',
        'o o # # . # # #',
        '# # # # . # # #',
        '# # # ~ . # # #',
        '# # ~ # . # # #',
        '# ~ # # . # # #',
        '~ # # # . # # #',
        '. . . . . . . .',
      ],
      { moveLimit: 12 },
    ),
    // ── L5 — THE FUSE (eruption KEY). A six-square room: on the c-file he has
    // FOUR flight squares and stone has two. But a pawn stands on the tip of the
    // vein (e5 over e4), and g3 is within two of that vent AND one slide from his
    // file. Burn it, slide g3-c3: he is stunned, he cannot step off. c3xc7.
    // DECISION: burn, then step on his file the same turn.
    level(
      5,
      [
        '# o o o # # # ~',
        '# o K o # # ~ #',
        '# # . # # ~ # #',
        '# # . # p # # #',
        '# # . # ~ # # #',
        '# # . . . . . #',
        '# # # # # # . #',
        '. . . . . . . .',
      ],
      { moveLimit: 12 },
    ),
    // ── L6 — THE SENTRY (eruption KEY). His pen is one square; the road is
    // a1-a4, a4-d4, d4-d8 and she MUST stop on d4 to turn. The pawn on e5 watches
    // d4, pinned on the vein's tip e4, and no rook line reaches it. Burn it from
    // c4. (Flooding d4 instead — the other thing that vent offers — cuts her road.)
    // DECISION: burn the pawn that watches your corner.
    level(
      6,
      [
        '# # # K # # # #',
        '# # # . # # # #',
        '# # # . # # # #',
        '# # # . p # # #',
        '. . . . ~ # # #',
        '. # # # # ~ # #',
        '. # # # # # ~ #',
        '. . . . . . . ~',
      ],
      { moveLimit: 12 },
    ),
    // ══ L7 — THREE HOLES ══════════════════════════════════════════════════════
    //   THE DOOR     the b-file, b7 (L1) + b6 (L2). b6 is entered only from c6.
    //   THE PERCH    c5 — two moves from the door (c5-c6-b6), within 2 of vent a6.
    //   THE HOLES    a8, c8, a7 — all three touch b7 and nothing else she can use.
    //   THE VENTS    a6 floods a7 (from c5 or c6); d8, the vein's tip, floods c8
    //                (from c6). Either. The other two holes take the stones.
    // DECISION: seal all three before you step onto his file.
    level(
      7,
      [
        'o K o ~ # # # #',
        'o . # # ~ # # #',
        '~ . . # # ~ # #',
        '# # . . # # ~ #',
        '# # # . # # # ~',
        '# # # . # # # #',
        '# # # . # # # #',
        '# . . . . . # #',
      ],
      { moveLimit: 8 },
    ),
    // ══ L8 — THE SENTRY ═══════════════════════════════════════════════════════
    // Two holes (g8, g7) and two stones — and a pawn on f5 watching g4, the one
    // corner of her road, pinned on the vein's tip f4 where no line reaches it.
    // Burn it from g2 or g3. The stun is wasted: his file is two moves away.
    // Five moves from most starts, five on the clock.
    // DECISION: the lava goes on the guard, not the room.
    level(
      8,
      [
        '# # # # # # o K',
        '# # # # # # o .',
        '# # # # # # # .',
        '# # # # # p # .',
        '# # # # # ~ . .',
        '# # # # ~ # . #',
        '# # # ~ # # . #',
        '# # # # . . . .',
      ],
      { moveLimit: 5 },
    ),
    // ══ L9 — THE WRONG VENT ═══════════════════════════════════════════════════
    // L8 turned on its side with a lie in it. Holes a6 + a4, door rank 5 at c5,
    // the corner d4 watched from e5 (pinned on e4). And b4 is a second vent, one
    // that touches his flight square a4 — in range from d2 and d3, the very
    // squares she burns from. One eruption. Flood a4 and the road stays shut.
    // DECISION: one eruption, two vents in reach — which?
    level(
      9,
      [
        '# # # # # # # #',
        '# # # # # # # #',
        'o # # # # # # #',
        'K . . # p # # #',
        'o ~ . . ~ # # #',
        '# # # . # ~ # #',
        '# # # . # # ~ #',
        '. . . . . . # ~',
      ],
      { moveLimit: 8 },
    ),
    // ══ L10 — THE VENT IN HIS ROOM ════════════════════════════════════════════
    // His room is the four squares around the door e7: d8, f8, d7 — and f7, which
    // is LAVA. The vent is inside the pen. It floods f8; its other neighbours are
    // e7 (her door) and f6 (her perch), so three of its four floods lose the game.
    // Two veins make a V pointing at the door. A knight orbits d1-f2-h1 — it can
    // never reach his file, only sit on her road and cost her the move she lacks.
    // DECISION: L7's three holes with one vent, three wrong floods, a body on the road.
    level(
      10,
      [
        '# # # o K o # #',
        '# # # o . ~ # #',
        '# # # # . . ~ #',
        '# # # ~ # . # ~',
        '# # ~ # # . # #',
        '# ~ # # # . # #',
        '~ # # # # . # #',
        '# # # n . . . .',
      ],
      { moveLimit: 7 },
    ),
  ],
};

export default RUN_REVENGE_56;
