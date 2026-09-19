/**
 * revenge-59 — THE GORGE. Built 2026-09-19 (the ten-run batch) for the
 * signature pair CATAPULT + CONVERT. Kit = catapult / convert / sacrifice /
 * boulder (`allowedAbilities` IS the kit). LEVEL-FIRST: the crazy level came
 * first — a lava river across the whole board with no ford, and a bank that
 * holds nothing but loose stones — and Catapult was invented to cross it.
 * The partner stayed CONVERT (the design intent); no swap was needed.
 *
 * THE VERB: THROW IT OVER. She never crosses the river on any finale. What
 * crosses is a stone or one of HIS pawns, and the kill is always a pawn's
 * diagonal — the one capture in the game a rook cannot make, against a king
 * whose room no rank or file touches.
 *
 * WHY THIS PAIR, read out of lib/run/abilities.ts:
 *   - CATAPULT (T1): one charge. A LOOSE stone or a controlled summon
 *     orthogonally beside her flies straight away from her, over anything,
 *     2-4 squares from where it sat. Stone into lava = a ford (R3). A free
 *     action. A flung summon "lands exactly as it was" — so a pawn stolen on
 *     an EARLIER turn lands ready and captures the same turn: he never gets a
 *     reaction. (A pawn stolen and flung in one turn lands dazed.)
 *   - CONVERT (T1): one charge, any pawn anywhere, no line needed. The pawn
 *     is hers from next turn, marches toward rank 8, and takes diagonally —
 *     the king included. THE BOTS FOUND THE RUN'S BEST TRICK: a stolen pawn
 *     STOPS MARCHING. Steal it from across the board first and it waits for
 *     her to walk under it, instead of running down to rank 1 to promote.
 *   - Neither crosses alone: a stolen pawn on her bank walks into the river
 *     and stops; a ford puts a ROOK on his bank, where every room is sealed
 *     on rank and file. Far-bank pawns (L4, L6, L10) are placed so that the
 *     steal alone never reaches his diagonal, or reaches it and he sidesteps.
 *
 * -- CONSTANT SIGNATURE — THE RIVER ---------------------------------------
 * Every level draws one unbroken band of lava from the a-file to the h-file
 * (or edge to edge round a bend). There is never a ford. What changes is the
 * river itself — that is the terrain experiment:
 *   L1 far off (ranks 6-7)   L2 two-thick (5-6)    L3 one-thick (5)
 *   L4 two-thick, low (4-5)  L5 a STEP (a5-d5 / e6-h6)
 *   L6 at her feet (3-4)     L7 two-thick under a solid masonry wall
 *   L8 FOUR-thick with a one-square islet and a stone jetty
 *   L9 an L-BEND (rank 5 then down the e-file) — the far bank is EAST
 *   L10 three-thick with fixed stepping posts, behind a rampart of her own
 *       ammunition
 * LOOSE vs FIXED is a designed distinction everywhere: plain stone is HER
 * ammunition (always on her bank or in the river mouth), `fixed` stone is HIS
 * masonry (his rooms, the posts, the pins). Nothing in the kit moves masonry.
 * Ammunition geometry is the hidden rule of the run: a stone lands 2-4 squares
 * from where it SAT, so a stone on rank 3 can only ever ford rank 5+, and the
 * near lane of a two-thick river can never be forded from the bank at all.
 *
 * -- PER-CARD KEY / TRAP MAP ----------------------------------------------
 *   L1  none       — the river is scenery; he is on her bank.
 *   L2  none       — he hides on a near-shore spit behind a loose stone.
 *   L3  CATAPULT   — one-thick river: throw a stone in, walk over.
 *   L4  CONVERT    — his own pawn is already across; steal it, step, take.
 *   L5  CATAPULT   — three stones, three fords, one leads to his hall.
 *   L6  CONVERT    — the stolen pawn must EAT a cork knight to reach him.
 *   L7-L10 the pair. SACRIFICE is a trap everywhere (a blast only stuns a
 *   king). BOULDER is a trap on L1-L9 and a CO-KEY on L10 (see MEASURED).
 *
 * -- THE FOUR FINALE LINES ------------------------------------------------
 *   L7  THE SHOT. King e8, masonry on every side, two windows d7 / f7.
 *       His pawn d4 marches at her. Convert d4 (it stops), walk to d3 (or
 *       d2 if it got to d3), Catapult d4 -> d7, pawn d7xe8.
 *       DECISION: the pawn is the projectile.
 *   L8  THE BRIDGE. Four lanes of lava. His pawn is marooned on the islet e6,
 *       the jetty stone e4 stands in the river mouth. She: e3. Catapult
 *       e4 -> e7 (a ford in the FAR lane), Convert e6, pawn e6-e7, e7xd8.
 *       DECISION: the stone crosses; the pawn walks the last step.
 *   L9  THE BEND. The river turns south: he is EAST, at g4. The ammunition
 *       pawn d3 is pinned on masonry (d2), so there is no standing under it —
 *       the throw is SIDEWAYS from c3: Catapult d3 -> f3, f3xg4. But c3 is
 *       covered by a sentry pawn b4 (pinned on the loose stone b3) which a
 *       bishop on a3 defends. Both cards are tempting on the sentry (steal it;
 *       throw its pin away) and both are already spoken for.
 *       DECISION: spend nothing on the sentry; throw sideways.
 *   L10 THE LID. He has TWO rooms, d8 / e8, and his pawn c7 already stands on
 *       his diagonal. Steal it first and he simply steps to e8, out of its
 *       reach for ever. So the stone goes first and it is not a ford: she
 *       stands on e3, Catapult e4 -> e8 drops a LID on the room he would run
 *       to, THEN Convert c7, any move, c7xd8. Rank 2 is a rampart of loose
 *       stone with a gate at each end — throwing a stone out of her way opens
 *       the rampart and burns the only charge.
 *       DECISION: order and target — lid first, neither card crosses.
 *
 * -- MEASURED — 2026-09-19, difficulty=normal, `revenge.ts matrix` ---------
 * Numbers of record: 32 trials, `--jobs=2` (shared machine), T1 cards.
 *
 *   L    none  catapult  convert  sacrifice  boulder | catapult+convert
 *   7      0%      0%       0%        0%        0%   |       81%
 *   8      0%      0%       0%        0%        0%   |       84%
 *   9      0%      0%       0%        0%        0%   |       59%
 *  10      0%      0%       0%        0%        0%   |       78%
 *
 * 20 zeros, the pair means 76%. L8 is a hair over the band and cannot come
 * down by the clock (it is already at the engine's moveLimit floor of 6). L9
 * is a hair under: its losses are a STANDOFF, not a clock — from some starts
 * the bot shuffles beside the bishop-defended sentry and never commits (59%
 * at moveLimit 8 AND at 9). A human sees "take the bishop or go round by a4".
 *
 * OTHER PAIRS, same read: convert+sacrifice 0/0/0/0, boulder+catapult
 * 0/0/0/0, boulder+convert 0/0/0/100. That 100 is honest and is left in:
 * on L10 a Boulder is as good a lid as a flung stone. It rescues nobody — a
 * player without Catapult cannot pass L7-L9 — so by L10 it is a second way to
 * play the same idea with Tyler's favourite card, not a second key to the run.
 *
 * TIER LADDER, L7-L10, 32 trials:
 *   catapult   T2 0/0/0/0   T3 0/0/0/0   T5 0/0/0/0
 *   convert    T2 0/0/0/0   T3 0/0/0/0   T5 0/0/0/0
 *   sacrifice  T5 0/0/0/0   boulder T5 0/0/0/0
 * NO `abilityTierCaps`: the gate is tier-proof. More catapult charges ford
 * lanes that lead to sealed rooms; a bigger Convert finds no knight to steal.
 * (A first L9 had a KNIGHT defending the sentry and Convert T2+ read
 * 25/66/34% — a stolen knight hops the river. The defender became a bishop,
 * which cannot: every diagonal across a full lane passes through lava.)
 *
 * MID-RUN:
 *   L    none  catapult  convert  sacrifice  boulder      (32 trials)
 *   1    100%    100%     100%      100%      100%
 *   2    100%    100%     100%      100%      100%
 *   3      0%    100%       0%        0%        0%    catapult KEY, clean
 *   4      0%      0%     100%        0%        0%    convert KEY, clean
 *   5      0%    100%       0%        0%        0%    catapult KEY, clean
 *   6      0%      0%     100%        0%        0%    convert KEY, clean
 *
 * FULL RUNS, 40 runs, T5, difficulty=normal:
 *   random picks from the whole kit      2/40 =  5%  (L3 33%, L4 38%)
 *   `--pool=catapult,convert`           14/40 = 35%  (L4 60%, then 83-100%)
 * The random ladder dies at L3/L4, not in the finale: those two are clean
 * single-card keys, so a run that has not been offered the right half yet
 * stops there. Anyone who reaches L7 holding the pair clears ~90% of it. The
 * cheap softener, if Tyler wants one, is a second answer on L3 or L4.
 *
 * -- DEAD ENDS ------------------------------------------------------------
 * 1. A HER-BANK PAWN ON A TWO-ROOM LEVEL IS A FREE STUN. L10 v1 had a
 *    marching pawn for pressure: convert ALONE read 100% — she ate the pawn,
 *    the stun held him in d8, the stolen c7 pawn took him. No capturable
 *    piece may stand on her bank on the Lid.
 * 2. THE "LAND WHERE HE CANNOT SIDESTEP" LEVEL DOES NOT EXIST, because a pawn
 *    stolen a turn earlier lands READY: fling and capture are one turn and he
 *    never reacts. Two-room pens only matter against a pawn that is already
 *    across (the Lid).
 * 3. THE BOT WILL NOT FIRE FOR A PAYOFF THREE PAWN-STEPS AWAY. Bridge v1
 *    (one-thick river, pawn walks e6-e7-xd8 after the ford) read 25-59% with
 *    the bot parked on the firing square, charge in hand. Marooning the pawn
 *    one step from his diagonal: 97%, then 84% at the clock floor.
 * 4. THE POSITIONAL TERM PARKS HER ON THE NEAREST SQUARE TO HIM. L8 v1 left
 *    rank 4 open and she shuffled c4/b4 for the whole clock; L9 with d1 open
 *    did the same on d1. Every square nearer him than the firing square is
 *    lava or masonry now.
 * 5. ON THE BEND SHE CAN SPAWN ON HIS BANK. Rookie's start file is random on
 *    rank 1, so f1-h1 are masonry.
 * 6. HUNTERS ARE ALL-OR-NOTHING HERE. Marching pawns, two per turn, a knight:
 *    100% every time, or a mutual-defence standoff at 30-40%.
 */
