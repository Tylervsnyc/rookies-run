/**
 * LADDER AUDIT — grades every rung against the contract in spec.ts
 * (= docs/LADDER-SPEC.md), with error bars, and files the result in the
 * results ledger stamped with the engine that produced it.
 *
 *   npx tsx scripts/run-playtest/ladder-audit.ts [--trials=96] [--runs=96] [--jobs=8]
 *                                                 [--rung=N] [--sick] [--quick]
 *                                                 [--ceiling] [--ceiling-depth=7] [--ceiling-nodes=150000]
 *   npx tsx scripts/run-playtest/ladder-audit.ts --check-stale
 *
 * Method (every number of record): Normal, T5 bot. Passing the difficulty is
 * load-bearing — a run that pins its own Hard/Nightmare deltas (revenge-21)
 * reads nothing like its docs without it.
 *
 * TWO TIER COLUMNS (2026-09-15). The finale used to be graded with T1 cards
 * only, but a real player reaches L7 holding upgrades (Tyler: Boulder T3-T5,
 * three stones a level) — so The Slash and The Alcove read TOO HARD and he
 * cleared both. Now the full-run sim snapshots what each run holds when it
 * reaches L7 ("arrival"); the finale is graded at the most common arrival
 * tier of each kit card (capped by the run's abilityTierCaps):
 *   T1       none, each single, the pair           — GATE + USED (as before), context
 *   arrival  the pair, the kit (pair + extra)      — BAND + SHAPE, REPEAT
 * The kit cell is the run's whole `allowedAbilities` when a player can hold
 * all of it (kit ≤ MAX_OWNED_ABILITIES); for today's 4-card kits it is the
 * pair + the extra card most often held beside it at arrival. Derived, never
 * a hard-coded size, so 3-card kits (plan Phase 3) need no change.
 *
 * Verdicts are PASS / FAIL / INCONCLUSIVE per check. INCONCLUSIVE means the 95%
 * interval straddles the window at this budget — the table says how many trials
 * would settle it.
 *
 * `--ceiling` runs the solver on finale levels where the bot's arrival-kit
 * upper bound is under BOT_BLIND_MAX; a proven forced win there is BOT-BLIND
 * evidence (the bot is missing a line that exists). `--check-stale` compares
 * the latest filed audit's engine with the tree.
 */
import { LADDER_RUNG_IDS } from '../../lib/run/ladder';
import { getRunById } from '../../lib/run/runs';
import { DIFFICULTIES } from '../../lib/run/difficulty';
import { MAX_OWNED_ABILITIES, abilityTierCapFor } from '../../lib/run/abilities';
import { matrixParallel, puzzleFor, simulateRuns, solveParallel, type Cell, type SolveResult } from './revenge-core';
import {
  BAND_TOL, BOT_BLIND_MAX, BUDGET, FINALE_LEVELS, GATE_NONE_MAX, GATE_SINGLE_MAX, RUN_TOL, SCALE_LATE_GAP, SHAPE_MIN_SPAN,
  USED_MIN_GAP, USED_MIN_LEVELS, bandTarget, fmtEstimate, fmtGrade, gradeCeiling, gradeWindow, pooled, rungGrade, runTarget,
  scaleFloor, wilson, type BotBlindFlag, type Estimate, type Graded, type RungChecks, type RungGrade,
} from './spec';
import { addCounts, repeatCheck, type RepeatRead } from './line-signature';
import { engineFingerprint, fmtFingerprint, sameEngine } from './fingerprint';
import { latestResult, writeResult } from './results';

const ISO = '2026-08-18';

function num(name: string, def: number): number {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? Number(hit.split('=')[1]) : def;
}
const flag = (name: string) => process.argv.includes(`--${name}`);

/** What runs hold when they reach the finale, read from the full-run sim. */
export interface ArrivalRead {
  level: number;
  /** Runs that reached the arrival level. */
  reached: number;
  /** The most common full held set, and its share of arrivals. */
  modal: string | null;
  modalShare: number;
  /** Per kit card: most common tier among arrivals holding it (capped); 1 when never held. */
  tiers: Record<string, number>;
  /** Share of arrivals holding BOTH signature cards. */
  pairHeldPct: number;
  /** The kit card beside the pair in the kit cell (null when the whole kit fits in hand). */
  extra: string | null;
  pairLoadout: string;
  kitLoadout: string;
}

