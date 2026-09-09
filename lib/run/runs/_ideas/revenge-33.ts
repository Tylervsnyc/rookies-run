/**
 * revenge-33 — THE WARREN. Built 2026-09-06 for the signature pair
 * SNARE + BOULDER ("the boulder trick with the sign flipped",
 * docs/new-abilities-2026-09-06.md §2.1 — the pair that doc ranks first for
 * Snare, and the run it sketches). Kit = snare / boulder / aegis / magnet
 * (`allowedAbilities` IS the kit). Snare is a TESTING-stage ability, so this
 * run is /playtest-only, which is expected.
 * VERB: stone the holes you can never reach, trap the one you can, and let him
 * walk into it.
 *
 * WHY THIS PAIR. Tyler loves the boulder trick — a stone on his flight square
 * and take him, one turn deep, "really satisfying". Snare is that trick with
 * the sign flipped: instead of DELETING his flight square you let him take it
 * and keep him there. Each half is short alone. T1 Boulder is two stones, and
 * a burrow with three holes eats them both and still has a door. T1 Snare is
 * one trap, and he always runs to the FARTHEST safe square, which in this
 * burrow is always a hole no rook line will ever reach — the trap springs and
 * holds him somewhere she can never go. Together they are three removals in
 * the right order: two stones take the holes she cannot punish, and the only
 * door left is the trapped one.
 *
 * CONSTANT SIGNATURE — THE WARREN. His pen is a BURROW: a chamber with two or
 * three single-square bolt-holes hanging off it DIAGONALLY, cut out of solid
 * stone and reached by one straight TUNNEL along rank 6 — and the tunnel's
 * last square, the MOUTH, is watched by a BOXED KNIGHT that can neither move
 * nor be taken. Not a band (Moat), not columns (Colonnade), not a box (Vault /
 * Glasshouse), not offset bars (Switchback), not a hedge (Briar), not shafts
 * (Stacks), not one diagonal (Slash / Cliff), not an alley (Alley), not a
 * solid rank (Parapet), not a checker field (Lattice), not a diamond
 * (Millstone), not a slot (Alcove), not a ring (Keep). One question every
 * level: WHERE DOES HE RUN — and which of his holes can you actually reach.
 *
 * THE MECHANISM, read out of lib/run/pawn-ai.ts (kingFleeMove / kingReaction)
 * and lib/run/abilities.ts (springSnaresAt), and then verified square by square
 * with scratch/warren-probe.ts (every stand that attacks the chamber, and every
 * hole it covers):
 *   1. He flees only when her CURRENT form attacks his square, and only to an
 *      adjacent pen square her form does not attack. A rook's target and its
 *      DIAGONAL neighbours are never attacked together, so every bolt-hole is
 *      a diagonal step off the chamber.
 *   2. THE ONLY squares that attack the chamber AND one of its holes are the
 *      chamber's four orthogonal neighbours. Three of them (b6, c5, c7) are
 *      stone. The fourth is the MOUTH d6, and d6 is where the knight on e8
 *      bites. So no stand in the game ever covers the chamber and a hole at
 *      once, which is why a bare rook shuttles for ever and two stones are one
 *      short.
 *   3. THE KNIGHT IS THE RUN. On e8 its four jumps are c7 and g7 (stone) and
 *      d6 and f6 (inside the pen, and guards never enter a pen), so it has no
 *      legal move and never will; d8, f8 and e7 are stone and e6 is her own
 *      tunnel square, so no rook line can ever reach it either. A piece that
 *      cannot move cannot be baited and cannot spring a trap; a piece that
 *      cannot be captured is never a ladder. Every earlier build of this run
 *      died to a capturable guard (see DEAD ENDS).
 *   4. A snare springs on ARRIVAL and holds him `tier + 1` counts, and endTurn
 *      ticks one off at once: at T1 that is exactly ONE enemy turn in which he
 *      cannot flee. So she gets ONE move to get a line onto the trapped square
 *      and then the capture — which is why the trap only ever pays on d5, the
 *      one hole with an open line to it (rank 5, running east from the stand's
 *      own file). b7 and b5 are walled on their rank AND their file: a king
 *      held in one of those is a king held out of reach.
 *
 * KIT roles (KEY = the level's answer; TRAP = a dead card there):
 *   snare    KEY L3 (one hole, and it is the reachable one: trap it, he steps
 *            in). Half of L7-L10. TRAP L1-L2, L4 (nothing ever moves onto a
 *            trap: the plug is a stump and the knight is boxed), L5-L6 (his
 *            holes are the sealed ones).
 *   boulder  KEY L5 (one sealed hole, one stone) and L6 (two sealed holes, both
 *            charges). Half of L7-L10. TRAP L1-L4.
 *   aegis    KEY L4 (a stump plugs the tunnel and a boxed knight defends it:
 *            shield, take the plug, eat the reply, and the capture-stun is the
 *            kill). Honest second answer on L3, where the shield lets her stand
 *            ON the mouth for one turn and the mouth covers the single hole.
 *            Dead on the finale: the mouth covers d5 and never b7 or b5.
 *   magnet   KEY nowhere, by design — the trap card, and the one that looks
 *            right on L4 (pull the plug out of the tunnel). It is fatal there:
 *            a pull runs along her own rank and drops the plug BETWEEN her and
 *            the king, blocking the line it came from. The king cannot be
 *            pulled below T5, and nothing else ever stands on her lines.
 *
 * L7-L10 — THE FINALE (REBUILT 2026-09-07 — see WHY THE LINE WAS LONG).
 * Three holes every level, and the burrow is now CARVED OUT OF SOLID STONE:
 * every square that is not a hole, the chamber, the tunnel, the re-aim rank
 * or her corridor is stone. The line is stone the two he prefers, trap the
 * one with a line to it, walk to a stand, and step onto the re-aim square
 * when he goes stiff.
 *   L7  THE FORK      the teaching finale. Holes b7 / b5 sealed, d5 open;
 *                     h-file corridor, stand e6 or g6, kill along rank 5.
 *                     8 moves for a line that costs five.
 *   L8  THE ROOF      the reachable hole MOVES: d5 is stone, d7 is open, and
 *                     the kill runs along RANK 7. The sentry moves with it —
 *                     a knight on e8 would need e7 stone, which is the very
 *                     rank the kill uses, so the sentry is set into the stone
 *                     UNDER the tunnel at c4. Stand f6, step UP to f7.
 *                     6 moves.
 *   L9  THE WRONG DOOR  b5 is stone and d7 is open, so his three holes are
 *                     b7 (farthest) and the TWO near doors d7 and d5, which
 *                     are the same distance from every stand and which he
 *                     therefore picks between at random. Only d5 has a line
 *                     to it. The L7 habit — stone the two western holes — has
 *                     nothing to stone; one stone goes on the DECOY. 7 moves.
 *   L10 THE WARREN    one door and one re-aim square. f6 and g6 are stone,
 *                     so the only stand is e6 and the only rank-5 square she
 *                     can re-aim from is e5; the corridor is the f-file, and
 *                     f6 — the square a rook wants — is not there any more.
 *                     8 moves.
 *
 * WHY THE LINE WAS LONG, AND WHAT SHORTENED IT (2026-09-07). The old build
 * met the singles gate perfectly and read 34 / 19 / 22 / 16% for the pair:
 * the finale was UNBEATABLE rather than hard. The header blamed "the bot
 * chains three free casts only sometimes" and left it. That was the symptom.
 * The cause is in scripts/run-playtest/bots/mcts.ts and it is arithmetic:
 *   1. `perCand = floor(rolloutCount / candidates.length)` — ONE rollout
 *      budget (160 at T5) split across every legal candidate. Boulder and
 *      Snare each contribute one candidate PER EMPTY SQUARE, so on the old
 *      near-empty finale the two cards alone were ~90 of ~110 candidates and
 *      every candidate got perCand = 1. The bot was not searching, it was
 *      sampling once.
 *   2. `ROLLOUT_TOPK = 3` with a `fastScore` that is blind to a sealed hole:
 *      every stone drop on the board scores identically (same king distance,
 *      same material), separated only by `rng() * 3` jitter. So the chance
 *      the RIGHT square is one of the three the rollout will consider is
 *      ~3/N in the number of empty squares.
 * Carving the board to 13-17 empty squares attacks both terms at once, and
 * it costs the human nothing: three holes, two stones, one trap, exactly as
 * before. L7 went 34% -> 97% on that change alone, and the clock was then
 * used to bring each level back INTO the 60-80% band rather than past it.
 * Third change, from the L10 trace: `fastScore` pays +25 for a move that
 * attacks the king, so a stand square that is also a SENTRY'S kill square is
 * the top-scored move in every rollout and every rollout dies on it. L10 v1
 * put f6 (bitten by the e8 knight) one slide from her start and read 3% at 7
 * moves and 6% at 10 — not a clock problem, a poisoned rollout. Making f6
 * stone took the same level to 63% at 8 moves.
 * COROLLARY FOR EVERY FUTURE RUN: a wide-open board is not neutral ground
 * for a targeted card. It is a measurement instrument that has been turned
 * down. If a pair reads low and the line is short, count the empty squares
 * before you touch the clock.
 *
 * WHY THE SINGLES FAIL ON THE FINALE (kit-relative, measured below):
 *   none     no stand covers the chamber and a hole; the mouth (d6) would,
 *            and the sentry owns it. Shuttle for ever.
 *   boulder  two stones, three holes. Whatever is left, its covering squares
 *            are stone or the mouth, so the shuttle just runs shorter.
 *   snare    one trap, and he takes the farthest calm door — always a SEALED
 *            hole. He is held where no rook line reaches, the hold runs out,
 *            and he walks.
 *   aegis    the mouth is worth one turn with a shield, and the mouth covers
 *            only the near hole; the western pair is still open.
 *   magnet   nothing capturable on her lines, and the king is not pullable.
 *
 * MEASURED (Normal, T5 bot, kit at T1 unless a tier is pinned; 2026-09-07,
 * harness post-94482af with matrix-determinism-check.ts PASSING).
 *   L1-L6, 16 trials/cell (L4 and L5 re-read at 32 after their clocks were
 *   opened 9->12 and 8->11 to unblock the ladder; the keys are unmoved):
 *   L      none   snare  boulder  aegis  magnet  |  snare+boulder
 *   1-2    100%    100%    100%    100%   100%   |   100%   (teaching, free)
 *   3        0%    100%    100%     94%     0%   |   100%   (SNARE key)
 *   4        0%      0%      0%    100%     0%   |     0%   (AEGIS key)
 *   5        0%      0%    100%      0%     0%   |   100%   (BOULDER key)
 *   6        0%      0%     81%      0%     0%   |    69%   (BOULDER key)
 *   FINALE, numbers of record (32 trials/cell, --jobs=8):
 *   7        0%      0%      0%      0%     0%   |    69%
 *   8        0%      0%      0%      0%     0%   |    59%
 *   9        0%      0%      0%      0%     0%   |    69%
 *   10       0%      0%      0%      0%     0%   |    63%
 *   BEFORE the rebuild, same command, same day: 34 / 19 / 22 / 16%.
 *
 *   THE GATE IS MET. No-ability 0% and every single card in the kit 0% on all
 *   four finale levels — structural, not tuned: no square in the game covers
 *   the chamber and a hole at once, and two stones can never close three
 *   doors. The pair reads 59-69%, inside the 60-80% band the rubric asks for
 *   (59 is one trial under, well inside 32-trial noise).
 *
 *   TIER — the CAP is unchanged and now sharper. The gate is a COUNT: three
 *   holes, two stones. Measured on the rebuilt finale, L7-L10, 32 trials:
 *     boulder:2   0 /  0 /  0 /   0%   <- the cap
 *     boulder:3 100 / 94 /100 /  78%   <- three stones close three doors
 *     boulder:5 100 / 28 / 22 / 100%
 *     snare:5     0 /  0 /  0 /   0%
 *     aegis:5     0 /  0 /  0 /   0%
 *     magnet:5    0 /  0 /  0 /   0%
 *   So `abilityTierCaps: { boulder: 2 }` — the highest tier that still hands
 *   out exactly two stones. No other card in the kit needs a cap at any tier.
 *
 *   FULL RUNS (40, Normal, random picks from the run's own kit): 4/40 = 10%,
 *   the bottom of the 10-25% target. The filters are MID-run, not the finale:
 *   L4 38% (the aegis level — a random picker often does not hold it, and
 *   nothing else solves it) and L8 50%. Every finale level clears 100% in run
 *   context, as every combo run does: with the pair as half a 4-card kit and
 *   offers on L1/L3/L6/L9, a picker who reaches L7 is holding both halves and
 *   holding them upgraded. Picks over the 40 runs: boulder 37, aegis 34,
 *   snare 33, magnet 14.
 *
 * DEAD ENDS (all 2026-09-06, all measured, in the order they were found):
 *   THE CHAMBER IS A PLATFORM. The first build guarded the mouth with a pawn on
 *     c7. The moment he leaves the chamber she stands ON c6, takes c7 from
 *     underneath it, and the capture-stun plus the rank-7 line finishes him:
 *     no-ability read 88-100% on L6-L10. A guard on the chamber's roof is a
 *     ladder, exactly as the Alcove's crossfire dead end says.
 *   TWO PAWNS CANNOT GUARD EACH OTHER. Second build: wardens on d7 and e7, each
 *     covering the square from which the other could be approached. Pawns cover
 *     SQUARES, not each other — she slid up the open e-file and took e7 from
 *     e1 without ever standing on a covered square (L3 no-ability 88%). The
 *     cover of a guard is only worth what the FILE and RANK into it are worth.
 *   THE KNIGHT IS THE ANSWER, AND IT MUST BE BOXED ON BOTH COUNTS. A knight on
 *     e8 covers d6 whatever stands between; the run only works because e8's
 *     four jumps are stone or pen (it can never move, so it can never be baited
 *     off the mouth) AND d8/f8/e7 are stone (it can never be taken, so it is
 *     never a ladder). Leaving e7 open cost the whole gate once: she took the
 *     knight up the e-file and then owned the mouth (boulder alone 69-100%).
 *   THE BAIT THAT MADE A DOOR RISKY WAS ITSELF THE LADDER. A stump on e7, on
 *     her file and beside the door d7, does make the flee AI refuse d7 — and
 *     the square she captures it from is on the same rank as that door, so
 *     capturing it lands her attacking the door with a stun. Boulder alone read
 *     69-75% off that line. Any piece placed to steer him with the "risky" rule
 *     is by construction on a line into the square you are steering him away
 *     from.
 *   A STUMP BESIDE THE RE-AIM SQUARE IS A FREE STUN AT T2. L9 and L10 carried
 *     stump pawns on g5/h5 to shorten rank 5. T2 Boulder CRUSHES an enemy pawn,
 *     and the crush is credited to Rookie: boulder:2 read 100% on both levels
 *     purely for the stun it bought. In a run whose gate is a stone count,
 *     never leave a pawn on the board. (The rebuilt L10 wants the same closed
 *     rank and takes it in STONE, which is what the stumps were pretending to
 *     be. More generally: in this run no capturable body may stand anywhere,
 *     because ANY capture credited to Rookie stuns him, and a stunned king in
 *     his own chamber is taken from the tunnel in one move — every single card
 *     would read 100%.)
 *   ENEMIES-PER-TURN 2 IS A NO-OP WHEN THE ONLY GUARD IS BOXED. The old L10's
 *     capstone knob was `enemiesPerTurn: 2` on a board whose only piece besides
 *     the king is a sentry that can never move. Two actions for an army that
 *     has none is nothing. Removed; the capstone is the closed rank and the
 *     clock.
 *   THE CLOCK IS NOT THE LIMITER HERE — TRUE, AND IT WAS THE WRONG QUESTION.
 *     On the open-board build L7's pair read 13% at 10 moves, 38% at 13 and
 *     31% at 16: a plateau, correctly read as "not the clock". The conclusion
 *     drawn from it — "the bot cannot chain three casts, ship it as an idea" —
 *     was wrong. The bot could not chain three casts BECAUSE the open board
 *     gave it ~90 cast candidates to spend a 160-rollout budget on. On the
 *     carved board the same three casts land 69% and the clock became a real
 *     knob again: L7 reads 22% at 6 moves, 66% at 7, 69% at 8, 88% at 9 and
 *     97-100% at 10-13. A plateau in the clock does not mean the level is at
 *     its ceiling; it can mean the clock is not the variable that is binding.
 *   THE A-FILE CUL-DE-SAC. The first shell sealed a5-a8 and b3, so a run that
 *     spawned Rookie on a1 had four legal squares and no exit: an instant loss
 *     in every loadout column, which read as difficulty and was a bug. Seal a
 *     hole with the two squares that matter (its rank and its file), never with
 *     a wall that also fences her start.
 */


