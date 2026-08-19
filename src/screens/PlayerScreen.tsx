import { useState, type CSSProperties, type ReactNode } from "react";
import { usePlaybackContext } from "../audio/PlaybackContext";
import { formatTime } from "../audio/formatTime";
import { useSfx } from "../audio/useSfx";
import { useEffectiveTrackOverride } from "../config/store";
import { PlayIcon, PauseIcon, NextIcon, PrevIcon, ShuffleIcon, RepeatIcon, RepeatOneIcon, VolumeIcon } from "../ui/icons";

interface PlayerScreenProps {
  onBack: () => void;
}

// le MenuBar n'est plus affiché sur cet écran (retour du 2026-08-12 : meilleure vue
// sur le visuel) — juste la marge de sécurité en bas, plus l'espace réservé au nav.
const CONTROLS_BOTTOM_GAP = "calc(0.8rem + env(safe-area-inset-bottom))";

// Lit le morceau depuis le contexte de lecture global (voir audio/PlaybackContext) —
// ne redémarre jamais un morceau déjà en cours (la sélection déclenche la lecture,
// pas cet écran), et suit automatiquement l'enchaînement / boucle d'album.
export function PlayerScreen({ onBack }: PlayerScreenProps) {
  const {
    currentTrack,
    playing,
    currentTime,
    duration,
    volume,
    shuffle,
    repeatMode,
    energyRef,
    toggle,
    seek,
    next,
    prev,
    setVolume,
    toggleShuffle,
    toggleRepeatMode,
  } = usePlaybackContext();
  const { play: playSfx } = useSfx();
  // Hook appelé avant le early return ci-dessous (règle des hooks) — id vide si rien
  // ne joue encore, la fusion retombe alors simplement sur {}.
  const override = useEffectiveTrackOverride(currentTrack?.id ?? "");

  // Pendant un drag, on affiche la valeur locale plutôt que celle du contexte :
  // le contexte se remet à jour toutes les 200ms (voir PlaybackContext.tick) et,
  // sans ça, ce re-render périodique peut retomber pile pendant le drag et forcer
  // le curseur à revenir à sa position d'avant (bug "ça saute et revient").
  const [seekDrag, setSeekDrag] = useState<number | null>(null);
  const [volumeDrag, setVolumeDrag] = useState<number | null>(null);

  if (!currentTrack) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff", gap: "1rem" }}>
        Rien ne joue pour l'instant.
        <button onClick={onBack}>← Choisir une version</button>
      </div>
    );
  }

  const { Visual } = currentTrack;
  const remaining = Math.max(0, duration - currentTime);

  const iconButton = (onClick: () => void, content: ReactNode, size = 22, extraStyle: CSSProperties = {}) => (
    <button
      onClick={() => {
        playSfx("nav-click");
        onClick();
      }}
      style={{
        width: size + 18,
        height: size + 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        background: "transparent",
        color: "#fff",
        ...extraStyle,
      }}
    >
      <span style={{ width: size, height: size }}>{content}</span>
    </button>
  );

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Visual
        energyRef={energyRef}
        playing={playing}
        background={override.background}
        titleFontFamily={override.titleFontFamily}
        custom={override.custom}
      />

      <button
        onClick={() => {
          playSfx("nav-click");
          onBack();
        }}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          zIndex: 10,
          border: "none",
          borderRadius: "999px",
          padding: "0.5rem 1rem",
          background: "rgba(0,0,0,0.4)",
          color: "#fff",
          fontWeight: 600,
        }}
      >
        ← 
      </button>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: CONTROLS_BOTTOM_GAP,
          zIndex: 10,
          padding: "0 1rem 0.6rem",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
            borderRadius: 18,
            padding: "0.9rem 1.1rem 1.3rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontSize: "0.72rem", opacity: 0.85 }}>
            <span style={{ minWidth: 32 }}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={seekDrag ?? Math.min(currentTime, duration || 0)}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSeekDrag(v);
                seek(v);
              }}
              onPointerUp={() => setSeekDrag(null)}
              onBlur={() => setSeekDrag(null)}
              style={{ flex: 1, accentColor: "#fff" }}
            />
            <span style={{ minWidth: 32, textAlign: "right" }}>-{formatTime(remaining)}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.1rem" }}>
            {iconButton(toggleShuffle, <ShuffleIcon />, 18, { opacity: shuffle ? 1 : 0.45 })}
            {iconButton(prev, <PrevIcon />, 22)}
            <button
              onClick={() => {
                playSfx("nav-click");
                toggle();
              }}
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.85)",
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ width: 24, height: 24, marginLeft: playing ? 0 : 2 }}>
                {playing ? <PauseIcon /> : <PlayIcon />}
              </span>
            </button>
            {iconButton(next, <NextIcon />, 22)}
            {iconButton(toggleRepeatMode, repeatMode === "one" ? <RepeatOneIcon /> : <RepeatIcon />, 18, {
              opacity: repeatMode === "one" ? 1 : 0.45,
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0 0.2rem" }}>
            <span style={{ width: 16, height: 16, opacity: 0.85 }}>
              <VolumeIcon />
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volumeDrag ?? volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolumeDrag(v);
                setVolume(v);
              }}
              onPointerUp={() => setVolumeDrag(null)}
              onBlur={() => setVolumeDrag(null)}
              style={{ flex: 1, accentColor: "#fff" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
