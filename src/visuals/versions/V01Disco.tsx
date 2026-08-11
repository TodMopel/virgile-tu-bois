import { Stage } from "../shared/Stage";
import { TitleText } from "../shared/TitleText";
import { LightBeam } from "../shared/LightBeam";
import type { VisualProps } from "../types";

// 01 — Disco : un reflet lumineux qui glisse en continu sur le texte chrome (la bande
// traverse maintenant vraiment toute la largeur de l'écran par boucle — tuilage sur
// 100vw en CSS pur, voir global.css), plus deux faisceaux de lumière qui dansent de
// plus en plus vite avec l'énergie. Repris le 2026-08-10 (deux passes).

export function V01Disco({ energyRef }: VisualProps) {
  return (
    <Stage background="linear-gradient(135deg, #24242c, #4c4c58)" energyRef={energyRef} flashBand="bass" shakeAmount={2}>
      <LightBeam energyRef={energyRef} x="32%" band="bass" />
      <LightBeam energyRef={energyRef} x="68%" band="bass" baseAngle={8} />

      <TitleText
        energyRef={energyRef}
        text="VIRGILE TU BOIS"
        pulseBand="bass"
        pulseAmount={0.08}
        className="fx-chrome-sweep"
        style={{
          fontFamily: "V01Fredoka, sans-serif",
          backgroundImage:
            "repeating-linear-gradient(90deg, #86868f 0, #86868f 38vw, #ffffff 48vw, #ffffff 52vw, #86868f 62vw, #86868f 100vw)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextStroke: "0.5px rgba(255,255,255,0.35)",
        }}
      />
    </Stage>
  );
}
