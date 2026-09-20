#!/usr/bin/env node
/**
 * Build the offline app bundle that ships inside the Rookie's Revenge iOS app.
 *
 *   npm run build:offline      then      npm run ios:sync
 *
 * WHY THIS EXISTS
 * The iOS app was a native shell whose webview loaded https://run.chesspath.app
 * at runtime (capacitor.config.ts `server.url`). No signal meant no game — and
 * the whole game runs on the device, so there was never a reason for that.
 *
 * HOW IT WORKS (same design as Chess Path's scripts/build-offline.mjs)
 * The site can't be static-exported as-is: route handlers live under `app/api`
 * and `output: 'export'` refuses to build if even one exists. So this builds a
 * SECOND target from a throwaway copy of the tree:
 *
 *   1. copy source into .offline-build/ (node_modules symlinked, never copied)
 *   2. delete every route handler and every page not on ROUTES
 *   3. filter public/ (~150 MB of source PNGs + concept art -> the shipped WebPs)
 *   4. next build with output: 'export'
 *   5. copy out/ -> capacitor-bundle/   (capacitor.config.ts `webDir`)
 *
 * The Vercel build never reads any of this. `next.config.ts`, `middleware.ts`
 * and every file under `app/` are untouched in the real repo.
 *
 * At runtime the bundle still talks to run.chesspath.app whenever it has
 * signal: lib/net/offline-fetch.ts re-points /api calls at the server, and
 * queues run saves made with no signal until the next time there is some.
 *
 * RULES (each one bit Chess Path): run ONE build at a time, to completion; not
 * sandboxed; and after `ios:sync`, grep the synced chunks for a string from
 * your change — a stale bundle syncs just as happily.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = path.join(ROOT, '.offline-build');
const OUT = path.join(ROOT, 'capacitor-bundle');

/** Source dirs the build needs. `data` is small here and imported by lib/. */
const SRC_COPY = ['app', 'components', 'hooks', 'lib', 'data/content', 'data/ladder-plan.json'];

/** Single files `lib/` imports out of the (12 MB) playtest corpus. */
const DATA_FILES = ['data/run-playtest/finale-remeasure-2026-09-06.json'];

const ROOT_FILES = ['package.json', 'tsconfig.json', 'postcss.config.mjs', 'next-env.d.ts'];

/**
 * The pages that ship. '' is the game — home, run, vault, leaderboard are all
 * one client page. Everything else (admin, replay, playtest, review, plan, stc,
 * test/*, the /[date] redirect) needs a server or is a Tyler-only tool.
 */
const ROUTES = ['', 'auth/login', 'auth/signup', 'auth/forgot-password', 'auth/reset-password'];

/** Never shipped from public/: working art and the STC side page. */
const PUBLIC_SKIP_DIRS = new Set(['concepts', 'stc']);

const log = (msg) => console.log(`[offline] ${msg}`);
const die = (msg) => { console.error(`\n[offline] FAILED: ${msg}\n`); process.exit(1); };

/* ------------------------------------------------------------------ 1. copy */

function copyTree() {
  fs.rmSync(BUILD, { recursive: true, force: true });
  fs.mkdirSync(BUILD, { recursive: true });

  for (const entry of [...SRC_COPY, ...DATA_FILES]) {
    const src = path.join(ROOT, entry);
    if (!fs.existsSync(src)) die(`expected "${entry}" — did the repo layout change?`);
    const dest = path.join(BUILD, entry);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
  }
  for (const file of ROOT_FILES) {
    const src = path.join(ROOT, file);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(BUILD, file));
  }

  // Symlinked, not copied: identical either way.
  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(BUILD, 'node_modules'), 'dir');
  log(`copied ${SRC_COPY.length + DATA_FILES.length} source entries`);
}

/* ------------------------------------------------- 2. prune routes + api */

