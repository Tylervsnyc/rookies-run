#!/usr/bin/env -S npx tsx
/**
 * Rookie's Revenge — nightly playtest orchestrator.
 *
 *   npx tsx scripts/run-playtest/revenge-nightly.ts            # full (~25–30 min on an M-series Mac)
 *   npx tsx scripts/run-playtest/revenge-nightly.ts --quick    # smoke (< 2 min)
 *
 * For EVERY run in REVENGE_RUN_IDS ∪ REVENGE_CANDIDATE_RUN_IDS:
 *   a. matrix at realistic tiers (win % per level × loadout, loss modes, stalls)
 *   b. full-run simulation, random picks (reach/clear per level) — authored + each mode
 *   c. matrix on each difficulty mode (rookie/normal/hard/nightmare), fewer trials
 *   d. solver on the late levels, bounded budget
 *   e. per-level feature vectors (piece counts, keys, pen, budget…)
 *   p. PLAYER sims — THE difficulty number: a new player with only the 3
 *      starters unlocked (offers forced, mode retries) and a veteran with the
 *      full pool, on Rookie and Normal
 * Then across runs:
 *   f. correlations + ridge regression of features vs no-ability % and finisher floor
 *   g. deltas vs the previous night (>15-pt movers, new stalls, band exits)
 *   h. human traces from Supabase (creds from env; reuses pull-traces.ts) vs bot
 *   i. 3 hypotheses per run, each RUN as an experiment tonight, ledgered in experiments.jsonl
 *
 * Outputs:
 *   data/run-playtest/revenge/raw/YYYY-MM-DD/*.json
 *   data/run-playtest/revenge/raw/YYYY-MM-DD/slack.txt       (≤25 lines for the cron wrapper)
 *   data/run-playtest/revenge/digests/YYYY-MM-DD.md + latest.md
 *   data/run-playtest/revenge/experiments.jsonl               (append-only)
 *
 * Budget: the LIVE run(s) get the full trial counts; candidate runs get a
 * lighter pass (--cand-trials etc.) so three candidates fit the night.
 * Quick mode tests the first live run + the first candidate only (add
 * --all-runs to sweep everything).
 *
 * Re-render a night's digest from its raw JSON (the digest is ALWAYS
 * assembled from raw, so this is the same code path the full night uses;
 * missing player sims are run on the spot):
 *   npx tsx scripts/run-playtest/revenge-nightly.ts --render-only --from=YYYY-MM-DD
 * Re-simulate ONE run into an existing night's raw dir (then --render-only):
 *   npx tsx scripts/run-playtest/revenge-nightly.ts --sims-only --runs-filter=revenge-2
 *
 * Flags: --trials=N --mode-trials=N --runs=N --player-runs=N --solve-depth=N --solve-nodes=N
 *        --cand-trials=N --cand-mode-trials=N --cand-runs=N --cand-player-runs=N
 *        --exp-trials=N --jobs=N --skip-solver --skip-humans --skip-experiments
 *        --runs-filter=id1,id2  (only these run ids)  --all-runs (quick: every run)
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

import type { DifficultyId } from '../../lib/run/difficulty';
import { DIFFICULTIES } from '../../lib/run/difficulty';
import { applyDifficulty } from '../../lib/run/apply-difficulty';
import { STARTER_ABILITIES } from '../../lib/run/profile';
import { REVENGE_CANDIDATE_RUN_IDS, REVENGE_RUN_IDS, getRunById, isKnownRunId } from '../../lib/run/runs';
import {
  ALL_LOADOUTS,
  FINISHERS,
  levelCountFor,
  matrixParallel,
  puzzleFor,
  runsInWorker,
  solveParallel,
  type Cell,
  type RevengeCfg,
  type RunsReport,
  type SolveResult,
} from './revenge-core';
import { featuresForRun, type RevengeFeatures } from './revenge-features';
import {
  buildHypotheses,
  compareNights,
  correlate,
  ridge,
  runExperiment,
  summarizeLevels,
  thresholdFindings,
  verdictFor,
  type ExperimentResult,
  type Hypothesis,
  type MatrixSet,
  type PlayerSims,
  type Sample,
} from './revenge-analysis';
import { MODES, renderDigest, renderSlack, type DigestInput, type HumanSummary, type ModeBlock, type RunReport } from './revenge-digest';

// ─────────────────────────────────────────────────────────────────────────────
// Args

/** Per-run budget — live runs and candidates get different ones. */
export interface RunBudget {
  trials: number;
  modeTrials: number;
  runs: number;
  /** Full runs per (player × mode) for the new-player / veteran sims. */
  playerRuns: number;
  /** Loadouts swept in the realistic matrix. */
  matrixLoadouts: string[];
  /** Loadouts swept per difficulty mode (none + finishers is enough for the mode table). */
  modeLoadouts: string[];
  solveLoadouts: string[];
}

