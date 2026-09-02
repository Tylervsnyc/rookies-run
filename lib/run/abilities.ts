/**
 * Rookies Run — Ability progression system.
 *
 * 18 shipped abilities, each 5 tiers. Tempo fills → player picks new ability
 * or upgrades an owned one. Abilities are permanent for the run.
 *
 * Tier shape: T1-T3 scale power, T4 doubles uses or adds a twist, T5 is
 * the permanent / unlimited payoff.
 */

import { isWinningMove, rookieLegalMoves } from './movement';
import { getRunById } from './runs';
import { mulberry32 } from './seed';
import { TEMPO_REWARD, tempoMaxFor } from './scoring';
import { toSquare } from './types';
import type {
  AllyPiece,
  BoardState,
  Coord,
  Drone,
  EnemyPiece,
  PieceType,
  RookieForm,
} from './types';

export type AbilityId =
  | 'bishop-step'
  | 'knight-hop'
  | 'queen-pulse'
  | 'become-king'
  | 'freeze-ray'
  | 'poison-dart'
  | 'rabies-dart'
  | 'convert'
  | 'drones'
  | 'squad'
  | 'surge'
  | 'aegis'
  | 'decoy'
  | 'boulder'
  | 'smoke'
  | 'rewind'
  | 'magnet'
  | 'bodyguard'
  | 'summon-knight'
  // Controllable-summon family (2026-09-01, testing) — pieces you summon AND
  // steer, plus upgrades of that idea. See docs/revenge-abilities.md.
  | 'bishop-squire'
  | 'page'
  | 'twin'
  | 'duchess'
  | 'dragon'
  | 'vanguard'
  | 'swap'
  | 'sacrifice'
  | 'knighting';

export type AbilityTier = 1 | 2 | 3 | 4 | 5;

/**
 * - movement: tap card, then tap a board square (legal moves shown).
 * - targeted: tap card, then tap any enemy / any square depending on ability.
 * - transform: tap card → Rookie morphs into another piece for N turns.
 * - instant:   tap card → resolves immediately (Surge / Aegis).
 * - passive:   no tap — auto-fires (currently unused).
 */
export type AbilityActivation =
  | 'movement'
  | 'targeted'
  | 'transform'
  | 'instant'
  | 'passive';

export interface OwnedAbility {
  id: AbilityId;
  tier: AbilityTier;
  mutations: string[];
  /** Remaining uses this level. -1 means unlimited. */
  usesLeftThisLevel: number;
}

export interface AbilityDef {
  id: AbilityId;
  name: string;
  activation: AbilityActivation;
  /** Short type-line for the card text (e.g. "Transform · Movement"). */
  typeLine: string;
  /** Short flavour for the offer screen. */
  description: string;
}

export const ABILITY_DEFS: Record<AbilityId, AbilityDef> = {
  'bishop-step': {
    id: 'bishop-step',
    name: 'Bishop Step',
    activation: 'transform',
    typeLine: 'Transform · Movement',
    description: 'Become a bishop for a few turns.',
  },
  'knight-hop': {
    id: 'knight-hop',
    name: 'Knight Hop',
    activation: 'transform',
    typeLine: 'Transform · Movement',
    description: 'Become a knight for a few turns.',
  },
  'queen-pulse': {
    id: 'queen-pulse',
    name: 'Queen Pulse',
    activation: 'transform',
    typeLine: 'Transform · Movement',
    description: 'Become a queen for a few turns.',
  },
  'become-king': {
    id: 'become-king',
    name: 'Become King',
    activation: 'transform',
    typeLine: 'Transform · Royal',
    description: 'Become an impervious king. Nothing can capture you.',
  },
  'freeze-ray': {
    id: 'freeze-ray',
    name: 'Freeze Ray',
    activation: 'targeted',
    typeLine: 'Targeted · Control',
    description: 'Freeze an enemy you can see.',
  },
  'poison-dart': {
    id: 'poison-dart',
    name: 'Poison Dart',
    activation: 'targeted',
    typeLine: 'Targeted · Bow',
    description: 'Poison an enemy you can see. It dies in a few turns.',
  },
  'rabies-dart': {
    id: 'rabies-dart',
    name: 'Rabies Dart',
    activation: 'targeted',
    typeLine: 'Targeted · Bow',
    description: 'Drive an enemy mad. It attacks the nearest piece.',
  },
  convert: {
    id: 'convert',
    name: 'Convert',
    activation: 'targeted',
    typeLine: 'Targeted · Defect',
    description: 'Flip an enemy onto your team.',
  },
  drones: {
    id: 'drones',
    name: 'Drones',
    activation: 'instant',
    typeLine: 'Instant · Swarm',
    description: 'Launch mini-Rookies that capture in fixed directions.',
  },
  squad: {
    id: 'squad',
    name: 'Squad',
    activation: 'passive',
    typeLine: 'Passive · Spawn',
    description: 'Allies spawn each level. They march and capture.',
  },
  surge: {
    id: 'surge',
    name: 'Surge',
    activation: 'instant',
    typeLine: 'Instant · Tempo',
    description: 'Take an extra move this turn.',
  },
  aegis: {
    id: 'aegis',
    name: 'Aegis',
    activation: 'instant',
    typeLine: 'Instant · Shield',
    description: 'Tap to raise a shield. Blocks the next capture.',
  },
  decoy: {
    id: 'decoy',
    name: 'Decoy',
    activation: 'targeted',
    typeLine: 'Targeted · Trick',
    description: 'Mark an enemy. Its teammates will attack it.',
  },
  boulder: {
    id: 'boulder',
    name: 'Boulder',
    activation: 'targeted',
    typeLine: 'Targeted · Terrain',
    description: 'Drop a boulder on an empty square. Nothing passes it.',
  },
  smoke: {
    id: 'smoke',
    name: 'Smoke',
    activation: 'instant',
    typeLine: 'Instant · Cover',
    description: 'Vanish for a few turns. Enemies lose track of you.',
  },
  rewind: {
    id: 'rewind',
    name: 'Rewind',
    activation: 'instant',
    typeLine: 'Instant · Time',
    description: "Undo the enemies' last turn. The king takes it back. You don't.",
  },
  magnet: {
    id: 'magnet',
    name: 'Magnet',
    activation: 'targeted',
    typeLine: 'Targeted · Pull',
    description: 'Yank an enemy on your line toward you.',
  },
  bodyguard: {
    id: 'bodyguard',
    name: 'Bodyguard',
    activation: 'instant',
    typeLine: 'Instant · Ally',
    description: 'Summon a rainbow rook at your side for a few turns.',
  },
  'summon-knight': {
    id: 'summon-knight',
    name: 'Squire',
    activation: 'targeted',
    typeLine: 'Targeted · Ally',
    description: 'Summon a rainbow knight YOU control. A second body on the board.',
  },
  'bishop-squire': {
    id: 'bishop-squire',
    name: 'Bishop Squire',
    activation: 'targeted',
    typeLine: 'Targeted · Ally',
    description: 'Summon a rainbow bishop YOU control. Long diagonals, your hands.',
  },
  page: {
    id: 'page',
    name: 'Page',
    activation: 'targeted',
    typeLine: 'Targeted · Ally',
    description: 'Summon a rainbow pawn YOU control. Walk him to the far rank: he becomes your queen.',
  },
  twin: {
    id: 'twin',
    name: 'Twin',
    activation: 'targeted',
    typeLine: 'Targeted · Ally',
    description: 'Summon a second rook YOU control. Two Rookies, one board.',
  },
  duchess: {
    id: 'duchess',
    name: 'Duchess',
    activation: 'targeted',
    typeLine: 'Targeted · Ally',
    description: 'Summon a rainbow queen YOU control. She does not stay long.',
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon',
    activation: 'targeted',
    typeLine: 'Targeted · Ally',
    description: 'A dragon. Queen moves, knight moves, no mercy.',
  },
  vanguard: {
    id: 'vanguard',
    name: 'Vanguard',
    activation: 'targeted',
    typeLine: 'Targeted · Ally',
    description: 'Drop a rainbow knight YOU control anywhere in range. Behind their lines.',
  },
  swap: {
    id: 'swap',
    name: 'Swap',
    activation: 'targeted',
    typeLine: 'Targeted · Trick',
    description: 'Trade squares with one of your summons. Instantly.',
  },
  sacrifice: {
    id: 'sacrifice',
    name: 'Sacrifice',
    activation: 'targeted',
    typeLine: 'Targeted · Burst',
    description: 'Your summon explodes. Everything it threatened is captured.',
  },
  knighting: {
    id: 'knighting',
    name: 'Knighting',
    activation: 'targeted',
    typeLine: 'Targeted · Rank',
    description: 'Promote one of your summons into a bigger piece.',
  },
};

export const ALL_ABILITY_IDS: AbilityId[] = Object.keys(
  ABILITY_DEFS,
) as AbilityId[];

/**
 * Back-compat alias kept so playtest scripts (digest.ts, simulate.ts, etc.)
 * don't break. Now identical to ALL_ABILITY_IDS — every ability in this file
 * is shipped to real players.
 */
export const SHIPPED_ABILITY_IDS: AbilityId[] = ALL_ABILITY_IDS;

/** Hard cap on how many abilities Rookie can own in a single run. */
export const MAX_OWNED_ABILITIES = 3;

/** Max uses per level for a given ability/tier. -1 = unlimited. */
export function maxUsesForTier(id: AbilityId, tier: AbilityTier): number {
  switch (id) {
    case 'bishop-step':
    case 'knight-hop':
      // T1/T2/T3 = 1, T4 = 2, T5 = 1 (one transform → rest of level)
      if (tier <= 3) return 1;
      if (tier === 4) return 2;
      return 1;
    case 'queen-pulse':
      // T1/T2 = 1, T3/T4 = 2, T5 = 1
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return 1;
    case 'become-king':
      // 1/2/2/3/3 — each tier adds +1 turn OR +1 use, never both.
      if (tier === 1) return 1;
      if (tier === 2) return 2;
      if (tier === 3) return 2;
      if (tier === 4) return 3;
      return 3;
    case 'freeze-ray':
      if (tier === 3 || tier === 4) return 2;
      return 1;
    case 'poison-dart':
      if (tier === 1) return 1;
      if (tier === 2) return 2;
      if (tier === 3) return 2;
      if (tier === 4) return 3;
      return 2;
    case 'rabies-dart':
      if (tier === 1) return 1;
      if (tier === 2) return 1;
      if (tier === 3) return 2;
      if (tier === 4) return 2;
      return 2;
    case 'convert':
      if (tier === 1) return 1;
      if (tier === 2) return 1;
      if (tier === 3) return 2;
      if (tier === 4) return 2;
      return 2;
    case 'drones':
      if (tier === 1) return 1;
      if (tier === 2) return 1;
      if (tier === 3) return 2;
      if (tier === 4) return 2;
      return 2;
    case 'squad':
      // Passive — no per-activation uses.
      return -1;
    case 'surge':
      if (tier === 1) return 1;
      if (tier === 2) return 2;
      if (tier === 3) return 1;
      return 2;
    case 'aegis':
      if (tier === 1) return 1;
      if (tier === 2 || tier === 3) return 2;
      if (tier === 4) return 3;
      return -1;
    case 'decoy':
      if (tier === 1) return 1;
      if (tier === 2) return 1;
      if (tier === 3) return 2;
      if (tier === 4) return 2;
      return 1;
    case 'boulder':
      // 2/2/3/3/∞ placements per level (T1 tuned 1→2 — one stone never seals a pen).
      if (tier <= 2) return 2;
      if (tier <= 4) return 3;
      return -1;
    case 'smoke':
      // 1/1/2/2/1 — T5 is one long cover.
      if (tier === 3 || tier === 4) return 2;
      return 1;
    case 'rewind':
      // 1/2/2/2/3 — enemy-only rewind (2026-09-02): T2 is simply MORE
      // rewinds; the old T2 charge-refund is gone.
      if (tier === 1) return 1;
      if (tier <= 4) return 2;
      return 3;
    case 'magnet':
      // 1/1/2/2/2
      if (tier <= 2) return 1;
      return 2;
    case 'bodyguard':
      // 1/1/2/2/1 — T5 lasts the whole level.
      if (tier === 3 || tier === 4) return 2;
      return 1;
    case 'summon-knight':
      // 1/1/2/2/2 — from T3 you can re-summon after he's taken.
      if (tier <= 2) return 1;
      return 2;
    case 'bishop-squire':
    case 'page':
    case 'twin':
    case 'vanguard':
      // 1/1/2/2/2 — mirror the Squire (one charge per run, see below).
      if (tier <= 2) return 1;
      return 2;
    case 'duchess':
      // 1/1/1/2/2 — a queen is worth a whole charge.
      if (tier <= 3) return 1;
      return 2;
    case 'dragon':
      // 1/1/1/1/2 — the strongest summon in the game holds ONE charge until T5.
      if (tier <= 4) return 1;
      return 2;
    case 'swap':
      // 1/1/2/2/3 — support, refreshes every level.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return 3;
    case 'sacrifice':
      // 1/1/2/2/2 — support, refreshes every level.
      if (tier <= 2) return 1;
      return 2;
    case 'knighting':
      // 1/1/1/2/2 — support, refreshes every level.
      if (tier <= 3) return 1;
      return 2;
  }
}

/** Transform form a transform-ability grants. */
export function formForAbility(id: AbilityId): RookieForm | null {
  if (id === 'bishop-step') return 'bishop';
  if (id === 'knight-hop') return 'knight';
  if (id === 'queen-pulse') return 'queen';
  if (id === 'become-king') return 'king';
  return null;
}

/** Duration (in Rookie moves) for a transform ability at a given tier. */
export function transformDurationForTier(
  id: AbilityId,
  tier: AbilityTier,
): number {
  if (tier === 5) return 999;
  if (id === 'bishop-step' || id === 'knight-hop') {
    if (tier === 1) return 1;
    if (tier === 2) return 2;
    return 3;
  }
  if (id === 'queen-pulse') {
    if (tier === 1) return 1;
    if (tier === 2 || tier === 3) return 2;
    return 3;
  }
  if (id === 'become-king') {
    // Counts ENEMY turns of invulnerability — decrement happens at end of
    // enemy turn (see endTurn in pawn-ai.ts), not at end of Rookie's move
    // like the movement transforms. So "N turns" = N protected enemy turns.
    // 1/1/2/2/3 — paired with uses 1/2/2/3/3 for a gradual curve.
    if (tier === 1) return 1;
    if (tier === 2) return 1;
    if (tier === 3) return 2;
    if (tier === 4) return 2;
    return 3;
  }
  return 0;
}

export interface AbilityBlurb {
  /** Plain-English effect: "Move diagonally for 1 turn." */
  what: string;
  /** How to activate it: "Tap card, then tap a diagonal square." */
  how: string;
  /** Use limit per level in plain words, or "" for unlimited. */
  limit: string;
}

const HOW: Record<AbilityId, string> = {
  'bishop-step': 'Tap card, then tap a diagonal square.',
  'knight-hop': 'Tap card, then tap a knight square.',
  'queen-pulse': 'Tap card, then tap any square.',
  'become-king': 'Tap card, then tap a king-move square.',
  'freeze-ray': 'Tap card, then tap an enemy you can see.',
  'poison-dart': 'Tap card, then tap an enemy you can see.',
  'rabies-dart': 'Tap card, then tap an enemy you can see.',
  convert: 'Tap card, then tap an eligible enemy.',
  drones: 'Tap card. Drones launch in fixed directions.',
  squad: 'Passive — allies spawn each level.',
  surge: 'Tap card. You get an extra move.',
  aegis: 'Tap card. Shield stays up until used.',
  decoy: 'Tap card, then tap an enemy.',
  boulder: 'Tap card, then tap an empty square.',
  smoke: 'Tap card. You vanish at once.',
  rewind: "Tap card. The enemies' last turn unhappens. Yours stays.",
  magnet: 'Tap card, tap an enemy on your line, then tap the square it lands on.',
  bodyguard: 'Tap card. A rook appears beside you.',
  'summon-knight': 'Tap card, then tap a square beside you. Tap the knight to move it.',
  'bishop-squire': 'Tap card, then tap a square beside you. Tap the bishop to move it.',
  page: 'Tap card, then tap a square beside you. Tap the pawn to move it.',
  twin: 'Tap card, then tap a square beside you. Tap the rook to move it.',
  duchess: 'Tap card, then tap a square beside you. Tap the queen to move it.',
  dragon: 'Tap card, then tap a spawn square. Tap the dragon to move her.',
  vanguard: 'Tap card, then tap any square in range. Tap the knight to move it.',
  swap: 'Tap card, then tap one of your summons.',
  sacrifice: 'Tap card, then tap one of your summons.',
  knighting: 'Tap card, then tap one of your summons.',
};

function limitText(id: AbilityId, tier: AbilityTier): string {
  const n = maxUsesForTier(id, tier);
  if (n < 0) return '';
  if (isOneChargePerRun(id)) return n === 1 ? '1 charge per run' : `${n} charges per run`;
  if (n === 1) return '1 use per level';
  return `${n} uses per level`;
}

export function blurbDetailForTier(
  id: AbilityId,
  tier: AbilityTier,
): AbilityBlurb {
  const how = HOW[id];
  const limit = limitText(id, tier);
  const what = whatForTier(id, tier);
  return { what, how, limit };
}