function findRouteDirs(appDir, prefix = '') {
  const found = [];
  for (const entry of fs.readdirSync(appDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const route = prefix ? `${prefix}/${entry.name}` : entry.name;
    found.push(...findRouteDirs(path.join(appDir, entry.name), route));
  }
  if (fs.existsSync(path.join(appDir, 'page.tsx'))) found.push(prefix);
  return found;
}

function pruneApp() {
  const appDir = path.join(BUILD, 'app');

  // `output: 'export'` cannot tolerate a single route handler anywhere.
  fs.rmSync(path.join(appDir, 'api'), { recursive: true, force: true });
  for (const f of ['robots.ts', 'sitemap.ts']) fs.rmSync(path.join(appDir, f), { force: true });

  const allowed = new Set(ROUTES);
  let dropped = 0;
  for (const route of findRouteDirs(appDir)) {
    if (allowed.has(route)) continue;
    // Whole top-level directory for strays (test/, admin/, [date]/ …) so their
    // layouts don't survive; just the page when a kept route shares the parent.
    const top = route.split('/')[0];
    const shared = ROUTES.some((r) => r.split('/')[0] === top);
    fs.rmSync(path.join(appDir, shared ? route : top), { recursive: true, force: true });
    dropped++;
  }

  const kept = findRouteDirs(appDir);
  const missing = ROUTES.filter((r) => !kept.includes(r));
  if (missing.length) die(`these ROUTES have no page.tsx — the list is stale:\n  ${missing.join('\n  ')}`);
  log(`kept ${kept.length} routes, dropped ${dropped}`);
}

/* ------------------------------------------------------- 3. filter public */

function copyPublic() {
  const src = path.join(ROOT, 'public');
  const dest = path.join(BUILD, 'public');
  let skippedPng = 0;

  const walk = (dir, rel = '') => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const relPath = rel ? path.join(rel, entry.name) : entry.name;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!PUBLIC_SKIP_DIRS.has(entry.name)) walk(full, relPath);
        continue;
      }
      if (entry.name === '.DS_Store') continue;
      // A PNG with a WebP twin is the source file; the game only asks for the
      // WebP (artFile() never returns a .png).
      if (entry.name.endsWith('.png') && fs.existsSync(full.replace(/\.png$/, '.webp'))) {
        skippedPng++;
        continue;
      }
      fs.mkdirSync(path.dirname(path.join(dest, relPath)), { recursive: true });
      fs.copyFileSync(full, path.join(dest, relPath));
    }
  };
  walk(src);

  const kb = execFileSync('du', ['-sk', dest]).toString().split('\t')[0];
  log(`public/ filtered to ${Math.round(kb / 1024)} MB (skipped ${skippedPng} source PNGs + concept art)`);
}

/* ------------------------------------------------------------ 4. env vars */

/**
 * Next inlines NEXT_PUBLIC_* at BUILD time and the scratch dir has no
 * .env.local. Only NEXT_PUBLIC_* is forwarded — secrets must never reach a
 * bundle that ships to devices, and there is no server here to use them.
 */
const REQUIRED_PUBLIC_ENV = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

function writeEnv() {
  const envLocal = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envLocal)) die('.env.local not found — needed for NEXT_PUBLIC_* values.');

  const vars = {};
  for (const line of fs.readFileSync(envLocal, 'utf-8').split('\n')) {
    const m = line.match(/^\s*(NEXT_PUBLIC_[A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) vars[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  const missing = REQUIRED_PUBLIC_ENV.filter((k) => !vars[k]);
  if (missing.length) {
    die(`.env.local is missing ${missing.join(', ')} — the bundle would compile and then throw on every screen.`);
  }

  // Analytics is optional to RUN but you almost certainly want it: without the
  // key the app bundle is invisible in PostHog.
  if (!vars.NEXT_PUBLIC_POSTHOG_KEY) {
    log('WARN: .env.local has no NEXT_PUBLIC_POSTHOG_KEY — this bundle will send NO analytics');
  }

  vars.NEXT_PUBLIC_OFFLINE_BUILD = '1';
  // DEMO bundle (npm run build:offline:demo): every ladder rung open. See
  // LADDER_ALL_OPEN in lib/run/ladder.ts. Never submit one to the App Store.
  if (process.env.NEXT_PUBLIC_LADDER_ALL_OPEN === '1') {
    vars.NEXT_PUBLIC_LADDER_ALL_OPEN = '1';
    log('DEMO BUNDLE: every ladder rung is OPEN (NEXT_PUBLIC_LADDER_ALL_OPEN=1) — TestFlight only, not for App Store review');
  } else {
    delete vars.NEXT_PUBLIC_LADDER_ALL_OPEN;
  }
  fs.writeFileSync(
    path.join(BUILD, '.env.production'),
    Object.entries(vars).map(([k, v]) => `${k}=${v}`).join('\n') + '\n'
  );
  log(`forwarded ${Object.keys(vars).length} NEXT_PUBLIC_* vars (no secrets)`);
}

/* ----------------------------------------------------------- 5. next build */

function writeConfig() {
  fs.writeFileSync(path.join(BUILD, 'next.config.ts'), `
import type { NextConfig } from 'next';

// Generated by scripts/build-offline.mjs. Do not edit — edit that instead.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,           // /auth/login/index.html — what the webview serves
  images: { unoptimized: true }, // no image optimizer without a server
  typescript: { ignoreBuildErrors: true },
  experimental: { optimizePackageImports: ['posthog-js'] },
};

export default nextConfig;
`);
}

function build() {
  log('running next build (output: export)');
  execFileSync('npx', ['next', 'build'], {
    cwd: BUILD,
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_OFFLINE_BUILD: '1' },
  });
}

/* ------------------------------------------------------------- 6. ship out */

function publish() {
  const exported = path.join(BUILD, 'out');
  if (!fs.existsSync(path.join(exported, 'index.html'))) die('next build produced no out/index.html');

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.cpSync(exported, OUT, { recursive: true });

  const kb = execFileSync('du', ['-sk', OUT]).toString().split('\t')[0];
  log(`published to capacitor-bundle/ (${Math.round(kb / 1024)} MB)`);
  log('next: npm run ios:sync');
}

copyTree();
pruneApp();
copyPublic();
writeEnv();
writeConfig();
build();
publish();
