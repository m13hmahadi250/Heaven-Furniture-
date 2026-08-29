import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useGLTF,
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  Float,
  Html,
  useProgress
} from '@react-three/drei';
import * as THREE from 'three';
import { WoodType, FabricType } from '../../types';
import { WOOD_OPTIONS, FABRIC_OPTIONS } from '../../data/furnitureData';
import {
  RotateCw,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Compass,
  Maximize2,
  Minimize2,
  Camera,
  Eye,
  Check,
  Box,
  Palette,
  ShieldCheck,
  RefreshCw,
  Sliders
} from 'lucide-react';

export type LightingMood = 'warm-studio' | 'daylight' | 'dark-luxury' | 'golden-hour';

export interface Hotspot {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  position: [number, number, number];
  cameraTarget: { radius: number; theta: number; phi: number; targetY: number };
}

interface FurnitureViewer3DProps {
  modelType: 'armchair' | 'sofa' | 'dining-table' | 'bed' | 'executive-desk';
  selectedWood: WoodType;
  selectedFabric: FabricType;
  exploded: boolean;
  onToggleExploded?: () => void;
  lightingMood?: LightingMood;
  interactive?: boolean;
  className?: string;
  showControls?: boolean;
  showHotspots?: boolean;
  onSelectHotspot?: (hotspot: Hotspot | null) => void;
  scaleDimensions?: {
    widthMultiplier?: number;
    depthMultiplier?: number;
    heightMultiplier?: number;
  };
}

// Map models to local or CDN GLB assets
const MODEL_URLS: Record<string, string> = {
  armchair: '/models/armchair.glb',
  sofa: '/models/sofa.glb',
  'dining-table': '/models/armchair.glb',
  bed: '/models/armchair.glb',
  'executive-desk': '/models/sofa.glb'
};

const CDN_FALLBACKS: Record<string, string> = {
  armchair: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb',
  sofa: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb',
  'dining-table': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb',
  bed: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb',
  'executive-desk': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb'
};

// Luxury Shimmer Loading Indicator Component
const LuxuryLoader: React.FC = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/85 backdrop-blur-md border border-amber-500/30 text-white min-w-[260px] shadow-2xl animate-fadeIn">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border border-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white font-heading-bold">
            Loading Bespoke Asset
          </div>
          <div className="text-[10px] text-amber-400 font-mono">
            {progress > 0 ? `${Math.round(progress)}% Loaded` : 'Initializing 3D Studio...'}
          </div>
        </div>

        {/* Shimmer progress bar */}
        <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden relative">
          <div
            className="bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(progress, 15)}%` }}
          />
        </div>
      </div>
    </Html>
  );
};

// Inner 3D GLTF Model Component with Material Overrides & Exploded Animation
interface ModelProps {
  modelType: string;
  woodHex: string;
  fabricHex: string;
  exploded: boolean;
  scaleDimensions?: {
    widthMultiplier?: number;
    depthMultiplier?: number;
    heightMultiplier?: number;
  };
}

