# Rookie's Revenge — Morning Report

**Date:** 2026-08-30 · **Mode:** full · **Wall time:** 28.8 min
**Bot:** T5 MCTS · **Live run:** 40 trials per cell at realistic tiers, 15 per difficulty mode, 80 full runs per mode · **Experiments:** 40 trials · candidates run lighter (see each run)

## Headline

IMPOSSIBLE LEVEL in Stonework (revenge-5, candidate) — L10: IMPOSSIBLE — 0% with every loadout (19 tried), stall/move-limit 69%, solver: no line, app fail-safe would fire ("No way through"). Fix the level before anything else. Rookie's Revenge: a new player (3 starters) clears the run 100% of the time on Normal and 100% on Rookie — TOO EASY (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 100% / 100%. Powers carry you by +32 points (no-ability averages 67%, finishers 99%). Zero stalls. No previous night to compare against yet — tonight is the baseline. Ran 7 experiments on level tweaks: 6 predictions confirmed, 1 falsified. Candidate runs: 4 tested, 0 ready to promote. 19 human runs on revenge-1 since 2026-07-31, 9 won.

## Run difficulty and ability tiers

Difficulty is measured on the player who actually exists: a **new player** with only the 3 starters (knight-hop, surge, freeze-ray), taking the offers the app forces (never dismissing), with the mode's retries (Rookie unlimited, Normal 3). Target: 40-60% full-run clear on Normal, 70%+ on Rookie; over 85% on Normal is TOO EASY.

**Rookie's Revenge** (`revenge-1`)

