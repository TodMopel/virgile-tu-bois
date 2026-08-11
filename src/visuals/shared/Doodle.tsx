import type { CSSProperties, ReactNode } from "react";
import { useImperativeAnimation } from "./useImperativeAnimation";
import type { EnergyFrame, VisualProps } from "../types";

export type DoodleMotion = "rotate" | "pulse" | "drift" | "flicker" | "shake" | "fade";

interface DoodleProps extends Pick<VisualProps, "energyRef"> {
  children: ReactNode;
  motion: DoodleMotion;
  band?: keyof EnergyFrame;
  size?: number;
  color?: string;
  style?: CSSProperties;
}

// Primitive de doodle animé, animée en direct via ref — voir docs/animation-prompts.md.
// Amplitudes volontairement marquées ("effets plus saisissants" demandé).
export function Doodle({ children, motion, energyRef, band = "overall", size = 56, color, style }: DoodleProps) {
  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const level = Math.max(0, Math.min(1, energy[band] ?? 0));
    let transform = "";
    let opacity = 1;

    switch (motion) {
      case "rotate":
        transform = `rotate(${(t / 12) % 360}deg) scale(${1 + level * 0.4})`;
        break;
      case "pulse":
        transform = `scale(${1 + level * 0.65})`;
        break;
      case "drift":
        transform = `translate(${Math.sin(t / 700) * 16 + level * 16}px, ${Math.cos(t / 1300) * 7}px)`;
        break;
      case "flicker":
        opacity = 0.2 + level * 0.9;
        break;
      case "shake": {
        // bruit sinusoïdal plutôt que Math.random pur : lecture "vibration" nette,
        // pas de scintillement erratique.
        transform = `translate(${Math.sin(t / 35) * level * 11}px, ${Math.cos(t / 47) * level * 9}px) scale(${1 + level * 0.15})`;
        break;
      }
      case "fade":
        opacity = 0.2 + level * 0.95;
        break;
    }

    node.style.transform = transform;
    node.style.opacity = String(opacity);
  });

  return (
    <div
      ref={ref}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        color,
        willChange: "transform, opacity",
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
