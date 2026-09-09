'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ABILITY_DEFS,
  MAX_OWNED_ABILITIES,
  blurbDetailForTier,
  type AbilityId,
  type AbilityTier,
  type OwnedAbility,
} from '@/lib/run/abilities';
import { AbilityCardMini, RACK_CARD_W } from './AbilityCard';

/**
 * Height reserved under the cards for the info slot. The slot is the ONE
 * place ability text appears during a run: the rack status line, the live
 * "Smoked · N" rule while smoke is up, the "Tap Rookie" hint, and — when a
 * card's (i) is tapped — that ability's explainer, painted as an absolute
 * overlay INSIDE this box. The height never changes with content, so the
 * board above it never moves (Tyler, 2026-09-09: "THE BOARD MUST NEVER MOVE").
 */
const INFO_SLOT_H = 64;

/** A live status line shown in the slot while an effect is up (e.g. smoke). */
export interface RackStatus {
  /** Short uppercase tag: "Smoked · 2". */
  label: string;
  /** The rule, in one sentence. */
  text: string;
}

interface AbilityRackProps {
  abilities: OwnedAbility[];
  activeId: AbilityId | null;
  onActivate: (id: AbilityId) => void;
  /** Cards rendered grayed + untappable (tutorial: "only this one for now"). */
  disabledIds?: AbilityId[];
  /**
   * Which card's explainer is open in the info slot. Controlled when both
   * `infoId` and `onToggleInfo` are passed (the run page closes it on any
   * move); otherwise the rack keeps its own.
   */
  infoId?: AbilityId | null;
  onToggleInfo?: (id: AbilityId) => void;
  /** Live rule line (smoke) — replaces the rack status line while set. */
  status?: RackStatus | null;
  /** Second line of the slot ("Tap Rookie to see her moves."). */
  hint?: string | null;
}

