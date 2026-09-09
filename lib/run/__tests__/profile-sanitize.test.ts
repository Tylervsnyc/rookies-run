/**
 * Saved-state safety: a profile persisted before an ability was cut (e.g.
 * Knighting, removed 2026-09-09) can still carry its id in `unlockedAbilities`.
 * `sanitizeProfile` must drop any id that no longer exists in ABILITY_DEFS —
 * silently, never by throwing — and keep everything that is still real.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ALL_ABILITY_IDS } from '../abilities';
import { isPlayerFacing } from '../../content/pipeline';
import { sanitizeProfile, STARTER_ABILITIES } from '../profile';

test('sanitizeProfile drops unknown ability ids and keeps known ones', () => {
  const known = new Set<string>(ALL_ABILITY_IDS);
  assert.ok(!known.has('knighting'), 'knighting must no longer be an ability id');

  // A real, player-facing, non-starter id — whatever the registry says today.
  const keep = ALL_ABILITY_IDS.find((id) => isPlayerFacing(id) && !STARTER_ABILITIES.includes(id));
  assert.ok(keep, 'need one player-facing non-starter ability to test with');

  const p = sanitizeProfile({
    unlockedAbilities: ['knighting', keep, 'definitely-not-an-ability', 42, null],
    achievements: {},
    counters: {},
  });

  assert.ok(!p.unlockedAbilities.includes('knighting' as never));
  assert.ok(!p.unlockedAbilities.includes('definitely-not-an-ability' as never));
  assert.ok(p.unlockedAbilities.includes(keep));
  for (const id of p.unlockedAbilities) assert.ok(known.has(id), `unexpected id ${id}`);
  for (const id of STARTER_ABILITIES) assert.ok(p.unlockedAbilities.includes(id));
});

test('sanitizeProfile never throws on garbage', () => {
  for (const raw of [null, undefined, 'x', 7, [], { unlockedAbilities: 'knighting' }, { unlockedAbilities: [{}] }]) {
    assert.doesNotThrow(() => sanitizeProfile(raw));
  }
});
