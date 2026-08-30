#!/usr/bin/env -S npx tsx
/**
 * Rookie's Revenge — candidate LEVEL generator (king levels only).
 *
 * Emits piece-count-driven candidates for every level position L1..L10,
 * structurally lints each one (the docs/revenge-playtest.md rules of thumb),
 * scores the survivors with the real MCTS bot, ranks them against the
 * revenge-1 difficulty curve and writes ranked markdown + paste-ready TS
 * snippets under data/run-playtest/revenge-candidates/<date>/.
 *
 * Design direction (Tyler, 2026-08-30): Revenge is less about walls and more
 * about the NUMBER OF PIECES. So the archetypes here vary density first —
 * pawn shells, defender chains, hunters, marchers — and use walls/pens as
 * the secondary flavour. Every archetype ramps its piece count with the
 * level slot; the move budget is the fine-tuning knob (see docs §6).
 *
 * Archetypes
 *   swarm        pawn shell that thickens every slot (chains of defenders),
 *                one knight, marchers late.
 *   royal-guard  few pawns, HEAVY hunters — queens / bishops = sightlines.
 *   double-key   king on rank 7 with two open lines, a pawn-defended key on
 *                each; the second key is the whole point.
 *   open-flank   small shell, one side of the room open, knights + a bishop
 *                posted to cover that flank.
 *   corner-keep  corner room on the h-file that grows 2x2 -> 3x2 -> 3x3,
 *                one wall column, key on the h-file.
 *   walled-court mid-board room with heavier walls (an inner rank-6 wall
 *                with a door) — the "walls involved" flavour.
 *
 * Structural lint (a candidate that fails is dropped BEFORE any bot time):
 *   - exactly one king, on rank 7/8, distinct squares, nothing on rank 1
 *     (Rookie's spawn rank stays free), no hazard on any piece square;
 *   - winCondition 'king'; L1-2 = STILL king, L3+ = FLEE + kingPen;
 *   - pen contains the king, pen squares are empty (no own pieces inside —
 *     they shrink his room into a line), no hazards in the pen, the pen is
 *     8-connected from the king, and FLEE pens hold >= one 2x2 empty block
 *     (L3 is allowed a linear hallway pen — flagged, like revenge-1 L3);
 *   - every KEY (first piece along a rook ray from the king) is a pawn AND
 *     is pawn-defended (L3-4 may carry ONE undefended key — that is the
 *     capture-stun lesson — flagged);
 *   - hunters never start on the king's open lines (they would be keys that
 *     walk off their post).
 *
 * Scoring (per candidate, T5 bot, realistic tiers, offers dismissed):
 *   loadouts = none + the 5 finishers (surge, freeze-ray, knight-hop,
 *   bishop-step, queen-pulse). Target band per slot for `none`:
 *   100/100/100/100/90/50/55/50/30/30 %; every finisher >= 80 %; zero stalls.
 *   score = 100 - 1.5*|none - target| - 2*sum(max(0, 80 - finisher))
 *           - 25*stall_cells - 4*lint_warnings.
 *
 * CLI
 *   npx tsx scripts/run-playtest/revenge-generate.ts
 *       [--slots=1-10 | 5,6,7]      level positions to generate (default all)
 *       [--archetypes=swarm,...]     default all six
 *       [--variants=2]               seeded variants per archetype x slot
 *       [--trials=12]                games per (candidate x loadout)
 *       [--tier=T5|T6]               bot (default T5)
 *       [--loadouts=core|all|a,b,c]  default core = none + 5 finishers
 *       [--seed=0]                   global seed offset (same seed = same levels)
 *       [--jobs=8]                   worker processes (matrix-style sharding)
 *       [--lint-only]                structural pass only, no bot time
 *       [--out=dir]                  override output dir
 *       [--json]                     machine output on stdout
 *
 *   Default invocation = 6 archetypes x 10 slots x 2 variants x 6 loadouts x
 *   12 trials = 8,640 games; ~12 games/CPU-second with the T5 bot, so about
 *   3 minutes on 8 cores (well under the 15-minute budget). `--variants=4
 *   --trials=20` is the thorough overnight setting (~20 min).
 *
 * Determinism: every random choice flows through mulberry32 seeded from
 * (archetype, slot, variant, --seed). Nothing here touches lib/run — paste
 * the snippets into runs.ts by hand, then confirm with
 * `revenge.ts matrix --run=<id>` (the generator's numbers are a filter, the
 * harness is the truth).
 */

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import * as os from 'node:os';
import { join } from 'node:path';

import {
  applyDismissOffer,
  maxUsesForTier,
  refreshAbilityUses,
  type AbilityId,
  type AbilityTier,
  type OwnedAbility,
} from '../../lib/run/abilities';
import { REVENGE_ABILITIES, REVENGE_CORE } from '../../lib/run/runs';
import { mulberry32, puzzleToBoardState } from '../../lib/run/seed';
import type { BoardState, Coord, EnemyPiece, PieceType, RunPuzzle } from '../../lib/run/types';
import { toSquare } from '../../lib/run/types';
import { applyBotAction } from './bots/apply';
import { createMctsBot } from './bots/mcts';
import { settleEnemyTurns } from './bots/t3';
import { T5 } from './bots/t5';
import type { Bot, BotAction, BotContext } from './types';
import { rngFromString } from './utils/rng';

// ─────────────────────────────────────────────────────────────────────────────
// Args

function arg(name: string, def?: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  if (process.argv.includes(`--${name}`)) return 'true';
  return def;
}
const JSON_OUT = process.argv.includes('--json');

function parseSlots(v: string | undefined): number[] {
  if (!v || v === 'all') return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const out = new Set<number>();
  for (const part of v.split(',')) {
    const m = part.trim().match(/^(\d+)-(\d+)$/);
    if (m) {
      for (let i = Number(m[1]); i <= Number(m[2]); i++) out.add(i);
    } else if (part.trim()) out.add(Number(part.trim()));
  }
  return [...out].filter((n) => n >= 1 && n <= 10).sort((a, b) => a - b);
}

// ─────────────────────────────────────────────────────────────────────────────
// Piece helpers (same shapes as runs.ts so snippets paste 1:1)

type RNG = () => number;

const mk = (type: PieceType) => (file: number, rank: number): EnemyPiece => ({
  type,
  color: 'black',
  file,
  rank,
});
const pawn = mk('pawn');
const knight = mk('knight');
const bishop = mk('bishop');
const queen = mk('queen');
const king = mk('king');
const X = (file: number, rank: number): Coord => ({ file, rank });

const inBounds = (f: number, r: number) => f >= 1 && f <= 8 && r >= 1 && r <= 8;
const key = (f: number, r: number) => `${f},${r}`;

