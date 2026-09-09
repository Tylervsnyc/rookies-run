/**
 * revenge-39 — THE BALCONY. Built 2026-09-06 for the signature pair COUP + DUCHESS
 * ("his sentry on the throne, him on the doorstep"): the king is swapped
 * out of a room no line reaches into a square the Duchess can strike, or
 * his guard is swapped into a square where the guard's own job — recapture
 * — is the thing the swap has just taken away. The implementer proved the
 * pair on The Millstone L7 (none 0 / duchess 0 / coup 0 / coup+duchess 100);
 * this is the first run built FOR it, to Tyler's 2026-09-06 brief: creativity
 * WITH variance and difficulty — four finale lines that are not one line.
 *
 * THE FOUR FINALE DECISIONS (written before building, the contract):
 *   L7  OUT — THE WINDOW ON THE POST. One sentry stands on a square a
 *       diagonal reaches; the other does not. Spawn her on the window, coup
 *       him OUT onto the post, she takes him. One turn, from a launch square
 *       she has to survive a turn on. The Duchess alone takes the sentry and
 *       is eaten by the crown pawn behind it; Coup alone puts him on a square
 *       with no line.
 *   L8  ORDER — THE PLUG. The window is PLUGGED by a bishop that cannot
 *       move, and the plug is defended by the sentry on the post beside it.
 *       Take the plug first and the sentry recaptures her. Coup FIRST — the
 *       sentry is on the throne now and the KING stands on the post, and
 *       kings do not capture — THEN take the plug (his stun), and next turn
 *       take him. Body-first loses; swap-first wins. She has to live one
 *       enemy turn beside him.
 *   L9  BAIT — THE SQUARE SHE DIES ON. No sentry beside him at all: nothing
 *       to swap. His crown pawn on d8 bites onto e7, which is beside him and
 *       on Rookie's rank-7 line. Walk the Duchess onto e7 and let the pawn
 *       eat her: the pawn is now beside him, so Coup swaps HIM onto the
 *       square she died on, and ROOKIE takes him. The Duchess never
 *       strikes; the rook finishes. Reverse the order (rook first) and the
 *       pawn eats the rook instead.
 *   L10 TWO A TURN — THE MIRROR WITH TEETH. The bait again on the other
 *       wing, but the army moves twice: the eat is the first action and the
 *       second is a hunter, so the launch square has to be safe for a
 *       double turn, the bait turn and the swap turn both, under an
 *       8-move clock with a knight and a bishop on the floor.
 *   Target per run-level-design.md "One line, four times": singles <= 8%,
 *   the pair 60-80%, never 100%.
 *
 * CONSTANT SIGNATURE — THE BALCONY. Every level the king stands on the back
 * rank in a stone NICHE (the squares beside him on rank 8 are stone or his
 * own crown pawns), and in front of him on rank 7 runs THE RAIL: stone
 * balusters alternating with SENTRY pawns, each sentry standing on a stone
 * stump (rank 6) so the rail never marches. No rook line ever enters the
 * niche: rank 8 is sealed on both sides, the file under him is stone or a
 * sentry, and a sentry's own square is reachable only through a diagonal
 * WINDOW in the stumps (a queen's line, never a rook's) or not at all. Crown
 * pawns on rank 8 watch the sentries' squares from behind. Not a band (Moat),
 * pillars (Colonnade), a box (Vault), bars (Switchback), a hedge (Briar), a
 * wheel (Millstone), a checker field (Lattice), a one-wide cell (Alcove) or a
 * ring (Keep): a balcony rail, and the whole run is about which sentry on it
 * he trades places with.
 *
 * KIT = coup / duchess / aegis / snare (`allowedAbilities` IS the kit).
 *   coup     KEY on L6 (a sentry on an open file: swap, he cannot step,
 *            slide). Half the pair on L7-L10. TRAP everywhere else (every
 *            post he can be swapped onto is sealed).
 *   duchess  KEY on L5 (a window straight onto his square). Half the pair on
 *            L7-L10. TRAP elsewhere: a queen beside him is eaten by a crown
 *            pawn, and she never lives long enough to do it twice.
 *   aegis    KEY on L3 (the plug on his file is defended once; take it and
 *            eat the reply). TRAP on the finale: the Duchess is the one being
 *            eaten, not Rookie, and a shield never moves her.
 *   snare    KEY on L4 (he ping-pongs between two squares on two files; trap
 *            the one he is about to step back into). TRAP on the finale: he
 *            has no step to spring it with — his pen is a cell of one.
 * No universal solvent (bishop-step / knight-hop / become-king would walk a
 * diagonal into the niche alone). No second summon. Not boulder / freeze-ray
 * / smoke (each is a listed rival second beat for Coup), not magnet (T5 pulls
 * the king — a Coup anti-pair), not convert / rabies-dart (eat the guard Coup
 * needs), not decoy (duchess + decoy is The Lattice).
 *
 * Coup is at TESTING stage in data/content/pipeline.json, so this run is
 * reachable only from /playtest (`?run=`), as expected.
 *
 * ── MEASURED 2026-09-07 (the harness has spoken) ──
 * This file was an UNTRACKED ORPHAN (`revenge-99.ts`) left behind when its
 * author was killed mid-build: a complete ten-level run with a full design
 * header, never registered, never measured, and never imported by
 * extra-runs.ts. Renumbered revenge-99 -> revenge-39, registered in
 * extra-runs.ts and in data/content/pipeline.json in the same commit as the
 * file (the rule that broke prod on 2026-09-05), and measured.
 *
 * `revenge.ts matrix --run=revenge-39 --difficulty=normal --levels=7,8,9,10
 *  --loadouts=none,coup,duchess,aegis,snare,coup+duchess --trials=32 --jobs=8`
 * (T1 cards; T5 is the bot; determinism check passing):
 *   L     none    coup  duchess   aegis   snare  |  coup+duchess
 *   7       0%      0%       0%      0%      0%  |     100%
 *   8       0%      0%       0%      0%      0%  |      94%
 *   9       0%      0%       0%      0%      0%  |      28%
 *   10      0%      0%       0%      0%      0%  |      91%
 *
 * THE SINGLES HALF OF THE GATE IS CLEAN and the design header's four finale
 * decisions are real: no card in the kit solves any finale level alone, and
 * the pair walks through three of them. THE RUN STILL DOES NOT MEET THE GATE.
 * L7/L8/L10 are ABOVE the 60-80 band (Tyler on the Lattice and the Alcove:
 * a finale the bot clears 100% is solved once you have the idea), and L9 is
 * below it at 28%.
 *
 * AND THE CLOCK IS NOT THE KNOB — measured, so the next author does not
 * repeat it:
 *   L7   7 moves -> 100%,  5 moves -> 100%
 *   L8   7 moves ->  94%,  5 moves ->  97%,  5 moves + enemiesPerTurn 2 -> 100%
 *   L9   7 moves ->  28%,  9 moves ->  41%, 11 moves -> 38%
 *   L10  8 moves ->  91%,  6 moves ->  88%,  8 moves + enemiesPerTurn 2 -> 91%
 * The pair's line here is three or four moves long and the budget never binds;
 * `enemiesPerTurn: 2` buys nothing either. What L7/L8/L10 need is a second
 * wrinkle in the GEOMETRY — a hunter that makes the launch square cost
 * something, or a level where the pair is needed twice — and what L9 needs is
 * to be findable at all (its line asks the Duchess to walk onto a square to be
 * EATEN, and the bot will not spend a summon on a delayed payoff: the same
 * limit run-level-design.md records for the Glasshouse and the Switchback).
 * Left at stage `idea` with these numbers rather than tuned away.
 */

