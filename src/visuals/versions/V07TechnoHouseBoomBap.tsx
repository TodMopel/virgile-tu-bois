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

// moins de faisceaux (retour du 2026-08-11 : ça ramait sur mobile — chaque faisceau
// porte un filtre blur(20px) sur un élément de 170vh, coûteux à multiplier), vitesses
// toujours variées.
const BEAMS: { x: string; baseAngle: number; color: string; width: number; speedScale: number }[] = [
  { x: "10%", baseAngle: -8, color: "255,225,180", width: 60, speedScale: 0.55 },
  { x: "30%", baseAngle: -2, color: "140,220,255", width: 55, speedScale: 0.9 },
  { x: "50%", baseAngle: 0, color: "180,140,255", width: 50, speedScale: 1.2 },
  { x: "70%", baseAngle: 3, color: "255,140,180", width: 55, speedScale: 0.7 },
  { x: "90%", baseAngle: 8, color: "140,220,255", width: 60, speedScale: 1.1 },
];

// lueur de sol, ferrée au bas de l'écran, du clair au foncé — cycle en continu entre
// 3 couleurs (rampe de projecteurs), et quand l'énergie monte : le cycle accélère et
// un clignotement s'ajoute par-dessus (retour du 2026-08-12).
const GLOW_COLORS: [number, number, number][] = [
  [255, 225, 180], // chaud
  [140, 220, 255], // bleu
  [180, 140, 255], // violet
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function TempoGlow({ energyRef }: Pick<VisualProps, "energyRef">) {
  const levelRef = useRef(0);
  const clockRef = useRef(0);
  const lastTRef = useRef<number | null>(null);
  const cycleSpeedRef = useRef(1);

  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const last = lastTRef.current ?? t;
    const dt = Math.max(0, Math.min(0.1, (t - last) / 1000));
    lastTRef.current = t;

    levelRef.current = smoothTo(levelRef.current, energy.bass, 0.15);
    // le cycle des couleurs s'accélère avec l'énergie — lent au repos, rapide sur les pics.
    cycleSpeedRef.current = smoothTo(cycleSpeedRef.current, 1 + energy.bass * 7, 0.05);
    clockRef.current += dt * 0.3 * cycleSpeedRef.current;

    const pos = clockRef.current % GLOW_COLORS.length;
    const i = Math.floor(pos);
    const frac = pos - i;
    const [r1, g1, b1] = GLOW_COLORS[i];
    const [r2, g2, b2] = GLOW_COLORS[(i + 1) % GLOW_COLORS.length];
    const r = Math.round(lerp(r1, r2, frac));
    const g = Math.round(lerp(g1, g2, frac));
    const b = Math.round(lerp(b1, b2, frac));

    // clignotement qui n'apparaît qu'au-dessus d'un certain niveau d'énergie, et
    // dont l'amplitude/vitesse grandit avec elle.
    const flicker = levelRef.current > 0.45 ? Math.sin(t / 40) * (levelRef.current - 0.45) * 1.4 : 0;
    const brightness = 0.25 + levelRef.current * 0.6 + flicker;

    node.style.background = `radial-gradient(ellipse 120% 60% at 50% 100%, rgba(${r},${g},${b},0.9), rgba(${r},${g},${b},0) 70%)`;
    node.style.opacity = String(Math.max(0.12, Math.min(1, brightness)));
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: "radial-gradient(ellipse 120% 60% at 50% 100%, rgba(255,225,180,0.9), rgba(255,225,180,0) 70%)",
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
      <TempoGlow energyRef={energyRef} />
      {BEAMS.map((b, i) => (
        <LightBeam key={i} energyRef={energyRef} from="bottom" heightVh={170} band="bass" {...b} />
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
