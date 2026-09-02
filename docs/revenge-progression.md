# Rookie's Revenge — progression (profile · achievements · unlocks · difficulty)

One local object, one reducer, one catalog. Nothing here talks to Supabase yet
(the shape is JSON-safe on purpose — sync lands with the login UI).

## Profile — `lib/run/profile.ts`

`localStorage['rookies-revenge-profile-v1']`

```ts
{ v: 1, createdAt, difficulty, unlockedAbilities: AbilityId[],
  achievements: { [id]: { unlockedAt, seen } }, counters: { [key]: number },
  bestByDifficulty: { [difficulty]: { levels, score } } }
```

- `readProfile()` / `updateProfile(fn)` — every read and write goes through these.
- `STARTER_ABILITIES = surge, freeze-ray, drones`. `sanitize()` re-grants any ability
  whose achievement is already earned (catalog edits, abilities that shipped later).
- `applyRunEvent(ev)` — THE reducer: bump counters → evaluate un-earned achievements →
  unlock abilities → write. Returns `{ earned, unlockedAbilities }` for the UI.
- `resetProfile()` for QA.

## Events — `lib/run/achievements.ts` (`RunEvent`)

Derived from board-state diffs in `hooks/useProgress.ts` (capture with `via`
move/drones/ally/enemy-phase, ability-used, convert, offer-picked/skipped) or emitted
by `app/page.tsx` where it already has the context (level-cleared, level-lost,
run-completed, session-start). The engine is untouched and stays pure.

## Achievements — `ACHIEVEMENTS`

57 trophies in 7 groups (Firsts · Body Count · Style · Powers · Learning Experiences ·
Habits · Difficulty). Each has Rookie's line (`blurb`), a locked-card `hint`, optional
`progress(counters)`, and optional `unlocks: AbilityId`. Secret ones hide the hint.

### Unlock ladder

| Trophy | Condition | Unlocks |
|---|---|---|
| Regicide | first king | Magnet |
| Foot Traffic | 10 pawns | Page |
| Shift Change | cast Squire 5× | Swap |
| Comeback Kid | finish a run after losing 3+ levels | Sacrifice |
| Pawn Broker | 25 pawns | Poison Dart |
| Closing Time | first full run | Bishop Step |
| Drone Strike | 3 drone captures in one salvo | Convert (dead — drones retired) |
| Cold Shoulder | freeze the king 3× | Aegis |
| Untouchable | run with 0 level losses | Queen Pulse |
| Horse Whisperer | 10 knights | Decoy |
| Horseplay | king captured in knight form | Vanguard |
| Photo Finish | win on the last move | Smoke |
| Excommunicated | 10 bishops | Bishop Squire |
| Seeing Double | clear 50 levels | Twin |
| Army of One (Plus Some) | 20 ally captures | Boulder |
| Deja Vu | lose the same level 3× in a run | Rewind |
| Queen Slayer | 5 queens | Rabies Dart |
| Serial Regicide | 10 kings | Squad |
| Sore Winner | Hard clear | Become King (also opens Nightmare) |
| Her Majesty | king captured in queen form | Duchess |
| Revenge Served | Nightmare clear | Dragon |

## Offers respect unlocks

`rollOffer` (`lib/run/abilities.ts`) intersects the run's `allowedAbilities` with
`state.unlockedAbilities` (set from the profile in `puzzleToBoardState`; `undefined`
= everything, so the playtest harness is unaffected). Owned abilities always stay
upgradable.

## UI

- `AchievementToast` — one at a time, top of screen, never blocks the board.
- `AbilityUnlockModal` — card flip reveal; waits until no offer / level modal is up.
- `TrophyRoom` — full-screen: trophies by group with progress, abilities grid with
  how-to-unlock, stats strip, "Replay the tutorial". Opened from the landing row and
  the header trophy button.

## Difficulty — `lib/run/difficulty.ts`

Rookie · Normal · Hard · Nightmare (locked until Sore Winner). Same levels; knobs are
enemies/turn delta, move-limit delta, tempo cap on king levels, king behavior,
retries per level, score multiplier. Applied once in `seed.ts` when a level is built;
everything else reads `state.difficulty`.
