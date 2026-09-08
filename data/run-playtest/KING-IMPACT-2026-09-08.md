# What the capturing king did to difficulty — 2026-09-08

Measured, not guessed. Same harness both sides (`_king-impact.ts`,
`matrixParallel`, T5 bot, 24 trials/cell), run once on `d83153c` and once in a
worktree at `71e2353` — the commit immediately before the king could capture.
12 player-facing runs × levels 1/4/7/10 × loadouts none / queen-pulse /
knight-hop / freeze-ray = 192 cells a side.

Single-ability loadouts on purpose: a full T5 kit clears every shipped level
100% either way, so the full-run sweep can prove solvability and nothing else.

## The shape is the headline

| level | mean before | mean after | delta |
|---|---|---|---|
| L1  | 100.0% | 100.0% | +0.0 |
| L4  |  98.8% |  98.7% | -0.1 |
| L7  |  84.8% |  81.4% | -3.4 |
| L10 |  76.4% |  62.2% | **-14.2** |

Overall 90.0% -> 85.6% (-4.4). The change is not spread across the game: it
lands almost entirely on the FINALE, which is the level where you have to walk
up to the king to win. Early levels are untouched — you rarely stand next to
him there, so the new rule never fires.

By loadout: none -6.7, knight-hop -4.2, queen-pulse -3.5, freeze-ray -3.3. The
bare rook loses the most, which follows: the powers are what let you reach him
from somewhere he cannot reach back.

## Three finales the bare rook can no longer take

`revenge-1 L10` 42% -> 0%, `revenge-9 L10` 21% -> 0%, `crucible L10` 25% -> 0%.
With no ability at all, a lone rook can no longer finish those boards.

This is fine, and it is worth being explicit about why: `none` is not a state a
real player is ever in at level 10. Re-measured with `--realistic` (the tiers a
player actually arrives with), the same finales read **97% / 98% / 100%** with
queen-pulse. A 40-run T5 sweep also clears 40/40. Nothing became unwinnable.

## Biggest single swings (T1 loadouts)

    revenge-1  L10  queen-pulse   92% -> 21%   (-71)
    revenge-4  L10  queen-pulse   88% -> 17%   (-71)
    revenge-1  L10  freeze-ray    63% -> 17%   (-46)
    revenge-6  L7   none          83% -> 38%   (-45)
    revenge-1  L10  knight-hop    63% -> 21%   (-42)

`revenge-1 L10` is the level the change hit hardest — confirmed at 64 trials
(none 0%, queen-pulse 27%, freeze-ray 22%, knight-hop 28%). At realistic tiers
it is 97%, so it is hard, not broken.

Exactly one cell got EASIER: revenge-9 L7 with no abilities, 13% -> 38%. Almost
certainly a king who now stands his ground instead of fleeing to a better
square.

## Still stale

Every other measurement on disk — the 51-pair combo library,
`finale-remeasure-2026-09-06.json`, `multi-route-audit-2026-09-07.json`, and
Endless's Rule B which reads the remeasure file — was taken against a passive
king and has NOT been refreshed.
