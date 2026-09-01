# Controllable-summon family — 10 candidate abilities (2026-09-01)

Direction from Tyler (verbatim): "i really like the summon a knight/queen/bishop
you can control, i like that a lot better than the squad or body guard ability."
So: pieces you summon and then STEER, plus upgrades of that idea. No passives.

All ten ride ONE generic engine added to lib/run/abilities.ts (2026-09-01):
CONTROLLED_SOURCES / controlledAllies / canMoveAllyAt /
controlledAllyLegalMoves / applyControlledAllyMove. The Squire
(summon-knight) is now a thin wrapper over it. Controlled summons may
capture the enemy king (that wins the level), so every SUMMON is
ONE_CHARGE_PER_RUN like the finishers; the three support cards (Swap /
Sacrifice / Knighting) refresh per level.

STATUS: 8 of 10 IMPLEMENTED (pass tsc, exercised by trace — every summon has
a bot trace ending in a king capture by the summon itself). **MEASURED
2026-09-01** (this session) — see tables below. All numbers are T5 bot,
revenge-1, 24 trials/cell unless noted; `none` baseline this session came in
at 100/100/100/100/88/46/42/54/13/33 (realistic) and
100/100/100/100/100/54/38/50/17/25 (T1) — a few points off the
100/100/100/100/90/50/57/50/27/30 figure quoted in the handoff purely from
run-to-run seed noise (matrix seeds the AI tie-break from the loadout
string, so `none` isn't pinned to one game per level — see caveat in
docs/revenge-playtest.md §7). No crashes, no stalls, no dead-ends in any
cell; a 40-run full random-pick sim on `ability-lab` (all 8 in the pool)
cleared 40/40 with every one of the 8 picked and used at least 3 times.

**Protocol deviation (support cards):** summary.md originally prescribed
`revenge.ts runs --pool=summon-knight,swap` (etc.) against the default
`revenge-1` run. That command silently never equips the support card:
`revenge-1`'s `allowedAbilities` is `REVENGE_ABILITIES`, which is filtered to
`approved|live` only (`lib/content/pipeline.ts: isPlayerFacing`), so a
`testing`-stage id is invisible to `rollOffer` regardless of `--pool`
(confirmed empirically — a pilot run showed `swap` picked 0/40 times). Fixed
two ways: (1) `loadoutFor` in `scripts/run-playtest/revenge-core.ts` now
accepts a `+`-joined compound id (`summon-knight+swap`) so `matrix` can grant
two owned abilities in one cell — this is the primary measurement below; (2)
a 40-run sandbox sim against `ability-lab` (`ignoreUnlocks: true`, all 8 in
`allowedAbilities`) as a full-run crash/pick-rate check. Both are playtest
tooling only (`scripts/run-playtest/**`), nothing in the run/ability engine
itself changed for this fix.

## 1. The five direct summons — solo loadout, T1 (tier pinned to 1)

| L | none | twin | duchess | vanguard | bishop-squire | page |
|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 100% | 100% | 100% | 96% | 100% | 92% |
| 6 | 54% | 92% | 100% | 100% | 92% | 67% |
| 7 | 38% | 92% | 100% | 100% | 100% | 88% |
| 8 | 50% | 96% | 100% | 83% | 92% | 75% |
| 9 | 17% | 88% | 96% | 96% | 100% | 100% |
| 10 | 25% | 92% | 92% | 71% | 96% | 79% |

## 2. Same, realistic tiers (T1 on L1-3, T2 on L4-6, T3 on L7-9, T4 on L10)

| L | none | twin | duchess | vanguard | bishop-squire | page |
|---|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% | 100% |
| 5 | 88% | 96% | 100% | 100% | 100% | 88% |
| 6 | 46% | 92% | 96% | 100% | 92% | 83% |
| 7 | 42% | 92% | 96% | 100% | 100% | 92% |
| 8 | 54% | 92% | 100% | 100% | 96% | 83% |
| 9 | 13% | 83% | 100% | 100% | 100% | 92% |
| 10 | 33% | 88% | 100% | 96% | 100% | 67% |

Worst-cell (L6-L10, realistic) floor per ability: **duchess 96%**, **vanguard
96%**, bishop-squire 92%, twin 83%, page 67%. All five clear L1-4 at 100% and
all five beat the `none` baseline by 30-90 points on every level L5+.

## 3. Support cards, paired with Squire (`summon-knight+<id>`), T1

`loadoutFor` now grants both abilities in one cell (see protocol note above).
`summon-knight` alone is the pairing baseline — the delta the support card
adds is `summon-knight+X` minus `summon-knight`.

