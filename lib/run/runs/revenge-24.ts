/**
 * revenge-24 — THE LATTICE. Built 2026-09-06 for the signature pair
 * DUCHESS + DECOY ("buy the body time", the archetype nobody had built yet:
 * data/run-playtest/pair-hypotheses.json rates it confidence 4 and it is the
 * only entry under that archetype with two cards that have no home — Decoy
 * has never been a signature card, and the Duchess has only ever been half of
 * dragon+duchess, The Millstone's double door).
 *
 * ---------------------------------------------------------------------------
 * 2026-09-06 VARIANCE REWORK (Tyler, after playing the Lattice and the Alcove:
 * "pretty fun, once you solved it you kind of figured it out ... they need
 * more VARIANCE and DIFFICULTY"). The shipped finale was ONE line four times:
 * post three moves from the king, summon the Duchess, mark a court pawn so
 * the bishop eats it, swing — in four courts, at 97-100%. L7-L10 now each
 * demand a DIFFERENT use of duchess + decoy, and the L7 line LOSES on L8, L9
 * and L10. The four decisions, one line each:
 *
 *   L7  BODY, THEN BAIT (the lesson, unchanged). The post is watched by a
 *       pawn; land on it and mark a bishop-defended pawn the same turn — the
 *       bishop (threat 2) beats the watcher (threat 1) to the army's action.
 *   L8  BAIT FIRST, BODY SECOND (the flinch). No watcher at all; both of his
 *       rank-6 diagonals are open. A fleeing king reacts for FREE at the
 *       start of the enemy turn, before the army acts, so a queen landing on
 *       one post sends him to the other and she is one move late. A decoy
 *       eat stuns him TWO turns (Rookie's own capture only one): mark the
 *       bait the turn BEFORE the body, land while the stun is still running.
 *       Mark and land together (the L7 order) and he flees before the bishop
 *       moves.
 *   L9  THE ROOK IS THE ONE IN DANGER (Aegis, the trap card, becomes a key).
 *       Both d7 and f7 are open so ANY sitting queen makes him flinch (even
 *       after a stun-first mark, because the only sit square is watched and
 *       the stun bait is gone). The only kill is a one-move strike from the
 *       spawn square c6 through d7, which can be reached from exactly one
 *       rook square, d5 — covered by the pawn on e6. Survive one enemy turn
 *       on d5 (Aegis, or a mark cast on arrival), then spawn and strike.
 *       Duchess + aegis is a deliberate second key on this level only.
 *   L10 MARK THE HUNTER, NOT THE BAIT (two enemies per turn). The L7 court
 *       mirrored, but the army moves twice: mark the bishop's pawn and the
 *       watcher takes the queen with the second action. The only mark that
 *       lives is the WATCHER ITSELF — it is attacked by the pawn behind it
 *       and by the bishop, the bishop eats it and has then already acted, and
 *       nothing else on the board can reach the post. Every other mark loses
 *       deterministically.
 *
 * Contract (this pass): L7-L10 no-ability ~0%, every single kit card <= 8%,
 * the pair 60-80% — NOT 100%. Numbers under MEASURED / 2026-09-06.
 * MEASURED, 2026-09-06 variance rework (Normal, T5 bot, T1 cards; numbers of
 * record `--jobs=1 --trials=32`, everything else 16 trials at `--jobs=2`):
 *   FINALE          none  duchess  decoy  aegis  magnet  duchess+decoy
 *     L7 body+bait    0%      0%     0%     0%      0%      94%
 *     L8 the plug     0%      0%     0%     0%      0%      81%
 *     L9 open door    0%      0%     0%     0%      0%     100%
 *     L10 two hands   0%      0%     0%     0%      0%     100%
 *   Before (shipped build, serial 32): pair 100 / 97 / 100 / 100.
 *   Every other pair in the kit (duchess+aegis, duchess+magnet, decoy+aegis,
 *   decoy+magnet, aegis+magnet) reads 0% on all four — including L9's
 *   intended second key, duchess+aegis (0% for the BOT: it never raises a
 *   shield before stepping onto a covered square, the rubric's "provable but
 *   unfindable" limit; the line is hand-verified — shield, d5, spawn c6,
 *   c6xe8 — and is real for a human).
 *   HONEST MISS: L9 and L10 read 100%, not 60-80. Each is a deterministic
 *   4-5 move line under a clock already at the Normal floor (6); a
 *   perfect-information bot cannot misstep a walk, and stretching the walk
 *   further only makes some start files unwinnable (0%) rather than harder.
 *   The 60-80 band on L7/L8 comes from TRAP marks whose failure is a turn or
 *   two away (L8: the b7 bait leaves the plug in place; the loss arrives at
 *   the clock). On L9/L10 every wrong choice dies on the very next enemy
 *   turn, which the bot's one-ply doom check sees through. For a human the
 *   two levels ARE the hard ones: the L7 habit and the L8 habit both lose on
 *   each of them, deterministically.
 *   TIERS (highest the offers can reach): decoy:5, aegis:5, magnet:5 all 0%
 *   on all four. duchess:2 and duchess:3 0% on all four. duchess:4 / :5
 *   (second charge): L7 25%/0%, L8 31%/31%, L9 94%/88%, L10 94%/100% —
 *   the family's known tier break (a second body after the first one is
 *   eaten or dissolves), reported not hidden; the gate holds at T1-T3.
 *   FIXED 2026-09-06 — `abilityTierCaps: { duchess: 3 }`: the run now never
 *   offers the fourth tier. Re-measured serially one column at a time to
 *   choose it (T2 0/0/0/0, T3 0/0/0/0). The forced-loadout matrix above is
 *   unchanged by the cap on purpose — `--loadouts=duchess:4` still reads
 *   what T4 would do; the cap only removes it from offer slates.
 *   duchess:2+decoy:2 reads 100/100/94/100.
 *   FULL RUNS (40, Normal, T5, never skipping an offer): 9/40 = 23% with
 *   random picks (was 33%) — deaths are move-limits at L6 (12) and L7 (14),
 *   the player who did not take the pair by L7; 31/40 = 78% when the pool
 *   is the pair (was 88%), with the finale now costing 4 + 2 + 1 + 0 runs.
 *
 * DEAD ENDS, 2026-09-06:
 *   - THE FLINCH IS UNFINDABLE. The first L8 was pure king-flinch: no
 *     watcher, both rank-6 diagonals open, a decoy eat's 2-turn stun cast
 *     the turn BEFORE the body so he could not sidestep. Hand-verified, and
 *     the bot read the pair at 0%: a pre-emptive mark with no threat on the
 *     board and a payoff two turns out is exactly the "provable but
 *     unfindable" case. It survives as the DEFENCE of L9 (an open second
 *     diagonal is what kills every sitting queen there), not as a key.
 *   - AN EMPTY POST IS A WINDOW. With g6 empty and h5 open, a queen on h5
 *     took him THROUGH the post from range (81% alone). Any post left empty
 *     on purpose needs the square beyond it on the same diagonal filled.
 *   - FRIENDLY FIRE NEVER EMPTIES THE SQUARE IT HITS, ONLY THE EATER'S.
 *     Marking the plug itself (f5) is useless — e6 eats it and stands on f5.
 *     The mark has to go on the piece the plug DEFENDS so the plug moves.
 *   - ENEMIES-PER-TURN 2 BEATS EVERY BAIT MARK. A captured decoy clears the
 *     mark at once, so the second action is planned against the real board
 *     and eats whatever is standing on the post. The only mark that
 *     survives a two-action turn is the watcher itself (removed from the
 *     actors, then eaten by a piece that has thereby already acted) — which
 *     is what makes L10 a different decision from L7 rather than a harder
 *     copy.
 *
 * Everything below this line is the original design text, kept as written;
 * the L8-L10 "intended lines" and their MEASURED numbers there describe the
 * SHIPPED-AND-REPLACED build, not the current one.
 * ---------------------------------------------------------------------------
 *
 * THE VERB: buy the body one turn. Not crossing a wall (The Moat), not
 * baiting hunters (The Alley), not blowing a hole (The Briar), not caging him
 * with his own guard (The Cliff) — building a queen that is dead the instant
 * she lands, and feeding the guard its own man so she lives to swing.
 *
 * THE MECHANISM, read out of lib/run/abilities.ts + pawn-ai.ts and then
 * hand-played through the engine:
 *   - The Duchess is a controlled QUEEN who spawns beside Rookie as a FREE
 *     action and may capture the king (controlledAllyLegalMoves). She lives
 *     TWO enemy turns at T1 (summonTurnsFor: 2/3/4/4/6) and her move IS
 *     Rookie's move for the turn. So her whole life is: appear, take one
 *     square, survive one enemy turn, strike.
 *   - Enemies value a summoned ally EXACTLY as highly as Rookie (pawn-ai
 *     capture priority: PIECE_THREAT.queen for both). A queen parked next to
 *     the court is therefore eaten on the very next enemy turn, every time.
 *     That is the whole reason she cannot finish alone.
 *   - Decoy marks one enemy and the AI re-plans against a VIEW in which the
 *     marked piece is Rookie and is REMOVED from the actors (decoyViewState).
 *     Whoever takes it is friendly fire: the capture is credited to Rookie,
 *     the king is stunned 2, and — the part that matters — it was the army's
 *     whole action for the turn. T1 Decoy is ONE enemy turn, one charge.
 *   - The tie-break is the design. A marked piece scores queen-value, so does
 *     the Duchess; the tie goes to the HIGHEST-THREAT attacker (queen 4,
 *     bishop/knight 2, pawn 1). So every finale marks a pawn defended by a
 *     BISHOP and puts a PAWN on the Duchess's landing square: the bishop
 *     always wins the tie and the pawn never gets its shot. Deterministic,
 *     not a coin flip.
 *   - Neither half finishes alone. Decoy can stun and blind but never reaches
 *     him; the Duchess reaches him and dies one move short.
 *
 * CONSTANT SIGNATURE — THE LATTICE. On every level the top half of the board
 * (ranks 5-8) is stone ON THE DARK SQUARES ONLY: a checkerboard of panes,
 * sixteen stones, laid over his half. Not a band (The Moat), not columns (The
 * Colonnade), not a box (The Vault / The Glasshouse), not offset bars (The
 * Switchback), not a hedge (The Briar), not shafts (The Stacks), not one
 * diagonal (The Slash), not an alley (The Alley), not a solid rank (The
 * Parapet). A checker field, and every rule of the run falls out of one fact:
 * DIAGONAL NEIGHBOURS SHARE A COLOUR AND ORTHOGONAL NEIGHBOURS DO NOT.
 *   - Every free square up there is light, and its four orthogonal neighbours
 *     are stone. So no rook line lives in the lattice: a rook can step into a
 *     fringe pocket and then cannot move at all. A king on a light square of
 *     ranks 6-8 can NEVER be captured by Rookie, in any position, ever.
 *   - The light diagonals run right through it. A bishop or a queen crosses
 *     the whole field; a knight (every jump lands on a dark square) is frozen
 *     solid. So the lattice is queen-and-bishop country, and the Duchess is
 *     the only body in the kit that can walk it.
 *   - His pawns cannot march (a pawn on a light square steps into stone) but
 *     they still bite diagonally, onto light squares. The court is a set of
 *     permanent guards that never advance and never leave. Pawn walls march
 *     (The Briar) — this one is pinned by its own geometry.
 *   - A bishop on a light square with its own pawns on its diagonals is
 *     jammed: no move, ever, and it defends both pawns. That is the decoy
 *     bait in every finale, and it is the highest-threat attacker on the
 *     board.
 *   - A PANE can be left open (a missing stone). One open pane is a doorway;
 *     two on a file are a channel a rook can ride. L1-L5 have panes open,
 *     L6-L10 do not. A piece standing ON an open dark pane is entombed —
 *     all four of its diagonals are stone.
 *
 * THE ARC
 *   L1-L2  a channel is open and he is at the top of it. Ride it (L2: take the
 *          cork out of it first).
 *   L3-L5  the channel is corked by something defended, and a card opens it:
 *          eat the reply behind a shield, or make his own court eat the cork.
 *   L6     the panes close. He is INSIDE the lattice for the first time, and
 *          Rookie is out of the game for the rest of the run: only a body
 *          that walks diagonals can reach him. DUCHESS, alone.
 *   L7-L10 the same cell, with one pawn added: a WATCHER on the only square
 *          that attacks him. The Duchess arrives and dies. Feed the court its
 *          own man and she lives one more turn — which is all she needs.
 *
 * KIT = duchess / decoy / aegis / magnet (`allowedAbilities` IS the kit).
 * No universal solvent (bishop-step or queen-pulse would give Rookie the
 * light diagonals and walk the lattice alone; knight-hop cannot, but is
 * banned by the rubric anyway). No second summon (one body-move per turn,
 * and twin+duchess is an explicit antiPair). Not smoke, freeze-ray, rewind or
 * sacrifice: each is a rival answer to "the body dies" (smoke+duchess,
 * freeze-ray+duchess, rewind+duchess are all confidence-4 pairs of their own,
 * and Sacrifice detonates the body Decoy is trying to save). Not rabies-dart
 * (antiPair with any summon, and with decoy). The fillers cannot save the
 * Duchess: Aegis shields ROOKIE and the enemies are eating the body, not her;
 * Magnet needs a rook line, and there are none inside the lattice. (Aegis has
 * one back door, closed by construction — see DEAD ENDS.)
 *
 * KEY / TRAP per level (measured, see MEASURED):
 *   L1  none needed — the c-file channel is open and he is on top of it.
 *   L2  none needed — one entombed bishop corks the g-file. Take it, take him.
 *   L3  AEGIS or DECOY (100% each). The e-channel is corked by an entombed
 *       bishop on the open pane e7, and the pawn on the open pane f8 — jammed
 *       forever behind its own pawn on f7 — defends it. Take the cork and f8
 *       takes you back. Shield it, or mark f8 and let the CORK eat it: an
 *       eater vacates its own square, so the doorway opens either way.
 *       TRAP for magnet (6%): the pull lands the cork on a square his court
 *       still covers half the time.
 *   L4  AEGIS or DECOY (100%). The same cork one file over, with the king
 *       directly above it and TWO defenders (b8 and d8, each jammed behind a
 *       filled pane). Two defenders buy the court nothing — a shield ENDS the
 *       enemy turn — so this level is the one that teaches the decoy lure:
 *       mark either pawn and the cork itself eats it, walking out of the
 *       doorway. TRAP for magnet (31%).
 *   L5  DECOY (100%). A bishop stands in the d-channel, jammed by his own
 *       court, one pawn on c8 defends it, and the king is off the channel on
 *       e8 — so she has to come out onto rank 8 to reach him, one move later
 *       than everywhere else. That extra move is what the shield does not
 *       cover: aegis reads 63% here, magnet 31%, decoy 100%.
 *   L6  DUCHESS (100%). The panes close. His cell is f7, three of his four
 *       diagonals are his own pawns, and the fourth — g6 — is empty and
 *       unwatched. Nothing with a rook line can ever touch him again. Summon
 *       her at f5, step her to g6: he has no square, and she takes him.
 *       TRAP for aegis / magnet / decoy: all three read 0% from here down.
 *   L7-L10 the pair, and nothing else.
 *
 * THE FINALE LOCK (all four levels, one shape):
 *   1. He stands on a light square of ranks 6-8, so all four of his
 *      orthogonal neighbours are stone: no rook, bishop or queen line on the
 *      board reaches his square along a rank or a file. Rookie cannot take
 *      him. Ever. No-ability is 0% by construction, not by tuning.
 *   2. Three of his four diagonals are his own pawns, and each is either
 *      unreachable (its own diagonals are the king and another pawn) or
 *      DEFENDED — so the Duchess cannot take one, land on it and win off the
 *      capture-stun. The fourth diagonal is the POST: the only square in the
 *      level from which anything attacks him.
 *   3. The square one step BEYOND the post, on his diagonal, is stone — so
 *      the post cannot be sniped from range down the same line.
 *   4. The square one step beyond the post on the OTHER diagonal is the
 *      Duchess's APPROACH, and the square directly below it — on rank 4, off
 *      the lattice — is stone. A light square in the lattice has stone on all
 *      four orthogonals, so filling the one below it makes the approach
 *      ROOK-UNREACHABLE while leaving the Duchess's diagonal wide open. That
 *      is what stops Rookie standing beside the post and spawning the body
 *      straight onto it for a one-turn kill (see DEAD ENDS — this is the hole
 *      that duchess+aegis found).
 *   5. A pawn sits diagonally above the post and covers it: THE WATCHER. She
 *      lands, the watcher eats her, and the pawn ends up standing on the post
 *      — the post is plugged for the rest of the level.
 *   6. Somewhere behind the court, a bishop jammed between two of its own
 *      pawns. Mark a pawn it defends and the bishop — threat 2 against the
 *      watcher's 1 — takes it, and takes the army's whole turn with it.
 *   7. NOTHING on the board can attack any square Rookie can stand on. Every
 *      court pawn's two capture squares are either stone or inside the
 *      lattice on a light square whose rank-4 neighbour is filled; every
 *      bishop is jammed. That is not decoration: an enemy that can hit Rookie
 *      turns AEGIS into a second Decoy, because a shielded capture is
 *      cancelled AND ends the enemy turn, which is exactly the turn the body
 *      needed (see DEAD ENDS).
 *
 * L7-L10 intended lines (three moves, then the swing):
 *   L7  THE NORTH-EAST COURT. He is on f7; e6/e8/g8 are his pawns, d7 defends
 *       e6, h5 is a filled pane, h7 is the watcher, and the bishop on c8 is
 *       jammed between b7 and d7. Rook f1-f4. Summon the Duchess on f5, mark
 *       b7 (or d7), step her f5-g6. The bishop eats its own pawn; the watcher
 *       never moves. She takes him off g6.
 *   L8  THE NORTH-WEST COURT. He is on d7; c8/e6/e8 are his, f7 defends e6,
 *       b5 is filled, b7 is the watcher, bishop g8 jammed between f7 and h7.
 *       Rook to d4/c4, summon on d5, mark h7 (or f7), step d5-c6.
 *   L9  THE HIGH CELL. He is on f7 again but the post has moved to the OTHER
 *       diagonal: e6, with d5 filled and d7 the watcher; g6 is his pawn
 *       (defended by h7) and it is what makes f5 — the approach — lethal to
 *       Rookie. Bishop c8 jammed between b7 and d7. Rook f1-f4, summon on f5,
 *       mark b7, step f5-e6.
 *   L10 THE WEST COURT. He is on d7 with the post at e6; f5 is the filled pane
 *       behind it, f7 is the watcher, and c6 — his fourth diagonal, defended
 *       by b7 — is a second pawn the body cannot take. The bait is the bishop
 *       on g8 between f7 and h7, the whole width of the board away from the
 *       post: the one finale where the mark and the swing are at opposite
 *       ends. Rook to c3/e4, summon on c4 or d5, mark h7 (or f7), step to e6.
 *
 * MEASURED (Normal difficulty, T5 bot; finale numbers of record are
 * `--jobs=1 --trials=32`, everything else 16 trials at `--jobs=3`):
 *   L1  100% with no ability.  L2  100% with no ability.
 *   L3  none 0% · aegis 100% · decoy 100% · magnet 6%  · duchess 100%
 *   L4  none 0% · aegis 100% · decoy 100% · magnet 31% · duchess 100%
 *   L5  none 0% · aegis 63%  · decoy 100% · magnet 31% · duchess 100%
 *   L6  none 0% · aegis 0%   · decoy 0%   · magnet 0%  · duchess 100%
 *   FINALE, T1 cards, 32 trials, serial:
 *     none 0% · aegis 0% · magnet 0% · decoy 0% · duchess 0% on ALL FOUR
 *     levels, and duchess+decoy L7 100% · L8 97% · L9 100% · L10 100%.
 *     Every other pair in the kit (duchess+aegis, duchess+magnet,
 *     decoy+aegis, decoy+magnet, aegis+magnet) reads 0% on all four levels
 *     (16 trials). Four unique-answer levels: one pair, no second key.
 *   FINALE at the highest tier the offers can reach: decoy:5, aegis:5 and
 *     magnet:5 all read 0% on all four. duchess:2 and duchess:3 read 0% on
 *     all four. duchess:4 and duchess:5 read L7 13% · L8 6%/25% · L9 94% ·
 *     L10 100%. T4 is the tier where the Duchess gets a SECOND CHARGE
 *     (maxUsesForTier: 1/1/1/2/2): the first body dies on the post, the
 *     watcher is now standing on it and nothing defends it any more, so the
 *     second body takes the pawn and then the king. No geometry closes this
 *     — the only squares that attack the post are the king's own square and
 *     the watcher's, so the post can never have a spare defender. This is
 *     the rubric's "the gate depends on ability TIER" case (The Parapet's
 *     knight-hop:4), reported not hidden: the gate holds at T1-T3 and breaks
 *     at T4+ unless the Duchess's tier is pinned.
 *   FIXED 2026-09-06 — `abilityTierCaps: { duchess: 3 }`. Re-measured one
 *     tier at a time (32 trials, --jobs=1, one loadout column per run):
 *     T2 0/0/0/0 and T3 0/0/0/0, confirming the block above, so T3 is the
 *     ceiling and the second charge is never offered. The forced-loadout
 *     matrix is unchanged by design — `--loadouts=duchess:4` still reads
 *     what T4 would do; the cap only removes it from offer slates.
 *   FULL RUNS (40, Normal, T5, never skipping an offer): 13/40 = 33% with
 *     random picks — every death is a move-limit at L6 (10) or L7 (14), i.e.
 *     the player who did not take the Duchess by L6 or Decoy by L7 ends
 *     there, which is the tension the rubric asks for. 35/40 = 88% when the
 *     pool is the pair. The random number matches the family (Vault 28%, The
 *     Parapet 33%); the pool number is high because the pool is only two
 *     cards, so the picker always ends up holding both halves.
 *
 * DEAD ENDS (2026-09-06, all fixed in the shipped build):
 *   - THE MOBILE GUARD IS A GIFT. L3 v1 put a QUEEN in the open channel to
 *     watch it: she reads 100% for no ability. A piece that can move walks
 *     toward Rookie (approachMove), and a rook moves first — anything that
 *     steps onto her rank or file is free food, and if it steps off the
 *     channel the door is open anyway. Every guard in this run is jammed or
 *     frozen; nothing in the lattice moves except the king's flinch.
 *   - AEGIS IS A SECOND DECOY WHEREVER ANYTHING CAN HIT ROOKIE. L10 v1 had a
 *     dark-squared bishop hunting the floor for flavour. duchess+aegis read
 *     100%: the shield cancels the bishop's capture AND ends the enemy turn
 *     (pawn-ai stepEnemyTurn, non-T5 branch), which is exactly the turn the
 *     watcher needed to eat the Duchess. The shield bought the body its life
 *     — Decoy's whole job. Fix: no enemy in a finale may attack any square
 *     Rookie can reach. It also means this kit cannot carry Smoke: one turn
 *     of cover would do the same thing.
 *   - PARK ON THE APPROACH AND SPAWN ONTO THE POST. With the approach square
 *     merely WATCHED, any card that survives one enemy turn there (aegis,
 *     and smoke if it were in the kit) lets Rookie stand beside the post and
 *     summon the body directly onto it — a one-turn kill with no Decoy. A
 *     watched square is not a closed square. Fix: fill the rank-4 square
 *     under the approach, which makes it rook-unreachable and leaves the
 *     diagonal untouched.
 *   - AEGIS BEATS MAGNET ON EVERY PLUG IN THIS GEOMETRY, so Magnet never got
 *     a home above 31%. A shield ends the enemy turn, so a second defender
 *     and even enemiesPerTurn:2 buy the court nothing, and after the block
 *     the recapturer has not moved — the doorway is open with Rookie
 *     standing in it. Magnet's only edge is landing the plug where no pawn
 *     covers it, and the bot picks the wrong landing square about half the
 *     time. In the lattice only PAWNS can cover an empty square (a jammed
 *     bishop only ever defends the pieces jamming it, and nothing at all can
 *     cover rank 8), so there is no way to make a second consecutive square
 *     of a path lethal. Magnet is this run's pure trap card; L4's
 *     enemiesPerTurn:2 was removed once it was measured to do nothing.
 */

