'use client';

/**
 * /playtest client v4 — pick a run (dropdown), pick up to 3 abilities as
 * cards that SHOW what each ability does (type line, description, and the
 * T1 effect + uses text straight from blurbDetailForTier), PLAY.
 * A play is a REAL run from level 1: nothing is preloaded — the picks become
 * the game's entire offer pool (?testkit=), so Tyler takes them at T1 via
 * the normal offer flow and upgrades them between rounds.
 *
 * Coverage ("what's left to test") lives in localStorage under
 * `playtest-coverage-v3`: run ids played + ability ids tried, marked the
 * moment PLAY is pressed. All storage access is try/catch.
 *
 * Comments POST to /api/playtest-feedback (unchanged API) with item = the
 * run id; the kit is appended to the text like "[kit twin,duchess,swap]".
 */

import { useEffect, useMemo, useState } from 'react';

import { blurbDetailForTier, type AbilityId } from '@/lib/run/abilities';

export interface PlaytestRun {
  id: string;
  name: string;
}

export interface PlaytestAbility {
  id: string;
  name: string;
  typeLine: string;
  description: string;
  testing: boolean;
}

const VERDICTS = ['SHIP', 'TUNE', 'KILL', 'BUG'] as const;
type Verdict = (typeof VERDICTS)[number];

const COVERAGE_KEY = 'playtest-coverage-v3';

interface Coverage {
  runs: string[]; // run ids played this pass
  abilities: string[]; // ability ids tried
}

function readCoverage(): Coverage {
  try {
    const raw = localStorage.getItem(COVERAGE_KEY);
    if (!raw) return { runs: [], abilities: [] };
    const p = JSON.parse(raw) as Partial<Coverage>;
    return {
      runs: Array.isArray(p.runs) ? p.runs.filter((x) => typeof x === 'string') : [],
      abilities: Array.isArray(p.abilities) ? p.abilities.filter((x) => typeof x === 'string') : [],
    };
  } catch {
    return { runs: [], abilities: [] };
  }
}

function writeCoverage(c: Coverage) {
  try {
    localStorage.setItem(COVERAGE_KEY, JSON.stringify(c));
  } catch {
    /* per-device convenience only */
  }
}

