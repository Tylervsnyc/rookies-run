'use client';

import { useCallback, useMemo } from 'react';
import type { AchievementDef } from '@/lib/run/achievements';
import { markAchievementsSeen } from '@/lib/run/profile';
import { fireConfetti } from '@/lib/confetti';
import { playCelebrationSound, playErrorSound, playLevelClearSound, playCardDrawSound } from '@/lib/sounds';
import { haptic, hapticError, hapticSuccess } from '@/lib/haptics';
import AchievementPop, { type PopAccent, type PopItem, type PopSize } from './AchievementPop';
import { TrophyGlyph } from '@/components/run/AchievementToast';

/**
 * Rookie's Revenge adapter over the shared AchievementPop (the one pop-up
 * system shared with Chess Boxing — see AchievementPop.tsx header).
 *
 * Sizing: most trophies are the nod (s, top toast — the board and controls
 * own the bottom of the screen). Run-level moments (difficulty / habit) play
 * as the card (m); the two capstones play the full ceremony (l). Fails are
 * roasts: sting + no confetti. Ability unlocks stay small here — the
 * AbilityUnlockModal that follows IS the big reveal.
 *
 * The page feeds one achievement at a time from its queue (unchanged
 * contract with the old AchievementToast), so `items` is always 0 or 1.
 */
export const RR_ACCENT: PopAccent = { ring: '#e9b53a', bg: '#fff4d1', text: '#8a5d07' };
const RR_ACCENT_ROAST: PopAccent = { ring: '#94A3B8', bg: '#F1F5F9', text: '#64748B' };
const RR_ACCENT_CAPSTONE: PopAccent = { ring: '#e9b53a', bg: '#fff1c4', text: '#b3261e' };

const CAPSTONES = new Set(['revenge-served', 'full-course']);

export function popSizeFor(a: AchievementDef): PopSize {
  if (CAPSTONES.has(a.id)) return 'l';
  if (a.group === 'difficulty' || a.group === 'habit') return 'm';
  return 's';
}

export function toRunPopItem(a: AchievementDef): PopItem {
  const roast = a.group === 'fails';
  const size = popSizeFor(a);
  const capstone = size === 'l';
  return {
    id: a.id,
    name: a.name,
    line: a.blurb,
    icon: <TrophyGlyph size={size === 'l' ? 44 : size === 'm' ? 34 : 22} color={roast ? '#64748B' : '#b98a1a'} />,
    accent: roast ? RR_ACCENT_ROAST : capstone ? RR_ACCENT_CAPSTONE : RR_ACCENT,
    size,
    mood: roast ? 'roast' : 'proud',
    shimmer: capstone,
    eyebrow: roast
      ? 'Trophy… earned'
      : a.unlocks
        ? 'Trophy · new ability'
        : capstone
          ? 'Revenge complete'
          : 'Trophy',
  };
}

export function RunAchievementPop({
  achievement,
  onDone,
}: {
  achievement: AchievementDef | undefined;
  onDone: () => void;
}) {
  const items = useMemo<PopItem[]>(() => (achievement ? [toRunPopItem(achievement)] : []), [achievement]);
  const handleDone = useCallback(
    (playedIds: string[]) => {
      markAchievementsSeen(playedIds);
      onDone();
    },
    [onDone],
  );
  if (!achievement) return null;
  return (
    <AchievementPop
      key={achievement.id}
      items={items}
      fx={{ onShow: playRunFx }}
      onDone={handleDone}
      toastEdge="top"
      zIndex={60}
      overflowLabel={(n) => `+${n} more in the Trophy Room`}
    />
  );
}

/** Revenge fx: card-draw tick / level-clear sting / full fanfare by size; fails get the error buzz. */
export function playRunFx(item: PopItem, { reducedMotion }: { reducedMotion: boolean }) {
  if (item.mood === 'roast') {
    void playErrorSound();
    hapticError();
    return;
  }
  if (item.size === 's') {
    playCardDrawSound();
    haptic('light');
    return;
  }
  if (item.size === 'm') {
    playLevelClearSound(0);
    hapticSuccess();
    if (!reducedMotion) void fireConfetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    return;
  }
  playCelebrationSound();
  hapticSuccess();
  if (!reducedMotion) {
    const colors = ['#f7d774', '#e9b53a', '#b3261e', '#FFFFFF'];
    void fireConfetti({ particleCount: 120, spread: 90, origin: { y: 0.55 }, colors });
    setTimeout(() => void fireConfetti({ particleCount: 60, spread: 120, origin: { y: 0.4 }, colors }), 450);
  }
}
