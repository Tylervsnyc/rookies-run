# Difficulty sweep — every player-facing run x all 4 difficulties

Generated 2026-09-08 from `data/run-playtest/difficulty-sweep-2026-09-07.json`. **Every number here was measured** by
`scripts/run-playtest/difficulty-sweep.ts`, which drives the shipped harness
(`revenge.ts runs`) — full runs L1→L10, random ability picks from every offer, bot tier
T5, **60 runs per (run, difficulty) cell**.

Each mode is played the way it ships: the difficulty knobs go through `applyDifficulty`
(enemies/turn, move limit, king behaviour, per-run `difficultyOverrides` pins) and the mode's
own retry rule is honoured — Rookie unlimited (harness caps at 5 per level), Normal 1, Hard 1,
Nightmare 0.

Sampling reality check: at n=60 a full-run rate carries roughly ±12pp at 95% confidence, so
gaps under ~8pp are noise. Per-level rates on late levels rest on however many runs *reached*
that level — the reached count is printed with every per-level table.

## 1. Headline — full-run clear rate (%)

| Run | Stage | Rookie | Normal | Hard | Nightmare | Rookie→Nightmare drop | Ladder |
|---|---|---|---|---|---|---|---|
| `crucible` | live | 100% | 100% | 100% | 100% | 0pp | flat |
| `revenge-1` | live | 100% | 100% | 100% | 98% | 2pp | flat |
| `revenge-10` | live | 100% | 100% | 100% | 98% | 2pp | flat |
| `revenge-11` | live | 100% | 100% | 98% | 95% | 5pp | flat |
| `revenge-12` | approved | 77% | 37% | 35% | 23% | 54pp | flat |
| `revenge-13` | live | 42% | 35% | 7% | 5% | 37pp | flat |
| `revenge-2` | live | 100% | 100% | 100% | 100% | 0pp | flat |
| `revenge-3` | live | 100% | 100% | 100% | 97% | 3pp | flat |
| `revenge-4` | live | 100% | 100% | 100% | 93% | 7pp | flat |
| `revenge-5` | live | 100% | 100% | 100% | 100% | 0pp | flat |
| `revenge-6` | live | 100% | 100% | 100% | 100% | 0pp | flat |
| `revenge-7` | live | 100% | 100% | 100% | 100% | 0pp | flat |
| `revenge-8` | live | 100% | 100% | 98% | 97% | 3pp | flat |
| `revenge-9` | live | 100% | 100% | 100% | 98% | 2pp | flat |
| `revenge-15` | testing | 47% | 23% | 3% | 0% | 47pp | flat |
| `revenge-21` | testing | 60% | 55% | 55% | 42% | 18pp | flat |
| `revenge-23` | testing | 48% | 40% | 42% | 17% | 31pp | flat |

**Mean across all measured runs:** Rookie 87% · Normal 82% · Hard 79% · Nightmare 74%.

### 1b. Per-attempt loss rate (%) — the ladder under the retry net

Full-run clear rate hides mode differences whenever retries absorb them (Rookie retries a level
up to 5 times, Normal/Hard once, Nightmare never). This counts EVERY level attempt the bot lost,
retried or not, over every attempt it made — so it reads the pressure a mode actually applies and
is comparable across retry budgets. Measured counts, not estimates.

| Run | Rookie | Normal | Hard | Nightmare | Pressure ladder |
|---|---|---|---|---|---|
| `crucible` | 0% | 0% | 0% | 0% | rises |
| `revenge-1` | 0% | 0% | 0.3% | 0.2% | rises |
| `revenge-10` | 0% | 0% | 0% | 0.2% | rises |
| `revenge-11` | 0% | 0.3% | 0.3% | 0.5% | rises |
| `revenge-12` | 24.6% | 22.6% | 21.8% | 12.2% | NOT monotone |
| `revenge-13` | 37.8% | 21.6% | 47.2% | 34.1% | NOT monotone |
| `revenge-2` | 0% | 0% | 0% | 0% | rises |
| `revenge-3` | 0% | 0% | 0.2% | 0.3% | rises |
| `revenge-4` | 0.3% | 0.3% | 0.7% | 0.7% | rises |
| `revenge-5` | 0% | 0% | 0.2% | 0% | rises |
| `revenge-6` | 0% | 0% | 0% | 0% | rises |
| `revenge-7` | 0% | 0% | 0% | 0% | rises |
| `revenge-8` | 0.3% | 0% | 0.3% | 0.3% | rises |
| `revenge-9` | 0% | 0% | 0% | 0.2% | rises |
| `revenge-15` | 33.1% | 23% | 28% | 16.8% | NOT monotone |
| `revenge-21` | 27.9% | 11.2% | 11.2% | 7.5% | NOT monotone |
| `revenge-23` | 32.4% | 17.5% | 17.8% | 12.4% | NOT monotone |

