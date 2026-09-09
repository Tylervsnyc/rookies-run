# The capturing king silently rescrambled the whole ladder

**Found 2026-09-08, overnight.** Tyler: *"one thing i'm not seeing much
difference between the difficulty of levels."* He is right, and this is why.

## What happened

`d83153c` — "The king takes what stands next to him" (2026-09-07) — gave the
enemy king a capture. Every combo run's finale had been hand-tuned into the
60-80% band against a king that could not capture. The commit invalidated that
tuning for all ten ladder rungs at once, and nothing re-measured the ladder
afterwards. `f92684f` ("the king gets ONE action per phase") walked part of it
back; it did not restore any of the numbers.

Bisected on revenge-15's finale, 32 trials/cell, the exact command its own
docs record:

| commit | The Stacks (magnet+boulder), L7-L10 |
|---|---|
| `71e2353` (parent) | **75/72/75/69** |
| `d83153c` the capturing king | **0/0/0/0** |
| `ad62843`, `f92684f`, `e442100`, `e6f0432`, HEAD | 0/0/0/0 |

## The damage, all ten rungs

Pair clear on L7-L10, mean. Band is 60-80%.

| rung | run | before | now | |
|---|---|---|---|---|
| 1 | revenge-21 The Slash | 71.3 | **37.8** | too hard |
| 2 | revenge-18 The Glasshouse | 72.0 | 70.0 | ok |
| 3 | revenge-15 The Stacks | 72.8 | **0.0** | UNWINNABLE |
| 4 | revenge-23 The Parapet | 67.5 | **15.0** | too hard |
| 5 | revenge-12 The Moat | 72.8 | 68.0 | ok |
| 6 | revenge-24 The Lattice | 66.5 | **96.0** | too easy |
| 7 | revenge-25 The Alcove | 67.3 | **93.8** | too easy + GATE BROKEN |
| 8 | revenge-19 The Cliff | 70.5 | 71.0 | ok |
| 9 | revenge-22 The Millstone | 78.8 | 78.3 | ok |
| 10 | revenge-17 The Briar | 79.3 | 80.8 | borderline |

**Six of ten rungs left the band, in BOTH directions.** Three became unwinnable
or nearly so; two became trivial. That is not "the game got harder" — it is the
ladder losing its shape, which is exactly the flatness Tyler is feeling.

Worse, rung 7's **combo gate is broken**: a single card now clears a finale
level at 100%, so The Alcove no longer requires its pair at all. The gate
contract — every single card <= 8% — is violated on the live ladder.

## Why it cuts both ways

A capturing king is not a uniform difficulty tax. On the tight rooms (Slash,
Stacks, Parapet) he eats the stone/plug/twin the solution depends on, and the
line simply dies. On the looser runs (Lattice, Alcove) his capture *spends his
action* and pulls him off the square he was safe on — he walks into the answer.
The same rule makes tight levels impossible and loose levels free.

## The call for Tyler (not made overnight)

1. **Revert the capturing king** and get ten tuned rungs back for free. Cheapest
   by far, but it was a deliberate feature with its own measurement (`ad62843`).
2. **Keep it and re-tune the six broken rungs** to the new king. That is real
   design work per run, and rung 7 needs its gate rebuilt, not just its clock.
3. **Keep it but pin it off on the combo runs**, the way revenge-21 already pins
   Hard's enemy delta to 0. Contained, and it preserves the feature wherever it
   was actually wanted.

Recommendation: **3**, then re-measure. It keeps the feature, restores the
ladder, and does not ask anyone to re-tune six runs by hand tonight.

## What this invalidates

Everything measured on this ladder today describes a broken one. The sickness
sweep and the density sweep are still internally valid (identical baselines on
both sides), but their absolute numbers — Normal 52.5% full-clear, and the
"flat" per-rung shape — are the numbers of a ladder with three dead finales and
two free ones. Re-baseline after the king is settled.
