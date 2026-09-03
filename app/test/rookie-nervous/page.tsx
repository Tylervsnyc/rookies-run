'use client';

import { useState } from 'react';
import { BreathingRook } from '@/components/ui/BreathingRook';
import type { RookieMood, AlarmVariant } from '@/lib/rookie-os/types';

/**
 * TEST — Rookie calm vs nervous breathing, side by side.
 * Idea (Tyler 2026-09-03): when Rookie is in check / under attack in
 * Rookie's Revenge, her breathing should speed up so she looks nervous.
 * The sprite already has a `nervous` mood (1.8s breathe, dim blue-gray) and a
 * `panicking` mood with alarm variants — this page lines them up so we can
 * pick the one that reads best at board size.
 */

type Option = {
  title: string;
  note: string;
  mood: RookieMood;
  alarm?: AlarmVariant;
};

const OPTIONS: Option[] = [
  { title: 'Calm (today)', note: 'neutral · 5s breathe', mood: 'neutral' },
  { title: 'Nervous', note: 'nervous · 1.8s breathe, dimmer + blue-gray', mood: 'nervous' },
  { title: 'Siren', note: 'panicking · red sweep rotating around the rook', mood: 'panicking' },
  { title: 'Heartbeat', note: 'panicking · thump-thump', mood: 'panicking', alarm: 'heartbeat' },
  { title: 'SOS', note: 'panicking · Morse code blink', mood: 'panicking', alarm: 'sos' },
  { title: 'Shiver', note: 'panicking · jitter + red pulse', mood: 'panicking', alarm: 'shiver' },
  { title: 'Ring pulse', note: 'panicking · rings expand from center', mood: 'panicking', alarm: 'ringPulse' },
  { title: 'Flicker out', note: 'panicking · power failure + recovery', mood: 'panicking', alarm: 'flickerOut' },
];

const LIGHT_SQ = '#f0d9b5';
const DARK_SQ = '#b58863';

/** A 3x3 patch of board with Rookie centered — how it actually looks in a level. */
function BoardPatch({ mood, alarm, cell }: { mood: RookieMood; alarm?: AlarmVariant; cell: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(3, ${cell}px)`,
        gridTemplateRows: `repeat(3, ${cell}px)`,
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const r = Math.floor(i / 3);
        const c = i % 3;
        const isCenter = r === 1 && c === 1;
        return (
          <div
            key={i}
            style={{
              background: (r + c) % 2 === 0 ? LIGHT_SQ : DARK_SQ,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isCenter && (
              <div style={{ transform: 'scale(0.88)' }}>
                <BreathingRook size="xs" animate mood={mood} alarmVariant={alarm ?? null} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function RookieNervousTest() {
  const [cell, setCell] = useState(56);

  return (
    <div
      className="overflow-auto"
      style={{
        minHeight: '100dvh',
        height: '100dvh',
        background: '#eef5fb',
        fontFamily: 'DM Sans, system-ui, sans-serif',
        color: '#1f2a37',
        padding: '20px 16px 60px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Rookie: calm vs nervous</h1>
        <p style={{ marginTop: 6, color: '#5b6b7c', fontSize: 14 }}>
          Same sprite, different breathing. Top row is big so you can see it; bottom row is real
          board size.
        </p>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, marginTop: 12 }}>
          Board square size
          <input
            type="range"
            min={36}
            max={90}
            value={cell}
            onChange={(e) => setCell(Number(e.target.value))}
          />
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{cell}px</span>
        </label>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginTop: 20,
          }}
        >
          {OPTIONS.map((o) => (
            <div
              key={o.title}
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 18,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{o.title}</div>
                <div style={{ fontSize: 12, color: '#7a8a9b', marginTop: 2 }}>{o.note}</div>
              </div>

              <div
                style={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BreathingRook size="lg" animate mood={o.mood} alarmVariant={o.alarm ?? null} />
              </div>

              <BoardPatch mood={o.mood} alarm={o.alarm} cell={cell} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
