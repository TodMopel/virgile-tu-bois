import type { RefObject } from "react";

export interface EnergyFrame {
  bass: number;
  mid: number;
  treble: number;
  overall: number;
}

export const SILENT_FRAME: EnergyFrame = { bass: 0, mid: 0, treble: 0, overall: 0 };

// energyRef est mutée ~60x/s par usePlayback SANS passer par le state React —
// lire energyRef.current dans une boucle rAF locale (useImperativeAnimation),
// jamais dans le corps du composant (sinon retour à des re-renders à 60fps → saccades).
export interface VisualProps {
  energyRef: RefObject<EnergyFrame>;
  playing: boolean;
}
