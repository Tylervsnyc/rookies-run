'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultPieces } from 'react-chessboard';
import { ChessPathBoard } from '@/components/board/ChessPathBoard';
import { RunBoard } from '@/components/run/Board';
import { RookieCell } from '@/components/run/RookieCell';
import { RookiesRunLogo } from '@/components/run/RookiesRunLogo';
import { trackEvent } from '@/lib/analytics/posthog';
import { applyRookieMove } from '@/lib/run/engine';
import { puzzleToBoardState } from '@/lib/run/seed';
import { fromSquare, toSquare } from '@/lib/run/types';
import type { BoardState, RunPuzzle } from '@/lib/run/types';
import { playCaptureSound, playMoveSound } from '@/lib/sounds';
import { haptic, hapticSuccess } from '@/lib/haptics';

/**
 * StoryOnboarding — first-run story tutorial, shown ONCE before the daily
 * intro card (RunLanding).
 *
 * Story: White lost. Rookie never gave up. Now she has to escape the board —
 * and destroy anyone in her way.
 *
 * Beat 1  — full starting position; White's king tips over, every white
 *           piece fades out except the a1 rook (Rookie).
 * Beat 2  — Rookie + the black army; the 8th rank glows (the exit).
 * Beat 3  — interactive: Rookie on a1, two black pawns; capture one.
 *
 * Beats 1-2 render a static ChessPathBoard (the run board can't hold white
 * pieces or black kings/rooks). Beat 3 reuses the real RunBoard + engine.
 */

export const ONBOARDING_KEY = 'rookies-run-onboarded';

interface StoryOnboardingProps {
  onDone: () => void;
}

// Beat 1 fade timeline (ms).
const KING_TIP_AT = 700;
const FADE_AT = 1500;
const FADE_MS = 1500;

const WHITE_BACK = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R2'];
const BLACK_BACK = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// Same golden goal-row gradient the run board uses for rank 8.
const GOAL_GRADIENT =
  'linear-gradient(180deg, #fff1b8 0%, #ffd56a 45%, #e89c1a 100%)';

type Pos = Record<string, { pieceType: string }>;

function fullStartPosition(): Pos {
  const pos: Pos = {};
  FILES.forEach((f, i) => {
    pos[`${f}1`] = { pieceType: `w${WHITE_BACK[i]}` };
    pos[`${f}2`] = { pieceType: 'wP' };
    pos[`${f}7`] = { pieceType: 'bP' };
    pos[`${f}8`] = { pieceType: `b${BLACK_BACK[i]}` };
  });
  return pos;
}

/** Beat 2: only Rookie (a1) + the black army. */
function survivorsPosition(): Pos {
  const pos: Pos = {};
  FILES.forEach((f, i) => {
    pos[`${f}7`] = { pieceType: 'bP' };
    pos[`${f}8`] = { pieceType: `b${BLACK_BACK[i]}` };
  });
  pos.a1 = { pieceType: 'wR' };
  return pos;
}

/** Every white square except a1 — these fade out in beat 1. */
const FADING_SQUARES = FILES.flatMap((f) => [`${f}1`, `${f}2`]).filter(
  (sq) => sq !== 'a1' && sq !== 'e1',
);

const TUTORIAL_PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 1, rank: 1 },
  pieces: [
    { type: 'pawn', color: 'black', file: 1, rank: 4 },
    { type: 'pawn', color: 'black', file: 3, rank: 1 },
  ],
};

function tutorialState(): BoardState {
  return puzzleToBoardState(TUTORIAL_PUZZLE, { runId: 'onboarding' });
}

