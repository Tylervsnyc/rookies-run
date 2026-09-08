-- APPLY THIS IN THE SUPABASE SQL EDITOR.
--
-- Same table as 2026-08-31-run-scores.sql, made safe to paste twice. That
-- migration was written but NEVER APPLIED to the live database, so from the
-- day the leaderboard shipped: every score POST returned {recorded:false,
-- reason:"write-failed"} and every board GET returned {available:false}. The
-- Ranks tab has never had a single row in it — daily or Endless — and both
-- endpoints degrade silently by design, so nothing ever said so.
--
-- Verify AFTER running, from a terminal:
--   curl -s "https://run.chesspath.app/api/run/leaderboard?date=$(date +%F)&run=endless"
-- "available": true means the table is live. Then finish a run and look again.

CREATE TABLE IF NOT EXISTS public.run_scores (
  player_id      TEXT        NOT NULL,
  handle         TEXT        NOT NULL CHECK (char_length(handle) BETWEEN 2 AND 16),
  run_date       DATE        NOT NULL,
  run_id         TEXT        NOT NULL,
  difficulty     TEXT        NOT NULL DEFAULT 'normal',
  levels_cleared INTEGER     NOT NULL CHECK (levels_cleared >= 0),
  total_levels   INTEGER     NOT NULL CHECK (total_levels > 0),
  captures       INTEGER     NOT NULL DEFAULT 0,
  completed      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (player_id, run_date, run_id)
);

CREATE INDEX IF NOT EXISTS idx_run_scores_board
  ON public.run_scores (run_date, run_id, levels_cleared DESC, captures DESC, created_at ASC);

ALTER TABLE public.run_scores ENABLE ROW LEVEL SECURITY;

-- A scoreboard, not a ledger: public read, anonymous insert/update. The app
-- upserts on (player_id, run_date, run_id) and never lowers a score itself.
DROP POLICY IF EXISTS "run_scores public read"  ON public.run_scores;
DROP POLICY IF EXISTS "run_scores anon insert"  ON public.run_scores;
DROP POLICY IF EXISTS "run_scores anon update"  ON public.run_scores;

CREATE POLICY "run_scores public read"
  ON public.run_scores FOR SELECT USING (true);
CREATE POLICY "run_scores anon insert"
  ON public.run_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "run_scores anon update"
  ON public.run_scores FOR UPDATE USING (true) WITH CHECK (true);
