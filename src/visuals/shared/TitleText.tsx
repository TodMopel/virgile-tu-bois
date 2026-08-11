import { useRef, type CSSProperties } from "react";
import { useImperativeAnimation } from "./useImperativeAnimation";
import type { EnergyFrame, VisualProps } from "../types";

interface TitleTextProps extends Pick<VisualProps, "energyRef"> {
  text?: string;
  style: CSSProperties;
  className?: string;
  pulseBand?: keyof EnergyFrame;
  pulseAmount?: number;
  /** Transform additionnel calculé à chaque frame (glitch, drift...), composé avec le pulse. */
  extraTransform?: (energy: EnergyFrame, elapsedMs: number) => string;
  /** Accès direct au noeud pour animer autre chose que transform (backgroundPosition...). */
  onFrame?: (node: HTMLHeadingElement, energy: EnergyFrame, elapsedMs: number) => void;
  /** Anime chaque lettre indépendamment et déphasée plutôt que le bloc entier d'un coup
   * (retour du 2026-08-10 : "pas tout en même temps"). */
  letterMotion?: "none" | "wave" | "chaotic";
  letterBand?: keyof EnergyFrame;
  letterAmplitude?: number;
  /** Fait alterner la police de chaque lettre dans cette liste, au rythme de la musique. */
  letterFontCycle?: string[];
}

// Primitive de titre stylisé, animée en direct via ref (pas de re-render React) —
// voir docs/animation-prompts.md pour le style de chaque version.
export function TitleText({
  text = "VIRGILE TU BOIS",
  style,
  className,
  energyRef,
  pulseBand = "overall",
  pulseAmount = 0.18,
  extraTransform,
  onFrame,
  letterMotion = "none",
  letterBand = "overall",
  letterAmplitude = 6,
  letterFontCycle,
}: TitleTextProps) {
  const ref = useImperativeAnimation<HTMLHeadingElement>(energyRef, (node, energy, t) => {
    const level = energy[pulseBand] ?? 0;
    const scale = 1 + level * pulseAmount;
    const extra = extraTransform ? extraTransform(energy, t) : "";
    node.style.transform = `scale(${scale}) ${extra}`;
    onFrame?.(node, energy, t);
  });

  return (
    <h1
      ref={ref}
      className={className}
      style={{
        margin: 0,
        fontSize: "clamp(2.4rem, 8vw, 5.5rem)",
        fontWeight: 700,
        textAlign: "center",
        letterSpacing: "0.02em",
        lineHeight: 1.05,
        padding: "0 1rem",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {letterMotion === "none"
        ? text
        : text.split("").map((ch, i) => (
            <LetterSpan
              key={i}
              ch={ch}
              index={i}
              energyRef={energyRef}
              band={letterBand}
              amplitude={letterAmplitude}
              chaotic={letterMotion === "chaotic"}
              fontCycle={letterFontCycle}
            />
          ))}
    </h1>
  );
}

interface LetterSpanProps extends Pick<VisualProps, "energyRef"> {
  ch: string;
  index: number;
  band: keyof EnergyFrame;
  amplitude: number;
  chaotic: boolean;
  fontCycle?: string[];
}

function LetterSpan({ ch, index, energyRef, band, amplitude, chaotic, fontCycle }: LetterSpanProps) {
  const fontIndexRef = useRef(0);
  const prevLevelRef = useRef(0);

  const ref = useImperativeAnimation<HTMLSpanElement>(energyRef, (node, energy, t) => {
    const level = energy[band] ?? 0;
    const phase = index * (chaotic ? 1.3 : 0.55);

    let x = 0;
    let y: number;
    let rot = 0;

    if (chaotic) {
      // surtout vertical, encore plus ample mais volontairement lent (retour du
      // 2026-08-10 : "encore plus d'amplitude mais reste bien lent").
      y = (Math.sin(t / 340 + phase) * 0.55 + Math.sin(t / 150 + phase * 1.7) * 0.45) * amplitude * (0.4 + level * 1.1);
      x = Math.sin(t / 420 + phase * 2.1) * amplitude * 0.08 * (0.3 + level * 0.8);
      rot = Math.sin(t / 320 + phase * 1.4) * 1.5 * (0.3 + level);
    } else {
      // adouci (retour du 2026-08-10 : "top l'oscillation mais trop nerveux") — plus
      // lent, moins de gain sur les pics d'énergie.
      y = Math.sin(t / 340 + phase) * amplitude * (0.32 + level * 0.5);
    }

    node.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;

    if (fontCycle && fontCycle.length > 0) {
      if (level - prevLevelRef.current > 0.2) {
        fontIndexRef.current = (fontIndexRef.current + 1) % fontCycle.length;
        node.style.fontFamily = fontCycle[fontIndexRef.current];
      }
      prevLevelRef.current = level;
    }
  });

  return (
    <span ref={ref} style={{ display: "inline-block" }}>
      {ch === " " ? " " : ch}
    </span>
  );
}
