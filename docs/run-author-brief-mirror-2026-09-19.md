# Mirror batch brief (2026-09-19) — READ WITH the base brief

Read `docs/run-author-brief-2026-09-19.md` first (boundaries, harness usage,
commit rules all apply), then this file. Where they conflict, THIS file wins —
it carries Tyler's standing decisions, which the older design doc predates.

Tyler, playtesting today: "dude i LOVE mirror ... it's my fav ... use this to
make some sweet levels ... keep making more levels for this!" He also said of
the batch: "needs to be harder more pieces!" and he did NOT understand Mirror
until level 3's line was spelled out — then "omg that's sooo cool!".

## Overrides
1. **Kit = exactly 3 cards**: `mirror`, your partner, and ONE filler. All three
   are always in the offers.
2. **NO `abilityTierCaps`, ever.** Every card upgrades to T5 on its normal path.
   If an upgrade trivialises a level, fix the BOARD, never cap the card. Sweep
   honestly: singles at T1/T2/T3/T5 on L7-L10 (target <= ~8% at every tier),
   the pair at T1 (target 60-80%). A pair that gets easier as it upgrades is fine.
   Mirror's tiers: lasts 3/4/5/6/level of HER moves; 1 use (T4+: 2).
3. **MORE PIECES.** Sparse carved-stone boards read easy and empty to him.
   Roughly 4-9 enemies on L4-L10, escalating: hunters, lane guards, defended
   chains, walled watchers. Put them IN the corridors/rooms so the finale stays
   measurable. Every enemy capturable on some realistic line; pin pawns or make
   the march part of the puzzle. The ECHO CAPTURES what it lands on and enemies
   can capture the echo — use both: guards the echo eats, hunters that hunt the
   echo, a guard only the echo can afford to take.
4. **Teach Mirror gently.** L1 must be winnable bare but L2 or L3 must be a
   dead-simple "two tubes" Mirror level whose answer is just: stand opposite,
   cast, walk — the reflection does the capture. One new idea per level after
   that: (a) the echo is stopped by a block and DESYNCS (the "ratchet"/parking
   trick), (b) the echo as a second attacker, (c) the echo as a sacrifice-able /
   swappable body, (d) her move is safe but the echo's is the point (or the
   reverse), (e) knight-form hops are copied as hops if your kit allows a form.
5. The echo copies the DISPLACEMENT of her move flipped left-right (file ->
   9 - file), sliding as far as it legally can. Mirror only casts when her
   mirror square is empty ground. Rookie's start file is random per attempt —
   design in ranks/rungs, keep rank 1 an open connected floor (see how
   `revenge-60.ts` handles it), and READ `revenge-60.ts` fully: do not repeat
   its silhouettes (central lava seam + two tubes) or its finale lines (door /
   arrive unseen / relay / lid). Your run must look and play differently.
6. Difficulty for the bot comes from hunters + a payoff one turn after the
   cast; static boards read 100%. L7-L10 each a DIFFERENT use of the pair, and
   L8-L10 must add a wrinkle L7's answer does not cover.
7. Lava/stone placement is still an experiment: asymmetry is the puzzle, so
   WHERE the one broken stone/lava square sits is the level. Try symmetry axes
   that are not a wall (open boards with symmetric furniture), diagonal or
   offset furniture, lava on one side where the twin is stone.

Use `--jobs=4` (three authors share the machine). Final report as in the base
brief, plus: per-level piece counts, and the single level you would show Tyler first.
