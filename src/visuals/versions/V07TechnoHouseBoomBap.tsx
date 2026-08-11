import { useRef } from "react";
import { Stage } from "../shared/Stage";
import { TitleText } from "../shared/TitleText";
import { LightBeam } from "../shared/LightBeam";
import { BoomboxIcon } from "../shared/icons";
import { useImperativeAnimation } from "../shared/useImperativeAnimation";
import { smoothTo } from "../shared/easing";
import type { VisualProps } from "../types";

// 07 — Techno house boom bap : faisceaux façon festival (composant partagé avec la 01 —
// balancement qui accélère et s'amplifie avec l'énergie, pas juste un pulse), plusieurs
// couleurs comme une vraie rampe de projecteurs. Deuxième passe 2026-08-10.

// plus de faisceaux, vitesses variées (certains nettement plus lents que d'autres) —
// retour du 2026-08-10.
const BEAMS: { x: string; baseAngle: number; color: string; width: number; speedScale: number }[] = [
  { x: "6%", baseAngle: -9, color: "255,225,180", width: 60, speedScale: 0.55 },
  { x: "18%", baseAngle: -5, color: "255,140,180", width: 50, speedScale: 1.1 },
  { x: "30%", baseAngle: -2, color: "140,220,255", width: 55, speedScale: 0.7 },
  { x: "42%", baseAngle: -1, color: "180,140,255", width: 45, speedScale: 1.3 },
  { x: "54%", baseAngle: 2, color: "255,225,180", width: 50, speedScale: 0.6 },
  { x: "66%", baseAngle: 3, color: "140,220,255", width: 55, speedScale: 1 },
  { x: "78%", baseAngle: 5, color: "180,140,255", width: 60, speedScale: 0.5 },
  { x: "90%", baseAngle: 8, color: "255,140,180", width: 65, speedScale: 1.2 },
];

// 7 lignes blanches qui dansent (balancement + rotation, calées sur les basses) —
// retour du 2026-08-11, en plus des faisceaux colorés.
const DANCING_LINES: { x: string; length: number; freq: number; phase: number; swayAmp: number; rotAmp: number }[] = [
  { x: "12%", length: 130, freq: 1.2, phase: 0.0, swayAmp: 26, rotAmp: 10 },
  { x: "24%", length: 110, freq: 1.6, phase: 0.9, swayAmp: 22, rotAmp: 14 },
  { x: "38%", length: 150, freq: 0.9, phase: 1.8, swayAmp: 30, rotAmp: 8 },
  { x: "50%", length: 120, freq: 1.4, phase: 2.7, swayAmp: 20, rotAmp: 16 },
  { x: "62%", length: 140, freq: 1.1, phase: 3.6, swayAmp: 28, rotAmp: 9 },
  { x: "76%", length: 115, freq: 1.7, phase: 4.5, swayAmp: 24, rotAmp: 13 },
  { x: "88%", length: 135, freq: 1.0, phase: 5.4, swayAmp: 27, rotAmp: 11 },
];

interface DancingLineProps extends Pick<VisualProps, "energyRef"> {
  x: string;
  length: number;
  freq: number;
  phase: number;
  swayAmp: number;
  rotAmp: number;
}

function DancingLine({ energyRef, x, length, freq, phase, swayAmp, rotAmp }: DancingLineProps) {
  const clockRef = useRef(phase * 3);
  const lastTRef = useRef<number | null>(null);
  const speedMulRef = useRef(1);

  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const last = lastTRef.current ?? t;
    const dt = Math.max(0, Math.min(0.1, (t - last) / 1000));
    lastTRef.current = t;

    speedMulRef.current = smoothTo(speedMulRef.current, 1 + energy.bass * 2.2, 0.06);
    clockRef.current += dt * freq * speedMulRef.current;
    const s = clockRef.current;

    const sway = Math.sin(s + phase) * swayAmp;
    const rotate = Math.sin(s * 1.3 + phase) * rotAmp * (0.6 + energy.bass * 0.6);
    const scaleY = 1 + energy.bass * 0.2;

    node.style.transform = `translateX(${sway}px) rotate(${rotate}deg) scaleY(${scaleY})`;
    node.style.opacity = String(0.55 + energy.bass * 0.45);
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: x,
        bottom: 0,
        width: 3,
        height: length,
        transformOrigin: "bottom center",
        background: "linear-gradient(0deg, rgba(255,255,255,0.95), rgba(255,255,255,0))",
        boxShadow: "0 0 10px 1px rgba(255,255,255,0.85)",
        pointerEvents: "none",
      }}
    />
  );
}

export function V07TechnoHouseBoomBap({ energyRef }: VisualProps) {
  const prevBassRef = useRef(0);
  const impactRef = useRef(0);

  return (
    <Stage
      background="linear-gradient(135deg, #111114, #303036)"
      energyRef={energyRef}
      flashBand="bass"
      flashColor="231,227,216"
    >
      {BEAMS.map((b, i) => (
        <LightBeam key={i} energyRef={energyRef} from="bottom" heightVh={170} band="bass" {...b} />
      ))}
      {DANCING_LINES.map((l, i) => (
        <DancingLine key={i} energyRef={energyRef} {...l} />
      ))}
      <div className="fx-grain" />
      <div style={{ width: 54, height: 54, color: "#e7e3d8", opacity: 0.9 }}>
        <BoomboxIcon />
      </div>
      <TitleText
        energyRef={energyRef}
        text="VIRGILE TU BOIS"
        pulseBand="bass"
        pulseAmount={0}
        letterMotion="wave"
        letterBand="bass"
        letterAmplitude={3}
        onFrame={(node, energy) => {
          if (energy.bass - prevBassRef.current > 0.18) {
            impactRef.current = 1;
          }
          prevBassRef.current = energy.bass;
          impactRef.current *= 0.87;
          const p = impactRef.current;
          node.style.transform = `scale(${1 + p * 0.1}, ${1 - p * 0.16})`;
        }}
        style={{
          fontFamily: "V07Anton, sans-serif",
          color: "#e7e3d8",
          textShadow: "3px 3px 0 #000, -1px -1px 0 rgba(255,255,255,0.15)",
          transformOrigin: "center bottom",
        }}
      />
    </Stage>
  );
}
