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
import { getRunById, type RunDef } from './runs';
import { mulberry32 } from './seed';
import { TEMPO_REWARD, tempoMaxFor } from './scoring';
import { fromSquare, toSquare } from './types';
import { enforceKingInvariant } from './king-invariant';
import type {
  AllyPiece,
  BoardState,
  Coord,
  Drone,
  EnemyPiece,
  Hazard,
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
  | 'knighting'
  // The five of 2026-09-06, mined from the level library (testing). See
  // docs/new-abilities-2026-09-06.md — each is a distinct verb: trap a
  // square, move a stone, move the king, pass a turn, fake a Rookie.
  | 'snare'
  | 'shove'
  | 'coup'
  | 'hourglass'
  | 'scarecrow'
  // 2026-09-07 (testing). The catalogue's first LURE: every other card that
  // touches the king moves him one square, pins him, steers his flight or
  // deletes the squares he runs to. This one changes what he WANTS — he
  // leaves the room you were never getting into and walks at you.
  | 'gauntlet'
  // 2026-09-07 (testing). The catalogue's first ZUGZWANG. Every other card
  // that touches the king takes a square away from him (boulder, snare), puts
  // him on a different one (coup), stops him using them (freeze), or changes
  // which one he wants (scarecrow, gauntlet). This one takes away the option
  // of USING NONE: for one enemy phase he must leave the square he is on,
  // and if every step is covered he takes the least-bad one anyway.
  | 'panic'
  // 2026-09-08 (testing). The catalogue's first card that takes away a
  // DIRECTION. Freeze stops him moving, Snare holds him, Boulder deletes the
  // square, Coup moves him, Panic compels a step, Gauntlet changes the one he
  // wants — every one of them argues about WHICH squares or WHETHER he moves.
  // Chequer argues about HOW: for one enemy phase he may not set foot on his
  // own colour, so every diagonal step is gone and he moves like a rook. The
  // four squares it leaves him are all the opposite colour to his own, which
  // is the whole reason it has a partner (a light-squared body covers exactly
  // those four, and can never touch a king who stands on dark).
  | 'chequer';

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
    typeLine: 'Targeted · Steal',
    description: 'Steal an enemy piece. You control it.',
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
    description: 'Tap to raise a shield. Blocks the next capture and freezes the attacker.',
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
    description: 'Drop a block of stone on an empty square. Nothing passes it.',
  },
  smoke: {
    id: 'smoke',
    name: 'Stealth',
    activation: 'instant',
    typeLine: 'Instant · Cover',
    description: 'Nothing can capture you, and the king stops running.',
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
    description: 'Your summon explodes in the shape it moves. Everything on the squares it attacks, up to 2 away, is captured.',
  },
  knighting: {
    id: 'knighting',
    name: 'Knighting',
    activation: 'targeted',
    typeLine: 'Targeted · Rank',
    description: 'Promote one of your summons into a bigger piece.',
  },
  snare: {
    id: 'snare',
    name: 'Snare',
    activation: 'targeted',
    typeLine: 'Targeted · Trap',
    description: 'Set a trap on an empty square. The first enemy to step on it is held.',
  },
  shove: {
    id: 'shove',
    name: 'Shove',
    activation: 'targeted',
    typeLine: 'Targeted · Terrain',
    description: 'Push a block of stone beside you one square away. It moves. It does not disappear.',
  },
  coup: {
    id: 'coup',
    name: 'Coup',
    activation: 'targeted',
    typeLine: 'Targeted · Royal',
    description: "Trade the king's square with one of his own guards. His man takes the throne. He takes the post.",
  },
  hourglass: {
    id: 'hourglass',
    name: 'Hourglass',
    activation: 'instant',
    typeLine: 'Instant · Time',
    description: 'Turn the glass. The enemies take a turn now — you have not moved, and nothing of yours runs out.',
  },
  scarecrow: {
    id: 'scarecrow',
    name: 'Scarecrow',
    activation: 'targeted',
    typeLine: 'Targeted · Trick',
    description: 'Stand a straw Rookie on an empty square. For a turn, the court and the king believe it.',
  },
  gauntlet: {
    id: 'gauntlet',
    name: 'Gauntlet',
    activation: 'instant',
    typeLine: 'Instant · Challenge',
    description: 'Throw down the gauntlet. He leaves his room and comes at you — and he never goes back.',
  },
  panic: {
    id: 'panic',
    name: 'Panic',
    activation: 'instant',
    typeLine: 'Instant · Royal',
    description: 'He cannot keep still. This turn the king must leave the square he is standing on — even if every square is worse.',
  },
  chequer: {
    id: 'chequer',
    name: 'Chequer',
    activation: 'instant',
    typeLine: 'Instant · Royal',
    description: 'Chequer the floor. Until your next turn the king cannot set foot on his own colour — he moves like a rook, or not at all.',
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
      // 1/2/2/2/2 raises a level. T5 used to be an unlimited permanent shield,
      // then 3 raises — Tyler reached endless L30 "pretty easily" (2026-09-09):
      // "it should just be 2 uses at the top."
      if (tier === 1) return 1;
      return 2;
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
    case 'snare':
      // 1/1/2/2/2 — the spec's ladder (docs/new-abilities-2026-09-06.md).
      if (tier <= 2) return 1;
      return 2;
    case 'shove':
      // 1/2/2/2/unlimited.
      if (tier === 1) return 1;
      if (tier <= 4) return 2;
      return -1;
    case 'coup':
      // 1/1/2/2/2.
      if (tier <= 2) return 1;
      return 2;
    case 'hourglass':
      // 1/2/3/4/6 — the ladder is pure quantity (2026-09-06 rework). It stays
      // FINITE on purpose: uses are the only thing that bounds a card whose
      // cast does not end the turn, and an unlimited glass with an unlimited
      // per-turn count is an infinite loop for the player and for the bot.
      if (tier === 1) return 1;
      if (tier === 2) return 2;
      if (tier === 3) return 3;
      if (tier === 4) return 4;
      return 6;
    case 'scarecrow':
      // 1/1/2/2/2.
      if (tier <= 2) return 1;
      return 2;
    case 'gauntlet':
      // 1/1/2/2/2 — the ladder is quantity and DURATION (tauntTurnsForTier),
      // never a new clause. One throw is the whole card at T1.
      if (tier <= 2) return 1;
      return 2;
    case 'panic':
      // 1/1/2/2/3 — the ladder is QUANTITY ONLY. A panic always covers
      // exactly the next enemy phase at every tier: a duration ladder on a
      // card that forces a step would be a second forced step, which is the
      // classic gate-breaker (run-level-design.md, "the tier that grants a
      // SECOND USE"). Extra uses are capped per run by abilityTierCaps.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return 3;
    case 'chequer':
      // 1/1/2/2/3 — QUANTITY ONLY, for Panic's reason. A duration ladder on a
      // card that halves his compass would be a second sealed enemy phase,
      // which is the classic gate-breaker (run-level-design.md, "the tier that
      // grants a SECOND USE"). Extra uses are capped per run by
      // abilityTierCaps.
      if (tier <= 2) return 1;
      if (tier <= 4) return 2;
      return 3;
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
  convert: 'Tap card, then tap an enemy. It joins you next turn.',
  drones: 'Tap card. Drones launch in fixed directions.',
  squad: 'Passive — allies spawn each level.',
  surge: 'Tap card. You get an extra move.',
  aegis: 'Tap card. Shield stays up until it takes a hit. Whoever hits it freezes.',
  decoy: 'Tap card, then tap an enemy.',
  boulder: 'Tap card, then tap an empty square. A block of stone lands there.',
  smoke: 'Tap card. You vanish at once. Capturing gives you away.',
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
  sacrifice: 'Tap card, then tap one of your summons. The tinted squares are its blast — shape = how the piece moves, 2 squares out.',
  knighting: 'Tap card, then tap one of your summons.',
  snare: 'Tap card, then tap an empty square. The trap is invisible to them.',
  shove: 'Tap card, then tap a block of stone beside you. It rolls one square away. Lava never moves.',
  coup: 'Tap card, then tap a guard near the king. They trade squares.',
  hourglass: 'Tap card. The enemies play a turn at once; your move is still in hand and none of your effects tick.',
  scarecrow: 'Tap card, then tap an empty square. They hunt the straw. He runs from it.',
  gauntlet: 'Tap card. He steps out of his room toward you, once a turn. He will not walk onto a line he can see.',
  panic: 'Tap card. On their turn he must step off his square. He picks the safest one left — take the safe ones away first.',
  chequer: 'Tap card. Until your next turn he cannot step diagonally — only the four squares of the other colour. Cover those and he has nowhere.',
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
      // The stolen piece is a controlled summon: tap it to move it (that is
      // your move for the turn), it captures like its type (a pawn marches
      // toward rank 8), its captures stun the king, and it is cured of any
      // poison or rabies the moment it changes sides. It is dazed the turn
      // it is stolen — it moves from your next turn.
      if (tier === 5) return 'Steal any enemy (except the king). You control it from next turn.';
      if (tier === 4) return 'Steal any enemy piece. You control it from next turn.';
      if (tier === 3) return 'Steal a pawn, minor, or queen. You control it from next turn.';
      if (tier === 2) return 'Steal an enemy knight or bishop. You control it from next turn.';
      return 'Steal an enemy pawn. You control it from next turn.';
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
      if (tier === 5) return 'Raise a shield for 3 turns. Every attacker that hits it is frozen 2 turns. It does not break.';
      if (tier >= 3) return 'Raise a shield. It blocks the next attack, and the attacker is frozen 2 turns.';
      return 'Raise a shield. It blocks the next attack, and the attacker is frozen 1 turn.';
    case 'decoy':
      if (tier === 5) return 'Mark an enemy. Its team will keep attacking it.';
      if (tier === 4)
        return 'Mark an enemy for 3 turns. Whoever captures it freezes.';
      if (tier >= 2) return 'Mark an enemy for 2 turns. Its team will attack it.';
      return 'Mark an enemy for 1 turn. Its team will attack it.';
    case 'boulder':
      if (tier === 5) return 'Drop a stone on any square — crush an enemy pawn under it. Unlimited drops.';
      if (tier === 4) return 'Drop a stone on any square — crush an enemy pawn under it. Each use drops 2.';
      if (tier >= 2) return 'Drop a stone on any square — crush an enemy pawn under it.';
      return 'Drop a block of stone on an empty square. It blocks everyone, for good.';
    case 'smoke': {
      // Say the MECHANIC, not the mood (Tyler, 2026-09-08, eight times in one
      // session: "I still really don't get what smoke does ... what does smoke
      // protect you from? Is smoke like an Aegis then?"). It is: no enemy can
      // capture you at all while it lasts, AND the king stops fleeing because
      // he can't see you — which is the reason to cast it, and was written
      // nowhere. Capturing gives away your position (except at T5).
      const turns = tier === 1 ? 1 : tier <= 3 ? 2 : 3;
      const tail = tier === 5 ? 'Capturing keeps you hidden.' : 'Capturing gives you away.';
      return `${turns} turn${turns === 1 ? '' : 's'}: nothing can capture you and the king stops running. ${tail}`;
    }
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
        return 'A dragon for 5 turns — queen moves plus knight moves. Two charges.';
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
      // ONE rule at every tier (2026-09-09): the blast is piece-shaped — the
      // squares the summon attacks, up to 2 away, blockers ignored. Enemies
      // inside are captured; the king inside is stunned.
      if (tier === 5) return 'Detonate a summon. Everything on the squares it attacks, up to 2 away, is captured; the king there is stunned 3 turns.';
      if (tier >= 2) return 'Detonate a summon. Everything on the squares it attacks, up to 2 away, is captured; the king there is stunned 2 turns.';
      return 'Detonate a summon. Everything on the squares it attacks, up to 2 away, is captured; the king there is stunned 1 turn.';
    case 'knighting':
      if (tier === 5) return 'Promote a summon straight to queen.';
      if (tier === 4) return 'Promote a summon or ANY rainbow ally two steps up.';
      if (tier === 3) return 'Promote a summon two steps up (pawn to bishop, knight to rook).';
      if (tier === 2) return 'Promote a summon one step up. Its clock gains 3 turns.';
      return 'Promote a summon one step: pawn, knight, bishop, rook, queen.';
    case 'snare':
      if (tier === 5) return 'Set a trap that never wears out. Guards die on it, the king is held 3 turns.';
      if (tier === 4) return 'Set a trap. A guard that steps on it is captured; the king is held 3 turns.';
      if (tier >= 2) return 'Set a trap. Whoever steps on it is held for 2 turns.';
      return 'Set a trap on an empty square. The first enemy to step on it is held for 1 turn.';
    case 'shove':
      if (tier === 5) return 'Push stones all you like. Every one crushes what it lands on.';
      if (tier === 4) return 'Push a stone on your line, up to 2 away, one square. Crushes pawns.';
      if (tier === 3) return 'Push a stone one square. A pawn it lands on is crushed.';
      return 'Push a block of stone beside you one square away. Lava is not a block.';
    case 'coup':
      if (tier === 5) return 'Swap the king with ANY enemy on the board. He is stunned a turn.';
      if (tier === 4) return 'Swap the king with any guard in his room or within 2. Swapping stuns him a turn.';
      if (tier === 3) return 'Swap the king with any guard in his room or within 2 of him.';
      if (tier === 2) return 'Swap the king with any guard standing beside him.';
      return 'Swap the king with a pawn standing beside him.';
    case 'hourglass':
      if (tier === 5) return 'The enemies take a turn now. Six a level, three of them in one turn. Nothing of yours runs out.';
      if (tier === 4) return 'The enemies take a turn now. Four a level, two of them in one turn. Nothing of yours runs out.';
      if (tier === 3) return 'The enemies take a turn now. Three a level. Nothing of yours runs out.';
      if (tier === 2) return 'The enemies take a turn now. Twice a level. Nothing of yours runs out.';
      return 'The enemies take a turn now. You have not moved, and nothing of yours runs out.';
    case 'scarecrow':
      if (tier === 5) return 'A straw queen for 3 turns. Whatever strikes it dies on the spot.';
      if (tier === 4) return 'A straw QUEEN for 2 turns. He runs from her diagonals too.';
      if (tier === 3) return 'A straw Rookie for 2 turns.';
      if (tier === 2) return 'A straw Rookie for 2 turns. They hunt it. He runs from it.';
      return 'A straw Rookie on an empty square, for 1 turn. They hunt it. He runs from it.';
    case 'gauntlet':
      if (tier === 5) return 'He answers for 5 turns. He abandons his room for good and walks at you.';
      if (tier === 4) return 'He answers for 4 turns. He abandons his room for good and walks at you.';
      if (tier === 3) return 'He answers for 3 turns. He abandons his room for good and walks at you.';
      if (tier === 2) return 'He answers for 3 turns. He abandons his room for good and walks at you.';
      return 'He answers for 2 turns: one step toward you a turn, out of his room and never back.';
    case 'panic':
      if (tier === 5) return 'He must leave the square he stands on. Three panics a level.';
      if (tier >= 3) return 'He must leave the square he stands on. Twice a level.';
      return 'He must leave the square he stands on, this turn. He takes the safest square left — and if none is safe, the least bad.';
    case 'chequer':
      if (tier === 5) return 'He cannot step onto his own colour. Three times a level.';
      if (tier >= 3) return 'He cannot step onto his own colour. Twice a level.';
      return 'Until your next turn he cannot step onto his own colour: no diagonals, only the four squares of the other colour.';
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
      if (tier === 5) return 'Steal any non-king; yours next turn. 2/level.';
      if (tier === 4) return 'Steal any piece; yours next turn. 2/level.';
      if (tier === 3) return 'Steal pawn/minor/queen; yours next turn. 2/level.';
      if (tier === 2) return 'Steal a knight/bishop; yours next turn. 1/level.';
      return 'Steal a pawn; yours next turn. 1/level.';
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
      if (tier === 5) return 'Tap: 3-turn shield, never breaks. Each attacker frozen 2. 2/level.';
      if (tier === 4) return 'Tap: shield. Attacker frozen 2. 2 raises/level.';
      if (tier === 3) return 'Tap: shield. Attacker frozen 2. 2 raises/level.';
      if (tier === 2) return 'Tap: shield. Attacker frozen 1. 2 raises/level.';
      return 'Tap: shield. Attacker frozen 1. 1/level.';
    case 'decoy':
      if (tier === 5) return 'Mark stays until captured. 1/level.';
      if (tier === 4) return 'Mark 3 turns. Capturers freeze. 2/level.';
      if (tier === 3) return 'Mark for 2 turns. 2/level.';
      if (tier === 2) return 'Mark for 2 turns. 1/level.';
      return 'Mark an enemy for 1 turn. 1/level.';
    case 'boulder':
      if (tier === 5) return 'Crush pawns. Unlimited stones.';
      if (tier === 4) return 'Crush a pawn; 2 stones per use. 3/level.';
      if (tier === 3) return 'Crush a pawn under a stone. 3/level.';
      if (tier === 2) return 'Crush a pawn under a stone. 2/level.';
      return 'Drop a stone. 2/level.';
    case 'smoke':
      if (tier === 5) return 'Untouchable 3 turns, even if you capture. 1/level.';
      if (tier === 4) return 'Untouchable 3 turns; king stops running. 2/level.';
      if (tier === 3) return 'Untouchable 2 turns; king stops running. 2/level.';
      if (tier === 2) return 'Untouchable 2 turns; king stops running. 1/level.';
      return 'Untouchable 1 turn; king stops running. 1/level.';
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
      if (tier === 5) return 'Your dragon, 5 turns. 2 charges.';
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
      if (tier === 5) return 'Detonate: its attack squares, 2 out; king stun 3. 2/level.';
      if (tier >= 3) return 'Detonate: its attack squares, 2 out; king stun 2. 2/level.';
      if (tier === 2) return 'Detonate: its attack squares, 2 out; king stun 2. 1/level.';
      return 'Detonate: its attack squares, 2 out; king stun 1. 1/level.';
    case 'knighting':
      if (tier === 5) return 'Summon straight to queen. 2/level.';
      if (tier === 4) return 'Any ally, two steps up. 2/level.';
      if (tier === 3) return 'Two steps up. 1/level.';
      if (tier === 2) return 'One step up, +3 turns. 1/level.';
      return 'One step up. 1/level.';
    case 'snare':
      if (tier === 5) return 'Trap re-arms. Guards die, king held 3. 2/level.';
      if (tier === 4) return 'Trap bites guards; king held 3. 2/level.';
      if (tier === 3) return 'Trap holds 2 turns. 2/level.';
      if (tier === 2) return 'Trap holds 2 turns. 1/level.';
      return 'Trap holds 1 turn. 1/level.';
    case 'shove':
      if (tier === 5) return 'Unlimited shoves. Crushes pawns.';
      if (tier === 4) return 'Shove from 2 away. Crushes pawns. 2/level.';
      if (tier === 3) return 'Shove a stone; crushes a pawn. 2/level.';
      if (tier === 2) return 'Shove a stone one square. 2/level.';
      return 'Shove a stone one square. 1/level.';
    case 'coup':
      if (tier === 5) return 'Swap him with any enemy; stuns him. 2/level.';
      if (tier === 4) return 'Swap him within 2; stuns him. 2/level.';
      if (tier === 3) return 'Swap him with a guard within 2. 2/level.';
      if (tier === 2) return 'Swap him with any guard beside him. 1/level.';
      return 'Swap him with a pawn beside him. 1/level.';
    case 'hourglass':
      if (tier === 5) return 'Three glasses in one turn. 6/level.';
      if (tier === 4) return 'Two glasses in one turn. 4/level.';
      if (tier === 3) return 'Enemies take a turn now. 3/level.';
      if (tier === 2) return 'Enemies take a turn now. 2/level.';
      return 'Enemies take a turn now. 1/level.';
    case 'scarecrow':
      if (tier === 5) return 'Straw queen 3 turns; attackers die. 2/level.';
      if (tier === 4) return 'Straw queen, 2 turns. 2/level.';
      if (tier === 3) return 'Straw Rookie, 2 turns. 2/level.';
      if (tier === 2) return 'Straw Rookie, 2 turns. 1/level.';
      return 'Straw Rookie, 1 turn. 1/level.';
    case 'gauntlet':
      if (tier === 5) return 'He comes at you 5 turns. 2/level.';
      if (tier === 4) return 'He comes at you 4 turns. 2/level.';
      if (tier === 3) return 'He comes at you 3 turns. 2/level.';
      if (tier === 2) return 'He comes at you 3 turns. 1/level.';
      return 'He comes at you 2 turns. 1/level.';
    case 'panic':
      if (tier === 5) return 'He must step off his square. 3/level.';
      if (tier >= 3) return 'He must step off his square. 2/level.';
      return 'He must step off his square. 1/level.';
    case 'chequer':
      if (tier === 5) return 'No diagonal steps for him. 3/level.';
      if (tier >= 3) return 'No diagonal steps for him. 2/level.';
      return 'No diagonal steps for him. 1/level.';
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
    2: 'Now steals knights and bishops',
    3: 'Now steals queens',
    4: 'Steals pawns, minors, AND majors',
    5: 'Steals anything but the king',
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
    2: '1 raise a level → 2',
    3: 'Attacker frozen 1 turn → 2',
    4: '2 raises a level → 3',
    5: 'Shield lasts 3 turns and never breaks; every attacker freezes',
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
    4: 'Each use drops 2 stones',
    5: 'Unlimited stones',
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
    5: '4 turns → 5; a second charge',
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
    2: 'King stun 1 turn → 2',
    3: 'A second charge',
    4: '',
    5: 'King stun 2 turns → 3',
  },
  knighting: {
    2: 'Promoted summon gains 3 extra turns',
    3: 'Promotes two steps up, not one',
    4: 'Works on ANY rainbow ally',
    5: 'Straight to queen',
  },
  snare: {
    2: 'Holds 1 turn → 2',
    3: '',
    4: 'The trap bites: guards die on it',
    5: 'The trap re-arms after every spring',
  },
  shove: {
    2: '',
    3: 'The stone crushes a pawn it lands on',
    4: 'Reach: shove from 2 squares off',
    5: 'Unlimited shoves',
  },
  coup: {
    2: 'Any guard beside him, not only pawns',
    3: 'Reach: his whole room, or 2 squares',
    4: 'The swap stuns him for a turn',
    5: 'Any enemy, anywhere',
  },
  hourglass: {
    2: 'Two glasses a level',
    3: 'Three glasses a level',
    4: 'Four a level, and two in one turn',
    5: 'Six a level, and three in one turn',
  },
  scarecrow: {
    2: 'Stands 1 turn → 2',
    3: '',
    4: 'The straw is a queen: he fears diagonals too',
    5: 'Stands 3 turns. Attackers die (a capture, and a stun)',
  },
  gauntlet: {
    2: 'He answers 2 turns → 3',
    3: '',
    4: 'He answers 3 turns → 4',
    5: 'He answers 4 turns → 5',
  },
  panic: {
    2: '',
    3: '',
    4: '',
    5: '',
  },
  chequer: {
    2: '',
    3: '',
    4: '',
    5: '',
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

// ---------------------------------------------------------------------------
// Castability — "could this card EVER be cast in this level?" (2026-09-06)
//
// An offer that shows a card with no possible target is worse than a trap:
// the player burns a pick on a card that does literally nothing (Shove in a
// lava-only level; Swap with no summon anywhere in the kit). `rollOffer`
// filters the pools through `canEverCastInLevel` before it draws.
//
// TWO RULES shape the answer:
//
//  1. POSITION IS NOT DESTINY. Cards that key off Rookie's square (Shove,
//     Magnet, the summons-at-her-side, Bodyguard) are judged with Rookie
//     tried on every free square, because she can walk. Coup is judged with
//     the king tried on every square, because his guards shuffle around him.
//     Transient one-at-a-time locks (a straw already standing, a Twin still
//     alive) are cleared first — they expire.
//
//  2. TARGETS CAN APPEAR LATER. A card whose target is MADE by another card
//     is live whenever that other card is reachable in this level — owned
//     already, or in the run's own pool (`allowedAbilities` / the playtest
//     kit). Swap / Sacrifice / Knighting are live in any kit that also
//     contains a summon; Shove is live in any kit that contains Boulder,
//     even on a board with no stone on it yet. Filtering those out would
//     kill the Boulder-then-Shove pairing the runs are built around.
//
// Everything here REUSES each ability's real targeting helper (boulderTargets,
// shoveTargets, magnetTargets, coupTargets, summonSpawnSquares, ...) — there
// is deliberately no second copy of any targeting rule in this file.
// ---------------------------------------------------------------------------

// TEMP (remove before commit): lets the playtest harness roll pre-filter
// slates so the before/after numbers come from one build.
const OFFER_FILTER_OFF =
  typeof process !== 'undefined' && process.env?.RR_NO_OFFER_FILTER === '1';

/** Abilities with no target at all: they always resolve. */
const NO_TARGET_ABILITIES: ReadonlySet<AbilityId> = new Set<AbilityId>([
  'bishop-step',
  'knight-hop',
  'queen-pulse',
  'become-king',
  'drones',
  'squad',
  'surge',
  'aegis',
  'smoke',
  // Rewind and Hourglass read live turn state (no enemy phase has happened
  // yet when an offer is on screen), but every level HAS enemy turns — both
  // become castable on their own.
  'rewind',
  'hourglass',
  // Gauntlet needs nothing but a fleeing king, and every Revenge level has one.
  'gauntlet',
  // Panic is the same: a fleeing king is its only requirement.
  'panic',
  // Chequer likewise — it only ever needs a king with squares to step to.
  'chequer',
]);

/** Cards whose target must be MADE by another card (rule 2 above). */
function targetMakersFor(id: AbilityId): ReadonlyArray<AbilityId> {
  // Anything that puts a rainbow piece you control on the board. Squad's
  // allies are NOT controlled, so they only count for the cards that read
  // every ally at T4+ (Swap, Knighting) — never for Sacrifice.
  const controlledMakers: AbilityId[] = ['convert', 'summon-knight', ...SUMMON_ABILITIES];
  if (id === 'sacrifice') return controlledMakers;
  const withSquad: AbilityId[] = [...controlledMakers, 'squad'];
  if (id === 'swap') return withSquad;
  if (id === 'knighting') {
    // Same makers, minus the ones that only ever produce a queen — a queen
    // is already top of PROMOTION_ORDER and can never be knighted.
    return withSquad.filter(
      (m) => !isSummonAbility(m) || summonPieceFor(m) !== 'queen',
    );
  }
  if (id === 'shove') return ['boulder'];
  return [];
}

/** The state as it would be with `id` owned at `tier` (targeting reads tiers). */
function asIfOwned(state: BoardState, id: AbilityId, tier: AbilityTier): BoardState {
  return {
    ...state,
    abilities: [
      ...state.abilities.filter((a) => a.id !== id),
      { id, tier, mutations: [], usesLeftThisLevel: maxUsesForTier(id, tier) },
    ],
  };
}

/** Every square Rookie could plausibly stand on later (current square first). */
function rookieStandpoints(state: BoardState): BoardState[] {
  const out: BoardState[] = [state];
  for (let f = 1; f <= 8; f++) {
    for (let r = 1; r <= 8; r++) {
      if (state.rookie.file === f && state.rookie.rank === r) continue;
      if (state.hazards.some((h) => h.file === f && h.rank === r)) continue;
      if (state.pieces.some((p) => p.file === f && p.rank === r)) continue;
      if ((state.allies ?? []).some((a) => a.file === f && a.rank === r)) continue;
      out.push({ ...state, rookie: { file: f, rank: r } });
    }
  }
  return out;
}

/** Every square the enemy king could plausibly stand on (current square first). */
function kingStandpoints(state: BoardState): BoardState[] {
  const king = state.pieces.find((p) => p.type === 'king');
  if (!king) return [state];
  const out: BoardState[] = [state];
  for (let f = 1; f <= 8; f++) {
    for (let r = 1; r <= 8; r++) {
      if (king.file === f && king.rank === r) continue;
      if (state.hazards.some((h) => h.file === f && h.rank === r)) continue;
      if (state.pieces.some((p) => p.file === f && p.rank === r)) continue;
      out.push({
        ...state,
        pieces: state.pieces.map((p) => (p === king ? { ...p, file: f, rank: r } : p)),
      });
    }
  }
  return out;
}

/**
 * Is there at least ONE legal cast of this card somewhere in this level as it
 * stands? `availableIds` is the set of ability ids this level can still hand
 * the player (run allowlist / playtest kit / already owned) and drives rule 2.
 *
 * Conservative by design: when in doubt it answers TRUE, so the filter can
 * only ever remove cards that are provably dead.
 */
export function canEverCastInLevel(
  state: BoardState,
  id: AbilityId,
  tier: AbilityTier = 1,
  availableIds?: ReadonlySet<string>,
): boolean {
  if (NO_TARGET_ABILITIES.has(id)) return true;

  // Rule 2 — a card whose target another reachable card creates is live now.
  const makers = targetMakersFor(id);
  if (makers.length > 0) {
    const reachable = (m: AbilityId) =>
      state.abilities.some((a) => a.id === m) || (availableIds ? availableIds.has(m) : true);
    if (makers.some(reachable)) return true;
  }

  const hypo = asIfOwned(state, id, tier);
  const anySquare = (states: BoardState[], targets: (s: BoardState) => { length: number }): boolean =>
    states.some((s) => targets(s).length > 0);

  switch (id) {
    // Darts and tricks that need an enemy you can see.
    case 'freeze-ray':
    case 'poison-dart':
    case 'rabies-dart':
    case 'decoy':
      return visibleEnemySquares(hypo).length > 0;

    case 'convert':
      return convertTargets(hypo).length > 0;

    // Board-wide square picks — Rookie's square barely matters.
    case 'boulder':
      return boulderTargets(hypo).length > 0;
    case 'snare':
      return snareTargets(hypo).length > 0;
    case 'scarecrow':
      // One straw at a time is transient; judge the level, not this instant.
      return scarecrowTargets({ ...hypo, scarecrow: undefined }).length > 0;

    // Position-keyed: try Rookie everywhere she could walk.
    case 'shove':
      return anySquare(rookieStandpoints(hypo), shoveTargets);
    case 'magnet':
      return anySquare(rookieStandpoints(hypo), magnetTargets);
    case 'bodyguard':
      return rookieStandpoints(hypo).some((s) => bodyguardSpawnSquare(s) !== null);
    case 'summon-knight':
      return anySquare(
        rookieStandpoints({ ...hypo, allies: (hypo.allies ?? []).filter((a) => a.source !== 'squire') }),
        squireSpawnSquares,
      );

    // The king's own court: his guards move, so try the king everywhere.
    case 'coup':
      return anySquare(kingStandpoints(hypo), coupTargets);

    // Summon-dependent cards with no maker in the kit (rule 2 already ran):
    // live only if a controlled summon is on the board right now.
    case 'swap':
      return swapTargets(hypo).length > 0;
    case 'sacrifice':
      return sacrificeTargets(hypo).length > 0;
    case 'knighting':
      return knightingTargets(hypo).length > 0;

    default:
      if (isSummonAbility(id)) {
        const source = id as AllyPiece['source'];
        const cleared = { ...hypo, allies: (hypo.allies ?? []).filter((a) => a.source !== source) };
        return anySquare(rookieStandpoints(cleared), (s) => summonSpawnSquares(s, id));
      }
      // Unknown / new card: never filter what we can't judge.
      return true;
  }
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
/** The run this state belongs to, or null. Never throws. */
function runDefFor(runId: string | undefined): RunDef | null {
  if (!runId) return null;
  try {
    return getRunById(runId);
  } catch {
    return null;
  }
}

/**
 * The HIGHEST tier `id` may be offered / upgraded to in this run.
 *
 * Combo runs are validated with T1 cards but offers upgrade them mid-run, and
 * a middle tier repeatedly turned a gated finale into a one-card solo (see
 * RunDef.abilityTierCaps for the five measured breaks). A run declares its
 * ceiling; this is the single reading of it. Defaults to 5 (uncapped).
 */
export function abilityTierCapFor(runId: string | undefined, id: string): AbilityTier {
  // RR_NO_TIER_CAPS=1 lifts every cap, so a before/after full-run read comes
  // from ONE build (the `matrix` harness can't show this: it forces tiers).
  if (typeof process !== 'undefined' && process.env?.RR_NO_TIER_CAPS === '1') return 5;
  const c = runDefFor(runId)?.abilityTierCaps?.[id];
  if (typeof c !== 'number' || !Number.isFinite(c)) return 5;
  return Math.max(1, Math.min(5, Math.floor(c))) as AbilityTier;
}

export function rollOffer(state: BoardState, rng: () => number): AbilityOffer {
  const owned = new Map(state.abilities.map((a) => [a.id, a]));
  const ownedCount = owned.size;
  const atCap = ownedCount >= MAX_OWNED_ABILITIES;

  // Per-run allowlist (e.g. abilities-v2 test run). When set, restrict both
  // new offers AND upgrade offers to listed ids.
  const runDef = runDefFor(state.runId);
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

  // Per-run TIER CAP (RunDef.abilityTierCaps). This is the ONE place an
  // offered tier is decided, so it is the one place the cap is enforced: a
  // capped card stays offerable as a new pick (always T1) and upgradable up
  // to its cap, and an upgrade PAST the cap is simply never built into the
  // upgrade pool. Because the cap is applied to `upgradePool` itself — not to
  // the castability-filtered `upgradeLive` — every downstream path honours it,
  // including the at-cap branch and the `finish()` top-up that draws from the
  // unfiltered pools. Nothing here mutates a tier the player already holds.
  const capFor = (id: string): number => abilityTierCapFor(state.runId, id);

  const upgradePool: AbilityOfferOption[] = [...owned.values()]
    .filter((a) => a.tier < 5 && a.tier < capFor(a.id) && (!runAllowed || runAllowed.has(a.id)))
    .map((a) => {
      const next = (a.tier + 1) as AbilityTier;
      return {
        kind: 'upgrade',
        id: a.id,
        tier: next,
        description: blurbDetailForTier(a.id, next),
      };
    });

  // Never offer a card that cannot be cast in THIS level (2026-09-06).
  // See canEverCastInLevel above for the two rules. NOTE: this changes which
  // slate a given seed produces, so playtest traces recorded before today
  // will not reproduce their old offers — accepted deliberately.
  const availableIds = new Set<string>([
    ...(runAllowed ? [...runAllowed] : (ALL_ABILITY_IDS as string[])),
    ...owned.keys(),
  ]);
  const isCastable = (o: AbilityOfferOption): boolean => {
    // An upgrade is castable exactly when the card the player already owns
    // is: a tier changes the power, not whether a target can exist.
    const tier = o.kind === 'upgrade' ? (owned.get(o.id)?.tier ?? o.tier) : o.tier;
    return canEverCastInLevel(state, o.id, tier, availableIds);
  };
  const liveNew = OFFER_FILTER_OFF ? newPool : newPool.filter(isCastable);
  const liveUpgrades = OFFER_FILTER_OFF ? upgradePool : upgradePool.filter(isCastable);
  // If literally nothing is castable, keep the old behaviour rather than
  // handing the player an empty screen.
  const anyLive = liveNew.length + liveUpgrades.length > 0;
  const newLive = anyLive ? liveNew : newPool;
  const upgradeLive = anyLive ? liveUpgrades : upgradePool;

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

  /**
   * Never shrink the slate. If the castability filter left fewer live options
   * than `size`, top up from the UNFILTERED pools — a short slate reads as a
   * bug, a rare dead card only reads as a bad pick — and honour the core
   * guarantee first. Draws from an exhausted pool consume no RNG, so this is
   * a no-op (and determinism-neutral) whenever nothing was filtered.
   */
  const finish = (): AbilityOffer => {
    if (offer.length >= size) return offer;
    const wide = atCap ? upgradePool : [...upgradePool, ...newPool];
    const needCore = Math.max(0, coreMin - coreCount());
    if (needCore > 0) draw(wide.filter(isCore), needCore);
    draw(wide, size - offer.length);
    return offer;
  };

  if (atCap) {
    if (upgradePool.length === 0) return [];
    // Owned-only upgrades: seed the core guarantee first, then fill.
    if (coreMin > 0) draw(upgradeLive.filter(isCore), coreMin);
    draw(upgradeLive, size - offer.length);
    return finish();
  }

  if (ownedCount === 0) {
    if (coreMin > 0) draw(newLive.filter(isCore), coreMin);
    draw(newLive, size - offer.length);
    return finish();
  }

  if (upgradeLive.length > 0 && newLive.length > 0) {
    // One upgrade + the rest new (2-wide keeps the legacy 1+1 shape).
    draw(upgradeLive, 1);
    // Core guarantee: the new picks must supply whatever core is missing.
    const needCore = Math.max(0, coreMin - coreCount());
    if (needCore > 0) draw(newLive.filter(isCore), Math.min(needCore, size - offer.length));
    draw(newLive, size - offer.length);
    // Top up from upgrades if the new pool ran dry.
    if (offer.length < size) draw(upgradeLive, size - offer.length);
    return finish();
  }

  const fallback = newLive.length > 0 ? newLive : upgradeLive;
  if (coreMin > 0) draw(fallback.filter(isCore), coreMin);
  draw(fallback, size - offer.length);
  return finish();
}

export function offerIsExhausted(state: BoardState): boolean {
  if (state.abilities.length < MAX_OWNED_ABILITIES) return false;
  // A capped card is "topped out" at its cap, not at T5 — otherwise a run with
  // a tier cap would keep rolling offers that come back empty.
  return state.abilities.every((a) => a.tier >= abilityTierCapFor(state.runId, a.id));
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
  if (abilityId === 'snare') return snareTargets(state);
  if (abilityId === 'shove') return shoveTargets(state).map((t) => t.stone);
  if (abilityId === 'scarecrow') return scarecrowTargets(state);
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

function applyAbilityActivateImpl(
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
      shieldTurnsLeft: snap.shieldUp ? state.shieldTurnsLeft : 0,
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
  if (abilityId === 'hourglass') {
    return applyHourglass(state);
  }
  if (abilityId === 'gauntlet') {
    return applyGauntlet(state);
  }
  if (abilityId === 'panic') {
    return applyPanic(state);
  }
  if (abilityId === 'chequer') {
    return applyChequer(state);
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
    abilityId === 'knighting' ||
    abilityId === 'snare' ||
    abilityId === 'shove' ||
    abilityId === 'scarecrow';
  let step: 'pick-square' | 'pick-enemy' = 'pick-square';
  if (def.activation === 'targeted' && !picksSquare) step = 'pick-enemy';
  if (picksSquare && abilityLegalMoves(state, abilityId).length === 0) return state;
  if (abilityId === 'magnet' && magnetTargets(state).length === 0) return state;
  if (abilityId === 'coup' && coupTargets(state).length === 0) return state;
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

/** Aegis T5: enemy turns a raised shield lasts before it drops on its own. */
export const AEGIS_T5_TURNS = 3;

function applyAegis(state: BoardState): BoardState {
  const owned = state.abilities.find((a) => a.id === 'aegis');
  if (!owned) return state;
  if (state.shieldUp) return state;
  if (owned.usesLeftThisLevel === 0) return state;
  return {
    ...state,
    shieldUp: true,
    // T5: the shield is on a clock — 3 enemy turns, then it drops on its own.
    // T1-T4 stay up until they take a hit.
    shieldTurnsLeft: owned.tier === 5 ? AEGIS_T5_TURNS : 0,
    abilities: decrementUse(state.abilities, 'aegis'),
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

function applyAbilityMoveImpl(
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

function applyAbilityTargetedImpl(
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
    // The stolen piece becomes a CONTROLLED summon (Tyler, 2026-09-06:
    // "they need to be controllable summons") — source 'convert' is in
    // CONTROLLED_SOURCES, so it is tap-to-move, one body per turn, its
    // capture stuns, Sacrifice/Swap may target it, and it never moves on
    // its own. It is DAZED for the rest of this turn (no move / capture until
    // the player's next turn) so a piece stolen beside the king cannot take
    // him the same turn. clearStatusOnSquare cures it: a poisoned or rabid
    // marker belonged to the enemy it no longer is.
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
        // DAZED: it joins you now but acts from your NEXT turn (see AllyPiece.dazed).
        { id: Date.now() + Math.random(), type: hit.type, file: hit.file, rank: hit.rank, source: 'convert', dazed: true },
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
      // A dropped boulder is ROCK, never lava (2026-09-06 hazard-kind split).
      hazards: [...state.hazards, { file: target.file, rank: target.rank, kind: 'stone' }],
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
  if (abilityId === 'snare') {
    return applySnare(state, target);
  }
  if (abilityId === 'shove') {
    return applyShove(state, target);
  }
  if (abilityId === 'coup') {
    return applyCoup(state, target);
  }
  if (abilityId === 'scarecrow') {
    return applyScarecrow(state, target);
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
    const pulled: BoardState = {
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
    // Snare: a pulled piece landing on a trap springs it ("reposition then trap").
    return springSnaresAt(pulled, [toSq]);
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
      // Never on a snared square (a stone would bury the trap).
      if ((state.snares ?? []).some((sn) => sn.square === toSquare({ file, rank }))) continue;
      const walled: BoardState = {
        ...state,
        pieces: enemy ? state.pieces.filter((p) => p !== enemy) : state.pieces,
        hazards: [...state.hazards, { file, rank, kind: 'stone' as const }],
      };
      if (rookieLegalMoves(walled).length === 0) continue;
      out.push({ file, rank });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Snare (2026-09-06) — trap a square. The boulder trick with the sign
// flipped: instead of deleting his flight square you let him take it and keep
// him there. Invisible to the enemy AI (nothing paths around it); springs
// when an ENEMY arrives on it during the enemy phase by any means except
// Rewind: a flee step, an approach / push / capture landing, a Magnet pull, a
// Coup swap. Design: docs/new-abilities-2026-09-06.md §2.1.
// ---------------------------------------------------------------------------

/** Enemy turns a sprung piece is held. 1/2/2/3/3. */
export function snareHoldTurns(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier <= 3) return 2;
  return 3;
}

/** T4+: a non-king piece that springs the trap is captured instead of held. */
export function snareBites(tier: AbilityTier): boolean {
  return tier >= 4;
}

/** T5: the trap re-arms after every spring. */
export function snareRearms(tier: AbilityTier): boolean {
  return tier === 5;
}

/** Squares Snare may be set on: empty, no snare yet, not Rookie's square. */
export function snareTargets(state: BoardState): Coord[] {
  const owned = state.abilities.find((a) => a.id === 'snare');
  if (!owned) return [];
  const armed = new Set((state.snares ?? []).map((sn) => sn.square));
  const out: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    for (let r = 1; r <= 8; r++) {
      if (!squareIsFreeForSummon(state, f, r)) continue;
      if (armed.has(toSquare({ file: f, rank: r }))) continue;
      if (state.scarecrow?.square === toSquare({ file: f, rank: r })) continue;
      out.push({ file: f, rank: r });
    }
  }
  return out;
}

function applySnare(state: BoardState, target: Coord): BoardState {
  const owned = state.abilities.find((a) => a.id === 'snare');
  if (!owned || owned.usesLeftThisLevel === 0) return state;
  if (!snareTargets(state).some((c) => c.file === target.file && c.rank === target.rank)) return state;
  const sq = toSquare(target);
  return {
    ...state,
    snares: [...(state.snares ?? []), { square: sq }],
    abilities: decrementUse(state.abilities, 'snare'),
    activeAbility: null,
    cancellableActivation: undefined,
    lastAbilityFx: {
      kind: 'snare',
      from: toSquare(state.rookie),
      to: sq,
      id: Date.now() + Math.random(),
    },
  };
}

/**
 * Spring every armed snare on `arrivals` that now holds an ENEMY piece.
 * Called right after any enemy relocation (pawn-ai's applyAction and
 * kingReaction, Magnet's landing, Coup's swap). Arrival semantics, not
 * occupancy: a piece standing still on a re-armed trap is never re-bitten.
 *
 *  - Held: frozen for holdTurns + 1 (the Freeze Ray +1 trick — the spring is
 *    mid-turn and endTurn decrements at once, so "1 turn" still covers the
 *    NEXT enemy turn, the one Rookie needs to get onto his line).
 *  - T4+ bite: a non-king piece is CAPTURED instead (credited to Rookie:
 *    tempo, markers cleared, and kingStunTurns = 2 so the stun survives this
 *    turn's endTurn, the way a poison death is handled). The king is only
 *    ever held.
 *  - Consumed on springing; T5 re-arms.
 */
export function springSnaresAt(state: BoardState, arrivals: ReadonlyArray<string>): BoardState {
  const snares = state.snares ?? [];
  if (snares.length === 0) return state;
  const owned = state.abilities.find((a) => a.id === 'snare');
  const tier = owned?.tier ?? 1;
  let cur = state;
  for (const sq of new Set(arrivals)) {
    if (!(cur.snares ?? []).some((sn) => sn.square === sq)) continue;
    const c = fromSquare(sq);
    const piece = cur.pieces.find((p) => p.file === c.file && p.rank === c.rank);
    if (!piece) continue;
    const remaining = snareRearms(tier) ? cur.snares ?? [] : (cur.snares ?? []).filter((sn) => sn.square !== sq);
    if (piece.type !== 'king' && snareBites(tier)) {
      const cleared = clearStatusOnSquare(cur, sq);
      cur = {
        ...cur,
        ...cleared,
        snares: remaining,
        pieces: cur.pieces.filter((p) => p !== piece),
        captures: [...cur.captures, piece.type],
        tempo: Math.min(tempoMaxFor(cur), cur.tempo + (TEMPO_REWARD[piece.type] ?? 0)),
        decoyTarget: cur.decoyTarget === sq ? null : cur.decoyTarget,
        decoyTurnsLeft: cur.decoyTarget === sq ? 0 : cur.decoyTurnsLeft,
        ...stunKingAfterCapture(cur, 2),
        lastSnareSpring: { square: sq, pieceType: piece.type, bit: true, id: Date.now() + Math.random() },
      };
      continue;
    }
    const turns = snareHoldTurns(tier) + 1;
    cur = {
      ...cur,
      snares: remaining,
      frozenSquares: cur.frozenSquares.includes(sq) ? cur.frozenSquares : [...cur.frozenSquares, sq],
      frozenTurnsLeft: { ...cur.frozenTurnsLeft, [sq]: Math.max(cur.frozenTurnsLeft[sq] ?? 0, turns) },
      lastSnareSpring: { square: sq, pieceType: piece.type, bit: false, id: Date.now() + Math.random() },
    };
  }
  return cur;
}

// ---------------------------------------------------------------------------
// Shove (2026-09-06) — move terrain. Tap a stone beside Rookie and it rolls
// ONE square directly away from her: a gap opens where it was, a square dies
// where it lands. Authored walls and Boulder stones are the same array
// (`hazards`), so both roll — but only entries whose kind is 'stone' (the
// default); a lava square is terrain and is never a shove target. A run marks
// a stone `fixed: true` to refuse it,
// and a two-thick wall is shove-proof by construction (no chain pushes).
// Design: docs/new-abilities-2026-09-06.md §2.2.
// ---------------------------------------------------------------------------

/** T3+: a stone landing on an enemy PAWN crushes it (a Rookie capture). */
export function shoveCrushes(tier: AbilityTier): boolean {
  return tier >= 3;
}

/** T4+: also stones on Rookie's rook lines two squares off, nothing between. */
export function shoveReach(tier: AbilityTier): number {
  return tier >= 4 ? 2 : 1;
}

export interface ShoveTarget {
  stone: Coord;
  dest: Coord;
  crushed: EnemyPiece | null;
}

/**
 * Stones Rookie may shove right now, with where each one lands. Legal when
 * the destination is in bounds and free of enemy (except a crushable pawn),
 * ally, drone, hazard, snare, scarecrow and Rookie — and never a shove that
 * leaves Rookie with no legal move (the Boulder self-lock check).
 */
export function shoveTargets(state: BoardState): ShoveTarget[] {
  const owned = state.abilities.find((a) => a.id === 'shove');
  if (!owned) return [];
  const crush = shoveCrushes(owned.tier);
  const reach = shoveReach(owned.tier);
  const out: ShoveTarget[] = [];
  const consider = (stone: Hazard, df: number, dr: number) => {
    // Lava is TERRAIN, not a block: you cannot push a river. Only stone rolls,
    // and only stone that a run has not pinned with `fixed`.
    if (stone.kind === 'lava') return;
    if (stone.fixed) return;
    const dest = { file: stone.file + df, rank: stone.rank + dr };
    if (!allyInBounds(dest.file, dest.rank)) return;
    if (allyIsHazard(state, dest.file, dest.rank)) return;
    if (state.rookie.file === dest.file && state.rookie.rank === dest.rank) return;
    if ((state.allies ?? []).some((a) => a.file === dest.file && a.rank === dest.rank)) return;
    if ((state.drones ?? []).some((d) => d.alive && d.file === dest.file && d.rank === dest.rank)) return;
    const destSq = toSquare(dest);
    if ((state.snares ?? []).some((sn) => sn.square === destSq)) return;
    if (state.scarecrow?.square === destSq) return;
    const enemy = state.pieces.find((p) => p.file === dest.file && p.rank === dest.rank);
    if (enemy && !(crush && enemy.type === 'pawn')) return;
    const moved: BoardState = {
      ...state,
      pieces: enemy ? state.pieces.filter((p) => p !== enemy) : state.pieces,
      hazards: [...state.hazards.filter((h) => h !== stone), { file: dest.file, rank: dest.rank, kind: 'stone' as const }],
    };
    if (rookieLegalMoves(moved).length === 0) return;
    out.push({ stone: { file: stone.file, rank: stone.rank }, dest, crushed: enemy ?? null });
  };
  for (const stone of state.hazards) {
    const df = stone.file - state.rookie.file;
    const dr = stone.rank - state.rookie.rank;
    const d = Math.max(Math.abs(df), Math.abs(dr));
    if (d === 1) {
      consider(stone, Math.sign(df), Math.sign(dr));
    } else if (d === 2 && reach >= 2 && (df === 0 || dr === 0)) {
      // On a rook line two away: the square between must be open.
      const midF = state.rookie.file + Math.sign(df);
      const midR = state.rookie.rank + Math.sign(dr);
      if (allyIsHazard(state, midF, midR)) continue;
      if (state.pieces.some((p) => p.file === midF && p.rank === midR)) continue;
      if ((state.allies ?? []).some((a) => a.file === midF && a.rank === midR)) continue;
      if ((state.drones ?? []).some((x) => x.alive && x.file === midF && x.rank === midR)) continue;
      consider(stone, Math.sign(df), Math.sign(dr));
    }
  }
  return out;
}

function applyShove(state: BoardState, target: Coord): BoardState {
  const owned = state.abilities.find((a) => a.id === 'shove');
  if (!owned || owned.usesLeftThisLevel === 0) return state;
  const hit = shoveTargets(state).find((t) => t.stone.file === target.file && t.stone.rank === target.rank);
  if (!hit) return state;
  const stone = state.hazards.find((h) => h.file === hit.stone.file && h.rank === hit.stone.rank);
  if (!stone) return state;
  const destSq = toSquare(hit.dest);
  const crushed = hit.crushed;
  const statusOverlay = crushed ? clearStatusOnSquare(state, destSq) : null;
  const clearDecoy = !!crushed && state.decoyTarget === destSq;
  return {
    ...state,
    ...(statusOverlay ?? {}),
    // The moved stone is loose by definition (it was never fixed) and stays
    // rock — Shove never touches lava, so a shoved square is always stone.
    hazards: [...state.hazards.filter((h) => h !== stone), { file: hit.dest.file, rank: hit.dest.rank, kind: 'stone' }],
    pieces: crushed ? state.pieces.filter((p) => p !== crushed) : state.pieces,
    captures: crushed ? [...state.captures, crushed.type] : state.captures,
    tempo: crushed
      ? Math.min(tempoMaxFor(state), state.tempo + (TEMPO_REWARD[crushed.type] ?? 0))
      : state.tempo,
    decoyTarget: clearDecoy ? null : state.decoyTarget,
    decoyTurnsLeft: clearDecoy ? 0 : state.decoyTurnsLeft,
    abilities: decrementUse(state.abilities, 'shove'),
    activeAbility: null,
    cancellableActivation: undefined,
    ...(crushed ? stunKingAfterCapture(state) : {}),
    lastAbilityFx: {
      kind: 'shove',
      from: toSquare(hit.stone),
      to: destSq,
      id: Date.now() + Math.random(),
    },
  };
}

// ---------------------------------------------------------------------------
// Coup (2026-09-06) — move the king himself: swap him with one of his own
// guards. His man takes the throne, he takes the post — and guards stand on
// posts because posts have lines to them. Everything that belongs to a
// square rides with its piece (poison, rabies, frozen, decoy). The pen
// gains his new square if it was outside, so he is never stuck outside the
// rules, but he can only walk back through squares already in the pen.
// Design: docs/new-abilities-2026-09-06.md §2.3.
// ---------------------------------------------------------------------------

/** T4+: the swap stuns him for a turn. */
export function coupStuns(tier: AbilityTier): boolean {
  return tier >= 4;
}

/** Enemies Coup may swap with the king at this tier (never the king). */
export function coupTargets(state: BoardState): Coord[] {
  const owned = state.abilities.find((a) => a.id === 'coup');
  if (!owned || state.winCondition !== 'king') return [];
  const king = state.pieces.find((p) => p.type === 'king');
  if (!king) return [];
  const pen = state.kingPen ? new Set(state.kingPen) : null;
  const cheb = (p: Coord) => Math.max(Math.abs(p.file - king.file), Math.abs(p.rank - king.rank));
  return state.pieces
    .filter((p) => {
      if (p.type === 'king') return false;
      if (owned.tier === 1) return p.type === 'pawn' && cheb(p) === 1;
      if (owned.tier === 2) return cheb(p) === 1;
      if (owned.tier <= 4) return cheb(p) <= 2 || (!!pen && pen.has(toSquare(p)));
      return true;
    })
    .map((p) => ({ file: p.file, rank: p.rank }));
}

/** Trade every square-keyed marker between two squares (poison / rabies / frozen / decoy). */
function swapStatusMarkers(
  state: BoardState,
  a: string,
  b: string,
): Pick<
  BoardState,
  'poisonedSquares' | 'poisonedTurnsLeft' | 'rabidSquares' | 'rabidTurnsLeft' | 'frozenSquares' | 'frozenTurnsLeft' | 'decoyTarget'
> {
  const swapList = (list: string[]): string[] =>
    list.map((sq) => (sq === a ? b : sq === b ? a : sq));
  const swapMap = (m: Record<string, number>): Record<string, number> => {
    const out: Record<string, number> = { ...m };
    delete out[a];
    delete out[b];
    if (m[a] !== undefined) out[b] = m[a];
    if (m[b] !== undefined) out[a] = m[b];
    return out;
  };
  return {
    poisonedSquares: swapList(state.poisonedSquares),
    poisonedTurnsLeft: swapMap(state.poisonedTurnsLeft),
    rabidSquares: swapList(state.rabidSquares),
    rabidTurnsLeft: swapMap(state.rabidTurnsLeft),
    frozenSquares: swapList(state.frozenSquares),
    frozenTurnsLeft: swapMap(state.frozenTurnsLeft),
    decoyTarget: state.decoyTarget === a ? b : state.decoyTarget === b ? a : state.decoyTarget,
  };
}

function applyCoup(state: BoardState, target: Coord): BoardState {
  const owned = state.abilities.find((a) => a.id === 'coup');
  if (!owned || owned.usesLeftThisLevel === 0) return state;
  if (!coupTargets(state).some((c) => c.file === target.file && c.rank === target.rank)) return state;
  const king = state.pieces.find((p) => p.type === 'king');
  const guard = state.pieces.find((p) => p.file === target.file && p.rank === target.rank);
  if (!king || !guard) return state;
  const kingSq = toSquare(king);
  const guardSq = toSquare(guard);
  const pen = state.kingPen;
  const swapped: BoardState = {
    ...state,
    ...swapStatusMarkers(state, kingSq, guardSq),
    pieces: state.pieces.map((p) =>
      p === king
        ? { ...p, file: guard.file, rank: guard.rank }
        : p === guard
          ? { ...p, file: king.file, rank: king.rank }
          : p,
    ),
    // His pen grows to include the post if it was outside — he is never
    // stuck outside the rules, and the post is usually a cell of one.
    kingPen: pen && !pen.includes(guardSq) ? [...pen, guardSq] : pen,
    abilities: decrementUse(state.abilities, 'coup'),
    activeAbility: null,
    cancellableActivation: undefined,
    ...(coupStuns(owned.tier) ? stunKingAfterCapture(state, 1) : {}),
    lastAbilityFx: {
      kind: 'coup',
      from: guardSq,
      to: kingSq,
      id: Date.now() + Math.random(),
    },
  };
  // Snare: a king (or guard) swapped onto a trap springs it.
  return springSnaresAt(swapped, [guardSq, kingSq]);
}

// ---------------------------------------------------------------------------
// Hourglass (2026-09-06; REWORKED 2026-09-06 — see docs/revenge-abilities.md).
// Time. Turn the glass: the enemies take a full turn NOW, and Rookie's move is
// still in hand.
//
// THE ONE RULE: a glass-turn is a turn taken OUT OF ROOKIE'S CLOCK. `moveCount`
// does not tick and NOTHING of hers expires during it — freeze/snare holds, the
// king's stun, smoke, the straw, the decoy mark, rabies, king-form protection,
// summon clocks, a convert daze and the once-per-turn summon move all stand.
// Enemy FUSES still burn: `poisonedTurnsLeft` is the single counter that ticks,
// because poison is a bomb going off, not a protection running out. All of that
// lives in `endTurn` (lib/run/pawn-ai.ts) behind `s.glassTurn`.
//
// The king REACTS on a glass-turn exactly as he does on any enemy turn — he
// flees, he steps into a snare, he runs from a straw. That is the card's whole
// verb ("let them walk while your move is still in hand") and it is now true at
// every tier. The old T3 `hourglassHoldsKing` clause did the opposite: it froze
// him, deleting the one line the card existed to create (revenge-31's header).
//
// The tiers are pure QUANTITY: more glasses per level, then more per turn.
// 1 use / 2 / 3 / 3 + two per turn / unlimited.
// Design: docs/new-abilities-2026-09-06.md §2.4.
// ---------------------------------------------------------------------------

/** How many times the glass may be turned within a single Rookie turn. */
export function hourglassCastsPerTurn(tier: AbilityTier): number {
  if (tier >= 5) return 3;
  if (tier === 4) return 2;
  return 1;
}

/** True when the glass may be turned right now. */
export function canTurnHourglass(state: BoardState): boolean {
  const owned = state.abilities.find((a) => a.id === 'hourglass');
  if (!owned || owned.usesLeftThisLevel === 0) return false;
  if (state.status !== 'playing' || state.turn !== 'rookie') return false;
  if (state.activeAbility || state.pendingOffer) return false;
  if ((state.hourglassCastsThisTurn ?? 0) >= hourglassCastsPerTurn(owned.tier)) return false;
  return true;
}

function applyHourglass(state: BoardState): BoardState {
  if (!canTurnHourglass(state)) return state;
  const rookieSq = toSquare(state.rookie);
  const allyPhase = (state.allies ?? []).some((a) => !isControlledAlly(a));
  return {
    ...state,
    turn: allyPhase ? 'allies' : 'enemy',
    allyTurnIndex: 0,
    enemyMovedSquares: [],
    enemyVacatedSquares: [],
    glassTurn: true,
    hourglassCastsThisTurn: (state.hourglassCastsThisTurn ?? 0) + 1,
    abilities: decrementUse(state.abilities, 'hourglass'),
    activeAbility: null,
    cancellableActivation: undefined,
    lastAbilityFx: {
      kind: 'hourglass',
      from: rookieSq,
      to: rookieSq,
      id: Date.now() + Math.random(),
    },
  };
}

// ---------------------------------------------------------------------------
// Scarecrow (2026-09-06) — information. A straw Rookie on an empty square:
// for N enemy phases the court and the king plan against a VIEW in which the
// straw's square IS Rookie (rook-form; queen-form from T4) and the real
// Rookie is an uncapturable blocker (see scarecrowViewState in pawn-ai.ts).
// Hunters charge it, guards fear its lines, the king flees from IT — which
// is a steering wheel, because his flee is deterministic. Striking the straw
// destroys it and wastes the action; at T5 the striker dies instead. The
// straw blocks Rookie's own moves and her summons like a body.
// Design: docs/new-abilities-2026-09-06.md §2.5.
// ---------------------------------------------------------------------------

/** Enemy turns the straw stands. 1/2/2/2/3. */
export function scarecrowTurns(tier: AbilityTier): number {
  if (tier === 1) return 1;
  if (tier <= 4) return 2;
  return 3;
}

// ---------------------------------------------------------------------------
// Gauntlet (2026-09-07) — the LURE. Every other card in the catalogue that
// touches the king takes a square away from him (Boulder, Snare), holds him
// (Freeze Ray), shoves him one square (Coup, T5 Magnet) or lies to him about
// where Rookie is (Scarecrow, Decoy). This one changes what he WANTS: for
// `tauntTurnsForTier` enemy phases he ANSWERS — at the top of the enemy turn,
// before the army acts and instead of the usual flee reaction, he takes one
// step toward Rookie.
//
// Three rules make it a lure and not a win button:
//   1. HE IS PROUD, NOT SUICIDAL. He refuses any square Rookie's CURRENT form
//      attacks, exactly as a flee does — so a rook sitting on the corridor
//      closes the corridor and he simply stands there. The card cannot walk
//      him onto her line while she can be seen. (Smoke is the whole point:
//      `isSmoked` means the court cannot see her, so the refusal has nothing
//      to read and he walks straight down her file.)
//   2. HE STILL FLEES. A taunt never suppresses the flee reaction; a threatened
//      king sidesteps first and answers only when he is not in danger.
//   3. HE NEVER GOES BACK. The pen does not hold an answering king, and the
//      moment he steps out of it `kingPen` is dropped for the rest of the
//      level. That is the cost of the card: the room you could not enter was
//      also the room that kept him cornerable, and an open-board king is the
//      hardest thing in this game for a lone rook to catch.
// Verb: LURE. See lib/run/pawn-ai.ts `kingAnswerMove` for the step itself.
// ---------------------------------------------------------------------------

/** Enemy turns the challenge stands. 2/3/3/4/5. */
export function tauntTurnsForTier(tier: AbilityTier): number {
  if (tier === 1) return 2;
  if (tier <= 3) return 3;
  if (tier === 4) return 4;
  return 5;
}

/** True when the gauntlet may be thrown right now. */
export function canThrowGauntlet(state: BoardState): boolean {
  const owned = state.abilities.find((a) => a.id === 'gauntlet');
  if (!owned || owned.usesLeftThisLevel === 0) return false;
  if (state.status !== 'playing' || state.turn !== 'rookie') return false;
  if (state.activeAbility || state.pendingOffer) return false;
  if (state.winCondition !== 'king' || state.kingBehavior !== 'flee') return false;
  return state.pieces.some((p) => p.type === 'king');
}

function applyGauntlet(state: BoardState): BoardState {
  if (!canThrowGauntlet(state)) return state;
  const owned = state.abilities.find((a) => a.id === 'gauntlet')!;
  const king = state.pieces.find((p) => p.type === 'king')!;
  const kingSq = toSquare(king);
  return {
    ...state,
    // A fresh throw always resets the clock — it never stacks.
    tauntTurns: tauntTurnsForTier(owned.tier),
    abilities: decrementUse(state.abilities, 'gauntlet'),
    activeAbility: null,
    lastAbilityFx: {
      kind: 'gauntlet',
      from: toSquare(state.rookie),
      to: kingSq,
      id: Date.now() + Math.random(),
    },
  };
}

// ---------------------------------------------------------------------------
// PANIC (2026-09-07) — the catalogue's zugzwang.
//
// Every other card in the game that touches the king answers the question
// "which square is he on / which squares can he reach": Boulder and Snare
// delete his squares, Coup moves him to one, Freeze Ray stops him leaving,
// Scarecrow and Gauntlet change which one he wants. NONE of them touches the
// option he actually uses on a sealed throne — STANDING STILL. A king who is
// not threatened simply never moves, so a square no line reaches is a square
// he owns forever, and the level is unwinnable however clever the geometry.
//
// Panic takes that option away for exactly one enemy phase. He still picks the
// best square he can see (`kingPanicMove` in pawn-ai.ts uses the flee's own
// safety test), and his pen still holds him — so the card is only ever as good
// as the work done BEFORE it is thrown. Fill or cover every safe step first and
// the panic is a kill; throw it into a room with a spare square and you have
// pushed him one square sideways and spent a card.
// ---------------------------------------------------------------------------

/** True when Panic may be thrown right now. */
export function canPanic(state: BoardState): boolean {
  const owned = state.abilities.find((a) => a.id === 'panic');
  if (!owned || owned.usesLeftThisLevel === 0) return false;
  if (state.status !== 'playing' || state.turn !== 'rookie') return false;
  if (state.activeAbility || state.pendingOffer) return false;
  if (state.winCondition !== 'king' || state.kingBehavior !== 'flee') return false;
  return state.pieces.some((p) => p.type === 'king');
}

function applyPanic(state: BoardState): BoardState {
  if (!canPanic(state)) return state;
  const king = state.pieces.find((p) => p.type === 'king')!;
  return {
    ...state,
    // Always exactly the next enemy phase, at every tier. Cleared in endTurn
    // whether or not he found a step to take.
    panicTurns: 1,
    abilities: decrementUse(state.abilities, 'panic'),
    activeAbility: null,
    lastAbilityFx: {
      kind: 'panic',
      from: toSquare(state.rookie),
      to: toSquare(king),
      id: Date.now() + Math.random(),
    },
  };
}

// ---------------------------------------------------------------------------
// Chequer (2026-09-08, testing) — the catalogue's first card that takes away a
// DIRECTION rather than a square, a turn, or a preference.
//
// Every other card that touches the king argues about WHICH square he ends on
// (Boulder and Snare delete one, Coup puts him on one, Scarecrow and Gauntlet
// change the one he wants) or about WHETHER he moves at all (Freeze stops him,
// Panic compels him). Chequer argues about HOW he gets there: for one enemy
// phase he may not set foot on a square of his own colour, so all four
// diagonal steps are illegal and he moves like a rook.
//
// The geometry is the point, and it is exact: a king's four DIAGONAL
// neighbours are always his own colour and his four ORTHOGONAL neighbours are
// always the other one. So a chequer does not shrink his room by a random
// half — it hands him a flight set that is entirely one colour, and one
// light-squared body covers all four of them at once. Which is why the card
// has a partner and cannot be a solvent: alone it leaves him four squares.
// ---------------------------------------------------------------------------

/** True when Chequer may be cast right now. */
export function canChequer(state: BoardState): boolean {
  const owned = state.abilities.find((a) => a.id === 'chequer');
  if (!owned || owned.usesLeftThisLevel === 0) return false;
  if (state.status !== 'playing' || state.turn !== 'rookie') return false;
  if (state.activeAbility || state.pendingOffer) return false;
  if (state.winCondition !== 'king' || state.kingBehavior !== 'flee') return false;
  return state.pieces.some((p) => p.type === 'king');
}

function applyChequer(state: BoardState): BoardState {
  if (!canChequer(state)) return state;
  const king = state.pieces.find((p) => p.type === 'king')!;
  return {
    ...state,
    // Always exactly the next enemy phase, at every tier — and it holds for
    // the WHOLE phase, so the re-checks after each guard move see it too.
    // Cleared in endTurn.
    chequerTurns: 1,
    abilities: decrementUse(state.abilities, 'chequer'),
    activeAbility: null,
    lastAbilityFx: {
      kind: 'chequer',
      from: toSquare(state.rookie),
      to: toSquare(king),
      id: Date.now() + Math.random(),
    },
  };
}

/** T4+: the straw is a queen — he fears its diagonals too. */
export function scarecrowForm(tier: AbilityTier): 'rook' | 'queen' {
  return tier >= 4 ? 'queen' : 'rook';
}

/** T5: whatever strikes the straw dies on the spot (a Rookie capture). */
export function scarecrowKillsAttackers(tier: AbilityTier): boolean {
  return tier === 5;
}

/** Empty squares a straw may stand on (one straw at a time). */
export function scarecrowTargets(state: BoardState): Coord[] {
  const owned = state.abilities.find((a) => a.id === 'scarecrow');
  if (!owned) return [];
  if (state.scarecrow) return [];
  const armed = new Set((state.snares ?? []).map((sn) => sn.square));
  const out: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    for (let r = 1; r <= 8; r++) {
      if (!squareIsFreeForSummon(state, f, r)) continue;
      if (armed.has(toSquare({ file: f, rank: r }))) continue;
      out.push({ file: f, rank: r });
    }
  }
  return out;
}

function applyScarecrow(state: BoardState, target: Coord): BoardState {
  const owned = state.abilities.find((a) => a.id === 'scarecrow');
  if (!owned || owned.usesLeftThisLevel === 0) return state;
  if (!scarecrowTargets(state).some((c) => c.file === target.file && c.rank === target.rank)) return state;
  const sq = toSquare(target);
  return {
    ...state,
    scarecrow: { square: sq, turnsLeft: scarecrowTurns(owned.tier), form: scarecrowForm(owned.tier) },
    abilities: decrementUse(state.abilities, 'scarecrow'),
    activeAbility: null,
    cancellableActivation: undefined,
    lastAbilityFx: {
      kind: 'scarecrow',
      from: toSquare(state.rookie),
      to: sq,
      id: Date.now() + Math.random(),
    },
  };
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
    //
    // The snapshot is taken at the START of the enemy phase, so anything
    // Rookie casts on the FOLLOWING turn — before she moves, which is exactly
    // when Rewind is legal — is not in it. Spreading the snapshot therefore
    // used to silently un-cast it. Tyler, 2026-09-08: "I did Queen Pulse and
    // then I did rewind and it reset my Queen Pulse. I'm not sure if that's
    // what we want." It is not: the card's whole promise is that the ENEMIES
    // take their turn back and you don't. Every one of Rookie's own live
    // effects is carried forward from the CURRENT state, not the snapshot.
    abilities: decrementUse(state.abilities, 'rewind'),
    form: state.form,
    formMovesLeft: state.formMovesLeft,
    shieldUp: state.shieldUp,
    bonusMovesLeft: state.bonusMovesLeft,
    smokeTurnsLeft: state.smokeTurnsLeft,
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
    // A snapshot taken at the start of a glass-turn carries the Hourglass
    // flag; the restored board is Rookie's turn again, so drop it.
    glassTurn: undefined,
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
      if (state.scarecrow?.square === toSquare({ file: f, rank: r })) break;
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
    if (state.scarecrow?.square === toSquare({ file: nf, rank: nr })) break;
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
    // SUMMONING SICKNESS, Endless only. Summon Knight has its OWN spawn
    // function rather than going through applySummonAlly, which is why the
    // first measurement (2026-09-08) showed it moving by exactly 0.0 — the rule
    // never reached it. Two spawn paths, so the field has to be set twice.
    ...(state.endless ? { dazed: true } : {}),
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
function applySquireMoveImpl(state: BoardState, target: Coord): BoardState {
  const sq = squireOf(state);
  if (!sq) return state;
  return applyControlledAllyMove(state, { file: sq.file, rank: sq.rank }, target);
}

// ---------------------------------------------------------------------------
// Controllable summons — the Squire FAMILY (2026-09-01).
//
// One shared engine for every piece the PLAYER summons and steers on her own
// turns: Squire (knight), Bishop Squire, Page (pawn that promotes), Twin
// (rook), Duchess (queen), Vanguard (dropped knight), and — since
// 2026-09-06 — any enemy stolen by Convert (it keeps its type). All of them:
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
  'convert',
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
  if (state.scarecrow?.square === toSquare({ file: f, rank: r })) return false;
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
  // THE DRAGON ALWAYS LANDS BESIDE YOU — every tier, no exception (Tyler,
  // 2026-09-08: "you should only deploy the dragon right next to you, it's
  // too OP bro"). T5 used to drop her anywhere within 3 squares, which let
  // the strongest piece in the game appear next to the king from across the
  // room with nothing spent to get there. She keeps her T5 upgrades — 5 turns
  // and a second charge — and now has to be walked into range like everyone
  // else's summon.
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
    // SUMMONING SICKNESS — ENDLESS ONLY (Tyler, 2026-09-09: "push it to
    // endless"). A body arrives and does nothing until your next turn, so a
    // summon is a THREAT you have to protect for a turn, not an instant answer
    // you drop beside the king and cash in on the spot. The king still FLEES a
    // sick summon — the fear check is pure geometry and never consults `dazed`
    // — so this removes the instant kill, not the pressure.
    //
    // The ladder deliberately keeps the old rule: measured 2026-09-08, sickness
    // takes ladder rungs 5/8/9 to 0-3% while leaving rungs 1/3/7 untouched
    // (their kits hold no summons). It goes in there when those finales are
    // re-tuned, not before. See docs/SUMMONING-SICKNESS-FULL-2026-09-08.md.
    ...(state.endless ? { dazed: true } : {}),
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
  if (ally.dazed) return false; // freshly converted, or summon-sick in Endless
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
function applyControlledAllyMoveImpl(
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

/** How long a king caught in the blast box is stunned, by tier. */
export function sacrificeKingStunForTier(tier: AbilityTier): number {
  if (tier >= 5) return 3;
  if (tier >= 2) return 2;
  return 1;
}

/**
 * Blast shapes (2026-09-09, Tyler: PIECE-SHAPED, not a box). Keyed on how the
 * summon moves; the dragon is her own kind (queen + knight = the full 5x5).
 */
export type SacrificeBlastKind = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'dragon';

/** Which blast shape a summon detonates with — its move pattern. */
export function sacrificeBlastKind(piece: Pick<AllyPiece, 'type' | 'source'>): SacrificeBlastKind {
  if (piece.source === 'dragon') return 'dragon';
  switch (piece.type) {
    case 'pawn':
      return 'pawn';
    case 'knight':
      return 'knight';
    case 'bishop':
      return 'bishop';
    case 'rook':
      return 'rook';
    case 'queen':
      return 'queen';
    case 'king':
      // No ally is ever a king (Convert skips him); if one ever were, treat
      // the blast as the queen shape capped like every other line piece.
      return 'queen';
  }
}

/**
 * Preview tints — one per blast kind, distinct on the green/cream board so
 * overlapping shapes still read as "this one belongs to that summon".
 * `wash` floods the blast squares, `ring` outlines them (and rings enemies
 * inside), `own` marks the summon's own square in its color.
 */
export const SACRIFICE_BLAST_TINTS: Record<
  SacrificeBlastKind,
  { name: string; wash: string; ring: string; own: string }
> = {
  queen: { name: 'ember', wash: 'rgba(249, 115, 22, 0.42)', ring: 'rgba(234, 88, 12, 0.95)', own: 'rgba(249, 115, 22, 0.28)' },
  knight: { name: 'violet', wash: 'rgba(168, 85, 247, 0.42)', ring: 'rgba(126, 34, 206, 0.95)', own: 'rgba(168, 85, 247, 0.28)' },
  bishop: { name: 'teal', wash: 'rgba(20, 184, 166, 0.46)', ring: 'rgba(13, 148, 136, 0.95)', own: 'rgba(20, 184, 166, 0.30)' },
  rook: { name: 'gold', wash: 'rgba(250, 204, 21, 0.50)', ring: 'rgba(202, 138, 4, 0.95)', own: 'rgba(250, 204, 21, 0.34)' },
  pawn: { name: 'rose', wash: 'rgba(244, 114, 182, 0.46)', ring: 'rgba(219, 39, 119, 0.95)', own: 'rgba(244, 114, 182, 0.30)' },
  dragon: { name: 'red', wash: 'rgba(239, 68, 68, 0.42)', ring: 'rgba(185, 28, 28, 0.95)', own: 'rgba(239, 68, 68, 0.28)' },
};

/** How far a line-piece blast reaches along each of its lines. */
export const SACRIFICE_BLAST_REACH = 2;

/**
 * The Sacrifice blast: the squares the summon ATTACKS from `from`, each line
 * capped at 2 squares out, computed on an EMPTY board — it is an explosion,
 * not a move, so blockers never shorten it. The summon's own square is
 * excluded. The SAME squares the board tints while the card is armed, so what
 * you see is what explodes.
 *
 *   pawn   — the two diagonal-forward squares (allies push toward rank 8)
 *   knight — its 8 knight squares
 *   bishop — 4 diagonals x 2 out = 8
 *   rook   — 4 orthogonals x 2 out = 8
 *   queen  — all 8 lines x 2 out = 16
 *   dragon — queen lines + knight squares = the full 5x5 box (24)
 */
export function sacrificeBlastSquares(piece: Pick<AllyPiece, 'type' | 'source'>, from: Coord): Coord[] {
  const kind = sacrificeBlastKind(piece);
  const out: Coord[] = [];
  const add = (f: number, r: number) => {
    if (allyInBounds(f, r)) out.push({ file: f, rank: r });
  };
  const lines = (dirs: ReadonlyArray<[number, number]>) => {
    for (const [df, dr] of dirs) {
      for (let step = 1; step <= SACRIFICE_BLAST_REACH; step++) add(from.file + df * step, from.rank + dr * step);
    }
  };
  const knight = () => {
    for (const [df, dr] of ALLY_KNIGHT_DELTAS) add(from.file + df, from.rank + dr);
  };
  switch (kind) {
    case 'pawn':
      add(from.file - 1, from.rank + 1);
      add(from.file + 1, from.rank + 1);
      break;
    case 'knight':
      knight();
      break;
    case 'bishop':
      lines(ALLY_BISHOP_DIRS);
      break;
    case 'rook':
      lines(ALLY_ROOK_DIRS);
      break;
    case 'queen':
      lines(ALLY_QUEEN_DIRS);
      break;
    case 'dragon':
      lines(ALLY_QUEEN_DIRS);
      knight();
      break;
  }
  return out;
}

/**
 * Every summon Sacrifice could detonate right now, with its blast — the one
 * list the board preview draws from (per-summon color, so overlapping shapes
 * stay legible).
 */
export function sacrificeBlastPreview(
  state: BoardState,
): Array<{ summon: Coord; kind: SacrificeBlastKind; squares: Coord[] }> {
  const owned = state.abilities.find((a) => a.id === 'sacrifice');
  if (!owned) return [];
  return controlledAllies(state).map((a) => {
    const summon = { file: a.file, rank: a.rank };
    return { summon, kind: sacrificeBlastKind(a), squares: sacrificeBlastSquares(a, summon) };
  });
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
  // ONE rule (2026-09-09): the blast is PIECE-SHAPED — the squares the summon
  // attacks, 2 out along each line, blockers ignored (sacrificeBlastSquares,
  // shared with the board preview). Every enemy inside is captured. The king
  // is never captured by a blast — only Rookie takes him — but a king inside
  // is stunned (1 / 2 / 3 turns by tier). Tiers change the stun and the
  // charges, never the shape.
  const blast = new Set(sacrificeBlastSquares(ally, ally).map(toSquare));
  const victims = state.pieces.filter(
    (p) => p.type !== 'king' && blast.has(toSquare({ file: p.file, rank: p.rank })),
  );
  const king = state.pieces.find((p) => p.type === 'king');
  const kingInBlast = !!king && blast.has(toSquare({ file: king.file, rank: king.rank }));
  let working: BoardState = state;
  const captures = [...state.captures];
  let tempo = state.tempo;
  for (const v of victims) {
    const sq = toSquare({ file: v.file, rank: v.rank });
    working = { ...working, ...clearStatusOnSquare(working, sq) };
    captures.push(v.type);
    tempo = Math.min(tempoMaxFor(state), tempo + (TEMPO_REWARD[v.type] ?? 0));
  }
  const kingStun = kingInBlast ? sacrificeKingStunForTier(owned.tier) : victims.length > 0 ? 1 : 0;
  const allySq = toSquare({ file: ally.file, rank: ally.rank });
  return {
    ...working,
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
    ...(kingStun > 0 ? stunKingAfterCapture(state, kingStun) : {}),
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
 * Aegis intercept: if a shield is raised, it absorbs the capture and BREAKS
 * (every tier — the permanent T5 shield was nerfed 2026-09-09). T3 also
 * stuns the attacker; T5 kills it (never the king). Returns null if no
 * shield is up or Aegis isn't owned.
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

  // Nothing is ever captured by the shield (Tyler, 2026-09-09: "Aegis
  // shouldn't capture attacking pieces, just freeze them. It's too powerful
  // and confusing."). The attacker — the KING included — is FROZEN with the
  // same mechanic Freeze Ray uses, so it reads the same on the board. A
  // frozen king cannot flee or react (pawn-ai skips him), which is exactly
  // what the Freeze Ray already does to him; the king invariant only cares
  // that he stays on the board, and he does.
  //
  // Mid-enemy-turn freezes carry +1: the counter ticks at the END of this
  // very turn (the attacker already spent its action bouncing off the
  // shield), so N+1 here means the piece misses its next N enemy turns —
  // same convention as a sprung snare.
  const sq = toSquare({ file: attacker.file, rank: attacker.rank });
  const turns = aegisFreezeTurns(owned.tier) + 1;
  const frozenSquares = state.frozenSquares.includes(sq)
    ? state.frozenSquares
    : [...state.frozenSquares, sq];
  const frozenTurnsLeft = {
    ...state.frozenTurnsLeft,
    [sq]: Math.max(state.frozenTurnsLeft[sq] ?? 0, turns),
  };

  // T1-T4: one hit and the shield is gone. T5: the shield is on its 3-turn
  // clock and does NOT break — every attacker that hits it is frozen.
  const holds = owned.tier === 5;
  return {
    ...state,
    frozenSquares,
    frozenTurnsLeft,
    shieldUp: holds,
    shieldTurnsLeft: holds ? state.shieldTurnsLeft : 0,
  };
}

/** Enemy turns an attacker that hits the Aegis shield is frozen for. */
export function aegisFreezeTurns(tier: AbilityTier): number {
  return tier >= 3 ? 2 : 1;
}

/**
 * EVERY ability refills at the top of every level (Tyler, 2026-09-03:
 * "I want all abilities to be fresh at the top of every level, we'll just
 * have to make the levels harder… no one likes not being able to use
 * abilities"). This REVERSES the 2026-09-01 one-charge-per-run rule for
 * finishers: players read a spent Freeze Ray on level 9 as a bug, not a
 * budget. Difficulty now has to come from the boards (tighter move limits,
 * double-locked keys — see revenge-11 Dead Bolt), never from withholding
 * powers.
 *
 * The set is kept (empty) so the mechanism can be switched back per-ability
 * in one line if a finisher ever proves unfixable by level design.
 */
export const ONE_CHARGE_PER_RUN: ReadonlySet<AbilityId> = new Set<AbilityId>([]);

export function isOneChargePerRun(id: AbilityId): boolean {
  return ONE_CHARGE_PER_RUN.has(id);
}

/**
 * Reset per-level uses at level transitions. Everything refills (the
 * ONE_CHARGE_PER_RUN set is empty as of 2026-09-03; anything listed there
 * would keep its remaining charge instead).
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
function stepDroneTurnImpl(state: BoardState): BoardState {
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
  if (state.scarecrow?.square === toSquare({ file, rank })) return true; // the straw is a body
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
 * Captures take precedence; pawns promote to queen on rank 8. Only the
 * AI-driven allies (Squad, Bodyguard) act here — every controlled summon,
 * converted pieces included, is skipped.
 */
function stepAllyTurnImpl(state: BoardState): BoardState {
  if (state.turn !== 'allies' || state.status !== 'playing') return state;
  // No allies, or every ally has moved — hand off to enemy.
  if (state.allyTurnIndex >= state.allies.length) {
    return { ...state, turn: 'enemy', allyTurnIndex: 0 };
  }
  const idx = state.allyTurnIndex;
  const ally = state.allies[idx];
  // Ally either can't move or no longer exists — skip it. Controlled summons
  // (Squire family + converted pieces) are player-moved (see
  // applyControlledAllyMove) and never move on their own.
  if (!ally || isControlledAlly(ally)) {
    return { ...state, allyTurnIndex: idx + 1 };
  }
  // `dazed` means the same thing for an ally that steers itself as for one you
  // steer: it does not act this turn. Without this the rule would apply to
  // every summon you STEER and silently skip the ones that steer themselves
  // (summon-knight, squad) — that gap is why the first sickness measurement
  // read summon-knight at exactly 0.0. Cleared when the enemy turn ends.
  if (ally.dazed) {
    return { ...state, allyTurnIndex: idx + 1 };
  }
  let moves = allyMoves(state, ally);
  // Bodyguard holds Rookie's side: it only moves to CAPTURE (then it's a
  // capture-stun like any ally). No wandering off toward rank 8.
  if (ally.source === 'bodyguard') moves = moves.filter((m) => !!m.capture);
  if (moves.length === 0) {
    return { ...state, allyTurnIndex: idx + 1 };
  }
  let pick = moves[0];
  let bestScore = allyScoreMove(state, ally, pick);
  for (const m of moves.slice(1)) {
    const s = allyScoreMove(state, ally, m);
    if (s > bestScore) {
      bestScore = s;
      pick = m;
    }
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

// ---------------------------------------------------------------------------
// King invariant — every exported state transition is checked on the way
// out. See lib/run/king-invariant.ts. The *Impl functions above are the
// real bodies; these are the only names the rest of the app sees.
// ---------------------------------------------------------------------------
export function applyAbilityActivate(state: BoardState, abilityId: AbilityId): BoardState {
  return enforceKingInvariant(state, applyAbilityActivateImpl(state, abilityId), `applyAbilityActivate(${abilityId})`);
}
export function applyAbilityMove(state: BoardState, abilityId: AbilityId, target: Coord): BoardState {
  return enforceKingInvariant(state, applyAbilityMoveImpl(state, abilityId, target), `applyAbilityMove(${abilityId})`);
}
export function applyAbilityTargeted(state: BoardState, abilityId: AbilityId, target: Coord): BoardState {
  return enforceKingInvariant(state, applyAbilityTargetedImpl(state, abilityId, target), `applyAbilityTargeted(${abilityId})`);
}
export function applySquireMove(state: BoardState, target: Coord): BoardState {
  return enforceKingInvariant(state, applySquireMoveImpl(state, target), 'applySquireMove');
}
export function applyControlledAllyMove(state: BoardState, from: Coord, target: Coord): BoardState {
  return enforceKingInvariant(state, applyControlledAllyMoveImpl(state, from, target), 'applyControlledAllyMove');
}
export function stepDroneTurn(state: BoardState): BoardState {
  return enforceKingInvariant(state, stepDroneTurnImpl(state), 'stepDroneTurn');
}
export function stepAllyTurn(state: BoardState): BoardState {
  return enforceKingInvariant(state, stepAllyTurnImpl(state), 'stepAllyTurn');
}
