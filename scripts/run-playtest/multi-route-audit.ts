/**
 * MULTI-ROUTE AUDIT (2026-09-07)
 *
 * Question: is every combo run a ONE-ANSWER lock, or do other ability pairs
 * also beat the finale? Nobody ever measured pairs OUTSIDE the authored pair.
 *
 * Per run (revenge-12 .. revenge-41, stage testing/approved/live), on L7-L10:
 *   (a) 'none'
 *   (b) each of the 4 kit cards alone
 *   (c) all 6 pairs from within the kit
 *   (d) 20 pairs drawn from OUTSIDE the kit (player-facing set):
 *       10 = each signature card x 5 fixed probe cards
 *       10 = every pair among those same 5 probes
 *
 * METHOD
 *   tier T5, realistic false, jobs 4, deterministic harness.
 *   'none' + the 4 singles are measured on ALL of L7-L10 at 16 trials (the
 *   broken-gate check is per level).
 *   PAIRS are SCREENED on L7 at 16 trials; a pair that wins 0/16 on L7 cannot
 *   be a route (a true 60% pair reads 0/16 with p ~ 1e-7) and is recorded as
 *   eliminated-at-L7 rather than measured on L8-L10.
 *   Anything reading >40% at 16 trials is RE-MEASURED at 32 trials, and only
 *   32-trial numbers are used for the verdicts.
 *
 * Checkpointed per batch to the OUT file; safe to kill and restart.
 * Writes data only. Touches no game logic.
 */
import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs';
import { REGISTRY, isPlayerFacing } from '../../lib/content/pipeline';
import { getRunById } from '../../lib/run/runs';
import { matrixParallel, winPct, type Cell } from './revenge-core';

const OUT = 'data/run-playtest/results/2026-09-07/multi-route-audit-2026-09-07.json';
const LEVELS = [7, 8, 9, 10];
const SCREEN = 16;
const CONFIRM = 32;
const CONFIRM_ABOVE = 40; // re-measure anything above this at 16 trials
const JOBS = 4;

/** Authored signature pair per run, taken from the registry notes / run headers. */
const SIGNATURE: Record<string, [string, string]> = {
  'revenge-12': ['bishop-squire', 'swap'],
  'revenge-13': ['bishop-squire', 'swap'],
  'revenge-14': ['vanguard', 'swap'],
  'revenge-15': ['magnet', 'boulder'],
  'revenge-16': ['poison-dart', 'bishop-squire'],
  'revenge-17': ['dragon', 'sacrifice'],
  'revenge-18': ['freeze-ray', 'vanguard'],
  'revenge-19': ['convert', 'summon-knight'],
  'revenge-21': ['boulder', 'knight-hop'],
  'revenge-22': ['dragon', 'duchess'],
  'revenge-23': ['knight-hop', 'twin'],
  'revenge-24': ['duchess', 'decoy'],
  'revenge-25': ['become-king', 'boulder'],
  'revenge-26': ['become-king', 'boulder'],
  'revenge-27': ['scarecrow', 'knight-hop'],
  'revenge-30': ['coup', 'duchess'],
  'revenge-32': ['shove', 'magnet'],
  'revenge-33': ['snare', 'boulder'],
  'revenge-34': ['twin', 'rewind'],
  'revenge-35': ['page', 'aegis'],
  'revenge-36': ['queen-pulse', 'smoke'],
  'revenge-41': ['panic', 'page'],
};

/** Fixed global priority so the same probe cards recur across runs (that is what
 *  makes "which non-kit cards generalise" answerable). Diverse verbs first. */
const PROBE_PRIORITY = [
  'knight-hop', 'swap', 'boulder', 'summon-knight', 'freeze-ray', 'magnet',
  'become-king', 'twin', 'dragon', 'decoy', 'convert', 'bishop-squire',
  'vanguard', 'sacrifice', 'duchess', 'poison-dart', 'rabies-dart', 'smoke',
  'rewind', 'page', 'aegis', 'bishop-step', 'queen-pulse',
];

const pair = (a: string, b: string) => [a, b].sort().join('+');

export function runIds(): string[] {
  return REGISTRY.items
    .filter((i) => i.kind === 'run' && ['testing', 'approved', 'live'].includes(i.stage) && /^revenge-\d+$/.test(i.id))
    .map((i) => i.id)
    .filter((id) => Number(id.split('-')[1]) >= 12)
    .sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]));
}

export function planFor(runId: string) {
  const run = getRunById(runId);
  const kit = [...(run.allowedAbilities ?? [])] as string[];
  const sig = SIGNATURE[runId];
  if (!sig) throw new Error(`no signature pair recorded for ${runId}`);
  const probes = PROBE_PRIORITY.filter((id) => !kit.includes(id) && isPlayerFacing(id)).slice(0, 5);
  const inKit: string[] = [];
  for (let i = 0; i < kit.length; i++) for (let j = i + 1; j < kit.length; j++) inKit.push(pair(kit[i], kit[j]));
  const outKit = new Set<string>();
  for (const s of sig) for (const p of probes) outKit.add(pair(s, p));
  for (let i = 0; i < probes.length; i++) for (let j = i + 1; j < probes.length; j++) outKit.add(pair(probes[i], probes[j]));
  return { kit, sig, probes, singles: kit, inKit, outKit: [...outKit].filter((p) => !inKit.includes(p)) };
}

