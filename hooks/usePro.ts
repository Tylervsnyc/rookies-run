'use client';

import { createContext, useContext } from 'react';
import type { ProTrigger } from '@/lib/pro/rules';

/**
 * usePro() — the one Pro read in Rookie's Revenge.
 *
 * Backed by <ProProvider> (components/pro/ProProvider.tsx, mounted in the root
 * layout). `isPro` = a live premium/trial row in the shared `profiles` table
 * (lib/subscription.ts isProSubscription), OR `is_admin`, OR a StoreKit
 * purchase/restore that just succeeded this session (the webhook writes the
 * row a moment later). With PRO_ACTIVE off (the default) this returns the
 * inert value below: `active: false`, and every `require*` lets the player
 * through — the app behaves exactly as before Pro existed.
 */
export interface ProState {
  /** PRO_ACTIVE — false means no gate anywhere. */
  active: boolean;
  loading: boolean;
  isPro: boolean;
  userId: string | null;
  email: string | null;
  /** Endless runs started today (server count when signed in, local hint for guests). */
  endlessUsedToday: number;
  /** A free player has used today's Endless. */
  endlessLocked: boolean;
  /** Is this ladder tile Pro-locked for this player? */
  rungLocked: (num: number, bonus: boolean) => boolean;
  /** Open the Rookie Pro sheet. */
  openPaywall: (trigger: ProTrigger) => void;
  /** true = go ahead; false = locked (the sheet was opened). */
  requireRung: (num: number, bonus: boolean) => boolean;
  /** true = go ahead; false = today's free Endless is used (the sheet was opened). */
  requireEndless: () => boolean;
  /** Count one Endless start (call when a session actually begins). */
  recordEndless: (seed: number) => void;
}

export const INERT_PRO: ProState = {
  active: false,
  loading: false,
  isPro: false,
  userId: null,
  email: null,
  endlessUsedToday: 0,
  endlessLocked: false,
  rungLocked: () => false,
  openPaywall: () => {},
  requireRung: () => true,
  requireEndless: () => true,
  recordEndless: () => {},
};

export const ProContext = createContext<ProState>(INERT_PRO);

export function usePro(): ProState {
  return useContext(ProContext);
}
