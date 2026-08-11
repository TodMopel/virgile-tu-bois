import type { EnergyFrame } from "../visuals/types";

export interface AnalysisData {
  sampleRate: number;
  hop: number;
  frameCount: number;
  bass: number[];
  mid: number[];
  treble: number[];
  overall: number[];
}

// Interpole l'énergie (bass/mid/treble/overall) pré-calculée à un instant t (secondes).
export function energyAt(data: AnalysisData, t: number): EnergyFrame {
  const rawIndex = t / data.hop;
  const i0 = Math.max(0, Math.min(data.frameCount - 1, Math.floor(rawIndex)));
  const i1 = Math.min(data.frameCount - 1, i0 + 1);
  const frac = Math.min(1, Math.max(0, rawIndex - i0));

  const lerp = (arr: number[]) => arr[i0] + (arr[i1] - arr[i0]) * frac;

  return {
    bass: lerp(data.bass),
    mid: lerp(data.mid),
    treble: lerp(data.treble),
    overall: lerp(data.overall),
  };
}
