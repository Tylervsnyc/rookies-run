/**
 * True inside the offline app bundle that ships in the Rookie's Revenge iOS app.
 *
 * Set by scripts/build-offline.mjs at build time; never set for the Vercel
 * build, so every `IS_OFFLINE_APP` branch is dead code on the web and gets
 * stripped from the browser bundle.
 *
 * Use it for "there is no server" decisions ONLY — not for "the network is
 * currently down". The app bundle still talks to run.chesspath.app whenever it
 * has signal; losing signal at runtime is lib/net/offline-fetch.ts's job.
 */
export const IS_OFFLINE_APP = process.env.NEXT_PUBLIC_OFFLINE_BUILD === '1';
