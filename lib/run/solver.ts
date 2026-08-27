/**
 * Unwinnable-position solver (Rookie's Revenge fail-safe).
 *
 * `isUnwinnable(state)` answers: with the moves she has left, can Rookie
 * still capture the enemy king against a PERFECT fleeing king? It is a
 * memoized, budgeted minimax over an abstracted board:
 *
 *   Rookie square · king square · Rookie form + form turns left ·
 *   remaining transform / surge charges · bonus moves · movesLeft ·
 *   king stun / freeze · which non-king enemies are still on the board.
 *
 * Rookie (MAX) tries every legal move and every modelled ability cast;
 * the king (MIN) picks any safe escape square under the exact rules of
 * `kingFleeMove` in lib/run/pawn-ai.ts. Non-king enemies are frozen
 * obstacles that Rookie may capture (a capture stuns the king for a turn,
 * exactly like the engine). Enemy captures of Rookie are ignored.
 *
 * The contract is one-sided: it must NEVER flag a winnable position. So any
 * situation the abstraction can't model faithfully — allies, drones, status
 * effects, unmodelled abilities with charges, smoke, no move limit, a
 * blown node budget — returns `false` ("not proven unwinnable").
 */

import { formForAbility, transformDurationForTier } from './abilities';
import type { AbilityId, OwnedAbility } from './abilities';
import { enemyAt, rookieLegalMoves } from './movement';
import { toSquare } from './types';
import type { BoardState, Coord, EnemyPiece, RookieForm } from './types';

/** Search work cap — past this we give up and report "not proven". */
export const SOLVER_NODE_BUDGET = 150_000;

const KING_DELTAS: ReadonlyArray<[number, number]> = [
  [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1],
];

/** Abilities the solver models. Anything else with charges = "can't judge". */
const TRANSFORM_IDS: AbilityId[] = ['bishop-step', 'knight-hop', 'queen-pulse', 'become-king'];
/** Purely defensive abilities that never change whether the king is catchable. */
const IGNORABLE_IDS: AbilityId[] = ['aegis'];

function surgeBonusForTier(tier: number): number {
  if (tier <= 2) return 1;
  if (tier <= 4) return 2;
  return 3;
}

interface Node {
  rookie: Coord;
  king: Coord;
  form: RookieForm;
  formMovesLeft: number;
  movesLeft: number;
  bonus: number;
  /** Enemy turns the king cannot flee (capture stun / freeze). */
  kingHeld: number;
  /** Remaining charges per modelled ability (-1 = unlimited). */
  charges: Record<string, number>;
  /** Bitmask of still-alive non-king enemies (index into `ctx.others`). */
  alive: number;
}

interface Ctx {
  base: BoardState;
  others: EnemyPiece[];
  pen: Set<string> | null;
  kingFlees: boolean;
  transforms: OwnedAbility[];
  surge: OwnedAbility | null;
  memo: Map<string, boolean>;
  nodes: number;
  budgetBlown: boolean;
}

function keyOf(n: Node): string {
  const ch = Object.keys(n.charges).sort().map((k) => `${k}${n.charges[k]}`).join('');
  return `${n.rookie.file}${n.rookie.rank}${n.king.file}${n.king.rank}|${n.form}${n.formMovesLeft}|${n.movesLeft}|${n.bonus}|${n.kingHeld}|${ch}|${n.alive}`;
}

/** Materialise a BoardState so the real movement helpers do the attack rules. */
function boardFor(ctx: Ctx, n: Node): BoardState {
  const pieces: EnemyPiece[] = [];
  ctx.others.forEach((p, i) => {
    if (n.alive & (1 << i)) pieces.push(p);
  });
  pieces.push({ type: 'king', color: 'black', file: n.king.file, rank: n.king.rank });
  return {
    ...ctx.base,
    rookie: n.rookie,
    pieces,
    allies: [],
    drones: [],
    form: n.form,
    formMovesLeft: n.formMovesLeft,
  };
}

