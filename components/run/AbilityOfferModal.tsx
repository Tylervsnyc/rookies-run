'use client';

import {
  ABILITY_DEFS,
  upgradeDeltaForTier,
  type AbilityId,
  type AbilityOffer,
  type AbilityOfferOption,
  type OwnedAbility,
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
  /**
   * What Rookie already holds — shown as a "Your powers" strip under the
   * slate so an upgrade pick is made with the current kit in view (Tyler
   * 2026-09-03: "I kind of forget a lot of the time").
   */
  owned?: OwnedAbility[];
}

/**
 * One plain sentence per power — what it does, no stats. Used for NEW picks
 * only; upgrades show the delta vs the tier you own instead. Falls back to
 * the ability's own description for anything not listed here.
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

/** Per-power accent — colors the NEW chip so three cards read as three things. */
const ACCENT: Partial<Record<AbilityId, string>> = {
  'knight-hop': '#e89c1a',
  surge: '#e0484c',
  'freeze-ray': '#3d9be9',
};
const DEFAULT_ACCENT = '#2A3C45';

/** Thin golden card ring — same gradient recipe as the tier-4 card. */
const GOLD_FRAME =
  'linear-gradient(135deg, #b8852b, #6a4612 30%, #ffd87a 60%, #b8852b)';
const GOLD_HALO = '0 0 14px rgba(255, 191, 36, 0.45)';
/** Ribbon gradient for the UPGRADE banner. */
const GOLD_CHIP = 'linear-gradient(180deg, #f2ce7a, #d3a238)';

