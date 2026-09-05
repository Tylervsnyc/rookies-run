/**
 * revenge-19 — THE CLIFF. Built 2026-09-05 for the signature pair
 * CONVERT + SUMMON-KNIGHT (the Squire). The pair was not on anyone's list —
 * the discovery harness found it on a generated colonnade (see
 * data/run-playtest/combo-library/convert+summon-knight/), where it read 75%
 * while Convert alone and the Squire alone both read 0%. This run is that
 * accident turned into a design.
 *
 * THE MECHANISM (read from lib/run/abilities.ts + pawn-ai.ts, then verified
 * by hand-playing the line through the engine).
 *   - The Squire is the only body in the kit that can TAKE the king
 *     (controlledAllyLegalMoves may land on him; AI allies never may) and
 *     the only body that jumps terrain. But the king FEARS him: a fleeing
 *     king sidesteps any square a controlled summon attacks
 *     (kingFleeMove -> controlledThreatensSquare), so a knight threat on a
 *     two-square pen is always answered by a step. Alone he chases forever.
 *   - Convert is a FREE action with UNLIMITED range that flips one enemy
 *     into a rainbow ally. The ally is not controlled (Sacrifice cannot
 *     detonate it; it walks on its own), but the fleeing king refuses to
 *     step onto any square an ally attacks (kingFleeMove: `allyCover`), and
 *     a pawn's ally cover is the two squares diagonally ABOVE it. Flip the
 *     pawn standing under his pen and his own guard becomes the bars of his
 *     cage.
 *   - Neither half finishes alone. The ally cannot take him and the rook
 *     cannot reach him; the knight can reach him but he steps away. Flip the
 *     guard so he cannot step, then the knight's threat is a kill. The flip
 *     does double duty: the same pawn that watched the knight's landing
 *     squares (an enemy pawn attacks the two squares diagonally BELOW it)
 *     stops watching them, so Convert both cages the king and opens the
 *     post the Squire needs. Cage-and-take, with his own man as the cage.
 *   - Constraints honoured: Convert clears status on the square (no poison
 *     in the kit), the converted piece is not a summon (no sacrifice), one
 *     body moves per turn below T5, and Convert T1 flips PAWNS only — every
 *     convert target in the run is a pawn.
 *
 * CONSTANT SIGNATURE — THE CLIFF. Every level draws ONE DIAGONAL OF STONE
 * across the board (a2-b3-c4-d5-e6-f7-g8, its mirror h2-g3-f4-e5-d6-c7-b8,
 * or the higher terrace a3-f8 / h3-c8). Not a band (the Moat), not columns
 * (the Colonnade), not a box (the Vault / Glasshouse), not offset bars (the
 * Switchback), not shafts (the Stacks), not a hedge (the Briar). The board
 * is split into the LOWLAND, where Rookie starts and the hunters live, and
 * the PLATEAU above the cliff, where the king keeps his court behind his
 * guard. A diagonal wall has a property no straight wall has: a rook can
 * NEVER cross it — every file and every rank meets a stone — while a knight
 * steps over it anywhere along its length. L1-L2 the cliff has a GOAT PATH
 * (a gap) and Rookie walks up it. L3-L6 the path is closed, plugged or
 * tolled and one card is the intended answer. L7-L10 the cliff is SEALED and
 * his court is in the corner: the Squire is the only thing that climbs, and
 * the king dodges a lone knight for as long as the clock runs — until his
 * own guard is turned.
 *
 * WHY A LONE KNIGHT NEVER WINS THE FINALE (the geometry that makes the pair
 * necessary). Write d = rank - file. The cliff is d = k, the lowland d < k,
 * and a knight jump changes d by +-1 or +-3.
 *   1. The pen must not be spawn-adjacent to a post. A Squire appears next
 *      to Rookie and may move the same turn, so a post one square from a
 *      lowland square is an instant kill (L4 v1 read exactly that, and Vault
 *      L7 v1 before it). No lowland square attacks a pen square with
 *      d >= k+3, and no plateau square adjacent to the lowland (d = k+1)
 *      attacks one with d = k+3 or d >= k+5 — so the pens are a8/b8 (d = 7,
 *      6 on the k=1 cliff) and a8/b7 (7, 5 on the k=2 terrace), plus their
 *      mirrors. A Squire has to LAND on a post and give the king an enemy
 *      turn to answer.
 *   2. Every post is watched by a guard pawn while the guard is his (b7
 *      watches c6; a6 watches b6; on L7/L8 the other posts are stone). A
 *      knight that lands there is eaten before it strikes.
 *   3. No CAPTURABLE piece stands on a post (a knight capture stuns the
 *      king, and a stunned king under a knight's attack is dead), and no
 *      mobile piece can wander onto one (L6 v3: a bishop stepped onto d7 and
 *      the Squire took it there for a capture-stun kill).
 *   4. The convert target stands where it cannot MARCH and, once flipped,
 *      cannot ADVANCE: stone beneath it and the king (or stone) above it.
 *      Enemy pawns walk the moment no hunter can approach — with two enemies
 *      a turn the second action is nearly always a pawn push — and an ally
 *      pawn with an empty square ahead walks too, taking its cover with it
 *      (L9 v1: the flipped a6 stepped to a7 and the king walked out).
 *   With the guard flipped, 2 and 1 invert: the post opens and the pen's
 *   second square is ally-covered. That is the whole run.
 *
 * KIT = convert / summon-knight / aegis / magnet (`allowedAbilities` IS the
 * kit). No universal solvents. antiPairs checked: convert+poison-dart and
 * convert+sacrifice are illegal, rabies+summon is a liability, two summons
 * starve each other, and swap / boulder / smoke / freeze-ray / decoy /
 * rewind each make a SECOND pair with the Squire (body-then-become,
 * cage-and-take, pin-and-parachute, a free stun, undoing his step) that
 * would open the finale to a rival answer. Aegis and Magnet do neither: a
 * shield does not cross stone and a pull line stops at it.
 *
 * KEY / TRAP per level (T5 bot, T1 cards, Normal):
 *   L1  none needed — goat path at e, slide to the top, along rank 8.
 *   L2  none needed — mirrored path at d; a rook on rank 8 kills a rank-8 pen.
 *   L3  summon-knight KEY, alone (100% / everything else 0%): sealed cliff,
 *       STILL king on d7 one jump above the lowland (e5/f6 -> d7).
 *   L4  convert KEY (100%): fleeing king in a diagonal pen (b8/a7) a rook
 *       can attack on one square only; flip the b6 guard so its cover takes
 *       a7 away, then e1-e8. Honest miss: the Squire also reads 100% here —
 *       once the king has stepped to a7, Rookie walks onto b8 and a knight
 *       summoned on c8 takes him at once. Every rook-accessible pen has a
 *       post on rank 8, so a pure Convert key does not exist on this
 *       terrain; L4 is a two-key level (convert or squire), aegis/magnet 0%.
 *   L5  aegis KEY (intended): a plug on e6 the d7 guard takes back, with a
 *       boxed bishop on c8 whose diagonal opens the moment d7 recaptures —
 *       so baiting the recapture with a Squire feeds two bodies to the toll.
 *       Convert on d7 also works (the ally blocks the bishop's ray). The T5
 *       bot rarely finds the shield line (0-13%); convert reads ~90%.
 *   L6  magnet KEY (intended): the plug's square is watched twice by pieces
 *       that never move (guard d7 on a pawn on the cliff, a boxed knight on
 *       d8), two enemies a turn. Pull the plug out, take it, slide THROUGH
 *       the gap with a capture, walk the d-file up through three stuns.
 *       The AND-OR solver finds forced wins for every card here within 8
 *       moves; the T5 bot finds almost none (magnet 13%, convert ~50%).
 *   L7  PAIR. Corner court a8/b8, king on b8, guard a7/b7 and crown d8 all
 *       on stone. Flip b7, Squire d4/e5 -> c6, take him. Knight f3 watches
 *       both spawn squares.
 *   L8  PAIR, mirrored (g8/h8). Flip g7, Squire d5/e4 -> f6. Dark bishop and
 *       a knight hunt the lowland.
 *   L9  PAIR on the high terrace (a3-f8): diagonal pen a8/b7, guard a6
 *       between two stones. Flip a6 (its cover is b7), Squire d5 -> b6 or
 *       d5/e6 -> c7, take him. Two enemies a turn.
 *   L10 PAIR, mirrored terrace (h3-c8): pen h8/g7, guard h6. A queen and a
 *       knight below, two enemies a turn, eight moves.
 *
 * L7-L10 intended lines (T1 kit: a Squire move ends the turn):
 *   L7  ...e4 (at most two moves from rank 1). Convert b7 (free), Squire on
 *       d4 (free), Squire d4-c6 (turn). Enemy: b8 is threatened and a8 is
 *       ally-covered — he cannot step; nothing of his reaches c6. Squire xb8.
 *   L8  ...d4 / e3. Convert g7, Squire on e4 or d5, Squire -> f6, xg8.
 *   L9  ...c4 / d4 / e4. Convert a6, Squire on d5, Squire -> b6 (or c7),
 *       xa8. He cannot step to b7.
 *   L10 ...d4 / e4 / f4. Convert h6, Squire on e5, Squire -> g6 (or f7),
 *       xh8.
 *
 * MEASURED (Normal, T5 bot, T1 cards, 2026-09-05). Finale = 32 trials/cell
 * with --jobs=1 SERIAL (other agents' sims shared the machine all day, so
 * parallel cells were not trusted); L1-L6 = 16 trials/cell, --jobs=1.
 *          none convert squire aegis magnet  convert+squire
 *   L1-L2  100%   100%   100%   100%   100%       100%
 *   L3       0%     0%   100%     0%     0%       100%
 *   L4       0%   100%   100%     0%     0%       100%
 *   L5       0%    94%    38%    19%     0%        88%
 *   L6       0%    69%     6%     0%     6%        88%
 *   L7       0%     0%     0%     0%     0%        75%
 *   L8       0%     0%     0%     0%     0%        75%
 *   L9       0%     0%     0%     0%     0%        88%
 *   L10      0%     0%     0%     0%     0%        75%
 * The finale is combo-gated on the Moat's standard: no single card in the
 * kit clears L7-L10 (0% on all sixteen cells), the pair clears 75-88%.
 * FULL RUNS (40 each, Normal, T5, never skipping an offer): 3/40 = 8% with
 * random picks, 5/40 = 13% with pool=convert,summon-knight. Both sit under
 * the Moat's 25% because L3 is a hard filter (Squire or nothing: exactly the
 * half of random pickers holding it pass, 20/40) and because the run-mode
 * bot loses ~20% of L3 and ~28% of L5 on the clock even holding the right
 * cards (the same bot reads L3 100% and L5 88% in the matrix) — the pair
 * being the whole pool does not lift it, so the gap is the bot's run
 * policy, not the finale, which clears 52-83% per level in run context.
 * Honest misses: L4 is a two-key level (Squire 100% beside Convert), L5's
 * aegis line is real but the bot rarely plays it (19%) while Convert reads
 * 94%, and on L6 the AND-OR solver (depth 8) finds forced wins for EVERY
 * card (magnet W8, aegis W8, convert W7, squire W6) that the T5 bot does
 * not — L6 is gated by search depth, not by geometry.
 *
 * DEAD ENDS, so nobody rebuilds them: (a) a runner column (h3/h4/h5) to pin
 * the court PROMOTES on rank 1 — `ph2 -> qh1` in the trace — it is a queen
 * factory, not a clock; stone under the guard is the fix. (b) Hunters that
 * start on Rookie's rank-1 lines are free captures, after which the court
 * marches twice a turn. (c) A plug in the gap can never be a Magnet-only
 * puzzle when a pawn defends it: the defender's own blocker square is the
 * slide-through square, and any single-defended plug is passed by Aegis or
 * by a Squire bait. (d) A two-jump Squire line (b2 -> a4 -> b6) is beyond
 * the T5 bot's horizon: it never summoned. Finale lines are one jump.
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
import type { Coord } from '../types';

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

/**
 * The cliff: one stone on every file where rank = file + k, minus the gap
 * files. k=1 is a2..g8 (plateau top-left), k=2 is a3..f8 (a higher terrace).
 */
