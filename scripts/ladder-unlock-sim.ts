/**
 * The Ladder — fresh-profile playability proof.
 *
 *   npx tsx scripts/ladder-unlock-sim.ts
 *
 * Walks a brand-new profile up all ten rungs and asserts, at EVERY rung and on
 * every difficulty, that the run is actually playable: each of the four cards
 * in the rung's kit (`allowedAbilities` — which names the two the finale
 * requires) is in `profile.unlockedAbilities` at the moment the rung opens.
 *
 * This is the regression test for the bug the rebuild existed to fix:
 * `rollOffer` filters the slate by the player's unlocked set, so a combo run
 * whose signature card the player has never unlocked can never be solved.
 *
 * Exits non-zero on the first rung that would be unplayable.
 */

import { LADDER_RUNG_IDS, ladderRungIndex, rungKit, rungRun, rungState } from '../lib/run/ladder';
import { DIFFICULTY_ORDER, type DifficultyId } from '../lib/run/difficulty';
import { freshProfile, readProfile, recordLadderResult, writeProfile } from '../lib/run/profile';
import { isPlayerFacing, stageOf } from '../lib/content/pipeline';

let failures = 0;
function check(ok: boolean, msg: string): void {
  if (!ok) {
    failures++;
    console.error(`  FAIL  ${msg}`);
  }
}

function simulate(clearOn: DifficultyId): void {
  console.log(`\n=== Fresh profile, clearing every rung on ${clearOn.toUpperCase()} ===`);
  writeProfile(freshProfile());
  console.log(`  starter kit: ${readProfile().unlockedAbilities.join(', ')}`);

  for (let i = 0; i < LADDER_RUNG_IDS.length; i++) {
    const id = LADDER_RUNG_IDS[i];
    const run = rungRun(i);
    const profile = readProfile();
    const state = rungState(profile, i);
    const kit = rungKit(i);
    const have = new Set(profile.unlockedAbilities);
    const missing = kit.filter((a) => !have.has(a));

    check(!!run, `rung ${i + 1} (${id}) resolves to a RunDef`);
    check(state === 'open', `rung ${i + 1} (${id}) is open, got "${state}"`);
    check(kit.length > 0, `rung ${i + 1} (${id}) has a kit`);
    check(
      missing.length === 0,
      `rung ${i + 1} ${run?.name ?? id}: UNPLAYABLE — not unlocked: ${missing.join(', ')}`,
    );

    console.log(
      `  ${String(i + 1).padStart(2)}. ${(run?.name ?? id).padEnd(15)} ${id.padEnd(11)} kit=[${kit.join(', ')}]${missing.length ? `  MISSING ${missing.join(',')}` : '  ok'}`,
    );

    // Clear it — which must open rung i+1 and grant its kit.
    recordLadderResult(id, run?.levels.length ?? 10, 0, true, clearOn);
  }

  const done = readProfile();
  check(
    rungState(done, LADDER_RUNG_IDS.length - 1) === 'cleared',
    'the last rung reads cleared at the end of the walk',
  );
  console.log(`  final unlocked (${done.unlockedAbilities.length}): ${done.unlockedAbilities.join(', ')}`);
}

console.log('THE LADDER — fresh-profile unlock simulation');

// --- static integrity of the rung list -------------------------------------
console.log('\n=== Rung list integrity ===');
check(LADDER_RUNG_IDS.length === 10, `ten rungs, got ${LADDER_RUNG_IDS.length}`);
check(new Set(LADDER_RUNG_IDS).size === LADDER_RUNG_IDS.length, 'no duplicate rung ids');
for (let i = 0; i < LADDER_RUNG_IDS.length; i++) {
  const id = LADDER_RUNG_IDS[i];
  const run = rungRun(i);
  const stage = stageOf(id);
  check(!!run, `${id} is a known run id`);
  check(stage === 'testing' || stage === 'approved' || stage === 'live', `${id} stage is testing+ (got ${stage})`);
  check(ladderRungIndex(id) === i, `${id} indexes back to rung ${i + 1}`);
  // The load-bearing rule: a kit card that is not player-facing is stripped by
  // profile sanitize(), so the run could never be granted to a real player.
  const raw = (run?.allowedAbilities ?? []) as ReadonlyArray<string>;
  const notFacing = raw.filter((a) => !isPlayerFacing(a));
  check(notFacing.length === 0, `${id} kit is all live abilities (offending: ${notFacing.join(', ')})`);
}

// Every rung is a DISTINCT run, and no two rungs share the same 4-card kit
// (a proxy for "distinct signature pair" that a script can actually check).
const kitKeys = LADDER_RUNG_IDS.map((_, i) => [...rungKit(i)].sort().join('+'));
check(new Set(kitKeys).size === kitKeys.length, `no two rungs share a kit (${kitKeys.length - new Set(kitKeys).size} collisions)`);

// --- the walk, on each ladder-legal difficulty ------------------------------
for (const d of DIFFICULTY_ORDER) {
  if (d === 'nightmare') continue; // daily-only mode
  simulate(d);
}

console.log(
  failures === 0
    ? '\nPASS — a fresh profile can start rung 1 and reach rung 10 with every kit unlocked, on Rookie, Normal and Hard.'
    : `\nFAIL — ${failures} problem(s).`,
);
process.exit(failures === 0 ? 0 : 1);
