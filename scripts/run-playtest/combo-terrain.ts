/**
 * Rookie's Revenge — TERRAIN candidate generator for combo-discover.ts.
 *
 * Why this exists: `revenge-generate.ts`'s six archetypes vary PIECE DENSITY,
 * and they are tuned to the revenge-1 difficulty band (L10 targets ~30% for a
 * bare rook). Measured 2026-09-05, every one of its 288 candidates at slots
 * 5-10 read 30-100% with no ability at all — so none of them can ever be
 * combo-gated, which needs a bare-rook rate of ~0%.
 *
 * The shipped combo gates get their 0% from TERRAIN, not from pieces:
 *
 *   Colonnade L8  hazards b4 d4 f4 h4 / a5 c5 e5 g5  — a STAGGERED barrier.
 *                 Every file and rank into the upper board is stopped, but the
 *                 diagonals between the stones are open, which is why a
 *                 summoned bishop plus Swap is the answer and a rook is not.
 *   Moat L6       hazards a5 b5 c5 d5 f5 g5 h5 + e4 e6 — a SOLID moat with one
 *                 plugged gate, and the king sealed in a corner court.
 *
 * So this generator builds barrier families parametrically and lets the
 * harness discover which PAIR cracks which barrier. Everything is deterministic
 * from (family, slot, variant, seed) so a worker process can rebuild the exact
 * same puzzle from the options alone — the same contract buildCandidates() has.
 *
 * Families
 *   checker   staggered two-row barrier (Colonnade). Rook-proof, diagonal-open.
 *   moat      solid row with one plugged gate (Moat). Sealed except the gate.
 *   vault     hazard box around the pen with a single diagonal mouth.
 *   comb      full-height hazard columns with narrow slots between them.
 *
 * Nothing here writes to lib/run.
 */

import { mulberry32 } from '../../lib/run/seed';
import type { Coord, EnemyPiece, PieceType, RunPuzzle } from '../../lib/run/types';
import { toSquare } from '../../lib/run/types';

type RNG = () => number;

const mk = (type: PieceType) => (file: number, rank: number): EnemyPiece => ({ type, color: 'black', file, rank });
const pawn = mk('pawn');
const knight = mk('knight');
const bishop = mk('bishop');
const queen = mk('queen');
const king = mk('king');

const inB = (f: number, r: number) => f >= 1 && f <= 8 && r >= 1 && r <= 8;
const sq = (f: number, r: number) => `${f},${r}`;
const pickOne = <T,>(rng: RNG, xs: readonly T[]): T => xs[Math.floor(rng() * xs.length)];
const randInt = (rng: RNG, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));

export interface TerrainCandidate {
  id: string;
  family: string;
  slot: number;
  title: string;
  idea: string;
  puzzle: RunPuzzle;
  /** Paste-ready runs.ts snippet. */
  snippet: string;
  lintErrors: string[];
}

export interface TerrainOpts {
  slots: number[];
  variants: number;
  seed: number;
  families?: string[];
}

export const TERRAIN_FAMILIES = ['checker', 'moat', 'vault', 'comb', 'court', 'open', 'recapture'];

interface Build {
  title: string;
  idea: string;
  hazards: Coord[];
  pieces: EnemyPiece[];
  pen: string[];
  moveLimit: number;
}

/** A 1x3 or 2x2 court for the king, plus the pawn wall guarding its front. */
function court(rng: RNG, kf: number, wide: boolean): { pen: string[]; kingAt: Coord; wall: EnemyPiece[]; sealed: Coord[] } {
  const f0 = Math.min(Math.max(kf - (wide ? 0 : 1), 1), wide ? 7 : 6);
  const pen: string[] = [];
  const kingAt = { file: wide ? f0 : f0 + 1, rank: 8 };
  if (wide) {
    for (const r of [7, 8]) for (const f of [f0, f0 + 1]) pen.push(toSquare({ file: f, rank: r }));
  } else {
    for (const f of [f0, f0 + 1, f0 + 2]) pen.push(toSquare({ file: f, rank: 8 }));
  }
  // Pawn wall on rank 7 in front of the pen — each pawn defended by the next.
  const wall: EnemyPiece[] = [];
  if (!wide) for (const f of [f0, f0 + 1, f0 + 2]) if (inB(f, 7)) wall.push(pawn(f, 7));
  // Stones that stop the pen leaking sideways along rank 8.
  const sealed: Coord[] = [];
  const left = f0 - 1, right = f0 + (wide ? 2 : 3);
  if (inB(left, 8) && rng() < 0.7) sealed.push({ file: left, rank: 8 });
  if (inB(right, 8) && rng() < 0.7) sealed.push({ file: right, rank: 8 });
  return { pen, kingAt, wall, sealed };
}