const CLIFF = (k: number, ...gaps: number[]): Coord[] => {
  const out: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    const r = f + k;
    if (r < 1 || r > 8) continue;
    if (gaps.includes(f)) continue;
    out.push(X(f, r));
  }
  return out;
};
/** The mirrored cliff: rank = s - file (s=10 is h2..b8, plateau top-right). */
const MIRROR = (s: number, ...gaps: number[]): Coord[] => {
  const out: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    const r = s - f;
    if (r < 1 || r > 8) continue;
    if (gaps.includes(f)) continue;
    out.push(X(f, r));
  }
  return out;
};
const RUN_REVENGE_19: RunDef = {
  id: 'revenge-19',
  name: 'The Cliff',
  blurb: 'He built his court on the cliff. Knights climb.',
  allowedAbilities: ['convert', 'summon-knight', 'aegis', 'magnet'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_FINISHERS,
  offerCoreMin: 2,
  levels: [
    // L1 — THE GOAT PATH. Still king c8 behind his guard (b7/d7); the cliff
    // has a gap on the e-file. Slide e1-e8 in one move (the d7 pawn watches
    // e6 but you never stop there), then along rank 8. Teaches the shape.
    make(1, [pawn(2, 7), pawn(4, 7), king(3, 8)], {
      ...STILL,
      moveLimit: 6,
      hazards: CLIFF(1, 5),
    }),
    // L2 — THE LEDGE. The mirror cliff, path on the d-file, first FLEEING
    // king: f8 in a rank-8 pen (e8/f8/g8) behind his guard. A rook standing
    // on rank 8 attacks every square he could step to — he stays, you take
    // him. Knight b4 covers d3/d5 but you slide through them.
    make(
      2,
      [pawn(5, 7), pawn(6, 7), pawn(7, 7), knight(2, 4), king(6, 8)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: MIRROR(10, 4),
        kingPen: ['e8', 'f8', 'g8'],
      },
    ),
    // L3 — THE CLIMB. Sealed cliff. Still king on d7, one knight jump above
    // the lowland (e5 or f6 -> d7). No line ever reaches him: KEY =
    // summon-knight, alone. Knight g3 watches e4/f5, so the launch square
    // is d4 (spawn e5) or g5 (spawn f6).
    make(3, [pawn(3, 8), pawn(5, 8), knight(7, 3), king(4, 7)], {
      ...STILL,
      moveLimit: 9,
      hazards: CLIFF(1),
    }),
    // L4 — THE STEP. Path on e. Fleeing king b8 in a DIAGONAL pen (b8/a7)
    // with a8 and b7 stoned: a rook can attack b8 (rank 8) but never a7
    // (the a-file and rank 7 both meet stone), so he steps down and sits
    // there forever. His guard on b6 stands on stone (b5), cannot advance
    // (b7 stone), and its ally cover is exactly a7: flip it FIRST, then
    // e1-e8 and he has nowhere to step. KEY = convert. b5/c6 are stone so
    // no knight ever covers a7 for the rook.
    make(4, [pawn(2, 6), knight(7, 4), king(2, 8)], {
      ...FLEE,
      moveLimit: 6,
      hazards: [...CLIFF(1, 5), X(1, 8), X(2, 7), X(3, 6), X(2, 5)],
      kingPen: ['a7', 'b8'],
    }),
    // L5 — THE TOLL. Path on e, plugged by a pawn on e6 standing on stone
    // (e5): it can only be taken along rank 6 from f6, and the guard on d7
    // (on stone d6) takes back. Behind the guard a bishop on c8 is boxed in
    // (b7 stone, d7 his own pawn) — it never moves, and the moment d7
    // recaptures, its diagonal opens and it defends e6 in turn, so BAITING
    // the recapture with a Squire only feeds two bodies to the toll. Take
    // the plug, eat the reply, e6-e8, take the bishop (stun), take him.
    // KEY = aegis. Magnet can pull the plug out to f6 but you still have to
    // stand on e6 afterwards. Convert on d7 opens the bishop's diagonal and
    // promotes your own pawn onto his rank.
    make(
      5,
      [pawn(5, 6), pawn(4, 7), bishop(3, 8), knight(8, 4), king(2, 8)],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: [...CLIFF(1, 5), X(5, 5), X(4, 6), X(2, 7)],
        kingPen: ['a8', 'b8'],
      },
    ),
    // L6 — THE HOOK. Path on e, plugged by a pawn on e6 between two stones
    // (e5 beneath, e7 above). The gap square is watched TWICE by pieces that
    // never move: the guard on d7 (standing on d6, which stands on the
    // cliff) and a knight on d8 boxed in by b7/c6 stone, the cliff and its
    // own pawn. Two enemies act a turn, so a shield eats one bite and the
    // other kills; baiting the recapture with a Squire only swaps which
    // piece plugs the hole; a converted plug is stuck under e7 and, if it
    // takes d7, becomes the plug on the d-file instead. Never stand on e6:
    // from g6 PULL the plug to f6, take it, then slide THROUGH e6 onto d6
    // with a capture, and walk the d-file up through d7 and the knight
    // (three stuns) to his rank. KEY = magnet. The crown pawn on e8 covers
    // d7 so no Squire capture-stuns his way onto b8.
    make(
      6,
      [pawn(5, 6), pawn(4, 6), pawn(4, 7), knight(4, 8), pawn(5, 8), knight(2, 4), king(2, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 8,
        hazards: [...CLIFF(1, 5), X(5, 5), X(5, 7), X(2, 7), X(3, 6)],
        kingPen: ['a8', 'b8'],
      },
    ),
    // L7 — THE CORNER COURT. Sealed cliff, king b8 in the corner pen with
    // his guard on a7/b7 and the crown on d8, every one of them standing on
    // stone (a6/b6/d7) so none can ever march. The only post on b8 is c6,
    // and b7 watches it. Flip b7: a8 is his no longer and c6 is open.
    // Squire from d4 or e5 onto c6, and take him. Knight f3 watches both
    // spawn squares (not the launch squares d3/e3/e4/f4).
    make(
      7,
      [pawn(1, 7), pawn(2, 7), pawn(4, 8), knight(6, 3), king(2, 8)],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: [...CLIFF(1), X(1, 6), X(2, 6), X(4, 7)],
        kingPen: ['a8', 'b8'],
      },
    ),
    // L8 — THE FAR CORNER. Mirrored: king g8, pen g8/h8, guard g7/h7 on
    // stone (g6/h6), crown e8 on stone (e7). The only post is f6, watched
    // by g7. Flip g7, Squire from d5 or e4 onto f6, take him. A dark bishop
    // and a knight hunt the lowland.
    make(
      8,
      [pawn(7, 7), pawn(8, 7), pawn(5, 8), bishop(3, 1), knight(6, 2), king(7, 8)],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: [...MIRROR(10), X(7, 6), X(8, 6), X(5, 7)],
        kingPen: ['g8', 'h8'],
      },
    ),
    // L9 — THE TERRACE. The cliff climbs one rank higher (a3-f8) and his
    // room is the DIAGONAL corner pair a8/b7 — a rook could never attack
    // either. His guard on a6 stands between two stones (a5 beneath, a7
    // above, so it can neither march nor, once flipped, walk off its post)
    // and its ally cover is b7. The posts on a8 are b6 and c7, both one
    // jump from the lowland (d5 -> b6, d5/e6 -> c7): alone, a knight there
    // just sends him to b7, where no knight can ever reach him (a5/c5/d6
    // stone, d8 two jumps off). Flip a6, Squire d5 -> b6, take him. Two
    // enemies a turn.
    make(
      9,
      [pawn(1, 6), knight(7, 3), bishop(8, 1), king(1, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 8,
        hazards: [...CLIFF(2), X(1, 5), X(1, 7)],
        kingPen: ['a8', 'b7'],
      },
    ),
    // L10 — THE HIGH CORNER. Mirror of L9 on the high terrace (h3-c8): king
    // h8, room h8/g7, guard h6 between stones (h5/h7). Posts on h8 are g6
    // (e5 -> g6) and f7 (d6/e5 -> f7). A queen and a knight in the lowland,
    // two enemies a turn, eight moves: flip h6, Squire e5 -> g6, take him.
    make(
      10,
      [pawn(8, 6), queen(2, 2), knight(2, 4), king(8, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 8,
        hazards: [...MIRROR(11), X(8, 5), X(8, 7)],
        kingPen: ['g7', 'h8'],
      },
    ),
  ],
};

export default RUN_REVENGE_19;
export { RUN_REVENGE_19 };