/** Mirror of kingFleeMove: every safe escape square, or [] (he stays). */
function kingEscapes(ctx: Ctx, n: Node): Coord[] {
  if (!ctx.kingFlees || n.kingHeld > 0) return [];
  const board = boardFor(ctx, n);
  const threatened = rookieLegalMoves(board).some(
    (m) => m.file === n.king.file && m.rank === n.king.rank,
  );
  if (!threatened) return [];
  const safe: Coord[] = [];
  for (const [df, dr] of KING_DELTAS) {
    const c: Coord = { file: n.king.file + df, rank: n.king.rank + dr };
    if (c.file < 1 || c.file > 8 || c.rank < 1 || c.rank > 8) continue;
    if (ctx.pen && !ctx.pen.has(toSquare(c))) continue;
    if (board.hazards.some((h) => h.file === c.file && h.rank === c.rank)) continue;
    if (enemyAt(board.pieces, c)) continue;
    if (n.rookie.file === c.file && n.rookie.rank === c.rank) continue;
    const moved: BoardState = {
      ...board,
      pieces: board.pieces.map((p) => (p.type === 'king' ? { ...p, file: c.file, rank: c.rank } : p)),
    };
    const attacked = rookieLegalMoves(moved).some((m) => m.file === c.file && m.rank === c.rank);
    if (!attacked) safe.push(c);
  }
  return safe;
}

/** End-of-enemy-turn bookkeeping (mirrors endTurn in pawn-ai.ts). */
function afterEnemyTurn(n: Node, king: Coord): Node {
  let form = n.form;
  let formMovesLeft = n.formMovesLeft;
  if (form === 'king' && formMovesLeft > 0) {
    formMovesLeft -= 1;
    if (formMovesLeft <= 0) {
      form = 'rook';
      formMovesLeft = 0;
    }
  }
  return { ...n, king, form, formMovesLeft, kingHeld: Math.max(0, n.kingHeld - 1) };
}

/** MIN node: can Rookie still win against every king reply? */
function enemyTurn(ctx: Ctx, n: Node): boolean {
  const escapes = kingEscapes(ctx, n);
  if (escapes.length === 0) return rookieTurn(ctx, afterEnemyTurn(n, n.king));
  for (const sq of escapes) {
    if (!rookieTurn(ctx, afterEnemyTurn(n, sq))) return false;
  }
  return true;
}

/** MAX node: does any Rookie move / cast reach "king captured"? */
function rookieTurn(ctx: Ctx, n: Node): boolean {
  if (n.movesLeft <= 0) return false;
  if (ctx.budgetBlown) return true; // unknown → treat as winnable
  if (++ctx.nodes > SOLVER_NODE_BUDGET) {
    ctx.budgetBlown = true;
    return true;
  }
  const key = keyOf(n);
  const cached = ctx.memo.get(key);
  if (cached !== undefined) return cached;

  let win = false;

  // Ability casts — free actions, then Rookie still moves.
  for (const t of ctx.transforms) {
    const left = n.charges[t.id] ?? 0;
    if (left === 0) continue;
    const form = formForAbility(t.id);
    if (!form) continue;
    const cast: Node = {
      ...n,
      form,
      formMovesLeft: transformDurationForTier(t.id, t.tier),
      charges: { ...n.charges, [t.id]: left < 0 ? -1 : left - 1 },
    };
    if (rookieTurn(ctx, cast)) {
      win = true;
      break;
    }
  }
  if (!win && ctx.surge) {
    const left = n.charges.surge ?? 0;
    if (left !== 0) {
      const cast: Node = {
        ...n,
        bonus: n.bonus + surgeBonusForTier(ctx.surge.tier),
        charges: { ...n.charges, surge: left < 0 ? -1 : left - 1 },
      };
      if (rookieTurn(ctx, cast)) win = true;
    }
  }

  if (!win) {
    const board = boardFor(ctx, n);
    for (const target of rookieLegalMoves(board)) {
      if (target.file === n.king.file && target.rank === n.king.rank) {
        win = true;
        break;
      }
      const hit = enemyAt(board.pieces, target);
      let alive = n.alive;
      if (hit) {
        const idx = ctx.others.indexOf(hit);
        if (idx < 0) continue;
        alive &= ~(1 << idx);
      }
      // Form bookkeeping per applyRookieMove (king form ticks on enemy turns).
      const locked = n.formMovesLeft < 0;
      let form = n.form;
      let formMovesLeft = n.formMovesLeft;
      if (!locked && form !== 'king' && form !== 'rook') {
        formMovesLeft -= 1;
        if (formMovesLeft <= 0) {
          form = 'rook';
          formMovesLeft = 0;
        }
      }
      const moved: Node = {
        ...n,
        rookie: target,
        form,
        formMovesLeft,
        movesLeft: n.movesLeft - 1,
        alive,
        kingHeld: hit ? Math.max(n.kingHeld, 1) : n.kingHeld,
      };
      if (moved.movesLeft <= 0) continue; // move-limit loss
      const ok =
        n.bonus > 0
          ? rookieTurn(ctx, { ...moved, bonus: n.bonus - 1 })
          : enemyTurn(ctx, moved);
      if (ok) {
        win = true;
        break;
      }
    }
  }

  if (!ctx.budgetBlown) ctx.memo.set(key, win);
  return win;
}

