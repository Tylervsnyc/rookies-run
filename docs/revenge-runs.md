# Rookie's Revenge — candidate runs (2026-08-30)

Four new hidden runs (`/?run=revenge-2` … `revenge-5`), registered in
`HIDDEN_RUNS` + `REVENGE_CANDIDATE_RUN_IDS` only — NOT in the daily pool
until Tyler signs off. Built with `scripts/run-playtest/revenge-generate.ts`
(candidate generator, see its header) and tuned by hand against
`scripts/run-playtest/revenge.ts`.

## The headline measurement changed mid-build

The original brief tuned the **no-ability** column to revenge-1's curve
(100/100/100/100/90/50/55/50/30/30). Tyler then played revenge-1 and found
it easy with just the three starters, and the bot agrees: with the offer
pool restricted to **surge / freeze-ray / drones** and every offer taken
(`revenge.ts runs --pool=surge,freeze-ray,drones`), revenge-1 clears
**30/30 on Normal and 30/30 on Rookie**. So the headline number below is
the *starter-kit full run*; the no-ability matrix is secondary.

### Why the starter kit flattens every level (the finding that matters)

Traced with `revenge.ts trace --realistic` on revenge-5:

1. **Surge is the whole story.** During a Surge turn the king does not
   react (he only flees on the enemy turn). Surge T2 (L4–L6) is +1 move,
   T3 (L7–L9) is +2 moves and **2 uses per level**. So T2 = "any square one
   rook move from his line wins", T3 = "two moves from his line wins",
   and captures inside the surge turn are free (no reply). No pen
   geometry that is winnable for a plain rook keeps the nearest safe
   square 3+ moves from his line — it is a distance a lone rook covers.
   Per level the bot with surge alone is 100 % on every candidate level
   we built (see the matrices). This is an ability-balance problem
   (surge uses / tiers / the king ignoring surge turns), not a level
   problem — flagged for Tyler, not fixed here.
2. **Shell pawns march.** Enemy pawns pick their mover by `-rank`, so a
   key or defender on rank ≤ 4 outranks the rest of the shell and walks
   forward the first time no hunter has a better move (guaranteed at
   `enemiesPerTurn: 2`). A key that steps off its defenders is a free key
   on his file. Rule: keys/defenders on rank 5+, marchers on 2–3. The
   generator lint now warns on this.
3. **Pawns near his file are ammunition, not armour.** Every capture is a
   stun, so a thick shell beside the key (rings on c/e) makes the
   no-ability route *easier* (swarm-L10 candidates: 100 % with 12 pawns).
   Density has to sit in the chain (defended-by-the-one-behind arches),
   not beside the door.
4. **Freeze-ray and drones DO respond to geometry**: the seven-pawn arch
   (revenge-5 L7 / revenge-3 L9) takes freeze-ray to 35–45 % and drones to
   70–85 % on the heaviest levels; the rank-6 wall with one open file
   (revenge-5 L5) takes freeze to 65 % and drones to 70 %.

## Harness notes

- `revenge.ts runs --pool=a,b,c` (alias of `--unlocked=`) restricts offers
  to the starter kit; `--difficulty=rookie|normal` applies the mode.
  `trace --realistic` uses the realistic tier for the level.
- The MCTS bot seeds its rollouts from a per-process decision counter, so
  a cell's number depends on which games ran before it in the same worker.
  Between two identical invocations the same cell moves ±15 points at 20
  trials. Read every number below as ±10.
- Every level here passes `revenge.ts lint` (defended keys on L5+, free
  keys only on the L1–L4 teaching levels).

## revenge-2 — Pawn Storm

PAWN STORM — pawn count ramps 3 -> 15 (shells, rings, marchers), hunters stay light (one knight, a bishop from L8, a queen only on L10). Lesson: dismantle the chain from the outside in; every capture on his line is a stun.

| L | level | pieces | walls | moves | enemies/turn |
|---|---|---|---|---|---|
| 1 | FIRST BLOOD | 3 | 0 | - | 1 |
| 2 | THE SHELL | 9 | 0 | - | 1 |
| 3 | THE DOORS | 5 | 4 | - | 1 |
| 4 | ONE GUARD | 6 | 4 | - | 1 |
| 5 | THE HEDGE | 7 | 4 | 12 | 1 |
| 6 | THICKET | 9 | 4 | 11 | 1 |
| 7 | BRAMBLE | 8 | 4 | 14 | 1 |
| 8 | THE WALL OF PAWNS | 10 | 4 | 10 | 1 |
| 9 | PAWN STORM | 13 | 4 | 16 | 1 |
| 10 | THE SWARM | 15 | 4 | 13 | 1 |

**Starter-kit full runs** (pool = surge/freeze-ray/drones, every offer taken, T5, 30 runs, no retries):

