import { useEffect, useRef, type TouchEvent } from "react";
import { paperPalette, seededRotation, seededSide, TapeStrip } from "../ui/paper";
import type { ExtraItem } from "../data/extras";

interface ExtrasLightboxProps {
  items: ExtraItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const SWIPE_THRESHOLD = 50;

const navButtonStyle = {
  position: "absolute" as const,
  top: "50%",
  transform: "translateY(-50%)",
  width: 42,
  height: 42,
  borderRadius: "50%",
  border: "none",
  background: "rgba(0,0,0,0.35)",
  color: "#fff",
  fontSize: "1.5rem",
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// Visionneuse plein écran des extras : ouverte au clic sur une photo, navigation par
// swipe (ou flèches clavier/boutons) — garde la DA polaroide (tape, papier, légère
// rotation) même en grand. Retour du 2026-08-11.
export function ExtrasLightbox({ items, index, onClose, onNavigate }: ExtrasLightboxProps) {
  const touchStartXRef = useRef<number | null>(null);
  const item = items[index];

  const go = (delta: number) => {
    onNavigate((index + delta + items.length) % items.length);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (dx > SWIPE_THRESHOLD) go(-1);
    else if (dx < -SWIPE_THRESHOLD) go(1);
  };

  if (!item) return null;

  return (
    <div
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(20,14,8,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3.2rem 1.2rem",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          position: "absolute",
          top: "1.1rem",
          right: "1.1rem",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          background: "rgba(0,0,0,0.4)",
          color: "#fff",
          fontSize: "1.3rem",
        }}
      >
        ×
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        style={{ ...navButtonStyle, left: "0.6rem" }}
      >
        ‹
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        style={{ ...navButtonStyle, right: "0.6rem" }}
      >
        ›
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: paperPalette.cream,
          borderRadius: 10,
          padding: "0.9rem 0.9rem 1.6rem",
          boxShadow: "0 20px 44px rgba(0,0,0,0.5)",
          transform: `rotate(${seededRotation(item.id, 3)}deg)`,
          maxWidth: "min(88vw, 420px)",
          width: "100%",
        }}
      >
        <TapeStrip side={seededSide(item.id)} />
        <img
          src={item.image}
          alt={item.caption}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            objectFit: "cover",
            objectPosition: item.objectPosition ?? "center",
            borderRadius: 6,
            display: "block",
          }}
        />
        {item.caption && (
          <div style={{ marginTop: "0.7rem", fontSize: "0.95rem", fontWeight: 600, textAlign: "center", color: paperPalette.ink }}>
            {item.caption}
          </div>
        )}
      </div>
    </div>
  );
}