function randInt(rng: RNG, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}
function pick<T>(rng: RNG, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}
function shuffle<T>(rng: RNG, arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A named group of pieces — drives the one-line-per-role snippet comments. */
interface Group {
  label: 'key' | 'defenders' | 'shell' | 'hunters' | 'marchers' | 'king' | 'doors';
  pieces: EnemyPiece[];
}

/** One generated level before it is turned into a RunPuzzle. */
export interface LevelSpec {
  archetype: string;
  variant: number;
  slot: number;
  /** Short level idea, revenge-1 comment style ("THE HALLWAY"). */
  title: string;
  idea: string;
  groups: Group[];
  hazards: Coord[];
  moveLimit?: number;
  still: boolean;
  kingPen?: string[];
}

function allPieces(spec: LevelSpec): EnemyPiece[] {
  return spec.groups.flatMap((g) => g.pieces);
}

// ─────────────────────────────────────────────────────────────────────────────
// Room / pen geometry

interface Room {
  fLo: number;
  fHi: number;
  rLo: number;
  rHi: number;
}

function roomSquares(room: Room): string[] {
  const out: string[] = [];
  for (let r = room.rHi; r >= room.rLo; r--)
    for (let f = room.fLo; f <= room.fHi; f++) out.push(toSquare({ file: f, rank: r }));
  return out;
}

/** Wall columns on both sides of the room (only where the board allows). */
function sideWalls(room: Room, sides: { left: boolean; right: boolean }): Coord[] {
  const out: Coord[] = [];
  for (let r = room.rLo; r <= room.rHi; r++) {
    if (sides.left && inBounds(room.fLo - 1, r)) out.push(X(room.fLo - 1, r));
    if (sides.right && inBounds(room.fHi + 1, r)) out.push(X(room.fHi + 1, r));
  }
  return out;
}

/** Move budget baseline per slot (revenge-1's curve) with a small jitter. */
function budgetFor(slot: number, rng: RNG, bias = 0): number | undefined {
  const base = [0, 0, 0, 0, 0, 12, 12, 12, 14, 14, 18][slot];
  if (!base) return undefined;
  return base + bias + pick(rng, [0, 0, 1, -1]);
}

/** Sample marcher pawns on ranks 2-4, away from `avoid` files. */
function marchers(rng: RNG, n: number, avoidFiles: Set<number>, taken: Set<string>): EnemyPiece[] {
  const out: EnemyPiece[] = [];
  const files = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8].filter((f) => !avoidFiles.has(f)));
  for (const f of files) {
    if (out.length >= n) break;
    const r = pick(rng, [2, 3, 3, 4, 4]);
    if (taken.has(key(f, r))) continue;
    taken.add(key(f, r));
    out.push(pawn(f, r));
  }
  return out;
}

/**
 * Sample hunter posts: ranks 2-6, never inside the pen, never on the king's
 * file or rank (they would be keys), never on a square already taken, and
 * never on the two files flanking the key (they would block the doors and
 * become part of the shell instead of roaming).
 */
