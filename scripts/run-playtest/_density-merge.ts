/** Merge density shards per curve and print the ladder against its baseline. */
import { readFileSync, writeFileSync } from 'node:fs';
const OUT = process.argv[2];
const rows: any[] = [];
let curve = '';
for (const f of process.argv.slice(3)) {
  const j = JSON.parse(readFileSync(f, 'utf8'));
  curve = j.curve;
  rows.push(...j.ladder);
}
rows.sort((a, b) => (a.difficulty === b.difficulty ? a.rung - b.rung : a.difficulty < b.difficulty ? 1 : -1));
writeFileSync(OUT, JSON.stringify({ curve, ladder: rows }, null, 1));
const base = JSON.parse(readFileSync('data/run-playtest/sickness/BASELINE.json', 'utf8'));
const bAt = (d: string, r: number) => base.ladder.find((x: any) => x.difficulty === d && x.rung === r)?.clearPct;
console.log(`\n=== CURVE ${curve} ===`);
console.log('rung run          pieces          N base->new    H base->new');
for (let r = 1; r <= 10; r++) {
  const n = rows.find((x) => x.difficulty === 'normal' && x.rung === r);
  const h = rows.find((x) => x.difficulty === 'hard' && x.rung === r);
  if (!n) continue;
  console.log(
    String(r).padStart(2) + '  ' + n.runId.padEnd(12) +
    (n.avgAuthored + ' -> ' + n.avgAfter).padEnd(15) +
    String(bAt('normal', r)).padStart(4) + ' ->' + String(n.clearPct).padStart(4) + '     ' +
    String(bAt('hard', r)).padStart(4) + ' ->' + String(h?.clearPct).padStart(4));
}
const avg = (d: string) => (rows.filter((x) => x.difficulty === d).reduce((s, x) => s + x.clearPct, 0) / 10).toFixed(1);
const bavg = (d: string) => (base.ladder.filter((x: any) => x.difficulty === d).reduce((s: number, x: any) => s + x.clearPct, 0) / 10).toFixed(1);
console.log(`overall  normal ${bavg('normal')} -> ${avg('normal')}   hard ${bavg('hard')} -> ${avg('hard')}`);
