/**
 * The Hall of Mirrors (revenge-64) — STUB. Signature pair intent: mirror + sacrifice.
 * Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_64: RunDef = {
  id: 'revenge-64',
  name: 'The Hall of Mirrors',
  blurb: 'Stub.',
  allowedAbilities: ['mirror', 'sacrifice'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
