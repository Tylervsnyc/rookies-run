# Rookie's Revenge — pair synergy report

Generated 2026-09-21 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **1558** · combo-gated: **74** · solvable with no ability: 72 · every kit disqualified by one of its own cards: 1059 · a kit survived but no pair cleared: 290 · failed the high-trial confirm: 63

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-step+rewind` | 5 | L7 L8 L9 | 100% | 3 | 0 |
| `dragon+duchess` | 5 | L6 L7 L8 L9 | 93% | 3 | 0 |
| `aegis+dragon` | 4 | L8 L9 L10 | 80% | 3 | 0 |
| `bishop-step+dragon` | 4 | L7 L9 | 100% | 0 | 0 |
| `bishop-step+rabies-dart` | 4 | L7 L8 | 97% | 1 | 0 |
| `bishop-step+smoke` | 4 | L7 L8 | 100% | 0 | 0 |
| `page+rewind` | 4 | L7 L8 | 77% | 2 | 0 |
| `poison-dart+queen-pulse` | 4 | L8 L9 | 83% | 2 | 0 |
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
| `bishop-squire+twin` | 1 | L8 | 77% | 1 | 0 |
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
| `dragon` | 13 | 18 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `convert+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+poison-dart`, `dragon+rewind`, `dragon+smoke`, `dragon+twin`, `dragon+vanguard` |
| `queen-pulse` | 10 | 12 | `aegis+queen-pulse`, `become-king+queen-pulse`, `bishop-squire+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `freeze-ray+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+vanguard` |
| `smoke` | 8 | 12 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `duchess` | 8 | 10 | `bishop-squire+duchess`, `bishop-step+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+page`, `duchess+rabies-dart`, `duchess+swap`, `duchess+vanguard` |
| `convert` | 8 | 10 | `bishop-step+convert`, `convert+decoy`, `convert+dragon`, `convert+page`, `convert+queen-pulse`, `convert+rewind`, `convert+smoke`, `convert+summon-knight` |
| `freeze-ray` | 8 | 10 | `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+queen-pulse`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `twin` | 8 | 7 | `bishop-squire+twin`, `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `rewind` | 7 | 13 | `become-king+rewind`, `bishop-step+rewind`, `convert+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `vanguard` | 7 | 12 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `page` | 7 | 10 | `bishop-step+page`, `convert+page`, `decoy+page`, `duchess+page`, `freeze-ray+page`, `page+rewind`, `page+smoke` |
| `summon-knight` | 7 | 6 | `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `freeze-ray+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `bishop-squire` | 6 | 9 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+queen-pulse`, `bishop-squire+swap`, `bishop-squire+twin`, `bishop-squire+vanguard` |
| `decoy` | 6 | 9 | `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+page`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `become-king` | 5 | 6 | `become-king+bishop-step`, `become-king+dragon`, `become-king+poison-dart`, `become-king+queen-pulse`, `become-king+rewind` |
| `boulder` | 4 | 9 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `poison-dart` | 4 | 7 | `become-king+poison-dart`, `bishop-step+poison-dart`, `dragon+poison-dart`, `poison-dart+queen-pulse` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `aegis` | 3 | 6 | `aegis+bishop-step`, `aegis+dragon`, `aegis+queen-pulse` |
| `rabies-dart` | 3 | 6 | `bishop-step+rabies-dart`, `duchess+rabies-dart`, `queen-pulse+rabies-dart` |
| `sacrifice` | 1 | 1 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 94 |
| `aegis+twin` | 51 |
| `aegis+decoy` | 48 |
| `sacrifice+smoke` | 47 |
| `boulder+convert` | 45 |
| `boulder+rewind` | 45 |
| `rabies-dart+twin` | 44 |
| `magnet+rewind` | 43 |
| `bishop-squire+page` | 42 |
| `rewind+smoke` | 42 |
| `magnet+sacrifice` | 38 |
| `poison-dart+summon-knight` | 38 |
| `become-king+vanguard` | 37 |
| `freeze-ray+rabies-dart` | 37 |
| `rabies-dart+sacrifice` | 37 |
| `poison-dart+rabies-dart` | 36 |
| `become-king+duchess` | 35 |
| `boulder+page` | 35 |
| `decoy+poison-dart` | 35 |
| `dragon+magnet` | 35 |
| `freeze-ray+sacrifice` | 35 |
| `magnet+page` | 35 |
| `become-king+page` | 34 |
| `bishop-squire+smoke` | 34 |
| `duchess+sacrifice` | 33 |
| `poison-dart+rewind` | 33 |
| `summon-knight+vanguard` | 33 |
| `boulder+duchess` | 32 |
| `convert+vanguard` | 32 |
| `magnet+smoke` | 32 |
| `magnet+summon-knight` | 32 |
| `page+summon-knight` | 32 |
| `page+twin` | 32 |
| `poison-dart+sacrifice` | 32 |
| `queen-pulse+sacrifice` | 32 |
| `aegis+bishop-squire` | 31 |
| `aegis+duchess` | 31 |
| `become-king+bishop-squire` | 31 |
| `bishop-squire+poison-dart` | 31 |
| `bishop-squire+rabies-dart` | 31 |
| `bishop-squire+rewind` | 31 |
| `bishop-squire+summon-knight` | 31 |
| `boulder+rabies-dart` | 31 |
| `boulder+vanguard` | 31 |
| `decoy+duchess` | 31 |
| `decoy+freeze-ray` | 31 |
| `dragon+summon-knight` | 31 |
| `freeze-ray+magnet` | 31 |
| `magnet+vanguard` | 31 |
| `poison-dart+twin` | 31 |
| `queen-pulse+rewind` | 31 |
| `aegis+boulder` | 30 |
| `aegis+convert` | 30 |
| `aegis+freeze-ray` | 30 |
| `aegis+magnet` | 30 |
| `aegis+summon-knight` | 30 |
| `aegis+vanguard` | 30 |
| `become-king+boulder` | 30 |
| `become-king+magnet` | 30 |
| `bishop-squire+convert` | 30 |
| `bishop-squire+decoy` | 30 |
| `bishop-squire+freeze-ray` | 30 |
| `bishop-squire+magnet` | 30 |
| `bishop-squire+sacrifice` | 30 |
| `bishop-step+magnet` | 30 |
| `bishop-step+sacrifice` | 30 |
| `boulder+decoy` | 30 |
| `boulder+freeze-ray` | 30 |
| `boulder+magnet` | 30 |
| `boulder+poison-dart` | 30 |
| `boulder+queen-pulse` | 30 |
| `boulder+sacrifice` | 30 |
| `boulder+smoke` | 30 |
| `convert+duchess` | 30 |
| `convert+magnet` | 30 |
| `convert+sacrifice` | 30 |
| `convert+twin` | 30 |
| `decoy+smoke` | 30 |
| `decoy+twin` | 30 |
| `decoy+vanguard` | 30 |
| `dragon+rabies-dart` | 30 |
| `dragon+sacrifice` | 30 |
| `duchess+magnet` | 30 |
| `duchess+poison-dart` | 30 |
| `duchess+rewind` | 30 |
| `duchess+smoke` | 30 |
| `freeze-ray+poison-dart` | 30 |
| `freeze-ray+vanguard` | 30 |
| `magnet+poison-dart` | 30 |
| `magnet+queen-pulse` | 30 |
| `magnet+rabies-dart` | 30 |
| `magnet+twin` | 30 |
| `page+poison-dart` | 30 |
| `page+rabies-dart` | 30 |
| `page+vanguard` | 30 |
| `poison-dart+smoke` | 30 |
| `poison-dart+vanguard` | 30 |
| `queen-pulse+twin` | 30 |
| `rabies-dart+rewind` | 30 |
| `rabies-dart+smoke` | 30 |
| `rabies-dart+vanguard` | 30 |
| `rewind+vanguard` | 30 |
| `sacrifice+summon-knight` | 30 |
| `sacrifice+vanguard` | 30 |
| `twin+vanguard` | 30 |
| `aegis+page` | 29 |
| `aegis+poison-dart` | 29 |
| `aegis+rabies-dart` | 29 |
| `become-king+convert` | 29 |
| `become-king+decoy` | 29 |
| `become-king+freeze-ray` | 29 |
| `become-king+rabies-dart` | 29 |
| `become-king+sacrifice` | 29 |
| `become-king+summon-knight` | 29 |
| `become-king+twin` | 29 |
| `bishop-squire+bishop-step` | 29 |
| `bishop-squire+dragon` | 29 |
| `bishop-step+summon-knight` | 29 |
| `convert+freeze-ray` | 29 |
| `convert+rabies-dart` | 29 |
| `decoy+magnet` | 29 |
| `decoy+rewind` | 29 |
| `decoy+sacrifice` | 29 |
| `dragon+page` | 29 |
| `dragon+queen-pulse` | 29 |
| `duchess+queen-pulse` | 29 |
| `duchess+summon-knight` | 29 |
| `freeze-ray+rewind` | 29 |
| `page+queen-pulse` | 29 |
| `queen-pulse+summon-knight` | 29 |
| `rewind+sacrifice` | 29 |
| `smoke+vanguard` | 29 |
| `summon-knight+twin` | 29 |
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