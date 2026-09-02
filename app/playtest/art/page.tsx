/**
 * /playtest/art — Tyler picks summon card art: A or B per ability.
 *
 * Candidates live at /abilities/concepts/<id>-1.png (A) and <id>-2.png (B).
 * Tapping one stores the pick in localStorage ('art-picks-v1') and relays it
 * to Slack via the existing /api/playtest-feedback route. Missing files (art
 * still generating) render a placeholder tile.
 */

import type { Metadata } from 'next';

import { ArtPicksClient } from './ArtPicksClient';

export const metadata: Metadata = {
  title: "Art Picks — Rookie's Revenge",
  robots: { index: false, follow: false },
};

export default function ArtPicksPage() {
  return <ArtPicksClient />;
}
