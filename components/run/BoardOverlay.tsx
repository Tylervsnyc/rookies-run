'use client';

/**
 * BoardOverlay — an SVG layer drawn on top of a board (white orientation).
 * Arrows between squares, "blocked" dashed lines, and comic-book bursts
 * ("!!") pinned to a square. Pointer-events off, so taps reach the board.
 *
 * Mount inside a `position: relative` wrapper that hugs the board exactly.
 */

export interface OverlayArrow {
  from: string; // algebraic, e.g. 'a1'
  to: string;
  /**
   * 'go' = solid dark arrow (a real move); 'blocked' = red dashed line with a
   * cross; 'ghost' = dim dashed grey arrow (a move that WOULD happen — a miss).
   */
  kind?: 'go' | 'blocked' | 'ghost';
  /** 'L' = a knight-shaped path: the long leg first (two squares), then one over. */
  path?: 'straight' | 'L';
  /** Optional stroke colour override for a 'go' arrow (e.g. a yellow foreshadow). */
  color?: string;
}

export interface OverlayBurst {
  square: string;
  /**
   * A line of dialogue FROM the piece on `square`: the bubble sits fully
   * above the square, centred, with its tail pointing straight down at the
   * speaker (a burst like "!!" hangs off the square's shoulder instead).
   */
  speech?: boolean;
  text: string; // '!!', '?!', ...
}

interface BoardOverlayProps {
  arrows?: OverlayArrow[];
  bursts?: OverlayBurst[];
  /** Squares that get a red jittering ring (a piece "panicking"). */
  shakes?: string[];
  /** Squares that get a bouncing blue "tap this" arrow above them. */
  pointers?: string[];
}

const POINT = '#3d9be9';

/**
 * PointerArrow — a bouncing blue arrow pointing DOWN at whatever sits under
 * it. Used on the board (via `pointers`) and DOM-anchored over ability
 * cards in the rack / offer modal. Position it with `style`.
 */
