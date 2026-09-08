/**
 * One-off: what would SUMMONING SICKNESS do to difficulty?
 *
 * Run once on HEAD, once with the change applied, and diff. Loadouts are the
 * summon family alone — the only cards the rule can possibly touch.
 *   npx tsx scripts/run-playtest/_summon-sick.ts <out.json>
 */
import { writeFileSync } from 'node:fs';
import { REVENGE_RUN_IDS } from '../../lib/run/runs';
import { matrixParallel, winPct, type Cell } from './revenge-core';

const OUT = process.argv[2] ?? 'data/run-playtest/summon-sick.json';
const LEVELS = [4, 7, 10];
const LOADOUTS = ['dragon', 'duchess', 'twin', 'vanguard', 'bishop-squire', 'summon-knight'];
const TRIALS = 32;
const RUNS = REVENGE_RUN_IDS.slice(0, 12);

(async () => {
  const store: Record<string, Record<string, Record<number, number>>> = {};
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
    console.log(`[${runId}] ${((Date.now() - t0) / 1000).toFixed(0)}s  ` +
      LOADOUTS.map((lo) => `${lo}=${LEVELS.map((l) => byLo[lo]?.[l] ?? '-').join('/')}`).join('  '));
  }
  console.log(`wrote ${OUT}`);
})();
