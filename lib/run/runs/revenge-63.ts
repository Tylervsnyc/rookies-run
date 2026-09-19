/**
 * The Reflecting Pool (revenge-63) — STUB. Signature pair intent: mirror + boulder.
 * Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_63: RunDef = {
  id: 'revenge-63',
  name: 'The Reflecting Pool',
  blurb: 'Stub.',
  allowedAbilities: ['mirror', 'boulder'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
