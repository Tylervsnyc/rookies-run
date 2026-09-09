/**
 * Enemy AI for Rookies Run.
 *
 * One enemy acts per turn — keeps the animation legible. Priority is global
 * across all enemies:
 *   1. Any piece that can capture Rookie this turn does so (tiebreak: piece
 *      value descending → leftmost → lowest).
 *   2. Otherwise the "most threatening" piece advances:
 *      - Pawns: lowest rank, leftmost (closest to rank 1).
 *      - Sliders/knights/queen: closest piece to Rookie steps toward her.
 *   3. If no one can act, the turn passes back to Rookie.
 *
 * Enemy pieces never step onto hazard squares either.
 */

import {
  allyAttackedSquares,
  controlledThreatensSquare,
  clearStatusOnSquare,
  isSmoked,
  relocateStatusMarkers,
  stepAllyTurn,
  stunKingAfterCapture,
  tryAegisIntercept,
  pushEnemyPhaseSnapshot,
  springSnaresAt,
} from './abilities';
import { DIFFICULTIES } from './difficulty';
import { enemyAt, rookieLegalMoves } from './movement';
import { TEMPO_REWARD, tempoMaxFor } from './scoring';
import { mulberry32 } from './seed';
import { fromSquare, toSquare } from './types';
import type { BoardState, Coord, EnemyPiece, PieceType } from './types';

/**
 * RNG for AI tiebreak decisions. Seeded by the per-attempt `aiRngSeed` mixed
 * with the current move count and step within the enemy turn, so each AI
 * choice is deterministic for a given state (replayable) but varies between
 * attempts and between turns.
 */
function aiRng(state: BoardState): () => number {
  const seed =
    (((state.aiRngSeed ?? 1) >>> 0) ^
      Math.imul(state.moveCount + 1, 2654435761) ^
      Math.imul(state.enemyMovedSquares.length + 1, 40503)) >>>
    0;
  return mulberry32(seed || 1);
}

/** Pick a uniformly-random element using a seeded RNG. */
function pickRandom<T>(items: T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)];
}

const BLACK_FORWARD = -1;

const ROOK_DIRS: ReadonlyArray<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
const BISHOP_DIRS: ReadonlyArray<[number, number]> = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
const QUEEN_DIRS: ReadonlyArray<[number, number]> = [...ROOK_DIRS, ...BISHOP_DIRS];
const KNIGHT_DELTAS: ReadonlyArray<[number, number]> = [
  [1, 2],
  [2, 1],
  [-1, 2],
  [-2, 1],
  [1, -2],
  [2, -1],
  [-1, -2],
  [-2, -1],
];

const PIECE_THREAT: Record<PieceType, number> = {
  queen: 4,
  bishop: 2,
  knight: 2,
  pawn: 1,
  // The king DOES capture as of 2026-09-08 — but only Rookie, and only from
  // an adjacent square (see pieceLegalMovesRaw). Ranked below a queen so a
  // queen still takes the shot when both can; ranked at all so he takes it
  // when nobody else can.
  king: 3,
};

function inBounds(c: Coord): boolean {
  return c.file >= 1 && c.file <= 8 && c.rank >= 1 && c.rank <= 8;
}

function isHazard(hazards: Coord[], at: Coord): boolean {
  return hazards.some((h) => h.file === at.file && h.rank === at.rank);
}

/** True if a rainbow ally occupies this square — treat like a friendly blocker. */
function isAllyAt(state: BoardState, at: Coord): boolean {
  return (state.allies ?? []).some((a) => a.file === at.file && a.rank === at.rank);
}

/**
 * "Ghost blockers" — squares vacated by enemies earlier in this same turn.
 * Subsequent enemies treat them as still occupied so the player can plan
 * threats from the board they saw at the start of the turn (no piece can
 * slide through, jump onto, or advance into a square another enemy just left).
 */
function vacatedSet(state: BoardState): Set<string> {
  const out = new Set<string>();
  for (const sq of state.enemyVacatedSquares ?? []) {
    const file = sq.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const rank = parseInt(sq[1], 10);
    out.add(`${file},${rank}`);
  }
  return out;
}

function isVacated(vacated: ReadonlySet<string>, at: Coord): boolean {
  return vacated.has(`${at.file},${at.rank}`);
}

/**
 * Royal aura filter — when Rookie is in king form, an enemy that is currently
 * within king-distance 1 of her cannot LAND on a square that is strictly
 * closer to her than its own square. Sliders may still pass through closer
 * squares (only the final destination is constrained). Captures of Rookie
 * herself are unaffected (the impervious bounce handles those at the engine
 * level). Captures of OTHER pieces are also unaffected (this only restricts
 * movement, not pickoffs).
 */
function applyRoyalAura(
  piece: EnemyPiece,
  moves: Coord[],
  state: BoardState,
): Coord[] {
  if (state.form !== 'king') return moves;
  const piecePos: Coord = { file: piece.file, rank: piece.rank };
  const enemyDistToRookie = chebyshev(piecePos, state.rookie);
  if (enemyDistToRookie > 1) return moves;
  return moves.filter((m) => {
    // Rookie's square — handled by impervious bounce; let it through so the
    // engine still recognises the capture attempt.
    if (m.file === state.rookie.file && m.rank === state.rookie.rank) return true;
    // Capturing another enemy on m? Aura doesn't constrain pickoffs.
    const occupant = enemyAt(state.pieces, m);
    if (occupant && occupant !== piece) return true;
    const destDist = chebyshev(m, state.rookie);
    return destDist >= enemyDistToRookie;
  });
}

/** All squares this piece could move to (or capture on) given the board. */
function pieceLegalMoves(piece: EnemyPiece, state: BoardState): Coord[] {
  return applyRoyalAura(piece, pieceLegalMovesRaw(piece, state), state);
}

function pieceLegalMovesRaw(piece: EnemyPiece, state: BoardState): Coord[] {
  const vacated = vacatedSet(state);
  switch (piece.type) {
    case 'pawn': {
      // Advances one rank (no two-square open; no captures from advancing).
      const target: Coord = { file: piece.file, rank: piece.rank + BLACK_FORWARD };
      const out: Coord[] = [];
      if (
        inBounds(target) &&
        !isHazard(state.hazards, target) &&
        !enemyAt(state.pieces, target) &&
        !isAllyAt(state, target) &&
        !isVacated(vacated, target) &&
        !(state.rookie.file === target.file && state.rookie.rank === target.rank)
      ) {
        out.push(target);
      }
      // Diagonal captures of Rookie OR any ally.
      for (const df of [-1, 1]) {
        const cap: Coord = { file: piece.file + df, rank: piece.rank + BLACK_FORWARD };
        if (!inBounds(cap)) continue;
        if (isHazard(state.hazards, cap)) continue;
        const hitsRookie = state.rookie.file === cap.file && state.rookie.rank === cap.rank;
        const hitsAlly = isAllyAt(state, cap);
        if (hitsRookie || hitsAlly) {
          out.push(cap);
        }
      }
      return out;
    }
    case 'knight': {
      const out: Coord[] = [];
      for (const [df, dr] of KNIGHT_DELTAS) {
        const c: Coord = { file: piece.file + df, rank: piece.rank + dr };
        if (!inBounds(c)) continue;
        if (isHazard(state.hazards, c)) continue;
        if (isVacated(vacated, c)) continue; // ghost blocker
        const blocker = enemyAt(state.pieces, c);
        if (blocker && blocker !== piece) continue; // can't land on friendly
        out.push(c); // allies are capturable, not blockers
      }
      return out;
    }
    case 'bishop':
    case 'queen': {
      const dirs = piece.type === 'queen' ? QUEEN_DIRS : BISHOP_DIRS;
      return slidingMoves(piece, state, dirs, vacated);
    }
    case 'king':
      // THE KING TAKES WHAT STANDS NEXT TO HIM. See the twin block in
      // rabidLegalMoves for the full note — the rule is identical in both
      // move generators on purpose (Tyler, 2026-09-08: "we can't have
      // different rules for the king in different places"). His MOVEMENT is
      // still owned by kingFleeMove() in the mover phase; this is captures
      // only, and only of Rookie.
      return kingCaptureMoves(piece, state, vacated);
  }
}

/**
 * The squares an enemy king may CAPTURE on: adjacent, holding Rookie, not a
 * hazard, not a ghost-blocked square. Never a plain step — a king who could
 * step through here would roam, and his movement belongs to kingReaction.
 */
