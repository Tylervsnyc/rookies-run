/**
 * FULL evaluation of summoning sickness — the ladder AND endless.
 *
 * Tyler, 2026-09-08: "do extensive testing on that proposed rule change to see
 * how it affects all the ladder and endless. I def want this to be harder but
 * not impossible."
 *
 * Two suites, because the two modes fail differently:
 *   LADDER  — full runs L1..L10 with random picks, on each difficulty's REAL
 *             retry budget. Reports full-clear %, retries burned, and the
 *             level people die on. A ladder rung is "impossible" when the run
 *             ends, not when one level is lost.
 *   ENDLESS — whole sessions, one life, random 5-card kit, the shipped ramp
 *             and reinforcements. Reports the DEPTH distribution, which is the
 *             only honest measure of "harder but not impossible" in a mode
 *             with no finish line.
 *
 * Run once on HEAD, once with the sickness patch applied, and diff.
 *   npx tsx scripts/run-playtest/_sickness-full.ts <out.json> [runs] [sessions]
 */
import { writeFileSync } from 'node:fs';
import { LADDER_RUNG_IDS } from '../../lib/run/ladder';
import { DIFFICULTIES, type DifficultyId } from '../../lib/run/difficulty';
import { puzzleToBoardState } from '../../lib/run/seed';
import { puzzleForDate } from '../../lib/run/seed';
import {
  ENDLESS_TEMPO_MAX,
  applyEndlessRamp,
  buildEndlessSession,
  endlessLevelAt,
  endlessRamp,
} from '../../lib/run/endless';
import type { BoardState, OwnedAbility } from '../../lib/run/types';
import { botFor, playGame, simulateRuns } from './revenge-core';
import { rngFromString } from './utils/rng';

const OUT = process.argv[2] ?? 'data/run-playtest/sickness-full.json';
const RUNS = Number(process.argv[3] ?? 60);
const SESSIONS = Number(process.argv[4] ?? 60);
const MAX_DEPTH = 60;
const ISO = '2026-08-18';

type LadderRow = { rung: number; runId: string; difficulty: DifficultyId; clearPct: number; retries: number; deaths: Record<number, number> };

function ladderSuite(): LadderRow[] {
  const out: LadderRow[] = [];
  for (const difficulty of ['normal', 'hard'] as DifficultyId[]) {
    const retriesPerLevel = DIFFICULTIES[difficulty].retriesPerLevel;
    for (let i = 0; i < LADDER_RUNG_IDS.length; i++) {
      const runId = LADDER_RUNG_IDS[i];
      const rep = simulateRuns({ runId, difficulty, iso: ISO }, RUNS, 'T5', {
        retriesPerLevel,
        seedPrefix: `sick:${difficulty}:${runId}`,
      });
      const deaths: Record<number, number> = {};
      for (const r of rep.rows) if (r.reached > r.cleared) deaths[r.level] = r.reached - r.cleared;
      const row: LadderRow = {
        rung: i + 1,
        runId,
        difficulty,
        clearPct: Math.round((rep.fullClears / RUNS) * 100),
        retries: rep.retriesUsed,
        deaths,
      };
      out.push(row);
      console.log(`[ladder ${difficulty}] rung ${row.rung} ${runId.padEnd(11)} clear ${String(row.clearPct).padStart(3)}%  retries ${row.retries}`);
    }
  }
  return out;
}

/** One Endless session, one life. Returns the depth reached (1-based). */
function endlessSession(seed: number): number {
  const session = buildEndlessSession(seed);
  const bot = botFor('T5');
  let abilities: OwnedAbility[] = [];
  let tempo = 0;
  let pending: BoardState['pendingOffer'] = null;
  for (let depth = 1; depth <= MAX_DEPTH; depth++) {
    const ref = endlessLevelAt(session, depth - 1);
    const puzzle = applyEndlessRamp(puzzleForDate(ISO, ref.levelIndex, ref.runId), depth, session.seed);
    const trialSeed = `endless:${seed}:${depth}`;
    const rng = rngFromString(trialSeed);
    const start = puzzleToBoardState(puzzle, {
      runId: ref.runId,
      abilities,
      tempo,
      pendingOffer: pending,
      difficulty: endlessRamp(depth).difficulty,
      tempoMax: ENDLESS_TEMPO_MAX,
      testkit: session.kit,
      aiRngSeed: (Math.floor(rng() * 0xffffffff) >>> 0) || 1,
      startRng: rngFromString(`${trialSeed}:start`),
    });
    const { result, final } = playGame(start, bot, trialSeed, 'random');
    abilities = final.abilities;
    tempo = final.tempo;
    pending = final.pendingOffer;
    if (!result.win) return depth; // one life — the floor you died on
  }
  return MAX_DEPTH;
}

function endlessSuite(): number[] {
  const depths: number[] = [];
  for (let i = 0; i < SESSIONS; i++) {
    const d = endlessSession(1000 + i * 7919);
    depths.push(d);
    if ((i + 1) % 10 === 0) console.log(`[endless] ${i + 1}/${SESSIONS} sessions, median so far ${median(depths)}`);
  }
  return depths;
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
}

(async () => {
  const t0 = Date.now();
  const ladder = ladderSuite();
  const endless = endlessSuite();
  const sorted = [...endless].sort((a, b) => a - b);
  const summary = {
    ladder,
    endless: {
      depths: endless,
      median: median(endless),
      p10: sorted[Math.floor(sorted.length * 0.1)],
      p90: sorted[Math.floor(sorted.length * 0.9)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
    },
  };
  writeFileSync(OUT, JSON.stringify(summary, null, 1));
  console.log(`\nENDLESS depth: median ${summary.endless.median}  p10 ${summary.endless.p10}  p90 ${summary.endless.p90}  range ${summary.endless.min}-${summary.endless.max}`);
  console.log(`wrote ${OUT} in ${((Date.now() - t0) / 1000 / 60).toFixed(1)}m`);
})();
