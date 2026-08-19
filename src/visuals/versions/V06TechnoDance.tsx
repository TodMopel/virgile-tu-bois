import { useRef } from "react";
import { Stage } from "../shared/Stage";
import { TitleText } from "../shared/TitleText";
import { useImperativeAnimation } from "../shared/useImperativeAnimation";
import { smoothTo } from "../shared/easing";
import type { VisualProps } from "../types";

// 06 — Techno dance : plusieurs carrés qui dansent, chacun sur sa propre trajectoire.
// Quatrième passe, 2026-08-10 : plus grands (occupent plus l'écran), déplacement
// entièrement lissé/lerpé — "ça peut aller vite mais smooth", plus de téléportation
// façon jitter. Sur un gros coup, chaque carré se duplique brièvement (au lieu de
// disperser du bruit aléatoire) puis se réunit.

// 17 danseurs, chacun avec ses propres fréquences/rayon/phase/teinte (plus de valeurs
// dupliquées x3) — retour du 2026-08-10.
const DANCERS = [
  { freqX: 1.0, freqY: 1.3, radiusX: 108, radiusY: 74, phase: 0.0, hue: 140, size: 24 },
  { freqX: 1.7, freqY: 0.8, radiusX: 92, radiusY: 100, phase: 0.7, hue: 147, size: 22 },
  { freqX: 0.6, freqY: 2.1, radiusX: 126, radiusY: 56, phase: 1.4, hue: 154, size: 26 },
  { freqX: 2.3, freqY: 1.1, radiusX: 72, radiusY: 108, phase: 2.1, hue: 161, size: 20 },
  { freqX: 1.3, freqY: 1.9, radiusX: 100, radiusY: 82, phase: 2.8, hue: 168, size: 23 },
  { freqX: 0.9, freqY: 0.7, radiusX: 118, radiusY: 90, phase: 3.5, hue: 175, size: 21 },
  { freqX: 1.9, freqY: 1.5, radiusX: 84, radiusY: 96, phase: 4.2, hue: 182, size: 25 },
  { freqX: 0.8, freqY: 2.4, radiusX: 132, radiusY: 64, phase: 4.9, hue: 189, size: 19 },
  { freqX: 2.1, freqY: 0.9, radiusX: 76, radiusY: 116, phase: 5.6, hue: 196, size: 22 },
  { freqX: 1.1, freqY: 2.2, radiusX: 96, radiusY: 70, phase: 0.3, hue: 203, size: 24 },
  { freqX: 1.6, freqY: 1.2, radiusX: 114, radiusY: 88, phase: 1.0, hue: 210, size: 20 },
  { freqX: 0.7, freqY: 1.7, radiusX: 88, radiusY: 104, phase: 1.8, hue: 217, size: 26 },
  { freqX: 2.4, freqY: 1.4, radiusX: 68, radiusY: 92, phase: 2.5, hue: 224, size: 21 },
  { freqX: 1.4, freqY: 0.6, radiusX: 122, radiusY: 112, phase: 3.2, hue: 231, size: 23 },
  { freqX: 1.0, freqY: 2.0, radiusX: 104, radiusY: 78, phase: 3.9, hue: 238, size: 19 },
  { freqX: 1.8, freqY: 1.0, radiusX: 90, radiusY: 98, phase: 4.6, hue: 245, size: 25 },
  { freqX: 0.5, freqY: 1.6, radiusX: 130, radiusY: 84, phase: 5.3, hue: 252, size: 22 },
  // 7 de plus (retour du 2026-08-19 : "pouvoir en mettre plus") — au-delà des 17
  // premiers, activables via "Nombre de danseurs" (?edit). Teinte continuée au-delà
  // de 252 (même incrément ~7°, reste dans le bleu/violet plutôt que revenir au vert).
  { freqX: 1.2, freqY: 1.8, radiusX: 112, radiusY: 66, phase: 0.15, hue: 259, size: 20 },
  { freqX: 2.0, freqY: 0.65, radiusX: 80, radiusY: 120, phase: 0.85, hue: 266, size: 24 },
  { freqX: 0.75, freqY: 2.3, radiusX: 128, radiusY: 58, phase: 1.55, hue: 273, size: 21 },
  { freqX: 1.55, freqY: 1.05, radiusX: 98, radiusY: 94, phase: 2.25, hue: 280, size: 26 },
  { freqX: 2.2, freqY: 1.4, radiusX: 70, radiusY: 106, phase: 2.95, hue: 287, size: 19 },
  { freqX: 0.95, freqY: 1.75, radiusX: 116, radiusY: 76, phase: 3.65, hue: 294, size: 23 },
  { freqX: 1.75, freqY: 0.85, radiusX: 86, radiusY: 110, phase: 4.35, hue: 301, size: 22 },
];

