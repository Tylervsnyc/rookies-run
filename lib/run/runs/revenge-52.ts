/**
 * revenge-52 — THE COMB. Built 2026-09-09 for the signature pair
 * QUEEN PULSE + VANGUARD. Kit = queen-pulse / vanguard / aegis / decoy
 * (`allowedAbilities` IS the kit). All four cards are LIVE.
 *
 * CONCEPT (A): an unbuilt pair the discovery harness has already proved can
 * gate — `queen-pulse+vanguard` gates moat-L7-v5-s250 at 97% with a UNIQUE
 * answer under the kit [aegis vanguard queen-pulse sacrifice], where every
 * single card reads 0% (data/run-playtest/combo-library/queen-pulse+vanguard/).
 * It is the cleanest entry left in SYNERGY.md: the only unbuilt gating pair
 * whose level survives BOTH universal solvents — bishop-step 0% and knight-hop
 * 0% on it, with only become-king cracking it at 80%. VANGUARD is a two-home
 * socket (vanguard + swap, The Vault; freeze-ray + vanguard, The Glasshouse)
 * and in neither was its ONE distinguishing property — that the drop needs no
 * path but reaches only Chebyshev 2 — the point of the level. QUEEN PULSE has
 * been half of three (queen-pulse + smoke, The Turnstile; become-king +
 * queen-pulse, The Embrasure; convert + queen-pulse, The Stair) and in all
 * three it was a WEAPON. Here it is never a weapon. It is a ticket.
 *
 * THE VERB: GET CLOSE ENOUGH TO THROW. Not crossing a wall (The Moat), not
 * baiting hunters (The Alley), not a poison timer (The Switchback), not
 * blowing a hole (The Briar), not caging with his own guard (The Alcove), not
 * a double door (The Millstone), not a two-rook net (The Parapet), not buying
 * a body time (The Lattice), not moving the wall (The Quarry), not an undo
 * (The Dogleg), not a suicide capture (The Picket), not a lure (The Pinch),
 * not zugzwang (The Niche), not crowning him (The Coronation), not growing a
 * rook in a room with no door (The Murder Hole), not walking one of his own
 * men up (The Espalier). Every one of those is a story about a LINE. This run
 * is the only one in the catalogue about a RADIUS: the kill is always the same
 * two beats — put a knight beside him, move it onto him — and the whole level
 * is the question of where Rookie has to be STANDING for that throw to be
 * legal at all. She never touches him. Not once, on any of the ten levels.
 *
 * WHY THIS PAIR, read out of lib/run/abilities.ts:
 *   - VANGUARD (T1): one charge, a rainbow knight dropped on ANY free square
 *     within CHEBYSHEV 2 of Rookie (`vanguardRangeFor`), no path required, the
 *     drop a FREE action — so the drop and the knight's move happen in one
 *     turn, and a knight born a knight's move from the king kills him that
 *     turn. It is the only delivery in the game that ignores board geometry
 *     completely, and the only one leashed to a RADIUS rather than to a line
 *     or to Rookie's own square.
 *   - QUEEN PULSE (T1): one charge, ONE queen move, a free cast. It is the
 *     only card in the kit that moves Rookie on a diagonal, and because T1 is
 *     exactly one move it can be spent on transport OR on a capture, never on
 *     both. That single-move budget is what makes it a ticket and never a gun.
 *   - The two fillers are the catalogue's proven inert ones for these halves:
 *     `aegis+vanguard` (11 surviving levels, 0 gated), `aegis+queen-pulse`
 *     (12, 0), `decoy+vanguard` (12, 0), `decoy+queen-pulse` (11, 0) and
 *     `aegis+decoy` (17, 0) in SYNERGY.md's weak-partnership table. No
 *     universal solvent, no second summon, no rabies beside a summon.
 *
 * ── CONSTANT SIGNATURE — THE COMB ──────────────────────────────────────────
 * A comb is a spine with teeth and nothing else. Every level of this run draws
 * the same four things, and no other run has this silhouette (the catalogue is
 * bands, columns, boxes, hedges, shafts, diagonals, rings, roofs, stairs,
 * quarry faces, niches, burrows and an espalier — this is a solid RANK with
 * one hole in it and a diagonal ladder of islands leading up to the hole):
 *
 *   1. THE SPINE — rank 6 is stone on every file but one. Nothing crosses rank
 *      6 anywhere else, on any level, by any means but a knight's jump.
 *   2. THE PARTING — that one free square. From L3 on, the square directly
 *      above it is stone (THE TOOTH), so the parting is a dead end for
 *      anything that moves in straight lines: a rook that reaches it can go
 *      nowhere. The only ways out of the parting are its two DIAGONALS.
 *   3. THE RUNGS — the squares of the parting's two diagonals below the spine
 *      are empty but ISLANDS: all four orthogonal neighbours of each are
 *      stone, so no rook line ever reaches one. Each ladder touches her floor
 *      at exactly one square, THE FOOT — a2 in the west, h3 in the east. A
 *      rook on the floor can see a foot and nothing above it; a queen on a
 *      foot can see all the way through the parting and out the far side. Two
 *      ladders, not one, for the reason in DEAD END 1.
 *   4. THE POCKET AND THE PEG — past the spine the king sits in a cell whose
 *      every ORTHOGONAL and every DIAGONAL neighbour is stone, so no rook,
 *      bishop or queen line in the game ever touches his square. The only
 *      geometry left is a knight's, and exactly ONE of his four knight-squares
 *      is free: THE PEG. The peg is never within Chebyshev 2 of any square
 *      Rookie can reach without the pulse.
 *
 * So: the pulse is the only thing that gets her PAST the spine, the drop is
 * the only thing that gets a body ONTO the peg, and the peg is only ever in
 * range from a square the pulse put her on. Neither half is a weapon.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none      — the comb, drawn, irrelevant. He is on her side of it.
 *   L2  none      — the parting has no tooth and he stands in its file.
 *   L3  QUEEN PULSE KEY — the tooth is in; he stands ON the ladder's far end.
 *                   One queen move from the foot is the whole level.
 *   L4  VANGUARD KEY  — no diagonal reaches him, but her floor comes within
 *                   two of the parting, so the throw is legal from the ground.
 *   L5  AEGIS KEY  — the parting is plugged by a knight defended by TWO pawns;
 *                   take it and eat the recapture. (DECOY is a second answer:
 *                   a defender will eat a marked plug. Measured and accepted.)
 *   L6  VANGUARD KEY — the same throw as L4 told from the other side: his
 *                   pocket is at b8, the peg is d7 rather than the parting,
 *                   and her floor reaches rank 5 so the throw is legal from
 *                   the ground.
 *   L7-L10 the pair. Every other card 0%.
 *   AEGIS and DECOY are TRAPS on all four finales: neither crosses rank 6.
 *
 * ── THE FOUR FINALE LINES (as built) ───────────────────────────────────────
 * Every finale draws the parting at e6 with TWO ladders into it — the west
 * foot a2 (b3-c4-d5) and the east foot h3 (g4-f5) — because one ladder is not
 * findable (DEAD END 1). What differs is what is waiting on the far side.
 *
 *   L7  THE TWO WINDOWS. King f8, sealed on every line (e8/g8/f7 stone,
 *       e7/g7 stone). Both of his open knight-squares are on her side of him:
 *       d7 and the parting e6 itself. Come out west and the ray dies at e6
 *       (f7 is stone) — drop on d7 and hop d7-f8. Come out east and the ray
 *       runs on through to d7 — drop on e6 and hop e6-f8. EITHER window wins,
 *       and the two lines are mirror images of each other.
 *       DECISION: none. This is the level that teaches the idea, and it is
 *       built so that whichever end of the comb she starts nearest is right.
 *
 *   L8  THE WRONG WINDOW. The same two ladders, and now the king is at b8
 *       with exactly ONE peg — d7 — which is also where the east ladder puts
 *       her down. So the east window is a trap: ride it and she is standing on
 *       the only square the knight can use, in a pocket with no rook line out.
 *       The west window lands her at f7 (or at e6 if she stops short) and from
 *       either she throws BACK across the pocket onto d7. A knight of his on
 *       e1 contests the floor while she walks. `moveLimit: 7`.
 *       DECISION: which window — and the natural one is fatal.
 *
 *   L9  THE CORKED PARTING. A pinned pawn stands IN the parting (e5 below it
 *       and e7 above it are stone, so it can never march and nothing can shift
 *       it), and both ladders now END there: her queen move is a CAPTURE, not
 *       a ride. So the pulse is no longer transport, it is her one capture and
 *       the stun that comes with it — and she comes to rest on the square that
 *       was a peg in L7. The peg has moved: f7, the only knight-square of d8
 *       left open, one square from where she is standing. `moveLimit: 7`.
 *       DECISION: the pulse's job changes from transport to capture, and the
 *       peg moves off the parting.
 *
 *  L10  THE WATCHMEN. The cork is still in the parting, the peg is still f7,
 *       and the two things that are new are both on HER side of the comb: two
 *       knights on the floor, on c1 and f1, which are the only mobile enemies
 *       in the run (rank 2 is stone but for a2 and h2 and rank 3 but for b3
 *       and h3, so a knight on rank 1 jumps onto exactly the feet and the
 *       first rungs). They do not defend him. They stand on the ladder. And
 *       he has TWO rooms now — c8 as well as d8 — whose knight-squares are
 *       disjoint sets, so a line that loses tempo on the floor loses him for
 *       good. `moveLimit: 9`.
 *       DECISION: the approach is the puzzle. The pocket is L9's; the question
 *       is which foot is still open by the time she gets there, and the answer
 *       changes with where the knights jump.
 *
 * What each of L8-L10 adds that L7's solution does not cover: L8 makes the
 * EXIT a decision and punishes the natural one; L9 takes the free ride away
 * and moves the peg; L10 takes the floor away and puts a clock on the climb.
 *
 * ── MEASURED — 2026-09-09, difficulty=normal, `revenge.ts matrix` ──────────
 * Numbers of record: 32 trials, `--jobs=1`, the run's own 4-card kit.
 *
 *   L    none  queen-pulse  vanguard  aegis  decoy | queen-pulse+vanguard
 *   7      0%       0%         0%       0%     0%  |        81%
 *   8      0%       0%         0%       0%     0%  |        84%
 *   9      0%       0%         0%       0%     0%  |        69%
 *  10      0%       0%         0%       0%     0%  |        56%
 *
 * THE GATE IS MET AND IT IS CLEAN: 20 cells of zero for no-ability and every
 * single card, and the pair means 72.5%. The SPREAD is the point — 81 / 84 /
 * 69 / 56, four different numbers, where the runs Tyler called "too easy once
 * you get the idea" read 90-100 on all four. L10 is BELOW the 60-80 band at
 * 56% and it ships there on purpose: it is the only finale whose difficulty is
 * an approach rather than a geometry, and it is the one the bot misplays.
 *
 * TIER LADDER, L7-L10, 32 trials, one card pinned per invocation:
 *   vanguard     T1 0/0/0/0   T2 97/0/0/0   T3 100/88/100/100
 *   queen-pulse  T1 0/0/0/0   T2 0/0/0/0    T3 0/0/0/0   T5 0/0/0/0
 * `abilityTierCaps: { vanguard: 1 }`. The break is the DROP RADIUS, not a
 * second use: `vanguardRangeFor` is 2/3/4/4/5, the east foot h3 sits Chebyshev
 * 3 from the parting, and a T2 drop therefore throws a knight through the comb
 * from the floor with the pulse still in her hand. Queen Pulse is the opposite
 * case and needs no cap at any tier: no rank, file or diagonal on any finale
 * touches the king's square, so more queen moves buy her nothing at all.
 *
 * MID-RUN, 16-32 trials:
 *   L    none  queen-pulse  vanguard  aegis  decoy
 *   1    100%     100%        100%    100%   100%
 *   2    100%     100%        100%    100%   100%
 *   3      0%      50%          0%      0%     0%   (pulse KEY, clean, SOFT)
 *   4      0%       0%        100%      0%     0%   (vanguard KEY, clean)
 *   5      0%       0%         19%    100%   100%   (aegis KEY, decoy co-key)
 *   6      0%       0%         94%      0%     0%   (vanguard KEY, clean)
 * L1-L2 free bare, L3-L6 impossible bare. Two honest blemishes: L3 is the
 * run's soft level (50% for its own key, not the ~90% the contract asks —
 * DEAD END 2), and L5 has two answers rather than one. DECOY is never a clean
 * key anywhere in the run; it is a pure trap filler plus a co-answer on L5.
 *
 * FULL RUNS, 40 runs, T5, difficulty=normal:
 *   random picks from the whole kit    0/40 =  0%   (L3 25%, then L4 10%)
 *   `--pool=queen-pulse,vanguard`      2/40 =  5%   (L3 50%, L4 60%, L5 17%,
 *                                                    then L6-L10 100% each)
 * Both are far BELOW the Moat's 10-25% target rather than above it, and the
 * cause is not the finale — a player who arrives at L7 holding the pair clears
 * all four levels every time. It is L5. L5 is gated on AEGIS, four levels
 * before a finale that is gated on the other two cards, so the pair-only pool
 * walks into a wall it cannot pass and the random pool rarely holds the pulse
 * on L3. This is The Murder Hole's 0% with a different cause (there the
 * fillers were inert; here one of them is load-bearing on a level the finale
 * pair cannot solve). The cheap lever, if Tyler wants the ladder softer, is to
 * open a second answer on L5 for the pair; it is a one-level change and it
 * does not touch the gate.
 *
 * ── DEAD ENDS ──────────────────────────────────────────────────────────────
 *
 * 1. ONE LADDER IS UNFINDABLE; TWO LADDERS ARE 90 POINTS BETTER. The first
 *    build gave every finale a single ladder out of the west. Same pocket,
 *    same peg, same kit: the pair read 6-25% on L7 and 94% on L8, and the only
 *    structural difference between them was that L8 had a second foot in the
 *    east. Rebuilt with two ladders everywhere, L7 went 9% -> 100% with
 *    NOTHING else changed. The cause is `fastScore`: it scores
 *    `(8 - chebyshev(rookie, king)) * 3`, and the king is always on rank 8, so
 *    every square on rank 1 scores exactly the same. A one-foot level asks the
 *    bot to cross a flat plateau to a corner it has no reason to prefer, and
 *    while it wanders it spends the Vanguard — on rank 1, where the dropped
 *    knight then BLOCKS the corridor and ends the game on the spot (three
 *    traces in a row died that way). With a foot at each end of rank 1 there
 *    is a scoring square one move from wherever she starts.
 *    **Rule: a level whose key square is reachable only along a rank at the
 *    far edge of the board needs two of them, or the bot never arrives.**
 *
 * 2. THE BOT STOPS AT THE PARTING, SO THE PARTING MUST NEVER BE THE ONLY PEG.
 *    The first L7 put the king at d8 with its one open knight-square at e6 —
 *    the parting itself — and asked her to ride PAST it to f7 and throw back.
 *    It read 6%. Every trace that got through the comb at all stopped ON e6:
 *    it is the nearest square to the king that the ride passes, so it is the
 *    highest-scoring square on the ladder, and a Rookie standing on the peg
 *    has nowhere to put the knight. The fix is not to make her ride further,
 *    it is to make the square she wants to stop on the RIGHT one — give the
 *    pocket a second open knight-square (L7, L9) or land the ride one square
 *    past it (L8). **Where a summon must go, assume the bot will be standing.**
 *
 * 3. A GUARD ON THE PEG CANNOT BE MADE TO WORK IN THIS SIGNATURE. The designed
 *    L10 was an arithmetic problem: cork the parting, garrison the peg, and
 *    make the answer two captures whose stuns have to land back to back. It
 *    could not be built. The knight has to take the guard from a knight-square
 *    of the peg, every such square within Chebyshev 2 of the landing (e5, g5,
 *    c5) is ALSO within two of a foot or a knight's move from a rung, and a
 *    knight dropped there wins the level with no pulse at all: measured
 *    vanguard-alone 100% on the first L10 build. The ladder's rungs are
 *    diagonal neighbours of the parting, so they are always a knight's move
 *    from the squares that attack the pocket — the geometry that makes the
 *    pair necessary is the same geometry that makes a guarded peg leak.
 *    L10 became THE WATCHMEN instead: the difficulty moved from the pocket to
 *    the floor, which is the only part of this board an enemy can move on.
 *
 * 4. THE CLOCK IS THE ONLY KNOB THAT WORKED ON THE PAIR, AND IT WORKS. Unlike
 *    The Murder Hole (where L10 read 91% at two different move limits), every
 *    finale here moved with `moveLimit`: L7 100% -> 81% at 9 -> 7, L8 94% ->
 *    84% at 8 -> 7, L9 94% -> 69% at 9 -> 7. The reason is DEAD END 1 in
 *    reverse — the approach is a real part of the solution here, so cutting
 *    moves cuts the wandering the bot needs, and the level stays winnable for
 *    a player who knows where the foot is.
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

/**
 * THE CARVE. Every square on rank `r` is stone EXCEPT the named ones. The
 * whole run is authored this way — solid stone with holes bored in it — which
 * is what keeps the empty-square count near 15 on the finales (the Warren
 * rule: Vanguard targets EMPTY SQUARES, so an open board is unmeasurable).
 */
