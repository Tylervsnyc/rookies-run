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
 * L7-L10 intended lines (one shape, tightening landings):
 *   L7  THE WEST GALLERY. Room c7/d7/c8/d8. A pawn on g8 over a stone on
 *       g7 watches f7 and h7, a stone block e7/e8 closes the rank; the free
 *       landings are a7, b7 and d7. Hop c5-b7 (or a5-b7 / b5-a7): a rook on
 *       b7 owns rank 7. Next turn summon the Twin on b8 — she owns rank 8
 *       and is looking at him — and slide b7-a7 to keep the rank. He has no
 *       square. The Twin takes him.
 *   L8  THE EAST GALLERY. Room f7/g7/f8/g8, pawns b8/d8 over b7/d7 watch
 *       a7, c7, e7, stone on e8: the only landing is h7, reached from g5,
 *       and a bishop on e3 is looking at g5. Hop g5-h7, summon on h8, step
 *       into g7.
 *   L9  THE HIGH TABLE. Room d7/e7/d8/e8 in the centre. Pawn b8 over b7
 *       watches a7/c7, stones on c8 and g7: land on f7 from g5, summon on
 *       f8 and run her out to h8 along the open rank — both lines hold from
 *       three squares away. Two enemies a turn.
 *   L10 THE CORNER. Room g7/h7/g8/h8. Pawns b8/d8/e8 over b7/d7/e7 watch
 *       a7, c7, f7, and f8 is stone: the landing is g7 ITSELF, from f5 or
 *       h5, under two bishops. Land inside his room, summon on h7 or g8,
 *       and take him with whichever rook he steps in front of. Eight moves,
 *       two enemies a turn.
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
 *   FULL RUNS (40, Normal, T5, never skipping an offer): 13/40 = 33% with
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
  name: 'The Parapet',
  blurb: 'A wall the whole width of the board. He is on top of it.',
  allowedAbilities: ['knight-hop', 'twin', 'aegis', 'decoy'],
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
    // L7 — THE WEST GALLERY. No stair, 2x2 room c7/d7/c8/d8. Two jammed
    // pawns (e8 over e7, g8 over g7) watch d7, f7 and h7, so the only
    // landings a rook body survives are a7 and b7. Hop c5-b7: rank 7 is
    // hers. Summon the Twin on b8: rank 8 is hers too and she is looking at
    // him. Slide b7-a7 to keep the rank. He has no square. The pair.
    make(
      7,
      [
        pawn(7, 8),
        bishop(5, 4), bishop(2, 4),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: PARAPET([], [X(5, 7), X(5, 8), X(7, 7)]),
        kingPen: ROOM(3),
      },
    ),
    // L8 — THE EAST GALLERY. Room f7/g7/f8/g8. Pawns b8 and d8 over stones
    // b7/d7 watch a7, c7 and e7: the only landing is h7, and the only square
    // that jumps to h7 is g5 — which a bishop on e3 is looking at. Hop
    // g5-h7, summon on h8 (she sees g8 and f8), step into g7. Nine moves.
    make(
      8,
      [
        pawn(2, 8), pawn(4, 8),
        bishop(3, 4), bishop(5, 3),
        king(6, 8),
      ],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: PARAPET([], [X(2, 7), X(4, 7), X(5, 8)]),
        kingPen: ROOM(6),
      },
    ),
    // L9 — THE HIGH TABLE. Room d7/e7/d8/e8 in the centre of the court.
    // Pawn b8 over b7 watches a7 and c7; g7 is stone. Land on f7 from g5
    // (a knight on c4 and a bishop on b2 both watch e5), summon on f8 and
    // run her out to h8 along the open rank: rank 7 and rank 8 both hold
    // from three squares away, and she takes him down the rank. Two
    // enemies a turn.
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
        moveLimit: 9,
        hazards: PARAPET([], [X(2, 7), X(3, 8), X(7, 7)]),
        kingPen: ROOM(4),
      },
    ),
    // L10 — THE CORNER. Room g7/h7/g8/h8. Pawns b8, d8 and e8 over stones
    // b7/d7/e7 watch a7, c7 and f7, and f8 is stone, so the court's rank 8
    // never reaches him from the west (a rook eating those pawns is never
    // on his line when the stun lands — L10 v1 lost 44% to exactly that).
    // The only landing is g7 — INSIDE his room — from f5 or h5, under a
    // queen on a3 and a bishop on e4 that watches f5. Land in his room
    // (the g-file and rank 7 are hers), summon the Twin on h7 or g8, and
    // take him with whichever rook he stands in front of. Two enemies a
    // turn, eight moves.
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
        moveLimit: 8,
        hazards: PARAPET([], [X(2, 7), X(4, 7), X(5, 7), X(6, 8)]),
        kingPen: ROOM(7),
      },
    ),
  ],
};

export default RUN_REVENGE_23;
export { RUN_REVENGE_23 };
