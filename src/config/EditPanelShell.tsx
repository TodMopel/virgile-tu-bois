import { useState, type CSSProperties, type ReactNode } from "react";

// Coquille partagée par SongsEditPanel et HomeEditPanel (jamais affichés en même temps,
// voir App.tsx — chacun est scopé à son propre écran) : bouton flottant replié, panneau
// déroulant ouvert. Ancré en haut : la zone basse est déjà occupée selon l'écran par le
// MenuBar, le MiniPlayer ou les contrôles de PlayerScreen. `side` évite le bouton "←"
// (haut-gauche) de PlayerScreen — Chansons (affiché sur Lecture) passe à droite,
// Accueil (jamais affiché sur Lecture) reste à gauche.
const panelStyle: CSSProperties = {
  position: "fixed",
  left: "0.8rem",
  right: "0.8rem",
  top: "calc(0.8rem + env(safe-area-inset-top))",
  maxWidth: 420,
  margin: "0 auto",
  zIndex: 100,
  background: "#1c1a17",
  color: "#faf3e2",
  border: "1px solid #caa04988",
  borderRadius: 14,
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  fontSize: "0.8rem",
};

export const editFieldStyles = {
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
    marginBottom: "0.7rem",
  } as CSSProperties,
  field: {
    border: "1px solid #caa04966",
    borderRadius: 8,
    padding: "0.4rem 0.5rem",
    background: "#2a2620",
    color: "#faf3e2",
    fontSize: "0.8rem",
  } as CSSProperties,
  button: {
    border: "none",
    borderRadius: 999,
    padding: "0.45rem 0.9rem",
    fontWeight: 700,
    fontSize: "0.76rem",
    cursor: "pointer",
  } as CSSProperties,
};

export function EditPanelShell({ label, side = "left", children }: { label: string; side?: "left" | "right"; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          [side]: "0.8rem",
          top: "calc(0.8rem + env(safe-area-inset-top))",
          zIndex: 100,
          border: "1px solid #caa049",
          borderRadius: 999,
          padding: "0.5rem 1rem",
          background: "#1c1a17",
          color: "#faf3e2",
          fontWeight: 700,
          fontSize: "0.78rem",
          boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
        }}
      >
        ⚙ {label}
      </button>
    );
  }

  return (
    <div style={panelStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.7rem 0.9rem",
          borderBottom: "1px solid #caa04944",
        }}
      >
        <span style={{ fontWeight: 700 }}>{label}</span>
        <button
          onClick={() => setOpen(false)}
          style={{ ...editFieldStyles.button, background: "transparent", color: "#faf3e2", fontSize: "1rem" }}
        >
          ✕
        </button>
      </div>
      <div style={{ padding: "0.9rem", maxHeight: "min(60vh, 480px)", overflowY: "auto" }}>{children}</div>
    </div>
  );
}
