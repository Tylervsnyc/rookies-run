/**
 * LADDER AUDIT — grades every rung against the contract in spec.ts
 * (= docs/LADDER-SPEC.md), with error bars, and files the result in the
 * results ledger stamped with the engine that produced it.
 *
 *   npx tsx scripts/run-playtest/ladder-audit.ts [--trials=96] [--runs=96] [--jobs=8]
 *                                                 [--rung=N] [--sick] [--quick]
 *   npx tsx scripts/run-playtest/ladder-audit.ts --check-stale
 *
 * Method (every number of record): Normal, T5 bot, T1 cards. Passing the
 * difficulty is load-bearing — a run that pins its own Hard/Nightmare deltas
 * (revenge-21) reads nothing like its docs without it.
 *
 * Verdicts are PASS / FAIL / INCONCLUSIVE per check. INCONCLUSIVE means the 95%
 * interval straddles the window at this budget — the table says how many trials
 * would settle it. It is never rounded to a verdict: at 16 trials a cell is
 * ±20 points and the spec window is ±8, which is how the old nightly could
 * report "182 cells moved more than 15 points" in one night.
 *
 * `--sick` forces summoning sickness on (the ladder as it WILL be once its
 * finales are re-tuned for it — Tyler 2026-09-09). `--check-stale` compares the
 * engine fingerprint of the latest filed audit with the current tree and
 * prints which rungs' numbers still describe this game.
 */
import { LADDER_RUNG_IDS } from '../../lib/run/ladder';
import { getRunById } from '../../lib/run/runs';
import { DIFFICULTIES } from '../../lib/run/difficulty';
import { matrixParallel, puzzleFor, simulateRuns, type Cell } from './revenge-core';
import {
  BAND_TOL, BUDGET, FINALE_LEVELS, GATE_NONE_MAX, GATE_SINGLE_MAX, RUN_TOL, SCALE_LATE_GAP, SHAPE_MIN_SPAN,
  USED_MIN_GAP, USED_MIN_LEVELS, bandTarget, fmtEstimate, gradeCeiling, gradeWindow, pooled, rungGrade, runTarget,
  scaleFloor, wilson, type Estimate, type Graded, type RungChecks, type RungGrade,
} from './spec';
import { engineFingerprint, fmtFingerprint, sameEngine } from './fingerprint';
import { latestResult, writeResult } from './results';

const ISO = '2026-08-18';

function num(name: string, def: number): number {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? Number(hit.split('=')[1]) : def;
}
const flag = (name: string) => process.argv.includes(`--${name}`);

export interface RungResult {
  rung: number;
  runId: string;
  name: string;
  pair: [string, string];
  kit: string[];
  grade: RungGrade;
  checks: RungChecks;
  /** Per finale level. */
  pairByLevel: Estimate[];
  /** Worst single (or none) per finale level. */
  worstSingleByLevel: Array<{ loadout: string; est: Estimate }>;
  pairMean: Estimate;
  run: Estimate;
  avgPieces: number;
  early: number;
  late: number;
  targets: { band: number; run: number; scale: number };
}

export interface AuditOpts {
  trials: number;
  runs: number;
  jobs: number;
  sick: boolean;
  /** 1-based rung to audit alone; undefined = all. */
  only?: number;
  log?: (s: string) => void;
}

