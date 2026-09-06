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
| 20 | **Hourglass** (`hourglass`) | Instant: the enemies take a full turn now, her move still in hand; the clock does not tick. 1/2/2/2/3 uses, one cast per turn below T5. T3+ the king stands still through it; T4+ summon clocks do not run; T5 unlimited per turn. Every other counter ticks once. The daze on a converted piece never clears on a glass-turn. Rewind can undo a glass-turn (a free peek). | The first card that lets you WAIT without spending a body-move: a poison death lands and stuns him with your move to come, a decoy gets eaten now, a pawn walks off its post, a hunter walks onto your line. Weakest tap-to-consequence of the five; it needs a fuse on the board. | The Briar L4: poison-dart 92% → hourglass+poison-dart 100%; elsewhere unchanged (the dart alone already solves Moat L9 / Alley L7 / Briar L5). Needs a designed fuse level to show its number. |
| 21 | **Scarecrow** (`scarecrow`) | A straw Rookie on an empty square for 1/2/2/2/3 enemy turns; 1/1/2/2/2 uses. The court and the king plan against a view where the straw IS Rookie (rook-form; a queen from T4) and the real Rookie is an uncapturable blocker. Striking it destroys it and wastes the action (no credit, no stun); T5 the striker dies. One straw at a time; it blocks her and her summons like a body. Outranks a Decoy mark. | His flee is deterministic — farthest safe square from the threat — so a false Rookie is a steering wheel: straw on the line to his square, Rookie on the line to the square he will run to. Hunters charge the straw for a turn. The heaviest mental model of the five (two line sets). | The Glasshouse L3/L4/L5: 17/0/50% → 100/33/100%. The Slash L5: 8% → 92%; L7: none 0 / knight-hop 0 / scarecrow 0 / scarecrow+knight-hop 100%. The Vault L5: 33% → 100%. |
