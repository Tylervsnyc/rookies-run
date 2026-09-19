# Rookie's Revenge — pair synergy report

Generated 2026-09-19 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **1428** · combo-gated: **72** · solvable with no ability: 72 · every kit disqualified by one of its own cards: 958 · a kit survived but no pair cleared: 268 · failed the high-trial confirm: 58

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-step+rewind` | 5 | L7 L8 L9 | 100% | 3 | 0 |
| `dragon+duchess` | 5 | L6 L7 L8 L9 | 93% | 3 | 0 |
| `bishop-step+dragon` | 4 | L7 L9 | 100% | 0 | 0 |
| `bishop-step+rabies-dart` | 4 | L7 L8 | 97% | 1 | 0 |
| `bishop-step+smoke` | 4 | L7 L8 | 100% | 0 | 0 |
| `page+rewind` | 4 | L7 L8 | 77% | 2 | 0 |
| `poison-dart+queen-pulse` | 4 | L8 L9 | 83% | 2 | 0 |
| `aegis+dragon` | 3 | L8 L9 L10 | 80% | 2 | 0 |
| `become-king+bishop-step` | 3 | L7 L8 | 80% | 0 | 0 |
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-step+boulder` | 3 | L8 L9 | 100% | 1 | 0 |
| `bishop-step+decoy` | 3 | L7 L8 L9 | 93% | 1 | 0 |
| `bishop-step+freeze-ray` | 3 | L8 | 100% | 1 | 0 |
| `bishop-step+vanguard` | 3 | L7 L8 | 100% | 1 | 0 |
| `convert+smoke` | 3 | L7 L8 L10 | 63% | 3 | 0 |
| `duchess+vanguard` | 3 | L8 L9 | 83% | 1 | 0 |
| `bishop-squire+queen-pulse` | 2 | L8 L9 | 63% | 0 | 0 |
| `bishop-step+convert` | 2 | L7 | 77% | 0 | 0 |
| `boulder+dragon` | 2 | L7 L9 | 70% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `boulder+summon-knight` | 2 | L7 | 87% | 1 | 0 |
| `decoy+dragon` | 2 | L8 | 80% | 2 | 0 |
| `dragon+freeze-ray` | 2 | L7 L9 | 97% | 0 | 0 |
| `dragon+vanguard` | 2 | L9 L10 | 77% | 2 | 0 |
| `queen-pulse+vanguard` | 2 | L7 L8 | 97% | 1 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `aegis+bishop-step` | 1 | L9 | 100% | 0 | 0 |
| `aegis+queen-pulse` | 1 | L8 | 67% | 1 | 0 |
| `become-king+dragon` | 1 | L7 | 77% | 0 | 0 |
| `become-king+poison-dart` | 1 | L8 | 73% | 0 | 0 |
| `become-king+queen-pulse` | 1 | L8 | 60% | 1 | 0 |
| `become-king+rewind` | 1 | L7 | 77% | 1 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-squire+vanguard` | 1 | L9 | 87% | 1 | 0 |
| `bishop-step+duchess` | 1 | L7 | 73% | 0 | 0 |
| `bishop-step+page` | 1 | L7 | 60% | 1 | 0 |
| `bishop-step+poison-dart` | 1 | L7 | 70% | 0 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `convert+decoy` | 1 | L7 | 63% | 0 | 0 |
| `convert+dragon` | 1 | L9 | 63% | 0 | 0 |
| `convert+page` | 1 | L10 | 63% | 0 | 0 |
| `convert+queen-pulse` | 1 | L7 | 97% | 0 | 0 |
| `convert+rewind` | 1 | L7 | 63% | 0 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `decoy+page` | 1 | L7 | 63% | 1 | 0 |
| `decoy+queen-pulse` | 1 | L7 | 60% | 1 | 0 |
| `decoy+summon-knight` | 1 | L8 | 77% | 1 | 0 |
| `dragon+poison-dart` | 1 | L9 | 63% | 1 | 0 |
| `dragon+rewind` | 1 | L9 | 100% | 0 | 0 |
| `dragon+smoke` | 1 | L7 | 60% | 0 | 0 |
| `dragon+twin` | 1 | L9 | 73% | 0 | 0 |
| `duchess+freeze-ray` | 1 | L9 | 97% | 0 | 0 |
| `duchess+page` | 1 | L7 | 60% | 1 | 0 |
| `duchess+rabies-dart` | 1 | L8 | 73% | 0 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `freeze-ray+knight-hop` | 1 | L7 | 100% | 0 | 0 |
| `freeze-ray+page` | 1 | L10 | 67% | 1 | 0 |
| `freeze-ray+queen-pulse` | 1 | L10 | 80% | 0 | 0 |
| `freeze-ray+summon-knight` | 1 | L9 | 87% | 1 | 0 |
| `freeze-ray+twin` | 1 | L7 | 83% | 1 | 0 |
| `knight-hop+smoke` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+twin` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `page+smoke` | 1 | L9 | 77% | 1 | 0 |
| `queen-pulse+rabies-dart` | 1 | L7 | 73% | 0 | 0 |
| `queen-pulse+smoke` | 1 | L9 | 70% | 1 | 0 |
| `rewind+summon-knight` | 1 | L7 | 93% | 0 | 0 |
| `rewind+twin` | 1 | L7 | 67% | 0 | 0 |
| `sacrifice+twin` | 1 | L7 | 60% | 1 | 0 |
| `smoke+summon-knight` | 1 | L7 | 97% | 0 | 0 |
| `swap+vanguard` | 1 | L7 | 100% | 0 | 0 |

