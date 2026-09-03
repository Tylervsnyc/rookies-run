# App Store Connect metadata — Rookie's Revenge (Rookies Run)

Everything below is paste-ready for the ASC app record. Character limits noted.
Bundle ID `com.learnthroughstories.rookiesrun` (already registered by fastlane).
ASC app name below; Tyler creates the app record in the browser (Apple blocks
doing it via API — see docs/ios.md).

## Name (30 chars max)

```
Rookie's Revenge: Chess Runs
```
(28 chars. Alternative if Apple flags the apostrophe or it collides: `Rookies Revenge — Chess Runs`.)

## Subtitle (30 chars max)

```
A daily chess roguelike
```
(23 chars.)

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
- Each level is a puzzle-battlefield: pawn shells, sightline queens, walls
  with one door, keys that unlock his file.
- Reach the king before your moves run out. Then do it nine more levels in a
  row.

POWERS THAT BREAK CHESS
Pick ability cards as you climb: hop like a knight, freeze a defender, summon
a knight you control like a second piece, drop a boulder to seal a file, or
become the king himself. 18 abilities to unlock, each with five upgrade
tiers. Every offer is a build decision - and finishers are one charge per
run, so spend them where they hurt.

A NEW RUN EVERY DAY
The daily rotates through hand-tuned runs - Pawn Storm, The Royal Guard, The
Fortress, Stonework, Two Keys - each with its own personality and lesson.
Miss a day, and that board is gone.

EARN YOUR ARSENAL
54 trophies track everything from your first king to a flawless run. Fifteen
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
(95 chars.)

## URLs

- Support URL: `https://chesspath.app/` (or a /support page if one exists)
- Marketing URL: `https://run.chesspath.app/`
- Privacy Policy URL: `https://run.chesspath.app/privacy` (verified 200)

## Age rating

No objectionable content. Expected rating: 4+.

## App Review notes (paste into the review information box)

```
Rookie's Revenge is a daily chess roguelike: the player controls a single
rook and crosses the board in 10 escalating levels to capture the enemy
king, earning permanent abilities between runs. A new board rotates in every
day.

No account is required to play. Progress (abilities, trophies, difficulty
unlocks) is stored on device. There are no purchases, no ads, and no user
generated content.

Native features: haptic feedback on moves, captures, ability plays, level
clears and defeats; native splash and status bar theming; portrait lock;
branded offline screen.

To reach gameplay immediately: launch the app, tap the daily run card and
play. The tutorial (5 short beats) runs on first launch only.
```

## Screenshots

`data/appstore/screenshots/*.png` — 1290 x 2796 (6.7" iPhone; ASC reuses it for
every smaller size). Regenerate from the live site with
`node scripts/appstore-screenshots.mjs`, then push to ASC with
`node scripts/asc-listing.mjs --shots`. Files upload in filename order.

## Status (2026-09-03) — listing is FILLED, one click from submit

Everything above is already applied to the ASC record (app id 6802359470) by
`scripts/asc-listing.mjs`: name, subtitle, categories (Games > Board/Strategy,
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
declare (matches what the webview actually does — PostHog + Supabase leaderboard):

- Data Types: **Identifiers → Device ID** (the random player id used for the
  leaderboard) and **Usage Data → Product Interaction** (PostHog).
- Both: Purpose = Analytics (+ App Functionality for Device ID), **not linked to
  identity**, **not used for tracking**.
- Do NOT declare email / name / contacts — there is no sign-in.

Review will 409 until that label is published. After it is:
`node scripts/asc-listing.mjs --submit`.
