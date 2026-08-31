'use client';

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { REVENGE_RED, REVENGE_RED_DARK, RookiesRevengeLogo } from './RookiesRevengeLogo';
import { TrophyGlyph } from './AchievementToast';
import { ACHIEVEMENTS, type AchievementDef } from '@/lib/run/achievements';
import { ABILITY_DEFS, type AbilityId } from '@/lib/run/abilities';
import { unlockableAbilityIds, type PlayerProfile } from '@/lib/run/profile';
import { readHistory } from '@/lib/run/history';
import {
  DIFFICULTIES,
  DIFFICULTY_ORDER,
  difficultyLockHint,
  isDifficultyLocked,
  type DifficultyId,
} from '@/lib/run/difficulty';
import { fetchBoard, getHandle, setHandle, type LeaderboardResponse } from '@/lib/run/leaderboard-client';

/**
 * Rookie's Revenge home screen — "The Desk".
 * Top-down on Rookie's desk: a newspaper clipping (today's hunt), a typed
 * dossier (global leaderboard) and a route map (the level ladder + next
 * power). Same contract as RunLanding so app/page.tsx can swap them.
 */
interface DeskLandingProps {
  onStart: () => void;
  iso: string; // YYYY-MM-DD of the run being shown
  runId: string;
  runName: string;
  totalLevels: number;
  /** Levels that hand out a free power at their start (runDef.offerOnLevels). */
  powerLevels?: ReadonlyArray<number>;
  dateLabel?: string;
  profile?: PlayerProfile;
  onTrophies?: () => void;
  difficulty?: DifficultyId;
  onDifficultyChange?: (d: DifficultyId) => void;
}

const HAND: CSSProperties = { fontFamily: '"Marker Felt", "Bradley Hand", "Segoe Print", cursive' };
const TYPE: CSSProperties = { fontFamily: '"Courier New", ui-monospace, monospace' };
const SERIF: CSSProperties = { fontFamily: 'Georgia, "Times New Roman", serif' };

// ── Small bits ───────────────────────────────────────────────────────────────
function Tape({ className = '' }: { className?: string }) {
  return <span aria-hidden className={`absolute h-4 w-14 bg-[#fff3b0]/80 shadow-sm z-10 ${className}`} style={{ transform: 'rotate(-3deg)' }} />;
}
function Pin({ className = '', color = '#444' }: { className?: string; color?: string }) {
  return <span aria-hidden className={`absolute w-3 h-3 rounded-full shadow z-10 ${className}`} style={{ background: `radial-gradient(circle at 35% 35%, #fff9, ${color} 45%, #222)` }} />;
}
function Lock({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 9 11" aria-hidden className="shrink-0">
      <rect x="0.5" y="4.5" width="8" height="6" rx="1.2" fill="currentColor" />
      <path d="M2 4.5V3a2.5 2.5 0 0 1 5 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function KingMug({ size = 96 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center overflow-hidden border border-black/20" style={{ width: size, height: size * 0.8, background: '#e9e4d8' }} aria-hidden>
      <div className="absolute inset-0 opacity-25" style={{ background: `repeating-linear-gradient(0deg, transparent 0 ${size / 8}px, #999 ${size / 8}px ${size / 8 + 1}px)` }} />
      <span style={{ fontSize: size * 0.46, lineHeight: 1, color: '#222' }}>♚</span>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <circle cx="50" cy="50" r="44" fill="none" stroke={REVENGE_RED} strokeWidth="5" />
        <circle cx="50" cy="50" r="28" fill="none" stroke={REVENGE_RED} strokeWidth="3" opacity=".55" />
        {[[50, 2, 50, 16], [50, 84, 50, 98], [2, 50, 16, 50], [84, 50, 98, 50]].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={REVENGE_RED} strokeWidth="5" strokeLinecap="round" />
        ))}
      </svg>
    </div>
  );
}
function Paper({ children, rot, bg = '#fff', className = '', style }: { children: ReactNode; rot: number; bg?: string; className?: string; style?: CSSProperties }) {
  return (
    <section className={`relative shadow-md p-3 ${className}`} style={{ background: bg, transform: `rotate(${rot}deg)`, ...style }}>
      {children}
    </section>
  );
}

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

