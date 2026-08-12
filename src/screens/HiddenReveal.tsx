import { useEffect, useRef, useState, type RefObject } from "react";
import { useHiddenRevealLift } from "../nav/HiddenRevealLift";

interface HiddenRevealProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  src: string;
  caption?: string;
  /** Distance (px) dont le mini-lecteur se soulève une fois le secret entièrement révélé. */
  liftOffset?: number;
}

const MAX_PULL = 130;

// Élément "secret" qui ne fait pas partie du contenu scrollable (ne compte pour rien
// dans le scrollHeight, invisible par défaut) — ne se révèle que si on continue de
// tirer/scroller une fois arrivé tout en bas de la liste (overscroll), un peu comme un
// tiroir caché sous le contenu. Retour du 2026-08-11 : "il ne doit pas faire partie du
// scroll, il doit être invisible et pas considéré dans le scroll".
export function HiddenReveal({ scrollRef, src, caption, liftOffset = MAX_PULL }: HiddenRevealProps) {
  const [pull, setPull] = useState(0);
  const touchStartYRef = useRef<number | null>(null);
  const pullAtTouchStartRef = useRef(0);
  const { setLift } = useHiddenRevealLift();

  // soulève le mini-lecteur d'autant que le secret est tiré, pour qu'il ne le cache
  // pas — retour du 2026-08-11 : "quand on a le mini player c'est caché".
  useEffect(() => {
    setLift((pull / MAX_PULL) * liftOffset);
  }, [pull, liftOffset, setLift]);

  useEffect(() => () => setLift(0), [setLift]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const atBottom = () => el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
      pullAtTouchStartRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null || !atBottom()) return;
      const dy = touchStartYRef.current - e.touches[0].clientY; // >0 = on continue de tirer vers le haut (scroll vers le bas)
      setPull(Math.max(0, Math.min(MAX_PULL, pullAtTouchStartRef.current + dy)));
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
      setPull(0);
    };

    const onWheel = (e: WheelEvent) => {
      if (atBottom() && e.deltaY > 0) {
        setPull((p) => Math.max(0, Math.min(MAX_PULL, p + e.deltaY * 0.6)));
      } else {
        setPull(0);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, [scrollRef]);

  const progress = pull / MAX_PULL;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "0.5rem",
        padding: "0 0 1.2rem",
        pointerEvents: "none",
        zIndex: 1,
        transform: `translateY(${(1 - progress) * 100}%)`,
        opacity: progress,
        transition: pull === 0 ? "transform 400ms ease-out, opacity 400ms ease-out" : "none",
      }}
    >
      <img
        src={src}
        alt={caption ?? "surprise"}
        style={{ maxWidth: 400, width: "70%", filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.35))" }}
      />
      {caption && <div style={{ fontSize: "0.8rem", fontStyle: "italic", opacity: 0.7 }}>{caption}</div>}
    </div>
  );
}
