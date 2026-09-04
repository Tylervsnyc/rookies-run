import type { CSSProperties } from 'react';
import { REVENGE_RED, REVENGE_RED_DARK } from '@/lib/brand';
import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';
import { ABILITY_DEFS, type AbilityId } from '@/lib/run/abilities';
import { artFile } from '@/lib/run/ability-art';
import { SHARE_URL_LABEL, formatShareDate, type ShareCardData, type SharePiece } from '@/lib/run/share';
import { pieceDataUri } from '@/lib/run/share-pieces';

/**
 * The post-run share card — "option 2" from /test/share-options (Tyler,
 * 2026-09-03): the final board big, "Rookie's Abilities" under it, and a
 * challenge CTA bar ("Beat my 32 moves · Play free · run.chesspath.app").
 *
 * ONE renderer, two homes:
 *  - `/api/og/run` rasterises it with next/og (satori) into the PNG that
 *    goes through the share sheet;
 *  - RunSummaryModal renders it in the DOM as the preview.
 *
 * So it is written in satori's dialect: every box with more than one child is
 * `display: flex`, no CSS grid, no aspect-ratio, no filters, explicit
 * box-sizing, px letter-spacing. Images are <img> (webp on the client; the OG
 * route passes PNG data URIs in `art` because resvg can't decode webp).
 * The mockup's looping replay can't live in a still, so this is the final
 * position with Rookie lit on the king's square.
 */

export const SHARE_CARD_W = 1080;
export const SHARE_CARD_H = 1350;

const NAVY = '#0f1c3f';
const NAVY_MID = '#182a5c';
const GOLD = '#FFC800';
const LIGHT_SQ = '#edeed1';
const DARK_SQ = '#779952';
const ENEMY_FILL = '#000000';
/** Rainbow allies read as purple at a glance in the app; one flat tint here. */
const ALLY_FILL = '#8b5cf6';
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const STAR_PATH = 'M12 2.5l2.95 6.2 6.8.85-5 4.7 1.3 6.75L12 17.7 5.95 21l1.3-6.75-5-4.7 6.8-.85z';
const FONT = '"DM Sans", system-ui, -apple-system, sans-serif';

const flex: CSSProperties = { display: 'flex' };

export interface ShareCardProps {
  data: ShareCardData;
  /** Prefix for `/abilities/...` URLs (absolute origin server-side; '' in the browser). */
  assetBase?: string;
  /** Per-ability image src override (the OG route passes PNG data URIs). */
  art?: Partial<Record<AbilityId, string>>;
}

