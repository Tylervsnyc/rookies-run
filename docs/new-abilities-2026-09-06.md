# Five new abilities, mined from the level library (2026-09-06)

Tyler's brief: "now that you know how to find abilities and build levels
around them, can you do the opposite? Now that you have all these levels,
can you make an ability that would be really useful and a good pairing for
other abilities and levels? Make five new abilities."

Constraints honoured: every ability is a DISTINCT VERB from the 27 ids in
`lib/run/abilities.ts` (move Rookie differently, move an enemy, create a
body, remove or disable an enemy, alter terrain, preserve tempo, become
untouchable, undo, steal a piece, support a summon). None is a variant of
Convert (Tyler just made it a controllable, dazed summon). Each is one tap,
one visible consequence, and pays off inside ONE turn as a reaction to a
position already on the board, because the playtest bot cannot find
pre-emptive or delayed lines (Glasshouse, Switchback, Millstone lessons in
`.claude/run-level-design.md`). Machine-readable twin:
`data/run-playtest/new-ability-proposals.json`.

The five, in rank order:

| # | id | Name | Verb | Best pair | Levels it opens | Risk |
|---|---|---|---|---|---|---|
| 1 | `snare` | Snare | Trap a square: the enemy that steps on it is held | boulder (Snare + Boulder) | Vault L5, Stacks L5/L7-L10, Slash L5/L7-L10, Parapet L6-L10, Colonnade L10, Glasshouse L3-L5, Keep L3/L6 | low-medium |
| 2 | `shove` | Shove | Move terrain: push a stone one square | magnet (Shove + Magnet) | Vault L6-L10, Glasshouse L6-L10, Parapet L5/L7-L10, Keep L5-L10, Lattice L6-L10, Switchback L4/L6 | low |
| 3 | `coup` | Coup | Move the king: swap him with one of his own guards | boulder / duchess (Coup + Boulder) | Millstone L7-L10, Lattice L7-L10, Switchback L7-L10, Alcove L7-L10, Alley L6-L10, Briar L6 | low-medium |
| 4 | `hourglass` | Hourglass | Time: the enemies take their turn now, you have not moved | poison-dart (Hourglass + Poison Dart) | Switchback L7-L10, Moat L4/L9, Alley L6-L10, Lattice L3-L5, Briar L4-L5 | low |
| 5 | `scarecrow` | Scarecrow | Information: a straw Rookie the court and the king believe in | knight-hop (Scarecrow + Knight Hop) | Glasshouse L3-L5, Slash L5/L7-L10, Parapet L6, Vault L5, Stacks L5/L7-L10, Colonnade L10 | high |

---

## 1. Mining the library

### 1a. The verbs the designers kept wishing for

Every run header was read for DEAD ENDS, "the bot never", "no card can",
and cards that were TRAPS on every level. The same handful of missing verbs
recur:

