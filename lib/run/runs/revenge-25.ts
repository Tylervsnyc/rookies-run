/**
 * revenge-25 — THE ALCOVE. Built 2026-09-06 for the signature pair
 * BECOME KING + BOULDER ("untouchable-engineer" in
 * data/run-playtest/pair-hypotheses.json, confidence 4 — the highest-rated
 * archetype in the file that had never been given a run).
 * Kit = become-king / boulder / aegis / magnet (`allowedAbilities` IS the kit).
 * VERB: walk in untouchable and brick the door behind you.
 *
 * ===========================================================================
 * 2026-09-06 VARIANCE REWORK (Tyler, after playing it: "both very good in
 * creativity, but they need more VARIANCE and DIFFICULTY, once you get the
 * idea you solve it" — and he LOVES the little boulder trick: a stone on the
 * king's flight square and take him, one turn deep). The first build's finale
 * was ONE line in three geometries — launch square, then cast + corner stone
 * + diagonal step in a single turn — and the pair read 81-97%. The rework
 * keeps the signature, the kit and L1-L6, and gives the trick FOUR SHAPES:
 * each of L7-L10 demands a different use of the same two cards. Target per
 * run-level-design.md "One line, four times": singles <= 8%, pair 60-80%.
 *
 *   L7  THE TWO CORNERS — WHICH STONE. Both diagonal-ups are open for the
 *       first time (pen g7 / h8 / f8): two flight squares, two stones, and the
 *       stone you reach for LOSES. Without any stone he always runs to h8 —
 *       the flee AI marks f8 "risky" (it shares a file with f7, which her king
 *       form can take) — and h8 is off every rook line forever. Brick f8 and
 *       he still goes to h8: lost. Brick h8 and he is FORCED onto f8, his own
 *       sentry's file, and the chase is a rook chase through the sentry:
 *       revert on g6, step to his vacated g7, g7xf7 (stun), f7xf8. Both
 *       stones = the old one-turn kill, one move faster. Clock 7, one launch.
 *   L8  THE SEAM — TRAVEL, NOT THE KILL. No sill: the b-file runs through the
 *       doorstep onto him, so the kill is a ROOK SLIDE from b5, and Become
 *       King is spent a turn EARLIER, on movement. b5 sits in a stone pocket
 *       (a4, a5, b4, c4, d5 stone) whose only entrance is the SEAM d4 → c5, a
 *       diagonal between two stones that no rook line can make. Reach d4,
 *       cast, step through to c5 (nothing even shoots at her — the untouchable
 *       turn buys a diagonal, not a bounce), revert, slide c5 → b5 with the
 *       stone already on a8, then b5xb7. Pure stone: nothing to crush at any
 *       Boulder tier. (a4 is stone because a4 → b5 was a second seam that
 *       landed ON the attacking square, and the revert then took him with no
 *       stone at all — become-king alone read 100% until it was closed.)
 *   L9  THE PLUG THAT WALKS — THE HUNTER IS THE RIDE. One corner, h5 stone
 *       so f5 is the only launch, and a bishop standing ON the doorstep: off
 *       every rook line, it plugs the step and covers f5, and its only move in
 *       the world is f5 itself. Bishops ride to whatever is closer and off her
 *       lines, so the decision is WHERE TO STAND: on rank 4 west of f it walks
 *       out onto the launch; on the f-file it never leaves. Then f4, take it
 *       (the stun is nothing, the square is everything — she is on the
 *       launch), cast + h8 + step g6, g6xg7. Once it has left the doorstep it
 *       roams the lower diagonals and hunts her; be quick.
 *   L10 THE ALCOVE — THE PLUG, THEN WHICH CORNER, TWO A TURN. The b-side sill
 *       with the plug on the doorstep (L9) AND both corners open (L7), two
 *       enemies a turn. Lure the plug out onto c5, take it from c4, then the
 *       corner question with no slack: a8 + c8 + step in one turn, or a8 alone
 *       and the sentry chase (b6 → b7 → xc7 → xc8). Brick c8 instead of a8 and
 *       he walks to a8 and the level is over.
 *
 *   WHY THE SINGLES STILL FAIL (kit-relative): none / aegis / magnet — the
 *   doorstep is off every rook line on L7, L9, L10 and the pocket is a
 *   diagonal away on L8; a shield never moves her, a pull runs along her lines
 *   and nothing on her lines opens a diagonal. boulder — stone seals, never
 *   opens; L8's pocket is stone, so there is nothing to crush at any tier.
 *   become-king (T1 = one step, one protected turn) — L7 / L9 / L10: he has a
 *   corner she has no stone for (on L7 and L10 the flee AI ALWAYS picks the
 *   unreachable one, because the other shares a file with the sentry her
 *   king form could take, which its "risky" rule avoids); L8: she reaches b5
 *   and he steps to a8. NOTE the clock gates no single card on any finale
 *   level any more — the geometry does — so the move limit is a pure PAIR
 *   knob: L7 7 + one launch (6 read 53%, 7 with two launches 94%), L8 7, L9 7
 *   (6 read 44%), L10 9 (7 read 50%, 8 read 53%, 9 read 59%, 10 read 50% —
 *   past 9 the clock is not the limiter; the roaming bishop and the bot's
 *   own junk stones are).
 *
 *   DEAD ENDS OF THE REWORK (all 2026-09-06, all measured, in order):
 *   THE CHIMNEY. First L7 opened the crown g8 instead of the inboard corner.
 *     Once he leaves g7 the g-file runs to g8, and g8 attacks h8 along rank
 *     8: become-king alone read 100%. A second flight square must be off every
 *     rook line even AFTER he has vacated his own square — only the diagonal-
 *     ups qualify, and f8 only because its file is his sentry.
 *   THE SECOND SEAM. First L8 left a4 open; a4 → b5 is also a diagonal, and
 *     it lands ON the attacking square, so the revert took him with no stone
 *     (become-king alone 100%). A seam must land BESIDE the attacking square,
 *     never on it: the flee only happens on the enemy turn, and a king that
 *     reverts into a threat never gives him one.
 *   THE SHIELD. The plan had "stone as a shield": a bishop in a diagonal chute
 *     covering the only launch square, one stone in its line. It cannot exist
 *     here: a bishop slides, the launch is CLOSER to every rank-4 approach
 *     square than its chute is, and it rides there first, where she takes it
 *     from f4 for a free stun and a free ride. The plug that walks (L9) is
 *     that same behaviour turned into the trick instead of fought.
 *   THE SEAM WITH TWO CORNERS (first L9). A rook on g5 has nothing capturable
 *     on its line, so neither corner is "risky" and with no stone he flips a
 *     coin — become-king alone can only be gated by the clock, and the same
 *     clock kills the pair's one-stone chase. The only pair line left was
 *     both stones with zero slack, and the bot never found it (0/16). A
 *     two-corner level needs the doorstep threat (king form, sentry
 *     capturable) so the flee AI itself picks the losing corner.
 *   JUNK STONES. The bot drops both stones early on squares within two of
 *     itself, then casts and king-steps into a square whose rook exits are
 *     the stones it just dropped — "end: playing", no legal move. e3 stone on
 *     the seam approach turned e4 into exactly such a pocket (pair 0/16 until
 *     it moved to e2); a chute wall at c3 did the same to c2. Keep every
 *     square a king step can land on with at least two rook exits.
 *
 *   MEASURED — 2026-09-06 VARIANCE REWORK (Normal, T5 bot, kit at T1; the
 *   finale is the SERIAL read, --jobs=1, 32 trials per cell; L7's singles and
 *   the L7 / L10 pair re-read serially after their final clock change):
 *   L      none  becomeK  boulder  aegis  magnet  |  becomeK+boulder   (first build)
 *   7        0%      0%       0%     0%      0%  |    63%             (91%)
 *   8        0%      0%       0%     0%      0%  |    72%             (97%)
 *   9        0%      0%       0%     0%      0%  |    66%             (81%)
 *   10       0%      0%       0%     0%      0%  |    59%             (81%)
 *   Contract: no-ability 0%, every single card 0% (bar <= 8%), the pair
 *   63 / 72 / 66 / 59 against a 60-80% band. L10 is the honest miss: its
 *   32-trial serial reads were 53% (clock 8), 59% (clock 9), 50% (clock 10) —
 *   the clock stopped being the limiter at 9; what is left is the bishop
 *   roaming with two actions a turn and the bot's own junk-stone stalls
 *   (see JUNK STONES). Called at 59, reported as 50-59. Direction-pass
 *   reads at 16 trials / --jobs=2 ran 6-16 points above the serial numbers
 *   (L7 63 -> 53 at clock 6; L10 69 -> 53 at clock 8), same cross-talk the
 *   rubric warns about.
 *
 *   TIER CAVEAT (16 trials, --jobs=1, the highest tier the offers reach):
 *   become-king:4 alone reads 100 / 100 / 100 / 100 — unchanged from the
 *   first build and for the same reason: three uses and two protected turns
 *   let her walk the corner diagonal herself, and the seam's pocket and the
 *   plug's launch are both one king step wide. boulder:4 alone reads
 *   0 / 0 / 0 / 0 (its second forced stone lands beside the king and cannot
 *   open a diagonal). aegis:4 / magnet:4 were 0 in the first build and no
 *   geometry that touches them changed. Pinning Become King's tier in this
 *   run is still the one decision that would make the gate tier-proof.
 *
 *   FULL RUNS (40 each, never skipping an offer, T5 bot, --jobs=2):
 *     RANDOM picks from the kit: 7/40 = 18% clear (first build 35%). Deaths
 *       L3 6, L4 8, L5 2, L6 10, L7 4, L8 3 — every one but one a move-limit,
 *       i.e. she arrived without the card the level asks for. L9 / L10: 7/7.
 *     PAIR-ONLY pool: 15/40 = 38% clear (first build 40%); L3 / L4 still take
 *       most of the losses (AEGIS levels, pair pool cannot hold it). The
 *       finale in-run reads 89 / 94 / 100 / 100 — higher than the matrix
 *       because by L7 the offers have UPGRADED the cards, and become-king:4
 *       solos every finale level (tier caveat above). The 18% random figure
 *       is the first combo run under the Moat's 10-25% target; the finale
 *       now costs a random picker something even when he holds both halves.
 *
 *   The original design text follows unchanged.
 * ===========================================================================
 *
 * WHY THIS PAIR. Become King is the only card in the game that buys TIME ON A
 * SQUARE: nothing can capture her, but her reach collapses to one step, so she
 * can only ever be untouchable somewhere she was already standing beside — it
 * is a card that cannot travel. Boulder is the only card that buys SPACE HE
 * CANNOT USE: permanent stone, anywhere on the board, for free — and it walls
 * her own rays exactly like it walls his, so it is a card that cannot open
 * anything. Each half is a liability alone. Together they are an engineer who
 * steps into the one square in the level a rook can never occupy, stands there
 * while the guard bounces off her, and bricks his one exit shut on the way in.
 * `become-king` is a listed universal solvent and is legal in this kit only
 * because it IS half the signature pair (kit-composition rule 2).
 *
 * CONSTANT SIGNATURE — THE ALCOVE. Every level the king stands at the top of a
 * one-square-wide stone cell against an edge file, and EVERY STRAIGHT LINE INTO
 * IT IS STONE. For a king on (f, r) — the g-file version, mirrored onto the
 * b-file on the even levels:
 *
 *      rank r+1     #back  #bricked  #crown   [CORNER]
 *      rank r       #back   SENTRY    KING    #wall
 *      rank r-1     #back   #stump   DOORSTEP #wall
 *      rank r-2                      (#sill)             <- L6-L10 only
 *
 * Not a band (The Moat), not columns (The Colonnade), not a ring round his cell
 * with a door in it (The Vault / The Glasshouse — those runs are about finding
 * the opening; this one has none), not offset bars (The Switchback), not a
 * hedge (The Briar), not shafts (The Stacks), not one diagonal (The Slash / The
 * Cliff), not an alley (The Alley), not a solid rank (The Parapet), not a
 * checker field (The Lattice), not a diamond round a pillar (The Millstone).
 * One narrow stone slot on the eighth rank, and the whole run is a single idea:
 *
 *   EVERY ORTHOGONAL LINE IN AND OUT OF THE ALCOVE IS SEALED.
 *   THE ONLY WAYS THROUGH IT ARE DIAGONAL — HIS, AND HERS.
 *
 * Five facts fall out of that and they are the entire run:
 *   1. The DOORSTEP directly under him is the only square in the level from
 *      which anything attacks him. His rank is the sentry pawn on one side and
 *      the wall stone on the other; his file above him is the crown.
 *   2. The SENTRY is a stump — stone directly in front of it — so it never
 *      moves and never stops covering the doorstep. Standing there as a rook is
 *      death; standing there as a king is not.
 *   3. His one flight square is the CORNER, the diagonal-up on the walled side
 *      (the other diagonal-up is bricked from the start). It is unreachable
 *      forever: the file under it is the wall stone and the rank beside it is
 *      the crown. If he reaches the corner the level is lost, whatever the
 *      clock says — which is why the stone has to go down BEFORE she arrives.
 *   4. From L6 the SILL closes the doorstep's file below, and with its flanks
 *      already stone no rook line in the game reaches it. The only way on is
 *      one diagonal STEP from a LAUNCH square beside the sill.
 *   5. The cell is a DEAD END for her too. The BACK WALL — the three squares
 *      behind the sentry — is what makes that true, and it was found the hard
 *      way (see DEAD ENDS): without it a king form standing behind the sentry
 *      takes it diagonally and lands on the king's own rank.
 *
 *   L1-L2  no sill, still king. The file runs straight up through the doorstep
 *          onto him. Ride it. This is the shape, free.
 *   L3     a bishop PLUGS the doorstep, knotted in place by the sentry above it
 *          and three stones. Take it and the sentry takes you back — unless the
 *          shield is up: AEGIS.
 *   L4     doorstep clear, but the one file into the alcove is BARRED by a
 *          knotted bishop defended by a stump pawn. Eat the recapture (AEGIS)
 *          or pull the bar sideways off the file (MAGNET, three moves slower).
 *   L5     he pulls the sentry in and walls both shoulders, and he RUNS. The
 *          doorstep is still rook-reachable but the file below is barred low, so
 *          she has to spend a move stepping onto his file from a rank — and he
 *          spends it walking into a corner no line of hers reaches. Stone the
 *          corner first: BOULDER.
 *   L6     the SILL. No rook line to the doorstep exists any more, and he stands
 *          still, so there is no corner to close. The whole level is the STEP:
 *          BECOME KING.
 *   L7-L10 the sill AND he runs. Step in untouchable (only the king form gets
 *          there) and brick the corner on the way (only the stone keeps him
 *          home). The pair, and nothing else in the kit.
 *
 * WHY THE SINGLES FAIL ON THE FINALE (kit-relative, measured below):
 *   none         the doorstep is not rook-reachable and nothing else in the
 *                level sees him. A capture-stun does not help: a stun buys a
 *                turn on a square she cannot stand on.
 *   become-king  T1 is ONE king move and ONE protected enemy turn, and the step
 *                onto the doorstep spends it. He walks into the corner, the
 *                sentry bounces off her, and she reverts to a rook on a doorstep
 *                facing an empty cell whose only other square is his — and from
 *                his square the only capture is the sentry, whose own corner was
 *                bricked before the level began.
 *   boulder      stone seals, it never opens. She can brick the corner from
 *                anywhere on the board for free and nothing changes: the
 *                doorstep stays off every rook line at every tier, because its
 *                flanks and its file are stone. Crushing the sentry (T2+) does
 *                not open it either — the stone under the sentry is what closes
 *                the flank, and stone does not move.
 *   aegis        a shield is not a step. She can survive the sentry's fire but
 *                she can never be standing in it. become-king + aegis is a
 *                listed ANTI-PAIR (two cards that both say "do not get
 *                captured") and this is the run where you feel why: only one of
 *                them also moves you.
 *   magnet       pulls run along her current form's lines and no line of hers
 *                enters the alcove. The sentry sits behind its own stone; the
 *                king cannot be pulled below T5. The trap card.
 *
 * KEY / TRAP map:
 *   become-king  KEY L6, half of L7-L10; second answer on L3 and L5. TRAP
 *                L1-L2 and L4 — on the open levels the file already goes there,
 *                and one king step is a whole card spent on one square.
 *   boulder      KEY L5, half of L7-L10. TRAP L1-L4 and L6 (a still king has no
 *                corner to close, and her own stone in a one-file approach is a
 *                wall she built for herself — the Stacks lesson).
 *   aegis        KEY L3 and L4, the two levels whose answer is to be captured
 *                and live. TRAP L5-L10: nothing that hits her stands between her
 *                and him, and a shield never moves her.
 *   magnet       KEY nowhere by design — the trap card. The slow second answer
 *                on L4, and actively fatal on L3, where pulling the plug out of
 *                the doorstep drops it one square lower in the only file in the
 *                level that goes anywhere.
 *
 * L7-L10 INTENDED LINE (harness start f1; 3-4 moves from every rank-1 start):
 * reach a LAUNCH square — the two squares flanking the sill — then in ONE turn
 * cast Become King (free), drop the stone on the corner (free), and step
 * diagonally onto the doorstep. He has nowhere to go, the sentry bounces off
 * her, she reverts to a rook standing on the doorstep and slides one square onto
 * him. Everything that matters happens inside a single turn, as a reaction to a
 * position already on the board — no pre-emptive cast, no delayed fuse.
 *   L7  THE DOORSTEP   alcove on g7, sill g5, launches f5/h5, one stump pawn.
 *   L8  THE OTHER SIDE alcove on b7, sill b5, launches a5/c5, one stump pawn.
 *   L9  TWO A TURN     g7 again, two stump pawns squeezing rank 5, two a turn.
 *   L10 THE ALCOVE     b7, two stump pawns, two a turn — the motif with no
 *                      slack left in it.
 *
 * ON THE HUNTERS. Every enemy on the finale levels is a STUMP PAWN: a black pawn
 * with stone directly in front of it. That is not decoration, it is the gate.
 * Black pawns only ever move DOWN the board, so a stump pawn can never reach the
 * eighth rank, never plug a launch square and never stand on the doorstep — the
 * three squares the whole gate rests on. The first two builds used bishops and
 * both leaked: a bishop is the same colour as the king's corner on one mirror
 * and the same colour as the doorstep on the other, so whichever colour you
 * pick, one of the two critical squares is reachable by a hunter (see DEAD
 * ENDS). Stump pawns are the only pressure in this geometry that cannot touch
 * it.
 *
 * ON THE BOT AND THE TWO CARDS. Both halves are things the playtest bot models
 * well and the payoff is one turn deep, which is what the Glasshouse taught us
 * to require. `becomeKingBonus` scores the card by how much of her reach is
 * attacked; the boulder candidate generator only enumerates drops adjacent to
 * the king or within two of Rookie, which is exactly where the corner is. The
 * single-corner design matters here too: an earlier build gave him two corners
 * and the pair read 25-44% because the bot had to find BOTH stones in the same
 * turn as the cast and the step. One corner, one stone: 81-100%.
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
 * FINALE, numbers of record. `revenge.ts matrix --run=revenge-25 --levels=7,8,9,10
 * --loadouts=<none + kit + pair> --trials=32 --jobs=8`, T1 cards, Normal:
 *    L       none      aegis  becomekin    boulder     magnet  |  become-king+boulder
 *    7         0%         0%         0%         0%         0%  |  69%
 *    8         0%         0%         0%         0%         0%  |  81%
 *    9         0%         0%         0%         0%         0%  |  66%
 *   10         0%         0%         0%         0%         0%  |  53%
 * GATE HOLDS: no card in the kit clears a finale level alone (worst single cell 0%); the pair reads 69/81/66/53.
 * The header below reads 63/72/66/59 for the pair and is CONFIRMED (max drift 9 points,
 * inside 32-trial binomial noise) — but it was taken with the flawed method, so these
 * are the numbers of record.
 * ──
 * MEASURED (Normal, T5 bot, kit at T1 — the harness default; 2026-09-06).
 *   Direction pass (--jobs=3, 16 trials/cell, all ten levels):
 *   L      none  becomeK  boulder  aegis  magnet  |  becomeK+boulder
 *   1      100%    100%     100%    100%    100%  |   100%   (teaching, free)
 *   2      100%    100%     100%    100%    100%  |   100%   (teaching, free)
 *   3        0%     63%       0%    100%     69%  |    63%   (AEGIS key)
 *   4        0%     63%       0%    100%     81%  |    75%   (AEGIS key)
 *   5        0%    100%     100%      0%      0%  |   100%   (BOULDER key)
 *   6        0%    100%       0%      0%      0%  |   100%   (BECOME KING key)
 *   FINALE, NUMBERS OF RECORD (--jobs=1 SERIAL, 32 trials/cell):
 *   7        0%      0%       0%      0%      0%  |    91%
 *   8        0%      0%       0%      0%      0%  |    97%
 *   9        0%      0%       0%      0%      0%  |    81%
 *   10       0%      0%       0%      0%      0%  |    81%
 *   Contract: no-ability 0%, every single card in the kit 0% (bar is <= 8%),
 *   the signature pair 81-97% (bar is >= 60%). Clean on all three lines.
 *
 *   TIER CAVEAT — REPORT IT, IT IS REAL (16 trials, L7-L10, the highest tier the
 *   offers can reach by the finale). become-king:4 alone reads 100/100/100/100.
 *   boulder:4, aegis:4 and magnet:4 all still read 0/0/0/0. T3+ Become King is
 *   TWO uses and TWO protected enemy turns, and the second king move is the one
 *   the geometry cannot survive: after he has run, the corner is a DIAGONAL step
 *   from his own vacated square, and only a king form can take a diagonal. The
 *   gate here is exact at T1 and gone at T3. Same family as the Colonnade's T4
 *   Bishop Squire (run-level-design.md, "The gate depends on ability TIER") and
 *   the same open decision for Tyler — pinning Become King's tier in this run
 *   would restore the gate at every tier, and nothing else in the kit needs it.
 *   FIXED 2026-09-06 — `abilityTierCaps: { 'become-king': 1 }`. Sweeping every
 *   tier one column at a time (32 trials, --jobs=1) moved the break EARLIER
 *   than the caveat above guessed: T1 0/0/0/0, T2 100/19/94/100,
 *   T3 100/97/100/100. Become King's ladder is 1/2/2/3/3 uses, so the second
 *   charge arrives at T2, not T3 — and one extra step is the whole finale.
 *   The ceiling is therefore T1: in this run the card is offerable and never
 *   upgradable, which is exactly the tier all four finale lines were built
 *   and measured against. The forced-loadout matrix is unchanged by design.
 *
 *   FULL RUNS (40 each, never skipping an offer, T5 bot):
 *     RANDOM picks from the kit: 14/40 = 35% clear. Deaths L3 5, L4 9, L5 2,
 *       L6 8, L7 2 — every one a move-limit, i.e. she arrived without the card
 *       the level asks for. Past L7 with the pair in hand: L8/L9/L10 100%.
 *     PAIR-ONLY pool (become-king, boulder): 16/40 = 40% clear, and the whole
 *       difference is L4: 13 of the 20 losses are there, because L4's key is
 *       AEGIS and the pair-only pool cannot hold it. From L5 on the pair pool
 *       reads 100 / 85 / 100 / 100 / 94 / 100 — the finale is a formality once
 *       she owns both halves, which is the shape the gate is supposed to have.
 *     The 35% random figure sits above The Moat's 25% for the structural reason
 *     the rubric names: with the pair as half a four-card kit and offers on
 *     L1/L3/L6/L9, a random picker usually holds both halves by L7. Reported,
 *     not chased.
 *
 * DEAD ENDS (all 2026-09-06, all measured, in the order they were found):
 *   THE CLOCK IS NOT A GATE. The first two fixes tried to price the wrong lines
 *     out with a tight move limit (4 and 5 moves for a 3-move line). They did
 *     nothing at all, because `applyDifficulty` clamps every authored moveLimit
 *     up to MOVE_LIMIT_FLOOR = 6. Below 6 the number in the file is a comment.
 *     Anything a run wants to forbid has to be forbidden by geometry.
 *   THE CROSSFIRE THAT ATE ITSELF. The first build flanked him with TWO stump
 *     pawns whose fire crossed on the doorstep — pretty, and broken. The moment
 *     he runs, his own square becomes a platform: a rook standing on it captures
 *     a sentry and lands directly under the corner that sentry was standing
 *     beneath. become-king alone read 100% on L7-L10 and no-ability read 100% on
 *     L5. A guard on his rank is a ladder to the square above it. One sentry,
 *     one bricked corner, and the corner he actually runs to is the WALLED one.
 *   THE SECOND CORNER COST 60 POINTS. With both diagonal-ups open he needed two
 *     stones, and the bot had to find cast + stone + stone + step inside one
 *     turn: the pair read 25/44/44/31%. Bricking the inboard corner at build
 *     time — one stone to find instead of two — took the same levels to
 *     91/97/81/81%. If a pair's payoff is one turn deep, count the casts in that
 *     turn; every extra one is a coin flip.
 *   THE BACK WALL (the one the trace found). With the three squares behind the
 *     sentry left open, become-king alone read 50-75% and the trace was blunt:
 *     d1-d2-d4-d8-e8, become king, e8xf7, f7xg7. A king form standing beside the
 *     sentry takes it DIAGONALLY and lands on his rank, and no amount of sealing
 *     the files matters. Whenever a level's gate is "she cannot stand next to
 *     him", check every square within one KING step of every piece he owns.
 *   BISHOPS CANNOT HUNT IN THIS GEOMETRY. Wrong-coloured bishops were the plan
 *     (The Slash's trick), and the colours do not cooperate here: the doorstep
 *     and both launch squares of the g-file alcove are LIGHT and the corner he
 *     runs to is DARK, so whichever colour you pick, a hunter can reach one of
 *     the squares the gate rests on. A dark bishop parked on h8 blocks his only
 *     exit and hands the level to become-king alone. Every finale hunter is a
 *     stump pawn instead: black pawns only move down, so they can never reach
 *     the eighth rank, the doorstep, or a launch square, at any tier, ever.
 *   MAGNET IS THE HONEST TRAP. It was meant to be L4's key and reads 81% there
 *     against AEGIS's 100% — aegis is simply the faster answer to the same bar,
 *     and no geometry made the pull the only way through (a defended blocker is
 *     always capturable-and-survivable with a shield). Left as the trap card and
 *     labelled as one, rather than pretending L4 is a magnet puzzle.
 */
