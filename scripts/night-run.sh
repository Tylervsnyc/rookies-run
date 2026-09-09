#!/bin/bash
# Midnight sweep, 2026-09-08. Two questions run/answered without supervision:
#   1. Which density curve makes the ladder an actual ladder — re-measured at
#      150 runs/rung, because the 60-run pass has +/-12pp of noise and the
#      winner deserves a tighter number before Tyler is asked to ship it.
#   2. What the retry budget is worth (1 vs 3 vs 5), the lever tonight's
#      sickness test said is the real difficulty dial.
cd ~/rookies-run || exit 1
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
mkdir -p data/run-playtest/dials data/run-playtest/retries
STAMP=$(date +%Y%m%d-%H%M)
LOG=data/run-playtest/night-$STAMP.log
exec >>"$LOG" 2>&1
echo "=== night run $STAMP ==="

# The density curves all LOST to baseline in the 18:xx run (BASE 11.6pp vs A
# 20.7 / B 26.7 / C 30.5 mean distance from the ladder line), so re-measuring a
# winner would be re-measuring nothing. Sweeping the knobs that don't feed the
# player instead — see _dial-shard.ts.
for D in mv ept both; do
  for i in 0 1 2 3 4 5 6 7; do
    npx tsx scripts/run-playtest/_dial-shard.ts data/run-playtest/dials/$D-$i.json $D 60 $i 8 &
  done
  wait
  npx tsx -e "
  const fs=require('fs');const rows=[];for(let i=0;i<8;i++)rows.push(...JSON.parse(fs.readFileSync('data/run-playtest/dials/$D-'+i+'.json','utf8')).ladder);
  fs.writeFileSync('data/run-playtest/dials/DIAL-$D.json',JSON.stringify({dial:'$D',ladder:rows},null,1));
  const a=d=>(rows.filter(x=>x.difficulty===d).reduce((s,x)=>s+x.clearPct,0)/10).toFixed(1);
  console.log('dial=$D  normal '+a('normal')+'%  hard '+a('hard')+'%');"
done

for R in 1 3 5; do
  for i in 0 1 2 3 4 5 6 7; do
    npx tsx scripts/run-playtest/_retry-shard.ts data/run-playtest/retries/r$R-$i.json $R 60 $i 8 &
  done
  wait
  npx tsx -e "
  const fs=require('fs');const rows=[];for(let i=0;i<8;i++)rows.push(...JSON.parse(fs.readFileSync('data/run-playtest/retries/r$R-'+i+'.json','utf8')).ladder);
  fs.writeFileSync('data/run-playtest/retries/RETRIES-$R.json',JSON.stringify({retriesAllowed:$R,ladder:rows},null,1));
  const a=d=>(rows.filter(x=>x.difficulty===d).reduce((s,x)=>s+x.clearPct,0)/10).toFixed(1);
  console.log('retries=$R  normal '+a('normal')+'%  hard '+a('hard')+'%');"
done
echo "=== night run done ==="
