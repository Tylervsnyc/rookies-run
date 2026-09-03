// App Store screenshots for Rookie's Revenge — 6.7" iPhone (1290x2796).
//
// Captures against the LIVE site by default so the shots match what ships.
// Seeds localStorage (onboarding done, a rich profile with every power +
// a handful of trophies, music off) via addInitScript, then drives a real
// run with the same click-the-square approach as scripts/verify-revenge.mjs.
//
// Usage: node scripts/appstore-screenshots.mjs [baseUrl] [outDir]
//   baseUrl default https://run.chesspath.app
//   outDir  default data/appstore/screenshots  (files are overwritten)
//   playwright resolved from PLAYWRIGHT_DIR (default: ../chess-learning-tree)
//
// Outputs (in order): 1-board-the-hunt, 2-ability-offer, 3-power-arsenal,
// 4-daily-home, 5-trophy-room, 6-difficulty-ladder.
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pwRoot = process.env.PLAYWRIGHT_DIR ?? join(here, '..', '..', 'chess-learning-tree');
const { chromium, devices } = createRequire(`${pwRoot}/package.json`)('playwright');
const sharp = createRequire(join(here, '..', 'package.json'))('sharp');

const BASE = (process.argv[2] ?? 'https://run.chesspath.app').replace(/\/$/, '');
const OUT = process.argv[3] ?? join(here, '..', 'data', 'appstore', 'screenshots');
mkdirSync(OUT, { recursive: true });

const FILES = 'abcdefgh';
const sq = (f, r) => `${FILES[f - 1]}${r}`;

// Every player-facing power (live/approved in data/content/pipeline.json) —
// so the Codex reads as a full arsenal, like the previous set of shots.
const ALL_POWERS = [
  'bishop-step', 'knight-hop', 'queen-pulse', 'become-king', 'freeze-ray', 'poison-dart', 'rabies-dart',
  'convert', 'aegis', 'decoy', 'boulder', 'smoke', 'rewind', 'magnet', 'summon-knight', 'page', 'twin',
  'bishop-squire', 'swap', 'sacrifice', 'duchess', 'vanguard', 'dragon',
];
const EARNED = [
  'first-blood', 'regicide', 'closing-time', 'armed', 'foot-traffic', 'pawn-broker', 'horse-whisperer',
  'excommunicated', 'queen-slayer', 'serial-regicide', 'century', 'ten-runs', 'speedrun', 'photo-finish',
  'cold-shoulder', 'double-tap', 'streak-3',
];

function seededProfile() {
  const at = new Date(Date.now() - 3 * 864e5).toISOString();
  const achievements = {};
  for (const id of EARNED) achievements[id] = { unlockedAt: at, seen: true };
  return {
    v: 1,
    createdAt: new Date(Date.now() - 20 * 864e5).toISOString(),
    difficulty: 'normal',
    unlockedAbilities: ALL_POWERS,
    achievements,
    counters: { 'cap.total': 212, 'cap.king': 31, 'cap.pawn': 140, sessions: 14, 'runs.complete': 12 },
    bestByDifficulty: { rookie: { levels: 10, score: 4200 }, normal: { levels: 8, score: 3150 } },
    // First three rungs cleared so the Ladder shows progress + an open rung.
    ladder: {
      'revenge-5': { cleared: true, bestLevels: 10, score: 4020 },
      'revenge-6': { cleared: true, bestLevels: 10, score: 3880 },
      'revenge-4': { cleared: true, bestLevels: 10, score: 3710 },
    },
  };
}

async function readBoardOnce(page) {
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

/** Board state once it's stable (same two reads in a row, Rookie present). */
async function readBoard(page) {
  let prev = null;
  for (let i = 0; i < 20; i++) {
    const b = await readBoardOnce(page);
    const key = JSON.stringify(b);
    if (b.rookie && key === prev) return b;
    prev = key;
    await page.waitForTimeout(250);
  }
  return readBoardOnce(page);
}

async function clickSquare(page, s) {
  await page.locator(`[data-square="${s}"]`).first().click({ force: true });
}

async function move(page, from, to) {
  await clickSquare(page, from);
  await page.waitForTimeout(200);
  await clickSquare(page, to);
  await page.waitForTimeout(1500);
}

// Planner for revenge-1 L1/L2 (still kings, pawn shell + a bishop). Black
// attacks are modelled with normal chess rules (pawns hit diagonally DOWN);
// Rookie only ever lands on a square nothing can take her from.
const fi = (s) => FILES.indexOf(s[0]) + 1;
const ri = (s) => Number(s[1]);
const onBoard = (f, r) => f >= 1 && f <= 8 && r >= 1 && r <= 8;

function attackedSquares(pieces) {
  const occ = new Set(pieces.map((p) => p.sq));
  const out = new Set();
  const ray = (f, r, df, dr) => {
    let x = f + df;
    let y = r + dr;
    while (onBoard(x, y)) {
      out.add(sq(x, y));
      if (occ.has(sq(x, y))) break;
      x += df;
      y += dr;
    }
  };
  for (const p of pieces) {
    const f = fi(p.sq);
    const r = ri(p.sq);
    if (p.type === 'P') {
      for (const df of [-1, 1]) if (onBoard(f + df, r - 1)) out.add(sq(f + df, r - 1));
    } else if (p.type === 'N') {
      for (const [df, dr] of [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]]) {
        if (onBoard(f + df, r + dr)) out.add(sq(f + df, r + dr));
      }
    } else if (p.type === 'K') {
      for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) {
        if ((df || dr) && onBoard(f + df, r + dr)) out.add(sq(f + df, r + dr));
      }
    } else {
      if (p.type === 'B' || p.type === 'Q') for (const [df, dr] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) ray(f, r, df, dr);
      if (p.type === 'R' || p.type === 'Q') for (const [df, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) ray(f, r, df, dr);
    }
  }
  return out;
}

