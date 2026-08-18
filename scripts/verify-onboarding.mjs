// Headless verification of the first-run StoryOnboarding (components/run/StoryOnboarding.tsx).
// Walks all five beats at phone + desktop sizes, screenshots each, performs the
// beat-3 capture, beat-4 pick, beat-5 Surge cast + two moves, and asserts: no horizontal scroll, Skip visible, localStorage flag set,
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
  // Beat 1 — the loss.
  await page.waitForSelector('text=White lost.', { timeout: 20000 });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${OUT}/${tag}-beat1.png` });
  await noScroll('beat1');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${tag}-beat1b.png` });
  check(await page.getByRole('button', { name: /skip/i }).isVisible(), `${tag} skip visible`);
  await page.getByRole('button', { name: /^next/i }).click();
  // Beat 2 — the target (king glows).
  await page.waitForSelector('text=Nobody told him');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${tag}-beat2.png` });
  await noScroll('beat2');
  check(await page.getByText('Capture the king.').isVisible(), `${tag} beat2 chip`);
  await page.getByRole('button', { name: /^next/i }).click();
  // Beat 3 — capture = tempo.
  await page.waitForSelector('text=Rooks go straight');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${tag}-beat3.png` });
  await noScroll('beat3');
  await page.click('[data-square="a1"]');
  await page.waitForTimeout(200);
  await page.click('[data-square="a4"]');
  await page.waitForSelector('text=remember me', { timeout: 5000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${tag}-beat3-captured.png` });
  await noScroll('beat3-captured');
  check(await page.getByText('12', { exact: true }).first().isVisible(), `${tag} tempo bar reads full`);
  check(await page.getByRole('button', { name: /skip/i }).isVisible(), `${tag} skip visible (beat3)`);
  await page.getByRole('button', { name: /^next/i }).click();
  // Beat 4 — first ability (real offer modal, 3 starters).
  await page.waitForSelector('text=Take something', { timeout: 5000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${tag}-beat4-offer.png` });
  await noScroll('beat4-offer');
  const cards = page.getByRole('button', { name: /^(Surge|Freeze Ray|Drones)/i });
  check((await cards.count()) === 3, `${tag} 3 starter cards offered`);
  // Pick a non-Surge card on mobile (exercises the "borrow Surge" path), Surge on desktop.
  await (tag === 'mobile'
    ? page.getByRole('button', { name: /^Freeze Ray/i }).click()
    : page.getByRole('button', { name: /^Surge/i }).click());
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${tag}-beat4-picked.png` });
  await noScroll('beat4-picked');
  check(await page.getByRole('button', { name: /skip/i }).isVisible(), `${tag} skip visible (beat4)`);
  await page.getByRole('button', { name: /^next/i }).click();
  // Beat 5 — cast Surge, move twice, take the king.
  await page.waitForSelector('text=Tap Surge', { timeout: 5000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${tag}-beat5.png` });
  await noScroll('beat5');
  await page.locator('[data-testid="onboarding-rack"] button').first().click();
  await page.waitForSelector('text=Two moves.', { timeout: 5000 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${tag}-beat5-surged.png` });
  await page.click('[data-square="a1"]');
  await page.waitForTimeout(200);
  await page.click('[data-square="a4"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${tag}-beat5-move1.png` });
  await page.click('[data-square="a4"]');
  await page.waitForTimeout(200);
  await page.click('[data-square="e4"]');
  await page.waitForSelector('text=yours forever', { timeout: 5000 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${tag}-beat5-won.png` });
  await noScroll('beat5-won');
  check(await page.getByRole('button', { name: /skip/i }).isVisible(), `${tag} skip visible (beat5)`);
  await page.getByRole('button', { name: /^begin/i }).click();
  await page.waitForSelector('text=Play Today', { timeout: 10000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${tag}-landing.png` });
  const flag = await page.evaluate(() => localStorage.getItem('rookies-run-onboarded'));
  check(flag === '1', `${tag} localStorage flag set`);
  await noScroll('landing');
  await browser.close();
}

await run(390, 780, 'mobile');
await run(1280, 800, 'desktop');
if (fails.length) {
  console.error('\nFAILURES:', fails);
  process.exit(1);
}
console.log('\nALL OK');
