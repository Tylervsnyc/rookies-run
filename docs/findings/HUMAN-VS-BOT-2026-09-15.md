# Human vs bot — Tyler's ten ladder runs, 2026-09-15

Tyler played every rung on **Normal** (handle `Rook-4545`). This is the first
human-check (`scripts/run-playtest/human-check.ts`) and the evidence behind
Phase 2 of the testing-model upgrade: arrival tiers, check 7 REPEAT, and BOT-BLIND.

**Method.**
- **Traces:** `run_traces` for run_date 2026-09-15 (read-only REST). They were
  matched to Tyler through `run_scores` by run id and posting time (11/11 runs).
- **Dedupe:** 14 rows → 11 runs. A retried run posts twice with the same
  `meta.startedAt`; the second post holds every event.
- **Replay:** no `level-start` events exist yet (the app side lands them next),
  so replay is 8-seed guessing. It stayed 77-100% in sync per run. Nothing below
  depends on it: loadouts come from the recorded offer picks, and lines come
  from the recorded casts and captures.
- **Bot comparison:** the T1 numbers are last night's filed audit (48
  trials/cell, engine `ba67d7d45074`). The "bot at Tyler's loadout" numbers are
  today's human-check on the working tree (engine `464b156fe4d3`, which already
  carries uncommitted Phase 1 engine edits).

## Per rung

