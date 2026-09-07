import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --------------------------------------------------------------------------
// 1. High-Performance Zero-Allocation Global Scroll Tracker (120Hz)
// --------------------------------------------------------------------------
export const scrollState = {
  progress: 0,              // Global normalized scroll progress (0 to 1)
  targetProgress: 0,        // Target global scroll progress
  sectionProgress: 0,       // Damped continuous section index (0.0 to 6.0)
  targetSectionProgress: 0, // Target continuous section index
  isListening: false,
};

export const onLenisScrollUpdate = (progress: number) => {
  scrollState.targetProgress = Math.min(Math.max(progress, 0), 1);
  updateSectionProgress();
};

const SECTION_IDS = [
  'section-hero',          // 0: Signature Lounge Chair
  'section-craftsmanship', // 1: Sleek Coffee Table (glide from top)
  'section-studio',        // 2: Exploded Joinery / Customizable Table Piece
  'section-dining',        // 3: Multi-Piece Luxury Dining Set (slide from sides)
  'why-heaven',            // 4: Executive Desk Setup (spinning on axis)
  'section-showroom',      // 5: Architectural Showroom Podium
  'footer',                // 6: Floating Golden Monogram Crest
];

const updateSectionProgress = () => {
  if (typeof window === 'undefined') return;

  const viewportHeight = window.innerHeight || 800;
  const viewportCenter = window.scrollY + viewportHeight * 0.5;

  const sectionElements = SECTION_IDS.map((id) => document.getElementById(id));
  const validElements = sectionElements.filter(Boolean) as HTMLElement[];

  if (validElements.length < 2) {
    // Fallback based on global page scroll
    const maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
    const p = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    scrollState.targetSectionProgress = p * (SECTION_IDS.length - 1);
    scrollState.targetProgress = p;
    return;
  }

  // Calculate center offsets of each section
  const sectionCenters: number[] = sectionElements.map((el, idx) => {
    if (!el) {
      // Approximate position if element temporarily not in DOM
      const maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      return (idx / (SECTION_IDS.length - 1)) * maxScroll + viewportHeight * 0.5;
    }
    const rect = el.getBoundingClientRect();
    return window.scrollY + rect.top + rect.height * 0.5;
  });

  // Find where viewport center falls between section centers
  if (viewportCenter <= sectionCenters[0]) {
    scrollState.targetSectionProgress = 0;
  } else if (viewportCenter >= sectionCenters[sectionCenters.length - 1]) {
    scrollState.targetSectionProgress = sectionCenters.length - 1;
  } else {
    for (let i = 0; i < sectionCenters.length - 1; i++) {
      const c1 = sectionCenters[i];
      const c2 = sectionCenters[i + 1];
      if (viewportCenter >= c1 && viewportCenter <= c2) {
        const span = Math.max(c2 - c1, 1);
        const fraction = (viewportCenter - c1) / span;
        scrollState.targetSectionProgress = i + fraction;
        break;
      }
    }
  }

  const maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
  scrollState.targetProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
};

const initScrollListener = () => {
  if (typeof window === 'undefined' || scrollState.isListening) return;
  scrollState.isListening = true;
  updateSectionProgress();

  window.addEventListener('scroll', updateSectionProgress, { passive: true });
  window.addEventListener('resize', updateSectionProgress, { passive: true });
};

// --------------------------------------------------------------------------
// 2. Section Atmospheric Color & Illumination Palettes
// Seamless ambient transitions per section (Deep Charcoal-Teal -> Warm Teak Brown -> Deep Bone White -> Slate)
// --------------------------------------------------------------------------
export interface SectionPalette {
  name: string;
  bgHex: string;
  fogHex: string;
  ambientHex: string;
  ambientIntensity: number;
  keyLightHex: string;
  keyIntensity: number;
  rimLightHex: string;
  rimIntensity: number;
}

