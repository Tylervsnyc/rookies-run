#!/usr/bin/env -S npx tsx
/**
 * Rookie's Revenge — COMBO-GATED LEVEL DISCOVERY HARNESS.
 *
 * Strategic premise (Tyler, 2026-09-05): the best thing in the game is a level
 * that CANNOT be solved by any single ability but falls cleanly to one PAIR.
 * The Moat (revenge-12) and The Colonnade (revenge-13) are built that way and
 * are Tyler's two favourite runs. 23 abilities are BUILT (253 pairs); hand-
 * authoring cannot cover that space, so this script is the search.
 *
 * ── THE HEADLINE FINDING (Pass A, 2026-09-05) ───────────────────────────────
 * The first version of this harness tested "no single ability out of all 23
 * solves it" and accepted 0 of 20 shipped levels — including the ones we know
 * are combo gates. The measurement was right and the definition was wrong:
 *
 *   Colonnade L10 — none 0%, boulder 0%, convert 0%, decoy 0%, freeze-ray 0%,
 *   magnet 0%, poison 0%, rabies 0%, smoke 0%, rewind 0%, aegis 0%, swap 0%,
 *   sacrifice 0% … but become-king 100%, bishop-step 100%, knight-hop 100%.
 *
 * **bishop-step, knight-hop and become-king are UNIVERSAL SOLVENTS.** They
 * change what Rookie's movement geometry IS (or make her uncapturable), so they
 * cross any terrain. A level whose difficulty is a terrain signature — a moat,
 * a colonnade, a pen — can essentially never be gated against the full 23. Big
 * summons (dragon, duchess, vanguard) behave the same way on many boards.
 *
 * The Colonnade IS gated — against **its own kit**. `runs.ts` gives it
 * `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every
 * card the player can ever hold in that run. So:
 *
 *   **Combo-gating is a property of (level, KIT), not of a level alone.**
 *
 * ── Definition (the primary gate — this is what ships) ──────────────────────
 * Given a 4-card KIT K, a level is combo-gated under K when:
 *   - no-ability wins <= --none-max                 (default 8%)
 *   - EVERY single card in K alone <= --single-max  (default 8%)
 *   - at least one PAIR drawn from K wins >= --pair-min (default 60%)
 * A level gated under MANY kits is more valuable, not less — it can ship in
 * several runs — so `kitsGating` is recorded on every entry. Within one kit,
 * fewer winning pairs is better (a unique answer is the ideal).
 *
 * BONUS TIER: a level that also survives every single ability in the whole game
 * is marked `pure: true`. Reported, never required — the solvent finding says
 * pure levels should be rare.
 *
 * ── The funnel (bot time is the entire cost, so discard early) ──────────────
 *   0. structural lint       — revenge-generate.ts's lintSpec, free.
 *   a. no-ability screen     — 1 cell; kill if it wins.
 *   b. solvent probe         — bishop-step / knight-hop / become-king alone.
 *      Pure metadata: a level all three solve is a pure-TERRAIN puzzle, which
 *      says those three should never share a kit with that terrain signature.
 *   c. kit singles           — every card appearing in any planned kit, in ONE
 *      batched round. Kit evaluation is then a pure lookup: a kit dies the
 *      moment one of its own cards solos the level, at zero extra bot time.
 *      Most candidates die here having paid nothing for pairs.
 *   d. pair sweep            — only the pairs of kits that survived (c),
 *      deduped across kits. Kits are planned from
 *      data/run-playtest/pair-hypotheses.json (ranked pairs + antiPairs to
 *      avoid), so this is never a brute-force 253.
 *   e. confirm at high trials — `.claude/run-level-design.md` warns a single
 *      matrix cell moves with worker ordering, so nothing is believed off a
 *      10-trial screen: the accept/reject call is always the high-trial
 *      re-read, and a cell is never split across workers.
 *
 * Screen thresholds are deliberately LOOSER than the accept thresholds
 * (--screen-kill 20% vs --single-max 8%): a loose screen avoids false kills on
 * noise, and everything that survives is re-measured strictly at stage (e).
 * Cards that scored 0 wins at screen are not re-measured — 0/10 is already
 * evidence enough for a <=8% claim.
 *
 * ── Output ─────────────────────────────────────────────────────────────────
 *   data/run-playtest/combo-library/<pair>/<id>.json  level def + paste-ready
 *       runs.ts snippet + the full measured matrix row + every kit it is gated
 *       under + which solvents crack it + slot + date
 *   data/run-playtest/combo-library/<pair>/INDEX.md   human index per pair
 *   data/run-playtest/combo-library/SYNERGY.md        which pairs produce gated
 *       levels, which never do, and the universal-solvent finding
 *   data/run-playtest/combo-library/_scans/<id>.json  --score-all: the full row
 *       for every subject, gated or not (ground truth on shipped levels)
 *   data/run-playtest/combo-library/_ledger.jsonl     resume ledger
 *
 * Resumable: a killed run resumes by skipping ledgered subjects. Parallel: the
 * cells of one subject shard across CPUs the way matrixParallel does, via this
 * file's own `--worker` mode (generated candidates are rebuilt deterministically
 * in the worker from the generator opts, since puzzle overrides cannot cross a
 * process boundary as CLI args).
 *
 * ── CLI ────────────────────────────────────────────────────────────────────
 *   # Ground truth on a shipped run, under its OWN kit (the validation case)
 *   npx tsx scripts/run-playtest/combo-discover.ts --run=revenge-13 --levels=1-10 --score-all
 *
 *   # Discovery over generated candidates
 *   npx tsx scripts/run-playtest/combo-discover.ts --from-generator \
 *       --slots=6-10 --variants=6 --max-kits=12
 *
 *   Flags:
 *     --from-terrain              generate TERRAIN candidates via
 *                                 combo-terrain.ts (checker / moat / vault /
 *                                 comb barrier families). This is the source
 *                                 that actually produces gates — see that
 *                                 file's header for why revenge-generate's
 *                                 density archetypes cannot.
 *     --families=a,b | all        terrain families (default all four)
 *     --from-generator            generate candidates via revenge-generate.ts
 *     --run=<id> --levels=1,2,3   score EXISTING levels of a shipped run. The
 *                                 run's own `allowedAbilities` is tested as kit
 *                                 #1 — that is the validation case.
 *     --slots=1-10 | 5,6,7        level slots to generate for (generator mode)
 *     --archetypes=a,b | all      generator archetypes (default all)
 *     --variants=N (2) --seed=N (0)
 *     --kit-size=N (4)            cards per kit, like runs.ts allowedAbilities
 *     --max-kits=N (12)           candidate kits per subject, hypothesis-ranked
 *     --pool=a,b,c                restrict the searched card pool
 *     --exclude=a,b | off | solvents
 *                                 cards kept out of the pool. Default: none —
 *                                 the solvents are measured as metadata, not
 *                                 hidden. `solvents` drops the 7 measured
 *                                 solo-solvers, leaving a 16-card pool.
 *     --score-all                 never discard; write a _scans row for every
 *                                 subject (use for shipped-run ground truth)
 *     --screen-trials=N (10) --pair-trials=N (10) --confirm-trials=N (30)
 *     --screen-kill=P (20) --none-max=P (8) --single-max=P (8) --pair-min=P (60)
 *     --tier=T5|T6 (T5)  --realistic (default on; --realistic=off pins T1)
 *     --pure-check                also measure all 23 singles on each hit, to
 *                                 flag the rare "pure" level (23 extra cells)
 *     --jobs=N  --limit=N  --minutes=N  --fresh  --out=dir
 *
 * Nothing here writes to lib/run — like generate-levels.ts this emits
 * out-of-tree candidates only. Paste a snippet into runs.ts by hand, then
 * confirm with `revenge.ts matrix --run=<id>` (the harness is the truth).
 */

