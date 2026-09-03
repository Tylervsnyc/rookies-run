/**
 * Build the home-screen board loop from a REAL run (Tyler 2026-09-03: "the
 * board animation on the landing screen doesn't really make sense, take some
 * of my gameplay and put it up there instead").
 *
 * Source: Tyler's Dead Bolt (revenge-11) win, level 10, 2026-09-03 15:16 UTC
 * (run_traces 875534a3). Rookie d1→d3→d6→g6, Knight Hop g6→h8 takes the king.
 * The moves are re-played through the real engine so every frame is a real
 * BoardState; RunBoard on the home screen just steps through them.
 *
 * Run: npx tsx scripts/build-home-replay.ts  → public/run/home-replay.json
 */
import { writeFileSync } from 'node:fs';
import { puzzleForDate, puzzleToBoardState } from '../lib/run/seed';
import { applyRookieMove, stepEnemyTurn } from '../lib/run/engine';
import { applyAbilityActivate } from '../lib/run/abilities';
import { fromSquare, type BoardState } from '../lib/run/types';

const ISO = '2026-09-03';
const RUN = 'revenge-11';
const LEVEL_INDEX = 9;
const START = 'd1';
const MOVES: Array<{ to: string; hop?: boolean }> = [
  { to: 'd3' },
  { to: 'd6' },
  { to: 'g6' },
  { to: 'h8', hop: true },
];

interface Frame {
  state: BoardState;
  /** ms to hold this frame before the next. */
  hold: number;
  /** Optional cast VFX the board should play on this frame. */
  fx?: { kind: 'knight-hop'; from: string; to: string };
}

function settleEnemy(s: BoardState, frames: Frame[]): BoardState {
  let guard = 0;
  while (s.turn === 'enemy' && s.status === 'playing' && guard++ < 20) {
    const next = stepEnemyTurn(s);
    if (next === s) break;
    s = next;
    frames.push({ state: s, hold: 700 });
  }
  return s;
}

function main() {
  const puzzle = puzzleForDate(ISO, LEVEL_INDEX, RUN);
  let s = puzzleToBoardState(puzzle, {
    runId: RUN,
    aiRngSeed: 1,
    difficulty: 'normal',
    abilities: [{ id: 'knight-hop', tier: 1, mutations: [], usesLeftThisLevel: 1 }],
  });
  s = { ...s, rookie: fromSquare(START) };
  const frames: Frame[] = [{ state: s, hold: 1400 }];

  for (const m of MOVES) {
    const target = fromSquare(m.to);
    const from = `${String.fromCharCode(96 + s.rookie.file)}${s.rookie.rank}`;
    if (m.hop) {
      // Knight Hop is a form change: Rookie becomes a knight, then moves normally.
      s = applyAbilityActivate(s, 'knight-hop');
      frames.push({ state: s, hold: 900 });
      const moved = applyRookieMove(s, target);
      if (moved === s) throw new Error(`Knight Hop to ${m.to} was not legal`);
      s = moved;
      frames.push({ state: s, hold: 1600, fx: { kind: 'knight-hop', from, to: m.to } });
    } else {
      const moved = applyRookieMove(s, target);
      if (moved === s) throw new Error(`Rookie move ${from}→${m.to} was not legal (turn=${s.turn}, status=${s.status})`);
      s = moved;
      frames.push({ state: s, hold: 1000 });
    }
    s = settleEnemy(s, frames);
  }
  if (s.status !== 'won') throw new Error(`Replay did not end in a win (status=${s.status})`);
  // Linger on the capture before the loop restarts.
  frames[frames.length - 1].hold = 2600;

  const out = { source: 'Tyler · Dead Bolt L10 · 2026-09-03', iso: ISO, runId: RUN, frames };
  writeFileSync('public/run/home-replay.json', JSON.stringify(out));
  console.log(`wrote ${frames.length} frames; final status ${s.status}; captures ${s.captures.length}`);
}

main();
