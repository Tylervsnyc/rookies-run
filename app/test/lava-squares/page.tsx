'use client';

/**
 * DESIGN PAGE — lava hazard squares (Tyler 2026-09-04: "Lava is really funny,
 * and people know."). Six pure-CSS/SVG treatments for the squares Rookie can't
 * land on, shown on the real board renderer (ChessPathBoard + RookieCell) with
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
type Treatment = 'current' | 'flat' | 'glow' | 'bubbles' | 'crust' | 'cooled' | 'pixel';

const CRUST_DARK = '#4a1206';
const FLAT_BASE =
  'radial-gradient(circle at 30% 35%, #ffe066 0%, #ffb020 26%, transparent 29%),' +
  'radial-gradient(circle at 72% 68%, #ffcf3d 0%, #ff9a1c 20%, transparent 23%),' +
  'linear-gradient(160deg, #ff7a12 0%, #ec4a0c 55%, #c9300a 100%)';

/** Dark crust cracks — one SVG, reused by flat / glow / bubbles. */
function Cracks({ color = CRUST_DARK, width = 5 }: { color?: string; width?: number }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="absolute inset-0 h-full w-full">
      <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
        <path d="M-2 30 L18 38 L30 22 L45 40 L62 30 L80 45 L102 38" />
        <path d="M20 102 L28 78 L45 85 L55 65 L75 78 L102 70" />
        <path d="M-2 62 L14 70 L26 58" />
        <path d="M62 -2 L70 12 L86 6" />
      </g>
    </svg>
  );
}

/** Glowing seams — shared by crust / cooled. Three strokes: halo, seam, hot core. */
function Seams({ halo, seam, core, dim = false }: { halo: string; seam: string; core: string; dim?: boolean }) {
  const d1 = 'M-2 34 L16 42 L30 24 L46 44 L64 32 L82 48 L102 40';
  const d2 = 'M22 102 L30 80 L48 88 L58 66 L78 80 L102 72';
  const d3 = 'M-2 66 L14 74 L28 60';
  const d4 = 'M60 -2 L70 14 L88 8';
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="absolute inset-0 h-full w-full">
      {!dim && (
        <g fill="none" stroke={halo} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" opacity={0.8}>
          <path d={d1} /><path d={d2} /><path d={d3} /><path d={d4} />
        </g>
      )}
      <g fill="none" stroke={seam} strokeWidth={dim ? 2.6 : 4.2} strokeLinecap="round" strokeLinejoin="round">
        <path d={d1} /><path d={d2} /><path d={d3} /><path d={d4} />
      </g>
      <g fill="none" stroke={core} strokeWidth={dim ? 0.9 : 1.3} strokeLinecap="round" strokeLinejoin="round">
        <path d={d1} /><path d={d2} /><path d={d3} /><path d={d4} />
      </g>
    </svg>
  );
}

// Fixed bubble/spark slots so the pattern isn't identical on every square: we
// rotate through 3 phase sets by square index.
const BUBBLES: Array<[number, number, number, number]> = [
  // [left%, top%, sizePct, delayS]
  [22, 62, 22, 0.0], [66, 30, 16, 0.7], [58, 72, 13, 1.3],
];
const SPARKS: Array<[number, number, number]> = [[30, 40, 0.2], [72, 55, 0.9]];

