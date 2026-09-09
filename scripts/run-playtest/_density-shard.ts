/**
 * Ladder DENSITY sweep — does adding pieces as you climb actually make the
 * ladder feel like a ladder? (Tyler, 2026-09-08.)
 *
 * Same suites and seeds as the sickness sweep, so every number here is directly
 * comparable to data/run-playtest/sickness/BASELINE.json. The only difference is
 * `puzzleTransform`, which tops each authored level up to its curve's target.
 *
 *   npx tsx scripts/run-playtest/_density-shard.ts <out.json> <curve A|B|C> <runs> <shard> <shards>
 */
import { writeFileSync } from 'node:fs';
import { LADDER_RUNG_IDS } from '../../lib/run/ladder';
import { DIFFICULTIES, type DifficultyId } from '../../lib/run/difficulty';
import { applyLadderDensity, ladderTargetPieces, type DensityCurve } from '../../lib/run/ladder-density';
import { simulateRuns } from './revenge-core';

const OUT = process.argv[2];
const CURVE = (process.argv[3] ?? 'A') as DensityCurve;
const RUNS = Number(process.argv[4] ?? 60);
const SHARD = Number(process.argv[5] ?? 0);
const SHARDS = Number(process.argv[6] ?? 1);
const ISO = '2026-08-18';

const rows: any[] = [];
let cell = -1;
for (const difficulty of ['normal', 'hard'] as DifficultyId[]) {
  const retriesPerLevel = DIFFICULTIES[difficulty].retriesPerLevel;
  for (let i = 0; i < LADDER_RUNG_IDS.length; i++) {
    cell++;
    if (cell % SHARDS !== SHARD) continue;
    const runId = LADDER_RUNG_IDS[i];
    let authored = 0;
    let after = 0;
    const rep = simulateRuns({ runId, difficulty, iso: ISO }, RUNS, 'T5', {
      retriesPerLevel,
      // Same seedPrefix as the baseline sweep: identical runs, different boards.
      seedPrefix: `sick:${difficulty}:${runId}`,
      puzzleTransform: (p, lv) => {
        const out = applyLadderDensity(p, i, lv - 1, CURVE, 1000 + i * 31 + lv);
        authored += p.pieces.length;
        after += out.pieces.length;
        return out;
      },
    });
    const deaths: Record<number, number> = {};
    for (const r of rep.rows) if (r.reached > r.cleared) deaths[r.level] = r.reached - r.cleared;
    const clearPct = Math.round((rep.fullClears / RUNS) * 100);
    rows.push({
      rung: i + 1,
      runId,
      difficulty,
      clearPct,
      retries: rep.retriesUsed,
      deaths,
      avgAuthored: +(authored / (RUNS * 10)).toFixed(1),
      avgAfter: +(after / (RUNS * 10)).toFixed(1),
      targetL1: ladderTargetPieces(i, 0, CURVE),
      targetL10: ladderTargetPieces(i, 9, CURVE),
    });
    console.log(`[${CURVE} s${SHARD}][${difficulty}] rung ${i + 1} ${runId.padEnd(11)} clear ${String(clearPct).padStart(3)}%  pieces ${(authored / (RUNS * 10)).toFixed(1)} -> ${(after / (RUNS * 10)).toFixed(1)}`);
  }
}
writeFileSync(OUT, JSON.stringify({ curve: CURVE, runs: RUNS, shard: SHARD, shards: SHARDS, ladder: rows }, null, 1));
console.log(`[${CURVE} s${SHARD}] wrote ${OUT}`);