/**
 * A dropped knight (Vanguard) lands anywhere in range and can take the king in
 * one jump, which solos the level — measured 100% on the first terrain pass.
 * Stoning the knight-jump squares closes that; leaving them open is what makes
 * a level a VANGUARD level. Randomised, so the search covers both — but a HALF
 * seal is useless (vanguard soloed 8 of the first 11 kills through the squares
 * left open), so when it fires it seals every jump square at once.
 */
function sealKnightSquares(kingAt: Coord, taken: Set<string>, rng: RNG, howMany: number): Coord[] {
  const jumps: Coord[] = [];
  for (const [df, dr] of [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]] as const) {
    const f = kingAt.file + df, r = kingAt.rank + dr;
    if (!inB(f, r) || taken.has(sq(f, r))) continue;
    jumps.push({ file: f, rank: r });
  }
  const out: Coord[] = [];
  for (const j of jumps.sort(() => rng() - 0.5).slice(0, howMany)) {
    if (j.rank === 1) continue;
    taken.add(sq(j.file, j.rank));
    out.push(j);
  }
  return out;
}

/**
 * The guard set is what decides WHICH pair opens a barrier: a queen raking the
 * rank above it makes a control card necessary, a knight covering the landing
 * square makes freeze/poison necessary, an empty upper board leaves the pure
 * body-then-become pairs. Randomised per candidate on purpose.
 */
function upperGuards(rng: RNG, taken: Set<string>, kingAt: Coord, barrierRank: number): EnemyPiece[] {
  const out: EnemyPiece[] = [];
  const put = (p: EnemyPiece) => { if (!taken.has(sq(p.file, p.rank)) && inB(p.file, p.rank)) { taken.add(sq(p.file, p.rank)); out.push(p); } };
  const roll = rng();
  if (roll < 0.3) {
    // A queen raking the rank just above the barrier — nothing lands there safely.
    const r = Math.min(barrierRank + 1, 6);
    put(queen(kingAt.file <= 4 ? 8 : 1, r));
  } else if (roll < 0.55) {
    // A knight covering the squares beside the king.
    const f = Math.min(Math.max(kingAt.file + (rng() < 0.5 ? 2 : -2), 1), 8);
    put(knight(f, 6));
  } else if (roll < 0.75) {
    // A bishop on the long diagonal into the court.
    put(bishop(kingAt.file <= 4 ? 8 : 1, 6));
  }
  return out;
}

/** Hunters posted BELOW the barrier — they must not stand on the king's rays. */
function hunters(rng: RNG, n: number, taken: Set<string>, kingAt: Coord): EnemyPiece[] {
  const out: EnemyPiece[] = [];
  const makers = [knight, bishop, queen];
  let guard = 0;
  while (out.length < n && guard++ < 60) {
    const f = randInt(rng, 1, 8);
    const r = randInt(rng, 2, 4);
    if (taken.has(sq(f, r))) continue;
    if (f === kingAt.file || r === kingAt.rank) continue; // never a "key" on his line
    taken.add(sq(f, r));
    out.push(pickOne(rng, makers)(f, r));
  }
  return out;
}

function buildChecker(rng: RNG, slot: number): Build {
  // Colonnade signature: two staggered hazard rows. Every rook line into the
  // upper board is stopped; the diagonals between the stones stay open.
  const base = randInt(rng, 4, 5);
  const parity = randInt(rng, 0, 1);
  const hazards: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    if (f % 2 === parity) hazards.push({ file: f, rank: base });
    else hazards.push({ file: f, rank: base + 1 });
  }
  // No holes. A hole is a free file, and a free file is a bare-rook win —
  // measured: the hole-punching version read no-ability 50%.
  const kf = randInt(rng, 2, 6);
  const c = court(rng, kf, rng() < 0.35);
  const taken = new Set<string>();
  const pieces: EnemyPiece[] = [king(c.kingAt.file, c.kingAt.rank), ...c.wall];
  for (const p of pieces) taken.add(sq(p.file, p.rank));
  for (const h of [...hazards, ...c.sealed]) taken.add(sq(h.file, h.rank));
  const knightSeal = rng() < 0.75 ? sealKnightSquares(c.kingAt, taken, rng, 8) : [];
  pieces.push(...upperGuards(rng, taken, c.kingAt, base));
  pieces.push(...hunters(rng, randInt(rng, 0, 2), taken, c.kingAt));
  return {
    title: 'THE COLONNADE',
    idea: 'Staggered stones. No file, no rank — only the diagonals between them.',
    hazards: [...hazards, ...c.sealed, ...knightSeal],
    pieces,
    pen: c.pen,
    moveLimit: randInt(rng, 9, 13) + (slot >= 9 ? 1 : 0),
  };
}