import { spawn } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { RunPuzzle } from '../../lib/run/types';
import { getRunById } from '../../lib/run/runs';
import {
  ALL_LOADOUTS,
  defaultJobs,
  levelCountFor,
  puzzleFor,
  runMatrixCell,
  winPct,
  type Cell,
  type RevengeCfg,
} from './revenge-core';
import { buildCandidates, renderSnippet, type Candidate } from './revenge-generate';
import { buildTerrainCandidates, TERRAIN_FAMILIES, type TerrainCandidate, type TerrainOpts } from './combo-terrain';

// ─────────────────────────────────────────────────────────────────────────────
// Args

function arg(name: string, def?: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  if (process.argv.includes(`--${name}`)) return 'true';
  return def;
}
function num(name: string, def: number): number {
  const v = arg(name);
  const n = v === undefined ? NaN : parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
}
function flag(name: string): boolean {
  return arg(name) === 'true';
}

/** "1-10" / "1..10" / "5,6,7" / "all" → [1,2,…]. */
function parseRange(v: string | undefined, all: number[]): number[] {
  if (!v || v === 'all') return all;
  const out = new Set<number>();
  for (const part of v.split(',')) {
    const m = part.trim().match(/^(\d+)\s*(?:-|\.\.)\s*(\d+)$/);
    if (m) {
      for (let i = Number(m[1]); i <= Number(m[2]); i++) out.add(i);
    } else if (part.trim()) out.add(Number(part.trim()));
  }
  return [...out].filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
}

const ALL_ABILITIES: string[] = ALL_LOADOUTS.filter((x) => x !== 'none');

/**
 * The three cards that solve a level by changing what "terrain" means. Measured
 * on every candidate as METADATA (stage b), never as part of the gate — see the
 * headline finding at the top of this file.
 */
const SOLVENTS = ['bishop-step', 'knight-hop', 'become-king'];

/**
 * `--exclude=solvents` also drops the premium summons Pass A caught soloing the
 * late Colonnade / Moat levels. Leaves a 16-card, 120-pair pool that maps onto
 * a run declaring `allowedAbilities`.
 */
const SOLVENT_PRESET = [...SOLVENTS, 'queen-pulse', 'dragon', 'duchess', 'vanguard'];

const EXCLUDED: Set<string> = (() => {
  const v = arg('exclude');
  if (v === undefined || v === 'off' || v === '' || v === 'none') return new Set<string>();
  if (v === 'solvents') return new Set(SOLVENT_PRESET);
  return new Set(v.split(',').map((x) => x.trim()).filter(Boolean));
})();

/** The card pool the gate is proven against. */
const POOL: string[] = (() => {
  const p = arg('pool');
  const base = p ? p.split(',').map((x) => x.trim()).filter(Boolean) : ALL_ABILITIES;
  return base.filter((x) => ALL_ABILITIES.includes(x) && !EXCLUDED.has(x));
})();

/** Library root. Declared early because the pair-attempt ledger lives in it. */
const LIB_DIR_EARLY = arg('out') ?? join(__dirname, '..', '..', 'data', 'run-playtest', 'combo-library');

const pairKey = (a: string, b: string) => [a, b].sort().join('+');
const pairsOf = (kit: string[]): string[] => {
  const out: string[] = [];
  for (let i = 0; i < kit.length; i++) for (let j = i + 1; j < kit.length; j++) out.push(pairKey(kit[i], kit[j]));
  return [...new Set(out)];
};

// ─────────────────────────────────────────────────────────────────────────────
// Pair hypotheses — the ranked list of mechanically plausible pairs (and the
// anti-pairs to avoid) written by the hypothesis agent. Absent → role heuristic.

const ROLE: Record<string, string> = {
  'queen-pulse': 'form', 'bishop-step': 'form', 'knight-hop': 'form', 'become-king': 'form',
  'freeze-ray': 'control', 'poison-dart': 'control', 'rabies-dart': 'control',
  convert: 'control', decoy: 'control', magnet: 'control', boulder: 'control',
  smoke: 'control', rewind: 'control',
  aegis: 'defense',
  'summon-knight': 'summon', 'bishop-squire': 'summon', page: 'summon', twin: 'summon',
  duchess: 'summon', dragon: 'summon', vanguard: 'summon',
  swap: 'support', sacrifice: 'support',
};
const roleOf = (id: string) => ROLE[id] ?? 'control';

function heuristicPairs(pool: string[]): { pair: string; reason: string }[] {
  const score = (a: string, b: string): { s: number; why: string } => {
    const ra = roleOf(a), rb = roleOf(b);
    const has = (x: string, y: string) => (ra === x && rb === y) || (ra === y && rb === x);
    if (has('summon', 'support')) return { s: 0, why: 'the support card is dead without a body to operate on' };
    if (has('summon', 'control')) return { s: 1, why: 'a second body plus a way to clear or hold the square it needs' };
    if (has('summon', 'form')) return { s: 2, why: 'a body covers one line while Rookie changes geometry' };
    if (has('form', 'control')) return { s: 3, why: 'new geometry plus a way to open it' };
    if (has('control', 'control')) return { s: 4, why: 'two removals — chains a defended key' };
    if (has('summon', 'summon')) return { s: 5, why: 'two bodies, two lines' };
    if (has('form', 'form')) return { s: 6, why: 'two geometries' };
    if (has('support', 'support')) return { s: 9, why: 'both need a summon — expected dead' };
    return { s: 7, why: `${ra} + ${rb}` };
  };
  const out: { pair: string; reason: string; s: number }[] = [];
  for (let i = 0; i < pool.length; i++)
    for (let j = i + 1; j < pool.length; j++) {
      const { s, why } = score(pool[i], pool[j]);
      out.push({ pair: pairKey(pool[i], pool[j]), reason: why, s });
    }
  out.sort((x, y) => x.s - y.s || x.pair.localeCompare(y.pair));
  return out.map(({ pair, reason }) => ({ pair, reason }));
}

