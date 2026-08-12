import { useRef } from "react";
import { Stage } from "../shared/Stage";
import { TitleText } from "../shared/TitleText";
import { useImperativeAnimation } from "../shared/useImperativeAnimation";
import { smoothTo } from "../shared/easing";
import { StarburstIcon } from "../shared/icons";
import type { VisualProps } from "../types";

// 02 — Disco pop : un vrai effet lampe à lave (filtre "goo" en CSS pur : blur + contrast)
// sur fond sombre et contrasté. Les bulles voyagent vraiment sur l'écran (grande
// amplitude en vw/vh, vitesse qui répond à l'énergie) — retour du 2026-08-10, deux
// passes : "pas assez changeant, les bulles doivent vraiment se déplacer".

// vitesses ralenties (retour 2026-08-10 : "trop bien, juste ralentir pour faire plus
// lampe à lave" — une vraie lampe à lave est hypnotique et lente).
// nombre réduit de bulles (retour du 2026-08-11 : ça ramait sur mobile — le filtre
// "goo" est coûteux par bulle en plus).
const BACKGROUND = "linear-gradient(160deg, #2a0d24, #4a1338)";

const BLOBS = [
  { size: 220, baseX: 28, baseY: 32, speed: 0.26, phase: 0, color: "#dc3995" },
  { size: 260, baseX: 66, baseY: 58, speed: 0.2, phase: 2.1, color: "#d83b75" },
  { size: 190, baseX: 46, baseY: 74, speed: 0.3, phase: 4.2, color: "#1ef3da" },
  { size: 170, baseX: 72, baseY: 22, speed: 0.24, phase: 1.3, color: "#a13dff" },
  { size: 70, baseX: 18, baseY: 60, speed: 0.34, phase: 3.4, color: "#43aee7" },
];

function LavaBlob({
  energyRef,
  size,
  baseX,
  baseY,
  speed,
  phase,
  color,
}: Pick<VisualProps, "energyRef"> & { size: number; baseX: number; baseY: number; speed: number; phase: number; color: string }) {
  const lastTRef = useRef<number | null>(null);
  const speedMulRef = useRef(1);
  const clockRef = useRef(phase * 3);
  const pulseEnergyRef = useRef(0);
  // léger décalage propre à chaque bulle, dérivé de sa phase — pour que le pouls
  // ne tombe plus exactement sur la même frame partout (retour du 2026-08-11).
  const pulseAlpha = 0.18 + (phase % 1) * 0.14;

  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const last = lastTRef.current ?? t;
    const dt = Math.max(0, Math.min(0.1, (t - last) / 1000));
    lastTRef.current = t;
    speedMulRef.current = smoothTo(speedMulRef.current, 1 + energy.overall * 0.7, 0.03);
    clockRef.current += dt * speed * speedMulRef.current;
    const s = clockRef.current;
    pulseEnergyRef.current = smoothTo(pulseEnergyRef.current, energy.overall, pulseAlpha);

    const x = Math.sin(s + phase) * 26 + Math.sin(s * 0.6 + phase) * 14; // vw
    const y = Math.cos(s * 0.8 + phase) * 20; // vh
    const scale = 1 + pulseEnergyRef.current * 0.3 + Math.sin(s * 0.5 + phase) * 0.1;
    node.style.transform = `translate(${x}vw, ${y}vh) scale(${scale})`;
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: `${baseX}%`,
        top: `${baseY}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        background: color,
      }}
    />
  );
}

function LavaLamp({ energyRef }: Pick<VisualProps, "energyRef">) {
  // goo en CSS pur (blur + contraste), pas via un filtre SVG référencé — retour du
  // 2026-08-12 : "filter: url(#id)" ne fonctionne pas de façon fiable sur Safari/iOS
  // (bug WebKit connu, indépendant des transforms). blur()+contrast() est natif et
  // fiable, mais contrast() n'agit que sur RGB (pas l'alpha) : le fond doit donc être
  // opaque et identique à celui du Stage pour que la fusion des bulles reste invisible
  // aux bords du conteneur.
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: BACKGROUND, filter: "blur(11px) contrast(26)" }}>
      {BLOBS.map((b, i) => (
        <LavaBlob key={i} energyRef={energyRef} {...b} />
      ))}
    </div>
  );
}

function Starburst({ energyRef }: Pick<VisualProps, "energyRef">) {
  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const rotation = (t / 110) % 360;
    node.style.transform = `rotate(${rotation}deg) scale(${1 + energy.overall * 0.12})`;
  });

  return (
    <div ref={ref} style={{ width: 60, height: 60, color: "#fff7ea", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}>
      <StarburstIcon />
    </div>
  );
}

export function V02DiscoPop({ energyRef }: VisualProps) {
  return (
    <Stage background={BACKGROUND} energyRef={energyRef} flashBand="overall" flashColor="255,210,61">
      <LavaLamp energyRef={energyRef} />
      <Starburst energyRef={energyRef} />
      <TitleText
        energyRef={energyRef}
        text="Virgile Tu Bois"
        pulseBand="overall"
        pulseAmount={0.1}
        letterMotion="wave"
        letterBand="mid"
        letterAmplitude={7}
        style={{
          fontFamily: "V02Baloo, sans-serif",
          color: "#fff7ea",
          textShadow: "0 0.06em 0 #ff2f7a, 0 0.12em 0 #a855f7",
        }}
      />
    </Stage>
  );
}