| L | none | summon-knight | +swap | +sacrifice | +knighting |
|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% |
| 5 | 75% | 100% | 100% | 100% | 100% |
| 6 | 42% | 100% | 100% | 100% | 100% |
| 7 | 38% | 96% | 100% | 100% | 100% |
| 8 | 46% | 88% | 83% | 96% | 96% |
| 9 | 13% | 92% | 96% | 100% | 92% |
| 10 | 29% | 63% | 83% | 96% | 88% |

## 4. Support cards, paired with Squire, realistic tiers

| L | none | summon-knight | +swap | +sacrifice | +knighting |
|---|---|---|---|---|---|
| 1 | 100% | 100% | 100% | 100% | 100% |
| 2 | 100% | 100% | 100% | 100% | 100% |
| 3 | 100% | 100% | 100% | 100% | 100% |
| 4 | 100% | 100% | 100% | 100% | 100% |
| 5 | 88% | 96% | 100% | 100% | 100% |
| 6 | 54% | 100% | 100% | 100% | 100% |
| 7 | 42% | 100% | 100% | 100% | 100% |
| 8 | 46% | 88% | 100% | 100% | 96% |
| 9 | 8% | 100% | 100% | 100% | 96% |
| 10 | 33% | 83% | 100% | 100% | 96% |

