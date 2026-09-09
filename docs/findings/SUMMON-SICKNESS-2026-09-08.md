# Summoning sickness — preliminary measurement, 2026-09-08

Tyler, after reaching depth 24: "for all the summons they should probably have
summoning sickness you know? Would you do a preliminary test on that to see how
it affects difficulty?"

SHIPPED 2026-09-08 after the measurement below and Tyler's call on the one
design question it raised. Same harness both sides — `_summon-sick.ts`, T5
bot, 32 trials/cell, 12 player-facing runs x levels 4/7/10 x the six summon
cards = 216 cells a side.

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
| L4  | 99.8% | 98.9% | -0.9 |
| L7  | 95.1% | 75.3% | **-19.8** |
| L10 | 80.1% | 53.9% | **-26.2** |

Overall 91.7% -> 76.0%, **-15.6 points** — three and a half times what the
capturing king did (-4.4). And the shape is right: the teaching half is
untouched and the back half takes all of it, because the thing being taken
away is precisely "drop a body next to the king and cash it in the same turn".

The full-run sweep moved for the first time all day: 39/40 instead of 40/40,
the single loss on L10's move limit. The bot with a full kit had cleared
everything, on every difficulty, before this.

## By card — and they are not equal

| summon | before | after | delta |
|---|---|---|---|
| summon-knight | 90.0 | 65.3 | **-24.8** |
| twin | 89.1 | 65.6 | **-23.5** |
| vanguard | 92.0 | 74.4 | -17.6 |
| bishop-squire | 86.3 | 69.7 | -16.5 |
| dragon | 96.9 | 90.8 | -6.1 |
| duchess | 95.8 | 90.5 | -5.3 |

Two things to read here.

**The first run of this measurement had summon-knight at EXACTLY +0.0**, which
was a bug in the patch, not a result: Summon Knight has its own spawn function
instead of going through `applySummonAlly`, so the field was never set on it.
Two spawn paths for one job. Setting it in both took summon-knight from 0.0 to
-24.8 — the largest drop of any card — and moved the overall number from -11.5
to -15.6. A cell that does not move at all is worth distrusting.

**Dragon and Duchess barely notice.** The cards that would look like the
obvious targets lose 5-6 points, while Twin loses 23. They are strong enough
to win a turn later; the cheap bodies were the ones being used as instant
answers. If the goal is to level the family rather than to nerf it, that is an
argument for sickness — it costs the strongest cards least.

## Does the king still fear a sick summon? YES — and that is the design

Tyler: "you drop a summon that attacks a king, does the king move?" Tested,
not reasoned about: a dragon dropped attacking the king down the file makes
him flee e8 -> d8, identically whether it is sick or ready.

Two different functions, which is why. The king's fear check is
`controlledThreatensSquare` — pure geometry, can this summon's moves reach his
square. Sickness lives in `canMoveAllyAt`, the player-input gate. They never
consult each other.

So sickness removes the instant kill, not the pressure: the drop still forces
him to run, you just cannot take him with it the same turn. Tyler's call, and
the reason Dragon and Duchess barely move in the table above — a lot of their
value is zoning, which is untouched. The harsher variant (the king ignores a
piece that provably cannot take him this turn) was offered and declined: "i
still think a king should move out of the way of a summoned sick knight."

## Two cells to watch

    revenge-1 L10  twin       47% -> 3%
    revenge-1 L10  vanguard   16% -> 9%

`revenge-1 L10` was ALSO the level the capturing king hit hardest (queen-pulse
92% -> 21% that day). It is now being squeezed from two directions in one
afternoon. If anything in the ladder needs loosening after both changes, it is
that level — look there first.