interface Opts {
  quick: boolean;
  allRuns: boolean;
  live: RunBudget;
  cand: RunBudget;
  solveDepth: number;
  solveNodes: number;
  solveLevelsFrom: number;
  expTrials: number;
  jobs?: number;
  skipSolver: boolean;
  skipHumans: boolean;
  skipExperiments: boolean;
  runsFilter: string[] | null;
  renderOnly: boolean;
  simsOnly: boolean;
  from: string | null;
}

function num(name: string, def: number): number {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? parseInt(hit.split('=')[1], 10) : def;
}

function parseArgs(): Opts {
  const quick = process.argv.includes('--quick');
  const core = ['none', ...FINISHERS];
  // Measured 2026-08-30 on a 10-core M-series with 8 workers: live run ≈ 14 min
  // (matrix 5.5, modes 1.5, full runs 3, solver 3.5), each candidate ≈ 5 min.
  const live: RunBudget = {
    trials: num('trials', quick ? 4 : 40),
    modeTrials: num('mode-trials', quick ? 3 : 15),
    runs: num('runs', quick ? 4 : 80),
    playerRuns: num('player-runs', quick ? 3 : 40),
    matrixLoadouts: quick ? core : [...ALL_LOADOUTS],
    modeLoadouts: core,
    solveLoadouts: quick ? core : [...ALL_LOADOUTS],
  };
  const cand: RunBudget = {
    trials: num('cand-trials', quick ? 3 : 24),
    modeTrials: num('cand-mode-trials', quick ? 2 : 8),
    runs: num('cand-runs', quick ? 3 : 40),
    playerRuns: num('cand-player-runs', quick ? 2 : 20),
    matrixLoadouts: quick ? core : [...ALL_LOADOUTS],
    modeLoadouts: core,
    solveLoadouts: core,
  };
  const o: Opts = {
    quick,
    allRuns: process.argv.includes('--all-runs'),
    live,
    cand,
    solveDepth: num('solve-depth', quick ? 4 : 6),
    solveNodes: num('solve-nodes', quick ? 20_000 : 120_000),
    solveLevelsFrom: quick ? 9 : 6,
    expTrials: num('exp-trials', quick ? 5 : 40),
    jobs: process.argv.some((a) => a.startsWith('--jobs=')) ? num('jobs', 8) : undefined,
    skipSolver: process.argv.includes('--skip-solver'),
    skipHumans: process.argv.includes('--skip-humans'),
    skipExperiments: process.argv.includes('--skip-experiments'),
    runsFilter: null,
    renderOnly: process.argv.includes('--render-only'),
    simsOnly: process.argv.includes('--sims-only'),
    from: process.argv.find((a) => a.startsWith('--from='))?.split('=')[1] ?? null,
  };
  const rf = process.argv.find((a) => a.startsWith('--runs-filter='));
  if (rf) o.runsFilter = rf.split('=')[1].split(',').map((s) => s.trim()).filter(Boolean);
  return o;
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const REPO = join(__dirname, '..', '..');
const OUT = join(REPO, 'data', 'run-playtest', 'revenge');
const RAW_ROOT = join(OUT, 'raw');
const DIGESTS = join(OUT, 'digests');
const LEDGER = join(OUT, 'experiments.jsonl');

function writeJson(dir: string, name: string, data: unknown): void {
  writeFileSync(join(dir, name), JSON.stringify(data, null, 1));
}
function readJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf8')) as T; } catch { return null; }
}

