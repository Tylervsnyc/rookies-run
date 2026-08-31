/**
 * /admin/content — the state of every game asset (abilities, runs, art,
 * sounds, idea backlog) and Tyler's approve / retire / reopen buttons.
 *
 * Server component: builds the snapshot from disk on every request (the
 * registry, the digest and the art folder all change without a deploy).
 * The interactive part lives in components/admin/ContentDashboard.tsx.
 * No auth gate here — mirrors app/admin/replay, which has none either.
 */

import { ContentDashboard } from '@/components/admin/ContentDashboard';
import { buildContentSnapshot } from '@/lib/admin/content-data';

export const dynamic = 'force-dynamic';

export default function AdminContentPage(): React.ReactElement {
  const data = buildContentSnapshot();
  return <ContentDashboard data={data} />;
}
