/**
 * revenge-38 — THE PINCH. Built 2026-09-07 for the signature pair
 * GAUNTLET + SMOKE ("he only comes out when he cannot see you").
 * Kit = gauntlet / smoke / magnet / aegis (`allowedAbilities` IS the kit).
 * GAUNTLET is a NEW ability, added in this commit at the TESTING stage, so
 * this run is /playtest-only — expected, and it is why nothing here is
 * approved or marked live.
 *
 * THE VERB: LURE. Not crossing a wall (The Moat), not baiting hunters (The
 * Alley), not a poison timer (The Switchback), not blowing a hole (The
 * Briar), not caging with his own guard (The Alcove), not a double door (The
 * Millstone), not a two-rook net (The Parapet), not buying a body time (The
 * Lattice), not moving the wall (The Quarry), not an undo (The Dogleg), not a
 * capture you do not survive (The Picket), not swapping him onto a post (The
 * Squint), not making him run the WRONG way (The Hayloft), not stopping the
 * running (The Turnstile). Every one of those answers the same question —
 * HOW DO I GET IN. This run is the first whose answer is that you never do.
 * You make him come out.
 *
 * ---------------------------------------------------------------------------
 * WHY A NEW CARD. Every confidence-4 archetype left unbuilt in
 * data/run-playtest/pair-hypotheses.json is a re-tread of a shipped run:
 * sacrifice+vanguard and duchess+sacrifice are the Briar's blast,
 * boulder+freeze-ray / boulder+coup / knight-hop+snare are cage-and-take for
 * the seventh time, duchess+rewind and dragon+rewind are the Dogleg's undo,
 * duchess+smoke is the Lattice, duchess+freeze-ray is the Glasshouse,
 * magnet+queen-pulse is the Perch (which did not gate). The archetype list is
 * exhausted, which is the condition `.claude/run-level-design.md` names for
 * building a card instead. GAUNTLET is a verb no card in the catalogue has:
 * every other card that touches the king takes a square away from him
 * (Boulder, Snare), holds him (Freeze Ray), shoves him one square (Coup, T5
 * Magnet) or lies to him about where Rookie is (Scarecrow, Decoy). This one
 * changes what he WANTS.
 *
 * THE CARD, in full (lib/run/abilities.ts `applyGauntlet` /
 * `tauntTurnsForTier`, lib/run/pawn-ai.ts `kingAnswerMove`):
 *   - A free instant with NO target. For 2 enemy phases at T1 (3/3/4/5 by
 *     tier) the king ANSWERS: at the top of the enemy turn, instead of
 *     standing still, he takes one step that STRICTLY closes the Chebyshev
 *     distance to Rookie.
 *   - HIS PEN DOES NOT HOLD AN ANSWERING KING, and the first step out of it
 *     drops `kingPen` for the rest of the level. That is the card's cost, and
 *     it is why the card is not a win button: the room you could never enter
 *     was also the room that kept him cornerable, and an open-board king is
 *     the hardest thing in this game for a lone rook to catch (The Vault L5,
 *     The Parapet and The Hayloft all measured a rook failing at a 2x2).
 *   - HE IS PROUD, NOT SUICIDAL. He refuses any square Rookie's CURRENT form
 *     attacks, exactly as a flee does. So a rook sitting on the line he must
 *     cross simply closes it, and he stands there while the challenge burns.
 *   - HE STILL FLEES. The flee reaction is checked first and always wins; the
 *     answer is what he does when he is NOT in danger.
 *
 * AND THAT REFUSAL IS A SIGHT CHECK, which is where the pair lives. SMOKE
 * removes Rookie from the court's view entirely (`isSmoked`) — hunters hold,
 * and the king does not flee. Before this card that second clause was purely
 * defensive: he stands still, she walks. Here it is the opposite, because an
 * answering king is not reacting to a threat he must see — he is answering a
 * challenge. Under smoke there is nothing for the refusal to read, so HE
 * WALKS STRAIGHT ONTO HER LINE. One rook, one rank, and he steps onto it
 * himself.
 *
 *   gauntlet alone — he comes as far as the last square she does not attack
 *                    and stops. Step onto his line to punish it and he flees,
 *                    now with no pen at all, across open floor.
 *   smoke alone    — he never moves, and the room is sealed. Nothing happens.
 *   the pair       — throw the challenge, drop the cover on the turn he
 *                    arrives, take him on the rank he walked onto.
 *
 * ---------------------------------------------------------------------------
 * CONSTANT SIGNATURE — THE PINCH. Every level his quarter is a corner room
 * closed off by an L of stone, and the wall has exactly one flaw: a place
 * where an open square inside touches an open square outside ONLY AT A
 * CORNER. Not a band across rank 5 (The Moat), not pillars (The Colonnade),
 * not a sealed strongbox (The Vault), not offset bars (The Switchback), not
 * a hedge (The Briar), not a glass box (The Glasshouse), not shafts through
 * stone (The Stacks), not a corner-to-corner diagonal (The Slash), not a
 * walled alley (The Alley), not a lattice (The Lattice), not a doorstep
 * alcove (The Alcove), not a quarry face (The Quarry), not a burrow with
 * bolt-holes (The Warren), not a door with a post (The Turnstile). It is a
 * WALL WITH A CORNER IN IT, and the whole run is one fact about that corner:
 *
 *     NO RANK, NO FILE AND NO ROOK EVER CROSSES A CORNER TOUCH. A KING DOES.
 *
 * So on L7-L10 the only piece on the board that can pass the flaw in the wall
 * is the king himself, and he has no reason to. The pair gives him one.
 *
 * The canonical build (L7, L9; mirrored and doubled later): his quarter is
 * f7 g7 h7 f8 g8 h8, the wall is e7 e8 f6 g6 h6, and the pinch is e6 <-> f7.
 * Every orthogonal neighbour of the quarter is stone, so no rook line on the
 * board touches any square he owns; f7's only non-quarter neighbours are e7,
 * e8 and g6 (all stone) and e6 (open floor), so the two regions meet at one
 * point. Rookie waits on RANK 6 west of the pinch — where she can see e6 and
 * he cannot be seen — and the pinch square is on her rank the instant he
 * steps onto it.
 *
 * THE ARC
 *   L1-L2  the wall has a real GATE (e8 open). Walk in. No card needed.
 *   L3     the gate moves to rank 7 and he RUNS, in a room of three squares a
 *          rook can still close. The last free level.
 *   L4     the gate is PLUGGED by a bishop frozen in stone and defended off
 *          the board's reach — MAGNET pulls the plug down the file and takes
 *          it on open ground.
 *   L5     the gate is open and the sill beyond it is a DEFENDED pawn — take
 *          it anyway and eat the reply: AEGIS.
 *   L6     the gate is open and a queen watches it: every square of the way
 *          in is covered, and she cannot be taken. Walk it unseen: SMOKE,
 *          which also teaches the second clause — he does not run while she
 *          is smoked, so a room a rook cannot normally close, closes.
 *   L7-L10 the gate is gone. There is only the pinch, and only he can cross
 *          it.
 *
 * KEY / TRAP by level (the kit is gauntlet / smoke / magnet / aegis):
 *   L1  none — the gate is open and he stands still.
 *   L2  none — the gate is open and his room is two squares in a row.
 *   L3  none — three squares on a rank, and a rook on rank 7 closes them.
 *   L4  MAGNET is the key. Aegis is a trap (the plug is defended twice).
 *       Gauntlet and smoke do nothing: the plug is not his, and he is not
 *       going anywhere while it stands.
 *   L5  AEGIS is the key. Magnet is a trap (the sill has no line to pull
 *       along that does not put her under the defender).
 *   L6  SMOKE is the key. Gauntlet is a TRAP and an instructive one: lure him
 *       through the gate here and the queen simply takes her when she follows.
 *   L7  THE PAIR. Gauntlet, then smoke.
 *   L8  THE PAIR, ORDER REVERSED. Smoke first.
 *   L9  MAGNET BECOMES A KEY AGAIN, in front of the pair.
 *   L10 THE PAIR, AND THE CHOICE OF DOOR.
 *
 * ---------------------------------------------------------------------------
 * THE FOUR FINALE LINES — each demands a DIFFERENT use of the same two cards
 * (`.claude/run-level-design.md`, "One line, four times"). Written before the
 * levels were built:
 *
 *   L7  THE SLOW WALK — TAUNT FIRST, COVER LAST. He starts on g7, two steps
 *       from the pinch. Throw the challenge on move one and walk onto rank 6;
 *       he takes the first step (g7 -> f7) in the open, because f7 is not on
 *       her rank. Then, and only then, the smoke: T1 cover is ONE enemy
 *       phase, and it has to be the phase in which he steps onto e6. Cast it
 *       early and it is gone before he arrives; cast it late and the
 *       challenge has expired. The order is taunt, walk, cover, take.
 *
 *   L8  THE STANDING START — COVER FIRST, TAUNT SECOND. He starts ON the
 *       pinch's inside square, one step from the floor, and the square he
 *       steps onto is on her FILE, which she must already be standing on to
 *       have a shot at all. So the L7 order LOSES: throw the challenge while
 *       she is visible and he refuses the only step he has, stands still, and
 *       two enemy phases later the one charge is spent for nothing. Smoke
 *       first (or both on the same turn), then the challenge.
 *
 *   L9  THE PLUG, AND STEPPING OUT OF YOUR OWN DOORWAY. His own pawn stands
 *       on e6 — the one square of floor the pinch opens onto — with e5 stone
 *       under it so it can never march away. An answering king with nowhere
 *       to step is a king standing still, so the pair is dead until the pawn
 *       is gone; and the obvious way to remove it, taking it from rank 6,
 *       leaves ROOKIE standing in the doorway, which shuts it just as
 *       thoroughly. The line is take the plug, step back along rank 6 off
 *       e6, and only then throw the challenge. Nine moves for a five-move
 *       line, which is what makes the order findable.
 *
 *   L10 THE SHELF — THE COVER HAS TO PAY FOR THE TRAVEL TOO. c5, d5 and e5
 *       are stone, a shelf under the approach, so no file west of f reaches
 *       rank 6 from below and the only way onto the killing rank is around
 *       the end of the shelf. The queen on a6 owns that rank, so the walk in
 *       and the wait are both under her. One cover, one challenge, four
 *       moves and two enemies a turn: the cover cannot be spent on the
 *       arrival AND on his last step unless the arrival IS his last step.
 *
 * ===========================================================================
 * MEASURED — 2026-09-07. `revenge.ts matrix --run=revenge-38
 * --difficulty=normal --trials=32 --jobs=1` (serial, numbers of record).
 * The kit is the four columns; the pair is gauntlet+smoke.
 *
 *      L    none  gauntlet  smoke  magnet  aegis | gauntlet+smoke
 *      7      0%      6%      0%     0%     0%   |     72%   PASS
 *      8      0%      0%      0%     0%     0%   |     78%   PASS
 *      9      0%     13%      0%     0%     0%   |     66%   singles MISS
 *     10      0%     13%      0%     0%     0%   |     88%   MISS (both)
 *
 * THE VERDICT: THE GATE IS MET ON L7 AND L8 AND MISSED ON L9 AND L10.
 * L7 and L8 are exactly the contract — every single card in the kit at or
 * under 8%, no-ability 0%, the pair inside the 60-80% band. L9 and L10 both
 * read the CHALLENGE ALONE at 13%, five points over the bar (32 trials carry
 * ~8pp of binomial noise, so 13% is not distinguishable from 8% — but 13% is
 * the number that was measured and it is the number reported). L10's pair is
 * 88%, eight points over the band. `pipeline.ts add` only; this run is NOT
 * marked built and is not on the playtest page.
 *
 * THE MID-RUN LADDER, 16 trials, jobs=3:
 *
 *      L    none  gauntlet  smoke  magnet  aegis
 *      1    100%    100%    100%    100%   100%
 *      2    100%    100%    100%    100%   100%
 *      3    100%    100%    100%    100%   100%
 *      4      0%     63%      0%      0%     0%
 *      5     88%    100%     88%     94%    94%
 *      6      0%     19%     75%      0%     0%
 *
 * L1-L3 are free, as designed. L6 is the SMOKE level and reads exactly that
 * (none 0%, smoke 75%, everything else 0-19%) — the one mid-run lock that
 * landed on its intended card. L4 locks (none 0%) but on the WRONG card: it
 * was authored as the magnet puzzle and magnet reads 0% while the challenge
 * reads 63%, so it is in practice the run's gauntlet-teaching level and the
 * header's KEY/TRAP map is wrong about it. L5 does not lock at all (88% bare).
 * So the intended L4-magnet / L5-aegis pair of single-card puzzles is really
 * one gauntlet level and one free level, and MAGNET AND AEGIS ARE PURE TRAPS
 * IN THIS KIT — 0% on every level of the run except the two that are free
 * anyway. That is a clean result for the gate and a bad one for the ladder.
 *
 * TIER. `abilityTierCaps: { magnet: 4 }` is authored on the rule, not on a
 * measurement: T5 Magnet is the one tier in this kit that can move the KING,
 * which is the signature card's own verb, and a run whose whole premise is
 * that only he can cross the pinch must not hand out a second way to move
 * him. The finale singles were NOT swept tier by tier (the budget went on the
 * four finale rebuilds), so the caps for gauntlet and smoke are UNMEASURED
 * and unset. That is the first thing to do to this run: gauntlet's ladder is
 * pure duration (2/3/3/4/5 answering turns) and smoke's T3 is a second cover,
 * and by the catalogue's own pattern — "the break is almost always the tier
 * that grants a SECOND USE" — smoke:3 is the likely break here, because a
 * second cover is a second attempt at the one phase that has to be right.
 *
 * ===========================================================================
 * DEAD ENDS
 *
 * 1. THE FIRST BUILD HAD NO CLOCK AND THE CHALLENGE SOLO'D EVERYTHING —
 *    92/100/92/100 on L7-L10 with gauntlet alone, against 0% for no-ability
 *    and 0% for every other card. The card was working exactly as designed
 *    (he came out) and the LEVELS were wrong: the L of stone that seals his
 *    quarter is also a corner to pin a king against, so a lone rook chased
 *    the lured king into the run's own wall. Cutting L7's clock from 8 moves
 *    to 5 took the solo from 92% to 17% on its own. A lure card's levels are
 *    priced in MOVES, not in geometry.
 *
 * 2. THE REAL FIX WAS NOT THE CLOCK, IT WAS DELETING THE SECOND LINE. The
 *    challenge alone beats a level whenever Rookie can stand OFF the killing
 *    line, let him step out unrefused, and then capture the pinch square in
 *    ONE move. So the pinch square must be attackable from exactly one line,
 *    and reaching that line must cost a move — which is what `e5` stone does
 *    (it kills the e-FILE, leaving only rank 6) and what the queen on a6 does
 *    (she owns rank 6, so Rookie cannot sit there unsmoked). e5 stone alone
 *    took L7 from 13% to 6%; the queen alone took L8 from 100% to 0%. Both
 *    together are the recipe, and L9 and L10 miss the bar because neither of
 *    them has both: L9 has the shelf but no watcher, L10 has the watcher but
 *    a longer approach.
 *
 * 3. L10 v1 — TWO DOORS. The quarter grew h6 and a second pinch at g5 <-> h6,
 *    with f5, g4, h5 stone so that no rank and no file in the level ever
 *    attacked g5: the "wrong door" was meant to be a door out of the level.
 *    It measured 34% for the challenge ALONE (serial, 32 trials) and 94% for
 *    the pair. The south door was not the trap it was drawn as — it was the
 *    SOLO's route, because a king who comes out at g5 walks on into open
 *    floor at f4/h4 where one rook does corner him. Sealing f4 and h4 turned
 *    g5 into a dead-end alcove and dropped the solo to 25%, still over the
 *    bar. The two-door idea is not dead, but it needs the second door to open
 *    somewhere a rook cannot work, and "unattackable" is not that place.
 *
 * 4. ADDING A HUNTER MADE THE SOLO BETTER, NOT WORSE. A second knight on
 *    L10 v1 took the challenge alone from 25% to 69%. Enemies are captures,
 *    captures are stuns, and a stun is a free turn for a rook chasing a king
 *    across open floor. On a lure level, extra bodies help the chase.
 *
 * 5. THE L5 SILL WILL NOT LOCK. Two builds — a pawn on f7 defended by the
 *    pawn on g8, then a pawn frozen in the gate at e7 defended by the knight
 *    on c6 with c7 and e6 stone to refuse both the pull and the march — read
 *    100% and 88% with NO ABILITY. His pen on that level is three squares on
 *    rank 8 and a rook closes it whatever is standing in the doorway, because
 *    she does not have to come through the doorway at all: rank 7 is open
 *    west of the sill and the pen is reachable from f7. A sill only locks a
 *    level whose room cannot be closed once you are past it.
 *
 * 6. NOT TRIED, AND IT IS THE OBVIOUS NEXT MOVE: making the WATCHER the
 *    signature instead of the wall. Every version of this run that gates does
 *    so because a queen owns the one line, and the pinch only supplies the
 *    0% no-ability floor. A run built the other way round — the king in the
 *    open, one line to him, and a watcher on it — might gate on the same pair
 *    without any stone at all.
 */

