/**
 * revenge-26 — THE KEEP. Built 2026-09-06 for the signature pair
 * BECOME KING + BOULDER ("untouchable engineer",
 * data/run-playtest/pair-hypotheses.json confidence 4 — the archetype's top
 * entry and the only one of its four pairs whose partner is neither a summon
 * nor a solvent). Neither card had a home: Become King has never been in a
 * shipped kit at all (it is a universal solvent and is banned everywhere it
 * is not half the pair), and Boulder has been half of exactly one pair
 * before this (boulder + knight-hop, The Slash).
 *
 * THE VERB: walk through a door only a king fits through, and brick the two
 * squares your own reach cannot cover. Not crossing a wall (The Moat), not
 * baiting hunters (The Alley), not a poison timer (The Switchback), not
 * blowing a hole (The Briar), not buying a body time (The Lattice).
 *
 * THE MECHANISM, read out of lib/run/abilities.ts and lib/run/pawn-ai.ts:
 *
 *   1. King form is the only form in the game whose attack set is a BLOB and
 *      whose STEP is a diagonal. Both halves matter here. The step is what
 *      gets her into the keep — the door square is walled on its rank and
 *      its file, so a rook can never stand on it and a king walks in
 *      sideways. The blob is what holds him: kingFleeMove() reads
 *      `rookieLegalMoves(state)` — her CURRENT form — so the shape of her
 *      attack set IS his flight set, and a king covers the three squares of
 *      the arc in front of her where a rook covers one.
 *   2. King form is impervious (stepEnemyTurn's "impervious bounce"), which
 *      is what lets her end a turn in the doorway with his last pawn
 *      covering it.
 *   3. But a king walks one square a turn and the transform is ONE protected
 *      enemy turn at T1. So the play is a one-turn reaction: stones, step,
 *      survive, take him with the rook she turns back into. Nothing
 *      pre-emptive, nothing delayed — the depth the playtest bot models.
 *   4. Boulder is free, permanent, and the bot enumerates drops adjacent to
 *      the enemy king (bots/shared.ts). The two stones go on the two ring
 *      squares BEHIND him, the ones no king standing in the doorway can
 *      reach. Neither half is enough: the arc is two squares short, and the
 *      stones cannot open a door.
 *
 * CONSTANT SIGNATURE — THE KEEP. On every level the king's room is a RING of
 * squares drawn all the way around a single STONE PILLAR, and the ring is
 * sealed by a stone lip one square further out. Not a band across the board
 * (The Moat), not a box he sits inside (The Vault), not a lattice (The
 * Lattice) — a doughnut, three squares by three, with one gap in the lip.
 * Three facts do all the work, and all three are visible from L1:
 *
 *   - A ROOK CAN NEVER HOLD A RING. The pillar splits the ring's middle rank
 *     and middle file, so no rook line ever sees two opposite squares of it,
 *     and a king standing on a ring always has a neighbour off her cross.
 *   - THE ONLY WAY IN IS THE DOOR, and from L5 on the door is DIAGONAL. The
 *     square outside the ring on his rank is walled above, below and behind
 *     — its whole file and its whole rank are stone — so no rook move in the
 *     game ends on it. A king steps in from the corner square beside it.
 *     This is why Boulder alone reads 0% on the finale at EVERY tier: it is
 *     not that the stones are too few, it is that a rook can never stand
 *     anywhere that sees him.
 *   - HIS LAST PAWN WATCHES THE DOOR. One pinned pawn (its own forward
 *     square is stone) covers the doorway, and it is walled in on its rank
 *     and file so nothing can ever capture it — no capture, no capture-stun,
 *     no way to buy a free turn off the court. That was the fix that made
 *     this run work: the first build put a PAWN at the centre of the ring
 *     instead of a pillar, and every card that survives one recapture
 *     (Aegis, Become King) took the pawn, stood on the ring's centre with
 *     the king stunned beside it, and won alone — 100% for both on all four
 *     finale levels. See DEAD ENDS.
 *
 * KIT = become-king / boulder / aegis / magnet (`allowedAbilities` IS the
 * kit; the gate is measured against it). Become King is a universal solvent
 * and is legal here only because it IS half the pair. No summon may ever
 * join this kit: a rainbow ally's cover deletes the king's flight squares
 * (kingFleeMove reads allyAttackedSquares on every difficulty), which is
 * Boulder's whole job. Nothing that stuns may join it either — poison-dart,
 * decoy, rabies-dart and freeze-ray each hand the player a free capture or a
 * frozen king, and a king who cannot flee needs no stones.
 *
 * KEY / TRAP map:
 *   boulder      KEY L3 and L6 (two stones cage him in a short ring), half
 *                of L7-L10. TRAP on L4-L5: stones seal, they never open.
 *   become-king  KEY L5 (the door is diagonal and the ring is three squares
 *                — the arc holds all of it), half of L7-L10. Second answer
 *                on L3/L4/L6.
 *   aegis        KEY L4 (take the plug in the doorway and eat the reply).
 *                TRAP on L5 and on the whole finale: a shield answers the
 *                court, and the court is not what beats you there — the
 *                geometry is. A rook with a shield cannot reach the door.
 *   magnet       KEY nowhere, by construction — this run's pure trap card
 *                (The Slash's Magnet role). A pull runs along Rookie's own
 *                line, so it can never clear a blocker OFF that line, and
 *                every blocker in a keep is on the one line she wants. The
 *                keep contains nothing else pullable: the pillar is stone,
 *                the watcher is sealed on its rank and file, and the king
 *                cannot be pulled below T5.
 *
 * L7-L10 INTENDED LINE (all four, mirrored/moved):
 *   1. Slide to the staging square — the corner square diagonally outside
 *      the door. It is safe, and a rook standing on it has no line into the
 *      keep at all, so he does not flinch.
 *   2. Drop both stones on the two ring squares behind him (both are
 *      adjacent to the king, so the bot's drop enumerator sees them).
 *   3. Cast Become King and step diagonally into the doorway. His pawn's
 *      reply bounces. His four neighbours are now the two the arc covers and
 *      the two under stone: kingFleeMove finds nothing and he stands still.
 *   4. The crown drops. She is a rook on his rank, one square away. Take him.
 *
 * WHY THE SINGLES FAIL ON THE FINALE (kit-relative, and tier-proof):
 *   none         a rook cannot enter the keep and cannot see into it.
 *   boulder      same — the stones cage him, and there is no square a rook
 *                can stand on that attacks the cage. True at T5 too.
 *   become-king  she gets in and he walks around his own pillar; the arc is
 *                two squares short. At T5 (king for the whole level) she can
 *                chase him around the ring forever — a cycle cannot be
 *                closed by one piece.
 *   aegis        a shield does not make a rook move diagonally.
 *   magnet       nothing to pull; the pillar is stone and the watcher pawn
 *                is sealed on its rank and its file.
 *
 * ── 2026-09-06 RE-MEASURED AFTER THE CROSS-TALK FIX (commit 94482af) ──
 * Everything under MEASURED below was taken with a harness whose result depended
 * on the SHAPE of the command: the MCTS bot carried a process-lifetime decision
 * counter into its rollout RNG seed, so a cell read one number alone and another
 * as a later column of a multi-column run (repeating ONE cell four times in one
 * process gave 24/16/21/23 of 32). Rookie's start file was unseeded too. Both are
 * fixed; a cell now depends only on (run, level, loadout, trial, tier) and is
 * reproducible across invocation shapes — guarded by
 * scripts/run-playtest/matrix-determinism-check.ts.
 *
 * FINALE, numbers of record. `revenge.ts matrix --run=revenge-26 --levels=7,8,9,10
 * --loadouts=<none + kit + pair> --trials=32 --jobs=8`, T1 cards, Normal:
 *    L       none      aegis  becomekin    boulder     magnet  |  become-king+boulder
 *    7         0%         0%         0%         0%         0%  |  91%
 *    8         0%         0%         0%         0%         0%  |  91%
 *    9         0%         0%         0%         0%         0%  |  88%
 *   10         0%         0%         0%         0%         0%  |  88%
 * GATE HOLDS: no card in the kit clears a finale level alone (worst single cell 0%); the pair reads 91/91/88/88.
 * The header below reads 84/84/91/78 for the pair and is CONFIRMED (max drift 10 points,
 * inside 32-trial binomial noise) — but it was taken with the flawed method, so these
 * are the numbers of record.
 * ──
 * MEASURED (Normal, T5 bot, kit at T1 — the harness default; 2026-09-06).
 *   Direction pass (--jobs=3, 16 trials/cell):
 *   L      none  becomeK  boulder  aegis  magnet  |  become-king+boulder
 *   1-2    100%    100%     100%    100%   100%   |   100%   (teaching)
 *   3       13%    100%     100%     13%    31%   |   100%   (BOULDER key)
 *   4        0%    100%       0%    100%     0%   |   100%   (AEGIS key)
 *   5        0%    100%       0%      0%     0%   |   100%   (CROWN key)
 *   6       13%    100%     100%      6%     6%   |   100%   (BOULDER key)
 *   FINALE, numbers of record (--jobs=1 SERIAL, 32 trials/cell):
 *   7        0%      0%       0%      0%     0%   |    84%
 *   8        0%      0%       0%      0%     0%   |    84%
 *   9        0%      0%       0%      0%     0%   |    91%
 *   10       0%      0%       0%      0%     0%   |    78%
 *   (L7 and L9 were re-read after their clocks were cut a move each — 9→8
 *   and 10→9 — to bring them toward Tyler's 2026-09-06 band; they read 97%
 *   and 100% at the looser clock. Their aegis and magnet cells are the 32-
 *   trial reads from the looser build, which can only over-state a card on a
 *   shorter clock; none/become-king/boulder were re-read on the shipped one.)
 *   THE FINALE AT THE HIGHEST TIER THE OFFERS CAN REACH — become-king:5,
 *   boulder:5, aegis:5, magnet:5, 16 trials each on all four levels: 0% for
 *   every card on every level. This is the first Revenge finale that is NOT
 *   tier-fragile (Colonnade L10 breaks at bishop-squire:4, the Parapet at
 *   knight-hop:4, the Lattice at duchess:4), and it is not luck: the gate is
 *   not "how many stones" or "how long the crown lasts", it is that the only
 *   square in the level with a line to him cannot be reached by a rook move
 *   at any tier. T5 Boulder's unlimited stones cage a king nobody can shoot;
 *   T5 Become King's permanent crown chases him around a cycle forever.
 *   FULL RUNS (40 each, serial, never skipping an offer): 10/40 = 25% clear
 *   with RANDOM picks from the kit — the first combo-gated run to land in
 *   The Moat's 10-25% band rather than the 28-55% the rubric flags as the
 *   open problem. It lands there because the attrition is in the MIDDLE:
 *   L3 80%, L4 69%, L5 59% of the players who reach them (all move-limit
 *   deaths — the wrong card in hand), while everyone who arrives at L7 with
 *   both halves clears 85-100%. PAIR-POOL RUNS (--pool=become-king,boulder):
 *   20/40 = 50% clear, in line with The Colonnade (55%) and The Vault (53%);
 *   its losses are L5 (6), L8 (8) and L10 (6), and on L8/L10 half of them are
 *   dead-ends — the crown spent on the wrong turn, with the walk still to
 *   pay for. The gap between 25% and 50% is the run doing its job: holding
 *   the pair is worth double, and it is still not a free pass. (Both run
 *   sweeps were taken on the build before the L7/L9 clocks were cut; the
 *   shorter clocks can only lower them.)
 *
 * WHERE THIS RUN MISSES THE RUBRIC, stated rather than hidden. Two lines
 * were added to .claude/run-level-design.md by Tyler on the morning this was
 * built, after he played The Lattice and The Alcove:
 *   1. "aim 60-80%" for the pair on the finale. This reads 84/84/91/78 —
 *      three of four above the band. The knobs the rubric names are the
 *      clock and a second enemy per turn; a move came off L7 and L9 for
 *      exactly this reason, and the rest would need a longer WALK, since the
 *      singles here fail on geometry and cannot be taxed by the clock at all.
 *   2. "one line, four times". This run is guilty: L7-L10 ask for the same
 *      three moves (stone the two, step the diagonal, take him) against four
 *      different silhouettes. The keep can carry the variance the rubric
 *      wants — a second doorway, a king who starts off the door square, a
 *      level where the two stones must go down on different turns — but none
 *      of that is in this build.
 *   3. And the pair itself collided: THE ALCOVE (revenge-25) shipped the
 *      same become-king + boulder pair from another session while this run
 *      was being measured. Different geometry (a one-wide stone cell against
 *      an edge file versus a ring around a pillar) and a different reason the
 *      singles fail, but the same answer in the player's hand, and "vary the
 *      signature pair between runs" is a Tyler note, not a suggestion.
 *      Registered as an IDEA and deliberately not pushed to the playtest
 *      page for that reason — his call, not the harness's.
 *
 * DEAD ENDS (2026-09-06; every one of these is a build that was measured and
 * thrown away, in the order they were found):
 *   - A PAWN AT THE CENTRE OF THE RING. v1's signature was a ring around his
 *     last PAWN, not a pillar — "the guard who cannot move", frozen because
 *     the square in front of it is his own king's room. It reads beautifully
 *     and it is broken: the centre of a ring is adjacent to all eight of his
 *     squares and a rook standing on it holds four, so every card that
 *     survives one recapture buys that square. Aegis and Become King each
 *     took the sentinel, ate the reply, and won ALONE at 100% on all four
 *     finale levels (boulder 0-6%, magnet 0%, none 0%). Any capture inside
 *     the keep is also a capture-stun. The centre has to be stone.
 *   - A ONE-FILE ROOM WITH A WALKABLE DOOR. L3/L6 v1 gave him the ring's
 *     near file (c6/c7/c8) and left the door rook-reachable: 100% for no
 *     ability. He sidesteps off c7, she slides into the square he left, and
 *     from inside the ring she owns his file. Every ring square that is NOT
 *     in the pen is a square SHE can stand on — either the pen is the whole
 *     ring, or the way in is covered.
 *   - THE PLUG MARCHES. L4 v1 plugged the gap with a defended pawn; v2 added
 *     a runner in front of it so it could not advance. Both read 100% for no
 *     ability, and the trace says why: she eats the runner (it is free), the
 *     plug steps into the square the runner left — which its defender does
 *     not cover — and she eats it too. A pawn is only pinned while something
 *     is standing in front of it, and anything she can capture is something
 *     she can move. L4 ships with no plug at all: the gap is open, and the
 *     one square with a line to him is COVERED by a pawn nothing can reach.
 *   - A HUNTER ON A CAGE LEVEL. L6 v2 put one bishop on the floor for
 *     pressure: 94% for no ability. Any capture credited to Rookie stuns the
 *     king, and a stunned king does not need to be stoned in — he simply
 *     cannot step off her line the turn she arrives. On a level whose gate
 *     is "he steps diagonally out of your file", there must be nothing on
 *     the board to take. (The finale is immune for the same reason it is
 *     tier-proof: a stun does not give a rook a square to shoot from.)
 *   - A HUNTER ON THE DOOR'S OWN COLOUR. L10 v1 had two light-squared
 *     bishops, and its door (d7) and staging square (c6) are light: the pair
 *     read 41%. A hunter that can stand in the doorway is not pressure, it
 *     is a lock. Both bishops dark, same level, same clock: 78%.
 *   - A CLOCK THAT PAYS FOR NOTHING. L8/L9/L10 at 8-9 moves read the pair at
 *     69/56/38%. Because the singles fail for GEOMETRIC reasons here, the
 *     clock is free difficulty that only taxes the answer — at 10 moves the
 *     same three levels read 84/100/78 with every single still at 0%. When
 *     the gate is geometry, spend the difficulty on the walk, not the watch.
 */