export const SECTION_PALETTES: SectionPalette[] = [
  // 0: Hero Section - Deep Charcoal-Teal & Gold
  {
    name: 'Hero',
    bgHex: '#071214',
    fogHex: '#050E0F',
    ambientHex: '#99D5D0',
    ambientIntensity: 0.85,
    keyLightHex: '#FFF0D4',
    keyIntensity: 2.6,
    rimLightHex: '#2DD4BF',
    rimIntensity: 1.8,
  },
  // 1: Brand Story / Philosophy - Warm Teak Brown & Amber
  {
    name: 'Brand Story',
    bgHex: '#140D07',
    fogHex: '#0D0804',
    ambientHex: '#FDE68A',
    ambientIntensity: 0.95,
    keyLightHex: '#FFF2DA',
    keyIntensity: 2.4,
    rimLightHex: '#F59E0B',
    rimIntensity: 2.2,
  },
  // 2: Bespoke Studio - Deep Bone White & CAD Blueprint Slate
  {
    name: 'Bespoke Studio',
    bgHex: '#0B0F15',
    fogHex: '#070A0F',
    ambientHex: '#E2E8F0',
    ambientIntensity: 1.05,
    keyLightHex: '#FFFFFF',
    keyIntensity: 2.8,
    rimLightHex: '#93C5FD',
    rimIntensity: 1.7,
  },
  // 3: Collections Snapshot - Rich Warm Amber Teak & Salon Gold
  {
    name: 'Collections',
    bgHex: '#160F06',
    fogHex: '#0F0A04',
    ambientHex: '#FCD34D',
    ambientIntensity: 1.0,
    keyLightHex: '#FFF4DE',
    keyIntensity: 2.5,
    rimLightHex: '#F59E0B',
    rimIntensity: 2.3,
  },
  // 4: Why Choose Heaven - Executive Slate & Champagne Gold
  {
    name: 'Why Choose Heaven',
    bgHex: '#0A0E13',
    fogHex: '#06090D',
    ambientHex: '#CBD5E1',
    ambientIntensity: 0.9,
    keyLightHex: '#FFE8C2',
    keyIntensity: 2.3,
    rimLightHex: '#D4AF37',
    rimIntensity: 2.0,
  },
  // 5: Showroom Experience - Architectural Museum Warm Stone & Bone
  {
    name: 'Showroom',
    bgHex: '#13100D',
    fogHex: '#0C0A08',
    ambientHex: '#FAF5EE',
    ambientIntensity: 1.1,
    keyLightHex: '#FFF2DD',
    keyIntensity: 2.6,
    rimLightHex: '#E5C158',
    rimIntensity: 1.9,
  },
  // 6: Final CTA & Footer - Royal Golden Obsidian
  {
    name: 'Final CTA',
    bgHex: '#120D04',
    fogHex: '#0A0702',
    ambientHex: '#FBBF24',
    ambientIntensity: 1.25,
    keyLightHex: '#FFF6D6',
    keyIntensity: 2.9,
    rimLightHex: '#F59E0B',
    rimIntensity: 2.7,
  },
];

// Helper to smoothly interpolate opacity and visibility across a group's meshes
function applyGroupOpacity(group: THREE.Group | null, opacity: number) {
  if (!group) return;
  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  group.visible = clampedOpacity > 0.005;
  if (!group.visible) return;

  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
      const mat = (child as THREE.Mesh).material as THREE.Material | THREE.Material[];
      if (Array.isArray(mat)) {
        mat.forEach((m) => {
          m.transparent = true;
          const base = (m.userData.baseOpacity as number) ?? 1.0;
          m.opacity = base * clampedOpacity;
        });
      } else {
        mat.transparent = true;
        const base = (mat.userData.baseOpacity as number) ?? 1.0;
        mat.opacity = base * clampedOpacity;
      }
    }
  });
}

// --------------------------------------------------------------------------
// 3. Section 0: Signature Lounge Chair (Hero Section)
// Smoothly rotating and floating, then gracefully exits upward on scroll
// --------------------------------------------------------------------------
const HeroLoungeChair: React.FC<{ progress: number }> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const diff = progress - 0.0;
    const focus = Math.max(0, 1 - Math.abs(diff) * 1.3);

    // Opacity fade when transitioning to Section 1
    applyGroupOpacity(groupRef.current, focus);
    if (!groupRef.current.visible) return;

    // Organic floating physics
    const floatY = Math.sin(time * 1.1) * 0.08;
    const floatRotZ = Math.cos(time * 0.8) * 0.015;

    // Exit upward as scroll moves past Hero
    const exitY = diff * 3.6;
    const exitRotX = diff * 0.45;
    const exitRotY = diff * 1.8;

    const isMobile = state.size.width < 768;
    const baseX = isMobile ? 0 : 1.2;

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      baseX + state.pointer.x * 0.25,
      6.0,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      -0.2 + floatY + exitY - state.pointer.y * 0.15,
      6.0,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      -0.2 - diff * 0.8,
      6.0,
      delta
    );

    // Stately rotation around Y-axis
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      -0.45 + time * 0.3 + exitRotY + state.pointer.x * 0.3,
      6.0,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      0.08 + exitRotX - state.pointer.y * 0.15,
      6.0,
      delta
    );
    groupRef.current.rotation.z = floatRotZ;

    const scale = THREE.MathUtils.lerp(1.15, 0.85, Math.max(0, diff));
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef} position={[1.2, -0.2, -0.2]}>
      {/* Wooden Frame Base Shell */}
      <mesh position={[0, -0.12, 0.05]}>
        <boxGeometry args={[1.65, 0.14, 1.55]} />
        <meshStandardMaterial color="#382113" roughness={0.34} metalness={0.05} />
      </mesh>

      {/* Deep Plush Seat Cushion - Emerald Italian Velvet */}
      <mesh position={[0, 0.1, 0.08]}>
        <boxGeometry args={[1.5, 0.32, 1.4]} />
        <meshStandardMaterial color="#16332A" roughness={0.82} metalness={0.02} />
      </mesh>

      {/* Contoured Ergonomic Backrest Frame */}
      <mesh position={[0, 0.72, -0.6]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[1.55, 1.15, 0.14]} />
        <meshStandardMaterial color="#382113" roughness={0.34} metalness={0.05} />
      </mesh>

      {/* Tufted Backrest Cushion */}
      <mesh position={[0, 0.74, -0.52]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[1.4, 1.05, 0.22]} />
        <meshStandardMaterial color="#16332A" roughness={0.82} metalness={0.02} />
      </mesh>

      {/* Sculpted Wooden Armrests */}
      <mesh position={[-0.82, 0.42, 0.05]}>
        <boxGeometry args={[0.12, 0.08, 1.45]} />
        <meshStandardMaterial color="#382113" roughness={0.34} />
      </mesh>
      <mesh position={[0.82, 0.42, 0.05]}>
        <boxGeometry args={[0.12, 0.08, 1.45]} />
        <meshStandardMaterial color="#382113" roughness={0.34} />
      </mesh>

      {/* 4 Splayed Legs with 24K Polished Brass Ferrules */}
      {[
        [-0.68, -0.55, 0.62, 0.12, -0.12],
        [0.68, -0.55, 0.62, 0.12, 0.12],
        [-0.68, -0.55, -0.58, -0.15, -0.12],
        [0.68, -0.55, -0.58, -0.15, 0.12],
      ].map(([x, y, z, rx, rz], idx) => (
        <group key={idx} position={[x, y, z]} rotation={[rx, 0, rz]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.045, 0.035, 0.7, 16]} />
            <meshStandardMaterial color="#2B180D" roughness={0.4} />
          </mesh>
          {/* Brass Tip Ferrule */}
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.036, 0.032, 0.14, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.18} />
          </mesh>
        </group>
      ))}

      {/* Subtle Ground Ambient Contact Shadow */}
      <mesh position={[0, -0.92, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial color="#020504" transparent opacity={0.65} />
      </mesh>
    </group>
  );
};

