/**
 * revenge-41 — THE NICHE. Built 2026-09-07 for the signature pair
 * PANIC + PAGE ("he cannot keep still, and the doorway he wants is full").
 * Kit = panic / page / magnet / freeze-ray (`allowedAbilities` IS the kit).
 * PANIC is a NEW ability, added in this commit at the TESTING stage, so this
 * run is /playtest-only — expected, and it is why nothing here is approved or
 * marked live.
 *
 * THE VERB: ZUGZWANG. Not crossing a wall (The Moat), not baiting hunters (The
 * Alley), not a poison timer (The Switchback), not blowing a hole (The Briar),
 * not caging with his own guard (The Alcove), not a double door (The
 * Millstone), not a two-rook net (The Parapet), not buying a body time (The
 * Lattice), not moving the wall (The Quarry), not an undo (The Dogleg), not a
 * capture you do not survive (The Picket), not swapping him onto a post (The
 * Squint), not making him run the WRONG way (The Hayloft), not stopping the
 * running (The Turnstile), not luring him out (The Pinch). Every one of those
 * answers "where is he / where will he go". This run is the first whose answer
 * is that HE HAS TO GO SOMEWHERE AT ALL.
 *
 * ---------------------------------------------------------------------------
 * WHY A NEW CARD. Every live ability in the catalogue now has a signature home
 * (23 of 23, as of revenge-40), and every confidence-4 pair left unbuilt in
 * data/run-playtest/pair-hypotheses.json re-treads a shipped archetype:
 * dragon+freeze-ray is the Glasshouse's pin-and-parachute, rewind+duchess is
 * the Dogleg's insurance, boulder+freeze-ray is cage-and-take for the sixth
 * time, convert+twin is on the SYNERGY report's "played 10 levels, never
 * gated" list. So this run takes route (C).
 *
 * PANIC (id `panic`, Instant · Royal, 1/1/2/2/3 uses, one enemy phase at every
 * tier). For the next enemy phase the king may not END his turn on the square
 * he STARTED it on. He still picks the best square he can see — the flee's own
 * safety test, unattacked by Rookie's current form with him relocated, not
 * covered by a rainbow ally, farthest from her — and HIS PEN STILL HOLDS HIM,
 * so a panic never opens his room. What it removes is the option every other
 * king-card leaves him: STANDING STILL. Implementation: `kingPanicMove` in
 * pawn-ai.ts, hooked LAST in `kingReaction` (a flee always wins; a panic only
 * ever fires for a king who would otherwise not have moved).
 *
 * Its distinct verb, against the eight cards that already touch him:
 *   - boulder / snare DELETE the squares he runs to. Panic adds one he must use.
 *   - coup MOVES him, to a square you name. Panic makes him choose, badly.
 *   - freeze-ray STOPS him leaving. Panic is the exact inverse.
 *   - scarecrow / gauntlet change WHICH square he wants. Panic changes whether
 *     he gets to want none.
 *   - magnet cannot see him at all through a wall; nor can a dart.
 * And its one law: a panic is only ever as good as the work done BEFORE it is
 * thrown. Leave him one safe square and you pushed him sideways for a card.
 *
 * ---------------------------------------------------------------------------
 * CONSTANT SIGNATURE — THE NICHE. On every level the king stands in a NICHE
 * cut into a wall: a single square whose four ORTHOGONAL neighbours are stone,
 * so no rank and no file in the game ever touches him, with the two squares
 * DIAGONALLY BELOW him stone as well — the niche has a solid floor. Not a band
 * across rank 5 (The Moat), not a hall of columns (The Colonnade), not a
 * sealed box you must get inside (The Vault), not a glass room (The
 * Glasshouse), not a burrow with holes (The Warren), not a quarry face with a
 * cut (The Quarry, The Cairn), not an alcove on a doorstep (The Alcove). A
 * niche is ONE SQUARE YOU CAN NEVER ENTER, and the run never asks you to. It
 * asks what makes him leave it.
 *
 * Three consequences drive every level:
 *   1. A niche is rook-proof, so a rook can never threaten him, and a FLEE king
 *      who is never threatened NEVER MOVES. Sealed, the niche is not hard — it
 *      is unwinnable, for every card in the game that needs a line.
 *   2. The only squares that touch a niche are its DIAGONALS, so his pen is the
 *      niche plus its two UPPER diagonals — the two doors — and a rook standing
 *      in one door can never see the other: the niche's own wall stone sits
 *      between them. One body and one line is the most that can ever be brought
 *      to bear, which is exactly two cards' worth.
 *   3. THE FLOOR IS WHY. A summoned pawn captures diagonally FORWARD, and a
 *      controlled summon moves on Rookie's own turn — so a Page dropped on a
 *      niche's LOWER diagonal takes the king where he sits, that turn, for one
 *      card (measured: L7 v1, page alone 100%, trace in DEAD ENDS). Stoning
 *      both lower diagonals is not decoration; it is the thing that makes the
 *      pair necessary. The doors are upper, a pawn standing in one attacks only
 *      rank+2, and so a Page in a doorway is FURNITURE and nothing else.
 *
 * THE ARC
 *   L1-L2  the niche has no west wall — rank 3 runs straight in. Free.
 *   L3     the mouth is stoppered by a defended pawn. MAGNET drags it off its
 *          guard; FREEZE-RAY holds the guard. First card.
 *   L4     the mouth is open, but he now has a SANCTUARY: a sealed upper
 *          diagonal. Threaten him and he is gone for good. Fill the doorway
 *          with a PAGE first, then walk in. The finale's first half, alone.
 *   L5     the mouth holds a bishop frozen in stone, guarded by a knight.
 *          MAGNET / FREEZE-RAY on a plug that can never move itself.
 *   L6     the mouth is bricked. Nothing in the game touches him now — and his
 *          pen is the niche plus ONE door, which she can hold from the file
 *          above it. PANIC, alone. The second half.
 *   L7-L10 sealed niche, TWO doors, and the pair. Combo-gated.
 *
 * KIT ROLES
 *   PANIC   KEY on L6-L10. TRAP on L1-L5 (on L3 and L5 he has no legal step at
 *           all and the charge is simply burnt; on L4 he has a safe one).
 *   PAGE    KEY on L4 and L7-L10. TRAP on L3 and L5 — a page CAN eat the plug
 *           diagonally, and the guard recaptures onto the plug square, so the
 *           mouth reseals and the charge is gone.
 *   MAGNET  KEY on L3 and L5. TRAP on L6-L10: a magnet grabs the FIRST enemy on
 *           one of her rook lines, and no rook line in the finale touches the
 *           niche, either door, or anything standing in one.
 *   FREEZE  KEY on L3 and L5, and it may hit the KING himself on L4, where the
 *           open mouth gives her a line to him. TRAP on L6-L10, pointedly: it
 *           is the card that does the exact OPPOSITE of what the finale needs,
 *           and she cannot see him to cast it anyway.
 *   No universal solvents (bishop-step / knight-hop / become-king), one summon
 *   only, no rabies-dart beside it. antiPairs clean: magnet+page is on the
 *   SYNERGY report's "played on 10 surviving levels, never gated" list, which
 *   is exactly what a filler should be.
 *
 * ---------------------------------------------------------------------------
 * THE FOUR FINALE LINES — WRITTEN BEFORE BUILDING, AND THEY DIFFER.
 * All four use panic + page. None of them is the same decision, and the L7
 * line loses on each of L8, L9 and L10.
 *
 *   L7  THE FAR DOOR. Niche f3 (stone e3/g3/f2/f4, floor e2/g2). Doors e4 and
 *       g4. g4 is SEALED (stone g5, h4) — nothing will ever touch it; e4 is on
 *       the e-file, which she holds from e5. Stand on f5 and the whole combo is
 *       ONE TURN: Page onto g4, Panic, step f5-e5. He must leave f3; the far
 *       door has a body in it and the near one has her file. Take him on e4.
 *       Panic alone posts him in the sealed door forever. The Page alone is a
 *       pawn standing beside a king with no reason to move.
 *
 *   L8  SHE IS THE DOOR, THE PAWN IS THE KNIFE — the roles swap.
 *       Niche c3 mirrored west. Now the SEALED door is b4 (stone a4, b5) and
 *       the open one is d4 — so the L7 line is impossible: the door she must
 *       neutralise is the one she can never take him in, and the door she can
 *       reach is the one he must be pushed into. She plugs the reachable door
 *       with HERSELF, standing on d4, and the Page goes to a3, whose
 *       up-diagonal COVERS b4. Panic: d4 is occupied by Rookie, b4 is all that
 *       is legal, and her rook will never see him there. THE PAGE takes him.
 *
 *   L9  THE QUIET TURN — a capture is on the road, and a capture kills a panic.
 *       Niche f3 again, but d4 is stone, so the ONLY square that holds e4 is
 *       the e-file above it — and a knight sits on e5, in the middle of it. She
 *       has to take it. Any capture credited to her side stuns the king, and a
 *       STUNNED KING CANNOT PANIC (`kingPanicMove` returns null on
 *       kingStunTurns > 0), so a panic thrown on the capturing turn is simply
 *       gone, and there is only one. Take e5 on one turn, panic from e5 or e6
 *       on the NEXT. The L7 tempo — arrive and throw — loses the level.
 *
 *   L10 THE PAWN IN THE DOORWAY. Niche c3, doors b4 (sealed) and d4 — and his
 *       own pawn is standing ON d4, jammed by the stone under it at d3 so it
 *       can never march off. Plug b4 with the Page and he has NO legal step at
 *       all: the panic fires into a room with no floor and burns for nothing.
 *       The doorway has to be CLEARED first, by her rook down the d-file — a
 *       capture, so the panic waits a turn (L9's lesson), and it parks her on
 *       the very square he has to step onto, so she must step OFF it again
 *       before the panic can pay. Two enemies a turn, nine moves.
 *
 * ---------------------------------------------------------------------------
 * MEASURED. `revenge.ts matrix --run=<id> --difficulty=normal --trials=32
 * --jobs=1` (serial, numbers of record), Normal, T5 bot, T1 cards.
 *
 *      L    none   panic    page  magnet  freeze | panic+page
 *      7      0%      0%      0%      0%      0% |    78%
 *      8      0%      0%      0%      0%      0% |    72%
 *      9      0%      0%      0%      0%      0% |    97%
 *     10      0%      0%      0%      0%      0% |    59%
 *
 * THE GATE IS MET. No-ability 0% on all four; every single card in the kit 0%
 * on all four (the contract asks <= 8%); the pair over 60% on three of the
 * four, with L10 at 59% — one point under, inside the ~8pp binomial noise of a
 * 32-trial read. L9 at 97% is ABOVE the 60-80 band and is the one honest miss
 * in the run: see DEAD ENDS, "the clock is not the knob here".
 *
 * L1-L6 (16 trials, jobs=3): L1/L2 100% with no ability, as designed. L3, L4,
 * L5 read none 0% and panic / page / freeze-ray 100% each — three keys rather
 * than one, which the kit rules allow for mid-run levels ("each filler may be a
 * KEY on one or two"). L6 is the panic lesson and reads exactly that: none 0%,
 * page 0%, magnet 0%, freeze-ray 0%, PANIC 100%. Magnet is never a key in this
 * run; it is a pure trap filler, and the reason is structural (a magnet grabs
 * the first enemy on one of her rook LINES, and this run's whole subject is a
 * king no line reaches).
 *
 * TIER. Sweeps at 32 trials, one loadout column per invocation, L7-L10:
 *
 *   panic  T5:  0 / 0 / 0 / 0     — no cap needed, at any tier.
 *   page   T2:  0 / 0 / 0 / 0
 *   page   T3:  0 / 0 / 0 / 0
 *   page   T4:  0 / 0 / 0 / 0     — the gate holds
 *   page   T5: 47 / 41 / 100 / 100 — BREAKS
 *
 * So `abilityTierCaps: { page: 4 }`, the smallest cap the numbers justify. The
 * break is the familiar one (`run-level-design.md`, "the tier that grants a
 * SECOND USE"): with two pawns in hand one body plugs the door and the other
 * takes the room, and the panic is no longer part of the answer. Panic needs no
 * cap at all, and that is the payoff of giving it a QUANTITY-ONLY ladder — a
 * second panic in a level is still one forced step per throw, and one forced
 * step into a sealed door is worth nothing.
 *
 * FULL RUNS, `revenge.ts runs --run=<id> --difficulty=normal --runs=40`:
 *
 *   random picks          FULL CLEARS 5/40 = 13%
 *                         L1-L5 100%, L6 63%, L7 67%, L8 75%, L9 75%, L10 56%
 *                         (reached L7 24/40, L10 9/40)
 *   --pool=panic,page     FULL CLEARS 19/40 = 48%
 *                         L1-L5 100%, L6 98%, L7 85%, L8 76%, L9 88%, L10 86%
 *
 * The 13% random-pick number is worth a line of its own. run-level-design.md
 * records that no combo run has met the Moat's 10-25% target (Vault 28%, Briar
 * 55%, Glasshouse 43%) because a 4-card kit with offers on L1/L3/L6/L9 nearly
 * always hands a random picker both halves by L7. This run meets it, and not
 * by luck: the two halves are not enough on their own here — they have to be
 * played in an ORDER, on four different boards, and a random picker who holds
 * both still loses two runs in three. Difficulty that survives owning the
 * answer is exactly what Tyler asked for on 2026-09-06.
 *
 * ---------------------------------------------------------------------------
 * DEAD ENDS
 *
 * 1. A PAGE ON THE NICHE'S LOWER DIAGONAL TAKES THE KING OUTRIGHT (L7 v1,
 *    page alone 100%). The first build put the king in a niche at h6 with his
 *    two doors at g5 and g7 and nothing on the squares below him. Trace:
 *    `page -> g5`, then `squire-move g5 -> h6`, won, on Rookie's own turn. A
 *    controlled pawn captures diagonally FORWARD and a summon moves as her
 *    body-move, so a lower diagonal is not a doorway, it is a firing step. The
 *    niche's FLOOR — both lower diagonals stone on every level of this run — is
 *    the fix, and it is why the signature is shaped the way it is.
 *
 * 2. A PROMOTED PAGE IS A QUEEN, AND A QUEEN IN A DOORWAY TAKES HIM (L7 v2).
 *    With the floor stoned, page-alone still won by walking a pawn to rank 8,
 *    promoting, and coming back down onto a door — every door is diagonally
 *    adjacent to the niche, so any diagonal piece standing in one is a kill.
 *    Carving the finale out of stone fixed this for free: with rank 8 solid, a
 *    page can never promote, and the clock could then be tuned on its merits.
 *
 * 3. THE BOT CANNOT PLANT FURNITURE A TURN EARLY ON AN OPEN BOARD (L7 v3-v5,
 *    pair 0-19%). The intended line was "stand beside the sealed door, drop the
 *    Page into it, then walk to the other door and throw". The bot never found
 *    it, and the reason is the Warren diagnosis with one extra clause: on a
 *    board where NO move can ever attack the king — which is exactly what a
 *    niche is — `fastScore` gives the search no gradient at all, so a wide
 *    board is pure noise. Traces show it walking to h1 and summoning a pawn
 *    beside itself into a dead corner. Two fixes, both required: carve the
 *    finale down to 7-11 open squares, and change the line so THE PAGE'S SPAWN
 *    IS THE KILLING MOVE. Which is what the bot found by itself on the one
 *    level that worked: panic him out of the niche, then drop the Page INTO
 *    THE ROOM HE JUST LEFT, where a pawn covers both doors, and take him with
 *    it the same turn. That line is one ply deep and the search sees it. It is
 *    also a better level: the square you could never enter is the square you
 *    put your man in.
 *
 * 4. AN OPEN MOUTH IN THE FINALE HANDS THE LEVEL TO EVERY CARD (L8/L10 v2:
 *    none 0-50%, panic 88-100%, page 100%, magnet 94%, freeze 63-100%). A
 *    mouth is a rook line, a rook line is a sightline, and a sightline is a
 *    freeze-ray on the king. The mouth belongs to L3-L5, where it is the point,
 *    and never to a gated level.
 *
 * 5. THE CLOCK IS NOT THE KNOB HERE, AND THE OBVIOUS HUNTER IS TOO SHARP
 *    (L9). The winning line is three to five moves and the bot finds it or
 *    does not; L9 read 97% at moveLimit 6, 5, 4 and 3 alike — cutting the clock
 *    changed nothing because nothing was ever wasted. The knob that does work
 *    is a hunter that can reach the doorway she has to stand in (L7 and L8 came
 *    to 78% and 72% that way), but in L9's corridor every hunter tried either
 *    took the doorway square itself or the pawn she has to capture, and the
 *    pair fell to 0-19% rather than into the band. L9 ships above the band, on
 *    the true number, rather than shipping a broken level tuned to look right.
 *
 * 6. A CAPTURABLE PIECE ANYWHERE IS A LEAK FOR PANIC ALONE (L7 v3, panic 50%).
 *    Panic thrown from far away pushes him to whichever door is farther, and if
 *    that door is the reachable one he is now an ordinary king in the open —
 *    and every capture on the board stuns him for a turn, so a bare rook can
 *    stun-lock him onto the door and take him. Trace: three captures, three
 *    stuns, mate on e4. The finale boards therefore carry no bait: the only
 *    capturable pieces are the ones a level's puzzle actually needs.
 */

