'use client';

/**
 * /test/ability-demos — EVERY ability card's preview demo, all playing at once.
 *
 * This is the review page for the offer modal's preview face (tap a card →
 * watch the power actually work → confirm). Scripted demos play their 3-beat
 * story on a loop; anything still on the static-art fallback is grouped at the
 * bottom under a "NO DEMO YET" chip, so what's left to script is obvious.
 *
 * Tap any tile to restart that one loop.
 */

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AbilityDemo, hasAbilityDemo } from '@/components/run/AbilityDemo';
import { plainLine } from '@/components/run/AbilityOfferModal';
import { ABILITY_DEFS, ALL_ABILITY_IDS, type AbilityId } from '@/lib/run/abilities';
import { clickSfx } from '@/lib/sounds';

const GOLD_FRAME = 'linear-gradient(135deg, #b8852b, #6a4612 30%, #ffd87a 60%, #b8852b)';

const SCRIPTED: AbilityId[] = ALL_ABILITY_IDS.filter((id) => hasAbilityDemo(id));
const UNSCRIPTED: AbilityId[] = ALL_ABILITY_IDS.filter((id) => !hasAbilityDemo(id));

/**
 * How many demos may STEP at once. Every tile stays mounted and visible; only
 * this many run their engine loop, so the ones you are looking at animate at
 * the same rate as a single board in the app (the whole point of the page is
 * to show what a player actually sees). `?play=N` overrides it — `?play=0`
 * pauses everything, which is how the idle cost of a mounted board is measured.
 */
const DEFAULT_MAX_PLAYING = 2;

const Tile = memo(function Tile({
  id,
  paused,
  report,
  onTap,
}: {
  id: AbilityId;
  paused: boolean;
  report: (id: AbilityId, onScreen: boolean) => void;
  onTap: (id: AbilityId) => void;
}) {
  // Remounting the demo restarts its loop from beat one.
  const [runKey, setRunKey] = useState(0);
  const scripted = hasAbilityDemo(id);
  // A tile is ALWAYS mounted and always shows its position. The observer only
  // tells the page which tiles are near the viewport so it can spend its
  // frames on those; a tile it never hears about counts as on screen. (An
  // earlier version skipped MOUNTING offscreen tiles and one stuck observer
  // was the difference between a grid of demos and a grid of empty boxes.)
  const ref = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        if (e) report(id, e.isIntersecting);
      },
      { rootMargin: '120px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, report]);
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        clickSfx();
        onTap(id);
        setRunKey((k) => k + 1);
      }}
      className="block w-full rounded-xl p-[2px] text-left active:scale-[0.99] transition-transform"
      style={{ background: GOLD_FRAME, boxShadow: '0 6px 14px rgba(18,34,43,0.22)' }}
      aria-label={`Restart the ${ABILITY_DEFS[id].name} demo`}
    >
      <div className="flex w-full flex-col rounded-[10px] overflow-hidden bg-[#1a2b33]">
        <div className="flex min-h-[30px] items-center justify-center gap-1.5 px-2 py-[4px] bg-[#22343e]">
          <span className="text-center text-[12px] font-black leading-tight uppercase tracking-[0.05em] text-white">
            {ABILITY_DEFS[id].name}
          </span>
          {!scripted && (
            <span className="rounded-full px-1.5 py-[1px] text-[8px] font-black uppercase tracking-[0.08em] text-[#3d2806] bg-[#e0a92c]">
              No demo yet
            </span>
          )}
        </div>

        <AbilityDemo key={runKey} id={id} paused={paused} />

        <div className="px-2.5 py-2">
          <p className="text-[11px] font-semibold leading-snug text-white/85">{plainLine(id)}</p>
          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white/35">
            {paused ? 'Tap to play' : 'Tap to replay'}
          </p>
        </div>
      </div>
    </button>
  );
});

/**
 * Decides which tiles step. Tiles report whether they are near the viewport;
 * the first `max` of those, in page order, get to run. Anything we have not
 * heard about counts as on screen, so a silent observer means "play", never
 * "blank".
 */
