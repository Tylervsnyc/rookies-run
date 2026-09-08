/**
 * revenge-46 — THE STAIR. Built 2026-09-08 for the signature pair
 * CONVERT + QUEEN PULSE. Kit = convert / queen-pulse / rewind / decoy
 * (`allowedAbilities` IS the kit). All four cards are LIVE.
 *
 * CONCEPT (A): an unbuilt pair the discovery harness has already proved can
 * gate — `convert+queen-pulse` gates a generated L7 at 97% under a kit where
 * every single card reads 0% (data/run-playtest/combo-library/SYNERGY.md),
 * and pair-hypotheses.json rates the free-capture-stun family confidence 4.
 * CONVERT is the thinnest signature socket left in the catalogue: one shipped
 * run (convert + summon-knight, The Cliff) in 253 pairs. QUEEN PULSE has been
 * half of two (queen-pulse + smoke, The Turnstile; become-king + queen-pulse,
 * The Embrasure) and in neither was it ever the ONLY thing that could walk
 * the one line in the level.
 *
 * THE VERB: BUY THE STEP. Not crossing a wall (The Moat), not baiting hunters
 * (The Alley), not a poison timer (The Switchback), not blowing a hole (The
 * Briar), not caging with his own guard (The Alcove), not a double door (The
 * Millstone), not a two-rook net (The Parapet), not buying a body time (The
 * Lattice), not moving the wall (The Quarry), not an undo (The Dogleg), not a
 * capture you do not survive (The Picket), not zugzwang (The Niche), not a
 * lure (The Pinch). This run's answer is: THE ONE SQUARE IN THE LEVEL WITH A
 * LINE ON HIM IS A SQUARE HIS OWN MAN IS WATCHING — so change whose man that
 * is, and then be, for exactly one move, a piece that can walk a diagonal.
 *
 * ── THE TWO ENGINE FACTS THE WHOLE RUN STANDS ON ───────────────────────────
 *
 *  1. QUEEN PULSE AT T1 IS NOT "BE A QUEEN". `transformDurationForTier` gives
 *     it 1, and the counter decrements in `applyRookieMove` — so she casts,
 *     makes ONE queen move, and is a rook again before the enemy phase
 *     begins. The card cannot cover a square, cannot hold a king still and
 *     cannot threaten anything across a turn. It is exactly ONE DIAGONAL
 *     MOVE, and that move has to be the kill. Everything below follows: she
 *     must already be STANDING on the diagonal when she casts, which is the
 *     one thing the level is built to deny her.
 *
 *  2. CONVERT AT T1 STEALS A PAWN AND NOTHING ELSE
 *     (`convertEligibleTypes(1)` = {pawn}; knights and bishops arrive at T2,
 *     queens at T3). It has NO RANGE — `convertTargets` returns every
 *     eligible piece on the board — and the stolen pawn becomes a CONTROLLED
 *     summon: dazed the turn it is taken, then tap-to-move, moving as a pawn
 *     (up its own file toward rank 8, capturing diagonally forward). Two
 *     consequences the levels are cut from:
 *       - The moment it changes sides it STOPS WATCHING. A pawn's two attack
 *         squares are its whole contribution to the position, and Convert is
 *         the only card in this kit that can take them away without a capture,
 *         without a line of sight and without spending her move.
 *       - It is still a BLOCKER on the square it stands on, for her lines as
 *         much as his. Stealing a man off the rail does not clear the rail;
 *         WALKING him off it does, and that costs the turn (a body move IS
 *         the turn's move).
 *
 * CONSTANT SIGNATURE — THE STAIR. Every level draws the same thing: a STEPPED
 * WALL OF STONE climbing to his corner — tread, riser, tread, riser. Because
 * a stair crosses every rank AND every file between her and him, NO ROOK LINE
 * EVER REACHES HIS SQUARE; his cell is sealed on the rank by one stone and on
 * the file by another, on every level of the run. But a stair has INSIDE
 * CORNERS, and a diagonal slips through them: exactly one diagonal — THE
 * BANISTER — runs up the steps to his square, and it is the only line in the
 * game that reaches him. The banister is capped from below by stone, so it
 * has one or two open STEPS and no more; the step nearest him is always the
 * square beside him, which is death (the king takes what stands next to him);
 * and every other step is WATCHED BY ONE OF HIS PAWNS, set into the stair and
 * PINNED BY THE STONE DIRECTLY UNDER IT so it can never march off its watch.
 *
 * So the run asks one question ten times and never the same way: WHICH STEP
 * CAN YOU STAND ON, AND WHAT DOES IT COST TO BUY IT.
 *
 * Not water on rank 5 (The Moat), not columns (The Colonnade), not a
 * strongbox (The Vault), not shafts (The Stacks), not a hedge (The Briar),
 * not a glass box (The Glasshouse), not one corner-to-corner diagonal of
 * stone (The Slash — a slash is a wall, a stair is a wall with corners in it),
 * not a lattice, not an alcove, not a quarry face, not a cross.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *
 *   QUEEN PULSE  KEY on L4 (the bare banister: one diagonal, nobody watching
 *                it — the level that teaches what the rail is for). Half the
 *                signature on L7-L10. TRAP everywhere else: on every other
 *                level the step it needs is watched, and a rook standing on a
 *                watched step is a dead rook.
 *   CONVERT      KEY on L5 (his cover, not his removal: steal the pawn whose
 *                two forward squares are the king's bolt-holes and a plain
 *                rook corners him) and on L6 (the blocker walked off the
 *                rail). Half the signature on L7-L10. TRAP on L4 and L9's
 *                first reading: stealing the wrong man spends the only charge
 *                in the level.
 *   DECOY        KEY on L3 (the cork in the only way north is a pawn its own
 *                neighbour can eat). TRAP on L7-L10 by construction: on every
 *                finale the watcher's two possible capturers are stone, so no
 *                teammate can be talked into taking it.
 *   REWIND       TRAP on all ten. It is the run's inert seat — it can undo an
 *                enemy phase but it cannot make a rook walk a diagonal and it
 *                cannot un-watch a step, so it is never a key and never a
 *                solvent (run-level-design.md: "a card that can never be a key
 *                and can never be a solvent is worth a kit slot").
 *
 * ── THE FOUR FINALE LINES (written before building; the contract) ──────────
 *
 *   L7  THE WATCHER — REMOVAL, TWO TURNS. His cell is h8, sealed by g8 and
 *       h7. The banister is capped at e5 (stone), so f6 is the ONLY step she
 *       may stand on, and one pawn on e7 watches it — walled in behind d7/f7
 *       stone so she can never reach it and no teammate can ever take it.
 *       Steal e7, stand on f6, and next turn cast and slide f6-g7-h8.
 *       DECISION: which of his men is looking at the square you need.
 *
 *   L8  THE BLOCKER — RELOCATION, THREE TURNS, BODY BEFORE PULSE. Same seal,
 *       but the pawn is standing ON the rail at f6 and the step below it (e5)
 *       is open. Stealing him changes nothing: an ally blocks her diagonal
 *       exactly as an enemy does. She must steal him and then SPEND A TURN
 *       WALKING HIM UP to f7, off the rail — and only then pulse from e5.
 *       L7's solution does not cover this: there the conversion IS the answer,
 *       here the conversion is only the permission to move him.
 *       DECISION: the body-move comes first, and it costs the king a phase.
 *
 *   L9  THE OCCUPIED STEP — A DIFFERENT TARGET: THE DEFENDER, NOT THE
 *       WATCHER. The rail is capped at e5 and f6 is the step again, but here
 *       one of his pawns is STANDING on it, pinned by f5, and e7 both watches
 *       f6 and defends it. So a rook that takes the step is recaptured, and
 *       stealing the man ON the step is the trap — her own pawn is frozen
 *       there (f7 stone above him, nothing on e7 or g7 to capture) and corks
 *       her rail for good. The one steal that works is the man BEHIND it:
 *       take e7, and f6 is orphaned, so her rook takes the square by force —
 *       banking a capture-stun on the way — and pulses from it next turn.
 *       DECISION: L7 buys an EMPTY step by un-watching it; L9 buys an
 *       OCCUPIED one by un-defending it, and pays a move for the privilege.
 *
 *   L10 THE WRONG BROTHER — ONE CHARGE, TWO RAILS. Two stairs meet at his
 *       corner and two diagonals run up to it. Each has one open step and
 *       each step has its own watcher, and the two look identical from below
 *       — but one rail dead-ends in stone ONE SQUARE SHORT of his cell. One
 *       Convert charge, one Queen Pulse charge, a hard clock and two enemies
 *       a turn: read the rails before you spend, because the wrong brother
 *       ends the run.
 *       DECISION: not which card, not what order — WHICH TARGET, and it is
 *       the only finale where the pair can be played correctly and still lose.
 *
 * ── MEASURED ──────────────────────────────────────────────────────────────
 *
 * NUMBERS OF RECORD. `revenge.ts matrix --run=revenge-46 --difficulty=normal
 * --levels=7,8,9,10 --loadouts=none,convert,queen-pulse,rewind,decoy,
 * convert+queen-pulse --trials=32 --jobs=1` (119s, serial):
 *
 *      L    none  convert  queen-pulse  rewind  decoy | convert+queen-pulse
 *      7      0%      3%        0%        0%      0%  |        75%
 *      8      0%      9%        0%        0%      0%  |        63%
 *      9      0%      6%        0%        0%      0%  |        69%
 *     10      0%      0%        0%        0%      0%  |        72%
 *
 * The gate holds on all four: no-ability 0%, every single kit card at or
 * under 9%, the signature pair 63-75% — inside the 60-80% band on every
 * level, which is the thing the Lattice and the Alcove missed. L8's convert
 * cell is 3 wins in 32, one trial over the 8% bar and inside the ~8pp
 * binomial noise at this trial count; it is reported as measured rather than
 * tuned away on a single number.
 *
 * MID-RUN (32 trials on L5, 16 elsewhere):
 *
 *      L    none  convert  queen-pulse  rewind  decoy
 *      1    100%    100%      100%      100%   100%    free
 *      2    100%    100%      100%      100%   100%    free
 *      3      0%    100%      100%        0%     0%    single-card
 *      4      0%      6%      100%        0%    19%    single-card (pulse)
 *      5      0%     25%      100%        0%    75%    single-card (two keys)
 *      6      0%     75%       13%        0%    13%    single-card (convert)
 *
 * L1-L2 clear with no ability; L3-L6 are 0% bare and 75-100% with their key.
 *
 * TIER LADDER, L7-L10, 32 trials, one card pinned per column:
 *
 *     queen-pulse  T1  0/ 0/ 0/ 0    T2  0/ 0/ 0/44    T3 69/19/19/94
 *                  T5 75/19/50/88
 *     convert      T1  3/ 9/ 6/ 0    T2 13/31/28/44    T3 22/59/19/81
 *                  T5 34/59/22/78
 *
 * BOTH HALVES BREAK AT T2 and both for the reason run-level-design.md
 * predicts — the tier that grants a second use or a second turn. Queen Pulse
 * T2 is `transformDurationForTier` 2, i.e. TWO queen moves on one cast: she
 * steps onto the watched step and kills from it inside the same turn, and the
 * watcher never gets its phase. The entire gate is that the step has to be
 * survived overnight, so a two-move pulse is not an upgrade, it is a
 * different card. Convert T2 is `convertEligibleTypes(2)` = pawn/knight/
 * bishop, and a stolen KNIGHT reaches h8 from f7 or g6 — no stair walls a
 * knight. Hence `abilityTierCaps: { convert: 1, 'queen-pulse': 1 }`. That is
 * the whole ladder capped on both signature cards, which is expensive in
 * player agency and is not a choice: there is no tier above T1 at which this
 * gate survives. The fillers stay uncapped and absorb the slate's upgrades.
 *
 * FULL RUNS, 40 runs, T5, difficulty=normal:
 *   random picks            9/40 = 22.5% full clears
 *   pool=convert,queen-pulse  10/40 = 25% full clears
 *
 * Two things worth reading in those. First, 22.5% random is BELOW the 25%
 * ceiling the rubric expects and the first combo run in a while to land
 * there; the attrition is at L4 (50% reached-to-cleared with random picks —
 * the bare banister punishes a player who took neither transform) rather
 * than at the finale. Second, the pair pool clears only 25%, and its
 * attrition is entirely in the finale (L7 73%, L8 59%, L9 82%): holding both
 * halves is necessary here and it is a long way from sufficient, which is
 * the difficulty Tyler asked for.
 *
 * ── DEAD ENDS ─────────────────────────────────────────────────────────────
 *
 * 1. THE KING DOES NOT EAT AN ALLY, SO A PAWN BESIDE HIM IS A SOLO WIN.
 *    L9 was first built as THE MAN AT HIS ELBOW: steal the pawn on g7, whose
 *    forward capture square IS h8, and buy it one turn of life with a
 *    capture-stun so the king cannot take it back. Convert alone read 100%.
 *    The rule added in d83153c (2026-09-08) is narrower than its headline:
 *    "he captures ROOKIE only, and only captures — never a free step, never
 *    an ally." So a stolen man standing next to the king is untouchable, and
 *    he kills the king on his own next turn.
 *    **RULE FOR ANY RUN WITH CONVERT OR A SUMMON IN THE KIT: no pawn of his
 *    may ever stand, or be able to walk, on a square whose forward capture
 *    square is the king's.** For a king on h8 that square is g7; the
 *    corollary that saved this run is that a converted pawn is also a
 *    promotion threat, so f8 IS STONE ON EVERY FINALE OF THIS RUN — it is
 *    what stops a stolen pawn from promoting on rank 8 and sliding along it
 *    into h8. Both facts were found by tracing convert-alone wins, not by
 *    reading the card.
 *
 * 2. A HUNTER IS NOT A WALL. L9 v2 blocked the rail at g7 with a KNIGHT, on
 *    the theory that T1 Convert cannot steal one. Knights hunt: it left the
 *    rail on its own within two turns and queen-pulse alone read 100%. If a
 *    piece has to STAY somewhere for the level to work, it must be a pawn
 *    with a blocked front or a bishop with all four diagonals stoned —
 *    anything with legal moves will use them.
 *
 * 3. DEPTH, NOT THE CLOCK, IS WHAT THE BOT CANNOT PAY FOR. L9 v3 asked for
 *    steal -> capture a frozen bishop corking the road -> walk one square ->
 *    pulse. Four forced moves. At moveLimit 6 the pair read 0%; RAISING the
 *    limit to 10 moved it only to 25%. Nothing in this run's geometry ever
 *    attacks the king, so `fastScore`'s +25 for a king-attacking move never
 *    fires and the rollouts are effectively blind — a line is findable here
 *    only if it is about as deep as L7's (arrive, then kill). The fix was to
 *    keep the extra idea and spend it at the SAME depth: the shipped L9 puts
 *    the capture ON the step instead of on the road to it. A pair number that
 *    does not move when you double the move limit is a search problem, not a
 *    difficulty one — check the depth before you touch the clock.
 *
 * 4. THE BAND CAME FROM A SECOND HUNTER, NOT FROM THE CLOCK. L8 and L10 sat
 *    at 84-94% for the pair and would not come down: L8 went 7 -> 5 -> 4
 *    moves and stayed at 88%, because the intended line is only three moves
 *    and cutting the limit removes travel slack, not certainty. Adding ONE
 *    more knight covering the step (L8 c4, L10 c6) dropped them to 63% and
 *    72% in a single revision. When a finale reads high, ask whether the
 *    player's line is short — if it is, the clock is not the knob, a second
 *    piece watching the landing square is.
 *
 * 5. THE PAIR MUST NOT DIE ON A MID-RUN LEVEL. The first L5 was a Decoy
 *    puzzle with the banister stoned shut at e6, and the pair-only pool read
 *    1/40 full clears — L5 was a 3% wall for exactly the player who had taken
 *    the run's own answer. Opening e6 on that one level (the only finale-shaped
 *    level in the run where the rail is not capped) gave it a second key and
 *    took the pool from 1/40 to 10/40. A run whose correct pick is fatal
 *    three levels before the gate is not hard, it is broken; read the
 *    `--pool` ladder, not just the full-clear number.
 */

