'use client';

/**
 * /playtest client v2 — pick a level, pick up to 3 abilities, PLAY.
 *
 * Coverage ("what's left to test") lives in localStorage under
 * `playtest-coverage-v2`: tested (runId:level) pairs + tested ability ids.
 * A level and its selected abilities are marked tested the moment PLAY is
 * pressed. All storage access is try/catch — storage can throw.
 *
 * Comments POST to /api/playtest-feedback (unchanged API) with item = the
 * run id; the loadout is appended to the text like "[loadout duchess:3,...]".
 */

import { useEffect, useMemo, useState } from 'react';

export interface PlaytestRun {
  id: string;
  name: string;
  levels: number;
}

export interface PlaytestAbility {
  id: string;
  name: string;
  testing: boolean;
}

const VERDICTS = ['SHIP', 'TUNE', 'KILL', 'BUG'] as const;
type Verdict = (typeof VERDICTS)[number];

const COVERAGE_KEY = 'playtest-coverage-v2';

interface Coverage {
  levels: string[]; // "runId:level"
  abilities: string[]; // ability ids
}

function readCoverage(): Coverage {
  try {
    const raw = localStorage.getItem(COVERAGE_KEY);
    if (!raw) return { levels: [], abilities: [] };
    const p = JSON.parse(raw) as Partial<Coverage>;
    return {
      levels: Array.isArray(p.levels) ? p.levels.filter((x) => typeof x === 'string') : [],
      abilities: Array.isArray(p.abilities) ? p.abilities.filter((x) => typeof x === 'string') : [],
    };
  } catch {
    return { levels: [], abilities: [] };
  }
}

function writeCoverage(c: Coverage) {
  try {
    localStorage.setItem(COVERAGE_KEY, JSON.stringify(c));
  } catch {
    /* per-device convenience only */
  }
}

function levelKey(runId: string, level: number): string {
  return `${runId}:${level}`;
}

