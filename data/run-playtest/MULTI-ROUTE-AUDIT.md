# Multi-route audit — do combo runs have more than one answer?

Generated 2026-09-07. Source of numbers: `data/run-playtest/multi-route-audit-2026-09-07.json`.

**The question (Tyler):** every combo run was authored so exactly ONE ability pair beats its
finale and every single card fails. Nobody had ever measured whether OTHER pairs also work.
If they do, the library is richer than it looks and an Endless mode with a random kit is
playable. If they do not, most of the library is a one-answer lock.

## Method

- Harness: `matrixParallel` from `scripts/run-playtest/revenge-core`, tier **T5**, `realistic: false`, jobs 4 — the same deterministic path as `_remeasure-finales.ts`.
- Levels **7-10** (the combo-gated finale) for every loadout.
- Loadouts per run: `none`; each of the 4 kit cards alone; all 6 pairs from inside the kit; 20 pairs from OUTSIDE the kit (each signature card x 5 fixed probe cards, plus all 10 pairs among those probes). The probe cards are chosen from a single fixed priority list, so the same cards recur across runs — that is what makes "which cards generalise" answerable.
- **Screen at 16 trials, confirm at 32.** Pairs are screened on L7; a pair that wins 0/16 on L7 cannot be a finale route (a true 60% pair reads 0/16 with p ~ 1e-7) and is recorded as eliminated rather than run on L8-L10. `none` and the 4 singles are measured on all four levels. Anything reading above 40% (and any nonzero single, since the gate bar is 8%) is re-measured at **32 trials**, and only 32-trial numbers carry a verdict.
- A `—` in a table means that cell was never run because the pair was eliminated at L7. It is not a measured 0.

## Definitions

- **clears** = the pair's WORST finale level is >= 60% (it beats all of L7-L10).
- **route** = clears with a worst level in the **60-80%** band (the authored difficulty target).
- **too-easy route** = clears with a worst level **above 80%**.
- **broken gate** = some SINGLE kit card wins above **8%** on any finale level.

## Summary table

| run | signature pair | sig worst | routes in 60-80 band | too-easy (>80) | pairs that clear | single card >8% | verdict |
|---|---|---|---|---|---|---|---|
| revenge-12 | `bishop-squire+swap` | 75% | 1 | 0 | 1 | **bishop-squire, knight-hop** | **BROKEN GATE** |
| revenge-13 | `bishop-squire+swap` | 69% | 3 | 1 | 4 | **bishop-squire** | **BROKEN GATE** |
| revenge-14 | `swap+vanguard` | 84% | 0 | 7 | 7 | none | **ONE-ANSWER*** |
| revenge-15 | `boulder+magnet` | 59% | 1 | 2 | 3 | none | **ONE-ANSWER*** |
| revenge-16 | `bishop-squire+poison-dart` | 53% | 0 | 0 | 0 | none | **NO ANSWER (not even the signature pair clears)** |
| revenge-17 | `dragon+sacrifice` | 69% | 2 | 0 | 2 | none | **MULTI-ROUTE** |
| revenge-18 | `freeze-ray+vanguard` | 66% | 1 | 1 | 2 | none | **ONE-ANSWER*** |
| revenge-19 | `convert+summon-knight` | 66% | 2 | 0 | 2 | none | **MULTI-ROUTE** |
| revenge-21 | `boulder+knight-hop` | 66% | 7 | 8 | 15 | none | **MULTI-ROUTE** |
| revenge-22 | `dragon+duchess` | 72% | 2 | 0 | 2 | none | **MULTI-ROUTE** |
| revenge-23 | `knight-hop+twin` | 63% | 1 | 0 | 1 | none | **ONE-ANSWER** |
| revenge-24 | `decoy+duchess` | 63% | 1 | 0 | 1 | none | **ONE-ANSWER** |

## Verdict lists

**MULTI-ROUTE (2+ pairs land in the 60-80 band):** revenge-17, revenge-19, revenge-21, revenge-22

**ONE-ANSWER (only the signature pair clears):** revenge-23, revenge-24, revenge-14, revenge-15, revenge-18

**BROKEN GATE (a single card beats the finale):** revenge-12, revenge-13

