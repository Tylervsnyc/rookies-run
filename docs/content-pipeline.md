# Content pipeline — abilities and runs

One registry decides what real players can see: `data/content/pipeline.json`.
Every ability id and every Revenge run id has a record with a stage:

```
idea → testing → approved → live        (+ retired, from anywhere)
```

Where a run's file lives says its stage (enforced by `npx tsx scripts/pipeline.ts lint`,
part of `npm run check`):

| Stage | File | Imported by `lib/run/extra-runs.ts`? |
|---|---|---|
| `idea` | `lib/run/runs/_ideas/<id>.ts` | no — never in the bundle |
| `testing` / `approved` / `live` | `lib/run/runs/<id>.ts` | yes |
| `retired` | either | no |

**The ladder is the product (2026-09-09).** Every `LADDER_RUNG_IDS` entry must be
`approved`/`live` (the build asserts it), and `REVENGE_RUN_IDS` — the daily pool and
picker — is exactly the ladder. The 13 pre-combo-gate runs (revenge-1..11, 13,
crucible) were retired that day; `pipeline.ts stage <id> testing` brings one back.

| Stage | Meaning | Who moves it |
|---|---|---|
| `idea` | Written down, no code. | `pipeline.ts add` |
| `testing` | Code exists (`pipeline.ts built <id>` moves an idea here). Hidden from players; reachable only via dev hooks (`?run=<id>`, `?loadout=<id>:<tier>`). The nightly grades it and writes `testing: { verdict READY/HOLD, summary, digestPath }`. | nightly (verdicts) |
| `approved` | Tyler signed off. Player-facing on the next build (pools are built from the registry). | **Tyler** (`approve`) |
| `live` | Approved AND in a player-reachable pool. Flipped by the nightly after it pulls main, or by `mark-live`. | nightly / `mark-live` |
| `retired` | Cut. Stripped from saved profiles, never offered, still loadable via dev hooks if the code exists. | `retire` |

**Player-facing = approved or live.** Everything the app builds from —
`STARTER_ABILITIES`, `REVENGE_ABILITIES` (the offer pool), `REVENGE_RUN_IDS`
(daily rotation + picker) — is the code catalog filtered by
`isPlayerFacing()` from `lib/content/pipeline.ts`. `HIDDEN_RUNS` and
`REVENGE_CANDIDATE_RUN_IDS` still exist in `runs.ts` but are DERIVED from the
registry (not player-facing / stage testing), never hand-kept.

## CLI

```
npx tsx scripts/pipeline.ts list
npx tsx scripts/pipeline.ts add ability twin "Twin" "A second controllable rook."   # → idea
npx tsx scripts/pipeline.ts built twin          # code landed → testing (nightly grades it)
npx tsx scripts/pipeline.ts approve twin        # Tyler's sign-off → approved
npx tsx scripts/pipeline.ts mark-live [id]      # approved → live if it is in the built pool
npx tsx scripts/pipeline.ts retire twin "Too strong with Surge."
npx tsx scripts/pipeline.ts stage twin testing  # escape hatch: any stage by hand
npx tsx scripts/pipeline.ts lint                # files <-> registry <-> imports <-> ladder agree
```

## How Tyler approves

Say **"approve squire"** (or the run name) to Claude, or run
`npx tsx scripts/pipeline.ts approve summon-knight` yourself. Approve stamps
`by: 'Tyler'` and the date. The item is in the starter kit / offer pool /
daily rotation on the next build; the next nightly (or `mark-live`) records
it as `live`. Commit `data/content/pipeline.json` with the code.

To pull something back for another look: `stage <id> testing` — it drops
out of the pools again.

## What the reports show

- **Nightly digest** (`data/run-playtest/revenge/digests/<date>.md`) gets a
  `## Content pipeline` section: counts per stage, items waiting on Tyler
  (READY first, then HOLD with the reason), approved-not-yet-live, what went
  live in the last 7 days, and the idea backlog. The Slack summary carries a
  two-line version. Run verdicts map 1:1 from the harness (promote = READY,
  hold = HOLD). Ability verdicts (for abilities in `testing`) come from the
  realistic-tier matrix across every run swept: READY when the bot casts it
  and it lifts the win rate; that is a floor, not a fun verdict.
- **Daily Slack report** (`chess-learning-tree/scripts/daily-report.ts`, 09:03
  local) has a `ROOKIE'S REVENGE CONTENT` section reading the same file:
  counts, "waiting on you", went-live-7d, ideas backlog.

## Notes

- The nightly grades the LADDER only (`.github/workflows/revenge-nightly.yml`).
  Grade a testing run by hand: `npx tsx scripts/run-playtest/revenge-nightly.ts --runs-filter=<id>`.
- `ability-lab` (`?run=ability-lab`) is a dev sandbox, not content — it is
  always hidden and includes testing-stage abilities on purpose.
- The nightly harness sweeps every BUILT ability (testing|approved|live), so
  testing content is graded before Tyler decides.