const HYPOTHESES_FILE = join(__dirname, '..', '..', 'data', 'run-playtest', 'pair-hypotheses.json');

interface Hypotheses {
  ranked: { pair: string; reason: string }[];
  anti: Set<string>;
  source: 'hypotheses' | 'heuristic';
}

function loadHypotheses(): Hypotheses {
  const fallback: Hypotheses = { ranked: heuristicPairs(POOL), anti: new Set(), source: 'heuristic' };
  if (!existsSync(HYPOTHESES_FILE)) return fallback;
  const readPair = (row: unknown): { a: string; b: string; reason: string } | null => {
    let a = '', b = '', reason = '';
    if (typeof row === 'string') [a, b] = row.split('+');
    else if (row && typeof row === 'object') {
      const r = row as Record<string, unknown>;
      if (typeof r.pair === 'string') [a, b] = r.pair.split('+');
      else { a = String(r.a ?? ''); b = String(r.b ?? ''); }
      reason = String(r.reason ?? r.why ?? r.rationale ?? r.mechanism ?? '');
    }
    a = (a ?? '').trim(); b = (b ?? '').trim();
    if (!a || !b || a === b) return null;
    return { a, b, reason };
  };
  try {
    const raw = JSON.parse(readFileSync(HYPOTHESES_FILE, 'utf8')) as Record<string, unknown>;
    const list = (Array.isArray(raw) ? raw : ((raw.pairs as unknown[]) ?? [])) as unknown[];
    const anti = new Set<string>();
    for (const row of (raw.antiPairs as unknown[]) ?? []) {
      const p = readPair(row);
      if (p) anti.add(pairKey(p.a, p.b));
    }
    const seen = new Set<string>();
    const ranked: { pair: string; reason: string }[] = [];
    for (const row of list) {
      const p = readPair(row);
      if (!p) continue;
      if (!POOL.includes(p.a) || !POOL.includes(p.b)) continue; // respects --pool / --exclude
      const k = pairKey(p.a, p.b);
      if (seen.has(k) || anti.has(k)) continue;
      seen.add(k);
      ranked.push({ pair: k, reason: p.reason || 'ranked by the hypothesis agent' });
    }
    if (!ranked.length) return fallback;
    for (const f of heuristicPairs(POOL)) if (!seen.has(f.pair) && !anti.has(f.pair)) ranked.push(f);
    return { ranked, anti, source: 'hypotheses' };
  } catch {
    return fallback;
  }
}

const HYP = loadHypotheses();

/**
 * ANCHOR UNIVERSE — every pair we are willing to try, ranked. The hypothesis
 * file's ordering comes first, then every remaining pool pair by the role
 * heuristic. Anti-pairs are dropped entirely.
 */
const ANCHOR_UNIVERSE: { pair: string; reason: string; rank: number }[] = (() => {
  const out: { pair: string; reason: string; rank: number }[] = [];
  const seen = new Set<string>();
  for (const h of HYP.ranked) {
    if (seen.has(h.pair) || HYP.anti.has(h.pair)) continue;
    seen.add(h.pair);
    out.push({ ...h, rank: out.length });
  }
  for (const h of heuristicPairs(POOL)) {
    if (seen.has(h.pair) || HYP.anti.has(h.pair)) continue;
    seen.add(h.pair);
    out.push({ ...h, rank: out.length });
  }
  return out;
})();

/**
 * BREADTH BEFORE DEPTH (Tyler, 2026-09-05): "find more combinations." Every
 * pair gets a fair shot before any pair gets a second level, so attempts are
 * counted in a checkpointed file and kits are planned around the LEAST-tried
 * pairs each time. The counter persists across runs, which is also what makes
 * a long search resumable and additive rather than repetitive.
 */
const ATTEMPTS_FILE = join(LIB_DIR_EARLY, '_pair-attempts.json');

function loadAttempts(): Record<string, number> {
  if (!existsSync(ATTEMPTS_FILE)) return {};
  try { return JSON.parse(readFileSync(ATTEMPTS_FILE, 'utf8')) as Record<string, number>; } catch { return {}; }
}
function saveAttempts(a: Record<string, number>): void {
  mkdirSync(LIB_DIR_EARLY, { recursive: true });
  writeFileSync(ATTEMPTS_FILE, JSON.stringify(a, null, 1));
}

/** Cards that already have plenty of gating pairs — they yield the rotation head to the ones that do not. */
const OVERUSED = ['knight-hop', 'swap'];

interface KitPlan { kit: string[]; anchors: string[]; reason: string; }

/**
 * Kits for one subject: greedily PACK the least-tried pairs. A 4-card kit
 * contains 6 pairs, so seating two disjoint anchor pairs in one kit targets two
 * untried combinations at once and measures four more for free.
 */
