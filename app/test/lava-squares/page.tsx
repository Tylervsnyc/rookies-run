'use client';

/**
 * DESIGN PAGE — lava hazard squares (Tyler 2026-09-04: "Lava is really funny,
 * and people know." then "too annoying, it should be a subtle lava that slowly
 * bubbles"). One quiet idea at four intensities, shown on the real board renderer (ChessPathBoard + RookieCell) with
 * enemies on adjacent squares and Rookie's legal-move dots visible, so we can
 * check legibility and that lava never reads as a legal target.
 *
 * Not production. The production hook is Board.tsx's `squareStyles` hazard
 * block (HAZARD_BG / HAZARD_PATTERN) + an overlay like the goal-row motes.
 */

import { useState, type CSSProperties } from 'react';
import { defaultPieces } from 'react-chessboard';
import { ChessPathBoard } from '@/components/board/ChessPathBoard';
import { RookieCell } from '@/components/run/RookieCell';

// ── Page chrome (navy play-page vibe, same kit as /test/revenge-play) ────────
const BG = '#06091a';
const NAVY = '#0f1c3f';
const PANEL = '#1c2f63';
const GOLD = '#f2c94c';
const MUTED: CSSProperties = { color: 'rgba(255,255,255,0.62)' };

// Legal-move dot — identical to Board.tsx so the "not a target" check is honest.
const MOVE_DOT = 'radial-gradient(circle, rgba(0, 0, 0, 0.22) 22%, transparent 22%)';
// Current production hazard, for the before/after.
const HAZARD_BG = 'rgba(190, 18, 60, 0.45)';
const HAZARD_PATTERN = 'repeating-linear-gradient(45deg, rgba(0,0,0,0.18) 0 6px, transparent 6px 12px)';

// ── Sample layouts ───────────────────────────────────────────────────────────
type Layout = 'moat' | 'scattered';

const LAYOUTS: Record<Layout, { label: string; hazards: string[]; position: Record<string, { pieceType: string }>; dots: string[] }> = {
  moat: {
    label: 'Moat (rank 5, one gap)',
    hazards: ['a5', 'b5', 'c5', 'e5', 'f5', 'g5', 'h5'],
    position: {
      d3: { pieceType: 'wR' },
      e8: { pieceType: 'bK' },
      a6: { pieceType: 'bP' }, c6: { pieceType: 'bP' }, f6: { pieceType: 'bP' }, h6: { pieceType: 'bP' },
      b4: { pieceType: 'bN' }, g4: { pieceType: 'bP' }, e4: { pieceType: 'bB' },
    },
    dots: ['d4', 'd5', 'd6', 'd7', 'c3', 'b3', 'e3', 'f3', 'd2', 'd1'],
  },
  scattered: {
    label: 'Scattered (7 pits)',
    hazards: ['b3', 'c6', 'e4', 'f7', 'g2', 'h5', 'a7', 'e6'],
    position: {
      d3: { pieceType: 'wR' },
      e8: { pieceType: 'bK' },
      b7: { pieceType: 'bP' }, d6: { pieceType: 'bP' }, f6: { pieceType: 'bP' }, g7: { pieceType: 'bP' },
      f4: { pieceType: 'bN' }, h4: { pieceType: 'bP' }, c4: { pieceType: 'bB' },
    },
    dots: ['d4', 'd5', 'c3', 'e3', 'f3', 'g3', 'd2', 'd1'],
  },
};

// Board is white-oriented: a8 is top-left.
function cellPos(sq: string): CSSProperties {
  const file = sq.charCodeAt(0) - 97;
  const rank = Number(sq[1]);
  return { left: `${file * 12.5}%`, top: `${(8 - rank) * 12.5}%`, width: '12.5%', height: '12.5%' };
}

// ── Lava treatments ──────────────────────────────────────────────────────────
// Tyler 2026-09-04 v2: "these are all too annoying, it should be a subtle lava
// that slowly bubbles." ONE idea, four intensities: quiet, dim lava with a dark
// crust rim, and a single small bubble that swells and pops every 4–8s per
// square, de-synced so the board never pulses together. Transform/opacity only.
type Treatment = 'current' | 'ember' | 'simmer' | 'lowboil' | 'brightrare';

interface Intensity {
  id: Treatment;
  name: string;
  pitch: string;
  use: string;
  /** Lava gradient (low saturation, deep red/orange). */
  base: string;
  rim: string;
  crack: string;
  /** Bubble diameter as % of square. */
  bubble: number;
  /** Period range in seconds: [min, max]. Each square picks inside it. */
  period: [number, number];
}

