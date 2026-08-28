# Rookie's Revenge — home screen (front door)

Opening the app used to drop you straight into a difficulty picker. It now
opens on a home screen with three ways in.

## Screens

| Screen | File | What |
|---|---|---|
| Home | `components/run/RunHome.tsx` | Daily Run · Journey · Leaderboard, plus streak/wins/powers and the Trophy Room + tutorial shortcuts |
| Journey | `components/run/JourneyScreen.tsx` | Map select — a ladder of chapters, each gated on the one before |
| Leaderboard | `components/run/LeaderboardScreen.tsx` | Standings. **Sample data** until there's an endpoint |
| Run briefing | `components/run/RunLanding.tsx` | Unchanged, but now reached FROM home and carries a back arrow. The difficulty picker lives here, not at app open |

`app/page.tsx` owns a `screen` state machine: `'boot' | 'home' | 'journey' |
'leaderboard' | 'run'`. `'boot'` renders the same loader as `app/loading.tsx`
for one frame while the URL is read, so server HTML and the first client render
agree and nobody sees a flash of board.

**Deep links skip the home screen.** `meta.deepLink` is true for `?run=`,
`?date=` and `/stc`, and those go straight to the run exactly as before. Only a
bare `/` opens the front door. The in-game header has a Home button (hidden on
the STC surface).

## Journey — `lib/run/journey.ts`

`JOURNEY_MAPS` is five chapters. **Only chapter 1 is built** (`runId:
'revenge-1'`); 2–5 have `runId: null` and render as "In the works". Shipping a
chapter = point its `runId` at a new `RunDef` in `runs.ts`. Nothing else changes.

Progress is **derived**, not stored: `journeyProgress(readHistory())` folds the
existing local run history into per-map status. A chapter is `cleared` when
history has a completed run for its `runId`, `open` when the chapter before it
is cleared, `locked` otherwise. There is no journey storage key and no second
source of truth to drift.

## Leaderboard — `lib/run/leaderboard.ts`

`LEADERBOARD_IS_SAMPLE = true` and every rival is invented — the screen says so
in a banner so a screenshot can't be mistaken for real numbers. The player's own
row IS real: `myLeaderRow()` reads `profile.bestByDifficulty` (best score,
weighted by difficulty multiplier) and the local streak, then gets slotted in by
score with ranks recomputed.

Going live is one function: make `getLeaderboard()` fetch
`GET /api/run/leaderboard` and flip the flag. `LeaderRow` is the response shape.

## Not done yet

- Chapters 2–5 have no levels — the ladder is honest about it, but the journey
  is one map deep today.
- Leaderboard has no server, no accounts, no Supabase sync.
- Journey progress is per-device (localStorage), like everything else in the
  profile. It syncs when the profile does.