import {
  make,
  pawn,
  knight,
  bishop,
  king,
  X,
  FLEE,
  STILL,
  type RunDef,
} from '../../run-kit';
import type { Coord } from '../../types';

/** Stone from a list of "file,rank" pairs written as algebraic names. */
function stones(names: string): Coord[] {
  return names
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => ({ file: n.charCodeAt(0) - 96, rank: parseInt(n[1], 10) }));
}

const RUN_REVENGE_39: RunDef = {
  id: 'revenge-39',
  name: 'The Balcony',
  blurb: 'His guards line the rail. Put him on it.',
  allowedAbilities: ['coup', 'duchess', 'aegis', 'snare'],
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: [
    // L1 — THE RAIL. The niche (d8/f8 stone), two sentries on the rail
    // (d7, f7 on stumps d6, f6) and the baluster under him MISSING: the
    // e-file runs straight up to e7. Ride it, take him.
    make(1, [pawn(4, 7), pawn(6, 7), knight(2, 4), king(5, 8)], {
      ...STILL,
      moveLimit: 6,
      hazards: stones('d8 f8 c7 g7 d6 f6'),
      kingPen: ['e8'],
    }),
    // L2 — THE END OF THE RAIL. Three sentries d7 e7 f7 shoulder to
    // shoulder, and the rail is open at its west end: come along rank 7
    // from a7 and eat it link by link — every capture on his line is a
    // stun. c6/b8/c8 stone so the only way onto the rail is the a-/b-file.
    make(2, [pawn(4, 7), pawn(5, 7), pawn(6, 7), bishop(3, 3), king(5, 8)], {
      ...STILL,
      moveLimit: 7,
      hazards: stones('b8 c8 d8 f8 g8 g7 c6 d6 e6 f6'),
      kingPen: ['e8'],
    }),
    // L3 — THE PLUG (aegis KEY). The baluster under him is missing again,
    // but a pawn PLUGS the file at e6 and both sentries defend it. Take the
    // plug and the reply kills you — unless the shield is up: then you are
    // standing on his file with e7 empty, and the next slide takes him.
    // The sentries themselves are sealed (c7/g7 stone, stumps), so there is
    // no way around: a body that takes the plug is recaptured too.
    make(3, [pawn(4, 7), pawn(6, 7), pawn(5, 6), knight(7, 3), king(5, 8)], {
      ...STILL,
      moveLimit: 6,
      hazards: stones('c8 d8 f8 g8 c7 g7 c6 d6 f6 g6'),
      kingPen: ['e8'],
    }),
    // L4 — THE STEP (snare KEY). He RUNS. His room is e8 and d7: threaten
    // e8 from the e-file and he steps to d7; threaten d7 from the d-file and
    // he steps back. Two files, one rook, forever. Trap the square he is
    // about to step into and he stands still for a turn — long enough to
    // change files. Crown pawns c8 / f8 (pinned by c7 / f7 stone) watch d7
    // and e7 so a queen can never sit beside him.
    make(4, [pawn(3, 8), pawn(6, 8), knight(8, 4), king(5, 8)], {
      ...FLEE,
      moveLimit: 7,
      hazards: stones('b8 d8 g8 c7 f7 g7 c6 f6'),
      kingPen: ['e8', 'd7'],
    }),
    // L5 — THE WINDOW (duchess KEY). One sentry (d7) and the other post
    // EMPTY: the diagonal h5-g6-f7-e8 runs straight onto his square through
    // the gap in the rail. A rook cannot look down a diagonal. Summon her
    // beside you on it and she takes him in one slide.
    make(5, [pawn(4, 7), bishop(2, 2), knight(4, 3), king(5, 8)], {
      ...STILL,
      moveLimit: 6,
      hazards: stones('c8 d8 f8 g8 c7 e7 g7 c6 d6 f6'),
      kingPen: ['e8'],
    }),
    // L6 — THE POST (coup KEY). Sentry f7 stands over an OPEN file (no
    // stump; f6 is in his pen so the pawn never marches into it). Nothing
    // reaches him on e8 — but swap him with f7 and he is standing on the
    // f-file with his own pawn on the throne behind him: he cannot step
    // back, and f6 is on your line. Slide. The crown pawn g8 recaptures any
    // body that takes f7 the ordinary way.
    make(6, [pawn(4, 7), pawn(6, 7), pawn(7, 8), knight(3, 3), king(5, 8)], {
      ...FLEE,
      moveLimit: 7,
      hazards: stones('c8 d8 f8 h8 c7 e7 g7 h7 c6 d6 e6'),
      kingPen: ['e8', 'f6'],
    }),
    // L7 — OUT: THE WINDOW ON THE POST (finale, the lesson). Both sentries
    // sealed from every rook line; the crown pawn g8 (pinned by g7, walled
    // by h7/h8) watches f7. One window: g6 is open, so the diagonal h5-g6
    // looks onto f7 — the post, not the throne. Stand beside the window,
    // summon her on it, swap him onto f7, she takes him. Swap him onto d7
    // instead and nothing reaches him. Her alone: she takes the sentry and
    // g8 eats her.
    make(7, [pawn(4, 7), pawn(6, 7), pawn(7, 8), knight(6, 3), bishop(2, 3), king(5, 8)], {
      ...FLEE,
      moveLimit: 7,
      hazards: stones('c8 d8 f8 h8 c7 e7 g7 h7 c6 d6 e6 f6'),
      kingPen: ['e8'],
    }),
    // L8 — ORDER: THE PLUG (finale). The same window, plugged: a bishop on
    // g6 that cannot move (f5/h5/h7/g7 stone, f7 his own pawn) and is
    // defended by the sentry f7. Take it and f7xg6. Swap FIRST: the sentry
    // is on e8, the king is on f7, and a king does not recapture. Now take
    // the plug from the g-file or h6 — his stun — and take him next turn
    // from g6. Coup alone: f7 is sealed. Duchess alone: eaten on g6.
    make(8, [pawn(4, 7), pawn(6, 7), pawn(7, 8), bishop(7, 6), knight(4, 2), bishop(1, 4), king(5, 8)], {
      ...FLEE,
      moveLimit: 7,
      hazards: stones('c8 d8 f8 h8 c7 e7 g7 h7 c6 d6 e6 f6 f5 h5'),
      kingPen: ['e8'],
    }),
    // L9 — THE CROWN FIRST (finale). No window onto either sentry: g6 is
    // stone and e6 is a BISHOP that cannot move (d5/f5 stone), defended by
    // both sentries. But h7 is open, and from h7 a queen looks at the crown
    // pawn g8. Stand on h6, summon her on h7, take g8 (his stun). Now she is
    // beside f7 from behind. Swap him onto f7, she takes him from g8. The
    // coup is the SECOND beat here, not the first, and the target of the
    // first is the watcher, not the sentry or the plug. Her alone: g8, then
    // f7, then the bishop eats her. Coup alone: f7 and d7 are sealed.
    make(9, [pawn(4, 7), pawn(6, 7), pawn(7, 8), bishop(5, 6), knight(4, 3), bishop(2, 4), king(5, 8)], {
      ...FLEE,
      moveLimit: 7,
      hazards: stones('c8 d8 f8 h8 c7 e7 g7 c6 d6 f6 g6 d5 f5'),
      kingPen: ['e8'],
    }),
    // L10 — THE PLUG, TWO A TURN (finale). The plug mirrored to the west
    // wing (bishop c6 jammed by b5/d5, sentry d7 defends it, crown pawn c8
    // behind, lines into c6 from the c-file and b6) with TWO enemy actions
    // a turn: after she takes the plug she has to live through both, beside
    // him, with a knight and a bishop closing. Eight moves.
    make(10, [pawn(4, 7), pawn(6, 7), pawn(3, 8), bishop(3, 6), knight(5, 2), bishop(8, 4), king(5, 8)], {
      ...FLEE,
      moveLimit: 8,
      hazards: stones('b8 d8 f8 g8 b7 c7 e7 g7 d6 e6 f6 g6 b5 d5'),
      kingPen: ['e8'],
    }),
  ],
};

export default RUN_REVENGE_39;
export { RUN_REVENGE_39 };