function usePlaySet(order: AbilityId[], max: number) {
  const [pinned, setPinned] = useState<AbilityId | null>(null);
  const visible = useRef<Map<AbilityId, boolean>>(new Map());
  const [, bump] = useState(0);
  const pending = useRef<number | null>(null);
  const report = useCallback((id: AbilityId, onScreen: boolean) => {
    if (visible.current.get(id) === onScreen) return;
    visible.current.set(id, onScreen);
    if (pending.current !== null) return;
    pending.current = window.setTimeout(() => {
      pending.current = null;
      bump((n) => n + 1);
    }, 60);
  }, []);
  useEffect(() => () => { if (pending.current !== null) clearTimeout(pending.current); }, []);
  const playing = useMemo(() => {
    if (max <= 0) return new Set<AbilityId>();
    const near = order.filter((id) => visible.current.get(id) !== false && id !== pinned);
    const set = new Set<AbilityId>(pinned ? [pinned] : []);
    for (const id of near.slice(0, Math.max(0, max - set.size))) set.add(id);
    return set;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, max, pinned, visible.current.size, bump]);
  // A tapped tile always plays, whatever the cap says.
  const onTap = useCallback((id: AbilityId) => setPinned(id), []);
  return { playing, report, onTap };
}

/**
 * `?only=decoy,boulder,smoke` — show just those tiles, two-up and bigger, so a
 * short review list can be watched without hunting through 35 boards. Fewer
 * live boards also means every one of them gets all the frames.
 */
function useOnlyFilter(): AbilityId[] | null {
  // Read on the first CLIENT render (not in an effect): the filtered branch
  // renders straight away instead of flashing all 35 boards first.
  const [only] = useState<AbilityId[] | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = new URLSearchParams(window.location.search).get('only');
    if (!raw) return null;
    const ids = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s): s is AbilityId => (ALL_ABILITY_IDS as string[]).includes(s));
    return ids.length > 0 ? ids : null;
  });
  return only;
}

export default function AbilityDemosPage() {
  const only = useOnlyFilter();
  const [maxPlaying] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_MAX_PLAYING;
    const raw = new URLSearchParams(window.location.search).get('play');
    const n = raw === null ? NaN : Number(raw);
    return Number.isFinite(n) ? n : DEFAULT_MAX_PLAYING;
  });
  const order = useMemo(() => (only ?? [...SCRIPTED, ...UNSCRIPTED]), [only]);
  const { playing, report, onTap } = usePlaySet(order, maxPlaying);

  if (only) {
    return (
      <div className="h-full overflow-auto bg-chess-page">
        <div className="mx-auto w-full max-w-4xl px-3 py-4">
          <h1 className="text-[16px] font-black text-chess-text">Ability demos</h1>
          <p className="mt-0.5 text-[11px] font-bold text-chess-text-muted">
            Showing {only.length} of {ALL_ABILITY_IDS.length}. Tap a tile to replay it.{' '}
            <a href="/test/ability-demos" className="underline">See all</a>
          </p>
          <div className="mt-3 mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {only.map((id) => (
              <Tile key={id} id={id} paused={!playing.has(id)} report={report} onTap={onTap} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="mx-auto w-full max-w-6xl px-3 py-4">
        <h1 className="text-[16px] font-black text-chess-text">Ability demos</h1>
        <p className="mt-0.5 text-[11px] font-bold text-chess-text-muted">
          What each card shows when you tap it in the offer. {SCRIPTED.length} scripted ·{' '}
          {UNSCRIPTED.length} still on static art. Tap a tile to replay it.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SCRIPTED.map((id) => (
            <Tile key={id} id={id} paused={!playing.has(id)} report={report} onTap={onTap} />
          ))}
        </div>

        {UNSCRIPTED.length > 0 && (
          <>
            <h2 className="mt-6 text-[13px] font-black text-chess-text">No demo yet</h2>
            <p className="mt-0.5 text-[11px] font-bold text-chess-text-muted">
              These fall back to the card&rsquo;s own square art — never a blank box.
            </p>
            <div className="mt-3 mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {UNSCRIPTED.map((id) => (
                <Tile key={id} id={id} paused={!playing.has(id)} report={report} onTap={onTap} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
