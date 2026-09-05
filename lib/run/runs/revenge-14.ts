/**
 * revenge-14 — THE VAULT. Built 2026-09-05 for the daily kit
 * vanguard / swap / poison-dart / smoke (`allowedAbilities` IS the kit).
 *
 * Signature pair: VANGUARD + SWAP ("body-then-become", the top-ranked
 * hypothesis in data/run-playtest/pair-hypotheses.json). A Vanguard drop is
 * the only thing in the game that ignores board geometry — any free square
 * in range, no path required — and Swap then puts Rookie on that square with
 * her move still in hand. So the pair walks through walls nothing else in
 * the kit can touch.
 *
 * CONSTANT SIGNATURE — THE STRONGBOX. On every level the king lives inside a
 * room built of STONE: a ring of hazards drawn tight around his cell, the
 * board's edge doing the rest. Not a band across the board (The Moat's
 * water), not a field of columns (The Colonnade's pillars) — a small closed
 * box that moves around the board, and the question each level asks is HOW
 * YOU GET INSIDE IT. L1-L3 the box has a DOOR and a rook walks in. L4-L6 the
 * door is plugged by something you cannot take, or there is no door at all
 * and exactly one card opens the way. L7-L10 the box is SEALED: no door, no
 * gap, no line, nothing to dart. Nothing walks in.
 *
 * The seal has a second half, and it is what makes the pair NECESSARY rather
 * than merely convenient: on every sealed level the three or four squares
 * from which a KNIGHT could jump onto the king's square are stone as well.
 * Knights hop walls, so without that the Vanguard would take him by itself
 * from outside (L7 v1 read exactly that, 100% on the drop alone). Walled,
 * the dropped knight inside his room can never touch him — the body only
 * creates a LANDING. Every sealed cell is one file (or one rank) wide, so a
 * ROOK standing in it covers every square the king owns. Drop the body,
 * become the body, take him.
 *
 * Kit roles — which levels each card is a KEY on and which it is a TRAP on:
 *   vanguard    KEY on L6 (his cell is sealed AND full, so there is nothing
 *               to swap into — but exactly one square on the board, e7,
 *               jumps onto g8) and on L7-L10 as half the pair. TRAP on
 *               L1-L5: the box still has a door, and a lone knight parked
 *               outside is just a body for the hunters.
 *   swap        KEY on L7-L10. TRAP on L1-L6 — with no body in the room it
 *               is a dead charge, and on L6 the room is FULL, so even with
 *               the Vanguard down there is nothing to trade places with.
 *   poison-dart KEY on L4: the doorway pawn is defended by a pawn on e8 that
 *               sits in a pocket of stone (d8/e7/f8) no line ever reaches —
 *               it cannot be captured, only poisoned. TRAP on L7-L10: there
 *               is no guard between her and the king, only stone, and a dart
 *               has never opened stone.
 *   smoke       KEY on L5: the cell widens to 2x2 and one rook can NEVER
 *               corner a fleeing king in a 2x2 (he steps to the diagonally
 *               opposite square forever). Smoked, he stops running and the
 *               open door is all she needed. TRAP everywhere else —
 *               invisibility does not open a wall, and behind a sealed cell
 *               he was never going to run anyway.
 *
 * L7-L10 intended lines (one shape, rising pressure):
 *   L7  THE BOX — the teaching finale. Sealed g7/g8, e7/f6/h6 all stone.
 *       Drop into g7, SWAP, take g8 up the file. Twelve moves, one hunter.
 *   L8  THE LONG CROSSING — the same cell in the far corner (a7/a8, c7
 *       stone). Nine moves to cross the whole board alive under a bishop and
 *       a knight, then drop into a7, swap, xa8.
 *   L9  THE LEDGE — the cell turns sideways (d8/e8) behind a nine-square
 *       shell; d6/f6/g7/c7 close every knight jump onto e8. Two enemies a
 *       turn, eight moves, a queen owning rank 4: drop into d8, swap, take
 *       e8 along rank 8.
 *   L10 THE SHAFT — three squares tall (c6/c7/c8), b- and d-files walled
 *       rank 5 to 8, a7/e7 sealing the knight jumps. Two enemies a turn and
 *       a SEVEN-move clock, with a queen, two knights and a bishop covering
 *       the low c-file she has to stand on: arrive, drop into c6 or c7,
 *       swap, slide up the shaft.
 *
 * MEASURED (Normal, T5, 2026-09-05 — 16 trials/cell, 32 on the finale):
 *   L1 L2 L3 free (teaching the box). L4 none 0% / poison 100%. L5 none 25%
 *   / smoke 100%. L6 none 0% / vanguard 100%. FINALE, every single card in
 *   the kit reads 0% on all four levels (none, vanguard, swap, poison,
 *   smoke) and the pair reads L7 97% · L8 97% · L9 81% · L10 88%.
 *   FULL RUNS (40 each, Normal, T5, never skipping an offer): 11/40 = 28%
 *   clear with random picks, 21/40 = 53% when the player takes the pair —
 *   pick wrong and the run ends at L6/L7, which is the point. Calibrated
 *   against The Moat (25% random, finale singles 0%, pair 79-100%) and The
 *   Colonnade (12% random, 55% with the right pair).
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

/**
 * The stone ring around the w x h room whose lower-left corner is (f, r),
 * clipped to the board, minus any DOOR squares named in `doors` ('e6').
 * Extra stones (the knight-jump squares that would let a body reach him over
 * the wall) are passed in `plus`.
 */
