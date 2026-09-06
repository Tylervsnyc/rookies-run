/**
 * Core types for Rookies Run.
 *
 * Sprint 2: 10-level run, Rookie can temporarily transform into Knight or Bishop
 * via the Tempo system (capture pieces → spend tempo to transform).
 *
 * Coordinate system: standard chess.
 *   file: 1-8 (a=1 through h=8)
 *   rank: 1-8 (white's first row = 1, white's promotion row = 8)
 *
 * Rookie starts on rank 1 and wins by reaching rank 8.
 */

import type { AbilityId, AbilityOffer, OwnedAbility } from './abilities';
import type { DifficultyId } from './difficulty';

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'queen' | 'king';

/**
 * Win condition for a level (Rookie's Revenge prototype).
 *   'rank8' (default) — Rookie wins by reaching rank 8.
 *   'king'            — Rookie wins by capturing the enemy king; rank 8 is
 *                       just another row.
 */
export type WinCondition = 'rank8' | 'king';
/** How an enemy king behaves. 'still' never moves; 'flee' sidesteps threats. */
export type KingBehavior = 'still' | 'flee';
export type PieceColor = 'black';

/** Rookie's current movement form. She starts and reverts to 'rook'. */
export type RookieForm = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn';

export interface Coord {
  file: number; // 1-8
  rank: number; // 1-8
}

/**
 * A hazard square. Hazards are TWO fictions sharing one array (2026-09-06):
 *
 *   'stone' — the walls, pillars, sills, plugs and pens that SHAPE a room,
 *             and the block Boulder drops / Shove pushes. Drawn as raised
 *             grey rock (see lib/run/lava-style.ts stoneSquareStyle).
 *   'lava'  — deadly molten terrain that reads as a moat, a river, a field
 *             of heat. Drawn as the painted Mario lava lake. It is TERRAIN,
 *             not a block: Shove refuses it.
 *
 * DEFAULT WHEN ABSENT = 'stone'. Chosen deliberately: almost every authored
 * hazard in the catalogue is a wall/pillar/pen (read the run headers), and a
 * Boulder drop must never make a pool of lava appear. The genuinely molten
 * runs mark their hazards `kind: 'lava'` at the run's helper level (the
 * MOAT() band in revenge-12, BRIDGE_HAZARDS in the-bridge).
 *
 * `fixed: true` marks an AUTHORED wall stone that Shove may never push — a
 * run's way of refusing the card square by square. Default (absent) = loose:
 * every stone, authored or dropped by Boulder, can be shoved.
 */
export interface Hazard extends Coord {
  kind?: 'lava' | 'stone';
  fixed?: boolean;
}

/**
 * Snare (2026-09-06) — an armed trap on an empty square. Invisible to the
 * enemy AI; springs when an ENEMY arrives on it (see springSnaresAt in
 * abilities.ts). Consumed on springing unless the tier re-arms it.
 */
export interface Snare {
  square: string;
}

/**
 * Scarecrow (2026-09-06) — a straw Rookie. For `turnsLeft` enemy phases the
 * enemy AI plans against a view where this square IS Rookie (rook-form, or
 * queen-form from T4) and the real Rookie is an uncapturable blocker.
 */
export interface Scarecrow {
  square: string;
  turnsLeft: number;
  form: 'rook' | 'queen';
}

export interface EnemyPiece {
  type: PieceType;
  color: PieceColor;
  file: number;
  rank: number;
  /**
   * Stable identity across turns — assigned lazily by the Rewind snapshot
   * machinery (see pushEnemyPhaseSnapshot) and preserved by every spread-move.
   * Lets Rewind T4+ match a piece to where IT stood two enemy turns ago.
   */
  id?: number;
}

/**
 * Rainbow ally piece — spawned by Squad / Bodyguard (AI-driven) or by the
 * controllable-summon family, which includes any enemy stolen by Convert.
 * `source` says which ability made it; CONTROLLED_SOURCES in abilities.ts
 * decides whether the player steers it.
 */
/** Ally piece kinds — allies can also be rooks (Bodyguard); enemies never are. */
export type AllyPieceType = PieceType | 'rook';

