export interface ExtraItem {
  id: string;
  caption: string;
  image?: string; // chemin vers public/, optionnel
  /** Recadrage ponctuel (CSS object-position, ex. "50% 20%") — laisser vide pour le
   * centrage automatique, ajuster seulement les photos mal cadrées par défaut. */
  objectPosition?: string;
  /** Zoom ponctuel sur la photo (1 = normal), réglé depuis le mode édition. */
  zoom?: number;
  /** Police de la légende, choisie parmi celles des 10 versions (mode édition). */
  fontFamily?: string;
}

// Section "private jokes" — voir docs/adr/0004. 77 photos fournies le 2026-08-11
// (visuals/Extras/, copiées dans public/extras/extra-NN puis référencées ici). Légendes,
// recadrages (objectPosition/zoom) et polices réglés à la main via le mode édition
// (?edit) puis exportés et collés ici le 2026-08-11.
// NB : un fichier vidéo (.mov) était mêlé aux photos fournies — copié dans
// public/extras/extra-36.mov mais pas inclus ici (ce n'est pas une image).
export const extras: ExtraItem[] = [
  { id: "extra-01", caption: "L'apéro des Coucou", image: "./extras/extra-01.jpg", objectPosition: "75% 33%", zoom: 1.45, fontFamily: "V02Baloo, sans-serif" },
  { id: "extra-02", caption: "Mon Karlikarlitoooo", image: "./extras/extra-02.jpg", objectPosition: "59% 44%", zoom: 2.2, fontFamily: "V05Pacifico, cursive" },
  { id: "extra-03", caption: "", image: "./extras/extra-03.jpg" },
  { id: "extra-04", caption: "", image: "./extras/extra-04.jpg" },
  { id: "extra-05", caption: "mon rémi préféré", image: "./extras/extra-05.jpg", objectPosition: "50% 82%", zoom: 1.45, fontFamily: "V07Anton, sans-serif" },
  { id: "extra-06", caption: "non c'est celui là", image: "./extras/extra-06.jpg", objectPosition: "50% 66%", fontFamily: "V02Baloo, sans-serif" },
  { id: "extra-07", caption: "il a gagné la partie", image: "./extras/extra-07.jpg", objectPosition: "66% 42%", zoom: 1.45 },
  { id: "extra-08", caption: "", image: "./extras/extra-08.jpg" },
  { id: "extra-09", caption: "", image: "./extras/extra-09.jpg" },
  { id: "extra-10", caption: "ce qu'on a vu est un secret", image: "./extras/extra-10.jpg", objectPosition: "0% 26%", zoom: 1.15, fontFamily: "V01Fredoka, sans-serif" },
  { id: "extra-11", caption: "l'origine", image: "./extras/extra-11.jpg" },
  { id: "extra-12", caption: "Noooon ne saute pas !", image: "./extras/extra-12.jpg", objectPosition: "2% 50%", zoom: 1.75 },
  { id: "extra-13", caption: "", image: "./extras/extra-13.jpg" },
  { id: "extra-14", caption: "", image: "./extras/extra-14.jpg", objectPosition: "58% 50%", zoom: 2.35 },
  { id: "extra-15", caption: "", image: "./extras/extra-15.jpg", objectPosition: "58% 100%", zoom: 1.95, fontFamily: "V01Fredoka, sans-serif" },
  { id: "extra-16", caption: "il a perdu cette partie", image: "./extras/extra-16.jpg", objectPosition: "82% 34%", zoom: 1.6 },
  { id: "extra-17", caption: "l'inspiration est là !", image: "./extras/extra-17.jpg", fontFamily: "V08Quicksand, sans-serif" },
  { id: "extra-18", caption: "alternate cover", image: "./extras/extra-18.jpg", objectPosition: "50% 50%", zoom: 3, fontFamily: "V04Audiowide, sans-serif" },
  { id: "extra-19", caption: "", image: "./extras/extra-19.jpg" },
  { id: "extra-20", caption: "Quentin raconte une dinguerie là", image: "./extras/extra-20.jpg", objectPosition: "82% 42%", fontFamily: "V04Audiowide, sans-serif" },
  { id: "extra-21", caption: "", image: "./extras/extra-21.jpg" },
  { id: "extra-22", caption: "L O V E", image: "./extras/extra-22.jpg", objectPosition: "76% 50%" },
  { id: "extra-23", caption: "défaite en vue", image: "./extras/extra-23.jpg", objectPosition: "26% 58%", zoom: 1.3 },
  { id: "extra-24", caption: "hihi c'est trop drole", image: "./extras/extra-24.jpg", objectPosition: "100% 50%", zoom: 1.3 },
  { id: "extra-25", caption: "", image: "./extras/extra-25.jpg", objectPosition: "50% 34%", zoom: 1.15 },
  { id: "extra-26", caption: "ouais les coups de soleil", image: "./extras/extra-26.jpg", objectPosition: "50% 34%", zoom: 1.75, fontFamily: "V07Anton, sans-serif" },
  { id: "extra-27", caption: "", image: "./extras/extra-27.jpg", objectPosition: "74% 50%", zoom: 1.75 },
  { id: "extra-28", caption: "APÉRO !", image: "./extras/extra-28.jpg", fontFamily: "V04Audiowide, sans-serif" },
  { id: "extra-29", caption: "", image: "./extras/extra-29.jpg", objectPosition: "58% 42%", zoom: 2.05 },
  { id: "extra-30", caption: "Cover V1", image: "./extras/extra-30.jpg" },
  { id: "extra-31", caption: "ça pue la victoire", image: "./extras/extra-31.jpg", objectPosition: "50% 66%", fontFamily: "V08Quicksand, sans-serif" },
  { id: "extra-32", caption: "❤️", image: "./extras/extra-32.jpg", objectPosition: "100% 50%", zoom: 2.65 },
  { id: "extra-33", caption: "", image: "./extras/extra-33.jpg", objectPosition: "42% 50%", zoom: 1.75 },
  { id: "extra-34", caption: "", image: "./extras/extra-34.jpg" },
  { id: "extra-35", caption: "", image: "./extras/extra-35.jpg" },
  { id: "extra-37", caption: "", image: "./extras/extra-37.jpg", objectPosition: "22% 39%" },
  { id: "extra-38", caption: "Tu viens ?", image: "./extras/extra-38.jpg" },
  { id: "extra-39", caption: "Tu viens on voit bien !", image: "./extras/extra-39.jpg" },
  { id: "extra-40", caption: "Qu'est-ce que vous foutez ?", image: "./extras/extra-40.jpg" },
  { id: "extra-41", caption: "pio", image: "./extras/extra-41.jpg", objectPosition: "50% 34%", zoom: 1.3 },
  { id: "extra-42", caption: "", image: "./extras/extra-42.jpg", objectPosition: "50% 42%", zoom: 1.15 },
  { id: "extra-43", caption: "", image: "./extras/extra-43.jpg" },
  { id: "extra-44", caption: "La création de la Pétanque Enquillée", image: "./extras/extra-44.jpg", fontFamily: "V04Audiowide, sans-serif" },
  { id: "extra-45", caption: "", image: "./extras/extra-45.jpg", objectPosition: "50% 58%", zoom: 1.6 },
  { id: "extra-46", caption: "", image: "./extras/extra-46.jpg", objectPosition: "66% 26%", zoom: 1.45 },
  { id: "extra-47", caption: "", image: "./extras/extra-47.jpg" },
  { id: "extra-48", caption: "", image: "./extras/extra-48.jpg" },
  { id: "extra-49", caption: "", image: "./extras/extra-49.jpg" },
  { id: "extra-50", caption: "", image: "./extras/extra-50.jpg" },
  { id: "extra-51", caption: "", image: "./extras/extra-51.jpg" },
  { id: "extra-52", caption: "", image: "./extras/extra-52.jpg" },
  { id: "extra-53", caption: "", image: "./extras/extra-53.jpg" },
  { id: "extra-54", caption: "", image: "./extras/extra-54.jpg" },
  { id: "extra-55", caption: "", image: "./extras/extra-55.jpg" },
  { id: "extra-56", caption: "Les yeux qui gonflent", image: "./extras/extra-56.jpg", objectPosition: "58% 34%", zoom: 1.9 },
  { id: "extra-57", caption: "", image: "./extras/extra-57.jpg" },
  { id: "extra-58", caption: "", image: "./extras/extra-58.jpg" },
  { id: "extra-61", caption: "", image: "./extras/extra-61.png" },
  { id: "extra-62", caption: "❤️", image: "./extras/extra-62.png" },
  { id: "extra-64", caption: "", image: "./extras/extra-64.jpg", objectPosition: "42% 50%", zoom: 1.45 },
  { id: "extra-65", caption: "", image: "./extras/extra-65.jpg" },
  { id: "extra-66", caption: "", image: "./extras/extra-66.jpg" },
  { id: "extra-67", caption: "", image: "./extras/extra-67.jpg" },
  { id: "extra-68", caption: "", image: "./extras/extra-68.jpg" },
  { id: "extra-69", caption: "", image: "./extras/extra-69.jpg" },
  { id: "extra-70", caption: "", image: "./extras/extra-70.jpg" },
  { id: "extra-71", caption: "LES YEUX GONFLÉS", image: "./extras/extra-71.jpg", objectPosition: "74% 0%", fontFamily: "V02Baloo, sans-serif" },
  { id: "extra-72", caption: "", image: "./extras/extra-72.jpg", objectPosition: "100% 34%", zoom: 1.6 },
  { id: "extra-73", caption: "", image: "./extras/extra-73.jpg", objectPosition: "50% 50%", zoom: 2.7 },
  { id: "extra-74", caption: "", image: "./extras/extra-74.jpg", objectPosition: "58% 34%", zoom: 2.05 },
  { id: "extra-75", caption: "", image: "./extras/extra-75.jpg", objectPosition: "42% 58%", zoom: 1.3 },
  { id: "extra-76", caption: "", image: "./extras/extra-76.jpg" },
  { id: "extra-77", caption: "", image: "./extras/extra-77.jpg" },
  { id: "extra-78", caption: "", image: "./extras/extra-78.jpg" },
  { id: "extra-59", caption: "❤️", image: "./extras/extra-59.png" },
  { id: "extra-60", caption: "❤️", image: "./extras/extra-60.png" },
  { id: "extra-63", caption: "", image: "./extras/extra-63.jpg", objectPosition: "44% 61%" },
];
