'use client';

import { loadTrack, startTrack, stopTrack, SAD_MUSIC_URL, type TrackHandle } from '@/lib/run/tracks';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { defaultPieces } from 'react-chessboard';
import { ChessPathBoard } from '@/components/board/ChessPathBoard';
import { RunBoard } from '@/components/run/Board';
import { RookieCell } from '@/components/run/RookieCell';
import {
  REVENGE_RED,
  REVENGE_RED_DARK,
  RevengeMarkSvg,
  RookiesRevengeLogo,
} from '@/components/run/RookiesRevengeLogo';
import { RevengeLockOn } from '@/components/run/RevengeLockOn';
import { useNavyShell } from '@/components/run/useNavyShell';
import { TempoBar } from '@/components/run/TempoBar';
import { AbilityRack } from '@/components/run/AbilityRack';
import { AbilityOfferModal } from '@/components/run/AbilityOfferModal';
import {
  BoardOverlay,
  PointerArrow,
  type OverlayArrow,
  type OverlayBurst,
} from '@/components/run/BoardOverlay';
import { trackEvent } from '@/lib/analytics/posthog';
import { applyRookieMove } from '@/lib/run/engine';
import { puzzleToBoardState } from '@/lib/run/seed';
import { TEMPO_REWARD, tempoMaxFor } from '@/lib/run/scoring';
import {
  applyAbilityActivate,
  applyAbilityCancel,
  applyAbilityTargeted,
  blurbDetailForTier,
  maxUsesForTier,
  type AbilityId,
  type AbilityOffer,
  type AbilityOfferOption,
} from '@/lib/run/abilities';
import { fromSquare, toSquare } from '@/lib/run/types';
import type { BoardState, RunPuzzle } from '@/lib/run/types';
import {
  getSharedAudioContext,
  playCaptureSound,
  playFreezeSound,
  playMoveSound,
  playSurgeSound,
  playTransformIntoSound,
} from '@/lib/sounds';
import { haptic, hapticSuccess } from '@/lib/haptics';

/**
 * StoryOnboarding — first-run story tutorial, shown ONCE before the daily
 * intro card (RunLanding). Narrated in THIRD person: Rookie is she/her, the
 * black king is he. Captions are two sentences at most. Every interactive
 * step gets an arrow — on the board for moves, a blue pointer over the
 * ability card for power beats.
 *
 * Beat 1  — an ordinary game: Qxd7 takes a knight (colour); Nxg1 takes the
 *           white king in SLOW MOTION — black & white, sting, GAME OVER.
 * Beat 2  — everyone leaves: the white pieces dissolve. Still black & white.
 * Beat 3  — colour returns and Rookie transforms from a plain white rook
 *           into the breathing rook. "Rookie took that personally."
 * Beat 4  — the target: the king is still there. Capture the king.
 * Beat 5  — rook drill (interactive): a1xa7 (the capture STUNS the king —
 *           the engine's real capture-stun rule, named while his badge
 *           shows), Ng1-f3 (scripted, the stun expires), a8 (he
 *           panics), f7-f6 (scripted, "he makes a door" + his escape arrow),
 *           "Too late.", a8xg8.
 * Beat 6  — "This is Rookie's Revenge." (the won board stays up)
 * Beat 7  — Knight Hop: the king steps off her line; the offer modal opens
 *           with ONLY Knight Hop selectable; it lands in the rack (alone);
 *           the player TAPS it to transform (shimmer); an L-shaped arrow onto
 *           the king; take him; she STAYS a knight until Next.
 * Beat 8  — Surge (interactive): blue arrow at the Surge card, then arrows
 *           a1→e1→e4; the king's "I don't get a move" bubble; Rookie's line.
 * Beat 9  — Freeze Ray (interactive): the knight on h1 is free, the player
 *           takes it (the king is stunned) — and the bishop on g2 takes HER.
 *           Next rewinds; blue arrow at the card, pointer at the bishop;
 *           freeze him, take the knight, take the king.
 * Beat 10 — tempo (interactive): the player takes a pawn and a knight as a
 *           rook, then Knight Hops onto the queen (a rook on the queen's
 *           line would be in her sights — Rookie is never in danger here);
 *           the bar glows with each real TEMPO_REWARD; then the powers popup
 *           demonstrates NEW vs UPGRADE.
 * Beat 11 — danger: a bishop is looking at Rookie; she turns red. "If you
 *           lose her, you lose the game."
 * Beat 12 — the final screen: "You're ready to play Rookie's Revenge."
 *
 * Beats 1-4 render a static ChessPathBoard (the run board can't hold white
 * pieces). Beats 5-10 reuse the real RunBoard + engine; enemies never act on
 * their own — scripted enemy moves are applied as state. Nothing here
 * touches the real profile (lib/run/profile.ts).
 *
 * Black setup is UNIFORM in every scene: Kg8, Bg6, pawns a7 f7 g7 h7, and a
 * knight (h3 in the game, g1 after it takes the king, f3 in the drill).
 * a7 is undefended from the start; the bishop never moves.
 */

export const ONBOARDING_KEY = 'rookies-run-onboarded';

interface StoryOnboardingProps {
  onDone: () => void;
}

type Beat = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
const LAST_BEAT: Beat = 12;

// Arena palette (components/run/ArenaHome.tsx) — the tutorial lives in the
// same navy shell as the home screen and the game (Tyler, 2026-09-03).
const NAVY = '#0f1c3f';
const NAVY_2 = '#182a5c';
const PANEL = '#1c2f63';
const PANEL_EDGE = '#3a4f8f';

// Beat 1 scene phases: 0 intro · 1 arrow d4→d7 · 2 Qxd7 (timed) · 3 "fatal
// error" · 4 Nxg1 slow-mo · 5 GAME OVER stamp (timed).
const QUEEN_TAKES_AT = 800;
const KNIGHT_SLOWMO_MS = 1600;
const GAME_OVER_AFTER_MS = KNIGHT_SLOWMO_MS + 500;
// Beat 2 dissolve timeline (ms).
const DISSOLVE_AT = 500;
const DISSOLVE_MS = 1400;
// Beat 3: colour returns + Rookie wakes up; the second caption follows.
const WAKE_AT = 700;
const LIVING_AT = WAKE_AT + 1700;
const GLITCH_MS = 440;
// Beat 5 drill scripted pauses (ms).
const KNIGHT_RETURNS_AT = 1100;
const DOOR_AT = 1300;
const DOOR_TOO_LATE_AT = 900;
// Beat 7: the king steps off her line after the arrow lands. After the
// capture she stays a knight — beat 8 remounts the board as a fresh rook.
const SIDESTEP_AT = 1500;
// Beat 9 demo: the bishop takes her after she grabs the knight on h1.
const BISHOP_TAKES_AT = 900;
// Beat 10: tempo bar glow after each capture; the offer once it's full.
const TEMPO_GLOW_MS = 1100;
const TEMPO_OFFER_AT = 1400;

/** The three starter powers every new player sees, in the order they're taught. */
const STARTERS: AbilityId[] = ['knight-hop', 'surge', 'freeze-ray'];

type Pos = Record<string, { pieceType: string }>;

/**
 * Beat 1 — the last two moves of the game. White: Ra1 (Rookie), Kg1, Qd4,
 * Nc3, Bc4, pawns a2 f2 g2 h2. Black: Kg8, Nd7, Nh3, Bg6, pawns a7 f7 g7 h7.
 * Qxd7 grabs a knight; Nh3xg1 takes the white king. Game over.
 */
const WHITE_START: Record<string, string> = {
  a1: 'wR',
  g1: 'wK',
  d4: 'wQ',
  c3: 'wN',
  c4: 'wB',
  a2: 'wP',
  f2: 'wP',
  g2: 'wP',
  h2: 'wP',
};
const BLACK_START: Record<string, string> = {
  g8: 'bK',
  d7: 'bN',
  h3: 'bN',
  g6: 'bB',
  a7: 'bP',
  f7: 'bP',
  g7: 'bP',
  h7: 'bP',
};
const KING_SQUARE = 'g8';

/** Scene position by beat-1 phase: <2 start, 2-3 after Qxd7, 4+ after Nxg1. */
function scenePosition(phase: number): Pos {
  const pos: Pos = {};
  for (const [sq, t] of Object.entries(WHITE_START)) pos[sq] = { pieceType: t };
  for (const [sq, t] of Object.entries(BLACK_START)) pos[sq] = { pieceType: t };
  if (phase >= 2) {
    delete pos.d4;
    pos.d7 = { pieceType: 'wQ' };
  }
  if (phase >= 4) {
    delete pos.h3;
    pos.g1 = { pieceType: 'bN' };
  }
  return pos;
}
const QUEEN_FROM = 'd4';
const QUEEN_TO = 'd7';

