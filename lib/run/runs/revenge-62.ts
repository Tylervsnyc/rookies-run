/**
 * The Scree (revenge-62) — STUB. Signature pair intent: avalanche + boulder.
 * Spec: docs/new-abilities-2026-09-19.md. Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_62: RunDef = {
  id: 'revenge-62',
  name: 'The Scree',
  blurb: 'Stub.',
  allowedAbilities: ['avalanche', 'boulder'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
