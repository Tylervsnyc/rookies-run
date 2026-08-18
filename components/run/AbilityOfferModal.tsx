'use client';

import type {
  AbilityOffer,
  AbilityOfferOption,
} from '@/lib/run/abilities';
import { AbilityCardFull } from './AbilityCard';

interface AbilityOfferModalProps {
  offer: AbilityOffer;
  onPick: (option: AbilityOfferOption) => void;
  onSkip: () => void;
  /**
   * 'tempo' (default) — the meter filled: "Tempo Full / Upgrade Rookie" +
   * a skip link. 'level' — Rookie's Revenge free pick at level start: Rookie's
   * own line, no skip (one rook can't do this alone).
   */
  reason?: 'tempo' | 'level';
}

export function AbilityOfferModal({
  offer,
  onPick,
  onSkip,
  reason = 'tempo',
}: AbilityOfferModalProps) {
  const isLevel = reason === 'level';
  const three = offer.length >= 3;
  return (
    <>
      <style>{`
        @keyframes offerCardEnter {
          0%   { opacity: 0; transform: translateY(28px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .offer-card-enter { animation: offerCardEnter 420ms cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 py-6">
        <div
          className={`w-full ${three ? 'max-w-md sm:max-w-2xl' : 'max-w-md'} bg-chess-surface rounded-3xl shadow-2xl p-5 flex flex-col gap-4 max-h-[calc(100dvh-3rem)] overflow-y-auto`}
        >
          <div className="text-center">
            {isLevel ? (
              <>
                <div className="text-[11px] uppercase tracking-[0.2em] text-amber-500 font-black">
                  ★ Free Pick ★
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-chess-text leading-tight mt-1">
                  One rook can&rsquo;t do this alone. Take something.
                </h2>
              </>
            ) : (
              <>
                <div className="text-[11px] uppercase tracking-[0.2em] text-amber-500 font-black">
                  ★ Tempo Full ★
                </div>
                <h2 className="text-2xl font-black text-chess-text leading-tight mt-1">
                  Upgrade Rookie
                </h2>
              </>
            )}
          </div>

          <div
            className={`grid ${three ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'} gap-3 items-stretch`}
          >
            {offer.map((option, idx) => {
              const badge =
                option.kind === 'new' ? undefined : `Up → T${option.tier}`;
              // 3-wide slates: on phones the third card sits centred on its
              // own row so every card keeps its readable 2-column width.
              const lastOfThree = three && idx === 2;
              return (
                <div
                  key={`${option.id}-${option.tier}-${idx}`}
                  className={`offer-card-enter flex justify-center ${
                    lastOfThree ? 'col-span-2 sm:col-span-1' : ''
                  }`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <AbilityCardFull
                    id={option.id}
                    tier={option.tier}
                    description={option.description}
                    badge={badge}
                    onClick={() => onPick(option)}
                  />
                </div>
              );
            })}
          </div>

          {!isLevel && (
            <button
              type="button"
              onClick={onSkip}
              className="self-center mt-1 text-xs font-bold text-chess-text-muted underline underline-offset-2 active:opacity-60"
            >
              Skip (½ tempo back)
            </button>
          )}
        </div>
      </div>
    </>
  );
}
