import React from "react";

/**
 * OnboardingIcons
 * ---------------------------------------------------------------
 * Inline-SVG icon set used by the onboarding option cards.
 *
 *  - All icons live on a 24×24 viewBox and use `currentColor` so
 *    they pick up the parent's text color (purple by default,
 *    deep purple when the option is selected).
 *  - For icons with cut-outs (windows, dots, etc.) use the
 *    className "ob-icon-cut" — the matching CSS rule paints
 *    those shapes the same colour as the option's icon tile so
 *    they look like punched-out holes.
 *
 * Add or change icons by editing the ICONS map below. Each entry
 * is a React fragment that gets dropped inside the <svg>.
 * ---------------------------------------------------------------
 */

const ICONS = {
  /* ----- Q1: Content type ----- */
  "video-camera": (
    <>
      <rect x="2" y="7" width="13.5" height="10" rx="2" />
      <path d="M15.5 10.5 L22 7 V17 L15.5 13.5 Z" />
    </>
  ),
  utensils: (
    <>
      <path d="M5 2 v6 h1 V2 h1 v6 h1 V2 h1 v7 c0 1.2 -.6 2 -1.5 2.3 L7 22 H6 L5.5 11.3 C4.6 11 4 10.2 4 9 V2 Z" />
      <path d="M17 2 c-1.8 0 -3 1.6 -3 3.8 0 1.6 .8 2.8 2 3.2 L15.5 22 h1 L17 9 c1.2 -.4 2 -1.6 2 -3.2 C19 3.6 18 2 17 2 Z" />
    </>
  ),
  bed: (
    <>
      <path d="M2 9 v13 h2 v-3 h16 v3 h2 v-7 c0 -2 -1.8 -3.5 -4 -3.5 h-9 c-3 0 -4 -1 -7 -2.5 Z" />
      <rect className="ob-icon-cut" x="5.5" y="11.5" width="4.5" height="2.5" rx="0.6" />
    </>
  ),
  temple: (
    <>
      <path d="M12 2 L22 8 L2 8 Z" />
      <rect x="3" y="9" width="2" height="9" />
      <rect x="8" y="9" width="2" height="9" />
      <rect x="14" y="9" width="2" height="9" />
      <rect x="19" y="9" width="2" height="9" />
      <rect x="1.5" y="19" width="21" height="2.4" />
    </>
  ),
  mountains: (
    <>
      <circle cx="18.5" cy="6" r="2.2" />
      <path d="M2 21 L9 8 L14 16 L18 12 L22 21 Z" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 2 L13.6 7.4 L19 9 L13.6 10.6 L12 16 L10.4 10.6 L5 9 L10.4 7.4 Z" />
      <path d="M5 14 L5.9 16.1 L8 17 L5.9 17.9 L5 20 L4.1 17.9 L2 17 L4.1 16.1 Z" />
      <path d="M19 13.5 L19.7 15.3 L21.5 16 L19.7 16.7 L19 18.5 L18.3 16.7 L16.5 16 L18.3 15.3 Z" />
    </>
  ),

  /* ----- Q2: Location ----- */
  city: (
    <>
      <rect x="2" y="11" width="6" height="11" />
      <rect x="9" y="5" width="7" height="17" />
      <rect x="17" y="13" width="5" height="9" />
      <rect className="ob-icon-cut" x="3.5" y="13" width="1.2" height="1.5" />
      <rect className="ob-icon-cut" x="5.5" y="13" width="1.2" height="1.5" />
      <rect className="ob-icon-cut" x="3.5" y="16" width="1.2" height="1.5" />
      <rect className="ob-icon-cut" x="5.5" y="16" width="1.2" height="1.5" />
      <rect className="ob-icon-cut" x="10.5" y="8" width="1.4" height="1.7" />
      <rect className="ob-icon-cut" x="13" y="8" width="1.4" height="1.7" />
      <rect className="ob-icon-cut" x="10.5" y="11.5" width="1.4" height="1.7" />
      <rect className="ob-icon-cut" x="13" y="11.5" width="1.4" height="1.7" />
      <rect className="ob-icon-cut" x="18.3" y="15.5" width="1.2" height="1.5" />
    </>
  ),
  "water-wave": (
    <g
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    >
      <path d="M2 8 Q5.5 5 9 8 T16 8 T22 8" />
      <path d="M2 14 Q5.5 11 9 14 T16 14 T22 14" />
      <path d="M2 20 Q5.5 17 9 20 T16 20 T22 20" />
    </g>
  ),
  "mountain-range": (
    <path d="M1 21 L5 12 L8.5 17 L12.5 8 L16.5 15 L19.5 12 L23 21 Z" />
  ),
  globe: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9.5" />
      <ellipse cx="12" cy="12" rx="3.8" ry="9.5" />
      <line x1="2.5" y1="12" x2="21.5" y2="12" />
    </g>
  ),
  dice: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3.5" />
      <circle className="ob-icon-cut" cx="8" cy="8" r="1.6" />
      <circle className="ob-icon-cut" cx="16" cy="8" r="1.6" />
      <circle className="ob-icon-cut" cx="12" cy="12" r="1.6" />
      <circle className="ob-icon-cut" cx="8" cy="16" r="1.6" />
      <circle className="ob-icon-cut" cx="16" cy="16" r="1.6" />
    </>
  ),

  /* ----- Q3: Travel style ----- */
  backpack: (
    <>
      <path d="M8.5 2 c-1.8 0 -3 1.2 -3 3 v2 H4 c-1 0 -2 1 -2 2 v11 c0 1 1 2 2 2 h16 c1 0 2 -1 2 -2 V9 c0 -1 -1 -2 -2 -2 h-1.5 V5 c0 -1.8 -1.2 -3 -3 -3 H8.5 Z" />
      <path
        d="M10 2 v2 h4 V2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect className="ob-icon-cut" x="6" y="11.5" width="12" height="4" rx="1" />
      <rect className="ob-icon-cut" x="10" y="13" width="4" height="1.2" />
    </>
  ),
  diamond: (
    <>
      <path d="M2 9 L6 3 L18 3 L22 9 L12 22 Z" />
      <path
        d="M2 9 L22 9 M6 3 L12 9 L18 3 M12 9 L12 22"
        stroke="white"
        strokeOpacity="0.18"
        strokeWidth="0.9"
        fill="none"
      />
    </>
  ),
  search: (
    <g fill="none" stroke="currentColor" strokeLinecap="round">
      <circle cx="10" cy="10" r="6.5" strokeWidth="2.4" />
      <line x1="15" y1="15" x2="21" y2="21" strokeWidth="2.6" />
    </g>
  ),
  bowl: (
    <>
      <path d="M2 11 c0 5.5 4.5 10 10 10 s10 -4.5 10 -10 H2 Z" />
      <path
        d="M7 7 c0 -2 2 -2 2 -4 m3 4 c0 -2 2 -2 2 -4 m3 4 c0 -2 2 -2 2 -4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  mask: (
    <>
      <path d="M5 4 c0 10 3 16 7 16 s7 -6 7 -16 c-3 -1.5 -11 -1.5 -14 0 Z" />
      <ellipse className="ob-icon-cut" cx="9" cy="9" rx="1.2" ry="1.8" />
      <ellipse className="ob-icon-cut" cx="15" cy="9" rx="1.2" ry="1.8" />
      <path className="ob-icon-cut" d="M9 14 q3 2 6 0 q-3 0.5 -6 0 Z" />
    </>
  ),
  parachute: (
    <>
      <path d="M2 11 C2 5 6 2 12 2 s10 3 10 9 Z" />
      <g
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      >
        <line x1="2" y1="11" x2="12" y2="21" />
        <line x1="22" y1="11" x2="12" y2="21" />
        <line x1="8" y1="11" x2="12" y2="21" />
        <line x1="16" y1="11" x2="12" y2="21" />
      </g>
    </>
  ),

  /* ----- Q4: Platforms ----- */
  "music-note": (
    <>
      <path d="M9 4 v12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="7" cy="17" r="3" />
      <path d="M9 4 q6 1 9 -1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="15" r="2.4" />
      <path d="M18 14 V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  "camera-square": (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none" />
    </g>
  ),
  "play-vertical": (
    <>
      <rect
        x="6"
        y="2"
        width="12"
        height="20"
        rx="2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M10.5 8 L16 12 L10.5 16 Z" />
    </>
  ),
  "play-horizontal": (
    <>
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M10 9 L16 12 L10 15 Z" />
    </>
  ),
  document: (
    <>
      <path d="M5 2 H13 L19 8 V22 H5 Z" />
      <path
        d="M13 2 V8 H19"
        fill="none"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="0.8"
      />
      <rect className="ob-icon-cut" x="8" y="11" width="8" height="1.2" rx="0.4" />
      <rect className="ob-icon-cut" x="8" y="14" width="8" height="1.2" rx="0.4" />
      <rect className="ob-icon-cut" x="8" y="17" width="6" height="1.2" rx="0.4" />
    </>
  ),

  /* ----- Q5: Stop scrolling ----- */
  palm: (
    <>
      <rect x="11" y="10" width="2" height="12" rx="0.8" />
      <path d="M12 3 C5 4 2 8 3 10 C6 8 9 8 12 9 Z" />
      <path d="M12 3 C19 4 22 8 21 10 C18 8 15 8 12 9 Z" />
      <path d="M12 3 C8 7 8 12 11 13 C12 9 12 6 12 3 Z" />
      <path d="M12 3 C16 7 16 12 13 13 C12 9 12 6 12 3 Z" />
    </>
  ),
  pizza: (
    <>
      <path d="M3 4 L12 22 L21 4 Q12 3 3 4 Z" />
      <circle className="ob-icon-cut" cx="9.5" cy="9" r="1.4" />
      <circle className="ob-icon-cut" cx="14.5" cy="9" r="1.4" />
      <circle className="ob-icon-cut" cx="12" cy="15" r="1.4" />
    </>
  ),
  key: (
    <g fill="none">
      <circle cx="7" cy="12" r="4" fill="currentColor" />
      <circle cx="7" cy="12" r="1.5" className="ob-icon-cut" />
      <path d="M11 12 H22 V14.5 H19.5 V17 H17.5 V14.5 H11 Z" fill="currentColor" />
    </g>
  ),
  lightning: (
    <path d="M13 2 L4 14 H11 L9 22 L20 9 H13 Z" />
  ),
  palette: (
    <>
      <path d="M12 3 C6.5 3 2 7 2 12.5 C2 17.5 6 21 11 21 c1.6 0 2.2 -1.6 1 -2.8 c-.8 -.8 -.8 -2.4 .8 -2.4 H17 C20 15.8 22 13.5 22 11 C22 6.5 18 3 12 3 Z" />
      <circle className="ob-icon-cut" cx="7" cy="11" r="1.4" />
      <circle className="ob-icon-cut" cx="10" cy="7" r="1.4" />
      <circle className="ob-icon-cut" cx="14" cy="7" r="1.4" />
      <circle className="ob-icon-cut" cx="17" cy="11" r="1.4" />
    </>
  ),
  champagne: (
    <>
      <path d="M9 2 H15 L14 12 c0 1.8 -.9 3 -2 3 s-2 -1.2 -2 -3 Z" />
      <rect x="11.4" y="14.8" width="1.2" height="6.4" />
      <rect x="8.5" y="20.6" width="7" height="1.4" rx="0.5" />
      <circle className="ob-icon-cut" cx="11" cy="6" r="0.5" />
      <circle className="ob-icon-cut" cx="13" cy="8" r="0.5" />
      <circle className="ob-icon-cut" cx="12" cy="10" r="0.5" />
    </>
  ),
  laugh: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path
        d="M7.5 10 q1.5 -2.5 3 0 M13.5 10 q1.5 -2.5 3 0"
        fill="none"
        stroke="white"
        strokeOpacity="0"
      />
      <path
        d="M7.5 9.5 q1.5 -2.5 3 0 M13.5 9.5 q1.5 -2.5 3 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="0"
      />
      <path className="ob-icon-cut" d="M6.5 9.5 Q9 5 11 9.5 Q9 8 6.5 9.5 Z" />
      <path className="ob-icon-cut" d="M13 9.5 Q15.5 5 17.5 9.5 Q15.5 8 13 9.5 Z" />
      <path className="ob-icon-cut" d="M7 13 C8.5 18 15.5 18 17 13 Q12 16 7 13 Z" />
    </>
  ),
};

export default function OptionIcon({ name }) {
  const content = ICONS[name];
  return (
    <svg
      className="onboarding-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {content || <circle cx="12" cy="12" r="5" />}
    </svg>
  );
}

export { ICONS };
