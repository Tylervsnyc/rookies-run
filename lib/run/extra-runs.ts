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
 *
 * RULE (audit 2026-09-09): only runs at stage testing/approved/live in
 * data/content/pipeline.json are imported here. A run at stage `idea` lives in
 * `lib/run/runs/_ideas/` and is NOT imported — twelve idea runs were riding in
 * the bundle, never graded and never served. `npx tsx scripts/pipeline.ts lint`
 * (part of `npm run check`) enforces file <-> registry <-> import agreement.
 */

import type { RunDef } from './run-kit';
import { RUN_REVENGE_22 } from './runs/revenge-22';
import { RUN_REVENGE_15 } from './runs/revenge-15';
import { RUN_REVENGE_17 } from './runs/revenge-17';
import { RUN_REVENGE_18 } from './runs/revenge-18';
import { RUN_REVENGE_19 } from './runs/revenge-19';
import { RUN_REVENGE_21 } from './runs/revenge-21';
import { RUN_REVENGE_23 } from './runs/revenge-23';
import { RUN_REVENGE_24 } from './runs/revenge-24';
import { RUN_REVENGE_25 } from './runs/revenge-25';
import { RUN_REVENGE_46 } from './runs/revenge-46';
import { RUN_REVENGE_48 } from './runs/revenge-48';
import { RUN_REVENGE_50 } from './runs/revenge-50';
import { RUN_REVENGE_51 } from './runs/revenge-51';
import { RUN_REVENGE_52 } from './runs/revenge-52';


export const EXTRA_REVENGE_RUNS: ReadonlyArray<RunDef> = [
  RUN_REVENGE_15,
  RUN_REVENGE_17,
  RUN_REVENGE_18,
  RUN_REVENGE_19,
  RUN_REVENGE_21,
  RUN_REVENGE_23,
  RUN_REVENGE_22,
  RUN_REVENGE_24,
  RUN_REVENGE_25,
  RUN_REVENGE_46,
  RUN_REVENGE_48,
  RUN_REVENGE_50,
  RUN_REVENGE_51,
  RUN_REVENGE_52,
];