/** White squares that dissolve in beat 2 (everything but Rookie). */
const DISSOLVING_SQUARES = ['d7', 'c3', 'c4', 'a2', 'f2', 'g2', 'h2'];

/**
 * Beats 3-4: Rookie (a1) + the black pieces, exactly where they were. The
 * dissolved white pieces STAY in the position (hidden by CSS) — removing
 * them made the board library re-key its piece elements, which restarted
 * the fade-out animation from full opacity for one delay window: the flash.
 */
function survivorsPosition(): Pos {
  const pos = scenePosition(4);
  return pos;
}

// Beat 5: the black survivors on the run board — the SAME black setup as
// the opening scene. a7 hangs: a1xa7, Ng1-f3 (scripted), a7-a8, f7-f6
// (scripted), a8xg8.
const DRILL_PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 1, rank: 1 },
  pieces: [
    { type: 'king', color: 'black', file: 7, rank: 8 },
    { type: 'knight', color: 'black', file: 7, rank: 1 },
    { type: 'bishop', color: 'black', file: 7, rank: 6 },
    { type: 'pawn', color: 'black', file: 1, rank: 7 },
    { type: 'pawn', color: 'black', file: 6, rank: 7 },
    { type: 'pawn', color: 'black', file: 7, rank: 7 },
    { type: 'pawn', color: 'black', file: 8, rank: 7 },
  ],
  enemiesPerTurn: 0,
  winCondition: 'king',
  kingBehavior: 'still',
};

// Beat 7: Rookie a1, king a3 — ON her line. He steps to b3 (scripted): off
// every rook line, exactly one knight hop away.
const HOP_PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 1, rank: 1 },
  pieces: [{ type: 'king', color: 'black', file: 1, rank: 3 }],
  enemiesPerTurn: 0,
  winCondition: 'king',
  kingBehavior: 'still',
};
const HOP_KING_FROM = 'a3';
const HOP_KING_TO = 'b3';

// Beat 8: Rookie a1, king e4 — two rook moves away (e1, then e4).
const SURGE_PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 1, rank: 1 },
  pieces: [{ type: 'king', color: 'black', file: 5, rank: 4 }],
  enemiesPerTurn: 0,
  winCondition: 'king',
  kingBehavior: 'still',
};
const SURGE_KING_SQUARE = 'e4';

// Beat 9: Rookie h5, king e1. His knight on h1 is free to take — but the
// bishop on g2 is watching h1. Pawns f4/f5 close the rank routes, so h1 is
// the only way onto him. Freeze the bishop, take the knight (the capture
// stuns him), take him along the rank. (Enemies have no rook type — Rookie
// is the only rook — so the bait is a knight.)
const FREEZE_PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 8, rank: 5 },
  pieces: [
    { type: 'king', color: 'black', file: 5, rank: 1 },
    { type: 'knight', color: 'black', file: 8, rank: 1 },
    { type: 'bishop', color: 'black', file: 7, rank: 2 },
    { type: 'pawn', color: 'black', file: 6, rank: 4 },
    { type: 'pawn', color: 'black', file: 6, rank: 5 },
  ],
  enemiesPerTurn: 0,
  winCondition: 'king',
  kingBehavior: 'still',
};
const FREEZE_KING_SQUARE = 'e1';
const FREEZE_BAIT_SQUARE = 'h1';
const FREEZE_BISHOP_SQUARE = 'g2';
const FREEZE_ROOKIE_START = 'h5';

/** Beat 8: Rookie's line after she takes him (one is picked per win). */
const REVENGE_LINES = ['That’s for the white king.', 'She took it personally.', 'Personal.'];

// Beat 10: three PLAYER captures on the real board — a4 (pawn), d4 (knight)
// as a rook, then Knight Hop d4→e6 (queen): TEMPO_REWARD 1 + 2 + 4 = 7, from
// max-7 to a full bar. No king: nothing to win, just the meter filling.
// Rookie is NEVER attacked on this path (Tyler 2026-09-03): the queen on e6
// sees no square she lands on, and a rook can only take a queen from the
// queen's own line — so she hops onto her as a knight instead.
const TEMPO_PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 1, rank: 1 },
  pieces: [
    { type: 'pawn', color: 'black', file: 1, rank: 4 },
    { type: 'knight', color: 'black', file: 4, rank: 4 },
    { type: 'queen', color: 'black', file: 5, rank: 6 },
  ],
  enemiesPerTurn: 0,
  winCondition: 'king',
  kingBehavior: 'still',
};
const TEMPO_PATH = ['a4', 'd4', 'e6'];
/** The capture that needs Knight Hop first (index into TEMPO_PATH). */
const TEMPO_HOP_STEP = 2;

// Beat 11: the bishop on g7 is looking straight at Rookie on d4 — the real
// board's "in check" alarm fires on its own. Nothing to do but look.
const DANGER_PUZZLE: RunPuzzle = {
  level: 1,
  rookieStart: { file: 4, rank: 4 },
  pieces: [
    { type: 'king', color: 'black', file: 5, rank: 8 },
    { type: 'bishop', color: 'black', file: 7, rank: 7 },
    { type: 'pawn', color: 'black', file: 2, rank: 7 },
  ],
  enemiesPerTurn: 0,
  winCondition: 'king',
  kingBehavior: 'still',
};
const DANGER_BISHOP_SQUARE = 'g7';
const DANGER_ROOKIE_SQUARE = 'd4';
const TEMPO_GAIN_TOTAL = TEMPO_REWARD.pawn + TEMPO_REWARD.knight + TEMPO_REWARD.queen;

function baseState(puzzle: RunPuzzle): BoardState {
  const s = puzzleToBoardState(puzzle, {
    runId: 'onboarding',
    unlockedAbilities: STARTERS,
  });
  // The seed randomizes Rookie's start file — the tutorial is scripted.
  return { ...s, rookie: { ...puzzle.rookieStart }, pendingOffer: null };
}

/** Beat 5 state: one capture away from a full tempo bar. */
function drillState(): BoardState {
  const s = baseState(DRILL_PUZZLE);
  return { ...s, tempo: tempoMaxFor(s) - 1 };
}

/**
 * Beats 7-9: full bar. Beat 7 (the first power) racks ONLY Knight Hop;
 * beats 8-9 rack all three starters (only one is live).
 */
function lentState(puzzle: RunPuzzle, ids: AbilityId[] = STARTERS): BoardState {
  const s = baseState(puzzle);
  return {
    ...s,
    tempo: tempoMaxFor(s),
    abilities: ids.map((id) => ({
      id,
      tier: 1 as const,
      mutations: [],
      usesLeftThisLevel: maxUsesForTier(id, 1),
    })),
  };
}

/** Beat 10: seven short of full, three pieces to take (1 + 2 + 4). Knight Hop racked for the queen. */
function tempoState(): BoardState {
  const s = baseState(TEMPO_PUZZLE);
  return {
    ...s,
    tempo: tempoMaxFor(s) - TEMPO_GAIN_TOTAL,
    abilities: [
      { id: 'knight-hop', tier: 1 as const, mutations: [], usesLeftThisLevel: maxUsesForTier('knight-hop', 1) },
    ],
  };
}

/** Beat 11: Rookie under attack, empty rack, nothing to do. */
function dangerState(): BoardState {
  const s = baseState(DANGER_PUZZLE);
  return { ...s, abilities: [] };
}

/**
 * Sad cinematic bed (public/sounds/sad-cinematic.mp3) — onboarding-only, so
 * it's fetched + decoded lazily here rather than in lib/sounds' global
 * preload. Starts when the knight takes the king, runs under GAME OVER and
 * the dissolve, and fades out (~600ms) when colour returns.
 */
const SAD_FADE_MS = 600;
// Every tutorial king capture: Rookie takes him in slow motion under a
// somber, celestial (funny) track — the theme. The rook drill (beat 5) plays
// it in full (fading ~800ms after beat 6's caption); the power beats start
// it and fade it after ~2.5s. Never two instances at once (kingMusicRef).
const KING_CAPTURE_MUSIC_URL = '/sounds/king-capture-celestial.mp3';
const KING_CAPTURE_SLOWMO_MS = 1600;
const KING_CAPTURE_FADE_AFTER_MS = 800;
const KING_CAPTURE_SHORT_MS = 2500;
const KING_CAPTURE_SHORT_FADE_MS = 700;
// Beat 11: a cartoon woodwind sting when the final screen appears.
const TUTORIAL_END_URL = '/sounds/tutorial-end-woodwind.mp3';

