import { useRef } from "react";
import { useImperativeAnimation } from "./useImperativeAnimation";
import { smoothTo } from "./easing";
import type { VisualProps } from "../types";

interface LightBeamProps extends Pick<VisualProps, "energyRef"> {
  x: string;
  baseAngle?: number;
  color?: string;
  width?: number;
  heightVh?: number;
  band?: "bass" | "overall";
  from?: "top" | "bottom";
  /** Certains faisceaux plus lents que d'autres (retour 2026-08-10) : <1 = plus lent. */
  speedScale?: number;
}

// Faisceau de lumière qui, au repos, se balance doucement — et à mesure que l'énergie
// monte, oscille de plus en plus vite ET de plus en plus large, jusqu'à être "projeté
// dans tous les sens" (retour du 2026-08-10 : pas juste un pulse d'intensité, un vrai
// mouvement qui danse). Partagé entre 01 et 07.
export function LightBeam({
  energyRef,
  x,
  baseAngle = 0,
  color = "255,255,255",
  width = 140,
  heightVh = 140,
  band = "bass",
  from = "top",
  speedScale = 1,
}: LightBeamProps) {
  const angleRef = useRef(Math.random() * 10);
  const lastTRef = useRef<number | null>(null);
  const speedMulRef = useRef(1);

  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const last = lastTRef.current ?? t;
    const dt = Math.max(0, Math.min(0.1, (t - last) / 1000));
    lastTRef.current = t;

    // adouci (retour du 2026-08-10 : "trop nerveux en mode fast") — accélère toujours
    // avec l'énergie, mais moins brutalement et sans le battement haute fréquence.
    const level = energy[band] ?? 0;
    const target = 1 + level * 5;
    speedMulRef.current = smoothTo(speedMulRef.current, target, 0.05);
    angleRef.current += dt * speedMulRef.current * speedScale;

    const chaos = Math.max(0, Math.min(1, (speedMulRef.current - 1) / 4));
    const amplitude = 12 + chaos * 38;
    const sway = baseAngle + Math.sin(angleRef.current) * amplitude + Math.sin(angleRef.current * 2.2) * amplitude * 0.3 * chaos;
    const bright = 0.18 + energy.bass * 0.45 + chaos * 0.15;

    node.style.transform = `translate3d(-50%, 0, 0) rotate3d(0, 0, 1, ${sway}deg)`;
    node.style.opacity = String(bright);
  });

  const style =
    from === "top"
      ? { top: -60, background: `linear-gradient(to bottom, rgba(${color},0.7), rgba(${color},0) 72%)`, transformOrigin: "top center" }
      : { bottom: -60, background: `linear-gradient(to top, rgba(${color},0.7), rgba(${color},0) 72%)`, transformOrigin: "bottom center" };

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: x,
        width,
        height: `${heightVh}vh`,
        filter: "blur(20px)",
        pointerEvents: "none",
        // transform 3D + will-change : promeut le faisceau sur sa propre couche GPU pour
        // que le blur reste une bitmap en cache repositionnée, au lieu d'être recalculé
        // à chaque frame — coûteux sur mobile, invisible sur desktop (retour 2026-08-12).
        willChange: "transform",
        ...style,
      }}
    />
  );
}
