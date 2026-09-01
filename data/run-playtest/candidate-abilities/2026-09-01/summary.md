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
a bot trace ending in a king capture by the summon itself). Matrix win-rate
measurement was cut short by the cloud handoff — numbers below marked
(predicted) are design estimates against the revenge-1 realistic baseline
(none = 100/100/100/100/90/50/57/50/27/30; Squire T1 worst cell 75% L10).

## The ten

1. twin — "Twin". A second controllable ROOK beside you. Gap: the rook-pair
   endgame machine; ladder-mates the pen. T1 4 turns / T2 6 / T3 8 /
   T4 rest of level, 2 charges / T5 all level + FREE move (move her AND you).
   1/1/2/2/2 charges per RUN. Predicted: +45-55 pts on L8/L10; likely the
   strongest card in the family.
2. duchess — "Duchess". A controllable QUEEN on a timer. Gap: a rental
   finisher — total power, tiny window. T1 2 enemy turns / T2 3 / T3 4 /
   T4 4 + 2 charges / T5 6. 1/1/1/2/2 per RUN. Predicted +45-50 worst-cell.
3. vanguard — "Vanguard". A controllable KNIGHT dropped ANYWHERE in range
   (not beside you). Gap: skips the 6-move walk that starves Squire on big
   boards. Range 3 / 5 / anywhere / anywhere / anywhere; turns 4/6/8/8/level;
   1/1/2/2/2 per RUN. Predicted +35-45.
4. bishop-squire — "Bishop Squire". Squire but a bishop: long diagonals
   complement her rook lines. 6/9/9/level/level turns; T5 free move;
   1/1/2/2/2 per RUN. Predicted +30-40 (Squire-parity, better on open maps).
5. sacrifice — "Sacrifice". Detonate one of your summons: every enemy on its
   attack squares (T3+: plus every square beside it) is captured; never the
   king, but he is stunned 2 turns (T5: 3). Gap: the sacrifice payoff — a
   spent summon becomes a pen-opener. Per LEVEL 1/1/2/2/2. Predicted +20-30
   paired with any summon.
6. page — "Page". A controllable PAWN, permanent until captured; reaching
   rank 8 promotes him to your controllable QUEEN. T2+: 2-square step;
   T3+: promotes on rank 7; T5: ANY capture promotes on the spot. 1/1/2/2/2
   per RUN. Predicted +15-35 (slow burn; best on 14-18-move budgets).
7. swap — "Swap". Trade squares with one of your summons, as a FREE action.
   Gap: repositioning/escape — the Squire idea upgraded into mobility. T4+:
   works with ANY rainbow ally. Per LEVEL 1/1/2/2/3. Predicted +10-25 paired
   (bot underuses it; treat measurements as a floor).
8. knighting — "Knighting". Promote one of your summons a step up the ladder
   pawn-knight-bishop-rook-queen (T2 also +3 turns on its clock, T3 two
   steps, T4 any rainbow ally + 2 uses, T5 straight to queen). Gap: turns a
   cheap body into a finisher mid-level. Per LEVEL 1/1/1/2/2. Predicted
   +10-25 paired (Page + Knighting is the dream curve).
9. banner — "War Banner" (DESIGN ONLY). While active, each of your summons
   moves as a free action once per turn — gives every summon the T5-Squire
   feel. Needs turn-loop work (per-ally movedThisTurn is already in place).
   Predicted +15-25 paired. Stage: idea.
10. phalanx — "Phalanx" (DESIGN ONLY). Summon 2-3 controllable pawns as a
    wall. The generic engine supports multiple controlled allies already;
    unclear it is FUN (one body still moves per turn). Predicted +5-15.
    Stage: idea.

## Ranking (best expected win-rate delta first)

twin > duchess > vanguard > bishop-squire > sacrifice > page > swap >
knighting > banner > phalanx

Support cards (swap/sacrifice/knighting) measure as `none` in a solo-loadout
matrix — they have no summon to operate on. Measure them paired:

```
npx tsx scripts/run-playtest/revenge.ts matrix --run=revenge-1 --levels=5,8,10 \
  --realistic --trials=24 --loadouts=none,twin,duchess,vanguard,bishop-squire,page
npx tsx scripts/run-playtest/revenge.ts runs --runs=40 --pool=summon-knight,swap
npx tsx scripts/run-playtest/revenge.ts runs --runs=40 --pool=summon-knight,sacrifice
npx tsx scripts/run-playtest/revenge.ts runs --runs=40 --pool=summon-knight,knighting
```

The nightly grades everything in `testing` automatically (ALL_LOADOUTS =
catalog filtered by isBuilt). NONE of these are approved — Tyler approves via
`npx tsx scripts/pipeline.ts approve <id>`.
