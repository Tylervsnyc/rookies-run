'use client';

import { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { startProfileSync, stopProfileSync } from '@/lib/run/profile-sync';

/**
 * Mounts once in the root layout. Watches the auth session and turns the
 * cloud profile sync on/off (lib/run/profile-sync.ts). Renders nothing.
 * Inert unless CLOUD_PROFILE is on — the hook below never runs.
 */
export function ProfileSync() {
  if (!FEATURE_FLAGS.CLOUD_PROFILE) return null;
  return <ProfileSyncInner />;
}

function ProfileSyncInner() {
  const { user, loading } = useUser();
  const userId = user?.id ?? null;

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      stopProfileSync();
      return;
    }
    void startProfileSync(userId);
    return () => stopProfileSync();
  }, [userId, loading]);

  return null;
}
