'use client';

import { useEffect } from 'react';

/**
 * StatusBarSync — makes the iPhone status bar (clock/battery) blend with the
 * screen behind it inside the native shell.
 *
 * The status bar overlays the webview, so its background is whatever the page
 * paints under the safe area; the only thing to manage is TEXT color. This app
 * is light on every screen (--color-chess-page), so it's a single call rather
 * than Chess Path's per-route table.
 *
 * Native-only: renders nothing and does nothing on web.
 */
/**
 * Flip the status bar TEXT color for a dark screen (the Arena home is navy).
 * `light: true` = white text. No-op on web. Callers restore with `false`.
 */
export function setStatusBarText(light: boolean): void {
  if (typeof window === 'undefined' || window.Capacitor?.isNativePlatform?.() !== true) return;
  import('@capacitor/status-bar')
    .then(({ StatusBar, Style }) => StatusBar.setStyle({ style: light ? Style.Dark : Style.Light }))
    .catch(() => {});
}

export function StatusBarSync() {
  useEffect(() => {
    if (window.Capacitor?.isNativePlatform?.() !== true) return;
    let cancelled = false;
    import('@capacitor/status-bar')
      .then(({ StatusBar, Style }) => {
        if (cancelled) return;
        // Style.Light means DARK text — correct over our light background.
        return StatusBar.setStyle({ style: Style.Light });
      })
      .catch(() => {
        /* plugin unavailable — nothing to sync */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