function whatForTier(id: AbilityId, tier: AbilityTier): string {
  switch (id) {
    case 'bishop-step':
      if (tier === 5) return 'Move diagonally for the rest of the level.';
      if (tier >= 3) return 'Move diagonally for 3 turns.';
      if (tier === 2) return 'Move diagonally for 2 turns.';
      return 'Move diagonally for 1 turn.';
    case 'knight-hop':
      if (tier === 5) return 'Move in L-shapes for the rest of the level.';
      if (tier >= 3) return 'Move in L-shapes for 3 turns.';
      if (tier === 2) return 'Move in L-shapes for 2 turns.';
      return 'Move in L-shapes for 1 turn.';
    case 'queen-pulse':
      if (tier === 5) return 'Move any direction for the rest of the level.';
      if (tier === 4) return 'Move any direction for 3 turns.';
      if (tier >= 2) return 'Move any direction for 2 turns.';
      return 'Move any direction for 1 turn.';
    case 'become-king':
      if (tier === 5) return 'Become a king for 3 turns. Nothing can capture you.';
      if (tier === 4) return 'Become a king for 2 turns. Nothing can capture you.';
      if (tier === 3) return 'Become a king for 2 turns. Nothing can capture you.';
      if (tier === 2) return 'Become a king for 1 turn. Nothing can capture you.';
      return 'Become a king for 1 turn. Nothing can capture you.';
    case 'freeze-ray':
      if (tier === 5) return 'Freeze an enemy. It never moves again.';
      if (tier === 4) return 'Freeze an enemy in place for 3 turns.';
      if (tier >= 2) return 'Freeze an enemy in place for 2 turns.';
      return 'Freeze an enemy in place for 1 turn.';
    case 'poison-dart':
      if (tier === 5) return 'Poison an enemy. It dies next turn.';
      if (tier >= 3) return 'Poison an enemy. It dies in 2 turns.';
      return 'Poison an enemy. It dies in 3 turns.';
    case 'rabies-dart':
      if (tier === 5)
        return 'Drive an enemy mad for 5 turns. It attacks its own side.';
      if (tier === 4)
        return 'Drive an enemy mad for 3 turns. It attacks its own side.';
      if (tier >= 2)
        return 'Drive an enemy mad for 2 turns. It attacks its own side.';
      return 'Drive an enemy mad for 1 turn. It attacks its own side.';
    case 'convert':
      if (tier === 5) return 'Flip any enemy (except king) onto your team.';
      if (tier === 4) return 'Flip any enemy rook, queen, knight, bishop, or pawn.';
      if (tier === 3) return 'Flip an enemy rook or queen onto your team.';
      if (tier === 2) return 'Flip an enemy knight or bishop onto your team.';
      return 'Flip an enemy pawn onto your team.';
    case 'drones':
      if (tier === 5) return 'Launch 6 drones (3 front, sides, back).';
      if (tier === 4) return 'Launch drones front, sides, and back.';
      if (tier === 3) return 'Launch drones front, left, and right.';
      if (tier === 2) return 'Launch drones front and left.';
      return 'Launch a drone forward.';
    case 'squad':
      if (tier === 5) return '7 allies: 3 pawns (front), knight, bishop, 3 more pawns (rank+2).';
      if (tier === 4) return '5 allies: 3 pawns (front), knight, bishop.';
      if (tier === 3) return '4 allies: 3 pawns + a knight.';
      if (tier === 2) return '3 pawns in front of Rookie.';
      return '1 pawn in front of Rookie.';
    case 'surge':
      if (tier === 5) return 'Take 3 extra moves this turn.';
      if (tier >= 3) return 'Take 2 extra moves this turn.';
      return 'Take 1 extra move this turn.';
    case 'aegis':
      if (tier === 5) return 'Raise a permanent shield. Attackers die.';
      if (tier === 3) return 'Raise a shield. The next attacker is stunned.';
      return 'Raise a shield. It blocks the next attack on you.';
    case 'decoy':
      if (tier === 5) return 'Mark an enemy. Its team will keep attacking it.';
      if (tier === 4)
        return 'Mark an enemy for 3 turns. Whoever captures it freezes.';
      if (tier >= 2) return 'Mark an enemy for 2 turns. Its team will attack it.';
      return 'Mark an enemy for 1 turn. Its team will attack it.';
    case 'boulder':
      if (tier === 5) return 'Drop a boulder on any square — crush an enemy pawn under it. Unlimited drops.';
      if (tier === 4) return 'Drop a boulder on any square — crush an enemy pawn under it. Each use drops 2.';
      if (tier >= 2) return 'Drop a boulder on any square — crush an enemy pawn under it.';
      return 'Drop a boulder on an empty square. It blocks everyone, for good.';
    case 'smoke':
      if (tier === 5) return 'Vanish for 3 turns. Captures do not break cover.';
      if (tier === 4) return 'Vanish for 3 turns. Enemies cannot see you.';
      if (tier >= 2) return 'Vanish for 2 turns. Enemies cannot see you.';
      return 'Vanish for 1 turn. Enemies cannot see you.';
    case 'rewind':
      if (tier === 5) return "Undo the last TWO enemy turns — and every piece you rewind is frozen for a turn.";
      if (tier === 4) return "Undo the last TWO enemy turns. Your moves stay.";
      if (tier === 3) return "Undo the enemies' last turn — and the king is stunned while they replay it.";
      return "Undo the enemies' last turn. Your move stays.";
    case 'magnet':
      if (tier === 5) return 'Pull an enemy on your line any distance you choose — even the king, one square.';
      if (tier === 4) return 'Pull an enemy on your line any distance you choose.';
      if (tier >= 2) return 'Pull an enemy on your line up to 3 squares — you pick how far.';
      return 'Pull an enemy on your line up to 2 squares — you pick how far.';
    case 'bodyguard':
      if (tier === 5) return 'A rainbow rook guards you for the rest of the level.';
      if (tier >= 3) return 'A rainbow rook guards you for 3 turns.';
      return 'A rainbow rook guards you for 2 turns.';
    case 'summon-knight':
      if (tier === 5) return 'A knight you control, all level. Move him AND you each turn.';
      if (tier === 4) return 'A knight you control for the rest of the level. Move him or you.';
      if (tier >= 2) return 'A knight you control for 9 turns. Move him or you.';
      return 'A knight you control for 6 turns. Move him or you.';
    case 'bishop-squire':
      if (tier === 5) return 'A bishop you control, all level. Move him AND you each turn.';
      if (tier === 4) return 'A bishop you control for the rest of the level. Move him or you.';
      if (tier >= 2) return 'A bishop you control for 9 turns. Move him or you.';
      return 'A bishop you control for 6 turns. Move him or you.';
    case 'page':
      if (tier === 5) return 'A pawn you control. Any capture promotes him to queen on the spot.';
      if (tier === 4) return 'A pawn you control. Sprints 3 forward; promotes on rank 7.';
      if (tier === 3) return 'A pawn you control. Promotes to your queen on rank 7.';
      if (tier === 2) return 'A pawn you control. He can step 2 forward.';
      return 'A pawn you control. Reach rank 8: he becomes your queen.';
    case 'twin':
      if (tier === 5) return 'A rook you control, all level. Move her AND you each turn.';
      if (tier === 4) return 'A rook you control for the rest of the level. Move her or you.';
      if (tier === 3) return 'A rook you control for 8 turns. Move her or you.';
      if (tier === 2) return 'A rook you control for 6 turns. Move her or you.';
      return 'A rook you control for 4 turns. Move her or you.';
    case 'duchess':
      if (tier === 5) return 'A queen you control for 6 turns.';
      if (tier === 4) return 'A queen you control for 4 turns.';
      if (tier === 3) return 'A queen you control for 4 turns.';
      if (tier === 2) return 'A queen you control for 3 turns.';
      return 'A queen you control for 2 turns. Make them count.';
    case 'dragon':
      if (tier === 5)
        return 'A dragon for 5 turns — queen moves plus knight moves. Summon her anywhere within 3 squares.';
      if (tier === 4)
        return 'A dragon for 4 turns — queen moves plus knight moves. Her captures stun the king 2 turns.';
      if (tier === 3) return 'A dragon you control for 4 turns. Queen moves plus knight moves.';
      if (tier === 2) return 'A dragon you control for 3 turns. Queen moves plus knight moves.';
      return 'A dragon you control for 2 turns. Queen moves plus knight moves.';
    case 'vanguard':
      if (tier === 5) return 'Drop a knight you control within 5 squares. He lasts the level.';
      if (tier >= 3) return 'Drop a knight you control within 4 squares.';
      if (tier === 2) return 'Drop a knight you control within 3 squares.';
      return 'Drop a knight you control within 2 squares.';
    case 'swap':
      if (tier >= 4) return 'Trade squares with ANY rainbow ally. Its clock gains 2 turns. Free action.';
      if (tier >= 2) return 'Trade squares with one of your summons. Its clock gains 2 turns. Free action.';
      return 'Trade squares with one of your summons. Free action.';
    case 'sacrifice':
      if (tier === 5) return 'Detonate a summon. It captures everything it threatens and within 2 squares; the king is stunned 3 turns.';
      if (tier === 4) return 'Detonate a summon. Enemies it threatens and within 2 squares are captured. Survivors beside it are stunned.';
      if (tier === 3) return 'Detonate a summon. Enemies it threatens and beside it are captured. Survivors beside it are stunned.';
      if (tier === 2) return 'Detonate a summon. Enemies on its attack squares are captured; survivors beside it are stunned.';
      return 'Detonate a summon. Enemies on its attack squares are captured.';
    case 'knighting':
      if (tier === 5) return 'Promote a summon straight to queen.';
      if (tier === 4) return 'Promote a summon or ANY rainbow ally two steps up.';
      if (tier === 3) return 'Promote a summon two steps up (pawn to bishop, knight to rook).';
      if (tier === 2) return 'Promote a summon one step up. Its clock gains 3 turns.';
      return 'Promote a summon one step: pawn, knight, bishop, rook, queen.';
  }
}

export function blurbForTier(id: AbilityId, tier: AbilityTier): string {
  switch (id) {
    case 'bishop-step':
      if (tier === 5) return 'Bishop for rest of level.';
      if (tier === 4) return 'Bishop for 3 turns. 2/level.';
      if (tier === 3) return 'Bishop for 3 turns. 1/level.';
      if (tier === 2) return 'Bishop for 2 turns. 1/level.';
      return 'Bishop for 1 turn. 1/level.';
    case 'knight-hop':
      if (tier === 5) return 'Knight for rest of level.';
      if (tier === 4) return 'Knight for 3 turns. 2/level.';
      if (tier === 3) return 'Knight for 3 turns. 1/level.';
      if (tier === 2) return 'Knight for 2 turns. 1/level.';
      return 'Knight for 1 turn. 1/level.';
    case 'queen-pulse':
      if (tier === 5) return 'Queen for rest of level.';
      if (tier === 4) return 'Queen for 3 turns. 2/level.';
      if (tier === 3) return 'Queen for 2 turns. 2/level.';
      if (tier === 2) return 'Queen for 2 turns. 1/level.';
      return 'Queen for 1 turn. 1/level.';
    case 'become-king':
      if (tier === 5) return 'King for rest of level.';
      if (tier === 4) return 'King for 3 turns. 2/level.';
      if (tier === 3) return 'King for 2 turns. 2/level.';
      if (tier === 2) return 'King for 2 turns. 1/level.';
      return 'King for 1 turn. 1/level.';
    case 'freeze-ray':
      if (tier === 5) return 'Permanent freeze. 1/level.';
      if (tier === 4) return 'Freeze 3 turns. 2/level.';
      if (tier === 3) return 'Freeze 2 turns. 2/level.';
      if (tier === 2) return 'Freeze 2 turns. 1/level.';
      return 'Freeze 1 turn. 1/level.';
    case 'poison-dart':
      if (tier === 5) return 'Poison: dies next turn. 2/level.';
      if (tier === 4) return 'Poison: dies in 2 turns. 3/level.';
      if (tier === 3) return 'Poison: dies in 2 turns. 2/level.';
      if (tier === 2) return 'Poison: dies in 3 turns. 2/level.';
      return 'Poison: dies in 3 turns. 1/level.';
    case 'rabies-dart':
      if (tier === 5) return 'Rabid 5 turns. 2/level.';
      if (tier === 4) return 'Rabid 3 turns. 2/level.';
      if (tier === 3) return 'Rabid 2 turns. 2/level.';
      if (tier === 2) return 'Rabid 2 turns. 1/level.';
      return 'Rabid 1 turn. 1/level.';
    case 'convert':
      if (tier === 5) return 'Flip any non-king. 2/level.';
      if (tier === 4) return 'Flip pawn/minor/major. 2/level.';
      if (tier === 3) return 'Flip rook/queen. 2/level.';
      if (tier === 2) return 'Flip knight/bishop. 1/level.';
      return 'Flip an enemy pawn. 1/level.';
    case 'drones':
      if (tier === 5) return '6 drones (3 front + sides + back). 2/level.';
      if (tier === 4) return '4 drones (front, sides, back). 2/level.';
      if (tier === 3) return '3 drones (front + sides). 2/level.';
      if (tier === 2) return '2 drones (front, left). 1/level.';
      return '1 drone (front). 1/level.';
    case 'squad':
      if (tier === 5) return 'Passive: 7 allies / level.';
      if (tier === 4) return 'Passive: 5 allies / level.';
      if (tier === 3) return 'Passive: 4 allies / level.';
      if (tier === 2) return 'Passive: 3 allies / level.';
      return 'Passive: 1 ally / level.';
    case 'surge':
      if (tier === 5) return '+3 extra moves this turn. 2/level.';
      if (tier === 4) return '+2 extra moves this turn. 2/level.';
      if (tier === 3) return '+2 extra moves this turn. 1/level.';
      if (tier === 2) return '+1 extra move this turn. 2/level.';
      return '+1 extra move this turn. 1/level.';
    case 'aegis':
      if (tier === 5) return 'Tap: permanent shield. Attackers die.';
      if (tier === 4) return 'Tap: shield. 3 raises/level.';
      if (tier === 3) return 'Tap: shield + stuns attacker. 2/level.';
      if (tier === 2) return 'Tap: shield. 2 raises/level.';
      return 'Tap: shield blocks next capture. 1/level.';
    case 'decoy':
      if (tier === 5) return 'Mark stays until captured. 1/level.';
      if (tier === 4) return 'Mark 3 turns. Capturers freeze. 2/level.';
      if (tier === 3) return 'Mark for 2 turns. 2/level.';
      if (tier === 2) return 'Mark for 2 turns. 1/level.';
      return 'Mark an enemy for 1 turn. 1/level.';
    case 'boulder':
      if (tier === 5) return 'Crush pawns. Unlimited boulders.';
      if (tier === 4) return 'Crush a pawn; 2 boulders per use. 3/level.';
      if (tier === 3) return 'Crush a pawn under a boulder. 3/level.';
      if (tier === 2) return 'Crush a pawn under a boulder. 2/level.';
      return 'Drop a boulder. 2/level.';
    case 'smoke':
      if (tier === 5) return 'Vanish 3 turns, captures keep cover. 1/level.';
      if (tier === 4) return 'Vanish 3 turns. 2/level.';
      if (tier === 3) return 'Vanish 2 turns. 2/level.';
      if (tier === 2) return 'Vanish 2 turns. 1/level.';
      return 'Vanish 1 turn. 1/level.';
    case 'rewind':
      if (tier === 5) return 'Undo 2 enemy turns; rewound pieces freeze. 3/level.';
      if (tier === 4) return 'Undo the last TWO enemy turns. 2/level.';
      if (tier === 3) return 'Undo their turn; king stunned. 2/level.';
      if (tier === 2) return 'Undo their last turn. 2/level.';
      return 'Undo their last turn. 1/level.';
    case 'magnet':
      if (tier === 5) return 'Pull any distance you choose. Even the king. 2/level.';
      if (tier === 4) return 'Pull any distance you choose. 2/level.';
      if (tier === 3) return 'Pull up to 3 — you choose. 2/level.';
      if (tier === 2) return 'Pull up to 3 — you choose. 1/level.';
      return 'Pull up to 2 — you choose. 1/level.';
    case 'bodyguard':
      if (tier === 5) return 'Rook ally, whole level. 1/level.';
      if (tier === 4) return 'Rook ally, 3 turns. 2/level.';
      if (tier === 3) return 'Rook ally, 3 turns. 2/level.';
      if (tier === 2) return 'Rook ally, 2 turns. 1/level.';
      return 'Rook ally, 2 turns. 1/level.';
    case 'summon-knight':
      if (tier === 5) return 'Your knight, all level, free move. 2/level.';
      if (tier === 4) return 'Your knight, all level. 2/level.';
      if (tier === 3) return 'Your knight, 9 turns. 2/level.';
      if (tier === 2) return 'Your knight, 9 turns. 1/level.';
      return 'Your knight, 6 turns. 1/level.';
    case 'bishop-squire':
      if (tier === 5) return 'Your bishop, all level, free move. 2 charges.';
      if (tier === 4) return 'Your bishop, all level. 2 charges.';
      if (tier === 3) return 'Your bishop, 9 turns. 2 charges.';
      if (tier === 2) return 'Your bishop, 9 turns. 1 charge.';
      return 'Your bishop, 6 turns. 1 charge.';
    case 'page':
      if (tier === 5) return 'Your pawn. Captures promote. 2 charges.';
      if (tier === 4) return 'Your pawn, 3-square sprint. 2 charges.';
      if (tier === 3) return 'Your pawn. Promotes on rank 7. 2 charges.';
      if (tier === 2) return 'Your pawn, 2-step walk. 1 charge.';
      return 'Your pawn. Queen on rank 8. 1 charge.';
    case 'twin':
      if (tier === 5) return 'Your rook, all level, free move. 2 charges.';
      if (tier === 4) return 'Your rook, all level. 2 charges.';
      if (tier === 3) return 'Your rook, 8 turns. 2 charges.';
      if (tier === 2) return 'Your rook, 6 turns. 1 charge.';
      return 'Your rook, 4 turns. 1 charge.';
    case 'duchess':
      if (tier === 5) return 'Your queen, 6 turns. 2 charges.';
      if (tier === 4) return 'Your queen, 4 turns. 2 charges.';
      if (tier === 3) return 'Your queen, 4 turns. 1 charge.';
      if (tier === 2) return 'Your queen, 3 turns. 1 charge.';
      return 'Your queen, 2 turns. 1 charge.';
    case 'dragon':
      if (tier === 5) return 'Your dragon, 5 turns, drops in range 3. 2 charges.';
      if (tier === 4) return 'Your dragon, 4 turns. Captures stun king 2. 1 charge.';
      if (tier === 3) return 'Your dragon, 4 turns. 1 charge.';
      if (tier === 2) return 'Your dragon, 3 turns. 1 charge.';
      return 'Your dragon, 2 turns. 1 charge.';
    case 'vanguard':
      if (tier === 5) return 'Knight drop, range 5, all level. 2 charges.';
      if (tier === 4) return 'Knight drop, range 4. 2 charges.';
      if (tier === 3) return 'Knight drop, range 4. 2 charges.';
      if (tier === 2) return 'Knight drop, range 3. 1 charge.';
      return 'Knight drop, range 2. 1 charge.';
    case 'swap':
      if (tier === 5) return 'Trade with any ally, +2 turns. 3/level.';
      if (tier === 4) return 'Trade with any ally, +2 turns. 2/level.';
      if (tier === 3) return 'Trade, +2 turns on its clock. 2/level.';
      if (tier === 2) return 'Trade, +2 turns on its clock. 1/level.';
      return 'Trade with a summon. 1/level.';
    case 'sacrifice':
      if (tier === 5) return 'Detonate: threats + 2 rings, stun 3. 2/level.';
      if (tier === 4) return 'Detonate: threats + 2 rings. 2/level.';
      if (tier === 3) return 'Detonate: threats + beside. 2/level.';
      if (tier === 2) return 'Detonate + stun survivors. 1/level.';
      return 'Detonate a summon. 1/level.';
    case 'knighting':
      if (tier === 5) return 'Summon straight to queen. 2/level.';
      if (tier === 4) return 'Any ally, two steps up. 2/level.';
      if (tier === 3) return 'Two steps up. 1/level.';
      if (tier === 2) return 'One step up, +3 turns. 1/level.';
      return 'One step up. 1/level.';
  }
}

