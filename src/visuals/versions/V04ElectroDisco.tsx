import { useRef } from "react";
import { Stage } from "../shared/Stage";
import { TitleText } from "../shared/TitleText";
import { useImperativeAnimation } from "../shared/useImperativeAnimation";
import { CurvedTrail } from "../shared/CurvedTrail";
import type { VisualProps } from "../types";

// 04 — Electro disco : glow néon qui respire, scanlines, des étincelles qui montent, un
// glitch RGB-split occasionnel sur le titre, et des filets de lumière en courbes
// organiques (plus des segments droits qui pivotaient — retour du 2026-08-10 :
// "adapte tes traits moches par nos belles courbes").

// 24 générées, 14 actives par défaut — au-delà, activables via "Nombre d'étincelles"
// (?edit, retour du 2026-08-19 : "pouvoir en mettre plus").
const SPARKS = Array.from({ length: 24 }, (_, i) => ({
  x: (i * 37) % 100,
  size: 2 + ((i * 13) % 4),
  speed: 0.4 + ((i * 7) % 10) / 20,
  delay: (i * 0.6) % 4,
}));

function Spark({ energyRef, x, size, speed, delay }: Pick<VisualProps, "energyRef"> & { x: number; size: number; speed: number; delay: number }) {
  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const cycle = 4.5 / speed;
    const seconds = t / 1000 + delay;
    const phase = (seconds % cycle) / cycle;
    const y = 100 - phase * 100;
    const flicker = 0.3 + Math.sin(t / 90 + x) * 0.25 + energy.treble * 0.4;
    node.style.transform = `translateY(${y}vh)`;
    node.style.opacity = String(Math.max(0, Math.min(1, flicker)) * Math.sin(Math.PI * phase));
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#ff9df0",
        boxShadow: "0 0 6px 1px #ff2fd6",
        pointerEvents: "none",
      }}
    />
  );
}

export function V04ElectroDisco({ energyRef, background, titleFontFamily, custom }: VisualProps) {
  const prevTrebleRef = useRef(0);
  const glitchRef = useRef(0);
  const sparkCount = Math.round(custom?.sparkCount ?? SPARKS.length);

  return (
    <Stage background={background ?? "linear-gradient(135deg, #1a0022, #3a0057)"} energyRef={energyRef} flashBand="treble" flashColor="255,47,214">
      <div className="fx-scanlines" />
      {SPARKS.slice(0, sparkCount).map((s, i) => (
        <Spark key={i} energyRef={energyRef} {...s} />
      ))}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <CurvedTrail energyRef={energyRef} cx={30} cy={35} scaleX={26} scaleY={20} speed={0.7} strokeWidth={0.5} color="#ff2fd6" band="treble" trailLength={730} baseOpacity={0.02} opacityGain={1}  />
        <CurvedTrail energyRef={energyRef} cx={70} cy={60} scaleX={22} scaleY={26} speed={0.55} strokeWidth={0.4} color="#7dfcff" band="treble"trailLength={130} baseOpacity={0.02} opacityGain={1}  />
        <CurvedTrail energyRef={energyRef} cx={50} cy={80} scaleX={32} scaleY={14} speed={0.85} strokeWidth={0.35} color="#b06bff" band="treble" trailLength={540} baseOpacity={0.02} opacityGain={1} />
        {/* filets additionnels, longueurs variées 200-500 — retour du 2026-08-11 */}
        <CurvedTrail energyRef={energyRef} cx={20} cy={70} scaleX={18} scaleY={24} speed={0.6} strokeWidth={0.3} color="#ff2fd6" band="mid" trailLength={260} baseOpacity={0.02} opacityGain={1} />
        <CurvedTrail energyRef={energyRef} cx={80} cy={25} scaleX={24} scaleY={16} speed={0.75} strokeWidth={0.35} color="#7dfcff" band="mid" trailLength={380} baseOpacity={0.02} opacityGain={1} />
        <CurvedTrail energyRef={energyRef} cx={45} cy={50} scaleX={30} scaleY={22} speed={0.5} strokeWidth={0.3} color="#b06bff" band="bass" trailLength={460} baseOpacity={0.02} opacityGain={1} />
        <CurvedTrail energyRef={energyRef} cx={60} cy={85} scaleX={16} scaleY={18} speed={0.9} strokeWidth={0.3} color="#ff2fd6" band="treble" trailLength={210} baseOpacity={0.02} opacityGain={1} />
      </svg>

      <TitleText
        energyRef={energyRef}
        text="virgile tu bois"
        pulseBand="treble"
        pulseAmount={0.05}
        letterMotion="wave"
        letterBand="treble"
        letterAmplitude={5}
        onFrame={(node, energy, t) => {
          const breathe = 0.7 + 0.3 * Math.sin(t / 1250) + energy.treble * 0.25;
          // glow réduit + passé en rgba (retour du 2026-08-12 : "glow cramé" sur mobile —
          // le text-shadow blur de Safari/iOS est plus "solide"/moins dégradé que sur
          // desktop, donc un halo en couleur opaque à ce rayon ressort comme un bloc plein
          // au lieu d'une lueur douce. Rayon plus petit + alpha < 1 sur les deux couches.
          const glow = 10 + breathe * 8;

          if (energy.treble - prevTrebleRef.current > 0.25) glitchRef.current = 1;
          prevTrebleRef.current = energy.treble;
          glitchRef.current *= 0.82;
          const g = glitchRef.current * 5;

          node.style.textShadow = `${g}px 0 0 rgba(255,60,220,0.7), ${-g}px 0 0 rgba(120,255,255,0.6), 0 0 ${glow}px rgba(255,47,214,0.65), 0 0 ${glow * 1.6}px rgba(155,47,255,0.4)`;
        }}
        style={{
          fontFamily: titleFontFamily ?? "V04Audiowide, sans-serif",
          color: "transparent",
          WebkitTextStroke: "2px #ff2fd6",
        }}
      />
    </Stage>
  );
}
