/** Prints the graded ladder table from ladder-audit shard files. */
import { readFileSync, readdirSync } from 'node:fs';
const dir = 'data/run-playtest';
const prefix = process.argv[2] ?? 'ladder-audit-sick-2026-09-09';
const rows: any[] = [];
for (const f of readdirSync(dir)) {
  if (f.startsWith(prefix) && f.endsWith('.json')) rows.push(...JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
}
rows.sort((a, b) => a.rung - b.rung);
const bandTarget = (r: number) => 80 - 3 * (r - 1);
const runTarget = (r: number) => 65 - 3.3 * (r - 1);
const scaleFloor = (r: number) => 3 + 0.6 * (r - 1);
const dirOf = (v: number, t: number, tol: number) => (Math.abs(v - t) <= tol ? 'ok' : v > t ? 'easy' : 'HARD');
console.log('rung run          gate  used  levels(want)      runs(want)     pieces(want)  shape');
for (const o of rows) {
  const lv = dirOf(o.pairMean, bandTarget(o.rung), 8);
  const rn = dirOf(o.runPct, runTarget(o.rung), 10);
  console.log(
    String(o.rung).padStart(2) + '   ' + o.runId.padEnd(12) +
    (o.checks.gate ? ' ok  ' : ' FAIL').padEnd(6) +
    (o.checks.used ? ' ok  ' : ' FAIL').padEnd(6) +
    (o.pairMean.toFixed(0) + '(' + bandTarget(o.rung) + ') ' + lv).padEnd(18) +
    (o.runPct.toFixed(0) + '%(' + runTarget(o.rung).toFixed(0) + ') ' + rn).padEnd(15) +
    (o.avgPieces.toFixed(1) + '(' + scaleFloor(o.rung).toFixed(1) + ')').padEnd(14) +
    (o.checks.shape ? 'ok' : 'FAIL'));
}
const bad = (f: (o: any) => boolean) => rows.filter(f).length;
console.log(`\n${rows.length} rungs graded · gate broken ${bad((o) => !o.checks.gate)} · levels off-band ${bad((o) => dirOf(o.pairMean, bandTarget(o.rung), 8) !== 'ok')} · runs off-band ${bad((o) => dirOf(o.runPct, runTarget(o.rung), 10) !== 'ok')} · under piece floor ${bad((o) => o.avgPieces < scaleFloor(o.rung))} · shape ${bad((o) => !o.checks.shape)}`);