function kingCaptureMoves(
  piece: EnemyPiece,
  state: BoardState,
  vacated: ReturnType<typeof vacatedSet>,
): Coord[] {
  const out: Coord[] = [];
  for (const [df, dr] of QUEEN_DIRS) {
    const c: Coord = { file: piece.file + df, rank: piece.rank + dr };
    if (!inBounds(c)) continue;
    if (isHazard(state.hazards, c)) continue;
    if (isVacated(vacated, c)) continue;
    if (c.file === state.rookie.file && c.rank === state.rookie.rank) out.push(c);
  }
  return out;
}

/**
 * Rookie's Revenge — 'flee' king. If Rookie could capture him next move, he
 * steps to an adjacent empty square that Rookie's CURRENT form does not
 * attack (re-evaluated with the king relocated, so vacating a blocking square
 * doesn't walk him into a freshly opened ray). No safe square → stays put.
 * Never captures anything.
 */
function kingFleeMove(
  king: EnemyPiece,
  state: BoardState,
  rng: () => number,
): Coord | null {
  // Stunned (Rookie just captured something) — he can't flee this turn.
  if ((state.kingStunTurns ?? 0) > 0) return null;
  const kingPos: Coord = { file: king.file, rank: king.rank };
  const allyCover = state.allies.length > 0 ? allyAttackedSquares(state) : null;
  const threatened =
    rookieLegalMoves(state).some(
      (m) => m.file === kingPos.file && m.rank === kingPos.rank,
    ) ||
    // Nightmare: he also reads the rainbow allies' lines as a threat.
    (kingReactsToAllies(state) && !!allyCover && allyCover.has(toSquare(kingPos))) ||
    // Controlled summons (the Squire family) CAN take him — he always fears them.
    controlledThreatensSquare(state, kingPos);
  if (!threatened) return null;
  const vacated = vacatedSet(state);
  const pen = state.kingPen ? new Set(state.kingPen) : null;
  const safe: Coord[] = [];
  for (const [df, dr] of QUEEN_DIRS) {
    const c: Coord = { file: king.file + df, rank: king.rank + dr };
    if (!inBounds(c)) continue;
    if (chequerForbids(state, king, c)) continue; // no diagonals while chequered
    if (pen && !pen.has(toSquare(c))) continue; // never leaves his pen
    if (isHazard(state.hazards, c)) continue;
    if (isVacated(vacated, c)) continue;
    if (enemyAt(state.pieces, c)) continue;
    if (isAllyAt(state, c)) continue;
    if (state.rookie.file === c.file && state.rookie.rank === c.rank) continue;
    if (allyCover && allyCover.has(toSquare(c))) continue; // allies cut off escapes
    const moved: BoardState = {
      ...state,
      pieces: state.pieces.map((p) => (p === king ? { ...p, file: c.file, rank: c.rank } : p)),
    };
    const attacked = rookieLegalMoves(moved).some(
      (m) => m.file === c.file && m.rank === c.rank,
    );
    if (!attacked) safe.push(c);
  }
  if (safe.length === 0) return null;
  // He also knows about capture-stun: a square that shares an open file or
  // rank with one of his own pieces Rookie can take RIGHT NOW is a trap
  // (she takes it, he's stunned on her line). Prefer squares off those lines.
  const captureTargets = rookieLegalMoves(state).filter((m) => !!enemyAt(state.pieces, m));
  const risky = (c: Coord): boolean =>
    captureTargets.some((t) => {
      if (t.file !== c.file && t.rank !== c.rank) return false;
      const df = Math.sign(c.file - t.file);
      const dr = Math.sign(c.rank - t.rank);
      let f = t.file + df;
      let r = t.rank + dr;
      while (f !== c.file || r !== c.rank) {
        const blocker = enemyAt(state.pieces, { file: f, rank: r });
        if (blocker && blocker !== king) return false;
        if (isHazard(state.hazards, { file: f, rank: r })) return false;
        if (isAllyAt(state, { file: f, rank: r })) return false;
        f += df;
        r += dr;
      }
      return true;
    });
  const calm = safe.filter((c) => !risky(c));
  const pool = calm.length > 0 ? calm : safe;
  // Prefer the square farthest from Rookie; random among ties.
  let bestDist = -1;
  for (const c of pool) bestDist = Math.max(bestDist, chebyshev(c, state.rookie));
  return pickRandom(pool.filter((c) => chebyshev(c, state.rookie) === bestDist), rng);
}

/**
 * Rookie's Revenge — the fleeing king's FREE reaction. If he's threatened
 * (and not stunned / frozen) he sidesteps without spending the army's action
 * budget: checked at the start of the enemy turn AND again after each guard
 * moves (a guard leaving its post can open a line — he sees it coming).
 * Returns the new state, or null when he doesn't move.
 */
/** Difficulty flag: does the fleeing king react to ally moves (nightmare)? */
/**
 * Gauntlet — the ANSWER step. While `tauntTurns > 0` a king who is not in
 * danger walks one square toward Rookie instead of standing still. Shares
 * every refusal a flee has (hazards, occupied and vacated squares, ally
 * cover, Rookie's own square) with two differences that ARE the card:
 *
 *  - his pen does not hold him, and
 *  - he refuses squares Rookie's CURRENT form attacks only while the court
 *    can see her. Under Smoke (`isSmoked`) there is nothing to refuse, so he
 *    walks straight onto her line — which is the run's signature pair.
 *
 * He only ever takes a step that STRICTLY closes the distance; when nothing
 * does, he stands (the challenge burns a turn but does not push him sideways).
 */
function kingAnswerMove(
  king: EnemyPiece,
  state: BoardState,
  rng: () => number,
): Coord | null {
  if ((state.tauntTurns ?? 0) <= 0) return null;
  if ((state.kingStunTurns ?? 0) > 0) return null;
  const kingPos: Coord = { file: king.file, rank: king.rank };
  const here = chebyshev(kingPos, state.rookie);
  if (here <= 1) return null; // already face to face — nothing left to close
  const blind = isSmoked(state);
  const allyCover = state.allies.length > 0 ? allyAttackedSquares(state) : null;
  const vacated = vacatedSet(state);
  const closer: Coord[] = [];
  for (const [df, dr] of QUEEN_DIRS) {
    const c: Coord = { file: king.file + df, rank: king.rank + dr };
    if (!inBounds(c)) continue;
    if (chequerForbids(state, king, c)) continue; // no diagonals while chequered
    if (chebyshev(c, state.rookie) >= here) continue;
    if (isHazard(state.hazards, c)) continue;
    if (isVacated(vacated, c)) continue;
    if (enemyAt(state.pieces, c)) continue;
    if (isAllyAt(state, c)) continue;
    if (state.rookie.file === c.file && state.rookie.rank === c.rank) continue;
    if (allyCover && allyCover.has(toSquare(c))) continue;
    if (controlledThreatensSquare(state, c)) continue;
    if (!blind) {
      // Proud, not suicidal: he will not answer onto a line he can see.
      const moved: BoardState = {
        ...state,
        pieces: state.pieces.map((p) =>
          p === king ? { ...p, file: c.file, rank: c.rank } : p,
        ),
      };
      const attacked = rookieLegalMoves(moved).some(
        (m) => m.file === c.file && m.rank === c.rank,
      );
      if (attacked) continue;
    }
    closer.push(c);
  }
  if (closer.length === 0) return null;
  return pickRandom(closer, rng);
}

/**
 * Panic — the FORCED step. While `panicTurns > 0` a king who has no reason to
 * move must move anyway: he may not end the enemy phase on the square he
 * started it on. Everything physical still refuses him (out of bounds, stone,
 * a vacated ghost square, an occupied square, Rookie's own square) AND HIS PEN
 * STILL HOLDS HIM — the panic shuffles him inside his room, it never opens it.
 * That is the whole difference from a thrown Gauntlet, which walks him out.
 *
 * What is NOT a refusal any more is the thing that makes the card: a square
 * Rookie attacks. He prefers a safe one exactly as a flee does (unattacked by
 * her CURRENT form with him relocated, not covered by a rainbow ally, not
 * threatened by a controlled summon; farthest from Rookie among those). But if
 * NOTHING is safe he takes the least-bad step — farthest from her — instead of
 * standing his ground. So the player's job is the work before the throw: leave
 * him one safe square and the panic is a wasted card, leave him none and it is
 * the kill.
 *
 * Walled in with no legal step at all, he stands. The panic is spent either way.
 */