import { bishop, king, make, pawn, X, FLEE, STILL, type RunDef } from '../../run-kit';
import type { Coord } from '../../types';

const FILES = 'abcdefgh';
const sq = (c: Coord): string => `${FILES[c.file - 1]}${c.rank}`;
const key = (c: Coord) => `${c.file},${c.rank}`;
const on = (c: Coord) => c.file >= 1 && c.file <= 8 && c.rank >= 1 && c.rank <= 8;

/** The eight squares around (f, r) — the ring, i.e. his room. */
function ring(f: number, r: number): Coord[] {
  const out: Coord[] = [];
  for (let df = -1; df <= 1; df++) {
    for (let dr = -1; dr <= 1; dr++) {
      if (df === 0 && dr === 0) continue;
      const c = X(f + df, r + dr);
      if (on(c)) out.push(c);
    }
  }
  return out;
}

/**
 * A keep: a pillar at (f, r), his ring around it, a stone lip one square
 * further out with ONE gap — the door, on his rank, `dir` files out.
 *
 *   pillar    (f, r)            stone, the middle of the ring
 *   ring      the 8 around it   his room (kingPen)
 *   door      (f + 2dir, r)     the gap in the lip
 *   king      (f + dir, r)      the ring square inside the door
 *   staging   (f + 3dir, r - 1) the corner square outside the door
 *   watcher   (f + 3dir, r + 1) pinned pawn covering the door
 *   seals     (f + 3dir, r) and (f + 4dir, r + 1) — the watcher's stump and
 *             the far side of its rank, so nothing can ever capture it.
 *
 * With the watcher's stump on the door's rank and the lip above and below
 * it, the door is walled on its whole file and its whole rank: no rook move
 * ends there. Only a king step does.
 */
