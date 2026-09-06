# Ability pairs — what makes a combo, and which ones to test

Written 2026-09-05 by reading the code (`lib/run/abilities.ts`, `pawn-ai.ts`,
`engine.ts`, `movement.ts`), not the card text. The machine-readable ranking
lives in `data/run-playtest/pair-hypotheses.json` — the combo harness reads
`pairs` in order and can skip `antiPairs`.

23 abilities are built (pipeline stage testing / approved / live), so there
are 253 possible pairs. This file lists the 50 worth measuring first.

---

## Two facts that make combos possible at all

**1. Almost everything is a free action.** Summoning a body, Swap, Sacrifice,
Boulder, all three darts, Convert, Magnet, Smoke, Rewind, Aegis and the
transforms all resolve WITHOUT ending the turn. Only two things end a turn:
Rookie moving, and a summon moving (below T5). So the scarce resource in this
game is not casts — it is **body-moves**. A pair is strong when it turns free
casts into a capture, a stun, or a relocation that would otherwise have cost
Rookie her move. Vanguard + Sacrifice, for instance, summons a knight inside
the guard cluster AND detonates it before Rookie has moved at all.

**2. The king only survives because he has somewhere to step.** He flees only
from Rookie's *current form*, from controllable summons, and (on nightmare)
from ally cover. He never leaves his pen, never steps on a hazard, and never
steps onto a covered square. And **any capture credited to Rookie's side
stuns him for a turn** — her move, a summon's move, a Boulder crushing a pawn,
a poison death, friendly fire on a Decoy, a Sacrifice blast. Most of the good
pairs are "remove his squares" plus "arrive", or "get a free capture" plus
"be on his line when it lands".

The counterweight, and the source of most anti-pairs: **Rookie's own allies
and her own boulders block her rays exactly like enemies do.**

---

## The archetypes

**Body-then-become.** Create a body on a square Rookie cannot reach, then
become it. This is the one Tyler named: Bishop Squire crosses a colonnade on
a diagonal, Swap makes his square hers with her turn intact. The general shape
is delivery vehicle + payload transfer, and it is the best-covered archetype
in the game because Swap works on every summon. The strongest version is
**Vanguard + Swap**, because a Vanguard drop ignores board geometry entirely
(any free square within 2-5, no path required) — that pair teleports Rookie
through any wall. **Convert + Swap** is the same trick at unlimited range once
Swap is T4+, since T4 Swap accepts any rainbow ally: turn a guard deep in the
pen into a body, then wear it.

**Parachute the bomb.** Both halves are free actions, so a summon can appear
inside the enemy cluster and explode in the same turn. Convert + Sacrifice is
the deep-strike version (legal since 2026-09-06, when converted pieces became
controlled summons): steal a guard standing in the court, detonate it there. The blast shape is the
summon's attack set: knight = eight squares no line covers (perfect against a
pawn shell), rook = a whole rank and file, Dragon = queen rays plus knight
squares, the biggest in the game. Every version also stuns the king 2-3 turns.

**Cage and take.** Delete his flight squares, then threaten him with a form he
cannot outrun. Boulder is the purest tool (permanent, any square on the board,
free), and it pairs best with **Knight Hop** — the knight is the one form that
jumps its own walls, so she can brick the pen shut without sealing herself in.
Convert is the quiet version: a converted pen pawn is a body inside his room
whose covered squares he refuses to enter — and since 2026-09-06 it is a
CONTROLLED body (see below), so it can also step, capture and take him
itself, like a Squire that spawned deep. One brake: **a stolen piece is DAZED
for the turn it is stolen** — it cannot move or capture until your next turn
(Tyler: otherwise "you can just capture the king on the first move"). Its
cover still cuts off his flight on the enemy turn, so cage-and-take is the
shape: steal the guard, let him fail to step, strike next turn.

**Free capture-stun.** Get a capture that costs no move so the stun lands on
the exact turn Rookie arrives. Poison Dart is the timer version (its death is
credited to Rookie), Boulder T2+ is the instant version (crushing a pawn is a
capture), Decoy is the friendly-fire version.

**Blind the court.** Smoke does two things, and the second one is the reason it
combos: enemies cannot see Rookie **and the king does not flee while she is
smoked**. Also, a summon's captures do not break her cover — only her own do.
So Smoke plus any slow body (Duchess, Page, Twin) buys the body a quiet window.
The sharpest version is **Smoke + Rabies**: a rabid piece attacks whatever is
nearest, and Smoke removes Rookie from its target list entirely, so the madness
can only land on its own side.

**New lines for line-tools.** Magnet's pull lines are Rookie's *current form's*
lines. Bishop Step gives it diagonals; Queen Pulse gives it all eight
directions. Knight Hop gives it nothing (knight form falls back to rook lines)
— which is an anti-pair, not a combo.

