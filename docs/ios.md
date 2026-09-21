# Shipping the iOS app

Replaces Chess Path's `ios-setup.md`, which is stale — it tells you to install
CocoaPods and open `App.xcworkspace`. Capacitor 8 uses **Swift Package Manager**:
there is no `Podfile`, no `Pods/`, and `cap open ios` opens `App.xcodeproj`.

## How the app actually works (updated 2026-09-21)

**Since build 7 (2026-09-18, commits a186f54 + 81cc6d2) the iOS app ships an
ON-DEVICE BUNDLE.** `capacitor.config.ts` has `webDir: 'capacitor-bundle'` and
**no `server.url`**. `npm run build:offline` (`scripts/build-offline.mjs`)
makes a static export of the game into `capacitor-bundle/` (gitignored), and
Capacitor serves it from the device. The game opens and plays with no signal.

It is a hybrid only for DATA, never for code: when there is signal the bundle
calls `https://run.chesspath.app/api/*` (`lib/net/offline-fetch.ts`) for run
saves, streak and the leaderboard; with no signal, saves queue
(`lib/net/outbox.ts`) and drain on reconnect.

**So a `git push` does NOT update the iOS app.** Pushing updates the website
and the server API only. Every change to levels, abilities, copy, art or UI
reaches iPhones only through: `build:offline` -> `ios:sync` -> `fastlane beta`
-> `fastlane upload` -> App Store review. "Bundle synced" is not "app updated".

Builds 1-6 were the old design: a WKWebView on `server.url:
'https://run.chesspath.app'`, where a push was enough. That is gone.
`capacitor-shell/index.html` (the old offline fallback screen) is no longer
referenced by the config.

## One-time setup (Mac)

1. Full **Xcode** from the App Store — Command Line Tools alone can't
   `xcodebuild`. Then:
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```
2. `brew install fastlane`
3. Put the App Store Connect API key at `~/Downloads/AuthKey_767R5DY9P3.p8`
   (the same key Chess Boxing uses; the Fastfile expects this exact path).
4. App record exists (ASC id 6802359470, created 2026-08-17). The whole
   App Store listing is applied by `node scripts/asc-listing.mjs` — see
   `docs/appstore-metadata.md` for the copy and the one browser-only step
   (App Privacy label).

## Build and ship

```bash
npm install            # REQUIRED FIRST — see below
npm run ios:assets     # regenerate icon + splash (only if art changed)
npm run build:offline  # static export -> capacitor-bundle/. ONE at a time, to
                       # completion, not sandboxed (see scripts/build-offline.mjs)
npm run ios:sync       # cap sync ios; refuses to run without a built bundle
# verify your change is in the synced bundle, e.g.
#   grep -rl "<string from your change>" ios/App/App/public/_next/static/chunks/
cd ios/App
fastlane beta        # cert, profile, bump build number, archive, sign
fastlane upload      # -> TestFlight
fastlane status      # poll until processing -> valid
fastlane fix_compliance   # only if TestFlight blocks on export compliance
fastlane invite      # create/ensure the Internal group, add the build
fastlane add_tester  # add tyler@tylervsnyc.com
```

## App Store submission

```bash
node scripts/asc-listing.mjs --status    # what ASC has right now
node scripts/asc-listing.mjs --submit    # attach newest VALID build to 1.0 + submit for review
```

For a later version: bump `MARKETING_VERSION` in `App.xcodeproj/project.pbxproj`,
`fastlane beta && fastlane upload`, then `VERSION=1.1 node scripts/asc-listing.mjs`
(creates the version + copies the listing) and `--submit`.

> **`npm install` must run before Xcode opens.**
> `ios/App/CapApp-SPM/Package.swift` references plugins by relative path
> (`../../../node_modules/@capacitor/*`). On a fresh clone, Swift Package
> resolution fails with "package not found" until `node_modules` exists.

## Things that bit Chess Path — already fixed here

| Trap | Status |
|---|---|
| `Info.plist` hardcoded `CFBundleVersion` to a literal while the pbxproj said something else, so build bumps did nothing and TestFlight rejected uploads with "build number already exists" | Fixed — reads `$(CURRENT_PROJECT_VERSION)`, and `fastlane beta` now calls `increment_build_number` off the latest TestFlight build |
| Shipped TestFlight builds showing **Capacitor's stock logo**, because nobody replaced the generated placeholder splash | Fixed — `npm run ios:assets` generates the icon and splash from Rookie herself, mirroring BreathingRook's exact geometry and shading; both are committed |
| Splash background mismatched between config, imageset, launch storyboard and the web overlay, flashing white on every cold start | Fixed — `#eef6fc` in all four places. The storyboard uses an explicit colour, not `systemBackgroundColor` (which is **black** in dark mode) |
| `NSCameraUsageDescription` for a camera feature that isn't shipping | Removed |
| `@capacitor/haptics` installed but never imported | Actually used — see `lib/haptics.ts` |

## Traps hit on the first Mac build (2026-08-17)

| Trap | Status |
|---|---|
| `cert` failed with "Keychain not found at /tmp/rookiesrun.keychain-db" — /tmp is wiped on reboot | Fixed — `fastlane beta` now creates + unlocks the keychain itself |
| `xcodebuild -resolvePackageDependencies` hung forever (0% CPU) at "Checking out 8.5.0 of capacitor-swift-pm" — Xcode never finished downloading the 8.5.0 binary xcframeworks, even though curl fetched them fine | Worked around — Capacitor pinned to **8.4.2** (exact), the version Chess Boxing builds with. If you bump Capacitor, delete `Package.resolved` + `~/Library/Developer/Xcode/DerivedData/App-*` and re-resolve with a timeout before trusting it |

## Apple Guideline 4.2

A WKWebView around a website is the classic "minimum functionality" rejection,
and this app is more exposed than Chess Boxing (which argued 4.2 on bout mode
plus a timed workout). What's shipping in our favour:

- **Haptics** on moves, captures, ability plays, level clears and death
  (`lib/haptics.ts`) — native feedback a reviewer physically feels.
- **Native splash + launch image** with no colour flash.
- **Status bar theming** (`components/run/StatusBarSync.tsx`).
- **Portrait-only**, so there's no orientation a reviewer can rotate into and
  find broken.
- **Full offline play** — the game is on the device (build 7+).

Write the review notes concretely — "a daily chess roguelike: cross the board
in 10 escalating levels, earning permanent abilities; new board every day" —
and don't claim anything that isn't shipping.

**2026-09-21: the 4.2 escalation has been taken.** Build 7 bundles the whole
game into `webDir`, so it is fully playable in airplane mode — the strongest
4.2 argument we have; say so in the review notes. The earlier advice here
("do NOT bundle into `webDir`", use a service worker instead) was reversed on
2026-09-18. The price, accepted knowingly: web deploys no longer reach iOS
with a git push (see the top of this file).

## Local device testing against a dev server

Temporarily ADD a `server` block (the release config has none) pointing at
your Mac's LAN IP, with cleartext allowed:

```ts
server: { url: 'http://192.168.x.x:3000', cleartext: true },
```

Then `npm run ios:sync` and run from Xcode. **Remove the block before building
a release** — a release with `server.url` set is the old live-URL app.
