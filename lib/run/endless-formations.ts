/**
 * ENDLESS FORMATIONS — the ingredient that keeps depth 15+ getting harder.
 *
 * Tyler, 2026-09-09 endless playtest: "level 16 was really hard, level 17 had
 * a wild formation, after that it was just more pieces" — and a maxed card
 * (Aegis T5) won every level from there on. The existing ramp has three knobs
 * (mode, overdrive, reinforcements) and all three only add BODIES on random
 * safe squares. Random bodies do not make a board hard; a rook slides past
 * them. What made 16 and 17 hard was STRUCTURE — an authored level whose
 * pieces cover each other and shape the route.
 *
 * So from FORMATION_FROM on, every level gets a FORMATION laid over the
 * authored board before reinforcements land: one of FORMATION_IDS, built from
 * what the level-design notes say makes a level hard here
 * (.claude/run-level-design.md — Iron Curtain = layered pawn walls + defended
 * chains as the fun-hard template; walls that force a route; a boxed-in king;
 * hunters covering the approach files; terrain-anchored routes):
 *
 *   iron-curtain    layered pawn walls with one gap each, gap guarded (rank 5, then 6, then 4)
 *   knight-ring     knights on the ring two squares out from the king — every approach square is attacked
 *   bishop-cross    bishops on the king's diagonals, pawns defending them, a third on his file
 *   queen-battery   a queen on the king's rank behind a pawn shield; second queen deep
 *   pawn-box        a box of pawns two out from the king with one door, a knight watching the door
 *   defended-chain  pawn chains running down-and-out from his flanks (each pawn defends the one below)
 *   file-gauntlet   knights + bishops + a queen covering ranks 3-4: Rookie's approach files
 *   stone-gates     a stone wall across rank 4 with two gates, a queen and a knight behind them
 *
 * Each template is PARAMETERIZED by intensity 1-5 (`formationIntensityAt`):
 * more layers, more guards, more of the perimeter filled. Intensity is
 * monotone non-decreasing in depth, so the layer can only ever add pressure.
 * Every SIGNATURE_EVERY-th level from FORMATION_FROM is a SIGNATURE: the
 * primary template one intensity up, plus a second template at intensity 1
 * on top — the "wild" boards Tyler remembers, on a schedule.
 *
 * FAIRNESS, which is the whole reason this is a module and not a piece list:
 *   - nothing on Rookie's start rank or the rank ahead of it (she can never
 *     be taken before her first move, and her start square is always free);
 *   - nothing in the king's pen and nothing adjacent to him (a capture square
 *     always exists);
 *   - every placement is checked against `rookPathToKing`: a plain-rook
 *     route from EVERY square Rookie could start on must still exist, inside
 *     the level's move budget. A placement that would seal the king or push
 *     the shortest route past the budget is simply skipped. The board can be
 *     brutal; it can never be a board with no legal path to the king.
 *
 * Everything is drawn from (session seed, depth), so a depth is the same board
 * across reloads — the contract the rest of Endless already keeps.
 */

import { mulberry32 } from './seed';
import { fromSquare, type Coord, type EnemyPiece, type Hazard, type PieceType, type RunPuzzle } from './types';

/** First depth (1-based level number) that carries a formation. */
export const FORMATION_FROM = 15;
/** Every this-many levels from FORMATION_FROM is a signature (double) formation. */
export const SIGNATURE_EVERY = 3;
/** Intensity climbs one step every this-many levels. */
const INTENSITY_EVERY = 4;
export const MAX_INTENSITY = 5;
/** A formation never adds more than this many pieces/stones to one level. */
const MAX_FORMATION_PLACEMENTS = 12;
/** A template that lands fewer than this many placements is swapped for the next one. */
const MIN_FORMATION_PLACEMENTS = 2;
/** Hard ceiling on enemies after a formation (reinforcements add more later). */
const MAX_PIECES_AFTER_FORMATION = 30;

export const FORMATION_IDS = [
  'iron-curtain',
  'knight-ring',
  'bishop-cross',
  'queen-battery',
  'pawn-box',
  'defended-chain',
  'file-gauntlet',
  'stone-gates',
] as const;
export type FormationId = (typeof FORMATION_IDS)[number];

