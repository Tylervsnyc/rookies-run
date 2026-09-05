import { REVENGE_RUN_IDS, RUNS, STC_RUN_IDS } from './runs';

const STC = new Set<string>(STC_RUN_IDS);

const REVENGE = new Set<string>(REVENGE_RUN_IDS);
// Daily rotation = Rookie's Revenge runs only (classic rank-8 runs are picker-only).
const DAILY_POOL = RUNS.filter((r) => REVENGE.has(r.id) && !STC.has(r.id));

const EPOCH_DATE = '2026-01-01';

function daysSinceEpoch(yyyyMmDd: string): number {
  const a = Date.UTC(
    Number(yyyyMmDd.slice(0, 4)),
    Number(yyyyMmDd.slice(5, 7)) - 1,
    Number(yyyyMmDd.slice(8, 10)),
  );
  const b = Date.UTC(2026, 0, 1);
  return Math.floor((a - b) / 86400000);
}

/**
 * Pinned dailies — a specific run (and optionally a difficulty + kit seed)
 * on a specific date, ahead of the rotation. Tyler 2026-09-03: Dead Bolt as
 * the daily; then "a harder run with 4 random abilities" → the same run on
 * Hard with a fresh kit. Remove entries once they've passed.
 */
export interface DailyOverride {
  runId: string;
  /** Forces the daily's difficulty (still subject to the player's unlock). */
  difficulty?: 'rookie' | 'normal' | 'hard' | 'nightmare';
  /** Alternate seed for the 4-ability kit (default = the ISO date). */
  kitSeed?: string;
}
const DAILY_OVERRIDES: Readonly<Record<string, DailyOverride>> = {
  '2026-09-03': { runId: 'revenge-11', difficulty: 'hard', kitSeed: '2026-09-03-hard' },
  '2026-09-04': { runId: 'revenge-12', difficulty: 'normal', kitSeed: '2026-09-04-moat' }, // The Moat, pinned so Tyler can try it on TestFlight today
  '2026-09-05': { runId: 'revenge-13', difficulty: 'normal', kitSeed: '2026-09-05-colonnade' }, // The Colonnade — Tyler approved it into the pool 2026-09-05
};

export function getDailyOverride(yyyyMmDd: string): DailyOverride | null {
  const o = DAILY_OVERRIDES[yyyyMmDd];
  return o && DAILY_POOL.some((r) => r.id === o.runId) ? o : null;
}

export function getRunIdForDate(yyyyMmDd: string): string {
  const pinned = getDailyOverride(yyyyMmDd);
  if (pinned) return pinned.runId;
  if (DAILY_POOL.length === 0) return RUNS[0].id;
  const idx = ((daysSinceEpoch(yyyyMmDd) % DAILY_POOL.length) + DAILY_POOL.length) % DAILY_POOL.length;
  return DAILY_POOL[idx].id;
}

export function getTodayInTZ(tz: string): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(new Date());
}

export function isValidDate(yyyyMmDd: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return false;
  const d = new Date(yyyyMmDd + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === yyyyMmDd;
}

export function isFutureDate(yyyyMmDd: string, tz: string): boolean {
  return yyyyMmDd > getTodayInTZ(tz);
}

export function getDailyVaultDates(tz: string, count = 30): string[] {
  const today = getTodayInTZ(tz);
  const out: string[] = [];
  const base = new Date(today + 'T00:00:00Z');
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export const DAILY_EPOCH = EPOCH_DATE;
