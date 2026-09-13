# Rookie's Revenge — pair synergy report

Generated 2026-09-13 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **968** · combo-gated: **56** · solvable with no ability: 71 · every kit disqualified by one of its own cards: 612 · a kit survived but no pair cleared: 192 · failed the high-trial confirm: 37

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-step+rewind` | 4 | L7 L8 | 100% | 2 | 0 |
| `dragon+duchess` | 4 | L6 L7 L8 L9 | 93% | 2 | 0 |
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-step+dragon` | 3 | L7 L9 | 100% | 0 | 0 |
| `bishop-step+freeze-ray` | 3 | L8 | 100% | 1 | 0 |
| `bishop-step+rabies-dart` | 3 | L7 L8 | 97% | 0 | 0 |
| `bishop-step+smoke` | 3 | L7 L8 | 100% | 0 | 0 |
| `bishop-step+vanguard` | 3 | L7 L8 | 100% | 1 | 0 |
| `duchess+vanguard` | 3 | L8 L9 | 83% | 1 | 0 |
| `page+rewind` | 3 | L7 L8 | 77% | 1 | 0 |
| `aegis+dragon` | 2 | L8 L10 | 80% | 2 | 0 |
| `become-king+bishop-step` | 2 | L7 | 80% | 0 | 0 |
| `bishop-step+boulder` | 2 | L8 | 100% | 0 | 0 |
| `bishop-step+convert` | 2 | L7 | 77% | 0 | 0 |
| `bishop-step+decoy` | 2 | L7 L8 | 93% | 0 | 0 |
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
| `bishop-step+page` | 1 | L7 | 60% | 1 | 0 |
| `bishop-step+poison-dart` | 1 | L7 | 70% | 0 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `boulder+summon-knight` | 1 | L7 | 87% | 0 | 0 |
| `convert+decoy` | 1 | L7 | 63% | 0 | 0 |
| `convert+page` | 1 | L10 | 63% | 0 | 0 |
| `convert+queen-pulse` | 1 | L7 | 97% | 0 | 0 |
| `convert+rewind` | 1 | L7 | 63% | 0 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `decoy+page` | 1 | L7 | 63% | 1 | 0 |
| `decoy+queen-pulse` | 1 | L7 | 60% | 1 | 0 |
| `decoy+summon-knight` | 1 | L8 | 77% | 1 | 0 |
| `dragon+rewind` | 1 | L9 | 100% | 0 | 0 |
| `dragon+smoke` | 1 | L7 | 60% | 0 | 0 |
| `dragon+twin` | 1 | L9 | 73% | 0 | 0 |
| `dragon+vanguard` | 1 | L10 | 73% | 1 | 0 |
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
| `bishop-step` | 14 | 15 | `aegis+bishop-step`, `become-king+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+poison-dart`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 11 | 13 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+rewind`, `dragon+smoke`, `dragon+twin`, `dragon+vanguard` |
| `queen-pulse` | 9 | 10 | `aegis+queen-pulse`, `become-king+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `freeze-ray+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+vanguard` |
| `freeze-ray` | 8 | 10 | `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+queen-pulse`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `smoke` | 8 | 10 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `vanguard` | 7 | 10 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `page` | 7 | 9 | `bishop-step+page`, `convert+page`, `decoy+page`, `duchess+page`, `freeze-ray+page`, `page+rewind`, `page+smoke` |
| `duchess` | 7 | 8 | `bishop-squire+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+page`, `duchess+rabies-dart`, `duchess+swap`, `duchess+vanguard` |
| `convert` | 7 | 8 | `bishop-step+convert`, `convert+decoy`, `convert+page`, `convert+queen-pulse`, `convert+rewind`, `convert+smoke`, `convert+summon-knight` |
| `twin` | 7 | 6 | `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `summon-knight` | 7 | 5 | `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `freeze-ray+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `rewind` | 6 | 10 | `bishop-step+rewind`, `convert+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `decoy` | 6 | 8 | `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+page`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `boulder` | 4 | 7 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `bishop-squire` | 4 | 6 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+swap`, `bishop-squire+vanguard` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `rabies-dart` | 3 | 5 | `bishop-step+rabies-dart`, `duchess+rabies-dart`, `queen-pulse+rabies-dart` |
| `aegis` | 3 | 4 | `aegis+bishop-step`, `aegis+dragon`, `aegis+queen-pulse` |
| `become-king` | 3 | 4 | `become-king+bishop-step`, `become-king+dragon`, `become-king+queen-pulse` |
| `poison-dart` | 2 | 3 | `bishop-step+poison-dart`, `poison-dart+queen-pulse` |
| `sacrifice` | 1 | 1 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 68 |
| `sacrifice+smoke` | 35 |
| `aegis+decoy` | 34 |
| `aegis+twin` | 34 |
| `boulder+rewind` | 34 |
| `rabies-dart+twin` | 32 |
| `bishop-squire+page` | 30 |
| `boulder+convert` | 30 |
| `freeze-ray+sacrifice` | 30 |
| `magnet+rewind` | 30 |
| `become-king+duchess` | 28 |
| `duchess+sacrifice` | 27 |
| `magnet+sacrifice` | 27 |
| `rabies-dart+sacrifice` | 27 |
| `freeze-ray+rabies-dart` | 26 |
| `magnet+page` | 26 |
| `aegis+summon-knight` | 25 |
| `become-king+vanguard` | 25 |
| `bishop-squire+smoke` | 25 |
| `poison-dart+summon-knight` | 25 |
| `rewind+smoke` | 25 |
| `bishop-squire+convert` | 24 |
| `boulder+page` | 24 |
| `sacrifice+vanguard` | 24 |
| `summon-knight+vanguard` | 24 |
| `aegis+boulder` | 23 |
| `become-king+page` | 23 |
| `boulder+magnet` | 23 |
| `convert+vanguard` | 23 |
| `decoy+freeze-ray` | 23 |
| `dragon+rabies-dart` | 23 |
| `magnet+poison-dart` | 23 |
| `magnet+queen-pulse` | 23 |
| `magnet+rabies-dart` | 23 |
| `magnet+summon-knight` | 23 |
| `page+summon-knight` | 23 |
| `page+twin` | 23 |
| `poison-dart+rabies-dart` | 23 |
| `become-king+bishop-squire` | 22 |
| `become-king+rewind` | 22 |
| `bishop-squire+freeze-ray` | 22 |
| `bishop-squire+poison-dart` | 22 |
| `bishop-squire+twin` | 22 |
| `boulder+vanguard` | 22 |
| `decoy+poison-dart` | 22 |
| `decoy+smoke` | 22 |
| `page+poison-dart` | 22 |
| `queen-pulse+rewind` | 22 |
| `aegis+bishop-squire` | 21 |
| `aegis+freeze-ray` | 21 |
| `aegis+magnet` | 21 |
| `aegis+vanguard` | 21 |
| `become-king+boulder` | 21 |
| `become-king+freeze-ray` | 21 |
| `become-king+magnet` | 21 |
| `become-king+summon-knight` | 21 |
| `bishop-squire+decoy` | 21 |
| `bishop-squire+magnet` | 21 |
| `bishop-squire+rabies-dart` | 21 |
| `bishop-squire+rewind` | 21 |
| `bishop-squire+sacrifice` | 21 |
| `bishop-squire+summon-knight` | 21 |
| `bishop-step+duchess` | 21 |
| `bishop-step+magnet` | 21 |
| `boulder+decoy` | 21 |
| `boulder+duchess` | 21 |
| `boulder+freeze-ray` | 21 |
| `boulder+poison-dart` | 21 |
| `boulder+queen-pulse` | 21 |
| `boulder+smoke` | 21 |
| `convert+duchess` | 21 |
| `convert+magnet` | 21 |
| `convert+twin` | 21 |
| `decoy+duchess` | 21 |
| `decoy+rewind` | 21 |
| `decoy+sacrifice` | 21 |
| `decoy+twin` | 21 |
| `decoy+vanguard` | 21 |
| `dragon+magnet` | 21 |
| `dragon+sacrifice` | 21 |
| `duchess+magnet` | 21 |
| `duchess+rewind` | 21 |
| `duchess+smoke` | 21 |
| `freeze-ray+vanguard` | 21 |
| `magnet+smoke` | 21 |
| `magnet+twin` | 21 |
| `page+rabies-dart` | 21 |
| `poison-dart+rewind` | 21 |
| `poison-dart+sacrifice` | 21 |
| `poison-dart+smoke` | 21 |
| `poison-dart+twin` | 21 |
| `queen-pulse+sacrifice` | 21 |
| `rabies-dart+smoke` | 21 |
| `rewind+sacrifice` | 21 |
| `rewind+vanguard` | 21 |
| `sacrifice+summon-knight` | 21 |
| `smoke+vanguard` | 21 |
| `aegis+convert` | 20 |
| `aegis+duchess` | 20 |
| `aegis+page` | 20 |
| `aegis+poison-dart` | 20 |
| `aegis+rabies-dart` | 20 |
| `become-king+decoy` | 20 |
| `become-king+poison-dart` | 20 |
| `become-king+rabies-dart` | 20 |
| `become-king+sacrifice` | 20 |
| `become-king+twin` | 20 |
| `bishop-squire+bishop-step` | 20 |
| `bishop-squire+dragon` | 20 |
| `bishop-squire+queen-pulse` | 20 |
| `bishop-step+sacrifice` | 20 |
| `bishop-step+summon-knight` | 20 |
| `boulder+rabies-dart` | 20 |
| `boulder+sacrifice` | 20 |
| `convert+dragon` | 20 |
| `convert+freeze-ray` | 20 |
| `convert+rabies-dart` | 20 |
| `convert+sacrifice` | 20 |
| `decoy+magnet` | 20 |
| `dragon+page` | 20 |
| `dragon+poison-dart` | 20 |
| `dragon+summon-knight` | 20 |
| `duchess+poison-dart` | 20 |
| `duchess+queen-pulse` | 20 |
| `duchess+summon-knight` | 20 |
| `freeze-ray+magnet` | 20 |
| `freeze-ray+poison-dart` | 20 |
| `freeze-ray+rewind` | 20 |
| `magnet+vanguard` | 20 |
| `page+queen-pulse` | 20 |
| `page+vanguard` | 20 |
| `poison-dart+vanguard` | 20 |
| `queen-pulse+summon-knight` | 20 |
| `queen-pulse+twin` | 20 |
| `rabies-dart+rewind` | 20 |
| `rabies-dart+vanguard` | 20 |
| `summon-knight+twin` | 20 |
| `twin+vanguard` | 20 |
| `become-king+convert` | 19 |
| `dragon+queen-pulse` | 19 |
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