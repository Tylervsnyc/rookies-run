'use client';

/**
 * useProgress — turns board-state transitions into RunEvents, feeds them to
 * the profile reducer, and queues the achievement toasts + ability-unlock
 * reveals for the page to render. ONE place; the page never touches counters.
 *
 * Diff-derived here: capture, ability-used, convert, offer-picked/skipped.
 * Page-emitted (needs page context): level-cleared, level-lost, run-completed.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AbilityId } from '@/lib/run/abilities';
import type { AchievementDef, CaptureVia, RunEvent } from '@/lib/run/achievements';
import { applyRunEvent, readProfile, type PlayerProfile } from '@/lib/run/profile';
import { toSquare, type BoardState, type Coord } from '@/lib/run/types';
import { trackEvent } from '@/lib/analytics/posthog';

export interface ProgressQueue {
  achievements: AchievementDef[];
  unlocks: AbilityId[];
}

function kingOf(state: BoardState): Coord | null {
  const k = state.pieces.find((p) => p.type === 'king');
  return k ? { file: k.file, rank: k.rank } : null;
}

export function useProgress(state: BoardState) {
  const [profile, setProfile] = useState<PlayerProfile>(() => readProfile());
  const [queue, setQueue] = useState<ProgressQueue>({ achievements: [], unlocks: [] });
  const prevRef = useRef<BoardState>(state);
  const abilityUsedRef = useRef<Set<string>>(new Set());

  const emit = useCallback((ev: RunEvent) => {
    const res = applyRunEvent(ev);
    setProfile(res.profile);
    if (res.earned.length > 0 || res.unlockedAbilities.length > 0) {
      setQueue((q) => ({
        achievements: [...q.achievements, ...res.earned],
        unlocks: [...q.unlocks, ...res.unlockedAbilities],
      }));
      for (const a of res.earned) trackEvent('achievement_unlocked', { id: a.id, unlocks: a.unlocks ?? null });
      for (const id of res.unlockedAbilities) trackEvent('ability_unlocked', { id });
    }
    return res;
  }, []);

  // Session start — once per mount.
  useEffect(() => {
    emit({ type: 'session-start', hour: new Date().getHours(), difficulty: readProfile().difficulty });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Diff-derived events.
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = state;
    if (prev === state) return;
    // New level / new run → nothing to diff (captures reset).
    if (state.captures.length < prev.captures.length || state.level !== prev.level) return;

    // Captures.
    const added = state.captures.slice(prev.captures.length);
    if (added.length > 0) {
      const fxChanged = state.lastAbilityFx && state.lastAbilityFx.id !== prev.lastAbilityFx?.id;
      let via: CaptureVia = 'move';
      if (prev.turn === 'drones' || (fxChanged && state.lastAbilityFx?.kind === 'drones')) via = 'drones';
      else if (prev.turn === 'allies') via = 'ally';
      else if (prev.turn === 'enemy') via = 'enemy-phase';
      const king = kingOf(prev);
      const kingWasFrozen = !!king && prev.frozenSquares.includes(toSquare(king));
      for (const piece of added) {
        emit({
          type: 'capture',
          piece,
          via,
          form: prev.form,
          duringSurge: prev.bonusMovesLeft > 0,
          salvo: added.length,
          kingWasFrozen,
          level: state.level,
        });
      }
    }

    // Ability used — a charge was spent (or an unlimited ability fired an fx).
    for (const a of state.abilities) {
      const before = prev.abilities.find((b) => b.id === a.id);
      if (!before) continue;
      const spent = before.usesLeftThisLevel > 0 && a.usesLeftThisLevel < before.usesLeftThisLevel;
      const fxFired =
        a.usesLeftThisLevel === -1 &&
        state.lastAbilityFx &&
        state.lastAbilityFx.id !== prev.lastAbilityFx?.id &&
        state.lastAbilityFx.kind === (a.id as string);
      if (spent || fxFired) {
        abilityUsedRef.current.add(a.id);
        const king = kingOf(prev);
        const targetIsKing =
          !!king &&
          !!state.lastAbilityFx &&
          state.lastAbilityFx.id !== prev.lastAbilityFx?.id &&
          state.lastAbilityFx.to === toSquare(king);
        emit({ type: 'ability-used', id: a.id, tier: a.tier, targetIsKing });
      }
    }

    // Convert — a new ally with source 'convert'.
    if (state.allies.length > prev.allies.length) {
      const prevIds = new Set(prev.allies.map((x) => x.id));
      for (const ally of state.allies) {
        if (!prevIds.has(ally.id) && ally.source === 'convert') emit({ type: 'convert', piece: ally.type });
      }
    }

    // Offers.
    if (prev.pendingOffer && !state.pendingOffer) {
      const picked = state.abilities.find((a) => {
        const b = prev.abilities.find((x) => x.id === a.id);
        return !b || b.tier !== a.tier;
      });
      if (picked) emit({ type: 'offer-picked', id: picked.id, tier: picked.tier });
      else emit({ type: 'offer-skipped' });
    }
  }, [state, emit]);

  const abilitiesUsedThisRun = useCallback(() => abilityUsedRef.current.size, []);
  const resetRunScope = useCallback(() => {
    abilityUsedRef.current = new Set();
  }, []);

  const shiftAchievement = useCallback(() => {
    setQueue((q) => ({ ...q, achievements: q.achievements.slice(1) }));
  }, []);
  const shiftUnlock = useCallback(() => {
    setQueue((q) => ({ ...q, unlocks: q.unlocks.slice(1) }));
  }, []);

  return { profile, setProfile, emit, queue, shiftAchievement, shiftUnlock, abilitiesUsedThisRun, resetRunScope };
}