const rank = (r: number, ...free: string[]): Coord[] => {
  const keep = new Set(free);
  const out: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    const name = `${String.fromCharCode(96 + f)}${r}`;
    if (!keep.has(name)) out.push(X(f, r));
  }
  return out;
};

export const RUN_REVENGE_52: RunDef = {
  id: 'revenge-52',
  name: 'The Comb',
  blurb:
    'One rank of solid stone with a single square missing, and a ladder of islands leading up to it that only a diagonal can climb. His room on the far side has no line into it at all — not a rank, not a file, not a diagonal. Only a knight can stand beside him, and a knight has to be THROWN. The whole run is one question: where do you have to be standing to make the throw?',
  allowedAbilities: ['queen-pulse', 'vanguard', 'aegis', 'decoy'],
  // Measured L7-L10, 32 trials, one card pinned per invocation:
  //   vanguard    T1 0/0/0/0   T2 97/0/0/0   T3 100/88/100/100
  //   queen-pulse T1 0/0/0/0   T2 0/0/0/0    T3 0/0/0/0   T5 0/0/0/0
  // The break is the tier that widens the DROP RADIUS (vanguardRangeFor:
  // 2/3/4/4/5), and it is a property of this geometry: the east foot h3 is
  // Chebyshev 3 from the parting e6, so a T2 Vanguard throws a knight through
  // the comb from the floor and never needs the pulse at all. T3 (range 4)
  // reaches every peg in the run from a foot. The highest tier at which every
  // single kit card still reads <= 8% is 1.
  //   Queen Pulse needs no cap and cannot have one that matters: no rank, file
  // or diagonal on any finale touches the king's square, so extra queen moves
  // buy her nothing at any tier — 0% at T1, T2, T3 and T5.
  abilityTierCaps: { vanguard: 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // ── L1 — THE COMB. The silhouette, drawn, and completely beside the
    // point: he is standing on her side of it with the whole floor open.
    make(1, [king(3, 3), pawn(6, 2)], {
      ...STILL,
      moveLimit: 12,
      hazards: [...rank(6, 'e6'), ...rank(7, 'f7'), ...rank(8, 'g8')],
    }),
    // ── L2 — THE DOOR. He steps over the spine, and the parting is a doorway
    // because nothing stands above it: e6 open, e7 open, him on e8. Walk the
    // e-file. A knight on e4 costs her a move or a capture.
    make(2, [king(5, 8), knight(5, 4)], {
      ...FLEE,
      moveLimit: 14,
      kingPen: ['e8'],
      hazards: [
        ...rank(6, 'e6'),
        ...rank(7, 'e7'),
        ...rank(8, 'e8'),
      ],
    }),
    // ── L3 — THE THREAD (queen-pulse KEY). The tooth is in place from here
    // on: e7 is stone, so the parting is a dead end for a rook. The ladder is
    // a2-b3-c4-d5-e6 and it comes out at f7 — and he is standing on g8, one
    // square further along the same diagonal. ONE queen move from the foot is
    // the entire level. Nothing else in the kit crosses rank 6: the drop
    // reaches two squares and the foot is four from the parting.
    make(3, [king(7, 8)], {
      ...FLEE,
      moveLimit: 14,
      kingPen: ['g8'],
      hazards: [
        ...rank(1, 'a1', 'b1', 'c1'),
        ...rank(2, 'a2'),
        ...rank(3, 'b3'),
        ...rank(4, 'c4'),
        ...rank(5, 'd5'),
        ...rank(6, 'e6'),
        ...rank(7, 'f7'),
        ...rank(8, 'g8'),
      ],
    }),
    // ── L4 — THE THROW (vanguard KEY). His cell at d8 is sealed on every
    // line: c8/e8/d7 stone, c7/e7 stone. No diagonal on the board touches it,
    // so the pulse has nothing to do. But her floor runs all the way up to
    // rank 4 here, and the parting e6 — a knight's move from d8 — is exactly
    // two squares from e4. Stand under the spine and throw.
    make(4, [king(4, 8), knight(7, 3), pawn(2, 4)], {
      ...FLEE,
      moveLimit: 12,
      kingPen: ['d8'],
      hazards: [
        ...rank(5, 'd5', 'e5', 'f5'),
        ...rank(6, 'e6'),
        ...rank(7),
        ...rank(8, 'd8'),
      ],
    }),
    // ── L5 — THE PLUG (aegis KEY). No tooth: e7 is open and he is on e8, so
    // the e-file is a road — except that a knight of his is parked in the
    // parting and a pawn on f7 defends it. Take the plug and the pawn takes
    // you; take it behind the shield and you walk up over its body. Every
    // knight-square of e6 is stone, so nothing can be thrown at the plug.
    make(5, [king(5, 8), knight(5, 6), pawn(6, 7), pawn(4, 7)], {
      ...FLEE,
      moveLimit: 12,
      kingPen: ['e8'],
      hazards: [
        ...rank(4, 'a4', 'b4', 'c4', 'e4', 'h4'),
        ...rank(5, 'a5', 'e5', 'h5'),
        ...rank(6, 'e6'),
        ...rank(7, 'd7', 'e7', 'f7'),
        ...rank(8, 'e8'),
      ],
    }),
    // ── L6 — THE MARK (decoy KEY). He comes back down to her side of the comb
    // with a two-square pen, b2/b3, and a lone rook can never close a
    // two-square pen: she holds one line, he steps to the other, forever. His
    // bishop on d4 is the answer — mark it and his own knight eats it, the
    // capture is credited to her, and a stunned king cannot step.
    make(6, [king(2, 8), knight(7, 3)], {
      ...FLEE,
      moveLimit: 12,
      kingPen: ['b8'],
      hazards: [
        ...rank(5, 'c5', 'd5', 'e5'),
        ...rank(6, 'e6'),
        ...rank(7, 'd7'),
        ...rank(8, 'b8'),
      ],
    }),
    // ══ L7 — THE EYE ═══════════════════════════════════════════════════════
    // The run's plain statement, and the shape every finale is a variation of.
    //   THE SPINE     rank 6, stone but for e6.
    //   THE TOOTH     e7.
    //   THE LADDER    a2 (foot) - b3 - c4 - d5 - e6, every rung an island.
    //   THE LANDING   f7, the far side of the parting. A rook there is dead:
    //                 e7 and g7 stone, f8 stone, f6 spine.
    //   THE POCKET    d8. c8/e8/d7 stone (orthogonals), c7/e7 stone
    //                 (diagonals). No line in the game touches him.
    //   THE PEG       e6, the parting itself — the only free knight-square of
    //                 d8 (b7, c6 and f7's partner are stone). It is FOUR from
    //                 the foot and five from her floor, so at T1 (range 2) it
    //                 can only be thrown at from the landing.
    // Ride the ladder to f7; next turn drop on e6 and hop e6-d8.
    make(7, [king(6, 8)], {
      ...FLEE,
      moveLimit: 7,
      kingPen: ['f8'],
      hazards: [
        ...rank(2, 'a2', 'h2'),
        ...rank(3, 'b3', 'h3'),
        ...rank(4, 'c4', 'g4'),
        ...rank(5, 'd5', 'f5'),
        ...rank(6, 'e6'),
        ...rank(7, 'd7'),
        ...rank(8, 'f8'),
      ],
    }),
    // ══ L8 — THE WRONG WINDOW ══════════════════════════════════════════════
    // Two ladders into the same parting: a2-b3-c4-d5-e6 out of the west, and
    // h3-g4-f5-e6 out of the east. They leave the spine on OPPOSITE sides —
    // the west ladder carries her through to f7, the east one to d7. He is at
    // b8 now, sealed (a8/c8/b7 orthogonal, a7/c7 diagonal), and his only free
    // knight-square is d7. So the window she has to come out of is the far
    // one: land on f7 and throw back across the pocket onto d7. Come out at
    // d7 and she is standing on the peg herself with the knight still in hand.
    make(8, [king(2, 8), knight(5, 1)], {
      ...FLEE,
      moveLimit: 7,
      kingPen: ['b8'],
      hazards: [
        ...rank(2, 'a2', 'h2'),
        ...rank(3, 'b3', 'h3'),
        ...rank(4, 'c4', 'g4'),
        ...rank(5, 'd5', 'f5'),
        ...rank(6, 'e6'),
        ...rank(7, 'd7', 'f7'),
        ...rank(8, 'b8'),
      ],
    }),
    // ══ L9 — THE CORKED PARTING ════════════════════════════════════════════
    // A pawn of his stands in the parting, pinned there (e7 above it is the
    // tooth, so it can never march). The ladder no longer runs THROUGH the
    // spine: her queen move ends on e6 as a capture. So the pulse is not a
    // ride any more, it is her one capture — and she comes to rest on the
    // square that was the peg in L7. The peg has moved: f7, the only other
    // knight-square of d8 left open, one square from where she is standing.
    make(9, [king(4, 8), pawn(5, 6)], {
      ...FLEE,
      moveLimit: 7,
      kingPen: ['d8'],
      hazards: [
        ...rank(2, 'a2', 'h2'),
        ...rank(3, 'b3', 'h3'),
        ...rank(4, 'c4', 'g4'),
        ...rank(5, 'd5', 'f5'),
        ...rank(6, 'e6'),
        ...rank(7, 'f7'),
        ...rank(8, 'd8'),
      ],
    }),
    // ══ L10 — THE VACATED PEG ══════════════════════════════════════════════
    // The parting is corked as in L9, and this time the peg is OCCUPIED: a
    // knight of his stands on f7, the only knight-square of d8 left open. So
    // on the turn she arrives there is nowhere to throw — and the trap card
    // in the position is his own guard, because that knight is the one enemy
    // in the run that can move. Its only legal square is g5 (d6, e5, h6 and
    // h8 are stone and d8 is its own king), and g5 is a knight's move from
    // e6, so the moment she lands on the cork it comes off the peg to hunt
    // her. It cannot take her the turn it moves. It takes her the turn after.
    //   So the line is: ride the ladder into the cork (a capture — the stun
    // that buys the first phase), let the guard vacate the peg, and on that
    // ONE turn drop on f7 and hop f7-d8. Early is nothing (the peg is full),
    // late is death (g5 covers e6). The window is exactly one move wide.
    make(
      10,
      [king(4, 8), pawn(5, 6), knight(3, 1), knight(6, 1)],
      {
        ...FLEE,
        moveLimit: 9,
        kingPen: ['c8', 'd8'],
        hazards: [
          ...rank(2, 'a2', 'h2'),
          ...rank(3, 'b3', 'h3'),
          ...rank(4, 'c4', 'g4'),
          ...rank(5, 'd5', 'f5'),
          ...rank(6, 'e6'),
          ...rank(7, 'f7'),
          ...rank(8, 'c8', 'd8'),
        ],
      },
    ),
  ],
};

export default RUN_REVENGE_52;
