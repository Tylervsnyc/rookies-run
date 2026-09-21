/**
 * revenge-58 — THE ATOLL. Built 2026-09-19 for the signature pair
 * CASTLE + DRAGON. Kit = castle / dragon / swap / boulder
 * (`allowedAbilities` IS the kit). Castle is a TESTING card.
 *
 * LEVEL-FIRST. The level came before the card: a king alone on an island
 * ringed by lava, no guards, no door, nothing crosses. Castle was invented to
 * answer it — she is a rook, he is a king, so castling is simply legal, and HE
 * comes out. Read out of `castleLanding` / `kingCastled` in lib/run:
 *   - CASTLE is her BODY-MOVE. He jumps two toward her along the rank (T1 is
 *     rank only), she lands on the square he crossed if it is open ground (the
 *     chess move — she ends up ON his island) or pulls up short beside his
 *     landing square when the crossed square is lava. The turn ends. On the
 *     phase that follows he does not swing at her; he RUNS if he has a safe
 *     square and stands if he has none.
 *   - So the whole card is one question: WHAT ARE HIS FLEE SQUARES ON THE
 *     BEACH? With none, Castle solos (L3, L5 teach exactly that). With one,
 *     Castle alone maroons her beside a king who swings next phase — 0%.
 *   - DRAGON (T1: one charge, spawns beside her, two turns, not dazed) is the
 *     second half in three different ways: it can already be watching the flee
 *     square when he lands (spawn is a free action, the castle is the
 *     body-move — same turn), it can be summoned on his vacated landing square
 *     the turn after and eat him where he ran, or it can clear a guard off the
 *     beach so the castle is legal at all.
 *
 * THE ONE GEOMETRIC FACT THE RUN IS BUILT ON: his flee squares on the beach
 * are always a knight's move from the square he castled FROM, and a dragon has
 * knight jumps, which cross lava. So every open flee square is also a square
 * a dragon could attack his island from. Every island here is drawn by that
 * rule: every knight-square of every island square is lava (the "spurs" on
 * L3, the 2-thick lagoons from L4 on), EXCEPT the ones the level means to
 * leave open — and those are the puzzle.
 *
 * ── CONSTANT SIGNATURE — THE ATOLL ─────────────────────────────────────────
 * Every level draws the same three things and no other run has them:
 *   1. THE ISLAND — one to five squares of ground with the king on it.
 *   2. THE LAGOON — lava all the way round. No door on any level after L2.
 *      No rook line, no queen ray and (where the level says so) no knight jump
 *      reaches the island.
 *   3. THE BEACH — the one square two steps from him along his rank that is
 *      open ground. It is where he lands. What stands beside it is the level.
 * Escalation inside the theme (the terrain experiment): L1 a 1-thick ring with
 * a ford · L2 a sandbar with one gap · L3 a 1-square islet whose ring grows
 * SPURS · L4 a 2-thick block with one jetty · L5 a sandbar hard in the corner
 * · L6 a DIAGONAL two-square island with two jetties · L7 an off-centre corner
 * atoll with a stone on it and a notch in the reef · L8 TWO islands in one
 * lagoon · L9 open ocean with a one-file causeway and two diagonal pockets
 * only a summon can stand in · L10 the island inside a fixed-stone cloister.
 *
 * ── PER-CARD KEY / TRAP MAP ────────────────────────────────────────────────
 *   L1  none        the ring has a ford; he stands still.
 *   L2  none        a sandbar, one gap, on his own rank.
 *   L3  CASTLE KEY  a beach with no flee squares. He comes out and stands.
 *   L4  DRAGON KEY  no beach (2-thick). One jetty a knight's move from him.
 *   L5  CASTLE KEY  the chess landing: over lava AND a pawn, onto his sandbar.
 *   L6  DRAGON KEY  two island squares; one jetty forks both, one is a decoy.
 *   L7-L10 the pair. SWAP and BOULDER are TRAPS on every level as singles:
 *       nothing either does reaches an island. (BOULDER is an honest second
 *       partner for Castle on L7/L10 — a stone on the flee square — measured
 *       below. SWAP pairs with nothing here.)
 *
 * ── THE FOUR FINALE LINES ──────────────────────────────────────────────────
 *   L7  THE NOTCH. King a6 on a corner atoll a6-b6-c6 / a7-c7, b7 stone.
 *       Beach c6, flee square c7. The reef has ONE notch, e6, a knight's move
 *       from c7. Two knights (f8, g4) watch the casting rank.
 *       Either order works, and that is the lesson:
 *         a) Rf6 · Dragon e6 (watches c7) + Castle, K c6 / R b6 · he stands ·
 *            Rxc6.
 *         b) Castle from e6-h6, K c6 / R b6 · he runs to c7 · Dragon on c6,
 *            Dxc7.
 *       DECISION: none yet — learn that the pair is two beats.
 *   L8  TWO ISLANDS. King a5 on a 1-square islet; the beach is its own island
 *       (c5-d5-c6) and the lagoon is sealed against every knight jump, so the
 *       dragon cannot go first — there is nowhere for it to watch from.
 *       Knights g7 and g3 both hit f5 and h5: g5 is the one quiet casting
 *       square. Rg5 · Castle, K c5 / R d5 (short landing, she is marooned with
 *       him) · he runs to c6 · Dragon on c5, Dxc6.
 *       DECISION: hold the dragon; find the quiet square.
 *   L9  THE GARRISON. King a7; a pawn stands ON the beach (c7, pinned by
 *       lava), so the castle is refused. Open ocean: her only road is the
 *       g-file causeway to the casting rock f7. e8 and e6 are pockets touching
 *       f7 only diagonally — she can never stand there, a summon can.
 *       Rg7 · Rf7 · Dragon e8, Dxc7 · dragon steps off the beach (or burns
 *       out) · Castle, K c7 / R d7, no flee square · Rxc7.
 *       DECISION: the dragon goes first, clears the beach, and gets OFF it.
 *   L10 THE CLOISTER. The L7 island inside a fixed-stone cloister (a-file,
 *       rank 8, rank 2), king b5, beach d5, flee square d6, notch f5. Three
 *       knights (h8, h6, h3), THREE enemy moves a turn, seven moves. Both L7
 *       lines exist; what is new is that castling is also how she gets away
 *       from the knights, and the cloister leaves her only the g/h files.
 *       DECISION: tempo — when to leave the shore.
 *   What L8-L10 add that L7 does not cover: L8 forbids dragon-first, L9
 *   forbids castle-first, L10 puts both lines under a clock with hunters.
 *   HONEST NOTE: L10 re-uses L7's two lines; it is a pressure level, not a
 *   fourth use of the pair. See DEAD ENDS for why a fourth would not measure.
 *
 * ── MEASURED — 2026-09-19, difficulty=normal, `revenge.ts matrix` ──────────
 * Numbers of record: 32 trials, `--jobs=2`, T1 cards, the run's own kit.
 *
 *   L    none  castle  dragon  swap  boulder | castle+dragon
 *   7      0%     0%     0%     0%    0%    |      94%
 *   8      0%     0%     0%     0%    0%    |      75%
 *   9      0%     0%     0%     0%    0%    |      75%
 *  10      0%     0%     0%     0%    0%     |      81%
 *
 * The gate is clean on the singles. The pair means 81%: L8/L9 in
 * the band, L10 one point over, L7 at 94% and shipped there as the teaching
 * level (two knights, two enemy moves and clocks of 5, 6 and 7 all read
 * 94-100% — both lines are four moves and the bot does not miss them).
 * Other pairs, for honesty (32 trials, L7/L8/L9/L10): castle+swap 0/0/0/0 ·
 * boulder+castle 0/0/0/0 BY THE BOT — and that zero is the harness, not the
 * level. Boulder drops anywhere, so by hand a stone on the flee square and
 * then a castle wins L7 (c7), L8 (c6) and L10 (d6); the bot only enumerates
 * boulder squares beside the king or beside her and never tries it. L9 is the
 * trap: a T2 boulder crushes the garrison pawn and leaves a STONE on the
 * beach, which refuses the castle for good. So the kit has a second, weaker
 * partner on three finales. I kept it (the spec names a stone on the flee
 * square as a legitimate second half, and Boulder is a favourite); swap it
 * for an inert filler if a single answer matters more.
 *
 * FULL RUNS, 40 runs, T5: random picks from the kit 0/40 (L3 48% -> L4 16%:
 * each mid level is a wall for a player who does not hold THAT card);
 * `--pool=castle,dragon` 3/40 (L4 48%, L6 74%, L7 93%, L8 54%, L9 71%,
 * L10 60%). The pool number is low because offers keep upgrading Castle (80
 * castle picks to 26 dragon — Dragon is capped at T1 and cannot absorb any),
 * so half the runs reach L4 without a dragon. Same shape as The Comb's 0%/5%.
 *
 * TIER LADDER, L7-L10, 32 trials:
 *   castle  T2 0/0/0/0   T3 0/0/0/0   T4 100/56/0/100
 *   dragon  T2 0/0/0/0   T3 0/0/0/0   T5 0/0/0/0   (bot)
 * `abilityTierCaps: { castle: 3, dragon: 1 }`.
 *   CASTLE breaks at T4, the tier where he ARRIVES STUNNED: a stunned king
 * cannot use the flee square, so the card solos every beach that is legal
 * (L9 stays 0 — the garrison pawn refuses the cast at any tier).
 *   DRAGON is capped on the SOLVER, not the bot, and I want that said plainly.
 * The bot reads 0% at every tier, but `revenge.ts solve` proves dragon:2 alone
 * is a FORCED WIN IN 5 on L7 and L10 (dragon:1 is not): jump the notch onto
 * the flee square, he steps to his hideout, slide to the beach square — which
 * attacks the hideout by knight and both other island squares by ray — and
 * take him on the third dragon turn. T1 has two turns; T2 has three. A human
 * finds that line; the bot's rollouts do not. Any island whose beach is open
 * ground has this hole (the beach is adjacent to her landing square, so it can
 * never be stoned), so the cap is a property of the theme.
 *
 * MID-RUN, 16 trials:
 *   L    none  castle  dragon  swap
 *   1    100%   100%    100%   100%
 *   2    100%   100%    100%   100%
 *   3      0%   100%      0%     0%
 *   4      0%     0%     91%      0%
 *   5      0%   100%      0%     0%
 *   6      0%     0%    100%     0%
 *
 * ── DEAD ENDS ──────────────────────────────────────────────────────────────
 * 1. THE BOT WILL NOT WALK TO A CASTLING SQUARE THAT IS NOT YET LEGAL.
 *    `levelFirstSetupBonus` pays +14 for a square a castle can be cast from.
 *    On L9 no castle is legal until the pawn is dead, so nothing pulls her to
 *    the rank, and `fastScore`'s (8 - chebyshev) term parks her on whichever
 *    shore square is nearest the king and shuffles (five builds read 0%).
 *    The fix was the Oubliette rule taken to its end: drown the board. With
 *    one causeway and one casting rock the same level read 100%, then 75% at
 *    seven moves.
 * 2. "THE SHEEPDOG" (dragon herds him to a second island square whose rank
 *    has a beach, THEN castle) is a real fourth use and I could not make the
 *    bot find it — the herd has no payoff on the turn it is played. Same for
 *    "burn the sentry watching her landing square": rollouts rank Castle top
 *    (+20 line, +25 attack) and cast it into the sentry every time, so every
 *    rollout loses and the spawn never looks better than a shuffle.
 *    Both are better levels for a human than L10 is. They are unmeasurable.
 * 3. CAPTURE-STUN MAKES ANY GUARD NEAR HIM A DRAGON KEY. A guard the dragon
 *    can take from a square that attacks the king is a solo: the capture
 *    stuns him, the dragon takes him next turn. Every guard in this run
 *    stands where a dragon on its square attacks nothing (L9's c7 is cut off
 *    from a7 by lava on b7 and is no knight's move from it).
 * 4. SHORE KNIGHTS ARE A CLIFF, NOT A DIAL. On L10 a knight starting on the
 *    g-file reads 19-41%, the same knight on the h-file 84-97% — they park on
 *    the notch or lock the two-file doorway and the bot will not step into
 *    a guarded square. The shipped trio (h8/h6/h3) is the only layout tried
 *    that landed near the band; seven moves reads 81-84%, six reads 31%.
 */
