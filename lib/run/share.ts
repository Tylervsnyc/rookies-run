/**
 * Share data for Rookie's Revenge.
 *
 * Two layers:
 *  - `buildShareString` — the one-line Wordle-style text
 *    (`Rookie's Revenge · YYYY-MM-DD · Level X/N · streak Y`).
 *  - `ShareCardData` + `encodeShareCard` / `decodeShareCard` — everything the
 *    share IMAGE needs (final board, kit, moves, stars, streak), round-tripped
 *    through a query string so `/api/og/run?...` is self-describing. The same
 *    object feeds the in-app preview (components/run/ShareCard.tsx).
 */

import type { AbilityId } from './abilities';
import { toSquare } from './types';

export interface ShareInput {
  iso: string; // YYYY-MM-DD
  levelReached: number;
  totalLevels: number;
  completed: boolean;
  currentStreak: number;
}

export function buildShareString({
  iso,
  levelReached,
  totalLevels,
  completed,
  currentStreak,
}: ShareInput): string {
  const result = completed
    ? `${totalLevels}/${totalLevels} ✓`
    : `Level ${levelReached}/${totalLevels}`;
  const streakPart =
    currentStreak > 1 ? ` · streak ${currentStreak}` : '';
  return `Rookie's Revenge · ${iso} · ${result}${streakPart}`;
}

// ---------------------------------------------------------------------------
// Share card data.
// ---------------------------------------------------------------------------

export const SHARE_URL = 'https://run.chesspath.app';
export const SHARE_URL_LABEL = 'run.chesspath.app';

/** Piece letters on the shared board. Enemies are never rooks; allies can be (Bodyguard). */
export type SharePieceType = 'p' | 'n' | 'b' | 'q' | 'k' | 'r';

export interface SharePiece {
  type: SharePieceType;
  /** Algebraic square, e.g. "e8". */
  sq: string;
}

export interface ShareCardData {
  runName: string;
  /** YYYY-MM-DD */
  iso: string;
  /** Difficulty name ("Hard"); absent for STC runs. */
  difficulty?: string;
  completed: boolean;
  /** Level the player reached (1-indexed). = totalLevels on a completed run. */
  levelReached: number;
  totalLevels: number;
  /** Rookie moves over the run (the clearing attempt of every level). */
  moves: number;
  /** Par moves for the run. */
  par: number;
  stars: 0 | 1 | 2 | 3;
  /** The day's kit — up to four ability ids, in offer order. */
  kit: AbilityId[];
  /** Rookie's square in the final position. */
  rookie: string;
  enemies: SharePiece[];
  allies: SharePiece[];
  /** Current daily streak (0/1 = not shown). */
  streak: number;
}

const PIECE_LETTERS = new Set<string>(['p', 'n', 'b', 'q', 'k', 'r']);
const SQUARE_RE = /^[a-h][1-8]$/;
const ABILITY_ID_RE = /^[a-z][a-z-]{1,24}$/;
const MAX_KIT = 4;
const MAX_PIECES = 32;

function isSquare(s: string): boolean {
  return SQUARE_RE.test(s);
}

/**
 * Board position as one compact token list: `@e8` = Rookie, lowercase =
 * enemy (`pa7`), uppercase = ally (`Nd4`). Dot-separated, Rookie first.
 */
function encodePosition(d: Pick<ShareCardData, 'rookie' | 'enemies' | 'allies'>): string {
  const parts = [`@${d.rookie}`];
  for (const p of d.enemies) parts.push(`${p.type}${p.sq}`);
  for (const p of d.allies) parts.push(`${p.type.toUpperCase()}${p.sq}`);
  return parts.join('.');
}

