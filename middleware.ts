import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Keeps the Supabase session cookies fresh on every page/API request
 * (plan 1.2). No auth gating — everything on run.chesspath.app is public.
 */
export async function middleware(request: NextRequest) {
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
