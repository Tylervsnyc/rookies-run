/**
 * revenge-50 — THE MURDER HOLE. Built 2026-09-09 for the signature pair
 * FREEZE RAY + TWIN. Kit = freeze-ray / twin / magnet / aegis
 * (`allowedAbilities` IS the kit). All four cards are LIVE.
 *
 * CONCEPT (A): an unbuilt pair the discovery harness has already proved can
 * gate — `freeze-ray+twin` gates a generated L7 at 83% with a UNIQUE answer
 * under a kit where every single card reads 0%
 * (data/run-playtest/combo-library/freeze-ray+twin/). TWIN has been half of
 * three shipped pairs (knight-hop + twin, The Parapet's two-rook net; twin +
 * rewind, The Dogleg's undo; twin + sacrifice, The Rood's aim) and in none of
 * them was the Twin's ONE distinguishing property — that it is a body BORN
 * beside you rather than walked to where you need it — the point of the level.
 * FREEZE RAY has been half of two (freeze-ray + vanguard, The Glasshouse;
 * dragon + freeze-ray, The Loophole) and in both its job was to buy a body one
 * enemy phase of quiet. Here its job is the opposite: to stop the KING moving
 * at all, for the two turns a rook needs to cross a room it can never leave.
 *
 * THE VERB: GROW A ROOK IN A ROOM WITH NO DOOR. Not crossing a wall (The
 * Moat), not baiting hunters (The Alley), not a poison timer (The Switchback),
 * not blowing a hole (The Briar), not caging with his own guard (The Alcove),
 * not a double door (The Millstone), not a two-rook net (The Parapet), not
 * buying a body time (The Lattice), not moving the wall (The Quarry), not an
 * undo (The Dogleg), not a suicide capture (The Picket), not a lure (The
 * Pinch), not zugzwang (The Niche), not a body in a hole nothing can walk to
 * and one bought phase (The Loophole), not standing on the square that kills
 * you (The Embrasure), not aim (The Rood), not crowning him (The Coronation),
 * not breaking a ring at the corner (The Kennel), not being the door (The
 * Oubliette). Every one of those argues about a square Rookie can eventually
 * OCCUPY. This one is about a square she can never occupy at all: a rook moves
 * on ranks and files, so a square whose whole rank and whole file are sealed is
 * a square no rook will ever stand on — and a summon does not walk in, it is
 * BORN there, on a diagonal she cannot travel.
 *
 * ── CONSTANT SIGNATURE — THE MURDER HOLE ───────────────────────────────────
 * A murder hole is the shaft cut through a gatehouse ceiling: no stair, no
 * door, nothing walks into it — the only thing that ever comes out of it is
 * what you drop through. Every level in this run draws one:
 *
 *   THE HOLE is a ONE-SQUARE-WIDE BLIND CORRIDOR. Both long sides are stone
 *   for its whole length, its NEAR end is stone (the SEAL), and its FAR end
 *   (the MOUTH) is the only opening — and the mouth looks straight into the
 *   king's room. Because a rook moves on ranks and files only, the corridor's
 *   floor squares are unreachable by ROOKIE from anywhere on the board: to
 *   enter she would have to cross the seal or come in through the mouth, and
 *   the mouth is the far side of the king's room. The one square that touches
 *   the outside world touches it DIAGONALLY, through the corner where the seal
 *   meets a side wall. A rook cannot make that step. A summon does not have to.
 *
 * Not a band of water (The Moat), not a hall of pillars (The Colonnade), not a
 * sealed strongbox (The Vault), not offset stone bars, not a pawn hedge (The
 * Briar), not a glass box (The Glasshouse), not stone stacks with shafts (The
 * Stacks — a shaft is open at BOTH ends and is walked up), not a stone diagonal
 * (The Cliff), not a walled alley (The Alley), not a diamond around a pillar,
 * not a solid rank-6 wall, not a lattice of panes (The Lattice), not a doorstep
 * alcove (The Alcove — an alcove is a place you step into), not a niche with
 * dogs at its corners (The Kennel), not a pit with a lip (The Oubliette). The
 * hole is the one structure in the catalogue that is DEFINED by being
 * unreachable, and the run's whole question is: WHAT DO YOU PUT IN IT, AND
 * WHAT DOES ITS MOUTH SEE?
 *
 * ── WHY THIS PAIR, read out of lib/run/abilities.ts and lib/run/pawn-ai.ts ──
 *
 *   1. `summonSpawnSquares` (abilities.ts:3858) gives every summon except the
 *      Vanguard the EIGHT NEIGHBOURS of Rookie's square — including the four
 *      DIAGONAL ones. A rook can never move to a diagonal neighbour. So the
 *      set of squares a summon can be born on is strictly larger than the set
 *      of squares Rookie can reach, and the difference is exactly four squares
 *      per stand. Seal a corridor and put its back square on that diagonal and
 *      you have a body inside a room that has no door.
 *   2. The TWIN is a ROOK (`summonPieceFor` → 'rook'), the only summon with
 *      Rookie's own geometry. So the thing born in the hole is not a helper
 *      with a strange move — it is a SECOND ROOKIE, standing on a square the
 *      first one could never stand on. That is the whole idea of the run, and
 *      it is why no other summon is in the kit.
 *   3. `kingFleeMove` (pawn-ai.ts:248) steps him off any square Rookie's or a
 *      controlled summon's line attacks, re-evaluated with the king RELOCATED.
 *      A LONE ROOK NEVER CORNERS A KING IN A 2x2 — he steps to the line she is
 *      not on, forever (measured in The Vault L5, The Slash, The Parapet, The
 *      Hayloft). The twin arriving at the mouth attacks ONE rank of his 2x2;
 *      the other rank is his, and the twin can never get to it, because the
 *      only way out of the hole is back down the hole.
 *   4. `applyTargeted` (abilities.ts:2213) — FREEZE RAY IS THE ONE DART THAT
 *      MAY TOUCH THE KING, it needs NO line of sight at all (`isVisibleEnemy`
 *      is a bare occupancy test, abilities.ts:2477), and a frozen KING gets
 *      `freezeTurns(tier) + 1` — TWO enemy turns at T1. Two enemy turns is
 *      exactly the length of the line: the turn the twin walks to the mouth,
 *      and the turn it crosses his room and takes him.
 *   5. Both halves are FREE ACTIONS. Cast the dart, summon the body, and move
 *      the body — all in one turn, the shape the playtest bot can actually
 *      find (`.claude/run-level-design.md`, "provable but unfindable").
 *
 * ── WHY EACH HALF IS DEAD ALONE ────────────────────────────────────────────
 *   twin alone — the body is born in the hole and reaches the mouth, he steps
 *     to the rank the mouth cannot see, and the twin has nowhere to follow:
 *     the room's far side is stone and the hole is behind it. He is safe on
 *     that rank for the rest of the level. 0%, structurally.
 *   freeze-ray alone — he is pinned for two turns and it buys nothing, because
 *     ROOKIE HAS NO LINE TO HIM AND CANNOT ACQUIRE ONE: every rank and file
 *     into his room is stone except the one the hole looks down, and she can
 *     never stand in the hole. 0%, structurally.
 *   magnet alone — pulls the first enemy along her CURRENT form's lines toward
 *     her. Her lines never enter his room, and the king is immune below T5.
 *   aegis alone — blocks one capture. Nothing in this run's finale ever tries
 *     to capture her; the gate is not "survive a phase" (see DEAD ENDS 1).
 *
 * ── KIT: freeze-ray / twin / MAGNET / AEGIS ────────────────────────────────
 * No universal solvent: bishop-step, knight-hop and become-king are absent and
 * each of them would break every level in the run — bishop-step and knight-hop
 * because a diagonal or an L-jump walks INTO the hole, which is the one thing
 * the whole signature forbids. No second summon: the twin is the body, and a
 * second body is a second thing competing for the one body-move a turn.
 *
 * The two fillers were chosen against ONE rule this geometry forces:
 *   **NO FILLER MAY STOP THE KING MOVING FOR A PHASE.** The gate is "he must
 *   still be on that rank when the twin crosses the room", so smoke (he does
 *   not flee while she is smoked), decoy, poison-dart, hourglass, snare,
 *   scarecrow, panic, chequer and coup are all disqualified before a square is
 *   drawn — every one of them buys the same phase the dart buys.
 *   MAGNET pulls along her lines, which never reach his room, and cannot touch
 *     a king below T5. `magnet+rewind`, `magnet+summon-knight`, `magnet+page`
 *     and `magnet+poison-dart` are all in SYNERGY.md's proven never-gates list.
 *   AEGIS is 0% alone on every finale of every run ever measured, and here it
 *     is not even a temptation: Rookie is never within reach of anything in the
 *     finale, so there is no capture for it to block.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L        twin             freeze-ray       magnet        aegis
 *   1-2      trap             trap             trap          trap  (bare wins)
 *   3        KEY              trap             trap          trap
 *   4        trap             KEY              trap          trap
 *   5        trap             trap             KEY           trap
 *   6        KEY              trap             trap          trap
 *   7-10     half the gate    half the gate    trap          trap
 *
 * ── THE FOUR FINALE LINES (written before building; they must differ) ──────
 *   L7  THE HOLE. The plain statement of the run. The hole is the d-file,
 *       d4-d7, sealed at d3 and walled at c4/c5 and e4-e7; its mouth d7 looks
 *       west down rank 7 at a king in a 2x2 (b7/b8/c7/c8). Reach c3 or e3 —
 *       the only two squares on the board diagonally adjacent to the hole's
 *       back — freeze him, grow the twin on d4, and run it to d7 in the same
 *       turn. He is pinned through the enemy phase; next turn the twin crosses
 *       rank 7 and takes him. Both knights on rank 1 cover one of the two
 *       approach squares apiece, so the first decision of the level is which
 *       door to use.
 *       DECISION: the target is the KING and the order is dart-then-body.
 *
 *   L8  THE WRONG HOLE. TWO holes, and the obvious one is a decoy. The d-file
 *       hole's mouth looks down rank 7 — and he is standing on RANK 8. The
 *       hole that matters is the g-file, whose mouth at g8 looks west down
 *       rank 8, and its back square is reachable only from h3, the far corner.
 *       `enemiesPerTurn: 2`. A twin spent in the wrong hole is the level lost:
 *       there is one use of it and it can never come back out.
 *       DECISION: a different TARGET SQUARE — the level is about which mouth
 *       sees him, not about the dart at all, and the dart is cast last.
 *
 *   L9  THE PLUG. The mouth of the hole is not empty: a knight of his stands
 *       on c7, on the one line the twin will ever have, and a pawn on b8
 *       defends it. The twin has to TAKE the plug, and taking it is what stuns
 *       the king (her side's capture, one turn) — so the dart is NOT for the
 *       king this time. It is for the PAWN, the only piece that can answer the
 *       capture, because a twin that dies on c7 is a twin that never crosses.
 *       DECISION: the dart's target is a GUARD, and the king is held by a
 *       capture-stun instead.
 *
 *   L10 THE HOLE THAT ONLY SEES THE DOOR. The mouth looks at c7 — his flight
 *       square — and never at him: he sits on b8 behind a stone corner and no
 *       line from the hole will ever touch that square. So the twin cannot be
 *       the killer here; it is the COVER. ROOKIE has the only line to b8, up
 *       the b-file, and the moment she takes it he steps to c8 and then to c7
 *       and she can never catch him. Grow the twin, run it to the mouth so c7
 *       and c8 are dead, freeze him so he cannot use the one turn he has, and
 *       come up the file yourself.
 *       DECISION: the roles swap — the twin covers, ROOKIE kills — and the
 *       dart buys her the approach rather than the twin's crossing.
 *
 * Each of L8-L10 adds something L7's solution does not cover: L8 makes the
 * choice of hole the puzzle and moves him off the rank the obvious mouth sees,
 * L9 puts a defended body in the mouth's line and moves the dart off the king,
 * L10 takes the kill away from the twin entirely.
 *
 * ── MEASURED — 2026-09-09, difficulty=normal, `revenge.ts matrix` ──────────
 * Numbers of record: 32 trials, `--jobs=1`, the run's own 4-card kit.
 *
 *   L    none    twin  freeze-ray  magnet  aegis | twin+freeze-ray
 *   7      0%      0%       0%       0%      0%  |       84%
 *   8      0%      0%       0%       0%      0%  |       66%
 *   9      0%      0%       0%       0%      0%  |       84%
 *  10      0%      0%       0%       0%      0%  |       91%
 *
 * THE GATE IS MET AND IT IS CLEAN: no ability and every single card in the kit
 * read 0% on all four finales — 20 cells of zero — and the pair means 81%.
 * THREE OF THE FOUR ARE ABOVE THE 60-80% BAND (L7 84, L9 84, L10 91); only L8
 * sits inside it. L8 is the one finale whose line the bot does NOT play
 * perfectly, and that is exactly why the clock worked there and nowhere else:
 * L8 went 100% -> 41% -> 66% on moveLimit 5/6/7 with the watchman on d2, while
 * L10 read 91% at moveLimit 6 AND at moveLimit 5 — the same number twice, on
 * the same board. That is The Kennel's DEAD END 3 reproduced exactly: **a clock
 * is a knob for a level the bot sometimes misplays and no knob at all for one
 * it plays perfectly.** The one lengthener tried on L10 — a second cork in the
 * shaft (a pinned pawn on d6, so the twin must eat d5 AND d6 before the mouth)
 * — took it straight from 91% to 0% at moveLimit 7: four twin moves cannot be
 * covered by two frozen turns and two capture-stuns. There is no third setting
 * between them, so 91% ships. Tyler should read L10 as the easiest of the four
 * once the idea is his, and L8 as the hardest.
 *
 * TIER LADDER, L7-L10, 32 trials, jobs=1, one card pinned per invocation:
 *   twin        T1 0/0/0/0   T2 0/0/0/0   T3 0/0/94/0   T4 0/0/91/0
 *               T5 3/13/6/3
 *   freeze-ray  T5 0/0/0/0            (never a solvent at any tier — no cap)
 *   magnet, aegis — 0/0/0/0 at every tier; neither has a mechanism here.
 * The break is L9 and it is the tier that doubles the body's LIFE, not its
 * count: `summonTurnsFor('twin', tier)` is 4/6/8/level/level enemy turns, and
 * L9's whole gate is that the pawn on e8 eats a twin standing at the mouth.
 * A T3 twin outlives that exchange, walks back up the shaft and finishes with
 * no dart at all. **`abilityTierCaps: { twin: 2 }`.** (Note T5 reads LOWER than
 * T3/T4 — 3/13/6/3. A permanent twin is a second body the bot spends moves
 * shuffling; the tier that breaks a gate is not always the top one, which is
 * why the doc says sweep every tier rather than only the last.)
 *
 * MID-RUN, 16 trials, jobs=3:
 *   L    none    twin  freeze-ray  magnet  aegis
 *   1    100%    100%     100%      100%   100%
 *   2    100%    100%     100%      100%   100%
 *   3      0%    100%       0%        0%     0%   (twin KEY, clean)
 *   4      0%     94%       0%        0%     0%   (twin KEY, clean)
 *   5      0%     63%      94%        0%   100%   (freeze-ray KEY, NOT clean)
 *   6      0%    100%       0%        0%     0%   (twin KEY, clean)
 * L1-L2 free bare, L3-L6 impossible bare. L5 is the run's one soft level and
 * DEAD END 2 below says why it could not be made clean.
 *
 * FULL RUNS, 40 runs, T5, difficulty=normal:
 *   random picks from the whole kit    0/40 =  0%   (L3 and L7 are the walls:
 *                                                    L7 33%, L8 0%, nobody
 *                                                    reached L9)
 *   `--pool=twin,freeze-ray`           9/40 = 23%   (L3 80, L7 71, L8 45,
 *                                                    L9 100, L10 100)
 * 0% with random picks is the lowest number any combo run in the catalogue has
 * posted and it is BELOW the Moat's 10-25% target rather than above it — the
 * opposite of the structural complaint in `.claude/run-level-design.md` ("a
 * random picker nearly always holds both halves by L7"). The reason is that
 * this kit's two fillers are not merely traps, they are INERT: magnet and aegis
 * have no mechanism anywhere in the run, so a player who takes either has
 * spent a slot on nothing, and L3 — gated on ONE card, four levels before the
 * finale — ends the run there. Whether 0% is too punishing is Tyler's call; the
 * cheap lever is to make magnet or aegis the key on one mid-run level.
 *
 * ── DEAD ENDS ──────────────────────────────────────────────────────────────
 *
 * 1. THE FIRST L9 GAVE THE MOUTH A GUARD THAT COULD WALK OFF IT. A knight on
 *    b8 whose only legal jump was d7 — the mouth — looked like a chained gun
 *    trained on the one square the twin has to stand on. It read twin-alone
 *    100%: hunters advance, so the knight jumped INTO the mouth on turn one,
 *    the twin ate it for free (a capture, hence a stun), and stood exactly
 *    where it wanted to be. The fix is the difference between a knight and a
 *    pawn: **a piece that COVERS a square by moving to it will move to it; only
 *    a pawn covers a square it can never occupy.** The pawn on e8 attacks d7
 *    diagonally and is pinned against the shaft's own east wall at e7, so it is
 *    a gun and not a hunter. 100% -> 0% for the twin alone with nothing else
 *    changed.
 *
 * 2. FREEZE RAY CANNOT BE A CLEAN SINGLE-CARD KEY IN THIS SIGNATURE, AND THE
 *    REASON GENERALISES. A freeze-key level needs Rookie to HAVE a line to him
 *    (the dart holds him on it). But a rook's line runs through the square next
 *    to him, so any level where she has a line is a level she can walk to his
 *    doorstep — and then AEGIS wins it (stand there, eat his capture, take him
 *    next turn) and so does a TWIN born beside her at that range (two rooks
 *    corner a 2x2). Three builds of L4 were thrown away to this: 2x2 cell with
 *    the b-file open read none 19% / twin 100% / freeze 100% / aegis 100% at
 *    moveLimit 10 AND at moveLimit 6 — the clock does not separate them because
 *    every one of those answers is the same length. L4 became a second TWIN
 *    level (mirrored east, so the silhouette is new) and L5 kept the freeze at
 *    94% while conceding aegis at 100%. **The rule: a card whose payoff needs a
 *    LINE cannot be gated against cards whose payoff needs PROXIMITY, because a
 *    rook's line is a corridor to proximity.** Freeze Ray's only clean home in
 *    this run is the finale, where she never has a line at all.
 *
 * 3. TWO HOLES IS NOT A DECISION THE BOT CAN MAKE. The designed L8 was "the
 *    wrong hole": a d-file shaft whose mouth saw only stone and a g-file shaft
 *    in the far corner whose mouth saw rank 8, one twin between them. It read
 *    19% for the pair — not because the choice was hard but because the right
 *    shaft's approach square was four moves from any start and the rollouts
 *    never got there. Replaced by ONE shaft with TWO MOUTHS (floor d5-d8, so
 *    the twin can hold rank 7 from d7 or rank 8 from d8 and never both), which
 *    is the same question asked inside one structure the bot is already
 *    standing in: 19% -> 66%. Same family as The Warren's "a low pair number on
 *    an open board is evidence about the harness, not about the level" — here
 *    it was evidence about the DISTANCE, not the idea.
 *
 * 4. THE WATCHMAN THAT COVERS BOTH DOORS IS THE ONLY LENGTHENER THAT WORKED.
 *    L7 has exactly two squares from which the shaft can be seeded — c3 and e3,
 *    the two squares diagonally adjacent to its back — and ONE knight, on d1,
 *    is a knight's move from both. Adding it made the level five moves instead
 *    of four (take the watchman, then the door, then the body, then the kill)
 *    and took the pair from 94% to 84%; the same device on L8 (a knight on d2,
 *    a knight's move from both c4 and e4) is what let L8's clock do any work at
 *    all. Corollary for this signature: **the shaft's two approach squares are
 *    always a knight's move apart, so one knight always watches both.** That is
 *    a free difficulty knob every level in this family gets for one piece.
 */

