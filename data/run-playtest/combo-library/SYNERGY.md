# Rookie's Revenge — pair synergy report

Generated 2026-09-09 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability ~0%, every single card in K ~0%, and at least one **pair** drawn from K >= 60%.

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **545** · combo-gated: **39** · solvable with no ability: 70 · every kit disqualified by one of its own cards: 321 · a kit survived but no pair cleared: 98 · failed the high-trial confirm: 17

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `dragon+duchess` | 4 | L6 L7 L8 L9 | 93% | 2 | 0 |
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-step+dragon` | 3 | L7 L9 | 100% | 0 | 0 |
| `bishop-step+freeze-ray` | 3 | L8 | 100% | 1 | 0 |
| `bishop-step+rewind` | 3 | L7 L8 | 100% | 1 | 0 |
| `bishop-step+smoke` | 3 | L7 L8 | 100% | 0 | 0 |
| `bishop-step+vanguard` | 3 | L7 L8 | 100% | 1 | 0 |
| `page+rewind` | 3 | L7 L8 | 77% | 1 | 0 |
| `bishop-step+boulder` | 2 | L8 | 100% | 0 | 0 |
| `bishop-step+decoy` | 2 | L7 L8 | 93% | 0 | 0 |
| `bishop-step+rabies-dart` | 2 | L8 | 97% | 0 | 0 |
| `boulder+dragon` | 2 | L7 L9 | 70% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
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
| `convert+smoke` | 1 | L7 | 63% | 1 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `decoy+dragon` | 1 | L8 | 80% | 1 | 0 |
| `dragon+rewind` | 1 | L9 | 100% | 0 | 0 |
| `dragon+smoke` | 1 | L7 | 60% | 0 | 0 |
| `dragon+twin` | 1 | L9 | 73% | 0 | 0 |
| `dragon+vanguard` | 1 | L10 | 73% | 1 | 0 |
| `duchess+freeze-ray` | 1 | L9 | 97% | 0 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `duchess+vanguard` | 1 | L9 | 83% | 0 | 0 |
| `freeze-ray+knight-hop` | 1 | L7 | 100% | 0 | 0 |
| `freeze-ray+summon-knight` | 1 | L9 | 87% | 1 | 0 |
| `freeze-ray+twin` | 1 | L7 | 83% | 1 | 0 |
| `knight-hop+smoke` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+twin` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+vanguard` | 1 | L7 | 100% | 0 | 0 |
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
| `bishop-step` | 12 | 12 | `aegis+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 11 | 11 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+rewind`, `dragon+smoke`, `dragon+twin`, `dragon+vanguard` |
| `vanguard` | 7 | 8 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `smoke` | 7 | 8 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `knight-hop+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `twin` | 7 | 6 | `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `freeze-ray` | 6 | 8 | `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `queen-pulse` | 6 | 6 | `become-king+queen-pulse`, `convert+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+vanguard` |
| `summon-knight` | 6 | 4 | `boulder+summon-knight`, `convert+summon-knight`, `freeze-ray+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `rewind` | 5 | 8 | `bishop-step+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `duchess` | 5 | 5 | `bishop-squire+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+swap`, `duchess+vanguard` |
| `convert` | 5 | 4 | `bishop-step+convert`, `convert+decoy`, `convert+queen-pulse`, `convert+smoke`, `convert+summon-knight` |
| `boulder` | 4 | 7 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `bishop-squire` | 4 | 6 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+swap`, `bishop-squire+vanguard` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `decoy` | 3 | 4 | `bishop-step+decoy`, `convert+decoy`, `decoy+dragon` |
| `page` | 2 | 4 | `bishop-step+page`, `page+rewind` |
| `rabies-dart` | 2 | 3 | `bishop-step+rabies-dart`, `queen-pulse+rabies-dart` |
| `aegis` | 2 | 2 | `aegis+bishop-step`, `aegis+dragon` |
| `become-king` | 2 | 2 | `become-king+dragon`, `become-king+queen-pulse` |
| `poison-dart` | 1 | 1 | `poison-dart+queen-pulse` |
| `sacrifice` | 1 | 1 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 30 |
| `magnet+rewind` | 23 |
| `sacrifice+smoke` | 21 |
| `bishop-squire+smoke` | 18 |
| `boulder+convert` | 18 |
| `freeze-ray+sacrifice` | 18 |
| `bishop-squire+page` | 17 |
| `duchess+sacrifice` | 17 |
| `magnet+poison-dart` | 17 |
| `magnet+sacrifice` | 17 |
| `become-king+bishop-step` | 16 |
| `become-king+duchess` | 16 |
| `boulder+rewind` | 16 |
| `aegis+decoy` | 15 |
| `aegis+summon-knight` | 15 |
| `freeze-ray+rabies-dart` | 15 |
| `magnet+summon-knight` | 15 |
| `rewind+smoke` | 15 |
| `decoy+summon-knight` | 14 |
| `magnet+page` | 14 |
| `magnet+rabies-dart` | 14 |
| `rabies-dart+twin` | 14 |
| `aegis+boulder` | 13 |
| `become-king+page` | 13 |
| `become-king+vanguard` | 13 |
| `boulder+vanguard` | 13 |
| `convert+freeze-ray` | 13 |
| `decoy+duchess` | 13 |
| `decoy+freeze-ray` | 13 |
| `decoy+poison-dart` | 13 |
| `freeze-ray+vanguard` | 13 |
| `page+summon-knight` | 13 |
| `page+twin` | 13 |
| `poison-dart+rabies-dart` | 13 |
| `poison-dart+twin` | 13 |
| `poison-dart+vanguard` | 13 |
| `queen-pulse+rewind` | 13 |
| `aegis+twin` | 12 |
| `become-king+twin` | 12 |
| `bishop-squire+freeze-ray` | 12 |
| `bishop-squire+poison-dart` | 12 |
| `bishop-squire+rewind` | 12 |
| `boulder+freeze-ray` | 12 |
| `boulder+magnet` | 12 |
| `boulder+smoke` | 12 |
| `convert+page` | 12 |
| `convert+twin` | 12 |
| `decoy+twin` | 12 |
| `dragon+summon-knight` | 12 |
| `duchess+magnet` | 12 |
| `duchess+smoke` | 12 |
| `magnet+smoke` | 12 |
| `poison-dart+rewind` | 12 |
| `rabies-dart+sacrifice` | 12 |
| `sacrifice+vanguard` | 12 |
| `aegis+bishop-squire` | 11 |
| `aegis+duchess` | 11 |
| `aegis+freeze-ray` | 11 |
| `aegis+magnet` | 11 |
| `aegis+page` | 11 |
| `aegis+queen-pulse` | 11 |
| `become-king+boulder` | 11 |
| `become-king+freeze-ray` | 11 |
| `become-king+magnet` | 11 |
| `become-king+rewind` | 11 |
| `become-king+summon-knight` | 11 |
| `bishop-squire+convert` | 11 |
| `bishop-squire+decoy` | 11 |
| `bishop-squire+magnet` | 11 |
| `bishop-squire+queen-pulse` | 11 |
| `bishop-squire+rabies-dart` | 11 |
| `bishop-squire+sacrifice` | 11 |
| `bishop-squire+twin` | 11 |
| `bishop-step+magnet` | 11 |
| `bishop-step+sacrifice` | 11 |
| `boulder+decoy` | 11 |
| `boulder+duchess` | 11 |
| `boulder+page` | 11 |
| `boulder+poison-dart` | 11 |
| `boulder+queen-pulse` | 11 |
| `boulder+sacrifice` | 11 |
| `convert+dragon` | 11 |
| `convert+duchess` | 11 |
| `convert+rewind` | 11 |
| `convert+sacrifice` | 11 |
| `convert+vanguard` | 11 |
| `decoy+magnet` | 11 |
| `decoy+page` | 11 |
| `decoy+rewind` | 11 |
| `decoy+smoke` | 11 |
| `decoy+vanguard` | 11 |
| `dragon+magnet` | 11 |
| `dragon+page` | 11 |
| `dragon+poison-dart` | 11 |
| `dragon+rabies-dart` | 11 |
| `dragon+sacrifice` | 11 |
| `duchess+page` | 11 |
| `duchess+poison-dart` | 11 |
| `duchess+rabies-dart` | 11 |
| `duchess+rewind` | 11 |
| `freeze-ray+magnet` | 11 |
| `freeze-ray+page` | 11 |
| `freeze-ray+rewind` | 11 |
| `magnet+queen-pulse` | 11 |
| `magnet+twin` | 11 |
| `page+poison-dart` | 11 |
| `page+smoke` | 11 |
| `poison-dart+smoke` | 11 |
| `poison-dart+summon-knight` | 11 |
| `queen-pulse+sacrifice` | 11 |
| `rabies-dart+rewind` | 11 |
| `rabies-dart+smoke` | 11 |
| `rewind+sacrifice` | 11 |
| `rewind+vanguard` | 11 |
| `sacrifice+summon-knight` | 11 |
| `smoke+vanguard` | 11 |
| `twin+vanguard` | 11 |
| `aegis+convert` | 10 |
| `aegis+poison-dart` | 10 |
| `aegis+rabies-dart` | 10 |
| `aegis+vanguard` | 10 |
| `become-king+bishop-squire` | 10 |
| `become-king+convert` | 10 |
| `become-king+decoy` | 10 |
| `become-king+poison-dart` | 10 |
| `become-king+rabies-dart` | 10 |
| `become-king+sacrifice` | 10 |
| `bishop-squire+bishop-step` | 10 |
| `bishop-squire+dragon` | 10 |
| `bishop-squire+summon-knight` | 10 |
| `bishop-step+duchess` | 10 |
| `bishop-step+poison-dart` | 10 |
| `bishop-step+summon-knight` | 10 |
| `boulder+rabies-dart` | 10 |
| `convert+magnet` | 10 |
| `convert+rabies-dart` | 10 |
| `decoy+queen-pulse` | 10 |
| `decoy+sacrifice` | 10 |
| `dragon+queen-pulse` | 10 |
| `duchess+queen-pulse` | 10 |
| `duchess+summon-knight` | 10 |
| `freeze-ray+poison-dart` | 10 |
| `freeze-ray+queen-pulse` | 10 |
| `magnet+vanguard` | 10 |
| `page+queen-pulse` | 10 |
| `page+rabies-dart` | 10 |
| `page+vanguard` | 10 |
| `poison-dart+sacrifice` | 10 |
| `queen-pulse+summon-knight` | 10 |
| `queen-pulse+twin` | 10 |
| `rabies-dart+vanguard` | 10 |
| `summon-knight+twin` | 10 |
| `summon-knight+vanguard` | 10 |
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