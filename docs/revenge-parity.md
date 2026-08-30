# Rookie's Revenge — harness vs app parity

Question: does the headless playtest bot (`scripts/run-playtest/revenge.ts`,
the same engine the nightly uses) play the exact same game as the live app?

Answer (2026-08-30): **yes for the engine** — every ply of every case matched
the real app, board square for board square, state field for state field —
with **one real source of divergence** (pawn promotion draws its piece type
from `Math.random`, so the harness and the app roll different pieces) and a
short list of **app-side rules the harness does not model** (below), the
biggest being retries and the free level offers.

## How to run

```
# dev server on 3011 (or pass --base=http://localhost:3100 if one is up)
npx next dev --turbopack -p 3011
npm run playtest:parity -- --base=http://localhost:3011
# options
#   --cases=1:none,6:surge,8:freeze-ray:2   level:ability[:tier]
#   --seed=N --file=1..8 --tier=T5|T4 --difficulty=normal|rookie|hard|nightmare
#   --strict   fail on a promotion-roll mismatch instead of adopting the app's roll
#   --headed --json --shots=<dir>
```

The driver (`scripts/run-playtest/revenge-parity.ts`):

1. builds the harness start state exactly like `revenge.ts` (`puzzleToBoardState`
   with a pinned `aiRngSeed`, a pinned start file, the loadout, difficulty),
2. opens the real app in headless Chromium with the **dev-only hook** in
   `app/page.tsx` — `?parity=1&seed=&file=&loadout=surge:1&difficulty=normal`
   (plus the normal `run`, `date`, `level` params). The hook is gated on
   `process.env.NODE_ENV !== 'production'`; it feeds the same inputs to the same
   `puzzleToBoardState` call, overrides Rookie's start file (the engine draws it
   from `Math.random`), and mirrors the live `BoardState` + `lossReason` to
   `window.__rrParity` so the driver can wait for the enemy phase precisely,
3. lets the T5 bot decide every action on the HARNESS state and replays it in
   the UI click by click (tap Rookie, tap target; tap a rack card; tap card then
   enemy for Freeze Ray; tap the first card of a free level offer; tap Skip on a
   tempo offer), then waits for the app's enemy / ally / drone phase to settle
   plus the solver fail-safe's beat,