/** Rook moves from `from` given blockers: [{to, capture}] (capture = piece type or null). */
function rookMoves(from, pieces) {
  const bySq = new Map(pieces.map((p) => [p.sq, p.type]));
  const f0 = fi(from);
  const r0 = ri(from);
  const out = [];
  for (const [df, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    let f = f0 + df;
    let r = r0 + dr;
    while (onBoard(f, r)) {
      const s = sq(f, r);
      if (bySq.has(s)) { out.push({ to: s, capture: bySq.get(s) }); break; }
      out.push({ to: s, capture: null });
      f += df;
      r += dr;
    }
  }
  return out;
}

/**
 * Pick Rookie's move. `wantCapture` = prefer taking a piece (fills the tempo
 * bar) before going for the king. Returns { to, capture } or null.
 */
function planMove(board, wantCapture) {
  const king = board.pieces.find((p) => p.type === 'K');
  if (!king) return null;
  const moves = rookMoves(board.rookie, board.pieces);
  const kill = moves.find((m) => m.capture === 'K');
  if (kill && !wantCapture) return kill;
  const after = (m) => board.pieces.filter((p) => p.sq !== m.to);
  const safe = moves.filter((m) => !attackedSquares(after(m)).has(m.to));
  const winsNext = (m) => rookMoves(m.to, after(m)).some((n) => n.capture === 'K');
  const safeFrom = (from, pieces) => rookMoves(from, pieces).filter((n) => !attackedSquares(pieces.filter((p) => p.sq !== n.to)).has(n.to));
  if (wantCapture) {
    const cap = safe.filter((m) => m.capture && m.capture !== 'K');
    if (cap.length) return cap.find(winsNext) ?? cap[0];
    // Two-ply: a safe square from which a safe capture exists.
    const stage = safe.find((m) => !m.capture && safeFrom(m.to, board.pieces).some((n) => n.capture && n.capture !== 'K'));
    if (stage) return stage;
  }
  if (kill) return kill;
  const setup = safe.find(winsNext);
  if (setup) return setup;
  const cap = safe.find((m) => m.capture);
  if (cap) return cap;
  // Two-ply: a safe square from which a setup square is reachable.
  for (const m of safe) {
    const nextSafe = rookMoves(m.to, board.pieces).filter((n) => !attackedSquares(board.pieces).has(n.to));
    if (nextSafe.some((n) => rookMoves(n.to, board.pieces).some((k) => k.capture === 'K'))) return m;
  }
  return safe[0] ?? null;
}

async function settle(page, ms = 900) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(ms);
}

const DEBUG = process.env.DEBUG_SHOTS; // dir for intermediate frames
let dbgN = 0;
async function dbg(page, tag) {
  if (!DEBUG) return;
  mkdirSync(DEBUG, { recursive: true });
  await page.screenshot({ path: join(DEBUG, `${String(dbgN++).padStart(2, '0')}-${tag}.png`), scale: 'css' });
}