**Reposition then seal.** Magnet drags the door guard out; Boulder drops a
stone in the square it left so it can never come back.

**Pin and parachute.** Freeze Ray is the only dart that may touch the king
(pins him tier+1 turns), but it cannot reach him. Pair it with a body that can
be delivered inside that window — Vanguard, Duchess.

**Tank the recapture.** Aegis converts a defended key into a takeable one:
capture it anyway, eat the reply, keep the stun.

**Insurance on a one-charge body.** Rewind restores the enemy side to the start
of their last turn — which brings back **an ally they just ate**. That makes it
the only card that gives a spent Dragon, Duchess or Twin charge back.

**Untouchable engineer.** Become King makes Rookie uncapturable but drops her
reach to one square. Pair it with things that work without walking: Boulder
(brick up the pen from inside the guard set), Swap (movement that is not a
walk), Magnet (bring the guards to her).

---

## The anti-pairs, and why

The measured one first: **adding Boulder to bishop-squire + swap on The
Colonnade L10 dropped the win rate from 71% to 33%.** Hazards block Rookie's
own rays. In a pillared hall the free diagonals *are* the plan, so every stone
is as likely to wall the player's crossing as the king's exit. The same failure
applies to Boulder + Twin (stone kills rook lines).

The rest fall into four groups:

- **Convert + Poison Dart (still weak).** Convert wipes status markers, so
  poisoning a piece and then stealing it heals it. (Convert + Sacrifice used to
  sit here as *illegal* — Sacrifice only targets controlled summons and a
  converted piece was an AI ally. Since 2026-09-06 a converted piece IS a
  controlled summon, so "steal something deep, then detonate it" is a legal
  and rather good play; it moved to the pair list.)
- **No body in the kit.** Swap + Sacrifice are both support cards that operate
  on a summon and neither makes one. Together with no summon they are two dead
  charges; with one summon they fight over the same body.
- **Redundant defence.** Become King + Aegis, Become King + Smoke, Aegis +
  Smoke, Aegis + Rewind, Freeze + Smoke, Decoy + Rabies, Bishop Step + Queen
  Pulse (queen strictly contains bishop).
- **Tempo starvation.** Any two summons. You only get one body-move per turn
  below T5, so the second body idles, draws hunters at ally priority, blocks
  Rookie's own rays, and burns a charge that should have been Swap or Sacrifice.

---

## Coverage note for the harness

Every one of the 23 built abilities appears in at least one pair rated 3+.
The thin ones are worth knowing: **Rabies Dart** has exactly one plausible
partner (Smoke) and is an active liability next to any summon; **Squire**,
**Bishop Squire**, **Dragon**, **Convert**, **Bishop Step**, **Poison Dart**,
**Twin** and **Decoy** have three or fewer. The connectors — the abilities that
make other abilities better — are **Swap, Boulder, Magnet, Smoke and
Sacrifice**. If the game is going to be built around discovering pairs, those
five are the sockets everything else plugs into.

---

## 2026-09-06 additions (the five mined from the level library)

**Snare** — pairs: Boulder (two tied exits: stone one, trap the other,
threaten; the stone goes where it never walls her), Knight Hop (hop the wall,
hold one column of the 2x2, snare the other), Magnet (pull an uncapturable
guard onto the trap). Anti-pairs: Freeze Ray (same job, reaches him directly),
Smoke (he never steps while smoked, nothing springs), Twin / Duchess / any
summon whose cover lands on the trapped square (cover deletes it from his
flight set, he steps elsewhere).

**Shove** — pairs: Magnet (pull the door guard out, take it, shove the wall
stone into his cell: the gap is her line in), Become King (the untouchable
engineer with a different second card), Smoke (open the wall unseen; he does
not step off the line while she is smoked). Anti-pairs: Twin and Bishop
Squire (a moved stone blocks a summon's line as surely as a dropped one),
Boulder (two stone cards, the Stacks' self-block twice), Knight Hop (two
openers is a skeleton-key kit). Terrain runs that want to refuse it mark
stones `fixed: true` in the puzzle def.

**Coup** — pairs: Boulder (swap him onto the post, stone his step back,
slide onto the post's line), Duchess or any body with a line to the post
(Millstone L7 measured: none 0, duchess 0, coup 0, coup+duchess 100), Freeze
Ray (freeze, coup onto a post on her line, take; possibly too strong).
Anti-pairs: Convert (same guard, two answers; a converted guard is no longer
an enemy), Magnet T5 (both "move the king one square"), Rabies Dart (eats the
guard that just became the door), Smoke (a pair, but Coup + Smoke + anything
is a skeleton key; keep apart in kits).
