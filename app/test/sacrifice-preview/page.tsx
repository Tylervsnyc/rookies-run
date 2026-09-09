'use client';

import { RunBoard } from '@/components/run/Board';
import { SACRIFICE_BLAST_TINTS, sacrificeBlastPreview } from '@/lib/run/abilities';
import { puzzleToBoardState } from '@/lib/run/seed';
import type { BoardState, RunPuzzle } from '@/lib/run/types';

/**
 * /test/sacrifice-preview — the armed-Sacrifice blast preview on the real
 * RunBoard. A Squire knight on c4 and a Duchess on f5 (plus, below, one of
 * every blast kind) with the card armed: each summon's piece-shaped blast in
 * its own color, enemies inside ringed, the king ringed blue. Phone width
 * first — both shapes must read at 360px.
 */
const PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 1, rank: 1 },
  pieces: [
    { type: 'king', color: 'black', file: 7, rank: 7 }, // g7: inside the Duchess blast
    { type: 'pawn', color: 'black', file: 4, rank: 6 }, // d6: knight square of c4
    { type: 'pawn', color: 'black', file: 4, rank: 4 }, // d4: beside the knight — the hole
    { type: 'bishop', color: 'black', file: 6, rank: 7 }, // f7: 2 up from the Duchess
    { type: 'knight', color: 'black', file: 5, rank: 5 }, // e5: shared by both blasts
  ],
  winCondition: 'king',
  kingBehavior: 'flee',
};

function armed(allies: BoardState['allies'], rookie = { file: 1, rank: 1 }): BoardState {
  const s = puzzleToBoardState(PUZZLE);
  return {
    ...s,
    rookie,
    allies,
    abilities: [{ id: 'sacrifice', tier: 3, mutations: [], usesLeftThisLevel: 2 }],
    activeAbility: { id: 'sacrifice', step: 'pick-square' },
  };
}

const TWO = armed([
  { id: 1, type: 'knight', file: 3, rank: 4, source: 'squire' },
  { id: 2, type: 'queen', file: 6, rank: 5, source: 'duchess', turnsLeft: 4 },
]);

const ALL = armed([
  { id: 1, type: 'pawn', file: 2, rank: 2, source: 'page' },
  { id: 2, type: 'knight', file: 7, rank: 2, source: 'squire' },
  { id: 3, type: 'bishop', file: 2, rank: 6, source: 'bishop-squire', turnsLeft: 3 },
  { id: 4, type: 'rook', file: 7, rank: 5, source: 'twin', turnsLeft: 3 },
  { id: 5, type: 'queen', file: 4, rank: 4, source: 'convert' },
  { id: 6, type: 'queen', file: 5, rank: 8, source: 'dragon', turnsLeft: 3 },
]);

function Board({ state }: { state: BoardState }) {
  const preview = sacrificeBlastPreview(state);
  const targets = preview.map((g) => g.summon);
  return (
    <RunBoard
      state={state}
      selectedSquare={null}
      legalAbilityMoves={targets}
      abilityTier={3}
      blastPreview={preview}
      onSquareClick={() => {}}
      onPieceDrop={() => false}
    />
  );
}

export default function SacrificePreviewTest() {
  return (
    <div className="h-full overflow-auto p-3" style={{ background: '#0f1c3f' }}>
      <div className="mx-auto flex max-w-[560px] flex-col gap-5">
        <h1 className="text-base font-black text-white">Sacrifice armed — piece-shaped blasts</h1>
        <div className="flex flex-wrap gap-2 text-[11px] font-bold text-white">
          {(Object.keys(SACRIFICE_BLAST_TINTS) as Array<keyof typeof SACRIFICE_BLAST_TINTS>).map((k) => (
            <span key={k} className="flex items-center gap-1 rounded px-2 py-1" style={{ background: '#ffffff14' }}>
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: SACRIFICE_BLAST_TINTS[k].ring }} />
              {k} · {SACRIFICE_BLAST_TINTS[k].name}
            </span>
          ))}
        </div>
        <section>
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-white/60">Squire c4 (violet) + Duchess f5 (ember) · e5 shared</div>
          <div className="w-full overflow-hidden rounded-[14px]" data-test="two">
            <Board state={TWO} />
          </div>
        </section>
        <section>
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-white/60">One of every kind: page b2, squire g2, bishop b6, twin rook g5, converted queen d4, dragon e8</div>
          <div className="w-full overflow-hidden rounded-[14px]" data-test="all">
            <Board state={ALL} />
          </div>
        </section>
      </div>
    </div>
  );
}