/**
 * Upgrade delta notes — what the OFFERED tier changes vs the tier below it.
 * Indexed by the offered tier (2–5). These describe the EFFECT delta only;
 * the uses/charges delta is computed from maxUsesForTier by
 * upgradeDeltaForTier so the numbers can never drift from the real limits.
 * '' = the effect itself doesn't change at this tier (only uses do — the
 * computed line carries the whole delta). Where a tier genuinely changes
 * nothing (it happens), the note says so honestly.
 * Kept in Rookie's register: short, warm, no emojis.
 */
export const UPGRADE_NOTES: Record<
  AbilityId,
  Record<2 | 3 | 4 | 5, string>
> = {
  'bishop-step': {
    2: 'Bishop walk: 1 turn → 2',
    3: '2 turns → 3',
    4: '',
    5: 'Lasts the rest of the level',
  },
  'knight-hop': {
    2: 'Knight moves: 1 turn → 2',
    3: '2 turns → 3',
    4: '',
    5: 'Lasts the rest of the level',
  },
  'queen-pulse': {
    2: 'Queen moves: 1 turn → 2',
    3: '',
    4: '2 turns → 3',
    5: 'Lasts the rest of the level',
  },
  'become-king': {
    2: '',
    3: 'Protected 1 turn → 2',
    4: '',
    5: 'Protected 2 turns → 3',
  },
  'freeze-ray': {
    2: 'Freeze holds 1 turn → 2',
    3: '',
    4: 'Freeze holds 2 turns → 3',
    5: 'Frozen forever. It never thaws.',
  },
  'poison-dart': {
    2: '',
    3: 'Dies in 3 turns → 2',
    4: '',
    5: 'Dies next turn',
  },
  'rabies-dart': {
    2: 'Mad for 1 turn → 2',
    3: '',
    4: 'Mad for 2 turns → 3',
    5: 'Mad for 3 turns → 5',
  },
  convert: {
    2: 'Now flips knights and bishops',
    3: 'Now flips rooks and queens',
    4: 'Flips pawns, minors, AND majors',
    5: 'Flips anything but the king',
  },
  drones: {
    2: '1 drone → 2',
    3: '2 drones → 3',
    4: '3 drones → 4. Covers your back.',
    5: '4 drones → 6',
  },
  squad: {
    2: '1 pawn → 3 pawns',
    3: 'A knight joins the squad',
    4: 'A bishop joins the squad',
    5: '5 allies → 7',
  },
  surge: {
    2: '',
    3: '1 extra move → 2',
    4: '',
    5: '2 extra moves → 3',
  },
  aegis: {
    2: '',
    3: 'Blocked attackers get stunned',
    4: 'Stun gone; extra raise instead',
    5: 'Permanent shield. Attackers die.',
  },
  decoy: {
    2: 'Mark holds 1 turn → 2',
    3: '',
    4: 'Mark holds 3 turns; capturers freeze',
    5: 'Mark lasts until captured',
  },
  boulder: {
    2: 'Crush enemy pawns under your drops',
    3: '',
    4: 'Each use drops 2 boulders',
    5: 'Unlimited boulders',
  },
  smoke: {
    2: 'Vanish 1 turn → 2',
    3: '',
    4: 'Vanish 2 turns → 3',
    5: 'Captures no longer break cover',
  },
  rewind: {
    2: '1 rewind per level → 2',
    3: 'Rewinding also stuns the king a turn',
    4: 'Reaches back TWO enemy turns',
    5: 'Rewound pieces freeze for a turn',
  },
  magnet: {
    2: 'Pull reach 2 squares → 3',
    3: '',
    4: 'Pulls from any distance',
    5: 'Even the king moves: yanked 1 square',
  },
  bodyguard: {
    2: 'Same guard. Shinier card.',
    3: 'Guards 2 turns → 3',
    4: '',
    5: 'Guards the rest of the level',
  },
  'summon-knight': {
    2: 'On the board 6 turns → 9',
    3: '',
    4: 'Stays the rest of the level',
    5: 'Free move: him AND you, every turn',
  },
  'bishop-squire': {
    2: 'On the board 6 turns → 9',
    3: '',
    4: 'Stays the rest of the level',
    5: 'Free move: him AND you, every turn',
  },
  page: {
    2: 'He can step 2 forward now',
    3: 'Promotes on rank 7, not 8',
    4: 'His sprint: 2 squares → 3',
    5: 'Any capture promotes him on the spot',
  },
  twin: {
    2: 'On the board 4 turns → 6',
    3: '6 turns → 8',
    4: 'Stays the rest of the level',
    5: 'Free move: her AND you, every turn',
  },
  duchess: {
    2: 'On the board 2 turns → 3',
    3: '3 turns → 4',
    4: '',
    5: '4 turns → 6',
  },
  dragon: {
    2: 'On the board 2 turns → 3',
    3: '3 turns → 4',
    4: 'Her captures stun the king 2 turns, not 1',
    5: '4 turns → 5; summon her anywhere within 3 squares',
  },
  vanguard: {
    2: 'Drop range 2 → 3',
    3: 'Drop range 3 → 4',
    4: '',
    5: 'Range 5. Stays the whole level.',
  },
  swap: {
    2: 'The trade adds 2 turns to its clock',
    3: '',
    4: 'Trades with ANY rainbow ally',
    5: '',
  },
  sacrifice: {
    2: 'Survivors beside the boom are stunned',
    3: 'Blast also hits adjacent squares',
    4: 'Blast reaches 2 squares out',
    5: 'King stun 2 turns → 3',
  },
  knighting: {
    2: 'Promoted summon gains 3 extra turns',
    3: 'Promotes two steps up, not one',
    4: 'Works on ANY rainbow ally',
    5: 'Straight to queen',
  },
};

/**
 * The delta an upgrade offer gives vs the tier the player owns (offered - 1).
 * Returns 1–2 short lines: the effect note from UPGRADE_NOTES plus a
 * computed uses/charges line whenever maxUsesForTier changes between the
 * two tiers. Never empty — a tier that changes nothing says so.
 */
export function upgradeDeltaForTier(
  id: AbilityId,
  offeredTier: AbilityTier,
): string[] {
  const from = Math.max(1, offeredTier - 1) as AbilityTier;
  const lines: string[] = [];
  const note =
    offeredTier >= 2 ? UPGRADE_NOTES[id][offeredTier as 2 | 3 | 4 | 5] : '';
  if (note) lines.push(note);
  const a = maxUsesForTier(id, from);
  const b = maxUsesForTier(id, offeredTier);
  if (a !== b) {
    const perRun = isOneChargePerRun(id);
    const unit = (n: number) =>
      perRun ? (n === 1 ? 'charge' : 'charges') : (n === 1 ? 'use' : 'uses');
    const scope = perRun ? 'per run' : 'per level';
    if (b < 0) lines.push('Unlimited uses');
    else if (a < 0) lines.push(`${b} ${unit(b)} ${scope}`);
    else if (b > a) lines.push(`+${b - a} ${unit(b - a)} ${scope}`);
    else lines.push(`${a} ${unit(a)} → ${b} ${scope}`);
  }
  if (lines.length === 0) lines.push('Same power. Shinier card.');
  return lines;
}

export interface AbilityOfferOption {
  kind: 'new' | 'upgrade';
  id: AbilityId;
  tier: AbilityTier;
  description: AbilityBlurb;
}

export type AbilityOffer = AbilityOfferOption[];

/**
 * Make an offer slate of up to 2 choices. Deterministic via the passed RNG.
 *
 * Rules:
 *  - If the player owns fewer than MAX_OWNED_ABILITIES, mix "new" and "upgrade"
 *    candidates.
 *  - Once the player has hit the cap, ONLY upgrades for owned abilities are
 *    eligible — no new-ability offers.
 *  - If every owned ability is already at T5, returns an empty array — callers
 *    (engine, seed) should treat that as "skip the offer, refund tempo".
 *  - All returned options are distinct.
 */
export function rollOffer(state: BoardState, rng: () => number): AbilityOffer {
  const owned = new Map(state.abilities.map((a) => [a.id, a]));
  const ownedCount = owned.size;
  const atCap = ownedCount >= MAX_OWNED_ABILITIES;

  // Per-run allowlist (e.g. abilities-v2 test run). When set, restrict both
  // new offers AND upgrade offers to listed ids.
  const runDef = state.runId
    ? (() => {
        try {
          return getRunById(state.runId);
        } catch {
          return null;
        }
      })()
    : null;
  // Playtest kit (/playtest real-run mode): the kit IS the offer pool —
  // it overrides the run allowlist and the unlocked set entirely.
  const testkit = state.testkit && state.testkit.length > 0 ? new Set<string>(state.testkit) : null;
  const runAllowedRaw = testkit
    ? testkit
    : runDef?.allowedAbilities
      ? new Set(runDef.allowedAbilities as string[])
      : null;
  // Meta-progression: the player only sees abilities they've unlocked.
  // Owned abilities always stay upgradable (they were unlocked when picked).
  const unlocked =
    !testkit && state.unlockedAbilities && !runDef?.ignoreUnlocks ? new Set<string>(state.unlockedAbilities) : null;
  const runAllowed = (() => {
    if (!runAllowedRaw && !unlocked) return null;
    const ids = ALL_ABILITY_IDS.filter(
      (id) => (!runAllowedRaw || runAllowedRaw.has(id)) && (!unlocked || unlocked.has(id) || owned.has(id)),
    );
    return new Set<string>(ids);
  })();
  // Offer size — 2 by default; Rookie's Revenge shows 3.
  const size = Math.max(1, runDef?.offerSize ?? 2);
  // Core guarantee — at least `coreMin` slate entries are core ids.
  const core = runDef?.offerCore ? new Set(runDef.offerCore as string[]) : null;
  const coreMin = core ? Math.min(size, runDef?.offerCoreMin ?? 0) : 0;

  const newPool: AbilityOfferOption[] = ALL_ABILITY_IDS.filter(
    (id) => !owned.has(id) && (!runAllowed || runAllowed.has(id)),
  ).map((id) => ({
    kind: 'new',
    id,
    tier: 1,
    description: blurbDetailForTier(id, 1),
  }));

  const upgradePool: AbilityOfferOption[] = [...owned.values()]
    .filter((a) => a.tier < 5 && (!runAllowed || runAllowed.has(a.id)))
    .map((a) => {
      const next = (a.tier + 1) as AbilityTier;
      return {
        kind: 'upgrade',
        id: a.id,
        tier: next,
        description: blurbDetailForTier(a.id, next),
      };
    });

  const pickOne = <T,>(arr: T[]): T | undefined => {
    if (arr.length === 0) return undefined;
    return arr[Math.floor(rng() * arr.length)];
  };
  const without = <T,>(arr: T[], match: (x: T) => boolean): T[] =>
    arr.filter((x) => !match(x));

  const offer: AbilityOfferOption[] = [];
  /** Draw up to `n` distinct-by-id options from `pool` into `offer`. */
  const draw = (pool: AbilityOfferOption[], n: number): void => {
    let rest = pool.filter((x) => !offer.some((o) => o.id === x.id));
    for (let i = 0; i < n; i++) {
      const pick = pickOne(rest);
      if (!pick) return;
      offer.push(pick);
      rest = without(rest, (x) => x.id === pick.id);
    }
  };

  const isCore = (o: AbilityOfferOption) => !!core && core.has(o.id);
  const coreCount = () => offer.filter(isCore).length;

  if (atCap) {
    if (upgradePool.length === 0) return [];
    // Owned-only upgrades: seed the core guarantee first, then fill.
    if (coreMin > 0) draw(upgradePool.filter(isCore), coreMin);
    draw(upgradePool, size - offer.length);
    return offer;
  }

  if (ownedCount === 0) {
    if (coreMin > 0) draw(newPool.filter(isCore), coreMin);
    draw(newPool, size - offer.length);
    return offer;
  }

  if (upgradePool.length > 0 && newPool.length > 0) {
    // One upgrade + the rest new (2-wide keeps the legacy 1+1 shape).
    draw(upgradePool, 1);
    // Core guarantee: the new picks must supply whatever core is missing.
    const needCore = Math.max(0, coreMin - coreCount());
    if (needCore > 0) draw(newPool.filter(isCore), Math.min(needCore, size - offer.length));
    draw(newPool, size - offer.length);
    // Top up from upgrades if the new pool ran dry.
    if (offer.length < size) draw(upgradePool, size - offer.length);
    return offer;
  }

  const fallback = newPool.length > 0 ? newPool : upgradePool;
  if (coreMin > 0) draw(fallback.filter(isCore), coreMin);
  draw(fallback, size - offer.length);
  return offer;
}

export function offerIsExhausted(state: BoardState): boolean {
  if (state.abilities.length < MAX_OWNED_ABILITIES) return false;
  return state.abilities.every((a) => a.tier === 5);
}

export function applyOfferPick(
  state: BoardState,
  option: AbilityOfferOption,
): BoardState {
  if (!state.pendingOffer) return state;
  let abilities = state.abilities;
  if (option.kind === 'new') {
    if (abilities.some((a) => a.id === option.id)) return state;
    if (abilities.length >= MAX_OWNED_ABILITIES) return state;
    abilities = [
      ...abilities,
      {
        id: option.id,
        tier: 1,
        mutations: [],
        usesLeftThisLevel: maxUsesForTier(option.id, 1),
      },
    ];
  } else {
    abilities = abilities.map((a) => {
      if (a.id !== option.id) return a;
      const newTier = option.tier;
      return {
        ...a,
        tier: newTier,
        usesLeftThisLevel: maxUsesForTier(a.id, newTier),
      };
    });
  }
  // Squad is a passive — its payoff lands at the START of the next level
  // (seed.ts reads the owned tier and spawns the roster). Picking or upgrading
  // mid-level does NOT spawn a fresh squad on top of the current board; that
  // gave a confusing burst of pieces and let the player double-dip by picking
  // squad after killing existing allies.
  // Level offers (Rookie's Revenge free pick) are a gift — the tempo meter
  // is untouched. Tempo offers spend the full meter.
  const isLevelOffer = state.offerReason === 'level';
  return {
    ...state,
    abilities,
    pendingOffer: null,
    offerReason: undefined,
    tempo: isLevelOffer ? state.tempo : 0,
  };
}

export function applyDismissOffer(state: BoardState): BoardState {
  if (!state.pendingOffer) return state;
  const isLevelOffer = state.offerReason === 'level';
  return {
    ...state,
    pendingOffer: null,
    offerReason: undefined,
    tempo: isLevelOffer ? state.tempo : Math.floor(tempoMaxFor(state) / 2),
  };
}

// ---------------------------------------------------------------------------
// Legal-move computation (for movement-style abilities only).
// ---------------------------------------------------------------------------

// (inBounds/isHazard/enemyAt removed with leap/phase-step.)

export function abilityLegalMoves(
  state: BoardState,
  abilityId: AbilityId,
): Coord[] {
  // v2: no movement abilities remain; convert/drones use other UI paths.
  // Boulder is a pick-square target — its drop squares render as the same
  // tier-coloured dots a movement ability would (quieter than 60 rings).
  if (abilityId === 'boulder') return boulderTargets(state);
  // Magnet in its second step: the landing squares along the pull line —
  // tapping one IS the distance chooser.
  if (abilityId === 'magnet') {
    const active = state.activeAbility;
    if (active?.id !== 'magnet' || active.step !== 'pick-square' || !active.magnetFrom) return [];
    const tier = state.abilities.find((a) => a.id === 'magnet')?.tier ?? 1;
    return magnetLandingSquares(state, active.magnetFrom, tier);
  }
  if (abilityId === 'summon-knight') return squireSpawnSquares(state);
  if (isSummonAbility(abilityId)) return summonSpawnSquares(state, abilityId);
  if (abilityId === 'swap') return swapTargets(state);
  if (abilityId === 'sacrifice') return sacrificeTargets(state);
  if (abilityId === 'knighting') return knightingTargets(state);
  return [];
}

/**
 * Convert targeting: which enemy piece types are eligible at this tier.
 * King is never targetable.
 */
export function convertEligibleTypes(tier: AbilityTier): Set<'pawn' | 'knight' | 'bishop' | 'queen'> {
  if (tier === 1) return new Set(['pawn']);
  if (tier === 2) return new Set(['pawn', 'knight', 'bishop']);
  return new Set(['pawn', 'knight', 'bishop', 'queen']);
}

/** Enemy squares the active Convert ability can target. */
export function convertTargets(state: BoardState): Coord[] {
  const owned = state.abilities.find((a) => a.id === 'convert');
  if (!owned) return [];
  const elig = convertEligibleTypes(owned.tier);
  return state.pieces
    .filter((p) => elig.has(p.type as 'pawn' | 'knight' | 'bishop' | 'queen'))
    .map((p) => ({ file: p.file, rank: p.rank }));
}

/** Directions each Drones tier launches in. dx/dy from Rookie's perspective. */
function droneDirs(tier: AbilityTier): Array<[number, number]> {
  // dr = +1 means "toward rank 8" (forward).
  const FRONT: [number, number] = [0, 1];
  const LEFT: [number, number] = [-1, 0];
  const RIGHT: [number, number] = [1, 0];
  const BACK: [number, number] = [0, -1];
  if (tier === 1) return [FRONT];
  if (tier === 2) return [FRONT, LEFT];
  if (tier === 3) return [FRONT, LEFT, RIGHT];
  if (tier === 4) return [FRONT, LEFT, RIGHT, BACK];
  return [FRONT, FRONT, FRONT, LEFT, RIGHT, BACK];
}

// firstEnemyAlongRay inlined in applyDrones for clarity.

// ---------------------------------------------------------------------------
// Activation.
// ---------------------------------------------------------------------------

