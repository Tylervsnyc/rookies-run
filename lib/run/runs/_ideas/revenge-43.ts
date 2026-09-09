/**
 * revenge-43 — THE LOOPHOLE. Built 2026-09-08 for the signature pair
 * DRAGON + FREEZE RAY. Kit = dragon / freeze-ray / magnet / aegis
 * (`allowedAbilities` IS the kit). All four cards are LIVE, so this run is
 * promotable as it stands.
 *
 * CONCEPT (A): an unbuilt pair the discovery harness has already proved can
 * gate — `dragon+freeze-ray` gates two generated levels at up to 97% under
 * kits where every single card reads 0%
 * (data/run-playtest/combo-library/dragon+freeze-ray/) — and the last entry
 * left on the 2026-09-05 unbuilt priority list that is neither a re-tread of a
 * shipped archetype (duchess+rewind IS The Dogleg's undo; convert+twin has
 * been played against ten surviving kits and gated none) nor half knight-hop /
 * half swap.
 *
 * THE VERB: PUT A BODY IN A HOLE NOTHING CAN WALK TO, AND BUY THE ONE ENEMY
 * PHASE IT HAS TO LIVE THROUGH. Not crossing a wall (The Moat), not baiting
 * hunters (The Alley), not a poison timer (The Switchback), not blowing a hole
 * (The Briar), not caging with his own guard (The Alcove), not a double door
 * (The Millstone), not a two-rook net (The Parapet), not buying a body time
 * (The Lattice), not moving the wall (The Quarry), not an undo (The Dogleg),
 * not a suicide capture (The Picket), not swapping him onto a post (The
 * Squint), not making him run the WRONG way (The Hayloft), not stopping the
 * running (The Turnstile), not a lure (The Pinch), not zugzwang (The Niche),
 * not halving his compass (The Inlay).
 *
 * Every one of those either delivers a body ONTO him or argues about where he
 * goes. This one is about a SQUARE — one free square buried inside a stone
 * mass, which nothing in the game can walk to, slide to or see, and which is a
 * knight's move from his throne. The Dragon is the only body in the kit that
 * can be in it. The Freeze is how she survives being there.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS PAIR, read out of lib/run/abilities.ts and lib/run/pawn-ai.ts:
 *
 *  - DRAGON T1 is one charge, TWO TURNS of life, and she is born in Rookie's
 *    own 8-neighbourhood (`summonSpawnSquares` — the range-3 drop is T5 only).
 *    She is NOT a parachute: she appears on the floor beside Rookie and has to
 *    fly. Two turns is two body-moves. There is no third.
 *  - She moves as queen PLUS knight — the only thing in this kit that can
 *    enter a square whose eight neighbours are stone. No ray reaches it, and a
 *    knight's jump does not care what it passes over.
 *  - FREEZE RAY needs no line at all. `isVisibleEnemy` is literally "there is
 *    a piece on that square", so the card reaches any enemy anywhere on the
 *    board. On the KING it holds `freezeTurns(tier) + 1` = TWO enemy phases at
 *    T1; on anyone else, exactly one. A frozen piece skips its action
 *    (pawn-ai.ts:557); a frozen king does not react at all (`kingReaction`,
 *    pawn-ai.ts:476).
 *  - `kingFleeMove` fires on `controlledThreatensSquare`: the instant the
 *    Dragon lands on a square that attacks him he sidesteps, for free, off the
 *    army's action budget. That sidestep is this run's whole defence, and it
 *    costs the Dragon her second and last move.
 *
 * So: the Dragon buys a square nothing else can occupy, and the Freeze buys
 * the single enemy phase between arriving and striking. Alone, a Dragon that
 * arrives and a king who steps once is a Dragon that dies of old age; alone, a
 * Freeze on a king no line in the level touches is a card spent on a statue.
 *
 * ---------------------------------------------------------------------------
 * CONSTANT SIGNATURE — THE MASS, THE CELL, THE HOLE, THE STEP. Four parts on
 * all ten levels. No other run has this silhouette (the catalogue is bands,
 * columns, boxes he sits inside, roofs, shafts, diagonals, rings, burrows, a
 * tower with a stair, a hearth, a quarry face, a rail, a cairn, a niche and an
 * inlay — this is a SOLID BLOCK with holes bored in it):
 *
 *   1. THE MASS. Every square of ranks 5, 6, 7 and 8 is stone, on every level,
 *      except the three or four this level bores out. Not a line of stone (The
 *      Parapet's rank 6, The Cliff's diagonal) and not a box drawn round a
 *      corner (The Vault, The Glasshouse) — a solid half-board. Depth is the
 *      point: a wall one thick still has diagonals through it; this has none
 *      anywhere.
 *   2. THE CELL. His throne is e7, with e8 above it. On every level from L3
 *      on, all eight of e7's neighbours are stone but e8, and all of e8's are
 *      stone but e7. No rank, no file and no diagonal in the game enters the
 *      cell — and e8 has no free neighbour but e7, so Rookie can never stand
 *      in it either, not even on the empty square.
 *   3. THE HOLE. One square bored out of the mass, a knight's move from the
 *      square he is standing on. That is the run's whole geometry; what
 *      changes from level to level is WHICH hole, and what is watching it.
 *   4. THE STEP, and THE NOTCH. On the finales the floor itself is notched —
 *      d4, e4, g4, h4, e3 and g3 are stone — so the approach narrows to the
 *      f-file and, more importantly, the Dragon born beside Rookie has almost
 *      nowhere to fly but the hole. On L7 her birth square has exactly ONE
 *      legal move in the entire level, and it is the king.
 *
 * COLOUR DISCIPLINE (why the hunters are the colour they are). e7 and f4 are
 * dark; f3 and g6 are light. Every diagonal into the cell and into g6 is
 * stone, so no bishop of any colour ever reaches them. On L7 and L9 Rookie has
 * to STAND on f4, so the hunters are LIGHT-squared and cannot touch her there;
 * on L8 and L10 she stands on f3, so they are DARK. The only piece in this run
 * ever allowed to take her on the step is the one the level is about.
 *
 * ---------------------------------------------------------------------------
 * PER-CARD KEY / TRAP MAP
 *
 *   L      dragon         freeze-ray     magnet    aegis
 *   L1-2   trap           trap           trap      trap    (no card needed)
 *   L3     KEY            trap           trap      trap
 *   L4     trap           trap           trap      KEY
 *   L5     trap           trap           KEY       second key
 *   L6     second key     KEY            trap      trap
 *   L7-10  half the pair  half the pair  TRAP      TRAP
 *
 * MAGNET and AEGIS are traps on all four finales by construction: a magnet
 * pull runs along Rookie's own rank or file and every line she owns dies in
 * the mass, and there is nothing on the floor whose capture opens anything.
 * Each gets one mid-run level so neither is ever dead weight in an offer.
 *
 * KIT RULES CHECKED: no universal solvent (bishop-step / knight-hop /
 * become-king absent, and none is half the pair); exactly ONE summon, so no
 * tempo starvation and no rabies-dart beside a body; no card that targets
 * EMPTY squares (boulder, snare, scarecrow — the Warren's candidate explosion
 * does not apply, and the Dragon's own spawn list is at most eight squares and
 * usually two); `antiPairs` in data/run-playtest/pair-hypotheses.json lists
 * nothing against dragon+magnet, dragon+aegis, freeze+magnet, freeze+aegis or
 * magnet+aegis. Boulder is barred on purpose: one stone on e8 would delete his
 * flight square and do the Freeze's job for it.
 *
 * ---------------------------------------------------------------------------
 * THE FOUR FINALE DECISIONS (written before building, per "One line, four
 * times" — .claude/run-level-design.md, Tyler 2026-09-06). Same two cards, a
 * different decision each time, and the answer to one level LOSES on the next:
 *
 *   L7  THE CORK AND ITS ANSWER — the freeze goes on a GUARD. e8 is bricked,
 *       so his cell is ONE square and his legs are irrelevant: a card spent on
 *       him is a card thrown away. The hole is g6 and all eight of its
 *       neighbours are stone, so nothing walks or slides to it — the Dragon
 *       has to FLY, born on f4 or h4 beside her and jumping. And it is CORKED
 *       by a pawn she must capture to stand there, with a knight bricked into
 *       the corner at h8 whose only legal move in the whole level is that same
 *       square: jammed while its own pawn stands on it, and the recapture the
 *       instant the pawn is gone. Freeze the KNIGHT, take the cork, take him.
 *       Seven moves.
 *   L8  HOLD HIM — the freeze goes on the KING, and this is the level that
 *       teaches why the Dragon's clock is the enemy. Nothing guards the hole
 *       and nothing corks it; e8 is open. She flies in, she looks at his
 *       throne, and on the enemy phase he simply steps up one square to e8 —
 *       which g6 does not see, and which the Dragon has no move left to reach.
 *       Two turns of life is one travel move and one killing move; the card is
 *       what buys the phase in between. The floor is notched (f4, g3, g4, f3,
 *       g2 are stone) so h4 is a pocket with one free neighbour, h3, and from
 *       h4 the Dragon has exactly ONE legal move in the entire level.
 *   L9  THE FAR HOLE, AND THE CARD FIRST — same target as L8 and nothing else
 *       the same. He is standing on e8, not e7, and g6 is not even bored on
 *       this level: the only square in the game that looks at e8 is g7, walled
 *       on every side, and the only square that can jump to g7 is h5 — bored
 *       out of the mass, one free neighbour (h4), and reachable by nothing but
 *       a body born there. So the step moves to the h-file, the hole moves
 *       into the corner, and because both of the Dragon's turns are spent
 *       flying there is no turn left to cast on afterwards: the freeze goes
 *       down BEFORE the Dragon exists, where two enemy phases on a king is
 *       exactly what the line costs. Two enemies a turn.
 *   L10 THE CORK AND THE RUN — the L7 lock with his legs given back, and the
 *       card STILL must not go on him. e8 is open, so freezing the knight
 *       looks like it leaves his sidestep unanswered. It does not: the
 *       Dragon's capture of the cork is a capture credited to Rookie's side,
 *       and it STUNS him for exactly the phase he would have stepped on. Two
 *       problems, one card, and the order is forced — the strike has to be a
 *       CAPTURE, not a landing. Freeze him instead (the L8 reflex) and the
 *       knight eats her while he stands there safe. Two enemies a turn, eight
 *       moves.
 *
 * ===========================================================================
 * MEASURED — 2026-09-08, difficulty=normal, `revenge.ts matrix`. The finale
 * and tier rows are the NUMBERS OF RECORD: 32 trials, `--jobs=1`, serial.
 *
 * THE GATE (L7-L10, kit cards at T1, the run's own four-card kit):
 *
 *   L    none  dragon  freeze-ray  magnet  aegis  |  dragon+freeze-ray
 *   L7     0%      0%          0%      0%     0%  |               72%
 *   L8     0%      0%          0%      0%     0%  |               59%
 *   L9     0%      0%          0%      0%     0%  |               63%
 *   L10    0%      0%          0%      0%     0%  |               78%
 *
 * ***THE GATE IS MET ON L7, L9 AND L10 AND MISSED BY ONE POINT ON L8.***
 * No-ability 0% on all four and every single card in the kit 0% on all four —
 * twenty cells of zero, nothing that is a rounding call, which is the part of
 * the contract this run satisfies emphatically. The pair reads 59-78%, mean
 * 68%: L7, L9 and L10 sit inside the 60-80% band Tyler asked for after the
 * Lattice and the Alcove came in at 100%, and L8 reads 59%, one point under
 * the floor. That is reported as measured and NOT rounded up, and it is why
 * this run ships at `idea` rather than `built` — one command flips it if Tyler
 * reads a 59 the way a 32-trial confidence interval does.
 * The clock is NOT the knob on L8, and the numbers say so flatly: 13 moves
 * read 53%, 15 read 56%, 18 read 59%, and the SAME 59% came from cutting the
 * Dragon's legal-move list from three to one (stoning f3 and g2). That is the
 * Turnstile's finding again — a short line does not care about slack — plus
 * this run's own: what a summon line cares about is how many moves the body
 * has, not how many turns Rookie has.
 *
 * THE TIER LADDER (L7-L10, 32 trials, one card pinned at a time):
 *
 *   dragon:1      0 /  0 /  0 /  0     <- shipped tier
 *   dragon:2      0 / 34 / 50 /  0
 *   dragon:3      0 / 53 / 63 /  0
 *   dragon:5      9 /100 / 97 / 16
 *   freeze-ray:3  0 /  0 /  0 /  0
 *   freeze-ray:5  0 /  0 /  0 /  0
 *   magnet:5      0 /  0 /  0 /  0
 *   aegis:5       0 /  0 /  0 /  0
 *
 * The break is T2 and the reason is the one the design doc predicts: T2 takes
 * the Dragon from TWO turns of life to three, and on L8 and L9 — the two
 * finales whose line is travel-then-kill with nothing to capture on the way —
 * a third turn is a whole spare move. She flies in, watches him step, RE-AIMS,
 * and strikes, and the Freeze is not needed at all. L7 and L10 hold at every
 * tier below T5 because there the obstacle is a recapture, not a clock; T5
 * breaks even those (9% and 16%) because `summonSpawnSquares` gives T5 a
 * range-3 drop, which can put the Dragon straight into the hole. There is no
 * geometry fix for "one more turn", so `abilityTierCaps: { dragon: 1 }` is the
 * answer and 1 is the only cap the numbers allow. Every other card in the kit
 * is 0% at its own ceiling, so that is the whole cap list, and
 * `tier-cap-audit.ts` passes it (448000 slates, 1232000 options, 0 violations;
 * the Dragon still offered as a NEW pick 1385 times, never above the cap).
 *
 * THE LADDER (L1-L6, 16-32 trials, --jobs=3):
 *
 *   L    none  dragon  freeze-ray  magnet  aegis
 *   L1   100%    100%        100%    100%   100%   free
 *   L2   100%    100%        100%    100%   100%   free
 *   L3     0%    100%          0%      0%     0%   dragon, alone (32 trials)
 *   L4     0%    100%        100%     50%   100%   aegis / the toll
 *   L5     0%    100%        100%     44%   100%   aegis; magnet is the theme
 *   L6     0%    100%        100%      0%     0%   freeze-ray / the bolt-hole
 *
 * L1-L2 are winnable with nothing; L3-L6 are 0% with nothing and each has at
 * least one card at 100%. L3 is the cleanest single-card puzzle in the run —
 * 0% for everything but the Dragon, which clears it 100% — and L6 is the
 * Freeze's own level. The honest miss in this table is MAGNET: it never got
 * above 50%, and L5 (the level written for it) is cleared more reliably by
 * paying the toll with Aegis. Magnet ships as the pure TRAP filler, which is
 * the seat it holds in The Squint, The Millstone and The Turnstile, and it is
 * a good one: 0% on all four finales at every tier.
 *
 * FULL RUNS (`revenge.ts runs --runs=40`, normal, final build with the cap):
 *   random picks              1/40 =  2.5% full clears
 *   pool=dragon,freeze-ray    6/40 = 15%   full clears
 *
 * Both are LOW for this catalogue (the Turnstile reads 10% / 40%, the Moat 25%
 * random) and the per-level breakdown says exactly why, with no mystery in it.
 * Random picks: L1 100, L2 100, L3 53, L4 100, L5 100, L6 100, L7 52, L8 45,
 * L9 60, L10 33 — and across those 40 runs the bot's offer heuristic took
 * magnet 49 times, freeze-ray 37, aegis 36 and the DRAGON only 21. L3 is the
 * run's first gate and it is gated on the Dragon specifically, so a picker who
 * skipped her is stopped at level three; the fail mode there is `move-limit`
 * 19 times out of 19, which is a player with no answer wandering, not a clock
 * that is too short (a Dragon-holding bot clears L3 100% at the same limit).
 * With the pair in hand the ladder is L3 83, L7 88, L8 62, L9 56, L10 60 —
 * every level passable and the finale doing the work, which is the shape the
 * contract asks for. Whether a first gate that hard is right is Tyler's call:
 * softening L3 so a second card opens it would lift the random number and cost
 * the run the level that teaches what a hole is.
 *
 * ===========================================================================
 * DEAD ENDS (what was measured and thrown away)
 *
 * 1. THE PLAYTEST BOT'S EVAL IS BLIND TO ALLY THREATS, AND THAT IS THE WHOLE
 *    STORY OF THIS RUN. `fastScore` in scripts/run-playtest/bots/mcts.ts scores
 *    a king-goal position as `(8 - chebyshev(ROOKIE, king)) * 3`, plus 25 if
 *    ROOKIE attacks him and 150 if she attacks him while he is pinned. A
 *    summon standing on a square that attacks the king is worth exactly
 *    nothing. So a plan whose payoff is "my body threatens him" has no gradient
 *    at all: the first build of this run was provable (`solve --level=7` →
 *    forced W4) and read 0% for the pair across 16 trials, with traces showing
 *    the bot shuffling on rank 4 and never casting a card. THE RULE, and it
 *    generalises to every summon pair: THE DRAGON'S LAST MOVE MUST BE THE KING
 *    CAPTURE (10 000) AND HER TRAVEL MOVE MUST COME OUT OF A SHORT LIST. Both
 *    finale families here end on the capture; what made them findable was
 *    cutting the birth square's legal moves down — see 2.
 *
 * 2. NOTCH THE FLOOR, NOT THE CLOCK. `pickRolloutAction` samples from the top
 *    ROLLOUT_TOPK = 3 candidates, and a non-capturing ally move does not change
 *    `fastScore` at all, so every Dragon move ties and only the first three in
 *    enumeration order are ever played in a rollout. A Dragon born on an open
 *    rank 4 has ~20 moves and the one that matters is never sampled. Stoning
 *    f4/g3/g4 turns h4 into a pocket whose Dragon has three legal moves, and h5
 *    (L9) into one with two. Measured on L8: opening g3 — ONE extra square,
 *    taking the Dragon from three legal moves to four — dropped the pair from
 *    56% to 13% at 16 trials. This is the Warren's candidate-explosion finding
 *    at very small N, and it is stronger than the Warren states it: the count
 *    that matters is not the number of empty squares on the board, it is the
 *    number of legal moves the BODY has.
 *
 * 3. A HUNTER THAT POISONS THE SQUARE THE PLAN NEEDS. The first L7 put a knight
 *    in a sealed pocket at h5 covering the launch square f4, so that Rookie had
 *    to freeze it to stand there. `fastScore` subtracts 18 for a knight one jump
 *    from Rookie and does NOT check whether that knight is frozen, so f4 scored
 *    15 - 18 = -3 against 9 for shuffling on rank 2: the bot never went there
 *    once, at any clock. Swapping the knight for a jammed bishop (no penalty in
 *    the eval) took the same level from 0% to 19%. If a level REQUIRES Rookie
 *    to stand somewhere, do not let a pawn or a knight be the thing that
 *    watches it — the eval will refuse the square whatever you do to the clock.
 *
 * 4. A ROOK SLIDES THROUGH THE WATCHED STEP. The "the step is watched" build
 *    put the hole on f5 with its only free neighbour f4, and a jammed pawn
 *    covering f4, so she had to buy the square with the card. She does not: a
 *    rook on f3 slides f3 -> f5 in ONE move, passing OVER f4 without ever
 *    ending a turn on it, and from f5 she took the watcher along rank 5.
 *    Dragon alone went to 75-100%. A square you want to charge admission for
 *    must not share a rank or file with the square behind it.
 *
 * 5. AN EMPTY THRONE IS A STEPPING STONE (L9 v1, dragon alone 44%). With the
 *    king on e8 and e7 empty, the Dragon hopped into the hole, knight-jumped
 *    onto the VACATED throne, and then stepped one square to take him: two
 *    moves, no card. Any square adjacent to the king is a square the Dragon can
 *    kill from, so the pen's other square must be unreachable by the Dragon in
 *    one move from anywhere she can be born or fly. That is what killed the
 *    decoy hole at g6 on L9 and moved the whole level onto the h-file.
 *
 * 6. AN UNDEFENDED CORK ON THE HOLE IS ALWAYS A SOLO, AND SO IS A CAPTURABLE
 *    PIECE ONE DRAGON MOVE FROM IT. Any capture credited to Rookie's side stuns
 *    the king for a turn, and one turn is exactly what the Freeze was being
 *    bought for. So a pawn sitting in the hole hands the Dragon the stun for
 *    free (solo), and a watcher standing on a square the Dragon can capture
 *    ON THE WAY does the same — the e4/d5 build put a jammed pawn on f5 to
 *    cover the step, and f5 is itself a knight's move from the throne, so the
 *    Dragon took the pawn, banked the stun and jumped in: 100% alone. A cork is
 *    only a lock when something that CANNOT be captured on the way takes it
 *    back.
 *
 * 7. A PIECE ON A STONE SQUARE READS AS A BROKEN LEVEL. One build put a bishop
 *    on b5, which the MASS helper had already made stone. The level read 0% for
 *    the pair and looked like a design failure for a full iteration. `lint`
 *    does not catch it. Check every piece against the level's own hazard set
 *    before believing a zero.
 *
 * 8. MAGNET NEVER EARNED ITS LEVEL, AND THE REASON IS GEOMETRIC. A magnet pull
 *    runs along Rookie's own rank or file, and in this run every line she owns
 *    dies in the mass within a square or two. L5 was written for it and Aegis
 *    clears it 100% to Magnet's 44%. It stays in the kit as the trap filler it
 *    measures as: 0% on all four finales at every tier.
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
  type RunDef,
} from '../../run-kit';
import type { Coord } from '../../types';

/** 'f4' -> {file:6, rank:4}. Authoring convenience only. */
const sq = (name: string): Coord => X(name.charCodeAt(0) - 96, Number(name.slice(1)));

