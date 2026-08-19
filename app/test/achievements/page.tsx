'use client';

import { useMemo, useState } from 'react';
import { ACHIEVEMENTS, ACHIEVEMENT_GROUPS, type AchievementDef } from '@/lib/run/achievements';
import AchievementPop, { PopTile, type PopItem } from '@/components/achievements/AchievementPop';
import { playRunFx, popSizeFor, toRunPopItem } from '@/components/achievements/RunAchievementPop';

/**
 * /test/achievements — preview the shared achievement pop-up (same component
 * as Chess Boxing) against the real Rookie's Revenge catalog. Tap any trophy
 * to play it; "Play a stack" queues a mixed set to see the small→big order.
 */
export default function AchievementPopTestPage() {
  const [playing, setPlaying] = useState<PopItem[] | null>(null);
  const [seq, setSeq] = useState(0);
  const byGroup = useMemo(
    () => ACHIEVEMENT_GROUPS.map((g) => ({ ...g, list: ACHIEVEMENTS.filter((a) => a.group === g.id) })),
    [],
  );
  const play = (items: PopItem[]) => {
    setSeq((n) => n + 1);
    setPlaying(items);
  };
  const pick = (id: string) => ACHIEVEMENTS.find((a) => a.id === id) as AchievementDef;

  return (
    <main className="h-full overflow-auto bg-chess-page text-chess-text">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 pb-24">
        <h1 className="text-2xl font-black">Achievement pop-ups</h1>
        <p className="text-sm text-chess-text-muted mt-1">
          Shared <code>AchievementPop</code> — identical to Chess Boxing. Tap a trophy to play it.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="rounded-xl bg-chess-surface border border-slate-200 px-3 py-2 text-sm font-bold shadow-sm"
            onClick={() => play(['first-blood', 'sore-winner', 'streak-3', 'revenge-served'].map((id) => toRunPopItem(pick(id))))}
          >
            Play a stack (s → m → l)
          </button>
          <button
            className="rounded-xl bg-chess-surface border border-slate-200 px-3 py-2 text-sm font-bold shadow-sm"
            onClick={() => play(ACHIEVEMENTS.filter((a) => a.group === 'fails').slice(0, 1).map(toRunPopItem))}
          >
            Play a roast
          </button>
          <button
            className="rounded-xl bg-chess-surface border border-slate-200 px-3 py-2 text-sm font-bold shadow-sm"
            onClick={() => play(ACHIEVEMENTS.slice(0, 6).map(toRunPopItem))}
          >
            Overflow (6 queued, 3 play)
          </button>
        </div>

        {byGroup.map((g) => (
          <section key={g.id} className="mt-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-chess-text-muted">{g.label}</h2>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {g.list.map((a) => {
                const item = toRunPopItem(a);
                return (
                  <button
                    key={a.id}
                    onClick={() => play([item])}
                    className="rounded-2xl bg-chess-surface border border-slate-200 p-3 text-left flex items-center gap-3 shadow-sm active:scale-[0.98]"
                  >
                    <PopTile icon={item.icon} accent={item.accent} size={40} shimmer={item.shimmer} />
                    <div className="min-w-0">
                      <div className="text-[10px] font-black uppercase" style={{ color: item.accent.text }}>
                        size {popSizeFor(a)}{a.unlocks ? ' · ability' : ''}{a.secret ? ' · secret' : ''}
                      </div>
                      <div className="text-sm font-black truncate">{a.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {playing && (
        <AchievementPop
          key={seq}
          items={playing}
          fx={{ onShow: playRunFx }}
          onDone={() => setPlaying(null)}
          toastEdge="top"
          zIndex={60}
          overflowLabel={(n) => `+${n} more in the Trophy Room`}
        />
      )}
    </main>
  );
}
