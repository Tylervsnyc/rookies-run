/**
 * Rookie's Revenge playtest harness (CLI + worker entry).
 *
 *   npx tsx scripts/run-playtest/revenge.ts matrix [--trials=30] [--levels=1,2,3] [--loadouts=none,surge] [--tier=T5] [--realistic] [--difficulty=rookie|normal|hard|nightmare]
 *   npx tsx scripts/run-playtest/revenge.ts runs   [--runs=100] [--tier=T5] [--pool=surge,freeze-ray,drones]  # full runs, random pick from the pool
 *   npx tsx scripts/run-playtest/revenge.ts solve  [--levels=...] [--loadouts=...] [--depth=6] [--nodes=200000]
 *   npx tsx scripts/run-playtest/revenge.ts trace  --level=8 --loadout=surge [--tier=T6]
 *   npx tsx scripts/run-playtest/revenge.ts lint   [--levels=...]
 *
 * matrix — every level × every loadout (no ability + each ability alone) × N
 *          trials with the MCTS bot. Records win %, loss modes and the
 *          "stall" share (timeout with the king still alive = unreachable).
 * runs   — plays the run L1→L10 the way a player would: takes a RANDOM option
 *          from every free level offer (never skips), plays with the loadout.
 * solve  — AND-OR search: is there a FORCED capture within D Rookie moves,
 *          against every enemy tie-break? Conservative (dismisses offers).
 *
 * `--run=<id>` picks any Revenge run (listed or hidden). `--json` = JSON on
 * stdout. The engine itself lives in revenge-core.ts; the nightly
 * (revenge-nightly.ts) spawns this file in worker mode (`--pairs=`).
 */

import { applyDismissOffer, type AbilityId } from '../../lib/run/abilities';
import { rookieLegalMoves } from '../../lib/run/movement';
import { isDifficultyId, type DifficultyId } from '../../lib/run/difficulty';
import type { BoardState } from '../../lib/run/types';
import { toSquare } from '../../lib/run/types';
import { applyBotAction } from './bots/apply';
import { enemyAttackedSquares } from './bots/shared';
import { settleEnemyTurns } from './bots/t3';
import type { BotContext } from './types';
import { rngFromString } from './utils/rng';
import {
  ALL_LOADOUTS,
  botFor,
  defaultJobs,
  levelCountFor,
  loadoutFor,
  matrixParallel,
  runMatrixCell,
  simulateRuns,
  solveLevel,
  solveParallel,
  startState,
  type Cell,
  type RevengeCfg,
  type SolveResult,
} from './revenge-core';

// ─────────────────────────────────────────────────────────────────────────────
// Args

function arg(name: string, def?: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  if (process.argv.includes(`--${name}`)) return 'true';
  return def;
}
const JSON_OUT = process.argv.includes('--json');
/** Which Revenge run to test (any id in RUNS or HIDDEN_RUNS). `--run=revenge-2` */
const RUN_ID = arg('run', 'revenge-1')!;
const DIFFICULTY: DifficultyId | undefined = (() => {
  const d = arg('difficulty');
  return d && isDifficultyId(d) ? d : undefined;
})();
const CFG: RevengeCfg = {
  runId: RUN_ID,
  ...(DIFFICULTY ? { difficulty: DIFFICULTY } : {}),
  ...(arg('iso') ? { iso: arg('iso') } : {}),
  // --pool=surge,freeze-ray,drones — restrict offers to the player's unlocked
  // set (the starter kit). Applies to `runs` (offers taken) and `matrix`.
  ...(arg('pool') ? { pool: arg('pool')!.split(',').map((x) => x.trim()).filter(Boolean) as AbilityId[] } : {}),
};

function parseList(v: string | undefined, all: string[]): string[] {
  if (!v || v === 'all') return all;
  return v.split(',').map((x) => x.trim()).filter(Boolean);
}

