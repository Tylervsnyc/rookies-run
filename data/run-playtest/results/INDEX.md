# Playtest results ledger

One row per result file under `results/<date>/`. Newest last. Written by
`scripts/run-playtest/results.ts` — never by hand. `engine` is
`<git sha>[+dirty]/<hash of lib/run + registry>`; two rows with different
hashes were measured on different games and must not be compared as a trend.
Rows marked *(legacy)* predate the envelope (2026-09-09): no engine stamp, shape varies —
read them with their doc, never as a baseline.

| date | experiment | engine | budget | conclusion | file | doc |
|---|---|---|---|---|---|---|
| 2026-09-06 | finale-remeasure (legacy) | `unknown, pre-fingerprint (before capturing king d83153c)` | 32 trials | Finale L7-L10 per loadout for the combo runs; The Slash/Stacks/Parapet read 100/100/100/100 with the pair. STILL IMPORTED by lib/run/endless.ts (isPairGatedLevel) — stale since 2026-09-07. | [json](../finale-remeasure-2026-09-06.json) | [doc](../../../docs/findings/LADDER-FINALES-2026-09-08.md) |
| 2026-09-07 | difficulty-sweep (legacy) | `unknown, pre-fingerprint` | - | Every player-facing run x every difficulty, full runs at the real retry rule. | [json](2026-09-07/difficulty-sweep-2026-09-07.json) | [doc](../../../docs/findings/DIFFICULTY-SWEEP-2026-09-07.md) |
| 2026-09-07 | difficulty-sweep-testing (legacy) | `unknown, pre-fingerprint` | - | Same sweep over testing-stage runs. | [json](2026-09-07/difficulty-sweep-2026-09-07-testing.json) | [doc](../../../docs/findings/DIFFICULTY-SWEEP-2026-09-07.md) |
| 2026-09-07 | ladder-difficulty (legacy) | `unknown, pre-fingerprint` | - | First ladder difficulty read, flat 60-80 band. | [json](2026-09-07/ladder-difficulty-2026-09-07.json) | - |
| 2026-09-07 | multi-route-audit (legacy) | `unknown, pre-fingerprint` | screen 16, confirm 32 | Are combo finales one-answer locks? kit pairs + 20 out-of-kit pairs on L7-L10. | [json](2026-09-07/multi-route-audit-2026-09-07.json) | [doc](../../../docs/findings/MULTI-ROUTE-AUDIT-2026-09-07.md) |
| 2026-09-08 | king-impact before/after (legacy) | `before = parent of d83153c; after = capturing king` | 32 trials | The capturing king rewrote 6 of 10 rungs; The Stacks finale 75/72/75/69 -> 0/0/0/0. | [json](2026-09-08/king-impact-after-2026-09-08.json) | [doc](../../../docs/findings/CAPTURING-KING-REGRESSION-2026-09-08.md) |
| 2026-09-08 | ladder-gate (legacy) | `post capturing king` | 32 trials | 60-80 band re-measured per rung after the king fix. | [json](2026-09-08/ladder-gate-2026-09-08.json) | [doc](../../../docs/findings/LADDER-FINALES-2026-09-08.md) |
| 2026-09-08 | summon-sick before/after (legacy) | `post capturing king` | - | Summoning sickness on the ladder + Endless depth distribution. | [json](2026-09-08/summon-sick-after-2026-09-08.json) | [doc](../../../docs/findings/SUMMON-SICKNESS-2026-09-08.md) |
| 2026-09-08 | density curves A/B/C (legacy) | `post capturing king` | 60 runs/rung, 8 shards | All three density curves lost to changing nothing (extra enemies are capture material). | [json](2026-09-08/density/) | [doc](../../../docs/findings/LADDER-FINALES-2026-09-08.md) |
| 2026-09-08 | dials mv/ept/both (legacy) | `post capturing king` | 60 runs/rung, 8 shards | Move-limit / enemies-per-turn global deltas as difficulty dials. | [json](2026-09-08/dials/) | - |
| 2026-09-08 | retries 1/3/5 (legacy, INCOMPLETE) | `post capturing king` | 60 runs/rung, 8 shards | Retry budget as the difficulty dial; r5 shard 0 never finished, RETRIES-5.json aggregated from 7 of 8 shards. | [json](2026-09-08/retries/) | [doc](../../../docs/findings/SUMMONING-SICKNESS-FULL-2026-09-08.md) |
| 2026-09-08 | sickness base/sick (legacy) | `post capturing king` | 8 shards | Full ladder + Endless with and without summoning sickness. | [json](2026-09-08/sickness/) | [doc](../../../docs/findings/SUMMONING-SICKNESS-FULL-2026-09-08.md) |
| 2026-09-09 | ladder-audit-sick shards (legacy shape) | `6a8c601-era, before signaturePair` | 32 trials, 60 runs | Ten per-rung shard files from the first ladder-audit.ts, summoning sickness ON, bare-array shape. | [json](2026-09-09/ladder-audit-sick-shards/) | [doc](../../../docs/LADDER-SPEC.md) |
| 2026-09-09 | endless-formations (legacy shape) | `6a8c601-era` | - | Endless depth 15-30 with the formation layer off/on. | [json](2026-09-09/endless-formations-2026-09-09.json) | - |
| 2026-09-09 | ladder-audit | `2241571/69cbff9e1102` | 32 trials, 24 runs, jobs 3 | PASS 0 · BROKEN 0 · TOO EASY 3 · TOO HARD 4 · FLAT 0 · INCONCLUSIVE 3 (of 10) | [json](2026-09-09/ladder-audit.json) | [doc](../../../docs/LADDER-SPEC.md) |
| 2026-09-11 | ladder-audit | `acdb761/69cbff9e1102` | 96 trials, 96 runs, jobs 9 | PASS 0 · BROKEN 0 · TOO EASY 3 · TOO HARD 5 · FLAT 0 · INCONCLUSIVE 2 (of 10) | [json](2026-09-11/ladder-audit.json) | [doc](../../../docs/LADDER-SPEC.md) |
| 2026-09-11 | ladder-audit-sick | `acdb761/69cbff9e1102` | 96 trials, 96 runs, jobs 9 | PASS 0 · BROKEN 0 · TOO EASY 2 · TOO HARD 8 · FLAT 0 · INCONCLUSIVE 0 (of 10) · summoning sickness ON | [json](2026-09-11/ladder-audit-sick.json) | [doc](../../../docs/LADDER-SPEC.md) |
| 2026-09-12 | ladder-audit | `735e253/69cbff9e1102` | 4 trials, 4 runs, jobs 4 | PASS 0 · BROKEN 0 · TOO EASY 1 · TOO HARD 3 · FLAT 0 · INCONCLUSIVE 6 (of 10) | [json](2026-09-12/ladder-audit.json) | [doc](../../../docs/LADDER-SPEC.md) |
| 2026-09-13 | ladder-audit | `1a021ef/6d217e7a1dc1` | 48 trials, 40 runs, jobs 4 | PASS 0 · BROKEN 0 · TOO EASY 3 · TOO HARD 4 · FLAT 0 · INCONCLUSIVE 2 (of 9) · 1 shard(s) missing | [json](2026-09-13/ladder-audit.json) | [doc](../../../docs/LADDER-SPEC.md) |
