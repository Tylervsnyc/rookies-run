/**
 * The Vent (revenge-56) — STUB. Signature pair intent: eruption + boulder.
 * Spec: docs/new-abilities-2026-09-19.md. Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_56: RunDef = {
  id: 'revenge-56',
  name: 'The Vent',
  blurb: 'Stub.',
  allowedAbilities: ['eruption', 'boulder'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
