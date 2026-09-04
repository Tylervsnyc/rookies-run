'use client';

/**
 * DESIGN PAGE — lava hazard squares (Tyler 2026-09-04: "Lava is really funny,
 * and people know." → "too annoying" → "think lava like Mario, with a small
 * stone border holding it in"). Three Mario-lake variations, shown on the real board renderer (ChessPathBoard + RookieCell) with
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
// Tyler 2026-09-04 v3: "think lava like Mario. Make something awesome. Make a
// stone border, very small, so it looks like it's holding it in." Saturated
// Mario-lake lava, slow rolling flow (6–10s loops, transform only), an
// occasional bubble, and a thin bevelled stone rim drawn only on edges that do
// NOT touch another lava square — so a moat reads as one river with a bank.
type Treatment = 'current' | 'classic' | 'glow' | 'pixel';

interface Edges { top: boolean; right: boolean; bottom: boolean; left: boolean }

const MARIO = {
  hot: '#ffd23a',      // crest highlight
  bright: '#ffa322',   // surface
  mid: '#ff7a14',      // body
  deep: '#e8460f',     // underlayer
  blob: '#c93408',     // dark rolling blobs
  bubbleRim: '#c63e08',
};

/** Thin stone rim — only on open edges. Bricks run along the edge; outer face lit, inner face shadowed. */
function StoneRim({ edges, glow }: { edges: Edges; glow?: boolean }) {
  const W = 'var(--rim)';
  const stone = 'linear-gradient(180deg, #b9bcc2 0%, #8d9198 55%, #6b6f76 100%)';
  const stoneV = 'linear-gradient(90deg, #b9bcc2 0%, #8d9198 55%, #6b6f76 100%)';
  const jointsH = 'repeating-linear-gradient(90deg, transparent 0 9px, rgba(20,20,28,0.55) 9px 10px)';
  const jointsV = 'repeating-linear-gradient(180deg, transparent 0 9px, rgba(20,20,28,0.55) 9px 10px)';
  const bevel = 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.5)';
  const bevelV = 'inset 1px 0 0 rgba(255,255,255,0.55), inset -1px 0 0 rgba(0,0,0,0.5)';
  const hot = glow ? '0 0 6px 1px rgba(255,170,40,0.9)' : undefined;
  const strip = (side: keyof Edges, style: CSSProperties) =>
    edges[side] ? <span key={side} aria-hidden className="absolute" style={{ ...style, zIndex: 2 }} /> : null;
  return (
    <>
      {strip('top', { left: 0, right: 0, top: 0, height: W, backgroundImage: `${jointsH}, ${stone}`, boxShadow: [bevel, hot].filter(Boolean).join(', ') })}
      {strip('bottom', { left: 0, right: 0, bottom: 0, height: W, backgroundImage: `${jointsH}, ${stone}`, boxShadow: [bevel, hot].filter(Boolean).join(', ') })}
      {strip('left', { top: 0, bottom: 0, left: 0, width: W, backgroundImage: `${jointsV}, ${stoneV}`, boxShadow: [bevelV, hot].filter(Boolean).join(', ') })}
      {strip('right', { top: 0, bottom: 0, right: 0, width: W, backgroundImage: `${jointsV}, ${stoneV}`, boxShadow: [bevelV, hot].filter(Boolean).join(', ') })}
    </>
  );
}