**NO ANSWER (the authored pair itself does not clear):** revenge-16

## Which cards generalise

How often each card appears in a pair that CLEARS a finale it was not designed for.
`out-of-kit clears` is the strong signal: the run was never built with that card in mind.

| card | clearing pairs OUTSIDE its kit | clearing pairs inside a kit | runs |
|---|---|---|---|
| `knight-hop` | 13 | 2 | revenge-13, revenge-14, revenge-15, revenge-21, revenge-21(kit), revenge-23(kit) |
| `become-king` | 8 | 0 | revenge-15, revenge-19, revenge-21 |
| `summon-knight` | 7 | 1 | revenge-13, revenge-14, revenge-19, revenge-19(kit), revenge-21 |
| `twin` | 7 | 1 | revenge-13, revenge-21, revenge-23(kit) |
| `swap` | 6 | 3 | revenge-12(kit), revenge-13, revenge-13(kit), revenge-14, revenge-14(kit), revenge-18, revenge-21 |
| `freeze-ray` | 5 | 1 | revenge-14, revenge-18(kit), revenge-21, revenge-22 |
| `boulder` | 3 | 2 | revenge-14, revenge-15(kit), revenge-21, revenge-21(kit) |
| `magnet` | 3 | 0 | revenge-14, revenge-15 |
| `vanguard` | 2 | 2 | revenge-14, revenge-14(kit), revenge-18, revenge-18(kit) |
| `dragon` | 1 | 3 | revenge-17(kit), revenge-22, revenge-22(kit) |
| `bishop-squire` | 1 | 2 | revenge-12(kit), revenge-13, revenge-13(kit) |
| `decoy` | 0 | 2 | revenge-15(kit), revenge-24(kit) |
| `duchess` | 0 | 2 | revenge-22(kit), revenge-24(kit) |
| `sacrifice` | 0 | 1 | revenge-17(kit) |
| `aegis` | 0 | 1 | revenge-17(kit) |
| `convert` | 0 | 1 | revenge-19(kit) |

## Per-run detail

### revenge-12 — BROKEN GATE

