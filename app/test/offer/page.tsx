'use client';

/**
 * /test/offer — visual harness for the offer slate. Renders the ornate
 * AbilityOfferModal with a mixed slate (new + upgrades) so the upgrade
 * delta copy and the gold filigree frame can be eyeballed without
 * grinding tempo in a real run.
 */

import { AbilityOfferModal } from '@/components/run/AbilityOfferModal';
import { blurbDetailForTier, type AbilityOffer } from '@/lib/run/abilities';

const OFFER: AbilityOffer = [
  {
    kind: 'new',
    id: 'knight-hop',
    tier: 1,
    description: blurbDetailForTier('knight-hop', 1),
  },
  {
    kind: 'upgrade',
    id: 'freeze-ray',
    tier: 2,
    description: blurbDetailForTier('freeze-ray', 2),
  },
  {
    kind: 'upgrade',
    id: 'twin',
    tier: 4,
    description: blurbDetailForTier('twin', 4),
  },
];

export default function TestOfferPage() {
  return (
    <div className="h-full overflow-auto bg-chess-page">
      <AbilityOfferModal
        offer={OFFER}
        onPick={() => window.location.reload()}
        onSkip={() => window.location.reload()}
        reason="tempo"
      />
    </div>
  );
}
