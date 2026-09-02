/**
 * Bot evaluation primitives. Shared across T3 / T4 / T5.
 *
 * Evaluation philosophy: higher = better for Rookie. We score from Rookie's
 * perspective. The game is solved when she reaches rank 8; losing states
 * (status === 'lost') get a very negative score.
 *
 * Components of the eval:
 *   - distance-to-rank-8 (closer is better)
 *   - safety (avoid squares attacked by enemies)
 *   - material captured (sunk tempo)
 *   - move budget remaining (slack)
 *   - tempo + abilities owned (potential power)
 *   - ability uses remaining (latent reactive power)
 */

import type { AbilityId, OwnedAbility } from '../../../lib/run/abilities';
import {
  abilityLegalMoves,
  bodyguardSpawnSquare,
  boulderTargets,
  canMoveAllyAt,
  controlledAllies,
  controlledAllyLegalMoves,
  convertTargets,
  canRewind,
  isSmoked,
  knightingTargets,
  latestRewindSnapshot,
  magnetLandingSquares,
  magnetTargets,
  sacrificeTargets,
  summonSpawnSquares,
  squireSpawnSquares,
  swapTargets,
  visibleEnemySquares,
} from '../../../lib/run/abilities';
import { rookieLegalMoves, enemyAt } from '../../../lib/run/movement';
import { TEMPO_REWARD, tempoMaxFor } from '../../../lib/run/scoring';
import type {
  BoardState,
  Coord,
  EnemyPiece,
  PieceType,
} from '../../../lib/run/types';
import { toSquare } from '../../../lib/run/types';

const PIECE_VALUE: Record<PieceType, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  queen: 9,
  king: 0, // Rookie's Revenge objective — never "material" to clear
};

/**
 * Squares attacked by enemies *as the board stands right now*. Cheap-ish — we
 * iterate pieces and project their attack patterns. Used by safety scoring.
 *
 * Frozen enemies don't attack (they skip their turn).
 */
export function enemyAttackedSquares(state: BoardState): Set<string> {
  const out = new Set<string>();
  const frozen = new Set(state.frozenSquares);
  for (const p of state.pieces) {
    const sq = toSquare({ file: p.file, rank: p.rank });
    if (frozen.has(sq)) continue;
    addAttacksForPiece(state, p, out);
  }
  // Become-King impervious: while Rookie is in king form she cannot be
  // captured. Treat her square as un-attackable so safety scoring stops
  // discounting it and bots stop "wasting tempo" on capture-of-Rookie moves
  // that will simply bounce.
  if (state.form === 'king' || isSmoked(state)) {
    out.delete(toSquare(state.rookie));
  }
  return out;
}

