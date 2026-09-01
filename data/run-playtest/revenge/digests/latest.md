# Rookie's Revenge — Morning Report

**Date:** 2026-09-01 · **Mode:** quick smoke (few trials — numbers are rough) · **Wall time:** 1.7 min
**Bot:** T5 MCTS · **Live run:** 4 trials per cell at realistic tiers, 3 per difficulty mode, 4 full runs per mode · **Experiments:** 5 trials · candidates run lighter (see each run)

## Headline

Rookie's Revenge: a new player (3 starters) clears the run 100% of the time on Normal and 100% on Rookie — TOO EASY (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 100% / 100%. Powers carry you by +35 points (no-ability averages 65%, finishers 100%). Weak finishers: freeze-ray 75% on L10. Zero stalls. Pawn Storm: a new player (3 starters) clears the run 80% of the time on Normal and 98% on Rookie — too easy (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 93% / 100%. Powers carry you by +27 points (no-ability averages 71%, finishers 97%). Weak finishers: freeze-ray 28% on L10. 1 stall (king unreachable — look at this first). The Royal Guard: a new player (3 starters) clears the run 98% of the time on Normal and 100% on Rookie — TOO EASY (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 95% / 100%. Powers carry you by +34 points (no-ability averages 64%, finishers 98%). Weak finishers: freeze-ray 75% on L8. Zero stalls. The Fortress: a new player (3 starters) clears the run 95% of the time on Normal and 100% on Rookie — TOO EASY (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 95% / 100%. Powers carry you by +26 points (no-ability averages 73%, finishers 98%). Zero stalls. Stonework: a new player (3 starters) clears the run 100% of the time on Normal and 100% on Rookie — TOO EASY (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 100% / 100%. Powers carry you by +23 points (no-ability averages 77%, finishers 100%). Zero stalls. Two Keys: a new player (3 starters) clears the run 100% of the time on Normal and 100% on Rookie — TOO EASY (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 100% / 100%. Powers carry you by +28 points (no-ability averages 72%, finishers 99%). Zero stalls. Versus last night: 207 cells moved more than 15 points since 2026-08-30 (biggest: L10 aegis 0→100% [realistic]; L10 become-king 0→100% [realistic]); 1 NEW stall; L8 left its band (35→0%, too hard), L9 left its band (25→0%, too hard). Ran 2 experiments on level tweaks: 0 predictions confirmed, 1 falsified. No candidate runs in the queue tonight. 34 human runs on revenge-1 since 2026-08-02, 14 won.

## Run difficulty and ability tiers

Difficulty is measured on the player who actually exists: a **new player** with only the 3 starters (knight-hop, surge, freeze-ray), taking the offers the app forces (never dismissing), with the mode's retries (Rookie unlimited, Normal 3). Target: 40-60% full-run clear on Normal, 70%+ on Rookie; over 85% on Normal is TOO EASY.

**Rookie's Revenge** (`revenge-1`)

