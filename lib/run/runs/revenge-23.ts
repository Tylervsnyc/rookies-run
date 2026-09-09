/**
 * revenge-23 — THE PARAPET. Built 2026-09-05 for the signature pair
 * KNIGHT-HOP + TWIN. Twin had no designed home before this run; the
 * discovery harness found the pair gating a generated checker level at
 * 100% (data/run-playtest/combo-library/knight-hop+twin/) while each half
 * read 0% alone. This run is that geometry reduced to its one true cause.
 *
 * THE MECHANISM, read out of lib/run/abilities.ts, engine.ts, pawn-ai.ts:
 *   - Knight Hop at T1 is ONE knight move (transformDurationForTier = 1,
 *     decremented in engine.ts applyRookieMove): she jumps, lands, and is a
 *     ROOK again before the enemy turn begins. So the card is not really
 *     "be a knight" — it is "put a rook on a square no rook line reaches".
 *     A solid stone rank is impassable to every rook, bishop and queen line
 *     in the game and a knight hops it in one beat. That is the universal
 *     solvent, and here it is a ticket, not a key.
 *   - A fleeing king steps off any square Rookie's CURRENT form attacks and
 *     refuses any square a controlled summon attacks (kingFleeMove:
 *     `allyCover` + `controlledThreatensSquare`). One rook attacks one rank
 *     and one file; a 2x2 room has two of each. One rook can never corner
 *     him in a 2x2 (The Vault L5 measured it) — he steps to the square her
 *     lines miss, forever.
 *   - Twin summons a second controlled ROOK beside her, as a free action
 *     (summonSpawnSquares: the eight neighbours). Two rooks own two ranks
 *     or a rank and a file: every square of a 2x2 is attacked or covered,
 *     he cannot step, and the next body-move takes him (a controlled
 *     summon MAY capture the king). Her cover is free — she holds a line
 *     without spending the turn's one body-move.
 *   - Neither half finishes alone. The Twin is a rook and cannot cross the
 *     stone; the hop puts one rook above the stone and one rook is one line
 *     short. Hop up, summon the second rook, close the room.
 *
 * CONSTANT SIGNATURE — THE PARAPET. Every level, rank 6 is a solid wall of
 * stone from a-file to h-file: the king's COURT is the two ranks above it, a
 * raised gallery no rook line ever crosses. Not a band of water with fords
 * (The Moat), not pillars (The Colonnade), not a box around his cell (The
 * Vault / The Glasshouse), not offset bars (The Switchback), not a hedge
 * (The Briar), not shafts (The Stacks) — one unbroken wall the full width
 * of the board, and the whole question of the run is HOW YOU GET UP.
 *   L1-L4  the wall has a STAIR (one gap). Walk up it.
 *   L5     no stair. The first time the wall is whole: hop it.
 *   L6     the stair is back, but his room is 2x2 and one rook cannot hold
 *          it: bring the second rook.
 *   L7-L10 no stair, and his room is 2x2. Hop it AND bring the second rook.
 * The court is guarded by pawns that can never move: each stands on rank 8
 * over a stone on rank 7 (a pawn walks straight and is jammed forever),
 * and each watches the two rank-7 squares beside its stone — so most of the
 * landing squares a knight could take are lethal to a rook body, and the
 * one or two that are not are where the level is decided. A stone on rank
 * 8 always stands between the pawns and his room, so no capturable piece
 * ever shares a line with him: a rook that eats a court pawn is never
 * attacking him when the stun lands, and capture-stun buys nothing.
 *
 * KIT = knight-hop / twin / aegis / decoy (`allowedAbilities` IS the kit).
 * Not magnet (knight form gives Magnet nothing — antiPair), not boulder
 * (stone kills the Twin's lines — antiPair), not freeze-ray / smoke /
 * convert / vanguard (each is a known knight-hop partner and would be a
 * second key on the finales), no second summon (one body-move per turn).
 *   knight-hop  KEY on L5 alone (a still king in a one-square cell: hop to
 *               the square in front of him and take him). Half of L7-L10.
 *               TRAP on L1-L4 and L6: the stair is open, the hop is a
 *               wasted card, and on L6 a second line is what is missing,
 *               not a way up.
 *   twin        KEY on L6 alone (stair open, 2x2 room, one rook short).
 *               Half of L7-L10. TRAP on L1-L5: nothing there needs a second
 *               rook, and on L5 she cannot cross the wall at all.
 *   aegis       KEY on L4: the stair is plugged by a bishop frozen in stone
 *               that a jammed pawn defends. Take the plug, eat the reply,
 *               walk up (a knight on h3 hunts, so she raises the shield in
 *               time — the bot never pre-taps on a quiet board). TRAP on
 *               L5-L10: a shield never crossed a wall, and above the wall
 *               nothing needs tanking — the king is not attacking her, he
 *               is stepping.
 *   decoy       KEY on L4 the slow way (mark the plug; its defender eats
 *               it and now stands in the doorway undefended). TRAP
 *               everywhere else: friendly fire stuns him inside the same
 *               enemy turn it happens, and nothing on the court can be
 *               made to eat anything on his lines.
 *
 * L7-L10 — THE DISTINCT DEMAND OF EACH (reworked 2026-09-07). Tyler on the
 * Lattice and the Alcove: "once you solved it you kind of figured it out."
 * These four levels share the run's one mechanism (hop up, summon the second
 * rook, close the room) but each asks a DIFFERENT question of it, and the
 * clock is now set so that the pair's own intended line is the only line that
 * fits. Measured: the pair reads 72/69/66/63 (mean 67.5) where it used to read
 * 100/100/100/100 — the geometry was never the slack, the MOVE LIMIT was.
 * Every level is now within one spare move of its intended line.
 *   L7  THE WEST GALLERY — CHOOSE THE DOOR. Room c7/d7/c8/d8. A pawn on g8
 *       over a stone on g7 watches f7 and h7, a stone block e7/e8 closes the
 *       rank; three landings survive (a7, b7, d7) and they are not equivalent.
 *       Hop c5-b7 (or a5-b7 / b5-a7): a rook on b7 owns rank 7. Summon the
 *       Twin on b8 — she owns rank 8 and is looking at him — and slide b7-a7
 *       to KEEP the rank. He has no square; the Twin takes him. The canonical
 *       two-rank cage, built from outside the room, and the only finale that
 *       offers a choice of doors. FIVE moves: the choice has to be right the
 *       first time.
 *   L8  THE EAST GALLERY — THE LAUNCH SQUARE IS THE PUZZLE. Room f7/g7/f8/g8,
 *       pawns b8/d8 over b7/d7 watch a7, c7, e7, stone on e8: exactly ONE
 *       landing (h7) and exactly ONE square that jumps to it (g5), and a
 *       bishop on e3 is looking at g5. The question is not where the cage
 *       goes, it is how you reach the only square you may leave from. Hop
 *       g5-h7, summon on h8 to cover rank 8, then WALK IN: h7-g7. FOUR moves
 *       — the tightest clock in the run, because the line is exactly four.
 *   L9  THE HIGH TABLE — CAGE AT RANGE, TWICE THE COURT. Room d7/e7/d8/e8 in
 *       the CENTRE, so neither rook can stand beside him: land on f7 from g5
 *       (a knight on c4 and a bishop on b2 both watch e5), summon on f8, and
 *       hold BOTH ranks from three files away while the court moves twice per
 *       Rookie move. The other three finales cage him from contact; this one
 *       has to hold at distance and survive the extra enemy phase. Five moves,
 *       two enemies a turn.
 *   L10 THE CORNER — THE LANDING IS HIS ROOM. Room g7/h7/g8/h8. Pawns b8/d8/e8
 *       over b7/d7/e7 watch a7, c7, f7, and f8 is stone: the only landing is
 *       g7 ITSELF, from f5 or h5, under a queen on a3 and a bishop on e4.
 *       Rookie hops INSIDE the room and becomes the wall; the Twin, summoned
 *       on h7 or g8, is the executioner. The only finale where Rookie does not
 *       take the king — the roles of the pair are swapped. Five moves, two
 *       enemies a turn.
 *
 * THINGS THE BOTS TAUGHT THIS RUN (2026-09-05, all fixed):
 *   - A court pawn on the king's rank is a GIFT: a rook that eats it from
 *     rank 8 is on his line when the stun lands (L10 v1 read 44% for
 *     knight-hop alone). Every court pawn now has a stone between it and
 *     his room on rank 8.
 *   - Knights below the wall JUMP the wall from rank 5 and become gifts on
 *     the court; enemy pawns PROMOTE on rank 1 and the new queen eats a
 *     decoyed teammate for a free stun (knight-hop + decoy read 63% on
 *     L7). Finale hunters are now two bishops of OPPOSITE colour and
 *     nothing else: a bishop never crosses a solid rank, and opposite
 *     colours can never capture each other, so Decoy has nothing to feed.
 *   - Aegis KEY levels need a live threat: the bot only raises the shield
 *     reactively (L4 read 0% with no hunter, 83% with a knight on h3).
 *   - A rook standing a knight's jump from the king takes him with one hop
 *     (he flees only from her CURRENT form). That is why L6, with a stair,
 *     reads 69% for knight-hop alone, and why the sealed finales cannot be
 *     gated against a SECOND hop (see the tier note in MEASURED).
 *
 * ── 2026-09-07 THE FINALE REWORK — 100/100/100/100 -> 72/69/66/63 ──
 * Tyler's playtest: "the design is really cool but later levels need more
 * difficulty, and ways to solve. I love the combination of abilities, it's
 * just too easy." The combo gate this run was built to is a FLOOR with no
 * ceiling: it proves the pair is REQUIRED, never that it is HARD, and a pair
 * at 100% means the finale solves itself the moment you hold both cards.
 * Target band (.claude/run-level-design.md, "One line, four times"): 60-80%
 * mean with no level at 100%, the model being The Alcove at 67%.
 *
 * WHAT WAS ACTUALLY WRONG: not the geometry — the CLOCK. Every finale line
 * here is 3-4 body moves (reach the launch square, hop, summon free, close),
 * and the levels shipped with 10/9/9/8. Six spare moves is six chances to
 * recover from a wrong door, a wrong launch square, or a bishop that took the
 * first rook. Measured walk-down of the pair, 32 trials, T5, jobs=4:
 *      moveLimit    L7   L8   L9  L10   mean
 *      10/9/9/8    100  100  100  100  100.0   (as shipped)
 *       8/7/7/6    100  100  100  100  100.0   (still no bite at all)
 *       6/5/5/4     97   81   66   25   67.3   (past the band on both ends)
 *       5/5/5/5     72   81   66   63   70.5
 *       5/4/5/5     72   69   66   63   67.5   <- SHIPPED
 * Nothing else changed: no piece, no stone, no room, no kit, no tier cap, and
 * the parapet signature (rank 6 solid a-h, jammed rank-8 pawns over rank-7
 * merlons, a stone between every pawn and his room) is untouched. Because the
 * only edit is a smaller move budget, the singles cannot rise — and they did
 * not. Re-measured, same command, T1 cards, Normal, 32 trials, jobs=4:
 *    L       none      aegis      decoy  knighthop       twin  |  knight-hop+twin
 *    7         0%         0%         0%         0%         0%  |   72%
 *    8         0%         0%         0%         0%         0%  |   69%
 *    9         0%         0%         0%         0%         0%  |   66%
 *   10         0%         0%         0%         0%         0%  |   63%
 * GATE HOLDS (every kit card 0%, worst cell 0%) AND THE BAND HOLDS: pair mean
 * 67.5, no level at 100, none below 60. These are the numbers of record.
 *
 * THE COST, reported not hidden. 0.72 x 0.69 x 0.66 x 0.63 = 20.7%, so the
 * finale alone now gates four fifths of full runs. FULL RUNS (40, Normal, T5,
 * no retries) fell from 13/40 = 33% random / 26/40 = 65% pair-pool to
 * 6/40 = 15% random / 7/40 = 18% pair-pool, and the sim's per-level ladder
 * shows the loss is exactly the finale (pair pool: L7 25/31, L8 16/25,
 * L9 12/16, L10 7/12). That is the arithmetic of the 60-80% band, not a
 * regression — any run tuned to it compounds the same way — but it is the
 * open question the band raises for every combo run: a 67% finale mean and a
 * 25%+ full-run clear cannot both be true without retries.
 * WITH RETRIES — which is what the app's Normal actually ships (3/level) —
 * the run is healthy: 17/40 = 43% with random picks, 32/40 = 80% when the
 * pool is the pair. So the finale is now a real wall you bounce off once or
 * twice and then solve, which is exactly the note Tyler gave. Quote the
 * RETRY numbers when asking whether the run is too hard; quote the no-retry
 * numbers only when comparing against older runs measured that way.
 * ──
 * ── 2026-09-06 RE-MEASURED AFTER THE CROSS-TALK FIX (commit 94482af) ──
 * Everything under MEASURED below was taken with a harness whose result depended
 * on the SHAPE of the command: the MCTS bot carried a process-lifetime decision
 * counter into its rollout RNG seed, so a cell read one number alone and another
 * as a later column of a multi-column run (repeating ONE cell four times in one
 * process gave 24/16/21/23 of 32). Rookie's start file was unseeded too. Both are
 * fixed; a cell now depends only on (run, level, loadout, trial, tier) and is
 * reproducible across invocation shapes — guarded by
 * scripts/run-playtest/matrix-determinism-check.ts.
 *
 * FINALE, numbers of record. `revenge.ts matrix --run=revenge-23 --levels=7,8,9,10
 * --loadouts=<none + kit + pair> --trials=32 --jobs=8`, T1 cards, Normal:
 *    L       none      aegis      decoy  knighthop       twin  |  knight-hop+twin
 *    7         0%         0%         0%         0%         0%  |  100%
 *    8         0%         0%         0%         0%         0%  |  100%
 *    9         0%         0%         0%         0%         0%  |  100%
 *   10         0%         0%         0%         0%         0%  |  100%
 * GATE HOLDS: no card in the kit clears a finale level alone (worst single cell 0%); the pair reads 100/100/100/100.
 * SUPERSEDED 2026-09-07 by the block above: this table is the geometry as it
 * stands today measured on the OLD move limits (10/9/9/8). The gate half is
 * unchanged and still true; the 100/100/100/100 half is what was fixed.
 * The header below reads 100/100/100/100 for the pair and is CONFIRMED (max drift 0 points,
 * inside 32-trial binomial noise) — but it was taken with the flawed method, so these
 * are the numbers of record.
 * ──
 * MEASURED (Normal, T5 bot, --jobs=1 --trials=32 on the finale, 2026-09-05):
 *   L1-L3 free. L4 none 0% / aegis 83% / decoy 100% (knight-hop and twin
 *   also solve it — it is a stair level). L5 none 0% / knight-hop 100% /
 *   everything else 0%. L6 none 0% / twin 100% / knight-hop 69% / aegis 0%
 *   / decoy 0%.
 *   FINALE at T1 — none, knight-hop, twin, aegis, decoy each read 0% on
 *   all four levels; knight-hop + twin reads L7 100% · L8 100% · L9 100% ·
 *   L10 100%. Every other pair in the kit (knight-hop+aegis,
 *   knight-hop+decoy, twin+aegis, twin+decoy, aegis+decoy) reads 0% on all
 *   four (16 trials, --jobs=2).
 *   FINALE at the highest tier the offers reach — twin:4 0% · aegis:5 0% ·
 *   decoy:5 0% · knight-hop:5 0% (a permanent knight can never corner a
 *   2x2) — but knight-hop:4 reads L7 97% · L8 78% · L9 97% · L10 31%. T4
 *   is the one tier with TWO uses: hop up, walk the rook to a knight's jump
 *   from him, hop onto him. No geometry stops it (his flight square is
 *   always a jump from somewhere on the court). This is the rubric's "the
 *   gate depends on ability TIER" case, reported not hidden: the gate holds
 *   at T1-T3 and T5 and breaks at T4 unless knight-hop's tier is pinned.
 *   FIXED 2026-09-06 — `abilityTierCaps: { 'knight-hop': 3 }`. Re-measured
 *   one tier at a time (32 trials, --jobs=1, one loadout column per run):
 *   T2 0/0/0/0 and T3 0/0/0/0, so T3 is the highest tier the gate survives
 *   and the run now never offers the fourth. The forced-loadout matrix above
 *   is UNCHANGED by the cap on purpose — `--loadouts=knight-hop:4` still
 *   measures what T4 would do; the cap only removes it from offer slates.
 *   FULL RUNS [SUPERSEDED 2026-09-07 — see the rework block above: now
 *   6/40 = 15% random, 7/40 = 18% pair-pool, no retries] (40, Normal, T5,
 *   never skipping an offer): 13/40 = 33% with
 *   random picks (deaths at L5-L7, all move-limit — the player who did not
 *   take the hop by L5 or the Twin by L7 ends there), 26/40 = 65% when the
 *   pool is the pair. Same shape as The Vault (28% / 53%) and The Glasshouse
 *   (43%); the random-pick number is above the Moat's 10-25% target for the
 *   structural reason the rubric already names (two of four cards are the
 *   pair, offers on L1/L3/L6/L9).
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

/** The FINISHERS every Revenge offer slate carries (mirrors runs.ts). */
const REVENGE_CORE_23: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