kit: `swap` `bishop-squire` `knight-hop` `poison-dart` · signature: `bishop-squire+swap` · probes: `boulder` `summon-knight` `freeze-ray` `magnet` `become-king`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 32 |
| `swap` | single | 0 | 0 | 0 | 0 | 0% | 32 |
| `bishop-squire` | single | 0 | 0 | 47 | 0 | 0% | 32 |
| `knight-hop` | single | 0 | 9 | 0 | 38 | 0% | 32 |
| `poison-dart` | single | 0 | 0 | 0 | 0 | 0% | 32 |
| `bishop-squire+swap` | in-kit pair | 75 | 81 | 100 | 100 | 75% | 32 |
| `knight-hop+swap` | in-kit pair | 0 | — | — | — | elim | 16 |
| `poison-dart+swap` | in-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+knight-hop` | in-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+poison-dart` | in-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+poison-dart` | in-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+boulder` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+magnet` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+bishop-squire` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `summon-knight+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+magnet` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+boulder` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+magnet` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+magnet` | out-of-kit pair | 0 | — | — | — | elim | 16 |

### revenge-13 — BROKEN GATE

kit: `swap` `bishop-squire` `magnet` `boulder` · signature: `bishop-squire+swap` · probes: `knight-hop` `summon-knight` `freeze-ray` `become-king` `twin`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 16 |
| `swap` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `bishop-squire` | single | 25 | 0 | 0 | 0 | 0% | 32 |
| `magnet` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `boulder` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `bishop-squire+swap` | in-kit pair | 100 | 100 | 97 | 69 | 69% | 32 |
| `magnet+swap` | in-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+swap` | in-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+magnet` | in-kit pair | 38 | 0 | 6 | 0 | 0% | 16 |
| `bishop-squire+boulder` | in-kit pair | 13 | 0 | 0 | 0 | 0% | 16 |
| `boulder+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+knight-hop` | out-of-kit pair | 100 | 100 | 91 | 75 | 75% | 32 |
| `bishop-squire+summon-knight` | out-of-kit pair | 72 | 28 | 0 | 94 | 0% | 32 |
| `bishop-squire+freeze-ray` | out-of-kit pair | 19 | 0 | 0 | 88 | 0% | 32 |
| `become-king+bishop-squire` | out-of-kit pair | 100 | 84 | 41 | 88 | 41% | 32 |
| `bishop-squire+twin` | out-of-kit pair | 97 | 56 | 0 | 91 | 0% | 32 |
| `knight-hop+swap` | out-of-kit pair | 100 | 97 | 53 | 0 | 0% | 32 |
| `summon-knight+swap` | out-of-kit pair | 97 | 97 | 94 | 94 | 94% | 32 |
| `freeze-ray+swap` | out-of-kit pair | 6 | 0 | 0 | 0 | 0% | 16 |
| `become-king+swap` | out-of-kit pair | 100 | 53 | 25 | 0 | 0% | 32 |
| `swap+twin` | out-of-kit pair | 100 | 41 | 0 | 0 | 0% | 32 |
| `knight-hop+summon-knight` | out-of-kit pair | 97 | 100 | 91 | 44 | 44% | 32 |
| `freeze-ray+knight-hop` | out-of-kit pair | 100 | 91 | 88 | 0 | 0% | 32 |
| `become-king+knight-hop` | out-of-kit pair | 100 | 100 | 100 | 56 | 56% | 32 |
| `knight-hop+twin` | out-of-kit pair | 100 | 97 | 72 | 100 | 72% | 32 |
| `freeze-ray+summon-knight` | out-of-kit pair | 66 | 19 | 0 | 100 | 0% | 32 |
| `become-king+summon-knight` | out-of-kit pair | 100 | 72 | 69 | 25 | 25% | 32 |
| `summon-knight+twin` | out-of-kit pair | 100 | 31 | 22 | 9 | 9% | 32 |
| `become-king+freeze-ray` | out-of-kit pair | 100 | 69 | 28 | 0 | 0% | 32 |
| `freeze-ray+twin` | out-of-kit pair | 97 | 50 | 0 | 0 | 0% | 32 |
| `become-king+twin` | out-of-kit pair | 100 | 81 | 34 | 91 | 34% | 32 |

### revenge-14 — ONE-ANSWER*

kit: `vanguard` `swap` `poison-dart` `smoke` · signature: `swap+vanguard` · probes: `knight-hop` `boulder` `summon-knight` `freeze-ray` `magnet`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 16 |
| `vanguard` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `swap` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `poison-dart` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `smoke` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `swap+vanguard` | in-kit pair | 100 | 97 | 84 | 88 | 84% | 32 |
| `poison-dart+vanguard` | in-kit pair | 0 | — | — | — | elim | 16 |
| `smoke+vanguard` | in-kit pair | 0 | — | — | — | elim | 16 |
| `poison-dart+swap` | in-kit pair | 0 | — | — | — | elim | 16 |
| `smoke+swap` | in-kit pair | 0 | — | — | — | elim | 16 |
| `poison-dart+smoke` | in-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+vanguard` | out-of-kit pair | 100 | 100 | 100 | 100 | 100% | 32 |
| `boulder+vanguard` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `summon-knight+vanguard` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+vanguard` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+vanguard` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+swap` | out-of-kit pair | 100 | 100 | 100 | 100 | 100% | 32 |
| `boulder+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `summon-knight+swap` | out-of-kit pair | 97 | 91 | 41 | 56 | 41% | 32 |
| `freeze-ray+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+knight-hop` | out-of-kit pair | 100 | 100 | 100 | 100 | 100% | 32 |
| `knight-hop+summon-knight` | out-of-kit pair | 100 | 100 | 100 | 100 | 100% | 32 |
| `freeze-ray+knight-hop` | out-of-kit pair | 100 | 100 | 100 | 97 | 97% | 32 |
| `knight-hop+magnet` | out-of-kit pair | 100 | 100 | 100 | 100 | 100% | 32 |
| `boulder+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+magnet` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+magnet` | out-of-kit pair | 0 | — | — | — | elim | 16 |

### revenge-15 — ONE-ANSWER*

kit: `magnet` `boulder` `aegis` `decoy` · signature: `boulder+magnet` · probes: `knight-hop` `swap` `summon-knight` `freeze-ray` `become-king`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 16 |
| `magnet` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `boulder` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `aegis` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `decoy` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `boulder+magnet` | in-kit pair | 59 | 66 | 84 | 69 | 59% | 32 |
| `aegis+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `decoy+magnet` | in-kit pair | 72 | 0 | 0 | 0 | 0% | 32 |
| `aegis+boulder` | in-kit pair | 19 | 13 | 47 | 9 | 9% | 32 |
| `boulder+decoy` | in-kit pair | 72 | 84 | 94 | 100 | 72% | 32 |
| `aegis+decoy` | in-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+magnet` | out-of-kit pair | 81 | 88 | 81 | 100 | 81% | 32 |
| `magnet+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+summon-knight` | out-of-kit pair | 38 | 28 | 84 | 100 | 28% | 32 |
| `freeze-ray+magnet` | out-of-kit pair | 25 | 0 | 25 | 0 | 0% | 16 |
| `become-king+magnet` | out-of-kit pair | 88 | 100 | 84 | 91 | 84% | 32 |
| `boulder+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+summon-knight` | out-of-kit pair | 6 | 31 | 0 | 97 | 0% | 32 |
| `boulder+freeze-ray` | out-of-kit pair | 6 | 0 | 6 | 0 | 0% | 16 |
| `become-king+boulder` | out-of-kit pair | 31 | 16 | 31 | 44 | 16% | 32 |
| `knight-hop+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+knight-hop` | out-of-kit pair | 75 | 47 | 91 | 100 | 47% | 32 |
| `summon-knight+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+summon-knight` | out-of-kit pair | 47 | 59 | 47 | 100 | 47% | 32 |
| `become-king+freeze-ray` | out-of-kit pair | 13 | 0 | 0 | 6 | 0% | 16 |

### revenge-16 — NO ANSWER (not even the signature pair clears)

kit: `poison-dart` `bishop-squire` `magnet` `rabies-dart` · signature: `bishop-squire+poison-dart` · probes: `knight-hop` `swap` `boulder` `summon-knight` `freeze-ray`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 16 |
| `poison-dart` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `bishop-squire` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `magnet` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `rabies-dart` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `bishop-squire+poison-dart` | in-kit pair | 63 | 56 | 53 | 56 | 53% | 32 |
| `magnet+poison-dart` | in-kit pair | 0 | — | — | — | elim | 16 |
| `poison-dart+rabies-dart` | in-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+rabies-dart` | in-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+rabies-dart` | in-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+poison-dart` | out-of-kit pair | 56 | 0 | 44 | 0 | 0% | 32 |
| `poison-dart+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+poison-dart` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `poison-dart+summon-knight` | out-of-kit pair | 63 | 0 | 44 | 0 | 0% | 32 |
| `freeze-ray+poison-dart` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+knight-hop` | out-of-kit pair | 38 | 0 | 38 | 0 | 0% | 16 |
| `bishop-squire+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+boulder` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `bishop-squire+summon-knight` | out-of-kit pair | 78 | 47 | 41 | 0 | 0% | 32 |
| `bishop-squire+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+swap` | out-of-kit pair | 59 | 0 | 19 | 0 | 0% | 32 |
| `boulder+knight-hop` | out-of-kit pair | 25 | 0 | 38 | 0 | 0% | 16 |
| `knight-hop+summon-knight` | out-of-kit pair | 100 | 0 | 91 | 0 | 0% | 32 |
| `freeze-ray+knight-hop` | out-of-kit pair | 47 | 0 | 25 | 0 | 0% | 32 |
| `boulder+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `summon-knight+swap` | out-of-kit pair | 66 | 0 | 75 | 0 | 0% | 32 |
| `freeze-ray+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+summon-knight` | out-of-kit pair | 72 | 0 | 44 | 0 | 0% | 32 |
| `boulder+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+summon-knight` | out-of-kit pair | 78 | 0 | 38 | 3 | 0% | 32 |

