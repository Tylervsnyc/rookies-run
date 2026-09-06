/**
 * matrix-determinism-check — the regression guard for playtest MEASUREMENT.
 *
 *   npx tsx scripts/run-playtest/matrix-determinism-check.ts
 *   npx tsx scripts/run-playtest/matrix-determinism-check.ts --run=revenge-27 --level=9 \
 *     --loadout=scarecrow:1+knight-hop:1 --others=none,aegis:1,hourglass:1 --trials=16
 *
 * A matrix cell must depend ONLY on (run, level, loadout, trial, tier). It
 * did not: the MCTS bot carried a process-lifetime decision counter into its
 * rollout RNG seed, so the same cell read one number alone and another as a
 * later column of a multi-column run, or under a different --jobs sharding
 * (2026-09-06). Rookie's random START FILE was a second leak — an unseeded
 * Math.random() inside puzzleToBoardState.
 *
 * This script measures ONE cell three ways and asserts all three agree
 * EXACTLY:
 *   1. alone                       (single loadout column)
 *   2. inside a 4-column read      (three other loadouts alongside it)
 *   3. at --jobs=3                 (different worker sharding)
 * Non-zero exit = the harness is lying again. Keep it in the nightly.
 */

import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const WORKER = join(__dirname, 'revenge.ts');

function arg(name: string, def: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
}

const RUN = arg('run', 'revenge-27');
const LEVEL = arg('level', '9');
const LOADOUT = arg('loadout', 'scarecrow:1+knight-hop:1');
const OTHERS = arg('others', 'none,aegis:1,hourglass:1');
const TRIALS = arg('trials', '16');
const TIER = arg('tier', 'T5');

interface Cell { level: number; loadout: string; wins: number; trials: number }

function matrix(loadouts: string, jobs: string): Cell[] {
  const out = execFileSync(
    'npx',
    ['tsx', WORKER, 'matrix', '--json', `--run=${RUN}`, `--levels=${LEVEL}`,
      `--loadouts=${loadouts}`, `--trials=${TRIALS}`, `--tier=${TIER}`, `--jobs=${jobs}`],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'inherit'] },
  );
  return (JSON.parse(out) as { cells: Cell[] }).cells;
}

function pick(cells: Cell[]): Cell {
  const c = cells.find((x) => x.loadout === LOADOUT);
  if (!c) throw new Error(`cell ${LEVEL}:${LOADOUT} missing from result`);
  return c;
}

const shapes: Array<[string, () => Cell]> = [
  ['alone            ', () => pick(matrix(LOADOUT, '1'))],
  ['4-column (jobs=1)', () => pick(matrix(`${OTHERS},${LOADOUT}`, '1'))],
  ['4-column (jobs=3)', () => pick(matrix(`${OTHERS},${LOADOUT}`, '3'))],
];

console.log(`[determinism] ${RUN} L${LEVEL} ${LOADOUT} — ${TRIALS} trials, ${TIER}`);
const seen: number[] = [];
for (const [label, run] of shapes) {
  const c = run();
  seen.push(c.wins);
  console.log(`  ${label}  ${c.wins}/${c.trials}`);
}

if (new Set(seen).size !== 1) {
  console.error(
    `\nFAIL — the same cell read ${seen.join(' / ')} across invocation shapes.\n` +
    `A measurement must depend only on (run, level, loadout, trial, tier).\n` +
    `Look for state shared between games in one process (a module-level\n` +
    `counter or cache in the bot) or an unseeded RNG in the engine.\n`,
  );
  process.exit(1);
}
console.log(`PASS — all three shapes agree (${seen[0]}/${TRIALS}).`);
