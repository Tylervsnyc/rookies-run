/**
 * Board pacing (ms). One place to tune how fast turns play out.
 *
 * 2026-08-17: the original values (slide 180 / enemy tick 220) read as a blur
 * on a phone — Tyler's first TestFlight note was "animations are too fast".
 * Slowed ~1.8x. Keep PIECE_SLIDE_MS < each tick so a piece lands before the
 * next one starts moving.
 */
export const PIECE_SLIDE_MS = 320;
export const ENEMY_TICK_MS = 420;
export const ALLY_TICK_MS = 440;
export const DRONE_TICK_MS = 520;
/**
 * Enemy-on-enemy capture (rabid / decoy): the attacker slides natively on
 * the board (PIECE_SLIDE_MS); the impact overlay (victim crunch + burst)
 * lives this long.
 */
export const ENEMY_CAPTURE_FX_MS = PIECE_SLIDE_MS + 260;
