# Rookie's Revenge — pair synergy report

Generated 2026-09-06 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability ~0%, every single card in K ~0%, and at least one **pair** drawn from K >= 60%.

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **263** · combo-gated: **14** · solvable with no ability: 69 · every kit disqualified by one of its own cards: 131 · a kit survived but no pair cleared: 43 · failed the high-trial confirm: 6

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `bishop-step+smoke` | 2 | L7 | 100% | 0 | 0 |
| `boulder+dragon` | 2 | L7 L9 | 70% | 1 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `smoke+twin` | 2 | L7 L9 | 87% | 1 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-step+decoy` | 1 | L7 | 93% | 0 | 0 |
| `bishop-step+dragon` | 1 | L7 | 100% | 0 | 0 |
| `bishop-step+freeze-ray` | 1 | L8 | 100% | 1 | 0 |
| `bishop-step+twin` | 1 | L7 | 97% | 0 | 0 |
| `bishop-step+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `boulder+summon-knight` | 1 | L7 | 87% | 0 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `dragon+duchess` | 1 | L6 | 73% | 0 | 0 |
| `dragon+freeze-ray` | 1 | L7 | 87% | 0 | 0 |
| `dragon+smoke` | 1 | L7 | 60% | 0 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
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
| `smoke` | 6 | 6 | `bishop-step+smoke`, `dragon+smoke`, `knight-hop+smoke`, `queen-pulse+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `bishop-step` | 6 | 3 | `bishop-step+decoy`, `bishop-step+dragon`, `bishop-step+freeze-ray`, `bishop-step+smoke`, `bishop-step+twin`, `bishop-step+vanguard` |
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `dragon` | 5 | 3 | `bishop-step+dragon`, `boulder+dragon`, `dragon+duchess`, `dragon+freeze-ray`, `dragon+smoke` |
| `summon-knight` | 5 | 3 | `boulder+summon-knight`, `convert+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `twin` | 4 | 3 | `bishop-step+twin`, `knight-hop+twin`, `rewind+twin`, `smoke+twin` |
| `bishop-squire` | 3 | 5 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+swap` |
| `boulder` | 3 | 5 | `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `freeze-ray` | 3 | 3 | `bishop-step+freeze-ray`, `dragon+freeze-ray`, `freeze-ray+knight-hop` |
| `duchess` | 3 | 2 | `bishop-squire+duchess`, `dragon+duchess`, `duchess+swap` |
| `vanguard` | 3 | 2 | `bishop-step+vanguard`, `knight-hop+vanguard`, `swap+vanguard` |
| `rewind` | 3 | 2 | `page+rewind`, `rewind+summon-knight`, `rewind+twin` |
| `decoy` | 1 | 1 | `bishop-step+decoy` |
| `convert` | 1 | 1 | `convert+summon-knight` |
| `page` | 1 | 1 | `page+rewind` |
| `queen-pulse` | 1 | 1 | `queen-pulse+smoke` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `aegis+sacrifice` | 11 |
| `magnet+poison-dart` | 9 |
| `magnet+rabies-dart` | 8 |
| `rewind+smoke` | 8 |
| `sacrifice+smoke` | 8 |
| `become-king+page` | 7 |
| `bishop-squire+magnet` | 7 |
| `bishop-squire+smoke` | 7 |
| `bishop-squire+summon-knight` | 7 |
| `decoy+duchess` | 7 |
| `duchess+sacrifice` | 7 |
| `magnet+page` | 7 |
| `magnet+rewind` | 7 |
| `page+smoke` | 7 |
| `poison-dart+summon-knight` | 7 |
| `aegis+boulder` | 6 |
| `aegis+decoy` | 6 |
| `become-king+bishop-step` | 6 |
| `become-king+boulder` | 6 |
| `become-king+duchess` | 6 |
| `bishop-squire+page` | 6 |
| `boulder+convert` | 6 |
| `boulder+rabies-dart` | 6 |
| `convert+freeze-ray` | 6 |
| `convert+twin` | 6 |
| `convert+vanguard` | 6 |
| `decoy+poison-dart` | 6 |
| `dragon+queen-pulse` | 6 |
| `dragon+vanguard` | 6 |
| `duchess+magnet` | 6 |
| `duchess+vanguard` | 6 |
| `freeze-ray+magnet` | 6 |
| `freeze-ray+poison-dart` | 6 |
| `freeze-ray+queen-pulse` | 6 |
| `freeze-ray+sacrifice` | 6 |
| `magnet+sacrifice` | 6 |
| `page+summon-knight` | 6 |
| `poison-dart+rewind` | 6 |
| `queen-pulse+rabies-dart` | 6 |
| `queen-pulse+rewind` | 6 |
| `rabies-dart+smoke` | 6 |
| `rabies-dart+twin` | 6 |
| `summon-knight+twin` | 6 |
| `aegis+summon-knight` | 5 |
| `aegis+twin` | 5 |
| `become-king+queen-pulse` | 5 |
| `become-king+twin` | 5 |
| `bishop-squire+bishop-step` | 5 |
| `bishop-squire+freeze-ray` | 5 |
| `bishop-squire+poison-dart` | 5 |
| `bishop-squire+rabies-dart` | 5 |
| `bishop-step+convert` | 5 |
| `bishop-step+magnet` | 5 |
| `bishop-step+poison-dart` | 5 |
| `boulder+decoy` | 5 |
| `boulder+freeze-ray` | 5 |
| `boulder+page` | 5 |
| `boulder+poison-dart` | 5 |
| `boulder+rewind` | 5 |
| `boulder+smoke` | 5 |
| `boulder+vanguard` | 5 |
| `convert+rabies-dart` | 5 |
| `convert+rewind` | 5 |
| `decoy+magnet` | 5 |
| `dragon+rabies-dart` | 5 |
| `duchess+freeze-ray` | 5 |
| `duchess+queen-pulse` | 5 |
| `freeze-ray+rabies-dart` | 5 |
| `freeze-ray+summon-knight` | 5 |
| `page+queen-pulse` | 5 |
| `poison-dart+queen-pulse` | 5 |
| `poison-dart+smoke` | 5 |
| `poison-dart+vanguard` | 5 |
| `sacrifice+summon-knight` | 5 |
| `twin+vanguard` | 5 |
| `aegis+bishop-squire` | 4 |
| `aegis+bishop-step` | 4 |
| `aegis+duchess` | 4 |
| `aegis+magnet` | 4 |
| `aegis+queen-pulse` | 4 |
| `become-king+bishop-squire` | 4 |
| `become-king+convert` | 4 |
| `become-king+decoy` | 4 |
| `become-king+dragon` | 4 |
| `become-king+freeze-ray` | 4 |
| `become-king+magnet` | 4 |
| `become-king+poison-dart` | 4 |
| `become-king+rabies-dart` | 4 |
| `become-king+rewind` | 4 |
| `become-king+summon-knight` | 4 |
| `become-king+vanguard` | 4 |
| `bishop-squire+convert` | 4 |
| `bishop-squire+decoy` | 4 |
| `bishop-squire+dragon` | 4 |
| `bishop-squire+queen-pulse` | 4 |
| `bishop-squire+rewind` | 4 |
| `bishop-squire+sacrifice` | 4 |
| `bishop-squire+twin` | 4 |
| `bishop-squire+vanguard` | 4 |
| `bishop-step+boulder` | 4 |
| `bishop-step+duchess` | 4 |
| `bishop-step+page` | 4 |
| `bishop-step+rabies-dart` | 4 |
| `bishop-step+rewind` | 4 |
| `bishop-step+summon-knight` | 4 |
| `boulder+duchess` | 4 |
| `boulder+magnet` | 4 |
| `boulder+queen-pulse` | 4 |
| `boulder+sacrifice` | 4 |
| `convert+decoy` | 4 |
| `convert+dragon` | 4 |
| `convert+duchess` | 4 |
| `convert+magnet` | 4 |
| `convert+page` | 4 |
| `convert+queen-pulse` | 4 |
| `convert+smoke` | 4 |
| `decoy+dragon` | 4 |
| `decoy+freeze-ray` | 4 |
| `decoy+page` | 4 |
| `decoy+rewind` | 4 |
| `decoy+sacrifice` | 4 |
| `decoy+smoke` | 4 |
| `decoy+summon-knight` | 4 |
| `decoy+twin` | 4 |
| `decoy+vanguard` | 4 |
| `dragon+magnet` | 4 |
| `dragon+poison-dart` | 4 |
| `dragon+rewind` | 4 |
| `dragon+sacrifice` | 4 |
| `dragon+summon-knight` | 4 |
| `duchess+page` | 4 |
| `duchess+poison-dart` | 4 |
| `duchess+rabies-dart` | 4 |
| `duchess+rewind` | 4 |
| `duchess+smoke` | 4 |
| `duchess+summon-knight` | 4 |
| `freeze-ray+page` | 4 |
| `freeze-ray+rewind` | 4 |
| `freeze-ray+twin` | 4 |
| `freeze-ray+vanguard` | 4 |
| `magnet+queen-pulse` | 4 |
| `magnet+smoke` | 4 |
| `magnet+summon-knight` | 4 |
| `magnet+twin` | 4 |
| `magnet+vanguard` | 4 |
| `page+poison-dart` | 4 |
| `page+rabies-dart` | 4 |
| `page+twin` | 4 |
| `page+vanguard` | 4 |
| `poison-dart+rabies-dart` | 4 |
| `poison-dart+sacrifice` | 4 |
| `poison-dart+twin` | 4 |
| `queen-pulse+summon-knight` | 4 |
| `queen-pulse+twin` | 4 |
| `queen-pulse+vanguard` | 4 |
| `rabies-dart+rewind` | 4 |
| `rabies-dart+vanguard` | 4 |
| `rewind+vanguard` | 4 |
| `sacrifice+twin` | 4 |
| `sacrifice+vanguard` | 4 |
| `smoke+vanguard` | 4 |
| `summon-knight+vanguard` | 4 |
| `aegis+convert` | 3 |
| `aegis+dragon` | 3 |
| `aegis+freeze-ray` | 3 |
| `aegis+page` | 3 |
| `aegis+poison-dart` | 3 |
| `aegis+rabies-dart` | 3 |
| `aegis+vanguard` | 3 |
| `become-king+sacrifice` | 3 |
| `bishop-step+sacrifice` | 3 |
| `decoy+queen-pulse` | 3 |
| `dragon+page` | 3 |
| `dragon+twin` | 3 |
| `queen-pulse+sacrifice` | 3 |
| `rabies-dart+sacrifice` | 3 |
| `rewind+sacrifice` | 3 |
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

27 of 253 pairs have never been played against a surviving candidate. Widen with `--max-kits`, or extend `data/run-playtest/pair-hypotheses.json` to reorder the head of the search.

`_scans/` holds the full measured row for every subject scored with `--score-all` (the shipped-run ground truth); `_ledger.jsonl` is the resume ledger.