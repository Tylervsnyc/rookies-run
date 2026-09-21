# Twenty abilities, ten picks, ten runs (2026-09-19)

Tyler's brief: 20 abilities on paper, pick the 10 he will like best, CODE those
(testing stage, bot-measured), and build 10 full runs — five runs invented FOR
five abilities, and five abilities invented FOR five crazy levels. Experiment
with lava and boulder placement. His favourites: Dragon, Swap, Sacrifice,
Boulder, Convert.

What those five have in common (the taste filter used below):

- **A body or a block he places himself** (Dragon, Boulder, Convert).
- **A socket other cards plug into** (Swap, Sacrifice: body-then-become, body-then-blast).
- **One tap, one visible consequence, this turn** (the boulder trick).
- Nothing hidden, nothing random, nothing that pays off three turns later.

Already built or proposed, so NOT repeated here: Snare, Shove, Coup, Hourglass,
Scarecrow, Pick-Axe, Gauntlet, Panic, Chequer, War Banner, Phalanx, Griffin,
Vanguard Pawn.

## New terrain rules (Tyler said yes, if visible + deterministic) — VETO LIST

Each is used only by the new cards, so no graded run changes.

| # | Rule | Used by |
|---|---|---|
| R1 | **Lava burns what is forced into it.** A piece made to enter lava dies; it counts as Rookie's capture (king stunned). Nobody walks into lava on their own. | Puppet, Castle (never the king) |
| R2 | **Lava can spread.** A card may create new lava squares. (Boulder still never does.) | Eruption |
| R3 | **Stone sinks, lava cools.** A stone that slides or lands INTO lava: both vanish, the square is open ground — a ford. | Avalanche, Catapult |
| R4 | **Stone is a mirror.** A ricocheting rook turns 90 degrees at a stone. Lava is not a mirror (she stops). | Ricochet |

## The twenty

Pick = coded this round. AF = ability-first (a run is invented for it).
LF = level-first (it was invented to solve a crazy level).

| # | Ability | One line | Verdict |
|---|---|---|---|
| 1 | **Promote** | Tap your summon: it steps up the ladder pawn → knight → bishop → rook → queen. | PICK (AF) |
| 2 | **Puppet** | Make one enemy guard take one legal move of its own — you choose it. Into lava if you like. | PICK (AF) |
| 3 | **Raise** | The last piece she captured stands up beside her, on your side. The level decides your summon. | PICK (AF) |
| 4 | **Eruption** | Tap lava: it floods the squares next to it. Guards burn, his flee squares vanish. | PICK (AF) |
| 5 | **Chain** | Arm it, then capture: every same-type enemy touching the victim dies too, and so on down the line. | PICK (AF) |
| 6 | **Castle** | Rook and king on one rank or file, anything between: he jumps two toward her, she hops to his far side. Rules are rules. | PICK (LF) |
| 7 | **Catapult** | Fling the stone or summon beside her in a straight line, over everything, to a square you choose. | PICK (LF) |
| 8 | **Mirror** | A mirror Rookie appears across the board and copies every move she makes, flipped. | PICK (LF) |
| 9 | **Ricochet** | Her next move bounces: slide to a stone, turn 90 degrees, keep sliding. | PICK (LF) |
| 10 | **Avalanche** | Every loose stone on the board slides one square the way you point. Pawns under them are crushed. | PICK (LF) |
| 11 | Portal | Two holes; her side walks in one and out the other. | Paper. Skeleton-key risk: crosses every wall ever authored. |
| 12 | Egg | Drop an egg; two enemy turns later it hatches a wyrmling. | Paper. A fuse — the bot never waits (Hourglass lesson). |
| 13 | Meteor | Smash a square on her line; it becomes a lava crater. | Paper. Folded into Eruption (R2) — same fantasy, less ranged-kill. |
| 14 | Powder Keg | A barrel that blasts 3x3 when a capture happens beside it. | Paper. Sacrifice already owns blasts. |
| 15 | Leash | Tether the king within 1 of an anchor square. | Paper. Snare/Freeze territory. |
| 16 | Gravity Well | Enemies within 2 are dragged a square toward it each turn. | Paper. Multi-turn, heavy mental model. |
| 17 | Possess | She jumps INTO a guard on her line and becomes it. | Paper — strong second-round candidate (Swap + Convert in one). |
| 18 | Stampede | Every enemy pawn marches one square right now. | Paper. A partial Hourglass; worth one move (the theorem). |
| 19 | Quench | Cool one lava square into walkable basalt. | Paper. R3 gives the same ford with a stone, as a combo instead of a key. |
| 20 | Drawbridge | Flip a marked lava span open/closed. | Paper. Needs authored toggle squares — a level rule, not a card. |

