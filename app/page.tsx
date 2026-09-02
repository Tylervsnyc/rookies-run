'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RunBoard } from '@/components/run/Board';
import { LevelClearedModal } from '@/components/run/LevelClearedModal';
import { LevelLostModal } from '@/components/run/LevelLostModal';
import { RunSummaryModal } from '@/components/run/RunSummaryModal';
import { computeStats, readHistory, recordRun } from '@/lib/run/history';
import { AbilityRack } from '@/components/run/AbilityRack';
import { AbilityOfferModal } from '@/components/run/AbilityOfferModal';
import { preloadAbilityArt } from '@/components/run/AbilityCard';
import { RunLanding } from '@/components/run/RunLanding';
import { HomeLanding } from '@/components/run/HomeLanding';
import { submitScore } from '@/lib/run/leaderboard-client';
import { ONBOARDING_KEY, StoryOnboarding } from '@/components/run/StoryOnboarding';
import { RulesInline } from '@/components/run/RulesInline';
import { TempoHelpModal } from '@/components/run/TempoHelpModal';
import { RunPickerModal } from '@/components/run/RunPickerModal';
import { RookiesRevengeLogo } from '@/components/run/RookiesRevengeLogo';
import { StcRunLogo } from '@/components/run/StcRunLogo';
import { TempoBar } from '@/components/run/TempoBar';
import { MusicMenu } from '@/components/run/MusicMenu';
import { startMusicIfEnabled } from '@/lib/music';
import { TrophyGlyph } from '@/components/run/AchievementToast';
import { RunAchievementPop } from '@/components/achievements/RunAchievementPop';
import { AbilityUnlockModal } from '@/components/run/AbilityUnlockModal';
import { TrophyRoom } from '@/components/run/TrophyRoom';
import { useProgress } from '@/hooks/useProgress';
import { readProfile, recordBest, recordLadderResult, setDifficulty as persistDifficulty } from '@/lib/run/profile';
import { isLadderRunId } from '@/lib/run/ladder';
import { DIFFICULTIES, isDifficultyId, isDifficultyLocked, type DifficultyId } from '@/lib/run/difficulty';
import { tempoMaxFor } from '@/lib/run/scoring';
import { trackEvent } from '@/lib/analytics/posthog';
import {
  playCaptureSound,
  playCardDrawSound,
  playCardPlaySound,
  playLevelClearSound,
  playMoveSound,
  warmupAudio, playTransformBackSound, playTransformIntoSound, playFreezeSound, playSurgeSound } from '@/lib/sounds';
import { haptic, hapticError, hapticSuccess } from '@/lib/haptics';
import {
  ABILITY_DEFS,
  abilityLegalMoves,
  applyAbilityActivate,
  applyAbilityCancel,
  applyAbilityMove,
  applyAbilityTargeted,
  applyControlledAllyMove,
  canMoveAllyAt,
  controlledAllyAt,
  applyDismissOffer,
  applyOfferPick,
  convertTargets as computeConvertTargets,
  magnetTargets as computeMagnetTargets,
  maxUsesForTier,
  type AbilityId,
  type AbilityOfferOption,
  type AbilityTier,
  type OwnedAbility,
} from '@/lib/run/abilities';
import { applyRookieMove, stepDroneTurn, stepEnemyTurn } from '@/lib/run/engine';
import { stepAllyTurnReactive as stepAllyTurn } from '@/lib/run/pawn-ai';
import { isUnwinnable } from '@/lib/run/solver';
import { ALLY_TICK_MS, DRONE_TICK_MS, ENEMY_CAPTURE_SLIDE_MS, ENEMY_TICK_MS } from '@/components/run/timing';
import {
  REVENGE_RUN_IDS,
  DEFAULT_RUN_ID,
  getNextRevengeRunId,
  getRunById,
  isKnownRunId,
} from '@/lib/run/runs';
import {
  puzzleForDate,
  puzzleToBoardState,
  todayISO,
  totalLevelsForRun,
} from '@/lib/run/seed';
import { getRunIdForDate, getTodayInTZ, isValidDate } from '@/lib/run/daily';
import { buildShareString } from '@/lib/run/share';
import { fromSquare, toSquare } from '@/lib/run/types';
import type { BoardState, Coord, RunPuzzle } from '@/lib/run/types';

/**
 * Rookies Run — Sprint 3.
 *
 * 10-level single daily run. Capturing pieces grants tempo; filling the tempo
 * meter offers 3 ability choices (new ability or upgrade). Abilities are
 * permanent for the run and live in the rack below the board.
 */

/**
 * DEV-ONLY parity hook (scripts/run-playtest/revenge-parity.ts). Never
 * active in production builds. `?parity=1&seed=<u32>&file=<1-8>
 * &loadout=surge:1,freeze-ray:1&difficulty=normal` pins the enemy-AI seed,
 * Rookie's start file, a starting loadout and the difficulty so the headless
 * harness and the real app can be stepped side by side from an identical
 * BoardState. The live state is mirrored to `window.__rrParity` so the
 * driver can wait for the enemy phase and diff every field, not just the DOM.
 */
interface ParityHook {
  seed: number;
  file: number | null;
  loadout: OwnedAbility[];
  difficulty: DifficultyId | null;
}

/**
 * Standalone `?loadout=surge:1,duchess:5` — a starting loadout by explicit
 * URL, working in PRODUCTION too (the /review page's Play links; testing-stage
 * summons are meant to be reachable by URL, same as `?run=revenge-7`).
 * Strict: applied only when EVERY id resolves in ABILITY_DEFS — a typo means
 * no loadout, never half of one. `?parity=1` keeps its own (lenient, dev-only)
 * parser and wins when both are present.
 */
function readLoadoutParam(params: URLSearchParams): OwnedAbility[] | null {
  const raw = params.get('loadout');
  if (!raw) return null;
  const loadout: OwnedAbility[] = [];
  for (const entry of raw.split(',')) {
    if (!entry) continue;
    const [id, tierRaw] = entry.split(':');
    if (!id || !(id in ABILITY_DEFS)) return null;
    const tier = Math.min(5, Math.max(1, parseInt(tierRaw ?? '1', 10) || 1)) as AbilityTier;
    loadout.push({ id: id as AbilityId, tier, mutations: [], usesLeftThisLevel: maxUsesForTier(id as AbilityId, tier) });
  }
  return loadout.length > 0 ? loadout : null;
}

function readParityHook(params: URLSearchParams): ParityHook | null {
  if (process.env.NODE_ENV === 'production') return null;
  if (params.get('parity') !== '1') return null;
  const seed = parseInt(params.get('seed') ?? '', 10);
  const fileRaw = parseInt(params.get('file') ?? '', 10);
  const loadout: OwnedAbility[] = [];
  for (const entry of (params.get('loadout') ?? '').split(',')) {
    const [id, tierRaw] = entry.split(':');
    if (!id || !(id in ABILITY_DEFS)) continue;
    const tier = Math.min(5, Math.max(1, parseInt(tierRaw ?? '1', 10) || 1)) as AbilityTier;
    loadout.push({ id: id as AbilityId, tier, mutations: [], usesLeftThisLevel: maxUsesForTier(id as AbilityId, tier) });
  }
  const d = params.get('difficulty');
  return {
    seed: Number.isFinite(seed) && seed > 0 ? seed >>> 0 : 1,
    file: fileRaw >= 1 && fileRaw <= 8 ? fileRaw : null,
    loadout,
    difficulty: isDifficultyId(d) ? d : null,
  };
}

