/**
 * RESULTS LEDGER — one envelope, one directory, one index.
 *
 * Before 2026-09-09 every experiment invented a file shape (`dials/`,
 * `sickness/`, `retries/`, a bare array in `ladder-audit-*.json`) and dropped
 * it in the data/run-playtest root with the date in the filename. Three ladder
 * files measured the same rungs under three rule-sets and nothing told them
 * apart. Now:
 *
 *   data/run-playtest/results/<YYYY-MM-DD>/<experiment>.json   the envelope
 *   data/run-playtest/results/INDEX.md                         one row per file
 *
 * Every envelope names the engine that produced it (fingerprint.ts) and the
 * budget it was measured at, so a reader can tell a stale or thin number
 * without opening the file.
 */

import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { engineFingerprint, fmtFingerprint, type EngineFingerprint } from './fingerprint';

export const RESULTS_ROOT = join(process.cwd(), 'data', 'run-playtest', 'results');

export interface Budget {
  trials?: number;
  runs?: number;
  jobs?: number;
  /** How seeds were derived, so a re-run can reproduce. */
  seed?: string;
}

export interface ResultEnvelope<T = unknown> {
  schema: 1;
  experiment: string;
  date: string;
  /** ISO timestamp of the write. */
  at: string;
  engine: EngineFingerprint;
  budget: Budget;
  /** One line a reader can act on. Goes into INDEX.md. */
  conclusion: string;
  body: T;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface WriteOpts {
  experiment: string;
  budget: Budget;
  conclusion: string;
  date?: string;
  /** Path of the doc that explains it, relative to the repo, if any. */
  doc?: string;
}

/** Write an envelope and add its INDEX.md row. Returns the file path (repo-relative). */
export function writeResult<T>(opts: WriteOpts, body: T): string {
  const date = opts.date ?? todayISO();
  const dir = join(RESULTS_ROOT, date);
  mkdirSync(dir, { recursive: true });
  const engine = engineFingerprint();
  const env: ResultEnvelope<T> = {
    schema: 1,
    experiment: opts.experiment,
    date,
    at: new Date().toISOString(),
    engine,
    budget: opts.budget,
    conclusion: opts.conclusion,
    body,
  };
  const file = join(dir, `${opts.experiment}.json`);
  writeFileSync(file, JSON.stringify(env, null, 1) + '\n');
  const rel = file.slice(process.cwd().length + 1);
  appendIndex({ date, experiment: opts.experiment, engine: fmtFingerprint(engine), budget: opts.budget, conclusion: opts.conclusion, file: rel, doc: opts.doc });
  return rel;
}

interface IndexRow {
  date: string;
  experiment: string;
  engine: string;
  budget: Budget;
  conclusion: string;
  file: string;
  doc?: string;
}

const INDEX_HEADER = `# Playtest results ledger

One row per result file under \`results/<date>/\`. Newest last. Written by
\`scripts/run-playtest/results.ts\` — never by hand. \`engine\` is
\`<git sha>[+dirty]/<hash of lib/run + registry>\`; two rows with different
hashes were measured on different games and must not be compared as a trend.

| date | experiment | engine | budget | conclusion | file | doc |
|---|---|---|---|---|---|---|
`;

function fmtBudget(b: Budget): string {
  const parts: string[] = [];
  if (b.trials !== undefined) parts.push(`${b.trials} trials`);
  if (b.runs !== undefined) parts.push(`${b.runs} runs`);
  if (b.jobs !== undefined) parts.push(`jobs ${b.jobs}`);
  return parts.join(', ') || '-';
}

function appendIndex(r: IndexRow): void {
  mkdirSync(RESULTS_ROOT, { recursive: true });
  const idx = join(RESULTS_ROOT, 'INDEX.md');
  if (!existsSync(idx)) writeFileSync(idx, INDEX_HEADER);
  const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  appendFileSync(idx, `| ${r.date} | ${cell(r.experiment)} | \`${r.engine}\` | ${cell(fmtBudget(r.budget))} | ${cell(r.conclusion)} | [json](${r.file.replace('data/run-playtest/results/', '')}) | ${r.doc ? `[doc](../../../${r.doc})` : '-'} |\n`);
}

/** Most recent envelope for an experiment name, or null. */
export function latestResult<T = unknown>(experiment: string): ResultEnvelope<T> | null {
  if (!existsSync(RESULTS_ROOT)) return null;
  const dates = readdirSync(RESULTS_ROOT).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().reverse();
  for (const d of dates) {
    const f = join(RESULTS_ROOT, d, `${experiment}.json`);
    if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8')) as ResultEnvelope<T>;
  }
  return null;
}
