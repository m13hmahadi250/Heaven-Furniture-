import React from 'react';

/**
 * Lightweight SVG Skeleton Loader for CollectionsSnapshot Product Cards.
 * Employs native SVG hardware-accelerated gradients and architectural furniture wireframes
 * to ensure instant perceived performance during initial asset hydration without layout shifts.
 */
export const CollectionCardSkeleton: React.FC<{
  className?: string;
  variant?: 'card' | 'modal';
}> = ({ className = '', variant = 'card' }) => {
  const isModal = variant === 'modal';
  const viewBox = isModal ? "0 0 800 600" : "0 0 400 300";

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#0A0E0D] select-none flex items-center justify-center ${className}`}
      aria-label="Loading furniture asset..."
    >
      <svg
        className="w-full h-full block"
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Hardware-accelerated native SVG continuous shimmer */}
          <linearGradient id={`cardShimmer-${variant}`} x1="-100%" y1="0%" x2="200%" y2="0%">
            <stop offset="0%" stopColor="#0B1311" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#13231F" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#1E362F" stopOpacity="1" />
            <stop offset="65%" stopColor="#13231F" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0B1311" stopOpacity="0.8" />
            <animate
              attributeName="x1"
              from="-100%"
              to="100%"
              dur="2.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              from="0%"
              to="200%"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Accent Gold Pulse for Joinery Nodes */}
          <radialGradient id="amberGlowNode" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          {/* Blueprint subtle dot matrix pattern */}
          <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(245, 158, 11, 0.08)" />
          </pattern>
        </defs>

        {/* Base Blueprint Background */}
        <rect width="100%" height="100%" fill="#070C0B" />
        <rect width="100%" height="100%" fill="url(#dotGrid)" />

        {/* Shimmer Sweep Layer */}
        <rect width="100%" height="100%" fill={`url(#cardShimmer-${variant})`} opacity="0.6" />

        {/* Isometric Architectural Framing Lines */}
        <g stroke="rgba(245, 158, 11, 0.12)" strokeWidth="1" strokeDasharray="3 3">
          <line x1="20" y1="20" x2="380" y2="20" />
          <line x1="20" y1="280" x2="380" y2="280" />
          <line x1="20" y1="20" x2="20" y2="280" />
          <line x1="380" y1="20" x2="380" y2="280" />
        </g>

        {/* Stylized Architectural Wireframe of Luxury Furniture Chair / Table */}
        <g transform="translate(100, 50)" stroke="rgba(245, 158, 11, 0.28)" strokeWidth="1.5">
          {/* Chair Backrest Arch */}
          <path
            d="M 40 120 C 40 40, 160 40, 160 120 Z"
            fill="rgba(19, 35, 31, 0.4)"
            strokeDasharray="4 2"
          />
          {/* Tufting diamond guides */}
          <line x1="100" y1="50" x2="70" y2="100" stroke="rgba(245, 158, 11, 0.18)" />
          <line x1="100" y1="50" x2="130" y2="100" stroke="rgba(245, 158, 11, 0.18)" />
          <line x1="70" y1="100" x2="100" y2="120" stroke="rgba(245, 158, 11, 0.18)" />
          <line x1="130" y1="100" x2="100" y2="120" stroke="rgba(245, 158, 11, 0.18)" />

          {/* Seat Cushion Outline */}
          <path
            d="M 25 120 C 25 110, 175 110, 175 120 L 170 145 C 170 155, 30 155, 30 145 Z"
            fill="rgba(245, 158, 11, 0.08)"
            stroke="rgba(245, 158, 11, 0.4)"
          />

          {/* Solid Teak Tapered Legs */}
          <line x1="45" y1="150" x2="35" y2="200" stroke="rgba(245, 158, 11, 0.45)" strokeWidth="2.5" />
          <line x1="155" y1="150" x2="165" y2="200" stroke="rgba(245, 158, 11, 0.45)" strokeWidth="2.5" />
          <line x1="75" y1="150" x2="70" y2="188" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.5" />
          <line x1="125" y1="150" x2="130" y2="188" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.5" />

          {/* Brass Ferrules Gold Tips */}
          <rect x="33" y="194" width="4" height="6" fill="#F59E0B" />
          <rect x="163" y="194" width="4" height="6" fill="#F59E0B" />
        </g>

        {/* Center Calibrating Crosshair */}
        <g transform="translate(200, 150)" stroke="#F59E0B" strokeWidth="1" opacity="0.4">
          <line x1="-12" y1="0" x2="12" y2="0" />
          <line x1="0" y1="-12" x2="0" y2="12" />
          <circle cx="0" cy="0" r="4" fill="none" />
        </g>

        {/* Top-Left Simulated Category Pill Skeleton */}
        <rect x="24" y="24" width="90" height="22" rx="11" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.15)" />

        {/* Top-Right Simulated Action Buttons Skeleton */}
        <rect x="300" y="24" width="48" height="22" rx="11" fill="rgba(245, 158, 11, 0.15)" stroke="rgba(245, 158, 11, 0.3)" />
        <circle cx="365" cy="35" r="11" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.15)" />

        {/* Bottom Corner Lead-Time Pill Skeleton */}
        <rect x="290" y="254" width="86" height="20" rx="10" fill="rgba(0, 0, 0, 0.5)" stroke="rgba(255, 255, 255, 0.1)" />

        {/* Bottom Technical Spec Label */}
        <text
          x="28"
          y="268"
          fill="rgba(245, 158, 11, 0.5)"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="1.5"
        >
          PREPARING MASTERPIECE...
        </text>
      </svg>
    </div>
  );
};

