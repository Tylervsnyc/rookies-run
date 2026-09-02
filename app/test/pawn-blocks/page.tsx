'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PieceBlocks, type PieceType, type BlockPieceType, type DragonAltType } from '@/components/run/PieceBlocks';
import { LowMovesEmergency } from '@/components/run/LowMovesEmergency';

/**
 * /test/pawn-blocks — visual check for the pawn block-art silhouette
 * (rounder circular head, not a rocket) next to its family, plus the
 * low-moves emergency pulse at 2 and 1 moves left.
 */
export default function PawnBlocksTest() {
  return (
    <Suspense>
      <PawnBlocksInner />
    </Suspense>
  );
}

function PawnBlocksInner() {
  const params = useSearchParams();
  const embed = params.get('embed') === '1';
  const initial = (Number(params.get('emergency')) || 0) as 0 | 1 | 2;
  const [emergency, setEmergency] = useState<0 | 1 | 2>(initial);
  const family: PieceType[] = ['P', 'N', 'B', 'R', 'Q', 'K'];
  return (
    <div className="h-full overflow-auto bg-chess-page p-4">
      {emergency > 0 && <LowMovesEmergency left={emergency} />}
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <h1 className="text-lg font-black">Pawn block art</h1>

        <section>
          <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
            Pawn close-up (blockSize 10)
          </div>
          <div className="bg-white rounded-xl p-6 flex justify-center">
            <PieceBlocks piece="P" blockSize={10} />
          </div>
        </section>

        <section>
          <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
            Board size (blockSize 3) — family lineup
          </div>
          <div className="bg-white rounded-xl p-4 flex items-end justify-between">
            {family.map((p) => (
              <PieceBlocks key={p} piece={p} blockSize={3} />
            ))}
          </div>
        </section>

        <section>
          <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
            Dragon options — each at board size (3) and close-up (6), queen for contrast
          </div>
          <div className="flex flex-col gap-3">
            {(
              [
                ['D', 'Current (the chicken?)'],
                ['DA', 'A — serpentine side profile'],
                ['DB', 'B — bat-wing dominant'],
                ['DC', 'C — coiled wyrm'],
                ['DD', 'D — heraldic rampant'],
              ] as [BlockPieceType | DragonAltType, string][]
            ).map(([code, label]) => (
              <div key={code} className="bg-white rounded-xl p-4">
                <div className="text-xs font-bold mb-2">{label}</div>
                <div className="flex items-end justify-around">
                  <PieceBlocks piece={code} blockSize={3} />
                  <PieceBlocks piece="Q" blockSize={3} />
                  <PieceBlocks piece={code} blockSize={6} />
                  <PieceBlocks piece="Q" blockSize={6} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
            The summons — every controllable piece
          </div>
          <div className="flex flex-col gap-3">
            {(
              [
                ['N', 'Squire / Vanguard (knight)'],
                ['R', 'Twin (rook)'],
                ['Q', 'Duchess (queen)'],
                ['B', 'Bishop Squire (bishop)'],
                ['P', 'Page (pawn)'],
                ['D', 'Dragon (current D)'],
              ] as [BlockPieceType, string][]
            ).map(([code, label]) => (
              <div key={code} className="bg-white rounded-xl p-4">
                <div className="text-xs font-bold mb-2">{label}</div>
                <div className="flex items-end justify-around">
                  <PieceBlocks piece={code} blockSize={3} />
                  <PieceBlocks piece={code} blockSize={6} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
            Emergency pulse
          </div>
          <div className="flex gap-2">
            {([0, 2, 1] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setEmergency(v)}
                className={`px-3 py-2 rounded-lg text-sm font-bold ${
                  emergency === v ? 'bg-rose-600 text-white' : 'bg-white'
                }`}
              >
                {v === 0 ? 'Off' : `${v} left`}
              </button>
            ))}
          </div>
        </section>

        {!embed && (
          <section>
            <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
              430px frames — emergency at 2 left / 1 left
            </div>
            <div className="flex gap-4 overflow-x-auto">
              <iframe
                title="430px emergency 2"
                src="/test/pawn-blocks?embed=1&emergency=2"
                style={{ width: 430, height: 800, border: '1px solid #ccc', flexShrink: 0 }}
              />
              <iframe
                title="430px emergency 1"
                src="/test/pawn-blocks?embed=1&emergency=1"
                style={{ width: 430, height: 800, border: '1px solid #ccc', flexShrink: 0 }}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
