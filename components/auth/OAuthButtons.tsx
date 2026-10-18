'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthEvents } from '@/lib/analytics/posthog';
import { humanizeAuthError } from '@/lib/auth-utils';
import { hideAppleOAuth, isInAppWebview } from '@/lib/auth/webview';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { clickSfx } from '@/lib/sounds';

/**
 * "Continue with Google / Apple" for /auth/login and /auth/signup — the same
 * Supabase OAuth flow as chess-learning-tree's login page: signInWithOAuth
 * with redirectTo = <origin>/auth/callback?next=<redirect>, and the server
 * route app/auth/callback/route.ts exchanges the PKCE code for the session
 * cookies. Same Supabase project, so a Google/Apple account made on
 * chesspath.app is the SAME account here.
 *
 * Hidden where OAuth can't complete (lib/auth/webview.ts): the iOS app (email
 * only, exactly like chess-learning-tree's iOS apps), social in-app browsers,
 * and Apple on Android. Only rendered when ACCOUNTS is on. Resolved in an
 * effect so server and client markup agree.
 *
 * Supabase must list https://run.chesspath.app/auth/callback (and the dev
 * origin) under Auth -> URL Configuration -> Redirect URLs, or the provider
 * bounces back to the Site URL instead.
 */
export function OAuthButtons({ redirectTo, onError }: { redirectTo: string; onError: (msg: string) => void }) {
  const [where, setWhere] = useState<{ google: boolean; apple: boolean } | null>(null);
  const [busy, setBusy] = useState<'google' | 'apple' | null>(null);

  useEffect(() => {
    setWhere({ google: !isInAppWebview(), apple: !hideAppleOAuth() });
  }, []);

  if (!FEATURE_FLAGS.ACCOUNTS || !where || (!where.google && !where.apple)) return null;

  const go = async (provider: 'google' | 'apple') => {
    clickSfx();
    setBusy(provider);
    try {
      localStorage.setItem('auth_method', provider);
    } catch {
      /* ignore */
    }
    const url = new URL('/auth/callback', window.location.origin);
    if (redirectTo && redirectTo !== '/') url.searchParams.set('next', redirectTo);
    const { error } = await createClient().auth.signInWithOAuth({ provider, options: { redirectTo: url.toString() } });
    if (error) {
      AuthEvents.loginFailed(error.message);
      onError(humanizeAuthError(error.message));
      setBusy(null);
    }
    // Success: the browser is navigating to the provider; keep the spinner.
  };

  const BTN =
    'w-full min-h-[50px] py-3 rounded-[14px] font-black text-[15px] flex items-center justify-center gap-3 active:translate-y-[3px] active:shadow-none transition-transform disabled:opacity-50';

  return (
    <div className="mb-1">
      {where.google && (
        <button
          type="button"
          onClick={() => void go('google')}
          disabled={!!busy}
          className={BTN}
          style={{ background: '#fff', color: '#1f2937', boxShadow: '0 4px 0 #c7cfdc' }}
        >
          {busy === 'google' ? (
            <span className="h-5 w-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          {busy === 'google' ? 'Redirecting...' : 'Continue with Google'}
        </button>
      )}
      {where.apple && (
        <button
          type="button"
          onClick={() => void go('apple')}
          disabled={!!busy}
          className={`${BTN} mt-2`}
          style={{ background: '#000', color: '#fff', boxShadow: '0 4px 0 #3a3a3a' }}
        >
          {busy === 'apple' ? (
            <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          )}
          {busy === 'apple' ? 'Redirecting...' : 'Continue with Apple'}
        </button>
      )}
      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <span className="text-[11px] uppercase tracking-[0.16em] font-black text-chess-text-muted">or</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
      </div>
    </div>
  );
}