function buildMoat(rng: RNG, slot: number): Build {
  // Moat signature: a solid row with ONE gate, and the gate plugged above and
  // below so walking it costs the whole move budget.
  const r = randInt(rng, 4, 5);
  const gate = randInt(rng, 2, 7);
  const hazards: Coord[] = [];
  for (let f = 1; f <= 8; f++) if (f !== gate) hazards.push({ file: f, rank: r });
  if (rng() < 0.8) hazards.push({ file: gate, rank: r - 1 });
  if (rng() < 0.8) hazards.push({ file: gate, rank: r + 1 });
  const kf = randInt(rng, 1, 7);
  const c = court(rng, kf, rng() < 0.6);
  const taken = new Set<string>();
  const pieces: EnemyPiece[] = [king(c.kingAt.file, c.kingAt.rank), ...c.wall];
  // A pawn on the far side of the gate — the moat has a doorman.
  if (!taken.has(sq(gate, r + 2)) && inB(gate, r + 2)) pieces.push(pawn(gate, r + 2));
  for (const p of pieces) taken.add(sq(p.file, p.rank));
  for (const h of [...hazards, ...c.sealed]) taken.add(sq(h.file, h.rank));
  const knightSeal = rng() < 0.75 ? sealKnightSquares(c.kingAt, taken, rng, 8) : [];
  pieces.push(...upperGuards(rng, taken, c.kingAt, r));
  pieces.push(...hunters(rng, randInt(rng, 0, 2), taken, c.kingAt));
  return {
    title: 'THE MOAT',
    idea: 'One gate, plugged. Crossing on foot costs everything.',
    hazards: [...hazards, ...c.sealed, ...knightSeal],
    pieces,
    pen: c.pen,
    moveLimit: randInt(rng, 9, 12) + (slot >= 9 ? 1 : 0),
  };
}

function buildVault(rng: RNG, slot: number): Build {
  // A hazard box around a 2x2 court with a single diagonal mouth: nothing walks
  // in on a rank or a file, and the mouth is one square wide.
  const f0 = randInt(rng, 2, 6);
  const pen = [
    toSquare({ file: f0, rank: 7 }), toSquare({ file: f0 + 1, rank: 7 }),
    toSquare({ file: f0, rank: 8 }), toSquare({ file: f0 + 1, rank: 8 }),
  ];
  const hazards: Coord[] = [];
  for (const f of [f0 - 1, f0, f0 + 1, f0 + 2]) if (inB(f, 6)) hazards.push({ file: f, rank: 6 });
  for (const r of [7, 8]) {
    if (inB(f0 - 1, r)) hazards.push({ file: f0 - 1, rank: r });
    if (inB(f0 + 2, r)) hazards.push({ file: f0 + 2, rank: r });
  }
  // The mouth: remove one stone from the front wall.
  const mouth = Math.floor(rng() * hazards.length);
  hazards.splice(mouth, 1);
  const kingAt = { file: f0 + (rng() < 0.5 ? 0 : 1), rank: 8 };
  const taken = new Set<string>();
  const pieces: EnemyPiece[] = [king(kingAt.file, kingAt.rank)];
  // A pawn inside the court is the key; a second pawn on rank 5 defends the way in.
  const keyFile = kingAt.file === f0 ? f0 + 1 : f0;
  pieces.push(pawn(keyFile, 7));
  if (rng() < 0.7 && inB(f0, 5)) pieces.push(pawn(f0, 5));
  for (const p of pieces) taken.add(sq(p.file, p.rank));
  for (const h of hazards) taken.add(sq(h.file, h.rank));
  const knightSeal = rng() < 0.75 ? sealKnightSquares(kingAt, taken, rng, 8) : [];
  pieces.push(...upperGuards(rng, taken, kingAt, 5));
  pieces.push(...hunters(rng, randInt(rng, 1, 2), taken, kingAt));
  return {
    title: 'THE VAULT',
    idea: 'A stone box with one mouth. Get a body inside, then be that body.',
    hazards: [...hazards, ...knightSeal],
    pieces,
    pen,
    moveLimit: randInt(rng, 10, 14) + (slot >= 9 ? 1 : 0),
  };
}

