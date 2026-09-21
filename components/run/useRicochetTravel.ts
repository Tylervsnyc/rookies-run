import { useEffect, useMemo, useState } from 'react';
import type { BoardState } from '@/lib/run/types';
import { fromSquare, toSquare } from '@/lib/run/types';

/**
 * A banked Ricochet move is shown leg by leg: slide to the corner, turn, slide
 * on (twice at T3+). react-chessboard can only animate a position diff as ONE
 * straight slide, so the Board stands her on each corner in turn and lets the
 * library slide every leg natively. This hook is the one clock for that: the
 * Board reads `square` / `legMs`; the page runs the same clock and reads
 * `travelling` to hold the enemy turn, the win and the capture sound until
 * she has actually landed.
 *
 * Constant speed: the whole move is 110ms a square, clamped to 450-650ms, and
 * each leg gets its share by length.
 */
const MS_PER_SQUARE = 110;
const MIN_TOTAL_MS = 450;
const MAX_TOTAL_MS = 650;

export interface RicochetLeg {
  /** Square this leg ends on (a corner, or the landing square for the last). */
  to: string;
  ms: number;
}

export function ricochetLegs(fx: NonNullable<BoardState['lastRicochetMove']>): RicochetLeg[] {
  const pts = [fx.from, ...fx.waypoints].map(fromSquare);
  const lengths = pts
    .slice(1)
    .map((p, i) => Math.abs(p.file - pts[i].file) + Math.abs(p.rank - pts[i].rank));
  const squares = lengths.reduce((a, b) => a + b, 0);
  const total = Math.min(MAX_TOTAL_MS, Math.max(MIN_TOTAL_MS, squares * MS_PER_SQUARE));
  return lengths.map((len, i) => ({
    to: fx.waypoints[i],
    ms: Math.round((total * len) / Math.max(1, squares)),
  }));
}

export interface RicochetTravel {
  /** True from the move until she lands on the final square. */
  travelling: boolean;
  /** Where her sprite should stand right now (the end of the current leg). */
  square: string | null;
  /** Slide duration for the current leg. */
  legMs: number | null;
  /** True while the current leg is NOT the last — the landing square still holds whatever was on it. */
  beforeLanding: boolean;
}

export const RICOCHET_IDLE: RicochetTravel = { travelling: false, square: null, legMs: null, beforeLanding: false };

export function useRicochetTravel(state: BoardState): RicochetTravel {
  const fx = state.lastRicochetMove;
  // Ids only grow (Date.now-based). Anything at or below the high-water mark
  // has been shown — a Rewind that restores an older state never replays it.
  const [landedId, setLandedId] = useState(() => fx?.id ?? 0);
  const [step, setStep] = useState({ id: 0, i: 0 });

  const legs = useMemo(() => (fx ? ricochetLegs(fx) : []), [fx]);
  const fresh =
    !!fx &&
    fx.id > landedId &&
    legs.length > 1 &&
    fx.waypoints[fx.waypoints.length - 1] === toSquare(state.rookie);
  const i = fresh && step.id === fx.id ? Math.min(step.i, legs.length - 1) : 0;

  useEffect(() => {
    if (!fx || fx.id <= landedId) return;
    if (!fresh) {
      // She has already moved on (or the path is degenerate): nothing to show.
      setLandedId(fx.id);
      return;
    }
    const t = setTimeout(() => {
      if (i >= legs.length - 1) setLandedId(fx.id);
      else setStep({ id: fx.id, i: i + 1 });
    }, legs[i].ms);
    return () => clearTimeout(t);
  }, [fx, fresh, landedId, i, legs]);

  if (!fresh) return RICOCHET_IDLE;
  return {
    travelling: true,
    square: legs[i].to,
    legMs: legs[i].ms,
    beforeLanding: i < legs.length - 1,
  };
}