export interface AllyPiece {
  id: number;
  type: AllyPieceType;
  file: number;
  rank: number;
  source:
    | 'squad'
    | 'bodyguard'
    // Convert (2026-09-06): a stolen enemy piece, keeps its type. CONTROLLED —
    // tap-to-move like the Squire family below; never moves on its own.
    | 'convert'
    | 'squire'
    // Controllable-summon family (2026-09-01) — pieces the PLAYER steers on
    // her own turns, like the Squire. See CONTROLLED_SOURCES in abilities.ts.
    | 'bishop-squire'
    | 'page'
    | 'twin'
    | 'duchess'
    | 'dragon'
    | 'vanguard';
  /**
   * Bodyguard: enemy turns this ally stays on the board. Decremented at the
   * end of each enemy turn; the ally dissolves when it hits 0. Absent =
   * permanent (Squad / Convert / the Page).
   */
  turnsLeft?: number;
  /**
   * Controlled summons with a FREE move (Squire/Twin/Bishop Squire at T5):
   * set when this ally moves without ending the turn; cleared when control
   * returns to Rookie after the enemy turn.
   */
  movedThisTurn?: boolean;
  /**
   * Convert (Tyler, 2026-09-06: "some levels too easy where you can just
   * capture the king on the first move"): a stolen piece is DAZED for the
   * rest of the turn it is converted — it cannot move or capture until the
   * player's NEXT turn. It is still a controlled body at once (its cover
   * squares still cut off the king's flight on the enemy turn, Sacrifice /
   * Swap may target it). Cleared when the enemy turn ends.
   */
  dazed?: boolean;
}

export type Turn = 'rookie' | 'allies' | 'drones' | 'enemy';

/**
 * Active drone — a mini-Rookie wandering the board, spawned by the Drones
 * ability. Each tick it moves one square in a random 8-way direction, and
 * vanishes (alive=false) on contact with an enemy (= capture) or after
 * `DRONE_MAX_STEPS` random walks with no capture.
 */
export interface Drone {
  id: number;
  file: number;
  rank: number;
  alive: boolean;
  steps: number;
}
export type GameStatus = 'playing' | 'won' | 'lost';

