# Rookie's Revenge Lab — the daily difficulty + ability engine

**Status:** proposal, 2026-08-28. Nothing built yet. Tyler signs off on §3 (the
difficulty contract) and §7 (the open calls) before Phase 1 starts.

The ask: a bot that plays every Revenge level, tells us whether each one is at
the difficulty we want, measures what every ability does to the win rate, and
then — every morning — hands over new levels, new ability candidates, and a
report that says *ship this one, here's how it works, here's the game where it
mattered*.

Rookie's Run had that pipeline. This is the same idea rebuilt for a game with a
different win condition (catch the king, not cross the board), where **abilities
are not a bonus — they are the only way to win**.

---

## 1. What lands in your inbox every morning

One digest, `data/revenge-lab/digests/YYYY-MM-DD.md`, pushed to the repo and
posted to Slack. Five sections, in this order:

1. **Off-target levels** — every level graded against its target band, with the
   one knob to turn. `L7 is 78% at Casual, band is 55–75% → drop the move
   budget 12 → 11.` Silence here means the curve is where you want it.
2. **Ability scoreboard** — each of the 18 abilities: what it's worth in a real
   loadout (not solo), which level it saves, which level it can't touch, and its
   character (Finisher / Opener / Crutch / Trap / Dead weight).
3. **Ship this** — 1 to 3 new ability candidates that were actually simulated,
   not just imagined. Name, one-line mechanic, five tiers, measured Δ win % per
   level, and **a worked example**: the same seed lost without it and won with
   it, with the move list and a replay link.
4. **New levels** — candidates that passed the geometry lint, the solver gate
   and landed inside a target band, as paste-ready `make(...)` snippets with an
   ASCII board.
5. **What moved** — diff against yesterday. Regressions flagged loud.

Nothing in that digest touches `lib/run/` on its own. Levels and abilities are
proposals; you promote them.

---

## 2. What exists vs what's missing

**Already built and working** (`scripts/run-playtest/revenge.ts`):

| Command | What it does |
|---|---|
| `matrix` | level × loadout × N trials → win %, loss modes, avg moves |
| `runs` | full L1→L10 with random offer picks, carries tempo + abilities |
| `solve` | AND-OR search: is there a *forced* capture in ≤ D moves? |
| `trace` | move-by-move log of one game |
| `lint` | static read of a level: keys on the king's lines, safe squares |

Plus `--difficulty=rookie|normal|hard|nightmare`, an 18-ability pool, and the
whole Run-era toolkit next door (digest writer, feature vectors, correlations,
regression watcher, replay renderer, `/admin/replay`).

**Measured cost on this box** (4 cores): 300 games with the T6 MCTS bot in 28 s.
A full 10 × 19 × 30 matrix is ~5,700 games ≈ **9 minutes**. 60 full runs ≈ 2.5
min single-threaded. The whole nightly fits in well under an hour. Compute is
not the constraint.

**The five gaps:**

- **G1 — nothing grades the numbers.** `matrix` prints win rates. No file says
  what L7 is *supposed* to be, so "is this level right?" is still a human read.
- **G2 — the bot is too good to be a difficulty meter.** T6 clears 59 of 60 full
  runs and hits 100 % on most level × ability cells. The only column with signal
  left is `none`. We are measuring the ceiling, not the player.
- **G3 — ability impact is solo-only.** Today's table is "this ability alone."
  Nobody plays that. What matters is the marginal value of holding it *inside a
  real 3-ability loadout*, and what it does in combination.
- **G4 — no level generator for Revenge.** `generate-levels.ts` builds rank-8
  levels. It knows nothing about pens, keys, guards or move budgets.
- **G5 — new abilities can't be tested.** The ability-designer agent writes
  markdown candidates that no simulation ever touches, because tier numbers and
  effects live in hard-coded `switch` statements in `lib/run/abilities.ts`. A
  candidate is an opinion until it can be played.

**And one live bug:** the `rookies-run-nightly-playtest` routine (fires 08:00
daily) still points at **chess-learning-tree**, which no longer holds Rookie's
Revenge. It reports SUCCEEDED every morning, and the newest digest it has
produced is dated **2026-08-15** — running fast, in quick mode, against the
legacy game. It has been green and useless for two weeks. Repointing it is part
of Phase 3.

---

## 3. The difficulty contract (needs your sign-off)

You said you want a certain level of difficulty on every level. Right now that
is a feeling. This turns it into a file — `scripts/run-playtest/lab/spec.ts` —
that the grader reads. Three things get measured, because win % alone lies:

- **Win % at Casual** — the headline, from a weak bot that plays like a human
  who half-uses their powers (see §4, B2).
- **Slack** — moves left over on a win. A level cleared with 8 spare moves is
  not the same level as one cleared with 1, even at the same win %.