// Track loading/starting/stopping lives in lib/run/tracks.ts (shared with the
// game's slow-motion Rookie-captured moment). These are the tutorial's names.
type SadMusicHandle = TrackHandle;
function loadSadMusic(ctx: AudioContext): Promise<AudioBuffer | null> {
  return loadTrack(ctx, SAD_MUSIC_URL);
}
function startSadMusic(): SadMusicHandle | null {
  return startTrack(SAD_MUSIC_URL, 0.7);
}
function stopSadMusic(handle: SadMusicHandle | null, fadeMs = SAD_FADE_MS): void {
  stopTrack(handle, fadeMs);
}

/** Move one enemy piece on the board (scripted black move). */
function moveEnemy(s: BoardState, from: string, to: string): BoardState {
  const f = fromSquare(from);
  const t = fromSquare(to);
  return {
    ...s,
    pieces: s.pieces.map((p) =>
      p.file === f.file && p.rank === f.rank ? { ...p, file: t.file, rank: t.rank } : p,
    ),
  };
}

const LENT: Partial<Record<Beat, { puzzle: RunPuzzle; id: AbilityId; key: string }>> = {
  7: { puzzle: HOP_PUZZLE, id: 'knight-hop', key: 'onboarding-hop' },
  8: { puzzle: SURGE_PUZZLE, id: 'surge', key: 'onboarding-surge' },
  9: { puzzle: FREEZE_PUZZLE, id: 'freeze-ray', key: 'onboarding-freeze' },
};

function starterOffer(): AbilityOffer {
  return STARTERS.map((id) => ({
    kind: 'new' as const,
    id,
    tier: 1 as const,
    description: blurbDetailForTier(id, 1),
  }));
}

/** Beat 10 demo slate: one NEW power and one UPGRADE, side by side. */
function demoOffer(): AbilityOffer {
  return [
    { kind: 'new', id: 'bishop-step', tier: 1, description: blurbDetailForTier('bishop-step', 1) },
    { kind: 'upgrade', id: 'knight-hop', tier: 2, description: blurbDetailForTier('knight-hop', 2) },
  ];
}

const CTA_STYLE = { background: REVENGE_RED, boxShadow: `0 4px 0 ${REVENGE_RED_DARK}, 0 6px 12px rgba(0,0,0,0.3)` };
const CTA_CLASS =
  'w-full py-3 min-h-[44px] rounded-2xl text-white font-black text-[14px] tracking-wide active:translate-y-px transition-transform';

// Beat 5 drill steps.
// 0 take a7   1 he's stunned (the capture-stun rule, Next-gated)
// 2 knight returning (his turn — the stun expires)   3 go a8
// 4 on a8 — he panics   5 he makes a door (his escape arrow)
// 6 too late — take him
type DrillStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;
// Beat 7 phases: the king sidesteps, the offer opens, the player picks Knight
// Hop ('armed' = it's in the rack, tap it), she's a knight ('hop').
type HopPhase = 'line' | 'stepped' | 'offer' | 'armed' | 'hop';
// Beat 9 phases: the player takes the knight on h1 ('demo' → 'taken', the
// king is stunned), the bishop takes her ('captured'), Next rewinds and the
// player is on ('ready').
type FreezePhase = 'demo' | 'taken' | 'captured' | 'ready';