export interface BoardState {
  rookie: Coord;
  pieces: EnemyPiece[];
  /** Rainbow ally pieces. AI-driven ones (Squad / Bodyguard) play after Rookie's move; controlled ones (summons, converted pieces) move on her tap. */
  allies: AllyPiece[];
  /**
   * Active drones (mini-Rookies). Populated when Drones ability fires; cleared
   * when the drone phase ends. Empty outside the drone phase.
   */
  drones: Drone[];
  // (allies is required, but legacy fixture states in /test pages may omit it;
  // see harden notes — we keep it required for runtime invariants.)
  hazards: Hazard[]; // no-go squares for Rookie (introduced level 8+)
  turn: Turn;
  status: GameStatus;
  moveCount: number; // counts Rookie's moves only
  captures: PieceType[]; // chronological list of piece types Rookie has captured
  tempo: number; // current tempo (0..tempoMaxFor(state): 8, or 12 on king levels)
  form: RookieForm; // Rookie's current movement form
  formMovesLeft: number; // remaining Rookie moves until auto-revert (0 when rook)
  moveLimit: number | null; // null = no limit; otherwise hard cap on Rookie moves
  enemiesPerTurn: number; // how many enemies act per enemy turn (default 1)
  /** Squares (algebraic) of pieces that have already moved this enemy turn. */
  enemyMovedSquares: string[];
  /**
   * Squares (algebraic) that an enemy *vacated* during the current enemy
   * turn — i.e. their position at the start of the turn. Treated as ghost
   * blockers for subsequent movers so the player can plan threats from the
   * board they actually saw. Cleared when control returns to Rookie.
   */
  enemyVacatedSquares: string[];
  /**
   * Squares (algebraic) of enemies that are frozen and must skip their
   * action. A freeze lasts TWO enemy turns — see `frozenTurnsLeft` for the
   * remaining turn count per square. Squares stay listed here for the full
   * lifetime of the freeze so the icy visual persists.
   */
  frozenSquares: string[];
  /**
   * Remaining enemy turns each frozen square will stay frozen. Decremented
   * at the end of each enemy turn; when it hits 0 the entry is removed from
   * both maps.
   */
  frozenTurnsLeft: Record<string, number>;
  /**
   * Decoy target — the algebraic square of an enemy piece that has been
   * marked as a decoy. While set, enemy AI treats this piece like Rookie:
   * teammates will capture it if they can, otherwise approach. Cleared when
   * the piece is captured (or moves) or when `decoyTurnsLeft` hits 0.
   */
  decoyTarget: string | null;
  /** Remaining enemy turns the decoy mark stays active. */
  decoyTurnsLeft: number;
  /**
   * Poisoned-piece squares (algebraic). On each enemy turn, every poisoned
   * square ticks down; when its counter hits 0 the piece dies (counted as a
   * capture for tempo / share). Moving a poisoned piece carries the poison
   * to its new square.
   */
  poisonedSquares: string[];
  /** Remaining enemy turns until each poisoned square's piece dies. */
  poisonedTurnsLeft: Record<string, number>;
  /**
   * Rabid-piece squares (algebraic). A rabid piece, on its turn, tries to
   * capture the nearest living thing (Rookie or any enemy). On Chebyshev
   * ties, picks the biggest piece. If nothing is reachable to capture this
   * turn, it approaches the nearest target instead. Rabies ticks down each
   * enemy turn; on 0 the piece reverts to normal AI.
   */
  rabidSquares: string[];
  /** Remaining enemy turns each rabid square stays rabid. */
  rabidTurnsLeft: Record<string, number>;
  /**
   * Index of the next ally to act when `turn === 'allies'`. Each tick of
   * `stepAllyTurn` moves `state.allies[allyTurnIndex]`, increments, and when
   * it reaches `state.allies.length` the phase ends (turn → 'enemy', index
   * resets to 0). Outside ally phase this is 0.
   */
  allyTurnIndex: number;
  /** Permanent abilities Rookie has accrued this run. */
  abilities: OwnedAbility[];
  /** When the tempo meter fills, the player is offered 3 ability choices. */
  pendingOffer: AbilityOffer | null;
  /** Currently-targeting ability — drives ability resolution UI. */
  activeAbility: {
    id: AbilityId;
    step: 'pick-square' | 'pick-enemy';
    /**
     * Magnet only — the enemy grabbed on the first tap. While set (step
     * 'pick-square') the second tap picks the landing square along the pull
     * line: the player chooses the pull DISTANCE.
     */
    magnetFrom?: Coord;
  } | null;
  /** Current level number (1-based) — drives pawn promotion options. */
  level: number;
  /** Which run this state belongs to — used to filter ability offers. */
  runId?: string;
  /**
   * Meta-progression: abilities this PLAYER has unlocked (from the profile).
   * Offers only draw from this set. undefined = everything (playtest bots).
   */
  unlockedAbilities?: AbilityId[];
  /**
   * Playtest kit (?testkit= — /playtest real-run mode): when set, ability
   * offers draw from EXACTLY these ids — new picks at T1, then upgrades —
   * overriding both the run allowlist and unlockedAbilities. Never set for
   * normal players.
   */
  testkit?: AbilityId[];
  /** Difficulty mode this state was built under (see lib/run/difficulty.ts). */
  difficulty?: DifficultyId;
  /**
   * Extra Rookie moves queued by Surge. While > 0, the turn stays with Rookie
   * after a move or ability instead of handing off to the enemy. Decremented
   * once per move/ability consumed. Resets to 0 at the start of each level.
   */
  bonusMovesLeft: number;
  /**
   * True while Rookie has an Aegis shield raised. Set by tapping the Aegis
   * ability card (which also decrements a charge). Consumed when an enemy
   * tries to capture her (T1-T4) — T5 keeps the shield up permanently.
   * Resets between levels.
   */
  shieldUp: boolean;
  /**
   * Transient signal: set on the state returned from an enemy step when Aegis
   * intercepts a capture. UI watches `id` for changes to fire the lunge-and-
   * bounce VFX. Not cleared by the engine — the UI tracks the last-seen id.
   */
  lastAegisIntercept?: { attackerSquare: string; rookieSquare: string; id: number };
  /**
   * Transient signal: set when an enemy attempts to capture Rookie while she
   * is in king form (Become King impervious). Distinct from Aegis so the UI
   * fires gold-themed VFX instead of the blue shield. UI tracks last-seen id.
   */
  lastImperviousBounce?: { attackerSquare: string; rookieSquare: string; id: number };
  /**
   * Transient signal: set when a Rookie ability resolves so the UI can fire
   * the matching cast VFX (charge streak / phase ghost / leap arc / freeze
   * dart / poison dart / rabies dart). UI tracks the last-seen id.
   */
  lastAbilityFx?: {
    kind:
      | 'freeze-ray'
      | 'poison-dart'
      | 'rabies-dart'
      | 'convert'
      | 'drones'
      | 'boulder'
      | 'smoke'
      | 'rewind'
      | 'magnet'
      | 'bodyguard'
      | 'summon-knight'
      // The five of 2026-09-06 (docs/new-abilities-2026-09-06.md).
      | 'snare'
      | 'shove'
      | 'coup'
      | 'hourglass'
      | 'scarecrow';
    from: string;
    to: string;
    id: number;
  };
  /**
   * Transient signal: set on the state returned from an enemy turn when one
   * or more poisoned pieces' counters tick to 0 and they die. UI watches `id`
   * for changes to fire the green-bubble drowning VFX on each death square.
   * Not cleared by the engine — the UI tracks the last-seen id.
   */
  lastPoisonDeath?: {
    deaths: { square: string; pieceType: PieceType }[];
    id: number;
  };
  /**
   * Transient signal: set when a Snare springs under an enemy (held, or
   * bitten = captured at T4+). UI watches `id` to flash the trap square.
   */
  lastSnareSpring?: { square: string; pieceType: PieceType; bit: boolean; id: number };
  /**
   * Transient signal: set when an enemy strikes the straw Rookie (Scarecrow).
   * UI watches `id` to burst the straw; `attackerDied` = the T5 punishment.
   */
  lastScarecrowStrike?: { square: string; attackerSquare: string; attackerDied: boolean; id: number };
  /**
   * Transient signal: set when an enemy piece captures another enemy piece
   * (rabid friendly-fire or decoy-mark lure). The UI uses it to slide the
   * attacker sprite from fromSq -> toSq, since the chessboard's built-in diff
   * treats this as a piece-type swap and snaps.
   */
  lastEnemyCaptureFx?: {
    fromSq: string;
    toSq: string;
    pieceType: PieceType;
    /** The piece that got eaten — drawn on toSq until the attacker lands. */
    victimType: PieceType | null;
    id: number;
  };
  /**
   * Instant-ability undo handle. When a transform or Surge resolves we stash
   * the relevant pre-cast values here. Re-tapping the same card BEFORE the
   * next Rookie move restores them (refunding the use). Cleared on any
   * Rookie move (regular or ability) or when a different ability fires.
   */
  /**
   * Per-attempt RNG seed used by the enemy AI to randomize tiebreaks (e.g.
   * which pawn advances when several are tied for "lowest rank", or which
   * piece approaches when multiple are equidistant from Rookie). Fixed for
   * the lifetime of a single level attempt — replays of the same state from
   * the same seed produce the same moves — but a fresh seed is generated on
   * every retry / level transition so the same strategy can't be memorized.
   */
  aiRngSeed: number;
  /** Level win condition — absent/'rank8' = live behavior. */
  winCondition?: WinCondition;
  /** Enemy king behavior when winCondition === 'king' (default 'still'). */
  kingBehavior?: KingBehavior;
  /**
   * Rookie's Revenge — enemy turns the king is STUNNED for (cannot flee).
   * Set to 1 whenever a capture is credited to Rookie (her own move, a drone,
   * an ally, friendly fire on a decoy, a poison death). Decremented at the
   * end of each enemy turn. Absent/0 = not stunned.
   */
  kingStunTurns?: number;
  /**
   * Rookie's Revenge — squares (algebraic) the enemy king may stand on. A
   * fleeing king never steps outside his pen. Absent = whole board.
   */
  kingPen?: string[];
  /**
   * Why the current `pendingOffer` exists. 'tempo' (default) = the meter
   * filled; 'level' = the run grants a free pick at level start (Rookie's
   * Revenge). Level offers never touch tempo and can't be skipped.
   */
  offerReason?: 'tempo' | 'level';
  /**
   * Smoke — enemy turns Rookie stays invisible. While > 0 enemies neither
   * capture nor hunt her (they hold posts / take other targets) and the
   * fleeing king ignores her threats. Ticks down at the end of each enemy
   * turn. Absent/0 = visible.
   */
  smokeTurnsLeft?: number;
  /**
   * Rewind (enemy-only, 2026-09-02) — up to two board snapshots taken at the
   * START of an enemy phase, i.e. right after Rookie's side finished acting
   * (each stored WITHOUT its own stack):
   *   [last]     = the board just before the enemy turn that JUST resolved —
   *                restoring it deletes ONLY the enemies' reply; Rookie's
   *                move, captures and tempo are already in it.
   *   [last - 1] = the board just before the enemy turn BEFORE that (the
   *                Rewind T4+ two-turn reach).
   * Written by stepEnemyTurn when a fresh enemy phase begins; consumed by
   * the Rewind ability. Cleared by a cast (no chaining).
   */
  enemyRewindStack?: BoardState[];
  /**
   * Boulder T4 — after the first drop of a use, one more FREE placement is
   * owed (the use drops two boulders). Set by the boulder branch of
   * applyAbilityTargeted; cleared by the second drop or by cancelling.
   */
  boulderDropsLeft?: number;
  /**
   * Squire (summon-knight) at T5 — the knight's move is a FREE action, once
   * per Rookie turn. Set when the Squire moves without ending the turn;
   * cleared when control comes back to Rookie after the enemy turn.
   */
  squireMovedThisTurn?: boolean;
  /**
   * Snare — armed traps. Part of the Rewind snapshot (restored unsprung).
   * Absent/empty = none. Never persists across levels.
   */
  snares?: Snare[];
  /**
   * Scarecrow — the one straw Rookie standing right now (absent = none).
   * Ticks down at the end of each enemy turn; removed when captured.
   */
  scarecrow?: Scarecrow;
  /**
   * Hourglass — set while the enemy phase it triggered is resolving (a
   * "glass-turn"). endTurn reads it (no daze wake-up, optionally no summon
   * clocks, the king held at T3+) and clears it. Absent = a normal phase.
   */
  glassTurn?: { holdKing: boolean; freezeSummonClocks: boolean };
  /**
   * Hourglass — true once the glass has been turned during the current
   * Rookie turn (one cast per turn below T5). Cleared by the end of the
   * enemy phase that follows a REAL Rookie action.
   */
  hourglassUsedThisTurn?: boolean;
  cancellableActivation?: {
    abilityId: AbilityId;
    snapshot: {
      form: RookieForm;
      formMovesLeft: number;
      bonusMovesLeft: number;
      abilities: OwnedAbility[];
      shieldUp: boolean;
    };
  };
}

