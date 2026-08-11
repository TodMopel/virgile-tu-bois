import { useImperativeAnimation } from "./useImperativeAnimation";
import { easeInOutSine } from "./easing";
import type { EnergyFrame, VisualProps } from "../types";

interface EqualizerBarsProps extends Pick<VisualProps, "energyRef"> {
  color?: string;
  size?: number;
}

const BANDS: (keyof EnergyFrame)[] = ["bass", "mid", "treble"];

/** Petit égaliseur à 3 barres — indicateur "en cours de lecture" sur la tracklist. */
export function EqualizerBars({ energyRef, color = "currentColor", size = 16 }: EqualizerBarsProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, width: size, height: size }}>
      {BANDS.map((band) => (
        <Bar key={band} band={band} energyRef={energyRef} color={color} />
      ))}
    </div>
  );
}

function Bar({ band, energyRef, color }: { band: keyof EnergyFrame } & Pick<VisualProps, "energyRef"> & { color: string }) {
  const ref = useImperativeAnimation<HTMLDivElement>(energyRef, (node, energy) => {
    const level = easeInOutSine(Math.max(0, Math.min(1, energy[band])));
    node.style.transform = `scaleY(${0.25 + level * 0.75})`;
  });

  return (
    <div
      ref={ref}
      style={{
        width: 3,
        height: "100%",
        borderRadius: 2,
        background: color,
        transformOrigin: "bottom",
      }}
    />
  );
}
