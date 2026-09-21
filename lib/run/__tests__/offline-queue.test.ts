/**
 * The offline save queue's decisions (lib/net): which responses mean a
 * finished run's write did NOT land and must be queued, and how the queue is
 * kept from growing forever. The IndexedDB and fetch plumbing around these is
 * browser-only; the decisions are pure, and they are what lost runs before.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isQueueableWrite, isUndelivered } from '../../net/api-policy';
import { MAX_ENTRIES, overflowIds } from '../../net/outbox';

test('only the two idempotent run writes are queueable', () => {
  assert.equal(isQueueableWrite('/api/run/score', 'POST'), true);
  assert.equal(isQueueableWrite('/api/run/complete', 'POST'), true);
  assert.equal(isQueueableWrite('/api/run/score', 'GET'), false);
  assert.equal(isQueueableWrite('/api/run-trace', 'POST'), false);
  assert.equal(isQueueableWrite('/api/playtest-feedback', 'POST'), false);
});

test('a 5xx is undelivered (the write never landed)', () => {
  for (const status of [500, 502, 503, 504]) {
    assert.equal(isUndelivered(status, 'application/json'), true, `status ${status}`);
    assert.equal(isUndelivered(status, 'text/html'), true, `status ${status} html`);
  }
});

test('a captive-portal HTML page served as 200 is undelivered', () => {
  assert.equal(isUndelivered(200, 'text/html; charset=utf-8'), true);
  assert.equal(isUndelivered(200, null), true);
});

test('a real JSON success is delivered', () => {
  assert.equal(isUndelivered(200, 'application/json'), false);
  assert.equal(isUndelivered(200, 'application/json; charset=utf-8'), false);
});

test('a 4xx is a refusal, not a delivery failure — never replayed', () => {
  for (const status of [400, 401, 403, 404, 422]) {
    assert.equal(isUndelivered(status, 'application/json'), false, `status ${status}`);
  }
});

test('overflowIds evicts the oldest entries past the cap, and nothing under it', () => {
  const entries = (n: number) => Array.from({ length: n }, (_, i) => ({ id: i + 1 }));

  assert.deepEqual(overflowIds(entries(3), 5), []);
  assert.deepEqual(overflowIds(entries(5), 5), []);
  assert.deepEqual(overflowIds(entries(7), 5), [1, 2]);

  // Unsorted input and entries without an id (not yet persisted) are handled.
  assert.deepEqual(overflowIds([{ id: 9 }, { id: 3 }, {}, { id: 6 }], 2), [3]);

  // The default cap is the exported one, and it is finite.
  assert.ok(Number.isFinite(MAX_ENTRIES) && MAX_ENTRIES > 0);
  assert.equal(overflowIds(entries(MAX_ENTRIES + 1)).length, 1);
});
