/**
 * revenge-47 — THE CORONATION. Built 2026-09-08 for the signature pair
 * PAGE + REWIND. Kit = page / rewind / magnet / sacrifice
 * (`allowedAbilities` IS the kit). All four cards are LIVE.
 *
 * CONCEPT (A): an unbuilt pair the discovery harness has already proved can
 * gate, and the best-evidenced one left in the table — `page+rewind` gates
 * THREE generated levels (checker-L7-v16-s249 77%, checker-L8-v14-s250 77%
 * with a UNIQUE answer, moat-L7-v17-s250 63%) under kits where every single
 * card reads 0% (data/run-playtest/combo-library/page+rewind/). No other
 * unbuilt pair in SYNERGY.md has three gated levels. REWIND has been half of
 * exactly one shipped pair (twin + rewind, The Dogleg) and PAGE of three
 * (page + aegis, The Picket; panic + page, The Niche; chequer + page, The
 * Inlay) — and in none of the four was the Page's ONE distinguishing
 * property, that he STOPS BEING A PAWN, ever the point of the level.
 *
 * THE VERB: CROWN HIM. Not crossing a wall (The Moat), not baiting hunters
 * (The Alley), not a poison timer (The Switchback), not blowing a hole (The
 * Briar), not caging with his own guard (The Alcove), not a double door (The
 * Millstone), not a two-rook net (The Parapet), not buying a body time (The
 * Lattice), not moving the wall (The Quarry), not a capture you do not
 * survive (The Picket), not a lure (The Pinch), not zugzwang (The Niche), not
 * aiming a blast (The Rood), not buying the step (The Stair). And — the one
 * that has to be answered, because it shares a card — not The Dogleg's undo:
 * there the Twin was SPENT on purpose and Rewind bought the charge back. Here
 * nothing is spent. A pawn is walked at a wall that kills him, and the undo
 * buys the ONE TEMPO between the square he dies on and the square he becomes
 * a queen on. The run is about a PROMOTION SQUARE, and every level of it asks
 * the same question in a different way: what stands between your man and the
 * back rank, and which enemy turn do you take back to get him there?
 *
 * ── THE FOUR ENGINE FACTS THE RUN STANDS ON ────────────────────────────────
 *
 *  1. A PAGE IS THE ONLY BODY IN THE GAME THAT CHANGES TYPE.
 *     `applyControlledAllyMove` promotes him to a controlled QUEEN the moment
 *     he lands on his promotion rank (8 at T1/T2, 7 from T3). He is also the
 *     only summon `summonTurnsFor` gives no clock at all — undefined, i.e.
 *     permanent until captured, "his whole job is the long walk".
 *
 *  2. HE IS BORN BESIDE HER AND NOWHERE ELSE. `summonSpawnSquares` (every
 *     summon but Vanguard) returns the EIGHT squares around Rookie. So the
 *     only thing the player chooses about a Page is the square she is
 *     standing on when she makes him — and a square she cannot walk to as a
 *     rook is still a square she can be standing NEXT to. That is the pocket
 *     below.
 *
 *  3. A CONTROLLED PAWN MOVES ONE SQUARE AT T1 AND HIS MOVE IS HER MOVE.
 *     `pageSprintSteps` is 1/2/2/3/3 and `applyControlledAllyMove` ticks the
 *     move budget exactly like a Rookie move. So the walk costs TURNS, and
 *     every turn it costs is an enemy phase in which the court may eat him.
 *
 *  4. REWIND RESTORES THE ENEMY SIDE AND THE ALLIES WITH IT.
 *     `applyRewind` spreads the enemy-phase snapshot and then overwrites only
 *     ROOKIE's own fields (form, shield, smoke, tempo, captures, charges).
 *     `allies` is NOT in that list, so it comes back from the snapshot: a body
 *     the court ate last turn is standing again, the piece that ate him is
 *     back where it started, THE KING IS BACK ON THE SQUARE HE STEPPED OFF —
 *     and Rookie's move for this turn has not been spent. That triple is why
 *     one card can answer three different problems, which is what makes four
 *     different finale lines out of one pair possible at all.
 *
 * ---------------------------------------------------------------------------
 * CONSTANT SIGNATURE — THE LID, THE POCKET AND THE RAY. Three parts on all
 * ten levels. No other run has this silhouette: the catalogue is bands
 * (Moat), columns (Colonnade), boxes he sits inside (Vault, Glasshouse),
 * offset bars (Switchback), a hedge (Briar), shafts (Stacks), diagonals
 * (Slash, Cliff), rings (Keep), roofs (Hayloft), a tower with a stair
 * (Candle), a hearth, a quarry face, a rail (Balcony), a cairn, a niche, an
 * inlay, a solid block bored with holes (Loophole), an embrasure, a cross
 * (Rood) and a stepped wall (Stair). This one is a CEILING WITH ONE HOLE IN
 * IT and a chimney under the hole that nothing can climb.
 *
 *  1. THE LID. Rank 8 across his quarter is solid stone with exactly ONE
 *     square left out — THE CROWNING SQUARE (f8). Because its neighbours on
 *     rank 8 are stone, a ROOK standing on it sees one dead file and nothing
 *     else. It is the only square on rank 8 anything of hers can stand on, so
 *     it is the only square in the level where a Page becomes a queen.
 *
 *  2. THE POCKET. Under the hole, a column of free squares — f6, f7, f8 —
 *     sealed on every side that is not itself the pocket: e6 and g6 close it
 *     on rank 6, f5 closes the file from below, e8/g7 close the top. NO ROOK
 *     LINE EVER ENTERS IT. She cannot walk in. She can only be standing
 *     NEXT to it — on g5, the one free square that touches f6 — and make a
 *     body there. The pocket is the run: the level's most important square is
 *     one she is permanently locked out of.
 *
 *  3. THE RAY. His cell hangs off the crowning square along ONE DIAGONAL —
 *     f8 / e7 / d6 / c5 — and he lives on the far end of it (pen d6+c5, the
 *     two squares a king can shuttle between). The squares that attack BOTH
 *     of them at once (c6 and d5) are stone, so a rook can chase him forever
 *     and never corner him; e7 is left free and EMPTY so the ray is open, but
 *     c7 and d7 are stone so no rook line reaches e7 either. The whole cell
 *     is closed to every rank and every file in the game — and open, end to
 *     end, to ONE queen standing on the crowning square. That is the trade
 *     the run sells: the hole in the lid is worthless to the piece you are,
 *     and decisive to the piece you can make.
 *
 * WHY A PAGE BORN BESIDE HIM DOES NOT JUST TAKE HIM. A pawn attacks
 * (file +/- 1, rank + 1), so a Page born on the square diagonally BELOW a
 * king captures him on the same turn he is made — the cast is free and his
 * move is her move. That is a one-turn win with one card and it would delete
 * the run. Every level is therefore built so that both squares diagonally
 * below every pen square are stone or unreachable: e5 and c5 under d6, b4 and
 * d4 under c5, and b5/b6/c4 walled so that c5 itself has no Rookie-adjacent
 * free neighbour while he stands on d6. Check this FIRST on any new level of
 * this run; it is the one mistake that silently reads 100% for `page`.
 *
 * ---------------------------------------------------------------------------
 * PER-CARD KEY / TRAP MAP
 *
 *   page      TRAP L1-L3 (no hole in the lid, or no way to the pocket).
 *             KEY  L4 (the answer pawn is absent: the walk is free, and a
 *                  crowned queen on the ray ends it). Half the combo L7-L10.
 *   rewind    TRAP L1-L4, L6.
 *             KEY  L5 (he steps out of her line; take the step back and take
 *                  him where he was). Half the combo L7-L10.
 *   magnet    KEY  L3 (drag the cork out of the only file north) and L6 (drag
 *                  the watcher off the pocket's mouth so she can stand on g5).
 *             TRAP everywhere else, and dead on L7-L10: his cell touches no
 *             line of hers, so there is nothing on her rays to pull.
 *   sacrifice TRAP on all ten. It needs a summon, this kit makes exactly one,
 *             and a pawn's blast area is the two squares he attacks — the
 *             smallest in the family (pair-hypotheses.json anti-pair
 *             `page+sacrifice`). On the finales it is a real temptation and a
 *             real mistake: the Page standing on f7 attacks g8, so detonating
 *             him kills the answer pawn — and burns the only body in the kit.
 *
 * KIT SAFETY. No universal solvent (`bishop-step`, `knight-hop`,
 * `become-king`) is in the kit. One summon only, so no tempo starvation and
 * no rabies-beside-a-summon. Both fillers are measured dead weight next to
 * the signature: `magnet+rewind` has been played on 23 surviving levels
 * without ever gating one and `magnet+page` on 12, `sacrifice+rewind` on 9,
 * `magnet+sacrifice` on 15 (combo-library/SYNERGY.md), and `page+sacrifice`
 * is an explicit anti-pair. `page+aegis` DID gate (The Picket), which is why
 * Aegis — the obvious fourth card — is deliberately not here.
 *
 * ---------------------------------------------------------------------------
 * THE FOUR FINALE LINES — WRITTEN BEFORE BUILDING, AND NOT DELIVERED.
 * READ THIS BEFORE YOU BUILD ON THIS FILE.
 *
 * The plan was four different USES of one pair, one per finale level, because
 * Rewind can restore three different things (the body, the enemy's position,
 * the king's own step) and the Page can be crowned by a step or by a capture:
 *
 *   L7  THE WALK      — undo the Page's death mid-walk, and crown him the
 *                       same turn. (body, before the crown)
 *   L8  THE BITE      — the ray is blocked by a jammed pawn on e7; the crowned
 *                       queen has to trade onto it and THE KING takes her
 *                       back. Undo his recapture. (body, after the crown)
 *   L9  THE FLIGHT    — nothing dies at all: he simply steps off the ray the
 *                       turn she is crowned. Undo HIS step. (the king)
 *   L10 THE LONG WALK — the mouth is shut, so the body is born a rank lower
 *                       and the undo must be saved for the third turn.
 *
 * ONLY L7 SURVIVED MEASUREMENT. L8, L9 and L10 are the L7 line on a tighter
 * clock, which is the anti-pattern this run was commissioned to avoid
 * ("One line, four times", .claude/run-level-design.md, Tyler 2026-09-06).
 * That is the honest state of this file and the reason it ships at `idea`.
 * The numbers and the cause are in MEASURED / DEAD ENDS at the bottom; the
 * short version is that all three variants are PROVABLE and UNFINDABLE, and
 * that the Page's walk is a four-turn plan with no intermediate reward, so it
 * has no tolerance left for a second idea in the same level.
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

/** Stone, by name. */
const S = (...names: string[]): Coord[] => names.map(sq);