- **Breadth** — how many of the 18 abilities clear it at ≥ 80 %. Low breadth
  means the level demands one specific tool. That's correct at L9. It's a bug at
  L5.

Proposed bands for `normal` — **change any number you disagree with, this is
the one part of the plan that is purely your call:**

| Levels | Role | Casual win % | No-ability win % | Slack (spare moves) | Breadth |
|---|---|---|---|---|---|
| L1–2 | teach the goal | 95–100 % | 95–100 % | — | all 18 |
| L3–4 | teach the mechanic | 85–95 % | 80–95 % | 4+ | ≥ 16 |
| L5–6 | first pressure | 70–85 % | 40–70 % | 3–5 | 13–16 |
| L7–8 | the squeeze | 55–75 % | 25–50 % | 2–4 | 9–14 |
| L9–10 | boss | 40–60 % | ≤ 25 % | 1–3 | 6–11 |

`rookie` shifts every band +15 pp, `hard` −15 pp, `nightmare` −25 pp.

**Hard rules — a level fails the build if any of these trip:**

- Stall share > 5 % (the king is unreachable, not merely hard).
- Solver finds no forced win within depth 8 for *any* ability.
- A **finisher** (Surge / Freeze Ray / Knight Hop / Bishop Step / Queen Pulse)
  drops below 70 % at its realistic tier — the tool is broken, not the level.
- 0 % ability-free *and* under 60 % with three finishers held — that's unfair,
  not hard.

Every level gets one of four verdicts, and off-target verdicts come with the
knob attached: move budget ±1, add or drop a hunter, pen ±1 square,
`enemiesPerTurn` ±1. Move budget first — it is the cleanest lever and the doc
history says so.

---

## 4. The bot ladder (fixing G2)

One bot can't be a difficulty meter. Four can:

| Bot | Plays like | Uses abilities |
|---|---|---|
| **B1 Fumbler** | someone who ignores their powers | never casts |
| **B2 Casual** | the actual audience | casts, often at the wrong target |
| **B3 Sharp** | a player who's read the ability text | casts well, no deep plan |
| **B4 Ceiling** | today's T6 MCTS-320 | near-optimal |

B1 and B4 already exist in effect (`none` loadout, T6). B2 and B3 are the build:
take the existing T3/T4 bots plus `bots/ability-eval.ts`, and scale the ability
bonus down (0.3 / 0.7) exactly the way the Run harness already does. The Run
repo also has `t5-human.ts`, a planner built from your own traces — worth
porting as a B2.5 later.

**B2 is the number the difficulty bands are written against.** B4 stays as the
"is this even possible" check, and the B4 − B1 gap is the honest measure of how
much a level rewards knowing what you're doing.

---

## 5. Measuring what abilities actually do (fixing G3)

Three measurements per ability, per level:

1. **Solo** — the current matrix. The tool's ceiling. Keep it.
2. **Marginal** — sample real 3-ability loadouts from actual offer slates, then
   run each one twice: with ability X, and with X swapped for the next card on
   the slate. The Δ is what holding X is worth in a game you'd really play.
   This is the number that goes in the scoreboard.
3. **Combo** — pairs. `Δ(A+B) − ΔA − ΔB` catches Freeze + Surge stacking and
   Boulder + Magnet cancelling out.

Plus **cast telemetry** the harness doesn't record yet: cast rate, what it was
aimed at (king / defended key / guard / empty), moves-to-win with vs without,
and **dead-pick rate** — held all level, never cast, lost anyway. A high dead
pick rate is the clearest "this ability is confusing" signal we can get without
humans.

Character labels fall out of it: Finisher (high marginal at L8–10), Opener (high
marginal only in the first 3 moves), Crutch (big at B1/B2, small at B4), Trap
(*negative* marginal at B2 — beginners take it and lose more), Dead weight (|Δ|
< 3 pp everywhere).

---

## 6. The two factories

### 6a. Level factory (fixing G4)

`scripts/run-playtest/lab/generate-revenge.ts`. Levels are pure data —
pieces, hazards, `kingPen`, `moveLimit` — so this is a generator, not a rewrite.

Six archetypes drawn from what the current 10 taught us: **Hallway** (linear
pen), **Corner Office** (2×2 pen, undefended key), **Throne Room** (3×2 room,
pawn-defended key), **Balcony** (king off the back rank), **Courtyard** (open
pen, hunters do the work), **Double Doors** (two exits, one must be sealed).
Seeded variations per archetype, deterministic like the Run generator.

Every candidate runs a four-stage gate, cheapest first:

1. **Geometry lint** (free) — the rules the doc learned the hard way: a
   rook-proof pen needs ≥ 2×2 *empty* squares, a key on his line must be
   pawn-defended, pieces adjacent to him are keys, guards must not be able to
   wander into the pen.