export interface FormationPick {
  id: FormationId;
  /** 1..MAX_INTENSITY */
  intensity: number;
  signature: boolean;
  /** Only on a signature depth: the second template, applied at intensity 1. */
  secondary?: FormationId;
}

/** 0 below FORMATION_FROM, then 1 and one step up every INTENSITY_EVERY levels. */
export function formationIntensityAt(depth: number): number {
  const d = Math.floor(depth);
  if (d < FORMATION_FROM) return 0;
  return Math.min(MAX_INTENSITY, 1 + Math.floor((d - FORMATION_FROM) / INTENSITY_EVERY));
}

export function isSignatureDepth(depth: number): boolean {
  const d = Math.floor(depth);
  return d >= FORMATION_FROM && (d - FORMATION_FROM) % SIGNATURE_EVERY === 0;
}

function rngFor(seed: number, depth: number, salt: number): () => number {
  return mulberry32((((seed >>> 0) ^ Math.imul(depth, 0x9e3779b9) ^ Math.imul(salt + 1, 0x85ebca6b)) >>> 0) || 1);
}

function rawFormationIndex(seed: number, depth: number): number {
  return Math.floor(rngFor(seed, depth, 0)() * FORMATION_IDS.length);
}

/** Which formation depth `depth` draws. Deterministic; never repeats the previous depth's template. */
export function formationForDepth(seed: number, depth: number): FormationPick | null {
  const d = Math.floor(depth);
  const base = formationIntensityAt(d);
  if (base === 0) return null;
  let idx = rawFormationIndex(seed, d);
  if (d > FORMATION_FROM && idx === rawFormationIndex(seed, d - 1)) idx = (idx + 1) % FORMATION_IDS.length;
  const signature = isSignatureDepth(d);
  if (!signature) return { id: FORMATION_IDS[idx], intensity: base, signature: false };
  const secondaryIdx = (idx + 1 + Math.floor(rngFor(seed, d, 1)() * (FORMATION_IDS.length - 1))) % FORMATION_IDS.length;
  return {
    id: FORMATION_IDS[idx],
    intensity: Math.min(MAX_INTENSITY, base + 1),
    signature: true,
    secondary: FORMATION_IDS[secondaryIdx],
  };
}

// ── Reachability — the fairness check ────────────────────────────────────────

/**
 * Shortest plain-rook route to the king, ignoring enemy replies: rays stop at
 * hazards (exclusive) and at the first enemy piece (inclusive — that is a
 * capture, and the next move continues from there). Captured pieces are NOT
 * removed, which only ever under-counts routes, so a path found here is a
 * path that exists. Measured from EVERY square Rookie could start on (free
 * squares of her start rank); returns the worst of those, or null if any
 * start has no route.
 */
export function rookPathToKing(puzzle: RunPuzzle): number | null {
  const king = puzzle.pieces.find((p) => p.type === 'king');
  if (!king) return null;
  const hazard = new Set((puzzle.hazards ?? []).map((h) => `${h.file},${h.rank}`));
  const piece = new Map<string, EnemyPiece>();
  for (const p of puzzle.pieces) piece.set(`${p.file},${p.rank}`, p);
  const startRank = puzzle.rookieStart.rank;
  const starts: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    const k = `${f},${startRank}`;
    if (!hazard.has(k) && !piece.has(k)) starts.push({ file: f, rank: startRank });
  }
  if (starts.length === 0) return null;

  let worst = 0;
  for (const start of starts) {
    const d = bfs(start, king, hazard, piece);
    if (d === null) return null;
    worst = Math.max(worst, d);
  }
  return worst;
}

const ROOK_DIRS: ReadonlyArray<[number, number]> = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function bfs(start: Coord, king: Coord, hazard: Set<string>, piece: Map<string, EnemyPiece>): number | null {
  const dist = new Map<string, number>();
  const q: Coord[] = [start];
  dist.set(`${start.file},${start.rank}`, 0);
  while (q.length) {
    const cur = q.shift()!;
    const d = dist.get(`${cur.file},${cur.rank}`)!;
    for (const [df, dr] of ROOK_DIRS) {
      let f = cur.file + df;
      let r = cur.rank + dr;
      while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
        const k = `${f},${r}`;
        if (hazard.has(k)) break;
        if (f === king.file && r === king.rank) return d + 1;
        const blocked = piece.has(k);
        if (!dist.has(k)) {
          dist.set(k, d + 1);
          q.push({ file: f, rank: r });
        }
        if (blocked) break; // capture — the ray ends here
        f += df;
        r += dr;
      }
    }
  }
  return null;
}

