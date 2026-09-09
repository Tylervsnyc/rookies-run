/** One-off: re-take the FINALE (L7-L10) numbers for every shipped combo run
 *  with the post-fix (deterministic) harness. Checkpoints as it goes. */
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { getRunById } from '../../lib/run/runs';
import { matrixParallel, winPct, type Cell } from './revenge-core';

const PAIRS: Record<string, [string, string]> = {
  'revenge-13': ['bishop-squire', 'swap'],
  'revenge-14': ['vanguard', 'swap'],
  'revenge-15': ['magnet', 'boulder'],
  'revenge-16': ['poison-dart', 'bishop-squire'],
  'revenge-17': ['dragon', 'sacrifice'],
  'revenge-18': ['freeze-ray', 'vanguard'],
  'revenge-19': ['convert', 'summon-knight'],
  'revenge-20': ['smoke', 'rabies-dart'],
  'revenge-21': ['boulder', 'knight-hop'],
  'revenge-22': ['dragon', 'duchess'],
  'revenge-23': ['knight-hop', 'twin'],
  'revenge-24': ['duchess', 'decoy'],
  'revenge-25': ['become-king', 'boulder'],
  'revenge-26': ['become-king', 'boulder'],
  'revenge-27': ['scarecrow', 'knight-hop'],
};

const OUT = 'data/run-playtest/finale-remeasure-2026-09-06.json';
const TRIALS = 32;
const LEVELS = [7, 8, 9, 10];

type Store = Record<string, Record<string, Record<number, number>>>;
const store: Store = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};

(async () => {
  for (const [runId, pair] of Object.entries(PAIRS)) {
    if (store[runId]) { console.log(`skip ${runId} (checkpointed)`); continue; }
    const run = getRunById(runId);
    const kit = [...(run.allowedAbilities ?? [])] as string[];
    const loadouts = ['none', ...kit, `${pair[0]}+${pair[1]}`];
    const t0 = Date.now();
    const cells: Cell[] = await matrixParallel({ runId }, {
      levels: LEVELS, loadouts, trials: TRIALS, tier: 'T5', realistic: false, jobs: 8,
    });
    const byLo: Record<string, Record<number, number>> = {};
    for (const c of cells) {
      byLo[c.loadout] = byLo[c.loadout] ?? {};
      byLo[c.loadout][c.level] = winPct(c);
    }
    store[runId] = byLo;
    writeFileSync(OUT, JSON.stringify(store, null, 1));
    const line = loadouts.map((lo) => `${lo}=${LEVELS.map((l) => byLo[lo][l]).join('/')}`).join('  ');
    console.log(`[${runId}] ${((Date.now() - t0) / 1000).toFixed(0)}s  ${line}`);
  }
  console.log('DONE');
})().catch((e) => { console.error(e); process.exit(1); });
