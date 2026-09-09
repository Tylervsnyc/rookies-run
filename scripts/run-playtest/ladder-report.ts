/**
 * Prints the graded ladder table from the LATEST filed audit in the results
 * ledger (results.ts), with its engine fingerprint and whether it still
 * describes the current tree.
 *
 *   npx tsx scripts/run-playtest/ladder-report.ts [--sick]
 */
import { latestResult } from './results';
import { engineFingerprint, fmtFingerprint, sameEngine } from './fingerprint';
import { BAND_TOL, RUN_TOL, fmtEstimate, type Graded } from './spec';
import type { RungResult } from './ladder-audit';

const sick = process.argv.includes('--sick');
const last = latestResult<{ rows: RungResult[] }>(sick ? 'ladder-audit-sick' : 'ladder-audit');
if (!last) {
  console.log('no ladder audit on file — run ladder-audit.ts');
  process.exit(2);
}
const now = engineFingerprint();
console.log(`ladder audit ${last.date} · engine ${fmtFingerprint(last.engine)} · ${sameEngine(last.engine, now) ? 'CURRENT' : `STALE (engine now ${fmtFingerprint(now)})`} · ${last.budget.trials} trials, ${last.budget.runs} runs`);
console.log('rung run          grade         gate  used  levels [95%] (want)        runs [95%] (want)        pieces(≥)  shape');
const g = (gr: Graded) => (gr.verdict === 'PASS' ? 'ok' : gr.verdict === 'FAIL' ? 'FAIL' : `?${gr.trialsNeeded ?? ''}`);
for (const o of [...last.body.rows].sort((a, b) => a.rung - b.rung)) {
  console.log(
    String(o.rung).padStart(2) + '   ' + o.runId.padEnd(12) + o.grade.padEnd(14) +
    g(o.checks.gate).padEnd(6) + (o.checks.used ? 'ok' : 'FAIL').padEnd(6) +
    `${fmtEstimate(o.pairMean)} (${o.targets.band}±${BAND_TOL}) ${g(o.checks.band)}`.padEnd(30) +
    `${fmtEstimate(o.run)} (${o.targets.run.toFixed(0)}±${RUN_TOL}) ${g(o.checks.run)}`.padEnd(26) +
    `${o.avgPieces.toFixed(1)}(${o.targets.scale.toFixed(1)})`.padEnd(11) +
    (o.checks.shape ? 'ok' : 'FAIL'),
  );
}
console.log(`\n${last.conclusion}`);
console.log('? = INCONCLUSIVE at this budget; the number after ? is the trials/cell that would settle it.');