## 2. Where the ladder breaks

**Inversions (a harder mode is measurably EASIER) — 0 run(s):**

- none.

**Collapses (adjacent modes within 8pp — the step is decorative) — 17 run(s) carry at least one:**

- `crucible`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/100%)
- `revenge-1`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/98%)
- `revenge-10`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/98%)
- `revenge-11`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/98%); flat hard≈nightmare (98%/95%)
- `revenge-12`: flat normal≈hard (37%/35%)
- `revenge-13`: flat rookie≈normal (42%/35%); flat hard≈nightmare (7%/5%)
- `revenge-2`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/100%)
- `revenge-3`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/97%)
- `revenge-4`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/93%)
- `revenge-5`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/100%)
- `revenge-6`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/100%)
- `revenge-7`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/100%)
- `revenge-8`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/98%); flat hard≈nightmare (98%/97%)
- `revenge-9`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/98%)
- `revenge-15`: flat hard≈nightmare (3%/0%)
- `revenge-21`: flat rookie≈normal (60%/55%); flat normal≈hard (55%/55%)
- `revenge-23`: flat rookie≈normal (48%/40%); flat normal≈hard (40%/42%)

## 3. Effectively unwinnable modes (full-run clear ≤ 10%)

- `revenge-15` **nightmare** — 0/60 (0%). Wall: L8 at 8% (reached 13).
- `revenge-15` **hard** — 2/60 (3%). Wall: L8 at 12% (reached 25).
- `revenge-13` **nightmare** — 3/60 (5%). Wall: L2 at 15% (reached 60).
- `revenge-13` **hard** — 4/60 (7%). Wall: L2 at 32% (reached 60).

## 4. Bottleneck level per run (the single worst level)

Worst per-level clear rate on each difficulty, ignoring levels reached by fewer than 5 runs (too
few to read). A worst level OUTSIDE L7–L10 means the difficulty sits in the wrong place — the run
spikes in the middle and then coasts into its finale.

| Run | Rookie | Normal | Hard | Nightmare | Early spike? |
|---|---|---|---|---|---|
| `crucible` | none (min 100%) | none (min 100%) | none (min 100%) | none (min 100%) |  |
| `revenge-1` | none (min 100%) | none (min 100%) | none (min 100%) | none (min 98%) |  |
| `revenge-10` | none (min 100%) | none (min 100%) | none (min 100%) | none (min 98%) |  |
| `revenge-11` | none (min 100%) | none (min 100%) | none (min 98%) | none (min 97%) |  |
| `revenge-12` | L3 77% **!** | L3 60% **!** | L3 60% **!** | L6 53% **!** | YES |
| `revenge-13` | L8 64% | L3 63% **!** | L2 32% **!** | L2 15% **!** | YES |
| `revenge-2` | none (min 100%) | none (min 100%) | none (min 100%) | none (min 100%) |  |
| `revenge-3` | none (min 100%) | none (min 100%) | none (min 100%) | none (min 98%) |  |
| `revenge-4` | none (min 100%) | none (min 100%) | none (min 100%) | none (min 97%) |  |
| `revenge-5` | none (min 100%) | none (min 100%) | none (min 100%) | none (min 100%) |  |
| `revenge-6` | none (min 100%) | none (min 100%) | none (min 100%) | none (min 100%) |  |
| `revenge-7` | none (min 100%) | none (min 100%) | none (min 100%) | none (min 100%) |  |
| `revenge-8` | none (min 100%) | none (min 100%) | none (min 98%) | none (min 97%) |  |
| `revenge-9` | none (min 100%) | none (min 100%) | none (min 100%) | none (min 98%) |  |
| `revenge-15` | L5 67% **!** | L8 58% | L8 12% | L8 8% | YES |
| `revenge-21` | L7 76% | L7 73% | L7 73% | L7 69% |  |
| `revenge-23` | L7 62% | L7 61% | L7 63% | L7 57% |  |