/**
 * Lightweight SVG Skeleton Loader for BespokeStudio3D Viewport.
 * Displays an architectural 3D wireframe perspective with isometric coordinates,
 * calibrating focal reticle, and smooth ambient status indicator while WebGL compiles.
 */
export const Studio3DViewportSkeleton: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#060B0A] select-none flex items-center justify-center ${className}`}
      aria-label="Hydrating 3D Studio Stage..."
    >
      <svg
        className="w-full h-full block"
        viewBox="0 0 800 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Ambient Studio Shimmer Sweep */}
          <linearGradient id="studioSweep" x1="-100%" y1="-50%" x2="200%" y2="150%">
            <stop offset="0%" stopColor="#050C0A" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#0E1A17" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#1A312B" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#0E1A17" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#050C0A" stopOpacity="0.9" />
            <animate
              attributeName="x1"
              from="-100%"
              to="100%"
              dur="2.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              from="0%"
              to="200%"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Perspective Floor Grid Pattern */}
          <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Base Studio Deep Canvas */}
        <rect width="100%" height="100%" fill="#050C0A" />

        {/* Atmospheric Radial Fill */}
        <circle cx="400" cy="260" r="360" fill="rgba(245, 158, 11, 0.04)" />

        {/* Dynamic Sweep Light */}
        <rect width="100%" height="100%" fill="url(#studioSweep)" opacity="0.65" />

        {/* Studio Ground Perspective Grid */}
        <g stroke="url(#gridFade)" strokeWidth="1.2">
          {/* Radiating Vanishing Lines from horizon */}
          <line x1="400" y1="260" x2="40" y2="490" />
          <line x1="400" y1="260" x2="160" y2="490" />
          <line x1="400" y1="260" x2="280" y2="490" />
          <line x1="400" y1="260" x2="400" y2="490" />
          <line x1="400" y1="260" x2="520" y2="490" />
          <line x1="400" y1="260" x2="640" y2="490" />
          <line x1="400" y1="260" x2="760" y2="490" />

          {/* Concentric Ground Ellipses */}
          <ellipse cx="400" cy="380" rx="340" ry="90" fill="none" strokeDasharray="6 4" />
          <ellipse cx="400" cy="380" rx="220" ry="58" fill="none" />
          <ellipse cx="400" cy="380" rx="110" ry="28" fill="none" strokeDasharray="3 3" />
        </g>

        {/* Isometric 3D Bounding Box Furniture Armature */}
        <g transform="translate(400, 250)" stroke="#F59E0B" strokeWidth="1.6">
          {/* Top Isometric Face */}
          <polygon
            points="0,-100 120,-40 0,20 -120,-40"
            fill="rgba(245, 158, 11, 0.06)"
            stroke="rgba(245, 158, 11, 0.55)"
          />

          {/* Left Isometric Face */}
          <polygon
            points="-120,-40 0,20 0,110 -120,50"
            fill="rgba(19, 35, 31, 0.45)"
            stroke="rgba(245, 158, 11, 0.4)"
          />

          {/* Right Isometric Face */}
          <polygon
            points="0,20 120,-40 120,50 0,110"
            fill="rgba(19, 35, 31, 0.25)"
            stroke="rgba(245, 158, 11, 0.4)"
          />

          {/* Internal Hidden Joinery Axis Lines (dashed) */}
          <line x1="0" y1="-100" x2="0" y2="-10" stroke="rgba(245, 158, 11, 0.25)" strokeDasharray="4 3" />
          <line x1="-120" y1="50" x2="0" y2="-10" stroke="rgba(245, 158, 11, 0.25)" strokeDasharray="4 3" />
          <line x1="120" y1="50" x2="0" y2="-10" stroke="rgba(245, 158, 11, 0.25)" strokeDasharray="4 3" />

          {/* 3D Corner Vertex Anchor Points */}
          <circle cx="0" cy="-100" r="3.5" fill="#F59E0B" />
          <circle cx="120" cy="-40" r="3.5" fill="#F59E0B" />
          <circle cx="-120" cy="-40" r="3.5" fill="#F59E0B" />
          <circle cx="0" cy="20" r="4" fill="#F59E0B" />
          <circle cx="0" cy="110" r="3.5" fill="#F59E0B" />
          <circle cx="-120" cy="50" r="3.5" fill="#F59E0B" />
          <circle cx="120" cy="50" r="3.5" fill="#F59E0B" />
        </g>

        {/* Precision Dimension Line Callouts */}
        <g stroke="rgba(245, 158, 11, 0.6)" strokeWidth="1" strokeDasharray="2 2">
          {/* Width Dimension Guide */}
          <line x1="260" y1="380" x2="260" y2="400" />
          <line x1="540" y1="380" x2="540" y2="400" />
          <line x1="260" y1="390" x2="540" y2="390" strokeDasharray="none" />
          <text
            x="400"
            y="404"
            textAnchor="middle"
            fill="rgba(245, 158, 11, 0.85)"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            SCALE: BESPOKE 1:1 CALIBRATION
          </text>
        </g>

        {/* Studio Coordinate Axis Marker (Bottom Left) */}
        <g transform="translate(48, 460)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5">
          <line x1="0" y1="0" x2="35" y2="0" stroke="#F59E0B" />
          <line x1="0" y1="0" x2="0" y2="-35" stroke="#38BDF8" />
          <line x1="0" y1="0" x2="-18" y2="15" stroke="#34D399" />
          <text x="40" y="4" fill="#F59E0B" fontSize="9" fontFamily="monospace" fontWeight="bold">X</text>
          <text x="-4" y="-40" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">Y</text>
          <text x="-28" y="24" fill="#34D399" fontSize="9" fontFamily="monospace" fontWeight="bold">Z</text>
        </g>

        {/* Center Calibrating Optical Reticle */}
        <g transform="translate(400, 260)" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="1">
          <circle cx="0" cy="0" r="28" fill="none" strokeDasharray="3 3" />
          <line x1="-38" y1="0" x2="-12" y2="0" />
          <line x1="12" y1="0" x2="38" y2="0" />
          <line x1="0" y1="-38" x2="0" y2="-12" />
          <line x1="0" y1="12" x2="0" y2="38" />
        </g>

        {/* Status HUD Badge (Centered) */}
        <g transform="translate(400, 48)">
          <rect
            x="-160"
            y="-14"
            width="320"
            height="28"
            rx="14"
            fill="rgba(3, 8, 7, 0.85)"
            stroke="rgba(245, 158, 11, 0.35)"
          />
          {/* Animated Pulsing Amber Indicator */}
          <circle cx="-135" cy="0" r="4.5" fill="#F59E0B">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="r" values="3.5;5;3.5" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <text
            x="8"
            y="4"
            textAnchor="middle"
            fill="#F5F5F5"
            fontSize="10"
            fontFamily="Outfit, sans-serif"
            fontWeight="bold"
            letterSpacing="1.8"
          >
            HYDRATING 3D BESPOKE ENVIRONMENT
          </text>
        </g>
      </svg>
    </div>
  );
};