function planKits(kitSize: number, maxKits: number, attempts: Record<string, number>, seedKits: KitPlan[]): KitPlan[] {
  const out: KitPlan[] = [...seedKits];
  const seenKit = new Set(out.map((k) => [...k.kit].sort().join(',')));
  const used = new Set<string>(); // anchors already seated in THIS subject's kits
  // UNIQUE combinations first (Tyler, 2026-09-05): 14 of the first 21 gating
  // pairs were knight-hop + X — one verb with different partners. Pairs that
  // contain NEITHER knight-hop nor swap go to the head of the rotation, and
  // knight-hop may anchor at most ~20% of a subject's kits.
  const overused = (pair: string) => pair.split('+').some((c) => OVERUSED.includes(c));
  const order = [...ANCHOR_UNIVERSE].sort(
    (a, b) => Number(overused(a.pair)) - Number(overused(b.pair)) || (attempts[a.pair] ?? 0) - (attempts[b.pair] ?? 0) || a.rank - b.rank,
  );
  const khCap = Math.max(1, Math.ceil(maxKits * 0.2));
  let khKits = 0;
  for (const a of order) {
    if (out.length >= maxKits) break;
    if (used.has(a.pair)) continue;
    const [x, y] = a.pair.split('+');
    if ([x, y].includes('knight-hop')) {
      if (khKits >= khCap) continue;
      khKits++;
    }
    const kit = [x, y];
    const anchors = [a.pair];
    const reasons = [a.reason];
    // Seat further disjoint low-attempt anchors, then fall back to single cards.
    // A universal solvent may sit in a kit ONLY as an anchor-pair card
    // (knight-hop+twin, boulder+knight-hop are legitimate pairs). A kit whose
    // first anchor has no solvent must contain none at all — measured: with
    // solvents seated as fillers, every kit on a terrain candidate was
    // disqualified by become-king / knight-hop before any pair got tested.
    const anchorHasSolvent = [x, y].some((c) => SOLVENT_PRESET.includes(c));
    for (const b of order) {
      if (kit.length + 2 > kitSize) break;
      if (b.pair === a.pair || used.has(b.pair)) continue;
      const [u, v] = b.pair.split('+');
      if (kit.includes(u) || kit.includes(v)) continue;
      if (!anchorHasSolvent && [u, v].some((c) => SOLVENT_PRESET.includes(c))) continue;
      if (!overused(a.pair) && overused(b.pair)) continue; // keep a unique kit unique
      if ([u, v].some((c) => kit.some((k) => HYP.anti.has(pairKey(k, c))))) continue;
      kit.push(u, v);
      anchors.push(b.pair);
      reasons.push(b.reason);
    }
    // Fillers: never a solvent, never an anti-pair with anything already seated.
    for (const f of POOL) {
      if (kit.length >= kitSize) break;
      if (kit.includes(f) || SOLVENT_PRESET.includes(f)) continue;
      if (kit.some((c) => HYP.anti.has(pairKey(c, f)))) continue;
      kit.push(f);
    }
    const k = [...kit].sort().join(',');
    if (seenKit.has(k)) continue;
    seenKit.add(k);
    for (const p of anchors) used.add(p);
    out.push({ kit, anchors, reason: reasons.join(' | ') });
  }
  return out.slice(0, Math.max(maxKits, seedKits.length));
}

// ─────────────────────────────────────────────────────────────────────────────
// Subjects — one thing to score: a generated candidate or a shipped level.

interface GenOpts { slots: number[]; archetypes: string[]; variants: number; seed: number; }

interface Subject {
  key: string;
  kind: 'gen' | 'run' | 'terrain';
  slot: number;
  idx?: number;      // generator mode: index into buildCandidates(genOpts)
  runId?: string;    // run mode
  level?: number;
  title?: string;
  archetype?: string;
}

const ARCHETYPE_IDS = ['swarm', 'royal-guard', 'double-key', 'open-flank', 'corner-keep', 'walled-court'];

function genOptsFromArgs(): GenOpts {
  const a = arg('archetypes', 'all')!;
  return {
    slots: parseRange(arg('slots'), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    archetypes: a === 'all' ? ARCHETYPE_IDS : a.split(',').map((s) => s.trim()).filter(Boolean),
    variants: num('variants', 2),
    seed: num('seed', 0),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Cell measurement (in-process; the worker calls this)

interface Task { key: string; loadout: string; }
interface TaskFile {
  genOpts: GenOpts | null;
  terrainOpts: TerrainOpts | null;
  subjects: Subject[];
  tasks: Task[];
  trials: number;
  tier: string;
  realistic: boolean;
}
interface CellOut { key: string; loadout: string; cell: Cell; }

function cfgForSubject(s: Subject, cands: Candidate[] | null, terrain: TerrainCandidate[] | null): { cfg: RevengeCfg; level: number } {
  if (s.kind === 'run') return { cfg: { runId: s.runId! }, level: s.level! };
  if (s.kind === 'terrain') {
    return { cfg: { runId: 'revenge-1', puzzles: { [s.slot]: terrain![s.idx!].puzzle } }, level: s.slot };
  }
  const c = cands![s.idx!];
  // Generated puzzles ride in as a per-level override on revenge-1 — the same
  // trick experiments/mutations use, which is why these cells must be measured
  // in-process (matrixParallel refuses puzzle overrides).
  return { cfg: { runId: 'revenge-1', puzzles: { [s.slot]: c.puzzle } }, level: s.slot };
}

function workerMain(): void {
  const payload = JSON.parse(readFileSync(arg('task-file')!, 'utf8')) as TaskFile;
  const cands = payload.genOpts ? buildCandidates(payload.genOpts) : null;
  const terrain = payload.terrainOpts ? buildTerrainCandidates(payload.terrainOpts) : null;
  const byKey = new Map(payload.subjects.map((s) => [s.key, s]));
  const out: CellOut[] = [];
  for (const t of payload.tasks) {
    const s = byKey.get(t.key)!;
    const { cfg, level } = cfgForSubject(s, cands, terrain);
    const cell = runMatrixCell(cfg, level, t.loadout, payload.trials, payload.tier, payload.realistic, `combo:${s.key}`);
    out.push({ key: t.key, loadout: t.loadout, cell });
  }
  process.stdout.write(JSON.stringify(out));
}

// ─────────────────────────────────────────────────────────────────────────────
// Parallel driver — shard tasks across worker processes (matrix-style).

let tmpSeq = 0;

function spawnWorker(payload: TaskFile): Promise<CellOut[]> {
  const path = join(tmpdir(), `combo-discover-${process.pid}-${tmpSeq++}.json`);
  writeFileSync(path, JSON.stringify(payload));
  return new Promise<CellOut[]>((resolve, reject) => {
    const child = spawn('npx', ['tsx', __filename, '--worker', `--task-file=${path}`], {
      stdio: ['ignore', 'pipe', 'inherit'],
    });
    let out = '';
    child.stdout.on('data', (d) => (out += d.toString()));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(`combo worker exit ${code}`));
      try { resolve(JSON.parse(out) as CellOut[]); } catch (e) { reject(e); }
    });
  });
}

/**
 * Measure a batch of (subject, loadout) cells. A cell is NEVER split across
 * workers, so every number is reproducible from its seed.
 */
