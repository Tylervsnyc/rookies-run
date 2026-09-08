# Summoning sickness — preliminary measurement, 2026-09-08

Tyler, after reaching depth 24: "for all the summons they should probably have
summoning sickness you know? Would you do a preliminary test on that to see how
it affects difficulty?"

MEASURED, NOT SHIPPED. The change is `data/run-playtest/summon-sickness.patch`
(one field). Same harness both sides — `_summon-sick.ts`, T5 bot, 32
trials/cell, 12 player-facing runs x levels 4/7/10 x the six summon cards =
216 cells a side.

## The rule

A summoned ally arrives and cannot act until your NEXT turn. It is still a
body at once — it blocks lines, it cuts the king's flight squares, Sacrifice
and Swap can target it — it just cannot move or capture on the turn it lands.

Nothing new was invented: `dazed` already exists, added for Convert on
2026-09-06 for the same complaint ("some levels too easy where you can just
capture the king on the first move"). `canMoveAllyAt` reads it and the enemy
turn clears it. Applying it to the rest of the family is one field.

## Result: the biggest difficulty lever measured so far

| level | before | after | delta |
|---|---|---|---|
| L4  | 99.8% | 99.4% | -0.4 |
| L7  | 95.1% | 79.1% | **-16.1** |
| L10 | 80.1% | 62.0% | **-18.1** |

Overall 91.7% -> 80.2%, **-11.5 points** — nearly three times what the
capturing king did (-4.4). And the shape is right: the teaching half is
untouched and the back half takes all of it, because the thing being taken
away is precisely "drop a body next to the king and cash it in the same turn".

## By card — and they are not equal

| summon | before | after | delta |
|---|---|---|---|
| twin | 89.1 | 65.6 | **-23.5** |
| vanguard | 92.0 | 74.4 | -17.6 |
| bishop-squire | 86.3 | 69.7 | -16.5 |
| dragon | 96.9 | 90.8 | -6.1 |
| duchess | 95.8 | 90.5 | -5.3 |
| summon-knight | 90.0 | 90.0 | **+0.0** |

Two things to read here.

**summon-knight moved by EXACTLY nothing, and that is a gap, not a finding.**
It is not in `CONTROLLED_SOURCES` — it is an AI-driven ally, so `canMoveAllyAt`
never runs for it and `dazed` cannot gate it. Sickness for AI allies (it and
Squad) would need a separate check in the ally step. Decide whether "all the
summons" means them too.

**Dragon and Duchess barely notice.** The cards that would look like the
obvious targets lose 5-6 points, while Twin loses 23. They are strong enough
to win a turn later; the cheap bodies were the ones being used as instant
answers. If the goal is to level the family rather than to nerf it, that is an
argument for sickness — it costs the strongest cards least.

## Two cells to watch

    revenge-1 L10  twin       47% -> 3%
    revenge-1 L10  vanguard   16% -> 9%

`revenge-1 L10` was ALSO the level the capturing king hit hardest (queen-pulse
92% -> 21% that day). It is now being squeezed from two directions in one
afternoon. If anything in the ladder needs loosening after both changes, it is
that level — look there first.
