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
export function LowMovesEmergency({ left }: { left: number }) {
  const lastMove = left <= 1;
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
    </>
  );
}