/** "Rookie" in the Chess Path wordmark gradient (the same one "Path" wears). */
function RookieWord() {
  return (
    <span
      style={{
        background: 'linear-gradient(90deg, #FFC800 0%, #FFC800 55%, #FF6B6B 75%, #1CB0F6 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      Rookie
    </span>
  );
}

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
  owned,
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
        @keyframes offerFrameEnter {
          0%   { opacity: 0; transform: scale(0.86); }
          62%  { opacity: 1; transform: scale(1.025); }
          100% { opacity: 1; transform: scale(1); }
        }
        .offer-frame-enter { animation: offerFrameEnter 400ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes offerGlowSweep {
          0%   { transform: translateX(-130%) skewX(-14deg); opacity: 0; }
          20%  { opacity: 0.65; }
          100% { transform: translateX(160%) skewX(-14deg); opacity: 0; }
        }
        .offer-glow-sweep {
          animation: offerGlowSweep 650ms ease-out 180ms both;
          background: linear-gradient(100deg, transparent 20%, rgba(255,226,150,0.55) 50%, transparent 80%);
        }
        @media (prefers-reduced-motion: reduce) {
          .offer-card-enter, .offer-frame-enter { animation: none; }
          .offer-glow-sweep { animation: none; opacity: 0; }
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12222b]/80 backdrop-blur-sm px-3 py-4">
        {/* Magic-card slate — classic card anatomy (name bar / full square
            art / text box) on a parchment backdrop panel. Taller cards, so
            the panel scrolls on short phones. */}
        <div
          className="offer-frame-enter relative w-full overflow-x-hidden overflow-y-auto rounded-2xl p-3 sm:p-4"
          style={{
            maxWidth: 'min(640px, 94vw)',
            maxHeight: '92dvh',
            background: 'linear-gradient(180deg, #faf4e4, #f0e5cc)',
            boxShadow:
              '0 0 0 1.5px rgba(184,133,43,0.5), 0 0 20px rgba(255,191,36,0.25), 0 18px 40px rgba(0,0,0,0.45)',
          }}
        >
          <div className="text-center mb-2 sm:mb-3 px-0.5">
            <h2 className="text-[14px] sm:text-[16px] font-black text-chess-text leading-tight">
              {title ?? (isLevel ? (
                <>
                  <RookieWord /> can’t do this alone. Take something.
                </>
              ) : (
                <>Tempo full. Upgrade <RookieWord />.</>
              ))}
            </h2>
            <p className="text-[10px] sm:text-[11px] font-bold text-chess-text-muted mt-0.5">
              {subtitle ?? 'Tap a power to keep it.'}
            </p>
          </div>

          <div className={`grid ${cols} gap-2 sm:gap-3 items-stretch`}>
            {offer.map((option, idx) => {
              const def = ABILITY_DEFS[option.id];
              const accent = ACCENT[option.id] ?? DEFAULT_ACCENT;
              const upgrade = option.kind !== 'new';
              const locked = selectableIds !== undefined && !selectableIds.includes(option.id);
              const pointed = pointAtId === option.id;
              const deltas = upgrade ? upgradeDeltaForTier(option.id, option.tier) : [];
              return (
                <button
                  key={`${option.id}-${option.tier}-${idx}`}
                  type="button"
                  disabled={locked}
                  aria-disabled={locked}
                  onClick={() => {
                    if (!locked) onPick(option);
                  }}
                  className={`offer-card-enter relative flex rounded-xl p-[2px] text-left transition-transform ${
                    locked ? 'opacity-35 grayscale cursor-not-allowed' : 'active:scale-[0.97]'
                  }`}
                  style={{
                    animationDelay: `${idx * 80}ms`,
                    background: locked ? '#9aa6ad' : GOLD_FRAME,
                    boxShadow: locked ? 'none' : `${GOLD_HALO}, 0 8px 16px rgba(18,34,43,0.25)`,
                  }}
                >
                  {pointed && (
                    <PointerArrow style={{ position: 'absolute', left: '50%', top: -34 }} />
                  )}
                  {/* Magic-card anatomy: name bar on top, then the FULL
                      uncropped square art, then the text box. The art files
                      are 1:1 — never object-cover them (Tyler: "I want them
                      to look like Magic cards... so we can see all of them"). */}
                  <div className="relative flex h-full w-full flex-col rounded-[10px] overflow-hidden bg-[#1a2b33]">
                    {/* Name bar. */}
                    <div className="flex min-h-[26px] sm:min-h-[32px] items-center justify-center px-1 py-[3px] bg-[#22343e]">
                      <span className="text-center text-[9.5px] sm:text-[12px] font-black leading-tight uppercase tracking-[0.05em] text-white">
                        {def.name}
                      </span>
                    </div>

                    {/* Full square art, edge to edge, thin gold inner rule. */}
                    <div className="relative w-full aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/abilities/${artFile(option.id)}`}
                        alt=""
                        draggable={false}
                        className="block w-full h-full"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{ boxShadow: 'inset 0 0 0 1.5px rgba(184,133,43,0.65)' }}
                      />

                    </div>

                    {/* Status strip BETWEEN the art and the text — never over
                        the illustration (Tyler 2026-09-03: "I don't want
                        anything over these amazing illustrations"). */}
                    {upgrade && (
                      <div
                        className="text-center text-[8.5px] sm:text-[10px] font-black uppercase tracking-[0.1em] py-[3px] text-[#3d2806]"
                        style={{ background: GOLD_CHIP, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }}
                      >
                        Upgrade · Tier {option.tier}
                      </div>
                    )}
                    {!upgrade && mixed && (
                      <div
                        className="text-center text-[8.5px] sm:text-[10px] font-black uppercase tracking-[0.1em] py-[3px] text-white"
                        style={{ background: accent }}
                      >
                        New
                      </div>
                    )}

                    {/* Text box below the art. */}
                    <div className="flex flex-1 flex-col justify-center gap-0.5 px-1.5 sm:px-2.5 py-1.5 sm:py-2">
                      {upgrade ? (
                        deltas.map((line) => (
                          <p
                            key={line}
                            className="text-[9.5px] sm:text-[11.5px] font-black leading-snug text-amber-200"
                          >
                            {line}
                          </p>
                        ))
                      ) : (
                        <p className="text-[9px] sm:text-[10.5px] font-semibold leading-snug text-white/85">
                          {plainText(option)}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {owned && owned.length > 0 && (
            <div className="mt-2.5 sm:mt-3 rounded-xl px-2.5 py-2" style={{ background: 'rgba(58,40,6,0.07)', boxShadow: 'inset 0 0 0 1px rgba(184,133,43,0.35)' }}>
              <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.14em] text-chess-text-muted mb-1.5">Your powers</div>
              {/* Fixed-size mini cards, left-aligned — never stretched across (Tyler 2026-09-03). */}
              <div className="flex gap-2 items-start">
                {owned.map((a) => (
                  <div key={a.id} className="flex flex-col items-center rounded-lg p-[2px] shrink-0" style={{ width: 62, background: GOLD_FRAME, boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/abilities/${artFile(a.id)}`} alt="" width={58} height={58} className="rounded-[6px]" style={{ width: 58, height: 58 }} draggable={false} />
                    <div className="w-full text-center leading-tight py-[3px] rounded-b-[6px]" style={{ background: '#22343e' }}>
                      <div className="text-[8px] font-black text-white truncate px-0.5">{ABILITY_DEFS[a.id].name}</div>
                      <div className="text-[8px] font-bold text-amber-200">T{a.tier}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLevel && (
            <div className="flex justify-center mt-1 sm:mt-2">
              <button
                type="button"
                onClick={onSkip}
                className="min-h-[44px] px-3 text-xs font-bold text-chess-text-muted underline underline-offset-2 active:opacity-60"
              >
                Skip (½ tempo back)
              </button>
            </div>
          )}

          {/* One-shot gold glint sweeping across on entrance. */}
          <div
            aria-hidden
            className="offer-glow-sweep pointer-events-none absolute inset-y-0 left-0 z-30 w-1/2"
          />
        </div>
      </div>
    </>
  );
}