function readUrlParams(): { runId: string; startLevelIndex: number; date: string; ladder: boolean; loadout: OwnedAbility[] | null; parity: ParityHook | null } {
  if (typeof window === 'undefined') {
    return { runId: '', startLevelIndex: 0, date: '', ladder: false, loadout: null, parity: null };
  }
  const params = new URLSearchParams(window.location.search);
  const runId = params.get('run') ?? '';
  const dateParam = params.get('date') ?? '';
  const date = isValidDate(dateParam) ? dateParam : '';
  const levelStr = params.get('level');
  let startLevelIndex = 0;
  if (levelStr) {
    const n = parseInt(levelStr, 10);
    if (!Number.isNaN(n) && n >= 1) startLevelIndex = n - 1;
  }
  const ladder = params.get('ladder') === '1';
  return { runId, startLevelIndex, date, ladder, loadout: readLoadoutParam(params), parity: readParityHook(params) };
}

function readSavedRunId(): string {
  if (typeof window === 'undefined') return DEFAULT_RUN_ID;
  return localStorage.getItem('rookies-run-current') ?? DEFAULT_RUN_ID;
}

interface RunMeta {
  iso: string;
  runId: string;
  startLevelIndex: number;
  /**
   * The run was launched from The Ladder (`?ladder=1&run=<id>`): skip the
   * home screen, force Normal rules, and record the result to profile.ladder.
   */
  ladder: boolean;
  /** Standalone `?loadout=` starting kit (works in production); parity wins over it. */
  loadout: OwnedAbility[] | null;
  /** Dev-only; null in production and whenever `?parity=1` is absent. */
  parity: ParityHook | null;
  /**
   * `?level=N` (N>1) jumped this run mid-way — a playtest/dev launch, not a
   * real climb. No score, ladder, daily-completion, best or history side
   * effects may fire for it.
   */
  levelJump: boolean;
}

function freshRun(
  iso: string,
  runId: string,
  startLevelIndex: number,
  parity: ParityHook | null = null,
  forceDifficulty: DifficultyId | null = null,
  loadout: OwnedAbility[] | null = null,
): { state: BoardState; puzzle: RunPuzzle } {
  const puzzle = puzzleForDate(iso, startLevelIndex, runId);
  const profile = readProfile();
  if (parity) {
    // Same builder the harness uses (puzzleToBoardState), same inputs. The
    // start file is overridden after the fact because randomizedRookieStart
    // draws from Math.random — the harness does the identical override.
    const built = puzzleToBoardState(puzzle, {
      runId,
      unlockedAbilities: profile.unlockedAbilities,
      difficulty: parity.difficulty ?? profile.difficulty,
      aiRngSeed: parity.seed,
      abilities: parity.loadout,
    });
    return {
      state: parity.file ? { ...built, rookie: { file: parity.file, rank: built.rookie.rank } } : built,
      puzzle,
    };
  }
  return {
    state: puzzleToBoardState(puzzle, {
      runId,
      unlockedAbilities: profile.unlockedAbilities,
      // Ladder runs always play on Normal rules; the profile difficulty is
      // a DAILY-only concept and is left untouched.
      difficulty: forceDifficulty ?? profile.difficulty,
      ...(loadout ? { abilities: loadout } : {}),
    }),
    puzzle,
  };
}