// --------------------------------------------------------------------------
// 4. Section 1: Sleek Luxury Coffee Table (Brand Story / Philosophy)
// Glides in smoothly from the top with subtle physics, then glides downward
// --------------------------------------------------------------------------
const BrandStoryCoffeeTable: React.FC<{ progress: number }> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const diff = progress - 1.0;
    const focus = Math.max(0, 1 - Math.abs(diff) * 1.3);

    applyGroupOpacity(groupRef.current, focus);
    if (!groupRef.current.visible) return;

    // Glides in from top when diff < 0, exits down when diff > 0
    const enterY = diff < 0 ? -diff * 4.8 : 0;
    const exitY = diff > 0 ? -diff * 4.5 : 0;
    const bobY = Math.sin(time * 1.4) * 0.06;

    const isMobile = state.size.width < 768;
    const baseX = isMobile ? 0 : 0.95;

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      baseX + state.pointer.x * 0.22,
      6.0,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      -0.35 + enterY + exitY + bobY - state.pointer.y * 0.14,
      6.0,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      -0.3 - Math.abs(diff) * 0.6,
      6.0,
      delta
    );

    // Smooth rotational sway
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      time * 0.22 + state.pointer.x * 0.25 + diff * 0.8,
      5.0,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      0.18 - state.pointer.y * 0.12,
      5.0,
      delta
    );

    const scale = THREE.MathUtils.lerp(1.1, 0.9, Math.abs(diff));
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef} position={[0.95, -0.35, -0.3]}>
      {/* Italian Carrara Polished Marble Tabletop Disc */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[1.42, 1.42, 0.09, 54]} />
        <meshStandardMaterial color="#F4EFE8" roughness={0.16} metalness={0.04} />
      </mesh>

      {/* 24K Brushed Brass Outer Rim Ring */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[1.44, 1.44, 0.094, 54]} />
        <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.2} />
      </mesh>

      {/* Fluted Seasoned Chittagong Teak Pedestal Column */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.52, 0.6, 0.78, 36]} />
        <meshStandardMaterial color="#3E2415" roughness={0.38} metalness={0.04} />
      </mesh>

      {/* Lower Brass Stepped Plinth Base */}
      <mesh position={[0, -0.46, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.07, 40]} />
        <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.2} />
      </mesh>

      {/* Decorative Centerpiece Tray on Tabletop */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.38, 0.32, 0.04, 32]} />
        <meshStandardMaterial color="#1E140D" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.47, 0]}>
        <torusGeometry args={[0.22, 0.03, 16, 32]} />
        <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* Floor Contact Shadow */}
      <mesh position={[0, -0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#050302" transparent opacity={0.65} />
      </mesh>
    </group>
  );
};

