/**
 * Writes to the content registry (data/content/pipeline.json) for the
 * /admin/content dashboard.
 *
 *   POST { action: 'approve' | 'retire' | 'reopen' | 'add', id, why?, kind?, name?, notes? }
 *
 * Filesystem writes only work on a machine that has the repo checked out:
 *   - dev (NODE_ENV !== 'production'): allowed.
 *   - production: allowed only with header `x-admin-token` === ADMIN_TOKEN.
 *   - Vercel (read-only fs): 501 — approve locally, then commit the file.
 */

import { NextResponse } from 'next/server';

import { canWriteRegistry } from '@/lib/admin/content-data';
import { addItem, advance, findItem, type ContentKind } from '@/lib/content/pipeline';
import { loadRegistry, saveRegistry } from '@/lib/content/pipeline-io';

export const dynamic = 'force-dynamic';

interface Body {
  action?: string;
  id?: string;
  why?: string;
  kind?: string;
  name?: string;
  notes?: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  const gate = canWriteRegistry(req.headers.get('x-admin-token'));
  if (!gate.ok) return NextResponse.json({ ok: false, error: gate.message }, { status: gate.status });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Body must be JSON.' }, { status: 400 });
  }
  const id = (body.id ?? '').trim();
  if (!id) return NextResponse.json({ ok: false, error: 'id is required.' }, { status: 400 });

  try {
    const reg = loadRegistry();
    switch (body.action) {
      case 'approve':
        saveRegistry(advance(reg, id, 'approved', { by: 'Tyler' }));
        break;
      case 'retire': {
        const why = (body.why ?? '').trim();
        if (!why) return NextResponse.json({ ok: false, error: 'retire needs a one-line why.' }, { status: 400 });
        saveRegistry(advance(reg, id, 'retired', { why }));
        break;
      }
      case 'reopen': {
        const item = findItem(id, reg);
        if (!item) return NextResponse.json({ ok: false, error: `unknown id "${id}"` }, { status: 404 });
        if (item.stage !== 'retired' && item.stage !== 'approved' && item.stage !== 'live') {
          return NextResponse.json({ ok: false, error: `${id} is ${item.stage}; only retired/approved/live content can be reopened.` }, { status: 400 });
        }
        saveRegistry(advance(reg, id, 'testing'));
        break;
      }
      case 'add': {
        const kind = body.kind;
        const name = (body.name ?? '').trim();
        if (kind !== 'ability' && kind !== 'run') return NextResponse.json({ ok: false, error: 'kind must be ability or run.' }, { status: 400 });
        if (!/^[a-z0-9-]+$/.test(id)) return NextResponse.json({ ok: false, error: 'id must be kebab-case.' }, { status: 400 });
        if (!name) return NextResponse.json({ ok: false, error: 'name is required.' }, { status: 400 });
        saveRegistry(addItem(reg, { id, kind: kind as ContentKind, name, notes: (body.notes ?? '').trim() }));
        break;
      }
      default:
        return NextResponse.json({ ok: false, error: `unknown action "${body.action}"` }, { status: 400 });
    }
    const after = findItem(id, loadRegistry());
    return NextResponse.json({ ok: true, item: after ?? null });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
