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
  /** Override de fond (panneau ?edit) — remplace le dégradé codé en dur si fourni. */
  background?: string;
  /** Override de police du titre (panneau ?edit) — remplace la police codée en dur si fournie. */
  titleFontFamily?: string;
  /** Réglage spécifique à cette version (voir config/trackFields.ts) — une seule clé utilisée par version. */
  custom?: Record<string, number>;
}
