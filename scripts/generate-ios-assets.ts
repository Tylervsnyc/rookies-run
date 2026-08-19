/**
 * Generate the Rookie's Revenge iOS app icon, launch splash, web icons and OG.
 *
 *   npm run ios:assets
 *
 * Writes:
 *   ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png  (1024², white bg, no alpha)
 *   ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732*.png  (2732², x3, BG)
 *   app/icon.png, app/apple-icon.png, public/og/run.png
 *
 * The art is the locked Rookie's Revenge mark (2026-08-18): the straight
 * rainbow rook inside the red target reticle, rendered from
 * components/run/RookiesRevengeLogo.tsx — the single source of truth. Never
 * redraw the rook; if the mark changes, re-run this.
 *
 * NATIVE ASSETS take effect only in a NEW iOS build. A web deploy cannot change them.
 */

import sharp from 'sharp';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RevengeMarkSvg, REVENGE_TAGLINE } from '../components/run/RookiesRevengeLogo';

/**
 * Must match components/run/NativeSplash.tsx SPLASH_BG,
 * capacitor.config.ts plugins.SplashScreen.backgroundColor,
 * the LaunchScreen.storyboard background, and app/layout.tsx themeColor.
 */
const BG = '#eef6fc';

const ICON_DIR = join(process.cwd(), 'ios/App/App/Assets.xcassets/AppIcon.appiconset');
const APP_DIR = join(process.cwd(), 'app');
const OG_PATH = join(process.cwd(), 'public/og/run.png');
const REVENGE_DIR = join(process.cwd(), 'public/revenge');
const SPLASH_DIR = join(process.cwd(), 'ios/App/App/Assets.xcassets/Splash.imageset');
const SPLASH_FILES = ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png'];

const markSvg = renderToStaticMarkup(React.createElement(RevengeMarkSvg, { size: 200 }));
const markInner = markSvg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');

/** Square canvas with the mark centered at `frac` of the side, on `bg`. */
function framed(canvas: number, frac: number, bg: string): string {
  const scale = (canvas * frac) / 200;
  const off = (canvas - canvas * frac) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}" viewBox="0 0 ${canvas} ${canvas}">
  <rect width="${canvas}" height="${canvas}" fill="${bg}"/>
  <g transform="translate(${off} ${off}) scale(${scale})">${markInner}</g>
</svg>`;
}

async function render(canvas: number, frac: number, bg: string): Promise<Buffer> {
  // App Store Connect rejects icons with an alpha channel → flatten.
  return sharp(Buffer.from(framed(canvas, frac, bg)), { density: 300 }).resize(canvas, canvas).flatten({ background: bg }).png().toBuffer();
}

async function main() {
  mkdirSync(ICON_DIR, { recursive: true });
  mkdirSync(SPLASH_DIR, { recursive: true });
  mkdirSync(REVENGE_DIR, { recursive: true });

  // iOS icon: white square, mark at 84% (Apple masks the corners itself).
  const icon = await render(1024, 0.84, '#fff');
  writeFileSync(join(ICON_DIR, 'AppIcon-512@2x.png'), icon);
  writeFileSync(join(REVENGE_DIR, 'icon-1024.png'), icon);
  console.log(`icon    1024²  ${(icon.length / 1024).toFixed(0)}KB`);

  // Splash is scaleAspectFill — keep the mark well inside the safe area.
  const splash = await render(2732, 0.28, BG);
  for (const name of SPLASH_FILES) writeFileSync(join(SPLASH_DIR, name), splash);
  console.log(`splash  2732²  ${(splash.length / 1024).toFixed(0)}KB  ×${SPLASH_FILES.length}`);

  // Web icons (favicon + apple-touch).
  writeFileSync(join(APP_DIR, 'icon.png'), await render(512, 0.9, '#fff'));
  writeFileSync(join(APP_DIR, 'apple-icon.png'), await render(180, 0.84, '#fff'));
  writeFileSync(join(REVENGE_DIR, 'mark.svg'), markSvg);
  console.log('web     app/icon.png (512²)  app/apple-icon.png (180²)  public/revenge/mark.svg');

  // OG: mark left, "Rookie's" over red REVENGE pill right, tagline under.
  const font = readFileSync(join(process.cwd(), 'public/fonts/dm-sans.woff2')).toString('base64');
  const tile = (await render(630, 0.78, BG)).toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><style>@font-face{font-family:'DMS';src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900;}</style></defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <image href="data:image/png;base64,${tile}" x="20" y="0" width="630" height="630"/>
  <text x="620" y="270" font-family="DMS, 'DM Sans', sans-serif" font-weight="900" font-size="104" fill="#3c3c3c" letter-spacing="-4">Rookie’s</text>
  <rect x="620" y="310" width="540" height="140" rx="32" fill="#B71C1C"/>
  <rect x="620" y="300" width="540" height="140" rx="32" fill="#E53935"/>
  <text x="890" y="402" text-anchor="middle" font-family="DMS, 'DM Sans', sans-serif" font-weight="900" font-size="92" fill="#fff" letter-spacing="6">REVENGE</text>
  <text x="620" y="515" font-family="DMS, 'DM Sans', sans-serif" font-weight="600" font-size="22" textLength="540" lengthAdjust="spacingAndGlyphs" fill="#777">${REVENGE_TAGLINE}</text>
</svg>`;
  await sharp(Buffer.from(svg)).flatten({ background: BG }).png().toFile(OG_PATH);
  console.log('og      public/og/run.png (1200×630)');
  console.log(`\nBackground ${BG}. Rebuild the iOS app for native assets to take effect.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
