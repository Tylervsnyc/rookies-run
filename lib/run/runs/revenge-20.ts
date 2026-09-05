/**
 * revenge-20 — THE ALLEY. Built 2026-09-05 for the signature pair
 * smoke + rabies-dart ("blind the court"). Rabies Dart is the game's
 * thinnest card (it eats YOUR nearest body beside any summon), so the kit
 * carries NO summons and every level is built so the madness has nothing
 * to bite but the king's own court.
 *
 * THE MECHANISM, from the code (lib/run/pawn-ai.ts, abilities.ts), with
 * the parts that the harness measures at T1 (the matrix grants T1 cards;
 * "T5" in the matrix is the BOT tier):
 *   - A rabid piece acts FIRST on the enemy turn and its action IS the
 *     turn's action (enemiesPerTurn 1). It captures the nearest reachable
 *     target — Chebyshev, Rookie counts as queen-value, ties to the bigger
 *     piece, then the LOWER FILE, then the lower rank — else it walks
 *     toward the nearest one. A rabid friendly-fire capture stuns the king
 *     two turns and banks the capture for Rookie. Because the bite IS the
 *     enemy turn, any dart is also one free landing for Rookie: whatever
 *     would have recaptured her does not get to move.
 *   - Smoke removes Rookie from every target list (rabid ones included),
 *     hunters hold, the king does not flee. T1 smoke is ONE enemy turn of
 *     cover and her own capture ends it at once: one blind NON-capture
 *     landing. (T5 is three turns and captures keep the cover.)
 *   - The rabid piece lands on its victim's square: rabies empties the
 *     square the guard LEFT, never the victim's.
 *   - A queen with a clear line to any square Rookie lands on simply takes
 *     her (capture priority). "Take her from range" is not a line in this
 *     game; she is taken blind, busy, or bitten by her own pawn.
 *
 * CONSTANT SIGNATURE — THE ALLEY. Every level the king stands at the top of
 * a walled alley on an edge file: stone flanks, a stone floor (nothing
 * marches, nothing spawns boxed under it), a stone roof over the rest of
 * the board (a8-e8, so Rookie can spawn on any file — she only spawns on
 * files with a blocker ahead), and ONE gate square that sees in. Inside,
 * his court is lined up SHOULDER TO SHOULDER with the queen in the line.
 * Enemy ADJACENCY is the structure: what the queue defends, what it can
 * bite, and where the queen can step when a neighbour vacates.
 *
 * KIT = smoke / rabies-dart / boulder / magnet (`allowedAbilities` IS the
 * kit). No summons (rabies eats them), no universal solvents, no
 * freeze-ray / aegis / become-king (antiPairs with smoke), no decoy
 * (antiPair with rabies), no poison-dart (empties pockets).
 *
 * KEY / TRAP per level (T1 cards, as measured):
 *   L1  none — two loose pawns; walk the gate, eat the queue.
 *   L2  none — a 2x2 block against him; pawns only defend DOWNWARD, so its
 *       back rank is free. Take it from the rank-7 gate.
 *   L3  none — first flee king; three undefended bodies, a knight loose.
 *   L4  smoke KEY: the king alone in a 3x3 room OFF the alley's file (f7),
 *       so the queue's capture-stuns cannot pin him. One rook never corners
 *       him; blind for a turn he stands still. boulder (2 stones) also
 *       reads high — it shrinks the room. rabies/magnet: nothing to bite,
 *       nothing to pull. TRAPS.
 *   L5  none — the L2 shape under a flee king, a knight and a bishop.
 *   L6  rabies KEY: the queen stands IN the gate (g3) held by h4 and sees
 *       the whole rank. Dart h4 — she is its nearest, biggest target — and
 *       the pawn bites its own queen and stands undefended in the gate.
 *       smoke buys one blind landing and the recapture comes on the next.
 *   L7-L10  the block: queue pawn a3, QUEEN a4, king a5, crown a6,
 *       defenders b3/b5, b4 stone, gate c3 (reached up the c-file; d3 is
 *       stone). Intended pair line: dart Qa4 — she bites DOWN HER OWN FILE
 *       (a3 sorts before b3) and lands sealed on a3 with a4 empty — then
 *       take b3 blind, take her from b3, and slide a3xa5.
 *
 * MEASURED (Normal, bot T5 = MCTS-160, T1 cards, --jobs=1, 32 trials on
 * L7-L10; 16 trials, --jobs=2 on L1-L6):
 *          none  smoke  rabies  boulder  magnet  smoke+rabies
 *   L1-L3  100%   100%   100%    100%     100%      100%
 *   L4       0%    75%     0%     75%       0%       88%
 *   L5     100%    88%   100%    100%     100%      100%
 *   L6       0%     6%    44%      0%       0%       63%
 *   L7       0%     0%    53%      0%       0%       63%
 *   L8       0%     0%    28%      0%       0%        9%
 *   L9       0%     0%     3%      0%       0%        6%
 *   L10      0%     0%    13%      0%       0%        9%
 * Full runs (40, Normal): 3/40 = 8% clear with random picks, 7/40 = 18%
 * with pool=smoke,rabies-dart; L4 (45-48%) and L6 (24-42%) are the run's
 * filters, and every finale level clears 75-100% in run context (upgraded
 * cards, carried tempo).
 *
 * HONEST MISS — the finale does NOT meet the combo gate. none / smoke /
 * boulder / magnet read 0% on L7-L10, but rabies alone reads 53% on L7 and
 * the pair only 63% / 9% / 6% / 9%. Three findings, all from traces:
 *   1. At T1 a dart IS a free landing: the bite consumes the enemy turn,
 *      so darting b5 (it bites the queen) while taking b3 skips the
 *      recapture AND kills the queen — one card, whole level. Sealing b5
 *      with stone made the pair's own line impossible (T1 smoke ends on
 *      her capture of b3), and every level in between leaked the same
 *      way: in the T1 economy smoke = one free non-capture landing,
 *      rabies = one free landing of any kind plus a body removed, so
 *      rabies strictly dominates smoke and no geometry we found needs
 *      both. The pair is a T5 story (three-turn cover that survives
 *      captures, five-turn rampage), which the matrix does not measure.
 *   2. Rabid targets sort by FILE, so a queen on the h-file bites into the
 *      g-column and walks out of the gate a turn later, sane, undefending
 *      everything behind her (h-side block: rabies alone 100%). The a-side
 *      mirror bites down her own file and stays sealed — hence the finale
 *      lives on the a-file. Any neighbour of hers that a pull or a bite
 *      vacates is an exit: b4 stone (a pawn there bites a3), d3 stone (a
 *      magnet from d3 pulled b3 out: magnet alone 100% -> 0%).
 *   3. BOT-MODELLING GAP: the MCTS-rollout bot models rabies targeting
 *      correctly (the real pawn-ai runs inside its rollouts — traces show
 *      the bites, the queen's escape, the smoke redirect) but it cannot
 *      plan anything that needs a cast plus 2+ specific moves, and never
 *      waits: every "dart, let her feed three turns, then go" design read
 *      0% for the pair while the hand-played line won. Hunters on the
 *      open board (L8-L10) drop the pair from 63% to under 10% because the
 *      rollouts die before the gate. The 0% cells on L9/L10 are the bot's
 *      horizon, not proof of a gate.
 */