export default function RookiesRunPage() {
  const meta: RunMeta = useMemo(() => {
    const url = readUrlParams();
    const tz = typeof window !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      : 'UTC';
    const iso = url.date || (typeof window !== 'undefined' ? getTodayInTZ(tz) : todayISO());
    // Date-locked deep links (e.g. /[date] → /?date=...&run=...) always
    // win. Otherwise: explicit ?run= → localStorage → today's daily rotation.
    const dailyRunForDate = getRunIdForDate(iso);
    let runId: string;
    if (url.date) {
      runId = url.runId && isKnownRunId(url.runId) ? url.runId : dailyRunForDate;
    } else {
      runId = url.runId || readSavedRunId();
      // Surface separation: a bare /run with no ?run= must never resolve to an
      // STC run from a stale localStorage entry — STC lives behind /run/stc only.
      if (!url.runId && runId.startsWith('stc-')) {
        runId = dailyRunForDate;
      }
      // Rookie's Revenge is the game now: a stale classic-run id in
      // localStorage must not keep a returning player on rank-8 runs.
      if (!url.runId && !REVENGE_RUN_IDS.includes(runId)) {
        runId = dailyRunForDate;
      }
      if (
        !url.runId &&
        typeof window !== 'undefined' &&
        !localStorage.getItem('rookies-run-current')
      ) {
        runId = dailyRunForDate;
      }
    }
    const validRunId = isKnownRunId(runId) ? runId : dailyRunForDate;
    // A Ladder launch only counts when the exact requested run resolved —
    // a fallback to the daily must never record a ladder result.
    const ladder = url.ladder && !!url.runId && validRunId === url.runId && isLadderRunId(validRunId);
    if (typeof window !== 'undefined' && !url.date && !ladder) {
      localStorage.setItem('rookies-run-current', validRunId);
    }
    const maxLevel = totalLevelsForRun(validRunId) - 1;
    const startLevelIndex = Math.min(url.startLevelIndex, maxLevel);
    return {
      iso,
      runId: validRunId,
      startLevelIndex,
      ladder,
      loadout: url.loadout,
      parity: url.parity,
      levelJump: startLevelIndex > 0,
    };
  }, []);

  const runDef = useMemo(() => getRunById(meta.runId), [meta.runId]);
  const totalLevels = runDef.levels.length;
  const isStc = meta.runId.startsWith('stc-');

  const [levelIndex, setLevelIndex] = useState(meta.startLevelIndex);
  const initial = useMemo(
    () => freshRun(meta.iso, meta.runId, meta.startLevelIndex, meta.parity, meta.ladder ? 'normal' : null, meta.loadout),
    [meta.iso, meta.runId, meta.startLevelIndex, meta.parity, meta.ladder, meta.loadout],
  );
  const [state, setState] = useState<BoardState>(initial.state);
  const [puzzle, setPuzzle] = useState<RunPuzzle>(initial.puzzle);

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  // Per-ability cast VFX — phase-step ghost / leap arc /
  // freeze-ray beam / poison or rabies dart. Cleared after the matching anim ends.
  type AbilityFx = NonNullable<BoardState['lastAbilityFx']>;
  const [abilityFx, setAbilityFx] = useState<AbilityFx | null>(null);
  const lastAbilityFxIdRef = useRef<number | null>(null);

  // Aegis intercept VFX — attacker lunges at Rookie then bounces back, plus a
  // light-blue shield ripple at Rookie's square. Cleared after the anim ends.
  const [aegisFx, setAegisFx] = useState<
    { attackerSquare: string; rookieSquare: string; id: number } | null
  >(null);
  const lastAegisIdRef = useRef<number | null>(null);
  // Warm ability art at run start so the offer modal never shows blank cards.
  useEffect(() => {
    preloadAbilityArt(Object.keys(ABILITY_DEFS) as (keyof typeof ABILITY_DEFS)[]);
  }, []);
  useEffect(() => {
    const sig = state.lastAegisIntercept;
    if (!sig) return;
    if (lastAegisIdRef.current === sig.id) return;
    lastAegisIdRef.current = sig.id;
    setAegisFx({ ...sig });
  }, [state.lastAegisIntercept]);
  useEffect(() => {
    if (!aegisFx) return;
    const t = setTimeout(() => setAegisFx(null), 720);
    return () => clearTimeout(t);
  }, [aegisFx]);

  // Become-King impervious bounce VFX — distinct gold/royal-themed.
  const [imperviousFx, setImperviousFx] = useState<
    { attackerSquare: string; rookieSquare: string; id: number } | null
  >(null);
  const lastImperviousIdRef = useRef<number | null>(null);
  useEffect(() => {
    const sig = state.lastImperviousBounce;
    if (!sig) return;
    if (lastImperviousIdRef.current === sig.id) return;
    lastImperviousIdRef.current = sig.id;
    setImperviousFx({ ...sig });
  }, [state.lastImperviousBounce]);
  useEffect(() => {
    if (!imperviousFx) return;
    const t = setTimeout(() => setImperviousFx(null), 700);
    return () => clearTimeout(t);
  }, [imperviousFx]);

  useEffect(() => {
    const sig = state.lastAbilityFx;
    if (!sig) return;
    if (lastAbilityFxIdRef.current === sig.id) return;
    lastAbilityFxIdRef.current = sig.id;
    setAbilityFx({ ...sig });
  }, [state.lastAbilityFx]);
  useEffect(() => {
    if (!abilityFx) return;
    const durations: Record<AbilityFx['kind'], number> = {
      'freeze-ray': 700,
      'poison-dart': 900,
      'rabies-dart': 900,
      convert: 500,
      drones: 800,
      boulder: 600,
      smoke: 900,
      rewind: 800,
      magnet: 700,
      bodyguard: 600,
      'summon-knight': 600,
    };
    const t = setTimeout(() => setAbilityFx(null), durations[abilityFx.kind]);
    return () => clearTimeout(t);
  }, [abilityFx]);

  // Poison-death VFX — green bubbles drowning each piece whose poison timer
  // ticked to 0 this enemy turn.
  type PoisonDeathFx = NonNullable<BoardState['lastPoisonDeath']>;
  const [poisonDeathFx, setPoisonDeathFx] = useState<PoisonDeathFx | null>(null);
  const lastPoisonDeathIdRef = useRef<number | null>(null);
  useEffect(() => {
    const sig = state.lastPoisonDeath;
    if (!sig) return;
    if (lastPoisonDeathIdRef.current === sig.id) return;
    lastPoisonDeathIdRef.current = sig.id;
    setPoisonDeathFx({ ...sig });
  }, [state.lastPoisonDeath]);
  useEffect(() => {
    if (!poisonDeathFx) return;
    const t = setTimeout(() => setPoisonDeathFx(null), 1100);
    return () => clearTimeout(t);
  }, [poisonDeathFx]);

  // Enemy-on-enemy capture VFX — overlay slide of the attacker sprite from
  // its origin square to the victim's square. Triggered by rabid friendly fire.
  type EnemyCaptureFx = NonNullable<BoardState['lastEnemyCaptureFx']>;
  const [enemyCaptureFx, setEnemyCaptureFx] = useState<EnemyCaptureFx | null>(null);
  const lastEnemyCaptureIdRef = useRef<number | null>(null);
  useEffect(() => {
    const sig = state.lastEnemyCaptureFx;
    if (!sig) return;
    if (lastEnemyCaptureIdRef.current === sig.id) return;
    lastEnemyCaptureIdRef.current = sig.id;
    setEnemyCaptureFx({ ...sig });
  }, [state.lastEnemyCaptureFx]);
  useEffect(() => {
    if (!enemyCaptureFx) return;
    const t = setTimeout(() => setEnemyCaptureFx(null), ENEMY_CAPTURE_SLIDE_MS + 20);
    return () => clearTimeout(t);
  }, [enemyCaptureFx]);

  const [levelsCleared, setLevelsCleared] = useState(0);
  const [levelsLost, setLevelsLost] = useState(0);
  const lossesByLevelRef = useRef<Record<number, number>>({});
  // Difficulty mode — the landing picker edits this; the run is rebuilt on
  // Play if it differs from what the current board was built under.
  const [difficulty, setDifficultyState] = useState<DifficultyId>(
    () => initial.state.difficulty ?? readProfile().difficulty,
  );
  const difficultyDef = DIFFICULTIES[state.difficulty ?? 'normal'];
  // Retries used per level index (difficulty-gated). Reset by resetRun.
  const retriesUsedRef = useRef<Record<number, number>>({});
  const [gaveUp, setGaveUp] = useState(false);
  const retriesLeft = Math.max(
    0,
    difficultyDef.retriesPerLevel - (retriesUsedRef.current[levelIndex] ?? 0),
  );
  const canRetry = retriesLeft > 0 && !gaveUp;
  const [showTrophies, setShowTrophies] = useState(false);
  const progress = useProgress(state);

  // ─────────────────────────────────────────────────────────────────────────
  // Recorder — captures every Rookie / ally / drone / enemy event so we can
  // replay sessions for bot training. POSTed to /api/run-trace on run end.
  // ─────────────────────────────────────────────────────────────────────────
  const traceEventsRef = useRef<Array<Record<string, unknown>>>([]);
  const traceStartRef = useRef<number>(Date.now());
  const tracePostedRef = useRef(false);
  const recordEvent = useCallback(
    (ev: Record<string, unknown>) => {
      const entry = { t: Date.now() - traceStartRef.current, ...ev };
      traceEventsRef.current.push(entry);
      // Dev-only live stream so Claude can watch moves as they happen.
      if (process.env.NODE_ENV !== 'production') {
        fetch('/api/dev/run-live', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
          keepalive: true,
        }).catch(() => {});
      }
    },
    [],
  );

  // Phase flags.
  const [dying, setDying] = useState(false);
  const [deathSettled, setDeathSettled] = useState(false);
  /** Why the level was lost — 'unwinnable' = the solver called it, not a capture / move limit. */
  const [lossReason, setLossReason] = useState<'unwinnable' | null>(null);

  // Dev-only parity mirror (see ParityHook). Inert in production and without
  // `?parity=1` — the effect body never runs.
  useEffect(() => {
    if (!meta.parity || process.env.NODE_ENV === 'production') return;
    (window as unknown as { __rrParity?: unknown }).__rrParity = { state, lossReason, levelIndex };
  }, [meta.parity, state, lossReason, levelIndex]);
  const [showLevelCleared, setShowLevelCleared] = useState(false);
  const [runComplete, setRunComplete] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const prevFormRef = useRef(state.form);

  const audioWarmedRef = useRef(false);
  const ensureAudioWarm = useCallback(() => {
    startMusicIfEnabled(); // idempotent; retries play() if a prior attempt was refused
    if (audioWarmedRef.current) return;
    audioWarmedRef.current = true;
    warmupAudio();
  }, []);

  const [showIntro, setShowIntro] = useState(false);

  // First-run story onboarding — shown ONCE (localStorage), before the daily
  // intro card. `?onboarding=1` forces it for testing.
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const forced = new URLSearchParams(window.location.search).get('onboarding') === '1';
    if (forced || !localStorage.getItem(ONBOARDING_KEY)) setShowOnboarding(true);
  }, []);

  // Revenge: HomeLanding IS the home screen (Daily / Ladder picker), so it
  // shows on EVERY cold open — otherwise a second open the same day dropped
  // players straight onto the board behind the level-1 ability offer.
  // STC / classic RunLanding keeps the old once-per-(run date) intro-card
  // contract, keyed by ISO in localStorage.
  const usesClassicLanding = isStc || process.env.NEXT_PUBLIC_HOME_CLASSIC === '1';
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // A Ladder launch (?ladder=1&run=<id>) goes straight to the board — the
    // player just tapped the rung on the home screen.
    if (meta.ladder) return;
    // A playtest deep link (?level=N with ?loadout=, /playtest's PLAY button)
    // also boards directly — the funnel already picked the level + kit.
    // Parity keeps its own flow untouched.
    if (meta.levelJump && meta.loadout && !meta.parity) return;
    if (!usesClassicLanding) {
      setShowIntro(true);
      return;
    }
    const key = `rookies-run-intro-seen:${meta.iso}`;
    if (!localStorage.getItem(key)) {
      setShowIntro(true);
    }
  }, [meta.iso, meta.ladder, meta.levelJump, meta.loadout, meta.parity, usesClassicLanding]);

  const resetRunRef = useRef<() => void>(() => {});
  // Optionally starts under a specific difficulty (HomeLanding's Daily GO and
  // Ladder rows pick one in the same gesture). Persist BEFORE resetting so
  // freshRun's readProfile() builds the board under the new mode.
  const dismissIntro = useCallback((d?: DifficultyId) => {
    ensureAudioWarm();
    if (typeof window !== 'undefined') {
      localStorage.setItem(`rookies-run-intro-seen:${meta.iso}`, '1');
    }
    const target = d ?? difficulty;
    if (d && d !== difficulty && !isDifficultyLocked(d, readProfile())) {
      persistDifficulty(d);
      setDifficultyState(d);
    }
    // The board was built at mount from the profile; rebuild if the mode changed.
    if ((state.difficulty ?? 'normal') !== target) resetRunRef.current();
    setShowIntro(false);
    trackEvent('run_intro_dismissed', { iso: meta.iso, difficulty: target });
  }, [meta.iso, ensureAudioWarm, state.difficulty, difficulty]);

  const onDifficultyChange = useCallback(
    (d: DifficultyId) => {
      if (isDifficultyLocked(d, progress.profile)) return;
      persistDifficulty(d);
      setDifficultyState(d);
      progress.setProfile(readProfile());
      trackEvent('run_difficulty_picked', { iso: meta.iso, difficulty: d });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meta.iso, progress.profile],
  );

  const [showTempoHelp, setShowTempoHelp] = useState(false);
  const openTempoHelp = useCallback(() => {
    ensureAudioWarm();
    setShowTempoHelp(true);
    trackEvent('run_tempo_help_opened', { iso: meta.iso });
  }, [meta.iso, ensureAudioWarm]);
  const closeTempoHelp = useCallback(() => setShowTempoHelp(false), []);

  const trackedStartRef = useRef(false);
  useEffect(() => {
    if (trackedStartRef.current || state.moveCount === 0) return;
    trackedStartRef.current = true;
    trackEvent('run_started', { iso: meta.iso, level: levelIndex + 1 });
  }, [state.moveCount, meta.iso, levelIndex]);

  useEffect(() => {
    if (prevFormRef.current === state.form) return;
    const revertedToRook = state.form === 'rook' && prevFormRef.current !== 'rook';
    prevFormRef.current = state.form;
    if (revertedToRook) void playTransformBackSound();
    else void playTransformIntoSound();
    setGlitching(true);
    const t = setTimeout(() => setGlitching(false), 440);
    return () => clearTimeout(t);
  }, [state.form]);

  // Re-arm on EVERY new board state while the enemy phase is open — not just
  // when enemyMovedSquares grows. The fleeing king's free reaction step
  // (Hard / Nightmare from L1) returns turn:'enemy' with the same moved
  // count; keying on the count alone left the phase hanging forever, and a
  // hung enemy phase means Rookie can't move and no ability can activate.
  useEffect(() => {
    if (state.turn !== 'enemy' || state.status !== 'playing') return;
    const t = setTimeout(() => {
      setState((s) => (s.turn === 'enemy' && s.status === 'playing' ? stepEnemyTurn(s) : s));
    }, ENEMY_TICK_MS);
    return () => clearTimeout(t);
  }, [state]);

  // Ally phase — tick one ally at a time so each move animates.
  useEffect(() => {
    if (state.turn !== 'allies' || state.status !== 'playing') return;
    const t = setTimeout(() => {
      setState((s) => (s.turn === 'allies' && s.status === 'playing' ? stepAllyTurn(s) : s));
    }, ALLY_TICK_MS);
    return () => clearTimeout(t);
  }, [state.turn, state.status, state.allyTurnIndex]);

  // Drone phase — tick all live drones in parallel until the swarm finishes.
  useEffect(() => {
    if (state.turn !== 'drones' || state.status !== 'playing') return;
    const t = setTimeout(() => {
      setState((s) => (s.turn === 'drones' && s.status === 'playing' ? stepDroneTurn(s) : s));
    }, DRONE_TICK_MS);
    return () => clearTimeout(t);
  }, [state.turn, state.status, state.drones]);

  // Unwinnable fail-safe — once control is back with Rookie (enemy / ally /
  // drone phases fully resolved), ask the solver whether the king can still
  // be caught in the moves left. Runs at most once per Rookie turn (keyed on
  // move count + board), after a short beat so the king's sidestep animates.
  // A proven dead position is lost through the same path as a move-limit
  // loss, so retries / Deja Vu bookkeeping are untouched.
  const unwinnableKeyRef = useRef<string>('');
  useEffect(() => {
    if (state.status !== 'playing' || state.turn !== 'rookie') return;
    if (state.moveCount === 0 || state.activeAbility || state.pendingOffer) return;
    const key = `${state.level}|${state.moveCount}|${state.captures.length}|${toSquare(state.rookie)}`;
    if (key === unwinnableKeyRef.current) return;
    const snapshot = state;
    const t = setTimeout(() => {
      // Stamp the key only when the check actually runs, so a re-render
      // inside the beat (e.g. an ability cast) re-arms instead of skipping.
      unwinnableKeyRef.current = key;
      if (!isUnwinnable(snapshot)) return;
      setLossReason('unwinnable');
      setState((s) => (s === snapshot ? { ...s, status: 'lost', turn: 'rookie' } : s));
    }, ENEMY_TICK_MS);
    return () => clearTimeout(t);
  }, [state]);

  // ─────────────────────────────────────────────────────────────────────────
  // Recorder watchers — dedupe-aware ticks for ally / drone / enemy phases.
  // ─────────────────────────────────────────────────────────────────────────
  const lastDroneKeyRef = useRef<string>('');
  useEffect(() => {
    if (state.turn !== 'drones') return;
    const key = `${state.level}|${state.drones.map((d) => `${d.id}:${d.file},${d.rank},${d.alive ? 1 : 0},${d.steps}`).join(';')}`;
    if (key === lastDroneKeyRef.current) return;
    lastDroneKeyRef.current = key;
    recordEvent({
      kind: 'drone-tick',
      level: state.level,
      drones: state.drones.map((d) => ({ id: d.id, file: d.file, rank: d.rank, alive: d.alive, steps: d.steps })),
      enemyCount: state.pieces.length,
    });
  }, [state.turn, state.level, state.drones, state.pieces.length, recordEvent]);

  const lastAllyKeyRef = useRef<string>('');
  useEffect(() => {
    if (state.turn !== 'allies') return;
    const key = `${state.level}|${state.allyTurnIndex}|${state.allies.map((a) => `${a.id}:${a.file},${a.rank},${a.type}`).join(';')}`;
    if (key === lastAllyKeyRef.current) return;
    lastAllyKeyRef.current = key;
    recordEvent({
      kind: 'ally-tick',
      level: state.level,
      index: state.allyTurnIndex,
      allies: state.allies.map((a) => ({ id: a.id, file: a.file, rank: a.rank, type: a.type, source: a.source })),
      enemyCount: state.pieces.length,
    });
  }, [state.turn, state.level, state.allyTurnIndex, state.allies, state.pieces.length, recordEvent]);

  const lastEnemyTickLenRef = useRef<number>(0);
  useEffect(() => {
    if (state.turn !== 'enemy') {
      lastEnemyTickLenRef.current = 0;
      return;
    }
    const len = state.enemyMovedSquares.length;
    if (len <= lastEnemyTickLenRef.current) return;
    lastEnemyTickLenRef.current = len;
    recordEvent({
      kind: 'enemy-tick',
      level: state.level,
      movedToSq: state.enemyMovedSquares[len - 1],
      rookie: toSquare(state.rookie),
      enemyCount: state.pieces.length,
      allyCount: state.allies.length,
    });
  }, [state.turn, state.enemyMovedSquares, state.level, state.rookie, state.pieces.length, state.allies.length, recordEvent]);

  useEffect(() => {
    if (state.status !== 'lost') return;
    setDying(true);
    const t = setTimeout(() => setDeathSettled(true), 1200);
    return () => clearTimeout(t);
  }, [state.status]);

  const lastRookieMoveRef = useRef(0);
  const lastRookieCapCountRef = useRef(0);
  const lastEnemyMoveRef = useRef(0);
  useEffect(() => {
    if (state.moveCount > lastRookieMoveRef.current) {
      const wasCapture = state.captures.length > lastRookieCapCountRef.current;
      if (wasCapture) {
        void playCaptureSound();
        haptic('medium');
      } else if (state.status !== 'lost') {
        void playMoveSound();
        haptic('light');
      }
      lastRookieMoveRef.current = state.moveCount;
      lastRookieCapCountRef.current = state.captures.length;
    }
  }, [state.moveCount, state.captures.length, state.status]);

  useEffect(() => {
    lastRookieMoveRef.current = 0;
    lastRookieCapCountRef.current = 0;
    lastEnemyMoveRef.current = 0;
  }, [levelIndex]);

  useEffect(() => {
    const len = state.enemyMovedSquares.length;
    if (len > lastEnemyMoveRef.current) {
      if (state.status === 'playing') void playMoveSound();
    }
    lastEnemyMoveRef.current = len;
  }, [state.enemyMovedSquares.length, state.status]);

  useEffect(() => {
    if (state.status !== 'won') return;
    playLevelClearSound(levelIndex);
    hapticSuccess();
  }, [state.status, levelIndex]);

  // Offer-arrival sfx (reuse card-draw chime).
  const prevPendingOfferRef = useRef<BoardState['pendingOffer']>(null);
  useEffect(() => {
    if (state.pendingOffer && !prevPendingOfferRef.current) {
      playCardDrawSound();
      haptic('light');
    }
    prevPendingOfferRef.current = state.pendingOffer;
  }, [state.pendingOffer]);

  useEffect(() => {
    if (state.status !== 'won' || showLevelCleared || runComplete) return;

    setLevelsCleared((n) => n + 1);

    trackEvent('run_level_cleared', {
      iso: meta.iso,
      level: levelIndex + 1,
      moves: state.moveCount,
      captures: state.captures.length,
      tempo: state.tempo,
    });
    progress.emit({
      type: 'level-cleared',
      level: levelIndex + 1,
      moves: state.moveCount,
      moveLimit: state.moveLimit,
      captures: state.captures.length,
      abilitiesOwned: state.abilities.length,
      allTierFive: state.abilities.length > 0 && state.abilities.every((a) => a.tier === 5),
      difficulty: state.difficulty ?? 'normal',
      isKingLevel: state.winCondition === 'king',
    });

    if (levelIndex >= totalLevels - 1) {
      setRunComplete(true);
      trackEvent('run_completed', { iso: meta.iso, run: meta.runId });
      {
        const streakNow = computeStats(readHistory()).currentStreak;
        progress.emit({
          type: 'run-completed',
          levelsLost,
          abilitiesOwned: state.abilities.length,
          difficulty: state.difficulty ?? 'normal',
          abilitiesUsed: progress.abilitiesUsedThisRun(),
          streak: streakNow + 1,
        });
        if (!meta.levelJump) recordBest(state.difficulty ?? 'normal', totalLevels, state.captures.length);
      }
      // Record completion for streak (auth-only on the server; silent for anon).
      // Only record when this is the actual daily for that date — not, e.g.,
      // an STC run or a hand-picked non-daily run via ?run=.
      if (!isStc && !meta.levelJump && meta.runId === getRunIdForDate(meta.iso)) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        fetch('/api/run/complete', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            runId: meta.runId,
            runDate: meta.iso,
            levelsCleared: totalLevels,
            tz,
          }),
        }).catch(() => {});
      }
    } else {
      setShowLevelCleared(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, state.moveCount, state.captures, state.tempo, levelIndex, showLevelCleared, runComplete, meta.iso, meta.runId, totalLevels]);

  const trackedLossRef = useRef(false);
  useEffect(() => {
    if (state.status !== 'lost') return;
    if (!trackedLossRef.current) {
      trackedLossRef.current = true;
      hapticError();
      trackEvent('run_level_lost', {
        iso: meta.iso,
        level: levelIndex + 1,
        moves: state.moveCount,
        captures: state.captures.length,
      });
      const lvl = levelIndex + 1;
      lossesByLevelRef.current[lvl] = (lossesByLevelRef.current[lvl] ?? 0) + 1;
      setLevelsLost((n) => n + 1);
      const king = state.pieces.find((p) => p.type === 'king');
      const kingDistance = king
        ? Math.max(Math.abs(king.file - state.rookie.file), Math.abs(king.rank - state.rookie.rank))
        : null;
      progress.emit({
        type: 'level-lost',
        level: lvl,
        onStartSquare: state.moveCount === 0,
        movesLeft: state.moveLimit === null ? null : Math.max(0, state.moveLimit - state.moveCount),
        kingDistance,
        lossesThisLevel: lossesByLevelRef.current[lvl],
        difficulty: state.difficulty ?? 'normal',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, state.moveCount, state.captures, levelIndex, meta.iso]);

  // Ability legal-move highlights (for movement abilities).
  const legalAbilityMoves: Coord[] | undefined = useMemo(() => {
    if (!state.activeAbility) return undefined;
    if (state.activeAbility.step !== 'pick-square') return undefined;
    return abilityLegalMoves(state, state.activeAbility.id);
  }, [state]);

  const activeAbilityTier = useMemo(() => {
    if (!state.activeAbility) return undefined;
    return state.abilities.find((a) => a.id === state.activeAbility!.id)?.tier;
  }, [state.activeAbility, state.abilities]);

  // Convert: while the ability is in pick-enemy mode, ring every eligible
  // enemy so the player can see which pieces are legal targets.
  // Magnet reuses the same rings for pullable enemies (Boulder's drop squares
  // come through legalAbilityMoves as dots).
  const convertTargets = useMemo(() => {
    if (state.activeAbility?.id === 'convert') return computeConvertTargets(state);
    if (state.activeAbility?.id === 'magnet') return computeMagnetTargets(state);
    return undefined;
  }, [state]);

  const onActivateAbility = useCallback(
    (id: AbilityId) => {
      ensureAudioWarm();
      // Tapping the same card again cancels.
      if (state.activeAbility?.id === id) {
        setState((s) => applyAbilityCancel(s));
        return;
      }
      const next = applyAbilityActivate(state, id);
      if (next !== state) {
        recordEvent({
          kind: 'ability-activate',
          level: state.level,
          ability: id,
          rookie: toSquare(state.rookie),
          enemyCount: state.pieces.length,
          allyCount: state.allies.length,
          droneCount: next.drones.length,
          turnAfter: next.turn,
        });
        setSelectedSquare(null);
        setState(next);
        if (id === 'surge') void playSurgeSound();
      }
    },
    [state, ensureAudioWarm, recordEvent],
  );

  const onSquareClick = useCallback(
    (square: string) => {
      ensureAudioWarm();
      if (state.status !== 'playing' || state.turn !== 'rookie') return;

      // Ability resolution mode.
      if (state.activeAbility) {
        const coord = fromSquare(square);
        const def = ABILITY_DEFS[state.activeAbility.id];

        // Cancel by tapping Rookie's own square.
        if (square === toSquare(state.rookie)) {
          setState((s) => applyAbilityCancel(s));
          return;
        }

        if (def.activation === 'movement') {
          const next = applyAbilityMove(state, state.activeAbility.id, coord);
          if (next !== state) {
            recordEvent({
              kind: 'ability-move',
              level: state.level,
              ability: state.activeAbility.id,
              target: square,
            });
            setState(next);
            playCardPlaySound();
            haptic('heavy');
          }
          return;
        }

        // Targeted (freeze ray / poison dart / rabies dart / decoy / convert).
        const next = applyAbilityTargeted(state, state.activeAbility.id, coord);
        if (next !== state) {
          recordEvent({
            kind: 'ability-target',
            level: state.level,
            ability: state.activeAbility.id,
            target: square,
            enemyCount: state.pieces.length,
            allyCount: state.allies.length,
          });
          setState(next);
          if (state.activeAbility.id === 'freeze-ray') void playFreezeSound();
          else playCardPlaySound();
          haptic('heavy');
          trackEvent('run_ability_used', {
            iso: meta.iso,
            level: levelIndex + 1,
            ability: state.activeAbility.id,
          });
        }
        return;
      }

      const rookieSquare = toSquare(state.rookie);
      if (square === rookieSquare) {
        setSelectedSquare((cur) => (cur === square ? null : square));
        return;
      }
      // Controlled summons (Squire family): the player's other bodies. Tap
      // one to select it, tap a legal square to move it (T1–T4 that IS the
      // turn; T5 Squire/Bishop Squire/Twin get a free move).
      const tappedAlly = controlledAllyAt(state, fromSquare(square));
      if (tappedAlly && canMoveAllyAt(state, tappedAlly)) {
        setSelectedSquare((cur) => (cur === square ? null : square));
        return;
      }
      if (!selectedSquare) return;
      const selectedAlly = controlledAllyAt(state, fromSquare(selectedSquare));
      if (selectedAlly) {
        const target = fromSquare(square);
        const next = applyControlledAllyMove(state, fromSquare(selectedSquare), target);
        if (next !== state) {
          const grew = next.captures.length > state.captures.length;
          recordEvent({
            kind: 'squire-move',
            level: state.level,
            from: selectedSquare,
            to: square,
            captured: grew ? next.captures[next.captures.length - 1] : null,
            tempo: next.tempo,
            enemyCount: next.pieces.length,
          });
          setState(next);
          haptic('medium');
        }
        setSelectedSquare(null);
        return;
      }

      const target = fromSquare(square);
      const next = applyRookieMove(state, target);
      if (next !== state) {
        const grew = next.captures.length > state.captures.length;
        recordEvent({
          kind: 'rookie-move',
          level: state.level,
          from: toSquare(state.rookie),
          to: square,
          form: state.form,
          captured: grew ? next.captures[next.captures.length - 1] : null,
          tempo: next.tempo,
          enemyCount: next.pieces.length,
          allyCount: next.allies.length,
        });
        setState(next);
      }
      setSelectedSquare(null);
    },
    [state, selectedSquare, meta.iso, levelIndex, ensureAudioWarm, recordEvent],
  );

  const onPieceDrop = useCallback(
    (_sourceSquare: string, targetSquare: string) => {
      ensureAudioWarm();
      if (state.status !== 'playing' || state.turn !== 'rookie') return false;
      if (state.activeAbility) return false;
      const target = fromSquare(targetSquare);
      const next = applyRookieMove(state, target);
      if (next === state) return false;
      const grew = next.captures.length > state.captures.length;
      recordEvent({
        kind: 'rookie-move',
        level: state.level,
        from: toSquare(state.rookie),
        to: targetSquare,
        form: state.form,
        captured: grew ? next.captures[next.captures.length - 1] : null,
        tempo: next.tempo,
        enemyCount: next.pieces.length,
        allyCount: next.allies.length,
      });
      setState(next);
      setSelectedSquare(null);
      return true;
    },
    [state, ensureAudioWarm, recordEvent],
  );

  const onOfferPick = useCallback(
    (option: AbilityOfferOption) => {
      const next = applyOfferPick(state, option);
      if (next !== state) {
        recordEvent({
          kind: 'offer-pick',
          level: state.level,
          option: { kind: option.kind, id: option.id, tier: option.tier },
          choices: state.pendingOffer?.map((o) => ({ kind: o.kind, id: o.id, tier: o.tier })),
        });
        setState(next);
        trackEvent('run_offer_picked', {
          iso: meta.iso,
          level: levelIndex + 1,
          kind: option.kind,
          ability: option.id,
          tier: option.tier,
        });
      }
    },
    [state, meta.iso, levelIndex, recordEvent],
  );

  const onOfferSkip = useCallback(() => {
    const next = applyDismissOffer(state);
    if (next !== state) {
      recordEvent({
        kind: 'offer-skip',
        level: state.level,
        choices: state.pendingOffer?.map((o) => ({ kind: o.kind, id: o.id, tier: o.tier })),
      });
      setState(next);
      trackEvent('run_offer_skipped', {
        iso: meta.iso,
        level: levelIndex + 1,
      });
    }
  }, [state, meta.iso, levelIndex, recordEvent]);

  const goToNextLevel = useCallback(() => {
    const nextIdx = levelIndex + 1;
    const nextPuzzle = puzzleForDate(meta.iso, nextIdx, meta.runId);
    setLevelIndex(nextIdx);
    setPuzzle(nextPuzzle);
    setState(
      puzzleToBoardState(nextPuzzle, {
        abilities: state.abilities,
        tempo: state.tempo,
        pendingOffer: state.pendingOffer,
        runId: meta.runId,
        unlockedAbilities: state.unlockedAbilities,
        difficulty: state.difficulty,
      }),
    );
    setSelectedSquare(null);
    setShowLevelCleared(false);
  }, [levelIndex, meta.iso, meta.runId, state.abilities, state.tempo, state.pendingOffer, state.unlockedAbilities, state.difficulty]);

  const resetRun = useCallback(() => {
    const fresh = freshRun(meta.iso, meta.runId, meta.startLevelIndex, meta.parity, meta.ladder ? 'normal' : null, meta.loadout);
    setLevelIndex(meta.startLevelIndex);
    setPuzzle(fresh.puzzle);
    setState(fresh.state);
    setSelectedSquare(null);
    setLevelsCleared(0);
    setLevelsLost(0);
    lossesByLevelRef.current = {};
    retriesUsedRef.current = {};
    setGaveUp(false);
    progress.resetRunScope();
    setDying(false);
    setDeathSettled(false);
    setLossReason(null);
    setShowLevelCleared(false);
    setRunComplete(false);
    trackedStartRef.current = false;
    trackedLossRef.current = false;
    runRecordedRef.current = false;
    tracePostedRef.current = false;
    traceEventsRef.current = [];
    traceStartRef.current = Date.now();
    trackEvent('run_replayed', { iso: meta.iso, run: meta.runId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.iso, meta.runId, meta.startLevelIndex]);
  resetRunRef.current = resetRun;

  // Difficulty retry: rebuild THIS level with the carried powers/tempo/offer
  // (same carry pattern as goToNextLevel). Loss bookkeeping (lossesByLevelRef,
  // level-lost event) already ran in the 'lost' effect; trackedLossRef is
  // re-armed so the next loss counts again.
  const retryLevel = useCallback(() => {
    retriesUsedRef.current[levelIndex] = (retriesUsedRef.current[levelIndex] ?? 0) + 1;
    const samePuzzle = puzzleForDate(meta.iso, levelIndex, meta.runId);
    setPuzzle(samePuzzle);
    setState(
      puzzleToBoardState(samePuzzle, {
        abilities: state.abilities,
        tempo: state.tempo,
        pendingOffer: state.pendingOffer,
        runId: meta.runId,
        unlockedAbilities: state.unlockedAbilities,
        difficulty: state.difficulty,
      }),
    );
    setSelectedSquare(null);
    setDying(false);
    setDeathSettled(false);
    setLossReason(null);
    trackedLossRef.current = false;
    tracePostedRef.current = false;
    trackEvent('run_level_retried', {
      iso: meta.iso,
      level: levelIndex + 1,
      difficulty: state.difficulty ?? 'normal',
      retriesUsed: retriesUsedRef.current[levelIndex],
    });
  }, [levelIndex, meta.iso, meta.runId, state.abilities, state.tempo, state.pendingOffer, state.unlockedAbilities, state.difficulty]);

  // STC and Revenge runs are separate cycles — never advance across the line.
  // The non-STC cycle stays inside the player-facing Revenge pool: classic
  // rank-8 runs must never be a "Next Run" destination (they are ?run= only).
  const nextRunId = useMemo(() => {
    if (meta.runId.startsWith('stc-')) {
      const stcOrder = ['stc-king', 'stc-bishop', 'stc-pawn', 'stc-knight', 'stc-queen'];
      const i = stcOrder.indexOf(meta.runId);
      return stcOrder[(i + 1) % stcOrder.length] ?? meta.runId;
    }
    return getNextRevengeRunId(meta.runId);
  }, [meta.runId]);

  const goToNextRun = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rookies-run-current', nextRunId);
      trackEvent('run_advanced', { from: meta.runId, to: nextRunId });
      // Navigate explicitly so STC runs land back inside the STC surface.
      // A bare /run with no ?run= would kick STC runs back to DEFAULT_RUN_ID.
      window.location.href = `/?run=${encodeURIComponent(nextRunId)}`;
      return;
    }
    trackEvent('run_advanced', { from: meta.runId, to: nextRunId });
  }, [meta.runId, nextRunId]);

  const [showRunPicker, setShowRunPicker] = useState(false);

  const switchRun = useCallback(
    (runId: string) => {
      if (runId === meta.runId) {
        setShowRunPicker(false);
        return;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('rookies-run-current', runId);
        trackEvent('run_picked', { from: meta.runId, to: runId });
        // Always navigate to /?run=<id>. /stc redirects to stc-king,
        // so staying on that pathname would clobber the picked run.
        window.location.href = `/?run=${encodeURIComponent(runId)}`;
        return;
      }
      trackEvent('run_picked', { from: meta.runId, to: runId });
    },
    [meta.runId],
  );

  const levelReached = runComplete
    ? totalLevels
    : state.status === 'lost'
      ? levelIndex + 1
      : Math.max(1, levelsCleared);

  // Run-end recorder POST — fires once when the run finishes (won or lost).
  useEffect(() => {
    if (tracePostedRef.current) return;
    if (!runComplete && state.status !== 'lost') return;
    tracePostedRef.current = true;
    if (state.status === 'lost') {
      recordEvent({
        kind: 'death',
        level: state.level,
        rookie: toSquare(state.rookie),
        turn: state.turn,
        pieces: state.pieces.map((p) => ({ type: p.type, sq: toSquare(p) })),
        allies: state.allies.map((a) => ({ id: a.id, type: a.type, sq: toSquare(a) })),
        drones: state.drones.map((d) => ({ id: d.id, file: d.file, rank: d.rank, alive: d.alive, steps: d.steps })),
        moveCount: state.moveCount,
        captures: state.captures,
      });
    }
    const body = {
      meta: {
        runId: meta.runId,
        iso: meta.iso,
        level: state.level,
        totalLevels,
        outcome: runComplete ? 'won' : 'lost',
        startedAt: new Date(traceStartRef.current).toISOString(),
      },
      events: traceEventsRef.current,
    };
    fetch('/api/run-trace', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {});
  }, [runComplete, state, meta.runId, meta.iso, totalLevels, recordEvent]);

  // Record the finished run once, then read history for stats.
  const runRecordedRef = useRef(false);
  const [historyVersion, setHistoryVersion] = useState(0);
  useEffect(() => {
    if (runRecordedRef.current) return;
    const finished = runComplete || (state.status === 'lost' && deathSettled && !canRetry);
    if (!finished) return;
    runRecordedRef.current = true;
    // A `?level=N` jump (playtest launch) must leave no trace: no history,
    // no ladder result, no leaderboard score.
    if (meta.levelJump) {
      setHistoryVersion((v) => v + 1);
      return;
    }
    recordRun({
      iso: meta.iso,
      runId: meta.runId,
      levelReached,
      totalLevels,
      completed: runComplete,
    });
    // The Ladder: a run launched from a rung files its result (win OR loss)
    // so the next rung can unlock and the rung row can show a best score.
    if (meta.ladder) {
      recordLadderResult(
        meta.runId,
        runComplete ? totalLevels : Math.max(0, levelReached - 1),
        state.captures.length,
        runComplete,
      );
      progress.setProfile(readProfile());
    }
    setHistoryVersion((v) => v + 1);
    // Global daily board (anonymous handle). Fails soft; never blocks the game.
    if (!isStc) {
      void submitScore({
        runDate: meta.iso,
        runId: meta.runId,
        difficulty: state.difficulty ?? 'normal',
        levelsCleared: runComplete ? totalLevels : Math.max(0, levelReached - 1),
        totalLevels,
        captures: state.captures.length,
        completed: runComplete,
      });
    }
  }, [runComplete, state.status, deathSettled, canRetry, meta.iso, meta.runId, meta.ladder, meta.levelJump, levelReached, totalLevels, isStc, state.difficulty, state.captures.length, progress]);

  const stats = useMemo(() => computeStats(readHistory()), [historyVersion]);

  const shareString = buildShareString({
    iso: meta.iso,
    levelReached,
    totalLevels,
    completed: runComplete,
    currentStreak: stats.currentStreak,
  });

  void puzzle;

  if (showOnboarding) {
    return (
      <div className="h-full overflow-auto">
        <StoryOnboarding
          onDone={() => {
            ensureAudioWarm();
            setShowOnboarding(false);
          }}
        />
      </div>
    );
  }

  if (showIntro) {
    const dateLabel = (() => {
      try {
        const d = new Date(meta.iso + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
      } catch {
        return undefined;
      }
    })();
    return (
      <div className="h-full overflow-auto">
        {usesClassicLanding ? (
          <RunLanding
            onStart={dismissIntro}
            tagline={isStc ? 'Powered by the Story Time Chess method' : undefined}
            dateLabel={dateLabel}
            profile={progress.profile}
            onTrophies={() => setShowTrophies(true)}
            difficulty={isStc ? undefined : difficulty}
            onDifficultyChange={isStc ? undefined : onDifficultyChange}
          />
        ) : (
          <HomeLanding
            onStart={dismissIntro}
            onLadderStart={(id) => {
              window.location.href = `/?run=${encodeURIComponent(id)}&ladder=1`;
            }}
            iso={meta.iso}
            runId={meta.runId}
            dateLabel={dateLabel}
            profile={progress.profile}
            onTrophies={() => setShowTrophies(true)}
          />
        )}
        {showTrophies && (
          <TrophyRoom
            profile={progress.profile}
            onClose={() => setShowTrophies(false)}
            onReplayTutorial={() => {
              setShowTrophies(false);
              setShowOnboarding(true);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-md md:max-w-lg mx-auto w-full px-4 md:px-6 pt-1.5 pb-3 flex flex-col gap-2">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setShowRunPicker(true)}
              className="text-left active:opacity-70 transition-opacity shrink-0"
              aria-label="Switch run"
            >
              {isStc ? <StcRunLogo scale={0.45} /> : <RookiesRevengeLogo scale={0.3} />}
            </button>
            <RulesInline winCondition={state.winCondition} />
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5">
            <MusicMenu />
            <button
              type="button"
              onClick={() => setShowTrophies(true)}
              aria-label="Trophy room"
              className="w-8 h-8 rounded-lg bg-chess-surface shadow-sm flex items-center justify-center active:scale-90 transition-transform"
            >
              <TrophyGlyph size={16} color="#d9a520" />
            </button>
            <div className="bg-chess-surface rounded-lg px-3 py-1.5 shadow-sm inline-flex items-center gap-1.5 leading-none">
              <span className="text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-muted">
                Lvl
              </span>
              <span className="text-sm font-black text-chess-text tabular-nums">
                {levelIndex + 1}
                <span className="text-chess-text-faint">/{totalLevels}</span>
              </span>
            </div>
            </div>
            <div className="flex items-center gap-1.5">
            {!isStc && (
              <div
                className="bg-chess-surface rounded-lg px-2 py-1 shadow-sm inline-flex items-center leading-none"
                data-testid="difficulty-chip"
                title="Difficulty"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-muted">
                  {difficultyDef.name}
                </span>
              </div>
            )}
            {/* Rookie's Revenge: flee levels have a move budget — show it. */}
            {state.winCondition === 'king' && state.moveLimit !== null && (
              <div
                className={`rounded-lg px-2 py-1 shadow-sm inline-flex items-center gap-1 leading-none ${
                  state.moveLimit - state.moveCount <= 3
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-chess-surface text-chess-text'
                }`}
              >
                <span className="text-sm font-black tabular-nums">
                  {Math.max(0, state.moveLimit - state.moveCount)}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.14em] opacity-70">
                  moves
                </span>
              </div>
            )}
            </div>
          </div>
        </header>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <TempoBar
              tempo={state.tempo}
              max={tempoMaxFor(state)}
              form={state.form}
              formMovesLeft={state.formMovesLeft}
            />
          </div>
          <button
            type="button"
            onClick={openTempoHelp}
            aria-label="How tempo works"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-90 transition-transform shrink-0"
          >
            <span className="w-7 h-7 rounded-full bg-chess-text/10 hover:bg-chess-text/20 flex items-center justify-center text-chess-text-muted text-xs font-black">
              ?
            </span>
          </button>
        </div>

        <div className="w-full max-w-[min(92vw,440px)] md:max-w-[520px] mx-auto">
          <RunBoard
            key={`level-${levelIndex}-${state.level}`}
            state={state}
            selectedSquare={selectedSquare}
            dying={dying}
            glitching={glitching}
            aegisFx={aegisFx}
            imperviousFx={imperviousFx}
            abilityFx={abilityFx}
            poisonDeathFx={poisonDeathFx}
            enemyCaptureFx={enemyCaptureFx}
            legalAbilityMoves={legalAbilityMoves}
            abilityTier={activeAbilityTier}
            convertTargets={convertTargets}
            onSquareClick={onSquareClick}
            onPieceDrop={onPieceDrop}
            vanillaPieces={isStc}
          />
        </div>

        <AbilityRack
          abilities={state.abilities}
          activeId={state.activeAbility?.id ?? null}
          onActivate={onActivateAbility}
        />

        {state.abilities.some((a) => a.id === 'squad') && (
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black tracking-wide uppercase text-fuchsia-700 dark:text-fuchsia-300">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse" />
            Passive: Squad
          </div>
        )}

        {state.status === 'playing' && state.activeAbility && (
          <div className="flex items-center gap-2 rounded-lg bg-indigo-500/15 border border-indigo-400/40 px-3 py-2">
            <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 flex-1 leading-tight">
              {ABILITY_DEFS[state.activeAbility.id].name}:{' '}
              {state.activeAbility.step === 'pick-enemy'
                ? state.activeAbility.id === 'magnet'
                  ? 'tap an enemy on your line'
                  : 'tap an enemy'
                : ABILITY_DEFS[state.activeAbility.id].activation === 'targeted'
                  ? 'tap an empty square'
                  : 'tap a highlighted square'}
            </span>
            <button
              type="button"
              onClick={() => setState((s) => applyAbilityCancel(s))}
              className="px-3 min-h-[44px] rounded bg-chess-text/10 text-chess-text text-[11px] font-bold active:scale-95 shrink-0"
            >
              Cancel
            </button>
          </div>
        )}

        {state.status === 'playing' && !state.activeAbility && (
          <p className="text-center text-sm text-chess-text-muted">
            Tap Rookie to see her moves.
          </p>
        )}
      </div>

      {!isStc && state.pendingOffer && state.status === 'playing' && (
        <AbilityOfferModal
          offer={state.pendingOffer}
          onPick={onOfferPick}
          onSkip={onOfferSkip}
          reason={state.offerReason ?? 'tempo'}
        />
      )}

      {showTempoHelp && <TempoHelpModal onClose={closeTempoHelp} />}
      <RunAchievementPop
        achievement={progress.queue.achievements[0]}
        onDone={progress.shiftAchievement}
      />
      {/* Ability reveals wait until no offer/level modal is up so they never stack. */}
      {!state.pendingOffer && !showLevelCleared && (
        <AbilityUnlockModal
          abilityId={progress.queue.unlocks[0]}
          onClose={progress.shiftUnlock}
        />
      )}
      {showTrophies && (
        <TrophyRoom
          profile={progress.profile}
          onClose={() => setShowTrophies(false)}
          onReplayTutorial={() => {
            setShowTrophies(false);
            setShowOnboarding(true);
          }}
        />
      )}

      {showRunPicker && (
        <RunPickerModal
          currentRunId={meta.runId}
          onPick={switchRun}
          onClose={() => setShowRunPicker(false)}
          filter={
            isStc
              ? (id: string) => id.startsWith('stc-')
              : // Revenge surface: list ONLY player-facing Revenge runs — the
                // classic rank-8 runs are ?run=-only and never shown/linked.
                (id: string) => REVENGE_RUN_IDS.includes(id)
          }
          logo={isStc ? <StcRunLogo scale={0.5} /> : undefined}
          caption={isStc ? 'Five pieces, five mini-runs' : undefined}
        />
      )}

      {showLevelCleared && (
        <LevelClearedModal
          level={levelIndex + 1}
          totalLevels={totalLevels}
          tempo={state.tempo}
          onNext={goToNextLevel}
        />
      )}

      {state.status === 'lost' && deathSettled && canRetry && !runComplete && (
        <LevelLostModal
          level={levelIndex + 1}
          totalLevels={totalLevels}
          retriesLeft={retriesLeft}
          reason={lossReason ?? undefined}
          difficultyLabel={isStc ? undefined : difficultyDef.name}
          onRetry={retryLevel}
          onGiveUp={() => setGaveUp(true)}
        />
      )}

      {((state.status === 'lost' && deathSettled && !canRetry) || runComplete) && (
        <RunSummaryModal
          difficultyLabel={isStc ? undefined : difficultyDef.name}
          iso={meta.iso}
          totalLevels={totalLevels}
          levelReached={levelReached}
          completed={runComplete}
          stats={stats}
          shareString={shareString}
          onReplay={resetRun}
          nextRunName={nextRunId !== meta.runId ? getRunById(nextRunId).name : undefined}
          onNextRun={nextRunId !== meta.runId ? goToNextRun : undefined}
        />
      )}
    </div>
  );
}
