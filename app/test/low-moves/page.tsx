'use client';

import { useState } from 'react';
import { LowMovesEmergency } from '@/components/run/LowMovesEmergency';
import { LevelLostModal } from '@/components/run/LevelLostModal';

/** /test/low-moves — the move-budget warnings and the "Out of moves" card. */
export default function LowMovesTestPage() {
  const [left, setLeft] = useState(2);
  const [summon, setSummon] = useState(false);
  const [card, setCard] = useState(false);
  return (
    <div className="h-full overflow-auto p-4 text-white" style={{ background: '#0f1c3f' }}>
      <div className="flex flex-wrap gap-2 mb-4">
        {[3, 2, 1].map((n) => (
          <button key={n} type="button" onClick={() => setLeft(n)} className="px-3 py-2 rounded bg-white/10 font-bold">
            {n} left
          </button>
        ))}
        <button type="button" onClick={() => setSummon((s) => !s)} className="px-3 py-2 rounded bg-white/10 font-bold">
          summon selected: {summon ? 'yes' : 'no'}
        </button>
        <button type="button" onClick={() => setCard((c) => !c)} className="px-3 py-2 rounded bg-white/10 font-bold">
          toggle out-of-moves card
        </button>
      </div>
      {left <= 2 && <LowMovesEmergency left={left} summonCostsMove={summon} />}
      {card && (
        <LevelLostModal level={5} totalLevels={10} retriesLeft={1} reason="out-of-moves" difficultyLabel="Hard" onRetry={() => setCard(false)} onGiveUp={() => setCard(false)} />
      )}
    </div>
  );
}