function buildComb(rng: RNG, slot: number): Build {
  // Full-height hazard columns with narrow slots — the board becomes corridors,
  // so where a body can be PUT matters more than where Rookie can slide.
  const step = rng() < 0.5 ? 2 : 3;
  const off = randInt(rng, 1, step);
  const rLo = randInt(rng, 3, 4);
  const rHi = randInt(rng, 5, 6);
  const hazards: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    if ((f - off) % step !== 0) continue;
    for (let r = rLo; r <= rHi; r++) hazards.push({ file: f, rank: r });
  }
  const kf = randInt(rng, 2, 6);
  const c = court(rng, kf, rng() < 0.4);
  const taken = new Set<string>();
  const pieces: EnemyPiece[] = [king(c.kingAt.file, c.kingAt.rank), ...c.wall];
  for (const p of pieces) taken.add(sq(p.file, p.rank));
  for (const h of [...hazards, ...c.sealed]) taken.add(sq(h.file, h.rank));
  // Corridor guards: pawns in the open slots, defending each other.
  for (let f = 1; f <= 8; f++) {
    if ((f - off) % step === 0) continue;
    if (rng() < 0.55 && !taken.has(sq(f, rHi))) { pieces.push(pawn(f, rHi)); taken.add(sq(f, rHi)); }
  }
  const knightSeal = rng() < 0.75 ? sealKnightSquares(c.kingAt, taken, rng, 8) : [];
  pieces.push(...upperGuards(rng, taken, c.kingAt, rHi));
  pieces.push(...hunters(rng, randInt(rng, 0, 1), taken, c.kingAt));
  return {
    title: 'THE COMB',
    idea: 'Corridors, not a board. Where you can PUT a body beats where you can slide.',
    hazards: [...hazards, ...c.sealed, ...knightSeal],
    pieces,
    pen: c.pen,
    moveLimit: randInt(rng, 10, 14) + (slot >= 9 ? 1 : 0),
  };
}

/**
 * Barriers that are NOT terrain a knight jumps (Tyler wants UNIQUE
 * combinations, and walls make every knight-hop partner "necessary"):
 *   court      no wall at all — a pawn-defended key on the king's line plus a
 *              queen raking the approach. The problem is a SIGHTLINE and a
 *              DEFENDED KEY, so decoy / aegis / poison / freeze / rewind are
 *              the kind of answer.
 *   open       a fleeing king in a big open pen with a tight budget — a rook
 *              cannot corner him alone, so cage-building cards matter.
 *   recapture  the only key is covered by a queen that recaptures whatever
 *              takes it — a one-charge-body situation, so rewind / aegis /
 *              sacrifice matter.
 */
function buildCourt(rng: RNG, slot: number): Build {
  const kf = randInt(rng, 2, 7);
  const c = court(rng, kf, false);
  const taken = new Set<string>();
  const pieces: EnemyPiece[] = [king(c.kingAt.file, c.kingAt.rank), ...c.wall];
  for (const p of pieces) taken.add(sq(p.file, p.rank));
  for (const h of c.sealed) taken.add(sq(h.file, h.rank));
  // Second pawn rank defending the wall — every key is pawn-defended.
  for (const w of c.wall) {
    const f = w.file + (rng() < 0.5 ? 1 : -1);
    if (inB(f, 6) && !taken.has(sq(f, 6)) && rng() < 0.6) { pieces.push(pawn(f, 6)); taken.add(sq(f, 6)); }
  }
  // The sightline: a queen raking rank 5 or the key file from the far side.
  const qf = c.kingAt.file <= 4 ? 8 : 1;
  if (!taken.has(sq(qf, 5))) { pieces.push(queen(qf, 5)); taken.add(sq(qf, 5)); }
  if (rng() < 0.5) { const bf = qf === 8 ? 1 : 8; if (!taken.has(sq(bf, 4))) { pieces.push(bishop(bf, 4)); taken.add(sq(bf, 4)); } }
  pieces.push(...hunters(rng, randInt(rng, 0, 1), taken, c.kingAt));
  return {
    title: 'THE COURT',
    idea: 'No walls. A defended key on his line and a queen watching every approach.',
    hazards: [...c.sealed],
    pieces,
    pen: c.pen,
    moveLimit: randInt(rng, 6, 9) + (slot >= 9 ? 1 : 0),
  };
}