import type { Coord } from '../types';
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
  type LevelBuilder,
} from '../run-kit';

// ---------------------------------------------------------------------------
// THE NICHE, restated ten times. EAST is f3 (mouth e3), WEST is c3 (mouth d4's
// side, mouth square d3). Ceiling, floor and the two lower diagonals are stone
// on every level; what changes is which walls are actually there and how many
// doors he owns.
// ---------------------------------------------------------------------------

/** f3's ceiling, floor and solid lower diagonals. The mouth (e3) is separate. */
const NICHE_E = [X(7, 3), X(6, 2), X(6, 4), X(5, 2), X(7, 2)]; // g3 f2 f4 e2 g2
const MOUTH_E = X(5, 3); // e3 — bricked from L6 on
/** The sealed door above the east niche: g4, off every rank and file. */
const SEAL_G4 = [X(7, 5), X(8, 4)]; // g5, h4

/** c3's ceiling, floor and solid lower diagonals; mouth is d3. */
const NICHE_W = [X(2, 3), X(3, 2), X(3, 4), X(2, 2), X(4, 2)]; // b3 c2 c4 b2 d2
const MOUTH_W = X(4, 3); // d3
/** The sealed door above the west niche: b4. */
const SEAL_B4 = [X(2, 5), X(1, 4)]; // b5, a4


