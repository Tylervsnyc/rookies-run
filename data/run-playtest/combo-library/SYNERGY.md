# Rookie's Revenge — pair synergy report

Generated 2026-10-27 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **4173** · combo-gated: **155** · solvable with no ability: 80 · every kit disqualified by one of its own cards: 2927 · a kit survived but no pair cleared: 830 · failed the high-trial confirm: 181

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-step+boulder` | 9 | L7 L8 L9 | 100% | 6 | 0 |
| `dragon+duchess` | 9 | L6 L7 L8 L9 | 93% | 4 | 0 |
| `bishop-step+dragon` | 8 | L7 L8 L9 | 100% | 1 | 0 |
| `aegis+dragon` | 7 | L7 L8 L9 L10 | 80% | 5 | 0 |
| `bishop-step+rabies-dart` | 7 | L7 L8 | 97% | 1 | 0 |
| `bishop-step+rewind` | 7 | L7 L8 L9 | 100% | 4 | 0 |
| `bishop-squire+queen-pulse` | 6 | L7 L8 L9 | 77% | 3 | 0 |
| `boulder+dragon` | 6 | L7 L8 L9 | 73% | 4 | 0 |
| `dragon+vanguard` | 6 | L7 L8 L9 L10 | 77% | 4 | 0 |
| `aegis+page` | 5 | L7 L8 L9 L10 | 80% | 3 | 0 |
| `bishop-step+smoke` | 5 | L7 L8 | 100% | 1 | 0 |
| `decoy+dragon` | 5 | L7 L8 L10 | 80% | 3 | 0 |
| `page+rewind` | 5 | L7 L8 | 77% | 2 | 0 |
| `become-king+bishop-step` | 4 | L7 L8 | 80% | 0 | 0 |
| `bishop-step+decoy` | 4 | L7 L8 L9 | 93% | 1 | 0 |
| `bishop-step+freeze-ray` | 4 | L7 L8 | 100% | 1 | 0 |
| `dragon+freeze-ray` | 4 | L7 L9 L10 | 97% | 0 | 0 |
| `dragon+smoke` | 4 | L7 L8 | 80% | 0 | 0 |
| `duchess+vanguard` | 4 | L7 L8 L9 | 83% | 1 | 0 |
| `freeze-ray+queen-pulse` | 4 | L8 L9 L10 | 80% | 2 | 0 |
| `page+smoke` | 4 | L7 L9 | 77% | 4 | 0 |
| `poison-dart+queen-pulse` | 4 | L8 L9 | 83% | 2 | 0 |
| `queen-pulse+smoke` | 4 | L7 L9 | 77% | 3 | 0 |
| `queen-pulse+vanguard` | 4 | L7 L8 | 97% | 2 | 0 |
| `aegis+queen-pulse` | 3 | L7 L8 | 80% | 3 | 0 |
| `become-king+poison-dart` | 3 | L7 L8 | 73% | 1 | 0 |
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-step+convert` | 3 | L7 | 77% | 0 | 0 |
| `bishop-step+duchess` | 3 | L7 | 73% | 1 | 0 |
| `bishop-step+vanguard` | 3 | L7 L8 | 100% | 1 | 0 |
| `boulder+summon-knight` | 3 | L7 L8 | 87% | 2 | 0 |
| `convert+smoke` | 3 | L7 L8 L10 | 63% | 3 | 0 |
| `duchess+smoke` | 3 | L7 L9 | 67% | 1 | 0 |
| `freeze-ray+page` | 3 | L8 L9 L10 | 80% | 1 | 0 |
| `freeze-ray+twin` | 3 | L7 L8 | 83% | 3 | 0 |
| `aegis+bishop-step` | 2 | L8 L9 | 100% | 0 | 0 |
| `aegis+duchess` | 2 | L7 L9 | 73% | 0 | 0 |
| `become-king+decoy` | 2 | L8 | 67% | 0 | 0 |
| `bishop-squire+bishop-step` | 2 | L9 | 80% | 2 | 0 |
| `bishop-squire+twin` | 2 | L7 L8 | 77% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `boulder+page` | 2 | L9 L10 | 73% | 1 | 0 |
| `boulder+queen-pulse` | 2 | L8 | 77% | 1 | 0 |
| `convert+dragon` | 2 | L9 L10 | 67% | 0 | 0 |
| `convert+queen-pulse` | 2 | L7 L8 | 97% | 1 | 0 |
| `decoy+duchess` | 2 | L7 L10 | 77% | 0 | 0 |
| `decoy+queen-pulse` | 2 | L7 | 63% | 2 | 0 |
| `dragon+twin` | 2 | L9 | 73% | 1 | 0 |
| `duchess+freeze-ray` | 2 | L7 L9 | 97% | 0 | 0 |
| `duchess+rabies-dart` | 2 | L7 L8 | 77% | 1 | 0 |
| `duchess+rewind` | 2 | L7 L8 | 80% | 1 | 0 |
| `freeze-ray+summon-knight` | 2 | L7 L9 | 87% | 2 | 0 |
| `page+summon-knight` | 2 | L8 L9 | 70% | 2 | 0 |
| `sacrifice+twin` | 2 | L7 | 80% | 2 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `become-king+dragon` | 1 | L7 | 77% | 0 | 0 |
| `become-king+freeze-ray` | 1 | L7 | 73% | 0 | 0 |
| `become-king+queen-pulse` | 1 | L8 | 60% | 1 | 0 |
| `become-king+rewind` | 1 | L7 | 77% | 1 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-squire+vanguard` | 1 | L9 | 87% | 1 | 0 |
| `bishop-step+page` | 1 | L7 | 60% | 1 | 0 |
| `bishop-step+poison-dart` | 1 | L7 | 70% | 0 | 0 |
| `bishop-step+summon-knight` | 1 | L8 | 60% | 1 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `convert+decoy` | 1 | L7 | 63% | 0 | 0 |
| `convert+freeze-ray` | 1 | L7 | 70% | 0 | 0 |
| `convert+page` | 1 | L10 | 63% | 0 | 0 |
| `convert+rewind` | 1 | L7 | 63% | 0 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `decoy+page` | 1 | L7 | 63% | 1 | 0 |
| `decoy+summon-knight` | 1 | L8 | 77% | 1 | 0 |
| `dragon+poison-dart` | 1 | L9 | 63% | 1 | 0 |
| `dragon+queen-pulse` | 1 | L8 | 80% | 1 | 0 |
| `dragon+rabies-dart` | 1 | L10 | 67% | 0 | 0 |
| `dragon+rewind` | 1 | L9 | 100% | 0 | 0 |
| `dragon+summon-knight` | 1 | L7 | 80% | 1 | 0 |
| `duchess+page` | 1 | L7 | 60% | 1 | 0 |
| `duchess+queen-pulse` | 1 | L8 | 73% | 0 | 0 |
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
| `bishop-step` | 17 | 43 | `aegis+bishop-step`, `become-king+bishop-step`, `bishop-squire+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+duchess`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+poison-dart`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+summon-knight`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 16 | 44 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `convert+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+poison-dart`, `dragon+queen-pulse`, `dragon+rabies-dart`, `dragon+rewind`, `dragon+smoke`, `dragon+summon-knight`, `dragon+twin`, `dragon+vanguard` |
| `queen-pulse` | 15 | 33 | `aegis+queen-pulse`, `become-king+queen-pulse`, `bishop-squire+queen-pulse`, `boulder+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `dragon+queen-pulse`, `duchess+queen-pulse`, `freeze-ray+queen-pulse`, `page+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+summon-knight`, `queen-pulse+vanguard` |
| `duchess` | 13 | 25 | `aegis+duchess`, `bishop-squire+duchess`, `bishop-step+duchess`, `decoy+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+page`, `duchess+queen-pulse`, `duchess+rabies-dart`, `duchess+rewind`, `duchess+smoke`, `duchess+swap`, `duchess+vanguard` |
| `page` | 11 | 25 | `aegis+page`, `bishop-step+page`, `boulder+page`, `convert+page`, `decoy+page`, `duchess+page`, `freeze-ray+page`, `page+queen-pulse`, `page+rewind`, `page+smoke`, `page+summon-knight` |
| `summon-knight` | 11 | 13 | `bishop-step+summon-knight`, `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `dragon+summon-knight`, `freeze-ray+summon-knight`, `page+summon-knight`, `queen-pulse+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `freeze-ray` | 10 | 24 | `become-king+freeze-ray`, `bishop-step+freeze-ray`, `convert+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+queen-pulse`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `smoke` | 9 | 25 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `duchess+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `convert` | 9 | 14 | `bishop-step+convert`, `convert+decoy`, `convert+dragon`, `convert+freeze-ray`, `convert+page`, `convert+queen-pulse`, `convert+rewind`, `convert+smoke`, `convert+summon-knight` |
| `rewind` | 8 | 18 | `become-king+rewind`, `bishop-step+rewind`, `convert+rewind`, `dragon+rewind`, `duchess+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `decoy` | 8 | 17 | `become-king+decoy`, `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+duchess`, `decoy+page`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `twin` | 8 | 12 | `bishop-squire+twin`, `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `vanguard` | 7 | 18 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `bishop-squire` | 7 | 15 | `bishop-squire+bishop-step`, `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+queen-pulse`, `bishop-squire+swap`, `bishop-squire+twin`, `bishop-squire+vanguard` |
| `become-king` | 7 | 11 | `become-king+bishop-step`, `become-king+decoy`, `become-king+dragon`, `become-king+freeze-ray`, `become-king+poison-dart`, `become-king+queen-pulse`, `become-king+rewind` |
| `boulder` | 6 | 23 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+page`, `boulder+queen-pulse`, `boulder+summon-knight` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `aegis` | 5 | 17 | `aegis+bishop-step`, `aegis+dragon`, `aegis+duchess`, `aegis+page`, `aegis+queen-pulse` |
| `rabies-dart` | 4 | 11 | `bishop-step+rabies-dart`, `dragon+rabies-dart`, `duchess+rabies-dart`, `queen-pulse+rabies-dart` |
| `poison-dart` | 4 | 9 | `become-king+poison-dart`, `bishop-step+poison-dart`, `dragon+poison-dart`, `poison-dart+queen-pulse` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `sacrifice` | 1 | 2 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 240 |
| `sacrifice+smoke` | 130 |
| `boulder+rewind` | 129 |
| `boulder+convert` | 125 |
| `aegis+twin` | 123 |
| `bishop-squire+page` | 121 |
| `magnet+rewind` | 120 |
| `aegis+decoy` | 114 |
| `rabies-dart+twin` | 109 |
| `become-king+duchess` | 105 |
| `rewind+smoke` | 105 |
| `duchess+sacrifice` | 102 |
| `freeze-ray+rabies-dart` | 101 |
| `bishop-squire+summon-knight` | 100 |
| `poison-dart+summon-knight` | 98 |
| `become-king+page` | 96 |
| `aegis+bishop-squire` | 95 |
| `become-king+vanguard` | 95 |
| `bishop-squire+smoke` | 95 |
| `magnet+sacrifice` | 94 |
| `poison-dart+rabies-dart` | 94 |
| `bishop-squire+magnet` | 91 |
| `queen-pulse+rewind` | 91 |
| `rabies-dart+sacrifice` | 89 |
| `boulder+duchess` | 88 |
| `boulder+magnet` | 88 |
| `convert+twin` | 88 |
| `decoy+poison-dart` | 88 |
| `freeze-ray+magnet` | 88 |
| `convert+vanguard` | 87 |
| `decoy+smoke` | 86 |
| `freeze-ray+sacrifice` | 86 |
| `magnet+rabies-dart` | 86 |
| `poison-dart+rewind` | 86 |
| `summon-knight+twin` | 86 |
| `bishop-squire+dragon` | 85 |
| `bishop-squire+rabies-dart` | 85 |
| `bishop-squire+poison-dart` | 84 |
| `boulder+decoy` | 84 |
| `boulder+vanguard` | 84 |
| `decoy+freeze-ray` | 84 |
| `freeze-ray+poison-dart` | 84 |
| `magnet+queen-pulse` | 84 |
| `magnet+smoke` | 84 |
| `magnet+twin` | 84 |
| `rabies-dart+rewind` | 84 |
| `sacrifice+vanguard` | 84 |
| `smoke+vanguard` | 84 |
| `aegis+convert` | 83 |
| `aegis+freeze-ray` | 83 |
| `aegis+magnet` | 83 |
| `aegis+summon-knight` | 83 |
| `become-king+bishop-squire` | 83 |
| `become-king+summon-knight` | 83 |
| `bishop-squire+convert` | 83 |
| `bishop-squire+decoy` | 83 |
| `bishop-squire+freeze-ray` | 83 |
| `bishop-squire+rewind` | 83 |
| `bishop-squire+sacrifice` | 83 |
| `bishop-step+magnet` | 83 |
| `boulder+freeze-ray` | 83 |
| `boulder+smoke` | 83 |
| `convert+sacrifice` | 83 |
| `decoy+twin` | 83 |
| `dragon+sacrifice` | 83 |
| `freeze-ray+vanguard` | 83 |
| `magnet+page` | 83 |
| `magnet+summon-knight` | 83 |
| `page+rabies-dart` | 83 |
| `page+twin` | 83 |
| `page+vanguard` | 83 |
| `poison-dart+sacrifice` | 83 |
| `poison-dart+smoke` | 83 |
| `poison-dart+twin` | 83 |
| `poison-dart+vanguard` | 83 |
| `queen-pulse+sacrifice` | 83 |
| `rabies-dart+smoke` | 83 |
| `rabies-dart+vanguard` | 83 |
| `sacrifice+summon-knight` | 83 |
| `summon-knight+vanguard` | 83 |
| `aegis+boulder` | 82 |
| `aegis+poison-dart` | 82 |
| `aegis+rabies-dart` | 82 |
| `aegis+vanguard` | 82 |
| `become-king+boulder` | 82 |
| `become-king+convert` | 82 |
| `become-king+magnet` | 82 |
| `become-king+rabies-dart` | 82 |
| `become-king+sacrifice` | 82 |
| `become-king+twin` | 82 |
| `bishop-step+sacrifice` | 82 |
| `boulder+poison-dart` | 82 |
| `boulder+rabies-dart` | 82 |
| `boulder+sacrifice` | 82 |
| `convert+duchess` | 82 |
| `convert+magnet` | 82 |
| `convert+rabies-dart` | 82 |
| `decoy+magnet` | 82 |
| `decoy+rewind` | 82 |
| `decoy+sacrifice` | 82 |
| `decoy+vanguard` | 82 |
| `dragon+magnet` | 82 |
| `dragon+page` | 82 |
| `duchess+magnet` | 82 |
| `duchess+poison-dart` | 82 |
| `duchess+summon-knight` | 82 |
| `freeze-ray+rewind` | 82 |
| `magnet+poison-dart` | 82 |
| `magnet+vanguard` | 82 |
| `page+poison-dart` | 82 |
| `queen-pulse+twin` | 82 |
| `rewind+sacrifice` | 82 |
| `rewind+vanguard` | 82 |
| `twin+vanguard` | 82 |
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