async function measure(
  tasks: Task[], subjects: Subject[], genOpts: GenOpts | null, terrainOpts: TerrainOpts | null,
  trials: number, tier: string, realistic: boolean, jobs: number,
): Promise<Map<string, Cell>> {
  const result = new Map<string, Cell>();
  if (!tasks.length) return result;
  const n = Math.max(1, Math.min(jobs, tasks.length));
  const shards: Task[][] = Array.from({ length: n }, () => []);
  tasks.forEach((t, i) => shards[i % n].push(t));
  const used = new Set(tasks.map((t) => t.key));
  const subs = subjects.filter((s) => used.has(s.key));
  const all = await Promise.all(
    shards.filter((s) => s.length).map((s) => spawnWorker({ genOpts, terrainOpts, subjects: subs, tasks: s, trials, tier, realistic })),
  );
  for (const batch of all) for (const c of batch) result.set(`${c.key}|${c.loadout}`, c.cell);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Library IO

interface Row {
  winPct: number; trials: number; wins: number; captured: number;
  moveLimit: number; stall: number; deadEnd: number; avgMoves: number;
}
const toRow = (c: Cell): Row => ({
  winPct: winPct(c), trials: c.trials, wins: c.wins, captured: c.captured,
  moveLimit: c.moveLimit, stall: c.stall, deadEnd: c.deadEnd,
  avgMoves: Math.round(c.avgMoves * 10) / 10,
});

interface GatedKit { kit: string[]; anchors: string[]; reason: string; winningPairs: { pair: string; winPct: number }[]; }

interface LibraryEntry {
  id: string;
  date: string;
  slot: number;
  source: { kind: 'gen' | 'run' | 'terrain'; runId?: string; level?: number; archetype?: string; genSeed?: number };
  title: string;
  /** Every kit under which this level is combo-gated. More = more runs can ship it. */
  gatedUnder: GatedKit[];
  kitsGating: number;
  kitsTested: number;
  /** Union of every pair that clears it inside a gating kit. */
  winningPairs: { pair: string; winPct: number }[];
  /** Which universal solvents crack it alone. All three = a pure-terrain puzzle. */
  solventsSolving: { ability: string; winPct: number }[];
  /** Bonus tier: no single ability in the ENTIRE game clears it. */
  pure: boolean;
  /** The measured matrix row: none, every single tested, every pair tested. */
  matrix: Record<string, Row>;
  thresholds: { noneMax: number; singleMax: number; pairMin: number; screenTrials: number; pairTrials: number; confirmTrials: number; tier: string; realistic: boolean };
  pool: { abilities: string[]; excluded: string[] };
  puzzle: RunPuzzle;
  /** Paste-ready runs.ts snippet (generated candidates only). */
  snippet: string | null;
}

const LIB_DIR = LIB_DIR_EARLY;
const LEDGER = join(LIB_DIR, '_ledger.jsonl');

type Verdict = 'accepted' | 'died-none' | 'died-single' | 'no-pair' | 'died-confirm';

interface LedgerRow {
  key: string; date: string; verdict: Verdict; slot: number;
  detail?: string; winningPairs?: string[]; kitsTested?: number; kitsGating?: number;
  pairsTested?: string[]; solvents?: string[];
}

function loadLedger(): Map<string, LedgerRow> {
  const out = new Map<string, LedgerRow>();
  if (!existsSync(LEDGER)) return out;
  for (const line of readFileSync(LEDGER, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { const r = JSON.parse(line) as LedgerRow; out.set(r.key, r); } catch { /* skip */ }
  }
  return out;
}
function appendLedger(row: LedgerRow): void {
  mkdirSync(LIB_DIR, { recursive: true });
  appendFileSync(LEDGER, JSON.stringify(row) + '\n');
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Ability ids are [a-z-], so "a+b" is a safe directory name. */
const pairDir = (p: string) => join(LIB_DIR, p);

function writeScan(key: string, scan: Record<string, unknown>): void {
  const dir = join(LIB_DIR, '_scans');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${key}.json`), JSON.stringify(scan, null, 1));
}

function writeEntry(entry: LibraryEntry): void {
  for (const wp of entry.winningPairs) {
    const dir = pairDir(wp.pair);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${entry.id}.json`), JSON.stringify(entry, null, 1));
    writeIndex(wp.pair);
  }
}

function readEntries(pair: string): LibraryEntry[] {
  const dir = pairDir(pair);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')) as LibraryEntry)
    .sort((a, b) => a.slot - b.slot || a.id.localeCompare(b.id));
}

function writeIndex(pair: string): void {
  const entries = readEntries(pair);
  const L: string[] = [];
  L.push(`# Combo-gated levels — \`${pair}\``);
  L.push('');
  L.push(`${entries.length} level${entries.length === 1 ? '' : 's'} where, inside at least one kit, no single card wins and this pair does.`);
  L.push('');
  L.push('| id | slot | none | this pair | kits it is gated under | other pairs in those kits | solvents that crack it | pure | date |');
  L.push('|---|---|---|---|---|---|---|---|---|');
  for (const e of entries) {
    const me = e.winningPairs.find((w) => w.pair === pair);
    const others = e.winningPairs.filter((w) => w.pair !== pair).map((w) => w.pair);
    const kits = e.gatedUnder.filter((g) => g.winningPairs.some((w) => w.pair === pair)).map((g) => `[${g.kit.join(' ')}]`);
    L.push(
      `| ${e.id} | L${e.slot} | ${e.matrix.none?.winPct ?? '-'}% | **${me?.winPct ?? '-'}%** | ${kits.join('<br>') || '-'} | ${others.length ? others.join(', ') : '— (unique answer)'} | ${e.solventsSolving.map((s) => `${s.ability} ${s.winPct}%`).join(', ') || 'none'} | ${e.pure ? 'yes' : 'no'} | ${e.date} |`,
    );
  }
  L.push('');
  L.push('Each `<id>.json` holds the level definition, a paste-ready runs.ts snippet, every gating kit, and the full measured matrix row.');
  writeFileSync(join(pairDir(pair), 'INDEX.md'), L.join('\n'));
}

