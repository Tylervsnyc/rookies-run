/**
 * The Caldera (revenge-54) — STUB. Signature pair intent: puppet + dragon.
 * Spec: docs/new-abilities-2026-09-19.md. Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_54: RunDef = {
  id: 'revenge-54',
  name: 'The Caldera',
  blurb: 'Stub.',
  allowedAbilities: ['puppet', 'dragon'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
