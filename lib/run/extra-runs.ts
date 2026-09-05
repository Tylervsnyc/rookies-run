/**
 * Runs authored in their own files under `lib/run/runs/`.
 *
 * One import + one array entry per run. Keeping this list separate from the
 * 6.9k-line `runs.ts` is what lets several runs be written in parallel
 * without conflicting. `runs.ts` appends this array to the Revenge catalogue.
 */

import type { RunDef } from './run-kit';
import RUN_REVENGE_16 from './runs/revenge-16';
import { RUN_REVENGE_14 } from './runs/revenge-14';

export const EXTRA_REVENGE_RUNS: ReadonlyArray<RunDef> = [RUN_REVENGE_14, RUN_REVENGE_16];