export interface RungResult {
  rung: number;
  runId: string;
  name: string;
  pair: [string, string];
  kit: string[];
  grade: RungGrade;
  checks: RungChecks;
  /** T1 pair per finale level (context since 2026-09-15; was the graded column). */
  pairByLevel: Estimate[];
  /** Worst single (or none) per finale level, T1. */
  worstSingleByLevel: Array<{ loadout: string; est: Estimate }>;
  /** T1 pair mean (context; kept under this name so older filed audits compare). */
  pairMean: Estimate;
  run: Estimate;
  avgPieces: number;
  early: number;
  late: number;
  targets: { band: number; run: number; scale: number };
  /** Absent on audits filed before 2026-09-15. */
  arrival?: ArrivalRead;
  pairArrivalByLevel?: Estimate[];
  /** The graded BAND number. */
  pairArrivalMean?: Estimate;
  kitArrivalByLevel?: Estimate[];
  kitArrivalMean?: Estimate;
  lines?: RepeatRead;
  ceiling?: SolveResult[];
  /** Finale levels a HUMAN won with the same line (human-check.ts). */
  humanRepeats?: Array<[number, number, string]>;
}

export interface AuditOpts {
  trials: number;
  runs: number;
  jobs: number;
  sick: boolean;
  /** 1-based rung to audit alone; undefined = all. */
  only?: number;
  /** Solver ceiling on bot-blind-candidate finale levels; null/undefined = off. */
  ceiling?: { depth: number; nodes: number } | null;
  log?: (s: string) => void;
}

/** "boulder:3" at T2+, bare id at T1 — the form loadoutFor pins. */
const pin = (id: string, tier: number) => (tier > 1 ? `${id}:${tier}` : id);

export function readArrival(runId: string, kit: string[], pair: [string, string], arrivals: Record<string, number>, level: number): ArrivalRead {
  const sets = Object.entries(arrivals).map(([key, n]) => ({
    n,
    held: key === 'none' ? [] : key.split('+').map((p) => { const [id, t] = p.split(':'); return { id, tier: t ? Number(t) : 1 }; }),
  }));
  const reached = sets.reduce((a, s) => a + s.n, 0);
  const tiers: Record<string, number> = {};
  for (const card of kit) {
    const byTier: Record<number, number> = {};
    for (const s of sets) for (const h of s.held) if (h.id === card) byTier[h.tier] = (byTier[h.tier] ?? 0) + s.n;
    let best = 1;
    let bestN = 0;
    for (const [t, n] of Object.entries(byTier)) if (n > bestN || (n === bestN && Number(t) < best)) { best = Number(t); bestN = n; }
    tiers[card] = Math.min(best, abilityTierCapFor(runId, card));
  }
  const withPair = sets.filter((s) => pair.every((p) => s.held.some((h) => h.id === p)));
  const pairHeld = withPair.reduce((a, s) => a + s.n, 0);
  let modal: string | null = null;
  let modalN = 0;
  for (const [k, n] of Object.entries(arrivals)) if (n > modalN) { modal = k; modalN = n; }
  let extra: string | null = null;
  const others = kit.filter((k) => !pair.includes(k));
  if (kit.length > MAX_OWNED_ABILITIES && others.length) {
    const count: Record<string, number> = {};
    for (const s of withPair) for (const h of s.held) if (!pair.includes(h.id)) count[h.id] = (count[h.id] ?? 0) + s.n;
    extra = others.reduce((best, k) => ((count[k] ?? 0) > (count[best] ?? 0) ? k : best), others[0]);
  }
  const kitCards = extra ? [...pair, extra] : [...pair, ...others];
  return {
    level,
    reached,
    modal,
    modalShare: reached ? Math.round((modalN / reached) * 100) / 100 : 0,
    tiers,
    pairHeldPct: reached ? Math.round((pairHeld / reached) * 100) : 0,
    extra,
    pairLoadout: pair.map((c) => pin(c, tiers[c] ?? 1)).join('+'),
    kitLoadout: kitCards.map((c) => pin(c, tiers[c] ?? 1)).join('+'),
  };
}

/** Add BOT-BLIND evidence to a row (deduped by level+source) and regrade it. */
export function applyBotBlind(row: RungResult, flags: BotBlindFlag[]): RungResult {
  const have = row.checks.botBlind ?? [];
  const key = (f: BotBlindFlag) => `${f.level}:${f.source}:${f.loadout}`;
  const merged = [...have, ...flags.filter((f) => !have.some((h) => key(h) === key(f)))];
  row.checks.botBlind = merged;
  row.grade = rungGrade(row.checks);
  return row;
}

