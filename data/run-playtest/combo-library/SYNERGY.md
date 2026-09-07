# Rookie's Revenge — pair synergy report

Generated 2026-09-07 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability ~0%, every single card in K ~0%, and at least one **pair** drawn from K >= 60%.

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **323** · combo-gated: **21** · solvable with no ability: 69 · every kit disqualified by one of its own cards: 169 · a kit survived but no pair cleared: 54 · failed the high-trial confirm: 10

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-step+dragon` | 3 | L7 L9 | 100% | 0 | 0 |
| `bishop-step+decoy` | 2 | L7 L8 | 93% | 0 | 0 |
| `bishop-step+freeze-ray` | 2 | L8 | 100% | 1 | 0 |
| `bishop-step+smoke` | 2 | L7 | 100% | 0 | 0 |
| `boulder+dragon` | 2 | L7 L9 | 70% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `dragon+duchess` | 2 | L6 L9 | 93% | 0 | 0 |
| `dragon+freeze-ray` | 2 | L7 L9 | 97% | 0 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `aegis+bishop-step` | 1 | L9 | 100% | 0 | 0 |
| `aegis+dragon` | 1 | L10 | 80% | 1 | 0 |
| `become-king+queen-pulse` | 1 | L8 | 60% | 1 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-squire+vanguard` | 1 | L9 | 87% | 1 | 0 |
| `bishop-step+boulder` | 1 | L8 | 100% | 0 | 0 |
| `bishop-step+page` | 1 | L7 | 60% | 1 | 0 |
| `bishop-step+rabies-dart` | 1 | L8 | 97% | 0 | 0 |
| `bishop-step+rewind` | 1 | L8 | 100% | 0 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `bishop-step+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `boulder+summon-knight` | 1 | L7 | 87% | 0 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `dragon+rewind` | 1 | L9 | 100% | 0 | 0 |
| `dragon+smoke` | 1 | L7 | 60% | 0 | 0 |
| `dragon+twin` | 1 | L9 | 73% | 0 | 0 |
| `duchess+freeze-ray` | 1 | L9 | 97% | 0 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `duchess+vanguard` | 1 | L9 | 83% | 0 | 0 |
| `freeze-ray+knight-hop` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+smoke` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+twin` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `page+rewind` | 1 | L7 | 77% | 0 | 0 |
| `queen-pulse+smoke` | 1 | L9 | 70% | 1 | 0 |
| `rewind+summon-knight` | 1 | L7 | 93% | 0 | 0 |
| `rewind+twin` | 1 | L7 | 67% | 0 | 0 |
| `smoke+summon-knight` | 1 | L7 | 97% | 0 | 0 |
| `swap+vanguard` | 1 | L7 | 100% | 0 | 0 |

## Socket abilities — which cards show up in the most gating pairs

The card that appears in the most winning pairs is the one to build future runs around.

| ability | gating pairs it appears in | gated levels | pairs |
|---|---|---|---|
| `bishop-step` | 11 | 7 | `aegis+bishop-step`, `bishop-step+boulder`, `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+freeze-ray`, `bishop-step+page`, `bishop-step+rabies-dart`, `bishop-step+rewind`, `bishop-step+smoke`, `bishop-step+twin`, `bishop-step+vanguard` |
| `dragon` | 8 | 6 | `aegis+dragon`, `bishop-step+dragon`, `boulder+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+rewind`, `dragon+smoke`, `dragon+twin` |
| `smoke` | 6 | 6 | `bishop-step+smoke`, `dragon+smoke`, `knight-hop+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `vanguard` | 5 | 4 | `bishop-squire+vanguard`, `bishop-step+vanguard`, `duchess+vanguard`, `knight-hop+vanguard`, `swap+vanguard` |
| `rewind` | 5 | 4 | `bishop-step+rewind`, `dragon+rewind`, `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `twin` | 5 | 4 | `bishop-step+twin`, `dragon+twin`, `knight-hop+twin`, `rewind+twin`, `smoke+twin` |
| `duchess` | 5 | 3 | `bishop-squire+duchess`, `dragon+duchess`, `duchess+freeze-ray`, `duchess+swap`, `duchess+vanguard` |
| `summon-knight` | 5 | 3 | `boulder+summon-knight`, `convert+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `bishop-squire` | 4 | 6 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+swap`, `bishop-squire+vanguard` |
| `boulder` | 4 | 6 | `bishop-step+boulder`, `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `freeze-ray` | 4 | 5 | `bishop-step+freeze-ray`, `dragon+freeze-ray`, `duchess+freeze-ray`, `freeze-ray+knight-hop` |
| `aegis` | 2 | 2 | `aegis+bishop-step`, `aegis+dragon` |
| `queen-pulse` | 2 | 2 | `become-king+queen-pulse`, `queen-pulse+smoke` |
| `page` | 2 | 2 | `bishop-step+page`, `page+rewind` |
| `decoy` | 1 | 2 | `bishop-step+decoy` |
| `become-king` | 1 | 1 | `become-king+queen-pulse` |
| `rabies-dart` | 1 | 1 | `bishop-step+rabies-dart` |
| `convert` | 1 | 1 | `convert+summon-knight` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 16 |
| `magnet+rewind` | 12 |
| `bishop-squire+smoke` | 11 |
| `freeze-ray+sacrifice` | 11 |
| `magnet+poison-dart` | 11 |
| `aegis+boulder` | 10 |
| `bishop-squire+summon-knight` | 10 |
| `magnet+page` | 10 |
| `magnet+rabies-dart` | 10 |
| `rabies-dart+twin` | 10 |
| `sacrifice+smoke` | 10 |
| `bishop-squire+magnet` | 9 |
| `boulder+convert` | 9 |
| `convert+freeze-ray` | 9 |
| `convert+twin` | 9 |
| `decoy+duchess` | 9 |
| `duchess+sacrifice` | 9 |
| `magnet+sacrifice` | 9 |
| `poison-dart+summon-knight` | 9 |
| `queen-pulse+rewind` | 9 |
| `become-king+bishop-step` | 8 |
| `become-king+duchess` | 8 |
| `boulder+page` | 8 |
| `decoy+poison-dart` | 8 |
| `dragon+queen-pulse` | 8 |
| `duchess+magnet` | 8 |
| `freeze-ray+magnet` | 8 |
| `page+smoke` | 8 |
| `page+summon-knight` | 8 |
| `poison-dart+rewind` | 8 |
| `rabies-dart+smoke` | 8 |
| `rewind+smoke` | 8 |
| `sacrifice+twin` | 8 |
| `summon-knight+twin` | 8 |
| `aegis+decoy` | 7 |
| `aegis+twin` | 7 |
| `become-king+boulder` | 7 |
| `become-king+page` | 7 |
| `become-king+twin` | 7 |
| `bishop-squire+page` | 7 |
| `boulder+decoy` | 7 |
| `boulder+poison-dart` | 7 |
| `boulder+vanguard` | 7 |
| `convert+rewind` | 7 |
| `dragon+summon-knight` | 7 |
| `dragon+vanguard` | 7 |
| `freeze-ray+rabies-dart` | 7 |
| `freeze-ray+summon-knight` | 7 |
| `poison-dart+queen-pulse` | 7 |
| `poison-dart+vanguard` | 7 |
| `queen-pulse+rabies-dart` | 7 |
| `queen-pulse+vanguard` | 7 |
| `sacrifice+vanguard` | 7 |
| `twin+vanguard` | 7 |
| `aegis+magnet` | 6 |
| `aegis+queen-pulse` | 6 |
| `aegis+summon-knight` | 6 |
| `become-king+dragon` | 6 |
| `become-king+freeze-ray` | 6 |
| `become-king+magnet` | 6 |
| `become-king+rewind` | 6 |
| `become-king+vanguard` | 6 |
| `bishop-squire+bishop-step` | 6 |
| `bishop-squire+convert` | 6 |
| `bishop-squire+decoy` | 6 |
| `bishop-squire+freeze-ray` | 6 |
| `bishop-squire+poison-dart` | 6 |
| `bishop-squire+queen-pulse` | 6 |
| `bishop-squire+rabies-dart` | 6 |
| `bishop-squire+rewind` | 6 |
| `bishop-squire+sacrifice` | 6 |
| `bishop-step+convert` | 6 |
| `bishop-step+magnet` | 6 |
| `boulder+duchess` | 6 |
| `boulder+freeze-ray` | 6 |
| `boulder+magnet` | 6 |
| `boulder+queen-pulse` | 6 |
| `boulder+rabies-dart` | 6 |
| `boulder+rewind` | 6 |
| `boulder+smoke` | 6 |
| `convert+decoy` | 6 |
| `convert+dragon` | 6 |
| `convert+duchess` | 6 |
| `convert+magnet` | 6 |
| `convert+page` | 6 |
| `convert+sacrifice` | 6 |
| `convert+smoke` | 6 |
| `convert+vanguard` | 6 |
| `decoy+dragon` | 6 |
| `decoy+freeze-ray` | 6 |
| `decoy+page` | 6 |
| `decoy+rewind` | 6 |
| `decoy+summon-knight` | 6 |
| `decoy+twin` | 6 |
| `decoy+vanguard` | 6 |
| `dragon+magnet` | 6 |
| `dragon+poison-dart` | 6 |
| `dragon+rabies-dart` | 6 |
| `dragon+sacrifice` | 6 |
| `duchess+page` | 6 |
| `duchess+poison-dart` | 6 |
| `duchess+queen-pulse` | 6 |
| `duchess+rabies-dart` | 6 |
| `duchess+rewind` | 6 |
| `duchess+smoke` | 6 |
| `freeze-ray+page` | 6 |
| `freeze-ray+poison-dart` | 6 |
| `freeze-ray+queen-pulse` | 6 |
| `freeze-ray+rewind` | 6 |
| `freeze-ray+twin` | 6 |
| `freeze-ray+vanguard` | 6 |
| `magnet+queen-pulse` | 6 |
| `magnet+smoke` | 6 |
| `magnet+summon-knight` | 6 |
| `magnet+twin` | 6 |
| `magnet+vanguard` | 6 |
| `page+poison-dart` | 6 |
| `page+rabies-dart` | 6 |
| `page+twin` | 6 |
| `poison-dart+rabies-dart` | 6 |
| `poison-dart+smoke` | 6 |
| `poison-dart+twin` | 6 |
| `rewind+vanguard` | 6 |
| `sacrifice+summon-knight` | 6 |
| `smoke+vanguard` | 6 |
| `aegis+bishop-squire` | 5 |
| `aegis+convert` | 5 |
| `aegis+duchess` | 5 |
| `aegis+freeze-ray` | 5 |
| `aegis+page` | 5 |
| `aegis+poison-dart` | 5 |
| `aegis+rabies-dart` | 5 |
| `aegis+vanguard` | 5 |
| `become-king+bishop-squire` | 5 |
| `become-king+convert` | 5 |
| `become-king+decoy` | 5 |
| `become-king+rabies-dart` | 5 |
| `become-king+sacrifice` | 5 |
| `become-king+summon-knight` | 5 |
| `bishop-squire+dragon` | 5 |
| `bishop-squire+twin` | 5 |
| `bishop-step+duchess` | 5 |
| `bishop-step+poison-dart` | 5 |
| `bishop-step+sacrifice` | 5 |
| `bishop-step+summon-knight` | 5 |
| `boulder+sacrifice` | 5 |
| `convert+queen-pulse` | 5 |
| `convert+rabies-dart` | 5 |
| `decoy+magnet` | 5 |
| `decoy+queen-pulse` | 5 |
| `decoy+sacrifice` | 5 |
| `decoy+smoke` | 5 |
| `dragon+page` | 5 |
| `duchess+summon-knight` | 5 |
| `page+queen-pulse` | 5 |
| `page+vanguard` | 5 |
| `poison-dart+sacrifice` | 5 |
| `queen-pulse+sacrifice` | 5 |
| `queen-pulse+summon-knight` | 5 |
| `queen-pulse+twin` | 5 |
| `rabies-dart+rewind` | 5 |
| `rabies-dart+sacrifice` | 5 |
| `rabies-dart+vanguard` | 5 |
| `rewind+sacrifice` | 5 |
| `summon-knight+vanguard` | 5 |
| `become-king+poison-dart` | 4 |
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