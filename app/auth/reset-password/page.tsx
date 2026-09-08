'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics/posthog';
import {
  AuthLoading,
  AuthShell,
  ErrorBanner,
  Field,
  INPUT_CLASS,
  INPUT_STYLE,
  PasswordInput,
  PrimaryButton,
} from '@/components/auth/AuthShell';

/**
 * Set a new password for an already-authenticated session (a signed-in
 * player changing their password, or a recovery session that arrived some
 * other way). The main reset path is the code flow on /auth/forgot-password.
 */
function ResetPasswordContent() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    trackEvent('password_reset_completed', { version: 'v2' });
    router.push('/auth/login?reset=success');
  };

  return (
    <AuthShell title="Set new password" subtitle="Choose a strong password for your account">
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Field id="password" label="New password">
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            show={showPassword}
            onToggle={() => setShowPassword((s) => !s)}
            placeholder="6+ characters"
            autoComplete="new-password"
            disabled={loading}
          />
        </Field>

        <Field id="confirm-password" label="Confirm password">
          <input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={loading}
            minLength={6}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
            placeholder="Same password again"
          />
        </Field>

        <PrimaryButton loading={loading}>{loading ? 'Updating...' : 'Update password'}</PrimaryButton>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
