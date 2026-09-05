/**
 * revenge-15 — THE STACKS. Built 2026-09-05 for the pair MAGNET + BOULDER
 * ("reposition then seal"). Kit = magnet / boulder / aegis / decoy
 * (`allowedAbilities` IS the daily kit — daily-kit.ts draws all four).
 *
 * CONSTANT SIGNATURE: the middle of the board is SOLID STONE. Ranks 3-7 are
 * filled on every file except a small number of one-square-wide SHAFTS cut
 * top to bottom. Ranks 1-2 are the floor (a free highway), rank 8 is the
 * gallery (where he lives), and the ONLY way from one to the other is up a
 * shaft. A shaft is one square wide, so ONE PIECE standing in it closes the
 * whole route — which is the point of the run: every level asks WHICH SQUARE
 * a specific enemy is standing on, never how many enemies there are. His room
 * is the corner beside the gallery, half of it cut into the stone as ALCOVES
 * on rank 7, always with a stone square between it and the shaft.
 *
 * Three consequences of the stone that drive every level:
 *  - A bishop in a shaft is FROZEN (both its diagonals run into stone), so it
 *    is a permanent plug. Nothing on the board can make it move except a pull.
 *  - A pawn on rank 8 above stone can never march, so rank-8 pawns are
 *    permanent defenders of the shaft's top square.
 *  - A lone rook can never hold a 2x2 room: from every square she covers
 *    exactly two of the other three (g8 sees g7 and h8, h8 sees h7 and g8,
 *    g7 sees h7 and g8 …) and he steps to the fourth. Forever.
 *
 * Kit roles:
 *  - MAGNET is the opener. Stand on the shaft's file, grab the plug (in a
 *    one-wide shaft it is always the first piece on her line) and drag it DOWN
 *    two squares, off its defenders; take it there for free. KEY on L3, L4,
 *    L7, L8, L9, L10. TRAP on L5 (the shaft is already open and the king
 *    himself can't be pulled below T5) and on L6 (slower than the decoy that
 *    opens the shaft AND stuns).
 *  - BOULDER is the sealer, and the only card that touches his room. One
 *    stone in a square of the 2x2 he is not standing in makes the room small
 *    enough for one rook to hold. KEY on L5, L7, L8, L9, L10. TRAP on
 *    L1-L4 and L6: a stone can never remove a plug, and in a one-wide shaft
 *    every stone she drops is a wall across her own only route.
 *  - AEGIS tanks the recapture on a plug that is defended ONCE: take it
 *    anyway, eat the reply, walk on. KEY on L4, playable on L6. TRAP on L3
 *    and L10 (two defenders — and on L10 two enemies a turn, so the shield
 *    stops the first reply and the second one kills her) and on L5/L7/L8/L9,
 *    where the lock is his room, not a guard.
 *  - DECOY is the free stun that also relocates: mark a guard and its own
 *    side eats it. On L6 it is the only way to move a knight that has no legal
 *    move at all, and it stuns the king in the same beat. KEY on L6, playable
 *    on L3/L4. TRAP on L5/L7/L8/L9/L10 — a mark opens a shaft at best, and
 *    the lock on those levels is a room no capture can close.
 *
 * L7-L10 are the finale and are gated on the PAIR: each one has a plug no
 * stone can shift and a 2x2 room no line can hold, so every single card in
 * the kit solves exactly half the level.
 *
 * MEASURED — Normal, T1 cards, 32 trials/cell, SERIAL (`--jobs=1`; matrix
 * cells cross-talk when workers share a loaded machine), 2026-09-05:
 *
 *      L    none  magnet boulder   aegis   decoy  magnet+boulder
 *      1    100%    100%    100%    100%    100%    100%   free
 *      2    100%    100%    100%    100%    100%    100%   free
 *      3      0%    100%      0%      0%    100%    100%
 *      4      0%    100%      0%    100%    100%    100%
 *      5      0%      0%    100%      0%      0%    100%   boulder ONLY
 *      6      0%    100%      0%    100%    100%    100%
 *      7      0%      0%      0%      0%      0%    100%   FINALE
 *      8      0%      0%      0%      0%      0%    100%   FINALE
 *      9      0%      0%      0%      0%      0%     97%   FINALE
 *     10      0%      0%      0%      0%      0%    100%   FINALE
 *
 * Calibrated against The Moat (singles 0% on its finale) and The Colonnade,
 * whose L10 2x2 corner room is the same lock this run uses on L5 and L7-L10.
 *
 * Full runs (40 runs, Normal, serial): 35% clear with RANDOM picks, 25% with
 * `--pool=magnet,boulder`. Both misses are honest and both come from the same
 * place: move-limit losses on L5 and L9, where the bot spends moves hunting
 * for the right stone square. The pair-pool number is the more interesting
 * one — it is LOWER than random because a pool of two cards keeps upgrading
 * them, and high-tier Boulder (T4 forces two stones per use, T5 is unlimited)
 * walls Rookie's own one-wide shaft. The boulder self-block that made it an
 * anti-pair with bishop-squire on The Colonnade shows up here as a tier
 * problem rather than a partner problem.
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
import type { Coord } from '../types';

/** The finishers — mirrors REVENGE_CORE in runs.ts (kept local: importing it would cycle). */
const REVENGE_CORE_IDS: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

