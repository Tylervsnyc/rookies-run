'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { DemoBoard } from '@/components/run/DemoBoard';
import { REVENGE_RED, REVENGE_RED_DARK, RevengeMarkSvg } from '@/components/run/RookiesRevengeLogo';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { fireConfetti } from '@/lib/confetti';

/**
 * MOCK — five animated "level cleared" popups + the matching "captured"
 * (level lost) version of each. Tyler 2026-09-03: "I still HATE the level
 * cleared pop up… I want something animated, something more fun."
 * Every option replays from its Replay button. Ease-out-expo everywhere, no
 * bounce; reduced-motion collapses to a crossfade.
 */

// ── Kit ──────────────────────────────────────────────────────────────────────
const NAVY = '#0f1c3f';
const NAVY_2 = '#182a5c';
const PANEL_EDGE = '#3a4f8f';
const GOLD = '#FFC800';
const GREEN = '#58CC02';
const GREEN_DARK = '#3d8c01';
const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
const OUTLINE: CSSProperties = { color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.45), -1px 0 0 rgba(0,0,0,0.35), 1px 0 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(0,0,0,0.35)' };
const GOLD_TEXT: CSSProperties = { color: GOLD, textShadow: '0 3px 0 rgba(0,0,0,0.5)' };
const RED_TEXT: CSSProperties = { color: '#FF6B66', textShadow: '0 3px 0 rgba(0,0,0,0.5)' };
const CARD: CSSProperties = { background: `linear-gradient(180deg,#1c2f63 0%,${NAVY} 100%)`, border: `3px solid ${PANEL_EDGE}`, boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.18), inset 0 -5px 0 rgba(0,0,0,0.4), 0 20px 50px rgba(0,0,0,0.6)' };
/** The enemy king, drawn the way the board draws him (glyph), sized for a card. */
function King({ size = 96 }: { size?: number }) {
  return <span aria-hidden className="block leading-none select-none" style={{ fontSize: size, color: '#111', textShadow: '0 3px 0 rgba(0,0,0,0.5), 0 0 2px rgba(255,255,255,0.35)' }}>♚</span>;
}

type Mode = 'cleared' | 'lost';
const QUIP: Record<Mode, string> = {
  cleared: 'He moved his whole court for you. Rude.',
  lost: 'The bishop got her. This is fine. This is completely fine.',
};

function CpButton({ children, color = REVENGE_RED, shadow = REVENGE_RED_DARK, className = '', style }: { children: ReactNode; color?: string; shadow?: string; className?: string; style?: CSSProperties }) {
  return (
    <button type="button" className={`w-full rounded-[16px] font-black flex items-center justify-center min-h-[54px] text-[18px] active:translate-y-[4px] active:shadow-none transition-transform ${className}`} style={{ background: color, color: '#fff', boxShadow: `0 6px 0 ${shadow}`, ...style }}>
      <span style={OUTLINE}>{children}</span>
    </button>
  );
}

function Actions({ mode, delay = 0 }: { mode: Mode; delay?: number }) {
  return (
    <div className="pp-rise flex flex-col gap-2" style={{ animationDelay: `${delay}ms` }}>
      {mode === 'cleared' ? (
        <CpButton color={GREEN} shadow={GREEN_DARK}>NEXT LEVEL</CpButton>
      ) : (
        <>
          <CpButton>RETRY LEVEL</CpButton>
          <button type="button" className="min-h-[36px] text-[12px] font-black" style={{ color: 'rgba(255,255,255,0.6)' }}>Give up the run</button>
        </>
      )}
    </div>
  );
}

/** Dimmed play page behind every popup. */
function Backdrop({ shake = false }: { shake?: boolean }) {
  return (
    <div className={`absolute inset-0 ${shake ? 'pp-shake' : ''}`} style={{ background: `linear-gradient(180deg, ${NAVY_2} 0%, ${NAVY} 60%)`, filter: 'brightness(0.4)' }}>
      <div className="px-3 pt-14">
        <div className="rounded-[20px] p-2" style={{ background: 'linear-gradient(180deg,#3d5297 0%,#1b2b5c 100%)' }}>
          <div className="rounded-[14px] overflow-hidden"><DemoBoard reticle={false} paused /></div>
        </div>
      </div>
    </div>
  );
}