function VAULT(
  f: number,
  r: number,
  w: number,
  h: number,
  opts: { doors?: string[]; plus?: Coord[] } = {},
): Coord[] {
  const doors = new Set(opts.doors ?? []);
  const out: Coord[] = [];
  for (let ff = f - 1; ff <= f + w; ff++) {
    for (let rr = r - 1; rr <= r + h; rr++) {
      if (ff < 1 || ff > 8 || rr < 1 || rr > 8) continue;
      const inside = ff >= f && ff < f + w && rr >= r && rr < r + h;
      if (inside) continue;
      if (doors.has(nameOf(ff, rr))) continue;
      out.push({ file: ff, rank: rr });
    }
  }
  for (const c of opts.plus ?? []) {
    if (!out.some((o) => o.file === c.file && o.rank === c.rank)) out.push({ ...c });
  }
  return out;
}

/** The room's own squares, as pen names. */
function ROOM(f: number, r: number, w: number, h: number): string[] {
  const out: string[] = [];
  for (let ff = f; ff < f + w; ff++) for (let rr = r; rr < r + h; rr++) out.push(nameOf(ff, rr));
  return out;
}

const REVENGE_CORE_14: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

const RUN_REVENGE_14: RunDef = {
  id: 'revenge-14',
  name: 'The Vault',
  blurb: 'A room with no door. He forgot she can arrive.',
  allowedAbilities: ['vanguard', 'swap', 'poison-dart', 'smoke'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_14,
  offerCoreMin: 2,
  levels: [
    // L1 — THE DOOR. Still king e8 in a two-square cell (e7/e8) with one gap
    // in the stone: e6, straight below him. Ride the e-file, take the key
    // pawn on e7, take him. This is the shape every later level repeats.
    make(
      1,
      [
        pawn(5, 7),
        pawn(3, 7), pawn(7, 7),
        king(5, 8),
      ],
      {
        ...STILL,
        moveLimit: 7,
        hazards: VAULT(5, 7, 1, 2, { doors: ['e6'] }),
        kingPen: ROOM(5, 7, 1, 2),
      },
    ),
    // L2 — THE FAR DOOR. Still king b8; his cell's only gap is c8, up on the
    // top rank behind him. The b- and a-files are stone all the way, so the
    // way in is over the roof: climb an open file to rank 8, run west along
    // it (the d8 pawn is free tempo), step through c8, take him.
    make(
      2,
      [
        pawn(4, 8),
        pawn(7, 6),
        king(2, 8),
      ],
      {
        ...STILL,
        moveLimit: 8,
        hazards: VAULT(2, 7, 1, 2, { doors: ['c8'] }),
        kingPen: ROOM(2, 7, 1, 2),
      },
    ),
    // L3 — THE SIDE DOOR. First flee king: g8 in the g7/g8 cell, and this
    // time the gap in the stone is on the SIDE — f7, level with his floor.
    // The g-file is solid wall now, so the way in is along rank 7: climb an
    // open file to the seventh, run east through the door, step into g7 and
    // he has nowhere left to stand.
    make(
      3,
      [
        knight(4, 4),
        pawn(2, 6), pawn(8, 3),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: VAULT(7, 7, 1, 2, { doors: ['f7'] }),
        kingPen: ROOM(7, 7, 1, 2),
      },
    ),
    // L4 — THE WARDEN. The door moves to the side again (f7, reached up the
    // f-file) and this time it is PLUGGED: a pawn stands in the doorway,
    // defended by a second pawn on e8 that sits in a pocket of its own —
    // d8, e7 and f8 are stone, so no rook, no rank and no file ever touches
    // it. Take the plug and the pocket pawn takes you back. It cannot be
    // captured. It can be POISONED: dart the doorway (or its keeper), walk
    // the f-file in, and step through to g7. KEY = poison-dart.
    make(
      4,
      [
        pawn(6, 7), pawn(5, 8),
        knight(3, 4), pawn(8, 3),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: VAULT(7, 7, 1, 2, { doors: ['f6', 'f7'], plus: [X(5, 7), X(4, 8)] }),
        kingPen: ROOM(7, 7, 1, 2),
      },
    ),
    // L5 — THE ROUND ROOM. The cell doubles to 2x2 (g7/h7/g8/h8) and the
    // door at g6 is wide open — walk right in. It does not help: one rook
    // can NEVER corner a fleeing king in a 2x2, he just steps to the square
    // diagonally opposite, forever, and eight moves is not enough to trick
    // him into a stun. e7 is stone so no knight jumps the ceiling, and the
    // room is too wide for a swapped rook to own. Smoke him — he cannot see
    // her, so he stops running — and then the door is all she needed.
    // KEY = smoke.
    make(
      5,
      [
        knight(4, 5),
        pawn(2, 4),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: VAULT(7, 7, 2, 2, { doors: ['g6'], plus: [X(5, 7)] }),
        kingPen: ROOM(7, 7, 2, 2),
      },
    ),
    // L6 — THE CEILING. No door: the g7/g8 cell is sealed stone. It is also
    // FULL — his own pawn stands on g7 — so there is nothing to walk into
    // and nothing to swap with. But knights jump walls, and exactly ONE
    // square on the board jumps onto g8: e7. Drop the Vanguard there and it
    // reaches over the roof. KEY = vanguard, alone.
    make(
      6,
      [
        pawn(7, 7),
        knight(3, 4), bishop(2, 2), pawn(8, 4),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: VAULT(7, 7, 1, 2),
        kingPen: ROOM(7, 7, 1, 2),
      },
    ),
    // L7 — THE BOX. The same sealed cell, now EMPTY beside him — and e7 is
    // stone, so all three squares that jump onto g8 (e7/f6/h6) are walls.
    // No line reaches in, no knight reaches over, no dart opens stone, and
    // he has no reason to run. Drop the body into g7, SWAP into it, take him
    // up the file. The pair, taught with room to breathe.
    make(
      7,
      [
        knight(4, 4), pawn(2, 3),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: VAULT(7, 7, 1, 2, { plus: [X(5, 7)] }),
        kingPen: ROOM(7, 7, 1, 2),
      },
    ),
    // L8 — THE LONG CROSSING. Same sealed cell, opposite corner: a7/a8
    // behind a6/b6/b7/b8, with c7 closing the second knight jump. The box is
    // as far from her as the board allows, so the whole level is the walk —
    // a bishop rakes the long diagonal and a knight cuts the middle, and she
    // has nine moves to arrive alive within a drop of a7.
    make(
      8,
      [
        bishop(6, 3), knight(4, 5),
        pawn(7, 4),
        king(1, 8),
      ],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: VAULT(1, 7, 1, 2, { plus: [X(3, 7)] }),
        kingPen: ROOM(1, 7, 1, 2),
      },
    ),
    // L9 — THE LEDGE. The cell turns sideways: d8/e8, one rank tall, behind
    // a nine-square shell (c7-f7, c8, f8) with d6/f6/g7 closing every knight
    // jump onto e8. A rook standing on d8 takes him along rank 8 — but the
    // only way onto d8 is to be dropped there. Two enemies a turn under a
    // queen that owns rank 4.
    make(
      9,
      [
        queen(1, 4), knight(7, 4), knight(3, 3),
        pawn(2, 3),
        king(5, 8),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 8,
        hazards: VAULT(4, 8, 2, 1, { plus: [X(4, 6), X(6, 6), X(7, 7)] }),
        kingPen: ROOM(4, 8, 2, 1),
      },
    ),
    // L10 — THE SHAFT. Three squares tall (c6/c7/c8), walled on the b- and
    // d-files from rank 5 to rank 8, roofed by the board and sealed against
    // knights by a7/e7. He has two squares to run in and both of them sit on
    // the c-file, so ONE rook inside the shaft owns the whole room — and the
    // only way into the shaft is a drop. Two enemies a turn, nine moves, and
    // a queen plus a knight patrolling exactly the squares she has to stand
    // on to make the drop.
    make(
      10,
      [
        queen(6, 4), knight(5, 2), knight(1, 3), bishop(8, 6), pawn(6, 2),
        king(3, 8),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 7,
        hazards: VAULT(3, 6, 1, 3, { plus: [X(1, 7), X(5, 7)] }),
        kingPen: ROOM(3, 6, 1, 3),
      },
    ),
  ],
};

export default RUN_REVENGE_14;
export { RUN_REVENGE_14 };
