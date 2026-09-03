'use client';

/**
 * /test/share-options — five candidate share cards for the end of a run.
 *
 * Tyler (2026-09-03): "we need something to share [after a run], maybe the
 * last position of the run and the 3 ability cards — bring me up a test page
 * with 5 options for share content."
 *
 * Every card is designed at 1080x1350 (IG portrait / story-friendly) and
 * shown here scaled to 360x450. Static React only — no server render, no API.
 * All five use the same fake run data (RUN below).
 */

import type { CSSProperties, ReactNode } from 'react';
import { defaultPieces } from 'react-chessboard';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { artFile } from '@/components/run/AbilityCard';
import { REVENGE_RED, REVENGE_RED_DARK, REVENGE_TAGLINE, RevengeMarkSvg, RevengeReticleSvg } from '@/components/run/RookiesRevengeLogo';
import { ABILITY_DEFS, type AbilityId } from '@/lib/run/abilities';

// ---------------------------------------------------------------------------
// Fake run data (shared by all five cards).
// ---------------------------------------------------------------------------

const NAVY = '#0f1c3f';
const NAVY_MID = '#182a5c';
const NAVY_LIGHT = '#1c2f63';
const GOLD = '#FFC800';
const INK = '#FF3B30';
const LIGHT_SQ = '#edeed1';
const DARK_SQ = '#779952';
const URL = 'run.chesspath.app';

type PieceCode = 'bP' | 'bN' | 'bB' | 'bQ' | 'bK';
type Cell = PieceCode | 'rookie';
type Position = Record<string, Cell>;

const RUN = {
  name: 'Dead Bolt',
  date: 'Sep 3, 2026',
  difficulty: 'HARD',
  stars: 3 as 0 | 1 | 2 | 3,
  moves: 32,
  par: 35,
  retries: 0,
  time: '4:50',
  points: 3335,
  level: 10,
  totalLevels: 10,
  kit: ['knight-hop', 'surge', 'freeze-ray'] as AbilityId[],
  /** Moves spent per level, for the levels-reached strip (fake). */
  levelMoves: [2, 2, 3, 3, 3, 4, 3, 4, 4, 4],
};

/** Final position: Rookie has just taken the king on e8. A few black pieces left. */
const FINAL: Position = {
  e8: 'rookie',
  a7: 'bP',
  f6: 'bP',
  c6: 'bN',
  g5: 'bB',
};

/** Last four positions of level 10 (fake), ending in the capture. */
const REPLAY: { pos: Position; caption: string }[] = [
  { pos: { d3: 'rookie', d5: 'bP', a7: 'bP', f6: 'bP', c6: 'bN', g5: 'bB', e8: 'bK' }, caption: 'Rookie eyes the d-file.' },
  { pos: { d5: 'rookie', a7: 'bP', f6: 'bP', c6: 'bN', g5: 'bB', e8: 'bK' }, caption: 'Takes the pawn.' },
  { pos: { d8: 'rookie', a7: 'bP', f6: 'bP', c6: 'bN', g5: 'bB', e8: 'bK' }, caption: 'Slides to the back rank.' },
  { pos: FINAL, caption: 'CAPTURED.' },
];

// ---------------------------------------------------------------------------
// Shared bits.
// ---------------------------------------------------------------------------

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function Piece({ code }: { code: PieceCode }) {
  const Comp = defaultPieces[code as keyof typeof defaultPieces];
  return Comp ? <Comp /> : null;
}

/** Rookie's rook sprite, scaled to fill a square. BreathingRook md = 88x106. */
function RookieSprite({ square }: { square: number }) {
  const s = (square * 0.78) / 106;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: `scale(${s})`, transformOrigin: 'center' }}>
        <BreathingRook size="md" animate={false} />
      </div>
    </div>
  );
}