export interface RunPuzzle {
  level: number; // 1..10
  rookieStart: Coord;
  pieces: EnemyPiece[];
  hazards?: Hazard[];
  moveLimit?: number;
  /** Pieces Rookie is allowed to transform into on this level. */
  allowedForms?: RookieForm[];
  /** Enemies that act each enemy turn (default 1). */
  enemiesPerTurn?: number;
  /** Win condition (default 'rank8'). 'king' = capture the enemy king. */
  winCondition?: WinCondition;
  /** Enemy king behavior for winCondition 'king' (default 'still'). */
  kingBehavior?: KingBehavior;
  /** Squares the enemy king may occupy (fleeing never leaves the pen). */
  kingPen?: string[];
}

/** Convert (file, rank) to algebraic square string e.g. 'e1'. */
export function toSquare({ file, rank }: Coord): string {
  return `${String.fromCharCode('a'.charCodeAt(0) + file - 1)}${rank}`;
}

/** Convert algebraic square string e.g. 'e1' to (file, rank). */
export function fromSquare(sq: string): Coord {
  return {
    file: sq.charCodeAt(0) - 'a'.charCodeAt(0) + 1,
    rank: parseInt(sq[1], 10),
  };
}

export function coordEq(a: Coord, b: Coord): boolean {
  return a.file === b.file && a.rank === b.rank;
}
