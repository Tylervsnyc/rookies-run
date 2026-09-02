'use client';

/**
 * /playtest client — queue + embedded game + comment box.
 *
 * Per-device "done today" checkmarks live in localStorage (keyed by local
 * date + item id, try/catch everywhere — storage can throw). Comments POST
 * to /api/playtest-feedback which relays to Slack.
 */

import { useEffect, useMemo, useState } from 'react';

export interface PlaytestItem {
  id: string;
  kind: 'ability' | 'run';
  name: string;
  stage: string;
  notes: string;
}

const VERDICTS = ['SHIP', 'TUNE', 'KILL', 'BUG'] as const;
type Verdict = (typeof VERDICTS)[number];

function localDateKey(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function doneKey(id: string): string {
  return `playtest-done:${localDateKey()}:${id}`;
}

function readDone(ids: string[]): Set<string> {
  const done = new Set<string>();
  try {
    for (const id of ids) if (localStorage.getItem(doneKey(id)) === '1') done.add(id);
  } catch {
    /* storage unavailable — everything shows undone */
  }
  return done;
}

function iframeSrc(item: PlaytestItem, tier: number): string {
  return item.kind === 'run'
    ? `/?run=${encodeURIComponent(item.id)}`
    : `/?run=revenge-1&loadout=${encodeURIComponent(item.id)}:${tier}`;
}

export function PlaytestClient({ queue, options }: { queue: PlaytestItem[]; options: PlaytestItem[] }) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<PlaytestItem | null>(null);
  const [tier, setTier] = useState(3);
  const [frameNonce, setFrameNonce] = useState(0);

  // Comment box state.
  const [commentItem, setCommentItem] = useState('');
  const [level, setLevel] = useState<string>('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [text, setText] = useState('');
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    setDone(readDone(queue.map((i) => i.id)));
  }, [queue]);

  const left = queue.filter((i) => !done.has(i.id)).length;

  const selectItem = (item: PlaytestItem) => {
    setSelected(item);
    setCommentItem(item.id);
    setLevel('');
    setVerdict(null);
    setText('');
    setSendState('idle');
    setFrameNonce((n) => n + 1);
  };

  const toggleDone = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      const nowDone = !next.has(id);
      if (nowDone) next.add(id);
      else next.delete(id);
      try {
        if (nowDone) localStorage.setItem(doneKey(id), '1');
        else localStorage.removeItem(doneKey(id));
      } catch {
        /* per-device convenience only */
      }
      return next;
    });
  };

  const commentKind = useMemo<'ability' | 'run'>(() => {
    const match = options.find((o) => o.id === commentItem);
    return match?.kind ?? selected?.kind ?? 'ability';
  }, [commentItem, options, selected]);

  const send = async () => {
    if (!commentItem || !text.trim() || sendState === 'sending') return;
    setSendState('sending');
    setSendError('');
    try {
      const body: Record<string, unknown> = { item: commentItem, kind: commentKind, text: text.trim() };
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

  const src = selected ? iframeSrc(selected, tier) : null;

  return (
    <div className="h-full overflow-auto bg-chess-page font-body text-chess-text">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-4">
          <h1 className="text-2xl font-extrabold">Daily Playtest</h1>
          <p className="text-sm text-chess-text-muted">
            {queue.length === 0
              ? 'The testing stage is empty.'
              : left === 0
                ? 'All done for today.'
                : `${left} left to test today`}
          </p>
        </header>

        {queue.length === 0 || (left === 0 && !selected) ? (
          <div className="rounded-2xl bg-chess-surface p-12 text-center shadow-sm">
            <div className="text-3xl font-extrabold">Nothing left to test</div>
            <p className="mt-2 text-chess-text-muted">
              Every testing item is checked off for today. New content appears here when its registry record lands.
            </p>
            {queue.length > 0 && (
              <button
                className="mt-6 rounded-xl bg-chess-blue px-5 py-2.5 font-bold text-white"
                onClick={() => selectItem(queue[0])}
              >
                Replay the queue anyway
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* QUEUE */}
            <aside className="w-full shrink-0 lg:w-72">
              <div className="rounded-2xl bg-chess-surface p-3 shadow-sm">
                <h2 className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-chess-text-muted">
                  Testing queue
                </h2>
                <ul className="space-y-1">
                  {queue.map((item) => {
                    const isDone = done.has(item.id);
                    const isSelected = selected?.id === item.id;
                    return (
                      <li key={item.id} className="flex items-start gap-2">
                        <button
                          aria-label={isDone ? `Mark ${item.name} not done` : `Mark ${item.name} done today`}
                          onClick={() => toggleDone(item.id)}
                          className={`mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold ${
                            isDone
                              ? 'border-chess-green bg-chess-green text-white'
                              : 'border-chess-disabled bg-white text-transparent'
                          }`}
                        >
                          {isDone ? '✓' : ''}
                        </button>
                        <button
                          onClick={() => selectItem(item)}
                          className={`min-w-0 flex-1 rounded-xl px-2 py-1.5 text-left ${
                            isSelected ? 'bg-chess-blue/10 ring-2 ring-chess-blue' : 'hover:bg-chess-page'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`truncate font-bold ${isDone ? 'text-chess-text-faint line-through' : ''}`}>
                              {item.name}
                            </span>
                            <span className="rounded-full bg-chess-page px-1.5 py-0.5 text-[10px] font-bold uppercase text-chess-text-muted">
                              {item.kind}
                            </span>
                          </div>
                          <div className="truncate text-xs text-chess-text-muted">{item.notes || item.id}</div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* PLAY AREA + COMMENTS */}
            <main className="min-w-0 flex-1">
              <div className="rounded-2xl bg-chess-surface p-3 shadow-sm">
                {selected && src ? (
                  <>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-extrabold">{selected.name}</div>
                        <div className="truncate text-xs text-chess-text-muted">{src}</div>
                      </div>
                      {selected.kind === 'ability' && (
                        <label className="flex items-center gap-1.5 text-sm font-bold">
                          Tier
                          <select
                            value={tier}
                            onChange={(e) => {
                              setTier(Number(e.target.value));
                              setFrameNonce((n) => n + 1);
                            }}
                            className="rounded-lg border-2 border-chess-disabled bg-white px-2 py-1"
                          >
                            {[1, 2, 3, 4, 5].map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      <button
                        onClick={() => setFrameNonce((n) => n + 1)}
                        className="rounded-lg border-2 border-chess-disabled bg-white px-3 py-1 text-sm font-bold"
                      >
                        Reload
                      </button>
                      <a
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border-2 border-chess-disabled bg-white px-3 py-1 text-sm font-bold"
                      >
                        Open full
                      </a>
                    </div>
                    <iframe
                      key={`${selected.id}:${tier}:${frameNonce}`}
                      src={src}
                      title={`Playtest: ${selected.name}`}
                      className="min-h-[70vh] w-full rounded-xl border-2 border-chess-disabled bg-white lg:h-[72vh]"
                    />
                  </>
                ) : (
                  <div className="flex min-h-[40vh] items-center justify-center text-chess-text-muted">
                    Pick an item from the queue to load the game.
                  </div>
                )}
              </div>

              {/* COMMENT BOX */}
              <div className="mt-4 rounded-2xl bg-chess-surface p-4 shadow-sm">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-chess-text-muted">
                  Send feedback to Claude
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={commentItem}
                    onChange={(e) => setCommentItem(e.target.value)}
                    aria-label="Item"
                    className="max-w-full rounded-lg border-2 border-chess-disabled bg-white px-2 py-1.5 text-sm font-bold"
                  >
                    <option value="">Pick an item…</option>
                    {options.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.kind}, {o.stage})
                      </option>
                    ))}
                  </select>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    aria-label="Level (optional)"
                    className="rounded-lg border-2 border-chess-disabled bg-white px-2 py-1.5 text-sm font-bold"
                  >
                    <option value="">Level: any</option>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        L{n}
                      </option>
                    ))}
                  </select>
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
                    disabled={!commentItem || !text.trim() || sendState === 'sending'}
                    className="rounded-xl bg-chess-blue px-5 py-2.5 font-bold text-white disabled:opacity-40"
                  >
                    {sendState === 'sending' ? 'Sending…' : 'Send'}
                  </button>
                  {sendState === 'sent' && <span className="text-sm font-bold text-chess-green-dark">Sent to Slack.</span>}
                  {sendState === 'error' && (
                    <span className="text-sm font-bold text-chess-red">Failed: {sendError}</span>
                  )}
                  {selected && !done.has(selected.id) && (
                    <button
                      onClick={() => toggleDone(selected.id)}
                      className="ml-auto rounded-xl border-2 border-chess-green px-4 py-2 text-sm font-bold text-chess-green-dark"
                    >
                      Mark done today
                    </button>
                  )}
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
