/**
 * Prints the graded ladder table from the LATEST filed audit in the results
 * ledger (results.ts), with its engine fingerprint and whether it still
 * describes the current tree.
 *
 *   npx tsx scripts/run-playtest/ladder-report.ts [--sick]
 */
import { latestResult } from './results';
import { engineFingerprint, fmtFingerprint, sameEngine } from './fingerprint';
import { BAND_TOL, RUN_TOL, fmtEstimate, fmtGrade, type Graded } from './spec';
import type { RungResult } from './ladder-audit';

const sick = process.argv.includes('--sick');
const last = latestResult<{ rows: RungResult[] }>(sick ? 'ladder-audit-sick' : 'ladder-audit');
if (!last) {
  console.log('no ladder audit on file — run ladder-audit.ts');
  process.exit(2);
}
const now = engineFingerprint();
console.log(`ladder audit ${last.date} · engine ${fmtFingerprint(last.engine)} · ${sameEngine(last.engine, now) ? 'CURRENT' : `STALE (engine now ${fmtFingerprint(now)})`} · ${last.budget.trials} trials, ${last.budget.runs} runs`);
console.log('rung run          grade                        gate  used  pair T1      pair ARRIVAL [95%] (want)      kit arrival    runs [95%] (want)        pieces(≥)  shape repeat');
const g = (gr: Graded) => (gr.verdict === 'PASS' ? 'ok' : gr.verdict === 'FAIL' ? 'FAIL' : `?${gr.trialsNeeded ?? ''}`);
for (const o of [...last.body.rows].sort((a, b) => a.rung - b.rung)) {
  console.log(
    String(o.rung).padStart(2) + '   ' + o.runId.padEnd(12) + fmtGrade(o.grade).padEnd(29) +
    g(o.checks.gate).padEnd(6) + (o.checks.used ? 'ok' : 'FAIL').padEnd(6) +
    fmtEstimate(o.pairMean).padEnd(13) +
    (o.pairArrivalMean ? `${fmtEstimate(o.pairArrivalMean)} (${o.targets.band}±${BAND_TOL}) ${g(o.checks.band)}` : '-').padEnd(31) +
    (o.kitArrivalMean ? fmtEstimate(o.kitArrivalMean) : '-').padEnd(15) +
    `${fmtEstimate(o.run)} (${o.targets.run.toFixed(0)}±${RUN_TOL}) ${g(o.checks.run)}`.padEnd(26) +
    `${o.avgPieces.toFixed(1)}(${o.targets.scale.toFixed(1)})`.padEnd(11) +
    (o.checks.shape ? 'ok' : 'FAIL').padEnd(6) +
    (o.checks.repeat === undefined ? '-' : o.checks.repeat ? 'ok' : 'FAIL'),
  );
  for (const f of o.checks.botBlind ?? []) console.log(`       BOT-BLIND L${f.level} (${f.source}): ${f.detail}`);
}
console.log(`\n${last.conclusion}`);
console.log('? = INCONCLUSIVE at this budget; the number after ? is the trials/cell that would settle it. BAND is graded on ARRIVAL; T1 is context.');
