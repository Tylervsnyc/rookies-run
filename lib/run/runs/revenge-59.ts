/**
 * The Gorge (revenge-59) — STUB. Signature pair intent: catapult + convert.
 * Spec: docs/new-abilities-2026-09-19.md. Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_59: RunDef = {
  id: 'revenge-59',
  name: 'The Gorge',
  blurb: 'Stub.',
  allowedAbilities: ['catapult', 'convert'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
