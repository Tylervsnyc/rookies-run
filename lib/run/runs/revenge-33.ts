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
 * L7-L10 — THE FINALE. Three holes every level: b7 and b5 sealed, d5 the one
 * with a line to it. The line is stone b7, stone b5, trap d5, stand on the
 * tunnel, and step down to rank 5 when he goes stiff. The four levels vary the
 * pressure on that line rather than the line itself, which is this run's
 * honest MISS against "One line, four times" (run-level-design.md):
 *   L7  THE FORK      the teaching finale, an empty board and 13 moves.
 *   L8  THE LONG WALK the same burrow with 13 moves and no help: the walk to
 *                     the tunnel is the whole margin.
 *   L9  THE STUMP     a stump pawn on h5 (h4 stone) sits on rank 5 east of the
 *                     re-aim square, so the rank she needs is shorter and the
 *                     approach has to come up a file west of it. 12 moves.
 *   L10 THE WARREN    two stumps on g5 and h5 close rank 5 down to d5-f5, TWO
 *                     enemies a turn, 13 moves.
 *
 * WHY THE SINGLES FAIL ON THE FINALE (kit-relative, measured below):
 *   none     no stand covers the chamber and a hole; the mouth would, and the
 *            knight owns it. Shuttle for ever.
 *   boulder  two stones, three holes. Whatever is left, its covering squares
 *            are stone or the mouth, so the shuttle just runs shorter.
 *   snare    one trap, and he takes the farthest calm door — always a SEALED
 *            hole. He is held where no rook line reaches, the hold runs out,
 *            and he walks.
 *   aegis    the mouth is worth one turn with a shield, and the mouth covers
 *            only d5; b7 and b5 are still open.
 *   magnet   nothing capturable on her lines, and the king is not pullable.
 *
 * MEASURED (Normal, T5 bot, kit at T1 unless a tier is pinned; 2026-09-06).
 * Every cell was taken with the run resolved through its own module (another
 * session was rewriting extra-runs.ts while this was measured, so the readings
 * were taken through scratch-level harness calls that import the run directly,
 * and the finale was re-read through the registered `revenge.ts matrix` once
 * the registration was stable — both agree).
 *   Direction pass (16 trials/cell, all ten levels):
 *   L      none   snare  boulder  aegis  magnet  |  snare+boulder
 *   1-2    100%    100%    100%    100%   100%   |   100%   (teaching, free)
 *   3        0%    100%    100%     94%     0%   |   100%   (SNARE key)
 *   4        0%      0%      0%     88%     0%   |     0%   (AEGIS key)
 *   5        0%      0%    100%      0%     0%   |   100%   (BOULDER key)
 *   6        0%      0%     81%      0%     0%   |    69%   (BOULDER key)
 *   FINALE, numbers of record (32 trials/cell, serial):
 *   7        0%      0%      0%      0%     0%   |    34%
 *   8        0%      0%      0%      0%     0%   |    19%
 *   9        0%      0%      0%      0%     0%   |    25%
 *   10       0%      0%      0%      0%     0%   |    25%
 *   (L9 and L10 re-read at 16 trials after the crushable stumps came out:
 *   every single card 0%, pair 25% and 6%.)
 *
 *   THE GATE, HALF MET. No-ability 0% and EVERY single card in the kit 0% on
 *   all four finale levels — the cleanest half of the contract this run could
 *   ask for, and it is structural rather than tuned: no square in the game
 *   covers the chamber and a hole at once. The MISS is the other half: the
 *   pair reads 19-34%, not the 60-80% the rubric asks. The winning line needs
 *   THREE casts in one plan (stone b7, stone b5, trap d5) and the MCTS bot
 *   chains three free casts only sometimes — the same wall the Alcove's
 *   "count the casts in that turn" dead end names, one cast worse. For a human
 *   the line is deterministic and legible; for the bot it is a lottery. Under
 *   the run-level-design rule that a level the bot cannot find is not
 *   shippable, this run is registered as an IDEA, not pushed to the playtest
 *   page, and the pair number is reported as a miss rather than tuned away.
 *
 *   TIER — and why this run carries a CAP. The gate is a COUNT: three holes,
 *   two stones. T3 Boulder is three stones a level and T5 is unlimited, and at
 *   boulder:5 the finale reads 88 / 94 / 100 / 100% for the stone ALONE; at
 *   boulder:3 it reads 13 / 38%. So `abilityTierCaps: { boulder: 2 }` — the
 *   highest tier that still hands out exactly two stones. At boulder:2 every
 *   finale level is 0%. snare:5, aegis:5 and magnet:5 all read 0/0/0/0.
 *
 *   FULL RUNS: not reported. The two 40-run passes taken during this session
 *   both rolled offers from the WHOLE ability pool rather than this kit (the
 *   run was transiently missing from extra-runs.ts while a parallel session
 *   rewrote that file, so `rollOffer` fell back to the default Revenge
 *   allowlist and the picks contain queen-pulse, knight-hop and dragon). The
 *   numbers those passes produced (32/40 and 40/40) describe a different kit
 *   and are deliberately NOT quoted as this run's ladder. Re-run
 *   `revenge.ts runs --run=revenge-33 --runs=40` now that the registration is
 *   committed alongside the file.
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
 *     never leave a pawn on the board.
 *   THE CLOCK IS NOT THE LIMITER HERE. L7's pair read 13% at 10 moves, 38% at
 *     13 and 31% at 16 — the plateau says the bot is limited by chaining three
 *     casts, not by the move budget. 13 is kept because it is where the plateau
 *     starts, not because it helps.
 *   THE A-FILE CUL-DE-SAC. The first shell sealed a5-a8 and b3, so a run that
 *     spawned Rookie on a1 had four legal squares and no exit: an instant loss
 *     in every loadout column, which read as difficulty and was a bug. Seal a
 *     hole with the two squares that matter (its rank and its file), never with
 *     a wall that also fences her start.
 */