export function applyAbilityActivate(
  state: BoardState,
  abilityId: AbilityId,
): BoardState {
  if (state.status !== 'playing' || state.turn !== 'rookie') return state;
  if (state.pendingOffer) return state;

  if (state.cancellableActivation?.abilityId === abilityId) {
    const snap = state.cancellableActivation.snapshot;
    return {
      ...state,
      form: snap.form,
      formMovesLeft: snap.formMovesLeft,
      bonusMovesLeft: snap.bonusMovesLeft,
      abilities: snap.abilities,
      shieldUp: snap.shieldUp,
      cancellableActivation: undefined,
      activeAbility: null,
    };
  }

  const owned = state.abilities.find((a) => a.id === abilityId);
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  const def = ABILITY_DEFS[abilityId];

  if (def.activation === 'transform') {
    return applyTransform(state, abilityId);
  }
  if (def.activation === 'passive') return state;
  if (abilityId === 'surge') {
    return applySurge(state);
  }
  if (abilityId === 'aegis') {
    return applyAegis(state);
  }
  if (abilityId === 'drones') {
    return applyDrones(state);
  }
  if (abilityId === 'smoke') {
    return applySmoke(state);
  }
  if (abilityId === 'rewind') {
    return applyRewind(state);
  }
  if (abilityId === 'bodyguard') {
    return applyBodyguard(state);
  }

  // Targeted abilities pick an enemy as their second tap — except Boulder
  // and the controllable-summon family, which pick a SQUARE (empty square to
  // spawn on / one of your own summons).
  const picksSquare =
    abilityId === 'boulder' ||
    abilityId === 'summon-knight' ||
    isSummonAbility(abilityId) ||
    abilityId === 'swap' ||
    abilityId === 'sacrifice' ||
    abilityId === 'knighting';
  let step: 'pick-square' | 'pick-enemy' = 'pick-square';
  if (def.activation === 'targeted' && !picksSquare) step = 'pick-enemy';
  if (picksSquare && abilityLegalMoves(state, abilityId).length === 0) return state;
  if (abilityId === 'magnet' && magnetTargets(state).length === 0) return state;
  return { ...state, activeAbility: { id: abilityId, step } };
}

export function applyAbilityCancel(state: BoardState): BoardState {
  if (!state.activeAbility) return state;
  // Cancelling mid-Boulder-T4 forfeits the owed free second drop.
  return { ...state, activeAbility: null, boulderDropsLeft: undefined };
}

function decrementUse(
  abilities: OwnedAbility[],
  id: AbilityId,
): OwnedAbility[] {
  return abilities.map((a) =>
    a.id === id
      ? {
          ...a,
          usesLeftThisLevel:
            a.usesLeftThisLevel < 0
              ? -1
              : Math.max(0, a.usesLeftThisLevel - 1),
        }
      : a,
  );
}

function applyTransform(state: BoardState, abilityId: AbilityId): BoardState {
  const owned = state.abilities.find((a) => a.id === abilityId);
  if (!owned) return state;
  const form = formForAbility(abilityId);
  if (!form) return state;
  const duration = transformDurationForTier(abilityId, owned.tier);
  return {
    ...state,
    form,
    formMovesLeft: duration,
    abilities: decrementUse(state.abilities, abilityId),
    activeAbility: null,
    cancellableActivation: {
      abilityId,
      snapshot: {
        form: state.form,
        formMovesLeft: state.formMovesLeft,
        bonusMovesLeft: state.bonusMovesLeft,
        abilities: state.abilities,
        shieldUp: state.shieldUp,
      },
    },
  };
}

function applyAegis(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'aegis');
  if (!owned) return state;
  if (state.shieldUp) return state;
  if (owned.tier !== 5 && owned.usesLeftThisLevel === 0) return state;
  const nextAbilities =
    owned.tier === 5 ? state.abilities : decrementUse(state.abilities, 'aegis');
  return {
    ...state,
    shieldUp: true,
    abilities: nextAbilities,
    activeAbility: null,
    cancellableActivation: {
      abilityId: 'aegis',
      snapshot: {
        form: state.form,
        formMovesLeft: state.formMovesLeft,
        bonusMovesLeft: state.bonusMovesLeft,
        abilities: state.abilities,
        shieldUp: state.shieldUp,
      },
    },
  };
}

function surgeBonusForTier(tier: AbilityTier): number {
  if (tier <= 2) return 1;
  if (tier <= 4) return 2;
  return 3;
}

function applySurge(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'surge');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  const bonus = surgeBonusForTier(owned.tier);
  return {
    ...state,
    bonusMovesLeft: state.bonusMovesLeft + bonus,
    abilities: decrementUse(state.abilities, 'surge'),
    activeAbility: null,
    cancellableActivation: {
      abilityId: 'surge',
      snapshot: {
        form: state.form,
        formMovesLeft: state.formMovesLeft,
        bonusMovesLeft: state.bonusMovesLeft,
        abilities: state.abilities,
        shieldUp: state.shieldUp,
      },
    },
  };
}

export function applyAbilityMove(
  state: BoardState,
  abilityId: AbilityId,
  target: Coord,
): BoardState {
  if (!state.activeAbility || state.activeAbility.id !== abilityId) return state;
  const legals = abilityLegalMoves(state, abilityId);
  if (!legals.some((m) => m.file === target.file && m.rank === target.rank)) {
    return state;
  }

  let pieces = state.pieces;
  const captures = [...state.captures];
  const killedSquares: string[] = [];

  const captured = pieces.find(
    (p) => p.file === target.file && p.rank === target.rank,
  );
  if (captured) {
    captures.push(captured.type);
    killedSquares.push(toSquare(captured));
  }
  pieces = pieces.filter(
    (p) => !(p.file === target.file && p.rank === target.rank),
  );

  // Strip status markers from any piece that died this resolve.
  let statusOverlay: ReturnType<typeof clearStatusOnSquare> | null = null;
  let working: BoardState = state;
  for (const sq of killedSquares) {
    statusOverlay = clearStatusOnSquare(working, sq);
    working = { ...working, ...statusOverlay };
  }

  const nextMoveCount = state.moveCount + 1;
  const abilities = decrementUse(state.abilities, abilityId);

  const hasBonus = state.bonusMovesLeft > 0;
  const nextTurn: BoardState['turn'] = hasBonus ? 'rookie' : 'enemy';
  const nextBonus = hasBonus ? state.bonusMovesLeft - 1 : state.bonusMovesLeft;

  // No movement-style abilities remain in v2 — fx unchanged.
  const fxKind: null = null;

  const afterMove: BoardState = {
    ...state,
    ...(statusOverlay ?? {}),
    rookie: { ...target },
    pieces,
    captures,
    abilities,
    activeAbility: null,
    moveCount: nextMoveCount,
    bonusMovesLeft: nextBonus,
    turn: nextTurn,
    cancellableActivation: undefined,
    lastAbilityFx: fxKind
      ? {
          kind: fxKind,
          from: toSquare(state.rookie),
          to: toSquare(target),
          id: Date.now() + Math.random(),
        }
      : state.lastAbilityFx,
  };

  if (isWinningMove(state, target)) {
    return { ...afterMove, status: 'won', turn: 'rookie' };
  }
  if (afterMove.moveLimit !== null && nextMoveCount >= afterMove.moveLimit) {
    return { ...afterMove, status: 'lost', turn: 'rookie' };
  }
  return {
    ...afterMove,
    enemyMovedSquares: [],
    enemyVacatedSquares: [],
    ...(captured ? stunKingAfterCapture(state) : {}),
  };
}

export function applyAbilityTargeted(
  state: BoardState,
  abilityId: AbilityId,
  target: Coord,
): BoardState {
  if (!state.activeAbility || state.activeAbility.id !== abilityId) return state;
  const owned = state.abilities.find((a) => a.id === abilityId);
  if (!owned) return state;
  // The enemy king (Rookie's Revenge) is the objective — only Rookie herself
  // may take him. No decoy / poison / rabies / convert on the king. Freeze
  // Ray is the ONE exception: freezing the king pins him so he can't flee.
  // Magnet T5 is the second exception: the king can't be captured by it,
  // but he CAN be yanked one square (magnetLandingSquares caps his pull).
  if (
    abilityId !== 'freeze-ray' &&
    !(abilityId === 'magnet' && owned.tier === 5) &&
    state.pieces.some(
      (p) => p.type === 'king' && p.file === target.file && p.rank === target.rank,
    )
  ) {
    return state;
  }

  if (abilityId === 'decoy') {
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit) return state;
    const turns = decoyTurns(owned.tier);
    return {
      ...state,
      decoyTarget: toSquare(target),
      decoyTurnsLeft: turns,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
    };
  }

  if (abilityId === 'freeze-ray') {
    if (!isVisibleEnemy(state, target)) return state;
    const sq = toSquare(target);
    // Rookie's Revenge: a frozen KING stays pinned one extra enemy turn —
    // enough to freeze, get on his line, and take him even at T1.
    const hitKing = state.pieces.some(
      (p) => p.type === 'king' && p.file === target.file && p.rank === target.rank,
    );
    const turns = freezeTurns(owned.tier) + (hitKing ? 1 : 0);
    const frozenSquares = state.frozenSquares.includes(sq)
      ? state.frozenSquares
      : [...state.frozenSquares, sq];
    const frozenTurnsLeft = { ...state.frozenTurnsLeft, [sq]: turns };
    return {
      ...state,
      frozenSquares,
      frozenTurnsLeft,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'freeze-ray',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  if (abilityId === 'poison-dart') {
    if (!isVisibleEnemy(state, target)) return state;
    const sq = toSquare(target);
    const turns = poisonTurns(owned.tier);
    const poisonedSquares = state.poisonedSquares.includes(sq)
      ? state.poisonedSquares
      : [...state.poisonedSquares, sq];
    const poisonedTurnsLeft = { ...state.poisonedTurnsLeft, [sq]: turns };
    return {
      ...state,
      poisonedSquares,
      poisonedTurnsLeft,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'poison-dart',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  if (abilityId === 'convert') {
    const hit = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    if (!hit) return state;
    const elig = convertEligibleTypes(owned.tier);
    if (!elig.has(hit.type as 'pawn' | 'knight' | 'bishop' | 'queen')) return state;
    const sq = toSquare(target);
    const cleared = clearStatusOnSquare(state, sq);
    return {
      ...state,
      ...cleared,
      pieces: state.pieces.filter((p) => p !== hit),
      allies: [
        ...state.allies,
        { id: Date.now() + Math.random(), type: hit.type, file: hit.file, rank: hit.rank, source: 'convert' },
      ],
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'convert',
        from: toSquare(state.rookie),
        to: sq,
        id: Date.now() + Math.random(),
      },
    };
  }

  if (abilityId === 'boulder') {
    const sq = toSquare(target);
    if (!boulderTargets(state).some((c) => c.file === target.file && c.rank === target.rank)) {
      return state;
    }
    // T2+: a boulder may land ON an enemy pawn — it crushes it (counts as a
    // Rookie capture: tempo + king stun), and the square becomes the boulder.
    const crushed =
      owned.tier >= 2
        ? state.pieces.find(
            (p) => p.type === 'pawn' && p.file === target.file && p.rank === target.rank,
          )
        : undefined;
    const statusOverlay = crushed ? clearStatusOnSquare(state, sq) : null;
    const clearDecoy = !!crushed && state.decoyTarget === sq;
    // T4+: each use drops TWO boulders. The first drop of a use spends the
    // charge and owes one free follow-up placement (activeAbility stays
    // armed; cancelling forfeits it).
    const chained = (state.boulderDropsLeft ?? 0) > 0;
    const owesSecond = !chained && owned.tier >= 4;
    const next: BoardState = {
      ...state,
      ...(statusOverlay ?? {}),
      pieces: crushed ? state.pieces.filter((p) => p !== crushed) : state.pieces,
      captures: crushed ? [...state.captures, crushed.type] : state.captures,
      tempo: crushed
        ? Math.min(tempoMaxFor(state), state.tempo + (TEMPO_REWARD[crushed.type] ?? 0))
        : state.tempo,
      decoyTarget: clearDecoy ? null : state.decoyTarget,
      decoyTurnsLeft: clearDecoy ? 0 : state.decoyTurnsLeft,
      hazards: [...state.hazards, { file: target.file, rank: target.rank }],
      abilities: chained ? state.abilities : decrementUse(state.abilities, abilityId),
      activeAbility: null,
      boulderDropsLeft: undefined,
      cancellableActivation: undefined,
      ...(crushed ? stunKingAfterCapture(state) : {}),
      lastAbilityFx: {
        kind: 'boulder',
        from: toSquare(state.rookie),
        to: sq,
        id: Date.now() + Math.random(),
      },
    };
    if (owesSecond && boulderTargets(next).length > 0) {
      return {
        ...next,
        activeAbility: { id: 'boulder', step: 'pick-square' },
        boulderDropsLeft: 1,
      };
    }
    return next;
  }

  if (abilityId === 'summon-knight') {
    return applySummonKnight(state, target);
  }

  if (isSummonAbility(abilityId)) {
    return applySummonAlly(state, abilityId, target);
  }
  if (abilityId === 'swap') {
    return applySwap(state, target);
  }
  if (abilityId === 'sacrifice') {
    return applySacrifice(state, target);
  }
  if (abilityId === 'knighting') {
    return applyKnighting(state, target);
  }

  if (abilityId === 'magnet') {
    // Two taps: first pick the enemy to grab, THEN pick how far it comes —
    // the second tap lands on one of the highlighted squares along the pull
    // line. The charge is only spent when the pull resolves.
    if (state.activeAbility.step === 'pick-enemy') {
      if (!magnetTargets(state).some((c) => c.file === target.file && c.rank === target.rank)) {
        return state;
      }
      if (magnetLandingSquares(state, target, owned.tier).length === 0) return state;
      return {
        ...state,
        activeAbility: { id: 'magnet', step: 'pick-square', magnetFrom: { ...target } },
      };
    }
    const grabbed = state.activeAbility.magnetFrom;
    if (!grabbed) return state;
    const pull = magnetPullTo(state, grabbed, target, owned.tier);
    if (!pull) return state;
    const fromSq = toSquare(grabbed);
    const toSq = toSquare(pull.landing);
    const relocated = relocateStatusMarkers(state, fromSq, toSq);
    // Frozen markers follow too (a frozen piece can still be dragged).
    let frozenSquares = state.frozenSquares;
    let frozenTurnsLeft = state.frozenTurnsLeft;
    if (frozenSquares.includes(fromSq)) {
      const turns = frozenTurnsLeft[fromSq];
      frozenSquares = [...frozenSquares.filter((x) => x !== fromSq), toSq];
      frozenTurnsLeft = { ...frozenTurnsLeft };
      delete frozenTurnsLeft[fromSq];
      frozenTurnsLeft[toSq] = turns;
    }
    return {
      ...state,
      ...relocated,
      frozenSquares,
      frozenTurnsLeft,
      pieces: state.pieces.map((p) =>
        p === pull.piece ? { ...p, file: pull.landing.file, rank: pull.landing.rank } : p,
      ),
      decoyTarget: state.decoyTarget === fromSq ? toSq : state.decoyTarget,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'magnet',
        from: fromSq,
        to: toSq,
        id: Date.now() + Math.random(),
      },
    };
  }

  if (abilityId === 'rabies-dart') {
    if (!isVisibleEnemy(state, target)) return state;
    const sq = toSquare(target);
    const turns = rabiesTurns(owned.tier);
    const rabidSquares = state.rabidSquares.includes(sq)
      ? state.rabidSquares
      : [...state.rabidSquares, sq];
    const rabidTurnsLeft = { ...state.rabidTurnsLeft, [sq]: turns };
    return {
      ...state,
      rabidSquares,
      rabidTurnsLeft,
      abilities: decrementUse(state.abilities, abilityId),
      activeAbility: null,
      cancellableActivation: undefined,
      lastAbilityFx: {
        kind: 'rabies-dart',
        from: toSquare(state.rookie),
        to: toSquare(target),
        id: Date.now() + Math.random(),
      },
    };
  }

  return state;
}

/**
 * Dart-style abilities (freeze ray, poison dart, rabies dart) can target ANY
 * enemy piece on the board — no line-of-sight restriction.
 */
export function visibleEnemySquares(state: BoardState): Coord[] {
  return state.pieces.map((p) => ({ file: p.file, rank: p.rank }));
}

function isVisibleEnemy(state: BoardState, target: Coord): boolean {
  return state.pieces.some(
    (p) => p.file === target.file && p.rank === target.rank,
  );
}

function freezeTurns(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier === 4) return 3;
  if (tier === 5) return 99;
  return 2;
}

function poisonTurns(tier: AbilityTier): number {
  if (tier === 1 || tier === 2) return 3;
  if (tier === 3 || tier === 4) return 2;
  return 1;
}

function rabiesTurns(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier === 2 || tier === 3) return 2;
  if (tier === 4) return 3;
  return 5;
}

function decoyTurns(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier === 2 || tier === 3) return 2;
  if (tier === 4) return 3;
  return 99;
}

// ---------------------------------------------------------------------------
// Boulder — drop a permanent hazard on an empty square.
// ---------------------------------------------------------------------------

/**
 * Empty squares the Boulder can land on: no piece, ally, drone, hazard, or
 * Rookie — and never a square that would leave Rookie with NO legal move
 * (she can't wall herself in; a stuck rook is a softlock).
 */
