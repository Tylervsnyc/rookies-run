# Rookie's Revenge — pair synergy report

Generated 2026-09-05 by `scripts/run-playtest/combo-discover.ts`.

## Combo-gating is KIT-relative (the finding that reshaped this search)

The first pass tested "no single ability out of all 23 solves it" and accepted **0 of the 20 shipped Moat + Colonnade levels** — including the ones we know are combo gates. The measurement was right; the definition was wrong.

`bishop-step`, `knight-hop` and `become-king` are **universal solvents**: they change what Rookie's movement geometry *is* (or make her uncapturable), so they cross any terrain. A level whose difficulty is a terrain signature — a moat, a colonnade, a pen — can essentially never be gated against the full 23. Big summons (`dragon`, `duchess`, `vanguard`) behave the same way on many boards.

The Colonnade *is* gated — against its own kit. `runs.ts` gives it `allowedAbilities: [swap, bishop-squire, magnet, boulder]`, and that is every card the player can ever hold there. So the definition used here is:

> Given a 4-card **kit** K: no-ability ~0%, every single card in K ~0%, and at least one **pair** drawn from K >= 60%.

A level gated under MANY kits is more valuable (it can ship in several runs); within one kit, fewer winning pairs is better. A level that also survives every single card in the game is marked `pure` — a bonus tier, never required.

Card pool searched: **23 abilities** → 253 possible pairs. All 23 built abilities → 253 pairs.

Subjects screened: **20** · combo-gated: **3** · solvable with no ability: 0 · every kit disqualified by one of its own cards: 17 · a kit survived but no pair cleared: 0 · failed the high-trial confirm: 0

## Pairs that produced combo-gated levels

| pair | levels | slots | best win % | unique-answer levels | pure levels |
|---|---|---|---|---|---|
| `bishop-squire+swap` | 2 | L8 L9 | 100% | 2 | 0 |
| `dragon+duchess` | 1 | L6 | 73% | 0 | 0 |
| `duchess+swap` | 1 | L6 | 70% | 0 | 0 |
| `summon-knight+swap` | 1 | L6 | 77% | 0 | 0 |

## Pairs played against a surviving kit that never gated a level

`bishop-squire+boulder`, `bishop-squire+dragon`, `bishop-squire+duchess`, `bishop-squire+knight-hop`, `bishop-squire+magnet`, `bishop-squire+page`, `bishop-squire+poison-dart`, `bishop-squire+sacrifice`, `bishop-squire+summon-knight`, `boulder+dragon`, `boulder+freeze-ray`, `boulder+knight-hop`, `boulder+magnet`, `boulder+sacrifice`, `boulder+swap`, `dragon+freeze-ray`, `dragon+knight-hop`, `dragon+page`, `dragon+sacrifice`, `dragon+summon-knight`, `dragon+swap`, `duchess+sacrifice`, `freeze-ray+sacrifice`, `knight-hop+poison-dart`, `knight-hop+sacrifice`, `knight-hop+swap`, `magnet+swap`, `page+swap`, `poison-dart+swap`, `sacrifice+summon-knight`

## Untested pairs

219 of 253 pairs have never been played against a surviving candidate. Widen with `--max-kits`, or extend `data/run-playtest/pair-hypotheses.json` to reorder the head of the search.

`_scans/` holds the full measured row for every subject scored with `--score-all` (the shipped-run ground truth); `_ledger.jsonl` is the resume ledger.