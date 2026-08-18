// Headless verification of the Rookie's Revenge prototype (/?run=revenge-proto).
// At 390px: the FREE level-1 offer appears before the first move (Rookie's copy,
// 3 cards, no skip), picking a card closes it, the king square is tagged, and a
// scripted L1 → L3 playthrough wins each level by capturing the king (the
// level-cleared modal appears; the next level opens with a fresh free offer).
//
// Usage: node scripts/verify-revenge.mjs [baseUrl] [outDir]
//   (dev server must already be running; playwright resolved from PLAYWRIGHT_DIR)
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const pwRoot = process.env.PLAYWRIGHT_DIR ?? '/Users/tyler.schwartz/chess-learning-tree';
const { chromium } = createRequire(`${pwRoot}/package.json`)('playwright');

const BASE = process.argv[2] ?? 'http://localhost:3011';
const OUT = process.argv[3] ?? '/tmp/revenge-shots';
mkdirSync(OUT, { recursive: true });

const fails = [];
const check = (ok, msg) => {
  if (!ok) fails.push(msg);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
};

const FILES = 'abcdefgh';
const sq = (f, r) => `${FILES[f - 1]}${r}`;

/** Read the board from the DOM: rookie square + enemy squares by piece. */
async function readBoard(page) {
  return page.evaluate(() => {
    const out = { rookie: null, pieces: [] };
    for (const el of document.querySelectorAll('[data-square]')) {
      const s = el.getAttribute('data-square');
      const piece = el.querySelector('[data-piece]');
      if (!piece) continue;
      const kind = piece.getAttribute('data-piece');
      if (kind === 'wR') out.rookie = s;
      else if (kind && kind.startsWith('b')) out.pieces.push({ sq: s, type: kind[1] });
    }
    return out;
  });
}

async function clickSquare(page, s) {
  await page.locator(`[data-square="${s}"]`).first().click({ force: true });
}

async function move(page, from, to) {
  await clickSquare(page, from);
  await page.waitForTimeout(150);
  await clickSquare(page, to);
  // Rookie slide + enemy turn animation.
  await page.waitForTimeout(1400);
}

/**
 * Greedy L1-L3 player: if the king is on Rookie's file/rank with a clear
 * line, take him. Else if a piece on Rookie's line is on the SAME file or
 * rank as the king (a key), take it. Else step onto the king's file (rank 1)
 * if that file is clear up to him, else the king's rank... Simple enough
 * for the still-king L1/L2 and the hallway L3.
 */
function planMove(board) {
  const rf = FILES.indexOf(board.rookie[0]) + 1;
  const rr = Number(board.rookie[1]);
  const king = board.pieces.find((p) => p.type === 'K');
  if (!king) return null;
  const kf = FILES.indexOf(king.sq[0]) + 1;
  const kr = Number(king.sq[1]);
  const occ = new Set(board.pieces.map((p) => p.sq));
  const clear = (f1, r1, f2, r2) => {
    const df = Math.sign(f2 - f1);
    const dr = Math.sign(r2 - r1);
    let f = f1 + df;
    let r = r1 + dr;
    while (f !== f2 || r !== r2) {
      if (occ.has(sq(f, r))) return false;
      f += df;
      r += dr;
    }
    return true;
  };
  // 1. take the king
  if ((rf === kf || rr === kr) && clear(rf, rr, kf, kr)) return king.sq;
  // 2. take a piece on our line that shares a line with the king (a key)
  for (const p of board.pieces) {
    const pf = FILES.indexOf(p.sq[0]) + 1;
    const pr = Number(p.sq[1]);
    if (!((pf === rf || pr === rr) && clear(rf, rr, pf, pr))) continue;
    if (pf === kf || pr === kr) return p.sq;
  }
  // 3. line up on the king's file from rank 1 (if the file below him is clear)
  if (rr === 1 && rf !== kf && !occ.has(sq(kf, 1))) {
    let ok = true;
    for (let f = Math.min(rf, kf) + 1; f < Math.max(rf, kf); f++) if (occ.has(sq(f, 1))) ok = false;
    if (ok) return sq(kf, 1);
  }
  // 4. otherwise, capture anything safe-ish on our line
  for (const p of board.pieces) {
    const pf = FILES.indexOf(p.sq[0]) + 1;
    const pr = Number(p.sq[1]);
    if ((pf === rf || pr === rr) && clear(rf, rr, pf, pr) && p.type === 'P') return p.sq;
  }
  return null;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page.on('console', (m) => {
    if (m.type() === 'error') console.log(`  [console.error] ${m.text().slice(0, 300)}`);
  });
  page.on('pageerror', (e) => console.log(`  [pageerror] ${String(e).slice(0, 300)}`));
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const iso = await page.evaluate(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  await page.evaluate((iso) => {
    localStorage.setItem('rookies-run-onboarded', '1');
    localStorage.setItem(`rookies-run-intro-seen:${iso}`, '1');
  }, iso);
  await page.goto(`${BASE}/?run=revenge-proto`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // 1. Free offer before the first move.
  const copy = page.getByText(/One rook can.t do this alone/);
  check(await copy.isVisible().catch(() => false), 'L1 free offer copy visible before first move');
  const cards = page.locator('.offer-card-enter button');
  const n = await cards.count();
  check(n === 3, `free offer shows 3 cards (got ${n})`);
  check(!(await page.getByText(/Skip \(/).isVisible().catch(() => false)), 'free offer has no skip link');
  const sw = await page.evaluate(() => document.scrollingElement.scrollWidth);
  check(sw <= 390, `no horizontal scroll (${sw})`);
  await page.screenshot({ path: `${OUT}/01-free-offer.png` });
  await cards.first().click();
  await page.waitForTimeout(600);
  check(!(await copy.isVisible().catch(() => false)), 'offer closes after pick');

  // 2. King glow / label.
  check(await page.getByText('Capture the king').first().isVisible(), '"Capture the king" tag on the king');
  await page.screenshot({ path: `${OUT}/02-board-l1.png` });

  // 3. Play L1 → L3.
  for (let level = 1; level <= 3; level++) {
    let won = false;
    for (let i = 0; i < 14 && !won; i++) {
      const board = await readBoard(page);
      if (!board.rookie) break;
      const target = planMove(board);
      if (!target) {
        console.log(`  L${level}: no plan from ${board.rookie}; pieces ${board.pieces.map((p) => p.type + p.sq).join(' ')}`);
        break;
      }
      await move(page, board.rookie, target);
      won = await page.getByText(/Level \d+ cleared|cleared/i).first().isVisible().catch(() => false);
      if (!won) {
        // Losing? the run summary shows "Replay" / "Play again".
        const lost = await page.getByRole('button', { name: /replay|again/i }).first().isVisible().catch(() => false);
        if (lost) break;
      }
    }
    await page.screenshot({ path: `${OUT}/03-l${level}-end.png` });
    check(won, `L${level} won by capturing the king`);
    if (!won) break;
    // Next level.
    const next = page.getByRole('button', { name: /next|continue|onward|level/i }).first();
    if (await next.isVisible().catch(() => false)) {
      await next.click();
      await page.waitForTimeout(800);
    }
    if (level < 3) {
      const again = await copy.isVisible().catch(() => false);
      check(again, `L${level + 1} opens with a fresh free offer`);
      if (again) {
        await page.screenshot({ path: `${OUT}/04-l${level + 1}-offer.png` });
        await cards.first().click();
        await page.waitForTimeout(600);
      }
    }
  }

  await browser.close();
  console.log(fails.length ? `\n${fails.length} FAILED` : '\nALL OK');
  process.exit(fails.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
