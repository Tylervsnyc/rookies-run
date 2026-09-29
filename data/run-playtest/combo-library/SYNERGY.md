# Rookie's Revenge — pair synergy report

Generated 2026-09-29 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **2030** · combo-gated: **91** · solvable with no ability: 72 · every kit disqualified by one of its own cards: 1394 · a kit survived but no pair cleared: 394 · failed the high-trial confirm: 79

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `dragon+duchess` | 6 | L6 L7 L8 L9 | 93% | 3 | 0 |
| `bishop-step+dragon` | 5 | L7 L9 | 100% | 0 | 0 |
| `bishop-step+rewind` | 5 | L7 L8 L9 | 100% | 3 | 0 |
| `aegis+dragon` | 4 | L8 L9 L10 | 80% | 3 | 0 |
| `bishop-squire+queen-pulse` | 4 | L7 L8 L9 | 67% | 1 | 0 |
| `bishop-step+boulder` | 4 | L8 L9 | 100% | 2 | 0 |
| `bishop-step+rabies-dart` | 4 | L7 L8 | 97% | 1 | 0 |
| `bishop-step+smoke` | 4 | L7 L8 | 100% | 0 | 0 |
| `dragon+vanguard` | 4 | L8 L9 L10 | 77% | 4 | 0 |
| `page+rewind` | 4 | L7 L8 | 77% | 2 | 0 |
| `poison-dart+queen-pulse` | 4 | L8 L9 | 83% | 2 | 0 |
| `become-king+bishop-step` | 3 | L7 L8 | 80% | 0 | 0 |
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-step+decoy` | 3 | L7 L8 L9 | 93% | 1 | 0 |
| `bishop-step+freeze-ray` | 3 | L8 | 100% | 1 | 0 |
| `bishop-step+vanguard` | 3 | L7 L8 | 100% | 1 | 0 |
| `boulder+summon-knight` | 3 | L7 L8 | 87% | 2 | 0 |
| `convert+smoke` | 3 | L7 L8 L10 | 63% | 3 | 0 |
| `decoy+dragon` | 3 | L7 L8 | 80% | 2 | 0 |
| `duchess+vanguard` | 3 | L8 L9 | 83% | 1 | 0 |
| `aegis+page` | 2 | L7 L8 | 80% | 2 | 0 |
| `bishop-squire+twin` | 2 | L7 L8 | 77% | 1 | 0 |
| `bishop-step+convert` | 2 | L7 | 77% | 0 | 0 |
| `boulder+dragon` | 2 | L7 L9 | 70% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `dragon+freeze-ray` | 2 | L7 L9 | 97% | 0 | 0 |
| `dragon+smoke` | 2 | L7 L8 | 80% | 0 | 0 |
| `duchess+freeze-ray` | 2 | L7 L9 | 97% | 0 | 0 |
| `freeze-ray+queen-pulse` | 2 | L9 L10 | 80% | 0 | 0 |
| `freeze-ray+twin` | 2 | L7 L8 | 83% | 2 | 0 |
| `page+smoke` | 2 | L7 L9 | 77% | 2 | 0 |
| `queen-pulse+smoke` | 2 | L9 | 70% | 1 | 0 |
| `queen-pulse+vanguard` | 2 | L7 L8 | 97% | 1 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `aegis+bishop-step` | 1 | L9 | 100% | 0 | 0 |
| `aegis+queen-pulse` | 1 | L8 | 67% | 1 | 0 |
| `become-king+dragon` | 1 | L7 | 77% | 0 | 0 |
| `become-king+freeze-ray` | 1 | L7 | 73% | 0 | 0 |
| `become-king+poison-dart` | 1 | L8 | 73% | 0 | 0 |
| `become-king+queen-pulse` | 1 | L8 | 60% | 1 | 0 |
| `become-king+rewind` | 1 | L7 | 77% | 1 | 0 |
| `bishop-squire+bishop-step` | 1 | L9 | 80% | 1 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-squire+vanguard` | 1 | L9 | 87% | 1 | 0 |
| `bishop-step+duchess` | 1 | L7 | 73% | 0 | 0 |
| `bishop-step+page` | 1 | L7 | 60% | 1 | 0 |
| `bishop-step+poison-dart` | 1 | L7 | 70% | 0 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `boulder+queen-pulse` | 1 | L8 | 67% | 1 | 0 |
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
| `dragon+queen-pulse` | 1 | L8 | 80% | 1 | 0 |
| `dragon+rewind` | 1 | L9 | 100% | 0 | 0 |
| `dragon+twin` | 1 | L9 | 73% | 0 | 0 |
| `duchess+page` | 1 | L7 | 60% | 1 | 0 |
| `duchess+rabies-dart` | 1 | L8 | 73% | 0 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `freeze-ray+knight-hop` | 1 | L7 | 100% | 0 | 0 |
| `freeze-ray+page` | 1 | L10 | 67% | 1 | 0 |
| `freeze-ray+summon-knight` | 1 | L9 | 87% | 1 | 0 |
| `knight-hop+smoke` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+twin` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `queen-pulse+rabies-dart` | 1 | L7 | 73% | 0 | 0 |
| `rewind+summon-knight` | 1 | L7 | 93% | 0 | 0 |
| `rewind+twin` | 1 | L7 | 67% | 0 | 0 |
| `sacrifice+twin` | 1 | L7 | 60% | 1 | 0 |
| `smoke+summon-knight` | 1 | L7 | 97% | 0 | 0 |
| `swap+vanguard` | 1 | L7 | 100% | 0 | 0 |

## Socket abilities — which cards show up in the most gating pairs

The card that appears in the most winning pairs is the one to build future runs around.

| ability | gating pairs it appears in | gated levels | pairs |
|---|---|---|---|
| `bishop-step` | 16 | 25 | `aegis+bishop-step`, `become-king+bishop-step`, `bishop-squire+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+duchess`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+poison-dart`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 14 | 24 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `convert+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+poison-dart`, `dragon+queen-pulse`, `dragon+rewind`, `dragon+smoke`, `dragon+twin`, `dragon+vanguard` |
| `queen-pulse` | 12 | 17 | `aegis+queen-pulse`, `become-king+queen-pulse`, `bishop-squire+queen-pulse`, `boulder+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `dragon+queen-pulse`, `freeze-ray+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+vanguard` |
| `freeze-ray` | 9 | 14 | `become-king+freeze-ray`, `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+queen-pulse`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `smoke` | 8 | 15 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `page` | 8 | 13 | `aegis+page`, `bishop-step+page`, `convert+page`, `decoy+page`, `duchess+page`, `freeze-ray+page`, `page+rewind`, `page+smoke` |
| `duchess` | 8 | 12 | `bishop-squire+duchess`, `bishop-step+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+page`, `duchess+rabies-dart`, `duchess+swap`, `duchess+vanguard` |
| `convert` | 8 | 10 | `bishop-step+convert`, `convert+decoy`, `convert+dragon`, `convert+page`, `convert+queen-pulse`, `convert+rewind`, `convert+smoke`, `convert+summon-knight` |
| `twin` | 8 | 9 | `bishop-squire+twin`, `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `vanguard` | 7 | 14 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `rewind` | 7 | 13 | `become-king+rewind`, `bishop-step+rewind`, `convert+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `bishop-squire` | 7 | 12 | `bishop-squire+bishop-step`, `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+queen-pulse`, `bishop-squire+swap`, `bishop-squire+twin`, `bishop-squire+vanguard` |
| `summon-knight` | 7 | 7 | `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `freeze-ray+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `decoy` | 6 | 10 | `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+page`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `become-king` | 6 | 7 | `become-king+bishop-step`, `become-king+dragon`, `become-king+freeze-ray`, `become-king+poison-dart`, `become-king+queen-pulse`, `become-king+rewind` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `boulder` | 5 | 12 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+queen-pulse`, `boulder+summon-knight` |
| `aegis` | 4 | 8 | `aegis+bishop-step`, `aegis+dragon`, `aegis+page`, `aegis+queen-pulse` |
| `poison-dart` | 4 | 7 | `become-king+poison-dart`, `bishop-step+poison-dart`, `dragon+poison-dart`, `poison-dart+queen-pulse` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `rabies-dart` | 3 | 6 | `bishop-step+rabies-dart`, `duchess+rabies-dart`, `queen-pulse+rabies-dart` |
| `sacrifice` | 1 | 1 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 119 |
| `boulder+rewind` | 65 |
| `boulder+convert` | 61 |
| `aegis+twin` | 60 |
| `sacrifice+smoke` | 60 |
| `magnet+rewind` | 57 |
| `aegis+decoy` | 56 |
| `bishop-squire+page` | 56 |
| `freeze-ray+rabies-dart` | 56 |
| `rabies-dart+twin` | 56 |
| `rewind+smoke` | 52 |
| `become-king+vanguard` | 51 |
| `become-king+duchess` | 48 |
| `magnet+sacrifice` | 48 |
| `bishop-squire+smoke` | 47 |
| `poison-dart+rabies-dart` | 47 |
| `become-king+page` | 46 |
| `page+twin` | 45 |
| `rabies-dart+sacrifice` | 45 |
| `bishop-squire+summon-knight` | 44 |
| `aegis+bishop-squire` | 43 |
| `bishop-squire+freeze-ray` | 43 |
| `boulder+duchess` | 43 |
| `decoy+poison-dart` | 43 |
| `dragon+magnet` | 43 |
| `dragon+summon-knight` | 43 |
| `freeze-ray+sacrifice` | 43 |
| `aegis+duchess` | 42 |
| `aegis+summon-knight` | 42 |
| `decoy+duchess` | 42 |
| `freeze-ray+rewind` | 42 |
| `magnet+queen-pulse` | 42 |
| `poison-dart+summon-knight` | 42 |
| `queen-pulse+rewind` | 42 |
| `become-king+boulder` | 41 |
| `become-king+twin` | 41 |
| `boulder+page` | 41 |
| `boulder+poison-dart` | 41 |
| `boulder+rabies-dart` | 41 |
| `magnet+page` | 41 |
| `magnet+smoke` | 41 |
| `aegis+freeze-ray` | 40 |
| `aegis+poison-dart` | 40 |
| `aegis+vanguard` | 40 |
| `become-king+summon-knight` | 40 |
| `bishop-squire+sacrifice` | 40 |
| `boulder+freeze-ray` | 40 |
| `boulder+magnet` | 40 |
| `boulder+sacrifice` | 40 |
| `boulder+vanguard` | 40 |
| `convert+duchess` | 40 |
| `convert+vanguard` | 40 |
| `decoy+freeze-ray` | 40 |
| `decoy+rewind` | 40 |
| `decoy+sacrifice` | 40 |
| `dragon+rabies-dart` | 40 |
| `dragon+sacrifice` | 40 |
| `duchess+sacrifice` | 40 |
| `freeze-ray+vanguard` | 40 |
| `magnet+rabies-dart` | 40 |
| `magnet+summon-knight` | 40 |
| `page+poison-dart` | 40 |
| `page+summon-knight` | 40 |
| `poison-dart+smoke` | 40 |
| `poison-dart+twin` | 40 |
| `rabies-dart+vanguard` | 40 |
| `aegis+boulder` | 39 |
| `aegis+convert` | 39 |
| `aegis+magnet` | 39 |
| `aegis+rabies-dart` | 39 |
| `become-king+bishop-squire` | 39 |
| `become-king+convert` | 39 |
| `become-king+decoy` | 39 |
| `become-king+magnet` | 39 |
| `become-king+rabies-dart` | 39 |
| `become-king+sacrifice` | 39 |
| `bishop-squire+convert` | 39 |
| `bishop-squire+decoy` | 39 |
| `bishop-squire+dragon` | 39 |
| `bishop-squire+magnet` | 39 |
| `bishop-squire+poison-dart` | 39 |
| `bishop-squire+rabies-dart` | 39 |
| `bishop-squire+rewind` | 39 |
| `bishop-step+magnet` | 39 |
| `bishop-step+sacrifice` | 39 |
| `bishop-step+summon-knight` | 39 |
| `boulder+decoy` | 39 |
| `boulder+smoke` | 39 |
| `convert+freeze-ray` | 39 |
| `convert+magnet` | 39 |
| `convert+sacrifice` | 39 |
| `convert+twin` | 39 |
| `decoy+magnet` | 39 |
| `decoy+smoke` | 39 |
| `decoy+twin` | 39 |
| `decoy+vanguard` | 39 |
| `dragon+page` | 39 |
| `duchess+magnet` | 39 |
| `duchess+poison-dart` | 39 |
| `duchess+queen-pulse` | 39 |
| `duchess+rewind` | 39 |
| `duchess+smoke` | 39 |
| `duchess+summon-knight` | 39 |
| `freeze-ray+magnet` | 39 |
| `freeze-ray+poison-dart` | 39 |
| `magnet+poison-dart` | 39 |
| `magnet+twin` | 39 |
| `magnet+vanguard` | 39 |
| `page+queen-pulse` | 39 |
| `page+rabies-dart` | 39 |
| `page+vanguard` | 39 |
| `poison-dart+rewind` | 39 |
| `poison-dart+vanguard` | 39 |
| `queen-pulse+sacrifice` | 39 |
| `queen-pulse+summon-knight` | 39 |
| `rabies-dart+rewind` | 39 |
| `rabies-dart+smoke` | 39 |
| `rewind+vanguard` | 39 |
| `sacrifice+summon-knight` | 39 |
| `sacrifice+vanguard` | 39 |
| `smoke+vanguard` | 39 |
| `summon-knight+twin` | 39 |
| `summon-knight+vanguard` | 39 |
| `twin+vanguard` | 39 |
| `convert+rabies-dart` | 38 |
| `poison-dart+sacrifice` | 38 |
| `queen-pulse+twin` | 38 |
| `rewind+sacrifice` | 38 |
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