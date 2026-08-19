import type { CSSProperties } from "react";
import { Stage } from "../shared/Stage";
import { TitleText } from "../shared/TitleText";
import { LightBeam } from "../shared/LightBeam";
import type { VisualProps } from "../types";

// 01 — Disco : un reflet lumineux qui traverse le texte chrome périodiquement (immobile
// la majeure partie du temps, puis un passage bref — repris le 2026-08-19, l'ancienne
// version défilait sans jamais s'arrêter), plus deux faisceaux de lumière qui dansent de
// plus en plus vite avec l'énergie. Repris le 2026-08-10 (deux passes).

export function V01Disco({ energyRef, background, titleFontFamily, custom }: VisualProps) {
  const beamScale = custom?.beamScale ?? 1;
  const shineSpeed = custom?.shineSpeed ?? 1;
  // défaut relevé (1.6, pas 1) : à 1 l'illumination du texte par les faisceaux (voir
  // mixBlendMode plus bas) restait trop discrète au repos pour être remarquée — retour
  // du 2026-08-19 ("je ne vois pas la différence").
  const beamGlow = custom?.beamGlow ?? 1.6;
  return (
    <Stage background={background ?? "linear-gradient(135deg, #24242c, #4c4c58)"} energyRef={energyRef} flashBand="bass" shakeAmount={2}>
      <LightBeam energyRef={energyRef} x="32%" band="bass" width={140 * beamScale} glowBoost={beamGlow} />
      <LightBeam energyRef={energyRef} x="68%" band="bass" baseAngle={8} width={140 * beamScale} glowBoost={beamGlow} />

      <TitleText
        energyRef={energyRef}
        text="VIRGILE TU BOIS"
        pulseBand="bass"
        pulseAmount={0.08}
        className="fx-chrome-sweep"
        style={{
          fontFamily: titleFontFamily ?? "V01Fredoka, sans-serif",
          // dégradé non répété + backgroundSize large (comme V10/gold-sweep) : la bande
          // claire reste hors-champ la plupart du temps, le texte lit comme un gris
          // métal stable entre deux passages du reflet — voir chrome-sweep (global.css).
          backgroundImage: "linear-gradient(100deg, #86868f 0%, #86868f 42%, #f4f4f8 50%, #86868f 58%, #86868f 100%)",
          backgroundSize: "260% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextStroke: "0.5px rgba(255,255,255,0.35)",
          // "allumé" par les faisceaux : peints avant le texte dans le DOM (donc déjà
          // dans le fond composite au moment où le texte est peint), le blend "screen"
          // les fait transparaître à travers le texte — plus un faisceau passe derrière
          // une lettre, plus elle s'éclaircit, sans lien de données entre les deux (juste
          // du compositing) — retour du 2026-08-19.
          mixBlendMode: "screen",
          // valeur de prop CSS personnalisée : doit être une chaîne, une assignation
          // numérique directe est silencieusement ignorée par certains navigateurs.
          ["--shine-speed" as string]: String(shineSpeed),
        } as CSSProperties}
      />
    </Stage>
  );
}
