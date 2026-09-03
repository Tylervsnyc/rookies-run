'use client';

/**
 * LowMovesEmergency — whole-screen pulsating red edge glow when the move
 * budget is nearly gone (submarine-alarm feel). Rendered from <=2 moves
 * left, stronger at 1. Fixed + pointer-events-none so it never blocks
 * input, and it's pure edge glow — the board center stays clear.
 * prefers-reduced-motion gets a static red border/glow (no breathing).
 *
 * The chip in the header keeps its own behavior from 3 left; this layer
 * is the escalation on top of it.
 */
export function LowMovesEmergency({ left, summonCostsMove = false }: { left: number; summonCostsMove?: boolean }) {
  const lastMove = left <= 1;
  // Plain words under the glow (Tyler 2026-09-03: "be more clear about the
  // number of moves left"). The last move has to take the king.
  const line = lastMove
    ? summonCostsMove
      ? 'LAST MOVE. A summon\u2019s move ends the run.'
      : 'LAST MOVE. Take the king or the run is over.'
    : summonCostsMove
      ? `${left} moves left. The summon\u2019s move counts as one.`
      : `${left} moves left. The last one has to take the king.`;
  return (
    <>
      <style>{`
        @keyframes rrEmergencyBreathe {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 1; }
        }
        /* Reduced motion: no breathing — the glow + border hold steady. */
        @media (prefers-reduced-motion: reduce) {
          .rr-emergency-pulse { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
      <div
        aria-hidden
        className="rr-emergency-pulse pointer-events-none fixed inset-0 z-40"
        style={{
          boxShadow: lastMove
            ? 'inset 0 0 110px 34px rgba(220,38,38,0.62)'
            : 'inset 0 0 80px 20px rgba(220,38,38,0.42)',
          border: lastMove ? '3px solid rgba(220,38,38,0.85)' : '2px solid rgba(220,38,38,0.5)',
          animation: 'rrEmergencyBreathe 1.2s ease-in-out infinite',
        }}
      />
      <div
        aria-live="polite"
        className="pointer-events-none fixed left-0 right-0 z-40 flex justify-center px-4"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 14px)' }}
      >
        <div
          key={line}
          className="rounded-full px-4 py-2 text-[12px] font-black text-white text-center"
          style={{
            background: lastMove ? 'rgba(220,38,38,0.95)' : 'rgba(220,38,38,0.8)',
            boxShadow: '0 4px 0 rgba(120,10,10,0.8), 0 8px 20px rgba(0,0,0,0.4)',
            animation: 'rrMovesPulse 420ms ease-out',
          }}
        >
          {line}
        </div>
      </div>
    </>
  );
}
