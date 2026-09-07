/**
 * revenge-40 — THE CAIRN. Built 2026-09-06 for the
 * signature pair SHOVE + MAGNET ("pull the plug, roll the wall").
 * Kit = shove / magnet / hourglass / coup (`allowedAbilities` IS the kit).
 * Shove is at TESTING stage, so this run is /playtest-only.
 *
 * THE VERB: drag the guard out of the door, take it where it stands alone,
 * and roll one stone of his own wall into his room so the room is small
 * enough for a rook to hold. Not crossing a wall (The Moat), not a shaft
 * plugged by a piece a stone can never shift (The Stacks), not walking in
 * untouchable (The Keep) — moving the wall itself.
 *
 * THE MECHANISM, read out of lib/run/abilities.ts and lib/run/pawn-ai.ts:
 *   - Shove (T1, one use) rolls a stone in Rookie's 8-neighbourhood ONE
 *     square directly away from her. Pushed on a rook line the stone lands
 *     on the square beyond the gap and blocks the very line the gap opened,
 *     so every useful shove here is pushed FROM THE SIDE into his room: a
 *     room square dies, the wall square it left is nothing to her. Only a
 *     stone whose `fixed` flag is absent rolls; every other stone in this
 *     run is `fixed: true`, so Shove is refused square by square except
 *     where the pair wants it (docs/new-abilities-2026-09-06.md §2.2).
 *   - Magnet (T1) grabs the FIRST enemy on one of her rook lines at distance
 *     >= 2 and drags it up to two squares toward her. A frozen bishop in the
 *     one-wide throat below his door is always that first piece.
 *   - A rook can never hold a 2x2 room (kingFleeMove: he steps to the one
 *     square her cross does not cover, forever). With one room square under
 *     stone the room is an L, and an L IS holdable: stand on the corner
 *     square's neighbour, he is attacked, and his only flight is x-rayed
 *     through his own square (the engine moves him before it checks).
 *   - Any capture credited to Rookie stuns him for the enemy turn — so the
 *     king is NEVER on the pulled plug's line when the plug is taken (a stun
 *     on his line is a free kill and would make Magnet alone a key), and
 *     nothing capturable ever stands inside his room (a piece in the room is
 *     a stun on his line the moment she is inside).
 *
 * CONSTANT SIGNATURE — THE CAIRN. Every level draws the same heap of stone in
 * the upper middle of the board: a hollow square ring of FIXED stone (files
 * c-f, ranks 5-8) around a 2x2 room (d6 e6 d7 e7 = his pen), a one-wide
 * THROAT running up the d-file into the south door (throat walls c4 e4), and
 * a SPOIL HEAP of fixed stone in the north-west corner (a6 a8 b5 b7) that
 * cages the SENTRY — a knight set into the ring at c7 with every jump under
 * stone except the door square d5 (which it guards) and his room (which
 * guards never enter). The sentry can never be captured (c6 c8 b7 are
 * stone) and never be pulled (no open line reaches it). The door is plugged
 * by a bishop at d5 whose four diagonals are stone or his room: it is
 * frozen, and it is defended by the sentry, so taking it where it stands is
 * death. One stone of the east wall (f6 or f7) is LOOSE. That is the whole
 * run: a plug that can be pulled but not taken, a wall that can be rolled
 * but not crossed.
 *
 * KEY / TRAP map:
 *   magnet     KEY L3 (pull the plug down the throat, take it off the sentry,
 *              he is on the file). Half of L7-L10. TRAP on L4/L5/L6 (nothing
 *              pullable helps), and alone on the finale: the plug comes out,
 *              he is off the file, the 2x2 holds.
 *   shove      KEY L4 (open door, roll f6 into e6, hold the L), KEY L6
 *              (the WATCHER: a second knight at b8 covers d7, so the stone
 *              must go to e7 and the hold is from d6 along the rank). Half of
 *              L7-L10. TRAP on L3/L5 (the loose stone opens nothing while
 *              the plug stands) and alone on the finale (0%: the plug).
 *   coup       KEY L5 only (a pinned pawn beside him on her line: swap, he
 *              lands on it, take). TRAP everywhere else — no pawn stands
 *              beside him, and from T3 the swap puts him INSIDE the wall on
 *              the sentry's square where no line ever reaches.
 *   hourglass  pure TRAP (no fuse anywhere: every pawn is pinned, every
 *              guard frozen or hunting). Offered as bait.
 *
 * THE FOUR FINALE LINES (each demands a different decision with the pair):
 *   L7  THE DOOR — the lesson. Roll f6 into e6 from g6 (he stands on e7),
 *       walk round to the throat, pull the plug d5→d4 from d3, take it,
 *       slide d4→d7: he is attacked on e7, d6 is x-rayed, e6 is stone. Take
 *       him. Either order works; the pair is the point.
 *   L8  WHICH STONE — two loose stones, one shove. e5 (south wall) can only
 *       be pushed from f4, and it lands on d6: his room loses a square but
 *       so does HER file (d7 is now behind stone), and the level is dead.
 *       f6→e6 is the one that wins. The L7 habit "roll the first stone you
 *       reach" loses deterministically; the T1 card has one use.
 *   L9  THE WATCHER — the b8 knight from L6 is back and covers d7, and he
 *       stands on e6, so the L7/L8 line is impossible twice over: e6 is not
 *       free and d7 is death. Only f7→e7 (from g7) works, and the hold is
 *       from d6 along RANK 6 with d7 x-rayed, not from d7 up the file. Two
 *       enemies a turn.
 *   L10 THE CRUSH — the T3 level. He stands on e6 with his own pawn on e7
 *       beside him (pinned by his body; it covers d6) and a pawn on f8
 *       defends e7, so the pawn can never be taken. At T3 the stone f7,
 *       pushed from g7, CRUSHES the pawn as it lands: room square gone, guard
 *       gone, king stunned, in one free action. Then the L7 line, held from
 *       d6 along the rank. At T1/T2 the pair reads ~0: the shove is refused
 *       (a pawn stands on the destination) and the pawn blocks the only
 *       stone. Coup T1 CAN move him here (the pawn is beside him) — it
 *       changes which square the stone must take, not the answer. Two
 *       enemies a turn, twelve moves.
 *
 * WHY THE SINGLES FAIL ON THE FINALE (kit-relative, tier-checked below):
 *   none       the plug is defended; the door is the only way in.
 *   shove      the stone rolls, the plug still stands. T4 reach and T5
 *              unlimited change nothing: one loose stone, and once it is
 *              inside the room she cannot reach it.
 *   magnet     the plug comes out and dies on d4, he is off the file, and a
 *              2x2 (L7/L8/L10) or a covered L (L9) is unholdable. T4 pulls
 *              further to the same place. T5 can yank him one square only
 *              when he is on her line, and he never is.
 *   coup       T1/T2: no pawn beside him (L7-L9); L10: the swap moves him to
 *              e7 and the plug still stands. T3-T4: the only guard within two
 *              is the sentry, and a king swapped onto c7 is sealed in stone.
 *   hourglass  nothing on the board has a fuse.
 *
 * MEASURED — see the block appended after the first playtest pass.
 *
 * ── MEASURED 2026-09-07 ──
 * This file was an UNTRACKED ORPHAN (`revenge-cairn.ts`, a provisional id)
 * left behind when its author was killed mid-build: a complete ten-level run
 * with a full design header, never registered, never measured, never imported
 * by extra-runs.ts. Renumbered to revenge-40, registered in extra-runs.ts and
 * data/content/pipeline.json in the same commit as the file, and measured.
 *
 * `revenge.ts matrix --run=revenge-40 --difficulty=normal --levels=7,8,9,10
 *  --loadouts=none,shove,magnet,hourglass,coup,shove+magnet --trials=32
 *  --jobs=8` (T1 cards; T5 is the bot; determinism check passing):
 *   L     none   shove  magnet  hourglass   coup  |  shove+magnet
 *   7       0%     31%      0%         0%     0%  |      22%
 *   8       0%      0%      0%         0%     0%  |       0%
 *   9       0%      6%      0%         0%     0%  |      56%
 *   10      0%      0%      3%         0%     0%  |       3%
 *
 * THE COMBO GATE IS NOT MET, ON BOTH HALVES.
 *   - SHOVE ALONE reads 31% on L7 (the bar is 8%) and 6% on L9. The header's
 *     claim that shove alone is 0% on the finale "because of the plug" does
 *     not survive the harness: rolling a stone into the room turns the 2x2
 *     into an L often enough to win outright on the teaching level, with the
 *     plug still standing.
 *   - THE PAIR reads 22 / 0 / 56 / 3%. L8 and L10 are not hard, they are
 *     UNBEATABLE by the pair the run was built for: L8 asks the bot to reject
 *     the loose stone it can reach (e5) in favour of the far one (f7), and L10
 *     asks for a T3 shove to crush a pawn as it lands, which the T1 matrix
 *     cannot express at all.
 * Registered at stage `idea` with its numbers so whoever picks it up starts
 * from measurement instead of from the header's prose.
 */

