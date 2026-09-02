'use client';

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { DemoBoard } from './DemoBoard';
import { REVENGE_RED, REVENGE_RED_DARK, RevengeMarkSvg } from './RookiesRevengeLogo';
import { artFile } from './AbilityCard';
import { ABILITY_DEFS, type AbilityId } from '@/lib/run/abilities';
import { ACHIEVEMENTS } from '@/lib/run/achievements';
import { unlockableAbilityIds, type PlayerProfile } from '@/lib/run/profile';
import { isDifficultyLocked, type DifficultyId } from '@/lib/run/difficulty';
import { LADDER_RUNG_IDS, rungRun, rungState } from '@/lib/run/ladder';
import { getRunById, isKnownRunId } from '@/lib/run/runs';
import { getHandle } from '@/lib/run/leaderboard-client';

/**
 * Rookie's Revenge home — "the Arena" (Tyler, 2026-09-02, replaces HomeLanding).
 * ONE screen, no scroll. The live board (DemoBoard: the real RunBoard running
 * a scripted loop) is the fixed anchor; four tabs swap what sits under it:
 *   Revenge — DAILY REVENGE button + today's abilities. Tapping the button
 *             flips the board to today's run card (theme, pool, PLAY).
 *   Ladder  — the 10 rungs (real profile state), tap an open rung to play it.
 *   Ranks   — today's hunters. DUMMY DATA for now (see DUMMY_ROWS).
 *   Codex   — powers + trophies counts; tap opens the Trophy Room.
 * Same page contract as HomeLanding so app/page.tsx swaps cleanly.
 */
interface ArenaHomeProps {
  onStart: (d?: DifficultyId) => void;
  onLadderStart?: (runId: string) => void;
  iso: string;
  runId: string;
  profile?: PlayerProfile;
  onTrophies?: () => void;
}

// ── Dummy ranks (until the daily leaderboard is wired here) ─────────────────
const DUMMY_ROWS = [
  { rank: 1, handle: 'kingslayer_ru', captures: 31 },
  { rank: 2, handle: 'pawnstorm', captures: 29 },
  { rank: 3, handle: 'gleasons_gym', captures: 27 },
  { rank: 4, handle: 'moxie.chess', captures: 24 },
  { rank: 5, handle: 'h8_bishops', captures: 22 },
];
const DUMMY_ME = { rank: 47, captures: 12 };
const DUMMY_HUNTING = 2318;

// ── Kit ──────────────────────────────────────────────────────────────────────
const NAVY = '#0f1c3f';
const NAVY_2 = '#182a5c';
const PANEL = '#1c2f63';
const PANEL_EDGE = '#3a4f8f';
const GOLD = '#FFC800';
const OUTLINE: CSSProperties = { color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.45), -1px 0 0 rgba(0,0,0,0.35), 1px 0 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(0,0,0,0.35)' };
const GOLD_TEXT: CSSProperties = { color: GOLD, textShadow: '0 2px 0 rgba(0,0,0,0.5)' };
const FRAME: CSSProperties = { background: 'linear-gradient(180deg,#3d5297 0%,#1b2b5c 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.4), 0 10px 26px rgba(0,0,0,0.45)' };
const TABS = ['Ladder', 'Ranks', 'Revenge', 'Codex'] as const;
type Tab = (typeof TABS)[number];
const TAB_ART: Record<Tab, string> = { Ladder: 'ladder-b', Ranks: 'ranks-a', Revenge: 'revenge-g', Codex: 'codex-a' };

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
  return `${hh}:${mm}`;
}

