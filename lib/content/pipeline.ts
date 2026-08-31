/**
 * Rookie's Revenge — content pipeline registry.
 *
 * ONE record per ability id and per run id, in `data/content/pipeline.json`,
 * moving through: idea → built → testing → approved → live (+ retired).
 *
 * This module is PURE (no fs) so it can be imported by app code at build
 * time — `lib/run/runs.ts` and `lib/run/profile.ts` read it to decide what
 * real players can see. Only `approved` and `live` content is player-facing;
 * `testing` content stays reachable through the dev hooks (`?run=`,
 * `?loadout=`). Scripts that need to WRITE the registry use
 * `lib/content/pipeline-io.ts`.
 */

import registry from '../../data/content/pipeline.json';

export type ContentKind = 'ability' | 'run';
export type ContentStage = 'idea' | 'built' | 'testing' | 'approved' | 'live' | 'retired';
export type TestVerdict = 'READY' | 'HOLD';

export const STAGES: ReadonlyArray<ContentStage> = ['idea', 'built', 'testing', 'approved', 'live', 'retired'];

export interface TestingBlock {
  /** YYYY-MM-DD of the last nightly that graded this item. */
  lastRun: string;
  verdict: TestVerdict;
  summary: string;
  digestPath: string;
}

export interface ContentItem {
  id: string;
  kind: ContentKind;
  name: string;
  stage: ContentStage;
  /** YYYY-MM-DD */
  created: string;
  notes: string;
  testing?: TestingBlock;
  approved?: { at: string; by: string };
  live?: { at: string };
  retired?: { at: string; why: string };
}

export interface Registry {
  version: 1;
  items: ContentItem[];
}

/** The registry as it was at build/import time. Scripts wanting fresh disk state use pipeline-io. */
export const REGISTRY: Registry = registry as Registry;

export function isStage(s: string): s is ContentStage {
  return (STAGES as ReadonlyArray<string>).includes(s);
}

export function findItem(id: string, reg: Registry = REGISTRY): ContentItem | undefined {
  return reg.items.find((i) => i.id === id);
}

/** Stage of an id; unknown ids are `undefined` (treat as not player-facing). */
export function stageOf(id: string, reg: Registry = REGISTRY): ContentStage | undefined {
  return findItem(id, reg)?.stage;
}

/** Real players can see it: approved or live. */
export function isPlayerFacing(id: string, reg: Registry = REGISTRY): boolean {
  const s = stageOf(id, reg);
  return s === 'approved' || s === 'live';
}

/** Exists in code and is worth grading nightly: testing, approved or live. */
export function isBuilt(id: string, reg: Registry = REGISTRY): boolean {
  const s = stageOf(id, reg);
  return s === 'testing' || s === 'approved' || s === 'live';
}

export function itemsOf(kind: ContentKind, reg: Registry = REGISTRY): ContentItem[] {
  return reg.items.filter((i) => i.kind === kind);
}

export function todayISO(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export interface AdvanceMeta {
  by?: string;
  why?: string;
  at?: string;
  notes?: string;
}

/**
 * Move an item to `stage`, stamping the matching block. Returns a NEW
 * registry (the input is not mutated). Throws on unknown ids or a stage that
 * has no meaning for that id (e.g. retiring an idea is fine; approving an
 * idea is not — it has to be built and tested first).
 */
export function advance(reg: Registry, id: string, stage: ContentStage, meta: AdvanceMeta = {}): Registry {
  const item = findItem(id, reg);
  if (!item) throw new Error(`pipeline: unknown id "${id}"`);
  const at = meta.at ?? todayISO();
  const next: ContentItem = { ...item, stage };
  if (meta.notes) next.notes = meta.notes;
  switch (stage) {
    case 'approved':
      if (item.stage !== 'testing' && item.stage !== 'built') {
        throw new Error(`pipeline: "${id}" is ${item.stage}; only built/testing content can be approved`);
      }
      next.approved = { at, by: meta.by ?? 'Tyler' };
      delete next.retired;
      break;
    case 'live':
      if (item.stage !== 'approved') throw new Error(`pipeline: "${id}" is ${item.stage}; only approved content goes live`);
      next.live = { at };
      break;
    case 'retired':
      next.retired = { at, why: meta.why ?? '' };
      break;
    case 'testing':
      if (item.stage === 'live' || item.stage === 'approved') {
        // Pulled back for another look — drop the sign-off so it is not player-facing.
        delete next.approved;
        delete next.live;
      }
      break;
    case 'built':
    case 'idea':
      delete next.approved;
      delete next.live;
      break;
  }
  return { ...reg, items: reg.items.map((i) => (i.id === id ? next : i)) };
}

/** Add a new record (idea by default). Throws if the id already exists. */
export function addItem(
  reg: Registry,
  input: { id: string; kind: ContentKind; name: string; notes?: string; stage?: ContentStage; created?: string },
): Registry {
  if (findItem(input.id, reg)) throw new Error(`pipeline: "${input.id}" already exists`);
  const item: ContentItem = {
    id: input.id,
    kind: input.kind,
    name: input.name,
    stage: input.stage ?? 'idea',
    created: input.created ?? todayISO(),
    notes: input.notes ?? '',
  };
  return { ...reg, items: [...reg.items, item] };
}

/** Record a nightly verdict on an item (any stage — the block is informational). */
export function recordTest(reg: Registry, id: string, block: TestingBlock): Registry {
  const item = findItem(id, reg);
  if (!item) return reg;
  return { ...reg, items: reg.items.map((i) => (i.id === id ? { ...i, testing: block } : i)) };
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary — shared by the nightly digest, its Slack line, and the CLI.

export interface PipelineSummary {
  counts: Record<ContentStage, number>;
  /** stage=testing, READY first, then HOLD, then ungraded. */
  waiting: ContentItem[];
  /** Went live in the last `days` days. */
  wentLive: ContentItem[];
  ideas: ContentItem[];
  approvedNotLive: ContentItem[];
}

export function summarize(reg: Registry = REGISTRY, today = todayISO(), days = 7): PipelineSummary {
  const counts = Object.fromEntries(STAGES.map((s) => [s, 0])) as Record<ContentStage, number>;
  for (const i of reg.items) counts[i.stage]++;
  const rank = (i: ContentItem) => (i.testing?.verdict === 'READY' ? 0 : i.testing?.verdict === 'HOLD' ? 1 : 2);
  const waiting = reg.items.filter((i) => i.stage === 'testing').sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id));
  const cutoff = shiftDate(today, -days);
  const wentLive = reg.items.filter((i) => i.stage === 'live' && i.live && i.live.at >= cutoff && i.live.at <= today);
  const ideas = reg.items.filter((i) => i.stage === 'idea');
  const approvedNotLive = reg.items.filter((i) => i.stage === 'approved');
  return { counts, waiting, wentLive, ideas, approvedNotLive };
}

function shiftDate(yyyyMmDd: string, days: number): string {
  const d = new Date(yyyyMmDd + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** One-line reason for a HOLD, trimmed for tables and Slack. */
export function shortReason(item: ContentItem, max = 110): string {
  const s = item.testing?.summary ?? '';
  const first = s.split(';')[0].trim();
  return first.length > max ? first.slice(0, max - 1) + '…' : first;
}