Early spikes (worst level before L7 and under 90%), worst first:

- `revenge-13` nightmare: L2 at 15%
- `revenge-13` hard: L2 at 32%
- `revenge-12` nightmare: L6 at 53%
- `revenge-12` normal: L3 at 60%
- `revenge-12` hard: L3 at 60%
- `revenge-13` normal: L3 at 63%
- `revenge-15` rookie: L5 at 67%
- `revenge-12` rookie: L3 at 77%

## 5. Per-level detail

`rate% (cleared/reached)` per level. A level nobody reached shows `-`.

### `crucible` — The Crucible

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| nightmare | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |

### `revenge-1` — Rookie's Revenge

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| nightmare | **98%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 98% (59/60) |

### `revenge-10` — The Vault

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| nightmare | **98%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 98% (59/60) | 100% (59/59) | 100% (59/59) |

### `revenge-11` — Dead Bolt

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **98%** | 100% (60/60) | 98% (59/60) | 100% (59/59) | 100% (59/59) | 100% (59/59) | 100% (59/59) | 100% (59/59) | 100% (59/59) | 100% (59/59) | 100% (59/59) |
| nightmare | **95%** | 100% (60/60) | 98% (59/60) | 100% (59/59) | 100% (59/59) | 100% (59/59) | 100% (59/59) | 100% (59/59) | 97% (57/59) | 100% (57/57) | 100% (57/57) |

### `revenge-12` — The Moat

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **77%** | 100% (60/60) | 100% (60/60) | 77% (46/60) | 100% (46/46) | 100% (46/46) | 100% (46/46) | 100% (46/46) | 100% (46/46) | 100% (46/46) | 100% (46/46) |
| normal | **37%** | 100% (60/60) | 100% (60/60) | 60% (36/60) | 100% (36/36) | 100% (36/36) | 75% (27/36) | 93% (25/27) | 100% (25/25) | 92% (23/25) | 96% (22/23) |
| hard | **35%** | 100% (60/60) | 100% (60/60) | 60% (36/60) | 100% (36/36) | 97% (35/36) | 66% (23/35) | 100% (23/23) | 96% (22/23) | 100% (22/22) | 95% (21/22) |
| nightmare | **23%** | 100% (60/60) | 100% (60/60) | 73% (44/60) | 100% (44/44) | 91% (40/44) | 53% (21/40) | 81% (17/21) | 94% (16/17) | 94% (15/16) | 93% (14/15) |

### `revenge-13` — The Colonnade

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **42%** | 100% (60/60) | 100% (60/60) | 78% (47/60) | 100% (47/47) | 100% (47/47) | 100% (47/47) | 96% (45/47) | 64% (29/45) | 97% (28/29) | 89% (25/28) |
| normal | **35%** | 100% (60/60) | 100% (60/60) | 63% (38/60) | 100% (38/38) | 100% (38/38) | 100% (38/38) | 71% (27/38) | 78% (21/27) | 100% (21/21) | 100% (21/21) |
| hard | **7%** | 100% (60/60) | 32% (19/60) | 53% (10/19) | 100% (10/10) | 100% (10/10) | 100% (10/10) | 70% (7/10) | 86% (6/7) | 100% (6/6) | 67% (4/6) |
| nightmare | **5%** | 100% (60/60) | 15% (9/60) | 67% (6/9) | 100% (6/6) | 100% (6/6) | 100% (6/6) | 83% (5/6) | 100% (5/5) | 80% (4/5) | 75% (3/4) |

### `revenge-2` — Pawn Storm

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| nightmare | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |

### `revenge-3` — The Royal Guard

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| nightmare | **97%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 98% (59/60) | 98% (58/59) |

### `revenge-4` — The Fortress

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| nightmare | **93%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 97% (58/60) | 97% (56/58) |

### `revenge-5` — Stonework

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| nightmare | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |

### `revenge-6` — Two Keys

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| nightmare | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |

### `revenge-7` — Bramble Crown

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| nightmare | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |

