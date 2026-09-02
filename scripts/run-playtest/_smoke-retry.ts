/**
 * Regression smoke: retrying a failed level fully re-seeds it (Tyler
 * playtest, 2026-09-02).
 *
 *   npx tsx scripts/run-playtest/_smoke-retry.ts
 *
 * Covers:
 *  1. Retry restores the move budget (moveCount 0, level's moveLimit).
 *  2. A one-charge finisher (Vanguard) spent on the FAILED attempt comes
 *     back on retry; one spent on a previously CLEARED level stays spent.
 *  3. Summons are cleared and enemies/king re-seeded on retry.
 *  4. ?refresh=1 playtest sessions refill everything on retry.
 *  5. Sacrifice detonates IMMEDIATELY on tap-card -> tap-summon, no move
 *     in between.
 */
import {
  abilitiesForRetry,
  applyAbilityActivate,
  applyAbilityTargeted,
  maxUsesForTier,
  refreshAbilityUses,
  vanguardRangeFor,
  type OwnedAbility,
} from '../../lib/run/abilities';
import { puzzleForDate, puzzleToBoardState } from '../../lib/run/seed';
import type { AllyPiece, BoardState } from '../../lib/run/types';

let failures = 0;
function check(name: string, ok: boolean, detail = '') {
  if (ok) console.log(`  ok   ${name}`);
  else {
    failures++;
    console.error(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const ISO = '2026-09-01';
const RUN = 'revenge-7';
const LEVEL_INDEX = 8; // "the 9th level"

function kit(): OwnedAbility[] {
  return (['vanguard', 'swap', 'sacrifice'] as const).map((id) => ({
    id,
    tier: 1 as const,
    mutations: [],
    usesLeftThisLevel: maxUsesForTier(id, 1),
  }));
}

function buildLevel(abilities: OwnedAbility[]): BoardState {
  const puzzle = puzzleForDate(ISO, LEVEL_INDEX, RUN);
  const s = puzzleToBoardState(puzzle, {
    abilities,
    runId: RUN,
    difficulty: 'normal',
  });
  return { ...s, pendingOffer: null };
}

function spend(abilities: OwnedAbility[], id: string): OwnedAbility[] {
  return abilities.map((a) =>
    a.id === id ? { ...a, usesLeftThisLevel: Math.max(0, a.usesLeftThisLevel - 1) } : a,
  );
}

// Mirrors app/page.tsx retryLevel: restore charges to the level-start
// snapshot, then rebuild the same level.
function retry(
  failed: BoardState,
  levelStart: OwnedAbility[],
  refreshAll = false,
): BoardState {
  const puzzle = puzzleForDate(ISO, LEVEL_INDEX, RUN);
  return puzzleToBoardState(puzzle, {
    abilities: abilitiesForRetry(failed.abilities, levelStart, refreshAll),
    tempo: failed.tempo,
    pendingOffer: failed.pendingOffer,
    runId: RUN,
    unlockedAbilities: failed.unlockedAbilities,
    testkit: failed.testkit,
    difficulty: failed.difficulty,
  });
}

console.log('1. Retry after a failed attempt with abilities spent');
{
  const start = buildLevel(kit());
  const levelStartSnapshot = start.abilities;
  const authoredLimit = start.moveLimit;
  // Failed attempt: burned 7 moves, spent vanguard (one-charge) + sacrifice,
  // a vanguard summon still stands, enemies thinned.
  const summon: AllyPiece = { id: 42, type: 'knight', file: 4, rank: 5, source: 'vanguard' };
  const failed: BoardState = {
    ...start,
    moveCount: 7,
    status: 'lost',
    abilities: spend(spend(start.abilities, 'vanguard'), 'sacrifice'),
    allies: [...start.allies, summon],
    pieces: start.pieces.slice(0, Math.max(1, start.pieces.length - 2)),
  };
  const again = retry(failed, levelStartSnapshot);
  check('moveCount back to 0', again.moveCount === 0);
  check('moveLimit back to the level budget', again.moveLimit === authoredLimit, `${again.moveLimit} vs ${authoredLimit}`);
  check(
    'vanguard charge restored (spent on FAILED attempt)',
    again.abilities.find((a) => a.id === 'vanguard')?.usesLeftThisLevel === 1,
  );
  check(
    'sacrifice charge restored',
    again.abilities.find((a) => a.id === 'sacrifice')?.usesLeftThisLevel === maxUsesForTier('sacrifice', 1),
  );
  check('summons cleared', !again.allies.some((a) => a.source === 'vanguard'));
  check('enemies re-seeded', again.pieces.length === start.pieces.length, `${again.pieces.length} vs ${start.pieces.length}`);
  check('king re-seeded', again.pieces.some((p) => p.type === 'king'));
  check('status back to playing', again.status === 'playing' && again.turn === 'rookie');
}

console.log('2. A charge spent on a PREVIOUS cleared level stays spent');
{
  // Level N: spend vanguard, clear the level. Level transition applies the
  // normal refresh (one-charge held). Snapshot is taken at N+1 start.
  const clearedWithSpentVanguard = spend(kit(), 'vanguard');
  const carried = refreshAbilityUses(clearedWithSpentVanguard); // goToNextLevel
  const nextLevel = buildLevel(carried);
  const snapshotAtNextStart = nextLevel.abilities;
  check(
    'vanguard still spent at next level start',
    snapshotAtNextStart.find((a) => a.id === 'vanguard')?.usesLeftThisLevel === 0,
  );
  const failed: BoardState = { ...nextLevel, moveCount: 5, status: 'lost' };
  const again = retry(failed, snapshotAtNextStart);
  check(
    'retry does NOT resurrect the previously spent charge',
    again.abilities.find((a) => a.id === 'vanguard')?.usesLeftThisLevel === 0,
  );
  check(
    'support ability still refreshed',
    again.abilities.find((a) => a.id === 'sacrifice')?.usesLeftThisLevel === maxUsesForTier('sacrifice', 1),
  );
}

console.log('3. ?refresh=1 playtest session refills everything on retry');
{
  const start = buildLevel(spend(kit(), 'vanguard')); // even a stale spent charge
  const failed: BoardState = { ...start, moveCount: 3, status: 'lost' };
  const again = retry(failed, start.abilities, true);
  for (const a of again.abilities) {
    check(`${a.id} refilled`, a.usesLeftThisLevel === maxUsesForTier(a.id, a.tier));
  }
}

console.log('4. Sacrifice detonates immediately: tap card -> tap summon');
{
  const start = buildLevel(kit());
  const enemy = start.pieces.find((p) => p.type !== 'king')!;
  const summon: AllyPiece = {
    id: 7,
    type: 'knight',
    file: enemy.file,
    rank: Math.max(1, enemy.rank - 2), // enemy sits on a knight-attack square
    source: 'vanguard',
  };
  const withSummon: BoardState = { ...start, allies: [...start.allies, summon] };
  const activated = applyAbilityActivate(withSummon, 'sacrifice');
  check('card tap arms sacrifice', activated.activeAbility?.id === 'sacrifice');
  const boom = applyAbilityTargeted(activated, 'sacrifice', { file: summon.file, rank: summon.rank });
  check('summon tap resolves without a move', boom !== activated && boom.moveCount === withSummon.moveCount);
  check('summon consumed', !boom.allies.some((a) => a.id === 7));
  check('threatened enemies captured', boom.captures.length > withSummon.captures.length);
  check('sacrifice charge decremented', boom.abilities.find((a) => a.id === 'sacrifice')?.usesLeftThisLevel === 0);
}

console.log('5. Vanguard placement is range-capped at every tier');
{
  const ranges = [1, 2, 3, 4, 5].map((t) => vanguardRangeFor(t as 1 | 2 | 3 | 4 | 5));
  check('T1..T5 ranges are 2/3/4/4/5', JSON.stringify(ranges) === '[2,3,4,4,5]', JSON.stringify(ranges));
  check('never whole-board', ranges.every((r) => r < 7));
}

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('\nAll retry-regression checks passed.');
