export interface ExtraItem {
  id: string;
  caption: string;
  image?: string; // chemin vers public/, optionnel
  /** Recadrage ponctuel (CSS object-position, ex. "50% 20%") — laisser vide pour le
   * centrage automatique, ajuster seulement les photos mal cadrées par défaut. */
  objectPosition?: string;
}

// Section "private jokes" — voir docs/adr/0004. 77 photos fournies le 2026-08-11
// (visuals/Extras/, copiées dans public/extras/extra-NN puis référencées ici, id/legende
// générés automatiquement). Toutes recadrées en carré au centre par défaut (voir la
// grille dans ExtrasScreen.tsx, object-fit: cover) — régler `objectPosition` au cas par
// cas pour les rares photos mal cadrées, plutôt qu'un outil de crop dédié.
// Légendes vides pour l'instant, à compléter au besoin.
// NB : un fichier vidéo (.mov) était mêlé aux photos fournies — copié dans
// public/extras/extra-36.mov mais pas inclus ici (ce n'est pas une image).
export const extras: ExtraItem[] = [
  { id: "extra-01", caption: "coucou", image: "./extras/extra-01.jpg", objectPosition: "50% 20%" },
  { id: "extra-02", caption: "karlitoooo", image: "./extras/extra-02.jpg" },
  { id: "extra-03", caption: "", image: "./extras/extra-03.jpg" },
  { id: "extra-04", caption: "", image: "./extras/extra-04.jpg" },
  { id: "extra-05", caption: "", image: "./extras/extra-05.jpg" },
  { id: "extra-06", caption: "", image: "./extras/extra-06.jpg" },
  { id: "extra-07", caption: "", image: "./extras/extra-07.jpg" },
  { id: "extra-08", caption: "", image: "./extras/extra-08.jpg" },
  { id: "extra-09", caption: "", image: "./extras/extra-09.jpg" },
  { id: "extra-10", caption: "", image: "./extras/extra-10.jpg" },
  { id: "extra-11", caption: "", image: "./extras/extra-11.jpg" },
  { id: "extra-12", caption: "", image: "./extras/extra-12.jpg" },
  { id: "extra-13", caption: "", image: "./extras/extra-13.jpg" },
  { id: "extra-14", caption: "", image: "./extras/extra-14.jpg" },
  { id: "extra-15", caption: "", image: "./extras/extra-15.jpg" },
  { id: "extra-16", caption: "", image: "./extras/extra-16.jpg" },
  { id: "extra-17", caption: "", image: "./extras/extra-17.jpg" },
  { id: "extra-18", caption: "", image: "./extras/extra-18.jpg" },
  { id: "extra-19", caption: "", image: "./extras/extra-19.jpg" },
  { id: "extra-20", caption: "", image: "./extras/extra-20.jpg" },
  { id: "extra-21", caption: "", image: "./extras/extra-21.jpg" },
  { id: "extra-22", caption: "", image: "./extras/extra-22.jpg" },
  { id: "extra-23", caption: "", image: "./extras/extra-23.jpg" },
  { id: "extra-24", caption: "", image: "./extras/extra-24.jpg" },
  { id: "extra-25", caption: "", image: "./extras/extra-25.jpg" },
  { id: "extra-26", caption: "", image: "./extras/extra-26.jpg" },
  { id: "extra-27", caption: "", image: "./extras/extra-27.jpg" },
  { id: "extra-28", caption: "", image: "./extras/extra-28.jpg" },
  { id: "extra-29", caption: "", image: "./extras/extra-29.jpg" },
  { id: "extra-30", caption: "", image: "./extras/extra-30.jpg" },
  { id: "extra-31", caption: "", image: "./extras/extra-31.jpg" },
  { id: "extra-32", caption: "", image: "./extras/extra-32.jpg" },
  { id: "extra-33", caption: "", image: "./extras/extra-33.jpg" },
  { id: "extra-34", caption: "", image: "./extras/extra-34.jpg" },
  { id: "extra-35", caption: "", image: "./extras/extra-35.jpg" },
  { id: "extra-37", caption: "", image: "./extras/extra-37.jpg" },
  { id: "extra-38", caption: "", image: "./extras/extra-38.jpg" },
  { id: "extra-39", caption: "", image: "./extras/extra-39.jpg" },
  { id: "extra-40", caption: "", image: "./extras/extra-40.jpg" },
  { id: "extra-41", caption: "", image: "./extras/extra-41.jpg" },
  { id: "extra-42", caption: "", image: "./extras/extra-42.jpg" },
  { id: "extra-43", caption: "", image: "./extras/extra-43.jpg" },
  { id: "extra-44", caption: "", image: "./extras/extra-44.jpg" },
  { id: "extra-45", caption: "", image: "./extras/extra-45.jpg" },
  { id: "extra-46", caption: "", image: "./extras/extra-46.jpg" },
  { id: "extra-47", caption: "", image: "./extras/extra-47.jpg" },
  { id: "extra-48", caption: "", image: "./extras/extra-48.jpg" },
  { id: "extra-49", caption: "", image: "./extras/extra-49.jpg" },
  { id: "extra-50", caption: "", image: "./extras/extra-50.jpg" },
  { id: "extra-51", caption: "", image: "./extras/extra-51.jpg" },
  { id: "extra-52", caption: "", image: "./extras/extra-52.jpg" },
  { id: "extra-53", caption: "", image: "./extras/extra-53.jpg" },
  { id: "extra-54", caption: "", image: "./extras/extra-54.jpg" },
  { id: "extra-55", caption: "", image: "./extras/extra-55.jpg" },
  { id: "extra-56", caption: "", image: "./extras/extra-56.jpg" },
  { id: "extra-57", caption: "", image: "./extras/extra-57.jpg" },
  { id: "extra-58", caption: "", image: "./extras/extra-58.jpg" },
  { id: "extra-59", caption: "", image: "./extras/extra-59.png" },
  { id: "extra-60", caption: "", image: "./extras/extra-60.png" },
  { id: "extra-61", caption: "", image: "./extras/extra-61.png" },
  { id: "extra-62", caption: "", image: "./extras/extra-62.png" },
  { id: "extra-63", caption: "", image: "./extras/extra-63.jpg" },
  { id: "extra-64", caption: "", image: "./extras/extra-64.jpg" },
  { id: "extra-65", caption: "", image: "./extras/extra-65.jpg" },
  { id: "extra-66", caption: "", image: "./extras/extra-66.jpg" },
  { id: "extra-67", caption: "", image: "./extras/extra-67.jpg" },
  { id: "extra-68", caption: "", image: "./extras/extra-68.jpg" },
  { id: "extra-69", caption: "", image: "./extras/extra-69.jpg" },
  { id: "extra-70", caption: "", image: "./extras/extra-70.jpg" },
  { id: "extra-71", caption: "", image: "./extras/extra-71.jpg" },
  { id: "extra-72", caption: "", image: "./extras/extra-72.jpg" },
  { id: "extra-73", caption: "", image: "./extras/extra-73.jpg" },
  { id: "extra-74", caption: "", image: "./extras/extra-74.jpg" },
  { id: "extra-75", caption: "", image: "./extras/extra-75.jpg" },
  { id: "extra-76", caption: "", image: "./extras/extra-76.jpg" },
  { id: "extra-77", caption: "", image: "./extras/extra-77.jpg" },
  { id: "extra-78", caption: "", image: "./extras/extra-78.jpg" },
];