function Phone({ children, label, onReplay }: { children: ReactNode; label: string; onReplay: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <div className="text-sm font-black uppercase tracking-[0.18em]" style={GOLD_TEXT}>{label}</div>
        <button type="button" onClick={onReplay} className="text-[11px] font-black px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>Replay</button>
      </div>
      <div className="relative overflow-hidden rounded-[36px]" style={{ width: 390, height: 780, border: '10px solid #06091a', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', background: NAVY }}>
        {children}
      </div>
    </div>
  );
}

// ── 1 · THE STAMP ────────────────────────────────────────────────────────────
// The level number slams down like a gold seal, then a red ink stamp hits.
function Stamp({ mode }: { mode: Mode }) {
  const cleared = mode === 'cleared';
  return (
    <>
      <Backdrop shake={!cleared} />
      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="pp-card-up relative w-full rounded-[24px] p-6 text-center overflow-hidden" style={CARD}>
          <div className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.55)' }}>The Fortress · level {cleared ? 4 : 5}</div>
          <div className="relative mt-3 h-[150px] flex items-center justify-center">
            <div className="pp-ring absolute rounded-full" style={{ width: 150, height: 150, border: `4px solid ${cleared ? GOLD : '#FF6B66'}` }} />
            <div className="pp-slam text-[132px] leading-none font-black tabular-nums" style={cleared ? GOLD_TEXT : { ...GOLD_TEXT, color: 'rgba(255,255,255,0.28)' }}>{cleared ? 4 : 5}</div>
            <div className="pp-stamp absolute px-4 py-1.5 rounded-lg text-[34px] font-black uppercase tracking-[0.06em]" style={{ border: '5px solid #FF3B30', color: '#FF3B30', transform: 'rotate(-10deg)', background: 'rgba(15,28,63,0.75)', textShadow: 'none', mixBlendMode: 'screen' }}>{cleared ? 'Cleared' : 'Captured'}</div>
          </div>
          <div className="mt-2 flex justify-center gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => {
              const done = i < (cleared ? 4 : 4);
              const here = !cleared && i === 4;
              return <span key={i} className="pp-pip w-4 h-4 rounded-full" style={{ ['--i' as string]: i, background: done ? GOLD : here ? '#FF3B30' : 'rgba(255,255,255,0.14)', boxShadow: done ? '0 0 8px rgba(255,200,0,0.6)' : undefined }} />;
            })}
          </div>
          <p className="pp-rise mt-4 text-[14px] font-bold" style={{ color: 'rgba(255,255,255,0.85)', animationDelay: '700ms' }}>{QUIP[mode]}</p>
          <div className="mt-5"><Actions mode={mode} delay={850} /></div>
        </div>
      </div>
    </>
  );
}