import {
  make,
  pawn,
  knight,
  bishop,
  queen,
  king,
  X,
  FLEE,
  STILL,
  type RunDef,
} from '../run-kit';
import type { Coord, EnemyPiece } from '../types';

/**
 * The finisher list every Revenge slate guarantees. Duplicated here (not
 * imported from runs.ts) because runs.ts imports this module's registry —
 * a value import would close the cycle.
 */
const REVENGE_FINISHERS: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

/** A stone column on `file` from rank r1 to r2 inclusive. */
const WALL = (file: number, r1: number, r2: number): Coord[] => {
  const out: Coord[] = [];
  for (let r = r1; r <= r2; r++) out.push(X(file, r));
  return out;
};
/** A stone row on `rank` from file f1 to f2 inclusive. */
const ROW = (rank: number, f1: number, f2: number): Coord[] => {
  const out: Coord[] = [];
  for (let f = f1; f <= f2; f++) out.push(X(f, rank));
  return out;
};
/** A pawn column on `file` from rank r1 to r2 inclusive. */
const COL = (file: number, r1: number, r2: number): EnemyPiece[] => {
  const out: EnemyPiece[] = [];
  for (let r = r1; r <= r2; r++) out.push(pawn(file, r));
  return out;
};
/** Mirror a file for the a-side alley. */
const M = (side: 'a' | 'h', f: number): number => (side === 'h' ? f : 9 - f);

/**
 * The frame every level shares: the stone roof over the open board and
 * the stone floor under the alley (so nothing marches and nothing spawns
 * boxed). `side` picks the edge.
 */