4. after EVERY ply diffs the app two ways: the DOM (Rookie sprite + square, every
   enemy piece + square via `data-piece`, the king's Frozen / Stunned chip, the
   moves-left chip, each rack card's uses-left dots) and the mirrored
   `BoardState` (turn, status, moveCount, tempo, form, formMovesLeft,
   bonusMovesLeft, frozen squares + timers, kingStunTurns, shield, decoy,
   poison, rabid, abilities/tier/uses, pending offer, active ability, hazards),
5. asserts the final outcome matches.

Profile seeded into the app's localStorage: chosen difficulty + every ability
unlocked (the profile sanitizer drops the retired `drones`); the harness side
passes the same `unlockedAbilities` list so offer slates match.

## Result table (2026-08-30, dev server on :3100, T5 bot, Normal, date 2026-08-18)

```
L   loadout        seed        file  plies  harness     app         result
1   none           1122171098  6     4      won         won         PASS
3   none           3486122840  4     4      won         won         PASS
4   none           1885169103  6     3      won         won         PASS
6   surge          3043975151  2     6      won         won         PASS   (Surge cast + bonus move replayed)
8   freeze-ray     1315903651  8     12     move-limit  unwinnable  PASS*  app fail-safe ended level at ply 12; harness played on alone → move-limit
8   none           1941471147  2     11     move-limit  unwinnable  PASS   app fail-safe ended level at ply 11; harness played on alone → move-limit
10  knight-hop     2013105899  4     13     won         won         PASS   (Knight Hop cast replayed)
10  bishop-step    3841398742  7     11     won         won         PASS*  (Bishop Step cast replayed)
```

`PASS*` = one promotion-roll resync was needed (see divergence below); every
other field agreed on every ply. Ability casts, free level offer picks, the
king's Stunned chip after a capture, the fleeing king (L10) and the move-limit
chip all matched. Nothing in the engine diverged.

## The one real divergence: pawn promotion type is unseeded

**Where:** `lib/run/pawn-ai.ts`, `applyAction`:

```ts
if (moved.type === 'pawn' && target.rank === 1) {
  const pool = promotionPool(state.level);
  moved.type = pool[Math.floor(Math.random() * pool.length)];
}
```

Every other enemy decision goes through `aiRng(state)` (seeded from
`aiRngSeed`, moveCount and the step index) and replays identically. The
promotion piece does not — the harness and the app each roll their own.

**Repro (strict mode fails at the first promotion):**

```
npm run playtest:parity -- --base=http://localhost:3100 --cases=8:freeze-ray,10:bishop-step --strict
```

First run, verbatim:

```
L8 freeze-ray seed=1315903651 file=8 — DIVERGENCE at ply 3 after "move h2":
  pieces: harness=[... "Q@d1" ...]  app=[... "N@d1" ...]
L10 bishop-step seed=3841398742 file=7 — DIVERGENCE at ply 9 after "move c8":
  pieces: harness=[... "B@f1" ...]  app=[... "Q@f1" ...]
```

(a black pawn reached rank 1 during the enemy turn; the harness rolled a
queen / bishop, the app a knight / queen). Later runs rolled other pairs —
it is a coin flip each time.

**Can it change a win/loss?** Yes. A queen on rank 1 covers different
squares than a knight; it decides whether Rookie's line is safe and whether
the king's pen has a second guard. It also makes the MCTS bot itself
non-reproducible: rollouts simulate enemy turns, so two runs of the same
`trace` command can pick different moves once a pawn is near rank 1.

**Not patched** (engine files are owned elsewhere). The fix is one line —
draw from `aiRng(state)` instead of `Math.random` — and would make both the
app and the harness fully replayable from `aiRngSeed`. Until then the driver
adopts the app's roll and keeps comparing (logged as `WARN ... promotion at
d1`, counted in the table as `PASS*`); `--strict` turns it back into a FAIL.

The same unseeded pattern exists in `lib/run/abilities.ts` `stepAllyTurn`
(converted allies wander with `Math.random() < 0.3`) — not exercised here
(no Convert case), same consequence for any Convert loadout.

## App-side rules the harness does not model

| # | Rule (app only) | Where | Changes a win/loss? |
|---|---|---|---|
| 1 | **Solver fail-safe.** When control returns to Rookie the app runs `isUnwinnable(state)` (after a 420 ms beat; synchronous, up to 150k nodes). A proven-dead position is set `lost` immediately with "No way through." and burns a retry. The harness plays the position out (loses by move-limit or capture). | `app/page.tsx` (unwinnable effect), `lib/run/solver.ts` | Not the result, only the timing and the label — if the solver honours its one-sided contract. Seen twice (L8 x2): app said unwinnable, the harness played on alone and lost by move-limit both times. Note the harness `failMode` taxonomy has no `unwinnable`; a loss the app calls "No way through" the harness may record as `captured`. Also only fires if Rookie idles ≥ 420 ms on her turn — a fast tapper never triggers it. |
| 2 | **Retries.** Normal = 3 per level, Hard = 1, Nightmare = 0, Rookie = unlimited. A retry rebuilds the level with a NEW random start file and a NEW `aiRngSeed`, carrying abilities / tempo / pending offer. The harness `runs` mode plays each level once and ends the run on the first loss. | `app/page.tsx` `retryLevel`, `lib/run/difficulty.ts` | **Yes, for run-level outcomes.** Harness run-clear rates are a lower bound: a Normal player gets up to 4 attempts per level with fresh spawns. Single-level win % is unaffected. |
| 3 | **Free level offers cannot be skipped.** On L1/3/6/9 the app shows a 3-card offer before the first move with no Skip; the player MUST take one. The harness `matrix` / `trace` / `solve` modes `applyDismissOffer` it (a move the app does not allow); `runs` mode picks randomly. | `components/run/AbilityOfferModal.tsx` (`reason='level'`), `revenge.ts` playGame | **Yes for the `none` / single-ability matrix cells** on L1/3/6/9 — a real player on those levels always holds one more (or one upgraded) ability than the harness cell assumes. |
| 4 | **Offer ordering vs the enemy turn.** Harness resolves a tempo offer before settling the enemy turn; the app runs the enemy phase while the modal is up and the pick lands after. | `revenge.ts` playGame vs `app/page.tsx` enemy effect | Only through tempo capping (an enemy-on-enemy capture adding tempo while the meter is full). Negligible. |
| 5 | **Offer pool = profile unlocks.** The app rolls only `profile.unlockedAbilities` (new player: Knight Hop, Surge, Freeze Ray; `drones` is retired and stripped on load). The harness passes `unlockedAbilities: undefined` = all 18 `REVENGE_ABILITIES`, drones included. | `lib/run/profile.ts`, `revenge.ts` startState | Changes what a `runs` bot can be offered / pick (drones can never appear in the app). Engine unaffected. |
| 6 | **Default difficulty.** A fresh profile is `rookie` (enemies/turn −1, move limit +4, still king on L1–4, unlimited retries). Harness default is authored = Normal. Normal / Hard are locked until a Rookie clear. | `lib/run/difficulty.ts` DEFAULT_DIFFICULTY | **Yes.** Most first-time players face an easier level than the harness's default cell; pass `--difficulty` on both sides to compare. |
| 7 | **Start file is Math.random** in both (`randomizedRookieStart`). The app also re-rolls on every retry; `solve` mode covers every file, `matrix` samples like the app. | `lib/run/seed.ts` | No systematic bias, but neither side is reproducible from `aiRngSeed` alone (the parity hook overrides it). Squad rosters are spawned relative to the drawn file before the override — the parity hook is not exact for a `squad` loadout. |
| 8 | **Timing-only phases.** The app ticks the enemy (420 ms), ally (440 ms) and drone (520 ms) phases one step at a time with the same `stepEnemyTurn` / `stepAllyTurnReactive` / `stepDroneTurn`; the harness loops them. Verified identical for the enemy phase (incl. the fleeing king's reaction step on L10). Ally / drone phases were not exercised (no Squad / Convert / Drones case) and the DOM reader ignores allies / drones. | `components/run/timing.ts`, `bots/t3.ts` settleEnemyTurns | No — same functions. |
| 9 | **Undo affordance.** Re-tapping a Transform / Surge / Aegis card before moving refunds it (`cancellableActivation`). The bot never does this. | `lib/run/abilities.ts` | No (a human-only option that can only help). |
| 10 | UI / meta only: onboarding tutorial, run intro card, achievements, ability-unlock modals, trace POSTs, PostHog events. | various | No. |

## Environment notes (do not mistake these for divergences)

- **Fast Refresh remounts.** Another process editing `lib/run/runs.ts` mid-run
  (it happened at 17:47 during the first L8 pass) makes Next.js re-mount the
  page; the board replays its 1.5 s entrance sweep, during which Rookie has no
  `data-piece`. The driver now polls through that. If `runs.ts` changes between
  the harness process starting and the app hot-reloading, the two are no
  longer building the same level — rerun.
- The dev recorder POSTs every event to `/api/dev/run-live`, which this repo
  does not serve: one console 404 per event (suppressed and counted).
- `?date=`-locked links log a React hydration warning in dev (pre-existing:
  `readUrlParams` runs on the client); the tree re-renders and the game is
  unaffected.
- The DOM read waits `ENEMY_TICK_MS + PIECE_SLIDE_MS + 120 ms` after the app's
  turn returns to Rookie, so a case takes ~1–2 s per ply.
