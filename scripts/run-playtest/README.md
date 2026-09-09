# Rookie's Revenge — playtest harness

Headless bots play the real engine (`lib/run`) so every level and run has a number
before a human touches it. Rebuilt 2026-09-09 (see `docs/AUDIT-2026-09-09.md`);
the rank-8 "Rookie's Run" pipeline that used to live here is gone.

## The four rules

1. **One contract.** `spec.ts` is `docs/LADDER-SPEC.md` as code: six checks, rung-sloped
   bands, the 60-80 combo window, and the budgets those windows imply. Everything that
   grades imports from it. If you want a different bar, change `spec.ts` and the doc.
2. **Error bars or no verdict.** Every cell is a Wilson 95% interval. A check is PASS only
   when the whole interval is inside the window, FAIL only when it is wholly outside,
   otherwise **INCONCLUSIVE** with the trial count that would settle it. Never round a
   straddling interval to a verdict — at 16 trials a cell is ±20 points and the spec
   window is ±8.
3. **Every number knows its engine.** `fingerprint.ts` stamps `<git sha>[+dirty]/<hash of
   lib/run + registry>` on every artifact; `results.ts` writes the one envelope
   (`data/run-playtest/results/<date>/<experiment>.json`) and the one index
   (`results/INDEX.md`). `ladder-audit.ts --check-stale` says whether the filed numbers
   describe the game in the tree. Two rows with different hashes are different games.
4. **The ladder is the product.** `LADDER_RUNG_IDS` (`lib/run/ladder.ts`) = the ten
   `live` runs = `REVENGE_RUN_IDS`. The nightly grades the ladder and nothing else;
   candidates are graded by hand.

## Commands

```bash
npm run playtest:ladder                 # ladder-audit.ts: all 10 rungs vs spec.ts, files a result (~96 trials/cell, 96 runs, ~1h on 8 cores)
npm run playtest:ladder -- --quick      # 4 trials — smoke only
npm run playtest:ladder -- --rung=3 --trials=48 --runs=40
npm run playtest:ladder -- --sick       # summoning sickness ON (the ladder as it will be)
npm run playtest:ladder -- --check-stale
npm run playtest:report                 # print the latest filed audit with engine + freshness
npm run playtest                        # revenge-nightly.ts: the full nightly (ladder audit first, then per-run context)
npm run playtest -- --quick
npx tsx scripts/run-playtest/revenge-nightly.ts --runs-filter=revenge-30   # grade one candidate
npx tsx scripts/run-playtest/engine-regression.ts --trials=32 --runs=24    # re-grade vs the last filed audit
npx tsx scripts/run-playtest/revenge.ts matrix --run=<id> --difficulty=normal --levels=7,8,9,10 --loadouts=none,<card>,<a>+<b> --trials=32
npx tsx scripts/run-playtest/revenge.ts trace --run=<id> --level=8 --loadout=<a>+<b>
npx tsx scripts/run-playtest/matrix-determinism-check.ts                   # the harness must agree with itself three ways
npm run playtest:parity                 # bot games replayed in the real app, must match 8/8
npx tsx scripts/run-playtest/combo-discover.ts --from-terrain --slots=7-10 --variants=20   # discovery (nightly job)
```

Method for every number of record: **Normal, T5 bot, T1 cards** (`realistic: false`).
Passing the difficulty is load-bearing.

## Automation

| what | where | when |
|---|---|---|
| Ladder audit + digest + Slack | `.github/workflows/revenge-nightly.yml` job `ladder` | 04:30 UTC nightly; **posts NIGHTLY FAILED on failure/timeout** |
| Combo-gate discovery | same file, job `combo-discovery` | nightly, independent |
| Engine regression | `.github/workflows/engine-regression.yml` | every push to `lib/run/**` or the registry; red = a rung changed grade |
| Content pipeline | `scripts/pipeline.ts` (`lint` runs in `npm run check`) | by hand; see `docs/content-pipeline.md` |

There are **no local crons**. `scripts/run-revenge-nightly.sh` is a manual wrapper only.

## Files

| file | job |
|---|---|
| `spec.ts` | the contract + Wilson intervals + budgets |
| `fingerprint.ts`, `results.ts` | engine stamp; envelope + INDEX.md |
| `ladder-audit.ts`, `ladder-report.ts` | grade the ten rungs; print the latest filed grade |
| `engine-regression.ts` | before/after vs the last filed audit |
| `revenge-core.ts` | the engine driver: `matrixParallel`, `simulateRuns`, `solveLevel`, bots T4/T5 (`bots/`) |
| `revenge.ts` | CLI + worker (`matrix / runs / solve / trace / lint`) |
| `revenge-nightly.ts`, `revenge-digest.ts`, `revenge-analysis.ts`, `revenge-features.ts`, `revenge-pipeline.ts` | the nightly: ladder audit first, then per-run context (matrix at realistic tiers, mode matrix, solver, features, night-over-night deltas, experiments), digest + Slack, registry verdicts for candidates |
| `combo-discover.ts`, `combo-terrain.ts`, `revenge-generate.ts` | combo-gated level discovery + generators → `data/run-playtest/combo-library/` |
| `difficulty-sweep*.ts`, `multi-route-*.ts`, `endless-formations.ts`, `tier-cap-audit.ts` | standing experiments; results filed under `results/` |
| `revenge-parity.ts`, `matrix-determinism-check.ts`, `render-replay.ts`, `pull-traces.ts`, `learn-from-tyler.ts` | tools |
| `archive/2026-09/` | one-off scripts from the tuning sprint, kept for provenance, do not run |

## Data

```
data/run-playtest/
  results/<date>/<experiment>.json   every measurement, enveloped (results.ts)
  results/INDEX.md                   one row per file — date · engine · budget · conclusion
  revenge/digests/<date>.md          the nightly digest; latest.md is a SYMLINK
  combo-library/<pair>/              discovered combo-gated levels; SYNERGY.md = the pair map
  pair-hypotheses.json, new-ability-proposals.json   inputs to discovery
  finale-remeasure-2026-09-06.json   STALE (pre capturing king) but imported by lib/run/endless.ts — see the audit
  human-traces/                      Tyler's real games (gitignored)
```

## Known limits of the bot

- Cast rate < 10% on a card (currently `sacrifice`, `swap` as singles) means the bot cannot
  use it; those cells are floors, not verdicts, and are excluded from claims.
- The bot finds one-turn reactions to a present threat; it cannot find pre-emptive plays
  or delayed fuses. Design a pair's payoff accordingly.
- `T6` (MCTS-320) is the bot behind the `T5` label in `revenge-core.ts`.