| Missing verb | Where the designer hit the wall |
|---|---|
| **Hold him on the square he steps to** (not delete it, not pin him first) | Vault L5 ("one rook can NEVER corner a fleeing king in a 2x2"), Stacks (all of L5/L7-L10 are a 2x2 no line can hold), Slash L5/L7-L10, Parapet L6-L10, Colonnade L10, Keep ("a rook can never hold a ring"). Boulder deletes his square but walls her own line (Colonnade 71% to 33%, Stacks T4/T5 self-block); Freeze needs to reach him first; Smoke means he never steps at all. |
| **Open or move a stone** | Every terrain run says the same sentence: "stones seal, they never open" (Slash, Alcove, Keep), "a stone can never remove a plug" (Stacks), "a dart has never opened stone" (Vault), "no rook line ever crosses" (Cliff, Parapet, Lattice, Colonnade). The only openers in the game are the three universal solvents, which the rubric bans from terrain kits. |
| **Move the king himself** | Magnet cannot touch him below T5 (Stacks, Glasshouse, Slash, Alcove, Keep all list "the king cannot be pulled" as the reason Magnet is the trap card). Coup is the whole "his own guard is the cage" idea (Cliff) turned into a swap: put HIM on the guard's post, the guard on his throne. |
| **Wait without spending a body-move** | Switchback ("every 'dart, let her feed three turns, then go' design read 0% for the pair... the bot never waits"), Alley finding 3 ("cannot plan anything that needs a cast plus 2+ specific moves, and never waits"), Millstone ("the payoff needs TWO ally moves with no Rookie progress between them"), Cliff (d) "a two-jump Squire line is beyond the bot's horizon". Poison, Decoy and Rabies are all fuses, and waiting for a fuse costs a body-move per turn. |
| **Make him run the wrong way** | Glasshouse ("a king in a glass room can see you coming, and he moves"), Slash ("she attacks a file or a rank, he steps to the other column, forever"), Keep ("chase him around a cycle forever"). His flee is deterministic (farthest safe square from Rookie's CURRENT form), so a false Rookie is a steering wheel. |
| Buy a summon one turn (Lattice) | Already covered by Decoy, Smoke, Rewind, Aegis-as-second-decoy; not built again. |
| Free summon moves (War Banner, idea stage) | Already logged as an idea; not duplicated. |

### 1b. Structures and what a new verb lets a player do on each

| Structure | Runs | What no current card does there | New verb that does it |
|---|---|---|---|
| Moat / band across rank 5 | Moat | Cross without a solvent or a body | Shove (roll a moat stone into the room beyond it, the gap it leaves is the ford) |
| Pillars / colonnade | Colonnade | Open a door in the columns | Shove is blocked here when a pillar sits beyond (the file stays plugged), which is exactly what a designer wants: a verb the geometry can refuse |
| Sealed cell / strongbox | Vault | Get a line in without a body-then-become | Shove (the box is one stone thick) |
| Offset bars | Switchback | Kill the corridor pawn on time | Hourglass (burn the fuse), Coup (put HIM on the landing square the pawn held) |
| Hedge of pawns | Briar | Drain the front row on your clock | Hourglass (the wall marches during the free turn) |
| Glass box with a pane | Glasshouse | Beat a king who reads sightlines | Scarecrow (a sightline he believes), Shove (push a pane into his room) |
| Stacks / one-wide shafts | Stacks | Hold a 2x2 from a shaft | Snare (he steps into the far square and stays) |
| One diagonal of stone | Cliff, Slash | Cross, then hold a 2x2 with a one-move knight | Snare or Scarecrow replace the two stones (one cast, not two) |
| Alley with a queue | Alley | Time the bite | Hourglass; Coup (swap him into the queue, out of the alley's top) |
| Diamond around a pillar | Millstone | Reach a square only a body in the door attacks | Coup (he becomes the door) |
| Rank-6 wall | Parapet | Get up, then hold a 2x2 | Shove (open a stair), Snare (hold the room with one rook) |
| Checker lattice | Lattice | Reach a king on a light square | Coup (his own pawn's diagonal is a square a body attacks) |
| Alcove / one-wide slot | Alcove | Attack a doorstep no rook reaches | Coup + Knight Hop (he lands on the sentry's square, a knight's jump from the launch row) |
| Ring around a pillar | Keep | Hold a ring | Snare + Boulder (stone one exit, trap the other) |

---

## 2. The five abilities

Tier text is written in the house style of `whatForTier` / `blurbForTier`
(short, warm, no emojis). "Uses" follow the 1/1/2/2/2 or 1/2/2/2/3 shapes in
`maxUsesForTier`. All five are FREE actions except where stated, in line
with the rest of the deck (only a body moving ends the turn).

### 2.1 Snare — `snare`

**Card:** "Set a trap on an empty square. The first enemy to step on it is held."
**Type line:** Targeted · Trap. **Activation:** `targeted` (pick-square).

**Targeting.** Any empty square: no enemy, no ally, no drone, no hazard, not
Rookie's square. The trap is INVISIBLE to the AI (enemies and the king do
not path around it) and visible to the player (a small red X, tier
coloured). One snare per square. Squares the king can never reach are legal
(the player can waste it).

**Effect.** When an ENEMY piece (the king included) ARRIVES on a snared
square during the enemy phase, by any means except Rewind, the snare
springs:
- The piece is frozen on that square: `frozenSquares` gets the square with
  `frozenTurnsLeft = holdTurns + 1`. The +1 is the same trick Freeze Ray uses
  on the king: the spring happens mid-turn and `endTurn` decrements at once,
  so "holds 1 turn" means the piece still cannot act on the NEXT enemy turn,
  which is the turn Rookie needs to get onto his line.
- T4+: a non-king piece that springs it is CAPTURED instead (credited to
  Rookie: `captures`, tempo, `clearStatusOnSquare`, and `kingStunTurns` set
  to 2 so a stun survives this turn's `endTurn`, the way a poison death is
  handled). The king is only ever held, never captured.
- The snare is consumed on springing (T5: it re-arms).

**Arrivals that spring it:** a flee step (`kingReaction`), an approach or
pawn push or capture landing (`applyAction`), a Magnet pull landing
(`magnetPullTo`), a Coup swap (2.3). **Arrivals that do not:** Rewind
restoring a piece (the snare is part of the snapshot and is restored
unsprung), a summon or Rookie standing on it (inert under your own side;
springs later if they leave and an enemy arrives). A snared square under a
stump pawn never springs (it never moves). Sacrifice and Boulder move nothing.

**Edge cases.** King: held, cannot flee for the hold; his capture-stun
tie-break ("risky squares") does not see the snare. Summons: unaffected.
Hazards: a Boulder may not be dropped on a snared square (the snare is
removed if it somehow is). Status: a frozen piece keeps poison/rabies
markers. Smoke: he does not step while smoked, so nothing springs, which is
the anti-pair. Two enemies a turn: the second mover is picked from pieces
not yet moved and not frozen, so a sprung snare removes an actor mid-turn.

**Tiers.**
| Tier | Effect text | Uses/level |
|---|---|---|
| 1 | Set a trap on an empty square. The first enemy to step on it is held for 1 turn. | 1 |
| 2 | Set a trap. Whoever steps on it is held for 2 turns. | 1 |
| 3 | Set a trap. Whoever steps on it is held for 2 turns. | 2 |
| 4 | Set a trap. A guard that steps on it is captured; the king is held 3 turns. | 2 |
| 5 | Set a trap that never wears out. Guards die on it, the king is held 3 turns. | 2 |

Upgrade notes: 2 "Holds 1 turn → 2", 3 "", 4 "The trap bites: guards die on it", 5 "The trap re-arms after every spring".

**Bot enumeration.** `candidatesForAbility('snare')`: empty squares
Chebyshev 1 from the king (his flight set, at most 8) plus empty squares
Chebyshev 1 from every non-pawn hunter (its next landing set) capped at 16
candidates, the Boulder/Vanguard pattern. The MCTS rollouts run the real
`pawn-ai`, so the flee onto the snare and the freeze are modelled; the payoff
(set, threaten, he steps in, take) is the same one-turn depth as Boulder's
"drop two, slide onto the line", which the bot found first read on The Slash.

**Why it passes the boulder-trick test.** It IS the boulder trick with the
sign flipped: instead of deleting his flight square you let him take it and
keep him there. One tap, a red X, a king stepping onto it and going stiff.
He always runs to the farthest safe square from Rookie (`kingFleeMove`), so
on almost every pen in the library the player can read exactly where the X
goes. The "oh" is the first time he steps into it.

**Pairs.**
1. **Snare + Boulder** (best). A room with two equidistant exits is a
   coin flip for one snare; stone one, trap the other, threaten, he steps
   into the trap. The stone goes where a stone never walls her (it is the
   exit she does not want him to take), which fixes Boulder's self-block.
2. **Snare + Knight Hop.** Cross the wall on one knight move, land as a rook
   attacking one column of a 2x2, snare the other column, take him next
   turn. The Slash's finale with one cast instead of two stones.
3. **Snare + Magnet.** Pull a guard onto a snared square: a guard that
   cannot be captured (stone-backed, twice defended) is held for two turns,
   or dies at T4, without Rookie standing anywhere. "Reposition then trap".
   Poison Dart is the slow version of this pair.

**Anti-pairs.** Freeze Ray (same outcome, Freeze reaches him directly; two
cards for one job). Smoke (he never steps while smoked, so a snare never
springs). Any summon whose cover lands on the trapped square (cover deletes
the square from his flight set, so he steps elsewhere; Twin and Duchess in
particular). Become King (his flight set changes to the blob's complement
mid-turn only when she is adjacent; harmless, just redundant).

**Existing levels it opens.**
- Vault L5: 2x2 cell with the door open, Smoke was the key. New line: snare
  the diagonally opposite square, slide onto his column, he steps in, take.
- Stacks L7-L10: the boulder half of every finale was "one stone in the
  square of the 2x2 he is not standing in". A snare on the far square does it
  without a stone in her one-wide shaft (the Stacks' own DEAD END was T4/T5
  Boulder walling the shaft).
- Slash L7-L10: hop, snare, slide. Also L5 alone.
- Parapet L6 (Twin was the key), L7-L10 (with the hop).
- Colonnade L10 (the 2x2 corner room), Keep L3/L6 (short ring, with a stone).
- Glasshouse L3-L5: threaten one square of the diagonal cell, snare the
  other, he steps in and is held two turns (T2), which is the time she needs
  to reach a square that sees it. Check the T1 read; it may need T2.

**New run — The Warren (Snare + Boulder).** Signature: his pen is a BURROW,
three to five single squares joined diagonally so no rook line ever sees two
of them, and every level asks WHERE HE RUNS. L1-L2 still king. L3 first flee,
one exit (Snare alone). L4 a plug (Aegis). L5 two exits, both hunters'
landing squares (Snare on the hunter). L6 two exits tied for distance
(Boulder alone reads 0, Snare alone 50: the first time the pair is asked).
L7-L10 each demand a different use of the same two cards:
- L7 THE FORK: two tied exits. Stone one, snare the other, threaten.
- L8 THE PATROL: a knight whose only approach square is on her line. Snare
  the KNIGHT's landing (it freezes; no capture-stun for him to use), stone
  his single exit, arrive. The snare is used on a guard, not on him.
- L9 BAIT FIRST: his exits are only tied AFTER a guard moves (the guard's
  vacated square becomes an exit mid-turn, `kingReaction` after each guard).
  She must capture the guard first (stun), stone during the stun, snare the
  square the guard left, then threaten. Order reversed from L7.
- L10 TWICE: a burrow of two chambers. The first spring holds him in the
  door for one turn while she crosses to the chamber's line; he is released
  and runs into the second chamber, whose far square is the second snare
  (T3, 2 uses), and the stone closes the door behind him. Two enemies a
  turn, seven moves.

---

### 2.2 Shove — `shove`

**Card:** "Push a stone beside you one square away. It moves. It does not disappear."
**Type line:** Targeted · Terrain. **Activation:** `targeted` (pick-square, the stone).

**Targeting.** A hazard square in Rookie's 8-neighbourhood (T4: also any
hazard on one of her rook lines within 2, with nothing between). The stone
slides ONE square directly away from Rookie (the vector from her square to
the stone). Legal only when the destination is in bounds and free of enemy,
ally, drone, hazard and Rookie, EXCEPT that from T3 the destination may
hold an enemy PAWN, which is crushed (a Rookie capture: tempo, stun,
markers cleared, the Boulder T2 rule). Never onto the king, a summon, or a
snare. Never a shove that leaves Rookie with no legal move (reuse the
`boulderTargets` self-lock check). Authored hazards and Boulder stones are
the same array (`hazards`), so both can be shoved; a run can mark stones
`fixed: true` in its puzzle def to make a wall shove-proof without piling on
a second layer of stone.

**Effect.** `hazards` loses the source square and gains the destination.
The vacated square is simply empty, for everyone: if a bishop's diagonal now
runs through it onto Rookie, that is her problem (real variance, and the
reason the card is not a free key). The king's pen is unchanged; a stone
shoved INTO a pen square deletes it from his flight set like any hazard. A
stone shoved onto a square a summon's line needed blocks the summon
(self-block, the Boulder anti-pair family).

**Edge cases.** King: cannot be crushed, cannot be shoved. Summons: block
the destination. Hazards: a stone cannot be pushed into a stone (no chain
pushes; a two-thick wall is shove-proof by construction, which is the
designer's gate). Status: a crushed pawn's markers are cleared. Decoy on the
crushed pawn clears. Move limit: free action, no tick.

**Tiers.**
| Tier | Effect text | Uses/level |
|---|---|---|
| 1 | Push a stone beside you one square away. | 1 |
| 2 | Push a stone beside you one square away. | 2 |
| 3 | Push a stone one square. A pawn it lands on is crushed. | 2 |
| 4 | Push a stone on your line, up to 2 away, one square. Crushes pawns. | 2 |
| 5 | Push stones all you like. Every one crushes what it lands on. | unlimited |

Upgrade notes: 2 "", 3 "The stone crushes a pawn it lands on", 4 "Reach: shove from 2 squares off", 5 "Unlimited shoves".

**Bot enumeration.** Adjacent hazards, at most 8 (T4: plus the two-away
line stones), each a single candidate (the direction is implied). Payoff is
one turn deep: shove, then slide into the gap or onto the line the moved
stone just closed for him. Rollouts model the changed `hazards` natively.

**Why it passes the boulder-trick test.** A sliding-block move: tap the
stone, it rolls one square, two things happen at once (a gap opens where it
was, a square dies where it lands). When the stone rolls into his cell it is
the boulder trick and the door in one motion.

**Universal-solvent warning, stated up front.** Like `knight-hop`,
`bishop-step` and `become-king`, a stone-mover solves any one-thick terrain
signature alone. It must never sit in a terrain kit unless it IS half the
signature pair, and terrain runs that want to be shove-proof use two-thick
walls, a piece standing beyond the stone, or `fixed` stones. That is a
feature: it is the first opener the game has that the geometry can refuse
square by square.

**Pairs.**
1. **Shove + Magnet** (best). "Reposition then seal", with the seal coming
   from the wall itself: pull the door guard off its post onto her line, take
   it (stun), and shove the wall stone beside her INTO his cell so his flight
   square is gone and the wall's gap is her line in. Neither half alone: the
   pull opens nothing, the shove exposes her to the guard.
2. **Shove + Become King.** The untouchable engineer literally: step to the
   wall impervious, shove the stone into his room, revert on his line. Same
   archetype as Alcove/Keep with a different second card (rubric: vary the
   pair).
3. **Shove + Smoke.** Walk to the wall unseen, shove, and because he does not
   flee while she is smoked, the gap she opened is a line he does not step
   off. Two free actions and a slide.

**Anti-pairs.** Twin and Bishop Squire (a moved stone blocks a summon's line
as surely as a dropped one; the Colonnade measurement applies). Boulder (a
weak pair, not a true anti: Boulder already drops anywhere, and two stone
cards in one kit is the Stacks' upgrade self-block twice over). Knight Hop
and Bishop Step (two openers in one kit is a skeleton-key kit).

**Existing levels it opens.**
- Vault L6-L10: every sealed cell is one stone thick against the board edge
  with free squares inside. Stand under the box, shove the floor stone up
  into the cell: his second square is gone and the file is open. Vanguard
  and Swap become optional.
- Glasshouse L6-L10: the house is a box of panes. A pane pushed into the
  room removes one of his two squares and opens the sightline the level
  said did not exist.
- Parapet L5 and L7-L10: shove a rank-6 stone DIAGONALLY (from e5, f6 rolls
  to g7): f6 is a stair and g7 is a court square he can no longer use.
- Keep L5-L10: the lip stone beside the diagonal door, pushed into the ring,
  is both a door a rook fits through and a ring square deleted.
- Lattice L6-L10: any dark stone pushed one square opens a pane (a rook
  line into the lattice) and lands on a light square (a Duchess diagonal
  closed). Designers will need `fixed` stones here.
- Switchback L4 and L6: the "stone bishop nothing else can reach" sits in a
  knot of stone; shove one knot stone and it has a line to be taken on.
- Colonnade and Alcove are shove-proof as built (a pillar beyond every
  pillar on the file; the sill's diagonals are stone). Reported as a
  virtue: the geometry refuses the card.

**New run — The Quarry (Shove + Magnet).** Signature: his room is a
STRONGBOX whose walls are single loose stones with free squares beyond
them, and his door is always plugged by a guard. L1-L2 the box has a gap.
L3 the gap is plugged by a free pawn (walk). L4 the plug is defended
(Aegis). L5 no gap, one loose stone, no plug (Shove alone). L6 gap, plug
on stone, twice defended (Magnet alone: pull it out, take it off its
defenders). L7-L10, one pair, four different asks:
- L7 THE DOOR: pull the plug out (stun), shove the stone beside her into his
  cell, slide in. The teaching line.
- L8 WHICH STONE: two loose stones; only one lands in his cell, the other
  lands on the square his flight needs and walls HER line. Choose.
- L9 SHOVE FIRST: the plug is defended by a bishop whose diagonal runs
  through a loose stone's DESTINATION. Shove first (the stone now blocks the
  bishop), then pull the plug and take it safely. Order reversed.
- L10 THE CRUSH: the plug is a pawn standing on a stone's destination square,
  and it cannot be pulled (T1 Magnet reach 2, it is 3 away). Pull a different
  guard onto her line for the stun, and shove the stone onto the plug (T3
  crush) so the door opens and he is stunned on her line at once. Two
  enemies a turn, eight moves.

---

### 2.3 Coup — `coup`

**Card:** "Trade the king's square with one of his own guards. His man takes the throne. He takes the post."
**Type line:** Targeted · Royal. **Activation:** `targeted` (pick-enemy).

**Targeting.** A non-king ENEMY within Chebyshev 1 of the king (T1: pawns
only; T2: any type; T3: any enemy standing inside his pen or within 2 of
him; T5: any enemy on the board). The king must exist and the level must be
a `king` win condition (on rank-8 levels the card is dead and never offered;
`runs.ts` allowlists handle that).

**Effect.** The king and the target swap `file/rank`. Everything that
belongs to a square rides with its piece: `relocateStatusMarkers` for
poison and rabies, the frozen marker, the decoy mark. The king's pen gains
his new square if it was outside (`kingPen` push), so he is never stuck
outside the rules, but he can only walk back through squares already in the
pen, which is usually none, which is the point: the guard's post is a cell.
No capture, no stun, no tempo. Free action.

**Then what.** He is now on the guard's post. Guards stand on posts because
posts have lines to them (a doorstep, a landing, a door, a chair beside the
throne); his throne has none. If Rookie's current form attacks his new
square he will flee at the start of the next enemy phase unless stunned,
frozen or smoked, so the second beat of the turn is either a line he cannot
step off, a stone on his one step back, a snare, or a body's cover. The
guard, meanwhile, is standing in his cell: a pawn there attacks the two
squares diagonally below the throne, which is often exactly the square
Rookie wanted to arrive on (real variance; choose the guard, not just the
square).

**Edge cases.** King: never captured by the coup; a frozen king stays
frozen on his new square (freeze then coup is a listed pair). Summons:
cannot be coup targets (enemies only); a converted piece is an ally, so
Convert and Coup compete for the same guard. Hazards: none touched. Status:
markers move with the pieces. A pawn swapped onto rank 1 promotes on the
enemy's next action per `promotionPool`. A stump pawn moved off its stone
may now march (a freed guard; variance). Snare (2.1): the king swapped onto
a snared square springs it. Smoke: the coup works, he does not flee while
smoked. Rewind restores both pieces (it is an enemy-side undo; the coup
charge is spent).

**Tiers.**
| Tier | Effect text | Uses/level |
|---|---|---|
| 1 | Swap the king with a pawn standing beside him. | 1 |
| 2 | Swap the king with any guard standing beside him. | 1 |
| 3 | Swap the king with any guard in his room or within 2 of him. | 2 |
| 4 | Swap the king with any guard in his room or within 2. Swapping stuns him a turn. | 2 |
| 5 | Swap the king with ANY enemy on the board. He is stunned a turn. | 2 |

Upgrade notes: 2 "Any guard beside him, not only pawns", 3 "Reach: his whole room, or 2 squares", 4 "The swap stuns him for a turn", 5 "Any enemy, anywhere".

**Bot enumeration.** One candidate per eligible enemy: at most 8 at T1-T2,
the pen's occupants at T3+, all enemies at T5. Payoff: swap (free), then
either slide onto him (he is on a line and stunned by a capture she just
made), or stone / snare / cover his step and slide. One turn deep, the
Alcove's "count the casts in the turn" rule satisfied (two casts plus a
move, same as become-king + boulder, which read 81-97%).

**Why it passes the boulder-trick test.** One tap and the two pieces trade
places with a flourish: his own sentry sits on the throne and he is standing
in the doorway. The "oh" is realising the doorstep he could never be reached
on is now where he lives.

**Pairs.**
1. **Coup + Boulder** (best, with existing cards). Swap him onto the post,
   drop a stone on the one square he would step back to, slide onto the
   post's line. Cage-and-take where the cage is his own court.
2. **Coup + Duchess (or any body with a line to the post).** In rooms no rook
   line enters (Millstone, Lattice), the post IS the square a body attacks.
   Swap him onto it, summon the body on the line, he cannot step (the guard
   now fills his throne), the body takes him.
3. **Coup + Freeze Ray.** Freeze him where he stands, coup him onto a post
   on her line, take him. Two free actions and a move from anywhere a post
   has a line, which is nearly everywhere; report it as a strong (possibly
   too strong) pair and let the matrix decide.

**Anti-pairs.** Convert (same target, two answers; a converted guard is no
longer an enemy so Coup has nothing to swap). Magnet T5 (both "move the
king one square"). Rabies Dart (a rabid guard swapped into his throne bites
him? No: rabid pieces never take the king; but its target list is his court
at range 1, i.e. it eats the guard that just became the door). Smoke is a
pair, not an anti (he does not flee after the swap), but Coup + Smoke +
anything is a skeleton key; keep them apart in kits.

**Existing levels it opens.**
- Millstone L7-L10: the door pawn stands beside him. Swap: he is in the door
  f7, on the window line a2-g8. One Duchess on the line takes him; the
  double door (two summons, each dying) is no longer needed. Coup + Duchess.
- Lattice L7-L10: swap him with his e6 pawn (L7). He stands on e6, whose
  free diagonals are d5 and f5; Rookie on d4 attacks d5, the Duchess spawns
  on f5 and attacks e6. He has no square; she takes him. Coup + Duchess, no
  Decoy, the watcher irrelevant.
- Switchback L7-L10: the corridor pawn (d6 on L7) is adjacent to c7. Swap:
  he is on the landing, and the landing is on the Bishop Squire's diagonal.
  Coup + Bishop Squire, no poison, no waiting.
- Alcove L7-L10: swap him with the sentry (f7). f7 is a knight's jump from
  e5, which is on the launch row. Coup + Knight Hop: stand on e5 (a rook
  there threatens nothing, he does not step), cast, hop onto him. Become
  King and the stone become optional.
- Alley L6-L10: swap him with the crown pawn above him (a6 on the finale
  block): he is now at the top of the queue with the queen below him and
  nothing above; the gate line reaches him one square higher. Coup + Rabies.
- Briar L6: the corner room a rook line never reaches; his crown pawn beside
  him stands on a square the c-file sees.

**New run — The Court (Coup + Boulder).** Signature: the king sits on a
THRONE that has no line to it, ringed by CHAIRS (guard posts) that each
have exactly one line, and the whole run asks WHICH GUARD YOU DEPOSE. L1-L2
still king on a chair. L3 first flee, one chair, no guard (walk). L4 the
chair's line is plugged by a defended piece (Aegis). L5 a guard on a chair
whose line is open but he has a step back (Boulder alone: stone the step,
the guard is a free stun, slide). L6 the throne, one pawn on the only chair
with a line, no step back (Coup alone). L7-L10:
- L7 THE DOORSTEP: one chair, one step back. Coup, stone, slide.
- L8 THE QUEEN'S CHAIR: two guards beside him, a pawn and a queen. The
  queen's chair has the line, but a queen on the throne attacks her arrival
  square; the pawn's chair has a line only after the queen is pulled off it
  by capture-stun logic. Choose the pawn (T1 can only choose the pawn; T2
  players must resist the queen). The level is about the guard, not the
  square.
- L9 STUN FIRST: no step back exists, but his chair is attacked by a second
  guard that would recapture her. Take a key on the chair's line first (stun
  and vacate), coup during the stun, slide: the stone goes on the second
  guard's route, not his. Order reversed.
- L10 TWICE: two thrones joined by a corridor; the first coup puts him on a
  chair in the near court where a slide only drives him down the corridor
  (no line to the far chair yet); the second coup (T3) swaps him with the
  far court's guard onto the far chair, stone behind him, take. Two enemies a
  turn, eight moves.

---

### 2.4 Hourglass — `hourglass`

**Card:** "Turn the glass. The enemies take a turn now. You have not moved."
**Type line:** Instant · Time. **Activation:** `instant`.

**Targeting.** None. Castable only on Rookie's turn with no `activeAbility`
and no `pendingOffer`.

**Effect.** The turn passes to the enemy phase immediately: `turn: 'enemy'`
(or `'allies'` first if AI allies exist), `enemyMovedSquares: []`,
`enemyVacatedSquares: []`. `moveCount` does not tick (the clock counts
Rookie's moves). A full enemy phase resolves: the fleeing king reacts, the
army acts (`enemiesPerTurn` of them), `endTurn` ticks EVERYTHING that ticks
(freeze, poison, rabies, decoy, smoke, king stun, summon clocks, king-form
protection), and control returns to Rookie with her move still in hand.
`pushEnemyPhaseSnapshot` fires as for any fresh phase, so Rewind can undo
the glass-turn (see Hourglass + Rewind below). The daze on a freshly
converted piece does NOT clear on a glass-turn (it clears at the end of the
enemy turn that follows a real Rookie action), so convert + hourglass is not
the same-turn king kill Tyler closed on 2026-09-06. Free action, one cast
per Rookie turn below T5.

**Then what.** Everything that was two turns away is now one: a poison
death lands and stuns him for the next enemy turn; a decoy gets eaten (stun
2) with her move still to come; a marching pawn walks off its post; a
hunter walks onto her line to be taken. The cost is symmetric and honest:
his court gets closer, his stun ticks down, her summons' clocks tick, her
smoke and crown burn.

**Edge cases.** King: he flees during the glass-turn if threatened and not
stunned/frozen/smoked (T3+: he is held for the glass-turn). Summons: their
clocks tick (T4+: not during a glass-turn); a Twin/Squire with a free move
that already moved this turn keeps `movedThisTurn` through the glass-turn
(no second free move). Hazards: untouched. Status: all counters tick once.
Aegis: the shield can absorb a capture during the glass-turn like any
other. Surge: bonus moves are preserved (`bonusMovesLeft` untouched). Move
limit: no tick.

**Tiers.**
| Tier | Effect text | Uses/level |
|---|---|---|
| 1 | The enemies take a turn now. You have not moved. | 1 |
| 2 | The enemies take a turn now. You have not moved. | 2 |
| 3 | The enemies take a turn now, and the king stands still through it. | 2 |
| 4 | The enemies take a turn now, the king stands still, and your summons' clocks do not run. | 2 |
| 5 | Turn the glass as often as you like. The king stands still each time. | 3 |

Upgrade notes: 2 "", 3 "The king is held for the glass-turn", 4 "Your summons do not age during it", 5 "".

**Bot enumeration.** One candidate (`activate-ability`). The MCTS rollouts
run the real `pawn-ai` inside the glass-turn, so the fuse landing, the
decoy being eaten and the pawn walking are modelled exactly. It is the first
card that lets the bot "wait" without a body-move, which is the Switchback
and Alley finding turned into a card: those pairs were unfindable because
waiting cost a move, and now it costs a cast.

**Why it passes the boulder-trick test.** Weaker than the other four on
this axis: the tap has a visible consequence (the board plays a turn in
front of you) but the "oh" only lands with a fuse on the board. With a
poisoned guard on his line it is exactly the trick: tap, the guard dies,
the king stiffens, you slide.

**Pairs.**
1. **Hourglass + Poison Dart** (best). Dart the lock (free), turn the glass
   twice (T2), it dies, the death stuns him for the coming enemy turn, and
   she still has her move: onto his line. The Switchback's entire finale
   compressed into one turn; the bot finds it.
2. **Hourglass + Decoy.** Mark a guard, turn the glass, the court eats it
   (friendly fire: stun 2, the guard's square vacated), then move onto the
   line. The Lattice's "buy the body time" becomes "buy the stun now".
3. **Hourglass + Rewind.** The information combo: turn the glass, watch what
   the court does, Rewind it (the snapshot is armed by the glass-turn and
   `moveCount` matches), then move knowing their reply. A free look at the
   enemy's turn. Also Hourglass + Rabies Dart (the bite is the enemy turn;
   take the bite now).

**Anti-pairs.** Duchess and Dragon (2-4 turn clocks burn during a
glass-turn; the Duchess at T1 loses half her life). Smoke, Become King,
Freeze Ray on a guard, Aegis-as-timing (each is a window and the glass
burns windows). Bodyguard. Convert (the daze rule above means the pair does
nothing extra by design).

**Existing levels it opens.**
- Switchback L7-L10: poison the corridor pawn, glass, glass, summon the
  squire into the corridor as it dies. The design intent, now findable.
- Moat L4 (the slow lock) and L9 (two darts under a queen): the fuses land
  before the clock runs out.
- Alley L6-L10: dart the queue, glass, the bite happens now and the queen is
  sealed on a3 while she still has her move.
- Lattice L3-L5: mark the cork's defender, glass, the cork eats it and walks
  out of the doorway, then ride the channel this turn.
- Briar L4-L5: the defended plug's defender is poisoned and dead before the
  hedge marches; and on L7-L10 two glass-turns drain the front row for free
  (the run's anti-drain runner is designed against exactly this, so it is a
  new line, not a break).

**New run — The Fuse (Hourglass + Poison Dart).** Signature: a LOCK on his
line that nothing captures (a pawn pocketed in stone, a bishop knotted in
place) and a CLOCK too short to wait for. L1-L2 a free lock. L3 a lock a
dart kills in time (Poison alone, 3 turns, 8 moves). L4 a plug that is
defended once (Aegis). L5 the lock behind two hunters: waiting is death, but
a glass-turn walks the hunters onto her rank-1 lines to be eaten (Hourglass
alone, as a lure). L6 the lock under a 5-move clock (Poison + Hourglass, the
first pair ask). L7-L10:
- L7 THE FUSE: dart, glass twice, slide. The teaching line.
- L8 WHICH PIECE: the lock is a MARCHING pawn that will be standing on his
  line in two turns; dart the pawn where it is, glass to walk it onto the
  line, glass again to kill it there. The dart's target is chosen for where
  it will die, not where it stands.
- L9 GLASS FIRST: a hunter guards the lock's line; a glass-turn brings the
  hunter onto her rank to be taken (stun), and only THEN is the dart thrown,
  because the lock only becomes a lock once the hunter is gone (its file was
  the hunter's). Order reversed.
- L10 TWO FUSES: two locks on two lines, one dart each (T2), three
  glass-turns between them, two enemies a turn, seven moves. The second lock
  must be darted during the first's countdown.

---

### 2.5 Scarecrow — `scarecrow`

**Card:** "Stand a straw Rookie on an empty square. For a turn, the court and the king believe it."
**Type line:** Targeted · Trick. **Activation:** `targeted` (pick-square).

**Targeting.** Any empty square (no enemy, ally, drone, hazard, Rookie,
snare). One scarecrow at a time.

**Effect.** For `scarecrowTurnsLeft` enemy phases, the enemy AI runs
against a VIEW in which the scarecrow's square is Rookie (the
`decoyViewState` pattern, applied to an empty square rather than an enemy
piece) and the real Rookie is a blocker that cannot be captured or hunted:
- Capture priority: a piece that can land on the scarecrow scores it as
  Rookie (queen-tier). The capture destroys the straw and wastes the
  army's action. No capture is credited, no stun.
- Approach: hunters approach the scarecrow, not her.
- The king's flee (`kingFleeMove`) reads the scarecrow's ROOK lines as the
  threat and Rookie's real lines as harmless. He steps to the farthest
  square safe from the STRAW, which may be a square she attacks for real.
- Guards' "never step onto a square Rookie's form attacks" reads the straw's
  lines.
- The straw is rook-form regardless of Rookie's form (T4: queen-form).
- The scarecrow blocks sliding pieces like an ally and vanishes at the end
  of its last enemy turn or when captured.

**Edge cases.** King: he is fooled, not stunned; he still refuses hazards,
pen-outside squares and ally-covered squares. Summons: enemies still eat
summons at ally value (a summon is a louder target than the straw only if
the straw's queen-tier score is lowered; keep the straw at Rookie value so
it is preferred, since "buy the body a turn" is a legitimate side use).
Hazards: untouched. Status: none. Smoke: redundant (anti). Decoy: two dummies
in one turn budget (anti). Rabies: a rabid piece's target list includes the
straw at Rookie value (nearest wins). Rewind: restores the straw.

**Tiers.**
| Tier | Effect text | Uses/level |
|---|---|---|
| 1 | A straw Rookie on an empty square, for 1 turn. They hunt it. He runs from it. | 1 |
| 2 | A straw Rookie for 2 turns. They hunt it. He runs from it. | 1 |
| 3 | A straw Rookie for 2 turns. | 2 |
| 4 | A straw QUEEN for 2 turns. He runs from her diagonals too. | 2 |
| 5 | A straw queen for 3 turns. Whatever strikes it dies on the spot. | 2 |

Upgrade notes: 2 "Stands 1 turn → 2", 3 "", 4 "The straw is a queen: he fears diagonals too", 5 "Stands 3 turns. Attackers die (a capture, and a stun)".

**Bot enumeration.** Empty squares with an open rook line to the king (at
most 14) plus empty squares within 2 of Rookie, capped at 16. Payoff is one
turn deep (place, move onto the square he will flee to, he flees there,
take), and the rollouts run the real AI so the fooled flee is modelled
provided the view is implemented inside `pawn-ai`, not in the bot.

**Why it passes the boulder-trick test.** A straw doll appears, the knight
charges it, the king runs the wrong way onto her file. Very satisfying when
it lands; the mental model (two line sets, his and the straw's) is a beat
heavier than the other four, which is why it ranks last on legibility.

**Pairs.**
1. **Scarecrow + Knight Hop** (best). Hop over the wall onto the line of
   his FLIGHT square (a rook there does not threaten him, he stands), put
   the straw on the window line to his CURRENT square, he flees the straw
   onto her line, take. The Slash and Parapet finales without a stone or a
   second rook.
2. **Scarecrow + Twin.** The Twin holds one line of a three-square room, she
   holds another, the straw drives him onto one of them.
3. **Scarecrow + Duchess/Dragon.** The straw draws the hunters' single
   action away from the body for one turn (the Lattice's "buy the body time"
   without a decoy tie-break).

**Anti-pairs.** Decoy (same turn budget, two dummies). Smoke (nobody sees
her anyway; the straw's only extra is the steer). Rabies Dart (a rabid piece
chases the straw at Rookie value and the targeting gets muddy). Freeze Ray
on the king (he does not step; the steer is wasted).

**Existing levels it opens.**
- Glasshouse L3-L5: the diagonal cell where "he is reading your line".
  Straw on the line to his square, Rookie on the line to the other square.
  He steps onto her.
- Slash L5, L7-L10: hop, straw, he steps into the column she holds.
- Parapet L6 (Twin was the key) and Vault L5 (Smoke was the key): a 2x2
  held by one rook and a straw.
- Stacks L5, L7-L10 and Colonnade L10: the 2x2 corner room, with the straw
  standing in the shaft or the hall below.

**New run — The Mirror Hall (Scarecrow + Knight Hop).** Signature: a solid
wall with WINDOWS (single gaps that a line passes through but no piece can
stand in, because the square beyond each window is stone on the far side of
a knight's jump), and a king who watches the windows. L1-L2 a door and a
window. L3 first flee, window and door on the same file (walk). L4 a plug
in the door (Aegis). L5 no door, window open (Knight Hop alone: hop, he
stands, take). L6 door open, no window, 2x2 room (Scarecrow alone: straw on
his file through the door, she on the rank). L7-L10:
- L7 THE WINDOW: hop over, straw in the window line, he flees onto her.
- L8 TWO WINDOWS: one straw and two windows; the wrong window drives him
  into the corner she cannot see. The straw goes on the FAR window.
- L9 STRAW FIRST: a hunter guards the landing square. Straw first so the
  hunter charges it this turn (its action spent), then hop next turn into
  the landing it left; the straw's second turn (T2) is the steer.
- L10 TWICE: two rooms; the first steer puts him in the corridor between
  them, the second straw (T3) drives him out of the second room onto the
  line she holds from the first. Two enemies a turn, seven moves.

---

## 3. Ranking

Scored on (a) how many existing levels open, (b) the boulder-trick test
(one tap, one visible consequence, an "oh" in combination), (c)
implementation risk in this engine.

1. **Snare.** (a) Every 2x2, diagonal cell and short ring in the library, a
   dozen levels across seven runs. (b) The purest match for Tyler's boulder
   trick: same beat, sign flipped, and his flee rule makes the X placement
   readable. (c) One new state field (`snares`), one trigger hook in
   `stepEnemyTurn` after `applyAction` and after `kingReaction`, reuse of the
   freeze maps; the T4 capture branch copies the Boulder crush code.
2. **Shove.** (a) The most levels of the five (every one-thick wall), but
   as a universal-solvent-class card it opens them ALONE, which the rubric
   treats as a kit hazard, so it is scored down. (b) Sliding-block
   satisfaction, and the crush at T3. (c) Lowest risk in the set: two
   `hazards` array edits and the existing self-lock check.
3. **Coup.** (a) Opens the runs whose finales were "no line to his square"
   (Millstone, Lattice, Switchback, Alcove), always as a pair. (b) The
   biggest single "oh" in the set. (c) Piece swap plus marker relocation,
   plus the `kingPen` extension; the pen edge cases need care but are
   contained.
4. **Hourglass.** (a) Opens fuse levels (Switchback, Moat, Alley, Lattice
   L3-L5). (b) The weakest tap-to-consequence of the five; it needs a fuse
   to be exciting. (c) Very low risk (set `turn`), and it is the card that
   most directly repairs the bot's known blind spot (it cannot wait).
5. **Scarecrow.** (a) Opens the sightline and 2x2 levels, overlapping
   Snare's territory. (b) A great beat with a heavier mental model. (c)
   Highest risk: a second view-state inside `pawn-ai` touching capture
   priority, approach, guard caution and `kingFleeMove`, with three known
   interaction hazards (Decoy view, Smoke, Rabies).

## 4. Engine notes for whoever builds these

- **Where effects resolve.** All five are free actions resolved in
  `applyAbilityTargeted` / `applyAbilityActivate`; none ends the turn. Snare,
  Coup and Scarecrow need hooks in `stepEnemyTurn` (`pawn-ai.ts`): Snare
  after `applyAction` and after each `kingReaction`; Scarecrow as a view in
  `chooseEnemyActionAgainst`, `approachMove` and `kingFleeMove`, ticking in
  `endTurn`. Coup and Shove are pure board edits.
- **State fields.** `snares: { square: string; turnsLeft?: number }[]`,
  `scarecrow?: { square: string; turnsLeft: number }`, and three
  `lastAbilityFx.kind` values (`snare`, `shove`, `coup`, `scarecrow`,
  `hourglass`). Hazards may want an optional `fixed` flag on
  `RunPuzzle.hazards` so authored walls can refuse Shove; the engine's
  `hazards: Coord[]` would need to carry it (or a parallel `fixedHazards`
  list on the state).
- **Rewind interaction.** The enemy-phase snapshot must include `snares`
  and `scarecrow` so a rewound turn restores them unsprung. Hourglass pushes
  a snapshot like any phase; `canRewind`'s `moveCount` check passes after a
  glass-turn, which is what makes Hourglass + Rewind a "peek".
- **The hard one.** Scarecrow. `kingFleeMove` calls
  `rookieLegalMoves(state)` for the threat and again per candidate square;
  the straw needs those calls to run on a view with `rookie` at the straw's
  square and `form: 'rook'` (T4 `'queen'`), while the real Rookie remains an
  occupied square. `chooseEnemyActionAgainst` already has the Decoy view
  precedent; the difference is that a straw capture must remove the straw
  rather than a piece, and must not be credited. If Decoy and Scarecrow are
  both live, define the order (straw first) and never ship them in one kit.
- **Tier fragility to measure.** Coup T5 (any enemy) and Snare T5
  (permanent traps) are the tiers most likely to break a finale gate; report
  the matrix at T1 and at the highest tier the offers reach, as the rubric
  now requires.
- **Bot.** Add the five to `candidatesForAbility` in
  `scripts/run-playtest/bots/shared.ts` per the enumeration rules above and
  to `applyBotAction` (all resolve through the existing targeted/instant
  paths; no new action kinds). The `+`-joined compound loadout in
  `revenge-core.ts` already measures pairs.
