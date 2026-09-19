/**
 * The Daisy Chain (revenge-57) — STUB. Signature pair intent: chain + magnet.
 * Spec: docs/new-abilities-2026-09-19.md. Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_57: RunDef = {
  id: 'revenge-57',
  name: 'The Daisy Chain',
  blurb: 'Stub.',
  allowedAbilities: ['chain', 'magnet'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
