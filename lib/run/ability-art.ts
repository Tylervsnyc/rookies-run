import type { AbilityId } from './abilities';

/**
 * Final art file per ability id. Most abilities ship `{id}-1.webp`; abilities
 * with multiple AI-generated variants pin to the chosen one explicitly. The
 * dart-art picker at `/test/dart-art` is the tool used to compare options.
 *
 * Lives in lib/ (not AbilityCard.tsx, which is 'use client') so the share
 * card's server-side OG renderer can resolve the same files.
 */
export function artFile(id: AbilityId): string {
  if (id === 'poison-dart') return 'poison-dart-2.webp';
  if (id === 'rabies-dart') return 'rabies-dart-2.webp';
  if (id === 'freeze-ray') return 'freeze-ray-2.webp';
  if (id === 'become-king') return 'become-king-2.webp';
  return `${id}-1.webp`;
}
