'use client';

import { withClick } from '@/lib/sounds';
import { ABILITY_DEFS, type AbilityId } from '@/lib/run/abilities';
import { artFile } from './AbilityCard';
import { REVENGE_RED, REVENGE_RED_DARK, RevengeMarkSvg } from './RookiesRevengeLogo';

/**
 * ENDLESS — the kit reveal, shown once before level 1.
 *
 * The whole promise of the mode is "here are your five, good luck", so the
 * five cards are the screen. Same navy/gold tokens and the same gold-framed
 * ability tile as ArenaHome's "Today's abilities", so it reads as the same
 * game. Mobile-first: one column, fits 360x640 with no scroll.
 */
const NAVY = '#0f1c3f';
const NAVY_2 = '#182a5c';
const GOLD = '#FFC800';
const OUTLINE = { color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.45), -1px 0 0 rgba(0,0,0,0.35), 1px 0 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(0,0,0,0.35)' } as const;

function KitCard({ id }: { id: AbilityId }) {
  return (
    <div
      className="w-full rounded-[12px] p-[3px]"
      style={{ aspectRatio: '4 / 5', background: 'linear-gradient(135deg,#b8852b,#6a4612 30%,#ffd87a 60%,#b8852b)', boxShadow: '0 5px 12px rgba(0,0,0,0.45)' }}
    >
      <div className="w-full h-full rounded-[9px] overflow-hidden flex flex-col" style={{ background: '#f6e7c5' }}>
        <div className="flex-1 min-h-0 relative" style={{ background: 'radial-gradient(ellipse at center,#ffe9a8 0%,#d49a2a 100%)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/abilities/${artFile(id)}`} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        </div>
        <div className="px-1 py-[3px] text-[9px] font-black text-center leading-tight truncate" style={{ color: '#3d2806' }}>
          {ABILITY_DEFS[id].name}
        </div>
      </div>
    </div>
  );
}

export function EndlessIntro({ kit, best, onStart }: { kit: AbilityId[]; best: number; onStart: () => void }) {
  return (
    <div className="h-full w-full flex justify-center text-white" style={{ background: NAVY }}>
      <div
        className="h-full w-full max-w-[430px] flex flex-col px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-[max(env(safe-area-inset-bottom),16px)]"
        style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 60%)` }}
      >
        <div className="flex items-center gap-2">
          <RevengeMarkSvg size={30} ringColor="#fff" />
          <span className="text-[13px] font-black leading-none" style={OUTLINE}>
            ENDLESS
          </span>
        </div>

        <div className="mt-4 text-[30px] font-black leading-none" style={OUTLINE}>
          Five powers.
          <br />
          <span style={{ color: '#FF6B66' }}>No finish line.</span>
        </div>
        <div className="mt-2.5 text-[13px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.78)' }}>
          These five are your whole kit for the session. Levels come from every map and get harder every
          time — one life, no retries. Your score is how deep you get.
        </div>

        <div className="mt-5 text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: GOLD }}>
          Your kit
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1.5" data-testid="endless-kit">
          {kit.map((id) => (
            <KitCard key={id} id={id} />
          ))}
        </div>

        <div className="flex-1 min-h-0" />

        {best > 0 && (
          <div className="text-center text-[12px] font-black mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Your best: <span style={{ color: GOLD }}>{best}</span> level{best === 1 ? '' : 's'}
          </div>
        )}
        <button
          type="button"
          onClick={withClick(onStart)}
          data-testid="endless-start"
          className="arena-press w-full rounded-[16px] font-black flex items-center justify-center gap-3 min-h-[64px]"
          style={{ background: REVENGE_RED, color: '#fff', boxShadow: `0 6px 0 ${REVENGE_RED_DARK}` }}
        >
          <span className="text-[24px]" style={{ ...OUTLINE, letterSpacing: '0.04em' }}>
            START
          </span>
        </button>
        <style>{`
          .arena-press { transition: transform 80ms ease-out, box-shadow 80ms ease-out; }
          .arena-press:active { transform: translateY(6px); box-shadow: 0 0 0 transparent !important; }
        `}</style>
      </div>
    </div>
  );
}
