'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { REVENGE_RED, REVENGE_RED_DARK, RookiesRevengeLogo } from './RookiesRevengeLogo';
import { TrophyGlyph } from './AchievementToast';
import { ACHIEVEMENTS } from '@/lib/run/achievements';
import { unlockableAbilityIds, type PlayerProfile } from '@/lib/run/profile';
import { isDifficultyLocked, type DifficultyId } from '@/lib/run/difficulty';
import { LADDER_RUNG_IDS, rungRun, rungState } from '@/lib/run/ladder';
import { fetchBoard, getHandle, setHandle, type LeaderboardResponse } from '@/lib/run/leaderboard-client';

/**
 * Rookie's Revenge home screen — chesspath-style "Quiet Hero".
 * Red hero band with a Daily/Ladder segmented toggle; white cards below.
 *   DAILY  = today's one run (no visible difficulty) + today's leaderboard.
 *   LADDER = The Ladder: 10 fixed rungs, easiest to hardest, unlock chain.
 *   CODEX  = the trophy room, on both tabs.
 * Replaces DeskLanding; same page contract except onStart takes an optional
 * difficulty so the Daily GO can switch mode and launch in one gesture.
 * Ladder rungs launch through onLadderStart — always Normal rules, the
 * difficulty picker is a DAILY-only concept.
 */
interface HomeLandingProps {
  /** Start today's daily. When `d` is given, the parent switches difficulty first. */
  onStart: (d?: DifficultyId) => void;
  /** Start a Ladder rung — the exact run, always on Normal rules. */
  onLadderStart?: (runId: string) => void;
  iso: string;
  runId: string;
  dateLabel?: string;
  profile?: PlayerProfile;
  onTrophies?: () => void;
}

type Mode = 'daily' | 'ladder';

function useCountdownToMidnight(): string {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const d = new Date(now);
  const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0).getTime();
  const s = Math.max(0, Math.floor((midnight - now) / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`bg-white rounded-2xl border border-chess-text/10 shadow-sm p-4 ${className}`}>{children}</section>;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-chess-text-faint">{children}</h2>;
}

function LockIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 9 11" aria-hidden className="shrink-0">
      <rect x="0.5" y="4.5" width="8" height="6" rx="1.2" fill="currentColor" />
      <path d="M2 4.5V3a2.5 2.5 0 0 1 5 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function HomeLanding({ onStart, onLadderStart, iso, runId, dateLabel, profile, onTrophies }: HomeLandingProps) {
  const [mode, setMode] = useState<Mode>('daily');
  const countdown = useCountdownToMidnight();

  // The daily is "just one run": Normal (the canonical game) once it's open,
  // Rookie for brand-new players who haven't unlocked it yet.
  const dailyDifficulty: DifficultyId = isDifficultyLocked('normal', profile) ? 'rookie' : 'normal';

  // The Ladder — 10 fixed rungs, easiest to hardest. Rungs whose run hasn't
  // landed in runs.ts yet render as "Coming soon" (never crash, never launch).
  const rungs = LADDER_RUNG_IDS.map((id, i) => {
    const run = rungRun(i);
    const state = rungState(profile, i);
    const best = profile?.ladder?.[id];
    const sub = !run
      ? 'Coming soon'
      : state === 'locked'
        ? `Clear rung ${i} to unlock`
        : state === 'cleared'
          ? `Cleared — best ${best?.score ?? 0} captures`
          : run.blurb;
    return { id, rung: i + 1, name: run?.name ?? '???', sub, state, comingSoon: !run };
  });
  const firstOpen = rungs.find((r) => r.state === 'open' && !r.comingSoon);

  // Codex counts.
  const abilitiesTotal = unlockableAbilityIds().length;
  const abilitiesHave = profile ? profile.unlockedAbilities.length : 0;
  const trophiesHave = profile ? Object.keys(profile.achievements).length : 0;

  // Daily leaderboard.
  const [board, setBoard] = useState<LeaderboardResponse | null | 'loading'>('loading');
  useEffect(() => {
    let cancelled = false;
    fetchBoard(iso, runId).then((b) => { if (!cancelled) setBoard(b); });
    return () => { cancelled = true; };
  }, [iso, runId]);
  const total = board && board !== 'loading' ? board.total : 0;

  const [handle, setHandleState] = useState('Rook');
  useEffect(() => { setHandleState(getHandle()); }, []);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const commitHandle = () => {
    const ok = setHandle(draft);
    if (ok) setHandleState(ok);
    setEditing(false);
  };

  return (
    <div className="min-h-full w-full flex justify-center bg-chess-page text-chess-text">
      <div className="w-full max-w-[420px] flex flex-col min-h-full">
        {/* ── Hero band ─────────────────────────────────────────────────── */}
        <div
          className="px-4 pt-[max(env(safe-area-inset-top),20px)] pb-5 text-white"
          style={{ background: `linear-gradient(180deg, ${REVENGE_RED} 0%, ${REVENGE_RED_DARK} 100%)` }}
        >
          <div className="flex items-center justify-between pt-2">
            <div className="bg-white rounded-xl px-2 py-1"><RookiesRevengeLogo scale={0.3} /></div>
            {dateLabel && <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">{dateLabel}</span>}
          </div>

          {/* Segmented Daily / Ladder toggle */}
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-black/20 p-1" role="tablist" aria-label="Game mode">
            {(['daily', 'ladder'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`min-h-[42px] rounded-xl text-[13px] font-black uppercase tracking-wide transition-colors ${
                  mode === m ? 'bg-white' : 'text-white/75'
                }`}
                style={mode === m ? { color: REVENGE_RED } : undefined}
              >
                {m === 'daily' ? 'Daily' : 'Ladder'}
              </button>
            ))}
          </div>

          {mode === 'daily' ? (
            <>
              <h1 className="text-[22px] font-black leading-tight mt-3">Today&apos;s challenge</h1>
              <p className="text-[12px] mt-0.5 opacity-85">
                One run.{total > 0 ? ` ${total.toLocaleString()} hunter${total === 1 ? '' : 's'}.` : ''} Resets in {countdown}.
              </p>
              <button
                type="button"
                onClick={() => onStart(dailyDifficulty)}
                className="mt-3.5 w-full min-h-[52px] rounded-2xl bg-white font-black text-[16px] tracking-wide active:translate-y-px transition-transform"
                style={{ color: REVENGE_RED, boxShadow: '0 4px 0 rgba(0,0,0,0.25)' }}
              >
                GO GET HIM
              </button>
            </>
          ) : (
            <>
              <h1 className="text-[22px] font-black leading-tight mt-3">The Ladder</h1>
              <p className="text-[12px] mt-0.5 opacity-85">Ten rungs, easiest to hardest. Clear one to open the next.</p>
              {firstOpen && onLadderStart && (
                <button
                  type="button"
                  onClick={() => onLadderStart(firstOpen.id)}
                  className="mt-3.5 w-full min-h-[52px] rounded-2xl bg-white font-black text-[16px] tracking-wide active:translate-y-px transition-transform"
                  style={{ color: REVENGE_RED, boxShadow: '0 4px 0 rgba(0,0,0,0.25)' }}
                >
                  {`RUNG ${firstOpen.rung} · ${firstOpen.name.toUpperCase()}`}
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Below the fold ────────────────────────────────────────────── */}
        <div className="flex-1 px-3 pt-4 pb-[max(env(safe-area-inset-bottom),24px)] flex flex-col gap-3">
          {mode === 'daily' ? (
            <Card>
              <div className="mb-2"><SectionLabel>Today&apos;s hunters</SectionLabel></div>
              {board === 'loading' && <p className="text-[12px] text-chess-text-muted py-2">Loading…</p>}
              {board !== 'loading' && (!board || !board.available) && (
                <p className="text-[12px] text-chess-text-muted py-1 leading-snug">
                  The board opens when the first run is filed today — yours counts.
                </p>
              )}
              {board !== 'loading' && board?.available && board.rows.length === 0 && (
                <p className="text-[12px] text-chess-text-muted py-1 leading-snug">Nobody has finished a run yet today. Be first.</p>
              )}
              {board !== 'loading' && board?.available && board.rows.length > 0 && (
                <ul>
                  {board.rows.map((r) => (
                    <li
                      key={r.rank}
                      className={`flex items-center gap-2.5 py-1.5 text-[13px] border-b border-chess-text/5 last:border-0 ${r.me ? 'font-black' : ''}`}
                      style={r.me ? { color: REVENGE_RED } : undefined}
                    >
                      <span className={`w-5 font-black ${r.rank === 1 ? '' : 'text-chess-text-faint'}`} style={r.rank === 1 ? { color: '#FFB020' } : undefined}>
                        {r.rank}
                      </span>
                      <span className="flex-1 font-bold truncate">{r.handle}{r.me ? ' (you)' : ''}</span>
                      <span className="text-[11px] text-chess-text-faint">L{r.levels}{r.completed ? ' ♚' : ''}</span>
                      <span className="tabular-nums w-8 text-right text-[12px] text-chess-text-muted">{r.captures}×</span>
                    </li>
                  ))}
                  {board.me && board.me.rank > 5 && (
                    <li className="flex items-center gap-2.5 py-1.5 mt-1 text-[13px] font-black rounded-lg px-2 -mx-2" style={{ background: '#FFEBEE', color: REVENGE_RED }}>
                      <span className="w-5">{board.me.rank}</span>
                      <span className="flex-1 truncate">{board.me.handle} (you)</span>
                      <span className="text-[11px] opacity-70">L{board.me.levels}</span>
                      <span className="tabular-nums w-8 text-right text-[12px]">{board.me.captures}×</span>
                    </li>
                  )}
                </ul>
              )}
              {/* Handle rename */}
              <div className="mt-2 flex items-center gap-2 text-[11px] text-chess-text-muted">
                <span>Playing as</span>
                {editing ? (
                  <form className="flex items-center gap-1" onSubmit={(e) => { e.preventDefault(); commitHandle(); }}>
                    <input
                      autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commitHandle}
                      maxLength={16} aria-label="Your leaderboard name"
                      className="w-28 min-h-[32px] px-1.5 border border-chess-text/20 rounded-lg text-[12px] text-chess-text bg-white"
                    />
                    <button type="submit" className="min-h-[32px] px-2 rounded-lg bg-chess-text text-white text-[10px] font-black">OK</button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setDraft(handle); setEditing(true); }}
                    className="min-h-[32px] px-1 font-black text-chess-text underline decoration-dotted underline-offset-2"
                  >
                    {handle}
                  </button>
                )}
                {!editing && <span className="text-chess-text-faint">· tap to rename</span>}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="mb-1"><SectionLabel>The rungs</SectionLabel></div>
              <ul className="divide-y divide-chess-text/5">
                {rungs.map((r) => {
                  const playable = !r.comingSoon && r.state !== 'locked' && !!onLadderStart;
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        disabled={!playable}
                        onClick={() => { if (playable && onLadderStart) onLadderStart(r.id); }}
                        data-rung={r.rung}
                        data-run-id={r.id}
                        className={`w-full min-h-[54px] flex items-center gap-3 text-left py-1 ${playable ? 'active:opacity-70' : 'opacity-45'}`}
                      >
                        <span
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-black shrink-0"
                          style={
                            r.state === 'cleared'
                              ? { background: '#2A3C45', color: '#fff' }
                              : !playable
                                ? { background: '#e5edf3', color: '#94a3b8' }
                                : { background: '#FFEBEE', color: REVENGE_RED }
                          }
                        >
                          {r.state === 'cleared' ? '✓' : r.state === 'locked' || r.comingSoon ? <LockIcon /> : r.rung}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[15px] font-black leading-tight">
                            {r.comingSoon ? `Rung ${r.rung}` : `Rung ${r.rung} · ${r.name}`}
                          </span>
                          <span className="block text-[11px] text-chess-text-muted">{r.sub}</span>
                        </span>
                        {playable && r.state === 'open' && <span className="text-[14px] font-black text-chess-text-faint">›</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          {/* Codex */}
          {profile && onTrophies && (
            <Card className="!p-4">
              <button type="button" onClick={onTrophies} className="w-full flex items-center gap-3 text-left active:opacity-70" aria-label="Open the Codex">
                <span className="w-8 h-8 rounded-lg bg-chess-text flex items-center justify-center shrink-0"><TrophyGlyph size={15} /></span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[14px] font-black leading-tight">The Codex</span>
                  <span className="block text-[11px] text-chess-text-muted">
                    {abilitiesHave}/{abilitiesTotal} powers · {trophiesHave}/{ACHIEVEMENTS.length} trophies
                  </span>
                </span>
                <span className="text-[13px] font-black text-chess-text-faint">›</span>
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