function keep(f: number, r: number, dir: 1 | -1) {
  const pillar = X(f, r);
  const pen = ring(f, r);
  const inner = new Set([key(pillar), ...pen.map(key)]);
  const door = X(f + 2 * dir, r);
  const watcher = X(f + 3 * dir, r + 1);
  const lip: Coord[] = [];
  for (let df = -2; df <= 2; df++) {
    for (let dr = -2; dr <= 2; dr++) {
      const c = X(f + df, r + dr);
      if (!on(c) || inner.has(key(c))) continue;
      if (key(c) === key(door)) continue;
      lip.push(c);
    }
  }
  const seals = [X(f + 3 * dir, r), X(f + 4 * dir, r + 1)].filter(on);
  return {
    pillar,
    pen: pen.map(sq),
    door,
    kingStart: X(f + dir, r),
    staging: X(f + 3 * dir, r - 1),
    watcher,
    /** Everything stone in the keep: pillar + lip + the watcher's seals. */
    hazards: [pillar, ...lip, ...seals],
  };
}

/** Same five ids every Revenge slate guarantees (runs.ts REVENGE_CORE). */
const REVENGE_CORE_26: ReadonlyArray<string> = [
  'surge',
  'freeze-ray',
  'knight-hop',
  'bishop-step',
  'queen-pulse',
];