export function boulderTargets(state: BoardState): Coord[] {
  // T2+: squares holding an enemy PAWN are also legal — the drop crushes it.
  const owned = state.abilities.find((a) => a.id === 'boulder');
  const canCrush = (owned?.tier ?? 1) >= 2;
  const out: Coord[] = [];
  for (let file = 1; file <= 8; file++) {
    for (let rank = 1; rank <= 8; rank++) {
      if (state.rookie.file === file && state.rookie.rank === rank) continue;
      const enemy = state.pieces.find((p) => p.file === file && p.rank === rank);
      if (enemy && !(canCrush && enemy.type === 'pawn')) continue;
      if ((state.allies ?? []).some((a) => a.file === file && a.rank === rank)) continue;
      if ((state.drones ?? []).some((d) => d.alive && d.file === file && d.rank === rank)) continue;
      if (state.hazards.some((h) => h.file === file && h.rank === rank)) continue;
      const walled: BoardState = {
        ...state,
        pieces: enemy ? state.pieces.filter((p) => p !== enemy) : state.pieces,
        hazards: [...state.hazards, { file, rank }],
      };
      if (rookieLegalMoves(walled).length === 0) continue;
      out.push({ file, rank });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Smoke — Rookie is invisible for N enemy turns.
// ---------------------------------------------------------------------------

export function smokeTurns(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier === 2 || tier === 3) return 2;
  return 3;
}

/** True while Rookie is under Smoke cover. */
export function isSmoked(state: BoardState): boolean {
  return (state.smokeTurnsLeft ?? 0) > 0;
}

function applySmoke(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'smoke');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  if (isSmoked(state)) return state;
  const rookieSq = toSquare(state.rookie);
  return {
    ...state,
    smokeTurnsLeft: smokeTurns(owned.tier),
    abilities: decrementUse(state.abilities, 'smoke'),
    activeAbility: null,
    cancellableActivation: undefined,
    lastAbilityFx: {
      kind: 'smoke',
      from: rookieSq,
      to: rookieSq,
      id: Date.now() + Math.random(),
    },
  };
}

/**
 * Smoke ends early when Rookie herself captures — except at T5. Returns the
 * patch to spread onto the post-capture state (or {} when nothing changes).
 */
export function breakSmokeOnCapture(state: BoardState): Pick<BoardState, 'smokeTurnsLeft'> | Record<string, never> {
  if (!isSmoked(state)) return {};
  const owned = state.abilities.find((a) => a.id === 'smoke');
  if (owned && owned.tier === 5) return {};
  return { smokeTurnsLeft: 0 };
}

// ---------------------------------------------------------------------------
// Rewind — ENEMY-ONLY undo (2026-09-02 redesign): the king and his court
// step back to where they were before their last turn. Rookie's move,
// captures, tempo and charges all stay. "The king takes it back. You don't."
// ---------------------------------------------------------------------------

/** A copy of `state` with no rewind stack of its own (no nesting). */
function rewindSnapshotOf(state: BoardState): BoardState {
  const snap: BoardState = { ...state };
  delete snap.enemyRewindStack;
  return snap;
}

/**
 * Give every enemy piece a stable id (preserved by spread-moves). Needed so
 * Rewind T4+ can match a piece to where IT stood two enemy turns ago.
 */
function withEnemyIds(state: BoardState): BoardState {
  if (state.pieces.every((p) => p.id !== undefined)) return state;
  let nextId = 1 + state.pieces.reduce((m, p) => Math.max(m, p.id ?? 0), 0);
  return {
    ...state,
    pieces: state.pieces.map((p) => (p.id !== undefined ? p : { ...p, id: nextId++ })),
  };
}

/**
 * Snapshot helper — called by stepEnemyTurn when a FRESH enemy phase begins
 * (the board as Rookie's side left it, before any enemy replies). Keeps the
 * last two phase-starts: [older, latest]. Restoring `latest` deletes exactly
 * the enemy reply that follows it — Rookie's own move is already inside.
 */
export function pushEnemyPhaseSnapshot(state: BoardState): BoardState {
  const withIds = withEnemyIds(state);
  const stack = withIds.enemyRewindStack ?? [];
  const last = stack[stack.length - 1];
  // Guard against double-push within one phase (each Rookie turn has a
  // unique moveCount, and one enemy phase follows each Rookie turn).
  if (last && last.moveCount === withIds.moveCount) return withIds;
  const snap = rewindSnapshotOf(withIds);
  return { ...withIds, enemyRewindStack: last ? [last, snap] : [snap] };
}

/** Can Rewind do anything right now? (Owned, has uses, has a snapshot.) */
export function canRewind(state: BoardState): boolean {
  const owned = state.abilities.find((a) => a.id === 'rewind');
  if (!owned || owned.usesLeftThisLevel === 0) return false;
  const latest = latestRewindSnapshot(state);
  // Only before Rookie acts this turn (mid-Surge-chain her extra moves are
  // not in the snapshot and must never be lost).
  return latest !== null && latest.moveCount === state.moveCount;
}

/** The board as it stood before the enemies' LAST turn (or null). */
export function latestRewindSnapshot(state: BoardState): BoardState | null {
  const stack = state.enemyRewindStack ?? [];
  return stack[stack.length - 1] ?? null;
}

/**
 * T4+: walk enemies back one MORE enemy turn. `base` is the exact undo of
 * the last enemy phase; `older` is the phase-start before that. Each piece
 * (matched by id) steps back to its older square when that square is free.
 * Pieces Rookie captured in between stay dead; status markers ride along.
 */
function mergeEnemyPositionsBack(base: BoardState, older: BoardState): BoardState {
  let cur = base;
  const occupied = new Set(cur.pieces.map((p) => toSquare(p)));
  const blocked = (c: Coord): boolean =>
    (cur.rookie.file === c.file && cur.rookie.rank === c.rank) ||
    (cur.allies ?? []).some((a) => a.file === c.file && a.rank === c.rank) ||
    allyIsHazard(cur, c.file, c.rank);
  // Multi-pass: a piece stepping back can vacate the square another needs.
  for (let pass = 0; pass < 4; pass++) {
    let changed = false;
    for (const p of cur.pieces) {
      if (p.id === undefined) continue;
      const was = older.pieces.find((o) => o.id === p.id);
      if (!was || (was.file === p.file && was.rank === p.rank)) continue;
      const destSq = toSquare(was);
      if (occupied.has(destSq) || blocked(was)) continue;
      const fromSq = toSquare(p);
      occupied.delete(fromSq);
      occupied.add(destSq);
      cur = {
        ...cur,
        ...relocateStatusMarkers(cur, fromSq, destSq),
        pieces: cur.pieces.map((x) =>
          x === p ? { ...x, file: was.file, rank: was.rank } : x,
        ),
        decoyTarget: cur.decoyTarget === fromSq ? destSq : cur.decoyTarget,
      };
      // Frozen markers follow the piece too.
      if (cur.frozenSquares.includes(fromSq)) {
        const turns = cur.frozenTurnsLeft[fromSq];
        const frozenTurnsLeft = { ...cur.frozenTurnsLeft };
        delete frozenTurnsLeft[fromSq];
        frozenTurnsLeft[destSq] = turns;
        cur = {
          ...cur,
          frozenSquares: [...cur.frozenSquares.filter((s) => s !== fromSq), destSq],
          frozenTurnsLeft,
        };
      }
      changed = true;
    }
    if (!changed) break;
  }
  return cur;
}

function applyRewind(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'rewind');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  const stack = state.enemyRewindStack ?? [];
  const latest = stack[stack.length - 1];
  if (!latest) return state;
  // Never undo Rookie's OWN moves: mid-Surge-chain the snapshot predates her
  // extra moves this turn — refuse until the next enemy phase re-arms.
  if (latest.moveCount !== state.moveCount) return state;
  // T4+: the undo reaches back TWO enemy turns when two are on record.
  const older = owned.tier >= 4 && stack.length >= 2 ? stack[stack.length - 2] : null;
  let snap = latest;
  if (older) snap = mergeEnemyPositionsBack(latest, older);
  // T5 signature: every piece the rewind MOVED (or brought back) is frozen
  // for the replayed turn.
  let frozenSquares = snap.frozenSquares;
  let frozenTurnsLeft = snap.frozenTurnsLeft;
  if (owned.tier >= 5) {
    frozenSquares = [...frozenSquares];
    frozenTurnsLeft = { ...frozenTurnsLeft };
    for (const p of snap.pieces) {
      const now = p.id !== undefined
        ? state.pieces.find((x) => x.id === p.id)
        : state.pieces.find((x) => x.file === p.file && x.rank === p.rank && x.type === p.type);
      const moved = !now || now.file !== p.file || now.rank !== p.rank;
      if (!moved) continue;
      const sq = toSquare(p);
      if (!frozenSquares.includes(sq)) frozenSquares.push(sq);
      frozenTurnsLeft[sq] = Math.max(frozenTurnsLeft[sq] ?? 0, 1);
    }
  }
  return {
    ...snap,
    // Enemy-only: Rookie's side is untouched — she hasn't moved since the
    // snapshot, and her charges are simply what she has now (minus this use).
    // Tempo, captures and any offer resolved since the snapshot stay too
    // ("your position, captures, tempo and charges stay").
    abilities: decrementUse(state.abilities, 'rewind'),
    tempo: state.tempo,
    captures: state.captures,
    pendingOffer: state.pendingOffer,
    offerReason: state.offerReason,
    turn: 'rookie',
    status: 'playing',
    enemyMovedSquares: [],
    enemyVacatedSquares: [],
    frozenSquares,
    frozenTurnsLeft,
    // T3+: the king is stunned while his court replays the turn.
    ...(owned.tier >= 3 && snap.winCondition === 'king'
      ? { kingStunTurns: Math.max(1, snap.kingStunTurns ?? 0) }
      : {}),
    activeAbility: null,
    cancellableActivation: undefined,
    // No chaining: the cast clears the stack; the next enemy phase re-arms it.
    enemyRewindStack: [],
    // Carry the CURRENT transient fx ids so restoring an older state can't
    // re-fire an old animation.
    lastAegisIntercept: state.lastAegisIntercept,
    lastImperviousBounce: state.lastImperviousBounce,
    lastPoisonDeath: state.lastPoisonDeath,
    lastEnemyCaptureFx: state.lastEnemyCaptureFx,
    lastAbilityFx: {
      kind: 'rewind',
      from: toSquare(state.rookie),
      to: toSquare(snap.rookie),
      id: Date.now() + Math.random(),
    },
  };
}

// ---------------------------------------------------------------------------
// Magnet — yank an enemy on Rookie's line toward her.
// ---------------------------------------------------------------------------

/** How many squares Magnet pulls at a tier. 99 = all the way. */
export function magnetPullDistance(tier: AbilityTier): number {
  // 2/3/3/any/any (T1 tuned 1→2 — a one-square tug rarely moves a guard off a line).
  if (tier === 1) return 2;
  if (tier <= 3) return 3;
  return 99;
}

/** Directions Rookie's CURRENT form slides in (used for Magnet lines). */
function magnetDirs(form: RookieForm): ReadonlyArray<[number, number]> {
  if (form === 'bishop') return ALLY_BISHOP_DIRS;
  if (form === 'queen') return ALLY_QUEEN_DIRS;
  // Rook — and knight / king / pawn forms fall back to her home lines.
  return ALLY_ROOK_DIRS;
}

/**
 * Enemies Magnet can grab: the FIRST piece along each of Rookie's lines with
 * nothing (piece, ally, hazard) between, at distance ≥ 2 (a piece already
 * touching her can't be pulled closer). Never the king.
 */
export function magnetTargets(state: BoardState): Coord[] {
  const owned = state.abilities.find((a) => a.id === 'magnet');
  const out: Coord[] = [];
  for (const [df, dr] of magnetDirs(state.form)) {
    let f = state.rookie.file + df;
    let r = state.rookie.rank + dr;
    let dist = 1;
    while (allyInBounds(f, r)) {
      if (allyIsHazard(state, f, r)) break;
      if ((state.allies ?? []).some((a) => a.file === f && a.rank === r)) break;
      const enemy = state.pieces.find((p) => p.file === f && p.rank === r);
      if (enemy) {
        // T5 signature: even the KING can be grabbed (magnetLandingSquares caps his
        // pull at one square — a yank, not a kidnapping).
        const kingOk = enemy.type === 'king' && (owned?.tier ?? 1) === 5;
        if ((enemy.type !== 'king' || kingOk) && dist >= 2) out.push({ file: f, rank: r });
        break;
      }
      f += df;
      r += dr;
      dist += 1;
    }
  }
  return out;
}

/**
 * Squares the grabbed enemy may land on: every open square along the pull
 * line toward Rookie, distance 1..tierMax — the PLAYER picks how far the
 * pull goes by tapping one of them. Stops before Rookie, another piece, an
 * ally, or a hazard. The king (T5 only) is yanked exactly ONE square.
 */
export function magnetLandingSquares(
  state: BoardState,
  target: Coord,
  tier: AbilityTier,
): Coord[] {
  const piece = state.pieces.find((p) => p.file === target.file && p.rank === target.rank);
  if (!piece) return [];
  const df = Math.sign(state.rookie.file - target.file);
  const dr = Math.sign(state.rookie.rank - target.rank);
  const max = piece.type === 'king' ? 1 : magnetPullDistance(tier);
  const out: Coord[] = [];
  let f = target.file;
  let r = target.rank;
  let steps = 0;
  while (steps < max) {
    const nf = f + df;
    const nr = r + dr;
    // Stop before Rookie, another piece, an ally, or a hazard.
    if (state.rookie.file === nf && state.rookie.rank === nr) break;
    if (state.pieces.some((p) => p.file === nf && p.rank === nr)) break;
    if ((state.allies ?? []).some((a) => a.file === nf && a.rank === nr)) break;
    if (allyIsHazard(state, nf, nr)) break;
    f = nf;
    r = nr;
    steps += 1;
    out.push({ file: f, rank: r });
  }
  return out;
}

/** Resolve a Magnet pull to a CHOSEN landing square. Null = illegal. */
export function magnetPullTo(
  state: BoardState,
  target: Coord,
  landing: Coord,
  tier: AbilityTier,
): { piece: EnemyPiece; landing: Coord } | null {
  if (!magnetTargets(state).some((c) => c.file === target.file && c.rank === target.rank)) {
    return null;
  }
  const piece = state.pieces.find((p) => p.file === target.file && p.rank === target.rank);
  if (!piece) return null;
  const legal = magnetLandingSquares(state, target, tier);
  if (!legal.some((c) => c.file === landing.file && c.rank === landing.rank)) return null;
  return { piece, landing };
}

// ---------------------------------------------------------------------------
// Bodyguard — a rainbow rook ally spawns beside Rookie for N enemy turns.
// ---------------------------------------------------------------------------

export function bodyguardTurns(tier: AbilityTier): number {
  // 2/2/3/3/level (T1 tuned 1→2 — a one-turn rook is gone before it matters).
  if (tier <= 2) return 2;
  if (tier <= 4) return 3;
  return 999;
}

/** Free square adjacent to Rookie for the Bodyguard — prefers the square between her and the nearest enemy. */
export function bodyguardSpawnSquare(state: BoardState): Coord | null {
  const free: Coord[] = [];
  for (const [df, dr] of ALLY_QUEEN_DIRS) {
    const f = state.rookie.file + df;
    const r = state.rookie.rank + dr;
    if (!allyInBounds(f, r)) continue;
    if (allyIsHazard(state, f, r)) continue;
    if (state.pieces.some((p) => p.file === f && p.rank === r)) continue;
    if ((state.allies ?? []).some((a) => a.file === f && a.rank === r)) continue;
    free.push({ file: f, rank: r });
  }
  if (free.length === 0) return null;
  const threats = state.pieces.filter((p) => p.type !== 'king');
  const pool = threats.length > 0 ? threats : state.pieces;
  if (pool.length === 0) return free[0];
  const cheb = (a: Coord, b: Coord) => Math.max(Math.abs(a.file - b.file), Math.abs(a.rank - b.rank));
  let nearest = pool[0];
  for (const p of pool) if (cheb(p, state.rookie) < cheb(nearest, state.rookie)) nearest = p;
  let best = free[0];
  for (const c of free) if (cheb(c, nearest) < cheb(best, nearest)) best = c;
  return best;
}

function applyBodyguard(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'bodyguard');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  const spot = bodyguardSpawnSquare(state);
  if (!spot) return state;
  const ally: AllyPiece = {
    id: Date.now() + Math.random(),
    type: 'rook',
    file: spot.file,
    rank: spot.rank,
    source: 'bodyguard',
    turnsLeft: bodyguardTurns(owned.tier),
  };
  return {
    ...state,
    allies: [...state.allies, ally],
    abilities: decrementUse(state.abilities, 'bodyguard'),
    activeAbility: null,
    cancellableActivation: undefined,
    lastAbilityFx: {
      kind: 'bodyguard',
      from: toSquare(state.rookie),
      to: toSquare(spot),
      id: Date.now() + Math.random(),
    },
  };
}

// ---------------------------------------------------------------------------
// Squire (summon-knight) — a rainbow knight the PLAYER controls.
//
// A second BODY, not just tempo: it blocks lines, enemies hunt it like any
// ally (captured = gone), and it captures like a knight — including the
// king, which wins the level. On your turn you move Rookie OR the Squire
// (T1–T4). At T5 the Squire's move is a free action: move him, then her.
// ---------------------------------------------------------------------------

/** Enemy turns the Squire stays on the board. 6 / 9 / 9 / level / level. */
export function squireTurns(tier: AbilityTier): number {
  if (tier === 1) return 6;
  if (tier <= 3) return 9;
  return 999;
}

/** T5: the Squire's move does not end the turn (once per turn). */
export function squireMoveIsFree(state: BoardState): boolean {
  const owned = state.abilities.find((a) => a.id === 'summon-knight');
  return !!owned && owned.tier === 5;
}

/** The living Squire, if any. */
export function squireOf(state: BoardState): AllyPiece | null {
  return (state.allies ?? []).find((a) => a.source === 'squire') ?? null;
}

/** Empty squares in the 8-neighbourhood of Rookie where a Squire may appear. */
export function squireSpawnSquares(state: BoardState): Coord[] {
  const out: Coord[] = [];
  if (squireOf(state)) return out; // one Squire at a time
  for (const [df, dr] of ALLY_QUEEN_DIRS) {
    const f = state.rookie.file + df;
    const r = state.rookie.rank + dr;
    if (!allyInBounds(f, r)) continue;
    if (allyIsHazard(state, f, r)) continue;
    if (state.pieces.some((p) => p.file === f && p.rank === r)) continue;
    if ((state.allies ?? []).some((a) => a.file === f && a.rank === r)) continue;
    if ((state.drones ?? []).some((d) => d.alive && d.file === f && d.rank === r)) continue;
    out.push({ file: f, rank: r });
  }
  return out;
}

function applySummonKnight(state: BoardState, target: Coord): BoardState {
  const owned = state.abilities.find((a) => a.id === 'summon-knight');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  if (!squireSpawnSquares(state).some((c) => c.file === target.file && c.rank === target.rank)) {
    return state;
  }
  const ally: AllyPiece = {
    id: Date.now() + Math.random(),
    type: 'knight',
    file: target.file,
    rank: target.rank,
    source: 'squire',
    turnsLeft: squireTurns(owned.tier),
  };
  return {
    ...state,
    allies: [...state.allies, ally],
    abilities: decrementUse(state.abilities, 'summon-knight'),
    activeAbility: null,
    cancellableActivation: undefined,
    lastAbilityFx: {
      kind: 'summon-knight',
      from: toSquare(state.rookie),
      to: toSquare(target),
      id: Date.now() + Math.random(),
    },
  };
}

/** True when the player may move the Squire right now. */
export function canMoveSquire(state: BoardState): boolean {
  const sq = squireOf(state);
  return !!sq && canMoveAllyAt(state, sq);
}

