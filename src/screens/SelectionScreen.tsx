import { useRef } from "react";
import { tracks } from "../data/tracks";
import { KraftBackground, TornBanner } from "../ui/paper";
import { TrackRow } from "./TrackRow";
import { HiddenReveal } from "./HiddenReveal";
import { usePlaybackContext } from "../audio/PlaybackContext";

interface SelectionScreenProps {
  onOpenPlayer: () => void;
}

// Tracklist inspirée Deezer/Spotify, habillée en DA "Cou Cou Records" (papier/scotché) —
// reprend directement la structure de la pochette verso (10 traitements numérotés).
export function SelectionScreen({ onOpenPlayer }: SelectionScreenProps) {
  const { playing, energyRef } = usePlaybackContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <KraftBackground>
      <div ref={scrollRef} style={{ position: "absolute", inset: 0, overflowY: "auto", overscrollBehavior: "contain", paddingBottom: "9.5rem" }}>
        <TornBanner title="Sables d'O-Zone" energyRef={energyRef} animated={playing} />

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.4rem 1rem 0", display: "flex", flexDirection: "column", gap: "2.1rem" }}>
          {tracks.map((track, i) => (
            <TrackRow key={track.id} track={track} index={i} onOpen={onOpenPlayer} />
          ))}
        </div>
      <div
        style={{
          height: "10.5rem",
        }}
      >
      </div>
      </div>
      <HiddenReveal scrollRef={scrollRef} src="./extras/hidden-tracklist.png" liftOffset={160} />
    </KraftBackground>
  );
}
