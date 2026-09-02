# Rookies Run — Playtest System

## Rookie's Revenge (current)

The game is now **Rookie's Revenge** (capture the king). The nightly pipeline for it:

```bash
npm run playtest:revenge            # full night: ~20-30 min on an M-series Mac
npm run playtest:revenge -- --quick # smoke: < 2 min, none + finishers only, tiny trials
scripts/run-revenge-nightly.sh      # cron wrapper: env, pull, run, Slack, commit digests (02:00)
```

For every run in `REVENGE_RUN_IDS` and `REVENGE_CANDIDATE_RUN_IDS` (`lib/run/runs.ts`) it runs:

| Step | What | File |
|---|---|---|
| a | Matrix at realistic tiers: win % per level × loadout, loss modes, stall share | `revenge-core.ts` (`matrixParallel`) |
| b | Full runs L1→L10 with random offer picks: reach / clear per level, authored + every mode | `revenge-core.ts` (`simulateRuns`) |
| c | Matrix on each difficulty mode (rookie / normal / hard / nightmare), fewer trials | same |
| d | AND-OR solver on the late levels, bounded depth + nodes | `revenge-core.ts` (`solveLevel`) |
| e | Per-level feature vector centered on piece count (enemies, hunters vs marchers, keys on the king's lines, pawn-defended keys, pen size, walls, open sides, budget, sightline pressure, rook distance to key/king…) | `revenge-features.ts` |
| f | Pearson + ridge regression of features vs no-ability win % and vs the finisher floor, plus plain-English threshold splits | `revenge-analysis.ts` |
| g | Night-over-night deltas: any cell moving >15 pts, any new stall, any level leaving its band | `revenge-analysis.ts` (`compareNights`) |
| h | Human traces from Supabase `run_traces` (reuses `pull-traces.ts`; creds from env) vs bot clear rate per level | `revenge-nightly.ts` |
| h2 | Watching Tyler: replay his real traces through the engine, ask T5 what IT would play at every verified decision, mine lessons + an ability frequency table; feeds `--tyler-priors` in the bot | `learn-from-tyler.ts` |
| i | 3 hypotheses per run (budget ±2, remove the nearest hunter, add a pawn defender / hunter), each with a predicted effect, each RUN tonight as an experiment; ledgered in `experiments.jsonl` | `revenge-analysis.ts` (`buildHypotheses`, `runExperiment`) |

The morning report (`revenge-digest.ts`) goes to `data/run-playtest/revenge/digests/YYYY-MM-DD.md` (+ `latest.md`); raw JSON to `data/run-playtest/revenge/raw/YYYY-MM-DD/` (committed by the wrapper when under 2 MB); a ≤25-line Slack summary to `raw/<date>/slack.txt`.

Band the report grades against (no-ability, realistic tiers): 100/100/100/100/90/50/55/50/30/30 ±15 across L1–L10, every finisher ≥ 80 %, zero stalls. Candidate runs get a PROMOTE / HOLD call on exactly that.

One-off tools (same engine): `revenge.ts matrix|runs|solve|trace|lint` — `--run=<id>`, `--difficulty=<mode>`, `--json`. The hand-written v2 report is `docs/revenge-playtest.md`.

---

## Legacy — rank-8 "Rookies Run" pipeline

Everything below is the ORIGINAL rank-8 pipeline (`nightly.ts`, `sweep.ts`, `ablation.ts`, `features.ts`, `digest.ts`, `hypothesis-queue.ts`, `model-version.ts`, …). It still runs against the classic rank-8 runs and is kept for reference; it is not the game any more.

Automated headless playtesting + difficulty calibration. Linear project: [Rookies Run Playtest System](https://linear.app/chesspathapp/project/rookies-run-playtest-system-02df85b27f07).

## What it does

Runs all current Rookies Run levels with three AI player tiers (T3 Casual, T4 Sharp, T5 Expert) and produces a morning digest covering:

- Per-level win % at each tier
- Fail-mode histograms (captured-by / move-limit / dead-end)
- Ability impact via **ablation** — re-sweep with each ability removed
- Level **feature vectors** (open files, density, threat zones, hazards, etc.)
- Correlations between features and difficulty per tier

## Running

```bash
# One-shot sweep (no ablation, no features) — fast smoke test
npx tsx scripts/run-playtest/sweep.ts

# Full nightly pipeline — sweep + ablation + features + digest
npx tsx scripts/run-playtest/nightly.ts
```

## Files

- `simulate.ts` — runs one `(puzzle, bot, seed)` game using the real engine
- `sweep.ts` — orchestrates `levels × tiers × trials` sims
- `ablation.ts` — re-sweep with each ability excluded from offer pool
- `features.ts` — extract feature vector per level
- `digest.ts` — markdown writer
- `nightly.ts` — top-level orchestrator (sweep + ablation + features + digest)
- `bots/t3.ts` — 1-ply principled
- `bots/t4.ts` — 2-ply minimax
- `bots/t5.ts` — 3-ply minimax (v0.1, no ability-aware planner yet)
- `bots/shared.ts` — eval + helpers

## Output

All artifacts land in `data/run-playtest/`:

- `digests/YYYY-MM-DD.md` — the morning digest
- `digests/latest.md` — mirror of the most recent digest
- `raw/YYYY-MM-DD/sweep.json` — raw outcomes
- `raw/YYYY-MM-DD/ablation.json` — per-ability deltas
- `raw/YYYY-MM-DD/features.json` — per-level feature vectors

## Determinism

The engine is deterministic given a state — RNG is only used in offer rolls (seeded by `level + moveCount + captures.length`). Bots add controlled stochasticity by sampling from top-K moves when several tie in eval (T3/T4 only). T5 plays deterministically. Sweep seeds are `levelId__tier__trialIndex` hashed → consistent re-runs.
