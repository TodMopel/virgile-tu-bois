import { useState } from "react";
import { MenuBar } from "./nav/MenuBar";
import { MiniPlayer } from "./nav/MiniPlayer";
import { ScreenFade } from "./nav/ScreenFade";
import { HomeScreen } from "./screens/HomeScreen";
import { SelectionScreen } from "./screens/SelectionScreen";
import { PlayerScreen } from "./screens/PlayerScreen";
import { ExtrasScreen } from "./screens/ExtrasScreen";
import { SongsEditPanel } from "./config/SongsEditPanel";
import { HomeEditPanel } from "./config/HomeEditPanel";
import { useEditMode } from "./config/store";

export type Screen = "home" | "selection" | "player" | "extras";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const editMode = useEditMode();

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      <ScreenFade screenKey={screen}>
        {screen === "home" && <HomeScreen onEnter={() => setScreen("selection")} />}
        {screen === "selection" && <SelectionScreen onOpenPlayer={() => setScreen("player")} />}
        {screen === "player" && <PlayerScreen onBack={() => setScreen("selection")} />}
        {screen === "extras" && <ExtrasScreen />}
      </ScreenFade>

      {screen !== "home" && screen !== "player" && <MiniPlayer onOpen={() => setScreen("player")} />}
      {screen !== "home" && screen !== "player" && <MenuBar current={screen} onNavigate={setScreen} />}

      {/* workflows d'édition séparés et scopés à leur écran — Extras garde son propre
          mode édition inline (photos + crédits, voir ExtrasScreen.tsx), non affiché ici */}
      {editMode && screen === "home" && <HomeEditPanel />}
      {editMode && (screen === "selection" || screen === "player") && <SongsEditPanel />}
    </div>
  );
}