// L5 teaches the diagonal door on a three-square ring; L7-L10 are the same
// keep with the ring at full size, moved and mirrored.
const K5 = keep(2, 7, 1); // pillar b7, door d7, watcher e8, staging e6
const K7 = keep(2, 7, 1);
const K8 = keep(7, 7, -1); // pillar g7, door e7, watcher d8, staging d6
const K9 = keep(3, 7, 1); // pillar c7, door e7, watcher f8, staging f6
const K10 = keep(6, 7, -1); // pillar f7, door d7, watcher c8, staging c6

/** The lip of a keep without the watcher's seals (mid-run: a walkable door). */
function openKeep(f: number, r: number, dir: 1 | -1) {
  const k = keep(f, r, dir);
  const sealKeys = new Set([key(X(f + 3 * dir, r)), key(X(f + 4 * dir, r + 1))]);
  return { ...k, hazards: k.hazards.filter((c) => !sealKeys.has(key(c))) };
}

const K1 = openKeep(2, 7, 1);
const K3 = openKeep(2, 7, 1);
const K6 = openKeep(7, 7, -1);

const RUN_REVENGE_26: RunDef = {
  id: 'revenge-26',
  name: 'The Keep',
  blurb: 'A room that runs all the way around a pillar. One door, and it is a diagonal.',
  allowedAbilities: ['become-king', 'boulder', 'aegis', 'magnet'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  offerCore: REVENGE_CORE_26,
  offerCoreMin: 2,
  levels: [
    // L1 — THE PILLAR. One stone at b7 and his room all the way around it.
    // He stands STILL on c7 and rank 7 is open from the east: ride it and
    // take him. The silhouette is the whole lesson.
    make(1, [king(3, 7)], {
      ...STILL,
      moveLimit: 9,
      hazards: [X(2, 7)],
      kingPen: ring(2, 7).map(sq),
    }),
    // L2 — THE LIP. The same keep with its stone lip: everything around the
    // ring is walled except the door on his rank. He is STILL, so the door
    // is just a door — slide down rank 7 and take him from outside it.
    make(2, [king(3, 7)], {
      ...STILL,
      moveLimit: 9,
      hazards: K1.hazards,
      kingPen: ring(2, 7).map(sq),
    }),
    // L3 — TWO STONES. He RUNS now, and the gap in the lip has moved to c5,
    // under the ring, so she gets a LINE into the keep without a way in: the
    // c-file sees c6, c7 and c8, and the one square she could step onto (c6)
    // is covered by his pinned pawn on d7. A rook on c5 takes his file and
    // he steps DIAGONALLY, to b6 or b8, which nothing in the level can ever
    // see. Stone those two and the file is a killing line. BOULDER, alone —
    // a crown on c6 covers b6 but never b8, and a shield only buys the
    // square, not the geometry.
    make(3, [pawn(4, 7), king(3, 7)], {
      ...FLEE,
      moveLimit: 9,
      hazards: [X(2, 7), X(1, 5), X(2, 5), X(4, 5), X(4, 6), X(4, 8), X(5, 7)],
      kingPen: ring(2, 7).map(sq),
    }),
    // L4 — THE COVERED STEP. His room is one square (c6) and there is exactly
    // one square in the level with a line to it: c5, the gap in the south
    // lip. The stone on c4 cuts the file below it, so she cannot fire from
    // range — she has to STAND in the gap, and his last pawn on b6 covers
    // it. That pawn can never be answered: it is frozen (b5 is stone), and
    // its own square is walled on its file and its rank, so nothing in the
    // game can capture it. Stand in the gap and die, or stand in it with the
    // shield up and take him next move. AEGIS — and Become King, which is
    // the same answer wearing the other card, and the reason this is where
    // the crown is introduced.
    make(4, [pawn(2, 6), king(3, 6)], {
      ...FLEE,
      moveLimit: 10,
      hazards: [X(2, 7), X(1, 5), X(2, 5), X(3, 4), X(4, 6), X(4, 7), X(4, 8)],
      kingPen: ['c6'],
    }),
    // L5 — THE DIAGONAL DOOR. The keep is sealed now: the door d7 has stone
    // above it, stone below it and the watcher's stump behind it, so its
    // whole file and its whole rank are wall. No rook move in the game ends
    // on d7. A KING steps in from e6 — and his room is three squares, which
    // is exactly what the arc holds. Nothing else in the kit can even see
    // him. BECOME KING, alone.
    make(5, [pawn(K5.watcher.file, K5.watcher.rank), king(3, 7)], {
      ...FLEE,
      moveLimit: 9,
      hazards: K5.hazards,
      kingPen: ['c6', 'c7', 'c8'],
    }),
    // L6 — THE FAR KEEP. L3 mirrored onto g7: the gap is f5, the covered
    // entrance is f6, and the two squares he steps to are g6 and g8. Same
    // question, longer walk, eight moves to answer it, and NOTHING ELSE ON
    // THE BOARD — a bishop here read 94% for no ability, because any free
    // capture is a stun and a stunned king does not need to be stoned in
    // (see DEAD ENDS). BOULDER.
    make(6, [pawn(5, 7), king(6, 7)], {
      ...FLEE,
      moveLimit: 8,
      hazards: [X(7, 7), X(8, 5), X(7, 5), X(5, 5), X(5, 6), X(5, 8), X(4, 7)],
      kingPen: ring(7, 7).map(sq),
    }),
    // L7 — THE KEEP. The ring at full size: eight squares around the pillar,
    // his own body between him and the two the arc cannot reach. Stone b6
    // and b8, wear the crown, step through the diagonal, take him.
    make(7, [pawn(K7.watcher.file, K7.watcher.rank), king(K7.kingStart.file, K7.kingStart.rank)], {
      ...FLEE,
      moveLimit: 8,
      hazards: K7.hazards,
      kingPen: K7.pen,
    }),
    // L8 — THE OTHER HAND. The same keep mirrored onto g7: the door is e7,
    // the staging square d6, the two squares behind him h6 and h8. A dark
    // bishop hunts the floor.
    make(
      8,
      [
        pawn(K8.watcher.file, K8.watcher.rank),
        bishop(1, 2),
        king(K8.kingStart.file, K8.kingStart.rank),
      ],
      {
        ...FLEE,
        moveLimit: 10,
        hazards: K8.hazards,
        kingPen: K8.pen,
      },
    ),
    // L9 — OFF THE WALL. The keep one file in from the edge (pillar c7), so
    // the ring has a west side too and the lip is a full frame. Door e7,
    // staging f6, the squares behind him b6 and b8. Two enemies a turn and
    // two bishops on the floor.
    make(
      9,
      [
        pawn(K9.watcher.file, K9.watcher.rank),
        bishop(1, 2),
        bishop(3, 2),
        king(K9.kingStart.file, K9.kingStart.rank),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 9,
        hazards: K9.hazards,
        kingPen: K9.pen,
      },
    ),
    // L10 — THE KEEP, MIRRORED. Pillar f7, door d7, staging c6, two bishops
    // and two enemies a turn: the floor between her and the staging square
    // is the whole difficulty, because the keep itself cannot be entered by
    // anything but the crown. Both bishops are DARK — d7 and c6 are light
    // squares, and a hunter that can stand in the doorway or on the staging
    // square is not pressure, it is a lock (v1 with light bishops on h2/f1
    // read 41% for the pair; the same level with dark ones, below).
    make(
      10,
      [
        pawn(K10.watcher.file, K10.watcher.rank),
        bishop(7, 1),
        bishop(8, 4),
        king(K10.kingStart.file, K10.kingStart.rank),
      ],
      {
        ...FLEE,
        enemiesPerTurn: 2,
        moveLimit: 10,
        hazards: K10.hazards,
        kingPen: K10.pen,
      },
    ),
  ],
};

export { RUN_REVENGE_26 };
export default RUN_REVENGE_26;