/**
 * True only when the solver PROVES Rookie cannot capture the king within
 * her remaining moves. False = winnable, or not modelled, or budget blown.
 */
export function isUnwinnable(state: BoardState): boolean {
  if (state.status !== 'playing' || state.turn !== 'rookie') return false;
  if (state.winCondition !== 'king') return false;
  if (state.moveLimit === null) return false;
  const king = state.pieces.find((p) => p.type === 'king');
  if (!king) return false;

  // Situations the abstraction can't model faithfully → not proven.
  if (state.allies.length > 0) return false;
  if (state.drones.some((d) => d.alive)) return false;
  if (state.poisonedSquares.length > 0 || state.rabidSquares.length > 0) return false;
  if (state.decoyTarget) return false;
  if ((state.smokeTurnsLeft ?? 0) > 0) return false;
  if (state.activeAbility || state.pendingOffer) return false;
  if (state.abilities.some((a) => a.id === 'squad')) return false;

  const transforms: OwnedAbility[] = [];
  let surge: OwnedAbility | null = null;
  const charges: Record<string, number> = {};
  for (const a of state.abilities) {
    if (a.usesLeftThisLevel === 0) continue;
    if (IGNORABLE_IDS.includes(a.id)) continue;
    if (TRANSFORM_IDS.includes(a.id)) {
      transforms.push(a);
      charges[a.id] = a.usesLeftThisLevel;
    } else if (a.id === 'surge') {
      surge = a;
      charges.surge = a.usesLeftThisLevel;
    } else {
      return false; // boulder / freeze / magnet / ... could change the answer
    }
  }

  const others = state.pieces.filter((p) => p.type !== 'king');
  if (others.length > 30) return false;

  const kingSq = toSquare(king);
  const kingFrozen = state.frozenSquares.includes(kingSq)
    ? (state.frozenTurnsLeft[kingSq] ?? 1)
    : 0;

  const ctx: Ctx = {
    base: state,
    others,
    pen: state.kingPen ? new Set(state.kingPen) : null,
    kingFlees: state.kingBehavior === 'flee',
    transforms,
    surge,
    memo: new Map(),
    nodes: 0,
    budgetBlown: false,
  };
  const root: Node = {
    rookie: state.rookie,
    king: { file: king.file, rank: king.rank },
    form: state.form,
    formMovesLeft: state.formMovesLeft,
    movesLeft: state.moveLimit - state.moveCount,
    bonus: state.bonusMovesLeft,
    kingHeld: Math.max(state.kingStunTurns ?? 0, kingFrozen),
    charges,
    alive: (1 << others.length) - 1,
  };

  const canWin = rookieTurn(ctx, root);
  if (ctx.budgetBlown) return false;
  return !canWin;
}
