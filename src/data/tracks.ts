import type { ComponentType, CSSProperties } from "react";
import type { VisualProps } from "../visuals/types";
import type { AnalysisData } from "../audio/analysis";
import { V01Disco } from "../visuals/versions/V01Disco";
import { V02DiscoPop } from "../visuals/versions/V02DiscoPop";
import { V03DancehallRiddim } from "../visuals/versions/V03DancehallRiddim";
import { V04ElectroDisco } from "../visuals/versions/V04ElectroDisco";
import { V05ElectroSoul } from "../visuals/versions/V05ElectroSoul";
import { V06TechnoDance } from "../visuals/versions/V06TechnoDance";
import { V07TechnoHouseBoomBap } from "../visuals/versions/V07TechnoHouseBoomBap";
import { V08TechnoAmbiance } from "../visuals/versions/V08TechnoAmbiance";
import { V09OrchestralElectro } from "../visuals/versions/V09OrchestralElectro";
import { V10Orchestral } from "../visuals/versions/V10Orchestral";

// Importées directement (bundlées en JS) plutôt que fetchées à l'exécution :
// fetch() sur file:// n'est pas fiable dans Safari (cas iPhone, voir docs/adr/0003).
import analysis01 from "./analysis/01_disco.json";
import analysis02 from "./analysis/02_disco-pop.json";
import analysis03 from "./analysis/03_dancehall-riddim.json";
import analysis04 from "./analysis/04_electro-disco.json";
import analysis05 from "./analysis/05_electro-soul.json";
import analysis06 from "./analysis/06_techno-dance.json";
import analysis07 from "./analysis/07_techno-house-boom-bap.json";
import analysis08 from "./analysis/08_techno-ambiance.json";
import analysis09 from "./analysis/09_orchestral-electro.json";
import analysis10 from "./analysis/10_orchestral.json";

export interface Track {
  id: string;
  number: number;
  style: string;
  audioSrc: string;
  analysis: AnalysisData;
  swatch: string; // couleur d'accent (stamp, bordures...)
  gradient: string; // même fond que la version, pour la mini-vignette de sélection
  labelStyle: CSSProperties; // police/couleur du titre, pour la mini-vignette
  Visual: ComponentType<VisualProps>;
}

// Registre unique des 10 versions de "Virgile Tu Bois" — voir docs/animation-prompts.md
// et CONTEXT.md pour le contexte (album Sables d'O-Zone, Les Coucous).
export const tracks: Track[] = [
  {
    id: "01_disco",
    number: 1,
    style: "Disco",
    audioSrc: "./audio/01_disco.mp3",
    analysis: analysis01 as AnalysisData,
    swatch: "#c0c0c8",
    gradient: "linear-gradient(135deg, #24242c, #4c4c58)",
    labelStyle: { fontFamily: "V01Fredoka, sans-serif", color: "#e4e4ec" },
    Visual: V01Disco,
  },
  {
    id: "02_disco-pop",
    number: 2,
    style: "Disco pop",
    audioSrc: "./audio/02_disco-pop.mp3",
    analysis: analysis02 as AnalysisData,
    swatch: "#ff8fb3",
    gradient: "linear-gradient(135deg, #ffb56b, #ff6f91 55%, #c66fff)",
    labelStyle: { fontFamily: "V02Baloo, sans-serif", color: "#fff7ea" },
    Visual: V02DiscoPop,
  },
  {
    id: "03_dancehall-riddim",
    number: 3,
    style: "Dancehall riddim",
    audioSrc: "./audio/03_dancehall-riddim.mp3",
    analysis: analysis03 as AnalysisData,
    swatch: "#3fae5f",
    gradient: "linear-gradient(160deg, #0c1f12, #123a1f)",
    labelStyle: { fontFamily: "V03Stencil, sans-serif", color: "#3fae5f" },
    Visual: V03DancehallRiddim,
  },
  {
    id: "04_electro-disco",
    number: 4,
    style: "Electro disco",
    audioSrc: "./audio/04_electro-disco.mp3",
    analysis: analysis04 as AnalysisData,
    swatch: "#ff2fd6",
    gradient: "linear-gradient(135deg, #1a0022, #3a0057)",
    labelStyle: { fontFamily: "V04Audiowide, sans-serif", color: "#ff2fd6" },
    Visual: V04ElectroDisco,
  },
  {
    id: "05_electro-soul",
    number: 5,
    style: "Electro soul",
    audioSrc: "./audio/05_electro-soul.mp3",
    analysis: analysis05 as AnalysisData,
    swatch: "#e8823a",
    gradient: "linear-gradient(135deg, #4a1207, #8a3311 60%, #c2571c)",
    labelStyle: { fontFamily: "V05Pacifico, cursive", color: "#ffd9ad" },
    Visual: V05ElectroSoul,
  },
  {
    id: "06_techno-dance",
    number: 6,
    style: "Techno dance",
    audioSrc: "./audio/06_techno-dance.mp3",
    analysis: analysis06 as AnalysisData,
    swatch: "#4fd9ff",
    gradient: "linear-gradient(135deg, #001b33, #004a7a)",
    labelStyle: { fontFamily: "V06ShareTechMono, monospace", color: "#eafcff" },
    Visual: V06TechnoDance,
  },
  {
    id: "07_techno-house-boom-bap",
    number: 7,
    style: "Techno house boom bap",
    audioSrc: "./audio/07_techno-house-boom-bap.mp3",
    analysis: analysis07 as AnalysisData,
    swatch: "#c8c4b8",
    gradient: "linear-gradient(135deg, #111114, #303036)",
    labelStyle: { fontFamily: "V07Anton, sans-serif", color: "#e7e3d8" },
    Visual: V07TechnoHouseBoomBap,
  },
  {
    id: "08_techno-ambiance",
    number: 8,
    style: "Techno ambiance",
    audioSrc: "./audio/08_techno-ambiance.mp3",
    analysis: analysis08 as AnalysisData,
    swatch: "#7fa8c9",
    gradient: "linear-gradient(135deg, #0a1a2a, #1b3550)",
    labelStyle: { fontFamily: "V08Quicksand, sans-serif", color: "rgba(210,226,240,0.85)" },
    Visual: V08TechnoAmbiance,
  },
  {
    id: "09_orchestral-electro",
    number: 9,
    style: "Orchestral electro",
    audioSrc: "./audio/09_orchestral-electro.mp3",
    analysis: analysis09 as AnalysisData,
    swatch: "#4fffaa",
    gradient: "linear-gradient(135deg, #052014, #0a3d2a)",
    labelStyle: { fontFamily: "V09Marcellus, serif", color: "#eaf7ee" },
    Visual: V09OrchestralElectro,
  },
  {
    id: "10_orchestral",
    number: 10,
    style: "Orchestral",
    audioSrc: "./audio/10_orchestral.mp3",
    analysis: analysis10 as AnalysisData,
    swatch: "#e8c477",
    gradient: "linear-gradient(135deg, #2a1e0a, #4a3616)",
    labelStyle: { fontFamily: "V10Cinzel, serif", color: "#e8c477" },
    Visual: V10Orchestral,
  },
];

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}
