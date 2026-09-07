import type { AbilityId } from './abilities';

/**
 * Final art file per ability id. Most abilities ship `{id}-1.webp`; abilities
 * with multiple AI-generated variants pin to the chosen one explicitly. The
 * dart-art picker at `/test/dart-art` is the tool used to compare options.
 *
 * Lives in lib/ (not AbilityCard.tsx, which is 'use client') so the share
 * card's server-side OG renderer can resolve the same files.
 */
/**
 * Abilities that have NO art of their own yet borrow a finished card face so
 * the rack / offer / share card never show a broken image. Replace the entry
 * (or delete it) once real art lands in public/abilities/<id>-1.webp.
 */
const PLACEHOLDER_ART: Partial<Record<AbilityId, string>> = {
  snare: 'decoy-1.webp',
  shove: 'boulder-1.webp',
  coup: 'swap-1.webp',
  hourglass: 'rewind-1.webp',
  scarecrow: 'smoke-1.webp',
  gauntlet: 'become-king-2.webp',
};

export function artFile(id: AbilityId): string {
  const placeholder = PLACEHOLDER_ART[id];
  if (placeholder) return placeholder;
  if (id === 'poison-dart') return 'poison-dart-2.webp';
  if (id === 'rabies-dart') return 'rabies-dart-2.webp';
  if (id === 'freeze-ray') return 'freeze-ray-2.webp';
  if (id === 'become-king') return 'become-king-2.webp';
  return `${id}-1.webp`;
}
