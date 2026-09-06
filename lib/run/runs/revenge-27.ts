/**
 * revenge-27 — THE HAYLOFT. Built 2026-09-06 for the signature pair
 * SCARECROW + KNIGHT-HOP ("he runs the wrong way, onto your line").
 * Kit = scarecrow / knight-hop / aegis / hourglass (`allowedAbilities` IS
 * the kit). Scarecrow is at the TESTING stage, so this run is /playtest-only.
 *
 * WHY THIS PAIR, read out of lib/run/pawn-ai.ts (scarecrowViewState,
 * kingReaction, kingFleeMove) and lib/run/abilities.ts:
 *   - A fleeing king steps off any square Rookie's CURRENT form attacks and
 *     goes to the farthest safe square from her. One rook attacks one rank
 *     and one file; a 2x2 room has two of each. A lone rook NEVER corners
 *     him in a 2x2 — he steps to the line she is not on, forever (The Vault
 *     L5, The Slash, The Parapet all measured it).
 *   - Knight Hop at T1 is ONE knight move: she jumps the roof and is a rook
 *     again before the enemy turn. It is a ticket over the wall, not a
 *     weapon — and on the far side she is that lone rook.
 *   - Scarecrow stands a straw Rookie on ANY empty square, for free. For one
 *     enemy phase the court and the king play against a view in which the
 *     straw IS Rookie (rook lines) and the real Rookie is a HAZARD — nothing
 *     can capture her, hunt her or land on her. So the straw is two things at
 *     once: a STEERING WHEEL (he flees the straw's lines, onto her real
 *     line, and she takes him) and a BLINDFOLD (a straw off his lines means
 *     he does not step at all, and the watcher on her landing square cannot
 *     strike her). But the straw has no body: from her side of the roof it
 *     can make him run all day and she never has a line to take him on.
 *   - Neither half finishes alone. Hop it AND believe the straw.
 *
 * CONSTANT SIGNATURE — THE HAYLOFT. Every level a GABLED ROOF of stone sits
 * over the top of the board: a flat ridge on rank 6 (c6-f6) with two eaves
 * sloping down two squares thick at each end (a4 a5 b5 b6 / g5 g6 h4 h5).
 * Twelve stones. The attic above it is an 18-square loft — the whole of
 * ranks 7-8 plus a6 and h6 — and no rook line, no pawn and no bishop of
 * either colour ever passes the roof (the ridge is a rank, the eaves are two
 * deep, so no diagonal slips between two stones). Not a band across rank 5
 * (The Moat), not one solid rank (The Parapet), not a diagonal (The Slash /
 * The Cliff), not a box (The Vault / The Glasshouse), not offset bars (The
 * Switchback), not a hedge (The Briar), not a ring (The Keep): a roof, and
 * he lives in the rafters. The scarecrow is straw; the loft is where the
 * straw goes.
 *
 *   L1-L2  the roof has a SKYLIGHT (one ridge stone missing). Climb through.
 *   L3     first flee king, skylight open, row room (a8/b8): rank 8 owns a
 *          row, he has nowhere to step. Free — the lesson the finale inverts.
 *   L4     the skylight is PLUGGED by a bishop frozen in stone and defended
 *          by a jammed pawn in the loft. Take the plug, eat the reply: AEGIS.
 *   L5     skylight open, but his room is 2x2 — a rook can never hold it.
 *          Walk up, and stand a straw where he thinks you are: SCARECROW.
 *   L6     no skylight. Row room again, so a rook on rank 8 owns it — but the
 *          only way over the roof is a jump: KNIGHT-HOP.
 *   L7-L10 no skylight AND a 2x2 room. Jump the roof, then make him believe
 *          the straw. The pair, and nothing else in the kit.
 *
 * THE KNIGHT'S DOORS. From her side the loft is entered on exactly these
 * squares: a6 (from b4, c5), b7 (c5), c7 (d5), d7 (c5, e5), e7 (d5, f5),
 * f7 (e5), g7 (f5), h6 (g4, f5). So the launch squares are b4, c5, d5, e5,
 * f5, g4 — the row of squares under the ridge — and a level chooses its
 * doors by stoning launch squares. His start square is always on rank 8: no
 * rank-8 square is a knight's jump from anywhere below the roof, so a hop
 * can never land ON him (the Parapet's "rook a jump away takes him" line).
 *
 * WHY THE SINGLES FAIL ON THE FINALE (kit-relative, measured below):
 *   none        no line crosses the roof. 0%.
 *   knight-hop  one jump, then a rook in a 2x2 room. He steps off her line
 *               forever, and nothing in the loft can be captured for a stun
 *               (no enemy piece up there ever shares a line with his room).
 *   scarecrow   the straw can stand in the loft and make him run, but she
 *               is below the roof with no line to take him on.
 *   aegis       a shield does not cross a roof; up there nothing hits her.
 *   hourglass   a free enemy turn moves nothing that matters: below the roof
 *               there is nothing to wait for, and above it he only steps.
 *
 * KEY / TRAP map:
 *   scarecrow   KEY L5, half of L7-L10. TRAP L1-L4/L6 (a still king does not
 *               run; a row room needs no steer).
 *   knight-hop  KEY L6, half of L7-L10. Second answer on L3-L5 (a skylight
 *               level is already open; a hop is a wasted card there but not
 *               a losing one) and on L4 (jump the plug: land on the jammed
 *               pawn from d5 and take him while he is stunned — honest).
 *   aegis       KEY L4. TRAP everywhere else: nothing above the roof attacks
 *               her, and a shield does not stop him stepping.
 *   hourglass   KEY nowhere by design — the trap card. On L4 it looks like
 *               "let the plug move" (it never moves: it is frozen), on the
 *               finale it looks like "let him step first" (he only steps
 *               when threatened, and then away from you).
 *
 * THE FOUR FINALE DECISIONS (written before building, per "One line, four
 * times"). Same two cards, a different decision each level; the L7 habit
 * loses on L8, the L8 habit loses on L9, and L10 reverses the order:
 *   L7  THE STEER — straw ON his line. Centre room d7/d8/e7/e8, king d8,
 *       c5/e5 stoned so NO door attacks his square (d7 is not landable).
 *       Land on e7 (from d5/f5) or c7 (from d5): a rook there holds one line
 *       of his room but not him. Stand the straw on his rank or his file —
 *       he flees the straw, farthest first, and the far square is on her
 *       line. Take him. Forgiving: several straw squares work; the one
 *       thing that never works is a straw OFF his lines (he stands, and she
 *       has no line onto d8).
 *   L8  THE BLINDFOLD — straw OFF his line. East room g7/g8/h7/h8, king g8,
 *       a jammed pawn on f8 (f7 stone) watching g7, e8 stone so nothing ever
 *       reaches that pawn, h6 stone so g7 is the ONLY door that attacks him.
 *       The landing square is lethal: hop f5-g7 bare and the pawn eats her.
 *       So the straw is not a steer here, it is a BLINDFOLD — stand it
 *       anywhere its rook lines miss him and the whole court, including the
 *       pawn, plays against a Rookie who is not there (the real Rookie is a
 *       hazard in the view: uncapturable, unhuntable). He does not step, the
 *       pawn cannot strike her, g7xg8. The L7 habit — a straw ON his lines —
 *       makes him step off g8 and the one door is wasted.
 *   L9  THE ONE SQUARE — WHICH straw. West room a7/a8/b7/b8, king a8; a6 and
 *       c5 stone, so the doors are c7 (from d5) and d7 (from e5), both
 *       holding rank 7. Every straw with a line to a8 looks the same and
 *       only some work: a straw beside him on rank 8 (b8 or further east)
 *       sends him DOWN onto her rank; a straw below him on a7 — the obvious
 *       "push him up" square — sends him SIDEWAYS to b8, off her rank, and
 *       the level is gone. Two enemies a turn.
 *   L10 THE STRUCK STRAW — WHERE the straw can stand. West room again but
 *       the king on b8, a jammed pawn on c8 (c7 stone) watching b7, d8 and
 *       a6 stone: b7 (from c5) is the only door and it is watched, so this
 *       is L8's blindfold — except the army now acts TWICE. A straw any
 *       hunter below the roof can reach is struck by the first action, the
 *       strike destroys it, and the second action plays against the real
 *       board and eats her on b7. The straw has to stand INSIDE the loft,
 *       where nothing can reach it (a7 / a8). The L8 habit — any quiet
 *       square below — loses deterministically to the second action.
 * Contract: L7-L10 no-ability ~0%, every single kit card <= 8%, the pair
 * 60-80% (not 100). MET on all four levels — numbers below.
 *
 * MEASURED (Normal, T5 bot, kit at T1 — the harness default; 2026-09-06).
 *   MID-RUN, numbers of record (--jobs=1, 32 trials/cell):
 *   L      none  scarecrow  knight-hop  aegis  hourglass  |  pair
 *   1-3    100%    100%       100%      100%    100%      |  100%  (teaching)
 *   4        0%     41%         0%      100%      0%      |   94%  (aegis KEY)
 *   5        0%    100%       100%        0%      0%      |  100%  (scarecrow KEY)
 *   6        0%      0%       100%        0%      0%      |  100%  (knight-hop KEY)
 *   FINALE, numbers of record (--jobs=1 SERIAL, 32 trials/cell):
 *   7        0%      0%         0%        0%      0%      |   66%
 *   8        0%      0%         0%        0%      0%      |   69%
 *   9        0%      0%         0%        0%      0%      |   63%
 *   10       0%      0%         0%        0%      0%      |   75%
 *   Every OTHER pair in the kit (scarecrow+aegis, scarecrow+hourglass,
 *   knight-hop+aegis, knight-hop+hourglass, aegis+hourglass) reads 0% on all
 *   four levels (16 trials, --jobs=3).
 *   TIERS (the highest the offers can reach) — scarecrow:5 0%, aegis:5 0%,
 *   hourglass:5 0% on all four. But knight-hop:4 reads L7 100% · L8 100% ·
 *   L9 88% · L10 94%, and knight-hop:5 reads L7 50% (0% on L8-L10). This is
 *   THE PARAPET'S EXACT CAVEAT, reported not hidden: T4 is the tier with TWO
 *   uses, so the second hop is a weapon — hop up (use 1), walk the rook to a
 *   knight's jump from where he rests, hop onto him (use 2). His flight
 *   square is always a jump from SOMEWHERE inside an 18-square loft, and no
 *   geometry short of filling the loft stops that. The gate holds at T1-T3;
 *   at T5 (a permanent knight) the loft is big enough to matter only on L7.
 *   FIXED 2026-09-06 — `abilityTierCaps: { 'knight-hop': 1 }`, and the sweep
 *   that chose it CORRECTED the sentence above. One tier per column, 32
 *   trials, --jobs=1: T1 0/0/0/0, T2 0/47/0/59, T3 0/100/0/88. The gate does
 *   NOT hold to T3 here. knight-hop's uses are 1/1/1/2/1, so T2 buys no
 *   second cast — it buys a second TURN as a knight, and inside an
 *   18-square loft one extra knight turn IS the second jump. That is why
 *   this run caps the same card at T1 where The Parapet caps it at T3: the
 *   cap is a property of the geometry, not of the card. The forced-loadout
 *   matrix above is unchanged by the cap on purpose.
 *   FULL RUNS (40 each, never skipping an offer): 10/40 = 25% clear with
 *   RANDOM picks from the kit — deaths L4 11, L5 4, L6 5, L7 8, L8 2, i.e.
 *   arriving without the card the level asks for. That 25% is the top of the
 *   Moat's 10-25% target and BELOW every recent combo run (Vault 28%, Slash
 *   40%, Briar 55%), because this kit has two trap cards that are traps
 *   everywhere but one level. 26/40 = 65% when the player takes only
 *   scarecrow + knight-hop; the finale costs 0/2/0/0 runs there because by
 *   L7 the pool has upgraded knight-hop into the T4 solo above.
 *
 * DEAD ENDS, 2026-09-06:
 *   - THE CLOCK WAS THE WHOLE DIFFICULTY, AND IT CUT THE WRONG WAY. The
 *     first build ran L7-L10 at 7/7/7/6 moves and read the pair at
 *     44/9/59/0% — not "hard", just unreachable: the launch square is under
 *     the ridge, so a rook spends 3-5 moves just walking there from a random
 *     rank-1 start, and the straw costs a turn of its own. Loosening to
 *     10/9/9/8 put all four in 63-75% with every single still at 0%. On a
 *     run whose signature is a WALK to a specific launch square, the clock
 *     is a start-square lottery before it is a difficulty knob.
 *   - A SECOND ENEMY DOES NOT MAKE A STEER HARDER, IT MAKES IT RANDOM. The
 *     first L9/L10 carried enemiesPerTurn 2 AND three hunters below the
 *     roof; the pair read 0% because the extra action killed her on the walk,
 *     not because the straw was wrong. L9 dropped to two bishops and a
 *     single action; L10 keeps two actions but only because the second
 *     action is the LEVEL'S IDEA (it is what strikes a badly placed straw),
 *     with two hunters and a longer clock to pay for it.
 *   - THE FIRST L8 WAS A SECOND KNIGHT-HOP LEVEL. King h8 with the room
 *     g8/h7/h8 and the door on h6 read 56% for knight-hop ALONE at 16
 *     trials: from h6 a bare rook holds the h-file and his only other square,
 *     g8, is on rank 8 — one walk along rank 7 covers it. A 2x2 room that
 *     touches a corner is a 3-square room, and 3 squares are two rook lines.
 *     Every finale room in the shipped build is a full 2x2 (or, on L10, a 2x2
 *     whose extra square is watched by his own jammed pawn).
 *   - SCARECROW IS A SECOND ANSWER ON THE AEGIS LEVEL (41%, kept). On L4 the
 *     straw blinds the plug's defender instead of tanking it: stand the
 *     straw, take the bishop, the jammed pawn never sees the rook that took
 *     it. It is a legitimate second line on a mid-run teaching level (the
 *     Slash reports the same for knight-hop on L3-L5), and it is exactly the
 *     blindfold L8 later demands — so it stays as foreshadowing.
 */

