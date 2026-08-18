import React from "react";

export function ThreatLensLogo({
  className = "h-7 w-auto",
  idPrefix = "tl",
  showBadge = true,
  showText = true,
  iconOnly = false,
  height,
  width,
}) {
  const gradId = `${idPrefix}-emblem-grad`;
  const glowId = `${idPrefix}-glow`;
  const accentGradId = `${idPrefix}-accent-grad`;

  const EmblemIcon = (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-auto aspect-square shrink-0"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 0 10px rgba(0, 242, 254, 0.35))" }}
    >
      <defs>
        {/* Main Neon Prism Gradient */}
        <linearGradient id={gradId} x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="45%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Secondary Deep Azure Gradient */}
        <linearGradient id={accentGradId} x1="22" y1="8" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
        </linearGradient>

        {/* Outer Glow Filter */}
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Hexagonal Shield Frame */}
      <path
        d="M22 3.5L38.5 13V31L22 40.5L5.5 31V13L22 3.5Z"
        fill="#070c18"
        stroke={`url(#${gradId})`}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      {/* Faceted Top-Right Shard */}
      <path
        d="M22 3.5L38.5 13L28.5 22L22 15V3.5Z"
        fill={`url(#${accentGradId})`}
        opacity="0.85"
      />

      {/* Faceted Left Shard */}
      <path
        d="M5.5 13L22 3.5V15L12 24.5L5.5 13Z"
        fill={`url(#${gradId})`}
        opacity="0.9"
      />

      {/* Bottom Anchor Facet */}
      <path
        d="M22 40.5L5.5 31L16 26L22 30L28 26L38.5 31L22 40.5Z"
        fill="#0a162e"
        stroke={`url(#${gradId})`}
        strokeWidth="1"
        opacity="0.9"
      />

      {/* Central Cyber Diamond Lens Core */}
      <polygon
        points="22,12 30,22 22,32 14,22"
        fill="#040814"
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
      />

      {/* Focal Lens Aperture Star / Ray */}
      <circle cx="22" cy="22" r="3" fill="#00F2FE" filter={`url(#${glowId})`} />
      <circle cx="22" cy="22" r="1.5" fill="#FFFFFF" />

      {/* Precision Lens Scan Line */}
      <line x1="8" y1="22" x2="36" y2="22" stroke="#00F2FE" strokeWidth="0.75" strokeDasharray="1.5 2" opacity="0.65" />
    </svg>
  );

  if (iconOnly || !showText) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} style={{ height, width }}>
        {EmblemIcon}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      style={{ height, width }}
      role="img"
      aria-label="ThreatLens AI"
    >
      {EmblemIcon}
      <span className="flex items-center tracking-tight font-['Plus_Jakarta_Sans','Sora','Inter',sans-serif] leading-none">
        <span className="font-extrabold text-[1.125rem] text-white tracking-[-0.03em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          Threat
        </span>
        <span className="font-extrabold text-[1.125rem] bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#60A5FA] bg-clip-text text-transparent tracking-[-0.03em] drop-shadow-[0_0_12px_rgba(0,242,254,0.3)]">
          Lens
        </span>
        {showBadge && (
          <span className="ml-1.5 px-1.5 py-0.5 rounded-[4px] text-[9px] font-mono font-bold tracking-wider uppercase bg-[#1e3cff]/20 text-[#38bdf8] border border-[#38bdf8]/35 shadow-[0_0_8px_rgba(56,189,248,0.25)]">
            AI
          </span>
        )}
      </span>
    </span>
  );
}

export default ThreatLensLogo;

