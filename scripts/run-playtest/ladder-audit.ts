/**
 * LADDER AUDIT — grades all ten rungs against docs/LADDER-SPEC.md.
 *
 *   npx tsx scripts/run-playtest/ladder-audit.ts [trials] [runs]
 *
 * Everything on Normal, T5 bot, T1 cards — the method every run's "numbers of
 * record" block uses. Passing a difficulty is load-bearing: without it the
 * harness runs the default and a run that pins its own Hard/Nightmare deltas
 * (revenge-21) reads nothing like its docs.
 */
import { writeFileSync } from 'node:fs';
import { LADDER_RUNG_IDS } from '../../lib/run/ladder';
import { getRunById } from '../../lib/run/runs';
import { DIFFICULTIES } from '../../lib/run/difficulty';
import { matrixParallel, winPct, puzzleFor, simulateRuns, type Cell } from './revenge-core';

const TRIALS = Number(process.argv[2] ?? 32);
const RUNS = Number(process.argv[3] ?? 60);
/**
 * Grade the ladder WITH summoning sickness (Tyler, 2026-09-09: sickness goes on
 * the ladder too). The rule ships to the ladder once these finales are re-tuned
 * for it, so the targets have to be measured against the ladder as it WILL be.
 *   npx tsx ladder-audit.ts <trials> <runs> sick
 */
const SICK = process.argv[4] === 'sick';
/** One rung per process (1-10), so ten rungs can run five-up. Omit for all. */
const ONLY = process.argv[5] ? Number(process.argv[5]) : null;
const JOBS = ONLY ? 2 : 8;
const OUT_BASE = SICK ? 'data/run-playtest/ladder-audit-sick-2026-09-09' : 'data/run-playtest/ladder-audit-2026-09-09';
const OUT = ONLY ? `${OUT_BASE}.rung${ONLY}.json` : `${OUT_BASE}.json`;
const LEVELS = [7, 8, 9, 10];
const ISO = '2026-08-18';

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

const bandTarget = (r: number) => 80 - 3 * (r - 1);
const runTarget = (r: number) => 65 - 3.3 * (r - 1);
const scaleFloor = (r: number) => 3 + 0.6 * (r - 1);
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

(async () => {
  const out: any[] = [];
  for (let i = 0; i < LADDER_RUNG_IDS.length; i++) {
    const r = i + 1;
    if (ONLY && r !== ONLY) continue;
    const runId = LADDER_RUNG_IDS[i];
    const run = getRunById(runId);
    const kit = [...(run.allowedAbilities ?? [])] as string[];
    const pairKey = `${PAIRS[runId][0]}+${PAIRS[runId][1]}`;

    const cells: Cell[] = await matrixParallel({ runId, difficulty: 'normal', summonSickness: SICK }, {
      levels: LEVELS, loadouts: ['none', ...kit, pairKey], trials: TRIALS, tier: 'T5', realistic: false, jobs: JOBS,
    });
    const by: Record<string, Record<number, number>> = {};
    for (const c of cells) { by[c.loadout] ??= {}; by[c.loadout][c.level] = winPct(c); }

    const pairRow = LEVELS.map((l) => by[pairKey]?.[l] ?? 0);
    const singleRow = LEVELS.map((l) => Math.max(...['none', ...kit].map((k) => by[k]?.[l] ?? 0)));
    const pairMean = mean(pairRow);

    // 4) whole-run clear at the real retry budget
    const rep = simulateRuns({ runId, difficulty: 'normal', iso: ISO, summonSickness: SICK }, RUNS, 'T5', {
      retriesPerLevel: DIFFICULTIES.normal.retriesPerLevel,
      seedPrefix: `audit:normal:${runId}`,
    });
    const runPct = (rep.fullClears / RUNS) * 100;

    // 5) scale
    const counts: number[] = [];
    for (let lv = 0; lv < run.levels.length; lv++) counts.push(puzzleFor({ runId }, lv + 1).pieces.length);
    const avgPieces = mean(counts);
    const early = mean(counts.slice(0, 3));
    const late = mean(counts.slice(7, 10));

    const checks = {
      gate: singleRow.every((v) => v <= 8),
      used: pairRow.filter((v, k) => v - singleRow[k] >= 50).length >= 3,
      band: Math.abs(pairMean - bandTarget(r)) <= 8,
      run: Math.abs(runPct - runTarget(r)) <= 10,
      scale: avgPieces >= scaleFloor(r) && late >= early + 2,
      shape: Math.max(...pairRow) - Math.min(...pairRow) >= 15 && pairRow[3] <= pairRow[0],
    };
    // Two INDEPENDENT verdicts. The first version ORed them and stamped a rung
    // by whichever fired first, which labelled The Cliff "TOO EASY" while its
    // runs cleared at 5% — its finale reads 71% and players die before they
    // ever see it. Level difficulty and run difficulty are different questions
    // and a rung can fail them in opposite directions, so they are reported
    // separately or the table lies.
    const dir = (v: number, target: number, tol: number) =>
      Math.abs(v - target) <= tol ? 'ok' : v > target ? 'easy' : 'HARD';
    const levelVerdict = dir(pairMean, bandTarget(r), 8);
    const runVerdict = dir(runPct, runTarget(r), 10);
    const grade = !checks.gate ? 'BROKEN'
      : levelVerdict !== 'ok' || runVerdict !== 'ok' ? `lvl:${levelVerdict} run:${runVerdict}`
      : !checks.scale || !checks.shape ? 'FLAT'
      : 'PASS';

    const mark = (b: boolean) => (b ? 'ok  ' : 'FAIL');
    console.log(
      `rung ${String(r).padStart(2)} ${runId.padEnd(11)} ${grade.padEnd(18)}` +
      ` gate ${mark(checks.gate)} used ${mark(checks.used)} band ${mark(checks.band)} run ${mark(checks.run)} scale ${mark(checks.scale)} shape ${mark(checks.shape)}` +
      `  | pair ${pairRow.map((v) => String(Math.round(v)).padStart(3)).join('/')} mean ${pairMean.toFixed(0).padStart(3)} (want ${bandTarget(r)})` +
      `  run ${runPct.toFixed(0).padStart(3)}% (want ${runTarget(r).toFixed(0)})  pieces ${avgPieces.toFixed(1)} (want ${scaleFloor(r).toFixed(1)})`);
    out.push({ rung: r, runId, grade, levelVerdict, runVerdict, checks, pairRow, singleRow, pairMean, runPct, avgPieces, early, late });
    writeFileSync(OUT, JSON.stringify(out, null, 1));
  }
  console.log(`\nsummoning sickness: ${SICK ? 'ON (the ladder as it WILL be)' : 'off (the ladder as it is today)'}`);
  const n = (g: string) => out.filter((o) => o.grade === g).length;
  console.log(`\nPASS ${n('PASS')}  BROKEN ${n('BROKEN')}  TOO EASY ${n('TOO EASY')}  TOO HARD ${n('TOO HARD')}  FLAT ${n('FLAT')}`);
})();