import { bishop, king, knight, make, pawn } from '../run-kit';
import type { RunDef } from '../run-kit';
import type { Coord } from '../types';

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
      moveLimit: 9,
      hazards: S(...SHELL('d8'), 'd7', 'e5', 'f7'),
      kingPen: pen('c6', 'd5', ...TUNNEL),
    }),
    // L5 — THE SEALED HOLE. One hole again, but it is b5 — walled on its rank
    // (a5, c5) and its file (b4, b6), so no rook line will ever reach it. A
    // trap there holds him somewhere she can never go; one stone seals it and
    // he cannot move at all. KEY = boulder, and snare is the trap card.
    make(5, [N('e8'), B('h2'), K('c6')], {
      ...FLEE,
      moveLimit: 8,
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
    // the tunnel — so stone BOTH, trap d5, and he has one door left. He walks
    // in, goes stiff, and one step down to rank 5 takes him.
    make(7, [N('e8'), K('c6')], {
      ...FLEE,
      moveLimit: 13,
      hazards: S(...SHELL(), 'd7', 'e7'),
      kingPen: pen('c6', 'b7', 'b5', 'd5', ...TUNNEL),
    }),
    // L8 — THE LONG WALK. The same burrow with nothing on the board but the
    // boxed knight: no hunter, no stump, and thirteen moves for a line that
    // costs four. Everything spent finding the tunnel is gone from the clock.
    make(8, [N('e8'), K('c6')], {
      ...FLEE,
      moveLimit: 13,
      hazards: S(...SHELL(), 'd7', 'e7'),
      kingPen: pen('c6', 'b7', 'b5', 'd5', ...TUNNEL),
    }),
    // L9 — THE SHORT CLOCK. The same burrow with a move less than L7 and L8:
    // twelve moves for a line that costs four, so the walk to the tunnel and
    // the three casts have to overlap.
    make(9, [N('e8'), K('c6')], {
      ...FLEE,
      moveLimit: 12,
      hazards: S(...SHELL(), 'd7', 'e7'),
      kingPen: pen('c6', 'b7', 'b5', 'd5', ...TUNNEL),
    }),
    // L10 — THE WARREN. The burrow with TWO enemies a turn: the king's free
    // reaction still fires first, but the army acts twice, so every turn spent
    // walking instead of casting is a turn he gets for nothing.
    make(10, [N('e8'), K('c6')], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 13,
      hazards: S(...SHELL(), 'd7', 'e7'),
      kingPen: pen('c6', 'b7', 'b5', 'd5', ...TUNNEL),
    }),
  ],
};

export { RUN_REVENGE_33 };
export default RUN_REVENGE_33;
