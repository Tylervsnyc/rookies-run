'use client';

/**
 * Rookie's Revenge — level lost, but the run isn't over. Shown when the
 * difficulty mode still has retries for THIS level. "Give up" hands off to the
 * regular run-over summary.
 */
interface LevelLostModalProps {
  level: number;
  totalLevels: number;
  /** Retries remaining for this level AFTER this loss. Infinity = unlimited. */
  retriesLeft: number;
  /** 'unwinnable' = the solver proved the king was out of reach. */
  reason?: 'unwinnable';
  difficultyLabel?: string;
  onRetry: () => void;
  onGiveUp: () => void;
}

export function LevelLostModal({
  level,
  totalLevels,
  retriesLeft,
  reason,
  difficultyLabel,
  onRetry,
  onGiveUp,
}: LevelLostModalProps) {
  const unlimited = !Number.isFinite(retriesLeft);
  const chip = unlimited
    ? 'Unlimited retries'
    : `${retriesLeft} ${retriesLeft === 1 ? 'retry' : 'retries'} left`;
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
        className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-rose-50 via-white to-rose-50 dark:from-rose-900/30 dark:via-chess-surface dark:to-rose-950/30 shadow-2xl p-6 text-center overflow-hidden"
        style={{ animation: 'rookiesRunPopIn 520ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        data-testid="level-lost-modal"
      >
        <div className="text-xs uppercase tracking-widest text-chess-text-faint">
          Level {level} of {totalLevels}
        </div>
        <h2 className="mt-1 text-4xl font-black text-chess-text">
          {reason === 'unwinnable' ? 'No way through.' : 'Captured.'}
        </h2>
        <p className="mt-2 text-sm text-chess-text-muted">
          {reason === 'unwinnable'
            ? 'He is out of reach and we are out of moves. I am not okay about it, so we go again.'
            : 'Same level, same powers. She is not done.'}
        </p>

        <div className="mt-3 flex items-center justify-center gap-1.5">
          {difficultyLabel && (
            <span className="rounded-full bg-chess-text/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-chess-text-muted">
              {difficultyLabel}
            </span>
          )}
          <span className="rounded-full bg-rose-100 text-rose-700 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] tabular-nums">
            {chip}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="tap-highlight w-full min-h-[44px] px-6 py-2.5 rounded-xl bg-chess-text text-white text-sm font-bold shadow-lg active:scale-95 transition-transform"
          >
            Try again{unlimited ? '' : ` (${retriesLeft} left)`} →
          </button>
          <button
            type="button"
            onClick={onGiveUp}
            className="tap-highlight w-full min-h-[44px] px-6 py-2.5 rounded-xl bg-chess-page text-chess-text text-sm font-bold border border-chess-text/10 active:scale-95 transition-transform"
          >
            Give up
          </button>
        </div>
      </div>
    </div>
  );
}
