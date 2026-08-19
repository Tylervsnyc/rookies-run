'use client';

/**
 * TrophyGlyph — the Rookie's Revenge trophy mark used by the Trophy Room,
 * the landing, and the achievement pop-up tile.
 *
 * The old top-toast that lived here was replaced by the shared
 * components/achievements/AchievementPop (+ RunAchievementPop adapter), the
 * one achievement pop-up system shared with Chess Boxing.
 */
export function TrophyGlyph({ size = 22, color = '#f5cf5a' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3h10v3a5 5 0 0 1-10 0V3Z"
        fill={color}
      />
      <path d="M5 4h2v2.5A3 3 0 0 1 4 8V5a1 1 0 0 1 1-1Zm14 0a1 1 0 0 1 1 1v3a3 3 0 0 1-3-1.5V4h2Z" fill={color} opacity=".8" />
      <path d="M11 11h2v3h-2z" fill={color} />
      <path d="M8 16h8l1 3H7l1-3Z" fill={color} />
    </svg>
  );
}
