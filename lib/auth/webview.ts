/**
 * Where OAuth (Google / Apple) can and can't complete — mirrors
 * chess-learning-tree's lib/auth/webview.ts (CHE-390).
 *
 *   - The Rookie's Revenge iOS app (Capacitor, pages served from the device):
 *     an OAuth tap leaves the app's webview for Safari, and the PKCE verifier
 *     lives in the app's storage, so the code exchange can never complete.
 *     chess-learning-tree's two iOS apps hit the same wall and ship EMAIL ONLY
 *     in the shell (no native Sign in with Apple plugin) — Revenge mirrors
 *     that. With no third-party login in the app, Guideline 4.8 does not
 *     require Sign in with Apple there either.
 *   - Social in-app browsers (Instagram / Facebook / TikTok): Google hard-blocks
 *     embedded webviews and Apple's web flow hangs.
 *   - Android: Apple is hidden (no Apple ID in practice).
 *
 * Email + password works everywhere and is always shown.
 */

import { IS_OFFLINE_APP } from '@/lib/config/offline';

/** True inside the Revenge iOS app. */
export function isNativeShell(): boolean {
  if (IS_OFFLINE_APP) return true;
  if (typeof window === 'undefined') return false;
  const w = window as Window & { Capacitor?: { isNativePlatform?: () => boolean } };
  return w.Capacitor?.isNativePlatform?.() === true;
}

/** True when OAuth can't complete here: the native shell or a social app's webview. */
export function isInAppWebview(): boolean {
  if (isNativeShell()) return true;
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Instagram|FBAN|FBAV|FB_IAB|musical_ly|TikTok|BytedanceWebview/i.test(ua) || /;\s?wv\)/.test(ua);
}

export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent || '');
}

/** Hide "Continue with Apple": any webview / the app, or Android. */
export function hideAppleOAuth(): boolean {
  return isInAppWebview() || isAndroid();
}
