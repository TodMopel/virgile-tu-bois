import type { SiteConfigOverrides } from "../config/types";

// Personnalisations permanentes (couleurs/police/intensité par version, texte des
// crédits) — collées ici depuis le bouton "Copier la config" du panneau d'édition
// (?edit dans l'URL, voir CONTEXT.md). Vide par défaut : tant qu'une version n'a pas
// d'entrée ici, elle garde ses réglages codés en dur dans son composant visuel
// (src/visuals/versions/) ou dans data/tracks.ts. Éditable directement depuis
// l'interface web de GitHub (icône crayon) : un commit sur ce fichier déclenche le
// redeploy automatique de la PWA (GitHub Actions).
//
// Attention en éditant depuis l'interface web de GitHub : coller le JSON exporté doit
// remplacer uniquement la valeur après le "=" ci-dessous, pas le fichier entier — sans
// le `import`/`export const`, ce n'est plus du TypeScript valide et le build casse
// (vécu le 2026-08-19 : le JSON collé seul a fait échouer le déploiement).
export const siteConfigDefaults: SiteConfigOverrides = {
  tracks: {
    "01_disco": {
      custom: {
        shineSpeed: 0.5,
        beamGlow: 3.5,
      },
    },
    "02_disco-pop": {
      custom: {
        blobCount: 20,
      },
    },
    "03_dancehall-riddim": {
      custom: {
        waveScale: 0.9,
      },
    },
    "04_electro-disco": {
      custom: {
        sparkCount: 20,
      },
    },
    "05_electro-soul": {
      custom: {
        glowScale: 1.3,
      },
    },
    "06_techno-dance": {
      intensity: 1.2,
      custom: {
        dancerCount: 21,
      },
    },
    "07_techno-house-boom-bap": {
      intensity: 0.7,
      custom: {
        beamGlow: 3,
        beamScale: 0.9,
      },
    },
    "08_techno-ambiance": {
      intensity: 0.8,
      custom: {
        particleCount: 30,
      },
    },
    "09_orchestral-electro": {
      intensity: 1.5,
      custom: {
        mistBlobCount: 6,
      },
    },
    "10_orchestral": {
      custom: {
        glitterCount: 29,
        shineSpeed: 0.4,
      },
    },
  },
};