function kingPanicMove(
  king: EnemyPiece,
  state: BoardState,
  rng: () => number,
): Coord | null {
  if ((state.panicTurns ?? 0) <= 0) return null;
  if ((state.kingStunTurns ?? 0) > 0) return null;
  const vacated = vacatedSet(state);
  const pen = state.kingPen ? new Set(state.kingPen) : null;
  const allyCover = state.allies.length > 0 ? allyAttackedSquares(state) : null;
  const legal: Coord[] = [];
  const safe: Coord[] = [];
  for (const [df, dr] of QUEEN_DIRS) {
    const c: Coord = { file: king.file + df, rank: king.rank + dr };
    if (!inBounds(c)) continue;
    if (chequerForbids(state, king, c)) continue; // no diagonals while chequered
    if (pen && !pen.has(toSquare(c))) continue; // the room still holds him
    if (isHazard(state.hazards, c)) continue;
    if (isVacated(vacated, c)) continue;
    if (enemyAt(state.pieces, c)) continue;
    if (isAllyAt(state, c)) continue;
    if (state.rookie.file === c.file && state.rookie.rank === c.rank) continue;
    legal.push(c);
    if (allyCover && allyCover.has(toSquare(c))) continue;
    if (controlledThreatensSquare(state, c)) continue;
    const moved: BoardState = {
      ...state,
      pieces: state.pieces.map((p) =>
        p === king ? { ...p, file: c.file, rank: c.rank } : p,
      ),
    };
    const attacked = rookieLegalMoves(moved).some(
      (m) => m.file === c.file && m.rank === c.rank,
    );
    if (attacked) continue;
    safe.push(c);
  }
  const pool = safe.length > 0 ? safe : legal;
  if (pool.length === 0) return null;
  let bestDist = -1;
  for (const c of pool) bestDist = Math.max(bestDist, chebyshev(c, state.rookie));
  return pickRandom(pool.filter((c) => chebyshev(c, state.rookie) === bestDist), rng);
}

/**
 * Chequer — the FORBIDDEN DIRECTION. While `chequerTurns > 0` the king may not
 * set foot on a square of his own colour, and a king's four diagonal
 * neighbours are always exactly that. So for one enemy phase he moves like a
 * rook: four orthogonal steps, every one of them the opposite colour to the
 * square he is standing on.
 *
 * It is a filter on the CANDIDATE squares, shared by all three of his move
 * modes (the flee, the Gauntlet answer, the Panic step) — the card takes the
 * direction away from him however he came to be moving. It never compels a
 * step and never prevents one: walled in with all four orthogonals gone, he
 * simply stands, and a chequer thrown into a room with a spare orthogonal
 * square has bought one sidestep and spent a card.
 */
function chequerForbids(state: BoardState, king: EnemyPiece, c: Coord): boolean {
  if ((state.chequerTurns ?? 0) <= 0) return false;
  return (c.file + c.rank) % 2 === (king.file + king.rank) % 2;
}

function kingReactsToAllies(state: BoardState): boolean {
  const d = state.difficulty;
  return !!d && !!DIFFICULTIES[d]?.kingReactsToAllies;
}

/**
 * Nightmare-aware ally step: advance one ally (lib/run/abilities.ts), then —
 * only when the difficulty says `kingReactsToAllies` — let the fleeing king
 * take his free sidestep immediately, mirroring how he reacts after each
 * guard move. Every other difficulty is byte-identical to `stepAllyTurn`.
 */
export function stepAllyTurnReactive(state: BoardState): BoardState {
  const next = stepAllyTurn(state);
  if (next === state || next.status !== 'playing') return next;
  if (!kingReactsToAllies(next)) return next;
  const allyMoved = next.allyTurnIndex !== state.allyTurnIndex || next.turn !== state.turn;
  if (!allyMoved) return next;
  const reacted = kingReaction(next);
  return reacted ?? next;
}

function kingReaction(state: BoardState): BoardState | null {
  if (state.winCondition !== 'king' || state.kingBehavior !== 'flee') return null;
  // ONE reaction per enemy phase, full stop. stepEnemyTurn calls this after
  // EVERY army action, so at enemiesPerTurn >= 2 — which Endless reaches on its
  // overdrive ramp — he reacted once per guard move and took two steps in one
  // phase. Tyler, 2026-09-09, Endless round 12: "the king moved two times... it
  // was on c7 and the king moved to d8. But the king moved to c8 in between."
  // f92684f added kingMovedThisPhase for the step-AND-capture case and wired it
  // into the capturers pass only; nothing stopped a second REACTION.
  if (state.kingMovedThisPhase === true) return null;
  const answering = (state.tauntTurns ?? 0) > 0;
  // Panic: like a thrown Gauntlet, it is not a threat he has to SEE. A
  // panicking king moves under Smoke too.
  const panicking = (state.panicTurns ?? 0) > 0;
  // Smoke: he can't see the threat, so he does not flee — but a thrown
  // Gauntlet is not a threat he has to see. He answers it blind, and that is
  // the whole signature pair (gauntlet + smoke).
  if (isSmoked(state) && !answering && !panicking) return null;
  // (Hourglass: a glass-turn is an ordinary enemy turn for him. He flees, he
  // steps into snares, he runs from the straw — that IS the card. The old
  // T3 "the king is held" clause deleted the line and was cut 2026-09-06.)
  const king = state.pieces.find((p) => p.type === 'king');
  if (!king) return null;
  const kingSq = toSquare(king);
  if (state.frozenSquares.includes(kingSq)) return null;
  // Gauntlet: an answering king's pen does not hold him, for the flee as well
  // as for the answer step — otherwise a challenge that walked him out of the
  // room would leave him with no legal flee square at all.
  const view: BoardState =
    answering && state.kingPen ? { ...state, kingPen: undefined } : state;
  // Scarecrow: he reads the STRAW's lines as the threat and hers as harmless
  // (the view shares `pieces`, so `king` is the same object inside it).
  const straw = scarecrowViewState(view);
  // The flee always wins: a challenge never makes him walk into danger, and a
  // panic never overrides a step he wanted to take anyway. Panic is LAST — it
  // only ever fires for a king who would otherwise have stood still.
  // He does not run from someone he can simply take. A king who can reach
  // Rookie captures instead of fleeing — the capture is resolved by the
  // ordinary capturers pass, so all this has to do is stand still and let it.
  if (
    !isSmoked(state) &&
    (state.kingStunTurns ?? 0) <= 0 &&
    chebyshev({ file: king.file, rank: king.rank }, state.rookie) <= 1
  ) {
    return null;
  }
  const target =
    (isSmoked(state) ? null : kingFleeMove(king, straw ?? view, aiRng(view))) ??
    kingAnswerMove(king, view, aiRng(view)) ??
    kingPanicMove(king, straw ?? view, aiRng(view));
  if (!target) return null;
  // Once he steps out of the room, the room is gone for the rest of the level.
  const leftPen = !!state.kingPen && !state.kingPen.includes(toSquare(target));
  const fled: BoardState = {
    ...state,
    ...(leftPen ? { kingPen: undefined } : {}),
    // A panic buys exactly ONE step. kingReaction runs again after every guard
    // move, so without this a single throw would walk him across the room.
    ...(panicking ? { panicTurns: 0 } : {}),
    pieces: state.pieces.map((p) =>
      p === king ? { ...p, file: target.file, rank: target.rank } : { ...p },
    ),
    // His old square is a ghost blocker for the rest of this turn, like any
    // other vacated square.
    enemyVacatedSquares: [...(state.enemyVacatedSquares ?? []), kingSq],
    // He has spent his action. The capture pass must not use him again this
    // phase — see BoardState.kingMovedThisPhase.
    kingMovedThisPhase: true,
  };
  // Snare: he cannot see the trap; a flee step onto it holds him there.
  return springSnaresAt(fled, [toSquare(target)]);
}

function slidingMoves(
  piece: EnemyPiece,
  state: BoardState,
  dirs: ReadonlyArray<[number, number]>,
  vacated: ReadonlySet<string> = new Set(),
): Coord[] {
  const out: Coord[] = [];
  for (const [df, dr] of dirs) {
    let f = piece.file + df;
    let r = piece.rank + dr;
    while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
      const c: Coord = { file: f, rank: r };
      if (isHazard(state.hazards, c)) break;
      if (isVacated(vacated, c)) break; // ghost blocker — stop before
      const blocker = enemyAt(state.pieces, c);
      const isRookie = state.rookie.file === f && state.rookie.rank === r;
      const hitsAlly = isAllyAt(state, c);
      if (blocker && blocker !== piece) break; // friendly blocker — stop before
      if (isRookie || hitsAlly) {
        out.push(c);
        break; // capture and stop the ray
      }
      out.push(c);
      f += df;
      r += dr;
    }
  }
  return out;
}

