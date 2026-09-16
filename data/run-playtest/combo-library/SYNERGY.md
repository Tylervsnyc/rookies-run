# Rookie's Revenge — pair synergy report

Generated 2026-09-16 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability <= 8%, every single card in K <= 8%, and at least one **pair** drawn from K inside 60-80% (the ceiling proves the level is HARD, not just that the pair is REQUIRED — spec.ts).

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **1197** · combo-gated: **65** · solvable with no ability: 72 · every kit disqualified by one of its own cards: 782 · a kit survived but no pair cleared: 229 · failed the high-trial confirm: 49

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-step+rewind` | 5 | L7 L8 L9 | 100% | 3 | 0 |
| `dragon+duchess` | 4 | L6 L7 L8 L9 | 93% | 2 | 0 |
| `page+rewind` | 4 | L7 L8 | 77% | 2 | 0 |
| `become-king+bishop-step` | 3 | L7 L8 | 80% | 0 | 0 |
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-step+decoy` | 3 | L7 L8 L9 | 93% | 1 | 0 |
| `bishop-step+dragon` | 3 | L7 L9 | 100% | 0 | 0 |
| `bishop-step+freeze-ray` | 3 | L8 | 100% | 1 | 0 |
| `bishop-step+rabies-dart` | 3 | L7 L8 | 97% | 0 | 0 |
| `bishop-step+smoke` | 3 | L7 L8 | 100% | 0 | 0 |
| `bishop-step+vanguard` | 3 | L7 L8 | 100% | 1 | 0 |
| `convert+smoke` | 3 | L7 L8 L10 | 63% | 3 | 0 |
| `duchess+vanguard` | 3 | L8 L9 | 83% | 1 | 0 |
| `poison-dart+queen-pulse` | 3 | L8 L9 | 83% | 2 | 0 |
| `aegis+dragon` | 2 | L8 L10 | 80% | 2 | 0 |
| `bishop-step+boulder` | 2 | L8 | 100% | 0 | 0 |
| `bishop-step+convert` | 2 | L7 | 77% | 0 | 0 |
| `boulder+dragon` | 2 | L7 L9 | 70% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `boulder+summon-knight` | 2 | L7 | 87% | 1 | 0 |
| `decoy+dragon` | 2 | L8 | 80% | 2 | 0 |
| `dragon+freeze-ray` | 2 | L7 L9 | 97% | 0 | 0 |
| `dragon+vanguard` | 2 | L9 L10 | 77% | 2 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `aegis+bishop-step` | 1 | L9 | 100% | 0 | 0 |
| `aegis+queen-pulse` | 1 | L8 | 67% | 1 | 0 |
| `become-king+dragon` | 1 | L7 | 77% | 0 | 0 |
| `become-king+poison-dart` | 1 | L8 | 73% | 0 | 0 |
| `become-king+queen-pulse` | 1 | L8 | 60% | 1 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-squire+queen-pulse` | 1 | L9 | 63% | 0 | 0 |
| `bishop-squire+vanguard` | 1 | L9 | 87% | 1 | 0 |
| `bishop-step+page` | 1 | L7 | 60% | 1 | 0 |
| `bishop-step+poison-dart` | 1 | L7 | 70% | 0 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `convert+decoy` | 1 | L7 | 63% | 0 | 0 |
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
| `bishop-step` | 14 | 18 | `aegis+bishop-step`, `become-king+bishop-step`, `bishop-step+boulder`, `bishop-step+convert`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+poison-dart`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 12 | 15 | `aegis+dragon`, `become-king+dragon`, `bishop-step+dragon`, `boulder+dragon`, `decoy+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+poison-dart`, `dragon+rewind`, `dragon+smoke`, `dragon+twin`, `dragon+vanguard` |
| `queen-pulse` | 10 | 11 | `aegis+queen-pulse`, `become-king+queen-pulse`, `bishop-squire+queen-pulse`, `convert+queen-pulse`, `decoy+queen-pulse`, `freeze-ray+queen-pulse`, `poison-dart+queen-pulse`, `queen-pulse+rabies-dart`, `queen-pulse+smoke`, `queen-pulse+vanguard` |
| `smoke` | 8 | 11 | `bishop-step+smoke`, `convert+smoke`, `dragon+smoke`, `knight-hop+smoke`, `page+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `freeze-ray` | 8 | 10 | `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop`, `freeze-ray+page`, `freeze-ray+queen-pulse`, `freeze-ray+summon-knight`, `freeze-ray+twin` |
| `vanguard` | 7 | 11 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `dragon+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `queen-pulse+vanguard`, `swap+vanguard` |
| `page` | 7 | 10 | `bishop-step+page`, `convert+page`, `decoy+page`, `duchess+page`, `freeze-ray+page`, `page+rewind`, `page+smoke` |
| `convert` | 7 | 9 | `bishop-step+convert`, `convert+decoy`, `convert+page`, `convert+queen-pulse`, `convert+rewind`, `convert+smoke`, `convert+summon-knight` |
| `duchess` | 7 | 8 | `bishop-squire+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+page`, `duchess+rabies-dart`, `duchess+swap`, `duchess+vanguard` |
| `twin` | 7 | 6 | `bishop-step+twin`, `dragon+twin`, `freeze-ray+twin`, `knight-hop+twin`, `rewind+twin`, `sacrifice+twin`, `smoke+twin` |
| `summon-knight` | 7 | 6 | `boulder+summon-knight`, `convert+summon-knight`, `decoy+summon-knight`, `freeze-ray+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `rewind` | 6 | 12 | `bishop-step+rewind`, `convert+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `decoy` | 6 | 9 | `bishop-step+decoy`, `convert+decoy`, `decoy+dragon`, `decoy+page`, `decoy+queen-pulse`, `decoy+summon-knight` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `bishop-squire` | 5 | 7 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+queen-pulse`, `bishop-squire+swap`, `bishop-squire+vanguard` |
| `boulder` | 4 | 8 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `poison-dart` | 4 | 6 | `become-king+poison-dart`, `bishop-step+poison-dart`, `dragon+poison-dart`, `poison-dart+queen-pulse` |
| `become-king` | 4 | 5 | `become-king+bishop-step`, `become-king+dragon`, `become-king+poison-dart`, `become-king+queen-pulse` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `rabies-dart` | 3 | 5 | `bishop-step+rabies-dart`, `duchess+rabies-dart`, `queen-pulse+rabies-dart` |
| `aegis` | 3 | 4 | `aegis+bishop-step`, `aegis+dragon`, `aegis+queen-pulse` |
| `sacrifice` | 1 | 1 | `sacrifice+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 77 |
| `aegis+decoy` | 42 |
| `aegis+twin` | 40 |
| `sacrifice+smoke` | 40 |
| `boulder+rewind` | 39 |
| `rabies-dart+twin` | 39 |
| `boulder+convert` | 37 |
| `bishop-squire+page` | 35 |
| `rewind+smoke` | 35 |
| `magnet+rewind` | 33 |
| `duchess+sacrifice` | 32 |
| `freeze-ray+sacrifice` | 32 |
| `rabies-dart+sacrifice` | 31 |
| `become-king+vanguard` | 30 |
| `freeze-ray+rabies-dart` | 30 |
| `poison-dart+summon-knight` | 30 |
| `summon-knight+vanguard` | 30 |
| `become-king+duchess` | 29 |
| `magnet+page` | 29 |
| `magnet+sacrifice` | 29 |
| `poison-dart+rabies-dart` | 29 |
| `boulder+page` | 28 |
| `convert+vanguard` | 28 |
| `decoy+poison-dart` | 28 |
| `become-king+bishop-squire` | 27 |
| `become-king+page` | 27 |
| `bishop-squire+smoke` | 27 |
| `poison-dart+twin` | 27 |
| `aegis+summon-knight` | 26 |
| `bishop-squire+summon-knight` | 26 |
| `boulder+magnet` | 26 |
| `decoy+freeze-ray` | 26 |
| `freeze-ray+vanguard` | 26 |
| `magnet+poison-dart` | 26 |
| `page+summon-knight` | 26 |
| `rabies-dart+rewind` | 26 |
| `sacrifice+vanguard` | 26 |
| `aegis+boulder` | 25 |
| `become-king+boulder` | 25 |
| `bishop-squire+convert` | 25 |
| `bishop-squire+magnet` | 25 |
| `bishop-squire+rewind` | 25 |
| `bishop-step+magnet` | 25 |
| `boulder+decoy` | 25 |
| `boulder+duchess` | 25 |
| `boulder+freeze-ray` | 25 |
| `boulder+poison-dart` | 25 |
| `boulder+smoke` | 25 |
| `convert+twin` | 25 |
| `decoy+smoke` | 25 |
| `decoy+twin` | 25 |
| `dragon+rabies-dart` | 25 |
| `dragon+sacrifice` | 25 |
| `magnet+summon-knight` | 25 |
| `magnet+vanguard` | 25 |
| `poison-dart+smoke` | 25 |
| `rabies-dart+smoke` | 25 |
| `sacrifice+summon-knight` | 25 |
| `twin+vanguard` | 25 |
| `aegis+bishop-squire` | 24 |
| `aegis+freeze-ray` | 24 |
| `aegis+magnet` | 24 |
| `aegis+page` | 24 |
| `aegis+poison-dart` | 24 |
| `aegis+rabies-dart` | 24 |
| `aegis+vanguard` | 24 |
| `become-king+decoy` | 24 |
| `become-king+freeze-ray` | 24 |
| `become-king+magnet` | 24 |
| `become-king+rabies-dart` | 24 |
| `become-king+summon-knight` | 24 |
| `become-king+twin` | 24 |
| `bishop-squire+bishop-step` | 24 |
| `bishop-squire+decoy` | 24 |
| `bishop-squire+dragon` | 24 |
| `bishop-squire+freeze-ray` | 24 |
| `bishop-squire+poison-dart` | 24 |
| `bishop-squire+rabies-dart` | 24 |
| `bishop-squire+sacrifice` | 24 |
| `bishop-step+duchess` | 24 |
| `bishop-step+summon-knight` | 24 |
| `boulder+queen-pulse` | 24 |
| `boulder+rabies-dart` | 24 |
| `boulder+sacrifice` | 24 |
| `boulder+vanguard` | 24 |
| `convert+dragon` | 24 |
| `convert+duchess` | 24 |
| `convert+freeze-ray` | 24 |
| `convert+magnet` | 24 |
| `convert+rabies-dart` | 24 |
| `convert+sacrifice` | 24 |
| `decoy+duchess` | 24 |
| `decoy+magnet` | 24 |
| `decoy+rewind` | 24 |
| `decoy+sacrifice` | 24 |
| `decoy+vanguard` | 24 |
| `dragon+magnet` | 24 |
| `dragon+page` | 24 |
| `duchess+magnet` | 24 |
| `duchess+poison-dart` | 24 |
| `duchess+queen-pulse` | 24 |
| `duchess+rewind` | 24 |
| `duchess+smoke` | 24 |
| `duchess+summon-knight` | 24 |
| `freeze-ray+magnet` | 24 |
| `freeze-ray+poison-dart` | 24 |
| `freeze-ray+rewind` | 24 |
| `magnet+queen-pulse` | 24 |
| `magnet+rabies-dart` | 24 |
| `magnet+smoke` | 24 |
| `magnet+twin` | 24 |
| `page+poison-dart` | 24 |
| `page+queen-pulse` | 24 |
| `page+rabies-dart` | 24 |
| `page+twin` | 24 |
| `page+vanguard` | 24 |
| `poison-dart+rewind` | 24 |
| `poison-dart+sacrifice` | 24 |
| `poison-dart+vanguard` | 24 |
| `queen-pulse+rewind` | 24 |
| `queen-pulse+sacrifice` | 24 |
| `queen-pulse+summon-knight` | 24 |
| `queen-pulse+twin` | 24 |
| `rabies-dart+vanguard` | 24 |
| `rewind+sacrifice` | 24 |
| `rewind+vanguard` | 24 |
| `smoke+vanguard` | 24 |
| `summon-knight+twin` | 24 |
| `aegis+convert` | 23 |
| `aegis+duchess` | 23 |
| `become-king+convert` | 23 |
| `become-king+rewind` | 23 |
| `become-king+sacrifice` | 23 |
| `bishop-squire+twin` | 23 |
| `bishop-step+sacrifice` | 23 |
| `dragon+queen-pulse` | 23 |
| `dragon+summon-knight` | 23 |
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