| L | Normal reached/cleared | Rookie reached/cleared | losses (Normal) |
|---|---|---|---|
| 1 | 30/30 (100%) | 30/30 (100%) | - |
| 2 | 30/30 (100%) | 30/30 (100%) | - |
| 3 | 30/30 (100%) | 30/30 (100%) | - |
| 4 | 30/30 (100%) | 30/30 (100%) | - |
| 5 | 30/30 (100%) | 30/30 (100%) | - |
| 6 | 30/30 (100%) | 30/30 (100%) | - |
| 7 | 30/30 (100%) | 30/30 (100%) | - |
| 8 | 30/30 (100%) | 30/30 (100%) | - |
| 9 | 30/30 (100%) | 30/30 (100%) | - |
| 10 | 30/30 (100%) | 30/30 (100%) | - |

Normal: **full clears 30/30** · Rookie: **full clears 30/30**

**Single-ability matrix** (T5, realistic tiers, 20 trials, offers dismissed; `none` = no ability):

| L | none | surge | freezer | drones | knighth | bishops | queenpu | aegis | decoy |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 95% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 6 | 55% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 7 | 55% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 8 | 55% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 9 | 50% | 100% | 80% | 100% | 100% | 100% | 100% | 100% | 100% |
| 10 | 10% | 100% | 10% | 100% | 95% | 85% | 100% | 100% | 100% |

Solver (forced capture within 6 Rookie moves, worst start file), L7-L10: 7      W6      W3      W4      W3; 8      W6      W4      W4      W3; 9     no6      W6      W6      W6; 10     no6     no6     no6     no6 (columns none/surge/freeze-ray/drones).

Caveats:

- L10 is the only level that bites (none 10%, freeze-ray 10%); L6-L9 sit at 50-55% no-ability, i.e. revenge-1 shape. With the starter kit the whole run is 30/30 on both modes — it is a pawn-count showcase, not a hard run.
- Pawn rings beside the key are stun ammunition (see finding 3); if Tyler wants this run harder, move density into arches and cut the c/e rings.

## revenge-3 — The Royal Guard

THE ROYAL GUARD — few pawns, heavy hunters: bishop at L2, first queen L6, twin queens L8, five heavies on L10. L8-L10 use the seven-pawn ARCH (a8/b7/c6/d5/e6/f7/g8, each pawn defended by the one behind it) and two enemies per turn.

| L | level | pieces | walls | moves | enemies/turn |
|---|---|---|---|---|---|
| 1 | THE THRONE | 3 | 0 | - | 1 |
| 2 | THE BISHOP | 6 | 0 | - | 1 |
| 3 | THE PAGE | 4 | 4 | - | 1 |
| 4 | TWO COURTIERS | 5 | 4 | - | 1 |
| 5 | THE ESCORT | 7 | 4 | 13 | 1 |
| 6 | HER MAJESTY | 7 | 4 | 14 | 1 |
| 7 | THE RETINUE | 8 | 4 | 18 | 2 |
| 8 | TWIN QUEENS | 10 | 2 | 14 | 2 |
| 9 | THE PRIVY COUNCIL | 13 | 2 | 14 | 2 |
| 10 | THE ROYAL GUARD | 16 | 2 | 15 | 2 |

**Starter-kit full runs** (pool = surge/freeze-ray/drones, every offer taken, T5, 30 runs, no retries):

| L | Normal reached/cleared | Rookie reached/cleared | losses (Normal) |
|---|---|---|---|
| 1 | 30/30 (100%) | 30/30 (100%) | - |
| 2 | 30/30 (100%) | 30/30 (100%) | - |
| 3 | 30/30 (100%) | 30/30 (100%) | - |
| 4 | 30/30 (100%) | 30/30 (100%) | - |
| 5 | 30/30 (100%) | 30/30 (100%) | - |
| 6 | 30/30 (100%) | 30/30 (100%) | - |
| 7 | 30/30 (100%) | 30/30 (100%) | - |
| 8 | 30/30 (100%) | 30/30 (100%) | - |
| 9 | 30/30 (100%) | 30/30 (100%) | - |
| 10 | 30/30 (100%) | 30/30 (100%) | - |

Normal: **full clears 30/30** · Rookie: **full clears 30/30**

**Single-ability matrix** (T5, realistic tiers, 20 trials, offers dismissed; `none` = no ability):

| L | none | surge | freezer | drones | knighth | bishops | queenpu | aegis | decoy |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 90% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 6 | 40% | 100% | 90% | 100% | 100% | 100% | 100% | 100% | 100% |
| 7 | 50% | 100% | 100% | 100% | 90% | 100% | 100% | 100% | 100% |
| 8 | 5% | 100% | 95% | 100% | 95% | 95% | 100% | 100% | 100% |
| 9 | 5% | 100% | 30% | 100% | 25% | 75% | 100% | 100% | 100% |
| 10 | 0% | 100% | 0% | 100% | 5% | 100% | 100% | 80% | 65% |

