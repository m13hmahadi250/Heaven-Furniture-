import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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
// 3. Texture Loader Hook with Smooth Caching
// --------------------------------------------------------------------------
const useShowcaseTextures = () => {
  const [textures, setTextures] = useState<{ [key: string]: THREE.Texture }>({});
  const [backdropTexture, setBackdropTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    // Load backdrop
    loader.load(SALON_BACKDROP_IMAGE, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      setBackdropTexture(tex);
    });

    // Load showcase item images
    SHOWCASE_ITEMS.forEach((item) => {
      loader.load(item.imageUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        setTextures((prev) => ({ ...prev, [item.id]: tex }));
      });
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
      -px * 0.25 - p * 0.4,
      0.05
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      0.35 + py * 0.15 - p * 0.3,
      0.05
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      px * 0.03,
      0.05
    );
  });

  return (
    <group position={[0, 0.3, -5.5]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[26, 15, 1, 1]} />
        <meshStandardMaterial
          map={texture || null}
          color="#ffffff"
          roughness={0.42}
          metalness={0.06}
        />
      </mesh>

      {/* Deep Room Architectural Lighting */}
      <pointLight position={[-4, 3, -3.5]} intensity={1.8} color="#FFDCAD" distance={12} />
      <pointLight position={[4, 3, -3.5]} intensity={1.5} color="#FFE6C4" distance={12} />
    </group>
  );
};

// --------------------------------------------------------------------------
// 5. Ambient Golden Dust Motes & Atmospheric Floating Bokeh
// --------------------------------------------------------------------------
const GoldenAmbientMotes: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const [particlePositions] = useMemo(() => {
    const count = 48;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 5.0 - 2.0;
      pos[i * 3 + 2] = Math.random() * 4.5 - 2.5;
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.022;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.03;
    }
  });

  return (
    <group position={[0, 0.5, -0.8]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#FFE2A8"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
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

  // High-density subdivided curved plane for optical 3D depth flexion
  const curvedGeometry = useMemo(() => {
    const [w, h] = [item.baseScale[0], item.baseScale[1]];
    const geom = new THREE.PlaneGeometry(w, h, 36, 36);
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

    // Smooth transition opacity
    const targetOpacity = isActive ? 1.0 : 0.0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, delta * 5.0);

    if (matRef.current) {
      matRef.current.opacity = opacityRef.current;
      matRef.current.transparent = true;
    }

    // Hide inactive layers completely to conserve rendering draw calls
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
      {/* 1. Main Realistic 2.5D Depth Curved Hero Mesh */}
      <mesh ref={meshRef} geometry={curvedGeometry}>
        <meshPhysicalMaterial
          ref={matRef}
          map={texture || null}
          roughness={0.32}
          metalness={0.08}
          clearcoat={0.35}
          clearcoatRoughness={0.25}
          sheen={0.85}
          sheenColor={new THREE.Color(item.accentColor)}
          toneMapped={true}
        />
      </mesh>

      {/* 2. Soft Glowing Golden Rim Halo */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[item.baseScale[0] * 1.04, item.baseScale[1] * 1.04]} />
        <meshBasicMaterial
          color={item.rimColor}
          transparent={true}
          opacity={0.18}
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

      {/* 4. Individual Intimate Golden Accent Light Tracking the Selected Furniture */}
      <pointLight
        position={[0.8, 0.6, 1.2]}
        intensity={0.9}
        color={item.rimColor}
        distance={4.2}
      />
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

    // Dynamic mouse spotlight tracking
    if (mouseLightRef.current) {
      mouseLightRef.current.position.x = THREE.MathUtils.lerp(
        mouseLightRef.current.position.x,
        state.pointer.x * 2.8 + 1.0,
        0.08
      );
      mouseLightRef.current.position.y = THREE.MathUtils.lerp(
        mouseLightRef.current.position.y,
        state.pointer.y * 2.0 + 0.8,
        0.08
      );
    }
  });

  return (
    <group>
      {/* 1. Deep Parallax Neoclassical Salon Interior Backdrop */}
      <ArchitecturalSalonBackdrop texture={backdropTexture} />

      {/* 2. Ambient Floating Golden Bokeh Dust */}
      <GoldenAmbientMotes />

      {/* 3. Ultra-Realistic Interactive 2.5D Depth-Mesh Furniture Showcase */}
      {SHOWCASE_ITEMS.map((item, idx) => (
        <DepthMeshHeroPlane
          key={item.id}
          item={item}
          texture={textures[item.id] || null}
          isActive={activeModelIndex === idx}
          index={idx}
        />
      ))}

      {/* 4. Cursor Interactive Dynamic Spotlight */}
      <pointLight
        ref={mouseLightRef}
        position={[1.5, 1.2, 2.2]}
        intensity={1.2}
        color="#FFE9C2"
        distance={6.5}
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
// 8. Main Exported Component: Ultra-Realistic 2.5D Parallax & Depth Canvas
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
          'radial-gradient(ellipse at 72% 35%, #22342E 0%, #14221E 35%, #0B1311 70%, #050807 100%)',
        contain: 'strict',
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
      }}
    >
      {hasWebGL && (
        <Canvas
          dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1]}
          camera={{ position: [0, 0.1, 4.2], fov: 38 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
          className="w-full h-full"
        >
          {/* Atmospheric Depth Mist - Soft distant falloff */}
          <fog attach="fog" args={['#081411', 14.0, 36.0]} />

          {/* Three-Point Luxury Studio Illumination */}
          {/* 1. Warm Golden Key Light */}
          <directionalLight
            position={[-4.5, 6.0, 3.5]}
            intensity={2.4}
            color="#FFF7EC"
          />

          {/* 2. Soft Ambient Salon Fill */}
          <ambientLight intensity={1.1} color="#FFFBF5" />

          {/* 3. Cool Accent Sky/Window Fill */}
          <directionalLight
            position={[4.0, 4.0, 2.5]}
            intensity={0.8}
            color="#A8C8E5"
          />

          {/* 4. Golden Rim Backlight */}
          <directionalLight
            position={[0, 4.5, -3.5]}
            intensity={1.2}
            color="#FFC56E"
          />

          <CinematicStageOrchestrator
            onSectionChange={onSectionChange}
            activeModelIndex={activeModelIndex}
          />
        </Canvas>
      )}

      {/* Layer 1: Left-to-Right Editorial Vignette ensuring crisp text legibility while revealing background salon */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030807]/85 via-[#030807]/35 to-transparent pointer-events-none" />

      {/* Layer 2: Top-and-Bottom Architectural Soft Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030807]/60 via-transparent to-[#030807]/80 pointer-events-none" />

      {/* Layer 3: Warm Golden Studio Rim Glow Accent on Right Edge */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
    </div>
  );
};