import {
  make,
  pawn,
  knight,
  bishop,
  king,
  X,
  FLEE,
  STILL,
  type RunDef,
} from '../run-kit';
import type { Hazard } from '../types';

/** The finishers — mirrors REVENGE_CORE in runs.ts (kept local: importing it would cycle). */
const REVENGE_CORE_IDS: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

const PEN = ['d6', 'e6', 'd7', 'e7'];

/** The ring: files c-f, ranks 5-8, hollow around d6/e6/d7/e7. */
const RING: ReadonlyArray<[number, number]> = [
  [3, 5], [4, 5], [5, 5], [6, 5], // south wall c5 d5 e5 f5
  [3, 8], [4, 8], [5, 8], [6, 8], // north wall c8 d8 e8 f8
  [3, 6], [3, 7], // west wall c6 c7
  [6, 6], [6, 7], // east wall f6 f7
];
/** Throat walls beside the d-file below the south door. */
const THROAT: ReadonlyArray<[number, number]> = [[3, 4], [5, 4]]; // c4 e4
/** Spoil heap: cages the sentry knight at c7 (and the watcher at b8). */
const HEAP: ReadonlyArray<[number, number]> = [[1, 6], [1, 8], [2, 5], [2, 7]]; // a6 a8 b5 b7

const key = (f: number, r: number) => `${f},${r}`;

