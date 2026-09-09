/**
 * revenge-22 — THE MILLSTONE. Built 2026-09-05 around the pair
 * DRAGON + DUCHESS. Nobody predicted it: the discovery harness found it
 * gating The Moat L6 at 73% (data/run-playtest/combo-library/dragon+duchess/)
 * under a kit where neither summon read above 0% alone, and
 * pair-hypotheses.json lists "any two summons" as an anti-pair because only
 * one body moves per turn. This run is a deliberate test of that claim.
 *
 * WHAT THE MOAT ACTUALLY SHOWED (traced, not guessed). The 73% was two
 * things: a 2x2 corner pen that ONE queen locks from g7 (a single-body lock
 * the singles bot simply did not find), plus a coin-flip DECOY — enemies
 * capture allies at Rookie's own value, one action a turn, so with two
 * queen-tier bodies on the board the knight ate the Duchess and the Dragon
 * finished. Neither is "two summons cover the king together".
 *
 * THE MECHANISM THIS RUN IS BUILT ON — THE DOUBLE DOOR. Read out of
 * lib/run/pawn-ai.ts: the ONLY thing a controlled summon does that Rookie
 * cannot is take a square she has no line to, and the only thing that
 * stops a body finishing alone is being taken the turn it arrives. So: the
 * king's wheel is two squares. He stands on one; his own PAWN stands in the
 * other (his door), jammed by the stone under it. Nothing attacks his square
 * except a body standing in that door. A body takes the door pawn — he is
 * boxed, it is beside him — and the pawn on the top rank behind the door
 * steps down and takes the body, and the door is plugged again. ONE body
 * opens the door exactly once. The SECOND body takes the pawn that
 * re-plugged it, and this time nothing answers: it takes him. The second
 * summon is worth a card precisely because the first one dies doing the
 * same job. The Dragon and the Duchess are interchangeable here (both come
 * down the same diagonal as queens; the knight jumps that would let a Dragon
 * reach the watcher pawn or the door from a jump square are bricked, the
 * Vault lesson). Two summons are not useless; they are one summon that
 * gets to try twice.
 *
 * THE NET THAT DID NOT SHIP. The first finale was the pure two-body cover
 * (a whole four-square wheel; one queen on the ring covers the two squares
 * beside her and he steps to the fourth, two queens leave him nothing).
 * It is real — hand-played it wins in 4 moves, the brute-force cover
 * analysis shows no single-body lock on the whole wheel — but the MCTS bot
 * read the pair at 0/16 on every build: the payoff needs TWO ally moves
 * with no Rookie progress between them, and the rollout policy (top-3 by a
 * Rookie-centric fastScore) never puts an ally slide in the top 3 while a
 * Rookie step toward the king exists. Any line that reaches a ring square
 * in one move from a spawn square is also a one-move kill for a single body
 * (spawn is free; the summon moves the same turn), so the net cannot be
 * shortened. Provable-but-unfindable is not shippable (rubric); the double
 * door is the same "second body" idea reduced to captures the bot likes.
 *
 * CONSTANT SIGNATURE — THE MILLSTONE. Every level the king lives on a
 * DIAMOND of four squares around one stone pillar (his millstone), with the
 * four corners of that 3x3 bricked and the orthogonal approaches walled, so
 * no rook line ever enters the ring. Not a band (Moat), not columns
 * (Colonnade), not a sealed box (Vault), not offset bars (Switchback), not a
 * hedge (Briar), not a glass box (Glasshouse), not stacks (Stacks): a wheel
 * he lives on. L1-L3 the wheel has a door and he stands still: walk in. L4
 * the door is guarded by something she cannot take. L5 the last window is a
 * long diagonal only a body can look down. L6 he RUNS on a broken wheel and
 * one Dragon jumped onto its middle pins him. L7-L10 the wheel is two
 * squares, his own pawn is his door, and a second pawn re-plugs it.
 *
 * KIT = dragon / duchess / magnet / aegis (`allowedAbilities` IS the kit).
 *   dragon    KEY on L5 (any body down the window line), the ONLY key on L6
 *             (only a knight jump reaches the middle of the broken wheel),
 *             half the double door on L7-L10. TRAP on L1-L3; on L4 a body can
 *             trade itself for the warden (secondary).
 *   duchess   KEY on L5, half the double door on L7-L10. TRAP on L6 (every
 *             window bricked; she cannot jump) and on L1-L3.
 *   aegis     KEY on L4: the door pawn is defended by a bishop pocketed in
 *             the wheel's own corner (f8) that no line reaches — take the
 *             pawn anyway and eat the reply. TRAP on the finale: nothing
 *             there captures Rookie; a shield does not open a door. (T5 Aegis
 *             kills its attacker but never stuns the king.)
 *   magnet    KEY nowhere. On L4 the pull is legal (come along rank 7 and
 *             drag the plug off its defended square) but the bot never plays
 *             it — 0% — and on the finale the plug is never on her line.
 * No universal solvents; no rabies-dart; no freeze/smoke/rewind/poison/
 * boulder/decoy/convert/twin/page/sacrifice/swap (each either stops the king
 * for free or is a third body — a second answer).
 *
 * L7-L10 intended lines (all the same line, rising pressure):
 *   L7  THE DOUBLE DOOR — east wheel: king g6, door f7 (pawn), watcher e8,
 *       line a2-g8 through the window e6. Rookie to e4 (the unique closest
 *       square), Duchess on d5, xf7; e8xf7; Dragon on d5, xf7; xg6. Eight
 *       moves, nothing hunting.
 *   L8  THE WEST DOOR — the mirror (king b6, door c7, watcher d8, line h2-b8
 *       through d6, staging d4) with a knight on the floor.
 *   L9  THE HUB — the wheel in the middle (king e6, door f7, watcher g8),
 *       the line is the far end of the anti-diagonal h5-g6, staging g4; two
 *       enemies a turn, a bishop and a knight.
 *   L10 THE MILLSTONE — the west door, two a turn, two knights from opposite
 *       corners, twelve moves.
 *
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
 * FINALE, numbers of record. `revenge.ts matrix --run=revenge-22 --levels=7,8,9,10
 * --loadouts=<none + kit + pair> --trials=32 --jobs=8`, T1 cards, Normal:
 *    L     none    aegis   dragon  duchess   magnet  |  dragon+duchess
 *    7       0%       0%       0%       0%       0%  |  78%
 *    8       0%       0%       0%       0%       0%  |  81%
 *    9       0%       0%       0%       0%       0%  |  84%
 *   10       0%       0%       0%       0%       0%  |  72%
 * GATE HOLDS: no card in the kit clears a finale level alone (worst single cell 0%); the pair reads 78/81/84/72.
 * The header below reads 81/88/84/72 for the pair and is CONFIRMED (max drift 7 points,
 * inside 32-trial binomial noise) — but it was taken with the flawed method, so these
 * are the numbers of record.
 * ──
 * MEASURED (Normal, T5 bot, abilities at T1 as the harness deals them,
 * --jobs=1 SERIAL; finale 32 trials/cell, L1-L6 16; 2026-09-05):
 *   L      none  dragon  duchess  magnet  aegis  |  dragon+duchess
 *   1-3    100%   100%    100%     100%   100%   |   100%   (teaching)
 *   4        0%    69%     38%       0%   100%   |    94%   (aegis key)
 *   5        0%   100%    100%       0%     0%   |   100%   (a body's key)
 *   6        0%   100%      0%       0%     0%   |   100%   (dragon key)
 *   7        0%     0%      0%       0%     0%   |    81%
 *   8        0%     0%      0%       0%     0%   |    88%
 *   9        0%     0%      0%       0%     0%   |    84%
 *   10       0%     0%      0%       0%     0%   |    72%
 * FULL RUNS (40 each, Normal, serial): 7/40 = 18% clear with RANDOM offer
 * picks (the L4 warden and the L10 clock are where random kits die), 18/40 =
 * 45% with the pool pinned to dragon+duchess. Random is BELOW the pair pool
 * here (unlike the Vault/Glasshouse) because a 4-card kit with offers on
 * L1/L3/L6/L9 still leaves a random picker holding only one summon by L7
 * about half the time. TIER CAVEAT (upgraded summons change behaviour): at
 * 2 charges (Dragon T5, Duchess T4+) one card can trade twice by itself and
 * the finale gate falls; at T1-T3 every summon has one body per level and
 * the gate holds. The runs mode above already includes upgrades and reads
 * 45% with the pair pool, so the caveat is real but not dominant.
 * BOT NOTE: the bot handles two bodies badly in exactly one way — it will
 * never play an ally move whose payoff is another ally move; it plays ally
 * captures and ally moves whose next move wins. Design for that.
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

const FILES = 'abcdefgh';
const nameOf = (f: number, r: number): string => `${FILES[f - 1]}${r}`;
const inBounds = (f: number, r: number): boolean => f >= 1 && f <= 8 && r >= 1 && r <= 8;

/**
 * The millstone at (f, r): the core pillar, the four bricked corners of its
 * 3x3, and the four walls two squares out orthogonally (the squares from
 * which a rook could look straight at a ring square). `doors` names stones
 * to leave out; `plus` adds stones (bricked windows, sealed jump squares,
 * a bricked ring square).
 */
