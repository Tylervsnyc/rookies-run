'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultPieces } from 'react-chessboard';
import { ChessPathBoard } from '@/components/board/ChessPathBoard';
import { RunBoard } from '@/components/run/Board';
import { RookieCell } from '@/components/run/RookieCell';
import { RookiesRevengeLogo } from '@/components/run/RookiesRevengeLogo';
import { TempoBar } from '@/components/run/TempoBar';
import { AbilityRack } from '@/components/run/AbilityRack';
import { AbilityOfferModal } from '@/components/run/AbilityOfferModal';
import { trackEvent } from '@/lib/analytics/posthog';
import { applyRookieMove } from '@/lib/run/engine';
import { puzzleToBoardState } from '@/lib/run/seed';
import { tempoMaxFor } from '@/lib/run/scoring';
import {
  applyAbilityActivate,
  applyAbilityCancel,
  blurbDetailForTier,
  maxUsesForTier,
  type AbilityId,
  type AbilityOffer,
  type AbilityOfferOption,
} from '@/lib/run/abilities';
import { fromSquare, toSquare } from '@/lib/run/types';
import type { BoardState, RunPuzzle } from '@/lib/run/types';
import { playCaptureSound, playMoveSound } from '@/lib/sounds';
import { haptic, hapticSuccess } from '@/lib/haptics';

/**
 * StoryOnboarding — first-run story tutorial, shown ONCE before the daily
 * intro card (RunLanding).
 *
 * Story: White lost. Everyone left the board. Rookie (the a1 rook) never got
 * a move — and the black king who beat them is still standing across the
 * board. Nobody told her the game was over. Win = capture the king.
 *
 * Beat 1 — the loss: full starting position; White's king tips over, every
 *          white piece fades except a1.
 * Beat 2 — the target: Rookie alone vs the black army; the black KING's
 *          square glows gold.
 * Beat 3 — capture = tempo (interactive): two pawns; take one; the tempo bar
 *          fills to full.
 * Beat 4 — first ability (interactive): the real AbilityOfferModal with the
 *          three starter cards. Whatever they pick, beat 5 lends them Surge.
 * Beat 5 — cast it (interactive): tap Surge, move twice, land on the king.
 *
 * Beats 1-2 render a static ChessPathBoard (the run board can't hold white
 * pieces). Beats 3 + 5 reuse the real RunBoard + engine; enemies never act.
 * Nothing here touches the real profile (lib/run/profile.ts) — tutorial
 * picks don't count.
 */

export const ONBOARDING_KEY = 'rookies-run-onboarded';

interface StoryOnboardingProps {
  onDone: () => void;
}

type Beat = 1 | 2 | 3 | 4 | 5;

// Beat 1 fade timeline (ms).
const KING_TIP_AT = 700;
const FADE_AT = 1500;
const FADE_MS = 1500;

const WHITE_BACK = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R2'];
const BLACK_BACK = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// Same golden goal gradient the run board uses for the king's square.
const GOAL_GRADIENT =
  'linear-gradient(180deg, #fff1b8 0%, #ffd56a 45%, #e89c1a 100%)';

/** The three starter powers every new player sees. Surge first — beat 5 is scripted for it. */
const STARTERS: AbilityId[] = ['surge', 'freeze-ray', 'drones'];

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

// Beat 3: two pawns to take; the king waits in the far corner (out of reach).
const CAPTURE_PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 1, rank: 1 },
  pieces: [
    { type: 'pawn', color: 'black', file: 1, rank: 4 },
    { type: 'pawn', color: 'black', file: 3, rank: 1 },
    { type: 'king', color: 'black', file: 8, rank: 8 },
  ],
  enemiesPerTurn: 0,
  winCondition: 'king',
  kingBehavior: 'still',
};

// Beat 5: Rookie a1, king e4 — two rook moves away (a4 or e1, then e4).
const SURGE_PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 1, rank: 1 },
  pieces: [{ type: 'king', color: 'black', file: 5, rank: 4 }],
  enemiesPerTurn: 0,
  winCondition: 'king',
  kingBehavior: 'still',
};

function baseState(puzzle: RunPuzzle): BoardState {
  const s = puzzleToBoardState(puzzle, {
    runId: 'onboarding',
    unlockedAbilities: STARTERS,
  });
  // The seed randomizes Rookie's start file — the tutorial is scripted for a1.
  return { ...s, rookie: { ...puzzle.rookieStart }, pendingOffer: null };
}

/** Beat 3 state: one pawn away from a full tempo bar. */
function captureState(): BoardState {
  const s = baseState(CAPTURE_PUZZLE);
  return { ...s, tempo: tempoMaxFor(s) - 1 };
}

