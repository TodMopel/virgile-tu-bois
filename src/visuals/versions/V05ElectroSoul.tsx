import { Stage } from "../shared/Stage";
import { TitleText } from "../shared/TitleText";
import { useImperativeAnimation } from "../shared/useImperativeAnimation";
import type { VisualProps } from "../types";

// 05 — Electro soul : le vinyle (jugé raté) est retiré, contraste renforcé — fond plus
// sombre/saturé, lueur plus intense, texte plus contrasté. Repris le 2026-08-10.

function WarmGlow({ energyRef, size }: Pick<VisualProps, "energyRef"> & { size: number }) {
  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy, t) => {
    const breathe = 0.85 + 0.15 * Math.sin(t / 1800) + energy.mid * 0.2;
    node.style.transform = `scale(${breathe})`;
    node.style.opacity = String(0.75 + energy.mid * 0.25);
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(255,150,70,0.75), transparent 70%)",
        pointerEvents: "none",
      }}
    />
  );
}

export function V05ElectroSoul({ energyRef, background, titleFontFamily, custom }: VisualProps) {
  const glowScale = custom?.glowScale ?? 1;
  return (
    <Stage
      background={background ?? "linear-gradient(135deg, #260800, #6e2308 55%, #a83f10)"}
      energyRef={energyRef}
      flashBand="mid"
      flashColor="255,180,110"
    >
      <WarmGlow energyRef={energyRef} size={460 * glowScale} />
      <TitleText
        energyRef={energyRef}
        text="Virgile tu bois"
        pulseBand="mid"
        pulseAmount={0.09}
        letterMotion="wave"
        letterBand="mid"
        letterAmplitude={8}
        style={{
          fontFamily: titleFontFamily ?? "V05Pacifico, cursive",
          fontWeight: 400,
          color: "#ffe4c2",
          textShadow: "0 0.06em 0.12em rgba(0,0,0,0.55), 0 0 22px rgba(255,150,70,0.5)",
        }}
      />
    </Stage>
  );
}