// --------------------------------------------------------------------------
// 5. Section 2: Joinery Disassembly & Exploded Table Piece (Bespoke Studio)
// Explodes mortise & tenon joinery components outward, then reassembles smoothly
// --------------------------------------------------------------------------
const BespokeExplodedJoinery: React.FC<{ progress: number }> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const topRef = useRef<THREE.Mesh>(null);
  const legRef = useRef<THREE.Group>(null);
  const frontRailRef = useRef<THREE.Group>(null);
  const sideRailRef = useRef<THREE.Mesh>(null);
  const dowelGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const diff = progress - 2.0;
    const focus = Math.max(0, 1 - Math.abs(diff) * 1.3);

    applyGroupOpacity(groupRef.current, focus);
    if (!groupRef.current.visible) return;

    // Explode factor: peaks at section center (diff ≈ 0)
    const explodeFactor = Math.sin(focus * Math.PI) * 1.15;

    if (topRef.current) {
      topRef.current.position.y = THREE.MathUtils.lerp(topRef.current.position.y, 0.55 + explodeFactor * 0.75, delta * 6);
    }
    if (legRef.current) {
      legRef.current.position.y = THREE.MathUtils.lerp(legRef.current.position.y, -0.85 - explodeFactor * 0.55, delta * 6);
      legRef.current.position.x = THREE.MathUtils.lerp(legRef.current.position.x, -0.7 - explodeFactor * 0.4, delta * 6);
    }
    if (frontRailRef.current) {
      frontRailRef.current.position.z = THREE.MathUtils.lerp(frontRailRef.current.position.z, 0.45 + explodeFactor * 0.65, delta * 6);
    }
    if (sideRailRef.current) {
      sideRailRef.current.position.x = THREE.MathUtils.lerp(sideRailRef.current.position.x, 0.75 + explodeFactor * 0.65, delta * 6);
    }
    if (dowelGroupRef.current) {
      dowelGroupRef.current.position.x = THREE.MathUtils.lerp(dowelGroupRef.current.position.x, -0.15 - explodeFactor * 0.7, delta * 6);
      dowelGroupRef.current.position.z = THREE.MathUtils.lerp(dowelGroupRef.current.position.z, 0.2 + explodeFactor * 0.6, delta * 6);
    }

    const isMobile = state.size.width < 768;
    const baseX = isMobile ? 0 : 0.85;

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      baseX + state.pointer.x * 0.2,
      6.0,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      -0.1 - diff * 3.5 - state.pointer.y * 0.15,
      6.0,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      -0.4 - Math.abs(diff) * 0.7,
      6.0,
      delta
    );

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      0.55 + time * 0.18 + state.pointer.x * 0.25,
      5.0,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      0.15 - state.pointer.y * 0.12,
      5.0,
      delta
    );

    const scale = THREE.MathUtils.lerp(1.15, 0.9, Math.abs(diff));
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef} position={[0.85, -0.1, -0.4]}>
      {/* 1. Exploding Solid Teak Tabletop Slab */}
      <mesh ref={topRef} position={[0, 0.55, 0]}>
        <boxGeometry args={[2.5, 0.12, 1.45]} />
        <meshStandardMaterial color="#422512" roughness={0.32} metalness={0.04} />
      </mesh>

      {/* 2. Corner Joinery Mortise Block */}
      <mesh position={[-0.7, 0.38, 0.45]}>
        <boxGeometry args={[0.26, 0.22, 0.26]} />
        <meshStandardMaterial color="#2E190D" roughness={0.42} />
      </mesh>

      {/* 3. Front Apron Rail with Extending Tenon Tongue */}
      <group ref={frontRailRef} position={[0.3, 0.38, 0.45]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.75, 0.18, 0.08]} />
          <meshStandardMaterial color="#3D2214" roughness={0.36} />
        </mesh>
        {/* Tenon Tongue */}
        <mesh position={[-0.92, 0, 0]}>
          <boxGeometry args={[0.12, 0.12, 0.04]} />
          <meshStandardMaterial color="#C2863F" roughness={0.4} />
        </mesh>
      </group>

      {/* 4. Side Apron Rail with Mortise Housing */}
      <mesh ref={sideRailRef} position={[0.75, 0.38, -0.2]}>
        <boxGeometry args={[0.08, 0.18, 1.05]} />
        <meshStandardMaterial color="#3D2214" roughness={0.36} />
      </mesh>

      {/* 5. Tapered Chamfered Table Leg with Brass Ferrule Foot */}
      <group ref={legRef} position={[-0.7, -0.85, 0.45]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.08, 0.05, 1.45, 16]} />
          <meshStandardMaterial color="#351D10" roughness={0.36} />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.052, 0.046, 0.16, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.18} />
        </mesh>
      </group>

      {/* 6. Floating Precision Joinery Dowel Pins */}
      <group ref={dowelGroupRef} position={[-0.15, 0.38, 0.2]}>
        {[-0.04, 0.04].map((yOffset, i) => (
          <mesh key={i} position={[0, yOffset, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 0.22, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* 7. CAD Coordinate Hologram Ring Orbiting Joint */}
      <mesh position={[-0.7, 0.38, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.44, 36]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// --------------------------------------------------------------------------
// 6. Section 3: Luxury Dining Set (Collections Snapshot)
// Multi-piece formal dining set: table enters, and chairs slide in from the sides
// --------------------------------------------------------------------------
const CollectionsDiningSet: React.FC<{ progress: number }> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftChairRef = useRef<THREE.Group>(null);
  const rightChairRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const diff = progress - 3.0;
    const focus = Math.max(0, 1 - Math.abs(diff) * 1.3);

    applyGroupOpacity(groupRef.current, focus);
    if (!groupRef.current.visible) return;

    // Slide chairs in from left and right as user approaches Section 3
    const slideOffset = (1 - focus) * 4.2;

    if (leftChairRef.current) {
      leftChairRef.current.position.x = THREE.MathUtils.lerp(
        leftChairRef.current.position.x,
        -1.75 - slideOffset,
        delta * 6
      );
    }
    if (rightChairRef.current) {
      rightChairRef.current.position.x = THREE.MathUtils.lerp(
        rightChairRef.current.position.x,
        1.75 + slideOffset,
        delta * 6
      );
    }

    const isMobile = state.size.width < 768;
    const baseX = isMobile ? 0 : 0.8;

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      baseX + state.pointer.x * 0.2,
      6.0,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      -0.35 - diff * 3.6 - state.pointer.y * 0.12,
      6.0,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      -0.4 - Math.abs(diff) * 0.8,
      6.0,
      delta
    );

    // Stately perspective tilt
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      -0.25 + time * 0.12 + state.pointer.x * 0.22,
      5.0,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      0.16 - state.pointer.y * 0.1,
      5.0,
      delta
    );

    const scale = THREE.MathUtils.lerp(1.05, 0.85, Math.abs(diff));
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef} position={[0.8, -0.35, -0.4]}>
      {/* 1. Grand Rectangular Dining Table Top */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[2.7, 0.1, 1.35]} />
        <meshStandardMaterial color="#3D2314" roughness={0.34} metalness={0.04} />
      </mesh>

      {/* Inlaid Calacatta Gold Marble Runner Down Center of Table */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[2.45, 0.02, 0.55]} />
        <meshStandardMaterial color="#F5EFE6" roughness={0.16} metalness={0.02} />
      </mesh>

      {/* Polished Brass Double Trestle Table Pedestals */}
      {[-0.95, 0.95].map((x, i) => (
        <group key={i} position={[x, -0.15, 0]}>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 0.85, 16]} />
            <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[0.18, 0.05, 0.95]} />
            <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.18} />
          </mesh>
        </group>
      ))}

      {/* Centerpiece Minimalist Bronze Vessel */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.16, 0.08, 0.2, 24]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 2. Left Dining Chair Sliding In */}
      <group ref={leftChairRef} position={[-1.75, -0.1, 0]}>
        {/* Seat Cushion */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.65, 0.12, 0.65]} />
          <meshStandardMaterial color="#E6DFD5" roughness={0.85} />
        </mesh>
        {/* Curved Teak Backrest */}
        <mesh position={[-0.26, 0.55, 0]} rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.08, 0.65, 0.62]} />
          <meshStandardMaterial color="#382113" roughness={0.35} />
        </mesh>
        {/* Legs with Brass Tips */}
        {[-0.24, 0.24].map((lx, li) =>
          [-0.24, 0.24].map((lz, lzi) => (
            <mesh key={`${li}-${lzi}`} position={[lx, -0.26, lz]}>
              <cylinderGeometry args={[0.025, 0.02, 0.6, 12]} />
              <meshStandardMaterial color="#2A170C" roughness={0.4} />
            </mesh>
          ))
        )}
      </group>

      {/* 3. Right Dining Chair Sliding In */}
      <group ref={rightChairRef} position={[1.75, -0.1, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.65, 0.12, 0.65]} />
          <meshStandardMaterial color="#E6DFD5" roughness={0.85} />
        </mesh>
        <mesh position={[0.26, 0.55, 0]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.08, 0.65, 0.62]} />
          <meshStandardMaterial color="#382113" roughness={0.35} />
        </mesh>
        {[-0.24, 0.24].map((lx, li) =>
          [-0.24, 0.24].map((lz, lzi) => (
            <mesh key={`${li}-${lzi}`} position={[lx, -0.26, lz]}>
              <cylinderGeometry args={[0.025, 0.02, 0.6, 12]} />
              <meshStandardMaterial color="#2A170C" roughness={0.4} />
            </mesh>
          ))
        )}
      </group>

      {/* Floor Contact Shadow */}
      <mesh position={[0, -0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 2.6]} />
        <meshBasicMaterial color="#040302" transparent opacity={0.65} />
      </mesh>
    </group>
  );
};