import { bishop, king, knight, make, pawn } from '../../run-kit';
import type { RunDef } from '../../run-kit';
import type { Coord } from '../../types';

/** 'a5' -> Coord. */
const sq = (s: string): Coord => ({ file: s.charCodeAt(0) - 96, rank: parseInt(s[1], 10) });
/** Mirror a square across the board's middle file (c6 <-> f6). */
const mir = (s: string): string => String.fromCharCode(97 + (7 - (s.charCodeAt(0) - 97))) + s[1];
const S = (...squares: string[]): Coord[] => squares.map(sq);
const SM = (...squares: string[]): Coord[] => squares.map((s) => sq(mir(s)));
const P = (s: string) => pawn(sq(s).file, sq(s).rank);
const PM = (s: string) => P(mir(s));
const B = (s: string) => bishop(sq(s).file, sq(s).rank);
const N = (s: string) => knight(sq(s).file, sq(s).rank);
const NM = (s: string) => N(mir(s));
const BM = (s: string) => B(mir(s));
const K = (s: string) => king(sq(s).file, sq(s).rank);
const KM = (s: string) => K(mir(s));
const pen = (...squares: string[]): string[] => squares;
const penM = (...squares: string[]): string[] => squares.map(mir);

const STILL = { winCondition: 'king' as const, kingBehavior: 'still' as const };
const FLEE = { winCondition: 'king' as const, kingBehavior: 'flee' as const };

