/**
 * The DIAL sweep — difficulty knobs that don't feed the player.
 *
 * The density sweep (2026-09-08) refuted "more pieces on harder levels": every
 * curve scored worse than no change, five rungs fell to 0%, and rung 1 got
 * EASIER (53% -> 67%) because on a sparse board extra enemies are capture
 * material, i.e. tempo, i.e. food. Piece count is not a difficulty dial; below
 * some density it points backwards.
 *
 * These two knobs have no food problem, and both scale with the RUNG, so what
 * is being tested is a ramp rather than a uniform tax:
 *   mv   — move limit tightens as you climb: -0 on rung 1 down to -4 on rung 10.
 *   ept  — the top half of the ladder gets +1 enemy action per turn.
 *   both — both at once.
 *
 *   npx tsx scripts/run-playtest/_dial-shard.ts <out.json> <mv|ept|both> <runs> <shard> <shards>
 */
import { writeFileSync } from 'node:fs';
import { LADDER_RUNG_IDS } from '../../lib/run/ladder';
import { DIFFICULTIES, type DifficultyId } from '../../lib/run/difficulty';
import { simulateRuns } from './revenge-core';
import type { RunPuzzle } from '../../lib/run/types';

const OUT = process.argv[2];
const DIAL = process.argv[3] ?? 'mv';
const RUNS = Number(process.argv[4] ?? 60);
const SHARD = Number(process.argv[5] ?? 0);
const SHARDS = Number(process.argv[6] ?? 1);
const ISO = '2026-08-18';
const MOVE_FLOOR = 4;

function dialed(p: RunPuzzle, rungIndex: number): RunPuzzle {
  const out: RunPuzzle = { ...p };
  if (DIAL === 'mv' || DIAL === 'both') {
    const cut = Math.round(rungIndex * 0.45);
    if (typeof p.moveLimit === 'number' && cut > 0) out.moveLimit = Math.max(MOVE_FLOOR, p.moveLimit - cut);
  }
  if (DIAL === 'ept' || DIAL === 'both') {
    if (rungIndex >= 5) out.enemiesPerTurn = (p.enemiesPerTurn ?? 1) + 1;
  }
  return out;
}

const rows: any[] = [];
let cell = -1;
for (const difficulty of ['normal', 'hard'] as DifficultyId[]) {
  const retriesPerLevel = DIFFICULTIES[difficulty].retriesPerLevel;
  for (let i = 0; i < LADDER_RUNG_IDS.length; i++) {
    cell++;
    if (cell % SHARDS !== SHARD) continue;
    const runId = LADDER_RUNG_IDS[i];
    const rep = simulateRuns({ runId, difficulty, iso: ISO }, RUNS, 'T5', {
      retriesPerLevel,
      seedPrefix: `sick:${difficulty}:${runId}`,
      puzzleTransform: (p) => dialed(p, i),
    });
    const clearPct = Math.round((rep.fullClears / RUNS) * 100);
    rows.push({ rung: i + 1, runId, difficulty, dial: DIAL, clearPct, retries: rep.retriesUsed });
    console.log(`[${DIAL} s${SHARD}][${difficulty}] rung ${i + 1} ${runId.padEnd(11)} clear ${String(clearPct).padStart(3)}%`);
  }
}
writeFileSync(OUT, JSON.stringify({ dial: DIAL, runs: RUNS, ladder: rows }, null, 1));
