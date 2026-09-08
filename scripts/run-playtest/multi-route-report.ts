/** Reads data/run-playtest/multi-route-audit-2026-09-07.json and writes
 *  data/run-playtest/MULTI-ROUTE-AUDIT.md. Pure reporting — no simulation. */
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'data/run-playtest/multi-route-audit-2026-09-07.json';
const OUT = 'data/run-playtest/MULTI-ROUTE-AUDIT.md';
const LEVELS = [7, 8, 9, 10];
const SINGLE_BAR = 8;

type Rec = { pct: number; trials: number };
type RunRec = {
  kit: string[]; sig: string[]; probes: string[]; inKit: string[]; outKit: string[];
  cells: Record<string, Record<string, Rec>>; eliminatedAtL7?: string[]; done?: boolean;
};
const store = JSON.parse(readFileSync(SRC, 'utf8')) as { meta: Record<string, unknown>; runs: Record<string, RunRec> };

const row = (r: RunRec, lo: string) => LEVELS.map((lv) => r.cells[lo]?.[String(lv)]);
const rowStr = (r: RunRec, lo: string) => row(r, lo).map((c) => (c ? String(c.pct) : '—')).join('/');
/** Worst finale level. A level never measured was eliminated at L7 (0/16) => 0. */
const minPct = (r: RunRec, lo: string) => Math.min(...row(r, lo).map((c) => (c ? c.pct : 0)));
const maxPct = (r: RunRec, lo: string) => Math.max(...row(r, lo).map((c) => (c ? c.pct : 0)));
const trialsOf = (r: RunRec, lo: string) => Math.min(...row(r, lo).map((c) => (c ? c.trials : 16)));

const lines: string[] = [];
const P = (s = '') => lines.push(s);

const done = Object.entries(store.runs).filter(([, r]) => r.done)
  .sort((a, b) => Number(a[0].split('-')[1]) - Number(b[0].split('-')[1]));

P('# Multi-route audit — do combo runs have more than one answer?');
P();
P(`Generated 2026-09-07. Source of numbers: \`${SRC}\`.`);
P();
P('**The question (Tyler):** every combo run was authored so exactly ONE ability pair beats its');
P('finale and every single card fails. Nobody had ever measured whether OTHER pairs also work.');
P('If they do, the library is richer than it looks and an Endless mode with a random kit is');
P('playable. If they do not, most of the library is a one-answer lock.');
P();
P('## Method');
P();
P('- Harness: `matrixParallel` from `scripts/run-playtest/revenge-core`, tier **T5**, `realistic: false`, jobs 4 — the same deterministic path as `_remeasure-finales.ts`.');
P('- Levels **7-10** (the combo-gated finale) for every loadout.');
P('- Loadouts per run: `none`; each of the 4 kit cards alone; all 6 pairs from inside the kit; 20 pairs from OUTSIDE the kit (each signature card x 5 fixed probe cards, plus all 10 pairs among those probes). The probe cards are chosen from a single fixed priority list, so the same cards recur across runs — that is what makes "which cards generalise" answerable.');
P('- **Screen at 16 trials, confirm at 32.** Pairs are screened on L7; a pair that wins 0/16 on L7 cannot be a finale route (a true 60% pair reads 0/16 with p ~ 1e-7) and is recorded as eliminated rather than run on L8-L10. `none` and the 4 singles are measured on all four levels. Anything reading above 40% (and any nonzero single, since the gate bar is 8%) is re-measured at **32 trials**, and only 32-trial numbers carry a verdict.');
P('- A `—` in a table means that cell was never run because the pair was eliminated at L7. It is not a measured 0.');
P();
P('## Definitions');
P();
P('- **clears** = the pair\'s WORST finale level is >= 60% (it beats all of L7-L10).');
P('- **route** = clears with a worst level in the **60-80%** band (the authored difficulty target).');
P('- **too-easy route** = clears with a worst level **above 80%**.');
P('- **broken gate** = some SINGLE kit card wins above **8%** on any finale level.');
P();

type Summary = {
  id: string; verdict: string; inBand: string[]; tooEasy: string[]; clears: string[];
  gateBreaks: string[]; sigPair: string; sigMin: number;
};
const summaries: Summary[] = [];

for (const [id, r] of done) {
  const sigPair = [...r.sig].sort().join('+');
  const pairs = [...r.inKit, ...r.outKit];
  const clears = pairs.filter((lo) => minPct(r, lo) >= 60);
  const inBand = clears.filter((lo) => minPct(r, lo) <= 80);
  const tooEasy = clears.filter((lo) => minPct(r, lo) > 80);
  const gateBreaks = r.kit.filter((c) => maxPct(r, c) > SINGLE_BAR);
  if (maxPct(r, 'none') > SINGLE_BAR) gateBreaks.push('none(!)');
  let verdict: string;
  if (gateBreaks.length) verdict = 'BROKEN GATE';
  else if (inBand.length >= 2) verdict = 'MULTI-ROUTE';
  else if (clears.length <= 1 && clears[0] === sigPair) verdict = 'ONE-ANSWER';
  else if (clears.length === 0) verdict = 'NO ANSWER (not even the signature pair clears)';
  else verdict = 'ONE-ANSWER*';
  summaries.push({ id, verdict, inBand, tooEasy, clears, gateBreaks, sigPair, sigMin: minPct(r, sigPair) });
}

