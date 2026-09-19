/**
 * The Crypt (revenge-55) — STUB. Signature pair intent: raise + sacrifice.
 * Spec: docs/new-abilities-2026-09-19.md. Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_55: RunDef = {
  id: 'revenge-55',
  name: 'The Crypt',
  blurb: 'Stub.',
  allowedAbilities: ['raise', 'sacrifice'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