const INTENSITIES: Intensity[] = [
  {
    id: 'ember',
    name: 'A · Ember (dimmest)',
    pitch: 'Deep, almost brown-red lava. One small bubble every 6–9s. You notice it only when you look for it.',
    use: 'Quietest. Safe for boards with 20+ hazards and never competes with pieces. Risk: on a dim phone screen it can read as "mud" rather than lava.',
    base: 'linear-gradient(160deg, #7a2812 0%, #5e1c0e 60%, #4a150b 100%)',
    rim: '#2b0d06',
    crack: 'rgba(30,10,5,0.55)',
    bubble: 13,
    period: [6, 9],
  },
  {
    id: 'simmer',
    name: 'B · Simmer',
    pitch: 'A notch warmer. One bubble every 5–8s, a little bigger. Still background.',
    use: 'The middle. Reads as lava at a glance without pulling the eye off Rookie. My pick for the default.',
    base: 'linear-gradient(160deg, #9a3316 0%, #7a2610 60%, #5e1c0c 100%)',
    rim: '#30100a',
    crack: 'rgba(35,10,5,0.5)',
    bubble: 17,
    period: [5, 8],
  },
  {
    id: 'lowboil',
    name: 'C · Low boil',
    pitch: 'Brightest of the set (still muted orange-red), bubble every 4–6s and larger. The most "alive."',
    use: 'Good for a 7-square moat; on a scattered 15+ layout the eye starts counting bubbles. Use only if A/B feel dead.',
    base: 'linear-gradient(160deg, #b8421a 0%, #963012 60%, #722210 100%)',
    rim: '#361208',
    crack: 'rgba(40,12,5,0.45)',
    bubble: 21,
    period: [4, 6],
  },
  {
    id: 'brightrare',
    name: 'D · Bright, rare',
    pitch: 'Lava as bright as C, but the bubble is small and only every 7–10s. Tests whether brightness or motion is the annoying part.',
    use: 'Control case. If this feels fine and C feels busy, motion is the lever, not color — ship B/C colors with D timing.',
    base: 'linear-gradient(160deg, #b8421a 0%, #963012 60%, #722210 100%)',
    rim: '#361208',
    crack: 'rgba(40,12,5,0.45)',
    bubble: 13,
    period: [7, 10],
  },
];

/** Faint crust cracks — low contrast, they only help the square read as rock. */
function Cracks({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="absolute inset-0 h-full w-full">
      <g fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M-2 30 L18 38 L30 22 L45 40 L62 30 L80 45 L102 38" />
        <path d="M20 102 L28 78 L45 85 L55 65 L75 78 L102 70" />
        <path d="M62 -2 L70 12 L86 6" />
      </g>
    </svg>
  );
}

