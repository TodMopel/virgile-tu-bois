import { useRef } from "react";
import { Stage } from "../shared/Stage";
import { TitleText } from "../shared/TitleText";
import { useImperativeAnimation } from "../shared/useImperativeAnimation";
import { smoothTo } from "../shared/easing";
import { CurvedTrail } from "../shared/CurvedTrail";
import type { VisualProps } from "../types";

// 09 — Orchestral electro : brume qui dérive en boucle + des filets de lumière qui sont
// maintenant de vraies courbes (trace lissée sur un historique de positions, pas des
// segments droits qui pivotent) suivant une trajectoire organique en Lissajous, avec
// des boucles occasionnelles. Texte plus calme. Deuxième passe, 2026-08-10 : "c'était
// plus des courbes... là c'est moche".

const BASE_SPEED_VW_PER_SEC = 6;

const BLOBS = [
  { top: "14%", size: 320, opacity: 0.3, speed: 0.85, blur: 42 },
  { top: "40%", size: 480, opacity: 0.25, speed: 0.6, blur: 58 },
  { top: "66%", size: 300, opacity: 0.28, speed: 1.1, blur: 34 },
  { top: "84%", size: 260, opacity: 0.22, speed: 0.75, blur: 40 },
];

interface FogBlobProps extends Pick<VisualProps, "energyRef"> {
  top: string;
  size: number;
  opacity: number;
  speed: number;
  blur: number;
}

function FogBlob({ energyRef, top, size, opacity, speed, blur }: FogBlobProps) {
  const distanceRef = useRef(Math.random() * 40);
  const lastTRef = useRef<number | null>(null);
  const speedMulRef = useRef(1);

  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const last = lastTRef.current ?? t;
    const dt = Math.max(0, Math.min(0.1, (t - last) / 1000));
    lastTRef.current = t;

    speedMulRef.current = smoothTo(speedMulRef.current, 1 + energy.mid * 0.6, 0.03);
    distanceRef.current += dt * speed * speedMulRef.current * BASE_SPEED_VW_PER_SEC;

    const margin = size / 4;
    const span = 100 + margin * 2;
    const x = ((distanceRef.current % span) + span) % span;
    node.style.transform = `translateX(${x - margin}vw)`;
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top,
        left: 0,
        width: size,
        height: size * 0.5,
        borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(210,255,230,0.9), rgba(210,255,230,0) 70%)",
        filter: `blur(${blur}px)`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  y: (i * 6.3) % 100,
  size: 1.5 + ((i * 5) % 3),
  speed: 0.5 + ((i * 9) % 10) / 16,
  delay: (i * 0.7) % 5,
  baseTwinkle: 0.3,
  energyGain: 0.3,
}));

// particules "bonus" — quasi invisibles au calme, qui n'apparaissent vraiment que
// quand l'énergie médium monte (retour 2026-08-10 : "passe à beaucoup de lignes et
// de particules" quand le son module beaucoup).
const BONUS_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  y: (i * 7.1 + 3) % 100,
  size: 1.5 + ((i * 5) % 3),
  speed: 0.6 + ((i * 9) % 10) / 16,
  delay: (i * 0.9) % 5,
  baseTwinkle: 0.02,
  energyGain: 1,
}));

function MistParticle({
  energyRef,
  y,
  size,
  speed,
  delay,
  baseTwinkle,
  energyGain,
}: Pick<VisualProps, "energyRef"> & { y: number; size: number; speed: number; delay: number; baseTwinkle: number; energyGain: number }) {
  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const cycle = 9 / speed;
    const seconds = t / 1000 + delay;
    const phase = (seconds % cycle) / cycle;
    const x = phase * 112 - 8; // vw, part de gauche va vers la droite comme les filets/la brume
    const twinkle = baseTwinkle + Math.sin(t / 260 + y) * 0.15 + energy.mid * energyGain;
    node.style.transform = `translateX(${x}vw)`;
    node.style.opacity = String(Math.max(0, twinkle) * Math.sin(Math.PI * phase));
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: `${y}%`,
        left: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#daffe8",
        boxShadow: "0 0 5px 1px rgba(180,255,220,0.8)",
        pointerEvents: "none",
      }}
    />
  );
}

export function V09OrchestralElectro({ energyRef }: VisualProps) {
  return (
    <Stage
      background="linear-gradient(135deg, #052014, #0a3d2a)"
      energyRef={energyRef}
      flashBand="mid"
      flashColor="79,255,170"
    >
      {BLOBS.map((blob, i) => (
        <FogBlob key={i} energyRef={energyRef} {...blob} />
      ))}
      {PARTICLES.map((p, i) => (
        <MistParticle key={i} energyRef={energyRef} {...p} />
      ))}
      {BONUS_PARTICLES.map((p, i) => (
        <MistParticle key={`bonus-${i}`} energyRef={energyRef} {...p} />
      ))}

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <CurvedTrail energyRef={energyRef} scaleX={46} scaleY={30} speed={0.5} strokeWidth={0.5} color="rgba(220,255,235,0.9)" band="mid" driftPerSec={3.2} trailLength={230} baseOpacity={0.55} opacityGain={0.3} />
        <CurvedTrail energyRef={energyRef} scaleX={34} scaleY={40} speed={0.38} strokeWidth={0.5} color="rgba(220,255,235,0.9)" band="mid" driftPerSec={2.4} trailLength={200} baseOpacity={0.55} opacityGain={0.3} />
        <CurvedTrail energyRef={energyRef} scaleX={52} scaleY={22} speed={0.62} strokeWidth={0.5} color="rgba(220,255,235,0.9)" band="mid" driftPerSec={4} trailLength={242} baseOpacity={0.55} opacityGain={0.3} />

        <CurvedTrail energyRef={energyRef} cx={30} cy={30} scaleX={30} scaleY={24} speed={0.7} strokeWidth={0.4} color="rgba(180,255,220,0.9)" band="mid" driftPerSec={4.5} trailLength={230} baseOpacity={0.02} opacityGain={1} />
        <CurvedTrail energyRef={energyRef} cx={70} cy={70} scaleX={26} scaleY={32} speed={0.55} strokeWidth={0.4} color="rgba(180,255,220,0.9)" band="mid" driftPerSec={3.6} trailLength={260} baseOpacity={0.02} opacityGain={1} />
        <CurvedTrail energyRef={energyRef} cx={50} cy={50} scaleX={40} scaleY={18} speed={0.85} strokeWidth={0.4} color="rgba(180,255,220,0.9)" band="mid" driftPerSec={5.2} trailLength={340} baseOpacity={0.02} opacityGain={1} />
      </svg>

      <TitleText
        energyRef={energyRef}
        text="Virgile Tu Bois"
        pulseBand="mid"
        pulseAmount={0.04}
        letterMotion="wave"
        letterBand="mid"
        letterAmplitude={3}
        style={{
          fontFamily: "V09Marcellus, Georgia, serif",
          color: "#eaf7ee",
          textShadow: "0 0 10px rgba(79,255,170,0.4)",
        }}
      />
    </Stage>
  );
}