### revenge-17 — MULTI-ROUTE

kit: `dragon` `sacrifice` `aegis` `poison-dart` · signature: `dragon+sacrifice` · probes: `knight-hop` `swap` `boulder` `summon-knight` `freeze-ray`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 16 |
| `dragon` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `sacrifice` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `aegis` | single | 0 | 3 | 0 | 0 | 0% | 32 |
| `poison-dart` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `dragon+sacrifice` | in-kit pair | 69 | 88 | 91 | 69 | 69% | 32 |
| `aegis+dragon` | in-kit pair | 97 | 69 | 97 | 100 | 69% | 32 |
| `dragon+poison-dart` | in-kit pair | 31 | 63 | 38 | 9 | 9% | 32 |
| `aegis+sacrifice` | in-kit pair | 0 | — | — | — | elim | 16 |
| `poison-dart+sacrifice` | in-kit pair | 0 | — | — | — | elim | 16 |
| `aegis+poison-dart` | in-kit pair | 0 | — | — | — | elim | 16 |
| `dragon+knight-hop` | out-of-kit pair | 63 | 66 | 78 | 56 | 56% | 32 |
| `dragon+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+dragon` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `dragon+summon-knight` | out-of-kit pair | 53 | 47 | 66 | 16 | 16% | 32 |
| `dragon+freeze-ray` | out-of-kit pair | 41 | 28 | 50 | 6 | 6% | 32 |
| `knight-hop+sacrifice` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `sacrifice+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+sacrifice` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `sacrifice+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+sacrifice` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+summon-knight` | out-of-kit pair | 50 | 66 | 66 | 3 | 3% | 32 |
| `freeze-ray+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `summon-knight+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+summon-knight` | out-of-kit pair | 31 | 25 | 47 | 9 | 9% | 32 |

