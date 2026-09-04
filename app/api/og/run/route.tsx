import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SHARE_CARD_H, SHARE_CARD_W, ShareCard } from '@/components/run/ShareCard';
import { artFile } from '@/lib/run/ability-art';
import type { AbilityId } from '@/lib/run/abilities';
import { decodeShareCard } from '@/lib/run/share';

/**
 * The post-run share image — `components/run/ShareCard` rasterised to a
 * 1080x1350 PNG. Self-describing URL: every field comes from the query
 * string (`lib/run/share encodeShareCard`), e.g.
 *
 *   /api/og/run?v=1&run=Dead+Bolt&d=2026-09-03&diff=Hard&c=1&l=10&t=10
 *     &m=32&p=35&s=3&k=knight-hop,surge,freeze-ray&pos=@e8.pa7.pf6.nc6.bg5
 *
 * Node runtime (not edge): the card imports the ability catalogue, which
 * drags in the 6k-line run registry — too big for an edge function — and we
 * need sharp to turn the webp ability art into PNG, the only raster format
 * satori's resvg decodes.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ART_PX = 320;

/** A file under `public/`: same-origin fetch works in dev and on Vercel; fs is the local fallback. */
async function readPublic(rel: string, origin: string): Promise<Buffer | null> {
  try {
    const res = await fetch(`${origin}/${rel}`);
    if (res.ok) return Buffer.from(await res.arrayBuffer());
  } catch {
    /* fall through */
  }
  try {
    return await readFile(path.join(process.cwd(), 'public', ...rel.split('/')));
  } catch {
    return null;
  }
}

function readArt(id: AbilityId, origin: string): Promise<Buffer | null> {
  return readPublic(`abilities/${artFile(id)}`, origin);
}

/**
 * DM Sans 500/700/900 (public/fonts/dm-sans-*.woff — satori reads woff, not
 * the app's woff2). Loaded once per process; a missing file just means satori
 * falls back to its bundled sans.
 */
type Font = { name: string; data: ArrayBuffer; weight: 500 | 700 | 900; style: 'normal' };
let fontsPromise: Promise<Font[]> | null = null;
function loadFonts(origin: string): Promise<Font[]> {
  if (!fontsPromise) {
    fontsPromise = Promise.all(
      ([500, 700, 900] as const).map(async (weight) => {
        const buf = await readPublic(`fonts/dm-sans-${weight}.woff`, origin);
        if (!buf) return null;
        const data = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
        return { name: 'DM Sans', data, weight, style: 'normal' as const };
      }),
    ).then((fonts) => fonts.filter((f): f is Font => f !== null));
    fontsPromise.catch(() => {
      fontsPromise = null;
    });
  }
  return fontsPromise;
}

async function loadArt(kit: AbilityId[], origin: string): Promise<Partial<Record<AbilityId, string>>> {
  const entries = await Promise.all(
    kit.map(async (id) => {
      const webp = await readArt(id, origin);
      if (!webp) return [id, null] as const;
      try {
        const png = await sharp(webp).resize(ART_PX, ART_PX, { fit: 'cover' }).png().toBuffer();
        return [id, `data:image/png;base64,${png.toString('base64')}`] as const;
      } catch {
        return [id, null] as const;
      }
    }),
  );
  const art: Partial<Record<AbilityId, string>> = {};
  for (const [id, uri] of entries) if (uri) art[id] = uri;
  return art;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const data = decodeShareCard(url.searchParams);
  if (!data) return new Response('Bad share card', { status: 400 });

  // Drop any kit entry whose art we couldn't load rather than ship a broken box.
  const [art, fonts] = await Promise.all([loadArt(data.kit, url.origin), loadFonts(url.origin)]);
  const kit = data.kit.filter((id) => id in art);

  const response = new ImageResponse(<ShareCard data={{ ...data, kit }} art={art} />, {
    width: SHARE_CARD_W,
    height: SHARE_CARD_H,
    ...(fonts.length ? { fonts } : {}),
  });
  response.headers.set('Cache-Control', 'public, s-maxage=31536000, immutable');
  return response;
}
