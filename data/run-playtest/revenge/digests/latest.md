# Rookie's Revenge — Morning Report

**Date:** 2026-09-02 · **Mode:** full · **Wall time:** 267.9 min
**Bot:** T5 MCTS · **Live run:** 16 trials per cell at realistic tiers, 8 per difficulty mode, 16 full runs per mode · **Experiments:** 16 trials · candidates run lighter (see each run)

## Headline

The Crucible: a new player (3 starters) clears the run 88% of the time on Normal and 100% on Rookie — TOO EASY (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 88% / 100%. Powers carry you by +37 points (no-ability averages 63%, finishers 100%). Zero stalls. Rookie's Revenge: a new player (3 starters) clears the run 88% of the time on Normal and 96% on Rookie — TOO EASY (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 83% / 100%. Powers carry you by +36 points (no-ability averages 63%, finishers 99%). Weak finishers: knight-hop 75% on L10. Zero stalls. The Vault: a new player (3 starters) clears the run 83% of the time on Normal and 100% on Rookie — too easy (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 96% / 100%. Powers carry you by +41 points (no-ability averages 57%, finishers 98%). Weak finishers: freeze-ray 75% on L6. 1 stall (king unreachable — look at this first). Pawn Storm: a new player (3 starters) clears the run 88% of the time on Normal and 100% on Rookie — TOO EASY (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 100% / 100%. Powers carry you by +22 points (no-ability averages 76%, finishers 98%). Weak finishers: bishop-step 75% on L3. 7 stalls (king unreachable — look at this first). The Royal Guard: a new player (3 starters) clears the run 75% of the time on Normal and 100% on Rookie — too easy (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 83% / 100%. Powers carry you by +36 points (no-ability averages 62%, finishers 98%). Weak finishers: freeze-ray 75% on L8. Zero stalls. The Fortress: a new player (3 starters) clears the run 71% of the time on Normal and 100% on Rookie — too easy (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 92% / 100%. Powers carry you by +26 points (no-ability averages 72%, finishers 98%). Weak finishers: freeze-ray 75% on L9, freeze-ray 75% on L10. Zero stalls. Stonework: a new player (3 starters) clears the run 83% of the time on Normal and 100% on Rookie — too easy (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 100% / 100%. Powers carry you by +22 points (no-ability averages 78%, finishers 100%). Zero stalls. Two Keys: a new player (3 starters) clears the run 96% of the time on Normal and 100% on Rookie — TOO EASY (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 100% / 100%. Powers carry you by +22 points (no-ability averages 78%, finishers 99%). Zero stalls. Bramble Crown: a new player (3 starters) clears the run 92% of the time on Normal and 100% on Rookie — TOO EASY (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 96% / 100%. Powers carry you by +28 points (no-ability averages 71%, finishers 99%). 5 stalls (king unreachable — look at this first). The Rampart: a new player (3 starters) clears the run 79% of the time on Normal and 96% on Rookie — too easy (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 88% / 100%. Powers carry you by +27 points (no-ability averages 73%, finishers 100%). Zero stalls. Cold Court: a new player (3 starters) clears the run 67% of the time on Normal and 100% on Rookie — too easy (target 40-60% on Normal, 70%+ on Rookie). A veteran with every ability clears 71% / 100%. Powers carry you by +33 points (no-ability averages 64%, finishers 97%). Weak finishers: queen-pulse 50% on L3. 15 stalls (king unreachable — look at this first). Versus last night: 186 cells moved more than 15 points since 2026-09-01 (biggest: L10 surge 7→88% [hard]; L10 rewind 8→88% [realistic]); 5 NEW stalls; L7 left its band (53→38%, too hard), L9 left its band (20→13%, too hard), L6 left its band (55→69%, too easy), L9 left its band (38→13%, too hard), L6 left its band (53→69%, too easy), L7 left its band (50→38%, too hard), L9 left its band (38→50%, too easy), L6 left its band (60→69%, too easy), L9 left its band (28→63%, too easy). Ran 28 experiments on level tweaks: 12 predictions confirmed, 5 falsified. No candidate runs in the queue tonight. 3 human runs on crucible since 2026-08-04, 2 won.

## Run difficulty and ability tiers

Difficulty is measured on the player who actually exists: a **new player** with only the 3 starters (knight-hop, surge, freeze-ray), taking the offers the app forces (never dismissing), with the mode's retries (Rookie unlimited, Normal 3). Target: 40-60% full-run clear on Normal, 70%+ on Rookie; over 85% on Normal is TOO EASY.

**The Crucible** (`crucible`)

- **New player clears this run 88% of the time on Normal / 100% on Rookie — TOO EASY.** (24 runs per mode; retries used: Normal 8, Rookie 1.)
- Veteran (all 24 abilities): 88% on Normal / 100% on Rookie.
- Powers carry you by **+37 points**: no-ability averages 63% across L1-L10, the five finishers average 100%. Hard levels without powers (no-ability under 60%): L6 56%, L7 25%, L8 31%, L9 25%, L10 6%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 2 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 3 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 4 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 5 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 6 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 7 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 8 | 96% (23/24) | 6 | 100% (24/24) | 1 | 88% |
| 9 | 100% (23/23) | 0 | 100% (24/24) | 0 | 100% |
| 10 | 91% (21/23) | 5 | 100% (24/24) | 0 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 6 levels where no-ability is under 100% (L5, L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +62 | L5 100% | 100% |
| S | become-king | 100% | +62 | L5 100% | 99% |
| S | bishop-step | 100% | +62 | L5 100% | 92% |
| S | decoy | 100% | +62 | L5 100% | 100% |
| S | dragon | 100% | +62 | L5 100% | 97% |
| S | freeze-ray | 100% | +62 | L5 100% | 95% |
| S | queen-pulse | 100% | +62 | L5 100% | 97% |
| S | rabies-dart | 100% | +62 | L5 100% | 100% |
| S | rewind | 100% | +62 | L5 100% | 91% |
| S | smoke | 100% | +62 | L5 100% | 88% |
| S | vanguard | 100% | +62 | L5 100% | 97% |
| S | boulder | 99% | +61 | L10 94% | 100% |
| S | duchess | 99% | +61 | L7 94% | 92% |
| S | knight-hop | 99% | +61 | L10 94% | 89% |
| S | twin | 99% | +61 | L10 94% | 91% |
| S | bishop-squire | 98% | +60 | L9 94% | 95% |
| S | convert | 98% | +60 | L8 94% | 98% |
| S | squad † | 97% | +59 | L6 88% | 0% |
| S | summon-knight | 97% | +58 | L8 81% | 92% |
| A | poison-dart | 95% | +56 | L6 81% | 96% |
| A | page | 88% | +49 | L10 56% | 78% |
| A | magnet | 87% | +48 | L7 69% | 70% |
| D | swap † | 48% | +10 | L10 6% | 0% |
| D | sacrifice † | 40% | +1 | L9 19% | 0% |

† squad, swap, sacrifice: bot never casts this (cast rate under 10%) — floor, not a verdict.

**Rookie's Revenge** (`revenge-1`)

- **New player clears this run 88% of the time on Normal / 96% on Rookie — TOO EASY.** (24 runs per mode; retries used: Normal 11, Rookie 11.)
- Veteran (all 24 abilities): 83% on Normal / 100% on Rookie.
- Powers carry you by **+36 points**: no-ability averages 63% across L1-L10, the five finishers average 99%. Hard levels without powers (no-ability under 60%): L6 31%, L7 25%, L8 38%, L9 6%, L10 25%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 2 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 3 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 4 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 5 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 6 | 100% (24/24) | 1 | 100% (24/24) | 0 | 100% |
| 7 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 8 | 96% (23/24) | 5 | 100% (24/24) | 1 | 92% |
| 9 | 100% (23/23) | 0 | 100% (24/24) | 0 | 100% |
| 10 | 91% (21/23) | 8 | 96% (23/24) | 11 | 91% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 5 levels where no-ability is under 100% (L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +75 | L6 100% | 100% |
| S | become-king | 100% | +75 | L6 100% | 99% |
| S | bishop-squire | 100% | +75 | L6 100% | 100% |
| S | bishop-step | 100% | +75 | L6 100% | 98% |
| S | decoy | 100% | +75 | L6 100% | 100% |
| S | dragon | 100% | +75 | L6 100% | 100% |
| S | duchess | 100% | +75 | L6 100% | 100% |
| S | queen-pulse | 100% | +75 | L6 100% | 99% |
| S | rabies-dart | 100% | +75 | L6 100% | 100% |
| S | smoke | 98% | +73 | L6 94% | 96% |
| S | squad † | 98% | +73 | L7 88% | 0% |
| S | twin | 98% | +73 | L6 88% | 98% |
| S | vanguard | 98% | +73 | L10 88% | 100% |
| S | summon-knight | 96% | +71 | L9 88% | 99% |
| S | freeze-ray | 95% | +70 | L8 88% | 100% |
| S | knight-hop | 95% | +70 | L10 75% | 99% |
| A | convert | 91% | +66 | L6 81% | 100% |
| A | rewind | 91% | +66 | L10 75% | 93% |
| A | boulder | 89% | +64 | L10 56% | 100% |
| A | poison-dart | 88% | +63 | L10 63% | 96% |
| A | page | 87% | +62 | L10 63% | 94% |
| C | magnet | 64% | +39 | L10 31% | 64% |
| D | swap † | 38% | +13 | L9 19% | 0% |
| D | sacrifice † | 35% | +10 | L8 25% | 0% |

† squad, swap, sacrifice: bot never casts this (cast rate under 10%) — floor, not a verdict.

**The Vault** (`revenge-10`)

- **New player clears this run 83% of the time on Normal / 100% on Rookie — too easy.** (24 runs per mode; retries used: Normal 17, Rookie 3.)
- Veteran (all 24 abilities): 96% on Normal / 100% on Rookie.
- Powers carry you by **+41 points**: no-ability averages 57% across L1-L10, the five finishers average 98%. Hard levels without powers (no-ability under 60%): L5 44%, L6 38%, L7 13%, L8 25%, L9 25%, L10 25%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 2 | 100% (24/24) | 1 | 100% (24/24) | 1 | 100% |
| 3 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 4 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 5 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 6 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 7 | 96% (23/24) | 6 | 100% (24/24) | 1 | 100% |
| 8 | 91% (21/23) | 9 | 100% (24/24) | 1 | 100% |
| 9 | 100% (21/21) | 1 | 100% (24/24) | 0 | 96% |
| 10 | 95% (20/21) | 4 | 100% (24/24) | 0 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 6 levels where no-ability is under 100% (L5, L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +72 | L5 100% | 100% |
| S | become-king | 100% | +72 | L5 100% | 99% |
| S | decoy | 100% | +72 | L5 100% | 100% |
| S | queen-pulse | 100% | +72 | L5 100% | 97% |
| S | rabies-dart | 100% | +72 | L5 100% | 98% |
| S | vanguard | 100% | +72 | L5 100% | 98% |
| S | dragon | 99% | +71 | L7 94% | 97% |
| S | bishop-squire | 98% | +70 | L10 88% | 99% |
| S | bishop-step | 98% | +70 | L8 88% | 100% |
| S | summon-knight | 98% | +70 | L7 94% | 100% |
| S | twin | 98% | +70 | L6 94% | 96% |
| S | duchess | 96% | +68 | L8 81% | 98% |
| S | poison-dart | 96% | +68 | L8 88% | 100% |
| S | smoke | 96% | +68 | L10 88% | 93% |
| A | rewind | 95% | +67 | L7 75% | 91% |
| A | convert | 94% | +66 | L6 88% | 100% |
| A | knight-hop | 94% | +65 | L7 81% | 99% |
| A | boulder | 93% | +65 | L8 81% | 97% |
| A | freeze-ray | 93% | +65 | L6 75% | 91% |
| A | squad † | 93% | +64 | L9 75% | 0% |
| A | page | 92% | +64 | L9 81% | 89% |
| A | magnet | 90% | +61 | L7 75% | 76% |
| D | sacrifice † | 38% | +9 | L8 6% | 0% |
| D | swap † | 36% | +7 | L8 13% | 0% |

† squad, sacrifice, swap: bot never casts this (cast rate under 10%) — floor, not a verdict.

**Pawn Storm** (`revenge-2`)

- **New player clears this run 88% of the time on Normal / 100% on Rookie — TOO EASY.** (24 runs per mode; retries used: Normal 14, Rookie 1.)
- Veteran (all 24 abilities): 100% on Normal / 100% on Rookie.
- Powers carry you by **+22 points**: no-ability averages 76% across L1-L10, the five finishers average 98%. Hard levels without powers (no-ability under 60%): L9 25%, L10 44%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 2 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 3 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 4 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 5 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 6 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 7 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 8 | 96% (23/24) | 7 | 100% (24/24) | 0 | 100% |
| 9 | 100% (23/23) | 1 | 100% (24/24) | 0 | 100% |
| 10 | 91% (21/23) | 9 | 100% (24/24) | 1 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 5 levels where no-ability is under 100% (L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | become-king | 100% | +47 | L6 100% | 96% |
| S | bishop-step | 100% | +47 | L6 100% | 94% |
| S | decoy | 100% | +47 | L6 100% | 100% |
| S | duchess | 100% | +47 | L6 100% | 99% |
| S | queen-pulse | 100% | +47 | L6 100% | 91% |
| S | rabies-dart | 100% | +47 | L6 100% | 100% |
| S | vanguard | 100% | +47 | L6 100% | 100% |
| S | aegis | 99% | +46 | L10 94% | 96% |
| S | dragon | 99% | +46 | L10 94% | 99% |
| S | knight-hop | 99% | +46 | L10 94% | 94% |
| S | twin | 99% | +46 | L10 94% | 96% |
| S | rewind | 98% | +45 | L10 88% | 95% |
| S | smoke | 98% | +45 | L10 88% | 100% |
| S | convert | 96% | +44 | L10 88% | 100% |
| S | bishop-squire | 96% | +43 | L10 81% | 100% |
| S | freeze-ray | 96% | +43 | L9 81% | 99% |
| S | poison-dart | 96% | +43 | L10 81% | 100% |
| S | summon-knight | 96% | +43 | L10 81% | 100% |
| S | squad † | 95% | +42 | L9 81% | 0% |
| A | boulder | 93% | +40 | L10 69% | 100% |
| B | page | 84% | +31 | L10 63% | 94% |
| C | magnet | 65% | +12 | L8 56% | 54% |
| C | sacrifice † | 50% | -3 | L10 25% | 0% |
| D | swap † | 44% | -9 | L9 19% | 0% |

† squad, sacrifice, swap: bot never casts this (cast rate under 10%) — floor, not a verdict.

**The Royal Guard** (`revenge-3`)

- **New player clears this run 75% of the time on Normal / 100% on Rookie — too easy.** (24 runs per mode; retries used: Normal 13, Rookie 4.)
- Veteran (all 24 abilities): 83% on Normal / 100% on Rookie.
- Powers carry you by **+36 points**: no-ability averages 62% across L1-L10, the five finishers average 98%. Hard levels without powers (no-ability under 60%): L6 38%, L7 38%, L8 19%, L9 13%, L10 19%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 2 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 3 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 4 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 5 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 6 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 7 | 96% (23/24) | 3 | 100% (24/24) | 0 | 100% |
| 8 | 83% (19/23) | 11 | 100% (24/24) | 1 | 92% |
| 9 | 100% (19/19) | 0 | 100% (24/24) | 0 | 100% |
| 10 | 95% (18/19) | 5 | 100% (24/24) | 3 | 91% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 6 levels where no-ability is under 100% (L5, L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | become-king | 100% | +64 | L5 100% | 100% |
| S | decoy | 100% | +64 | L5 100% | 99% |
| S | queen-pulse | 100% | +64 | L5 100% | 100% |
| S | aegis | 99% | +63 | L9 94% | 97% |
| S | dragon | 99% | +63 | L7 94% | 99% |
| S | rabies-dart | 99% | +63 | L8 94% | 99% |
| S | bishop-step | 98% | +62 | L8 94% | 98% |
| S | duchess | 98% | +62 | L7 94% | 98% |
| S | summon-knight | 98% | +62 | L8 94% | 89% |
| S | vanguard | 98% | +62 | L8 88% | 94% |
| S | convert | 97% | +61 | L8 81% | 100% |
| S | poison-dart | 96% | +60 | L6 94% | 97% |
| S | rewind | 96% | +60 | L9 88% | 89% |
| S | smoke | 96% | +60 | L6 88% | 89% |
| S | twin | 96% | +60 | L10 88% | 93% |
| A | boulder | 95% | +59 | L8 81% | 98% |
| A | freeze-ray | 93% | +57 | L8 75% | 96% |
| A | knight-hop | 93% | +57 | L7 81% | 99% |
| A | bishop-squire | 91% | +55 | L10 63% | 96% |
| A | squad † | 88% | +52 | L8 56% | 0% |
| A | page | 87% | +51 | L8 63% | 94% |
| C | magnet | 64% | +28 | L8 31% | 59% |
| D | sacrifice † | 48% | +13 | L8 13% | 0% |
| D | swap † | 34% | -2 | L8 13% | 0% |

† squad, sacrifice, swap: bot never casts this (cast rate under 10%) — floor, not a verdict.

**The Fortress** (`revenge-4`)

- **New player clears this run 71% of the time on Normal / 100% on Rookie — too easy.** (24 runs per mode; retries used: Normal 13, Rookie 8.)
- Veteran (all 24 abilities): 92% on Normal / 100% on Rookie.
- Powers carry you by **+26 points**: no-ability averages 72% across L1-L10, the five finishers average 98%. Hard levels without powers (no-ability under 60%): L7 44%, L9 13%, L10 44%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 2 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 3 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 4 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 5 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 6 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 7 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 8 | 88% (21/24) | 6 | 100% (24/24) | 0 | 100% |
| 9 | 90% (19/21) | 6 | 100% (24/24) | 2 | 96% |
| 10 | 89% (17/19) | 8 | 100% (24/24) | 6 | 96% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 6 levels where no-ability is under 100% (L5, L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | become-king | 100% | +47 | L5 100% | 98% |
| S | bishop-step | 100% | +47 | L5 100% | 84% |
| S | decoy | 100% | +47 | L5 100% | 99% |
| S | duchess | 100% | +47 | L5 100% | 98% |
| S | rabies-dart | 100% | +47 | L5 100% | 99% |
| S | aegis | 99% | +46 | L10 94% | 98% |
| S | queen-pulse | 99% | +46 | L10 94% | 81% |
| S | vanguard | 99% | +46 | L10 94% | 100% |
| S | smoke | 98% | +45 | L9 88% | 93% |
| S | convert | 97% | +44 | L10 88% | 100% |
| S | dragon | 97% | +44 | L9 88% | 94% |
| S | rewind | 97% | +44 | L10 88% | 97% |
| S | twin | 97% | +44 | L9 88% | 97% |
| S | poison-dart | 97% | +43 | L10 81% | 99% |
| A | knight-hop | 95% | +41 | L9 75% | 92% |
| A | summon-knight | 93% | +39 | L8 75% | 94% |
| A | freeze-ray | 92% | +38 | L9 75% | 99% |
| A | boulder | 90% | +36 | L9 50% | 95% |
| A | bishop-squire | 88% | +34 | L9 50% | 95% |
| A | magnet | 88% | +34 | L9 63% | 65% |
| A | squad † | 88% | +34 | L9 63% | 0% |
| B | page | 81% | +28 | L9 50% | 88% |
| C | sacrifice † | 60% | +6 | L9 31% | 0% |
| C | swap † | 59% | +5 | L9 31% | 0% |

† squad, sacrifice, swap: bot never casts this (cast rate under 10%) — floor, not a verdict.

**Stonework** (`revenge-5`)

- **New player clears this run 83% of the time on Normal / 100% on Rookie — too easy.** (24 runs per mode; retries used: Normal 10, Rookie 0.)
- Veteran (all 24 abilities): 100% on Normal / 100% on Rookie.
- Powers carry you by **+22 points**: no-ability averages 78% across L1-L10, the five finishers average 100%. Hard levels without powers (no-ability under 60%): L7 38%, L9 50%, L10 19%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 2 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 3 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 4 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 5 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 6 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 7 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 8 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 9 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 10 | 83% (20/24) | 14 | 100% (24/24) | 0 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 4 levels where no-ability is under 100% (L6, L7, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +56 | L6 100% | 97% |
| S | become-king | 100% | +56 | L6 100% | 98% |
| S | bishop-step | 100% | +56 | L6 100% | 97% |
| S | convert | 100% | +56 | L6 100% | 98% |
| S | decoy | 100% | +56 | L6 100% | 100% |
| S | dragon | 100% | +56 | L6 100% | 92% |
| S | duchess | 100% | +56 | L6 100% | 88% |
| S | knight-hop | 100% | +56 | L6 100% | 100% |
| S | queen-pulse | 100% | +56 | L6 100% | 94% |
| S | rewind | 100% | +56 | L6 100% | 100% |
| S | smoke | 100% | +56 | L6 100% | 89% |
| S | twin | 100% | +56 | L6 100% | 94% |
| S | vanguard | 100% | +56 | L6 100% | 92% |
| S | rabies-dart | 99% | +55 | L6 94% | 100% |
| S | summon-knight | 99% | +55 | L7 94% | 91% |
| S | bishop-squire | 97% | +53 | L10 88% | 92% |
| S | boulder | 97% | +53 | L7 94% | 98% |
| S | freeze-ray | 97% | +53 | L10 88% | 97% |
| S | poison-dart | 97% | +53 | L10 88% | 94% |
| A | squad † | 88% | +44 | L6 81% | 0% |
| A | magnet | 86% | +42 | L7 81% | 59% |
| B | page | 77% | +33 | L9 50% | 84% |
| C | sacrifice † | 50% | +6 | L9 38% | 0% |
| D | swap † | 47% | +3 | L10 19% | 0% |

† squad, sacrifice, swap: bot never casts this (cast rate under 10%) — floor, not a verdict.

**Two Keys** (`revenge-6`)

- **New player clears this run 96% of the time on Normal / 100% on Rookie — TOO EASY.** (24 runs per mode; retries used: Normal 4, Rookie 0.)
- Veteran (all 24 abilities): 100% on Normal / 100% on Rookie.
- Powers carry you by **+22 points**: no-ability averages 78% across L1-L10, the five finishers average 99%. Hard levels without powers (no-ability under 60%): L8 44%, L10 25%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 2 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 3 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 4 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 5 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 6 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 7 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 8 | 96% (23/24) | 4 | 100% (24/24) | 0 | 100% |
| 9 | 100% (23/23) | 0 | 100% (24/24) | 0 | 100% |
| 10 | 100% (23/23) | 1 | 100% (24/24) | 0 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 5 levels where no-ability is under 100% (L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +45 | L6 100% | 99% |
| S | become-king | 100% | +45 | L6 100% | 98% |
| S | bishop-step | 100% | +45 | L6 100% | 89% |
| S | decoy | 100% | +45 | L6 100% | 100% |
| S | dragon | 100% | +45 | L6 100% | 99% |
| S | queen-pulse | 100% | +45 | L6 100% | 94% |
| S | rabies-dart | 100% | +45 | L6 100% | 100% |
| S | rewind | 100% | +45 | L6 100% | 98% |
| S | summon-knight | 100% | +45 | L6 100% | 99% |
| S | vanguard | 100% | +45 | L6 100% | 100% |
| S | bishop-squire | 99% | +44 | L6 94% | 95% |
| S | convert | 99% | +44 | L8 94% | 100% |
| S | duchess | 99% | +44 | L9 94% | 99% |
| S | poison-dart | 99% | +44 | L10 94% | 99% |
| S | twin | 99% | +44 | L8 94% | 100% |
| S | boulder | 98% | +42 | L8 88% | 100% |
| S | freeze-ray | 98% | +42 | L6 94% | 99% |
| S | knight-hop | 98% | +42 | L8 94% | 98% |
| S | smoke | 98% | +42 | L8 94% | 96% |
| S | squad † | 95% | +40 | L10 81% | 0% |
| B | magnet | 83% | +27 | L6 75% | 60% |
| B | page | 83% | +27 | L9 69% | 91% |
| D | swap † | 49% | -6 | L8 38% | 0% |
| D | sacrifice † | 46% | -9 | L10 25% | 0% |

† squad, swap, sacrifice: bot never casts this (cast rate under 10%) — floor, not a verdict.

**Bramble Crown** (`revenge-7`)

- **New player clears this run 92% of the time on Normal / 100% on Rookie — TOO EASY.** (24 runs per mode; retries used: Normal 4, Rookie 0.)
- Veteran (all 24 abilities): 96% on Normal / 100% on Rookie.
- Powers carry you by **+28 points**: no-ability averages 71% across L1-L10, the five finishers average 99%. Hard levels without powers (no-ability under 60%): L8 31%, L9 19%, L10 19%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 2 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 3 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 4 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 5 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 6 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 7 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 8 | 100% (24/24) | 1 | 100% (24/24) | 0 | 100% |
| 9 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 10 | 92% (22/24) | 5 | 100% (24/24) | 0 | 96% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 5 levels where no-ability is under 100% (L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | become-king | 100% | +57 | L6 100% | 99% |
| S | bishop-step | 100% | +57 | L6 100% | 86% |
| S | decoy | 100% | +57 | L6 100% | 100% |
| S | dragon | 100% | +57 | L6 100% | 100% |
| S | duchess | 100% | +57 | L6 100% | 98% |
| S | knight-hop | 100% | +57 | L6 100% | 100% |
| S | poison-dart | 100% | +57 | L6 100% | 100% |
| S | queen-pulse | 100% | +57 | L6 100% | 86% |
| S | rabies-dart | 100% | +57 | L6 100% | 100% |
| S | rewind | 100% | +57 | L6 100% | 100% |
| S | summon-knight | 100% | +57 | L6 100% | 99% |
| S | twin | 100% | +57 | L6 100% | 100% |
| S | vanguard | 100% | +57 | L6 100% | 100% |
| S | aegis | 99% | +56 | L9 94% | 98% |
| S | freeze-ray | 99% | +56 | L8 94% | 100% |
| S | convert | 98% | +55 | L9 94% | 100% |
| S | smoke | 98% | +55 | L9 88% | 98% |
| S | boulder | 95% | +52 | L8 81% | 100% |
| A | bishop-squire | 90% | +47 | L9 69% | 94% |
| A | squad † | 89% | +46 | L9 63% | 0% |
| A | magnet | 85% | +43 | L7 69% | 79% |
| B | page | 76% | +34 | L6 56% | 96% |
| D | swap † | 38% | -5 | L10 13% | 0% |
| D | sacrifice † | 35% | -7 | L8 13% | 0% |

† squad, swap, sacrifice: bot never casts this (cast rate under 10%) — floor, not a verdict.

**The Rampart** (`revenge-8`)

- **New player clears this run 79% of the time on Normal / 96% on Rookie — too easy.** (24 runs per mode; retries used: Normal 10, Rookie 13.)
- Veteran (all 24 abilities): 88% on Normal / 100% on Rookie.
- Powers carry you by **+27 points**: no-ability averages 73% across L1-L10, the five finishers average 100%. Hard levels without powers (no-ability under 60%): L7 50%, L9 25%, L10 44%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 2 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 3 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 4 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 5 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 6 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 7 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 8 | 96% (23/24) | 4 | 100% (24/24) | 0 | 96% |
| 9 | 100% (23/23) | 0 | 100% (24/24) | 0 | 100% |
| 10 | 83% (19/23) | 11 | 96% (23/24) | 14 | 91% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 6 levels where no-ability is under 100% (L5, L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +46 | L5 100% | 96% |
| S | become-king | 100% | +46 | L5 100% | 94% |
| S | decoy | 100% | +46 | L5 100% | 100% |
| S | dragon | 100% | +46 | L5 100% | 95% |
| S | duchess | 100% | +46 | L5 100% | 98% |
| S | knight-hop | 100% | +46 | L5 100% | 96% |
| S | queen-pulse | 100% | +46 | L5 100% | 90% |
| S | rabies-dart | 100% | +46 | L5 100% | 100% |
| S | vanguard | 100% | +46 | L5 100% | 94% |
| S | bishop-step | 99% | +45 | L10 94% | 93% |
| S | boulder | 99% | +45 | L10 94% | 99% |
| S | convert | 99% | +45 | L6 94% | 100% |
| S | smoke | 99% | +45 | L9 94% | 92% |
| S | twin | 99% | +45 | L10 94% | 92% |
| S | freeze-ray | 98% | +44 | L10 88% | 97% |
| S | poison-dart | 98% | +44 | L10 88% | 99% |
| S | bishop-squire | 97% | +43 | L10 81% | 97% |
| A | rewind | 95% | +41 | L10 75% | 95% |
| A | summon-knight | 95% | +41 | L10 75% | 92% |
| A | page | 88% | +33 | L10 56% | 80% |
| A | squad † | 87% | +32 | L10 25% | 0% |
| B | magnet | 81% | +27 | L6 56% | 58% |
| C | sacrifice † | 61% | +6 | L9 25% | 0% |
| C | swap † | 58% | +3 | L8 38% | 0% |

† squad, sacrifice, swap: bot never casts this (cast rate under 10%) — floor, not a verdict.

**Cold Court** (`revenge-9`)

- **New player clears this run 67% of the time on Normal / 100% on Rookie — too easy.** (24 runs per mode; retries used: Normal 12, Rookie 3.)
- Veteran (all 24 abilities): 71% on Normal / 100% on Rookie.
- Powers carry you by **+33 points**: no-ability averages 64% across L1-L10, the five finishers average 97%. Hard levels without powers (no-ability under 60%): L6 50%, L7 25%, L8 50%, L9 25%, L10 31%.

| L | New player, Normal (clear %) | Deaths (Normal) | New player, Rookie (clear %) | Deaths (Rookie) | Veteran, Normal |
|---|---|---|---|---|---|
| 1 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 2 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 3 | 100% (24/24) | 0 | 100% (24/24) | 0 | 88% |
| 4 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 5 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 6 | 100% (24/24) | 0 | 100% (24/24) | 0 | 100% |
| 7 | 100% (24/24) | 1 | 100% (24/24) | 0 | 95% |
| 8 | 83% (20/24) | 10 | 100% (24/24) | 3 | 85% |
| 9 | 100% (20/20) | 0 | 100% (24/24) | 0 | 100% |
| 10 | 80% (16/20) | 9 | 100% (24/24) | 0 | 100% |

"Deaths" counts every level loss, including the ones a retry rescued — where deaths pile up but clear % stays high, retries are doing the work.

Ability tier list, realistic tiers, scored over the 6 levels where no-ability is under 100% (L5, L6, L7, L8, L9, L10). Lift = points over no-ability on those levels. S ≥ 95, A ≥ 85, B ≥ 70, C ≥ 50, D below.

| Tier | Ability | Avg win | Lift | Worst level | Cast rate |
|---|---|---|---|---|---|
| S | aegis | 100% | +59 | L5 100% | 99% |
| S | become-king | 100% | +59 | L5 100% | 98% |
| S | bishop-step | 100% | +59 | L5 100% | 90% |
| S | decoy | 100% | +59 | L5 100% | 100% |
| S | knight-hop | 100% | +59 | L5 100% | 99% |
| S | rabies-dart | 100% | +59 | L5 100% | 100% |
| S | rewind | 100% | +59 | L5 100% | 99% |
| S | vanguard | 100% | +59 | L5 100% | 99% |
| S | freeze-ray | 99% | +58 | L8 94% | 99% |
| S | queen-pulse | 99% | +58 | L9 94% | 91% |
| S | twin | 99% | +58 | L9 94% | 98% |
| S | dragon | 98% | +57 | L9 94% | 100% |
| S | poison-dart | 98% | +57 | L6 88% | 98% |
| S | boulder | 97% | +56 | L8 88% | 99% |
| S | convert | 97% | +56 | L9 88% | 100% |
| S | duchess | 97% | +56 | L9 81% | 98% |
| S | summon-knight | 97% | +56 | L8 88% | 99% |
| S | smoke | 96% | +55 | L9 81% | 95% |
| A | bishop-squire | 94% | +53 | L9 81% | 98% |
| A | page | 88% | +47 | L8 69% | 94% |
| B | magnet | 77% | +37 | L9 50% | 70% |
| B | squad † | 76% | +35 | L9 19% | 0% |
| D | sacrifice † | 34% | -7 | L10 6% | 0% |
| D | swap † | 29% | -12 | L7 13% | 0% |

† squad, sacrifice, swap: bot never casts this (cast rate under 10%) — floor, not a verdict.

## The Crucible (`crucible`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 16 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.6 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | 14 | 3.6 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | 13 | 3.9 | - |
| 5 | 75-100% | **88%** (m2) | 4 tied 100% | bishop-step 100% | sacrifice 63% | - | 13 | 8.6 | - |
| 6 | 35-65% | **56%** (c1,m6) | 4 tied 100% | bishop-step 100% | sacrifice 63% | - | 7 | 6.6 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **25%** (c3,m9) **too hard** | 4 tied 100% | bishop-step 100% | sacrifice 38% | - | 13 | 11.1 | none no6, 4/4 finishers proven |
| 8 | 35-65% | **31%** (c4,m7) **too hard** | 4 tied 100% | bishop-step 100% | sacrifice 25% | - | 12 | 10.6 | none no6, 4/4 finishers proven |
| 9 | 15-45% | **25%** (c1,m11) | 4 tied 100% | bishop-step 100% | sacrifice 19% | - | 9 | 8.3 | none W6, 4/4 finishers proven |
| 10 | 15-45% | **6%** (c2,m13) **too hard** | 3 tied 100% | knight-hop 94% | swap 6% | - | 12 | 11.3 | none no6, 4/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-squire | bishop-step | boulder | convert | decoy | dragon | duchess | freeze-ray | knight-hop | magnet | page | poison-dart | queen-pulse | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 88% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 63% | 100% | 94% | 100% | 94% | 100% | 100% |
| 6 | 56% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 94% | 81% | 100% | 100% | 100% | 63% | 100% | 88% | 100% | 69% | 100% | 100% |
| 7 | 25% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 69% | 94% | 100% | 100% | 100% | 100% | 38% | 100% | 100% | 100% | 38% | 100% | 100% |
| 8 | 31% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 88% | 88% | 100% | 100% | 100% | 100% | 25% | 100% | 100% | 81% | 44% | 100% | 100% |
| 9 | 25% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 81% | 94% | 100% | 100% | 100% | 100% | 19% | 100% | 100% | 100% | 38% | 100% | 100% |
| 10 | 6% | 100% | 100% | 94% | 100% | 94% | 94% | 100% | 100% | 100% | 100% | 94% | 88% | 56% | 88% | 100% | 100% | 100% | 31% | 100% | 100% | 100% | 6% | 94% | 100% |

**Verdict:** needs a look 
- TOO EASY — a new player clears 88% of runs on Normal (target 40-60%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L7 no-ability 25% is too hard for the legacy band (40-70%); L8 no-ability 31% is too hard for the legacy band (35-65%); L10 no-ability 6% is too hard for the legacy band (15-45%).

### Difficulty modes — The Crucible

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/88/100/75/75/63/38 | L10 38% | bishop-step 100% on L1 | - | 15/16 |
| Normal | 100/100/100/100/75/50/50/50/25/13 | L10 13% | knight-hop 63% on L10 | - | 13/16 |
| Hard | 100/100/100/100/88/50/25/25/25/13 | L10 13% | freeze-ray 88% on L6 | - | 11/16 |
| Nightmare | 100/100/100/100/100/38/13/50/13/0 | L10 0% | freeze-ray 50% on L10 | - | 10/16 |

### Full runs — The Crucible (authored, random picks)

16 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **12/16 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 16 | 16 | 100% | - |
| 2 | 16 | 16 | 100% | - |
| 3 | 16 | 16 | 100% | - |
| 4 | 16 | 16 | 100% | - |
| 5 | 16 | 16 | 100% | - |
| 6 | 16 | 16 | 100% | - |
| 7 | 16 | 16 | 100% | - |
| 8 | 16 | 14 | 88% | captured 2 |
| 9 | 14 | 14 | 100% | - |
| 10 | 14 | 12 | 86% | move-limit 2 |

Most-picked cards: bishop-step 30, queen-pulse 19, knight-hop 16, vanguard 9, freeze-ray 7, dragon 5, aegis 4, convert 3.

## Rookie's Revenge (`revenge-1`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 16 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.7 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.6 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.8 | - |
| 5 | 75-100% | **100%** | 4 tied 100% | bishop-step 100% | swap 88% | - | 12 | 8.6 | - |
| 6 | 35-65% | **31%** (c1,m10) **too hard** | 3 tied 100% | freeze-ray 94% | magnet 50% | - | 12 | 10.5 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **25%** (c1,m11) **too hard** | 4 tied 100% | bishop-step 100% | sacrifice 44% | - | 12 | 11.1 | none no6, 4/4 finishers proven |
| 8 | 35-65% | **38%** (c3,m7) | 3 tied 100% | freeze-ray 88% | sacrifice 25% | - | 14 | 10.3 | none no6, 2/4 finishers proven |
| 9 | 15-45% | **6%** (c3,m12) **too hard** | 4 tied 100% | bishop-step 100% | swap 19% | - | 14 | 12.9 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **25%** (c1,m11) | 2 tied 100% | knight-hop 75% **low** | swap 19% | - | 18 | 16.5 | none no6, 0/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-squire | bishop-step | boulder | convert | decoy | dragon | duchess | freeze-ray | knight-hop | magnet | page | poison-dart | queen-pulse | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 88% | 100% | 100% |
| 6 | 31% | 100% | 100% | 100% | 100% | 100% | 81% | 100% | 100% | 100% | 94% | 100% | 50% | 88% | 88% | 100% | 100% | 100% | 50% | 94% | 100% | 100% | 50% | 88% | 100% |
| 7 | 25% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 75% | 94% | 100% | 100% | 100% | 100% | 44% | 100% | 88% | 100% | 50% | 100% | 100% |
| 8 | 38% | 100% | 100% | 100% | 100% | 94% | 94% | 100% | 100% | 100% | 88% | 100% | 81% | 88% | 88% | 100% | 100% | 81% | 25% | 100% | 100% | 100% | 50% | 100% | 100% |
| 9 | 6% | 100% | 100% | 100% | 100% | 94% | 94% | 100% | 100% | 100% | 100% | 100% | 81% | 100% | 100% | 100% | 100% | 100% | 25% | 100% | 100% | 88% | 19% | 100% | 100% |
| 10 | 25% | 100% | 100% | 100% | 100% | 56% | 94% | 100% | 100% | 100% | 94% | **75%** | 31% | 63% | 63% | 100% | 100% | 75% | 31% | 94% | 100% | 94% | 19% | 100% | 88% |

**Verdict:** needs a look 
- TOO EASY — a new player clears 88% of runs on Normal (target 40-60%)
- L10 knight-hop only 75% (every finisher must be at least 80%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L6 no-ability 31% is too hard for the legacy band (35-65%); L7 no-ability 25% is too hard for the legacy band (40-70%); L9 no-ability 6% is too hard for the legacy band (15-45%).

### Difficulty modes — Rookie's Revenge

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/100/63/75/63/25/13 | L10 13% | freeze-ray 50% on L10 | - | 15/16 |
| Normal | 100/100/100/100/100/50/50/75/38/13 | L10 13% | knight-hop 63% on L10 | - | 13/16 |
| Hard | 100/100/100/100/88/88/50/25/0/38 | L9 0% | knight-hop 50% on L10 | - | 14/16 |
| Nightmare | 100/100/100/100/88/100/63/63/13/38 | L9 13% | freeze-ray 50% on L10 | - | 9/16 |

### Full runs — Rookie's Revenge (authored, random picks)

16 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **10/16 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 16 | 16 | 100% | - |
| 2 | 16 | 16 | 100% | - |
| 3 | 16 | 16 | 100% | - |
| 4 | 16 | 16 | 100% | - |
| 5 | 16 | 16 | 100% | - |
| 6 | 16 | 16 | 100% | - |
| 7 | 16 | 16 | 100% | - |
| 8 | 16 | 14 | 88% | move-limit 1, captured 1 |
| 9 | 14 | 14 | 100% | - |
| 10 | 14 | 10 | 71% | captured 2, move-limit 2 |

Most-picked cards: bishop-step 25, queen-pulse 23, knight-hop 16, freeze-ray 11, aegis 5, vanguard 5, smoke 5, squad 5.

## The Vault (`revenge-10`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 16 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 2 | 85-100% | **100%** | 3 tied 100% | knight-hop 94% | knight-hop 94% | 1 | - | 4.5 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3.9 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 5 | 75-100% | **44%** (c1,m8) **too hard** | 4 tied 100% | bishop-step 100% | swap 56% | - | 12 | 9.3 | - |
| 6 | 35-65% | **38%** (c1,m9) | 3 tied 100% | freeze-ray 75% **low** | swap 38% | - | 12 | 10.6 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **13%** (c3,m11) **too hard** | 2 tied 100% | knight-hop 81% | sacrifice 31% | - | 13 | 10.6 | none no6, 4/4 finishers proven |
| 8 | 35-65% | **25%** (c3,m9) **too hard** | 2 tied 100% | knight-hop 81% | sacrifice 6% | - | 15 | 11.8 | none no6, 4/4 finishers proven |
| 9 | 15-45% | **25%** (c1,m11) | 3 tied 100% | freeze-ray 94% | swap 13% | - | 8 | 7.1 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **25%** (m12) | 3 tied 100% | freeze-ray 94% | sacrifice 31% | - | 9 | 8.4 | none no6, 4/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-squire | bishop-step | boulder | convert | decoy | dragon | duchess | freeze-ray | knight-hop | magnet | page | poison-dart | queen-pulse | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% s1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 44% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 75% | 100% | 100% | 100% | 56% | 100% | 100% |
| 6 | 38% | 100% | 100% | 100% | 100% | 88% | 88% | 100% | 100% | 100% | **75%** | 100% | 94% | 94% | 100% | 100% | 100% | 100% | 44% | 100% | 100% | 100% | 38% | 94% | 100% |
| 7 | 13% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 94% | 94% | 94% | 81% | 75% | 94% | 100% | 100% | 100% | 75% | 31% | 100% | 100% | 94% | 44% | 94% | 100% |
| 8 | 25% | 100% | 100% | 100% | 88% | 81% | 88% | 100% | 100% | 81% | 100% | 81% | 75% | 94% | 88% | 100% | 100% | 94% | 6% | 94% | 81% | 94% | 13% | 100% | 100% |
| 9 | 25% | 100% | 100% | 100% | 100% | 94% | 94% | 100% | 100% | 100% | 94% | 100% | 94% | 81% | 100% | 100% | 100% | 100% | 38% | 94% | 75% | 100% | 13% | 100% | 100% |
| 10 | 25% | 100% | 100% | 88% | 100% | 100% | 94% | 100% | 100% | 100% | 94% | 100% | 100% | 88% | 88% | 100% | 100% | 100% | 31% | 88% | 100% | 100% | 50% | 100% | 100% |

**Verdict:** needs a look 
- too easy — new player clears 83% on Normal (target 40-60%)
- L2 has 1 stall (king unreachable)
- L6 freeze-ray only 75% (every finisher must be at least 80%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L5 no-ability 44% is too hard for the legacy band (75-100%); L7 no-ability 13% is too hard for the legacy band (40-70%); L8 no-ability 25% is too hard for the legacy band (35-65%).

### Difficulty modes — The Vault

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/88/75/50/13/50/75 | L8 13% | freeze-ray 88% on L6 | - | 15/16 |
| Normal | 100/100/100/100/75/50/13/13/25/13 | L7 13% | knight-hop 75% on L2 | 3 | 13/16 |
| Hard | 100/100/100/100/63/0/38/0/25/13 | L6 0% | knight-hop 75% on L2 | 2 | 9/16 |
| Nightmare | 100/100/100/100/50/25/38/0/0/0 | L8 0% | freeze-ray 75% on L6 | 1 | 11/16 |

### Full runs — The Vault (authored, random picks)

16 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **12/16 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 16 | 16 | 100% | - |
| 2 | 16 | 16 | 100% | - |
| 3 | 16 | 16 | 100% | - |
| 4 | 16 | 16 | 100% | - |
| 5 | 16 | 16 | 100% | - |
| 6 | 16 | 15 | 94% | move-limit 1 |
| 7 | 15 | 14 | 93% | move-limit 1 |
| 8 | 14 | 13 | 93% | move-limit 1 |
| 9 | 13 | 13 | 100% | - |
| 10 | 13 | 12 | 92% | captured 1 |

Most-picked cards: knight-hop 27, queen-pulse 22, bishop-step 13, freeze-ray 12, rewind 6, aegis 4, squad 4, dragon 3.

## Pawn Storm (`revenge-2`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 16 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.5 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 3 | 85-100% | **100%** | 2 tied 100% | bishop-step 75% **low** | bishop-step 75% | 6 | - | 2.8 | - |
| 4 | 85-100% | **100%** | 3 tied 100% | bishop-step 94% | bishop-step 94% | 1 | - | 9.1 | - |
| 5 | 75-100% | **100%** | 4 tied 100% | bishop-step 100% | swap 88% | - | 12 | 7 | - |
| 6 | 35-65% | **63%** (m6) | 4 tied 100% | bishop-step 100% | sacrifice 44% | - | 11 | 8.8 | none W6, 4/4 finishers proven |
| 7 | 40-70% | **69%** (m5) | 4 tied 100% | bishop-step 100% | magnet 63% | - | 14 | 10.4 | none W6, 4/4 finishers proven |
| 8 | 35-65% | **63%** (c4,m2) | 4 tied 100% | bishop-step 100% | swap 50% | - | 10 | 6.6 | none W6, 4/4 finishers proven |
| 9 | 15-45% | **25%** (c4,m8) | 3 tied 100% | freeze-ray 81% | swap 19% | - | 16 | 11.9 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **44%** (c7,m2) | 3 tied 100% | knight-hop 94% | sacrifice 25% | - | 18 | 11.2 | none no6, 4/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-squire | bishop-step | boulder | convert | decoy | dragon | duchess | freeze-ray | knight-hop | magnet | page | poison-dart | queen-pulse | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | **75%** s4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 88% s2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 94% s1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 88% | 100% | 100% |
| 6 | 63% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 63% | 88% | 100% | 100% | 100% | 100% | 44% | 100% | 100% | 100% | 44% | 100% | 100% |
| 7 | 69% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 63% | 94% | 100% | 100% | 100% | 100% | 69% | 100% | 100% | 100% | 69% | 100% | 100% |
| 8 | 63% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 56% | 94% | 100% | 100% | 100% | 100% | 81% | 100% | 100% | 100% | 50% | 100% | 100% |
| 9 | 25% | 100% | 100% | 100% | 100% | 94% | 94% | 100% | 100% | 100% | 81% | 100% | 75% | 81% | 100% | 100% | 100% | 100% | 31% | 100% | 81% | 100% | 19% | 100% | 100% |
| 10 | 44% | 94% | 100% | 81% | 100% | 69% | 88% | 100% | 94% | 100% | 100% | 94% | 69% | 63% | 81% | 100% | 100% | 88% | 25% | 88% | 94% | 81% | 38% | 94% | 100% |

**Verdict:** needs a look 
- TOO EASY — a new player clears 88% of runs on Normal (target 40-60%)
- L3 bishop-step only 75% (every finisher must be at least 80%)
- L3 has 6 stalls (king unreachable)
- L4 has 1 stall (king unreachable)

### Difficulty modes — Pawn Storm

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/100/88/38/75/25/75 | L9 25% | freeze-ray 63% on L9 | - | 15/16 |
| Normal | 100/100/100/100/88/63/38/63/0/25 | L9 0% | freeze-ray 25% on L9 | 1 | 14/16 |
| Hard | 100/100/100/100/100/100/75/13/13/13 | L8 13% | freeze-ray 75% on L8 | - | 13/16 |
| Nightmare | 100/100/100/100/100/63/63/38/13/13 | L9 13% | freeze-ray 38% on L9 | - | 12/16 |

### Full runs — Pawn Storm (authored, random picks)

16 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **12/16 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 16 | 16 | 100% | - |
| 2 | 16 | 16 | 100% | - |
| 3 | 16 | 15 | 94% | stall 1 |
| 4 | 15 | 15 | 100% | - |
| 5 | 15 | 15 | 100% | - |
| 6 | 15 | 15 | 100% | - |
| 7 | 15 | 15 | 100% | - |
| 8 | 15 | 15 | 100% | - |
| 9 | 15 | 15 | 100% | - |
| 10 | 15 | 12 | 80% | captured 3 |

Most-picked cards: queen-pulse 21, bishop-step 18, freeze-ray 17, vanguard 11, knight-hop 10, squad 6, aegis 4, dragon 3.

## The Royal Guard (`revenge-3`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 16 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3.5 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 7.1 | - |
| 5 | 75-100% | **88%** (m2) | 4 tied 100% | bishop-step 100% | swap 75% | - | 13 | 8.7 | - |
| 6 | 35-65% | **38%** (m10) | 4 tied 100% | bishop-step 100% | swap 25% | - | 14 | 12.7 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **38%** (c4,m6) **too hard** | 2 tied 100% | knight-hop 81% | sacrifice 38% | - | 18 | 10.9 | none no6, 3/4 finishers proven |
| 8 | 35-65% | **19%** (c8,m5) **too hard** | queen-pulse 100% | freeze-ray 75% **low** | sacrifice 13% | - | 14 | 10.5 | none no6, 0/4 finishers proven |
| 9 | 15-45% | **13%** (c1,m13) **too hard** | queen-pulse 100% | bishop-step 94% | swap 19% | - | 14 | 13.7 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **19%** (c3,m10) | 4 tied 100% | bishop-step 100% | swap 31% | - | 19 | 14.7 | none no6, 3/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-squire | bishop-step | boulder | convert | decoy | dragon | duchess | freeze-ray | knight-hop | magnet | page | poison-dart | queen-pulse | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 88% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 88% | 100% | 94% | 100% | 75% | 100% | 100% |
| 6 | 38% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 81% | 100% | 94% | 100% | 100% | 100% | 63% | 88% | 100% | 100% | 25% | 94% | 100% |
| 7 | 38% | 100% | 100% | 88% | 100% | 94% | 100% | 100% | 94% | 94% | 88% | 81% | 44% | 88% | 94% | 100% | 100% | 100% | 38% | 100% | 100% | 100% | 38% | 94% | 100% |
| 8 | 19% | 100% | 100% | 94% | 94% | 81% | 81% | 100% | 100% | 94% | **75%** | 81% | 31% | 63% | 94% | 100% | 94% | 94% | 13% | 100% | 56% | 94% | 13% | 100% | 88% |
| 9 | 13% | 94% | 100% | 100% | 94% | 94% | 100% | 100% | 100% | 100% | 94% | 94% | 50% | 94% | 100% | 100% | 100% | 88% | 38% | 88% | 94% | 94% | 19% | 100% | 100% |
| 10 | 19% | 100% | 100% | 63% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 81% | 75% | 94% | 100% | 100% | 94% | 50% | 100% | 81% | 100% | 31% | 88% | 100% |

**Verdict:** needs a look 
- too easy — new player clears 75% on Normal (target 40-60%)
- L8 freeze-ray only 75% (every finisher must be at least 80%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L7 no-ability 38% is too hard for the legacy band (40-70%); L8 no-ability 19% is too hard for the legacy band (35-65%); L9 no-ability 13% is too hard for the legacy band (15-45%).

### Difficulty modes — The Royal Guard

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/88/88/75/38/25/50 | L9 25% | freeze-ray 88% on L7 | - | 12/16 |
| Normal | 100/100/100/100/100/25/38/0/25/25 | L8 0% | freeze-ray 63% on L8 | - | 11/16 |
| Hard | 100/100/100/100/100/50/50/13/13/38 | L8 13% | freeze-ray 38% on L8 | 1 | 12/16 |
| Nightmare | 100/100/100/100/100/38/88/13/0/50 | L9 0% | freeze-ray 50% on L8 | - | 11/16 |

### Full runs — The Royal Guard (authored, random picks)

16 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **10/16 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 16 | 16 | 100% | - |
| 2 | 16 | 16 | 100% | - |
| 3 | 16 | 16 | 100% | - |
| 4 | 16 | 16 | 100% | - |
| 5 | 16 | 16 | 100% | - |
| 6 | 16 | 16 | 100% | - |
| 7 | 16 | 15 | 94% | captured 1 |
| 8 | 15 | 11 | 73% | move-limit 3, captured 1 |
| 9 | 11 | 10 | 91% | captured 1 |
| 10 | 10 | 10 | 100% | - |

Most-picked cards: knight-hop 25, bishop-step 18, queen-pulse 16, freeze-ray 9, convert 7, aegis 4, dragon 4, boulder 3.

## The Fortress (`revenge-4`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 16 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3.3 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 4.9 | - |
| 5 | 75-100% | **88%** (m2) | 4 tied 100% | bishop-step 100% | sacrifice 88% | - | 14 | 8.4 | - |
| 6 | 35-65% | **69%** (m5) **too easy** | 4 tied 100% | bishop-step 100% | sacrifice 50% | - | 11 | 8.4 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **44%** (c3,m6) | 4 tied 100% | bishop-step 100% | swap 50% | - | 14 | 10.9 | none W6, 4/4 finishers proven |
| 8 | 35-65% | **63%** (m6) | 4 tied 100% | bishop-step 100% | sacrifice 44% | - | 10 | 8.6 | none no6, 4/4 finishers proven |
| 9 | 15-45% | **13%** (c8,m6) **too hard** | 2 tied 100% | freeze-ray 75% **low** | sacrifice 31% | - | 17 | 10.8 | none no6, 0/4 finishers proven |
| 10 | 15-45% | **44%** (c3,m6) | bishop-step 100% | freeze-ray 75% **low** | swap 50% | - | 14 | 9.3 | none no6, 0/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-squire | bishop-step | boulder | convert | decoy | dragon | duchess | freeze-ray | knight-hop | magnet | page | poison-dart | queen-pulse | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 88% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 88% | 100% | 94% | 100% | 88% | 100% | 100% |
| 6 | 69% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 69% | 100% | 100% | 100% | 100% | 50% | 100% | 100% | 100% | 63% | 100% | 100% |
| 7 | 44% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 88% | 100% | 100% | 100% | 100% | 100% | 81% | 100% | 100% | 100% | 50% | 100% | 100% |
| 8 | 63% | 100% | 100% | 94% | 100% | 94% | 94% | 100% | 100% | 100% | 100% | 100% | 94% | 88% | 100% | 100% | 100% | 100% | 44% | 100% | 100% | 75% | 69% | 100% | 100% |
| 9 | 13% | 100% | 100% | 50% | 100% | 50% | 100% | 100% | 88% | 100% | **75%** | **75%** | 63% | 50% | 100% | 100% | 100% | 94% | 31% | 88% | 63% | 94% | 31% | 88% | 100% |
| 10 | 44% | 94% | 100% | 88% | 100% | 94% | 88% | 100% | 94% | 100% | **75%** | 94% | 81% | 81% | 81% | 94% | 100% | 88% | 63% | 100% | 69% | 88% | 50% | 94% | 94% |

**Verdict:** needs a look 
- too easy — new player clears 71% on Normal (target 40-60%)
- L9 freeze-ray only 75% (every finisher must be at least 80%)
- L10 freeze-ray only 75% (every finisher must be at least 80%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L6 no-ability 69% is too easy for the legacy band (35-65%); L9 no-ability 13% is too hard for the legacy band (15-45%).

### Difficulty modes — The Fortress

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/88/75/38/88/38/38 | L7 38% | freeze-ray 63% on L9 | - | 14/16 |
| Normal | 100/100/100/100/88/38/50/75/38/38 | L6 38% | knight-hop 50% on L9 | - | 12/16 |
| Hard | 100/100/100/100/75/75/75/38/0/25 | L9 0% | queen-pulse 38% on L9 | - | 11/16 |
| Nightmare | 100/100/100/100/100/88/63/13/13/13 | L8 13% | freeze-ray 50% on L9 | - | 10/16 |

### Full runs — The Fortress (authored, random picks)

16 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **14/16 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 16 | 16 | 100% | - |
| 2 | 16 | 16 | 100% | - |
| 3 | 16 | 16 | 100% | - |
| 4 | 16 | 16 | 100% | - |
| 5 | 16 | 16 | 100% | - |
| 6 | 16 | 16 | 100% | - |
| 7 | 16 | 16 | 100% | - |
| 8 | 16 | 15 | 94% | move-limit 1 |
| 9 | 15 | 14 | 93% | captured 1 |
| 10 | 14 | 14 | 100% | - |

Most-picked cards: bishop-step 25, queen-pulse 21, knight-hop 12, freeze-ray 10, bishop-squire 8, convert 6, dragon 5, vanguard 5.

## Stonework (`revenge-5`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 16 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 1.6 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.7 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.9 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 5 | - |
| 5 | 75-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | 11 | 5.3 | - |
| 6 | 35-65% | **69%** (m5) **too easy** | 4 tied 100% | bishop-step 100% | sacrifice 56% | - | 11 | 8.5 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **38%** (m10) **too hard** | 4 tied 100% | bishop-step 100% | sacrifice 56% | - | 12 | 11.1 | none no6, 4/4 finishers proven |
| 8 | 35-65% | **100%** **too easy** | 4 tied 100% | bishop-step 100% | squad 31% | - | 11 | 5.8 | none W6, 4/4 finishers proven |
| 9 | 15-45% | **50%** (m8) **too easy** | 4 tied 100% | bishop-step 100% | sacrifice 38% | - | 15 | 12.1 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **19%** (c7,m6) | 3 tied 100% | freeze-ray 88% | swap 19% | - | 21 | 14 | none no6, 4/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-squire | bishop-step | boulder | convert | decoy | dragon | duchess | freeze-ray | knight-hop | magnet | page | poison-dart | queen-pulse | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 6 | 69% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 88% | 88% | 100% | 100% | 94% | 100% | 56% | 100% | 81% | 100% | 75% | 100% | 100% |
| 7 | 38% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 100% | 81% | 88% | 100% | 100% | 100% | 100% | 56% | 100% | 81% | 94% | 56% | 100% | 100% |
| 8 | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 31% | 100% | 100% | 100% | 100% |
| 9 | 50% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 81% | 50% | 100% | 100% | 100% | 100% | 38% | 100% | 100% | 100% | 38% | 100% | 100% |
| 10 | 19% | 100% | 100% | 88% | 100% | 94% | 100% | 100% | 100% | 100% | 88% | 100% | 94% | 81% | 88% | 100% | 100% | 100% | 50% | 100% | 88% | 100% | 19% | 100% | 100% |

**Verdict:** needs a look 
- too easy — new player clears 83% on Normal (target 40-60%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L6 no-ability 69% is too easy for the legacy band (35-65%); L7 no-ability 38% is too hard for the legacy band (40-70%); L8 no-ability 100% is too easy for the legacy band (35-65%); L9 no-ability 50% is too easy for the legacy band (15-45%).

### Difficulty modes — Stonework

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/100/63/63/100/50/38 | L10 38% | freeze-ray 75% on L10 | - | 13/16 |
| Normal | 100/100/100/100/88/50/38/100/75/13 | L10 13% | bishop-step 100% on L1 | - | 12/16 |
| Hard | 100/100/100/100/100/75/88/100/38/50 | L9 38% | freeze-ray 88% on L10 | - | 14/16 |
| Nightmare | 100/100/100/100/100/38/100/100/25/50 | L9 25% | freeze-ray 63% on L10 | - | 13/16 |

### Full runs — Stonework (authored, random picks)

16 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **14/16 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 16 | 16 | 100% | - |
| 2 | 16 | 16 | 100% | - |
| 3 | 16 | 16 | 100% | - |
| 4 | 16 | 16 | 100% | - |
| 5 | 16 | 16 | 100% | - |
| 6 | 16 | 16 | 100% | - |
| 7 | 16 | 15 | 94% | move-limit 1 |
| 8 | 15 | 14 | 93% | move-limit 1 |
| 9 | 14 | 14 | 100% | - |
| 10 | 14 | 14 | 100% | - |

Most-picked cards: bishop-step 23, queen-pulse 20, knight-hop 17, freeze-ray 12, vanguard 6, dragon 5, duchess 5, aegis 4.

## Two Keys (`revenge-6`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 16 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.7 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.8 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 4.6 | - |
| 5 | 75-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | 12 | 3.9 | - |
| 6 | 35-65% | **69%** (m5) **too easy** | 3 tied 100% | freeze-ray 94% | swap 56% | - | 12 | 9.9 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **75%** (m4) **too easy** | 4 tied 100% | bishop-step 100% | swap 63% | - | 11 | 9.6 | none no6, 4/4 finishers proven |
| 8 | 35-65% | **44%** (c1,m8) | 2 tied 100% | freeze-ray 94% | sacrifice 38% | - | 15 | 12.8 | none no6, 4/4 finishers proven |
| 9 | 15-45% | **63%** (m6) **too easy** | 4 tied 100% | bishop-step 100% | sacrifice 31% | - | 15 | 12 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **25%** (c4,m8) | 3 tied 100% | knight-hop 94% | sacrifice 25% | - | 19 | 15.6 | none no6, 3/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-squire | bishop-step | boulder | convert | decoy | dragon | duchess | freeze-ray | knight-hop | magnet | page | poison-dart | queen-pulse | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 6 | 69% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 75% | 81% | 100% | 100% | 100% | 100% | 63% | 100% | 94% | 100% | 56% | 100% | 100% |
| 7 | 75% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 81% | 94% | 100% | 100% | 100% | 100% | 75% | 100% | 100% | 100% | 63% | 100% | 100% |
| 8 | 44% | 100% | 100% | 100% | 100% | 88% | 94% | 100% | 100% | 100% | 94% | 94% | 88% | 75% | 100% | 100% | 100% | 100% | 38% | 94% | 100% | 100% | 38% | 94% | 100% |
| 9 | 63% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 75% | 69% | 100% | 100% | 100% | 100% | 31% | 100% | 100% | 100% | 38% | 100% | 100% |
| 10 | 25% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 94% | 94% | 94% | 100% | 100% | 100% | 25% | 94% | 81% | 100% | 50% | 100% | 100% |

**Verdict:** needs a look 
- TOO EASY — a new player clears 96% of runs on Normal (target 40-60%)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L6 no-ability 69% is too easy for the legacy band (35-65%); L7 no-ability 75% is too easy for the legacy band (40-70%); L9 no-ability 63% is too easy for the legacy band (15-45%).

### Difficulty modes — Two Keys

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/100/100/88/50/50/63 | L8 50% | freeze-ray 75% on L8 | - | 14/16 |
| Normal | 100/100/100/100/100/50/75/13/25/63 | L8 13% | knight-hop 88% on L10 | - | 16/16 |
| Hard | 100/100/100/100/100/100/88/50/13/50 | L9 13% | freeze-ray 75% on L8 | - | 15/16 |
| Nightmare | 100/100/100/100/100/88/88/63/25/38 | L9 25% | knight-hop 88% on L9 | - | 16/16 |

### Full runs — Two Keys (authored, random picks)

16 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **13/16 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 16 | 16 | 100% | - |
| 2 | 16 | 16 | 100% | - |
| 3 | 16 | 16 | 100% | - |
| 4 | 16 | 16 | 100% | - |
| 5 | 16 | 16 | 100% | - |
| 6 | 16 | 16 | 100% | - |
| 7 | 16 | 16 | 100% | - |
| 8 | 16 | 16 | 100% | - |
| 9 | 16 | 16 | 100% | - |
| 10 | 16 | 13 | 81% | move-limit 3 |

Most-picked cards: bishop-step 25, queen-pulse 21, knight-hop 19, squad 8, duchess 7, freeze-ray 6, dragon 5, aegis 4.

## Bramble Crown (`revenge-7`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 16 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.4 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3 | - |
| 4 | 85-100% | **100%** | 2 tied 100% | bishop-step 81% | bishop-step 81% | 5 | - | 3.9 | - |
| 5 | 75-100% | **100%** | 4 tied 100% | bishop-step 100% | magnet 94% | - | 11 | 5.6 | - |
| 6 | 35-65% | **75%** (c2,m2) **too easy** | 4 tied 100% | bishop-step 100% | swap 38% | - | 12 | 8.1 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **69%** (m5) | 4 tied 100% | bishop-step 100% | sacrifice 56% | - | 13 | 9.8 | none W6, 4/4 finishers proven |
| 8 | 35-65% | **31%** (c1,m10) **too hard** | 3 tied 100% | freeze-ray 94% | sacrifice 13% | - | 15 | 13 | none no6, 4/4 finishers proven |
| 9 | 15-45% | **19%** (c6,m7) | 4 tied 100% | bishop-step 100% | sacrifice 19% | - | 14 | 10.3 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **19%** (c4,m9) | 4 tied 100% | bishop-step 100% | sacrifice 13% | - | 21 | 16.4 | none no6, 4/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-squire | bishop-step | boulder | convert | decoy | dragon | duchess | freeze-ray | knight-hop | magnet | page | poison-dart | queen-pulse | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 81% s3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 88% s2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% |
| 6 | 75% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 56% | 100% | 100% | 100% | 100% | 75% | 100% | 100% | 100% | 38% | 100% | 100% |
| 7 | 69% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 69% | 100% | 100% | 100% | 100% | 100% | 56% | 100% | 100% | 100% | 81% | 100% | 100% |
| 8 | 31% | 100% | 100% | 100% | 100% | 81% | 100% | 100% | 100% | 100% | 94% | 100% | 88% | 69% | 100% | 100% | 100% | 100% | 13% | 100% | 100% | 100% | 38% | 100% | 100% |
| 9 | 19% | 94% | 100% | 69% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 81% | 94% | 100% | 100% | 100% | 100% | 19% | 88% | 63% | 100% | 19% | 100% | 100% |
| 10 | 19% | 100% | 100% | 81% | 100% | 94% | 94% | 100% | 100% | 100% | 100% | 100% | 88% | 63% | 100% | 100% | 100% | 100% | 13% | 100% | 81% | 100% | 13% | 100% | 100% |

**Verdict:** needs a look 
- TOO EASY — a new player clears 92% of runs on Normal (target 40-60%)
- L4 has 5 stalls (king unreachable)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L6 no-ability 75% is too easy for the legacy band (35-65%); L8 no-ability 31% is too hard for the legacy band (35-65%).

### Difficulty modes — Bramble Crown

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/100/63/50/88/13/13 | L9 13% | freeze-ray 75% on L8 | - | 16/16 |
| Normal | 100/100/100/100/100/25/88/63/0/25 | L9 0% | queen-pulse 75% on L4 | 2 | 14/16 |
| Hard | 100/100/100/100/100/100/50/50/25/13 | L10 13% | bishop-step 63% on L3 | 5 | 10/16 |
| Nightmare | 100/100/100/100/100/88/50/50/25/25 | L9 25% | queen-pulse 50% on L3 | 5 | 10/16 |

### Full runs — Bramble Crown (authored, random picks)

16 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **12/16 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 16 | 16 | 100% | - |
| 2 | 16 | 16 | 100% | - |
| 3 | 16 | 16 | 100% | - |
| 4 | 16 | 15 | 94% | stall 1 |
| 5 | 15 | 15 | 100% | - |
| 6 | 15 | 15 | 100% | - |
| 7 | 15 | 15 | 100% | - |
| 8 | 15 | 14 | 93% | move-limit 1 |
| 9 | 14 | 13 | 93% | captured 1 |
| 10 | 13 | 12 | 92% | captured 1 |

Most-picked cards: queen-pulse 20, bishop-step 20, knight-hop 18, freeze-ray 16, duchess 13, aegis 5, dragon 4, bishop-squire 4.

## The Rampart (`revenge-8`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 16 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 1.9 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 2.8 | - |
| 3 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 8.9 | - |
| 4 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3.8 | - |
| 5 | 75-100% | **81%** (m3) | 4 tied 100% | bishop-step 100% | sacrifice 94% | - | 11 | 7.3 | - |
| 6 | 35-65% | **63%** (m6) | 4 tied 100% | bishop-step 100% | swap 50% | - | 10 | 7.8 | none W6, 4/4 finishers proven |
| 7 | 40-70% | **50%** (c1,m7) | 4 tied 100% | bishop-step 100% | swap 63% | - | 11 | 9.6 | none W6, 4/4 finishers proven |
| 8 | 35-65% | **63%** (c2,m4) | 4 tied 100% | bishop-step 100% | sacrifice 38% | - | 13 | 11.4 | none no6, 4/4 finishers proven |
| 9 | 15-45% | **25%** (m12) | 4 tied 100% | bishop-step 100% | sacrifice 25% | - | 14 | 13.3 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **44%** (c3,m6) | 2 tied 100% | freeze-ray 88% | squad 25% | - | 16 | 11.3 | none no6, 0/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-squire | bishop-step | boulder | convert | decoy | dragon | duchess | freeze-ray | knight-hop | magnet | page | poison-dart | queen-pulse | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 81% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 100% |
| 6 | 63% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 56% | 88% | 100% | 100% | 100% | 100% | 81% | 100% | 100% | 100% | 50% | 100% | 100% |
| 7 | 50% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 75% | 100% | 100% | 100% | 63% | 100% | 100% |
| 8 | 63% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 88% | 100% | 100% | 100% | 100% | 100% | 38% | 100% | 100% | 100% | 38% | 100% | 100% |
| 9 | 25% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 75% | 81% | 100% | 100% | 100% | 94% | 25% | 94% | 94% | 94% | 50% | 100% | 100% |
| 10 | 44% | 100% | 100% | 81% | 94% | 94% | 100% | 100% | 100% | 100% | 88% | 100% | 75% | 56% | 88% | 100% | 100% | 75% | 50% | 100% | 25% | 75% | 44% | 94% | 100% |

**Verdict:** needs a look 
- too easy — new player clears 79% on Normal (target 40-60%)

### Difficulty modes — The Rampart

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/88/63/88/38/75/38 | L8 38% | freeze-ray 75% on L9 | - | 14/16 |
| Normal | 100/100/100/100/88/63/63/63/38/63 | L9 38% | bishop-step 63% on L10 | 2 | 10/16 |
| Hard | 100/100/100/100/100/63/75/75/0/0 | L9 0% | freeze-ray 50% on L10 | - | 11/16 |
| Nightmare | 100/100/100/100/100/88/63/75/0/13 | L9 0% | freeze-ray 63% on L10 | - | 11/16 |

### Full runs — The Rampart (authored, random picks)

16 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **14/16 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 16 | 16 | 100% | - |
| 2 | 16 | 16 | 100% | - |
| 3 | 16 | 16 | 100% | - |
| 4 | 16 | 16 | 100% | - |
| 5 | 16 | 16 | 100% | - |
| 6 | 16 | 16 | 100% | - |
| 7 | 16 | 16 | 100% | - |
| 8 | 16 | 15 | 94% | move-limit 1 |
| 9 | 15 | 15 | 100% | - |
| 10 | 15 | 14 | 93% | move-limit 1 |

Most-picked cards: queen-pulse 23, bishop-step 17, freeze-ray 15, knight-hop 12, vanguard 8, convert 7, aegis 4, dragon 4.

## Cold Court (`revenge-9`)

Normal difficulty (= the authored level), realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10), offers dismissed, 16 trials per cell. Band = the no-ability target for that level ±15. Loss codes: c captured, m out of moves (the app calls this "No way through" when its solver proves it early — same bucket), s stall, d dead end.

| L | Band | No ability | Best finisher | Worst finisher | Worst any | Stalls | Budget | Avg moves (none) | Solver |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3 | - |
| 2 | 85-100% | **100%** | 4 tied 100% | bishop-step 100% | aegis 100% | - | - | 3 | - |
| 3 | 85-100% | **100%** | 2 tied 100% | queen-pulse 50% **low** | queen-pulse 50% | 14 | - | 3.4 | - |
| 4 | 85-100% | **100%** | 3 tied 100% | queen-pulse 94% | convert 94% | 1 | - | 5.8 | - |
| 5 | 75-100% | **63%** (m6) **too hard** | 4 tied 100% | bishop-step 100% | swap 44% | - | 16 | 11.9 | - |
| 6 | 35-65% | **50%** (m8) | 4 tied 100% | bishop-step 100% | sacrifice 38% | - | 12 | 10.6 | none no6, 4/4 finishers proven |
| 7 | 40-70% | **25%** (m12) **too hard** | 4 tied 100% | bishop-step 100% | swap 13% | - | 11 | 10.1 | none no6, 4/4 finishers proven |
| 8 | 35-65% | **50%** (c2,m6) | 3 tied 100% | freeze-ray 94% | swap 38% | - | 12 | 9 | none no6, 4/4 finishers proven |
| 9 | 15-45% | **25%** (c2,m10) | 3 tied 100% | queen-pulse 94% | sacrifice 13% | - | 13 | 11.1 | none no6, 4/4 finishers proven |
| 10 | 15-45% | **31%** (c3,m8) | 4 tied 100% | bishop-step 100% | sacrifice 6% | - | 13 | 11.5 | none no6, 4/4 finishers proven |

Every ability, win % at realistic tiers:

| L | none | aegis | become-king | bishop-squire | bishop-step | boulder | convert | decoy | dragon | duchess | freeze-ray | knight-hop | magnet | page | poison-dart | queen-pulse | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | **63%** s6 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | **50%** s8 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 94% s1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 63% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 75% | 100% | 100% | 100% | 100% | 100% | 69% | 100% | 100% | 100% | 44% | 100% | 100% |
| 6 | 50% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 100% | 94% | 100% | 88% | 100% | 100% | 100% | 38% | 100% | 100% | 100% | 38% | 100% | 100% |
| 7 | 25% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 75% | 94% | 100% | 100% | 100% | 100% | 31% | 94% | 100% | 100% | 13% | 100% | 100% |
| 8 | 50% | 100% | 100% | 88% | 100% | 88% | 100% | 100% | 100% | 100% | 94% | 100% | 88% | 69% | 100% | 100% | 100% | 100% | 44% | 100% | 81% | 88% | 38% | 100% | 100% |
| 9 | 25% | 100% | 100% | 81% | 100% | 94% | 88% | 100% | 94% | 81% | 100% | 100% | 50% | 69% | 100% | 94% | 100% | 100% | 13% | 81% | 19% | 100% | 25% | 94% | 100% |
| 10 | 31% | 100% | 100% | 94% | 100% | 100% | 100% | 100% | 94% | 100% | 100% | 100% | 81% | 94% | 100% | 100% | 100% | 100% | 6% | 100% | 56% | 94% | 13% | 100% | 100% |

**Verdict:** needs a look 
- too easy — new player clears 67% on Normal (target 40-60%)
- L3 queen-pulse only 50% (every finisher must be at least 80%)
- L3 has 14 stalls (king unreachable)
- L4 has 1 stall (king unreachable)

No-ability vs the legacy band (informational only — this column measures a player who cannot exist, since offers on L1/3/6/9 are forced): L5 no-ability 63% is too hard for the legacy band (75-100%); L7 no-ability 25% is too hard for the legacy band (40-70%).

### Difficulty modes — Cold Court

T1 loadouts, no-ability + the five finishers, 8 trials per cell. "No ability" is what a beginner who ignores powers feels; "worst finisher" is the safety net. A new profile starts on **Rookie** (still king on L1-4, +4 moves, unlimited retries) — that row is what most first-time players actually meet; the big table above is Normal.

| Mode | No-ability curve L1→L10 | Hardest level (none) | Worst finisher | Stalls | Full runs (random picks) |
|---|---|---|---|---|---|
| Rookie | 100/100/100/100/38/63/63/63/25/38 | L9 25% | bishop-step 88% on L9 | - | 15/16 |
| Normal | 100/100/100/100/63/50/50/50/13/50 | L9 13% | queen-pulse 13% on L3 | 9 | 8/16 |
| Hard | 100/100/100/100/50/100/50/88/25/0 | L10 0% | bishop-step 63% on L3 | 5 | 12/16 |
| Nightmare | 100/100/100/100/75/75/13/75/25/25 | L7 13% | queen-pulse 63% on L3 | 3 | 10/16 |

### Full runs — Cold Court (authored, random picks)

16 runs L1→L10, a random card from every offer, abilities and tempo carried like the app. **8/16 full clears.**

| L | Reached | Cleared | Clear % | Losses |
|---|---|---|---|---|
| 1 | 16 | 16 | 100% | - |
| 2 | 16 | 16 | 100% | - |
| 3 | 16 | 14 | 88% | stall 2 |
| 4 | 14 | 13 | 93% | stall 1 |
| 5 | 13 | 13 | 100% | - |
| 6 | 13 | 13 | 100% | - |
| 7 | 13 | 12 | 92% | move-limit 1 |
| 8 | 12 | 11 | 92% | move-limit 1 |
| 9 | 11 | 10 | 91% | move-limit 1 |
| 10 | 10 | 8 | 80% | captured 1, move-limit 1 |

Most-picked cards: queen-pulse 18, knight-hop 17, bishop-step 15, freeze-ray 13, vanguard 6, aegis 4, dragon 4, duchess 4.

## Biggest movers vs last night

Compared 2340 cells against 2026-09-01. Anything over 15 points is listed; with 16 trials a 15-point move is about two standard errors, so treat single cells with suspicion and clusters as real.

| Run | Mode | L | Loadout | Before | After | Change |
|---|---|---|---|---|---|---|
| revenge-2 | hard | 10 | surge | 7% | 88% | +81 |
| revenge-2 | realistic | 10 | rewind | 8% | 88% | +80 |
| revenge-2 | rookie | 10 | freeze-ray | 20% | 100% | +80 |
| revenge-3 | realistic | 8 | rewind | 15% | 94% | +79 |
| revenge-2 | normal | 10 | freeze-ray | 0% | 75% | +75 |
| revenge-5 | realistic | 10 | rewind | 25% | 100% | +75 |
| revenge-2 | rookie | 10 | bishop-step | 27% | 100% | +73 |
| revenge-2 | realistic | 10 | freeze-ray | 28% | 100% | +72 |
| revenge-5 | realistic | 7 | rewind | 30% | 100% | +70 |
| revenge-6 | realistic | 10 | rewind | 30% | 100% | +70 |
| revenge-3 | realistic | 6 | rewind | 33% | 100% | +67 |
| revenge-3 | realistic | 10 | rewind | 30% | 94% | +64 |
| revenge-2 | rookie | 10 | none | 13% | 75% | +62 |
| revenge-2 | rookie | 10 | queen-pulse | 27% | 88% | +61 |
| revenge-2 | normal | 10 | bishop-step | 40% | 100% | +60 |
| revenge-5 | realistic | 9 | rewind | 40% | 100% | +60 |
| revenge-2 | realistic | 8 | rewind | 43% | 100% | +57 |
| revenge-2 | realistic | 9 | rewind | 45% | 100% | +55 |
| revenge-2 | hard | 10 | freeze-ray | 20% | 75% | +55 |
| revenge-2 | nightmare | 10 | freeze-ray | 20% | 75% | +55 |
| … | | | | | | 166 more |

- **NEW STALL** revenge-2 realistic L3 bishop-step: 4 games timed out with the king alive.
- **NEW STALL** revenge-2 realistic L3 queen-pulse: 2 games timed out with the king alive.
- **NEW STALL** revenge-2 realistic L4 bishop-step: 1 game timed out with the king alive.
- **NEW STALL** revenge-2 normal L3 bishop-step: 1 game timed out with the king alive.
- **NEW STALL** revenge-3 hard L4 knight-hop: 1 game timed out with the king alive.
- **Left its band:** revenge-3 L7 no-ability 53% → 38% (too hard).
- **Left its band:** revenge-3 L9 no-ability 20% → 13% (too hard).
- **Left its band:** revenge-4 L6 no-ability 55% → 69% (too easy).
- **Left its band:** revenge-4 L9 no-ability 38% → 13% (too hard).
- **Left its band:** revenge-5 L6 no-ability 53% → 69% (too easy).
- **Left its band:** revenge-5 L7 no-ability 50% → 38% (too hard).
- **Left its band:** revenge-5 L9 no-ability 38% → 50% (too easy).
- **Left its band:** revenge-6 L6 no-ability 60% → 69% (too easy).
- **Left its band:** revenge-6 L9 no-ability 28% → 63% (too easy).
- Back in band: revenge-1 L8 no-ability 25% → 38%.
- Back in band: revenge-1 L10 no-ability 0% → 25%.
- Back in band: revenge-2 L10 no-ability 3% → 44%.
- Back in band: revenge-6 L10 no-ability 13% → 25%.

## What makes a level hard (feature findings)

550 level snapshots (every level × authored + each difficulty mode, across all runs). Features are counted from the starting board — total enemies, hunters vs marchers, keys on the king's lines, pen size, move budget, and so on.

**Plain-English splits (no-ability win %):**

- Levels with 23+ total material average **55 points lower** no-ability win than the rest (28% vs 84%, 125 vs 425 snapshots).
- Levels with 5+ pen squares under enemy fire average **54 points lower** no-ability win than the rest (18% vs 72%, 10 vs 540 snapshots).
- Levels with 2+ queens average **54 points lower** no-ability win than the rest (25% vs 79%, 80 vs 470 snapshots).
- Levels with 21+ hunter power (3 per minor, 9 per queen) average **54 points lower** no-ability win than the rest (27% vs 81%, 95 vs 455 snapshots).
- Levels with 16+ approach squares under fire (ranks 2-5) average **53 points lower** no-ability win than the rest (43% vs 96%, 255 vs 295 snapshots).
- Levels with 23+ squares under enemy fire average **52 points lower** no-ability win than the rest (43% vs 95%, 250 vs 300 snapshots).

**Same, for the weakest finisher's win % (the safety net):**

- 2+ enemies inside the pen: finisher floor **37 points lower** (58% vs 94%).
- 5+ pen squares under enemy fire: finisher floor **26 points lower** (68% vs 94%).
- 11+ total enemies: finisher floor **15 points lower** (81% vs 97%).
- 24+ approach squares under fire (ranks 2-5): finisher floor **15 points lower** (81% vs 96%).

**Strongest single correlations:**

| Feature | vs no-ability | vs finisher floor | High-quartile avg (none) | Low-quartile avg (none) |
|---|---|---|---|---|
| total material | -0.83 | -0.39 | 32% | 100% |
| hunter power (3 per minor, 9 per queen) | -0.81 | -0.38 | 36% | 98% |
| queens | -0.80 | -0.36 | 38% | 92% |
| squares under enemy fire | -0.77 | -0.34 | 38% | 100% |
| approach squares under fire (ranks 2-5) | -0.76 | -0.33 | 39% | 100% |
| hunters (non-pawn pieces that chase Rookie) | -0.75 | -0.37 | 40% | 98% |
| total enemies | -0.72 | -0.35 | 37% | 100% |
| pen squares under enemy fire | -0.61 | -0.32 | 41% | 85% |
| move budget | 0.61 | 0.14 | 100% | 61% |
| budget slack (moves minus distance to king) | 0.61 | 0.14 | 100% | 61% |

Reading: −1 means "more of this, harder level"; +1 means "more of this, easier". Anything past ±0.5 is worth believing at this sample size.

**All features together (ridge regression, no-ability %):** fit R² 0.76 on 550 snapshots, held-out R² 0.73 on 110.

| Feature | Points per +1 unit | Points per +1 std dev |
|---|---|---|
| approach squares under fire (ranks 2-5) | +2.7 | +19 |
| squares under enemy fire | -1.4 | -16 |
| queens | -11.7 | -9 |
| guards next to the king | +7.0 | +7 |
| empty squares on the king's lines | +3.8 | +6 |
| total material | -0.6 | -6 |

With this few snapshots the coefficients are directional, not gospel. They firm up as more runs enter the pool.

## Humans vs bot

Human runs since 2026-08-04 (supabase+disk). "Cleared" is the share of human runs that got past the level; the bot column is the random-pick full-run clear rate on the authored level.

**crucible** — 3 runs, 2 won.

| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |
|---|---|---|---|---|---|
| 1 | 3 | 3 | 100% | 100% | 0 |
| 2 | 2 | 2 | 100% | 100% | 0 |
| 3 | 2 | 2 | 100% | 100% | 0 |
| 4 | 2 | 2 | 100% | 100% | 0 |
| 5 | 2 | 2 | 100% | 100% | 0 |
| 6 | 2 | 2 | 100% | 100% | 0 |
| 7 | 2 | 2 | 100% | 100% | 0 |
| 8 | 2 | 1 | 50% | 88% | -38 |
| 9 | 1 | 1 | 100% | 100% | 0 |
| 10 | 1 | 1 | 100% | 86% | +14 |

**revenge-1** — 20 runs, 6 won.

| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |
|---|---|---|---|---|---|
| 1 | 20 | 19 | 95% | 100% | -5 |
| 2 | 19 | 19 | 100% | 100% | 0 |
| 3 | 19 | 19 | 100% | 100% | 0 |
| 4 | 19 | 18 | 95% | 100% | -5 |
| 5 | 18 | 16 | 89% | 100% | -11 |
| 6 | 16 | 15 | 94% | 100% | -6 |
| 7 | 15 | 12 | 80% | 100% | -20 |
| 8 | 12 | 10 | 83% | 88% | -5 |
| 9 | 10 | 7 | 70% | 100% | -30 |
| 10 | 7 | 6 | 86% | 71% | +15 |

**revenge-10** — 2 runs, 1 won.

| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |
|---|---|---|---|---|---|
| 1 | 2 | 2 | 100% | 100% | 0 |
| 2 | 2 | 2 | 100% | 100% | 0 |
| 3 | 2 | 2 | 100% | 100% | 0 |
| 4 | 2 | 2 | 100% | 100% | 0 |
| 5 | 2 | 2 | 100% | 100% | 0 |
| 6 | 2 | 2 | 100% | 94% | +6 |
| 7 | 2 | 2 | 100% | 93% | +7 |
| 8 | 2 | 2 | 100% | 93% | +7 |
| 9 | 2 | 1 | 50% | 100% | -50 |
| 10 | 1 | 1 | 100% | 92% | +8 |

**revenge-7** — 2 runs, 0 won.

| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |
|---|---|---|---|---|---|
| 1 | 2 | 2 | 100% | 100% | 0 |
| 2 | 2 | 2 | 100% | 100% | 0 |
| 3 | 2 | 2 | 100% | 100% | 0 |
| 4 | 2 | 2 | 100% | 94% | +6 |
| 5 | 2 | 2 | 100% | 100% | 0 |
| 6 | 2 | 2 | 100% | 100% | 0 |
| 7 | 2 | 2 | 100% | 100% | 0 |
| 8 | 2 | 2 | 100% | 93% | +7 |
| 9 | 2 | 0 | 0% | 93% | -93 |
| 10 | 0 | 0 | - | 92% | - |

**revenge-8** — 1 run, 0 won.

| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 100% | 100% | 0 |
| 2 | 1 | 1 | 100% | 100% | 0 |
| 3 | 1 | 1 | 100% | 100% | 0 |
| 4 | 1 | 1 | 100% | 100% | 0 |
| 5 | 1 | 1 | 100% | 100% | 0 |
| 6 | 1 | 0 | 0% | 100% | -100 |
| 7 | 0 | 0 | - | 100% | - |
| 8 | 0 | 0 | - | 94% | - |
| 9 | 0 | 0 | - | 100% | - |
| 10 | 0 | 0 | - | 93% | - |

**revenge-9** — 1 run, 0 won.

| L | Humans reached | Humans cleared | Human clear % | Bot clear % | Gap |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 100% | 100% | 0 |
| 2 | 1 | 1 | 100% | 100% | 0 |
| 3 | 1 | 1 | 100% | 88% | +12 |
| 4 | 1 | 1 | 100% | 93% | +7 |
| 5 | 1 | 1 | 100% | 100% | 0 |
| 6 | 1 | 1 | 100% | 100% | 0 |
| 7 | 1 | 1 | 100% | 92% | +8 |
| 8 | 1 | 0 | 0% | 92% | -92 |
| 9 | 0 | 0 | - | 91% | - |
| 10 | 0 | 0 | - | 80% | - |

Where humans fall well below the bot on a level the bot clears ability-free, the level is probably reading badly (unclear key, hidden hunter) rather than being tight. Caveat: traces written by a dev server (`data/run-playtest/human-traces/`) also include games the parity driver played through the real app — those are bot games wearing a human label.

## Watching Tyler

Replayed Tyler's real runs through the engine and asked T5 what IT would play at every verifiably reconstructed decision (learn-from-tyler.ts).

- **27 runs watched** since 2026-08-27 (8 won, 19 lost); 54% of his actions reconstructed exactly.
- **Bot agreement: 38%** across 788 decision points.
- Top lesson: The bot under-casts: at 61% of Tyler's 119 verified casts, T5 would have moved instead
- Full board-by-board report: `data/run-playtest/revenge/tyler-lessons/2026-09-03.md`

## Experiments run tonight

Each one takes a level, makes ONE change, and replays the cell at realistic tier (16 trials). Predicted vs actual tells us whether the model understands the level.

| Run | L | Change | Loadout | Baseline | Predicted | Actual | Verdict | Prediction from |
|---|---|---|---|---|---|---|---|---|
| crucible | 7 | budget +2 | none | 25% | 50% | **50%** | confirmed | mode-slope |
| crucible | 10 | remove queen a4 | knight-hop | 94% | 97% | **100%** | confirmed | regression |
| crucible | 5 | add knight d3 | none | 88% | 81% | **56%** | falsified | regression |
| revenge-10 | 5 | budget +2 | none | 44% | 66% | **63%** | confirmed | mode-slope |
| revenge-10 | 6 | remove queen g3 | freeze-ray | 75% | 78% | **100%** | falsified | regression |
| revenge-10 | 5 | add knight d3 | none | 44% | 37% | **25%** | inconclusive | regression |
| revenge-2 | 9 | budget +2 | none | 25% | 27% | **50%** | falsified | regression |
| revenge-2 | 5 | add knight d3 | none | 100% | 93% | **75%** | inconclusive | regression |
| revenge-2 | 10 | remove queen e3 | none | 44% | 59% | **50%** | confirmed | regression |
| revenge-3 | 8 | remove knight g4 | freeze-ray | 75% | 77% | **88%** | inconclusive | regression |
| revenge-3 | 9 | budget +2 | none | 13% | 19% | **31%** | inconclusive | mode-slope |
| revenge-3 | 6 | remove bishop a5 | none | 38% | 45% | **38%** | inconclusive | regression |
| revenge-4 | 7 | remove bishop d5 | none | 44% | 51% | **56%** | confirmed | regression |
| revenge-5 | 8 | budget -2 | none | 100% | 98% | **100%** | confirmed | regression |
| revenge-5 | 10 | remove knight h4 | freeze-ray | 88% | 90% | **100%** | confirmed | regression |
| revenge-5 | 5 | add knight d3 | none | 100% | 93% | **94%** | confirmed | regression |
| revenge-6 | 9 | budget -2 | none | 63% | 61% | **31%** | falsified | regression |
| revenge-6 | 6 | remove queen c4 | freeze-ray | 94% | 97% | **94%** | confirmed | regression |
| revenge-6 | 5 | add knight d3 | none | 100% | 93% | **100%** | inconclusive | regression |
| revenge-7 | 6 | budget -2 | none | 75% | 73% | **31%** | falsified | regression |
| revenge-7 | 4 | remove knight c4 | bishop-step | 81% | 83% | **100%** | inconclusive | regression |
| revenge-7 | 5 | add knight d3 | none | 100% | 93% | **94%** | confirmed | regression |
| revenge-8 | 9 | budget +2 | none | 25% | 50% | **63%** | inconclusive | mode-slope |
| revenge-8 | 10 | remove queen d4 | freeze-ray | 88% | 91% | **100%** | confirmed | regression |
| revenge-8 | 5 | add knight d3 | none | 81% | 74% | **88%** | inconclusive | regression |
| revenge-9 | 7 | budget +2 | none | 25% | 44% | **31%** | inconclusive | mode-slope |
| revenge-9 | 3 | remove bishop a2 | queen-pulse | 50% | 52% | **69%** | inconclusive | regression |
| revenge-9 | 5 | add knight d3 | none | 63% | 56% | **56%** | confirmed | regression |

- L7 no-ability is 25%, too hard for its band (40-70%). The move budget is the cleanest knob.
- knight-hop is the weakest finisher anywhere (94% on L10). The queen on a4 is the hunter closest to the king.
- L5 is the softest late level at 88% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is.
- L5 no-ability is 44%, too hard for its band (75-100%). The move budget is the cleanest knob.
- freeze-ray is the weakest finisher anywhere (75% on L6, below the 80% floor). The queen on g3 is the hunter closest to the king.
- L5 is the softest late level at 44% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is.
- Every level is in band. L9 is the tightest (25% no-ability) — measuring what +2 moves buys tells us how much room the budget knob has.
- L5 is the softest late level at 100% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is.
- L10 sits mid-curve (44%); removing its closest hunter (queen e3) measures one piece's worth.
- freeze-ray is the weakest finisher anywhere (75% on L8, below the 80% floor). The knight on g4 is the hunter closest to the king.
- L9 is the hardest level (13% no-ability); +2 moves shows how far the budget knob moves it.
- L6 sits mid-curve (38%); removing its closest hunter (bishop a5) measures one piece's worth.
- L7 sits mid-curve (44%); removing its closest hunter (bishop d5) measures one piece's worth.
- L8 no-ability is 100%, too easy for its band (35-65%). The move budget is the cleanest knob.
- freeze-ray is the weakest finisher anywhere (88% on L10). The knight on h4 is the hunter closest to the king.
- L5 is the softest late level at 100% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is.
- L9 no-ability is 63%, too easy for its band (15-45%). The move budget is the cleanest knob.
- freeze-ray is the weakest finisher anywhere (94% on L6). The queen on c4 is the hunter closest to the king.
- L5 is the softest late level at 100% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is.
- L6 no-ability is 75%, too easy for its band (35-65%). The move budget is the cleanest knob.
- bishop-step is the weakest finisher anywhere (81% on L4). The knight on c4 is the hunter closest to the king.
- L5 is the softest late level at 100% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is.
- Every level is in band. L9 is the tightest (25% no-ability) — measuring what +2 moves buys tells us how much room the budget knob has.
- freeze-ray is the weakest finisher anywhere (88% on L10). The queen on d4 is the hunter closest to the king.
- L5 is the softest late level at 81% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is.
- L7 no-ability is 25%, too hard for its band (40-70%). The move budget is the cleanest knob.
- queen-pulse is the weakest finisher anywhere (50% on L3, below the 80% floor). The bishop on a2 is the hunter closest to the king.
- L5 is the softest late level at 63% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is.

## Top 3 hypotheses for tonight

1. **L7: raise the move budget by 2 → no-ability win goes 25% → about 50%.** L7 no-ability is 25%, too hard for its band (40-70%). The move budget is the cleanest knob. Tested tonight: actual 50% (confirmed).
2. **L10: remove the queen on a4 → knight-hop win goes 94% → about 97%.** knight-hop is the weakest finisher anywhere (94% on L10). The queen on a4 is the hunter closest to the king. Tested tonight: actual 100% (confirmed).
3. **L5: add a knight on d3 → no-ability win goes 88% → about 81%.** L5 is the softest late level at 88% no-ability. One more hunter (knight on d3) tests how steep the piece-count curve is. Tested tonight: actual 56% (falsified).

These are measurements, not changes — nothing in `lib/run/runs.ts` was touched. A confirmed hypothesis is a tweak worth making by hand.

## Candidate runs

None in `REVENGE_CANDIDATE_RUN_IDS` tonight. When the generator adds one, it shows up here with a promote/hold call: new-player clear 40-60% on Normal and 70%+ on Rookie, every finisher ≥80%, zero stalls.

## Content pipeline

Registry: `data/content/pipeline.json` · approve with `npx tsx scripts/pipeline.ts approve <id>` (or tell Claude "approve <name>"). Only approved|live content reaches players; testing content stays behind `?run=` / `?loadout=`.

| Stage | idea | built | testing | approved | live | retired |
|---|---|---|---|---|---|---|
| Count | 4 | 0 | 0 | 0 | 35 | 4 |

**Waiting on Tyler (0)** — READY first:

- nothing in testing.

**Went live in the last 7 days (19):** Squire (`summon-knight`, ability) 2026-09-01, Pawn Storm (`revenge-2`, run) 2026-09-01, The Royal Guard (`revenge-3`, run) 2026-09-01, The Fortress (`revenge-4`, run) 2026-09-01, Stonework (`revenge-5`, run) 2026-09-01, Page (`page`, ability) 2026-09-02, Twin (`twin`, ability) 2026-09-02, Bishop Squire (`bishop-squire`, ability) 2026-09-02, Swap (`swap`, ability) 2026-09-02, Sacrifice (`sacrifice`, ability) 2026-09-02, Two Keys (`revenge-6`, run) 2026-09-01, Duchess (`duchess`, ability) 2026-09-02, Vanguard (`vanguard`, ability) 2026-09-02, Bramble Crown (`revenge-7`, run) 2026-09-02, The Rampart (`revenge-8`, run) 2026-09-02, Cold Court (`revenge-9`, run) 2026-09-02, The Vault (`revenge-10`, run) 2026-09-02, The Crucible (`crucible`, run) 2026-09-02, Dragon (`dragon`, ability) 2026-09-02

**Idea backlog (4):** War Banner — DESIGN ONLY: while active, each of your summons moves as a free action once per turn. Needs turn-loop work. · Phalanx — DESIGN ONLY: summon 2-3 controllable pawns as a wall. Generic engine supports it; fun value unproven. · Griffin — Controllable summon, movement TBD — Tyler's nerdy-friend bestiary (Tyler, 2026-09-02). · Vanguard Pawn — A pawn that can also capture straight forward (Tyler, 2026-09-02). Movement/economy TBD.

## Solver — forced captures on the late levels

AND-OR search, depth 6, 120,000 nodes, worst case over every start file. W4 = forced win in 4 moves; no6 = no forced line found within the depth (not "impossible" — the bot's win % is the practical answer).

**crucible**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bishop-squire | boulder | convert | decoy | dragon | duchess | magnet | page | poison-dart | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W5 | W3 | W3 | W3 | W3 | W3 | W3 | no6 | W4 | W3 | W3 | W3 | no6 | W3 | W4 | no6 | W5 | no6 | W3 | no6 | W3 | no6 | W3 | W3 |
| 7 | no6 | W3 | W3 | W3 | W3 | W3 | W3 | W3 | no6 | W3 | W3 | W3 | W3 | W5 | W3 | W5 | no6 | W4 | no6 | W3 | no6 | W3 | no6 | W3 | W3 |
| 8 | no6 | W3 | W3 | W3 | W3 | W3 | W3 | W3 | no6 | W3 | W3 | W3 | W3 | W5 | W3 | W5 | no6 | W4 | no6 | W3 | no6 | W3 | no6 | W3 | W3 |
| 9 | W6 | W4 | W4 | W3 | W3 | W3 | W3 | W4 | W6 | W4 | W3 | W3 | W3 | W4 | W4 | W4 | W6 | W4 | W6 | W5 | no6 | W3 | W6 | W3 | W3 |
| 10 | no6 | W4 | W4 | W3 | W3 | W3 | W3 | W4 | no6 | W3 | W3 | W3 | W3 | W5 | W4 | W4 | no6 | W6 | no6 | W3 | no6 | W3 | no6 | W3 | W3 |

**revenge-1**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bishop-squire | boulder | convert | decoy | dragon | duchess | magnet | page | poison-dart | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W5 | W3 | W3 | W3 | W4 | W3 | W4 | no6 | W4 | W4 | W3 | W3 | no6 | W4 | W5 | no6 | W5 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |
| 7 | no6 | W4 | W3 | W4 | W4 | W3 | W4 | W3 | no6 | W3 | W3 | W3 | W3 | W5 | W3 | W4 | W2 | W5 | no6 | no6 | no6 | W4 | no6 | W3 | W4 |
| 8 | no6 | no6 | no6 | W6 | W6 | W6 | no6 | W3 | no6 | W6 | W3 | W3 | W3 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | W4 |
| 9 | no6 | W6 | W5 | W5 | W5 | W5 | W4 | W3 | no6 | W6 | W4 | W3 | W3 | no6 | W4 | W5 | no6 | no6 | no6 | no6 | no6 | W6 | no6 | W3 | W5 |
| 10 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 |

**revenge-10**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bishop-squire | boulder | convert | decoy | dragon | duchess | magnet | page | poison-dart | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W5 | W4 | W4 | W4 | W3 | W5 | W3 | no6 | W3 | W3 | W2 | W3 | W3 | W4 | W4 | no6 | W5 | no6 | no6 | no6 | W5 | no6 | W4 | W5 |
| 7 | no6 | W3 | W4 | W5 | W5 | W3 | W4 | W4 | no6 | W3 | W3 | W3 | W3 | no6 | W4 | W4 | no6 | W5 | no6 | no6 | no6 | W4 | no6 | W4 | W4 |
| 8 | no6 | W6 | W6 | W6 | W6 | no6 | W5 | W6 | no6 | W6 | W4 | W4 | W4 | no6 | no6 | W5 | no6 | W6 | no6 | no6 | no6 | W4 | no6 | W4 | W4 |
| 9 | no6 | W5 | W4 | W3 | W3 | W3 | W3 | W5 | no6 | W3 | W3 | W3 | W3 | W4 | W5 | W4 | no6 | W6 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |
| 10 | no6 | W4 | W3 | W3 | W3 | W3 | W3 | W4 | no6 | W3 | W3 | W3 | W3 | W4 | W4 | W5 | no6 | W4 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |

**revenge-2**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bishop-squire | boulder | convert | decoy | dragon | duchess | magnet | page | poison-dart | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | W6 | W4 | W3 | W4 | W4 | W4 | W4 | W3 | W6 | W3 | W3 | W3 | W3 | W4 | W3 | W4 | W6 | W4 | W6 | W6 | no6 | W4 | W6 | W3 | W3 |
| 7 | W6 | W4 | W3 | W4 | W4 | W3 | W4 | W3 | W6 | W4 | W3 | W3 | W3 | W3 | W3 | W4 | W6 | W4 | W6 | W6 | no6 | W4 | W6 | W3 | W4 |
| 8 | W6 | W4 | W3 | W4 | W4 | W4 | W4 | W3 | W6 | W4 | W3 | W3 | W3 | W5 | W3 | W4 | W6 | W4 | W6 | W6 | no6 | W4 | W6 | W3 | W4 |
| 9 | no6 | W6 | W5 | W4 | W4 | W6 | W6 | W4 | no6 | W4 | W4 | W4 | W4 | no6 | W5 | W5 | no6 | W6 | no6 | no6 | no6 | W4 | no6 | W5 | W4 |
| 10 | no6 | W5 | W5 | W4 | W4 | W6 | W5 | W4 | no6 | W5 | W3 | W4 | W4 | no6 | W5 | W5 | W2 | no6 | no6 | no6 | no6 | W4 | no6 | W4 | W4 |

**revenge-3**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bishop-squire | boulder | convert | decoy | dragon | duchess | magnet | page | poison-dart | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W3 | W3 | W3 | W3 | W4 | W3 | no6 | W3 | W3 | W3 | W3 | W5 | W3 | W4 | no6 | W4 | no6 | no6 | no6 | W4 | no6 | W3 | W4 |
| 7 | no6 | no6 | W6 | W3 | W3 | W3 | W4 | W3 | no6 | W3 | W3 | W3 | W3 | no6 | W3 | W6 | no6 | no6 | no6 | W3 | no6 | no6 | no6 | W6 | W6 |
| 8 | no6 | no6 | no6 | no6 | no6 | W5 | no6 | no6 | no6 | no6 | W5 | W4 | W4 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 |
| 9 | no6 | W5 | W5 | W6 | W6 | W3 | W5 | W5 | no6 | W4 | W3 | W4 | W4 | no6 | W6 | W4 | no6 | W6 | no6 | no6 | no6 | W4 | no6 | W4 | W4 |
| 10 | no6 | no6 | W5 | W3 | W3 | W3 | W3 | W4 | no6 | W3 | W3 | W3 | W3 | W6 | W4 | W5 | no6 | no6 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |

**revenge-4**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bishop-squire | boulder | convert | decoy | dragon | duchess | magnet | page | poison-dart | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W3 | W4 | W4 | W3 | W4 | W3 | no6 | W3 | W3 | W3 | W3 | W5 | W3 | W4 | no6 | W5 | no6 | W6 | W6 | W4 | no6 | W3 | W3 |
| 7 | W6 | W3 | W3 | W3 | W3 | W3 | W3 | W3 | W6 | W3 | W3 | W3 | W3 | W5 | W3 | W4 | W6 | W3 | W6 | W3 | no6 | W4 | W6 | W3 | W3 |
| 8 | no6 | W4 | W4 | W4 | W4 | W4 | W4 | W4 | no6 | W4 | W4 | W3 | W3 | no6 | W4 | W5 | no6 | W4 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |
| 9 | no6 | no6 | no6 | no6 | no6 | W6 | no6 | no6 | no6 | W6 | W3 | W3 | W6 | no6 | no6 | W6 | no6 | no6 | no6 | W6 | no6 | W6 | no6 | W6 | W6 |
| 10 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 |

**revenge-5**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bishop-squire | boulder | convert | decoy | dragon | duchess | magnet | page | poison-dart | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W4 | W3 | W3 | W4 | W3 | W4 | W6 | W3 | W3 | W3 | W3 | W5 | W4 | W4 | no6 | W5 | no6 | W5 | no6 | W3 | no6 | W3 | W3 |
| 7 | no6 | W4 | W4 | W4 | W4 | W3 | W4 | W4 | no6 | W3 | W3 | W3 | W3 | W4 | W5 | W4 | no6 | no6 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |
| 8 | W6 | W5 | W5 | W6 | W6 | W6 | W6 | W6 | W6 | W6 | W5 | W4 | W6 | W6 | W6 | W5 | W6 | W6 | W6 | W6 | no6 | W4 | W6 | W6 | W4 |
| 9 | no6 | W4 | W5 | W3 | W3 | W6 | W4 | W3 | no6 | W5 | W4 | W3 | W3 | W6 | W5 | W5 | no6 | W6 | no6 | W4 | no6 | W4 | no6 | W4 | W3 |
| 10 | no6 | W6 | W4 | W5 | W5 | W3 | W3 | W6 | no6 | W3 | W3 | W3 | W3 | W4 | W6 | W4 | no6 | W6 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |

**revenge-6**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bishop-squire | boulder | convert | decoy | dragon | duchess | magnet | page | poison-dart | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W3 | W5 | W5 | W3 | W4 | W3 | no6 | W3 | W3 | W3 | W3 | W3 | W3 | W4 | no6 | W5 | no6 | W4 | no6 | W4 | no6 | W3 | W4 |
| 7 | no6 | W4 | W3 | W4 | W4 | W3 | W4 | W3 | ?6 | W3 | W3 | W3 | W3 | W4 | W3 | W4 | no6 | W6 | no6 | W5 | W6 | W4 | no6 | W3 | W3 |
| 8 | no6 | W5 | W4 | W3 | W3 | W5 | W3 | W5 | no6 | W3 | W4 | W3 | W4 | W5 | W5 | W4 | no6 | W6 | no6 | no6 | no6 | W3 | no6 | W4 | W3 |
| 9 | no6 | W4 | W5 | W3 | W3 | W6 | W4 | W3 | no6 | W5 | W4 | W3 | W3 | W6 | W5 | W5 | no6 | W6 | no6 | W4 | no6 | W4 | no6 | W4 | W3 |
| 10 | no6 | no6 | W5 | W3 | W3 | W3 | W3 | W4 | no6 | W3 | W3 | W3 | W3 | W6 | W4 | W5 | no6 | no6 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |

**revenge-7**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bishop-squire | boulder | convert | decoy | dragon | duchess | magnet | page | poison-dart | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W3 | W4 | W4 | W3 | W4 | W3 | no6 | W3 | W3 | W3 | W3 | W5 | W3 | W4 | no6 | W5 | no6 | W6 | W6 | W4 | no6 | W3 | W3 |
| 7 | W6 | W4 | W3 | W4 | W4 | W3 | W4 | W3 | W6 | W4 | W3 | W3 | W3 | W3 | W3 | W4 | W6 | W4 | W6 | W6 | no6 | W4 | W6 | W3 | W4 |
| 8 | no6 | W5 | W4 | W3 | W3 | W5 | W3 | W5 | no6 | W3 | W4 | W3 | W4 | W5 | W5 | W4 | no6 | W6 | no6 | no6 | no6 | W3 | no6 | W4 | W3 |
| 9 | no6 | W4 | W4 | W4 | W4 | W6 | W4 | W4 | no6 | W4 | W3 | W3 | W3 | W4 | W4 | W5 | no6 | W5 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |
| 10 | no6 | W6 | W4 | W5 | W5 | W3 | W3 | W6 | no6 | W3 | W3 | W3 | W3 | W4 | W6 | W4 | no6 | W6 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |

**revenge-8**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bishop-squire | boulder | convert | decoy | dragon | duchess | magnet | page | poison-dart | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | W6 | W4 | W3 | W4 | W4 | W3 | W4 | W3 | W6 | W3 | W3 | W3 | W3 | W3 | W3 | W4 | W6 | W4 | W6 | W6 | no6 | W4 | W6 | W3 | W4 |
| 7 | W6 | W4 | W3 | W4 | W4 | W3 | W4 | W3 | W6 | W3 | W3 | W3 | W3 | W4 | W3 | W4 | W6 | W4 | W6 | W6 | W6 | W4 | W6 | W3 | W3 |
| 8 | no6 | W4 | W3 | W4 | W4 | W3 | W4 | W3 | no6 | W3 | W3 | W3 | W3 | W6 | W3 | W4 | no6 | W5 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |
| 9 | no6 | W3 | W6 | W2 | W2 | W3 | W4 | W2 | no6 | W3 | W3 | W2 | W2 | W4 | W6 | W4 | W2 | W6 | no6 | no6 | no6 | W4 | no6 | W4 | W4 |
| 10 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | W3 | W6 | W6 | no6 | no6 | W6 | W2 | no6 | no6 | no6 | no6 | no6 | no6 | no6 | no6 |

**revenge-9**

| L | none | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | become-king | bishop-squire | boulder | convert | decoy | dragon | duchess | magnet | page | poison-dart | rabies-dart | rewind | sacrifice | smoke | squad | summon-knight | swap | twin | vanguard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | no6 | W4 | W3 | W4 | W4 | W4 | W4 | W3 | no6 | W4 | W4 | W3 | W3 | W4 | W3 | W4 | no6 | W4 | no6 | no6 | no6 | W4 | no6 | W3 | W4 |
| 7 | no6 | W4 | W3 | W4 | W4 | W3 | W4 | W3 | no6 | W3 | W3 | W3 | W3 | W5 | W3 | W4 | no6 | W5 | no6 | no6 | no6 | W4 | no6 | W3 | W4 |
| 8 | no6 | W4 | W4 | W4 | W4 | W3 | W4 | W4 | no6 | W3 | W3 | W3 | W3 | W3 | W5 | W4 | no6 | W5 | no6 | W6 | no6 | W3 | no6 | W3 | W3 |
| 9 | no6 | W4 | W4 | W4 | W4 | W6 | W4 | W4 | no6 | W5 | W4 | W3 | W3 | no6 | W5 | W5 | no6 | W6 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |
| 10 | no6 | W4 | W4 | W5 | W5 | W5 | W4 | W4 | no6 | W5 | W4 | W3 | W3 | no6 | W5 | W5 | no6 | W6 | no6 | no6 | no6 | W3 | no6 | W3 | W3 |

## How to read this

- **No ability** = the T5 MCTS bot with no powers, offers dismissed. It is a floor for a good player, not a beginner's number.
- **Finishers** = surge, freeze-ray, knight-hop, bishop-step, queen-pulse — the cards that take the king directly. Every offer slate carries at least two, so the worst finisher is the run's safety net.
- **Stall** = 300 turns with the king alive. Always a bug or an unreachable pen; the target is zero.
- **Difficulty** = the new-player sim (3 starters, forced offers, mode retries): 40-60% full-run clear on Normal is the target, 70%+ on Rookie, over 85% on Normal is too easy. The old no-ability band (100/100/100/100/90/50/55/50/30/30 ±15) is shown per level for reference only.
- Start files are random per game, so a single cell wobbles ±10 between nights at 16 trials (more on the lighter candidate passes). Trust clusters and repeated nights.

**How to read these numbers** (the harness plays the exact engine the app does — verified ply-for-ply, see `docs/revenge-parity.md` — but it skips five app-side rules):

1. **Free offers are not skippable in the app.** On L1, L3, L6 and L9 a real player MUST take a card before moving; the harness dismisses it. So the "none" and single-ability cells on those levels UNDERSTATE a real player's kit — the random-pick full runs are the honest number there.
2. **Retries.** The app gives Rookie unlimited, Normal 3, Hard 1, Nightmare 0 retries per level, each with a fresh start file and seed. Every full-run clear rate here is a LOWER bound on what a player with retries sees.
3. **Offer pool.** The app rolls only the player's unlocked abilities (a new player has Knight Hop, Surge and Freeze Ray; Drones is retired). The harness draws from all 240 — so full-run pick mixes are wider than a new player's.
4. **Default difficulty.** A fresh profile plays Rookie; the main table is Normal. The four modes are swept explicitly above — read the Rookie row for the new-player experience.
5. **"Out of moves" vs "No way through".** The app's solver ends a proven-dead level early; the harness plays on to the move limit. Same loss, two labels — counted together as m.

Reproduce: `npx tsx scripts/run-playtest/revenge-nightly.ts` (add `--quick` for a 2-minute smoke). Raw JSON: `data/run-playtest/revenge/raw/2026-09-02/`.
