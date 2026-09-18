import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Rookie's Revenge — native iOS shell around an ON-DEVICE copy of the game.
 *
 * `webDir` holds a static export built by `npm run build:offline`
 * (scripts/build-offline.mjs), so the app opens and plays with no signal. It
 * used to set `server.url = 'https://run.chesspath.app'` — the whole app was a
 * remote page, and no signal meant no game. When there IS signal the bundle
 * still talks to run.chesspath.app for saves, streak and the leaderboard
 * (lib/net/offline-fetch.ts).
 *
 * The cost: shipping web code to iOS is no longer a `git push`. It is
 *   npm run build:offline && npm run ios:sync  ->  fastlane beta + upload.
 * `ios:sync` refuses to run without a built bundle, so a stale or empty webDir
 * can't ship by accident.
 *
 * A native splash covers the first paint so launch never shows a blank web
 * view (Apple Guideline 4.2).
 *
 * `backgroundColor` MUST match, exactly:
 *   - ios/App/App/Assets.xcassets/Splash.imageset/*.png  (canvas fill)
 *   - ios/App/App/Base.lproj/LaunchScreen.storyboard     (background color)
 *   - components/run/NativeSplash.tsx                    (SPLASH_BG)
 *   - app/layout.tsx                                     (viewport.themeColor)
 * Chess Boxing left this at Capacitor's default white between two navy
 * screens and flashed white on every cold start. Ours is light because the
 * game's first paint is --color-chess-page (#eef6fc) — do NOT copy Chess
 * Boxing's navy here.
 *
 * For on-device dev against a local server, temporarily add
 *   server: { url: 'http://192.168.x.x:3000', cleartext: true }
 */
const config: CapacitorConfig = {
  appId: 'com.learnthroughstories.rookiesrun',
  appName: "Rookie's Revenge",
  // The static export from `npm run build:offline`. No `server.url`: the game
  // is served from the device.
  webDir: 'capacitor-bundle',
  ios: {
    // 'never' (2026-09-03): the web view runs edge-to-edge and every Revenge
    // screen pads with env(safe-area-inset-*) itself, so the notch + home bar
    // paint navy instead of the shell's light color. Needs a native rebuild.
    contentInset: 'never',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1400,
      backgroundColor: '#eef6fc',
      showSpinner: false,
    },
  },
};

export default config;