## Socket abilities — which cards show up in the most gating pairs

The card that appears in the most winning pairs is the one to build future runs around.

| ability | gating pairs it appears in | gated levels | pairs |
|---|---|---|---|
| `bishop-step` | 15 | 22 | `aegis+bishop-step`, `become-king+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+duchess`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+poison-dart`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 13 | 17 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `convert+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+poison-dart`, `dragon+rewind`, `dragon+smoke`, `dragon+twin`, `dragon+vanguard` |
| `queen-pulse` | 10 | 12 | `aegis+queen-pulse`, `become-king+queen-pulse`, `bishop-squire+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `freeze-ray+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+vanguard` |
| `smoke` | 8 | 12 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `duchess` | 8 | 10 | `bishop-squire+duchess`, `bishop-step+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+page`, `duchess+rabies-dart`, `duchess+swap`, `duchess+vanguard` |
| `convert` | 8 | 10 | `bishop-step+convert`, `convert+decoy`, `convert+dragon`, `convert+page`, `convert+queen-pulse`, `convert+rewind`, `convert+smoke`, `convert+summon-knight` |
| `freeze-ray` | 8 | 10 | `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+queen-pulse`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `rewind` | 7 | 13 | `become-king+rewind`, `bishop-step+rewind`, `convert+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `vanguard` | 7 | 12 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `page` | 7 | 10 | `bishop-step+page`, `convert+page`, `decoy+page`, `duchess+page`, `freeze-ray+page`, `page+rewind`, `page+smoke` |
| `twin` | 7 | 6 | `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `summon-knight` | 7 | 6 | `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `freeze-ray+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `decoy` | 6 | 9 | `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+page`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `bishop-squire` | 5 | 8 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+queen-pulse`, `bishop-squire+swap`, `bishop-squire+vanguard` |
| `become-king` | 5 | 6 | `become-king+bishop-step`, `become-king+dragon`, `become-king+poison-dart`, `become-king+queen-pulse`, `become-king+rewind` |
| `boulder` | 4 | 9 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `poison-dart` | 4 | 7 | `become-king+poison-dart`, `bishop-step+poison-dart`, `dragon+poison-dart`, `poison-dart+queen-pulse` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `rabies-dart` | 3 | 6 | `bishop-step+rabies-dart`, `duchess+rabies-dart`, `queen-pulse+rabies-dart` |
| `aegis` | 3 | 5 | `aegis+bishop-step`, `aegis+dragon`, `aegis+queen-pulse` |
| `sacrifice` | 1 | 1 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 89 |
| `aegis+twin` | 47 |
| `aegis+decoy` | 46 |
| `sacrifice+smoke` | 45 |
| `boulder+convert` | 43 |
| `boulder+rewind` | 43 |
| `rabies-dart+twin` | 42 |
| `bishop-squire+page` | 40 |
| `rewind+smoke` | 40 |
| `magnet+rewind` | 39 |
| `become-king+vanguard` | 36 |
| `magnet+sacrifice` | 35 |
| `rabies-dart+sacrifice` | 35 |
| `decoy+poison-dart` | 34 |
| `freeze-ray+sacrifice` | 34 |
| `magnet+page` | 34 |
| `poison-dart+summon-knight` | 34 |
| `boulder+page` | 33 |
| `duchess+sacrifice` | 33 |
| `freeze-ray+rabies-dart` | 33 |
| `poison-dart+rabies-dart` | 33 |
| `summon-knight+vanguard` | 33 |
| `become-king+duchess` | 32 |
| `become-king+page` | 32 |
| `bishop-squire+smoke` | 32 |
| `convert+vanguard` | 31 |
| `poison-dart+twin` | 31 |
| `bishop-squire+rabies-dart` | 30 |
| `bishop-squire+rewind` | 30 |
| `boulder+duchess` | 30 |
| `dragon+magnet` | 30 |
| `page+summon-knight` | 30 |
| `aegis+bishop-squire` | 29 |
| `aegis+duchess` | 29 |
| `bishop-squire+decoy` | 29 |
| `bishop-step+sacrifice` | 29 |
| `boulder+queen-pulse` | 29 |
| `boulder+sacrifice` | 29 |
| `boulder+vanguard` | 29 |
| `convert+sacrifice` | 29 |
| `decoy+duchess` | 29 |
| `decoy+freeze-ray` | 29 |
| `decoy+sacrifice` | 29 |
| `duchess+magnet` | 29 |
| `duchess+smoke` | 29 |
| `magnet+smoke` | 29 |
| `magnet+summon-knight` | 29 |
| `poison-dart+rewind` | 29 |
| `poison-dart+smoke` | 29 |
| `queen-pulse+rewind` | 29 |
| `aegis+boulder` | 28 |
| `aegis+magnet` | 28 |
| `aegis+poison-dart` | 28 |
| `aegis+summon-knight` | 28 |
| `aegis+vanguard` | 28 |
| `become-king+bishop-squire` | 28 |
| `become-king+boulder` | 28 |
| `become-king+decoy` | 28 |
| `become-king+freeze-ray` | 28 |
| `become-king+magnet` | 28 |
| `become-king+twin` | 28 |
| `bishop-squire+bishop-step` | 28 |
| `bishop-squire+convert` | 28 |
| `bishop-squire+freeze-ray` | 28 |
| `bishop-squire+magnet` | 28 |
| `bishop-squire+poison-dart` | 28 |
| `bishop-squire+sacrifice` | 28 |
| `bishop-squire+summon-knight` | 28 |
| `bishop-step+magnet` | 28 |
| `boulder+decoy` | 28 |
| `boulder+freeze-ray` | 28 |
| `boulder+magnet` | 28 |
| `boulder+poison-dart` | 28 |
| `boulder+rabies-dart` | 28 |
| `boulder+smoke` | 28 |
| `convert+duchess` | 28 |
| `convert+freeze-ray` | 28 |
| `convert+twin` | 28 |
| `decoy+rewind` | 28 |
| `decoy+twin` | 28 |
| `decoy+vanguard` | 28 |
| `dragon+sacrifice` | 28 |
| `dragon+summon-knight` | 28 |
| `duchess+poison-dart` | 28 |
| `duchess+queen-pulse` | 28 |
| `duchess+rewind` | 28 |
| `freeze-ray+vanguard` | 28 |
| `magnet+poison-dart` | 28 |
| `magnet+queen-pulse` | 28 |
| `magnet+rabies-dart` | 28 |
| `magnet+twin` | 28 |
| `page+poison-dart` | 28 |
| `page+rabies-dart` | 28 |
| `page+twin` | 28 |
| `rabies-dart+rewind` | 28 |
| `rabies-dart+smoke` | 28 |
| `rabies-dart+vanguard` | 28 |
| `rewind+vanguard` | 28 |
| `sacrifice+summon-knight` | 28 |
| `sacrifice+vanguard` | 28 |
| `smoke+vanguard` | 28 |
| `twin+vanguard` | 28 |
| `aegis+convert` | 27 |
| `aegis+freeze-ray` | 27 |
| `aegis+page` | 27 |
| `aegis+rabies-dart` | 27 |
| `become-king+rabies-dart` | 27 |
| `become-king+sacrifice` | 27 |
| `become-king+summon-knight` | 27 |
| `bishop-squire+dragon` | 27 |
| `bishop-squire+twin` | 27 |
| `bishop-step+summon-knight` | 27 |
| `convert+magnet` | 27 |
| `convert+rabies-dart` | 27 |
| `decoy+magnet` | 27 |
| `decoy+smoke` | 27 |
| `dragon+page` | 27 |
| `dragon+queen-pulse` | 27 |
| `dragon+rabies-dart` | 27 |
| `duchess+summon-knight` | 27 |
| `freeze-ray+magnet` | 27 |
| `freeze-ray+poison-dart` | 27 |
| `freeze-ray+rewind` | 27 |
| `magnet+vanguard` | 27 |
| `page+queen-pulse` | 27 |
| `page+vanguard` | 27 |
| `poison-dart+sacrifice` | 27 |
| `poison-dart+vanguard` | 27 |
| `queen-pulse+sacrifice` | 27 |
| `queen-pulse+summon-knight` | 27 |
| `queen-pulse+twin` | 27 |
| `rewind+sacrifice` | 27 |
| `summon-knight+twin` | 27 |
| `become-king+convert` | 26 |
| `boulder+swap` | 2 |
| `freeze-ray+swap` | 2 |
| `knight-hop+swap` | 2 |
| `smoke+swap` | 2 |
| `aegis+knight-hop` | 1 |
| `become-king+swap` | 1 |
| `bishop-step+swap` | 1 |
| `convert+knight-hop` | 1 |
| `convert+swap` | 1 |
| `dragon+swap` | 1 |
| `page+swap` | 1 |
| `rabies-dart+swap` | 1 |
| `rewind+swap` | 1 |
| `swap+twin` | 1 |
| `bishop-squire+boulder` | 0 |
| `dragon+knight-hop` | 0 |
| `knight-hop+poison-dart` | 0 |
| `knight-hop+sacrifice` | 0 |
| `magnet+swap` | 0 |
| `poison-dart+swap` | 0 |

## Untested pairs

26 of 253 pairs have never been played against a surviving candidate. Widen with `--max-kits`, or extend `data/run-playtest/pair-hypotheses.json` to reorder the head of the search.

`_scans/` holds the full measured row for every subject scored with `--score-all` (the shipped-run ground truth); `_ledger.jsonl` is the resume ledger.