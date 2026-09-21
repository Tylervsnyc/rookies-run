'use client';

import { useEffect, useRef, useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { GOLDEN_KING_PALETTE, PieceBlocks } from './PieceBlocks';
import type { RookieForm } from '@/lib/run/types';
import type { AlarmVariant } from '@/lib/rookie-os/types';

/** 'siren' = BreathingRook's default panicking animation (no variant). */
export type RookieAlarm = AlarmVariant | 'siren';

interface RookieCellProps {
  /** Current Rookie form — drives which sprite renders. */
  form?: RookieForm;
  /** Triggers the crumble animation — used during the death sequence. */
  dying?: boolean;
  /** True briefly after a transform — plays the glitch-flicker effect. */
  glitching?: boolean;
  /** Set while an enemy can capture Rookie — she panics with this red alarm. */
  alarm?: RookieAlarm | null;
}

/**
 * Rookie sprite, dead-center inside react-chessboard's piece slot.
 *
 * Rook  → BreathingRook (canonical 5×6 sprite)
 * Knight → PieceBlocks 'N' (block-rasterized in Rookie palette)
 * Bishop → PieceBlocks 'B' (block-rasterized in Rookie palette)
 *
 * When `glitching` is true (briefly after a transform), we layer RGB-split
 * copies + scanlines + a jitter animation — leans into Rookie being a
 * computer rebooting into a new shape.
 *
 * See git history for the padding-bottom: 100% ratio-box trick that keeps
 * Rookie centered inside react-chessboard's indeterminate-height piece slot.
 */
function Sprite({ form, animate, alarm }: { form: RookieForm; animate: boolean; alarm?: RookieAlarm | null }) {
  if (form === 'rook') {
    return (
      <BreathingRook
        size="xs"
        animate={animate}
        mood={alarm ? 'panicking' : 'neutral'}
        alarmVariant={alarm && alarm !== 'siren' ? alarm : null}
      />
    );
  }
  if (form === 'king') {
    return (
      <PieceBlocks
        piece="K"
        blockSize={3}
        animate={animate}
        palette={GOLDEN_KING_PALETTE}
      />
    );
  }
  const piece =
    form === 'knight'
      ? 'N'
      : form === 'bishop'
        ? 'B'
        : form === 'pawn'
          ? 'P'
          : 'Q';
  return <PieceBlocks piece={piece} blockSize={3} animate={animate} />;
}

/** The square width the fixed-size sprite was drawn for; smaller squares scale her down. */
const SPRITE_CELL_PX = 40;

export function RookieCell({
  form = 'rook',
  dying = false,
  glitching = false,
  alarm = null,
}: RookieCellProps) {
  const showGlitch = glitching && !dying;
  // The sprite is drawn at a fixed pixel size, which is right for a game-size
  // square (~40px+). On a tiny board — an offer card's preview demo — she
  // filled 2x2 squares (Tyler 2026-09-21), so shrink her with the cell there.
  const cellRef = useRef<HTMLDivElement | null>(null);
  const [cellPx, setCellPx] = useState(0);
  useEffect(() => {
    const el = cellRef.current;
    if (!el) return;
    // offsetWidth, not getBoundingClientRect: a flipping card is mid-transform.
    const measure = () => setCellPx(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const fitScale = cellPx > 0 ? Math.min(1, cellPx / SPRITE_CELL_PX) : 1;

  return (
    <div
      ref={cellRef}
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: showGlitch ? 'hidden' : undefined,
        }}
      >
        {showGlitch && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 4px)',
                mixBlendMode: 'overlay',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '20%',
                background: 'rgba(28, 176, 246, 0.35)',
                animation: 'rookieGlitchScan 440ms linear',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />
          </>
        )}

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${0.88 * fitScale})`,
            animation: showGlitch
              ? 'rookieGlitchBase 440ms steps(8)'
              : undefined,
            ...(dying
              ? {
                  animation: 'rookieCrumble 1100ms ease-in forwards',
                  transformOrigin: 'center bottom',
                }
              : null),
          }}
        >
          <Sprite form={form} animate={!dying && !showGlitch} alarm={dying ? null : alarm} />

          {showGlitch && (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'rookieGlitchShakeR 440ms steps(6)',
                  filter: 'drop-shadow(2px 0 0 #ff4b4b)',
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                }}
              >
                <Sprite form={form} animate={false} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'rookieGlitchShakeB 440ms steps(6)',
                  filter: 'drop-shadow(-2px 0 0 #1cb0f6)',
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                }}
              >
                <Sprite form={form} animate={false} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
