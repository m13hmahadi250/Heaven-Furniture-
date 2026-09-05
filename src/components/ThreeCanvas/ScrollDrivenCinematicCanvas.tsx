import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getOrLoadTexture, preloadCriticalImages } from '../../utils/assetCache';

interface ScrollDrivenCinematicCanvasProps {
  onSectionChange?: (sectionIndex: number) => void;
  activeModelIndex?: number;
}

// --------------------------------------------------------------------------
// 1. High-Performance Zero-Allocation Global Scroll Tracker (120Hz)
// --------------------------------------------------------------------------
export const scrollState = {
  progress: 0,
  targetProgress: 0,
  isListening: false,
};

export const onLenisScrollUpdate = (progress: number) => {
  scrollState.targetProgress = Math.min(Math.max(progress, 0), 1);
};

const updateScrollFallback = () => {
  if (typeof window === 'undefined') return;
  const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
  scrollState.targetProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
};

const initScrollListener = () => {
  if (typeof window === 'undefined' || scrollState.isListening) return;
  scrollState.isListening = true;
  updateScrollFallback();

  window.addEventListener('scroll', updateScrollFallback, { passive: true });
  window.addEventListener('resize', updateScrollFallback, { passive: true });
};

// --------------------------------------------------------------------------
// 2. High-Resolution Realistic Luxury Furniture & Interior Render Assets
// --------------------------------------------------------------------------
export interface FurnitureShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  aspectRatio: number; // width / height
  baseScale: [number, number, number];
  accentColor: string;
  rimColor: string;
}

export const SHOWCASE_ITEMS: FurnitureShowcaseItem[] = [
  {
    id: 'emerald-bed',
    title: 'Emerald Monarch Bed',
    subtitle: 'Channel-Tufted Italian Velvet & Chittagong Teak',
    category: 'Master Bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: 1.5,
    baseScale: [2.8, 1.9, 1],
    accentColor: '#10B981',
    rimColor: '#D4AF37',
  },
  {
    id: 'embroidery-sofa',
    title: 'Embroidered Sofa Suite',
    subtitle: 'Silver-Grey Floral Brocade & Antique Silver Gilt',
    category: 'Living Room Salon',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: 1.5,
    baseScale: [2.8, 1.9, 1],
    accentColor: '#CBD5E1',
    rimColor: '#F59E0B',
  },
  {
    id: 'luxury-showcase',
    title: 'Grand Arched Vitrine',
    subtitle: 'Roman Glass Arch, LED Shelves & Teak Cabinetry',
    category: 'Storage & Vitrine',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: 1.25,
    baseScale: [2.4, 2.4, 1],
    accentColor: '#FBBF24',
    rimColor: '#FFD700',
  },
  {
    id: 'minimal-shoebox',
    title: 'Noir Entryway Console',
    subtitle: 'Matte Obsidian Hardwood & Brushed Brass Ferrules',
    category: 'Entryway & Console',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: 1.5,
    baseScale: [2.7, 1.8, 1],
    accentColor: '#E2E8F0',
    rimColor: '#E5C158',
  },
  {
    id: 'royal-sapphire-sofa',
    title: 'Royal Sapphire Damask Sofa',
    subtitle: 'Deep Navy Velvet, 24K Gold Leaf Relief Carvings',
    category: 'Formal Living',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',
    aspectRatio: 1.5,
    baseScale: [2.8, 1.9, 1],
    accentColor: '#3B82F6',
    rimColor: '#F59E0B',
  },
];

const SALON_BACKDROP_IMAGE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85';

// --------------------------------------------------------------------------
// 3. Texture Loader Hook with Zero-Lag Memory & Storage Caching
// --------------------------------------------------------------------------
const useShowcaseTextures = () => {
  const [textures, setTextures] = useState<{ [key: string]: THREE.Texture }>({});
  const [backdropTexture, setBackdropTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    // Pre-decode all showcase imagery in browser idle cycles for zero-stutter transitions
    preloadCriticalImages([
      SALON_BACKDROP_IMAGE,
      ...SHOWCASE_ITEMS.map((item) => item.imageUrl),
    ]);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    // Load or retrieve cached backdrop
    const cachedBackdrop = getOrLoadTexture(loader, SALON_BACKDROP_IMAGE, (tex) => {
      setBackdropTexture(tex);
    });
    if (cachedBackdrop) {
      setBackdropTexture(cachedBackdrop);
    }

    // Load or retrieve cached showcase item images
    SHOWCASE_ITEMS.forEach((item) => {
      const cachedTex = getOrLoadTexture(loader, item.imageUrl, (tex) => {
        setTextures((prev) => ({ ...prev, [item.id]: tex }));
      });
      if (cachedTex) {
        setTextures((prev) => ({ ...prev, [item.id]: cachedTex }));
      }
    });
  }, []);

  return { textures, backdropTexture };
};