/**
 * The parapet: rank 6 in stone from a to h, minus the STAIR files (1-8).
 * Extra stones (the merlons under the court pawns) go in `plus`.
 */
function PARAPET(stairs: number[] = [], plus: Coord[] = []): Coord[] {
  const out: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    if (stairs.includes(f)) continue;
    out.push(X(f, 6));
  }
  for (const c of plus) out.push({ ...c });
  return out;
}

/** A 2x2 room whose lower-left corner is (f, 7). */
function ROOM(f: number): string[] {
  const n = (ff: number, r: number) => `${'abcdefgh'[ff - 1]}${r}`;
  return [n(f, 7), n(f + 1, 7), n(f, 8), n(f + 1, 8)];
}

const RUN_REVENGE_23: RunDef = {
  id: 'revenge-23',
  signaturePair: ['knight-hop', 'twin'],
  name: 'The Parapet',
  blurb: 'A wall the whole width of the board. He is on top of it.',
  allowedAbilities: ['knight-hop', 'twin', 'aegis', 'decoy'],
  // PER-RUN DIFFICULTY OVERRIDE (2026-09-07). Hard's global `+1 enemy per turn`
  // makes THIS run EASIER, measured twice: no-retry 30% Normal vs 37% Hard, real-retry 42% vs 50%. The cause is the
  // documented one (.claude/run-level-design.md, "Pawn walls march") — the
  // enemy phase is what drains a narrow corridor open, so an extra enemy move
  // per turn is a GIFT on a stone/wall run. Hard keeps its tighter clock
  // (moveLimitDelta -2) and its fleeing king; only the enemy-count delta is
  // pinned to 0.
  difficultyOverrides: { hard: { enemiesPerTurnDelta: 0 } },
  // TIER CAP (2026-09-06) — the caveat this run's own MEASURED block ends on,
  // now enforced instead of only reported. Re-measured per tier, L7-L10, 32
  // trials, serial: T2 0/0/0/0 and T3 0/0/0/0 (the gate holds), against the
  // header's T4 97/78/97/31. T4 is knight-hop's only two-use tier
  // (maxUsesForTier 1/1/1/2/1), and the second hop is the weapon: hop up,
  // walk to a knight's jump from him, hop onto him. Ceiling T3 — the tier a
  // player realistically reaches by the finale anyway, and the one the gate
  // was measured against.
  abilityTierCaps: { 'knight-hop': 3 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_23,
  offerCoreMin: 2,
  levels: [
    // L1 — THE STAIR. Still king on e8, a one-square cell, and the wall has
    // one gap: e6, straight below him. Ride the e-file up the stair and
    // take him. Two loose pawns below the wall are free tempo.
    make(
      1,
      [
        pawn(3, 4), pawn(7, 3),
        king(5, 8),
      ],
      {
        ...STILL,
        moveLimit: 7,
        hazards: PARAPET([5]),
        kingPen: ['e8'],
      },
    ),
    // L2 — THE FAR STAIR. Still king on b8; the gap is at g6, the other
    // side of the board. Up the g-file, then west along the court. The pawn
    // on e8 sits on your road: take it on the way.
    make(
      2,
      [
        pawn(5, 8),
        pawn(8, 4),
        king(2, 8),
      ],
      {
        ...STILL,
        moveLimit: 9,
        hazards: PARAPET([7]),
        kingPen: ['b8'],
      },
    ),
    // L3 — HE MOVES. First flee king: g8 in a two-square cell f8/g8, both on
    // rank 8. Stair at d6. Up the d-file to d8 and one rook on rank 8 sees
    // both his squares — he has nowhere to step. A knight hunts below.
    make(
      3,
      [
        knight(2, 3),
        pawn(8, 4),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: PARAPET([4]),
        kingPen: ['f8', 'g8'],
      },
    ),
    // L4 — THE PLUG. Stair at c6, and a bishop stands in it, frozen in a
    // knot of stone (b5, d5, b7 are stone and d7 is its own pawn — it has no
    // legal move, ever, so it cannot walk out of the doorway the way a pawn
    // would). The pawn on d7 is jammed against the wall (d6 is stone) and
    // defends the plug forever. Take the plug and d7 takes you back. AEGIS:
    // take it anyway, eat the reply, walk up to c8 and own his two-square
    // rank-8 cell. (DECOY: mark the plug, d7 eats it, and the eater in the
    // doorway is undefended — the slow key.)
    make(
      4,
      [
        bishop(3, 6), pawn(4, 7),
        knight(8, 3),
        king(2, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: PARAPET([3], [X(2, 5), X(4, 5), X(2, 7)]),
        kingPen: ['a8', 'b8'],
      },
    ),
    // L5 — THE WHOLE WALL. No stair. A still king on d8 in a one-square
    // cell; a pawn on f8 over a stone on f7 watches e7 and g7. The square in
    // front of him, d7, is a knight's jump from c5. Hop up, and a rook on d7
    // is looking straight at him. KEY = knight-hop, alone.
    make(
      5,
      [
        pawn(6, 8),
        knight(7, 4),
        king(4, 8),
      ],
      {
        ...STILL,
        moveLimit: 8,
        hazards: PARAPET([], [X(6, 7)]),
        kingPen: ['d8'],
      },
    ),
    // L6 — THE OPEN COURT. The stair is back (d6) and the court is empty,
    // but his room is 2x2 in the far corner (g7/h7/g8/h8). One rook can
    // never corner a fleeing king in a 2x2: whichever rank she owns, he
    // steps to the other. Walk up, and bring the SECOND rook: Rookie on
    // rank 7, the Twin on rank 8, and he has no square. KEY = twin, alone.
    make(
      6,
      [
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: PARAPET([4]),
        kingPen: ROOM(7),
      },
    ),
    // L7 — THE WEST GALLERY. CHOOSE THE DOOR. No stair, 2x2 room
    // c7/d7/c8/d8. Two jammed pawns (e8 over e7, g8 over g7) watch d7, f7 and
    // h7, so the only landings a rook body survives are a7 and b7 — and they
    // are not equivalent. Hop c5-b7: rank 7 is hers. Summon the Twin on b8:
    // rank 8 is hers too and she is looking at him. Slide b7-a7 to KEEP the
    // rank. He has no square. The canonical two-rank cage, built from OUTSIDE
    // the room, and the only finale with a choice of doors. FIVE moves (was
    // 10): the intended line is four, so the door has to be right first time.
    // Pair 72%.
    make(
      7,
      [
        pawn(7, 8),
        bishop(5, 4), bishop(2, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 5,
        hazards: PARAPET([], [X(5, 7), X(5, 8), X(7, 7)]),
        kingPen: ROOM(3),
      },
    ),
    // L8 — THE EAST GALLERY. THE LAUNCH SQUARE IS THE PUZZLE. Room
    // f7/g7/f8/g8. Pawns b8 and d8 over stones b7/d7 watch a7, c7 and e7: the
    // only landing is h7, and the only square that jumps to h7 is g5 — which
    // a bishop on e3 is looking at. The question is not where the cage goes,
    // it is how you reach the one square you may leave from. Hop g5-h7,
    // summon on h8 (she sees g8 and f8), then WALK IN: h7-g7. FOUR moves (was
    // 9) — the tightest clock in the run, because the line is exactly four.
    // Pair 69%.
    make(
      8,
      [
        pawn(2, 8), pawn(4, 8),
        bishop(3, 4), bishop(5, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 4,
        hazards: PARAPET([], [X(2, 7), X(4, 7), X(5, 8)]),
        kingPen: ROOM(6),
      },
    ),
    // L9 — THE HIGH TABLE. CAGE AT RANGE, TWICE THE COURT. Room d7/e7/d8/e8
    // in the CENTRE, so neither rook can stand beside him. Pawn b8 over b7
    // watches a7 and c7; g7 is stone. Land on f7 from g5 (a knight on c4 and
    // a bishop on b2 both watch e5), summon on f8, and hold BOTH ranks from
    // three files away — the other three finales cage him from contact, this
    // one has to hold at distance — while the court moves twice per Rookie
    // move. FIVE moves (was 9), two enemies a turn. Pair 66%.
    make(
      9,
      [
        pawn(2, 8),
        bishop(3, 4), bishop(2, 2),
        king(4, 8),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 5,
        hazards: PARAPET([], [X(2, 7), X(3, 8), X(7, 7)]),
        kingPen: ROOM(4),
      },
    ),
    // L10 — THE CORNER. Room g7/h7/g8/h8. Pawns b8, d8 and e8 over stones
    // b7/d7/e7 watch a7, c7 and f7, and f8 is stone, so the court's rank 8
    // never reaches him from the west (a rook eating those pawns is never
    // on his line when the stun lands — L10 v1 lost 44% to exactly that).
    // The only landing is g7 — INSIDE his room — from f5 or h5, under a
    // queen on a3 and a bishop on e4 that watches f5. THE LANDING IS HIS
    // ROOM: Rookie hops INSIDE (the g-file and rank 7 are hers) and becomes
    // the WALL; the Twin, summoned on h7 or g8, is the executioner. The only
    // finale where Rookie does not take the king — the roles of the pair are
    // swapped. FIVE moves (was 8), two enemies a turn. Pair 63%.
    make(
      10,
      [
        pawn(2, 8), pawn(4, 8), pawn(5, 8),
        bishop(3, 3), bishop(5, 4),
        king(8, 8),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 5,
        hazards: PARAPET([], [X(2, 7), X(4, 7), X(5, 7), X(6, 8)]),
        kingPen: ROOM(7),
      },
    ),
  ],
};

export default RUN_REVENGE_23;
export { RUN_REVENGE_23 };
