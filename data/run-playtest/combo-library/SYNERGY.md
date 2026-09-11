# Rookie's Revenge — pair synergy report

Generated 2026-09-11 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **767** · combo-gated: **48** · solvable with no ability: 70 · every kit disqualified by one of its own cards: 484 · a kit survived but no pair cleared: 138 · failed the high-trial confirm: 27

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-step+rewind` | 4 | L7 L8 | 100% | 2 | 0 |
| `dragon+duchess` | 4 | L6 L7 L8 L9 | 93% | 2 | 0 |
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-step+dragon` | 3 | L7 L9 | 100% | 0 | 0 |
| `bishop-step+freeze-ray` | 3 | L8 | 100% | 1 | 0 |
| `bishop-step+smoke` | 3 | L7 L8 | 100% | 0 | 0 |
| `bishop-step+vanguard` | 3 | L7 L8 | 100% | 1 | 0 |
| `page+rewind` | 3 | L7 L8 | 77% | 1 | 0 |
| `bishop-step+boulder` | 2 | L8 | 100% | 0 | 0 |
| `bishop-step+decoy` | 2 | L7 L8 | 93% | 0 | 0 |
| `bishop-step+rabies-dart` | 2 | L8 | 97% | 0 | 0 |
| `boulder+dragon` | 2 | L7 L9 | 70% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `convert+smoke` | 2 | L7 L10 | 63% | 2 | 0 |
| `decoy+dragon` | 2 | L8 | 80% | 2 | 0 |
| `dragon+freeze-ray` | 2 | L7 L9 | 97% | 0 | 0 |
| `duchess+vanguard` | 2 | L8 L9 | 83% | 1 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `aegis+bishop-step` | 1 | L9 | 100% | 0 | 0 |
| `aegis+dragon` | 1 | L10 | 80% | 1 | 0 |
| `aegis+queen-pulse` | 1 | L8 | 67% | 1 | 0 |
| `become-king+dragon` | 1 | L7 | 77% | 0 | 0 |
| `become-king+queen-pulse` | 1 | L8 | 60% | 1 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-squire+vanguard` | 1 | L9 | 87% | 1 | 0 |
| `bishop-step+convert` | 1 | L7 | 63% | 0 | 0 |
| `bishop-step+page` | 1 | L7 | 60% | 1 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `boulder+summon-knight` | 1 | L7 | 87% | 0 | 0 |
| `convert+decoy` | 1 | L7 | 63% | 0 | 0 |
| `convert+queen-pulse` | 1 | L7 | 97% | 0 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `decoy+queen-pulse` | 1 | L7 | 60% | 1 | 0 |
| `decoy+summon-knight` | 1 | L8 | 77% | 1 | 0 |
| `dragon+rewind` | 1 | L9 | 100% | 0 | 0 |
| `dragon+smoke` | 1 | L7 | 60% | 0 | 0 |
| `dragon+twin` | 1 | L9 | 73% | 0 | 0 |
| `dragon+vanguard` | 1 | L10 | 73% | 1 | 0 |
| `duchess+freeze-ray` | 1 | L9 | 97% | 0 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `freeze-ray+knight-hop` | 1 | L7 | 100% | 0 | 0 |
| `freeze-ray+page` | 1 | L10 | 67% | 1 | 0 |
| `freeze-ray+summon-knight` | 1 | L9 | 87% | 1 | 0 |
| `freeze-ray+twin` | 1 | L7 | 83% | 1 | 0 |
| `knight-hop+smoke` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+twin` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `page+smoke` | 1 | L9 | 77% | 1 | 0 |
| `poison-dart+queen-pulse` | 1 | L9 | 83% | 1 | 0 |
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
| `bishop-step` | 12 | 13 | `aegis+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 11 | 12 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+rewind`, `dragon+smoke`, `dragon+twin`, `dragon+vanguard` |
| `smoke` | 8 | 10 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `queen-pulse` | 8 | 8 | `aegis+queen-pulse`, `become-king+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+vanguard` |
| `vanguard` | 7 | 9 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `freeze-ray` | 7 | 9 | `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `twin` | 7 | 6 | `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `summon-knight` | 7 | 5 | `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `freeze-ray+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `rewind` | 5 | 9 | `bishop-step+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `decoy` | 5 | 7 | `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `duchess` | 5 | 6 | `bishop-squire+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+swap`, `duchess+vanguard` |
| `convert` | 5 | 5 | `bishop-step+convert`, `convert+decoy`, `convert+queen-pulse`, `convert+smoke`, `convert+summon-knight` |
| `boulder` | 4 | 7 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `bishop-squire` | 4 | 6 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+swap`, `bishop-squire+vanguard` |
| `page` | 4 | 6 | `bishop-step+page`, `freeze-ray+page`, `page+rewind`, `page+smoke` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `aegis` | 3 | 3 | `aegis+bishop-step`, `aegis+dragon`, `aegis+queen-pulse` |
| `rabies-dart` | 2 | 3 | `bishop-step+rabies-dart`, `queen-pulse+rabies-dart` |
| `become-king` | 2 | 2 | `become-king+dragon`, `become-king+queen-pulse` |
| `poison-dart` | 1 | 1 | `poison-dart+queen-pulse` |
| `sacrifice` | 1 | 1 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 46 |
| `sacrifice+smoke` | 27 |
| `aegis+decoy` | 26 |
| `magnet+rewind` | 26 |
| `become-king+bishop-step` | 25 |
| `rabies-dart+twin` | 25 |
| `aegis+twin` | 24 |
| `become-king+duchess` | 24 |
| `bishop-squire+page` | 24 |
| `boulder+rewind` | 24 |
| `boulder+convert` | 23 |
| `duchess+sacrifice` | 22 |
| `freeze-ray+sacrifice` | 22 |
| `freeze-ray+rabies-dart` | 21 |
| `magnet+page` | 21 |
| `magnet+sacrifice` | 21 |
| `aegis+boulder` | 20 |
| `bishop-squire+freeze-ray` | 20 |
| `bishop-squire+smoke` | 20 |
| `convert+vanguard` | 20 |
| `magnet+poison-dart` | 20 |
| `magnet+smoke` | 20 |
| `rewind+smoke` | 20 |
| `aegis+summon-knight` | 19 |
| `decoy+duchess` | 19 |
| `decoy+freeze-ray` | 19 |
| `decoy+poison-dart` | 19 |
| `rabies-dart+sacrifice` | 19 |
| `become-king+page` | 18 |
| `boulder+vanguard` | 18 |
| `magnet+rabies-dart` | 18 |
| `magnet+summon-knight` | 18 |
| `page+summon-knight` | 18 |
| `queen-pulse+rewind` | 18 |
| `sacrifice+vanguard` | 18 |
| `aegis+page` | 17 |
| `become-king+bishop-squire` | 17 |
| `become-king+summon-knight` | 17 |
| `bishop-squire+convert` | 17 |
| `bishop-squire+rabies-dart` | 17 |
| `bishop-step+duchess` | 17 |
| `boulder+duchess` | 17 |
| `boulder+rabies-dart` | 17 |
| `convert+rabies-dart` | 17 |
| `dragon+magnet` | 17 |
| `dragon+rabies-dart` | 17 |
| `duchess+poison-dart` | 17 |
| `freeze-ray+poison-dart` | 17 |
| `freeze-ray+queen-pulse` | 17 |
| `freeze-ray+rewind` | 17 |
| `page+rabies-dart` | 17 |
| `page+twin` | 17 |
| `poison-dart+rabies-dart` | 17 |
| `poison-dart+summon-knight` | 17 |
| `poison-dart+twin` | 17 |
| `aegis+bishop-squire` | 16 |
| `aegis+convert` | 16 |
| `aegis+magnet` | 16 |
| `aegis+vanguard` | 16 |
| `become-king+freeze-ray` | 16 |
| `become-king+magnet` | 16 |
| `become-king+rewind` | 16 |
| `become-king+twin` | 16 |
| `become-king+vanguard` | 16 |
| `bishop-squire+bishop-step` | 16 |
| `bishop-squire+decoy` | 16 |
| `bishop-squire+magnet` | 16 |
| `bishop-squire+poison-dart` | 16 |
| `bishop-squire+queen-pulse` | 16 |
| `bishop-squire+rewind` | 16 |
| `bishop-squire+sacrifice` | 16 |
| `bishop-squire+summon-knight` | 16 |
| `bishop-squire+twin` | 16 |
| `bishop-step+magnet` | 16 |
| `bishop-step+poison-dart` | 16 |
| `bishop-step+sacrifice` | 16 |
| `boulder+freeze-ray` | 16 |
| `boulder+magnet` | 16 |
| `boulder+page` | 16 |
| `boulder+poison-dart` | 16 |
| `boulder+queen-pulse` | 16 |
| `boulder+smoke` | 16 |
| `convert+dragon` | 16 |
| `convert+duchess` | 16 |
| `convert+page` | 16 |
| `convert+sacrifice` | 16 |
| `convert+twin` | 16 |
| `decoy+magnet` | 16 |
| `decoy+page` | 16 |
| `decoy+twin` | 16 |
| `decoy+vanguard` | 16 |
| `dragon+poison-dart` | 16 |
| `dragon+sacrifice` | 16 |
| `duchess+magnet` | 16 |
| `duchess+page` | 16 |
| `duchess+queen-pulse` | 16 |
| `duchess+rabies-dart` | 16 |
| `duchess+rewind` | 16 |
| `duchess+smoke` | 16 |
| `freeze-ray+magnet` | 16 |
| `freeze-ray+vanguard` | 16 |
| `magnet+queen-pulse` | 16 |
| `magnet+twin` | 16 |
| `magnet+vanguard` | 16 |
| `page+poison-dart` | 16 |
| `page+queen-pulse` | 16 |
| `page+vanguard` | 16 |
| `poison-dart+rewind` | 16 |
| `poison-dart+smoke` | 16 |
| `queen-pulse+sacrifice` | 16 |
| `rabies-dart+smoke` | 16 |
| `rabies-dart+vanguard` | 16 |
| `rewind+vanguard` | 16 |
| `sacrifice+summon-knight` | 16 |
| `smoke+vanguard` | 16 |
| `summon-knight+twin` | 16 |
| `summon-knight+vanguard` | 16 |
| `aegis+duchess` | 15 |
| `aegis+freeze-ray` | 15 |
| `aegis+poison-dart` | 15 |
| `aegis+rabies-dart` | 15 |
| `become-king+boulder` | 15 |
| `become-king+convert` | 15 |
| `become-king+decoy` | 15 |
| `become-king+poison-dart` | 15 |
| `become-king+rabies-dart` | 15 |
| `become-king+sacrifice` | 15 |
| `bishop-squire+dragon` | 15 |
| `bishop-step+summon-knight` | 15 |
| `boulder+decoy` | 15 |
| `boulder+sacrifice` | 15 |
| `convert+freeze-ray` | 15 |
| `convert+magnet` | 15 |
| `convert+rewind` | 15 |
| `decoy+rewind` | 15 |
| `decoy+sacrifice` | 15 |
| `decoy+smoke` | 15 |
| `dragon+page` | 15 |
| `dragon+queen-pulse` | 15 |
| `dragon+summon-knight` | 15 |
| `duchess+summon-knight` | 15 |
| `poison-dart+sacrifice` | 15 |
| `poison-dart+vanguard` | 15 |
| `queen-pulse+summon-knight` | 15 |
| `queen-pulse+twin` | 15 |
| `rabies-dart+rewind` | 15 |
| `rewind+sacrifice` | 15 |
| `twin+vanguard` | 15 |
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