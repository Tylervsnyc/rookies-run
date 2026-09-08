/**
 * Render data/run-playtest/DIFFICULTY-SWEEP.md from the sweep JSON.
 *
 *   npx tsx scripts/run-playtest/difficulty-sweep-report.ts [--in=...] [--out=...]
 *
 * Pure reporting — it never simulates anything. Every number comes from the
 * JSON produced by difficulty-sweep.ts.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { DIFFICULTY_ORDER, type DifficultyId } from '../../lib/run/difficulty';
import { getRunById } from '../../lib/run/runs';
import { stageOf } from '../../lib/content/pipeline';

function arg(name: string, def?: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : (def as string);
}

const IN = arg('in', 'data/run-playtest/difficulty-sweep-2026-09-07.json');
const OUT = arg('out', 'data/run-playtest/DIFFICULTY-SWEEP.md');

interface Row { level: number; reached: number; cleared: number; clearRate: number | null; losses: Record<string, number> }
interface PairResult {
  runId: string; difficulty: DifficultyId; runs: number; tier: string;
  retriesPerLevel: number; retriesUsed: number; fullClears: number;
  fullClearRate: number; rows: Row[]; deathsAt: Record<string, number>; seconds: number;
}
interface Sweep { generated: string; n: number; tier: string; note: string; results: PairResult[] }

const sweep = JSON.parse(readFileSync(join(process.cwd(), IN), 'utf8')) as Sweep;
const runIds = [...new Set(sweep.results.map((r) => r.runId))];
const byPair = new Map(sweep.results.map((r) => [`${r.runId}|${r.difficulty}`, r]));
const get = (runId: string, d: DifficultyId) => byPair.get(`${runId}|${d}`);

const COLLAPSE = 8; // percentage points: two modes this close are not distinguishable

const L: string[] = [];
L.push('# Difficulty sweep — every player-facing run x all 4 difficulties');
L.push('');
L.push(`Generated ${sweep.generated.slice(0, 10)} from \`${IN}\`. **Every number here was measured** by`);
L.push(`\`scripts/run-playtest/difficulty-sweep.ts\`, which drives the shipped harness`);
L.push('(`revenge.ts runs`) — full runs L1→L10, random ability picks from every offer, bot tier');
L.push(`${sweep.tier}, **${sweep.n} runs per (run, difficulty) cell**.`);
L.push('');
L.push('Each mode is played the way it ships: the difficulty knobs go through `applyDifficulty`');
L.push('(enemies/turn, move limit, king behaviour, per-run `difficultyOverrides` pins) and the mode\'s');
L.push('own retry rule is honoured — Rookie unlimited (harness caps at 5 per level), Normal 1, Hard 1,');
L.push('Nightmare 0.');
L.push('');
L.push(`Sampling reality check: at n=${sweep.n} a full-run rate carries roughly ±12pp at 95% confidence, so`);
L.push(`gaps under ~${COLLAPSE}pp are noise. Per-level rates on late levels rest on however many runs *reached*`);
L.push('that level — the reached count is printed with every per-level table.');
L.push('');

// ── Headline table
L.push('## 1. Headline — full-run clear rate (%)');
L.push('');
L.push('| Run | Stage | Rookie | Normal | Hard | Nightmare | Rookie→Nightmare drop | Ladder |');
L.push('|---|---|---|---|---|---|---|---|');
interface Verdict { runId: string; rates: number[]; ladder: string; issues: string[] }
const verdicts: Verdict[] = [];
for (const runId of runIds) {
  const cells = DIFFICULTY_ORDER.map((d) => get(runId, d));
  if (cells.some((c) => !c)) continue;
  const rates = cells.map((c) => c!.fullClearRate);
  const issues: string[] = [];
  for (let i = 0; i < rates.length - 1; i++) {
    const a = rates[i], b = rates[i + 1];
    if (b > a + COLLAPSE) issues.push(`INVERTS ${DIFFICULTY_ORDER[i]}→${DIFFICULTY_ORDER[i + 1]} (${a}%→${b}%)`);
    else if (Math.abs(a - b) <= COLLAPSE) issues.push(`flat ${DIFFICULTY_ORDER[i]}≈${DIFFICULTY_ORDER[i + 1]} (${a}%/${b}%)`);
  }
  const ladder = issues.length === 0 ? 'clean' : issues.some((s) => s.startsWith('INVERTS')) ? 'INVERTED' : 'flat';
  verdicts.push({ runId, rates, ladder, issues });
  L.push(`| \`${runId}\` | ${stageOf(runId)} | ${rates[0]}% | ${rates[1]}% | ${rates[2]}% | ${rates[3]}% | ${rates[0] - rates[3]}pp | ${ladder === 'clean' ? 'yes' : ladder} |`);
}
L.push('');
const avg = (d: DifficultyId) => Math.round(runIds.map((r) => get(r, d)).filter(Boolean).reduce((s, c) => s + c!.fullClearRate, 0) / runIds.filter((r) => get(r, d)).length);
L.push(`**Mean across all measured runs:** Rookie ${avg('rookie')}% · Normal ${avg('normal')}% · Hard ${avg('hard')}% · Nightmare ${avg('nightmare')}%.`);
L.push('');

// ── Per-attempt loss rate — the pressure signal that survives the retry net
/**
 * Share of level ATTEMPTS the bot lost, x100. attempts = level visits +
 * retries used (the harness only retries after a death), so this is directly
 * comparable across modes with different retry budgets — unlike full-run
 * clear rate, which retries mask, and unlike deaths-per-visit, which a
 * 0-retry mode deflates by ending the run at the first death.
 */