/**
 * Squares the Squire may move to (knight jumps). Unlike AI allies it MAY
 * land on the enemy king — that capture wins the level.
 */
export function squireLegalMoves(state: BoardState): Coord[] {
  const sq = squireOf(state);
  if (!sq) return [];
  return controlledAllyLegalMoves(state, sq);
}

/**
 * Move the Squire. T1–T4: this IS your move for the turn (one body per
 * turn) — it ticks the move budget and hands off to the enemy exactly like
 * a Rookie move. T5: free action, once per turn; Rookie still moves after.
 * (Now a wrapper over the generic controlled-ally move below.)
 */
export function applySquireMove(state: BoardState, target: Coord): BoardState {
  const sq = squireOf(state);
  if (!sq) return state;
  return applyControlledAllyMove(state, { file: sq.file, rank: sq.rank }, target);
}

// ---------------------------------------------------------------------------
// Controllable summons — the Squire FAMILY (2026-09-01).
//
// One shared engine for every piece the PLAYER summons and steers on her own
// turns: Squire (knight), Bishop Squire, Page (pawn that promotes), Twin
// (rook), Duchess (queen), Vanguard (dropped knight). All of them:
//   - are rainbow allies enemies hunt like any other (captured = gone),
//   - block lines, and their attack squares are squares the king won't enter,
//   - MAY capture the enemy king — that wins the level (hence one charge per
//     run, see ONE_CHARGE_PER_RUN),
//   - move INSTEAD of Rookie (T1–T4); a T5 Squire/Bishop Squire/Twin's move
//     is a free action, once per turn.
// Swap / Sacrifice / Knighting are support cards that operate ON a summon.
// ---------------------------------------------------------------------------

/** Ally sources the player controls directly. */
export const CONTROLLED_SOURCES: ReadonlySet<AllyPiece['source']> = new Set([
  'squire',
  'bishop-squire',
  'page',
  'twin',
  'duchess',
  'dragon',
  'vanguard',
] as AllyPiece['source'][]);

export function isControlledAlly(a: AllyPiece): boolean {
  return CONTROLLED_SOURCES.has(a.source);
}

/** All living controlled summons. */
export function controlledAllies(state: BoardState): AllyPiece[] {
  return (state.allies ?? []).filter(isControlledAlly);
}

/** The controlled summon standing on a square, if any. */
export function controlledAllyAt(state: BoardState, c: Coord): AllyPiece | null {
  return controlledAllies(state).find((a) => a.file === c.file && a.rank === c.rank) ?? null;
}

/** Spawn abilities in the family (each spawns exactly one source kind). */
const SUMMON_ABILITIES: ReadonlyArray<AbilityId> = [
  'bishop-squire',
  'page',
  'twin',
  'duchess',
  'dragon',
  'vanguard',
];

export function isSummonAbility(id: AbilityId): boolean {
  return (SUMMON_ABILITIES as ReadonlyArray<string>).includes(id);
}

/** Which ability owns a controlled source (for tier lookups). */
const ABILITY_FOR_SOURCE: Partial<Record<AllyPiece['source'], AbilityId>> = {
  squire: 'summon-knight',
  'bishop-squire': 'bishop-squire',
  page: 'page',
  twin: 'twin',
  duchess: 'duchess',
  dragon: 'dragon',
  vanguard: 'vanguard',
};

function ownedAbilityForSource(
  state: BoardState,
  source: AllyPiece['source'],
): OwnedAbility | null {
  const id = ABILITY_FOR_SOURCE[source];
  if (!id) return null;
  return state.abilities.find((a) => a.id === id) ?? null;
}

/** Piece type a summon ability spawns. */
function summonPieceFor(id: AbilityId): AllyPiece['type'] {
  if (id === 'bishop-squire') return 'bishop';
  if (id === 'page') return 'pawn';
  if (id === 'twin') return 'rook';
  if (id === 'duchess') return 'queen';
  // Dragon renders as a rainbow queen; her queen+knight moves are keyed on
  // source === 'dragon', not on the piece type.
  if (id === 'dragon') return 'queen';
  return 'knight'; // vanguard (and summon-knight, handled separately)
}

/**
 * Enemy turns a summon stays on the board. undefined = permanent until
 * captured (the Page — his whole job is the long walk to promotion).
 */
export function summonTurnsFor(id: AbilityId, tier: AbilityTier): number | undefined {
  if (id === 'bishop-squire') {
    // Mirror the Squire: 6/9/9/level/level.
    if (tier === 1) return 6;
    if (tier <= 3) return 9;
    return 999;
  }
  if (id === 'page') return undefined;
  if (id === 'twin') {
    // 4/6/8/level/level — a second rook is the strongest body; short leash early.
    if (tier === 1) return 4;
    if (tier === 2) return 6;
    if (tier === 3) return 8;
    return 999;
  }
  if (id === 'duchess') {
    // 2/3/4/4/6 — a queen on a timer.
    if (tier === 1) return 2;
    if (tier === 2) return 3;
    if (tier <= 4) return 4;
    return 6;
  }
  if (id === 'dragon') {
    // 2/3/4/4/5 — the Amazon (queen+knight) lives on the shortest leash in
    // the family. T4 keeps 4 turns; its delta is the 2-turn capture stun.
    if (tier === 1) return 2;
    if (tier === 2) return 3;
    if (tier <= 4) return 4;
    return 5;
  }
  if (id === 'vanguard') {
    // 4/6/8/8/level.
    if (tier === 1) return 4;
    if (tier === 2) return 6;
    if (tier <= 4) return 8;
    return 999;
  }
  return undefined;
}

/**
 * Vanguard drop radius (Chebyshev from Rookie). NEVER the whole board —
 * unrestricted placement let players drop the knight beside the king for
 * free (Tyler playtest, 2026-09-02). The range grows with tier but the drop
 * always has to be fought forward from where Rookie stands.
 */
export function vanguardRangeFor(tier: AbilityTier): number {
  if (tier === 1) return 2;
  if (tier === 2) return 3;
  if (tier <= 4) return 4;
  return 5;
}

function squareIsFreeForSummon(state: BoardState, f: number, r: number): boolean {
  if (!allyInBounds(f, r)) return false;
  if (allyIsHazard(state, f, r)) return false;
  if (state.rookie.file === f && state.rookie.rank === r) return false;
  if (state.pieces.some((p) => p.file === f && p.rank === r)) return false;
  if ((state.allies ?? []).some((a) => a.file === f && a.rank === r)) return false;
  if ((state.drones ?? []).some((d) => d.alive && d.file === f && d.rank === r)) return false;
  return true;
}

/**
 * Squares a summon ability may spawn on. Beside Rookie for the summons-at-
 * her-side; anywhere in range for the Vanguard. One living summon per
 * source at a time (a second charge re-summons after he's taken).
 */
export function summonSpawnSquares(state: BoardState, id: AbilityId): Coord[] {
  const source = id as AllyPiece['source'];
  if ((state.allies ?? []).some((a) => a.source === source)) return [];
  const out: Coord[] = [];
  if (id === 'vanguard') {
    const owned = state.abilities.find((a) => a.id === 'vanguard');
    const range = vanguardRangeFor(owned?.tier ?? 1);
    for (let f = 1; f <= 8; f++) {
      for (let r = 1; r <= 8; r++) {
        const d = Math.max(Math.abs(f - state.rookie.file), Math.abs(r - state.rookie.rank));
        if (d > range) continue;
        if (squareIsFreeForSummon(state, f, r)) out.push({ file: f, rank: r });
      }
    }
    return out;
  }
  // Dragon T5: summon her anywhere within 3 squares of Rookie (Chebyshev).
  // T1-T4 place adjacent like the rest of the family (loop below).
  if (id === 'dragon') {
    const owned = state.abilities.find((a) => a.id === 'dragon');
    if ((owned?.tier ?? 1) === 5) {
      for (let f = 1; f <= 8; f++) {
        for (let r = 1; r <= 8; r++) {
          const d = Math.max(Math.abs(f - state.rookie.file), Math.abs(r - state.rookie.rank));
          if (d > 3) continue;
          if (squareIsFreeForSummon(state, f, r)) out.push({ file: f, rank: r });
        }
      }
      return out;
    }
  }
  for (const [df, dr] of ALLY_QUEEN_DIRS) {
    const f = state.rookie.file + df;
    const r = state.rookie.rank + dr;
    if (squareIsFreeForSummon(state, f, r)) out.push({ file: f, rank: r });
  }
  return out;
}

function applySummonAlly(state: BoardState, id: AbilityId, target: Coord): BoardState {
  const owned = state.abilities.find((a) => a.id === id);
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  if (!summonSpawnSquares(state, id).some((c) => c.file === target.file && c.rank === target.rank)) {
    return state;
  }
  const turns = summonTurnsFor(id, owned.tier);
  const ally: AllyPiece = {
    id: Date.now() + Math.random(),
    type: summonPieceFor(id),
    file: target.file,
    rank: target.rank,
    source: id as AllyPiece['source'],
    ...(turns !== undefined ? { turnsLeft: turns } : {}),
  };
  return {
    ...state,
    allies: [...state.allies, ally],
    abilities: decrementUse(state.abilities, id),
    activeAbility: null,
    cancellableActivation: undefined,
    lastAbilityFx: {
      kind: 'summon-knight', // same rainbow-bloom VFX as the Squire
      from: toSquare(state.rookie),
      to: toSquare(target),
      id: Date.now() + Math.random(),
    },
  };
}

/** T5 Squire / Bishop Squire / Twin: their move is a FREE action, once per turn. */
export function allyHasFreeMove(state: BoardState, ally: AllyPiece): boolean {
  if (ally.source !== 'squire' && ally.source !== 'bishop-squire' && ally.source !== 'twin') {
    return false;
  }
  const owned = ownedAbilityForSource(state, ally.source);
  return !!owned && owned.tier === 5;
}

/** True when the player may move this controlled summon right now. */
export function canMoveAllyAt(state: BoardState, ally: AllyPiece): boolean {
  if (state.status !== 'playing' || state.turn !== 'rookie') return false;
  if (state.pendingOffer || state.activeAbility) return false;
  if (!isControlledAlly(ally)) return false;
  if (allyHasFreeMove(state, ally)) {
    if (ally.movedThisTurn) return false;
    if (ally.source === 'squire' && state.squireMovedThisTurn) return false;
  }
  return true;
}

/** Page forward reach: T2+ he may step 2 when clear; T4+ a 3-square sprint. */
function pageSprintSteps(state: BoardState, ally: AllyPiece): number {
  if (ally.source !== 'page') return 1;
  const owned = ownedAbilityForSource(state, 'page');
  if (!owned) return 1;
  if (owned.tier >= 4) return 3;
  if (owned.tier >= 2) return 2;
  return 1;
}

/**
 * Squares a controlled summon may move to, by its CURRENT piece type.
 * Unlike AI allies it MAY land on the enemy king — that capture wins.
 */
export function controlledAllyLegalMoves(state: BoardState, ally: AllyPiece): Coord[] {
  const out: Coord[] = [];
  const tryStep = (f: number, r: number): boolean => {
    // Returns true if the slide may continue past (f, r).
    if (!allyInBounds(f, r)) return false;
    if (allyIsHazard(state, f, r)) return false;
    if (allyOccupied(state, f, r, ally)) return false;
    const enemy = state.pieces.find((p) => p.file === f && p.rank === r);
    out.push({ file: f, rank: r });
    return !enemy;
  };
  switch (ally.type) {
    case 'knight':
      for (const [df, dr] of ALLY_KNIGHT_DELTAS) tryStep(ally.file + df, ally.rank + dr);
      return out;
    case 'pawn': {
      // Forward (toward rank 8) when empty; diagonal captures (king included).
      const f1 = ally.rank + 1;
      const emptyAt = (f: number, r: number) =>
        allyInBounds(f, r) &&
        !allyIsHazard(state, f, r) &&
        !allyOccupied(state, f, r, ally) &&
        !state.pieces.some((p) => p.file === f && p.rank === r);
      if (emptyAt(ally.file, f1)) {
        out.push({ file: ally.file, rank: f1 });
        const sprint = pageSprintSteps(state, ally);
        for (let extra = 1; extra < sprint; extra++) {
          if (!emptyAt(ally.file, f1 + extra)) break;
          out.push({ file: ally.file, rank: f1 + extra });
        }
      }
      for (const df of [-1, 1]) {
        const f = ally.file + df;
        if (!allyInBounds(f, f1)) continue;
        if (allyIsHazard(state, f, f1)) continue;
        if (allyOccupied(state, f, f1, ally)) continue;
        if (state.pieces.some((p) => p.file === f && p.rank === f1)) {
          out.push({ file: f, rank: f1 });
        }
      }
      return out;
    }
    case 'bishop':
    case 'rook':
    case 'queen': {
      const dirs =
        ally.type === 'queen' ? ALLY_QUEEN_DIRS : ally.type === 'rook' ? ALLY_ROOK_DIRS : ALLY_BISHOP_DIRS;
      for (const [df, dr] of dirs) {
        let f = ally.file + df;
        let r = ally.rank + dr;
        while (tryStep(f, r)) {
          f += df;
          r += dr;
        }
      }
      // Dragon: the Amazon — queen rays PLUS knight jumps. (A knight square
      // is never on a queen line from the same origin, so no duplicates.)
      if (ally.source === 'dragon') {
        for (const [df, dr] of ALLY_KNIGHT_DELTAS) tryStep(ally.file + df, ally.rank + dr);
      }
      return out;
    }
    case 'king':
      return out; // summons are never kings
  }
}

/**
 * Move a controlled summon. T1–T4 (and every non-free summon): this IS your
 * move for the turn — it ticks the move budget and hands off exactly like a
 * Rookie move. Free-move summons (T5 Squire/Bishop Squire/Twin): once per
 * turn, Rookie still moves after. The Page promotes to a controlled QUEEN
 * when he reaches his promotion rank (8, or 7 from T3; any capture at T5).
 */
export function applyControlledAllyMove(
  state: BoardState,
  from: Coord,
  target: Coord,
): BoardState {
  const ally = controlledAllyAt(state, from);
  if (!ally || !canMoveAllyAt(state, ally)) return state;
  if (!controlledAllyLegalMoves(state, ally).some((m) => m.file === target.file && m.rank === target.rank)) {
    return state;
  }
  const captured = state.pieces.find((p) => p.file === target.file && p.rank === target.rank);
  const targetSq = toSquare(target);
  const statusOverlay = captured ? clearStatusOnSquare(state, targetSq) : null;
  const clearDecoy = !!captured && state.decoyTarget === targetSq;
  const gain = captured ? TEMPO_REWARD[captured.type] ?? 0 : 0;
  const tempo = Math.min(tempoMaxFor(state), state.tempo + gain);
  const isFree = allyHasFreeMove(state, ally);
  // Dragon T4+ signature: her captures hit HARD — the king is stunned 2
  // turns (every summon capture already stuns him 1, same as Rookie's).
  const stunTurns =
    ally.source === 'dragon' && (ownedAbilityForSource(state, 'dragon')?.tier ?? 1) >= 4 ? 2 : 1;

  // Page promotion.
  let nextType = ally.type;
  if (ally.type === 'pawn' && ally.source === 'page') {
    const owned = ownedAbilityForSource(state, 'page');
    const tier = owned?.tier ?? 1;
    const promoteRank = tier >= 3 ? 7 : 8;
    if (target.rank >= promoteRank || (tier === 5 && !!captured)) nextType = 'queen';
  } else if (ally.type === 'pawn' && target.rank === 8) {
    nextType = 'queen';
  }

  const allies = state.allies.map((a) =>
    a === ally
      ? {
          ...a,
          file: target.file,
          rank: target.rank,
          type: nextType,
          ...(isFree ? { movedThisTurn: true } : {}),
        }
      : a,
  );
  const base: BoardState = {
    ...state,
    ...(statusOverlay ?? {}),
    allies,
    pieces: captured ? state.pieces.filter((p) => p !== captured) : state.pieces,
    captures: captured ? [...state.captures, captured.type] : state.captures,
    tempo,
    decoyTarget: clearDecoy ? null : state.decoyTarget,
    decoyTurnsLeft: clearDecoy ? 0 : state.decoyTurnsLeft,
    cancellableActivation: undefined,
    ...(captured ? stunKingAfterCapture(state, stunTurns) : {}),
  };

  // Taking the king wins the level (the 'king' win condition).
  if (captured?.type === 'king' && state.winCondition === 'king') {
    return { ...base, status: 'won', turn: 'rookie' };
  }

  if (isFree) {
    return {
      ...base,
      ...(ally.source === 'squire' ? { squireMovedThisTurn: true } : {}),
    };
  }

  // One body per turn: the summon's move ends the turn like Rookie's would.
  const nextMoveCount = state.moveCount + 1;
  const hasBonus = state.bonusMovesLeft > 0;
  const afterMove: BoardState = {
    ...base,
    moveCount: nextMoveCount,
    bonusMovesLeft: hasBonus ? state.bonusMovesLeft - 1 : state.bonusMovesLeft,
    turn: hasBonus ? 'rookie' : 'enemy',
  };
  if (afterMove.moveLimit !== null && nextMoveCount >= afterMove.moveLimit) {
    return { ...afterMove, status: 'lost', turn: 'rookie' };
  }
  if (!hasBonus && allies.some((a) => !isControlledAlly(a))) {
    return { ...afterMove, turn: 'allies', allyTurnIndex: 0, enemyMovedSquares: [], enemyVacatedSquares: [] };
  }
  return { ...afterMove, enemyMovedSquares: [], enemyVacatedSquares: [] };
}

/**
 * True when a controlled summon can capture the given square RIGHT NOW.
 * Used by the fleeing king — he fears every summon the way he fears the
 * Squire (they may take him).
 */
