'use client';

/**
 * Level-cleared / next-level intro. One type system: DM Sans only, weights
 * for hierarchy. One accent: the Revenge red gradient on the big level
 * number. Neutral surface + tokens everywhere else — quiet on purpose
 * (Tyler, 2026-09-02: no novelty fonts, no sparkle salad).
 */
interface LevelClearedModalProps {
  level: number;
  totalLevels: number;
  tempo: number;
  onNext: () => void;
  /** Run name shown as the kicker above the big level number. */
  runName?: string;
}

/**
 * Rookie's line for the level you're heading INTO (index 1..10). Short,
 * over-invested, escalating — she's walking you toward him.
 */
const ROOKIE_LINES = [
  'First door. Kick it in.',
  'They noticed. Good.',
  'Three deep. Nobody’s stopped us.',
  'You’re scaring them. Keep going.',
  'Halfway. He’s counting his guards.',
  'The guards are getting nervous.',
  'Deep territory. Stay sharp for me.',
  'Almost. Don’t blink now.',
  'One door left after this.',
  'He knows you’re coming.',
];

function rookieLineFor(nextLevel: number): string {
  const idx = Math.min(Math.max(nextLevel, 1), ROOKIE_LINES.length) - 1;
  return ROOKIE_LINES[idx];
}

export function LevelClearedModal({
  level,
  totalLevels,
  tempo: _tempo,
  onNext,
  runName,
}: LevelClearedModalProps) {
  const nextLevel = Math.min(level + 1, totalLevels);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-[rookiesRunFadeIn_220ms_ease-out]">
      <style>{`
        @keyframes rookiesRunFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rookiesRunPopIn {
          0%   { opacity: 0; transform: scale(0.7) translateY(20px); }
          55%  { opacity: 1; transform: scale(1.05) translateY(0); }
          80%  { transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        className="relative w-full max-w-sm rounded-3xl bg-chess-surface shadow-2xl p-6 text-center overflow-hidden"
        style={{ animation: 'rookiesRunPopIn 520ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {runName && (
          <div className="text-xs uppercase tracking-widest text-chess-text-faint">
            {runName}
          </div>
        )}
        <h2 className="mt-1 text-xl font-black uppercase tracking-wide text-chess-text">
          Cleared!
        </h2>
        <div className="mt-2 flex items-baseline justify-center gap-2">
          <div
            className="text-[64px] leading-none font-black uppercase tracking-tight"
            style={{
              background: 'linear-gradient(180deg, #E53935 20%, #B71C1C 90%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Level {nextLevel}
          </div>
          <div className="text-base font-black text-chess-text-faint">
            of {totalLevels}
          </div>
        </div>
        <p className="mt-3 text-sm font-bold text-chess-text-muted">
          {rookieLineFor(nextLevel)}
        </p>

        <div className="mt-5 flex justify-center">
          <button
            onClick={onNext}
            className="tap-highlight w-full min-h-[44px] px-6 py-2.5 rounded-xl bg-chess-text text-white text-sm font-bold shadow-lg active:scale-95 transition-transform"
          >
            Next level →
          </button>
        </div>
      </div>
    </div>
  );
}
