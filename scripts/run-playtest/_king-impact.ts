/**
 * One-off: what did the CAPTURING KING (2026-09-08) do to difficulty?
 *
 * Run twice — once on HEAD, once in a worktree at the pre-king commit — and
 * diff the two JSON files. Deliberately uses SINGLE-ability loadouts, because
 * a full T5 kit clears every shipped level 100% either way and can measure
 * nothing.
 *
 *   npx tsx scripts/run-playtest/_king-impact.ts <out.json>
 */
import { writeFileSync } from 'node:fs';
import { REVENGE_RUN_IDS } from '../../lib/run/runs';
import { matrixParallel, winPct, type Cell } from './revenge-core';

const OUT = process.argv[2] ?? 'data/run-playtest/king-impact.json';
const LEVELS = [1, 4, 7, 10];
const LOADOUTS = ['none', 'queen-pulse', 'knight-hop', 'freeze-ray'];
const TRIALS = 24;
const RUNS = REVENGE_RUN_IDS.slice(0, 12);

type Store = Record<string, Record<string, Record<number, number>>>;

(async () => {
  const store: Store = {};
  for (const runId of RUNS) {
    const t0 = Date.now();
    const cells: Cell[] = await matrixParallel({ runId }, {
      levels: LEVELS, loadouts: LOADOUTS, trials: TRIALS, tier: 'T5', realistic: false, jobs: 8,
    });
    const byLo: Record<string, Record<number, number>> = {};
    for (const c of cells) {
      byLo[c.loadout] = byLo[c.loadout] ?? {};
      byLo[c.loadout][c.level] = winPct(c);
    }
    store[runId] = byLo;
    writeFileSync(OUT, JSON.stringify(store, null, 1));
    const line = LOADOUTS.map((lo) => `${lo}=${LEVELS.map((l) => byLo[lo]?.[l] ?? '-').join('/')}`).join('  ');
    console.log(`[${runId}] ${((Date.now() - t0) / 1000).toFixed(0)}s  ${line}`);
  }
  console.log(`wrote ${OUT}`);
})();