/** Deterministic per-square jitter so bubbles never sync (stable across renders). */
function jitter(seed: number, salt: number): number {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function Bubble({ index, square }: { index: number; square?: boolean }) {
  const period = 5 + 4 * jitter(index, 1);
  const delay = -period * jitter(index, 2);
  const size = square ? 12.5 : 16;
  const left = 30 + 40 * jitter(index, 3) - size / 2;
  const top = 30 + 40 * jitter(index, 4) - size / 2;
  return (
    <span
      aria-hidden
      className={`lava-anim absolute ${square ? '' : 'rounded-full'}`}
      style={{
        left: `${left}%`, top: `${top}%`, width: `${size}%`, height: `${size}%`,
        border: square ? undefined : `2px solid ${MARIO.bubbleRim}`,
        background: square ? MARIO.hot : `radial-gradient(circle at 35% 35%, #fff2a0, ${MARIO.hot} 70%)`,
        transformOrigin: 'center',
        animation: `lavaBubble ${period.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
        zIndex: 1,
      }}
    />
  );
}

/**
 * Rolling flow — two layers, each 200% wide with a pattern period of exactly
 * one square, translated by -50% on a long linear loop. Because the period
 * equals the square width and every square shares the same phase, the bands
 * line up across adjacent lava squares and the moat reads as one river.
 */
function Flow() {
  return (
    <>
      {/* dark underlayer blobs, drifting left, slow */}
      <span
        aria-hidden
        className="lava-anim absolute top-0 bottom-0 left-0"
        style={{
          width: '200%',
          backgroundImage:
            `radial-gradient(ellipse 30% 22% at 20% 70%, ${MARIO.blob} 0 98%, transparent 100%),` +
            `radial-gradient(ellipse 26% 18% at 62% 30%, ${MARIO.blob} 0 98%, transparent 100%),` +
            `radial-gradient(ellipse 22% 16% at 84% 78%, ${MARIO.deep} 0 98%, transparent 100%)`,
          backgroundSize: '50% 100%',
          opacity: 0.85,
          animation: 'lavaDriftL 13s linear infinite',
        }}
      />
      {/* bright highlight bands, drifting right, a touch faster */}
      <span
        aria-hidden
        className="lava-anim absolute top-0 bottom-0 left-0"
        style={{
          width: '200%',
          backgroundImage:
            `radial-gradient(ellipse 34% 14% at 30% 28%, ${MARIO.hot} 0 98%, transparent 100%),` +
            `radial-gradient(ellipse 24% 11% at 72% 58%, ${MARIO.hot} 0 98%, transparent 100%),` +
            `radial-gradient(ellipse 18% 9% at 48% 84%, #fff0a0 0 98%, transparent 100%)`,
          backgroundSize: '50% 100%',
          opacity: 0.9,
          animation: 'lavaDriftR 9s linear infinite',
        }}
      />
    </>
  );
}

// 8-bit lava: 16x8 pixel tile (period 8 px wide) — crest line of yellow over
// orange, red body, a few dark blobs. Steps left one pixel per second.
const PIX_CREST = [1, 2, 3, 3, 2, 1, 0, 0];
const PIX_BLOBS = new Set(['2,5', '3,6', '6,6', '7,5', '0,7', '5,4']);
function PixelFlow() {
  const rects: React.ReactNode[] = [];
  for (let x = 0; x < 16; x++) {
    const c = PIX_CREST[x % 8];
    for (let y = 0; y < 8; y++) {
      let fill = MARIO.bright;
      if (y < c) fill = MARIO.mid;
      else if (y === c) fill = MARIO.hot;
      else if (y === c + 1) fill = MARIO.bright;
      else fill = PIX_BLOBS.has(`${x % 8},${y}`) ? MARIO.blob : MARIO.deep;
      rects.push(<rect key={`${x},${y}`} x={x} y={y} width={1} height={1} fill={fill} />);
    }
  }
  return (
    <svg
      viewBox="0 0 16 8"
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      aria-hidden
      className="lava-anim absolute top-0 bottom-0 left-0 h-full"
      style={{ width: '200%', animation: 'lavaDriftL 8s steps(8, end) infinite' }}
    >
      {rects}
    </svg>
  );
}

function LavaCell({ kind, index, edges }: { kind: Treatment; index: number; edges: Edges }) {
  if (kind === 'current') {
    return <div className="absolute inset-0" style={{ backgroundColor: HAZARD_BG, backgroundImage: HAZARD_PATTERN }} />;
  }
  if (kind === 'pixel') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ background: MARIO.deep }}>
        <PixelFlow />
        <Bubble index={index} square />
        <StoneRim edges={edges} />
      </div>
    );
  }
  const glow = kind === 'glow';
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundImage: `linear-gradient(180deg, ${MARIO.bright} 0%, ${MARIO.mid} 55%, ${MARIO.deep} 100%)` }}
    >
      <Flow />
      {glow && (
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ boxShadow: 'inset 0 0 10px 2px rgba(255,236,120,0.85)', zIndex: 1 }}
        />
      )}
      <Bubble index={index} />
      <StoneRim edges={edges} glow={glow} />
    </div>
  );
}