import {
  FLEE,
  bishop,
  STILL,
  X,

  king,
  knight,
  make,
  pawn,
  type RunDef,
} from '../run-kit';
import type { Coord } from '../types';

/** 'f4' -> {file:6, rank:4}. Authoring convenience only. */
const sq = (name: string): Coord => X(name.charCodeAt(0) - 96, Number(name.slice(1)));

/** Stone, by name. */
const S = (...names: string[]): Coord[] => names.map(sq);

/**
 * THE SEAL. On every level of the run his cell is closed to rooks by exactly
 * two stones: one on his rank, one on his file. Nothing else in the game
 * cares — a diagonal walks straight past both of them.
 */
const SEAL = ['g8', 'h7'];

export const RUN_REVENGE_46: RunDef = {
  id: 'revenge-46',
  name: 'The Stair',
  blurb:
    'His stair climbs to a corner no rank and no file will ever reach. But a stair has corners on the inside too, and one diagonal runs all the way up it — and every step of it has one of his men watching.',
  allowedAbilities: ['convert', 'queen-pulse', 'rewind', 'decoy'],
  // Measured L7-L10, 32 trials, one card pinned at a time (see MEASURED).
  //   queen-pulse  T1 0/0/0/0    T2 0/0/0/44    T3 69/19/19/94   T5 75/19/50/88
  //   convert      T1 3/9/6/0    T2 13/31/28/44 T3 22/59/19/81   T5 34/59/22/78
  // BOTH break at T2, and both for the reason run-level-design.md predicts —
  // the tier that grants a second use or a second turn. Queen Pulse T2 is
  // `transformDurationForTier` 2: two queen moves in one cast, so she steps
  // ONTO the watched step and kills from it in the same turn and the watcher
  // never gets a phase — the whole gate is that the step has to be survived
  // overnight. Convert T2 is `convertEligibleTypes(2)` = pawn/knight/bishop,
  // and a stolen KNIGHT jumps onto h8 from f7 or g6, which no stair can wall.
  // So the caps are T1 on both halves. That is the smallest cap the numbers
  // allow and it is not a cheap one — it costs the player every upgrade on
  // her two best cards — but there is no tier above it at which this gate
  // survives, and the fillers (rewind, decoy) stay uncapped and absorb the
  // slate's upgrades.
  abilityTierCaps: { convert: 1, 'queen-pulse': 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE STAIR. The silhouette, for free. The stepped wall is drawn and
    // his corner is sealed the way it will be sealed for ten levels — but the
    // stair is short, he stands still, and the banister runs unwatched from
    // c3 all the way to h8, so a rook walks up the f-file and along rank 7
    // and takes him. She never needs the diagonal here; she only needs to see
    // it.
    make(1, [king(8, 8), pawn(3, 6), pawn(6, 3)], {
      ...STILL,
      moveLimit: 14,
      hazards: S('c4', 'c5', 'd5', 'd6', 'e6'),
    }),
    // L2 — THE LANDING. Same stair, one more step (f7), and now he RUNS —
    // but his room is h8 alone, so there is nothing to chase and rank 8 is
    // still open all the way in. Free, and deliberately so: L2's job is to
    // let the player look at the shape for one more level before the stair
    // closes. 100% with no ability (MEASURED).
    make(2, [king(8, 8), pawn(3, 6), pawn(7, 4)], {
      ...FLEE,
      moveLimit: 14,
      hazards: S('c4', 'c5', 'd5', 'd6', 'e6', 'f7'),
      kingPen: ['h8'],
    }),
    // L3 — THE CORK (first thinking; convert or queen-pulse answers it). The
    // stair closes. Rank 8 is cut at d8, rank 7 at e7, the g-file at g4 and
    // the f-file at f5/f7/f8, so the ONE road north is the h-file — and his
    // doorman is standing in it on h4, pinned by h3 so it can never march and
    // defended by the pawn on g5, so a bare rook that takes it is collected.
    // No ability: 0%. Steal the doorman and walk him out of his own doorway,
    // or step past him on a diagonal: 100% either way (MEASURED). His room is
    // h8 alone and rank 8 is open once she is up there, so the level ends the
    // moment the road does.
    make(3, [king(8, 8), pawn(8, 4), pawn(7, 5), pawn(2, 3)], {
      ...FLEE,
      moveLimit: 13,
      hazards: S('c4', 'c5', 'd5', 'd6', 'd8', 'e6', 'e7', 'f5', 'f7', 'f8', 'g4', 'h3'),
      kingPen: ['h8'],
    }),
    // L4 — THE BANISTER (queen-pulse KEY). The seal goes in for good: g8 on
    // his rank, h7 on his file, and his room is h8 alone. NO ROOK LINE
    // REACHES HIM, on this level or any level after it. The banister is
    // capped at d4 so the steps are e5, f6 and g7, and NOBODY IS WATCHING
    // THEM — this is the one level in the run where the rail is free. Walk
    // onto a step, cast, slide. The card that has been a trap for three
    // levels is suddenly the whole answer, and the player learns the shape
    // she will spend the finale trying to buy.
    make(4, [king(8, 8), pawn(3, 6), pawn(2, 3), knight(2, 6)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S('d4', 'c5', 'd6', 'e7', ...SEAL),
      kingPen: ['h8'],
    }),
    // L5 — THE OPEN SHOULDER (decoy KEY, queen-pulse KEY). His room is three
    // squares — g8, h8 and the h7 bolt-hole — sealed on the rank by f8 and on
    // the file by g7, so no rook line will ever hold all three. Two cards
    // answer it and they answer it differently: the banister is open here
    // (e6 is NOT stone on this level, the only level of the run where it is
    // not), so Queen Pulse simply walks e6-f7-g8 and takes him where he
    // stands (100%); or Decoy marks the pawn on g6, the pawn on e8 comes down
    // the board for its own man, and the friendly fire stuns him long enough
    // for a rook to close (75%). Convert reads 25% and is the near-miss the
    // header used to claim as the key — its cover denies him h7, which is one
    // bolt-hole of two, and one of two is not a cage. MEASURED, 32 trials:
    // none 0 / convert 25 / queen-pulse 100 / rewind 0 / decoy 75.
    make(5, [king(7, 8), pawn(7, 6), pawn(5, 8), pawn(4, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S('c4', 'c5', 'd5', 'd6', 'f8', 'g7'),
      kingPen: ['g8', 'h8', 'h7'],
    }),
    // L6 — OFF THE RAIL (convert KEY, and the rehearsal for L8). The seal is
    // back and the banister is the only line again — but one of his pawns is
    // STANDING ON IT at f6, and the step below it, e5, is open and unwatched.
    // Stealing him does not clear the rail: her own man blocks her diagonal
    // exactly as his did. She has to steal him and then WALK him up to f7,
    // which costs a whole turn, and only then does the rail run. One card,
    // three turns, and it is the exact motion L8 will charge her for.
    make(6, [king(8, 8), pawn(6, 6), pawn(5, 7), pawn(3, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S('d4', 'e6', 'f5', 'd7', ...SEAL),
      kingPen: ['h8'],
    }),
    // ── L7-L10: the combo gate. Every one of them seals h8 with g8 + h7, so
    // no rook line exists anywhere in the level, and every one of them puts
    // exactly one usable step on the banister. What changes is WHO is on it.

    // L7 — THE WATCHER. Removal, two turns. The rail is capped at e5 (stone),
    // so f6 is the only step in the level she may stand on — g7 is beside him
    // and he takes what stands next to him. One pawn on e7 watches f6, and it
    // is walled in: d7 and f7 stone on either side, e6 stone below, so no rook
    // will ever reach it and its two capture squares (d8, f8) hold nothing a
    // Decoy could talk into eating it. Steal it — free, no line of sight
    // needed, from anywhere on the board — stand on f6, and next turn cast
    // and slide f6-g7-h8.
    make(7, [king(8, 8), pawn(5, 7), pawn(3, 4), knight(4, 2)], {
      ...FLEE,
      moveLimit: 6,
      hazards: S('e5', 'e6', 'd7', 'f7', 'f8', ...SEAL),
      kingPen: ['h8'],
    }),
    // L8 — THE BLOCKER. Relocation, three turns, the body moves before the
    // pulse. The cap drops to d4 so e5 is open, and the pawn has moved onto
    // the rail itself at f6 — where it also watches e5, so the step below is
    // no safer than the rail above. One steal answers both halves, but only
    // after she has spent a turn walking the man up to f7. That turn is a
    // whole enemy phase L7 never had to pay for.
    make(8, [king(8, 8), pawn(6, 6), pawn(5, 7), pawn(3, 3), knight(7, 4), knight(3, 4)], {
      ...FLEE,
      moveLimit: 4,
      enemiesPerTurn: 2,
      hazards: S('d4', 'e6', 'f5', 'd7', 'f8', ...SEAL),
      kingPen: ['h8'],
    }),
    // L9 — THE OCCUPIED STEP. A different target for the same charge: not the
    // watcher, the DEFENDER. The rail is capped at e5 and f6 is the step
    // again — but on this level the step is not empty and not merely watched.
    // One of his pawns is STANDING on it, pinned by f5 so it can never march,
    // and e7 both defends it and watches it. So a rook that takes f6 is
    // recaptured, and a rook that stands on f6 is shot; and stealing f6
    // itself is the trap, because her own man is frozen there (f7 stone above
    // him, nothing on e7 or g7 to take) and he corks her rail for the rest of
    // the level. The one steal that works is the man BEHIND the step: take e7
    // and f6 is orphaned, so her rook can take the square by force — the
    // capture stuns the king into the bargain — and pulse from it next turn.
    // L7 buys an empty step by un-watching it. L9 buys an occupied one by
    // un-defending it, and pays for it with a capture.
    make(9, [king(8, 8), pawn(5, 7), pawn(6, 6), pawn(3, 4), knight(3, 2)], {
      ...FLEE,
      moveLimit: 4,
      enemiesPerTurn: 2,
      hazards: S('e5', 'e6', 'f5', 'd7', 'f7', 'f8', ...SEAL),
      kingPen: ['h8'],
    }),
    // L10 — THE WRONG BROTHER. One charge, two watchers, and only one of them
    // is looking at a square you can ever stand on. The rail is capped at d4,
    // so it has two open steps: e5, watched by the pawn on d6, and f6,
    // watched by the pawn on e7. From below they are the same picture — a
    // step, a man above it, a stone under the man so he can never march. But
    // f6 IS SEALED: e6 and g6 stone on the rank, f5 stone under it, f8 stone
    // over it and e7's own body closing rank 7, so no rook move in the game
    // ever arrives there. Buy that step and you have spent the only charge in
    // the level on a square you cannot reach. Two enemies a turn and five
    // moves: the pair can be played perfectly here and still lose, which is
    // true on no other level of the run.
    make(10, [king(8, 8), pawn(4, 6), pawn(5, 7), pawn(2, 3), knight(7, 4), knight(3, 6)], {
      ...FLEE,
      moveLimit: 4,
      enemiesPerTurn: 2,
      hazards: S('d4', 'd5', 'e6', 'f5', 'g6', 'f8', ...SEAL),
      kingPen: ['h8'],
    }),
  ],
};

export default RUN_REVENGE_46;