function canCapture(piece: EnemyPiece, state: BoardState): boolean {
  return pieceLegalMoves(piece, state).some(
    (m) => m.file === state.rookie.file && m.rank === state.rookie.rank,
  );
}

/**
 * True when any enemy piece could capture Rookie on its next move.
 * Rookie's "in check" — drives her nervous/alarm sprite on the board.
 * Shield and smoke both make her safe for the turn, so they suppress it.
 */
export function isRookieThreatened(state: BoardState): boolean {
  if (state.status !== 'playing') return false;
  if (state.shieldUp) return false;
  if ((state.smokeTurnsLeft ?? 0) > 0) return false;
  // A frozen piece skips its next action — it can't take her. Nor can a
  // stunned king, who is now a capturer like anyone else: without this the
  // alarm sprite would call check on a king who cannot move.
  const kingStunned = (state.kingStunTurns ?? 0) > 0;
  return state.pieces.some(
    (piece) =>
      !state.frozenSquares.includes(toSquare(piece)) &&
      !(piece.type === 'king' && kingStunned) &&
      canCapture(piece, state),
  );
}

function chebyshev(a: Coord, b: Coord): number {
  return Math.max(Math.abs(a.file - b.file), Math.abs(a.rank - b.rank));
}

/** Pick the single best move for `piece` that gets it closer to Rookie. */
function approachMove(
  piece: EnemyPiece,
  state: BoardState,
  rng: () => number,
): Coord | null {
  let moves = pieceLegalMoves(piece, state);
  if (moves.length === 0) return null;
  // Rookie's Revenge: the king's guards are careful — they never step onto a
  // square Rookie's current form attacks (unless it's a capture). Live runs
  // keep the naive approach (this branch is gated to king levels).
  if (state.winCondition === 'king') {
    const view: BoardState = {
      ...state,
      pieces: state.pieces.filter((p) => p !== piece),
    };
    const fire = new Set(rookieLegalMoves(view).map((m) => coordKey(m)));
    // ...and they never wander INTO the king's pen — that's his room, and a
    // guard standing in it just hands Rookie a key next to him.
    const pen = state.kingPen ? new Set(state.kingPen) : null;
    moves = moves.filter((m) => {
      const capture =
        (state.rookie.file === m.file && state.rookie.rank === m.rank) || isAllyAt(state, m);
      if (capture) return true;
      if (fire.has(coordKey(m))) return false;
      if (pen && pen.has(toSquare(m))) return false;
      return true;
    });
    if (moves.length === 0) return null;
  }
  const cur = chebyshev({ file: piece.file, rank: piece.rank }, state.rookie);
  let bestDist = Infinity;
  for (const m of moves) {
    const d = chebyshev(m, state.rookie);
    if (d < bestDist) bestDist = d;
  }
  // Only move if it gets us strictly closer to Rookie.
  if (bestDist >= cur) return null;
  const tied = moves.filter((m) => chebyshev(m, state.rookie) === bestDist);
  return pickRandom(tied, rng);
}

function coordKey(c: { file: number; rank: number }): string {
  return `${c.file},${c.rank}`;
}

/**
 * When a decoy mark is active, return the "view state" the AI should plan
 * against: the marked piece is removed from `pieces` (it can't act, and isn't
 * a friendly blocker) and `rookie` is moved onto its square (so all existing
 * capture / approach logic naturally treats the mark as the target). Returns
 * null when no decoy is active or the marked piece is already gone.
 */
function decoyViewState(state: BoardState): {
  view: BoardState;
  decoyPiece: EnemyPiece;
} | null {
  if (!state.decoyTarget || state.decoyTurnsLeft <= 0) return null;
  const dt = fromSquare(state.decoyTarget);
  const decoyPiece = state.pieces.find(
    (p) => p.file === dt.file && p.rank === dt.rank,
  );
  if (!decoyPiece) return null;
  return {
    view: {
      ...state,
      rookie: { file: dt.file, rank: dt.rank },
      pieces: state.pieces.filter((p) => p !== decoyPiece),
    },
    decoyPiece,
  };
}

/**
 * Scarecrow view (2026-09-06): while a straw Rookie stands, the court and
 * the king plan against a board where the straw's square IS Rookie (rook-
 * form, or queen-form from T4) and the real Rookie is a HAZARD — a blocker
 * nothing captures, hunts, lands on or slides through. `pieces` is shared,
 * so a mover chosen in the view is the same object in the real state.
 * Returns null when no straw stands.
 */
function scarecrowViewState(state: BoardState): BoardState | null {
  const straw = state.scarecrow;
  if (!straw || straw.turnsLeft <= 0) return null;
  return {
    ...state,
    rookie: fromSquare(straw.square),
    form: straw.form,
    formMovesLeft: 0,
    hazards: [...state.hazards, { file: state.rookie.file, rank: state.rookie.rank }],
  };
}

type EnemyAction = {
  mover: EnemyPiece;
  target: Coord;
  isCapture: boolean;
  isDecoyCapture?: boolean;
  isRabidCapture?: boolean;
  /** The mover struck the straw Rookie (Scarecrow) — no loss, no credit. */
  isScarecrowCapture?: boolean;
};

/** Pick the enemy that will act, and the move they'll make. */
function chooseEnemyAction(
  state: BoardState,
  excludeSquares: ReadonlySet<string> = new Set(),
): EnemyAction | null {
  // Scarecrow first (it outranks a Decoy mark; never ship both in one kit):
  // the whole court plays against the straw view. A "capture of Rookie"
  // there is a strike on the straw. Nothing falls through to the real
  // Rookie — she is a blocker they cannot see as prey.
  const straw = scarecrowViewState(state);
  if (straw) {
    const inner = chooseEnemyActionAgainst(straw, excludeSquares);
    if (!inner) return null;
    if (inner.isCapture) {
      return { mover: inner.mover, target: inner.target, isCapture: false, isScarecrowCapture: true };
    }
    return inner;
  }
  // If a decoy mark is active, run the existing capture/approach logic on a
  // view where the marked piece IS Rookie. Any capture returned is a friendly
  // fire against the decoy, not a loss.
  const decoy = decoyViewState(state);
  if (decoy) {
    const inner = chooseEnemyActionAgainst(decoy.view, excludeSquares);
    if (inner) {
      return {
        mover: inner.mover,
        target: inner.target,
        isCapture: inner.isCapture,
        isDecoyCapture: inner.isCapture,
      };
    }
    // Decoy is active but nobody can usefully act on it — fall through to
    // ordinary Rookie-targeting so the turn isn't a complete waste.
  }
  return chooseEnemyActionAgainst(state, excludeSquares);
}

