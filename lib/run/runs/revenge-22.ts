/**
 * revenge-22 — THE MILLSTONE (ladder rung 9). Signature pair DRAGON + DUCHESS.
 *
 * VARIETY PASS 2026-09-15. Tyler cleared the old build with 3 stars and said
 * what was wrong with it: L1-L2 were the same "summon the Duchess, win"; and
 * L7-L10 were ONE line four times (Duchess takes the pawn next to the king,
 * gets taken, Dragon finishes) at a pair rate of 79%, window 48-64. The
 * human REPEAT check flagged L7=L8=L9=L10. This pass keeps the theme (he
 * lives on a ring around a stone) and rebuilds the finale as four different
 * questions for the same two cards.
 *
 * KIT = dragon / duchess / magnet (3 cards; Aegis dropped — early rungs only).
 *   dragon   KEY L4 (the jump onto the bishop), L6 (the only jump), half of
 *            every finale. On L8 she MUST go first; on L9 she MUST go last.
 *   duchess  KEY L5 (with the Dragon), half of every finale; trap on L6.
 *   magnet   KEY L3 (pull the plug off its defended square). Trap on every
 *            finale: no enemy there is on a line she can pull usefully at T1.
 *   NO tier caps (Tyler, 2026-09-15: every ladder set's 3 cards run their
 *   normal path to T5). The finale is measured against the second charge
 *   (Dragon T5, Duchess T4+) and the longer leashes, not protected from them.
 *
 * L1  THE DOOR       walk in (free).
 * L2  THE PLUG       capture order: bishop first, then the pawn, then him.
 * L3  THE PULL       Magnet the plug off its defended square, take it, walk in.
 * L4  THE RAM        a body breaks the bishop-defended door (Dragon jump or
 *                    Duchess trade), Rookie walks through.
 * L5  THE LINE       a queen down the long diagonal.
 * L6  THE THIRD SQ.  the Dragon's jump onto the middle of a broken ring.
 * L7  THE WARDEN     clear the square you stand on: a summon kills the pawn
 *                    guarding it, Rookie steps up, the other summon slides the
 *                    diagonal. (either card removes; finish = diagonal slide)
 * L8  THE HALLWAY    Dragon kicks a knight-only pawn; the hallway pawn takes
 *                    her and steps OUT; Duchess runs the rank. Taking the
 *                    hallway pawn instead is a trade that re-closes it.
 *                    (Dragon first; finish = rank slide)
 * L9  LAST WARDEN    Duchess kills the warden, Rookie steps up, Dragon jumps
 *                    him from the one knight square. (Duchess first; finish
 *                    = knight jump)
 * L10 THE RUN        Duchess takes a pawn and scares him into his corner; the
 *                    Dragon catches him there. Cover the corner first and a
 *                    T1 Duchess expires before she can finish. (hardest)
 *
 * DESIGN RULES THIS RUN LEARNED (bot = MCTS with a Rookie-centric rollout
 * score; see .claude/run-level-design.md):
 *   - fastScore gives NOTHING for a summon threatening the king; it rewards
 *     Rookie closing distance and captures. Every summon action in a finale
 *     line here is a capture or an instant king capture, and every Rookie
 *     step in it strictly closes chebyshev distance. Lines built on a
 *     non-capture threat (herd across the board, "hold the escape then
 *     strike", the Hallway as first drawn) read 0% for the pair even when a
 *     scripted replay proves the win in four moves.
 *   - "Chase through the vacated square" is the T2+ leak on every flee
 *     finale: threat, he steps to his escape, the body lands where he stood.
 *     Fix used on L7/L9/L10: the escape square is reachable ONLY through the
 *     king's square, and a pawn above watches the king's square.
 *   - A guard square that a summon can capture and then continue from needs
 *     its own recapturer (L8 bishop <- d7; L10 f7 <- e8), or one card walks
 *     the whole line at T2.
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
 * A finale board drawn as eight strings, rank 8 first, files a-h:
 *   #  stone      .  empty      ,  empty square of the king's pen
 *   K  the king (his square is in the pen)
 *   p n b q  enemy pawn / knight / bishop / queen
 * Returns the pieces, the stones and the pen, so a level reads as a picture.
 */
