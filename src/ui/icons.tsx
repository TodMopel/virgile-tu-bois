import type { SVGProps } from "react";

// Icônes de contrôle génériques (transport, volume) — distinctes des doodles par
// version (voir visuals/shared/icons.tsx).
type IconProps = SVGProps<SVGSVGElement>;
const base: IconProps = { viewBox: "0 0 24 24", width: "100%", height: "100%" };

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M7 4 L20 12 L7 20 Z" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

export function NextIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M5 4 L15 12 L5 20 Z" />
      <rect x="17" y="4" width="3" height="16" />
    </svg>
  );
}

export function PrevIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <rect x="4" y="4" width="3" height="16" />
      <path d="M19 4 L9 12 L19 20 Z" />
    </svg>
  );
}

export function ShuffleIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h3.5l9 12H19" />
      <path d="M3 18h3.5l2.5-3.3" />
      <path d="M14 6h5" />
      <polyline points="16.5 3.5 19 6 16.5 8.5" />
      <polyline points="16.5 15.5 19 18 16.5 20.5" />
    </svg>
  );
}

export function RepeatIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function RepeatOneIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      <text x="12" y="16" fontSize="9" fontWeight="700" textAnchor="middle" stroke="none" fill="currentColor">
        1
      </text>
    </svg>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path
        d="M16.5 8.5a5 5 0 0 1 0 7"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}
