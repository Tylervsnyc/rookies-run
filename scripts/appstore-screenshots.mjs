// App Store screenshots for Rookie's Revenge — 6.7" iPhone (1290x2796).
//
// Captures against the LIVE site by default so the shots match what ships.
// Seeds localStorage (onboarding done, a profile with every player-facing
// power + a handful of real trophies + the first four ladder rungs cleared,
// music off, handle "Rookie") via addInitScript, then drives the real UI.
//
// Everything seeded is DERIVED from the repo, not hand-kept, so it can't go
// stale: powers = approved|live abilities in data/content/pipeline.json, rungs
// = LADDER_RUNG_IDS / LADDER_BONUS_RUNG_IDS parsed out of lib/run/ladder.ts,
// trophies = EARNED filtered to ids that exist in lib/run/achievements.ts
// (profile.ts sanitize drops unknown ids anyway — we fail loudly instead).
//
// Nothing here is fabricated: the Ranks line on the home screen comes from the
// live leaderboard. Shot 2 is a real Endless level-1 slate (3 cards, Take +
// Preview) with one card flipped to its live Preview demo. No debug/test route
// is ever visited, and no run is ever finished (so no score is submitted).
//
// Usage: node scripts/appstore-screenshots.mjs [baseUrl] [outDir]
//   baseUrl default https://run.chesspath.app
//   outDir  default data/appstore/screenshots  (files are overwritten)
//   playwright resolved from PLAYWRIGHT_DIR (default: ../chess-learning-tree)
//   DEBUG_SHOTS=<dir> also writes intermediate frames there.
//
// Outputs: 1-board-the-hunt, 2-ability-offer, 3-power-arsenal,
// 4-daily-home, 5-trophy-room, 6-difficulty-ladder.
import { mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const pwRoot = process.env.PLAYWRIGHT_DIR ?? join(root, '..', 'chess-learning-tree');
const { chromium, devices } = createRequire(`${pwRoot}/package.json`)('playwright');
const sharp = createRequire(join(root, 'package.json'))('sharp');

const BASE = (process.argv[2] ?? 'https://run.chesspath.app').replace(/\/$/, '');
const OUT = process.argv[3] ?? join(root, 'data', 'appstore', 'screenshots');
mkdirSync(OUT, { recursive: true });

const FILES = 'abcdefgh';
const sq = (f, r) => `${FILES[f - 1]}${r}`;

// ── Seed data, derived from the repo ─────────────────────────────────────────
const pipeline = JSON.parse(readFileSync(join(root, 'data', 'content', 'pipeline.json'), 'utf8'));
const pipelineItems = Array.isArray(pipeline.items)
  ? pipeline.items
  : Object.entries(pipeline.items).map(([id, v]) => ({ id, ...v }));
/** Every player-facing power (approved|live) — the Codex reads as a full arsenal. */
const ALL_POWERS = pipelineItems
  .filter((x) => x.kind === 'ability' && (x.stage === 'approved' || x.stage === 'live'))
  .map((x) => x.id);

const ladderSrc = readFileSync(join(root, 'lib', 'run', 'ladder.ts'), 'utf8');
const rungBlock = ladderSrc.slice(ladderSrc.indexOf('LADDER_RUNG_IDS'), ladderSrc.indexOf('];', ladderSrc.indexOf('LADDER_RUNG_IDS')));
const LADDER = [...rungBlock.matchAll(/'(revenge-\d+)',/g)].map((m) => m[1]);
const bonusLine = ladderSrc.match(/LADDER_BONUS_RUNG_IDS[^=]*=\s*\[([^\]]*)\]/);
const BONUS = bonusLine ? [...bonusLine[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : [];
if (LADDER.length !== 10) throw new Error(`expected 10 ladder rungs in lib/run/ladder.ts, parsed ${LADDER.length}`);

const achSrc = readFileSync(join(root, 'lib', 'run', 'achievements.ts'), 'utf8');
const ACH_IDS = new Set([...achSrc.matchAll(/^\s{4}id: '([a-z0-9-]+)',/gm)].map((m) => m[1]));
const EARNED_WANTED = [
  'first-blood', 'regicide', 'closing-time', 'armed', 'foot-traffic', 'pawn-broker', 'horse-whisperer',
  'excommunicated', 'queen-slayer', 'serial-regicide', 'century', 'ten-runs', 'speedrun', 'photo-finish',
  'cold-shoulder', 'bishop-please', 'horse-play', 'sore-winner', 'streak-3',
];
const EARNED = EARNED_WANTED.filter((id) => ACH_IDS.has(id));
const droppedTrophies = EARNED_WANTED.filter((id) => !ACH_IDS.has(id));
if (droppedTrophies.length) console.log(`  note: trophy ids no longer in achievements.ts, skipped: ${droppedTrophies.join(', ')}`);

/** First CLEARED rungs of the ladder (rung 5 is then the open "next"). */
const CLEARED_RUNGS = 4;

function seededProfile() {
  const at = new Date(Date.now() - 3 * 864e5).toISOString();
  const achievements = {};
  for (const id of EARNED) achievements[id] = { unlockedAt: at, seen: true };
  const ladder = {};
  const bestStars = { normal: {} };
  LADDER.slice(0, CLEARED_RUNGS).forEach((id, i) => {
    const attempt = { cleared: true, bestLevels: 10, score: 4100 - i * 170 };
    ladder[id] = { ...attempt, byDifficulty: { normal: attempt } };
    bestStars.normal[id] = i === 1 ? 2 : 3;
  });
  return {
    v: 1,
    createdAt: new Date(Date.now() - 20 * 864e5).toISOString(),
    difficulty: 'normal',
    unlockedAbilities: ALL_POWERS,
    achievements,
    // Keys as TrophyRoom's stat row reads them (lib/run/achievements.ts cnt()).
    counters: { 'cap.total': 212, 'cap.king': 31, 'cap.pawn': 140, sessions: 14, 'runs.completed': 12, 'ability.used': 96 },
    bestByDifficulty: { rookie: { levels: 10, score: 4200 }, normal: { levels: 10, score: 4100 } },
    bestStars,
    ladder,
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

/**
 * Terrain (lava, stone) blocks Rookie's lines but has no DOM marker, so it is
 * read off the pixels: sample each empty square near its corner and flag
 * anything that is neither the light nor the dark board colour. Refreshed by
 * readTerrain() before planning; used by rookMoves + attackedSquares.
 */
let WALLS = new Set();
async function readTerrain(page) {
  const boxes = await page.evaluate(() => [...document.querySelectorAll('[data-square]')].map((el) => {
    const r = el.getBoundingClientRect();
    return { sq: el.getAttribute('data-square'), x: r.x, y: r.y, w: r.width, h: r.height, piece: !!el.querySelector('[data-piece]') };
  }));
  const buf = await page.screenshot({ scale: 'css' });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => {
    const i = (Math.round(y) * info.width + Math.round(x)) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const walls = new Set();
  for (const b of boxes) {
    if (b.piece || !b.sq) continue;
    const [r, g, bl] = px(b.x + b.w * 0.2, b.y + b.h * 0.2);
    const light = r > 215 && g > 215 && bl > 180 && bl < 235; // cream
    const dark = g > r + 15 && g > bl + 25; // green
    const tint = r > 200 && g > 190 && bl < 170; // move/last-move highlight
    if (!light && !dark && !tint) walls.add(b.sq);
  }
  WALLS = walls;
  return walls;
}

function attackedSquares(pieces) {
  const occ = new Set(pieces.map((p) => p.sq));
  const out = new Set();
  const ray = (f, r, df, dr) => {
    let x = f + df;
    let y = r + dr;
    while (onBoard(x, y) && !WALLS.has(sq(x, y))) {
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
    while (onBoard(f, r) && !WALLS.has(sq(f, r))) {
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
  const [W, H] = process.env.IPAD === '1' ? [2048, 2732] : [1290, 2796];
  const ok = m.width === W && m.height === H;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}.png ${m.width}x${m.height}`);
  if (!ok) throw new Error(`${name}: wrong size ${m.width}x${m.height}`);
}

/** Endless seed for the offer shot: its 5-card kit (Aegis, Bishop Step,
 *  Dragon, Decoy, Poison Dart...) varies by seed; the L1 slate is 3 of the kit. */
const ENDLESS_SEED = Number(process.env.ENDLESS_SEED ?? 21);
/** Cards whose Preview demo reads well in the small card (the CAPTURE THE
 *  KING tag stays inside the frame). The L1 slate is random per load, so we
 *  reload until one of these is on it, then flip the best-ranked one. */
const PREVIEW_PREFERENCE = ['DRAGON', 'KNIGHT HOP'];
const OFFER_TRIES = 8;

async function waitGone(page, locator, ms = 8000) {
  await locator.first().waitFor({ state: 'detached', timeout: ms }).catch(() => {});
}

async function main() {
  const browser = await chromium.launch();
  // IPAD=1 -> 12.9" iPad Pro portrait (1024x1366 @2x = 2048x2732), the one
  // iPad set App Review requires because the app ships for iPad too.
  const ipad = process.env.IPAD === '1';
  const ctx = await browser.newContext({
    ...(ipad ? devices['iPad Pro 11'] : devices['iPhone 14 Pro Max']),
    viewport: ipad ? { width: 1024, height: 1366 } : { width: 430, height: 932 },
    deviceScaleFactor: ipad ? 2 : 3,
    isMobile: true,
    hasTouch: true,
    colorScheme: 'light',
    locale: 'en-US',
    reducedMotion: 'no-preference',
  });
  await ctx.addInitScript((profile) => {
    // Only seed once per tab so the app's own writes during a run survive reloads.
    if (sessionStorage.getItem('as-seeded')) return;
    sessionStorage.setItem('as-seeded', '1');
    localStorage.setItem('rookies-run-onboarded', '1');
    localStorage.setItem('rookies-revenge-profile-v1', JSON.stringify(profile));
    localStorage.setItem('rookies-revenge-handle', 'Rookie');
    // lib/music.ts: track null = music off.
    localStorage.setItem('rr_music_v1', JSON.stringify({ track: null, volume: 0 }));
  }, seededProfile());
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log(`  [pageerror] ${String(e).slice(0, 200)}`));

  // ── 4. Home — the Daily Revenge screen (BEGIN + today's 3-card kit) ─────
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('tab', { name: 'Revenge' }).waitFor({ timeout: 20000 });
  await settle(page, 1500);
  await dbg(page, 'home');
  await page.getByRole('button', { name: 'Daily Revenge' }).click();
  await page.getByRole('button', { name: /begin today/i }).waitFor();
  await settle(page, 1200);
  await shot(page, '4-daily-home');

  // ── 6. Ladder tab — four rungs cleared, bonus rungs 11/12 in view ───────
  await page.getByRole('tab', { name: 'Ladder' }).click();
  await page.getByTestId('ladder-rungs').waitFor();
  await settle(page, 600);
  await page.getByTestId('ladder-rungs').evaluate((el) => { el.scrollTop = el.scrollHeight; });
  await page.waitForTimeout(700);
  await shot(page, '6-difficulty-ladder');

  // ── 5 + 3. Codex tab → Trophy Room (trophies, then abilities) ───────────
  await page.getByRole('tab', { name: 'Codex' }).click();
  await settle(page, 600);
  await page.getByRole('button', { name: /open the codex/i }).click();
  await settle(page, 1200);
  await shot(page, '5-trophy-room');
  await page.getByRole('button', { name: /^Abilities/ }).click();
  await settle(page, 1000);
  await shot(page, '3-power-arsenal');

  // ── 2. Offer — Endless level 1: a real 3-card slate, one card previewing ─
  let names = [];
  let pick = -1;
  for (let t = 0; t < OFFER_TRIES && pick < 0; t++) {
    await page.goto(`${BASE}/?endless=${ENDLESS_SEED}`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'START' }).click({ timeout: 20000 });
    await page.locator('button.offer-card-enter').nth(2).waitFor({ timeout: 15000 });
    await settle(page, 1200);
    names = (await page.locator('button.offer-card-enter span.uppercase').allInnerTexts()).map((n) => n.trim());
    const want = PREVIEW_PREFERENCE.find((n) => names.includes(n));
    pick = want ? names.indexOf(want) : -1;
  }
  if (pick < 0) { console.log('  WARNING: no preferred card on the slate; previewing the first'); pick = 0; }
  console.log(`  offer slate: ${names.join(' | ')} -> previewing ${names[pick]}`);
  if (names.length !== 3) console.log(`  WARNING: expected a 3-card slate, got ${names.length}`);
  await page.getByRole('button', { name: 'Preview', exact: true }).nth(pick).click();
  await page.waitForTimeout(1700); // mid-demo: the piece is showing its moves
  await shot(page, '2-ability-offer');

  // ── 1. Board — the open ladder rung (The Moat: lava + pawn court), L1 ───
  // Same URL the rung's difficulty sheet launches (onLadderStart).
  await page.goto(`${BASE}/?run=${LADDER[CLEARED_RUNGS]}&ladder=1&difficulty=normal`, { waitUntil: 'domcontentloaded' });
  const takeBoth = page.getByRole('button', { name: /^Take (both|it)$/ });
  await takeBoth.waitFor({ timeout: 20000 });
  await settle(page, 800);
  await dbg(page, 'grant');
  await takeBoth.click();
  await waitGone(page, page.locator('button.offer-card-enter'));
  await settle(page, 1500);
  let board = await readBoard(page);
  await dbg(page, 'L1-start');
  // One safe capture first (tempo bar moves, a piece is gone), then select
  // Rookie so her lines light up with the king in view.
  for (let i = 0; i < 4; i++) {
    const walls = await readTerrain(page);
    if (i === 0) console.log(`  terrain: ${[...walls].sort().join(' ') || 'none'}`);
    const plan = planMove(board, true); // a safe capture, or a safe square to set one up
    console.log(`  plan from ${board.rookie}: ${plan ? plan.to + (plan.capture ? ' x' + plan.capture : '') : 'none'}`);
    if (!plan || plan.capture === 'K') break;
    await move(page, board.rookie, plan.to);
    let after = await readBoard(page);
    if (after.rookie === board.rookie) { // the first tap after a modal can be swallowed
      await move(page, board.rookie, plan.to);
      after = await readBoard(page);
    }
    await dbg(page, `L1-m${i}-${board.rookie}-${plan.to}`);
    if (after.rookie === board.rookie) break; // tap swallowed / terrain — stop here
    board = after;
    if (plan.capture) break; // one piece taken is enough
    await page.waitForTimeout(800);
  }
  await settle(page, 2500); // let any speech bubble finish
  await clickSquare(page, board.rookie);
  await page.waitForTimeout(600);
  await shot(page, '1-board-the-hunt');

  await browser.close();
  console.log(`\ndone → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