/**
 * Build the cairn. `open` squares are removed from the stone (doors, or a
 * ring square a piece stands on); `loose` squares are the stones Shove may
 * roll; everything else is `fixed: true`.
 */
function cairn(opts: { open?: Array<[number, number]>; loose?: Array<[number, number]>; heap?: boolean } = {}): Hazard[] {
  const open = new Set((opts.open ?? []).map(([f, r]) => key(f, r)));
  const loose = new Set((opts.loose ?? []).map(([f, r]) => key(f, r)));
  const all: Array<[number, number]> = [...RING, ...THROAT, ...(opts.heap === false ? [] : HEAP)];
  const out: Hazard[] = [];
  for (const [f, r] of all) {
    if (open.has(key(f, r))) continue;
    out.push(loose.has(key(f, r)) ? X(f, r) : { ...X(f, r), fixed: true });
  }
  return out;
}

/** The frozen plug in the south door, and the sentry that guards it. */
const PLUG = bishop(4, 5); // d5
const SENTRY = knight(3, 7); // c7 (ring square — opened in the stone)
const WATCHER = knight(2, 8); // b8: covers d7, sealed by a8 b7 c8

export const RUN_REVENGE_40: RunDef = {
  id: 'revenge-40',
  name: 'The Cairn',
  blurb: 'A heap of stone with him inside. One stone is loose.',
  allowedAbilities: ['shove', 'magnet', 'hourglass', 'coup'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_IDS,
  offerCoreMin: 2,
  levels: [
    // L1 — THE OPEN DOOR. Still king on e7, the south door d5 is open. Ride
    // the throat to d7, take him. Shows the whole heap in two moves.
    make(1, [king(5, 7)], {
      ...STILL,
      moveLimit: 6,
      hazards: cairn({ open: [[4, 5]], heap: false }),
      kingPen: PEN,
    }),
    // L2 — THE FLEE. He runs now, and his own pawn on e6 (pinned by the
    // south wall) makes his room an L. Slide d5→d6: the pawn and d7 are
    // attacked; take the pawn (he is stunned) and he is on your file.
    make(2, [pawn(5, 6), king(5, 7)], {
      ...FLEE,
      moveLimit: 7,
      hazards: cairn({ open: [[4, 5]], heap: false }),
      kingPen: PEN,
    }),
    // L3 — THE PLUG (magnet KEY). A frozen bishop stands in the door and the
    // sentry knight, set into the wall at c7, guards it — take it there and
    // the knight takes you. Stand on d3, pull it down to d4, take it for
    // free: he is on d7, on your file, and stunned. No loose stone.
    make(3, [PLUG, SENTRY, king(4, 7)], {
      ...FLEE,
      moveLimit: 8,
      hazards: cairn({ open: [[4, 5], [3, 7]] }),
      kingPen: PEN,
    }),
    // L4 — THE KEYSTONE (shove KEY). The door is open and nothing guards it;
    // the lock is the room, and the WATCHER at b8 covers d7 so no rook can
    // ever stand on it. From g8 roll the loose f7 DIAGONALLY into e6: the
    // wall square it left is a window onto rank 7. Step to g7 — he is
    // attacked on e7 and runs to d6 or d7, onto your file. Walk round to d3
    // and take him up the throat.
    make(4, [WATCHER, king(5, 7)], {
      ...FLEE,
      moveLimit: 9,
      hazards: cairn({ open: [[4, 5]], loose: [[6, 7]] }),
      kingPen: PEN,
    }),
    // L5 — THE COUP (coup KEY). The door is in the EAST wall (f6). His pawn
    // on e6 (pinned by the south wall) stands beside him on d7, and it is on
    // your line from g6. Swap them: he lands on e6, take him. Take the pawn
    // instead and he is stunned off your line with a 2x2 to run in.
    make(5, [pawn(5, 6), king(4, 7)], {
      ...FLEE,
      moveLimit: 8,
      hazards: cairn({ open: [[6, 6]], heap: false }),
      kingPen: PEN,
    }),
    // L6 — THE LONG PULL (magnet KEY, second ask). The plug and sentry are
    // back and a pawn set into the south wall at c5 (pinned by the throat
    // wall, unreachable on every line) covers d4: the L3 pull lands the
    // bishop on a square where taking it is death. Stand on d2 or d1 and
    // pull it TWO squares to d3. He is on d7, on the file.
    make(6, [PLUG, SENTRY, pawn(3, 5), king(4, 7)], {
      ...FLEE,
      moveLimit: 9,
      hazards: cairn({ open: [[4, 5], [3, 7], [3, 5]] }),
      kingPen: PEN,
    }),
    // L7 — THE DOOR (finale, shove + magnet). Plug, sentry and watcher; he
    // stands on e7; f7 is loose; a knight hunts you from h1. Roll f7 into e6
    // from g8, step to g7, he runs onto the file; pull the plug to d4 from
    // d3, take it, take him. Either half first — the pair is the point.
    make(7, [PLUG, SENTRY, WATCHER, knight(8, 1), king(5, 7)], {
      ...FLEE,
      moveLimit: 12,
      hazards: cairn({ open: [[4, 5], [3, 7]], loose: [[6, 7]] }),
      kingPen: PEN,
    }),
    // L8 — WHICH STONE. Two loose stones: f7 (rolls into e6 from g8) and e5
    // (rolls into d6 from f4 — and d6 is YOUR file's last square before
    // d7, so the level is dead). One shove. A bishop hunts from h1.
    make(8, [PLUG, SENTRY, WATCHER, bishop(8, 1), king(5, 7)], {
      ...FLEE,
      moveLimit: 12,
      hazards: cairn({ open: [[4, 5], [3, 7]], loose: [[6, 7], [5, 5]] }),
      kingPen: PEN,
    }),
    // L9 — THE LONG DOOR. L7 with the c5 pawn from L6 covering d4: the pull
    // must reach d3 from d2/d1, and the L7 habit (pull one, take on d4)
    // dies. Two enemies a turn; a knight from a1 and a bishop from h1.
    make(9, [PLUG, SENTRY, WATCHER, pawn(3, 5), knight(1, 1), bishop(8, 1), king(5, 7)], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 12,
      hazards: cairn({ open: [[4, 5], [3, 7], [3, 5]], loose: [[6, 7]] }),
      kingPen: PEN,
    }),
    // L10 — THE CRUSH (T3). His pawn stands on e6 (pinned by the south wall,
    // guarded by the sentry, so it can never be taken) — exactly where the
    // stone must land. At T1/T2 the shove is refused. At T3 the stone from
    // g8 crushes it as it lands: room square gone, guard gone, king stunned.
    // Then the L7 line. Coup T1 can swap him with that pawn — the stone must
    // then crush the pawn on e7 from g7 instead; same card, same tier.
    // Two enemies a turn, two hunters.
    make(10, [PLUG, SENTRY, WATCHER, pawn(5, 6), knight(8, 1), bishop(1, 1), king(5, 7)], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 12,
      hazards: cairn({ open: [[4, 5], [3, 7]], loose: [[6, 7]] }),
      kingPen: PEN,
    }),
  ],
};