export function controlledThreatensSquare(state: BoardState, c: Coord): boolean {
  for (const a of controlledAllies(state)) {
    if (controlledAllyLegalMoves(state, a).some((m) => m.file === c.file && m.rank === c.rank)) {
      return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Swap / Sacrifice / Knighting — support cards that operate ON a summon.
// All three are FREE actions (like darts): they resolve without ending the
// turn, limited by their per-level uses.
// ---------------------------------------------------------------------------

/** Allies Swap may trade squares with. T4+: any rainbow ally. */
export function swapTargets(state: BoardState): Coord[] {
  const owned = state.abilities.find((a) => a.id === 'swap');
  if (!owned) return [];
  const pool = owned.tier >= 4 ? state.allies ?? [] : controlledAllies(state);
  return pool.map((a) => ({ file: a.file, rank: a.rank }));
}

function applySwap(state: BoardState, target: Coord): BoardState {
  const owned = state.abilities.find((a) => a.id === 'swap');
  if (!owned || owned.usesLeftThisLevel === 0) return state;
  if (!swapTargets(state).some((c) => c.file === target.file && c.rank === target.rank)) return state;
  const ally = (state.allies ?? []).find((a) => a.file === target.file && a.rank === target.rank);
  if (!ally) return state;
  const rookieWas = { file: state.rookie.file, rank: state.rookie.rank };
  return {
    ...state,
    rookie: { file: ally.file, rank: ally.rank },
    allies: state.allies.map((a) =>
      a === ally
        ? {
            ...a,
            file: rookieWas.file,
            rank: rookieWas.rank,
            // T2+: the trade winds its clock — the summon fights 2 turns longer.
            ...(owned.tier >= 2 && a.turnsLeft !== undefined
              ? { turnsLeft: a.turnsLeft + 2 }
              : {}),
          }
        : a,
    ),
    abilities: decrementUse(state.abilities, 'swap'),
    activeAbility: null,
    cancellableActivation: undefined,
    lastAbilityFx: {
      kind: 'summon-knight',
      from: toSquare(rookieWas),
      to: toSquare(target),
      id: Date.now() + Math.random(),
    },
  };
}

/** Squares a single ally attacks from where it stands (for the Sacrifice blast). */
function attackSquaresOfAlly(state: BoardState, a: AllyPiece): Coord[] {
  const out: Coord[] = [];
  const add = (f: number, r: number) => {
    if (allyInBounds(f, r)) out.push({ file: f, rank: r });
  };
  switch (a.type) {
    case 'pawn':
      add(a.file - 1, a.rank + 1);
      add(a.file + 1, a.rank + 1);
      break;
    case 'knight':
      for (const [df, dr] of ALLY_KNIGHT_DELTAS) add(a.file + df, a.rank + dr);
      break;
    case 'bishop':
    case 'rook':
    case 'queen': {
      const dirs = a.type === 'queen' ? ALLY_QUEEN_DIRS : a.type === 'rook' ? ALLY_ROOK_DIRS : ALLY_BISHOP_DIRS;
      for (const [df, dr] of dirs) {
        let f = a.file + df;
        let r = a.rank + dr;
        while (allyInBounds(f, r)) {
          if (allyIsHazard(state, f, r)) break;
          add(f, r);
          if (state.rookie.file === f && state.rookie.rank === r) break;
          if (state.allies.some((o) => o !== a && o.file === f && o.rank === r)) break;
          if (state.pieces.some((p) => p.file === f && p.rank === r)) break;
          f += df;
          r += dr;
        }
      }
      // Dragon: knight squares join the blast — detonating her is enormous.
      if (a.source === 'dragon') {
        for (const [df, dr] of ALLY_KNIGHT_DELTAS) add(a.file + df, a.rank + dr);
      }
      break;
    }
    case 'king':
      break;
  }
  return out;
}

/** Summons Sacrifice may detonate. */
export function sacrificeTargets(state: BoardState): Coord[] {
  const owned = state.abilities.find((a) => a.id === 'sacrifice');
  if (!owned) return [];
  return controlledAllies(state).map((a) => ({ file: a.file, rank: a.rank }));
}

function applySacrifice(state: BoardState, target: Coord): BoardState {
  const owned = state.abilities.find((a) => a.id === 'sacrifice');
  if (!owned || owned.usesLeftThisLevel === 0) return state;
  const ally = controlledAllyAt(state, target);
  if (!ally) return state;
  // Blast area: the squares this summon attacks; from T3 also every square
  // beside it; from T4 everything within 2 squares. The king is never
  // captured by the blast — but the mass capture stuns him hard (2 turns;
  // 3 at T5).
  const blast = new Map<string, Coord>();
  for (const c of attackSquaresOfAlly(state, ally)) blast.set(toSquare(c), c);
  if (owned.tier >= 3) {
    const ring = owned.tier >= 4 ? 2 : 1;
    for (let df = -ring; df <= ring; df++) {
      for (let dr = -ring; dr <= ring; dr++) {
        if (df === 0 && dr === 0) continue;
        const f = ally.file + df;
        const r = ally.rank + dr;
        if (allyInBounds(f, r)) blast.set(toSquare({ file: f, rank: r }), { file: f, rank: r });
      }
    }
  }
  const victims = state.pieces.filter(
    (p) => p.type !== 'king' && blast.has(toSquare({ file: p.file, rank: p.rank })),
  );
  let working: BoardState = state;
  const captures = [...state.captures];
  let tempo = state.tempo;
  for (const v of victims) {
    const sq = toSquare({ file: v.file, rank: v.rank });
    working = { ...working, ...clearStatusOnSquare(working, sq) };
    captures.push(v.type);
    tempo = Math.min(tempoMaxFor(state), tempo + (TEMPO_REWARD[v.type] ?? 0));
  }
  // T2+: the shockwave stuns — surviving enemies beside the summon are
  // frozen for a turn (the king has his own stun below).
  let frozenSquares = working.frozenSquares;
  let frozenTurnsLeft = working.frozenTurnsLeft;
  if (owned.tier >= 2) {
    for (const p of state.pieces) {
      if (p.type === 'king' || victims.includes(p)) continue;
      const d = Math.max(Math.abs(p.file - ally.file), Math.abs(p.rank - ally.rank));
      if (d > 1) continue;
      const psq = toSquare({ file: p.file, rank: p.rank });
      if (!frozenSquares.includes(psq)) frozenSquares = [...frozenSquares, psq];
      frozenTurnsLeft = { ...frozenTurnsLeft, [psq]: Math.max(frozenTurnsLeft[psq] ?? 0, 1) };
    }
  }
  const allySq = toSquare({ file: ally.file, rank: ally.rank });
  return {
    ...working,
    frozenSquares,
    frozenTurnsLeft,
    pieces: state.pieces.filter((p) => !victims.includes(p)),
    allies: state.allies.filter((a) => a !== ally),
    captures,
    tempo,
    decoyTarget:
      state.decoyTarget && victims.some((v) => toSquare({ file: v.file, rank: v.rank }) === state.decoyTarget)
        ? null
        : state.decoyTarget,
    abilities: decrementUse(state.abilities, 'sacrifice'),
    activeAbility: null,
    cancellableActivation: undefined,
    ...(victims.length > 0 ? stunKingAfterCapture(state, owned.tier === 5 ? 3 : 2) : {}),
    lastAbilityFx: {
      kind: 'summon-knight',
      from: allySq,
      to: allySq,
      id: Date.now() + Math.random(),
    },
  };
}

/** Promotion ladder for Knighting. */
const PROMOTION_ORDER: ReadonlyArray<AllyPiece['type']> = ['pawn', 'knight', 'bishop', 'rook', 'queen'];

/** Allies Knighting may promote. T4+: any rainbow ally. */
export function knightingTargets(state: BoardState): Coord[] {
  const owned = state.abilities.find((a) => a.id === 'knighting');
  if (!owned) return [];
  const pool = owned.tier >= 4 ? state.allies ?? [] : controlledAllies(state);
  return pool
    .filter((a) => a.type !== 'queen' && a.type !== 'king')
    .map((a) => ({ file: a.file, rank: a.rank }));
}

function applyKnighting(state: BoardState, target: Coord): BoardState {
  const owned = state.abilities.find((a) => a.id === 'knighting');
  if (!owned || owned.usesLeftThisLevel === 0) return state;
  if (!knightingTargets(state).some((c) => c.file === target.file && c.rank === target.rank)) return state;
  const ally = (state.allies ?? []).find((a) => a.file === target.file && a.rank === target.rank);
  if (!ally) return state;
  const i = PROMOTION_ORDER.indexOf(ally.type);
  if (i < 0 || i >= PROMOTION_ORDER.length - 1) return state;
  const steps = owned.tier === 5 ? PROMOTION_ORDER.length : owned.tier >= 3 ? 2 : 1;
  const nextType = PROMOTION_ORDER[Math.min(PROMOTION_ORDER.length - 1, i + steps)];
  return {
    ...state,
    allies: state.allies.map((a) =>
      a === ally
        ? {
            ...a,
            type: nextType,
            ...(owned.tier >= 2 && a.turnsLeft !== undefined ? { turnsLeft: a.turnsLeft + 3 } : {}),
          }
        : a,
    ),
    abilities: decrementUse(state.abilities, 'knighting'),
    activeAbility: null,
    cancellableActivation: undefined,
    lastAbilityFx: {
      kind: 'summon-knight',
      from: toSquare(state.rookie),
      to: toSquare(target),
      id: Date.now() + Math.random(),
    },
  };
}

/**
 * Aegis intercept: if there's an Aegis charge available, consumes 1 charge
 * and either blocks the capture (kills the attacker on T5, or just stops
 * the capture). T3 also stuns the attacker for 1 turn. Returns null if Aegis
 * doesn't fire (no charges, no aegis owned).
 *
 * Called by enemy-turn resolution BEFORE the capture lands.
 */
export function tryAegisIntercept(
  state: BoardState,
  attacker: EnemyPiece,
): BoardState | null {
  if (!state.shieldUp) return null;
  const owned = state.abilities.find((a) => a.id === 'aegis');
  if (!owned) return null;

  let pieces = state.pieces;
  let captures = state.captures;
  if (owned.tier === 5) {
    pieces = pieces.filter((p) => p !== attacker);
    captures = [...captures, attacker.type];
  }

  let frozenSquares = state.frozenSquares;
  let frozenTurnsLeft = state.frozenTurnsLeft;
  if (owned.tier === 3) {
    const sq = toSquare({ file: attacker.file, rank: attacker.rank });
    if (!frozenSquares.includes(sq)) frozenSquares = [...frozenSquares, sq];
    frozenTurnsLeft = { ...frozenTurnsLeft, [sq]: 2 };
  }

  const shieldUp = owned.tier === 5;

  return {
    ...state,
    pieces,
    captures,
    frozenSquares,
    frozenTurnsLeft,
    shieldUp,
  };
}

/**
 * FINISHERS are ONE CHARGE PER RUN (Tyler, 2026-09-01 — option A).
 *
 * The nightly harness proved that any finisher wins 90-100% of levels on its
 * own, so with per-level refreshes a new player cleared every run 100% no
 * matter how the boards were tuned. Finisher charges therefore do NOT come
 * back at level transitions: you get one when you pick the card and one
 * more each time you upgrade it (see pickAbility). Spend it on the level
 * that needs it. Support abilities still refresh every level.
 */
export const ONE_CHARGE_PER_RUN: ReadonlySet<AbilityId> = new Set<AbilityId>([
  'knight-hop',
  'bishop-step',
  'queen-pulse',
  'freeze-ray',
  'summon-knight',
  'surge',
  // Controllable summons can take the king themselves — same rule as the
  // Squire. Swap / Sacrifice / Knighting are support and refresh per level.
  'bishop-squire',
  'page',
  'twin',
  'duchess',
  'dragon',
  'vanguard',
]);

export function isOneChargePerRun(id: AbilityId): boolean {
  return ONE_CHARGE_PER_RUN.has(id);
}

/**
 * Reset per-level uses at level transitions. Finishers keep whatever charge
 * they have left (see ONE_CHARGE_PER_RUN); everything else refills.
 * `refreshAll` (playtest context ONLY — /playtest's ?refresh=1) bypasses the
 * one-charge hold so every ability refills each level. Default behavior is
 * unchanged for normal players, the harness, and seed.ts.
 */
export function refreshAbilityUses(abilities: OwnedAbility[], refreshAll = false): OwnedAbility[] {
  return abilities.map((a) => {
    if (!refreshAll && isOneChargePerRun(a.id) && typeof a.usesLeftThisLevel === 'number') return a;
    return { ...a, usesLeftThisLevel: maxUsesForTier(a.id, a.tier) };
  });
}

/**
 * Abilities to carry into a RETRY of the same level (playtest fix,
 * 2026-09-02). Each ability's charge is restored to what it was when the
 * level STARTED — a one-charge finisher spent on the FAILED attempt comes
 * back, while one spent on a previously CLEARED level stays spent. An
 * ability picked or upgraded DURING the level (no snapshot entry at that
 * tier) refills to its tier max: a failed attempt must never burn a fresh
 * pick. `refreshAll` (playtest ?refresh=1 sessions only) refills everything.
 */
export function abilitiesForRetry(
  current: OwnedAbility[],
  levelStart: OwnedAbility[],
  refreshAll = false,
): OwnedAbility[] {
  return current.map((a) => {
    if (refreshAll) return { ...a, usesLeftThisLevel: maxUsesForTier(a.id, a.tier) };
    const atStart = levelStart.find((s) => s.id === a.id && s.tier === a.tier);
    return {
      ...a,
      usesLeftThisLevel: atStart
        ? atStart.usesLeftThisLevel
        : maxUsesForTier(a.id, a.tier),
    };
  });
}

// ---------------------------------------------------------------------------
// Status-marker helpers — square-keyed maps for poison, rabies, freeze.
// Used when pieces move (markers follow) and when pieces die (markers clear).
// ---------------------------------------------------------------------------

export function clearStatusOnSquare(
  state: BoardState,
  sq: string,
): Pick<
  BoardState,
  | 'poisonedSquares'
  | 'poisonedTurnsLeft'
  | 'rabidSquares'
  | 'rabidTurnsLeft'
  | 'frozenSquares'
  | 'frozenTurnsLeft'
> {
  const poisonedSquares = state.poisonedSquares.includes(sq)
    ? state.poisonedSquares.filter((s) => s !== sq)
    : state.poisonedSquares;
  const poisonedTurnsLeft = state.poisonedSquares.includes(sq)
    ? Object.fromEntries(
        Object.entries(state.poisonedTurnsLeft).filter(([k]) => k !== sq),
      )
    : state.poisonedTurnsLeft;
  const rabidSquares = state.rabidSquares.includes(sq)
    ? state.rabidSquares.filter((s) => s !== sq)
    : state.rabidSquares;
  const rabidTurnsLeft = state.rabidSquares.includes(sq)
    ? Object.fromEntries(
        Object.entries(state.rabidTurnsLeft).filter(([k]) => k !== sq),
      )
    : state.rabidTurnsLeft;
  const frozenSquares = state.frozenSquares.includes(sq)
    ? state.frozenSquares.filter((s) => s !== sq)
    : state.frozenSquares;
  const frozenTurnsLeft = state.frozenSquares.includes(sq)
    ? Object.fromEntries(
        Object.entries(state.frozenTurnsLeft).filter(([k]) => k !== sq),
      )
    : state.frozenTurnsLeft;
  return {
    poisonedSquares,
    poisonedTurnsLeft,
    rabidSquares,
    rabidTurnsLeft,
    frozenSquares,
    frozenTurnsLeft,
  };
}

// ---------------------------------------------------------------------------
// Drones — spawns N mini-Rookies that wander the board randomly. Each drone
// vanishes when it lands on an enemy (= capture). UI-driven: stepDroneTurn
// advances every live drone one square per tick.
// ---------------------------------------------------------------------------

/** Hard cap so a drone never wanders forever on a sparse board. */
export const DRONE_MAX_STEPS = 8;

/** Drones move like rooks — N/S/E/W only. */
const DRONE_4_DIRS: ReadonlyArray<[number, number]> = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
];

function droneCountForTier(tier: AbilityTier): number {
  // Scale drones with tier. T1=1 → T5=6.
  switch (tier) {
    case 1: return 1;
    case 2: return 2;
    case 3: return 3;
    case 4: return 4;
    case 5: return 6;
    default: return 1;
  }
}

function applyDrones(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'drones');
  if (!owned) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  const count = droneCountForTier(owned.tier);
  const now = Date.now();
  const drones: Drone[] = Array.from({ length: count }, (_, i) => ({
    id: now + i,
    file: state.rookie.file,
    rank: state.rookie.rank,
    alive: true,
    steps: 0,
  }));
  return {
    ...state,
    drones,
    turn: 'drones',
    abilities: decrementUse(state.abilities, 'drones'),
    activeAbility: null,
    cancellableActivation: undefined,
  };
}

/**
 * Advance every live drone one random step. Drones that land on an enemy
 * capture it and die. Drones that hit the step cap die unfed. When all
 * drones are dead, the phase ends and turn flips to 'enemy'.
 */
export function stepDroneTurn(state: BoardState): BoardState {
  if (state.turn !== 'drones' || state.status !== 'playing') return state;
  const liveCount = state.drones.filter((d) => d.alive).length;
  if (liveCount === 0) {
    // Drones are a free action — return control to Rookie when the swarm
    // finishes (Tyler: activating drones must not cost a turn / let black
    // move). If a real Rookie move follows it'll hand off to allies/enemy
    // normally.
    return {
      ...state,
      drones: [],
      turn: 'rookie',
    };
  }
  let pieces = state.pieces;
  let captures = state.captures;
  let tempo = state.tempo;
  let statusAccum: BoardState = state;
  const nextDrones = state.drones.map((d) => {
    if (!d.alive) return d;
    if (d.steps >= DRONE_MAX_STEPS) return { ...d, alive: false };
    // Pick a direction biased toward enemies: scan all 4 rays from the drone,
    // find which ones contain an enemy, and prefer the ray with the CLOSEST
    // enemy. If no ray has an enemy, fall back to a uniformly random valid
    // direction so the drone keeps moving instead of stalling.
    // RNG is seeded per-drone-tick so playtest stays deterministic.
    const validDirs = DRONE_4_DIRS.filter(
      ([df, dr]) =>
        d.file + df >= 1 && d.file + df <= 8 && d.rank + dr >= 1 && d.rank + dr <= 8,
    );
    if (validDirs.length === 0) return { ...d, alive: false };
    const rng = mulberry32(
      (state.level * 7919 + state.moveCount * 31 + Number(d.id) * 13 + d.steps * 5) >>> 0,
    );
    // For each valid direction, find distance to nearest enemy along the ray
    // (Infinity if none). Smallest distance wins; ties broken by RNG.
    const rayScans = validDirs.map(([df, dr]) => {
      let f = d.file + df;
      let r = d.rank + dr;
      let dist = 1;
      while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
        if (pieces.some((p) => p.file === f && p.rank === r)) {
          return { dir: [df, dr] as [number, number], dist };
        }
        f += df;
        r += dr;
        dist += 1;
      }
      return { dir: [df, dr] as [number, number], dist: Infinity };
    });
    const withEnemy = rayScans.filter((s) => s.dist !== Infinity);
    let chosen: [number, number];
    if (withEnemy.length > 0) {
      const minDist = Math.min(...withEnemy.map((s) => s.dist));
      const closest = withEnemy.filter((s) => s.dist === minDist);
      chosen = closest[Math.floor(rng() * closest.length)].dir;
    } else {
      chosen = validDirs[Math.floor(rng() * validDirs.length)];
    }
    let nf = d.file;
    let nr = d.rank;
    let captured: EnemyPiece | null = null;
    let f = d.file + chosen[0];
    let r = d.rank + chosen[1];
    while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
      const enemy = pieces.find((p) => p.file === f && p.rank === r);
      if (enemy && enemy.type === 'king') break; // king is a wall, not a snack
      if (enemy) {
        captured = enemy;
        nf = f;
        nr = r;
        break;
      }
      nf = f;
      nr = r;
      f += chosen[0];
      r += chosen[1];
    }
    if (captured) {
      const sq = toSquare(captured);
      const overlay = clearStatusOnSquare(statusAccum, sq);
      statusAccum = { ...statusAccum, ...overlay };
      pieces = pieces.filter((p) => p !== captured);
      captures = [...captures, captured.type];
      tempo = Math.min(tempoMaxFor(state), tempo + (TEMPO_REWARD[captured.type] ?? 0));
      return { ...d, file: nf, rank: nr, alive: false, steps: d.steps + 1 };
    }
    return { ...d, file: nf, rank: nr, steps: d.steps + 1 };
  });
  const droneCaptured = captures.length > state.captures.length;
  return {
    ...state,
    ...statusAccum,
    drones: nextDrones,
    pieces,
    captures,
    tempo,
    ...(droneCaptured ? stunKingAfterCapture(state) : {}),
  };
}

