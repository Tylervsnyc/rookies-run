/**
 * revenge-24 — THE LATTICE. Built 2026-09-06 for the signature pair
 * DUCHESS + DECOY ("buy the body time", the archetype nobody had built yet:
 * data/run-playtest/pair-hypotheses.json rates it confidence 4 and it is the
 * only entry under that archetype with two cards that have no home — Decoy
 * has never been a signature card, and the Duchess has only ever been half of
 * dragon+duchess, The Millstone's double door).
 *
 * ---------------------------------------------------------------------------
 * 2026-09-15 VARIETY + DIFFICULTY PASS (plan crispy-noodling-graham, Phase 3).
 * Read this block first; everything below it describes replaced builds.
 *
 * WHY. Tyler cleared the rung with 3 stars and no deaths. The nightly read the
 * pair at 97% (TOO EASY), and his traces show ONE line on the finale: mark a
 * piece NEXT TO THE KING, let him eat it, walk the Duchess in (human REPEAT
 * L9 = L10; L10 easier than L9). The engine made that line universal today:
 * the king always takes what touches him, and on a Decoy mark the STRONGEST
 * attacker takes it (queen > king > bishop > pawn, then nearest, file, rank).
 * Every old finale had a pawn beside the king, so every old finale fell to
 * "mark it, the king steps onto it stunned for two turns, the Duchess walks
 * in" — measured W2 on the old L9 by exhaustive search.
 *
 * KIT -> 3 cards: duchess, decoy, magnet. Aegis is gone (early rungs only).
 *
 * TWO ENGINE FACTS THIS PASS IS BUILT ON (both found by exhaustive search on
 * the live engine, not read off comments):
 *   1. A MARK NOBODY CAN REACH DOES NOTHING. If no enemy can take or approach
 *      the marked piece, the army falls back to ordinary play — including the
 *      marked piece itself taking the Duchess. So there is no "blank the
 *      guard" in this run: every working mark is a FEED, something eats it,
 *      and eating it is one enemy action. The arrow always shows the eater.
 *   2. NORMAL FLOORS EVERY MOVE LIMIT AT 6 (apply-difficulty MOVE_LIMIT_FLOOR).
 *      Authored limits under 6 are not what a player gets; the finale
 *      limits here are authored above the floor on purpose.
 *
 * THE FOUR FINALE QUESTIONS (no piece touches the king on L7/L8; L9/L10 have
 * a door beside him whose approach is closed, so his swing is a trap there):
 *   L7  WHICH BAIT — two doors two squares out; feed the bishop so the
 *       single-guarded door is free this turn. The easy finale, on purpose.
 *   L8  FEED THE LOCK ITSELF — two enemies per turn: the L7 answer (feed the
 *       bishop a spare pawn) loses to the second hand; mark the guard so the
 *       bishop eats IT. Launch square d5 only.
 *   L9  THE PLUG — the mark goes down a TURN BEFORE the body: feed the plug
 *       so it steps off the only diagonal, then run the Duchess through.
 *   L10 ROOKIE GOES IN — two enemies per turn, three bodies: Rookie takes
 *       the guarded bishop under a mark, the Duchess spawns INSIDE the
 *       lattice from Rookie's square, takes the door, takes him.
 * EARLY LEVELS: L3 and L4 keep "the king takes the mark" (now shown by the
 * arrow) but each has a second verb (Duchess diagonal / Magnet pull); L5 was
 * rebuilt so its Decoy line is a pawn eating its own doorman, no king.
 *
 * DEAD ENDS TODAY (measured):
 *   - Tightening authored limits to the exact forced-win depth (3/3/4) read
 *     25-100% without --difficulty and meant nothing on Normal (floor 6).
 *   - A long floor walk on L8 (d3/e3 stone) took it 100% -> 38% on Normal:
 *     too much; d3/e3 reopened.
 *   - L10 v1 left the d5 bishop one free square (e6). From g4/h4/h3 that step
 *     counts as closing on Rookie, so it walked onto the launch square and
 *     lost every game started on g/h. g4/h4/h3 are now fallen panes.
 *   - One enemy per turn on L10 changed nothing measurable (it reopens the
 *     king-swing shortcut in principle); two stays.
 *
 * MEASURED 2026-09-15 (live engine e744b95 + this file, --difficulty=normal, T5):
 *   L3-L6, 16 trials:   none  duchess decoy magnet | pair
 *     L3                  0%    100%   100%   13%  | 100%
 *     L4                  0%    100%   100%   56%  | 100%
 *     L5                  0%    100%   100%   25%  | 100%
 *     L6                  0%    100%     0%    0%  | 100%
 *   L7-L10 singles (none/duchess/decoy/magnet), 16 trials: 0% on all four.
 *   Pair cells, 32 trials:
 *                          L7    L8    L9    L10   mean
 *     duchess+decoy       100%   66%   59%   34%   65
 *     duchess+decoy:2      97%   81%   53%   22%   63   <- arrival pair
 *     +magnet:2 (kit)     100%   69%   66%   69%   76   <- arrival kit
 *   Arrival loadouts at L7 (40 runs): decoy:2+duchess+magnet 13,
 *   decoy+duchess+magnet:2 13, decoy:3+duchess 3. Before this pass the nightly
 *   pair read 100/94/94/100 = 97%.
 *   Full runs, 40, no retries: 6/40 clear; deaths L3 3, L6 7, L7 1, L8 7,
 *   L9 12, L10 4 (was 23/40, deaths mostly L6).
 *   Magnet at T2 lifts L10 (22 -> 69): a pull that clears Rookie's walk to d4.
 *   That is Magnet as the supporting key on one finale, not a solvent (0%
 *   alone). Solver (exhaustive, 6 enemy tie-breaks): every finale is a forced
 *   win for the pair from every start file, W2-W4; none of the singles has a
 *   forced win within 5 moves.
 * ---------------------------------------------------------------------------
 * 2026-09-07 DIFFICULTY REWORK (Tyler: "the design is really cool but later
 * levels need more difficulty, and ways to solve. I love the combination of
 * abilities, it's just too easy."). The gate rule these runs were built to —
 * every single card <= 8%, the pair >= 60% — is a FLOOR with no ceiling: it
 * proves the combo is REQUIRED, never that it is HARD. L7-L10 read 97/84/94/100
 * for duchess+decoy (mean 93.8, data/run-playtest/finale-remeasure-2026-09-06).
 * They now read 75/84/69/38, mean 66.5, with every single card still 0%.
 *
 *   duchess+decoy   L7    L8    L9    L10   mean
 *   before          97%   84%   94%   100%  93.8
 *   after           75%   84%   69%    38%  66.5
 *   (none / duchess / decoy / aegis / magnet: 0% on all four, before and after.)
 *
 * WHICH LEVER DID THE WORK: what defends what. Not the clock — L8's budget is
 * untouched, and raising L7's from 6 to 7 mid-experiment moved its number by
 * zero, which is the proof that the clock was never what was binding. Every
 * point came from the DEFENCE MAP of the king's court: how many pieces guard
 * the square the Duchess must land on, and therefore how many of the marks a
 * player can make actually save her. Tried first and rejected (all measured):
 *   - lengthening Rookie's walk with fallen panes on the floor: 97% -> 91%.
 *     A rook that dithers two moves and still arrives is not under pressure.
 *   - raising the move limit (6 -> 7) on a level reading 31%: no change.
 *   - sealing the court into a pure post-and-survive cell (no capture
 *     anywhere): 28-31%, and the trace says why — the bot never casts at all.
 *     See DEAD ENDS: THE BODY MUST ARRIVE BY CAPTURING.
 *
 * THE FOUR DEMANDS — one pair, four different questions, and the L7 answer
 * loses on each of the other three:
 *
 *   L7  WHICH DOOR. Two of his diagonals hold pawns the Duchess can take, and
 *       they look identical. e6 is guarded TWICE — by the pawn d7 and by a
 *       bishop frozen on d5 (c4/e4 are stone, so it has no move for the whole
 *       level and never threatens Rookie) — so one mark can never clear it and
 *       the take dies on the reply. g6 is guarded ONCE, by h7. Count the locks,
 *       pick the single-locked door, spend the mark on that lock. There is no
 *       bait bishop on this level on purpose: friendly fire eats the army's
 *       whole action and would have saved BOTH doors, which is what made the
 *       old L7 a 97% level.
 *   L8  THE PLUG (unchanged, 84%). The mark is not for blanking a guard, it is
 *       for MOVING one: friendly fire never empties the square it hits, only
 *       the square the EATER stood on, so marking the pawn that f5 defends
 *       walks f5 off the approach and opens the launch.
 *   L9  YOU CANNOT BLANK BOTH — FEED THEM ONE OF THEIR OWN. He sits deep, on
 *       e6, in a stone box: d5, f5 and f7 are walls, so the court has exactly
 *       ONE door, the pawn d7 — and a rank-7 door is watched by TWO rank-8
 *       pawns (c8 and e8), which a single charge cannot cover. Blanking either
 *       watcher loses to the other. The only line is the bait: the bishop a8
 *       jammed behind its own pawn b7, marked so it eats b7 and spends the
 *       army's entire turn. Both watchers are pawns (threat 1) and the eater is
 *       a bishop (threat 2), so the tie-break is deterministic, not a flip.
 *   L10 THE BAIT IS THE TRAP (two enemies per turn). The L9 answer is exactly
 *       what loses here: mark the bait, the bishop g8 eats f7 with the first
 *       action and b7 eats the Duchess on c6 with the second. With two hands
 *       the army can pay for a decoy AND still recapture, so the only mark that
 *       lives is the actual guard of the landing square, b7 itself. His court
 *       is stone but for that one pawn; c6 is the only door and b7 the only
 *       lock.
 *
 * SO THE LADDER IS: blank the right lock (L7) -> move a piece instead of
 * blanking it (L8) -> you cannot blank at all, buy the turn (L9) -> buying the
 * turn is now the losing move (L10). Every wrong choice on all four dies one
 * enemy turn later, never immediately: the harness bot's 1-ply doom check only
 * sees ROOKIE captured, so a Duchess who is about to be eaten is invisible to
 * it and the loss arrives at the clock. That is where the 25-60 points of
 * failure live.
 *
 * MEASURED 2026-09-07 (Normal, T5 bot, T1 cards, 32 trials, jobs 4, numbers
 * taken on the bytes in this file):
 *    L     none    duchess  decoy  aegis  magnet  |  duchess+decoy
 *    7       0%      0%      0%     0%     0%     |  75%
 *    8       0%      0%      0%     0%     0%     |  84%
 *    9       0%      0%      0%     0%     0%     |  69%
 *   10       0%      0%      0%     0%     0%     |  38%
 *   Every other pair in the kit — duchess+aegis, duchess+magnet, decoy+aegis,
 *   decoy+magnet, aegis+magnet — reads 0% on all four. L9's old second key
 *   (duchess+aegis) is gone with the level it belonged to: one answer per
 *   level now.
 *   FULL RUNS (40, Normal, T5, never skipping an offer): 4/40 = 10% with
 *   random picks (was 33%) and 12/40 = 30% when the pool is the pair (was
 *   88%). Every death is a move limit, and they are where they should be —
 *   random picks lose 17 of 29 runs at L7; the pair pool clears L7 at 76%
 *   (matching the forced-loadout 75%) and then loses 11 of 23 at L10. The
 *   10-25% random-pick target the Moat set, which no combo run had met since,
 *   is met at 10%; the finale, not the mid-run, is now what ends a run.
 *
 * TIER CAP TIGHTENED TO `abilityTierCaps: { duchess: 1 }` (was 3). Measured
 * L7-L10, 32 trials, on this build:
 *     duchess:2 / :3        0/0/0/0        (alone, still gated)
 *     duchess:4 / :5        97/59/0/97 · 94/44/0/100   (the old T4 break)
 *     decoy:5, aegis:5, magnet:5   0/0/0/0
 *     duchess:1 + decoy:1   75/84/69/38   mean 66.5   <- the band
 *     duchess:2 + decoy:1   91/88/59/91   mean 82
 *     duchess:3 + decoy:1   94/97/47/97   mean 84
 *     duchess:3 + decoy:3   97/97/78/88   mean 90
 *   The break is not the T4 second charge any more, it is T2: summonTurnsFor
 *   is 2/3/4/4/6, so the FIRST upgrade buys her a third enemy turn, and a
 *   third turn is a second body move — she can miss the door, be eaten, or
 *   chase a fled king and still arrive. This run's whole difficulty is that
 *   her life is exactly "appear, take one square, survive one enemy turn,
 *   strike"; an extra turn is not a bonus here, it is the level. Hence T1.
 *   Same shape as The Alcove (become-king capped at 1) and The Hayloft
 *   (knight-hop capped at 1): the cap is a property of the geometry.
 *
 * DEAD ENDS, 2026-09-07 (all measured, none of them shipped):
 *   - THE BODY MUST ARRIVE BY CAPTURING. A finale sealed so that the only
 *     winning move is landing on an EMPTY square beside the king and surviving
 *     a turn reads 28-31% — and the traces show the bot never casts a single
 *     card, it shuffles on rank 4 until the move limit. Its rollout policy
 *     samples the top 3 moves by a fast score that pays for material and for
 *     attacking the king; a capture-and-stun is on that list, an empty post is
 *     not, so the sit-and-survive plan scores zero wins in every rollout, every
 *     candidate ties, and it falls back to walking toward the king. Provable
 *     but unfindable, the Glasshouse limit again. Every shipped finale here
 *     therefore ends with the Duchess TAKING a court pawn: findable, and the
 *     difficulty goes into WHICH pawn and WHICH mark.
 *   - DEAD MARKS MAKE THE LEVEL HARDER FOR THE BOT AND NOT FOR A HUMAN. Two
 *     pawns nobody can eat and nobody needs (e8, g8, sealing his back
 *     diagonals) cost L7 sixteen points: 59% with them as pawns, 75% with them
 *     as stone. `legalCandidates` emits one Decoy candidate PER ENEMY and the
 *     ~160 rollouts are split across all candidates, so every red herring
 *     thins the search. Same family as The Warren's empty squares: if a piece
 *     is only there to fill a square, make it a stone. Difficulty must come
 *     from choices that are ambiguous to a PLAYER, not from search dilution.
 *   - MORE FLOOR IS EASIER THAN LESS FLOOR, for the same reason. Removing
 *     L10's fallen panes from ranks 2-4 (more open board, more rook moves,
 *     more candidates) dropped it 34% -> 9%; adding walls at a4/b4 dropped it
 *     to 22%. Floor stone is a shape knob with a non-monotonic effect on the
 *     harness — read it, do not assume it.
 *   - FRIENDLY FIRE IS A UNIVERSAL SOLVENT AT enemiesPerTurn 1. Whatever the
 *     Duchess is standing on, a marked piece that gets eaten spends the army's
 *     whole action and she lives. That is why L7 cannot contain a bait bishop
 *     (it would rescue the double-locked door too) and why L10 needs a second
 *     enemy action for its trap to bite.
 *
 * Everything below this line is the original design text, kept as written for
 * the mechanism, the signature and the L1-L6 arc, which are unchanged. The
 * "FINALE LOCK", the "L7-L10 intended lines" and every MEASURED number below
 * describe SHIPPED-AND-REPLACED builds of L7, L9 and L10, not this one —
 * read the 2026-09-07 block above for the finale as it stands.
 * ---------------------------------------------------------------------------
 *
 * THE VERB: buy the body one turn. Not crossing a wall (The Moat), not
 * baiting hunters (The Alley), not blowing a hole (The Briar), not caging him
 * with his own guard (The Cliff) — building a queen that is dead the instant
 * she lands, and feeding the guard its own man so she lives to swing.
 *
 * THE MECHANISM, read out of lib/run/abilities.ts + pawn-ai.ts and then
 * hand-played through the engine:
 *   - The Duchess is a controlled QUEEN who spawns beside Rookie as a FREE
 *     action and may capture the king (controlledAllyLegalMoves). She lives
 *     TWO enemy turns at T1 (summonTurnsFor: 2/3/4/4/6) and her move IS
 *     Rookie's move for the turn. So her whole life is: appear, take one
 *     square, survive one enemy turn, strike.
 *   - Enemies value a summoned ally EXACTLY as highly as Rookie (pawn-ai
 *     capture priority: PIECE_THREAT.queen for both). A queen parked next to
 *     the court is therefore eaten on the very next enemy turn, every time.
 *     That is the whole reason she cannot finish alone.
 *   - Decoy marks one enemy and the AI re-plans against a VIEW in which the
 *     marked piece is Rookie and is REMOVED from the actors (decoyViewState).
 *     Whoever takes it is friendly fire: the capture is credited to Rookie,
 *     the king is stunned 2, and — the part that matters — it was the army's
 *     whole action for the turn. T1 Decoy is ONE enemy turn, one charge.
 *   - The tie-break is the design. A marked piece scores queen-value, so does
 *     the Duchess; the tie goes to the HIGHEST-THREAT attacker (queen 4,
 *     bishop/knight 2, pawn 1). So every finale marks a pawn defended by a
 *     BISHOP and puts a PAWN on the Duchess's landing square: the bishop
 *     always wins the tie and the pawn never gets its shot. Deterministic,
 *     not a coin flip.
 *   - Neither half finishes alone. Decoy can stun and blind but never reaches
 *     him; the Duchess reaches him and dies one move short.
 *
 * CONSTANT SIGNATURE — THE LATTICE. On every level the top half of the board
 * (ranks 5-8) is stone ON THE DARK SQUARES ONLY: a checkerboard of panes,
 * sixteen stones, laid over his half. Not a band (The Moat), not columns (The
 * Colonnade), not a box (The Vault / The Glasshouse), not offset bars (The
 * Switchback), not a hedge (The Briar), not shafts (The Stacks), not one
 * diagonal (The Slash), not an alley (The Alley), not a solid rank (The
 * Parapet). A checker field, and every rule of the run falls out of one fact:
 * DIAGONAL NEIGHBOURS SHARE A COLOUR AND ORTHOGONAL NEIGHBOURS DO NOT.
 *   - Every free square up there is light, and its four orthogonal neighbours
 *     are stone. So no rook line lives in the lattice: a rook can step into a
 *     fringe pocket and then cannot move at all. A king on a light square of
 *     ranks 6-8 can NEVER be captured by Rookie, in any position, ever.
 *   - The light diagonals run right through it. A bishop or a queen crosses
 *     the whole field; a knight (every jump lands on a dark square) is frozen
 *     solid. So the lattice is queen-and-bishop country, and the Duchess is
 *     the only body in the kit that can walk it.
 *   - His pawns cannot march (a pawn on a light square steps into stone) but
 *     they still bite diagonally, onto light squares. The court is a set of
 *     permanent guards that never advance and never leave. Pawn walls march
 *     (The Briar) — this one is pinned by its own geometry.
 *   - A bishop on a light square with its own pawns on its diagonals is
 *     jammed: no move, ever, and it defends both pawns. That is the decoy
 *     bait in every finale, and it is the highest-threat attacker on the
 *     board.
 *   - A PANE can be left open (a missing stone). One open pane is a doorway;
 *     two on a file are a channel a rook can ride. L1-L5 have panes open,
 *     L6-L10 do not. A piece standing ON an open dark pane is entombed —
 *     all four of its diagonals are stone.
 *
 * THE ARC
 *   L1-L2  a channel is open and he is at the top of it. Ride it (L2: take the
 *          cork out of it first).
 *   L3-L5  the channel is corked by something defended, and a card opens it:
 *          eat the reply behind a shield, or make his own court eat the cork.
 *   L6     the panes close. He is INSIDE the lattice for the first time, and
 *          Rookie is out of the game for the rest of the run: only a body
 *          that walks diagonals can reach him. DUCHESS, alone.
 *   L7-L10 the same cell, with one pawn added: a WATCHER on the only square
 *          that attacks him. The Duchess arrives and dies. Feed the court its
 *          own man and she lives one more turn — which is all she needs.
 *
 * KIT = duchess / decoy / aegis / magnet (`allowedAbilities` IS the kit).
 * No universal solvent (bishop-step or queen-pulse would give Rookie the
 * light diagonals and walk the lattice alone; knight-hop cannot, but is
 * banned by the rubric anyway). No second summon (one body-move per turn,
 * and twin+duchess is an explicit antiPair). Not smoke, freeze-ray, rewind or
 * sacrifice: each is a rival answer to "the body dies" (smoke+duchess,
 * freeze-ray+duchess, rewind+duchess are all confidence-4 pairs of their own,
 * and Sacrifice detonates the body Decoy is trying to save). Not rabies-dart
 * (antiPair with any summon, and with decoy). The fillers cannot save the
 * Duchess: Aegis shields ROOKIE and the enemies are eating the body, not her;
 * Magnet needs a rook line, and there are none inside the lattice. (Aegis has
 * one back door, closed by construction — see DEAD ENDS.)
 *
 * KEY / TRAP per level (measured, see MEASURED):
 *   L1  none needed — the c-file channel is open and he is on top of it.
 *   L2  none needed — one entombed bishop corks the g-file. Take it, take him.
 *   L3  AEGIS or DECOY (100% each). The e-channel is corked by an entombed
 *       bishop on the open pane e7, and the pawn on the open pane f8 — jammed
 *       forever behind its own pawn on f7 — defends it. Take the cork and f8
 *       takes you back. Shield it, or mark f8 and let the CORK eat it: an
 *       eater vacates its own square, so the doorway opens either way.
 *       TRAP for magnet (6%): the pull lands the cork on a square his court
 *       still covers half the time.
 *   L4  AEGIS or DECOY (100%). The same cork one file over, with the king
 *       directly above it and TWO defenders (b8 and d8, each jammed behind a
 *       filled pane). Two defenders buy the court nothing — a shield ENDS the
 *       enemy turn — so this level is the one that teaches the decoy lure:
 *       mark either pawn and the cork itself eats it, walking out of the
 *       doorway. TRAP for magnet (31%).
 *   L5  DECOY (100%). A bishop stands in the d-channel, jammed by his own
 *       court, one pawn on c8 defends it, and the king is off the channel on
 *       e8 — so she has to come out onto rank 8 to reach him, one move later
 *       than everywhere else. That extra move is what the shield does not
 *       cover: aegis reads 63% here, magnet 31%, decoy 100%.
 *   L6  DUCHESS (100%). The panes close. His cell is f7, three of his four
 *       diagonals are his own pawns, and the fourth — g6 — is empty and
 *       unwatched. Nothing with a rook line can ever touch him again. Summon
 *       her at f5, step her to g6: he has no square, and she takes him.
 *       TRAP for aegis / magnet / decoy: all three read 0% from here down.
 *   L7-L10 the pair, and nothing else.
 *
 * THE FINALE LOCK (all four levels, one shape):
 *   1. He stands on a light square of ranks 6-8, so all four of his
 *      orthogonal neighbours are stone: no rook, bishop or queen line on the
 *      board reaches his square along a rank or a file. Rookie cannot take
 *      him. Ever. No-ability is 0% by construction, not by tuning.
 *   2. Three of his four diagonals are his own pawns, and each is either
 *      unreachable (its own diagonals are the king and another pawn) or
 *      DEFENDED — so the Duchess cannot take one, land on it and win off the
 *      capture-stun. The fourth diagonal is the POST: the only square in the
 *      level from which anything attacks him.
 *   3. The square one step BEYOND the post, on his diagonal, is stone — so
 *      the post cannot be sniped from range down the same line.
 *   4. The square one step beyond the post on the OTHER diagonal is the
 *      Duchess's APPROACH, and the square directly below it — on rank 4, off
 *      the lattice — is stone. A light square in the lattice has stone on all
 *      four orthogonals, so filling the one below it makes the approach
 *      ROOK-UNREACHABLE while leaving the Duchess's diagonal wide open. That
 *      is what stops Rookie standing beside the post and spawning the body
 *      straight onto it for a one-turn kill (see DEAD ENDS — this is the hole
 *      that duchess+aegis found).
 *   5. A pawn sits diagonally above the post and covers it: THE WATCHER. She
 *      lands, the watcher eats her, and the pawn ends up standing on the post
 *      — the post is plugged for the rest of the level.
 *   6. Somewhere behind the court, a bishop jammed between two of its own
 *      pawns. Mark a pawn it defends and the bishop — threat 2 against the
 *      watcher's 1 — takes it, and takes the army's whole turn with it.
 *   7. NOTHING on the board can attack any square Rookie can stand on. Every
 *      court pawn's two capture squares are either stone or inside the
 *      lattice on a light square whose rank-4 neighbour is filled; every
 *      bishop is jammed. That is not decoration: an enemy that can hit Rookie
 *      turns AEGIS into a second Decoy, because a shielded capture is
 *      cancelled AND ends the enemy turn, which is exactly the turn the body
 *      needed (see DEAD ENDS).
 *
 * L7-L10 intended lines (three moves, then the swing):
 *   L7  THE NORTH-EAST COURT. He is on f7; e6/e8/g8 are his pawns, d7 defends
 *       e6, h5 is a filled pane, h7 is the watcher, and the bishop on c8 is
 *       jammed between b7 and d7. Rook f1-f4. Summon the Duchess on f5, mark
 *       b7 (or d7), step her f5-g6. The bishop eats its own pawn; the watcher
 *       never moves. She takes him off g6.
 *   L8  THE NORTH-WEST COURT. He is on d7; c8/e6/e8 are his, f7 defends e6,
 *       b5 is filled, b7 is the watcher, bishop g8 jammed between f7 and h7.
 *       Rook to d4/c4, summon on d5, mark h7 (or f7), step d5-c6.
 *   L9  THE HIGH CELL. He is on f7 again but the post has moved to the OTHER
 *       diagonal: e6, with d5 filled and d7 the watcher; g6 is his pawn
 *       (defended by h7) and it is what makes f5 — the approach — lethal to
 *       Rookie. Bishop c8 jammed between b7 and d7. Rook f1-f4, summon on f5,
 *       mark b7, step f5-e6.
 *   L10 THE WEST COURT. He is on d7 with the post at e6; f5 is the filled pane
 *       behind it, f7 is the watcher, and c6 — his fourth diagonal, defended
 *       by b7 — is a second pawn the body cannot take. The bait is the bishop
 *       on g8 between f7 and h7, the whole width of the board away from the
 *       post: the one finale where the mark and the swing are at opposite
 *       ends. Rook to c3/e4, summon on c4 or d5, mark h7 (or f7), step to e6.
 *
 * MEASURED (Normal difficulty, T5 bot; finale numbers of record are
 * `--jobs=1 --trials=32`, everything else 16 trials at `--jobs=3`):
 *   L1  100% with no ability.  L2  100% with no ability.
 *   L3  none 0% · aegis 100% · decoy 100% · magnet 6%  · duchess 100%
 *   L4  none 0% · aegis 100% · decoy 100% · magnet 31% · duchess 100%
 *   L5  none 0% · aegis 63%  · decoy 100% · magnet 31% · duchess 100%
 *   L6  none 0% · aegis 0%   · decoy 0%   · magnet 0%  · duchess 100%
 *   FINALE, T1 cards, 32 trials, serial:
 *     none 0% · aegis 0% · magnet 0% · decoy 0% · duchess 0% on ALL FOUR
 *     levels, and duchess+decoy L7 100% · L8 97% · L9 100% · L10 100%.
 *     Every other pair in the kit (duchess+aegis, duchess+magnet,
 *     decoy+aegis, decoy+magnet, aegis+magnet) reads 0% on all four levels
 *     (16 trials). Four unique-answer levels: one pair, no second key.
 *   FINALE at the highest tier the offers can reach: decoy:5, aegis:5 and
 *     magnet:5 all read 0% on all four. duchess:2 and duchess:3 read 0% on
 *     all four. duchess:4 and duchess:5 read L7 13% · L8 6%/25% · L9 94% ·
 *     L10 100%. T4 is the tier where the Duchess gets a SECOND CHARGE
 *     (maxUsesForTier: 1/1/1/2/2): the first body dies on the post, the
 *     watcher is now standing on it and nothing defends it any more, so the
 *     second body takes the pawn and then the king. No geometry closes this
 *     — the only squares that attack the post are the king's own square and
 *     the watcher's, so the post can never have a spare defender. This is
 *     the rubric's "the gate depends on ability TIER" case (The Parapet's
 *     knight-hop:4), reported not hidden: the gate holds at T1-T3 and breaks
 *     at T4+ unless the Duchess's tier is pinned.
 *   FIXED 2026-09-06 — `abilityTierCaps: { duchess: 3 }`. Re-measured one
 *     tier at a time (32 trials, --jobs=1, one loadout column per run):
 *     T2 0/0/0/0 and T3 0/0/0/0, confirming the block above, so T3 is the
 *     ceiling and the second charge is never offered. The forced-loadout
 *     matrix is unchanged by design — `--loadouts=duchess:4` still reads
 *     what T4 would do; the cap only removes it from offer slates.
 *   FULL RUNS (40, Normal, T5, never skipping an offer): 13/40 = 33% with
 *     random picks — every death is a move-limit at L6 (10) or L7 (14), i.e.
 *     the player who did not take the Duchess by L6 or Decoy by L7 ends
 *     there, which is the tension the rubric asks for. 35/40 = 88% when the
 *     pool is the pair. The random number matches the family (Vault 28%, The
 *     Parapet 33%); the pool number is high because the pool is only two
 *     cards, so the picker always ends up holding both halves.
 *
 * DEAD ENDS (2026-09-06, all fixed in the shipped build):
 *   - THE MOBILE GUARD IS A GIFT. L3 v1 put a QUEEN in the open channel to
 *     watch it: she reads 100% for no ability. A piece that can move walks
 *     toward Rookie (approachMove), and a rook moves first — anything that
 *     steps onto her rank or file is free food, and if it steps off the
 *     channel the door is open anyway. Every guard in this run is jammed or
 *     frozen; nothing in the lattice moves except the king's flinch.
 *   - AEGIS IS A SECOND DECOY WHEREVER ANYTHING CAN HIT ROOKIE. L10 v1 had a
 *     dark-squared bishop hunting the floor for flavour. duchess+aegis read
 *     100%: the shield cancels the bishop's capture AND ends the enemy turn
 *     (pawn-ai stepEnemyTurn, non-T5 branch), which is exactly the turn the
 *     watcher needed to eat the Duchess. The shield bought the body its life
 *     — Decoy's whole job. Fix: no enemy in a finale may attack any square
 *     Rookie can reach. It also means this kit cannot carry Smoke: one turn
 *     of cover would do the same thing.
 *   - PARK ON THE APPROACH AND SPAWN ONTO THE POST. With the approach square
 *     merely WATCHED, any card that survives one enemy turn there (aegis,
 *     and smoke if it were in the kit) lets Rookie stand beside the post and
 *     summon the body directly onto it — a one-turn kill with no Decoy. A
 *     watched square is not a closed square. Fix: fill the rank-4 square
 *     under the approach, which makes it rook-unreachable and leaves the
 *     diagonal untouched.
 *   - AEGIS BEATS MAGNET ON EVERY PLUG IN THIS GEOMETRY, so Magnet never got
 *     a home above 31%. A shield ends the enemy turn, so a second defender
 *     and even enemiesPerTurn:2 buy the court nothing, and after the block
 *     the recapturer has not moved — the doorway is open with Rookie
 *     standing in it. Magnet's only edge is landing the plug where no pawn
 *     covers it, and the bot picks the wrong landing square about half the
 *     time. In the lattice only PAWNS can cover an empty square (a jammed
 *     bishop only ever defends the pieces jamming it, and nothing at all can
 *     cover rank 8), so there is no way to make a second consecutive square
 *     of a path lethal. Magnet is this run's pure trap card; L4's
 *     enemiesPerTurn:2 was removed once it was measured to do nothing.
 */

