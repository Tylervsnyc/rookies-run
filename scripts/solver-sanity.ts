/**
 * Sanity check for lib/run/solver.ts — `npx tsx scripts/solver-sanity.ts`.
 * Exits non-zero if any expectation fails.
 */
import { isUnwinnable } from '../lib/run/solver';
import { puzzleToBoardState } from '../lib/run/seed';
import type { BoardState, RunPuzzle } from '../lib/run/types';

function make(p: Partial<RunPuzzle> & Pick<RunPuzzle, 'rookieStart' | 'pieces'>, patch: Partial<BoardState> = {}): BoardState {
  const puzzle: RunPuzzle = {
    level: 1,
    winCondition: 'king',
    kingBehavior: 'flee',
    moveLimit: 8,
    ...p,
  };
  const s = puzzleToBoardState(puzzle);
  return { ...s, rookie: { ...puzzle.rookieStart }, ...patch };
}

const cases: { name: string; state: BoardState; expect: boolean }[] = [
  {
    name: 'lone rook vs fleeing king mid-board, no charges',
    state: make({
      rookieStart: { file: 1, rank: 1 },
      pieces: [{ type: 'king', color: 'black', file: 5, rank: 5 }],
      moveLimit: 8,
    }),
    expect: true,
  },
  {
    name: 'corner trap: pawn blocks a7, pen a8/b8/b7, 3 moves needed, 4 left',
    state: make({
      rookieStart: { file: 8, rank: 1 },
      pieces: [
        { type: 'king', color: 'black', file: 1, rank: 8 },
        { type: 'pawn', color: 'black', file: 1, rank: 7 },
      ],
      kingPen: ['a8', 'b8', 'b7'],
      moveLimit: 4,
    }),
    expect: false,
  },
  {
    name: 'same corner trap with only 3 moves left (needs 3 + the move-limit rule)',
    state: make({
      rookieStart: { file: 8, rank: 1 },
      pieces: [
        { type: 'king', color: 'black', file: 1, rank: 8 },
        { type: 'pawn', color: 'black', file: 1, rank: 7 },
      ],
      kingPen: ['a8', 'b8', 'b7'],
      moveLimit: 3,
    }),
    expect: false,
  },
  {
    name: 'same corner trap with 2 moves left',
    state: make({
      rookieStart: { file: 8, rank: 1 },
      pieces: [
        { type: 'king', color: 'black', file: 1, rank: 8 },
        { type: 'pawn', color: 'black', file: 1, rank: 7 },
      ],
      kingPen: ['a8', 'b8', 'b7'],
      moveLimit: 2,
    }),
    expect: true,
  },
  {
    name: 'still king, rook can reach him',
    state: make({
      rookieStart: { file: 1, rank: 1 },
      pieces: [{ type: 'king', color: 'black', file: 5, rank: 5 }],
      moveLimit: 3,
      kingBehavior: 'still',
    }),
    expect: false,
  },
  {
    name: 'fleeing king mid-board but Rookie has a queen charge',
    state: make(
      {
        rookieStart: { file: 1, rank: 1 },
        pieces: [{ type: 'king', color: 'black', file: 5, rank: 5 }],
        moveLimit: 8,
      },
      { abilities: [{ id: 'queen-pulse', tier: 5, mutations: [], usesLeftThisLevel: 1 }] },
    ),
    expect: false,
  },
  {
    name: 'unmodelled ability with charges → never flagged',
    state: make(
      {
        rookieStart: { file: 1, rank: 1 },
        pieces: [{ type: 'king', color: 'black', file: 5, rank: 5 }],
        moveLimit: 8,
      },
      { abilities: [{ id: 'boulder', tier: 1, mutations: [], usesLeftThisLevel: 2 }] },
    ),
    expect: false,
  },
  {
    name: 'no move limit → never flagged',
    state: make({
      rookieStart: { file: 1, rank: 1 },
      pieces: [{ type: 'king', color: 'black', file: 5, rank: 5 }],
      moveLimit: undefined,
    }),
    expect: false,
  },
];

let failed = 0;
for (const c of cases) {
  const t0 = Date.now();
  const got = isUnwinnable(c.state);
  const ok = got === c.expect;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name}  → ${got} (${Date.now() - t0}ms)`);
}
process.exit(failed ? 1 : 0);