export function StoryOnboarding({ onDone }: StoryOnboardingProps) {
  const [beat, setBeat] = useState<1 | 2 | 3>(1);
  // Beat 1 animation phase: 0 = full board, 1 = king tipped, 2 = fading.
  const [phase, setPhase] = useState(0);
  const [captured, setCaptured] = useState(false);
  const [state, setState] = useState<BoardState>(() => tutorialState());
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    trackEvent('run_onboarding_seen');
  }, []);

  useEffect(() => {
    if (beat !== 1) return;
    const t1 = setTimeout(() => setPhase(1), KING_TIP_AT);
    const t2 = setTimeout(() => setPhase(2), FADE_AT);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [beat]);

  const finish = useCallback(
    (how: 'completed' | 'skipped') => {
      try {
        localStorage.setItem(ONBOARDING_KEY, '1');
      } catch {
        /* private mode — fine */
      }
      if (how === 'skipped') trackEvent('run_onboarding_skipped', { beat });
      else trackEvent('run_onboarding_completed');
      onDone();
    },
    [beat, onDone],
  );

  const next = useCallback(() => {
    haptic('light');
    if (beat === 1) setBeat(2);
    else if (beat === 2) setBeat(3);
  }, [beat]);

  // ---- Beat 3 interaction --------------------------------------------------
  const tryMove = useCallback(
    (targetSq: string): boolean => {
      if (captured) return false;
      const target = fromSquare(targetSq);
      const wasCapture = state.pieces.some(
        (p) => p.file === target.file && p.rank === target.rank,
      );
      const nextState = applyRookieMove(state, target);
      if (nextState === state) return false;
      // Enemies never get a turn in the tutorial — hand control straight back.
      setState({ ...nextState, turn: 'rookie' });
      setSelected(null);
      if (wasCapture) {
        void playCaptureSound();
        hapticSuccess();
        setCaptured(true);
      } else {
        void playMoveSound();
        haptic('light');
      }
      return true;
    },
    [captured, state],
  );

  const onSquareClick = useCallback(
    (square: string) => {
      if (captured) return;
      const rookieSq = toSquare(state.rookie);
      if (square === rookieSq) {
        setSelected((s) => (s === rookieSq ? null : rookieSq));
        return;
      }
      if (selected) {
        if (!tryMove(square)) setSelected(null);
      }
    },
    [captured, selected, state.rookie, tryMove],
  );

  const onPieceDrop = useCallback(
    (_from: string, to: string) => tryMove(to),
    [tryMove],
  );

  // ---- Static board (beats 1-2) ---------------------------------------------
  const staticPosition = useMemo(
    () => (beat === 1 ? fullStartPosition() : survivorsPosition()),
    [beat],
  );
  const staticPieces = useMemo(
    () => ({
      ...defaultPieces,
      // a1 rook = Rookie; h1 rook keeps the vanilla sprite under a custom key.
      wR: () => <RookieCell form="rook" />,
      wR2: defaultPieces.wR,
    }),
    [],
  );
  const staticSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (beat === 2) {
      for (const f of FILES) {
        styles[`${f}8`] = {
          backgroundImage: GOAL_GRADIENT,
          boxShadow: 'inset 0 0 0 1px rgba(255,245,200,0.5)',
          animation: 'rrOnbGoalGlow 1.4s ease-in-out infinite',
        };
      }
    }
    return styles;
  }, [beat]);

  const beat1Css = useMemo(() => {
    if (beat !== 1) return '';
    const kingTip =
      phase >= 1
        ? `[data-square="e1"] > div { animation: rrOnbKingFall 2400ms cubic-bezier(0.4, 0, 0.6, 1) both; transform-origin: 50% 90%; }`
        : '';
    const fade =
      phase >= 2
        ? FADING_SQUARES.map((sq, i) => {
            const delay = (i % 8) * 60;
            return `[data-square="${sq}"] > div { animation: rrOnbFadeOut ${FADE_MS}ms ease-out ${delay}ms both; }`;
          }).join('\n')
        : '';
    return `${kingTip}\n${fade}`;
  }, [beat, phase]);

  const caption =
    beat === 1
      ? 'White lost. Everyone left. I never got a single move.'
      : beat === 2
        ? 'Board’s theirs now. The way out is the far side. Anyone in between: their problem.'
        : captured
          ? 'That’s one. They’ll remember me.'
          : 'Rooks go straight. Show me.';

  const chip =
    beat === 2
      ? 'Reach the 8th rank — that’s the exit.'
      : beat === 3 && captured
        ? 'Capture to charge tempo.'
        : null;

  return (
    <div className="h-full w-full bg-chess-page text-chess-text flex items-center justify-center px-3 py-2">
      <style>{`
        @keyframes rrOnbKingFall {
          0%   { transform: rotate(0deg) translateY(0); opacity: 1; }
          22%  { transform: rotate(78deg) translateY(4%); opacity: 1; }
          34%  { transform: rotate(84deg) translateY(6%); opacity: 1; }
          60%  { transform: rotate(84deg) translateY(6%); opacity: 1; }
          100% { transform: rotate(84deg) translateY(10%); opacity: 0; }
        }
        @keyframes rrOnbFadeOut {
          to { opacity: 0; transform: translateY(6%) scale(0.85); }
        }
        @keyframes rrOnbGoalGlow {
          0%, 100% { filter: brightness(1); }
          50%      { filter: brightness(1.3); }
        }
        @keyframes rrOnbCaptionIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ${beat1Css}
      `}</style>

      <div className="w-full max-w-[360px] bg-white rounded-2xl p-3 shadow-sm border border-chess-text/10 flex flex-col gap-2.5">
        {/* Header: logo + skip */}
        <div className="flex items-center justify-between">
          <RookiesRunLogo scale={0.26} />
          <button
            type="button"
            onClick={() => finish('skipped')}
            className="min-h-[44px] min-w-[44px] px-2 -mr-2 text-[11px] uppercase tracking-[0.18em] font-bold text-chess-text-muted active:opacity-60"
          >
            Skip
          </button>
        </div>

        {/* Caption */}
        <p
          key={caption}
          className="text-[15px] font-black leading-snug text-chess-text min-h-[42px]"
          style={{ animation: 'rrOnbCaptionIn 320ms ease-out both' }}
        >
          {caption}
        </p>

        {/* Board */}
        <div className="w-full">
          {beat === 3 ? (
            <RunBoard
              key="onboarding-board"
              state={state}
              selectedSquare={selected}
              onSquareClick={onSquareClick}
              onPieceDrop={onPieceDrop}
            />
          ) : (
            <ChessPathBoard
              options={{
                id: 'rookies-run-onboarding',
                position: staticPosition,
                pieces: staticPieces,
                squareStyles: staticSquareStyles,
                showNotation: false,
                boardOrientation: 'white',
                allowDragging: false,
                animationDurationInMs: 300,
              }}
            />
          )}
        </div>

        {/* Rule chip — fixed-height slot so the card doesn't jump */}
        <div className="min-h-[28px] flex items-center">
          {chip && (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 rounded-full bg-chess-page border border-chess-text/10 px-3 py-1 text-[11px] font-bold text-chess-text"
              style={{ animation: 'rrOnbCaptionIn 320ms ease-out both' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC800]" />
              {chip}
            </span>
          )}
        </div>

        {/* CTA */}
        {beat === 3 && !captured ? (
          <p className="text-center text-[11px] text-chess-text-muted italic min-h-[44px] flex items-center justify-center">
            Tap Rookie, then tap a pawn.
          </p>
        ) : (
          <button
            type="button"
            onClick={beat === 3 ? () => finish('completed') : next}
            className="w-full py-3 min-h-[44px] rounded-2xl bg-chess-text text-white font-black text-[14px] tracking-wide active:translate-y-px transition-transform"
            style={{ boxShadow: '0 4px 0 #1a2c33, 0 6px 12px rgba(0,0,0,0.12)' }}
          >
            {beat === 3 ? 'Start the run' : 'Next'}{' '}
            <span className="opacity-80">&rarr;</span>
          </button>
        )}
      </div>
    </div>
  );
}
