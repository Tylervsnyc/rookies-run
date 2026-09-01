/**
 * Server-only snapshot for /admin/content. Reads the content registry FRESH
 * from disk (falls back to the build-time import on a read-only host), joins
 * it with the code catalogs (abilities, runs, achievements, starter kit),
 * the art / sound files on disk, and last night's digest. Everything
 * returned is plain JSON so the page can hand it to a client component.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { ABILITY_DEFS, ALL_ABILITY_IDS, blurbDetailForTier, type AbilityId, type AbilityTier } from '@/lib/run/abilities';
import { ACHIEVEMENTS } from '@/lib/run/achievements';
import { STARTER_KIT_CATALOG } from '@/lib/run/profile';
import { getRunById, isKnownRunId } from '@/lib/run/runs';
import type { Coord, EnemyPiece, RunPuzzle } from '@/lib/run/types';
import { REGISTRY, STAGES, summarize, type ContentItem, type ContentStage, type Registry } from '@/lib/content/pipeline';
import { loadRegistry } from '@/lib/content/pipeline-io';

// ─────────────────────────────────────────────────────────────────────────────
// Types handed to the client

export interface TierBlurb {
  tier: AbilityTier;
  what: string;
  how: string;
  limit: string;
}

export interface BotAbilityLine {
  runId: string;
  tier: string;
  avgWin: string;
  lift: string;
  worst: string;
  castRate: string;
}

export interface AbilityView {
  id: string;
  name: string;
  stage: ContentStage | 'unregistered';
  hasCode: boolean;
  description: string;
  typeLine: string;
  activation: string;
  tiers: TierBlurb[];
  artFile: string | null;
  artPlaceholder: boolean;
  inStarterKit: boolean;
  unlockedBy: { id: string; name: string } | null;
  item: ContentItem | null;
  bot: BotAbilityLine | null;
  playUrl: string | null;
}

export interface MiniPiece {
  type: EnemyPiece['type'];
  file: number;
  rank: number;
}

export interface LevelView {
  level: number;
  theme: string | null;
  rookieStart: Coord;
  pieces: MiniPiece[];
  hazards: Coord[];
  kingPen: string[];
  moveLimit: number | null;
  winCondition: string;
  kingBehavior: string | null;
  enemiesPerTurn: number;
  playUrl: string;
  /** From the digest — no-ability win % on Normal, realistic tiers. */
  noAbility: string | null;
  /** From the digest — new player (3 starters) clear % on Normal. */
  newPlayer: string | null;
}

export interface RunView {
  id: string;
  name: string;
  blurb: string;
  stage: ContentStage | 'unregistered';
  hasCode: boolean;
  item: ContentItem | null;
  levels: LevelView[];
  digestVerdict: string | null;
  playUrl: string;
}

export interface ArtAsset {
  file: string;
  abilityId: string;
  variant: number;
  bytes: number;
  usedBy: string | null;
  orphan: boolean;
  placeholder: boolean;
}

export interface SoundAsset {
  file: string;
  bytes: number;
}

