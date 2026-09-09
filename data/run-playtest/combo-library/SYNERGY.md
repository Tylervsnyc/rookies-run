# Rookie's Revenge — pair synergy report

Generated 2026-09-09 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability ~0%, every single card in K ~0%, and at least one **pair** drawn from K >= 60%.

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **649** · combo-gated: **46** · solvable with no ability: 70 · every kit disqualified by one of its own cards: 389 · a kit survived but no pair cleared: 118 · failed the high-trial confirm: 26

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
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `aegis+bishop-step` | 1 | L9 | 100% | 0 | 0 |
| `aegis+dragon` | 1 | L10 | 80% | 1 | 0 |
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
| `duchess+vanguard` | 1 | L9 | 83% | 0 | 0 |
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
| `freeze-ray` | 7 | 9 | `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `vanguard` | 7 | 8 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `queen-pulse` | 7 | 7 | `become-king+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+vanguard` |
| `twin` | 7 | 6 | `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `summon-knight` | 7 | 5 | `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `freeze-ray+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `rewind` | 5 | 9 | `bishop-step+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `decoy` | 5 | 7 | `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `duchess` | 5 | 5 | `bishop-squire+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+swap`, `duchess+vanguard` |
| `convert` | 5 | 5 | `bishop-step+convert`, `convert+decoy`, `convert+queen-pulse`, `convert+smoke`, `convert+summon-knight` |
| `boulder` | 4 | 7 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `bishop-squire` | 4 | 6 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+swap`, `bishop-squire+vanguard` |
| `page` | 4 | 6 | `bishop-step+page`, `freeze-ray+page`, `page+rewind`, `page+smoke` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `rabies-dart` | 2 | 3 | `bishop-step+rabies-dart`, `queen-pulse+rabies-dart` |
| `aegis` | 2 | 2 | `aegis+bishop-step`, `aegis+dragon` |
| `become-king` | 2 | 2 | `become-king+dragon`, `become-king+queen-pulse` |
| `poison-dart` | 1 | 1 | `poison-dart+queen-pulse` |
| `sacrifice` | 1 | 1 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 39 |
| `magnet+rewind` | 25 |
| `sacrifice+smoke` | 25 |
| `become-king+bishop-step` | 23 |
| `become-king+duchess` | 22 |
| `bishop-squire+page` | 22 |
| `aegis+decoy` | 21 |
| `boulder+rewind` | 21 |
| `bishop-squire+smoke` | 20 |
| `boulder+convert` | 20 |
| `duchess+sacrifice` | 20 |
| `freeze-ray+rabies-dart` | 20 |
| `freeze-ray+sacrifice` | 20 |
| `magnet+poison-dart` | 20 |
| `magnet+sacrifice` | 20 |
| `rabies-dart+twin` | 20 |
| `magnet+page` | 19 |
| `aegis+boulder` | 18 |
| `aegis+twin` | 18 |
| `decoy+poison-dart` | 18 |
| `magnet+rabies-dart` | 18 |
| `magnet+smoke` | 18 |
| `aegis+summon-knight` | 17 |
| `decoy+duchess` | 17 |
| `decoy+freeze-ray` | 17 |
| `magnet+summon-knight` | 17 |
| `queen-pulse+rewind` | 17 |
| `rewind+smoke` | 17 |
| `aegis+page` | 16 |
| `become-king+bishop-squire` | 16 |
| `become-king+vanguard` | 16 |
| `bishop-squire+freeze-ray` | 16 |
| `bishop-squire+sacrifice` | 16 |
| `boulder+smoke` | 16 |
| `boulder+vanguard` | 16 |
| `rabies-dart+sacrifice` | 16 |
| `sacrifice+summon-knight` | 16 |
| `become-king+page` | 15 |
| `become-king+rewind` | 15 |
| `become-king+summon-knight` | 15 |
| `bishop-squire+decoy` | 15 |
| `bishop-squire+poison-dart` | 15 |
| `bishop-squire+rabies-dart` | 15 |
| `boulder+magnet` | 15 |
| `boulder+queen-pulse` | 15 |
| `convert+vanguard` | 15 |
| `dragon+magnet` | 15 |
| `dragon+rabies-dart` | 15 |
| `duchess+magnet` | 15 |
| `freeze-ray+queen-pulse` | 15 |
| `freeze-ray+vanguard` | 15 |
| `page+summon-knight` | 15 |
| `page+twin` | 15 |
| `poison-dart+rabies-dart` | 15 |
| `poison-dart+sacrifice` | 15 |
| `poison-dart+twin` | 15 |
| `sacrifice+vanguard` | 15 |
| `aegis+freeze-ray` | 14 |
| `aegis+magnet` | 14 |
| `aegis+queen-pulse` | 14 |
| `become-king+boulder` | 14 |
| `become-king+decoy` | 14 |
| `become-king+freeze-ray` | 14 |
| `become-king+magnet` | 14 |
| `become-king+poison-dart` | 14 |
| `become-king+twin` | 14 |
| `bishop-squire+bishop-step` | 14 |
| `bishop-squire+convert` | 14 |
| `bishop-squire+magnet` | 14 |
| `bishop-squire+queen-pulse` | 14 |
| `bishop-squire+rewind` | 14 |
| `bishop-squire+summon-knight` | 14 |
| `bishop-step+duchess` | 14 |
| `bishop-step+magnet` | 14 |
| `bishop-step+poison-dart` | 14 |
| `bishop-step+summon-knight` | 14 |
| `boulder+decoy` | 14 |
| `boulder+duchess` | 14 |
| `boulder+freeze-ray` | 14 |
| `boulder+page` | 14 |
| `boulder+poison-dart` | 14 |
| `boulder+rabies-dart` | 14 |
| `convert+duchess` | 14 |
| `convert+freeze-ray` | 14 |
| `convert+page` | 14 |
| `convert+rabies-dart` | 14 |
| `convert+twin` | 14 |
| `decoy+page` | 14 |
| `decoy+twin` | 14 |
| `dragon+page` | 14 |
| `dragon+poison-dart` | 14 |
| `dragon+queen-pulse` | 14 |
| `dragon+sacrifice` | 14 |
| `dragon+summon-knight` | 14 |
| `duchess+poison-dart` | 14 |
| `duchess+queen-pulse` | 14 |
| `duchess+rabies-dart` | 14 |
| `duchess+rewind` | 14 |
| `duchess+smoke` | 14 |
| `freeze-ray+magnet` | 14 |
| `freeze-ray+rewind` | 14 |
| `magnet+queen-pulse` | 14 |
| `magnet+twin` | 14 |
| `magnet+vanguard` | 14 |
| `page+poison-dart` | 14 |
| `page+queen-pulse` | 14 |
| `page+rabies-dart` | 14 |
| `poison-dart+rewind` | 14 |
| `poison-dart+smoke` | 14 |
| `poison-dart+summon-knight` | 14 |
| `poison-dart+vanguard` | 14 |
| `queen-pulse+summon-knight` | 14 |
| `rabies-dart+smoke` | 14 |
| `rabies-dart+vanguard` | 14 |
| `smoke+vanguard` | 14 |
| `summon-knight+vanguard` | 14 |
| `aegis+bishop-squire` | 13 |
| `aegis+convert` | 13 |
| `aegis+duchess` | 13 |
| `aegis+poison-dart` | 13 |
| `aegis+rabies-dart` | 13 |
| `aegis+vanguard` | 13 |
| `become-king+convert` | 13 |
| `become-king+rabies-dart` | 13 |
| `become-king+sacrifice` | 13 |
| `bishop-squire+dragon` | 13 |
| `bishop-squire+twin` | 13 |
| `bishop-step+sacrifice` | 13 |
| `boulder+sacrifice` | 13 |
| `convert+dragon` | 13 |
| `convert+magnet` | 13 |
| `convert+rewind` | 13 |
| `convert+sacrifice` | 13 |
| `decoy+magnet` | 13 |
| `decoy+rewind` | 13 |
| `decoy+sacrifice` | 13 |
| `decoy+smoke` | 13 |
| `decoy+vanguard` | 13 |
| `duchess+page` | 13 |
| `duchess+summon-knight` | 13 |
| `freeze-ray+poison-dart` | 13 |
| `page+vanguard` | 13 |
| `queen-pulse+sacrifice` | 13 |
| `queen-pulse+twin` | 13 |
| `rabies-dart+rewind` | 13 |
| `rewind+sacrifice` | 13 |
| `rewind+vanguard` | 13 |
| `summon-knight+twin` | 13 |
| `twin+vanguard` | 13 |
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