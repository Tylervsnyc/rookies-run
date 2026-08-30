#!/bin/bash
# Rookie's Revenge nightly playtest — LOCAL cron edition.
# Successor to chess-learning-tree/scripts/run-nightly-playtest.sh (the rank-8
# "Rookies Run" pipeline, now legacy). Runs at 2am via crontab (see bottom).
#
# 1. pull main, run revenge-nightly.ts (matrices, full runs, solver, features,
#    correlations, night-over-night deltas, human traces, 3 hypotheses run as
#    experiments) -> data/run-playtest/revenge/digests/YYYY-MM-DD.md + latest.md
# 2. post the compact summary (raw/<date>/slack.txt, <= 25 lines) to Slack
# 3. commit digests + tonight's raw JSON (raw only if under 2 MB) as the
#    playtest bot and push origin main.
#
# Supabase (human traces) + Slack creds come from chess-learning-tree/.env.local
# because this repo has no .env.local of its own.
export PATH="/opt/homebrew/bin:/Users/tyler.schwartz/.local/bin:$PATH"
REPO=/Users/tyler.schwartz/rookies-run
ENV_FILE=/Users/tyler.schwartz/chess-learning-tree/.env.local
cd "$REPO" || exit 1
mkdir -p logs
TODAY=$(date +%Y-%m-%d)
echo "=== revenge nightly $TODAY start $(date) ==="

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
else
  echo "warn: $ENV_FILE not found — no Supabase/Slack creds (humans + Slack post will be skipped)"
fi

git pull --ff-only origin main || echo "warn: git pull failed (continuing with local tree)"

# 1. the pipeline (default budget ~20-30 min; --quick for a 2-minute smoke)
npx tsx scripts/run-playtest/revenge-nightly.ts "$@" || { echo "revenge-nightly.ts FAILED"; exit 1; }
DIGEST="data/run-playtest/revenge/digests/$TODAY.md"
RAW="data/run-playtest/revenge/raw/$TODAY"
[ -f "$DIGEST" ] || { echo "no digest at $DIGEST"; exit 1; }

# 2. Slack — headline + movers + hypotheses + candidate calls
if [ -n "$SLACK_WEBHOOK_URL" ] && [ -f "$RAW/slack.txt" ]; then
  PAYLOAD=$(python3 -c 'import json,sys; print(json.dumps({"text": open(sys.argv[1]).read().strip()}))' "$RAW/slack.txt")
  curl -sS -X POST -H 'Content-type: application/json' --data "$PAYLOAD" "$SLACK_WEBHOOK_URL" \
    && echo "slack posted" || echo "warn: slack post failed"
else
  echo "slack skipped (no SLACK_WEBHOOK_URL or no slack.txt)"
fi

# 3. commit digests (+ raw JSON if small) and push
git add data/run-playtest/revenge/digests/
RAW_BYTES=$(du -sk "$RAW" 2>/dev/null | cut -f1)
if [ -n "$RAW_BYTES" ] && [ "$RAW_BYTES" -lt 2048 ]; then
  git add "$RAW"/*.json
else
  echo "raw dir is ${RAW_BYTES:-?} KB — committing digests only"
fi
git add data/run-playtest/revenge/experiments.jsonl 2>/dev/null
git -c user.name="Rookie Playtest Bot" -c user.email="playtest@rookies-run.local" \
  commit -m "Rookie's Revenge: nightly playtest digest $TODAY (local cron)" \
  && git push origin main || echo "nothing to commit or push failed"
echo "=== revenge nightly $TODAY done $(date) ==="

# crontab line (NOT installed by this script — the lead installs it):
# 0 2 * * * /Users/tyler.schwartz/rookies-run/scripts/run-revenge-nightly.sh >> /Users/tyler.schwartz/rookies-run/logs/revenge-nightly.log 2>&1
