'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { RunBoard } from '@/components/run/Board';
import { REVENGE_RED } from '@/components/run/RookiesRevengeLogo';
import { puzzleToBoardState } from '@/lib/run/seed';
import { fromSquare, toSquare, type BoardState, type RunPuzzle } from '@/lib/run/types';

/**
 * DemoBoard — the REAL RunBoard, driven by a scripted loop instead of a
 * player. Shows off the game on the home screen: freeze ray, poison dart, a
 * summoned knight, Rookie closing in, the poisoned piece dying, the King
 * fleeing inside his pen — with the red bullseye locked on him the whole time.
 * Pure state mutations + the board's own VFX; nothing here is faked art.
 */

const PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 2, rank: 2 },
  pieces: [
    { type: 'king', color: 'black', file: 7, rank: 8 },
    { type: 'pawn', color: 'black', file: 6, rank: 7 },
    { type: 'pawn', color: 'black', file: 7, rank: 7 },
    { type: 'pawn', color: 'black', file: 8, rank: 7 },
    { type: 'bishop', color: 'black', file: 5, rank: 7 },
    { type: 'knight', color: 'black', file: 3, rank: 6 },
    { type: 'knight', color: 'black', file: 5, rank: 4 },
    { type: 'pawn', color: 'black', file: 4, rank: 5 },
  ],
  winCondition: 'king',
  kingBehavior: 'flee',
  kingPen: ['g8', 'h8', 'f8'],
};

type Step = { at: number; apply: (s: BoardState) => BoardState; fx?: (id: number) => Fx };
type Fx = NonNullable<BoardState['lastAbilityFx']>;
type PoisonFx = { deaths: { square: string; pieceType: 'pawn' | 'knight' | 'bishop' | 'queen' | 'king' }[]; id: number };

function base(): BoardState {
  const s = puzzleToBoardState(PUZZLE);
  return { ...s, rookie: { file: 2, rank: 2 } };
}

function movePiece(s: BoardState, from: string, to: string): BoardState {
  const f = fromSquare(from);
  const t = fromSquare(to);
  return { ...s, pieces: s.pieces.map((p) => (p.file === f.file && p.rank === f.rank ? { ...p, file: t.file, rank: t.rank } : p)) };
}

// The loop. Times in ms from loop start.
const SCRIPT: Step[] = [
  { at: 1200, apply: (s) => s, fx: (id) => ({ kind: 'freeze-ray', from: 'b2', to: 'e4', id }) },
  { at: 1800, apply: (s) => ({ ...s, frozenSquares: ['e4'], frozenTurnsLeft: { e4: 2 } }) },
  { at: 3200, apply: (s) => s, fx: (id) => ({ kind: 'poison-dart', from: 'b2', to: 'c6', id }) },
  { at: 3800, apply: (s) => ({ ...s, poisonedSquares: ['c6'], poisonedTurnsLeft: { c6: 2 } }) },
  { at: 5200, apply: (s) => s, fx: (id) => ({ kind: 'summon-knight', from: 'b2', to: 'd3', id }) },
  { at: 5600, apply: (s) => ({ ...s, allies: [{ id: 1, type: 'knight', file: 4, rank: 3, source: 'squire' }] }) },
  { at: 6800, apply: (s) => ({ ...s, rookie: { file: 2, rank: 6 }, moveCount: 1 }) },
  { at: 7900, apply: (s) => movePiece(s, 'g8', 'h8') },
  { at: 8600, apply: (s) => ({ ...s, allies: s.allies.map((a) => ({ ...a, file: 5, rank: 5 })) }) },
  { at: 9600, apply: (s) => ({ ...s, pieces: s.pieces.filter((p) => toSquare(p) !== 'c6'), poisonedSquares: [], poisonedTurnsLeft: {} }) },
  { at: 11000, apply: (s) => ({ ...s, rookie: { file: 2, rank: 8 }, moveCount: 2 }) },
  { at: 12000, apply: (s) => movePiece(s, 'h8', 'g8') },
  { at: 13600, apply: (s) => ({ ...s, rookie: { file: 6, rank: 8 }, moveCount: 3, pieces: s.pieces.filter((p) => toSquare(p) !== 'e7') }) },
];
const LOOP_MS = 16000;

/** `paused` freezes the loop (the home screen flips the board over — nothing should keep moving behind the card). */
export function DemoBoard({ reticle = true, paused = false }: { reticle?: boolean; paused?: boolean }) {
  const [state, setState] = useState<BoardState>(() => base());
  const [fx, setFx] = useState<Fx | null>(null);
  const [poisonFx, setPoisonFx] = useState<PoisonFx | null>(null);
  const idRef = useRef(1);

  useEffect(() => {
    if (paused) return;
    let cancelled = false;
    const timers: number[] = [];
    const run = () => {
      if (cancelled) return;
      setState(base());
      setFx(null);
      for (const step of SCRIPT) {
        timers.push(window.setTimeout(() => {
          if (cancelled) return;
          if (step.fx) setFx(step.fx(idRef.current++));
          setState((s) => step.apply(s));
          if (step.at === 9600) setPoisonFx({ deaths: [{ square: 'c6', pieceType: 'knight' }], id: idRef.current++ });
        }, step.at));
      }
      timers.push(window.setTimeout(run, LOOP_MS));
    };
    run();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [paused]);

  const king = useMemo(() => state.pieces.find((p) => p.type === 'king'), [state.pieces]);

  return (
    <div className="relative w-full">
      <RunBoard
        state={state}
        selectedSquare={null}
        abilityFx={fx}
        poisonDeathFx={poisonFx}
        onSquareClick={() => {}}
        onPieceDrop={() => false}
        slideMs={420}
      />
      {reticle && king && (
        <div
          aria-hidden
          className={`absolute pointer-events-none ${paused ? '' : 'rr-lock'}`}
          style={{
            left: `${(king.file - 1) * 12.5}%`,
            top: `${(8 - king.rank) * 12.5}%`,
            width: '12.5%',
            height: '12.5%',
            transition: 'left 420ms cubic-bezier(.22,1,.36,1), top 420ms cubic-bezier(.22,1,.36,1)',
            zIndex: 40,
          }}
        >
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', left: '-34%', top: '-34%', width: '168%', height: '168%', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.9)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} aria-hidden>
            <circle cx="50" cy="50" r="42" fill="none" stroke={REVENGE_RED} strokeWidth="6" />
            <circle cx="50" cy="50" r="27" fill="none" stroke={REVENGE_RED} strokeWidth="3.5" opacity="0.7" />
            <circle cx="50" cy="50" r="4" fill={REVENGE_RED} />
            {[0, 90, 180, 270].map((d) => <line key={d} x1="50" y1="2" x2="50" y2="14" stroke={REVENGE_RED} strokeWidth="6" strokeLinecap="round" transform={`rotate(${d} 50 50)`} />)}
          </svg>
        </div>
      )}
      <style>{`
        @keyframes rr-lock { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: .8; } }
        .rr-lock > svg { animation: rr-lock 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .rr-lock > svg { animation: none; } }
      `}</style>
    </div>
  );
}
