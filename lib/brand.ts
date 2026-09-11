/**
 * Rookie's Revenge brand colours — the reticle red and its pressed shade.
 * Canonical home for these values; components/run/RookiesRevengeLogo.tsx
 * re-exports them for client code. Kept in lib/ so server code (the share
 * card's OG renderer) can use them without importing a 'use client' module.
 */
export const REVENGE_RED = '#E53935';
export const REVENGE_RED_DARK = '#B71C1C';

/** The mark's ground (2026-09-11 rebrand): crimson tile behind the hero rook. */
export const REVENGE_CRIMSON = '#C62828';
export const REVENGE_CRIMSON_DEEP = '#7F1414';