function LavaCell({ kind, index }: { kind: Treatment; index: number }) {
  const phase = (index % 3) * 0.45;

  if (kind === 'current') {
    return <div className="absolute inset-0" style={{ backgroundColor: HAZARD_BG, backgroundImage: HAZARD_PATTERN }} />;
  }

  if (kind === 'flat') {
    return (
      <div className="absolute inset-0" style={{ backgroundImage: FLAT_BASE, boxShadow: `inset 0 0 0 3px ${CRUST_DARK}` }}>
        <Cracks />
      </div>
    );
  }

  if (kind === 'glow') {
    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: FLAT_BASE,
          boxShadow: `inset 0 0 0 3px ${CRUST_DARK}`,
          animation: `lavaGlow 2.8s ease-in-out ${-phase}s infinite`,
        }}
      >
        {/* Hot-spot layer: only opacity animates (compositor-cheap). */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 40% 45%, rgba(255,240,150,0.95) 0%, rgba(255,200,60,0.5) 30%, transparent 55%)',
            animation: `lavaHot 2.8s ease-in-out ${-phase}s infinite`,
          }}
        />
        <Cracks />
      </div>
    );
  }

  if (kind === 'bubbles') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ backgroundImage: FLAT_BASE, boxShadow: `inset 0 0 0 3px ${CRUST_DARK}` }}>
        <Cracks />
        {BUBBLES.map(([l, t, s, d], i) => (
          <span
            key={i}
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: `${l}%`, top: `${t}%`, width: `${s}%`, height: `${s}%`,
              border: '2px solid rgba(80,20,6,0.85)',
              background: 'radial-gradient(circle at 35% 35%, rgba(255,235,150,0.9), rgba(255,140,30,0.5))',
              transformOrigin: 'center',
              animation: `lavaBubble 1.9s ease-out ${-(d + phase)}s infinite`,
            }}
          />
        ))}
        {SPARKS.map(([l, t, d], i) => (
          <span
            key={`s${i}`}
            aria-hidden
            className="absolute"
            style={{
              left: `${l}%`, top: `${t}%`, width: 3, height: 3,
              background: '#fff4b0',
              boxShadow: '0 0 4px 1px rgba(255,220,90,0.9)',
              animation: `lavaSpark 1.5s ease-out ${-(d + phase)}s infinite`,
            }}
          />
        ))}
      </div>
    );
  }

  if (kind === 'crust') {
    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(255,110,20,0.28) 0%, transparent 60%), linear-gradient(160deg, #2a130e 0%, #1b0b08 100%)',
          boxShadow: 'inset 0 0 0 2px #120705',
        }}
      >
        <div className="absolute inset-0" style={{ animation: `lavaSeam 3.2s ease-in-out ${-phase}s infinite` }}>
          <Seams halo="#ff7a1a" seam="#ff8f1f" core="#ffe27a" />
        </div>
      </div>
    );
  }

  if (kind === 'cooled') {
    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(160deg, #3d1a12 0%, #2c120d 100%)',
          boxShadow: 'inset 0 0 0 2px #1a0906',
        }}
      >
        <Seams dim halo="" seam="#b8451a" core="#e8843a" />
      </div>
    );
  }

  // pixel — 4x4 blocks in Rookie's block language; a few blocks breathe.
  const PIX = [
    ['#e8420c', '#ff8a1c', '#ffb020', '#c9300a'],
    ['#ff7a12', '#5a1a0a', '#ff6a0c', '#ffcf3d'],
    ['#ffb020', '#ff8a1c', '#4a1206', '#ff7a12'],
    ['#c9300a', '#ff6a0c', '#ffb020', '#e8420c'],
  ];
  const BREATHE = new Set(['0,2', '1,3', '2,0', '3,2', '1,0']);
  return (
    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-[1px] p-[2px]" style={{ background: '#2a0e07' }}>
      {PIX.flatMap((row, y) =>
        row.map((c, x) => (
          <span
            key={`${x},${y}`}
            aria-hidden
            style={{
              background: c,
              animation: BREATHE.has(`${x},${y}`) ? `lavaPix 2.2s ease-in-out ${-((x + y) * 0.35 + phase)}s infinite` : undefined,
            }}
          />
        )),
      )}
    </div>
  );
}

