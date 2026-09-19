/**
 * The Atoll (revenge-58) — STUB. Signature pair intent: castle + dragon.
 * Spec: docs/new-abilities-2026-09-19.md. Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_58: RunDef = {
  id: 'revenge-58',
  name: 'The Atoll',
  blurb: 'Stub.',
  allowedAbilities: ['castle', 'dragon'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