### revenge-18 — ONE-ANSWER*

kit: `freeze-ray` `vanguard` `poison-dart` `magnet` · signature: `freeze-ray+vanguard` · probes: `knight-hop` `swap` `boulder` `summon-knight` `become-king`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 16 |
| `freeze-ray` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `vanguard` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `poison-dart` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `magnet` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `freeze-ray+vanguard` | in-kit pair | 78 | 72 | 66 | 72 | 66% | 32 |
| `freeze-ray+poison-dart` | in-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `poison-dart+vanguard` | in-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+vanguard` | in-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+poison-dart` | in-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+knight-hop` | out-of-kit pair | 100 | 88 | 100 | 0 | 0% | 32 |
| `freeze-ray+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+summon-knight` | out-of-kit pair | 9 | 34 | 91 | 44 | 9% | 32 |
| `become-king+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+vanguard` | out-of-kit pair | 100 | 78 | 100 | 0 | 0% | 32 |
| `swap+vanguard` | out-of-kit pair | 100 | 84 | 100 | 88 | 84% | 32 |
| `boulder+vanguard` | out-of-kit pair | 19 | 19 | 25 | 25 | 19% | 16 |
| `summon-knight+vanguard` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+vanguard` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+swap` | out-of-kit pair | 100 | 91 | 97 | 0 | 0% | 32 |
| `boulder+knight-hop` | out-of-kit pair | 100 | 88 | 97 | 0 | 0% | 32 |
| `knight-hop+summon-knight` | out-of-kit pair | 100 | 69 | 100 | 0 | 0% | 32 |
| `become-king+knight-hop` | out-of-kit pair | 100 | 100 | 100 | 3 | 3% | 32 |
| `boulder+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `summon-knight+swap` | out-of-kit pair | 100 | 78 | 97 | 41 | 41% | 32 |
| `become-king+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+summon-knight` | out-of-kit pair | 13 | 16 | 47 | 44 | 13% | 32 |
| `become-king+boulder` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |

### revenge-19 — MULTI-ROUTE

