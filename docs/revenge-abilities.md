# Rookie's Revenge — the king-catching abilities (v3: 15 in the pool + Squire behind a flag)

Hidden run `revenge-1` (`/?run=revenge-1`). Win condition: **capture the
enemy king**. A lone rook can never catch a fleeing king — abilities are the point.

## Terrain: hazards are LAVA **or** STONE (2026-09-06)

`Hazard.kind` splits the one `hazards` array into two fictions, and they are
drawn differently:

- **`'stone'` (the DEFAULT when `kind` is absent)** — the walls, pillars,
  sills, plugs and pens that shape a room, plus every block **Boulder** drops
  and **Shove** rolls. Drawn as raised grey rock, no animation.
- **`'lava'`** — deadly terrain: a moat, a river, a field of heat. Drawn as
  the painted Mario lava lake. **Shove refuses it** (you cannot push a river);
  Boulder never creates it.

Runs set the kind at their hazard *helper* (`MOAT()` in The Moat,
`BRIDGE_HAZARDS` in The Bridge); every other authored hazard in the catalogue
is stone by default because every run header calls it a wall, a pillar or a
pen. See `lib/run/types.ts` and `lib/run/lava-style.ts`.

## King rules (v2)

- He moves **only** when Rookie's *current form* threatens his square.
- He never captures, never steps onto a square Rookie or a rainbow ally attacks,
  never leaves his **pen** (`kingPen`, the gold-washed room; walls are hazards).
