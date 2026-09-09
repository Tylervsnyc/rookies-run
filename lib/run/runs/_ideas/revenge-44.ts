/**
 * revenge-44 — THE EMBRASURE. Built 2026-09-08 for the signature pair
 * BECOME KING + QUEEN PULSE. Kit = become-king / queen-pulse / magnet / decoy
 * (`allowedAbilities` IS the kit). All four cards are LIVE.
 *
 * CONCEPT (A): an unbuilt pair the discovery harness has already proved can
 * gate — `become-king+queen-pulse` gates a generated L8 at 60% with a UNIQUE
 * answer under a kit where every single card reads 0%
 * (data/run-playtest/combo-library/SYNERGY.md). It is the only entry in that
 * table whose two halves are BOTH transforms, and neither half has this home:
 * Become King has been half of exactly two pairs (both with Boulder — The
 * Alcove, The Keep) and QUEEN PULSE of exactly one (queen-pulse + smoke, The
 * Turnstile), where its job was to arrive on a line no rook can walk.
 *
 * THE VERB: STAND ON THE SQUARE THAT KILLS YOU. Not crossing a wall (The
 * Moat), not baiting hunters (The Alley), not a poison timer (The Switchback),
 * not blowing a hole (The Briar), not caging with his own guard (The Alcove),
 * not a double door (The Millstone), not a two-rook net (The Parapet), not
 * buying a body time (The Lattice), not moving the wall (The Quarry), not an
 * undo (The Dogleg), not a suicide capture (The Picket), not a lure (The
 * Pinch), not zugzwang (The Niche), not halving his compass (The Inlay), not
 * a body in a hole (The Loophole). Every one of those argues about the KING —
 * where he is, where he can go, what he wants, or what stands next to him.
 * This run argues about ROOKIE: there is exactly one square on the board from
 * which he can be hit, she cannot live on it, and the answer is to go and
 * live on it anyway, wearing the one form nothing can take — and then to stop
 * wearing it, because a king cannot shoot.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS PAIR, read out of lib/run/abilities.ts (applyTransform,
 * transformDurationForTier, maxUsesForTier), lib/run/engine.ts
 * (applyRookieMove) and lib/run/pawn-ai.ts (kingFleeMove, the impervious
 * bounce in stepEnemyTurn):
 *
 *   1. A TURN IS [casts…] THEN [one move]. Every cast is free, but the move
 *      ends the turn, so a transform ALWAYS decides the shape of the move you
 *      are about to make. Cast Become King and this turn's move is a king
 *      step — one square. That single fact is what makes the pair a
 *      two-turn line and not a one-turn trick, and it is why the run is
 *      built around a LAUNCH square and a FIRING square that touch.
 *   2. BECOME KING T1 is one use and `transformDurationForTier` 1 — and its
 *      counter is decremented at the end of the ENEMY turn, not by her own
 *      move (engine.ts: `isKingProtective`). So the crown covers exactly one
 *      enemy phase and she is a rook again on her next turn. She cannot both
 *      survive on a square and still be a king on it. Every "just walk in and
 *      take him" line in this run dies on that sentence.
 *   3. While she is in king form the court's captures are BOUNCED (the
 *      impervious bounce). Nothing else in the kit survives a covered square:
 *      Aegis is not in this kit precisely because one shield would.
 *   4. `kingFleeMove` reads `rookieLegalMoves(state)` — HER CURRENT FORM. A
 *      king two squares away attacks nothing of his, so a Rookie wearing the
 *      crown is HARMLESS and he does not take a step. The disguise is the
 *      other half of the card's value here, and it is why L9 and L10 work at
 *      all.
 *   5. QUEEN PULSE T1 is one use, one MOVE of queen geometry, and the move is
 *      the capture. She is a rook again the instant it lands, which is
 *      exactly why it can never be spent on travel and still finish.
 *   6. `fastScore` in the playtest bot skips its pawn (-20) and knight (-18)
 *      proximity penalties entirely `if (state.form !== 'king')`. So a
 *      watched square the bot refuses to walk onto as a rook is one it will
 *      happily step onto wearing the crown. This run's firing squares are
 *      watched by PAWNS on purpose: the eval fences them off from every line
 *      except the one the pair opens.
 *
 * ---------------------------------------------------------------------------
 * CONSTANT SIGNATURE — THE EMBRASURE. An embrasure is the splayed slot cut
 * through a fortress wall: the masonry is thick, the opening is narrow, and
 * it is angled, so there is exactly ONE position from which the shot inside
 * can be taken. Every level of this run draws the same three things:
 *
 *   1. THE WALL. His corner is sealed on his RANK and his FILE by stone (g8
 *      and h7 for the h8 corner), two squares thick behind (e8, f7), so no
 *      rook line, no bishop line of the wall's own colour and no pawn ever
 *      reaches him along a straight road. The wall is what makes his room a
 *      room.
 *   2. THE SLIT. Exactly one DIAGONAL is left open into his square, and it is
 *      stopped a square or two out (f6 or e5 is stone), so the set of squares
 *      with a line on him is one or two squares long and never more. That set
 *      is the whole level: everything else on the board is approach.
 *   3. THE FIRING STEP. Of the one or two squares in the slit, exactly one is
 *      usable, and the run's whole difficulty is what is wrong with it: either
 *      a pawn watches it from a square nothing of hers can reach (so a rook
 *      standing there is taken before she moves again), or NO ROOK LINE ON THE
 *      BOARD LANDS ON IT (so a rook can never stand there at all). The first
 *      kind wants the crown as a shield, the second as a ticket, and the
 *      finale is two of each.
 *
 * Not water on rank 5 (The Moat), not pillars (The Colonnade), not a sealed
 * box (The Vault / The Glasshouse), not offset bars (The Switchback), not a
 * pawn hedge (The Briar), not shafts through a mass (The Stacks / The
 * Loophole), not a stone diagonal (The Slash), not a walled alley (The
 * Alley), not a lattice (The Lattice), not a doorstep alcove (The Alcove):
 * a THICK WALL WITH ONE ANGLED SLOT, and a firing position his court owns.
 *
 * ---------------------------------------------------------------------------
 * KEY / TRAP per level (the kit is become-king / queen-pulse / magnet / decoy):
 *   L1  none needed — the wall has a doorway on g8; walk up the shaft.
 *   L2  none needed — the doorway moves to h7 and he RUNS; a rook on h7 owns
 *       g7 along rank 7, so he has nowhere to step. The silhouette, for free.
 *   L3  QUEEN PULSE, alone. The wall is finished: no rook line will ever
 *       touch h8 again. The slit is long and open (g7-f6-e5-d4-c3…) and every
 *       square on it is safe. Get on the diagonal, become a queen, slide.
 *       This is the level that teaches what the slit IS.
 *   L4  MAGNET (become-king is a slower second answer). The shaft is back and
 *       an immovable bishop corks it on g7, defended by the unreachable pawn
 *       on f8. Take the cork in place and the pawn collects. Drag it DOWN the
 *       file and take it where nothing answers.
 *   L5  DECOY (magnet and become-king also clear it; measured, and said so in
 *       the MEASURED block rather than pretended away). The same cork, and now
 *       a knight behind the wall on e6 is the one piece in the court that can
 *       jump to f8. Mark the defender and his own knight eats it.
 *   L6  BECOME KING, alone, and it is HALF THE FINALE. h7 is a pocket: g6,
 *       g7, g8 and h6 are stone, so the only way onto it is a DIAGONAL STEP
 *       from g6 — and a jammed, unreachable pawn on g8 watches it. A queen
 *       reaches h7 and dies there. Wear the crown, step in, eat the bounce,
 *       and take him up the file as a rook. The lesson: the crown does not
 *       take him, it BUYS THE SQUARE.
 *   L7-L10 the pair. The pocket of L6 is moved INTO the slit, onto a square
 *       from which a rook has no line at all — so the crown still buys the
 *       square and the pulse has to be what fires. Four levels, four different
 *       jobs for the two cards; see THE FOUR FINALE DECISIONS below.
 *
 * MAGNET and DECOY are the two trap fillers and they are traps for one
 * reason each: magnet only ever pulls along ROOKIE'S OWN ROOK LINES, and the
 * finale's slit is a diagonal that no rook line of hers crosses; decoy only
 * ever works if a teammate can REACH the mark, and the f8 / g8 watcher pawns
 * of the finale stand in a walled square nothing in the court can enter. Both
 * are keys once each in the middle of the run, which is what a filler is for.
 * Neither is a universal solvent. `bishop-step`, `knight-hop` and
 * `become-king` are the three solvents and the third is HALF THE PAIR, which
 * is the only case the kit rules allow.
 *
 * ---------------------------------------------------------------------------
 * THE FOUR FINALE DECISIONS ("One line, four times",
 * .claude/run-level-design.md 2026-09-06). Same two cards on all four; what
 * changes is the JOB each card is doing. The pair can never be worn at once —
 * `applyTransform` overwrites `form`, so casting the second transform throws
 * the first away — which is what makes "which card, in which order, for which
 * job" the only question the finale ever asks.
 *
 *   L7  THE FIRING STEP — the crown is a SHIELD. The slit is two deep (g7 and
 *       f6 open, e5 stone) and g6/h6 are stone, so g7 can only be entered from
 *       f6 and the firing step is f6, two squares out. A pawn on e7 watches
 *       it, sealed into its square on every line in the game (d6, d7, d8, e6,
 *       e8, f7, f8 stone), so a rook that stands on f6 is taken before she
 *       moves again. From f6 her king form attacks nothing of his, so he does
 *       not step and `fastScore` pays nothing for being there: this is the
 *       base line, and it is already a level the eval will not hand over.
 *       Launch from f5 or g5, step onto f6, eat the bounce, shoot past g7.
 *   L8  WHICH JOB — the crown is a SHIELD *and* a TICKET, and there is a
 *       second job on offer that loses. f5 is stone now, so no rook line lands
 *       on f6 either; and the watcher is REACHABLE this time (d6, d7, d8 are
 *       open ground) with the bishop on c5 defending it through d6. Spend the
 *       crown taking the watcher and she is a rook on e7 when it lapses, with
 *       the bishop's reply waiting and no rook move from e7 to f6 in the game.
 *       Spend it on the step and the shot is there. Two enemies a turn.
 *   L9  THE WAY IN — the crown is not a shield at all, it is a TICKET, and
 *       nothing on this board is threatening the firing step. f5, e6, g6 and
 *       f7 are stone, so NO ROOK LINE ON THE BOARD LANDS ON f6: the only way
 *       onto it is a diagonal step from g5 or e7, and e5 is stone so the slit
 *       cannot be entered from behind. A queen can make that same step — and
 *       arrives with her one pulse spent and nothing left to fire with. Crown
 *       first because it is the only thing that can WALK there, pulse second
 *       because it is the only thing that can SHOOT from there.
 *   L10 THE ORDER REVERSED — the PULSE is the travel and the CROWN is the
 *       kill. f8 joins the wall and g6/h6 are stone, so g7 — the one square
 *       with a line on him — is reachable by no rook line in the game, and a
 *       jammed pawn stands ON it, corking the slit and biting f6 so she cannot
 *       even wait on the square below. Nothing else on the board can touch
 *       that pawn. So from e5 a queen slides up the slit and STOPS on g7 by
 *       capturing the cork — the one queen move in the run that is not the
 *       kill — and she is a rook again on a square nothing in the court can
 *       reach. Then one diagonal king step takes him. A player who has decided
 *       the crown means "I am about to be captured" has to unlearn it on the
 *       last level of the run.
 *
 * ===========================================================================
 * MEASURED — 2026-09-08, difficulty=normal, `revenge.ts matrix`. The finale
 * row is the NUMBERS OF RECORD: 32 trials, `--jobs=1`, serial, 136s.
 *
 * THE GATE (L7-L10, kit cards at T1, the run's own four-card kit):
 *
 *   L    none  become-king  queen-pulse  magnet  decoy | become-king+queen-pulse
 *   L7     0%           0%           0%      0%     0% |                     72%
 *   L8     0%           0%           0%      0%     0% |                     78%
 *   L9     0%           0%           0%      0%     0% |                     84%
 *   L10    0%           0%           0%      0%     0% |                     81%
 *
 * ***THE GATE IS MET.*** No-ability 0% and every single card in the kit 0% on
 * all four finales — twenty cells of zero, nothing that is a rounding call —
 * against a contract of 8%. The pair reads 72-84%, mean 78.75%. L7 and L8 sit
 * inside the 60-80% band Tyler asked for after the Lattice and the Alcove came
 * in at 100%; L9 (84%) and L10 (81%) are one and four points ABOVE the ceiling
 * and that is reported as measured, not rounded down. Both are the levels
 * whose firing step is SAFE — where the crown is a ticket rather than a
 * shield, the line has no way to go wrong except by being found late, and the
 * clock is not a lever there: L9 read 84% at eight moves and 84% at six, L10
 * read 81% at eight, at seven, at six and at five. Whether to spend more
 * geometry buying four points is Tyler's call; the honest reading is that this
 * finale is harder than the Lattice's was and not yet as hard as the band.
 *
 * THE TIER LADDER (L7-L10, 32 trials, one card pinned at a time):
 *
 *   become-king:1    0 /  0 /  0 /  0     <- shipped tier (capped)
 *   become-king:2    0 /  0 / 81 /  0
 *   become-king:3   94 / 91 /100 /100
 *   become-king:5  100 / 81 /100 /100
 *   queen-pulse:1    0 /  0 /  0 /  0     <- shipped tier (capped)
 *   queen-pulse:2    0 /  9 / 91 / 94
 *   queen-pulse:3   97 / 91 /100 /100
 *   queen-pulse:5  100 / 97 /100 /100
 *   magnet:5         0 /  0 /  0 /  0     <- no cap needed
 *   decoy:5          0 /  0 /  0 /  0     <- no cap needed
 *
 * BOTH signature cards break at their FIRST upgrade, and the reason is one
 * sentence: the pair's line is two turns long, and every tier above T1 hands
 * one of the two cards a SECOND USE or a SECOND TURN — which is exactly the
 * turn the partner was being bought for. `maxUsesForTier` gives Become King
 * 1/2/2/3/3 uses and `transformDurationForTier` 1/1/2/2/3 enemy turns; Queen
 * Pulse 1/1/2/2/1 uses and 1/2/2/3/999 moves. At become-king T2 she crowns
 * twice and walks the slit; at queen-pulse T2 she is a queen for two moves and
 * the shot no longer needs a square to be bought. So
 * `abilityTierCaps: { become-king: 1, queen-pulse: 1 }` and T1 is the only cap
 * the numbers allow for either card. Note WHICH level breaks first for both:
 * L9, the one whose firing step is safe. Where the crown is only a ticket, a
 * second use simply walks the rest of the way. `tier-cap-audit.ts` passes
 * (544000 slates, 1454000 options, 0 violations; both cards still offered as a
 * NEW pick 2000x each, never above the cap).
 *
 * THE LADDER (L1-L6, 16 trials):
 *
 *   L    none  become-king  queen-pulse  magnet  decoy
 *   L1   100%         100%         100%    100%   100%   free
 *   L2   100%         100%         100%    100%   100%   free
 *   L3     0%           0%         100%      0%     0%   queen-pulse, ALONE
 *   L4     0%         100%           0%    100%   100%   magnet / the cork
 *   L5     0%         100%           0%    100%   100%   decoy / the chain
 *   L6     0%         100%           0%      0%     0%   become-king, ALONE
 *
 * L1-L2 are winnable with nothing and nothing else is. L3 and L6 are the two
 * clean single-card puzzles in the run and they are the two halves of the
 * finale taught separately: L3 is "the slit is a diagonal, and only a queen
 * walks a diagonal" (queen-pulse 100%, everything else 0%), L6 is "the crown
 * does not take him, it buys the square" (become-king 100%, everything else
 * 0%). The honest miss in this table is L5: it was written as the DECOY level
 * and magnet and become-king clear it too, so L4 and L5 are a two-answer pair
 * rather than two single-card puzzles. Both are 0% with no ability, which is
 * the part of the contract that matters, and decoy is a real key on both.
 *
 * FULL RUNS (`revenge.ts runs --runs=40`, normal, final build with the caps):
 *   random picks                   5/40 = 12.5% full clears
 *   pool=become-king,queen-pulse  16/40 = 40%   full clears
 *
 * The random number is LOW for this catalogue and the per-level breakdown says
 * why with no mystery in it: L3 is the run's first gate and it is gated on
 * queen-pulse specifically, and across those 40 runs the bot's offer heuristic
 * took magnet 56 times and decoy 48 against queen-pulse 18 and become-king 22.
 * Twenty-one of the forty runs died on L3 with fail mode `move-limit` 21/21 —
 * a player with no answer wandering, not a clock that is short (a
 * queen-pulse-holding bot clears L3 100% at the same limit). Everyone who got
 * past it cleared L4-L6 100%. With the pair in hand the ladder is L7 68, L8 70,
 * L9 89, L10 94, and the finale's dead-end fail mode (13, 8, 2, 1) is the
 * shape the contract asks for: the run ends where the pair is needed, not
 * where the clock is.
 *
 * ===========================================================================
 * DEAD ENDS (what was measured and thrown away)
 *
 * 1. A POINT-BLANK FIRING STEP CANNOT BE TUNED INTO THE BAND. THE FIRST FIVE
 *    BUILDS OF L7 PUT THE SLIT ONE SQUARE LONG — g7, adjacent to him, watched
 *    by the f8 pawn, launched from g6 — and every one of them read 88-100% for
 *    the pair with all four singles at 0%. The gate was never the problem; the
 *    DIFFICULTY was, and nothing moved it: the clock (5, 6, 7, 8 moves: 100,
 *    100, 100, 94), a second enemy per turn (100), two hunting knights (100 at
 *    every clock), a roaming queen (94), a bishop parked on the launch
 *    square's diagonal (88-100). The reason is structural and worth keeping:
 *    on a point-blank line ROOKIE IS EXPOSED FOR EXACTLY ONE ENEMY PHASE — the
 *    one she spends on the launch square — and `fastScore` scores the crowned
 *    step onto g7 at 21 + 25 (chebyshev 1, plus "attacks the king"), the
 *    highest number on the board. A hunter cannot be aimed at the launch
 *    square in advance because hunters CHASE: the traces show the guard
 *    leaving f5 to come at her on g1 and arriving back one tempo late, every
 *    game. So the eval hands the bot the plan and the court is never in
 *    position to punish it. The lever that DOES work is to move the firing
 *    step out to chebyshev 2, where the crowned step scores 18 and no attack
 *    bonus, or to make it rook-unreachable — both of the families this finale
 *    ships. A cheb-1 firing square belongs in the middle of a run (it is L6
 *    here, at 100% for Become King alone), not in a finale.
 *
 * 2. NEVER LET A PAWN WATCH THE SQUARE SHE MUST LAUNCH FROM. The first L8 put
 *    a cork pawn on the firing step f6 so the crowned step would be a CAPTURE,
 *    and the level read 0% for the pair at every clock from 6 to 10 with the
 *    geometry provably sound. `fastScore` subtracts 20 when an enemy pawn sits
 *    one diagonal step above Rookie, and the launch square g5 is exactly one
 *    diagonal step below f6: g5 scored 15 - 20 = -5 against 12 for shuffling
 *    on rank 4, so the bot never once stood there. This is The Loophole's
 *    finding (DEAD END 3, revenge-43) with the sign made explicit: the
 *    penalty is skipped entirely `if (state.form !== 'king')`, so a pawn may
 *    watch a square she only ever ENTERS crowned — every watcher in this
 *    finale is such a pawn — but it must never sit diagonally above a square
 *    she has to stand on as a rook. That one rule decided every piece
 *    placement in the run.
 *
 * 3. A DEAD-END SQUARE EATS THE PULSE. Two builds kept a pawn on f8 as the
 *    watcher's defender, and f8 has no legal moves at all (e8, f7, g8 stone).
 *    The traces are identical and comic: the bot crowns, steps onto e7 to take
 *    the watcher, then spends its one Queen Pulse capturing the f8 pawn — a
 *    +25 "closer to the king" move — and stands there with an empty move list
 *    until the clock runs out. Level read 0%. f8 is stone in every finale here
 *    now. Any square whose legal-move list can become empty is a trap the
 *    search will walk into, and it is not the kind of difficulty anyone wants.
 *
 * 4. THE CLOCK IS NOT A LEVER ON A FOUR-MOVE LINE, AND IT LIES WHEN YOU PUSH
 *    IT. L7 read 31% at eight moves, 38% at nine and 13% at ten in one sweep
 *    of the same build — non-monotone, which is the tell that the search and
 *    not the budget is deciding the number. L9 reads 84% at eight moves and
 *    84% at six; L10 reads 81% at eight, seven, six and five. This run's
 *    numbers were moved by GEOMETRY every single time — which squares are
 *    stone, what watches what, whether the watcher can be taken — and by the
 *    clock never once. The Lattice said the same thing about its own finale in
 *    2026-09-07; this is the second run to measure it, and it now has a
 *    mechanism: when the winning line is four moves long, slack is not what the
 *    player is short of.
 *
 * 5. THE TWO CARDS CANNOT BE WORN AT ONCE, WHICH KILLED A FIFTH FINALE IDEA.
 *    "Pulse to travel somewhere no rook reaches, crown to survive the phase"
 *    is not a legal line: `applyTransform` writes `form` and `formMovesLeft`
 *    outright, so the second cast throws the first away. That is why the
 *    order is the whole content of L10 and why every other level's order is
 *    forced — and it is the reason this pair produces four different
 *    questions instead of one restated four times.
 */

