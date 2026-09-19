/**
 * The Looking Glass (revenge-60) — STUB. Signature pair intent: mirror + swap.
 * Spec: docs/new-abilities-2026-09-19.md. Replace this whole file.
 */
import { type RunDef, make, king, STILL } from '../run-kit';

export const RUN_REVENGE_60: RunDef = {
  id: 'revenge-60',
  name: 'The Looking Glass',
  blurb: 'Stub.',
  allowedAbilities: ['mirror', 'swap'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [make(1, [king(5, 8)], { ...STILL, moveLimit: 12 })],
};