// --------------------------------------------------------------------------
// 7. Section 4: Executive Desk Setup (Why Choose Heaven / Trust Grid)
// Prestige executive partner desk spinning slowly on its vertical axis
// --------------------------------------------------------------------------
const ExecutiveDeskSetup: React.FC<{ progress: number }> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const diff = progress - 4.0;
    const focus = Math.max(0, 1 - Math.abs(diff) * 1.3);

    applyGroupOpacity(groupRef.current, focus);
    if (!groupRef.current.visible) return;

    const isMobile = state.size.width < 768;
    const baseX = isMobile ? 0 : 0.85;

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      baseX + state.pointer.x * 0.18,
      6.0,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      -0.28 - diff * 3.6 - state.pointer.y * 0.12,
      6.0,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      -0.35 - Math.abs(diff) * 0.7,
      6.0,
      delta
    );

    // Stately, continuous 360° axial revolution
    groupRef.current.rotation.y += delta * 0.28;
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      0.14 - state.pointer.y * 0.1,
      5.0,
      delta
    );

    const scale = THREE.MathUtils.lerp(1.1, 0.88, Math.abs(diff));
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef} position={[0.85, -0.28, -0.35]}>
      {/* Heavy Cantilevered Walnut Desktop */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[2.7, 0.14, 1.4]} />
        <meshStandardMaterial color="#2F1B10" roughness={0.34} metalness={0.04} />
      </mesh>

      {/* Inlaid Leather Blotter Pad with Perimeter Gold Detailing */}
      <mesh position={[0, 0.5, 0.05]}>
        <boxGeometry args={[1.65, 0.02, 0.9]} />
        <meshStandardMaterial color="#111B18" roughness={0.88} />
      </mesh>

      {/* Right 3-Drawer Storage Pedestal Bay with Fluted Teak Faces */}
      <group position={[0.92, -0.05, 0]}>
        <mesh>
          <boxGeometry args={[0.72, 0.82, 1.25]} />
          <meshStandardMaterial color="#2B180E" roughness={0.36} />
        </mesh>
        {/* Horizontal Brass Drawer Pulls */}
        {[-0.22, 0.02, 0.26].map((y, i) => (
          <mesh key={i} position={[-0.37, y, 0]}>
            <boxGeometry args={[0.03, 0.025, 0.38]} />
            <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.18} />
          </mesh>
        ))}
      </group>

      {/* Left Cantilever Architectural Sled Leg */}
      <group position={[-0.98, -0.05, 0]}>
        <mesh>
          <boxGeometry args={[0.12, 0.82, 1.25]} />
          <meshStandardMaterial color="#24140C" roughness={0.38} />
        </mesh>
        <mesh position={[0, -0.44, 0]}>
          <boxGeometry args={[0.16, 0.06, 1.3]} />
          <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.18} />
        </mesh>
      </group>

      {/* Recessed Fluted Modesty Privacy Panel Across Front */}
      <mesh position={[0, 0.02, -0.42]}>
        <boxGeometry args={[1.85, 0.65, 0.06]} />
        <meshStandardMaterial color="#351F13" roughness={0.38} />
      </mesh>

      {/* Minimalist Brass Desk Lamp on Corner */}
      <group position={[-0.95, 0.6, -0.38]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.03, 16]} />
          <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.32, 12]} />
          <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0.08, 0.34, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.06, 0.09, 0.16, 16]} />
          <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.18} />
        </mesh>
      </group>

      {/* Soft Ground Contact Shadow */}
      <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.4, 2.2]} />
        <meshBasicMaterial color="#040302" transparent opacity={0.65} />
      </mesh>
    </group>
  );
};