function MILL(
  f: number,
  r: number,
  opts: { doors?: string[]; plus?: Coord[] } = {},
): Coord[] {
  const doors = new Set(opts.doors ?? []);
  const raw: Array<[number, number]> = [
    [f, r],
    [f - 1, r - 1], [f + 1, r - 1], [f - 1, r + 1], [f + 1, r + 1],
    [f - 2, r], [f + 2, r], [f, r - 2], [f, r + 2],
  ];
  const out: Coord[] = [];
  for (const [ff, rr] of raw) {
    if (!inBounds(ff, rr)) continue;
    if (doors.has(nameOf(ff, rr))) continue;
    out.push({ file: ff, rank: rr });
  }
  for (const c of opts.plus ?? []) {
    if (!inBounds(c.file, c.rank)) continue;
    if (!out.some((o) => o.file === c.file && o.rank === c.rank)) out.push({ ...c });
  }
  return out;
}

/** The ring: the four squares around the core, as pen names. */
function RING(f: number, r: number, minus: string[] = []): string[] {
  const out: string[] = [];
  for (const [ff, rr] of [[f, r - 1], [f - 1, r], [f + 1, r], [f, r + 1]] as const) {
    if (!inBounds(ff, rr)) continue;
    const n = nameOf(ff, rr);
    if (minus.includes(n)) continue;
    out.push(n);
  }
  return out;
}


