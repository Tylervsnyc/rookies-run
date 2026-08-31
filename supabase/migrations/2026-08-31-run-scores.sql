-- Rookie's Revenge — global daily leaderboard.
-- One row per (player, run_date, run_id). Anonymous-friendly: player_id is a
-- device id minted client-side (or the auth uid when signed in). Rows are
-- public to read (that's the point of a leaderboard) and insert/upsert-able
-- by anyone — a game scoreboard, not a ledger. Ranking = levels_cleared DESC,
-- captures DESC, created_at ASC (earliest finisher wins ties).

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

CREATE POLICY "run_scores public read"
  ON public.run_scores FOR SELECT
  USING (true);

CREATE POLICY "run_scores anon insert"
  ON public.run_scores FOR INSERT
  WITH CHECK (true);

CREATE POLICY "run_scores anon update"
  ON public.run_scores FOR UPDATE
  USING (true) WITH CHECK (true);