const GLTFModel: React.FC<ModelProps> = ({
  modelType,
  woodHex,
  fabricHex,
  exploded,
  scaleDimensions
}) => {
  const url = MODEL_URLS[modelType] || MODEL_URLS.armchair;
  const gltf = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  // Store original positions for exploding animation
  const meshOriginalPositions = useRef<Map<string, THREE.Vector3>>(new Map());

  // Deep clone scene and setup materials
  const clonedScene = useMemo(() => {
    const cloned = gltf.scene.clone(true);

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (!meshOriginalPositions.current.has(mesh.uuid)) {
          meshOriginalPositions.current.set(mesh.uuid, mesh.position.clone());
        }

        // Apply realistic material overrides with Physical PBR parameters (sheen, clearcoat)
        if (mesh.material) {
          const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
          const newMat = new THREE.MeshPhysicalMaterial();

          const name = (mesh.name || '').toLowerCase();
          const matName = (mat.name || '').toLowerCase();

          // Classify if part is wood/legs vs fabric/cushion vs metal/hardware
          const isWood =
            name.includes('leg') ||
            name.includes('wood') ||
            name.includes('frame') ||
            name.includes('base') ||
            name.includes('plinth') ||
            name.includes('trestle') ||
            matName.includes('wood') ||
            matName.includes('leg');

          const isMetal =
            name.includes('metal') ||
            name.includes('brass') ||
            name.includes('gold') ||
            name.includes('ferrule') ||
            matName.includes('metal') ||
            matName.includes('brass');

          if (isWood) {
            newMat.color = new THREE.Color(woodHex);
            newMat.roughness = 0.32;
            newMat.metalness = 0.05;
            newMat.clearcoat = 0.4;
            newMat.clearcoatRoughness = 0.25;
          } else if (isMetal) {
            newMat.color = new THREE.Color('#D4AF37');
            newMat.roughness = 0.2;
            newMat.metalness = 0.92;
          } else {
            // Luxury Velvet / Bouclé Upholstery with PBR Sheen Micro-Fiber Highlights
            newMat.color = new THREE.Color(fabricHex);
            newMat.roughness = 0.88;
            newMat.metalness = 0.02;
            newMat.sheen = 1.0;
            newMat.sheenRoughness = 0.45;
            // Determine sheen rim tint
            if (fabricHex.toLowerCase() === '#0f3832' || fabricHex.toLowerCase() === '#0c3843') {
              newMat.sheenColor = new THREE.Color('#68D391');
            } else {
              newMat.sheenColor = new THREE.Color('#FAF5EE');
            }
          }

          mesh.material = newMat;
        }
      }
    });

    return cloned;
  }, [gltf.scene, woodHex, fabricHex]);

  // Handle Explode Animation & Scaling inside useFrame
  useFrame((_, delta) => {
    if (!clonedScene) return;

    const explodeFactor = exploded ? 1.0 : 0.0;
    const lerpSpeed = delta * 5.0;

    let index = 0;
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const origPos = meshOriginalPositions.current.get(mesh.uuid);
        if (origPos) {
          // Calculate directional explode offset based on hierarchy index and name
          const name = (mesh.name || '').toLowerCase();
          let targetX = origPos.x;
          let targetY = origPos.y;
          let targetZ = origPos.z;

          if (exploded) {
            if (name.includes('cushion') || name.includes('seat')) {
              targetY += 0.45;
            } else if (name.includes('back')) {
              targetZ -= 0.35;
              targetY += 0.2;
            } else if (name.includes('leg') || name.includes('base')) {
              targetY -= 0.25;
            } else if (index % 2 === 0) {
              targetX += 0.25;
              targetY += 0.15;
            } else {
              targetX -= 0.25;
              targetY += 0.15;
            }
          }

          mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetX, lerpSpeed);
          mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, lerpSpeed);
          mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, lerpSpeed);
        }
        index++;
      }
    });
  });

  const sx = scaleDimensions?.widthMultiplier ?? 1;
  const sy = scaleDimensions?.heightMultiplier ?? 1;
  const sz = scaleDimensions?.depthMultiplier ?? 1;

  return (
    <group ref={modelRef} scale={[sx, sy, sz]}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Camera Controller for View Presets
interface CameraControllerProps {
  viewPreset: 'perspective' | 'front' | 'top' | 'side' | 'macro';
}

const CameraController: React.FC<CameraControllerProps> = ({ viewPreset }) => {
  const { camera } = useThree();

  useEffect(() => {
    const duration = 1000;
    const startPos = camera.position.clone();
    let targetPos = new THREE.Vector3(2.8, 2.0, 3.2);

    switch (viewPreset) {
      case 'front':
        targetPos = new THREE.Vector3(0, 0.4, 3.8);
        break;
      case 'top':
        targetPos = new THREE.Vector3(0, 4.5, 0.1);
        break;
      case 'side':
        targetPos = new THREE.Vector3(3.8, 0.4, 0);
        break;
      case 'macro':
        targetPos = new THREE.Vector3(1.2, 0.3, 1.4);
        break;
      case 'perspective':
      default:
        targetPos = new THREE.Vector3(2.8, 2.0, 3.2);
        break;
    }

    const startTime = performance.now();
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out

      camera.position.lerpVectors(startPos, targetPos, ease);
      camera.lookAt(0, 0, 0);

      if (progress < 1.0) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [viewPreset, camera]);

  return null;
};

// Main Exported FurnitureViewer3D Component
export const FurnitureViewer3D: React.FC<FurnitureViewer3DProps> = ({
  modelType = 'armchair',
  selectedWood = 'chittagong-teak',
  selectedFabric = 'ivory-boucle',
  exploded = false,
  onToggleExploded,
  lightingMood = 'warm-studio',
  showControls = true,
  scaleDimensions
}) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeMood, setActiveMood] = useState<LightingMood>(lightingMood);
  const [viewPreset, setViewPreset] = useState<'perspective' | 'front' | 'top' | 'side' | 'macro'>('perspective');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lightingMood) {
      setActiveMood(lightingMood);
    }
  }, [lightingMood]);

  // Lookup wood and fabric color hexes
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const activeWoodObj = WOOD_OPTIONS.find((w) => w.id === selectedWood) || WOOD_OPTIONS[0];
  const activeFabricObj = FABRIC_OPTIONS.find((f) => f.id === selectedFabric) || FABRIC_OPTIONS[0];

  const woodHex = activeWoodObj?.colorHex || '#8C5024';
  const fabricHex = activeFabricObj?.colorHex || '#E8E0D5';

  // Environment preset mapping
  const envPreset = useMemo(() => {
    switch (activeMood) {
      case 'daylight':
        return 'city';
      case 'dark-luxury':
        return 'night';
      case 'golden-hour':
        return 'sunset';
      case 'warm-studio':
      default:
        return 'studio';
    }
  }, [activeMood]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-b from-[#0F0F0F] via-[#0A0A0A] to-[#050505] select-none group font-sans"
    >
      {/* 3D Canvas Context */}
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1]}
        camera={{ position: [2.8, 2.0, 3.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: activeMood === 'dark-luxury' ? 0.85 : 1.2
        }}
        className="w-full h-full"
      >
        <CameraController viewPreset={viewPreset} />

        {/* Ambient & Studio Directional Key Lights */}
        <ambientLight intensity={activeMood === 'dark-luxury' ? 0.3 : 0.6} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={activeMood === 'dark-luxury' ? 1.0 : 1.8}
          color={activeMood === 'golden-hour' ? '#FFA552' : '#FFF5EA'}
        />
        <directionalLight
          position={[-5, 4, -4]}
          intensity={0.6}
          color="#B0C4DE"
        />
        <pointLight position={[0, -0.4, 0]} intensity={0.4} color="#D4AF37" />

        {/* HDRI Studio Reflection Environment */}
        <Environment preset={envPreset as any} />

        <Suspense fallback={<LuxuryLoader />}>
          <Center top={false} position={[0, -0.15, 0]}>
            <GLTFModel
              modelType={modelType}
              woodHex={woodHex}
              fabricHex={fabricHex}
              exploded={exploded}
              scaleDimensions={scaleDimensions}
            />
          </Center>

          {/* Hyper-Realistic Soft Ground Contact Shadows */}
          <ContactShadows
            position={[0, -1.02, 0]}
            opacity={0.75}
            scale={12}
            blur={2.0}
            far={4}
            frames={1}
            color="#050C0E"
            resolution={512}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          autoRotate={autoRotate}
          autoRotateSpeed={0.9}
          enableDamping
          dampingFactor={0.05}
          minDistance={1.6}
          maxDistance={7.5}
          maxPolarAngle={Math.PI / 2 + 0.05}
        />
      </Canvas>

      {/* Top Left: Active Timber & Upholstery Indicator */}
      <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none z-10">
        <div className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-xl flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner flex-shrink-0"
            style={{ backgroundColor: woodHex }}
          />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-200">
            {activeWoodObj.name.split(' (')[0]}
          </span>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-xl flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner flex-shrink-0"
            style={{ backgroundColor: fabricHex }}
          />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-200">
            {activeFabricObj.name}
          </span>
        </div>
      </div>

      {/* Top Right: Studio HUD Controls (Auto-Rotate, Lighting, Fullscreen) */}
      {showControls && (
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          
          {/* Lighting Mood Switcher */}
          <div className="flex items-center p-1 bg-black/80 backdrop-blur-md rounded-full border border-white/15 shadow-xl">
            <button
              onClick={() => setActiveMood('warm-studio')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                activeMood === 'warm-studio' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
              title="Warm Studio Lighting"
            >
              <Sun className="w-3 h-3" />
              <span className="hidden sm:inline">Studio</span>
            </button>
            <button
              onClick={() => setActiveMood('daylight')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                activeMood === 'daylight' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
              title="Daylight Sky Lighting"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Day</span>
            </button>
            <button
              onClick={() => setActiveMood('dark-luxury')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                activeMood === 'dark-luxury' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
              title="Dark Luxury Lounge Lighting"
            >
              <Moon className="w-3 h-3" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-black/80 hover:bg-white text-gray-300 hover:text-black rounded-full backdrop-blur-md border border-white/15 transition-all shadow-xl"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Bottom Center Bar: Camera Angles, Turntable, and Explode */}
      {showControls && (
        <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
          
          {/* Left: View Angles */}
          <div className="flex items-center gap-1 p-1 bg-black/80 backdrop-blur-md rounded-2xl border border-white/15 shadow-xl pointer-events-auto">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest px-2 hidden md:inline">
              Angles:
            </span>
            {(['perspective', 'front', 'side', 'top', 'macro'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setViewPreset(view)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  viewPreset === view
                    ? 'bg-white text-black font-extrabold shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Right: Explode / Turntable Action Buttons */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-xl ${
                autoRotate
                  ? 'bg-amber-500 text-black border-amber-500 shadow-amber-500/20'
                  : 'bg-black/80 text-gray-300 border-white/15 hover:text-white'
              }`}
              title="Toggle 360° Turntable Auto-Rotation"
            >
              <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              <span>360° Turntable</span>
            </button>

            {onToggleExploded && (
              <button
                onClick={onToggleExploded}
                className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-xl ${
                  exploded
                    ? 'bg-amber-500 text-black border-amber-500 ring-2 ring-amber-400/50'
                    : 'bg-black/80 text-amber-400 border-amber-500/40 hover:bg-amber-500 hover:text-black'
                }`}
                title="Explode/Collapse Construction Layers"
              >
                <Layers className="w-3 h-3" />
                <span>{exploded ? 'Collapse' : 'Explode Layers'}</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* Interaction Hint */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[9px] uppercase tracking-widest text-gray-400 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Drag to Orbit • Scroll to Zoom • Right Click to Pan
      </div>
    </div>
  );
};

// Preload models for immediate instant render
useGLTF.preload(MODEL_URLS.armchair);
useGLTF.preload(MODEL_URLS.sofa);
