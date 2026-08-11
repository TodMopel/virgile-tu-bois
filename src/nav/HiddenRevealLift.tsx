import { createContext, useContext, useState, type ReactNode } from "react";

interface HiddenRevealLiftValue {
  lift: number;
  setLift: (px: number) => void;
}

const HiddenRevealLiftContext = createContext<HiddenRevealLiftValue | null>(null);

// Signal partagé (hors PlaybackContext, purement UI) : quand un HiddenReveal se
// dévoile par overscroll, le MiniPlayer se soulève de la même distance pour ne pas
// cacher le secret derrière lui — retour du 2026-08-11.
export function HiddenRevealLiftProvider({ children }: { children: ReactNode }) {
  const [lift, setLift] = useState(0);
  return <HiddenRevealLiftContext.Provider value={{ lift, setLift }}>{children}</HiddenRevealLiftContext.Provider>;
}

export function useHiddenRevealLift(): HiddenRevealLiftValue {
  const ctx = useContext(HiddenRevealLiftContext);
  if (!ctx) throw new Error("useHiddenRevealLift doit être utilisé sous HiddenRevealLiftProvider");
  return ctx;
}
