# Rookie's Revenge — pair synergy report

Generated 2026-09-05 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability ~0%, every single card in K ~0%, and at least one **pair** drawn from K >= 60%.

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **121** · combo-gated: **6** · solvable with no ability: 69 · every kit disqualified by one of its own cards: 41 · a kit survived but no pair cleared: 3 · failed the high-trial confirm: 2

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-squire+swap` | 3 | L7 L8 L9 | 100% | 2 | 0 |
| `boulder+knight-hop` | 2 | L7 | 100% | 0 | 0 |
| `summon-knight+swap` | 2 | L6 L7 | 96% | 0 | 0 |
| `bishop-squire+duchess` | 1 | L7 | 75% | 1 | 0 |
| `bishop-squire+knight-hop` | 1 | L7 | 70% | 0 | 0 |
| `convert+summon-knight` | 1 | L7 | 75% | 0 | 0 |
| `dragon+duchess` | 1 | L6 | 73% | 0 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `freeze-ray+knight-hop` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+smoke` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+twin` | 1 | L7 | 100% | 0 | 0 |
| `knight-hop+vanguard` | 1 | L7 | 100% | 0 | 0 |
| `swap+vanguard` | 1 | L7 | 100% | 0 | 0 |

## Socket abilities — which cards show up in the most gating pairs

The card that appears in the most winning pairs is the one to build future runs around.

| ability | gating pairs it appears in | gated levels | pairs |
|---|---|---|---|
| `knight-hop` | 6 | 2 | `bishop-squire+knight-hop`, `boulder+knight-hop`, `freeze-ray+knight-hop`, `knight-hop+smoke`, `knight-hop+twin`, `knight-hop+vanguard` |
| `swap` | 4 | 5 | `bishop-squire+swap`, `duchess+swap`, `summon-knight+swap`, `swap+vanguard` |
| `bishop-squire` | 3 | 5 | `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+swap` |
| `duchess` | 3 | 2 | `bishop-squire+duchess`, `dragon+duchess`, `duchess+swap` |
| `summon-knight` | 2 | 2 | `convert+summon-knight`, `summon-knight+swap` |
| `vanguard` | 2 | 1 | `knight-hop+vanguard`, `swap+vanguard` |
| `boulder` | 1 | 2 | `boulder+knight-hop` |
| `convert` | 1 | 1 | `convert+summon-knight` |
| `dragon` | 1 | 1 | `dragon+duchess` |
| `freeze-ray` | 1 | 1 | `freeze-ray+knight-hop` |
| `smoke` | 1 | 1 | `knight-hop+smoke` |
| `twin` | 1 | 1 | `knight-hop+twin` |

## Pairs played against a surviving kit that never gated a level

Real signal: a pair that has been played on several surviving levels and never gated one is a WEAK partnership, not just an untested one.

| pair | levels it was played on |
|---|---|
| `bishop-squire+poison-dart` | 2 |
| `bishop-squire+smoke` | 2 |
| `boulder+convert` | 2 |
| `boulder+swap` | 2 |
| `boulder+vanguard` | 2 |
| `dragon+smoke` | 2 |
| `duchess+sacrifice` | 2 |
| `freeze-ray+swap` | 2 |
| `knight-hop+swap` | 2 |
| `magnet+sacrifice` | 2 |
| `magnet+twin` | 2 |
| `sacrifice+smoke` | 2 |
| `smoke+swap` | 2 |
| `aegis+bishop-step` | 1 |
| `aegis+decoy` | 1 |
| `aegis+duchess` | 1 |
| `aegis+magnet` | 1 |
| `aegis+queen-pulse` | 1 |
| `aegis+sacrifice` | 1 |
| `become-king+boulder` | 1 |
| `become-king+decoy` | 1 |
| `become-king+duchess` | 1 |
| `become-king+magnet` | 1 |
| `become-king+page` | 1 |
| `become-king+rewind` | 1 |
| `become-king+swap` | 1 |
| `become-king+twin` | 1 |
| `become-king+vanguard` | 1 |
| `bishop-squire+dragon` | 1 |
| `bishop-squire+magnet` | 1 |
| `bishop-squire+rabies-dart` | 1 |
| `bishop-squire+sacrifice` | 1 |
| `bishop-step+magnet` | 1 |
| `bishop-step+sacrifice` | 1 |
| `boulder+decoy` | 1 |
| `boulder+freeze-ray` | 1 |
| `boulder+magnet` | 1 |
| `boulder+page` | 1 |
| `boulder+poison-dart` | 1 |
| `boulder+queen-pulse` | 1 |
| `boulder+sacrifice` | 1 |
| `boulder+summon-knight` | 1 |
| `convert+swap` | 1 |
| `decoy+duchess` | 1 |
| `decoy+magnet` | 1 |
| `decoy+page` | 1 |
| `decoy+queen-pulse` | 1 |
| `decoy+twin` | 1 |
| `dragon+freeze-ray` | 1 |
| `dragon+page` | 1 |
| `dragon+sacrifice` | 1 |
| `dragon+swap` | 1 |
| `duchess+freeze-ray` | 1 |
| `duchess+page` | 1 |
| `duchess+poison-dart` | 1 |
| `duchess+queen-pulse` | 1 |
| `duchess+rewind` | 1 |
| `duchess+smoke` | 1 |
| `freeze-ray+page` | 1 |
| `freeze-ray+sacrifice` | 1 |
| `freeze-ray+summon-knight` | 1 |
| `freeze-ray+vanguard` | 1 |
| `magnet+poison-dart` | 1 |
| `magnet+queen-pulse` | 1 |
| `magnet+smoke` | 1 |
| `page+swap` | 1 |
| `poison-dart+queen-pulse` | 1 |
| `poison-dart+sacrifice` | 1 |
| `rabies-dart+smoke` | 1 |
| `rabies-dart+swap` | 1 |
| `rewind+swap` | 1 |
| `rewind+twin` | 1 |
| `rewind+vanguard` | 1 |
| `sacrifice+summon-knight` | 1 |
| `sacrifice+twin` | 1 |
| `sacrifice+vanguard` | 1 |
| `smoke+twin` | 1 |
| `summon-knight+vanguard` | 1 |
| `twin+vanguard` | 1 |
| `bishop-squire+boulder` | 0 |
| `bishop-squire+page` | 0 |
| `bishop-squire+summon-knight` | 0 |
| `boulder+dragon` | 0 |
| `dragon+knight-hop` | 0 |
| `dragon+summon-knight` | 0 |
| `knight-hop+poison-dart` | 0 |
| `knight-hop+sacrifice` | 0 |
| `magnet+swap` | 0 |
| `poison-dart+swap` | 0 |

## Untested pairs

151 of 253 pairs have never been played against a surviving candidate. Widen with `--max-kits`, or extend `data/run-playtest/pair-hypotheses.json` to reorder the head of the search.

`_scans/` holds the full measured row for every subject scored with `--score-all` (the shipped-run ground truth); `_ledger.jsonl` is the resume ledger.