// ── Option catalogue ─────────────────────────────────────────────────────────
const OPTIONS: Array<{ id: Treatment; name: string; pitch: string; use: string }> = [
  {
    id: 'classic',
    name: 'A · Mario classic',
    pitch: 'Flat two-tone lake: bright orange surface over a red underlayer, yellow highlight bands drifting one way, dark blobs the other, a bubble now and then. Stone bank holds it in.',
    use: 'Cheapest of the three: two gradient layers on transform loops (9s / 13s) + one bubble per square. The rim only draws on open edges, so the moat is one river. This is the pick.',
  },
  {
    id: 'glow',
    name: 'B · Classic + rim glow',
    pitch: 'Same lake, plus a warm glow licking the inside of the stone rim so the stone looks heated.',
    use: 'Same cost (one static inset shadow + a 6px halo on the rim strips). Slightly stronger "hot" read; slightly busier against cream squares. Use if A feels flat next to the gold goal row.',
  },
  {
    id: 'pixel',
    name: 'C · 8-bit Mario',
    pitch: 'Blocky 8x8 pixel lava: yellow crest, orange, red, dark blobs, stepping left one pixel per second like a NES scroll. Square bubbles. Same stone bank.',
    use: 'One SVG of 128 rects per square on a steps() loop — fine for a moat, 20+ squares is ~2.5k rects (still OK, but the heaviest). Best match for Rookie\'s block sprite; the stepping motion is the most "alive" without being busy.',
  },
];

// ── Board card ───────────────────────────────────────────────────────────────
const PIECES = {
  ...defaultPieces,
  wR: () => <RookieCell form="rook" />,
};

function openEdges(sq: string, hazards: Set<string>): Edges {
  const f = sq.charCodeAt(0);
  const r = Number(sq[1]);
  const has = (df: number, dr: number) => hazards.has(`${String.fromCharCode(f + df)}${r + dr}`);
  return { top: !has(0, 1), bottom: !has(0, -1), left: !has(-1, 0), right: !has(1, 0) };
}

function LavaBoard({ kind, layout }: { kind: Treatment; layout: Layout }) {
  const L = LAYOUTS[layout];
  const hz = new Set(L.hazards);
  const squareStyles: Record<string, CSSProperties> = {};
  for (const sq of L.dots) squareStyles[sq] = { backgroundImage: MOVE_DOT };
  return (
    <div className="relative" style={{ '--rim': '3px' } as CSSProperties}>
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
            <LavaCell kind={kind} index={i} edges={openEdges(sq, hz)} />
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
        /* Rolling flow: layer is 200% wide with a 1-square pattern period, so -50% loops seamlessly. */
        @keyframes lavaDriftL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes lavaDriftR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        /* One bubble per cycle: dormant ~78% of the period, swell, pop. */
        @keyframes lavaBubble {
          0%, 78% { transform: scale(0.2); opacity: 0; }
          88%     { transform: scale(0.85); opacity: 1; }
          95%     { transform: scale(1);    opacity: 1; }
          97%     { transform: scale(1.15); opacity: 0; }
          100%    { transform: scale(0.2);  opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lava-anim { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1180px] px-3 pb-16 pt-5 md:px-6">
        <header className="mb-4">
          <div className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: GOLD }}>Design page · not production</div>
          <h1 className="mt-1 text-[24px] font-black leading-tight md:text-[30px]">Lava squares</h1>
          <p className="mt-1 max-w-[62ch] text-[14px]" style={MUTED}>
            Mario-lake lava for the squares Rookie can&rsquo;t land on. Real board renderer, enemies next to the lava,
            Rookie&rsquo;s legal-move dots on. Slow rolling flow, an occasional bubble, and a thin stone bank that only draws on edges not touching other lava, so a moat is one river. A lava square must never look like a place you can go.
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
            <li>Gradients + inline SVG, transform/opacity loops only (9s / 13s flow, 5&ndash;9s bubbles), no filters. prefers-reduced-motion freezes everything.</li>
            <li>Flow layers share one phase and a one-square pattern period, so bands line up across neighbours; bubbles are de-synced by a seeded hash.</li>
            <li>Stone rim = 3px bevelled strips per open edge (neighbour lookup is a Set of hazard squares; Board.tsx has the same list in `state.hazards`).</li>
            <li>Production hook: Board.tsx `squareStyles` hazard block (HAZARD_BG / HAZARD_PATTERN) plus an overlay like the goal-row motes.</li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
