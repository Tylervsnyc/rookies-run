/**
 * Sharded worker for the full summoning-sickness evaluation (_sickness-full.ts).
 *
 * Same suites, same seeds, same numbers — just split across processes so the
 * ladder does not take two hours per side. Every cell's seed depends only on
 * (difficulty, runId) and every endless session's on its index, so shard N of M
 * produces exactly the rows the serial script would have produced for those
 * cells. Merge with _sickness-merge.ts.
 *
 *   npx tsx scripts/run-playtest/_sickness-shard.ts <out.json> <runs> <sessions> <shard> <shards>
 */
import { writeFileSync } from 'node:fs';
import { LADDER_RUNG_IDS } from '../../lib/run/ladder';
import { DIFFICULTIES, type DifficultyId } from '../../lib/run/difficulty';
import { puzzleToBoardState, puzzleForDate } from '../../lib/run/seed';
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

const OUT = process.argv[2];
const RUNS = Number(process.argv[3] ?? 60);
const SESSIONS = Number(process.argv[4] ?? 60);
const SHARD = Number(process.argv[5] ?? 0);
const SHARDS = Number(process.argv[6] ?? 1);
const MAX_DEPTH = 60;
const ISO = '2026-08-18';

type LadderRow = { rung: number; runId: string; difficulty: DifficultyId; clearPct: number; retries: number; deaths: Record<number, number> };

function ladderSuite(): LadderRow[] {
  const out: LadderRow[] = [];
  let cell = -1;
  for (const difficulty of ['normal', 'hard'] as DifficultyId[]) {
    const retriesPerLevel = DIFFICULTIES[difficulty].retriesPerLevel;
    for (let i = 0; i < LADDER_RUNG_IDS.length; i++) {
      cell++;
      if (cell % SHARDS !== SHARD) continue;
      const runId = LADDER_RUNG_IDS[i];
      const rep = simulateRuns({ runId, difficulty, iso: ISO }, RUNS, 'T5', {
        retriesPerLevel,
        seedPrefix: `sick:${difficulty}:${runId}`,
      });
      const deaths: Record<number, number> = {};
      for (const r of rep.rows) if (r.reached > r.cleared) deaths[r.level] = r.reached - r.cleared;
      out.push({
        rung: i + 1,
        runId,
        difficulty,
        clearPct: Math.round((rep.fullClears / RUNS) * 100),
        retries: rep.retriesUsed,
        deaths,
      });
      console.log(`[s${SHARD}][ladder ${difficulty}] rung ${i + 1} ${runId.padEnd(11)} clear ${String(Math.round((rep.fullClears / RUNS) * 100)).padStart(3)}%  retries ${rep.retriesUsed}`);
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

function endlessSuite(): { index: number; depth: number }[] {
  const out: { index: number; depth: number }[] = [];
  for (let i = 0; i < SESSIONS; i++) {
    if (i % SHARDS !== SHARD) continue;
    out.push({ index: i, depth: endlessSession(1000 + i * 7919) });
  }
  console.log(`[s${SHARD}][endless] ${out.length} sessions done`);
  return out;
}

(async () => {
  const t0 = Date.now();
  const ladder = ladderSuite();
  const endless = endlessSuite();
  writeFileSync(OUT, JSON.stringify({ shard: SHARD, shards: SHARDS, runs: RUNS, sessions: SESSIONS, ladder, endless }, null, 1));
  console.log(`[s${SHARD}] wrote ${OUT} in ${((Date.now() - t0) / 1000 / 60).toFixed(1)}m`);
})();
