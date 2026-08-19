import type { Track } from "../data/tracks";
import { usePlaybackContext } from "../audio/PlaybackContext";
import { useSfx } from "../audio/useSfx";
import { useEffectiveTrackOverride } from "../config/store";
import { TapedCard, StampBadge, paperPalette } from "../ui/paper";
import { EqualizerBars } from "../visuals/shared/EqualizerBars";
import { useImperativeAnimation } from "../visuals/shared/useImperativeAnimation";

interface TrackRowProps {
  track: Track;
  index: number;
  onOpen: () => void;
}

// Une ligne de la tracklist. Si c'est la version en cours de lecture : légère
// vibration (retour du 2026-08-10, "les éléments du site vibrent légèrement
// lorsqu'une musique joue") + égaliseur animé à la place du bouton lecture.
// La vignette reprend la photo de la jaquette (floutée, teintée à la couleur de
// la version) avec le titre stylisé par-dessus — retour du 2026-08-10.
export function TrackRow({ track, index, onOpen }: TrackRowProps) {
  const { currentTrack, playing, energyRef, selectTrack, toggle } = usePlaybackContext();
  const { play: playSfx } = useSfx();
  const override = useEffectiveTrackOverride(track.id);
  const isActive = currentTrack?.id === track.id;

  const thumbRef = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy) => {
    if (!isActive) {
      node.style.transform = "scale(1)";
      return;
    }
    node.style.transform = `scale(${1 + energy.overall * 0.08})`;
  });

  return (
    // Wrapper séparé pour l'animation d'entrée : la carte a déjà sa propre rotation
    // statique, l'animer sur le même noeud écraserait ce transform à la fin du fill.
    <div className="row-enter" style={{ animationDelay: `${index * 55}ms` }}>
      <TapedCard
        id={track.id}
        onClick={() => {
          playSfx("select");
          selectTrack(track.id);
          onOpen();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          outline: isActive ? `2px solid ${paperPalette.pinkDark}` : "none",
        }}
      >
        <StampBadge color={isActive ? paperPalette.pinkDark : paperPalette.pink}>
          {String(track.number).padStart(2, "0")}
        </StampBadge>

        <div
          ref={thumbRef}
          style={{
            position: "relative",
            width: 76,
            height: 76,
            borderRadius: 10,
            flexShrink: 0,
            overflow: "hidden",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15), 0 3px 8px rgba(0,0,0,0.3)",
            willChange: "transform",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -6,
              backgroundImage: "url(./cover/front.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(3px) saturate(1.15)",
              transform: "scale(1.15)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: override.accentColor ?? track.swatch, opacity: 0.62, mixBlendMode: "color" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.05,
                padding: "0 6px",
                textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                ...track.labelStyle,
                fontFamily: override.titleFontFamily ?? track.labelStyle.fontFamily,
              }}
            >
              VIRGILE TU BOIS
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", color: isActive ? paperPalette.pinkDark : paperPalette.ink }}>
            Virgile Tu Bois
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSfx("nav-click");
            if (isActive) {
              toggle();
            } else {
              playSfx("select");
              selectTrack(track.id);
              onOpen();
            }
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: paperPalette.pink,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
          }}
        >
          {isActive && playing ? (
            <EqualizerBars energyRef={energyRef} color="#fff" size={16} />
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M7 4 L20 12 L7 20 Z" />
            </svg>
          )}
        </button>
      </TapedCard>
    </div>
  );
}
