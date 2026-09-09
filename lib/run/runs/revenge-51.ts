/**
 * revenge-51 — THE ESPALIER. Built 2026-09-09 for the signature pair
 * CONVERT + SMOKE. Kit = convert / smoke / magnet / aegis
 * (`allowedAbilities` IS the kit). All four cards are LIVE.
 *
 * CONCEPT (A): an unbuilt pair the discovery harness has already proved can
 * gate — `convert+smoke` gates TWO generated levels with a UNIQUE answer
 * (moat-L7-v16-s251 at 63% under the kit [convert vanguard smoke
 * summon-knight]; checker-L10-v13-s252 at 60% under [queen-pulse vanguard
 * convert smoke]), and in both every single card in the kit reads 0%
 * (data/run-playtest/combo-library/convert+smoke/). It is the only unbuilt
 * pair in SYNERGY.md with two unique-answer levels that contains neither
 * knight-hop, nor swap, nor bishop-step. CONVERT is one of the two thinnest
 * signature sockets left in the catalogue (two shipped runs in 253 pairs:
 * convert + summon-knight, The Cliff; convert + queen-pulse, The Stair) and in
 * neither was the theft's one distinguishing brake — that a stolen man is
 * DAZED for the turn you steal him — the point of the level. SMOKE has been
 * half of three (smoke + rabies-dart, The Alley; queen-pulse + smoke, The
 * Turnstile; gauntlet + smoke, The Pinch) and in all three its job was what
 * the court does to ROOKIE. Here its job is what the court does to SOMEBODY
 * ELSE, and Rookie never goes near him at all.
 *
 * THE VERB: TURN ONE OF HIS OWN MEN, WALK HIM UP, AND HIDE ON THE BEAT HE
 * ARRIVES. Not crossing a wall (The Moat), not baiting hunters (The Alley),
 * not a poison timer (The Switchback), not blowing a hole (The Briar), not
 * caging with his own guard (The Alcove), not a double door (The Millstone),
 * not a two-rook net (The Parapet), not buying a body time (The Lattice), not
 * moving the wall (The Quarry), not an undo (The Dogleg), not a capture you do
 * not survive (The Picket), not a lure (The Pinch), not zugzwang (The Niche),
 * not aim (The Rood), not crowning him (The Coronation), not breaking a ring
 * at the corner (The Kennel), not being the door (The Oubliette), not growing
 * a rook in a room with no door (The Murder Hole). Every one of those is about
 * a body ROOKIE puts on the board, or a square ROOKIE stands on. This run does
 * neither: on all four finales Rookie has no line to him, no square beside him
 * and no capture available anywhere on the board. The killer is already
 * standing in his own livery three squares from the throne, and the whole
 * question is what it costs to change whose man he is.
 *
 * ── CONSTANT SIGNATURE — THE ESPALIER ──────────────────────────────────────
 * An espalier is a fruit tree nailed flat against a wall: the trunk is pinned,
 * every branch is tied, and nothing on it grows where it likes. Every level of
 * this run draws one, out of three rules that never change:
 *
 *   1. EVERY PAWN STANDS ON A STONE SILL — stone directly BENEATH it. Black
 *      pawns advance toward rank 1, so this is what stops his army marching
 *      and draining the files it stands in (`.claude/run-level-design.md`,
 *      "Pawn walls march"). Nothing of his ever moves on its own.
 *   2. NO MAN IS EVER CROWNED. The square a turned pawn would promote on is
 *      stone on every level (`applyControlledAllyMove` turns an ally pawn
 *      reaching rank 8 into a controlled QUEEN, which would be a solvent in
 *      every level below). A stolen man climbs at most to rank 7 and stops.
 *   3. THE KING LIVES IN A NICHE WITH ONE SEALED DOOR. Every orthogonal
 *      neighbour of his square is stone; the only opening is a DIAGONAL, and
 *      that diagonal's own rank and file are stone too, so no rook line in the
 *      game reaches it. Rookie can neither stand in his door nor attack it nor
 *      deny it. It exists for exactly one piece on the board: him.
 *
 * The silhouette is a scatter of stone-pawn-stone brackets climbing toward a
 * back-rank cell — not a band across rank 5 (The Moat), not pillars (The
 * Colonnade), not a sealed strongbox (The Vault), not offset bars (The
 * Switchback), not a two-deep hedge (The Briar — a hedge is a mass that
 * defends itself and marches; an espalier is single file and cannot move at
 * all), not a glass box (The Glasshouse), not shafts (The Stacks), not a
 * corner-to-corner diagonal (The Slash), not an alley, not a lattice, not a
 * doorstep alcove, not a rail of balusters (The Balcony — the Balcony's
 * sentries ARE the wall; here the nailed pawns are the only weapons in the
 * level and the wall is stone), not a niche with dogs at its corners (The
 * Kennel), not a pit (The Oubliette), not a blind corridor (The Murder Hole).
 * The nearest relative is The Squint, whose king also sits in a blind cell
 * with one diagonal doorstep — and the difference is the whole run: the
 * Squint's doorstep is a square you get SWAPPED onto, and this one is a square
 * NOTHING of yours can ever occupy.
 *
 * ── WHY THIS PAIR, read out of lib/run/abilities.ts and lib/run/pawn-ai.ts ──
 *
 *   1. `applyTargeted` for 'convert' (abilities.ts:2267) makes the stolen piece
 *      a CONTROLLED summon with `dazed: true`. `canMoveAllyAt` (3930) refuses
 *      to move a dazed ally, so the theft always costs one full enemy phase
 *      before the man can act.
 *   2. `controlledThreatensSquare` (4122) reads `controlledAllyLegalMoves`,
 *      which does NOT check `dazed`. So the king sees the sleeping man and
 *      FLEES on exactly the phase the man cannot act — through a door the man
 *      is nailed too tightly ever to follow him through.
 *   3. `kingReaction` (pawn-ai.ts:498): `if (isSmoked(state) && !answering &&
 *      !panicking) return null` — under Smoke he does not flee AT ALL, not
 *      from Rookie and not from a controlled summon. T1 Smoke is exactly ONE
 *      enemy turn (`smokeTurns`), which is exactly the length of the daze.
 *   4. `kingCaptureMoves` (pawn-ai.ts:225) — the king only ever captures
 *      ROOKIE. He will stand all level on a square his own turned pawn attacks
 *      and never take it, which is what makes a shoulder man a stable weapon.
 *   5. But Smoke does NOT protect the man. The capture pass (pawn-ai.ts:854)
 *      skips Rookie's square when `smoked` and keeps every ALLY square on its
 *      target list. Anything with a line to the stolen man eats it while it
 *      sleeps, invisible Rookie or not — which is L9 and L10's whole trap.
 *   6. Convert has UNLIMITED RANGE (`convertTargets` filters by type, never by
 *      distance) and both halves are free actions. So the pair costs Rookie no
 *      walking whatever, and EVERY finale has to find its difficulty
 *      somewhere else. In this run it is the MAN'S walk, not hers: he starts a
 *      rank below the shoulder and has to climb it, and a body-move is a whole
 *      turn.
 *   7. `breakSmokeOnCapture` (abilities.ts:3218): below T5, Rookie's own
 *      capture ends the cover on the beat she makes it.
 *
 * ── THE ONE FACT THAT SHAPED EVERY FINALE ──────────────────────────────────
 * **ANY CAPTURE CREDITED TO HER SIDE STUNS THE KING FOR ONE TURN, AND ONE TURN
 * IS EXACTLY WHAT THE SMOKE BUYS.** A stunned king does not flee; so on any
 * board where Rookie can capture ANYTHING on the turn the theft goes live, the
 * capture is a free Smoke and the pair is not a pair. The first build of this
 * run measured convert-alone at 94/75/31/25 for exactly that reason: the bot
 * converted the shoulder man as a free action and took a pawn with the same
 * turn's move. So: **no finale in this run contains a single piece Rookie can
 * capture** — every pawn has stone on its rank and its file, and the two
 * hunters on L9/L10 can be taken only on a turn that is useless.
 * The walk is what makes it stick: the arrival turn's move belongs to the
 * BODY, so a capture can never be timed to the phase that matters.
 *
 * ── WHY EACH HALF IS DEAD ALONE (measured 0% on all four, every tier) ──────
 *   convert alone — the man climbs, the king glances at him and steps through
 *     a door nothing of hers can touch. The man is nailed; he can never
 *     follow. One charge, one wasted step.
 *   smoke alone — he stands perfectly still and it buys nothing, because
 *     ROOKIE HAS NO LINE TO HIM AND CANNOT ACQUIRE ONE.
 *   magnet alone — pulls the first enemy along her CURRENT form's lines. Her
 *     lines never enter his court, and a king cannot be pulled below T5.
 *   aegis alone — blocks one capture. Nothing in any finale ever attacks her.
 *
 * ── KIT: convert / smoke / MAGNET / AEGIS ──────────────────────────────────
 * No universal solvent: bishop-step, knight-hop and become-king are absent and
 * each would break every level (a diagonal or an L-jump reaches a square whose
 * rank and file are both stone, which is the whole signature). The fillers
 * were chosen against three rules this geometry forces:
 *   **NO FILLER MAY STOP THE KING MOVING.** freeze-ray, snare, decoy,
 *     hourglass, scarecrow, panic, chequer, coup and gauntlet all buy the phase
 *     Smoke buys and would each be half of a rival gate. Disqualified before a
 *     square was drawn — as was rewind, which un-does the very flee the theft
 *     provokes, and poison-dart and boulder, whose deaths and crushes are
 *     capture-stuns on a timer (see the fact above).
 *   **NO FILLER MAY MAKE OR EAT A BODY.** rabies-dart eats your nearest body
 *     beside any summon and a converted man IS a summon; sacrifice detonates
 *     one (a pawn's blast is its two diagonals — it would kill the king from
 *     the shoulder with no daze at all); swap wears one.
 *   MAGNET pulls along her lines, which never reach his court. `magnet+smoke`
 *     (14 levels) and `magnet+convert` (12) are both on SYNERGY.md's proven
 *     never-gates list.
 *   AEGIS is 0% on every finale at every tier because nothing there ever tries
 *     to capture her. It earns its slot mid-run, where it is the key on L3 and
 *     a second answer on L4 and L5.
 *
 * ── PER-CARD KEY / TRAP MAP (measured, see MID-RUN below) ──────────────────
 *   L        convert          smoke            magnet        aegis
 *   1-2      trap             trap             trap          trap  (bare wins)
 *   3        second key       trap             trap          KEY
 *   4        second key       trap             partial       KEY
 *   5        trap             KEY              trap          second key
 *   6        KEY (clean)      trap             trap          trap
 *   7-10     half the gate    half the gate    trap          trap
 * L5 teaches what Smoke does to a king who will not stand still; L6 teaches
 * what a turned man does to a king with nowhere to stand — it is the only
 * level in the run where his niche has NO door, and therefore the only one
 * where the theft needs no cover. L7 is the first level where he has one.
 *
 * ── THE FOUR FINALE LINES (they differ; each adds what L7 does not cover) ──
 *
 *   L7  THE WALK. His door is c7 and it is sealed from the whole board (b7,
 *       c6, c8 stone). The shoulder square e7 is EMPTY: his nearest man is a
 *       rank below it on e6, where both diagonals (d7, f7) are stone and he
 *       threatens nobody. So the theft buys nothing on the turn it is made —
 *       the man has to WALK, one square, one body-move, one whole turn — and
 *       the smoke belongs to the ARRIVAL, not to the theft. Steal, then step
 *       and vanish, then strike. Spend the cover early and it is gone before
 *       it is needed.
 *       DECISION: the TIMING of the cover.
 *
 *   L8  THE MAN CLOSES THE OTHER DOOR. Same walk, and e8 is empty: he has TWO
 *       doors and she has one body. An ally pawn's FORWARD step is a legal
 *       move onto an EMPTY square, so `controlledThreatensSquare` counts the
 *       square directly above a stolen pawn as covered — while it is empty.
 *       Stepping onto e7 therefore does two opposite things in one beat: the
 *       DIAGONAL threatens d8 because the king is standing on it, and the
 *       FORWARD step covers e8 because nobody is.
 *       DECISION: the POLARITY of a pawn — cover needs an empty square, a kill
 *       needs an occupied one — which L7's line never has to notice.
 *
 *   L9  TWO SHOULDERS, ONE WATCHED. Both of his diagonals are open and there
 *       is a man a rank under each (c6, e6). His pawn on f8 can never move and
 *       attacks e7, the east shoulder: steal the east man and the gun eats him
 *       on the phase he is asleep, and the smoke does nothing about it (fact 5
 *       above). The gun's own rank and file are sealed, so it cannot be
 *       answered, only avoided. A QUEEN patrols the floor.
 *       DECISION: the TARGET, and the first level where the wrong theft is not
 *       merely wasted but fatal.
 *
 *   L10 THE OTHER HAND. The niche is mirrored — king e8, shoulders d7 and f7,
 *       men on d6 and f6 — AND SO IS THE TRAP: the gun is his pawn on c8 and
 *       it watches the WEST shoulder this time. Every reflex L9 has just built
 *       points at the man who dies. His door is e7, sealed like all of them.
 *       DECISION: the same target question with the answer reversed, on a
 *       board whose whole geometry is the mirror of the one just learned.
 *
 * ── MEASURED — 2026-09-09, difficulty=normal, `revenge.ts matrix` ──────────
 * Numbers of record: 32 trials, `--jobs=1`, the run's own 4-card kit, T1 cards.
 *
 *   L    none  convert   smoke  magnet   aegis | convert+smoke
 *   7      0%      0%      0%      0%      0%  |      72%
 *   8      0%      0%      0%      0%      0%  |      59%
 *   9      0%      0%      0%      0%      0%  |      81%
 *  10      0%      0%      0%      0%      0%  |      84%
 *
 * THE GATE IS MET AND IT IS CLEAN: no ability and every single card in the kit
 * read 0% on all four finales — 20 cells of zero — and the pair means 74%.
 * Nothing reads 100%, which is what Tyler asked for after the Lattice and the
 * Alcove; L7 and L9 sit inside the 60-80 band, L8 is one point under it and
 * L10 four over. `convert+aegis` was measured separately and reads 0/0/0/0:
 * the pair is the UNIQUE answer to all four levels, not merely one of them.
 *
 * TIER LADDER, L7-L10, 32 trials, jobs=1, one card pinned per invocation:
 *   convert  T1 0/0/0/0   T2 0/0/0/0   T3 100/6/0/0   T4 100/0/0/0
 *            T5 100/3/0/0
 *   smoke    T2-T5 0/0/0/0        magnet T5 0/0/0/0     aegis T5 0/0/0/0
 * The break is the tier that grants a SECOND CHARGE, exactly as the doc
 * predicts: `maxUsesForTier('convert')` is 1/1/2/2/2, and with two thefts L7
 * needs no cover at all — steal the man, walk him up, and when the king steps
 * out of the door steal whoever is standing on his NEW shoulder. Smoke,
 * Magnet and Aegis have no mechanism here at any strength, so only one card is
 * capped: **`abilityTierCaps: { convert: 2 }`**.
 *
 * MID-RUN, 16-32 trials, jobs=3:
 *   L    none  convert   smoke  magnet   aegis
 *   1    100%    100%    100%    100%    100%
 *   2    100%    100%    100%    100%    100%
 *   3      0%    100%      0%      0%    100%   (aegis KEY, convert also wins)
 *   4      0%    100%      0%     44%    100%   (aegis/convert; magnet partial)
 *   5      0%      0%     75%      0%    100%   (smoke KEY, aegis also wins)
 *   6      0%    100%      0%      0%      0%   (convert KEY, clean)
 * L1-L2 free bare, L3-L6 impossible bare — the mid-run contract holds. Two of
 * the four are NOT single-key, and both leaks are the same card and the same
 * cause: on any level where Rookie can reach a square adjacent to the king,
 * AEGIS wins it, because his capture of her is BLOCKED and it has still spent
 * his action for the phase, so she takes him next turn. That is The Picket's
 * mechanism arriving uninvited. It cannot be designed out of a level that also
 * wants Smoke or Magnet to be its key — a card whose payoff needs a LINE
 * cannot be gated against a card whose payoff needs PROXIMITY (The Murder
 * Hole, DEAD END 2, same finding from the other side) — and it costs the
 * finale nothing, because there she is never within reach of anything.
 *
 * FULL RUNS, 40 runs, T5, difficulty=normal:
 *   random picks from the whole kit    9/40 = 23%   (L6 71%, L7 68%, L8 60%)
 *   `--pool=convert,smoke`            16/40 = 40%   (L3 65%, L7 83%, L8 80%)
 * 23% random is inside the Moat's 10-25% target — unusually so for a combo run
 * (Vault 28%, Briar 55%, Glasshouse 43%) — and the reason is visible in the
 * ladder: this run's wall is not the finale, it is L6, where the theft is the
 * only answer and a random picker who skipped Convert stops. Note the pair
 * pool's own weak level is L3, which Convert clears and Smoke does not.
 *
 * ── DEAD ENDS ──────────────────────────────────────────────────────────────
 *
 * 1. ANY CAPTURE IS A FREE SMOKE, AND THAT IS A FACT ABOUT THE WHOLE GAME.
 *    The first finale gave the shoulder man a "gun" — a nailed pawn on e8
 *    trained on him — on the theory that the gun had to die before the theft.
 *    It read convert-alone 94/75/31/25. The trace is three lines long: the bot
 *    casts Convert as a FREE action and then captures the gun with the same
 *    turn's move; the capture stuns the king for one turn (engine.ts:123); the
 *    stun covers precisely the phase the daze needs covering; the man wakes and
 *    kills him. **A one-turn stun and a T1 smoke are the same card**, so a
 *    combo whose second half is "he must not move for one phase" can only be
 *    gated on a board where ROOKIE CAN CAPTURE NOTHING. Six geometries were
 *    thrown away before that was written down. The corollary is the fix that
 *    shipped: give the payoff a BODY-MOVE (the walk), because the turn the ally
 *    steps is a turn Rookie does not move at all, and a capture can therefore
 *    never be timed to the phase that matters.
 *
 * 2. A DOOR YOU CAN ATTACK FROM ONE SQUARE BACK IS NOT A DOOR. The second
 *    finale made the king's single flight square c7 a place ROOKIE had to
 *    STAND — he takes what stands next to him, so only the smoke lets a body
 *    be there. It read convert-alone 94%: she does not have to stand in the
 *    door, she only has to ATTACK it, and c6 attacks c7 from outside his reach.
 *    Making c6 lethal is topologically impossible — the only black pawns that
 *    cover c6 are on b7 and d7, and nailing either of them takes away the last
 *    square she can reach c6 from. **A flight square is only proof against a
 *    rook if NO square attacks it at all**, which means its rank and its file
 *    must be stone and Rookie must never be able to occupy it either. Every
 *    door in the shipped run is sealed that way, and the smoke is then the only
 *    thing in the kit that touches the flee at all.
 *
 * 3. A TWO-BODY-MOVE FUSE IS INVISIBLE TO THE BOT; A ONE-BODY-MOVE FUSE IS THE
 *    RUN. A striker four ranks below the shoulder read 0% for the pair at every
 *    clock — the bot shuffled on rank 2 and never cast Convert at all. Two
 *    ranks read 0% as well, at moveLimit 6 AND 8. One rank reads 59-84%. The
 *    horizon is that sharp, and it is the same wall as the Glasshouse's
 *    "provable but unfindable": the theft is only findable when the payoff is
 *    the NEXT decision, not the one after it.
 *
 * 4. THE CLOCK IS NOT A KNOB IN THIS RUN AND A HUNTING QUEEN IS. L8 read 59%
 *    at moveLimit 5 and 59% at 6; L10 read 91% at 3 and 91% at 4; L9 read 97%
 *    at 4, 5 and 6. That is The Kennel's DEAD END 3 reproduced exactly — a
 *    clock is a knob for a level the bot sometimes misplays and no knob at all
 *    for one it plays perfectly. What DID move L9 and L10 was one QUEEN on the
 *    floor: 97% -> 81% and 91% -> 84%, because she is the one piece that can
 *    reach Rookie on the two unsmoked turns of a three-turn line. A knight
 *    beside her was violently non-monotonic (L10 read 44% with it on f2, 100%
 *    on g2, 91% on h2, 28-41% anywhere on rank 1) and was cut: a knob that
 *    swings 56 points on one square is noise, not difficulty.
 *
 * 5. THE FALSE SHOULDER CANNOT SHARE A BOARD WITH THE WALK. The decoy that
 *    L9 was designed around — a nailed pawn on d7, directly beneath the king,
 *    which can never touch him because an ally pawn's forward step needs an
 *    empty square — reads 0% for the PAIR, not for the single. A black pawn on
 *    d7 attacks c6 and e6, and e6 is where the striker starts: the decoy is a
 *    gun on the man you have to steal, so the theft dies on the phase it is
 *    made. The idea survives as L9/L10's watched shoulder, where the gun is on
 *    rank 8 and covers the ARRIVAL square instead of the starting one.
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
} from '../run-kit';
import type { Coord } from '../types';

/** 'f4' -> {file:6, rank:4}. Authoring convenience only. */
const sq = (name: string): Coord => X(name.charCodeAt(0) - 96, Number(name.slice(1)));

