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
| `revenge-2` | live | 100% | 100% | 100% | 100% | 0pp | flat |
| `revenge-3` | live | 100% | 100% | 100% | 97% | 3pp | flat |
| `revenge-4` | live | 100% | 100% | 100% | 93% | 7pp | flat |
| `revenge-5` | live | 100% | 100% | 100% | 100% | 0pp | flat |
| `revenge-6` | live | 100% | 100% | 100% | 100% | 0pp | flat |
| `revenge-7` | live | 100% | 100% | 100% | 100% | 0pp | flat |
| `revenge-8` | live | 100% | 100% | 98% | 97% | 3pp | flat |
| `revenge-9` | live | 100% | 100% | 100% | 98% | 2pp | flat |

**Mean across all measured runs:** Rookie 98% · Normal 91% · Hard 88% · Nightmare 86%.

### 1b. Deaths per 100 level-visits — the ladder under the retry net

Full-run clear rate hides mode differences whenever retries absorb them (Rookie gets 5 retries a
level, Normal/Hard 1, Nightmare 0). Deaths counts EVERY loss the bot suffered, retried or not, so
it reads the actual pressure a mode applies. This is a measured count, not an estimate.

| Run | Rookie | Normal | Hard | Nightmare | Pressure ladder |
|---|---|---|---|---|---|
| `crucible` | 0 | 0 | 0 | 0 | rises |
| `revenge-1` | 0 | 0 | 0 | 0 | rises |
| `revenge-10` | 0 | 0 | 0 | 0 | rises |
| `revenge-11` | 0 | 0 | 0 | 1 | rises |
| `revenge-12` | 32 | 26 | 25 | 12 | NOT monotone |
| `revenge-2` | 0 | 0 | 0 | 0 | rises |
| `revenge-3` | 0 | 0 | 0 | 0 | rises |
| `revenge-4` | 0 | 0 | 1 | 1 | rises |
| `revenge-5` | 0 | 0 | 0 | 0 | rises |
| `revenge-6` | 0 | 0 | 0 | 0 | rises |
| `revenge-7` | 0 | 0 | 0 | 0 | rises |
| `revenge-8` | 0 | 0 | 0 | 0 | rises |
| `revenge-9` | 0 | 0 | 0 | 0 | rises |

## 2. Where the ladder breaks

**Inversions (a harder mode is measurably EASIER) — 0 run(s):**

- none.

**Collapses (adjacent modes within 8pp — the step is decorative) — 13 run(s) carry at least one:**

- `crucible`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/100%)
- `revenge-1`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/98%)
- `revenge-10`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/98%)
- `revenge-11`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/98%); flat hard≈nightmare (98%/95%)
- `revenge-12`: flat normal≈hard (37%/35%)
- `revenge-2`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/100%)
- `revenge-3`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/97%)
- `revenge-4`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/93%)
- `revenge-5`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/100%)
- `revenge-6`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/100%)
- `revenge-7`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/100%)
- `revenge-8`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/98%); flat hard≈nightmare (98%/97%)
- `revenge-9`: flat rookie≈normal (100%/100%); flat normal≈hard (100%/100%); flat hard≈nightmare (100%/98%)

## 3. Effectively unwinnable modes (full-run clear ≤ 10%)

- `revenge-13` **nightmare** — 3/60 (5%). Wall: L2 at 15% (reached 60).
- `revenge-13` **hard** — 4/60 (7%). Wall: L2 at 32% (reached 60).

## 4. Bottleneck level per run (the single worst level)

Worst per-level clear rate on each difficulty, ignoring levels reached by fewer than 5 runs (too
few to read). A worst level OUTSIDE L7–L10 means the difficulty sits in the wrong place — the run
spikes in the middle and then coasts into its finale.

| Run | Rookie | Normal | Hard | Nightmare | Early spike? |
|---|---|---|---|---|---|
| `crucible` | L1 100% **!** | L1 100% **!** | L1 100% **!** | L1 100% **!** |  |
| `revenge-1` | L1 100% **!** | L1 100% **!** | L1 100% **!** | L10 98% |  |
| `revenge-10` | L1 100% **!** | L1 100% **!** | L1 100% **!** | L8 98% |  |
| `revenge-11` | L1 100% **!** | L1 100% **!** | L2 98% **!** | L8 97% |  |
| `revenge-12` | L3 77% **!** | L3 60% **!** | L3 60% **!** | L6 53% **!** | YES |
| `revenge-13` | - | L3 63% **!** | L2 32% **!** | L2 15% **!** | YES |
| `revenge-2` | L1 100% **!** | L1 100% **!** | L1 100% **!** | L1 100% **!** |  |
| `revenge-3` | L1 100% **!** | L1 100% **!** | L1 100% **!** | L9 98% |  |
| `revenge-4` | L1 100% **!** | L1 100% **!** | L1 100% **!** | L9 97% |  |
| `revenge-5` | L1 100% **!** | L1 100% **!** | L1 100% **!** | L1 100% **!** |  |
| `revenge-6` | L1 100% **!** | L1 100% **!** | L1 100% **!** | L1 100% **!** |  |
| `revenge-7` | L1 100% **!** | L1 100% **!** | L1 100% **!** | L1 100% **!** |  |
| `revenge-8` | L1 100% **!** | L1 100% **!** | L10 98% | L10 97% |  |
| `revenge-9` | L1 100% **!** | L1 100% **!** | L1 100% **!** | L9 98% |  |

Early spikes (worst level before L7 and under 90%), worst first:

- `revenge-13` nightmare: L2 at 15%
- `revenge-13` hard: L2 at 32%
- `revenge-12` nightmare: L6 at 53%
- `revenge-12` normal: L3 at 60%
- `revenge-12` hard: L3 at 60%
- `revenge-13` normal: L3 at 63%
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

| Difficulty | full |  |
|---|---||
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

## 6. Runs most in need of difficulty attention (worst first)

| # | Run | Why |
|---|---|---|
| 1 | `crucible` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 0pp |
| 2 | `revenge-2` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 0pp |
| 3 | `revenge-5` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 0pp |
| 4 | `revenge-6` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 0pp |
| 5 | `revenge-7` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 0pp |
| 6 | `revenge-1` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 2pp |
| 7 | `revenge-10` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 2pp |
| 8 | `revenge-9` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 2pp |
| 9 | `revenge-3` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 3pp |
| 10 | `revenge-8` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 3pp |
| 11 | `revenge-11` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 5pp |
| 12 | `revenge-4` | 3 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 7pp |
| 13 | `revenge-12` | 1 adjacent mode(s) indistinguishable; Rookie→Nightmare spread only 54pp; early spike (L3,L6) |
