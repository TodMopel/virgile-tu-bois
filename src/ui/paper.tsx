import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useImperativeAnimation } from "../visuals/shared/useImperativeAnimation";
import { SILENT_FRAME, type EnergyFrame } from "../visuals/types";

// Système visuel "Cou Cou Records" : papier kraft, éléments scotchés/post-it,
// inspiré du collage de la pochette (visuals/b_The Cover back.png). Utilisé par
// l'écran de sélection, les extras et le menu — voir CONTEXT.md (2026-08-10).

// Couleurs recalées sur la vraie pochette (rose poussiéreux, pas un rose vif) —
// voir CONTEXT.md, retour du 2026-08-10.
export const paperPalette = {
  kraft: "#e8d9b8",
  kraftDark: "#d9c69c",
  ink: "#2b2116",
  pink: "#c9827d",
  pinkDark: "#9c5450",
  gold: "#caa049",
  cream: "#faf3e2",
};

// FNV-1a : les ids voisins ("extra-01", "extra-02"...) doivent donner des hash très
// différents (bon "avalanche"), pas juste ±1 — un hash plus naïf donnait quasiment la
// même rotation/seed à toute une série d'ids ne différant que par leur suffixe.
// >>> 0 le force aussi en non-signé, pour un % toujours positif.
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Rotation déterministe (-deg..+deg) dérivée d'un id — stable entre les rendus. */
export function seededRotation(id: string, spread = 4): number {
  const h = hashString(id);
  return ((h % 1000) / 1000) * spread * 2 - spread;
}

export function seededSide(id: string): "left" | "right" {
  return hashString(id) % 2 === 0 ? "left" : "right";
}

export function KraftBackground({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 20% 0%, ${paperPalette.kraftDark}, ${paperPalette.kraft} 60%)`,
        overflow: "hidden",
        ...style,
      }}
    >
      <div className="fx-grain" style={{ opacity: 0.15, mixBlendMode: "multiply" }} />
      {children}
    </div>
  );
}

export function TapeStrip({
  side = "left",
  rotation = -8,
  top = -10,
}: {
  side?: "left" | "right";
  rotation?: number;
  top?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        [side]: "12%",
        width: 56,
        height: 22,
        background: "rgba(255,251,240,0.8)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
        transform: `rotate(${rotation}deg)`,
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 6px)",
        pointerEvents: "none",
      }}
    />
  );
}

interface TapedCardProps {
  children: ReactNode;
  id: string;
  style?: CSSProperties;
  onClick?: () => void;
  /** Amplitude de la rotation aléatoire (deg) — plus large pour un effet "pêle-mêle". */
  rotationSpread?: number;
}

/** Carte "scotchée" : légère rotation, ombre portée, bande de tape en accent. */
export function TapedCard({ children, id, style, onClick, rotationSpread = 2.5 }: TapedCardProps) {
  const rotation = seededRotation(id, rotationSpread);
  const side = seededSide(id);
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        border: "none",
        textAlign: "left",
        background: paperPalette.cream,
        borderRadius: 10,
        padding: "0.9rem 1rem",
        boxShadow: "0 6px 14px rgba(43,33,22,0.25), 0 1px 0 rgba(255,255,255,0.6) inset",
        transform: `rotate(${rotation}deg)`,
        color: paperPalette.ink,
        ...style,
      }}
    >
      <TapeStrip side={side} rotation={rotation * 2.2 - (side === "left" ? 6 : -6)} />
      {children}
    </Tag>
  );
}

export function StampBadge({ children, color = paperPalette.pink }: { children: ReactNode; color?: string }) {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "0.85rem",
        flexShrink: 0,
        transform: "rotate(-6deg)",
      }}
    >
      {children}
    </div>
  );
}

interface TornBannerProps {
  eyebrow?: string;
  title: string;
  /** Passés quand une musique joue, pour faire vivre un peu le header — retour 2026-08-10. */
  energyRef?: RefObject<EnergyFrame>;
  animated?: boolean;
}

const BANNER_ROTATION = -1.1;

// Étiquette scotchée, dans le même langage visuel que les cartes de la tracklist et
// des extras — plus le déchiré carton, qui jurait avec le fond de page (retour du
// 2026-08-10 : "il ne s'intègre pas bien avec le fond").
export function TornBanner({ eyebrow, title, energyRef, animated }: TornBannerProps) {
  const fallbackRef = useRef<EnergyFrame>(SILENT_FRAME);
  const ref = useImperativeAnimation<HTMLDivElement>(energyRef ?? fallbackRef, (node, energy, t) => {
    if (!animated) {
      node.style.transform = `rotate(${BANNER_ROTATION}deg)`;
      return;
    }
    const wobble = Math.sin(t / 1400) * 1.1 * (0.4 + energy.overall * 0.8);
    const scale = 1 + energy.overall * 0.02;
    node.style.transform = `rotate(${BANNER_ROTATION + wobble}deg) scale(${scale})`;
  });

  return (
    <div style={{ padding: "1.6rem 1rem 0.6rem", display: "flex", justifyContent: "center" }}>
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          background: `linear-gradient(150deg, ${paperPalette.pink}, ${paperPalette.pinkDark} 85%)`,
          borderRadius: 14,
          padding: "1.2rem 1.4rem 1.35rem",
          textAlign: "center",
          boxShadow: "0 10px 22px rgba(43,33,22,0.3), 0 1px 0 rgba(255,255,255,0.25) inset",
        }}
      >
        <div className="fx-grain" style={{ opacity: 0.16, mixBlendMode: "overlay" }} />
        <TapeStrip side="left" rotation={-11} top={-14} />
        <TapeStrip side="right" rotation={9} top={-12} />
        {eyebrow && (
          <div
            style={{
              position: "relative",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: paperPalette.cream,
              opacity: 0.85,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            position: "relative",
            fontFamily: "V10Cinzel, Georgia, serif",
            fontWeight: 700,
            fontSize: "clamp(1.6rem, 6.5vw, 2.4rem)",
            color: paperPalette.cream,
            textShadow: "0 2px 0 rgba(0,0,0,0.2)",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
