/**
 * Pick the density curve that makes the ladder an actual ladder.
 *
 * The objective is written down rather than eyeballed: a real ladder should
 * hand a competent player a high chance on rung 1 and a low one on rung 10.
 * Target full-run clear rate falls linearly 65% -> 35% across the ten rungs on
 * Normal (and 50% -> 20% on Hard), and a curve scores as the mean absolute
 * distance from that line. Lower is better. Baseline is scored the same way so
 * "no change" always competes honestly.
 */
import { readFileSync, existsSync } from 'node:fs';

const targetFor = (rung: number, d: string) =>
  d === 'normal' ? 65 - ((rung - 1) * 30) / 9 : 50 - ((rung - 1) * 30) / 9;

function score(ladder: any[]): number {
  let sum = 0;
  let n = 0;
  for (const r of ladder) {
    sum += Math.abs(r.clearPct - targetFor(r.rung, r.difficulty));
    n++;
  }
  return n ? sum / n : Infinity;
}

const cands: Array<{ name: string; score: number }> = [];
const base = JSON.parse(readFileSync('data/run-playtest/sickness/BASELINE.json', 'utf8'));
cands.push({ name: 'BASE', score: score(base.ladder) });
for (const c of ['A', 'B', 'C']) {
  const f = `data/run-playtest/density/CURVE-${c}.json`;
  if (!existsSync(f)) continue;
  cands.push({ name: c, score: score(JSON.parse(readFileSync(f, 'utf8')).ladder) });
}
cands.sort((a, b) => a.score - b.score);
for (const c of cands) console.error(`${c.name.padEnd(5)} mean distance from the ladder line: ${c.score.toFixed(1)}pp`);
process.stdout.write(cands[0].name);