function MAP(rows: string[]): { pieces: ReturnType<typeof pawn>[]; hazards: Coord[]; kingPen: string[] } {
  if (rows.length !== 8) throw new Error('MAP needs 8 ranks');
  const pieces: ReturnType<typeof pawn>[] = [];
  const hazards: Coord[] = [];
  const kingPen: string[] = [];
  rows.forEach((row, i) => {
    const cells = row.replace(/\s+/g, '');
    if (cells.length !== 8) throw new Error(`MAP rank ${8 - i} needs 8 cells: "${row}"`);
    const r = 8 - i;
    for (let f = 1; f <= 8; f++) {
      const ch = cells[f - 1];
      if (ch === '#') hazards.push({ file: f, rank: r });
      else if (ch === ',') kingPen.push(nameOf(f, r));
      else if (ch === 'K') { pieces.push(king(f, r)); kingPen.push(nameOf(f, r)); }
      else if (ch === 'p') pieces.push(pawn(f, r));
      else if (ch === 'n') pieces.push(knight(f, r));
      else if (ch === 'b') pieces.push(bishop(f, r));
      else if (ch === 'q') pieces.push(queen(f, r));
      else if (ch !== '.') throw new Error(`MAP: unknown cell "${ch}"`);
    }
  });
  return { pieces, hazards, kingPen };
}


const L3_MAP = MAP([
  '# , b # # # # #',
  ', # K p . . . .',
  '# , # # # # . .',
  '# # # # # # . .',
  '# # # # # # . .',
  '. . n . . . . .',
  '. . . . . . . .',
  '. . . . . . . .',
]);

const L7_MAP = MAP([
  '# # # # # # # p',
  '# # # # # # K #',
  '# # # # # . # ,',
  '# # p # . # # #',
  '# # # . p # # #',
  '# # # . # # # #',
  '. . . . . . # #',
  '. . . . . . . .',
]);

const L8_MAP = MAP([
  '# # # # # # # #',
  '# # # p # # # #',
  '# # b # # # # #',
  '# # . p . . K #',
  '. . # # p # # #',
  '. . # # # # # #',
  '. . # # # # # #',
  '. . # # # # # #',
]);

const L9_MAP = MAP([
  '# # # # , # p #',
  '# # # # # K # #',
  '# # # # # # # #',
  '# # p # . # # #',
  '# # # . # # # #',
  '# # # . # # # #',
  '. . . . . . . .',
  '. . . . . . . .',
]);

const L10_MAP = MAP([
  '# # p # p # # #',
  '# # # K # p # #',
  '# . . # , # # #',
  '# . # p # # . #',
  '# # # # . . # #',
  '# # . . . . # #',
  '. . . . . . . .',
  '. . . . . . . .',
]);