import {
  make,
  pawn,
  bishop,
  queen,
  king,
  X,
  FLEE,
  STILL,
  type RunDef,
} from '../run-kit';
import type { Coord } from '../types';

const key = (c: Coord) => `${c.file},${c.rank}`;

/**
 * The lattice: stone on every DARK square of ranks 5-8 (a1 is dark, so dark
 * is (file + rank) even). `open` removes panes; `plus` fills light squares
 * (the walls of a cell, or a fallen pane on the floor).
 */
function LATTICE(open: Coord[] = [], plus: Coord[] = []): Coord[] {
  const skip = new Set(open.map(key));
  const out: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    for (let r = 5; r <= 8; r++) {
      if ((f + r) % 2 !== 0) continue;
      if (skip.has(key(X(f, r)))) continue;
      out.push(X(f, r));
    }
  }
  for (const c of plus) out.push({ ...c });
  return out;
}

const RUN_REVENGE_24: RunDef = {
  id: 'revenge-24',
  signaturePair: ['duchess', 'decoy'],
  name: 'The Lattice',
  blurb: 'Stone on every dark square. Rooks die up there; queens walk.',
  // KIT (2026-09-15): 3 cards, Aegis dropped (plan Phase 3: Aegis only on the
  // early rungs). Magnet stays as the trap/extra: a key on L3-L5, 0% alone on
  // every finale.
  allowedAbilities: ['duchess', 'decoy', 'magnet'],
  // TIER CAP — T1, tightened from T3 on 2026-09-07. The Duchess ALONE is still
  // 0% at T2 and T3, which is what bought her T3 before; but paired with Decoy
  // the finale reads 75/84/69/38 at T1 and 91/88/59/91 at T2 (and 94/97/47/97
  // at T3, 97/59/0/97 at T4). summonTurnsFor is 2/3/4/4/6, so the FIRST upgrade
  // gives her a third enemy turn — a second body move — and this run's whole
  // difficulty is that her life is exactly "appear, take one square, survive
  // one enemy turn, strike". An extra turn is not a bonus here, it is the
  // level: she can pick the wrong door, be eaten, chase a fled king, and still
  // arrive. Ceiling T1. (The old T4 note stands too: T4 is a second CHARGE and
  // solos three of the four finales.)
  abilityTierCaps: { duchess: 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — ONE PANE OPEN. The c-file has both its panes missing (c5, c7), so
    // it is a channel from the floor to his square. Ride it. A loose pawn on
    // e3 is free tempo on the way past.
    make(
      1,
      [
        pawn(5, 3),
        king(3, 8),
      ],
      {
        ...STILL,
        moveLimit: 8,
        hazards: LATTICE([X(3, 5), X(3, 7)]),
        kingPen: ['c8'],
      },
    ),
    // L2 — THE CORK. The g-file channel is open, and a bishop stands on the
    // open pane at g7 — entombed, because all four of its diagonals (f6, h6,
    // f8, h8) are stone. It has no move for the rest of the level and nothing
    // defends it. Take it, then take him.
    make(
      2,
      [
        bishop(7, 7),
        pawn(2, 3),
        king(7, 8),
      ],
      {
        ...STILL,
        moveLimit: 9,
        hazards: LATTICE([X(7, 5), X(7, 7)]),
        kingPen: ['g8'],
      },
    ),
    // L3 — THE DEFENDED CORK (DECOY / DUCHESS / MAGNET). The e-channel is open
    // and an entombed bishop corks it on the open pane e7, one square under his
    // feet. The pawn on f8 covers e7 and can never leave (its own f7 pawn blocks
    // it), so taking the cork gets you taken back. DECOY: mark the cork. The king
    // is next to it and the strongest attacker always takes the mark (the arrow
    // shows him), so HE eats his own bishop and stands stunned in the doorway —
    // slide up and take him. DUCHESS: she needs no door at all, the a4-e8
    // diagonal runs straight through the lattice to him. MAGNET: drag the cork
    // down the channel and take it in the open.
    make(
      3,
      [
        bishop(5, 7),
        pawn(6, 8), pawn(6, 7),
        king(5, 8),
      ],
      {
        ...STILL,
        moveLimit: 10,
        hazards: LATTICE([X(5, 5), X(5, 7), X(6, 8)]),
        kingPen: ['e8'],
      },
    ),
    // L4 — THE DOUBLE LOCK (MAGNET / DECOY). The same cork with the king
    // directly above it and TWO defenders on b8 and d8, each jammed behind a
    // filled pane. MAGNET is the clean key: pull the cork two squares down to c5,
    // off both defenders, and take it in the open. DECOY works the L3 way (mark
    // the cork, the king eats it) — L3 and L4 are the two levels that teach "he
    // takes what is next to him". The Duchess has no diagonal in here.
    make(
      4,
      [
        bishop(3, 7),
        pawn(2, 8), pawn(4, 8),
        king(3, 8),
      ],
      {
        ...STILL,
        moveLimit: 11,
        hazards: LATTICE([X(3, 5), X(3, 7), X(2, 8), X(4, 8)], [X(2, 7), X(4, 7)]),
        kingPen: ['c8'],
      },
    ),
    // L5 — THE DOORMAN (MAGNET / DECOY / DUCHESS; the king is not involved).
    // Reworked 2026-09-15: Tyler solved L3, L4 and the old L5 with the same
    // "mark the piece next to the king" line. The doorman is now TWO squares
    // below him: a bishop entombed on the open pane d6, guarded by the pawn on
    // the open pane c7 (c6 is filled, so c7 can never march). Take the doorman
    // and c7 takes you back. DECOY: mark the doorman and its OWN guard eats it —
    // the pawn is now standing on d6 with nothing behind it; take it, take him.
    // MAGNET: pull the doorman down the d-file. DUCHESS: a long way round, but
    // she gets there. Three keys, three different verbs.
    make(
      5,
      [
        bishop(4, 6),
        pawn(3, 7),
        king(4, 8),
      ],
      {
        ...STILL,
        moveLimit: 10,
        hazards: LATTICE([X(4, 6), X(3, 7), X(4, 8)], [X(3, 6)]),
        kingPen: ['d8'],
      },
    ),
    // L6 — THE FIRST CELL (DUCHESS). Every pane is in place. He stands on f7,
    // a light square, so e7/g7/f6/f8 are stone and NO rook line on the board
    // can ever attack him — Rookie is out of the game from here to the end of
    // the run. Three of his diagonals are his own pawns (e6 defended by d7,
    // e8 and g8 unreachable behind him) and the fourth, g6, is empty and
    // UNWATCHED. Walk to f4, summon her on f5, step her to g6: every square
    // he owns is covered by a queen and he has nowhere to go. She takes him.
    make(
      6,
      [
        pawn(5, 6), pawn(4, 7), pawn(5, 8), pawn(7, 8),
        king(6, 7),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: LATTICE(),
      },
    ),
    // L7 — WHICH BAIT (2026-09-15 rebuild). Nothing touches the king: e8's
    // two diagonal neighbours d7 and f7 are empty, and the doors are the pawns one
    // step further out, c6 and g6. A Duchess who takes a door is looking at him
    // through the empty square, and the capture stuns him so he cannot step away.
    // g6 is guarded once (h7). c6 is guarded twice (b7 and the bishop jammed on
    // b5). A mark nobody can reach does NOTHING (the army simply plays on), so
    // "blank the guard" is not a move in this run — every working mark is a
    // FEED: something has to eat it, and eating it is the army's whole turn.
    // Mark c6 and the bishop eats it (a bishop outranks the h7 pawn), which is
    // the turn h7 needed: the Duchess takes g6 down the long diagonal and takes
    // him next turn. Marking h7 or b7 feeds nobody; taking c6 dies to two locks.
    make(
      7,
      [
        pawn(3, 6), pawn(7, 6),
        pawn(2, 7), pawn(8, 7),
        bishop(2, 5),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 6,
        hazards: LATTICE([], [X(1, 8), X(3, 8), X(7, 8), X(5, 6), X(1, 6), X(1, 4), X(2, 4), X(3, 4)]),
      },
    ),
    // L8 — FEED THE LOCK ITSELF (two enemies per turn). One door, e6, guarded
    // once, by f7 — and a bishop jammed on g8 between f7 and h7. With two hands
    // the L7 answer loses: mark h7, the bishop eats it with one hand and f7 eats
    // the Duchess with the other. The only mark that lives is f7 itself: the
    // bishop eats its own guard, the second hand has nothing left to hit, and the
    // Duchess on e6 takes him through d7. Marking e6 before she lands is the
    // third trap: f7 eats the door and uncovers the bishop's diagonal onto it.
    // The floor is the other half: c4/d3/e3/f5 are stone, so the only launch is
    // d5 and Rookie has to walk round to d4/e4 from the right to reach it.
    make(
      8,
      [
        pawn(5, 6),
        pawn(6, 7), pawn(8, 7), bishop(7, 8),
        king(3, 8),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        enemiesPerTurn: 2,
        hazards: LATTICE([], [X(2, 7), X(5, 8), X(3, 6), X(1, 8), X(6, 5), X(3, 4)]),
      },
    ),
    // L9 — THE PLUG (mark a turn EARLY). The door d7 touches him; its only
    // approach is the g4-f5-e6-d7 diagonal, and the pawn on e6 plugs it (c6,
    // f7, c8 and d4 are stone). Nothing guards the door once she is on it. The
    // mark is not for this turn: mark the pawn on d5 and the plug steps DOWN to
    // eat it, which opens the diagonal — and only then, next turn, can she run
    // g4-d7, take the door and take him from beside him. The second line is
    // also a turn early: mark the DOOR, the king steps onto d7 to eat it (and
    // is stunned), and next turn the Duchess takes the plug on e6 — which is
    // now the square beside him — and then him. Either way the mark has to go
    // down before the body, which is what the old L9 never asked.
    make(
      9,
      [
        pawn(4, 7),
        pawn(5, 6),
        pawn(4, 5),
        king(5, 8),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        hazards: LATTICE([], [X(6, 7), X(3, 6), X(3, 8), X(4, 4)]),
      },
    ),
    // L10 — ROOKIE GOES IN (two enemies per turn). The capstone asks for all
    // three bodies. The door f7 touches him and nothing guards it, but the only
    // square that reaches it is e6, and the only square beside e6 that is not
    // stone is d5 — a bishop, guarded by the pawn c6. So Rookie has to take d5
    // herself and survive on it: mark b5 (c6's other target) and take the bishop
    // in the same turn. c6 eats b5 with one hand; the second hand has nothing that
    // can see her. Next turn she spawns the Duchess on e6 from INSIDE the lattice,
    // the Duchess takes f7, and then him. Traps: mark the door and the king eats
    // it but c6 still takes Rookie with the second hand; take d5 unmarked and c6
    // takes her. Two more lines, both a turn early: mark c6 so the bishop
    // eats it and the Duchess launches from the empty d5, or mark d5 so c6
    // eats the bishop and Rookie takes the pawn left standing on d5.
    // g4/h4/h3 are fallen panes: from any of them the d5 bishop's one free
    // step (to e6) counts as closing on Rookie, and a bishop on e6 would sit on
    // the launch square. From everywhere else it never moves.
    make(
      10,
      [
        pawn(6, 7),
        pawn(3, 6), bishop(4, 5), pawn(2, 5),
        king(7, 8),
      ],
      {
        ...FLEE,
        moveLimit: 8,
        enemiesPerTurn: 2,
        hazards: LATTICE([], [X(8, 7), X(5, 8), X(7, 6), X(6, 5), X(3, 4), X(5, 4), X(2, 4), X(7, 4), X(8, 4), X(8, 3)]),
      },
    ),
  ],
};

export default RUN_REVENGE_24;
export { RUN_REVENGE_24 };