export function AbilityRack({
  abilities,
  activeId,
  onActivate,
  disabledIds,
  infoId: infoIdProp,
  onToggleInfo,
  status,
  hint,
}: AbilityRackProps) {
  const emptySlots = Math.max(0, MAX_OWNED_ABILITIES - abilities.length);

  const [localInfoId, setLocalInfoId] = useState<AbilityId | null>(null);
  const controlled = infoIdProp !== undefined && onToggleInfo !== undefined;
  const infoId = controlled ? infoIdProp : localInfoId;
  const toggleInfo = (id: AbilityId) => {
    if (controlled) onToggleInfo(id);
    else setLocalInfoId((cur) => (cur === id ? null : id));
  };

  // Arming a card is a decision, not a read — close the explainer.
  useEffect(() => {
    if (activeId && !controlled) setLocalInfoId(null);
  }, [activeId, controlled]);

  const infoAbility = infoId ? abilities.find((a) => a.id === infoId) ?? null : null;

  return (
    <>
      <style>{`
        @keyframes abilityCardFlash {
          0%   { transform: scale(1); filter: brightness(1); box-shadow: 0 0 0 0 rgba(255,255,255,0); }
          15%  { transform: scale(1.1); filter: brightness(1.6); box-shadow: 0 0 24px 6px rgba(255,255,255,0.9); }
          50%  { transform: scale(1.05); filter: brightness(1.2); }
          100% { transform: scale(1); filter: brightness(1); box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
        .ability-card-flash { animation: abilityCardFlash 700ms ease-out; }
        .ability-card-active {
          transform: translateY(-3px) scale(1.04);
          filter: drop-shadow(0 0 6px rgba(251,191,36,0.85));
        }
        @keyframes rackInfoIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2.5 justify-center items-end pb-1">
          {abilities.map((a) => (
            <RackEntry
              key={a.id}
              ability={a}
              active={activeId === a.id}
              disabled={disabledIds?.includes(a.id) ?? false}
              infoOpen={infoId === a.id}
              onActivate={() => onActivate(a.id)}
              onInfo={() => toggleInfo(a.id)}
            />
          ))}
          {Array.from({ length: emptySlots }, (_, i) => (
            <EmptySlot key={`empty-${i}`} />
          ))}
        </div>

        {/* INFO SLOT — fixed height; the explainer overlays it, never grows it. */}
        <div
          className="relative w-full max-w-[min(92vw,440px)] md:max-w-[520px] mx-auto"
          style={{ height: INFO_SLOT_H }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center">
            {status ? (
              <div className="text-[11px] font-bold leading-tight" style={{ color: 'rgba(220,228,245,0.9)' }}>
                <span className="font-black uppercase tracking-[0.14em] mr-1.5" style={{ color: '#DCE4F5' }}>
                  {status.label}
                </span>
                {status.text}
              </div>
            ) : (
              // The rack-count / "Rack full — fill tempo to upgrade" line is
              // gone (Tyler, 2026-09-09: "kind of throwing everything off").
              // The slot only speaks when there's a live rule or a hint.
              abilities.length === 0 ? (
                <div className="text-[10px] text-chess-text-faint font-bold uppercase tracking-wider leading-none">
                  Fill tempo to claim a power
                </div>
              ) : null
            )}
            {hint ? <p className="text-sm text-chess-text-muted leading-tight">{hint}</p> : null}
          </div>

          {infoAbility && (
            <AbilityInfoPanel ability={infoAbility} onClose={() => toggleInfo(infoAbility.id)} />
          )}
        </div>
      </div>
    </>
  );
}

/**
 * The explainer. Absolute inside the slot (top-anchored, may spill DOWN over
 * whatever is below — never up into the board). Copy is the ability's own
 * tier-exact blurb from lib/run/abilities.ts; nothing is rewritten here.
 */
function AbilityInfoPanel({
  ability,
  onClose,
}: {
  ability: OwnedAbility;
  onClose: () => void;
}) {
  const def = ABILITY_DEFS[ability.id];
  const blurb = blurbDetailForTier(ability.id, ability.tier);
  return (
    <div
      role="region"
      aria-label={`${def.name} info`}
      className="absolute left-0 right-0 top-0 z-20 rounded-lg px-3 py-2 flex items-start gap-2 text-left"
      style={{
        minHeight: INFO_SLOT_H,
        background: 'linear-gradient(180deg,#22366f 0%,#15244f 100%)',
        border: '1.5px solid rgba(255,215,0,0.55)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)',
        animation: 'rackInfoIn 160ms ease-out',
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-black uppercase tracking-[0.14em] leading-none mb-1" style={{ color: '#FFD700' }}>
          {def.name} · T{ability.tier}
          {blurb.limit ? (
            <span className="font-bold normal-case tracking-normal" style={{ color: 'rgba(255,215,0,0.7)' }}>
              {' '}· {blurb.limit}
            </span>
          ) : null}
        </div>
        <div className="text-[11px] font-bold leading-[1.3]" style={{ color: '#F1F4FB' }}>
          {blurb.what}
        </div>
        <div className="text-[10.5px] font-medium leading-[1.3]" style={{ color: 'rgba(220,228,245,0.72)' }}>
          {blurb.how}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close info"
        className="shrink-0 -mr-2 -my-1 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-90 transition-transform"
      >
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
          style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(241,244,251,0.85)' }}
        >
          ×
        </span>
      </button>
    </div>
  );
}

function EmptySlot() {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 rounded-[9px] border-2 border-dashed border-chess-text/15 flex items-center justify-center"
      style={{ width: RACK_CARD_W, aspectRatio: '5 / 7' }}
    >
      <span className="text-chess-text/20 text-xl font-black select-none">+</span>
    </div>
  );
}

function RackEntry({
  ability,
  active,
  disabled,
  infoOpen,
  onActivate,
  onInfo,
}: {
  ability: OwnedAbility;
  active: boolean;
  disabled: boolean;
  infoOpen: boolean;
  onActivate: () => void;
  onInfo: () => void;
}) {
  const prevTierRef = useRef<AbilityTier>(ability.tier);
  const [flashing, setFlashing] = useState(false);
  useEffect(() => {
    if (prevTierRef.current !== ability.tier) {
      prevTierRef.current = ability.tier;
      setFlashing(true);
      const t = setTimeout(() => setFlashing(false), 720);
      return () => clearTimeout(t);
    }
  }, [ability.tier]);

  return (
    <AbilityCardMini
      ability={ability}
      active={active}
      flashing={flashing}
      disabled={disabled}
      infoOpen={infoOpen}
      onClick={onActivate}
      onInfo={onInfo}
    />
  );
}