/** The direct answer to "find more combinations": which pairs gate levels. */
function writeSynergy(): void {
  mkdirSync(LIB_DIR, { recursive: true });
  const ledger = [...loadLedger().values()];
  const dirs = existsSync(LIB_DIR)
    ? readdirSync(LIB_DIR, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith('_')).map((d) => d.name)
    : [];
  const produced = new Map<string, LibraryEntry[]>();
  for (const d of dirs) {
    const e = readEntries(d);
    if (e.length) produced.set(d, e);
  }
  const tested = new Set<string>();
  for (const r of ledger) for (const p of r.pairsTested ?? []) tested.add(p);

  const L: string[] = [];
  L.push("# Rookie's Revenge — pair synergy report");
  L.push('');
  L.push(`Generated ${today()} by \`scripts/run-playtest/combo-discover.ts\`.`);
  L.push('');
  L.push('## Combo-gating is KIT-relative (the finding that reshaped this search)');
  L.push('');
  L.push('The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.');
  L.push('');
  L.push("`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.");
  L.push('');
  L.push('The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:');
  L.push('');
  L.push('> Given a 4-card **kit** K: no-ability ~0%, every single card in K ~0%, and at least one **pair** drawn from K >= 60%.');
  L.push('');
  L.push('A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.');
  L.push('');
  L.push(`Card pool searched: **${POOL.length} abilities**${EXCLUDED.size ? ` (excluded: ${[...EXCLUDED].join(', ')})` : ''} → ${(POOL.length * (POOL.length - 1)) / 2} possible pairs. All ${ALL_ABILITIES.length} built abilities → ${(ALL_ABILITIES.length * (ALL_ABILITIES.length - 1)) / 2} pairs.`);
  L.push('');
  L.push(`Subjects screened: **${ledger.length}** · combo-gated: **${ledger.filter((r) => r.verdict === 'accepted').length}** · solvable with no ability: ${ledger.filter((r) => r.verdict === 'died-none').length} · every kit disqualified by one of its own cards: ${ledger.filter((r) => r.verdict === 'died-single').length} · a kit survived but no pair cleared: ${ledger.filter((r) => r.verdict === 'no-pair').length} · failed the high-trial confirm: ${ledger.filter((r) => r.verdict === 'died-confirm').length}`);
  L.push('');
  L.push('## Pairs that produced combo-gated levels');
  L.push('');
  if (!produced.size) {
    L.push('_None yet._');
  } else {
    L.push('| pair | levels | slots | best win % | unique-answer levels | pure levels |');
    L.push('|---|---|---|---|---|---|');
    [...produced.entries()]
      .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
      .forEach(([pair, entries]) => {
        const best = Math.max(...entries.map((e) => e.winningPairs.find((w) => w.pair === pair)?.winPct ?? 0));
        const unique = entries.filter((e) => e.winningPairs.length === 1).length;
        L.push(`| \`${pair}\` | ${entries.length} | ${[...new Set(entries.map((e) => `L${e.slot}`))].join(' ')} | ${best}% | ${unique} | ${entries.filter((e) => e.pure).length} |`);
      });
  }
  L.push('');
  L.push('## Socket abilities — which cards show up in the most gating pairs');
  L.push('');
  L.push('The card that appears in the most winning pairs is the one to build future runs around.');
  L.push('');
  {
    const perAbility = new Map<string, { pairs: Set<string>; levels: Set<string> }>();
    for (const [pair, entries] of produced) {
      for (const a of pair.split('+')) {
        if (!perAbility.has(a)) perAbility.set(a, { pairs: new Set(), levels: new Set() });
        perAbility.get(a)!.pairs.add(pair);
        for (const e of entries) perAbility.get(a)!.levels.add(e.id);
      }
    }
    if (!perAbility.size) L.push('_None yet._');
    else {
      L.push('| ability | gating pairs it appears in | gated levels | pairs |');
      L.push('|---|---|---|---|');
      [...perAbility.entries()]
        .sort((a, b) => b[1].pairs.size - a[1].pairs.size || b[1].levels.size - a[1].levels.size)
        .forEach(([a, v]) => L.push(`| \`${a}\` | ${v.pairs.size} | ${v.levels.size} | ${[...v.pairs].map((p) => `\`${p}\``).join(', ')} |`));
    }
  }
  L.push('');
  L.push('## Pairs played against a surviving kit that never gated a level');
  L.push('');
  const never = [...tested].filter((p) => !produced.has(p)).sort();
  L.push('Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.');
  L.push('');
  {
    const attempts = loadAttempts();
    const rows = never.map((p) => ({ p, n: attempts[p] ?? 0 })).sort((a, b) => b.n - a.n);
    if (!rows.length) L.push('_None recorded yet._');
    else {
      L.push('| pair | levels it was played on |');
      L.push('|---|---|');
      for (const r of rows) L.push(`| \`${r.p}\` | ${r.n} |`);
    }
  }
  L.push('');
  L.push('## Untested pairs');
  L.push('');
  const all = heuristicPairs(ALL_ABILITIES).map((p) => p.pair);
  const untested = all.filter((p) => !tested.has(p) && !produced.has(p));
  L.push(`${untested.length} of ${all.length} pairs have never been played against a surviving candidate. Widen with \`--max-kits\`, or extend \`data/run-playtest/pair-hypotheses.json\` to reorder the head of the search.`);
  L.push('');
  L.push('`_scans/` holds the full measured row for every subject scored with `--score-all` (the shipped-run ground truth); `_ledger.jsonl` is the resume ledger.');
  writeFileSync(join(LIB_DIR, 'SYNERGY.md'), L.join('\n'));
}

// ─────────────────────────────────────────────────────────────────────────────
// Main

interface Opts {
  mode: 'gen' | 'run' | 'terrain';
  genOpts: GenOpts | null;
  terrainOpts: TerrainOpts | null;
  runId: string | null;
  levels: number[];
  kitSize: number;
  maxKits: number;
  screenTrials: number; pairTrials: number; confirmTrials: number;
  screenKill: number; noneMax: number; singleMax: number; pairMin: number;
  tier: string; realistic: boolean; jobs: number;
  scoreAll: boolean; pureCheck: boolean; limit: number; minutes: number; fresh: boolean;
}

function readOpts(): Opts {
  const runId = arg('run') ?? null;
  const fromTerrain = flag('from-terrain');
  const fromGen = !fromTerrain && (flag('from-generator') || !runId);
  const r = arg('realistic', 'true');
  const fam = arg('families', 'all')!;
  return {
    mode: fromTerrain ? 'terrain' : fromGen ? 'gen' : 'run',
    genOpts: fromGen ? genOptsFromArgs() : null,
    terrainOpts: fromTerrain ? {
      slots: parseRange(arg('slots'), [7, 8, 9, 10]),
      variants: num('variants', 8),
      seed: num('seed', 0),
      families: fam === 'all' ? TERRAIN_FAMILIES : fam.split(',').map((x) => x.trim()).filter(Boolean),
    } : null,
    runId,
    levels: runId ? parseRange(arg('levels'), Array.from({ length: levelCountFor(runId) }, (_, i) => i + 1)) : [],
    kitSize: num('kit-size', 4),
    maxKits: num('max-kits', 12),
    screenTrials: num('screen-trials', 10),
    pairTrials: num('pair-trials', 10),
    confirmTrials: num('confirm-trials', 30),
    screenKill: num('screen-kill', 20),
    noneMax: num('none-max', 8),
    singleMax: num('single-max', 8),
    pairMin: num('pair-min', 60),
    tier: arg('tier', 'T5')!,
    realistic: r !== 'off' && r !== 'false',
    jobs: defaultJobs(num('jobs', 8)),
    scoreAll: flag('score-all'),
    pureCheck: flag('pure-check'),
    limit: num('limit', Number.MAX_SAFE_INTEGER),
    minutes: num('minutes', 0),
    fresh: flag('fresh'),
  };
}

