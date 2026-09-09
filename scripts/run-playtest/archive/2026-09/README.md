# Archived one-off harness scripts (2026-09)

Each answered one question during the 2026-09-05..09 tuning sprint and was never
meant to run twice. Kept for provenance; their hardcoded data paths point at the
OLD layout (results now live in `data/run-playtest/results/<date>/`, see
`results/INDEX.md`). Do not run them; if the question comes back, write it as a
`ladder-audit.ts` variant that files through `results.ts`.

| script | question | result |
|---|---|---|
| `_gate-check.ts` | 60-80 band per rung after the capturing king | results/2026-09-08/ladder-gate |
| `_remeasure-finales.ts` | finale re-take on the deterministic harness | data/run-playtest/finale-remeasure-2026-09-06.json |
| `_king-impact.ts` | capturing-king before/after per rung | results/2026-09-08/king-impact-* |
| `_summon-sick.ts`, `_sickness-*.ts` | summoning sickness on ladder + Endless | results/2026-09-08/sickness, summon-sick-* |
| `_density-*.ts` | density curves A/B/C vs baseline | results/2026-09-08/density |
| `_dial-shard.ts` | move-limit / enemies-per-turn dials | results/2026-09-08/dials |
| `_retry-shard.ts` | retry budget 1/3/5 (r5 incomplete) | results/2026-09-08/retries |
| `_evening-generator.ts`, `_evening-shipper.ts` | 2026-05 rank-8 candidate generator | deleted with the rank-8 pipeline |
| `_smoke-*.ts` | ad-hoc smokes | - |

Superseded by: `ladder-audit.ts` (the contract with error bars), `engine-regression.ts`
(before/after on every engine push), `results.ts` (one envelope, one index).
