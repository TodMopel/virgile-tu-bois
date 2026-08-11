import { useSfx } from "../audio/useSfx";
import { usePlaybackContext } from "../audio/PlaybackContext";
import { useImperativeAnimation } from "../visuals/shared/useImperativeAnimation";

interface HomeScreenProps {
  onEnter: () => void;
}

export function HomeScreen({ onEnter }: HomeScreenProps) {
  const { play } = useSfx();
  const { playing, energyRef } = usePlaybackContext();

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