// ── 2 · THE KING FALLS ───────────────────────────────────────────────────────
// The enemy king topples off the card; Rookie rises into the spotlight.
// Lost: Rookie is the one who falls, and the king stays, bobbing smugly.
function KingFalls({ mode }: { mode: Mode }) {
  const cleared = mode === 'cleared';
  return (
    <>
      <Backdrop />
      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="pp-card-up relative w-full rounded-[24px] p-6 text-center overflow-hidden" style={CARD}>
          <div className="relative h-[210px]">
            {/* spotlight */}
            <div className="pp-spot absolute left-1/2 top-2 -translate-x-1/2 rounded-full" style={{ width: 170, height: 170, background: `radial-gradient(circle, ${cleared ? 'rgba(255,200,0,0.35)' : 'rgba(255,59,48,0.3)'} 0%, transparent 70%)` }} />
            {/* the faller */}
            <div className={cleared ? 'pp-topple absolute left-1/2 bottom-2' : 'pp-topple absolute left-1/2 bottom-2'} style={{ marginLeft: cleared ? 26 : -100, transformOrigin: 'bottom center' }}>
              {cleared ? <King size={110} /> : <BreathingRook size="md" />}
            </div>
            {/* the winner */}
            <div className="pp-winner absolute left-1/2 bottom-2" style={{ marginLeft: cleared ? -88 : 20 }}>
              {cleared ? <BreathingRook size="md" animate /> : <div className="pp-bob"><King size={110} /></div>}
            </div>
          </div>
          <div className="pp-rise text-[13px] font-black uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.55)', animationDelay: '900ms' }}>{cleared ? 'King down' : 'Rookie down'}</div>
          <div className="pp-rise mt-1 flex items-baseline justify-center gap-2" style={{ animationDelay: '1000ms' }}>
            <span className="text-[56px] leading-none font-black uppercase" style={cleared ? GOLD_TEXT : RED_TEXT}>Level {cleared ? 4 : 5}</span>
            <span className="text-[14px] font-black" style={{ color: 'rgba(255,255,255,0.45)' }}>of 10</span>
          </div>
          <p className="pp-rise mt-3 text-[14px] font-bold" style={{ color: 'rgba(255,255,255,0.85)', animationDelay: '1150ms' }}>{QUIP[mode]}</p>
          <div className="mt-5"><Actions mode={mode} delay={1300} /></div>
        </div>
      </div>
    </>
  );
}

// ── 3 · TARGET DOWN ──────────────────────────────────────────────────────────
// The Revenge reticle hunts across the card, locks on the king, and the
// kill-count ticks. Lost: it sweeps and never locks — TARGET ESCAPED.
function Reticle({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" width={130} height={130} style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} aria-hidden>
      <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="6" />
      <circle cx="50" cy="50" r="27" fill="none" stroke={color} strokeWidth="3.5" opacity="0.7" />
      <circle cx="50" cy="50" r="4" fill={color} />
      {[0, 90, 180, 270].map((d) => <line key={d} x1="50" y1="2" x2="50" y2="14" stroke={color} strokeWidth="6" strokeLinecap="round" transform={`rotate(${d} 50 50)`} />)}
    </svg>
  );
}
function TargetDown({ mode }: { mode: Mode }) {
  const cleared = mode === 'cleared';
  return (
    <>
      <Backdrop />
      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="pp-card-up relative w-full rounded-[24px] p-6 text-center overflow-hidden" style={CARD}>
          <div className="relative h-[170px] flex items-center justify-center">
            <div className={cleared ? 'pp-target-lock' : 'pp-target-miss'} style={{ opacity: cleared ? 1 : 0.55 }}>
              <King size={96} />
            </div>
            <div className={`absolute ${cleared ? 'pp-hunt' : 'pp-hunt-miss'}`}><Reticle color={REVENGE_RED} /></div>
            {cleared && <div className="pp-flash absolute inset-0 rounded-2xl" style={{ background: 'rgba(255,255,255,0.9)' }} />}
          </div>
          <div className="pp-rise text-[40px] leading-none font-black uppercase tracking-[0.04em]" style={{ ...(cleared ? GOLD_TEXT : RED_TEXT), animationDelay: cleared ? '1500ms' : '1400ms' }}>{cleared ? 'Target down' : 'Target escaped'}</div>
          <div className="pp-rise mt-3 flex items-center justify-center gap-2" style={{ animationDelay: '1700ms' }}>
            <span className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.55)' }}>Kings</span>
            <div className="relative h-[34px] w-[40px] overflow-hidden">
              <div className={cleared ? 'pp-tick absolute inset-x-0 flex flex-col' : 'absolute inset-x-0 flex flex-col'}>
                <span className="text-[30px] leading-[34px] font-black tabular-nums" style={GOLD_TEXT}>3</span>
                <span className="text-[30px] leading-[34px] font-black tabular-nums" style={GOLD_TEXT}>4</span>
              </div>
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.55)' }}>of 10</span>
          </div>
          <div className="mt-2 flex justify-center gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => <span key={i} className="pp-pip w-3 h-3 rounded-full" style={{ ['--i' as string]: i + 16, background: i < 4 ? REVENGE_RED : !cleared && i === 4 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.14)' }} />)}
          </div>
          <p className="pp-rise mt-4 text-[14px] font-bold" style={{ color: 'rgba(255,255,255,0.85)', animationDelay: '1900ms' }}>{QUIP[mode]}</p>
          <div className="mt-5"><Actions mode={mode} delay={2050} /></div>
        </div>
      </div>
    </>
  );
}