/**
 * The stone shell of the right-handed burrow (chamber c6, tunnel d6-h6).
 * `open` lists shell squares to leave EMPTY on this level (a hole he can use,
 * or a square she needs).
 */
const SHELL = (...open: string[]): string[] =>
  [
    'a5', 'a7', 'b4', 'b6', 'b8',
    'c4', 'c5', 'c7', 'c8', 'd4', 'd8', 'f8', 'g7', 'g8',
  ].filter((s) => !open.includes(s));

/** The tunnel, always in the pen so no guard ever wanders onto it. */
const TUNNEL = ['d6', 'e6', 'f6', 'g6', 'h6'];

/**
 * THE SOLID BURROW (finale, 2026-09-07). L7-L10 are cut out of SOLID stone:
 * `CARVE` stones every square on the board except the ones listed. This is
 * not decoration — it is the fix that made the pair findable. The MCTS bot
 * splits ONE rollout budget across every legal candidate
 * (`perCand = floor(rolloutCount / candidates.length)`, bots/mcts.ts) and a
 * Boulder or Snare candidate exists for EVERY empty square, so on the old
 * open-board finale the two cards alone contributed ~90 of ~110 candidates
 * and every cell got perCand = 1. Carving the board down to ~16 empty squares
 * takes the candidate list to ~35 (perCand 4) and, because the rollout policy
 * keeps only the top THREE scored candidates and scores every stone drop
 * identically (fastScore is blind to a sealed hole), it also triples the
 * chance the RIGHT square is one of them. The human's problem is unchanged:
 * three holes, two stones, one trap.
 */
