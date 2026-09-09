/**
 * ENGINE REGRESSION GATE — did this engine change move the ladder?
 *
 * The capturing king (d83153c, 2026-09-07) broke six of ten rungs — one to
 * 0% — and was found a day later by a hand bisect. This is that bisect,
 * automated: re-grade every rung against spec.ts at a reduced budget, compare
 * with the latest FILED audit (results ledger), and print + post the delta.
 *
 *   npx tsx scripts/run-playtest/engine-regression.ts [--trials=48] [--runs=40] [--jobs=4]
 *
 * Exit 0 = no rung changed grade; 3 = at least one rung changed grade (the CI
 * check goes red, the Slack line names the rungs). Posts to SLACK_WEBHOOK_URL
 * when set. Runs from .github/workflows/engine-regression.yml on every push
 * that touches lib/run/** or the registry.
 */
import { auditLadder, type RungResult } from './ladder-audit';
import { latestResult } from './results';
import { engineFingerprint, fmtFingerprint } from './fingerprint';
import { BUDGET, fmtEstimate } from './spec';

function num(name: string, def: number): number {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? Number(hit.split('=')[1]) : def;
}

async function post(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }) });
  } catch (e) {
    console.error('slack post failed', e);
  }
}

(async () => {
  const before = latestResult<{ rows: RungResult[] }>('ladder-audit');
  const now = engineFingerprint();
  const o = { trials: num('trials', BUDGET.nightly.trials), runs: num('runs', BUDGET.nightly.runs), jobs: num('jobs', 4), sick: false };
  console.log(`engine ${fmtFingerprint(now)} · baseline ${before ? `${before.date} on ${fmtFingerprint(before.engine)}` : 'NONE'} · ${o.trials} trials, ${o.runs} runs`);
  const after = await auditLadder(o);

  const L: string[] = [];
  L.push(`ENGINE REGRESSION — ${fmtFingerprint(now)} vs ${before ? `${before.date} ${fmtFingerprint(before.engine)}` : 'no baseline'}`);
  let changed = 0;
  for (const a of after.rows) {
    const b = before?.body.rows.find((r) => r.runId === a.runId);
    const gradeMoved = !!b && b.grade !== a.grade;
    if (gradeMoved) changed++;
    const pairDelta = b ? a.pairMean.pct - b.pairMean.pct : 0;
    const runDelta = b ? a.run.pct - b.run.pct : 0;
    const flag = gradeMoved ? '  <-- GRADE CHANGED' : Math.abs(pairDelta) > 15 || Math.abs(runDelta) > 15 ? '  (moved >15)' : '';
    L.push(
      `rung ${a.rung} ${a.runId}: ${b ? b.grade : '-'} -> ${a.grade} · pair ${b ? Math.round(b.pairMean.pct) : '-'} -> ${fmtEstimate(a.pairMean)} · run ${b ? Math.round(b.run.pct) : '-'} -> ${fmtEstimate(a.run)}${flag}`,
    );
  }
  L.push(changed ? `${changed} rung(s) changed grade — re-tune before shipping or re-file the baseline knowingly.` : 'No rung changed grade.');
  L.push(`filed: ${after.file}`);
  const text = L.join('\n');
  console.log('\n' + text);
  await post(text);
  process.exit(changed ? 3 : 0);
})().catch(async (e) => {
  console.error(e);
  await post(`ENGINE REGRESSION FAILED to run: ${(e as Error).message.slice(0, 200)}`);
  process.exit(1);
});
