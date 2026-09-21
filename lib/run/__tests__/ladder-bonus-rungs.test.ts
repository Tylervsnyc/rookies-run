/**
 * Bonus rungs ("11" and "12", lib/run/ladder.ts LADDER_BONUS_RUNG_IDS):
 * always open once player-facing, invisible until then, and never allowed to
 * change anything about the ten regular rungs.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isPlayerFacing } from '../../content/pipeline';
import {
  LADDER_BONUS_RUNG_IDS,
  LADDER_RUNG_IDS,
  bonusRungState,
  isLadderRunId,
  ladderUnlockedAbilities,
  rungState,
  visibleBonusRungs,
} from '../ladder';
import { getRunById } from '../runs';
import { sanitizeProfile, type PlayerProfile } from '../profile';
const defaultProfile = (): PlayerProfile => sanitizeProfile({});

/** Registry as-is, except the bonus runs + their kits count as approved. */
const approved = (id: string): boolean =>
  isPlayerFacing(id) ||
  LADDER_BONUS_RUNG_IDS.includes(id) ||
  LADDER_BONUS_RUNG_IDS.some((r) => (getRunById(r).allowedAbilities as ReadonlyArray<string> | undefined)?.includes(id));
/** Registry as-is, except the bonus runs are NOT player-facing. */
const hidden = (id: string): boolean => !LADDER_BONUS_RUNG_IDS.includes(id) && isPlayerFacing(id);

function withCleared(n: number): PlayerProfile {
  const p = defaultProfile();
  for (const id of LADDER_RUNG_IDS.slice(0, n)) p.ladder[id] = { cleared: true, bestLevels: 10, score: 20 };
  return p;
}
const regularStates = (p: PlayerProfile) => LADDER_RUNG_IDS.map((_, i) => rungState(p, i)).join(',');

test('bonus rungs are a separate list: the ladder is still exactly ten rungs', () => {
  assert.equal(LADDER_RUNG_IDS.length, 10);
  assert.deepEqual([...LADDER_BONUS_RUNG_IDS], ['revenge-64', 'revenge-65', 'revenge-61']);
  for (const id of LADDER_BONUS_RUNG_IDS) assert.ok(!LADDER_RUNG_IDS.includes(id));
});

test('bonus rungs are hidden while not player-facing: not rendered, not a ladder run, no kit', () => {
  assert.deepEqual(visibleBonusRungs({ facing: hidden }), []);
  for (const id of LADDER_BONUS_RUNG_IDS) assert.equal(isLadderRunId(id, hidden), false);
  const base = new Set(ladderUnlockedAbilities(defaultProfile(), hidden));
  assert.ok(!base.has('mirror' as never));
});

test('bonus rungs are open on a fresh profile once player-facing, numbered 11, 12 and 13', () => {
  const vis = visibleBonusRungs({ facing: approved });
  assert.deepEqual(vis.map((b) => [b.id, b.rung]), [['revenge-64', 11], ['revenge-65', 12], ['revenge-61', 13]]);
  const fresh = defaultProfile();
  for (const b of vis) {
    assert.equal(bonusRungState(fresh, b.id), 'open');
    assert.equal(isLadderRunId(b.id, approved), true);
  }
  fresh.ladder['revenge-64'] = { cleared: true, bestLevels: 10, score: 9 };
  assert.equal(bonusRungState(fresh, 'revenge-64'), 'cleared');
  assert.equal(bonusRungState(fresh, 'revenge-65'), 'open');
});

test('a visible bonus rung grants its kit to a fresh profile, by the same derivation as a regular rung', () => {
  const got = new Set<string>(ladderUnlockedAbilities(defaultProfile(), approved));
  for (const id of LADDER_BONUS_RUNG_IDS) {
    for (const a of getRunById(id).allowedAbilities ?? []) assert.ok(got.has(a), `${id} kit card ${a} not granted`);
  }
  // ...and grants nothing beyond rung 1's kit + the bonus kits.
  const without = new Set<string>(ladderUnlockedAbilities(defaultProfile(), hidden));
  const bonusKit = new Set<string>(LADDER_BONUS_RUNG_IDS.flatMap((id) => [...(getRunById(id).allowedAbilities ?? [])]));
  for (const a of got) assert.ok(without.has(a) || bonusKit.has(a), `unexpected grant ${a}`);
});

test('the dev preview never runs on the server / in tests', () => {
  assert.deepEqual(visibleBonusRungs({ preview: false, facing: hidden }), []);
  assert.equal(visibleBonusRungs({ preview: true, facing: hidden }).length, LADDER_BONUS_RUNG_IDS.length); // display only
  assert.ok(!ladderUnlockedAbilities(defaultProfile(), hidden).includes('mirror' as never));
});

test('regular rung states are byte-identical for a fresh profile, with or without bonus rungs', () => {
  const expected = 'open,locked,locked,locked,locked,locked,locked,locked,locked,locked';
  const p = defaultProfile();
  assert.equal(regularStates(p), expected);
  p.ladder['revenge-64'] = { cleared: true, bestLevels: 10, score: 9 };
  p.ladder['revenge-65'] = { cleared: true, bestLevels: 10, score: 9 };
  assert.equal(regularStates(p), expected, 'clearing bonus rungs must not open a regular rung');
});

test('regular rung states are byte-identical for a profile that cleared 3 rungs', () => {
  const expected = 'cleared,cleared,cleared,open,locked,locked,locked,locked,locked,locked';
  const p = withCleared(3);
  assert.equal(regularStates(p), expected);
  p.ladder['revenge-65'] = { cleared: true, bestLevels: 10, score: 9 };
  assert.equal(regularStates(p), expected);
  // Regular grants are unchanged by the bonus rungs being hidden vs visible, apart from the bonus kits.
  const a = new Set<string>(ladderUnlockedAbilities(p, hidden));
  const b = new Set<string>(ladderUnlockedAbilities(p, approved));
  for (const id of a) assert.ok(b.has(id));
});

test('bonus rungs never enter the daily rotation (adding to the pool would re-deal every date)', async () => {
  const { DAILY_EXCLUDED_RUN_IDS, getRunIdForDate } = await import('../daily');
  const { LADDER_BONUS_RUNG_IDS } = await import('../ladder');
  assert.deepEqual([...DAILY_EXCLUDED_RUN_IDS].sort(), [...LADDER_BONUS_RUNG_IDS].sort());
  for (let d = 1; d <= 28; d++) {
    const iso = `2026-10-${String(d).padStart(2, '0')}`;
    assert.ok(!LADDER_BONUS_RUNG_IDS.includes(getRunIdForDate(iso)), iso);
  }
});

test('the all-open demo switch is OFF unless the build sets it (the website never does)', async () => {
  const { LADDER_ALL_OPEN, rungState } = await import('../ladder');
  assert.equal(LADDER_ALL_OPEN, false);
  assert.equal(rungState(undefined, 0), 'open');
  assert.equal(rungState(undefined, 1), 'locked');
});
