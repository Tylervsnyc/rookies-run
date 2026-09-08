import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { sharedCookieOptions } from '@/lib/supabase/cookie-domain';

export async function createClient() {
  const cookieStore = await cookies();
  const requestHeaders = await headers();

  // SHARED_AUTH_COOKIE: on a chesspath.app host, write auth cookies with
  // Domain=.chesspath.app (see lib/supabase/cookie-domain.ts). Flag off or any
  // other host -> undefined -> the key is omitted from the options entirely.
  const cookieOptions = sharedCookieOptions(
    requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
  );

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...(cookieOptions ? { cookieOptions } : {}),
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
