/**
 * /test/new-runs — launcher for the 2026-09-19 ten-run batch (revenge-53..62).
 * Each run opens with its signature pair + one filler forced into the offer
 * pool (?testkit=), so the daily 3-of-4 draw can never drop the key card.
 * Level buttons jump straight in holding the pair (?level=N&loadout=a:1,b:1).
 */

const RUNS: { n: number; name: string; pair: [string, string]; filler: string; idea: string; show?: number }[] = [
  { n: 61, name: 'The Baffle', pair: ['ricochet', 'boulder'], filler: 'magnet', idea: 'Bank shots off stone. Boulder is your pool rail.', show: 9 },
  { n: 62, name: 'The Scree', pair: ['avalanche', 'boulder'], filler: 'aegis', idea: 'Every loose stone slides at once. Which way?', show: 9 },
  { n: 54, name: 'The Caldera', pair: ['puppet', 'dragon'], filler: 'aegis', idea: 'Walk his own guard into the crater.', show: 10 },
  { n: 59, name: 'The Gorge', pair: ['catapult', 'convert'], filler: 'sacrifice', idea: 'Fling stones and stolen pawns over a lava river.', show: 10 },
  { n: 56, name: 'The Vent', pair: ['eruption', 'boulder'], filler: 'magnet', idea: 'Flood one flee square, stone the other.', show: 10 },
  { n: 58, name: 'The Atoll', pair: ['castle', 'dragon'], filler: 'swap', idea: 'King on a lava island. Castle him out.', show: 9 },
  { n: 53, name: 'The Pawnshop', pair: ['convert', 'promote'], filler: 'magnet', idea: 'Steal a boxed pawn, promote it to a knight.', show: 10 },
  { n: 55, name: 'The Crypt', pair: ['raise', 'sacrifice'], filler: 'shove', idea: 'What you eat is what explodes.', show: 8 },
  { n: 60, name: 'The Looking Glass', pair: ['mirror', 'swap'], filler: 'aegis', idea: 'A mirror Rookie copies every move, flipped.', show: 10 },
  { n: 57, name: 'The Daisy Chain', pair: ['chain', 'magnet'], filler: 'shove', idea: 'One capture burns the whole pawn chain.', show: 10 },
];

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function NewRunsTestPage() {
  return (
    <div className="h-full overflow-auto bg-[#0f1b2d] text-white">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold">Ten new runs</h1>
        <p className="mt-1 text-sm text-white/70">
          Play run = full run, the pair is always in the offers. A level number jumps straight there holding the pair.
          Gold = the level to see first.
        </p>
        <div className="mt-5 space-y-4">
          {RUNS.map((r) => {
            const id = `revenge-${r.n}`;
            const kit = [...r.pair, r.filler].join(',');
            const loadout = r.pair.map((a) => `${a}:1`).join(',');
            return (
              <div key={id} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{r.name}</div>
                    <div className="text-xs uppercase tracking-wide text-amber-300">
                      {r.pair[0]} + {r.pair[1]}
                    </div>
                    <div className="mt-1 text-sm text-white/70">{r.idea}</div>
                  </div>
                  <a
                    href={`/?run=${id}&go=1&testkit=${kit}`}
                    className="inline-flex min-h-[44px] items-center rounded-lg bg-amber-400 px-4 font-semibold text-black"
                  >
                    Play run
                  </a>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LEVELS.map((lv) => (
                    <a
                      key={lv}
                      href={`/?run=${id}&go=1&level=${lv}&loadout=${loadout}&refresh=1`}
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-lg text-sm font-semibold ring-1 ${
                        lv === r.show ? 'bg-amber-400/20 text-amber-300 ring-amber-300' : 'bg-white/5 ring-white/15'
                      }`}
                    >
                      {lv}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