export async function auditRung(r: number, o: AuditOpts): Promise<RungResult> {
  const runId = LADDER_RUNG_IDS[r - 1];
  const run = getRunById(runId);
  if (!run.signaturePair) throw new Error(`${runId} has no signaturePair — set it on the RunDef`);
  const pair = run.signaturePair as [string, string];
  const kit = [...(run.allowedAbilities ?? [])] as string[];
  const pairKey = `${pair[0]}+${pair[1]}`;
  const cfg = { runId, difficulty: 'normal' as const, summonSickness: o.sick };

  // 4. RUN first — its full runs are also where the arrival loadout comes from.
  const rep = simulateRuns({ ...cfg, iso: ISO }, o.runs, 'T5', {
    retriesPerLevel: DIFFICULTIES.normal.retriesPerLevel,
    seedPrefix: `audit:normal:${runId}`,
    arrivalLevel: FINALE_LEVELS[0],
  });
  const arrival = readArrival(runId, kit, pair, rep.arrivals ?? {}, FINALE_LEVELS[0]);

  const loadouts = [...new Set(['none', ...kit, pairKey, arrival.pairLoadout, arrival.kitLoadout])];
  const cells: Cell[] = await matrixParallel(cfg, {
    levels: [...FINALE_LEVELS], loadouts, trials: o.trials, tier: 'T5', realistic: false, jobs: o.jobs, signatures: true,
  });
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
  const pairArrivalByLevel = FINALE_LEVELS.map((l) => est(arrival.pairLoadout, l));
  const pairArrivalMean = pooled(pairArrivalByLevel);
  const kitArrivalByLevel = FINALE_LEVELS.map((l) => est(arrival.kitLoadout, l));
  const kitArrivalMean = pooled(kitArrivalByLevel);

  // 1. GATE — T1 singles, the worst across the finale, graded as a ceiling.
  const gateCells = worstSingleByLevel.map((w) => w.est);
  const gateWorst = gateCells.reduce((a, b) => (b.hi > a.hi ? b : a));
  const gate: Graded = gradeCeiling(gateWorst, Math.max(GATE_SINGLE_MAX, GATE_NONE_MAX));

  // 2. USED — T1 pair vs T1 singles (same tiers on both sides of the gap).
  const used = pairByLevel.filter((p, i) => p.pct - worstSingleByLevel[i].est.pct >= USED_MIN_GAP).length >= USED_MIN_LEVELS;

  // 3. BAND — at ARRIVAL tiers.
  const band = gradeWindow(pairArrivalMean, bandTarget(r) - BAND_TOL, bandTarget(r) + BAND_TOL);

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

  // 6. SHAPE — at arrival tiers, like the band it describes.
  const pcts = pairArrivalByLevel.map((p) => p.pct);
  const shape = Math.max(...pcts) - Math.min(...pcts) >= SHAPE_MIN_SPAN && pcts[3] <= pcts[0];

  // 7. REPEAT — winning lines of the arrival pair + kit cells.
  const countsByLevel: Record<number, Record<string, number>> = {};
  for (const l of FINALE_LEVELS) {
    const acc: Record<string, number> = {};
    for (const lo of new Set([arrival.pairLoadout, arrival.kitLoadout])) addCounts(acc, cell(lo, l)?.signatures);
    countsByLevel[l] = acc;
  }
  const lines = repeatCheck(countsByLevel);

  // Solver ceiling — only where the bot reads under the BOT-BLIND bar.
  const botBlind: BotBlindFlag[] = [];
  let ceiling: SolveResult[] | undefined;
  if (o.ceiling) {
    const blindLevels = FINALE_LEVELS.filter((l, i) => kitArrivalByLevel[i].hi < BOT_BLIND_MAX);
    if (blindLevels.length) {
      ceiling = await solveParallel(cfg, { levels: blindLevels, loadouts: [arrival.kitLoadout], depth: o.ceiling.depth, nodes: o.ceiling.nodes, jobs: o.jobs });
      for (const s of ceiling) {
        if (s.verdict !== 'forced-win') continue;
        const bot = kitArrivalByLevel[FINALE_LEVELS.indexOf(s.level)];
        botBlind.push({ level: s.level, source: 'solver', loadout: s.loadout, bot, detail: `solver proves a forced win in ${s.depth} Rookie moves (every start file, 6 enemy tie-breaks); bot ${fmtEstimate(bot)}` });
      }
    }
  }

  const checks: RungChecks = { gate, used, band, run: runG, scale, shape, repeat: lines.ok, botBlind };
  return {
    rung: r, runId, name: run.name, pair, kit, grade: rungGrade(checks), checks,
    pairByLevel, worstSingleByLevel, pairMean, run: runEst, avgPieces, early, late,
    targets: { band: bandTarget(r), run: runTarget(r), scale: scaleFloor(r) },
    arrival, pairArrivalByLevel, pairArrivalMean, kitArrivalByLevel, kitArrivalMean, lines,
    ...(ceiling ? { ceiling } : {}),
  };
}

