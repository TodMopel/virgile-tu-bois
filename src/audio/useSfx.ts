import { useCallback, useRef } from "react";

// Voir docs/adr/0004 : les fichiers sous public/sfx/ sont des placeholders au départ.
// Si un fichier est absent ou ne peut pas jouer, on échoue silencieusement plutôt
// que de casser la navigation.
export type SfxName = "nav-click" | "select" | "transition";

const pool = new Map<SfxName, HTMLAudioElement>();

function getAudio(name: SfxName): HTMLAudioElement {
  let audio = pool.get(name);
  if (!audio) {
    audio = new Audio(`./sfx/${name}.mp3`);
    audio.preload = "auto";
    pool.set(name, audio);
  }
  return audio;
}

export function useSfx() {
  const enabledRef = useRef(true);

  const play = useCallback((name: SfxName) => {
    if (!enabledRef.current) return;
    try {
      const audio = getAudio(name);
      audio.currentTime = 0;
      audio.play().catch(() => {
        // fichier placeholder manquant ou lecture bloquée — on ignore
      });
    } catch {
      // no-op
    }
  }, []);

  return { play };
}