async function shot(page, name) {
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  const m = await sharp(path).metadata();
  const ok = m.width === 1290 && m.height === 2796;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}.png ${m.width}x${m.height}`);
  if (!ok) throw new Error(`${name}: wrong size ${m.width}x${m.height}`);
}

async function dismissOffer(page) {
  // Offer modal (free pick on L1, choice later): take the first card.
  const cards = page.locator('button.offer-card-enter');
  if ((await cards.count()) > 0) {
    await cards.first().click();
    await page.waitForTimeout(700);
    return true;
  }
  return false;
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    ...devices['iPhone 14 Pro Max'],
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    colorScheme: 'light',
    locale: 'en-US',
  });
  await ctx.addInitScript((profile) => {
    localStorage.setItem('rookies-run-onboarded', '1');
    localStorage.setItem('rookies-revenge-profile-v1', JSON.stringify(profile));
    localStorage.setItem('rookies-revenge-handle', 'Rookie');
    localStorage.setItem('rr_music_v1', JSON.stringify({ enabled: false, on: false, track: null }));
  }, seededProfile());
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`  [pageerror] ${String(e).slice(0, 200)}`));

  // ── Home (Revenge tab = daily card) ─────────────────────────────────────
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await settle(page, 1500);
  await shot(page, '4-daily-home');

  // ── Ladder tab ──────────────────────────────────────────────────────────
  await page.getByRole('tab', { name: /ladder/i }).click();
  await settle(page, 700);
  await shot(page, '6-difficulty-ladder');

  // ── Codex tab → Trophy Room (trophies, then abilities) ──────────────────
  await page.getByRole('tab', { name: /codex/i }).click();
  await settle(page, 600);
  await page.getByRole('button', { name: /open the codex/i }).click();
  await settle(page, 900);
  await shot(page, '5-trophy-room');
  await page.getByRole('button', { name: /^Abilities/ }).click();
  await settle(page, 700);
  await shot(page, '3-power-arsenal');

  // ── Gameplay: revenge-1, clear L1 for the offer, then L2 mid-hunt ───────
  await page.goto(`${BASE}/?run=revenge-1`, { waitUntil: 'domcontentloaded' });
  await settle(page, 1500);
  // The Arena home shows first (its demo board uses the same [data-square]
  // markup, so don't read the board yet): flip the daily card, then Begin.
  const go = page.getByRole('button', { name: 'Daily Revenge' });
  if (await go.isVisible().catch(() => false)) {
    await go.click();
    await page.waitForTimeout(600);
  }
  const begin = page.getByRole('button', { name: /begin today/i });
  if (await begin.isVisible().catch(() => false)) {
    await begin.click();
  }
  // Live board = the level-1 free offer is up, or the tab bar is gone.
  await page.locator('button.offer-card-enter').first().waitFor({ timeout: 15000 }).catch(() => {});
  await settle(page, 1200);
  await dismissOffer(page);
  await page.waitForTimeout(800);

  let offerShot = false;
  let boardShot = false;
  for (let level = 1; level <= 3 && !(offerShot && boardShot); level++) {
    let captures = 0;
    let won = false;
    for (let i = 0; i < 16 && !won; i++) {
      const board = await readBoard(page);
      if (!board.rookie) { console.log(`  L${level}: no rookie on board`); break; }
      if (level === 3) break; // L3 only exists here for its opening offer
      // On L2 (the bishop + pawn court) take a piece or two first so the
      // tempo bar is partly filled, then line up and take the king.
      const wantCapture = level === 2 && captures < 2;
      const plan = planMove(board, wantCapture);
      if (!plan) { console.log(`  L${level}: no plan from ${board.rookie}`); break; }
      if (!boardShot && level === 2 && captures >= 1 && plan.capture === 'K') {
        await clickSquare(page, board.rookie); // select: her moves light up
        await page.waitForTimeout(500);
        await shot(page, '1-board-the-hunt');
        boardShot = true;
        await clickSquare(page, board.rookie);
        await page.waitForTimeout(250);
      }
      await move(page, board.rookie, plan.to);
      // The first tap after a modal can be swallowed — verify she moved.
      const check = await readBoard(page);
      if (check.rookie === board.rookie && !(await page.getByText(/cleared/i).first().isVisible().catch(() => false))) {
        await move(page, board.rookie, plan.to);
      }
      await dbg(page, `L${level}-m${i}-${board.rookie}-${plan.to}`);
      if (plan.capture) captures++;
      won = await page.getByText(/cleared/i).first().isVisible().catch(() => false);
    }
    if (level === 3) break;
    if (!won) { console.log(`  L${level}: not won; stopping`); break; }
    const next = page.getByRole('button', { name: /next level|finish/i }).first();
    if (await next.isVisible().catch(() => false)) await next.click();
    await settle(page, 1000);
    await page.locator('button.offer-card-enter').first().waitFor({ timeout: 6000 }).catch(() => {});
    await settle(page, 800);
    await dbg(page, `L${level}-after-next`);
    const offerVisible = (await page.locator('button.offer-card-enter').count()) > 0;
    if (offerVisible && !offerShot) {
      await shot(page, '2-ability-offer');
      offerShot = true;
    }
    await dismissOffer(page);
    await page.waitForTimeout(800);
  }
  if (!boardShot) {
    // Fallback: whatever the board looks like right now.
    console.log('  board shot fallback: current board');
    await settle(page, 500);
    await shot(page, '1-board-the-hunt');
  }
  if (!offerShot) console.log('  WARNING: no ability offer captured');

  await browser.close();
  console.log(`\ndone → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
