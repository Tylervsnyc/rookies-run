'use client';

import { StampButton, StampCard } from './StampCard';

/**
 * Level cleared — "The Stamp" (Tyler, 2026-09-03). The level number slams
 * down gold, CLEARED stamps over it, the pips fill through this level. No
 * quip: the number and the stamp are the whole message.
 */
interface LevelClearedModalProps {
  level: number;
  totalLevels: number;
  tempo: number;
  onNext: () => void;
  /** Run name shown in the kicker above the number. */
  runName?: string;
}

export function LevelClearedModal({ level, totalLevels, tempo: _tempo, onNext, runName }: LevelClearedModalProps) {
  const last = level >= totalLevels;
  return (
    <StampCard kicker={`${runName ?? 'Today’s run'} · level ${level}`} level={level} totalLevels={totalLevels} stamp="Cleared" tone="won">
      <StampButton color="#58CC02" shadow="#3d8c01" onClick={onNext}>
        {last ? 'Finish' : 'Next level'}
      </StampButton>
    </StampCard>
  );
}
