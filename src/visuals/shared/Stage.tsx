import { useRef, type CSSProperties, type ReactNode } from "react";
import { useImperativeAnimation } from "./useImperativeAnimation";
import type { EnergyFrame, VisualProps } from "../types";

interface StageProps extends Pick<VisualProps, "energyRef"> {
  children: ReactNode;
  background: string;
  /** Bande utilisée pour détecter les "coups" (front montant) et déclencher le flash. */
  flashBand?: keyof EnergyFrame;
  flashColor?: string;
  /** Amplitude du tremblement d'écran sur les basses, en px (0 = désactivé). */
  shakeAmount?: number;
  style?: CSSProperties;
}

const FLASH_THRESHOLD = 0.22;
const FLASH_DECAY = 0.86;

// Conteneur plein écran partagé par les 10 versions : fond, flash sur les coups,
// tremblement optionnel — tout piloté en direct via ref (pas de re-render React),
// voir CONTEXT.md (correction perf du 2026-08-10) et le retour "effets plus saisissants".
export function Stage({
  children,
  background,
  energyRef,
  flashBand = "bass",
  flashColor = "255,255,255",
  shakeAmount = 0,
  style,
}: StageProps) {
  const prevLevelRef = useRef(0);
  const flashLevelRef = useRef(0);

  const containerRef = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    if (shakeAmount > 0) {
      const b = energy.bass;
      const x = Math.sin(t / 23) * b * shakeAmount;
      const y = Math.cos(t / 29) * b * shakeAmount * 0.6;
      node.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  const flashRef = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy) => {
    const level = energy[flashBand] ?? 0;
    if (level - prevLevelRef.current > FLASH_THRESHOLD) {
      flashLevelRef.current = 1;
    }
    prevLevelRef.current = level;
    flashLevelRef.current *= FLASH_DECAY;
    node.style.opacity = String(flashLevelRef.current * 0.5);
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(1rem, 4vh, 2.5rem)",
        overflow: "hidden",
        background,
        ...style,
      }}
    >
      {children}
      <div
        ref={flashRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `rgb(${flashColor})`,
          opacity: 0,
        }}
      />
    </div>
  );
}
