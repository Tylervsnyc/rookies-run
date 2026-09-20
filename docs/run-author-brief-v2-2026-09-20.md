# v2 rework brief (2026-09-20) — make a run "Baffle v2" good

Read `docs/run-author-brief-2026-09-19.md` first (boundaries, harness usage,
commit rules), then this. Where they conflict, THIS wins.

Tyler played the batch. On The Baffle v1: "i love the ricochet and boulder one!
needs to be harder more pieces!" On The Baffle v2: "omg i love the new baffle
too!" **`lib/run/runs/revenge-61.ts` (v2) is the confirmed template — read all
of it, header included, before you touch your run.** Your job is to give YOUR
run the same treatment. Keep its identity, signature pair, theme and its best
finale ideas; this is a rework, not a new run.

## The rules (Tyler's standing decisions)
1. **Kit = exactly 3 cards**: the signature pair + ONE filler. Never `shove`
   (Tyler: "i don't like shove i don't get it"). Prefer a filler Tyler likes or
   a live card. All three are always offered.
2. **NO `abilityTierCaps`. Ever.** Delete them. Every card upgrades to T5. "If
   an upgrade trivialises a level, fix the BOARD, never cap the card." Your v1
   header says which tier broke which level and why — close each leak in the
   geometry (see how Baffle v2 replaced its Boulder cap: no crushable pawn whose
   death opens a walk-in, wardens walled beside the key square, no open square
   two steps from the king on an open diagonal for Magnet T3+/T5, corner squares
   inside `kingPen` so no hunter plugs them).
3. **MORE PIECES.** v1 boards are carved stone with 1-3 enemies and read sparse
   and easy. Target roughly 3-4 enemies on L1-L3, 4-6 on L4-L7, 5-8 on L8-L10:
   niche knights, bishops plugging one-wide corridors, pinned pawns, defended
   chains, a queen where fair, `enemiesPerTurn: 2` on two finale levels. Put
   them IN the rooms/corridors so the finale stays measurable. Every enemy
   capturable on some realistic line (say so in the header if one needs a card).
4. Sweep honestly on L7-L10, 32 trials: `none`, each single card at T1, each
   single card at T2/T3/T5 (and T4 where a card gains a second effect there),
   the pair at T1, and the pair at T3+T3 and T5+T5. Target: singles <= ~8% at
   EVERY tier, pair 60-80% at T1 (an upgraded pair may be easier — fine).
5. L7-L10 each a DIFFERENT use of the pair; L8-L10 add a wrinkle L7's answer
   does not cover. L1-L2 easy wins, L3-L6 teach one card each, with bodies.
   If full-run random picks read under ~8%, add an L2 offer the way Baffle v2
   did (`offerOnLevels: [1, 2, 3, 6, 9]`).
6. Header: keep the design block, add a "v2 — what changed and why" note quoting
   Tyler, a per-level piece count v1 -> v2, the new MEASURED block, and an
   honest-notes block. No engine, ability, bot or UI edits — if you find a bug,
   report it with a repro.

Use `--jobs=2` (several authors + an iOS build share this machine); iterate at
12 trials on 1-2 levels, final numbers at 32. Commit only your run file.

Report, concise: piece counts v1 -> v2, final tables (T1 + tier sweep), full-run
reads, what each finale level asks, how each old cap was replaced, anything that
would not gate cap-free, and the ONE level to show Tyler first.
