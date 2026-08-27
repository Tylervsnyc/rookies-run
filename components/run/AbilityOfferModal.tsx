'use client';

import {
  ABILITY_DEFS,
  type AbilityId,
  type AbilityOffer,
  type AbilityOfferOption,
} from '@/lib/run/abilities';
import { artFile } from './AbilityCard';
import { PointerArrow } from './BoardOverlay';

interface AbilityOfferModalProps {
  offer: AbilityOffer;
  onPick: (option: AbilityOfferOption) => void;
  onSkip: () => void;
  /**
   * 'tempo' (default) — the meter filled: "Upgrade Rookie" + a skip link.
   * 'level' — Rookie's Revenge free pick at level start: Rookie's own line,
   * no skip (one rook can't do this alone).
   */
  reason?: 'tempo' | 'level';
  /**
   * Tutorial gating: when set, ONLY these ids are tappable — every other
   * card renders grayed and disabled inside the modal itself.
   */
  selectableIds?: AbilityId[];
  /** Tutorial: bouncing blue arrow over this card ("tap this one"). */
  pointAtId?: AbilityId | null;
  /** Optional heading override (tutorial copy). */
  title?: string;
  /** Optional sub-heading override. */
  subtitle?: string;
}

/**
 * One plain sentence per power — what it does, no stats. Falls back to the
 * ability's own description for anything not listed here.
 */
const PLAIN: Partial<Record<AbilityId, string>> = {
  'knight-hop': 'Jump like a knight — reach squares a rook can’t.',
  surge: 'Take two turns in a row.',
  'freeze-ray': 'Freeze a piece so it can’t move.',
  'bishop-step': 'Slide diagonally like a bishop for a few turns.',
  'queen-pulse': 'Move like a queen for a few turns.',
  'become-king': 'Become a king. Nothing can capture you.',
  aegis: 'Block the next capture against you.',
  boulder: 'Drop a boulder. Nothing gets past it.',
  smoke: 'Vanish. Enemies lose track of you.',
  rewind: 'Undo the last turn — yours and theirs.',
  magnet: 'Pull an enemy on your line toward you.',
  convert: 'Flip an enemy onto your side.',
};

/** Per-power accent so the three cards read as three different things. */
const ACCENT: Partial<Record<AbilityId, string>> = {
  'knight-hop': '#e89c1a',
  surge: '#e0484c',
  'freeze-ray': '#3d9be9',
};
const DEFAULT_ACCENT = '#2A3C45';

/** Golden frame — same gradient recipe as the tier-4 card in AbilityCard.tsx. */
const GOLD_FRAME =
  'linear-gradient(135deg, #b8852b, #6a4612 30%, #ffd87a 60%, #b8852b)';
const GOLD_HALO = '0 0 18px rgba(255, 191, 36, 0.55)';

function plainText(option: AbilityOfferOption): string {
  return PLAIN[option.id] ?? ABILITY_DEFS[option.id].description;
}

export function AbilityOfferModal({
  offer,
  onPick,
  onSkip,
  reason = 'tempo',
  selectableIds,
  pointAtId = null,
  title,
  subtitle,
}: AbilityOfferModalProps) {
  const isLevel = reason === 'level';
  const cols = offer.length >= 3 ? 'grid-cols-3' : 'grid-cols-2';
  // A mixed slate (new + upgrade) labels every card so the two modes read.
  const mixed = offer.some((o) => o.kind === 'upgrade') && offer.some((o) => o.kind === 'new');
  return (
    <>
      <style>{`
        @keyframes offerCardEnter {
          0%   { opacity: 0; transform: translateY(20px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .offer-card-enter { animation: offerCardEnter 420ms cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12222b]/80 backdrop-blur-sm px-3 py-4">
        <div className="w-full max-w-[360px] bg-chess-surface rounded-3xl shadow-2xl p-4 flex flex-col gap-3 max-h-[calc(100dvh-2rem)] overflow-y-auto border border-white/60">
          <div className="text-center px-1">
            <h2 className="text-[17px] font-black text-chess-text leading-tight">
              {title ?? (isLevel ? 'One rook can’t do this alone. Take something.' : 'Tempo full. Upgrade Rookie.')}
            </h2>
            <p className="text-[11px] font-bold text-chess-text-muted mt-1">
              {subtitle ?? 'Tap a power to keep it.'}
            </p>
          </div>

          <div className={`grid ${cols} gap-2 items-stretch`}>
            {offer.map((option, idx) => {
              const def = ABILITY_DEFS[option.id];
              const accent = ACCENT[option.id] ?? DEFAULT_ACCENT;
              const upgrade = option.kind !== 'new';
              const locked = selectableIds !== undefined && !selectableIds.includes(option.id);
              const pointed = pointAtId === option.id;
              return (
                <button
                  key={`${option.id}-${option.tier}-${idx}`}
                  type="button"
                  disabled={locked}
                  aria-disabled={locked}
                  onClick={() => {
                    if (!locked) onPick(option);
                  }}
                  className={`offer-card-enter relative flex min-h-[44px] rounded-2xl p-[3px] text-left transition-transform ${
                    locked ? 'opacity-35 grayscale cursor-not-allowed' : 'active:scale-[0.97]'
                  }`}
                  style={{
                    animationDelay: `${idx * 80}ms`,
                    background: locked ? '#9aa6ad' : GOLD_FRAME,
                    boxShadow: locked ? 'none' : `${GOLD_HALO}, 0 8px 16px rgba(18,34,43,0.18)`,
                  }}
                >
                  {pointed && (
                    <PointerArrow style={{ position: 'absolute', left: '50%', top: -34 }} />
                  )}
                  {/* Inner cardface — per-power accent lives inside the gold frame */}
                  <div
                    className="relative flex flex-col flex-1 rounded-[13px] overflow-hidden bg-chess-page"
                    style={{ boxShadow: `inset 0 -3px 0 ${accent}` }}
                  >
                  {/* Art window */}
                  <div
                    className="relative w-full aspect-square"
                    style={{
                      background: `radial-gradient(ellipse at 50% 35%, ${accent}33 0%, ${accent}0d 70%)`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/abilities/${artFile(option.id)}`}
                      alt=""
                      draggable={false}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {upgrade && (
                      <span
                        className="absolute top-1.5 right-1.5 text-[9px] font-black uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-md text-white"
                        style={{ background: accent }}
                      >
                        {mixed ? `Upgrade · Tier ${option.tier}` : `Tier ${option.tier}`}
                      </span>
                    )}
                    {mixed && !upgrade && (
                      <span
                        className="absolute top-1.5 right-1.5 text-[9px] font-black uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-md text-white"
                        style={{ background: accent }}
                      >
                        New
                      </span>
                    )}
                  </div>

                  {/* Name + one plain sentence */}
                  <div className="flex flex-col gap-1 px-2 pt-2 pb-3 flex-1">
                    <div
                      className="text-[12px] font-black leading-tight uppercase tracking-[0.04em]"
                      style={{ color: accent }}
                    >
                      {def.name}
                    </div>
                    <p className="text-[11px] font-semibold leading-snug text-chess-text">
                      {plainText(option)}
                    </p>
                  </div>
                  </div>
                </button>
              );
            })}
          </div>

          {!isLevel && (
            <button
              type="button"
              onClick={onSkip}
              className="self-center min-h-[44px] px-3 text-xs font-bold text-chess-text-muted underline underline-offset-2 active:opacity-60"
            >
              Skip (½ tempo back)
            </button>
          )}
        </div>
      </div>
    </>
  );
}
