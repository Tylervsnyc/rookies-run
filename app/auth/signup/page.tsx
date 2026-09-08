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
  GOLD,
  INPUT_CLASS,
  INPUT_STYLE,
  PasswordInput,
  PrimaryButton,
  safeRedirect,
} from '@/components/auth/AuthShell';

/**
 * Email + password signup. Ported from Chess Path's /auth/signup with the
 * OAuth buttons and the Chess Path-only side effects (welcome email,
 * first-touch stamp) removed. The duplicate-email quirk is kept: Supabase
 * returns a FAKE success with an empty identities array when the email
 * already exists, so without that check the player is told "you're in" and
 * then isn't.
 */
function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get('redirect'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    AuthEvents.signupPageViewed();
  }, []);

  // Auto-clear errors (but not duplicate email — the player needs time to find the link)
  useEffect(() => {
    if (!error || isDuplicateEmail) return;
    const timer = setTimeout(() => setError(null), 8000);
    return () => clearTimeout(timer);
  }, [error, isDuplicateEmail]);

  const loginHref = redirectTo === '/' ? '/auth/login' : `/auth/login?redirect=${encodeURIComponent(redirectTo)}`;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsDuplicateEmail(false);
    setLoading(true);
    AuthEvents.signupStarted();

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      AuthEvents.signupFailed(error.message);
      setError(humanizeAuthError(error.message));
      setLoading(false);
      return;
    }

    if (data.user && data.user.identities?.length === 0) {
      AuthEvents.signupFailed('duplicate_email');
      setError('An account with this email already exists.');
      setIsDuplicateEmail(true);
      setLoading(false);
      return;
    }

    if (data.user) identifyUser(data.user.id, { email });
    AuthEvents.signupCompleted('email');

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <AuthShell
      title="Save your revenge"
      subtitle="Trophies, powers and your streak follow you to every device"
      footer={
        <>
          <p>
            Already have an account?{' '}
            <Link href={loginHref} className="font-black hover:underline" style={{ color: GOLD }}>
              Sign in
            </Link>
          </p>
          <p className="text-chess-text-faint text-xs pt-3">
            One account for Chess Path, Chess Boxing and Rookie&rsquo;s Revenge. By signing up you agree to the{' '}
            <a href="https://chesspath.app/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Terms</a>
            {' '}and{' '}
            <a href="https://chesspath.app/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Privacy Policy</a>.
          </p>
        </>
      }
    >
      {error && (
        <ErrorBanner>
          <p>{error}</p>
          {isDuplicateEmail && (
            <Link href={loginHref} className="inline-flex items-center gap-1 mt-2 font-black hover:underline min-h-[44px]" style={{ color: GOLD }}>
              Sign in instead &rarr;
            </Link>
          )}
        </ErrorBanner>
      )}

      <form onSubmit={handleSignup} className="space-y-3">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          autoComplete="email"
          className={INPUT_CLASS}
          style={INPUT_STYLE}
          placeholder="Email address"
          aria-label="Email"
        />

        <PasswordInput
          id="password"
          value={password}
          onChange={setPassword}
          show={showPassword}
          onToggle={() => setShowPassword((s) => !s)}
          placeholder="Password (6+ characters)"
          autoComplete="new-password"
          disabled={loading}
        />

        <PrimaryButton loading={loading}>{loading ? 'Creating account...' : 'Create free account'}</PrimaryButton>
      </form>
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <SignupContent />
    </Suspense>
  );
}
