# Rookie's Revenge — pair synergy report

Generated 2026-10-12 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **3068** · combo-gated: **124** · solvable with no ability: 75 · every kit disqualified by one of its own cards: 2133 · a kit survived but no pair cleared: 610 · failed the high-trial confirm: 126

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-step+dragon` | 7 | L7 L9 | 100% | 1 | 0 |
| `aegis+dragon` | 6 | L7 L8 L9 L10 | 80% | 5 | 0 |
| `bishop-squire+queen-pulse` | 6 | L7 L8 L9 | 77% | 3 | 0 |
| `bishop-step+rabies-dart` | 6 | L7 L8 | 97% | 1 | 0 |
| `bishop-step+rewind` | 6 | L7 L8 L9 | 100% | 3 | 0 |
| `dragon+duchess` | 6 | L6 L7 L8 L9 | 93% | 3 | 0 |
| `bishop-step+boulder` | 5 | L7 L8 L9 | 100% | 2 | 0 |
| `page+rewind` | 5 | L7 L8 | 77% | 2 | 0 |
| `aegis+page` | 4 | L7 L8 L9 | 80% | 2 | 0 |
| `become-king+bishop-step` | 4 | L7 L8 | 80% | 0 | 0 |
| `bishop-step+decoy` | 4 | L7 L8 L9 | 93% | 1 | 0 |
| `bishop-step+freeze-ray` | 4 | L7 L8 | 100% | 1 | 0 |
| `bishop-step+smoke` | 4 | L7 L8 | 100% | 0 | 0 |
| `boulder+dragon` | 4 | L7 L8 L9 | 73% | 2 | 0 |
| `decoy+dragon` | 4 | L7 L8 | 80% | 3 | 0 |
| `dragon+vanguard` | 4 | L8 L9 L10 | 77% | 4 | 0 |
| `page+smoke` | 4 | L7 L9 | 77% | 4 | 0 |
| `poison-dart+queen-pulse` | 4 | L8 L9 | 83% | 2 | 0 |
| `queen-pulse+vanguard` | 4 | L7 L8 | 97% | 2 | 0 |
| `become-king+poison-dart` | 3 | L7 L8 | 73% | 1 | 0 |
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-step+convert` | 3 | L7 | 77% | 0 | 0 |
| `bishop-step+vanguard` | 3 | L7 L8 | 100% | 1 | 0 |
| `boulder+summon-knight` | 3 | L7 L8 | 87% | 2 | 0 |
| `convert+smoke` | 3 | L7 L8 L10 | 63% | 3 | 0 |
| `dragon+freeze-ray` | 3 | L7 L9 | 97% | 0 | 0 |
| `dragon+smoke` | 3 | L7 L8 | 80% | 0 | 0 |
| `duchess+vanguard` | 3 | L8 L9 | 83% | 1 | 0 |
| `freeze-ray+queen-pulse` | 3 | L8 L9 L10 | 80% | 1 | 0 |
| `queen-pulse+smoke` | 3 | L7 L9 | 70% | 2 | 0 |
| `aegis+bishop-step` | 2 | L8 L9 | 100% | 0 | 0 |
| `become-king+decoy` | 2 | L8 | 67% | 0 | 0 |
| `bishop-squire+bishop-step` | 2 | L9 | 80% | 2 | 0 |
| `bishop-squire+twin` | 2 | L7 L8 | 77% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `boulder+queen-pulse` | 2 | L8 | 77% | 1 | 0 |
| `decoy+queen-pulse` | 2 | L7 | 63% | 2 | 0 |
| `duchess+freeze-ray` | 2 | L7 L9 | 97% | 0 | 0 |
| `duchess+rabies-dart` | 2 | L7 L8 | 77% | 1 | 0 |
| `duchess+smoke` | 2 | L9 | 67% | 1 | 0 |
| `freeze-ray+page` | 2 | L8 L10 | 80% | 1 | 0 |
| `freeze-ray+twin` | 2 | L7 L8 | 83% | 2 | 0 |
| `sacrifice+twin` | 2 | L7 | 80% | 2 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `aegis+duchess` | 1 | L9 | 63% | 0 | 0 |
| `aegis+queen-pulse` | 1 | L8 | 67% | 1 | 0 |
| `become-king+dragon` | 1 | L7 | 77% | 0 | 0 |
| `become-king+freeze-ray` | 1 | L7 | 73% | 0 | 0 |
| `become-king+queen-pulse` | 1 | L8 | 60% | 1 | 0 |
| `become-king+rewind` | 1 | L7 | 77% | 1 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-squire+vanguard` | 1 | L9 | 87% | 1 | 0 |
| `bishop-step+duchess` | 1 | L7 | 73% | 0 | 0 |
| `bishop-step+page` | 1 | L7 | 60% | 1 | 0 |
| `bishop-step+poison-dart` | 1 | L7 | 70% | 0 | 0 |
| `bishop-step+summon-knight` | 1 | L8 | 60% | 1 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `boulder+page` | 1 | L10 | 70% | 1 | 0 |
| `convert+decoy` | 1 | L7 | 63% | 0 | 0 |
| `convert+dragon` | 1 | L9 | 63% | 0 | 0 |
| `convert+page` | 1 | L10 | 63% | 0 | 0 |
| `convert+queen-pulse` | 1 | L7 | 97% | 0 | 0 |
| `convert+rewind` | 1 | L7 | 63% | 0 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `decoy+page` | 1 | L7 | 63% | 1 | 0 |
| `decoy+summon-knight` | 1 | L8 | 77% | 1 | 0 |
| `dragon+poison-dart` | 1 | L9 | 63% | 1 | 0 |
| `dragon+queen-pulse` | 1 | L8 | 80% | 1 | 0 |
| `dragon+rewind` | 1 | L9 | 100% | 0 | 0 |
| `dragon+summon-knight` | 1 | L7 | 80% | 1 | 0 |
| `dragon+twin` | 1 | L9 | 73% | 0 | 0 |
| `duchess+page` | 1 | L7 | 60% | 1 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `freeze-ray+knight-hop` | 1 | L7 | 100% | 0 | 0 |
| `freeze-ray+summon-knight` | 1 | L9 | 87% | 1 | 0 |
| `knight-hop+smoke` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+twin` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `page+summon-knight` | 1 | L9 | 60% | 1 | 0 |
| `queen-pulse+rabies-dart` | 1 | L7 | 73% | 0 | 0 |
| `rewind+summon-knight` | 1 | L7 | 93% | 0 | 0 |
| `rewind+twin` | 1 | L7 | 67% | 0 | 0 |
| `smoke+summon-knight` | 1 | L7 | 97% | 0 | 0 |
| `swap+vanguard` | 1 | L7 | 100% | 0 | 0 |