| rung | run | Tyler | deaths | held at L7 | bot T1 pair L7-L10 (nightly) | nightly grade | human REPEAT |
|---|---|---|---|---|---|---|---|
| 1 | The Slash | **won** | 0 | boulder T3, knight-hop, magnet | 46/60/42/**0** = 37% | TOO HARD | L7 = L8 (and L9/L10 same idea, see below) |
| 2 | The Glasshouse | **won** | 0 | freeze-ray, poison-dart, vanguard T2 | 81/69/69/69 = 72% | INCONCLUSIVE | L7 = L8 (L10 the same pocket) |
| 3 | The Stacks | lost L8 | 1 (+ an abandoned start, died L1) | aegis, decoy T2, magnet: **no boulder** | 0/0/0/0 | TOO HARD | - |
| 4 | The Parapet | lost L7 | 1 | decoy, knight-hop T2, twin | 0/0/52/0 = 13% | TOO HARD | - |
| 5 | The Moat | lost L8 | 1 | bishop-squire, knight-hop T2, swap | 60/79/56/71 = 67% | TOO HARD (run 15%) | - |
| 6 | The Lattice | **won** | 0 | decoy T2, duchess, magnet | 100/94/94/100 = 97% | TOO EASY | L9 = L10 |
| 7 | The Alcove | **won** | 1 (L9) | become-king, boulder T3 (T5 by L10), magnet | 21/79/67/17 = 46% | TOO HARD | L9 = L10 (L7/L8 the same idea) |
| 8 | The Cliff | **won** | 1 (L7) | convert T2, magnet, summon-knight | 77/60/67/71 = 69% | INCONCLUSIVE | - |
| 9 | The Millstone | **won** | 0 | dragon, duchess T2, magnet | 77/85/81/71 = 79% | TOO EASY | **L7 = L8 = L9 = L10** |
| 10 | The Briar | **won** | 1 (L7) | dragon T2, poison-dart T2, sacrifice | 88/94/92/92 = 91% | TOO EASY | L7 = L10 |

Three things stand out before any bot number:

- **The bot's two TOO HARD finales Tyler cleared (Slash, Alcove) are the
  wall-building rungs.** He arrived with Boulder at T3 and put down 2-4 stones
  per level. The T1 audit gives the bot one stone.
- **Stacks is not a finale problem for a human, it's an OFFER problem.** Tyler
  reached L8 without ever holding Boulder (the signature pair is magnet +
  boulder); his L7 was magnet, then Aegis, then walk in. The finale's 0/0/0/0
  measures a pair he never got.
- **The TOO EASY rungs (Lattice, Millstone, Briar) are also the repeat rungs.**
  A line that clears one level clears the next, which is what "too easy"
  feels like.

## Repeated solutions (raw casts from the traces)

Squares are Tyler's actual taps; `x` = capture.

**The Slash (boulder + knight-hop)**: four walls, then one slide:
- L7: hop, boulder **b8 b7 b6**, a3-a8 x king
- L8: hop, boulder **g8 g7 g6**, h4-h8 x king (L7 mirrored)
- L9: hop, boulder **a7 b7 c7**, f8-b8 x king
- L10: boulder **e7 f7 g7 h7**, hop a7-c8, c8-f8 x king

The signature catches L7 = L8 exactly. L9 and L10 are the same idea: a wall
on the king's rank or file, then a rook slide. The coarse geometry reads them
as different (`adj>pen` vs `pen>near`). That is a known limit of check 7, not
evidence they differ.

**The Glasshouse (freeze-ray + vanguard)**: "knight on rank 5, freeze, hop to 7":
- L7: vanguard **c3**, c3-b5, freeze **a8**, b5-c7-a8 x king
- L8: vanguard **e3**, e3-d5, freeze **c8**, d5-e7-c8 x king (L7 two files over)
- L10: vanguard **d5**, freeze **a8**, d5-c7-a8 x king (the same pocket)

**The Millstone (dragon + duchess)**: one line four times:
- L7: duchess **d5** → f7, dragon **d5** → f7-g6 x king
- L8: duchess **f4** → c7, dragon **f4** → c7-b6 x king
- L9: duchess **h5** → f7, dragon **h5** → f7-e6 x king
- L10: duchess **g3** → c7, dragon **g3** → c7-b6 x king (L8's ending, squares identical)

**The Briar (dragon + sacrifice)**: summon the dragon, sacrifice it on its own
square, slide in: L7 (dragon/sacrifice **f5**), L9 (**e5**), L10 (**b5**). L8 is
different (poison-dart pair first). Plan note: keep L7-L8, rework L9-L10.

**The Alcove (become-king + boulder)**: stones into the pen, become king, step in:
- L7: boulder **f8 h8**, king g6-g7 x
- L8: boulder **a8**, king c5-b5-b7 x
- L9 (after a death): boulder **e4 h8**, king g6-g7 x
- L10: boulder **d4 c8 a8**, king b6-b7 x

L9 = L10 by signature. L7 is the same line as L9's with one fewer stone.

**The Lattice (duchess + decoy)**: decoy next to the king, then the duchess
takes: L9 decoy **d7**, duchess b5-d7; L10 decoy **c6**, duchess g2-c6.

## Bot at Tyler's loadout (BOT-BLIND)

`human-check.ts --date=2026-09-15 --handle=Rook-4545 --trials=16 --solve`
- Every level Tyler cleared first try (87 cells) was played by the bot, T5,
  holding exactly what Tyler held, 16 trials each.
- The solver ran on every cell whose upper bound was under 20%.
- Filed: `data/run-playtest/results/2026-09-15/human-check-Rook-4545.json`.

**Finale levels, bot at T1 pair (nightly) vs bot at Tyler's loadout (today):**

| rung | L7 | L8 | L9 | L10 |
|---|---|---|---|---|
| 1 Slash | 46 → **63** [39-82] | 60 → **69** [44-86] | 42 → **63** [39-82] | 0 → **13** [4-36] |
| 2 Glasshouse | 81 → 100 | 69 → 100 | 69 → 100 | 69 → 94 |
| 3 Stacks | 0 → **100** (aegis + decoy T2 + magnet) | lost | - | - |
| 5 Moat | 60 → 31 [14-56] | lost | - | - |
| 6 Lattice | 100 → 94 | 94 → 100 | 94 → 94 | 100 → 100 |
| 7 Alcove | 21 → **44** [23-67] | 79 → 81 | died once | 17 → **31** [14-56] |
| 8 Cliff | died once | 60 → 100 | 67 → 94 | 71 → 100 |
| 9 Millstone | 77 → 88 | 85 → 94 | 81 → 94 | 71 → 69 |
| 10 Briar | died once | 94 → 100 | 92 → 94 | 92 → 94 |

**Headline.** Most of the "TOO HARD" on The Slash and The Alcove came from the
**T1 method, not a blind bot.**
- Holding Tyler's upgraded Boulder, the bot clears Slash L7-L9 at 63-69% and
  Alcove L8 at 81%.
- Slash L10 (13%, upper 36%) and Alcove L10 (31%) stay low. They are the
  wall-building finales. Neither goes under the 20% BOT-BLIND bar at 16 trials,
  so neither is flagged. The plan expected Slash L10 to read BOT-BLIND; at this
  budget it reads "hard for the bot, cleared first try by Tyler".
- **The solver found no forced win at depth 7 on the finale.**

**The one BOT-BLIND:** The Moat L3, holding bishop-squire + swap. Bot 0/16
[0-19]; the solver proves a forced win in 4 Rookie moves. Swap is a card the
bot casts under 10% of the time as a single (README "Known limits"), and a
proven 4-move win it scores 0% on is exactly the blind spot this check exists
to name.

**Stacks is an offer problem, confirmed.** With the kit Tyler actually drew
(aegis, decoy T2, magnet) the bot clears L7 16/16. The finale's 0/0/0/0 is the
magnet + boulder pair that neither Tyler nor half the sims hold. It fits the
Aegis-too-strong note in the plan.

**The TOO EASY finales stay easy at real loadouts.** Glasshouse, Lattice,
Cliff, Millstone and Briar read 88-100% on almost every finale level. Lattice,
Millstone and Briar also repeat solutions. The ladder's upper rungs don't have
a difficulty problem the bot misreads; they have a variety problem.

**Rung grades with this folded in** (rows from the 2026-09-15 nightly, which
predates arrival columns): no rung flips to BOT-BLIND. BOT-BLIND overrides only a
TOO HARD *finale*, and Moat's only flag is L3. REPEAT fails from human lines on
Slash, Glasshouse, Lattice, Alcove, Millstone and Briar.

## What changed in the harness because of this

- **Arrival tiers.** BAND and SHAPE are graded at what runs hold on reaching L7
  (pair cell + kit cell). T1 stays in the table as context.
- **Check 7 REPEAT.** `line-signature.ts`, in `spec.ts` + `docs/LADDER-SPEC.md`.
  Bot lines come from the arrival cells; human lines from traces.
- **BOT-BLIND overrides TOO HARD.** Evidence is a human first-try clear the bot
  reads < 20% (upper bound) at the human's loadout, or a solver-proven forced
  win (`--ceiling` / `--solve`).
- **`pullHumanTraces` no longer double-counts retried runs,** and filters to Normal.
- **The nightly merge runs the human check** over the last 7 days of finale
  levels and folds the flags into the graded rows.

## Limits

- **Coarse signatures.** They catch mirrored and shifted copies (Slash L7/L8,
  Glasshouse L7/L8, Millstone L7-L10) but split lines that differ only in which
  side of the king a stone lands (Slash L9/L10, Glasshouse L10). A human still
  confirms "same idea".
- **Sample size.** One human, one clear per level. A human REPEAT is strong
  evidence of what the level invites. It does not prove there's no other line.
- **Arrival loadouts from bot sims use random offer picks.** Tyler focused
  upgrades on Boulder (T3 by L7, T5 by L10); the sim spreads them. That is why
  human-check measures the bot at the human's own loadout.