import {
  FLEE,
  LAVA,
  STILL,
  X,
  bishop,
  king,
  knight,
  make,
  pawn,
  type RunDef,
} from '../run-kit';
import type { Hazard } from '../types';

const fileOf = (name: string): number => name.charCodeAt(0) - 96;
const rankOf = (name: string): number => Number(name.slice(1));

/** LOOSE stone — ammunition. Catapult may fling it. */
const loose = (...names: string[]): Hazard[] => names.map((n) => X(fileOf(n), rankOf(n)));
/** FIXED stone — his masonry. Nothing in the kit moves it. */
const fixed = (...names: string[]): Hazard[] =>
  names.map((n) => ({ file: fileOf(n), rank: rankOf(n), fixed: true }));
/** Lava, by name. */
const lava = (...names: string[]): Hazard[] => names.map((n) => LAVA(fileOf(n), rankOf(n)));
/** THE RIVER: a whole rank of lava, minus the named squares. */
const river = (r: number, ...except: string[]): Hazard[] => {
  const skip = new Set(except);
  const out: Hazard[] = [];
  for (let f = 1; f <= 8; f++) {
    const name = `${String.fromCharCode(96 + f)}${r}`;
    if (!skip.has(name)) out.push(LAVA(f, r));
  }
  return out;
};
/** A whole rank of FIXED masonry, minus the named squares. */
const wall = (r: number, ...except: string[]): Hazard[] => {
  const skip = new Set(except);
  const out: Hazard[] = [];
  for (let f = 1; f <= 8; f++) {
    const name = `${String.fromCharCode(96 + f)}${r}`;
    if (!skip.has(name)) out.push({ file: f, rank: r, fixed: true });
  }
  return out;
};

