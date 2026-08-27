'use client';

interface TempoHelpModalProps {
  onClose: () => void;
}

/** Shared with StoryOnboarding's end screen — one source for the tempo copy. */
export const TEMPO_POINTS: { what: string; detail: string }[] = [
  {
    what: 'Capture pieces',
    detail: 'Every piece you take charges the tempo bar. Bigger pieces charge more.',
  },
  {
    what: 'Fill the bar',
    detail: 'When tempo maxes out, you pick a new power or upgrade one you have.',
  },
  {
    what: 'Pick a power',
    detail: 'Powers stay for the whole run and sit in your rack. Picking the same one again levels it up.',
  },
  {
    what: 'Cast it from the rack',
    detail: 'Tap the card. If it asks, tap a square. Then go take the king.',
  },
];

export function TempoHelpModal({ onClose }: TempoHelpModalProps) {
  return (
    <>
      <style>{`
        @keyframes tempoHelpPop {
          0%   { opacity: 0; transform: scale(0.92) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-xs bg-chess-surface rounded-2xl shadow-2xl relative overflow-hidden"
          style={{ animation: 'tempoHelpPop 0.25s ease-out backwards' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-chess-text/10 hover:bg-chess-text/20 active:scale-90 flex items-center justify-center text-chess-text-muted transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="px-5 pt-5 pb-3">
            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-amber-500">
              Tempo
            </div>
            <h2 className="text-base font-black text-chess-text uppercase tracking-wide mt-0.5">
              Charge up. Take the king.
            </h2>
          </div>

          <ul className="px-5 pb-5 flex flex-col gap-3">
            {TEMPO_POINTS.map((p, i) => (
              <li key={p.what} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center shrink-0 leading-none">
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-black text-chess-text leading-tight">
                    {p.what}
                  </div>
                  <div className="text-xs font-medium text-chess-text-muted leading-snug mt-0.5">
                    {p.detail}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-amber-400 hover:bg-amber-500 active:scale-[0.99] text-amber-950 font-black text-sm uppercase tracking-wide transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  );
}