const DUP_OFFSETS = [
  { dx: 26, dy: -20 },
  { dx: -24, dy: 22 },
  { dx: 30, dy: 26 },
];

// Lignes qui tombent du ciel quand ça accélère, descente chaotique (double sinus,
// pas un simple aller-retour) — retour du 2026-08-11. N'apparaissent vraiment que
// lorsque le "chaos" (même mesure que les danseurs, dérivée des basses) monte, et
// se fondent en approchant du bas plutôt que de couper net.
const FALLING_LINES = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 6.3 + 3) % 100,
  length: 60 + ((i * 23) % 90),
  fallSpeed: 755 + ((i * 13) % 40), // vh/s à chaos max
  wobbleFreq: .06 + ((i * 7) % 10) / 6,
  wobbleAmp: 1 + ((i * 5) % 16),
  phase: i * 1.7,
  delay: (i * 0.31) % 2,
  hue: 185 + ((i * 13) % 70),
}));

interface FallingLineProps extends Pick<VisualProps, "energyRef"> {
  x: number;
  length: number;
  fallSpeed: number;
  wobbleFreq: number;
  wobbleAmp: number;
  phase: number;
  delay: number;
  hue: number;
}

function FallingLine({ energyRef, x, length, fallSpeed, wobbleFreq, wobbleAmp, phase, delay, hue }: FallingLineProps) {
  const lastTRef = useRef<number | null>(null);
  const speedMulRef = useRef(1);
  const yRef = useRef(-10 - delay * fallSpeed);

  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const last = lastTRef.current ?? t;
    const dt = Math.max(0, Math.min(0.1, (t - last) / 1000));
    lastTRef.current = t;

    // même mesure d'accélération que les danseurs (voir Dancer plus haut)
    const targetSpeed = 1 + energy.bass * 3;
    speedMulRef.current = smoothTo(speedMulRef.current, targetSpeed, 0.05);
    const chaos = Math.max(0, Math.min(1, (speedMulRef.current - 1) / 3));

    if (chaos > 0.02) {
      yRef.current += dt * fallSpeed * chaos;
      if (yRef.current > 115) yRef.current = -10 - Math.random() * 30;
    }

    const y = yRef.current;
    const wobble =
      Math.sin(t / 260 * wobbleFreq + phase) * wobbleAmp * (0.5 + chaos * 0.5) +
      Math.sin(t / 97 * wobbleFreq + phase) * wobbleAmp * 0.4 * chaos;

    const fadeIn = Math.max(0, Math.min(1, y / 12));
    const fadeOut = Math.max(0, Math.min(1, (108 - y) / 22));
    const opacity = Math.min(fadeIn, fadeOut) * chaos;

    node.style.transform = `translate(calc(-50% + ${wobble}px), ${y}vh)`;
    node.style.opacity = String(opacity);
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: 0,
        width: 2,
        height: length,
        background: `linear-gradient(180deg, transparent, hsl(${hue}, 95%, 70%) 35%, hsl(${hue}, 95%, 70%) 65%, transparent)`,
        boxShadow: `0 0 8px hsla(${hue}, 95%, 70%, 0.8)`,
        pointerEvents: "none",
        opacity: 0,
      }}
    />
  );
}

interface DancerProps extends Pick<VisualProps, "energyRef"> {
  freqX: number;
  freqY: number;
  radiusX: number;
  radiusY: number;
  phase: number;
  hue: number;
  size: number;
}

