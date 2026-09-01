# HANDOFF — controllable-summon family session (2026-09-01, cloud handoff)

Session was cut mid-task (laptop closing). State of the three assigned tasks:

## Task 1 — full nightly harness: NOT COMPLETED (skip — GitHub Actions covers it)
- `--quick` smoke PASSED (1.7 min, digest written).
- The full `--skip-experiments --skip-humans` run was started in the
  background, then CRASHED mid-flight — expected: this session edited
  `lib/run/*` while the nightly's worker processes were re-importing them.
  `data/run-playtest/revenge/raw/2026-09-01/*` and
  `data/run-playtest/revenge/digests/2026-09-01.md` on disk are a MIX of last
  night's cron run and the partial re-run — do not trust them; the next
  nightly overwrites them. Nothing from it is committed here.

## Task 2 — 10 controllable-summon abilities: 8 IMPLEMENTED, 2 design-only. DONE except measurement.
- Generic controlled-ally engine in `lib/run/abilities.ts` (CONTROLLED_SOURCES,
  controlledAllies, canMoveAllyAt, controlledAllyLegalMoves,
  applyControlledAllyMove, controlledThreatensSquare + swap/sacrifice/knighting
  implementations). Squire (`summon-knight`) is now a wrapper over it.
- Implemented (all in pipeline stage `testing`, catalog-registered, bot-enumerable,
  UI-wired, tsc-clean): bishop-squire, page, twin, duchess, vanguard, swap,
  sacrifice, knighting.
- Design-only (pipeline stage `idea`): banner (free summon moves), phalanx
  (3 controlled pawns).
- Touched files: lib/run/{types,abilities,engine,pawn-ai,runs}.ts,
  lib/admin/content-data.ts, components/run/{Board,AbilityCard}.tsx,
  app/page.tsx, scripts/run-playtest/{types.ts,revenge-core.ts,
  bots/{shared,apply,mcts}.ts}, data/content/pipeline.json.
- Verified: `npx tsc --noEmit` clean; T5 traces on revenge-1 L6 for
  twin/page/duchess/vanguard/bishop-squire all end `won`, with the summon
  itself capturing the king via the generalized `squire-move` bot action.
- REMAINING: the matrix/runs measurements in
  `candidate-abilities/2026-09-01/summary.md` (protocol at the bottom of that
  file); win-rate columns there are still predictions. The nightly will also
  grade all 8 automatically since they are `testing` + in
  REVENGE_ABILITY_CATALOG. Card art is placeholder (PLACEHOLDER_ART lists the
  8 missing webp files; fallback glyphs/SVG icons render meanwhile).
- Per-ability design docs: only summary.md was written before the handoff;
  the individual <id>.md files remain to be written from summary.md's specs.

## Task 3 — revenge-7 (new run from generated candidates): NOT STARTED per handoff instruction.
- Nothing generated, nothing added to runs.ts, no pipeline record.

## Guardrails honored
- No pipeline approve / mark-live. No difficulty.ts edits. Nothing outside
  run/ability/playtest systems.
