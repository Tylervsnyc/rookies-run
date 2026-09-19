# Run author brief — the 2026-09-19 ten-run batch

You author ONE full 10-level Rookie's Revenge run, in the worktree
`/Users/tyler.schwartz/rr-abil-a` (branch `abilities/2026-09-19`). Nine other
authors are working in the same tree at the same time, each on their own file.

## Hard boundaries
- Edit ONLY your run file `lib/run/runs/revenge-<N>.ts` (a stub is there; the
  import, the pipeline entry and the id already exist). Never edit another run
  file, `extra-runs.ts`, `runs.ts`, `abilities.ts`, the bots, or the engine. If
  you find an ENGINE/ABILITY BUG, do not fix it — write it in your report with
  a minimal repro.
- Never touch `/Users/tyler.schwartz/rookies-run`. Never push. Never
  `pipeline.ts approve`.
- Commit only your own file: `git add lib/run/runs/revenge-<N>.ts && git commit`
  (retry if `index.lock` exists — others commit too). End the message with
  `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- The machine has 10 cores shared by 10 authors: ALWAYS pass `--jobs=2`, and
  iterate with `--trials=12` on 1-2 levels at a time; take final numbers of
  record at `--trials=32`. If a harness run fails because ANOTHER author's file
  is mid-edit, wait a minute and retry.

## Read first
1. `docs/new-abilities-2026-09-19.md` — the ten new cards, the four terrain
   rules, and your run's row in "The ten runs".
2. `docs/revenge-abilities.md` — the tail sections document the exact rules the
   builders shipped for the ten new cards (they differ in details from the
   spec; the code is the truth — read your card's implementation in
   `lib/run/abilities.ts`).
3. `.claude/run-level-design.md` — ALL of it. The combo gate, the anti-patterns,
   the bot's blind spots (it never waits, never buys safety early, needs the
   payoff this turn; carve finales out of solid stone; the key square must be
   the nearest reachable square to the king).
4. Two shipped runs as style models: `lib/run/runs/revenge-52.ts` and
   `lib/run/runs/revenge-21.ts` (header design block, KEY/TRAP map, MEASURED
   block, builders from `lib/run/run-kit.ts`, `LAVA()` for lava, `fixed` stones).

## The contract
- 10 levels, one constant visual THEME restated on every level and escalating
  inside it; 10 silhouettes a player could sketch from memory; every level a
  DIFFERENT primary decision (write it in 8 words in the level comment).
- This batch is also a TERRAIN EXPERIMENT: use your row's lava/boulder
  placement idea and push it — lava in shapes the catalogue has never used
  (rings, veins, islands, gutters, single vents inside the pen), loose vs
  `fixed` stone as a designed distinction.
- Kit: exactly 4 cards = the signature pair + 2 trap fillers (no universal
  solvents: bishop-step, knight-hop, become-king). L1-L2 free, L3-L6 single-card
  puzzles that TEACH each half of the pair, L7-L10 the combo gate: `none` ~0%,
  every single kit card <= 8%, the pair 60-80%. L7-L10 must each need a
  different use of the pair (order, target, twice, or a trap card briefly key).
- The partner card in your row is the design intent. If after honest iteration
  the pair will not gate, you may swap the PARTNER (not your new card) —
  Tyler's favourites are dragon, swap, sacrifice, boulder, convert. Say so.
- Set `abilityTierCaps` from a measured tier sweep of the finale, as the design
  doc describes. Known: Castle T4+ solos (he arrives stunned) — cap it <= 3.
- Measure with
  `npx tsx scripts/run-playtest/revenge.ts matrix --run=revenge-<N> --difficulty=normal --levels=7,8,9,10 --loadouts=none,<c1>,<c2>,<c3>,<c4>,<a>+<b> --trials=32 --jobs=2`
  and read the echoed loadout line first. Also read L1-L6 once with `none` and
  the intended card so the early curve is sane.
- Honesty over a pretty table: if a finale level will not gate, ship the best
  version, and say exactly what read what and why you think so. Do not nerf or
  alter any ability to pass the gate.

## Deliverable
The run file with the design header (signature, KEY/TRAP map, intended line per
finale level in algebraic squares, MEASURED block with final numbers, tier
caps), committed. Then a SHORT report: theme, kit, the final L7-L10 table, the
terrain experiment and whether it felt new, any engine/ability bugs found, and
your honest fun verdict on the new card.