/** Beat 5 state: full bar, Surge in the rack, king two moves away. */
function surgeState(): BoardState {
  const s = baseState(SURGE_PUZZLE);
  return {
    ...s,
    tempo: tempoMaxFor(s),
    abilities: [
      { id: 'surge', tier: 1, mutations: [], usesLeftThisLevel: maxUsesForTier('surge', 1) },
    ],
  };
}

function starterOffer(): AbilityOffer {
  return STARTERS.map((id) => ({
    kind: 'new' as const,
    id,
    tier: 1 as const,
    description: blurbDetailForTier(id, 1),
  }));
}

export function StoryOnboarding({ onDone }: StoryOnboardingProps) {
  const [beat, setBeat] = useState<Beat>(1);
  // Beat 1 animation phase: 0 = full board, 1 = king tipped, 2 = fading.
  const [phase, setPhase] = useState(0);
  // Beat 3
  const [captured, setCaptured] = useState(false);
  // Beat 4
  const [picked, setPicked] = useState<AbilityId | null>(null);
  // Beat 5
  const [surged, setSurged] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [state, setState] = useState<BoardState>(() => captureState());
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
      else trackEvent('run_onboarding_completed', { beat });
      onDone();
    },
    [beat, onDone],
  );

  const goTo = useCallback((b: Beat) => {
    haptic('light');
    trackEvent('run_onboarding_beat', { beat: b });
    setSelected(null);
    if (b === 5) {
      setState(surgeState());
      setSurged(false);
      setStuck(false);
    }
    setBeat(b);
  }, []);

  const next = useCallback(() => {
    if (beat === 1) goTo(2);
    else if (beat === 2) goTo(3);
    else if (beat === 3) goTo(4);
    else if (beat === 4) goTo(5);
  }, [beat, goTo]);

  const won = beat === 5 && state.status === 'won';
  const interactive = beat === 3 ? !captured : beat === 5 ? !won && !stuck : false;

  // ---- Board interaction (beats 3 + 5) -------------------------------------
  const tryMove = useCallback(
    (targetSq: string): boolean => {
      if (!interactive) return false;
      const target = fromSquare(targetSq);
      const wasCapture = state.pieces.some(
        (p) => p.file === target.file && p.rank === target.rank,
      );
      const nextState = applyRookieMove(state, target);
      if (nextState === state) return false;
      setSelected(null);
      if (beat === 3) {
        // Enemies never get a turn — hand control straight back, and keep the
        // real offer for beat 4 (the engine rolls one when the bar fills).
        setState({ ...nextState, turn: 'rookie', pendingOffer: null, kingStunTurns: 0 });
        if (wasCapture) {
          void playCaptureSound();
          hapticSuccess();
          setCaptured(true);
        } else {
          void playMoveSound();
          haptic('light');
        }
        return true;
      }
      // Beat 5 — a move without Surge ends the turn; that's the lesson.
      setState(nextState);
      if (nextState.status === 'won') {
        void playCaptureSound();
        hapticSuccess();
        trackEvent('run_onboarding_surge_win');
      } else {
        void playMoveSound();
        haptic('light');
        if (nextState.turn !== 'rookie') setStuck(true);
      }
      return true;
    },
    [beat, interactive, state],
  );

  const onSquareClick = useCallback(
    (square: string) => {
      if (!interactive) return;
      const rookieSq = toSquare(state.rookie);
      if (square === rookieSq) {
        setSelected((s) => (s === rookieSq ? null : rookieSq));
        return;
      }
      if (selected) {
        if (!tryMove(square)) setSelected(null);
      }
    },
    [interactive, selected, state.rookie, tryMove],
  );

  const onPieceDrop = useCallback(
    (_from: string, to: string) => tryMove(to),
    [tryMove],
  );

  // ---- Beat 4: pick ----------------------------------------------------------
  const offer = useMemo(() => starterOffer(), []);
  const onOfferPick = useCallback(
    (option: AbilityOfferOption) => {
      hapticSuccess();
      trackEvent('run_onboarding_pick', { beat: 4, ability: option.id });
      setPicked(option.id);
    },
    [],
  );

  // ---- Beat 5: cast ----------------------------------------------------------
  const onActivateAbility = useCallback(
    (id: AbilityId) => {
      if (!interactive) return;
      if (state.activeAbility?.id === id) {
        setState((s) => applyAbilityCancel(s));
        return;
      }
      const nextState = applyAbilityActivate(state, id);
      if (nextState === state) return;
      haptic('medium');
      setState(nextState);
      if (id === 'surge') setSurged(nextState.bonusMovesLeft > 0);
    },
    [interactive, state],
  );

  const resetBeat5 = useCallback(() => goTo(5), [goTo]);

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
      styles.e8 = {
        backgroundImage: GOAL_GRADIENT,
        boxShadow:
          'inset 0 0 0 2px rgba(255,245,200,0.9), 0 0 18px 4px rgba(255,200,60,0.55)',
        animation: 'rrOnbGoalGlow 1.4s ease-in-out infinite',
      };
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

  // ---- Copy ------------------------------------------------------------------
  const pickedOther = picked !== null && picked !== 'surge';

  const caption = (() => {
    switch (beat) {
      case 1:
        return 'White lost. Everyone left. I never got a single move.';
      case 2:
        return 'He’s still standing there. Nobody told him the game was over.';
      case 3:
        return captured ? 'That’s one. They’ll remember me.' : 'Rooks go straight. Show me.';
      case 4:
        return picked === null
          ? 'One rook can’t do this alone. Take something.'
          : pickedOther
            ? 'Good pick. For this one, borrow Surge.'
            : 'Surge. Two moves in one turn. Good.';
      case 5:
        if (won) return 'Checkmate. That’s yours forever.';
        if (stuck) return 'One move, then it’s their turn. Surge first — then move twice.';
        if (surged) return 'Two moves. Get on his line, then take him.';
        return 'Tap Surge. Then move twice — get on his line, then take him.';
    }
  })();

  const chip = (() => {
    switch (beat) {
      case 2:
        return 'Capture the king.';
      case 3:
        return captured ? 'Every capture charges tempo.' : null;
      case 4:
        return 'Full bar = pick a power.';
      case 5:
        return won ? null : 'Powers live in the rack. Tap to cast.';
      default:
        return null;
    }
  })();

  const showOffer = beat === 4 && picked === null;

  return (
    <div className="min-h-full w-full bg-chess-page text-chess-text flex items-start sm:items-center justify-center px-3 py-2">
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
        @keyframes rrOnbPulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(251,191,36,0.85); }
          70%  { box-shadow: 0 0 0 12px rgba(251,191,36,0); }
          100% { box-shadow: 0 0 0 0 rgba(251,191,36,0); }
        }
        .rr-onb-pulse { animation: rrOnbPulseRing 1.3s ease-out infinite; border-radius: 12px; }
        ${beat1Css}
      `}</style>

      <div className="w-full max-w-[360px] bg-white rounded-2xl p-3 shadow-sm border border-chess-text/10 flex flex-col gap-2.5">
        {/* Header: logo + skip */}
        <div className="flex items-center justify-between">
          <RookiesRevengeLogo scale={0.3} />
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
          {beat >= 3 ? (
            <RunBoard
              key={beat === 5 ? 'onboarding-surge' : 'onboarding-capture'}
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

        {/* Tempo bar — beats 3-5 */}
        {beat >= 3 && (
          <TempoBar
            tempo={state.tempo}
            max={tempoMaxFor(state)}
            form={state.form}
            formMovesLeft={state.formMovesLeft}
          />
        )}

        {/* Ability rack — beat 5 (pulses until Surge is cast) */}
        {beat === 5 && (
          <div className={surged || won ? '' : 'rr-onb-pulse'} data-testid="onboarding-rack">
            <AbilityRack
              abilities={state.abilities}
              activeId={state.activeAbility?.id ?? null}
              onActivate={onActivateAbility}
            />
          </div>
        )}

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
        ) : beat === 5 && stuck ? (
          <button
            type="button"
            onClick={resetBeat5}
            className="w-full py-3 min-h-[44px] rounded-2xl bg-chess-text text-white font-black text-[14px] tracking-wide active:translate-y-px transition-transform"
            style={{ boxShadow: '0 4px 0 #1a2c33, 0 6px 12px rgba(0,0,0,0.12)' }}
          >
            Reset
          </button>
        ) : beat === 5 && !won ? (
          <p className="text-center text-[11px] text-chess-text-muted italic min-h-[44px] flex items-center justify-center">
            {surged ? 'Tap Rookie, then a square. Twice.' : 'Tap the Surge card.'}
          </p>
        ) : (
          <button
            type="button"
            onClick={beat === 5 ? () => finish('completed') : next}
            className="w-full py-3 min-h-[44px] rounded-2xl bg-chess-text text-white font-black text-[14px] tracking-wide active:translate-y-px transition-transform"
            style={{ boxShadow: '0 4px 0 #1a2c33, 0 6px 12px rgba(0,0,0,0.12)' }}
          >
            {beat === 5 ? 'Begin' : 'Next'} <span className="opacity-80">&rarr;</span>
          </button>
        )}
      </div>

      {showOffer && (
        <AbilityOfferModal
          offer={offer}
          onPick={onOfferPick}
          onSkip={() => undefined}
          reason="level"
        />
      )}
    </div>
  );
}
