/**
 * LADDER GATE + BAND CHECK — the current truth for all ten rungs.
 *
 * Written 2026-09-08 because ladder.ts's "pair avg" column is STALE: it quotes
 * finale-remeasure-2026-09-06.json and still says The Slash, The Stacks and The
 * Parapet read 100/100/100/100 with the rework "queued". All three were in fact
 * reworked on 2026-09-07 (revenge-21 -> 78/72/59/47, revenge-15 -> 72.8 mean,
 * revenge-23 -> 72/69/66/63). A doc that says work is pending after it shipped
 * is how a run gets built twice, so this re-measures rather than trusts.
 *
 * For each rung: every single card in the kit and the signature pair, on
 * L7-L10. The contract is a BAND, not a floor — single cards <= 8% (the combo
 * is required) AND the pair inside 60-80% (it is required AND hard).
 */
import { writeFileSync } from 'node:fs';
import { getRunById } from '../../lib/run/runs';
import { LADDER_RUNG_IDS } from '../../lib/run/ladder';
import { matrixParallel, winPct, type Cell } from './revenge-core';

const PAIRS: Record<string, [string, string]> = {
  'revenge-21': ['boulder', 'knight-hop'],
  'revenge-18': ['freeze-ray', 'vanguard'],
  'revenge-15': ['magnet', 'boulder'],
  'revenge-23': ['knight-hop', 'twin'],
  'revenge-12': ['bishop-squire', 'swap'],
  'revenge-24': ['duchess', 'decoy'],
  'revenge-25': ['become-king', 'boulder'],
  'revenge-19': ['convert', 'summon-knight'],
  'revenge-22': ['dragon', 'duchess'],
  'revenge-17': ['dragon', 'sacrifice'],
};
const OUT = process.argv[2] ?? 'data/run-playtest/ladder-gate-2026-09-08.json';
const TRIALS = Number(process.argv[3] ?? 64);
const LEVELS = [7, 8, 9, 10];
const store: any = {};

(async () => {
  for (let i = 0; i < LADDER_RUNG_IDS.length; i++) {
    const runId = LADDER_RUNG_IDS[i];
    const pair = PAIRS[runId];
    const run = getRunById(runId);
    const kit = [...(run.allowedAbilities ?? [])] as string[];
    const loadouts = ['none', ...kit, `${pair[0]}+${pair[1]}`];
    // Normal — the difficulty every run's 'numbers of record' block was
    // measured on. Without it the harness runs the default and a run that pins
    // its own Hard/Nightmare deltas (revenge-21) reads nothing like its docs.
    const cells: Cell[] = await matrixParallel({ runId, difficulty: 'normal' }, {
      levels: LEVELS, loadouts, trials: TRIALS, tier: 'T5', realistic: false, jobs: 8,
    });
    const by: Record<string, Record<number, number>> = {};
    for (const c of cells) {
      by[c.loadout] ??= {};
      by[c.loadout][c.level] = winPct(c);
    }
    const pairKey = `${pair[0]}+${pair[1]}`;
    const pairRow = LEVELS.map((l) => by[pairKey]?.[l] ?? 0);
    const pairMean = pairRow.reduce((a, b) => a + b, 0) / 4;
    const worstSingle = Math.max(...kit.map((k) => Math.max(...LEVELS.map((l) => by[k]?.[l] ?? 0))));
    store[runId] = { rung: i + 1, pair: pairKey, byLoadout: by, pairRow, pairMean, worstSingle };
    const band = pairMean >= 60 && pairMean <= 80 ? 'OK ' : pairMean > 80 ? 'TOO EASY' : 'TOO HARD';
    console.log(
      `rung ${String(i + 1).padStart(2)} ${runId.padEnd(11)} pair ${pairRow.map((v) => String(Math.round(v)).padStart(3)).join('/')}` +
      `  mean ${pairMean.toFixed(1).padStart(5)}  ${band.padEnd(8)}  worst single ${worstSingle.toFixed(0)}%`);
    writeFileSync(OUT, JSON.stringify(store, null, 1));
  }
  console.log(`wrote ${OUT}`);
})();