function Dancer({ energyRef, freqX, freqY, radiusX, radiusY, phase, hue, size }: DancerProps) {
  const angleRef = useRef(phase);
  const lastTRef = useRef<number | null>(null);
  const speedMulRef = useRef(1);
  const targetRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const targetTimerRef = useRef(Math.random() * 0.4);
  const prevBassRef = useRef(0);
  const burstRef = useRef(0);
  const dupRefs = useRef<(HTMLDivElement | null)[]>([]);

  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const last = lastTRef.current ?? t;
    const dt = Math.max(0, Math.min(0.1, (t - last) / 1000));
    lastTRef.current = t;

    const targetSpeed = 1 + energy.bass * 3;
    speedMulRef.current = smoothTo(speedMulRef.current, targetSpeed, 0.05);
    angleRef.current += dt * 0.5 * speedMulRef.current;

    const chaos = Math.max(0, Math.min(1, (speedMulRef.current - 1) / 3));

    // la cible change plus souvent quand ça chauffe, mais on s'y déplace toujours en
    // douceur (lerp) — jamais de saut instantané, même à vitesse élevée.
    targetTimerRef.current -= dt;
    if (targetTimerRef.current <= 0) {
      targetTimerRef.current = 0.55 - chaos * 0.4;
      targetRef.current = {
        x: Math.cos(angleRef.current * freqX) * radiusX,
        y: Math.sin(angleRef.current * freqY) * radiusY,
      };
    }
    const pursuit = 0.05 + chaos * 0.22;
    posRef.current.x = smoothTo(posRef.current.x, targetRef.current.x, pursuit);
    posRef.current.y = smoothTo(posRef.current.y, targetRef.current.y, pursuit);

    // duplication sur un gros coup, plutôt qu'une dispersion aléatoire — retour du
    // 2026-08-10 : "quand la musique pète, duplique les carrés".
    if (energy.bass - prevBassRef.current > 0.26) burstRef.current = 1;
    prevBassRef.current = energy.bass;
    burstRef.current *= 0.9;

    const scale = 0.9 + chaos * 0.25 + energy.bass * 0.15;
    node.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) scale(${scale})`;
    node.style.opacity = String(0.6 + chaos * 0.4);

    DUP_OFFSETS.forEach((o, i) => {
      const d = dupRefs.current[i];
      if (!d) return;
      const bx = posRef.current.x + o.dx * burstRef.current;
      const by = posRef.current.y + o.dy * burstRef.current;
      d.style.transform = `translate(${bx}px, ${by}px) scale(${scale * 0.85})`;
      d.style.opacity = String(burstRef.current * 0.75);
    });
  });

  const boxStyle = (s: number) => ({
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    width: s,
    height: s,
    marginTop: -s / 2,
    marginLeft: -s / 2,
    background: `hsl(${hue}, 90%, 65%)`,
    boxShadow: `0 0 14px hsla(${hue}, 90%, 65%, 0.7)`,
    pointerEvents: "none" as const,
  });

  return (
    <>
      <div ref={ref} style={boxStyle(size)} />
      {DUP_OFFSETS.map((_, i) => (
        <div key={i} ref={(el) => (dupRefs.current[i] = el)} style={{ ...boxStyle(size * 0.85), opacity: 0 }} />
      ))}
    </>
  );
}

export function V06TechnoDance({ energyRef, background, titleFontFamily, custom }: VisualProps) {
  const dancerCount = Math.round(custom?.dancerCount ?? DANCERS.length);
  return (
    <Stage background={background ?? "linear-gradient(135deg, #001b33, #004a7a)"} energyRef={energyRef} flashBand="bass" flashColor="79,217,255">
      {FALLING_LINES.map((l, i) => (
        <FallingLine key={i} energyRef={energyRef} {...l} />
      ))}
      {DANCERS.slice(0, dancerCount).map((d, i) => (
        <Dancer key={i} energyRef={energyRef} {...d} />
      ))}
      <TitleText
        energyRef={energyRef}
        text="VIRGILE TU BOIS"
        pulseBand="bass"
        pulseAmount={0.06}
        letterMotion="wave"
        letterBand="treble"
        letterAmplitude={4}
        style={{
          fontFamily: titleFontFamily ?? "V06ShareTechMono, monospace",
          fontWeight: 700,
          color: "#eafcff",
          letterSpacing: "0.02em",
        }}
      />
    </Stage>
  );
}
