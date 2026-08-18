# Rookie's Revenge — the king-catching abilities (v3: 15 in the pool)

Hidden run `revenge-1` (`/?run=revenge-1`). Win condition: **capture the
enemy king**. A lone rook can never catch a fleeing king — abilities are the point.

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
| 8 | **Convert** | Flip a pawn / +minor / +queen / any / any; 1/1/2/2/2 uses | The converted piece is a rainbow ally: it blocks his squares, its attacks are squares he won't step on, and its captures stun him. Flip a room pawn = a wall inside his pen. | 77% (L10; 80% L9, ≥97% elsewhere) |
| 9 | **Poison Dart** | Dies in 3 / 3 / 2 / 2 / 1 turns; 1/2/2/3/2 uses | Kill a defender or the key on his line without standing next to it; the death is a capture-stun — be on the line when it lands. | 47% (L10 — the weakest cell; 80% at T4; ≥87% elsewhere) |
| 10 | **Decoy** | Mark 1 / 2 / 2 / 3 / ∞ turns; 1/1/2/2/1 uses | His own guards eat the mark: friendly fire is a capture-stun (2 turns) and it opens the pen from inside. | 97% |
| 11 | **Boulder** | Drop a permanent hazard on an empty square; 2/2/3/3/∞ per level | Seal a pen exit so he has nowhere to flee, or wall off a hunter's line. Blocks everyone (her too — she can never wall herself in: squares that would leave her with no move are not offered). | 53% (L10; ≥87% L3–L9) |
| 12 | **Smoke** | Invisible 1 / 2 / 2 / 3 / 3 enemy turns; 1/1/2/2/1 uses; her own capture ends it early (not at T5) | Nobody hunts her and the king does NOT react to her threats while smoked: walk onto his line in the open, take him next turn. | 70% (L10; ≥80% elsewhere) |
| 13 | **Rewind** | Undo the last full turn (her move + the enemy reply); 1/1/2/2/3 uses; charges stay spent, tempo stays | A take-back for the flee you didn't see. Bots never cast it (harness has no "that went badly" signal) so its column = `none`. | n/a (bots skip it) |
| 14 | **Magnet** | Pull an enemy on her current form's line 2 / 3 / 3 / any / any squares toward her; 1/1/2/2/2 uses; never the king | Yank the guard OFF the king's line (or into her range) without moving; a pulled piece next to her is not auto-captured — take it next move for the stun. | 40% (L10; 73–80% L6–L9; 97–100% L3–L5) |
| 15 | **Bodyguard** | Rainbow ROOK ally beside her for 2 / 2 / 3 / 3 / level enemy turns; 1/1/2/2/1 uses | A real piece: blocks a hunter's line, its rook lines are squares the king won't step on, and it captures (capture-stun) — it holds her side and only moves to take something. | 53% (L10; ≥93% elsewhere) |

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