import { bishop, king, make, pawn, X } from '../run-kit';
import type { RunDef } from '../run-kit';
import type { Coord, EnemyPiece } from '../types';

const STILL = { winCondition: 'king' as const, kingBehavior: 'still' as const };
const FLEE = { winCondition: 'king' as const, kingBehavior: 'flee' as const };

const inB = (f: number, r: number): boolean => f >= 1 && f <= 8 && r >= 1 && r <= 8;
const sq = (f: number, r: number): string => `${'abcdefgh'[f - 1]}${r}`;

interface Alcove {
  hazards: Coord[];
  pieces: EnemyPiece[];
  pen: string[];
}

/**
 * The alcove for a king on (kf, kr), opening toward the board edge at
 * `kf + wall` (so `wall` is +1 for the g-file cell, -1 for the b-file mirror).
 *
 * Stone: the WALL shoulder and the doorstep flank under it, the SENTRY's stump,
 * the CROWN above him, and the two SEALS two files inboard on his rank and on
 * the corner rank. `sentry: false` walls that shoulder too (L5). `sill` adds the
 * stone under the doorstep, which is what takes it off every rook line.
 */
function alcove(
  kf: number,
  kr: number,
  wall: 1 | -1,
  opts: { sill?: boolean; sentry?: boolean; twoCorners?: boolean } = {},
): Alcove {
  const sentry = opts.sentry !== false;
  // 2026-09-06 rework: `twoCorners` leaves the inboard corner OPEN and adds it
  // to his pen — a second flight square (L7 / L9 / L10) that is NOT the one the
  // stone should go on. Still off every rook line: its file is his sentry.
  const twoCorners = opts.twoCorners === true;
  const inboard = kf - wall;
  const hazards: Coord[] = [
    X(kf + wall, kr), // the walled shoulder
    X(kf + wall, kr - 1), // …and the doorstep flank under it
    X(inboard, kr - 1), // the sentry's stump = the other doorstep flank
    X(kf, kr + 1), // the crown
    ...(twoCorners ? [] : [X(inboard, kr + 1)]), // the inboard corner, bricked
    // The BACK WALL: the three squares behind the sentry. Without them a king
    // form standing on any of them captures the sentry diagonally and lands on
    // his rank (measured 2026-09-06: become-king alone read 50-75% via e8xf7).
    X(inboard - wall, kr - 1),
    X(inboard - wall, kr),
    X(inboard - wall, kr + 1),
  ];
  if (!sentry) hazards.push(X(inboard, kr));
  if (opts.sill && inB(kf, kr - 2)) hazards.push(X(kf, kr - 2));
  const pieces: EnemyPiece[] = sentry
    ? [pawn(inboard, kr), king(kf, kr)]
    : [king(kf, kr)];
  return {
    hazards: hazards.filter((c) => inB(c.file, c.rank)),
    pieces,
    pen: [sq(kf, kr), sq(kf + wall, kr + 1), ...(twoCorners ? [sq(inboard, kr + 1)] : [])],
  };
}