const log = (s: string) => console.log(`[revenge-nightly] ${s}`);
const secs = (t: number) => `${((Date.now() - t) / 1000).toFixed(0)}s`;

function isCandidate(runId: string): boolean {
  return !REVENGE_RUN_IDS.includes(runId) && REVENGE_CANDIDATE_RUN_IDS.includes(runId);
}

// ─────────────────────────────────────────────────────────────────────────────
// p. Player sims — new player (3 starters) + veteran (full pool), Rookie + Normal,
//    offers forced (random pick), retries per the mode.

const STARTERS = [...STARTER_ABILITIES] as string[];

async function runPlayerSims(runId: string, n: number, rawDir: string): Promise<PlayerSims> {
  const t = Date.now();
  log(`${runId}: player sims (${n} runs × new player/veteran × rookie/normal; starters = ${STARTERS.join(', ')})`);
  const rr = DIFFICULTIES.rookie.retriesPerLevel;
  const rn = DIFFICULTIES.normal.retriesPerLevel;
  const retries = (x: number) => (Number.isFinite(x) ? x : 99);
  const [starterRookie, starterNormal, veteranRookie, veteranNormal] = await Promise.all([
    runsInWorker({ runId, difficulty: 'rookie' }, n, 'T5', { unlockedAbilities: STARTERS, retriesPerLevel: retries(rr), seedPrefix: 'player-starter' }),
    runsInWorker({ runId, difficulty: 'normal' }, n, 'T5', { unlockedAbilities: STARTERS, retriesPerLevel: retries(rn), seedPrefix: 'player-starter' }),
    runsInWorker({ runId, difficulty: 'rookie' }, n, 'T5', { retriesPerLevel: retries(rr), seedPrefix: 'player-veteran' }),
    runsInWorker({ runId, difficulty: 'normal' }, n, 'T5', { retriesPerLevel: retries(rn), seedPrefix: 'player-veteran' }),
  ]);
  const players: PlayerSims = { starterRookie, starterNormal, veteranRookie, veteranNormal };
  writeJson(rawDir, `players-${runId}.json`, { runId, runs: n, starters: STARTERS, ...players });
  log(`${runId}: player sims done in ${secs(t)} — new player ${starterNormal.fullClears}/${n} Normal, ${starterRookie.fullClears}/${n} Rookie; veteran ${veteranNormal.fullClears}/${n} Normal`);
  return players;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-run sims (a–e, p) → raw JSON only. Reports are always rebuilt from raw.

async function simulateRunToRaw(runId: string, candidate: boolean, opts: Opts, rawDir: string, caveats: string[]): Promise<void> {
  const cfg: RevengeCfg = { runId };
  const b = candidate ? opts.cand : opts.live;
  const levelCount = levelCountFor(runId);
  const levels = Array.from({ length: levelCount }, (_, i) => i + 1);
  const loadouts = [...b.matrixLoadouts];

  // a. realistic-tier matrix
  let t = Date.now();
  log(`${runId}: realistic matrix (${levels.length} levels × ${loadouts.length} loadouts × ${b.trials})`);
  const realisticCells = await matrixParallel(cfg, { levels, loadouts, trials: b.trials, tier: 'T5', realistic: true, jobs: opts.jobs });
  writeJson(rawDir, `matrix-${runId}-realistic.json`, { runId, mode: 'realistic', trials: b.trials, candidate, cells: realisticCells });
  log(`${runId}: realistic matrix done in ${secs(t)}`);

  // c. difficulty modes (T1 loadouts, like the app's mode table)
  for (const m of MODES) {
    t = Date.now();
    log(`${runId}: ${m} matrix (${b.modeLoadouts.length} loadouts × ${b.modeTrials})`);
    const cells = await matrixParallel({ runId, difficulty: m }, { levels, loadouts: b.modeLoadouts, trials: b.modeTrials, tier: 'T5', realistic: false, jobs: opts.jobs });
    writeJson(rawDir, `matrix-${runId}-${m}.json`, { runId, mode: m, trials: b.modeTrials, cells });
    log(`${runId}: ${m} matrix done in ${secs(t)}`);
  }

  // b. full runs, random picks, full pool, no retries — authored + each mode
  t = Date.now();
  log(`${runId}: full runs (${b.runs} × 5 modes)`);
  const fullRuns: Partial<Record<'authored' | DifficultyId, RunsReport>> = {};
  await Promise.all([
    runsInWorker(cfg, b.runs, 'T5').then((r) => { fullRuns.authored = r; }),
    ...MODES.map((m) => runsInWorker({ runId, difficulty: m }, b.runs, 'T5').then((r) => { fullRuns[m] = r; })),
  ]);
  writeJson(rawDir, `runs-${runId}.json`, fullRuns);
  log(`${runId}: full runs done in ${secs(t)} — authored ${fullRuns.authored?.fullClears}/${b.runs} clears`);

  // p. player sims
  await runPlayerSims(runId, b.playerRuns, rawDir);

  // d. solver on late levels
  if (!opts.skipSolver) {
    t = Date.now();
    const lateLevels = levels.filter((l) => l >= opts.solveLevelsFrom);
    log(`${runId}: solver L${opts.solveLevelsFrom}+ (depth ${opts.solveDepth}, ${opts.solveNodes} nodes, ${b.solveLoadouts.length} loadouts)`);
    try {
      const solver = await solveParallel(cfg, { levels: lateLevels, loadouts: b.solveLoadouts, depth: opts.solveDepth, nodes: opts.solveNodes, jobs: opts.jobs });
      writeJson(rawDir, `solver-${runId}.json`, solver);
      log(`${runId}: solver done in ${secs(t)}`);
    } catch (e) {
      caveats.push(`Solver failed on ${runId}: ${(e as Error).message}`);
    }
  } else caveats.push('Solver skipped (--skip-solver).');

  // e. features (authored + each mode)
  const features = featuresForRun(cfg, levels);
  const modeFeatures: Partial<Record<DifficultyId, RevengeFeatures[]>> = {};
  for (const m of MODES) modeFeatures[m] = featuresForRun({ runId, difficulty: m }, levels);
  writeJson(rawDir, `features-${runId}.json`, { authored: features, ...modeFeatures });
}

// ─────────────────────────────────────────────────────────────────────────────
// Rebuild a RunReport from raw JSON (runs the player sims if they are missing).

type RawReport = RunReport & { modeFeatures?: Partial<Record<DifficultyId, RevengeFeatures[]>> };

async function reportFromRaw(runId: string, rawDir: string, opts: Opts, caveats: string[]): Promise<RawReport | null> {
  const cfg: RevengeCfg = { runId };
  const levelCount = levelCountFor(runId);
  const levels = Array.from({ length: levelCount }, (_, i) => i + 1);
  const moveLimits: Record<number, number | null> = {};
  for (const lv of levels) moveLimits[lv] = puzzleFor(cfg, lv).moveLimit ?? null;
  const real = readJson<{ cells: Cell[]; trials: number; candidate?: boolean }>(join(rawDir, `matrix-${runId}-realistic.json`));
  if (!real) return null;
  const candidate = real.candidate ?? isCandidate(runId);
  const b = candidate ? opts.cand : opts.live;
  const realistic: ModeBlock = { cells: real.cells, summary: summarizeLevels(real.cells, moveLimits) };
  const modes: Partial<Record<DifficultyId, ModeBlock>> = {};
  for (const m of MODES) {
    const mj = readJson<{ cells: Cell[] }>(join(rawDir, `matrix-${runId}-${m}.json`));
    if (!mj) continue;
    const ml: Record<number, number | null> = {};
    for (const lv of levels) ml[lv] = applyDifficulty(puzzleFor(cfg, lv), m).moveLimit ?? null;
    modes[m] = { cells: mj.cells, summary: summarizeLevels(mj.cells, ml) };
  }
  const fullRuns = readJson<RunReport['fullRuns']>(join(rawDir, `runs-${runId}.json`)) ?? {};
  const solver = readJson<SolveResult[]>(join(rawDir, `solver-${runId}.json`)) ?? [];
  const fj = readJson<{ authored: RevengeFeatures[] } & Partial<Record<DifficultyId, RevengeFeatures[]>>>(join(rawDir, `features-${runId}.json`));
  const features = fj?.authored ?? featuresForRun(cfg, levels);
  const modeFeatures: Partial<Record<DifficultyId, RevengeFeatures[]>> = {};
  for (const m of MODES) modeFeatures[m] = fj?.[m] ?? featuresForRun({ runId, difficulty: m }, levels);
  let pj = readJson<PlayerSims & { runs?: number }>(join(rawDir, `players-${runId}.json`));
  if (!pj) {
    caveats.push(`Player sims were missing for ${runId} — ran them during assembly (${b.playerRuns} runs per mode).`);
    pj = { ...(await runPlayerSims(runId, b.playerRuns, rawDir)), runs: b.playerRuns };
  }
  const players: PlayerSims = { starterRookie: pj.starterRookie, starterNormal: pj.starterNormal, veteranRookie: pj.veteranRookie, veteranNormal: pj.veteranNormal };
  return {
    runId,
    name: getRunById(runId).name,
    candidate,
    levelCount,
    realistic,
    modes,
    fullRuns,
    solver,
    features,
    players,
    verdict: verdictFor(realistic.summary, players, real.cells, solver),
    budget: { trials: real.trials ?? b.trials, modeTrials: b.modeTrials, runs: fullRuns.authored?.runs ?? b.runs, playerRuns: pj.runs ?? players.starterNormal?.runs ?? b.playerRuns },
    modeFeatures,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Cross-run analysis helpers

function buildSamples(reports: RawReport[]): Sample[] {
  const out: Sample[] = [];
  for (const r of reports) {
    for (const s of r.realistic.summary) {
      const f = r.features.find((x) => x.level === s.level);
      if (f) out.push({ features: f, nonePct: s.nonePct, finisherFloor: s.finisherFloor });
    }
    for (const m of MODES) {
      const blk = r.modes[m];
      const feats = r.modeFeatures?.[m];
      if (!blk || !feats) continue;
      for (const s of blk.summary) {
        const f = feats.find((x) => x.level === s.level);
        if (f) out.push({ features: f, nonePct: s.nonePct, finisherFloor: s.finisherFloor });
      }
    }
  }
  return out;
}

function matrixSets(reports: RunReport[]): MatrixSet[] {
  const sets: MatrixSet[] = [];
  for (const r of reports) {
    sets.push({ runId: r.runId, mode: 'realistic', cells: r.realistic.cells });
    for (const m of MODES) if (r.modes[m]) sets.push({ runId: r.runId, mode: m, cells: r.modes[m]!.cells });
  }
  return sets;
}

/** Most recent night before `date` that wrote a summary.json. */
function loadPreviousNight(date: string): { date: string; sets: MatrixSet[] } | null {
  if (!existsSync(RAW_ROOT)) return null;
  const dates = readdirSync(RAW_ROOT).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d < date).sort().reverse();
  for (const d of dates) {
    const j = readJson<{ matrixSets?: MatrixSet[] }>(join(RAW_ROOT, d, 'summary.json'));
    if (j?.matrixSets) return { date: d, sets: j.matrixSets };
  }
  return null;
}

function readLedger(): ExperimentResult[] {
  if (!existsSync(LEDGER)) return [];
  return readFileSync(LEDGER, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => { try { return JSON.parse(l) as ExperimentResult; } catch { return null; } })
    .filter((x): x is ExperimentResult => x !== null);
}

/** Run ids that have a realistic matrix in this raw dir, live first. */
function runsInRaw(rawDir: string): string[] {
  if (!existsSync(rawDir)) return [];
  const ids = readdirSync(rawDir)
    .map((f) => /^matrix-(.+)-realistic\.json$/.exec(f)?.[1])
    .filter((x): x is string => !!x && isKnownRunId(x));
  return ids.sort((a, b) => Number(isCandidate(a)) - Number(isCandidate(b)) || a.localeCompare(b));
}

// ─────────────────────────────────────────────────────────────────────────────
// Humans — reuse pull-traces.ts, then read the trace files it writes.

function pullHumanTraces(runIds: string[], opts: Opts, caveats: string[]): HumanSummary | null {
  const dir = join(REPO, 'data', 'run-playtest', 'human-traces');
  const since = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10);
  const haveCreds = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  let source: HumanSummary['source'] = 'disk-only';
  if (opts.skipHumans) {
    caveats.push('Human traces skipped (--skip-humans).');
  } else if (haveCreds) {
    const r = spawnSync('npx', ['tsx', join(__dirname, 'pull-traces.ts'), since], { cwd: REPO, encoding: 'utf8', timeout: 120_000 });
    if (r.status === 0) {
      source = 'supabase+disk';
      log(`humans: ${r.stdout.trim()}`);
    } else {
      caveats.push(`pull-traces.ts failed (${(r.stderr || '').trim().slice(0, 200)}) — using traces already on disk.`);
    }
  } else {
    caveats.push('No Supabase credentials in env — human traces read from disk only.');
  }
  if (!existsSync(dir)) return haveCreds ? { since, source, byRun: runIds.map((id) => ({ runId: id, traces: 0, wins: 0, byLevel: [] })) } : null;

  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  const byRun: HumanSummary['byRun'] = [];
  for (const runId of runIds) {
    const total = levelCountFor(runId);
    const reached = new Array<number>(total + 1).fill(0);
    const cleared = new Array<number>(total + 1).fill(0);
    let traces = 0;
    let wins = 0;
    for (const f of files) {
      if (!f.startsWith(`${runId}-L`)) continue;
      let meta: { runId?: string; level?: number; outcome?: string; startedAt?: string; iso?: string } | undefined;
      try {
        meta = (JSON.parse(readFileSync(join(dir, f), 'utf8')) as { meta?: typeof meta }).meta;
      } catch { continue; }
      if (!meta || meta.runId !== runId) continue;
      const when = (meta.startedAt ?? meta.iso ?? '').slice(0, 10);
      if (when && when < since) continue;
      const endLevel = Math.max(1, Math.min(total, Number(meta.level ?? 1)));
      const won = meta.outcome === 'won';
      traces++;
      if (won) wins++;
      for (let lv = 1; lv <= endLevel; lv++) {
        reached[lv]++;
        if (lv < endLevel || won) cleared[lv]++;
      }
    }
    byRun.push({
      runId,
      traces,
      wins,
      byLevel: Array.from({ length: total }, (_, i) => {
        const lv = i + 1;
        return { level: lv, reached: reached[lv], cleared: cleared[lv], clearRate: reached[lv] ? Math.round((cleared[lv] / reached[lv]) * 100) : null };
      }),
    });
  }
  return { since, source, byRun };
}

// ─────────────────────────────────────────────────────────────────────────────
// Assemble — rebuild every report from raw, run the cross-run analysis,
// write the digest. Used by the full night AND --render-only.

interface AssembleCtx {
  date: string;
  quick: boolean;
  wallSeconds: number;
  caveats: string[];
  /** Run hypotheses/experiments for these run ids (full night); render-only passes []. */
  hypothesisRuns: string[];
}

async function assemble(opts: Opts, ctx: AssembleCtx): Promise<void> {
  const rawDir = join(RAW_ROOT, ctx.date);
  mkdirSync(DIGESTS, { recursive: true });
  const caveats = ctx.caveats;
  const ids = runsInRaw(rawDir);
  if (!ids.length) throw new Error(`no realistic matrices in ${rawDir}`);
  const reports: RawReport[] = [];
  for (const id of ids) {
    const r = await reportFromRaw(id, rawDir, opts, caveats);
    if (r) reports.push(r);
  }

  // f. correlations + regression
  const samples = buildSamples(reports);
  const correlationsNone = correlate(samples, 'nonePct');
  const correlationsFloor = correlate(samples, 'finisherFloor');
  const findingsNone = thresholdFindings(samples, 'nonePct');
  const findingsFloor = thresholdFindings(samples, 'finisherFloor');
  const fitNone = ridge(samples, 'nonePct');
  const fitFloor = ridge(samples, 'finisherFloor');
  writeJson(rawDir, 'correlations.json', { samples: samples.length, none: correlationsNone, floor: correlationsFloor, findingsNone, findingsFloor });
  writeJson(rawDir, 'regression.json', { none: fitNone, floor: fitFloor });
  log(`features: ${samples.length} snapshots, top none-correlate ${correlationsNone[0]?.feature ?? '-'} (${correlationsNone[0]?.pearson.toFixed(2) ?? '-'})`);

  // g. vs previous night
  const prev = loadPreviousNight(ctx.date);
  const sets = matrixSets(reports);
  const diff = compareNights(prev?.sets ?? null, sets, prev?.date ?? null);
  writeJson(rawDir, 'diff.json', diff);
  if (prev) log(`vs ${prev.date}: ${diff.movers.length} movers, ${diff.newStalls.length} new stalls, ${diff.bandExits.length} band exits`);

  // h. humans (full night pulls; render-only reuses humans.json when present)
  let humans = ctx.hypothesisRuns.length ? null : readJson<HumanSummary>(join(rawDir, 'humans.json'));
  if (!humans) {
    humans = pullHumanTraces(reports.map((r) => r.runId), opts, caveats);
    if (humans) writeJson(rawDir, 'humans.json', humans);
  }

  // i. hypotheses + experiments (merged per run into hypotheses.json / experiments.json)
  const prior = readLedger();
  const keepH = (readJson<Hypothesis[]>(join(rawDir, 'hypotheses.json')) ?? []).filter((h) => !ctx.hypothesisRuns.includes(h.runId));
  const keepE = (readJson<ExperimentResult[]>(join(rawDir, 'experiments.json')) ?? []).filter((e) => !ctx.hypothesisRuns.includes(e.runId));
  const hypotheses: Hypothesis[] = [...keepH];
  const experiments: ExperimentResult[] = [...keepE];
  for (const r of reports) {
    if (!ctx.hypothesisRuns.includes(r.runId)) continue;
    const featuresByLevel: Record<number, RevengeFeatures> = {};
    for (const f of r.features) featuresByLevel[f.level] = f;
    const hs = buildHypotheses({
      date: ctx.date,
      runId: r.runId,
      summary: r.realistic.summary,
      cells: r.realistic.cells,
      rookieCells: r.modes.rookie?.cells ?? [],
      featuresByLevel,
      fitNone,
      fitFloor,
      prior,
    }, r.candidate ? 2 : 3);
    hypotheses.push(...hs);
    if (opts.skipExperiments) continue;
    const t = Date.now();
    log(`${r.runId}: experiments (${hs.length} × ${opts.expTrials} trials)`);
    for (const h of hs) {
      try {
        const e = runExperiment(h, ctx.date, opts.expTrials, opts.quick);
        experiments.push(e);
        appendFileSync(LEDGER, JSON.stringify(e) + '\n');
        log(`  ${h.text} → actual ${e.actualPct}% (${e.verdict})`);
      } catch (err) {
        caveats.push(`Experiment ${h.id} failed: ${(err as Error).message}`);
      }
    }
    log(`${r.runId}: experiments done in ${secs(t)}`);
  }
  if (opts.skipExperiments && ctx.hypothesisRuns.length) caveats.push('Experiments skipped (--skip-experiments).');
  writeJson(rawDir, 'hypotheses.json', hypotheses);
  writeJson(rawDir, 'experiments.json', experiments);

  // summary for tomorrow's diff + the digest
  writeJson(rawDir, 'summary.json', {
    date: ctx.date,
    quick: ctx.quick,
    wallSeconds: ctx.wallSeconds,
    budgets: { live: opts.live, cand: opts.cand },
    matrixSets: sets,
    verdicts: reports.map((r) => ({ runId: r.runId, candidate: r.candidate, ...r.verdict })),
  });

  const input: DigestInput = {
    date: ctx.date,
    quick: ctx.quick,
    wallSeconds: ctx.wallSeconds,
    trials: { realistic: opts.live.trials, mode: opts.live.modeTrials, runs: opts.live.runs, solveDepth: opts.solveDepth, solveNodes: opts.solveNodes, experiment: opts.expTrials },
    runs: reports.map(({ modeFeatures: _mf, ...r }) => r),
    diff,
    samples: samples.length,
    correlationsNone,
    correlationsFloor,
    findingsNone,
    findingsFloor,
    fitNone,
    fitFloor,
    humans,
    hypotheses,
    experiments,
    caveats,
  };
  const md = renderDigest(input);
  writeFileSync(join(DIGESTS, `${ctx.date}.md`), md);
  writeFileSync(join(DIGESTS, 'latest.md'), md);
  writeFileSync(join(rawDir, 'slack.txt'), renderSlack(input) + '\n');
  log(`digest written: ${join(DIGESTS, `${ctx.date}.md`)}`);
}

// ─────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const opts = parseArgs();
  const t0 = Date.now();

  if (opts.renderOnly) {
    const date = opts.from ?? today();
    const prevSummary = readJson<{ quick?: boolean; wallSeconds?: number }>(join(RAW_ROOT, date, 'summary.json'));
    await assemble(opts, {
      date,
      quick: !!prevSummary?.quick,
      wallSeconds: prevSummary?.wallSeconds ?? 0,
      caveats: [`Digest re-rendered from raw JSON on ${today()}${prevSummary?.quick ? '; the night itself was a quick smoke (tiny trial counts)' : ''}.`],
      hypothesisRuns: [],
    });
    return;
  }

  const date = opts.from ?? today();
  const rawDir = join(RAW_ROOT, date);
  mkdirSync(rawDir, { recursive: true });
  const caveats: string[] = [];

  const live = [...REVENGE_RUN_IDS];
  const cands = [...REVENGE_CANDIDATE_RUN_IDS].filter((id) => !live.includes(id));
  let ids = [...live.map((id) => ({ id, candidate: false })), ...cands.map((id) => ({ id, candidate: true }))];
  if (opts.runsFilter) ids = ids.filter((x) => opts.runsFilter!.includes(x.id));
  else if (opts.quick && !opts.allRuns) {
    // Smoke = one live run + one candidate (exercises both paths in < 2 min).
    const firstLive = ids.find((x) => !x.candidate);
    const firstCand = ids.find((x) => x.candidate);
    const skipped = ids.filter((x) => x !== firstLive && x !== firstCand);
    ids = [firstLive, firstCand].filter((x): x is { id: string; candidate: boolean } => !!x);
    if (skipped.length) caveats.push(`Quick mode tested ${ids.map((x) => x.id).join(' + ')} only; skipped ${skipped.map((x) => x.id).join(', ')} (add --all-runs).`);
  }
  ids = ids.filter((x) => {
    if (isKnownRunId(x.id)) return true;
    caveats.push(`Run id "${x.id}" is listed but not loadable — skipped.`);
    return false;
  });
  log(`${date}: ${ids.length} run(s) — ${ids.map((x) => x.id + (x.candidate ? ' (candidate)' : '')).join(', ')}${opts.quick ? ' [QUICK]' : ''}${opts.simsOnly ? ' [SIMS ONLY]' : ''}`);

  // a–e, p per run → raw
  const done: string[] = [];
  for (const { id, candidate } of ids) {
    try {
      await simulateRunToRaw(id, candidate, opts, rawDir, caveats);
      done.push(id);
    } catch (e) {
      caveats.push(`Run ${id} failed: ${(e as Error).message}`);
      console.error(e);
    }
  }
  if (done.length === 0) throw new Error('no run produced raw output');
  if (opts.simsOnly) {
    log(`sims-only: raw written for ${done.join(', ')} in ${((Date.now() - t0) / 60000).toFixed(1)} min — run --render-only --from=${date} to rebuild the digest`);
    return;
  }
  if (opts.quick) caveats.push('Quick mode: trial counts are tiny and only no-ability + the five finishers were swept, so every percentage is coarse and movers vs last night are mostly noise.');

  await assemble(opts, { date, quick: opts.quick, wallSeconds: Math.round((Date.now() - t0) / 1000), caveats, hypothesisRuns: done });
  log(`done in ${((Date.now() - t0) / 60000).toFixed(1)} min`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
