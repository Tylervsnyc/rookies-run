/**
 * Rookie's Revenge — achievements.
 *
 * ONE catalog, ONE evaluator. The page reduces board-state changes into
 * `RunEvent`s and calls `applyRunEvent(profile, ev)`; that bumps lifetime
 * counters, evaluates every un-earned achievement, and returns the newly
 * earned ones (with any ability they unlock). Achievements are the ONLY way
 * abilities unlock — see `unlocks`.
 *
 * Copy is Rookie's voice: short, warm, over-invested. No emojis.
 */

import type { PieceType, RookieForm } from './types';
import type { DifficultyId } from './difficulty';

// ---------------------------------------------------------------------------
// Events the page emits
// ---------------------------------------------------------------------------

export type CaptureVia =
  | 'move' // Rookie's own move
  | 'drones'
  | 'ally' // rainbow ally capture (Convert / Squad)
  | 'enemy-phase'; // poison death, decoy friendly fire, Aegis T5 kill

export type RunEvent =
  | { type: 'session-start'; hour: number; difficulty: DifficultyId }
  | {
      type: 'capture';
      piece: PieceType;
      via: CaptureVia;
      form: RookieForm;
      /** Rookie had Surge bonus moves queued when this landed. */
      duringSurge: boolean;
      /** Number of captures that landed in this same tick (drone salvo). */
      salvo: number;
      /** Frozen king at the moment of a king capture. */
      kingWasFrozen: boolean;
      /** Rookie was smoked / invisible (future ability). */
      level: number;
    }
  | {
      type: 'level-cleared';
      level: number;
      moves: number;
      moveLimit: number | null;
      captures: number;
      abilitiesOwned: number;
      allTierFive: boolean;
      difficulty: DifficultyId;
      isKingLevel: boolean;
    }
  | {
      type: 'level-lost';
      level: number;
      onStartSquare: boolean;
      movesLeft: number | null;
      /** Chebyshev distance Rookie → enemy king at death (null on rank-8 levels). */
      kingDistance: number | null;
      /** How many times THIS level has been lost in the current run (incl. this one). */
      lossesThisLevel: number;
      difficulty: DifficultyId;
    }
  | {
      type: 'run-completed';
      levelsLost: number;
      abilitiesOwned: number;
      difficulty: DifficultyId;
      /** Distinct abilities used this run. */
      abilitiesUsed: number;
      /** Current daily streak (from history) after this completion. */
      streak: number;
    }
  | { type: 'ability-used'; id: string; tier: number; targetIsKing: boolean }
  | { type: 'convert'; piece: PieceType }
  | { type: 'offer-picked'; id: string; tier: number }
  | { type: 'offer-skipped' };

// ---------------------------------------------------------------------------
// Counters — lifetime tallies stored in the profile
// ---------------------------------------------------------------------------

export type Counters = Record<string, number>;

const inc = (c: Counters, k: string, n = 1): void => {
  c[k] = (c[k] ?? 0) + n;
};
const max = (c: Counters, k: string, n: number): void => {
  c[k] = Math.max(c[k] ?? 0, n);
};
export const cnt = (c: Counters, k: string): number => c[k] ?? 0;

