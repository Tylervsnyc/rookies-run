/**
 * Per-level feature vector for Rookie's Revenge (capture-the-king).
 *
 * Revenge difficulty is about HOW MANY pieces stand between Rookie and the
 * king, not wall structure, so the vector is centered on piece counts and
 * the king's room ("pen"):
 *
 *   totalEnemies      enemy pieces excluding the king
 *   pawns / minors / majors   pawn count, knight+bishop, queen
 *   hunters           non-pawn, non-king pieces — pawn-ai approaches Rookie with these
 *   marchers          pawns — pawn-ai pushes them toward rank 1 (they hold posts when blocked)
 *   material          1·pawn + 3·minor + 9·queen
 *   hunterPower       3·minor + 9·queen (the roaming threat)
 *   guardsAdjacent    enemies within one square of the king
 *   keysOnKingLines   first piece on each of the king's 4 rook lines (walls stop the line)
 *   pawnDefendedKeys  keys whose square a pawn attacks (pawns don't leave their post)
 *   defendedKeys      keys attacked by any enemy
 *   freeKeys          keys nobody defends (take it: king stunned on your line)
 *   kingLineSquares   empty squares on the king's rook lines
 *   safeLineSquares   those not attacked by any enemy
 *   penArea           kingPen size (1 for a still king)
 *   penEmpty          pen squares with no enemy on them (his real room)
 *   penEnemies        enemies standing inside the pen
 *   penAttacked       pen squares attacked by non-king enemies
 *   walls             hazard count
 *   openSides         sides of the pen's bounding box (N/S/E/W) not sealed by walls/board edge
 *   kingFlees         1 if kingBehavior === 'flee'
 *   moveLimit         puzzle.moveLimit (30 when unlimited)
 *   enemiesPerTurn    enemies acting per enemy turn
 *   threatDensity     unique squares attacked by enemies
 *   approachAttacked  attacked squares on ranks 2–5 (the approach)
 *   distToKey         rook-move distance from the closest legal start file to any key
 *   distToKing        rook-move distance to the king's square (captures allowed along the way)
 *   budgetSlack       moveLimit − distToKing
 *   startFiles        how many rank-1 files Rookie can spawn on
 */

import { puzzleToBoardState } from '../../lib/run/seed';
import type { DifficultyId } from '../../lib/run/difficulty';
import { applyDifficulty } from '../../lib/run/apply-difficulty';
import type { Coord, EnemyPiece, RunPuzzle } from '../../lib/run/types';
import { fromSquare, toSquare } from '../../lib/run/types';
import { enemyAttackedSquares } from './bots/shared';
import { puzzleFor, startFilesFor, type RevengeCfg } from './revenge-core';

export type LevelMode = 'authored' | DifficultyId;

export interface RevengeFeatures {
  id: string;
  runId: string;
  level: number;
  mode: LevelMode;
  totalEnemies: number;
  pawns: number;
  minors: number;
  majors: number;
  hunters: number;
  marchers: number;
  material: number;
  hunterPower: number;
  guardsAdjacent: number;
  keysOnKingLines: number;
  pawnDefendedKeys: number;
  defendedKeys: number;
  freeKeys: number;
  kingLineSquares: number;
  safeLineSquares: number;
  penArea: number;
  penEmpty: number;
  penEnemies: number;
  penAttacked: number;
  walls: number;
  openSides: number;
  kingFlees: number;
  moveLimit: number;
  enemiesPerTurn: number;
  threatDensity: number;
  approachAttacked: number;
  distToKey: number;
  distToKing: number;
  budgetSlack: number;
  startFiles: number;
}

/** Numeric keys usable as regression inputs (everything but the identity fields). */
export const FEATURE_KEYS = [
  'totalEnemies', 'pawns', 'minors', 'majors', 'hunters', 'marchers', 'material', 'hunterPower',
  'guardsAdjacent', 'keysOnKingLines', 'pawnDefendedKeys', 'defendedKeys', 'freeKeys',
  'kingLineSquares', 'safeLineSquares', 'penArea', 'penEmpty', 'penEnemies', 'penAttacked',
  'walls', 'openSides', 'kingFlees', 'moveLimit', 'enemiesPerTurn', 'threatDensity',
  'approachAttacked', 'distToKey', 'distToKing', 'budgetSlack', 'startFiles',
] as const satisfies ReadonlyArray<keyof RevengeFeatures>;
export type FeatureKey = (typeof FEATURE_KEYS)[number];

