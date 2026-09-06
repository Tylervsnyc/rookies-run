# Rookie's Revenge — pair synergy report

Generated 2026-09-06 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability ~0%, every single card in K ~0%, and at least one **pair** drawn from K >= 60%.

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **185** · combo-gated: **12** · solvable with no ability: 69 · every kit disqualified by one of its own cards: 89 · a kit survived but no pair cleared: 12 · failed the high-trial confirm: 3

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `bishop-step+freeze-ray` | 1 | L8 | 100% | 1 | 0 |
| `bishop-step+smoke` | 1 | L7 | 100% | 0 | 0 |
| `bishop-step+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `boulder+dragon` | 1 | L9 | 70% | 1 | 0 |
| `boulder+summon-knight` | 1 | L7 | 87% | 0 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `dragon+duchess` | 1 | L6 | 73% | 0 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `freeze-ray+knight-hop` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+smoke` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+twin` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `rewind+summon-knight` | 1 | L7 | 93% | 0 | 0 |
| `smoke+summon-knight` | 1 | L7 | 97% | 0 | 0 |
| `smoke+twin` | 1 | L9 | 87% | 1 | 0 |
| `swap+vanguard` | 1 | L7 | 100% | 0 | 0 |

## Socket abilities — which cards show up in the most gating pairs

The card that appears in the most winning pairs is the one to build future runs around.

| ability | gating pairs it appears in | gated levels | pairs |
|---|---|---|---|
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `summon-knight` | 5 | 3 | `boulder+summon-knight`, `convert+summon-knight`, `rewind+summon-knight`, `smoke+summon-knight`, `summon-knight+swap` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `smoke` | 4 | 4 | `bishop-step+smoke`, `knight-hop+smoke`, `smoke+summon-knight`, `smoke+twin` |
| `bishop-squire` | 3 | 5 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+swap` |
| `boulder` | 3 | 4 | `boulder+dragon`, `boulder+knight-hop`, `boulder+summon-knight` |
| `duchess` | 3 | 2 | `bishop-squire+duchess`, `dragon+duchess`, `duchess+swap` |
| `bishop-step` | 3 | 2 | `bishop-step+freeze-ray`, `bishop-step+smoke`, `bishop-step+vanguard` |
| `vanguard` | 3 | 2 | `bishop-step+vanguard`, `knight-hop+vanguard`, `swap+vanguard` |
| `freeze-ray` | 2 | 2 | `bishop-step+freeze-ray`, `freeze-ray+knight-hop` |
| `dragon` | 2 | 2 | `boulder+dragon`, `dragon+duchess` |
| `twin` | 2 | 2 | `knight-hop+twin`, `smoke+twin` |
| `convert` | 1 | 1 | `convert+summon-knight` |
| `rewind` | 1 | 1 | `rewind+summon-knight` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `bishop-squire+smoke` | 5 |
| `aegis+sacrifice` | 4 |
| `bishop-squire+magnet` | 4 |
| `bishop-squire+poison-dart` | 4 |
| `boulder+convert` | 4 |
| `boulder+vanguard` | 4 |
| `duchess+sacrifice` | 4 |
| `magnet+poison-dart` | 4 |
| `rabies-dart+twin` | 4 |
| `aegis+queen-pulse` | 3 |
| `become-king+duchess` | 3 |
| `become-king+page` | 3 |
| `boulder+decoy` | 3 |
| `boulder+page` | 3 |
| `convert+dragon` | 3 |
| `decoy+duchess` | 3 |
| `decoy+magnet` | 3 |
| `decoy+summon-knight` | 3 |
| `dragon+rewind` | 3 |
| `duchess+freeze-ray` | 3 |
| `freeze-ray+magnet` | 3 |
| `freeze-ray+sacrifice` | 3 |
| `freeze-ray+summon-knight` | 3 |
| `magnet+page` | 3 |
| `magnet+sacrifice` | 3 |
| `queen-pulse+summon-knight` | 3 |
| `rabies-dart+smoke` | 3 |
| `rewind+smoke` | 3 |
| `sacrifice+smoke` | 3 |
| `aegis+bishop-step` | 2 |
| `aegis+boulder` | 2 |
| `aegis+decoy` | 2 |
| `aegis+magnet` | 2 |
| `aegis+page` | 2 |
| `become-king+bishop-squire` | 2 |
| `become-king+boulder` | 2 |
| `become-king+convert` | 2 |
| `become-king+freeze-ray` | 2 |
| `become-king+magnet` | 2 |
| `become-king+sacrifice` | 2 |
| `become-king+vanguard` | 2 |
| `bishop-squire+bishop-step` | 2 |
| `bishop-squire+convert` | 2 |
| `bishop-squire+decoy` | 2 |
| `bishop-squire+freeze-ray` | 2 |
| `bishop-squire+rabies-dart` | 2 |
| `bishop-squire+rewind` | 2 |
| `bishop-squire+sacrifice` | 2 |
| `bishop-squire+summon-knight` | 2 |
| `bishop-squire+twin` | 2 |
| `bishop-squire+vanguard` | 2 |
| `bishop-step+convert` | 2 |
| `bishop-step+magnet` | 2 |
| `bishop-step+sacrifice` | 2 |
| `bishop-step+twin` | 2 |
| `boulder+duchess` | 2 |
| `boulder+freeze-ray` | 2 |
| `boulder+magnet` | 2 |
| `boulder+queen-pulse` | 2 |
| `boulder+smoke` | 2 |
| `boulder+swap` | 2 |
| `convert+duchess` | 2 |
| `convert+page` | 2 |
| `convert+twin` | 2 |
| `convert+vanguard` | 2 |
| `decoy+dragon` | 2 |
| `decoy+page` | 2 |
| `decoy+poison-dart` | 2 |
| `decoy+queen-pulse` | 2 |
| `decoy+smoke` | 2 |
| `decoy+twin` | 2 |
| `decoy+vanguard` | 2 |
| `dragon+freeze-ray` | 2 |
| `dragon+magnet` | 2 |
| `dragon+queen-pulse` | 2 |
| `dragon+rabies-dart` | 2 |
| `dragon+sacrifice` | 2 |
| `dragon+smoke` | 2 |
| `dragon+vanguard` | 2 |
| `duchess+magnet` | 2 |
| `duchess+page` | 2 |
| `duchess+poison-dart` | 2 |
| `duchess+queen-pulse` | 2 |
| `duchess+rewind` | 2 |
| `duchess+smoke` | 2 |
| `duchess+vanguard` | 2 |
| `freeze-ray+page` | 2 |
| `freeze-ray+rabies-dart` | 2 |
| `freeze-ray+swap` | 2 |
| `freeze-ray+twin` | 2 |
| `freeze-ray+vanguard` | 2 |
| `knight-hop+swap` | 2 |
| `magnet+queen-pulse` | 2 |
| `magnet+smoke` | 2 |
| `magnet+summon-knight` | 2 |
| `magnet+twin` | 2 |
| `page+poison-dart` | 2 |
| `page+rewind` | 2 |
| `page+smoke` | 2 |
| `page+summon-knight` | 2 |
| `poison-dart+queen-pulse` | 2 |
| `poison-dart+rabies-dart` | 2 |
| `poison-dart+sacrifice` | 2 |
| `poison-dart+smoke` | 2 |
| `poison-dart+twin` | 2 |
| `queen-pulse+twin` | 2 |
| `queen-pulse+vanguard` | 2 |
| `rabies-dart+sacrifice` | 2 |
| `rewind+sacrifice` | 2 |
| `rewind+twin` | 2 |
| `rewind+vanguard` | 2 |
| `sacrifice+summon-knight` | 2 |
| `sacrifice+twin` | 2 |
| `sacrifice+vanguard` | 2 |
| `smoke+swap` | 2 |
| `smoke+vanguard` | 2 |
| `summon-knight+twin` | 2 |
| `aegis+bishop-squire` | 1 |
| `aegis+convert` | 1 |
| `aegis+dragon` | 1 |
| `aegis+duchess` | 1 |
| `aegis+freeze-ray` | 1 |
| `aegis+knight-hop` | 1 |
| `aegis+poison-dart` | 1 |
| `aegis+rabies-dart` | 1 |
| `aegis+summon-knight` | 1 |
| `aegis+twin` | 1 |
| `aegis+vanguard` | 1 |
| `become-king+bishop-step` | 1 |
| `become-king+decoy` | 1 |
| `become-king+dragon` | 1 |
| `become-king+poison-dart` | 1 |
| `become-king+queen-pulse` | 1 |
| `become-king+rabies-dart` | 1 |
| `become-king+rewind` | 1 |
| `become-king+summon-knight` | 1 |
| `become-king+swap` | 1 |
| `become-king+twin` | 1 |
| `bishop-squire+dragon` | 1 |
| `bishop-squire+page` | 1 |
| `bishop-squire+queen-pulse` | 1 |
| `bishop-step+boulder` | 1 |
| `bishop-step+decoy` | 1 |
| `bishop-step+dragon` | 1 |
| `bishop-step+duchess` | 1 |
| `bishop-step+page` | 1 |
| `bishop-step+poison-dart` | 1 |
| `bishop-step+rabies-dart` | 1 |
| `bishop-step+rewind` | 1 |
| `bishop-step+summon-knight` | 1 |
| `bishop-step+swap` | 1 |
| `boulder+poison-dart` | 1 |
| `boulder+rabies-dart` | 1 |
| `boulder+rewind` | 1 |
| `boulder+sacrifice` | 1 |
| `convert+decoy` | 1 |
| `convert+freeze-ray` | 1 |
| `convert+knight-hop` | 1 |
| `convert+magnet` | 1 |
| `convert+queen-pulse` | 1 |
| `convert+rabies-dart` | 1 |
| `convert+rewind` | 1 |
| `convert+smoke` | 1 |
| `convert+swap` | 1 |
| `decoy+freeze-ray` | 1 |
| `decoy+rewind` | 1 |
| `decoy+sacrifice` | 1 |
| `dragon+page` | 1 |
| `dragon+poison-dart` | 1 |
| `dragon+summon-knight` | 1 |
| `dragon+swap` | 1 |
| `dragon+twin` | 1 |
| `duchess+rabies-dart` | 1 |
| `duchess+summon-knight` | 1 |
| `freeze-ray+poison-dart` | 1 |
| `freeze-ray+queen-pulse` | 1 |
| `freeze-ray+rewind` | 1 |
| `magnet+rabies-dart` | 1 |
| `magnet+rewind` | 1 |
| `magnet+vanguard` | 1 |
| `page+queen-pulse` | 1 |
| `page+rabies-dart` | 1 |
| `page+swap` | 1 |
| `page+twin` | 1 |
| `page+vanguard` | 1 |
| `poison-dart+rewind` | 1 |
| `poison-dart+summon-knight` | 1 |
| `poison-dart+vanguard` | 1 |
| `queen-pulse+rabies-dart` | 1 |
| `queen-pulse+rewind` | 1 |
| `queen-pulse+sacrifice` | 1 |
| `queen-pulse+smoke` | 1 |
| `rabies-dart+rewind` | 1 |
| `rabies-dart+swap` | 1 |
| `rabies-dart+vanguard` | 1 |
| `rewind+swap` | 1 |
| `summon-knight+vanguard` | 1 |
| `swap+twin` | 1 |
| `twin+vanguard` | 1 |
| `bishop-squire+boulder` | 0 |
| `dragon+knight-hop` | 0 |
| `knight-hop+poison-dart` | 0 |
| `knight-hop+sacrifice` | 0 |
| `magnet+swap` | 0 |
| `poison-dart+swap` | 0 |

## Untested pairs

27 of 253 pairs have never been played against a surviving candidate. Widen with `--max-kits`, or extend `data/run-playtest/pair-hypotheses.json` to reorder the head of the search.

`_scans/` holds the full measured row for every subject scored with `--score-all` (the shipped-run ground truth); `_ledger.jsonl` is the resume ledger.