// ── Placement ────────────────────────────────────────────────────────────────

export interface Placement {
  file: number;
  rank: number;
  /** An enemy piece, or a loose stone hazard. */
  what: Exclude<PieceType, 'king'> | 'stone';
}

interface Geometry {
  king: Coord;
  startRank: number;
  /** The rank right in front of Rookie's start rank. */
  ahead: number;
  /** -1: the king sits high and Rookie climbs; +1 would be the mirror. */
  down: number;
  intensity: number;
  rng: () => number;
}

/** Rank `n` steps from the king toward Rookie. */
function below(g: Geometry, n: number): number {
  return g.king.rank + g.down * n;
}

/** Which way along the files has more room from the king (+1 or -1). */
function wideSide(g: Geometry): 1 | -1 {
  return g.king.file <= 4 ? 1 : -1;
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Iron Curtain: a pawn wall on rank 5 with one gap; layers on 6 and 4 as intensity climbs; the gap gets a knight. */
function ironCurtain(g: Geometry): Placement[] {
  const out: Placement[] = [];
  const wallRank = g.startRank + 4 * -g.down; // rank 5 when Rookie starts on 1
  const gap = 1 + Math.floor(g.rng() * 8);
  for (let f = 1; f <= 8; f++) if (f !== gap) out.push({ file: f, rank: wallRank, what: 'pawn' });
  if (g.intensity >= 2) {
    const gap2 = ((gap - 1 + 3 + Math.floor(g.rng() * 3)) % 8) + 1;
    const second = wallRank - g.down; // one rank closer to the king
    for (let f = 1; f <= 8; f += 1) if (f !== gap2 && (f + g.intensity) % 2 === 0) out.push({ file: f, rank: second, what: 'pawn' });
  }
  if (g.intensity >= 3) {
    // A knight two ranks behind the gap, one file over — it attacks the gap square.
    const guardRank = wallRank - 2 * g.down;
    out.push({ file: gap + (gap < 8 ? 1 : -1), rank: guardRank, what: 'knight' });
  }
  if (g.intensity >= 4) {
    const third = wallRank + g.down; // one rank closer to Rookie
    for (let f = 2; f <= 8; f += 3) out.push({ file: f, rank: third, what: 'pawn' });
  }
  if (g.intensity >= 5) out.push({ file: gap, rank: wallRank - 3 * g.down, what: 'bishop' });
  return out;
}

/** The 16 squares at Chebyshev distance 2 from the king, on-board, closest-to-Rookie first. */
function ringSquares(g: Geometry, radius: number): Coord[] {
  const sq: Coord[] = [];
  for (let df = -radius; df <= radius; df++) {
    for (let dr = -radius; dr <= radius; dr++) {
      if (Math.max(Math.abs(df), Math.abs(dr)) !== radius) continue;
      const c = { file: g.king.file + df, rank: g.king.rank + dr };
      if (c.file < 1 || c.file > 8 || c.rank < 1 || c.rank > 8) continue;
      sq.push(c);
    }
  }
  // Squares on Rookie's side of the king first — those are the ones she meets.
  return sq.sort((a, b) => (b.rank - a.rank) * g.down);
}

/** Knight ring: knights spaced around the king two squares out. */
function knightRing(g: Geometry): Placement[] {
  const ring = ringSquares(g, 2);
  const count = Math.min(ring.length, 2 + g.intensity);
  const step = Math.max(1, Math.floor(ring.length / count));
  const offset = Math.floor(g.rng() * step);
  const out: Placement[] = [];
  for (let i = offset; i < ring.length && out.length < count; i += step) {
    out.push({ file: ring[i].file, rank: ring[i].rank, what: 'knight' });
  }
  if (g.intensity >= 4) {
    for (const df of [-1, 1]) out.push({ file: g.king.file + df, rank: below(g, 3), what: 'pawn' });
  }
  return out;
}

/** Bishop cross: bishops on both of the king's diagonals below him; pawns defend them. */
function bishopCross(g: Geometry): Placement[] {
  const out: Placement[] = [];
  const dist = 2 + (g.intensity >= 4 ? 1 : 0);
  for (const s of [-1, 1]) out.push({ file: g.king.file + s * dist, rank: below(g, dist), what: 'bishop' });
  if (g.intensity >= 2) {
    // A pawn one rank above each bishop, one file inward, defends the bishop's square.
    for (const s of [-1, 1]) out.push({ file: g.king.file + s * (dist - 1), rank: below(g, dist - 1) , what: 'pawn' });
  }
  if (g.intensity >= 3) out.push({ file: g.king.file, rank: below(g, 3), what: 'bishop' });
  if (g.intensity >= 4) for (const s of [-1, 1]) out.push({ file: g.king.file + s * 2, rank: below(g, 2), what: 'bishop' });
  if (g.intensity >= 5) for (const s of [-1, 1]) out.push({ file: g.king.file + s * 3, rank: below(g, 4), what: 'knight' });
  return out;
}

/** Queen battery: a queen on the king's rank behind a pawn shield; a second queen deep at intensity 3+. */
function queenBattery(g: Geometry): Placement[] {
  const out: Placement[] = [];
  const s = wideSide(g);
  const qf = g.king.file + s * 3;
  out.push({ file: qf, rank: g.king.rank, what: 'queen' });
  if (g.intensity >= 2) {
    for (const df of [-1, 0, 1]) out.push({ file: qf + df, rank: below(g, 1), what: 'pawn' });
  }
  if (g.intensity >= 3) out.push({ file: g.king.file - s * 2, rank: below(g, 2), what: 'queen' });
  if (g.intensity >= 4) out.push({ file: qf - s, rank: below(g, 2), what: 'bishop' });
  if (g.intensity >= 5) for (const df of [-2, 2]) out.push({ file: g.king.file + df, rank: below(g, 3), what: 'knight' });
  return out;
}

/** Pawn box: the ring two out from the king filled with pawns, one door, a knight watching it. */
function pawnBox(g: Geometry): Placement[] {
  const ring = ringSquares(g, 2);
  const bottom = ring.filter((c) => c.rank === below(g, 2));
  const door = pick(bottom.length ? bottom : ring, g.rng);
  const sides = ring.filter((c) => c.rank !== below(g, 2) && c.rank !== below(g, -2));
  const top = ring.filter((c) => c.rank === below(g, -2));
  const chosen: Coord[] = [...bottom];
  if (g.intensity >= 2) chosen.push(...sides);
  if (g.intensity >= 3) chosen.push(...top);
  const out: Placement[] = chosen
    .filter((c) => !(c.file === door.file && c.rank === door.rank))
    .map((c) => ({ file: c.file, rank: c.rank, what: 'pawn' as const }));
  if (g.intensity >= 4) out.push({ file: door.file + (door.file < 8 ? 1 : -1), rank: below(g, 4), what: 'knight' });
  if (g.intensity >= 5) for (const df of [-3, 3]) out.push({ file: g.king.file + df, rank: below(g, 3), what: 'pawn' });
  return out;
}

/** Defended chain: pawns running down-and-out from the king's flank, each defending the one below. */
function defendedChain(g: Geometry): Placement[] {
  const out: Placement[] = [];
  const len = 2 + g.intensity; // 3..7 links
  const primary = wideSide(g);
  const sides: Array<1 | -1> = g.intensity >= 3 ? [primary, (-primary) as 1 | -1] : [primary];
  for (const s of sides) {
    for (let i = 0; i < len; i++) {
      out.push({ file: g.king.file + s * (2 + i), rank: below(g, 1 + i), what: 'pawn' });
    }
    if (g.intensity >= 4) out.push({ file: g.king.file + s * 2, rank: g.king.rank, what: 'bishop' });
  }
  if (g.intensity >= 5) out.push({ file: g.king.file, rank: below(g, 4), what: 'knight' });
  return out;
}

/** File gauntlet: hunters on ranks 3-4 covering the files Rookie has to climb. */
function fileGauntlet(g: Geometry): Placement[] {
  const out: Placement[] = [];
  const r3 = g.startRank + 2 * -g.down;
  const r4 = g.startRank + 3 * -g.down;
  const r5 = g.startRank + 4 * -g.down;
  const shift = Math.floor(g.rng() * 2);
  out.push({ file: 3 + shift, rank: r4, what: 'knight' }, { file: 6 + shift, rank: r4, what: 'knight' });
  if (g.intensity >= 2) out.push({ file: 2, rank: r3, what: 'bishop' }, { file: 7, rank: r3, what: 'bishop' });
  if (g.intensity >= 3) {
    out.push({ file: g.king.file, rank: r4, what: 'queen' });
    for (const df of [-1, 1]) out.push({ file: g.king.file + df, rank: r5, what: 'pawn' });
  }
  if (g.intensity >= 4) out.push({ file: 1 + shift, rank: r5, what: 'knight' }, { file: 8 - shift, rank: r5, what: 'knight' });
  if (g.intensity >= 5) out.push({ file: 4, rank: r5, what: 'bishop' }, { file: 5, rank: r5, what: 'bishop' });
  return out;
}

/** Stone gates: a stone wall across rank 4 with two gates; a queen and a knight behind them. */
function stoneGates(g: Geometry): Placement[] {
  const out: Placement[] = [];
  const wallRank = g.startRank + 3 * -g.down; // rank 4
  const g1 = 1 + Math.floor(g.rng() * 4);
  const g2 = 5 + Math.floor(g.rng() * 4);
  for (let f = 1; f <= 8; f++) if (f !== g1 && f !== g2) out.push({ file: f, rank: wallRank, what: 'stone' });
  if (g.intensity >= 2) out.push({ file: g1, rank: wallRank - 2 * g.down, what: 'queen' });
  if (g.intensity >= 3) out.push({ file: g2 + (g2 < 8 ? 1 : -1), rank: wallRank - 2 * g.down, what: 'knight' });
  if (g.intensity >= 4) {
    const second = wallRank - 2 * g.down; // rank 6
    const g3 = pick([g1, g2], g.rng);
    for (let f = 1; f <= 8; f += 2) if (f !== g3) out.push({ file: f, rank: second, what: 'stone' });
  }
  if (g.intensity >= 5) for (const f of [g1, g2]) out.push({ file: f, rank: wallRank - g.down, what: 'pawn' });
  return out;
}

const BLUEPRINTS: Record<FormationId, (g: Geometry) => Placement[]> = {
  'iron-curtain': ironCurtain,
  'knight-ring': knightRing,
  'bishop-cross': bishopCross,
  'queen-battery': queenBattery,
  'pawn-box': pawnBox,
  'defended-chain': defendedChain,
  'file-gauntlet': fileGauntlet,
  'stone-gates': stoneGates,
};

/** The raw blueprint for a template — before any fairness filtering. Exposed for tests. */
export function formationBlueprint(id: FormationId, puzzle: RunPuzzle, intensity: number, rng: () => number): Placement[] {
  const king = puzzle.pieces.find((p) => p.type === 'king');
  if (!king) return [];
  const startRank = puzzle.rookieStart.rank;
  const down = startRank <= 4 ? -1 : 1;
  const g: Geometry = {
    king: { file: king.file, rank: king.rank },
    startRank,
    ahead: startRank - down,
    down,
    intensity: Math.max(1, Math.min(MAX_INTENSITY, Math.floor(intensity))),
    rng,
  };
  return BLUEPRINTS[id](g);
}

export interface ApplyFormationOpts {
  /**
   * Move budget the shortest rook route must fit inside (the level's
   * EFFECTIVE move limit after every ramp delta). Omit = no budget check.
   */
  moveBudget?: number;
}

/**
 * Lay `placements` onto the puzzle in order, skipping any that break the
 * fairness rules (see the file header). Pure. Used by formations AND — via
 * endless.ts — as the last line of defence for reinforcements.
 */
export function placeFairly(puzzle: RunPuzzle, placements: Placement[], opts: ApplyFormationOpts = {}, max = MAX_FORMATION_PLACEMENTS): RunPuzzle {
  const king = puzzle.pieces.find((p) => p.type === 'king');
  if (!king) return puzzle;
  const startRank = puzzle.rookieStart.rank;
  const ahead = startRank <= 4 ? startRank + 1 : startRank - 1;
  const goalRank = puzzle.winCondition === 'king' ? 0 : 8;
  const base = rookPathToKing(puzzle);
  if (base === null) return puzzle; // never make an already-unproven board worse
  const budget = Math.max(base, opts.moveBudget ?? Infinity);

  const taken = new Set<string>();
  for (const p of puzzle.pieces) taken.add(`${p.file},${p.rank}`);
  for (const h of puzzle.hazards ?? []) taken.add(`${h.file},${h.rank}`);
  const pen = new Set<string>();
  for (const sq of puzzle.kingPen ?? []) {
    const c = fromSquare(sq);
    pen.add(`${c.file},${c.rank}`);
  }

  let pieces: EnemyPiece[] = [...puzzle.pieces];
  let hazards: Hazard[] = [...(puzzle.hazards ?? [])];
  let added = 0;
  for (const pl of placements) {
    if (added >= max) break;
    if (pl.file < 1 || pl.file > 8 || pl.rank < 1 || pl.rank > 8) continue;
    if (pl.rank === startRank || pl.rank === ahead || pl.rank === goalRank) continue;
    const k = `${pl.file},${pl.rank}`;
    if (taken.has(k) || pen.has(k)) continue;
    if (Math.max(Math.abs(king.file - pl.file), Math.abs(king.rank - pl.rank)) <= 1) continue;
    if (pl.what !== 'stone' && pieces.length >= MAX_PIECES_AFTER_FORMATION) continue;

    const nextPieces = pl.what === 'stone' ? pieces : [...pieces, { type: pl.what, color: 'black' as const, file: pl.file, rank: pl.rank }];
    const nextHazards = pl.what === 'stone' ? [...hazards, { file: pl.file, rank: pl.rank, kind: 'stone' as const }] : hazards;
    const trial: RunPuzzle = { ...puzzle, pieces: nextPieces, hazards: nextHazards };
    const path = rookPathToKing(trial);
    if (path === null || path > budget) continue; // would seal him, or cost the clock — skip

    pieces = nextPieces;
    hazards = nextHazards;
    taken.add(k);
    added++;
  }
  if (added === 0) return puzzle;
  return { ...puzzle, pieces, hazards };
}

/** Pieces + stones `after` carries that `before` did not. */
function added(before: RunPuzzle, after: RunPuzzle): number {
  return after.pieces.length - before.pieces.length + ((after.hazards?.length ?? 0) - (before.hazards?.length ?? 0));
}

/**
 * The formation for depth `depth` on `puzzle`. Returns the puzzle untouched
 * below FORMATION_FROM. Pure; seeded by (seed, depth).
 */
export function applyFormation(puzzle: RunPuzzle, depth: number, seed = 1, opts: ApplyFormationOpts = {}): RunPuzzle {
  const pick = formationForDepth(seed, depth);
  if (!pick) return puzzle;
  const primary = formationBlueprint(pick.id, puzzle, pick.intensity, rngFor(seed, depth, 2));
  let out = placeFairly(puzzle, primary, opts);
  // No room for that shape on this board (ring full, pen in the way ...):
  // fall through to the next template so the depth still carries structure.
  if (added(puzzle, out) < MIN_FORMATION_PLACEMENTS) {
    const fallback = FORMATION_IDS[(FORMATION_IDS.indexOf(pick.id) + 1) % FORMATION_IDS.length];
    out = placeFairly(puzzle, formationBlueprint(fallback, puzzle, pick.intensity, rngFor(seed, depth, 4)), opts);
  }
  if (pick.secondary) {
    const secondary = formationBlueprint(pick.secondary, out, 1, rngFor(seed, depth, 3));
    out = placeFairly(out, secondary, opts, Math.max(0, MAX_FORMATION_PLACEMENTS - added(puzzle, out)));
  }
  return out;
}

/** HUD-friendly name, e.g. "IRON CURTAIN" / "STONE GATES ×2". */
export function formationLabel(pick: FormationPick | null): string {
  if (!pick) return '';
  const name = pick.id.replace('-', ' ').toUpperCase();
  return pick.signature ? `${name} ×2` : name;
}
