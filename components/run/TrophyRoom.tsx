'use client';

import { useMemo, useState } from 'react';
import { ABILITY_DEFS, type AbilityId } from '@/lib/run/abilities';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_GROUPS,
  abilityUnlockedBy,
  cnt,
  type AchievementDef,
} from '@/lib/run/achievements';
import { unlockableAbilityIds, type PlayerProfile } from '@/lib/run/profile';
import { DIFFICULTIES, DIFFICULTY_ORDER } from '@/lib/run/difficulty';
import { artFile } from './AbilityCard';
import { TrophyGlyph } from './AchievementToast';

interface Props {
  profile: PlayerProfile;
  onClose: () => void;
  onReplayTutorial?: () => void;
}

type Tab = 'trophies' | 'abilities';

/**
 * Full-screen progression sheet, rendered in the same trading-card language
 * as the ability offer: gradient card borders, an inner face, a tinted art
 * window. Earned trophies get the gold frame; ones that unlock a power show
 * that power's art. Locked cards are grey with a padlock and progress bar.
 * Read-only.
 */
export function TrophyRoom({ profile, onClose, onReplayTutorial }: Props) {
  const [tab, setTab] = useState<Tab>('trophies');
  const earnedCount = Object.keys(profile.achievements).length;
  const abilityIds = useMemo(() => unlockableAbilityIds(), []);
  const unlocked = new Set(profile.unlockedAbilities);

  return (
    <div className="fixed inset-0 z-[65] bg-chess-page text-chess-text flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 pt-3 pb-2 flex items-center justify-between gap-3 bg-chess-page/95 backdrop-blur border-b border-chess-text/10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: GOLD.border, boxShadow: GOLD.halo ?? undefined }}
          >
            <div className="w-8 h-8 rounded-lg bg-[#2A3C45] flex items-center justify-center">
              <TrophyGlyph size={18} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[9px] uppercase tracking-[0.22em] font-black text-chess-text-muted">
              Rookie&apos;s Revenge
            </div>
            <div className="text-lg font-black leading-tight">Trophy Room</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-90 transition-transform"
        >
          <span className="w-8 h-8 rounded-full bg-chess-text/10 flex items-center justify-center text-chess-text-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="shrink-0 px-4 py-2 flex gap-2">
        <TabButton active={tab === 'trophies'} onClick={() => setTab('trophies')}>
          Trophies <span className="opacity-60 tabular-nums">{earnedCount}/{ACHIEVEMENTS.length}</span>
        </TabButton>
        <TabButton active={tab === 'abilities'} onClick={() => setTab('abilities')}>
          Abilities <span className="opacity-60 tabular-nums">{unlocked.size}/{abilityIds.length}</span>
        </TabButton>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-8">
        <div className="max-w-md md:max-w-lg mx-auto w-full flex flex-col gap-5">
          {onReplayTutorial && (
            <button
              type="button"
              onClick={onReplayTutorial}
              className="w-full min-h-[44px] py-3 rounded-2xl bg-white border border-chess-text/15 text-chess-text font-black text-[13px] tracking-wide active:translate-y-px transition-transform"
            >
              Replay the tutorial
            </button>
          )}
          {tab === 'trophies' ? (
            <>
              <StatsStrip profile={profile} earned={earnedCount} total={ACHIEVEMENTS.length} />
              {ACHIEVEMENT_GROUPS.map((g) => {
                const list = ACHIEVEMENTS.filter((a) => a.group === g.id);
                const done = list.filter((a) => profile.achievements[a.id]).length;
                return (
                  <section key={g.id} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between px-0.5">
                      <h3 className="text-[11px] uppercase tracking-[0.18em] font-black text-chess-text-muted">
                        {g.label}
                      </h3>
                      <span className="text-[11px] font-black text-chess-text-faint tabular-nums">
                        {done}/{list.length}
                      </span>
                    </div>
                    <ul className="grid grid-cols-2 gap-2.5">
                      {list.map((a) => (
                        <TrophyCard key={a.id} a={a} profile={profile} />
                      ))}
                    </ul>
                  </section>
                );
              })}
            </>
          ) : (
            <>
              <p className="text-[12px] text-chess-text-muted leading-snug px-0.5">
                You start with three. Every other power is behind a trophy — earn it and the card
                shows up in your next offer.
              </p>
              <ul className="grid grid-cols-3 gap-2.5">
                {abilityIds.map((id) => (
                  <AbilityTile key={id} id={id} unlocked={unlocked.has(id)} />
                ))}
              </ul>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card frames — same recipe as AbilityCard's TIER table. Gold = earned,
// slate = locked, dark = secret.
// ---------------------------------------------------------------------------

interface Frame {
  border: string;
  face: string;
  art: string;
  text: string;
  halo: string | null;
}

const GOLD: Frame = {
  border: 'linear-gradient(135deg, #b8852b, #6a4612 30%, #ffd87a 60%, #b8852b)',
  face: '#f6e7c5',
  art: 'radial-gradient(ellipse at center, #ffe9a8 0%, #d49a2a 100%)',
  text: '#3d2806',
  halo: '0 0 14px rgba(255, 191, 36, 0.45)',
};

const LOCKED: Frame = {
  border: 'linear-gradient(135deg, #b9bec6, #8d939c 35%, #d5d9de 70%, #8d939c)',
  face: '#eef0f2',
  art: 'radial-gradient(ellipse at center, #f3f4f6 0%, #c7ccd3 100%)',
  text: '#4b5563',
  halo: null,
};

const SECRET: Frame = {
  border: 'linear-gradient(135deg, #3a4650, #1b2a33 35%, #55636e 70%, #1b2a33)',
  face: '#dfe4e8',
  art: 'radial-gradient(ellipse at center, #34444f 0%, #101a21 100%)',
  text: '#2A3C45',
  halo: null,
};

function Lock({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f5cf5a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 min-h-[44px] rounded-xl text-[12px] font-black tracking-wide transition-colors ${
        active ? 'bg-chess-text text-white' : 'bg-white border border-chess-text/15 text-chess-text-muted'
      }`}
    >
      {children}
    </button>
  );
}

function StatsStrip({ profile, earned, total }: { profile: PlayerProfile; earned: number; total: number }) {
  const c = profile.counters;
  const items: { label: string; value: number }[] = [
    { label: 'Kings taken', value: cnt(c, 'cap.king') },
    { label: 'Pieces', value: cnt(c, 'cap.total') },
    { label: 'Runs done', value: cnt(c, 'runs.completed') },
    { label: 'Casts', value: cnt(c, 'ability.used') },
  ];
  const bests = DIFFICULTY_ORDER.filter((d) => profile.bestByDifficulty[d]);
  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
  return (
    <div className="rounded-2xl p-[3px]" style={{ background: GOLD.border }}>
      <div className="bg-white rounded-[13px] p-3 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[9px] uppercase tracking-[0.2em] font-black text-chess-text-muted">
              Collection
            </div>
            <div className="text-2xl font-black tabular-nums leading-none mt-0.5">
              {earned}
              <span className="text-chess-text-faint text-base"> / {total}</span>
            </div>
          </div>
          <div className="text-[11px] font-black text-amber-700 tabular-nums">{pct}%</div>
        </div>
        <div className="h-2 rounded-full bg-chess-text/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #d49a2a, #ffd87a)' }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-chess-text/10">
          {items.map((it) => (
            <div key={it.label} className="text-center">
              <div className="text-lg font-black tabular-nums leading-none">{it.value}</div>
              <div className="text-[9px] uppercase tracking-[0.12em] font-black text-chess-text-muted mt-1">
                {it.label}
              </div>
            </div>
          ))}
        </div>
        {bests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-chess-text/10">
            {bests.map((d) => {
              const b = profile.bestByDifficulty[d]!;
              return (
                <span key={d} className="text-[10px] font-black px-2 py-1 rounded-full bg-chess-page text-chess-text">
                  {DIFFICULTIES[d].name} · best {b.levels} lvls
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TrophyCard({ a, profile }: { a: AchievementDef; profile: PlayerProfile }) {
  const earned = Boolean(profile.achievements[a.id]);
  const hidden = Boolean(a.secret) && !earned;
  const prog = !earned && !hidden && a.progress ? a.progress(profile.counters) : null;
  const unlockId = a.unlocks && ABILITY_DEFS[a.unlocks as AbilityId] ? (a.unlocks as AbilityId) : null;
  const unlockDef = unlockId ? ABILITY_DEFS[unlockId] : null;
  const frame = earned ? GOLD : hidden ? SECRET : LOCKED;

  return (
    <li
      className="rounded-2xl p-[3px] flex flex-col"
      style={{ background: frame.border, boxShadow: frame.halo ?? undefined }}
    >
      <div
        className="rounded-[13px] p-1.5 flex flex-col gap-1.5 flex-1"
        style={{ background: frame.face, color: frame.text }}
      >
        {/* Art window */}
        <div
          className="relative aspect-[5/4] rounded-lg overflow-hidden flex items-center justify-center"
          style={{ background: frame.art }}
        >
          {unlockId && !hidden ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/abilities/${artFile(unlockId)}`}
              alt=""
              loading="lazy"
              className={`w-full h-full object-cover ${earned ? '' : 'grayscale opacity-50'}`}
            />
          ) : hidden ? (
            <span className="text-3xl font-black text-white/70 tracking-widest select-none">???</span>
          ) : (
            <TrophyGlyph size={52} color={earned ? '#8a5a0a' : '#94a3b8'} />
          )}

          {earned && (
            <span
              className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-[#2A3C45] flex items-center justify-center"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.35)' }}
            >
              <TrophyGlyph size={14} />
            </span>
          )}
          {!earned && (
            <span className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
              <Lock size={12} />
            </span>
          )}
          {unlockDef && !hidden && (
            <span
              className="absolute bottom-1.5 right-1.5 max-w-[calc(100%-12px)] truncate text-[8.5px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(42,60,69,0.85)', color: '#f5cf5a' }}
            >
              {earned ? 'Unlocked' : 'Unlocks'} {unlockDef.name}
            </span>
          )}
        </div>

        {/* Text box */}
        <div className="px-0.5 pb-0.5 flex flex-col gap-0.5 flex-1">
          <div className="text-[12px] font-black leading-tight">{hidden ? 'Secret trophy' : a.name}</div>
          <div className="text-[10px] leading-snug opacity-80 line-clamp-3">
            {earned ? a.blurb : hidden ? 'You will know when you get it.' : a.hint}
          </div>
          {prog && prog[1] > 1 && (
            <div className="mt-auto pt-1 flex items-center gap-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-black/10 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((prog[0] / prog[1]) * 100)}%`,
                    background: 'linear-gradient(90deg, #d49a2a, #ffd87a)',
                  }}
                />
              </div>
              <span className="text-[9px] font-black tabular-nums opacity-70">
                {prog[0]}/{prog[1]}
              </span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function AbilityTile({ id, unlocked }: { id: AbilityId; unlocked: boolean }) {
  const def = ABILITY_DEFS[id];
  const via = abilityUnlockedBy(id);
  const frame = unlocked ? GOLD : LOCKED;
  return (
    <li
      className="rounded-2xl p-[3px] flex flex-col"
      style={{ background: frame.border, boxShadow: frame.halo ?? undefined }}
    >
      <div
        className="rounded-[13px] p-1 flex flex-col gap-1 flex-1"
        style={{ background: frame.face, color: frame.text }}
      >
        <div className="relative aspect-square rounded-lg overflow-hidden bg-[#1b2a33]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/abilities/${artFile(id)}`}
            alt=""
            className={`w-full h-full object-cover ${unlocked ? '' : 'grayscale opacity-40'}`}
            loading="lazy"
          />
          {!unlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                <Lock size={12} />
              </span>
            </div>
          )}
        </div>
        <div className="px-0.5 pb-0.5">
          <div className="text-[11px] font-black leading-tight">{def.name}</div>
          <div className="text-[9.5px] leading-snug opacity-80 mt-0.5 line-clamp-2">
            {unlocked ? def.typeLine : via ? `Trophy: ${via.name}` : 'Starter'}
          </div>
        </div>
      </div>
    </li>
  );
}