// --------------------------------------------------------------------------
// 8. Section 5: Architectural Podium & Miniature Showroom (Showroom Experience)
// Stepped stone plinths, architectural columns, gallery spotlighting
// --------------------------------------------------------------------------
const ShowroomArchitecturalPodium: React.FC<{ progress: number }> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const diff = progress - 5.0;
    const focus = Math.max(0, 1 - Math.abs(diff) * 1.3);

    applyGroupOpacity(groupRef.current, focus);
    if (!groupRef.current.visible) return;

    const isMobile = state.size.width < 768;
    const baseX = isMobile ? 0 : 0.85;

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      baseX + state.pointer.x * 0.2,
      6.0,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      -0.45 - diff * 3.6 - state.pointer.y * 0.14,
      6.0,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      -0.3 - Math.abs(diff) * 0.7,
      6.0,
      delta
    );

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      -0.2 + time * 0.12 + state.pointer.x * 0.2,
      5.0,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      0.15 - state.pointer.y * 0.12,
      5.0,
      delta
    );

    const scale = THREE.MathUtils.lerp(1.1, 0.88, Math.abs(diff));
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef} position={[0.85, -0.45, -0.3]}>
      {/* 1. Base Large Concentric Travertine Stone Plinth */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[2.1, 2.2, 0.18, 48]} />
        <meshStandardMaterial color="#E5DFD5" roughness={0.65} metalness={0.02} />
      </mesh>

      {/* 2. Middle Marble Plinth with Brass Reveal Strip */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.55, 1.55, 0.22, 48]} />
        <meshStandardMaterial color="#F5EFE6" roughness={0.18} metalness={0.04} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[1.57, 1.57, 0.04, 48]} />
        <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* 3. Top Teak Feature Pedestal */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.28, 40]} />
        <meshStandardMaterial color="#3C2214" roughness={0.34} metalness={0.04} />
      </mesh>

      {/* 4. Sculptural Artisanal Teak Maquette on Top */}
      <group position={[0, 0.52, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.34, 1]} />
          <meshStandardMaterial color="#DFBE7B" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <torusGeometry args={[0.48, 0.025, 16, 40]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
        </mesh>
      </group>

      {/* 5. Minimalist Showroom Gallery Architectural Portal Arches in Background */}
      {[-1.6, 1.6].map((x, i) => (
        <group key={i} position={[x, 0.45, -1.2]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 1.8, 16]} />
            <meshStandardMaterial color="#2B1A10" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <boxGeometry args={[0.22, 0.08, 0.22]} />
            <meshStandardMaterial color="#DFBE7B" metalness={0.92} roughness={0.18} />
          </mesh>
        </group>
      ))}

      {/* Warm Gallery Downlight Light Source Indicator */}
      <pointLight position={[0, 2.2, 0]} intensity={1.8} color="#FFF2DD" distance={6} />
    </group>
  );
};