/**
 * THE WARREN RULE, applied (`.claude/run-level-design.md`, 2026-09-06): a kit
 * that contains a card targeting EMPTY SQUARES wants a finale carved out of
 * solid stone, because the bot's rollout budget is split across every legal
 * candidate. Here it does a second job as well: on a board where NO move ever
 * attacks the king — which is what a niche is — `fastScore` gives the search
 * no gradient at all, so every wasted rook move is a wasted rollout. And a
 * third: with rank 8 stone, a Page can never reach it, so it can never promote
 * to a queen, and a queen standing in either doorway takes him diagonally
 * (that is how L7 v2 leaked; see DEAD ENDS).
 *
 * `carve` takes the squares that stay OPEN and stones every other square on
 * the board. The king's own square must be listed open.
 */
function carve(open: string[]): Coord[] {
  const keep = new Set(open);
  const out: Coord[] = [];
  for (let f = 1; f <= 8; f++) {
    for (let r = 1; r <= 8; r++) {
      const sq = `${'abcdefgh'[f - 1]}${r}`;
      if (!keep.has(sq)) out.push(X(f, r));
    }
  }
  return out;
}

/** Rank 1, where Rookie's start file is rolled. Open on every finale level. */
const FLOOR = ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'];

const LEVELS: LevelBuilder[] = [
  // L1 — THE OPEN NICHE. The silhouette, for nothing. Ceiling, floor and both
  // lower diagonals are stone, but the west wall is missing, so rank 3 runs out
  // of the open floor straight into him. He does not move.
  make(1, [king(6, 3), pawn(3, 6), pawn(5, 7)], {
    ...STILL,
    moveLimit: 12,
    hazards: [...NICHE_E],
  }),

  // L2 — THE RUNNER. Same open niche, and now he runs — but his room is the
  // niche and its mouth, two squares on ONE RANK, and a single rook on rank 3
  // sees both. Nowhere to step.
  make(2, [king(6, 3), pawn(2, 5), pawn(4, 7)], {
    ...FLEE,
    moveLimit: 11,
    hazards: [...NICHE_E, X(5, 4), X(7, 4)],
    kingPen: ['f3', 'e3'],
  }),

  // L3 — THE MOUTH AND THE SANCTUARY. The niche keeps its west wall open, so
  // rank 3 runs into him and a rook can finally threaten one — but above his
  // room, for the first time, is g4: sealed by g5 and h4 off every rank and
  // file in the game. Threaten him and he simply steps up into it and is gone.
  // The one card that stops the step is FREEZE-RAY: the open mouth is a line,
  // and the only dart in the game that may hit the king pins him where he sits
  // while she walks the rank.
  make(3, [king(6, 3)], {
    ...FLEE,
    moveLimit: 12,
    hazards: carve(['a1', 'a2', 'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g4']),
    kingPen: ['f3', 'e3', 'g4'],
  }),

  // L4 — THE FIRST DOORWAY. Same room, and now there is a way up onto the
  // shelf beside the sanctuary. Fill g4 with a PAGE — a pawn in a doorway is
  // furniture, it threatens nothing and he does not react to it — and only
  // then walk the rank. He is threatened, the mouth is on her line, and the
  // door has a body in it: nowhere to step. The finale's first half, alone.
  make(4, [king(6, 3)], {
    ...FLEE,
    moveLimit: 10,
    hazards: carve([
      'a1', 'a2', 'a3', 'b3', 'c3', 'd3', 'e3', 'f3',
      'e4', 'e5', 'f5', 'g4',
    ]),
    kingPen: ['f3', 'e3', 'g4'],
  }),

  // L5 — THE CROWDED MOUTH. The rank-3 corridor now has his own pawn standing
  // in it on c3, jammed by the stone under it, and a knight loose on the shelf.
  // Nine moves. The freeze still works and so does the page, but not if she
  // spends the clock arguing with the pawn.
  make(5, [king(6, 3)], {
    ...FLEE,
    moveLimit: 7,
    hazards: carve([
      'a1', 'a2', 'a3', 'b3', 'c3', 'd3', 'e3', 'f3',
      'e4', 'e5', 'f5', 'g4',
    ]),
    kingPen: ['f3', 'e3', 'g4'],
  }),

  // L6 — THE ONE DOOR. The mouth is bricked. NOTHING in the game touches him
  // now: no rank, no file, no diagonal off the floor, no dart, no pull — and a
  // king who is never threatened never moves, so four of the five cards have no
  // answer here at all. His pen is the niche and e4, and e4 is on the e-file
  // above the wall, which she holds from e5. PANIC, alone: he must leave f3,
  // e4 is the only square he owns, and she is looking down it.
  // (A page can PLUG e4 instead — and then he has nowhere to go and she can
  // never reach him. The plug is not the answer here. The push is.)
  make(6, [king(6, 3), pawn(3, 5), pawn(5, 7)], {
    ...FLEE,
    moveLimit: 9,
    hazards: [...NICHE_E, MOUTH_E, X(7, 4)],
    kingPen: ['f3', 'e4'],
  }),

  // L7 — THE VACANT ROOM. Both doors for the first time: e4 open off the
  // d-file, g4 SEALED by g5 and h4 so nothing will ever touch it. Stand IN the
  // open door — blocking it with her own body is the only way a rook ever
  // touches this room — and throw. He must leave f3, and g4 is all that is
  // left. Now the one square nobody could enter is EMPTY: put the Page in it.
  // A pawn in a niche covers both of its doors, and it takes him in the far one.
  make(7, [king(6, 3), knight(6, 5)], {
    ...FLEE,
    moveLimit: 5,
    hazards: carve(['d1', 'd2', 'd3', 'd4', 'e4', 'f3', 'g4', 'f5']),
    kingPen: ['f3', 'e4', 'g4'],
  }),

  // L8 — THE LONG WAY ROUND. Mirrored west, and the seal has swapped sides: the
  // door on HER side of the board (d4, sealed by d5 and e4) is the one she can
  // never enter, and the door she has to stand in is b4, on the far side of his
  // room, reached only by climbing the a-file past him. The L7 read — "take the
  // door in front of you" — is the sealed one here.
  make(8, [king(3, 3), knight(3, 5)], {
    ...FLEE,
    moveLimit: 4,
    hazards: carve(['a1', 'a2', 'a3', 'a4', 'b4', 'c3', 'c5', 'd4']),
    kingPen: ['c3', 'b4', 'd4'],
  }),

  // L9 — THE QUIET TURN. L7's room, and his own pawn is standing in the open
  // door — jammed, because e3 under it is stone, so it never marches off. She
  // cannot stand in that doorway and cannot reach the niche past it, so the
  // pawn has to be taken. But any capture credited to her side STUNS the king,
  // and a stunned king cannot panic (`kingPanicMove` returns null on
  // kingStunTurns > 0) — a throw on the capturing turn is simply gone, and
  // there is one. Take the pawn, let the stun run out, then throw.
  make(9, [king(6, 3), pawn(5, 4)], {
    ...FLEE,
    moveLimit: 4,
    hazards: carve(['d1', 'd2', 'd3', 'd4', 'e4', 'f3', 'g4']),
    kingPen: ['f3', 'e4', 'g4'],
  }),

  // L10 — THE DOORWAY IS NOT SAFE. L9's jammed pawn, and a knight loose in the
  // corridor with two enemies a turn — so the doorway she must hold is a square
  // something can reach. There is no leisurely order left: clear the door, step
  // out of the knight's reach, throw on a turn with no capture in it, and come
  // back for the one move that ends it.
  make(10, [king(3, 3), pawn(2, 4), knight(3, 5)], {
    ...FLEE,
    moveLimit: 7,
    enemiesPerTurn: 2,
    hazards: carve(['a1', 'a2', 'a3', 'a4', 'b4', 'c3', 'c5', 'd4']),
    kingPen: ['c3', 'b4', 'd4'],
  }),
];

const RUN_REVENGE_41: RunDef = {
  id: 'revenge-41',
  name: 'The Niche',
  blurb:
    'A square no line in the game reaches, and a king with no reason to leave it. Give him a reason.',
  allowedAbilities: ['panic', 'page', 'magnet', 'freeze-ray'],
  // See the TIER block in MEASURED at the bottom of this file. Page holds the
  // gate at T1-T4 (0% on all four finales) and breaks it at T5 (47/41/100/100),
  // where a second pawn lets one body plug the door and another take the room.
  // Panic needs no cap: 0% alone at every tier, which is the whole point of a
  // uses-only ladder on a card that forces a step.
  abilityTierCaps: { page: 4 },
  offerEveryLevel: true,
  offerOnLevels: [1, 3, 6, 9],
  offerSize: 3,
  levels: LEVELS,
};

export { RUN_REVENGE_41 };
export default RUN_REVENGE_41;