- His flee is a **free reaction**: he sidesteps at the start of the enemy turn
  and again right after a guard moves if that opened a line (no "wait behind a
  guard" cheese). Among safe squares he avoids the ones that share an open
  file/rank with a piece Rookie can take right now (he knows about capture-stun).
- **Capture-stun:** any capture credited to Rookie — her own move, a drone, an
  ally, friendly fire on a decoy, a poison death — leaves him **STUNNED for the
  next enemy turn** (tag on the board). Take a guard that sits on his line and
  he can't flee: take him next.
- **Frozen** (Freeze Ray on the king): can't flee for `tier turns + 1`.
- Guards on king levels are careful: they never step onto a square Rookie's
  form attacks (unless it's a capture) and never wander into the pen. Pawns
  hold their posts (they only advance when no hunter can), which is why the
  keys are defended by pawns.
- Flee levels (L5+) carry a **move budget** (12 / 12 / 12 / 14 / 14 / 18) shown as a chip.

## Offers

- A **free pick before the first move on levels 1, 3, 6 and 9** (3 cards,
  no skip; `offerOnLevels` in `lib/run/runs.ts`):
  *"One rook can't do this alone. Take something."* Level offers never touch
  tempo. Tempo offers still roll on top (3-wide in this run).
- **Tempo cap is 12 on king levels** (`tempoMaxFor(state)` in
  `lib/run/scoring.ts`; live rank-8 levels keep 8). The bar shows 12 segments,
  the level-clear +2 and the offer-roll-when-full both use the per-level cap,
  and dismissing a tempo offer refunds half (6). Net effect: fewer tempo
  offers per run (~6-7 picks/run vs ~9 at cap 8).
- Every slate carries **at least 2 finishers** (`REVENGE_CORE`), as new picks
  or upgrades of an owned one, so a random pick can never brick the run.
- Cap is still 3 owned abilities; after that every offer is upgrades.
- **A run can cap the TIER of specific cards** (`RunDef.abilityTierCaps` in
  `lib/run/runs.ts`, re-exported via `run-kit.ts`): a map of ability id → the
  highest tier that run will ever offer or upgrade to. Combo runs are gated
  with T1 cards but offers upgrade them mid-run, and the tier that grants a
  card its SECOND use (or second turn) repeatedly turned a gated finale into a
  one-card solo — measured on five runs. Enforced in one place, `rollOffer`:
  the card is still offered as a new pick at T1 and upgradable up to its cap;
  an upgrade past it is never put on a slate, and the slate is topped up with
  another card instead. Shipped caps: The Colonnade `bishop-squire` T2, The
  Parapet `knight-hop` T3, The Lattice `duchess` T3, The Alcove `become-king`
  T1, The Hayloft `knight-hop` T1. The same card caps differently per run —
  a cap is a property of the level geometry, so measure, never copy. Audit
  with `npx tsx scripts/run-playtest/tier-cap-audit.ts`; the full rule is in
  `.claude/run-level-design.md` → "The gate depends on ability TIER".

## The pool (`REVENGE_ABILITIES` in `lib/run/runs.ts`)

Numbers are the shipped tiers (T1 → T5). "Why it catches kings" is the one-line
mental model. Bot win % is the T6 MCTS bot at **T1**, worst level in L3–L10
(see `docs/revenge-playtest.md` for the full table).

### Finishers (core — at least two per slate)

| # | Ability | Numbers | Why it catches kings | Worst T1 win % |
|---|---------|---------|----------------------|----------------|
| 1 | **Surge** | +1 / +1 / +2 / +2 / +3 extra moves this turn; 1/2/1/2/2 uses | Two moves in a row: get on his line, take him — he never gets his reaction. Works from any square with a one-move line to him, safe or not. | 100% |
| 2 | **Freeze Ray** | Freeze 1 / 2 / 2 / 3 / ∞ turns (+1 on the KING); 1/1/2/2/1 uses | The only dart that may target the king. Frozen = can't flee: freeze, get on his line (safely), take him. T1 = 2 turns on the king. | 73% (L10; 80% L8, 100% elsewhere) |
| 3 | **Knight Hop** | Knight for 1 / 2 / 3 / 3 / rest of level moves; 1/1/1/2/1 uses | He only fears your *current* form. Stand a knight's jump from him (he ignores you), cast, hop onto him. Also jumps the pen wall. | 87% (L10; 100% elsewhere) |
| 4 | **Bishop Step** | Bishop for 1 / 2 / 3 / 3 / rest; 1/1/1/2/1 uses | Stand on his diagonal (a rook doesn't threaten it), cast, take him. Attacks the diagonal squares he flees to. | 93% |
| 5 | **Queen Pulse** | Queen for 1 / 2 / 2 / 3 / rest; 1/1/2/2/1 uses | Bishop Step + rook lines at once — from a diagonal or a line, cast and take him; his safe squares collapse. | 90% |

### Support (open the pen, remove guards, cut escapes)

| # | Ability | Numbers | Why it catches kings | Worst T1 win % |
|---|---------|---------|----------------------|----------------|
| 6 | **Aegis** | Shield blocks next capture; 1/2/2/3/∞ raises (T3 stuns attacker, T5 kills it) | Take the *defended* key anyway: shield up, capture on his line (stun), eat the hit, take him. | 97% |
| 7 | **Drones** | 1 / 2 / 3 / 4 / 6 mini-rooks; 1/1/2/2/2 uses | Free action before you move. A drone eating a guard = capture-stun; if it clears the key on his file you take him the same turn. Kings are walls to drones, not snacks. | 97% |
| 8 | **Convert** | Steal a pawn / +minor / +queen / any / any; 1/1/2/2/2 uses. **2026-09-06: the stolen piece is a CONTROLLED summon** (Tyler: "they need to be controllable summons") — tap it to move it (that is your body-move for the turn), it moves as its type (a pawn marches toward rank 8, captures diagonally forward), its captures stun him, it MAY take the king, Sacrifice / Swap target it, and it never moves on its own. It is DAZED the turn it is stolen (no move / capture until your next turn), so a guard beside the king is never a same-turn kill. Stealing cures poison / rabies. | The stolen piece is a rainbow body already standing inside his court: its attack squares are squares he won't step on, and it can strike him itself. Steal a room pawn = a cage bar you also get to move. | 77% (L10; 80% L9, ≥97% elsewhere) |
| 9 | **Poison Dart** | Dies in 3 / 3 / 2 / 2 / 1 turns; 1/2/2/3/2 uses | Kill a defender or the key on his line without standing next to it; the death is a capture-stun — be on the line when it lands. | 47% (L10 — the weakest cell; 80% at T4; ≥87% elsewhere) |
| 10 | **Decoy** | Mark 1 / 2 / 2 / 3 / ∞ turns; 1/1/2/2/1 uses | His own guards eat the mark: friendly fire is a capture-stun (2 turns) and it opens the pen from inside. | 97% |
| 11 | **Boulder** | Drop a permanent block of STONE on an empty square (`Hazard.kind: 'stone'` — never lava); 2/2/3/3/∞ per level. T2+: may drop ON an enemy pawn to crush it (counts as a Rookie capture). T4+: each use drops TWO boulders (second placement free; cancel forfeits it) | Seal a pen exit so he has nowhere to flee, or wall off a hunter's line. Blocks everyone (her too — she can never wall herself in: squares that would leave her with no move are not offered). | 53% (L10; ≥87% L3–L9) |
| 12 | **Smoke** | Invisible 1 / 2 / 2 / 3 / 3 enemy turns; 1/1/2/2/1 uses; her own capture ends it early (not at T5) | Nobody hunts her and the king does NOT react to her threats while smoked: walk onto his line in the open, take him next turn. | 70% (L10; ≥80% elsewhere) |
| 13 | **Rewind** | ENEMY-ONLY undo (2026-09-02 redesign): the king and his court step back to where they were before their last turn — Rookie's move, position, captures, tempo and charges all stay ("The king takes it back. You don't."). 1/2/2/2/3 uses; only castable before she acts that turn. T3+: rewinding also stuns the king for the replayed turn. T4+: reaches back TWO enemy turns (per-piece, matched by id; blocked squares keep the one-turn position). T5: every rewound piece is frozen for a turn. Cast clears the snapshot stack — no chaining. | Delete the reply that hurt: the flee you didn't see, the ally that got taken, the pawn that stepped onto your line. Bots enumerate it when the last enemy turn hurt (ally died or Rookie is attacked). | see matrix |
| 14 | **Magnet** | Pull an enemy on her current form's line toward her — the player CHOOSES the pull distance (tap the enemy, then tap the landing square along the line); max 2 / 3 / 3 / any / any squares; 1/1/2/2/2 uses; never the king below T5 — at T5 even the KING can be grabbed, yanked exactly one square | Yank the guard OFF the king's line (or into her range) without moving; a pulled piece next to her is not auto-captured — take it next move for the stun. | 40% (L10; 73–80% L6–L9; 97–100% L3–L5) |
| 15 | **Bodyguard** | Rainbow ROOK ally beside her for 2 / 2 / 3 / 3 / level enemy turns; 1/1/2/2/1 uses | A real piece: blocks a hunter's line, its rook lines are squares the king won't step on, and it captures (capture-stun) — it holds her side and only moves to take something. | 53% (L10; ≥93% elsewhere) |
| 16 | **Squire** (`summon-knight`, flag `SUMMON_KNIGHT_ENABLED`) | Rainbow KNIGHT you control, placed beside her; lasts 6 / 9 / 9 / level / level enemy turns; 1/1/2/2/2 uses; T5 = his move is FREE (move him AND her every turn) | A second body. T1–T4 you move Rookie OR the Squire each turn (his move ticks the budget like hers). He blocks lines, enemies hunt him (captured = gone), the king flees his threat and won't step on his squares, and he CAN take the king. Starter kit while flagged. | 75% (L10; 83% L8–L9, ≥92% elsewhere; bot casts on L5+) |

The v3 five (2026-08-18) were tuned once from the first sweep: Boulder T1 1→2
placements, Magnet T1 pull 1→2, Bodyguard T1 1→2 turns (each lifted L6–L9 by
10–25 pts). **L10 stays the weak cell for every support ability** (Poison Dart
sits at ~50% there too, `none` at 23–50% depending on the seed) — the bot's
rollout policy force-explores casts and reads a bad Magnet pull / Boulder as
progress; treat L10 support numbers as a bot floor, not a design ceiling.

### Dropped from the pool (and why)

- **Squad** — tested first (Tyler's "second piece"); the T1 pawn is fodder for hunters and too slow to reach the pen: 8–58% on L6–L10 even mustering 3 ranks ahead (`seed.ts` keeps the muster-ahead hook on king levels in case it comes back). Aegis took its slot: 93–100% everywhere.
- **Rabies Dart** — 100% everywhere in testing, but it duplicates Decoy's "guards eat their own" job; Decoy is the more legible of the two.
- **Become King** — 92–100%, but it's a defensive walk-through; the pool already had five finishers.

## The five of 2026-09-06 (testing) — mined from the level library

Design doc: `docs/new-abilities-2026-09-06.md` (machine twin
`data/run-playtest/new-ability-proposals.json`). Each is a distinct verb,
one tap, one visible consequence, paying off inside one turn.

| # | Ability | Numbers | Why it catches kings | Proof (T5 bot, 12 trials) |
|---|---------|---------|----------------------|----------------|
| 17 | **Snare** (`snare`) | Trap an empty square; holds the enemy that arrives on it 1 / 2 / 2 / 3 / 3 turns; 1/1/2/2/2 uses. T4+: a guard that springs it is CAPTURED (king stunned 2); the king is only ever held. T5: the trap re-arms. Invisible to the AI; a red X to the player. Springs on a flee step, an approach / push / capture landing, a Magnet pull, a Coup swap — never on Rewind. Boulder may not drop on it. | The boulder trick with the sign flipped: he always runs to the farthest safe square, so let him take it and keep him there. Threaten one square of a 2x2, snare the other, he steps in and goes stiff. | The Vault L5: none 25% → snare 100% |
| 18 | **Shove** (`shove`) | Push a stone beside her one square directly away; 1/2/2/2/unlimited uses. T3+: a pawn it lands on is crushed (Rookie capture, stun). T4+: also stones two squares off on her rook lines. Never into a stone (no chain pushes), never a shove that strands her, never a stone marked `fixed` in the puzzle def, and **never LAVA** — a hazard whose `kind` is `'lava'` is terrain, not a block, and is not offered as a target (2026-09-06). | A sliding-block move: a gap opens where it was, a square dies where it lands. Rolled into his cell it is the boulder trick and the door in one motion. Universal-solvent class — it opens any one-thick wall alone, so terrain runs refuse it with two-thick walls, a piece beyond the stone, or `fixed` stones. | The Keep L5-L7: 0% → 100%; The Parapet L5/L7: 0% → 100%. The Vault L6-L7 stays 0% alone (needs the T3 crush or a pair). |
| 19 | **Coup** (`coup`) | Swap the king with one of his own guards; 1/1/2/2/2 uses. T1 a pawn beside him, T2 any guard beside him, T3-T4 any guard in his room or within 2, T5 any enemy. T4+ the swap stuns him a turn. Markers ride with the pieces; his pen gains the post square. King-win levels only. | The biggest "oh" in the set: his own sentry sits on the throne and he is standing in the doorway — and doorsteps have lines to them. The second beat is a line he cannot step off, a stone, a snare, or a body's cover. | The Alley L6: 0% → 75%. The Millstone L7: none 0 / duchess 0 / coup 0 / coup+duchess 100% (the pair is the point). |
| 20 | **Hourglass** (`hourglass`) | Instant: the enemies take a full turn NOW, her move still in hand; `moveCount` does not tick. **REWORKED 2026-09-06.** One rule: a glass-turn is a turn taken OUT OF ROOKIE'S CLOCK — nothing of hers expires during it (freeze/snare holds, the king's stun, smoke, the straw, decoy, rabies, king-form, summon clocks, a convert daze, the once-per-turn summon move all stand). The ONE counter that still burns is **poison**, because a fuse is a bomb going off, not a protection running out. The king REACTS on a glass-turn exactly as on any enemy turn, at every tier. Tiers are pure quantity: **1/2/3/4/6 uses**, **1/1/1/2/3 casts per turn** (finite on purpose — the cast does not end the turn, so uses are the only bound). Rewind can undo a glass-turn (a free peek). | The only card that lets you WAIT without spending a body-move. **A glass is worth exactly one Rookie move plus the durations that move would have burned** — so it pays only beside a partner whose payoff lands on an ENEMY PHASE (a poison death, a decoy friendly-fire kill), never beside one whose payoff lands on Rookie's own move (snare, scarecrow, freeze-ray: measured neutral-to-negative). Never a solvent: 0% alone on every finale of every run tested, at every tier. Its honest kit role is the perfect TRAP filler. | The Candle (revenge-29) L9: poison-dart alone **13%** -> pair **72-81%** at every glass tier — the one measured cell where the glass is the difference. Same run, decoy alone 47/44/69/31 -> **56/56/91/69** paired. The Hearth (revenge-31): snare 75/63/69/72/44 alone -> 69/63/78/53/38 paired (redundant, not anti). Two runs were built to gate on it and neither did; the template that would is L9's — build the FUSE weak, not the trap. |
| 21 | **Scarecrow** (`scarecrow`) | A straw Rookie on an empty square for 1/2/2/2/3 enemy turns; 1/1/2/2/2 uses. The court and the king plan against a view where the straw IS Rookie (rook-form; a queen from T4) and the real Rookie is an uncapturable blocker. Striking it destroys it and wastes the action (no credit, no stun); T5 the striker dies. One straw at a time; it blocks her and her summons like a body. Outranks a Decoy mark. | His flee is deterministic — farthest safe square from the threat — so a false Rookie is a steering wheel: straw on the line to his square, Rookie on the line to the square he will run to. Hunters charge the straw for a turn. The heaviest mental model of the five (two line sets). | The Glasshouse L3/L4/L5: 17/0/50% → 100/33/100%. The Slash L5: 8% → 92%; L7: none 0 / knight-hop 0 / scarecrow 0 / scarecrow+knight-hop 100%. The Vault L5: 33% → 100%. |

## The ability-first five of 2026-09-19 (testing)

Design doc: `docs/new-abilities-2026-09-19.md`. All five are free actions,
none ever touches the king, and every consequence is tinted on the board
before the tap that commits it (`consequenceTint` in `lib/run/abilities.ts`).
Two terrain rules exist ONLY through these cards: **R1** lava burns what is
forced into it (Puppet), **R2** lava can spread (Eruption).

| # | Ability | Numbers | Why it catches kings | Proof (T5 bot, `five-smoke.ts`, 8 trials) |
|---|---------|---------|----------------------|----------------|
| A1 | **Promote** (`promote`) | Tap a controlled summon: it climbs pawn, knight, bishop, rook, queen. One rung at T1-T2; UP TO two at T3-T4 and any rung up to queen at T5 — the player chooses (tap the summon, then pick the rung in the red panel; nothing is spent until the pick). 1/1/2/2/2 uses. Only the type changes — clock, daze and source stand. A queen (Duchess, Dragon) is not a target. | The body is already in his court; change what it attacks and take him this turn. | none 0% → 100%, cast 100% |
| A2 | **Puppet** (`puppet`) | Two taps: a guard, then one of ITS OWN non-capturing moves. T1-T3 the first piece on her current form's lines (Magnet's lines, distance 1 allowed); T4 also any guard within 3; T5 any guard. R1: the first lava square along a move is a destination and kills it (capture, stun, tempo). T3+: it may take its own side. 1/1/2/2/2 uses. Markers ride with it; a snare it lands on springs. | Pull the guard off his line, walk the defender off the key, burn the sentry beside the moat. | none 0% → 100%, cast 100% |
| A3 | **Raise** (`raise`) | Tap a free square beside her (never one whose body would leave her with no legal move): the LAST piece credited to her side stands there — source `raise`, controlled, dazed this turn, 6/9/9/level/level enemy turns; 1/1/2/2/2 uses. T1-T2 lift a pawn, knight or bishop; T3+ a queen too. The rack's status line shows the grave. | The level decides the summon: eat the bishop, get a bishop. | none 0% → 100%, cast 100% |
| A4 | **Eruption** (`eruption`) | Two taps: lava within 2/2/3/3/any of her, then a tinted neighbour. Every tier floods the ONE square tapped; T3+ may instead tap the vent again to flood all four orthogonal neighbours at once. Open ground becomes lava; a pawn (T2+ knight/bishop, T4+ any guard) burns = capture, stun. Never the king's, hers, a summon's, a snare's square, never a flood that strands her. 1/2/2/3/3 uses. | The boulder trick in lava: delete his flee square or burn the key guard, only where the level has lava. | none 0% → 100%, cast 100% |
| A5 | **Chain** (`chain`) | Instant: armed until the end of this turn. The next capturing MOVE by Rookie or a controlled summon also kills every guard of the victim's family in its 8-neighbourhood, and theirs, 2/3/4/any/any links deep. T3+ pawn = knight; T5 any guard. Never the king. 1/1/2/2/2 uses. Only castable when a chain is on offer. | The defended pawn chain becomes a fuse: kill the head, the tail on his line goes with it, he is stunned. | none 0% → 100%, cast 100% |

**Decisions where the spec was open (2026-09-19 build):**

- *Promote / Puppet T2* change nothing but the card (the spec gives T1 and T2
  the same rule and the same single use). The upgrade note says so honestly.
- *Puppet lines* are Magnet's: rook / bishop / queen form, anything else falls
  back to her rook lines — but a guard touching her IS a target. A guard with
  no legal destination is not a target. A pawn is never walked onto rank 1 (no
  promotion by puppet). It never captures Rookie or anything of hers.
- *Raise is a targeted card* (the spec says "instant" and "tap the spawn
  square"; the tap wins). The grave is READ from `captures` (last entry at or
  after `graveFloor`), so every credited kill counts — her own capture, a
  summon's, a crush, a burn, a poison death — and a cast moves the floor, so
  a second Raise needs a fresh capture. If the last capture is too big for the
  tier, the card is dead until the next one. Several raised bodies may coexist.
- *Eruption is two taps at every tier* so the flood is tinted before it is
  committed. A guard too big to burn keeps its square dry. A tinted square
  floods that square alone at EVERY tier; at T3+ the picked vent stays ringed
  and tapping it again floods them all. A flood-all that would strand her is
  not offered; the safe single squares still are.
- *An upgrade never removes the function (fix, 2026-09-19).* Promote T3+ used
  to FORCE two rungs (pawn to bishop, skipping the knight — and on revenge-53
  the knight is the card: `convert:1+promote:3` read 0/0/0/0 on L7-L10).
  Eruption T3+ used to be all-or-nothing. Both are now "up to": the T1 play is
  always still there. Bots enumerate every rung / every single square plus the
  flood-all.
- *Raise strand check (fix, 2026-09-19).* `raiseSpawnSquares` runs the Boulder
  self-lock check: in a one-wide dead end (Rookie h6, h5 her only exit) the
  dazed body on h5 left her zero legal moves and no loss. That square is no
  longer offered.
- *Chain fires on capturing MOVES only* (Rookie's, or a controlled summon's).
  Card kills (Boulder crush, a Puppet burn, a Sacrifice blast) neither spend
  nor spread the arm. The arm is spent by the next capture even when nothing
  was linked. It holds through a glass-turn and is cleared when the enemy
  phase ends. It cannot be un-tapped.
- *Rewind*: the snapshot is the whole state, so `graveFloor`, a raised body
  and a promoted type ride in it like a Converted piece does. A Chain armed
  THIS turn is carried forward (her own live effect); a stale arm inside a
  snapshot is never restored.
- *No new VFX kinds*: Promote / Raise reuse the summon bloom, Puppet the Magnet
  streak, Eruption the Boulder thud, Chain the Convert swirl. Art is borrowed
  (`PLACEHOLDER_ART`).

## The level-first five of 2026-09-19 (testing) — each invented for a crazy level

Design doc: `docs/new-abilities-2026-09-19.md`. Code: the "LEVEL-FIRST FIVE"
block in `lib/run/abilities.ts` (Ricochet's line logic is `ricochetPaths` in
`lib/run/movement.ts`). Tests: `lib/run/__tests__/level-first-five.test.ts`.
Bot smoke: `npx tsx scripts/run-playtest/level-first-smoke.ts`.

Two terrain rules arrive with them and exist ONLY through these cards:
**R3** a stone that slides or lands into lava — both vanish, open ground (a
ford); **R4** stone is a mirror for Ricochet, lava is not.

| # | Ability | Numbers | Why it catches kings | Smoke (T5 bot, 8 trials, hand-built miniature) |
|---|---------|---------|----------------------|----------------|
| 22 | **Castle** (`castle`) | She shares his rank (T2+: or file), ANYTHING between, 3+ squares apart: he jumps two toward her (his landing must be open ground; anything may lie between). She lands on the square he crossed IF it is open ground (the chess move); OTHERWISE she pulls up short, onto the square directly beside his landing on HER side of the line (open ground, or the square she already stands on at distance 3); neither = the cast is refused. Both landings glow before commit. **Her body-move — the turn ends.** Rook form only. 1/1/2/2/2 uses; T4+ he lands stunned a turn. Pen: unchanged if he lands inside it, otherwise it BECOMES his landing square plus its open neighbours. | She is a rook, he is a king: rules are rules. It crosses any wall, moat or guard line in one move and drops her beside him. **A castled king does not swing at her on the enemy phase that follows** (`kingCastled`, the one exception to "touching the king means he takes a swing", one phase only) — he runs if he has a safe square, which is why the card wants a partner watching those squares. | The Atoll: none 0/8, castle:1 0/8 (never cast — alone it is a trap), castle:4 8/8. The Islet (1-square island, 1-thick ring — the short landing): none 0/8, castle:4 8/8 |
| 23 | **Catapult** (`catapult`) | Two taps: a LOOSE stone or a controlled summon orthogonally beside her, then a landing square straight away from her, over anything, 2-4 / 2-4 / 2-5 / 2-5 / any squares from where it sat. 1/2/2/3/3 uses. Stone: lands as stone; T2+ crushes a pawn (Rookie capture); in lava it makes a ford (R3). Summon: lands exactly as it was (dazed stays dazed). Never the king, never `fixed` stone, never lava, never a throw that strands her. Free action. | Bodies and blocks cross terrain she cannot: ford the river, drop a lid on his flee square, fling a Converted pawn into his court and Sacrifice it. | The Gorge: none 0/8, catapult:1 8/8 |
| 24 | **Mirror** (`mirror`) | Tap the card, then the one glowing square (file 9 - f, same rank, must be empty ground). A rainbow rook appears there and copies each of HER moves flipped left-right, free: a line move slides as far as it legally can (stops at a block, captures the first enemy it meets, the king included); a knight-form hop is copied as a hop; a banked Ricochet move and a Castle are not copied. Lasts 3/4/5/6/level of her moves; 1 use (T4+: 2). Never tap-moved. It is a controlled summon for Swap / Sacrifice / Promote; enemies may capture it. | One input, two bodies — the asymmetry in the level is the puzzle. The king will not step onto its rook lines and flees a square it could land on after one of her legal moves. Swap teleports her across the axis. | The Looking Glass: none 0/8, mirror:1 8/8 |
| 25 | **Ricochet** (`ricochet`) | Instant: her NEXT rook move may bank once (T3+: twice) — slide to the square before a stone, turn left or right, keep sliding; capture at the end, the king included. Every banked line is drawn on the board while armed. Lava, pieces, summons and the board edge never bank. Each leg must slide at least one square. Rook form only; spent by her next rook-form move, banked or not. Refused when no banked line exists (a charge is never armed into thin air). 1/1/2/2/3 uses. | He only fears her straight lines (the banked squares exist on HER turn only), so a banked line is a line he does not see coming. Boulder places the rail. | The Baffle: none 0/8, ricochet:1 8/8 |
| 26 | **Avalanche** (`avalanche`) | Two taps: a loose stone, then the square beside it — that names N/S/E/W, and arrows show where EVERY stone lands for each direction first. Every LOOSE stone (not `fixed`, not lava) slides one square that way, far side first. Pawns in the way are crushed (T3+: knights and bishops too; never a queen or the king). Never onto the king, Rookie, a summon, a drone, the straw or a snare. Into lava: a ford (R3). T4+: the whole slide runs twice. A direction that moves nothing or strands her is not offered. 1/1/2/2/2 uses. Free action. | A board-wide Shove that needs no adjacency — lids drop on his flee squares, doors open in walls, fords appear, all in one motion. Authors control it with `fixed`. | The Scree: none 0/8, avalanche:1 8/8 |

**Mirror is taught on the board (2026-09-19, after Tyler's playtest: "i don't
get it" -> "omg that's sooo cool").** Rules unchanged; all of it reads the
engine (`mirrorEchoMoves` / `mirrorRefusal`, built on `mirrorEchoLanding`, the
geometry `applyMirrorEcho` resolves with), never its own geometry:
- Echo up + Rookie selected: a rainbow pip on each of HER destinations that
  makes the reflection capture; a pulsing gold crown badge + gold ring when it
  takes the king, and that move's slide line, ghost rook and "Takes the king"
  chip are drawn without hover (touch). Hover any destination (mouse) to see
  the ghost echo, its slide and its victim; "Stays put" when it cannot move.
- Card refused because the mirror square is not empty ground: the rack status
  line says "No room for a reflection there." and the square gets a faint
  crossed ring. Echo up: the status line reads "Reflection · N moves".
- Self-lock (2026-09-20): like Boulder / Raise / Eruption / Catapult, a cast
  whose echo would leave HER with no legal move is refused (`mirrorTargets` is
  empty); the status line says "A reflection there would box you in." and the
  square gets the same crossed ring.
- Card armed: the mirror square is ringed violet and a dashed axis runs
  between the d and e files.
- Copy leads with the rule: "A reflection appears across the board. Every move
  you make, it makes flipped."

**Where the two fives meet (merge, 2026-09-19):** Promote may tap a Mirror
echo (it stays an echo — only its type, so its Sacrifice blast, changes) and a
Raised piece. An armed Chain that her own move did not spend fires on the
echo's capture (tinted by `chainPreview`). Catapult flings a Raised piece like
any controlled summon. Tests: `lib/run/__tests__/ten-cross-cards.test.ts`.
The Ability Lab has a room for each five: L4 Caldera (ability-first), L5
Quarry (level-first).

Rewind: the enemy-phase snapshot is a whole-board copy, so the echo, moved
stones and a castled pen are all in it. A Ricochet armed (or a Mirror cast)
AFTER the snapshot is carried forward from the live state, like a transform.
