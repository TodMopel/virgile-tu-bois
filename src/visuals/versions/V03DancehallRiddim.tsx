import { useRef } from "react";
import { Stage } from "../shared/Stage";
import { TitleText } from "../shared/TitleText";
import { useImperativeAnimation } from "../shared/useImperativeAnimation";
import { smoothTo } from "../shared/easing";
import { buildSmoothWavePath } from "../shared/curves";
import type { VisualProps } from "../types";

// 03 — Dancehall riddim : une vraie vague qui ondule (courbes lissées, pas une
// polyligne à facettes), remontée au-dessus du panneau de contrôle. Troisième passe,
// 2026-08-10 : "elles ne vaguent pas... fais les faire la vague maintenant qu'on a
// des courbes".

interface WaveLayerProps extends Pick<VisualProps, "energyRef"> {
  baseY: number;
  amplitude: number;
  freq: number;
  speed: number;
  color: string;
  opacity: number;
}

// Quadrillage en fond, vibre comme les autres éléments de la scène (même bruit
// sinusoïdal que le "shake" de Doodle.tsx, calé sur les basses).
function GridBackground({ energyRef }: Pick<VisualProps, "energyRef">) {
  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const level = energy.bass;
    const x = Math.sin(t / 35) * level * 11;
    const y = Math.cos(t / 47) * level * 9;
    node.style.transform = `translate(${x}px, ${y}px) scale(${1 + level * 0.06})`;
    node.style.opacity = String(0.18 + level * 0.25);
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: -20,
        pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(63,174,95,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(63,174,95,0.4) 1px, transparent 1px)",
        backgroundSize: "6vw 6vw",
        opacity: 0.18,
      }}
    />
  );
}

function WaveLayer({ energyRef, baseY, amplitude, freq, speed, color, opacity }: WaveLayerProps) {
  const phaseRef = useRef(Math.random() * 10);
  const lastTRef = useRef<number | null>(null);
  const speedMulRef = useRef(1);

  const ref = useImperativeAnimation<SVGPathElement>(energyRef, (node, energy, t) => {
    const last = lastTRef.current ?? t;
    const dt = Math.max(0, Math.min(0.1, (t - last) / 1000));
    lastTRef.current = t;
    // calmé (retour du 2026-08-10 : "calmer et ralentir la vibration des vagues")
    speedMulRef.current = smoothTo(speedMulRef.current, 1 + energy.bass * 0.4, 0.03);
    phaseRef.current += dt * speed * speedMulRef.current;
    const amp = amplitude * (0.75 + energy.mid * 0.35);
    node.setAttribute("d", buildSmoothWavePath(baseY, amp, phaseRef.current, freq));
  });

  return <path ref={ref} d={buildSmoothWavePath(baseY, amplitude, 0, freq)} fill={color} opacity={opacity} />;
}

export function V03DancehallRiddim({ energyRef }: VisualProps) {
  return (
    <Stage
      background="linear-gradient(160deg, #0c1f12, #123a1f)"
      energyRef={energyRef}
      flashBand="bass"
      flashColor="63,174,95"
      shakeAmount={3}
    >
      <GridBackground energyRef={energyRef} />
      <div className="fx-grain" />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <WaveLayer energyRef={energyRef} baseY={58} amplitude={5} freq={2.6} speed={0.28} color="#123a1f" opacity={0.9} />
        <WaveLayer energyRef={energyRef} baseY={67} amplitude={6} freq={1.8} speed={0.38} color="#1f7a3f" opacity={0.85} />
        <WaveLayer energyRef={energyRef} baseY={76} amplitude={7} freq={1.3} speed={0.5} color="#3fae5f" opacity={0.8} />
      </svg>

      <TitleText
        energyRef={energyRef}
        text="VIRGILE TU BOIS"
        pulseBand="bass"
        pulseAmount={0.1}
        letterMotion="wave"
        letterBand="bass"
        letterAmplitude={6}
        style={{
          fontFamily: "V03Stencil, sans-serif",
          color: "#3fae5f",
          textShadow: "0 0.15em 0 #1f7a3f, 0 0.3em 0.1em rgba(31,122,63,0.5)",
          letterSpacing: "0.04em",
        }}
      />
    </Stage>
  );
}