/** Deterministic daily pick: N abilities from the run's pool, seeded by the ISO date. */
function todaysAbilities(iso: string, runId: string, n: number): AbilityId[] {
  const run = isKnownRunId(runId) ? getRunById(runId) : null;
  const pool = (run?.allowedAbilities as AbilityId[] | undefined) ?? unlockableAbilityIds();
  let seed = 0;
  for (const ch of iso) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n).filter((id) => id in ABILITY_DEFS);
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: PANEL, border: `2px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -3px 0 rgba(0,0,0,0.35), 0 6px 14px rgba(0,0,0,0.35)' }}>
      {children}
    </div>
  );
}

/** Chess Path button pattern: flat face, hard bottom shadow, presses flat. */
function CpButton({ children, color = REVENGE_RED, shadow = REVENGE_RED_DARK, depth = 6, className = '', onClick, ariaLabel }: {
  children: ReactNode; color?: string; shadow?: string; depth?: number; className?: string; onClick?: () => void; ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`arena-press w-full rounded-[16px] font-black flex items-center justify-center gap-3 ${className}`}
      style={{ background: color, color: '#fff', boxShadow: `0 ${depth}px 0 ${shadow}`, ['--depth' as string]: `${depth}px` }}
    >
      {children}
    </button>
  );
}

function AbilityTile({ id, size, label = true }: { id: AbilityId; size?: number; label?: boolean }) {
  return (
    <div className="flex flex-col items-center min-w-0">
      <div className="w-full aspect-square rounded-2xl p-1" style={{ ...FRAME, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.4), 0 5px 12px rgba(0,0,0,0.4)', width: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/abilities/${artFile(id)}`} alt={ABILITY_DEFS[id].name} className="w-full h-full object-cover rounded-xl" />
      </div>
      {label && <span className="mt-1.5 text-[11px] font-bold text-center leading-tight text-white">{ABILITY_DEFS[id].name}</span>}
    </div>
  );
}

function Medal({ rank }: { rank: number }) {
  const bg = rank === 1 ? GOLD : rank === 2 ? '#CFD8DC' : rank === 3 ? '#D08A4E' : 'rgba(255,255,255,0.12)';
  const fg = rank <= 3 ? '#3a2a00' : '#fff';
  return <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0" style={{ background: bg, color: fg, boxShadow: rank <= 3 ? 'inset 0 -2px 0 rgba(0,0,0,0.25)' : undefined }}>{rank}</span>;
}

