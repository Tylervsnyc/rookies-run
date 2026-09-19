/**
 * The Pawnshop (revenge-53) — STUB. Signature pair intent: convert + promote.
 * Spec: docs/new-abilities-2026-09-19.md. Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_53: RunDef = {
  id: 'revenge-53',
  name: 'The Pawnshop',
  blurb: 'Stub.',
  allowedAbilities: ['convert', 'promote'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