/** Bump counters for one event. Pure on `c` (mutates the copy you pass). */
export function bumpCounters(c: Counters, ev: RunEvent): void {
  switch (ev.type) {
    case 'session-start':
      inc(c, 'sessions');
      if (ev.hour >= 0 && ev.hour < 5) inc(c, 'sessions.night');
      break;
    case 'capture':
      inc(c, 'cap.total');
      inc(c, `cap.${ev.piece}`);
      inc(c, `cap.via.${ev.via}`);
      if (ev.piece === 'king') {
        inc(c, `cap.king.as.${ev.form}`);
        if (ev.duringSurge) inc(c, 'cap.king.surge');
        if (ev.kingWasFrozen) inc(c, 'cap.king.frozen');
        if (ev.via === 'enemy-phase') inc(c, 'cap.king.enemyPhase');
      }
      if (ev.via === 'drones') max(c, 'best.droneSalvo', ev.salvo);
      break;
    case 'level-cleared':
      inc(c, 'levels.cleared');
      if (ev.captures === 0) inc(c, 'levels.cleared.pacifist');
      if (ev.captures === 1 && ev.isKingLevel) inc(c, 'levels.cleared.kingOnly');
      if (ev.moves <= 3) inc(c, 'levels.cleared.fast');
      if (ev.moveLimit !== null && ev.moves === ev.moveLimit) inc(c, 'levels.cleared.lastMove');
      if (ev.allTierFive && ev.abilitiesOwned >= 3) inc(c, 'levels.cleared.maxed');
      break;
    case 'level-lost':
      inc(c, 'levels.lost');
      if (ev.level === 1) inc(c, 'levels.lost.l1');
      if (ev.onStartSquare) inc(c, 'levels.lost.startSquare');
      if (ev.kingDistance !== null && ev.kingDistance <= 1 && ev.movesLeft === 0) {
        inc(c, 'levels.lost.soClose');
      }
      max(c, 'best.sameLevelLosses', ev.lossesThisLevel);
      break;
    case 'run-completed':
      inc(c, 'runs.completed');
      inc(c, `runs.completed.${ev.difficulty}`);
      if (ev.levelsLost === 0) inc(c, 'runs.flawless');
      if (ev.abilitiesOwned <= 1) inc(c, 'runs.oneAbility');
      if (ev.abilitiesUsed === 0) inc(c, 'runs.noAbilityUsed');
      if (ev.levelsLost >= 3) inc(c, 'runs.comeback');
      max(c, 'best.streak', ev.streak);
      break;
    case 'ability-used':
      inc(c, 'ability.used');
      inc(c, `ability.used.${ev.id}`);
      if (ev.targetIsKing) inc(c, `ability.onKing.${ev.id}`);
      break;
    case 'convert':
      inc(c, 'convert.total');
      inc(c, `convert.${ev.piece}`);
      break;
    case 'offer-picked':
      inc(c, 'offers.picked');
      if (ev.tier === 5) inc(c, 'offers.tier5');
      break;
    case 'offer-skipped':
      inc(c, 'offers.skipped');
      break;
  }
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export type AchievementGroup =
  | 'firsts'
  | 'volume'
  | 'style'
  | 'abilities'
  | 'fails'
  | 'habit'
  | 'difficulty';

export interface AchievementDef {
  id: string;
  name: string;
  /** Rookie's line when it pops. */
  blurb: string;
  /** What to do — shown on locked cards. Secret ones hide this. */
  hint: string;
  group: AchievementGroup;
  /** Ability id this achievement unlocks (validated against the live pool). */
  unlocks?: string;
  secret?: boolean;
  /** Progress readout for the Trophy Room: [current, target]. */
  progress?: (c: Counters) => [number, number];
  test: (c: Counters, ev: RunEvent) => boolean;
}

const count = (key: string, target: number): Pick<AchievementDef, 'progress' | 'test'> => ({
  progress: (c) => [Math.min(cnt(c, key), target), target],
  test: (c) => cnt(c, key) >= target,
});

export const ACHIEVEMENTS: ReadonlyArray<AchievementDef> = [
  // ---- Firsts -----------------------------------------------------------
  {
    id: 'first-blood',
    name: 'First Blood',
    blurb: "That's one. They'll remember me.",
    hint: 'Capture your first piece.',
    group: 'firsts',
    ...count('cap.total', 1),
  },
  {
    id: 'regicide',
    name: 'Regicide',
    blurb: 'The game was over. Nobody told me.',
    hint: 'Capture your first king.',
    group: 'firsts',
    unlocks: 'magnet',
    ...count('cap.king', 1),
  },
  {
    id: 'closing-time',
    name: 'Closing Time',
    blurb: 'Ten kings. One rook. I did the math too.',
    hint: 'Finish a full run.',
    group: 'firsts',
    unlocks: 'bishop-step',
    ...count('runs.completed', 1),
  },
  {
    id: 'armed',
    name: 'Armed',
    blurb: 'A rook with a plan. Terrifying, honestly.',
    hint: 'Pick your first ability.',
    group: 'firsts',
    ...count('offers.picked', 1),
  },
  {
    id: 'maxed-out',
    name: 'Fully Loaded',
    blurb: 'Tier five. This is the version of me they warned you about.',
    hint: 'Take any ability to tier 5.',
    group: 'firsts',
    ...count('offers.tier5', 1),
  },

  // ---- Volume -------------------------------------------------------------
  {
    id: 'pawn-broker',
    name: 'Pawn Broker',
    blurb: 'Twenty-five pawns. They keep sending them.',
    hint: 'Capture 25 pawns.',
    group: 'volume',
    unlocks: 'poison-dart',
    ...count('cap.pawn', 25),
  },
  {
    id: 'pawnocalypse',
    name: 'Pawnocalypse',
    blurb: 'Two hundred and fifty. I stopped counting. You did not.',
    hint: 'Capture 250 pawns.',
    group: 'volume',
    ...count('cap.pawn', 250),
  },
  {
    id: 'horse-whisperer',
    name: 'Horse Whisperer',
    blurb: 'Knights jump. Not over me.',
    hint: 'Capture 10 knights.',
    group: 'volume',
    unlocks: 'decoy',
    ...count('cap.knight', 10),
  },
  {
    id: 'excommunicated',
    name: 'Excommunicated',
    blurb: 'Bishops only see one color. I am not on it.',
    hint: 'Capture 10 bishops.',
    group: 'volume',
    unlocks: 'bodyguard',
    ...count('cap.bishop', 10),
  },
  {
    id: 'queen-slayer',
    name: 'Queen Slayer',
    blurb: 'Five queens. She had it coming. All five times.',
    hint: 'Capture 5 queens.',
    group: 'volume',
    unlocks: 'rabies-dart',
    ...count('cap.queen', 5),
  },
  {
    id: 'serial-regicide',
    name: 'Serial Regicide',
    blurb: 'Ten kings. At some point it stops being revenge and starts being a hobby.',
    hint: 'Capture 10 kings.',
    group: 'volume',
    unlocks: 'squad',
    ...count('cap.king', 10),
  },
  {
    id: 'dynasty',
    name: 'End of a Dynasty',
    blurb: 'One hundred kings. There is no one left to crown.',
    hint: 'Capture 100 kings.',
    group: 'volume',
    ...count('cap.king', 100),
  },
  {
    id: 'century',
    name: 'Century',
    blurb: 'A hundred pieces. I remember every single one. That is not healthy.',
    hint: 'Capture 100 pieces.',
    group: 'volume',
    ...count('cap.total', 100),
  },
  {
    id: 'thousand',
    name: 'The Thousand',
    blurb: 'A thousand. Somebody should have stopped me around four hundred.',
    hint: 'Capture 1,000 pieces.',
    group: 'volume',
    ...count('cap.total', 1000),
  },
  {
    id: 'ten-runs',
    name: 'Regular',
    blurb: 'Ten runs. You keep coming back. I noticed. I always notice.',
    hint: 'Finish 10 runs.',
    group: 'volume',
    ...count('runs.completed', 10),
  },
  {
    id: 'fifty-runs',
    name: 'Fixture',
    blurb: 'Fifty runs. At this point you live here.',
    hint: 'Finish 50 runs.',
    group: 'volume',
    ...count('runs.completed', 50),
  },

  // ---- Style --------------------------------------------------------------
  {
    id: 'untouchable',
    name: 'Untouchable',
    blurb: 'Not one loss. They never laid a finger on me. Because of you.',
    hint: 'Finish a run without losing a single level.',
    group: 'style',
    unlocks: 'queen-pulse',
    ...count('runs.flawless', 1),
  },
  {
    id: 'speedrun',
    name: 'Speedrun',
    blurb: 'Three moves. He blinked and it was over.',
    hint: 'Clear a level in 3 moves or fewer.',
    group: 'style',
    ...count('levels.cleared.fast', 1),
  },
  {
    id: 'photo-finish',
    name: 'Photo Finish',
    blurb: 'Last move. Zero to spare. I was completely calm. Ask anyone.',
    hint: 'Win a level on your very last move.',
    group: 'style',
    unlocks: 'smoke',
    ...count('levels.cleared.lastMove', 1),
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    blurb: 'One ability. One rook. Enough.',
    hint: 'Finish a run holding one ability at most.',
    group: 'style',
    ...count('runs.oneAbility', 1),
  },
  {
    id: 'purist',
    name: 'Purist',
    blurb: 'No powers. Just a rook and a grudge.',
    hint: 'Finish a run without casting a single ability.',
    group: 'style',
    secret: true,
    ...count('runs.noAbilityUsed', 1),
  },
  {
    id: 'hoarder',
    name: 'Hoarder',
    blurb: 'Three abilities, all maxed. Overkill is a kind of love.',
    hint: 'Clear a level with three tier-5 abilities.',
    group: 'style',
    ...count('levels.cleared.maxed', 1),
  },
  {
    id: 'surgical',
    name: 'Surgical',
    blurb: 'Only the king. Nobody else had to be involved.',
    hint: 'Clear a king level capturing nothing but the king.',
    group: 'style',
    ...count('levels.cleared.kingOnly', 1),
  },
  {
    id: 'ten-fast',
    name: 'Blitz',
    blurb: 'Ten quick ones. I do not linger. I linger emotionally.',
    hint: 'Clear 10 levels in 3 moves or fewer.',
    group: 'style',
    ...count('levels.cleared.fast', 10),
  },
  {
    id: 'never-skip',
    name: 'Yes, And',
    blurb: 'You never say no to a card. I respect that. I would say the same.',
    hint: 'Pick 50 ability offers.',
    group: 'style',
    ...count('offers.picked', 50),
  },

  // ---- Abilities ----------------------------------------------------------
  {
    id: 'drone-strike',
    name: 'Drone Strike',
    blurb: 'Three in one salvo. My little ones make me proud.',
    hint: 'Drones capture 3 pieces in a single salvo.',
    group: 'abilities',
    unlocks: 'convert',
    progress: (c) => [Math.min(cnt(c, 'best.droneSalvo'), 3), 3],
    test: (c) => cnt(c, 'best.droneSalvo') >= 3,
  },
  {
    id: 'brainwash',
    name: 'Brainwash',
    blurb: 'A queen. On my side. She seems happier.',
    hint: 'Convert a queen.',
    group: 'abilities',
    ...count('convert.queen', 1),
  },
  {
    id: 'cold-shoulder',
    name: 'Cold Shoulder',
    blurb: 'Frozen three times. He can stand there and think about what he did.',
    hint: 'Freeze the king 3 times.',
    group: 'abilities',
    unlocks: 'aegis',
    ...count('ability.onKing.freeze-ray', 3),
  },
  {
    id: 'double-tap',
    name: 'Double Tap',
    blurb: 'Two moves. He never got his turn. Neither did I, once. Now we are even.',
    hint: 'Capture the king during a Surge.',
    group: 'abilities',
    ...count('cap.king.surge', 1),
  },
  {
    id: 'ice-cold',
    name: 'Ice Cold',
    blurb: 'Frozen solid when I got there. He saw it coming. Slowly.',
    hint: 'Capture a frozen king.',
    group: 'abilities',
    ...count('cap.king.frozen', 1),
  },
  {
    id: 'bishop-please',
    name: 'Bishop, Please',
    blurb: 'Diagonally. He was watching the files. Everyone watches the files.',
    hint: 'Capture the king while in bishop form.',
    group: 'abilities',
    ...count('cap.king.as.bishop', 1),
  },
  {
    id: 'horse-play',
    name: 'Horseplay',
    blurb: 'A rook does not jump. A rook did.',
    hint: 'Capture the king while in knight form.',
    group: 'abilities',
    ...count('cap.king.as.knight', 1),
  },
  {
    id: 'her-majesty',
    name: 'Her Majesty',
    blurb: 'Queen for a moment. Long enough.',
    hint: 'Capture the king while in queen form.',
    group: 'abilities',
    ...count('cap.king.as.queen', 1),
  },
  {
    id: 'long-con',
    name: 'The Long Con',
    blurb: 'I was not even near him. That is the point.',
    hint: 'A poison, decoy, or shield kill takes a piece during the enemy turn 10 times.',
    group: 'abilities',
    ...count('cap.via.enemy-phase', 10),
  },
  {
    id: 'swarm',
    name: 'Swarm',
    blurb: 'Fifty drone captures. They learned from the best. Me. I mean me.',
    hint: 'Drones capture 50 pieces.',
    group: 'abilities',
    ...count('cap.via.drones', 50),
  },
  {
    id: 'army-of-one',
    name: 'Army of One (Plus Some)',
    blurb: 'My allies took twenty. Rainbow suits everyone.',
    hint: 'Converted or spawned allies capture 20 pieces.',
    group: 'abilities',
    unlocks: 'boulder',
    ...count('cap.via.ally', 20),
  },
  {
    id: 'trigger-happy',
    name: 'Trigger Happy',
    blurb: 'A hundred casts. I have a process. The process is more.',
    hint: 'Use abilities 100 times.',
    group: 'abilities',
    ...count('ability.used', 100),
  },

  // ---- Fails --------------------------------------------------------------
  {
    id: 'rookie-mistake',
    name: 'Rookie Mistake',
    blurb: "Level one. We don't talk about that one.",
    hint: 'Lose level 1.',
    group: 'fails',
    ...count('levels.lost.l1', 1),
  },
  {
    id: 'cornered',
    name: 'Cornered',
    blurb: 'Captured on my own square. I had not even started. Rude.',
    hint: 'Get captured on your starting square.',
    group: 'fails',
    ...count('levels.lost.startSquare', 1),
  },
  {
    id: 'overthinker',
    name: 'Overthinker',
    blurb: 'One square away and out of moves. I could hear him breathing.',
    hint: 'Run out of moves next to the king.',
    group: 'fails',
    ...count('levels.lost.soClose', 1),
  },
  {
    id: 'deja-vu',
    name: 'Deja Vu',
    blurb: 'Same level, three times. It is fine. I have been here before. Literally.',
    hint: 'Lose the same level 3 times in one run.',
    group: 'fails',
    unlocks: 'rewind',
    progress: (c) => [Math.min(cnt(c, 'best.sameLevelLosses'), 3), 3],
    test: (c) => cnt(c, 'best.sameLevelLosses') >= 3,
  },
  {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    blurb: 'Down three levels and still finished. That is the whole story of me.',
    hint: 'Finish a run after losing 3 or more levels.',
    group: 'fails',
    ...count('runs.comeback', 1),
  },
  {
    id: 'frequent-flyer',
    name: 'Frequent Faller',
    blurb: 'Fifty losses. Every one taught me something. Mostly patience.',
    hint: 'Lose 50 levels.',
    group: 'fails',
    ...count('levels.lost', 50),
  },
  {
    id: 'skipper',
    name: 'Picky',
    blurb: 'You skipped a card. I saw. I am not upset. I am a little upset.',
    hint: 'Skip an ability offer.',
    group: 'fails',
    secret: true,
    ...count('offers.skipped', 1),
  },

  // ---- Habit --------------------------------------------------------------
  {
    id: 'streak-3',
    name: 'Three Days',
    blurb: 'Three days in a row. That is a pattern. I love a pattern.',
    hint: 'Play 3 days in a row.',
    group: 'habit',
    ...count('best.streak', 3),
  },
  {
    id: 'streak-7',
    name: 'Regular Hours',
    blurb: 'A week straight. I have started saving you a square.',
    hint: 'Play 7 days in a row.',
    group: 'habit',
    ...count('best.streak', 7),
  },
  {
    id: 'streak-30',
    name: 'Obsessed',
    blurb: 'Thirty days. It is not obsession if it is mutual.',
    hint: 'Play 30 days in a row.',
    group: 'habit',
    ...count('best.streak', 30),
  },
  {
    id: 'night-shift',
    name: 'Night Shift',
    blurb: 'It is very late. He is asleep. Perfect.',
    hint: 'Play between midnight and 5am.',
    group: 'habit',
    ...count('sessions.night', 1),
  },
  {
    id: 'hundred-sessions',
    name: 'Home Square',
    blurb: 'A hundred visits. Leave your coat.',
    hint: 'Open the game 100 times.',
    group: 'habit',
    ...count('sessions', 100),
  },

  // ---- Difficulty ---------------------------------------------------------
  {
    id: 'training-wheels',
    name: 'Training Wheels',
    blurb: 'Rookie mode. We all start somewhere. I started at a1.',
    hint: 'Finish a run on Rookie difficulty.',
    group: 'difficulty',
    ...count('runs.completed.rookie', 1),
  },
  {
    id: 'no-training-wheels',
    name: 'No Training Wheels',
    blurb: 'Normal. Which for a lone rook is not normal at all.',
    hint: 'Finish a run on Normal.',
    group: 'difficulty',
    ...count('runs.completed.normal', 1),
  },
  {
    id: 'sore-winner',
    name: 'Sore Winner',
    blurb: 'Hard mode. He ran. I ran faster. I do not run. I made an exception.',
    hint: 'Finish a run on Hard.',
    group: 'difficulty',
    unlocks: 'become-king',
    ...count('runs.completed.hard', 1),
  },
  {
    id: 'revenge-served',
    name: 'Revenge Served',
    blurb: 'Nightmare. One life. He knew I was coming and it did not matter.',
    hint: 'Finish a run on Nightmare.',
    group: 'difficulty',
    ...count('runs.completed.nightmare', 1),
  },
  {
    id: 'full-course',
    name: 'Full Course',
    blurb: 'Every difficulty. There is nothing left to prove. I will keep proving it.',
    hint: 'Finish a run on all four difficulties.',
    group: 'difficulty',
    progress: (c) => [
      ['rookie', 'normal', 'hard', 'nightmare'].filter((d) => cnt(c, `runs.completed.${d}`) > 0).length,
      4,
    ],
    test: (c) => ['rookie', 'normal', 'hard', 'nightmare'].every((d) => cnt(c, `runs.completed.${d}`) > 0),
  },
];

export const ACHIEVEMENT_BY_ID: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);

export const ACHIEVEMENT_GROUPS: ReadonlyArray<{ id: AchievementGroup; label: string }> = [
  { id: 'firsts', label: 'Firsts' },
  { id: 'volume', label: 'Body Count' },
  { id: 'style', label: 'Style' },
  { id: 'abilities', label: 'Powers' },
  { id: 'fails', label: 'Learning Experiences' },
  { id: 'habit', label: 'Habits' },
  { id: 'difficulty', label: 'Difficulty' },
];

/** Every ability id some achievement unlocks (may include ids not yet shipped). */
export function abilityUnlockedBy(abilityId: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.unlocks === abilityId);
}

/**
 * Evaluate all un-earned achievements against counters + this event.
 * Returns the newly earned defs (in catalog order).
 */
export function evaluateAchievements(
  counters: Counters,
  earned: ReadonlySet<string>,
  ev: RunEvent,
): AchievementDef[] {
  const out: AchievementDef[] = [];
  for (const a of ACHIEVEMENTS) {
    if (earned.has(a.id)) continue;
    try {
      if (a.test(counters, ev)) out.push(a);
    } catch {
      /* a broken test never crashes the game */
    }
  }
  return out;
}
