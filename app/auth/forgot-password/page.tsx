'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { withClick } from '@/lib/sounds';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics/posthog';
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
} from '@/components/auth/AuthShell';

/**
 * Password reset — CODE flow, not link flow. Ported from Chess Path.
 *
 * The reset email carries a 6-digit code ({{ .Token }} in the Supabase
 * template); the user types it here with their new password and everything
 * completes in THIS browser/webview via verifyOtp. No email link, so nothing
 * can open in the wrong browser — the failure mode that killed link-based
 * resets inside the iOS shells (PKCE verifier lives where the flow started).
 */
function ForgotPasswordContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [resent, setResent] = useState(false);

  const sendCode = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return error;
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const error = await sendCode();
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    trackEvent('password_reset_requested', { version: 'v3-code' });
    setStep('code');
    setLoading(false);
  };

  const handleResend = async () => {
    setError(null);
    setResent(false);
    const error = await sendCode();
    if (error) {
      setError(error.message);
      return;
    }
    setResent(true);
  };

  const handleReset = async (e: React.FormEvent) => {
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

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'recovery',
    });

    if (verifyError) {
      const m = verifyError.message.toLowerCase();
      setError(
        m.includes('expired') || m.includes('invalid')
          ? 'That code is wrong or expired. Check the email or resend a new code.'
          : verifyError.message
      );
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    trackEvent('password_reset_completed', { version: 'v3-code' });
    router.push('/auth/login?reset=success');
  };

  const footer = (
    <Link href="/auth/login" className="font-black hover:underline" style={{ color: GOLD }}>
      Back to sign in
    </Link>
  );

  if (step === 'email') {
    return (
      <AuthShell title="Reset your password" subtitle="Enter your email and we will send you a reset code" footer={footer}>
        {error && <ErrorBanner>{error}</ErrorBanner>}
        <form onSubmit={handleSendEmail} className="space-y-3">
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
          <PrimaryButton loading={loading}>{loading ? 'Sending...' : 'Send reset code'}</PrimaryButton>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Enter your code" footer={footer}>
      <p className="text-chess-text-muted text-sm text-center mb-4">
        We emailed a 6-digit code to <span className="font-black text-white">{email}</span>
      </p>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {resent && !error && <SuccessBanner>New code sent. Check your email.</SuccessBanner>}

      <form onSubmit={handleReset} className="space-y-3">
        <Field id="code" label="Reset code">
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            disabled={loading}
            className={`${INPUT_CLASS} text-center text-2xl font-black tracking-[0.3em]`}
            style={INPUT_STYLE}
            placeholder="000000"
            maxLength={10}
          />
        </Field>

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

        <Field id="confirmPassword" label="Confirm new password">
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            disabled={loading}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
            placeholder="Same password again"
          />
        </Field>

        <PrimaryButton loading={loading}>{loading ? 'Resetting...' : 'Set new password'}</PrimaryButton>
      </form>

      <div className="flex items-center justify-between pt-3">
        <button
          type="button"
          onClick={withClick(() => { setStep('email'); setError(null); setResent(false); })}
          className="text-chess-text-muted text-sm font-bold hover:text-white transition-colors min-h-[44px]"
        >
          Change email
        </button>
        <button
          type="button"
          onClick={withClick(handleResend)}
          className="text-sm font-black hover:underline min-h-[44px]"
          style={{ color: GOLD }}
        >
          Resend code
        </button>
      </div>
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
