'use client';

/**
 * /admin/content — client half. Renders the snapshot built on the server and
 * posts approve / retire / reopen / add to /api/admin/content, then
 * router.refresh() so the server re-reads pipeline.json.
 */

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import type { AbilityView, ArtAsset, ContentSnapshot, RunView, SoundAsset } from '@/lib/admin/content-data';
import type { ContentItem, ContentStage } from '@/lib/content/pipeline';

import { MiniBoard } from './MiniBoard';

type Stage = ContentStage | 'unregistered';

const STAGE_STYLE: Record<Stage, string> = {
  idea: 'bg-slate-100 text-slate-700 border-slate-200',
  built: 'bg-violet-50 text-violet-700 border-violet-200',
  testing: 'bg-amber-50 text-amber-800 border-amber-200',
  approved: 'bg-sky-50 text-sky-800 border-sky-200',
  live: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  retired: 'bg-rose-50 text-rose-700 border-rose-200',
  unregistered: 'bg-slate-50 text-slate-500 border-dashed border-slate-300',
};

function StageBadge({ stage }: { stage: Stage }): React.ReactElement {
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STAGE_STYLE[stage]}`}>
      {stage === 'unregistered' ? 'not in registry' : stage}
    </span>
  );
}

function Verdict({ item }: { item: ContentItem | null }): React.ReactElement | null {
  const t = item?.testing;
  if (!t) return null;
  const ready = t.verdict === 'READY';
  return (
    <div className={`rounded-md border px-2.5 py-1.5 text-xs ${ready ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
      <span className="font-bold">{t.verdict}</span>
      <span className="text-slate-500"> · {t.lastRun}</span>
      <div className="mt-0.5 leading-snug">{t.summary}</div>
    </div>
  );
}

