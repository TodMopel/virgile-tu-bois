import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PlaybackProvider } from "./audio/PlaybackContext";
import { HiddenRevealLiftProvider } from "./nav/HiddenRevealLift";
import "./styles/fonts.css";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PlaybackProvider>
      <HiddenRevealLiftProvider>
        <App />
      </HiddenRevealLiftProvider>
    </PlaybackProvider>
  </StrictMode>,
);