export async function auditRung(r: number, o: AuditOpts): Promise<RungResult> {
  const runId = LADDER_RUNG_IDS[r - 1];
  const run = getRunById(runId);
  if (!run.signaturePair) throw new Error(`${runId} has no signaturePair — set it on the RunDef`);
  const pair = run.signaturePair as [string, string];
  const kit = [...(run.allowedAbilities ?? [])] as string[];
  const pairKey = `${pair[0]}+${pair[1]}`;

  const cells: Cell[] = await matrixParallel(
    { runId, difficulty: 'normal', summonSickness: o.sick },
    { levels: [...FINALE_LEVELS], loadouts: ['none', ...kit, pairKey], trials: o.trials, tier: 'T5', realistic: false, jobs: o.jobs },
  );
  const cell = (loadout: string, level: number) => cells.find((c) => c.loadout === loadout && c.level === level);
  const est = (loadout: string, level: number): Estimate => {
    const c = cell(loadout, level);
    return wilson(c?.wins ?? 0, c?.trials ?? 0);
  };

  const pairByLevel = FINALE_LEVELS.map((l) => est(pairKey, l));
  const worstSingleByLevel = FINALE_LEVELS.map((l) => {
    let worst = { loadout: 'none', est: est('none', l) };
    for (const k of kit) {
      const e = est(k, l);
      if (e.pct > worst.est.pct) worst = { loadout: k, est: e };
    }
    return worst;
  });
  const pairMean = pooled(pairByLevel);

  // 1. GATE — the worst single across the finale, graded as a ceiling. The
  // whole finale is one claim, so pool the worst cell per level.
  const gateCells = worstSingleByLevel.map((w) => w.est);
  const gateWorst = gateCells.reduce((a, b) => (b.hi > a.hi ? b : a));
  const gate: Graded = gradeCeiling(gateWorst, Math.max(GATE_SINGLE_MAX, GATE_NONE_MAX));

  // 2. USED
  const used = pairByLevel.filter((p, i) => p.pct - worstSingleByLevel[i].est.pct >= USED_MIN_GAP).length >= USED_MIN_LEVELS;

  // 3. BAND
  const band = gradeWindow(pairMean, bandTarget(r) - BAND_TOL, bandTarget(r) + BAND_TOL);

  // 4. RUN — at the real retry budget
  const rep = simulateRuns({ runId, difficulty: 'normal', iso: ISO, summonSickness: o.sick }, o.runs, 'T5', {
    retriesPerLevel: DIFFICULTIES.normal.retriesPerLevel,
    seedPrefix: `audit:normal:${runId}`,
  });
  const runEst = wilson(rep.fullClears, o.runs);
  const runG = gradeWindow(runEst, runTarget(r) - RUN_TOL, runTarget(r) + RUN_TOL);

  // 5. SCALE
  const counts: number[] = [];
  for (let lv = 0; lv < run.levels.length; lv++) counts.push(puzzleFor({ runId }, lv + 1).pieces.length);
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const avgPieces = mean(counts);
  const early = mean(counts.slice(0, 3));
  const late = mean(counts.slice(7, 10));
  const scale = avgPieces >= scaleFloor(r) && late >= early + SCALE_LATE_GAP;

  // 6. SHAPE
  const pcts = pairByLevel.map((p) => p.pct);
  const shape = Math.max(...pcts) - Math.min(...pcts) >= SHAPE_MIN_SPAN && pcts[3] <= pcts[0];

  const checks: RungChecks = { gate, used, band, run: runG, scale, shape };
  return {
    rung: r, runId, name: run.name, pair, kit, grade: rungGrade(checks), checks,
    pairByLevel, worstSingleByLevel, pairMean, run: runEst, avgPieces, early, late,
    targets: { band: bandTarget(r), run: runTarget(r), scale: scaleFloor(r) },
  };
}

function fmtRow(x: RungResult): string {
  const g = (gr: Graded) => (gr.verdict === 'PASS' ? 'ok  ' : gr.verdict === 'FAIL' ? 'FAIL' : `?${gr.trialsNeeded ?? ''}`.padEnd(4));
  const b = (ok: boolean) => (ok ? 'ok  ' : 'FAIL');
  return (
    `rung ${String(x.rung).padStart(2)} ${x.runId.padEnd(11)} ${x.grade.padEnd(13)}` +
    ` gate ${g(x.checks.gate)} used ${b(x.checks.used)} band ${g(x.checks.band)} run ${g(x.checks.run)} scale ${b(x.checks.scale)} shape ${b(x.checks.shape)}` +
    `  | pair ${x.pairByLevel.map((p) => String(Math.round(p.pct)).padStart(3)).join('/')} = ${fmtEstimate(x.pairMean)} (want ${x.targets.band}±${BAND_TOL})` +
    `  run ${fmtEstimate(x.run)} (want ${x.targets.run.toFixed(0)}±${RUN_TOL})  pieces ${x.avgPieces.toFixed(1)} (≥${x.targets.scale.toFixed(1)})`
  );
}

