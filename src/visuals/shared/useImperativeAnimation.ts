import { useEffect, useRef, type RefObject } from "react";
import type { EnergyFrame } from "../types";

// Anime un noeud DOM directement (transform/opacity/filter...) à chaque frame,
// sans passer par le state/re-render React — c'est ce qui rend l'animation fluide
// au lieu de saccadée (voir CONTEXT.md, correction du 2026-08-10).
export function useImperativeAnimation<T extends HTMLElement | SVGElement>(
  energyRef: RefObject<EnergyFrame>,
  apply: (node: T, energy: EnergyFrame, elapsedMs: number) => void,
): RefObject<T> {
  // Le null initial est un mensonge de type assumé (idiome standard React) : le noeud
  // n'existe qu'après montage, la vérification `if (node)` dans la boucle rAF le gère.
  const nodeRef = useRef<T>(null!);
  const applyRef = useRef(apply);
  applyRef.current = apply;

  const rafRef = useRef<number | null>(null);
  const startRef = useRef(performance.now());

  useEffect(() => {
    const tick = (now: number) => {
      const node = nodeRef.current;
      const energy = energyRef.current;
      if (node && energy) {
        applyRef.current(node, energy, now - startRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [energyRef]);

  return nodeRef;
}