// --------------------------------------------------------------------------
// 4. Background Neoclassical Architectural Salon Stage (Deep Parallax)
// --------------------------------------------------------------------------
const ArchitecturalSalonBackdrop: React.FC<{
  texture: THREE.Texture | null;
}> = ({ texture }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const p = scrollState.progress;
    const px = state.pointer.x;
    const py = state.pointer.y;

    // Gentle camera parallax response
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      -px * 0.3 - p * 0.35,
      0.05
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      0.35 + py * 0.18 - p * 0.25,
      0.05
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      px * 0.04,
      0.05
    );
  });

  return (
    <group position={[0, 0.2, -6.0]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[28, 16, 1, 1]} />
        <meshStandardMaterial
          map={texture || null}
          color="#FAF4EB"
          roughness={0.45}
          metalness={0.08}
        />
      </mesh>

      {/* Deep Room Architectural Gallery Lighting */}
      <pointLight position={[-5, 3.5, -4]} intensity={2.0} color="#FFDCB2" distance={14} />
      <pointLight position={[5, 3.5, -4]} intensity={1.8} color="#FFE6C8" distance={14} />
    </group>
  );
};

// --------------------------------------------------------------------------
// 4.1 3D Architectural Showroom Runway & Perspective Grid
// --------------------------------------------------------------------------
const ArchitecturalShowroomGrid: React.FC = () => {
  const gridGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!gridGroupRef.current) return;
    const p = scrollState.progress;
    const px = state.pointer.x;

    // Fluid responsive motion with scroll depth & cursor tilt
    gridGroupRef.current.position.z = -1.2 + (p * 4.0) % 1.0;
    gridGroupRef.current.position.x = -px * 0.25;
    gridGroupRef.current.rotation.y = px * 0.04;
    gridGroupRef.current.rotation.z = -px * 0.015;
  });

  return (
    <group ref={gridGroupRef} position={[0, -2.2, -1.8]}>
      {/* Precision CAD Showroom Perspective Runway Grid */}
      <gridHelper
        args={[36, 36, '#F59E0B', '#3B2D1D']}
        position={[0, 0, 0]}
      />

      {/* Showroom Floor Specular Reflection Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
        <planeGeometry args={[38, 38]} />
        <meshStandardMaterial
          color="#0A0907"
          roughness={0.6}
          metalness={0.45}
        />
      </mesh>

      {/* Golden Horizon Guide Light Bar */}
      <mesh position={[0, 0.02, -14]}>
        <boxGeometry args={[34, 0.04, 0.04]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.35} />
      </mesh>

      {/* Showroom Runway Center Guideline */}
      <mesh position={[0, 0.01, -4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 18]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

// --------------------------------------------------------------------------
// 4.2 Floating 3D Joinery & Architectural CAD Geometry Orbiters
// --------------------------------------------------------------------------
const FloatingJoineryGeometry: React.FC = () => {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const p = scrollState.progress;
    const px = state.pointer.x;
    const py = state.pointer.y;

    if (group1Ref.current) {
      group1Ref.current.rotation.x = time * 0.12 + py * 0.15;
      group1Ref.current.rotation.y = time * 0.16 + px * 0.2;
      group1Ref.current.rotation.z = time * 0.06;
      group1Ref.current.position.y = 1.3 + Math.sin(time * 0.7) * 0.12 - p * 0.6;
      group1Ref.current.position.x = -4.0 - px * 0.25;
    }

    if (group2Ref.current) {
      group2Ref.current.rotation.x = -time * 0.1 - py * 0.15;
      group2Ref.current.rotation.y = time * 0.14 + px * 0.2;
      group2Ref.current.position.y = -0.5 + Math.cos(time * 0.8) * 0.14 - p * 0.4;
      group2Ref.current.position.x = 4.2 - px * 0.25;
    }
  });

  return (
    <>
      {/* Left Deep Dimension Ring & Isometric Joinery Cube */}
      <group ref={group1Ref} position={[-4.0, 1.3, -3.2]}>
        {/* Outer Orbital Dimension Ring */}
        <mesh>
          <ringGeometry args={[1.4, 1.42, 64]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.28} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.42, 64]} />
          <meshBasicMaterial color="#FFE2A8" transparent opacity={0.16} side={THREE.DoubleSide} />
        </mesh>
        {/* Precision Wireframe Joinery Cube */}
        <mesh>
          <boxGeometry args={[0.95, 0.95, 0.95]} />
          <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.28} />
        </mesh>
      </group>

      {/* Right Floating Precision Geodesic Joinery Knot */}
      <group ref={group2Ref} position={[4.2, -0.5, -3.0]}>
        <mesh>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshBasicMaterial color="#E5C158" wireframe transparent opacity={0.22} />
        </mesh>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <ringGeometry args={[1.25, 1.27, 48]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  );
};

