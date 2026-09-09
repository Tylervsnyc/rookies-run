/**
 * Endless FORMATIONS — before/after clear-rate sweep on depths 15-30.
 *
 * Measures the formation layer (lib/run/endless-formations.ts) the way Tyler
 * asked on 2026-09-09: does the ramp keep getting harder past ~17, and does a
 * level stay winnable? Every (seed, depth) board is played twice — with the
 * formation layer OFF (the ramp as it was) and ON — by the T5 bot, under two
 * loadouts:
 *
 *   none   no abilities: the "can a plain rook still find the door" read.
 *          Sweep bots ignore abilities anyway (memory: they never cast), so
 *          this is the honest bot number.
 *   kit    the session's first three rolled cards pinned to T5 — the maxed
 *          endgame kit a deep player really holds (Aegis T5 territory).
 *
 * Each cell is ONE game per seed (a depth is one board per seed, so more
 * trials per seed would only re-roll Rookie's start file). Use --seeds to
 * widen. Bands of 4 depths are reported; the per-depth rows go to JSON.
 *
 *   npx tsx scripts/run-playtest/endless-formations.ts [--seeds=24] [--from=15] [--to=30] [--out=path]
 */
import { writeFileSync } from 'node:fs';
import { ENDLESS_TEMPO_MAX, applyEndlessRamp, buildEndlessSession, endlessLevelAt, endlessRamp } from '../../lib/run/endless';
import { formationForDepth, rookPathToKing } from '../../lib/run/endless-formations';
import { maxUsesForTier } from '../../lib/run/abilities';
import { puzzleToBoardState, puzzleForDate } from '../../lib/run/seed';
import type { OwnedAbility } from '../../lib/run/types';
import { botFor, playGame } from './revenge-core';
import { rngFromString } from './utils/rng';

const arg = (k: string, d: string) => (process.argv.find((a) => a.startsWith(`--${k}=`)) ?? `--${k}=${d}`).split('=')[1];
const SEEDS = Number(arg('seeds', '24'));
const FROM = Number(arg('from', '15'));
const TO = Number(arg('to', '30'));
const OUT = arg('out', `data/run-playtest/endless-formations-${new Date().toISOString().slice(0, 10)}.json`);
const ISO = '2026-08-18';

type Loadout = 'none' | 'kit';
type Condition = 'before' | 'after';
interface Row {
  seed: number;
  depth: number;
  runId: string;
  level: number;
  formation: string;
  pieces: Record<Condition, number>;
  path: Record<Condition, number | null>;
  win: Record<Loadout, Record<Condition, boolean>>;
  failMode: Record<Loadout, Record<Condition, string>>;
}

function playOne(seed: number, depth: number, loadout: Loadout, condition: Condition) {
  const session = buildEndlessSession(seed);
  const ref = endlessLevelAt(session, depth - 1);
  const base = puzzleForDate(ISO, ref.levelIndex, ref.runId);
  const puzzle = applyEndlessRamp(base, depth, session.seed, { formations: condition === 'after' });
  const abilities: OwnedAbility[] =
    loadout === 'none'
      ? []
      : session.kit.slice(0, 3).map((id) => ({ id, tier: 5 as const, mutations: [], usesLeftThisLevel: maxUsesForTier(id, 5) }));
  const trialSeed = `endless-form:${seed}:${depth}:${loadout}`;
  const rng = rngFromString(trialSeed);
  const start = puzzleToBoardState(puzzle, {
    runId: ref.runId,
    abilities,
    tempo: 0,
    pendingOffer: null,
    difficulty: endlessRamp(depth).difficulty,
    tempoMax: ENDLESS_TEMPO_MAX,
    testkit: session.kit,
    endless: true,
    aiRngSeed: (Math.floor(rng() * 0xffffffff) >>> 0) || 1,
    startRng: rngFromString(`${trialSeed}:start`),
  });
  const { result } = playGame(start, botFor('T5'), trialSeed, 'random');
  return { ref, puzzle, result };
}

const rows: Row[] = [];
const t0 = Date.now();
for (let depth = FROM; depth <= TO; depth++) {
  for (let i = 0; i < SEEDS; i++) {
    const seed = 1000 + i * 7919;
    const pick = formationForDepth(seed, depth);
    const row: Row = {
      seed,
      depth,
      runId: '',
      level: 0,
      formation: pick ? `${pick.id}@${pick.intensity}${pick.secondary ? '+' + pick.secondary : ''}` : '',
      pieces: { before: 0, after: 0 },
      path: { before: null, after: null },
      win: { none: { before: false, after: false }, kit: { before: false, after: false } },
      failMode: { none: { before: '', after: '' }, kit: { before: '', after: '' } },
    };
    for (const condition of ['before', 'after'] as Condition[]) {
      for (const loadout of ['none', 'kit'] as Loadout[]) {
        const { ref, puzzle, result } = playOne(seed, depth, loadout, condition);
        row.runId = ref.runId;
        row.level = ref.levelIndex + 1;
        row.pieces[condition] = puzzle.pieces.length;
        row.path[condition] = rookPathToKing(puzzle);
        row.win[loadout][condition] = result.win;
        row.failMode[loadout][condition] = result.failMode;
      }
    }
    rows.push(row);
  }
  const at = rows.filter((r) => r.depth === depth);
  const pct = (l: Loadout, c: Condition) => Math.round((100 * at.filter((r) => r.win[l][c]).length) / at.length);
  console.log(
    `d${String(depth).padStart(2)}  none ${String(pct('none', 'before')).padStart(3)}% -> ${String(pct('none', 'after')).padStart(3)}%   kit ${String(pct('kit', 'before')).padStart(3)}% -> ${String(pct('kit', 'after')).padStart(3)}%   pieces ${(at.reduce((s, r) => s + r.pieces.before, 0) / at.length).toFixed(1)} -> ${(at.reduce((s, r) => s + r.pieces.after, 0) / at.length).toFixed(1)}   sealed after: ${at.filter((r) => r.path.after === null).length}   (${((Date.now() - t0) / 1000).toFixed(0)}s)`,
  );
}

console.log('\nBAND        none before  none after   kit before   kit after   avg pieces before->after');
for (let lo = FROM; lo <= TO; lo += 4) {
  const hi = Math.min(TO, lo + 3);
  const band = rows.filter((r) => r.depth >= lo && r.depth <= hi);
  const pct = (l: Loadout, c: Condition) => `${Math.round((100 * band.filter((r) => r.win[l][c]).length) / band.length)}%`.padStart(11);
  console.log(
    `L${lo}-${hi}`.padEnd(10) +
      pct('none', 'before') +
      pct('none', 'after') +
      pct('kit', 'before') +
      pct('kit', 'after') +
      `   ${(band.reduce((s, r) => s + r.pieces.before, 0) / band.length).toFixed(1)} -> ${(band.reduce((s, r) => s + r.pieces.after, 0) / band.length).toFixed(1)}`,
  );
}
writeFileSync(OUT, JSON.stringify({ seeds: SEEDS, from: FROM, to: TO, rows }, null, 1));
console.log(`\nwrote ${OUT} in ${((Date.now() - t0) / 60000).toFixed(1)}m`);
