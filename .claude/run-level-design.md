# Rookies Run — Level Design

The single source of truth for **authoring** Rookies Run levels. Sister doc to:

- **`.claude/run-strategy-bible.md`** — *why* a position is hard (bot/eval reasoning).
- **`RULES.md §49`** — engine rules (what's legal, what's wired up).
- **`scripts/run-playtest/`** — *measures* difficulty after the fact.

This doc is about **how to author a 10-level run that feels right.** Update it when playtests teach us something new.

---

## The north star: what a run should feel like

A run is a **story arc of escalating impossibility**. The player should feel:

1. **L1–3 — Warmup.** "Oh I get it, this is fun." Pure rook play, open files visible. Win without thinking.
2. **L4–6 — Choices.** "I need to actually plan." First abilities offered. Multiple plausible paths, each with tradeoffs.
3. **L7–9 — Pressure.** "I'm in trouble." Abilities feel necessary, not optional. One wrong move = caught.
4. **L10 — Spectacle.** "There's no way." Should be **impossible without abilities.** The capstone should make the player exhale when they win.

If every level feels the same, the run failed. The *progression* is the product.


---

## The combo gate — Revenge's north star (Tyler, 2026-09-05)

The most fun anyone has had in this game is a finale level that **no single ability can solve and one PAIR walks through**. The Moat L8-10 (bishop-squire + swap), The Colonnade L7-10 (same pair), The Vault L7-10 (vanguard + swap). Tyler: "find more combinations of abilities and build a LOT of levels based on a LOT of combinations, I think that's the key to this app." Every Revenge run authored from now on is built to this contract.

**The contract, measured with the run's own 4-card kit (`allowedAbilities`):**

| Loadout (Normal, T5) | L7-L10 target |
|---|---|
| No ability | ~0% |
| Every single card in the kit, alone | <= 8% |
| The run's signature pair | >= 60%, aim 60-80%. A finale the bot clears 100% is too easy for Tyler once he has the idea (Lattice, Alcove, 2026-09-06) |

Fewer winning pairs is better; a level with exactly one answer is the best kind. Calibration from the runs Tyler rated: Moat finale singles 0% / pair 79-100%, full runs 25% clear with random picks. Colonnade finale singles 0% / pair 100-100-100-71%, full runs 12% random / 55% when the player takes the pair. Vault finale singles 0% / pair 81-97%, 28% random / 53% with the pair. A run where picking the wrong cards early ends you at L7-L8 is correct — that tension is the design.

