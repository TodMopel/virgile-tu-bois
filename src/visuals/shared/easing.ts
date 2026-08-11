// Fonctions d'easing + lissage — les mouvements pilotés en brut par l'énergie frame à
// frame ont un rendu saccadé/moche ; on lisse le signal puis on passe les progressions
// par une courbe d'easing plutôt que du linéaire. Voir CONTEXT.md (retour du 2026-08-10).

export function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/** Repère triangulaire 0→1→0 sur une période, pour des va-et-vient doux (pas de saut). */
export function triangleWave(phase01: number): number {
  const p = phase01 - Math.floor(phase01);
  return p < 0.5 ? p * 2 : 2 - p * 2;
}

/** Lissage exponentiel (filtre passe-bas) : atténue le bruit frame-à-frame du signal audio. */
export function smoothTo(current: number, target: number, alpha: number): number {
  return current + (target - current) * alpha;
}