function buildOpen(rng: RNG, slot: number): Build {
  // A 3x3 or 4x2 pen in the open upper board; he flees, and the budget is tight.
  const wide = rng() < 0.5;
  const f0 = randInt(rng, 1, wide ? 5 : 6);
  const pen: string[] = [];
  const ranks = wide ? [7, 8] : [6, 7, 8];
  const files = wide ? [f0, f0 + 1, f0 + 2, f0 + 3] : [f0, f0 + 1, f0 + 2];
  for (const r of ranks) for (const f of files) pen.push(toSquare({ file: f, rank: r }));
  const kingAt = { file: files[Math.floor(files.length / 2)], rank: 8 };
  const taken = new Set<string>([sq(kingAt.file, kingAt.rank)]);
  const pieces: EnemyPiece[] = [king(kingAt.file, kingAt.rank)];
  // Guards OUTSIDE the pen covering the files into it.
  const put = (p: EnemyPiece) => { if (inB(p.file, p.rank) && !taken.has(sq(p.file, p.rank)) && !pen.includes(toSquare(p))) { taken.add(sq(p.file, p.rank)); pieces.push(p); } };
  put(knight(files[0] - 1 >= 1 ? files[0] - 1 : files[files.length - 1] + 1, 6));
  if (rng() < 0.6) put(bishop(kingAt.file <= 4 ? 8 : 1, 5));
  if (rng() < 0.5) put(queen(kingAt.file <= 4 ? 8 : 1, 3));
  pieces.push(...hunters(rng, randInt(rng, 0, 1), taken, kingAt));
  return {
    title: 'THE OPEN FIELD',
    idea: 'He runs. No walls to pin him against — build the cage yourself.',
    hazards: [],
    pieces,
    pen,
    moveLimit: randInt(rng, 6, 8) + (slot >= 9 ? 1 : 0),
  };
}

function buildRecapture(rng: RNG, slot: number): Build {
  // One key on the king's file, and a queen that recaptures on it — whatever
  // takes the key dies. A one-charge-body problem.
  const kf = randInt(rng, 2, 7);
  const pen = [toSquare({ file: kf - 1, rank: 8 }), toSquare({ file: kf, rank: 8 }), toSquare({ file: kf + 1, rank: 8 })];
  const kingAt = { file: kf, rank: 8 };
  const taken = new Set<string>([sq(kf, 8)]);
  const pieces: EnemyPiece[] = [king(kf, 8)];
  const hazards: Coord[] = [];
  // Seal the pen sides with stone; the key pawn sits on his file.
  for (const f of [kf - 2, kf + 2]) if (inB(f, 8)) { hazards.push({ file: f, rank: 8 }); taken.add(sq(f, 8)); }
  for (const f of [kf - 1, kf + 1]) if (inB(f, 7)) { hazards.push({ file: f, rank: 7 }); taken.add(sq(f, 7)); }
  const keyRank = randInt(rng, 5, 7);
  pieces.push(pawn(kf, keyRank)); taken.add(sq(kf, keyRank));
  // The recapturing queen, on the key's rank or diagonal, off the king's file.
  const qf = kf <= 4 ? Math.min(8, kf + randInt(rng, 2, 4)) : Math.max(1, kf - randInt(rng, 2, 4));
  pieces.push(queen(qf, keyRank)); taken.add(sq(qf, keyRank));
  if (rng() < 0.5) { const d = keyRank - 1; const bf = qf === 8 ? 1 : 8; if (inB(bf, d) && !taken.has(sq(bf, d))) { pieces.push(bishop(bf, d)); taken.add(sq(bf, d)); } }
  pieces.push(...hunters(rng, randInt(rng, 0, 1), taken, kingAt));
  return {
    title: 'THE TOLL',
    idea: 'One key. The queen takes back whatever takes it. Spend a body, or spend the move twice.',
    hazards,
    pieces,
    pen,
    moveLimit: randInt(rng, 5, 8) + (slot >= 9 ? 1 : 0),
  };
}