Solver (forced capture within 6 Rookie moves, worst start file), L7-L10: 7     no6      W3     no6      W2; 8     no6      W4     no6      W3; 9     no6      W3     no6      W2; 10     no6     no6     no6     no6 (columns none/surge/freeze-ray/drones).

Caveats:

- L8-L10 arch + 2 enemies/turn: no-ability 5/5/0%, freeze-ray 95/30/0%, knight-hop 95/25/5% — the arch is the one geometry that punishes freeze-ray. Surge and drones stay 100%.
- L10 with the starter kit: 30/30 on both modes. Aegis 80% / decoy 65% on L10 are the only sub-90 support cells.

## revenge-4 — The Fortress

THE FORTRESS — walls shape every pen: a keyhole wall, a moat, 6- and 8-wall courts, a corner keep. Piece count still climbs 4 -> 14 but the room is the character of the level.

| L | level | pieces | walls | moves | enemies/turn |
|---|---|---|---|---|---|
| 1 | THE GATEHOUSE | 3 | 2 | - | 1 |
| 2 | THE WALLED SHELL | 7 | 3 | - | 1 |
| 3 | THE HALLWAY | 6 | 2 | - | 1 |
| 4 | THE PORTCULLIS | 5 | 5 | - | 1 |
| 5 | INNER WARD | 6 | 6 | 14 | 1 |
| 6 | THE COURTYARD | 5 | 6 | 11 | 1 |
| 7 | THE DONJON | 7 | 2 | 14 | 1 |
| 8 | CURTAIN WALL | 9 | 8 | 10 | 1 |
| 9 | THE INNER KEEP | 11 | 8 | 17 | 1 |
| 10 | THE FORTRESS | 11 | 8 | 14 | 1 |

**Starter-kit full runs** (pool = surge/freeze-ray/drones, every offer taken, T5, 30 runs, no retries):

| L | Normal reached/cleared | Rookie reached/cleared | losses (Normal) |
|---|---|---|---|
| 1 | 30/30 (100%) | 30/30 (100%) | - |
| 2 | 30/30 (100%) | 30/30 (100%) | - |
| 3 | 30/30 (100%) | 30/30 (100%) | - |
| 4 | 30/30 (100%) | 30/30 (100%) | - |
| 5 | 30/30 (100%) | 30/30 (100%) | - |
| 6 | 30/30 (100%) | 30/30 (100%) | - |
| 7 | 30/30 (100%) | 30/30 (100%) | - |
| 8 | 30/30 (100%) | 30/30 (100%) | - |
| 9 | 30/30 (100%) | 30/30 (100%) | - |
| 10 | 30/29 (97%) | 30/30 (100%) | {"move-limit":1} |

Normal: **full clears 29/30** · Rookie: **full clears 30/30**

**Single-ability matrix** (T5, realistic tiers, 20 trials, offers dismissed; `none` = no ability):

| L | none | surge | freezer | drones | knighth | bishops | queenpu | aegis | decoy |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 95% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 6 | 70% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 7 | 55% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 8 | 40% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 9 | 45% | 100% | 85% | 100% | 85% | 100% | 100% | 100% | 100% |
| 10 | 35% | 100% | 85% | 95% | 85% | 100% | 80% | 100% | 100% |

Solver (forced capture within 6 Rookie moves, worst start file), L7-L10: 7      W6      W3      W3      W2; 8     no6      W4      W4      W3; 9     no6      W6     no6      W6; 10     no6     no6     no6     no6 (columns none/surge/freeze-ray/drones).

Caveats:

- No-ability curve 95/70/55/40/45/35 on L5-L10 — the closest of the four to revenge-1's band. Every finisher >= 80% everywhere (queen-pulse 80% on L10 is the floor).
- L10 (17 walls + 5 hunters, 14 moves) reads as the hardest 'fair' level of the set for a human — the bot still clears it 29/30 with the starter kit.

## revenge-5 — Stonework

STONEWORK (built after the target changed) — every level is a building: gate, corridor, keyhole, moat, one open file, double gate, bastion (arch), maze (two wall lines with gaps on opposite sides), citadel. L5-L9 run two enemies per turn with tight budgets. L10 is THE VAULT, intentionally unwinnable (see below).

