// Headless verification of the first-run StoryOnboarding (components/run/StoryOnboarding.tsx).
// Walks all three beats at phone + desktop sizes, screenshots each, performs the
// beat-3 capture, and asserts: no horizontal scroll, Skip visible, localStorage flag set,
// and the normal RunLanding renders afterwards.
//
// Usage: node scripts/verify-onboarding.mjs [baseUrl] [outDir]
//   (dev server must already be running; `npx playwright install chromium` once)
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

// Playwright isn't a dep of this repo; resolve it from PLAYWRIGHT_DIR (or a sibling
// checkout) so we don't add a package just for a verification script.
const pwRoot = process.env.PLAYWRIGHT_DIR ?? '/Users/tyler.schwartz/chess-learning-tree';
const { chromium } = createRequire(`${pwRoot}/package.json`)('playwright');

const BASE = process.argv[2] ?? 'http://localhost:3000';
const OUT = process.argv[3] ?? '/tmp/onboarding-shots';
mkdirSync(OUT, { recursive: true });

const fails = [];
const check = (ok, msg) => {
  if (!ok) fails.push(msg);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
};

async function run(w, h, tag) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const noScroll = async (label) => {
    const sw = await page.evaluate(() => document.scrollingElement.scrollWidth);
    check(sw <= w, `${tag} ${label}: scrollWidth ${sw} <= ${w}`);
  };
  await page.goto(`${BASE}/?onboarding=1`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=White lost.', { timeout: 20000 });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${OUT}/${tag}-beat1.png` });
  await noScroll('beat1');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${tag}-beat1b.png` });
  check(await page.getByRole('button', { name: /skip/i }).isVisible(), `${tag} skip visible`);
  await page.getByRole("button", { name: /^next/i }).click();
  await page.waitForSelector('text=far side');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${tag}-beat2.png` });
  await noScroll('beat2');
  await page.getByRole("button", { name: /^next/i }).click();
  await page.waitForSelector('text=Rooks go straight');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${tag}-beat3.png` });
  await noScroll('beat3');
  // Capture: tap Rookie (a1) then the pawn on a4.
  await page.click('[data-square="a1"]');
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/${tag}-beat3-selected.png` });
  await page.click('[data-square="a4"]');
  await page.waitForSelector('text=remember me', { timeout: 5000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${tag}-beat3-captured.png` });
  await noScroll('beat3-captured');
  await page.getByRole('button', { name: /start the run/i }).click();
  await page.waitForSelector('text=Play Today', { timeout: 10000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${tag}-landing.png` });
  const flag = await page.evaluate(() => localStorage.getItem('rookies-run-onboarded'));
  check(flag === '1', `${tag} localStorage flag set`);
  await noScroll('landing');
  await browser.close();
}

await run(360, 740, 'mobile');
await run(1280, 800, 'desktop');
if (fails.length) {
  console.error('\nFAILURES:', fails);
  process.exit(1);
}
console.log('\nALL OK');