- **New player clears this run 100% of the time on Normal / 100% on Rookie — TOO EASY.** (3 runs per mode; retries used: Normal 7, Rookie 4.)
- Veteran (all 5 abilities): 100% on Normal / 100% on Rookie.
- Powers carry you by **+35 points**: no-ability averages 65% across L1-L10, the five finishers average 100%. Hard levels without powers (no-ability under 60%): L6 50%, L8 0%, L9 0%, L10 25%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (3/3) | 0 | 100% (3/3) | 0 | 100% |
| 2 | 100% (3/3) | 0 | 100% (3/3) | 0 | 100% |
| 3 | 100% (3/3) | 0 | 100% (3/3) | 0 | 100% |
| 4 | 100% (3/3) | 0 | 100% (3/3) | 0 | 100% |
| 5 | 100% (3/3) | 0 | 100% (3/3) | 0 | 100% |
| 6 | 100% (3/3) | 0 | 100% (3/3) | 0 | 100% |
| 7 | 100% (3/3) | 0 | 100% (3/3) | 0 | 100% |
| 8 | 100% (3/3) | 4 | 100% (3/3) | 0 | 100% |
| 9 | 100% (3/3) | 0 | 100% (3/3) | 0 | 100% |
| 10 | 100% (3/3) | 3 | 100% (3/3) | 4 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 5 levels where no-ability is under 100% (L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | bishop-step | 100% | +70 | L6 100% | 100% |
| S | knight-hop | 100% | +70 | L6 100% | 100% |
| S | queen-pulse | 100% | +70 | L6 100% | 100% |
| S | surge | 100% | +70 | L6 100% | 100% |
| S | freeze-ray | 95% | +65 | L10 75% | 100% |

**Pawn Storm** (`revenge-2`)

- **New player clears this run 80% of the time on Normal / 98% on Rookie — too easy.** (40 runs per mode; retries used: Normal 46, Rookie 12.)
- Veteran (all 17 abilities): 93% on Normal / 100% on Rookie.
- Powers carry you by **+27 points**: no-ability averages 71% across L1-L10, the five finishers average 97%. Hard levels without powers (no-ability under 60%): L8 55%, L9 38%, L10 3%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 2 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 3 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 4 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 5 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 6 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 7 | 100% (40/40) | 1 | 100% (40/40) | 0 | 100% |
| 8 | 100% (40/40) | 5 | 100% (40/40) | 0 | 100% |
| 9 | 100% (40/40) | 0 | 100% (40/40) | 1 | 100% |
| 10 | 80% (32/40) | 48 | 98% (39/40) | 12 | 93% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 7 levels where no-ability is under 100% (L4, L5, L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +42 | L4 100% | 99% |
| S | become-king | 100% | +42 | L4 100% | 98% |
| S | decoy | 100% | +42 | L4 100% | 98% |
| S | queen-pulse | 100% | +42 | L4 100% | 97% |
| S | rabies-dart | 100% | +42 | L4 100% | 97% |
| S | convert | 99% | +41 | L10 95% | 100% |
| S | knight-hop | 99% | +41 | L10 95% | 99% |
| S | poison-dart | 99% | +41 | L10 95% | 99% |
| S | squad † | 98% | +40 | L6 95% | 0% |
| S | summon-knight | 98% | +40 | L10 88% | 94% |
| S | bishop-step | 97% | +39 | L10 78% | 100% |
| A | bodyguard | 94% | +36 | L10 57% | 96% |
| A | boulder | 88% | +30 | L10 28% | 99% |
| A | freeze-ray | 88% | +30 | L10 28% | 97% |
| A | smoke | 87% | +30 | L10 43% | 88% |
| C | magnet | 67% | +10 | L10 23% | 51% |
| C | rewind † | 57% | -1 | L10 8% | 0% |

† squad, rewind: bot never casts this (cast rate under 10%) — floor, not a verdict.

**The Royal Guard** (`revenge-3`)

- **New player clears this run 98% of the time on Normal / 100% on Rookie — TOO EASY.** (40 runs per mode; retries used: Normal 41, Rookie 3.)
- Veteran (all 17 abilities): 95% on Normal / 100% on Rookie.
- Powers carry you by **+34 points**: no-ability averages 64% across L1-L10, the five finishers average 98%. Hard levels without powers (no-ability under 60%): L6 40%, L7 53%, L8 8%, L9 20%, L10 28%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 2 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 3 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 4 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 5 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 6 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 7 | 100% (40/40) | 7 | 100% (40/40) | 1 | 100% |
| 8 | 98% (39/40) | 26 | 100% (40/40) | 1 | 95% |
| 9 | 100% (39/39) | 0 | 100% (40/40) | 0 | 100% |
| 10 | 100% (39/39) | 9 | 100% (40/40) | 1 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 6 levels where no-ability is under 100% (L5, L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | become-king | 100% | +61 | L5 100% | 100% |
| S | decoy | 100% | +61 | L5 100% | 99% |
| S | queen-pulse | 100% | +61 | L5 100% | 99% |
| S | rabies-dart | 100% | +61 | L5 100% | 99% |
| S | bishop-step | 99% | +59 | L8 93% | 99% |
| S | aegis | 98% | +59 | L9 90% | 98% |
| S | knight-hop | 96% | +56 | L7 90% | 98% |
| A | convert | 95% | +55 | L8 90% | 100% |
| A | poison-dart | 95% | +55 | L7 85% | 97% |
| A | bodyguard | 94% | +55 | L8 83% | 97% |
| A | summon-knight | 94% | +54 | L8 75% | 96% |
| A | freeze-ray | 93% | +53 | L8 75% | 94% |
| A | smoke | 90% | +51 | L6 73% | 85% |
| A | squad † | 90% | +51 | L8 78% | 0% |
| A | boulder | 86% | +47 | L8 70% | 87% |
| C | magnet | 64% | +25 | L8 33% | 52% |
| D | rewind † | 43% | +3 | L8 15% | 0% |

† squad, rewind: bot never casts this (cast rate under 10%) — floor, not a verdict.

**The Fortress** (`revenge-4`)

- **New player clears this run 95% of the time on Normal / 100% on Rookie — TOO EASY.** (40 runs per mode; retries used: Normal 32, Rookie 10.)
- Veteran (all 17 abilities): 95% on Normal / 100% on Rookie.
- Powers carry you by **+26 points**: no-ability averages 73% across L1-L10, the five finishers average 98%. Hard levels without powers (no-ability under 60%): L6 55%, L7 53%, L8 53%, L9 38%, L10 33%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 2 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 3 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 4 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 5 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 6 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 7 | 100% (40/40) | 1 | 100% (40/40) | 0 | 100% |
| 8 | 98% (39/40) | 8 | 100% (40/40) | 2 | 100% |
| 9 | 100% (39/39) | 6 | 100% (40/40) | 3 | 100% |
| 10 | 97% (38/39) | 19 | 100% (40/40) | 5 | 95% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 6 levels where no-ability is under 100% (L5, L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | become-king | 100% | +46 | L5 100% | 98% |
| S | decoy | 100% | +46 | L5 100% | 100% |
| S | rabies-dart | 100% | +46 | L5 100% | 100% |
| S | aegis | 99% | +45 | L9 98% | 97% |
| S | bishop-step | 99% | +45 | L9 95% | 88% |
| S | queen-pulse | 99% | +45 | L10 93% | 94% |
| S | convert | 97% | +43 | L10 88% | 100% |
| S | freeze-ray | 97% | +43 | L9 83% | 100% |
| S | smoke | 96% | +42 | L9 78% | 90% |
| S | poison-dart | 96% | +41 | L10 80% | 99% |
| S | knight-hop | 95% | +41 | L9 85% | 98% |
| A | bodyguard | 91% | +37 | L10 55% | 98% |
| A | summon-knight | 88% | +34 | L10 65% | 92% |
| A | boulder | 87% | +33 | L9 63% | 95% |
| A | squad † | 86% | +32 | L9 48% | 0% |
| B | magnet | 83% | +29 | L9 60% | 63% |
| C | rewind † | 56% | +2 | L9 40% | 0% |

† squad, rewind: bot never casts this (cast rate under 10%) — floor, not a verdict.

**Stonework** (`revenge-5`)

- **New player clears this run 100% of the time on Normal / 100% on Rookie — TOO EASY.** (40 runs per mode; retries used: Normal 20, Rookie 1.)
- Veteran (all 17 abilities): 100% on Normal / 100% on Rookie.
- Powers carry you by **+23 points**: no-ability averages 77% across L1-L10, the five finishers average 100%. Hard levels without powers (no-ability under 60%): L6 53%, L7 50%, L9 38%, L10 30%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 2 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 3 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 4 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 5 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 6 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 7 | 100% (40/40) | 3 | 100% (40/40) | 0 | 100% |
| 8 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 9 | 100% (40/40) | 1 | 100% (40/40) | 0 | 100% |
| 10 | 100% (40/40) | 16 | 100% (40/40) | 1 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 4 levels where no-ability is under 100% (L6, L7, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +57 | L6 100% | 97% |
| S | become-king | 100% | +57 | L6 100% | 96% |
| S | bishop-step | 100% | +57 | L6 100% | 98% |
| S | bodyguard | 100% | +57 | L6 98% | 90% |
| S | decoy | 100% | +57 | L6 100% | 100% |
| S | knight-hop | 100% | +57 | L6 100% | 98% |
| S | queen-pulse | 100% | +57 | L6 100% | 98% |
| S | rabies-dart | 100% | +57 | L6 100% | 100% |
| S | freeze-ray | 99% | +56 | L10 95% | 99% |
| S | convert | 98% | +55 | L6 95% | 100% |
| S | summon-knight | 98% | +55 | L6 95% | 92% |
| S | smoke | 97% | +54 | L7 95% | 91% |
| S | poison-dart | 95% | +53 | L6 83% | 94% |
| A | squad † | 88% | +45 | L7 75% | 0% |
| A | boulder | 87% | +45 | L9 75% | 89% |
| A | magnet | 86% | +43 | L7 68% | 68% |
| D | rewind † | 38% | -5 | L10 25% | 0% |

† squad, rewind: bot never casts this (cast rate under 10%) — floor, not a verdict.

**Two Keys** (`revenge-6`)

- **New player clears this run 100% of the time on Normal / 100% on Rookie — TOO EASY.** (40 runs per mode; retries used: Normal 14, Rookie 2.)
- Veteran (all 17 abilities): 100% on Normal / 100% on Rookie.
- Powers carry you by **+28 points**: no-ability averages 72% across L1-L10, the five finishers average 99%. Hard levels without powers (no-ability under 60%): L8 38%, L9 28%, L10 13%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 2 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 3 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 4 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 5 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 6 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 7 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 8 | 100% (40/40) | 6 | 100% (40/40) | 1 | 100% |
| 9 | 100% (40/40) | 0 | 100% (40/40) | 0 | 100% |
| 10 | 100% (40/40) | 8 | 100% (40/40) | 1 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 5 levels where no-ability is under 100% (L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +56 | L6 100% | 100% |
| S | become-king | 100% | +56 | L6 100% | 99% |
| S | bishop-step | 100% | +56 | L6 100% | 96% |
| S | decoy | 100% | +56 | L6 100% | 100% |
| S | queen-pulse | 100% | +56 | L6 100% | 98% |
| S | rabies-dart | 100% | +56 | L6 100% | 100% |
| S | bodyguard | 99% | +55 | L10 95% | 99% |
| S | knight-hop | 99% | +55 | L8 98% | 100% |
| S | convert | 98% | +54 | L6 93% | 100% |
| S | smoke | 98% | +54 | L8 90% | 97% |
| S | summon-knight | 98% | +54 | L10 95% | 100% |
| S | freeze-ray | 97% | +53 | L10 90% | 97% |
| S | poison-dart | 96% | +52 | L10 83% | 98% |
| S | squad † | 95% | +51 | L10 80% | 0% |
| B | boulder | 85% | +41 | L8 73% | 92% |
| B | magnet | 82% | +38 | L6 75% | 65% |
| C | rewind † | 52% | +8 | L10 30% | 0% |

† squad, rewind: bot never casts this (cast rate under 10%) — floor, not a verdict.

## Rookie's Revenge (`revenge-1`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 4 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | bishop-step 100% | - | - | 3 | - |
| 2 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | bishop-step 100% | - | - | 3 | - |
| 3 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | bishop-step 100% | - | - | 2.8 | - |
| 4 | 85-100% | **100%** | 5 tied 100% | bishop-step 100% | bishop-step 100% | - | - | 2.8 | - |
| 5 | 75-100% | **100%** | 5 tied 100% | bishop-step 100% | bishop-step 100% | - | 12 | 8 | - |
| 6 | 35-65% | **50%** (m2) | 5 tied 100% | bishop-step 100% | bishop-step 100% | - | 12 | 10.5 | - |
| 7 | 40-70% | **75%** (c1) **too easy** | 5 tied 100% | bishop-step 100% | bishop-step 100% | - | 12 | 9.3 | - |
| 8 | 35-65% | **0%** (c1,m3) **too hard** | 5 tied 100% | bishop-step 100% | bishop-step 100% | - | 14 | 12.3 | - |
| 9 | 15-45% | **0%** (m4) **too hard** | 5 tied 100% | bishop-step 100% | bishop-step 100% | - | 14 | 14 | none no4, 1/5 finishers proven |
| 10 | 15-45% | **25%** (m3) | 4 tied 100% | freeze-ray 75% **low** | freeze-ray 75% | - | 18 | 18 | none no4, 0/5 finishers proven |

Every ability, win % at realistic tiers:

| L | none | bishop-step | freeze-ray | knight-hop | queen-pulse | surge |
|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 100% | 100% | 100% | 100% | 100% | 100% |
| 6 | 50% | 100% | 100% | 100% | 100% | 100% |
| 7 | 75% | 100% | 100% | 100% | 100% | 100% |
| 8 | 0% | 100% | 100% | 100% | 100% | 100% |
| 9 | 0% | 100% | 100% | 100% | 100% | 100% |
| 10 | 25% | 100% | **75%** | 100% | 100% | 100% |

**Verdict:** needs a look 
- TOO EASY — a new player clears 100% of runs on Normal (target 40-60%)
- L10 freeze-ray only 75% (every finisher must be at least 80%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L7 no-ability 75% is too easy for the legacy band (40-70%); L8 no-ability 0% is too hard for the legacy band (35-65%); L9 no-ability 0% is too hard for the legacy band (15-45%).

### Difficulty modes — Rookie's Revenge

T1 loadouts, no-ability + the five finishers, 3 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/100/67/100/67/67/33 | L10 33% | freeze-ray 67% on L6 | - | 3/4 |
| Normal | 100/100/100/100/100/67/67/33/33/33 | L8 33% | freeze-ray 67% on L6 | - | 4/4 |
| Hard | 100/100/100/100/67/67/33/67/0/33 | L9 0% | freeze-ray 67% on L10 | - | 3/4 |
| Nightmare | 100/100/100/100/67/100/67/67/33/33 | L9 33% | freeze-ray 0% on L10 | - | 3/4 |

### Full runs — Rookie's Revenge (authored, random picks)

4 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **3/4 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 4 | 4 | 100% | - |
| 2 | 4 | 4 | 100% | - |
| 3 | 4 | 4 | 100% | - |
| 4 | 4 | 4 | 100% | - |
| 5 | 4 | 4 | 100% | - |
| 6 | 4 | 3 | 75% | move-limit 1 |
| 7 | 3 | 3 | 100% | - |
| 8 | 3 | 3 | 100% | - |
| 9 | 3 | 3 | 100% | - |
| 10 | 3 | 3 | 100% | - |

Most-picked cards: bishop-step 6, queen-pulse 5, convert 4, magnet 3, boulder 3, summon-knight 2, squad 2, knight-hop 1.

## Pawn Storm (`revenge-2`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 40 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.7 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.8 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.8 | - |
| 4 | 85-100% | **98%** (s1) | 4 tied 100% | bishop-step 100% | aegis 100% | 1 | - | 12.9 | - |
| 5 | 75-100% | **88%** (m5) | 4 tied 100% | bishop-step 100% | rewind 95% | - | 12 | 6.8 | - |
| 6 | 35-65% | **60%** (c2,m14) | 4 tied 100% | bishop-step 100% | rewind 50% | - | 11 | 9 | none W6, 4/4 finishers proven |
| 7 | 40-70% | **63%** (c3,m12) | 4 tied 100% | bishop-step 100% | rewind 60% | - | 14 | 10.2 | none W6, 4/4 finishers proven |
| 8 | 35-65% | **55%** (c2,m16) | 4 tied 100% | bishop-step 100% | rewind 43% | - | 10 | 8 | none W6, 4/4 finishers proven |
| 9 | 15-45% | **38%** (c8,m17) | 3 tied 100% | freeze-ray 85% | rewind 45% | - | 16 | 12.6 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **3%** (c17,m22) **too hard** | queen-pulse 100% | freeze-ray 28% **low** | rewind 8% | - | 18 | 9.4 | none no6, 0/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-step | bodyguard | boulder | convert | decoy | freeze-ray | knight-hop | magnet | poison-dart | queen-pulse | rabies-dart | rewind | smoke | squad | summon-knight |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 98% s1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 88% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 98% | 100% | 100% | 100% | 95% | 100% | 100% | 100% |
| 6 | 60% | 100% | 100% | 100% | 100% | 100% | 98% | 100% | 100% | 100% | 53% | 100% | 100% | 100% | 50% | 98% | 95% | 100% |
| 7 | 63% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 75% | 100% | 100% | 100% | 60% | 100% | 100% | 100% |
| 8 | 55% | 100% | 100% | 100% | 100% | 90% | 98% | 100% | 100% | 100% | 63% | 100% | 100% | 100% | 43% | 83% | 100% | 100% |
| 9 | 38% | 100% | 100% | 100% | 100% | 95% | 100% | 100% | 85% | 100% | 60% | 100% | 100% | 100% | 45% | 88% | 95% | 100% |
| 10 | 3% | 100% | 100% | **78%** | 57% | 28% | 95% | 100% | **28%** | 95% | 23% | 95% | 100% | 100% | 8% | 43% | 95% | 88% |

**Verdict:** needs a look 
- too easy — new player clears 80% on Normal (target 40-60%)
- L4 has 1 stall (king unreachable)
- L10 freeze-ray only 28% (every finisher must be at least 80%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L10 no-ability 3% is too hard for the legacy band (15-45%).

### Difficulty modes — Pawn Storm

T1 loadouts, no-ability + the five finishers, 3 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/93/67/73/80/47/13 | L10 13% | freeze-ray 20% on L10 | - | 74/80 |
| Normal | 100/100/100/100/87/33/53/40/20/13 | L10 13% | freeze-ray 0% on L10 | - | 59/80 |
| Hard | 100/100/100/100/100/60/67/33/13/0 | L10 0% | surge 7% on L10 | - | 52/80 |
| Nightmare | 100/100/100/100/100/47/60/20/33/0 | L10 0% | freeze-ray 20% on L10 | - | 55/80 |

### Full runs — Pawn Storm (authored, random picks)

80 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **64/80 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 80 | 80 | 100% | - |
| 2 | 80 | 80 | 100% | - |
| 3 | 80 | 80 | 100% | - |
| 4 | 80 | 80 | 100% | - |
| 5 | 80 | 80 | 100% | - |
| 6 | 80 | 80 | 100% | - |
| 7 | 80 | 79 | 99% | move-limit 1 |
| 8 | 79 | 75 | 95% | move-limit 4 |
| 9 | 75 | 75 | 100% | - |
| 10 | 75 | 64 | 85% | move-limit 5, captured 6 |

Most-picked cards: bishop-step 126, queen-pulse 104, freeze-ray 80, knight-hop 77, bodyguard 50, aegis 26, decoy 18, rabies-dart 13.

## The Royal Guard (`revenge-3`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 40 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.7 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3.3 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 7.3 | - |
| 5 | 75-100% | **88%** (m5) | 4 tied 100% | bishop-step 100% | rewind 88% | - | 13 | 8.4 | - |
| 6 | 35-65% | **40%** (m24) | 3 tied 100% | freeze-ray 98% | rewind 33% | - | 14 | 12.8 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **53%** (c7,m12) | 3 tied 100% | knight-hop 90% | rewind 50% | - | 18 | 12.3 | none no6, 3/4 finishers proven |
| 8 | 35-65% | **8%** (c21,m16) **too hard** | queen-pulse 100% | freeze-ray 75% **low** | rewind 15% | - | 14 | 10 | none no6, 0/4 finishers proven |
| 9 | 15-45% | **20%** (c5,m27) | 2 tied 100% | freeze-ray 93% | rewind 40% | - | 14 | 13.1 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **28%** (c8,m21) | 2 tied 100% | freeze-ray 90% | rewind 30% | - | 19 | 15.5 | none no6, 3/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-step | bodyguard | boulder | convert | decoy | freeze-ray | knight-hop | magnet | poison-dart | queen-pulse | rabies-dart | rewind | smoke | squad | summon-knight |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 88% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 98% | 100% | 100% | 100% | 88% | 98% | 98% | 100% |
| 6 | 40% | 100% | 100% | 100% | 98% | 75% | 93% | 100% | 98% | 100% | 73% | 95% | 100% | 100% | 33% | 73% | 93% | 100% |
| 7 | 53% | 100% | 100% | 100% | 88% | 95% | 100% | 100% | 100% | 90% | 55% | 85% | 100% | 100% | 50% | 100% | 100% | 88% |
| 8 | 8% | 100% | 100% | 93% | 83% | 70% | 90% | 100% | **75%** | 90% | 33% | 95% | 100% | 100% | 15% | 98% | 78% | 75% |
| 9 | 20% | 90% | 100% | 98% | 100% | 93% | 95% | 100% | 93% | 100% | 50% | 100% | 100% | 100% | 40% | 83% | 83% | 100% |
| 10 | 28% | 98% | 100% | 100% | 95% | 83% | 90% | 100% | 90% | 95% | 75% | 93% | 100% | 100% | 30% | 88% | 90% | 98% |

**Verdict:** needs a look 
- TOO EASY — a new player clears 98% of runs on Normal (target 40-60%)
- L8 freeze-ray only 75% (every finisher must be at least 80%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L8 no-ability 8% is too hard for the legacy band (35-65%).

### Difficulty modes — The Royal Guard

T1 loadouts, no-ability + the five finishers, 3 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/93/47/47/27/40/40 | L8 27% | bishop-step 80% on L8 | - | 67/80 |
| Normal | 100/100/100/100/100/73/27/7/20/33 | L8 7% | freeze-ray 47% on L8 | - | 50/80 |
| Hard | 100/100/100/100/93/73/40/13/7/13 | L9 7% | freeze-ray 60% on L9 | - | 42/80 |
| Nightmare | 100/100/100/100/93/67/60/13/0/13 | L9 0% | freeze-ray 60% on L9 | - | 50/80 |

### Full runs — The Royal Guard (authored, random picks)

80 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **57/80 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 80 | 80 | 100% | - |
| 2 | 80 | 80 | 100% | - |
| 3 | 80 | 80 | 100% | - |
| 4 | 80 | 80 | 100% | - |
| 5 | 80 | 78 | 98% | move-limit 2 |
| 6 | 78 | 77 | 99% | move-limit 1 |
| 7 | 77 | 70 | 91% | dead-end 1, captured 6 |
| 8 | 70 | 59 | 84% | move-limit 8, captured 3 |
| 9 | 59 | 59 | 100% | - |
| 10 | 59 | 57 | 97% | captured 1, move-limit 1 |

Most-picked cards: knight-hop 106, bishop-step 90, freeze-ray 77, queen-pulse 76, rewind 32, poison-dart 26, bodyguard 24, aegis 18.

## The Fortress (`revenge-4`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 40 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.8 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3.4 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 4.9 | - |
| 5 | 75-100% | **93%** (m3) | 4 tied 100% | bishop-step 100% | rewind 88% | - | 14 | 8.6 | - |
| 6 | 35-65% | **55%** (m18) | 4 tied 100% | bishop-step 100% | rewind 63% | - | 11 | 9.5 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **53%** (c4,m15) | 4 tied 100% | bishop-step 100% | rewind 48% | - | 14 | 10.7 | none W6, 4/4 finishers proven |
| 8 | 35-65% | **53%** (m19) | 4 tied 100% | bishop-step 100% | rewind 57% | - | 10 | 8.5 | none no6, 4/4 finishers proven |
| 9 | 15-45% | **38%** (c7,m18) | queen-pulse 100% | freeze-ray 83% | rewind 40% | - | 17 | 12.6 | none no6, 0/4 finishers proven |
| 10 | 15-45% | **33%** (c9,m18) | 2 tied 98% | knight-hop 85% | rewind 40% | - | 14 | 10.3 | none no6, 0/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-step | bodyguard | boulder | convert | decoy | freeze-ray | knight-hop | magnet | poison-dart | queen-pulse | rabies-dart | rewind | smoke | squad | summon-knight |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 93% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 98% | 100% | 100% | 100% | 88% | 100% | 98% | 100% |
| 6 | 55% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 63% | 98% | 100% | 98% |
| 7 | 53% | 100% | 100% | 100% | 100% | 100% | 98% | 100% | 100% | 100% | 83% | 100% | 100% | 100% | 48% | 100% | 100% | 100% |
| 8 | 53% | 100% | 100% | 100% | 93% | 90% | 98% | 100% | 100% | 100% | 80% | 100% | 100% | 100% | 57% | 98% | 95% | 93% |
| 9 | 38% | 98% | 100% | 95% | 100% | 63% | 98% | 100% | 83% | 85% | 60% | 93% | 100% | 100% | 40% | 78% | 48% | 73% |
| 10 | 33% | 98% | 100% | 98% | 55% | 68% | 88% | 100% | 98% | 85% | 78% | 80% | 93% | 100% | 40% | 100% | 73% | 65% |

**Verdict:** needs a look 
- TOO EASY — a new player clears 95% of runs on Normal (target 40-60%)

### Difficulty modes — The Fortress

T1 loadouts, no-ability + the five finishers, 3 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/87/93/53/93/27/33 | L9 27% | freeze-ray 73% on L9 | - | 74/80 |
| Normal | 100/100/100/100/93/53/47/60/33/40 | L9 33% | freeze-ray 73% on L9 | - | 62/80 |
| Hard | 100/100/100/100/87/87/20/20/7/27 | L9 7% | freeze-ray 47% on L9 | - | 64/80 |
| Nightmare | 100/100/100/100/100/93/20/20/0/20 | L9 0% | knight-hop 47% on L9 | - | 62/80 |

### Full runs — The Fortress (authored, random picks)

80 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **66/80 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 80 | 80 | 100% | - |
| 2 | 80 | 80 | 100% | - |
| 3 | 80 | 80 | 100% | - |
| 4 | 80 | 80 | 100% | - |
| 5 | 80 | 80 | 100% | - |
| 6 | 80 | 80 | 100% | - |
| 7 | 80 | 80 | 100% | - |
| 8 | 80 | 76 | 95% | move-limit 4 |
| 9 | 76 | 75 | 99% | move-limit 1 |
| 10 | 75 | 66 | 88% | captured 5, move-limit 4 |

Most-picked cards: bishop-step 126, freeze-ray 94, queen-pulse 79, knight-hop 75, bodyguard 36, aegis 32, poison-dart 24, boulder 21.

## Stonework (`revenge-5`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 40 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 1.8 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 4.9 | - |
| 5 | 75-100% | **100%** | 4 tied 100% | bishop-step 100% | magnet 98% | - | 11 | 4.8 | - |
| 6 | 35-65% | **53%** (c3,m16) | 4 tied 100% | bishop-step 100% | rewind 55% | - | 11 | 8.3 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **50%** (c1,m19) | 4 tied 100% | bishop-step 100% | rewind 30% | - | 12 | 10.4 | none no6, 4/4 finishers proven |
| 8 | 35-65% | **100%** **too easy** | 4 tied 100% | bishop-step 100% | squad 33% | - | 11 | 6 | none W6, 4/4 finishers proven |
| 9 | 15-45% | **38%** (c1,m24) | 4 tied 100% | bishop-step 100% | rewind 40% | - | 15 | 12.5 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **30%** (c13,m15) | 3 tied 100% | freeze-ray 95% | rewind 25% | - | 21 | 15.2 | none no6, 4/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-step | bodyguard | boulder | convert | decoy | freeze-ray | knight-hop | magnet | poison-dart | queen-pulse | rabies-dart | rewind | smoke | squad | summon-knight |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 98% | 100% | 100% | 100% | 98% | 100% | 100% | 100% |
| 6 | 53% | 100% | 100% | 100% | 98% | 98% | 95% | 100% | 100% | 100% | 90% | 83% | 100% | 100% | 55% | 98% | 83% | 95% |
| 7 | 50% | 100% | 100% | 100% | 100% | 88% | 100% | 100% | 100% | 100% | 68% | 100% | 100% | 100% | 30% | 95% | 75% | 98% |
| 8 | 100% | 100% | 100% | 100% | 100% | 100% | 98% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 33% | 100% |
| 9 | 38% | 100% | 100% | 100% | 100% | 75% | 98% | 100% | 100% | 100% | 90% | 100% | 100% | 100% | 40% | 100% | 100% | 100% |
| 10 | 30% | 100% | 100% | 100% | 100% | 88% | 98% | 100% | 95% | 100% | 95% | 98% | 100% | 100% | 25% | 95% | 93% | 98% |

**Verdict:** needs a look 
- TOO EASY — a new player clears 100% of runs on Normal (target 40-60%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L8 no-ability 100% is too easy for the legacy band (35-65%).

### Difficulty modes — Stonework

T1 loadouts, no-ability + the five finishers, 3 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/100/80/60/100/67/33 | L10 33% | bishop-step 93% on L7 | - | 76/80 |
| Normal | 100/100/100/100/87/47/20/100/20/27 | L7 20% | freeze-ray 87% on L10 | - | 71/80 |
| Hard | 100/100/100/100/100/33/93/100/20/27 | L9 20% | freeze-ray 80% on L10 | - | 70/80 |
| Nightmare | 100/100/100/100/100/80/100/100/27/33 | L9 27% | freeze-ray 80% on L10 | - | 74/80 |

### Full runs — Stonework (authored, random picks)

80 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **70/80 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 80 | 80 | 100% | - |
| 2 | 80 | 80 | 100% | - |
| 3 | 80 | 80 | 100% | - |
| 4 | 80 | 80 | 100% | - |
| 5 | 80 | 80 | 100% | - |
| 6 | 80 | 80 | 100% | - |
| 7 | 80 | 79 | 99% | move-limit 1 |
| 8 | 79 | 78 | 99% | move-limit 1 |
| 9 | 78 | 77 | 99% | move-limit 1 |
| 10 | 77 | 70 | 91% | move-limit 4, captured 3 |

Most-picked cards: bishop-step 117, knight-hop 94, freeze-ray 88, queen-pulse 79, bodyguard 55, aegis 33, rabies-dart 16, decoy 16.

## Two Keys (`revenge-6`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 40 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.7 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 4 | - |
| 5 | 75-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | 12 | 3.9 | - |
| 6 | 35-65% | **60%** (c1,m15) | 4 tied 100% | bishop-step 100% | rewind 45% | - | 12 | 9.4 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **80%** (m8) **too easy** | 4 tied 100% | bishop-step 100% | rewind 78% | - | 11 | 8.9 | none no6, 4/4 finishers proven |
| 8 | 35-65% | **38%** (c3,m22) | 2 tied 100% | freeze-ray 93% | rewind 53% | - | 15 | 12.5 | none no6, 4/4 finishers proven |
| 9 | 15-45% | **28%** (c4,m25) | 4 tied 100% | bishop-step 100% | rewind 53% | - | 15 | 13.4 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **13%** (c6,m29) **too hard** | 2 tied 100% | freeze-ray 90% | rewind 30% | - | 19 | 17.4 | none no6, 3/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-step | bodyguard | boulder | convert | decoy | freeze-ray | knight-hop | magnet | poison-dart | queen-pulse | rabies-dart | rewind | smoke | squad | summon-knight |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 6 | 60% | 100% | 100% | 100% | 100% | 95% | 93% | 100% | 100% | 100% | 75% | 98% | 100% | 100% | 45% | 100% | 95% | 98% |
| 7 | 80% | 100% | 100% | 100% | 100% | 90% | 100% | 100% | 100% | 100% | 90% | 100% | 100% | 100% | 78% | 100% | 100% | 100% |
| 8 | 38% | 100% | 100% | 100% | 100% | 73% | 100% | 100% | 93% | 98% | 75% | 100% | 100% | 100% | 53% | 90% | 100% | 100% |
| 9 | 28% | 100% | 100% | 100% | 98% | 83% | 95% | 100% | 100% | 100% | 85% | 100% | 100% | 100% | 53% | 100% | 100% | 98% |
| 10 | 13% | 100% | 100% | 100% | 95% | 83% | 100% | 100% | 90% | 98% | 85% | 83% | 100% | 100% | 30% | 98% | 80% | 95% |

**Verdict:** needs a look 
- TOO EASY — a new player clears 100% of runs on Normal (target 40-60%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L7 no-ability 80% is too easy for the legacy band (40-70%); L10 no-ability 13% is too hard for the legacy band (15-45%).

### Difficulty modes — Two Keys

T1 loadouts, no-ability + the five finishers, 3 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/100/47/67/53/53/27 | L10 27% | freeze-ray 67% on L8 | - | 76/80 |
| Normal | 100/100/100/100/100/73/60/33/40/27 | L10 27% | freeze-ray 60% on L8 | - | 73/80 |
| Hard | 100/100/100/100/100/80/93/47/40/13 | L10 13% | freeze-ray 73% on L10 | - | 69/80 |
| Nightmare | 100/100/100/100/100/73/87/47/40/13 | L10 13% | freeze-ray 67% on L8 | - | 69/80 |

### Full runs — Two Keys (authored, random picks)

80 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **72/80 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 80 | 80 | 100% | - |
| 2 | 80 | 80 | 100% | - |
| 3 | 80 | 80 | 100% | - |
| 4 | 80 | 80 | 100% | - |
| 5 | 80 | 80 | 100% | - |
| 6 | 80 | 80 | 100% | - |
| 7 | 80 | 80 | 100% | - |
| 8 | 80 | 79 | 99% | move-limit 1 |
| 9 | 79 | 77 | 97% | move-limit 2 |
| 10 | 77 | 72 | 94% | captured 2, move-limit 3 |

Most-picked cards: bishop-step 121, queen-pulse 111, knight-hop 87, freeze-ray 72, bodyguard 48, rewind 21, rabies-dart 20, aegis 19.

## Biggest movers vs last night

Compared 1940 cells against 2026-08-30. Anything over 15 points is listed; with 4 trials a 15-point move is about two standard errors, so treat single cells with suspicion and clusters as real.

| Run | Mode | L | Loadout | Before | After | Change |
|---|---|---|---|---|---|---|
| revenge-5 | realistic | 10 | aegis | 0% | 100% | +100 |
| revenge-5 | realistic | 10 | become-king | 0% | 100% | +100 |
| revenge-5 | realistic | 10 | bishop-step | 0% | 100% | +100 |
| revenge-5 | realistic | 10 | bodyguard | 0% | 100% | +100 |
| revenge-5 | realistic | 10 | decoy | 0% | 100% | +100 |
| revenge-5 | realistic | 10 | knight-hop | 0% | 100% | +100 |
| revenge-5 | realistic | 10 | queen-pulse | 0% | 100% | +100 |
| revenge-5 | realistic | 10 | rabies-dart | 0% | 100% | +100 |
| revenge-5 | rookie | 10 | bishop-step | 0% | 100% | +100 |
| revenge-5 | rookie | 10 | freeze-ray | 0% | 100% | +100 |
| revenge-5 | rookie | 10 | knight-hop | 0% | 100% | +100 |
| revenge-5 | rookie | 10 | queen-pulse | 0% | 100% | +100 |
| revenge-5 | rookie | 10 | surge | 0% | 100% | +100 |
| revenge-5 | normal | 9 | freeze-ray | 0% | 100% | +100 |
| revenge-5 | normal | 9 | knight-hop | 0% | 100% | +100 |
| revenge-5 | normal | 10 | bishop-step | 0% | 100% | +100 |
| revenge-5 | normal | 10 | knight-hop | 0% | 100% | +100 |
| revenge-5 | normal | 10 | queen-pulse | 0% | 100% | +100 |
| revenge-5 | normal | 10 | surge | 0% | 100% | +100 |
| revenge-5 | hard | 10 | knight-hop | 0% | 100% | +100 |
| … | | | | | | 187 more |

- **NEW STALL** revenge-2 realistic L4 none: 1 game timed out with the king alive.
- **Left its band:** revenge-1 L8 no-ability 35% → 0% (too hard).
- **Left its band:** revenge-1 L9 no-ability 25% → 0% (too hard).
- Back in band: revenge-2 L6 no-ability 79% → 60%.
- Back in band: revenge-3 L7 no-ability 38% → 53%.
- Back in band: revenge-3 L9 no-ability 54% → 20%.
- Back in band: revenge-4 L6 no-ability 67% → 55%.
- Back in band: revenge-5 L6 no-ability 100% → 53%.
- Back in band: revenge-5 L7 no-ability 25% → 50%.
- Back in band: revenge-5 L9 no-ability 8% → 38%.
- Back in band: revenge-5 L10 no-ability 0% → 30%.

## What makes a level hard (feature findings)

300 level snapshots (every level × authored + each difficulty mode, across all runs). Features are counted from the starting board — total enemies, hunters vs marchers, keys on the king's lines, pen size, move budget, and so on.

**Plain-English splits (no-ability win %):**

- Levels with 12+ pawns average **67 points lower** no-ability win than the rest (6% vs 73%, 5 vs 295 snapshots).
- Levels with 12+ marchers (pawns pushing down the board) average **67 points lower** no-ability win than the rest (6% vs 73%, 5 vs 295 snapshots).
- Levels with 23+ total material average **59 points lower** no-ability win than the rest (26% vs 85%, 65 vs 235 snapshots).
- Levels with 15+ total enemies average **58 points lower** no-ability win than the rest (17% vs 75%, 15 vs 285 snapshots).
- Levels with 2+ queens average **55 points lower** no-ability win than the rest (23% vs 78%, 35 vs 265 snapshots).
- Levels with 5+ pen squares under enemy fire average **55 points lower** no-ability win than the rest (19% vs 74%, 10 vs 290 snapshots).

**Same, for the weakest finisher's win % (the safety net):**

- 12+ pawns: finisher floor **80 points lower** (15% vs 95%).
- 12+ marchers (pawns pushing down the board): finisher floor **80 points lower** (15% vs 95%).
- 2+ enemies inside the pen: finisher floor **39 points lower** (55% vs 94%).
- 15+ total enemies: finisher floor **34 points lower** (61% vs 95%).

**Strongest single correlations:**

| Feature | vs no-ability | vs finisher floor | High-quartile avg (none) | Low-quartile avg (none) |
|---|---|---|---|---|
| total material | -0.84 | -0.49 | 33% | 100% |
| hunter power (3 per minor, 9 per queen) | -0.79 | -0.39 | 37% | 94% |
| total enemies | -0.78 | -0.61 | 33% | 99% |
| squares under enemy fire | -0.77 | -0.39 | 35% | 99% |
| queens | -0.77 | -0.36 | 40% | 85% |
| approach squares under fire (ranks 2-5) | -0.76 | -0.37 | 38% | 100% |
| hunters (non-pawn pieces that chase Rookie) | -0.74 | -0.38 | 41% | 94% |
| pawns | -0.59 | -0.57 | 42% | 92% |
| marchers (pawns pushing down the board) | -0.59 | -0.57 | 42% | 92% |
| move budget | 0.59 | 0.26 | 100% | 64% |

Reading: −1 means "more of this, harder level"; +1 means "more of this, easier". Anything past ±0.5 is worth believing at this sample size.

**All features together (ridge regression, no-ability %):** fit R² 0.82 on 300 snapshots, held-out R² 0.84 on 60.

| Feature | Points per +1 unit | Points per +1 std dev |
|---|---|---|
| approach squares under fire (ranks 2-5) | +2.3 | +17 |
| squares under enemy fire | -1.0 | -12 |
| guards next to the king | +9.2 | +11 |
| walls | +3.8 | +10 |
| queens | -13.5 | -9 |
| total material | -0.7 | -7 |

With this few snapshots the coefficients are directional, not gospel. They firm up as more runs enter the pool.

## Humans vs bot

Human runs since 2026-08-02 (disk-only). "Cleared" is the share of human runs that got past the level; the bot column is the random-pick full-run clear rate on the authored level.

**revenge-1** — 34 runs, 14 won.

| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |
|---|---|---|---|---|---|
| 1 | 34 | 33 | 97% | 100% | -3 |
| 2 | 33 | 33 | 100% | 100% | 0 |
| 3 | 33 | 33 | 100% | 100% | 0 |
| 4 | 33 | 33 | 100% | 100% | 0 |
| 5 | 33 | 26 | 79% | 100% | -21 |
| 6 | 26 | 25 | 96% | 75% | +21 |
| 7 | 25 | 24 | 96% | 100% | -4 |
| 8 | 24 | 18 | 75% | 100% | -25 |
| 9 | 18 | 15 | 83% | 100% | -17 |
| 10 | 15 | 14 | 93% | 100% | -7 |

**revenge-3** — 2 runs, 0 won.

| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |
|---|---|---|---|---|---|
| 1 | 2 | 2 | 100% | 100% | 0 |
| 2 | 2 | 2 | 100% | 100% | 0 |
| 3 | 2 | 2 | 100% | 100% | 0 |
| 4 | 2 | 2 | 100% | 100% | 0 |
| 5 | 2 | 2 | 100% | 98% | +2 |
| 6 | 2 | 2 | 100% | 99% | +1 |
| 7 | 2 | 2 | 100% | 91% | +9 |
| 8 | 2 | 2 | 100% | 84% | +16 |
| 9 | 2 | 1 | 50% | 100% | -50 |
| 10 | 1 | 0 | 0% | 97% | -97 |

**revenge-4** — 1 run, 1 won.

| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 100% | 100% | 0 |
| 2 | 1 | 1 | 100% | 100% | 0 |
| 3 | 1 | 1 | 100% | 100% | 0 |
| 4 | 1 | 1 | 100% | 100% | 0 |
| 5 | 1 | 1 | 100% | 100% | 0 |
| 6 | 1 | 1 | 100% | 100% | 0 |
| 7 | 1 | 1 | 100% | 100% | 0 |
| 8 | 1 | 1 | 100% | 95% | +5 |
| 9 | 1 | 1 | 100% | 99% | +1 |
| 10 | 1 | 1 | 100% | 88% | +12 |

**revenge-5** — 3 runs, 0 won.

| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |
|---|---|---|---|---|---|
| 1 | 3 | 3 | 100% | 100% | 0 |
| 2 | 3 | 3 | 100% | 100% | 0 |
| 3 | 3 | 3 | 100% | 100% | 0 |
| 4 | 3 | 3 | 100% | 100% | 0 |
| 5 | 3 | 3 | 100% | 100% | 0 |
| 6 | 3 | 3 | 100% | 100% | 0 |
| 7 | 3 | 3 | 100% | 99% | +1 |
| 8 | 3 | 3 | 100% | 99% | +1 |
| 9 | 3 | 3 | 100% | 99% | +1 |
| 10 | 3 | 0 | 0% | 91% | -91 |

Where humans fall well below the bot on a level the bot clears ability-free, the level is probably reading badly (unclear key, hidden hunter) rather than being tight. Caveat: traces written by a dev server (`data/run-playtest/human-traces/`) also include games the parity driver played through the real app — those are bot games wearing a human label.

## Experiments run tonight

Each one takes a level, makes ONE change, and replays the cell at realistic tier (5 trials). Predicted vs actual tells us whether the model understands the level.

| Run | L | Change | Loadout | Baseline | Predicted | Actual | Verdict | Prediction from |
|---|---|---|---|---|---|---|---|---|
| revenge-1 | 8 | budget +2 | none | 0% | 34% | **20%** | inconclusive | mode-slope |
| revenge-1 | 6 | remove bishop b5 | none | 50% | 58% | **80%** | falsified | regression |

- L8 no-ability is 0%, too hard for its band (35-65%). The move budget is the cleanest knob.
- L6 sits mid-curve (50%); removing its closest hunter (bishop b5) measures one piece's worth.

## Top 3 hypotheses for tonight

1. **L10: raise the move budget by 2 → no-ability win goes 3% → about 8%.** L10 no-ability is 3%, too hard for its band (15-45%). The move budget is the cleanest knob.
2. **L5: add a knight on d3 → no-ability win goes 88% → about 79%.** L5 is the softest late level at 88% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is.
3. **L8: remove the knight on c3 → no-ability win goes 55% → about 64%.** L8 sits mid-curve (55%); removing its closest hunter (knight c3) measures one piece's worth.

These are measurements, not changes — nothing in `lib/run/runs.ts` was touched. A confirmed hypothesis is a tweak worth making by hand.

## Candidate runs

None in `REVENGE_CANDIDATE_RUN_IDS` tonight. When the generator adds one, it shows up here with a promote/hold call: new-player clear 40-60% on Normal and 70%+ on Rookie, every finisher ≥80%, zero stalls.

## Content pipeline

Registry: `data/content/pipeline.json` · approve with `npx tsx scripts/pipeline.ts approve <id>` (or tell Claude "approve <name>"). Only approved|live content reaches players; testing content stays behind `?run=` / `?loadout=`.

| Stage | idea | built | testing | approved | live | retired |
|---|---|---|---|---|---|---|
| Count | 5 | 0 | 0 | 0 | 23 | 2 |

**Waiting on Tyler (0)** — READY first:

- nothing in testing.

**Went live in the last 7 days (6):** Squire (`summon-knight`, ability) 2026-09-01, Pawn Storm (`revenge-2`, run) 2026-09-01, The Royal Guard (`revenge-3`, run) 2026-09-01, The Fortress (`revenge-4`, run) 2026-09-01, Stonework (`revenge-5`, run) 2026-09-01, Two Keys (`revenge-6`, run) 2026-09-01

**Idea backlog (5):** Page — A controllable pawn. Walks forward, captures diagonally, promotes when it reaches the far rank. · Twin — A second controllable rook. Two Rookies, one board. · Bishop Squire — Squire variant: a rainbow bishop the player controls. · Swap — Trade places with your Squire — teleport through his square. · Sacrifice — Squire explodes, capturing every enemy on his knight-squares.

## Solver — forced captures on the late levels

AND-OR search, depth 4, 20,000 nodes, worst case over every start file. W4 = forced win in 4 moves; no4 = no forced line found within the depth (not "impossible" — the bot's win % is the practical answer).

**revenge-1**

| L | none | surge | freeze-ray | knight-hop | bishop-step | queen-pulse |
|---|---|---|---|---|---|---|
| 9 | no4 | W4 | no4 | no4 | no4 | no4 |
| 10 | no4 | no4 | no4 | no4 | no4 | no4 |

**revenge-2**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bodyguard | boulder | convert | decoy | magnet | poison-dart | rabies-dart | rewind | smoke | squad | summon-knight |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | W6 | W4 | W3 | W4 | W4 | W4 | W4 | W4 | W6 | W4 | W3 | W4 | W4 | W6 | W6 | W6 | W6 | W4 |
| 7 | W6 | W4 | W3 | W4 | W4 | W3 | W4 | W4 | W6 | W4 | W3 | W3 | W4 | W6 | W6 | W6 | no6 | W4 |
| 8 | W6 | W4 | W3 | W4 | W4 | W4 | W4 | W4 | W6 | W4 | W3 | W5 | W4 | W6 | W6 | W6 | no6 | W4 |
| 9 | no6 | W6 | W5 | W4 | W4 | W6 | W6 | W6 | no6 | W5 | W4 | no6 | W5 | no6 | no6 | no6 | no6 | W4 |
| 10 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | W4 | no6 | no6 | no6 | no6 | no6 | no6 | W4 |

**revenge-3**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bodyguard | boulder | convert | decoy | magnet | poison-dart | rabies-dart | rewind | smoke | squad | summon-knight |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W3 | W3 | W3 | W3 | W4 | W4 | no6 | W3 | W3 | W5 | W4 | no6 | no6 | no6 | no6 | W4 |
| 7 | no6 | no6 | W6 | W3 | W3 | W3 | W4 | W6 | no6 | W3 | W3 | no6 | W6 | no6 | no6 | W3 | no6 | no6 |
| 8 | no6 | no6 | no6 | no6 | no6 | W5 | no6 | no6 | no6 | no6 | W5 | no6 | no6 | no6 | no6 | no6 | no6 | no6 |
| 9 | no6 | W5 | W5 | W6 | W6 | W3 | W5 | W5 | no6 | W3 | W3 | no6 | W4 | no6 | no6 | no6 | no6 | W4 |
| 10 | no6 | no6 | W5 | W3 | W3 | W3 | W3 | W6 | no6 | W3 | W3 | W6 | W5 | no6 | no6 | no6 | no6 | W3 |

**revenge-4**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bodyguard | boulder | convert | decoy | magnet | poison-dart | rabies-dart | rewind | smoke | squad | summon-knight |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W3 | W4 | W4 | W3 | W4 | W4 | no6 | W3 | W3 | W5 | W4 | no6 | no6 | W6 | W6 | W4 |
| 7 | W6 | W3 | W3 | W3 | W3 | W3 | W3 | W3 | W6 | W3 | W3 | W5 | W4 | W6 | W6 | W3 | no6 | W4 |
| 8 | no6 | W4 | W4 | W4 | W4 | W4 | W4 | W4 | no6 | W4 | W4 | no6 | W5 | no6 | no6 | no6 | no6 | W3 |
| 9 | no6 | no6 | no6 | no6 | no6 | W6 | no6 | no6 | no6 | W6 | W3 | no6 | W6 | no6 | no6 | W6 | no6 | W6 |
| 10 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 |

**revenge-5**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bodyguard | boulder | convert | decoy | magnet | poison-dart | rabies-dart | rewind | smoke | squad | summon-knight |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W4 | W3 | W3 | W4 | W3 | W5 | W6 | W3 | W3 | W5 | W4 | no6 | no6 | W5 | no6 | W3 |
| 7 | no6 | W4 | W4 | W4 | W4 | W3 | W4 | W4 | no6 | W3 | W3 | W4 | W4 | no6 | no6 | no6 | no6 | W3 |
| 8 | W6 | W5 | W5 | W6 | W6 | W6 | W6 | W5 | W6 | W6 | W5 | W6 | W5 | W6 | W6 | W6 | no6 | W4 |
| 9 | no6 | W4 | W5 | W3 | W3 | W6 | W4 | W4 | no6 | W5 | W4 | W6 | W5 | no6 | no6 | W4 | no6 | W4 |
| 10 | no6 | W6 | W4 | W5 | W5 | W3 | W3 | W6 | no6 | W3 | W3 | W4 | W4 | no6 | no6 | no6 | no6 | W3 |

**revenge-6**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bodyguard | boulder | convert | decoy | magnet | poison-dart | rabies-dart | rewind | smoke | squad | summon-knight |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W3 | W5 | W5 | W3 | W4 | W4 | no6 | W3 | W3 | W3 | W4 | no6 | no6 | W4 | no6 | W4 |
| 7 | no6 | W4 | W3 | W4 | W4 | W3 | W4 | W4 | ?6 | W3 | W3 | W4 | W4 | no6 | no6 | W5 | no6 | W4 |
| 8 | no6 | W5 | W4 | W3 | W3 | W5 | W3 | W6 | no6 | W3 | W4 | W5 | W4 | no6 | no6 | no6 | no6 | W3 |
| 9 | no6 | W4 | W5 | W3 | W3 | W6 | W4 | W4 | no6 | W5 | W4 | W6 | W5 | no6 | no6 | W4 | no6 | W4 |
| 10 | no6 | no6 | W5 | W3 | W3 | W3 | W3 | W6 | no6 | W4 | W3 | W6 | W5 | no6 | no6 | no6 | no6 | W3 |

## How to read this

- **No ability** = the T5 MCTS bot with no powers, offers dismissed. It is a floor for a good player, not a beginner's number.
- **Finishers** = surge, freeze-ray, knight-hop, bishop-step, queen-pulse — the cards that take the king directly. Every offer slate carries at least two, so the worst finisher is the run's safety net.
- **Stall** = 300 turns with the king alive. Always a bug or an unreachable pen; the target is zero.
- **Difficulty** = the new-player sim (3 starters, forced offers, mode retries): 40-60% full-run clear on Normal is the target, 70%+ on Rookie, over 85% on Normal is too easy. The old no-ability band (100/100/100/100/90/50/55/50/30/30 ±15) is shown per level for reference only.
- Start files are random per game, so a single cell wobbles ±10 between nights at 4 trials (more on the lighter candidate passes). Trust clusters and repeated nights.

**How to read these numbers** (the harness plays the exact engine the app does — verified ply-for-ply, see `docs/revenge-parity.md` — but it skips five app-side rules):

1. **Free offers are not skippable in the app.** On L1, L3, L6 and L9 a real player MUST take a card before moving; the harness dismisses it. So the "none" and single-ability cells on those levels UNDERSTATE a real player's kit — the random-pick full runs are the honest number there.
2. **Retries.** The app gives Rookie unlimited, Normal 3, Hard 1, Nightmare 0 retries per level, each with a fresh start file and seed. Every full-run clear rate here is a LOWER bound on what a player with retries sees.
3. **Offer pool.** The app rolls only the player's unlocked abilities (a new player has Knight Hop, Surge and Freeze Ray; Drones is retired). The harness draws from all 50 — so full-run pick mixes are wider than a new player's.
4. **Default difficulty.** A fresh profile plays Rookie; the main table is Normal. The four modes are swept explicitly above — read the Rookie row for the new-player experience.
5. **"Out of moves" vs "No way through".** The app's solver ends a proven-dead level early; the harness plays on to the move limit. Same loss, two labels — counted together as m.

Caveats tonight:
- Quick mode tested revenge-1 only; skipped revenge-2, revenge-3, revenge-4, revenge-5, revenge-6 (add --all-runs).
- Quick mode: trial counts are tiny and only no-ability + the five finishers were swept, so every percentage is coarse and movers vs last night are mostly noise.
- No Supabase credentials in env — human traces read from disk only.

Reproduce: `npx tsx scripts/run-playtest/revenge-nightly.ts` (add `--quick` for a 2-minute smoke). Raw JSON: `data/run-playtest/revenge/raw/2026-09-01/`.
