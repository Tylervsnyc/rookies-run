# Reply to Apple — Guideline 4.3(a) Design: Spam (Rookie's Revenge 1.0, build 18)

Submission c2dd5f35-ccc8-4305-955c-a17dfb65baed · rejected Sep 24, 2026 · reviewed on iPad Air 11" (M3)

Paste the block below into "Reply to App Review" on the submission page, then
Resubmit. Attach a 60–90s gameplay recording (daily run: ability pick → level →
king capture) — reviewers rarely play past the first screen.

---

Thank you for the review. We believe this rejection is a false positive and
would like to explain why Rookie's Revenge is a distinct app, not a repackage of
our other titles.

WHAT ROOKIE'S REVENGE IS
A single-player roguelike. You control one rook and cross a series of hand-built
boards to capture a hidden enemy king, choosing ability cards between levels
(knight-hop, freeze, boulder, summon, etc. — 26 in total, each with upgrade
tiers). A new run rotates in daily; a 10-run ladder of 100 levels is always
open. It is a level-based action-strategy game with permadeath runs, a card
build system, trophies, and difficulty tiers. There is no account, no sign-in,
no purchases, no ads.

HOW IT DIFFERS FROM OUR OTHER APPS
- The Chess Path (com.learnthroughstories.chesspath) is a chess LEARNING app:
  a lesson curriculum, tactics puzzles from a puzzle database, and full games
  against an AI opponent. It has accounts, a subscription, and a daily lesson
  streak.
- Chess Boxing (com.learnthroughstories.chessboxing) is a FITNESS app: timed
  chess-puzzle rounds alternating with boxing exercise rounds, with leaderboards
  and crews.
- Rookie's Revenge contains no lessons, no puzzle database, no chess games, no
  boxing, no accounts. Its rules are not chess: one piece, custom enemy
  behaviors, abilities that break normal movement, and roguelike runs.

The three apps share a mascot (Rookie, our rook character) and a developer, the
same way a studio's games share a brand. They share no gameplay code: this
app's engine, level data, ability system, and content were written for this
game and exist in none of our other apps. The binary is a native iOS shell
around this game's own bundled code.

We have also updated the listing to remove references to our other products so
the metadata stands on its own.

Please take a look at the attached gameplay recording, or open the app and tap
DAILY REVENGE → BEGIN. We're happy to answer any further questions.

---

## Metadata changes made alongside the reply (scripts/asc-listing.mjs)
- Description: removed the closing "From the makers of The Chess Path" line.
- Keywords: dropped `puzzle` and `tactics` (Chess Path's keywords); added
  `capture`, `rogue`, `cards`.
- Review notes: added a "How this differs from our other apps" block.
