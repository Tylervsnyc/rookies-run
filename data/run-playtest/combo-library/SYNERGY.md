# Rookie's Revenge — pair synergy report

Generated 2026-09-14 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **1072** · combo-gated: **61** · solvable with no ability: 72 · every kit disqualified by one of its own cards: 678 · a kit survived but no pair cleared: 217 · failed the high-trial confirm: 44

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-step+rewind` | 5 | L7 L8 L9 | 100% | 3 | 0 |
| `dragon+duchess` | 4 | L6 L7 L8 L9 | 93% | 2 | 0 |
| `become-king+bishop-step` | 3 | L7 L8 | 80% | 0 | 0 |
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-step+dragon` | 3 | L7 L9 | 100% | 0 | 0 |
| `bishop-step+freeze-ray` | 3 | L8 | 100% | 1 | 0 |
| `bishop-step+rabies-dart` | 3 | L7 L8 | 97% | 0 | 0 |
| `bishop-step+smoke` | 3 | L7 L8 | 100% | 0 | 0 |
| `bishop-step+vanguard` | 3 | L7 L8 | 100% | 1 | 0 |
| `convert+smoke` | 3 | L7 L8 L10 | 63% | 3 | 0 |
| `duchess+vanguard` | 3 | L8 L9 | 83% | 1 | 0 |
| `page+rewind` | 3 | L7 L8 | 77% | 1 | 0 |
| `aegis+dragon` | 2 | L8 L10 | 80% | 2 | 0 |
| `bishop-step+boulder` | 2 | L8 | 100% | 0 | 0 |
| `bishop-step+convert` | 2 | L7 | 77% | 0 | 0 |
| `bishop-step+decoy` | 2 | L7 L8 | 93% | 0 | 0 |
| `boulder+dragon` | 2 | L7 L9 | 70% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `decoy+dragon` | 2 | L8 | 80% | 2 | 0 |
| `dragon+freeze-ray` | 2 | L7 L9 | 97% | 0 | 0 |
| `dragon+vanguard` | 2 | L9 L10 | 77% | 2 | 0 |
| `poison-dart+queen-pulse` | 2 | L8 L9 | 83% | 2 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `aegis+bishop-step` | 1 | L9 | 100% | 0 | 0 |
| `aegis+queen-pulse` | 1 | L8 | 67% | 1 | 0 |
| `become-king+dragon` | 1 | L7 | 77% | 0 | 0 |
| `become-king+poison-dart` | 1 | L8 | 73% | 0 | 0 |
| `become-king+queen-pulse` | 1 | L8 | 60% | 1 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-squire+vanguard` | 1 | L9 | 87% | 1 | 0 |
| `bishop-step+page` | 1 | L7 | 60% | 1 | 0 |
| `bishop-step+poison-dart` | 1 | L7 | 70% | 0 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `boulder+summon-knight` | 1 | L7 | 87% | 0 | 0 |
| `convert+decoy` | 1 | L7 | 63% | 0 | 0 |
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
| `queen-pulse+vanguard` | 1 | L7 | 97% | 1 | 0 |
| `rewind+summon-knight` | 1 | L7 | 93% | 0 | 0 |
| `rewind+twin` | 1 | L7 | 67% | 0 | 0 |
| `sacrifice+twin` | 1 | L7 | 60% | 1 | 0 |
| `smoke+summon-knight` | 1 | L7 | 97% | 0 | 0 |
| `swap+vanguard` | 1 | L7 | 100% | 0 | 0 |

## Socket abilities — which cards show up in the most gating pairs

The card that appears in the most winning pairs is the one to build future runs around.

| ability | gating pairs it appears in | gated levels | pairs |
|---|---|---|---|
| `bishop-step` | 14 | 17 | `aegis+bishop-step`, `become-king+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+poison-dart`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 12 | 15 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+poison-dart`, `dragon+rewind`, `dragon+smoke`, `dragon+twin`, `dragon+vanguard` |
| `queen-pulse` | 9 | 10 | `aegis+queen-pulse`, `become-king+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `freeze-ray+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+vanguard` |
| `smoke` | 8 | 11 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `freeze-ray` | 8 | 10 | `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+queen-pulse`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `vanguard` | 7 | 11 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `convert` | 7 | 9 | `bishop-step+convert`, `convert+decoy`, `convert+page`, `convert+queen-pulse`, `convert+rewind`, `convert+smoke`, `convert+summon-knight` |
| `page` | 7 | 9 | `bishop-step+page`, `convert+page`, `decoy+page`, `duchess+page`, `freeze-ray+page`, `page+rewind`, `page+smoke` |
| `duchess` | 7 | 8 | `bishop-squire+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+page`, `duchess+rabies-dart`, `duchess+swap`, `duchess+vanguard` |
| `twin` | 7 | 6 | `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `summon-knight` | 7 | 5 | `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `freeze-ray+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `rewind` | 6 | 11 | `bishop-step+rewind`, `convert+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `decoy` | 6 | 8 | `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+page`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `boulder` | 4 | 7 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `bishop-squire` | 4 | 6 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+swap`, `bishop-squire+vanguard` |
| `become-king` | 4 | 5 | `become-king+bishop-step`, `become-king+dragon`, `become-king+poison-dart`, `become-king+queen-pulse` |
| `poison-dart` | 4 | 5 | `become-king+poison-dart`, `bishop-step+poison-dart`, `dragon+poison-dart`, `poison-dart+queen-pulse` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `rabies-dart` | 3 | 5 | `bishop-step+rabies-dart`, `duchess+rabies-dart`, `queen-pulse+rabies-dart` |
| `aegis` | 3 | 4 | `aegis+bishop-step`, `aegis+dragon`, `aegis+queen-pulse` |
| `sacrifice` | 1 | 1 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 72 |
| `aegis+decoy` | 38 |
| `boulder+rewind` | 38 |
| `sacrifice+smoke` | 38 |
| `aegis+twin` | 37 |
| `boulder+convert` | 35 |
| `rabies-dart+twin` | 35 |
| `magnet+rewind` | 33 |
| `bishop-squire+page` | 32 |
| `freeze-ray+sacrifice` | 31 |
| `duchess+sacrifice` | 30 |
| `rewind+smoke` | 30 |
| `become-king+duchess` | 29 |
| `poison-dart+summon-knight` | 29 |
| `rabies-dart+sacrifice` | 29 |
| `freeze-ray+rabies-dart` | 28 |
| `magnet+sacrifice` | 28 |
| `become-king+vanguard` | 27 |
| `boulder+page` | 27 |
| `convert+vanguard` | 27 |
| `magnet+page` | 27 |
| `summon-knight+vanguard` | 27 |
| `bishop-squire+smoke` | 26 |
| `decoy+poison-dart` | 26 |
| `sacrifice+vanguard` | 26 |
| `aegis+boulder` | 25 |
| `aegis+summon-knight` | 25 |
| `become-king+bishop-squire` | 25 |
| `become-king+page` | 25 |
| `bishop-squire+rewind` | 25 |
| `boulder+magnet` | 25 |
| `decoy+freeze-ray` | 25 |
| `dragon+rabies-dart` | 25 |
| `magnet+poison-dart` | 25 |
| `magnet+summon-knight` | 25 |
| `poison-dart+rabies-dart` | 25 |
| `poison-dart+twin` | 25 |
| `aegis+freeze-ray` | 24 |
| `aegis+vanguard` | 24 |
| `become-king+boulder` | 24 |
| `bishop-squire+convert` | 24 |
| `bishop-squire+freeze-ray` | 24 |
| `bishop-squire+summon-knight` | 24 |
| `bishop-step+duchess` | 24 |
| `boulder+freeze-ray` | 24 |
| `convert+magnet` | 24 |
| `decoy+duchess` | 24 |
| `freeze-ray+vanguard` | 24 |
| `magnet+queen-pulse` | 24 |
| `page+summon-knight` | 24 |
| `poison-dart+sacrifice` | 24 |
| `poison-dart+smoke` | 24 |
| `rabies-dart+rewind` | 24 |
| `smoke+vanguard` | 24 |
| `aegis+magnet` | 23 |
| `aegis+page` | 23 |
| `become-king+freeze-ray` | 23 |
| `become-king+magnet` | 23 |
| `bishop-squire+decoy` | 23 |
| `bishop-squire+magnet` | 23 |
| `bishop-squire+poison-dart` | 23 |
| `bishop-squire+rabies-dart` | 23 |
| `bishop-squire+sacrifice` | 23 |
| `bishop-step+magnet` | 23 |
| `boulder+decoy` | 23 |
| `boulder+duchess` | 23 |
| `boulder+poison-dart` | 23 |
| `boulder+queen-pulse` | 23 |
| `boulder+rabies-dart` | 23 |
| `boulder+sacrifice` | 23 |
| `boulder+smoke` | 23 |
| `boulder+vanguard` | 23 |
| `convert+dragon` | 23 |
| `convert+freeze-ray` | 23 |
| `convert+sacrifice` | 23 |
| `convert+twin` | 23 |
| `decoy+magnet` | 23 |
| `decoy+smoke` | 23 |
| `decoy+twin` | 23 |
| `decoy+vanguard` | 23 |
| `dragon+magnet` | 23 |
| `dragon+sacrifice` | 23 |
| `duchess+magnet` | 23 |
| `duchess+poison-dart` | 23 |
| `duchess+rewind` | 23 |
| `duchess+smoke` | 23 |
| `magnet+rabies-dart` | 23 |
| `magnet+smoke` | 23 |
| `magnet+twin` | 23 |
| `magnet+vanguard` | 23 |
| `page+poison-dart` | 23 |
| `page+rabies-dart` | 23 |
| `page+twin` | 23 |
| `poison-dart+rewind` | 23 |
| `poison-dart+vanguard` | 23 |
| `queen-pulse+rewind` | 23 |
| `queen-pulse+twin` | 23 |
| `rabies-dart+smoke` | 23 |
| `rewind+vanguard` | 23 |
| `sacrifice+summon-knight` | 23 |
| `aegis+bishop-squire` | 22 |
| `aegis+convert` | 22 |
| `aegis+duchess` | 22 |
| `aegis+poison-dart` | 22 |
| `aegis+rabies-dart` | 22 |
| `become-king+convert` | 22 |
| `become-king+decoy` | 22 |
| `become-king+rabies-dart` | 22 |
| `become-king+rewind` | 22 |
| `become-king+sacrifice` | 22 |
| `become-king+summon-knight` | 22 |
| `become-king+twin` | 22 |
| `bishop-squire+bishop-step` | 22 |
| `bishop-squire+dragon` | 22 |
| `bishop-squire+queen-pulse` | 22 |
| `bishop-squire+twin` | 22 |
| `bishop-step+sacrifice` | 22 |
| `bishop-step+summon-knight` | 22 |
| `convert+duchess` | 22 |
| `convert+rabies-dart` | 22 |
| `decoy+rewind` | 22 |
| `decoy+sacrifice` | 22 |
| `dragon+page` | 22 |
| `dragon+queen-pulse` | 22 |
| `dragon+summon-knight` | 22 |
| `duchess+queen-pulse` | 22 |
| `duchess+summon-knight` | 22 |
| `freeze-ray+magnet` | 22 |
| `freeze-ray+poison-dart` | 22 |
| `freeze-ray+rewind` | 22 |
| `page+queen-pulse` | 22 |
| `page+vanguard` | 22 |
| `queen-pulse+sacrifice` | 22 |
| `queen-pulse+summon-knight` | 22 |
| `rabies-dart+vanguard` | 22 |
| `rewind+sacrifice` | 22 |
| `summon-knight+twin` | 22 |
| `twin+vanguard` | 22 |
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