// ── The arena: live board on the front, today's run card on the back ────────
function Arena({ flipped, onBack, onPlay, runName, runBlurb, pool }: {
  flipped: boolean; onBack: () => void; onPlay: () => void; runName: string; runBlurb: string; pool: AbilityId[];
}) {
  return (
    <div className="relative w-full aspect-square" style={{ perspective: 1200 }}>
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 650ms cubic-bezier(.22,1,.36,1)' }}>
        <div className="absolute inset-0 rounded-[20px] p-2" style={{ backfaceVisibility: 'hidden', ...FRAME }}>
          <div className="rounded-[14px] overflow-hidden h-full" style={{ boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }}><DemoBoard /></div>
        </div>
        <div className="absolute inset-0 rounded-[20px] p-2" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(180deg,#5b2030 0%,#2a0f18 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -4px 0 rgba(0,0,0,0.4), 0 10px 26px rgba(0,0,0,0.45)' }}>
          <div className="rounded-[14px] h-full flex flex-col p-3" style={{ background: 'linear-gradient(180deg,#1c2f63 0%,#0f1c3f 100%)', boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: '#FF6B66' }}>Today&rsquo;s revenge</span>
              <button type="button" onClick={onBack} className="min-h-[32px] text-[11px] font-black px-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}>Back</button>
            </div>
            <div className="mt-1 text-[24px] font-black leading-none" style={OUTLINE}>{runName}</div>
            <div className="mt-1.5 text-[12px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>{runBlurb}</div>
            <div className="mt-2.5 flex items-center gap-2 text-[11px] font-black">
              <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.1)' }}>10 levels</span>
              <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.1)' }}>{pool.length} powers</span>
              <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(255,200,0,0.15)', ...GOLD_TEXT }}>Counts toward Ranks</span>
            </div>
            <div className="mt-2.5 text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Today&rsquo;s pool</div>
            <div className="mt-1.5 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.max(pool.length, 1)}, minmax(0, 1fr))` }}>
              {pool.map((id) => (
                <div key={id} className="flex flex-col items-center gap-1">
                  <AbilityTile id={id} label={false} />
                  <span className="text-[8px] font-bold text-center leading-tight" style={{ color: 'rgba(255,255,255,0.75)' }}>{ABILITY_DEFS[id].name}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <CpButton depth={5} className="min-h-[50px] text-[17px]" color="#58CC02" shadow="#3d8c01" onClick={onPlay}>PLAY</CpButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab bar with sliding indicator ───────────────────────────────────────────
function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const i = TABS.indexOf(active);
  return (
    <div className="relative grid grid-cols-4 rounded-2xl p-1" role="tablist" aria-label="Home sections" style={{ background: '#0a1230', border: `2px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08)' }}>
      <div aria-hidden className="absolute top-1 bottom-1 rounded-xl" style={{ left: 4, width: 'calc((100% - 8px) / 4)', transform: `translateX(${i * 100}%)`, transition: 'transform 300ms cubic-bezier(.22,1,.36,1)', background: 'linear-gradient(180deg,#3d5297,#24397a)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), 0 3px 0 rgba(0,0,0,0.4)' }} />
      {TABS.map((t) => {
        const on = t === active;
        return (
          <button key={t} type="button" role="tab" aria-selected={on} onClick={() => onChange(t)} className="relative min-h-[58px] rounded-xl flex flex-col items-center justify-center gap-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/ui/tabs/${TAB_ART[t]}.webp`} alt="" width={34} height={34} style={{ width: 34, height: 34, transform: on ? 'translateY(-2px) scale(1.12)' : 'none', filter: on ? 'drop-shadow(0 0 6px rgba(255,200,0,0.5))' : 'saturate(0.8) brightness(0.85)', transition: 'transform 200ms cubic-bezier(.22,1,.36,1), filter 200ms' }} />
            <span className="text-[10px] font-black" style={on ? OUTLINE : { color: 'rgba(255,255,255,0.65)' }}>{t}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
function RevengeTab({ onGo, countdown, runName, abilities }: { onGo: () => void; countdown: string; runName: string; abilities: AbilityId[] }) {
  return (
    <div className="h-full flex flex-col">
      <CpButton onClick={onGo} className="min-h-[70px]" ariaLabel="Daily Revenge">
        <RevengeMarkSvg size={46} ringColor="#fff" />
        <span className="flex flex-col items-start leading-none">
          <span className="text-[24px]" style={{ ...OUTLINE, letterSpacing: '0.02em' }}>DAILY REVENGE</span>
          <span className="text-[12px] font-bold mt-1" style={{ color: '#FFD6D6' }}>Resets in {countdown} · you&rsquo;re #{DUMMY_ME.rank} of {DUMMY_HUNTING.toLocaleString()}</span>
        </span>
      </CpButton>
      <div className="mt-3.5 flex items-baseline justify-between px-1">
        <span className="text-[14px] font-black" style={OUTLINE}>Today&rsquo;s abilities</span>
        <span className="text-[11px] font-bold truncate ml-3" style={{ color: 'rgba(255,255,255,0.7)' }}>{runName}</span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {abilities.map((id) => <AbilityTile key={id} id={id} />)}
      </div>
    </div>
  );
}

function LadderTab({ profile, onLadderStart }: { profile?: PlayerProfile; onLadderStart?: (runId: string) => void }) {
  const rungs = LADDER_RUNG_IDS.map((id, i) => {
    const run = rungRun(i);
    const state = rungState(profile, i);
    return { id, run, state, comingSoon: !run };
  });
  const openIdx = rungs.findIndex((r) => r.state === 'open' && !r.comingSoon);
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between px-1">
        <span className="text-[14px] font-black" style={OUTLINE}>The Ladder</span>
        <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>{openIdx >= 0 ? `Rung ${openIdx + 1} of 10` : 'All clear'} · unlocks the Codex</span>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {rungs.map((r, i) => {
          const playable = !r.comingSoon && r.state !== 'locked' && !!onLadderStart;
          const st = r.state === 'cleared' ? 'done' : r.state === 'open' && !r.comingSoon ? 'next' : 'locked';
          return (
            <button
              key={r.id}
              type="button"
              disabled={!playable}
              onClick={() => { if (playable && onLadderStart) onLadderStart(r.id); }}
              data-rung={i + 1}
              data-run-id={r.id}
              className="arena-press rounded-xl flex flex-col items-center justify-center min-h-[56px] py-1.5 gap-1"
              style={{
                background: st === 'done' ? '#58CC02' : st === 'next' ? REVENGE_RED : '#22305e',
                boxShadow: `0 4px 0 ${st === 'done' ? '#3d8c01' : st === 'next' ? REVENGE_RED_DARK : '#0a1230'}`,
                ['--depth' as string]: '4px',
                opacity: st === 'locked' ? 0.55 : 1,
              }}
            >
              <span className="text-[16px] font-black leading-none" style={OUTLINE}>{st === 'done' ? '✓' : i + 1}</span>
              <span className="text-[8px] font-bold leading-tight text-center px-0.5 line-clamp-2" style={{ color: 'rgba(255,255,255,0.85)' }}>{r.run?.name ?? 'Soon'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RanksTab({ handle }: { handle: string }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between px-1">
        <span className="text-[14px] font-black" style={OUTLINE}>Today&rsquo;s hunters</span>
        <span className="text-[10px] font-black uppercase tracking-wider" style={GOLD_TEXT}>Global</span>
      </div>
      <ul className="mt-1.5">
        {DUMMY_ROWS.slice(0, 4).map((r) => (
          <li key={r.rank} className="flex items-center gap-2.5 py-[5px] text-[12px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <Medal rank={r.rank} /><span className="flex-1 font-bold truncate">{r.handle}</span>
            <span className="tabular-nums font-black" style={GOLD_TEXT}>{r.captures}<span className="text-[9px] opacity-80"> caps</span></span>
          </li>
        ))}
        <li className="flex items-center gap-2.5 py-[5px] mt-1 text-[12px] font-black rounded-lg px-2 -mx-2" style={{ background: 'rgba(229,57,53,0.28)', border: '1.5px solid rgba(229,57,53,0.6)' }}>
          <Medal rank={DUMMY_ME.rank} /><span className="flex-1 truncate">{handle} (you)</span>
          <span className="tabular-nums" style={GOLD_TEXT}>{DUMMY_ME.captures}<span className="text-[9px] opacity-80"> caps</span></span>
        </li>
      </ul>
    </div>
  );
}

function CodexTab({ profile, onTrophies }: { profile?: PlayerProfile; onTrophies?: () => void }) {
  const abilitiesTotal = unlockableAbilityIds().length;
  const have = profile?.unlockedAbilities ?? [];
  const trophiesHave = profile ? Object.keys(profile.achievements).length : 0;
  const preview = have.slice(0, 3);
  const locked = unlockableAbilityIds().find((id) => !have.includes(id));
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between px-1">
        <span className="text-[14px] font-black" style={OUTLINE}>The Codex</span>
        <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Win rungs to fill it</span>
      </div>
      <button type="button" onClick={onTrophies} className="mt-2 grid grid-cols-2 gap-2 text-left active:opacity-80" aria-label="Open the Codex">
        <Panel className="p-3">
          <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>Powers</div>
          <div className="text-[26px] font-black leading-none mt-1" style={GOLD_TEXT}>{have.length}<span className="text-[14px] text-white/60">/{abilitiesTotal}</span></div>
          <div className="mt-2 flex gap-1">
            {preview.map((id) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={id} src={`/abilities/${artFile(id)}`} alt="" width={30} height={30} className="rounded-lg object-cover" style={{ width: 30, height: 30 }} />
            ))}
            {locked && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/abilities/${artFile(locked)}`} alt="" width={30} height={30} className="rounded-lg object-cover" style={{ width: 30, height: 30, filter: 'grayscale(1) brightness(0.55)' }} />
            )}
          </div>
        </Panel>
        <Panel className="p-3">
          <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>Trophies</div>
          <div className="text-[26px] font-black leading-none mt-1" style={GOLD_TEXT}>{trophiesHave}<span className="text-[14px] text-white/60">/{ACHIEVEMENTS.length}</span></div>
          <div className="mt-2 h-[30px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (trophiesHave / Math.max(1, ACHIEVEMENTS.length)) * 100)}%`, background: `linear-gradient(90deg,${GOLD},#F5A800)` }} />
          </div>
        </Panel>
      </button>
    </div>
  );
}

// ── The shell ────────────────────────────────────────────────────────────────
export function ArenaHome({ onStart, onLadderStart, iso, runId, profile, onTrophies }: ArenaHomeProps) {
  const [tab, setTab] = useState<Tab>('Revenge');
  const [flipped, setFlipped] = useState(false);
  const countdown = useCountdownToMidnight();
  const [handle, setHandle] = useState('Rook');
  useEffect(() => { setHandle(getHandle()); }, []);

  const run = isKnownRunId(runId) ? getRunById(runId) : null;
  const runName = run?.name ?? "Today's run";
  const runBlurb = run?.blurb ?? 'Ten levels. One King. She has a list.';
  const pool = useMemo(() => todaysAbilities(iso, runId, 4), [iso, runId]);

  // The daily is "just one run": Normal once it's open, Rookie for brand-new players.
  const dailyDifficulty: DifficultyId = isDifficultyLocked('normal', profile) ? 'rookie' : 'normal';

  return (
    <div className="h-full w-full flex justify-center text-white" style={{ background: NAVY }}>
      <style>{`
        .arena-press { transition: transform 80ms ease-out, box-shadow 80ms ease-out; }
        .arena-press:active:not(:disabled) { transform: translateY(var(--depth, 4px)); box-shadow: 0 0 0 transparent !important; }
        @keyframes arena-tab-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .arena-tab-in { animation: arena-tab-in 220ms cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .arena-tab-in { animation: none; } }
      `}</style>
      <div className="h-full w-full max-w-[430px] flex flex-col px-3 pb-[max(env(safe-area-inset-bottom),12px)]" style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 60%)` }}>
        {/* header: small lockup left, handle right */}
        <div className="flex items-center justify-between pt-[max(env(safe-area-inset-top),16px)]">
          <div className="flex items-center gap-1.5">
            <RevengeMarkSvg size={26} />
            <span className="text-[12px] font-black leading-none" style={OUTLINE}>Rookie&rsquo;s <span style={{ color: '#FF6B66' }}>REVENGE</span></span>
          </div>
          <div className="rounded-lg px-2.5 py-1" style={{ background: 'rgba(0,0,0,0.3)', border: '1.5px solid rgba(255,255,255,0.12)' }}>
            <span className="text-[11px] font-black" style={OUTLINE}>{handle}</span>
          </div>
        </div>

        {/* the anchor — square, and never taller than what leaves room for the surround + tab bar */}
        <div className="mt-3 mx-auto w-full" style={{ maxWidth: 'calc(100dvh - 410px)' }}>
          <Arena flipped={flipped} onBack={() => setFlipped(false)} onPlay={() => onStart(dailyDifficulty)} runName={runName} runBlurb={runBlurb} pool={pool} />
        </div>

        {/* the surround */}
        <div className="flex-1 min-h-0 mt-3 relative overflow-hidden">
          <div key={tab} className="h-full arena-tab-in">
            {tab === 'Revenge' && <RevengeTab onGo={() => setFlipped(true)} countdown={countdown} runName={runName} abilities={pool.slice(0, 4)} />}
            {tab === 'Ladder' && <LadderTab profile={profile} onLadderStart={onLadderStart} />}
            {tab === 'Ranks' && <RanksTab handle={handle} />}
            {tab === 'Codex' && <CodexTab profile={profile} onTrophies={onTrophies} />}
          </div>
        </div>

        <div className="mt-2"><TabBar active={tab} onChange={(t) => { setTab(t); setFlipped(false); }} /></div>
      </div>
    </div>
  );
}