/**
 * THE MASS. Every square of ranks 5-8 is stone except the ones bored out for
 * this level: his cell, this level's hole, and any pocket holding a bricked-in
 * guard. Thirty-two squares of masonry, minus three or four.
 */
const MASS = (...bored: string[]): Coord[] => {
  const open = new Set(bored);
  const out: Coord[] = [];
  for (let file = 1; file <= 8; file++) {
    for (let rank = 5; rank <= 8; rank++) {
      const name = `${String.fromCharCode(96 + file)}${rank}`;
      if (!open.has(name)) out.push(X(file, rank));
    }
  }
  return out;
};

/**
 * THE NOTCH — the finale floor. Six stones that narrow the approach to the
 * f-file and, more importantly, strip the Dragon's birth square of anywhere to
 * fly but the hole. Without it she is born on an open rank 4 with twenty legal
 * moves and no search ever picks the one that matters.
 */
const NOTCH: ReadonlyArray<Coord> = ['d4', 'e4', 'g4', 'h4', 'e3', 'g3'].map(sq);

/** His cell wherever he is allowed both squares of it. */
const CELL = ['e7', 'e8'];

const RUN_REVENGE_43: RunDef = {
  id: 'revenge-43',
  name: 'The Loophole',
  blurb:
    'Half the board is solid stone with one hole bored in it, and nothing can walk there. Send something that flies — then buy it the turn it has to live through.',
  allowedAbilities: ['dragon', 'freeze-ray', 'magnet', 'aegis'],
  // Measured L7-L10, 32 trials, serial: the Dragon alone is 0/0/0/0 at T1 and
  // 0/34/50/0 at T2 — the tier that turns two turns of life into three, which
  // is the difference between "fly, then strike" and "fly, watch him step,
  // RE-AIM, and strike". L8 and L9 are the two finales whose line is travel +
  // kill with nothing to capture on the way, so a third turn is a whole spare
  // move and the Freeze stops being necessary there. T3 reads 0/53/63/0 and T5
  // 9/100/97/16. Freeze Ray is 0/0/0/0 at T3 and T5, magnet and aegis 0/0/0/0
  // at T5, so this is the only card whose tier breaks the gate and 1 is the
  // only cap the numbers allow.
  abilityTierCaps: { dragon: 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE SHAFT. The mass is already there and already four ranks deep,
    // but two squares of it are missing: e5 and e6 bore a shaft up to his
    // throne. He stands still. The silhouette, for free.
    make(1, [king(5, 7), pawn(3, 3)], {
      ...STILL,
      moveLimit: 12,
      hazards: MASS('e5', 'e6', 'e7', 'e8'),
    }),
    // L2 — THE RUNNER. Same shaft, and now he runs — but his cell is two
    // squares, and a rook that reaches e6 takes the lower one and then the
    // upper one. The last level that needs no card.
    make(2, [king(5, 7), bishop(3, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: MASS('e5', 'e6', 'e7', 'e8'),
      kingPen: CELL,
    }),
    // L3 — THE FIRST HOLE (dragon KEY). The shaft is bricked and the cell is
    // sealed against every line in the game. One square of the mass is bored
    // out instead — d5 — and d5 is a knight's move from his throne. Stand
    // beside it, put a body in it, and the body jumps. The whole run in one
    // sentence: the way in is not a road, it is a square.
    make(3, [king(5, 7), bishop(3, 3), pawn(7, 3)], {
      ...FLEE,
      moveLimit: 14,
      hazards: MASS('d5', 'e7', 'e8'),
      kingPen: CELL,
    }),
    // L4 — THE TOLL (aegis KEY). The shaft is open again, so there is a road —
    // and a bishop is parked in it on e6 with a pawn on f7 biting the square
    // it stands on. That pawn cannot move (f6 is stone) and cannot bite
    // anything else (g6 is stone): it exists to answer one capture. Take the
    // cork anyway and eat the answer.
    make(4, [king(5, 7), bishop(5, 6), pawn(6, 7), bishop(3, 3)], {
      ...FLEE,
      moveLimit: 13,
      hazards: MASS('e5', 'e6', 'e7', 'e8', 'f7'),
      kingPen: CELL,
    }),
    // L5 — THE JAM (magnet KEY). The same cork in the same doorway, and now
    // TWO jammed pawns bite it — d7 and f7 — so one shield pays for the
    // capture and the second pawn collects while she is still walking the two
    // moves his flight costs. Drag the cork down the file instead and take it
    // on open ground where neither pawn reaches.
    make(5, [king(5, 7), bishop(5, 6), pawn(4, 7), pawn(6, 7), bishop(3, 2)], {
      ...FLEE,
      moveLimit: 14,
      hazards: MASS('e5', 'e6', 'e7', 'e8', 'd7', 'f7'),
      kingPen: CELL,
    }),
    // L6 — THE BOLT-HOLE (freeze-ray KEY). The road is wide open, nothing
    // corks it, walk in. Then find out what his cell is on this level: e8 is
    // bricked and f8 is not, so his second square is DIAGONAL to his first —
    // and nothing in the game attacks f8 (e8, f7, g7 and g8 are all stone).
    // She threatens e7 from the shaft, he steps off it, and she is out of
    // board. Freeze him where he stands and walk up the file she already owns.
    make(6, [king(5, 7)], {
      ...FLEE,
      moveLimit: 12,
      hazards: MASS('d5', 'd6', 'e6', 'e7', 'f8'),
      kingPen: ['e7', 'f8'],
    }),
    // L7 — THE CORK AND ITS ANSWER (finale, teaching). e8 is bricked, so his
    // cell is one square and his legs are not the problem. The hole is g6 —
    // every one of its eight neighbours is stone, so nothing in the game can
    // walk or slide there and the Dragon has to fly, born on f4 or h4 and
    // jumping. A pawn corks it; a knight bricked into h8, whose only legal
    // move in the level is g6, takes back whatever lands there. Freeze the
    // KNIGHT. Dark bishops on the floor: they can never reach g6, whose four
    // diagonals are all stone, so nothing but the corner knight ever answers.
    make(
      7,
      [king(5, 7), pawn(7, 6), knight(8, 8), bishop(3, 3), bishop(6, 2)],
      {
        ...FLEE,
        moveLimit: 7,
        hazards: MASS('e7', 'g6', 'h8'),
        kingPen: ['e7'],
      },
    ),
    // L8 — HOLD HIM. Nothing corks the hole and nothing watches it, and e8 is
    // open: the only thing between the Dragon and his throne is one sidestep.
    // She flies to g6, she looks at e7, and he steps to e8 — which g6 does not
    // see and which she has no move left to reach. Freeze the KING. The floor
    // is notched (f4, g3, g4, f3, g2 stone) so h4 is a pocket with one free
    // neighbour, h3, and the Dragon born in it has exactly ONE legal move in
    // the whole level: the hole.
    make(
      8,
      [king(5, 7), bishop(3, 3), bishop(6, 2), bishop(2, 4)],
      {
        ...FLEE,
        moveLimit: 15,
        hazards: [
          ...MASS('e7', 'e8', 'g6'),
          sq('f4'), sq('g3'), sq('g4'), sq('f3'), sq('g2'),
        ],
        kingPen: CELL,
      },
    ),
    // L9 — THE FAR HOLE, AND THE CARD FIRST. He is on e8, and g6 is not even
    // bored here. The one square that looks at e8 is g7, and the one square
    // that can jump to g7 is h5 — bored out of the mass with a single free
    // neighbour, h4. So the step is on the h-file and the hole is in the
    // corner, and from h5 the Dragon has exactly two legal moves (g7, h4) and
    // from g7 exactly two (h5, and his square). Both of her turns are spent
    // flying, so the freeze goes down before she is cast at all: two enemy
    // phases on a king is exactly the price of this line.
    make(
      9,
      [king(5, 8), bishop(3, 2), bishop(8, 3), bishop(4, 3)],
      {
        ...FLEE,
        moveLimit: 11,
        enemiesPerTurn: 2,
        hazards: [...MASS('e7', 'e8', 'g7', 'h5'), sq('f4'), sq('g3'), sq('g4')],
        kingPen: CELL,
      },
    ),
    // L10 — THE CORK AND THE RUN. The L7 lock with his legs given back. Two
    // problems, one card — and it is not a choice, it is an ORDER: the
    // Dragon's capture of the cork is a capture credited to Rookie, and a
    // capture stuns him for exactly the phase he would have stepped on. So the
    // card goes where it is the only answer, the knight, and the strike has to
    // be a CAPTURE and not a landing. Freeze him instead and the knight eats
    // her while he stands there safe.
    make(
      10,
      [king(5, 7), pawn(7, 6), knight(8, 8), bishop(3, 3), bishop(6, 2), bishop(2, 4)],
      {
        ...FLEE,
        moveLimit: 8,
        enemiesPerTurn: 2,
        hazards: MASS('e7', 'e8', 'g6', 'h8'),
        kingPen: CELL,
      },
    ),
  ],
};

export { RUN_REVENGE_43 };
export default RUN_REVENGE_43;