import { bishop, king, make, pawn, X, FLEE, STILL } from '../run-kit';
import type { RunDef } from '../run-kit';
import type { Coord } from '../types';

/**
 * The roof: ridge on rank 6 (c6-f6) minus the SKYLIGHT file (3-6, if any),
 * plus the two-deep eaves. Extra stones (loft walls, stoned launch squares)
 * go in `plus`.
 */
function ROOF(skylight: number | null = null, plus: Coord[] = []): Coord[] {
  const out: Coord[] = [X(1, 4), X(1, 5), X(2, 5), X(2, 6), X(7, 5), X(7, 6), X(8, 4), X(8, 5)];
  for (let f = 3; f <= 6; f++) {
    if (f === skylight) continue;
    out.push(X(f, 6));
  }
  for (const c of plus) out.push({ ...c });
  return out;
}

/** Same five ids every Revenge slate guarantees (runs.ts REVENGE_CORE). */
const REVENGE_CORE_27: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

const RUN_REVENGE_27: RunDef = {
  id: 'revenge-27',
  name: 'The Hayloft',
  blurb: 'A roof of stone. He runs from the straw, not from you.',
  allowedAbilities: ['scarecrow', 'knight-hop', 'aegis', 'hourglass'],
  // TIER CAP (2026-09-06). The header reports knight-hop:4 at 100/100/88/94;
  // re-measuring every tier found the break is EARLIER here than in The
  // Parapet, which caps the same card at T3. L7-L10, 32 trials, serial:
  // T1 0/0/0/0, T2 0/47/0/59, T3 0/100/0/69. knight-hop's uses are 1/1/1/2/1,
  // so T2 buys no second cast — it buys a second TURN as a knight, and one
  // extra knight turn inside an 18-square loft is a second jump onto his
  // room. Ceiling T1: in this run the hop is a one-shot key, which is exactly
  // what the four finale lines were written and measured against.
  abilityTierCaps: { 'knight-hop': 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_27,
  offerCoreMin: 2,
  levels: [
    // L1 — THE SKYLIGHT. Ridge stone d6 missing. Still king a8. Up the
    // d-file through the hole, along rank 8 (the c8 pawn walks to c7 and
    // jams on the ridge — free tempo either way).
    make(1, [pawn(3, 8), king(1, 8)], {
      ...STILL,
      moveLimit: 6,
      hazards: ROOF(4),
      kingPen: ['a8'],
    }),
    // L2 — THE OTHER SKYLIGHT. Hole at e6, still king h8 in the far corner.
    // A dark bishop hunts below (e6 is light: it can never use the hole).
    make(2, [bishop(3, 1), pawn(7, 8), king(8, 8)], {
      ...STILL,
      moveLimit: 7,
      hazards: ROOF(5),
      kingPen: ['h8'],
    }),
    // L3 — HE RUNS. First flee king: a8 in a two-square ROW (a8/b8). Hole
    // at d6. Climb, get onto rank 8: a rook on the eighth sees both his
    // squares, he has nowhere to step. Free — the lesson the finale inverts.
    make(3, [bishop(8, 2), king(1, 8)], {
      ...FLEE,
      moveLimit: 7,
      hazards: ROOF(4),
      kingPen: ['a8', 'b8'],
    }),
    // L4 — THE PLUG. Hole at d6 and a bishop stands in it, frozen in a knot:
    // c5/e5/c7 are stone, e7 holds a jammed pawn (e6 is ridge). The e7 pawn
    // defends d6 (pawns capture toward rank 1) and nothing from her side
    // ever reaches e7. He stands STILL on d8 with c8/e8 stone, so the only
    // line onto him is the d-file. Take the plug and the pawn takes her back
    // — unless the shield is up: AEGIS, then d6-d8. A light bishop hunts
    // below so the bot raises the shield reactively (Parapet L4 lesson).
    make(
      4,
      [bishop(4, 6), pawn(5, 7), bishop(2, 1), king(4, 8)],
      {
        ...STILL,
        moveLimit: 8,
        hazards: ROOF(4, [X(3, 5), X(5, 5), X(3, 7), X(3, 8), X(5, 8)]),
        kingPen: ['d8'],
      },
    ),
    // L5 — THE ROOM. Hole at e6, open. His room is the 2x2 g7/g8/h7/h8: a
    // rook sees one rank or one file of it and he steps to the other,
    // forever. Climb the e-file, hold rank 8, and stand a straw on rank 7:
    // he runs from the straw onto her rank. SCARECROW. Dark bishop below.
    make(5, [bishop(8, 2), king(8, 8)], {
      ...FLEE,
      moveLimit: 8,
      hazards: ROOF(5),
      kingPen: ['g7', 'h7', 'g8', 'h8'],
    }),
    // L6 — THE JUMP. No hole. Row room (a8/b8), so a rook on rank 8 owns it
    // — but nothing walks over the roof. Jump it: KNIGHT-HOP, alone.
    make(6, [bishop(6, 2), king(1, 8)], {
      ...FLEE,
      moveLimit: 8,
      hazards: ROOF(),
      kingPen: ['a8', 'b8'],
    }),
    // L7 — THE STEER. Centre room d7/d8/e7/e8, king d8. c5/e5 stone: no
    // door attacks d8. Land c7 or e7, straw ON his line, he flees onto hers.
    make(7, [bishop(2, 1), bishop(8, 2), king(4, 8)], {
      ...FLEE,
      moveLimit: 10,
      hazards: ROOF(null, [X(3, 5), X(5, 5)]),
      kingPen: ['d7', 'e7', 'd8', 'e8'],
    }),
    // L8 — THE BLINDFOLD. East room g7/g8/h7/h8, king g8. A jammed pawn on
    // f8 (f7 is stone) watches g7 — the one door that attacks him — and e8
    // is stone so nothing ever reaches that pawn. h6 is stone: no other door.
    // Hop f5-g7 with the straw up: the pawn cannot strike a hazard, he does
    // not see her, g7xg8. Without the straw the landing is death.
    make(8, [pawn(6, 8), bishop(2, 1), bishop(8, 2), king(7, 8)], {
      ...FLEE,
      moveLimit: 9,
      hazards: ROOF(null, [X(6, 7), X(5, 8), X(8, 6)]),
      kingPen: ['g7', 'h7', 'g8', 'h8'],
    }),
    // L9 — THE ONE SQUARE. West room, king a8, a6 and c5 stone. Doors c7
    // (d5) and d7 (e5) hold rank 7. Straw beside him on rank 8 sends him
    // down onto her rank; straw below him (a7) sends him to b8 and safety.
    // Two enemies a turn.
    make(9, [bishop(2, 1), bishop(8, 2), king(1, 8)], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 9,
      hazards: ROOF(null, [X(1, 6), X(3, 5)]),
      kingPen: ['a7', 'b7', 'a8', 'b8'],
    }),
    // L10 — THE STRUCK STRAW. West room a7/a8/b7/b8, king b8. A jammed pawn
    // on c8 (c7 is stone) watches b7 — the one door that attacks him (from
    // c5) — and d8/a6 are stone so nothing reaches that pawn and no other
    // door matters. TWO ENEMIES A TURN: a straw the hunters below can strike
    // is struck by the first action, and the second action plays against the
    // real board — the pawn eats her on b7. The straw must stand in the loft
    // where nothing can reach it (a7 or a8: he stands, b7xb8). Two bishops
    // hunt the c5 launch square.
    make(10, [pawn(3, 8), bishop(2, 1), bishop(8, 2), king(2, 8)], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 8,
      hazards: ROOF(null, [X(1, 6), X(3, 7), X(4, 8)]),
      kingPen: ['a7', 'b7', 'a8', 'b8'],
    }),
  ],
};

export { RUN_REVENGE_27 };
export default RUN_REVENGE_27;
