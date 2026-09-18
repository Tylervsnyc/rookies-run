import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { isAllowedAppOrigin, applyCorsHeaders, preflightResponse } from '@/lib/net/cors';

/**
 * Keeps the Supabase session cookies fresh on every page/API request
 * (plan 1.2). No auth gating — everything on run.chesspath.app is public.
 */
export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');

  // The iOS app serves its pages from the device, so its API calls arrive
  // cross-origin with a bearer token (lib/net/offline-fetch.ts). Browsers
  // preflight anything carrying an Authorization header.
  if (isAllowedAppOrigin(origin)) {
    if (request.method === 'OPTIONS') return preflightResponse(request, origin);
    const response = await updateSession(request);
    return applyCorsHeaders(response, origin);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files by extension (fonts, art, audio, models) — a Supabase
     *   auth call per asset is exactly the perf trap Chess Path hit
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2|woff|ttf|mp3|wav|mp4|MP4|wasm|onnx|ico|task|js|bin|json)$).*)',
  ],
};