// ── Option catalogue ─────────────────────────────────────────────────────────
const OPTIONS: Array<{ id: Treatment; name: string; pitch: string; use: string }> = [
  {
    id: 'flat',
    name: '1 · Flat cartoon lava',
    pitch: 'Orange-red pit with a dark crust rim and cracks. Zero motion. Reads "lava" from across the room.',
    use: 'Cheapest: one gradient + one 4-path SVG per square, no animation. Best baseline. The dark rim is what makes it read as a pit, not a highlight.',
  },
  {
    id: 'glow',
    name: '2 · Slow pulse',
    pitch: 'Same pit, but it breathes — a hot spot brightens and the rim glows every ~3s, offset per square.',
    use: 'Cheap: only opacity + box-shadow animate (compositor). 7 squares pulsing is fine; 20+ starts to feel like a warning light. Pair with option 5 for dense levels.',
  },
  {
    id: 'bubbles',
    name: '3 · Bubbles + sparks',
    pitch: 'Blorp. Three bubbles swell and pop, two sparks jump. This is the one that is actually funny.',
    use: 'Still cheap (transform/opacity only, ~5 extra spans per square), but the busiest — on a moat of 7 it is charming, on 20 pits it competes with the pieces. Cap it at ~10 squares or fall back to 5.',
  },
  {
    id: 'crust',
    name: '4 · Cracked crust, glowing seams',
    pitch: 'Dark cooled rock with molten seams glowing through the cracks. Moodier, more Rookie\'s Revenge.',
    use: 'Cheap (one SVG, opacity pulse). Best contrast with pieces: the dark base sits under the green/cream board without fighting it. Weakest "instant lava" read at small sizes — the seams need ~40px squares.',
  },
  {
    id: 'cooled',
    name: '5 · Cooled (dense-level variant)',
    pitch: 'Same crust, dimmer seams, no motion. For levels with 15+ hazards so the board does not scream.',
    use: 'Cheapest of the dark set, static. Not meant to stand alone — it is the quiet sibling of 4 (or of 1) that the renderer swaps to when hazard count is high.',
  },
  {
    id: 'pixel',
    name: '6 · Pixel lava (Rookie block language)',
    pitch: '4x4 blocks of orange/red/yellow that breathe like Rookie\'s sprite. Lava in the same dialect as the mascot.',
    use: 'Cheap (16 divs, 5 opacity animations). Most on-brand and reads well tiny. Risk: the yellow blocks are the same value as the goal-row gold — keep goal rank and pixel lava apart.',
  },
];

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
        @keyframes lavaGlow {
          0%, 100% { box-shadow: inset 0 0 0 3px ${CRUST_DARK}, inset 0 0 10px rgba(255,190,60,0.25); }
          50%      { box-shadow: inset 0 0 0 3px ${CRUST_DARK}, inset 0 0 22px rgba(255,220,90,0.8); }
        }
        @keyframes lavaHot {
          0%, 100% { opacity: 0.15; }
          50%      { opacity: 1; }
        }
        @keyframes lavaBubble {
          0%   { transform: scale(0.25); opacity: 0; }
          55%  { transform: scale(1);    opacity: 1; }
          80%  { transform: scale(1.15); opacity: 0.9; }
          86%  { transform: scale(1.3);  opacity: 0; }
          100% { transform: scale(0.25); opacity: 0; }
        }
        @keyframes lavaSpark {
          0%   { transform: translate(0, 0) scale(1);       opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translate(6px, -34px) scale(0.4); opacity: 0; }
        }
        @keyframes lavaSeam {
          0%, 100% { opacity: 0.62; }
          50%      { opacity: 1; }
        }
        @keyframes lavaPix {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50%      { opacity: 0.55; filter: brightness(1.35); }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1180px] px-3 pb-16 pt-5 md:px-6">
        <header className="mb-4">
          <div className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: GOLD }}>Design page · not production</div>
          <h1 className="mt-1 text-[24px] font-black leading-tight md:text-[30px]">Lava squares</h1>
          <p className="mt-1 max-w-[62ch] text-[14px]" style={MUTED}>
            Six treatments for the squares Rookie can&rsquo;t land on. Real board renderer, enemies next to the lava,
            Rookie&rsquo;s legal-move dots on. A lava square must never look like a place you can go.
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <li>All treatments are gradients + inline SVG + opacity/transform keyframes. No images, no deps, no filters except the pixel pulse.</li>
            <li>Production hook: Board.tsx `squareStyles` hazard block (HAZARD_BG / HAZARD_PATTERN) plus an overlay like the goal-row motes.</li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