function FRAME(side: 'a' | 'h'): Coord[] {
  const roof = side === 'h' ? ROW(8, 1, 5) : ROW(8, 4, 8);
  const floor = [X(M(side, 7), 1), X(M(side, 7), 2), X(M(side, 8), 1), X(M(side, 8), 2)];
  return [...roof, ...floor];
}

/**
 * The finale block, on the a-file, lifted `up` ranks (0 or 1): queue pawn
 * a3, QUEEN a4, king a5, crown a6, one defender pawn on b3, stone on b4
 * and b5, wall c4-c8, gate c3, and d3 stone so the gate is reached up the
 * c-file. Every stone here closes a measured leak:
 *   - a-side, not h-side: a rabid piece sorts targets by FILE, so a queen
 *     on the a-file bites down her own file (a3) and lands sealed between
 *     floor, wall and her own pawn; on the h-file she bites into the
 *     g-column and walks out of the gate a turn later, sane, undefending
 *     everything (measured: rabies alone 100%).
 *   - b4 stone: a pawn there bites a3 itself, vacating the square she
 *     escapes through.
 *   - b5 stone: a pawn there bites HER, and the bite pre-empts her
 *     recapture of Rookie on b3 — one dart was a full solution (100%).
 *   - d3 stone: from d3 a magnet pulls b3 out of the block, vacating her
 *     exit (magnet alone 100%). From c3 the pull is out of range.
 */
function BLOCK(side: 'a' | 'h', up: number): { pieces: EnemyPiece[]; hazards: Coord[]; pen: string[] } {
  const k = M(side, 8);
  const d = M(side, 7);
  const w = M(side, 6);
  const v = M(side, 5);
  const pieces: EnemyPiece[] = [
    pawn(d, 3 + up),
    pawn(d, 5 + up),
    pawn(k, 3 + up),
    queen(k, 4 + up),
    king(k, 5 + up),
    pawn(k, 6 + up),
  ];
  const hazards: Coord[] = [...FRAME(side), ...WALL(w, 4 + up, 8), X(d, 4 + up), X(v, 3 + up)];
  if (up > 0) hazards.push(X(d, 3), X(k, 3), X(w, 3));
  const pen = [`${side}${5 + up}`];
  return { pieces, hazards, pen };
}

/** The single-file alley: wall g4-g8, gate g3, frame. */
const SINGLE_H: Coord[] = [...FRAME('h'), ...WALL(7, 4, 8)];