export const RUN_REVENGE_59: RunDef = {
  id: 'revenge-59',
  name: 'The Gorge',
  blurb:
    'A river of lava from one edge of the board to the other, and no ford anywhere. Her bank holds nothing but loose stones and the odd pawn of his. Stones fly. So do pawns.',
  // No abilityTierCaps: every kit card reads 0% on L7-L10 at T1, T2, T3 and T5
  // (see MEASURED). The gate is geometry, not charges.
  allowedAbilities: ['catapult', 'convert', 'sacrifice', 'boulder'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE FAR RIVER. The river is scenery; he stands on her bank.
    // DECISION: find the open line to a still king.
    make(1, [king(5, 3), pawn(2, 4)], {
      ...STILL,
      moveLimit: 12,
      hazards: [...river(6), ...river(7), ...loose('c3', 'g2', 'f5')],
    }),
    // L2 — THE NEAR SHORE. He hides on a spit behind one loose stone.
    // DECISION: come at him down the file, not the rank.
    make(2, [king(7, 3), pawn(2, 4), pawn(4, 4)], {
      ...FLEE,
      moveLimit: 12,
      kingPen: ['g3'],
      hazards: [...river(5), ...river(6), ...loose('f3', 'c2', 'h4'), ...fixed('d8', 'e8', 'd7', 'e7')],
    }),
    // L3 — THE FORD (catapult KEY). One lane of lava. Stand under a stone on
    // rank 3 and it lands in rank 5: a ford.
    // DECISION: a stone in the river is a road.
    make(3, [king(5, 8), pawn(8, 4)], {
      ...FLEE,
      moveLimit: 12,
      kingPen: ['e8'],
      hazards: [...river(5), ...loose('b3', 'e3', 'g3'), ...fixed('d8', 'f8')],
    }),
    // L4 — THE TURNCOAT (convert KEY). Two lanes; no stone reaches the near
    // one. His pawn c6 is already over there. g6 is the wrong pawn.
    // DECISION: steal the pawn that can reach his diagonal.
    make(4, [king(4, 8), pawn(3, 6), pawn(7, 6)], {
      ...FLEE,
      moveLimit: 8,
      kingPen: ['d8'],
      hazards: [...river(4), ...river(5), ...loose('b3', 'f3', 'e2'), ...fixed('c8', 'e8', 'd7')],
    }),
    // L5 — THE RIGHT STONE (catapult KEY). The river steps up a rank at the
    // e-file. b3 fords into a walled pocket, g3 into a dead end under g7;
    // only e4 -> e6 opens e7-e8 and rank 8 to him.
    // DECISION: one charge, three stones — which ford leads anywhere.
    make(5, [king(8, 8)], {
      ...FLEE,
      moveLimit: 10,
      kingPen: ['h8'],
      hazards: [
        ...lava('a5', 'b5', 'c5', 'd5', 'e6', 'f6', 'g6', 'h6'),
        ...loose('b3', 'e4', 'g3'),
        ...fixed('d6', 'd7', 'd8', 'f7', 'g7', 'h7'),
      ],
    }),
    // L6 — THE MEAL (convert KEY). The river is at her feet. A walled knight
    // corks c7; the stolen b6 pawn eats it (stun) and then eats him.
    // DECISION: steal the pawn with something to eat.
    make(6, [king(4, 8), pawn(2, 6), knight(3, 7), pawn(7, 6)], {
      ...FLEE,
      moveLimit: 8,
      kingPen: ['d8'],
      hazards: [
        ...river(3),
        ...river(4),
        ...loose('c2', 'f2'),
        ...fixed('a8', 'a6', 'e6', 'e8', 'c8', 'd7', 'b5', 'd5', 'g5'),
      ],
    }),
    // == L7 — THE SHOT. DECISION: the pawn is the projectile. ==
    // Convert d4 (it stops marching), stand under it, Catapult to d7, d7xe8.
    make(7, [king(5, 8), pawn(4, 4)], {
      ...FLEE,
      moveLimit: 7,
      kingPen: ['e8'],
      hazards: [
        ...river(5),
        ...river(6),
        ...loose('b3', 'g3'),
        ...wall(7, 'd7', 'f7'),
        ...wall(8, 'e8'),
      ],
    }),
    // == L8 — THE BRIDGE. DECISION: the stone crosses, the pawn walks. ==
    // e3: Catapult e4 -> e7 (ford, far lane), Convert e6, e6-e7, e7xd8.
    make(8, [king(4, 8), pawn(5, 6)], {
      ...FLEE,
      moveLimit: 6,
      kingPen: ['d8'],
      hazards: [
        ...river(4, 'e4'),
        ...river(5),
        ...river(6, 'e6'),
        ...river(7),
        ...loose('e4', 'b2', 'g2'),
        ...wall(8, 'd8'),
      ],
    }),
    // == L9 — THE BEND. DECISION: spend nothing on the sentry; throw sideways. ==
    // c3: Catapult d3 -> f3, f3xg4. b4 (pinned on loose b3, defended by the
    // bishop) covers c3. f1-h1 are masonry so she never spawns on his bank.
    make(9, [king(7, 4), pawn(4, 3), pawn(2, 4), bishop(1, 3)], {
      ...FLEE,
      moveLimit: 8,
      kingPen: ['g4'],
      hazards: [
        ...lava('a5', 'b5', 'c5', 'd5', 'e5', 'e4', 'e3', 'e2', 'e1'),
        ...loose('b3'),
        ...fixed('d1', 'd2', 'd4', 'f4', 'h4', 'g5', 'g3', 'f1', 'g1', 'h1'),
      ],
    }),
    // == L10 — THE LID. DECISION: lid first, then steal; neither card crosses. ==
    // e3: Catapult e4 -> e8, Convert c7, any move, c7xd8. Rank 2 is a rampart
    // of her own ammunition with a gate at a2 and h2.
    make(10, [king(4, 8), pawn(3, 7)], {
      ...FLEE,
      moveLimit: 7,
      kingPen: ['d8', 'e8'],
      hazards: [
        ...river(4, 'e4', 'b4'),
        ...river(5, 'g5'),
        ...river(6, 'c6'),
        ...fixed('b4', 'g5', 'c6'),
        ...loose('e4', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2'),
        ...wall(7, 'c7'),
        ...wall(8, 'd8', 'e8'),
      ],
    }),
  ],
};

export default RUN_REVENGE_59;