function decodePosition(raw: string): Pick<ShareCardData, 'rookie' | 'enemies' | 'allies'> | null {
  const parts = raw.split('.').filter(Boolean);
  if (parts.length === 0 || parts.length > MAX_PIECES + 1) return null;
  let rookie = '';
  const enemies: SharePiece[] = [];
  const allies: SharePiece[] = [];
  for (const part of parts) {
    const head = part[0];
    const sq = part.slice(1);
    if (!isSquare(sq)) return null;
    if (head === '@') {
      if (rookie) return null;
      rookie = sq;
      continue;
    }
    const lower = head.toLowerCase();
    if (!PIECE_LETTERS.has(lower)) return null;
    (head === lower ? enemies : allies).push({ type: lower as SharePieceType, sq });
  }
  if (!rookie) return null;
  return { rookie, enemies, allies };
}

const LETTER_FOR: Record<string, SharePieceType> = { pawn: 'p', knight: 'n', bishop: 'b', queen: 'q', king: 'k', rook: 'r' };

/** Board pieces (enemies or allies) → share pieces. Unknown types are dropped. */
export function sharePiecesFrom(list: ReadonlyArray<{ type: string; file: number; rank: number }>): SharePiece[] {
  const out: SharePiece[] = [];
  for (const p of list) {
    const type = LETTER_FOR[p.type];
    if (type) out.push({ type, sq: toSquare(p) });
  }
  return out;
}

/** Query string (no leading `?`) for `/api/og/run`. */
export function encodeShareCard(d: ShareCardData): string {
  const q = new URLSearchParams();
  q.set('v', '1');
  q.set('run', d.runName);
  q.set('d', d.iso);
  if (d.difficulty) q.set('diff', d.difficulty);
  q.set('c', d.completed ? '1' : '0');
  q.set('l', String(d.levelReached));
  q.set('t', String(d.totalLevels));
  q.set('m', String(d.moves));
  q.set('p', String(d.par));
  q.set('s', String(d.stars));
  if (d.kit.length) q.set('k', d.kit.slice(0, MAX_KIT).join(','));
  q.set('pos', encodePosition(d));
  if (d.streak > 1) q.set('st', String(d.streak));
  return q.toString();
}

function int(v: string | null, lo: number, hi: number): number | null {
  if (v === null || !/^\d{1,5}$/.test(v)) return null;
  const n = Number(v);
  return n >= lo && n <= hi ? n : null;
}

/** Parse + validate a query string produced by `encodeShareCard`. `null` = not a share card. */
export function decodeShareCard(params: URLSearchParams): ShareCardData | null {
  if (params.get('v') !== '1') return null;
  const runName = (params.get('run') ?? '').trim().slice(0, 40);
  const iso = params.get('d') ?? '';
  if (!runName || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const difficulty = (params.get('diff') ?? '').trim().slice(0, 20) || undefined;
  const totalLevels = int(params.get('t'), 1, 30);
  const levelReached = int(params.get('l'), 1, 30);
  const moves = int(params.get('m'), 0, 9999);
  const par = int(params.get('p'), 1, 9999);
  const stars = int(params.get('s'), 0, 3);
  if (totalLevels === null || levelReached === null || moves === null || par === null || stars === null) return null;
  const pos = decodePosition(params.get('pos') ?? '');
  if (!pos) return null;
  const kit = (params.get('k') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => ABILITY_ID_RE.test(s))
    .slice(0, MAX_KIT) as AbilityId[];
  const streak = int(params.get('st'), 0, 99999) ?? 0;
  return {
    runName,
    iso,
    difficulty,
    completed: params.get('c') === '1',
    levelReached: Math.min(levelReached, totalLevels),
    totalLevels,
    moves,
    par,
    stars: stars as 0 | 1 | 2 | 3,
    kit,
    ...pos,
    streak,
  };
}

/** "Sep 3, 2026" from an ISO date, no timezone games. */
export function formatShareDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[(m ?? 1) - 1] ?? ''} ${d}, ${y}`;
}

/** The challenge line that rides along with the image (and stands alone as the text fallback). */
export function buildShareText(d: ShareCardData): string {
  const head = d.completed
    ? `Beat my ${d.moves} moves on Rookie's Revenge`
    : `I made it to level ${d.levelReached}/${d.totalLevels} on Rookie's Revenge`;
  return `${head} · ${d.runName} · ${formatShareDate(d.iso)}. Same run, same abilities, today only.`;
}
