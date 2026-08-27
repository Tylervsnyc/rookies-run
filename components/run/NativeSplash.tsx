'use client';

import { useEffect, useState } from 'react';
import { RevengeLoader } from '@/components/run/RevengeLoader';

/**
 * NativeSplash — Rookie, breathing, shown ONLY inside the Capacitor native
 * shell while the web app cold-loads from run.chesspath.app. Web visitors
 * never see it. Debug on web with ?nativeSplash=1.
 *
 * This is the same BreathingRook sprite the native launch image freezes (see
 * scripts/generate-ios-assets.ts), so the handoff from the static launch
 * screen to the web overlay is invisible — Rookie simply starts moving.
 *
 * Why it exists: the shell is a WKWebView pointed at a live URL, so without
 * this the first paint after the native launch image is a blank white view.
 * This bridges that gap (Apple Guideline 4.2).
 *
 * SPLASH_BG must match, exactly, in four places or a cold start flashes:
 *   1. here
 *   2. capacitor.config.ts        → plugins.SplashScreen.backgroundColor
 *   3. ios/App/App/Assets.xcassets/Splash.imageset/*.png  (canvas fill)
 *   4. app/layout.tsx            → viewport.themeColor
 * Chess Path shipped a navy splash over a light web page and got a white
 * flash between the two on every launch. Don't repeat that.
 */

declare global {
  interface Window {
    Capacitor?: { isNativePlatform?: () => boolean };
  }
}

export const SPLASH_BG = '#eef6fc';

// Shorter than Chess Boxing's 2200ms — a daily game should open fast, and
// there's no intro animation to show off here.
const INTRO_MS = 1200;
const FADE_MS = 400;

export function NativeSplash() {
  const [phase, setPhase] = useState<'hidden' | 'shown' | 'fading'>('hidden');
  // Native launch image = the mark at 28% of a square canvas, scaleAspectFill
  // (scripts/generate-ios-assets.ts). Match that so the static image hands
  // off to the animated mark without a jump.
  const [size, setSize] = useState(160);

  useEffect(() => {
    const isNative = window.Capacitor?.isNativePlatform?.() === true;
    const isDebug = new URLSearchParams(window.location.search).has('nativeSplash');
    if (!isNative && !isDebug) return;
    setSize(Math.round(0.28 * Math.max(window.innerWidth, window.innerHeight)));
    setPhase('shown');
    const fadeTimer = setTimeout(() => setPhase('fading'), INTRO_MS);
    const doneTimer = setTimeout(() => setPhase('hidden'), INTRO_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: SPLASH_BG,
        opacity: phase === 'fading' ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
    >
      <RevengeLoader size={size} />
    </div>
  );
}
