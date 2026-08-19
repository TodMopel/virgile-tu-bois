import { useRef } from "react";
import { Stage } from "../shared/Stage";
import { TitleText } from "../shared/TitleText";
import { useImperativeAnimation } from "../shared/useImperativeAnimation";
import type { VisualProps } from "../types";

// 08 — Techno ambiance : le nuage (jugé raté) est retiré. Les lettres oscillent de
// façon un peu chaotique et changent de police au rythme de la musique — identité qui
// vacille, plutôt qu'une respiration bien sage. Repris le 2026-08-10.

function breathe(t: number) {
  return 0.5 + 0.5 * Math.sin(t / 3400);
}

function BreathingHaze({ energyRef }: Pick<VisualProps, "energyRef">) {
  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const b = breathe(t);
    node.style.transform = `scale(${0.85 + b * 0.35 + energy.overall * 0.08})`;
    node.style.opacity = String(0.3 + b * 0.35);
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        width: 460,
        height: 460,
        borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(210,226,240,0.55), transparent 70%)",
        pointerEvents: "none",
      }}
    />
  );
}

// Particules qui viennent de hors-écran et se fondent (rétrécissent + s'estompent) au
// centre, happées par la lueur qui respire — retour du 2026-08-11. Angle en pas d'angle
// d'or pour une répartition régulière sans motif visible.
// 30 générées, 18 actives par défaut — au-delà, activables via "Nombre de particules"
// (?edit, retour du 2026-08-19 : "pouvoir en mettre plus").
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  angle: (i * 137.5) % 360,
  size: 3 + ((i * 7) % 5),
  speed: 0.16 + ((i * 11) % 10) / 55,
  delay: (i * 0.4) % 4,
}));

interface ConvergingParticleProps extends Pick<VisualProps, "energyRef"> {
  angle: number;
  size: number;
  speed: number;
  delay: number;
}

function ConvergingParticle({ energyRef, angle, size, speed, delay }: ConvergingParticleProps) {
  const lastTRef = useRef<number | null>(null);
  const progressRef = useRef(-delay);
  const startRRef = useRef(60 + Math.random() * 25);
  const rad = (angle * Math.PI) / 180;

  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const last = lastTRef.current ?? t;
    const dt = Math.max(0, Math.min(0.1, (t - last) / 1000));
    lastTRef.current = t;

    progressRef.current += dt * speed * (0.6 + energy.overall * 0.9);
    if (progressRef.current > 1) {
      progressRef.current = 0;
      startRRef.current = 60 + Math.random() * 25;
    }
    const p = Math.max(0, progressRef.current);
    // accélère en approchant du centre — happée par la lueur plutôt qu'une
    // vitesse constante en ligne droite
    const eased = p * p;
    const r = startRRef.current * (1 - eased);

    const x = Math.cos(rad) * r;
    const y = Math.sin(rad) * r;
    const scale = Math.max(0.12, 1 - eased * 0.85);
    const opacity = p <= 0 ? 0 : Math.min(1, p * 4) * (1 - eased * 0.9);

    node.style.transform = `translate(${x}vmax, ${y}vmax) scale(${scale})`;
    node.style.opacity = String(opacity);
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(210,226,240,0.9)",
        boxShadow: "0 0 6px 1px rgba(210,226,240,0.7)",
        pointerEvents: "none",
        opacity: 0,
      }}
    />
  );
}

const FONT_CYCLE = ["V08Quicksand", "V06ShareTechMono", "V01Fredoka", "V09Marcellus"];

export function V08TechnoAmbiance({ energyRef, background, titleFontFamily, custom }: VisualProps) {
  const particleCount = Math.round(custom?.particleCount ?? PARTICLES.length);
  return (
    <Stage background={background ?? "linear-gradient(135deg, #0a1a2a, #1b3550)"} energyRef={energyRef} flashBand="mid" flashColor="210,226,240">
      {PARTICLES.slice(0, particleCount).map((p, i) => (
        <ConvergingParticle key={i} energyRef={energyRef} {...p} />
      ))}
      <BreathingHaze energyRef={energyRef} />
      <TitleText
        energyRef={energyRef}
        text="virgile tu bois"
        pulseBand="overall"
        pulseAmount={0.03}
        letterMotion="chaotic"
        letterBand="mid"
        letterAmplitude={26}
        letterFontCycle={FONT_CYCLE}
        style={{
          fontFamily: titleFontFamily ?? "V08Quicksand, sans-serif",
          fontWeight: 300,
          color: "rgba(210, 226, 240, 0.85)",
          letterSpacing: "0.06em",
        }}
      />
    </Stage>
  );
}
