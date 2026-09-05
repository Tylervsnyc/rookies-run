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
| The run's signature pair | >= 60% (aim 70-100%) |

Fewer winning pairs is better; a level with exactly one answer is the best kind. Calibration from the runs Tyler rated: Moat finale singles 0% / pair 79-100%, full runs 25% clear with random picks. Colonnade finale singles 0% / pair 100-100-100-71%, full runs 12% random / 55% when the player takes the pair. Vault finale singles 0% / pair 81-97%, 28% random / 53% with the pair. A run where picking the wrong cards early ends you at L7-L8 is correct — that tension is the design.

**Why the gate is kit-relative, not game-wide.** `bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's geometry *is*, so they cross any terrain and solve terrain levels alone (Colonnade L10: 0% for every card in its kit, 100% for each of those three). Big summons behave the same way on many boards. A terrain-signature level can essentially never be gated against all 23 abilities, and the player only ever holds the kit, so the kit is the unit of measurement. The discovery harness (`scripts/run-playtest/combo-discover.ts`) records which kits gate a level; a level gated under many kits can ship in many runs.

**Kit composition rules:**
1. Exactly 4 cards: the signature pair + 2 fillers that are TRAPS on most levels (each may be a KEY on one or two mid-run levels).
2. Never a universal solvent in a terrain kit unless it IS half the signature pair (cage-and-take, boulder + knight-hop, is legitimate; a stray knight-hop beside a moat is a skeleton key).
3. Check `data/run-playtest/pair-hypotheses.json` `antiPairs` before choosing fillers. Measured: boulder + bishop-squire dropped Colonnade L10 from 71% to 33% (a stone walls the player's own diagonals). Illegal: convert + sacrifice (only controlled summons detonate), convert + poison-dart (Convert heals the poison). Two summons together are near-useless (one body-move per turn).
4. **Vary the signature pair between runs.** The Colonnade reused the Moat's pair; Tyler solved it fast and said it "felt similar." A new theme over the same answer is the same run.

**Mechanics that make pairs work (read `docs/ability-pairs.md`):** almost every ability is a free action — only a body moving ends the turn — so the scarce resource is body-moves, not casts. Any capture credited to your side stuns the king, whatever made it (Rookie, a summon, a Boulder crush, a poison death). Swap is the socket most pairs plug into ("body-then-become"); Boulder and Magnet have so far never gated a level with any partner.

**Authoring order:** write the design header FIRST — signature, a per-card KEY/TRAP map by level, the intended line for each of L7-L10 — then build, then let the bots falsify it, then append a MEASURED block with the final numbers (see The Moat / The Colonnade / The Vault headers). Measure with compound loadouts: `revenge.ts matrix --run=<id> --difficulty=normal --loadouts=none,<kit ids>,<a+b>`; sanity-check the ladder with `revenge.ts runs --run=<id> --runs=40` (10-25% random) and `--pool=<pair>` (45-65%).

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

## Measuring — read the noise before you tune (2026-09-03)

A single `revenge.ts matrix` cell moves with worker ordering, not just trials: Dead Bolt L10 no-ability read 50% inside a 240-cell parallel sweep and 21-25% in three isolated runs. Before tuning a level off one number, re-read it with `--levels=<n> --loadouts=none --trials=48 --jobs=1`; that read (23%) was the stable one.

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
