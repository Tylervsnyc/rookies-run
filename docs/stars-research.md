# Stars on Run Complete — research (2026-09-03)

## 1. What a score is today

`lib/run/scoring.ts` `computeScore`: **1000 base − 25/move + piece values captured (pawn 10, minor 30, queen 90, king 100) − 2/second + 250/level cleared + 15/leftover tempo**, clamped at 0. `app/page.tsx` feeds it the *clearing attempt's* moves per level (retries don't add moves, but their seconds do count).

Two things worth knowing:

- **Difficulty multipliers (0.5 / 1 / 1.5 / 2) are never applied.** `scoreMultFor` exists but nothing calls it. Hard and Rookie score identically.
- **The score is never stored.** `submitScore` sends only levels/captures, and the `run_scores` table does not exist on prod (REST returns 404, the leaderboard degrades to empty). There is no score history anywhere except localStorage.

Theoretical range, 10-level run, any difficulty: floor ≈ 3500 − moves − time (a slow 65-move, 10-minute clear ≈ 2,700); ceiling ≈ 4,300 (30 moves, every piece captured, 3 minutes). Real completions land in a narrow 2,750–3,600 band, and the score barely tracks skill: a 64-move clear scored 2,932 while a 32-move clear scored 2,782, because more moves = more captures. **Do not build stars on the raw score.**

## 2. Real data

Prod `run_traces` has 46 human attempts since Aug 17 (mostly Tyler's accounts; no dummy rows — the `DUMMY_ROWS` in ArenaHome never hit the DB). 13 are completed 10-level runs. Bot data: `data/run-playtest/revenge/raw/2026-09-02` "realistic" bot, per level win-weighted average moves ≈ **2.6 / 2.8 / 2.9 / 4.0 / 4.6 / 4.9 / 4.8 / 5.3 / 5.6 / 6.0 = 43 moves per run** (revenge-1..7 all land 42–46). Bots' best lines total ~30–35 moves.

Human completions:

| Run (date) | Moves (clearing attempts) | Retries | Time | Classic score |
|---|---|---|---|---|
| revenge-3 hard (9-03) | 32 | 0 | 4:50 | 3335 |
| revenge-2 (9-03) | 32 | 0 | 7:14 | 2782 |
| revenge-4 hard (9-03) | 33 | 0 | 4:34 | 3042 |
| revenge-10 (9-02) | 36 | 1 | 8:10 | 3070 |
| revenge-1 (8-19) | 37 | 0 | 3:48 | 3579 |
| crucible (9-02) | 43 | 0 | 7:10 | 3015 |
| revenge-2 (9-03) | 45 | 0 | 7:02 | 2791 |
| revenge-11 (9-03) | 45 | 2 | 6:51 | 3363 |
| revenge-1 (8-31) | 46 | 1 | 9:51 | 3013 |
| revenge-1 (8-28) | 51 | 2 | 7:10 | 2750 |
| revenge-1 (8-31) | 53 | 0 | 5:25 | 3410 |
| revenge-1 (9-01) | 56 | 0 | 8:10 | 3040 |
| revenge-1 (9-02) | 64 | 0 | 6:59 | 2932 |

Score percentiles: p10 2782 · p25 2932 · p50 3040 · p75 3335 · p90 3363 · max 3579. Moves: 32–64, median 45. Two stable, legible signals fall out: **retries** and **moves vs the bot's par**.

## 3. Proposal: per-RUN stars, moves + retries

Stars belong to the run (they are the payoff of "Run complete"). Level popups get no stars — just a tiny "5 moves · par 5" chip so par becomes a familiar word before it matters.

| Stars | Rule | One-liner on the card |
|---|---|---|
| 1 | Finished the run | "Run complete" |
| 2 | Finished with **no retries** | "No retries" |
| 3 | No retries **and total moves ≤ par** | "No retries · under par (35)" |

**Par = 80% of the realistic bot's average moves for that run, rounded** (≈35 today). Store `parMoves` in the run registry next to the level list and let the nightly playtest regenerate it, so par moves with the levels instead of drifting. Fallback when a run has no bot data: generic par 35. Rookie difficulty (unlimited retries, +4 move limit) uses the same rule; Nightmare's 0 retries means finishing = 2 stars, which feels right.

Applied to the 13 real completions: **3 stars: 3 (23%)** (the three 32–33-move clears) · **2 stars: 6 (46%)** · **1 star: 4 (31%)**. The sample is the designer playing his own levels, so the public 3-star rate should sit around 10–15%. The 37-move no-retry run misses 3 stars by 2 moves — exactly the "one more go" itch Tyler wants.

Not in the rule: time (already in the testing Timed score; add later as a tie-breaker if runs feel campable) and the classic score (keep showing it as a chip, don't rank by it).

## 4. UI plan

**StampCard**: add an optional `stars` prop rendered between the pips and the chips — three 40px star outlines, filled gold one at a time (~220ms each, 350ms apart, ease-out-expo, starting after the pips finish at ~1.2s), each with the existing shock-ring plus a short ascending sfx; unearned stars stay hollow at 25% white so a 1-star finish visibly leaves two holes. `prefers-reduced-motion` → all three fade in together.

**RunSummaryModal**: pass `stars` and one rule line under them ("No retries · 37 moves, par 35 → 2 more moves for 3 stars"); confetti scales with stars (1 = none, 2 = current, 3 = double + gold ring). Persist `bestStars[difficulty][runId]` in the profile so the Arena home rung rows and ladder can show ★★☆.

**LevelClearedModal**: unchanged except the "moves · par" chip via the existing `chips` slot.