// ── store ────────────────────────────────────────────────────────────────────
type Rec = { pct: number; trials: number };
type Store = {
  meta: Record<string, unknown>;
  runs: Record<string, {
    kit: string[]; sig: string[]; probes: string[];
    inKit: string[]; outKit: string[];
    cells: Record<string, Record<string, Rec>>; // loadout -> level -> rec
    eliminatedAtL7?: string[];
    done?: boolean;
  }>;
};

function load(): Store {
  if (existsSync(OUT)) return JSON.parse(readFileSync(OUT, 'utf8'));
  return { meta: {}, runs: {} };
}
function save(s: Store) {
  mkdirSync('data/run-playtest', { recursive: true });
  writeFileSync(OUT, JSON.stringify(s, null, 1));
}

async function measure(runId: string, loadouts: string[], levels: number[], trials: number, store: Store) {
  if (!loadouts.length || !levels.length) return;
  const cells: Cell[] = await matrixParallel({ runId }, { levels, loadouts, trials, tier: 'T5', realistic: false, jobs: JOBS });
  const r = store.runs[runId];
  for (const c of cells) {
    r.cells[c.loadout] = r.cells[c.loadout] ?? {};
    r.cells[c.loadout][String(c.level)] = { pct: winPct(c), trials: c.trials };
  }
  save(store);
}

async function main() {
  const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7)?.split(',');
  const store = load();
  store.meta = {
    generated: '2026-09-07', tier: 'T5', realistic: false, jobs: JOBS,
    screenTrials: SCREEN, confirmTrials: CONFIRM, confirmAbove: CONFIRM_ABOVE, levels: LEVELS,
    method: 'singles+none measured on all of L7-L10 at 16; pairs screened on L7 at 16 and expanded to L8-L10 only if L7>0; anything >40% re-measured at 32; verdicts use 32-trial numbers only',
  };
  const ids = (only ?? runIds()).filter((id) => SIGNATURE[id]);
  for (const runId of ids) {
    if (store.runs[runId]?.done) { console.log(`skip ${runId} (done)`); continue; }
    const t0 = Date.now();
    const p = planFor(runId);
    store.runs[runId] = store.runs[runId] ?? {
      kit: p.kit, sig: p.sig, probes: p.probes, inKit: p.inKit, outKit: p.outKit, cells: {},
    };
    const r = store.runs[runId];
    r.kit = p.kit; r.sig = p.sig; r.probes = p.probes; r.inKit = p.inKit; r.outKit = p.outKit;
    const got = (lo: string, lv: number) => r.cells[lo]?.[String(lv)];

    // 1. none + singles, all levels, screen trials
    const base = ['none', ...p.singles];
    const needBase = base.filter((lo) => LEVELS.some((lv) => !got(lo, lv)));
    if (needBase.length) await measure(runId, needBase, LEVELS, SCREEN, store);

    // 2. all pairs, screen on L7
    const pairs = [...p.inKit, ...p.outKit];
    const needL7 = pairs.filter((lo) => !got(lo, 7));
    if (needL7.length) await measure(runId, needL7, [7], SCREEN, store);

    // 3. expand survivors (L7 > 0) to L8-L10
    const survivors = pairs.filter((lo) => (got(lo, 7)?.pct ?? 0) > 0);
    r.eliminatedAtL7 = pairs.filter((lo) => (got(lo, 7)?.pct ?? 0) === 0);
    const needRest = survivors.filter((lo) => [8, 9, 10].some((lv) => !got(lo, lv)));
    if (needRest.length) await measure(runId, needRest, [8, 9, 10], SCREEN, store);
    save(store);

    // 4. confirm at 32 trials anything above the bar (per loadout: re-measure the
    //    levels it has, so a confirmed loadout has a full 32-trial finale row)
    const hot = new Set<string>();
    for (const [lo, byLv] of Object.entries(r.cells)) {
      // singles + 'none' are the GATE check (bar = 8%), so confirm any nonzero read at 32.
      const bar = base.includes(lo) ? 0 : CONFIRM_ABOVE;
      for (const rec of Object.values(byLv)) if (rec.trials < CONFIRM && rec.pct > bar) hot.add(lo);
    }
    for (const lo of hot) {
      const lvs = LEVELS.filter((lv) => got(lo, lv) && got(lo, lv)!.trials < CONFIRM);
      if (lvs.length) await measure(runId, lo === 'none' ? ['none'] : [lo], lvs, CONFIRM, store);
    }
    r.done = true;
    save(store);
    const line = [...base, ...pairs]
      .map((lo) => `${lo}=${LEVELS.map((lv) => got(lo, lv) ? `${got(lo, lv)!.pct}` : '-').join('/')}`)
      .join('  ');
    console.log(`[${runId}] ${((Date.now() - t0) / 1000).toFixed(0)}s  ${line}`);
  }
  console.log('DONE');
}

if (process.argv[1]?.includes('multi-route-audit')) main().catch((e) => { console.error(e); process.exit(1); });
