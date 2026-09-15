/**
 * LINE SIGNATURE — "is this the same solution again?" (check 7, REPEAT).
 *
 * Tyler, 2026-09-15: Millstone L7-L10 and Glasshouse L7-L8 are "the same
 * pattern". Nothing in the harness could see that: every check read a clear
 * RATE, and four levels solved by one line can each read a healthy 60%.
 *
 * A winning line's signature is three things, all measured against where the
 * king STARTS (his home square and pen), so a level mirrored two files over
 * reads the same:
 *
 *   1. the casts, in order — `ability` for an untargeted cast (knight-hop,
 *      aegis), `ability@where` for a targeted one. Consecutive identical
 *      tokens collapse, so 2 stones or 3 stones on the same side is one idea.
 *   2. where each targeted cast lands relative to the king:
 *        king  on his square        pen   inside his pen
 *        adj   touching him         line  same file or rank
 *        diag  on his diagonal      near  two squares away
 *        far   anywhere else
 *   3. the capture shape — who took him and how:
 *        cap:<form>/<step|orth|diag|L|jump>   Rookie in that form
 *        cap:ally/<shape>                     a summon/squire
 *        cap:other                            a drone, poison, an enemy phase
 *
 *   e.g.  boulder@adj>boulder@near>knight-hop | cap:knight/L
 *
 * A level's signature = its most common winning line (spec.ts
 * REPEAT_MIN_SHARE / REPEAT_MIN_WINS). REPEAT fails when two finale levels
 * have the same one. Deliberately coarse: a false "different" (the lines
 * differ only by a square) is what tuning would chase; a false "same" is
 * what a human confirms by playing both.
 */

import { ABILITY_DEFS, type AbilityId } from '../../lib/run/abilities';
import { fromSquare, toSquare, type BoardState, type Coord, type RunPuzzle } from '../../lib/run/types';
import { REPEAT_MIN_SHARE, REPEAT_MIN_WINS } from './spec';
import type { BotAction } from './types';

export interface KingHome {
  king: Coord | null;
  pen: Set<string>;
}

export function kingHomeOfPuzzle(p: RunPuzzle): KingHome {
  const k = p.pieces.find((x) => x.type === 'king');
  return { king: k ? { file: k.file, rank: k.rank } : null, pen: new Set(p.kingPen ?? []) };
}

export function kingHomeOfState(s: BoardState): KingHome {
  const k = s.pieces.find((x) => x.type === 'king');
  return { king: k ? { file: k.file, rank: k.rank } : null, pen: new Set(s.kingPen ?? []) };
}

const cheb = (a: Coord, b: Coord) => Math.max(Math.abs(a.file - b.file), Math.abs(a.rank - b.rank));

export function whereRelative(target: Coord, home: KingHome): string {
  const sq = toSquare(target);
  if (!home.king) return 'far';
  if (target.file === home.king.file && target.rank === home.king.rank) return 'king';
  if (home.pen.has(sq)) return 'pen';
  const d = cheb(target, home.king);
  if (d === 1) return 'adj';
  if (target.file === home.king.file || target.rank === home.king.rank) return 'line';
  if (Math.abs(target.file - home.king.file) === Math.abs(target.rank - home.king.rank)) return 'diag';
  return d === 2 ? 'near' : 'far';
}

export function stepShape(from: Coord, to: Coord): string {
  const df = Math.abs(to.file - from.file);
  const dr = Math.abs(to.rank - from.rank);
  if ((df === 1 && dr === 2) || (df === 2 && dr === 1)) return 'L';
  if (Math.max(df, dr) === 1) return 'step';
  if (df === 0 || dr === 0) return 'orth';
  if (df === dr) return 'diag';
  return 'jump';
}

export function castToken(ability: string, target: Coord | null, home: KingHome): string {
  return target ? `${ability}@${whereRelative(target, home)}` : ability;
}

export function composeSignature(casts: string[], capture: string): string {
  const collapsed = casts.filter((t, i) => t !== casts[i - 1]);
  return `${collapsed.length ? collapsed.join('>') : 'no-cast'} | ${capture}`;
}

// ── Bot games ───────────────────────────────────────────────────────────────

/** Feed every Rookie-side step of one bot game; read `.signature()` if it was won. */
export class LineRecorder {
  private casts: string[] = [];
  private capture = 'cap:other';
  constructor(private readonly home: KingHome) {}

  step(before: BoardState, action: BotAction, after: BoardState): void {
    if (after === before) return;
    const kingBefore = before.pieces.find((p) => p.type === 'king');
    const kingGone = !!kingBefore && !after.pieces.some((p) => p.type === 'king');
    if (action.kind === 'ability-target') this.casts.push(castToken(action.abilityId, action.target, this.home));
    else if (action.kind === 'activate-ability') this.casts.push(castToken(action.abilityId, null, this.home));
    if (!kingGone && after.status !== 'won') return;
    if (!kingBefore) return;
    if (action.kind === 'move') this.capture = `cap:${before.form}/${stepShape(before.rookie, kingBefore)}`;
    else if (action.kind === 'squire-move') this.capture = `cap:ally/${action.from ? stepShape(action.from, kingBefore) : 'step'}`;
    else if (action.kind === 'ability-target') this.capture = `cap:cast-${action.abilityId}`;
  }