function chooseEnemyActionAgainst(
  state: BoardState,
  excludeSquares: ReadonlySet<string>,
): EnemyAction | null {
  const rng = aiRng(state);
  // Frozen squares are treated as if those pieces have already moved.
  const frozen = new Set(
    state.frozenSquares
      .map((sq) => {
        const file = sq.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
        const rank = parseInt(sq[1], 10);
        return `${file},${rank}`;
      }),
  );
  const isExcluded = (p: EnemyPiece) =>
    excludeSquares.has(coordKey(p)) || frozen.has(coordKey(p));

  // 0) Rabid pieces act on berserker logic first. They attack the nearest
  // reachable entity (Rookie counts; ties → biggest piece wins). If no
  // capture is reachable they approach the top-priority target instead.
  const rabid = new Set(
    state.rabidSquares.map((sq) => {
      const file = sq.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
      const rank = parseInt(sq[1], 10);
      return `${file},${rank}`;
    }),
  );
  if (rabid.size > 0) {
    const rabidPieces = state.pieces.filter(
      (p) => !isExcluded(p) && rabid.has(coordKey(p)),
    );
    const captures: Array<{
      mover: EnemyPiece;
      target: Coord;
      isCapture: boolean;
      isRabidCapture?: boolean;
      victimValue: number;
    }> = [];
    const approaches: Array<{
      mover: EnemyPiece;
      target: Coord;
      isCapture: boolean;
      approachDist: number;
    }> = [];
    for (const p of rabidPieces) {
      const a = rabidAction(p, state);
      if (!a) continue;
      if (a.kind === 'capture') {
        captures.push({
          mover: p,
          target: a.target,
          isCapture: a.isRookie,
          isRabidCapture: !a.isRookie,
          victimValue: a.victimValue,
        });
      } else {
        approaches.push({
          mover: p,
          target: a.target,
          isCapture: false,
          approachDist: a.approachDist,
        });
      }
    }
    if (captures.length > 0) {
      const bestVal = Math.max(...captures.map((c) => c.victimValue));
      const tied = captures.filter((c) => c.victimValue === bestVal);
      const pick = pickRandom(tied, rng);
      return {
        mover: pick.mover,
        target: pick.target,
        isCapture: pick.isCapture,
        isRabidCapture: pick.isRabidCapture,
      };
    }
    if (approaches.length > 0) {
      const bestDist = Math.min(...approaches.map((a) => a.approachDist));
      const tied = approaches.filter((a) => a.approachDist === bestDist);
      const pick = pickRandom(tied, rng);
      return { mover: pick.mover, target: pick.target, isCapture: pick.isCapture };
    }
    // No rabid piece can usefully act — fall through to normal AI for the
    // non-rabid pieces.
  }

  const isNormallyEligible = (p: EnemyPiece) =>
    !isExcluded(p) && !rabid.has(coordKey(p));
  // 1) Capture priority. Enemies treat allies as equal-priority targets to
  // Rookie — both score by victim value (Rookie = queen-tier). Among ties,
  // the highest-threat attacker takes the shot.
  type Capturer = {
    piece: EnemyPiece;
    target: Coord;
    isRookie: boolean;
    victimValue: number;
    attackerThreat: number;
  };
  const capturers: Capturer[] = [];
  const smoked = isSmoked(state); // Smoke: nobody can see Rookie
  // A stunned king is out of the fight entirely — he cannot take her either,
  // and neither can one who already took his reaction step this phase.
  const kingSpent = (state.kingStunTurns ?? 0) > 0 || state.kingMovedThisPhase === true;
  for (const p of state.pieces) {
    if (!isNormallyEligible(p)) continue;
    if (p.type === 'king' && kingSpent) continue;
    const moves = pieceLegalMoves(p, state);
    let best: { coord: Coord; isRookie: boolean; value: number } | null = null;
    for (const m of moves) {
      const hitsRookie = m.file === state.rookie.file && m.rank === state.rookie.rank;
      if (hitsRookie && smoked) continue;
      const hitAlly = state.allies.find((a) => a.file === m.file && a.rank === m.rank);
      if (!hitsRookie && !hitAlly) continue;
      const value = hitsRookie
        ? PIECE_THREAT.queen
        : hitAlly!.type === 'rook'
          ? 3 // bodyguard rook — a major piece, worth hunting
          : (PIECE_THREAT[hitAlly!.type] ?? 0);
      if (!best || value > best.value) {
        best = { coord: m, isRookie: hitsRookie, value };
      }
    }
    if (best) {
      capturers.push({
        piece: p,
        target: best.coord,
        isRookie: best.isRookie,
        victimValue: best.value,
        attackerThreat: PIECE_THREAT[p.type] ?? 0,
      });
    }
  }
  if (capturers.length > 0) {
    const bestVal = Math.max(...capturers.map((c) => c.victimValue));
    const topVal = capturers.filter((c) => c.victimValue === bestVal);
    const bestThreat = Math.max(...topVal.map((c) => c.attackerThreat));
    const tied = topVal.filter((c) => c.attackerThreat === bestThreat);
    const pick = pickRandom(tied, rng);
    return {
      mover: pick.piece,
      target: pick.target,
      isCapture: pick.isRookie,
    };
  }

  // 2) Movers: pawns advance toward rank 1; others approach Rookie.
  const vacated = vacatedSet(state);
  type Candidate = { mover: EnemyPiece; target: Coord; priority: number };
  const candidates: Candidate[] = [];
  for (const p of state.pieces) {
    if (!isNormallyEligible(p)) continue;
    if (p.type === 'king') {
      // Kings never take the army's action. A 'flee' king reacts for FREE —
      // see kingReaction(), applied around the guard's move in stepEnemyTurn.
      continue;
    }
    if (p.type === 'pawn') {
      const target: Coord = { file: p.file, rank: p.rank + BLACK_FORWARD };
      const intoPen =
        state.winCondition === 'king' &&
        !!state.kingPen &&
        state.kingPen.includes(toSquare(target)) &&
        !state.kingPen.includes(toSquare(p));
      if (
        !intoPen &&
        inBounds(target) &&
        !isHazard(state.hazards, target) &&
        !enemyAt(state.pieces, target) &&
        !isAllyAt(state, target) &&
        !isVacated(vacated, target) &&
        !(state.rookie.file === target.file && state.rookie.rank === target.rank) &&
        applyRoyalAura(p, [target], state).length > 0
      ) {
        // Lower rank = higher priority (closer to rank 1 = bigger threat).
        candidates.push({ mover: p, target, priority: -p.rank });
      }
    } else {
      if (smoked) continue; // Smoke: hunters hold their posts
      const target = approachMove(p, state, rng);
      if (target) {
        // Closer to Rookie = higher priority (negative chebyshev).
        candidates.push({
          mover: p,
          target,
          priority: -chebyshev(target, state.rookie) + 0.5, // non-pawns slightly favored
        });
      }
    }
  }

  if (candidates.length === 0) return null;
  const bestPriority = Math.max(...candidates.map((c) => c.priority));
  const tied = candidates.filter((c) => c.priority === bestPriority);
  const pick = pickRandom(tied, rng);
  return { mover: pick.mover, target: pick.target, isCapture: false };
}

/**
 * Squares this rabid piece can land on AS A CAPTURE this turn. Unlike normal
 * pieceLegalMoves, friendly pieces ARE legal capture targets here (rabies
 * doesn't care about teamwork). Rookie's square is also a capture target.
 * Bishops/queens still stop at the first thing on their ray.
 */
function rabidCaptureSquares(piece: EnemyPiece, state: BoardState): Coord[] {
  const vacated = vacatedSet(state);
  const out: Coord[] = [];
  switch (piece.type) {
    case 'pawn': {
      for (const df of [-1, 1]) {
        const c: Coord = { file: piece.file + df, rank: piece.rank + BLACK_FORWARD };
        if (!inBounds(c)) continue;
        if (isHazard(state.hazards, c)) continue;
        if (isVacated(vacated, c)) continue;
        const isRookie = state.rookie.file === c.file && state.rookie.rank === c.rank;
        const friendly = enemyAt(state.pieces, c);
        if (isRookie || (friendly && friendly !== piece)) out.push(c);
      }
      return out;
    }
    case 'knight': {
      for (const [df, dr] of KNIGHT_DELTAS) {
        const c: Coord = { file: piece.file + df, rank: piece.rank + dr };
        if (!inBounds(c)) continue;
        if (isHazard(state.hazards, c)) continue;
        if (isVacated(vacated, c)) continue;
        const isRookie = state.rookie.file === c.file && state.rookie.rank === c.rank;
        const friendly = enemyAt(state.pieces, c);
        if (isRookie || (friendly && friendly !== piece)) out.push(c);
      }
      return out;
    }
    case 'bishop':
    case 'queen': {
      const dirs = piece.type === 'queen' ? QUEEN_DIRS : BISHOP_DIRS;
      for (const [df, dr] of dirs) {
        let f = piece.file + df;
        let r = piece.rank + dr;
        while (f >= 1 && f <= 8 && r >= 1 && r <= 8) {
          const c: Coord = { file: f, rank: r };
          if (isHazard(state.hazards, c)) break;
          if (isVacated(vacated, c)) break;
          const isRookie = state.rookie.file === f && state.rookie.rank === r;
          const friendly = enemyAt(state.pieces, c);
          if (isRookie || (friendly && friendly !== piece)) {
            out.push(c);
            break;
          }
          f += df;
          r += dr;
        }
      }
      return out;
    }
    case 'king': {
      /**
       * THE KING TAKES WHAT STANDS NEXT TO HIM (Tyler, 2026-09-08: "I do
       * think the king should be able to capture, it will make the game more
       * difficult", and then: "we can't have different rules for the king in
       * different places"). So it is ONE rule, everywhere — daily, ladder,
       * Endless, tutorial: end your turn on a square touching the king and he
       * takes you.
       *
       * Deliberately ROOKIE ONLY, and deliberately captures only — never a
       * free step, never an ally. Two reasons, both structural: the king's
       * movement stays owned by kingReaction (flee / answer / panic), so this
       * cannot make him roam; and because every capture he can make ends the
       * level, he can never both take something here AND take his flee step
       * in the same enemy phase.
       *
       * He is still blind under Smoke (the caller's `smoked` guard), still
       * skipped while frozen (isExcluded) and while stunned (the capturers
       * loop), so nothing that used to make you safe stops working.
       */
      return kingCaptureMoves(piece, state, vacated);
    }
  }
}

