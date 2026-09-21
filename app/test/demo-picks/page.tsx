'use client';

/**
 * /test/demo-picks — the short review list: the six demos Tyler gave notes on,
 * two-up and bigger, so they can be watched without hunting through 35 boards.
 * Fewer live boards also means each one gets all the frames.
 *
 * Full set stays at /test/ability-demos.
 */

import { useState } from 'react';
import { AbilityDemo } from '@/components/run/AbilityDemo';
import { plainLine } from '@/components/run/AbilityOfferModal';
import { ABILITY_DEFS, type AbilityId } from '@/lib/run/abilities';
import { clickSfx } from '@/lib/sounds';

const GOLD_FRAME = 'linear-gradient(135deg, #b8852b, #6a4612 30%, #ffd87a 60%, #b8852b)';

/** Tyler's notes, 2026-09-18 — what each tile should now show. */
const PICKS: { id: AbilityId; note: string }[] = [
  { id: 'decoy', note: 'Knight on d7 leaves for the bait — the file opens.' },
  { id: 'boulder', note: 'Stones seal his escapes. Nowhere to run.' },
  { id: 'smoke', note: 'b4, hidden, then e4 — the knight cannot take her.' },
  { id: 'rewind', note: 'Their reply gets deleted. She finishes.' },
  { id: 'bodyguard', note: 'Rookie f4, pawns f5 and g4, a guard appears.' },
  { id: 'magnet', note: 'Untouched — you said this one is perfect.' },
];

function Tile({ id, note }: { id: AbilityId; note: string }) {
  const [runKey, setRunKey] = useState(0);
  return (
    <button
      type="button"
      onClick={() => {
        clickSfx();
        setRunKey((k) => k + 1);
      }}
      className="block w-full rounded-xl p-[2px] text-left active:scale-[0.99] transition-transform"
      style={{ background: GOLD_FRAME, boxShadow: '0 6px 14px rgba(18,34,43,0.22)' }}
      aria-label={`Restart the ${ABILITY_DEFS[id].name} demo`}
    >
      <div className="flex w-full flex-col rounded-[10px] overflow-hidden bg-[#1a2b33]">
        <div className="flex min-h-[30px] items-center justify-center px-2 py-[4px] bg-[#22343e]">
          <span className="text-center text-[12px] font-black uppercase tracking-[0.05em] text-white">
            {ABILITY_DEFS[id].name}
          </span>
        </div>
        <AbilityDemo key={runKey} id={id} />
        <div className="px-2.5 py-2">
          <p className="text-[11px] font-semibold leading-snug text-white/85">{plainLine(id)}</p>
          <p className="mt-1 text-[10px] font-bold leading-snug text-amber-200/90">{note}</p>
          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white/35">
            Tap to replay
          </p>
        </div>
      </div>
    </button>
  );
}

export default function DemoPicksPage() {
  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="mx-auto w-full max-w-4xl px-3 py-4">
        <h1 className="text-[16px] font-black text-chess-text">Your six</h1>
        <p className="mt-0.5 text-[11px] font-bold text-chess-text-muted">
          The demos you gave notes on, rebuilt. Tap a tile to replay it.{' '}
          <a href="/test/ability-demos" className="underline">All 35</a>
        </p>
        <div className="mt-3 mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PICKS.map((p) => (
            <Tile key={p.id} id={p.id} note={p.note} />
          ))}
        </div>
      </div>
    </div>
  );
}