import {
  FLEE,
  STILL,
  X,
  king,
  knight,
  make,
  pawn,
  type RunDef,
} from '../run-kit';
import type { Coord } from '../types';

/** 'f4' -> {file:6, rank:4}. Authoring convenience only. */
const sq = (name: string): Coord => X(name.charCodeAt(0) - 96, Number(name.slice(1)));

/** Stone, by name. */
const S = (...names: string[]): Coord[] => names.map(sq);

/** The 2x2 cell in the north-west: b7/b8/c7/c8, walled south and east. */
const CELL_NW = ['a6', 'a7', 'a8', 'b6', 'c6', 'd8'];
/** The d-file hole: floor d4-d7, sealed at d3, walled both sides. */
const HOLE_D = ['d3', 'c4', 'c5', 'e4', 'e5', 'e6', 'e7', 'e8'];
/** Everything west of the hole below his cell — she can never climb it. */
const WEST_SEAL = ['a3', 'a4', 'a5', 'b3', 'b4', 'b5'];
/** The east third, carved out so the search space is small (The Warren). */
const EAST_CARVE = [
  'f3', 'f4', 'f5', 'f6', 'f7', 'f8',
  'g3', 'g4', 'g5', 'g6', 'g7', 'g8',
  'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
];
/** Rank 2 is a corridor, not a plain: only c2/d2/e2 are floor. */
const RANK2_SEAL = ['a2', 'b2', 'f2', 'g2', 'h2'];