// ── 4 · THE CLIMB ────────────────────────────────────────────────────────────
// A rail of 10 rungs; the gold rook marker slides one rung up and a check
// draws itself. Lost: the marker slips back and the rung cracks red.
function ClimbMarker({ cleared, from, to }: { cleared: boolean; from: number; to: number }) {
  const pct = (n: number) => `${((n - 1) / 9) * 100}%`;
  const [x, setX] = useState(pct(cleared ? from : to));
  useEffect(() => {
    const t = setTimeout(() => setX(pct(cleared ? to : from)), cleared ? 500 : 700);
    return () => clearTimeout(t);
  }, [cleared, from, to]);
  return (
    <div className="absolute top-1/2" style={{ left: 12, width: 'calc(100% - 24px)' }}>
      <div className="absolute -translate-x-1/2" style={{ left: x, top: -46, transition: `left 700ms ${EXPO}` }}>
        <span aria-hidden className="block leading-none" style={{ fontSize: 34, color: GOLD, textShadow: '0 3px 0 rgba(0,0,0,0.5)' }}>♜</span>
      </div>
    </div>
  );
}
function Climb({ mode }: { mode: Mode }) {
  const cleared = mode === 'cleared';
  const from = 3, to = cleared ? 4 : 5;
  return (
    <>
      <Backdrop />
      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="pp-card-up relative w-full rounded-[24px] p-6 overflow-hidden" style={CARD}>
          <div className="text-center text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.55)' }}>The Fortress</div>
          <div className="mt-1 text-center text-[42px] leading-none font-black uppercase" style={cleared ? GOLD_TEXT : RED_TEXT}>{cleared ? 'Cleared' : 'Captured'}</div>
          {/* rail */}
          <div className="relative mt-12 h-[64px]">
            <div className="absolute left-3 right-3 top-1/2 h-[6px] -translate-y-1/2 rounded-full" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <div className="pp-rail absolute left-3 top-1/2 h-[6px] -translate-y-1/2 rounded-full" style={{ background: GOLD, boxShadow: '0 0 10px rgba(255,200,0,0.6)', ['--from' as string]: `${(from - 1) / 9 * 100}%`, ['--to' as string]: `${((cleared ? to : from) - 1) / 9 * 100}%` }} />
            <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 flex justify-between">
              {Array.from({ length: 10 }).map((_, i) => {
                const n = i + 1;
                const done = n <= from || (cleared && n === to);
                const cracked = !cleared && n === to;
                return (
                  <div key={n} className="relative w-[22px] h-[22px] rounded-full flex items-center justify-center" style={{ background: done ? GOLD : cracked ? '#FF3B30' : NAVY, border: `3px solid ${done ? GOLD : cracked ? '#FF3B30' : PANEL_EDGE}`, transition: 'background 300ms', ...(cracked ? { animation: 'ppCrack 400ms 900ms both' } : {}) }}>
                    {n === to && cleared && (
                      <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden><path className="pp-draw" d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#3a2a00" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                    {cracked && (
                      <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden><path className="pp-draw" d="M6 6l12 12M18 6L6 18" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" /></svg>
                    )}
                  </div>
                );
              })}
            </div>
            {/* the marker — slides on a state change so it animates reliably */}
            <ClimbMarker cleared={cleared} from={from} to={to} />
          </div>
          <div className="mt-3 flex items-baseline justify-between px-1">
            <span className="text-[12px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.55)' }}>{cleared ? `Level ${to} next` : `Level ${to}`}</span>
            <span className="text-[12px] font-black tabular-nums" style={GOLD_TEXT}>{cleared ? to : from} / 10</span>
          </div>
          <p className="pp-rise mt-4 text-center text-[14px] font-bold" style={{ color: 'rgba(255,255,255,0.85)', animationDelay: '1100ms' }}>{QUIP[mode]}</p>
          <div className="mt-5"><Actions mode={mode} delay={1250} /></div>
        </div>
      </div>
    </>
  );
}