  signature(): string {
    return composeSignature(this.casts, this.capture);
  }
}

// ── Human traces ────────────────────────────────────────────────────────────

type Ev = Record<string, unknown> & { kind: string };

/**
 * Signature of a human's WINNING attempt on one level, from raw trace events
 * (no replay needed — casts carry their target square, captures carry
 * from/to/form). `events` = that level's events; only those after its last
 * death count (the attempt that won).
 */
export function humanLineSignature(events: Ev[], home: KingHome): string | null {
  let start = 0;
  events.forEach((e, i) => { if (e.kind === 'death' || e.kind === 'retry' || e.kind === 'level-start') start = e.kind === 'death' ? i + 1 : i; });
  const evs = events.slice(start);
  const casts: string[] = [];
  let capture: string | null = null;
  let lastAction: Ev | null = null;
  for (let i = 0; i < evs.length; i++) {
    const e = evs[i];
    if (e.kind === 'ability-activate') {
      const def = ABILITY_DEFS[e.ability as AbilityId];
      const arming = def && (def.activation === 'movement' || def.activation === 'targeted');
      if (!arming) casts.push(castToken(String(e.ability), null, home));
      lastAction = e;
    } else if (e.kind === 'ability-target' || e.kind === 'ability-move') {
      // Magnet's second tap (the landing) is a second ability-target for the
      // same card. Only Magnet: Boulder records one ability-target PER STONE
      // after a single activation, and every stone counts.
      const prev = evs[i - 1];
      const secondTap = e.ability === 'magnet' && prev && prev.kind === 'ability-target' && prev.ability === 'magnet';
      if (!secondTap && typeof e.target === 'string') casts.push(castToken(String(e.ability), fromSquare(e.target), home));
      lastAction = e;
    } else if (e.kind === 'rookie-move') {
      if (e.captured === 'king' && typeof e.from === 'string' && typeof e.to === 'string') {
        capture = `cap:${String(e.form ?? 'rook')}/${stepShape(fromSquare(e.from), fromSquare(e.to))}`;
      }
      lastAction = e;
    } else if (e.kind === 'squire-move') {
      lastAction = e;
    }
  }
  if (!lastAction) return null;
  if (!capture) {
    capture = lastAction.kind === 'squire-move' && typeof lastAction.from === 'string' && typeof lastAction.to === 'string'
      ? `cap:ally/${stepShape(fromSquare(lastAction.from), fromSquare(lastAction.to))}`
      : 'cap:other';
  }
  return composeSignature(casts, capture);
}

// ── REPEAT ──────────────────────────────────────────────────────────────────

export interface LevelLine {
  signature: string;
  wins: number;
  share: number;
}

/** A level's dominant winning line, or null when there are too few wins to call one. */
export function dominantLine(counts: Record<string, number> | undefined): LevelLine | null {
  if (!counts) return null;
  const wins = Object.values(counts).reduce((a, b) => a + b, 0);
  let best: [string, number] | null = null;
  for (const [sig, n] of Object.entries(counts)) if (!best || n > best[1]) best = [sig, n];
  if (!best || wins < REPEAT_MIN_WINS) return null;
  const share = best[1] / wins;
  if (share < REPEAT_MIN_SHARE) return null;
  return { signature: best[0], wins, share: Math.round(share * 100) / 100 };
}

export interface RepeatRead {
  ok: boolean;
  byLevel: Record<number, LevelLine | null>;
  /** Levels that share a signature, e.g. [[7, 9, "boulder@adj | cap:rook/orth"]]. */
  repeats: Array<[number, number, string]>;
}

export function repeatCheck(countsByLevel: Record<number, Record<string, number> | undefined>): RepeatRead {
  const byLevel: Record<number, LevelLine | null> = {};
  for (const lv of Object.keys(countsByLevel).map(Number)) byLevel[lv] = dominantLine(countsByLevel[lv]);
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);
  const repeats: RepeatRead['repeats'] = [];
  for (let i = 0; i < levels.length; i++) {
    for (let j = i + 1; j < levels.length; j++) {
      const a = byLevel[levels[i]];
      const b = byLevel[levels[j]];
      if (a && b && a.signature === b.signature) repeats.push([levels[i], levels[j], a.signature]);
    }
  }
  return { ok: repeats.length === 0, byLevel, repeats };
}

/** Merge signature counts (cells of the same level from several loadouts). */
export function addCounts(into: Record<string, number>, from: Record<string, number> | undefined): Record<string, number> {
  for (const [k, v] of Object.entries(from ?? {})) into[k] = (into[k] ?? 0) + v;
  return into;
}
