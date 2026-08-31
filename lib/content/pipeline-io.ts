/**
 * Node-only side of the content pipeline: read the registry fresh from disk,
 * write it back, and flip approved content to `live` once it is in the
 * player-facing pools. Never import this from app code (it uses `fs`).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { REVENGE_ABILITIES, REVENGE_RUN_IDS } from '../run/runs';
import { STARTER_ABILITIES } from '../run/profile';
import { advance, todayISO, type Registry } from './pipeline';

export const REGISTRY_PATH = join(process.cwd(), 'data', 'content', 'pipeline.json');

export function loadRegistry(path = REGISTRY_PATH): Registry {
  const reg = JSON.parse(readFileSync(path, 'utf8')) as Registry;
  if (!reg || reg.version !== 1 || !Array.isArray(reg.items)) throw new Error(`pipeline: bad registry at ${path}`);
  return reg;
}

export function saveRegistry(reg: Registry, path = REGISTRY_PATH): void {
  writeFileSync(path, JSON.stringify(reg, null, 2) + '\n');
}

/**
 * Is this id in a pool a real player can reach in the CURRENT build? Runs:
 * the daily rotation. Abilities: the starter kit or the Revenge offer pool.
 */
export function isReachableByPlayers(id: string, kind: 'ability' | 'run'): boolean {
  if (kind === 'run') return REVENGE_RUN_IDS.includes(id);
  return (STARTER_ABILITIES as ReadonlyArray<string>).includes(id) || REVENGE_ABILITIES.includes(id);
}

/**
 * approved → live for everything reachable by players in this build. The
 * pools above are derived from the registry, so an approved item is in them
 * as soon as the code that imported the registry was built — the nightly
 * calls this after `git pull` (= what Vercel deployed), and `pipeline.ts
 * mark-live` runs it by hand. Returns the ids flipped.
 */
export function syncLive(reg: Registry, at = todayISO()): { reg: Registry; flipped: string[] } {
  const flipped: string[] = [];
  let out = reg;
  for (const item of reg.items) {
    if (item.stage !== 'approved') continue;
    if (!isReachableByPlayers(item.id, item.kind)) continue;
    out = advance(out, item.id, 'live', { at });
    flipped.push(item.id);
  }
  return { reg: out, flipped };
}
