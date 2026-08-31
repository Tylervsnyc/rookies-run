/**
 * Rookie's Revenge — morning digest writer.
 *
 * Written for Tyler: plain English, short, numbers in tables. Sections:
 *   headline · per-run level table · difficulty modes · full-run clear rates ·
 *   biggest movers vs last night · feature findings · human vs bot ·
 *   last night's experiments · tonight's 3 hypotheses · candidate runs ·
 *   how to read this / caveats
 *
 * `renderSlack` produces the ≤25-line summary the cron wrapper posts.
 */

import type { DifficultyId } from '../../lib/run/difficulty';
import { FINISHERS, winPct, type Cell, type RunsReport, type SolveResult } from './revenge-core';
import type { RevengeFeatures } from './revenge-features';
import { shortReason, type ContentItem, type PipelineSummary } from '../../lib/content/pipeline';
import {
  abilityTierList,
  bandFor,
  clearPct,
  describeImpossible,
  difficultyCall,
  FINISHER_FLOOR_MIN,
  NEWPLAYER_NORMAL_HIGH,
  NEWPLAYER_NORMAL_LOW,
  NEWPLAYER_NORMAL_TOO_EASY,
  NEWPLAYER_ROOKIE_MIN,
  powersCarry,
  runDifficulty,
  type PlayerSims,
  type Correlation,
  type ExperimentResult,
  type Hypothesis,
  type LevelSummary,
  type NightDiff,
  type RidgeFit,
  type ThresholdFinding,
  type Verdict,
} from './revenge-analysis';

export const MODES: ReadonlyArray<DifficultyId> = ['rookie', 'normal', 'hard', 'nightmare'];

export interface ModeBlock {
  cells: Cell[];
  summary: LevelSummary[];
}

export interface RunReport {
  runId: string;
  name: string;
  candidate: boolean;
  levelCount: number;
  realistic: ModeBlock;
  modes: Partial<Record<DifficultyId, ModeBlock>>;
  fullRuns: Partial<Record<'authored' | DifficultyId, RunsReport>>;
  solver: SolveResult[];
  features: RevengeFeatures[];
  verdict: Verdict;
  /** New-player (3 starters) and veteran (full pool) full-run sims with the mode's retries. */
  players: PlayerSims;
  /** Trial counts this run actually got (candidates run lighter). */
  budget: { trials: number; modeTrials: number; runs: number; playerRuns: number };
}

const STARTERS_LABEL = 'knight-hop, surge, freeze-ray';

function callWord(call: ReturnType<typeof difficultyCall>['call'], normal: number | null): string {
  if (call === 'unmeasured') return 'unmeasured';
  if (normal !== null && normal > NEWPLAYER_NORMAL_TOO_EASY) return 'TOO EASY';
  return call;
}

export interface HumanLevelRow {
  level: number;
  reached: number;
  cleared: number;
  clearRate: number | null;
}

export interface HumanSummary {
  since: string;
  source: 'supabase+disk' | 'disk-only';
  byRun: Array<{ runId: string; traces: number; wins: number; byLevel: HumanLevelRow[] }>;
}

export interface DigestInput {
  date: string;
  quick: boolean;
  /** Content pipeline state after tonight's grading (data/content/pipeline.json). */
  pipeline?: PipelineSummary;
  wallSeconds: number;
  trials: { realistic: number; mode: number; runs: number; solveDepth: number; solveNodes: number; experiment: number };
  runs: RunReport[];
  diff: NightDiff;
  samples: number;
  correlationsNone: Correlation[];
  correlationsFloor: Correlation[];
  findingsNone: ThresholdFinding[];
  findingsFloor: ThresholdFinding[];
  fitNone: RidgeFit | null;
  fitFloor: RidgeFit | null;
  humans: HumanSummary | null;
  hypotheses: Hypothesis[];
  experiments: ExperimentResult[];
  caveats: string[];
}

// ─────────────────────────────────────────────────────────────────────────────

const pct = (n: number | null | undefined) => (n === null || n === undefined ? '-' : `${Math.round(n)}%`);
const signed = (n: number) => (n > 0 ? `+${Math.round(n)}` : `${Math.round(n)}`);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function lossNote(c: Cell): string {
  const parts: string[] = [];
  if (c.captured) parts.push(`c${c.captured}`);
  if (c.moveLimit) parts.push(`m${c.moveLimit}`);
  if (c.stall) parts.push(`s${c.stall}`);
  if (c.deadEnd) parts.push(`d${c.deadEnd}`);
  return parts.length ? ` (${parts.join(',')})` : '';
}