- **New player clears this run 100% of the time on Normal / 100% on Rookie — TOO EASY.** (40 runs per mode; retries used: Normal 0, Rookie 0.)
- Veteran (all 18 abilities): 100% on Normal / 100% on Rookie.
- Powers carry you by **+32 points**: no-ability averages 67% across L1-L10, the five finishers average 99%. Hard levels without powers (no-ability under 60%): L6 50%, L7 38%, L8 35%, L9 25%, L10 38%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 2 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 3 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 4 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 5 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 6 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 7 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 8 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 9 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 10 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 6 levels where no-ability is under 100% (L5, L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +56 | L5 100% | 99% |
| S | become-king | 100% | +56 | L5 100% | 90% |
| S | bishop-step | 100% | +56 | L5 100% | 96% |
| S | rabies-dart | 100% | +56 | L5 100% | 100% |
| S | surge | 100% | +56 | L5 100% | 100% |
| S | decoy | 100% | +55 | L6 98% | 100% |
| S | queen-pulse | 100% | +55 | L8 98% | 98% |
| S | squad † | 100% | +55 | L7 98% | 0% |
| S | drones | 99% | +55 | L5 95% | 99% |
| S | knight-hop | 98% | +53 | L10 90% | 100% |
| S | convert | 95% | +51 | L6 88% | 100% |
| S | freeze-ray | 95% | +51 | L10 80% | 98% |
| A | bodyguard | 92% | +48 | L10 57% | 100% |
| A | poison-dart | 90% | +46 | L10 63% | 99% |
| A | smoke | 89% | +45 | L10 75% | 93% |
| B | boulder | 82% | +37 | L10 33% | 94% |
| B | magnet | 72% | +28 | L10 43% | 64% |
| D | rewind † | 46% | +2 | L9 10% | 0% |

† squad, rewind: bot never casts this (cast rate under 10%) — floor, not a verdict.

**Pawn Storm** (`revenge-2`, candidate)

- **New player clears this run 100% of the time on Normal / 100% on Rookie — TOO EASY.** (20 runs per mode; retries used: Normal 0, Rookie 0.)
- Veteran (all 18 abilities): 100% on Normal / 100% on Rookie.
- Powers carry you by **+26 points**: no-ability averages 72% across L1-L10, the five finishers average 98%. Hard levels without powers (no-ability under 60%): L7 54%, L8 46%, L9 33%, L10 8%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 2 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 3 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 4 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 5 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 6 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 7 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 8 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 9 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 10 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 5 levels where no-ability is under 100% (L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +56 | L6 100% | 100% |
| S | become-king | 100% | +56 | L6 100% | 100% |
| S | decoy | 100% | +56 | L6 100% | 100% |
| S | drones | 100% | +56 | L6 100% | 100% |
| S | knight-hop | 100% | +56 | L6 100% | 100% |
| S | queen-pulse | 100% | +56 | L6 100% | 98% |
| S | rabies-dart | 100% | +56 | L6 100% | 100% |
| S | surge | 100% | +56 | L6 100% | 100% |
| S | bishop-step | 98% | +54 | L10 92% | 99% |
| S | convert | 98% | +54 | L6 96% | 100% |
| S | squad † | 96% | +52 | L9 92% | 0% |
| S | poison-dart | 95% | +51 | L10 79% | 99% |
| A | bodyguard | 92% | +48 | L10 58% | 100% |
| A | boulder | 88% | +44 | L10 50% | 99% |
| A | freeze-ray | 85% | +41 | L10 38% | 98% |
| B | smoke | 79% | +35 | L10 25% | 96% |
| D | magnet | 49% | +5 | L10 4% | 44% |
| D | rewind † | 39% | -5 | L10 4% | 0% |

† squad, rewind: bot never casts this (cast rate under 10%) — floor, not a verdict.

**The Royal Guard** (`revenge-3`, candidate)

- **New player clears this run 100% of the time on Normal / 100% on Rookie — TOO EASY.** (20 runs per mode; retries used: Normal 8, Rookie 3.)
- Veteran (all 18 abilities): 95% on Normal / 100% on Rookie.
- Powers carry you by **+31 points**: no-ability averages 69% across L1-L10, the five finishers average 100%. Hard levels without powers (no-ability under 60%): L6 46%, L7 38%, L8 21%, L9 54%, L10 29%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 2 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 3 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 4 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 5 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 6 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 7 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 8 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 9 | 100% (20/20) | 1 | 100% (20/20) | 0 | 100% |
| 10 | 100% (20/20) | 7 | 100% (20/20) | 3 | 95% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 5 levels where no-ability is under 100% (L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | become-king | 100% | +62 | L6 100% | 99% |
| S | bishop-step | 100% | +62 | L6 100% | 99% |
| S | decoy | 100% | +62 | L6 100% | 100% |
| S | drones | 100% | +62 | L6 100% | 100% |
| S | queen-pulse | 100% | +62 | L6 100% | 99% |
| S | rabies-dart | 100% | +62 | L6 100% | 100% |
| S | surge | 100% | +62 | L6 100% | 100% |
| S | aegis | 98% | +61 | L10 92% | 95% |
| S | knight-hop | 98% | +61 | L10 92% | 99% |
| S | freeze-ray | 98% | +60 | L6 96% | 98% |
| S | bodyguard | 97% | +59 | L9 92% | 100% |
| S | poison-dart | 97% | +59 | L10 88% | 99% |
| S | convert | 96% | +58 | L10 83% | 100% |
| S | squad † | 96% | +58 | L10 83% | 0% |
| A | smoke | 93% | +56 | L6 79% | 97% |
| A | boulder | 91% | +53 | L6 79% | 93% |
| B | magnet | 70% | +32 | L10 58% | 61% |
| D | rewind † | 32% | -6 | L10 13% | 0% |

† squad, rewind: bot never casts this (cast rate under 10%) — floor, not a verdict.

**The Fortress** (`revenge-4`, candidate)

- **New player clears this run 100% of the time on Normal / 100% on Rookie — TOO EASY.** (20 runs per mode; retries used: Normal 0, Rookie 0.)
- Veteran (all 18 abilities): 100% on Normal / 100% on Rookie.
- Powers carry you by **+28 points**: no-ability averages 71% across L1-L10, the five finishers average 99%. Hard levels without powers (no-ability under 60%): L7 54%, L8 42%, L9 21%, L10 33%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 2 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 3 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 4 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 5 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 6 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 7 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 8 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 9 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 10 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 6 levels where no-ability is under 100% (L5, L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | become-king | 100% | +48 | L5 100% | 99% |
| S | bishop-step | 100% | +48 | L5 100% | 84% |
| S | decoy | 100% | +48 | L5 100% | 99% |
| S | rabies-dart | 100% | +48 | L5 100% | 100% |
| S | surge | 100% | +48 | L5 100% | 99% |
| S | drones | 99% | +47 | L10 96% | 100% |
| S | queen-pulse | 99% | +47 | L10 96% | 89% |
| S | aegis | 97% | +45 | L8 88% | 95% |
| S | convert | 97% | +45 | L5 92% | 100% |
| S | knight-hop | 97% | +44 | L9 83% | 96% |
| S | poison-dart | 97% | +44 | L10 83% | 99% |
| S | freeze-ray | 95% | +43 | L10 83% | 99% |
| A | smoke | 94% | +42 | L8 88% | 89% |
| A | bodyguard | 90% | +38 | L10 54% | 97% |
| A | squad † | 88% | +35 | L9 50% | 0% |
| B | boulder | 79% | +27 | L9 46% | 90% |
| B | magnet | 75% | +23 | L10 46% | 56% |
| C | rewind † | 56% | +4 | L10 38% | 0% |

† squad, rewind: bot never casts this (cast rate under 10%) — floor, not a verdict.

**Stonework** (`revenge-5`, candidate)

- **New player clears this run 0% of the time on Normal / 0% on Rookie — too hard.** (20 runs per mode; retries used: Normal 61, Rookie 160.)
- Veteran (all 18 abilities): 0% on Normal / 0% on Rookie.
- Powers carry you by **+13 points**: no-ability averages 71% across L1-L10, the five finishers average 84%. Hard levels without powers (no-ability under 60%): L7 25%, L9 8%, L10 0%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 2 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 3 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 4 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 5 | 100% (20/20) | 1 | 100% (20/20) | 0 | 100% |
| 6 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 7 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 8 | 100% (20/20) | 0 | 100% (20/20) | 0 | 100% |
| 9 | 100% (20/20) | 0 | 100% (20/20) | 0 | 95% |
| 10 | 0% (0/20) | 80 | 0% (0/20) | 180 | 0% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 4 levels where no-ability is under 100% (L5, L7, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| B | drones | 74% | +46 | L10 0% | 82% |
| B | surge | 74% | +46 | L10 0% | 98% |
| B | become-king | 73% | +45 | L10 0% | 79% |
| B | aegis | 72% | +44 | L10 0% | 81% |
| B | decoy | 71% | +43 | L10 0% | 84% |
| B | queen-pulse | 71% | +43 | L10 0% | 73% |
| C | smoke | 70% | +42 | L10 0% | 70% |
| C | convert | 69% | +41 | L10 0% | 100% |
| C | bodyguard | 62% | +34 | L10 0% | 97% |
| C | rabies-dart | 58% | +30 | L10 0% | 81% |
| C | poison-dart | 57% | +29 | L10 0% | 86% |
| C | bishop-step | 56% | +28 | L10 0% | 83% |
| C | freeze-ray | 53% | +25 | L10 0% | 78% |
| C | squad † | 53% | +25 | L10 0% | 0% |
| C | knight-hop | 51% | +23 | L10 0% | 75% |
| D | boulder | 48% | +20 | L10 0% | 77% |
| D | magnet | 40% | +12 | L10 0% | 47% |
| D | rewind † | 17% | -11 | L7 0% | 0% |

† squad, rewind: bot never casts this (cast rate under 10%) — floor, not a verdict.

## Rookie's Revenge (`revenge-1`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 40 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.5 | - |
| 2 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.8 | - |
| 3 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 4 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 5 | 75-100% | **80%** (m8) | 5 tied 100% | bishop-step 100% | rewind 90% | - | 12 | 9.1 | - |
| 6 | 35-65% | **50%** (c3,m17) | 5 tied 100% | bishop-step 100% | rewind 53% | - | 12 | 9.2 | none no6, 5/5 finishers proven |
| 7 | 40-70% | **38%** (c2,m23) **too hard** | 5 tied 100% | bishop-step 100% | rewind 50% | - | 12 | 10.7 | none no6, 5/5 finishers proven |
| 8 | 35-65% | **35%** (c7,m19) | 2 tied 100% | freeze-ray 90% | rewind 48% | - | 14 | 10.9 | none no6, 3/5 finishers proven |
| 9 | 15-45% | **25%** (c7,m23) | 5 tied 100% | bishop-step 100% | rewind 10% | - | 14 | 12.5 | none no6, 5/5 finishers proven |
| 10 | 15-45% | **38%** (c6,m19) | 3 tied 100% | freeze-ray 80% | rewind 25% | - | 18 | 14.3 | none no6, 0/5 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-step | bodyguard | boulder | convert | decoy | drones | freeze-ray | knight-hop | magnet | poison-dart | queen-pulse | rabies-dart | rewind | smoke | squad | surge |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 80% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 95% | 100% | 100% | 98% | 100% | 100% | 100% | 90% | 100% | 100% | 100% |
| 6 | 50% | 100% | 100% | 100% | 95% | 85% | 88% | 98% | 98% | 100% | 100% | 65% | 83% | 100% | 100% | 53% | 93% | 100% | 100% |
| 7 | 38% | 100% | 100% | 100% | 100% | 93% | 100% | 100% | 100% | 100% | 100% | 73% | 100% | 100% | 100% | 50% | 95% | 98% | 100% |
| 8 | 35% | 100% | 100% | 100% | 100% | 83% | 100% | 100% | 100% | 90% | 95% | 63% | 95% | 98% | 100% | 48% | 88% | 100% | 100% |
| 9 | 25% | 100% | 100% | 100% | 100% | 95% | 93% | 100% | 100% | 100% | 100% | 90% | 100% | 100% | 100% | 10% | 85% | 100% | 100% |
| 10 | 38% | 100% | 100% | 100% | 57% | 33% | 90% | 100% | 100% | 80% | 90% | 43% | 63% | 100% | 100% | 25% | 75% | 100% | 100% |

**Verdict:** needs a look 
- TOO EASY — a new player clears 100% of runs on Normal (target 40-60%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L7 no-ability 38% is too hard for the legacy band (40-70%).

### Difficulty modes — Rookie's Revenge

T1 loadouts, no-ability + the five finishers, 15 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/93/80/53/53/33/33 | L9 33% | freeze-ray 73% on L10 | - | 80/80 |
| Normal | 100/100/100/100/67/60/53/40/20/53 | L9 20% | knight-hop 53% on L10 | - | 78/80 |
| Hard | 100/100/100/100/80/93/60/47/13/20 | L9 13% | freeze-ray 60% on L10 | - | 78/80 |
| Nightmare | 100/100/100/100/67/100/60/27/20/27 | L9 20% | freeze-ray 40% on L10 | - | 78/80 |

### Full runs — Rookie's Revenge (authored, random picks)

80 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **78/80 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 80 | 80 | 100% | - |
| 2 | 80 | 80 | 100% | - |
| 3 | 80 | 80 | 100% | - |
| 4 | 80 | 80 | 100% | - |
| 5 | 80 | 80 | 100% | - |
| 6 | 80 | 80 | 100% | - |
| 7 | 80 | 80 | 100% | - |
| 8 | 80 | 80 | 100% | - |
| 9 | 80 | 80 | 100% | - |
| 10 | 80 | 78 | 98% | dead-end 2 |

Most-picked cards: knight-hop 100, bishop-step 86, freeze-ray 80, queen-pulse 65, surge 49, magnet 30, convert 25, rabies-dart 17.

## Pawn Storm (`revenge-2`) — CANDIDATE

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 24 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.8 | - |
| 2 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.7 | - |
| 3 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.6 | - |
| 4 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 9 | - |
| 5 | 75-100% | **100%** | 5 tied 100% | bishop-step 100% | magnet 96% | - | 12 | 6.4 | - |
| 6 | 35-65% | **79%** (c1,m4) **too easy** | 5 tied 100% | bishop-step 100% | rewind 38% | - | 11 | 8.7 | none W6, 5/5 finishers proven |
| 7 | 40-70% | **54%** (c2,m9) | 5 tied 100% | bishop-step 100% | rewind 63% | - | 14 | 10.4 | none W6, 5/5 finishers proven |
| 8 | 35-65% | **46%** (c3,m10) | 5 tied 100% | bishop-step 100% | rewind 42% | - | 10 | 7.9 | none W6, 5/5 finishers proven |
| 9 | 15-45% | **33%** (c7,m9) | 4 tied 100% | freeze-ray 88% | rewind 46% | - | 16 | 11.8 | none no6, 5/5 finishers proven |
| 10 | 15-45% | **8%** (c6,m16) **too hard** | 3 tied 100% | freeze-ray 38% **low** | magnet 4% | - | 13 | 11.3 | none no6, 0/5 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-step | bodyguard | boulder | convert | decoy | drones | freeze-ray | knight-hop | magnet | poison-dart | queen-pulse | rabies-dart | rewind | smoke | squad | surge |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 96% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 6 | 79% | 100% | 100% | 100% | 100% | 100% | 96% | 100% | 100% | 100% | 100% | 54% | 100% | 100% | 100% | 38% | 100% | 96% | 100% |
| 7 | 54% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 92% | 100% | 100% | 100% | 63% | 96% | 100% | 100% |
| 8 | 46% | 100% | 100% | 100% | 100% | 92% | 100% | 100% | 100% | 100% | 100% | 46% | 96% | 100% | 100% | 42% | 88% | 100% | 100% |
| 9 | 33% | 100% | 100% | 100% | 100% | 96% | 100% | 100% | 100% | 88% | 100% | 50% | 100% | 100% | 100% | 46% | 88% | 92% | 100% |
| 10 | 8% | 100% | 100% | 92% | 58% | 50% | 96% | 100% | 100% | **38%** | 100% | 4% | 79% | 100% | 100% | 4% | 25% | 92% | 100% |

**Verdict:** HOLD 
- TOO EASY — a new player clears 100% of runs on Normal (target 40-60%)
- L10 freeze-ray only 38% (every finisher must be at least 80%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L6 no-ability 79% is too easy for the legacy band (35-65%); L10 no-ability 8% is too hard for the legacy band (15-45%).

### Difficulty modes — Pawn Storm

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/88/63/38/88/50/0 | L10 0% | knight-hop 13% on L10 | - | 40/40 |
| Normal | 100/100/100/100/100/50/25/63/50/0 | L10 0% | freeze-ray 13% on L10 | - | 40/40 |
| Hard | 100/100/100/100/100/75/63/38/38/0 | L10 0% | freeze-ray 0% on L10 | - | 40/40 |
| Nightmare | 100/100/100/100/88/88/50/13/38/0 | L10 0% | freeze-ray 25% on L10 | - | 38/40 |

### Full runs — Pawn Storm (authored, random picks)

40 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **39/40 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 40 | 40 | 100% | - |
| 2 | 40 | 40 | 100% | - |
| 3 | 40 | 40 | 100% | - |
| 4 | 40 | 40 | 100% | - |
| 5 | 40 | 40 | 100% | - |
| 6 | 40 | 40 | 100% | - |
| 7 | 40 | 40 | 100% | - |
| 8 | 40 | 40 | 100% | - |
| 9 | 40 | 40 | 100% | - |
| 10 | 40 | 39 | 98% | captured 1 |

Most-picked cards: freeze-ray 43, knight-hop 35, queen-pulse 35, bishop-step 31, surge 23, magnet 20, convert 9, rabies-dart 9.

## The Royal Guard (`revenge-3`) — CANDIDATE

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 24 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.7 | - |
| 2 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.8 | - |
| 3 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 3.2 | - |
| 4 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 7.1 | - |
| 5 | 75-100% | **100%** | 5 tied 100% | bishop-step 100% | rewind 88% | - | 13 | 7.8 | - |
| 6 | 35-65% | **46%** (m13) | 4 tied 100% | freeze-ray 96% | rewind 38% | - | 14 | 12.5 | none no6, 5/5 finishers proven |
| 7 | 40-70% | **38%** (c7,m8) **too hard** | 5 tied 100% | bishop-step 100% | rewind 42% | - | 18 | 12.4 | none no6, 5/5 finishers proven |
| 8 | 35-65% | **21%** (c5,m14) **too hard** | 4 tied 100% | freeze-ray 96% | rewind 33% | - | 14 | 15.6 | none no6, 5/5 finishers proven |
| 9 | 15-45% | **54%** (c1,m10) **too easy** | 5 tied 100% | bishop-step 100% | rewind 33% | - | 14 | 9 | none no6, 5/5 finishers proven |
| 10 | 15-45% | **29%** (c6,m11) | 3 tied 100% | knight-hop 92% | rewind 13% | - | 15 | 11.1 | none no6, 5/5 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-step | bodyguard | boulder | convert | decoy | drones | freeze-ray | knight-hop | magnet | poison-dart | queen-pulse | rabies-dart | rewind | smoke | squad | surge |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 100% | 100% | 100% | 100% | 100% | 100% | 92% | 100% | 100% | 100% | 100% | 92% | 100% | 100% | 100% | 88% | 100% | 100% | 100% |
| 6 | 46% | 100% | 100% | 100% | 96% | 79% | 96% | 100% | 100% | 96% | 100% | 63% | 96% | 100% | 100% | 38% | 79% | 96% | 100% |
| 7 | 38% | 100% | 100% | 100% | 100% | 92% | 100% | 100% | 100% | 100% | 100% | 75% | 100% | 100% | 100% | 42% | 100% | 100% | 100% |
| 8 | 21% | 100% | 100% | 100% | 100% | 96% | 100% | 100% | 100% | 96% | 100% | 75% | 100% | 100% | 100% | 33% | 100% | 100% | 100% |
| 9 | 54% | 100% | 100% | 100% | 92% | 100% | 100% | 100% | 100% | 100% | 100% | 79% | 100% | 100% | 100% | 33% | 88% | 100% | 100% |
| 10 | 29% | 92% | 100% | 100% | 96% | 88% | 83% | 100% | 100% | 96% | 92% | 58% | 88% | 100% | 100% | 13% | 100% | 83% | 100% |

**Verdict:** HOLD 
- TOO EASY — a new player clears 100% of runs on Normal (target 40-60%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L7 no-ability 38% is too hard for the legacy band (40-70%); L8 no-ability 21% is too hard for the legacy band (35-65%); L9 no-ability 54% is too easy for the legacy band (15-45%).

### Difficulty modes — The Royal Guard

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/88/63/25/25/50/25 | L7 25% | knight-hop 63% on L10 | - | 40/40 |
| Normal | 100/100/100/100/88/50/50/50/25/25 | L9 25% | knight-hop 88% on L10 | - | 40/40 |
| Hard | 100/100/100/100/100/50/13/50/13/0 | L10 0% | freeze-ray 63% on L7 | - | 40/40 |
| Nightmare | 100/100/100/100/100/38/50/25/0/13 | L9 0% | knight-hop 75% on L7 | - | 40/40 |

### Full runs — The Royal Guard (authored, random picks)

40 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **40/40 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 40 | 40 | 100% | - |
| 2 | 40 | 40 | 100% | - |
| 3 | 40 | 40 | 100% | - |
| 4 | 40 | 40 | 100% | - |
| 5 | 40 | 40 | 100% | - |
| 6 | 40 | 40 | 100% | - |
| 7 | 40 | 40 | 100% | - |
| 8 | 40 | 40 | 100% | - |
| 9 | 40 | 40 | 100% | - |
| 10 | 40 | 40 | 100% | - |

Most-picked cards: queen-pulse 54, freeze-ray 36, surge 32, knight-hop 27, bishop-step 19, smoke 14, convert 10, poison-dart 10.

## The Fortress (`revenge-4`) — CANDIDATE

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 24 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 3 | - |
| 2 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.8 | - |
| 3 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 3.4 | - |
| 4 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 5.1 | - |
| 5 | 75-100% | **96%** (m1) | 5 tied 100% | bishop-step 100% | convert 92% | - | 14 | 8.8 | - |
| 6 | 35-65% | **67%** (m8) **too easy** | 5 tied 100% | bishop-step 100% | rewind 50% | - | 11 | 8.8 | none no6, 5/5 finishers proven |
| 7 | 40-70% | **54%** (c4,m7) | 5 tied 100% | bishop-step 100% | rewind 46% | - | 14 | 10.1 | none W6, 5/5 finishers proven |
| 8 | 35-65% | **42%** (m14) | 5 tied 100% | bishop-step 100% | rewind 58% | - | 10 | 9 | none no6, 5/5 finishers proven |
| 9 | 15-45% | **21%** (c11,m8) | 3 tied 100% | knight-hop 83% | boulder 46% | - | 17 | 12 | none no6, 1/5 finishers proven |
| 10 | 15-45% | **33%** (c3,m13) | 2 tied 100% | freeze-ray 83% | rewind 38% | - | 14 | 11.2 | none no6, 0/5 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-step | bodyguard | boulder | convert | decoy | drones | freeze-ray | knight-hop | magnet | poison-dart | queen-pulse | rabies-dart | rewind | smoke | squad | surge |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 96% | 100% | 100% | 100% | 100% | 100% | 92% | 100% | 100% | 100% | 100% | 92% | 100% | 100% | 100% | 96% | 100% | 100% | 100% |
| 6 | 67% | 100% | 100% | 100% | 96% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 50% | 100% | 100% | 100% |
| 7 | 54% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 79% | 100% | 100% | 100% | 46% | 100% | 100% | 100% |
| 8 | 42% | 88% | 100% | 100% | 92% | 75% | 96% | 100% | 100% | 100% | 100% | 83% | 100% | 100% | 100% | 58% | 88% | 96% | 100% |
| 9 | 21% | 100% | 100% | 100% | 100% | 46% | 96% | 100% | 100% | 88% | 83% | 50% | 96% | 100% | 100% | 46% | 88% | 50% | 100% |
| 10 | 33% | 96% | 100% | 100% | 54% | 54% | 96% | 100% | 96% | 83% | 96% | 46% | 83% | 96% | 100% | 38% | 88% | 79% | 100% |

**Verdict:** HOLD 
- TOO EASY — a new player clears 100% of runs on Normal (target 40-60%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L6 no-ability 67% is too easy for the legacy band (35-65%).

### Difficulty modes — The Fortress

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/100/88/25/88/38/38 | L7 25% | freeze-ray 50% on L9 | - | 38/40 |
| Normal | 100/100/100/100/100/75/63/63/0/50 | L9 0% | freeze-ray 75% on L9 | - | 40/40 |
| Hard | 100/100/100/100/100/88/25/50/25/0 | L10 0% | freeze-ray 50% on L9 | - | 40/40 |
| Nightmare | 100/100/100/100/100/100/50/38/13/25 | L9 13% | freeze-ray 38% on L9 | - | 39/40 |

### Full runs — The Fortress (authored, random picks)

40 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **40/40 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 40 | 40 | 100% | - |
| 2 | 40 | 40 | 100% | - |
| 3 | 40 | 40 | 100% | - |
| 4 | 40 | 40 | 100% | - |
| 5 | 40 | 40 | 100% | - |
| 6 | 40 | 40 | 100% | - |
| 7 | 40 | 40 | 100% | - |
| 8 | 40 | 40 | 100% | - |
| 9 | 40 | 40 | 100% | - |
| 10 | 40 | 40 | 100% | - |

Most-picked cards: surge 44, queen-pulse 43, knight-hop 35, freeze-ray 30, magnet 25, bishop-step 19, squad 11, rabies-dart 11.

## Stonework (`revenge-5`) — CANDIDATE

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 24 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 1.8 | - |
| 2 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.8 | - |
| 3 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 4 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | aegis 100% | - | - | 5 | - |
| 5 | 75-100% | **79%** (c1,m4) | 3 tied 100% | bishop-step 92% | rewind 67% | - | 11 | 7.8 | - |
| 6 | 35-65% | **100%** **too easy** | 5 tied 100% | bishop-step 100% | boulder 92% | - | 11 | 5.4 | none no6, 5/5 finishers proven |
| 7 | 40-70% | **25%** (c6,m12) **too hard** | 2 tied 100% | bishop-step 92% | rewind 0% | - | 12 | 13.5 | none no6, 3/5 finishers proven |
| 8 | 35-65% | **100%** **too easy** | 5 tied 100% | bishop-step 100% | squad 63% | - | 11 | 8.8 | none W6, 5/5 finishers proven |
| 9 | 15-45% | **8%** (c19,m3) **too hard** | surge 96% | knight-hop 13% **low** | rewind 0% | - | 12 | 4.7 | none no6, 0/5 finishers proven |
| 10 | 15-45% | **0%** (c4,m20) **IMPOSSIBLE** | 5 tied 0% | bishop-step 0% **low** | aegis 0% | 20 | 12 | 14.9 | none no6, 0/5 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-step | bodyguard | boulder | convert | decoy | drones | freeze-ray | knight-hop | magnet | poison-dart | queen-pulse | rabies-dart | rewind | smoke | squad | surge |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 79% | 100% | 100% | 92% | 96% | 96% | 83% | 100% | 100% | 100% | 100% | 96% | 100% | 92% | 100% | 67% | 100% | 88% | 100% |
| 6 | 100% | 100% | 100% | 100% | 100% | 92% | 92% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 7 | 25% | 100% | 100% | 92% | 88% | 79% | 96% | 100% | 100% | 96% | 92% | 58% | 100% | 100% | 100% | 0% | 100% | 96% | 100% |
| 8 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 63% | 100% |
| 9 | 8% | 88% | 92% | **38%** | 63% | 17% | 96% | 83% | 96% | **17%** | **13%** | 4% | 29% | 92% | 33% | 0% | 79% | 29% | 96% |
| 10 | 0% | 0% | 0% | **0%** | 0% | 0% | 0% | 0% | 0% | **0%** | **0%** | 0% | 0% | **0%** | 0% | 0% | 0% | 0% | **0%** s20 |

**Verdict:** HOLD 
- L10: IMPOSSIBLE — 0% with every loadout (19 tried), stall/move-limit 69%, solver: no line, app fail-safe would fire ("No way through")
- too hard — new player clears 0% on Normal (target 40-60%)
- beginners walled — new player clears only 0% on Rookie (need 70%+)
- L9 knight-hop only 13% (every finisher must be at least 80%)
- L10 bishop-step only 0% (every finisher must be at least 80%)
- L10 has 20 stalls (king unreachable)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L6 no-ability 100% is too easy for the legacy band (35-65%); L7 no-ability 25% is too hard for the legacy band (40-70%); L8 no-ability 100% is too easy for the legacy band (35-65%); L9 no-ability 8% is too hard for the legacy band (15-45%); L10 no-ability 0% is too hard for the legacy band (15-45%).

### Difficulty modes — Stonework

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/88/75/0/100/13/0 | L7 0% | bishop-step 0% on L10 | - | 0/40 |
| Normal | 100/100/100/100/63/75/13/100/0/0 | L9 0% | freeze-ray 0% on L9 | - | 0/40 |
| Hard | 100/100/100/100/88/38/0/100/13/0 | L7 0% | bishop-step 0% on L10 | - | 0/40 |
| Nightmare | 100/100/100/100/88/63/25/100/13/0 | L10 0% | bishop-step 0% on L10 | - | 0/40 |

### Full runs — Stonework (authored, random picks)

40 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **0/40 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 40 | 40 | 100% | - |
| 2 | 40 | 40 | 100% | - |
| 3 | 40 | 40 | 100% | - |
| 4 | 40 | 40 | 100% | - |
| 5 | 40 | 36 | 90% | captured 3, move-limit 1 |
| 6 | 36 | 36 | 100% | - |
| 7 | 36 | 36 | 100% | - |
| 8 | 36 | 36 | 100% | - |
| 9 | 36 | 31 | 86% | dead-end 1, move-limit 4 |
| 10 | 31 | 0 | 0% | dead-end 8, stall 9, move-limit 13, captured 1 |

Most-picked cards: surge 41, queen-pulse 39, knight-hop 35, bishop-step 31, freeze-ray 28, magnet 24, squad 10, rabies-dart 8.

## Biggest movers vs last night

No previous night on disk — nothing to compare. Tomorrow this section lights up.

## What makes a level hard (feature findings)

250 level snapshots (every level × authored + each difficulty mode, across all runs). Features are counted from the starting board — total enemies, hunters vs marchers, keys on the king's lines, pen size, move budget, and so on.

**Plain-English splits (no-ability win %):**

- Levels with 2+ empty squares on the king's lines average **71 points higher** no-ability win than the rest (71% vs 0%, 245 vs 5 snapshots).
- Levels with 2+ safe squares on the king's lines average **71 points higher** no-ability win than the rest (71% vs 0%, 245 vs 5 snapshots).
- Levels with 1+ open sides of the pen average **71 points higher** no-ability win than the rest (71% vs 0%, 245 vs 5 snapshots).
- Levels with 30+ rook moves to the king average **71 points lower** no-ability win than the rest (0% vs 71%, 5 vs 245 snapshots).
- Levels with 6+ budget slack (moves minus distance to king) average **71 points higher** no-ability win than the rest (71% vs 0%, 245 vs 5 snapshots).
- Levels with 15+ total enemies average **69 points lower** no-ability win than the rest (2% vs 71%, 5 vs 245 snapshots).

**Same, for the weakest finisher's win % (the safety net):**

- 2+ empty squares on the king's lines: finisher floor **91 points higher** (91% vs 0%).
- 2+ safe squares on the king's lines: finisher floor **91 points higher** (91% vs 0%).
- 1+ open sides of the pen: finisher floor **91 points higher** (91% vs 0%).
- 30+ rook moves to the king: finisher floor **91 points lower** (0% vs 91%).

**Strongest single correlations:**

| Feature | vs no-ability | vs finisher floor | High-quartile avg (none) | Low-quartile avg (none) |
|---|---|---|---|---|
| total material | -0.84 | -0.50 | 26% | 100% |
| hunter power (3 per minor, 9 per queen) | -0.79 | -0.45 | 29% | 95% |
| hunters (non-pawn pieces that chase Rookie) | -0.77 | -0.47 | 30% | 95% |
| squares under enemy fire | -0.75 | -0.42 | 34% | 100% |
| total enemies | -0.75 | -0.50 | 33% | 99% |
| queens | -0.75 | -0.39 | 36% | 86% |
| approach squares under fire (ranks 2-5) | -0.73 | -0.36 | 40% | 100% |
| budget slack (moves minus distance to king) | 0.66 | 0.49 | 100% | 58% |
| move budget | 0.62 | 0.29 | 100% | 64% |
| knights + bishops | -0.61 | -0.43 | 40% | 97% |

Reading: −1 means "more of this, harder level"; +1 means "more of this, easier". Anything past ±0.5 is worth believing at this sample size.

**All features together (ridge regression, no-ability %):** fit R² 0.85 on 250 snapshots, held-out R² 0.86 on 50.

| Feature | Points per +1 unit | Points per +1 std dev |
|---|---|---|
| approach squares under fire (ranks 2-5) | +3.6 | +27 |
| squares under enemy fire | -1.8 | -21 |
| safe squares on the king's lines | -6.8 | -10 |
| empty squares on the king's lines | +6.2 | +9 |
| guards next to the king | +7.4 | +8 |
| walls | +2.6 | +8 |

With this few snapshots the coefficients are directional, not gospel. They firm up as more runs enter the pool.

## Humans vs bot

Human runs since 2026-07-31 (disk-only). "Cleared" is the share of human runs that got past the level; the bot column is the random-pick full-run clear rate on the authored level.

**revenge-1** — 19 runs, 9 won.

| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |
|---|---|---|---|---|---|
| 1 | 19 | 19 | 100% | 100% | 0 |
| 2 | 19 | 19 | 100% | 100% | 0 |
| 3 | 19 | 19 | 100% | 100% | 0 |
| 4 | 19 | 19 | 100% | 100% | 0 |
| 5 | 19 | 14 | 74% | 100% | -26 |
| 6 | 14 | 14 | 100% | 100% | 0 |
| 7 | 14 | 14 | 100% | 100% | 0 |
| 8 | 14 | 9 | 64% | 100% | -36 |
| 9 | 9 | 9 | 100% | 100% | 0 |
| 10 | 9 | 9 | 100% | 98% | +2 |

Where humans fall well below the bot on a level the bot clears ability-free, the level is probably reading badly (unclear key, hidden hunter) rather than being tight. Caveat: traces written by a dev server (`data/run-playtest/human-traces/`) also include games the parity driver played through the real app — those are bot games wearing a human label.

## Experiments run tonight

Each one takes a level, makes ONE change, and replays the cell at realistic tier (40 trials). Predicted vs actual tells us whether the model understands the level.

| Run | L | Change | Loadout | Baseline | Predicted | Actual | Verdict | Prediction from |
|---|---|---|---|---|---|---|---|---|
| revenge-1 | 7 | budget +2 | none | 38% | 46% | **53%** | confirmed | mode-slope |
| revenge-1 | 10 | remove bishop g4 | freeze-ray | 80% | 81% | **90%** | confirmed | regression |
| revenge-1 | 5 | add knight d3 | none | 80% | 73% | **78%** | confirmed | regression |
| revenge-3 | 8 | budget +2 | none | 21% | 23% | **18%** | confirmed | mode-slope |
| revenge-3 | 10 | remove knight g5 | knight-hop | 92% | 93% | **100%** | confirmed | regression |
| revenge-4 | 6 | budget -2 | none | 67% | 57% | **35%** | falsified | mode-slope |
| revenge-4 | 9 | remove queen c4 | knight-hop | 83% | 86% | **93%** | confirmed | regression |

- L7 no-ability is 38%, too hard for its band (40-70%). The move budget is the cleanest knob.
- freeze-ray is the weakest finisher anywhere (80% on L10). The bishop on g4 is the hunter closest to the king.
- L5 is the softest late level at 80% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is.
- L8 no-ability is 21%, too hard for its band (35-65%). The move budget is the cleanest knob.
- knight-hop is the weakest finisher anywhere (92% on L10). The knight on g5 is the hunter closest to the king.
- L6 no-ability is 67%, too easy for its band (35-65%). The move budget is the cleanest knob.
- knight-hop is the weakest finisher anywhere (83% on L9). The queen on c4 is the hunter closest to the king.

## Top 3 hypotheses for tonight

1. **L7: raise the move budget by 2 → no-ability win goes 38% → about 46%.** L7 no-ability is 38%, too hard for its band (40-70%). The move budget is the cleanest knob. Tested tonight: actual 53% (confirmed).
2. **L10: remove the bishop on g4 → freeze-ray win goes 80% → about 81%.** freeze-ray is the weakest finisher anywhere (80% on L10). The bishop on g4 is the hunter closest to the king. Tested tonight: actual 90% (confirmed).
3. **L5: add a knight on d3 → no-ability win goes 80% → about 73%.** L5 is the softest late level at 80% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is. Tested tonight: actual 78% (confirmed).

These are measurements, not changes — nothing in `lib/run/runs.ts` was touched. A confirmed hypothesis is a tweak worth making by hand.

## Candidate runs

| Run | Recommendation | New player, Normal | New player, Rookie | Veteran, Normal | Finisher floor | Stalls | No-ability curve | Why |
|---|---|---|---|---|---|---|---|---|
| revenge-2 | **HOLD** | 100% | 100% | 100% | 38% | 0 | 100/100/100/100/100/79/54/46/33/8 | TOO EASY — a new player clears 100% of runs on Normal (target 40-60%); L10 freeze-ray only 38% (every finisher must be at least 80%) |
| revenge-3 | **HOLD** | 100% | 100% | 95% | 92% | 0 | 100/100/100/100/100/46/38/21/54/29 | TOO EASY — a new player clears 100% of runs on Normal (target 40-60%) |
| revenge-4 | **HOLD** | 100% | 100% | 100% | 83% | 0 | 100/100/100/100/96/67/54/42/21/33 | TOO EASY — a new player clears 100% of runs on Normal (target 40-60%) |
| revenge-5 | **HOLD** | 0% | 0% | 0% | 0% | 20 | 100/100/100/100/79/100/25/100/8/0 | L10: IMPOSSIBLE — 0% with every loadout (19 tried), stall/move-limit 69%, solver: no line, app fail-safe would fire ("No way through"); too hard — new player clears 0% on Normal (target 40-60%); beginners walled — new player clears only 0% on Rookie (need 70%+) |

## Solver — forced captures on the late levels

AND-OR search, depth 6, 120,000 nodes, worst case over every start file. W4 = forced win in 4 moves; no6 = no forced line found within the depth (not "impossible" — the bot's win % is the practical answer).

**revenge-1**

| L | none | surge | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bodyguard | boulder | convert | decoy | drones | magnet | poison-dart | rabies-dart | rewind | smoke | squad |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W5 | W3 | W3 | W3 | W4 | W3 | W5 | no6 | W4 | W4 | W3 | no6 | W5 | no6 | no6 | no6 | no6 |
| 7 | no6 | W3 | W4 | W3 | W4 | W4 | W3 | W4 | W4 | no6 | W4 | W3 | W2 | W5 | W4 | W2 | no6 | no6 | no6 |
| 8 | no6 | W6 | no6 | no6 | W6 | W6 | W6 | no6 | no6 | no6 | W6 | W3 | W6 | no6 | no6 | no6 | no6 | no6 | no6 |
| 9 | no6 | W4 | W6 | W5 | W5 | W5 | W5 | W4 | W6 | no6 | W6 | W4 | W3 | no6 | W5 | no6 | no6 | no6 | no6 |
| 10 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 |

**revenge-2**

| L | none | surge | freeze-ray | knight-hop | bishop-step | queen-pulse |
|---|---|---|---|---|---|---|
| 6 | W6 | W4 | W4 | W3 | W4 | W4 |
| 7 | W6 | W3 | W4 | W3 | W4 | W4 |
| 8 | W6 | W4 | W4 | W3 | W4 | W4 |
| 9 | no6 | W6 | W6 | W5 | W4 | W4 |
| 10 | no6 | no6 | no6 | no6 | no6 | no6 |

**revenge-3**

| L | none | surge | freeze-ray | knight-hop | bishop-step | queen-pulse |
|---|---|---|---|---|---|---|
| 6 | no6 | W3 | W4 | W3 | W3 | W3 |
| 7 | no6 | W3 | W6 | W5 | W3 | W3 |
| 8 | no6 | W3 | W4 | W3 | W4 | W4 |
| 9 | no6 | W3 | W4 | W3 | W5 | W5 |
| 10 | no6 | W4 | W4 | W6 | W3 | W3 |

**revenge-4**

| L | none | surge | freeze-ray | knight-hop | bishop-step | queen-pulse |
|---|---|---|---|---|---|---|
| 6 | no6 | W3 | W4 | W3 | W4 | W4 |
| 7 | W6 | W3 | W3 | W3 | W3 | W3 |
| 8 | no6 | W4 | W4 | W4 | W4 | W4 |
| 9 | no6 | W6 | no6 | no6 | no6 | no6 |
| 10 | no6 | no6 | no6 | no6 | no6 | no6 |

**revenge-5**

| L | none | surge | freeze-ray | knight-hop | bishop-step | queen-pulse |
|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W4 | W4 | W3 | W3 |
| 7 | no6 | W5 | no6 | no6 | W3 | W3 |
| 8 | W6 | W6 | W5 | W5 | W6 | W6 |
| 9 | no6 | no6 | no6 | no6 | no6 | no6 |
| 10 | no6 | no6 | no6 | no6 | no6 | no6 |

## How to read this

- **No ability** = the T5 MCTS bot with no powers, offers dismissed. It is a floor for a good player, not a beginner's number.
- **Finishers** = surge, freeze-ray, knight-hop, bishop-step, queen-pulse — the cards that take the king directly. Every offer slate carries at least two, so the worst finisher is the run's safety net.
- **Stall** = 300 turns with the king alive. Always a bug or an unreachable pen; the target is zero.
- **Difficulty** = the new-player sim (3 starters, forced offers, mode retries): 40-60% full-run clear on Normal is the target, 70%+ on Rookie, over 85% on Normal is too easy. The old no-ability band (100/100/100/100/90/50/55/50/30/30 ±15) is shown per level for reference only.
- Start files are random per game, so a single cell wobbles ±10 between nights at 40 trials (more on the lighter candidate passes). Trust clusters and repeated nights.

**How to read these numbers** (the harness plays the exact engine the app does — verified ply-for-ply, see `docs/revenge-parity.md` — but it skips five app-side rules):

1. **Free offers are not skippable in the app.** On L1, L3, L6 and L9 a real player MUST take a card before moving; the harness dismisses it. So the "none" and single-ability cells on those levels UNDERSTATE a real player's kit — the random-pick full runs are the honest number there.
2. **Retries.** The app gives Rookie unlimited, Normal 3, Hard 1, Nightmare 0 retries per level, each with a fresh start file and seed. Every full-run clear rate here is a LOWER bound on what a player with retries sees.
3. **Offer pool.** The app rolls only the player's unlocked abilities (a new player has Knight Hop, Surge and Freeze Ray; Drones is retired). The harness draws from all 180 — so full-run pick mixes are wider than a new player's.
4. **Default difficulty.** A fresh profile plays Rookie; the main table is Normal. The four modes are swept explicitly above — read the Rookie row for the new-player experience.
5. **"Out of moves" vs "No way through".** The app's solver ends a proven-dead level early; the harness plays on to the move limit. Same loss, two labels — counted together as m.

Caveats tonight:
- Digest re-rendered from raw JSON on 2026-08-30.

Reproduce: `npx tsx scripts/run-playtest/revenge-nightly.ts` (add `--quick` for a 2-minute smoke). Raw JSON: `data/run-playtest/revenge/raw/2026-08-30/`.