/**
 * Rookie's Revenge — any capture credited to Rookie stuns the enemy king for
 * the next enemy turn (he can't flee). Returns the state patch, or {} when
 * the level isn't a king level so live runs stay byte-identical.
 */
export function stunKingAfterCapture(
  state: BoardState,
  turns = 1,
): Pick<BoardState, 'kingStunTurns'> | Record<string, never> {
  if (state.winCondition !== 'king') return {};
  return { kingStunTurns: Math.max(state.kingStunTurns ?? 0, turns) };
}

/**
 * Squares attacked by Rookie's rainbow allies (pawns diagonally toward rank
 * 8, knights, bishops/queens sliding until blocked). Used by the fleeing king
 * — he treats an ally-covered square as unsafe even though only Rookie may
 * take him, so allies act as the "second piece" that cuts off escapes.
 */
export function allyAttackedSquares(state: BoardState): Set<string> {
  const out = new Set<string>();
  const add = (f: number, r: number) => {
    if (allyInBounds(f, r)) out.add(toSquare({ file: f, rank: r }));
  };
  for (const a of state.allies ?? []) {
    switch (a.type) {
      case 'pawn':
        add(a.file - 1, a.rank + 1);
        add(a.file + 1, a.rank + 1);
        break;
      case 'knight':
        for (const [df, dr] of ALLY_KNIGHT_DELTAS) add(a.file + df, a.rank + dr);
        break;
      case 'bishop':
      case 'rook':
      case 'queen': {
        const dirs = a.type === 'queen' ? ALLY_QUEEN_DIRS : a.type === 'rook' ? ALLY_ROOK_DIRS : ALLY_BISHOP_DIRS;
        for (const [df, dr] of dirs) {
          let f = a.file + df;
          let r = a.rank + dr;
          while (allyInBounds(f, r)) {
            add(f, r);
            if (allyIsHazard(state, f, r)) break;
            if (state.rookie.file === f && state.rookie.rank === r) break;
            if (state.allies.some((o) => o !== a && o.file === f && o.rank === r)) break;
            if (state.pieces.some((p) => p.file === f && p.rank === r)) break;
            f += df;
            r += dr;
          }
        }
        // Dragon: the king fears her knight squares too.
        if (a.source === 'dragon') {
          for (const [df, dr] of ALLY_KNIGHT_DELTAS) add(a.file + df, a.rank + dr);
        }
        break;
      }
      case 'king':
        break;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Squad — passive. Spawns rainbow allies at level start. Scales with the
// `level` field on BoardState (1..N).
// ---------------------------------------------------------------------------

/**
 * Compute the squad roster for a given level / rookie start square. Doesn't
 * collide with enemies — squares that would overlap are simply skipped.
 */
/**
 * Squad roster scales with the ABILITY's tier (T1 → T5), not the run level.
 * Squad is now an offerable passive: Rookie owns it after picking it from a
 * tempo offer; upgrading promotes her roster.
 */
export function squadSpawnFor(
  tier: AbilityTier,
  rookie: Coord,
  pieces: EnemyPiece[],
  hazards: Coord[],
  opts: {
    /**
     * Rookie's Revenge: allies muster AHEAD of Rookie (up to this many ranks
     * in front) so the squad reaches the king's room in time to cut off his
     * escape squares. Default 1 = the live "right in front of her" spawn.
     */
    ranksAhead?: number;
  } = {},
): AllyPiece[] {
  const out: AllyPiece[] = [];
  const taken = (file: number, rank: number): boolean => {
    if (file < 1 || file > 8 || rank < 1 || rank > 8) return true;
    if (rookie.file === file && rookie.rank === rank) return true;
    if (pieces.some((p) => p.file === file && p.rank === rank)) return true;
    if (hazards.some((h) => h.file === file && h.rank === rank)) return true;
    if (out.some((a) => a.file === file && a.rank === rank)) return true;
    return false;
  };
  // Try a list of preferred files in order; spawn at the first that's free.
  // Lets us mirror to the other side when Rookie is on an edge file so squad
  // size stays consistent at the a/h-files.
  const tryAdd = (type: PieceType, files: number[], rank: number): void => {
    for (const f of files) {
      if (!taken(f, rank)) {
        out.push({ id: Date.now() * 1000 + out.length, type, file: f, rank, source: 'squad' });
        return;
      }
    }
  };
  // Everything spawns in front of Rookie (rank+1 or rank+2) so her east/west
  // axes stay open and she always has a legal first move.
  const ahead = Math.max(1, opts.ranksAhead ?? 1);
  const front = Math.min(7, rookie.rank + ahead);
  const front2 = Math.min(7, front + 1);
  const t = Math.max(1, tier);
  // T1: center pawn in front. Fallback to adjacent files if blocked.
  if (t >= 1) {
    tryAdd('pawn', [rookie.file, rookie.file - 1, rookie.file + 1], front);
  }
  // T2: flanking pawns. Each falls back to the next valid file outward.
  if (t >= 2) {
    tryAdd('pawn', [rookie.file - 1, rookie.file + 2, rookie.file - 2], front);
    tryAdd('pawn', [rookie.file + 1, rookie.file - 2, rookie.file + 2], front);
  }
  // T3: knight, prefers two left of Rookie, mirrors right if off-board.
  if (t >= 3) {
    tryAdd('knight', [rookie.file - 2, rookie.file + 2, rookie.file - 3, rookie.file + 3], front);
  }
  // T4: bishop, mirrors of knight.
  if (t >= 4) {
    tryAdd('bishop', [rookie.file + 2, rookie.file - 2, rookie.file + 3, rookie.file - 3], front);
  }
  // T5: three pawns on rank+2.
  if (t >= 5) {
    tryAdd('pawn', [rookie.file, rookie.file - 1, rookie.file + 1], front2);
    tryAdd('pawn', [rookie.file - 2, rookie.file - 1, rookie.file + 2, rookie.file + 1], front2);
    tryAdd('pawn', [rookie.file + 2, rookie.file + 1, rookie.file - 2, rookie.file - 1], front2);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Ally movement — runs between Rookie's move and the enemy turn.
// Each ally tries to capture, otherwise pushes toward rank 8.
// ---------------------------------------------------------------------------

const ALLY_KNIGHT_DELTAS: ReadonlyArray<[number, number]> = [
  [1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1],
];
const ALLY_BISHOP_DIRS: ReadonlyArray<[number, number]> = [
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];
const ALLY_ROOK_DIRS: ReadonlyArray<[number, number]> = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
];
const ALLY_QUEEN_DIRS: ReadonlyArray<[number, number]> = [
  ...ALLY_ROOK_DIRS, ...ALLY_BISHOP_DIRS,
];

function allyOccupied(state: BoardState, file: number, rank: number, self: AllyPiece): boolean {
  if (state.rookie.file === file && state.rookie.rank === rank) return true;
  if (state.allies.some((a) => a !== self && a.file === file && a.rank === rank)) return true;
  return false;
}

function allyInBounds(f: number, r: number): boolean {
  return f >= 1 && f <= 8 && r >= 1 && r <= 8;
}

function allyIsHazard(state: BoardState, f: number, r: number): boolean {
  return state.hazards.some((h) => h.file === f && h.rank === r);
}

/** Possible (target, capturedEnemy|null) moves for an ally piece. */
function allyMoves(
  state: BoardState,
  ally: AllyPiece,
): Array<{ to: Coord; capture: EnemyPiece | null }> {
  const out: Array<{ to: Coord; capture: EnemyPiece | null }> = [];
  const tryLand = (f: number, r: number): { to: Coord; capture: EnemyPiece | null } | null => {
    if (!allyInBounds(f, r)) return null;
    if (allyIsHazard(state, f, r)) return null;
    if (allyOccupied(state, f, r, ally)) return null;
    const enemy = state.pieces.find((p) => p.file === f && p.rank === r);
    if (enemy && enemy.type === 'king') return null; // only Rookie takes the king
    return { to: { file: f, rank: r }, capture: enemy ?? null };
  };
  switch (ally.type) {
    case 'pawn': {
      // Advance forward (toward rank 8) one square if empty.
      const forward = tryLand(ally.file, ally.rank + 1);
      if (forward && !forward.capture) out.push(forward);
      // Diagonal captures.
      for (const df of [-1, 1]) {
        const m = tryLand(ally.file + df, ally.rank + 1);
        if (m && m.capture) out.push(m);
      }
      return out;
    }
    case 'knight': {
      for (const [df, dr] of ALLY_KNIGHT_DELTAS) {
        const m = tryLand(ally.file + df, ally.rank + dr);
        if (m) out.push(m);
      }
      return out;
    }
    case 'bishop':
    case 'rook':
    case 'queen': {
      const dirs = ally.type === 'queen' ? ALLY_QUEEN_DIRS : ally.type === 'rook' ? ALLY_ROOK_DIRS : ALLY_BISHOP_DIRS;
      for (const [df, dr] of dirs) {
        let f = ally.file + df;
        let r = ally.rank + dr;
        while (allyInBounds(f, r)) {
          if (allyIsHazard(state, f, r)) break;
          if (allyOccupied(state, f, r, ally)) break;
          const enemy = state.pieces.find((p) => p.file === f && p.rank === r);
          if (enemy && enemy.type === 'king') break; // only Rookie takes the king
          out.push({ to: { file: f, rank: r }, capture: enemy ?? null });
          if (enemy) break;
          f += df;
          r += dr;
        }
      }
      return out;
    }
    case 'king':
      return out; // allies are never kings
  }
}

/**
 * Heuristic score for an ally choosing a move. Higher is better.
 * - Capture bonus scales with victim value.
 * - Otherwise prefer moves that advance toward rank 8.
 * - Penalty if the resulting square is attacked by any remaining enemy (so the
 *   ally doesn't walk into a free capture).
 */
function allyScoreMove(
  state: BoardState,
  ally: AllyPiece,
  move: { to: Coord; capture: EnemyPiece | null },
): number {
  const VALUE: Record<PieceType, number> = { queen: 9, bishop: 3, knight: 3, pawn: 1, king: 0 };
  let score = 0;
  if (move.capture) score += 100 + VALUE[move.capture.type] * 10;
  score += move.to.rank * 2; // advance bonus
  // Safety check — count enemies that could capture this square next turn.
  const attacked = squareAttackedByEnemy(state, move.to, ally, move.capture);
  if (attacked) score -= 30;
  return score;
}

/** Cheap "is this square attacked by some enemy?" using direct geometry. */
function squareAttackedByEnemy(
  state: BoardState,
  sq: Coord,
  movingAlly: AllyPiece,
  capturedEnemy: EnemyPiece | null,
): boolean {
  for (const e of state.pieces) {
    if (e === capturedEnemy) continue;
    // Pawn diagonal attacks (enemy moves toward rank 1).
    if (e.type === 'pawn') {
      if (e.rank - 1 === sq.rank && (e.file - 1 === sq.file || e.file + 1 === sq.file)) {
        return true;
      }
      continue;
    }
    if (e.type === 'knight') {
      for (const [df, dr] of ALLY_KNIGHT_DELTAS) {
        if (e.file + df === sq.file && e.rank + dr === sq.rank) return true;
      }
      continue;
    }
    if (e.type === 'king') continue; // kings never capture
    const dirs = e.type === 'queen' ? ALLY_QUEEN_DIRS : ALLY_BISHOP_DIRS;
    if (e.type === 'queen') {
      // queens cover all 8.
    }
    for (const [df, dr] of (e.type === 'bishop' ? ALLY_BISHOP_DIRS : e.type === 'queen' ? ALLY_QUEEN_DIRS : dirs)) {
      let f = e.file + df;
      let r = e.rank + dr;
      while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
        if (f === sq.file && r === sq.rank) return true;
        // Stop at any blocker — Rookie, ally (not the moving one) or enemy.
        if (state.rookie.file === f && state.rookie.rank === r) break;
        if (state.allies.some((a) => a !== movingAlly && a.file === f && a.rank === r)) break;
        if (state.pieces.some((p) => p !== e && p.file === f && p.rank === r)) break;
        f += df;
        r += dr;
      }
    }
  }
  return false;
}

/**
 * Advance ONE ally per call. Driven by the UI tick when `turn === 'allies'`
 * so each move animates separately (mirrors `stepEnemyTurn`'s pattern). The
 * ally at index `state.allyTurnIndex` acts, then the index advances. When
 * every ally has had a turn, control passes to the enemy.
 *
 * Captures take precedence; pawns promote to queen on rank 8.
 * Source=convert allies are slightly less consistent (30% random move,
 * 70% best-by-score) so they sometimes walk into trouble.
 */
export function stepAllyTurn(state: BoardState): BoardState {
  if (state.turn !== 'allies' || state.status !== 'playing') return state;
  // No allies, or every ally has moved — hand off to enemy.
  if (state.allyTurnIndex >= state.allies.length) {
    return { ...state, turn: 'enemy', allyTurnIndex: 0 };
  }
  const idx = state.allyTurnIndex;
  const ally = state.allies[idx];
  // Ally either can't move or no longer exists — skip it. Controlled summons
  // (Squire family) are player-moved (see applyControlledAllyMove) and never
  // move on their own.
  if (!ally || isControlledAlly(ally)) {
    return { ...state, allyTurnIndex: idx + 1 };
  }
  let moves = allyMoves(state, ally);
  // Bodyguard holds Rookie's side: it only moves to CAPTURE (then it's a
  // capture-stun like any ally). No wandering off toward rank 8.
  if (ally.source === 'bodyguard') moves = moves.filter((m) => !!m.capture);
  if (moves.length === 0) {
    return { ...state, allyTurnIndex: idx + 1 };
  }
  let pick: { to: Coord; capture: EnemyPiece | null };
  if (ally.source === 'convert' && Math.random() < 0.3) {
    pick = moves[Math.floor(Math.random() * moves.length)];
  } else {
    let best = moves[0];
    let bestScore = allyScoreMove(state, ally, best);
    for (const m of moves.slice(1)) {
      const s = allyScoreMove(state, ally, m);
      if (s > bestScore) {
        bestScore = s;
        best = m;
      }
    }
    pick = best;
  }
  const nextAllies = state.allies.map((a, i) =>
    i === idx
      ? {
          ...a,
          file: pick.to.file,
          rank: pick.to.rank,
          type: a.type === 'pawn' && pick.to.rank === 8 ? ('queen' as AllyPiece['type']) : a.type,
        }
      : a,
  );
  let nextPieces = state.pieces;
  let nextCaptures = state.captures;
  let nextTempo = state.tempo;
  let statusClear: ReturnType<typeof clearStatusOnSquare> | null = null;
  if (pick.capture) {
    const sq = toSquare(pick.capture);
    statusClear = clearStatusOnSquare(state, sq);
    nextPieces = nextPieces.filter((p) => p !== pick.capture);
    nextCaptures = [...nextCaptures, pick.capture.type];
    const gain = TEMPO_REWARD[pick.capture.type] ?? 0;
    nextTempo = Math.min(tempoMaxFor(state), state.tempo + gain);
  }
  return {
    ...state,
    ...(statusClear ?? {}),
    allies: nextAllies,
    pieces: nextPieces,
    captures: nextCaptures,
    tempo: nextTempo,
    allyTurnIndex: idx + 1,
    ...(pick.capture ? stunKingAfterCapture(state) : {}),
  };
}

export function relocateStatusMarkers(
  state: BoardState,
  fromSq: string,
  toSq: string,
): Pick<
  BoardState,
  'poisonedSquares' | 'poisonedTurnsLeft' | 'rabidSquares' | 'rabidTurnsLeft'
> {
  let poisonedSquares = state.poisonedSquares;
  let poisonedTurnsLeft = state.poisonedTurnsLeft;
  if (state.poisonedSquares.includes(fromSq)) {
    const turns = state.poisonedTurnsLeft[fromSq];
    poisonedSquares = state.poisonedSquares.filter((s) => s !== fromSq);
    if (!poisonedSquares.includes(toSq))
      poisonedSquares = [...poisonedSquares, toSq];
    poisonedTurnsLeft = { ...state.poisonedTurnsLeft };
    delete poisonedTurnsLeft[fromSq];
    poisonedTurnsLeft[toSq] = turns;
  }
  let rabidSquares = state.rabidSquares;
  let rabidTurnsLeft = state.rabidTurnsLeft;
  if (state.rabidSquares.includes(fromSq)) {
    const turns = state.rabidTurnsLeft[fromSq];
    rabidSquares = state.rabidSquares.filter((s) => s !== fromSq);
    if (!rabidSquares.includes(toSq))
      rabidSquares = [...rabidSquares, toSq];
    rabidTurnsLeft = { ...state.rabidTurnsLeft };
    delete rabidTurnsLeft[fromSq];
    rabidTurnsLeft[toSq] = turns;
  }
  return { poisonedSquares, poisonedTurnsLeft, rabidSquares, rabidTurnsLeft };
}
