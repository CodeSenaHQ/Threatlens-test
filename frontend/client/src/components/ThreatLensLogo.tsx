import React from "react";

export interface ThreatLensLogoProps {
  className?: string;
  idPrefix?: string;
  height?: number | string;
  width?: number | string;
}

export function ThreatLensLogo({
  className = "h-7 w-auto",
  idPrefix = "tl",
  height,
  width,
}: ThreatLensLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 52"
      role="img"
      aria-label="ThreatLens logo — icon left"
      className={className}
      height={height}
      width={width}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        <linearGradient id={`${idPrefix}Grad`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="100%" stopColor="#4FACFE" />
        </linearGradient>
      </defs>
      {/* Geometric Emblem Icon on Left */}
      <polygon
        fill={`url(#${idPrefix}Grad)`}
        fillRule="evenodd"
        points="20,8 40,44 0,44 20,41 26.5,22.5 13.5,22.5"
      />
      {/* Brand Text on Right */}
      <text
        x="54"
        y="36"
        fontFamily="Inter, Futura, 'Segoe UI', system-ui, sans-serif"
        fontSize="30"
        fontWeight="800"
        letterSpacing="1.5"
        fill="#FFFFFF"
      >
        THREAT<tspan fill={`url(#${idPrefix}Grad)`}>LENS</tspan>
      </text>
    </svg>
  );
}

export default ThreatLensLogo;