function hunterPosts(
  rng: RNG,
  n: number,
  kingAt: Coord,
  pen: Set<string>,
  taken: Set<string>,
  opts: { ranks?: number[]; avoidFiles?: Set<number> } = {},
): Coord[] {
  const ranks = opts.ranks ?? [2, 3, 3, 4, 4, 5, 6];
  const out: Coord[] = [];
  let guard = 0;
  while (out.length < n && guard++ < 200) {
    const f = randInt(rng, 1, 8);
    const r = pick(rng, ranks);
    if (f === kingAt.file || r === kingAt.rank) continue;
    if (opts.avoidFiles?.has(f)) continue;
    if (pen.has(toSquare({ file: f, rank: r }))) continue;
    if (taken.has(key(f, r))) continue;
    taken.add(key(f, r));
    out.push(X(f, r));
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Archetypes — each returns null when the slot is outside its range.

type ArchetypeFn = (slot: number, variant: number, rng: RNG) => LevelSpec | null;

interface Archetype {
  id: string;
  name: string;
  fn: ArchetypeFn;
}

/** STILL openers shared by every archetype flavour (L1-L2). */
function stillOpener(slot: number, variant: number, rng: RNG, archetype: string, flavour: string): LevelSpec {
  const kf = pick(rng, [3, 4, 5, 6]);
  const groups: Group[] = [];
  const taken = new Set<string>();
  const take = (p: EnemyPiece) => {
    taken.add(key(p.file, p.rank));
    return p;
  };
  const shell: EnemyPiece[] = [];
  for (const df of [-1, 0, 1]) if (inBounds(kf + df, 7)) shell.push(take(pawn(kf + df, 7)));
  let title = 'FIRST BLOOD';
  let idea = 'king alone behind three pawns. Rank 8 does nothing; the king does.';
  if (slot === 2) {
    title = 'THE SHELL';
    idea = 'a second pawn layer and one bishop. Still still — find the line, take the key.';
    for (const df of [-2, 2]) if (inBounds(kf + df, 6)) shell.push(take(pawn(kf + df, 6)));
    const hunters: EnemyPiece[] = [];
    if (flavour === 'heavy') hunters.push(take(bishop(kf > 4 ? kf - 3 : kf + 3, 5)));
    else if (flavour === 'swarm') {
      for (const df of [-1, 1]) if (inBounds(kf + df, 5)) shell.push(take(pawn(kf + df, 5)));
    } else hunters.push(take(knight(kf > 4 ? kf - 3 : kf + 3, 4)));
    groups.push({ label: 'shell', pieces: shell });
    if (hunters.length) groups.push({ label: 'hunters', pieces: hunters });
    groups.push({ label: 'marchers', pieces: marchers(rng, 2, new Set([kf - 1, kf, kf + 1]), taken) });
  } else {
    groups.push({ label: 'shell', pieces: shell });
  }
  groups.push({ label: 'king', pieces: [king(kf, 8)] });
  return { archetype, variant, slot, title, idea, groups, hazards: [], still: true };
}

/**
 * Court builder — the revenge-1 L5/L7/L10 shape generalised. King on rank 8
 * in a (1+2*halfW) x depth room, side walls, a key pawn on his file two
 * ranks below the room, pawn defenders either side of the key.
 */
interface CourtOpts {
  kf: number;
  halfW: 1;
  depth: 2 | 3;
  walls: { left: boolean; right: boolean };
  /** extra pawn rings: 0 = key + 2 defenders only */
  rings: number;
  defenders: 0 | 1 | 2;
}

function court(o: CourtOpts): { room: Room; pen: string[]; hazards: Coord[]; key: EnemyPiece; defenders: EnemyPiece[]; shell: EnemyPiece[]; kingAt: Coord; taken: Set<string> } {
  const room: Room = { fLo: o.kf - o.halfW, fHi: o.kf + o.halfW, rLo: 9 - o.depth, rHi: 8 };
  const pen = roomSquares(room);
  const hazards = sideWalls(room, o.walls);
  const taken = new Set<string>();
  const keyRank = room.rLo - 2;
  const k = pawn(o.kf, keyRank);
  taken.add(key(k.file, k.rank));
  const defenders: EnemyPiece[] = [];
  const defFiles = o.defenders === 2 ? [o.kf - 1, o.kf + 1] : o.defenders === 1 ? [o.kf + (o.kf > 4 ? -1 : 1)] : [];
  for (const f of defFiles) {
    if (!inBounds(f, keyRank + 1)) continue;
    defenders.push(pawn(f, keyRank + 1));
    taken.add(key(f, keyRank + 1));
  }
  const shell: EnemyPiece[] = [];
  // Ring 1: pawns beside the key on its rank (block the door files lower down)
  // + a pawn one rank below each defender's outer diagonal (defends them).
  if (o.rings >= 1) {
    for (const df of [-2, 2]) {
      const f = o.kf + df;
      if (inBounds(f, keyRank) && !hazards.some((h) => h.file === f && h.rank === keyRank)) {
        shell.push(pawn(f, keyRank));
        taken.add(key(f, keyRank));
      }
    }
  }
  // Ring 2: the defenders get their own defenders (b7/f7 style, one rank up,
  // two files out) — the chain gets one link longer.
  if (o.rings >= 2) {
    for (const df of [-2, 2]) {
      const f = o.kf + df;
      const r = keyRank + 2;
      if (!inBounds(f, r)) continue;
      if (hazards.some((h) => h.file === f && h.rank === r)) continue;
      if (pen.includes(toSquare({ file: f, rank: r }))) continue;
      shell.push(pawn(f, r));
      taken.add(key(f, r));
    }
  }
  // Ring 3: a pawn in front of the key (same file) — the file needs two
  // captures before it opens.
  if (o.rings >= 3 && inBounds(o.kf, keyRank - 1)) {
    shell.push(pawn(o.kf, keyRank - 1));
    taken.add(key(o.kf, keyRank - 1));
  }
  for (const h of hazards) taken.add(key(h.file, h.rank));
  for (const sq of pen) {
    const f = sq.charCodeAt(0) - 96;
    const r = Number(sq[1]);
    taken.add(key(f, r));
  }
  return { room, pen, hazards, key: k, defenders, shell, kingAt: X(o.kf, 8), taken };
}

const ARCH_SWARM: Archetype = {
  id: 'swarm',
  name: 'Pawn Swarm',
  fn: (slot, variant, rng) => {
    if (slot <= 2) return stillOpener(slot, variant, rng, 'swarm', 'swarm');
    const kf = pick(rng, [3, 4, 5, 6]);
    // Density ramps with slot: rings 0..3, defenders 1..2, marchers 0..4.
    const rings = slot <= 4 ? 0 : slot <= 6 ? 1 : slot <= 8 ? 2 : 3;
    const defenders: 0 | 1 | 2 = slot === 3 ? 0 : slot === 4 ? 1 : 2;
    const depth: 2 | 3 = slot >= 9 ? 3 : 2;
    const c = court({ kf, halfW: 1, depth, walls: { left: true, right: true }, rings, defenders });
    const groups: Group[] = [{ label: 'key', pieces: [c.key] }];
    if (c.defenders.length) groups.push({ label: 'defenders', pieces: c.defenders });
    if (c.shell.length) groups.push({ label: 'shell', pieces: c.shell });
    const hunters: EnemyPiece[] = [];
    if (slot >= 4) {
      const posts = hunterPosts(rng, slot >= 8 ? 2 : 1, c.kingAt, new Set(c.pen), c.taken, {
        ranks: [3, 3, 4, 4, 5],
        avoidFiles: new Set([kf - 1, kf, kf + 1]),
      });
      posts.forEach((p, i) => hunters.push(i === 0 ? knight(p.file, p.rank) : bishop(p.file, p.rank)));
    }
    if (hunters.length) groups.push({ label: 'hunters', pieces: hunters });
    const nMarch = Math.max(0, Math.min(4, slot - 5));
    const m = marchers(rng, nMarch, new Set([kf - 1, kf, kf + 1]), c.taken);
    if (m.length) groups.push({ label: 'marchers', pieces: m });
    groups.push({ label: 'king', pieces: [king(kf, 8)] });
    const pawnCount = allPieces({ groups } as LevelSpec).filter((p) => p.type === 'pawn').length;
    return {
      archetype: 'swarm',
      variant,
      slot,
      title: ['', '', '', 'THE DOOR', 'ONE GUARD', 'THE HEDGE', 'THICKET', 'BRAMBLE', 'THE WALL OF PAWNS', 'PAWN STORM', 'THE SWARM'][slot],
      idea: `${pawnCount} pawns. ${rings}-ring shell around the ${toSquare(c.key)} key; dismantle the chain from the outside in.`,
      groups,
      hazards: c.hazards,
      moveLimit: budgetFor(slot, rng, rings >= 3 ? 2 : 0),
      still: false,
      kingPen: c.pen,
    };
  },
};

const ARCH_ROYAL: Archetype = {
  id: 'royal-guard',
  name: 'Royal Guard',
  fn: (slot, variant, rng) => {
    if (slot <= 2) return stillOpener(slot, variant, rng, 'royal-guard', 'heavy');
    const kf = pick(rng, [3, 4, 5, 6]);
    const defenders: 0 | 1 | 2 = slot === 3 ? 0 : slot === 4 ? 1 : 2;
    const depth: 2 | 3 = slot >= 8 ? 3 : 2;
    const c = court({ kf, halfW: 1, depth, walls: { left: true, right: true }, rings: slot >= 9 ? 1 : 0, defenders });
    const groups: Group[] = [{ label: 'key', pieces: [c.key] }];
    if (c.defenders.length) groups.push({ label: 'defenders', pieces: c.defenders });
    if (c.shell.length) groups.push({ label: 'shell', pieces: c.shell });
    // Heavy roster by slot.
    const roster: PieceType[][] = [
      [], [], [],
      ['knight'],
      ['bishop'],
      ['queen'],
      ['queen', 'bishop'],
      ['queen', 'bishop', 'knight'],
      ['queen', 'queen', 'bishop'],
      ['queen', 'queen', 'bishop', 'knight'],
      ['queen', 'queen', 'bishop', 'bishop', 'knight'],
    ];
    const types = roster[slot];
    const posts = hunterPosts(rng, types.length, c.kingAt, new Set(c.pen), c.taken, {
      ranks: [2, 2, 3, 3, 4, 5],
      avoidFiles: new Set([kf - 1, kf, kf + 1]),
    });
    const hunters = posts.map((p, i) => mk(types[i])(p.file, p.rank));
    if (hunters.length) groups.push({ label: 'hunters', pieces: hunters });
    const m = marchers(rng, slot >= 6 ? 2 : 1, new Set([kf - 1, kf, kf + 1]), c.taken);
    if (m.length) groups.push({ label: 'marchers', pieces: m });
    groups.push({ label: 'king', pieces: [king(kf, 8)] });
    return {
      archetype: 'royal-guard',
      variant,
      slot,
      title: ['', '', '', 'THE PAGE', 'THE BISHOP', 'HER MAJESTY', 'TWO COURTIERS', 'THE RETINUE', 'TWIN QUEENS', 'THE PRIVY COUNCIL', 'THE ROYAL GUARD'][slot],
      idea: `${types.length} heavy hunter${types.length === 1 ? '' : 's'} (${types.join(', ')}) — sightlines, not bodies. Key ${toSquare(c.key)}.`,
      groups,
      hazards: c.hazards,
      moveLimit: budgetFor(slot, rng),
      still: false,
      kingPen: c.pen,
    };
  },
};

/**
 * Double key — king on rank 7 in a 3x2 room (ranks 7-8), walls on one side,
 * the other side open along rank 7 to a second pawn key. His file line runs
 * down to the usual key. Two chains to dismantle; hunters light.
 */
const ARCH_DOUBLE: Archetype = {
  id: 'double-key',
  name: 'Double Key',
  fn: (slot, variant, rng) => {
    if (slot <= 2) return stillOpener(slot, variant, rng, 'double-key', 'knight');
    if (slot === 3) return null; // needs the two-key idea; too much for L3
    const openRight = rng() < 0.5;
    const kf = openRight ? pick(rng, [3, 4]) : pick(rng, [5, 6]);
    const room: Room = { fLo: kf - 1, fHi: kf + 1, rLo: 7, rHi: 8 };
    const pen = roomSquares(room);
    const hazards = sideWalls(room, { left: openRight, right: !openRight });
    const taken = new Set<string>();
    for (const h of hazards) taken.add(key(h.file, h.rank));
    for (const sq of pen) taken.add(key(sq.charCodeAt(0) - 96, Number(sq[1])));
    // Key 1: on his file, two below the room (rank 5), defenders on rank 6.
    const k1 = pawn(kf, 5);
    taken.add(key(kf, 5));
    const d1: EnemyPiece[] = [];
    for (const f of [kf - 1, kf + 1]) {
      if (!inBounds(f, 6)) continue;
      d1.push(pawn(f, 6));
      taken.add(key(f, 6));
    }
    // Key 2: on rank 7, two squares past the open side of the room, defended
    // from rank 8 (rank-8 pawns are effectively static — lowest priority).
    const dir = openRight ? 1 : -1;
    const k2f = kf + dir * 3;
    if (!inBounds(k2f, 7)) return null;
    const k2 = pawn(k2f, 7);
    taken.add(key(k2f, 7));
    const d2: EnemyPiece[] = [];
    for (const f of [k2f - 1, k2f + 1]) {
      if (!inBounds(f, 8)) continue;
      if (pen.includes(toSquare({ file: f, rank: 8 }))) continue;
      d2.push(pawn(f, 8));
      taken.add(key(f, 8));
    }
    if (slot === 4) d2.length = 0; // L4: the rank key is the free capture-stun lesson
    const shell: EnemyPiece[] = [];
    if (slot >= 8) {
      // Thicken: a pawn under each file defender.
      for (const f of [kf - 2, kf + 2]) {
        if (!inBounds(f, 5) || taken.has(key(f, 5))) continue;
        shell.push(pawn(f, 5));
        taken.add(key(f, 5));
      }
    }
    const groups: Group[] = [
      { label: 'key', pieces: [k1, k2] },
      { label: 'defenders', pieces: [...d1, ...d2] },
    ];
    if (shell.length) groups.push({ label: 'shell', pieces: shell });
    const roster: PieceType[][] = [
      [], [], [], [], ['knight'], ['knight'], ['knight', 'bishop'], ['bishop', 'queen'], ['knight', 'bishop', 'queen'], ['queen', 'bishop', 'knight'], ['queen', 'queen', 'bishop', 'knight'],
    ];
    const types = roster[slot];
    const kingAt = X(kf, 7);
    const posts = hunterPosts(rng, types.length, kingAt, new Set(pen), taken, {
      ranks: [2, 3, 3, 4, 4],
      avoidFiles: new Set([kf - 1, kf, kf + 1, k2f]),
    });
    const hunters = posts.map((p, i) => mk(types[i])(p.file, p.rank));
    if (hunters.length) groups.push({ label: 'hunters', pieces: hunters });
    const m = marchers(rng, Math.max(0, Math.min(3, slot - 6)), new Set([kf - 1, kf, kf + 1, k2f]), taken);
    if (m.length) groups.push({ label: 'marchers', pieces: m });
    groups.push({ label: 'king', pieces: [king(kf, 7)] });
    return {
      archetype: 'double-key',
      variant,
      slot,
      title: ['', '', '', '', 'TWO DOORS', 'TWO LOCKS', 'THE CROSSING', 'BOTH HANDS', 'DOUBLE BOLT', 'THE INTERSECTION', 'CROSSHAIRS'][slot],
      idea: `two keys — ${toSquare(k1)} on his file, ${toSquare(k2)} on his rank; the ${openRight ? 'right' : 'left'} wall is gone.`,
      groups,
      hazards,
      moveLimit: budgetFor(slot, rng, slot >= 7 ? 2 : 0),
      still: false,
      kingPen: pen,
    };
  },
};

/**
 * Open flank — the room is only walled on ONE side; the other flank is open
 * and knights (+ a bishop late) are posted to cover it. Fewer pawns, more
 * hunters watching a specific set of squares.
 */
const ARCH_FLANK: Archetype = {
  id: 'open-flank',
  name: 'Open Flank',
  fn: (slot, variant, rng) => {
    if (slot <= 2) return stillOpener(slot, variant, rng, 'open-flank', 'knight');
    const openRight = rng() < 0.5;
    const kf = openRight ? pick(rng, [3, 4]) : pick(rng, [5, 6]);
    const depth: 2 | 3 = slot >= 8 ? 3 : 2;
    const defenders: 0 | 1 | 2 = slot === 3 ? 0 : slot <= 5 ? 1 : 2;
    const c = court({ kf, halfW: 1, depth, walls: { left: openRight, right: !openRight }, rings: 0, defenders });
    // The open side of the room needs a rank key or the rank line is open
    // to the board edge: put a "door" pawn two files past the room on rank 8
    // ... a rank-8 pawn can't be pawn-defended, so instead close rank 8 with
    // ONE wall and leave rank 7 (and rank 6 when depth 3) open.
    const dir = openRight ? 1 : -1;
    const hazards = [...c.hazards, X(kf + dir * 2, 8)];
    c.taken.add(key(kf + dir * 2, 8));
    const groups: Group[] = [{ label: 'key', pieces: [c.key] }];
    if (c.defenders.length) groups.push({ label: 'defenders', pieces: c.defenders });
    const nKnights = slot <= 4 ? 1 : slot <= 7 ? 2 : 3;
    const flankFiles = [kf + dir * 2, kf + dir * 3, kf + dir * 4].filter((f) => inBounds(f, 1));
    const hunters: EnemyPiece[] = [];
    // Knights posted on the open flank, ranks 4-6 — they cover the flank
    // squares Rookie needs to enter the room sideways.
    const posts = shuffle(rng, flankFiles.flatMap((f) => [4, 5, 6].map((r) => X(f, r))))
      .filter((p) => !c.taken.has(key(p.file, p.rank)) && !c.pen.includes(toSquare(p)) && p.rank !== 8 && p.file !== kf)
      .slice(0, nKnights);
    for (const p of posts) {
      hunters.push(knight(p.file, p.rank));
      c.taken.add(key(p.file, p.rank));
    }
    if (slot >= 6) {
      const bp = hunterPosts(rng, 1, c.kingAt, new Set(c.pen), c.taken, { ranks: [2, 3, 3], avoidFiles: new Set([kf - 1, kf, kf + 1]) });
      for (const p of bp) hunters.push(bishop(p.file, p.rank));
    }
    if (slot >= 9) {
      const qp = hunterPosts(rng, 1, c.kingAt, new Set(c.pen), c.taken, { ranks: [2, 3], avoidFiles: new Set([kf - 1, kf, kf + 1]) });
      for (const p of qp) hunters.push(queen(p.file, p.rank));
    }
    groups.push({ label: 'hunters', pieces: hunters });
    const m = marchers(rng, Math.max(0, Math.min(3, slot - 6)), new Set([kf - 1, kf, kf + 1, ...flankFiles]), c.taken);
    if (m.length) groups.push({ label: 'marchers', pieces: m });
    groups.push({ label: 'king', pieces: [king(kf, 8)] });
    return {
      archetype: 'open-flank',
      variant,
      slot,
      title: ['', '', '', 'SIDE DOOR', 'THE PICKET', 'HORSE GUARD', 'THE FLANK', 'THREE HORSES', 'CAVALRY POST', 'THE OUTFLANK', 'THE GAUNTLET'][slot],
      idea: `${openRight ? 'right' : 'left'} flank open; ${nKnights} knight${nKnights > 1 ? 's' : ''} posted to cover it. Key ${toSquare(c.key)}.`,
      groups,
      hazards,
      moveLimit: budgetFor(slot, rng),
      still: false,
      kingPen: c.pen,
    };
  },
};

/**
 * Corner keep — revenge-1 L4/L8 generalised: king on h8, room grows 2x2 ->
 * 3x2 -> 3x3 with a single wall column, key on the h-file defended from g.
 */
const ARCH_CORNER: Archetype = {
  id: 'corner-keep',
  name: 'Corner Keep',
  fn: (slot, variant, rng) => {
    if (slot <= 2) return stillOpener(slot, variant, rng, 'corner-keep', 'knight');
    const left = rng() < 0.5; // mirror to a8
    const w = slot <= 5 ? 2 : 3; // room width
    const d = slot >= 9 ? 3 : 2; // room depth
    const room: Room = left ? { fLo: 1, fHi: w, rLo: 9 - d, rHi: 8 } : { fLo: 9 - w, fHi: 8, rLo: 9 - d, rHi: 8 };
    const pen = roomSquares(room);
    const hazards = sideWalls(room, { left: !left, right: left });
    const taken = new Set<string>();
    for (const h of hazards) taken.add(key(h.file, h.rank));
    for (const sq of pen) taken.add(key(sq.charCodeAt(0) - 96, Number(sq[1])));
    const kf = left ? 1 : 8;
    const keyRank = room.rLo - 2;
    const k = pawn(kf, keyRank);
    taken.add(key(kf, keyRank));
    const defenders: EnemyPiece[] = [];
    const inner = left ? 2 : 7;
    if (slot >= 5) {
      defenders.push(pawn(inner, keyRank + 1));
      taken.add(key(inner, keyRank + 1));
    }
    const shell: EnemyPiece[] = [];
    if (slot >= 7) {
      // The defender's own defender one further in, plus a pawn beside the key.
      const f2 = left ? 3 : 6;
      if (!pen.includes(toSquare({ file: f2, rank: keyRank + 2 })) && !taken.has(key(f2, keyRank + 2))) {
        shell.push(pawn(f2, keyRank + 2));
        taken.add(key(f2, keyRank + 2));
      }
    }
    if (slot >= 9 && !taken.has(key(inner, keyRank - 1))) {
      shell.push(pawn(inner, keyRank - 1));
      taken.add(key(inner, keyRank - 1));
    }
    const groups: Group[] = [{ label: 'key', pieces: [k] }];
    if (defenders.length) groups.push({ label: 'defenders', pieces: defenders });
    if (shell.length) groups.push({ label: 'shell', pieces: shell });
    const roster: PieceType[][] = [
      [], [], [], ['knight'], ['knight'], ['knight', 'bishop'], ['knight', 'bishop'], ['queen', 'bishop', 'knight'], ['queen', 'bishop', 'knight'], ['queen', 'bishop', 'bishop', 'knight'], ['queen', 'queen', 'bishop', 'knight'],
    ];
    const types = roster[slot];
    const kingAt = X(kf, 8);
    const posts = hunterPosts(rng, types.length, kingAt, new Set(pen), taken, {
      ranks: [2, 3, 3, 4, 4, 5],
      avoidFiles: new Set([kf, inner]),
    });
    const hunters = posts.map((p, i) => mk(types[i])(p.file, p.rank));
    if (hunters.length) groups.push({ label: 'hunters', pieces: hunters });
    const m = marchers(rng, Math.max(0, Math.min(3, slot - 5)), new Set([kf, inner]), taken);
    if (m.length) groups.push({ label: 'marchers', pieces: m });
    groups.push({ label: 'king', pieces: [king(kf, 8)] });
    return {
      archetype: 'corner-keep',
      variant,
      slot,
      title: ['', '', '', 'CORNER OFFICE', 'THE CLOSET', 'THE TOWER', 'THE KEEP', 'THE DONJON', 'THE BASTION', 'THE CITADEL', 'THE LAST TOWER'][slot],
      idea: `${w}x${d} corner room on ${left ? 'a' : 'h'}8; key ${toSquare(k)} on his file, chain runs inward.`,
      groups,
      hazards,
      moveLimit: budgetFor(slot, rng),
      still: false,
      kingPen: pen,
    };
  },
};

/**
 * Walled court — more walls: a 3x2/3x3 mid-board room with side walls AND an
 * inner wall on the rank below the room leaving a single door file. The
 * shell sits behind the door; hunters roam.
 */
const ARCH_WALLED: Archetype = {
  id: 'walled-court',
  name: 'Walled Court',
  fn: (slot, variant, rng) => {
    if (slot <= 2) return stillOpener(slot, variant, rng, 'walled-court', 'heavy');
    const kf = pick(rng, [3, 4, 5, 6]);
    const depth: 2 | 3 = slot >= 7 ? 3 : 2;
    const defenders: 0 | 1 | 2 = slot === 3 ? 0 : slot <= 5 ? 1 : 2;
    const c = court({ kf, halfW: 1, depth, walls: { left: true, right: true }, rings: slot >= 8 ? 1 : 0, defenders });
    // Inner wall: the rank just below the room, on the two side files of the
    // room — only the king's file stays open as the door (the key sits on it).
    const doorRank = c.room.rLo - 1;
    const inner: Coord[] = [];
    for (const f of [kf - 1, kf + 1]) {
      if (!c.defenders.some((p) => p.file === f && p.rank === doorRank)) inner.push(X(f, doorRank));
    }
    // With two defenders on doorRank there is no room for the inner wall on
    // that rank — push the wall one rank further out beside the key instead.
    const walls = inner.length ? inner : [X(kf - 2, doorRank), X(kf + 2, doorRank)].filter((h) => inBounds(h.file, h.rank));
    const hazards = [...c.hazards, ...walls.filter((h) => !c.taken.has(key(h.file, h.rank)))];
    for (const h of hazards) c.taken.add(key(h.file, h.rank));
    const groups: Group[] = [{ label: 'key', pieces: [c.key] }];
    if (c.defenders.length) groups.push({ label: 'defenders', pieces: c.defenders });
    if (c.shell.length) groups.push({ label: 'shell', pieces: c.shell });
    const roster: PieceType[][] = [
      [], [], [], [], ['bishop'], ['knight'], ['queen'], ['queen', 'knight'], ['queen', 'bishop'], ['queen', 'bishop', 'knight'], ['queen', 'queen', 'knight', 'bishop'],
    ];
    const types = roster[slot];
    const posts = hunterPosts(rng, types.length, c.kingAt, new Set(c.pen), c.taken, {
      ranks: [2, 3, 3, 4, 4],
      avoidFiles: new Set([kf - 1, kf, kf + 1]),
    });
    const hunters = posts.map((p, i) => mk(types[i])(p.file, p.rank));
    if (hunters.length) groups.push({ label: 'hunters', pieces: hunters });
    const m = marchers(rng, Math.max(0, Math.min(3, slot - 5)), new Set([kf - 1, kf, kf + 1]), c.taken);
    if (m.length) groups.push({ label: 'marchers', pieces: m });
    groups.push({ label: 'king', pieces: [king(kf, 8)] });
    return {
      archetype: 'walled-court',
      variant,
      slot,
      title: ['', '', '', 'THE GATE', 'THE PORTCULLIS', 'INNER WARD', 'THE COURTYARD', 'THE BAILEY', 'CURTAIN WALL', 'THE INNER KEEP', 'THE FORTRESS'][slot],
      idea: `${hazards.length} walls — side walls plus an inner wall with one door on the ${toSquare(c.key)[0]}-file.`,
      groups,
      hazards,
      moveLimit: budgetFor(slot, rng),
      still: false,
      kingPen: c.pen,
    };
  },
};

const ARCHETYPES: Archetype[] = [ARCH_SWARM, ARCH_ROYAL, ARCH_DOUBLE, ARCH_FLANK, ARCH_CORNER, ARCH_WALLED];

// ─────────────────────────────────────────────────────────────────────────────
// Spec -> RunPuzzle

export function specToPuzzle(spec: LevelSpec): RunPuzzle {
  const pieces = allPieces(spec).map((p) => ({ ...p }));
  return {
    level: spec.slot,
    rookieStart: { file: 4, rank: 1 },
    pieces,
    hazards: spec.hazards.map((h) => ({ ...h })),
    moveLimit: spec.moveLimit,
    winCondition: 'king',
    kingBehavior: spec.still ? 'still' : 'flee',
    ...(spec.kingPen ? { kingPen: [...spec.kingPen] } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Structural lint — mirrors docs/revenge-playtest.md §6.5 rules of thumb.

export interface LintReport {
  errors: string[];
  warnings: string[];
}

export function lintSpec(spec: LevelSpec): LintReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const pieces = allPieces(spec);
  const kings = pieces.filter((p) => p.type === 'king');
  if (kings.length !== 1) errors.push(`expected 1 king, found ${kings.length}`);
  const k = kings[0];
  const seen = new Set<string>();
  for (const p of pieces) {
    if (!inBounds(p.file, p.rank)) errors.push(`${p.type} off board at ${p.file},${p.rank}`);
    const sq = key(p.file, p.rank);
    if (seen.has(sq)) errors.push(`two pieces on ${toSquare(p)}`);
    seen.add(sq);
    if (p.rank === 1) errors.push(`${p.type} on rank 1 (${toSquare(p)}) — Rookie's spawn rank must stay free`);
  }
  const hz = new Set<string>();
  for (const h of spec.hazards) {
    if (!inBounds(h.file, h.rank)) errors.push(`hazard off board ${h.file},${h.rank}`);
    if (seen.has(key(h.file, h.rank))) errors.push(`hazard on a piece at ${toSquare(h)}`);
    if (h.rank === 1) errors.push(`hazard on rank 1 (${toSquare(h)})`);
    hz.add(key(h.file, h.rank));
  }
  if (!k) return { errors, warnings };
  if (k.rank < 7) warnings.push(`king on rank ${k.rank} — deep kings make long boards`);
  if (spec.slot <= 2 && !spec.still) errors.push('L1-2 must be STILL');
  if (spec.slot >= 3 && spec.still) errors.push('L3+ must FLEE');
  if (!spec.still) {
    const pen = spec.kingPen ?? [];
    if (pen.length === 0) errors.push('flee king without a pen');
    const penSet = new Set(pen);
    if (!penSet.has(toSquare(k))) errors.push('king starts outside his pen');
    for (const sq of pen) {
      const f = sq.charCodeAt(0) - 96;
      const r = Number(sq[1]);
      if (hz.has(key(f, r))) errors.push(`hazard inside the pen at ${sq}`);
      const occ = pieces.find((p) => p.file === f && p.rank === r && p !== k);
      if (occ) errors.push(`${occ.type} inside the pen at ${sq} — own pieces shrink his room into a line`);
    }
    // 8-connectivity from the king.
    const reach = new Set<string>([toSquare(k)]);
    const stack = [toSquare(k)];
    while (stack.length) {
      const sq = stack.pop()!;
      const f = sq.charCodeAt(0) - 96;
      const r = Number(sq[1]);
      for (let df = -1; df <= 1; df++)
        for (let dr = -1; dr <= 1; dr++) {
          if (!df && !dr) continue;
          const n = toSquare({ file: f + df, rank: r + dr });
          if (penSet.has(n) && !reach.has(n) && inBounds(f + df, r + dr)) {
            reach.add(n);
            stack.push(n);
          }
        }
    }
    if (reach.size !== penSet.size) errors.push('pen is not connected from the king');
    // 2x2 empty block.
    let has2x2 = false;
    for (const sq of pen) {
      const f = sq.charCodeAt(0) - 96;
      const r = Number(sq[1]);
      const ok = [X(f, r), X(f + 1, r), X(f, r + 1), X(f + 1, r + 1)].every(
        (c) => inBounds(c.file, c.rank) && penSet.has(toSquare(c)) && !pieces.some((p) => p !== k && p.file === c.file && p.rank === c.rank),
      );
      if (ok) has2x2 = true;
    }
    if (!has2x2) {
      if (spec.slot === 3) warnings.push('linear pen (hallway) — fine for L3 only');
      else errors.push('pen has no 2x2 empty block — a lone rook corners him');
    }
  }
  // Keys along the king's rook rays.
  const pawnDefended = (f: number, r: number) =>
    pieces.some((p) => p.type === 'pawn' && p.rank === r + 1 && Math.abs(p.file - f) === 1);
  let undefended = 0;
  for (const [df, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
    let f = k.file + df;
    let r = k.rank + dr;
    while (inBounds(f, r)) {
      if (hz.has(key(f, r))) break;
      const piece = pieces.find((p) => p.file === f && p.rank === r);
      if (piece) {
        const sq = toSquare(piece);
        if (piece.type !== 'pawn') errors.push(`key ${piece.type}@${sq} on the king's line is not a pawn (hunters leave their posts)`);
        else if (!pawnDefended(f, r)) {
          undefended++;
          if (spec.still || spec.slot <= 4) warnings.push(`undefended key pawn@${sq} (capture-stun lesson)`);
          else errors.push(`undefended key pawn@${sq} on the king's line`);
        }
        break;
      }
      f += df;
      r += dr;
    }
  }
  if (!spec.still && spec.slot >= 5 && undefended > 0) errors.push('flee level with a free key');
  // Learned 2026-08-30 (revenge-5 L5 trace): shell pawns MARCH. The enemy
  // mover priority is -rank for pawns, so a key/defender on rank <= 4
  // outranks the rank-5+ shell and walks off its post the first time no
  // hunter/marcher has a better move (guaranteed with enemiesPerTurn 2).
  // A key that steps forward is a free key on his file = a surge/stun win.
  for (const p of pieces) {
    if (p.type !== 'pawn' || p.rank > 4) continue;
    const onLine = p.file === k.file || p.rank === k.rank;
    const defends = pieces.some((q) => q.type === 'pawn' && q.rank === p.rank - 1 && Math.abs(q.file - p.file) === 1);
    if (onLine || defends) warnings.push(`shell pawn@${toSquare(p)} on rank ${p.rank} will march off its post — keep keys/defenders on rank 5+`);
  }
  // Surge reach: with Surge the king never reacts mid-turn, so any square
  // Rookie can END a turn on that is <= 2 rook moves (captures allowed) from
  // a square on his line is a T3 (+2) win. Report the shortest such path as
  // an info number in the idea line rather than failing — every fair level
  // has one; the number just says how much setup Surge needs.

  // Adjacent pieces are keys too (docs: "pieces adjacent to him are keys").
  for (const p of pieces) {
    if (p === k) continue;
    // Diagonal pawn defenders next to a rank-7 king are the revenge-1 L6
    // "balcony" shape and fine; any OTHER piece touching him is a key that
    // walks away from its post.
    if (p.type !== 'pawn' && Math.max(Math.abs(p.file - k.file), Math.abs(p.rank - k.rank)) === 1 && !spec.still)
      warnings.push(`${p.type}@${toSquare(p)} adjacent to the king`);
  }
  return { errors, warnings };
}

// ─────────────────────────────────────────────────────────────────────────────
// Candidate enumeration (deterministic)

export interface Candidate {
  id: string;
  spec: LevelSpec;
  puzzle: RunPuzzle;
  lint: LintReport;
}

function rngFor(archetype: string, slot: number, variant: number, seed: number): RNG {
  let h = 2166136261 >>> 0;
  for (const ch of `${archetype}:${slot}:${variant}:${seed}`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return mulberry32(h);
}

export function buildCandidates(opts: { slots: number[]; archetypes: string[]; variants: number; seed: number }): Candidate[] {
  const out: Candidate[] = [];
  for (const a of ARCHETYPES) {
    if (!opts.archetypes.includes(a.id)) continue;
    for (const slot of opts.slots) {
      for (let v = 0; v < opts.variants; v++) {
        const spec = a.fn(slot, v, rngFor(a.id, slot, v, opts.seed));
        if (!spec) continue;
        out.push({
          id: `${a.id}-L${slot}-v${v + 1}`,
          spec,
          puzzle: specToPuzzle(spec),
          lint: lintSpec(spec),
        });
      }
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Bot scoring (same game loop as revenge.ts matrix, offers dismissed)

const MAX_TURNS = 300;
const CORE_LOADOUTS = ['none', ...REVENGE_CORE];
const T6: Bot = createMctsBot({ id: 'T5', name: 'T6 Revenge (MCTS-320)', rolloutCount: 320 });

function loadoutFor(id: string, slot: number): OwnedAbility[] {
  if (id === 'none') return [];
  const tier = Math.min(5, 1 + Math.floor((slot - 1) / 3)) as AbilityTier;
  const aid = id as AbilityId;
  return [{ id: aid, tier, mutations: [], usesLeftThisLevel: maxUsesForTier(aid, tier) }];
}

type FailMode = 'won' | 'captured' | 'move-limit' | 'stall' | 'dead-end';

function playOne(puzzle: RunPuzzle, loadout: string, seed: string, bot: Bot): { failMode: FailMode; moves: number } {
  const rng = rngFromString(seed);
  const s0 = puzzleToBoardState(puzzle, {
    runId: 'revenge-1',
    abilities: loadoutFor(loadout, puzzle.level),
    aiRngSeed: (Math.floor(rng() * 0xffffffff) >>> 0) || 1,
  });
  let state: BoardState = { ...s0, abilities: refreshAbilityUses(s0.abilities) };
  const ctx: BotContext = {
    excludedAbilities: new Set(),
    forcedAcceptIds: new Set(),
    forcedSkipIds: new Set(),
    rng: rngFromString(seed + ':bot'),
  };
  let prev = state;
  for (let turn = 0; turn < MAX_TURNS; turn++) {
    if (state.status !== 'playing') break;
    if (state.pendingOffer) {
      state = applyDismissOffer(state);
      continue;
    }
    if (state.turn !== 'rookie') {
      prev = state;
      state = settleEnemyTurns(state);
      continue;
    }
    const action: BotAction = bot.decide(state, ctx);
    prev = state;
    state = applyBotAction(state, action);
    if (state === prev) break;
  }
  let failMode: FailMode;
  if (state.status === 'won') failMode = 'won';
  else if (state.status === 'lost') {
    const captured = state.pieces.some((p) => p.file === prev.rookie.file && p.rank === prev.rookie.rank);
    failMode = captured ? 'captured' : state.moveLimit !== null && state.moveCount >= state.moveLimit ? 'move-limit' : 'captured';
  } else if (state.turn === 'rookie' && state === prev) failMode = 'dead-end';
  else failMode = 'stall';
  return { failMode, moves: state.moveCount };
}

export interface CellResult {
  loadout: string;
  trials: number;
  wins: number;
  captured: number;
  moveLimit: number;
  stall: number;
  deadEnd: number;
  avgMoves: number;
}

export interface Scored {
  id: string;
  cells: CellResult[];
  score: number;
  seconds: number;
}

function scoreCells(slot: number, cells: CellResult[], warnings: number): number {
  const target = [0, 100, 100, 100, 100, 90, 50, 55, 50, 30, 30][slot];
  const pct = (c: CellResult) => (c.trials ? (100 * c.wins) / c.trials : 0);
  let score = 100;
  const none = cells.find((c) => c.loadout === 'none');
  if (none) score -= 1.5 * Math.abs(pct(none) - target);
  for (const c of cells) {
    if (c.loadout === 'none') continue;
    if ((REVENGE_CORE as readonly string[]).includes(c.loadout)) score -= 2 * Math.max(0, 80 - pct(c));
    else score -= 0.5 * Math.max(0, 70 - pct(c));
    if (c.stall > 0) score -= 25;
  }
  if (none && none.stall > 0) score -= 25;
  score -= 4 * warnings;
  return Math.round(score * 10) / 10;
}

function scoreCandidate(c: Candidate, loadouts: string[], trials: number, tier: string): Scored {
  const bot = tier === 'T6' ? T6 : T5;
  const t0 = Date.now();
  const cells: CellResult[] = [];
  for (const lo of loadouts) {
    const cell: CellResult = { loadout: lo, trials, wins: 0, captured: 0, moveLimit: 0, stall: 0, deadEnd: 0, avgMoves: 0 };
    let moves = 0;
    for (let t = 0; t < trials; t++) {
      const r = playOne(c.puzzle, lo, `gen:${c.id}:${lo}:${t}`, bot);
      if (r.failMode === 'won') cell.wins++;
      else if (r.failMode === 'captured') cell.captured++;
      else if (r.failMode === 'move-limit') cell.moveLimit++;
      else if (r.failMode === 'stall') cell.stall++;
      else cell.deadEnd++;
      moves += r.moves;
    }
    cell.avgMoves = Math.round((moves / Math.max(1, trials)) * 10) / 10;
    cells.push(cell);
  }
  return { id: c.id, cells, score: scoreCells(c.spec.slot, cells, c.lint.warnings.length), seconds: (Date.now() - t0) / 1000 };
}

// ─────────────────────────────────────────────────────────────────────────────
// Rendering

function asciiBoard(puzzle: RunPuzzle): string {
  const grid: string[][] = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => '.'));
  const set = (f: number, r: number, ch: string) => {
    grid[8 - r][f - 1] = ch;
  };
  for (const sq of puzzle.kingPen ?? []) set(sq.charCodeAt(0) - 96, Number(sq[1]), ':');
  for (const h of puzzle.hazards ?? []) set(h.file, h.rank, '#');
  for (const p of puzzle.pieces) set(p.file, p.rank, p.type === 'knight' ? 'n' : p.type[0]);
  const lines = grid.map((row, i) => `${8 - i} | ${row.join(' ')}`);
  lines.push('    a b c d e f g h');
  return lines.join('\n');
}

function ctor(p: EnemyPiece): string {
  return `${p.type}(${p.file}, ${p.rank})`;
}

function roleComment(spec: LevelSpec): string {
  const g = (label: Group['label']) => spec.groups.filter((x) => x.label === label).flatMap((x) => x.pieces);
  const sqs = (ps: EnemyPiece[]) => ps.map((p) => `${p.type === 'king' ? 'K' : p.type[0]}${toSquare(p)}`).join(' ');
  const parts: string[] = [];
  const keys = g('key');
  if (keys.length) parts.push(`Key${keys.length > 1 ? 's' : ''} ${sqs(keys)}`);
  const d = g('defenders');
  if (d.length) parts.push(`defended by ${sqs(d)}`);
  const s = g('shell');
  if (s.length) parts.push(`shell ${sqs(s)}`);
  const h = g('hunters');
  if (h.length) parts.push(`hunters ${sqs(h)}`);
  const m = g('marchers');
  if (m.length) parts.push(`marchers ${sqs(m)}`);
  return parts.join('; ');
}

/** runs.ts-style snippet — pastes straight into a RunDef `levels` array. */
export function renderSnippet(spec: LevelSpec): string {
  const lines: string[] = [];
  lines.push(`    // L${spec.slot} — ${spec.title}. ${spec.idea}`);
  lines.push(`    // ${roleComment(spec)}.`);
  const groupLines = spec.groups.map((g) => `        ${g.pieces.map(ctor).join(', ')},`);
  if (spec.still) {
    lines.push(`    make(`);
    lines.push(`      ${spec.slot},`);
    lines.push(`      [`);
    lines.push(...groupLines);
    lines.push(`      ],`);
    lines.push(`      STILL,`);
    lines.push(`    ),`);
    return lines.join('\n');
  }
  lines.push(`    make(`);
  lines.push(`      ${spec.slot},`);
  lines.push(`      [`);
  lines.push(...groupLines);
  lines.push(`      ],`);
  lines.push(`      {`);
  lines.push(`        ...FLEE,`);
  if (spec.moveLimit) lines.push(`        moveLimit: ${spec.moveLimit},`);
  if (spec.hazards.length) lines.push(`        hazards: [${spec.hazards.map((h) => `X(${h.file}, ${h.rank})`).join(', ')}],`);
  lines.push(`        kingPen: [${(spec.kingPen ?? []).map((s) => `'${s}'`).join(', ')}],`);
  lines.push(`      },`);
  lines.push(`    ),`);
  return lines.join('\n');
}

function pctStr(c: CellResult): string {
  const p = Math.round((100 * c.wins) / Math.max(1, c.trials));
  const tail: string[] = [];
  if (c.captured) tail.push(`c${c.captured}`);
  if (c.moveLimit) tail.push(`m${c.moveLimit}`);
  if (c.stall) tail.push(`s${c.stall}`);
  return `${p}%${tail.length ? ` (${tail.join(',')})` : ''}`;
}

function renderIndex(cands: Candidate[], scored: Map<string, Scored>, loadouts: string[], meta: Record<string, unknown>): string {
  const out: string[] = [];
  out.push(`# Rookie's Revenge — generated candidates (${meta.date})`);
  out.push('');
  out.push(`Bot ${meta.tier}, ${meta.trials} trials per cell, realistic tiers, offers dismissed. Seed ${meta.seed}. ${meta.seconds}s.`);
  out.push('Target for `none` per slot: 100/100/100/100/90/50/55/50/30/30. Finishers >= 80. Score = closeness to that band (100 = perfect).');
  out.push('');
  out.push('Legend: c = captured, m = out of moves, s = STALL (king unreachable — disqualifying).');
  out.push('');
  const slots = [...new Set(cands.map((c) => c.spec.slot))].sort((a, b) => a - b);
  const short = (s: string) => (s === 'none' ? 'none' : s.replace('-', '').slice(0, 7));
  for (const slot of slots) {
    out.push(`## L${slot}`);
    out.push('');
    out.push(`| rank | candidate | score | pieces | ${loadouts.map(short).join(' | ')} | lint |`);
    out.push(`|---|---|---|---|${loadouts.map(() => '---').join('|')}|---|`);
    const rows = cands
      .filter((c) => c.spec.slot === slot)
      .map((c) => ({ c, s: scored.get(c.id) }))
      .sort((a, b) => (b.s?.score ?? -999) - (a.s?.score ?? -999));
    rows.forEach(({ c, s }, i) => {
      const cells = loadouts.map((lo) => {
        const cell = s?.cells.find((x) => x.loadout === lo);
        return cell ? pctStr(cell) : '-';
      });
      const lint = c.lint.errors.length ? `FAIL: ${c.lint.errors[0]}` : c.lint.warnings.length ? `warn: ${c.lint.warnings.join('; ')}` : 'ok';
      out.push(`| ${i + 1} | ${c.id} — ${c.spec.title} | ${s ? s.score : '-'} | ${c.puzzle.pieces.length} | ${cells.join(' | ')} | ${lint} |`);
    });
    out.push('');
  }
  out.push('## Archetype ranking (mean score over scored slots)');
  out.push('');
  const byArch = new Map<string, number[]>();
  for (const c of cands) {
    const s = scored.get(c.id);
    if (!s) continue;
    if (!byArch.has(c.spec.archetype)) byArch.set(c.spec.archetype, []);
    byArch.get(c.spec.archetype)!.push(s.score);
  }
  [...byArch.entries()]
    .map(([id, xs]) => ({ id, mean: xs.reduce((a, b) => a + b, 0) / xs.length, n: xs.length }))
    .sort((a, b) => b.mean - a.mean)
    .forEach((a, i) => out.push(`${i + 1}. ${a.id} — mean ${a.mean.toFixed(1)} over ${a.n} candidates`));
  out.push('');
  out.push('Snippets: see `snippets.md` (best candidate per slot first, all others after). Lint failures were not scored.');
  return out.join('\n');
}

function renderSnippets(cands: Candidate[], scored: Map<string, Scored>): string {
  const out: string[] = [];
  out.push('# Paste-ready snippets (runs.ts style)');
  out.push('');
  out.push('Each block drops into a `RunDef.levels` array next to RUN_REVENGE_1. `STILL` / `FLEE` / `X()` are the helpers declared above RUN_REVENGE_1.');
  out.push('');
  const slots = [...new Set(cands.map((c) => c.spec.slot))].sort((a, b) => a - b);
  for (const slot of slots) {
    const rows = cands
      .filter((c) => c.spec.slot === slot && c.lint.errors.length === 0)
      .sort((a, b) => (scored.get(b.id)?.score ?? -999) - (scored.get(a.id)?.score ?? -999));
    for (const c of rows) {
      const s = scored.get(c.id);
      out.push(`## ${c.id} — score ${s ? s.score : 'n/a'}`);
      out.push('');
      out.push('```');
      out.push(asciiBoard(c.puzzle));
      out.push('```');
      out.push('');
      out.push('```ts');
      out.push(renderSnippet(c.spec));
      out.push('```');
      out.push('');
    }
  }
  return out.join('\n');
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main (parent shards candidate indices across worker processes)

interface Opts {
  slots: number[];
  archetypes: string[];
  variants: number;
  trials: number;
  tier: string;
  loadouts: string[];
  seed: number;
  jobs: number;
}

function readOpts(): Opts {
  const lo = arg('loadouts', 'core')!;
  const loadouts = lo === 'core' ? CORE_LOADOUTS : lo === 'all' ? ['none', ...REVENGE_ABILITIES] : lo.split(',').map((s) => s.trim()).filter(Boolean);
  return {
    slots: parseSlots(arg('slots')),
    archetypes: (arg('archetypes', 'all') === 'all' ? ARCHETYPES.map((a) => a.id) : arg('archetypes')!.split(',')).map((s) => s.trim()),
    variants: parseInt(arg('variants', '2')!, 10),
    trials: parseInt(arg('trials', '12')!, 10),
    tier: arg('tier', 'T5')!,
    loadouts,
    seed: parseInt(arg('seed', '0')!, 10),
    jobs: Math.max(1, Math.min(os.cpus().length - 1, parseInt(arg('jobs', '8')!, 10))),
  };
}

function workerMain(opts: Opts): void {
  const idx = (arg('idx') ?? '').split(',').filter(Boolean).map(Number);
  const cands = buildCandidates(opts);
  const out: Scored[] = [];
  for (const i of idx) {
    const c = cands[i];
    if (!c || c.lint.errors.length) continue;
    out.push(scoreCandidate(c, opts.loadouts, opts.trials, opts.tier));
  }
  process.stdout.write(JSON.stringify(out));
}

async function main(): Promise<void> {
  const opts = readOpts();
  if (arg('worker') === 'true') return workerMain(opts);
  const cands = buildCandidates(opts);
  const lintOnly = arg('lint-only') === 'true';
  const scorable = cands.map((c, i) => ({ c, i })).filter(({ c }) => c.lint.errors.length === 0);
  const t0 = Date.now();
  const scored = new Map<string, Scored>();
  if (!lintOnly && scorable.length) {
    const shards: number[][] = Array.from({ length: opts.jobs }, () => []);
    scorable.forEach(({ i }, n) => shards[n % opts.jobs].push(i));
    const results = await Promise.all(
      shards
        .filter((s) => s.length)
        .map(
          (shard) =>
            new Promise<Scored[]>((resolve, reject) => {
              const args = [
                'tsx',
                __filename,
                '--worker',
                `--idx=${shard.join(',')}`,
                `--slots=${opts.slots.join(',')}`,
                `--archetypes=${opts.archetypes.join(',')}`,
                `--variants=${opts.variants}`,
                `--trials=${opts.trials}`,
                `--tier=${opts.tier}`,
                `--loadouts=${opts.loadouts.join(',')}`,
                `--seed=${opts.seed}`,
              ];
              const child = spawn('npx', args, { stdio: ['ignore', 'pipe', 'inherit'] });
              let out = '';
              child.stdout.on('data', (d) => (out += d.toString()));
              child.on('close', (code) => {
                if (code !== 0) return reject(new Error(`worker exit ${code}`));
                try {
                  resolve(JSON.parse(out) as Scored[]);
                } catch (e) {
                  reject(e);
                }
              });
            }),
        ),
    );
    for (const r of results) for (const s of r) scored.set(s.id, s);
  }
  const seconds = Math.round((Date.now() - t0) / 1000);
  const date = today();
  const outDir = arg('out') ?? join(__dirname, '..', '..', 'data', 'run-playtest', 'revenge-candidates', date);
  mkdirSync(outDir, { recursive: true });
  const meta = { date, tier: opts.tier, trials: opts.trials, seed: opts.seed, seconds };
  writeFileSync(join(outDir, 'INDEX.md'), renderIndex(cands, scored, opts.loadouts, meta));
  writeFileSync(join(outDir, 'snippets.md'), renderSnippets(cands, scored));
  writeFileSync(
    join(outDir, 'results.json'),
    JSON.stringify(
      {
        meta,
        opts,
        candidates: cands.map((c) => ({ id: c.id, slot: c.spec.slot, archetype: c.spec.archetype, title: c.spec.title, lint: c.lint, puzzle: c.puzzle, scored: scored.get(c.id) ?? null })),
      },
      null,
      1,
    ),
  );
  if (JSON_OUT) {
    console.log(JSON.stringify({ outDir, meta, scored: [...scored.values()] }, null, 1));
    return;
  }
  const failed = cands.filter((c) => c.lint.errors.length);
  console.log(`[revenge-generate] ${cands.length} candidates, ${failed.length} failed lint, ${scored.size} scored in ${seconds}s -> ${outDir}`);
  for (const c of failed) console.log(`  lint FAIL ${c.id}: ${c.lint.errors.join('; ')}`);
  for (const slot of opts.slots) {
    const best = cands
      .filter((c) => c.spec.slot === slot && scored.has(c.id))
      .sort((a, b) => scored.get(b.id)!.score - scored.get(a.id)!.score)
      .slice(0, 3);
    if (!best.length) continue;
    console.log(
      `  L${slot}: ${best
        .map((c) => {
          const s = scored.get(c.id)!;
          const none = s.cells.find((x) => x.loadout === 'none');
          return `${c.id} ${s.score} (none ${none ? pctStr(none) : '-'})`;
        })
        .join(' | ')}`,
    );
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