function addAttacksForPiece(
  state: BoardState,
  piece: EnemyPiece,
  out: Set<string>,
): void {
  switch (piece.type) {
    case 'pawn':
      // Black pawns attack diagonally toward rank 1.
      for (const df of [-1, 1]) {
        const f = piece.file + df;
        const r = piece.rank - 1;
        if (f < 1 || f > 8 || r < 1 || r > 8) continue;
        out.add(toSquare({ file: f, rank: r }));
      }
      return;
    case 'knight':
      for (const [df, dr] of [
        [1, 2],
        [2, 1],
        [-1, 2],
        [-2, 1],
        [1, -2],
        [2, -1],
        [-1, -2],
        [-2, -1],
      ] as const) {
        const f = piece.file + df;
        const r = piece.rank + dr;
        if (f < 1 || f > 8 || r < 1 || r > 8) continue;
        out.add(toSquare({ file: f, rank: r }));
      }
      return;
    case 'bishop':
      addSlideAttacks(state, piece, out, [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
      return;
    case 'queen':
      addSlideAttacks(state, piece, out, [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]);
      return;
  }
}

function addSlideAttacks(
  state: BoardState,
  piece: EnemyPiece,
  out: Set<string>,
  dirs: ReadonlyArray<readonly [number, number]>,
): void {
  for (const [df, dr] of dirs) {
    let f = piece.file + df;
    let r = piece.rank + dr;
    while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
      out.add(toSquare({ file: f, rank: r }));
      // Slide stops at any occupant (own piece or rookie).
      const blockedByEnemy = state.pieces.find(
        (q) => q !== piece && q.file === f && q.rank === r,
      );
      const blockedByRookie =
        state.rookie.file === f && state.rookie.rank === r;
      if (blockedByEnemy || blockedByRookie) break;
      f += df;
      r += dr;
    }
  }
}

/** True if any enemy currently threatens Rookie's square. */
export function rookieInThreat(state: BoardState): boolean {
  const attacked = enemyAttackedSquares(state);
  return attacked.has(toSquare(state.rookie));
}

/** True if any enemy can capture Rookie at the given target square (post-move). */
export function squareUnderAttack(state: BoardState, target: Coord): boolean {
  const attacked = enemyAttackedSquares(state);
  return attacked.has(toSquare(target));
}

/** Distance-to-rank-8 in Rookie moves (rough — assumes she can walk in a line). */
export function distanceToGoal(state: BoardState): number {
  return Math.max(0, 8 - state.rookie.rank);
}

const LOST_SCORE = -10_000;
const WON_SCORE = 10_000;

export function evalState(state: BoardState): number {
  if (state.status === 'lost') return LOST_SCORE;
  if (state.status === 'won') return WON_SCORE;

  let score = 0;

  // Rookie's Revenge ('king' win condition) — the goal is the enemy king, not
  // rank 8. Swap the rank/open-file heuristics for a king-proximity one.
  const kingGoal = state.winCondition === 'king';
  const enemyKing = kingGoal ? state.pieces.find((p) => p.type === 'king') : undefined;

  // Rank position is a small signal — a rook on rank 5 isn't meaningfully
  // closer to winning than a rook on rank 2 if both have clear paths up.
  // The dominant signal is OPEN PATHS, not raw rank. Keep this tiny so the
  // bot doesn't waste turns inching forward when a winning slide exists.
  if (!kingGoal) score += state.rookie.rank * 2;

  // Squares I can safely occupy (legal moves not attacked).
  const attacked = enemyAttackedSquares(state);
  const legal = rookieLegalMoves(state);
  let safeMoves = 0;
  let advancingSafe = 0;
  let winningReach = 0;
  for (const m of legal) {
    if (!attacked.has(toSquare(m))) {
      safeMoves++;
      if (m.rank > state.rookie.rank) advancingSafe++;
      // Rookie reaches rank 8 RIGHT NOW with a safe slide. Game over,
      // huge bonus so this dominates every other consideration.
      if (kingGoal) {
        if (enemyKing && m.file === enemyKing.file && m.rank === enemyKing.rank) winningReach++;
      } else if (m.rank === 8) winningReach++;
    }
  }
  score += Math.min(safeMoves, 6) * 1.5;
  score += advancingSafe * 2.5;
  if (winningReach > 0) score += 60;

  // OPEN PATH MANDATE — for each file, count whether rookie could reach
  // rank 8 on that file with a clear vertical path. A "clear" file means
  // no enemy and no hazard between rookie's current rank and rank 7
  // (inclusive). Rank 8 itself can be empty or capturable.
  //
  // This is the rook-can-fly principle: an open file from rank 2 is more
  // valuable than being on rank 7 of a blocked file.
  let openPathCount = 0;
  let rookieFileIsOpen = false;
  if (kingGoal && enemyKing) {
    // King proximity: closer (Chebyshev) is better; a clear rook line to the
    // king's square (same file/rank, nothing between) is the "open path".
    const dist = Math.max(
      Math.abs(enemyKing.file - state.rookie.file),
      Math.abs(enemyKing.rank - state.rookie.rank),
    );
    score += (8 - dist) * 3;
    const sameFile = enemyKing.file === state.rookie.file;
    const sameRank = enemyKing.rank === state.rookie.rank;
    if (sameFile || sameRank) {
      let clear = true;
      const lo = sameFile ? Math.min(enemyKing.rank, state.rookie.rank) : Math.min(enemyKing.file, state.rookie.file);
      const hi = sameFile ? Math.max(enemyKing.rank, state.rookie.rank) : Math.max(enemyKing.file, state.rookie.file);
      for (let i = lo + 1; i < hi; i++) {
        const f = sameFile ? state.rookie.file : i;
        const r = sameFile ? i : state.rookie.rank;
        if (state.pieces.some((p) => p.file === f && p.rank === r)) { clear = false; break; }
        if (state.hazards.some((h) => h.file === f && h.rank === r)) { clear = false; break; }
      }
      if (clear) rookieFileIsOpen = true;
    }
  } else
  for (let f = 1; f <= 8; f++) {
    let clear = true;
    for (let r = state.rookie.rank + 1; r <= 7; r++) {
      if (state.pieces.some((p) => p.file === f && p.rank === r)) {
        clear = false;
        break;
      }
      if (state.hazards.some((h) => h.file === f && h.rank === r)) {
        clear = false;
        break;
      }
    }
    if (clear) {
      openPathCount++;
      if (f === state.rookie.file) rookieFileIsOpen = true;
    }
  }
  score += openPathCount * 5;
  // Being ON an open winning file right now is even better than just having
  // such a file exist — it means rookie is one slide from rank 8 (or a
  // close-to-rank-8 square that wins on the followup).
  if (rookieFileIsOpen) score += 20;

  // Penalize standing in a threatened square.
  if (attacked.has(toSquare(state.rookie))) score -= 25;

  // Move budget slack — if a move limit exists, prefer keeping room.
  if (state.moveLimit !== null) {
    const slack = state.moveLimit - state.moveCount;
    if (slack <= 0) return LOST_SCORE;
    score += Math.min(slack, 8) * 1.5;
  }

  // Tempo + abilities — latent power.
  //
  // Tempo accumulation was previously underweighted (max +4 vs winningReach
  // +60) so the bot raced to rank 8 every time and never farmed offers.
  // Human traces (Pincer L1-L3 declined 16/26 winning moves to keep capturing)
  // show offer-banking dominates rank-advancement on easy levels. Bumped to
  // max +14 so a near-full meter is competitive with a winning slide.
  const tempoMax = tempoMaxFor(state);
  score += (state.tempo / tempoMax) * 14;
  // A pending offer is a free ability pick next turn — strong incentive
  // to reach this state.
  if (state.pendingOffer && state.pendingOffer.length > 0) score += 22;
  // Safe captures reachable this turn close the gap to the next offer.
  // Weighted by how much headroom there is in the tempo meter — if 1 capture
  // would fill it, that's worth ~+15; if we'd need 8 tempo from 0 it's worth
  // proportionally less.
  if (state.tempo < tempoMax && !state.pendingOffer) {
    const headroom = tempoMax - state.tempo;
    let reachableCaptureTempo = 0;
    for (const m of legal) {
      if (attacked.has(toSquare(m))) continue;
      const cap = state.pieces.find(
        (p) => p.file === m.file && p.rank === m.rank,
      );
      if (!cap) continue;
      reachableCaptureTempo += TEMPO_REWARD[cap.type] ?? 0;
    }
    const proximity = Math.min(1, reachableCaptureTempo / headroom);
    score += proximity * 14;
  }
  for (const a of state.abilities) {
    score += 3 + a.tier;
    if (a.usesLeftThisLevel > 0 || a.usesLeftThisLevel === -1) score += 0.5;
  }
  if (state.shieldUp) score += 6;
  if (isSmoked(state)) score += 6; // invisible = safe for now
  if (state.bonusMovesLeft > 0) score += state.bonusMovesLeft * 5;

  // Material penalty by chess piece value — removing a queen is worth ~7
  // points to the bot instead of the prior 0.4 (any piece equal). Makes
  // Freeze / Poison / Rabies attractive when they clear or disable blockers.
  for (const p of state.pieces) score -= PIECE_VALUE[p.type] * 0.8;

  return score;
}

/**
 * Heuristic: can any enemy capture Rookie next enemy turn? Conservative —
 * doesn't account for ghost-blockers or enemy pick-priority, just "is rookie's
 * current square in the attack-set."
 */
export function rookieCanBeCapturedThisTurn(state: BoardState): boolean {
  return rookieInThreat(state);
}

/**
 * Enumerate all legal Rookie *actions* (regular moves + valid ability
 * activations) from the current state. Each action is annotated with what
 * follow-up (if any) the activation needs.
 *
 * Returned action shapes are bot-friendly — they map 1:1 to BotAction.
 *
 * Excluded abilities (from ablation context) are filtered out. Targeted/
 * movement abilities are expanded into one entry per legal target so the bot
 * can score each concrete result rather than just "tap the card."
 */
export interface ActionCandidate {
  kind: 'move' | 'squire-move' | 'activate-ability' | 'ability-target';
  abilityId?: AbilityId;
  target?: Coord;
  /** squire-move only: WHICH controlled summon moves (several can coexist). */
  from?: Coord;
}

export function legalCandidates(
  state: BoardState,
  excluded: ReadonlySet<AbilityId>,
): ActionCandidate[] {
  const out: ActionCandidate[] = [];
  if (state.status !== 'playing' || state.turn !== 'rookie') return out;
  if (state.pendingOffer) return out;
  if (state.activeAbility) return out; // caller handles follow-up separately

  for (const m of rookieLegalMoves(state)) {
    out.push({ kind: 'move', target: m });
  }
  // Controlled summons (Squire family): the player's other bodies — their
  // moves are real candidates, one entry per (summon, target).
  for (const ca of controlledAllies(state)) {
    if (!canMoveAllyAt(state, ca)) continue;
    const from = { file: ca.file, rank: ca.rank };
    for (const m of controlledAllyLegalMoves(state, ca)) {
      out.push({ kind: 'squire-move', from, target: m });
    }
  }

  for (const owned of state.abilities) {
    if (excluded.has(owned.id)) continue;
    if (owned.usesLeftThisLevel === 0) continue;
    out.push(...candidatesForAbility(state, owned));
  }

  return out;
}

function candidatesForAbility(
  state: BoardState,
  owned: OwnedAbility,
): ActionCandidate[] {
  const out: ActionCandidate[] = [];
  switch (owned.id) {
    case 'aegis':
      if (!state.shieldUp) out.push({ kind: 'activate-ability', abilityId: 'aegis' });
      return out;
    case 'surge':
      out.push({ kind: 'activate-ability', abilityId: 'surge' });
      return out;
    case 'bishop-step':
    case 'knight-hop':
    case 'queen-pulse':
    case 'become-king':
      if (state.form === 'rook') {
        out.push({ kind: 'activate-ability', abilityId: owned.id });
      }
      return out;
    case 'phase-step':
    case 'leap': {
      const legals = abilityLegalMoves(state, owned.id);
      for (const target of legals) {
        out.push({ kind: 'ability-target', abilityId: owned.id, target });
      }
      return out;
    }
    case 'freeze-ray':
    case 'poison-dart':
    case 'rabies-dart': {
      // Line-of-sight dart abilities. Only enemies on a square Rookie's
      // current form can SEE are legal targets — the engine rejects others
      // anyway, so the bot doesn't need to enumerate them.
      const seen = visibleEnemySquares(state);
      for (const c of seen) {
        const sq = toSquare(c);
        // Only Freeze Ray may target the enemy king (Rookie's Revenge).
        if (
          owned.id !== 'freeze-ray' &&
          state.pieces.some((p) => p.type === 'king' && p.file === c.file && p.rank === c.rank)
        )
          continue;
        if (
          owned.id === 'freeze-ray' &&
          state.frozenSquares.includes(sq)
        )
          continue;
        if (
          owned.id === 'poison-dart' &&
          state.poisonedSquares.includes(sq)
        )
          continue;
        if (
          owned.id === 'rabies-dart' &&
          state.rabidSquares.includes(sq)
        )
          continue;
        out.push({
          kind: 'ability-target',
          abilityId: owned.id,
          target: { file: c.file, rank: c.rank },
        });
      }
      return out;
    }
    case 'decoy': {
      // Target any enemy (the engine refuses the king; skip him here too).
      for (const p of state.pieces) {
        if (p.type === 'king') continue;
        out.push({
          kind: 'ability-target',
          abilityId: 'decoy',
          target: { file: p.file, rank: p.rank },
        });
      }
      return out;
    }
    case 'convert': {
      // Flip an eligible enemy — one candidate per legal target.
      for (const c of convertTargets(state)) {
        out.push({ kind: 'ability-target', abilityId: 'convert', target: c });
      }
      return out;
    }
    case 'drones':
      // Instant swarm — free action; the swarm resolves before Rookie moves.
      out.push({ kind: 'activate-ability', abilityId: 'drones' });
      return out;
    case 'squad':
      return out; // passive — nothing to cast
    case 'boulder': {
      // Drop on an empty square. Full board = 60+ candidates per turn, which
      // would swamp the rollout budget — keep it to squares that MATTER:
      // adjacent to the enemy king (seal his pen exits) or on a line between
      // Rookie and a non-king enemy (block a hunter). Falls back to "near
      // the king" on rank-8 levels.
      const king = state.pieces.find((p) => p.type === 'king');
      const cheb = (a: Coord, b: Coord) => Math.max(Math.abs(a.file - b.file), Math.abs(a.rank - b.rank));
      for (const c of boulderTargets(state)) {
        const nearKing = king ? cheb(c, king) <= 1 : false;
        const nearRookie = cheb(c, state.rookie) <= 2;
        // T2+ crush squares (an enemy pawn stands there) always matter.
        const crush = state.pieces.some(
          (p) => p.type === 'pawn' && p.file === c.file && p.rank === c.rank,
        );
        if (nearKing || nearRookie || crush) {
          out.push({ kind: 'ability-target', abilityId: 'boulder', target: c });
        }
      }
      return out;
    }
    case 'smoke':
      if (!isSmoked(state)) out.push({ kind: 'activate-ability', abilityId: 'smoke' });
      return out;
    case 'rewind': {
      // Enemy-only rewind (2026-09-02): a real strategic action — the enemy
      // reply unhappens, Rookie's move stays. Enumerate it when the last
      // enemy turn HURT: an ally died, or an enemy now attacks Rookie.
      if (!canRewind(state)) return out;
      const snap = latestRewindSnapshot(state);
      if (!snap) return out;
      const allyDied = (snap.allies?.length ?? 0) > (state.allies?.length ?? 0);
      const threatened = enemyAttackedSquares(state).has(toSquare(state.rookie));
      if (allyDied || threatened) {
        out.push({ kind: 'activate-ability', abilityId: 'rewind' });
      }
      return out;
    }
    case 'magnet': {
      // One candidate per (enemy, landing square) — the pull DISTANCE is the
      // player's choice, so the bot scores each concrete landing.
      for (const c of magnetTargets(state)) {
        for (const landing of magnetLandingSquares(state, c, owned.tier)) {
          out.push({ kind: 'ability-target', abilityId: 'magnet', target: c, target2: landing });
        }
      }
      return out;
    }
    case 'bodyguard':
      if (bodyguardSpawnSquare(state)) out.push({ kind: 'activate-ability', abilityId: 'bodyguard' });
      return out;
    case 'summon-knight':
      // Place the Squire on any free square beside Rookie (at most 8).
      for (const c of squireSpawnSquares(state)) {
        out.push({ kind: 'ability-target', abilityId: 'summon-knight', target: c });
      }
      return out;
    case 'bishop-squire':
    case 'page':
    case 'twin':
    case 'duchess':
    case 'dragon': {
      // Spawn beside Rookie (at most 8 squares).
      for (const c of summonSpawnSquares(state, owned.id)) {
        out.push({ kind: 'ability-target', abilityId: owned.id, target: c });
      }
      return out;
    }
    case 'vanguard': {
      // Anywhere in range = up to 60+ squares; keep the branching sane by
      // only offering drops near the king or near Rookie (mirrors Boulder).
      const king = state.pieces.find((p) => p.type === 'king');
      const cheb = (a: Coord, b: Coord) => Math.max(Math.abs(a.file - b.file), Math.abs(a.rank - b.rank));
      for (const c of summonSpawnSquares(state, 'vanguard')) {
        const nearKing = king ? cheb(c, king) <= 2 : false;
        const nearRookie = cheb(c, state.rookie) <= 2;
        if (nearKing || nearRookie) {
          out.push({ kind: 'ability-target', abilityId: 'vanguard', target: c });
        }
      }
      return out;
    }
    case 'swap': {
      for (const c of swapTargets(state)) {
        out.push({ kind: 'ability-target', abilityId: 'swap', target: c });
      }
      return out;
    }
    case 'sacrifice': {
      for (const c of sacrificeTargets(state)) {
        out.push({ kind: 'ability-target', abilityId: 'sacrifice', target: c });
      }
      return out;
    }
    case 'knighting': {
      for (const c of knightingTargets(state)) {
        out.push({ kind: 'ability-target', abilityId: 'knighting', target: c });
      }
      return out;
    }
  }
  return out;
}

/** Identify which enemy piece *did* capture Rookie, given a state where rookie is gone. */
export function inferCapturer(prev: BoardState, next: BoardState): PieceType | undefined {
  // The capturer is the enemy that now occupies Rookie's previous square.
  for (const p of next.pieces) {
    if (p.file === prev.rookie.file && p.rank === prev.rookie.rank) return p.type;
  }
  return undefined;
}

/** Sum of material remaining on the board. Used as a tiebreaker / signal. */
export function materialOnBoard(pieces: EnemyPiece[]): number {
  return pieces.reduce((sum, p) => sum + (PIECE_VALUE[p.type] ?? 0), 0);
}
