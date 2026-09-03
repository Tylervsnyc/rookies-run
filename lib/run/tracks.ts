'use client';

import { getSharedAudioContext } from '@/lib/sounds';

/**
 * Lazily-loaded music beds (fetched + decoded on first use, never in the
 * global preload). Shared by the tutorial (StoryOnboarding) and the game's
 * slow-motion Rookie-captured moment (Tyler 2026-09-03: "the player makes
 * the move, the sad music cues, and Rookie is slowly captured").
 */
export const SAD_MUSIC_URL = '/sounds/sad-cinematic.mp3';

const trackBuffers = new Map<string, AudioBuffer>();
const trackPromises = new Map<string, Promise<AudioBuffer | null>>();

export function loadTrack(ctx: AudioContext, url: string): Promise<AudioBuffer | null> {
  const cached = trackBuffers.get(url);
  if (cached) return Promise.resolve(cached);
  let pending = trackPromises.get(url);
  if (!pending) {
    pending = fetch(url)
      .then((r) => r.arrayBuffer())
      .then((ab) => ctx.decodeAudioData(ab))
      .then((buf) => {
        trackBuffers.set(url, buf);
        return buf;
      })
      .catch(() => {
        trackPromises.delete(url);
        return null;
      });
    trackPromises.set(url, pending);
  }
  return pending;
}

export interface TrackHandle {
  source: AudioBufferSourceNode;
  gain: GainNode;
  cancelled: boolean;
}

/** Start a track (respects the gesture-gated shared context). */
export function startTrack(url: string, volume: number): TrackHandle | null {
  const ctx = getSharedAudioContext();
  if (!ctx) return null;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  gain.connect(ctx.destination);
  const source = ctx.createBufferSource();
  const handle: TrackHandle = { source, gain, cancelled: false };
  const loading = loadTrack(ctx, url);
  const go = () =>
    loading.then((buf) => {
      if (!buf || handle.cancelled) return;
      source.buffer = buf;
      source.connect(gain);
      try {
        source.start();
      } catch {
        /* already started/stopped */
      }
    });
  if (ctx.state === 'suspended') {
    ctx.resume().then(go).catch(() => undefined);
  } else {
    void go();
  }
  return handle;
}

/** Fade a track out over `fadeMs` and stop it. Safe on null / already stopped. */
export function stopTrack(handle: TrackHandle | null, fadeMs = 600): void {
  if (!handle || handle.cancelled) return;
  handle.cancelled = true;
  const ctx = handle.gain.context;
  const t = ctx.currentTime;
  try {
    handle.gain.gain.setValueAtTime(handle.gain.gain.value, t);
    handle.gain.gain.linearRampToValueAtTime(0.0001, t + fadeMs / 1000);
    handle.source.stop(t + fadeMs / 1000 + 0.05);
  } catch {
    /* source never started — nothing to stop */
  }
}