**Why the gate is kit-relative, not game-wide.** `bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's geometry *is*, so they cross any terrain and solve terrain levels alone (Colonnade L10: 0% for every card in its kit, 100% for each of those three). Big summons behave the same way on many boards. A terrain-signature level can essentially never be gated against all 23 abilities, and the player only ever holds the kit, so the kit is the unit of measurement. The discovery harness (`scripts/run-playtest/combo-discover.ts`) records which kits gate a level; a level gated under many kits can ship in many runs.

**Kit composition rules:**
1. Exactly 4 cards: the signature pair + 2 fillers that are TRAPS on most levels (each may be a KEY on one or two mid-run levels).
2. Never a universal solvent in a terrain kit unless it IS half the signature pair (cage-and-take, boulder + knight-hop, is legitimate; a stray knight-hop beside a moat is a skeleton key).
3. Check `data/run-playtest/pair-hypotheses.json` `antiPairs` before choosing fillers. Measured: boulder + bishop-squire dropped Colonnade L10 from 71% to 33% (a stone walls the player's own diagonals). Weak: convert + poison-dart (Convert heals the poison). Convert + sacrifice WAS illegal (only controlled summons detonate); since 2026-09-06 a converted piece IS a controlled summon (Tyler: "they need to be controllable summons"), so it is a legal deep-strike pair, and a stolen pawn no longer marches off on its own — the player moves it, or it stays. A stolen piece is DAZED the turn it is taken (cannot move/capture until the player's next turn), so a guard standing on the king's attack square is a next-turn threat, not a same-turn kill. Two summons together are near-useless (one body-move per turn).
4. **Vary the signature pair between runs.** The Colonnade reused the Moat's pair; Tyler solved it fast and said it "felt similar." A new theme over the same answer is the same run.

**Mechanics that make pairs work (read `docs/ability-pairs.md`):** almost every ability is a free action — only a body moving ends the turn — so the scarce resource is body-moves, not casts. Any capture credited to your side stuns the king, whatever made it (Rookie, a summon, a Boulder crush, a poison death). Swap is the socket most pairs plug into ("body-then-become"); Boulder and Magnet have so far never gated a level with any partner.

**Authoring order:** write the design header FIRST — signature, a per-card KEY/TRAP map by level, the intended line for each of L7-L10 — then build, then let the bots falsify it, then append a MEASURED block with the final numbers (see The Moat / The Colonnade / The Vault headers). Measure with compound loadouts: `revenge.ts matrix --run=<id> --difficulty=normal --loadouts=none,<kit ids>,<a+b>`. Matrix cells CROSS-TALK when several bot jobs share the machine (Briar L7 no-ability: 44% in a parallel sweep, 0% in three serial reads of the same file) — iterate with `--jobs=2` for direction, take the numbers of record with `--jobs=1 --trials=32`. Sanity-check the ladder with `revenge.ts runs --run=<id> --runs=40` and `--pool=<pair>`. The 10-25% random-pick target from the Moat is NOT being met by combo-gated runs (Vault 28%, Briar 55%, Glasshouse 43%) for a structural reason: with the pair as half of a 4-card kit and offers on L1/L3/L6/L9, a random picker nearly always holds both halves by L7. Report the number and explain it; whether to change kit size or offer cadence is Tyler's call (open question, 2026-09-05).

New runs live in their own file under `lib/run/runs/` (builders from `lib/run/run-kit.ts`, one line in `lib/run/extra-runs.ts`) so several can be authored in parallel without touching `runs.ts`.

---

## Anti-patterns (do not ship)

### 🚫 Uncapturable pieces guarded forever
Throne Room–style levels where a queen is always defended and Rookie can never take it. Players intuitively want to **capture the queen** — denying that the entire level is unfun. **Rule:** every enemy must be capturable on some realistic line (even if hard). If you want a "permanent" threat, use a hazard, not a piece.

### 🚫 Same strategy every level
If L1 and L7 both reduce to "find the open file and slide," the run is one level repeated 10 times. Each level must demand a **distinct primary decision** — sacrifice tempo? change form? burn an ability? bait a pawn? snake around a queen?

### 🚫 Difficulty by accretion only
Adding "+1 queen" between levels is not progression — it's the same strategy with more counters. Real progression changes **what the player has to do**, not just how many enemies are doing it.

### 🚫 Levels indistinguishable from each other
A run of 10 levels should have 10 silhouettes a player could sketch from memory. If two levels share a silhouette, redesign one.

### 🚫 Cheese paths
If a single ability (or no ability) one-shots the level the same way every time, the level is decorative. Verify with `sweep.ts` — if T3/T4/T5 all win the same way, the level is solved.

---

### 🚫 A hunter parked on the key's landing squares (Dead Bolt L10 v2, 2026-09-03)
A knight on f3 covering BOTH the lynchpin pawn (g5) and the key (h4) read as a "hunter double-lock" — but it denied every finisher a forced line (solver `no8` for all four) while the bot still won 88-100% in practice. Hunters that cover the capture squares make a level *unprovable*, not *hard*. If provability matters (it does for L10), take the difficulty through the clock instead: dropping that knight and cutting the budget 14→10 kept no-ability at ~23% with all four finishers proven W3-W5.

### 🚫 Pawns beside the pen on an open file (Dead Bolt L10 v1, 2026-09-03)
A 3x3 court with pawns c6/e6 next to the key and open c/e files below them read 88% no-ability: each pawn is a free capture-stun one slide from rank 1. Density belongs in the defended chain, never adjacent to his room on a file Rookie can run. (Same lesson as docs/revenge-runs.md §3, now with a number.)

### A universal solvent in a terrain kit (Colonnade, 2026-09-05)
`bishop-step`, `knight-hop`, `become-king` solved The Colonnade L10 at 100% each while every card in its real kit read 0%. Any of them in a kit whose signature is terrain is a skeleton key. See "The combo gate" above.

### The summoned body finishes alone (Vault L7 v1, 2026-09-05)
Vanguard alone read 100%: knights jump walls, so the dropped knight hopped straight onto the king. Fix that made the PAIR necessary: the 3-4 squares a knight could jump onto the king's square from are stone too, so a dropped body can only create a landing, and Swap is what turns the landing into a kill.

### The king stands on the summon's colour (Colonnade L8 v1, 2026-09-05)
Bishop Squire summons a light-squared bishop. With the king on e8 (light) the squire captured him alone, 100%. On d8 (dark) it reads 0% alone and 100% with Swap. Whenever a body has a colour or a geometry, put the king where that body cannot reach — the pair must be the bridge.

### Two doors in the wall (Colonnade L7 v1, 2026-09-05)
A colonnade with two gaps was free for a bare rook (100% no-ability, in the finale slot). One gap, on the far file, with 11 moves: singles 0-17%, pair 100%. A barrier with a second opening is not a barrier.

### Provable but unfindable (Glasshouse L7 v1-v3, 2026-09-05)
Three finale builds asked for a PRE-EMPTIVE freeze: freeze the watcher, then step into the square it covered. The AND-OR solver proved them (forced W3) but the playtest bot read the pair at 0-21% with perfect geometry — it will not spend a card on a piece that is not attacking it yet. Reframed as "freeze the KING where he stands, then arrive" (the same idea one level up), the pair read 72-100%. A level the bot cannot find is not shippable, and the same limit applies to delayed fuses: the Switchback's bot only found poison-dart + squire when the payoff became one summon-and-strike down an already open corridor. Design the pair's payoff as a reaction to a present threat, resolved in one turn.

### Pawn walls march (Briar, 2026-09-05)
Pawn priority is `-rank`, so the front row of any pawn wall advances one pawn per enemy turn and drains files open for free; a baited recapture vacates a square too. Dragon-alone leaked 38-88% through three revisions. Fixes: a crown of rank-8 pawns that re-seals a drained file, stumps (rank-7 hazards) in front of his room, and a self-blocking runner column on the far flank that out-priorities the wall for ~6 turns and then jams. Corollary: `enemiesPerTurn: 2` makes a marching wall EASIER (twice the drain) until the wall is pinned.

### Upgraded Boulder walls the player (Stacks, 2026-09-05)
With only magnet + boulder in the offer pool the offers keep UPGRADING them, and T4 Boulder forces two stones per use, T5 unlimited — in a one-wide shaft those stones wall Rookie's own route. Result: the pair-only pool cleared 25% of full runs while random picks cleared 35%. The Colonnade's boulder + bishop-squire anti-pair is the same self-block; it is a TIER problem as much as a partner problem. When Boulder is a signature card, pin its tier or give the pool a third card to absorb upgrades. Also from the Stacks: two adjacent rank-7 alcoves are not a dodge (a rook in one attacks the other) — a pen must be the full 2x2; and Decoy turns a frozen bishop into a pawn that can march, which re-opens a shaft.

### The gate depends on ability TIER (harness ground truth, 2026-09-05) — SOLVED by `abilityTierCaps`, 2026-09-06
Runs are validated with T1 cards, but offers UPGRADE cards during a run. The discovery harness, scoring the shipped runs under their own kits, found Colonnade L10 is NOT gated once Bishop Squire is T4 — it solos the level at 100% — and that The Moat's finale is not gated at all because its own kit contains `knight-hop`, a solvent (the Moat's L7-L10 only feel gated at low tier). Same family as the Stacks' upgraded-Boulder self-block. Five run headers in a row ended on the same sentence — "pinning this card's tier is the one decision that would make the gate tier-proof" — and a run had no way to say it.

**Now it does.** `RunDef.abilityTierCaps` (a map of ability id → the highest tier that run will ever offer or upgrade to) is enforced in ONE place: `rollOffer` in `lib/run/abilities.ts`, where an offered tier is decided. A capped card is still offered as a NEW pick (always T1) and still upgradable up to its cap; an upgrade past the cap is simply never built into the slate, and the existing short-slate top-up fills the seat with another upgrade or a new card. A tier the player already holds is never mutated. `offerIsExhausted` treats a capped card as topped out at its cap, and the playtest harness honours caps for the tier it INFERS (`--realistic`) while an EXPLICIT pin (`--loadouts=knight-hop:4`) stays uncapped on purpose — that probe has to keep measuring the tier the run refuses to hand out.

**How to choose a cap.** Sweep the finale one tier at a time — `revenge.ts matrix --run=<id> --levels=7,8,9,10 --loadouts=<card>:1` … `:5`, 32 trials, `--jobs=1`, ONE loadout column per invocation — and cap at the highest tier where every single kit card still reads ≤ 8%. Cap only the cards whose tier actually breaks the gate: a cap costs the player agency, so take the smallest one the numbers justify.

**The break is almost always the tier that grants a SECOND USE (or a second turn)** — check `maxUsesForTier` / `transformDurationForTier` before you sweep and you will usually guess the answer. Measured L7-L10, 32 trials, serial:

| Run | Card | Uses/turns ladder | Gate holds | Breaks at | Cap |
|---|---|---|---|---|---|
| The Colonnade (revenge-13) | bishop-squire | 1/1/2/2/2 uses | T1-T2 (9/0/0/0) | T3 (22/0/0/**84**) | **2** |
| The Parapet (revenge-23) | knight-hop | 1/1/1/2/1 uses | T1-T3 (0/0/0/0) | T4 (97/78/97/31) | **3** |
| The Lattice (revenge-24) | duchess | 1/1/1/2/2 uses | T1-T3 (0/0/0/0) | T4 (13/6-25/94/100) | **3** |
| The Alcove (revenge-25) | become-king | 1/2/2/3/3 uses | T1 (0/0/0/0) | T2 (**100**/19/**94**/**100**) | **1** |
| The Hayloft (revenge-27) | knight-hop | 1 use, 1/2/3/3/∞ turns | T1 (0/0/0/0) | T2 (0/47/0/59) | **1** |

Note the last two rows: the same card, `knight-hop`, caps at T3 in one run and T1 in another. **A cap is a property of the LEVEL GEOMETRY, not of the card** — the Hayloft's loft is big enough that one extra knight *turn* is a second jump, while the Parapet needs a second *use*. Never copy another run's cap; measure your own.

**A combo run SHOULD cap its signature cards** at the highest tier its own measurements support, in the same commit as its MEASURED block. Report the cap in the header with the numbers that chose it. Prove it through the offer path — `npx tsx scripts/run-playtest/tier-cap-audit.ts` rolls every capped run × level × owned tier and fails if any slate ever offers a capped id above its cap. The forced-loadout `matrix` numbers do NOT change when you add a cap, by design; the full-run `runs` read is where a cap shows up.

### A "free wait" is worth one move, and one move is under the noise floor (Hourglass, 2026-09-06)
Hourglass grants an enemy turn with Rookie's move still in hand. Two runs were
built to gate on it (The Candle, revenge-29; The Hearth, revenge-31) and neither
did. The card was then reworked — the T3 "the king is held" clause deleted (an
upgrade must never remove a card's function), and a glass-turn stopped running
Rookie's own clocks so it no longer taxed every other card in the game — and the
finales were re-measured. **The verdict did not move**, and the reason is a
theorem, not a tuning miss:

> **A glass is worth exactly one Rookie move, plus the durations that move would
> have burned.** An idle Rookie move produces the same enemy phase.

One move at 32 trials is inside the ~8pp binomial noise, so a card whose whole
value is one move can essentially never produce the gate's 8% / 60% split.
Two rules follow, and they apply to any future "free wait", "extra action" or
"skip your turn" card:

1. **The glass pays only when the PARTNER'S PAYOFF LANDS ON AN ENEMY PHASE** —
   a poison death, a decoy friendly-fire capture. That is the one payoff Rookie
   cannot buy with her own move. Measured: Candle L9 poison-dart 13% alone ->
   72-81% paired (the one cell in the catalogue where the glass decides a
   level); Candle finales decoy 47/44/69/31 -> 56/56/91/69.
2. **It is redundant beside any partner whose payoff lands on ROOKIE'S move** —
   snare, scarecrow, freeze-ray. Her threatening arrival already buys the enemy
   phase for free. Measured on the Hearth firebox, L6-L10, 32 trials: snare
   75/63/69/72/44 alone vs 69/63/78/53/38 paired; scarecrow 47/50/63/31/28 vs
   41/44/81/16/34; freeze-ray 44/50/88/22/25 vs 41/47/88/16/25. Note the sign:
   *slightly negative*, because a glass hands the whole court a free action.

So: **to gate on a wait card, build the FUSE weak, not the trap.** The gate must
be a clock whose payoff the player cannot reach in time with her own moves —
and the partner must be weak ALONE, which is where both runs failed (poison-dart
has no line of sight and no timing limit, so it self-syncs to her arrival and
solos 3 of 4 finales; snare solos all five).

The card was NOT retired. It is 0% alone on every finale of every run tested at
every tier, which is exactly the profile the kit rules demand of the two TRAP
fillers — and The Hayloft (revenge-27) and The Quarry (revenge-32) already ship
it in that seat. **A card that can never be a key and can never be a solvent is
worth a kit slot as a filler even if it is never half of a gate.** Grade a wait
card on that axis before you build a third run for it.

### One line, four times (Lattice and Alcove, Tyler 2026-09-06)
Tyler on The Lattice: "pretty fun, once you solved it you kind of figured it out." On The Alcove, same comment: "both very good in creativity, but they need more variance and difficulty, once you get the idea you solve it." Two levers: variance (below) and DIFFICULTY: tune the finale so the pair reads 60-80%, not 100%, with the clock and a second enemy per turn as the knobs, and make L8-L10 each add a wrinkle the L7 solution does not cover. Every combo run so far restates ONE finale line on L7-L10 with different geometry; the discovery is the fun and L8-L10 become execution. Inside the finale, each level must still demand a DIFFERENT decision with the same pair: a different order (bait first vs body first), a different target (mark the guard vs mark a hunter), a level where the pair is needed twice, or a level where a trap card briefly becomes the key. The "distinct primary decision" rule applies to L7-L10, not only L1-L6.

## Patterns that work

### The gated finale (Moat / Colonnade / Vault, 2026-09-04..05)
One constant signature restated on every level (water on rank 5; pillars on ranks 4-5; a sealed stone strongbox). L1-L2 free, mid-run single-card puzzles, L7-L10 unsolvable by any single card in the kit and solved by the signature pair. This is the run shape Tyler wants more of. Contract and numbers in "The combo gate" above.

### ✅ Iron Curtain (the gold standard for hard)
Layered pawn walls + defended chains. Forces *capture order* decisions — you can't just slide, you have to break the chain at the right link. Fun-hard because the puzzle is legible.

### ✅ Cavalry Charge (light progression baseline)
Knights spread across the board, escalating in count. Works because knight movement geometry makes path-planning genuinely different from rook-vs-pawn. **But:** doesn't change enough between levels — the *strategy* stays "thread the L-jumps." Use as a baseline, not a peak.

### ✅ The chess-game silhouette (experiment to run next)
A **row of pawns on rank 6** with an escalating set of pieces on **rank 7**, increasing across the run. Feels like a real chess game collapsing on Rookie. Each level adds a back-rank piece (rook → bishop → knight → queen → multiples) so the *kind* of threat changes, not just the count. Test whether this stays fresh across 10 levels or compresses to one strategy.

---

## Difficulty scaling rubric

The playtest sweep (`scripts/run-playtest/sweep.ts`) gives win % per tier (T3 casual, T4 sharp, T5 expert). Target curves for a 10-level run:

| Level | T3 win% (casual) | T4 win% (sharp) | T5 win% (expert) | Felt difficulty |
|------:|-----------------:|----------------:|-----------------:|-----------------|
| 1     | 95–100           | 100             | 100              | Trivial — joy   |
| 2     | 85–95            | 100             | 100              | Trivial         |
| 3     | 70–85            | 95–100          | 100              | First thinking  |
| 4     | 55–75            | 90–100          | 100              | First ability   |
| 5     | 40–60            | 80–95           | 95–100           | Real choice     |
| 6     | 30–50            | 70–90           | 90–100           | Real choice     |
| 7     | 15–35            | 55–80           | 85–100           | Pressure        |
| 8     | 5–25             | 40–70           | 75–95            | Pressure        |
| 9     | 0–15             | 25–55           | 60–90            | Brink           |
| 10    | 0–10             | 10–35           | 35–70            | Capstone — needs abilities |

**Hard rule for L10:** T5-expert-without-abilities (run ablation with all abilities removed) should win **≤ 10%**. If a no-ability bot can solve it, it's not the capstone.

**Hard rule for Revenge L7-L10 (2026-09-05):** the combo gate above — no single card in the kit above 8%, the signature pair at 60%+. A no-ability bar of 10% is satisfied by any one card and produced single-key runs; it is necessary, not sufficient.

**Difficulty smell tests** (independent of sweep numbers):
- Can you describe the **primary strategic question** of this level in 8 words? If not, it's muddy.
- Does that primary question **differ** from every other level in the run? If not, cut or redesign.
- If you remove the hardest ability the player could be offered, does the level become *interesting* (good) or *impossible* (bad — over-tuned)?

---

## Authoring checklist

Before shipping a new level / run:

1. **Silhouette test** — sketch the 10 levels side by side. Are they visibly different?
2. **Primary-question test** — write the one-sentence "what is this level asking?" for each. Any duplicates? Redesign.
3. **Captureability** — every enemy reachable on at least one realistic line.
4. **No-ability run** — solo-rook bot should clear L1–3 trivially, struggle by L5, fail L8+.
5. **Ability necessity** — L10 must require abilities (verified via ablation in `scripts/run-playtest/ablation.ts`). For Revenge, L7-L10 must pass the combo gate: `revenge.ts matrix` with `none`, each kit card, and the pair as a compound loadout.
6. **Sweep** — run `npx tsx scripts/run-playtest/sweep.ts` and compare to the rubric above. Iterate until each level lands in its target band.
7. **Read the digest** — `data/run-playtest/digests/latest.md`. Fail-mode histogram should show a *mix* (captured-by, move-limit, dead-end). All-one-fail-mode = one-dimensional level.

---

## Measuring — the harness used to lie, and here is the honest method (2026-09-06)

**Read this before you quote a number.** Everything measured before 2026-09-06 was
taken with a harness whose results depended on the SHAPE of the command, not just on
`(run, level, loadout, trial)`. Two independent defects, both fixed in commit `94482af`:

1. **A process-lifetime counter inside the bot.** `createMctsBot` kept `decisionIndex`
   as a closure variable on a module-level singleton, and that index was baked into the
   rollout RNG seed. So a game's play depended on how many decisions the bot had already
   made *in that process*. A cell read one number alone and a different one as a later
   column of a multi-column run, or under a different `--jobs` sharding — and repeating
   one cell four times inside a single process gave 24/16/21/23 wins out of 32. The
   counter is now per-GAME (keyed by the `BotContext` each game builds) and the game's
   own seed is mixed into the rollout seed.
2. **An unseeded start file.** Rookie's random start file came from `Math.random()`
   inside `puzzleToBoardState`. The app still uses `Math.random` (a player wants a fresh
   file each attempt); the harness now passes a seeded `startRng`.

**The command shape that gives a trustworthy number — after the fix, any of them.**
That is the whole point: a cell is now reproducible across invocation shapes, so you may
batch columns and parallelise freely.

```
npx tsx scripts/run-playtest/revenge.ts matrix --run=<id> --levels=7,8,9,10 \
  --loadouts=none,<card>,<card>,<card>,<card>,<a>+<b> --trials=32 --jobs=8
