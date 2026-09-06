/**
 * revenge-19 — THE CLIFF. Built 2026-09-05 for the signature pair
 * CONVERT + SUMMON-KNIGHT (the Squire); redesigned 2026-09-06 for the
 * controllable Convert.
 *
 * ===== 2026-09-06 REDESIGN FOR CONTROLLABLE CONVERT =====
 * Convert changed twice on 2026-09-06 (commits 3b0961b, 2c4e5a2): a stolen
 * piece is now a CONTROLLED SUMMON — tap it to move it (that is the one
 * body-move of the turn), it moves as its type (a pawn walks toward rank 8
 * and captures diagonally forward), it MAY take the king, and it is DAZED
 * for the turn it is stolen (no move / capture until your next turn; its
 * cover still cuts the king's flight). Under that rule the v1 finale broke:
 * the guard on a7 (L8: h7) stood diagonally UNDER the king's square, so
 * once stolen it attacked him, the daze only delayed the strike a turn, and
 * he could not step off — Convert alone read 100% on L3, L7 and L8.
 *
 * TWO ENGINE FACTS THAT SHAPE EVERY LEVEL BELOW (read from the L3 trace and
 * lib/run/abilities.ts, not from the card text):
 *   (P) A stolen pawn PROMOTES to a controlled QUEEN on rank 8 (the trace:
 *       `pe7 -> qe8`, then Qxd7). So every stealable pawn must have stone,
 *       the king, or another piece ahead of it, and no enemy may stand on a
 *       rank-8 square diagonally in front of it (a pawn capture promotes
 *       too). This is what actually solo'd L3: the crown pawns marched down,
 *       got stolen, walked back up, and queened.
 *   (M) Enemy pawns MARCH (toward rank 1) whenever no hunter has a closer
 *       move — and with two enemies a turn the second action is nearly
 *       always a pawn push. Every pawn that is part of a lock stands on
 *       stone (or on the pen, which pawns never advance into).
 *
 * THREE MORE FACTS, learned building this (each one killed a draft):
 *   (S) ANY same-turn capture-stun replaces the daze. A guard standing
 *       diagonally UNDER the king is a one-turn kill for Convert plus any
 *       stun — Rookie taking a knight, the Squire eating a queen that
 *       walked up to her. Hunters always walk into the Squire's reach, so a
 *       finale can never have a stealable pawn attacking his square.
 *   (H) The T5 bot finds two body-moves after the free actions (steal +
 *       summon are free). Walk-then-strike lines (steal, walk, Squire,
 *       kill) read 13-19% however good the geometry; "self-plug" lines
 *       (walk twice into a recapture) read 0%. Every finale line below is
 *       one Squire jump plus one strike.
 *   (Q) A queen is the only hunter a rook can never take (she attacks back
 *       along every line she is attacked on, and captures first). Knights
 *       and bishops are free capture-stuns — fine where the Squire has to
 *       strike anyway, fatal where a stun alone would finish (fact S).
 *
 * THE FOUR FINALE DECISIONS (rubric "One line, four times"): the same pair,
 * a different Convert target and a different Squire job on every level.
 *   L7  STEAL THE CAGE. The guard b7 stands BESIDE the king on b8: stolen,
 *       its cover is a8 — his only flight — and it can never attack b8
 *       itself. It also watched the post c6; steal it and the Squire lands
 *       there and takes him. Convert = the cage, Squire = the blade.
 *   L8  STEAL THE DECOY. The only reachable post (e7) holds a boxed bishop
 *       whose recapturer is a frozen knight on c8 — nothing Convert can
 *       steal. Its one jump is onto its own pawn on b6, on the far side of
 *       the board. Steal that pawn and the knight must eat it, leaving e7
 *       unguarded: Squire x e7 is a stun with g8 under attack. Convert's
 *       target has nothing to do with the king; it pulls the guard off.
 *   L9  STEAL THE ANSWER, NOT THE CAGE. Three stealable pawns around a8/b7:
 *       a6 (its cover is b7 — the L7 lesson, and here a TRAP), a7 (the
 *       recapturer of the post b6, where a boxed bishop stands) and the
 *       crown c8 (inert). Steal a6 and the Squire's capture on b6 is
 *       answered by a7; steal a7 and Squire x b6 is a stun with a8 under
 *       attack — a stunned king is a dead king.
 *   L10 STEAL THE BAIT. The post b6 holds a pawn; its recapturer is a
 *       knight on d7 boxed by stone on every other jump, so the L9 answer
 *       is gone. Steal the post pawn: it is dazed where it stands, the
 *       knight eats it and now STANDS on the post, undefended. Squire x b6
 *       that very turn (a turn later the knight jumps away) is the stun
 *       and the threat. The stolen piece is the key that opens the pen by
 *       being taken.
 *   Convert's target moves from the pawn beside him (L7) to a pawn far
 *   from him (L8) to the pawn that would answer the Squire (L9) to the
 *   pawn the Squire would otherwise take itself (L10); the Squire's job
 *   moves from an empty post to three different captures.
 *
 * L3 FIX: the crown pawns c8/e8 stand on stone (c7/e7) so they never march;
 * a stolen rank-8 pawn is inert (no forward square, nothing to capture), so
 * the level stays the Squire's teaching level.
 * ================================================================
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
 * THE MECHANISM.
 *   - The Squire is a body that jumps terrain and may take the king, but
 *     the king FEARS him (kingFleeMove -> controlledThreatensSquare): a
 *     knight threat on a two-square pen is always answered by a step, so
 *     alone he chases forever. He wins only when the second pen square is
 *     denied — ally-covered, ally-occupied, enemy-occupied — or when he
 *     lands with a capture (stun) and nobody recaptures.
 *   - Convert is a FREE action with UNLIMITED range that turns one pawn (T1)
 *     into a controlled body inside his court. Its cover (the two squares
 *     diagonally above it) is a square the king refuses to step onto; after
 *     the daze it walks, captures diagonally forward, and can take him.
 *   - Rules honoured: Convert clears status (no poison in the kit), one body
 *     moves per turn below T5, Convert T1 flips PAWNS only (every target in
 *     the run is a pawn), and the daze means a stolen pawn never strikes
 *     the turn it is taken.
 *
 * WHY A LONE KNIGHT NEVER WINS THE FINALE. Write d = rank - file. The cliff
 * is d = k, the lowland d < k, and a knight jump changes d by +-1 or +-3.
 *   1. The pen is never spawn-adjacent to a post (a Squire appears next to
 *      Rookie and moves the same turn). Pens are a8/b8 (k=1), g8/h8
 *      (mirror), a8/b7 (k=2 terrace).
 *   2. Every post is stone, watched, occupied-and-defended, or leaves him a
 *      flight square. No CAPTURABLE piece stands on an undefended post (a
 *      knight capture stuns him, and a stunned king under attack is dead).
 *   3. The stolen pawn can never queen: stone, the king, or a guard ahead
 *      of it, and no enemy on a rank-8 diagonal in front of it.
 *
 * KIT = convert / summon-knight / aegis / magnet (`allowedAbilities` IS the
 * kit). No universal solvents. Aegis does not cross stone, a Magnet pull
 * line stops at it; both are traps on L7-L10 and keys on L5 / L6.
 *
 * KEY / TRAP per level (T5 bot, T1 cards, Normal):
 *   L1  none needed — goat path at e, slide to the top, along rank 8.
 *   L2  none needed — mirrored path at d; a rook on rank 8 kills a rank-8 pen.
 *   L3  summon-knight KEY, alone: sealed cliff, STILL king on d7 one jump
 *       above the lowland (e5/f6 -> d7). Crown pawns on stone (see L3 FIX).
 *   L4  convert KEY (and the Squire, two-key, unchanged from v1): fleeing
 *       king in a diagonal pen (b8/a7); flip the b6 guard so its cover takes
 *       a7 away, then e1-e8.
 *   L5  aegis KEY (intended): plug on e6 the d7 guard takes back, boxed
 *       bishop c8 behind it. Unchanged.
 *   L6  magnet KEY (intended): pull the plug out, slide through with a
 *       capture, walk the d-file up. Unchanged.
 *   L7  PAIR: steal b7 (cage a8), Squire d4/e5 -> c6, x b8. 7 moves.
 *   L8  PAIR: steal b6 (the knight c8 eats it), Squire c6/d5 x e7 (stun),
 *       x g8. A queen hunts. 7 moves.
 *   L9  PAIR: steal a7 (the recapturer), Squire c4/d5 x b6 (stun), x a8.
 *       Knight + queen hunt, two enemies a turn. 7 moves.
 *   L10 PAIR: steal b6 (the knight d7 eats it), Squire c4/d5 x b6 (stun),
 *       x a8. A queen hunts. 8 moves.
 *
 * MEASURED — see the dated block at the bottom of this header.
 *
 * MEASURED 2026-09-06 (Normal, T5 bot, T1 cards; L7-L10 = 32 trials/cell
 * --jobs=1 SERIAL, L1-L6 = 16 trials/cell --jobs=1; five other agents'
 * sims shared the machine, so parallel cells were used for direction only):
 *          none convert squire aegis magnet  convert+squire
 *   L1-L2  100%   100%   100%   100%   100%       100%
 *   L3       0%     0%   100%     0%     0%       100%
 *   L4       0%   100%   100%     0%     0%       100%
 *   L5       0%     0%    25%     0%     0%       100%
 *   L6       0%     0%    19%     0%     0%        88%
 *   L7       0%     0%     0%     0%     0%        72%
 *   L8       0%     0%     0%     0%     0%        66%
 *   L9       0%     0%     0%     0%     0%        66%
 *   L10      0%     0%     0%     0%     0%        75%
 * The finale meets the combo gate at the 60-80% target: no single card in
 * the kit clears L7-L10 (0% on all sixteen cells), the pair reads 66-75%.
 * L9's pair cell wandered 38-66% across five serial reads while the clock
 * was tuned (5 -> 7 moves); 66% is the read at the shipped clock. L3 is
 * back to Squire-only (convert alone 100% -> 0%). L4 stays two-key (v1).
 * Convert alone on L5 fell 94% -> 0%: the stolen d7 pawn used to walk off
 * and queen; the daze and the clock now stop that line.
 * FULL RUNS (40 each, Normal, T5, never skipping an offer): 6/40 = 15% with
 * random picks, 16/40 = 40% with pool=convert,summon-knight. Random picks
 * die at L3 (Squire or nothing, 63%) and L5-L6 (the bot rarely plays the
 * aegis / magnet keys); the finale clears 78-100% per level in run context
 * because a player who reaches it holds the pair. With the pair as the
 * whole pool the finale reads 79-94% per level.
 *
 * DEAD ENDS, so nobody rebuilds them:
 *   (a) A runner column to pin the court PROMOTES on rank 1 (`ph2 -> qh1`)
 *       — a queen factory, not a clock; stone under the guard is the fix.
 *   (b) Hunters that start on Rookie's rank-1 lines are free captures.
 *   (c) A plug in the gap is never a Magnet-only puzzle when a pawn defends
 *       it. (d) A two-jump Squire line is beyond the T5 bot's horizon.
 *   (e) 2026-09-06: a guard diagonally UNDER the king's square is a
 *       next-turn kill for Convert plus ANY stun (v1 L7/L8 a7/h7; the
 *       "chase him into the corner" draft of L8 read 100% because the
 *       Squire ate the queen that walked up, and a "cover a8 the same
 *       turn" draft of L10 read 75% for Convert ALONE because Rookie took
 *       the knight). Guards go BESIDE him (cover = the flight) or below
 *       the pen with stone ahead.
 *   (f) 2026-09-06: a stolen pawn QUEENS on rank 8, including by capture.
 *       Any pawn defending a post from rank 8 (b8/d8 over c7) is a promotion
 *       target for a stolen post pawn; the recapturer must stand on rank 7
 *       (a7 over b6) with the king or stone above it. A crown pawn on an
 *       open file with no hunter nearby marches down, gets stolen, walks
 *       back and queens (v1 L3).
 *   (g) 2026-09-06: a piece parked IN the pen to watch the posts (a rook on
 *       b7) walks out toward Rookie the moment a square is strictly closer;
 *       only pawns on stone, and knights whose every jump is stone or their
 *       own man, hold a post. The L8 knight read 56% for the Squire alone
 *       until a7 was stoned — it had been jumping there.
 *   (h) 2026-09-06: walk lines are unfindable. "Steal g6, walk g7 (cover
 *       h8), Squire e7" read 13-19% for the pair on a calm board and on a
 *       thick one (6+ pieces, cast bump on); "steal b5, walk b6, b7 into
 *       c8's recapture so his own pawn plugs b7, Squire b6" read 0% — the
 *       bot never stole. The rollout policy scores Rookie's distance to the
 *       king; an ally's quiet move is worth nothing to it.
 *   (i) 2026-09-06: a pawn on a post is ALWAYS bait — its recapturer eats
 *       it where it stands and can be taken there. So "steal the
 *       recapturer" (L9) and "steal the post pawn" can never gate the same
 *       level; L9 puts a bishop on the post, L10 makes the recapturer a
 *       knight. Any other combination has two answers.
 *   (j) 2026-09-06: two queens with two enemies a turn make the T5 bot
 *       stop casting (L10 pair 19% -> 0% while it dodged); one queen is
 *       the pressure that still lets it think.
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
    // is d4 (spawn e5) or g5 (spawn f6). The crown pawns c8/e8 stand on
    // stone (c7/e7): they never march down to be stolen and walked back
    // up to queen (fact P) — a stolen rank-8 pawn is inert.
    make(3, [pawn(3, 8), pawn(5, 8), knight(7, 3), king(4, 7)], {
      ...STILL,
      moveLimit: 9,
      hazards: [...CLIFF(1), X(3, 7), X(5, 7)],
    }),
    // L4 — THE STEP. Path on e. Fleeing king b8 in a DIAGONAL pen (b8/a7)
    // with a8 and b7 stoned: a rook can attack b8 (rank 8) but never a7
    // (the a-file and rank 7 both meet stone), so he steps down and sits
    // there forever. His guard on b6 stands on stone (b5), cannot advance
    // (b7 stone), and its ally cover is exactly a7: flip it FIRST, then
    // e1-e8 and he has nowhere to step. KEY = convert (the Squire also
    // reads it — a two-key level, accepted in v1).
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
    // KEY = aegis.
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
    // own pawn. Two enemies act a turn. Never stand on e6: from g6 PULL the
    // plug to f6, take it, then slide THROUGH e6 onto d6 with a capture, and
    // walk the d-file up through d7 and the knight (three stuns) to his
    // rank. KEY = magnet.
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
    // L7 — THE CORNER COURT (steal-then-cage). Sealed cliff, king b8 in the
    // corner pen a8/b8. His guard on b7 stands BESIDE him on stone (b6):
    // it can never march, and stolen it can never attack b8 — its cover is
    // a8 (his flight) and c8. The crown on d8 stands on stone (d7), a
    // decoy steal that does nothing. Posts on b8: a6 and d7 are stone, c6
    // is watched by b7; posts on a8 (b6, c7) are stone. Steal b7: a8 is
    // his no longer and c6 is unwatched. Squire from d4 or e5 onto c6,
    // and take him. Knight f3 watches both spawn squares.
    make(
      7,
      [pawn(2, 7), pawn(4, 8), knight(6, 3), king(2, 8)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [...CLIFF(1), X(1, 6), X(2, 6), X(3, 7), X(4, 7)],
        kingPen: ['a8', 'b8'],
      },
    ),
    // L8 — THE FAR CORNER (the decoy). Mirrored: king g8, pen g8/h8. The
    // only post the Squire can reach is e7 (c6/d5 -> e7; f6 and h6 are
    // stone), and a BISHOP stands on it, boxed by stone (d6/f6/f8) — take
    // it and he is stunned with g8 under attack, but a knight on c8
    // recaptures. That knight is unstealable and frozen: a7/d6 are stone,
    // e7 is its bishop, b6 is its own pawn. Steal the b6 pawn — a piece on
    // the far side of the board with nothing to do with the king — and the
    // knight's only jump is to eat it; from b6 it no longer guards e7.
    // Squire x e7, take him. Nothing cages here and nothing walks: Convert's
    // job is to pull the guard off its post. A queen hunts the lowland.
    make(
      8,
      [bishop(5, 7), knight(3, 8), pawn(2, 6), queen(1, 4), king(7, 8)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: [...MIRROR(10), X(1, 7), X(2, 5), X(6, 6), X(6, 8), X(8, 6)],
        kingPen: ['g8', 'h8'],
      },
    ),
    // L9 — THE TERRACE (the wrong steal loses). The cliff climbs one rank
    // higher (a3-f8) and his room is the DIAGONAL corner pair a8/b7. Three
    // pawns: a6 between two stones (a5 beneath, a7 is a pawn) — its cover
    // is b7, the cage; a7 under the king, pinned by a6, which RECAPTURES on
    // b6; and a pawn ON the post b6 (stone b5 beneath it). c7 is stone (no
    // second post), c6 is stone (a7 and c8 are not knight snacks: the only
    // jumps onto them start from c6 and from each other), b8 is stone (no
    // queening square), and the crown pawn c8 stands on stone c7 watching
    // b7. Trap 1: steal a6 (cage), Squire
    // b6 — a7 x b6. Trap 2: steal b6, walk b7 — c8 x b7. Key: steal a7,
    // Squire x b6 (stun, a8 attacked), take him. Two enemies a turn.
    make(
      9,
      [pawn(1, 6), pawn(1, 7), bishop(2, 6), pawn(3, 8), knight(7, 3), queen(8, 6), king(1, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 7,
        hazards: [...CLIFF(2), X(1, 5), X(2, 5), X(3, 6), X(3, 7), X(2, 8)],
        kingPen: ['a8', 'b7'],
      },
    ),
    // L10 — THE HIGH CORNER (the stolen pawn strips the recapturer). Same
    // terrace, same room a8/b7. The post b6 holds a pawn, and its
    // recapturer is a KNIGHT on d7 — nothing Convert can steal — boxed by
    // stone on every other jump (b8/c5/e5/f6/f8). The crown pawn c8 (stone
    // c7) watches b7, so the post pawn walking to b7 is eaten and plugs
    // nothing useful (the knight still guards b6). Nothing covers b7. The
    // key is the pawn on e6, standing on stone (e5) with the knight on its
    // diagonal: stolen, it takes d7 (a capture-stun), the post is
    // undefended, Squire c4/d5 x b6 is a second stun with a8 under attack,
    // and he never gets a turn to step. Convert's target is the piece that
    // can reach the recapturer, not the recapturer. Two queens hunt the
    // lowland, two enemies a turn.
    make(
      10,
      [pawn(2, 6), knight(4, 7), pawn(3, 8), queen(5, 8), king(1, 8)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 8,
        hazards: [...CLIFF(2), X(1, 7), X(2, 5), X(2, 8), X(3, 7), X(5, 5), X(6, 6)],
        kingPen: ['a8', 'b7'],
      },
    ),
  ],
};

export default RUN_REVENGE_19;
export { RUN_REVENGE_19 };