/**
 * THE LID — rank 8 across his quarter, one square left out (f8).
 * THE POCKET — f6/f7/f8, sealed by e6, g6, f5, g7 (e8 is part of the lid).
 * THE RAY — e7 free and empty; c7/d7 stone so no rook line reaches it.
 * THE CELL — pen d6+c5; c6/d5 stone (the two squares that attack both at
 *   once); e5/b4/d4 stone and b5/b6/c4 stone (no Page may ever be born on a
 *   square diagonally below a pen square).
 */
const SHELL = [
  'c8', 'd8', 'e8', 'h8', // the lid
  'g7', 'g6', 'e6', 'f5', // the pocket's walls
  'c7', 'd7', // no rook line into e7
  'c6', 'd5', // the two squares that would attack d6 and c5 at once
  'e5', 'b4', 'd4', 'b5', 'b6', 'c4', // no Page born under a pen square
] as const;

/** The full shell, as hazards. */
const CELL = S(...SHELL);

/** The king's two squares — the far end of the ray from the crowning square. */
const PEN = ['d6', 'c5'];

/**
 * ===========================================================================
 * MEASURED — 2026-09-08. THIS RUN DOES NOT MEET THE COMBO GATE.
 * It ships at pipeline stage `idea`: NOT registered as built, NOT on the
 * playtest page, NOT player-facing. Read this block before building on it.
 * ===========================================================================
 *
 * FINALE, NUMBERS OF RECORD — `revenge.ts matrix --levels=7,8,9,10
 * --difficulty=normal --trials=32 --jobs=1`, kit cards at T1, bot at T5:
 *
 *      L    none    page  rewind  magnet  sacrif   page+rewind
 *      7      0%      3%      0%      0%      0%       59%
 *      8      0%     13%      0%      0%      0%       31%
 *      9      0%     13%      0%      0%      0%       34%
 *     10      0%     16%      0%      0%      0%       25%
 *
 * Against the contract (none ~0, every single <= 8%, the pair 60-80%):
 *   - no-ability      PASSES on all four. 0/0/0/0, and it is structural, not
 *                     tuning: no rank and no file in the game touches either
 *                     of his squares, and the two squares that would attack
 *                     both at once are stone.
 *   - rewind          PASSES, 0% everywhere. Nothing to restore.
 *   - magnet          PASSES, 0% everywhere. His cell touches no line of hers.
 *   - sacrifice       PASSES, 0% everywhere. The kit makes one body and a
 *                     pawn's blast is the two squares he attacks.
 *   - page            FAILS on L8/L9/L10 (13/13/16%, ceiling is 8%).
 *   - the pair        FAILS on all four (59/31/34/25%, floor is 60%).
 *
 * So four of the six columns are exactly what the contract asks for, and the
 * two that matter are both short. L7 at 59% is one point under the floor and
 * inside the ~8pp binomial noise of 32 trials; L8-L10 are not close.
 *
 * LADDER — `matrix --levels=1..6 --trials=16 --jobs=2`:
 *
 *      L    none    page  rewind  magnet
 *      1    100%    100%    100%    100%
 *      2    100%    100%    100%    100%
 *      3    100%    100%    100%    100%
 *      4      0%      6%      0%      0%
 *      5      0%      6%      0%      0%
 *      6      0%      6%      0%      0%
 *
 * The mid-run is broken in both directions and this is the second reason the
 * run is not shippable. L1-L3 are free for every loadout, including L3, which
 * was authored as a magnet key and is 100% bare (the cork on b5 is not a cork
 * — rank 7 is reachable without passing it). L4-L6 were authored as the
 * single-card teaching levels for page, rewind and magnet respectively and
 * every one of them reads 0-6% for its own key: the moment the full shell is
 * drawn, his cell is unreachable by everything except a crowned queen, so the
 * "one card, ~90%" band has nowhere to live. There is no L4-L6 in this file,
 * only a cliff between L3 and L4.
 *
 * FULL RUNS — `revenge.ts runs --run=revenge-47 --difficulty=normal
 * --runs=40`: **0/40 full clears.** L1-L3 cleared 40/40; L4 was reached 40
 * times and cleared TWICE (5%, fail mode move-limit 38/40); L5 was reached
 * twice and L6-L10 were never reached at all. Picks over the 40 runs:
 * rewind 25, sacrifice 23, page 18, magnet 14. The `--pool=page+rewind` read
 * was not taken: with nothing surviving L4, it would only have re-measured
 * the same wall. The 10-25% random-clear target is not merely missed, it is
 * undefined — the run has no reachable second half.
 *
 * ===========================================================================
 * DEAD ENDS — what was tried, what the numbers said, and the one general
 * lesson worth more than the run.
 * ===========================================================================
 *
 * THE HEADLINE: THE PAGE'S WALK IS A FOUR-TURN PLAN WITH NO INTERMEDIATE
 * REWARD, AND THAT LEAVES NO ROOM FOR A SECOND IDEA IN THE SAME LEVEL.
 * The winning line is: walk to the mouth, make the body (free), step him,
 * lose him, undo, step him again, be crowned, strike. Four Rookie turns after
 * she arrives, and not one of them improves any position the bot's rollouts
 * can score — the Page is a pawn worth almost nothing until the instant he is
 * a queen, and the rewind LOOKS like a wasted action right up to the move
 * after it. Every variant below is provable by hand and was measured
 * unfindable. This is the Glasshouse's "provable but unfindable" and the
 * Switchback's delayed fuse, in the sharpest form yet: not a fuse the bot
 * will not light, but a plan whose whole value arrives on the last move.
 *
 *  1. THE FLIGHT (intended L9) — 0% FOR THE PAIR, AND 0% FOR EVERY CARD.
 *     His cell was d6 + c6 with only d6 on the ray from f8, so the crown
 *     alone could not finish: he steps sideways off the diagonal and the undo
 *     puts him back under the new queen. Hand-provable in four moves. The bot
 *     NEVER CAST THE PAGE AT ALL — `trace --level=9 --loadout=page+rewind`
 *     shows it shuffling between e4 and f4 for the whole budget. With no
 *     capture anywhere in the level there is nothing for a rollout to score
 *     before the last move, so the whole line is invisible. **Rewind cannot
 *     be gated on undoing the KING'S STEP.** Rewind's findable use is undoing
 *     a CAPTURE — something visibly died, and the undo visibly un-kills it.
 *     That is a rule for the next run that wants this card, and it halves the
 *     card's design space.
 *
 *  2. THE BITE (intended L8) — 0% FOR THE PAIR. A jammed black pawn on e7
 *     blocked the ray, so the crowned queen had to trade onto e7 and the KING
 *     took her back (d6 touches e7; kings capture). Undo his recapture and
 *     she is standing on e7 with his square on her diagonal. Also
 *     hand-provable, also 0%: it asks the bot to deliberately hang a queen.
 *     Same family as 1 — the payoff is two moves past a move that looks like
 *     a blunder.
 *
 *  3. THE LONG WALK (intended L10) — 19% at moveLimit 16, 25% at 20. Shutting
 *     the mouth with a jammed pawn on h6 (covering g5) forces the body to be
 *     born on f5 instead of f6, which adds ONE step to the walk. One extra
 *     step cost ~35pp. The walk has no slack at all.
 *
 *  4. enemiesPerTurn: 2 — 25% at moveLimit 15, 31% at 22. Loosening the clock
 *     recovered ~6pp, so the clock was never the binding constraint: the
 *     second enemy action per turn is a second chance to interrupt a plan
 *     that cannot be restarted (one Page, one Rewind).
 *
 *  5. ONE EXTRA HUNTER on the L7 board — 63% -> 25-38%. A single bishop on c2
 *     or knight on h3, neither of which touches the pocket or the ray, costs
 *     25-38pp, because the only road to the mouth is the g-file and anything
 *     watching it makes the four-turn plan unaffordable.
 *
 *  6. A HUNTER ON THE MOUTH DIAGONAL (first build) — pair 25% on L7, 0% on
 *     L9. A bishop on h4 covers g5 AND f6, i.e. the standing square and the
 *     birth square at once. Obvious in hindsight; the tell was `page` reading
 *     0% on a level where the walk was supposed to be free.
 *
 *  7. THE INTRUDER (an earlier L8) — page alone 88%. A knight on d7, on a
 *     square no rook line reaches, was supposed to leap into the pocket and
 *     squat on the birth square. `approachMove` walks it toward Rookie and it
 *     leaves and never comes back, so the pocket was simply unguarded. A
 *     squatter has to be a piece with NO move that improves its distance to
 *     Rookie, and a piece like that is usually a piece with no moves at all,
 *     which cannot capture either. There may be no reliable squatter.
 *
 * WHAT IS WORTH KEEPING. The geometry. THE POCKET — three free squares under
 * a hole in a stone lid, sealed so no rook line enters — is a clean, provable
 * "she can only be NEXT to it" structure and it produced the cleanest singles
 * column in the catalogue (three of four kit cards at a flat 0% on all four
 * finales, no-ability 0% by construction rather than by clock). THE RAY —
 * his cell on the crowning square's diagonal, with the two squares that would
 * attack both of his squares at once made stone — is a bare-rook-proof cell
 * that is not a niche and not a burrow. Both are reusable. What they need is
 * a partner card whose payoff lands on the turn it is spent.
 *
 * IF SOMEONE PICKS THIS UP: the most promising repair is to shorten the plan,
 * not to loosen the clock. Give the Page his promotion square ONE step away
 * and put the gate on something that happens on that single step — or pair
 * the Page with a card that pays immediately and let Rewind out of the kit
 * entirely. `abilityTierCaps` was never reached: page T2 (sprint 2) would
 * turn the three-square pocket into a one-move crown and break what gate
 * there is, so a shipped version of this geometry needs `{ page: 1 }`, which
 * is itself a warning that the design is one engine constant away from
 * collapsing.
 */
