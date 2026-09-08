'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AuthEvents, identifyUser } from '@/lib/analytics/posthog';
import { humanizeAuthError } from '@/lib/auth-utils';
import {
  AuthLoading,
  AuthShell,
  ErrorBanner,
  Field,
  GOLD,
  INPUT_CLASS,
  INPUT_STYLE,
  PasswordInput,
  PrimaryButton,
  SuccessBanner,
  safeRedirect,
} from '@/components/auth/AuthShell';

/**
 * Email + password sign-in. Ported from Chess Path's /auth/login with the
 * Google / Apple buttons removed — the same Supabase project, so an account
 * made on chesspath.app signs in here (email accounts; OAuth-only accounts
 * are told to use a password reset to set one).
 */
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get('redirect'));
  const resetSuccess = searchParams.get('reset') === 'success';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetBanner, setShowResetBanner] = useState(resetSuccess);

  useEffect(() => {
    AuthEvents.loginPageViewed();
  }, []);

  useEffect(() => {
    if (!showResetBanner) return;
    const timer = setTimeout(() => setShowResetBanner(false), 5000);
    return () => clearTimeout(timer);
  }, [showResetBanner]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      AuthEvents.loginFailed(error.message);
      setError(humanizeAuthError(error.message));
      setLoading(false);
      return;
    }

    if (data.user) identifyUser(data.user.id, { email: data.user.email });
    AuthEvents.loginCompleted();

    router.push(redirectTo);
    router.refresh();
  };

  const signupHref = redirectTo === '/' ? '/auth/signup' : `/auth/signup?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to keep your trophies and streak"
      footer={
        <>
          New here?{' '}
          <Link href={signupHref} className="font-black hover:underline" style={{ color: GOLD }}>
            Create an account
          </Link>
        </>
      }
    >
      {showResetBanner && <SuccessBanner>Password updated. Sign in with your new password.</SuccessBanner>}
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <form onSubmit={handleLogin} className="space-y-3">
        <Field id="email" label="Email">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
            placeholder="you@example.com"
          />
        </Field>

        <Field id="password" label="Password">
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            show={showPassword}
            onToggle={() => setShowPassword((s) => !s)}
            placeholder="Your password"
            autoComplete="current-password"
            disabled={loading}
          />
        </Field>

        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className="text-sm font-bold text-chess-text-muted hover:text-white min-h-[44px] flex items-center">
            Forgot password?
          </Link>
        </div>

        <PrimaryButton loading={loading}>{loading ? 'Signing in...' : 'Sign in'}</PrimaryButton>
      </form>

      <p className="text-center text-chess-text-faint text-xs pt-4">
        Same account as Chess Path and Chess Boxing. Signed up with Google or Apple there? Use Forgot password to set a password first.
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <LoginContent />
    </Suspense>
  );
}
