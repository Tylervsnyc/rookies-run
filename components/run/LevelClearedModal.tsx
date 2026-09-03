'use client';

import { StampButton, StampCard, StampChip } from './StampCard';

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
  /** Rookie moves on the clearing attempt — shown with `levelPar` as a chip. */
  moves?: number;
  /** Per-level par (run par ÷ levels) so "par" is a familiar word by run end. */
  levelPar?: number;
}

export function LevelClearedModal({ level, totalLevels, tempo: _tempo, onNext, runName, moves, levelPar }: LevelClearedModalProps) {
  const last = level >= totalLevels;
  const chips = moves !== undefined && levelPar !== undefined ? <StampChip gold={moves <= levelPar}>{moves} {moves === 1 ? 'move' : 'moves'} · level par {levelPar}</StampChip> : undefined;
  return (
    <StampCard kicker={`${runName ?? 'Today’s run'} · level ${level}`} level={level} totalLevels={totalLevels} stamp="Cleared" tone="won" chips={chips}>
      <StampButton color="#58CC02" shadow="#3d8c01" onClick={onNext}>
        {last ? 'Finish' : 'Next level'}
      </StampButton>
    </StampCard>
  );
}
