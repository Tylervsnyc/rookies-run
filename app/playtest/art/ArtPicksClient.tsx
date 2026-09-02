'use client';

/**
 * Art picker client — 6 abilities x 2 candidates (A/B), tap to choose.
 * Picks persist to localStorage 'art-picks-v1' (try/catch) and POST to
 * /api/playtest-feedback so each choice lands in Slack as:
 *   [playtest] <id> SHIP — art pick: A (<id>-1.png)
 * Images that 404 (still generating) show a placeholder tile.
 */

import { useEffect, useState } from 'react';

const ABILITIES: { id: string; name: string }[] = [
  { id: 'twin', name: 'Twin' },
  { id: 'duchess', name: 'Duchess' },
  { id: 'vanguard', name: 'Vanguard' },
  { id: 'bishop-squire', name: 'Bishop Squire' },
  { id: 'swap', name: 'Swap' },
  { id: 'sacrifice', name: 'Sacrifice' },
];

const PICKS_KEY = 'art-picks-v1';

type Picks = Record<string, 'A' | 'B'>;

function readPicks(): Picks {
  try {
    const raw = localStorage.getItem(PICKS_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as Record<string, unknown>;
    const out: Picks = {};
    for (const a of ABILITIES) {
      if (p[a.id] === 'A' || p[a.id] === 'B') out[a.id] = p[a.id] as 'A' | 'B';
    }
    return out;
  } catch {
    return {};
  }
}

function writePicks(p: Picks) {
  try {
    localStorage.setItem(PICKS_KEY, JSON.stringify(p));
  } catch {
    // localStorage unavailable — picks still go to Slack
  }
}

function CandidateTile({
  id,
  slot,
  chosen,
  onPick,
}: {
  id: string;
  slot: 'A' | 'B';
  chosen: boolean;
  onPick: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const file = `${id}-${slot === 'A' ? 1 : 2}.png`;

  return (
    <button
      onClick={onPick}
      disabled={failed}
      className={`relative block w-full overflow-hidden rounded-2xl border-4 text-left transition-colors ${
        chosen ? 'border-chess-green' : 'border-transparent'
      } ${failed ? 'cursor-default' : ''}`}
    >
      {failed ? (
        <div className="flex aspect-square w-full items-center justify-center bg-chess-hint-bg p-4">
          <p className="text-center text-sm font-bold text-chess-hint-title">still generating - reload</p>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/abilities/concepts/${file}`}
          alt={`${id} candidate ${slot}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="block aspect-square w-full object-cover"
        />
      )}
      <span
        className={`absolute left-2 top-2 rounded-lg px-2 py-0.5 text-xs font-extrabold ${
          chosen ? 'bg-chess-green text-white' : 'bg-white/90 text-chess-text'
        }`}
      >
        {slot}
      </span>
      {chosen && (
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-chess-green text-sm font-extrabold text-white">
          ✓
        </span>
      )}
    </button>
  );
}

export function ArtPicksClient() {
  const [picks, setPicks] = useState<Picks>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPicks(readPicks());
    setLoaded(true);
  }, []);

  const pick = (id: string, slot: 'A' | 'B') => {
    const next = { ...picks, [id]: slot };
    setPicks(next);
    writePicks(next);
    // Fire-and-forget relay to Slack via the existing feedback route.
    fetch('/api/playtest-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item: id,
        kind: 'ability',
        verdict: 'SHIP',
        text: `art pick: ${slot} (${id}-${slot === 'A' ? 1 : 2}.png)`,
      }),
    }).catch(() => {
      // Slack relay failed — the pick is still in localStorage
    });
  };

  const count = ABILITIES.filter((a) => picks[a.id]).length;
  const done = count === ABILITIES.length;

  return (
    <div className="h-full overflow-auto bg-chess-page font-body text-chess-text">
      <div className="mx-auto max-w-[430px] px-4 py-6">
        <header className="mb-4">
          <h1 className="text-2xl font-extrabold">Card art picks</h1>
          <p className="text-sm font-bold text-chess-text-muted">
            {loaded && done
              ? 'Done - Claude will wire the winners into the cards.'
              : `Pick one of each - ${count} of ${ABILITIES.length} chosen`}
          </p>
        </header>

        <div className="space-y-5">
          {ABILITIES.map((a) => (
            <section key={a.id} className="rounded-2xl bg-chess-surface p-3 shadow-sm">
              <h2 className="mb-2 text-sm font-extrabold">{a.name}</h2>
              <div className="grid grid-cols-2 gap-3">
                <CandidateTile id={a.id} slot="A" chosen={picks[a.id] === 'A'} onPick={() => pick(a.id, 'A')} />
                <CandidateTile id={a.id} slot="B" chosen={picks[a.id] === 'B'} onPick={() => pick(a.id, 'B')} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
