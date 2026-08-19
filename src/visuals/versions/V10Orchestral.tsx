import { useRef, type CSSProperties, type RefObject } from "react";
import { Stage } from "../shared/Stage";
import { TitleText } from "../shared/TitleText";
import { useImperativeAnimation } from "../shared/useImperativeAnimation";
import type { VisualProps } from "../types";

// 10 — Orchestral : le texte grandit très doucement en suivant la tendance de fond de
// la musique (pas l'énergie instantanée, qui monte et descend sans arrêt — d'où la
// "vibration" signalée), et d'autres paillettes dorées arrivent quand cette tendance
// devient "épique". Troisième passe, 2026-08-10.

// 32 générées, 20 actives par défaut — au-delà, activables via "Nombre de paillettes"
// (?edit, retour du 2026-08-19 : "pouvoir en mettre plus").
const GLITTERS = Array.from({ length: 32 }, (_, i) => ({
  x: (i * 23) % 100,
  size: 2 + ((i * 7) % 3),
  speed: 0.35 + ((i * 11) % 10) / 22,
  delay: (i * 0.8) % 6,
}));

// paillettes "épiques" — invisibles tant que la tendance de fond (epicRef) reste basse.
const EPIC_GLITTERS = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 17 + 6) % 100,
  size: 2 + ((i * 5) % 4),
  speed: 0.5 + ((i * 7) % 10) / 18,
  delay: (i * 0.55) % 6,
}));

function Glitter({ energyRef, x, size, speed, delay }: Pick<VisualProps, "energyRef"> & { x: number; size: number; speed: number; delay: number }) {
  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const cycle = 7 / speed;
    const seconds = t / 1000 + delay;
    const phase = (seconds % cycle) / cycle;
    const y = 100 - phase * 105;
    const drift = Math.sin(t / 900 + x) * 3;
    const twinkle = 0.4 + Math.sin(t / 140 + x * 2) * 0.3 + energy.overall * 0.3;
    node.style.transform = `translate(${drift}vw, ${y}vh)`;
    node.style.opacity = String(Math.max(0, Math.min(1, twinkle)) * Math.sin(Math.PI * phase));
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
        background: "#ffe9b0",
        boxShadow: "0 0 6px 1px rgba(255,215,120,0.8)",
        pointerEvents: "none",
      }}
    />
  );
}

function EpicGlitter({
  energyRef,
  epicRef,
  x,
  size,
  speed,
  delay,
}: Pick<VisualProps, "energyRef"> & { epicRef: RefObject<number>; x: number; size: number; speed: number; delay: number }) {
  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const cycle = 6 / speed;
    const seconds = t / 1000 + delay;
    const phase = (seconds % cycle) / cycle;
    const y = 100 - phase * 105;
    const drift = Math.sin(t / 700 + x) * 4;
    const epic = epicRef.current ?? 0;
    const twinkle = (0.5 + Math.sin(t / 120 + x * 2) * 0.3 + energy.overall * 0.2) * Math.max(0, (epic - 0.12) * 2.2);
    node.style.transform = `translate(${drift}vw, ${y}vh)`;
    node.style.opacity = String(Math.max(0, Math.min(1, twinkle)) * Math.sin(Math.PI * phase));
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
        background: "#fff3d4",
        boxShadow: "0 0 8px 2px rgba(255,225,150,0.9)",
        pointerEvents: "none",
      }}
    />
  );
}

export function V10Orchestral({ energyRef, background, titleFontFamily, custom }: VisualProps) {
  const epicRef = useRef(0);
  const glitterCount = Math.round(custom?.glitterCount ?? GLITTERS.length);
  const shineSpeed = custom?.shineSpeed ?? 1;

  return (
    <Stage background={background ?? "linear-gradient(180deg, #fdf3d8 0%, #f6d68f 24%, #c99a4a 58%, #6e4a1c 100%)"} energyRef={energyRef} flashBand="overall" flashColor="255,240,200">
      {GLITTERS.slice(0, glitterCount).map((g, i) => (
        <Glitter key={i} energyRef={energyRef} {...g} />
      ))}
      {EPIC_GLITTERS.map((g, i) => (
        <EpicGlitter key={i} energyRef={energyRef} epicRef={epicRef} {...g} />
      ))}

      <TitleText
        energyRef={energyRef}
        text="VIRGILE TU BOIS"
        pulseAmount={0}
        className="fx-gold-sweep"
        style={{
          fontFamily: titleFontFamily ?? "V10Cinzel, serif",
          fontWeight: 700,
          backgroundImage: "linear-gradient(100deg, #5c3c14 0%, #5c3c14 42%, #241708 50%, #5c3c14 58%, #5c3c14 100%)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextStroke: "0.5px rgba(36,23,8,0.5)",
          color: "transparent",
          textShadow: "0 1px 0 rgba(255,255,255,0.5)",
          // valeur de prop CSS personnalisée : doit être une chaîne, une assignation
          // numérique directe est silencieusement ignorée par certains navigateurs.
          ["--shine-speed" as string]: String(shineSpeed),
        } as CSSProperties}
      />
    </Stage>
  );
}
