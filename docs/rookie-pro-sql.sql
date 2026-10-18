-- ROOKIE PRO (Rookie's Revenge) — APPLY IN THE SUPABASE SQL EDITOR (Tyler).
-- Project ruseupjmldymfvpybqdl (shared with Chess Path / Chess Boxing).
-- Safe to paste twice. Nothing here touches `profiles` — the entitlement is
-- written only by chess-learning-tree's RevenueCat + Stripe webhooks.
--
-- Both pieces are optional for the app to RUN: with them missing, the code
-- degrades (Endless limit falls back to the local count, no gold names on
-- Ranks). Apply before flipping FEATURE_FLAGS.PRO.

-- 1. Endless starts per account per local day (the free tier's 1/day limit).
--    Insert + read own rows only; no update/delete, so a player can't clear
--    their own count through the anon key.
CREATE TABLE IF NOT EXISTS public.revenge_endless_plays (
  id          BIGSERIAL   PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  play_date   DATE        NOT NULL,             -- the player's LOCAL calendar date
  seed        BIGINT      NOT NULL DEFAULT 0,   -- the Endless session seed (debug only)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revenge_endless_plays_user_day
  ON public.revenge_endless_plays (user_id, play_date);

ALTER TABLE public.revenge_endless_plays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "endless plays own read"   ON public.revenge_endless_plays;
DROP POLICY IF EXISTS "endless plays own insert" ON public.revenge_endless_plays;

CREATE POLICY "endless plays own read"
  ON public.revenge_endless_plays FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "endless plays own insert"
  ON public.revenge_endless_plays FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 2. Gold name + Pro badge on Ranks. Stamped server-side by /api/run/score
--    from the request's own session (never from the request body).
--    NOTE: run_scores' existing RLS lets anyone UPDATE any row with the anon
--    key (it was built as an anonymous scoreboard), so this badge is cosmetic,
--    exactly as forgeable as the scores themselves.
ALTER TABLE public.run_scores
  ADD COLUMN IF NOT EXISTS is_pro BOOLEAN NOT NULL DEFAULT FALSE;

-- Verify:
--   SELECT count(*) FROM public.revenge_endless_plays;          -- 0, no error
--   SELECT is_pro FROM public.run_scores LIMIT 1;               -- column exists
