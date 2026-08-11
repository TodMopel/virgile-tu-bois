import { useSfx } from "../audio/useSfx";
import { paperPalette } from "../ui/paper";
import type { Screen } from "../App";

interface MenuBarProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const ITEMS: { screen: Screen; label: string; icon: string }[] = [
  { screen: "home", label: "Accueil", icon: "M12 3 L21 10 V21 H15 V14 H9 V21 H3 V10 Z" },
  { screen: "selection", label: "Album", icon: "M5 4 H19 V8 H5 Z M5 11 H19 V15 H5 Z M5 18 H19 V22 H5 Z" },
  {
    screen: "extras",
    label: "Extras",
    icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  },
];

// Nav bottom façon app musique (Spotify/Deezer), habillée en DA "Cou Cou Records" —
// voir docs/adr/0004 et le retour créatif du 2026-08-10 (src/ui/paper.tsx).
export function MenuBar({ current, onNavigate }: MenuBarProps) {
  const { play } = useSfx();

  return (
    <nav
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: paperPalette.cream,
        borderTop: `3px solid ${paperPalette.gold}`,
        boxShadow: "0 -6px 16px rgba(43,33,22,0.25)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", width: "100%", maxWidth: 480, padding: "0.4rem 0.6rem calc(0.5rem + env(safe-area-inset-bottom))" }}>
        {ITEMS.map(({ screen, label, icon }) => {
          const active = current === screen;
          return (
            <button
              key={screen}
              onClick={() => {
                play("nav-click");
                onNavigate(screen);
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                border: "none",
                background: "transparent",
                padding: "0.5rem 0.3rem",
                color: active ? paperPalette.pinkDark : paperPalette.ink,
                opacity: active ? 1 : 0.55,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill={active ? paperPalette.pinkDark : "currentColor"}
                style={{ transform: active ? "scale(1.1) rotate(-3deg)" : "none" }}
              >
                <path d={icon} />
              </svg>
              <span style={{ fontSize: "0.68rem", fontWeight: 700 }}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
