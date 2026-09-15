# The Ladder Contract — what every rung must satisfy

Tyler, 2026-09-09: *"let's make a set of rules for each ladder level of what it
needs. It needs the abilities and it needs to use those abilities. It needs a
certain success rate that should diminish as the levels go up. It needs to have
more pieces on higher levels and it needs to have that consistent success rate.
Ideally the levels will also get harder the higher you get into the ladder."*

Seven checks. Rung index `r` is 1-10. Everything is measured on **Normal**, T5
bot. Audited by `scripts/run-playtest/ladder-audit.ts`.

**Two tier columns (2026-09-15).** Until today the finale was graded with T1
cards only. Tyler played all ten runs and arrived at L7 holding upgrades
(Boulder T3-T5, three stones a level), cleared The Slash and The Alcove the
audit called TOO HARD, and found the same solution repeated across L7-L10. So:

- **T1** — `none`, every kit card alone, and the pair, all at tier 1. Grades
  checks 1 (GATE) and 2 (USED); the T1 pair column stays in the report as context.
- **Arrival** — the full-run sim (check 4) snapshots what each run holds when it
  first plays L7. Each kit card's **arrival tier** is its most common tier among
  runs holding it, capped by the run's `abilityTierCaps`. Two cells are graded
  at those tiers:
  - the **pair**, which grades checks 3 (BAND) and 6 (SHAPE);
  - the **kit** = the run's whole `allowedAbilities` when a player can hold all
    of it (kit ≤ `MAX_OWNED_ABILITIES`). For today's 4-card kits it is the
    pair + the extra card most often held beside it. Reported next to the pair,
    and feeds check 7.

Derived from the RunDef, never a fixed kit size: 3-card kits need no change.

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
Pair clear mean over L7-L10, **at arrival tiers**, lands in **80 − 3(r−1), ±8**.

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
L7-L10 pair clears (arrival tiers) **span ≥ 15 points**, and **L10 ≤ L7**.

Tyler, 2026-09-07: *"once you solved it you kind of figured it out."* Four levels
reading 100/100/100/100 is one puzzle charged for four times. The spread forces
them to differ; L10 ≤ L7 forces the run to end on its hardest.

### 7. REPEAT — no two finale levels are won the same way
No two of L7-L10 share a **winning-line signature**.

Check 6 reads clear RATES, and four levels solved by one line can each read a
healthy 60%. Tyler, 2026-09-15: Millstone L7-L10 and Glasshouse L7-L8 are "the
same pattern". A signature (`scripts/run-playtest/line-signature.ts`) is built
from three things, all measured against where the king **starts**, so a level
mirrored two files over reads the same:

1. **The casts, in order.** `ability` for an untargeted card (knight-hop,
   aegis); `ability@where` for a targeted one. Repeats of the same token in a
   row collapse, so two stones or three on the same side are one idea.
2. **Where each targeted cast lands**, relative to the king: `king`, `pen`
   (inside his pen), `adj` (touching him), `line` (his file or rank), `diag`,
   `near` (two squares away), `far`.
3. **The capture shape.** `cap:<Rookie's form>/<step|orth|diag|L|jump>`,
   `cap:ally/<shape>` (a summon took him), or `cap:other`.

Example: `boulder@adj>knight-hop | cap:knight/L`.

- **Bot lines.** A finale level's signature is the most common winning line of
  its arrival pair + kit cells. It counts only when it covers ≥ 40% of that
  level's wins and there are ≥ 2 wins; otherwise that level has too few wins
  to call and passes.
- **Human lines.** From `run_traces`, via `human-check.ts`. One real clear per
  level is enough: two finale levels won by a human with the same signature
  fail this check.

The signature is deliberately coarse. A false "same" is cheap: a human plays
both levels and confirms. A false "different" is what tuning would chase.

---

## BOT-BLIND — when the bot's TOO HARD is not evidence

The bot is a rollout search. It cannot plan a multi-turn setup such as building
a wall before it matters. A finale level is **BOT-BLIND** when either:

- **human** (`human-check.ts`): a human cleared it on the first attempt, and
  the bot's 95% **upper** bound at the loadout that human held is **< 20%**.
  This needs ≥ 16 trials/cell: 16 zero-win trials put the upper bound at
  19.4%; fewer cannot say it.
- **solver** (`ladder-audit --ceiling`, `human-check --solve`): the solver
  proves a forced win (every start file, six enemy tie-breaks). It runs only
  on levels the bot reads under that 20% bar, at the arrival-kit (or human)
  loadout.

A BOT-BLIND flag turns a TOO HARD rung into **BOT-BLIND (needs human read)**. It
never turns a FAIL on GATE into anything else, and it never makes a rung PASS.

---

## Grades

- **PASS** — all seven.
- **BROKEN** — fails check 1. The run's premise is void; fix first, always.
- **TOO EASY / TOO HARD** — fails 3 or 4, outside the window in that direction.
- **BOT-BLIND** — would be TOO HARD, but a human or the solver cleared a finale
  level the bot cannot. Read the human's line before tuning anything.
- **FLAT** — fails 5, 6 or 7. Plays fine, doesn't feel like a rung.

## Human check (nightly, and by hand)

`npx tsx scripts/run-playtest/human-check.ts --date=YYYY-MM-DD [--handle=Rook-4545] [--solve]`

Reads `run_traces` (read-only), one run per `(run, meta.startedAt)`, because a
retried run is posted twice. Per level it records deaths, whether the level was
cleared first try, the loadout held, and the winning line. It replays the run
through the engine: exactly, from recorded `level-start` seeds, when the trace
has them; by candidate-seed guessing before that. Each first-try clear is then
played by the bot at that loadout. The nightly merge runs it over the last 7
days of finale levels and folds BOT-BLIND and human REPEAT into the graded rows.