export function StoryOnboarding({ onDone }: StoryOnboardingProps) {
  // Dev hook: `?onboardingBeat=11` (with `?onboarding=1`) opens on that beat.
  const [beat, setBeat] = useState<Beat>(() => {
    if (typeof window === 'undefined') return 1;
    const n = Number(new URLSearchParams(window.location.search).get('onboardingBeat'));
    return n >= 1 && n <= LAST_BEAT ? (n as Beat) : 1;
  });
  // Beat 1 scene phase / beat 2 dissolve phase / beat 3 wake phase.
  const [phase, setPhase] = useState(0);
  // Beat 5
  const [drill, setDrill] = useState<DrillStep>(0);
  // Beat 7
  const [hopPhase, setHopPhase] = useState<HopPhase>('line');
  // Beats 7-9
  const [cast, setCast] = useState(false); // the lent power has been used
  const [stuck, setStuck] = useState(false); // moved without it — reset
  const [nudge, setNudge] = useState(false); // tried to move before casting
  const [glitching, setGlitching] = useState(false); // transform VFX
  const [freezePhase, setFreezePhase] = useState<FreezePhase>('demo');
  // Beat 10: number of player captures landed so far (0..3), the bar glow
  // after each one, and the demo popup.
  const [tempoStep, setTempoStep] = useState(0);
  const [tempoGlow, setTempoGlow] = useState(false);
  const [tempoOffer, setTempoOffer] = useState(false);
  // Beat 8: Rookie's one-liner after she takes him (picked once per win).
  const [revengeLine, setRevengeLine] = useState<string | null>(null);
  // Board state for the opening beat — the `?onboardingBeat=` dev hook lands
  // on the right board too (it used to open every beat on the rook drill).
  const [state, setState] = useState<BoardState>(() => {
    if (typeof window === 'undefined') return drillState();
    const n = Number(new URLSearchParams(window.location.search).get('onboardingBeat'));
    const lent = LENT[n as Beat];
    if (lent) return lentState(lent.puzzle, n === 7 ? ['knight-hop'] : STARTERS);
    if (n === 10) return tempoState();
    if (n === 11) return dangerState();
    return drillState();
  });
  const [selected, setSelected] = useState<string | null>(null);
  const sadMusicRef = useRef<SadMusicHandle | null>(null);
  const kingMusicRef = useRef<SadMusicHandle | null>(null);
  // The winning king capture slides in slow motion (every tutorial capture).
  const [slowCapture, setSlowCapture] = useState(false);
  const kingShortFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * The king-capture theme. `full` (rook drill) runs until beat 6 fades it;
   * otherwise it's cut after KING_CAPTURE_SHORT_MS. Always stops the previous
   * instance first, so two never overlap.
   */
  const playKingCaptureTheme = useCallback((full: boolean) => {
    if (kingShortFadeRef.current) clearTimeout(kingShortFadeRef.current);
    kingShortFadeRef.current = null;
    stopSadMusic(kingMusicRef.current, 0);
    setSlowCapture(true);
    const handle = startTrack(KING_CAPTURE_MUSIC_URL, 0.8);
    kingMusicRef.current = handle;
    if (!full) {
      kingShortFadeRef.current = setTimeout(() => {
        if (kingMusicRef.current === handle) {
          stopSadMusic(handle, KING_CAPTURE_SHORT_FADE_MS);
          kingMusicRef.current = null;
        }
        kingShortFadeRef.current = null;
      }, KING_CAPTURE_SHORT_MS);
    }
  }, []);

  // The music stops with the component (skip, or unmount).
  useEffect(
    () => () => {
      stopSadMusic(sadMusicRef.current, 200);
      stopSadMusic(kingMusicRef.current, 200);
      if (kingShortFadeRef.current) clearTimeout(kingShortFadeRef.current);
    },
    [],
  );

  // Beat 11: one woodwind sting as the final screen appears.
  useEffect(() => {
    if (beat !== LAST_BEAT) return;
    const handle = startTrack(TUTORIAL_END_URL, 0.8);
    return () => stopSadMusic(handle, 200);
  }, [beat]);

  // Beat 5's celestial track fades out ~800ms after beat 6's caption appears.
  useEffect(() => {
    if (beat !== 6 || !kingMusicRef.current) return;
    const t = setTimeout(() => {
      stopSadMusic(kingMusicRef.current, 800);
      kingMusicRef.current = null;
    }, KING_CAPTURE_FADE_AFTER_MS);
    return () => clearTimeout(t);
  }, [beat]);

  useEffect(() => {
    trackEvent('run_onboarding_seen');
  }, []);

  const glitch = useCallback(() => {
    setGlitching(true);
    const t = setTimeout(() => setGlitching(false), GLITCH_MS);
    return () => clearTimeout(t);
  }, []);

  // Beat 1: the arrow lands on the knight, then the queen takes it.
  useEffect(() => {
    if (beat !== 1 || phase !== 1) return;
    const t = setTimeout(() => {
      setPhase(2);
      void playCaptureSound();
      haptic('light');
    }, QUEEN_TAKES_AT);
    return () => clearTimeout(t);
  }, [beat, phase]);

  // Beat 1: the king capture is slow-motion; the GAME OVER stamp follows.
  useEffect(() => {
    if (beat !== 1 || phase !== 4) return;
    const t = setTimeout(() => {
      setPhase(5);
      void playCaptureSound();
      haptic('heavy');
    }, GAME_OVER_AFTER_MS);
    return () => clearTimeout(t);
  }, [beat, phase]);

  // Beat 2: everyone leaves.
  useEffect(() => {
    if (beat !== 2) return;
    const t = setTimeout(() => setPhase(1), DISSOLVE_AT);
    return () => clearTimeout(t);
  }, [beat]);

  // Beat 3: colour returns and Rookie fills with revenge.
  useEffect(() => {
    if (beat !== 3) return;
    const t = setTimeout(() => {
      setPhase(1);
      stopSadMusic(sadMusicRef.current);
      sadMusicRef.current = null;
      void playTransformIntoSound();
      haptic('medium');
      setGlitching(true);
    }, WAKE_AT);
    const t2 = setTimeout(() => setGlitching(false), WAKE_AT + GLITCH_MS);
    const t3 = setTimeout(() => setPhase(2), LIVING_AT);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [beat]);

  // Beat 5: after the stun beat, the knight hurries back to f3. Too late.
  // That's the enemy turn the capture-stun covered — the stun expires here.
  useEffect(() => {
    if (beat !== 5 || drill !== 2) return;
    const t = setTimeout(() => {
      setState((s) => ({ ...moveEnemy(s, 'g1', 'f3'), kingStunTurns: 0 }));
      void playMoveSound();
      setDrill(3);
    }, KNIGHT_RETURNS_AT);
    return () => clearTimeout(t);
  }, [beat, drill]);

  // Beat 5: on a8 he panics, then makes a door (f7-f6)...
  useEffect(() => {
    if (beat !== 5 || drill !== 4) return;
    const t = setTimeout(() => {
      setState((s) => moveEnemy(s, 'f7', 'f6'));
      void playMoveSound();
      setDrill(5);
    }, DOOR_AT);
    return () => clearTimeout(t);
  }, [beat, drill]);

  // Beat 5: ...his escape arrow shows, then "Too late." and the player is on.
  useEffect(() => {
    if (beat !== 5 || drill !== 5) return;
    const t = setTimeout(() => setDrill(6), DOOR_TOO_LATE_AT);
    return () => clearTimeout(t);
  }, [beat, drill]);

  // Beat 7: the arrow lands on him, then he just steps off her line.
  useEffect(() => {
    if (beat !== 7 || hopPhase !== 'line') return;
    const t = setTimeout(() => {
      setState((s) => moveEnemy(s, HOP_KING_FROM, HOP_KING_TO));
      void playMoveSound();
      haptic('light');
      setHopPhase('stepped');
    }, SIDESTEP_AT);
    return () => clearTimeout(t);
  }, [beat, hopPhase]);

  // Beat 9 demo: she took the knight on h1 — the bishop was watching h1.
  // He takes her (the real board's captured-Rookie rendering, under the sad
  // track, colour draining like the opening game).
  useEffect(() => {
    if (beat !== 9 || freezePhase !== 'taken') return;
    const t = setTimeout(() => {
      stopSadMusic(sadMusicRef.current, 0);
      sadMusicRef.current = startSadMusic();
      setState((s) => ({
        ...moveEnemy(s, FREEZE_BISHOP_SQUARE, FREEZE_BAIT_SQUARE),
        status: 'lost',
        kingStunTurns: 0,
      }));
      void playCaptureSound();
      haptic('heavy');
      setFreezePhase('captured');
    }, BISHOP_TAKES_AT);
    return () => clearTimeout(t);
  }, [beat, freezePhase]);

  // Beat 10: the bar glows after each capture.
  useEffect(() => {
    if (!tempoGlow) return;
    const t = setTimeout(() => setTempoGlow(false), TEMPO_GLOW_MS);
    return () => clearTimeout(t);
  }, [tempoGlow]);

  // Beat 10: the bar is full — show the powers popup (new vs upgrade).
  useEffect(() => {
    if (beat !== 10 || tempoStep < TEMPO_PATH.length) return;
    const t = setTimeout(() => {
      setTempoOffer(true);
      haptic('medium');
    }, TEMPO_OFFER_AT);
    return () => clearTimeout(t);
  }, [beat, tempoStep]);

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
    setNudge(false);
    setGlitching(false);
    // Reset per-beat phases HERE, in the same batch as setBeat, so the new
    // beat never renders with the previous beat's phase (no flash).
    setPhase(0);
    if (b >= 4) {
      stopSadMusic(sadMusicRef.current);
      sadMusicRef.current = null;
    }
    setSlowCapture(false);
    if (b !== 6) {
      if (kingShortFadeRef.current) clearTimeout(kingShortFadeRef.current);
      kingShortFadeRef.current = null;
      stopSadMusic(kingMusicRef.current, 300);
      kingMusicRef.current = null;
    }
    if (b === 5) {
      setState(drillState());
      setDrill(0);
    }
    const lent = LENT[b];
    if (lent) {
      setState(lentState(lent.puzzle, b === 7 ? ['knight-hop'] : STARTERS));
      setCast(false);
      setStuck(false);
      if (b === 7) setHopPhase('line');
      if (b === 8) setRevengeLine(null);
      if (b === 9) setFreezePhase('demo');
    }
    if (b === 10) {
      setState(tempoState());
      setTempoStep(0);
      setTempoGlow(false);
      setTempoOffer(false);
      setCast(false);
      setStuck(false);
    }
    if (b === 11) setState(dangerState());
    setBeat(b);
  }, []);

  const next = useCallback(() => {
    // Beat 1 advances its own scene first: arrow → Qxd7 → "fatal error" →
    // Nxg1 (slow-mo).
    if (beat === 1 && phase === 0) {
      haptic('light');
      setPhase(1);
      return;
    }
    if (beat === 1 && phase === 2) {
      haptic('light');
      setPhase(3);
      return;
    }
    if (beat === 1 && phase === 3) {
      haptic('medium');
      setPhase(4);
      stopSadMusic(sadMusicRef.current, 0);
      sadMusicRef.current = startSadMusic();
      return;
    }
    // Beat 5: Next after the stun beat lets the knight take his turn.
    if (beat === 5 && drill === 1) {
      haptic('light');
      setDrill(2);
      return;
    }
    // Beat 7: Next after the sidestep opens the offer.
    if (beat === 7 && hopPhase === 'stepped') {
      haptic('light');
      setHopPhase('offer');
      return;
    }
    if (beat < LAST_BEAT) goTo((beat + 1) as Beat);
  }, [beat, phase, drill, hopPhase, goTo]);

  // Beat 9: Next after the demo rewinds — Rookie back to h5, the knight back
  // on h1 — and the player is on (Freeze Ray first).
  const goToFreezeReady = useCallback(() => {
    haptic('light');
    stopSadMusic(sadMusicRef.current);
    sadMusicRef.current = null;
    setState(lentState(FREEZE_PUZZLE));
    setCast(false);
    setStuck(false);
    setSelected(null);
    setFreezePhase('ready');
  }, []);

  const lent = LENT[beat];
  const won = state.status === 'won';
  const freezeDemo = beat === 9 && freezePhase === 'demo';
  const freezeWaiting = beat === 9 && (freezePhase === 'taken' || freezePhase === 'captured');
  const tempoDone = beat === 10 && tempoStep >= TEMPO_PATH.length;
  // Beat 10: the queen step needs Knight Hop first.
  const tempoNeedsHop = beat === 10 && tempoStep === TEMPO_HOP_STEP && !cast;
  const interactive =
    beat === 5
      ? !won && (drill === 0 || drill === 3 || drill === 6)
      : beat === 7
        ? !won && hopPhase === 'hop'
        : beat === 10
          ? !tempoDone && !stuck
          : lent
            ? !won && !stuck && !freezeWaiting
            : false;

  // ---- Board interaction (beats 5, 7, 8, 9) ---------------------------------
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

      const land = (s: BoardState) => {
        setState(s);
        if (s.status === 'won' || wasCapture) {
          void playCaptureSound();
          hapticSuccess();
        } else {
          void playMoveSound();
          haptic('light');
        }
      };

      if (beat === 5) {
        // Enemies never get a free turn — hand control straight back. The
        // engine rolls an offer when the bar fills; beat 10 shows the real one.
        // The king falls in slow motion, under the full celestial track.
        // The a7 capture keeps the engine's REAL kingStunTurns — the stun
        // beat names the rule while his "Stunned" badge shows. The knight's
        // scripted return (drill 2) clears it.
        if (nextState.status === 'won') playKingCaptureTheme(true);
        land({ ...nextState, turn: 'rookie', pendingOffer: null });
        if (nextState.status === 'won') {
          trackEvent('run_onboarding_backrank_win');
        } else if (drill === 0 && wasCapture) {
          setDrill(1);
        } else if (drill === 3 && toSquare(nextState.rookie) === 'a8') {
          setDrill(4);
          haptic('medium');
        }
        return true;
      }

      if (beat === 9) {
        // Demo: only the knight on h1 — the engine's REAL capture-stun lands
        // on the king, then the bishop answers (effect above).
        if (freezeDemo) {
          if (targetSq !== FREEZE_BAIT_SQUARE) return false;
          land({ ...nextState, turn: 'rookie', pendingOffer: null });
          setFreezePhase('taken');
          return true;
        }
        // Freeze Ray: moving before the bishop is frozen = he's still
        // watching = stuck.
        if (!cast) {
          land({ ...nextState, turn: 'rookie', pendingOffer: null });
          setStuck(true);
          return true;
        }
        if (nextState.status === 'won') playKingCaptureTheme(false);
        land({ ...nextState, turn: 'rookie', pendingOffer: null });
        if (nextState.status === 'won') trackEvent('run_onboarding_freeze_win');
        return true;
      }

      if (beat === 7) {
        // She's a knight. Only the capture ends the beat; a miss is a reset.
        // Tier-1 Knight Hop lasts one move, so the engine reverts her to a
        // rook in the very state that lands on him — the knight would blink
        // into a rook mid-capture. Hold knight form for the rest of the beat;
        // beat 8 remounts the board with a fresh rook.
        if (nextState.status === 'won') playKingCaptureTheme(false);
        land({ ...nextState, turn: 'rookie', pendingOffer: null, form: 'knight', formMovesLeft: 0 });
        if (nextState.status === 'won') trackEvent('run_onboarding_hop_win');
        else setStuck(true);
        return true;
      }

      if (beat === 10) {
        // The player takes each piece; the bar glows with the gain. The queen
        // step is a knight capture — hold knight form so she doesn't blink
        // back into a rook mid-capture (same as beat 7); a miss is a reset.
        const hopping = tempoStep === TEMPO_HOP_STEP;
        land({
          ...nextState,
          turn: 'rookie',
          pendingOffer: null,
          kingStunTurns: 0,
          ...(hopping ? { form: 'knight' as const, formMovesLeft: 0 } : {}),
        });
        if (wasCapture) {
          setTempoStep((n) => n + 1);
          setTempoGlow(true);
        } else if (hopping) {
          setStuck(true);
        }
        return true;
      }

      // Beat 8 — a plain rook move can't reach him and ends the turn;
      // that's the lesson.
      if (nextState.status === 'won') playKingCaptureTheme(false);
      land(nextState);
      if (nextState.status === 'won') {
        trackEvent('run_onboarding_surge_win');
        setRevengeLine(REVENGE_LINES[Math.floor(Math.random() * REVENGE_LINES.length)]);
      } else if (nextState.turn !== 'rookie') {
        setStuck(true);
      }
      return true;
    },
    [beat, cast, drill, freezeDemo, interactive, playKingCaptureTheme, state, tempoStep],
  );

  const onSquareClick = useCallback(
    (square: string) => {
      if (!interactive) return;
      // Beat 9: second tap of Freeze Ray picks the target (the bishop).
      if (state.activeAbility?.step === 'pick-enemy') {
        if (beat === 9 && square !== FREEZE_BISHOP_SQUARE) {
          setNudge(true);
          haptic('medium');
          return;
        }
        const nextState = applyAbilityTargeted(state, state.activeAbility.id, fromSquare(square));
        if (nextState !== state) {
          haptic('medium');
          void playFreezeSound();
          setState(nextState);
          setCast(true);
          trackEvent('run_onboarding_freeze_cast');
        }
        return;
      }
      const rookieSq = toSquare(state.rookie);
      if (square === rookieSq) {
        if ((beat === 8 && !cast) || tempoNeedsHop) {
          setNudge(true);
          haptic('medium');
          return;
        }
        setSelected((s) => (s === rookieSq ? null : rookieSq));
        return;
      }
      if (selected) {
        if (!tryMove(square)) setSelected(null);
      }
    },
    [beat, cast, interactive, selected, state, tempoNeedsHop, tryMove],
  );

  const onPieceDrop = useCallback(
    (_from: string, to: string) => tryMove(to),
    [tryMove],
  );

  // ---- Beat 7: pick Knight Hop (only) -----------------------------------------
  const offer = useMemo(() => starterOffer(), []);
  const onOfferPick = useCallback((option: AbilityOfferOption) => {
    if (option.id !== 'knight-hop') return;
    hapticSuccess();
    trackEvent('run_onboarding_pick', { beat: 7, ability: option.id });
    // It lands in the rack; the player taps it there to transform.
    setHopPhase('armed');
  }, []);

  // ---- Beat 10: the demo popup (either tap moves on) ----------------------------
  const tempoDemo = useMemo(() => demoOffer(), []);
  const onDemoPick = useCallback(
    (option: AbilityOfferOption) => {
      hapticSuccess();
      trackEvent('run_onboarding_demo_pick', { kind: option.kind, ability: option.id });
      setTempoOffer(false);
      goTo(11);
    },
    [goTo],
  );
  const onDemoSkip = useCallback(() => {
    haptic('light');
    setTempoOffer(false);
    goTo(11);
  }, [goTo]);

  // ---- Beats 8-9: cast ------------------------------------------------------
  const onActivateAbility = useCallback(
    (id: AbilityId) => {
      if (lent && id !== lent.id) return; // grayed in the rack; belt and braces
      if (beat === 7) {
        // The first power: tapping Knight Hop in the rack IS the transform.
        if (hopPhase !== 'armed') return;
        const nextState = applyAbilityActivate(state, 'knight-hop');
        if (nextState === state) return;
        setState(nextState);
        setCast(true);
        void playTransformIntoSound();
        haptic('medium');
        glitch();
        setHopPhase('hop');
        return;
      }
      if (!interactive) return;
      if (beat === 10) {
        // The queen step: Knight Hop so she takes her from off the line.
        if (!tempoNeedsHop || id !== 'knight-hop') return;
        const nextState = applyAbilityActivate(state, 'knight-hop');
        if (nextState === state) return;
        setState(nextState);
        setCast(true);
        setNudge(false);
        void playTransformIntoSound();
        haptic('medium');
        glitch();
        return;
      }
      if (state.activeAbility?.id === id) {
        setState((s) => applyAbilityCancel(s));
        return;
      }
      const nextState = applyAbilityActivate(state, id);
      if (nextState === state) return;
      haptic('medium');
      setNudge(false);
      setState(nextState);
      if (id === 'surge') {
        setCast(nextState.bonusMovesLeft > 0);
        if (nextState.bonusMovesLeft > 0) void playSurgeSound();
      }
      // freeze-ray: cast flips when the king is actually tapped (onSquareClick).
    },
    [beat, glitch, hopPhase, interactive, lent, state, tempoNeedsHop],
  );

  const resetBeat = useCallback(() => goTo(beat), [beat, goTo]);

  // ---- Static board (beats 1-4) ----------------------------------------------
  const staticPosition = useMemo(() => {
    if (beat === 1) return scenePosition(phase);
    if (beat === 2) return scenePosition(4);
    return survivorsPosition();
  }, [beat, phase]);
  // Rookie is a plain white rook until beat 3 wakes her up.
  const awake = beat === 4 || (beat === 3 && phase >= 1);
  const staticPieces = useMemo(
    () => ({
      ...defaultPieces,
      wR: awake
        ? () => <RookieCell form="rook" glitching={glitching} />
        : defaultPieces.wR,
    }),
    [awake, glitching],
  );
  const staticSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if ((beat === 2 && phase >= 1) || beat === 3 || beat === 4) {
      // Soft spotlight on the one piece that never left. Not a gold glow.
      styles.a1 = {
        boxShadow: 'inset 0 0 0 3px rgba(42,60,69,0.55), 0 0 16px 3px rgba(42,60,69,0.28)',
        transition: 'box-shadow 600ms ease-out',
      };
    }
    if (beat === 4) {
      styles[KING_SQUARE] = {
        boxShadow: 'inset 0 0 0 3px rgba(229,57,53,0.85)',
      };
    }
    return styles;
  }, [beat, phase]);

  // Beat 2 animates the fade; beats 3-4 pin the dissolved squares at opacity
  // 0 with a PLAIN rule. The old version re-applied the delayed animation in
  // beats 3-4 — if the board library re-created a piece element (it does when
  // the position changes), the animation restarted and, with `both` fill and
  // no `from` keyframe, the piece sat at FULL opacity for its delay window.
  // That was the white flash between the dissolve and the transform.
  const dissolveCss = useMemo(() => {
    if (beat === 2 && phase >= 1) {
      return DISSOLVING_SQUARES.map((sq, i) => {
        const delay = i * 110;
        return `[data-square="${sq}"] > div { animation: rrOnbFadeOut ${DISSOLVE_MS}ms ease-out ${delay}ms both; }`;
      }).join('\n');
    }
    if (beat === 3 || beat === 4) {
      return DISSOLVING_SQUARES.map(
        (sq) => `[data-square="${sq}"] > div { opacity: 0 !important; visibility: hidden; }`,
      ).join('\n');
    }
    return '';
  }, [beat, phase]);

  // Colour drains the moment the king falls and stays gone through beat 2;
  // it returns in beat 3 as Rookie wakes.
  const desaturated =
    (beat === 1 && phase >= 4) ||
    beat === 2 ||
    (beat === 3 && phase < 1) ||
    (beat === 9 && freezePhase === 'captured');
  const gameOver = beat === 1 && phase >= 5;

  // ---- Overlays (arrows + comic bursts) --------------------------------------
  const rookieSq = toSquare(state.rookie);
  const arrows: OverlayArrow[] = (() => {
    if (beat === 1 && (phase === 1 || phase === 2)) return [{ from: QUEEN_FROM, to: QUEEN_TO }];
    // "Fatal error": a yellow foreshadow from the black knight to the white king.
    if (beat === 1 && phase === 3) return [{ from: 'h3', to: 'g1', color: '#FFC800' }];
    if (beat === 5 && !won) {
      if (drill === 0) return [{ from: 'a1', to: 'a7' }];
      if (drill === 3) return [{ from: 'a7', to: 'a8' }];
      if (drill === 5) return [{ from: KING_SQUARE, to: 'f7' }]; // his planned escape
      if (drill === 6 && rookieSq === 'a8') return [{ from: 'a8', to: KING_SQUARE }];
      return [];
    }
    if (beat === 7 && !won) {
      if (hopPhase === 'line') return [{ from: 'a1', to: HOP_KING_FROM }];
      if (hopPhase === 'hop') return [{ from: rookieSq, to: HOP_KING_TO, path: 'L' }];
      return [];
    }
    if (beat === 8 && !won && cast && !stuck) {
      return rookieSq === 'a1'
        ? [{ from: 'a1', to: 'e1' }]
        : [{ from: rookieSq, to: SURGE_KING_SQUARE }];
    }
    if (beat === 9 && !won) {
      if (freezePhase === 'demo') return [{ from: FREEZE_ROOKIE_START, to: FREEZE_BAIT_SQUARE }];
      // The bishop's line onto h1 — what she walked into.
      if (freezePhase === 'taken') return [{ from: FREEZE_BISHOP_SQUARE, to: FREEZE_BAIT_SQUARE, color: '#FFC800' }];
      if (freezePhase === 'ready' && cast && !stuck) {
        const baitAlive = state.pieces.some((p) => toSquare(p) === FREEZE_BAIT_SQUARE);
        if (baitAlive) return rookieSq[0] === 'h' ? [{ from: rookieSq, to: FREEZE_BAIT_SQUARE }] : [];
        if (rookieSq[1] === '1' || rookieSq[0] === 'e') return [{ from: rookieSq, to: FREEZE_KING_SQUARE }];
      }
      return [];
    }
    if (beat === 10 && !tempoDone && !stuck) {
      if (tempoNeedsHop) return [];
      return [{ from: rookieSq, to: TEMPO_PATH[tempoStep], ...(tempoStep === TEMPO_HOP_STEP ? { path: 'L' as const } : {}) }];
    }
    if (beat === 11) return [{ from: DANGER_BISHOP_SQUARE, to: DANGER_ROOKIE_SQUARE, color: '#FFC800' }];
    return [];
  })();
  const bursts: OverlayBurst[] = (() => {
    if (beat === 5 && !won && drill >= 4) return [{ square: KING_SQUARE, text: '!!' }];
    if (beat === 7 && !won && hopPhase === 'stepped') return [{ square: HOP_KING_TO, text: 'ha!' }];
    if (beat === 8) {
      if (won && revengeLine) return [{ square: rookieSq, text: revengeLine, speech: true }];
      if (!won && cast && !stuck && rookieSq !== 'a1') {
        return [{ square: SURGE_KING_SQUARE, text: 'Oh no. I don’t get a move.', speech: true }];
      }
      return [];
    }
    if (beat === 9 && !won && (stuck || freezePhase === 'captured')) {
      return [{ square: freezePhase === 'captured' ? FREEZE_BAIT_SQUARE : FREEZE_BISHOP_SQUARE, text: 'ha!' }];
    }
    return [];
  })();
  const shakes: string[] = beat === 5 && !won && drill >= 4 ? [KING_SQUARE] : [];
  // Blue pointer on the board: the bishop to freeze.
  const pointers: string[] =
    beat === 9 && !won && state.activeAbility?.step === 'pick-enemy' ? [FREEZE_BISHOP_SQUARE] : [];

  // Blue pointer over an ability card in the rack (power beats, before cast).
  const rackPointId: AbilityId | null = (() => {
    if (won || stuck) return null;
    if (beat === 7 && hopPhase === 'armed') return 'knight-hop';
    if (beat === 8 && !cast) return 'surge';
    if (beat === 9 && freezePhase === 'ready' && !cast && !state.activeAbility) return 'freeze-ray';
    if (tempoNeedsHop) return 'knight-hop';
    return null;
  })();

  // ---- DOM-anchored pointer over the rack card ---------------------------------
  const rackRef = useRef<HTMLDivElement | null>(null);
  const [rackPoint, setRackPoint] = useState<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    if (!rackPointId || !rackRef.current) {
      setRackPoint(null);
      return;
    }
    const measure = () => {
      const host = rackRef.current;
      if (!host) return;
      const idx = state.abilities.findIndex((a) => a.id === rackPointId);
      const cards = host.querySelectorAll('button');
      const card = cards[idx];
      if (!card) {
        setRackPoint(null);
        return;
      }
      const h = host.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      setRackPoint({ x: c.left - h.left + c.width / 2, y: c.top - h.top - 30 });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [rackPointId, state.abilities]);

  // ---- Copy ------------------------------------------------------------------
  const caption = (() => {
    switch (beat) {
      case 1:
        if (phase === 0) return 'Rookie’s Revenge is about an ordinary game of chess.';
        if (phase <= 2) return 'White captured the knight.';
        if (phase === 3) return 'But this was a fatal error.';
        return 'The knight captured the king.';
      case 2:
        return 'The game was over for everyone but Rookie.';
      case 3:
        // Hold beat 2's line until she wakes — no redundant "game over" flash.
        if (phase < 1) return 'The game was over for everyone but Rookie.';
        if (phase === 1) return 'Rookie wanted revenge. And she was transformed.';
        return 'No longer a white piece, or a black piece. A living piece.';
      case 4:
        return 'Rookie is going to finish this game. That means she has to capture the black king.';
      case 5:
        if (won) return 'Got him. Rooks can capture anything in a straight line.';
        if (drill === 0) return 'Rooks move in straight lines. Help Rookie capture that pawn on a7.';
        if (drill === 1) return 'Every capture stuns the king. Take a piece and he can’t run.';
        if (drill === 2) return 'The knight hurries back. Too late.';
        if (drill === 3) return 'Up to a8. Then she’s on the 8th rank.';
        if (drill === 4) return 'She’s on the 8th rank. The king’s rank. He panics.';
        if (drill === 5) return 'He makes a door to escape.';
        return 'Too late.';
      case 6:
        return 'This is Rookie’s Revenge. The game after the game.';
      case 7:
        if (won) return 'Got him. Powers get Rookie where a rook can’t.';
        if (stuck) return 'Missed him. Reset and land on the king.';
        if (hopPhase === 'line') return 'The rook is looking at the king.';
        if (hopPhase === 'stepped' || hopPhase === 'offer') return 'But the king steps out of the way.';
        if (hopPhase === 'armed') return 'Knight Hop is in her rack. Tap it.';
        return 'Rookie transforms into a knight. Have no mercy. Move in an L-shape and capture the king.';
      case 8:
        if (won) return 'Two moves, one turn. He never saw it.';
        if (stuck) return 'One move, then it’s his turn. Surge first — then move twice.';
        if (cast) return 'Two moves. Get on his line, then take him.';
        if (nudge) return 'Tap Surge first. Then she moves twice.';
        return 'The next ability: Surge. It moves you twice in a row. Tap Surge.';
      case 9: {
        const baitAlive = state.pieces.some((p) => toSquare(p) === FREEZE_BAIT_SQUARE);
        if (won) return 'Frozen. Got him. Revenge is a dish best served cold.';
        if (stuck) return 'The bishop is still watching h1. Freeze him first.';
        if (freezePhase === 'demo') return 'That knight on h1 is free. Take it, and the king is stunned.';
        if (freezePhase === 'taken') return 'The king is stunned. But the bishop was watching h1…';
        if (freezePhase === 'captured') return 'The bishop takes Rookie. If you lose her, you lose the game.';
        if (cast) return baitAlive ? 'The bishop is frozen. Now take the knight on h1.' : 'The king is stunned. Take him.';
        if (state.activeAbility?.step === 'pick-enemy') return 'Now tap the bishop on g2.';
        return 'This is where Freeze Ray comes in handy. Tap Freeze Ray.';
      }
      case 10:
        if (stuck) return 'Missed her. Reset and land on the queen.';
        if (tempoStep === 0) return 'One more thing. Every capture fills the tempo bar.';
        if (tempoStep === 1) return `A pawn fills it by ${TEMPO_REWARD.pawn}.`;
        if (tempoStep === 2) {
          if (cast) return 'Rookie is a knight. Take the queen.';
          return `A minor piece (knight or bishop) fills it by ${TEMPO_REWARD.knight}. The queen is next.`;
        }
        return `A queen fills it by ${TEMPO_REWARD.queen}. Full bar: Rookie picks a new power, or upgrades one.`;
      case 11:
        return 'When Rookie is attacked, she turns red.';
      case 12:
        return 'You’re ready to play';
    }
  })();

  /** One plain-English line under the caption for the power beats. */
  const explain = (() => {
    if (won || stuck) return null;
    if (beat === 7 && hopPhase === 'armed') return 'Rookie can have powers. Tap Knight Hop to transform.';
    if (beat === 7 && hopPhase === 'hop') return 'Two up, one over.';
    if (beat === 8 && !cast) return 'Surge moves twice in a row.';
    if (beat === 9 && freezePhase === 'ready' && !cast && !state.activeAbility) {
      return 'Freeze Ray stops one piece for a turn. A frozen bishop can’t take her.';
    }
    if (beat === 9 && freezePhase === 'ready' && cast) {
      const baitAlive = state.pieces.some((p) => toSquare(p) === FREEZE_BAIT_SQUARE);
      return baitAlive
        ? 'Take the knight on h1 first. Then along the rank to the king.'
        : 'A frozen bishop can’t touch her. Along the rank — take him.';
    }
    if (tempoNeedsHop) return 'A rook on the queen’s line is in her sights. Tap Knight Hop and take her from the side.';
    if (beat === 10 && tempoStep === TEMPO_HOP_STEP && cast) return 'One up, one over, one up.';
    if (beat === 11) return 'If you lose her, you lose the game. Move her somewhere safe, or take the attacker.';
    return null;
  })();

  const chip = (() => {
    switch (beat) {
      case 4:
        return 'Capture the king.';
      case 5:
        // The stun beat gets no chip — the caption + his badge carry the rule.
        if (drill === 1) return null;
        return drill >= 2 ? 'Every capture charges tempo.' : 'Rooks move in straight lines.';
      case 6:
        return 'Capture the king. Every level.';
      case 7:
        return won ? null : hopPhase === 'hop' || hopPhase === 'armed' ? 'Powers change how she moves.' : 'Full bar = pick a power.';
      case 8:
      case 9:
        return won ? null : 'Powers live in the rack. Tap to cast.';
      case 10:
        return tempoDone ? 'Capture pieces. Claim powers. Take the king.' : 'Captures charge tempo.';
      case 11:
        return 'Red = danger. Keep her safe.';
      default:
        return null;
    }
  })();

  const hint = (() => {
    switch (beat) {
      case 5:
        if (won) return null;
        if (drill === 1) return null; // Next button takes over (stun beat)
        if (drill === 2 || drill === 4 || drill === 5) return ' ';
        if (drill === 0) return 'Tap Rookie, then the pawn on a7.';
        if (drill === 3) return 'Tap Rookie, then a8.';
        return 'Tap Rookie, then the king on g8.';
      case 7:
        if (won) return null;
        if (hopPhase === 'hop') return 'Tap Rookie, then the king on b3.';
        if (hopPhase === 'armed') return 'Tap the Knight Hop card.';
        if (hopPhase === 'line') return ' ';
        return null; // Next button takes over
      case 8:
        return cast ? 'Tap Rookie, then e1. Then the king.' : 'Tap the Surge card.';
      case 9: {
        if (freezePhase === 'captured') return null; // Next button takes over
        if (freezePhase === 'demo') return 'Tap Rookie, then the knight on h1.';
        if (freezePhase === 'taken') return ' ';
        if (cast) {
          const baitAlive = state.pieces.some((p) => toSquare(p) === FREEZE_BAIT_SQUARE);
          return baitAlive ? 'Tap Rookie, then h1.' : 'Tap Rookie, then the king on e1.';
        }
        return state.activeAbility?.step === 'pick-enemy'
          ? 'Tap the bishop on g2.'
          : 'Tap the Freeze Ray card.';
      }
      case 10:
        if (tempoDone) return null;
        if (tempoNeedsHop) return 'Tap the Knight Hop card.';
        return `Tap Rookie, then ${TEMPO_PATH[tempoStep]}.`;
      case 11:
        return null; // Next button takes over
      default:
        return null;
    }
  })();

  const showOffer = beat === 7 && hopPhase === 'offer';
  const showRunBoard = beat === 5 || beat === 6 || beat === 10 || beat === 11 || lent !== undefined;
  const runBoardKey =
    beat === 5 || beat === 6
      ? 'onboarding-drill'
      : beat === 10
        ? 'onboarding-tempo'
        : beat === 11
          ? 'onboarding-danger'
          : lent?.key ?? 'onboarding';
  useNavyShell(true);
  // Beat 1 hides Next while the queen's arrow lands and during the slow-mo capture.
  const showNext = !(beat === 1 && (phase === 1 || phase === 4));
  const finalScreen = beat === LAST_BEAT;

  return (
    <div
      className="relative min-h-full w-full text-white flex items-center justify-center px-3 py-4 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 100%)`,
      }}
    >
      <style>{`
        @keyframes rrOnbFadeOut {
          to { opacity: 0; transform: translateY(6%) scale(0.85); filter: blur(2px); }
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
        @keyframes rrOnbStampIn {
          from { transform: rotate(-10deg) scale(2.2); opacity: 0; }
          to   { transform: rotate(-10deg) scale(1); opacity: 0.88; }
        }
        @keyframes rrOnbNudge {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-3px); }
          40%, 80% { transform: translateX(3px); }
        }
        @keyframes rrOnbTempoGlow {
          0%   { box-shadow: 0 0 0 0 rgba(255,200,0,0.0); transform: scale(1); }
          25%  { box-shadow: 0 0 0 4px rgba(255,200,0,0.55), 0 0 18px 4px rgba(255,200,0,0.45); transform: scale(1.03); }
          100% { box-shadow: 0 0 0 0 rgba(255,200,0,0); transform: scale(1); }
        }
        .rr-onb-tempo-glow { animation: rrOnbTempoGlow 1100ms ease-out both; }
        @keyframes rrOnbFinalIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        .rr-onb-pulse { animation: rrOnbPulseRing 1.3s ease-out infinite; border-radius: 12px; }
        .rr-onb-nudge { animation: rrOnbNudge 360ms ease-in-out; }
        ${dissolveCss}
      `}</style>

      {/* Backdrop: faint oversized board squares + the revenge mark, low opacity */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%), linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%)',
          backgroundSize: '96px 96px',
          backgroundPosition: '0 0, 48px 48px',
          maskImage: 'radial-gradient(80% 70% at 50% 45%, transparent 35%, #000 100%)',
          WebkitMaskImage: 'radial-gradient(80% 70% at 50% 45%, transparent 35%, #000 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ right: -70, bottom: -70, opacity: 0.12 }}
      >
        <RevengeMarkSvg size={300} />
      </div>

      <div
        className="relative w-full max-w-[360px] rounded-2xl p-3 flex flex-col gap-2.5"
        style={{
          background: `linear-gradient(180deg, ${PANEL} 0%, ${NAVY} 100%)`,
          border: `2px solid ${PANEL_EDGE}`,
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.12), 0 10px 26px rgba(0,0,0,0.45)',
        }}
      >
        {/* Header: logo + skip */}
        <div className="flex items-center justify-between">
          <RookiesRevengeLogo scale={0.3} dark />
          {!finalScreen && (
            <button
              type="button"
              onClick={() => finish('skipped')}
              className="min-h-[44px] min-w-[44px] px-2 -mr-2 text-[11px] uppercase tracking-[0.18em] font-bold text-white/60 active:opacity-60"
            >
              Skip
            </button>
          )}
        </div>

        {finalScreen ? (
          /* Beat 11: the final screen */
          <div
            className="flex flex-col items-center gap-3 py-2"
            style={{ animation: 'rrOnbFinalIn 480ms cubic-bezier(0.2, 1.4, 0.4, 1) both' }}
          >
            <RevengeLockOn />
            <p className="text-[22px] font-black leading-tight text-white text-center px-2 -mt-1">
              {caption}
            </p>
            {/* Brand lockup wordmark — same recipe as RookiesRevengeLogoStacked */}
            <div className="flex flex-col items-center leading-none -mt-1">
              <div className="font-black tracking-tight" style={{ fontSize: 26, color: '#fff' }}>
                Rookie&rsquo;s
              </div>
              <div
                className="font-black tracking-tight text-white"
                style={{
                  fontSize: 32,
                  background: REVENGE_RED,
                  padding: '6px 16px',
                  borderRadius: 11,
                  boxShadow: `0 4px 0 ${REVENGE_RED_DARK}`,
                  marginTop: 4,
                  letterSpacing: '-0.02em',
                }}
              >
                REVENGE
              </div>
            </div>
            <p className="text-[12px] font-bold text-white/70 text-center">
              Capture pieces. Claim powers. Take the king.
            </p>
            <button
              type="button"
              onClick={() => finish('completed')}
              className="w-full py-4 min-h-[56px] rounded-2xl text-white font-black text-[17px] tracking-wide active:translate-y-px transition-transform"
              style={CTA_STYLE}
            >
              Play Rookie’s Revenge <span className="opacity-80">&rarr;</span>
            </button>
          </div>
        ) : (
          <>
            {/* Caption */}
            <p
              key={caption}
              className="text-[15px] font-black leading-snug text-white min-h-[42px]"
              style={{ animation: 'rrOnbCaptionIn 320ms ease-out both' }}
            >
              {caption}
            </p>
            {explain && (
              <p
                key={explain}
                className="-mt-1 text-[12px] font-bold leading-snug text-white/70"
                style={{ animation: 'rrOnbCaptionIn 320ms ease-out both' }}
              >
                {explain}
              </p>
            )}

            {/* Board (beats 1-10) */}
            <div
              className={`relative w-full${nudge ? ' rr-onb-nudge' : ''}`}
              style={{
                filter: desaturated ? 'grayscale(1) contrast(1.08) brightness(0.96)' : 'none',
                transition: 'filter 1400ms ease-out',
              }}
              onAnimationEnd={() => setNudge(false)}
            >
              {showRunBoard ? (
                <RunBoard
                  key={runBoardKey}
                  state={state}
                  hideGoalRank
                  slideMs={slowCapture ? KING_CAPTURE_SLOWMO_MS : undefined}
                  glitching={glitching}
                  selectedSquare={selected}
                  abilityFx={state.lastAbilityFx ?? null}
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
                    animationDurationInMs: beat === 1 && phase === 2 ? KNIGHT_SLOWMO_MS : 420,
                  }}
                />
              )}
              <BoardOverlay arrows={arrows} bursts={bursts} shakes={shakes} pointers={pointers} />
              {/* Beat 1: the GAME OVER stamp — dims the board under a slanted stamp */}
              {gameOver && (
                <div
                  aria-hidden
                  className="absolute inset-0 z-[7] flex items-center justify-center pointer-events-none"
                  style={{
                    background: 'rgba(20,28,32,0.42)',
                    animation: 'rrOnbCaptionIn 400ms ease-out both',
                  }}
                >
                  <div
                    className="font-black uppercase tracking-[0.12em] text-white select-none"
                    style={{
                      fontSize: 38,
                      lineHeight: 1,
                      padding: '10px 18px',
                      border: '4px solid rgba(255,255,255,0.85)',
                      borderRadius: 10,
                      opacity: 0.88,
                      textShadow: '0 2px 0 rgba(0,0,0,0.35)',
                      animation: 'rrOnbStampIn 520ms cubic-bezier(0.2, 1.4, 0.4, 1) both',
                    }}
                  >
                    Game Over
                  </div>
                </div>
              )}
            </div>

            {/* Tempo bar — interactive beats only */}
            {showRunBoard && (
              <div className={tempoGlow ? 'rr-onb-tempo-glow' : undefined} style={{ borderRadius: 8 }}>
                <TempoBar
                  tempo={state.tempo}
                  max={tempoMaxFor(state)}
                  form={state.form}
                  formMovesLeft={state.formMovesLeft}
                />
              </div>
            )}

            {/* Ability rack — lent-power beats (pulses until the power is cast) */}
            {(lent || beat === 10) && !(beat === 7 && hopPhase !== 'hop' && hopPhase !== 'armed') && (
              <div
                ref={rackRef}
                className={`relative${rackPointId ? ' rr-onb-pulse' : ''}`}
                data-testid="onboarding-rack"
              >
                <AbilityRack
                  abilities={state.abilities}
                  activeId={state.activeAbility?.id ?? null}
                  disabledIds={lent ? STARTERS.filter((id) => id !== lent.id) : []}
                  onActivate={onActivateAbility}
                />
                {rackPoint && (
                  <PointerArrow
                    style={{ position: 'absolute', left: rackPoint.x, top: rackPoint.y }}
                  />
                )}
              </div>
            )}

            {/* Rule chip — fixed-height slot so the card doesn't jump */}
            <div className="min-h-[28px] flex items-center">
              {chip && (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0a1230] border border-[#3a4f8f] px-3 py-1 text-[11px] font-bold text-white"
                  style={{ animation: 'rrOnbCaptionIn 320ms ease-out both' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFC800]" />
                  {chip}
                </span>
              )}
            </div>

            {/* CTA */}
            {stuck ? (
              <button type="button" onClick={resetBeat} className={CTA_CLASS} style={CTA_STYLE}>
                Reset
              </button>
            ) : beat === 9 && freezePhase === 'captured' ? (
              <button type="button" onClick={goToFreezeReady} className={CTA_CLASS} style={CTA_STYLE}>
                Next <span className="opacity-80">&rarr;</span>
              </button>
            ) : hint && !won ? (
              <p className="text-center text-[11px] text-white/60 italic min-h-[44px] flex items-center justify-center">
                {hint}
              </p>
            ) : beat === 10 && !tempoDone ? (
              <p className="min-h-[44px]" />
            ) : showNext ? (
              <button type="button" onClick={next} className={CTA_CLASS} style={CTA_STYLE}>
                Next <span className="opacity-80">&rarr;</span>
              </button>
            ) : (
              <p className="min-h-[44px]" />
            )}
          </>
        )}
      </div>

      {showOffer && (
        <AbilityOfferModal
          offer={offer}
          onPick={onOfferPick}
          onSkip={() => undefined}
          reason="level"
          selectableIds={['knight-hop']}
          pointAtId="knight-hop"
          title="Rookie can have powers."
          subtitle="Tap Knight Hop."
        />
      )}

      {tempoOffer && (
        <AbilityOfferModal
          offer={tempoDemo}
          onPick={onDemoPick}
          onSkip={onDemoSkip}
          reason="tempo"
          title="Tempo full. Pick a new power, or upgrade one."
          subtitle="Tap either to see how it works."
        />
      )}
    </div>
  );
}