function lossPerAttempt(r: PairResult): number {
  const visits = r.rows.reduce((s, x) => s + x.reached, 0);
  const attempts = visits + (r.retriesUsed ?? 0);
  const deaths = Object.values(r.deathsAt).reduce((s, x) => s + x, 0);
  return attempts ? Math.round((deaths / attempts) * 1000) / 10 : 0;
}
L.push('### 1b. Per-attempt loss rate (%) — the ladder under the retry net');
L.push('');
L.push('Full-run clear rate hides mode differences whenever retries absorb them (Rookie retries a level');
L.push('up to 5 times, Normal/Hard once, Nightmare never). This counts EVERY level attempt the bot lost,');
L.push('retried or not, over every attempt it made — so it reads the pressure a mode actually applies and');
L.push('is comparable across retry budgets. Measured counts, not estimates.');
L.push('');
L.push('| Run | Rookie | Normal | Hard | Nightmare | Pressure ladder |');
L.push('|---|---|---|---|---|---|');
for (const runId of runIds) {
  const cells = DIFFICULTY_ORDER.map((d) => get(runId, d));
  if (cells.some((c) => !c)) continue;
  const ds = cells.map((c) => lossPerAttempt(c!));
  const monotone = ds.every((v, i) => i === 0 || v >= ds[i - 1] - 0.5);
  L.push(`| \`${runId}\` | ${ds[0]}% | ${ds[1]}% | ${ds[2]}% | ${ds[3]}% | ${monotone ? 'rises' : 'NOT monotone'} |`);
}
L.push('');

// ── Ladder failures
L.push('## 2. Where the ladder breaks');
L.push('');
const inverted = verdicts.filter((v) => v.ladder === 'INVERTED');
const flat = verdicts.filter((v) => v.ladder === 'flat');
L.push(`**Inversions (a harder mode is measurably EASIER) — ${inverted.length} run(s):**`);
L.push('');
if (inverted.length === 0) L.push('- none.');
for (const v of inverted) L.push(`- \`${v.runId}\`: ${v.issues.filter((s) => s.startsWith('INVERTS')).join('; ')}`);
L.push('');
L.push(`**Collapses (adjacent modes within ${COLLAPSE}pp — the step is decorative) — ${flat.length + inverted.length} run(s) carry at least one:**`);
L.push('');
for (const v of verdicts) {
  const f = v.issues.filter((s) => s.startsWith('flat'));
  if (f.length) L.push(`- \`${v.runId}\`: ${f.join('; ')}`);
}
L.push('');

// ── Unwinnable
L.push('## 3. Effectively unwinnable modes (full-run clear ≤ 10%)');
L.push('');
const dead = sweep.results.filter((r) => r.fullClearRate <= 10).sort((a, b) => a.fullClearRate - b.fullClearRate);
if (dead.length === 0) L.push('- none.');
for (const r of dead) {
  const wall = [...r.rows].filter((x) => x.reached >= 5).sort((a, b) => (a.clearRate ?? 100) - (b.clearRate ?? 100))[0];
  L.push(`- \`${r.runId}\` **${r.difficulty}** — ${r.fullClears}/${r.runs} (${r.fullClearRate}%). Wall: L${wall?.level} at ${wall?.clearRate}% (reached ${wall?.reached}).`);
}
L.push('');