/**
 * Pick a rabid piece's action for this turn.
 *
 * Algorithm:
 *   1) Build a target list = Rookie + every other enemy. Rookie counts as the
 *      biggest piece (queen-tier 4).
 *   2) Sort by (Chebyshev distance asc, value desc) — closest pieces first,
 *      biggest piece on distance ties.
 *   3) If any sorted target is in `rabidCaptureSquares`, that's the kill.
 *   4) Otherwise the rabid piece approaches the top-priority target with a
 *      normal (non-capture) move that strictly reduces Chebyshev distance.
 */
type RabidAction =
  | { kind: 'capture'; target: Coord; isRookie: boolean; victimValue: number }
  | { kind: 'approach'; target: Coord; approachDist: number };

function rabidAction(piece: EnemyPiece, state: BoardState): RabidAction | null {
  const piecePos: Coord = { file: piece.file, rank: piece.rank };
  const targets: Array<{ at: Coord; value: number; isRookie: boolean }> = isSmoked(state)
    ? [] // Smoke: even a rabid piece can't see her
    : [{ at: { ...state.rookie }, value: PIECE_THREAT.queen, isRookie: true }];
  for (const p of state.pieces) {
    if (p === piece) continue;
    if (p.type === 'king') continue; // only Rookie may take the king
    targets.push({
      at: { file: p.file, rank: p.rank },
      value: PIECE_THREAT[p.type] ?? 0,
      isRookie: false,
    });
  }
  if (targets.length === 0) return null;
  targets.sort((a, b) => {
    const da = chebyshev(piecePos, a.at);
    const db = chebyshev(piecePos, b.at);
    if (da !== db) return da - db;
    if (a.value !== b.value) return b.value - a.value;
    if (a.at.file !== b.at.file) return a.at.file - b.at.file;
    return a.at.rank - b.at.rank;
  });
  const captureSquares = rabidCaptureSquares(piece, state);
  for (const t of targets) {
    if (
      captureSquares.some((c) => c.file === t.at.file && c.rank === t.at.rank)
    ) {
      return {
        kind: 'capture',
        target: t.at,
        isRookie: t.isRookie,
        victimValue: t.value,
      };
    }
  }
  // No capture — approach the nearest target with a non-capture move.
  const focus = targets[0];
  const moves = pieceLegalMoves(piece, state).filter(
    (m) => !(m.file === state.rookie.file && m.rank === state.rookie.rank),
  );
  if (moves.length === 0) return null;
  const cur = chebyshev(piecePos, focus.at);
  let best: Coord | null = null;
  let bestDist = Infinity;
  for (const m of moves) {
    const d = chebyshev(m, focus.at);
    if (d < bestDist) {
      bestDist = d;
      best = m;
    }
  }
  if (!best || bestDist >= cur) return null;
  return { kind: 'approach', target: best, approachDist: bestDist };
}

/** Pawn promotion pool by level. Levels 1-4 → B/N, levels 5+ → B/N/Q. */
function promotionPool(level: number): PieceType[] {
  return level >= 5 ? ['bishop', 'knight', 'queen'] : ['bishop', 'knight'];
}

/** Apply a single chosen action to the state, returning the new state. */
function applyAction(state: BoardState, action: EnemyAction): BoardState {
  const { mover, target, isCapture, isDecoyCapture, isRabidCapture, isScarecrowCapture } = action;
  const fromSq = toSquare({ file: mover.file, rank: mover.rank });
  const toSq = toSquare(target);

  // Scarecrow struck: the straw is destroyed and the army's action is spent.
  // No capture credited, no stun. T5: the striker dies instead (a Rookie
  // capture, king stunned) and the straw keeps standing.
  if (isScarecrowCapture) {
    const owned = state.abilities.find((a) => a.id === 'scarecrow');
    const kills = !!owned && owned.tier === 5;
    if (kills) {
      const cleared = clearStatusOnSquare(state, fromSq);
      return {
        ...state,
        ...cleared,
        pieces: state.pieces.filter((p) => p !== mover),
        captures: [...state.captures, mover.type],
        tempo: Math.min(tempoMaxFor(state), state.tempo + (TEMPO_REWARD[mover.type] ?? 0)),
        decoyTarget: state.decoyTarget === fromSq ? null : state.decoyTarget,
        ...stunKingAfterCapture(state),
        lastScarecrowStrike: { square: toSq, attackerSquare: fromSq, attackerDied: true, id: Date.now() + Math.random() },
      };
    }
    const relocated = relocateStatusMarkers(state, fromSq, toSq);
    return {
      ...state,
      ...relocated,
      pieces: state.pieces.map((p) =>
        p === mover ? { ...p, file: target.file, rank: target.rank } : { ...p },
      ),
      decoyTarget: state.decoyTarget === fromSq ? toSq : state.decoyTarget,
      scarecrow: undefined,
      lastScarecrowStrike: { square: toSq, attackerSquare: fromSq, attackerDied: false, id: Date.now() + Math.random() },
    };
  }

  // Defensive backstop: if Rookie is in king form and this is a real capture
  // (not friendly fire), refuse to apply the move. The intended guard lives
  // upstream in stepEnemyTurn (impervious bounce) — if we reach here with
  // form='king' and isCapture, something bypassed that guard. Log so we can
  // diagnose, then drop the move so the player doesn't lose unfairly.
  if (isCapture && !isDecoyCapture && state.form === 'king') {
    // eslint-disable-next-line no-console
    console.warn(
      '[king-form] capture reached applyAction while form=king — guard bypassed',
      { mover, target, isRabidCapture, formMovesLeft: state.formMovesLeft },
    );
    return state;
  }

  // Friendly-fire on the decoy: remove the marked piece, mover takes its
  // square, Rookie banks the capture (+ tempo), decoy mark clears. NOT a loss.
  if (isDecoyCapture) {
    const decoyPiece = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    const pieces = state.pieces
      .filter((p) => p !== decoyPiece)
      .map((p) =>
        p === mover ? { ...p, file: target.file, rank: target.rank } : { ...p },
      );
    const capturedType: PieceType | null = decoyPiece?.type ?? null;
    const tempoGain = capturedType ? TEMPO_REWARD[capturedType] ?? 0 : 0;
    const cleared = clearStatusOnSquare(state, toSq);
    const relocated = relocateStatusMarkers({ ...state, ...cleared }, fromSq, toSq);
    return {
      ...state,
      ...cleared,
      ...relocated,
      pieces,
      captures: capturedType
        ? [...state.captures, capturedType]
        : state.captures,
      tempo: Math.min(tempoMaxFor(state), state.tempo + tempoGain),
      decoyTarget: null,
      decoyTurnsLeft: 0,
      ...(capturedType ? stunKingAfterCapture(state, 2) : {}),
      lastEnemyCaptureFx: {
        fromSq,
        toSq,
        pieceType: mover.type,
        victimType: capturedType,
        id: Date.now() + Math.random(),
      },
    };
  }

  // Rabid friendly-fire: same shape as decoy capture but rabies stays on the
  // mover (markers follow), and there's no decoy mark to clear.
  if (isRabidCapture) {
    const victim = state.pieces.find(
      (p) => p.file === target.file && p.rank === target.rank,
    );
    const pieces = state.pieces
      .filter((p) => p !== victim)
      .map((p) =>
        p === mover ? { ...p, file: target.file, rank: target.rank } : { ...p },
      );
    const capturedType: PieceType | null = victim?.type ?? null;
    const tempoGain = capturedType ? TEMPO_REWARD[capturedType] ?? 0 : 0;
    const cleared = clearStatusOnSquare(state, toSq);
    const relocated = relocateStatusMarkers({ ...state, ...cleared }, fromSq, toSq);
    return {
      ...state,
      ...cleared,
      ...relocated,
      pieces,
      captures: capturedType
        ? [...state.captures, capturedType]
        : state.captures,
      tempo: Math.min(tempoMaxFor(state), state.tempo + tempoGain),
      ...(capturedType ? stunKingAfterCapture(state, 2) : {}),
      lastEnemyCaptureFx: {
        fromSq,
        toSq,
        pieceType: mover.type,
        victimType: capturedType,
        id: Date.now() + Math.random(),
      },
    };
  }

  const newPieces = state.pieces.map((p) => {
    if (p !== mover) return { ...p };
    const moved: EnemyPiece = { ...p, file: target.file, rank: target.rank };
    // Pawn promotion: reaches Rookie's home rank.
    if (moved.type === 'pawn' && target.rank === 1) {
      // Seeded (not Math.random): the playtest harness and the app must roll
      // the same piece for the same seed — parity check 2026-08-30.
      const pool = promotionPool(state.level);
      moved.type = pickRandom(pool, mulberry32((aiRng(state)() * 2 ** 32) >>> 0));
    }
    return moved;
  });
  // Rookie capture — game over.
  if (isCapture) {
    return { ...state, pieces: newPieces, status: 'lost' };
  }
  // Ally capture — remove the ally; not a loss.
  const allyHit = state.allies.find(
    (a) => a.file === target.file && a.rank === target.rank,
  );
  if (allyHit) {
    const nextAllies = state.allies.filter((a) => a !== allyHit);
    const relocated = relocateStatusMarkers(state, fromSq, toSq);
    // Allies live in AllyOverlay (not the chessboard's position map), so the
    // destination square has no piece for react-chessboard to "swap" with.
    // Skip lastEnemyCaptureFx here — the natural slide animation is smooth;
    // the overlay-based FX is for enemy-on-enemy captures where the diff
    // would otherwise snap.
    return {
      ...state,
      ...relocated,
      pieces: newPieces,
      allies: nextAllies,
    };
  }
  const relocated = relocateStatusMarkers(state, fromSq, toSq);
  return { ...state, ...relocated, pieces: newPieces };
}

