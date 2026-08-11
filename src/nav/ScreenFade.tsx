import type { ReactNode } from "react";

// Transition douce entre écrans (retour du 2026-08-10 : "pas un changement sec") —
// le `key` force React à remonter le noeud à chaque changement d'écran, ce qui
// relance l'animation CSS définie dans global.css (.screen-fade-in).
export function ScreenFade({ screenKey, children }: { screenKey: string; children: ReactNode }) {
  return (
    <div key={screenKey} className="screen-fade-in" style={{ position: "absolute", inset: 0 }}>
      {children}
    </div>
  );
}
