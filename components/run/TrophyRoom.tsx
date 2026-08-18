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
 * Full-screen progression sheet: every trophy (earned / locked with hint /
 * secret) and every ability (unlocked / how to unlock it). Read-only.
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
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-chess-text flex items-center justify-center shrink-0">
            <TrophyGlyph size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] uppercase tracking-[0.2em] font-black text-chess-text-muted">
              Rookie&apos;s Revenge
            </div>
            <div className="text-base font-black leading-tight">Trophy Room</div>
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
      <div className="flex-1 overflow-auto px-4 pb-8">
        <div className="max-w-md md:max-w-lg mx-auto w-full flex flex-col gap-4">
          {tab === 'trophies' ? (
            <>
              <StatsStrip profile={profile} />
              {ACHIEVEMENT_GROUPS.map((g) => {
                const list = ACHIEVEMENTS.filter((a) => a.group === g.id);
                const done = list.filter((a) => profile.achievements[a.id]).length;
                return (
                  <section key={g.id} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-[11px] uppercase tracking-[0.18em] font-black text-chess-text-muted">
                        {g.label}
                      </h3>
                      <span className="text-[11px] font-black text-chess-text-faint tabular-nums">
                        {done}/{list.length}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {list.map((a) => (
                        <TrophyRow key={a.id} a={a} profile={profile} />
                      ))}
                    </ul>
                  </section>
                );
              })}
            </>
          ) : (
            <>
              <p className="text-[12px] text-chess-text-muted leading-snug">
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

          {onReplayTutorial && (
            <button
              type="button"
              onClick={onReplayTutorial}
              className="mt-2 w-full py-3 rounded-2xl bg-white border border-chess-text/15 text-chess-text font-black text-[13px] tracking-wide active:translate-y-px transition-transform"
            >
              Replay the tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 min-h-[40px] rounded-xl text-[12px] font-black tracking-wide transition-colors ${
        active ? 'bg-chess-text text-white' : 'bg-white border border-chess-text/15 text-chess-text-muted'
      }`}
    >
      {children}
    </button>
  );
}

function StatsStrip({ profile }: { profile: PlayerProfile }) {
  const c = profile.counters;
  const items: { label: string; value: number }[] = [
    { label: 'Kings taken', value: cnt(c, 'cap.king') },
    { label: 'Pieces', value: cnt(c, 'cap.total') },
    { label: 'Runs done', value: cnt(c, 'runs.completed') },
    { label: 'Casts', value: cnt(c, 'ability.used') },
  ];
  const bests = DIFFICULTY_ORDER.filter((d) => profile.bestByDifficulty[d]);
  return (
    <div className="bg-white rounded-2xl border border-chess-text/10 p-3 flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-2">
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
  );
}

function TrophyRow({ a, profile }: { a: AchievementDef; profile: PlayerProfile }) {
  const earned = profile.achievements[a.id];
  const prog = !earned && a.progress ? a.progress(profile.counters) : null;
  const hidden = a.secret && !earned;
  return (
    <li
      className={`rounded-xl border px-3 py-2 flex items-center gap-3 ${
        earned
          ? 'bg-white border-amber-300/70'
          : 'bg-white/60 border-chess-text/10'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          earned ? 'bg-[#2A3C45]' : 'bg-chess-text/10'
        }`}
      >
        <TrophyGlyph size={18} color={earned ? '#f5cf5a' : '#94a3b8'} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`text-[13px] font-black leading-tight truncate ${earned ? 'text-chess-text' : 'text-chess-text-muted'}`}>
            {hidden ? '???' : a.name}
          </span>
          {a.unlocks && ABILITY_DEFS[a.unlocks as AbilityId] && (
            <span className="text-[9px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
              {ABILITY_DEFS[a.unlocks as AbilityId].name}
            </span>
          )}
        </div>
        <div className="text-[11px] leading-snug text-chess-text-muted">
          {earned ? a.blurb : hidden ? 'Secret. You will know.' : a.hint}
        </div>
        {prog && prog[1] > 1 && (
          <div className="mt-1 h-1.5 rounded-full bg-chess-text/10 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${Math.round((prog[0] / prog[1]) * 100)}%` }}
            />
          </div>
        )}
      </div>
      {prog && prog[1] > 1 && (
        <span className="text-[10px] font-black tabular-nums text-chess-text-faint shrink-0">
          {prog[0]}/{prog[1]}
        </span>
      )}
    </li>
  );
}

function AbilityTile({ id, unlocked }: { id: AbilityId; unlocked: boolean }) {
  const def = ABILITY_DEFS[id];
  const via = abilityUnlockedBy(id);
  return (
    <li
      className={`rounded-xl overflow-hidden border flex flex-col ${
        unlocked ? 'bg-white border-chess-text/15' : 'bg-white/60 border-chess-text/10'
      }`}
    >
      <div className="relative aspect-square bg-[#1b2a33]">
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f5cf5a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </span>
          </div>
        )}
      </div>
      <div className="px-2 py-1.5">
        <div className={`text-[11px] font-black leading-tight ${unlocked ? 'text-chess-text' : 'text-chess-text-muted'}`}>
          {def.name}
        </div>
        <div className="text-[9.5px] leading-snug text-chess-text-muted mt-0.5 line-clamp-2">
          {unlocked ? def.typeLine : via ? `Trophy: ${via.name}` : 'Starter'}
        </div>
      </div>
    </li>
  );
}