/** One paragraph: what changed, what's broken, what to look at. */
export function headline(input: DigestInput): string {
  const live = input.runs.filter((r) => !r.candidate);
  const cands = input.runs.filter((r) => r.candidate);
  const bits: string[] = [];

  for (const r of input.runs) {
    for (const i of r.verdict.impossible) bits.push(`IMPOSSIBLE LEVEL in ${r.name} (${r.runId}${r.candidate ? ', candidate' : ''}) — ${describeImpossible(i)}. Fix the level before anything else.`);
  }

  for (const r of live) {
    const d = difficultyCall(r.players);
    const vet = { normal: clearPct(r.players.veteranNormal), rookie: clearPct(r.players.veteranRookie) };
    const carry = powersCarry(r.realistic.summary, r.realistic.cells);
    const weak = r.realistic.summary.filter((s) => s.finisherFloor < FINISHER_FLOOR_MIN);
    const stalls = r.realistic.summary.reduce((n, s) => n + s.stalls, 0);
    let s = `${r.name}: a new player (3 starters) clears the run ${pct(d.normal)} of the time on Normal and ${pct(d.rookie)} on Rookie — ${callWord(d.call, d.normal)} (target ${NEWPLAYER_NORMAL_LOW}-${NEWPLAYER_NORMAL_HIGH}% on Normal, ${NEWPLAYER_ROOKIE_MIN}%+ on Rookie)`;
    s += `. A veteran with every ability clears ${pct(vet.normal)} / ${pct(vet.rookie)}.`;
    s += ` Powers carry you by ${signed(carry.lift)} points (no-ability averages ${carry.none}%, finishers ${carry.finisher}%).`;
    if (weak.length) s += ` Weak finishers: ${weak.map((x) => `${x.worstFinisher.id} ${x.worstFinisher.pct}% on L${x.level}`).join(', ')}.`;
    s += stalls ? ` ${stalls} stall${stalls === 1 ? '' : 's'} (king unreachable — look at this first).` : ' Zero stalls.';
    bits.push(s);
  }

  if (input.diff.previousDate) {
    const m = input.diff.movers.length;
    const flags: string[] = [];
    if (m) flags.push(`${m} cell${m === 1 ? '' : 's'} moved more than 15 points since ${input.diff.previousDate} (biggest: ${input.diff.movers.slice(0, 2).map((x) => `L${x.level} ${x.loadout} ${x.before}→${x.after}% [${x.mode}]`).join('; ')})`);
    if (input.diff.newStalls.length) flags.push(`${input.diff.newStalls.length} NEW stall${input.diff.newStalls.length === 1 ? '' : 's'}`);
    if (input.diff.bandExits.length) flags.push(`${input.diff.bandExits.map((x) => `L${x.level} left its band (${x.before}→${x.after}%, ${x.note})`).join(', ')}`);
    bits.push(flags.length ? `Versus last night: ${flags.join('; ')}.` : `Versus last night (${input.diff.previousDate}): nothing moved more than 15 points, no new stalls, no level left its band.`);
  } else {
    bits.push('No previous night to compare against yet — tonight is the baseline.');
  }

  if (input.experiments.length) {
    const c = input.experiments.filter((e) => e.verdict === 'confirmed').length;
    const f = input.experiments.filter((e) => e.verdict === 'falsified').length;
    bits.push(`Ran ${input.experiments.length} experiment${input.experiments.length === 1 ? '' : 's'} on level tweaks: ${c} prediction${c === 1 ? '' : 's'} confirmed, ${f} falsified.`);
  }

  if (cands.length) {
    const promote = cands.filter((r) => r.verdict.recommendation === 'promote');
    bits.push(`Candidate runs: ${cands.length} tested, ${promote.length} ready to promote${promote.length ? ` (${promote.map((r) => r.runId).join(', ')})` : ''}.`);
  } else {
    bits.push('No candidate runs in the queue tonight.');
  }

  if (input.humans && input.humans.byRun.some((r) => r.traces > 0)) {
    const h = input.humans.byRun.find((r) => r.traces > 0)!;
    bits.push(`${h.traces} human run${h.traces === 1 ? '' : 's'} on ${h.runId} since ${input.humans.since}, ${h.wins} won.`);
  }
  return bits.join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────

export function renderDigest(input: DigestInput): string {
  const L: string[] = [];
  const mins = (input.wallSeconds / 60).toFixed(1);
  L.push(`# Rookie's Revenge — Morning Report`);
  L.push('');
  L.push(`**Date:** ${input.date} · **Mode:** ${input.quick ? 'quick smoke (few trials — numbers are rough)' : 'full'} · **Wall time:** ${mins} min`);
  L.push(`**Bot:** T5 MCTS · **Live run:** ${input.trials.realistic} trials per cell at realistic tiers, ${input.trials.mode} per difficulty mode, ${input.trials.runs} full runs per mode · **Experiments:** ${input.trials.experiment} trials · candidates run lighter (see each run)`);
  L.push('');
  L.push(`## Headline`);
  L.push('');
  L.push(headline(input));
  L.push('');

  // Standing sections (Tyler, 2026-08-30): difficulty = the NEW PLAYER's clear rate, then ability tier list, every run.
  L.push(`## Run difficulty and ability tiers`);
  L.push('');
  L.push(`Difficulty is measured on the player who actually exists: a **new player** with only the 3 starters (${STARTERS_LABEL}), taking the offers the app forces (never dismissing), with the mode's retries (Rookie unlimited, Normal 3). Target: ${NEWPLAYER_NORMAL_LOW}-${NEWPLAYER_NORMAL_HIGH}% full-run clear on Normal, ${NEWPLAYER_ROOKIE_MIN}%+ on Rookie; over ${NEWPLAYER_NORMAL_TOO_EASY}% on Normal is TOO EASY.`);
  L.push('');
  for (const r of input.runs) {
    const d = difficultyCall(r.players);
    const vet = { normal: clearPct(r.players.veteranNormal), rookie: clearPct(r.players.veteranRookie) };
    const carry = powersCarry(r.realistic.summary, r.realistic.cells);
    const legacy = runDifficulty(r.realistic.summary);
    const hard = legacy.hardLevels.length ? legacy.hardLevels.map((h) => `L${h.level} ${h.nonePct}%`).join(', ') : 'none';
    L.push(`**${r.name}** (\`${r.runId}\`${r.candidate ? ', candidate' : ''})`);
    L.push('');
    L.push(`- **New player clears this run ${pct(d.normal)} of the time on Normal / ${pct(d.rookie)} on Rookie — ${callWord(d.call, d.normal)}.** (${r.budget.playerRuns} runs per mode; retries used: Normal ${r.players.starterNormal?.retriesUsed ?? '-'}, Rookie ${r.players.starterRookie?.retriesUsed ?? '-'}.)`);
    L.push(`- Veteran (all ${new Set(r.realistic.cells.filter((c) => c.loadout !== 'none').map((c) => c.loadout)).size} abilities): ${pct(vet.normal)} on Normal / ${pct(vet.rookie)} on Rookie.`);
    L.push(`- Powers carry you by **${signed(carry.lift)} points**: no-ability averages ${carry.none}% across L1-L${r.levelCount}, the five finishers average ${carry.finisher}%. Hard levels without powers (no-ability under 60%): ${hard}.`);
    L.push('');
    L.push(playerLevelTable(r));
    L.push('');
    L.push(tierTable(r));
    L.push('');
  }

  for (const r of input.runs) {
    L.push(`## ${r.name} (\`${r.runId}\`)${r.candidate ? ' — CANDIDATE' : ''}`);
    L.push('');
    L.push(`Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, ${r.budget.trials} trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.`);
    L.push('');
    L.push(`| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |`);
    L.push(`|---|---|---|---|---|---|---|---|---|---|`);
    for (const s of r.realistic.summary) {
      const b = bandFor(s.level);
      const imp = r.verdict.impossible.some((i) => i.level === s.level);
      const flag = imp ? ' **IMPOSSIBLE**' : s.inBand ? '' : ` **${s.bandNote}**`;
      const solve = solverCellFor(r.solver, s.level);
      L.push(
        `| ${s.level} | ${b.low}-${b.high}% | **${s.nonePct}%**${lossNote(s.noneCell)}${flag} | ${s.bestFinisher.id} ${s.bestFinisher.pct}% | ${s.worstFinisher.id} ${s.worstFinisher.pct}%${s.finisherFloor < FINISHER_FLOOR_MIN ? ' **low**' : ''} | ${s.worstAny.id} ${s.worstAny.pct}% | ${s.stalls || '-'} | ${s.moveLimit ?? '-'} | ${s.avgMovesNone} | ${solve} |`,
      );
    }
    L.push('');
    L.push(`Every ability, win % at realistic tiers:`);
    L.push('');
    L.push(matrixTable(r.realistic.cells));
    L.push('');
    L.push(`**Verdict:** ${r.verdict.recommendation === 'promote' ? (r.candidate ? 'PROMOTE — new-player clear in target, finisher floor met, zero stalls.' : 'healthy — new-player clear in target, finisher floor met, zero stalls.') : (r.candidate ? 'HOLD' : 'needs a look')}${r.verdict.reasons.length ? ' ' + r.verdict.reasons.map((x) => `\n- ${x}`).join('') : ''}`);
    if (r.verdict.notes.length) {
      L.push('');
      L.push(`No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): ${r.verdict.notes.join('; ')}.`);
    }
    L.push('');

    // Difficulty modes
    L.push(`### Difficulty modes — ${r.name}`);
    L.push('');
    L.push(`T1 loadouts, no-ability + the five finishers, ${r.budget.modeTrials} trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.`);
    L.push('');
    L.push(`| Mode | No-ability curve L1→L${r.levelCount} | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |`);
    L.push(`|---|---|---|---|---|---|`);
    for (const m of MODES) {
      const blk = r.modes[m];
      if (!blk) continue;
      const curve = blk.summary.map((s) => s.nonePct).join('/');
      const hardest = [...blk.summary].sort((a, b) => a.nonePct - b.nonePct)[0];
      const weakest = [...blk.summary].sort((a, b) => a.finisherFloor - b.finisherFloor)[0];
      const stalls = blk.summary.reduce((n, s) => n + s.stalls, 0);
      const fr = r.fullRuns[m];
      L.push(`| ${cap(m)} | ${curve} | L${hardest.level} ${hardest.nonePct}% | ${weakest.worstFinisher.id} ${weakest.finisherFloor}% on L${weakest.level} | ${stalls || '-'} | ${fr ? `${fr.fullClears}/${fr.runs}` : '-'} |`);
    }
    L.push('');

    // Full runs
    const fr = r.fullRuns.authored;
    if (fr) {
      L.push(`### Full runs — ${r.name} (authored, random picks)`);
      L.push('');
      L.push(`${fr.runs} runs L1→L${r.levelCount}, a random card from every offer, abilities and tempo carried like the app. **${fr.fullClears}/${fr.runs} full clears.**`);
      L.push('');
      L.push(`| L | Reached | Cleared | Clear % | Losses |`);
      L.push(`|---|---|---|---|---|`);
      for (const row of fr.rows) L.push(`| ${row.level} | ${row.reached} | ${row.cleared} | ${pct(row.clearRate)} | ${Object.keys(row.losses).length ? Object.entries(row.losses).map(([k, v]) => `${k} ${v}`).join(', ') : '-'} |`);
      L.push('');
      const picks = Object.entries(fr.pickCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} ${v}`).join(', ');
      if (picks) L.push(`Most-picked cards: ${picks}.`);
      L.push('');
    }
  }

  // Movers
  L.push(`## Biggest movers vs last night`);
  L.push('');
  if (!input.diff.previousDate) {
    L.push('No previous night on disk — nothing to compare. Tomorrow this section lights up.');
  } else if (input.diff.movers.length === 0 && input.diff.newStalls.length === 0 && input.diff.bandExits.length === 0) {
    L.push(`Compared ${input.diff.comparedCells} cells against ${input.diff.previousDate}: nothing moved more than 15 points, no new stalls, no level left its band. (Start files are random, so ±10 on a single cell is normal noise.)`);
  } else {
    L.push(`Compared ${input.diff.comparedCells} cells against ${input.diff.previousDate}. Anything over 15 points is listed; with ${input.trials.realistic} trials a 15-point move is about two standard errors, so treat single cells with suspicion and clusters as real.`);
    L.push('');
    if (input.diff.movers.length) {
      L.push(`| Run | Mode | L | Loadout | Before | After | Change |`);
      L.push(`|---|---|---|---|---|---|---|`);
      for (const m of input.diff.movers.slice(0, 20)) L.push(`| ${m.runId} | ${m.mode} | ${m.level} | ${m.loadout} | ${m.before}% | ${m.after}% | ${signed(m.delta)} |`);
      if (input.diff.movers.length > 20) L.push(`| … | | | | | | ${input.diff.movers.length - 20} more |`);
      L.push('');
    }
    for (const s of input.diff.newStalls) L.push(`- **NEW STALL** ${s.runId} ${s.mode} L${s.level} ${s.loadout}: ${s.stall} game${s.stall === 1 ? '' : 's'} timed out with the king alive.`);
    for (const b of input.diff.bandExits) L.push(`- **Left its band:** ${b.runId} L${b.level} no-ability ${b.before}% → ${b.after}% (${b.note}).`);
    for (const b of input.diff.bandEntries) L.push(`- Back in band: ${b.runId} L${b.level} no-ability ${b.before}% → ${b.after}%.`);
  }
  L.push('');

  // Features
  L.push(`## What makes a level hard (feature findings)`);
  L.push('');
  L.push(`${input.samples} level snapshots (every level × authored + each difficulty mode, across all runs). Features are counted from the starting board — total enemies, hunters vs marchers, keys on the king's lines, pen size, move budget, and so on.`);
  L.push('');
  if (input.samples < 8) {
    L.push('Not enough snapshots for correlations yet (need 8+). This fills in as candidate runs arrive.');
  } else {
    if (input.findingsNone.length) {
      L.push(`**Plain-English splits (no-ability win %):**`);
      L.push('');
      for (const f of input.findingsNone) {
        const dir = f.deltaPts < 0 ? 'lower' : 'higher';
        L.push(`- Levels with ${f.threshold}+ ${f.label} average **${Math.abs(Math.round(f.deltaPts))} points ${dir}** no-ability win than the rest (${Math.round(f.aboveMean)}% vs ${Math.round(f.belowMean)}%, ${f.aboveN} vs ${f.belowN} snapshots).`);
      }
      L.push('');
    }
    if (input.findingsFloor.length) {
      L.push(`**Same, for the weakest finisher's win % (the safety net):**`);
      L.push('');
      for (const f of input.findingsFloor.slice(0, 4)) {
        const dir = f.deltaPts < 0 ? 'lower' : 'higher';
        L.push(`- ${f.threshold}+ ${f.label}: finisher floor **${Math.abs(Math.round(f.deltaPts))} points ${dir}** (${Math.round(f.aboveMean)}% vs ${Math.round(f.belowMean)}%).`);
      }
      L.push('');
    }
    L.push(`**Strongest single correlations:**`);
    L.push('');
    L.push(`| Feature | vs no-ability | vs finisher floor | High-quartile avg (none) | Low-quartile avg (none) |`);
    L.push(`|---|---|---|---|---|`);
    const floorBy = new Map(input.correlationsFloor.map((c) => [c.feature, c]));
    for (const c of input.correlationsNone.slice(0, 10)) {
      const fl = floorBy.get(c.feature);
      L.push(`| ${c.label} | ${c.pearson.toFixed(2)} | ${fl ? fl.pearson.toFixed(2) : '-'} | ${Math.round(c.meanWhenHigh)}% | ${Math.round(c.meanWhenLow)}% |`);
    }
    L.push('');
    L.push(`Reading: −1 means "more of this, harder level"; +1 means "more of this, easier". Anything past ±0.5 is worth believing at this sample size.`);
    L.push('');
    if (input.fitNone) {
      const top = Object.entries(input.fitNone.unitCoef)
        .map(([k, v]) => ({ k, v, s: input.fitNone!.stdCoef[k] }))
        .sort((a, b) => Math.abs(b.s) - Math.abs(a.s))
        .slice(0, 6);
      L.push(`**All features together (ridge regression, no-ability %):** fit R² ${input.fitNone.trainR2.toFixed(2)} on ${input.fitNone.samples} snapshots${input.fitNone.holdoutR2 !== null ? `, held-out R² ${input.fitNone.holdoutR2.toFixed(2)} on ${input.fitNone.holdoutSize}` : ' (too few for a hold-out)'}.`);
      L.push('');
      L.push(`| Feature | Points per +1 unit | Points per +1 std dev |`);
      L.push(`|---|---|---|`);
      for (const t of top) L.push(`| ${labelOf(input, t.k)} | ${(t.v >= 0 ? '+' : '') + t.v.toFixed(1)} | ${signed(t.s)} |`);
      L.push('');
      L.push(`With this few snapshots the coefficients are directional, not gospel. They firm up as more runs enter the pool.`);
      L.push('');
    }
  }

  // Humans
  L.push(`## Humans vs bot`);
  L.push('');
  if (!input.humans) {
    L.push('No Supabase credentials in the environment and no traces on disk — skipped. (The cron wrapper sources chess-learning-tree/.env.local; run it that way to pull phone traces.)');
  } else if (!input.humans.byRun.some((r) => r.traces > 0)) {
    L.push(`Traces pulled since ${input.humans.since} (${input.humans.source}): none for a Revenge run yet.`);
  } else {
    L.push(`Human runs since ${input.humans.since} (${input.humans.source}). "Cleared" is the share of human runs that got past the level; the bot column is the random-pick full-run clear rate on the authored level.`);
    L.push('');
    for (const h of input.humans.byRun) {
      if (h.traces === 0) continue;
      const run = input.runs.find((r) => r.runId === h.runId);
      L.push(`**${h.runId}** — ${h.traces} run${h.traces === 1 ? '' : 's'}, ${h.wins} won.`);
      L.push('');
      L.push(`| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |`);
      L.push(`|---|---|---|---|---|---|`);
      for (const row of h.byLevel) {
        const bot = run?.fullRuns.authored?.rows.find((x) => x.level === row.level)?.clearRate ?? null;
        const gap = row.clearRate !== null && bot !== null ? signed(row.clearRate - bot) : '-';
        L.push(`| ${row.level} | ${row.reached} | ${row.cleared} | ${pct(row.clearRate)} | ${pct(bot)} | ${gap} |`);
      }
      L.push('');
    }
    L.push(`Where humans fall well below the bot on a level the bot clears ability-free, the level is probably reading badly (unclear key, hidden hunter) rather than being tight. Caveat: traces written by a dev server (\`data/run-playtest/human-traces/\`) also include games the parity driver played through the real app — those are bot games wearing a human label.`);
  }
  L.push('');

  // Experiments run tonight
  L.push(`## Experiments run tonight`);
  L.push('');
  if (!input.experiments.length) {
    L.push('None ran.');
  } else {
    L.push(`Each one takes a level, makes ONE change, and replays the cell at realistic tier (${input.trials.experiment} trials). Predicted vs actual tells us whether the model understands the level.`);
    L.push('');
    L.push(`| Run | L | Change | Loadout | Baseline | Predicted | Actual | Verdict | Prediction from |`);
    L.push(`|---|---|---|---|---|---|---|---|---|`);
    for (const e of input.experiments) L.push(`| ${e.runId} | ${e.level} | ${describe(e)} | ${e.loadout} | ${e.baselinePct}% | ${e.predictedPct}% | **${e.actualPct}%** | ${e.verdict} | ${e.predictionSource} |`);
    L.push('');
    for (const e of input.experiments) L.push(`- ${e.why}`);
  }
  L.push('');

  // Hypotheses for tonight
  L.push(`## Top 3 hypotheses for tonight`);
  L.push('');
  if (!input.hypotheses.length) {
    L.push('No hypotheses generated (need a matrix with a no-ability column).');
  } else {
    input.hypotheses.slice(0, 3).forEach((h, i) => {
      const e = input.experiments.find((x) => x.id === h.id);
      L.push(`${i + 1}. **${h.text}.** ${h.why}${e ? ` Tested tonight: actual ${e.actualPct}% (${e.verdict}).` : ''}`);
    });
    L.push('');
    L.push('These are measurements, not changes — nothing in `lib/run/runs.ts` was touched. A confirmed hypothesis is a tweak worth making by hand.');
  }
  L.push('');

  // Candidate runs
  L.push(`## Candidate runs`);
  L.push('');
  const cands = input.runs.filter((r) => r.candidate);
  if (!cands.length) {
    L.push(`None in \`REVENGE_CANDIDATE_RUN_IDS\` tonight. When the generator adds one, it shows up here with a promote/hold call: new-player clear ${NEWPLAYER_NORMAL_LOW}-${NEWPLAYER_NORMAL_HIGH}% on Normal and ${NEWPLAYER_ROOKIE_MIN}%+ on Rookie, every finisher ≥80%, zero stalls.`);
  } else {
    L.push(`| Run | Recommendation | New player, Normal | New player, Rookie | Veteran, Normal | Finisher floor | Stalls | No-ability curve | Why |`);
    L.push(`|---|---|---|---|---|---|---|---|---|`);
    for (const r of cands) {
      const curve = r.realistic.summary.map((s) => s.nonePct).join('/');
      const floor = Math.min(...r.realistic.summary.map((s) => s.finisherFloor));
      const stalls = r.realistic.summary.reduce((n, s) => n + s.stalls, 0);
      L.push(`| ${r.runId} | **${r.verdict.recommendation.toUpperCase()}** | ${pct(clearPct(r.players.starterNormal))} | ${pct(clearPct(r.players.starterRookie))} | ${pct(clearPct(r.players.veteranNormal))} | ${floor}% | ${stalls} | ${curve} | ${r.verdict.reasons.length ? r.verdict.reasons.slice(0, 3).join('; ') : 'meets every bar'} |`);
    }
  }
  L.push('');

  // Content pipeline
  if (input.pipeline) {
    L.push(`## Content pipeline`);
    L.push('');
    L.push(...renderPipelineSection(input.pipeline));
    L.push('');
  }

  // Solver detail
  const withSolver = input.runs.filter((r) => r.solver.length);
  if (withSolver.length) {
    L.push(`## Solver — forced captures on the late levels`);
    L.push('');
    L.push(`AND-OR search, depth ${input.trials.solveDepth}, ${input.trials.solveNodes.toLocaleString()} nodes, worst case over every start file. W4 = forced win in 4 moves; no${input.trials.solveDepth} = no forced line found within the depth (not "impossible" — the bot's win % is the practical answer).`);
    L.push('');
    for (const r of withSolver) {
      const levels = [...new Set(r.solver.map((s) => s.level))].sort((a, b) => a - b);
      const rest = [...new Set(r.solver.map((s) => s.loadout))].filter((l) => l !== 'none');
      const loadouts = ['none', ...FINISHERS.filter((f) => rest.includes(f)), ...rest.filter((l) => !FINISHERS.includes(l))];
      L.push(`**${r.runId}**`);
      L.push('');
      L.push(`| L | ${loadouts.join(' | ')} |`);
      L.push(`|---|${loadouts.map(() => '---').join('|')}|`);
      for (const lv of levels) {
        const row = loadouts.map((lo) => {
          const s = r.solver.find((x) => x.level === lv && x.loadout === lo);
          return s ? solveCode(s) : '-';
        });
        L.push(`| ${lv} | ${row.join(' | ')} |`);
      }
      L.push('');
    }
  }

  L.push(`## How to read this`);
  L.push('');
  L.push(`- **No ability** = the T5 MCTS bot with no powers, offers dismissed. It is a floor for a good player, not a beginner's number.`);
  L.push(`- **Finishers** = ${FINISHERS.join(', ')} — the cards that take the king directly. Every offer slate carries at least two, so the worst finisher is the run's safety net.`);
  L.push(`- **Stall** = 300 turns with the king alive. Always a bug or an unreachable pen; the target is zero.`);
  L.push(`- **Difficulty** = the new-player sim (3 starters, forced offers, mode retries): ${NEWPLAYER_NORMAL_LOW}-${NEWPLAYER_NORMAL_HIGH}% full-run clear on Normal is the target, ${NEWPLAYER_ROOKIE_MIN}%+ on Rookie, over ${NEWPLAYER_NORMAL_TOO_EASY}% on Normal is too easy. The old no-ability band (100/100/100/100/90/50/55/50/30/30 ±15) is shown per level for reference only.`);
  L.push(`- Start files are random per game, so a single cell wobbles ±10 between nights at ${input.trials.realistic} trials (more on the lighter candidate passes). Trust clusters and repeated nights.`);
  L.push('');
  L.push(`**How to read these numbers** (the harness plays the exact engine the app does — verified ply-for-ply, see \`docs/revenge-parity.md\` — but it skips five app-side rules):`);
  L.push('');
  L.push(`1. **Free offers are not skippable in the app.** On L1, L3, L6 and L9 a real player MUST take a card before moving; the harness dismisses it. So the "none" and single-ability cells on those levels UNDERSTATE a real player's kit — the random-pick full runs are the honest number there.`);
  L.push(`2. **Retries.** The app gives Rookie unlimited, Normal 3, Hard 1, Nightmare 0 retries per level, each with a fresh start file and seed. Every full-run clear rate here is a LOWER bound on what a player with retries sees.`);
  L.push(`3. **Offer pool.** The app rolls only the player's unlocked abilities (a new player has Knight Hop, Surge and Freeze Ray; Drones is retired). The harness draws from all ${input.runs[0] ? input.runs[0].realistic.cells.filter((c) => c.loadout !== 'none').length : 18} — so full-run pick mixes are wider than a new player's.`);
  L.push(`4. **Default difficulty.** A fresh profile plays Rookie; the main table is Normal. The four modes are swept explicitly above — read the Rookie row for the new-player experience.`);
  L.push(`5. **"Out of moves" vs "No way through".** The app's solver ends a proven-dead level early; the harness plays on to the move limit. Same loss, two labels — counted together as m.`);
  if (input.caveats.length) {
    L.push('');
    L.push(`Caveats tonight:`);
    for (const c of input.caveats) L.push(`- ${c}`);
  }
  L.push('');
  L.push(`Reproduce: \`npx tsx scripts/run-playtest/revenge-nightly.ts\` (add \`--quick\` for a 2-minute smoke). Raw JSON: \`data/run-playtest/revenge/raw/${input.date}/\`.`);
  L.push('');
  return L.join('\n');
}

/** Per-level clear % for the new player on Normal and Rookie (and the veteran on Normal). */
function playerLevelTable(r: RunReport): string {
  const sn = r.players.starterNormal;
  const sr = r.players.starterRookie;
  const vn = r.players.veteranNormal;
  if (!sn && !sr) return 'New-player simulation did not run for this run.';
  const lines: string[] = [];
  lines.push(`| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |`);
  lines.push(`|---|---|---|---|---|---|`);
  for (let lv = 1; lv <= r.levelCount; lv++) {
    const a = sn?.rows.find((x) => x.level === lv);
    const b = sr?.rows.find((x) => x.level === lv);
    const c = vn?.rows.find((x) => x.level === lv);
    lines.push(`| ${lv} | ${a ? `${pct(a.clearRate)} (${a.cleared}/${a.reached})` : '-'} | ${sn?.deathsAt?.[lv] ?? 0} | ${b ? `${pct(b.clearRate)} (${b.cleared}/${b.reached})` : '-'} | ${sr?.deathsAt?.[lv] ?? 0} | ${c ? pct(c.clearRate) : '-'} |`);
  }
  lines.push('');
  lines.push(`"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.`);
  return lines.join('\n');
}

/** Ability tier list for one run — S ≥95, A ≥85, B ≥70, C ≥50, D below, over the contested levels. */
function tierTable(r: RunReport): string {
  const { rows, contestedLevels } = abilityTierList(r.realistic.cells);
  if (!rows.length) return 'No ability cells in this matrix.';
  const lines: string[] = [];
  lines.push(`Ability tier list, realistic tiers, scored over the ${contestedLevels.length} level${contestedLevels.length === 1 ? '' : 's'} where no-ability is under 100% (L${contestedLevels.join(', L')}). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.`);
  lines.push('');
  lines.push(`| Tier | Ability | Avg win | Lift | Worst level | Cast rate |`);
  lines.push(`|---|---|---|---|---|---|`);
  for (const t of rows) {
    lines.push(`| ${t.tier} | ${t.loadout}${t.neverCast ? ' †' : ''} | ${t.avgWin}% | ${signed(t.lift)} | L${t.worstLevel.level} ${t.worstLevel.pct}% | ${Math.round(t.castRate * 100)}% |`);
  }
  const never = rows.filter((t) => t.neverCast);
  if (never.length) {
    lines.push('');
    lines.push(`† ${never.map((t) => t.loadout).join(', ')}: bot never casts this (cast rate under 10%) — floor, not a verdict.`);
  }
  return lines.join('\n');
}

function labelOf(input: DigestInput, key: string): string {
  return input.correlationsNone.find((c) => c.feature === key)?.label ?? key;
}

function describe(e: ExperimentResult): string {
  const m = e.mutation;
  switch (m.kind) {
    case 'move-limit': return `budget ${m.delta > 0 ? '+' : ''}${m.delta}`;
    case 'remove-piece': return `remove ${m.piece} ${m.square}`;
    case 'add-pawn': return `add pawn ${m.square}`;
    case 'add-hunter': return `add ${m.piece} ${m.square}`;
  }
}

function solveCode(s: SolveResult): string {
  return s.verdict === 'forced-win' ? `W${s.depth}` : s.verdict === 'unknown' ? `?${s.depth}` : `no${s.depth}`;
}

function solverCellFor(solver: SolveResult[], level: number): string {
  const none = solver.find((s) => s.level === level && s.loadout === 'none');
  if (!none) return '-';
  const fins = solver.filter((s) => s.level === level && FINISHERS.includes(s.loadout));
  const proven = fins.filter((s) => s.verdict === 'forced-win').length;
  return `none ${solveCode(none)}, ${proven}/${fins.length} finishers proven`;
}

function matrixTable(cells: Cell[]): string {
  const levels = [...new Set(cells.map((c) => c.level))].sort((a, b) => a - b);
  const loadouts = [...new Set(cells.map((c) => c.loadout))];
  const ordered = ['none', ...loadouts.filter((l) => l !== 'none')];
  const lines: string[] = [];
  lines.push(`| L | ${ordered.join(' | ')} |`);
  lines.push(`|---|${ordered.map(() => '---').join('|')}|`);
  for (const lv of levels) {
    const row = ordered.map((lo) => {
      const c = cells.find((x) => x.level === lv && x.loadout === lo);
      if (!c) return '-';
      const p = winPct(c);
      const s = c.stall ? ` s${c.stall}` : '';
      return p < FINISHER_FLOOR_MIN && FINISHERS.includes(lo) ? `**${p}%**${s}` : `${p}%${s}`;
    });
    lines.push(`| ${lv} | ${row.join(' | ')} |`);
  }
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Slack summary (≤ 25 lines)

/** "## Content pipeline" — what exists, what is waiting on Tyler, what just shipped. */
export function renderPipelineSection(p: PipelineSummary): string[] {
  const L: string[] = [];
  const label = (i: ContentItem) => `${i.name} (\`${i.id}\`, ${i.kind})`;
  L.push(`Registry: \`data/content/pipeline.json\` · approve with \`npx tsx scripts/pipeline.ts approve <id>\` (or tell Claude "approve <name>"). Only approved|live content reaches players; testing content stays behind \`?run=\` / \`?loadout=\`.`);
  L.push('');
  L.push(`| Stage | idea | built | testing | approved | live | retired |`);
  L.push(`|---|---|---|---|---|---|---|`);
  L.push(`| Count | ${p.counts.idea} | ${p.counts.built} | ${p.counts.testing} | ${p.counts.approved} | ${p.counts.live} | ${p.counts.retired} |`);
  L.push('');
  L.push(`**Waiting on Tyler (${p.waiting.length})** — READY first:`);
  L.push('');
  if (!p.waiting.length) L.push('- nothing in testing.');
  for (const i of p.waiting) {
    const t = i.testing;
    if (!t) L.push(`- ${label(i)} — not graded yet.`);
    else if (t.verdict === 'READY') L.push(`- **READY** ${label(i)} — ${t.summary} (${t.lastRun})`);
    else L.push(`- HOLD ${label(i)} — ${shortReason(i, 160)} (${t.lastRun})`);
  }
  if (p.approvedNotLive.length) {
    L.push('');
    L.push(`**Approved, not yet live (${p.approvedNotLive.length}):** ${p.approvedNotLive.map(label).join(', ')} — goes live at the next nightly after deploy (or \`pipeline.ts mark-live\`).`);
  }
  L.push('');
  L.push(`**Went live in the last 7 days (${p.wentLive.length}):** ${p.wentLive.length ? p.wentLive.map((i) => `${label(i)} ${i.live?.at}`).join(', ') : 'none'}`);
  L.push('');
  L.push(`**Idea backlog (${p.ideas.length}):** ${p.ideas.length ? p.ideas.map((i) => `${i.name} — ${i.notes}`).join(' · ') : 'empty'}`);
  return L;
}

/** Two Slack lines, max. */
export function renderPipelineSlack(p: PipelineSummary): string[] {
  const ready = p.waiting.filter((i) => i.testing?.verdict === 'READY').map((i) => i.id);
  const hold = p.waiting.filter((i) => i.testing?.verdict !== 'READY').map((i) => i.id);
  const L = [
    `Pipeline: testing ${p.counts.testing} (READY: ${ready.join(', ') || 'none'} · HOLD: ${hold.join(', ') || 'none'}) · approved ${p.counts.approved} · live ${p.counts.live} · ideas ${p.counts.idea}`,
  ];
  if (p.wentLive.length || p.approvedNotLive.length) {
    L.push(`  went live 7d: ${p.wentLive.map((i) => i.id).join(', ') || 'none'}${p.approvedNotLive.length ? ` · approved, awaiting deploy: ${p.approvedNotLive.map((i) => i.id).join(', ')}` : ''}`);
  }
  return L;
}

export function renderSlack(input: DigestInput): string {
  const L: string[] = [];
  L.push(`Rookie's Revenge nightly — ${input.date}${input.quick ? ' (quick)' : ''} · ${(input.wallSeconds / 60).toFixed(0)} min`);
  for (const r of input.runs) for (const i of r.verdict.impossible) L.push(`IMPOSSIBLE: ${r.runId} ${describeImpossible(i)}`);
  for (const r of input.runs.filter((x) => !x.candidate)) {
    const d = difficultyCall(r.players);
    const carry = powersCarry(r.realistic.summary, r.realistic.cells);
    const weak = r.realistic.summary.filter((s) => s.finisherFloor < FINISHER_FLOOR_MIN);
    const stalls = r.realistic.summary.reduce((n, s) => n + s.stalls, 0);
    L.push(`${r.runId}: new player clears ${pct(d.normal)} Normal / ${pct(d.rookie)} Rookie — ${callWord(d.call, d.normal)} · veteran ${pct(clearPct(r.players.veteranNormal))} / ${pct(clearPct(r.players.veteranRookie))} · powers ${signed(carry.lift)} pts (none ${carry.none}%) · ${weak.length ? `weak finisher: ${weak.map((x) => `${x.worstFinisher.id} ${x.worstFinisher.pct}% L${x.level}`).join(', ')}` : 'finishers ok'} · stalls ${stalls}`);
  }
  for (const r of input.runs) {
    const { rows } = abilityTierList(r.realistic.cells);
    const fmt = (t: (typeof rows)[number]) => `${t.tier} ${t.loadout} ${t.avgWin}%${t.neverCast ? '†' : ''}`;
    const top = rows.slice(0, 5).map(fmt).join(', ');
    const bottom = rows.length > 5 ? rows.slice(-3).map(fmt).join(', ') : '';
    L.push(`${r.runId}${r.candidate ? ' (cand)' : ''} tiers · top: ${top}${bottom ? ` · bottom: ${bottom}` : ''}`);
  }
  if (input.runs.some((r) => abilityTierList(r.realistic.cells).rows.some((t) => t.neverCast))) L.push('† = bot never casts it (floor, not a verdict)');
  if (input.diff.previousDate) {
    if (input.diff.movers.length || input.diff.newStalls.length || input.diff.bandExits.length) {
      L.push(`Movers vs ${input.diff.previousDate}:`);
      for (const m of input.diff.movers.slice(0, 6)) L.push(`  L${m.level} ${m.loadout} [${m.mode}] ${m.before}% -> ${m.after}% (${signed(m.delta)})`);
      for (const s of input.diff.newStalls.slice(0, 3)) L.push(`  NEW STALL L${s.level} ${s.loadout} [${s.mode}] x${s.stall}`);
      for (const b of input.diff.bandExits.slice(0, 3)) L.push(`  L${b.level} left band: ${b.before}% -> ${b.after}% (${b.note})`);
    } else {
      L.push(`Vs ${input.diff.previousDate}: no movers >15pts, no new stalls, no band exits.`);
    }
  } else {
    L.push('No previous night to compare — baseline.');
  }
  if (input.experiments.length) {
    L.push(`Experiments: ${input.experiments.map((e) => `L${e.level} ${describe(e)} ${e.baselinePct}->${e.actualPct}% (pred ${e.predictedPct}, ${e.verdict})`).join(' · ')}`);
  }
  if (input.hypotheses.length) {
    L.push('Tonight\'s hypotheses:');
    for (const h of input.hypotheses.slice(0, 3)) L.push(`  - ${h.text}`);
  }
  const cands = input.runs.filter((x) => x.candidate);
  if (cands.length) {
    L.push('Candidates:');
    for (const r of cands.slice(0, 5)) {
      const d = difficultyCall(r.players);
      L.push(`  ${r.runId}: ${r.verdict.recommendation.toUpperCase()} — new player ${pct(d.normal)} Normal / ${pct(d.rookie)} Rookie${r.verdict.reasons.length ? `; ${r.verdict.reasons[0]}${r.verdict.reasons.length > 1 ? ` (+${r.verdict.reasons.length - 1} more)` : ''}` : ''}`);
    }
  } else {
    L.push('Candidates: none in queue.');
  }
  if (input.humans?.byRun.some((r) => r.traces > 0)) {
    const h = input.humans.byRun.find((r) => r.traces > 0)!;
    L.push(`Humans: ${h.traces} runs on ${h.runId}, ${h.wins} won.`);
  }
  if (input.pipeline) L.push(...renderPipelineSlack(input.pipeline));
  L.push(`Full report: data/run-playtest/revenge/digests/${input.date}.md`);
  // Cap at 25 lines but never drop the pipeline + report-path tail.
  const tail = input.pipeline ? renderPipelineSlack(input.pipeline).length + 1 : 1;
  return (L.length <= 25 ? L : [...L.slice(0, 25 - tail), ...L.slice(-tail)]).join('\n');
}