export function ShareCard({ data, assetBase = '', art }: ShareCardProps) {
  const { completed } = data;
  const kit = data.kit.filter((id) => id in ABILITY_DEFS).slice(0, 4);
  const kitCardW = 176;
  const caption = completed
    ? `Got him. ${data.moves} moves · par ${data.par}`
    : `Captured on level ${data.levelReached} of ${data.totalLevels} · ${data.moves} moves`;
  const ctaHead = completed ? `Beat my ${data.moves} moves.` : `Get past level ${data.levelReached}.`;
  const sub = [data.difficulty?.toUpperCase(), formatShareDate(data.iso)].filter(Boolean).join(' · ');

  return (
    <div
      style={{
        ...flex,
        flexDirection: 'column',
        width: SHARE_CARD_W,
        height: SHARE_CARD_H,
        boxSizing: 'border-box',
        padding: 48,
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        fontFamily: FONT,
        background: `radial-gradient(ellipse at 50% 30%, #5a3d0d 0%, ${NAVY_MID} 45%, ${NAVY} 100%)`,
      }}
    >
      {/* Header: run name + difficulty/date on the left, stars (+ streak) on the right. */}
      <div style={{ ...flex, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ ...flex, flexDirection: 'column' }}>
          <div style={{ ...flex, fontSize: 64, fontWeight: 900, lineHeight: 1.05 }}>{data.runName}</div>
          <div style={{ ...flex, fontSize: 26, fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 5, marginTop: 6 }}>{sub}</div>
        </div>
        <div style={{ ...flex, flexDirection: 'column', alignItems: 'flex-end' }}>
          {completed && <Stars stars={data.stars} />}
          {data.streak > 1 && (
            <div style={{ ...flex, marginTop: 8, borderRadius: 12, padding: '8px 16px', fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3, background: 'rgba(255,200,0,0.15)', color: GOLD }}>
              {`${data.streak} day streak`}
            </div>
          )}
        </div>
      </div>

      {/* Final board. */}
      <div style={{ ...flex, justifyContent: 'center', marginTop: 20 }}>
        <Board data={data} size={600} lit={completed} />
      </div>
      <div style={{ ...flex, justifyContent: 'center', marginTop: 10, fontSize: 28, fontWeight: 800, color: 'rgba(255,255,255,0.7)', height: 36 }}>{caption}</div>

      {/* Rookie's Abilities. */}
      {kit.length > 0 && (
        <div style={{ ...flex, flexDirection: 'column' }}>
          <div style={{ ...flex, justifyContent: 'center', marginTop: 10, fontSize: 24, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: 7 }}>Rookie&rsquo;s Abilities</div>
          <div style={{ ...flex, justifyContent: 'center', alignItems: 'flex-start', gap: 20, marginTop: 8 }}>
            {kit.map((id) => (
              <KitCard key={id} id={id} width={kitCardW} src={art?.[id] ?? `${assetBase}/abilities/${artFile(id)}`} />
            ))}
          </div>
        </div>
      )}

      {/* CTA — a challenge, not a logo. */}
      <div
        style={{
          ...flex,
          position: 'absolute',
          left: 48,
          right: 48,
          bottom: 36,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          padding: '18px 22px 18px 28px',
          borderRadius: 28,
          background: REVENGE_RED,
          boxShadow: `0 10px 0 ${REVENGE_RED_DARK}, 0 24px 40px rgba(0,0,0,0.45)`,
        }}
      >
        <div style={{ ...flex, flexDirection: 'column' }}>
          <div style={{ ...flex, fontSize: 40, fontWeight: 900, lineHeight: 1 }}>{ctaHead}</div>
          <div style={{ ...flex, fontSize: 24, fontWeight: 800, color: '#FFD6D6', marginTop: 8 }}>Same run, same abilities. Today only.</div>
        </div>
        <div style={{ ...flex, flexDirection: 'column', alignItems: 'center', flexShrink: 0, background: '#fff', color: REVENGE_RED, borderRadius: 18, padding: '18px 26px', boxShadow: '0 6px 0 rgba(0,0,0,0.25)', lineHeight: 1.1 }}>
          <div style={{ ...flex, fontSize: 28, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase' }}>Play free</div>
          <div style={{ ...flex, fontSize: 20, fontWeight: 800, color: '#8a1f1a' }}>{SHARE_URL_LABEL}</div>
        </div>
      </div>
    </div>
  );
}

function Stars({ stars }: { stars: 0 | 1 | 2 | 3 }) {
  return (
    <div style={{ ...flex, gap: 6 }}>
      {[0, 1, 2].map((i) => {
        const earned = i < stars;
        return (
          <svg key={i} width={72} height={72} viewBox="0 0 24 24">
            <path d={STAR_PATH} fill={earned ? GOLD : 'none'} stroke={earned ? '#c9960a' : 'rgba(255,255,255,0.35)'} strokeWidth={1.6} strokeLinejoin="round" />
          </svg>
        );
      })}
    </div>
  );
}

function Board({ data, size, lit }: { data: ShareCardData; size: number; lit: boolean }) {
  const sq = size / 8;
  const border = 10;
  const at = new Map<string, { piece: SharePiece; ally: boolean }>();
  for (const p of data.enemies) at.set(p.sq, { piece: p, ally: false });
  for (const p of data.allies) at.set(p.sq, { piece: p, ally: true });
  return (
    <div style={{ ...flex, flexDirection: 'column', width: size + border * 2, height: size + border * 2, boxSizing: 'border-box', border: `${border}px solid rgba(0,0,0,0.45)`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.45)' }}>
      {Array.from({ length: 8 }).map((_, r) => {
        const rank = 8 - r;
        return (
          <div key={rank} style={{ ...flex, width: size, height: sq }}>
            {FILES.map((file, f) => {
              const name = `${file}${rank}`;
              const dark = (f + rank) % 2 === 0;
              const isRookie = data.rookie === name;
              const occupant = at.get(name);
              return (
                <div key={name} style={{ ...flex, position: 'relative', width: sq, height: sq, background: dark ? DARK_SQ : LIGHT_SQ }}>
                  {isRookie && lit && (
                    <div style={{ ...flex, position: 'absolute', top: 0, left: 0, width: sq, height: sq, background: `radial-gradient(circle at 50% 50%, ${REVENGE_RED} 0%, ${REVENGE_RED_DARK} 70%)`, boxShadow: `0 0 ${sq * 0.6}px ${REVENGE_RED}` }} />
                  )}
                  {isRookie ? (
                    <RookieSprite square={sq} />
                  ) : occupant ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pieceDataUri(occupant.piece.type, occupant.ally ? ALLY_FILL : ENEMY_FILL)}
                      alt=""
                      width={sq * 0.88}
                      height={sq * 0.88}
                      style={{ position: 'absolute', top: sq * 0.06, left: sq * 0.06, width: sq * 0.88, height: sq * 0.88 }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/** Rookie's 22-block rainbow rook, drawn with plain divs so it survives satori. */
function RookieSprite({ square }: { square: number }) {
  const cols = 5;
  const rows = 6;
  const gapRatio = 3 / 22;
  const h = square * 0.78;
  const block = h / (rows + (rows - 1) * gapRatio);
  const gap = block * gapRatio;
  const w = cols * block + (cols - 1) * gap;
  const x0 = (square - w) / 2;
  const y0 = (square - h) / 2;
  return (
    <div style={{ ...flex, position: 'absolute', top: 0, left: 0, width: square, height: square }}>
      {ROOK_BLOCKS.map((b) => (
        <div
          key={`${b.x}-${b.y}`}
          style={{
            position: 'absolute',
            left: x0 + b.x * (block + gap),
            top: y0 + b.y * (block + gap),
            width: block,
            height: block,
            borderRadius: block * 0.12,
            background: getMatteBackground(b.color),
          }}
        />
      ))}
    </div>
  );
}

/** Ability card, tier-4 gold styling lifted from AbilityCard.tsx, 5:7. */
function KitCard({ id, width, src }: { id: AbilityId; width: number; src: string }) {
  const def = ABILITY_DEFS[id];
  const height = Math.round((width * 7) / 5);
  const pad = Math.round(width * 0.03);
  const artSize = Math.round(width * 0.78);
  return (
    <div style={{ ...flex, width, height, boxSizing: 'border-box', borderRadius: width * 0.07, padding: pad, background: 'linear-gradient(135deg, #b8852b 0%, #6a4612 30%, #ffd87a 60%, #b8852b 100%)', boxShadow: '0 0 30px rgba(255,191,36,0.45), 0 24px 40px rgba(0,0,0,0.5)' }}>
      <div style={{ ...flex, flexDirection: 'column', width: width - pad * 2, height: height - pad * 2, borderRadius: width * 0.05, background: '#f6e7c5', overflow: 'hidden', color: '#3d2806' }}>
        <div style={{ ...flex, padding: `${width * 0.04}px ${width * 0.06}px`, fontSize: width * 0.085, fontWeight: 900, lineHeight: 1 }}>{def.name}</div>
        <div style={{ ...flex, alignSelf: 'center', width: artSize, height: artSize, boxSizing: 'border-box', borderRadius: width * 0.03, overflow: 'hidden', border: '3px solid rgba(106,70,18,0.6)', background: '#d49a2a' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={def.name} width={artSize - 6} height={artSize - 6} style={{ width: artSize - 6, height: artSize - 6, objectFit: 'cover' }} />
        </div>
        <div style={{ ...flex, padding: `${width * 0.04}px ${width * 0.06}px 0`, fontSize: width * 0.052, fontWeight: 800, color: 'rgba(61,40,6,0.75)', textTransform: 'uppercase', letterSpacing: 1 }}>{def.typeLine}</div>
        <div style={{ ...flex, padding: `${width * 0.03}px ${width * 0.06}px`, fontSize: width * 0.06, fontWeight: 600, lineHeight: 1.25 }}>{def.description}</div>
      </div>
    </div>
  );
}
