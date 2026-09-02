/**
 * POST /api/playtest-feedback — relay one playtest comment to Slack.
 *
 * Body: { item: string, kind: 'ability'|'run', level?: 1-10, verdict?: 'SHIP'|'TUNE'|'KILL'|'BUG', text: string }
 * Slack line (exact format the funnel watches for):
 *   [playtest] <item>{ L<level>}{ <verdict>} — <text> (Tyler, <YYYY-MM-DD>)
 *
 * Vercel Blob persistence is intentionally skipped: @vercel/blob is not a
 * dependency of this repo and the funnel must not add new dependencies —
 * Slack is the record.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const VERDICTS = new Set(['SHIP', 'TUNE', 'KILL', 'BUG']);
const KINDS = new Set(['ability', 'run']);
const ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;

/** Strip control characters and cap length — the text goes into a Slack line. */
function cleanText(s: string, max: number): string {
  return s
    .replace(/\r\n|\r|\n/g, ' / ')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad('Body must be JSON');
  }
  if (typeof body !== 'object' || body === null) return bad('Body must be a JSON object');
  const b = body as Record<string, unknown>;

  const item = typeof b.item === 'string' ? b.item.trim().toLowerCase() : '';
  if (!ID_RE.test(item)) return bad('item must be a short lowercase id (letters, digits, hyphens)');

  const kind = typeof b.kind === 'string' ? b.kind : '';
  if (!KINDS.has(kind)) return bad("kind must be 'ability' or 'run'");

  let level: number | undefined;
  if (b.level !== undefined && b.level !== null && b.level !== '') {
    const n = Number(b.level);
    if (!Number.isInteger(n) || n < 1 || n > 10) return bad('level must be an integer 1-10');
    level = n;
  }

  let verdict: string | undefined;
  if (b.verdict !== undefined && b.verdict !== null && b.verdict !== '') {
    if (typeof b.verdict !== 'string' || !VERDICTS.has(b.verdict)) {
      return bad('verdict must be SHIP, TUNE, KILL or BUG');
    }
    verdict = b.verdict;
  }

  const text = typeof b.text === 'string' ? cleanText(b.text, 1500) : '';
  if (!text) return bad('text is required');

  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return bad('SLACK_WEBHOOK_URL is not configured on this deployment', 500);

  const date = new Date().toISOString().slice(0, 10);
  const line = `[playtest] ${item}${level ? ` L${level}` : ''}${verdict ? ` ${verdict}` : ''} — ${text} (Tyler, ${date})`;

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: line }),
  });
  if (!res.ok) return bad(`Slack rejected the message (HTTP ${res.status})`, 502);

  return NextResponse.json({ ok: true });
}
