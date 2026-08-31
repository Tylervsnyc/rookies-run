/**
 * Nightly → content pipeline bridge. After the harness grades every run,
 * write each tested run's / ability's verdict into
 * data/content/pipeline.json (the `testing` block), flip anything approved
 * that is reachable by players to `live`, and hand back a summary the digest
 * and Slack line render as "## Content pipeline".
 */

import { recordTest, stageOf, summarize, type PipelineSummary, type Registry, type TestVerdict } from '../../lib/content/pipeline';
import { loadRegistry, saveRegistry, syncLive } from '../../lib/content/pipeline-io';
import { abilityTierList, clearPct, difficultyCall } from './revenge-analysis';
import type { RunReport } from './revenge-digest';

export interface PipelineUpdate {
  summary: PipelineSummary;
  /** ids whose testing block was (re)written tonight */
  graded: string[];
  /** approved → live tonight */
  wentLive: string[];
}

const pct = (n: number | null) => (n === null ? '-' : `${Math.round(n)}%`);

/** Runs: the harness verdict maps 1:1 — promote = READY, hold = HOLD. */
function runBlock(r: RunReport, date: string, digestPath: string) {
  const d = difficultyCall(r.players);
  const verdict: TestVerdict = r.verdict.recommendation === 'promote' ? 'READY' : 'HOLD';
  const summary = r.verdict.reasons.length
    ? r.verdict.reasons.join('; ')
    : `meets every bar — new player clears ${pct(d.normal)} on Normal / ${pct(d.rookie)} on Rookie, veteran ${pct(clearPct(r.players.veteranNormal))}, finisher floor met, zero stalls`;
  return { lastRun: date, verdict, summary, digestPath };
}

/**
 * Abilities: graded from the realistic-tier matrix across every run swept
 * tonight. READY when the bot actually casts it and it lifts the win rate
 * over no-ability; HOLD otherwise. (A bot floor, not a fun verdict — Tyler's
 * hands decide the rest.)
 */
function abilityBlock(id: string, reports: RunReport[], date: string, digestPath: string) {
  const rows = reports
    .map((r) => ({ runId: r.runId, row: abilityTierList(r.realistic.cells).rows.find((t) => t.loadout === id) }))
    .filter((x): x is { runId: string; row: NonNullable<typeof x.row> } => !!x.row);
  if (!rows.length) return null;
  const avgWin = Math.round(rows.reduce((n, x) => n + x.row.avgWin, 0) / rows.length);
  const lift = Math.round(rows.reduce((n, x) => n + x.row.lift, 0) / rows.length);
  const cast = Math.round((rows.reduce((n, x) => n + x.row.castRate, 0) / rows.length) * 100);
  const neverCast = rows.every((x) => x.row.neverCast);
  const tiers = rows.map((x) => `${x.row.tier} on ${x.runId}`).join(', ');
  const reasons: string[] = [];
  if (neverCast) reasons.push(`bot never casts it (${cast}% of games) — no read on power`);
  else if (lift < 0) reasons.push(`hurts more than it helps — ${lift} pts vs no ability`);
  const verdict: TestVerdict = reasons.length ? 'HOLD' : 'READY';
  const summary = `${reasons.length ? reasons.join('; ') + '. ' : ''}Tier ${tiers}; avg win ${avgWin}% at realistic tiers (lift ${lift >= 0 ? '+' : ''}${lift} vs no ability), cast in ${cast}% of games`;
  return { lastRun: date, verdict, summary, digestPath };
}

export function updatePipelineFromReports(reports: RunReport[], date: string, digestPath: string): PipelineUpdate {
  let reg: Registry = loadRegistry();
  const graded: string[] = [];

  const live = syncLive(reg, date);
  reg = live.reg;

  for (const r of reports) {
    const st = stageOf(r.runId, reg);
    if (!st || st === 'idea' || st === 'retired') continue;
    reg = recordTest(reg, r.runId, runBlock(r, date, digestPath));
    graded.push(r.runId);
  }

  for (const item of reg.items) {
    if (item.kind !== 'ability' || item.stage !== 'testing') continue;
    const block = abilityBlock(item.id, reports, date, digestPath);
    if (!block) continue;
    reg = recordTest(reg, item.id, block);
    graded.push(item.id);
  }

  saveRegistry(reg);
  return { summary: summarize(reg, date), graded, wentLive: live.flipped };
}

/** Read-only summary (e.g. --render-only), no writes. */
export function readPipelineSummary(date: string): PipelineSummary {
  return summarize(loadRegistry(), date);
}