// --------------------------------------------------------------------------
// 9. Section 6: Floating Golden Monogram Crest (Final CTA & Footer)
// 3D 24K gold crest with dual gyroscopic orbital rings and floor reflections
// --------------------------------------------------------------------------
const GoldenMonogramCrest: React.FC<{ progress: number }> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const diff = progress - 6.0;
    const focus = Math.max(0, 1 - Math.abs(diff) * 1.3);

    applyGroupOpacity(groupRef.current, focus);
    if (!groupRef.current.visible) return;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.45;
      ring1Ref.current.rotation.y = time * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.4;
      ring2Ref.current.rotation.z = time * 0.3;
    }

    const isMobile = state.size.width < 768;
    const baseX = isMobile ? 0 : 0.85;

    const floatY = Math.sin(time * 1.3) * 0.08;

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      baseX + state.pointer.x * 0.25,
      6.0,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      0.15 + floatY - diff * 3.5 - state.pointer.y * 0.15,
      6.0,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      -0.2 - Math.abs(diff) * 0.8,
      6.0,
      delta
    );

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      time * 0.32 + state.pointer.x * 0.3,
      5.0,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      0.08 - state.pointer.y * 0.12,
      5.0,
      delta
    );

    const scale = THREE.MathUtils.lerp(1.2, 0.85, Math.abs(diff));
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef} position={[0.85, 0.15, -0.2]}>
      {/* Heraldic 24K Gold Beveled Shield Medallion */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.55, 1.85, 0.18]} />
        <meshStandardMaterial
          color="#DFBE7B"
          metalness={0.96}
          roughness={0.14}
        />
      </mesh>

      {/* Outer Golden Border Rim */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[1.68, 1.98, 0.08]} />
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.94}
          roughness={0.16}
        />
      </mesh>

      {/* Embossed Stylized "H" Monogram Architecture */}
      <group position={[0, 0, 0.14]}>
        {/* Left vertical column */}
        <mesh position={[-0.42, 0, 0]}>
          <boxGeometry args={[0.18, 1.15, 0.12]} />
          <meshStandardMaterial color="#FFF1CC" metalness={0.98} roughness={0.12} />
        </mesh>
        {/* Right vertical column */}
        <mesh position={[0.42, 0, 0]}>
          <boxGeometry args={[0.18, 1.15, 0.12]} />
          <meshStandardMaterial color="#FFF1CC" metalness={0.98} roughness={0.12} />
        </mesh>
        {/* Center horizontal crossbar with diamond center */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.72, 0.18, 0.12]} />
          <meshStandardMaterial color="#FFF1CC" metalness={0.98} roughness={0.12} />
        </mesh>
        <mesh position={[0, 0, 0.05]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.26, 0.26, 0.08]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.94} roughness={0.14} />
        </mesh>
      </group>

      {/* Gyroscopic Concentric Golden Orbital Rings */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[1.5, 0.022, 16, 64]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.14} />
        </mesh>
      </group>
      <group ref={ring2Ref}>
        <mesh>
          <torusGeometry args={[1.75, 0.02, 16, 64]} />
          <meshStandardMaterial color="#FFF1CC" metalness={0.95} roughness={0.14} />
        </mesh>
      </group>

      {/* Floor Specular Reflection Plane */}
      <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.5, 4.5]} />
        <meshStandardMaterial
          color="#0A0804"
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Dedicated Golden Aura Point Light */}
      <pointLight position={[0, 0, 1.4]} intensity={2.4} color="#FFE6A8" distance={5.5} />
    </group>
  );
};

// --------------------------------------------------------------------------
// 10. Volumetric Golden & Teak Craft Dust Particulates (120 Motes)
// --------------------------------------------------------------------------
const AmbientCraftMotes: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const [particlePositions] = useMemo(() => {
    const count = 130;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 10 - 5;
      pos[i * 3 + 2] = Math.random() * 8 - 4;
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.022;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.035;
      pointsRef.current.position.x = THREE.MathUtils.damp(
        pointsRef.current.position.x,
        state.pointer.x * 0.35,
        4.0,
        delta
      );
    }
  });

  return (
    <points ref={pointsRef} position={[0, 0, -0.5]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#FFDF9E"
        transparent
        opacity={0.82}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// --------------------------------------------------------------------------
// 11. Neoclassical Architectural Floor Runway & Perspective Grid
// --------------------------------------------------------------------------
const ArchitecturalFloorRunway: React.FC = () => {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    const p = scrollState.sectionProgress;
    gridRef.current.position.z = -1.5 + ((p * 1.5) % 1.0);
    gridRef.current.position.x = -state.pointer.x * 0.2;
  });

  return (
    <group ref={gridRef} position={[0, -2.4, -1.8]}>
      <gridHelper args={[40, 40, '#F59E0B', '#261C12']} position={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[42, 42]} />
        <meshStandardMaterial color="#080706" roughness={0.65} metalness={0.35} />
      </mesh>
    </group>
  );
};