const BUILDERS: Record<string, (rng: RNG, slot: number) => Build> = {
  checker: buildChecker, moat: buildMoat, vault: buildVault, comb: buildComb,
  court: buildCourt, open: buildOpen, recapture: buildRecapture,
};

/** Structural sanity — the subset of revenge-generate's lint that applies here. */
function lintBuild(b: Build): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  const kings = b.pieces.filter((p) => p.type === 'king');
  if (kings.length !== 1) errors.push(`expected 1 king, found ${kings.length}`);
  for (const p of b.pieces) {
    if (!inB(p.file, p.rank)) errors.push(`${p.type} off board`);
    if (p.rank === 1) errors.push(`${p.type} on rank 1 — Rookie's spawn rank must stay free`);
    if (seen.has(sq(p.file, p.rank))) errors.push(`two pieces on ${toSquare(p)}`);
    seen.add(sq(p.file, p.rank));
  }
  const hz = new Set<string>();
  for (const h of b.hazards) {
    if (!inB(h.file, h.rank)) errors.push('hazard off board');
    if (h.rank <= 1) errors.push('hazard on rank 1');
    if (seen.has(sq(h.file, h.rank))) errors.push(`hazard on a piece at ${toSquare(h)}`);
    hz.add(sq(h.file, h.rank));
  }
  const k = kings[0];
  if (k) {
    if (!b.pen.includes(toSquare(k))) errors.push('king is not inside his pen');
    for (const p of b.pen) {
      const f = p.charCodeAt(0) - 96, r = Number(p[1]);
      if (hz.has(sq(f, r))) errors.push(`hazard inside the pen at ${p}`);
      if (seen.has(sq(f, r)) && !(f === k.file && r === k.rank)) errors.push(`piece inside the pen at ${p}`);
    }
  }
  // Rank 1 and rank 2 must offer Rookie somewhere to stand.
  if (b.hazards.some((h) => h.rank === 1)) errors.push('hazard on rank 1');
  return [...new Set(errors)];
}

const ctor = (p: EnemyPiece) => `${p.type === 'knight' ? 'knight' : p.type}(${p.file}, ${p.rank})`;

function snippetFor(b: Build, slot: number): string {
  return [
    `    // L${slot} — ${b.title}. ${b.idea}`,
    `    make(`,
    `      ${slot},`,
    `      [`,
    `        ${b.pieces.map(ctor).join(', ')},`,
    `      ],`,
    `      {`,
    `        ...FLEE,`,
    `        moveLimit: ${b.moveLimit},`,
    `        hazards: [${b.hazards.map((h) => `X(${h.file}, ${h.rank})`).join(', ')}],`,
    `        kingPen: [${b.pen.map((s) => `'${s}'`).join(', ')}],`,
    `      },`,
    `    ),`,
  ].join('\n');
}

function rngFor(family: string, slot: number, variant: number, seed: number): RNG {
  let h = 2166136261 >>> 0;
  for (const ch of `${family}:${slot}:${variant}:${seed}`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return mulberry32(h);
}

/** Deterministic from (families, slots, variants, seed) — a worker rebuilds it exactly. */
export function buildTerrainCandidates(opts: TerrainOpts): TerrainCandidate[] {
  const fams = opts.families?.length ? opts.families : TERRAIN_FAMILIES;
  const out: TerrainCandidate[] = [];
  for (const family of TERRAIN_FAMILIES) {
    if (!fams.includes(family)) continue;
    for (const slot of opts.slots) {
      for (let v = 0; v < opts.variants; v++) {
        const b = BUILDERS[family](rngFor(family, slot, v, opts.seed), slot);
        const puzzle: RunPuzzle = {
          level: slot,
          rookieStart: { file: 4, rank: 1 },
          pieces: b.pieces.map((p) => ({ ...p })),
          hazards: b.hazards.map((h) => ({ ...h })),
          moveLimit: b.moveLimit,
          winCondition: 'king',
          kingBehavior: 'flee',
          kingPen: [...b.pen],
        };
        out.push({
          id: `${family}-L${slot}-v${v + 1}`,
          family, slot, title: b.title, idea: b.idea,
          puzzle,
          snippet: snippetFor(b, slot),
          lintErrors: lintBuild(b),
        });
      }
    }
  }
  return out;
}
