# Rookie's Revenge — pair synergy report

Generated 2026-11-26 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **6585** · combo-gated: **233** · solvable with no ability: 82 · every kit disqualified by one of its own cards: 4670 · a kit survived but no pair cleared: 1308 · failed the high-trial confirm: 292

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `dragon+duchess` | 13 | L6 L7 L8 L9 | 93% | 6 | 0 |
| `bishop-step+boulder` | 12 | L7 L8 L9 | 100% | 8 | 0 |
| `aegis+dragon` | 9 | L7 L8 L9 L10 | 80% | 6 | 0 |
| `boulder+dragon` | 9 | L7 L8 L9 | 77% | 7 | 0 |
| `become-king+bishop-step` | 8 | L7 L8 | 80% | 2 | 0 |
| `bishop-step+dragon` | 8 | L7 L8 L9 | 100% | 1 | 0 |
| `bishop-step+rewind` | 8 | L7 L8 L9 | 100% | 5 | 0 |
| `page+rewind` | 8 | L7 L8 L9 | 77% | 5 | 0 |
| `aegis+page` | 7 | L7 L8 L9 L10 | 80% | 4 | 0 |
| `bishop-squire+queen-pulse` | 7 | L7 L8 L9 | 77% | 4 | 0 |
| `bishop-step+rabies-dart` | 7 | L7 L8 | 97% | 1 | 0 |
| `dragon+vanguard` | 7 | L7 L8 L9 L10 | 80% | 4 | 0 |
| `freeze-ray+page` | 7 | L7 L8 L9 L10 | 80% | 5 | 0 |
| `page+smoke` | 7 | L7 L8 L9 L10 | 77% | 6 | 0 |
| `aegis+queen-pulse` | 6 | L7 L8 L9 | 80% | 5 | 0 |
| `bishop-step+freeze-ray` | 6 | L7 L8 | 100% | 3 | 0 |
| `dragon+freeze-ray` | 6 | L7 L9 L10 | 97% | 0 | 0 |
| `dragon+smoke` | 6 | L7 L8 | 80% | 1 | 0 |
| `bishop-step+convert` | 5 | L7 L8 | 77% | 2 | 0 |
| `bishop-step+decoy` | 5 | L7 L8 L9 | 93% | 1 | 0 |
| `bishop-step+smoke` | 5 | L7 L8 | 100% | 1 | 0 |
| `decoy+dragon` | 5 | L7 L8 L10 | 80% | 3 | 0 |
| `freeze-ray+queen-pulse` | 5 | L8 L9 L10 | 80% | 3 | 0 |
| `poison-dart+queen-pulse` | 5 | L7 L8 L9 | 83% | 2 | 0 |
| `queen-pulse+smoke` | 5 | L7 L9 | 77% | 4 | 0 |
| `queen-pulse+vanguard` | 5 | L7 L8 | 97% | 2 | 0 |
| `aegis+bishop-step` | 4 | L7 L8 L9 | 100% | 1 | 0 |
| `aegis+duchess` | 4 | L7 L9 | 73% | 1 | 0 |
| `become-king+queen-pulse` | 4 | L7 L8 | 67% | 2 | 0 |
| `bishop-step+duchess` | 4 | L7 | 73% | 2 | 0 |
| `bishop-step+vanguard` | 4 | L7 L8 | 100% | 2 | 0 |
| `convert+dragon` | 4 | L7 L9 L10 | 67% | 2 | 0 |
| `convert+queen-pulse` | 4 | L7 L8 L10 | 97% | 3 | 0 |
| `dragon+queen-pulse` | 4 | L7 L8 L9 | 80% | 2 | 0 |
| `duchess+freeze-ray` | 4 | L7 L9 | 97% | 1 | 0 |
| `duchess+vanguard` | 4 | L7 L8 L9 | 83% | 1 | 0 |
| `freeze-ray+twin` | 4 | L7 L8 L9 | 83% | 4 | 0 |
| `become-king+poison-dart` | 3 | L7 L8 | 73% | 1 | 0 |
| `become-king+rewind` | 3 | L7 L9 | 80% | 3 | 0 |
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-squire+twin` | 3 | L7 L8 L10 | 77% | 2 | 0 |
| `bishop-step+poison-dart` | 3 | L7 L8 | 80% | 2 | 0 |
| `boulder+queen-pulse` | 3 | L7 L8 | 77% | 2 | 0 |
| `boulder+summon-knight` | 3 | L7 L8 | 87% | 2 | 0 |
| `convert+rewind` | 3 | L7 L8 L10 | 80% | 2 | 0 |
| `convert+smoke` | 3 | L7 L8 L10 | 63% | 3 | 0 |
| `dragon+rewind` | 3 | L7 L9 | 100% | 0 | 0 |
| `dragon+summon-knight` | 3 | L7 L8 | 80% | 2 | 0 |
| `duchess+rabies-dart` | 3 | L7 L8 | 77% | 2 | 0 |
| `duchess+rewind` | 3 | L7 L8 | 80% | 2 | 0 |
| `duchess+smoke` | 3 | L7 L9 | 67% | 1 | 0 |
| `sacrifice+twin` | 3 | L7 | 80% | 3 | 0 |
| `become-king+decoy` | 2 | L8 | 67% | 0 | 0 |
| `become-king+dragon` | 2 | L7 L10 | 77% | 1 | 0 |
| `bishop-squire+bishop-step` | 2 | L9 | 80% | 2 | 0 |
| `bishop-step+page` | 2 | L7 | 63% | 2 | 0 |
| `boulder+convert` | 2 | L7 L8 | 67% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `boulder+page` | 2 | L9 L10 | 73% | 1 | 0 |
| `convert+page` | 2 | L10 | 67% | 0 | 0 |
| `decoy+duchess` | 2 | L7 L10 | 77% | 0 | 0 |
| `decoy+page` | 2 | L7 L10 | 63% | 2 | 0 |
| `decoy+queen-pulse` | 2 | L7 | 63% | 2 | 0 |
| `dragon+rabies-dart` | 2 | L8 L10 | 80% | 1 | 0 |
| `dragon+twin` | 2 | L9 | 73% | 1 | 0 |
| `duchess+page` | 2 | L7 L9 | 60% | 2 | 0 |
| `freeze-ray+summon-knight` | 2 | L7 L9 | 87% | 2 | 0 |
| `page+queen-pulse` | 2 | L7 L10 | 73% | 0 | 0 |
| `page+summon-knight` | 2 | L8 L9 | 70% | 2 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `become-king+freeze-ray` | 1 | L7 | 73% | 0 | 0 |
| `bishop-squire+convert` | 1 | L8 | 63% | 0 | 0 |
| `bishop-squire+dragon` | 1 | L7 | 77% | 1 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+freeze-ray` | 1 | L8 | 60% | 0 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-squire+vanguard` | 1 | L9 | 87% | 1 | 0 |
| `bishop-step+summon-knight` | 1 | L8 | 60% | 1 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `convert+decoy` | 1 | L7 | 63% | 0 | 0 |
| `convert+freeze-ray` | 1 | L7 | 70% | 0 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `convert+vanguard` | 1 | L10 | 67% | 1 | 0 |
| `decoy+summon-knight` | 1 | L8 | 77% | 1 | 0 |
| `dragon+poison-dart` | 1 | L9 | 63% | 1 | 0 |
| `duchess+queen-pulse` | 1 | L8 | 73% | 0 | 0 |
| `duchess+summon-knight` | 1 | L9 | 73% | 1 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `freeze-ray+knight-hop` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+smoke` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+twin` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `poison-dart+summon-knight` | 1 | L9 | 63% | 1 | 0 |
| `queen-pulse+rabies-dart` | 1 | L7 | 73% | 0 | 0 |
| `queen-pulse+summon-knight` | 1 | L7 | 60% | 1 | 0 |
| `queen-pulse+twin` | 1 | L7 | 80% | 0 | 0 |
| `rewind+summon-knight` | 1 | L7 | 93% | 0 | 0 |
| `rewind+twin` | 1 | L7 | 67% | 0 | 0 |
| `smoke+summon-knight` | 1 | L7 | 97% | 0 | 0 |
| `swap+vanguard` | 1 | L7 | 100% | 0 | 0 |

## Socket abilities — which cards show up in the most gating pairs

The card that appears in the most winning pairs is the one to build future runs around.

| ability | gating pairs it appears in | gated levels | pairs |
|---|---|---|---|
| `dragon` | 17 | 64 | `aegis+dragon`, `become-king+dragon`, `bishop-squire+dragon`, `bishop-step+dragon`, `boulder+dragon`, `convert+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+poison-dart`, `dragon+queen-pulse`, `dragon+rabies-dart`, `dragon+rewind`, `dragon+smoke`, `dragon+summon-knight`, `dragon+twin`, `dragon+vanguard` |
| `bishop-step` | 17 | 62 | `aegis+bishop-step`, `become-king+bishop-step`, `bishop-squire+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+duchess`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+poison-dart`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+summon-knight`, `bishop-step+twin`, `bishop-step+vanguard` |
| `queen-pulse` | 16 | 50 | `aegis+queen-pulse`, `become-king+queen-pulse`, `bishop-squire+queen-pulse`, `boulder+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `dragon+queen-pulse`, `duchess+queen-pulse`, `freeze-ray+queen-pulse`, `page+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+summon-knight`, `queen-pulse+twin`, `queen-pulse+vanguard` |
| `duchess` | 14 | 37 | `aegis+duchess`, `bishop-squire+duchess`, `bishop-step+duchess`, `decoy+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+page`, `duchess+queen-pulse`, `duchess+rabies-dart`, `duchess+rewind`, `duchess+smoke`, `duchess+summon-knight`, `duchess+swap`, `duchess+vanguard` |
| `summon-knight` | 13 | 17 | `bishop-step+summon-knight`, `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `dragon+summon-knight`, `duchess+summon-knight`, `freeze-ray+summon-knight`, `page+summon-knight`, `poison-dart+summon-knight`, `queen-pulse+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `convert` | 12 | 27 | `bishop-squire+convert`, `bishop-step+convert`, `boulder+convert`, `convert+decoy`, `convert+dragon`, `convert+freeze-ray`, `convert+page`, `convert+queen-pulse`, `convert+rewind`, `convert+smoke`, `convert+summon-knight`, `convert+vanguard` |
| `page` | 11 | 41 | `aegis+page`, `bishop-step+page`, `boulder+page`, `convert+page`, `decoy+page`, `duchess+page`, `freeze-ray+page`, `page+queen-pulse`, `page+rewind`, `page+smoke`, `page+summon-knight` |
| `freeze-ray` | 11 | 37 | `become-king+freeze-ray`, `bishop-squire+freeze-ray`, `bishop-step+freeze-ray`, `convert+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+queen-pulse`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `bishop-squire` | 10 | 19 | `bishop-squire+bishop-step`, `bishop-squire+convert`, `bishop-squire+dragon`, `bishop-squire+duchess`, `bishop-squire+freeze-ray`, `bishop-squire+knight-hop`, `bishop-squire+queen-pulse`, `bishop-squire+swap`, `bishop-squire+twin`, `bishop-squire+vanguard` |
| `smoke` | 9 | 31 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `duchess+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `twin` | 9 | 16 | `bishop-squire+twin`, `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `queen-pulse+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `rewind` | 8 | 29 | `become-king+rewind`, `bishop-step+rewind`, `convert+rewind`, `dragon+rewind`, `duchess+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `vanguard` | 8 | 22 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `convert+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `decoy` | 8 | 19 | `become-king+decoy`, `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+duchess`, `decoy+page`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `boulder` | 7 | 31 | `bishop-step+boulder`, `boulder+convert`, `boulder+dragon`, `boulder+knight-hop`, `boulder+page`, `boulder+queen-pulse`, `boulder+summon-knight` |
| `become-king` | 7 | 19 | `become-king+bishop-step`, `become-king+decoy`, `become-king+dragon`, `become-king+freeze-ray`, `become-king+poison-dart`, `become-king+queen-pulse`, `become-king+rewind` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `aegis` | 5 | 27 | `aegis+bishop-step`, `aegis+dragon`, `aegis+duchess`, `aegis+page`, `aegis+queen-pulse` |
| `poison-dart` | 5 | 13 | `become-king+poison-dart`, `bishop-step+poison-dart`, `dragon+poison-dart`, `poison-dart+queen-pulse`, `poison-dart+summon-knight` |
| `rabies-dart` | 4 | 13 | `bishop-step+rabies-dart`, `dragon+rabies-dart`, `duchess+rabies-dart`, `queen-pulse+rabies-dart` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `sacrifice` | 1 | 3 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 364 |
| `sacrifice+smoke` | 203 |
| `bishop-squire+page` | 200 |
| `boulder+rewind` | 200 |
| `magnet+rewind` | 197 |
| `aegis+twin` | 184 |
| `aegis+decoy` | 175 |
| `rabies-dart+twin` | 172 |
| `poison-dart+rabies-dart` | 171 |
| `become-king+duchess` | 165 |
| `become-king+page` | 154 |
| `magnet+sacrifice` | 154 |
| `bishop-squire+smoke` | 147 |
| `freeze-ray+rabies-dart` | 144 |
| `rewind+smoke` | 144 |
| `become-king+twin` | 143 |
| `bishop-squire+summon-knight` | 143 |
| `boulder+duchess` | 143 |
| `decoy+poison-dart` | 142 |
| `duchess+sacrifice` | 142 |
| `freeze-ray+sacrifice` | 142 |
| `become-king+summon-knight` | 141 |
| `become-king+vanguard` | 140 |
| `bishop-squire+magnet` | 139 |
| `poison-dart+rewind` | 139 |
| `rabies-dart+sacrifice` | 139 |
| `aegis+summon-knight` | 138 |
| `dragon+magnet` | 137 |
| `magnet+rabies-dart` | 137 |
| `aegis+bishop-squire` | 136 |
| `boulder+sacrifice` | 136 |
| `duchess+magnet` | 135 |
| `convert+twin` | 134 |
| `freeze-ray+magnet` | 133 |
| `magnet+smoke` | 133 |
| `poison-dart+smoke` | 133 |
| `rabies-dart+vanguard` | 133 |
| `convert+rabies-dart` | 132 |
| `page+twin` | 132 |
| `bishop-squire+sacrifice` | 131 |
| `boulder+magnet` | 131 |
| `convert+duchess` | 131 |
| `decoy+smoke` | 131 |
| `decoy+twin` | 131 |
| `freeze-ray+rewind` | 131 |
| `magnet+page` | 131 |
| `magnet+queen-pulse` | 131 |
| `page+poison-dart` | 131 |
| `sacrifice+vanguard` | 131 |
| `summon-knight+vanguard` | 131 |
| `aegis+magnet` | 130 |
| `aegis+poison-dart` | 130 |
| `become-king+bishop-squire` | 130 |
| `become-king+magnet` | 130 |
| `bishop-squire+decoy` | 130 |
| `bishop-squire+poison-dart` | 130 |
| `bishop-squire+rabies-dart` | 130 |
| `bishop-squire+rewind` | 130 |
| `bishop-step+magnet` | 130 |
| `boulder+decoy` | 130 |
| `boulder+freeze-ray` | 130 |
| `boulder+poison-dart` | 130 |
| `boulder+smoke` | 130 |
| `boulder+vanguard` | 130 |
| `convert+sacrifice` | 130 |
| `decoy+freeze-ray` | 130 |
| `dragon+sacrifice` | 130 |
| `freeze-ray+vanguard` | 130 |
| `magnet+poison-dart` | 130 |
| `magnet+summon-knight` | 130 |
| `magnet+twin` | 130 |
| `magnet+vanguard` | 130 |
| `page+rabies-dart` | 130 |
| `page+vanguard` | 130 |
| `poison-dart+sacrifice` | 130 |
| `poison-dart+twin` | 130 |
| `poison-dart+vanguard` | 130 |
| `queen-pulse+sacrifice` | 130 |
| `rabies-dart+smoke` | 130 |
| `rewind+vanguard` | 130 |
| `sacrifice+summon-knight` | 130 |
| `smoke+vanguard` | 130 |
| `aegis+boulder` | 129 |
| `aegis+convert` | 129 |
| `aegis+freeze-ray` | 129 |
| `aegis+rabies-dart` | 129 |
| `aegis+vanguard` | 129 |
| `become-king+boulder` | 129 |
| `become-king+convert` | 129 |
| `become-king+rabies-dart` | 129 |
| `become-king+sacrifice` | 129 |
| `bishop-step+sacrifice` | 129 |
| `boulder+rabies-dart` | 129 |
| `convert+magnet` | 129 |
| `decoy+magnet` | 129 |
| `decoy+rewind` | 129 |
| `decoy+sacrifice` | 129 |
| `decoy+vanguard` | 129 |
| `dragon+page` | 129 |
| `duchess+poison-dart` | 129 |
| `freeze-ray+poison-dart` | 129 |
| `queen-pulse+rewind` | 129 |
| `rabies-dart+rewind` | 129 |
| `rewind+sacrifice` | 129 |
| `summon-knight+twin` | 129 |
| `twin+vanguard` | 129 |
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