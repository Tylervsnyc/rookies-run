/**
 * level-first-smoke — does the bot USE the level-first five (2026-09-19)?
 *
 *   npx tsx scripts/run-playtest/level-first-smoke.ts [--trials=8] [--tier=T5]
 *
 * One tiny hand-built board per card, each a miniature of the crazy level the
 * card was invented for (docs/new-abilities-2026-09-19.md). Every board is
 * unwinnable for a lone rook, so `none` should read 0% and the card column is
 * the whole signal: did the bot find the cast, and did the cast pay.
 * A smoke proof, not a grade — the real numbers come from `revenge.ts matrix`
 * once the ten runs exist. Single process, no workers.
 */
import { maxUsesForTier } from '../../lib/run/abilities';
import type { AbilityId, AbilityTier, OwnedAbility } from '../../lib/run/abilities';
import { puzzleToBoardState } from '../../lib/run/seed';
import type { EnemyPiece, Hazard, RunPuzzle } from '../../lib/run/types';
import { botFor, playGame } from './revenge-core';
import { rngFromString } from './utils/rng';

const arg = (name: string, def: string): string =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? def;
const TRIALS = parseInt(arg('trials', '8'), 10);
const TIER = arg('tier', 'T5');

const E = (file: number, rank: number, type: EnemyPiece['type']): EnemyPiece => ({ type, color: 'black', file, rank });
const S = (file: number, rank: number): Hazard => ({ file, rank, kind: 'stone' });
const L = (file: number, rank: number): Hazard => ({ file, rank, kind: 'lava' });
const row = (rank: number, mk: (f: number, r: number) => Hazard): Hazard[] =>
  [1, 2, 3, 4, 5, 6, 7, 8].map((f) => mk(f, rank));
// A move budget (the flee-level chip) so a lone rook's `none` game ends instead of shuffling to MAX_TURNS.
const base = { level: 7, rookieStart: { file: 1, rank: 1 }, moveLimit: 12, winCondition: 'king' as const, kingBehavior: 'flee' as const };

/** The ring of lava around a 3x3 island centred on e5. */
const atollRing: Hazard[] = [];
for (let f = 3; f <= 7; f++) for (let r = 3; r <= 7; r++) if (f === 3 || f === 7 || r === 3 || r === 7) atollRing.push(L(f, r));

const SCENARIOS: { name: string; loadouts: string[]; puzzle: RunPuzzle }[] = [
  {
    // THE ATOLL: a king on a lava island. Nothing crosses; a castle puts her ON it.
    name: 'atoll',
    loadouts: ['none', 'castle:1', 'castle:4'],
    puzzle: { ...base, pieces: [E(6, 5, 'king')], hazards: atollRing, kingPen: ['d4', 'e4', 'f4', 'd5', 'e5', 'f5', 'd6', 'e6', 'f6'] },
  },
  {
    // THE GORGE: a lava river with no ford, loose stones on her bank.
    name: 'gorge',
    loadouts: ['none', 'catapult:1'],
    puzzle: { ...base, pieces: [E(5, 8, 'king')], hazards: [...row(5, L), S(2, 2), S(4, 2), S(6, 2), S(8, 2)], kingPen: ['d8', 'e8', 'f8'] },
  },
  {
    // THE LOOKING GLASS: the left tube to the king is corked from her side; its right twin is open.
    name: 'looking-glass',
    loadouts: ['none', 'mirror:1'],
    puzzle: {
      ...base,
      pieces: [E(2, 7, 'king')],
      hazards: [S(1, 8), S(2, 8), S(3, 8), S(1, 7), S(3, 7), ...[3, 4, 5, 6].flatMap((r) => [S(1, r), S(3, r)]), S(2, 2)],
      kingPen: ['b7'],
    },
  },
  {
    // THE BAFFLE: his cell's only mouth faces sideways down a dog-leg; the corner square is covered by a pawn.
    name: 'baffle',
    loadouts: ['none', 'ricochet:1'],
    puzzle: {
      ...base,
      pieces: [E(7, 7, 'king'), E(3, 8, 'pawn')],
      hazards: [S(2, 8), S(3, 7), S(4, 8), S(5, 8), S(6, 8), S(7, 8), S(8, 8), S(8, 7), S(5, 6), S(6, 6), S(7, 6), S(8, 6)],
      kingPen: ['g7'],
    },
  },
  {
    // THE SCREE: loose stone hanging over a lava gutter. One avalanche, two fords.
    name: 'scree',
    loadouts: ['none', 'avalanche:1'],
    puzzle: { ...base, pieces: [E(5, 8, 'king')], hazards: [...row(5, L), S(3, 4), S(6, 4)], kingPen: ['d8', 'e8', 'f8'] },
  },
];

function kit(loadout: string): OwnedAbility[] {
  if (loadout === 'none') return [];
  return loadout.split('+').map((part) => {
    const [id, t] = part.split(':');
    const tier = (t ? parseInt(t, 10) : 1) as AbilityTier;
    return { id: id as AbilityId, tier, mutations: [], usesLeftThisLevel: maxUsesForTier(id as AbilityId, tier) };
  });
}

const bot = botFor(TIER);
console.log(`[level-first smoke] trials=${TRIALS} tier=${TIER}`);
for (const sc of SCENARIOS) {
  const cells: string[] = [];
  for (const lo of sc.loadouts) {
    let wins = 0;
    let casts = 0;
    for (let t = 0; t < TRIALS; t++) {
      const seed = `smoke:${sc.name}:${lo}:${t}`;
      const rng = rngFromString(seed);
      const start = puzzleToBoardState(sc.puzzle, {
        abilities: kit(lo),
        aiRngSeed: (Math.floor(rng() * 0xffffffff) >>> 0) || 1,
        startRng: rngFromString(`${seed}:start`),
      });
      const { result } = playGame(start, bot, seed, 'dismiss');
      if (result.win) wins++;
      if (result.usedAbility) casts++;
    }
    cells.push(`${lo} ${wins}/${TRIALS}${lo === 'none' ? '' : ` (cast in ${casts})`}`);
  }
  console.log(`  ${sc.name.padEnd(14)} ${cells.join('   ')}`);
}
