/**
 * Rookie's Revenge brand colours — the reticle red and its pressed shade.
 * Canonical home for these values; components/run/RookiesRevengeLogo.tsx
 * re-exports them for client code. Kept in lib/ so server code (the share
 * card's OG renderer) can use them without importing a 'use client' module.
 */
export const REVENGE_RED = '#E53935';
export const REVENGE_RED_DARK = '#B71C1C';
