/**
 * Rookie's Revenge content pipeline — CLI over data/content/pipeline.json.
 *
 *   npx tsx scripts/pipeline.ts list
 *   npx tsx scripts/pipeline.ts add <ability|run> <id> "<name>" "<notes>"   (→ idea)
 *   npx tsx scripts/pipeline.ts built <id>                                   (→ testing)
 *   npx tsx scripts/pipeline.ts approve <id>                                 (→ approved, by Tyler)
 *   npx tsx scripts/pipeline.ts mark-live [id]                               (approved → live if reachable in this build)
 *   npx tsx scripts/pipeline.ts retire <id> "<why>"
 *
 * See docs/content-pipeline.md.
 */

import { STAGES, addItem, advance, isStage, shortReason, summarize, type ContentItem, type ContentKind, type ContentStage } from '../lib/content/pipeline';
import { REGISTRY_PATH, isReachableByPlayers, loadRegistry, saveRegistry, syncLive } from '../lib/content/pipeline-io';

const [cmd, ...rest] = process.argv.slice(2);

function die(msg: string): never {
  console.error(`pipeline: ${msg}`);
  process.exit(1);
}

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

function describe(i: ContentItem): string {
  switch (i.stage) {
    case 'testing':
      return i.testing
        ? `${i.testing.verdict} (${i.testing.lastRun})${i.testing.verdict === 'HOLD' ? ` — ${shortReason(i, 90)}` : ''}`
        : 'not graded yet';
    case 'approved':
      return `approved ${i.approved?.at ?? '?'} by ${i.approved?.by ?? '?'}${isReachableByPlayers(i.id, i.kind) ? ' — in pool, run mark-live' : ' — NOT in the built pool'}`;
    case 'live':
      return `live since ${i.live?.at ?? '?'}`;
    case 'retired':
      return `retired ${i.retired?.at ?? '?'} — ${i.retired?.why ?? ''}`;
    default:
      return i.notes.length > 90 ? i.notes.slice(0, 89) + '…' : i.notes;
  }
}

function list(): void {
  const reg = loadRegistry();
  const s = summarize(reg);
  console.log(`Rookie's Revenge content pipeline — ${reg.items.length} items (${REGISTRY_PATH})`);
  console.log(STAGES.map((st) => `${st} ${s.counts[st]}`).join(' · '));
  console.log('');
  for (const stage of STAGES as ReadonlyArray<ContentStage>) {
    const items = reg.items.filter((i) => i.stage === stage);
    if (!items.length) continue;
    console.log(`${stage.toUpperCase()} (${items.length})`);
    const sorted = stage === 'testing' ? s.waiting : items;
    for (const i of sorted) console.log(`  ${pad(i.kind, 8)} ${pad(i.id, 16)} ${pad(i.name, 18)} ${describe(i)}`);
    console.log('');
  }
  if (s.waiting.length) {
    const ready = s.waiting.filter((i) => i.testing?.verdict === 'READY');
    const hold = s.waiting.filter((i) => i.testing?.verdict !== 'READY');
    console.log(`Waiting on Tyler: ${s.waiting.length} — ${ready.length} READY (${ready.map((i) => i.id).join(', ') || 'none'}), ${hold.length} HOLD/ungraded (${hold.map((i) => i.id).join(', ') || 'none'})`);
    console.log(`Approve with: npx tsx scripts/pipeline.ts approve <id>`);
  }
}

function main(): void {
  switch (cmd) {
    case undefined:
    case 'list':
      return list();

    case 'add': {
      const [kind, id, name, notes] = rest;
      if (!kind || !id || !name) die('usage: add <ability|run> <id> "<name>" "<notes>"');
      if (kind !== 'ability' && kind !== 'run') die(`kind must be ability or run, got "${kind}"`);
      if (!/^[a-z0-9-]+$/.test(id)) die(`id "${id}" must be kebab-case`);
      const reg = addItem(loadRegistry(), { id, kind: kind as ContentKind, name, notes: notes ?? '' });
      saveRegistry(reg);
      console.log(`added ${kind} "${id}" (${name}) as idea`);
      return;
    }

    case 'built': {
      const [id] = rest;
      if (!id) die('usage: built <id>');
      const reg = advance(loadRegistry(), id, 'testing');
      saveRegistry(reg);
      console.log(`${id} → testing. The next nightly grades it; then: approve ${id}`);
      return;
    }

    case 'approve': {
      const [id] = rest;
      if (!id) die('usage: approve <id>');
      const reg = advance(loadRegistry(), id, 'approved', { by: 'Tyler' });
      saveRegistry(reg);
      const item = reg.items.find((i) => i.id === id)!;
      console.log(`${id} → approved by Tyler (${item.approved?.at}). It is player-facing on the next build; the nightly (or mark-live) flips it to live.`);
      return;
    }

    case 'mark-live': {
      const [id] = rest;
      const reg = loadRegistry();
      if (id) {
        const item = reg.items.find((i) => i.id === id) ?? die(`unknown id "${id}"`);
        if (item.stage !== 'approved') die(`${id} is ${item.stage}, not approved`);
        // Note: this process imported the registry at startup, so an approval
        // saved by an earlier command IS reflected in the pools here.
        if (!isReachableByPlayers(id, item.kind)) die(`${id} is approved but not in the built pool (is the code for it in lib/run?)`);
        saveRegistry(advance(reg, id, 'live'));
        console.log(`${id} → live`);
        return;
      }
      const { reg: next, flipped } = syncLive(reg);
      saveRegistry(next);
      console.log(flipped.length ? `live: ${flipped.join(', ')}` : 'nothing approved is waiting to go live');
      return;
    }

    case 'retire': {
      const [id, why] = rest;
      if (!id || !why) die('usage: retire <id> "<why>"');
      saveRegistry(advance(loadRegistry(), id, 'retired', { why }));
      console.log(`${id} → retired: ${why}`);
      return;
    }

    case 'stage': {
      // Escape hatch: move to any stage by hand.
      const [id, stage] = rest;
      if (!id || !stage || !isStage(stage)) die(`usage: stage <id> <${STAGES.join('|')}>`);
      saveRegistry(advance(loadRegistry(), id, stage));
      console.log(`${id} → ${stage}`);
      return;
    }

    default:
      die(`unknown command "${cmd}" — list | add | built | approve | mark-live | retire | stage`);
  }
}

main();
