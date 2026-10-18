import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { sharedCookieOptions } from '@/lib/supabase/cookie-domain';

/**
 * GET /auth/callback — the OAuth (Google / Apple) return leg. Supabase
 * redirects here with `?code=`; exchanging it for a session writes the auth
 * cookies straight onto the redirect response (same pattern as
 * chess-learning-tree's app/auth/callback/route.ts, minus its Chess Path-only
 * side effects: welcome email, first-touch stamp). With SHARED_AUTH_COOKIE on
 * and a chesspath.app host, the cookies get Domain=.chesspath.app like every
 * other auth cookie here.
 *
 * Web only. The iOS app never uses OAuth (lib/auth/webview.ts), and
 * scripts/build-offline.mjs deletes every route handler from the static
 * export, this one included.
 *
 * Failures land on /auth/login?oauth=failed — a sign-in page, not a dead end.
 */

/** Same rule as AuthShell's safeRedirect: same-site paths only. */
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNext(searchParams.get('next'));
  const failed = () => NextResponse.redirect(`${origin}/auth/login?oauth=failed`);

  if (searchParams.get('error') || !code) {
    console.error('[auth/callback] OAuth error:', searchParams.get('error'), searchParams.get('error_description'));
    return failed();
  }

  const response = NextResponse.redirect(`${origin}${next}`);
  const cookieOptions = sharedCookieOptions(request.headers.get('x-forwarded-host') ?? request.headers.get('host'));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...(cookieOptions ? { cookieOptions } : {}),
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error('[auth/callback] exchange failed:', error.message);
    return failed();
  }
  return response;
}
