/** Merge _sickness-shard.ts outputs into one summary (same shape as _sickness-full.ts). */
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = process.argv[2];
const FILES = process.argv.slice(3);

const ladder: any[] = [];
const endless: { index: number; depth: number }[] = [];
for (const f of FILES) {
  const j = JSON.parse(readFileSync(f, 'utf8'));
  ladder.push(...j.ladder);
  endless.push(...j.endless);
}
ladder.sort((a, b) => (a.difficulty === b.difficulty ? a.rung - b.rung : a.difficulty < b.difficulty ? 1 : -1));
endless.sort((a, b) => a.index - b.index);
const depths = endless.map((e) => e.depth);
const sorted = [...depths].sort((a, b) => a - b);
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};
const summary = {
  ladder,
  endless: {
    depths,
    median: median(depths),
    p10: sorted[Math.floor(sorted.length * 0.1)],
    p90: sorted[Math.floor(sorted.length * 0.9)],
    min: sorted[0],
    max: sorted[sorted.length - 1],
  },
};
writeFileSync(OUT, JSON.stringify(summary, null, 1));
const norm = ladder.filter((r) => r.difficulty === 'normal');
const hard = ladder.filter((r) => r.difficulty === 'hard');
const avg = (rs: any[]) => (rs.reduce((s, r) => s + r.clearPct, 0) / rs.length).toFixed(1);
console.log(`LADDER full-clear  normal ${avg(norm)}%  hard ${avg(hard)}%`);
console.log(`ENDLESS depth  median ${summary.endless.median}  p10 ${summary.endless.p10}  p90 ${summary.endless.p90}  range ${summary.endless.min}-${summary.endless.max}`);
console.log(`wrote ${OUT}`);
