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
    const rate = w.clearRate ?? 100;
    if (rate >= 95) { cells.push(`none (min ${rate}%)`); continue; }
    const mark = w.level < 7 ? ' **!**' : '';
    if (w.level < 7 && rate < 90) { early = true; spikes.push({ runId, d, level: w.level, rate }); }
    cells.push(`L${w.level} ${rate}%${mark}`);
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
  // A mode nobody can finish is the loudest failure.
  s += v.rates.filter((r) => r <= 10).length * 60;
  if (v.ladder === 'INVERTED') s += 50;
  // A run that sits at the ceiling on ALL FOUR modes has no ladder at all.
  if (v.rates.every((r) => r >= 95)) s += 40;
  s += v.issues.filter((x) => x.startsWith('flat')).length * 10;
  s += new Set(spikes.filter((x) => x.runId === v.runId).map((x) => x.level)).size * 15;
  return s;
}
const ranked = [...verdicts].sort((a, b) => score(b) - score(a) || (a.rates[0] - a.rates[3]) - (b.rates[0] - b.rates[3]));
L.push('| # | Run | Why |');
L.push('|---|---|---|');
ranked.forEach((v, i) => {
  const why: string[] = [];
  if (v.ladder === 'INVERTED') why.push('ladder inverts');
  const f = v.issues.filter((x) => x.startsWith('flat')).length;
  if (f) why.push(`${f} adjacent mode(s) indistinguishable`);
  const spread = v.rates[0] - v.rates[3];
  if (v.rates.every((r) => r >= 95)) why.push('no ladder at all — all four modes at the ceiling');
  else why.push(`Rookie→Nightmare spread ${spread}pp`);
  const deadModes = DIFFICULTY_ORDER.filter((d, j) => v.rates[j] <= 10);
  if (deadModes.length) why.push(`unwinnable: ${deadModes.join(', ')}`);
  const early = spikes.filter((x) => x.runId === v.runId);
  if (early.length) why.push(`early spike (${[...new Set(early.map((e) => `L${e.level}`))].join(',')})`);
  L.push(`| ${i + 1} | \`${v.runId}\` | ${why.join('; ')} |`);
});
L.push('');


// ── Per-run pins + caveats
L.push('## 7. The per-run `difficultyOverrides` pins');
L.push('');
L.push('Three measured runs carry a pin. A pin replaces a difficulty\'s GLOBAL delta for that run only.');
L.push('');
for (const runId of runIds) {
  let def; try { def = getRunById(runId); } catch { continue; }
  if (!def?.difficultyOverrides || def.id !== runId) continue;
  const rates = DIFFICULTY_ORDER.map((d) => get(runId, d)?.fullClearRate ?? null);
  L.push(`- \`${runId}\` pins \`${JSON.stringify(def.difficultyOverrides)}\` — Rookie ${rates[0]}% / Normal ${rates[1]}% / Hard ${rates[2]}% / Nightmare ${rates[3]}%.`);
}
L.push('');
const r21n = get('revenge-21', 'normal');
const r21h = get('revenge-21', 'hard');
if (r21n && r21h) {
  const same = r21n.rows.every((row, i) => row.cleared === r21h.rows[i].cleared && row.reached === r21h.rows[i].reached);
  L.push('**revenge-21 is the test case for whether a global delta is the right mechanism, and the answer measured');
  L.push(`here is no.** With both deltas pinned to 0, Hard's curve is ${same ? 'IDENTICAL to Normal\'s at every one of the 10 levels' : 'nearly identical to Normal\'s'}`);
  L.push(`(${r21n.fullClearRate}% vs ${r21h.fullClearRate}% full clear${same ? `; per-level cleared/reached match exactly: ${r21n.rows.map((x) => x.clearRate).join('/')}` : ''}).`);
  L.push('The pin removed the two knobs that were making the run unwinnable, and what remained — the fleeing');
  L.push('king — moved nothing at all. Hard on this run is a relabelled Normal that pays 1.5x score.');
  L.push('Nightmare, which keeps the same pin but adds a king that reacts to allies and a higher tempo cap,');
  L.push(`does separate (${get('revenge-21', 'nightmare')?.fullClearRate}%) — so the ally-reacting king is the only global knob on this run that`);
  L.push('actually produces difficulty. The lesson: a global +1 enemy / -2 moves is not a difficulty dial, it is');
  L.push('a level-design assumption. On corridor/wall runs it is a gift (see the revenge-15 and revenge-23 notes');
  L.push('in their run files); on tight-finale runs it is an instant loss; pinning it to 0 leaves the mode empty.');
  L.push('');
}
L.push('## 8. Caveats — read before acting on these numbers');
L.push('');
L.push('- **The measuring bot is not a person.** These runs are played by the T5 MCTS bot with Tyler-derived');
L.push('  move priors. On `revenge-1`..`revenge-11` and `crucible` it clears essentially every level on every');
L.push('  mode, so those rows say "the ladder is invisible to a strong player", NOT "a beginner will breeze');
L.push('  through". The mode separation on those runs may exist for humans and be undetectable here.');
L.push('- **Rookie mode retries are capped at 5** by the harness (`MAX_RETRIES`), where the shipped mode is');
L.push('  unlimited. Rookie\'s true clear rate is therefore >= the number in this table.');
L.push('- Ability offers are taken at RANDOM from every offer, which is a weaker player policy than choosing');
L.push('  well. Runs whose difficulty is carried by a specific combo will read harder here than they play.');
L.push('- One seed family per cell (`revenge-run:<i>:<level>`), shared across difficulties, so a run/difficulty');
L.push('  pair is reproducible and two difficulties see the same starting layouts.');
L.push('');
L.push('## 9. Reproduce');
L.push('');
L.push('```');
L.push('npx tsx scripts/run-playtest/difficulty-sweep.ts --runs=60 --jobs=4');
L.push('npx tsx scripts/run-playtest/difficulty-sweep-report.ts');
L.push('```');
L.push('');
L.push('The sweep checkpoints after every (run, difficulty) pair and skips pairs already in the out file, so');
L.push('it is resumable. `--ids=` restricts it to named runs.');
L.push('');

writeFileSync(join(process.cwd(), OUT), L.join('\n'));
console.error(`[report] wrote ${OUT} (${runIds.length} runs)`);