| L | level | pieces | walls | moves | enemies/turn |
|---|---|---|---|---|---|
| 1 | THE GATE | 2 | 2 | - | 1 |
| 2 | THE CORRIDOR | 3 | 8 | - | 1 |
| 3 | THE KEYHOLE | 4 | 4 | - | 1 |
| 4 | THE MOAT | 6 | 6 | - | 1 |
| 5 | THE ONE OPEN FILE | 8 | 9 | 11 | 2 |
| 6 | THE DOUBLE GATE | 10 | 3 | 11 | 2 |
| 7 | THE BASTION | 13 | 2 | 12 | 2 |
| 8 | THE MAZE | 7 | 17 | 11 | 2 |
| 9 | THE CITADEL | 10 | 10 | 12 | 2 |
| 10 |  | 7 | 9 | 12 | 1 |

**Starter-kit full runs** (pool = surge/freeze-ray/drones, every offer taken, T5, 30 runs, no retries):

| L | Normal reached/cleared | Rookie reached/cleared | losses (Normal) |
|---|---|---|---|
| 1 | 30/30 (100%) | 30/30 (100%) | - |
| 2 | 30/30 (100%) | 30/30 (100%) | - |
| 3 | 30/30 (100%) | 30/30 (100%) | - |
| 4 | 30/30 (100%) | 30/30 (100%) | - |
| 5 | 30/29 (97%) | 30/30 (100%) | {"move-limit":1} |
| 6 | 29/29 (100%) | 30/30 (100%) | - |
| 7 | 29/29 (100%) | 30/30 (100%) | - |
| 8 | 29/29 (100%) | 30/30 (100%) | - |
| 9 | 29/28 (97%) | 30/30 (100%) | {"move-limit":1} |
| 10 | 28/0 (0%) | 30/0 (0%) | {"stall":18,"move-limit":9,"captured":1} |

Normal: **full clears 0/30** · Rookie: **full clears 0/30**

**Single-ability matrix** (T5, realistic tiers, 20 trials, offers dismissed; `none` = no ability):

| L | none | surge | freezer | drones | knighth | bishops | queenpu | aegis | decoy |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 10% | 95%s1 | 55% | 90% | 100% | 55% | 70% | 100% | 100% |
| 6 | 50% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 7 | 5% | 100% | 25% | 100% | 45% | 90% | 100% | 100% | 95% |
| 8 | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| 9 | 10% | 95% | 35% | 85% | 35% | 30% | 75% | 90% | 75% |
| 10 | 0% | 0%s16 | 0% | 0% | 0% | 0% | 0% | 0% | 0% |

Solver (forced capture within 6 Rookie moves, worst start file), L7-L10: 7     no6      W5     no6     no6; 8      W6      W6      W5      W5; 9     no6     no6     no6     no6; 10     no6     no6     no6     no6 (columns none/surge/freeze-ray/drones).

Caveats:

- L10 THE VAULT is intentionally unwinnable: `revenge.ts lint` shows no line into d8, the solver says no6 for every loadout, the bot is 0% on all 19 loadouts (stall + move-limit), and the app fail-safe (`isUnwinnable`) fires as soon as <= 12 moves remain — with moveLimit 12 that is after Rookie's first move. CAVEAT: the fail-safe bails out (returns false) whenever the player holds freeze-ray, drones or any other unmodelled ability, so a starter-kit player is NOT told the level is dead until the move limit runs out. That is a solver limitation worth a follow-up.
- L5/L7/L9 are the only levels in the whole set that hurt the starters: freeze-ray 55/25/35%, drones 90/100/85%, surge 95/100/95%. Bishop-step 55% on L5 and 30% on L9, knight-hop 45%/35% on L7/L9 — the walls hurt transforms too.
- L8 THE MAZE is 100% for everything: the zigzag is long for a human but the bot just walks it; either add a hunter inside the rank-3/rank-5 corridor or drop the level.
- Starter-kit full runs: 28/30 reach L10 on Normal, 30/30 on Rookie (then 0 clears at the vault by design). Without L10 this run would clear ~93% / 100%.

## Reproduce

```
npx tsx scripts/run-playtest/revenge.ts runs   --run=revenge-N --runs=30 --tier=T5 --difficulty=normal --pool=surge,freeze-ray,drones
npx tsx scripts/run-playtest/revenge.ts runs   --run=revenge-N --runs=30 --tier=T5 --difficulty=rookie --pool=surge,freeze-ray,drones
npx tsx scripts/run-playtest/revenge.ts matrix --run=revenge-N --trials=20 --tier=T5 --realistic
npx tsx scripts/run-playtest/revenge.ts lint   --run=revenge-N
npx tsx scripts/run-playtest/revenge.ts solve  --run=revenge-N --levels=7,8,9,10 --depth=6 --nodes=100000
npx tsx scripts/run-playtest/revenge-generate.ts            # candidate levels -> data/run-playtest/revenge-candidates/<date>/
```