export interface ContentSnapshot {
  generatedAt: string;
  /** Registry read fresh from disk, or the build-time copy if that failed. */
  registrySource: 'disk' | 'build';
  /** Can the API write pipeline.json on this host? */
  writable: boolean;
  writeHint: string;
  counts: Record<ContentStage, number>;
  waitingOnYou: number;
  lastNightly: string | null;
  digestPath: string | null;
  abilities: AbilityView[];
  runs: RunView[];
  art: ArtAsset[];
  sounds: SoundAsset[];
  missingArt: string[];
  ideas: ContentItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Art mapping — mirrors `artFile()` in components/run/AbilityCard.tsx (that
// file is 'use client', so the mapping is duplicated here for the server).

const ART_OVERRIDES: Record<string, string> = {
  'poison-dart': 'poison-dart-2.webp',
  'rabies-dart': 'rabies-dart-2.webp',
  'freeze-ray': 'freeze-ray-2.webp',
  'become-king': 'become-king-2.webp',
};
function artFileFor(id: string): string {
  return ART_OVERRIDES[id] ?? `${id}-1.webp`;
}
/** Art known to be a stop-gap (hue-shifted copy of another card). */
const PLACEHOLDER_ART = new Set([
  'summon-knight-1.webp',
  // Controllable-summon family (2026-09-01) — no art yet.
  'bishop-squire-1.webp',
  'page-1.webp',
  'twin-1.webp',
  'duchess-1.webp',
  'vanguard-1.webp',
  'swap-1.webp',
  'sacrifice-1.webp',
  'knighting-1.webp',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Registry + write mode

export function isReadOnlyHost(): boolean {
  return !!process.env.VERCEL;
}

export function canWriteRegistry(token?: string | null): { ok: boolean; status: number; message: string } {
  if (isReadOnlyHost()) {
    return { ok: false, status: 501, message: 'Read-only host: approve locally (npm run dev or scripts/pipeline.ts), then commit data/content/pipeline.json.' };
  }
  if (process.env.NODE_ENV !== 'production') return { ok: true, status: 200, message: 'ok' };
  const expected = process.env.ADMIN_TOKEN;
  if (expected && token && token === expected) return { ok: true, status: 200, message: 'ok' };
  return { ok: false, status: 403, message: 'Forbidden: production writes need an x-admin-token header matching ADMIN_TOKEN.' };
}

function readRegistry(): { reg: Registry; source: 'disk' | 'build' } {
  try {
    return { reg: loadRegistry(), source: 'disk' };
  } catch {
    return { reg: REGISTRY, source: 'build' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Digest parsing

interface DigestData {
  date: string | null;
  path: string | null;
  /** runId → level → no-ability % (Normal, realistic tiers). */
  noAbility: Record<string, Record<number, string>>;
  /** runId → level → new-player Normal clear %. */
  newPlayer: Record<string, Record<number, string>>;
  /** runId → abilityId → tier line. */
  abilityTiers: Record<string, Record<string, BotAbilityLine>>;
  /** runId → verdict line. */
  verdicts: Record<string, string>;
}

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

function pct(cell: string): string {
  const m = cell.match(/(\d+)%/);
  return m ? `${m[1]}%` : cell;
}

function parseDigest(): DigestData {
  const out: DigestData = { date: null, path: null, noAbility: {}, newPlayer: {}, abilityTiers: {}, verdicts: {} };
  const rel = join('data', 'run-playtest', 'revenge', 'digests', 'latest.md');
  const abs = join(process.cwd(), rel);
  let text: string;
  try {
    text = readFileSync(abs, 'utf8');
  } catch {
    return out;
  }
  out.path = rel;
  const lines = text.split('\n');
  let runId: string | null = null;
  let header: string[] | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const date = line.match(/\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})/);
    if (date) out.date = date[1];
    const overview = line.match(/^\*\*[^*]+\*\* \(`([a-z0-9-]+)`/);
    const section = line.match(/^## [^(]+\(`([a-z0-9-]+)`\)/);
    if (overview || section) {
      runId = (overview ?? section)![1];
      header = null;
      continue;
    }
    if (/^## /.test(line)) {
      runId = null;
      header = null;
      continue;
    }
    if (runId && line.startsWith('**Verdict:**')) {
      const v = line.replace('**Verdict:**', '').trim();
      const next = lines[i + 1]?.trim();
      out.verdicts[runId] = next && next.startsWith('- ') ? `${v} — ${next.slice(2)}` : v;
      continue;
    }
    if (!line.startsWith('|')) {
      header = null;
      continue;
    }
    const row = cells(line);
    if (row.every((c) => /^-+$/.test(c))) continue; // the |---| rule
    if (!header) {
      header = row;
      continue;
    }
    if (!runId) continue;
    if (header[0] === 'L' && /^New player, Normal/.test(header[1] ?? '')) {
      const lvl = Number(row[0]);
      if (lvl) (out.newPlayer[runId] ??= {})[lvl] = pct(row[1] ?? '');
    } else if (header[0] === 'L' && header[1] === 'Band') {
      const lvl = Number(row[0]);
      if (lvl) (out.noAbility[runId] ??= {})[lvl] = pct(row[2] ?? '');
    } else if (header[0] === 'Tier' && header[1] === 'Ability') {
      const id = (row[1] ?? '').replace(/\s*†.*$/, '').trim();
      if (id) {
        (out.abilityTiers[runId] ??= {})[id] = {
          runId,
          tier: row[0] ?? '',
          avgWin: row[2] ?? '',
          lift: row[3] ?? '',
          worst: row[4] ?? '',
          castRate: row[5] ?? '',
        };
      }
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Level theme names — parsed from the `// L3 — CLOCK TOWER. ...` comments in
// lib/run/runs.ts. Best effort; null when the source is not on disk.

function parseLevelThemes(): Record<string, Record<number, string>> {
  const out: Record<string, Record<number, string>> = {};
  let src: string;
  try {
    src = readFileSync(join(process.cwd(), 'lib', 'run', 'runs.ts'), 'utf8');
  } catch {
    return out;
  }
  const blocks = src.split(/^const RUN_[A-Z0-9_]+: RunDef = \{/m).slice(1);
  for (const block of blocks) {
    const id = block.match(/^\s*id: '([^']+)'/m)?.[1];
    if (!id) continue;
    const themes: Record<number, string> = {};
    for (const m of block.matchAll(/^\s*\/\/ L(\d+) — ([^\n]+)/gm)) {
      const lvl = Number(m[1]);
      let name = m[2].split(/[.(:]/)[0].trim();
      if (name.length > 34) name = name.slice(0, 33) + '…';
      if (name) themes[lvl] = name;
    }
    out[id] = themes;
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Builders

const ALL_TIERS: AbilityTier[] = [1, 2, 3, 4, 5];

function abilityViews(reg: Registry, digest: DigestData, artOnDisk: Set<string>): AbilityView[] {
  const unlockBy = new Map<string, { id: string; name: string }>();
  for (const a of ACHIEVEMENTS) if (a.unlocks && !unlockBy.has(a.unlocks)) unlockBy.set(a.unlocks, { id: a.id, name: a.name });
  const codeIds = new Set<string>(ALL_ABILITY_IDS);
  const ids = [...ALL_ABILITY_IDS, ...reg.items.filter((i) => i.kind === 'ability' && !codeIds.has(i.id)).map((i) => i.id)];
  // Bot line: prefer the live daily run, else any run that graded it.
  const botFor = (id: string): BotAbilityLine | null => {
    const runs = ['revenge-1', ...Object.keys(digest.abilityTiers)];
    for (const r of runs) {
      const line = digest.abilityTiers[r]?.[id];
      if (line) return line;
    }
    return null;
  };
  return ids.map((id) => {
    const item = reg.items.find((i) => i.id === id && i.kind === 'ability') ?? null;
    const hasCode = codeIds.has(id);
    const def = hasCode ? ABILITY_DEFS[id as AbilityId] : null;
    const file = hasCode ? artFileFor(id) : null;
    const artFile = file && artOnDisk.has(file) ? file : null;
    return {
      id,
      name: def?.name ?? item?.name ?? id,
      stage: item?.stage ?? 'unregistered',
      hasCode,
      description: def?.description ?? item?.notes ?? '',
      typeLine: def?.typeLine ?? '',
      activation: def?.activation ?? '',
      tiers: hasCode
        ? ALL_TIERS.map((t) => {
            const b = blurbDetailForTier(id as AbilityId, t);
            return { tier: t, what: b.what, how: b.how, limit: b.limit };
          })
        : [],
      artFile,
      artPlaceholder: !!artFile && PLACEHOLDER_ART.has(artFile),
      inStarterKit: (STARTER_KIT_CATALOG as ReadonlyArray<string>).includes(id),
      unlockedBy: unlockBy.get(id) ?? null,
      item,
      bot: botFor(id),
      playUrl: hasCode ? `/?run=revenge-3&level=1&parity=1&loadout=${id}:5` : null,
    };
  });
}

function levelView(runId: string, p: RunPuzzle, theme: string | null, digest: DigestData): LevelView {
  return {
    level: p.level,
    theme,
    rookieStart: p.rookieStart,
    pieces: p.pieces.map((e) => ({ type: e.type, file: e.file, rank: e.rank })),
    hazards: p.hazards ?? [],
    kingPen: p.kingPen ?? [],
    moveLimit: p.moveLimit ?? null,
    winCondition: p.winCondition ?? 'rank8',
    kingBehavior: p.kingBehavior ?? null,
    enemiesPerTurn: p.enemiesPerTurn ?? 1,
    playUrl: `/?run=${runId}&level=${p.level}`,
    noAbility: digest.noAbility[runId]?.[p.level] ?? null,
    newPlayer: digest.newPlayer[runId]?.[p.level] ?? null,
  };
}

function runViews(reg: Registry, digest: DigestData): RunView[] {
  const themes = parseLevelThemes();
  const ids = [...reg.items.filter((i) => i.kind === 'run').map((i) => i.id)];
  if (!ids.includes('ability-lab')) ids.push('ability-lab');
  // Every level is built with the designed start file 1; the app randomises
  // the file on the same rank at play time.
  const start: Coord = { file: 1, rank: 1 };
  return ids.map((id) => {
    const item = reg.items.find((i) => i.id === id && i.kind === 'run') ?? null;
    const hasCode = isKnownRunId(id);
    const def = hasCode ? getRunById(id) : null;
    const levels: LevelView[] = def
      ? def.levels.map((b, i) => {
          const p = b(start);
          return levelView(id, p, themes[id]?.[p.level] ?? themes[id]?.[i + 1] ?? null, digest);
        })
      : [];
    return {
      id,
      name: def?.name ?? item?.name ?? id,
      blurb: def?.blurb ?? item?.notes ?? '',
      stage: item?.stage ?? 'unregistered',
      hasCode,
      item,
      levels,
      digestVerdict: digest.verdicts[id] ?? null,
      playUrl: `/?run=${id}`,
    };
  });
}

function listDir(rel: string, ext: string): { file: string; bytes: number }[] {
  const dir = join(process.cwd(), 'public', rel);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((f) => ({ file: f, bytes: statSync(join(dir, f)).size }));
}

function artAssets(abilities: AbilityView[]): ArtAsset[] {
  const codeIds = new Set<string>(ALL_ABILITY_IDS);
  const used = new Map<string, string>();
  for (const a of abilities) if (a.artFile) used.set(a.artFile, a.id);
  return listDir('abilities', '.webp').map(({ file, bytes }) => {
    const m = file.match(/^(.*)-(\d+)\.webp$/);
    const abilityId = m ? m[1] : file.replace('.webp', '');
    return {
      file,
      abilityId,
      variant: m ? Number(m[2]) : 1,
      bytes,
      usedBy: used.get(file) ?? null,
      orphan: !codeIds.has(abilityId),
      placeholder: PLACEHOLDER_ART.has(file),
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────

export function buildContentSnapshot(): ContentSnapshot {
  const { reg, source } = readRegistry();
  const digest = parseDigest();
  const artOnDisk = new Set(listDir('abilities', '.webp').map((a) => a.file));
  const abilities = abilityViews(reg, digest, artOnDisk);
  const runs = runViews(reg, digest);
  const art = artAssets(abilities);
  const sounds = listDir('sounds', '.mp3');
  const summary = summarize(reg);
  const write = canWriteRegistry(null);
  const counts = Object.fromEntries(STAGES.map((s) => [s, summary.counts[s]])) as Record<ContentStage, number>;
  const lastNightly =
    digest.date ??
    reg.items
      .map((i) => i.testing?.lastRun)
      .filter((d): d is string => !!d)
      .sort()
      .pop() ??
    null;
  return {
    generatedAt: new Date().toISOString(),
    registrySource: source,
    writable: write.ok,
    writeHint: write.ok ? 'Writes go to data/content/pipeline.json on this machine. Commit it when you are done.' : write.message,
    counts,
    waitingOnYou: summary.waiting.length,
    lastNightly,
    digestPath: digest.path,
    abilities,
    runs,
    art,
    sounds,
    missingArt: abilities.filter((a) => a.hasCode && !a.artFile && a.stage !== 'retired').map((a) => a.id),
    ideas: summary.ideas,
  };
}
