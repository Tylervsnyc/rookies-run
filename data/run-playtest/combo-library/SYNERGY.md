# Rookie's Revenge — pair synergy report

Generated 2026-11-15 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **5582** · combo-gated: **190** · solvable with no ability: 80 · every kit disqualified by one of its own cards: 3955 · a kit survived but no pair cleared: 1109 · failed the high-trial confirm: 248

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-step+boulder` | 10 | L7 L8 L9 | 100% | 7 | 0 |
| `dragon+duchess` | 10 | L6 L7 L8 L9 | 93% | 5 | 0 |
| `bishop-step+dragon` | 8 | L7 L8 L9 | 100% | 1 | 0 |
| `bishop-step+rewind` | 8 | L7 L8 L9 | 100% | 5 | 0 |
| `aegis+dragon` | 7 | L7 L8 L9 L10 | 80% | 5 | 0 |
| `aegis+page` | 7 | L7 L8 L9 L10 | 80% | 4 | 0 |
| `bishop-step+rabies-dart` | 7 | L7 L8 | 97% | 1 | 0 |
| `boulder+dragon` | 7 | L7 L8 L9 | 73% | 5 | 0 |
| `page+rewind` | 7 | L7 L8 L9 | 77% | 4 | 0 |
| `become-king+bishop-step` | 6 | L7 L8 | 80% | 1 | 0 |
| `bishop-squire+queen-pulse` | 6 | L7 L8 L9 | 77% | 3 | 0 |
| `dragon+vanguard` | 6 | L7 L8 L9 L10 | 77% | 4 | 0 |
| `bishop-step+convert` | 5 | L7 L8 | 77% | 2 | 0 |
| `bishop-step+freeze-ray` | 5 | L7 L8 | 100% | 2 | 0 |
| `bishop-step+smoke` | 5 | L7 L8 | 100% | 1 | 0 |
| `decoy+dragon` | 5 | L7 L8 L10 | 80% | 3 | 0 |
| `dragon+smoke` | 5 | L7 L8 | 80% | 1 | 0 |
| `freeze-ray+page` | 5 | L7 L8 L9 L10 | 80% | 3 | 0 |
| `freeze-ray+queen-pulse` | 5 | L8 L9 L10 | 80% | 3 | 0 |
| `page+smoke` | 5 | L7 L8 L9 | 77% | 5 | 0 |
| `bishop-step+decoy` | 4 | L7 L8 L9 | 93% | 1 | 0 |
| `bishop-step+duchess` | 4 | L7 | 73% | 2 | 0 |
| `dragon+freeze-ray` | 4 | L7 L9 L10 | 97% | 0 | 0 |
| `duchess+freeze-ray` | 4 | L7 L9 | 97% | 1 | 0 |
| `duchess+vanguard` | 4 | L7 L8 L9 | 83% | 1 | 0 |
| `poison-dart+queen-pulse` | 4 | L8 L9 | 83% | 2 | 0 |
| `queen-pulse+smoke` | 4 | L7 L9 | 77% | 3 | 0 |
| `queen-pulse+vanguard` | 4 | L7 L8 | 97% | 2 | 0 |
| `aegis+bishop-step` | 3 | L7 L8 L9 | 100% | 1 | 0 |
| `aegis+duchess` | 3 | L7 L9 | 73% | 0 | 0 |
| `aegis+queen-pulse` | 3 | L7 L8 | 80% | 3 | 0 |
| `become-king+poison-dart` | 3 | L7 L8 | 73% | 1 | 0 |
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-squire+twin` | 3 | L7 L8 L10 | 77% | 2 | 0 |
| `bishop-step+vanguard` | 3 | L7 L8 | 100% | 1 | 0 |
| `boulder+summon-knight` | 3 | L7 L8 | 87% | 2 | 0 |
| `convert+dragon` | 3 | L7 L9 L10 | 67% | 1 | 0 |
| `convert+rewind` | 3 | L7 L8 L10 | 80% | 2 | 0 |
| `convert+smoke` | 3 | L7 L8 L10 | 63% | 3 | 0 |
| `duchess+rabies-dart` | 3 | L7 L8 | 77% | 2 | 0 |
| `duchess+rewind` | 3 | L7 L8 | 80% | 2 | 0 |
| `duchess+smoke` | 3 | L7 L9 | 67% | 1 | 0 |
| `freeze-ray+twin` | 3 | L7 L8 | 83% | 3 | 0 |
| `sacrifice+twin` | 3 | L7 | 80% | 3 | 0 |
| `become-king+decoy` | 2 | L8 | 67% | 0 | 0 |
| `become-king+queen-pulse` | 2 | L7 L8 | 63% | 1 | 0 |
| `bishop-squire+bishop-step` | 2 | L9 | 80% | 2 | 0 |
| `bishop-step+page` | 2 | L7 | 63% | 2 | 0 |
| `bishop-step+poison-dart` | 2 | L7 | 80% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `boulder+page` | 2 | L9 L10 | 73% | 1 | 0 |
| `boulder+queen-pulse` | 2 | L8 | 77% | 1 | 0 |
| `convert+queen-pulse` | 2 | L7 L8 | 97% | 1 | 0 |
| `decoy+duchess` | 2 | L7 L10 | 77% | 0 | 0 |
| `decoy+queen-pulse` | 2 | L7 | 63% | 2 | 0 |
| `dragon+summon-knight` | 2 | L7 L8 | 80% | 2 | 0 |
| `dragon+twin` | 2 | L9 | 73% | 1 | 0 |
| `duchess+page` | 2 | L7 L9 | 60% | 2 | 0 |
| `freeze-ray+summon-knight` | 2 | L7 L9 | 87% | 2 | 0 |
| `page+summon-knight` | 2 | L8 L9 | 70% | 2 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `become-king+dragon` | 1 | L7 | 77% | 0 | 0 |
| `become-king+freeze-ray` | 1 | L7 | 73% | 0 | 0 |
| `become-king+rewind` | 1 | L7 | 77% | 1 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-squire+vanguard` | 1 | L9 | 87% | 1 | 0 |
| `bishop-step+summon-knight` | 1 | L8 | 60% | 1 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `boulder+convert` | 1 | L7 | 67% | 1 | 0 |
| `convert+decoy` | 1 | L7 | 63% | 0 | 0 |
| `convert+freeze-ray` | 1 | L7 | 70% | 0 | 0 |
| `convert+page` | 1 | L10 | 63% | 0 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `convert+vanguard` | 1 | L10 | 67% | 1 | 0 |
| `decoy+page` | 1 | L7 | 63% | 1 | 0 |
| `decoy+summon-knight` | 1 | L8 | 77% | 1 | 0 |
| `dragon+poison-dart` | 1 | L9 | 63% | 1 | 0 |
| `dragon+queen-pulse` | 1 | L8 | 80% | 1 | 0 |
| `dragon+rabies-dart` | 1 | L10 | 67% | 0 | 0 |
| `dragon+rewind` | 1 | L9 | 100% | 0 | 0 |
| `duchess+queen-pulse` | 1 | L8 | 73% | 0 | 0 |
| `duchess+summon-knight` | 1 | L9 | 73% | 1 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `freeze-ray+knight-hop` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+smoke` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+twin` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `page+queen-pulse` | 1 | L10 | 73% | 0 | 0 |
| `queen-pulse+rabies-dart` | 1 | L7 | 73% | 0 | 0 |
| `queen-pulse+summon-knight` | 1 | L7 | 60% | 1 | 0 |
| `rewind+summon-knight` | 1 | L7 | 93% | 0 | 0 |
| `rewind+twin` | 1 | L7 | 67% | 0 | 0 |
| `smoke+summon-knight` | 1 | L7 | 97% | 0 | 0 |
| `swap+vanguard` | 1 | L7 | 100% | 0 | 0 |

## Socket abilities — which cards show up in the most gating pairs

The card that appears in the most winning pairs is the one to build future runs around.

| ability | gating pairs it appears in | gated levels | pairs |
|---|---|---|---|
| `bishop-step` | 17 | 54 | `aegis+bishop-step`, `become-king+bishop-step`, `bishop-squire+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+duchess`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+poison-dart`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+summon-knight`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 16 | 49 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `convert+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+poison-dart`, `dragon+queen-pulse`, `dragon+rabies-dart`, `dragon+rewind`, `dragon+smoke`, `dragon+summon-knight`, `dragon+twin`, `dragon+vanguard` |
| `queen-pulse` | 15 | 35 | `aegis+queen-pulse`, `become-king+queen-pulse`, `bishop-squire+queen-pulse`, `boulder+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `dragon+queen-pulse`, `duchess+queen-pulse`, `freeze-ray+queen-pulse`, `page+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+summon-knight`, `queen-pulse+vanguard` |
| `duchess` | 14 | 33 | `aegis+duchess`, `bishop-squire+duchess`, `bishop-step+duchess`, `decoy+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+page`, `duchess+queen-pulse`, `duchess+rabies-dart`, `duchess+rewind`, `duchess+smoke`, `duchess+summon-knight`, `duchess+swap`, `duchess+vanguard` |
| `summon-knight` | 12 | 15 | `bishop-step+summon-knight`, `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `dragon+summon-knight`, `duchess+summon-knight`, `freeze-ray+summon-knight`, `page+summon-knight`, `queen-pulse+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `page` | 11 | 34 | `aegis+page`, `bishop-step+page`, `boulder+page`, `convert+page`, `decoy+page`, `duchess+page`, `freeze-ray+page`, `page+queen-pulse`, `page+rewind`, `page+smoke`, `page+summon-knight` |
| `convert` | 11 | 21 | `bishop-step+convert`, `boulder+convert`, `convert+decoy`, `convert+dragon`, `convert+freeze-ray`, `convert+page`, `convert+queen-pulse`, `convert+rewind`, `convert+smoke`, `convert+summon-knight`, `convert+vanguard` |
| `freeze-ray` | 10 | 30 | `become-king+freeze-ray`, `bishop-step+freeze-ray`, `convert+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+queen-pulse`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `smoke` | 9 | 27 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `duchess+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `rewind` | 8 | 24 | `become-king+rewind`, `bishop-step+rewind`, `convert+rewind`, `dragon+rewind`, `duchess+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `vanguard` | 8 | 19 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `convert+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `decoy` | 8 | 17 | `become-king+decoy`, `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+duchess`, `decoy+page`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `twin` | 8 | 14 | `bishop-squire+twin`, `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `boulder` | 7 | 26 | `bishop-step+boulder`, `boulder+convert`, `boulder+dragon`, `boulder+knight-hop`, `boulder+page`, `boulder+queen-pulse`, `boulder+summon-knight` |
| `bishop-squire` | 7 | 16 | `bishop-squire+bishop-step`, `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+queen-pulse`, `bishop-squire+swap`, `bishop-squire+twin`, `bishop-squire+vanguard` |
| `become-king` | 7 | 13 | `become-king+bishop-step`, `become-king+decoy`, `become-king+dragon`, `become-king+freeze-ray`, `become-king+poison-dart`, `become-king+queen-pulse`, `become-king+rewind` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `aegis` | 5 | 20 | `aegis+bishop-step`, `aegis+dragon`, `aegis+duchess`, `aegis+page`, `aegis+queen-pulse` |
| `rabies-dart` | 4 | 12 | `bishop-step+rabies-dart`, `dragon+rabies-dart`, `duchess+rabies-dart`, `queen-pulse+rabies-dart` |
| `poison-dart` | 4 | 10 | `become-king+poison-dart`, `bishop-step+poison-dart`, `dragon+poison-dart`, `poison-dart+queen-pulse` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `sacrifice` | 1 | 3 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 306 |
| `boulder+rewind` | 170 |
| `bishop-squire+page` | 167 |
| `sacrifice+smoke` | 167 |
| `magnet+rewind` | 160 |
| `aegis+twin` | 153 |
| `rabies-dart+twin` | 149 |
| `aegis+decoy` | 145 |
| `become-king+duchess` | 138 |
| `poison-dart+rabies-dart` | 135 |
| `become-king+page` | 132 |
| `poison-dart+summon-knight` | 130 |
| `freeze-ray+rabies-dart` | 128 |
| `rewind+smoke` | 128 |
| `duchess+sacrifice` | 127 |
| `bishop-squire+smoke` | 124 |
| `magnet+sacrifice` | 124 |
| `decoy+poison-dart` | 121 |
| `become-king+vanguard` | 120 |
| `become-king+twin` | 119 |
| `bishop-squire+summon-knight` | 119 |
| `boulder+duchess` | 119 |
| `magnet+rabies-dart` | 118 |
| `poison-dart+rewind` | 118 |
| `become-king+summon-knight` | 117 |
| `aegis+summon-knight` | 116 |
| `freeze-ray+sacrifice` | 116 |
| `rabies-dart+sacrifice` | 116 |
| `aegis+bishop-squire` | 115 |
| `rabies-dart+vanguard` | 115 |
| `bishop-squire+magnet` | 114 |
| `aegis+vanguard` | 113 |
| `magnet+twin` | 113 |
| `convert+twin` | 112 |
| `dragon+magnet` | 112 |
| `bishop-squire+convert` | 111 |
| `bishop-squire+freeze-ray` | 111 |
| `bishop-squire+poison-dart` | 111 |
| `boulder+freeze-ray` | 111 |
| `boulder+vanguard` | 111 |
| `freeze-ray+poison-dart` | 111 |
| `page+poison-dart` | 111 |
| `rewind+sacrifice` | 111 |
| `aegis+boulder` | 110 |
| `aegis+magnet` | 110 |
| `become-king+magnet` | 110 |
| `bishop-squire+decoy` | 110 |
| `bishop-squire+rabies-dart` | 110 |
| `bishop-squire+rewind` | 110 |
| `bishop-squire+sacrifice` | 110 |
| `bishop-step+magnet` | 110 |
| `bishop-step+sacrifice` | 110 |
| `boulder+magnet` | 110 |
| `boulder+rabies-dart` | 110 |
| `boulder+smoke` | 110 |
| `decoy+twin` | 110 |
| `dragon+page` | 110 |
| `dragon+sacrifice` | 110 |
| `duchess+magnet` | 110 |
| `freeze-ray+vanguard` | 110 |
| `magnet+page` | 110 |
| `magnet+poison-dart` | 110 |
| `magnet+queen-pulse` | 110 |
| `magnet+smoke` | 110 |
| `magnet+summon-knight` | 110 |
| `page+rabies-dart` | 110 |
| `poison-dart+smoke` | 110 |
| `poison-dart+vanguard` | 110 |
| `queen-pulse+rewind` | 110 |
| `rabies-dart+rewind` | 110 |
| `rabies-dart+smoke` | 110 |
| `rewind+vanguard` | 110 |
| `sacrifice+summon-knight` | 110 |
| `sacrifice+vanguard` | 110 |
| `aegis+convert` | 109 |
| `aegis+freeze-ray` | 109 |
| `aegis+poison-dart` | 109 |
| `aegis+rabies-dart` | 109 |
| `become-king+bishop-squire` | 109 |
| `become-king+boulder` | 109 |
| `become-king+convert` | 109 |
| `become-king+rabies-dart` | 109 |
| `become-king+sacrifice` | 109 |
| `boulder+decoy` | 109 |
| `boulder+poison-dart` | 109 |
| `boulder+sacrifice` | 109 |
| `convert+duchess` | 109 |
| `convert+magnet` | 109 |
| `convert+rabies-dart` | 109 |
| `convert+sacrifice` | 109 |
| `decoy+freeze-ray` | 109 |
| `decoy+magnet` | 109 |
| `decoy+rewind` | 109 |
| `decoy+sacrifice` | 109 |
| `decoy+smoke` | 109 |
| `decoy+vanguard` | 109 |
| `duchess+poison-dart` | 109 |
| `freeze-ray+magnet` | 109 |
| `freeze-ray+rewind` | 109 |
| `magnet+vanguard` | 109 |
| `page+twin` | 109 |
| `page+vanguard` | 109 |
| `poison-dart+sacrifice` | 109 |
| `poison-dart+twin` | 109 |
| `queen-pulse+twin` | 109 |
| `smoke+vanguard` | 109 |
| `summon-knight+twin` | 109 |
| `summon-knight+vanguard` | 109 |
| `twin+vanguard` | 109 |
| `bishop-squire+dragon` | 108 |
| `queen-pulse+sacrifice` | 108 |
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