export const RUN_REVENGE_47: RunDef = {
  id: 'revenge-47',
  name: 'The Coronation',
  blurb:
    'There is one hole in his ceiling and you can walk to it whenever you like. Standing in it does nothing at all. The trick is that a pawn who reaches it stops being a pawn — and the court gets exactly one turn to stop him, which is one turn you are allowed to take back.',
  allowedAbilities: ['page', 'rewind', 'magnet', 'sacrifice'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE LID. The silhouette, for free. He stands still one rank under
    // his own ceiling and rank 7 is open all the way from the a-file, so a
    // bare rook slides in and takes him. The player sees the hole in the lid
    // on level one and learns, over the next six, that walking to it is
    // worthless.
    make(1, [king(5, 7), pawn(2, 3)], {
      ...STILL,
      moveLimit: 12,
      hazards: S('c8', 'd8', 'e8', 'h8', 'g7', 'g6', 'e6', 'f5'),
    }),
    // L2 — THE POCKET. Same ceiling, and now he runs. His room is the two
    // squares e7/d7 — one rook line on rank 7 covers BOTH, so he is locked
    // the moment she reaches it and this is still nearly free. The jammed
    // pawn on g8 appears for the first time: it can never move (g7 is stone)
    // and it watches f7 forever.
    make(2, [king(5, 7), pawn(7, 8), knight(2, 3)], {
      ...FLEE,
      moveLimit: 12,
      hazards: S('c8', 'd8', 'e8', 'h8', 'g7', 'g6', 'e6', 'f5', 'e5'),
      kingPen: ['e7', 'd7'],
    }),
    // L3 — THE ONLY FILE (magnet KEY). The shell is drawn in full for the
    // first time, so his cell is already the ray's far end — but the pen is
    // e7/d7 again, a rank pair one line covers, and the only way onto rank 7
    // is the a/b-file. A bishop corks b5, defended by a jammed pawn on a6
    // (a5 is stone, so it never marches): capture it and the pawn collects.
    // Magnet meets the cork on the RANK and drags it off her road.
    make(3, [king(5, 7), bishop(2, 5), pawn(1, 6), pawn(7, 8)], {
      ...FLEE,
      moveLimit: 14,
      hazards: S(
        'c8', 'd8', 'e8', 'h8', 'g7', 'g6', 'e6', 'f5', 'e5', 'a5', 'c5', 'd5', 'c6',
      ),
      kingPen: ['e7', 'd7'],
    }),
    // L4 — THE FREE WALK (page KEY, and the run's whole idea in one level).
    // The full shell: his cell is d6/c5 at the end of the ray and NO rook
    // line in the game reaches either square. There is no pawn on g8, so the
    // pocket is unwatched — a Page born on f6 walks f7, f8 and is crowned,
    // and the queen owns the ray end to end. Nothing else in the kit can
    // touch him.
    make(4, [king(4, 6), knight(2, 3)], {
      ...FLEE,
      moveLimit: 16,
      hazards: CELL,
      kingPen: PEN,
    }),
    // L5 — THE STEP BACK (rewind KEY). The lid is SOLID this level — f8 is
    // stone, so there is no crowning square and the Page is a dead card. His
    // room is d6/c5 with d7 OPEN, so a rook on d7 attacks d6 and he steps
    // down the ray to c5, which no line reaches. He does that once. Take the
    // step back and he is standing on the square her rook is already
    // attacking, with her move still in hand.
    make(5, [king(4, 6), pawn(7, 8)], {
      ...FLEE,
      moveLimit: 14,
      hazards: S(
        'c8', 'd8', 'e8', 'f8', 'h8', 'g7', 'g6', 'e6', 'f5',
        'c7', 'c6', 'd5', 'e5', 'b4', 'd4', 'b5', 'b6', 'c4',
      ),
      kingPen: PEN,
    }),
    // L6 — THE MOUTH (magnet KEY, second use). Full shell, no pawn on g8, so
    // the walk is free again — except a knight sits on g4 covering g5, the
    // ONE square in the level that touches the pocket. She cannot stand there
    // to make a body and she cannot take the knight (a jammed pawn on h3
    // defends it, h2 stone). Magnet pulls along her own lines: meet it on the
    // file or the rank and drag it away from the mouth.
    make(6, [king(4, 6), knight(7, 4), pawn(8, 3)], {
      ...FLEE,
      moveLimit: 16,
      hazards: [...CELL, ...S('h2')],
      kingPen: PEN,
    }),
    // ==================== L7-L10 — THE COMBO GATE ====================
    // L7 — THE WALK. Rewind restores THE BODY, before the crown. The jammed
    // pawn on g8 watches f7 forever and it is the only square the walk can
    // cross. Born on f6, walked to f7, eaten. Rewind, and the same turn puts
    // him on f8.
    make(7, [king(4, 6), pawn(7, 8), knight(2, 3)], {
      ...FLEE,
      moveLimit: 16,
      hazards: CELL,
      kingPen: PEN,
    }),
    // L8 — THE WALK, TIGHTER. Same mechanism, one move less on the clock.
    // See MEASURED / DEAD ENDS: every attempt to make this level ask a
    // DIFFERENT question of the pair drove the pair below the gate floor.
    make(8, [king(4, 6), pawn(7, 8), knight(2, 3)], {
      ...FLEE,
      moveLimit: 16,
      hazards: CELL,
      kingPen: PEN,
    }),
    // L9 — THE WALK, TIGHTER STILL.
    make(9, [king(4, 6), pawn(7, 8), knight(2, 3)], {
      ...FLEE,
      moveLimit: 15,
      hazards: CELL,
      kingPen: PEN,
    }),
    // L10 — THE WALK, NO SLACK.
    make(10, [king(4, 6), pawn(7, 8), knight(2, 3)], {
      ...FLEE,
      moveLimit: 15,
      hazards: CELL,
      kingPen: PEN,
    }),
  ],
};

export default RUN_REVENGE_47;
