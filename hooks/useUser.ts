'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createClient, clearAuthTokens } from '@/lib/supabase/client';
import { isPremiumSubscription, type SubscriptionStatus } from '@/lib/subscription';

/**
 * The shared `profiles` row (one Supabase project across the family). Only
 * the columns Revenge reads — the entitlement + identity. No Rookie gauges,
 * no Stripe verification, no display-name migration: those were Chess Path
 * concerns that came across in the extraction and never had an endpoint here.
 */
export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  subscription_status: SubscriptionStatus;
  subscription_expires_at: string | null;
  /** Support-only patron flag — grants NO features, only a gold profile. */
  is_patron?: boolean;
  is_admin?: boolean;
}

const PROFILE_COLUMNS =
  'id, email, display_name, subscription_status, subscription_expires_at, is_patron, is_admin';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef<User | null>(null);
  userRef.current = user;

  const refetchProfile = useCallback(async () => {
    const u = userRef.current;
    if (!u) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('id', u.id)
      .single();
    if (data) setProfile(data as Profile);
  }, []);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    // Fetch profile (don't try to create - that should happen via trigger)
    const fetchProfile = async (userId: string, email: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(PROFILE_COLUMNS)
          .eq('id', userId)
          .single();

        if (!mounted) return;
        if (data) {
          setProfile(data as Profile);
        } else if (error) {
          // No profile found - use defaults until the DB trigger creates one
          setProfile({
            id: userId,
            email,
            display_name: null,
            subscription_status: 'free',
            subscription_expires_at: null,
            is_patron: false,
            is_admin: false,
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    // Use onAuthStateChange for initial session - it fires immediately with current state
    // This is more reliable than getSession() which can hang
    let initialFired = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        // Handle token refresh errors (e.g., "Refresh Token Not Found")
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.warn('Auth: Token refresh failed, clearing stale tokens');
          clearAuthTokens();
          setUser(null);
          setProfile(null);
          if (!initialFired) {
            initialFired = true;
            setLoading(false);
          }
          return;
        }

        const sessionUser = session?.user ?? null;
        setUser(sessionUser);

        // Only set loading false on first event (INITIAL_SESSION or SIGNED_IN)
        if (!initialFired) {
          initialFired = true;
          setLoading(false);
        }

        if (sessionUser) {
          void fetchProfile(sessionUser.id, sessionUser.email || '');
        } else {
          setProfile(null);
        }
      }
    );

    // Fallback timeout - if onAuthStateChange doesn't fire within 3 seconds, continue without auth
    const timeout = setTimeout(() => {
      if (mounted && !initialFired) {
        console.warn('Auth: onAuthStateChange timeout - continuing without auth');
        initialFired = true;
        setLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Always clear state and tokens, even if signOut fails
      clearAuthTokens();
      setUser(null);
      setProfile(null);
    }
  };

  const isPremium = isPremiumSubscription(profile?.subscription_status, profile?.subscription_expires_at);

  return { user, profile, loading, isPremium, signOut, refetchProfile };
}