/**
 * Advance the enemy turn by ONE piece. Returns the new state.
 *
 * - If no piece can act, or the budget is spent, sets turn back to 'rookie'
 *   and clears enemyMovedSquares.
 * - If a capture happens, sets status='lost' and turn='rookie'.
 * - Otherwise leaves turn='enemy' so the caller can step again.
 */
export function stepEnemyTurn(rawState: BoardState): BoardState {
  if (rawState.status !== 'playing' || rawState.turn !== 'enemy') return rawState;
  // Rewind (enemy-only): a FRESH enemy phase records the board as Rookie's
  // side left it — the undo target if this phase needs to unhappen.
  const state =
    rawState.enemyMovedSquares.length === 0 ? pushEnemyPhaseSnapshot(rawState) : rawState;
  const budget = Math.max(1, state.enemiesPerTurn ?? 1);
  const exclude = new Set(state.enemyMovedSquares);

  const endTurn = (s: BoardState): BoardState => {
    // Hourglass: a glass-turn is a turn taken OUT OF ROOKIE'S CLOCK. Nothing
    // of hers expires during it — every counter below holds. The ONE exception
    // is poison: a fuse is a bomb going off, not a protection running out, so
    // it burns on a glass-turn (that is the hourglass + poison-dart line).
    const glass = s.glassTurn === true;
    // Decrement freeze counters; drop entries that have run out.
    const nextFrozenTurnsLeft: Record<string, number> = {};
    const nextFrozenSquares: string[] = [];
    for (const sq of s.frozenSquares) {
      const left = (s.frozenTurnsLeft[sq] ?? 1) - (glass ? 0 : 1);
      if (left > 0) {
        nextFrozenSquares.push(sq);
        nextFrozenTurnsLeft[sq] = left;
      }
    }
    // Decoy mark ticks down at end of enemy turn. Clears if it hits 0 or the
    // marked piece is no longer on the board.
    let decoyTarget = s.decoyTarget;
    let decoyTurnsLeft = s.decoyTurnsLeft;
    if (decoyTarget) {
      const dt = fromSquare(decoyTarget);
      const stillThere = s.pieces.some(
        (p) => p.file === dt.file && p.rank === dt.rank,
      );
      decoyTurnsLeft = Math.max(0, decoyTurnsLeft - (glass ? 0 : 1));
      if (!stillThere || decoyTurnsLeft <= 0) {
        decoyTarget = null;
        decoyTurnsLeft = 0;
      }
    }
    // Decrement rabies counters; drop entries that have run out or have lost
    // their piece.
    const nextRabidSquares: string[] = [];
    const nextRabidTurnsLeft: Record<string, number> = {};
    for (const sq of s.rabidSquares) {
      const here = s.pieces.some((p) => toSquare(p) === sq);
      if (!here) continue;
      const left = (s.rabidTurnsLeft[sq] ?? 1) - (glass ? 0 : 1);
      if (left > 0) {
        nextRabidSquares.push(sq);
        nextRabidTurnsLeft[sq] = left;
      }
    }
    // Decrement poison counters; pieces hitting 0 die (counted as a Rookie
    // capture — tempo + share).
    let pieces = s.pieces;
    let captures = s.captures;
    let tempo = s.tempo;
    const nextPoisonedSquares: string[] = [];
    const nextPoisonedTurnsLeft: Record<string, number> = {};
    const poisonDeaths: { square: string; pieceType: PieceType }[] = [];
    for (const sq of s.poisonedSquares) {
      const victim = s.pieces.find((p) => toSquare(p) === sq);
      if (!victim) continue;
      const left = (s.poisonedTurnsLeft[sq] ?? 1) - 1;
      if (left > 0) {
        nextPoisonedSquares.push(sq);
        nextPoisonedTurnsLeft[sq] = left;
        continue;
      }
      pieces = pieces.filter((p) => p !== victim);
      captures = [...captures, victim.type];
      tempo = Math.min(tempoMaxFor(state), tempo + (TEMPO_REWARD[victim.type] ?? 0));
      poisonDeaths.push({ square: sq, pieceType: victim.type });
      // Strip any other markers on the dying square.
      const ri = nextRabidSquares.indexOf(sq);
      if (ri >= 0) {
        nextRabidSquares.splice(ri, 1);
        delete nextRabidTurnsLeft[sq];
      }
      const fi = nextFrozenSquares.indexOf(sq);
      if (fi >= 0) {
        nextFrozenSquares.splice(fi, 1);
        delete nextFrozenTurnsLeft[sq];
      }
    }
    // Become King: formMovesLeft on king form counts enemy turns of
    // invulnerability. Decrement at end of enemy turn, revert to rook when
    // expired. T5 sets formMovesLeft=999 so it effectively lasts forever.
    let nextForm = s.form;
    let nextFormMovesLeft = s.formMovesLeft;
    if (!glass && s.form === 'king' && s.formMovesLeft > 0) {
      nextFormMovesLeft = s.formMovesLeft - 1;
      if (nextFormMovesLeft <= 0) {
        nextForm = 'rook';
        nextFormMovesLeft = 0;
      }
    }
    // Rookie's Revenge: the king's stun ticks down at end of enemy turn; a
    // poison death (credited to Rookie) stuns him for the NEXT enemy turn.
    const kingStunPatch =
      s.winCondition === 'king'
        ? {
            kingStunTurns: poisonDeaths.length > 0
              ? 1
              : glass
                ? (s.kingStunTurns ?? 0)
                : Math.max(0, (s.kingStunTurns ?? 0) - 1),
          }
        : {};
    // Smoke ticks down at end of enemy turn.
    const smokePatch =
      !glass && (s.smokeTurnsLeft ?? 0) > 0 ? { smokeTurnsLeft: s.smokeTurnsLeft! - 1 } : {};
    // Gauntlet: the challenge is answered one enemy phase at a time. Like every
    // other clock of Rookie's it HOLDS through a glass-turn (2026-09-06 rework)
    // — the glass buys the enemy phase, not the expiry.
    const tauntPatch =
      !glass && (s.tauntTurns ?? 0) > 0 ? { tauntTurns: s.tauntTurns! - 1 } : {};
    // Panic covers exactly ONE enemy phase. `kingReaction` already zeroes it
    // when he takes his step; this clears the throw that found him walled in
    // with nowhere legal to go, so a wasted panic never leaks into next turn.
    // Like the taunt it holds through a glass-turn — the glass buys the phase.
    const panicPatch =
      !glass && (s.panicTurns ?? 0) > 0 ? { panicTurns: 0 } : {};
    // Chequer covers exactly ONE enemy phase, and unlike the panic it is NOT
    // spent by his first step — he re-checks after every guard move and the
    // forbidden colour has to still be forbidden. So it is cleared here and
    // only here. Like the taunt it holds through a glass-turn.
    const chequerPatch =
      !glass && (s.chequerTurns ?? 0) > 0 ? { chequerTurns: 0 } : {};
    // Scarecrow: the straw stands one enemy turn fewer; gone at 0.
    const scarecrowPatch = !glass && s.scarecrow
      ? { scarecrow: s.scarecrow.turnsLeft > 1 ? { ...s.scarecrow, turnsLeft: s.scarecrow.turnsLeft - 1 } : undefined }
      : {};
    // Bodyguard / timed summons dissolve when their turns run out; free-move
    // summons (T5 Squire family) get their once-per-turn move back; a piece
    // stolen by Convert this turn wakes from its daze.
    // Hourglass: on a glass-turn a summon does not age, does not get its
    // once-per-turn move back (the glass is not a new Rookie turn) and a piece
    // stolen this turn stays dazed until a REAL Rookie action.
    const nextAllies = !glass && s.allies.some((a) => a.turnsLeft !== undefined || a.movedThisTurn || a.dazed)
      ? s.allies
          .map((a) => {
            const ticked =
              a.turnsLeft === undefined ? a : { ...a, turnsLeft: a.turnsLeft - 1 };
            const woke = ticked.movedThisTurn ? { ...ticked, movedThisTurn: false } : ticked;
            return woke.dazed ? { ...woke, dazed: false } : woke;
          })
          .filter((a) => a.turnsLeft === undefined || a.turnsLeft > 0)
      : s.allies;
    return {
      ...s,
      pieces,
      captures,
      tempo,
      allies: nextAllies,
      ...smokePatch,
      ...tauntPatch,
      ...panicPatch,
      ...chequerPatch,
      ...scarecrowPatch,
      squireMovedThisTurn: glass ? s.squireMovedThisTurn : false,
      glassTurn: undefined,
      // The per-turn glass count survives the glass-turn itself and resets
      // after the enemy phase that follows a real action.
      hourglassCastsThisTurn: glass ? s.hourglassCastsThisTurn : 0,
      turn: 'rookie',
      form: nextForm,
      formMovesLeft: nextFormMovesLeft,
      ...kingStunPatch,
      // The king is re-armed once the turn goes back to Rookie. It CANNOT be
      // cleared at phase start instead: his reaction step never touches
      // enemyMovedSquares, so "nothing has moved yet" is still true on the
      // very step that would capture, and the flag would clear itself.
      kingMovedThisPhase: false,
      enemyMovedSquares: [],
      enemyVacatedSquares: [],
      frozenSquares: nextFrozenSquares,
      frozenTurnsLeft: nextFrozenTurnsLeft,
      decoyTarget,
      decoyTurnsLeft,
      poisonedSquares: nextPoisonedSquares,
      poisonedTurnsLeft: nextPoisonedTurnsLeft,
      rabidSquares: nextRabidSquares,
      rabidTurnsLeft: nextRabidTurnsLeft,
      lastPoisonDeath:
        poisonDeaths.length > 0
          ? { deaths: poisonDeaths, id: Date.now() + Math.random() }
          : s.lastPoisonDeath,
    };
  };

  if (state.enemyMovedSquares.length >= budget) return endTurn(state);

  // Rookie's Revenge: the fleeing king reacts for free before the army acts.
  // Returned as its own step so the UI animates his sidestep on its own.
  const fled = kingReaction(state);
  if (fled) return { ...fled, turn: 'enemy' };

  const action = chooseEnemyAction(state, exclude);
  if (!action) return endTurn(state);

  // Become King impervious: while Rookie is in king form, she cannot be
  // captured. The attacker is bounced back to its origin square (i.e. its
  // move is canceled). Emits its own gold-themed FX signal — distinct from
  // the Aegis blue shield.
  if (
    action.isCapture &&
    !action.isDecoyCapture &&
    state.form === 'king'
  ) {
    const attackerSquare = toSquare({
      file: action.mover.file,
      rank: action.mover.rank,
    });
    const withFx: BoardState = {
      ...state,
      lastImperviousBounce: {
        attackerSquare,
        rookieSquare: toSquare(state.rookie),
        id: Date.now() + Math.random(),
      },
    };
    // Mark this attacker as having "acted" so it isn't re-picked this turn.
    const nextMoved = [...state.enemyMovedSquares, attackerSquare];
    if (nextMoved.length >= budget) return endTurn(withFx);
    return { ...withFx, turn: 'enemy', enemyMovedSquares: nextMoved };
  }

  // Aegis intercept — if Rookie is about to be captured AND she has Aegis
  // charges, fire it instead. Attacker either dies (T5) or is just blocked.
  // (Decoy captures are friendly fire and never trigger Aegis.)
  if (action.isCapture && !action.isDecoyCapture) {
    const blocked = tryAegisIntercept(state, action.mover);
    if (blocked) {
      const aegisOwned = blocked.abilities.find((a) => a.id === 'aegis');
      const attackerSquare = coordKey({ file: action.mover.file, rank: action.mover.rank });
      const withFx: BoardState = {
        ...blocked,
        lastAegisIntercept: {
          attackerSquare,
          rookieSquare: toSquare(blocked.rookie),
          id: Date.now() + Math.random(),
        },
      };
      // Non-T5: shield is consumed by this hit. End the turn so the remaining
      // budget can't slip a second capturer past a now-dropped shield.
      if (!aegisOwned || aegisOwned.tier !== 5) return endTurn(withFx);
      // T5: shield stays up forever — keep ticking the budget. Mark this
      // attacker as having "acted" (it actually vanished) so we don't re-pick it.
      const nextMoved = [...state.enemyMovedSquares, attackerSquare];
      if (nextMoved.length >= budget) return endTurn(withFx);
      return { ...withFx, turn: 'enemy', enemyMovedSquares: nextMoved };
    }
  }

  const originSquare = toSquare({ file: action.mover.file, rank: action.mover.rank });
  let after = applyAction(state, action);
  if (after.status === 'lost') return endTurn(after);
  // Snare: the mover just ARRIVED somewhere — if that square is trapped, the
  // trap springs now (held, or bitten at T4+), before the king reads the board.
  after = springSnaresAt(after, [toSquare(action.target)]);

  const nextMoved = [...state.enemyMovedSquares, coordKey(action.target)];
  const nextVacated = [...(after.enemyVacatedSquares ?? []), originSquare];
  after = { ...after, enemyMovedSquares: nextMoved, enemyVacatedSquares: nextVacated };
  // Rookie's Revenge: did that guard just open a line on the king? He
  // sidesteps at once (free) — no "waiting behind a guard" cheese.
  const reacted = kingReaction(after);
  if (reacted) after = reacted;
  if (nextMoved.length >= budget) return endTurn(after);
  return { ...after, turn: 'enemy' };
}

