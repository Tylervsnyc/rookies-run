# The ladder, overnight 2026-09-08 — what broke and what it costs

Tyler, last night: *"one thing i'm not seeing much difference between the
difficulty of levels, can you make sure the more difficult levels have more
pieces added?"*

Short answer: the flatness is real, adding pieces is not the fix, and the cause
turned out to be a regression rather than level design.

## 1. "More pieces on harder levels" — measured and refuted

Authored enemy counts per rung averaged 1.9-4.9 for rungs 1-9 with no trend at
all (rung 2 holds FEWER than rung 1), and 17.6 on rung 10. So the complaint is
justified: there is no density ramp, across rungs or inside them.

But three density curves were built and swept (60 runs/rung, Normal + Hard), and
**all three lost to changing nothing**:

| | mean distance from a ladder line (65% at rung 1 falling to 35% at rung 10) |
|---|---|
| **no change** | **11.6pp** |
| A gentle | 20.7pp |
| B steep | 26.7pp |
| C level-heavy | 30.5pp |

Two mechanics facts came out of it, both worth keeping:

- **Extra enemies are food.** On a sparse board more pieces means more capture
  material, which means more tempo. Rung 1 got EASIER, 53% -> 67%.
- **Rung 10 is immune.** The Briar already exceeds every target, so no density
  curve can touch it, and it stays the easiest rung on the ladder regardless.

Data: `data/run-playtest/results/2026-09-08/density/CURVE-{A,B,C}.json`.

## 2. The actual cause: the capturing king

`d83153c` ("The king takes what stands next to him", 2026-09-07) gave the enemy
king a capture. Every combo finale had been hand-tuned into the 60-80% band
against a king who could not capture, and nothing re-measured the ladder after.

Pair clear on L7-L10, mean, band is 60-80%:

| rung | run | before | now | |
|---|---|---|---|---|
| 1 | revenge-21 The Slash | 71.3 | **37.8** | too hard |
| 2 | revenge-18 The Glasshouse | 72.0 | 70.0 | ok |
| 3 | revenge-15 The Stacks | 72.8 | **0.0** | DEAD |
| 4 | revenge-23 The Parapet | 67.5 | **15.0** | too hard |
| 5 | revenge-12 The Moat | 72.8 | 68.0 | ok |
| 6 | revenge-24 The Lattice | 66.5 | **96.0** | too easy |
| 7 | revenge-25 The Alcove | 67.3 | **93.8** | too easy, GATE BROKEN |
| 8 | revenge-19 The Cliff | 70.5 | 71.0 | ok |
| 9 | revenge-22 The Millstone | 78.8 | 78.3 | ok |
| 10 | revenge-17 The Briar | 79.3 | 80.8 | borderline |

Six of ten rungs left the band **in both directions**. Rung 7's combo gate is
broken outright: a single card clears a finale level at 100%, so The Alcove no
longer requires its pair — the gate contract (every single card <= 8%) is
violated on the live ladder.

## 3. The verification chain (each step killed a cheaper explanation)

Nothing here was reasoned about; each claim is a measurement, and the first
three were things I believed and then disproved.

1. **Bisect.** The Stacks reads its documented 75/72/75/69 at `71e2353`, and
   0/0/0/0 at `d83153c` and every commit since, including HEAD. `f92684f`'s
   "one action per phase" walk-back restored nothing.
2. **Not captures.** 40/40 losses on L7 are MOVE-LIMIT, zero captures — which
   killed the first theory, that the king eats Rookie as she arrives.
3. **Not the clock either.** A sweep at +0/+1/+2/+3/+4 moves reads 0% at every
   budget on L7, L8 and L10. "Move-limit" is just how a bot with no line times
   out.
4. **Why.** `d83153c` touched only `pawn-ai.ts` and `app/page.tsx` — the
   playtest bot was never edited. But the bot derives danger from legal enemy
   moves, so the king's new captures silently made all EIGHT squares around him
   lethal. On a 2x2 corner pen every square a rook can attack that pen from at
   close range is one of those eight.
