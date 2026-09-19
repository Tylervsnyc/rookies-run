/**
 * The Kaleidoscope (revenge-65) — STUB. Signature pair intent: mirror + convert.
 * Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_65: RunDef = {
  id: 'revenge-65',
  name: 'The Kaleidoscope',
  blurb: 'Stub.',
  allowedAbilities: ['mirror', 'convert'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