export function PlaytestClient({ runs, abilities }: { runs: PlaytestRun[]; abilities: PlaytestAbility[] }) {
  const [coverage, setCoverage] = useState<Coverage>({ levels: [], abilities: [] });
  const [pickedLevel, setPickedLevel] = useState<{ runId: string; level: number } | null>(null);
  // Ordered oldest-first; a 4th pick replaces the oldest.
  const [picked, setPicked] = useState<string[]>([]);
  const [tier, setTier] = useState(3);
  const [playing, setPlaying] = useState<{ src: string; runId: string; level: number; loadout: string } | null>(null);
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

  const testedLevels = useMemo(() => new Set(coverage.levels), [coverage.levels]);
  const testedAbilities = useMemo(() => new Set(coverage.abilities), [coverage.abilities]);

  const totalLevels = runs.reduce((n, r) => n + r.levels, 0);
  const levelsLeft = runs.reduce(
    (n, r) => n + Array.from({ length: r.levels }, (_, i) => i + 1).filter((l) => !testedLevels.has(levelKey(r.id, l))).length,
    0,
  );
  const totalAbilities = abilities.length;
  const abilitiesLeft = abilities.filter((a) => !testedAbilities.has(a.id)).length;

  const toggleAbility = (id: string) => {
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length < 3) return [...prev, id];
      return [...prev.slice(1), id]; // replace the oldest
    });
  };

  const loadoutString = picked.map((id) => `${id}:${tier}`).join(',');

  const play = () => {
    if (!pickedLevel) return;
    const { runId, level: lvl } = pickedLevel;
    const src =
      `/?run=${encodeURIComponent(runId)}` +
      (loadoutString ? `&loadout=${encodeURIComponent(loadoutString)}` : '') +
      `&level=${lvl}&ladder=0`;
    // Mark tested the moment PLAY is pressed.
    setCoverage((prev) => {
      const next: Coverage = {
        levels: prev.levels.includes(levelKey(runId, lvl)) ? prev.levels : [...prev.levels, levelKey(runId, lvl)],
        abilities: [...prev.abilities, ...picked.filter((id) => !prev.abilities.includes(id))],
      };
      writeCoverage(next);
      return next;
    });
    setPlaying({ src, runId, level: lvl, loadout: loadoutString });
    setLevel(String(lvl));
    setSendState('idle');
    setFrameNonce((n) => n + 1);
  };

  const resetCoverage = () => {
    const empty: Coverage = { levels: [], abilities: [] };
    writeCoverage(empty);
    setCoverage(empty);
  };

  const send = async () => {
    if (!playing || !text.trim() || sendState === 'sending') return;
    setSendState('sending');
    setSendError('');
    try {
      const fullText = playing.loadout ? `${text.trim()} [loadout ${playing.loadout}]` : text.trim();
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
            Levels left: {levelsLeft} of {totalLevels} &middot; Abilities left: {abilitiesLeft} of {totalAbilities}
          </p>
          <button
            onClick={resetCoverage}
            className="rounded-lg border-2 border-chess-disabled bg-white px-2.5 py-1 text-xs font-bold text-chess-text-muted"
          >
            Reset
          </button>
        </header>

        {/* LEVEL PICKER */}
        <section className="rounded-2xl bg-chess-surface p-4 shadow-sm">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-chess-text-muted">1. Pick a level</h2>
          {runs.length === 0 ? (
            <p className="text-sm text-chess-text-muted">No testing-stage runs in the registry.</p>
          ) : (
            <div className="space-y-3">
              {runs.map((run) => (
                <div key={run.id}>
                  <div className="mb-1 text-sm font-extrabold">{run.name}</div>
                  <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
                    {Array.from({ length: run.levels }, (_, i) => i + 1).map((l) => {
                      const tested = testedLevels.has(levelKey(run.id, l));
                      const isPicked = pickedLevel?.runId === run.id && pickedLevel.level === l;
                      return (
                        <button
                          key={l}
                          onClick={() => setPickedLevel({ runId: run.id, level: l })}
                          aria-label={`${run.name} level ${l}${tested ? ' (tested)' : ''}`}
                          className={`min-h-11 rounded-lg border-2 text-sm font-bold ${
                            isPicked
                              ? 'border-chess-blue bg-chess-blue text-white'
                              : tested
                                ? 'border-chess-disabled bg-chess-page text-chess-text-faint'
                                : 'border-chess-disabled bg-white'
                          }`}
                        >
                          L{l}
                          {tested ? ' ✓' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ABILITY PICKER */}
        <section className="mt-4 rounded-2xl bg-chess-surface p-4 shadow-sm">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-chess-text-muted">
              2. Pick up to 3 abilities ({picked.length}/3)
            </h2>
            <label className="ml-auto flex items-center gap-1.5 text-sm font-bold">
              Tier
              <select
                value={tier}
                onChange={(e) => setTier(Number(e.target.value))}
                className="rounded-lg border-2 border-chess-disabled bg-white px-2 py-1"
              >
                {[1, 2, 3, 4, 5].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {abilities.map((a) => {
              const isPicked = picked.includes(a.id);
              const untestedTesting = a.testing && !testedAbilities.has(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggleAbility(a.id)}
                  className={`min-h-11 rounded-full border-2 px-3 py-1.5 text-sm font-bold ${
                    isPicked
                      ? 'border-chess-blue bg-chess-blue text-white'
                      : untestedTesting
                        ? 'border-chess-orange bg-white text-chess-text'
                        : 'border-chess-disabled bg-white text-chess-text-muted'
                  }`}
                >
                  {a.name}
                  {a.testing && (
                    <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${
                      isPicked ? 'bg-white/25 text-white' : 'bg-chess-orange text-white'
                    }`}>
                      testing
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* PLAY */}
        <button
          onClick={play}
          disabled={!pickedLevel}
          className="mt-4 w-full rounded-2xl bg-chess-blue py-4 text-xl font-extrabold text-white shadow-sm disabled:opacity-40"
        >
          {pickedLevel
            ? `PLAY — ${runName(pickedLevel.runId)} L${pickedLevel.level}${
                picked.length > 0 ? ` with ${picked.map(abilityName).join(', ')}` : ''
              }`
            : 'PLAY — pick a level first'}
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
              title={`Playtest: ${runName(playing.runId)} L${playing.level}`}
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
              {playing.loadout && (
                <span className="truncate text-xs font-normal text-chess-text-muted">[{playing.loadout}]</span>
              )}
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