import {
  FLEE,
  STILL,
  X,
  bishop,
  king,
  knight,
  make,
  pawn,
  queen,
  type RunDef,
} from '../../run-kit';
import type { Coord } from '../../types';

/** 'f4' -> {file:6, rank:4}. Authoring convenience only. */
const sq = (name: string): Coord => X(name.charCodeAt(0) - 96, Number(name.slice(1)));

/** Stone, by name. */
const S = (...names: string[]): Coord[] => names.map(sq);

/** His cell, and the flight square the slit occupies. */
const CELL = ['h8', 'g7'];

export const RUN_REVENGE_44: RunDef = {
  id: 'revenge-44',
  name: 'The Embrasure',
  blurb:
    'The wall around him is thick and there is one angled slot through it. Exactly one square in the world can take the shot, and his court owns that square. Go and stand on it anyway.',
  allowedAbilities: ['become-king', 'queen-pulse', 'magnet', 'decoy'],
  // Measured L7-L10, 32 trials. Both signature cards break their own gate at
  // the FIRST upgrade and for the same reason: the pair's line is two turns
  // long and every tier above T1 hands one of the cards a SECOND turn or a
  // SECOND use, which is exactly the turn the partner was being bought for.
  //   become-king  T1  0 /  0 /  0 /  0     T2  0 /  0 / 81 /  0
  //                T3 94 / 91 /100 /100     T5 100 / 81 /100 /100
  //   queen-pulse  T1  0 /  0 /  0 /  0     T2  0 /  9 / 91 / 94
  //                T3 97 / 91 /100 /100     T5 100 / 97 /100 /100
  // magnet:5 and decoy:5 are 0/0/0/0, so those two need no cap. L9 is the
  // level that breaks first for both cards, and it is the one whose firing
  // step is SAFE: where the crown is only a ticket, a second use simply walks
  // the rest of the way. T1 is the only cap the numbers allow for either.
  abilityTierCaps: { 'become-king': 1, 'queen-pulse': 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE DOORWAY. The wall is already here — e8, f7, f6, h7 — and one
    // stone of it is missing: g8. The g-file is a shaft from her rank to his
    // doorstep. He stands still. The silhouette, for free.
    make(1, [king(8, 8), pawn(3, 4), pawn(5, 3)], {
      ...STILL,
      moveLimit: 12,
      hazards: S('e8', 'f7', 'f6', 'h7'),
    }),
    // L2 — THE DOORWAY MOVES. g8 is bricked and h7 is open instead, so the
    // road is the h-file. He runs now, but a rook standing on h7 owns g7
    // along rank 7 (f7 is stone, so her line stops exactly on his flight
    // square) and he has nowhere to go. Still free, and it teaches the shape
    // of his room: two squares, one of them the slit.
    make(2, [king(8, 8), bishop(2, 2), pawn(4, 5)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S('e8', 'f7', 'f6', 'g8'),
      kingPen: CELL,
    }),
    // L3 — THE LONG SHOT (queen-pulse KEY). The wall is finished: g8 AND h7.
    // From here to the end of the run no rook line in the game touches h8.
    // What is left is the slit — g7, f6, e5, d4, c3, b2, a1 — wide open and
    // completely safe, with the f8 pawn watching only its mouth. Stand
    // anywhere on that diagonal, become a queen for one move, and slide.
    make(3, [king(8, 8), pawn(6, 8), knight(2, 6), pawn(8, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S('e8', 'f7', 'g8', 'h7'),
      kingPen: CELL,
    }),
    // L4 — THE CORK (magnet KEY). g8 is a doorway again, so there is a road
    // up the g-file — and a bishop sits in it on g7, jammed solid (f6, h6
    // stone; f8 its own pawn; h8 its own king), defended by that pawn on f8,
    // which stands in a square with no line to it from anywhere on the board
    // (e8 and f7 stone above and below, g8 is her own road). Take the cork
    // where it stands and the pawn collects. Drag it down the shaft and take
    // it on the floor, where nothing answers.
    make(4, [king(8, 8), bishop(7, 7), pawn(6, 8), knight(3, 3)], {
      ...FLEE,
      moveLimit: 11,
      hazards: S('e8', 'f7', 'f6', 'h6', 'h7'),
      kingPen: ['h8'],
    }),
    // L5 — THE CHAIN (decoy / magnet / become-king; none 0%). The same cork in
    // the same doorway, and now a knight on e6 stands behind the wall — it
    // covers g5 and g7, so a pulled cork lands defended, and it is the one
    // piece in the court that can JUMP to f8. Mark the pawn and his own knight
    // eats the defender; then the cork is free. Measured, magnet still clears
    // this at 100% (the knight does not cover every square the pull can reach),
    // so this is a two-answer level and the header says so rather than
    // pretending otherwise.
    make(5, [king(8, 8), bishop(7, 7), pawn(6, 8), knight(5, 6), pawn(2, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S('e8', 'f7', 'f6', 'h6', 'h7'),
      kingPen: ['h8'],
    }),
    // L6 — THE POCKET (become-king KEY, ALONE — and it is half the finale).
    // g7 and h6 are stone, so h7 is a POCKET: no rank and no file reaches it,
    // and the only way in is a DIAGONAL STEP from g6. A jammed pawn on g8
    // watches it — g7 is stone under it so it can never march, and nothing of
    // hers can ever reach it (f8 stone beside it, g7 stone below). So a queen
    // makes the same step and is eaten before she can use it, and only the
    // crown survives the phase. Then she is a rook on h7, which is the one
    // square in the level with a file on him. The crown does not take him; it
    // BUYS THE SQUARE. Measured 0% for every other card in the kit and for no
    // ability, 100% for Become King: the cleanest single-card puzzle here.
    make(6, [king(8, 8), pawn(7, 8), bishop(3, 3), pawn(5, 4)], {
      ...FLEE,
      moveLimit: 11,
      hazards: S('e8', 'f8', 'f7', 'g7', 'h6'),
      kingPen: ['h8'],
    }),
    // ── THE FINALE ──────────────────────────────────────────────────────────
    // L7 — THE FIRING STEP. The crown is a SHIELD, the pulse is the SHOT.
    // The slit is two deep (g7 and f6 open, e5 stone) and g6/h6 are stone, so
    // g7 can only be entered from f6 — the near square is out of the game and
    // the firing step is f6, two squares out. A pawn on e7 watches f6, and
    // that pawn is sealed into its square on every line in the game — d6, d7,
    // d8, e6, e8, f7 and f8 are all stone, so it can never march and nothing
    // of hers can ever reach it. A rook that stands on f6 is taken before she
    // moves again. From f6 her king form
    // attacks nothing of his, so he does not take a step and `fastScore` pays
    // nothing for standing there. Launch from f5 or g5, wear the crown, step
    // onto f6, eat the bounce, and shoot past g7.
    make(7, [king(8, 8), pawn(5, 7), knight(3, 4), pawn(7, 2), bishop(2, 2)], {
      ...FLEE,
      moveLimit: 10,
      hazards: S('d6', 'd7', 'd8', 'e5', 'e6', 'e8', 'f7', 'f8', 'g6', 'g8', 'h6', 'h7'),
      kingPen: CELL,
    }),
    // L8 — WHICH JOB. The slot is the same and the watcher is the same pawn on
    // e7, but two things change and they change the QUESTION. First, f5 is
    // stone, so no rook line on the board lands on f6 either: the crown is now
    // the ticket AND the shield, one step from g5, and there is no rook
    // version of the move to be tempted by. Second, the watcher is REACHABLE —
    // d6, d7 and d8 are open ground, so a rook can walk rank 7 and a king can
    // step onto e7 from d8 or d6 — and the bishop on c5 defends it through d6.
    // So the crown has two jobs on offer and only one of them wins: spend it
    // taking the watcher and she is a rook on e7 when the crown lapses, with
    // the bishop's reply waiting and no rook move from e7 to f6 in the game.
    // Spend it on the step and the shot is there. Two enemies a turn, six
    // moves.
    make(8, [king(8, 8), pawn(5, 7), bishop(3, 5), bishop(2, 1), pawn(4, 3)], {
      ...FLEE,
      moveLimit: 6,
      enemiesPerTurn: 2,
      hazards: S('e5', 'e6', 'e8', 'f5', 'f7', 'f8', 'g6', 'g8', 'h6', 'h7'),
      kingPen: CELL,
    }),
    // L9 — THE WAY IN. Nothing on this board is threatening the firing step at
    // all; the crown is not a shield here, it is a TICKET. f5, e6, g6 and f7
    // are stone, so no rook line on the board lands on f6 — the only way onto
    // it is a diagonal step from g5 or e7, and e5 is stone so the slit cannot
    // be entered from behind. A queen can make that same step, and arrives
    // with her one pulse spent and nothing left to fire with. Crown first
    // because it is the only thing that can WALK there; pulse second because
    // it is the only thing that can SHOOT from there.
    make(9, [king(8, 8), knight(3, 3), bishop(2, 6), pawn(8, 4), pawn(4, 2)], {
      ...FLEE,
      moveLimit: 7,
      enemiesPerTurn: 2,
      hazards: S('e5', 'e6', 'e8', 'f5', 'f7', 'f8', 'g6', 'g8', 'h7'),
      kingPen: CELL,
    }),
    // L10 — THE ORDER REVERSED. The last level takes the two cards away from
    // the jobs the first three taught. f8 joins the wall and g6/h6 are stone,
    // so g7 — the one square with a line on him — is reachable by NO rook line
    // in the game, and a jammed pawn stands on it, corking the slit and biting
    // f6 so she cannot even stand on the square below it. Nothing else on the
    // board can touch that pawn. So the PULSE is the travel: from e5 a queen
    // slides up the slit and STOPS on g7 by capturing the cork — the one queen
    // move in the run that is not the kill — and she is a rook again on a
    // square nothing in the court can reach. Then the CROWN is the kill: one
    // diagonal king step onto him. Pulse first, crown second, and neither card
    // is doing the job it did on L7. (The two can never be worn at once: a
    // second transform overwrites the first, so the order is the whole level.)
    make(10, [king(8, 8), pawn(7, 7), knight(3, 4), bishop(3, 1), pawn(7, 3), pawn(4, 6)], {
      ...FLEE,
      moveLimit: 5,
      enemiesPerTurn: 2,
      hazards: S('e8', 'f7', 'f8', 'g8', 'h7', 'g6', 'h6'),
      kingPen: CELL,
    }),
  ],
};

export default RUN_REVENGE_44;