function kb(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Actions

type Action = 'approve' | 'retire' | 'reopen';

interface ActionProps {
  id: string;
  stage: Stage;
  writable: boolean;
  writeHint: string;
  onAction: (action: Action, id: string, why?: string) => Promise<string | null>;
}

const BTN = 'rounded-md border px-2.5 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40';

function ActionBar({ id, stage, writable, writeHint, onAction }: ActionProps): React.ReactElement {
  const [retiring, setRetiring] = useState(false);
  const [why, setWhy] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canApprove = stage === 'testing' || stage === 'built';
  const canRetire = stage !== 'retired' && stage !== 'unregistered';
  const canReopen = stage === 'retired' || stage === 'approved' || stage === 'live';
  const tip = writable ? undefined : writeHint;

  const run = async (action: Action, reason?: string): Promise<void> => {
    setBusy(true);
    setError(null);
    const err = await onAction(action, id, reason);
    setBusy(false);
    if (err) setError(err);
    else {
      setRetiring(false);
      setWhy('');
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          className={`${BTN} border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700`}
          disabled={!writable || !canApprove || busy}
          title={tip ?? (canApprove ? 'testing/built → approved (player-facing on next build)' : 'Only testing or built content can be approved')}
          onClick={() => void run('approve')}
        >
          Approve
        </button>
        <button
          type="button"
          className={`${BTN} border-rose-300 bg-white text-rose-700 hover:bg-rose-50`}
          disabled={!writable || !canRetire || busy}
          title={tip ?? 'Retire with a one-line why'}
          onClick={() => setRetiring((v) => !v)}
        >
          Retire
        </button>
        <button
          type="button"
          className={`${BTN} border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}
          disabled={!writable || !canReopen || busy}
          title={tip ?? (canReopen ? 'Back to testing (drops the sign-off)' : 'Only retired, approved or live content can be reopened')}
          onClick={() => void run('reopen')}
        >
          Reopen
        </button>
      </div>
      {retiring && (
        <form
          className="flex gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (why.trim()) void run('retire', why.trim());
          }}
        >
          <input
            autoFocus
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="Why retire it? (one line)"
            className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-rose-400 focus:outline-none"
          />
          <button type="submit" disabled={!why.trim() || busy} className={`${BTN} border-rose-600 bg-rose-600 text-white hover:bg-rose-700`}>
            Confirm
          </button>
          <button type="button" onClick={() => setRetiring(false)} className={`${BTN} border-slate-200 bg-white text-slate-500`}>
            Cancel
          </button>
        </form>
      )}
      {error && <div className="text-xs font-medium text-rose-700">{error}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Abilities

function AbilityCardAdmin({ a, act }: { a: AbilityView; act: Omit<ActionProps, 'id' | 'stage'> }): React.ReactElement {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          {a.artFile ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/abilities/${a.artFile}`} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase text-slate-400">
              {a.hasCode ? 'no art' : 'idea'}
            </div>
          )}
          {a.artPlaceholder && (
            <span className="absolute bottom-0 left-0 right-0 bg-amber-500/90 px-1 text-center text-[9px] font-bold uppercase text-white">placeholder</span>
          )}
          {a.hasCode && !a.artFile && (
            <span className="absolute bottom-0 left-0 right-0 bg-rose-500/90 px-1 text-center text-[9px] font-bold uppercase text-white">no art</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-bold text-slate-900">{a.name}</span>
            <StageBadge stage={a.stage} />
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-slate-500">
            {a.id}
            {a.typeLine && <span className="text-slate-400"> · {a.typeLine}</span>}
          </div>
          <div className="mt-1 text-xs leading-snug text-slate-700">{a.description}</div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {a.inStarterKit && <Chip tone="sky">starter kit</Chip>}
            {a.unlockedBy && <Chip tone="violet" title={a.unlockedBy.id}>unlock: {a.unlockedBy.name}</Chip>}
            {!a.inStarterKit && !a.unlockedBy && a.hasCode && <Chip tone="slate">offer pool only</Chip>}
            {!a.hasCode && <Chip tone="slate">no code yet</Chip>}
          </div>
        </div>
      </div>

      {a.bot && (
        <div className="rounded-md bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700">
          <span className="font-bold">Bot tier {a.bot.tier}</span> · {a.bot.avgWin} win · {a.bot.lift} lift · worst {a.bot.worst} · cast {a.bot.castRate}
          <span className="text-slate-400"> ({a.bot.runId})</span>
        </div>
      )}
      <Verdict item={a.item} />
      {a.item?.retired && (
        <div className="text-xs text-rose-700">
          Retired {a.item.retired.at}: {a.item.retired.why}
        </div>
      )}
      {a.item?.notes && a.stage !== 'live' && <div className="text-xs leading-snug text-slate-500">{a.item.notes}</div>}

      {a.tiers.length > 0 && (
        <div>
          <button type="button" onClick={() => setOpen((v) => !v)} className="text-xs font-semibold text-sky-700 hover:underline">
            {open ? 'Hide tiers' : 'Tiers T1–T5'}
          </button>
          {open && (
            <table className="mt-1 w-full text-[11px]">
              <tbody>
                {a.tiers.map((t) => (
                  <tr key={t.tier} className="border-t border-slate-100 align-top">
                    <td className="py-1 pr-2 font-bold text-slate-500">T{t.tier}</td>
                    <td className="py-1 text-slate-800">
                      {t.what}
                      {t.limit && <span className="text-slate-400"> · {t.limit}</span>}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-slate-100">
                  <td className="py-1 pr-2 font-bold text-slate-500">How</td>
                  <td className="py-1 text-slate-600">{a.tiers[0].how}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2">
        <ActionBar id={a.id} stage={a.stage} {...act} />
        {a.playUrl && (
          <a href={a.playUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sky-700 hover:underline">
            Play it (T5) →
          </a>
        )}
      </div>
    </div>
  );
}

function Chip({ children, tone, title }: { children: React.ReactNode; tone: 'sky' | 'violet' | 'slate'; title?: string }): React.ReactElement {
  const cls = { sky: 'bg-sky-50 text-sky-800', violet: 'bg-violet-50 text-violet-800', slate: 'bg-slate-100 text-slate-600' }[tone];
  return (
    <span title={title} className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Runs

function RunBlock({ r, act }: { r: RunView; act: Omit<ActionProps, 'id' | 'stage'> }): React.ReactElement {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-slate-900">{r.name}</span>
            <StageBadge stage={r.stage} />
            <span className="font-mono text-[11px] text-slate-500">{r.id}</span>
            <a href={r.playUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sky-700 hover:underline">
              Play run →
            </a>
          </div>
          <div className="mt-0.5 text-sm text-slate-600">{r.blurb}</div>
          {!r.hasCode && <div className="mt-1 text-xs text-rose-700">No RunDef in lib/run/runs.ts for this id.</div>}
        </div>
        <ActionBar id={r.id} stage={r.stage} {...act} />
      </div>

      <div className="mt-3 max-w-2xl">
        <Verdict item={r.item} />
        {!r.item?.testing && r.digestVerdict && <div className="text-xs text-slate-600">Digest: {r.digestVerdict}</div>}
      </div>

      {r.levels.length > 0 && (
        <div className="mt-3 overflow-x-auto pb-1">
          <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
            {r.levels.map((l) => (
              <a key={l.level} href={l.playUrl} target="_blank" rel="noreferrer" className="group block w-[116px] shrink-0">
                <MiniBoard level={l} size={112} />
                <div className="mt-1 truncate text-[11px] font-bold text-slate-800 group-hover:text-sky-700" title={l.theme ?? undefined}>
                  L{l.level}
                  {l.theme && <span className="font-semibold text-slate-600"> {l.theme}</span>}
                </div>
                <div className="text-[10px] text-slate-500">
                  {l.moveLimit ? `${l.moveLimit} moves` : 'no limit'}
                  {l.winCondition === 'king' ? ` · king${l.kingBehavior === 'flee' ? ' flees' : ''}` : ' · rank 8'}
                  {l.enemiesPerTurn > 1 ? ` · ${l.enemiesPerTurn}/turn` : ''}
                </div>
                {(l.noAbility || l.newPlayer) && (
                  <div className="text-[10px] text-slate-600">
                    {l.noAbility && (
                      <span title="No-ability win %, Normal (last nightly)">
                        none <b>{l.noAbility}</b>
                      </span>
                    )}
                    {l.noAbility && l.newPlayer && ' · '}
                    {l.newPlayer && (
                      <span title="New player (3 starters) clear %, Normal (last nightly)">
                        new <b>{l.newPlayer}</b>
                      </span>
                    )}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Assets

function AssetsSection({ art, sounds, missingArt }: { art: ArtAsset[]; sounds: SoundAsset[]; missingArt: string[] }): React.ReactElement {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(280px,360px)]">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-2.5 text-sm font-bold text-slate-800">
          Ability art <span className="font-normal text-slate-500">public/abilities/*.webp</span>
        </div>
        {missingArt.length > 0 && (
          <div className="border-b border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-800">
            Missing art for built abilities: <b>{missingArt.join(', ')}</b>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-left text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-1.5">Preview</th>
                <th className="py-1.5 pr-3">File</th>
                <th className="py-1.5 pr-3">Ability</th>
                <th className="py-1.5 pr-3">Variant</th>
                <th className="py-1.5 pr-3">Size</th>
                <th className="py-1.5 pr-4">Flags</th>
              </tr>
            </thead>
            <tbody>
              {art.map((f) => (
                <tr key={f.file} className="border-t border-slate-100">
                  <td className="px-4 py-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/abilities/${f.file}`} alt="" className="h-8 w-8 rounded object-cover" loading="lazy" />
                  </td>
                  <td className="py-1 pr-3 font-mono text-[11px] text-slate-700">{f.file}</td>
                  <td className="py-1 pr-3 text-slate-800">{f.abilityId}</td>
                  <td className="py-1 pr-3 text-slate-600">{f.variant}</td>
                  <td className="py-1 pr-3 text-slate-600">{kb(f.bytes)}</td>
                  <td className="py-1 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {f.usedBy && <Chip tone="sky">in use</Chip>}
                      {!f.usedBy && !f.orphan && <Chip tone="slate">unused variant</Chip>}
                      {f.orphan && <Chip tone="slate">orphan (no ability in code)</Chip>}
                      {f.placeholder && <Chip tone="violet">placeholder (hue-shifted)</Chip>}
                      {f.bytes > 60 * 1024 && <Chip tone="violet">over 60 KB</Chip>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-2.5 text-sm font-bold text-slate-800">
          Sounds <span className="font-normal text-slate-500">public/sounds/*.mp3</span>
        </div>
        <ul>
          {sounds.map((s) => (
            <li key={s.file} className="flex items-center gap-2 border-t border-slate-100 px-4 py-1.5 text-xs">
              <audio controls preload="none" src={`/sounds/${s.file}`} className="h-7 w-36 shrink-0" />
              <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-slate-700">{s.file}</span>
              <span className="text-slate-500">{kb(s.bytes)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ideas

function IdeasSection({
  ideas,
  writable,
  writeHint,
  onAdd,
}: {
  ideas: ContentItem[];
  writable: boolean;
  writeHint: string;
  onAdd: (input: { kind: 'ability' | 'run'; id: string; name: string; notes: string }) => Promise<string | null>;
}): React.ReactElement {
  const [kind, setKind] = useState<'ability' | 'run'>('ability');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(280px,380px)]">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-2.5 text-sm font-bold text-slate-800">
          Ideas <span className="font-normal text-slate-500">{ideas.length} in the backlog</span>
        </div>
        {ideas.length === 0 && <div className="px-4 py-3 text-xs text-slate-500">No ideas written down.</div>}
        <ul>
          {ideas.map((i) => (
            <li key={i.id} className="border-t border-slate-100 px-4 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{i.name}</span>
                <span className="font-mono text-[11px] text-slate-500">{i.id}</span>
                <Chip tone="slate">{i.kind}</Chip>
                <span className="text-[11px] text-slate-400">{i.created}</span>
              </div>
              <div className="mt-0.5 text-xs leading-snug text-slate-700">{i.notes}</div>
            </li>
          ))}
        </ul>
      </div>

      <form
        className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          const err = await onAdd({ kind, id: id.trim(), name: name.trim(), notes: notes.trim() });
          setBusy(false);
          if (err) setError(err);
          else {
            setId('');
            setName('');
            setNotes('');
          }
        }}
      >
        <div className="text-sm font-bold text-slate-800">Add an idea</div>
        <div className="flex gap-2">
          <select value={kind} onChange={(e) => setKind(e.target.value as 'ability' | 'run')} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
            <option value="ability">ability</option>
            <option value="run">run</option>
          </select>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="id (kebab-case)"
            pattern="[a-z0-9-]+"
            required
            className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-1 font-mono text-xs"
          />
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className="rounded-md border border-slate-300 px-2 py-1 text-xs" />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes — what it does, why it might be fun"
          rows={3}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={!writable || busy}
          title={writable ? undefined : writeHint}
          className={`${BTN} border-slate-800 bg-slate-800 text-white hover:bg-slate-900`}
        >
          Add to backlog
        </button>
        {error && <div className="text-xs font-medium text-rose-700">{error}</div>}
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page

const STAGE_ORDER: Stage[] = ['testing', 'built', 'approved', 'live', 'idea', 'unregistered', 'retired'];

export function ContentDashboard({ data }: { data: ContentSnapshot }): React.ReactElement {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  const post = async (body: Record<string, unknown>): Promise<string | null> => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; item?: ContentItem | null };
      if (!res.ok || !json.ok) return json.error ?? `HTTP ${res.status}`;
      setToast(`${body.id} → ${json.item?.stage ?? 'saved'}`);
      setTimeout(() => setToast(null), 2500);
      startTransition(() => router.refresh());
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
  };

  const act = {
    writable: data.writable,
    writeHint: data.writeHint,
    onAction: (action: Action, id: string, why?: string) => post({ action, id, why }),
  };

  const abilities = [...data.abilities].sort((a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage) || a.name.localeCompare(b.name));

  return (
    <div className="h-full overflow-auto bg-[#eef6fc] text-slate-900" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        {/* Header strip */}
        <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-xl font-extrabold tracking-tight">Rookie&apos;s Revenge — Content</h1>
            <div className="text-xs text-slate-500">
              registry from {data.registrySource} · last nightly {data.lastNightly ?? 'none'}
              {data.digestPath && (
                <>
                  {' '}
                  · <span className="font-mono">{data.digestPath}</span>
                </>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['idea', 'built', 'testing', 'approved', 'live', 'retired'] as ContentStage[]).map((s) => (
              <a key={s} href={`#${s === 'idea' ? 'ideas' : 'abilities'}`} className={`rounded-lg border px-3 py-1.5 ${STAGE_STYLE[s]}`}>
                <div className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{s}</div>
                <div className="text-lg font-extrabold leading-tight">{data.counts[s]}</div>
              </a>
            ))}
            <div className={`rounded-lg border px-3 py-1.5 ${data.waitingOnYou ? 'border-amber-300 bg-amber-100 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
              <div className="text-[10px] font-semibold uppercase tracking-wide opacity-80">waiting on you</div>
              <div className="text-lg font-extrabold leading-tight">{data.waitingOnYou}</div>
            </div>
          </div>
          <div className={`mt-3 text-xs ${data.writable ? 'text-slate-500' : 'font-medium text-amber-800'}`}>{data.writeHint}</div>
          <nav className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-sky-700">
            <a href="#abilities" className="hover:underline">Abilities</a>
            <a href="#runs" className="hover:underline">Runs</a>
            <a href="#assets" className="hover:underline">Assets</a>
            <a href="#ideas" className="hover:underline">Ideas</a>
          </nav>
        </header>

        <section id="abilities" className="mt-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">Abilities · {data.abilities.length}</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {abilities.map((a) => (
              <AbilityCardAdmin key={a.id} a={a} act={act} />
            ))}
          </div>
        </section>

        <section id="runs" className="mt-8">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">
            Runs · {data.runs.length}
            <span className="ml-2 font-normal normal-case tracking-normal text-slate-500">
              Board: black pieces, red king, blue rook = Rookie&apos;s designed start (file is randomised in play), amber = king pen, dark = wall.
            </span>
          </h2>
          <div className="flex flex-col gap-4">
            {data.runs.map((r) => (
              <RunBlock key={r.id} r={r} act={act} />
            ))}
          </div>
        </section>

        <section id="assets" className="mt-8">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">Assets</h2>
          <AssetsSection art={data.art} sounds={data.sounds} missingArt={data.missingArt} />
        </section>

        <section id="ideas" className="mt-8 pb-10">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">Ideas backlog</h2>
          <IdeasSection
            ideas={data.ideas}
            writable={data.writable}
            writeHint={data.writeHint}
            onAdd={(input) => post({ action: 'add', ...input })}
          />
        </section>
      </div>

      {toast && (
        <div className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
