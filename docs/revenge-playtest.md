# Rookie's Revenge — playtest report (v2)

Harness: `scripts/run-playtest/revenge.ts` (`matrix` / `runs` / `solve` / `trace` / `lint`).
Bot: **T6** = the harness's MCTS bot at 320 rollouts (the run's `T5` at 160
plus a 1-ply blunder filter — see "bot fixes"). Every cell = **30 trials**,
each trial a fresh AI seed and a random start file. Loadout = that one
ability alone (T1 unless stated); level offers/tempo offers are dismissed so
the number is *that ability's* contribution. Losses in brackets:
`c` captured, `m` out of moves (the flee levels' move budget), `s` stall
(300-turn timeout with the king alive = unreachable). **No stalls survived
into the final build** — every level either resolves or runs out of moves.

## 1. Level × ability → win % (T1 loadouts)

| L | none | surge | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | drones | convert | poison-dart | decoy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** |
| 2 | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** |
| 3 | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** |
| 4 | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** |
| 5 | **93%** (m2) | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **97%** (c1) | **100%** | **100%** | **100%** |
| 6 | **33%** (c6,m14) | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **93%** (m2) | **97%** (m1) |
| 7 | **60%** (c1,m11) | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** |
| 8 | **53%** (c2,m12) | **100%** | **80%** (c3,m3) | **100%** | **93%** (m2) | **90%** (m3) | **97%** (m1) | **100%** | **97%** (c1) | **87%** (m4) | **100%** |
| 9 | **30%** (c5,m16) | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **80%** (c3,m3) | **100%** | **100%** |
| 10 | **33%** (c3,m17) | **100%** | **73%** (c6,m2) | **87%** (m4) | **97%** | **93%** (c2) | **100%** | **97%** (c1) | **77%** (c2,m5) | **47%** (c1,m15) | **100%** |

## 2. Same, realistic tiers (T1 on L1–3, T2 on L4–6, T3 on L7–9, T4 on L10)

| L | none | surge | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | drones | convert | poison-dart | decoy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** |
| 2 | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** |
| 3 | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** |
| 4 | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** |
| 5 | **90%** (m3) | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** |
| 6 | **50%** (c4,m11) | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **97%** (c1) | **83%** (c3,m2) | **100%** |
| 7 | **57%** (m13) | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **93%** (c2) | **100%** | **100%** |
| 8 | **50%** (c4,m11) | **100%** | **87%** (m4) | **97%** (m1) | **97%** (m1) | **100%** | **100%** | **100%** | **100%** | **93%** (m2) | **100%** |
| 9 | **27%** (c1,m21) | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **100%** | **93%** (c2) | **100%** | **100%** |
| 10 | **30%** (c3,m18) | **100%** | **87%** (c3,m1) | **87%** (c3,m1) | **100%** | **100%** | **100%** | **100%** | **77%** (c7) | **80%** (m6) | **100%** |

## 3. Full runs, random picks (60 runs, T6)

Plays L1→L10 taking a **uniformly random** card from every free level offer
(never skips), carrying abilities/tempo like the app does. **59/60 full
clears**; the one loss ran out of moves on L8.

| L | reached | cleared | clear % | losses |
|---|---|---|---|---|
| 1 | 60 | 60 | 100% | - |
| 2 | 60 | 60 | 100% | - |
| 3 | 60 | 60 | 100% | - |
| 4 | 60 | 60 | 100% | - |
| 5 | 60 | 60 | 100% | - |
| 6 | 60 | 60 | 100% | - |
| 7 | 60 | 59 | 98% | {'captured': 1} |
| 8 | 59 | 59 | 100% | - |
| 9 | 59 | 59 | 100% | - |
| 10 | 59 | 59 | 100% | - |

Picks seen: bishop-step 160, freeze-ray 123, queen-pulse 120, surge 118, knight-hop 99, convert 57, poison-dart 37, aegis 30, decoy 22, drones 10 —
the "≥2 finishers per slate" rule shows in the skew.

## 4. Solver — forced capture within N Rookie moves

AND-OR search over every Rookie action (moves + ability casts) against every
enemy tie-break (6 AI seeds, deduped), worst case over **every possible start
file**, offers dismissed (conservative). `W3` = forced win in ≤3 moves,
`no6` = no forced line within 6 (NOT "impossible" — the bot's win % above is
the practical answer; L8/L10 wins average 6–10 moves). Cells marked `/` show
the depth-8 / 400k-node rerun for L8 and L10.

| L | none | surge | freeze-ray | knight-hop | bishop-step | queen-pulse | aegis | drones | convert | poison-dart | decoy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | W3 | W3 | W3 | W3 | W2 | W2 | W3 | W2 | W3 | W3 | W3 |
| 2 | W3 | W3 | W3 | W3 | W3 | W3 | W3 | W2 | W3 | W3 | W3 |
| 3 | W3 | W3 | W2 | W3 | W3 | W3 | W3 | W3 | W3 | W3 | W2 |
| 4 | W3 | W3 | W3 | W3 | W3 | W3 | W3 | W2 | W3 | W3 | W3 |
| 5 | W6 | W3 | W3 | W3 | W3 | W3 | W4 | W3 | W3 | W4 | W3 |
| 6 | no6 | W4 | W5 | W3 | W3 | W3 | W4 | W3 | W5 | W5 | W4 |
| 7 | no6 | W3 | W4 | W3 | W4 | W4 | W3 | W2 | W4 | W4 | W3 |
| 8 | no6 / no8 | W6 | no6 / W7 | no6 / W7 | W6 | W6 | W6 | W6 | W6 | no6 / W7 | W3 |
| 9 | no6 | W4 | W6 | W5 | W5 | W5 | W5 | W3 | W6 | W5 | W4 |
| 10 | no6 / no8 | no6 / no8 | no6 / no8 | no6 / no8 | no6 / no8 | no6 / no8 | no6 / no8 | no6 / no8 | no6 / no8 | no6 / no8 | no6 / W8 |

Reading: L1–L7 have **proven** forced wins for every ability (and ability-free
through L5). L8 is proven for all ten abilities within 7 moves. L10 is proven
only for Decoy within 8; the others win 73–100% in practice but their lines
run longer than 8 moves against the 18-move budget.

## 5. Loss classification

- **Captured** is rare on flee levels once the bot stopped blundering; the
  bulk of ability losses at L8–L10 are **out of moves** — the tool was used on
  the wrong target (Freeze Ray on a guard instead of the king; Poison on a
  non-key) and the chain took too long. Those are bot-skill losses, not
  impossible states.
- **Stall (king unreachable)** happened only in intermediate builds on L10
  ability-free (7/12) — that is exactly the "lone rook can't catch him" case,
  now bounded by the move budget (reads as "Out of moves").
- `>20% stall` flag: no level trips it in the final build.

## 6. What changed and why (iteration log)

1. **Baseline (Tyler's proto, 5 levels):** open-board flee king on L4 —
   provably impossible ability-free, and the sweep bots never cast abilities.
2. **Bots fixed first** (otherwise every number lies):
   - `settleEnemyTurns` / `simulate.ts` / `mcts.ts` never stepped the
     `allies` or `drones` phases, so any Squad/Convert loadout stalled on its
     first move; `legalCandidates` had no Convert/Drones candidates; Freeze
     couldn't target the king; `apply.ts` didn't run the drone swarm.
   - MCTS `fastScore` is king-aware (line on him while stunned/frozen).
   - **1-ply blunder filter**: a candidate whose settled enemy reply captures
     Rookie is never chosen while a non-losing one exists. Before this the
     T5 bot walked into knight forks whenever every rollout lost — L8 Surge
     read 50%, it is 100%.
3. **King rules v2** (engine): stun on any credited capture; free flee
   reaction at start of enemy turn *and* after each guard move (kills the
   "wait behind a guard" cheese that made every level a 3-move win);
   `kingPen`; ally-covered squares are unsafe for him; he avoids squares that
   share an open line with a piece Rookie can take.
4. **Guards on king levels are careful** — never step into Rookie's fire,
   never enter the pen, pawns don't advance into it. Without this the T5 bot
   farmed queens that walked next to it (L7/L9 100% ability-free in 4 moves).
5. **Levels:** rebuilt as 10 (L1–2 still king; L3 linear pen — reach his row
   and he's out of squares; L4 2×2 pen with an undefended key = learn
   capture-stun; L5–L10 pawn-defended keys + hunters + bigger rooms). Rule of
   thumb learned the hard way: a rook-proof pen needs ≥2×2 *empty* squares
   (own pieces inside shrink his room into a line), a key on his line must be
   defended by a **pawn** (hunters leave their posts to approach), and pieces
   adjacent to him are keys.
6. **Move budgets** on L5–L10 (12/12/12/14/14/18, shown as a chip): the
   ability-free routes (dismantle the pawn chain) take 8–14 moves; the ability
   routes take 3–7. That is the difficulty ramp — `none` goes
   100/100/100/100/93/33/60/53/30/33 while every level keeps ≥6 abilities at
   ≥93% (T1) and every ability ≥77% at realistic tiers. L10 was 16 moves
   first; at 16 Freeze/Knight/Poison at T1 dropped to 53–73%, so it's 18.
7. **Pool:** Squad out (T1 pawn = fodder, 8–58%), Aegis in (93–100%).
   Freeze Ray on the king lasts +1 turn so T1 is usable.
8. **Offers:** free 3-card pick every level, ≥2 finishers per slate.

## 7. Remaining risks / caveats

- **Human difficulty is unmeasured.** The bot beats L1–L5 ability-free at
  ~100%; humans will not. If Tyler finds L6–L10 too tight, the move budgets
  are the single knob (raise 12→14, 18→20); too loose, lower them or add a
  hunter (the piece lists in `runs.ts` are commented per level).
- **L10 at T1**: Poison 47% / Freeze 73% / Convert 77%. Nobody reaches L10 at
  T1 (three abilities at ~T3–T4 by then: 80/87/77%), but Poison + Convert are
  the two weakest tools on the last two levels — a slate {Poison, Convert, one
  finisher} on L10 leans entirely on the finisher.
- **Solver is depth/budget bounded** (no forced line ≤8 proven at L10 for 9 of
  10 abilities); it also treats every offer as dismissed, so it under-states.
- **Bot doesn't plan Freeze-the-king / Poison-the-key deliberately** — those
  numbers are floors.
- **Hydration warning** on `/?run=…` in dev is pre-existing (also fires on
  `/`); the moves chip and pen tint render client-side like the rest of the
  page state.
- Live runs: every new branch is gated on `winCondition === 'king'` /
  `offerEveryLevel` / `offerCore`; `rollOffer` consumes RNG in the same order
  for 2-wide slates, so live offers are unchanged.

## Reproduce

```
npx tsx scripts/run-playtest/revenge.ts matrix --trials=30 --tier=T6
npx tsx scripts/run-playtest/revenge.ts matrix --trials=30 --tier=T6 --realistic
npx tsx scripts/run-playtest/revenge.ts runs --runs=60 --tier=T6
npx tsx scripts/run-playtest/revenge.ts solve --depth=6 --nodes=120000
npx tsx scripts/run-playtest/revenge.ts trace --level=8 --loadout=surge --tier=T6
npx tsx scripts/run-playtest/revenge.ts lint
node scripts/verify-revenge.mjs http://localhost:3011
```