/** Plain-English labels for the digest. */
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  totalEnemies: 'total enemies',
  pawns: 'pawns',
  minors: 'knights + bishops',
  majors: 'queens',
  hunters: 'hunters (non-pawn pieces that chase Rookie)',
  marchers: 'marchers (pawns pushing down the board)',
  material: 'total material',
  hunterPower: 'hunter power (3 per minor, 9 per queen)',
  guardsAdjacent: 'guards next to the king',
  keysOnKingLines: 'keys on the king\'s lines',
  pawnDefendedKeys: 'pawn-defended keys',
  defendedKeys: 'defended keys',
  freeKeys: 'undefended keys',
  kingLineSquares: 'empty squares on the king\'s lines',
  safeLineSquares: 'safe squares on the king\'s lines',
  penArea: 'pen size',
  penEmpty: 'empty pen squares',
  penEnemies: 'enemies inside the pen',
  penAttacked: 'pen squares under enemy fire',
  walls: 'walls',
  openSides: 'open sides of the pen',
  kingFlees: 'king flees',
  moveLimit: 'move budget',
  enemiesPerTurn: 'enemies per turn',
  threatDensity: 'squares under enemy fire',
  approachAttacked: 'approach squares under fire (ranks 2-5)',
  distToKey: 'rook moves to the nearest key',
  distToKing: 'rook moves to the king',
  budgetSlack: 'budget slack (moves minus distance to king)',
  startFiles: 'possible start files',
};

const ROOK_DIRS: ReadonlyArray<readonly [number, number]> = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function inBounds(f: number, r: number): boolean {
  return f >= 1 && f <= 8 && r >= 1 && r <= 8;
}

/** Features for one level of a run under an optional difficulty mode. */
export function extractRevengeFeatures(cfg: RevengeCfg, level: number): RevengeFeatures {
  const mode: LevelMode = cfg.difficulty ?? 'authored';
  const authored = puzzleFor(cfg, level);
  const puzzle = cfg.difficulty ? applyDifficulty(authored, cfg.difficulty) : authored;
  // A board state gives us the engine's own attack map (same code the bots read).
  const state = puzzleToBoardState(puzzle, { runId: cfg.runId, abilities: [] });

  const king = puzzle.pieces.find((p) => p.type === 'king');
  const enemies = puzzle.pieces.filter((p) => p.type !== 'king');
  const pawns = enemies.filter((p) => p.type === 'pawn').length;
  const knights = enemies.filter((p) => p.type === 'knight').length;
  const bishops = enemies.filter((p) => p.type === 'bishop').length;
  const queens = enemies.filter((p) => p.type === 'queen').length;
  const minors = knights + bishops;
  const hunters = enemies.length - pawns;
  const hazards = puzzle.hazards ?? [];
  const isHazard = (f: number, r: number) => hazards.some((h) => h.file === f && h.rank === r);
  const pieceAt = (f: number, r: number): EnemyPiece | undefined =>
    puzzle.pieces.find((p) => p.file === f && p.rank === r);

  const attacked = enemyAttackedSquares({ ...state, pieces: state.pieces.filter((p) => p.type !== 'king') });
  const pawnAttacked = pawnAttackSquares(enemies);

  // King's rook lines: keys + empty line squares.
  let keysOnKingLines = 0;
  let pawnDefendedKeys = 0;
  let defendedKeys = 0;
  let kingLineSquares = 0;
  let safeLineSquares = 0;
  const keySquares: Coord[] = [];
  let guardsAdjacent = 0;
  if (king) {
    for (const [df, dr] of ROOK_DIRS) {
      let f = king.file + df;
      let r = king.rank + dr;
      while (inBounds(f, r)) {
        if (isHazard(f, r)) break;
        const piece = pieceAt(f, r);
        const sq = toSquare({ file: f, rank: r });
        if (piece) {
          keysOnKingLines++;
          keySquares.push({ file: f, rank: r });
          if (pawnAttacked.has(sq)) pawnDefendedKeys++;
          if (attacked.has(sq)) defendedKeys++;
          break;
        }
        kingLineSquares++;
        if (!attacked.has(sq)) safeLineSquares++;
        f += df;
        r += dr;
      }
    }
    for (const p of enemies) {
      if (Math.max(Math.abs(p.file - king.file), Math.abs(p.rank - king.rank)) === 1) guardsAdjacent++;
    }
  }

  // Pen.
  const pen = (puzzle.kingPen && puzzle.kingPen.length > 0)
    ? puzzle.kingPen.map(fromSquare)
    : king ? [{ file: king.file, rank: king.rank }] : [];
  const penSet = new Set(pen.map((c) => toSquare(c)));
  const penEnemies = enemies.filter((p) => penSet.has(toSquare(p))).length;
  const penEmpty = pen.length - penEnemies;
  const penAttacked = pen.filter((c) => attacked.has(toSquare(c))).length;
  let openSides = 0;
  if (pen.length > 0) {
    const minF = Math.min(...pen.map((c) => c.file));
    const maxF = Math.max(...pen.map((c) => c.file));
    const minR = Math.min(...pen.map((c) => c.rank));
    const maxR = Math.max(...pen.map((c) => c.rank));
    const sideOpen = (cells: Coord[]) =>
      cells.some((c) => inBounds(c.file, c.rank) && !isHazard(c.file, c.rank) && !pieceAt(c.file, c.rank));
    const files = Array.from({ length: maxF - minF + 1 }, (_, i) => minF + i);
    const ranks = Array.from({ length: maxR - minR + 1 }, (_, i) => minR + i);
    if (sideOpen(files.map((f) => ({ file: f, rank: maxR + 1 })))) openSides++;
    if (sideOpen(files.map((f) => ({ file: f, rank: minR - 1 })))) openSides++;
    if (sideOpen(ranks.map((r) => ({ file: maxF + 1, rank: r })))) openSides++;
    if (sideOpen(ranks.map((r) => ({ file: minF - 1, rank: r })))) openSides++;
  }

  // Threat.
  let approachAttacked = 0;
  for (const sq of attacked) {
    const c = fromSquare(sq);
    if (c.rank >= 2 && c.rank <= 5) approachAttacked++;
  }

  // Distances from the possible start files.
  const startFiles = startFilesFor(puzzle);
  const startRank = puzzle.rookieStart.rank;
  const dist = rookDistances(puzzle, startFiles.map((f) => ({ file: f, rank: startRank })));
  const d = (c: Coord) => dist.get(toSquare(c)) ?? 99;
  const distToKey = keySquares.length ? Math.min(...keySquares.map(d)) : 99;
  const distToKing = king ? d({ file: king.file, rank: king.rank }) : 99;
  const moveLimit = puzzle.moveLimit ?? 30;

  return {
    id: `${cfg.runId}/L${level}/${mode}`,
    runId: cfg.runId,
    level,
    mode,
    totalEnemies: enemies.length,
    pawns,
    minors,
    majors: queens,
    hunters,
    marchers: pawns,
    material: pawns + 3 * minors + 9 * queens,
    hunterPower: 3 * minors + 9 * queens,
    guardsAdjacent,
    keysOnKingLines,
    pawnDefendedKeys,
    defendedKeys,
    freeKeys: keysOnKingLines - defendedKeys,
    kingLineSquares,
    safeLineSquares,
    penArea: pen.length,
    penEmpty,
    penEnemies,
    penAttacked,
    walls: hazards.length,
    openSides,
    kingFlees: (puzzle.kingBehavior ?? 'still') === 'flee' ? 1 : 0,
    moveLimit,
    enemiesPerTurn: puzzle.enemiesPerTurn ?? 1,
    threatDensity: attacked.size,
    approachAttacked,
    distToKey: Math.min(distToKey, 30),
    distToKing: Math.min(distToKing, 30),
    budgetSlack: moveLimit - Math.min(distToKing, 30),
    startFiles: startFiles.length,
  };
}

