import type { SVGProps } from "react";

// Set d'icônes-doodles maison (line-art cohérent), remplace les emoji —
// voir docs/animation-prompts.md pour la description de chaque doodle.
type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: "0 0 24 24",
  width: "100%",
  height: "100%",
};

export function GlitterBallIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.2} {...props}>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="9" ry="3.2" />
      <ellipse cx="12" cy="12" rx="9" ry="6.2" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="5.2" y1="5.6" x2="5.2" y2="18.4" />
      <line x1="18.8" y1="5.6" x2="18.8" y2="18.4" />
    </svg>
  );
}

export function StarburstIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" />
    </svg>
  );
}

export function PalmLeafIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" {...props}>
      <path d="M12 22 C12 14 12 10 12 4" />
      <path d="M12 8 C8 6 5 6 3 8" />
      <path d="M12 6 C9 3 6 3 4 4" />
      <path d="M12 10 C16 8 19 8 21 10" />
      <path d="M12 8 C15 5 18 5 20 6" />
    </svg>
  );
}

export function LaserStarIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" {...props}>
      <line x1="4" y1="20" x2="20" y2="4" />
      <line x1="13" y1="4" x2="20" y2="4" />
      <line x1="20" y1="4" x2="20" y2="11" />
      <circle cx="6" cy="18" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function VinylGrooveIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.3} {...props}>
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="5.5" opacity={0.75} />
      <circle cx="12" cy="12" r="9" opacity={0.45} />
    </svg>
  );
}

export function PulseSquareIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  );
}

export function BoomboxIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="8" width="18" height="12" rx="1.5" />
      <circle cx="8" cy="14" r="2.4" />
      <circle cx="16" cy="14" r="2.4" />
      <path d="M7 8 7 4 17 4 17 8" />
    </svg>
  );
}

export function CloudWaveIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" {...props}>
      <path d="M6 15a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A4.5 4.5 0 0 1 18 15Z" />
      <path d="M4 19c1-1 2-1 3 0s2 1 3 0 2-1 3 0 2 1 3 0" opacity={0.6} />
    </svg>
  );
}

export function ViolinSynthIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" {...props}>
      <path d="M12 3c-1.5 1-2 2-2 3.5 0 1 .5 1.8 1 2.5-1.5.5-2.5 1.7-2.5 3.5 0 2.5 1.5 3.5 1.5 5.5 0 1.5-1 2-1 2h6s-1-.5-1-2c0-2 1.5-3 1.5-5.5 0-1.8-1-3-2.5-3.5.5-.7 1-1.5 1-2.5C14 5 13.5 4 12 3Z" />
      <circle cx="9.3" cy="7" r={0.6} fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="7" r={0.6} fill="currentColor" stroke="none" />
      <path d="M9 18v3M15 18v3M9 21h6" />
    </svg>
  );
}

export function TrebleClefIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" {...props}>
      <path d="M13 2c-2 1-3 3-3 5 0 1.5 1 2.5 1 2.5s-4 2-4 6c0 2.5 2 4 4 4 2.5 0 4-1.8 4-4 0-1.8-1.3-3-2.8-3.3M13 2c1.5 2 1.5 5-.5 8-1.5 2.3-2.5 4-2.5 6.5 0 2 1 3.5 1 3.5" />
      <circle cx="10.5" cy="20" r={1.1} fill="currentColor" stroke="none" />
    </svg>
  );
}
