import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { tracks, type Track } from "../data/tracks";
import { energyAt } from "./analysis";
import { SILENT_FRAME, type EnergyFrame } from "../visuals/types";
import { smoothTo } from "../visuals/shared/easing";
import { getEffectiveTrackOverride } from "../config/store";

const INTENSITY_MAX = 3;

export type RepeatMode = "all" | "one";

interface PlaybackContextValue {
  currentTrack: Track | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  energyRef: RefObject<EnergyFrame>;
  selectTrack: (id: string, autoplay?: boolean) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (t: number) => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  toggleRepeatMode: () => void;
}

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

const SMOOTH_ALPHA = 0.2;
const IDLE_DECAY_ALPHA = 0.08;
const STATE_UPDATE_INTERVAL_MS = 200;

// Moteur de lecture unique, monté une seule fois au niveau de l'app : survit à la
// navigation entre écrans. Gère aussi l'enchaînement automatique (respecte le mode
// aléatoire), l'historique pour "précédent", le volume et la position de lecture.
export function PlaybackProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const energyRef = useRef<EnergyFrame>({ ...SILENT_FRAME });
  const rafRef = useRef<number | null>(null);
  const currentTrackRef = useRef<Track | null>(null);
  const historyRef = useRef<string[]>([]);
  const shuffleRef = useRef(false);
  const repeatModeRef = useRef<RepeatMode>("all");
  const lastStateUpdateRef = useRef(0);

  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");

  const goTo = (track: Track, autoplay: boolean) => {
    const prevTrack = currentTrackRef.current;
    if (prevTrack && prevTrack.id !== track.id) {
      historyRef.current.push(prevTrack.id);
      if (historyRef.current.length > 20) historyRef.current.shift();
    }
    currentTrackRef.current = track;
    setCurrentTrackId(track.id);
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.audioSrc;
    audio.currentTime = 0;
    setCurrentTime(0);
    setDuration(0);
    if (autoplay) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  const selectTrack = (id: string, autoplay = true) => {
    const track = tracks.find((t) => t.id === id);
    if (!track) return;
    if (currentTrackRef.current?.id === track.id) {
      if (autoplay) play();
      return;
    }
    goTo(track, autoplay);
  };

  const next = () => {
    const current = currentTrackRef.current;
    let nextTrack: Track;
    if (shuffleRef.current) {
      const others = tracks.filter((t) => t.id !== current?.id);
      nextTrack = others[Math.floor(Math.random() * others.length)] ?? tracks[0];
    } else {
      const idx = tracks.findIndex((t) => t.id === current?.id);
      nextTrack = tracks[(idx + 1 + tracks.length) % tracks.length];
    }
    goTo(nextTrack, true);
  };

  const prev = () => {
    const lastId = historyRef.current.pop();
    const track = lastId ? tracks.find((t) => t.id === lastId) : undefined;
    if (track) {
      // ne repousse pas dans l'historique : "précédent" plusieurs fois doit reculer
      currentTrackRef.current = track;
      setCurrentTrackId(track.id);
      const audio = audioRef.current;
      if (audio) {
        audio.src = track.audioSrc;
        audio.currentTime = 0;
        setCurrentTime(0);
        setDuration(0);
        audio
          .play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      }
      return;
    }
    const current = currentTrackRef.current;
    const idx = tracks.findIndex((t) => t.id === current?.id);
    const fallback = tracks[(idx - 1 + tracks.length) % tracks.length];
    goTo(fallback, true);
  };

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = volume;
    audioRef.current = audio;

    const onEnded = () => {
      // "repeat one" : reboucle le même morceau plutôt que d'enchaîner — retour du 2026-08-10
      if (repeatModeRef.current === "one") {
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => setPlaying(false));
        }
        return;
      }
      next(); // enchaînement auto (respecte le mode aléatoire), boucle d'album
    };
    const onLoadedMeta = () => setDuration(audio.duration || 0);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMeta);

    const tick = () => {
      const a = audioRef.current;
      const track = currentTrackRef.current;
      const e = energyRef.current;
      if (a && track && !a.paused) {
        const raw = energyAt(track.analysis, a.currentTime);
        // intensité réglable depuis le panneau ?edit — multiplicateur d'amplitude, lu
        // directement sur le store (pas de hook/state ici : cette boucle tourne à 60fps
        // hors du cycle de rendu React, voir CONTEXT.md).
        const intensity = Math.min(INTENSITY_MAX, Math.max(0, getEffectiveTrackOverride(track.id).intensity ?? 1));
        e.bass = smoothTo(e.bass, raw.bass * intensity, SMOOTH_ALPHA);
        e.mid = smoothTo(e.mid, raw.mid * intensity, SMOOTH_ALPHA);
        e.treble = smoothTo(e.treble, raw.treble * intensity, SMOOTH_ALPHA);
        e.overall = smoothTo(e.overall, raw.overall * intensity, SMOOTH_ALPHA);

        const now = performance.now();
        if (now - lastStateUpdateRef.current > STATE_UPDATE_INTERVAL_MS) {
          lastStateUpdateRef.current = now;
          setCurrentTime(a.currentTime);
        }
      } else {
        e.bass = smoothTo(e.bass, 0, IDLE_DECAY_ALPHA);
        e.mid = smoothTo(e.mid, 0, IDLE_DECAY_ALPHA);
        e.treble = smoothTo(e.treble, 0, IDLE_DECAY_ALPHA);
        e.overall = smoothTo(e.overall, 0, IDLE_DECAY_ALPHA);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = () => {
    if (!currentTrackRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  const toggle = () => (playing ? pause() : play());

  const seek = (t: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = t;
    setCurrentTime(t);
  };

  const setVolume = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  };

  const toggleShuffle = () => {
    setShuffle((s) => {
      shuffleRef.current = !s;
      return !s;
    });
  };

  const toggleRepeatMode = () => {
    setRepeatMode((m) => {
      const next: RepeatMode = m === "all" ? "one" : "all";
      repeatModeRef.current = next;
      return next;
    });
  };

  const currentTrack = tracks.find((t) => t.id === currentTrackId) ?? null;

  return (
    <PlaybackContext.Provider
      value={{
        currentTrack,
        playing,
        currentTime,
        duration,
        volume,
        shuffle,
        repeatMode,
        energyRef,
        selectTrack,
        play,
        pause,
        toggle,
        seek,
        next,
        prev,
        setVolume,
        toggleShuffle,
        toggleRepeatMode,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlaybackContext(): PlaybackContextValue {
  const ctx = useContext(PlaybackContext);
  if (!ctx) throw new Error("usePlaybackContext doit être utilisé sous PlaybackProvider");
  return ctx;
}
