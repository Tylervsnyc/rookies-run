'use client';

/**
 * /test/offer — visual harness for the offer slate. Renders the ornate
 * AbilityOfferModal with a mixed slate (new + upgrades) so the upgrade
 * delta copy and the gold filigree frame can be eyeballed without
 * grinding tempo in a real run.
 */

import { useEffect, useState } from 'react';
import { AbilityOfferModal } from '@/components/run/AbilityOfferModal';
import { LevelClearedModal } from '@/components/run/LevelClearedModal';
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
  const [intro, setIntro] = useState(false);
  useEffect(() => {
    setIntro(new URLSearchParams(window.location.search).has('intro'));
  }, []);
  if (intro) {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <LevelClearedModal
          level={6}
          totalLevels={10}
          tempo={7}
          runName="Iron Veil"
          onNext={() => window.location.reload()}
        />
      </div>
    );
  }
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
