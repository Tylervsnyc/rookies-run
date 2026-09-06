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
import { RUN_REVENGE_22 } from './runs/revenge-22';
import { RUN_REVENGE_14 } from './runs/revenge-14';
import { RUN_REVENGE_15 } from './runs/revenge-15';
import { RUN_REVENGE_16 } from './runs/revenge-16';
import { RUN_REVENGE_17 } from './runs/revenge-17';
import { RUN_REVENGE_18 } from './runs/revenge-18';
import { RUN_REVENGE_19 } from './runs/revenge-19';
import { RUN_REVENGE_21 } from './runs/revenge-21';
import { RUN_REVENGE_23 } from './runs/revenge-23';
import { RUN_REVENGE_20 } from './runs/revenge-20';
import { RUN_REVENGE_24 } from './runs/revenge-24';
import { RUN_REVENGE_25 } from './runs/revenge-25';
import { RUN_REVENGE_26 } from './runs/revenge-26';
import { RUN_REVENGE_27 } from './runs/revenge-27';
import { RUN_REVENGE_29 } from './runs/revenge-29';

export const EXTRA_REVENGE_RUNS: ReadonlyArray<RunDef> = [
  RUN_REVENGE_14,
  RUN_REVENGE_15,
  RUN_REVENGE_16,
  RUN_REVENGE_17,
  RUN_REVENGE_18,
  RUN_REVENGE_19,
  RUN_REVENGE_21,
  RUN_REVENGE_23,
  RUN_REVENGE_22,
  RUN_REVENGE_20,
  RUN_REVENGE_24,
  RUN_REVENGE_25,
  RUN_REVENGE_26,
  RUN_REVENGE_27,
  RUN_REVENGE_29,
];
