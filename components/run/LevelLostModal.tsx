'use client';

import { REVENGE_RED, REVENGE_RED_DARK } from './RookiesRevengeLogo';
import { StampButton, StampCard, StampChip } from './StampCard';

/**
 * Level lost, run not over — "The Stamp" (Tyler, 2026-09-03), same card as
 * LevelClearedModal: the number lands as a ghost, CAPTURED stamps over it,
 * the pip for THIS level burns red, the screen shakes once. Shown only while
 * the difficulty mode still has retries for this level; "Give up" hands off
 * to the regular run-over summary.
 */
interface LevelLostModalProps {
  level: number;
  totalLevels: number;
  /** Retries remaining for this level AFTER this loss. Infinity = unlimited. */
  retriesLeft: number;
  /** 'unwinnable' = the solver proved the king was out of reach. */
  reason?: 'unwinnable';
  difficultyLabel?: string;
  onRetry: () => void;
  onGiveUp: () => void;
}

export function LevelLostModal({ level, totalLevels, retriesLeft, reason, difficultyLabel, onRetry, onGiveUp }: LevelLostModalProps) {
  const unlimited = !Number.isFinite(retriesLeft);
  const retryChip = unlimited ? 'Unlimited retries' : `${retriesLeft} ${retriesLeft === 1 ? 'retry' : 'retries'} left`;
  return (
    <StampCard
      kicker={`Level ${level} of ${totalLevels}`}
      level={level}
      totalLevels={totalLevels}
      stamp={reason === 'unwinnable' ? 'No way through' : 'Captured'}
      tone="lost"
      testId="level-lost-modal"
      chips={
        <>
          {difficultyLabel && <StampChip>{difficultyLabel}</StampChip>}
          <StampChip gold>{retryChip}</StampChip>
        </>
      }
    >
      <StampButton color={REVENGE_RED} shadow={REVENGE_RED_DARK} onClick={onRetry}>
        Retry level
      </StampButton>
      <button type="button" onClick={onGiveUp} className="min-h-[40px] text-[12px] font-black" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Give up the run
      </button>
    </StampCard>
  );
}
