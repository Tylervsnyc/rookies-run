/**
 * Runs authored in their own files under `lib/run/runs/`.
 *
 * One import + one array entry per run. Keeping this list separate from the
 * 6.9k-line `runs.ts` is what lets several runs be written in parallel
 * without conflicting. `runs.ts` appends this array to the Revenge catalogue.
 *
 * RULE (broke prod 2026-09-05): only reference a run file that is already on
 * origin/main, or that you are committing in the same commit. Check with
 * `git ls-tree origin/main lib/run/runs/` before pushing.
 */

import type { RunDef } from './run-kit';
import { RUN_REVENGE_14 } from './runs/revenge-14';
import { RUN_REVENGE_15 } from './runs/revenge-15';
import { RUN_REVENGE_16 } from './runs/revenge-16';
import { RUN_REVENGE_17 } from './runs/revenge-17';
import { RUN_REVENGE_18 } from './runs/revenge-18';

export const EXTRA_REVENGE_RUNS: ReadonlyArray<RunDef> = [
  RUN_REVENGE_14,
  RUN_REVENGE_15,
  RUN_REVENGE_16,
  RUN_REVENGE_17,
  RUN_REVENGE_18,
];