```

`--jobs=1` is no longer a correctness requirement, only slower. 32 trials still carries
~8pp of ordinary binomial noise, so do not tune a level off a 5-point difference.

**The footgun that produces silent garbage.** In zsh, `set -- $spec` does NOT word-split,
so a loop like `set -- "revenge-13 bishop-squire"; ... --loadouts=$2:3` sends
`--loadouts=:3` — an empty ability id. That used to build a loadout of one ability with no
id and no uses: it ran fast and printed plausible, meaningless win rates. The tell was a
4-cell read finishing in ~8s where an honest read takes ~50s. `--loadouts` now REJECTS an
empty component, an unknown ability id and a malformed `id:tier` (`assertValidLoadout` in
revenge-core.ts), and `matrix` echoes the resolved loadout list as its first line of
output — so a mis-expanded variable is visible immediately. Read that line before you read
the table.

**The regression check.** `scripts/run-playtest/matrix-determinism-check.ts` measures one
cell three ways — alone, inside a 4-column read, and at `--jobs=3` — and exits non-zero
unless all three agree exactly. Run it after any change to the bot, the engine's RNG, or
the harness:

```
npx tsx scripts/run-playtest/matrix-determinism-check.ts
```

If it fails, the harness is lying again: look for state shared between games in one
process (a module-level counter or cache in a bot) or an unseeded RNG in the engine.

*(Superseded note, 2026-09-03: "a cell moves with worker ordering — re-read with
`--jobs=1`." That observation was real but the diagnosis was wrong; `--jobs=1` did not
fix it, because with one job every cell ran in ONE process and shared the counter. The
cause was the counter, not the parallelism.)*

## Open experiments

- **Rank-6 pawn row + escalating rank-7 pieces** — does it stay fresh across 10 levels? (next up)
- **Form-required levels** — a level where rook-form is dead and Rookie *must* transform to bishop/knight to progress. Currently rare.
- **Hazard-anchored levels** — pieces few, but hazards force routes. Counterweight to dense-piece designs.

---

## How to add an insight to this doc

When a playtest, a play session, or a Tyler review reveals something new:

- **New anti-pattern** → add to "Anti-patterns" with the *example level* that taught us.
- **New working pattern** → add to "Patterns that work" with the example.
- **Rubric shift** → update the table, leave a dated note at the bottom of the section.
- **New experiment** → append to "Open experiments."

Always cite the source level/sim/conversation date so we can trace decisions later.