5. **Not a bot artifact.** `solveLevel` returns no-forced-win at depth 9 on L7,
   L8 and L10 — and per start file, **0 of 8 starts are winnable on each**. The
   levels are genuinely dead, holding both key cards, from every start.

## 4. What it would take to fix

The king captures only Rookie, and only from an adjacent square. So the win has
to arrive as a rook slide of 2+ squares ONTO his square, or through a stun —
never by standing beside him for a turn. That is approach geometry, not a clock,
which is why the 2026-09-07 retunes (which only moved move limits) cannot be
recovered by moving them again.

Tyler ruled out both easy outs in `d83153c`'s own text — *"I do think the king
should be able to capture, it will make the game more difficult"* and *"we can't
have different rules for the king in different places."* So:

1. **Re-tune the six rungs to the new king.** Respects both wishes. Real work:
   three finales rebuilt, two made hard again, one gate rebuilt.
2. **Revert the king.** Ten tuned rungs back for free, contradicts the design
   decision he made yesterday.

**Recommendation: 1**, one rung at a time, measured after each — but it is his
call, and it is a bigger bill than "add some pieces".


## 4b. What one rebuild actually costs (attempted, then reverted)

I rebuilt The Stacks L7 as a cost probe. It is NOT in the tree — the edit was
reverted; `lib/run/runs/revenge-15.ts` is untouched. What it bought is a price
tag for option 1.

The diagnosis was exact. L7's king sits on g7 with rank 7 walled by stone at
c7/e7/f7, so the ONLY square that threatens him is g8 — and g8 is adjacent, so
he now eats her there. One approach square, and the king's new capture made it
lethal. That is the whole bug, and it is geometry, not tuning.

The rebuild opened the h-file as a third shaft, plugged it like the others, and
moved the king onto it, so the pull becomes a real choice of target where the
wrong plug walks you into the adjacent-square death. Three passes:

1. **Open h-file, plug at h5, king h7.** Every loadout 100%, including `none` —
   the plug was undefended, so she simply captured it. The b6/d6 plugs work
   because a stump pawn punishes the capture; mine had no punisher.
2. **Add the stump pawn at g6.** Gate half-returns: `none` 0%, `boulder` 0%,
   `magnet` 34%, pair 47%. But `aegis` and `decoy` each read 100%.
3. **Stopped there** and reverted.

The lesson from pass 3 is the useful one, and it is narrower than I first wrote:
this is **not** "a shield beats the capturing king everywhere" — on The Alcove
`aegis` reads 0% on L7 and L9. It is that a level whose difficulty rests on ONE
lethal square is trivially defused by any card that survives one hit. The
original L7 did not have that shape; my rebuild did.

**The price of option 1, honestly:** each broken finale is a geometry rebuild,
not a retune, and each rebuild has to re-satisfy a four-card gate that the new
king has also moved. Two evenings of measured work for the five broken rungs is
a realistic estimate, not one.

**Correction to section 2's table:** The Alcove's broken gate is `become-king`
alone at **100% on both L7 and L9** — measured tonight. Not aegis.

## 5. Also measured overnight

- **Summoning sickness** (`docs/findings/SUMMONING-SICKNESS-FULL-2026-09-08.md`): ship it
  in Endless only. It cuts the long tail (p75 depth 44 -> 31) without touching
  early death, but on the ladder it takes three rungs to 0-3%.
- **Difficulty in Revenge is the retry budget**, not level hardness. Normal and
  Hard both allow exactly 1 retry; a 20%-clear level ends ~64% of runs. The
  "20 tries on Shotgun King" bar is unreachable without changing that number.
  A 1/3/5 retry sweep ran overnight.

## 6. Caveat on every number in this file

The baseline sweeps (Normal 52.5% full-clear, the flat per-rung shape, the
density and dial results) all describe a ladder with three dead finales and two
free ones. They are internally valid — identical baselines on both sides of each
comparison — but the ladder they measure is broken. Re-baseline once the king is
settled.
