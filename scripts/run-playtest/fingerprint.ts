/**
 * ENGINE FINGERPRINT — which game produced a number.
 *
 * Between 2026-09-03 and 2026-09-09 the engine rules changed on six separate
 * days (refills, seeding, the capturing king, king-once-per-phase and its
 * revert, summoning sickness, Aegis, Sacrifice). Each one silently invalidated
 * every clear rate measured before it, and the capturing king broke six of ten
 * ladder rungs for a day before anyone noticed, because no result file said
 * which engine it came from.
 *
 * Every artifact written by the harness carries this. `ladder-audit.ts
 * --check-stale` compares it to the current tree.
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export interface EngineFingerprint {
  /** Short git sha of HEAD. */
  sha: string;
  /** True when lib/run has uncommitted edits — the sha alone does not describe the engine. */
  dirty: boolean;
  /** sha256 over every file under lib/run (sorted by path), first 12 hex chars. Describes the engine exactly, dirty or not. */
  libHash: string;
}

function walk(dir: string, out: string[]): void {
  for (const name of readdirSync(dir).sort()) {
    if (name === '__tests__' || name === '_ideas') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.ts')) out.push(p);
  }
}

export function engineFingerprint(root = process.cwd()): EngineFingerprint {
  let sha = 'nogit';
  let dirty = false;
  try {
    sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
    dirty = execFileSync('git', ['status', '--porcelain', '--', 'lib/run', 'data/content/pipeline.json'], { cwd: root, encoding: 'utf8' }).trim().length > 0;
  } catch {
    /* no git (CI tarball) — libHash still identifies the engine */
  }
  const files: string[] = [];
  walk(join(root, 'lib', 'run'), files);
  const h = createHash('sha256');
  for (const f of files) {
    h.update(f.slice(root.length));
    h.update(readFileSync(f));
  }
  // The registry decides which runs/abilities exist, so it is part of the engine.
  try { h.update(readFileSync(join(root, 'data', 'content', 'pipeline.json'))); } catch { /* absent in a bare checkout */ }
  return { sha, dirty, libHash: h.digest('hex').slice(0, 12) };
}

export function fmtFingerprint(f: EngineFingerprint): string {
  return `${f.sha}${f.dirty ? '+dirty' : ''}/${f.libHash}`;
}

export function sameEngine(a: EngineFingerprint | undefined, b: EngineFingerprint): boolean {
  return !!a && a.libHash === b.libHash;
}
