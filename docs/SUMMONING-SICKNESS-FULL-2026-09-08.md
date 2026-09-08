# Summoning sickness — the full ladder + endless test

Tyler, 2026-09-08: *"before we make that change, maybe tonight you do extensive
testing on that proposed rule change to see how it affects all the ladder and
endless? I def want this to be harder but not impossible."*

Ran it. The rule was reverted from the game first (51012ba) and only patched
into the working tree for the measurement — the game is untouched.

**Method.** 60 full runs per ladder rung, L1-L10, on Normal AND Hard, using each
difficulty's real retry budget (both = 1 retry per level). 60 Endless sessions,
one life, real ramp, depth capped at 60. Identical seeds both sides, so the diff
is the rule and nothing else. Harness: `_sickness-shard.ts` + `_sickness-merge.ts`.

This is a RUN-level measurement, not a level-level one. This afternoon's 91.7% ->
76.0% counted levels; a ladder rung is not "impossible" when one level is lost,
it is impossible when the run ends. At 1 retry those are very different numbers.

## Headline

| | base | sickness | diff |
|---|---|---|---|
| Ladder full-clear, Normal | 52.5% | 36.0% | **-16.5** |
| Ladder full-clear, Hard | 37.3% | 27.2% | **-10.1** |
| Endless median depth | 25 | 20.5 | **-4.5** |
| Endless p75 depth | 44 | 31 | **-13** |
| Endless p10 depth | 15 | 14 | -1 |

## Ladder, by rung (full-run clear %)

| rung | run | Normal base | Normal sick | Hard base | Hard sick |
|---|---|---|---|---|---|
| 1 | revenge-21 | 53 | 53 | 38 | 38 |
| 2 | revenge-18 | 57 | 40 | 53 | 35 |
| 3 | revenge-15 | 50 | 50 | 32 | 32 |
| 4 | revenge-23 | 62 | 45 | 58 | 45 |
| 5 | revenge-12 | 37 | **10** | 28 | **3** |
| 6 | revenge-24 | 63 | 60 | 30 | 40 |
| 7 | revenge-25 | 53 | 53 | 33 | 33 |
| 8 | revenge-19 | 47 | **10** | 18 | **3** |
| 9 | revenge-22 | 38 | **2** | 15 | **0** |
| 10 | revenge-17 | 65 | 37 | 68 | 43 |

## What the table actually says

**1. It is not a difficulty knob. It is a card nerf, and the ladder is not
evenly built out of those cards.** Rungs 1, 3 and 7 move by *exactly* zero on
both difficulties — identical clear rates AND identical retry counts, i.e. bit
for bit the same runs. Those pools contain no summons for the rule to touch.
Meanwhile 5, 8 and 9 lose 25-37 points. Shipping this flat does not make the
ladder harder; it makes four rungs untouched and three rungs a different game.

**2. Three cells cross from "harder" into "not worth playing".** Hard rung 9
(revenge-22) goes 15% -> **0/60 runs cleared**. Hard rungs 5 and 8 land at 3%.
That is the "not impossible" line, and this is over it.

**3. Endless is the good case — and Endless is where he was standing when he
asked.** It shaves the long tail (p75 44 -> 31, sessions past depth 40: 18 ->
10) while leaving early death alone (p10 15 -> 14, min 11 both sides). That is
precisely "harder but not impossible": the depth-24 run he was on gets shorter,
the first ten floors do not get meaner. Caveat: 10 base / 7 sick sessions hit
the harness's depth-60 cap, so the true top of both distributions is higher
than measured and the real tail cut is somewhat larger.

## The retry budget is the actual answer to his bar

His acceptance bar: *"sometimes on Shotgun King I have to try a level 20 times
before I beat it."* Revenge cannot express that today, and sickness does not
get it closer. Normal and Hard both allow **1** retry per level, Nightmare 0.
A level you clear 20% of the time therefore ends about 64% of runs — twenty
attempts at it is nineteen dead runs and nineteen re-clears of L1-L4, not a
level you bang your head against.

Shotgun King's difficulty is cheap retries on a hard thing. Ours is one retry
on an easier thing. Lowering the clear rate without touching the retry budget
moves us away from his reference, not toward it — it converts "too easy" into
"run over", which is the complaint he'll have next.

## Recommendation

1. **Ship summoning sickness in ENDLESS only.** It does exactly what he asked
   for there, on the mode he was playing, with no rung going to zero.
2. **Do NOT ship it flat on the ladder.** Rungs 5, 8, 9 need their levels
   re-tuned for it first, or they need to keep the old rule.
3. **Raise the retry budget and re-measure.** That is the lever that buys the
   Shotgun King feel. Sickness plus generous per-level retries is plausibly the
   combination he actually wants; sickness plus 1 retry is not.

Data: `data/run-playtest/sickness/BASELINE.json`, `.../SICKNESS.json`.