/**
 * The finale wheels — THE DOUBLE DOOR. Every ring square but two is stone;
 * the king stands on one, his own pawn stands in the other (his door), and a
 * second pawn on the top rank, jammed and pocketed, watches the door square.
 * Every window and jump onto the KING's square is stone, so the only way to
 * attack him is to stand in his door — and the only way into the door is to
 * take the pawn in it, which the pawn behind it answers by stepping in.
 *   EAST (core g7): king g6, door f7, watcher e8, line a2-g8 through e6.
 *   WEST (core b7): the mirror — king b6, door c7, watcher d8, line h2-b8
 *   through d6.
 *   HUB (core e7): king e6, door f7, watcher g8, line h5-g6 (the far end of
 *   the anti-diagonal; e8/d7 stone).
 */
const EAST_LOCK: ReadonlyArray<Coord> = MILL(7, 7, {
  plus: [X(8, 7), X(7, 8), X(6, 5), X(8, 5), X(5, 5), X(6, 4), X(8, 4), X(7, 4), X(4, 7), X(4, 8), X(4, 6), X(3, 7)],
});
const WEST_LOCK: ReadonlyArray<Coord> = MILL(2, 7, {
  plus: [X(1, 7), X(2, 8), X(3, 5), X(1, 5), X(4, 5), X(3, 4), X(1, 4), X(2, 4), X(5, 7), X(5, 8), X(5, 6), X(6, 7)],
});
const HUB_LOCK: ReadonlyArray<Coord> = MILL(5, 7, {
  plus: [X(4, 7), X(5, 8), X(4, 5), X(6, 5), X(3, 5), X(4, 4), X(6, 4), X(7, 5), X(8, 8), X(8, 6), X(8, 7), X(3, 4), X(5, 4), X(3, 8)],
});