// --------------------------------------------------------------------------
// 5. Volumetric Golden & Teak Craft Dust Particulates (120 Motes)
// --------------------------------------------------------------------------
const GoldenAmbientMotes: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const [particlePositions] = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = Math.random() * 9.0 - 4.5;
      pos[i * 3 + 2] = Math.random() * 8.0 - 5.0;
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.024;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.035;
      // Responsive pointer sway
      pointsRef.current.position.x = THREE.MathUtils.lerp(
        pointsRef.current.position.x,
        state.pointer.x * 0.4,
        0.05
      );
      pointsRef.current.position.y = THREE.MathUtils.lerp(
        pointsRef.current.position.y,
        state.pointer.y * 0.25,
        0.05
      );
    }
  });

  return (
    <group position={[0, 0.4, -0.6]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.072}
          color="#FFDF9E"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

// --------------------------------------------------------------------------
// 6. Interactive 2.5D Depth-Mesh Hero Showcase Card (Ultra-Realistic)
// (Curved geometry with realistic depth flex, specular response & rim lighting)
// --------------------------------------------------------------------------
const DepthMeshHeroPlane: React.FC<{
  item: FurnitureShowcaseItem;
  texture: THREE.Texture | null;
  isActive: boolean;
  index: number;
}> = ({ item, texture, isActive }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const opacityRef = useRef(isActive ? 1 : 0);

  // Lightweight optimized curved plane for optical 3D depth flexion (zero geometry bottleneck)
  const curvedGeometry = useMemo(() => {
    const [w, h] = [item.baseScale[0], item.baseScale[1]];
    const geom = new THREE.PlaneGeometry(w, h, 14, 14);
    const pos = geom.attributes.position;

    // Apply subtle spherical optical curvature along edges for realistic convex depth
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const distFromCenter = (x * x) / (w * w) + (y * y) / (h * h);
      const zOffset = -Math.pow(distFromCenter, 1.4) * 0.22;
      pos.setZ(i, zOffset);
    }
    geom.computeVertexNormals();
    return geom;
  }, [item]);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    // Fast smooth transition opacity
    const targetOpacity = isActive ? 1.0 : 0.0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, delta * 6.0);

    if (matRef.current) {
      matRef.current.opacity = opacityRef.current;
      matRef.current.transparent = true;
    }

    // Hide inactive layers completely to skip vertex and fragment shader work
    groupRef.current.visible = opacityRef.current > 0.01;
    if (!groupRef.current.visible) return;

    const p = scrollState.progress;
    const px = state.pointer.x;
    const py = state.pointer.y;
    const isMobile = state.size.width < 768;

    // Organic floating physics
    const time = state.clock.elapsedTime;
    const floatY = Math.sin(time * 1.1) * 0.06;
    const floatRotZ = Math.cos(time * 0.8) * 0.015;

    // Base position & layout anchor (Right-biased on desktop for text space, centered on mobile)
    const baseX = isMobile ? 0 : 0.95;
    const scrollOffsetX = Math.sin(p * Math.PI * 1.6) * 0.4;
    const scrollOffsetY = -p * 0.7 + floatY;
    const scrollOffsetZ = -0.5 - Math.sin(p * Math.PI) * 0.4;

    const targetPosX = baseX + scrollOffsetX + px * 0.22;
    const targetPosY = -0.15 + scrollOffsetY - py * 0.14;
    const targetPosZ = scrollOffsetZ;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, delta * 6.0);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, delta * 6.0);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPosZ, delta * 6.0);

    // Interactive 3D tilt & rotation reacting to cursor & scroll
    const targetRotY = -0.12 + px * 0.28 + p * 0.35;
    const targetRotX = 0.04 - py * 0.22;
    const targetRotZ = floatRotZ - px * 0.04;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 6.0);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 6.0);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, delta * 6.0);

    // Subtle scale breathing when active
    const scaleFactor = (isActive ? 1.0 : 0.92) * (1 + Math.sin(time * 0.7) * 0.008);
    groupRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
  });

  return (
    <group ref={groupRef} position={[0.95, -0.15, -0.5]}>
      {/* 1. Main Realistic 2.5D Depth Curved Hero Mesh - High Performance Standard Material */}
      <mesh ref={meshRef} geometry={curvedGeometry}>
        <meshStandardMaterial
          ref={matRef as any}
          map={texture || null}
          roughness={0.34}
          metalness={0.06}
          toneMapped={true}
        />
      </mesh>

      {/* 2. Soft Glowing Golden Rim Halo */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[item.baseScale[0] * 1.04, item.baseScale[1] * 1.04]} />
        <meshBasicMaterial
          color={item.rimColor}
          transparent={true}
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Ground Ambient Shadow Simulation */}
      <mesh position={[0, -item.baseScale[1] * 0.52, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[item.baseScale[0] * 1.1, 1.6]} />
        <meshBasicMaterial
          color="#010403"
          transparent={true}
          opacity={0.65}
        />
      </mesh>
    </group>
  );
};