const RUN_REVENGE_22: RunDef = {
  id: 'revenge-22',
  signaturePair: ['dragon', 'duchess'],
  name: 'The Millstone',
  blurb: 'He walks in circles around a stone. Give him nowhere to step.',
  allowedAbilities: ['dragon', 'duchess', 'magnet'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: ['dragon', 'duchess'],
  offerCoreMin: 1,
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
    // L2 — THE PLUG. East wheel, still king f7, the side door e7 open and a
    // pawn standing in it, pinned there by stone under it (e6). It is
    // defended by a bishop on d8 that cannot move (c7 is stone, e7 is its
    // own pawn) — but the d-file runs straight up to it. Take the bishop
    // FIRST, then the pawn, then him. Take the pawn first and the bishop
    // takes you. Capture order is the whole level.
    make(
      2,
      [bishop(4, 8), pawn(5, 7), knight(8, 3), king(6, 7)],
      {
        ...STILL,
        moveLimit: 7,
        hazards: MILL(7, 7, { doors: ['e7'], plus: [X(5, 6), X(3, 7)] }),
        kingPen: RING(7, 7),
      },
    ),
    // L3 — THE PULL (Magnet KEY; a body works too, at a price). West wheel,
    // still king c7, his door d7 plugged by a pawn the pocketed bishop on c8
    // defends. Take it and the bishop takes you. Stand on rank 7 two squares
    // away and PULL the plug toward you: it lands off the bishop's diagonal,
    // you take it, and the rank is open to him. The ranks under him are
    // stone, so the only near squares are the ones the Magnet needs.
    make(
      3,
      L3_MAP.pieces,
      { ...STILL, moveLimit: 10, hazards: L3_MAP.hazards, kingPen: L3_MAP.kingPen },
    ),
    // L4 — THE BATTERING RAM (a body's KEY). The same door, the same
    // pinned pawn — and this time its defender is a bishop standing IN the
    // wheel's own corner, f8, pocketed by the pawn and the core, where no
    // line on the board reaches it. Rookie cannot take the plug (the bishop
    // takes her back) and cannot reach the bishop. A summon can: send the
    // Duchess into the door and let the bishop take her, then take the
    // bishop yourself — or find the Dragon's jump onto f8 first. Magnet is a
    // trap (the pull lands the plug where the bishop still sees it).
    make(
      4,
      [bishop(6, 8), pawn(5, 7), knight(2, 4), king(6, 7)],
      {
        ...STILL,
        moveLimit: 11,
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
    // L7 — THE WARDEN (clear the square you stand on). King g7, escape h6
    // (reachable only through g7, which the h8 pawn watches). The one square
    // that sees him is the long diagonal d4-e5-f6; Rookie can summon onto it
    // only from d3, and the pawn on e4 guards d3 (the c5 pawn guards d4).
    // One summon takes the e4 warden, Rookie steps to d3, the other summon
    // lands on d4 and slides into him. Either card can be the remover.
    make(
      7,
      L7_MAP.pieces,
      { ...FLEE, moveLimit: 7, hazards: L7_MAP.hazards, kingPen: L7_MAP.kingPen },
    ),
    // L8 — THE HALLWAY (Dragon first, because the guard steps out). King g5
    // at the end of rank 5. His own pawn d5 stands in the hallway. The pawn
    // on e4 is reachable only by a knight jump from c5. Kick it with the
    // Dragon: d5 takes her and steps OUT of the hallway, and the Duchess
    // spawns on c5 and runs the rank into him. The bishop c6 (guarded by d7)
    // makes "just take the hallway pawn" a trade: the hallway closes again.
    make(
      8,
      L8_MAP.pieces,
      { ...FLEE, moveLimit: 7, hazards: L8_MAP.hazards, kingPen: L8_MAP.kingPen },
    ),
    // L9 — THE LAST WARDEN (Duchess first, because only the Dragon jumps).
    // King f7, escape e8 (reachable only through f7, which g8 watches).
    // The only square that reaches him is e5, a knight square, and only d4
    // touches e5. The c5 pawn guards d4. Duchess from d4 takes c5, Rookie
    // steps up, Dragon spawns on e5 and jumps him. Send the Dragon to kill
    // the warden and nobody is left who can jump.
    make(
      9,
      L9_MAP.pieces,
      { ...FLEE, moveLimit: 10, hazards: L9_MAP.hazards, kingPen: L9_MAP.kingPen },
    ),
    // L10 — THE RUN (let him run, then catch him). King d7 in a pawn box,
    // escape e6, both watched. The Duchess takes d5 and steps to c6: he runs
    // to e6, and the Dragon spawns on g5 and jumps him there. Cover e6 first
    // and he never runs, and a T1 Duchess dies before she can take him; the
    // Dragon cannot be both the scare and the catch.
    make(
      10,
      L10_MAP.pieces,
      { ...FLEE, moveLimit: 9, hazards: L10_MAP.hazards, kingPen: L10_MAP.kingPen },
    ),
  ],
};

export default RUN_REVENGE_22;
export { RUN_REVENGE_22 };