import { FLEE, LAVA, STILL, make, type LevelBuilder, type RunDef } from '../run-kit';
import type { EnemyPiece, Hazard } from '../types';

/**
 * THE CHART. A level is drawn as eight strings, rank 8 first, files a-h left
 * to right — the silhouette in the source IS the silhouette on the board.
 *   .  open ground        ~  lava            #  fixed stone (cloister wall)
 *   K  the king           p n b q  his men
 */
function chart(
  level: number,
  rows: string[],
  opts: { still?: boolean; moveLimit: number; pen: string[]; enemiesPerTurn?: number },
): LevelBuilder {
  if (rows.length !== 8 || rows.some((r) => r.length !== 8)) {
    throw new Error(`revenge-58 L${level}: a chart is 8 rows of 8`);
  }
  const pieces: EnemyPiece[] = [];
  const hazards: Hazard[] = [];
  const types = { K: 'king', p: 'pawn', n: 'knight', b: 'bishop', q: 'queen' } as const;
  rows.forEach((row, i) => {
    const rank = 8 - i;
    [...row].forEach((ch, j) => {
      const file = j + 1;
      if (ch === '~') hazards.push(LAVA(file, rank));
      else if (ch === '#') hazards.push({ file, rank, kind: 'stone', fixed: true });
      else if (ch in types) pieces.push({ type: types[ch as keyof typeof types], color: 'black', file, rank });
      else if (ch !== '.') throw new Error(`revenge-58 L${level}: unknown chart glyph "${ch}"`);
    });
  });
  return make(level, pieces, {
    ...(opts.still ? STILL : FLEE),
    hazards,
    moveLimit: opts.moveLimit,
    kingPen: opts.pen,
    ...(opts.enemiesPerTurn ? { enemiesPerTurn: opts.enemiesPerTurn } : {}),
  });
}