const RUN_REVENGE_20: RunDef = {
  id: 'revenge-20',
  name: 'The Alley',
  blurb: 'His whole court lined up in one alley. Nobody asked why.',
  allowedAbilities: ['smoke', 'rabies-dart', 'boulder', 'magnet'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_FINISHERS,
  offerCoreMin: 2,
  levels: [
    // L1 — THE LINE. Still king h8 at the top of the alley. Two loose
    // pawns queue below him with a gap; the top one shuffles down a square
    // and stops. Come along rank 3 to the gate, take h3, take h4, and the
    // file above is empty all the way to him.
    make(
      1,
      [
        pawn(8, 3), pawn(8, 5),
        king(8, 8),
      ],
      {
        ...STILL,
        moveLimit: 6,
        hazards: SINGLE_H,
        kingPen: ['h8'],
      },
    ),
    // L2 — THE DOUBLE FILE. Still king h8 with a 2x2 block of pawns pressed
    // against him (g6/h6/g7/h7) on a stone floor (g5/h5), walled at f6 and
    // f8. Pawns only defend DOWNWARD: g6 and h6 are held, g7 and h7 are
    // not. The gate is f7 — come along rank 7, take g7, take h7, take him.
    make(
      2,
      [
        pawn(7, 6), pawn(8, 6), pawn(7, 7), pawn(8, 7),
        king(8, 8),
      ],
      {
        ...STILL,
        moveLimit: 7,
        hazards: [...ROW(8, 1, 5), X(7, 5), X(8, 5), X(6, 6), X(6, 8)],
        kingPen: ['h8'],
      },
    ),
    // L3 — THE FIRST DOOR. First flee king (h7, room h7/h8) behind three
    // undefended bodies, and a knight loose on the open board to make the
    // walk to the gate cost something. In a one-wide alley a rook below
    // him owns every square he could step to.
    make(
      3,
      [
        ...COL(8, 3, 5),
        knight(4, 5),
        king(8, 7),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: SINGLE_H,
        kingPen: ['h7', 'h8'],
      },
    ),
    // L4 — THE WIDE ROOM. His court has not arrived yet: two loose pawns in
    // the alley and the king alone in a 3x3 ROOM at the top (f6-h8). Eat the
    // queue, and then discover that one rook can never corner a fleeing
    // king in a room that wide — he steps off your line every time. Smoke:
    // he cannot see the threat, so he does not step. Land on his line
    // blind, take him next move. KEY = smoke. Nothing here can be darted
    // into biting a friend, two stones do not shrink a nine-square room
    // enough, and a magnet has nothing to pull.
    make(
      4,
      [
        pawn(8, 3), pawn(8, 4),
        king(6, 7),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: [...FRAME('h'), X(7, 4), X(7, 5), X(6, 4), X(6, 5), X(5, 6), X(5, 7)],
        kingPen: ['f6', 'g6', 'h6', 'f7', 'g7', 'h7', 'f8', 'g8', 'h8'],
      },
    ),
    // L5 — THE PRESSED BLOCK. The L2 shape under pressure: a 2x2 block on
    // a stone floor against a FLEEING king in the corner, a knight and a
    // bishop loose on the board, six moves. Same answer — the back of the
    // block is unguarded — but now the walk to the rank-7 gate has to be
    // read, and the clock is tight.
    make(
      5,
      [
        pawn(7, 6), pawn(8, 6), pawn(7, 7), pawn(8, 7),
        knight(4, 5), bishop(2, 3),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: [...ROW(8, 1, 5), X(7, 5), X(8, 5), X(6, 6), X(6, 8)],
        kingPen: ['h8'],
      },
    ),
    // L6 — THE GUARD BITES. The gatekeeper queen stands IN the gate (g3),
    // defended by the pawn behind her (h4 attacks g3), and she sees the
    // whole of rank 3 — land anywhere on it and she takes you. Dart h4:
    // she is its nearest and biggest target, and the pawn bites its own
    // queen, then stands undefended in the gate. Walk in behind it (the
    // rest of the queue marches down to meet you). Smoke buys one blind
    // landing on the rank and the recapture comes on the next. A magnet
    // needs the same line she does. Boulder walls the file. KEY = rabies.
    // f2 is stone so she cannot slip out down the diagonal; stand on the
    // f-file and she cannot leave the gate at all.
    make(
      6,
      [
        queen(7, 3), ...COL(8, 3, 6),
        pawn(7, 7), pawn(8, 8),
        king(8, 7),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: [...FRAME('h'), X(6, 2), X(7, 4), X(7, 5), X(7, 6), X(7, 8), X(6, 7)],
        kingPen: ['h7'],
      },
    ),
    // L7 — THE QUEUE. The finale shape, taught with room to breathe: the
    // block g3-g5 / h3 with the queen at h4, king h5, crown h6, gate f3.
    // g3 is held by the queen, h3 by g4 and the queen, the queen by g5 —
    // two defended captures before any square that attacks him, and smoke
    // covers one. Dart her: she bites g3 (lowest file first) and stands in
    // the gate undefended, with h4 empty behind her. Take her, smoke, take
    // h3 blind, and slide h3xh5.
    (() => {
      const b = BLOCK('a', 0);
      return make(7, b.pieces, { ...FLEE, moveLimit: 8, hazards: b.hazards, kingPen: b.pen });
    })(),
    // L8 — THE FAR ALLEY. The same block mirrored to the a-file (queen a4,
    // king a5, gate c3) and a knight loose on the open board covering the
    // squares you approach from.
    (() => {
      const b = BLOCK('a', 0);
      return make(8, [...b.pieces, knight(4, 4)], { ...FLEE, moveLimit: 8, hazards: b.hazards, kingPen: b.pen });
    })(),
    // L9 — THE HIGH ALLEY. The block one rank up (g4-g6 / h4, queen h5,
    // king h6, crown h7, gate f4) so the walk is longer, and a bishop
    // raking the squares you wait on. Seven moves.
    (() => {
      const b = BLOCK('a', 0);
      return make(9, [...b.pieces, bishop(6, 6)], { ...FLEE, moveLimit: 8, hazards: b.hazards, kingPen: b.pen });
    })(),
    // L10 — THE PACKED ALLEY. Mirrored, two enemies a turn (the bite is one
    // action; a hunter still gets the other), a knight and a bishop on the
    // open board, seven moves.
    (() => {
      const b = BLOCK('a', 0);
      return make(10, [...b.pieces, knight(5, 4), bishop(6, 3)], {
        ...FLEE,
        moveLimit: 8,
        hazards: b.hazards,
        kingPen: b.pen,
      });
    })(),
  ],
};

export default RUN_REVENGE_20;
export { RUN_REVENGE_20 };
