/**
 * The Funhouse (revenge-66) — STUB. Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_66: RunDef = {
  id: 'revenge-66',
  name: 'The Funhouse',
  blurb: 'Stub.',
  allowedAbilities: ['mirror', 'boulder'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