const ALL_SQUARES: string[] = (() => {
  const out: string[] = [];
  for (let f = 1; f <= 8; f++) for (let r = 1; r <= 8; r++) out.push(String.fromCharCode(96 + f) + r);
  return out;
})();
const CARVE = (...open: string[]): Coord[] =>
  ALL_SQUARES.filter((s) => !open.includes(s)).map(sq);

/** Same five ids every Revenge slate guarantees (runs.ts REVENGE_CORE). */
const REVENGE_CORE_WARREN: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

const RUN_REVENGE_33: RunDef = {
  id: 'revenge-33',
  name: 'The Warren',
  blurb: 'He dug the holes. Only one of them is yours.',
  allowedAbilities: ['snare', 'boulder', 'aegis', 'magnet'],
  // The gate is a COUNT: three holes, two stones. T3 Boulder is three stones a
  // level and T5 is unlimited, and at boulder:5 the finale reads 88-100% for
  // the stone alone (measured). Capped at the tier that still hands out two.
  abilityTierCaps: { boulder: 2 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_WARREN,
  offerCoreMin: 2,
  levels: [
    // L1 — THE BURROW. Still king in the chamber, the tunnel open. Come up a
    // file to rank 6 and slide west. The boxed knight on e8 is here from the
    // first level: it can never move (every square it jumps to is stone or
    // inside the pen) and can never be taken (d8, f8 stone, e7 walled), and it
    // covers d6 and f6 for the rest of the run.
    make(1, [N('e8'), K('c6')], {
      ...STILL,
      moveLimit: 6,
      hazards: S(...SHELL(), 'd7', 'e7'),
      kingPen: pen('c6', ...TUNNEL),
    }),
    // L2 — THE OTHER BURROW. The same warren mirrored onto the f-file. A dark
    // bishop hunts the mirrored tunnel's colour.
    make(2, [NM('e8'), BM('h2'), KM('c6')], {
      ...STILL,
      moveLimit: 7,
      hazards: SM(...SHELL(), 'd7', 'e7'),
      kingPen: penM('c6', ...TUNNEL),
    }),
    // L3 — HE RUNS. First flee king, and the burrow has ONE hole: d5, the only
    // one she can ever punish (rank 5 runs clear to it from the east). Trap it,
    // stand on the tunnel, he steps in and is held; one move down to rank 5,
    // take him. KEY = snare. Honest second answer: one stone also seals a
    // one-hole burrow, which is why the finale never has fewer than three.
    make(3, [N('e8'), K('c6')], {
      ...FLEE,
      moveLimit: 8,
      hazards: S(...SHELL(), 'd7', 'e7'),
      kingPen: pen('c6', 'd5', ...TUNNEL),
    }),
    // L4 — THE PLUG. A stump pawn on e6 blocks the tunnel (e5 is stone, so it
    // never advances) and a SECOND boxed knight on d8 defends it — also
    // immobile (b7 and e6 are pen, c6 is his king, f7 is stone) and also
    // untouchable. Take the plug from f6 and the knight takes her back: AEGIS,
    // and the capture-stun holds him while she slides down the tunnel. MAGNET
    // is the trap that looks right — a pull runs along her own rank and drops
    // the plug between her and the king, blocking the line it came from.
    make(4, [P('e6'), N('d8'), N('e8'), K('c6')], {
      ...FLEE,
      moveLimit: 12,
      hazards: S(...SHELL('d8'), 'd7', 'e5', 'f7'),
      kingPen: pen('c6', 'd5', ...TUNNEL),
    }),
    // L5 — THE SEALED HOLE. One hole again, but it is b5 — walled on its rank
    // (a5, c5) and its file (b4, b6), so no rook line will ever reach it. A
    // trap there holds him somewhere she can never go; one stone seals it and
    // he cannot move at all. KEY = boulder, and snare is the trap card.
    make(5, [N('e8'), B('h2'), K('c6')], {
      ...FLEE,
      moveLimit: 11,
      hazards: S(...SHELL(), 'd7', 'e7'),
      kingPen: pen('c6', 'b5', ...TUNNEL),
    }),
    // L6 — TWO SEALED HOLES. b7 and b5, both walled off from every rook line in
    // the game: two stones, and he is standing still in his own chamber.
    // KEY = boulder (both charges). One trap can only ever hold him in one of
    // them, and the other is still open.
    make(6, [N('e8'), K('c6')], {
      ...FLEE,
      moveLimit: 12,
      hazards: S(...SHELL(), 'd7', 'e7'),
      kingPen: pen('c6', 'b7', 'b5', ...TUNNEL),
    }),
    // L7 — THE FORK. Three holes: b7 and b5 sealed on both their lines, d5 the
    // one with a line to it. He prefers the sealed pair — they are farther from
    // the stand — so stone BOTH, trap d5, and he has one door left. He walks
    // in, goes stiff, and one step down to rank 5 takes him.
    // The burrow is CARVED out of solid stone: h6 is stone too, so the h-file
    // corridor stops on rank 5 and the walk to a stand costs THREE moves
    // (h1-h5, h5-e5/g5, up to e6/g6). That dogleg is deliberate: while no move
    // attacks the king, moves and casts score within a point of each other in
    // the rollout policy, so the three casts stay live; a one-move stand let
    // every rollout spend the position before the setup existed.
    make(7, [N('e8'), K('c6')], {
      ...FLEE,
      moveLimit: 8,
      hazards: CARVE(
        'c6', 'e8',
        'b7', 'b5', 'd5',
        'd6', 'e6', 'f6', 'g6',
        'e5', 'f5', 'g5', 'h5',
        'h1', 'h2', 'h3', 'h4',
      ),
      kingPen: pen('c6', 'b7', 'b5', 'd5', 'd6', 'e6', 'f6', 'g6'),
    }),
    // L8 — THE ROOF. The hole that has a line to it MOVES: d5 is stone and
    // d7 is open, so the kill runs along RANK 7 from the east instead of
    // rank 5 from the east, and the sentry has to move with it — a knight on
    // e8 would need e7 stone (its own ladder), which walls the very rank the
    // kill uses. So the sentry is set into the stone UNDER the tunnel at c4:
    // it covers d6 exactly as e8 did (a5/b6/d6/e5/e3/a3/b2/d2 are all stone
    // or pen, so it can never move; c3/c5/b4/d4 are stone, so it can never be
    // taken). Same three casts, a different room to aim at: stone b7 and b5,
    // trap d7, stand on f6, and step UP to f7 when he goes stiff.
    make(8, [N('c4'), K('c6')], {
      ...FLEE,
      moveLimit: 6,
      hazards: CARVE(
        'c6', 'c4',
        'b7', 'b5', 'd7',
        'd6', 'e6', 'f6', 'g6',
        'e7', 'f7', 'g7',
        'f5', 'g5',
        'h1', 'h2', 'h3', 'h4', 'h5',
      ),
      kingPen: pen('c6', 'b7', 'b5', 'd7', 'd6', 'e6', 'f6', 'g6'),
    }),
    // L9 — THE WRONG DOOR. b5 is stone and d7 is open, so the burrow's three
    // holes are b7 (sealed, farthest), d7 and d5 — and d7 and d5 are the same
    // distance from every stand, so he takes one of them at random. Only d5
    // has a line to it (rank 7 is stone at c7 and e7, and the d-file into d7
    // runs through d6, where the sentry bites), so the L7 habit — stone the
    // two western holes — has nothing to stone: b5 is already gone. The two
    // stones go on b7 and on the DECOY d7, and the trap goes on the near
    // hole. The level's question is which of the two doors beside him is the
    // one you can actually walk through.
    make(9, [N('e8'), K('c6')], {
      ...FLEE,
      moveLimit: 7,
      hazards: CARVE(
        'c6', 'e8',
        'b7', 'd7', 'd5',
        'd6', 'e6', 'f6', 'g6',
        'e5', 'f5', 'g5', 'h5',
        'h1', 'h2', 'h3', 'h4',
      ),
      kingPen: pen('c6', 'b7', 'd7', 'd5', 'd6', 'e6', 'f6', 'g6'),
    }),
    // L10 — THE WARREN. L7's three holes with the room to work taken away.
    // Rank 5 is stone from g5 east, so the re-aim square is e5 or f5 and
    // nothing else, and the corridor is the F-FILE — the file whose rank-6
    // square the sentry bites. One slide from her start puts her on f6 and
    // kills her, so the walk has to go round: f5, e5, e6, and only then the
    // stand. Seven moves for a line that costs five.
    // (The old build carried `enemiesPerTurn: 2` here. With a sentry that can
    // never move it bought the army nothing — a no-op dressed as a capstone.
    // The capstone is the clock and the closed rank.)
    make(10, [N('e8'), K('c6')], {
      ...FLEE,
      moveLimit: 8,
      hazards: CARVE(
        'c6', 'e8',
        'b7', 'b5', 'd5',
        'd6', 'e6',
        'e5', 'f5',
        'f1', 'f2', 'f3', 'f4',
      ),
      kingPen: pen('c6', 'b7', 'b5', 'd5', 'd6', 'e6'),
    }),
  ],
};

export { RUN_REVENGE_33 };
export default RUN_REVENGE_33;