export function PlaytestClient({ runs, abilities }: { runs: PlaytestRun[]; abilities: PlaytestAbility[] }) {
  const [coverage, setCoverage] = useState<Coverage>({ runs: [], abilities: [] });
  const [runId, setRunId] = useState<string>(runs[0]?.id ?? '');
  // Ordered oldest-first; a 4th pick replaces the oldest.
  const [picked, setPicked] = useState<string[]>([]);
  const [playing, setPlaying] = useState<{ src: string; runId: string; kit: string } | null>(null);
  const [frameNonce, setFrameNonce] = useState(0);

  // Comment box.
  const [level, setLevel] = useState<string>('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [text, setText] = useState('');
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    setCoverage(readCoverage());
  }, []);

  const playedRuns = useMemo(() => new Set(coverage.runs), [coverage.runs]);
  const triedAbilities = useMemo(() => new Set(coverage.abilities), [coverage.abilities]);

  const runsLeft = runs.filter((r) => !playedRuns.has(r.id)).length;
  const abilitiesLeft = abilities.filter((a) => !triedAbilities.has(a.id)).length;

  const toggleAbility = (id: string) => {
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length < 3) return [...prev, id];
      return [...prev.slice(1), id]; // replace the oldest
    });
  };

  const kitString = picked.join(',');

  const play = () => {
    if (!runId) return;
    const src =
      `/?run=${encodeURIComponent(runId)}` +
      (kitString ? `&testkit=${encodeURIComponent(kitString)}` : '') +
      `&refresh=1&ladder=0`;
    // Mark tested the moment PLAY is pressed.
    setCoverage((prev) => {
      const next: Coverage = {
        runs: prev.runs.includes(runId) ? prev.runs : [...prev.runs, runId],
        abilities: [...prev.abilities, ...picked.filter((id) => !prev.abilities.includes(id))],
      };
      writeCoverage(next);
      return next;
    });
    setPlaying({ src, runId, kit: kitString });
    setLevel('');
    setSendState('idle');
    setFrameNonce((n) => n + 1);
  };

  const resetCoverage = () => {
    const empty: Coverage = { runs: [], abilities: [] };
    writeCoverage(empty);
    setCoverage(empty);
  };

  const send = async () => {
    if (!playing || !text.trim() || sendState === 'sending') return;
    setSendState('sending');
    setSendError('');
    try {
      const fullText = playing.kit ? `${text.trim()} [kit ${playing.kit}]` : text.trim();
      const body: Record<string, unknown> = { item: playing.runId, kind: 'run', text: fullText };
      if (level) body.level = Number(level);
      if (verdict) body.verdict = verdict;
      const res = await fetch('/api/playtest-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(typeof data.error === 'string' ? data.error : `HTTP ${res.status}`);
      setSendState('sent');
      setText('');
      setVerdict(null);
    } catch (e) {
      setSendState('error');
      setSendError(e instanceof Error ? e.message : 'Send failed');
    }
  };

  const runName = (id: string) => runs.find((r) => r.id === id)?.name ?? id;
  const abilityName = (id: string) => abilities.find((a) => a.id === id)?.name ?? id;

  return (
    <div className="h-full overflow-auto bg-chess-page font-body text-chess-text">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <header className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
          <h1 className="text-2xl font-extrabold">Playtest</h1>
          <p className="text-sm font-bold text-chess-text-muted">
            Runs left: {runsLeft} of {runs.length} &middot; Abilities left: {abilitiesLeft} of {abilities.length}
          </p>
          <button
            onClick={resetCoverage}
            className="rounded-lg border-2 border-chess-disabled bg-white px-2.5 py-1 text-xs font-bold text-chess-text-muted"
          >
            Reset
          </button>
          <a href="/playtest/art" className="text-xs font-bold text-chess-blue underline">
            Art picks
          </a>
        </header>

        {/* RUN PICKER */}
        <section className="rounded-2xl bg-chess-surface p-4 shadow-sm">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-chess-text-muted">1. Pick a run</h2>
          {runs.length === 0 ? (
            <p className="text-sm text-chess-text-muted">No testing-stage runs in the registry.</p>
          ) : (
            <select
              value={runId}
              onChange={(e) => setRunId(e.target.value)}
              aria-label="Run"
              className="min-h-11 w-full rounded-xl border-2 border-chess-disabled bg-white px-3 py-2 font-bold"
            >
              {runs.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                  {playedRuns.has(r.id) ? ' - done' : ''}
                </option>
              ))}
            </select>
          )}
        </section>

        {/* ABILITY PICKER */}
        <section className="mt-4 rounded-2xl bg-chess-surface p-4 shadow-sm">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-chess-text-muted">
              2. Pick up to 3 abilities ({picked.length}/3)
            </h2>
            <span className="ml-auto text-[11px] font-bold text-chess-text-muted">
              Real run: picks arrive as T1 offers, upgrade between rounds
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {abilities.map((a) => {
              const slot = picked.indexOf(a.id);
              const isPicked = slot >= 0;
              const untried = a.testing && !triedAbilities.has(a.id);
              const blurb = blurbDetailForTier(a.id as AbilityId, 1);
              return (
                <button
                  key={a.id}
                  onClick={() => toggleAbility(a.id)}
                  className={`relative rounded-xl border-2 p-2.5 text-left ${
                    isPicked
                      ? 'border-chess-blue bg-chess-blue/10'
                      : untried
                        ? 'border-chess-orange bg-white'
                        : 'border-chess-disabled bg-white'
                  }`}
                >
                  {isPicked && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-chess-blue text-xs font-extrabold text-white">
                      {slot + 1}
                    </span>
                  )}
                  <div className="pr-7 text-sm font-extrabold">
                    {a.name}
                    {a.testing && (
                      <span className="ml-1.5 rounded-full bg-chess-orange px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-white">
                        testing
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-chess-text-faint">{a.typeLine}</div>
                  <div className="mt-1 text-xs text-chess-text-muted">{a.description}</div>
                  <div className="mt-1 text-xs font-bold">
                    T1: {blurb.what}
                  </div>
                  {blurb.limit && <div className="text-[11px] text-chess-text-muted">{blurb.limit}</div>}
                </button>
              );
            })}
          </div>
        </section>

        {/* PLAY */}
        <button
          onClick={play}
          disabled={!runId}
          className="mt-4 w-full rounded-2xl bg-chess-blue py-4 text-xl font-extrabold text-white shadow-sm disabled:opacity-40"
        >
          {runId
            ? `PLAY — ${runName(runId)}${picked.length > 0 ? ` with ${picked.map(abilityName).join(', ')}` : ''}`
            : 'PLAY'}
        </button>

        {/* GAME */}
        {playing && (
          <div className="mt-4 rounded-2xl bg-chess-surface p-3 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <div className="min-w-0 flex-1 truncate text-xs text-chess-text-muted">{playing.src}</div>
              <button
                onClick={() => setFrameNonce((n) => n + 1)}
                className="rounded-lg border-2 border-chess-disabled bg-white px-3 py-1 text-sm font-bold"
              >
                Reload
              </button>
              <a
                href={playing.src}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border-2 border-chess-disabled bg-white px-3 py-1 text-sm font-bold"
              >
                Open full
              </a>
            </div>
            <iframe
              key={`${playing.src}:${frameNonce}`}
              src={playing.src}
              title={`Playtest: ${runName(playing.runId)}`}
              className="min-h-[70vh] w-full rounded-xl border-2 border-chess-disabled bg-white"
            />
          </div>
        )}

        {/* COMMENT BOX */}
        {playing && (
          <div className="mt-4 rounded-2xl bg-chess-surface p-4 shadow-sm">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-chess-text-muted">
              Send feedback to Claude
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
              <span>{runName(playing.runId)}</span>
              {playing.kit && (
                <span className="truncate text-xs font-normal text-chess-text-muted">[{playing.kit}]</span>
              )}
              <label className="flex items-center gap-1">
                L
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  aria-label="Level"
                  className="rounded-lg border-2 border-chess-disabled bg-white px-1.5 py-1"
                >
                  <option value="">any</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex gap-1.5">
                {VERDICTS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVerdict(verdict === v ? null : v)}
                    className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                      verdict === v
                        ? v === 'SHIP'
                          ? 'bg-chess-green text-white'
                          : v === 'KILL'
                            ? 'bg-chess-red text-white'
                            : v === 'BUG'
                              ? 'bg-chess-orange text-white'
                              : 'bg-chess-blue text-white'
                        : 'bg-chess-page text-chess-text-muted'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (sendState === 'sent' || sendState === 'error') setSendState('idle');
              }}
              rows={3}
              placeholder="What happened? What should change?"
              className="mt-3 w-full rounded-xl border-2 border-chess-disabled bg-white p-3 text-sm"
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={send}
                disabled={!text.trim() || sendState === 'sending'}
                className="rounded-xl bg-chess-blue px-5 py-2.5 font-bold text-white disabled:opacity-40"
              >
                {sendState === 'sending' ? 'Sending…' : 'Send'}
              </button>
              {sendState === 'sent' && <span className="text-sm font-bold text-chess-green-dark">{'✓'} Sent</span>}
              {sendState === 'error' && <span className="text-sm font-bold text-chess-red">Failed: {sendError}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