export function summarize(rows: RungResult[]): string {
  const n = (g: RungGrade) => rows.filter((o) => o.grade === g).length;
  return `PASS ${n('PASS')} · BROKEN ${n('BROKEN')} · TOO EASY ${n('TOO EASY')} · TOO HARD ${n('TOO HARD')} · FLAT ${n('FLAT')} · INCONCLUSIVE ${n('INCONCLUSIVE')} (of ${rows.length})`;
}

export async function auditLadder(o: AuditOpts): Promise<{ rows: RungResult[]; file: string; summary: string }> {
  const log = o.log ?? ((s: string) => console.log(s));
  const rows: RungResult[] = [];
  const experiment = o.sick ? 'ladder-audit-sick' : 'ladder-audit';
  for (let r = 1; r <= LADDER_RUNG_IDS.length; r++) {
    if (o.only && r !== o.only) continue;
    const x = await auditRung(r, o);
    rows.push(x);
    log(fmtRow(x));
  }
  const summary = summarize(rows);
  const file = writeResult(
    {
      experiment: o.only ? `${experiment}-rung${o.only}` : experiment,
      budget: { trials: o.trials, runs: o.runs, jobs: o.jobs, seed: `matrix per (run,level,loadout,trial); runs audit:normal:<runId>` },
      conclusion: `${summary}${o.sick ? ' · summoning sickness ON' : ''}`,
      doc: 'docs/LADDER-SPEC.md',
    },
    { sick: o.sick, method: 'Normal, T5, T1 cards', rows },
  );
  log(`\n${summary}`);
  log(`summoning sickness: ${o.sick ? 'ON (the ladder as it WILL be)' : 'off (the ladder as it is today)'}`);
  log(`filed: ${file}`);
  return { rows, file, summary };
}

/** Compare the latest filed audit's engine with the current tree. */
export function checkStale(sick = false): { fresh: boolean; message: string } {
  const now = engineFingerprint();
  const last = latestResult<{ rows: RungResult[] }>(sick ? 'ladder-audit-sick' : 'ladder-audit');
  if (!last) return { fresh: false, message: `no ladder audit on file — current engine ${fmtFingerprint(now)}` };
  if (sameEngine(last.engine, now)) {
    return { fresh: true, message: `ladder numbers are CURRENT: audited ${last.date} on ${fmtFingerprint(last.engine)} (${last.body.rows.length} rungs; ${last.conclusion})` };
  }
  return {
    fresh: false,
    message: `ladder numbers are STALE: last audit ${last.date} on ${fmtFingerprint(last.engine)}, engine is now ${fmtFingerprint(now)} — re-run ladder-audit.ts before quoting any rung`,
  };
}

if (require.main === module) {
  (async () => {
    if (flag('check-stale')) {
      const r = checkStale(flag('sick'));
      console.log(r.message);
      process.exit(r.fresh ? 0 : 2);
    }
    const quick = flag('quick');
    const only = process.argv.find((a) => a.startsWith('--rung='));
    const o: AuditOpts = {
      trials: num('trials', quick ? BUDGET.quick.trials : BUDGET.bandTrials),
      runs: num('runs', quick ? BUDGET.quick.runs : BUDGET.runTrials),
      jobs: num('jobs', 8),
      sick: flag('sick'),
      only: only ? Number(only.split('=')[1]) : undefined,
    };
    console.log(`engine ${fmtFingerprint(engineFingerprint())} · ${o.trials} trials/cell, ${o.runs} full runs, jobs ${o.jobs}${o.sick ? ' · SICK' : ''}`);
    await auditLadder(o);
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
