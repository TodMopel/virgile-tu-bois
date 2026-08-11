// Utilitaires de courbes partagés — remplacent les segments droits / polylignes par de
// vraies courbes lissées (quadratiques passant par des points clés), voir le retour du
// 2026-08-10 : "adapte tes traits moches par nos belles courbes".

export interface Point {
  x: number;
  y: number;
}

/** Lisse une liste de points en un chemin SVG (quadratiques sur les milieux successifs). */
export function smoothPathThrough(points: Point[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i].x + points[i + 1].x) / 2;
    const my = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

/** Vague remplie (0-100 en x), lissée en courbe plutôt qu'en polyligne à facettes. */
export function buildSmoothWavePath(baseY: number, amplitude: number, phase: number, freq: number, samples = 12): string {
  const pts: Point[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * 100;
    const y = baseY + Math.sin((i / samples) * Math.PI * freq + phase) * amplitude;
    pts.push({ x, y });
  }
  return `${smoothPathThrough(pts)} L 100 100 L 0 100 Z`;
}

/** Trajectoire organique (Lissajous) en coordonnées 0-100, centrée sur (cx,cy). */
export function lissajousPos(angle: number, scaleX: number, scaleY: number, cx = 50, cy = 50): Point {
  const x = cx + Math.sin(angle * 0.9) * scaleX + Math.sin(angle * 2.3) * scaleX * 0.3;
  const y = cy + Math.cos(angle * 0.6) * scaleY + Math.sin(angle * 1.7) * scaleY * 0.35;
  return { x, y };
}
