import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { sharedCookieOptions } from '@/lib/supabase/cookie-domain';

/**
 * Session refresh for run.chesspath.app — ported from Chess Path's
 * `lib/supabase/middleware.ts`, minus the parts that only make sense there
 * (the `/` auth redirect to /play or /welcome, the Chess Boxing shell cookie).
 * Revenge has no protected routes: the whole game is playable anonymously,
 * so this middleware's only job is to keep the Supabase auth cookies fresh so
 * `useUser()` and the `/api/run/*` routes see a live session.
 */

// Paths that never need a session — skip the Supabase round trip.
const SKIP_PATHS = ['/api/cron/', '/api/og'];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const pathname = request.nextUrl.pathname;
  if (SKIP_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  // SHARED_AUTH_COOKIE: Domain=.chesspath.app on chesspath.app hosts, else
  // undefined and the key is omitted (see lib/supabase/cookie-domain.ts).
  // The one-time host-only-cookie migration lives in the main repo's
  // middleware; run.chesspath.app has no legacy cookies to clean up.
  const cookieOptions = sharedCookieOptions(
    request.headers.get('x-forwarded-host') ?? request.nextUrl.hostname
  );

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    ...(cookieOptions ? { cookieOptions } : {}),
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session if expired - gracefully handle common auth errors
  try {
    const { error } = await supabase.auth.getUser();

    // These errors are expected when user is logged out or session expired
    const expectedErrors = [
      'AuthSessionMissingError',
      'AuthApiError', // Includes "Refresh Token Not Found"
    ];

    if (error && !expectedErrors.includes(error.name)) {
      console.error('Auth error:', error);
    }
  } catch (err) {
    // Catch any unexpected errors to prevent middleware from crashing
    console.error('Middleware auth error:', err);
  }

  return response;
}
