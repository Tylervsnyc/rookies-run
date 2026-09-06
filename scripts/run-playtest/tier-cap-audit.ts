/**
 * Tier-cap audit — proves `RunDef.abilityTierCaps` through the OFFER PATH.
 *
 *   npx tsx scripts/run-playtest/tier-cap-audit.ts [--rolls=200] [--run=<id>]
 *
 * The `matrix` harness FORCES a loadout (`--loadouts=knight-hop:4`), so its
 * numbers are unchanged by a cap on purpose: it is a probe of a tier the run
 * has decided never to hand out. What a cap actually changes is which slates
 * `rollOffer` can produce. So this script rolls slates directly — every capped
 * run × every level × every tier the capped card could already be sitting at ×
 * N seeded rolls — and fails if any option ever offers a capped id above its
 * cap.
 *
 * Exit code 1 = a violation (the cap leaked). Exit 0 = proven over the rolls.
 */

import {
  ALL_ABILITY_IDS,
  MAX_OWNED_ABILITIES,
  abilityTierCapFor,
  maxUsesForTier,
  rollOffer,
  type AbilityId,
  type AbilityTier,
  type OwnedAbility,
} from '../../lib/run/abilities';
import { ALL_RUN_DEFS, type RunDef } from '../../lib/run/runs';
import { rngFromString } from './utils/rng';
import { levelCountFor, startState } from './revenge-core';

function arg(name: string, def?: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
}

const ROLLS = parseInt(arg('rolls', '200')!, 10);
const ONLY = arg('run');

// Player-facing AND hidden/testing runs — a combo run is usually still in
// `testing` when its cap is authored.
const ALL: ReadonlyArray<RunDef> = ALL_RUN_DEFS;
const capped = ALL.filter(
  (r) => r.abilityTierCaps && Object.keys(r.abilityTierCaps).length > 0 && (!ONLY || r.id === ONLY),
);

if (capped.length === 0) {
  console.error('no runs declare abilityTierCaps' + (ONLY ? ` (looked for ${ONLY})` : ''));
  process.exit(1);
}

const own = (id: string, tier: AbilityTier): OwnedAbility => ({
  id: id as AbilityId,
  tier,
  mutations: [],
  usesLeftThisLevel: maxUsesForTier(id as AbilityId, tier),
});

let violations = 0;
let slates = 0;
let options = 0;

for (const run of capped) {
  const caps = run.abilityTierCaps!;
  const kit = (run.allowedAbilities ?? ALL_ABILITY_IDS) as ReadonlyArray<string>;
  const levels = levelCountFor(run.id);
  let seenAtCap = 0; // upgrades offered exactly AT the cap — the cap is a ceiling, not a ban
  let maxOffered: Record<string, number> = {};

  for (const cappedId of Object.keys(caps)) {
    const cap = abilityTierCapFor(run.id, cappedId);
    for (let lv = 1; lv <= levels; lv++) {
      // Every tier the capped card could already be sitting at, and every
      // number of other cards held alongside it (0..MAX-1) — the slate shape
      // changes at the owned-cap, so all of them have to be exercised.
      for (let tier = 1 as AbilityTier; tier <= 5; tier = (tier + 1) as AbilityTier) {
        const others = kit.filter((k) => k !== cappedId);
        for (let extra = 0; extra <= Math.min(MAX_OWNED_ABILITIES - 1, others.length); extra++) {
          const abilities: OwnedAbility[] = [
            own(cappedId, tier),
            ...others.slice(0, extra).map((o) => own(o, 1)),
          ];
          const state = startState({ runId: run.id, difficulty: 'normal' }, lv, abilities, `cap:${run.id}:${lv}`);
          for (let i = 0; i < ROLLS; i++) {
            const rng = rngFromString(`cap:${run.id}:${cappedId}:${lv}:${tier}:${extra}:${i}`);
            const offer = rollOffer(state, rng);
            slates++;
            for (const o of offer) {
              options++;
              const c = abilityTierCapFor(run.id, o.id);
              maxOffered[o.id] = Math.max(maxOffered[o.id] ?? 0, o.tier);
              if (o.tier > c) {
                violations++;
                if (violations <= 10) {
                  console.log(
                    `VIOLATION ${run.id} L${lv}: offered ${o.id} at T${o.tier} (cap T${c}) — owned ${cappedId}@T${tier}, ${extra} other card(s)`,
                  );
                }
              }
              if (o.id === cappedId && o.tier === c) seenAtCap++;
            }
          }
        }
      }
    }
    // The cap must be a CEILING, not a ban: with the card NOT owned it still
    // has to reach the player as a new pick (always T1).
    let seenAsNew = 0;
    for (let lv = 1; lv <= levels; lv++) {
      const others = kit.filter((k) => k !== cappedId);
      const abilities: OwnedAbility[] = others.slice(0, 1).map((o) => own(o, 1));
      const state = startState({ runId: run.id, difficulty: 'normal' }, lv, abilities, `capnew:${run.id}:${lv}`);
      for (let i = 0; i < ROLLS; i++) {
        const offer = rollOffer(state, rngFromString(`capnew:${run.id}:${cappedId}:${lv}:${i}`));
        slates++;
        for (const o of offer) {
          options++;
          if (o.tier > abilityTierCapFor(run.id, o.id)) violations++;
          if (o.id === cappedId) {
            seenAsNew++;
            maxOffered[o.id] = Math.max(maxOffered[o.id] ?? 0, o.tier);
          }
        }
      }
    }
    console.log(
      `${run.id.padEnd(12)} ${cappedId.padEnd(15)} cap T${cap} — highest tier ever offered T${maxOffered[cappedId] ?? 0}` +
        ` | offered AT the cap ${seenAtCap}x (upgradable to its ceiling)` +
        ` | offered as a NEW pick ${seenAsNew}x (still reachable)`,
    );
    seenAtCap = 0;
    maxOffered = {};
  }
}

console.log(`\n${slates} slates rolled, ${options} options inspected, ${violations} violations.`);
process.exit(violations === 0 ? 0 : 1);
