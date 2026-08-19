// Un réglage "signature" par version, spécifique à son élément visuel distinctif — pas
// de schéma commun entre les 10 (contrairement à accentColor/background/titleFontFamily/
// intensity qui s'appliquent partout pareil). Lu par SongsEditPanel pour construire le
// bon contrôle selon la version choisie, et par le composant visuel correspondant via
// VisualProps.custom[key] (voir src/visuals/versions/V0*.tsx).
export interface TrackCustomField {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

// Chaque version peut avoir plusieurs réglages spécifiques (un tableau, pas un seul champ) —
// ex. la 01 et la 10 ont en plus "shineSpeed" qui pilote la vitesse du reflet du titre
// (chrome-sweep / gold-sweep, voir global.css) via la variable CSS --shine-speed.
export const TRACK_CUSTOM_FIELDS: Record<string, TrackCustomField[]> = {
  "01_disco": [
    { key: "beamScale", label: "Intensité des faisceaux", min: 0.4, max: 2, step: 0.1, default: 1 },
    { key: "shineSpeed", label: "Vitesse du reflet", min: 0.3, max: 3, step: 0.1, default: 1 },
    // éclat de l'illumination du texte par les faisceaux (mixBlendMode: screen, voir
    // V01Disco.tsx) — retour du 2026-08-19 ("je ne vois pas la différence sur la 01").
    { key: "beamGlow", label: "Éclat sur le texte", min: 0.5, max: 4, step: 0.1, default: 1.6 },
  ],
  "02_disco-pop": [{ key: "blobCount", label: "Nombre de blobs", min: 2, max: 20, step: 1, default: 10 }],
  "03_dancehall-riddim": [{ key: "waveScale", label: "Amplitude des vagues", min: 0.4, max: 2, step: 0.1, default: 1 }],
  "04_electro-disco": [{ key: "sparkCount", label: "Nombre d'étincelles", min: 0, max: 24, step: 1, default: 14 }],
  "05_electro-soul": [{ key: "glowScale", label: "Taille de la lueur", min: 0.5, max: 1.8, step: 0.1, default: 1 }],
  "06_techno-dance": [{ key: "dancerCount", label: "Nombre de danseurs", min: 3, max: 24, step: 1, default: 17 }],
  "07_techno-house-boom-bap": [
    { key: "beamScale", label: "Intensité des faisceaux", min: 0.4, max: 2, step: 0.1, default: 1 },
    { key: "beamGlow", label: "Éclat sur le texte", min: 0.5, max: 4, step: 0.1, default: 1 },
  ],
  "08_techno-ambiance": [{ key: "particleCount", label: "Nombre de particules", min: 0, max: 30, step: 1, default: 18 }],
  "09_orchestral-electro": [{ key: "mistBlobCount", label: "Nappes de brume", min: 1, max: 8, step: 1, default: 4 }],
  "10_orchestral": [
    { key: "glitterCount", label: "Nombre de paillettes", min: 0, max: 32, step: 1, default: 20 },
    { key: "shineSpeed", label: "Vitesse du reflet", min: 0.3, max: 3, step: 0.1, default: 1 },
  ],
};