/**
 * Back-compat: bulk-run the entire enemy turn (used by tests or one-shot).
 * Prefer `stepEnemyTurn` from the UI so each move animates.
 */
export function runEnemyTurn(state: BoardState): BoardState {
  let cur = state;
  // Safety: cap at enemiesPerTurn iterations.
  const cap = Math.max(1, state.enemiesPerTurn ?? 1);
  for (let i = 0; i <= cap; i++) {
    if (cur.turn !== 'enemy' || cur.status !== 'playing') break;
    cur = stepEnemyTurn(cur);
  }
  return cur;
}

export { enemyAt };

/**
 * Returns the enemies that will act on the NEXT enemy turn (up to budget),
 * in order. Used to telegraph threats with a wiggle.
 */
export function nextEnemyMovers(state: BoardState): EnemyPiece[] {
  const budget = Math.max(1, state.enemiesPerTurn ?? 1);
  const remaining = budget - state.enemyMovedSquares.length;
  if (remaining <= 0) return [];

  let cur: BoardState = { ...state, turn: 'enemy' };
  const movers: EnemyPiece[] = [];

  for (let i = 0; i < remaining; i++) {
    const exclude = new Set(cur.enemyMovedSquares);
    const action = chooseEnemyAction(cur, exclude);
    if (!action) break;
    movers.push(action.mover);
    const originSquare = toSquare({ file: action.mover.file, rank: action.mover.rank });
    const after = springSnaresAt(applyAction(cur, action), [toSquare(action.target)]);
    if (after.status === 'lost') break;
    cur = {
      ...after,
      enemyMovedSquares: [...cur.enemyMovedSquares, coordKey(action.target)],
      enemyVacatedSquares: [...(cur.enemyVacatedSquares ?? []), originSquare],
    };
  }
  return movers;
}

/** Back-compat single-mover (returns first upcoming mover or null). */
export function nextEnemyMover(state: BoardState): EnemyPiece | null {
  return nextEnemyMovers(state)[0] ?? null;
}
