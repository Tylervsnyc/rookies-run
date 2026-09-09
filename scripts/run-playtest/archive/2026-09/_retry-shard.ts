/**
 * RETRY BUDGET sweep. Tonight's sickness test found that difficulty in Revenge
 * is set almost entirely by the retry budget, not by level hardness: Normal and
 * Hard both allow exactly ONE retry per level, so a level cleared 20% of the
 * time ends ~64% of runs. Tyler's bar is Shotgun King — "sometimes I have to
 * try a level 20 times before I beat it" — which is cheap retries on a hard
 * thing. We are one retry on an easier thing.
 *
 * This measures what the ladder feels like at 1 / 3 / 5 retries per level, so
 * "harder levels + more forgiving runs" can be evaluated as one design instead
 * of two guesses.
 *
 *   npx tsx scripts/run-playtest/_retry-shard.ts <out.json> <retries> <runs> <shard> <shards>
 */
import { writeFileSync } from 'node:fs';
import { LADDER_RUNG_IDS } from '../../lib/run/ladder';
import type { DifficultyId } from '../../lib/run/difficulty';
import { simulateRuns } from './revenge-core';

const OUT = process.argv[2];
const RETRIES = Number(process.argv[3] ?? 1);
const RUNS = Number(process.argv[4] ?? 60);
const SHARD = Number(process.argv[5] ?? 0);
const SHARDS = Number(process.argv[6] ?? 1);
const ISO = '2026-08-18';

const rows: any[] = [];
let cell = -1;
for (const difficulty of ['normal', 'hard'] as DifficultyId[]) {
  for (let i = 0; i < LADDER_RUNG_IDS.length; i++) {
    cell++;
    if (cell % SHARDS !== SHARD) continue;
    const runId = LADDER_RUNG_IDS[i];
    const rep = simulateRuns({ runId, difficulty, iso: ISO }, RUNS, 'T5', {
      retriesPerLevel: RETRIES,
      seedPrefix: `sick:${difficulty}:${runId}`,
    });
    const clearPct = Math.round((rep.fullClears / RUNS) * 100);
    rows.push({ rung: i + 1, runId, difficulty, retriesAllowed: RETRIES, clearPct, retries: rep.retriesUsed });
    console.log(`[r${RETRIES} s${SHARD}][${difficulty}] rung ${i + 1} ${runId.padEnd(11)} clear ${String(clearPct).padStart(3)}%`);
  }
}
writeFileSync(OUT, JSON.stringify({ retriesAllowed: RETRIES, runs: RUNS, ladder: rows }, null, 1));
