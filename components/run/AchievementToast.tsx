'use client';

import { useEffect } from 'react';
import type { AchievementDef } from '@/lib/run/achievements';
import { markAchievementsSeen } from '@/lib/run/profile';

interface Props {
  achievement: AchievementDef | undefined;
  onDone: () => void;
  /** ms before it slides away. */
  ttl?: number;
}

/**
 * Non-blocking trophy pop. Slides in from the top, never covers the board
 * for long, tap to dismiss. Renders ONE at a time; the page feeds it a queue.
 */
export function AchievementToast({ achievement, onDone, ttl = 3400 }: Props) {
  useEffect(() => {
    if (!achievement) return;
    markAchievementsSeen([achievement.id]);
    const t = setTimeout(onDone, ttl);
    return () => clearTimeout(t);
  }, [achievement, onDone, ttl]);

  if (!achievement) return null;

  return (
    <>
      <style>{`
        @keyframes rrTrophyIn {
          0%   { opacity: 0; transform: translate(-50%, -24px) scale(0.96); }
          60%  { opacity: 1; transform: translate(-50%, 4px) scale(1.01); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @keyframes rrTrophyShine {
          0% { transform: translateX(-120%) skewX(-18deg); }
          100% { transform: translateX(260%) skewX(-18deg); }
        }
      `}</style>
      <button
        type="button"
        onClick={onDone}
        key={achievement.id}
        className="fixed left-1/2 top-3 z-[60] w-[min(92vw,360px)] text-left rounded-2xl overflow-hidden shadow-2xl active:scale-[0.98] transition-transform"
        style={{
          animation: 'rrTrophyIn 0.45s cubic-bezier(.16,1,.3,1) backwards',
          background: 'linear-gradient(135deg, #f7d774 0%, #e9b53a 45%, #f9e29a 100%)',
          border: '2px solid #b98a1a',
        }}
        aria-live="polite"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-16 bg-white/40 blur-sm"
          style={{ animation: 'rrTrophyShine 1.4s ease-in-out 0.3s 1 both' }}
        />
        <div className="flex items-center gap-3 px-3.5 py-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#2A3C45] flex items-center justify-center shrink-0 shadow-inner">
            <TrophyGlyph />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] uppercase tracking-[0.2em] font-black text-[#6b4a05]">
              {achievement.unlocks ? 'Trophy · new ability' : 'Trophy'}
            </div>
            <div className="text-[15px] font-black text-[#2A3C45] leading-tight truncate">
              {achievement.name}
            </div>
            <div className="text-[11px] font-semibold text-[#4d3a10] leading-snug line-clamp-2">
              {achievement.blurb}
            </div>
          </div>
        </div>
      </button>
    </>
  );
}

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
