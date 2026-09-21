-- APPLY THIS IN THE SUPABASE SQL EDITOR. Safe to paste twice.
--
-- The daily board ranks by the run's SCORE (points) — the number the
-- run-summary screen shows — instead of levels cleared then captures
-- (Tyler 2026-09-21). NULLABLE on purpose: rows written before today and
-- submissions from older app builds carry no score and keep working; they
-- rank below every scored row. The API (app/api/run/score, /leaderboard)
-- already runs with or without this column, so nothing breaks either way.
--
-- Board order (TODAY): score DESC NULLS LAST, levels_cleared DESC,
-- captures DESC, created_at ASC. Endless is unchanged (idx_run_scores_board).
--
-- Verify AFTER running:
--   curl -s "https://run.chesspath.app/api/run/leaderboard?date=$(date +%F)&run=endless"
-- rows now carry "score" (null on Endless); a new daily run shows its points.

ALTER TABLE public.run_scores
  ADD COLUMN IF NOT EXISTS score INTEGER CHECK (score >= 0);

CREATE INDEX IF NOT EXISTS idx_run_scores_board_score
  ON public.run_scores (run_date, run_id, score DESC NULLS LAST, levels_cleared DESC, captures DESC, created_at ASC);