function allLevels(): number[] {
  return Array.from({ length: levelCountFor(RUN_ID) }, (_, i) => i + 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// matrix

function matrixMain(): void {
  const trials = parseInt(arg('trials', '30')!, 10);
  const tier = arg('tier', 'T5')!;
  const realistic = arg('realistic') === 'true';
  const levels = parseList(arg('levels'), allLevels().map(String)).map(Number);
  const loadouts = parseList(arg('loadouts'), [...ALL_LOADOUTS]);
  const t0 = Date.now();
  matrixParallel(CFG, { levels, loadouts, trials, tier, realistic, jobs: defaultJobs(parseInt(arg('jobs', '8')!, 10)) })
    .then((cells) => {
      const dt = ((Date.now() - t0) / 1000).toFixed(0);
      if (JSON_OUT) {
        console.log(JSON.stringify({ tier, trials, realistic, seconds: Number(dt), cells }, null, 1));
        return;
      }
      printMatrix(cells, loadouts, levels);
      console.error(
        `[revenge matrix] ${cells.length} cells × ${trials} trials in ${dt}s (${tier}${realistic ? ', realistic tiers' : ''}${DIFFICULTY ? `, difficulty=${DIFFICULTY}` : ''})`,
      );
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

function printMatrix(cells: Cell[], loadouts: string[], levels: number[]): void {
  const short = (s: string) => (s === 'none' ? 'none' : s.replace('-', '').slice(0, 7));
  const head = ['L', ...loadouts.map(short)].map((h) => h.padStart(8)).join('');
  console.log(head);
  for (const lv of levels) {
    const row = [String(lv).padStart(8)];
    for (const lo of loadouts) {
      const c = cells.find((x) => x.level === lv && x.loadout === lo);
      if (!c) { row.push('-'.padStart(8)); continue; }
      const pct = Math.round((c.wins / c.trials) * 100);
      const stall = c.stall > 0 ? `s${c.stall}` : '';
      row.push(`${pct}%${stall}`.padStart(8));
    }
    console.log(row.join(''));
  }
}

/** Worker entry: explicit (level:loadout) pairs, JSON cells on stdout. */
function matrixWorkerPairs(): boolean {
  const pairs = arg('pairs');
  if (!pairs) return false;
  const trials = parseInt(arg('trials', '30')!, 10);
  const tier = arg('tier', 'T5')!;
  const realistic = arg('realistic') === 'true';
  const cells: Cell[] = [];
  for (const p of pairs.split(',')) {
    // Split on the FIRST colon only — the loadout may pin tiers ("boulder:2").
    const i = p.indexOf(':');
    const lv = p.slice(0, i);
    const lo = p.slice(i + 1);
    cells.push(runMatrixCell(CFG, Number(lv), lo, trials, tier, realistic));
  }
  process.stdout.write(JSON.stringify(cells));
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// runs

function runsMain(): void {
  const n = parseInt(arg('runs', '60')!, 10);
  const tier = arg('tier', 'T5')!;
  const unlocked = arg('unlocked') ?? arg('pool'); // --pool is an alias
  const retries = arg('retries');
  const report = simulateRuns(CFG, n, tier, {
    ...(unlocked ? { unlockedAbilities: unlocked.split(',').map((x) => x.trim()).filter(Boolean) } : {}),
    ...(retries ? { retriesPerLevel: parseInt(retries, 10) } : {}),
    ...(arg('seed-prefix') ? { seedPrefix: arg('seed-prefix') } : {}),
  });
  if (JSON_OUT) {
    console.log(JSON.stringify(report, null, 1));
    return;
  }
  console.log(`[revenge runs] ${n} runs, ${tier}, random level picks${unlocked ? `, pool=${unlocked}` : ''}${retries ? `, retries=${retries}` : ''} — full clears ${report.fullClears}/${n}, retries used ${report.retriesUsed ?? 0} (${report.seconds}s)`);
  for (const row of report.rows) {
    console.log(
      `L${String(row.level).padStart(2)}  reached ${String(row.reached).padStart(3)}  cleared ${String(row.cleared).padStart(3)}  ${String(row.clearRate ?? '-').padStart(3)}%  ${JSON.stringify(row.losses)}`,
    );
  }
  console.log('picks:', JSON.stringify(report.pickCounts));
}

// ─────────────────────────────────────────────────────────────────────────────
// solve

function solveMain(): void {
  const levels = parseList(arg('levels'), allLevels().map(String)).map(Number);
  const loadouts = parseList(arg('loadouts'), [...ALL_LOADOUTS]);
  const depth = parseInt(arg('depth', '6')!, 10);
  const nodes = parseInt(arg('nodes', '150000')!, 10);
  const worker = arg('pairs');
  if (worker) {
    const out: SolveResult[] = [];
    for (const p of worker.split(',')) {
      const i = p.indexOf(':');
      const lv = p.slice(0, i);
      const lo = p.slice(i + 1);
      out.push(solveLevel(CFG, Number(lv), lo, depth, nodes));
    }
    process.stdout.write(JSON.stringify(out));
    return;
  }
  const t0 = Date.now();
  solveParallel(CFG, { levels, loadouts, depth, nodes, jobs: defaultJobs(parseInt(arg('jobs', '8')!, 10)) })
    .then((results) => {
      const dt = ((Date.now() - t0) / 1000).toFixed(0);
      if (JSON_OUT) {
        console.log(JSON.stringify({ depth, nodes, seconds: Number(dt), results }, null, 1));
        return;
      }
      const short = (s: string) => (s === 'none' ? 'none' : s.replace('-', '').slice(0, 7));
      console.log(['L', ...loadouts.map(short)].map((h) => h.padStart(8)).join(''));
      for (const lv of levels) {
        const row = [String(lv).padStart(8)];
        for (const lo of loadouts) {
          const r = results.find((x) => x.level === lv && x.loadout === lo);
          if (!r) { row.push('-'.padStart(8)); continue; }
          row.push(
            (r.verdict === 'forced-win' ? `W${r.depth}` : r.verdict === 'unknown' ? `?${r.depth}` : `no${r.depth}`).padStart(8),
          );
        }
        console.log(row.join(''));
      }
      console.error(`[revenge solve] ${results.length} cells in ${dt}s (depth ${depth}, ${nodes} nodes)`);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// trace — print one game move by move (debug)

function traceMain(): void {
  const level = parseInt(arg('level', '3')!, 10);
  const loadout = arg('loadout', 'none')!;
  const trial = parseInt(arg('trial', '0')!, 10);
  const seed = `revenge:${level}:${loadout}:${trial}`;
  const start = startState(CFG, level, loadoutFor(loadout, level, arg('realistic') === 'true'), seed);
  const bot = botFor(arg('tier', 'T5')!);
  const ctx: BotContext = { excludedAbilities: new Set(), forcedAcceptIds: new Set(), forcedSkipIds: new Set(), rng: rngFromString(seed + ':bot') };
  let s = start;
  const show = (st: BoardState) => {
    const k = st.pieces.find((p) => p.type === 'king');
    return `R@${toSquare(st.rookie)}(${st.form}) K@${k ? toSquare(k) : '-'} stun=${st.kingStunTurns ?? 0} pieces=${st.pieces.map((p) => p.type[0] + toSquare(p)).join(' ')} allies=${st.allies.map((a) => a.type[0] + toSquare(a)).join(' ')} legal=${rookieLegalMoves(st).map(toSquare).join(',')}`;
  };
  console.log(`start: ${show(s)}`);
  for (let i = 0; i < 80 && s.status === 'playing'; i++) {
    if (s.pendingOffer) { s = applyDismissOffer(s); continue; }
    if (s.turn !== 'rookie') { s = settleEnemyTurns(s); console.log(`  enemy → ${show(s)}`); continue; }
    const a = bot.decide(s, ctx);
    const next = applyBotAction(s, a);
    console.log(`R: ${JSON.stringify(a)}`);
    if (next === s) { console.log('  no-op'); break; }
    s = next;
    console.log(`  → ${show(s)}`);
  }
  console.log(`end: ${s.status}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// lint — static read of each level: keys on the king's lines, safe line squares

function lintMain(): void {
  const levels = parseList(arg('levels'), allLevels().map(String)).map(Number);
  for (const lv of levels) {
    const st = startState(CFG, lv, [], `lint:${lv}`);
    const king = st.pieces.find((p) => p.type === 'king');
    if (!king) { console.log(`L${lv}: no king`); continue; }
    const attacked = enemyAttackedSquares(st);
    const keys: string[] = [];
    const lineSquares: string[] = [];
    for (const [df, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      let f = king.file + df, r = king.rank + dr;
      while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
        if (st.hazards.some((h) => h.file === f && h.rank === r)) break;
        const piece = st.pieces.find((p) => p.file === f && p.rank === r);
        const sq = toSquare({ file: f, rank: r });
        if (piece) {
          keys.push(`${piece.type}@${sq}${attacked.has(sq) ? '(defended)' : '(FREE KEY)'}`);
          break;
        }
        lineSquares.push(`${sq}${attacked.has(sq) ? '' : '*'}`);
        f += df; r += dr;
      }
    }
    const pen = st.kingPen ?? [];
    console.log(`L${lv} K@${toSquare(king)} pen=[${pen.join(' ')}]`);
    console.log(`   keys on his lines: ${keys.join(', ') || '-'}`);
    console.log(`   line squares (* = not attacked): ${lineSquares.join(' ') || '-'}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

const mode = process.argv[2];
if (mode === 'matrix') {
  if (!matrixWorkerPairs()) matrixMain();
} else if (mode === 'runs') runsMain();
else if (mode === 'solve') solveMain();
else if (mode === 'trace') traceMain();
else if (mode === 'lint') lintMain();
else {
  console.error('usage: revenge.ts matrix|runs|solve|trace|lint [--flags]');
  process.exit(1);
}
