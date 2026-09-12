# Rookie's Revenge — pair synergy report

Generated 2026-09-12 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **833** · combo-gated: **52** · solvable with no ability: 70 · every kit disqualified by one of its own cards: 526 · a kit survived but no pair cleared: 156 · failed the high-trial confirm: 29

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
| `duchess+vanguard` | 3 | L8 L9 | 83% | 1 | 0 |
| `page+rewind` | 3 | L7 L8 | 77% | 1 | 0 |
| `aegis+dragon` | 2 | L8 L10 | 80% | 2 | 0 |
| `bishop-step+boulder` | 2 | L8 | 100% | 0 | 0 |
| `bishop-step+decoy` | 2 | L7 L8 | 93% | 0 | 0 |
| `bishop-step+rabies-dart` | 2 | L8 | 97% | 0 | 0 |
| `boulder+dragon` | 2 | L7 L9 | 70% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `convert+smoke` | 2 | L7 L10 | 63% | 2 | 0 |
| `decoy+dragon` | 2 | L8 | 80% | 2 | 0 |
| `dragon+freeze-ray` | 2 | L7 L9 | 97% | 0 | 0 |
| `poison-dart+queen-pulse` | 2 | L8 L9 | 83% | 2 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `aegis+bishop-step` | 1 | L9 | 100% | 0 | 0 |
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
| `decoy+page` | 1 | L7 | 63% | 1 | 0 |
| `decoy+queen-pulse` | 1 | L7 | 60% | 1 | 0 |
| `decoy+summon-knight` | 1 | L8 | 77% | 1 | 0 |
| `dragon+rewind` | 1 | L9 | 100% | 0 | 0 |
| `dragon+smoke` | 1 | L7 | 60% | 0 | 0 |
| `dragon+twin` | 1 | L9 | 73% | 0 | 0 |
| `dragon+vanguard` | 1 | L10 | 73% | 1 | 0 |
| `duchess+freeze-ray` | 1 | L9 | 97% | 0 | 0 |
| `duchess+rabies-dart` | 1 | L8 | 73% | 0 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `freeze-ray+knight-hop` | 1 | L7 | 100% | 0 | 0 |
| `freeze-ray+page` | 1 | L10 | 67% | 1 | 0 |
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
| `bishop-step` | 12 | 13 | `aegis+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 11 | 13 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+rewind`, `dragon+smoke`, `dragon+twin`, `dragon+vanguard` |
| `smoke` | 8 | 10 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `queen-pulse` | 8 | 9 | `aegis+queen-pulse`, `become-king+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+vanguard` |
| `vanguard` | 7 | 10 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `freeze-ray` | 7 | 9 | `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `twin` | 7 | 6 | `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `summon-knight` | 7 | 5 | `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `freeze-ray+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `decoy` | 6 | 8 | `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+page`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `duchess` | 6 | 7 | `bishop-squire+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+rabies-dart`, `duchess+swap`, `duchess+vanguard` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `rewind` | 5 | 9 | `bishop-step+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `page` | 5 | 7 | `bishop-step+page`, `decoy+page`, `freeze-ray+page`, `page+rewind`, `page+smoke` |
| `convert` | 5 | 5 | `bishop-step+convert`, `convert+decoy`, `convert+queen-pulse`, `convert+smoke`, `convert+summon-knight` |
| `boulder` | 4 | 7 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `bishop-squire` | 4 | 6 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+swap`, `bishop-squire+vanguard` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `aegis` | 3 | 4 | `aegis+bishop-step`, `aegis+dragon`, `aegis+queen-pulse` |
| `rabies-dart` | 3 | 4 | `bishop-step+rabies-dart`, `duchess+rabies-dart`, `queen-pulse+rabies-dart` |
| `become-king` | 2 | 2 | `become-king+dragon`, `become-king+queen-pulse` |
| `poison-dart` | 1 | 2 | `poison-dart+queen-pulse` |
| `sacrifice` | 1 | 1 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 54 |
| `aegis+decoy` | 29 |
| `boulder+rewind` | 29 |
| `magnet+rewind` | 29 |
| `sacrifice+smoke` | 29 |
| `become-king+bishop-step` | 27 |
| `rabies-dart+twin` | 27 |
| `boulder+convert` | 26 |
| `freeze-ray+sacrifice` | 26 |
| `aegis+twin` | 25 |
| `bishop-squire+page` | 25 |
| `duchess+sacrifice` | 25 |
| `become-king+duchess` | 24 |
| `freeze-ray+rabies-dart` | 23 |
| `magnet+sacrifice` | 23 |
| `magnet+page` | 22 |
| `rewind+smoke` | 22 |
| `aegis+boulder` | 21 |
| `aegis+summon-knight` | 21 |
| `bishop-squire+smoke` | 21 |
| `convert+vanguard` | 21 |
| `magnet+smoke` | 21 |
| `magnet+summon-knight` | 21 |
| `rabies-dart+sacrifice` | 21 |
| `become-king+vanguard` | 20 |
| `bishop-squire+freeze-ray` | 20 |
| `decoy+freeze-ray` | 20 |
| `decoy+poison-dart` | 20 |
| `magnet+poison-dart` | 20 |
| `magnet+rabies-dart` | 20 |
| `poison-dart+summon-knight` | 20 |
| `sacrifice+vanguard` | 20 |
| `become-king+page` | 19 |
| `become-king+summon-knight` | 19 |
| `bishop-squire+convert` | 19 |
| `bishop-step+duchess` | 19 |
| `boulder+page` | 19 |
| `boulder+vanguard` | 19 |
| `decoy+duchess` | 19 |
| `magnet+queen-pulse` | 19 |
| `page+summon-knight` | 19 |
| `poison-dart+rabies-dart` | 19 |
| `queen-pulse+rewind` | 19 |
| `summon-knight+vanguard` | 19 |
| `aegis+bishop-squire` | 18 |
| `aegis+magnet` | 18 |
| `become-king+bishop-squire` | 18 |
| `become-king+freeze-ray` | 18 |
| `become-king+rewind` | 18 |
| `bishop-squire+poison-dart` | 18 |
| `bishop-squire+rabies-dart` | 18 |
| `bishop-step+magnet` | 18 |
| `boulder+decoy` | 18 |
| `boulder+freeze-ray` | 18 |
| `boulder+magnet` | 18 |
| `boulder+poison-dart` | 18 |
| `boulder+queen-pulse` | 18 |
| `boulder+rabies-dart` | 18 |
| `convert+rabies-dart` | 18 |
| `decoy+magnet` | 18 |
| `dragon+magnet` | 18 |
| `duchess+magnet` | 18 |
| `duchess+poison-dart` | 18 |
| `duchess+rewind` | 18 |
| `duchess+smoke` | 18 |
| `freeze-ray+poison-dart` | 18 |
| `freeze-ray+vanguard` | 18 |
| `page+poison-dart` | 18 |
| `page+twin` | 18 |
| `poison-dart+smoke` | 18 |
| `poison-dart+twin` | 18 |
| `rabies-dart+smoke` | 18 |
| `sacrifice+summon-knight` | 18 |
| `summon-knight+twin` | 18 |
| `aegis+duchess` | 17 |
| `aegis+freeze-ray` | 17 |
| `aegis+page` | 17 |
| `aegis+poison-dart` | 17 |
| `aegis+rabies-dart` | 17 |
| `become-king+boulder` | 17 |
| `become-king+convert` | 17 |
| `become-king+decoy` | 17 |
| `become-king+magnet` | 17 |
| `become-king+poison-dart` | 17 |
| `become-king+sacrifice` | 17 |
| `become-king+twin` | 17 |
| `bishop-squire+decoy` | 17 |
| `bishop-squire+magnet` | 17 |
| `bishop-squire+queen-pulse` | 17 |
| `bishop-squire+rewind` | 17 |
| `bishop-squire+sacrifice` | 17 |
| `bishop-squire+summon-knight` | 17 |
| `bishop-squire+twin` | 17 |
| `bishop-step+poison-dart` | 17 |
| `bishop-step+sacrifice` | 17 |
| `bishop-step+summon-knight` | 17 |
| `boulder+duchess` | 17 |
| `boulder+sacrifice` | 17 |
| `boulder+smoke` | 17 |
| `convert+dragon` | 17 |
| `convert+duchess` | 17 |
| `convert+freeze-ray` | 17 |
| `convert+magnet` | 17 |
| `convert+page` | 17 |
| `convert+rewind` | 17 |
| `convert+sacrifice` | 17 |
| `convert+twin` | 17 |
| `decoy+rewind` | 17 |
| `decoy+sacrifice` | 17 |
| `decoy+smoke` | 17 |
| `decoy+twin` | 17 |
| `decoy+vanguard` | 17 |
| `dragon+page` | 17 |
| `dragon+poison-dart` | 17 |
| `dragon+rabies-dart` | 17 |
| `dragon+sacrifice` | 17 |
| `dragon+summon-knight` | 17 |
| `duchess+page` | 17 |
| `duchess+queen-pulse` | 17 |
| `freeze-ray+magnet` | 17 |
| `freeze-ray+queen-pulse` | 17 |
| `freeze-ray+rewind` | 17 |
| `magnet+twin` | 17 |
| `magnet+vanguard` | 17 |
| `page+queen-pulse` | 17 |
| `page+rabies-dart` | 17 |
| `page+vanguard` | 17 |
| `poison-dart+rewind` | 17 |
| `poison-dart+sacrifice` | 17 |
| `poison-dart+vanguard` | 17 |
| `queen-pulse+sacrifice` | 17 |
| `queen-pulse+summon-knight` | 17 |
| `queen-pulse+twin` | 17 |
| `rabies-dart+rewind` | 17 |
| `rabies-dart+vanguard` | 17 |
| `rewind+sacrifice` | 17 |
| `rewind+vanguard` | 17 |
| `smoke+vanguard` | 17 |
| `aegis+convert` | 16 |
| `aegis+vanguard` | 16 |
| `become-king+rabies-dart` | 16 |
| `bishop-squire+bishop-step` | 16 |
| `bishop-squire+dragon` | 16 |
| `dragon+queen-pulse` | 16 |
| `duchess+summon-knight` | 16 |
| `twin+vanguard` | 16 |
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