const CELL_PEN = ['b7', 'b8', 'c7', 'c8'];

export const RUN_REVENGE_50: RunDef = {
  id: 'revenge-50',
  name: 'The Murder Hole',
  blurb:
    'There is a shaft cut into his gatehouse with no stair and no door: both walls stone, the back stone, and the only opening looking straight into his room. No rook will ever stand in it — a rook moves on ranks and files, and every rank and file into that shaft is sealed. But a body does not have to walk in. It can be born there.',
  allowedAbilities: ['twin', 'freeze-ray', 'magnet', 'aegis'],
  // Measured L7-L10, 32 trials, jobs=1, one card pinned per invocation:
  //   twin        T1 0/0/0/0   T2 0/0/0/0   T3 0/0/94/0   T4 0/0/91/0
  //               T5 3/13/6/3
  //   freeze-ray  T5 0/0/0/0   (never a solvent at any tier — no cap)
  // T3 is the first Twin tier that doubles the body's LIFE (summonTurnsFor:
  // 4/6/8/level/level enemy turns), and on L9 a twin that outlives the pawn's
  // recapture window walks back up the shaft and finishes without the dart.
  // The highest tier at which every single kit card still reads <= 8% is 2.
  abilityTierCaps: { twin: 2 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // ── L1 — THE SHAFT. The silhouette, for free. The hole is drawn on the
    // board (d4-d7, sealed at d3) and it is completely beside the point: he
    // stands still at b7 with the whole b-file open under him. Pure rook play.
    make(1, [king(2, 7), pawn(2, 4)], {
      ...STILL,
      moveLimit: 12,
      hazards: S(...HOLE_D, 'a6', 'c6', 'c7'),
    }),
    // ── L2 — THE SHAFT AND A DOOR. Same hole, same irrelevance, but he runs
    // now and one knight stands in the file. Take the knight (her capture
    // stuns him for a turn) and finish on the b-file before he recovers.
    make(2, [king(2, 7), knight(2, 4), pawn(7, 6)], {
      ...FLEE,
      moveLimit: 14,
      kingPen: ['b7', 'b8'],
      hazards: S(...HOLE_D, 'a6', 'a7', 'a8', 'c6', 'c7', 'c8'),
    }),
    // ── L3 — WHAT COMES OUT OF THE HOLE (twin KEY). The cell closes to a 1x2
    // at b7/b8 with a6/a7/a8/b6/c6/c8 stone, so no rank and no file she can
    // occupy ever touches him — the c-file dies at c6 and rank 7 dies at c7,
    // which she can never reach. The hole's mouth d7 looks west down rank 7 to
    // c7 and b7. One body, walked in one square at a time, corners a king in a
    // 1x2 all by itself: no dart needed, and nothing else in the kit puts a
    // rook on d4.
    make(3, [king(2, 7)], {
      ...FLEE,
      moveLimit: 12,
      kingPen: ['b7', 'b8'],
      hazards: S(
        ...HOLE_D,
        ...WEST_SEAL,
        ...EAST_CARVE,
        ...RANK2_SEAL,
        'a6', 'a7', 'a8', 'b6', 'c6', 'c8', 'd8',
      ),
    }),
    // ── L4 — THE SHAFT, MIRRORED (twin KEY). The same idea told backwards, so
    // the silhouette is new and the reflex from L3 is wrong: the shaft is the
    // E-FILE, floor e4-e7, sealed at e3, walled at d4-d7 and f4/f5/f6 — and its
    // mouth at e7 looks EAST along rank 7, not west. He is in a 1x2 at g7/g8
    // behind f7. Her approach squares move with the shaft: d3 and f3. Nothing
    // she can stand on ever sees rank 7 (h7 and g6 and f6 are stone), so a body
    // in the shaft is the only thing on the board that can walk his room, and
    // it corners a 1x2 on its own.
    make(
      4,
      [king(7, 7), knight(3, 1)],
      {
        ...FLEE,
        moveLimit: 12,
        kingPen: ['g7', 'g8'],
        hazards: S(
          'e3', 'd4', 'd5', 'd6', 'd7', 'f4', 'f5', 'f6',
          'f8', 'g6', 'h6', 'h7', 'h8',
          'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
          'b3', 'b4', 'b5', 'b6', 'b7', 'b8',
          'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
          'd8', 'e8',
          'a2', 'b2', 'c2', 'g2', 'h2',
        ),
      },
    ),
    // ── L5 — THE SAME LOCK, THE OTHER WALL (freeze-ray KEY). L4's question
    // asked from the east: the shaft is roofed again and dead, his 2x2 is
    // b7/b8/c7/c8, and this time the open line is the C-FILE, c1 all the way
    // up, with the b-file stone at b6. He shuttles b<->c exactly as before and
    // she can only ever hold one of the two. A knight on e2 costs her the
    // straight road up. Six moves: there is no time to walk to his doorstep and
    // eat a capture, only time to pin him and shoot.
    make(
      5,
      [king(2, 7), knight(5, 2)],
      {
        ...FLEE,
        moveLimit: 8,
        kingPen: CELL_PEN,
        hazards: S(
          'd3', 'c4', 'e4', 'e5', 'e6', 'e7', 'e8', 'd7', 'd8',
          ...EAST_CARVE,
          'a6', 'a7', 'a8', 'b6',
          'a3', 'a4', 'a5',
          'd4', 'd5', 'd6',
        ),
      },
    ),
    // ── L6 — THE HOLE AGAIN, LYING DOWN (twin KEY). Back to the shaft, and now
    // his cell is a 1x2 the other way round: b7/c7, with rank 8 stone above it.
    // The mouth at d7 looks straight along that rank, so ONE rook standing at
    // the mouth attacks c7 and b7 at once and he has nowhere at all — one body,
    // one move, no dart. Nothing else in the kit puts a rook on d4.
    make(
      6,
      [king(2, 7), knight(5, 1), pawn(3, 5)],
      {
        ...FLEE,
        moveLimit: 8,
        kingPen: ['b7', 'c7'],
        hazards: S(
          ...HOLE_D,
          ...WEST_SEAL,
          ...EAST_CARVE,
          ...RANK2_SEAL,
          'a6', 'a7', 'a8', 'b6', 'b8', 'c6', 'c8', 'd8',
        ),
      },
    ),
    // ══ L7 — THE HOLE ══════════════════════════════════════════════════════
    // The run's plain statement. The hole is the d-file, floor d4-d7, sealed
    // at d3, walled at c4/c5 and e4-e7. Its mouth d7 looks west down rank 7.
    // He lives in a 2x2 — b7/b8/c7/c8 — and a lone rook never corners a king
    // in a 2x2: the twin at the mouth attacks rank 7, he steps to rank 8, and
    // the twin can never get there (d8 is stone; the only way out of the hole
    // is back down it). So the dart is not a convenience, it is the level.
    //   c3 and e3 are the only two squares on the board diagonally adjacent to
    // d4, the back of the hole, and they are also the two nearest squares to
    // him that she can reach at all — every square nearer is stone. ONE knight,
    // on d1, is a knight's move from BOTH of them, so there is no door that is
    // not watched and the level is five moves long, not four: take the watchman
    // first, and take him from a square that is still on the way.
    make(
      7,
      [king(2, 7), knight(4, 1), knight(7, 1)],
      {
        ...FLEE,
        moveLimit: 5,
        enemiesPerTurn: 2,
        kingPen: CELL_PEN,
        hazards: S(
          ...HOLE_D,
          ...WEST_SEAL,
          ...EAST_CARVE,
          ...RANK2_SEAL,
          ...CELL_NW,
        ),
      },
    ),
    // ══ L8 — THE HOLE WITH TWO MOUTHS ═════════════════════════════════════
    // The shaft moves up one rank: floor d5-d8, sealed at d4, walled at c5/c6
    // and e5-e8. It now has TWO mouths. At d7 it looks west down rank 7; at d8
    // it looks west down rank 8 — and his 2x2 is b7/b8/c7/c8, one rank apiece.
    // A twin in the shaft can hold either rank and never both, and it can walk
    // between them all level: that is precisely the shuttle a lone rook loses,
    // because he changes rank on the same beat it does.
    //   The back of the shaft is d5, so the two approach squares move too — c4
    // and e4, one rank higher than the ones L7 taught, and c3/e3 are now dead
    // ends. `enemiesPerTurn: 2` and one move fewer.
    // DECISION: the dart names WHICH RANK he is standing on when you commit
    // the body — the choice of mouth, not the choice of hole.
    make(
      8,
      [king(2, 7), knight(4, 2), knight(7, 1)],
      {
        ...FLEE,
        moveLimit: 7,
        enemiesPerTurn: 2,
        kingPen: CELL_PEN,
        hazards: S(
          // the shaft: floor d5-d8, sealed at d4
          'd3', 'd4', 'c5', 'c6', 'e5', 'e6', 'e7', 'e8',
          ...WEST_SEAL,
          ...EAST_CARVE,
          ...RANK2_SEAL,
          'a6', 'a7', 'a8', 'b6',
        ),
      },
    ),
    // ══ L9 — THE GUARD ON THE MOUTH ═══════════════════════════════════════
    // L7's shaft, and his cell shrinks to a 1x2 lying along rank 7 — b7/c7,
    // with rank 8 stone above it. A twin at the mouth d7 attacks BOTH of his
    // squares at once, so on this level the body alone would be enough...
    // except that one of his pawns stands on e8, on the far side of the shaft
    // wall, and a black pawn attacks the two squares diagonally BELOW it: f7,
    // which is stone, and d7, which is the mouth. The pawn can never move — e7,
    // the square in front of it, is the shaft's own east wall — so it is not a
    // hunter, it is a fixed gun trained on the one square the twin has to stand
    // on. A twin that walks to d7 is eaten on the enemy phase.
    //   So the dart is not for the king on this level: he has nowhere to go the
    // moment the twin lands. It is for the PAWN, and one frozen turn — the
    // whole of a non-king freeze at T1 — is the entire level.
    // `enemiesPerTurn: 2`.
    // DECISION: a different TARGET — the dart holds a guard, not the king.
    make(
      9,
      [king(2, 7), pawn(5, 8), knight(5, 1)],
      {
        ...FLEE,
        moveLimit: 6,
        enemiesPerTurn: 2,
        kingPen: ['b7', 'c7'],
        hazards: S(
          // the shaft — same as L7 but e8 is left open for the gun
          'd3', 'c4', 'c5', 'e4', 'e5', 'e6', 'e7',
          ...WEST_SEAL,
          ...EAST_CARVE,
          ...RANK2_SEAL,
          'a6', 'a7', 'a8', 'b6', 'b8', 'c6', 'c8', 'd8',
        ),
      },
    ),
    // ══ L10 — THE OCCUPIED HOLE ════════════════════════════════════════════
    // The same hole and the same 2x2 cell as L7 — and one of his knights is
    // standing INSIDE the shaft, on d5. A body born on d4 is born underneath
    // it: the twin cannot pass, so its first move is a CAPTURE, and that
    // capture is her side's, so it stuns him for one turn. Then d7, then b7.
    // THREE twin moves, three enemy phases to survive, and the dart is worth
    // two of them. So the arithmetic is exact and the order is forced: the
    // stun has to be the FIRST phase (it is free, it comes with the capture)
    // and the dart's two turns must be the second and the third, which means
    // it is cast on the turn of the capture, not before and not after.
    //   And the knight is not furniture. Its jump squares from d5 are c7, c3
    // and e3 — the mouth of his own room and BOTH of her approach squares — so
    // it will leave the shaft to come at her, and where it goes decides which
    // door she can still use and whether the mouth is clear when the twin
    // arrives. `enemiesPerTurn: 2`.
    make(
      10,
      [king(2, 7), knight(4, 5), knight(7, 1)],
      {
        ...FLEE,
        moveLimit: 6,
        enemiesPerTurn: 2,
        kingPen: CELL_PEN,
        hazards: S(
          ...HOLE_D,
          ...WEST_SEAL,
          ...EAST_CARVE,
          ...RANK2_SEAL,
          ...CELL_NW,
        ),
      },
    ),
  ],
};

export default RUN_REVENGE_50;