/** Static 8x8 board drawn with divs, app palette, react-chessboard piece SVGs. */
function MiniBoard({ pos, size, lit, radius = 18, border }: { pos: Position; size: number; lit?: boolean; radius?: number; border?: string }) {
  const sq = size / 8;
  return (
    <div style={{ width: size, height: size, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', borderRadius: radius, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.45)', border, boxSizing: 'content-box' }}>
      {Array.from({ length: 64 }).map((_, i) => {
        const file = i % 8;
        const rank = 8 - Math.floor(i / 8);
        const name = `${FILES[file]}${rank}`;
        const dark = (file + rank) % 2 === 0;
        const cell = pos[name];
        const isRookie = cell === 'rookie';
        return (
          <div key={name} style={{ position: 'relative', width: sq, height: sq, background: dark ? DARK_SQ : LIGHT_SQ }}>
            {isRookie && lit && (
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, ${REVENGE_RED} 0%, ${REVENGE_RED_DARK} 70%)`, boxShadow: `0 0 ${sq * 0.6}px ${REVENGE_RED}` }} />
            )}
            {isRookie ? <RookieSprite square={sq} /> : cell ? <div style={{ position: 'absolute', inset: sq * 0.06 }}><Piece code={cell} /></div> : null}
          </div>
        );
      })}
    </div>
  );
}

const STAR_PATH = 'M12 2.5l2.95 6.2 6.8.85-5 4.7 1.3 6.75L12 17.7 5.95 21l1.3-6.75-5-4.7 6.8-.85z';

function Stars({ stars, size = 96, gap = 18, hollow = 'rgba(255,255,255,0.35)', fill = GOLD, stroke = '#c9960a' }: { stars: 0 | 1 | 2 | 3; size?: number; gap?: number; hollow?: string; fill?: string; stroke?: string }) {
  return (
    <div style={{ display: 'flex', gap, justifyContent: 'center' }}>
      {[0, 1, 2].map((i) => {
        const earned = i < stars;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden style={earned ? { filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.4)) drop-shadow(0 0 14px rgba(255,200,0,0.55))' } : undefined}>
            <path d={STAR_PATH} fill={earned ? fill : 'none'} stroke={earned ? stroke : hollow} strokeWidth={1.6} strokeLinejoin="round" />
          </svg>
        );
      })}
    </div>
  );
}

function Art({ id, size, radius = 14, style }: { id: AbilityId; size: number; radius?: number; style?: CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/abilities/${artFile(id)}`} alt={ABILITY_DEFS[id].name} width={size} height={size} draggable={false} style={{ width: size, height: size, borderRadius: radius, objectFit: 'cover', display: 'block', ...style }} />;
}

/** Full ability card, tier-4 gold styling lifted from AbilityCard.tsx. */
function KitCard({ id, width, style }: { id: AbilityId; width: number; style?: CSSProperties }) {
  const def = ABILITY_DEFS[id];
  const pad = Math.round(width * 0.03);
  return (
    <div style={{ width, aspectRatio: '5 / 7', borderRadius: width * 0.07, padding: pad, background: 'linear-gradient(135deg, #b8852b, #6a4612 30%, #ffd87a 60%, #b8852b)', boxShadow: '0 0 30px rgba(255,191,36,0.45), 0 24px 40px rgba(0,0,0,0.5)', ...style }}>
      <div style={{ width: '100%', height: '100%', borderRadius: width * 0.05, background: '#f6e7c5', display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#3d2806', fontFamily: 'inherit' }}>
        <div style={{ padding: `${width * 0.04}px ${width * 0.06}px`, fontSize: width * 0.085, fontWeight: 900, letterSpacing: '0.01em', lineHeight: 1 }}>{def.name}</div>
        <div style={{ borderRadius: width * 0.03, background: 'radial-gradient(ellipse at center, #ffe9a8 0%, #d49a2a 100%)', width: width * 0.78, aspectRatio: '1 / 1', overflow: 'hidden', border: '3px solid rgba(106,70,18,0.6)', alignSelf: 'center' }}>
          <Art id={id} size={width * 0.78} radius={0} />
        </div>
        <div style={{ padding: `${width * 0.04}px ${width * 0.06}px 0`, fontSize: width * 0.052, fontWeight: 800, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{def.typeLine}</div>
        <div style={{ padding: `${width * 0.03}px ${width * 0.06}px`, fontSize: width * 0.06, fontWeight: 600, lineHeight: 1.25 }}>{def.description}</div>
      </div>
    </div>
  );
}

/** Small brand lockup used in the corner of every card. */
function Brand({ size = 84, dark = true, url = true }: { size?: number; dark?: boolean; url?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.16 }}>
      <RevengeMarkSvg size={size} />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: size * 0.34, fontWeight: 900, color: dark ? '#fff' : '#3C3C3C', letterSpacing: '-0.01em' }}>
          Rookie&rsquo;s <span style={{ background: REVENGE_RED, color: '#fff', borderRadius: size * 0.08, padding: `${size * 0.03}px ${size * 0.1}px`, boxShadow: `0 ${size * 0.04}px 0 ${REVENGE_RED_DARK}` }}>REVENGE</span>
        </div>
        {url && <div style={{ marginTop: size * 0.12, fontSize: size * 0.26, fontWeight: 800, color: dark ? 'rgba(255,255,255,0.7)' : '#666', letterSpacing: '0.04em' }}>{URL}</div>}
      </div>
    </div>
  );
}

/** Red ink stamp, like StampCard's CLEARED / CAPTURED. */
function InkStamp({ text, size = 72, rotate = -10, style }: { text: string; size?: number; rotate?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: 'inline-block', padding: `${size * 0.15}px ${size * 0.4}px`, border: `${size * 0.11}px solid ${INK}`, borderRadius: size * 0.2, color: INK, fontSize: size, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1, whiteSpace: 'nowrap', transform: `rotate(${rotate}deg)`, background: 'rgba(15,28,63,0.75)', mixBlendMode: 'screen', ...style }}>
      {text}
    </div>
  );
}

function Chip({ children, gold }: { children: ReactNode; gold?: boolean }) {
  return (
    <span style={{ borderRadius: 14, padding: '12px 22px', fontSize: 30, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', fontVariantNumeric: 'tabular-nums', background: gold ? 'rgba(255,200,0,0.15)' : 'rgba(255,255,255,0.1)', color: gold ? GOLD : 'rgba(255,255,255,0.85)', textShadow: gold ? '0 3px 0 rgba(0,0,0,0.5)' : undefined }}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Option 1 — Final position.
// ---------------------------------------------------------------------------

function FinalPositionCard() {
  return (
    <div style={{ width: 1080, height: 1350, background: `radial-gradient(circle at 50% 20%, ${NAVY_LIGHT} 0%, ${NAVY} 70%)`, color: '#fff', padding: 56, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Brand size={84} />
        <div style={{ textAlign: 'right', lineHeight: 1.1 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{RUN.date}</div>
          <div style={{ fontSize: 40, fontWeight: 900 }}>{RUN.name} <span style={{ color: GOLD }}>&middot;</span> {RUN.difficulty}</div>
        </div>
      </div>

      <div style={{ position: 'relative', margin: '48px auto 0' }}>
        <MiniBoard pos={FINAL} size={960} lit radius={22} />
        <div style={{ position: 'absolute', left: '50%', bottom: -40, transform: 'translateX(-50%)' }}>
          <InkStamp text="Run complete" size={82} rotate={-8} style={{ mixBlendMode: 'normal', background: 'rgba(15,28,63,0.92)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }} />
        </div>
      </div>

      <div style={{ marginTop: 84, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stars stars={RUN.stars} size={104} gap={16} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>King captured in</div>
          <div style={{ fontSize: 64, fontWeight: 900, color: GOLD, lineHeight: 1, textShadow: '0 4px 0 rgba(0,0,0,0.5)' }}>{RUN.moves} moves <span style={{ fontSize: 34, color: 'rgba(255,255,255,0.6)', textShadow: 'none' }}>par {RUN.par}</span></div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Option 2 — The kit.
// ---------------------------------------------------------------------------

function KitFanCard() {
  return (
    <div style={{ width: 1080, height: 1350, background: `radial-gradient(ellipse at 50% 35%, #5a3d0d 0%, ${NAVY_MID} 45%, ${NAVY} 100%)`, color: '#fff', padding: 56, boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.3em' }}>The kit that did it</div>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.05, marginTop: 8 }}>{RUN.name}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 6 }}>{RUN.difficulty} &middot; {RUN.date}</div>
      </div>

      <div style={{ position: 'relative', height: 640, marginTop: 30 }}>
        {RUN.kit.map((id, i) => {
          const rot = [-14, 0, 14][i];
          const x = [-250, 0, 250][i];
          const y = [50, 0, 50][i];
          return (
            <div key={id} style={{ position: 'absolute', left: '50%', top: 30, transform: `translateX(calc(-50% + ${x}px)) translateY(${y}px) rotate(${rot}deg)`, zIndex: i === 1 ? 3 : 1 }}>
              <KitCard id={id} width={400} />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36, marginTop: 20 }}>
        <Stars stars={RUN.stars} size={96} gap={10} />
        <div style={{ fontSize: 44, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{RUN.moves} moves <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>&middot; par {RUN.par}</span></div>
      </div>

      <div style={{ position: 'absolute', left: 56, bottom: 56 }}>
        <Brand size={84} />
      </div>
      <div style={{ position: 'absolute', right: 56, bottom: 56 }}>
        <MiniBoard pos={FINAL} size={208} lit radius={12} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Option 3 — The stat card (StampCard look).
// ---------------------------------------------------------------------------

function StatCard() {
  return (
    <div style={{ width: 1080, height: 1350, background: NAVY, color: '#fff', padding: 60, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, borderRadius: 60, padding: '56px 60px', textAlign: 'center', background: `linear-gradient(180deg, ${NAVY_LIGHT} 0%, ${NAVY} 100%)`, border: '8px solid #3a4f8f', boxShadow: 'inset 0 5px 0 rgba(255,255,255,0.18), inset 0 -12px 0 rgba(0,0,0,0.4), 0 40px 90px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.55)' }}>{RUN.name} &middot; {RUN.difficulty} &middot; {RUN.date}</div>

          <div style={{ position: 'relative', height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
            <div style={{ fontSize: 330, fontWeight: 900, lineHeight: 1, color: GOLD, textShadow: '0 8px 0 rgba(0,0,0,0.5)', fontVariantNumeric: 'tabular-nums' }}>{RUN.level}</div>
            <div style={{ position: 'absolute', bottom: 20 }}>
              <InkStamp text="Captured" size={84} rotate={-10} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 6 }}>
            {Array.from({ length: RUN.totalLevels }).map((_, i) => (
              <span key={i} style={{ width: 40, height: 40, borderRadius: '50%', background: i < RUN.level ? GOLD : 'rgba(255,255,255,0.14)', boxShadow: i < RUN.level ? '0 0 16px rgba(255,200,0,0.6)' : undefined }} />
            ))}
          </div>

          <div style={{ marginTop: 34 }}>
            <Stars stars={RUN.stars} size={104} gap={20} />
            <div style={{ marginTop: 10, fontSize: 28, fontWeight: 800, color: 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums' }}>No retries &middot; {RUN.moves} moves, par {RUN.par}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 30 }}>
            <Chip gold>{RUN.points.toLocaleString()} pts</Chip>
            <Chip>{RUN.time}</Chip>
            <Chip>{RUN.difficulty}</Chip>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 34 }}>
            {RUN.kit.map((id) => (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: '10px 18px 10px 10px' }}>
                <Art id={id} size={64} radius={12} />
                <span style={{ fontSize: 26, fontWeight: 900 }}>{ABILITY_DEFS[id].name}</span>
              </div>
            ))}
          </div>

          {/* Levels-reached strip: moves per level. */}
          <div style={{ marginTop: 34 }}>
            <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>Moves per level</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {RUN.levelMoves.map((m, i) => (
                <div key={i} style={{ flex: 1, borderRadius: 12, padding: '10px 0', background: i === RUN.level - 1 ? REVENGE_RED : 'rgba(255,200,0,0.16)', border: `3px solid ${i === RUN.level - 1 ? REVENGE_RED_DARK : 'rgba(255,200,0,0.35)'}`, lineHeight: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>L{i + 1}</div>
                  <div style={{ fontSize: 34, fontWeight: 900, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>{m}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
          <Brand size={76} />
          <div style={{ fontSize: 30, fontWeight: 900, color: GOLD, textAlign: 'right' }}>Beat {RUN.moves} moves?<br /><span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 26 }}>Same run. Today only.</span></div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Option 4 — The taunt (poster).
// ---------------------------------------------------------------------------

function TauntCard() {
  const [line1, line2] = REVENGE_TAGLINE.split('. ');
  return (
    <div style={{ width: 1080, height: 1350, background: '#f4efe4', color: '#1a1a1a', padding: 80, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Faint reticle wash behind everything. */}
      <div style={{ position: 'absolute', right: -220, top: -180, opacity: 0.07 }}>
        <RevengeReticleSvg size={820} ringColor="#000" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ fontSize: 26, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: REVENGE_RED }}>{RUN.name} &middot; {RUN.difficulty}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#777', letterSpacing: '0.1em' }}>{RUN.date}</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <div style={{ fontSize: 118, fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.03em' }}>{line1}.</div>
        <div style={{ fontSize: 118, fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.03em', color: REVENGE_RED, marginTop: 14 }}>{line2}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginTop: 70 }}>
          <div style={{ position: 'relative', width: 200, height: 200 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `10px solid ${REVENGE_RED}`, boxShadow: `inset 0 0 0 8px #f4efe4, inset 0 0 0 12px ${REVENGE_RED}` }} />
            <div style={{ position: 'absolute', inset: 34 }}><Piece code="bK" /></div>
            <div style={{ position: 'absolute', left: -6, right: -6, top: '50%', height: 12, background: REVENGE_RED, transform: 'rotate(-30deg)', borderRadius: 6 }} />
          </div>
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontSize: 30, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#777' }}>King captured</div>
            <div style={{ fontSize: 56, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>Level {RUN.level} &middot; {RUN.moves} moves</div>
            <div style={{ marginTop: 12, display: 'flex' }}><Stars stars={RUN.stars} size={64} gap={6} hollow="#bbb" /></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative' }}>
        <Brand size={84} dark={false} />
        <div style={{ display: 'flex', gap: 14 }}>
          {RUN.kit.map((id) => <Art key={id} id={id} size={92} radius={20} style={{ border: '4px solid #1a1a1a' }} />)}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Option 5 — The replay strip (comic).
// ---------------------------------------------------------------------------

function ReplayStripCard() {
  return (
    <div style={{ width: 1080, height: 1350, background: GOLD, color: '#1a1a1a', padding: 50, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ background: '#1a1a1a', color: GOLD, padding: '12px 26px', fontSize: 40, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', transform: 'rotate(-2deg)', boxShadow: `8px 8px 0 ${REVENGE_RED}` }}>How it ended</div>
        <div style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>{RUN.name} &middot; {RUN.difficulty}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, marginTop: 30 }}>
        {REPLAY.map((frame, i) => {
          const last = i === REPLAY.length - 1;
          return (
            <div key={i} style={{ background: '#fff', border: '8px solid #1a1a1a', padding: 14, boxShadow: last ? `12px 12px 0 ${REVENGE_RED}` : '12px 12px 0 #1a1a1a', position: 'relative' }}>
              <MiniBoard pos={frame.pos} size={372} lit={last} radius={0} />
              <div style={{ position: 'absolute', top: -22, left: -22, width: 60, height: 60, borderRadius: '50%', background: last ? REVENGE_RED : '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, border: '5px solid #fff' }}>{i + 1}</div>
              <div style={{ marginTop: 12, fontSize: last ? 40 : 28, fontWeight: 900, textTransform: last ? 'uppercase' : 'none', color: last ? REVENGE_RED : '#1a1a1a', letterSpacing: last ? '0.06em' : 0, lineHeight: 1 }}>{frame.caption}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ background: '#1a1a1a', borderRadius: 999, padding: '10px 24px 10px 12px' }}>
          <Brand size={60} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Stars stars={RUN.stars} size={66} gap={2} hollow="#1a1a1a" fill="#fff" stroke="#1a1a1a" />
          <div style={{ display: 'flex', gap: 8 }}>
            {RUN.kit.map((id) => <Art key={id} id={id} size={70} radius={14} style={{ border: '5px solid #1a1a1a' }} />)}
          </div>
        </div>
        <div style={{ textAlign: 'right', lineHeight: 1 }}>
          <div style={{ fontSize: 40, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{RUN.moves} moves</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#5a4300', marginTop: 4 }}>par {RUN.par} &middot; {RUN.time}</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page.
// ---------------------------------------------------------------------------

const OPTIONS: { name: string; pitch: string; render: () => ReactNode }[] = [
  { name: '1. Final position', pitch: 'The last board, big. Rookie lit red on the king’s square, RUN COMPLETE stamp, stars. The proof shot.', render: () => <FinalPositionCard /> },
  { name: '2. The kit', pitch: 'The three ability cards fanned like a hand of cards. What you built, not just what you did. Board tucked in the corner.', render: () => <KitFanCard /> },
  { name: '3. The stat card', pitch: 'The Stamp popup as a card: level 10, CAPTURED, pips, stars, chips, kit icons and a moves-per-level strip. For people who like numbers.', render: () => <StatCard /> },
  { name: '4. The taunt', pitch: 'Poster. The tagline as the hero, a struck-through king, stars and the kit as tiny icons. Minimal, brand-first, works even if you know nothing about the game.', render: () => <TauntCard /> },
  { name: '5. The replay strip', pitch: 'Comic strip of the last four positions of level 10, ending in the capture. Tells the story instead of showing the score.', render: () => <ReplayStripCard /> },
];

const SCALE = 1 / 3;

export default function ShareOptionsPage() {
  return (
    <div className="h-full overflow-auto" style={{ background: '#e7ecf7', fontFamily: 'var(--font-dm-sans, "DM Sans", system-ui, sans-serif)' }}>
      <div className="mx-auto max-w-[1240px] px-4 py-8">
        <h1 className="text-2xl font-black" style={{ color: NAVY }}>Post-run share cards: 5 options</h1>
        <p className="mt-2 text-sm max-w-2xl" style={{ color: '#3a4a7a' }}>
          What a player shares after finishing a run. Each card is designed at 1080x1350 (Instagram portrait, fits a story) and shown here at one third size. Same fake run on all five: <b>{RUN.name}</b>, {RUN.difficulty}, {RUN.stars} stars, {RUN.moves} moves vs par {RUN.par}, {RUN.retries} retries, {RUN.time}, kit = {RUN.kit.map((id) => ABILITY_DEFS[id].name).join(' / ')}. Static mockups, nothing wired up.
        </p>

        <div className="mt-8 flex flex-wrap gap-8 justify-center md:justify-start">
          {OPTIONS.map((o) => (
            <div key={o.name} style={{ width: 360 }}>
              <div style={{ width: 360, height: 450, borderRadius: 14, overflow: 'hidden', boxShadow: '0 14px 36px rgba(15,28,63,0.25)', position: 'relative' }}>
                <div style={{ width: 1080, height: 1350, transform: `scale(${SCALE})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
                  {o.render()}
                </div>
              </div>
              <div className="mt-3 font-black" style={{ color: NAVY }}>{o.name}</div>
              <div className="text-xs mt-1 leading-snug" style={{ color: '#3a4a7a' }}>{o.pitch}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