kit: `convert` `summon-knight` `aegis` `magnet` · signature: `convert+summon-knight` · probes: `knight-hop` `swap` `boulder` `freeze-ray` `become-king`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 16 |
| `convert` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `summon-knight` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `aegis` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `magnet` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `convert+summon-knight` | in-kit pair | 72 | 66 | 69 | 75 | 66% | 32 |
| `aegis+convert` | in-kit pair | 0 | — | — | — | elim | 16 |
| `convert+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `aegis+summon-knight` | in-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+summon-knight` | in-kit pair | 0 | — | — | — | elim | 16 |
| `aegis+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `convert+knight-hop` | out-of-kit pair | 97 | 100 | 63 | 0 | 0% | 32 |
| `convert+swap` | out-of-kit pair | 100 | 0 | 100 | 0 | 0% | 32 |
| `boulder+convert` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `convert+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+convert` | out-of-kit pair | 75 | 84 | 0 | 0 | 0% | 32 |
| `knight-hop+summon-knight` | out-of-kit pair | 97 | 100 | 16 | 0 | 0% | 32 |
| `summon-knight+swap` | out-of-kit pair | 97 | 94 | 0 | 0 | 0% | 32 |
| `boulder+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+summon-knight` | out-of-kit pair | 91 | 91 | 88 | 75 | 75% | 32 |
| `knight-hop+swap` | out-of-kit pair | 100 | 100 | 0 | 0 | 0% | 32 |
| `boulder+knight-hop` | out-of-kit pair | 97 | 100 | 0 | 0 | 0% | 32 |
| `freeze-ray+knight-hop` | out-of-kit pair | 100 | 100 | 19 | 0 | 0% | 32 |
| `become-king+knight-hop` | out-of-kit pair | 100 | 100 | 0 | 0 | 0% | 32 |
| `boulder+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+swap` | out-of-kit pair | 97 | 81 | 0 | 0 | 0% | 32 |
| `boulder+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+boulder` | out-of-kit pair | 84 | 63 | 0 | 0 | 0% | 32 |
| `become-king+freeze-ray` | out-of-kit pair | 75 | 69 | 0 | 0 | 0% | 32 |

### revenge-21 — MULTI-ROUTE

kit: `boulder` `knight-hop` `aegis` `magnet` · signature: `boulder+knight-hop` · probes: `swap` `summon-knight` `freeze-ray` `become-king` `twin`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 16 |
| `boulder` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `knight-hop` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `aegis` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `magnet` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `boulder+knight-hop` | in-kit pair | 78 | 66 | 72 | 69 | 66% | 32 |
| `aegis+boulder` | in-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `aegis+knight-hop` | in-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `aegis+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+boulder` | out-of-kit pair | 97 | 78 | 78 | 66 | 66% | 32 |
| `boulder+twin` | out-of-kit pair | 91 | 63 | 69 | 66 | 63% | 32 |
| `knight-hop+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+summon-knight` | out-of-kit pair | 100 | 94 | 91 | 91 | 91% | 32 |
| `freeze-ray+knight-hop` | out-of-kit pair | 100 | 100 | 100 | 100 | 100% | 32 |
| `become-king+knight-hop` | out-of-kit pair | 100 | 100 | 100 | 100 | 100% | 32 |
| `knight-hop+twin` | out-of-kit pair | 100 | 100 | 100 | 100 | 100% | 32 |
| `summon-knight+swap` | out-of-kit pair | 100 | 97 | 72 | 100 | 72% | 32 |
| `freeze-ray+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `become-king+swap` | out-of-kit pair | 97 | 78 | 97 | 78 | 78% | 32 |
| `swap+twin` | out-of-kit pair | 100 | 75 | 84 | 88 | 75% | 32 |
| `freeze-ray+summon-knight` | out-of-kit pair | 19 | 66 | 0 | 66 | 0% | 32 |
| `become-king+summon-knight` | out-of-kit pair | 100 | 84 | 94 | 97 | 84% | 32 |
| `summon-knight+twin` | out-of-kit pair | 100 | 63 | 84 | 78 | 63% | 32 |
| `become-king+freeze-ray` | out-of-kit pair | 100 | 100 | 100 | 100 | 100% | 32 |
| `freeze-ray+twin` | out-of-kit pair | 100 | 88 | 84 | 94 | 84% | 32 |
| `become-king+twin` | out-of-kit pair | 100 | 100 | 100 | 100 | 100% | 32 |

### revenge-22 — MULTI-ROUTE