import {
  make,
  pawn,
  knight,
  bishop,
  queen,
  king,
  X,
  FLEE,
  STILL,
  type RunDef,
} from '../../run-kit';

/**
 * THE WALL. The L of stone that closes the top-right quarter: file e at ranks
 * 7 and 8, rank 6 under files f, g and h. Every orthogonal neighbour of the
 * quarter, and nothing else.
 */
const WALL = [X(5, 7), X(5, 8), X(6, 6), X(7, 6), X(8, 6)];

/** The quarter itself — his room on every sealed level. */
const QUARTER = ['f7', 'g7', 'h7', 'f8', 'g8', 'h8'];

/**
 * L8's mirror: the same L, reflected onto the top-LEFT corner. His quarter is
 * a7 b7 c7 a8 b8 c8, the wall is d7 d8 a6 b6 c6, and the pinch is d6 <-> c7.
 * Rank 6 west of the pinch is the wall itself, so the RANK cannot hold the
 * door here — the d-file is the only line in the level that ever attacks it.
 */
const WALL_W = [X(4, 7), X(4, 8), X(1, 6), X(2, 6), X(3, 6)];
const QUARTER_W = ['a7', 'b7', 'c7', 'a8', 'b8', 'c8'];

/** L1-L2: the same wall with the rank-8 gate still open. */
const GATE_8 = [X(5, 7), X(6, 6), X(7, 6), X(8, 6)];