## The ten picks — rules tight enough to code

All are FREE actions unless stated (only a body moving ends the turn). Uses are
per level. Never the king unless stated. Every new body is a controlled summon:
Swap, Sacrifice and Promote may target it.

### Ability-first

**1. Promote (`promote`)** — targeted, one of your controlled summons (Page,
Squire, Bishop Squire, a Converted or Raised piece, Mirror). It becomes the next
type up: pawn → knight → bishop → rook → queen. Tiers: 1/1/2/2/2 uses; T3+ two
steps per use; T5 any summon straight to queen. Its clock and daze are
unchanged. Why it catches kings: the body is already in his court — change what
it attacks and take him this turn (a promote-then-capture gives him no
reaction, like Knight Hop). Pairs: Convert, Page, Raise.

**2. Puppet (`puppet`)** — targeted: an enemy non-king piece on one of her
CURRENT FORM's lines (first piece hit). Then tap one of ITS legal non-capturing
moves; it goes there now. R1: a lava square next along its move is a legal
destination and kills it (capture-stun). Tiers: 1/1/2/2/2 uses; T3+ it may
capture its own side (friendly fire = capture-stun); T4+ any enemy within 3, no
line needed; T5 any enemy. Why: pull the guard off his line, walk the defender
off the key, or burn the sentry beside the moat. Distinct from Magnet (its
move, not a pull; any direction) and Decoy (you choose, now).

**3. Raise (`raise`)** — instant, castable when she has captured a non-king
piece this level and a square beside her is free: tap the spawn square, the
last captured piece stands there, rainbow, controlled, dazed this turn. Lasts
6/9/9/level/level enemy turns; 1/1/2/2/2 uses; T1-T2 pawn or minor only, T3+
anything. A chip on the card shows what is in the grave. Why: the LEVEL decides
the summon — eat the bishop, get a bishop. Pairs: Swap, Sacrifice (blast shape
= the piece), Promote.

**4. Eruption (`eruption`)** — targeted: a lava square within 2/2/3/3/any of
her. T1-T2: then tap ONE orthogonally adjacent square; T3+: all four flood.
Empty → lava. Pawn (T2+: minor, T4+: any guard) → burns, capture-stun, square
becomes lava. Never the king's square, never her square, never a summon's,
never a square that would leave her with no move. 1/2/2/3/3 uses. Why: the
boulder trick in lava — delete his flee square or burn the key guard, from
range, only where the level has lava. The geometry refuses it everywhere else,
which is what a terrain card should do.

**5. Chain (`chain`)** — instant: armed until the end of this turn. The next
capture credited to her side spreads: every enemy of the SAME TYPE in the
victim's 8-neighbourhood dies, and theirs, to a depth of 2/3/4/any/any links.
T3+: pawns and knights count as one family; T5: any non-king. 1/1/2/2/2 uses.
The preview tints the whole chain before she commits. Why: the defended pawn
chain — the game's oldest lock — becomes a fuse. Kill the head, the tail on his
line goes with it, he is stunned, take him. Designers break chains with a gap
or an odd piece; Magnet, Puppet or Convert closes the gap.

### Level-first (the crazy level came first)

**6. Castle (`castle`)** — level: **The Atoll**, a king alone on an island
ringed by lava, no guards, no door. Nothing crosses; so HE comes out. Castable
when she shares a rank or file with the king, ANYTHING between. Exactly the chess move: he jumps two squares toward her, and she lands on the
square he crossed — so she ends up beside him, on his far side from where she
stood. Both landing squares must be empty ground (the squares between may hold
anything). **It is her body-move — the turn ends.** His pen becomes his landing
square plus its open neighbours (he cannot go back through a wall). Tiers:
1/1/2/2/2 uses; T1 rank only, T2+ rank or file; T4+ he arrives stunned one
turn. Why it needs a partner: he lands, the turn ends, he runs. A body already
watching the landing square (Dragon, Duchess, a Raised piece) or a stone/snare
on his new flee squares is the second half.

