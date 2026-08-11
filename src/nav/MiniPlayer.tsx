import { usePlaybackContext } from "../audio/PlaybackContext";
import { useSfx } from "../audio/useSfx";
import { paperPalette } from "../ui/paper";
import { EqualizerBars } from "../visuals/shared/EqualizerBars";
import { useHiddenRevealLift } from "./HiddenRevealLift";

interface MiniPlayerProps {
  onOpen: () => void;
}

const NAV_HEIGHT = "calc(5.2rem + env(safe-area-inset-bottom))";

// Mini-lecteur persistant façon Spotify/Deezer : visible sur les écrans autres que
// Lecture tant qu'un morceau est chargé, pour "continuer d'entendre la musique
// quand je navigue" (retour du 2026-08-10) et pouvoir la mettre en pause sans y retourner.
export function MiniPlayer({ onOpen }: MiniPlayerProps) {
  const { currentTrack, playing, energyRef, toggle } = usePlaybackContext();
  const { play: playSfx } = useSfx();
  const { lift } = useHiddenRevealLift();

  if (!currentTrack) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: NAV_HEIGHT,
        zIndex: 15,
        display: "flex",
        justifyContent: "center",
        padding: "0 0.6rem 0.4rem",
        transform: `translateY(${-lift}px)`,
        transition: lift === 0 ? "transform 400ms ease-out" : "none",
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          playSfx("nav-click");
          onOpen();
        }}
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
          background: paperPalette.cream,
          borderRadius: 12,
          padding: "0.5rem 0.6rem",
          boxShadow: "0 6px 16px rgba(43,33,22,0.3)",
          border: `1px solid ${paperPalette.gold}88`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 40,
            height: 40,
            borderRadius: 8,
            flexShrink: 0,
            overflow: "hidden",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
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
          <div style={{ position: "absolute", inset: 0, background: currentTrack.swatch, opacity: 0.62, mixBlendMode: "color" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span
              style={{
                fontSize: "0.34rem",
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.05,
                padding: "0 2px",
                textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                ...currentTrack.labelStyle,
              }}
            >
              VIRGILE TU BOIS
            </span>
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: paperPalette.ink }}>Virgile Tu Bois</div>
          <div style={{ fontSize: "0.72rem", opacity: 0.6, color: paperPalette.ink }}>Sables D'Ozone</div>
        </div>

        {playing && <EqualizerBars energyRef={energyRef} color={paperPalette.pinkDark} size={14} />}

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSfx("nav-click");
            toggle();
          }}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "none",
            background: paperPalette.pink,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
              <path d="M7 4 L20 12 L7 20 Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
