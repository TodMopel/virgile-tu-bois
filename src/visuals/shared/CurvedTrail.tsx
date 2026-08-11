import { useRef } from "react";
import { useImperativeAnimation } from "./useImperativeAnimation";
import { lissajousPos, smoothPathThrough, type Point } from "./curves";
import type { EnergyFrame, VisualProps } from "../types";

interface CurvedTrailProps extends Pick<VisualProps, "energyRef"> {
  cx?: number;
  cy?: number;
  scaleX: number;
  scaleY: number;
  speed: number;
  strokeWidth: number;
  color: string;
  band?: keyof EnergyFrame;
  trailLength?: number;
  /** Dérive horizontale globale (unités/s, 0-100) en plus de la boucle locale — reboucle
   * en sortant de l'écran, façon brume qui dérive. */
  driftPerSec?: number;
  /** Opacité à énergie nulle — proche de 0 pour un filet "bonus" qui n'apparaît vraiment
   * que quand l'énergie de sa bande monte. */
  baseOpacity?: number;
  opacityGain?: number;
}

// Trace une courbe organique (Lissajous) lissée sur un historique de positions — un
// filet de lumière qui suit vraiment une courbe, pas un segment droit qui pivote.
// Partagé entre plusieurs versions (09, 04...) — voir docs/CONTEXT.md, 2026-08-10.
export function CurvedTrail({
  energyRef,
  cx = 50,
  cy = 50,
  scaleX,
  scaleY,
  speed,
  strokeWidth,
  color,
  band = "mid",
  trailLength = 11,
  driftPerSec = 0,
  baseOpacity = 0.4,
  opacityGain = 0.4,
}: CurvedTrailProps) {
  const angleRef = useRef(Math.random() * 10);
  const lastTRef = useRef<number | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const driftRef = useRef(Math.random() * 100);

  const ref = useImperativeAnimation<SVGPathElement>(energyRef, (node, energy, t) => {
    const last = lastTRef.current ?? t;
    const dt = Math.max(0, Math.min(0.1, (t - last) / 1000));
    lastTRef.current = t;
    const level = energy[band] ?? 0;
    angleRef.current += dt * speed * (1 + level * 0.5);
    driftRef.current += dt * driftPerSec;

    const margin = Math.max(scaleX, scaleY) + 5;
    const span = 100 + margin * 2;
    const driftX = (((driftRef.current % span) + span) % span) - margin;

    const p = lissajousPos(angleRef.current, scaleX, scaleY, cx + driftX, cy);
    const pts = pointsRef.current;
    if (Math.abs(driftPerSec) > 0 && pts.length > 0 && Math.abs(p.x - pts[pts.length - 1].x) > 40) {
      pts.length = 0; // on vient de reboucler côté brume : repart d'une trace neuve, pas de trait qui traverse l'écran
    }
    pts.push(p);
    if (pts.length > trailLength) pts.shift();
    if (pts.length < 3) return;

    node.setAttribute("d", smoothPathThrough(pts));
    node.style.opacity = String(baseOpacity + level * opacityGain);
  });

  return <path ref={ref} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />;
}