kit: `dragon` `duchess` `magnet` `aegis` · signature: `dragon+duchess` · probes: `knight-hop` `swap` `boulder` `summon-knight` `freeze-ray`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 16 |
| `dragon` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `duchess` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `magnet` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `aegis` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `dragon+duchess` | in-kit pair | 78 | 81 | 84 | 72 | 72% | 32 |
| `dragon+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `aegis+dragon` | in-kit pair | 56 | 22 | 25 | 0 | 0% | 32 |
| `duchess+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `aegis+duchess` | in-kit pair | 38 | 38 | 25 | 0 | 0% | 16 |
| `aegis+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `dragon+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `dragon+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+dragon` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `dragon+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `dragon+freeze-ray` | out-of-kit pair | 66 | 78 | 100 | 69 | 66% | 32 |
| `duchess+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `duchess+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+duchess` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `duchess+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `duchess+freeze-ray` | out-of-kit pair | 50 | 84 | 97 | 84 | 50% | 32 |
| `knight-hop+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `summon-knight+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |

### revenge-23 — ONE-ANSWER

kit: `knight-hop` `twin` `aegis` `decoy` · signature: `knight-hop+twin` · probes: `swap` `boulder` `summon-knight` `freeze-ray` `magnet`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 16 |
| `knight-hop` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `twin` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `aegis` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `decoy` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `knight-hop+twin` | in-kit pair | 72 | 69 | 66 | 63 | 63% | 32 |
| `aegis+knight-hop` | in-kit pair | 0 | — | — | — | elim | 16 |
| `decoy+knight-hop` | in-kit pair | 0 | — | — | — | elim | 16 |
| `aegis+twin` | in-kit pair | 0 | — | — | — | elim | 16 |
| `decoy+twin` | in-kit pair | 0 | — | — | — | elim | 16 |
| `aegis+decoy` | in-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+knight-hop` | out-of-kit pair | 44 | 59 | 59 | 53 | 44% | 32 |
| `knight-hop+summon-knight` | out-of-kit pair | 53 | 38 | 53 | 50 | 38% | 32 |
| `freeze-ray+knight-hop` | out-of-kit pair | 59 | 56 | 50 | 59 | 50% | 32 |
| `knight-hop+magnet` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `swap+twin` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+twin` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `summon-knight+twin` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+twin` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+twin` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `summon-knight+swap` | out-of-kit pair | 16 | 69 | 6 | 19 | 6% | 32 |
| `freeze-ray+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+magnet` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `magnet+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+magnet` | out-of-kit pair | 0 | — | — | — | elim | 16 |

### revenge-24 — ONE-ANSWER

kit: `duchess` `decoy` `aegis` `magnet` · signature: `decoy+duchess` · probes: `knight-hop` `swap` `boulder` `summon-knight` `freeze-ray`

| loadout | group | L7 | L8 | L9 | L10 | worst | trials |
|---|---|---|---|---|---|---|---|
| `none` | baseline | 0 | 0 | 0 | 0 | 0% | 16 |
| `duchess` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `decoy` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `aegis` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `magnet` | single | 0 | 0 | 0 | 0 | 0% | 16 |
| `decoy+duchess` | in-kit pair | 75 | 91 | 75 | 63 | 63% | 32 |
| `aegis+duchess` | in-kit pair | 0 | — | — | — | elim | 16 |
| `duchess+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `aegis+decoy` | in-kit pair | 0 | — | — | — | elim | 16 |
| `decoy+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `aegis+magnet` | in-kit pair | 0 | — | — | — | elim | 16 |
| `duchess+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `duchess+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+duchess` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `duchess+summon-knight` | out-of-kit pair | 63 | 38 | 100 | 13 | 13% | 32 |
| `duchess+freeze-ray` | out-of-kit pair | 44 | 66 | 0 | 100 | 0% | 32 |
| `decoy+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `decoy+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+decoy` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `decoy+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `decoy+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `knight-hop+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+knight-hop` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `summon-knight+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+swap` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `boulder+freeze-ray` | out-of-kit pair | 0 | — | — | — | elim | 16 |
| `freeze-ray+summon-knight` | out-of-kit pair | 0 | — | — | — | elim | 16 |

## Coverage

Runs completed: 12 — revenge-12, revenge-13, revenge-14, revenge-15, revenge-16, revenge-17, revenge-18, revenge-19, revenge-21, revenge-22, revenge-23, revenge-24

In flight / incomplete: revenge-25
