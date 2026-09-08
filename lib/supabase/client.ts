import { createBrowserClient } from '@supabase/ssr';
import { sharedCookieOptions } from '@/lib/supabase/cookie-domain';

// Singleton client instance to avoid multiple instances
let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

/**
 * With SHARED_AUTH_COOKIE on and the page served from a chesspath.app host,
 * auth cookies get `Domain=.chesspath.app` so the same session is visible on
 * chesspath.app. Otherwise `undefined` — no options at all, exactly as before
 * the flag existed.
 */
function webOptions() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : undefined;
  const cookieOptions = sharedCookieOptions(hostname);
  return cookieOptions ? { cookieOptions } : undefined;
}

export function createClient() {
  if (clientInstance) return clientInstance;

  clientInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    webOptions()
  );

  return clientInstance;
}

/**
 * Clear invalid auth tokens from storage
 * Call this when you get "Refresh Token Not Found" errors
 */
export function clearAuthTokens() {
  if (typeof window === 'undefined') return;

  // Find and remove Supabase auth keys from localStorage
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Reset client instance so a fresh one is created
  clientInstance = null;
}