P('## Summary table');
P();
P('| run | signature pair | sig worst | routes in 60-80 band | too-easy (>80) | pairs that clear | single card >8% | verdict |');
P('|---|---|---|---|---|---|---|---|');
for (const s of summaries) {
  P(`| ${s.id} | \`${s.sigPair}\` | ${s.sigMin}% | ${s.inBand.length} | ${s.tooEasy.length} | ${s.clears.length} | ${s.gateBreaks.length ? '**' + s.gateBreaks.join(', ') + '**' : 'none'} | **${s.verdict}** |`);
}
P();

P('## Verdict lists');
P();
const g = (v: string) => summaries.filter((s) => s.verdict === v).map((s) => s.id);
P(`**MULTI-ROUTE (2+ pairs land in the 60-80 band):** ${g('MULTI-ROUTE').join(', ') || '(none)'}`);
P();
P(`**ONE-ANSWER (only the signature pair clears):** ${[...g('ONE-ANSWER'), ...g('ONE-ANSWER*')].join(', ') || '(none)'}`);
P();
P(`**BROKEN GATE (a single card beats the finale):** ${g('BROKEN GATE').join(', ') || '(none)'}`);
P();
const noAns = summaries.filter((s) => s.verdict.startsWith('NO ANSWER')).map((s) => s.id);
if (noAns.length) { P(`**NO ANSWER (the authored pair itself does not clear):** ${noAns.join(', ')}`); P(); }

// generalising cards
P('## Which cards generalise');
P();
P('How often each card appears in a pair that CLEARS a finale it was not designed for.');
P('`out-of-kit clears` is the strong signal: the run was never built with that card in mind.');
P();
const tally: Record<string, { outClears: number; inClears: number; runs: string[] }> = {};
for (const [id, r] of done) {
  const seen = new Set<string>();
  for (const lo of [...r.outKit, ...r.inKit]) {
    if (minPct(r, lo) < 60) continue;
    const isOut = r.outKit.includes(lo);
    for (const card of lo.split('+')) {
      tally[card] = tally[card] ?? { outClears: 0, inClears: 0, runs: [] };
      if (isOut) tally[card].outClears++; else tally[card].inClears++;
      const key = `${id}${isOut ? '' : '(kit)'}`;
      if (!seen.has(card + key)) { tally[card].runs.push(key); seen.add(card + key); }
    }
  }
}
const ranked = Object.entries(tally).sort((a, b) => b[1].outClears - a[1].outClears || b[1].inClears - a[1].inClears);
P('| card | clearing pairs OUTSIDE its kit | clearing pairs inside a kit | runs |');
P('|---|---|---|---|');
for (const [card, t] of ranked) P(`| \`${card}\` | ${t.outClears} | ${t.inClears} | ${[...new Set(t.runs)].join(', ')} |`);
if (!ranked.length) P('| (no non-signature pair cleared any finale) | | | |');
P();

P('## Per-run detail');
P();
for (const [id, r] of done) {
  const s = summaries.find((x) => x.id === id)!;
  P(`### ${id} — ${s.verdict}`);
  P();
  P(`kit: ${r.kit.map((c) => '`' + c + '`').join(' ')} · signature: \`${s.sigPair}\` · probes: ${r.probes.map((c) => '`' + c + '`').join(' ')}`);
  P();
  P('| loadout | group | L7 | L8 | L9 | L10 | worst | trials |');
  P('|---|---|---|---|---|---|---|---|');
  const order: Array<[string, string]> = [
    ['none', 'baseline'], ...r.kit.map((c) => [c, 'single'] as [string, string]),
    ...r.inKit.map((c) => [c, 'in-kit pair'] as [string, string]),
    ...r.outKit.map((c) => [c, 'out-of-kit pair'] as [string, string]),
  ];
  const rows = order.map(([lo, grp]) => ({ lo, grp, min: minPct(r, lo) }));
  // keep group order but push fully-eliminated out-of-kit pairs to the end
  for (const { lo, grp } of rows) {
    const cells = row(r, lo);
    P(`| \`${lo}\` | ${grp} | ${cells.map((c) => (c ? c.pct : '—')).join(' | ')} | ${cells.every((c) => c) ? minPct(r, lo) + '%' : 'elim'} | ${trialsOf(r, lo)} |`);
  }
  P();
}

const missing = Object.entries(store.runs).filter(([, r]) => !r.done).map(([id]) => id);
P('## Coverage');
P();
P(`Runs completed: ${done.length} — ${done.map(([id]) => id).join(', ')}`);
if (missing.length) P(`\nIn flight / incomplete: ${missing.join(', ')}`);
P();

writeFileSync(OUT, lines.join('\n'));
console.log(`wrote ${OUT} (${done.length} runs)`);
