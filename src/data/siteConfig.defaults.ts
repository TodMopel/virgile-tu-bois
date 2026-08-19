import type { SiteConfigOverrides } from "../config/types";

// Personnalisations permanentes (couleurs/police/intensité par version, texte des
// crédits) — collées ici depuis le bouton "Copier la config" du panneau d'édition
// (?edit dans l'URL, voir CONTEXT.md). Vide par défaut : tant qu'une version n'a pas
// d'entrée ici, elle garde ses réglages codés en dur dans son composant visuel
// (src/visuals/versions/) ou dans data/tracks.ts. Éditable directement depuis
// l'interface web de GitHub (icône crayon) : un commit sur ce fichier déclenche le
// redeploy automatique de la PWA (GitHub Actions).
export const siteConfigDefaults: SiteConfigOverrides = {
  tracks: {},
};