/** Stone, by name. */
const S = (...names: string[]): Coord[] => names.map(sq);

/**
 * THE BOXED BISHOP — the gun that can only ever be screened, used on L8, L9
 * and L10. It stands on e4. Its rank (d4, f4) and its file (e3, e5) are stone,
 * so NO ROOK LINE WILL EVER TOUCH IT. Three of its four diagonals are stone
 * (d3, d5, f3), so the only direction it has is up-right, along e4-f5-g6-h7 —
 * the one diagonal in the level that ends on the striker. g4 and h5 keep it on
 * that diagonal if it ever advances.
 */
const BOXED_BISHOP_E4 = ['d3', 'd4', 'd5', 'e3', 'e5', 'f3', 'f4', 'g4', 'h5'];

/**
 * THE EAST WALL — the sealed room used on L8, L9 and L10: king on g8, his one
 * flight square f8, and the striker nailed on h7 between h6 and h8. No rank and
 * no file she can occupy ever touches f8 or g8 (f7 kills the f-file, e8 kills
 * rank 8, g7 kills the g-file, h6 kills the h-file), and rank 7 is stone from
 * a7 to g7 so nothing walks along it either.
 */
const EAST_WALL = [
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7',
  'e8', 'h6', 'h8',
];

export const RUN_REVENGE_51: RunDef = {
  id: 'revenge-51',
  name: 'The Espalier',
  blurb:
    'Every pawn in his garden is nailed to the wall — stone under it so it can never march, stone over it so it can never be crowned. One act is left to it for the whole level: a diagonal strike. And one of them is standing at his shoulder. It is not your man. Yet.',
  allowedAbilities: ['convert', 'smoke', 'magnet', 'aegis'],
  // Measured L7-L10, 32 trials, jobs=1, one card pinned per invocation:
  //   convert  T1 0/0/0/0  T2 0/0/0/0  T3 100/6/0/0  T4 100/0/0/0  T5 100/3/0/0
  //   smoke, magnet, aegis — 0/0/0/0 at EVERY tier; none of them has a
  //   mechanism in this geometry at any strength.
  // T3 is the first Convert tier with TWO charges (maxUsesForTier: 1/1/2/2/2),
  // and on L7 two thefts solve the level without the cover: steal the man,
  // walk him up, and when the king steps out of the door steal the man who is
  // now on HIS new shoulder. The highest tier at which every single kit card
  // still reads <= 8% is 2.
  abilityTierCaps: { convert: 2 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // ── L1 — THE WALL. The silhouette, for free: three nailed pawns standing
    // in their stone brackets, and a king who does not run with the whole
    // b-file open under him. Pure rook play; the espalier is scenery.
    make(1, [king(2, 8), pawn(6, 6), pawn(4, 4), pawn(7, 3)], {
      ...STILL,
      moveLimit: 12,
      hazards: S('f5', 'f7', 'd3', 'd5', 'g2', 'g4', 'c8', 'a8'),
    }),
    // ── L2 — THE WALL, AND HE RUNS. Same brackets, a 1x2 room at b7/b8 — and
    // a rook standing anywhere on the b-file attacks BOTH of its squares, so
    // he has nowhere to step. One knight is parked in the file: take it (any
    // capture of hers stuns him a turn) and finish underneath.
    make(2, [king(2, 7), knight(2, 4), pawn(6, 6), pawn(7, 3)], {
      ...FLEE,
      moveLimit: 14,
      kingPen: ['b7', 'b8'],
      hazards: S('f5', 'f7', 'g2', 'g4', 'a7', 'a8', 'c7', 'c8'),
    }),
    // ── L3 — THE DEFENDED PLUG (aegis KEY). His cell is one square, g8, and
    // the only road in is rank 8 from the west — plugged by a nailed pawn on
    // f8 (f7 under it). The plug is defended by a bishop frozen on g7: f6, h6
    // and h8 are stone and its fourth diagonal is its own pawn, so it can
    // never move and can never be reached (f7 and h7 stone kill rank 7, g6
    // kills the g-file). Take the plug and the bishop takes you back.
    //   d8 is stone, so the only square she can stand on along rank 8 is e8 —
    // one square from the plug, which is exactly one square too close for a
    // Magnet (`magnetTargets` requires distance >= 2). Smoke cannot do it
    // either: her own capture ends the cover on the beat she makes it.
    make(
      3,
      [king(7, 8), pawn(6, 8), bishop(7, 7)],
      {
        ...FLEE,
        moveLimit: 10,
        kingPen: ['g8'],
        hazards: S(
          'f7', 'h7', 'h8', 'f6', 'h6', 'g6', 'd8',
          'a7', 'b7', 'c7', 'd7',
          'g5', 'h5',
        ),
      },
    ),
    // ── L4 — THE SHAFT (magnet KEY). One square wide, the g-file from g4 to
    // g8, with the king at the top of it. The plug is a bishop on g6, frozen
    // (f5, h5 stone; f7 and h7 are his own nailed pawns) and defended TWICE —
    // by f7 and by h7, both of which attack g6 and neither of which can ever
    // move. One shield is one short. Stand under it and pull it down the
    // shaft onto a square neither pawn covers, take it there, and climb.
    make(
      4,
      [king(7, 8), bishop(7, 6), pawn(6, 7), pawn(8, 7)],
      {
        ...FLEE,
        moveLimit: 12,
        kingPen: ['g7', 'g8'],
        hazards: S(
          'f4', 'f5', 'f6', 'f8', 'h4', 'h5', 'h6', 'h8',
          'a6', 'b6', 'c6', 'd6', 'e6',
          'a7', 'b7', 'c7', 'd7', 'e7',
          'a8', 'b8', 'c8', 'd8', 'e8',
        ),
      },
    ),
    // ── L5 — THE SHUTTLE (smoke KEY). His room is the 2x2 corner g7/g8/h7/h8
    // and it is wide open — she has every line she could want. It is not
    // enough, and it never is: one rook attacks one rank and one file, a 2x2
    // has two of each, and he steps to the line she is not on, forever (The
    // Vault L5, The Slash, The Parapet, The Hayloft all measured it). Smoke is
    // the only card in the kit that stops the step. No pawn stands within
    // reach of his room, so there is nothing here to steal.
    make(
      5,
      [king(7, 8), pawn(2, 6), pawn(5, 4)],
      {
        ...FLEE,
        moveLimit: 8,
        kingPen: ['g7', 'g8', 'h7', 'h8'],
        hazards: S(
          'b5', 'b7', 'e3', 'e5',
          'f5', 'f6', 'g5', 'h5',
          'a8', 'b8', 'c8',
        ),
      },
    ),
    // ── L6 — THE SHOULDER (convert KEY). His niche is d8 and EVERY one of its
    // five neighbours is stone except one: e7, a nailed pawn on his diagonal
    // shoulder (e6 under it, e8 over it). He has nowhere at all to go, so the
    // theft needs no cover — steal the man, let him fail to move, strike next
    // turn. This is the whole run in three moves and it is the last time it
    // will be this cheap: from L7 on he always has exactly one door.
    make(
      6,
      [king(4, 8), pawn(5, 7)],
      {
        ...FLEE,
        moveLimit: 8,
        kingPen: ['d8'],
        hazards: S(
          'a7', 'b7', 'c7', 'c8', 'd7', 'e6', 'e8', 'f7', 'f8',
          'f5', 'f6', 'g5', 'g6', 'g7', 'g8', 'h5', 'h6', 'h7', 'h8',
        ),
      },
    ),
    // ══ L7 — THE WALK ══════════════════════════════════════════════════════
    // The niche again, and one square of it open: c7, his door. It is a
    // DIAGONAL of his and it is sealed from the whole rest of the board — b7,
    // c6 and c8 are stone — so nothing she can do reaches it. She cannot stand
    // in it, she cannot attack it, she cannot deny it. It exists for one piece
    // on the board: him. The only card in the kit that takes that door away is
    // the one that never touches it — under Smoke he does not flee, from her or
    // from a controlled summon, and one T1 smoke is exactly one enemy turn.
    //   And the shoulder square e7 is EMPTY. His nearest man is a rank below
    // it on e6, where both his diagonals (d7, f7) are stone and he threatens
    // nobody at all. So the theft buys NOTHING on the turn it is made: the man
    // has to WALK, one square, one body-move, one whole turn — and the moment
    // he sets foot on e7 the king is under a threat he can answer.
    //   The smoke therefore belongs to the ARRIVAL, not to the theft. Steal on
    // one turn, step and vanish on the next, strike on the third. Spend the
    // cover early and it is gone before it is needed. Nothing on this board can
    // be captured either — every pawn has stone on its rank and its file — so
    // there is no capture-stun to borrow instead. `enemiesPerTurn: 2`.
    make(
      7,
      [king(4, 8), pawn(5, 6), pawn(2, 6), pawn(7, 4)],
      {
        ...FLEE,
        moveLimit: 5,
        enemiesPerTurn: 2,
        kingPen: ['c7', 'd8'],
        hazards: S(
          'b7', 'c6', 'c8', 'd7', 'e5', 'e8', 'f7', 'f8', 'd6', 'f6',
          'a6', 'b5', 'a8',
          'g3', 'g5', 'h4', 'h6',
          'e3', 'e4', 'f3', 'f4', 'f5',
        ),
      },
    ),
    // ══ L8 — THE MAN CLOSES THE OTHER DOOR ═════════════════════════════════
    // Same niche, same walk — and e8 is empty. He has TWO doors now, and c7 is
    // still the one nothing of hers can reach. One theft has to shut the other,
    // and the way it does is the level.
    //   An ally pawn's FORWARD step is a legal move onto an EMPTY square, so
    // `controlledThreatensSquare` counts the square directly above a stolen
    // pawn as covered — while it is empty. When the man steps onto e7 he
    // therefore does two opposite things in the same beat: his DIAGONAL
    // threatens d8, because the king is standing on it, and his FORWARD step
    // covers e8, because nobody is. Cover and kill are opposite polarities of
    // the same pawn — a pawn covers the square above it only while that square
    // is EMPTY and kills on the diagonal only when that square is OCCUPIED —
    // and a player who has not noticed that will watch him walk out of a door
    // he thought was shut. `enemiesPerTurn: 2`.
    make(
      8,
      [king(4, 8), pawn(5, 6), pawn(2, 6), pawn(7, 4)],
      {
        ...FLEE,
        moveLimit: 6,
        enemiesPerTurn: 2,
        kingPen: ['c7', 'd8', 'e8'],
        hazards: S(
          'b7', 'c6', 'c8', 'd7', 'e5', 'f7', 'f8', 'd6', 'f6',
          'a6', 'b5', 'a8',
          'g3', 'g5', 'h4', 'h6',
          'e3', 'e4', 'f3', 'f4', 'f5',
        ),
      },
    ),
    // ══ L9 — TWO SHOULDERS, ONE WATCHED ════════════════════════════════════
    // Both of his diagonals are open and there is a man a rank under each of
    // them — c6 and e6 — either of which can climb to a shoulder and threaten
    // the throne. Only one survives the climb.
    //   His pawn on f8 can never move (f7 stone under it, rank 8 over it) and
    // it attacks e7, the east shoulder. Steal the east man, walk him up, and
    // the gun eats him where he stands on the very phase he is asleep. Smoke
    // does nothing about that: the cover hides ROOKIE, and the capture pass
    // keeps every ALLY square on its target list (pawn-ai.ts:854). Nothing on
    // this board can be captured either — the gun's own rank and file are
    // sealed — so the gun cannot be answered, only avoided.
    //   The west man is the man. `enemiesPerTurn: 2`.
    make(
      9,
      [king(4, 8), pawn(3, 6), pawn(5, 6), pawn(6, 8), pawn(2, 4), queen(1, 1)],
      {
        ...FLEE,
        moveLimit: 4,
        enemiesPerTurn: 2,
        kingPen: ['c7', 'd8', 'e7'],
        hazards: S(
          'a7', 'b7', 'c5', 'c8', 'd7', 'e5', 'e8', 'f7', 'g8',
          'b6', 'd6', 'f6', 'd5',
          'a6', 'b3', 'a8',
          'g3', 'g5', 'h4', 'h6',
          'e3', 'e4', 'f3', 'f4', 'f5',
        ),
      },
    ),
    // ══ L10 — THE OTHER HAND ═══════════════════════════════════════════════
    // The whole niche is mirrored and so is the trap. He stands on e8, his
    // shoulders are d7 and f7, his men are on d6 and f6 — and the gun is his
    // pawn on c8, watching the WEST shoulder this time. Every reflex the run
    // has built points west and west is the one that dies. His door is e7,
    // sealed like every door in this run: no rank, no file, nothing of hers
    // reaches it.
    //   One charge, two men, a walk to time, and two moves fewer than L9 had.
    // `enemiesPerTurn: 2`.
    make(
      10,
      [king(5, 8), pawn(4, 6), pawn(6, 6), pawn(3, 8), pawn(2, 4), queen(8, 1)],
      {
        ...FLEE,
        moveLimit: 5,
        enemiesPerTurn: 2,
        kingPen: ['d7', 'e8', 'f7'],
        hazards: S(
          'b8', 'c7', 'd8', 'e6', 'e7', 'f8', 'g7',
          'c6', 'g6', 'd5', 'f5',
          'h6', 'g5', 'h4', 'h8',
          'b3', 'b5', 'a4', 'a6',
          'd3', 'd4', 'c3', 'c4', 'g3', 'g4',
        ),
      },
    ),
  ],
};

export default RUN_REVENGE_51;