/** Squares black pawns attack (diagonally toward rank 1). */
function pawnAttackSquares(pieces: EnemyPiece[]): Set<string> {
  const out = new Set<string>();
  for (const p of pieces) {
    if (p.type !== 'pawn') continue;
    for (const df of [-1, 1]) {
      const f = p.file + df;
      const r = p.rank - 1;
      if (inBounds(f, r)) out.add(toSquare({ file: f, rank: r }));
    }
  }
  return out;
}

/**
 * BFS over rook moves from a set of start squares. A slide stops at a wall or
 * the square before the board edge; a square holding an enemy can be landed
 * on (a capture) and continued from — so this is "moves to get there if you
 * may take whatever is in the way", a lower bound on the real path.
 */
function rookDistances(puzzle: RunPuzzle, starts: Coord[]): Map<string, number> {
  const hazards = new Set((puzzle.hazards ?? []).map((h) => toSquare(h)));
  const pieces = new Set(puzzle.pieces.map((p) => toSquare(p)));
  const dist = new Map<string, number>();
  const queue: Coord[] = [];
  for (const s of starts) {
    dist.set(toSquare(s), 0);
    queue.push(s);
  }
  while (queue.length) {
    const cur = queue.shift()!;
    const dc = dist.get(toSquare(cur))!;
    for (const [df, dr] of ROOK_DIRS) {
      let f = cur.file + df;
      let r = cur.rank + dr;
      while (inBounds(f, r)) {
        const sq = toSquare({ file: f, rank: r });
        if (hazards.has(sq)) break;
        if (!dist.has(sq)) {
          dist.set(sq, dc + 1);
          queue.push({ file: f, rank: r });
        }
        if (pieces.has(sq)) break; // capture ends the slide
        f += df;
        r += dr;
      }
    }
  }
  return dist;
}

/** Feature rows for every level of a run under one mode. */
export function featuresForRun(cfg: RevengeCfg, levels: number[]): RevengeFeatures[] {
  return levels.map((lv) => extractRevengeFeatures(cfg, lv));
}
