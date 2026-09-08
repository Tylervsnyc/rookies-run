-- Rookie's Revenge — cloud copy of the local player profile (plan 1.2).
-- ONE jsonb blob per user, the exact `PlayerProfile` shape from
-- lib/run/profile.ts (difficulty, unlockedAbilities, achievements, counters,
-- bests, ladder). Merged with localStorage on sign-in by
-- lib/run/profile-sync.ts; pushed (debounced) after every local write.
-- Read/written CLIENT-SIDE under RLS — no service role, no API route.
--
-- Tyler runs this in the Supabase SQL editor (DDL rule). Not applied by code.

CREATE TABLE IF NOT EXISTS public.revenge_profiles (
  user_id    UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile    JSONB       NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.revenge_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own revenge profile"
  ON public.revenge_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own revenge profile"
  ON public.revenge_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own revenge profile"
  ON public.revenge_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
