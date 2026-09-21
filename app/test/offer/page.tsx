'use client';

/**
 * /test/offer — visual harness for the offer slate. Renders the ornate
 * AbilityOfferModal with a mixed slate (new + upgrades) so the upgrade
 * delta copy and the gold filigree frame can be eyeballed without
 * grinding tempo in a real run.
 */

import { useEffect, useState } from 'react';
import { AbilityOfferModal } from '@/components/run/AbilityOfferModal';
import { TempoBar } from '@/components/run/TempoBar';
import { KingStunCauseLabel } from '@/components/run/Board';
import { LevelClearedModal } from '@/components/run/LevelClearedModal';
import { blurbDetailForTier, ABILITY_DEFS, type AbilityOffer } from '@/lib/run/abilities';
import { AbilityDemo, DEMO_ABILITY_IDS } from '@/components/run/AbilityDemo';

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
  const [mode, setMode] = useState('');
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setMode(q.has('intro') ? 'intro' : q.has('hud') ? 'hud' : q.has('demos') ? 'demos' : '');
  }, []);
  const intro = mode === 'intro';
  if (mode === 'demos') {
    // ?demos — every scripted ability demo (the preview face's live mini
    // board) side by side, so a new script can be eyeballed in one pass.
    return (
      <div className="h-full overflow-auto bg-chess-page p-3">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_ABILITY_IDS.map((id) => (
            <div key={id} className="rounded-xl overflow-hidden bg-[#1a2b33]">
              <div className="py-1 text-center text-[11px] font-black uppercase tracking-[0.05em] text-white">
                {ABILITY_DEFS[id].name}
              </div>
              <AbilityDemo id={id} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (mode === 'hud') {
    // ?hud — infinity-glyph paths (KING form at T5 = 999-turn sentinel) and
    // the transient king-stun cause label, without grinding a real run.
    return (
      <div className="h-full overflow-auto bg-chess-page p-4 flex flex-col gap-4 max-w-md mx-auto">
        <TempoBar tempo={5} max={12} form="king" formMovesLeft={999} />
        <div
          className="relative w-full rounded-lg overflow-hidden"
          style={{
            aspectRatio: '1 / 1',
            backgroundImage:
              'repeating-conic-gradient(#EDEED1 0% 25%, #7FA650 0% 50%)',
            backgroundSize: '25% 25%',
          }}
        >
          <KingStunCauseLabel square="e5" cause="capture" />
          <KingStunCauseLabel square="b7" cause="boulder" />
        </div>
      </div>
    );
  }
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