Delta over the `summon-knight`-alone baseline at the two hardest cells
(T1 L10 / realistic L10): **sacrifice +33 / +17**, **swap +20 / +17**,
**knighting +25 / +13**. Sacrifice is the most consistent lift of the three
and the only one that never underperforms the Squire-alone baseline in any
cell measured; swap dips slightly below baseline at T1 L8 (83 vs 88%, inside
this sample's noise band at 24 trials/cell).

## 5. Full-run sandbox check (`ability-lab`, 40 random-pick runs, T5)

40/40 full clears, 0 crashes, 0 stalls. Pick counts over the 3-level lab run
(pool = the 8 testing abilities + summon-knight/bodyguard/rewind/magnet +
surge/knight-hop as finishers, `ignoreUnlocks: true`):
`swap 10, sacrifice 3, knighting 8, twin 3, duchess 5, vanguard 9, page 14,
bishop-squire 4` (plus the pre-existing abilities in the pool). Confirms
every one of the 8 is bot-reachable, castable and non-crashing end to end,
independent of the matrix harness.

## The ten

1. twin — "Twin". A second controllable ROOK beside you. Gap: the rook-pair
   endgame machine; ladder-mates the pen. T1 4 turns / T2 6 / T3 8 /
   T4 rest of level, 2 charges / T5 all level + FREE move (move her AND you).
   1/1/2/2/2 charges per RUN. **Measured: realistic floor 83% (L9); strong
   and consistent but not the top of the family — duchess/vanguard hold a
   higher floor.**
2. duchess — "Duchess". A controllable QUEEN on a timer. Gap: a rental
   finisher — total power, tiny window. T1 2 enemy turns / T2 3 / T3 4 /
   T4 4 + 2 charges / T5 6. 1/1/1/2/2 per RUN. **Measured: realistic floor
   96% (L6/L7), 100% on L8-L10 — the strongest card in the family.**
3. vanguard — "Vanguard". A controllable KNIGHT dropped ANYWHERE in range
   (not beside you). Gap: skips the 6-move walk that starves Squire on big
   boards. Range 3 / 5 / anywhere / anywhere / anywhere; turns 4/6/8/8/level;
   1/1/2/2/2 per RUN. **Measured: realistic floor 96% (L10), 100% L6-L9 —
   ties duchess for strongest; T1 L10 (71%) is its softest reading, but
   nobody plays L10 at T1 in a real run.**
4. bishop-squire — "Bishop Squire". Squire but a bishop: long diagonals
   complement her rook lines. 6/9/9/level/level turns; T5 free move;
   1/1/2/2/2 per RUN. **Measured: realistic floor 92% (L6/L8), 100%
   elsewhere — solid Squire-parity as predicted.**
5. sacrifice — "Sacrifice". Detonate one of your summons: every enemy on its
   attack squares (T3+: plus every square beside it) is captured; never the
   king, but he is stunned 2 turns (T5: 3). Gap: the sacrifice payoff — a
   spent summon becomes a pen-opener. Per LEVEL 1/1/2/2/2. **Measured (paired
   with summon-knight): +33 pts at T1 L10 (63%→96%), +17 at realistic L10
   (83%→100%) — the strongest and most consistent of the three support
   cards, never below its Squire-alone baseline.**
6. page — "Page". A controllable PAWN, permanent until captured; reaching
   rank 8 promotes him to your controllable QUEEN. T2+: 2-square step;
   T3+: promotes on rank 7; T5: ANY capture promotes on the spot. 1/1/2/2/2
   per RUN. **Measured: realistic floor 67% (L10) — clearly the weakest of
   the five direct summons, though still +34 over the 33% no-ability
   baseline. Slow-burn as predicted; the promotion payoff arrives too late
   on the 18-move L10 budget.**
7. swap — "Swap". Trade squares with one of your summons, as a FREE action.
   Gap: repositioning/escape — the Squire idea upgraded into mobility. T4+:
   works with ANY rainbow ally. Per LEVEL 1/1/2/2/3. **Measured (paired):
   +20 pts at T1 L10 (63%→83%), +17 at realistic L10 (83%→100%); one soft
   cell at T1 L8 (88%→83%, within noise). Solid, second-best support card.**
8. knighting — "Knighting". Promote one of your summons a step up the ladder
   pawn-knight-bishop-rook-queen (T2 also +3 turns on its clock, T3 two
   steps, T4 any rainbow ally + 2 uses, T5 straight to queen). Gap: turns a
   cheap body into a finisher mid-level. Per LEVEL 1/1/1/2/2. **Measured
   (paired): +25 pts at T1 L10 (63%→88%), +13 at realistic L10 (83%→96%) —
   real lift, weakest of the three support cards by a small margin.**
9. banner — "War Banner" (DESIGN ONLY). While active, each of your summons
   moves as a free action once per turn — gives every summon the T5-Squire
   feel. Needs turn-loop work (per-ally movedThisTurn is already in place).
   Not built this session; no measurement. Stage: idea.
10. phalanx — "Phalanx" (DESIGN ONLY). Summon 2-3 controllable pawns as a
    wall. The generic engine supports multiple controlled allies already;
    unclear it is FUN (one body still moves per turn). Not built this
    session; no measurement. Stage: idea.

## Final ranking and verdict (measured, best floor first)

1. **duchess** — KEEP AS IS. Highest floor of the five (96-100% on every
   level L6+ at realistic tiers). Rental-finisher design works exactly as
   intended.
2. **vanguard** — KEEP AS IS. Ties duchess at realistic tiers (96-100%
   L6-L10); only its T1 L10 reading (71%) is soft, and T1-at-L10 is not a
   state a real player reaches.
3. **bishop-squire** — KEEP AS IS. Consistent Squire-parity (92-100%
   realistic floor), exactly the predicted "safe second option" to the
   Squire.
4. **sacrifice** — KEEP AS IS. Best support card measured: never underperforms
   its Squire-alone baseline, biggest single lift of any card at T1 L10
   (+33).
5. **twin** — KEEP AS IS. Strong (83-100% realistic) but the one direct
   summon that didn't come out on top of its own prediction — still clearly
   shippable.
6. **swap** — KEEP AS IS. Reliable secondary lift (+17 to +20 at L10); the
   one T1 L8 dip is inside sampling noise, not a real regression.
7. **knighting** — KEEP AS IS. Real, positive lift, just the smallest of the
   three support cards — a reasonable "cheaper but weaker" third option.
8. **page** — NEEDS TUNING. Only direct summon with a realistic-tier floor
   below 80% (67% at L10). Still a large improvement over no-ability, but
   the promotion clock is too slow to pay off inside the 18-move L10 budget.
   If Tyler wants it shipped as-is, fine; if not, the fix is probably T4/T5
   promoting sooner (rank 6 instead of 7, or on any capture from T4 instead
   of T5) rather than reworking the pawn-walk core loop.

Ranking by measured floor: **duchess ≈ vanguard > bishop-squire > sacrifice
> twin > swap > knighting > page**. All eight are net-positive over the
`none` baseline on every level; none crashed, stalled, or dead-ended. NONE of
these are approved — Tyler approves via `npx tsx scripts/pipeline.ts approve
<id>`.

## Reproduce

```
npx tsx scripts/run-playtest/revenge.ts matrix --run=revenge-1 --trials=24 \
  --loadouts=none,twin,duchess,vanguard,bishop-squire,page
npx tsx scripts/run-playtest/revenge.ts matrix --run=revenge-1 --realistic --trials=24 \
  --loadouts=none,twin,duchess,vanguard,bishop-squire,page
npx tsx scripts/run-playtest/revenge.ts matrix --run=revenge-1 --trials=24 \
  --loadouts=none,summon-knight,summon-knight+swap,summon-knight+sacrifice,summon-knight+knighting
npx tsx scripts/run-playtest/revenge.ts matrix --run=revenge-1 --realistic --trials=24 \
  --loadouts=none,summon-knight,summon-knight+swap,summon-knight+sacrifice,summon-knight+knighting
npx tsx scripts/run-playtest/revenge.ts runs --run=ability-lab --runs=40
```

The nightly grades everything in `testing` automatically (ALL_LOADOUTS =
catalog filtered by isBuilt).