### `revenge-8` — The Rampart

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **98%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 98% (59/60) |
| nightmare | **97%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 97% (58/60) |

### `revenge-9` — Cold Court

| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| normal | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| hard | **100%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) |
| nightmare | **98%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 98% (59/60) | 100% (59/59) |

### `revenge-15` — The Stacks

Per-run difficulty pins: `{"hard":{"enemiesPerTurnDelta":0}}`


| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **47%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 67% (40/60) | 100% (40/40) | 95% (38/40) | 97% (37/38) | 84% (31/37) | 90% (28/31) |
| normal | **23%** | 100% (60/60) | 100% (60/60) | 92% (55/60) | 100% (55/55) | 62% (34/55) | 100% (34/34) | 97% (33/34) | 58% (19/33) | 95% (18/19) | 78% (14/18) |
| hard | **3%** | 100% (60/60) | 100% (60/60) | 92% (55/60) | 100% (55/55) | 69% (38/55) | 100% (38/38) | 66% (25/38) | 12% (3/25) | 100% (3/3) | 67% (2/3) |
| nightmare | **0%** | 100% (60/60) | 100% (60/60) | 82% (49/60) | 100% (49/49) | 67% (33/49) | 100% (33/33) | 39% (13/33) | 8% (1/13) | 0% (0/1) | - |

### `revenge-21` — The Slash

Per-run difficulty pins: `{"hard":{"enemiesPerTurnDelta":0,"moveLimitDelta":0},"nightmare":{"enemiesPerTurnDelta":0,"moveLimitDelta":0}}`


| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **60%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 92% (55/60) | 100% (55/55) | 93% (51/55) | 76% (39/51) | 100% (39/39) | 95% (37/39) | 97% (36/37) |
| normal | **55%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 88% (53/60) | 92% (49/53) | 92% (45/49) | 73% (33/45) | 100% (33/33) | 100% (33/33) | 100% (33/33) |
| hard | **55%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 88% (53/60) | 92% (49/53) | 92% (45/49) | 73% (33/45) | 100% (33/33) | 100% (33/33) | 100% (33/33) |
| nightmare | **42%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 97% (58/60) | 83% (48/58) | 81% (39/48) | 69% (27/39) | 96% (26/27) | 100% (26/26) | 96% (25/26) |

### `revenge-23` — The Parapet

Per-run difficulty pins: `{"hard":{"enemiesPerTurnDelta":0}}`


| Difficulty | full | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rookie | **48%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 80% (48/60) | 98% (47/48) | 62% (29/47) | 100% (29/29) | 100% (29/29) | 100% (29/29) |
| normal | **40%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 73% (44/60) | 93% (41/44) | 61% (25/41) | 100% (25/25) | 96% (24/25) | 100% (24/24) |
| hard | **42%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 100% (60/60) | 73% (44/60) | 91% (40/44) | 63% (25/40) | 100% (25/25) | 100% (25/25) | 100% (25/25) |
| nightmare | **17%** | 100% (60/60) | 100% (60/60) | 100% (60/60) | 98% (59/60) | 69% (41/59) | 68% (28/41) | 57% (16/28) | 63% (10/16) | 100% (10/10) | 100% (10/10) |

## 6. Runs most in need of difficulty attention (worst first)