/** L3-L6: the gate moves to rank 7 (e8 stone, e7 open). */
const GATE_7 = [X(5, 8), X(6, 6), X(7, 6), X(8, 6)];

const RUN_REVENGE_38: RunDef = {
  id: 'revenge-38',
  name: 'The Pinch',
  blurb:
    'A wall with a corner in it. No rook ever crosses a corner — a king does. Stop trying to get in.',
  allowedAbilities: ['gauntlet', 'smoke', 'magnet', 'aegis'],
  // See the TIER block in MEASURED at the bottom of this file.
  abilityTierCaps: { magnet: 4 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE GATE. The silhouette, for nothing: the wall is already there,
    // but e8 is missing, so rank 8 runs from the open floor straight into his
    // corner and he does not move.
    make(1, [king(8, 8), pawn(3, 3)], {
      ...STILL,
      moveLimit: 12,
      hazards: [...GATE_8],
    }),
    // L2 — THE RUNNER. Same gate, and now he runs — but his room is two
    // squares in a ROW, and one rook on rank 8 sees both at once. The last
    // level that asks nothing at all.
    make(2, [king(8, 8), knight(4, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: [...GATE_8],
      kingPen: ['g8', 'h8'],
    }),
    // L3 — THE GATE MOVES. e8 is stone now and e7 is the way in, so she comes
    // along rank 7 instead of rank 8 and his room is three squares on rank 8.
    // A rook on h7 takes the corner off him, a rook on h8 takes the rest: the
    // room closes in two moves, with no card.
    make(3, [king(8, 8), knight(3, 3), pawn(4, 4)], {
      ...FLEE,
      moveLimit: 12,
      hazards: [...GATE_7],
      kingPen: ['f8', 'g8', 'h8'],
    }),
    // L4 — THE PLUG. A bishop stands in the gate at e7 with every diagonal of
    // its own buried in stone (d6, f6, f8 stone; d8 is its own pawn, and d7 is
    // stone so that pawn can never march off the defence). It never moves and
    // it is defended twice — the pawn on d8 and the knight on c6 — so taking
    // it where it stands costs her the level even through a shield.
    // MAGNET is the key: stand on the e-file, drag the plug down onto open
    // floor, take it there, walk in through the empty gate.
    make(4, [king(8, 8), bishop(5, 7), pawn(4, 8), knight(3, 6)], {
      ...FLEE,
      moveLimit: 14,
      hazards: [...GATE_7, X(6, 8), X(4, 6), X(4, 7)],
      kingPen: ['g8', 'h8', 'g7', 'h7'],
    }),
    // L5 — THE SILL. INTENDED as the AEGIS level: a pawn frozen in the gate
    // at e7 (e6 stone under it so it can never march, c7 stone so nothing can
    // be pulled past it) defended by the knight on c6, to be taken anyway and
    // the reply eaten. IT DOES NOT LOCK — 88% with no ability at all. See
    // DEAD ENDS; this is the run's weakest level and it is why L1-L5 read as
    // four free levels and a hard one rather than a ladder.
    make(5, [king(8, 8), pawn(5, 7), knight(3, 6), knight(4, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: [...GATE_7, X(6, 8), X(5, 6), X(3, 7)],
      kingPen: ['g8', 'h8', 'h7'],
    }),
    // L6 — THE WATCHER. The gate is open, the sill is clear, and a queen on b7
    // owns the whole of rank 7 — every square of the way in, including the
    // gate. She cannot be taken (the pawn on b8 defends her) and she cannot be
    // dodged. Go through unseen: SMOKE. And the cover teaches its second
    // clause on the way, because his room is a 2x2 that a lone rook can never
    // close and a smoked Rookie does not have to: he never steps at all.
    // GAUNTLET is the trap here — lure him through the gate and rank 7 is
    // exactly where he walks, which is exactly where the queen is looking.
    make(6, [king(8, 8), queen(2, 7), pawn(2, 8)], {
      ...FLEE,
      moveLimit: 12,
      hazards: [...GATE_7, X(6, 8)],
      kingPen: ['g8', 'h8', 'g7', 'h7'],
    }),
    // ---- L7-L10: THE PINCH. e7 and e8 are stone. Nothing crosses. --------
    // L7 — THE SLOW WALK. He starts on g7, two steps from the floor. Throw the
    // challenge, walk onto rank 6 west of the pinch, and let him come: g7 ->
    // f7 is a step she does not attack, so he takes it in plain sight. The
    // second step is the one onto her rank, and he will not take THAT one
    // while he can see her. One enemy phase of cover, spent on the right
    // phase, and he walks onto rank 6 himself.
    make(7, [king(7, 7), queen(1, 6), pawn(1, 7), knight(6, 3)], {
      ...FLEE,
      moveLimit: 4,
      hazards: [...WALL, X(5, 5)],
      kingPen: QUARTER,
    }),
    // L8 — THE STANDING START. He is already on f7, one step from the floor,
    // and the pinch square e6 is on the d-file's neighbour — she has to hold
    // the E-FILE from below to have a shot, which means she is standing on the
    // line he must step onto before the challenge is ever thrown. Do it in the
    // L7 order and he refuses the only step he has and burns the charge
    // standing still. Cover first, challenge second. Two hunters a turn and
    // six moves, so there is no time to throw it twice even if she could.
    make(8, [king(2, 8), queen(4, 1), pawn(3, 2), knight(7, 6)], {
      ...FLEE,
      moveLimit: 6,
      enemiesPerTurn: 2,
      hazards: [...WALL_W],
      kingPen: QUARTER_W,
    }),
    // L9 — THE PLUG, AGAIN, AND ON THE OUTSIDE. His own pawn stands on e6 —
    // the one square of floor the pinch opens onto — so the door is shut from
    // her side and an answering king has nowhere to step. The pair is dead
    // until the pawn is gone, and it cannot simply be taken: the knight on c5
    // covers e6 and the pawn on e6 is a pawn, so it marches into her the
    // moment she stands on the e-file below it. MAGNET pulls it west along
    // rank 6, off the knight's square, where a rook takes it for free. Then,
    // and only then, L7's line.
    make(9, [king(7, 7), pawn(5, 6), knight(3, 4), knight(7, 3)], {
      ...FLEE,
      moveLimit: 9,
      hazards: [...WALL, X(5, 5)],
      kingPen: QUARTER,
    }),
    // L10 — THE SHELF. One door again, and the hardest version of L7's line.
    // c5, d5 and e5 are stone: a shelf under the whole approach, so the c-,
    // d- and e-files all stop at rank 4 and the only way onto rank 6 is round
    // the end of it. The queen on a6 owns that rank from the corner, so the
    // travel and the wait are both under her — and with four moves and two
    // enemies a turn there is exactly one cover to spend on both. It is spent
    // correctly only when the arrival on the rank IS the phase he steps onto
    // it. (v1 of this level had a second pinch on the south face, g5 <-> h6.
    // It measured 34% for the challenge ALONE — see DEAD ENDS.)
    make(10, [king(7, 8), queen(1, 6), pawn(1, 7), knight(3, 3)], {
      ...FLEE,
      moveLimit: 4,
      enemiesPerTurn: 2,
      hazards: [X(5, 7), X(5, 8), X(6, 6), X(7, 6), X(8, 6), X(5, 5), X(4, 5), X(3, 5)],
      kingPen: QUARTER,
    }),
  ],
};

export { RUN_REVENGE_38 };
export default RUN_REVENGE_38;