/** Deterministic per-square jitter so squares never bubble in sync (stable across renders). */
function jitter(seed: number, salt: number): number {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function LavaCell({ kind, index }: { kind: Treatment; index: number }) {
  if (kind === 'current') {
    return <div className="absolute inset-0" style={{ backgroundColor: HAZARD_BG, backgroundImage: HAZARD_PATTERN }} />;
  }
  const v = INTENSITIES.find((i) => i.id === kind)!;
  const [pMin, pMax] = v.period;
  const period = pMin + (pMax - pMin) * jitter(index, 1);
  const delay = -period * jitter(index, 2);
  // Bubble sits somewhere in the middle 50% of the square, never on the rim.
  const left = 28 + 44 * jitter(index, 3) - v.bubble / 2;
  const top = 28 + 44 * jitter(index, 4) - v.bubble / 2;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundImage: v.base, boxShadow: `inset 0 0 0 2px ${v.rim}` }}>
      <Cracks color={v.crack} />
      <span
        aria-hidden
        className="lava-bubble absolute rounded-full"
        style={{
          left: `${left}%`, top: `${top}%`, width: `${v.bubble}%`, height: `${v.bubble}%`,
          border: `1.5px solid ${v.rim}`,
          background: 'radial-gradient(circle at 35% 35%, rgba(255,200,140,0.55), rgba(255,120,60,0.25) 70%)',
          transformOrigin: 'center',
          animation: `lavaBubble ${period.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
        }}
      />
    </div>
  );
}

// ── Option catalogue ─────────────────────────────────────────────────────────
const OPTIONS = INTENSITIES;

// ── Board card ───────────────────────────────────────────────────────────────
const PIECES = {
  ...defaultPieces,
  wR: () => <RookieCell form="rook" />,
};

function LavaBoard({ kind, layout }: { kind: Treatment; layout: Layout }) {
  const L = LAYOUTS[layout];
  const squareStyles: Record<string, CSSProperties> = {};
  for (const sq of L.dots) squareStyles[sq] = { backgroundImage: MOVE_DOT };
  return (
    <div className="relative">
      <ChessPathBoard
        options={{
          id: `lava-${kind}-${layout}`,
          position: L.position,
          pieces: PIECES,
          squareStyles,
          showNotation: false,
          boardOrientation: 'white',
          allowDragging: false,
          animationDurationInMs: 0,
        }}
      />
      {/* Hazard overlay — sits above the squares, only covers empty hazard squares. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ borderRadius: 8 }} aria-hidden>
        {L.hazards.map((sq, i) => (
          <div key={sq} className="absolute" style={cellPos(sq)}>
            <LavaCell kind={kind} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function LavaSquaresPage() {
  const [layout, setLayout] = useState<Layout>('moat');
  const [showCurrent, setShowCurrent] = useState(true);

  return (
    <div className="h-full overflow-auto text-white" style={{ background: BG }}>
      <style>{`
        /* One bubble per cycle: dormant ~78% of the period, swell ~18%, pop ~4%. */
        @keyframes lavaBubble {
          0%, 78% { transform: scale(0.2); opacity: 0; }
          88%     { transform: scale(0.85); opacity: 0.9; }
          95%     { transform: scale(1);    opacity: 1; }
          97%     { transform: scale(1.12); opacity: 0; }
          100%    { transform: scale(0.2);  opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lava-bubble { animation: none !important; opacity: 0.35; transform: scale(0.8); }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1180px] px-3 pb-16 pt-5 md:px-6">
        <header className="mb-4">
          <div className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: GOLD }}>Design page · not production</div>
          <h1 className="mt-1 text-[24px] font-black leading-tight md:text-[30px]">Lava squares</h1>
          <p className="mt-1 max-w-[62ch] text-[14px]" style={MUTED}>
            One idea at four intensities for the squares Rookie can&rsquo;t land on. Real board renderer, enemies next to the lava,
            Rookie&rsquo;s legal-move dots on. Quiet, dim lava; one small bubble every 4&ndash;8s per square, de-synced. A lava square must never look like a place you can go.
          </p>
        </header>

        {/* Controls */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl p-1" style={{ background: NAVY, boxShadow: 'inset 0 2px 0 rgba(0,0,0,0.35)' }} role="tablist" aria-label="Layout">
            {(Object.keys(LAYOUTS) as Layout[]).map((l) => {
              const on = l === layout;
              return (
                <button
                  key={l}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setLayout(l)}
                  className="min-h-[44px] rounded-lg px-4 text-[13px] font-black"
                  style={on ? { background: PANEL, color: GOLD, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.12), 0 2px 0 rgba(0,0,0,0.4)' } : MUTED}
                >
                  {LAYOUTS[l].label}
                </button>
              );
            })}
          </div>
          <label className="flex min-h-[44px] items-center gap-2 px-2 text-[13px] font-bold" style={MUTED}>
            <input type="checkbox" checked={showCurrent} onChange={(e) => setShowCurrent(e.target.checked)} className="h-4 w-4" />
            Show current hazard for comparison
          </label>
        </div>

        {showCurrent && (
          <section className="mb-6 rounded-2xl p-3 md:p-4" style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-3 md:flex md:items-start md:gap-5">
              <div className="md:w-[300px] md:shrink-0">
                <LavaBoard kind="current" layout={layout} />
              </div>
              <div className="mt-3 md:mt-0">
                <div className="text-[15px] font-black">0 · Current (crimson hatch)</div>
                <p className="mt-1 text-[13px]" style={MUTED}>
                  What ships today: a 45% crimson wash + diagonal hatch. Clear enough, but it reads as &ldquo;damage&rdquo; or
                  &ldquo;selected wrong&rdquo; more than as terrain, and it is the only red on the board.
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {OPTIONS.map((o) => (
            <section
              key={o.id}
              className="rounded-2xl p-3 md:p-4"
              style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 6px 18px rgba(0,0,0,0.35)' }}
            >
              <LavaBoard kind={o.id} layout={layout} />
              <div className="mt-3">
                <div className="text-[15px] font-black">{o.name}</div>
                <p className="mt-1 text-[13px] leading-snug" style={{ color: 'rgba(255,255,255,0.86)' }}>{o.pitch}</p>
                <p className="mt-2 rounded-lg px-2.5 py-2 text-[12px] leading-snug" style={{ background: 'rgba(0,0,0,0.28)', ...MUTED }}>
                  <span className="font-black" style={{ color: GOLD }}>Use this: </span>
                  {o.use}
                </p>
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-8 max-w-[70ch] text-[12px] leading-relaxed" style={MUTED}>
          <div className="font-black text-white">Checks baked into every board</div>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>No green, no blue, no highlight tint on lava — the legal-move dots (Rookie on d3) are the only &ldquo;you can go here&rdquo; signal.</li>
            <li>Enemy pieces sit on squares touching the lava (a6, c6, f6, b4, e4, g4 on the moat) to check the pieces still pop.</li>
            <li>Gradients + one inline SVG + a single transform/opacity keyframe per square. No images, no deps, no filters, no glow. Honors prefers-reduced-motion (bubble goes static).</li>
            <li>Each square picks its own period + phase from a seeded hash, so the moat never bubbles in sync.</li>
            <li>Production hook: Board.tsx `squareStyles` hazard block (HAZARD_BG / HAZARD_PATTERN) plus an overlay like the goal-row motes.</li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
