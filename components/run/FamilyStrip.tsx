'use client';

import Link from 'next/link';
import { clickSfx } from '@/lib/sounds';
import { useUser } from '@/hooks/useUser';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { FAMILY_APPS, openFamilyApp, useFamilyStats, type FamilyAppId } from '@/lib/family/client';

/**
 * "Your Chess" strip (plan 1.3) — one row: family streak, Chess Path rating,
 * and a tile for each sibling app. Renders nothing unless FAMILY_STRIP is on.
 * Numbers come from chesspath.app via `useFamilyStats`; when they can't be
 * read (signed out, CORS, offline) the slots show a dash and the tiles still
 * work. Never a banner, never before the first action — it lives in the
 * Arena header where the StreakChip was designed to sit.
 */
export function FamilyStrip() {
  if (!FEATURE_FLAGS.FAMILY_STRIP) return null;
  return <FamilyStripInner />;
}

const TILE_STYLE = {
  background: 'rgba(0,0,0,0.3)',
  border: '1.5px solid rgba(255,255,255,0.12)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
} as const;

function Stat({ label, value, hot }: { label: string; value: string; hot?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg px-2" style={TILE_STYLE}>
      <span className="text-[15px] font-black leading-none tabular-nums" style={{ color: hot ? '#f5cf5a' : '#fff' }}>
        {value}
      </span>
      <span className="text-[8px] font-black uppercase tracking-[0.16em] leading-none mt-1 text-white/60">{label}</span>
    </div>
  );
}

function AppTile({ id }: { id: FamilyAppId }) {
  const app = FAMILY_APPS[id];
  return (
    <a
      href={app.storeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.preventDefault();
        clickSfx();
        openFamilyApp(id);
      }}
      aria-label={`Open ${app.name} on the App Store`}
      className="flex-1 min-w-0 min-h-[44px] rounded-lg px-2 flex flex-col items-center justify-center active:opacity-70"
      style={TILE_STYLE}
    >
      <span className="text-[11px] font-black leading-none truncate max-w-full">{app.name}</span>
      <span className="text-[8px] font-black uppercase tracking-[0.16em] leading-none mt-1 text-white/60">{app.blurb}</span>
    </a>
  );
}

function FamilyStripInner() {
  const { user, loading } = useUser();
  const stats = useFamilyStats(user?.id);

  if (loading) return null;

  const signedOut = !user;
  const streak = stats?.streak;
  const rating = stats?.rating;

  return (
    <div className="flex items-stretch gap-1.5 w-full" data-testid="family-strip">
      <Stat label="Streak" value={streak == null ? '-' : String(streak)} hot={!!stats?.completedToday} />
      <Stat label="Rating" value={rating == null ? '-' : String(rating)} />
      <AppTile id="chesspath" />
      <AppTile id="chessboxing" />
      {signedOut && FEATURE_FLAGS.ACCOUNTS && (
        <Link
          href="/auth/signup?redirect=/"
          onClick={clickSfx}
          className="min-h-[44px] rounded-lg px-2 flex items-center text-[10px] font-black uppercase tracking-wider active:opacity-70"
          style={{ ...TILE_STYLE, color: '#f5cf5a' }}
        >
          Sign in to sync
        </Link>
      )}
    </div>
  );
}