// ── 5 · THE TAKEOVER ─────────────────────────────────────────────────────────
// No card. The whole screen flashes gold, CLEARED wipes in from the left with
// sparks, the level number lands, confetti, and the button rises from the
// bottom. Lost: red flash, CAPTURED glitches and the screen shakes.
function Takeover({ mode }: { mode: Mode }) {
  const cleared = mode === 'cleared';
  useEffect(() => {
    if (!cleared) return;
    const t = setTimeout(() => { void fireConfetti({ particleCount: 90, spread: 70, origin: { y: 0.55 }, colors: [GOLD, '#fff', REVENGE_RED] }); }, 500);
    return () => clearTimeout(t);
  }, [cleared]);
  return (
    <>
      <Backdrop shake={!cleared} />
      <div className="pp-flash absolute inset-0" style={{ background: cleared ? GOLD : '#FF3B30' }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="relative">
          <div className={cleared ? 'pp-wipe' : 'pp-glitch'} style={{ animationDelay: '150ms' }}>
            <div className="text-[64px] leading-none font-black uppercase tracking-[0.02em]" style={{ ...OUTLINE, textShadow: `0 6px 0 ${cleared ? '#8a6200' : REVENGE_RED_DARK}, 0 0 30px ${cleared ? 'rgba(255,200,0,0.6)' : 'rgba(255,59,48,0.6)'}` }}>{cleared ? 'Cleared' : 'Captured'}</div>
          </div>
          {cleared && Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="pp-spark absolute left-1/2 top-1/2 w-2 h-2 rounded-full" style={{ ['--i' as string]: i, ['--a' as string]: `${(i / 14) * 360}deg`, background: i % 3 === 0 ? '#fff' : GOLD }} />
          ))}
        </div>
        <div className="pp-rise mt-3 flex items-baseline gap-2" style={{ animationDelay: '600ms' }}>
          <span className="text-[26px] font-black uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.7)' }}>Level</span>
          <span className="text-[72px] leading-none font-black tabular-nums" style={cleared ? GOLD_TEXT : RED_TEXT}>{cleared ? 4 : 5}</span>
          <span className="text-[16px] font-black" style={{ color: 'rgba(255,255,255,0.45)' }}>of 10</span>
        </div>
        <p className="pp-rise mt-4 text-center text-[15px] font-bold max-w-[300px]" style={{ ...OUTLINE, animationDelay: '800ms' }}>{QUIP[mode]}</p>
      </div>
      <div className="absolute inset-x-5 bottom-8"><Actions mode={mode} delay={950} /></div>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const OPTIONS: { key: string; label: string; blurb: string; C: (p: { mode: Mode }) => ReactNode }[] = [
  { key: 'stamp', label: '1 · The Stamp', blurb: 'Level number slams down like a gold seal, then the red ink stamp hits. Pips fill one by one.', C: Stamp },
  { key: 'king', label: '2 · The King Falls', blurb: 'The king topples off the card, Rookie rises into the spotlight. Lost: she topples, he bobs.', C: KingFalls },
  { key: 'target', label: '3 · Target Down', blurb: 'The reticle hunts, snaps onto the king, flash, kill-count ticks 3 to 4. Lost: it never locks.', C: TargetDown },
  { key: 'climb', label: '4 · The Climb', blurb: 'Ten rungs. Rookie slides one up, the check draws itself. Lost: she slips and the rung cracks.', C: Climb },
  { key: 'takeover', label: '5 · The Takeover', blurb: 'No card. Gold flash, CLEARED wipes in with sparks and confetti. Lost: red flash, glitch, shake.', C: Takeover },
];

export default function RevengePopupsMock() {
  const [seed, setSeed] = useState<Record<string, number>>({});
  const replay = (k: string) => setSeed((s) => ({ ...s, [k]: (s[k] ?? 0) + 1 }));
  return (
    <div className="h-full overflow-auto text-white" style={{ background: '#06091a' }}>
      <style>{`
        .pp-card-up { animation: ppCardUp 420ms ${EXPO} both; }
        @keyframes ppCardUp { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: none; } }
        .pp-rise { animation: ppRise 380ms ${EXPO} both; }
        @keyframes ppRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .pp-slam { animation: ppSlam 360ms ${EXPO} 250ms both; }
        @keyframes ppSlam { from { opacity: 0; transform: scale(2.4); } to { opacity: 1; transform: scale(1); } }
        .pp-ring { animation: ppRing 600ms ${EXPO} 380ms both; }
        @keyframes ppRing { from { opacity: 0.9; transform: scale(0.6); } to { opacity: 0; transform: scale(1.8); } }
        .pp-stamp { animation: ppStamp 220ms ${EXPO} 620ms both; }
        @keyframes ppStamp { from { opacity: 0; transform: rotate(-10deg) scale(2); } to { opacity: 1; transform: rotate(-10deg) scale(1); } }
        .pp-pip { animation: ppPip 240ms ${EXPO} both; animation-delay: calc(700ms + var(--i, 0) * 45ms); }
        @keyframes ppPip { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
        .pp-shake { animation: ppShake 420ms ease-out 200ms both; }
        @keyframes ppShake { 0%,100% { transform: none; } 20% { transform: translate(-6px, 2px); } 40% { transform: translate(5px, -2px); } 60% { transform: translate(-3px, 1px); } 80% { transform: translate(2px, 0); } }
        .pp-spot { animation: ppSpot 700ms ${EXPO} 300ms both; }
        @keyframes ppSpot { from { opacity: 0; transform: translateX(-50%) scale(0.4); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
        .pp-topple { animation: ppTopple 900ms cubic-bezier(0.5, 0, 0.9, 0.4) 350ms both; }
        @keyframes ppTopple { 0% { transform: rotate(0); opacity: 1; } 55% { transform: rotate(78deg); opacity: 1; } 100% { transform: rotate(96deg) translateY(160px); opacity: 0; } }
        .pp-winner { animation: ppWinner 520ms ${EXPO} 700ms both; }
        @keyframes ppWinner { from { opacity: 0; transform: translateY(40px) scale(0.85); } to { opacity: 1; transform: none; } }
        .pp-bob { animation: ppBob 700ms ease-in-out 1200ms infinite alternate; }
        @keyframes ppBob { from { transform: rotate(-6deg) translateY(0); } to { transform: rotate(6deg) translateY(-6px); } }
        .pp-hunt { animation: ppHunt 1400ms ${EXPO} both; }
        @keyframes ppHunt { 0% { transform: translate(-130px, -60px) scale(1.3); opacity: 0; } 10% { opacity: 1; } 35% { transform: translate(110px, -30px) scale(1.2); } 62% { transform: translate(-70px, 40px) scale(1.1); } 80% { transform: translate(0,0) scale(1); } 88% { transform: scale(1.18); } 100% { transform: scale(1); opacity: 1; } }
        .pp-hunt-miss { animation: ppHuntMiss 1400ms ease-in-out both; }
        @keyframes ppHuntMiss { 0% { transform: translate(-130px, -60px) scale(1.3); opacity: 0; } 10% { opacity: 1; } 40% { transform: translate(100px, 10px) scale(1.2); } 70% { transform: translate(-60px, 50px) scale(1.15); } 100% { transform: translate(150px, -80px) scale(1.4); opacity: 0; } }
        .pp-target-lock { animation: ppLockHit 300ms ${EXPO} 1250ms both; }
        @keyframes ppLockHit { from { filter: none; transform: none; } 40% { filter: brightness(3); transform: scale(1.12); } to { filter: grayscale(1) brightness(0.5); transform: scale(0.9) rotate(8deg); } }
        .pp-target-miss { animation: ppDodge 1400ms ease-in-out both; }
        @keyframes ppDodge { 0%,30% { transform: none; } 45% { transform: translateX(-40px); } 75% { transform: translateX(45px); } 100% { transform: translateX(0); } }
        .pp-flash { animation: ppFlash 700ms ${EXPO} both; pointer-events: none; }
        .pp-target-lock ~ .pp-flash, .pp-flash { }
        @keyframes ppFlash { from { opacity: 1; } to { opacity: 0; } }
        .pp-tick { animation: ppTick 420ms ${EXPO} 1750ms both; }
        @keyframes ppTick { from { transform: translateY(0); } to { transform: translateY(-34px); } }
        .pp-rail { width: var(--from); animation: ppRail 700ms ${EXPO} 500ms both; }
        @keyframes ppRail { from { width: var(--from); } to { width: var(--to); } }
        .pp-marker { --x: var(--from); animation: ppMarker 700ms ${EXPO} 500ms both; }
        @keyframes ppMarker { from { --x: var(--from); } to { --x: var(--to); } }
        .pp-marker-slip { --x: var(--to); animation: ppSlip 900ms ${EXPO} 400ms both; }
        @keyframes ppSlip { 0% { --x: var(--to); } 30% { --x: var(--to); } 100% { --x: var(--from); } }
        @property --x { syntax: '<percentage>'; inherits: false; initial-value: 0%; }
        .pp-draw { stroke-dasharray: 40; stroke-dashoffset: 40; animation: ppDraw 360ms ${EXPO} 1150ms both; }
        @keyframes ppDraw { to { stroke-dashoffset: 0; } }
        @keyframes ppCrack { 0%,100% { transform: none; } 25% { transform: translateX(-3px) rotate(-8deg); } 50% { transform: translateX(3px) rotate(8deg); } 75% { transform: translateX(-2px); } }
        .pp-wipe { animation: ppWipe 480ms ${EXPO} both; }
        @keyframes ppWipe { from { clip-path: inset(0 100% 0 0); transform: translateX(-30px); } to { clip-path: inset(0 0 0 0); transform: none; } }
        .pp-glitch { animation: ppGlitch 700ms steps(2, end) both; }
        @keyframes ppGlitch { 0% { opacity: 0; transform: translate(-8px, 0) skewX(-12deg); } 15% { opacity: 1; transform: translate(6px, -3px) skewX(8deg); } 30% { transform: translate(-4px, 2px); } 45% { transform: translate(5px, -1px) skewX(-6deg); } 60% { transform: translate(-2px, 0); } 100% { transform: none; opacity: 1; } }
        .pp-spark { animation: ppSpark 800ms ${EXPO} both; animation-delay: calc(350ms + var(--i, 0) * 20ms); }
        @keyframes ppSpark { from { opacity: 1; transform: rotate(var(--a)) translateX(0) scale(1.4); } to { opacity: 0; transform: rotate(var(--a)) translateX(150px) scale(0.3); } }
        @media (prefers-reduced-motion: reduce) {
          [class^="pp-"], [class*=" pp-"] { animation-duration: 200ms !important; animation-delay: 0ms !important; animation-name: ppRise !important; }
          .pp-flash, .pp-ring, .pp-spark { display: none; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-14">
        <div>
          <h1 className="text-2xl font-black">Level popups — 5 options, Sep 3</h1>
          <p className="text-sm mt-1 max-w-[70ch]" style={{ color: 'rgba(255,255,255,0.65)' }}>Each option is one design language for BOTH moments: cleared on the left, captured on the right. Hit Replay to run the animation again. Same navy/gold kit as the play page.</p>
        </div>
        {OPTIONS.map(({ key, label, blurb, C }) => (
          <section key={key} className="flex flex-col gap-4">
            <div>
              <div className="text-lg font-black" style={GOLD_TEXT}>{label}</div>
              <div className="text-sm max-w-[70ch]" style={{ color: 'rgba(255,255,255,0.65)' }}>{blurb}</div>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <Phone label="Cleared" onReplay={() => replay(key)}><div key={`${key}-c-${seed[key] ?? 0}`} className="absolute inset-0"><C mode="cleared" /></div></Phone>
              <Phone label="Captured" onReplay={() => replay(key)}><div key={`${key}-l-${seed[key] ?? 0}`} className="absolute inset-0"><C mode="lost" /></div></Phone>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