const lvPcts = (es: Estimate[] | undefined) => (es ?? []).map((p) => String(Math.round(p.pct)).padStart(3)).join('/');

export function fmtRow(x: RungResult): string {
  const g = (gr: Graded) => (gr.verdict === 'PASS' ? 'ok  ' : gr.verdict === 'FAIL' ? 'FAIL' : `?${gr.trialsNeeded ?? ''}`.padEnd(4));
  const b = (ok: boolean | undefined) => (ok === undefined ? '-   ' : ok ? 'ok  ' : 'FAIL');
  const lines: string[] = [];
  lines.push(
    `rung ${String(x.rung).padStart(2)} ${x.runId.padEnd(11)} ${fmtGrade(x.grade).padEnd(13)}` +
    ` gate ${g(x.checks.gate)} used ${b(x.checks.used)} band ${g(x.checks.band)} run ${g(x.checks.run)} scale ${b(x.checks.scale)} shape ${b(x.checks.shape)} repeat ${b(x.checks.repeat)}` +
    `  | run ${fmtEstimate(x.run)} (want ${x.targets.run.toFixed(0)}±${RUN_TOL})  pieces ${x.avgPieces.toFixed(1)} (≥${x.targets.scale.toFixed(1)})`,
  );
  lines.push(`         T1      pair ${lvPcts(x.pairByLevel)} = ${fmtEstimate(x.pairMean)}   (context)`);
  if (x.arrival && x.pairArrivalMean && x.kitArrivalMean) {
    lines.push(`         arrival pair ${lvPcts(x.pairArrivalByLevel)} = ${fmtEstimate(x.pairArrivalMean)} (BAND want ${x.targets.band}±${BAND_TOL})  [${x.arrival.pairLoadout}]`);
    lines.push(`         arrival kit  ${lvPcts(x.kitArrivalByLevel)} = ${fmtEstimate(x.kitArrivalMean)}  [${x.arrival.kitLoadout}]  · pair held at L${x.arrival.level} in ${x.arrival.pairHeldPct}% of ${x.arrival.reached} runs; modal ${x.arrival.modal ?? '-'} (${Math.round(x.arrival.modalShare * 100)}%)`);
  }
  if (x.lines) {
    const dom = FINALE_LEVELS.map((l) => `L${l} ${x.lines!.byLevel[l]?.signature ?? '(too few wins)'}`).join(' · ');
    lines.push(`         lines   ${dom}`);
    for (const [a, c, sig] of x.lines.repeats) lines.push(`         REPEAT  L${a} = L${c}: ${sig}`);
  }
  for (const [a, c, sig] of x.humanRepeats ?? []) lines.push(`         REPEAT (human) L${a} = L${c}: ${sig}`);
  for (const f of x.checks.botBlind ?? []) lines.push(`         BOT-BLIND L${f.level} (${f.source}) ${f.detail}`);
  return lines.join('\n');
}

export function summarize(rows: RungResult[]): string {
  const n = (g: RungGrade) => rows.filter((o) => o.grade === g).length;
  return `PASS ${n('PASS')} · BROKEN ${n('BROKEN')} · TOO EASY ${n('TOO EASY')} · TOO HARD ${n('TOO HARD')} · BOT-BLIND ${n('BOT-BLIND')} · FLAT ${n('FLAT')} · INCONCLUSIVE ${n('INCONCLUSIVE')} (of ${rows.length})`;
}

export const AUDIT_METHOD = 'Normal, T5; GATE/USED at T1 cards, BAND/SHAPE/REPEAT at arrival tiers (pair + kit)';

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
      budget: { trials: o.trials, runs: o.runs, jobs: o.jobs, seed: `matrix per (run,level,loadout,trial); runs audit:normal:<runId>${o.ceiling ? `; ceiling depth ${o.ceiling.depth} nodes ${o.ceiling.nodes}` : ''}` },
      conclusion: `${summary}${o.sick ? ' · summoning sickness ON' : ''}`,
      doc: 'docs/LADDER-SPEC.md',
    },
    { sick: o.sick, method: AUDIT_METHOD, rows },
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
      ceiling: flag('ceiling') || process.argv.some((a) => a.startsWith('--ceiling-'))
        ? { depth: num('ceiling-depth', BUDGET.ceiling.depth), nodes: num('ceiling-nodes', BUDGET.ceiling.nodes) }
        : null,
    };
    console.log(`engine ${fmtFingerprint(engineFingerprint())} · ${o.trials} trials/cell, ${o.runs} full runs, jobs ${o.jobs}${o.sick ? ' · SICK' : ''}${o.ceiling ? ` · ceiling d${o.ceiling.depth}/${o.ceiling.nodes}` : ''}`);
    await auditLadder(o);
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