export function PointerArrow({ style, size = 30 }: { style?: React.CSSProperties; size?: number }) {
  return (
    <div
      aria-hidden
      style={{
        pointerEvents: 'none',
        zIndex: 8,
        animation: 'rrOvPointBounce 900ms ease-in-out infinite',
        filter: 'drop-shadow(0 2px 2px rgba(18,34,43,0.35))',
        lineHeight: 0,
        ...style,
      }}
    >
      <style>{`
        @keyframes rrOvPointBounce {
          0%, 100% { transform: translate(-50%, 0); }
          50%      { transform: translate(-50%, -7px); }
        }
      `}</style>
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path
          d="M12 2 L12 14 M5 9 L12 16 L19 9"
          fill="none"
          stroke="#fff"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 2 L12 14 M5 9 L12 16 L19 9"
          fill="none"
          stroke={POINT}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function center(sq: string): { x: number; y: number } {
  const file = sq.charCodeAt(0) - 96; // a=1
  const rank = Number(sq[1]);
  return { x: file - 0.5, y: 8 - rank + 0.5 };
}

const GO = '#2A3C45';
const BLOCKED = '#E53935';
const GHOST = '#7a8a93';

export function BoardOverlay({ arrows = [], bursts = [], shakes = [], pointers = [] }: BoardOverlayProps) {
  if (arrows.length === 0 && bursts.length === 0 && shakes.length === 0 && pointers.length === 0) return null;
  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }}
    >
      <style>{`
        @keyframes rrOvArrowIn {
          from { stroke-dashoffset: 24; opacity: 0; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes rrOvBurstIn {
          0%   { transform: translate(-50%, -100%) scale(0.2) rotate(-12deg); opacity: 0; }
          55%  { transform: translate(-50%, -100%) scale(1.25) rotate(6deg); opacity: 1; }
          75%  { transform: translate(-50%, -100%) scale(0.92) rotate(-3deg); }
          100% { transform: translate(-50%, -100%) scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes rrOvJitter {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20%      { transform: translate(-4%, 2%) rotate(-3deg); }
          40%      { transform: translate(4%, -2%) rotate(3deg); }
          60%      { transform: translate(-3%, -3%) rotate(-2deg); }
          80%      { transform: translate(3%, 3%) rotate(2deg); }
        }
        @keyframes rrOvShake {
          0%, 100% { transform: translate(-50%, -100%) translateX(0); }
          25%      { transform: translate(-50%, -100%) translateX(-1.5px); }
          75%      { transform: translate(-50%, -100%) translateX(1.5px); }
        }
      `}</style>
      <svg viewBox="0 0 8 8" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <marker id="rrOvHeadGo" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={GO} />
          </marker>
          <marker id="rrOvHeadBlocked" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={BLOCKED} />
          </marker>
          <marker id="rrOvHeadGhost" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={GHOST} />
          </marker>
        </defs>
        {arrows.map((a, i) => {
          const f = center(a.from);
          const t = center(a.to);
          if (a.path === 'L') {
            // Knight path: the long leg (2 squares) first, then the short one.
            const ddx = t.x - f.x;
            const ddy = t.y - f.y;
            const corner = Math.abs(ddy) >= Math.abs(ddx) ? { x: f.x, y: t.y } : { x: t.x, y: f.y };
            // Pull the tip back so the head sits inside the target square.
            const lx = t.x - corner.x;
            const ly = t.y - corner.y;
            const ll = Math.hypot(lx, ly) || 1;
            const ex = t.x - (lx / ll) * 0.32;
            const ey = t.y - (ly / ll) * 0.32;
            const ghost = a.kind === 'ghost';
            const color = ghost ? GHOST : (a.color ?? GO);
            return (
              <g key={`${a.from}${a.to}${i}`} style={{ animation: `rrOvArrowIn 420ms ease-out ${i * 220}ms both` }}>
                <polyline
                  points={`${f.x},${f.y} ${corner.x},${corner.y} ${ex},${ey}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={0.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={ghost ? '0.28 0.2' : undefined}
                  opacity={ghost ? 0.6 : 0.82}
                  markerEnd={ghost ? 'url(#rrOvHeadGhost)' : 'url(#rrOvHeadGo)'}
                />
              </g>
            );
          }
          const dx = t.x - f.x;
          const dy = t.y - f.y;
          const len = Math.hypot(dx, dy) || 1;
          // Pull the tip back so the head sits inside the target square.
          const shrink = 0.32;
          const tx = t.x - (dx / len) * shrink;
          const ty = t.y - (dy / len) * shrink;
          const blocked = a.kind === 'blocked';
          const ghost = a.kind === 'ghost';
          const color = blocked ? BLOCKED : ghost ? GHOST : (a.color ?? GO);
          const customHead = !blocked && !ghost && a.color ? `rrOvHeadCustom-${i}` : null;
          const mx = (f.x + tx) / 2;
          const my = (f.y + ty) / 2;
          return (
            <g key={`${a.from}${a.to}${i}`} style={{ animation: `rrOvArrowIn 420ms ease-out ${i * 220}ms both` }}>
              {customHead && (
                <marker id={customHead} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill={color} />
                </marker>
              )}
              <line
                x1={f.x}
                y1={f.y}
                x2={tx}
                y2={ty}
                stroke={color}
                strokeWidth={0.2}
                strokeLinecap="round"
                strokeDasharray={blocked ? '0.32 0.22' : ghost ? '0.28 0.2' : undefined}
                opacity={blocked ? 0.85 : ghost ? 0.6 : 0.82}
                markerEnd={blocked ? 'url(#rrOvHeadBlocked)' : ghost ? 'url(#rrOvHeadGhost)' : customHead ? `url(#${customHead})` : 'url(#rrOvHeadGo)'}
              />
              {blocked && (
                <g stroke={BLOCKED} strokeWidth={0.18} strokeLinecap="round">
                  <circle cx={mx} cy={my} r={0.36} fill="#fff" stroke={BLOCKED} strokeWidth={0.12} />
                  <line x1={mx - 0.2} y1={my - 0.2} x2={mx + 0.2} y2={my + 0.2} />
                  <line x1={mx + 0.2} y1={my - 0.2} x2={mx - 0.2} y2={my + 0.2} />
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {shakes.map((sq) => {
        const c = center(sq);
        return (
          <div
            key={`shake-${sq}`}
            style={{
              position: 'absolute',
              left: `${((c.x - 0.5) / 8) * 100}%`,
              top: `${((c.y - 0.5) / 8) * 100}%`,
              width: '12.5%',
              height: '12.5%',
              boxSizing: 'border-box',
              border: `3px solid ${BLOCKED}`,
              borderRadius: 6,
              boxShadow: `0 0 10px 2px rgba(229,57,53,0.45)`,
              animation: 'rrOvJitter 260ms ease-in-out infinite',
            }}
          />
        );
      })}
      {pointers.map((sq) => {
        const c = center(sq);
        return (
          <PointerArrow
            key={`point-${sq}`}
            style={{
              position: 'absolute',
              left: `${(c.x / 8) * 100}%`,
              top: `${((c.y - 0.5) / 8) * 100 - 9}%`,
            }}
          />
        );
      })}
      {bursts.map((b) => {
        const c = center(b.square);
        return (
          <div
            key={b.square + b.text}
            style={{
              position: 'absolute',
              left: `${(c.x / 8) * 100 + (b.speech ? 0 : 5)}%`,
              top: b.speech ? `${((c.y - 0.5) / 8) * 100 - 1.5}%` : `${(c.y / 8) * 100 - 4}%`,
              transform: 'translate(-50%, -100%)',
              animation: 'rrOvBurstIn 480ms cubic-bezier(0.2, 1.4, 0.4, 1) both, rrOvShake 220ms ease-in-out 480ms 4',
              transformOrigin: '50% 100%',
            }}
          >
            <div
              style={{
                position: 'relative',
                background: '#fff',
                color: BLOCKED,
                border: `2.5px solid ${GO}`,
                borderRadius: 999,
                padding: b.speech ? '4px 10px' : '2px 9px',
                fontWeight: 900,
                fontSize: b.speech ? 13 : 15,
                lineHeight: 1.1,
                letterSpacing: b.speech ? 0 : '0.04em',
                boxShadow: '2px 2px 0 #2A3C45',
                whiteSpace: 'nowrap',
              }}
            >
              {b.text}
              <span
                style={{
                  position: 'absolute',
                  left: b.speech ? 'calc(50% - 5px)' : 8,
                  bottom: -8,
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: `8px solid ${GO}`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