// --------------------------------------------------------------------------
// 12. Cinematic Scene Manager & Dynamic Lighting Interpolator
// Orchestrates seamless camera, ambient lighting, and color transitions
// --------------------------------------------------------------------------
const CinematicSceneManager: React.FC<{
  onSectionChange?: (sectionIndex: number) => void;
}> = ({ onSectionChange }) => {
  const { camera } = useThree();
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const currentSectionRef = useRef(-1);

  // Smooth local continuous section progress state
  const [currentProgress, setCurrentProgress] = useState(0);

  useFrame((state, delta) => {
    // 120Hz butter-smooth damping between current and target section progress
    const nextProgress = THREE.MathUtils.damp(
      scrollState.sectionProgress,
      scrollState.targetSectionProgress,
      5.2,
      delta
    );
    scrollState.sectionProgress = nextProgress;
    setCurrentProgress(nextProgress);

    const intSection = Math.min(Math.floor(nextProgress), SECTION_PALETTES.length - 1);
    if (currentSectionRef.current !== intSection) {
      currentSectionRef.current = intSection;
      if (onSectionChange) onSectionChange(intSection);
    }

    // Dynamic camera parallax with scroll depth
    const targetCamX = state.pointer.x * 0.35;
    const targetCamY = 0.1 + state.pointer.y * 0.18;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4.0, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4.0, delta);
    camera.lookAt(0, 0, -1.8);

    // Interpolate lighting palette between current section and next section
    const floorIdx = Math.min(Math.floor(nextProgress), SECTION_PALETTES.length - 1);
    const ceilIdx = Math.min(floorIdx + 1, SECTION_PALETTES.length - 1);
    const t = nextProgress - floorIdx;

    const pA = SECTION_PALETTES[floorIdx];
    const pB = SECTION_PALETTES[ceilIdx];

    if (ambientLightRef.current) {
      const colorA = new THREE.Color(pA.ambientHex);
      const colorB = new THREE.Color(pB.ambientHex);
      ambientLightRef.current.color.copy(colorA.lerp(colorB, t));
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        pA.ambientIntensity,
        pB.ambientIntensity,
        t
      );
    }

    if (keyLightRef.current) {
      const keyA = new THREE.Color(pA.keyLightHex);
      const keyB = new THREE.Color(pB.keyLightHex);
      keyLightRef.current.color.copy(keyA.lerp(keyB, t));
      keyLightRef.current.intensity = THREE.MathUtils.lerp(pA.keyIntensity, pB.keyIntensity, t);
    }

    if (rimLightRef.current) {
      const rimA = new THREE.Color(pA.rimLightHex);
      const rimB = new THREE.Color(pB.rimLightHex);
      rimLightRef.current.color.copy(rimA.lerp(rimB, t));
      rimLightRef.current.intensity = THREE.MathUtils.lerp(pA.rimIntensity, pB.rimIntensity, t);
    }
  });

  return (
    <>
      {/* Dynamic Lighting Setup */}
      <ambientLight ref={ambientLightRef} intensity={0.9} color="#99D5D0" />
      <directionalLight
        ref={keyLightRef}
        position={[-4.5, 6.0, 4.5]}
        intensity={2.6}
        color="#FFF0D4"
      />
      <directionalLight
        ref={rimLightRef}
        position={[4.0, 4.5, -3.5]}
        intensity={1.8}
        color="#2DD4BF"
      />

      {/* Architectural Floor & Ambient Particulates */}
      <ArchitecturalFloorRunway />
      <AmbientCraftMotes />

      {/* 7 Distinct Section 3D Models with Scroll-Linked Interpolation */}
      <HeroLoungeChair progress={currentProgress} />
      <BrandStoryCoffeeTable progress={currentProgress} />
      <BespokeExplodedJoinery progress={currentProgress} />
      <CollectionsDiningSet progress={currentProgress} />
      <ExecutiveDeskSetup progress={currentProgress} />
      <ShowroomArchitecturalPodium progress={currentProgress} />
      <GoldenMonogramCrest progress={currentProgress} />
    </>
  );
};

// Check WebGL availability safely
const isWebGLSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

// --------------------------------------------------------------------------
// 13. Main Exported Component: Fixed Background 3D Canvas
// Positioned behind all content with seamless scroll transitions and legibility overlays
// --------------------------------------------------------------------------
export interface ScrollDrivenCinematicCanvasProps {
  onSectionChange?: (sectionIndex: number) => void;
  activeModelIndex?: number;
}

export const ScrollDrivenCinematicCanvas: React.FC<ScrollDrivenCinematicCanvasProps> = ({
  onSectionChange,
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    initScrollListener();
    setHasWebGL(isWebGLSupported());
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 25%, #15100B 0%, #0D0B08 40%, #070605 75%, #030303 100%)',
        contain: 'strict',
        willChange: 'transform',
      }}
    >
      {hasWebGL && (
        <Canvas
          dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.25) : 1]}
          camera={{ position: [0, 0.15, 4.4], fov: 38 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            precision: 'mediump',
            stencil: false,
            depth: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
          className="w-full h-full"
        >
          <fog attach="fog" args={['#070A0F', 8.0, 26.0]} />
          <CinematicSceneManager onSectionChange={onSectionChange} />
        </Canvas>
      )}

      {/* Layer 1: Left Editorial Contrast Vignette (Ensures 100% text legibility) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050403]/90 via-[#050403]/50 to-[#050403]/75 pointer-events-none" />

      {/* Layer 2: Top & Bottom Soft Architectural Vignettes */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050403]/75 via-transparent to-[#050403]/85 pointer-events-none" />

      {/* Layer 3: Warm Studio Amber Rim Glow on Right Edge */}
      <div
        className="absolute top-1/4 right-0 w-[650px] h-[650px] rounded-full pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
