/**
 * Client side of the global daily leaderboard (`run_scores`).
 * - A stable anonymous player id lives in localStorage.
 * - A handle ("Rook-4821" by default) the player can rename on the landing.
 * - submitScore() fires at run end; fetchBoard() feeds the landing dossier.
 * Everything fails soft — the game never depends on this.
 */
import type { LeaderboardResponse } from '@/app/api/run/leaderboard/route';

export type { LeaderboardResponse, LeaderboardRow } from '@/app/api/run/leaderboard/route';

const PLAYER_KEY = 'rookies-revenge-player-id';
const HANDLE_KEY = 'rookies-revenge-handle';
export const HANDLE_RE = /^[a-zA-Z0-9_.-]{2,16}$/;

export function getPlayerId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(PLAYER_KEY);
  if (!id) {
    id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`).slice(0, 64);
    localStorage.setItem(PLAYER_KEY, id);
  }
  return id;
}

export function getHandle(): string {
  if (typeof window === 'undefined') return 'Rook';
  const saved = localStorage.getItem(HANDLE_KEY);
  if (saved && HANDLE_RE.test(saved)) return saved;
  // Deterministic-ish default from the player id so it survives reloads.
  const id = getPlayerId();
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const fresh = `Rook-${String(h % 10000).padStart(4, '0')}`;
  localStorage.setItem(HANDLE_KEY, fresh);
  return fresh;
}

/** Returns the cleaned handle, or null if invalid. */
export function setHandle(raw: string): string | null {
  const h = raw.trim().replace(/\s+/g, '_');
  if (!HANDLE_RE.test(h)) return null;
  localStorage.setItem(HANDLE_KEY, h);
  return h;
}

export interface ScoreSubmission {
  runDate: string;
  runId: string;
  difficulty: string;
  levelsCleared: number;
  totalLevels: number;
  captures: number;
  completed: boolean;
}

export async function submitScore(s: ScoreSubmission): Promise<boolean> {
  try {
    const res = await fetch('/api/run/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, playerId: getPlayerId(), handle: getHandle() }),
      keepalive: true,
    });
    if (!res.ok) return false;
    const j = (await res.json()) as { recorded?: boolean };
    return !!j.recorded;
  } catch {
    return false;
  }
}

export async function fetchBoard(runDate: string, runId: string): Promise<LeaderboardResponse | null> {
  try {
    const q = new URLSearchParams({ date: runDate, run: runId, player: getPlayerId() });
    const res = await fetch(`/api/run/leaderboard?${q}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as LeaderboardResponse;
  } catch {
    return null;
  }
}