import {
  make,
  pawn,
  bishop,
  queen,
  king,
  X,
  FLEE,
  STILL,
  type RunDef,
} from '../run-kit';
import type { Coord } from '../types';

const key = (c: Coord) => `${c.file},${c.rank}`;

/**
 * The lattice: stone on every DARK square of ranks 5-8 (a1 is dark, so dark
 * is (file + rank) even). `open` removes panes; `plus` fills light squares
 * (the walls of a cell, or a fallen pane on the floor).
 */
function LATTICE(open: Coord[] = [], plus: Coord[] = []): Coord[] {
  const skip = new Set(open.map(key));
  const out: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    for (let r = 5; r <= 8; r++) {
      if ((f + r) % 2 !== 0) continue;
      if (skip.has(key(X(f, r)))) continue;
      out.push(X(f, r));
    }
  }
  for (const c of plus) out.push({ ...c });
  return out;
}

const RUN_REVENGE_24: RunDef = {
  id: 'revenge-24',
  name: 'The Lattice',
  blurb: 'Stone on every dark square. Rooks die up there; queens walk.',
  allowedAbilities: ['duchess', 'decoy', 'aegis', 'magnet'],
  // TIER CAP (2026-09-06) — the caveat this run's MEASURED block ends on, now
  // enforced. Re-measured per tier, L7-L10, 32 trials, serial: T2 0/0/0/0 and
  // T3 0/0/0/0, confirming the header, against T4/T5 at 13/6-25/94/100. T4 is
  // where the Duchess gets a SECOND CHARGE (maxUsesForTier 1/1/1/2/2): the
  // first body dies on the post, the second takes the pawn and then the king,
  // with no Decoy at all — and the header proves no geometry closes it,
  // because the only squares attacking the post are the king's and the
  // watcher's. Ceiling T3.
  abilityTierCaps: { duchess: 3 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — ONE PANE OPEN. The c-file has both its panes missing (c5, c7), so
    // it is a channel from the floor to his square. Ride it. A loose pawn on
    // e3 is free tempo on the way past.
    make(
      1,
      [
        pawn(5, 3),
        king(3, 8),
      ],
      {
        ...STILL,
        moveLimit: 8,
        hazards: LATTICE([X(3, 5), X(3, 7)]),
        kingPen: ['c8'],
      },
    ),
    // L2 — THE CORK. The g-file channel is open, and a bishop stands on the
    // open pane at g7 — entombed, because all four of its diagonals (f6, h6,
    // f8, h8) are stone. It has no move for the rest of the level and nothing
    // defends it. Take it, then take him.
    make(
      2,
      [
        bishop(7, 7),
        pawn(2, 3),
        king(7, 8),
      ],
      {
        ...STILL,
        moveLimit: 9,
        hazards: LATTICE([X(7, 5), X(7, 7)]),
        kingPen: ['g8'],
      },
    ),
    // L3 — THE DEFENDED CORK (AEGIS / DECOY). The e-channel is open and an
    // entombed bishop corks it on the open pane e7, one square under his
    // feet. This one is DEFENDED: the pawn on the open pane f8 covers e7 and
    // can never leave it, because its own pawn on f7 is jammed against the
    // stone below and blocks the only square it could walk to. Take the cork
    // and f8 takes you back. AEGIS: take it anyway — a blocked capture is
    // cancelled, so the defender never moves and the doorway is yours.
    // DECOY: mark f8 instead and the CORK eats it, walking out of the
    // doorway to do it. An eater always vacates its own square.
    make(
      3,
      [
        bishop(5, 7),
        pawn(6, 8), pawn(6, 7),
        king(5, 8),
      ],
      {
        ...STILL,
        moveLimit: 10,
        hazards: LATTICE([X(5, 5), X(5, 7), X(6, 8)]),
        kingPen: ['e8'],
      },
    ),
    // L4 — THE DOUBLE LOCK. The same cork with the king directly above it and
    // TWO defenders: pawns on the open panes b8 and d8, each jammed forever
    // behind a filled pane. It measured as the level that proves a second
    // defender is worth nothing — a shield ENDS the enemy turn, so the reply
    // that matters is always the first one. The intended line here is the
    // decoy LURE: mark b8 or d8, the cork itself eats it, and the c-file is
    // open from c4 to his square. (Magnet can also drag the cork two squares
    // down to c5, off both defenders, and take it in the open — that is the
    // one place in the run the pull pays, and only about a third of the
    // time.)
    make(
      4,
      [
        bishop(3, 7),
        pawn(2, 8), pawn(4, 8),
        king(3, 8),
      ],
      {
        ...STILL,
        moveLimit: 11,
        hazards: LATTICE([X(3, 5), X(3, 7), X(2, 8), X(4, 8)], [X(2, 7), X(4, 7)]),
        kingPen: ['c8'],
      },
    ),
    // L5 — THE DOORMAN (DECOY). The d-channel is open (d6, d8) and a bishop
    // stands in the doorway on d7, jammed between his own pawns on c6/e6/c8
    // and his king on e8 — it will never move. One pawn, c8, defends it, and
    // he is not on the channel: the only line to e8 in the level is along
    // rank 8 from d8, and d7 is in the way. Take the doorman and c8 takes you
    // back. MARK him instead: his own pawn eats him, and the eater is
    // standing in the doorway with nothing behind it. (Aegis tanks the
    // recapture and Magnet drags the doorman out — this door has three keys;
    // it is the friendly-fire lesson, not a lock.)
    make(
      5,
      [
        bishop(4, 7),
        pawn(3, 8), pawn(3, 6), pawn(5, 6),
        king(5, 8),
      ],
      {
        ...STILL,
        moveLimit: 10,
        hazards: LATTICE([X(4, 6), X(4, 8)]),
        kingPen: ['e8'],
      },
    ),
    // L6 — THE FIRST CELL (DUCHESS). Every pane is in place. He stands on f7,
    // a light square, so e7/g7/f6/f8 are stone and NO rook line on the board
    // can ever attack him — Rookie is out of the game from here to the end of
    // the run. Three of his diagonals are his own pawns (e6 defended by d7,
    // e8 and g8 unreachable behind him) and the fourth, g6, is empty and
    // UNWATCHED. Walk to f4, summon her on f5, step her to g6: every square
    // he owns is covered by a queen and he has nowhere to go. She takes him.
    make(
      6,
      [
        pawn(5, 6), pawn(4, 7), pawn(5, 8), pawn(7, 8),
        king(6, 7),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: LATTICE(),
      },
    ),
    // L7 — THE NORTH-EAST COURT (the pair). The same cell as L6 with ONE pawn
    // added: h7, the watcher, which covers g6 — the only square in the level
    // that attacks him. The Duchess lands there and is eaten; the pawn then
    // stands on the post and it is plugged forever. h5 is a filled pane, so
    // the post cannot be sniped from down the same diagonal; f5, the
    // approach, is watched by e6, so Rookie can never stand next to the post
    // and spawn onto it. The bishop on c8 is jammed between b7 and d7 and
    // defends both. Rook to e4 or g4; summon on f5, mark b7, step her to g6; the
    // bishop (threat 2) beats the watcher (threat 1) to the turn and eats its
    // own pawn. She takes him off g6.
    make(
      7,
      [
        pawn(5, 6), pawn(4, 7), pawn(5, 8), pawn(7, 8),
        pawn(8, 7),
        bishop(3, 8), pawn(2, 7),
        king(6, 7),
      ],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: LATTICE([], [X(8, 5), X(6, 4), X(4, 5)]),
      },
    ),
    // L8 — THE PLUG (decoy FIRST, body second). The post g6 is unwatched and
    // he has no square — but the ONLY approach to it, f5, is a pawn, pinned
    // by the stone on f4 and defended by e6, and it covers both launch
    // squares beside it (e4 is a second pawn, pinned by e3; g4 is under its
    // diagonal). No body can be summoned onto f5, and a Duchess who takes it
    // is eaten by e6. Friendly fire never empties the SQUARE it hits, but it
    // always empties the square the EATER stood on: mark e4 — the pawn f5
    // defends — and f5 walks off the approach to eat it. THEN stand on g4,
    // spawn on f5, step to g6, take him. The bait on b7 is a trap here: the
    // bishop eats it and the plug never moves. h5 is stone so g6 cannot be
    // sniped down its own line while it stands empty.
    make(
      8,
      [
        pawn(5, 8), pawn(7, 8), pawn(5, 6), pawn(4, 7),
        pawn(6, 5), pawn(5, 4),
        bishop(3, 8), pawn(2, 7),
        king(6, 7),
      ],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: LATTICE([], [X(6, 4), X(5, 3), X(8, 5)]),
      },
    ),
    // L9 — THE OPEN DOOR (the trap card is a key). He is on e8 with BOTH
    // d7 and f7 empty, so any Duchess that SITS on a post makes him flinch to
    // the other one and she runs out of time (the L8 lesson, turned against
    // the player: even a stun-first line fails, because the only square she
    // could sit on, c6, is watched by b7 and the mark that bought the stun
    // has been eaten). The only kill is a ONE-MOVE strike: spawn on c6 and
    // slide c6-d7-e8 before he ever gets an enemy turn. b5 is stone, so c6
    // can be spawned on from exactly one rook-reachable square — d5 — and d5
    // is covered by the pawn on e6. So for once the danger is on ROOKIE, not
    // the body: stand on d5, survive one enemy turn, then spawn and strike.
    // Aegis does that (the shield ends the turn), and so does a mark on b7 or
    // g6 cast the turn she arrives. Duchess + aegis is a deliberate second
    // key here; every single card is still 0.
    make(
      9,
      [
        pawn(3, 8), pawn(7, 8), pawn(2, 7), pawn(5, 6),
        pawn(7, 6), pawn(8, 7),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: LATTICE([], [X(2, 5), X(4, 2), X(4, 3)]),
      },
    ),
    // L10 — THE WEST COURT, TWO HANDS (mark the hunter, not the bait). The
    // L7 court mirrored — he is on d7, the post is e6, f7 is the watcher, the
    // bishop on g8 is jammed between f7 and h7 — and the army now moves TWO
    // pieces a turn. The L7 line is dead: mark h7 and the bishop eats it,
    // then the watcher eats the Duchess with the second action. The only
    // mark that lives is the WATCHER ITSELF: f7 is attacked by e8 and by the
    // bishop, so the bishop takes it (threat 2 beats the pawn), lands on f7
    // having already acted, and nothing else on the board can reach e6 — the
    // second action has nobody to move. Marking anything else (h7, c6, e8)
    // loses on the second action, deterministically. c6 blocks his fourth
    // diagonal and watches d5, f5 and d4 are stone, so the launch is c4/e4
    // and the walk is the longest in the run.
    make(
      10,
      [
        pawn(3, 6), pawn(2, 7), pawn(3, 8), pawn(5, 8), pawn(6, 7),
        bishop(7, 8), pawn(8, 7),
        king(4, 7),
      ],
      {
        ...FLEE,
        moveLimit: 6,
        enemiesPerTurn: 2,
        hazards: LATTICE([], [X(6, 5), X(4, 4), X(2, 5), X(3, 2), X(3, 3), X(5, 2), X(5, 3)]),
      },
    ),
  ],
};

export default RUN_REVENGE_24;
export { RUN_REVENGE_24 };
