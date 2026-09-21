-- APPLY THIS IN THE SUPABASE SQL EDITOR. Safe to paste twice.
--
-- The run card on the Ranks board (Tyler 2026-09-21: "a more detailed score
-- in the ranks... how many moves were used? Something cool"). Each daily row
-- carries the stats of the run its score came from, exactly as the run-summary
-- screen showed them: stars (0-3), moves used, par for the run, active time,
-- retries taken. `difficulty` already exists.
--
-- NULLABLE on purpose: rows written before today and older app builds have no
-- stats; the board shows those rows as it does today. The API writes these
-- columns ONLY together with `score` (they describe the stored best run), and
-- runs with or without them — nothing breaks before this is applied.
--
-- Verify AFTER running:
--   curl -s "https://run.chesspath.app/api/run/leaderboard?date=$(date +%F)&run=endless"
-- rows now carry "stars", "moves", "parMoves", "timeMs", "retries" (null until
-- a new build finishes a daily run).

ALTER TABLE public.run_scores
  ADD COLUMN IF NOT EXISTS stars     SMALLINT CHECK (stars BETWEEN 0 AND 3),
  ADD COLUMN IF NOT EXISTS moves     INTEGER  CHECK (moves >= 0),
  ADD COLUMN IF NOT EXISTS par_moves INTEGER,
  ADD COLUMN IF NOT EXISTS time_ms   INTEGER  CHECK (time_ms >= 0),
  ADD COLUMN IF NOT EXISTS retries   SMALLINT CHECK (retries >= 0);
