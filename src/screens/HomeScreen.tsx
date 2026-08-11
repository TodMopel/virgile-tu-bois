import { useState } from "react";
import { useSfx } from "../audio/useSfx";
import { usePlaybackContext } from "../audio/PlaybackContext";
import { useImperativeAnimation } from "../visuals/shared/useImperativeAnimation";
import { paperPalette } from "../ui/paper";
import { ShareIcon } from "../ui/icons";

interface HomeScreenProps {
  onEnter: () => void;
}

const HEADER_GRADIENT = `linear-gradient(150deg, ${paperPalette.pink}, ${paperPalette.pinkDark} 85%)`;

export function HomeScreen({ onEnter }: HomeScreenProps) {
  const { play } = useSfx();
  const { playing, energyRef } = usePlaybackContext();
  const [qrOpen, setQrOpen] = useState(false);

  // si un morceau joue déjà (lecture persistante), la pochette danse au son au lieu
  // de flotter en boucle CSS — retour du 2026-08-11.
  const coverRef = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    if (!playing) {
      node.style.transform = "";
      return;
    }
    const bob = Math.sin(t / 900) * 8;
    const bump = energy.bass * 18;
    const sway = Math.sin(t / 650) * 1.2 + energy.mid * 1.8;
    const pulse = 1 + energy.overall * 0.05;
    node.style.transform = `translateY(${-bob - bump}px) rotate(${sway}deg) scale(${pulse})`;
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "#1c130b",
      }}
    >
      {/* jaquette en entier, jamais recadrée, plus petite que l'écran et qui flotte
          doucement — retour du 2026-08-10 */}
      <div
        ref={coverRef}
        className={playing ? undefined : "cover-float"}
        role="button"
        tabIndex={0}
        onClick={() => {
          play("select");
          onEnter();
        }}
        style={{
          position: "absolute",
          inset: "7% 9% 18%",
          backgroundImage: "url(./cover/front.jpeg)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.45))",
          cursor: "pointer",
        }}
      />
      {/* onglet "tiroir" QR code, ferré au bord droit (centré verticalement) — toujours
          visible, même fond que les bannières de titre (TornBanner) — retour du
          2026-08-11. Le bouton fait partie du même bloc que le panneau : à l'ouverture,
          le panneau ne s'affiche pas juste à côté, il pousse vraiment le bouton vers la
          gauche (bouton = premier enfant d'un conteneur qui s'élargit en restant ferré
          à droite). Le QR est blanc sur transparent, il lui faut un fond sombre. */}
      {qrOpen && (
        <div onClick={() => setQrOpen(false)} style={{ position: "absolute", inset: 0, zIndex: 25 }} />
      )}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 0,
          zIndex: 29,
          display: "flex",
          alignItems: "stretch",
          overflow: "hidden",
          maxWidth: qrOpen ? 230 : 40,
          transition: "max-width 320ms ease-out",
          background: HEADER_GRADIENT,
          borderRadius: "12px 0 0 12px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
        }}
      >
        <div className="fx-grain" style={{ opacity: 0.16, mixBlendMode: "overlay" }} />
        <button
          onClick={() => {
            play("nav-click");
            setQrOpen((v) => !v);
          }}
          style={{
            flexShrink: 0,
            width: 40,
            border: "none",
            background: "transparent",
            color: paperPalette.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ width: 19, height: 19 }}>
            <ShareIcon />
          </span>
        </button>
        <div
          style={{
            width: 190,
            flexShrink: 0,
            padding: "0.8rem 1rem 0.8rem 0.3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <img
            src="./qrcode.png"
            alt="QR code de partage"
            style={{ width: "100%", borderRadius: 8, background: "#141414", padding: 10, display: "block" }}
          />
        </div>
      </div>

      <button
        onClick={() => {
          play("select");
          onEnter();
        }}
        style={{
          margin: "0 0 8vh 0",
          padding: "0.9rem 2.6rem",
          fontSize: "1.1rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          border: "2px solid #caa049",
          borderRadius: "999px",
          background: "rgba(0,0,0,0.4)",
          color: "#faf3e2",
          backdropFilter: "blur(3px)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
        }}
      >
        Accéder à l'album
      </button>
    </div>
  );
}