2. **Solver** — a forced win must exist with at least one ability, and must
   *not* exist ability-free before L5.
3. **Sim** — B1/B2/B4 × 30 trials.
4. **Auto-tune** — off-band candidates get the move budget walked ±1 up to four
   times before being dropped.

Survivors land in `data/revenge-lab/candidate-levels/YYYY-MM-DD/` with an ASCII
board, its measured band, and a paste-ready `make(...)` snippet.

### 6b. Ability factory (fixing G5 — the interesting one)

The reason no new ability has ever been auto-tested is that ability numbers live
in `switch (id)` blocks inside the engine. Two pieces fix that:

**Piece 1 — make the numbers injectable.** `maxUsesForTier`,
`transformDurationForTier`, `freezeTurns`, `poisonTurns`, `decoyTurns`,
`smokeTurns`, `magnetPullDistance`, `bodyguardTurns`, `droneCountForTier` all
read from an optional override map on `BoardState` and fall back to today's
switch when it's absent. Empty map = byte-identical behavior, so the shipped
game cannot change. That alone unlocks **auto-tuning existing abilities** —
"Poison Dart is 47 % on L10; at 2-turn kill it's 71 %" becomes a nightly answer
instead of a hand experiment.

**Piece 2 — a primitive grammar.** Every effect the engine can already perform,
exposed as a named primitive: `freeze`, `poison`, `hazard`, `transform`,
`bonusMoves`, `shield`, `spawnAlly`, `pull`, `mark`, `invisible`, `droneSalvo`,
`stunKing`, `rewind`, `convert`. A candidate ability is then JSON:

```json
{ "id": "lab-tether", "name": "Tether", "activation": "targeted",
  "effect": [{ "op": "pull", "dist": 2 }, { "op": "mark", "turns": 1 }],
  "tiers": [{ "uses": 1, "dist": 2 }, { "uses": 1, "dist": 3 }, "..."] }
```

A lab-only adapter registers it as a shim ability so the bots' candidate
generator sees it and the whole matrix / marginal / combo machinery runs on it
unchanged. **Nothing in `lib/run/` learns about candidates.**

The nightly generates ~10 candidates a night: 6 aimed at measured gaps (the
L10-support hole, the beginner tier, whatever the scoreboard says is thin) and 4
speculative recombinations. It simulates all of them, throws away the ones that
are within 0.7 correlation of an existing ability's impact vector, and promotes
the best 1–3 into the "Ship this" section with their worked example.

Ideas the grammar can't express get written up as a spec naming the engine hook
they'd need. Those are yours to approve as a coding task — the factory never
writes engine code.

---

## 7. Open calls — I need four answers

1. **The bands in §3.** Are those the difficulty you want? The one I'd push
   back on myself: L9–10 at 40–60 % Casual means a beginner loses the boss
   roughly half the time. That's roguelike-correct and Duolingo-wrong.
2. **Do new levels get added to the run, or replace tuned ones?** My default:
   candidates accumulate in a pool, the shipped 10 only change when you say so.
3. **Delivery.** Slack `#all-learnthroughstories` like the IG sprint, push
   notification, or repo-only? Default: Slack + repo.
4. **The auto-tune blast radius.** I want the nightly to *propose* number
   changes to shipped abilities, never apply them. Confirm.

---

## 8. Build order

| Phase | What | Cost | You get |
|---|---|---|---|
| **1** | `spec.ts` + `revenge.ts grade` | ½ day | Which levels are off-target, today |
| **2** | B2/B3 bots + marginal + combo + cast telemetry | 1 day | The ability scoreboard |
| **3** | Digest writer + routine + **repoint the stale nightly** | ½ day | The report starts landing every morning |
| **4** | Level factory + gates | 1–2 days | New levels in the report |
| **5** | Param injection + ability sandbox + candidate generator | 2 days | New abilities in the report, with proof |
| **6** | Human calibration from `run_traces` | later | Bands stated in human terms, not bot terms |

The report is live after Phase 3 — it just starts thin (grades + scoreboard) and
grows a section per phase after that.

Phase 6 is the one that matters most in the long run and can't be rushed: every
number above is a *bot* number. The moment there are real traces in
`run_traces`, we fit the offset between bot win % and human win % per level, and
the bands in §3 stop being a proxy.

---

## 9. Rails

- The factories write to `data/revenge-lab/` only. `lib/run/` changes are
  proposals in the digest, never commits.
- The lab's ability overrides default to empty, which is a no-op — the shipped
  game cannot be altered by the harness.
- Every nightly commit is digest + candidates. If the pipeline errors, it
  reports the failure and commits nothing.
- Regression watch: any shipped level moving > 15 pp overnight is flagged loud
  at the top of the digest, above everything else.
