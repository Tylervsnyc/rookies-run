# The Ladder Contract — what every rung must satisfy

Tyler, 2026-09-09: *"let's make a set of rules for each ladder level of what it
needs. It needs the abilities and it needs to use those abilities. It needs a
certain success rate that should diminish as the levels go up. It needs to have
more pieces on higher levels and it needs to have that consistent success rate.
Ideally the levels will also get harder the higher you get into the ladder."*

Six checks. Rung index `r` is 1-10. Everything is measured on **Normal**, T5 bot,
T1 cards — the method every run's "numbers of record" block uses. Audited by
`scripts/run-playtest/ladder-audit.ts`.

---

### 1. GATE — the pair is REQUIRED
Every single card in the kit, and `none`, clears **≤ 8%** on each of L7-L10.

This is the existing combo-gate contract and the one non-negotiable: if a single
card clears a finale, the run is not a combo run. Rung 7 fails this today.

### 2. USED — the pair is the ANSWER, not a coincidence
Pair clear beats the best single card by **≥ 50 points** on at least 3 of L7-L10.

Check 1 says nothing else works. This says the pair genuinely works. Together
they mean the two cards are the level's solution rather than a way to survive it.

### 3. BAND — the finale gets harder as you climb
Pair clear mean over L7-L10 lands in **80 − 3(r−1), ±8**.

| rung | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| target | 80 | 77 | 74 | 71 | 68 | 65 | 62 | 59 | 56 | 53 |
| window | 72-88 | 69-85 | 66-82 | 63-79 | 60-76 | 57-73 | 54-70 | 51-67 | 48-64 | 45-61 |

This replaces the flat 60-80 band, which had no slope in it — the reason ten
rungs could all pass and still feel identical. A rung ABOVE its window is too
easy; below it is too hard. Both fail.

### 4. RUN — the whole run gets harder as you climb
Full-run clear over 60 runs at the real retry budget: **65 − 3.3(r−1), ±10**.
Rung 1 = 55-75%, rung 10 = 25-45%.

Check 3 measures a level; this measures the RUN, which is what a player
experiences. They are different numbers because the retry budget converts one
into the other — at 1 retry a 20% level ends ~64% of runs.

### 5. SCALE — the board grows as you climb
Average enemy pieces per level **≥ 3 + 0.6(r−1)** (rung 1 ≥ 3.0, rung 10 ≥ 8.4),
and within a run, the L8-L10 average is **≥ the L1-L3 average + 2**.

**This is a SCALE rule, not a difficulty rule, and that is deliberate.** Measured
2026-09-08 (3,600 runs, three curves): adding pieces does NOT make a level
harder, because on a sparse board extra enemies are capture material, which is
tempo — rung 1 got EASIER, 53% → 67%, when pieces were added. All three density
curves scored worse than changing nothing.

So difficulty is checks 3 and 4. This check exists because a rung-10 board should
LOOK like a rung-10 board — the ladder currently runs 1.9 to 4.9 pieces across
rungs 1-9 with no trend, and rung 2 holds fewer than rung 1. Pieces bought here
must be authored INTO the solution (walls, defenders, blockers), never scattered.

### 6. SHAPE — the finale is four demands, not one line four times
L7-L10 pair clears **span ≥ 15 points**, and **L10 ≤ L7**.

Tyler, 2026-09-07: *"once you solved it you kind of figured it out."* Four levels
reading 100/100/100/100 is one puzzle charged for four times. The spread forces
them to differ; L10 ≤ L7 forces the run to end on its hardest.

---

## Grades

- **PASS** — all six.
- **BROKEN** — fails check 1. The run's premise is void; fix first, always.
- **TOO EASY / TOO HARD** — fails 3 or 4, outside the window in that direction.
- **FLAT** — fails 5 or 6. Plays fine, doesn't feel like a rung.
