// Réglages personnalisables depuis le panneau d'édition (?edit) — voir EditPanel.tsx
// et CONTEXT.md ("Panneau d'édition en direct"). Tout champ absent retombe sur la
// valeur codée en dur dans le composant visuel concerné.
export interface TrackVisualOverride {
  /** Couleur d'accent (teinte des vignettes, mini-lecteur) — remplace track.swatch. */
  accentColor?: string;
  /** Fond CSS (dégradé) du visuel animé en plein écran — remplace le `background` de <Stage>. */
  background?: string;
  /** Police du titre dans le visuel animé, parmi les 10 polices embarquées (voir fonts.ts). */
  titleFontFamily?: string;
  /** Multiplicateur d'amplitude appliqué à l'énergie audio avant les animations (1 = normal). */
  intensity?: number;
  /**
   * Réglage propre à cette version (ex: nombre de danseurs en 06, taille des blobs en
   * 05...) — chaque version a un seul champ, décrit dans config/trackFields.ts, lu par
   * son composant visuel via VisualProps.custom. Pas de schéma commun entre versions.
   */
  custom?: Record<string, number>;
}

export interface HomeVisualOverride {
  /** Couleur de fond de l'écran d'accueil (derrière la pochette) — remplace #1c130b. */
  backgroundColor?: string;
  /** Multiplicateur d'amplitude de l'animation de la pochette (tangage/rebond au son). */
  coverIntensity?: number;
}

export interface SiteConfigOverrides {
  tracks: Record<string, TrackVisualOverride>;
  home?: HomeVisualOverride;
  /** Texte des crédits (page Extras) — voir ExtrasScreen.tsx pour le format et le rendu. */
  creditsText?: string;
}
