'use client';

import { useEffect } from 'react';
import { setStatusBarText } from './StatusBarSync';

export const NAVY_SHELL = '#0f1c3f';

/**
 * Paint the page shell navy while a Revenge screen is up (home AND the game,
 * 2026-09-03). The notch + home-bar safe areas show the html background, so
 * without this they flash the light Chess Path shell color; the native
 * status-bar text flips to white to match. Restores everything on unmount —
 * /review, /playtest and the STC surface stay light.
 */
export function useNavyShell(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = { html: html.style.backgroundColor, body: body.style.backgroundColor };
    html.style.backgroundColor = NAVY_SHELL;
    body.style.backgroundColor = NAVY_SHELL;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const prevTheme = meta?.getAttribute('content') ?? null;
    meta?.setAttribute('content', NAVY_SHELL);
    setStatusBarText(true);
    return () => {
      html.style.backgroundColor = prev.html;
      body.style.backgroundColor = prev.body;
      if (meta && prevTheme !== null) meta.setAttribute('content', prevTheme);
      setStatusBarText(false);
    };
  }, [active]);
}