**7. Catapult (`catapult`)** — level: **The Gorge**, a lava river across the
whole board, no ford, her side holds nothing but loose stones. Targeted: a
loose stone OR one of her summons orthogonally beside her, then a landing
square straight away from her along that line, 2-4/2-5/any distance, over
anything. Stone: lands as stone; on a pawn (T2+) it crushes (capture-stun); in
lava → R3 ford. Summon: lands ready if it was ready. Never onto the king.
1/2/2/3/3 uses. Why: bodies and blocks cross terrain she cannot. Convert a
pawn, fling it over the river, Sacrifice it in his court.

**8. Mirror (`mirror`)** — level: **The Looking Glass**, a symmetric board
whose left corridor (to the king) is corked from her side while the right twin
is open. Instant: a rainbow rook appears on her mirror square (file 9 - f, same
rank; must be empty ground). Each time SHE moves, it makes the same move
flipped left-right, for free, as far as it legally can (stops at blocks,
captures what it lands on, may take the king). It cannot be moved by tapping.
Lasts 3/4/5/6/level of her moves; 1 use (T4+: 2). Why: one input, two bodies —
the asymmetries in the level are the puzzle. It is a summon: Swap teleports her
across the axis.

**9. Ricochet (`ricochet`)** — level: **The Baffle**, a king in a cell whose
only mouth faces sideways down a dog-leg no straight line enters. Instant: her
NEXT rook move may bank once (T3+: twice) — slide to the square before a stone,
turn left or right, keep sliding; the path is drawn before she commits and she
may capture at the end of it (the king included). Lava and pieces do not bank.
Rook form only. 1/1/2/2/3 uses. He only fears her current straight lines, so a
banked line is a line he does not see coming. Why a partner: the level offers
no stone at the right corner — Boulder puts one there. Stones become mirrors;
his favourite card becomes a cue ball rail.

**10. Avalanche (`avalanche`)** — level: **The Scree**, rows of loose stone
hanging over a roofless pen. Instant + direction (N/S/E/W): every LOOSE stone
(not `fixed`, not lava) slides one square that way, far side first, if the
square beyond is free. A pawn in the way is crushed (T3+: minors too),
capture-stun. A stone never moves onto the king, Rookie or a summon. R3: into
lava → ford. T4+: slides two squares. 1/1/2/2/2 uses. Why: a board-wide Shove
that needs no adjacency — lids drop on his flee squares, doors open in walls,
all in one motion. Authors control it with `fixed`.

## The ten runs

House naming (one architectural noun). Each follows the combo-gate contract in
`.claude/run-level-design.md`: 4-card kit, L7-L10 no single kit card > 8%, the
signature pair 60-80%, each finale level a DIFFERENT use of the pair. Pairs
below are the design intent; the bots have the last word and the author may
swap the partner if the numbers say so (report it).

| Run | Signature pair | Terrain experiment |
|---|---|---|
| The Pawnshop | Convert + Promote | Stone display cases: pawns boxed in 1x1 niches inside his court |
| The Caldera | Puppet + (Dragon or Swap) | Lava RING in the centre, guards posted on the rim |
| The Crypt | Raise + Sacrifice | Stone sarcophagi — sealed 1x2 cells; the blast shape of the raised piece is the key |
| The Vent | Eruption + Boulder | Diagonal lava VEINS and single lava "vents" inside the pen |
| The Daisy Chain | Chain + Magnet | Snaking pawn chains threaded between stone posts, one link missing |
| The Atoll | Castle + Dragon | King on a lava island, 1-thick then 2-thick ring, islands off-centre |
| The Gorge | Catapult + Convert (or Sacrifice) | Full-width lava river, loose stones as ammunition on her bank |
| The Looking Glass | Mirror + Swap | Left-right symmetric stone with ONE broken symmetry per level |
| The Baffle | Ricochet + Boulder | Dog-leg corridors, stones as rails, lava as "dead rail" that refuses the bank |
| The Scree | Avalanche + (Boulder or Freeze Ray) | Rows of loose stone over a roofless pen, `fixed` ribs, a lava gutter stones sink into |

## Build order

1. Two worktrees off main: five ability-first cards in one, five level-first in
   the other; merge. Each card: types, def + tiers + copy, targeting, engine
   effect, enemy-AI hooks, Rewind snapshot, bot candidates + eval, unit tests,
   pipeline `testing`, ability-lab.
2. Ten run authors in parallel (one file each), measured with `revenge.ts matrix`.
3. Report: numbers, play links (`?run=<id>`), and what did not gate.

Nothing here is player-facing until Tyler runs `pipeline.ts approve`.