| # | Run | Why |
|---|---|---|
| 1 | `revenge-13` | 2 adjacent mode(s) indistinguishable; Rookie→Nightmare spread 37pp; unwinnable: hard, nightmare; early spike (L3,L2) |
| 2 | `revenge-15` | 1 adjacent mode(s) indistinguishable; Rookie→Nightmare spread 47pp; unwinnable: hard, nightmare; early spike (L5) |
| 3 | `crucible` | 3 adjacent mode(s) indistinguishable; no ladder at all — all four modes at the ceiling |
| 4 | `revenge-2` | 3 adjacent mode(s) indistinguishable; no ladder at all — all four modes at the ceiling |
| 5 | `revenge-5` | 3 adjacent mode(s) indistinguishable; no ladder at all — all four modes at the ceiling |
| 6 | `revenge-6` | 3 adjacent mode(s) indistinguishable; no ladder at all — all four modes at the ceiling |
| 7 | `revenge-7` | 3 adjacent mode(s) indistinguishable; no ladder at all — all four modes at the ceiling |
| 8 | `revenge-1` | 3 adjacent mode(s) indistinguishable; no ladder at all — all four modes at the ceiling |
| 9 | `revenge-10` | 3 adjacent mode(s) indistinguishable; no ladder at all — all four modes at the ceiling |
| 10 | `revenge-9` | 3 adjacent mode(s) indistinguishable; no ladder at all — all four modes at the ceiling |
| 11 | `revenge-3` | 3 adjacent mode(s) indistinguishable; no ladder at all — all four modes at the ceiling |
| 12 | `revenge-8` | 3 adjacent mode(s) indistinguishable; no ladder at all — all four modes at the ceiling |
| 13 | `revenge-11` | 3 adjacent mode(s) indistinguishable; no ladder at all — all four modes at the ceiling |
| 14 | `revenge-12` | 1 adjacent mode(s) indistinguishable; Rookie→Nightmare spread 54pp; early spike (L3,L6) |
| 15 | `revenge-4` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread 7pp |
| 16 | `revenge-21` | 2 adjacent mode(s) indistinguishable; Rookie→Nightmare spread 18pp |
| 17 | `revenge-23` | 2 adjacent mode(s) indistinguishable; Rookie→Nightmare spread 31pp |

## 7. The per-run `difficultyOverrides` pins

Three measured runs carry a pin. A pin replaces a difficulty's GLOBAL delta for that run only.

- `revenge-15` pins `{"hard":{"enemiesPerTurnDelta":0}}` — Rookie 47% / Normal 23% / Hard 3% / Nightmare 0%.
- `revenge-21` pins `{"hard":{"enemiesPerTurnDelta":0,"moveLimitDelta":0},"nightmare":{"enemiesPerTurnDelta":0,"moveLimitDelta":0}}` — Rookie 60% / Normal 55% / Hard 55% / Nightmare 42%.
- `revenge-23` pins `{"hard":{"enemiesPerTurnDelta":0}}` — Rookie 48% / Normal 40% / Hard 42% / Nightmare 17%.

**revenge-21 is the test case for whether a global delta is the right mechanism, and the answer measured
here is no.** With both deltas pinned to 0, Hard's curve is IDENTICAL to Normal's at every one of the 10 levels
(55% vs 55% full clear; per-level cleared/reached match exactly: 100/100/100/88/92/92/73/100/100/100).
The pin removed the two knobs that were making the run unwinnable, and what remained — the fleeing
king — moved nothing at all. Hard on this run is a relabelled Normal that pays 1.5x score.
Nightmare, which keeps the same pin but adds a king that reacts to allies and a higher tempo cap,
does separate (42%) — so the ally-reacting king is the only global knob on this run that
actually produces difficulty. The lesson: a global +1 enemy / -2 moves is not a difficulty dial, it is
a level-design assumption. On corridor/wall runs it is a gift (see the revenge-15 and revenge-23 notes
in their run files); on tight-finale runs it is an instant loss; pinning it to 0 leaves the mode empty.

## 8. Caveats — read before acting on these numbers

- **The measuring bot is not a person.** These runs are played by the T5 MCTS bot with Tyler-derived
  move priors. On `revenge-1`..`revenge-11` and `crucible` it clears essentially every level on every
  mode, so those rows say "the ladder is invisible to a strong player", NOT "a beginner will breeze
  through". The mode separation on those runs may exist for humans and be undetectable here.
- **Rookie mode retries are capped at 5** by the harness (`MAX_RETRIES`), where the shipped mode is
  unlimited. Rookie's true clear rate is therefore >= the number in this table.
- Ability offers are taken at RANDOM from every offer, which is a weaker player policy than choosing
  well. Runs whose difficulty is carried by a specific combo will read harder here than they play.
- One seed family per cell (`revenge-run:<i>:<level>`), shared across difficulties, so a run/difficulty
  pair is reproducible and two difficulties see the same starting layouts.

## 9. Reproduce

```
npx tsx scripts/run-playtest/difficulty-sweep.ts --runs=60 --jobs=4
npx tsx scripts/run-playtest/difficulty-sweep-report.ts
```

The sweep checkpoints after every (run, difficulty) pair and skips pairs already in the out file, so
it is resumable. `--ids=` restricts it to named runs.
