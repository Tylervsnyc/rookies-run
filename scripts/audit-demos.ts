/**
 * Audit every ability demo against the REAL engine: replay each script's taps
 * with no timing, stepping the enemy/ally phases exactly as the app does, and
 * report any tap the engine refuses or any Rookie move that isn't legal.
 *
 * Run: npx tsx scripts/audit-demos.ts [abilityId]
 */
import { DEMOS, owned, tapSquare } from '../components/run/AbilityDemo';
import { applyAbilityActivate, controlledAllyAt, ABILITY_DEFS } from '../lib/run/abilities';
import { applyRookieMove, stepEnemyTurn } from '../lib/run/engine';
import { stepAllyTurnReactive } from '../lib/run/pawn-ai';
import { isLegalRookieMove } from '../lib/run/movement';
import { puzzleToBoardState } from '../lib/run/seed';
import { fromSquare, toSquare, type BoardState } from '../lib/run/types';

const only = process.argv[2];
let bad = 0;

function settle(s: BoardState): BoardState {
  let cur = s;
  for (let i = 0; i < 40; i++) {
    if (cur.status !== 'playing') return cur;
    if (cur.turn === 'enemy') cur = stepEnemyTurn(cur);
    else if (cur.turn === 'allies') cur = stepAllyTurnReactive(cur);
    else if (cur.turn === 'drones') break;
    else return cur;
  }
  return cur;
}

for (const [id, demo] of Object.entries(DEMOS)) {
  if (only && id !== only) continue;
  const lines: string[] = [];
  let state: BoardState = {
    ...puzzleToBoardState(demo!.puzzle),
    rookie: fromSquare(demo!.rookie),
    abilities: owned(demo!.kit),
  };
  let selected: string | null = null;
  let failed = 0;
  for (const action of demo!.script) {
    if ('hold' in action) { state = settle(state); continue; }
    state = settle(state);
    if (state.status !== 'playing') { lines.push(`  (level ${state.status} — later steps skipped)`); break; }
    if ('card' in action) {
      const next = applyAbilityActivate(state, action.card);
      if (next === state) { lines.push(`  FAIL card ${action.card}: engine refused`); failed++; }
      else lines.push(`  card ${action.card} -> ${next.activeAbility ? `armed (${next.activeAbility.step})` : `resolved, form=${next.form}, turn=${next.turn}`}`);
      state = next; selected = null;
      continue;
    }
    const sq = action.tap;
    const coord = fromSquare(sq);
    const rookieSq = toSquare(state.rookie);
    const isSelect = sq === rookieSq || !!controlledAllyAt(state, coord) || (selected && controlledAllyAt(state, fromSquare(selected)));
    if (!state.activeAbility && !isSelect && !isLegalRookieMove(state, coord)) {
      lines.push(`  FAIL tap ${sq}: not a legal Rookie move from ${rookieSq} (form ${state.form})`); failed++;
    }
    const before = state;
    const res = tapSquare(state, sq, selected);
    if (res.state === before && res.selected === selected) { lines.push(`  FAIL tap ${sq}: nothing happened`); failed++; }
    else if (res.state !== before) {
      const what = before.activeAbility ? `${before.activeAbility.id} -> ${sq}` : `move/act -> ${sq}`;
      lines.push(`  tap ${sq}: ${what} (rookie ${toSquare(res.state.rookie)}, turn ${res.state.turn}, enemies ${res.state.pieces.length}, allies ${res.state.allies.length})`);
    } else lines.push(`  tap ${sq}: selected`);
    state = res.state; selected = res.selected;
  }
  state = settle(state);
  // A demo that ends with Rookie captured teaches the wrong thing.
  if (state.status === 'lost') { lines.push('  FAIL Rookie was captured — the demo ends in a loss'); failed++; }
  const verdict = failed === 0 ? 'OK ' : `${failed} PROBLEM(S)`;
  console.log(`${verdict} ${id}  [${ABILITY_DEFS[id as keyof typeof ABILITY_DEFS].name}] end: rookie ${toSquare(state.rookie)}, enemies ${state.pieces.length}, status ${state.status}`);
  if (failed || process.env.VERBOSE) lines.forEach((l) => console.log(l));
  if (failed) bad++;
}
console.log(bad === 0 ? '\nALL DEMOS CLEAN' : `\n${bad} demo(s) need fixing`);