// --------------------------------------------------------------------------
// 7. Parallax Showroom Stage Orchestrator
// --------------------------------------------------------------------------
const CinematicStageOrchestrator: React.FC<ScrollDrivenCinematicCanvasProps> = ({
  onSectionChange,
  activeModelIndex = 0,
}) => {
  const { textures, backdropTexture } = useShowcaseTextures();
  const activeSectionRef = useRef(-1);
  const mouseLightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    // 120Hz smooth scroll interpolation
    const lerpFactor = Math.min(delta * 7.5, 1.0);
    scrollState.progress = THREE.MathUtils.lerp(
      scrollState.progress,
      scrollState.targetProgress,
      lerpFactor
    );
    const p = scrollState.progress;

    const sectionIndex = Math.min(Math.floor(p * 6), 5);
    if (activeSectionRef.current !== sectionIndex) {
      activeSectionRef.current = sectionIndex;
      if (onSectionChange) onSectionChange(sectionIndex);
    }

    // Dynamic 3D Camera parallax responding smoothly to cursor and scroll depth
    const targetCamX = state.pointer.x * 0.4;
    const targetCamY = 0.15 + state.pointer.y * 0.22 - p * 0.35;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, delta * 3.0);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, delta * 3.0);
    state.camera.lookAt(0, 0, -2.5);

    // Dynamic mouse spotlight tracking
    if (mouseLightRef.current) {
      mouseLightRef.current.position.x = THREE.MathUtils.lerp(
        mouseLightRef.current.position.x,
        state.pointer.x * 3.2,
        0.08
      );
      mouseLightRef.current.position.y = THREE.MathUtils.lerp(
        mouseLightRef.current.position.y,
        state.pointer.y * 2.2 + 0.6,
        0.08
      );
    }
  });

  return (
    <group>
      {/* 1. 3D Architectural Showroom Perspective Runway Grid */}
      <ArchitecturalShowroomGrid />

      {/* 2. Floating Precision Joinery Geometry & CAD Orbital Dimension Rings */}
      <FloatingJoineryGeometry />

      {/* 3. Deep Parallax Neoclassical Salon Interior Backdrop */}
      <ArchitecturalSalonBackdrop texture={backdropTexture} />

      {/* 4. Volumetric Golden & Teak Craft Dust Particulates (120 Motes) */}
      <GoldenAmbientMotes />

      {/* 5. Ultra-Realistic Interactive 2.5D Depth-Mesh Furniture Showcase */}
      {SHOWCASE_ITEMS.map((item, idx) => (
        <DepthMeshHeroPlane
          key={item.id}
          item={item}
          texture={textures[item.id] || null}
          isActive={activeModelIndex === idx}
          index={idx}
        />
      ))}

      {/* 6. Cursor Interactive Dynamic Spotlight */}
      <pointLight
        ref={mouseLightRef}
        position={[1.5, 1.2, 2.2]}
        intensity={1.4}
        color="#FFE9C2"
        distance={7.0}
      />
    </group>
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
// 8. 60 FPS Render Loop Throttler
// Intercepts R3F's rendering pipeline with priority: 1, locking the 3D scene
// to a crisp 60fps maximum cadence. On 90Hz, 120Hz, and 144Hz high-refresh
// mobile displays (e.g., iPhone ProMotion, high-end Androids), this prevents
// wasteful 120fps GPU draw passes, reducing thermal throttling and battery drain.
// --------------------------------------------------------------------------
export function useFrameThrottler(targetFps: number = 60) {
  const lastTimeRef = useRef<number>(0);
  const frameInterval = 1000 / targetFps;

  useFrame((state) => {
    // Idle optimization: skip rendering passes when tab is in background or invisible
    if (typeof document !== 'undefined' && document.hidden) {
      return;
    }

    const now = performance.now();
    if (!lastTimeRef.current) {
      lastTimeRef.current = now;
      state.gl.render(state.scene, state.camera);
      return;
    }

    const elapsed = now - lastTimeRef.current;
    if (elapsed >= frameInterval) {
      // Modulo subtraction prevents cumulative frame-pacing drift
      lastTimeRef.current = now - (elapsed % frameInterval);
      state.gl.render(state.scene, state.camera);
    }
  }, 1); // priority: 1 overrides R3F default auto-rendering loop
}

export const FrameRateThrottler: React.FC<{ targetFps?: number }> = ({ targetFps = 60 }) => {
  useFrameThrottler(targetFps);
  return null;
};

// --------------------------------------------------------------------------
// 9. Main Exported Component: Ultra-Realistic 2.5D Parallax & Depth Canvas
// --------------------------------------------------------------------------
export const ScrollDrivenCinematicCanvas: React.FC<ScrollDrivenCinematicCanvasProps> = ({
  onSectionChange,
  activeModelIndex = 0,
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    initScrollListener();
    setHasWebGL(isWebGLSupported());
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 18%, #1A130D 0%, #100D0B 38%, #080706 72%, #030303 100%)',
        contain: 'strict',
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
      }}
    >
      {hasWebGL && (
        <Canvas
          dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.25) : 1]}
          camera={{ position: [0, 0.15, 4.2], fov: 38 }}
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
          {/* Locked 60 FPS Render Throttler: Prevents 90Hz/120Hz/144Hz GPU overdrive on mobile displays */}
          <FrameRateThrottler targetFps={60} />

          {/* Atmospheric Depth Mist - Warm showroom studio falloff */}
          <fog attach="fog" args={['#080706', 7.0, 24.0]} />

          {/* Three-Point Luxury Studio Illumination */}
          {/* 1. Warm Golden Key Light */}
          <directionalLight
            position={[-4.5, 6.5, 4.0]}
            intensity={2.8}
            color="#FFF4E3"
          />

          {/* 2. Soft Ambient Salon Warmth */}
          <ambientLight intensity={1.25} color="#FFF5E8" />

          {/* 3. Cool Accent Sky/Window Fill */}
          <directionalLight
            position={[4.5, 4.0, 3.0]}
            intensity={0.9}
            color="#C7DCF0"
          />

          {/* 4. Golden Teak Rim Backlight */}
          <directionalLight
            position={[0, 5.0, -3.5]}
            intensity={1.5}
            color="#F59E0B"
          />

          <CinematicStageOrchestrator
            onSectionChange={onSectionChange}
            activeModelIndex={activeModelIndex}
          />
        </Canvas>
      )}

      {/* Layer 1: Left-to-Right Warm Editorial Vignette ensuring crisp text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050404]/80 via-[#050404]/30 to-transparent pointer-events-none" />

      {/* Layer 2: Top-and-Bottom Architectural Soft Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050404]/60 via-transparent to-[#050404]/80 pointer-events-none" />

      {/* Layer 3: Warm Golden Studio Rim Glow Accent on Right Edge */}
      <div
        className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)' }}
      />

      {/* Layer 4: Deep Teak Artisan Glow on Top-Left */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(163, 92, 43, 0.12) 0%, transparent 70%)' }}
      />
    </div>
  );
};
