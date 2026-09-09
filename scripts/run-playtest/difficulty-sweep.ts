/**
 * Difficulty sweep — every player-facing run x every difficulty, full runs.
 *
 *   npx tsx scripts/run-playtest/difficulty-sweep.ts [--runs=60] [--jobs=4]
 *     [--ids=revenge-1,revenge-2] [--out=data/run-playtest/results/<date>/difficulty-sweep-<date>.json]
 *
 * MEASUREMENT ONLY. Spawns `revenge.ts runs --json` workers (the shipped
 * harness) — one process per (run, difficulty) pair — and reproduces the
 * shipped mode exactly:
 *   - the difficulty knobs (enemies/turn, move limit, king behaviour, tempo)
 *     are applied inside puzzleToBoardState via applyDifficulty, which also
 *     honours the RunDef.difficultyOverrides pins;
 *   - the mode's OWN retry rule is passed through --retries
 *     (rookie Infinity -> harness cap MAX_RETRIES=5, normal 1, hard 1,
 *      nightmare 0).
 * Checkpoints the JSON after EVERY pair, and resumes by skipping pairs
 * already present in the out file.
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { DIFFICULTIES, DIFFICULTY_ORDER, type DifficultyId } from '../../lib/run/difficulty';
import { MAX_RETRIES } from './revenge-core';
import { ALL_RUN_DEFS } from '../../lib/run/runs';
import { stageOf } from '../../lib/content/pipeline';

function arg(name: string, def?: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  if (process.argv.includes(`--${name}`)) return 'true';
  return def;
}

const N = parseInt(arg('runs', '60')!, 10);
const JOBS = parseInt(arg('jobs', '4')!, 10);
const TIER = arg('tier', 'T5')!;
const OUT = arg('out', 'data/run-playtest/results/2026-09-07/difficulty-sweep-2026-09-07.json')!;

/** Registry order, approved|live only, unless --ids overrides. */
function targetRuns(): string[] {
  const ids = arg('ids');
  if (ids) return ids.split(',').map((s) => s.trim()).filter(Boolean);
  return ALL_RUN_DEFS.filter((r) => {
    const s = stageOf(r.id);
    return s === 'approved' || s === 'live';
  }).map((r) => r.id);
}

/** The retry count the mode actually ships with (Infinity capped by the harness). */
function retriesFor(d: DifficultyId): number {
  const r = DIFFICULTIES[d].retriesPerLevel;
  return Number.isFinite(r) ? r : MAX_RETRIES;
}

interface Row { level: number; reached: number; cleared: number; clearRate: number | null; losses: Record<string, number> }
interface PairResult {
  runId: string;
  difficulty: DifficultyId;
  runs: number;
  tier: string;
  retriesPerLevel: number;
  retriesUsed: number;
  fullClears: number;
  fullClearRate: number;
  rows: Row[];
  deathsAt: Record<string, number>;
  seconds: number;
}

interface Sweep {
  generated: string;
  n: number;
  tier: string;
  note: string;
  results: PairResult[];
}

const outPath = join(process.cwd(), OUT);
mkdirSync(dirname(outPath), { recursive: true });

function load(): Sweep {
  if (existsSync(outPath)) {
    try { return JSON.parse(readFileSync(outPath, 'utf8')) as Sweep; } catch { /* fall through */ }
  }
  return {
    generated: new Date().toISOString(),
    n: N,
    tier: TIER,
    note: 'Full runs L1->L10 with the shipped difficulty knobs and the mode\'s own retry rule. Bot tier T5. rookie retries = harness cap 5 (mode is Infinity).',
    results: [],
  };
}

const sweep = load();
const done = new Set(sweep.results.map((r) => `${r.runId}|${r.difficulty}`));

function save(): void {
  sweep.results.sort((a, b) => a.runId.localeCompare(b.runId) || DIFFICULTY_ORDER.indexOf(a.difficulty) - DIFFICULTY_ORDER.indexOf(b.difficulty));
  writeFileSync(outPath, JSON.stringify(sweep, null, 1));
}

function measure(runId: string, d: DifficultyId): Promise<PairResult> {
  const retries = retriesFor(d);
  const args = [
    'tsx', 'scripts/run-playtest/revenge.ts', 'runs',
    `--run=${runId}`, `--runs=${N}`, `--tier=${TIER}`,
    `--difficulty=${d}`, `--retries=${retries}`, '--json',
  ];
  return new Promise((resolve, reject) => {
    const p = spawn('npx', args, { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'inherit'] });
    let buf = '';
    p.stdout.on('data', (c) => { buf += String(c); });
    p.on('error', reject);
    p.on('close', (code) => {
      if (code !== 0) return reject(new Error(`${runId}/${d} exited ${code}`));
      try {
        const rep = JSON.parse(buf);
        resolve({
          runId, difficulty: d, runs: rep.runs, tier: rep.tier,
          retriesPerLevel: rep.retriesPerLevel, retriesUsed: rep.retriesUsed ?? 0,
          fullClears: rep.fullClears,
          fullClearRate: Math.round((rep.fullClears / rep.runs) * 100),
          rows: rep.rows, deathsAt: rep.deathsAt ?? {}, seconds: rep.seconds,
        });
      } catch (e) { reject(new Error(`${runId}/${d}: bad JSON — ${(e as Error).message}`)); }
    });
  });
}

async function main(): Promise<void> {
  const runIds = targetRuns();
  const pairs: Array<{ runId: string; d: DifficultyId }> = [];
  for (const runId of runIds) {
    for (const d of DIFFICULTY_ORDER) {
      if (!done.has(`${runId}|${d}`)) pairs.push({ runId, d });
    }
  }
  console.error(`[sweep] ${runIds.length} runs x ${DIFFICULTY_ORDER.length} difficulties = ${runIds.length * 4} pairs; ${done.size} already done, ${pairs.length} to measure; n=${N}, jobs=${JOBS}`);
  let i = 0;
  let finished = 0;
  const t0 = Date.now();
  async function worker(): Promise<void> {
    for (;;) {
      const idx = i++;
      if (idx >= pairs.length) return;
      const { runId, d } = pairs[idx];
      try {
        // One retry: other agents edit lib/run/runs.ts while this runs, and a
        // worker that starts mid-edit dies with a ReferenceError. Transient.
        let res: PairResult;
        try { res = await measure(runId, d); }
        catch { await new Promise((r) => setTimeout(r, 5000)); res = await measure(runId, d); }
        sweep.results.push(res);
        save();
        finished++;
        console.error(`[sweep] ${runId} ${d}: ${res.fullClearRate}% full clear (${res.fullClears}/${res.runs}) in ${res.seconds}s  [${finished}/${pairs.length}, ${Math.round((Date.now() - t0) / 60000)}m]`);
      } catch (e) {
        console.error(`[sweep] FAILED ${runId} ${d}: ${(e as Error).message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: JOBS }, () => worker()));
  save();
  console.error(`[sweep] done -> ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