function chunk<T>(xs: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < xs.length; i += n) out.push(xs.slice(i, i + n));
  return out;
}

async function main(): Promise<void> {
  if (flag('worker')) return workerMain();
  const o = readOpts();
  const started = Date.now();
  const deadline = o.minutes > 0 ? started + o.minutes * 60_000 : Infinity;
  mkdirSync(LIB_DIR, { recursive: true });
  const ledger = o.fresh ? new Map<string, LedgerRow>() : loadLedger();

  // ── Subjects ──────────────────────────────────────────────────────────────
  let subjects: Subject[] = [];
  let cands: Candidate[] | null = null;
  let lintFails = 0;
  const seedKits: KitPlan[] = [];
  let terrain: TerrainCandidate[] | null = null;
  if (o.mode === 'terrain') {
    terrain = buildTerrainCandidates(o.terrainOpts!);
    terrain.forEach((c, idx) => {
      if (c.lintErrors.length) { lintFails++; return; }
      subjects.push({ key: `${c.id}-s${o.terrainOpts!.seed}`, kind: 'terrain', slot: c.slot, idx, title: c.title, archetype: c.family });
    });
  } else if (o.mode === 'gen') {
    cands = buildCandidates(o.genOpts!);
    cands.forEach((c, idx) => {
      if (c.lint.errors.length) { lintFails++; return; } // stage 0 — free kill
      subjects.push({ key: `${c.id}-s${o.genOpts!.seed}`, kind: 'gen', slot: c.spec.slot, idx, title: c.spec.title, archetype: c.spec.archetype });
    });
  } else {
    const run = getRunById(o.runId!);
    for (const lv of o.levels) {
      subjects.push({ key: `${o.runId}-L${lv}`, kind: 'run', slot: lv, runId: o.runId!, level: lv, title: `${run.name} L${lv}` });
    }
    // The run's OWN kit is kit #1 — that is the validation case: a shipped run
    // is gated against exactly the cards it lets the player hold.
    const own = (run.allowedAbilities ?? []).filter((a) => POOL.includes(a));
    if (own.length >= 2) seedKits.push({ kit: [...own], anchors: pairsOf(own), reason: `the kit ${run.name} actually offers` });
  }
  const skipped = subjects.filter((s) => ledger.has(s.key)).length;
  subjects = subjects.filter((s) => !ledger.has(s.key)).slice(0, o.limit);

  const attempts = loadAttempts();

  console.error(
    `[combo-discover] ${o.mode} mode · ${subjects.length} subjects (${lintFails} lint-failed, ${skipped} already in the ledger)\n` +
    `  KIT-RELATIVE gate: none<=${o.noneMax}% · every card in the kit<=${o.singleMax}% · >=1 pair in the kit>=${o.pairMin}%\n` +
    `  ${o.maxKits} kits of ${o.kitSize} per subject, from ${HYP.source}${HYP.anti.size ? `, ${HYP.anti.size} anti-pairs avoided` : ''}\n` +
    `  pool ${POOL.length} cards${EXCLUDED.size ? ` (excluded ${[...EXCLUDED].join(',')})` : ''} · solvent probe: ${SOLVENTS.join(', ')}\n` +
    `  funnel: none@${o.screenTrials} → singles@${o.screenTrials} → pairs@${o.pairTrials} → confirm@${o.confirmTrials} · bot ${o.tier}${o.realistic ? ', realistic tiers' : ', T1'} · jobs ${o.jobs}` +
    `  anchor universe: ${ANCHOR_UNIVERSE.length} pairs (${Object.keys(attempts).length} already attempted) — kits are planned around the LEAST-tried pairs, breadth before depth`,
  );

  let accepted = 0, processed = 0;
  const record = (row: LedgerRow) => { appendLedger(row); ledger.set(row.key, row); };
  const stop = () => Date.now() > deadline;

  for (const group of chunk(subjects, o.jobs * 2)) {
    if (stop()) break;
    // ── (a) no-ability screen, batched across the whole group ───────────────
    const noneCells = await measure(group.map((s) => ({ key: s.key, loadout: 'none' })), subjects, o.genOpts, o.terrainOpts, o.screenTrials, o.tier, o.realistic, o.jobs);

    for (const s of group) {
      if (stop()) break;
      processed++;
      const matrix: Record<string, Row> = {};
      const label = `${s.key}${s.title ? ` (${s.title})` : ''} L${s.slot}`;
      /** Measure only what is missing (or measured at fewer trials) — the cache
       *  is what makes overlapping kits cheap. */
      const meas = async (loadouts: string[], trials: number) => {
        const todo = [...new Set(loadouts)].filter((lo) => !(lo in matrix) || matrix[lo].trials < trials);
        if (!todo.length) return;
        const cells = await measure(todo.map((lo) => ({ key: s.key, loadout: lo })), subjects, o.genOpts, o.terrainOpts, trials, o.tier, o.realistic, o.jobs);
        for (const lo of todo) matrix[lo] = toRow(cells.get(`${s.key}|${lo}`)!);
      };
      matrix.none = toRow(noneCells.get(`${s.key}|none`)!);
      if (matrix.none.winPct > o.screenKill && !o.scoreAll) {
        record({ key: s.key, date: today(), verdict: 'died-none', slot: s.slot, detail: `none ${matrix.none.winPct}%` });
        console.error(`  ✗ ${label} — no-ability ${matrix.none.winPct}% (solvable bare)`);
        continue;
      }

      // ── (b) solvent probe — metadata, never part of the gate ──────────────
      await meas(SOLVENTS, o.screenTrials);
      const solvents = SOLVENTS.filter((a) => matrix[a].winPct > o.screenKill);

      // ── (c) plan THIS subject's kits around the least-tried pairs, then
      //        measure their cards in ONE batched round; kit checks are lookups
      const kits = planKits(o.kitSize, o.maxKits, attempts, seedKits);
      const kitSingles = [...new Set(kits.flatMap((k) => k.kit))];
      await meas(kitSingles, o.screenTrials);
      const liveKits = kits.filter((k) => k.kit.every((c) => matrix[c].winPct <= o.screenKill));
      if (!liveKits.length) {
        const worst = kitSingles.map((c) => [c, matrix[c].winPct] as const).sort((a, b) => b[1] - a[1])[0];
        if (o.scoreAll) writeScan(s.key, { id: s.key, title: s.title, slot: s.slot, verdict: 'not-gated', solvents, matrix });
        record({ key: s.key, date: today(), verdict: 'died-single', slot: s.slot, detail: `every kit has a solo answer (worst ${worst[0]} ${worst[1]}%)`, kitsTested: kits.length, solvents });
        console.error(`  ✗ ${label} — every kit disqualified by its own card (worst ${worst[0]} ${worst[1]}%)`);
        continue;
      }
      console.error(`  · ${label} — none ${matrix.none.winPct}%, ${liveKits.length}/${kits.length} kits survive singles${solvents.length ? ` (solvents: ${solvents.join(',')})` : ''} → pair sweep`);

      // ── (d) pair sweep, deduped across the surviving kits ─────────────────
      const pairs = [...new Set(liveKits.flatMap((k) => pairsOf(k.kit)))];
      await meas(pairs, o.pairTrials);
      // Every pair that actually got played counts as attempted, so the next
      // subject rotates onto pairs that have not had their shot yet.
      for (const p of pairs) attempts[p] = (attempts[p] ?? 0) + 1;
      saveAttempts(attempts);
      const gatedRaw: GatedKit[] = liveKits
        .map((k) => ({
          kit: k.kit, anchors: k.anchors, reason: k.reason,
          winningPairs: pairsOf(k.kit).filter((p) => matrix[p].winPct >= o.pairMin).map((p) => ({ pair: p, winPct: matrix[p].winPct })),
        }))
        .filter((g) => g.winningPairs.length > 0);
      if (!gatedRaw.length) {
        if (o.scoreAll) writeScan(s.key, { id: s.key, title: s.title, slot: s.slot, verdict: 'no-pair', solvents, matrix });
        record({ key: s.key, date: today(), verdict: 'no-pair', slot: s.slot, detail: `${pairs.length} pairs tested, none >= ${o.pairMin}%`, kitsTested: kits.length, kitsGating: 0, pairsTested: pairs, solvents });
        console.error(`  ✗ ${label} — no pair cleared ${o.pairMin}% (${pairs.length} tested)`);
        continue;
      }

      // ── (e) confirm at high trials before believing anything ─────────────
      const gatingCards = [...new Set(gatedRaw.flatMap((g) => g.kit))].filter((c) => matrix[c].wins > 0);
      const hitPairs = [...new Set(gatedRaw.flatMap((g) => g.winningPairs.map((w) => w.pair)))];
      await meas(['none', ...gatingCards, ...hitPairs], o.confirmTrials);
      const gated: GatedKit[] = gatedRaw
        .filter((g) => g.kit.every((c) => matrix[c].winPct <= o.singleMax))
        .map((g) => ({ ...g, winningPairs: g.winningPairs.filter((w) => matrix[w.pair].winPct >= o.pairMin).map((w) => ({ pair: w.pair, winPct: matrix[w.pair].winPct })) }))
        .filter((g) => g.winningPairs.length > 0);
      if (matrix.none.winPct > o.noneMax || !gated.length) {
        const why = matrix.none.winPct > o.noneMax ? `none ${matrix.none.winPct}%` : 'no kit held its gate at confirm trials';
        if (o.scoreAll) writeScan(s.key, { id: s.key, title: s.title, slot: s.slot, verdict: 'died-confirm', why, solvents, matrix });
        record({ key: s.key, date: today(), verdict: 'died-confirm', slot: s.slot, detail: why, kitsTested: kits.length, pairsTested: pairs, solvents });
        console.error(`  ✗ ${label} — failed confirm (${why})`);
        continue;
      }

      // Bonus tier: is it gated against EVERY card in the game? Opt-in — this
      // is 23 extra cells on every hit, and the solvent finding says it will
      // almost always be false on a terrain level (all three solvents crack
      // them). Turn it on with --pure-check when hunting that rarity.
      let pure = false;
      if (o.pureCheck) {
        await meas(ALL_ABILITIES, o.screenTrials);
        pure = ALL_ABILITIES.every((a) => matrix[a].winPct <= o.singleMax);
      }

      const winningPairs = [...new Map(gated.flatMap((g) => g.winningPairs).map((w) => [w.pair, w])).values()].sort((a, b) => b.winPct - a.winPct);
      const cand = s.kind === 'gen' ? cands![s.idx!] : null;
      const terr = s.kind === 'terrain' ? terrain![s.idx!] : null;
      const entry: LibraryEntry = {
        id: s.key, date: today(), slot: s.slot,
        source: s.kind === 'run'
          ? { kind: 'run', runId: s.runId!, level: s.level! }
          : { kind: s.kind, archetype: s.archetype, genSeed: (o.genOpts ?? o.terrainOpts)!.seed },
        title: s.title ?? s.key,
        gatedUnder: gated,
        kitsGating: gated.length,
        kitsTested: kits.length,
        winningPairs,
        solventsSolving: SOLVENTS.filter((a) => matrix[a].winPct > o.singleMax).map((a) => ({ ability: a, winPct: matrix[a].winPct })),
        pure,
        matrix,
        thresholds: {
          noneMax: o.noneMax, singleMax: o.singleMax, pairMin: o.pairMin,
          screenTrials: o.screenTrials, pairTrials: o.pairTrials, confirmTrials: o.confirmTrials,
          tier: o.tier, realistic: o.realistic,
        },
        pool: { abilities: [...POOL], excluded: [...EXCLUDED] },
        puzzle: cand ? cand.puzzle : terr ? terr.puzzle : puzzleFor({ runId: s.runId! }, s.level!),
        snippet: cand ? renderSnippet(cand.spec) : terr ? terr.snippet : null,
      };
      writeEntry(entry);
      if (o.scoreAll) writeScan(s.key, { id: s.key, title: s.title, slot: s.slot, verdict: 'accepted', gatedUnder: gated, pure, solvents, matrix });
      writeSynergy();
      accepted++;
      record({ key: s.key, date: today(), verdict: 'accepted', slot: s.slot, winningPairs: winningPairs.map((w) => w.pair), kitsTested: kits.length, kitsGating: gated.length, pairsTested: pairs, solvents });
      console.error(
        `  ✓ ${label} — COMBO-GATED under ${gated.length} kit${gated.length === 1 ? '' : 's'}: ` +
        gated.map((g) => `[${g.kit.join(' ')}] → ${g.winningPairs.map((w) => `${w.pair} ${w.winPct}%`).join(' + ')}`).join(' · ') +
        (pure ? '  ← PURE (no single ability in the game solves it)' : ''),
      );
    }
  }

  writeSynergy();
  const mins = (Date.now() - started) / 60000;
  console.error(
    `[combo-discover] ${processed} subjects in ${mins.toFixed(1)} min ` +
    `(${(processed / Math.max(mins / 60, 1e-9)).toFixed(0)} subjects/hour) · ${accepted} combo-gated · library ${LIB_DIR}`,
  );
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