/** The FINISHERS every Revenge offer slate carries (mirrors runs.ts). */
const REVENGE_CORE_22: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

const RUN_REVENGE_22: RunDef = {
  id: 'revenge-22',
  signaturePair: ['dragon', 'duchess'],
  name: 'The Millstone',
  blurb: 'He walks in circles around a stone. Give him nowhere to step.',
  allowedAbilities: ['dragon', 'duchess', 'magnet', 'aegis'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_22,
  offerCoreMin: 2,
  levels: [
    // L1 — THE DOOR. The east wheel (core g7). Still king on g6, and the
    // wall below him (g5) is missing: the g-file is a door. A pawn on g4 is
    // a free key on the way up. Ride the file, take the pawn, take him.
    make(
      1,
      [pawn(7, 4), pawn(2, 3), king(7, 6)],
      {
        ...STILL,
        moveLimit: 6,
        hazards: MILL(7, 7, { doors: ['g5'] }),
        kingPen: RING(7, 7),
      },
    ),
    // L2 — THE SIDE DOOR. The west wheel (core b7). Still king on c7 and
    // the wall to his EAST (d7) is missing: the door is on rank 7. Climb an
    // open file to the seventh, run west along it, take him. A knight cuts
    // the middle of the board while you pick the file.
    make(
      2,
      [knight(5, 4), pawn(8, 5), king(3, 7)],
      {
        ...STILL,
        moveLimit: 8,
        hazards: MILL(2, 7, { doors: ['d7'] }),
        kingPen: RING(2, 7),
      },
    ),
    // L3 — THE PLUG. East wheel, still king f7, the side door e7 open and a
    // pawn standing in it, pinned there by stone under it (e6). It is
    // defended by a bishop on d8 that cannot move (c7 is stone, e7 is its
    // own pawn) — but the d-file runs straight up to it. Take the bishop
    // FIRST, then the pawn, then him. Take the pawn first and the bishop
    // takes you. Capture order is the whole level.
    make(
      3,
      [bishop(4, 8), pawn(5, 7), knight(8, 3), king(6, 7)],
      {
        ...STILL,
        moveLimit: 7,
        hazards: MILL(7, 7, { doors: ['e7'], plus: [X(5, 6), X(3, 7)] }),
        kingPen: RING(7, 7),
      },
    ),
    // L4 — THE WARDEN (aegis KEY, magnet KEY). The same door, the same
    // pinned pawn — and this time the defender is a bishop standing IN the
    // wheel's own corner, f8, pocketed by the pawn and the core. Rank 8 is
    // bricked at e8 and the f-file ends at the king, so no line on the board
    // reaches it. Every window and jump square of the ring is bricked too,
    // so no body slips in beside him. Two answers, both fillers: come along
    // rank 7 and PULL the plug off its defended square (magnet), or take the
    // pawn anyway and eat the bishop's reply (aegis). The summons are traps.
    make(
      4,
      [bishop(6, 8), pawn(5, 7), knight(2, 4), king(6, 7)],
      {
        ...STILL,
        moveLimit: 8,
        hazards: MILL(7, 7, {
          doors: ['e7', 'f8'],
          plus: [X(5, 6), X(5, 8), X(4, 6), X(4, 8), X(5, 5), X(6, 4), X(8, 4), X(6, 5), X(8, 5)],
        }),
        kingPen: RING(7, 7),
      },
    ),
    // L5 — THE LINE (a body's KEY). Still king on h7, the DEEP square of
    // the east wheel: no jump lands on it and no rook line touches it. Both
    // doors are shut. What is open is one window, f5, and through it the
    // long diagonal b1-h7 runs from Rookie's own back rank across g6 onto
    // his square. A rook cannot look down a diagonal. A queen can: summon
    // her beside you on that line and she takes him in one slide. (The
    // Dragon does the same — she is a queen too.) Windows e6/h5 bricked so
    // the other lines do not compete.
    make(
      5,
      [knight(4, 4), pawn(1, 3), king(8, 7)],
      {
        ...STILL,
        moveLimit: 6,
        hazards: MILL(7, 7, { plus: [X(5, 6), X(8, 5)] }),
        kingPen: RING(7, 7),
      },
    ),
    // L6 — THE THIRD SQUARE (dragon KEY). He runs now. And the ring is
    // BROKEN: h7 is stone, so his wheel is a three-square path g6-f7-g8 with
    // a dead end at each end. Every window is bricked (f5/h5/e6/e8) — no
    // line enters. But the jump squares d6/d8/e5 are open, and a knight
    // that lands on f7 stands next to BOTH ends: wherever he is, his only
    // neighbour is the square she is on. Drop the Dragon, jump her onto
    // the middle, take him. The Duchess cannot jump; she is a trap here.
    make(
      6,
      [knight(3, 3), pawn(8, 4), king(6, 7)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: MILL(7, 7, { plus: [X(8, 7), X(6, 5), X(8, 5), X(5, 6), X(5, 8)] }),
        kingPen: RING(7, 7, ['h7']),
      },
    ),
    // L7 — THE DOUBLE DOOR (finale, teaching). King g6, his wheel is two
    // squares (f7 and g6; h7 and g8 bricked) and his own PAWN stands in f7,
    // jammed by the stone under it. Nothing attacks g6 except a body ON f7.
    // Take the pawn — the body is now beside him and he has nowhere to step
    // — and the pawn on e8 steps down and takes the body, and his door is
    // plugged again. One body opens the door once. The second body takes
    // the pawn that re-plugged it, and this time nothing answers: take him.
    // Both bodies come down the a2-g8 diagonal through the window e6 (e.g.
    // summoned on d5 beside Rookie on e4). Eight moves, nothing hunting.
    make(
      7,
      [pawn(6, 7), pawn(5, 8), pawn(2, 3), king(7, 6)],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: [...EAST_LOCK],
        kingPen: ['g6', 'f7'],
      },
    ),
    // L8 — THE WEST DOOR. The mirror: king b6, door c7, watcher d8, line
    // h2-b8 through the window d6. A knight hunts the floor: the two turns
    // the trade costs are two turns you have to survive beside the line.
    make(
      8,
      [pawn(3, 7), pawn(4, 8), knight(6, 3), pawn(8, 5), king(2, 6)],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: [...WEST_LOCK],
        kingPen: ['b6', 'c7'],
      },
    ),
    // L9 — THE HUB. The wheel in the middle (core e7): king e6, door f7,
    // watcher g8, and the only line into the door is the anti-diagonal from
    // h5 through g6. Two enemies a turn, a bishop and a knight on the floor.
    make(
      9,
      [pawn(6, 7), pawn(7, 8), bishop(2, 2), knight(2, 5), king(5, 6)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 11,
        hazards: [...HUB_LOCK],
        kingPen: ['e6', 'f7'],
      },
    ),
    // L10 — THE MILLSTONE. The west door again — king b6, door c7, watcher
    // d8, line h2-b8 through d6 — with two enemies a turn and two knights
    // closing from opposite corners. Twelve moves to reach the line, open
    // his door twice and walk in.
    make(
      10,
      [pawn(3, 7), pawn(4, 8), knight(7, 1), knight(8, 8), king(2, 6)],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 12,
        hazards: [...WEST_LOCK],
        kingPen: ['b6', 'c7'],
      },
    ),
  ],
};

export default RUN_REVENGE_22;
export { RUN_REVENGE_22 };