// ── Bottlenecks
L.push('## 4. Bottleneck level per run (the single worst level)');
L.push('');
L.push('Worst per-level clear rate on each difficulty, ignoring levels reached by fewer than 5 runs (too');
L.push('few to read). A worst level OUTSIDE L7–L10 means the difficulty sits in the wrong place — the run');
L.push('spikes in the middle and then coasts into its finale.');
L.push('');
L.push('| Run | Rookie | Normal | Hard | Nightmare | Early spike? |');
L.push('|---|---|---|---|---|---|');
interface Spike { runId: string; d: DifficultyId; level: number; rate: number }
const spikes: Spike[] = [];
for (const runId of runIds) {
  const cells: string[] = [];
  let early = false;
  for (const d of DIFFICULTY_ORDER) {
    const r = get(runId, d);
    if (!r) { cells.push('-'); continue; }
    const w = [...r.rows].filter((x) => x.reached >= 5).sort((a, b) => (a.clearRate ?? 100) - (b.clearRate ?? 100))[0];
    if (!w) { cells.push('-'); continue; }
    const mark = w.level < 7 ? ' **!**' : '';
    if (w.level < 7 && (w.clearRate ?? 100) < 90) { early = true; spikes.push({ runId, d, level: w.level, rate: w.clearRate ?? 100 }); }
    cells.push(`L${w.level} ${w.clearRate}%${mark}`);
  }
  L.push(`| \`${runId}\` | ${cells.join(' | ')} | ${early ? 'YES' : ''} |`);
}
L.push('');
L.push('Early spikes (worst level before L7 and under 90%), worst first:');
L.push('');
if (spikes.length === 0) L.push('- none.');
for (const s of [...spikes].sort((a, b) => a.rate - b.rate)) L.push(`- \`${s.runId}\` ${s.d}: L${s.level} at ${s.rate}%`);
L.push('');

// ── Per-run detail
L.push('## 5. Per-level detail');
L.push('');
L.push('`rate% (cleared/reached)` per level. A level nobody reached shows `-`.');
L.push('');
for (const runId of runIds) {
  const def = (() => { try { return getRunById(runId); } catch { return undefined; } })();
  L.push(`### \`${runId}\`${def && def.id === runId ? ` — ${def.name}` : ''}`);
  const ov = def?.difficultyOverrides;
  if (ov) L.push(`\nPer-run difficulty pins: \`${JSON.stringify(ov)}\`\n`);
  L.push('');
  const levels = get(runId, 'rookie')?.rows.map((r) => r.level) ?? [];
  L.push(`| Difficulty | full | ${levels.map((l) => `L${l}`).join(' | ')} |`);
  L.push(`|---|---|${levels.map(() => '---').join('|')}|`);
  for (const d of DIFFICULTY_ORDER) {
    const r = get(runId, d);
    if (!r) continue;
    const cells = r.rows.map((x) => (x.reached === 0 ? '-' : `${x.clearRate}% (${x.cleared}/${x.reached})`));
    L.push(`| ${d} | **${r.fullClearRate}%** | ${cells.join(' | ')} |`);
  }
  L.push('');
}

// ── Attention list
L.push('## 6. Runs most in need of difficulty attention (worst first)');
L.push('');
function score(v: Verdict): number {
  let s = 0;
  if (v.ladder === 'INVERTED') s += 100;
  s += v.issues.filter((x) => x.startsWith('flat')).length * 25;
  const spread = v.rates[0] - v.rates[3];
  s += Math.max(0, 40 - spread); // a flat ladder overall
  s += v.rates.filter((r) => r <= 10).length * 20; // dead modes
  const early = spikes.filter((x) => x.runId === v.runId);
  s += early.length * 10;
  return s;
}
const ranked = [...verdicts].sort((a, b) => score(b) - score(a));
L.push('| # | Run | Why |');
L.push('|---|---|---|');
ranked.forEach((v, i) => {
  const why: string[] = [];
  if (v.ladder === 'INVERTED') why.push('ladder inverts');
  const f = v.issues.filter((x) => x.startsWith('flat')).length;
  if (f) why.push(`${f} adjacent mode(s) indistinguishable`);
  const spread = v.rates[0] - v.rates[3];
  why.push(`Rookie→Nightmare spread only ${spread}pp`);
  const deadModes = DIFFICULTY_ORDER.filter((d, j) => v.rates[j] <= 10);
  if (deadModes.length) why.push(`unwinnable: ${deadModes.join(', ')}`);
  const early = spikes.filter((x) => x.runId === v.runId);
  if (early.length) why.push(`early spike (${[...new Set(early.map((e) => `L${e.level}`))].join(',')})`);
  L.push(`| ${i + 1} | \`${v.runId}\` | ${why.join('; ')} |`);
});
L.push('');

writeFileSync(join(process.cwd(), OUT), L.join('\n'));
console.error(`[report] wrote ${OUT} (${runIds.length} runs)`);
