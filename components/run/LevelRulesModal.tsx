'use client';

import { withClick } from '@/lib/sounds';
import { levelRules } from '@/lib/run/level-rules';
import type { BoardState } from '@/lib/run/types';

/**
 * "How enemies move here" — the per-level rules sheet. Same shell as
 * TempoHelpModal; every line comes from levelRules(state), which reads the
 * live board, so nothing here is authored per level.
 */
export function LevelRulesModal({
  state,
  oneLife = false,
  onClose,
}: {
  state: BoardState;
  /** Endless: one life whatever the ramped mode says. */
  oneLife?: boolean;
  onClose: () => void;
}) {
  const rules = levelRules(state).map((r) =>
    oneLife && r.what.endsWith(' mode') ? { ...r, detail: 'One life. A lost level ends the session.' } : r,
  );
  return (
    <>
      <style>{`
        @keyframes levelRulesPop {
          0%   { opacity: 0; transform: scale(0.92) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-xs max-h-[85vh] overflow-y-auto bg-chess-surface rounded-2xl shadow-2xl relative"
          style={{ animation: 'levelRulesPop 0.25s ease-out backwards' }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="How enemies move here"
        >
          <button
            type="button"
            onClick={withClick(onClose)}
            aria-label="Close"
            className="absolute top-1.5 right-1.5 w-11 h-11 rounded-full flex items-center justify-center text-chess-text-muted active:scale-90 transition-all"
          >
            <span className="w-7 h-7 rounded-full bg-chess-text/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
          </button>

          <div className="px-5 pt-5 pb-3 pr-12">
            <div className="text-[10px] uppercase tracking-[0.18em] font-black text-rose-500">This level</div>
            <h2 className="text-base font-black text-chess-text uppercase tracking-wide mt-0.5">
              How enemies move here
            </h2>
          </div>

          <ul className="px-5 pb-5 flex flex-col gap-3">
            {rules.map((r, i) => (
              <li key={r.what} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center shrink-0 leading-none">
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-black text-chess-text leading-tight">{r.what}</div>
                  <div className="text-xs font-medium text-chess-text-muted leading-snug mt-0.5">{r.detail}</div>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={withClick(onClose)}
            className="w-full min-h-[44px] py-3 bg-rose-500 hover:bg-rose-600 active:scale-[0.99] text-white font-black text-sm uppercase tracking-wide transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  );
}
