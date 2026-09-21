# App Store Connect metadata — Rookie's Revenge (Rookies Run)

Everything below is paste-ready for the ASC app record. Character limits noted.
Bundle ID `com.learnthroughstories.rookiesrun` (already registered by fastlane).
ASC app name below; Tyler creates the app record in the browser (Apple blocks
doing it via API — see docs/ios.md).

## Name (30 chars max)

```
Rookie's Revenge
```
(Tyler 2026-09-03. "Rookie's Revenge: A Chess Roguelike" is 35 chars, over the
30 limit, so the roguelike half lives in the subtitle. The plain name was free.)

## Subtitle (30 chars max)

```
A Chess Roguelike
```
(17 chars.)

## Category

- Primary: Games > Board
- Secondary: Games > Strategy

## Promotional text (170 chars max, changeable without review)

```
New board every day. Cross 10 escalating levels, corner the king, and unlock
powers that break the rules of chess. Rookie lost the game. She took that
personally.
```

## Description (4000 chars max)

```
The game ended. And Rookie took that personally.

Rookie's Revenge is a daily chess roguelike. You are one rook. Across the
board, behind walls and bodyguards, hides the enemy king. Cross 10 escalating
levels, break through his defenses, and take him down - in a run that changes
every single day.

HOW IT WORKS
- Move like a rook. Capture like a rook. Every capture stuns the defense and
  buys you tempo.
- Each level is a puzzle-battlefield: pawn shells, sightline queens, stone
  walls with one door, lava between you and him.
- Reach the king before your moves run out. Then do it nine more levels in a
  row.

POWERS THAT BREAK CHESS
Pick ability cards as you climb: hop like a knight, freeze a defender, summon
a knight you control like a second piece, drop a boulder to seal a file, or
become the king himself. 26 abilities to unlock, each with five upgrade
tiers. Every offer is a build decision - and every power refills at the top
of every level, so spend them where they hurt.

A NEW RUN EVERY DAY
The daily rotates through 10 hand-built runs - 100 levels in all - and each
run is built around a pair of powers that only cracks its finale together.
Miss a day, and that board is gone.

CLIMB THE LADDER
The same 10 runs stack into a ladder, from powers that bend the rules at the
bottom to the ones that rewrite the board at the top. Clear a rung and the
next one opens, with the powers it needs already in your hand.

EARN YOUR ARSENAL
54 trophies track everything from your first king to a flawless run. Nineteen
of them unlock new abilities permanently. Four difficulties, from Rookie
(training wheels, some judgment) to Nightmare (he sees everything).

ACTUALLY LEARN CHESS
Every mechanic is real chess underneath: forks, skewers, overloaded
defenders, zugzwang. You will start seeing sightlines and weak squares
everywhere - including in your regular games.

From the makers of The Chess Path (chesspath.app), the friendly way to learn
chess from zero.
```

## Keywords (100 chars max, comma-separated, no spaces after commas)

```
chess,roguelike,daily,puzzle,strategy,board,tactics,rook,king,deckbuilder,run,levels
```
(84 chars.)

## URLs

- Support URL: `https://run.chesspath.app/support` (`app/support/page.tsx`)
- Marketing URL: `https://run.chesspath.app/`
- Privacy Policy URL: `https://run.chesspath.app/privacy` (`app/privacy/page.tsx`)

A 200 proves nothing here: before 2026-09-21 neither page existed and both
URLs returned 200 with the game's soft 404. Check the `<title>` instead.

## Age rating

No objectionable content. Expected rating: 4+.

## App Review notes (paste into the review information box)

```
Rookie's Revenge is a daily chess roguelike: the player controls a single
rook and crosses the board in 10 escalating levels to capture the enemy
king, picking abilities between levels and unlocking new ones for good. A new
board rotates in every day, and a 10-run ladder (100 levels) plus two bonus runs is always open.

No account is required and there is no sign-in anywhere in the app. Progress
(abilities, trophies, difficulty unlocks) is stored on device. There are no
purchases, no ads, and no user generated content beyond an optional
leaderboard handle (a random "Rook-1234" name the player may rename; letters,
digits, . _ - only, 2-16 chars).

The game is bundled on the device and plays in full with no signal. With
signal it syncs the daily leaderboard and streak.

Native features: haptic feedback on moves, captures, ability plays, level
clears and defeats; native splash and status bar theming; portrait lock;
full offline play.

To reach gameplay immediately: launch the app, tap DAILY REVENGE, then BEGIN.
A short interactive tutorial runs on first launch only and can be skipped.
```

## Screenshots

`data/appstore/screenshots/*.png` — 1290 x 2796 (6.7" iPhone; ASC reuses it for
every smaller size). Regenerate from the live site with
`node scripts/appstore-screenshots.mjs`, then push to ASC with
`node scripts/asc-listing.mjs --shots`. Files upload in filename order.

## Status (2026-09-03, facts re-checked 2026-09-21) — listing is FILLED

> 2026-09-21: the copy above was corrected against the shipped game (23
> abilities, 54 trophies, the 10-run ladder, powers refill every level, offline
> bundle). `COPY` in `scripts/asc-listing.mjs` is the text ASC actually has and
> it has drifted from this file - port these edits into `COPY` before the next
> `node scripts/asc-listing.mjs`. "Build 4 attached" below is history: the
> repo's newest build is **7** (2026-09-18, first on-device bundle). Run
> `--status` to see which build ASC has attached today.

Everything above was applied to the ASC record (app id 6802359470) by
`scripts/asc-listing.mjs`: name "Rookie's Revenge", subtitle "A Chess Roguelike", categories (Games > Board/Strategy,
secondary Education), age rating 4+, content rights (original), description,
keywords, promo text, URLs, copyright, review contact + notes, free price
schedule, 175 territories, and TestFlight build 4 attached to version 1.0.

```bash
node scripts/asc-listing.mjs --status   # see the live state
node scripts/asc-listing.mjs            # re-apply copy after editing COPY in the script
node scripts/asc-listing.mjs --shots    # replace screenshots
node scripts/asc-listing.mjs --submit   # attach newest VALID build + submit for review
```

## The ONE thing Tyler must do in a browser

**App Privacy label** — Apple has no API for it. Sign in at
https://appstoreconnect.apple.com/apps/6802359470/distribution/privacy and
declare exactly this. It must match `app/privacy/page.tsx` and
`ios/App/App/PrivacyInfo.xcprivacy` (re-checked against the code 2026-09-21):

| Data type | Linked to user | Tracking | Purposes |
|---|---|---|---|
| Identifiers → Device ID | Yes | No | App Functionality, Analytics |
| User Content → Gameplay Content | Yes | No | App Functionality, Analytics |
| User Content → Other User Content | Yes | No | App Functionality |
| Usage Data → Product Interaction | Yes | No | Analytics |
| Location → Coarse Location | Yes | No | Analytics |
| Diagnostics → Other Diagnostic Data | Yes | No | Analytics |

Why each: Device ID = the random leaderboard player id + the install id on run
traces. Gameplay Content = leaderboard scores + move-by-move run traces.
Other User Content = the player-chosen public leaderboard name. Product
Interaction = PostHog autocapture/events/session replay. Coarse Location =
PostHog GeoIP from the IP (project has anonymize_ips OFF). Diagnostics = console
logs captured in session recordings (capture_console_log_opt_in ON). Linked =
Yes because everything is keyed to a persistent random id / PostHog person
profile. Tracking = No: no ads, no IDFA, nothing combined with third-party data.
Do NOT declare email / name / contacts — there is no sign-in.

Review will 409 until that label is published. After it is:
`node scripts/asc-listing.mjs --submit`.