export const RUN_REVENGE_58: RunDef = {
  id: 'revenge-58',
  name: 'The Atoll',
  blurb:
    'A king alone on an island ringed by lava. No guards, no door, nothing crosses. But she is a rook and he is a king, and rules are rules: castle, and HE comes out. He lands on the beach, the turn ends, and he runs — unless something with wings is already watching the sand.',
  allowedAbilities: ['castle', 'dragon', 'swap', 'boulder'],
  // Measured L7-L10, 32 trials (see MEASURED in the header):
  //   castle  T2 0/0/0/0   T3 0/0/0/0   T4 100/56/0/100  -> cap 3 (T4 = he
  //           arrives stunned, so the flee square is dead and the card solos).
  //   dragon  bot 0/0/0/0 at T2, T3 and T5, but `revenge.ts solve` proves
  //           dragon:2 ALONE is a forced win in 5 on L7 and L10 (three dragon
  //           turns = jump in, re-aim from the beach, take). dragon:1 is not.
  //           Capped on the proof, not on the bot.
  abilityTierCaps: { castle: 3, dragon: 1 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    chart(1, [
      '........',
      '........',
      '..~~~...',
      '..~K~...',
      '..~.~...',
      '........',
      '........',
      '........',
    ], { still: true, moveLimit: 12, pen: ['d5'] }),
    chart(2, [
      '........',
      '.~~~~~..',
      '.~K.....',
      '.~~~~~..',
      '........',
      '........',
      '........',
      '........',
    ], { moveLimit: 12, pen: ['c6', 'd6', 'e6'] }),
    chart(3, [
      '..~.~...',
      '.~~~~~..',
      '.~~K~...',
      '.~~~~~..',
      '..~.~...',
      '........',
      '........',
      '........',
    ], { moveLimit: 10, pen: ['d6'] }),
    chart(4, [
      '..~~~~~.',
      '..~~~~~.',
      '..~~K~~.',
      '...~~~~.',
      '..~~~~~.',
      '........',
      '........',
      '........',
    ], { moveLimit: 12, pen: ['e6'] }),
    chart(5, [
      '~~~~~~..',
      '~K..~p..',
      '~~~~~~..',
      '~~~~~...',
      '........',
      '........',
      '........',
      '........',
    ], { moveLimit: 10, pen: ['b7', 'c7', 'd7'] }),
    chart(6, [
      '.~~~~~~.',
      '.~~~.~~.',
      '.~~K~~~.',
      '..~~~.~.',
      '.~~~~~~.',
      '........',
      '........',
      '........',
    ], { moveLimit: 10, pen: ['d6', 'e7'] }),
    chart(7, [
      '~~~~~n..',
      '.#.~~...',
      'K..~....',
      '~~~~~...',
      '~~~~..n.',
      '........',
      '........',
      '........',
    ], { moveLimit: 6, pen: ['a6', 'b6', 'c6', 'a7', 'c7'], enemiesPerTurn: 2 }),
    chart(8, [
      '~~~~~...',
      '~~~~~.n.',
      '~~.~~~..',
      'K~..~...',
      '~~~~~~..',
      '~~~~~.n.',
      '........',
      '........',
    ], { moveLimit: 6, pen: ['a5'], enemiesPerTurn: 2 }),
    chart(9, [
      '~~~~.~.~',
      'K~p.~..~',
      '~~~~.~.~',
      '~~~~~~.~',
      '~~~~~~.~',
      '~~~~~~.~',
      '~~~~~~.~',
      '~~~~~~..',
    ], { moveLimit: 7, pen: ['a7'] }),
    chart(10, [
      '######.n',
      '#~~~~~..',
      '#.#.~~.n',
      '#K..~...',
      '#~~~~~..',
      '#~~~~..n',
      '######..',
      '........',
    ], { moveLimit: 7, pen: ['b5', 'c5', 'd5', 'b6', 'd6'], enemiesPerTurn: 3 }),
  ],
};

export default RUN_REVENGE_58;