## Socket abilities — which cards show up in the most gating pairs

The card that appears in the most winning pairs is the one to build future runs around.

| ability | gating pairs it appears in | gated levels | pairs |
|---|---|---|---|
| `bishop-step` | 17 | 34 | `aegis+bishop-step`, `become-king+bishop-step`, `bishop-squire+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+duchess`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+poison-dart`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+summon-knight`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 15 | 33 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `convert+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+poison-dart`, `dragon+queen-pulse`, `dragon+rewind`, `dragon+smoke`, `dragon+summon-knight`, `dragon+twin`, `dragon+vanguard` |
| `queen-pulse` | 12 | 25 | `aegis+queen-pulse`, `become-king+queen-pulse`, `bishop-squire+queen-pulse`, `boulder+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `dragon+queen-pulse`, `freeze-ray+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+vanguard` |
| `page` | 10 | 21 | `aegis+page`, `bishop-step+page`, `boulder+page`, `convert+page`, `decoy+page`, `duchess+page`, `freeze-ray+page`, `page+rewind`, `page+smoke`, `page+summon-knight` |
| `duchess` | 10 | 16 | `aegis+duchess`, `bishop-squire+duchess`, `bishop-step+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+page`, `duchess+rabies-dart`, `duchess+smoke`, `duchess+swap`, `duchess+vanguard` |
| `summon-knight` | 10 | 10 | `bishop-step+summon-knight`, `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `dragon+summon-knight`, `freeze-ray+summon-knight`, `page+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `smoke` | 9 | 21 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `duchess+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `freeze-ray` | 9 | 18 | `become-king+freeze-ray`, `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+queen-pulse`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `convert` | 8 | 11 | `bishop-step+convert`, `convert+decoy`, `convert+dragon`, `convert+page`, `convert+queen-pulse`, `convert+rewind`, `convert+smoke`, `convert+summon-knight` |
| `twin` | 8 | 10 | `bishop-squire+twin`, `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `vanguard` | 7 | 16 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `decoy` | 7 | 15 | `become-king+decoy`, `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+page`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `rewind` | 7 | 15 | `become-king+rewind`, `bishop-step+rewind`, `convert+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `bishop-squire` | 7 | 15 | `bishop-squire+bishop-step`, `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+queen-pulse`, `bishop-squire+swap`, `bishop-squire+twin`, `bishop-squire+vanguard` |
| `become-king` | 7 | 11 | `become-king+bishop-step`, `become-king+decoy`, `become-king+dragon`, `become-king+freeze-ray`, `become-king+poison-dart`, `become-king+queen-pulse`, `become-king+rewind` |
| `boulder` | 6 | 16 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+page`, `boulder+queen-pulse`, `boulder+summon-knight` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `aegis` | 5 | 12 | `aegis+bishop-step`, `aegis+dragon`, `aegis+duchess`, `aegis+page`, `aegis+queen-pulse` |
| `poison-dart` | 4 | 9 | `become-king+poison-dart`, `bishop-step+poison-dart`, `dragon+poison-dart`, `poison-dart+queen-pulse` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `rabies-dart` | 3 | 9 | `bishop-step+rabies-dart`, `duchess+rabies-dart`, `queen-pulse+rabies-dart` |
| `sacrifice` | 1 | 2 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 172 |
| `boulder+rewind` | 100 |
| `sacrifice+smoke` | 93 |
| `aegis+twin` | 89 |
| `boulder+convert` | 89 |
| `magnet+rewind` | 86 |
| `rabies-dart+twin` | 85 |
| `become-king+duchess` | 83 |
| `bishop-squire+page` | 83 |
| `freeze-ray+rabies-dart` | 80 |
| `aegis+decoy` | 78 |
| `poison-dart+rabies-dart` | 75 |
| `magnet+sacrifice` | 73 |
| `duchess+sacrifice` | 72 |
| `poison-dart+summon-knight` | 72 |
| `smoke+vanguard` | 70 |
| `become-king+page` | 69 |
| `bishop-squire+summon-knight` | 69 |
| `bishop-squire+rabies-dart` | 68 |
| `magnet+rabies-dart` | 68 |
| `queen-pulse+rewind` | 68 |
| `rewind+smoke` | 68 |
| `bishop-squire+smoke` | 67 |
| `become-king+vanguard` | 66 |
| `bishop-squire+freeze-ray` | 65 |
| `convert+twin` | 65 |
| `page+twin` | 65 |
| `boulder+poison-dart` | 64 |
| `decoy+freeze-ray` | 64 |
| `freeze-ray+sacrifice` | 64 |
| `magnet+summon-knight` | 64 |
| `boulder+duchess` | 63 |
| `convert+vanguard` | 63 |
| `decoy+duchess` | 63 |
| `decoy+twin` | 63 |
| `duchess+magnet` | 63 |
| `poison-dart+rewind` | 63 |
| `poison-dart+sacrifice` | 63 |
| `poison-dart+smoke` | 63 |
| `aegis+bishop-squire` | 62 |
| `bishop-squire+rewind` | 62 |
| `dragon+magnet` | 62 |
| `dragon+rabies-dart` | 62 |
| `duchess+poison-dart` | 62 |
| `freeze-ray+vanguard` | 62 |
| `magnet+page` | 62 |
| `magnet+vanguard` | 62 |
| `page+rabies-dart` | 62 |
| `rabies-dart+sacrifice` | 62 |
| `rabies-dart+smoke` | 62 |
| `twin+vanguard` | 62 |
| `aegis+magnet` | 61 |
| `aegis+summon-knight` | 61 |
| `aegis+vanguard` | 61 |
| `become-king+bishop-squire` | 61 |
| `become-king+boulder` | 61 |
| `become-king+magnet` | 61 |
| `become-king+rabies-dart` | 61 |
| `become-king+summon-knight` | 61 |
| `become-king+twin` | 61 |
| `bishop-squire+convert` | 61 |
| `bishop-squire+decoy` | 61 |
| `bishop-squire+magnet` | 61 |
| `bishop-squire+poison-dart` | 61 |
| `bishop-squire+sacrifice` | 61 |
| `bishop-step+magnet` | 61 |
| `bishop-step+sacrifice` | 61 |
| `boulder+decoy` | 61 |
| `boulder+freeze-ray` | 61 |
| `boulder+magnet` | 61 |
| `boulder+rabies-dart` | 61 |
| `boulder+sacrifice` | 61 |
| `boulder+smoke` | 61 |
| `convert+freeze-ray` | 61 |
| `convert+magnet` | 61 |
| `convert+sacrifice` | 61 |
| `decoy+magnet` | 61 |
| `decoy+poison-dart` | 61 |
| `decoy+rewind` | 61 |
| `decoy+smoke` | 61 |
| `decoy+vanguard` | 61 |
| `dragon+sacrifice` | 61 |
| `duchess+queen-pulse` | 61 |
| `duchess+rewind` | 61 |
| `freeze-ray+magnet` | 61 |
| `freeze-ray+rewind` | 61 |
| `magnet+poison-dart` | 61 |
| `magnet+queen-pulse` | 61 |
| `magnet+smoke` | 61 |
| `magnet+twin` | 61 |
| `page+poison-dart` | 61 |
| `poison-dart+twin` | 61 |
| `poison-dart+vanguard` | 61 |
| `queen-pulse+sacrifice` | 61 |
| `queen-pulse+summon-knight` | 61 |
| `rabies-dart+vanguard` | 61 |
| `rewind+vanguard` | 61 |
| `sacrifice+summon-knight` | 61 |
| `sacrifice+vanguard` | 61 |
| `summon-knight+vanguard` | 61 |
| `aegis+boulder` | 60 |
| `aegis+convert` | 60 |
| `aegis+freeze-ray` | 60 |
| `aegis+poison-dart` | 60 |
| `aegis+rabies-dart` | 60 |
| `become-king+convert` | 60 |
| `become-king+sacrifice` | 60 |
| `bishop-squire+dragon` | 60 |
| `boulder+vanguard` | 60 |
| `convert+duchess` | 60 |
| `convert+rabies-dart` | 60 |
| `decoy+sacrifice` | 60 |
| `dragon+page` | 60 |
| `duchess+summon-knight` | 60 |
| `freeze-ray+poison-dart` | 60 |
| `page+queen-pulse` | 60 |
| `page+vanguard` | 60 |
| `queen-pulse+twin` | 60 |
| `rabies-dart+rewind` | 60 |
| `rewind+sacrifice` | 60 |
| `summon-knight+twin` | 60 |
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