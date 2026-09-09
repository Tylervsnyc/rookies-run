'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { RevengeMarkSvg } from '@/components/run/RookiesRevengeLogo';
import { REVENGE_RED, REVENGE_RED_DARK } from '@/lib/brand';
import { clickSfx, withClick } from '@/lib/sounds';

/**
 * The frame every /auth/* page sits in — Revenge's navy arena, the reticle
 * mark, one raised card. Ported from Chess Path's auth pages but restyled:
 * dark surface instead of white, red primary instead of green, no gradient
 * top bar. Text is white via `.rr-navy` (app/globals.css).
 */

export const NAVY = '#0f1c3f';
export const NAVY_2 = '#182a5c';
export const SURFACE = '#1c2f63';
export const EDGE = '#3a4f8f';
export const GOLD = '#f5cf5a';

export const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl text-white placeholder-white/35 border-2 focus:outline-none transition-colors disabled:opacity-50 min-h-[48px]';
export const INPUT_STYLE = { background: 'rgba(0,0,0,0.3)', borderColor: EDGE } as const;

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="rr-navy h-full overflow-y-auto flex flex-col items-center px-4 md:px-6" style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 60%)` }}>
      <div className="w-full max-w-md md:max-w-lg flex flex-col" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}>
        <Link href="/" className="flex items-center justify-center gap-2 mb-6 active:opacity-70" aria-label="Back to the Arena">
          <RevengeMarkSvg size={34} />
          <span className="text-[15px] font-black leading-none">
            Rookie&rsquo;s <span style={{ color: '#FF6B66' }}>REVENGE</span>
          </span>
        </Link>

        <div
          className="rounded-2xl p-5"
          style={{
            background: SURFACE,
            border: `2px solid ${EDGE}`,
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -3px 0 rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <h1 className="text-xl font-black text-center mb-1">{title}</h1>
          {subtitle && <p className="text-chess-text-muted text-sm text-center mb-4">{subtitle}</p>}
          {children}
        </div>

        {footer && <div className="pt-4 text-center text-sm text-chess-text-muted">{footer}</div>}
      </div>
    </div>
  );
}

export function PrimaryButton({ children, loading, disabled, type = 'submit' }: { children: ReactNode; loading?: boolean; disabled?: boolean; type?: 'submit' | 'button' }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={clickSfx}
      className="w-full min-h-[52px] py-3 rounded-[14px] font-black text-[16px] text-white flex items-center justify-center gap-2 active:translate-y-[4px] active:shadow-none transition-transform disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0"
      style={{ background: REVENGE_RED, boxShadow: `0 5px 0 ${REVENGE_RED_DARK}`, textShadow: '0 2px 0 rgba(0,0,0,0.45)' }}
    >
      {loading && <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}

export function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl p-3 text-sm mb-3" style={{ background: 'rgba(229,57,53,0.18)', border: '1.5px solid rgba(255,107,102,0.5)', color: '#ffb3b0' }}>
      {children}
    </div>
  );
}

export function SuccessBanner({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl p-3 text-sm mb-3" style={{ background: 'rgba(88,204,2,0.16)', border: '1.5px solid rgba(88,204,2,0.45)', color: '#c8f5a4' }}>
      {children}
    </div>
  );
}

export function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] uppercase tracking-[0.16em] font-black text-chess-text-muted mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Password input with a Show/Hide toggle — the one recipe, used on every page. */
export function PasswordInput({
  id,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  autoComplete,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
  autoComplete: 'current-password' | 'new-password';
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={autoComplete === 'new-password' ? 6 : undefined}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`${INPUT_CLASS} pr-16`}
        style={INPUT_STYLE}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={withClick(onToggle)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-black uppercase tracking-wider text-chess-text-muted hover:text-white transition-colors min-h-[44px] px-1"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

export function AuthLoading() {
  return <div className="h-full" style={{ background: NAVY }} />;
}

/** `?redirect=` is honoured only for same-site paths; anything else goes home. */
export function safeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}