const STONE_RANKS = [3, 4, 5, 6, 7] as const;

/**
 * The stone block: ranks 3-7 solid on every file EXCEPT the listed SHAFTS,
 * which are cut open top to bottom.
 */
const STACKS = (...shafts: number[]): Coord[] => {
  const out: Coord[] = [];
  for (let file = 1; file <= 8; file++) {
    if (shafts.includes(file)) continue;
    for (const rank of STONE_RANKS) out.push(X(file, rank));
  }
  return out;
};

/** Hollow ALCOVES (his room) out of the stone. */
const alcoves = (stone: Coord[], ...squares: Coord[]): Coord[] =>
  stone.filter((h) => !squares.some((s) => s.file === h.file && s.rank === h.rank));

export const RUN_REVENGE_15: RunDef = {
  id: 'revenge-15',
  name: 'The Stacks',
  blurb: 'A wall with slots cut in it. He thinks a plug is a wall.',
  allowedAbilities: ['magnet', 'boulder', 'aegis', 'decoy'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_IDS,
  offerCoreMin: 2,
  levels: [
    // L1 — THE OPEN SHAFT. Two shafts (d and f); the d one has a pawn in it,
    // the f one is empty top to bottom. Still king e8. Ride the open shaft
    // to f7, step onto rank 8, take him. Teaches the whole board in one move.
    make(
      1,
      [
        pawn(4, 5),
        pawn(3, 8),
        king(5, 8),
      ],
      { ...STILL, moveLimit: 6, hazards: STACKS(4, 6) },
    ),
    // L2 — THE FAR SHAFT. Still king b8, and the shaft right beside him (b)
    // is plugged by pawn b7, held by BOTH a8 and c8. The other shaft is all
    // the way across (g). Take the long one, come along the gallery, eat c8,
    // take him. Count the moves before you pick a shaft.
    make(
      2,
      [
        pawn(2, 7), pawn(1, 8), pawn(3, 8),
        king(2, 8),
      ],
      { ...STILL, moveLimit: 9, hazards: STACKS(2, 7) },
    ),
    // L3 — THE STONE PLUG. First flee king (g8, room g8/h8). ONE shaft (c),
    // and a bishop stands at the top of it. In a one-wide shaft that bishop
    // is FROZEN — b6/d6 are stone and b8/d8 are its own pawns — and those
    // same two pawns hold c7, so taking it is death. Nothing on the board can
    // make it move. MAGNET: stand on the c-file, grab it, drag it two squares
    // down to c5 where nothing defends it, and take it for free. KEY = magnet.
    make(
      3,
      [
        bishop(3, 7),
        pawn(2, 8), pawn(4, 8),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 12,
        hazards: STACKS(3),
        kingPen: ['g8', 'h8'],
      },
    ),
    // L4 — THE WATCHER. One shaft (e), plugged at e6 by a frozen bishop that
    // knight d8 defends — and d8's only jump is that same square, so it never
    // leaves its post. Take the bishop and the knight takes you. AEGIS: take
    // it anyway, eat the reply, walk up the shaft. KEY = aegis (magnet also
    // opens it by dragging the bishop below the knight's jump; decoy makes the
    // knight eat its own bishop, which leaves an UNDEFENDED plug on e6).
    make(
      4,
      [
        bishop(5, 6),
        knight(4, 8),
        pawn(3, 8),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 9,
        hazards: STACKS(5),
        kingPen: ['g8', 'h8'],
      },
    ),
    // L5 — THE DODGE. The shaft (e) is wide open — nothing is in your way at
    // all. The lock is his ROOM: the 2x2 corner g7/h7/g8/h8, two of it cut as
    // ALCOVES into the stone. A lone rook can never hold a 2x2: every square
    // she takes covers exactly two of the other three (g8 sees g7 and h8, h8
    // sees h7 and g8, g7 sees h7 and g8 …) and he steps to the fourth,
    // forever. BOULDER: one stone in a square he is not standing in and the
    // room is small enough to hold. KEY = boulder — and the only card in the
    // kit that does anything here at all.
    make(
      5,
      [
        king(7, 7),
      ],
      {
        ...FLEE,
        moveLimit: 13,
        hazards: alcoves(STACKS(5), X(7, 7), X(8, 7)),
        kingPen: ['g7', 'h7', 'g8', 'h8'],
      },
    ),
    // L6 — THE FROZEN KNIGHT. One shaft (f) with a knight sitting in it at f6.
    // Every square it could jump to is stone except e8 and g8, and those hold
    // its own pawn and its own knight — it has NO legal move, ever, and g8
    // defends it, so taking it is death. DECOY: mark the knight on g8 and the
    // plug eats its own teammate — the shaft opens, the king is stunned, and
    // the eater is now sitting on rank 8 undefended. KEY = decoy (magnet drags
    // the plug down to f4; aegis tanks the recapture).
    make(
      6,
      [
        knight(6, 6),
        pawn(5, 8), knight(7, 8),
        king(8, 8),
      ],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: STACKS(6),
        kingPen: ['g8', 'h8'],
      },
    ),
    // L7 — TWO PLUGS, ONE PULL. The finale starts, and from here every level
    // has TWO locks: a plug no stone can shift, and the 2x2 room no line can
    // hold. Two shafts (b and d), each frozen shut by a bishop that a frozen
    // knight defends — one magnet charge opens one of them. His room is the
    // g7/h7/g8/h8 corner. MAGNET + BOULDER.
    make(
      7,
      [
        bishop(2, 6), bishop(4, 6),
        knight(1, 8), knight(3, 8),
        king(7, 7),
      ],
      {
        ...FLEE,
        moveLimit: 11,
        hazards: alcoves(STACKS(2, 4), X(7, 7), X(8, 7)),
        kingPen: ['g7', 'h7', 'g8', 'h8'],
      },
    ),
    // L8 — THE LONG GALLERY. One shaft (c), plugged at the very top by a
    // bishop held by both b8 and d8 (no pawn above stone can ever march, so
    // those two hold c7 for the whole level). Past it the gallery is long:
    // d8 and f8 both have to be eaten before rank 8 reaches his corner — and
    // neither stun is worth anything, because from f8 the room is still four
    // squares wide. MAGNET + BOULDER.
    make(
      8,
      [
        bishop(3, 7),
        pawn(2, 8), pawn(4, 8), pawn(6, 8),
        king(7, 7),
      ],
      {
        ...FLEE,
        moveLimit: 17,
        hazards: alcoves(STACKS(3), X(7, 7), X(8, 7)),
        kingPen: ['g7', 'h7', 'g8', 'h8'],
      },
    ),
    // L9 — THE OTHER CORNER. Same two locks, mirrored: the shaft is e, the
    // plug is a frozen bishop at e6 held by a knight on d8 whose only jump is
    // that same square, and his room is the a7/b7/a8/b8 corner at the far end
    // of the gallery. The knight has to be eaten on the walk west and the
    // stun buys nothing. Two enemies a turn.
    make(
      9,
      [
        bishop(5, 6),
        knight(4, 8),
        king(2, 7),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 12,
        hazards: alcoves(STACKS(5), X(1, 7), X(2, 7)),
        kingPen: ['a7', 'b7', 'a8', 'b8'],
      },
    ),
    // L10 — THE KEEP. One shaft (e). The plug is a frozen bishop at the very
    // top of it, e7, held by BOTH d8 and f8 — and at two enemies a turn a
    // shield only stops the first reply, so the second one kills her. f8 also
    // blocks the gallery, so it has to be eaten on the way, and it is the last
    // capturable thing on the board: nothing near his corner can ever be taken,
    // so no stun can be timed to his dodge. Drop the stone in the empty part of
    // the room, pull the bishop off its defenders, take it on e5, ride the
    // shaft, eat f8, step to g8, take him. MAGNET + BOULDER — every single card
    // in the kit reads exactly half of this level.
    make(
      10,
      [
        bishop(5, 7),
        pawn(4, 8), pawn(6, 8),
        king(7, 7),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 12,
        hazards: alcoves(STACKS(5), X(7, 7), X(8, 7)),
        kingPen: ['g7', 'h7', 'g8', 'h8'],
      },
    ),
  ],
};