/** g-file alcove: king g7, sentry f7, wall h7, corner h8, doorstep g6. */
const G7 = alcove(7, 7, 1);
const G7_SILL = alcove(7, 7, 1, { sill: true });
/** g-file alcove with the sentry walled in too (L5) — no fire on the doorstep. */
const G7_SEALED = alcove(7, 7, 1, { sentry: false });
/** b-file mirror: king b7, sentry c7, wall a7, corner a8, doorstep b6. */
const B7 = alcove(2, 7, -1);
/** 2026-09-06 rework: both corners open (pen adds f8 / c8). */
const G7_SILL_2C = alcove(7, 7, 1, { sill: true, twoCorners: true });
const B7_SILL_2C = alcove(2, 7, -1, { sill: true, twoCorners: true });

const RUN_REVENGE_25: RunDef = {
  id: 'revenge-25',
  name: 'The Alcove',
  blurb: 'Stone on every straight line. He leaves by the corners — so do you.',
  allowedAbilities: ['become-king', 'boulder', 'aegis', 'magnet'],
  // TIER CAP (2026-09-06). The finale gate is EXACT at T1 and gone the moment
  // Become King gets its second charge — measured L7-L10, 32 trials, serial:
  // T1 0/0/0/0, T2 100/19/94/100, T4 100/100/100/100. The header's own "WHY
  // THE SINGLES FAIL" says why: T1 is ONE king move and the step onto the
  // doorstep spends it; a second use is a second step, and a second step is
  // the level. Nothing else in the kit needs a cap (boulder:4, aegis:4,
  // magnet:4 all still read 0/0/0/0), so this is the smallest cap that makes
  // the gate tier-proof: Become King is offerable, never upgradable, here.
  abilityTierCaps: { 'become-king': 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE ALCOVE. The motif, open: no sill, so the g-file runs from the
    // floor through the doorstep onto a king who does not move. Ride it.
    // (Stopping on g6 would be fatal; she never needs to.)
    make(1, [...G7.pieces], {
      ...STILL,
      moveLimit: 6,
      hazards: G7.hazards,
      kingPen: G7.pen,
    }),
    // L2 — THE OTHER SIDE. Mirrored onto the b-file, one light bishop out on
    // the far flank. Same ride, one more thing watching.
    make(2, [...B7.pieces, bishop(7, 2)], {
      ...STILL,
      moveLimit: 7,
      hazards: B7.hazards,
      kingPen: B7.pen,
    }),
    // L3 — THE PLUG. A bishop stands ON the doorstep, knotted: the sentry
    // closes f7, the wall closes h7, and f5/h5 are stone, so it can never leave
    // the square. Take it and you are standing under the sentry's nose. AEGIS.
    // (Magnet is the trap — the pull line is the g-file, so the plug lands one
    // square lower and blocks the only approach in the level.)
    make(3, [...G7.pieces, bishop(7, 6)], {
      ...STILL,
      moveLimit: 6,
      hazards: [...G7.hazards, X(6, 5), X(8, 5)],
      kingPen: G7.pen,
    }),
    // L4 — THE BAR. Doorstep clear, king still, and the b-file — the only way
    // in, since the doorstep's flanks are stone — is barred by a bishop on b4
    // knotted in place (a3/c3/c5 stone, a5 his own pawn) and defended by that
    // pawn, itself a stump (a4 is stone). Capture the bar and the pawn takes you
    // back: AEGIS. Or stand on rank 4 east of it and pull it off the file:
    // MAGNET, three moves slower.
    make(
      4,
      [...B7.pieces, bishop(2, 4), pawn(1, 5)],
      {
        ...STILL,
        moveLimit: 7,
        hazards: [...B7.hazards, X(1, 3), X(3, 3), X(3, 5), X(1, 4)],
        kingPen: B7.pen,
      },
    ),
    // L5 — THE CORNERS. He pulls the sentry in and walls both shoulders, and he
    // RUNS. The doorstep is still rook-reachable, but the g-file is barred low
    // at g3, so she has to spend a move stepping onto his file from a rank — and
    // he spends it walking into a corner no line of hers will ever reach.
    // Stone both corners on the way in: BOULDER.
    make(5, [...G7_SEALED.pieces, pawn(3, 7)], {
      ...FLEE,
      moveLimit: 6,
      hazards: [...G7_SEALED.hazards, X(7, 3), X(3, 6)],
      kingPen: G7_SEALED.pen,
    }),
    // L6 — THE SILL. One stone under the doorstep and no rook in the game can
    // stand on it again: flanks stone, file stone. He stands still, so there are
    // no corners to close — the whole level is the STEP. Reach a launch square,
    // become a king, walk into the sentry's fire, let it bounce, and take him as
    // a rook on the way out. BECOME KING, alone.
    make(6, [...G7_SILL.pieces, pawn(3, 6)], {
      ...STILL,
      moveLimit: 6,
      hazards: [...G7_SILL.hazards, X(3, 5)],
      kingPen: G7_SILL.pen,
    }),
    // L7 — THE TWO CORNERS (2026-09-06 rework). The sill, he runs, and BOTH
    // corners are open: pen g7 / h8 / f8. Two stones, and the one you reach
    // for loses: with no stone he always takes h8 (f8 is "risky" — it shares
    // a file with the sentry her king form can take), and h8 is off every
    // rook line forever. Brick h8 and he is forced onto f8: revert on g6,
    // step to his vacated g7, g7xf7, f7xf8. A chase through the sentry.
    // h5 is stone so f5 is the only launch and two moves from every start
    // (clock 6 with two launches read 53%, clock 7 with two read 94%).
    make(7, [...G7_SILL_2C.pieces, pawn(3, 6)], {
      ...FLEE,
      moveLimit: 7,
      hazards: [...G7_SILL_2C.hazards, X(3, 5), X(8, 5)],
      kingPen: G7_SILL_2C.pen,
    }),
    // L8 — THE SEAM (2026-09-06 rework). NO sill: the b-file runs through the
    // doorstep onto him, so the kill is a rook slide from b5 — and b5 sits in
    // a stone pocket (a4, a5, b4, c4, d5) whose only entrance is the SEAM
    // d4 → c5, a diagonal between two stones. Become King is spent on TRAVEL:
    // reach d4, cast, step through to c5, revert, c5 → b5 with the stone on
    // a8, and b5xb7. Nothing to crush at any tier.
    make(8, [...B7.pieces, pawn(6, 6)], {
      ...FLEE,
      moveLimit: 7,
      hazards: [...B7.hazards, X(6, 5), X(1, 4), X(1, 5), X(2, 4), X(3, 4), X(4, 5)],
      kingPen: B7.pen,
    }),
    // L9 — THE PLUG THAT WALKS (2026-09-06 rework). The L7 alcove with one
    // corner, h5 stone so f5 is the only launch — and a bishop standing ON
    // the doorstep. Off every rook line, it plugs the step and covers f5, and
    // its only move in the world is f5 itself. Bishops ride to whatever is
    // closer and off her lines, so stand on rank 4 WEST of f and it walks
    // out onto the launch; then f4, take it (the stun is nothing, the square
    // is everything), cast + h8 + step g6, g6xg7. Stand on the f-file too
    // early and it never leaves.
    make(9, [...G7_SILL.pieces, pawn(3, 6), pawn(4, 6), bishop(7, 6)], {
      ...FLEE,
      moveLimit: 7,
      hazards: [...G7_SILL.hazards, X(3, 5), X(4, 5), X(8, 5)],
      kingPen: G7_SILL.pen,
    }),
    // L10 — THE ALCOVE (2026-09-06 rework). The b-side sill with the plug on
    // the doorstep (L9) AND both corners open (L7), two a turn. Lure the plug
    // out onto c5, take it from c4, then the corner question with no slack:
    // a8 + c8 + step in one turn, or a8 alone and the chase through the
    // sentry (b6 → b7 → xc7 → xc8). Brick c8 instead of a8 and he walks to a8.
    make(10, [...B7_SILL_2C.pieces, pawn(5, 6), pawn(6, 6), bishop(2, 6)], {
      ...FLEE,
      enemiesPerTurn: 2,
      moveLimit: 9,
      hazards: [...B7_SILL_2C.hazards, X(5, 5), X(6, 5), X(1, 5)],
      kingPen: B7_SILL_2C.pen,
    }),
  ],
};

export { RUN_REVENGE_25 };
export default RUN_REVENGE_25;