/** The closest not-yet-earned trophy that unlocks a power. */
function nextPower(profile: PlayerProfile | undefined): { ach: AchievementDef; name: string; cur: number; target: number } | null {
  if (!profile) return null;
  const have = new Set<string>(profile.unlockedAbilities);
  const pool = new Set<string>(unlockableAbilityIds());
  let best: { ach: AchievementDef; name: string; cur: number; target: number; ratio: number } | null = null;
  for (const a of ACHIEVEMENTS) {
    if (!a.unlocks || !pool.has(a.unlocks) || have.has(a.unlocks) || profile.achievements[a.id] || a.secret) continue;
    const [cur, target] = a.progress ? a.progress(profile.counters) : [0, 1];
    const ratio = target > 0 ? cur / target : 0;
    const name = ABILITY_DEFS[a.unlocks as AbilityId]?.name ?? a.unlocks;
    if (!best || ratio > best.ratio) best = { ach: a, name, cur, target, ratio };
  }
  return best;
}

// ── Component ────────────────────────────────────────────────────────────────
export function DeskLanding({
  onStart, iso, runId, runName, totalLevels, powerLevels = [], dateLabel,
  profile, onTrophies, difficulty, onDifficultyChange,
}: DeskLandingProps) {
  const countdown = useCountdownToMidnight();
  const showPicker = !!difficulty && !!onDifficultyChange;
  const isLocked = (id: DifficultyId): boolean => isDifficultyLocked(id, profile);
  const [lockHint, setLockHint] = useState<string | null>(null);
  useEffect(() => {
    if (!showPicker || !difficulty || !isLocked(difficulty)) return;
    const open = DIFFICULTY_ORDER.find((id) => !isLocked(id));
    if (open && open !== difficulty) onDifficultyChange?.(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPicker, difficulty, profile]);
  useEffect(() => {
    if (!lockHint) return;
    const t = setTimeout(() => setLockHint(null), 2200);
    return () => clearTimeout(t);
  }, [lockHint]);

  // Ladder — best levels cleared on this run (local history), today's attempt.
  const { bestCleared, todayCleared } = useMemo(() => {
    const cleared = (e: { completed: boolean; levelReached: number; totalLevels: number }) =>
      e.completed ? e.totalLevels : Math.max(0, e.levelReached - 1);
    let best = 0, today = -1;
    for (const e of readHistory()) {
      if (e.runId !== runId) continue;
      best = Math.max(best, cleared(e));
      if (e.iso === iso) today = Math.max(today, cleared(e));
    }
    return { bestCleared: Math.min(best, totalLevels), todayCleared: today };
  }, [runId, iso, totalLevels]);
  const next = useMemo(() => nextPower(profile), [profile]);
  const abilitiesTotal = unlockableAbilityIds().length;
  const abilitiesHave = profile ? profile.unlockedAbilities.length : 0;
  const trophiesHave = profile ? Object.keys(profile.achievements).length : 0;

  // Leaderboard dossier.
  const [board, setBoard] = useState<LeaderboardResponse | null | 'loading'>('loading');
  useEffect(() => {
    let cancelled = false;
    fetchBoard(iso, runId).then((b) => { if (!cancelled) setBoard(b); });
    return () => { cancelled = true; };
  }, [iso, runId]);
  const [handle, setHandleState] = useState('Rook');
  useEffect(() => { setHandleState(getHandle()); }, []);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const commitHandle = () => {
    const ok = setHandle(draft);
    if (ok) setHandleState(ok);
    setEditing(false);
  };

  const activeDef = difficulty ? DIFFICULTIES[difficulty] : null;
  const total = board && board !== 'loading' ? board.total : 0;
  const finished = board && board !== 'loading' ? board.finished : 0;
  const available = board && board !== 'loading' ? board.available : false;
  const stepX = (i: number) => 12 + (i * 276) / Math.max(1, totalLevels - 1);
  const stepY = (i: number) => 66 + Math.sin(i * 0.9) * 26;

  return (
    <div
      className="min-h-full w-full flex justify-center px-3 py-2 text-[#222]"
      style={{ background: '#5b3a24', backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 2px, transparent 2px 46px), linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.15))' }}
    >
      <div className="w-full max-w-[360px] flex flex-col gap-3 pt-1 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div className="bg-white px-2 py-1 shadow-md"><RookiesRevengeLogo scale={0.34} /></div>
          {dateLabel && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{dateLabel}</span>}
        </div>

        {/* ── DAILY: newspaper clipping ─────────────────────────────────── */}
        <Paper rot={-0.5} bg="#f4efe3" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,0,0,.015) 3px 4px)' }}>
          <Tape className="-top-2 left-4" />
          <div className="flex items-baseline justify-between border-b-2 border-black pb-1">
            <span className="text-[9px] font-black uppercase tracking-[0.25em]">The Daily Revenge</span>
            <span className="text-[8px]" style={TYPE}>{dateLabel ?? iso} · resets {countdown}</span>
          </div>
          <div className="flex gap-3 mt-2">
            <div className="shrink-0"><KingMug size={92} /></div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[15px] font-black leading-[1.05] uppercase" style={SERIF}>King spotted in {runName.replace(/^Rookie's Revenge$/, 'the Citadel')}</h1>
              <p className="text-[9.5px] mt-1 leading-snug text-[#333]" style={SERIF}>
                {totalLevels} levels of loyal army between her and him.{' '}
                {available && total > 0
                  ? <>{total.toLocaleString()} hunter{total === 1 ? '' : 's'} already on his trail; {finished} reached him.</>
                  : <>Nobody told him it was over.</>}
                {todayCleared >= 0 && <> You cleared <b>{todayCleared}</b> today.</>}
              </p>
            </div>
          </div>

          {/* Difficulty = "edition" */}
          {showPicker && activeDef && (
            <div className="mt-2.5" data-testid="difficulty-picker">
              <div role="radiogroup" aria-label="Difficulty" className="grid grid-cols-4 gap-1 border-y border-black/30 py-1">
                {DIFFICULTY_ORDER.map((id) => {
                  const def = DIFFICULTIES[id];
                  const active = id === difficulty;
                  const locked = isLocked(id);
                  return (
                    <button
                      key={id} type="button" role="radio" aria-checked={active} aria-disabled={locked} data-difficulty={id}
                      onClick={() => {
                        if (locked) { setLockHint(difficultyLockHint(id)); return; }
                        setLockHint(null); onDifficultyChange?.(id);
                      }}
                      className={`min-h-[44px] text-[10.5px] font-black uppercase tracking-wide flex items-center justify-center gap-1 rounded ${active ? 'bg-black text-white' : locked ? 'text-black/35' : 'text-black/70 active:bg-black/10'}`}
                      style={TYPE}
                    >
                      {locked && <Lock size={8} />}<span className="truncate">{def.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] italic leading-snug mt-1 min-h-[14px] text-[#555]" aria-live="polite" style={SERIF}>
                {lockHint ? <span className="not-italic font-bold text-black">{lockHint}</span> : activeDef.tagline}
              </p>
            </div>
          )}

          <button
            type="button" onClick={onStart}
            className="mt-2.5 w-full min-h-[50px] rounded-xl text-white font-black text-[15px] tracking-wide flex flex-col items-center justify-center leading-tight active:translate-y-px transition-transform"
            style={{ background: REVENGE_RED, boxShadow: `0 4px 0 ${REVENGE_RED_DARK}` }}
          >
            GO GET HIM
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] opacity-85">
              {activeDef ? `${activeDef.name} · ` : ''}level 1 of {totalLevels}
            </span>
          </button>
        </Paper>

        {/* ── LEADERBOARD: typed dossier ────────────────────────────────── */}
        <Paper rot={0.6}>
          <Pin className="-top-1.5 right-5" />
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]" style={TYPE}>Dossier: hunters, global</h2>
            <span className="text-[8px] px-1 border border-black/40 uppercase" style={TYPE}>today</span>
          </div>
          <div className="mt-1.5" style={TYPE}>
            {board === 'loading' && <p className="text-[11px] text-black/50 py-2">pulling the file…</p>}
            {board !== 'loading' && (!board || !board.available) && (
              <p className="text-[11px] text-black/60 py-1 leading-snug">
                No hunters on record yet. The board opens when the first run is filed — yours counts.
              </p>
            )}
            {board !== 'loading' && board?.available && board.rows.length === 0 && (
              <p className="text-[11px] text-black/60 py-1 leading-snug">Nobody has filed a run today. Be first.</p>
            )}
            {board !== 'loading' && board?.available && board.rows.length > 0 && (
              <ul>
                {board.rows.map((r) => (
                  <li key={r.rank} className={`flex items-center gap-2 py-1 text-[12px] border-b border-black/8 ${r.me ? 'font-black' : ''}`} style={r.me ? { color: REVENGE_RED } : undefined}>
                    <span className="w-4 font-black" style={r.rank === 1 ? { color: REVENGE_RED } : { color: '#888' }}>{r.rank}</span>
                    <span className="flex-1 font-bold truncate">{r.handle}{r.me ? ' (you)' : ''}</span>
                    <span className="text-[10px] text-black/50">L{r.levels}{r.completed ? ' ♚' : ''}</span>
                    <span className="tabular-nums w-8 text-right text-[11px]">{r.captures}×</span>
                  </li>
                ))}
                {board.me && board.me.rank > 5 && (
                  <li className="flex items-center gap-2 py-1.5 text-[12px] font-black mt-1 rounded px-1.5 -mx-1.5" style={{ background: '#FFEBEE', color: REVENGE_RED }}>
                    <span className="w-4">{board.me.rank}</span>
                    <span className="flex-1 truncate">{board.me.handle} (you)</span>
                    <span className="text-[10px] text-black/50">L{board.me.levels}</span>
                    <span className="tabular-nums w-8 text-right text-[11px]">{board.me.captures}×</span>
                  </li>
                )}
              </ul>
            )}
            {/* your handle */}
            <div className="mt-2 flex items-center gap-2 text-[10px] text-black/60">
              <span>Filed as</span>
              {editing ? (
                <form className="flex items-center gap-1" onSubmit={(e) => { e.preventDefault(); commitHandle(); }}>
                  <input
                    autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commitHandle}
                    maxLength={16} aria-label="Your leaderboard name"
                    className="w-28 min-h-[32px] px-1.5 border border-black/30 rounded text-[11px] text-black bg-white"
                  />
                  <button type="submit" className="min-h-[32px] px-2 rounded bg-black text-white text-[10px] font-black">OK</button>
                </form>
              ) : (
                <button type="button" onClick={() => { setDraft(handle); setEditing(true); }} className="min-h-[32px] px-1 font-black text-black underline decoration-dotted underline-offset-2">
                  {handle}
                </button>
              )}
              {!editing && <span className="text-black/40">· tap to rename</span>}
            </div>
          </div>
        </Paper>

        {/* ── LADDER: route map ─────────────────────────────────────────── */}
        <Paper
          rot={-0.4} bg="#e8e2cf" className="overflow-hidden"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(120,140,90,.25) 0 60px, transparent 61px), radial-gradient(circle at 80% 70%, rgba(120,140,90,.2) 0 80px, transparent 81px), repeating-linear-gradient(0deg, rgba(0,0,0,.05) 0 1px, transparent 1px 18px), repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 1px, transparent 1px 18px)' }}
        >
          <Tape className="-top-2 right-6" />
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]" style={TYPE}>Route to the king</h2>
            <span className="text-[9px] text-black/60" style={TYPE}>best {bestCleared}/{totalLevels}</span>
          </div>
          <svg width="100%" viewBox="0 0 300 112" className="mt-1 block" role="img" aria-label={`Level map: ${bestCleared} of ${totalLevels} levels cleared`}>
            <polyline points={Array.from({ length: totalLevels }, (_, i) => `${stepX(i)},${stepY(i)}`).join(' ')} fill="none" stroke="#999" strokeWidth="2" strokeDasharray="3 3" />
            {bestCleared > 0 && (
              <polyline points={Array.from({ length: Math.min(totalLevels, bestCleared + 1) }, (_, i) => `${stepX(i)},${stepY(i)}`).join(' ')} fill="none" stroke={REVENGE_RED} strokeWidth="2.5" />
            )}
            {Array.from({ length: totalLevels }, (_, i) => {
              const lvl = i + 1;
              const done = lvl <= bestCleared;
              const nextLvl = lvl === bestCleared + 1;
              const isKing = lvl === totalLevels;
              const power = powerLevels.includes(lvl);
              const x = stepX(i), y = stepY(i);
              const above = Math.sin(i * 0.9) <= 0;
              return (
                <g key={lvl}>
                  <circle cx={x} cy={y} r={power || isKing ? 7 : 4.5} fill={done ? '#2a2a2a' : nextLvl ? REVENGE_RED : '#fff'} stroke={done || nextLvl ? '#2a2a2a' : '#999'} strokeWidth="1.5" />
                  {isKing && <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill={done ? '#fff' : '#222'}>♚</text>}
                  {power && !isKing && <text x={x} y={above ? y - 12 : y + 20} textAnchor="middle" fontSize="7" fontWeight="900" fill={done ? '#2a2a2a' : '#666'} style={TYPE}>POWER</text>}
                  {nextLvl && <text x={x} y={above ? y + 20 : y - 12} textAnchor="middle" fontSize="7.5" fontWeight="900" fill={REVENGE_RED} style={TYPE}>NEXT · L{lvl}</text>}
                </g>
              );
            })}
          </svg>
          <p className="text-[11px] leading-snug" style={HAND}>
            {next ? (
              <>Next power: <b>{next.name}</b> — {next.ach.hint}{next.target > 1 ? ` (${next.cur}/${next.target})` : ''}</>
            ) : abilitiesHave >= abilitiesTotal ? (
              <>Every power is hers. Now it&apos;s just him.</>
            ) : (
              <>Free powers at the marked stops. Everything else, she earns.</>
            )}
          </p>
        </Paper>

        {/* Trophy room */}
        {profile && onTrophies && (
          <button
            type="button" onClick={onTrophies} aria-label="Open trophy room"
            className="relative w-full flex items-center justify-between gap-2 bg-[#fff3b0] px-3 py-2.5 shadow-md active:scale-[0.99] transition-transform text-left"
            style={{ transform: 'rotate(0.5deg)' }}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-md bg-black flex items-center justify-center shrink-0"><TrophyGlyph size={15} /></span>
              <span className="text-[12px] text-[#333] truncate" style={HAND}>
                Powers <b className="tabular-nums">{abilitiesHave}/{abilitiesTotal}</b> · Trophies <b className="tabular-nums">{trophiesHave}/{ACHIEVEMENTS.length}</b>
              </span>
            </span>
            <span className="text-[11px] font-black text-[#333]" style={HAND}>Trophy Room →</span>
          </button>
        )}
      </div>
    </div>
  );
}
