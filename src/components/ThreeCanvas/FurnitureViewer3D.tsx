import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  RoundedBox,
  Cylinder,
  Html
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
  Minimize2,
  Maximize2,
  Ruler
} from 'lucide-react';
import {
  DimensionGuides3D,
  DimensionsHUDCard,
  DimensionUnit,
  ModelDimensions
} from './DimensionOverlay3D';
import { Studio3DViewportSkeleton } from '../SkeletonLoaders';

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
  customDimensions?: ModelDimensions;
  showDimensions?: boolean;
  onToggleDimensions?: () => void;
  initialShowDimensions?: boolean;
}

// --------------------------------------------------------------------------
// 1. Procedural PBR Material Factory
// --------------------------------------------------------------------------
function useStudioMaterials(woodHex: string, fabricHex: string) {
  return useMemo(() => {
    // 1. Wood / Timber Material with physical clearcoat
    const woodMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(woodHex),
      roughness: 0.32,
      metalness: 0.04,
      clearcoat: 0.45,
      clearcoatRoughness: 0.2,
    });

    // 2. Velvet / Bouclé / Leather Upholstery with Physical Sheen
    const fabricMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(fabricHex),
      roughness: 0.86,
      metalness: 0.02,
      sheen: 1.0,
      sheenRoughness: 0.4,
      sheenColor: new THREE.Color(
        fabricHex.toLowerCase() === '#0f3832' || fabricHex.toLowerCase() === '#0c3843'
          ? '#68D391'
          : '#FAF5EE'
      ),
    });

    // 3. 24K Polished Champagne Brass / Gold Leaf
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4AF37'),
      roughness: 0.22,
      metalness: 0.9,
    });

    // 4. White Carrara / Italian Polished Marble
    const marbleMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F5F3ED'),
      roughness: 0.15,
      metalness: 0.02,
    });

    // 5. Smoked Glass Vitrine
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#102220'),
      transmission: 0.85,
      opacity: 0.8,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    });

    // 6. Deep Dark Walnut Internal Core
    const darkCoreMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1E130D'),
      roughness: 0.6,
      metalness: 0.02,
    });

    // 7. Cream Mattress / Sheet Material
    const creamMattressMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#EDE8DF'),
      roughness: 0.9,
      metalness: 0.01,
    });

    return {
      woodMaterial,
      fabricMaterial,
      brassMaterial,
      marbleMaterial,
      glassMaterial,
      darkCoreMaterial,
      creamMattressMaterial,
    };
  }, [woodHex, fabricHex]);
}

// --------------------------------------------------------------------------
// 2. Procedural Models for Each Furniture Archetype
// --------------------------------------------------------------------------

// A. Armchair (Heritage Teak & Damask Armchair)
const ProceduralArmchair: React.FC<{
  materials: ReturnType<typeof useStudioMaterials>;
  exploded: boolean;
}> = ({ materials, exploded }) => {
  const cushionRef = useRef<THREE.Group>(null);
  const backrestRef = useRef<THREE.Group>(null);
  const armsRef = useRef<THREE.Group>(null);
  const legsRef = useRef<THREE.Group>(null);
  const crestRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const lerpSpeed = delta * 6;
    const factor = exploded ? 1 : 0;

    if (cushionRef.current) {
      cushionRef.current.position.y = THREE.MathUtils.lerp(
        cushionRef.current.position.y,
        factor * 0.45,
        lerpSpeed
      );
    }
    if (backrestRef.current) {
      backrestRef.current.position.z = THREE.MathUtils.lerp(
        backrestRef.current.position.z,
        -factor * 0.35,
        lerpSpeed
      );
      backrestRef.current.position.y = THREE.MathUtils.lerp(
        backrestRef.current.position.y,
        factor * 0.25,
        lerpSpeed
      );
    }
    if (armsRef.current) {
      armsRef.current.position.y = THREE.MathUtils.lerp(
        armsRef.current.position.y,
        factor * 0.15,
        lerpSpeed
      );
    }
    if (legsRef.current) {
      legsRef.current.position.y = THREE.MathUtils.lerp(
        legsRef.current.position.y,
        -factor * 0.3,
        lerpSpeed
      );
    }
    if (crestRef.current) {
      crestRef.current.position.y = THREE.MathUtils.lerp(
        crestRef.current.position.y,
        factor * 0.55,
        lerpSpeed
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Base Seat Frame */}
      <RoundedBox args={[1.2, 0.12, 1.1]} radius={0.03} smoothness={4} position={[0, 0.42, 0]}>
        <primitive object={materials.woodMaterial} attach="material" />
      </RoundedBox>

      {/* 4 Turned Legs with Brass Ferrules */}
      <group ref={legsRef}>
        {[
          [-0.48, -0.42],
          [0.48, -0.42],
          [-0.48, 0.42],
          [0.48, 0.42],
        ].map(([x, z], i) => (
          <group key={i} position={[x, 0.18, z]}>
            <Cylinder args={[0.038, 0.026, 0.36, 16]} position={[0, 0, 0]}>
              <primitive object={materials.woodMaterial} attach="material" />
            </Cylinder>
            {/* Brass Ferrule Tip */}
            <Cylinder args={[0.027, 0.025, 0.08, 16]} position={[0, -0.14, 0]}>
              <primitive object={materials.brassMaterial} attach="material" />
            </Cylinder>
          </group>
        ))}
      </group>

      {/* Plush Seat Cushion */}
      <group ref={cushionRef} position={[0, 0, 0]}>
        <RoundedBox args={[1.1, 0.18, 1.0]} radius={0.06} smoothness={6} position={[0, 0.54, 0.02]}>
          <primitive object={materials.fabricMaterial} attach="material" />
        </RoundedBox>
      </group>

      {/* Tufted Padded Backrest */}
      <group ref={backrestRef} position={[0, 0, 0]}>
        <RoundedBox
          args={[1.08, 0.85, 0.18]}
          radius={0.06}
          smoothness={6}
          position={[0, 0.98, -0.45]}
          rotation={[-0.1, 0, 0]}
        >
          <primitive object={materials.fabricMaterial} attach="material" />
        </RoundedBox>
        {/* Tufting Accent Buttons */}
        {[-0.32, 0, 0.32].map((bx, bi) =>
          [0.85, 1.05, 1.25].map((by, bj) => (
            <mesh key={`${bi}-${bj}`} position={[bx, by, -0.35]}>
              <sphereGeometry args={[0.02, 12, 12]} />
              <primitive object={materials.brassMaterial} attach="material" />
            </mesh>
          ))
        )}
      </group>

      {/* Sculpted Armrests */}
      <group ref={armsRef}>
        {[-0.56, 0.56].map((ax, ai) => (
          <group key={ai} position={[ax, 0.72, -0.05]}>
            <RoundedBox args={[0.12, 0.42, 0.95]} radius={0.04} smoothness={4}>
              <primitive object={materials.woodMaterial} attach="material" />
            </RoundedBox>
            <RoundedBox args={[0.14, 0.06, 0.9]} radius={0.03} smoothness={4} position={[0, 0.22, 0]}>
              <primitive object={materials.fabricMaterial} attach="material" />
            </RoundedBox>
            {/* Front Armrest Gold Rosette */}
            <Cylinder
              args={[0.035, 0.035, 0.02, 16]}
              position={[0, 0.12, 0.48]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <primitive object={materials.brassMaterial} attach="material" />
            </Cylinder>
          </group>
        ))}
      </group>

      {/* Top Hand-Carved Crest Rail */}
      <group ref={crestRef}>
        <RoundedBox
          args={[1.14, 0.14, 0.1]}
          radius={0.04}
          smoothness={4}
          position={[0, 1.44, -0.48]}
        >
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
        {/* Central Gold Crest Finial */}
        <mesh position={[0, 1.54, -0.48]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <primitive object={materials.brassMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
};

// B. Sofa (Royal Sapphire & Gold Damask Sofa)
const ProceduralSofa: React.FC<{
  materials: ReturnType<typeof useStudioMaterials>;
  exploded: boolean;
}> = ({ materials, exploded }) => {
  const cushionsRef = useRef<THREE.Group>(null);
  const backrestRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);
  const pillowsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const lerpSpeed = delta * 6;
    const factor = exploded ? 1 : 0;

    if (cushionsRef.current) {
      cushionsRef.current.position.y = THREE.MathUtils.lerp(
        cushionsRef.current.position.y,
        factor * 0.45,
        lerpSpeed
      );
    }
    if (backrestRef.current) {
      backrestRef.current.position.z = THREE.MathUtils.lerp(
        backrestRef.current.position.z,
        -factor * 0.38,
        lerpSpeed
      );
    }
    if (baseRef.current) {
      baseRef.current.position.y = THREE.MathUtils.lerp(
        baseRef.current.position.y,
        -factor * 0.28,
        lerpSpeed
      );
    }
    if (pillowsRef.current) {
      pillowsRef.current.position.y = THREE.MathUtils.lerp(
        pillowsRef.current.position.y,
        factor * 0.6,
        lerpSpeed
      );
      pillowsRef.current.position.z = THREE.MathUtils.lerp(
        pillowsRef.current.position.z,
        factor * 0.35,
        lerpSpeed
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Plinth Base & 6 Feet */}
      <group ref={baseRef}>
        <RoundedBox args={[2.5, 0.12, 1.15]} radius={0.03} smoothness={4} position={[0, 0.34, 0]}>
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
        {/* Plinth Gold Trim Ribbon */}
        <RoundedBox args={[2.52, 0.025, 1.17]} radius={0.01} smoothness={2} position={[0, 0.39, 0]}>
          <primitive object={materials.brassMaterial} attach="material" />
        </RoundedBox>
        {/* 6 Carved Feet */}
        {[-1.1, 0, 1.1].map((fx, fi) =>
          [-0.45, 0.45].map((fz, fj) => (
            <group key={`${fi}-${fj}`} position={[fx, 0.14, fz]}>
              <Cylinder args={[0.045, 0.032, 0.26, 16]}>
                <primitive object={materials.woodMaterial} attach="material" />
              </Cylinder>
              <Cylinder args={[0.034, 0.03, 0.06, 16]} position={[0, -0.1, 0]}>
                <primitive object={materials.brassMaterial} attach="material" />
              </Cylinder>
            </group>
          ))
        )}
      </group>

      {/* 3 Contoured Seat Cushions */}
      <group ref={cushionsRef}>
        {[-0.72, 0, 0.72].map((cx, ci) => (
          <RoundedBox
            key={ci}
            args={[0.68, 0.2, 0.95]}
            radius={0.06}
            smoothness={6}
            position={[cx, 0.49, 0.05]}
          >
            <primitive object={materials.fabricMaterial} attach="material" />
          </RoundedBox>
        ))}
      </group>

      {/* Deep Tufted Backrest & Rolled Arms */}
      <group ref={backrestRef}>
        <RoundedBox
          args={[2.42, 0.75, 0.22]}
          radius={0.08}
          smoothness={6}
          position={[0, 0.88, -0.45]}
          rotation={[-0.08, 0, 0]}
        >
          <primitive object={materials.fabricMaterial} attach="material" />
        </RoundedBox>
        {/* Rolled Chesterfield Left & Right Arms */}
        {[-1.22, 1.22].map((rx, ri) => (
          <group key={ri} position={[rx, 0.72, -0.02]}>
            <RoundedBox args={[0.22, 0.52, 1.1]} radius={0.08} smoothness={6}>
              <primitive object={materials.fabricMaterial} attach="material" />
            </RoundedBox>
            {/* Front Armrest Gold Medallion */}
            <Cylinder
              args={[0.05, 0.05, 0.02, 16]}
              position={[0, 0.1, 0.56]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <primitive object={materials.brassMaterial} attach="material" />
            </Cylinder>
          </group>
        ))}
        {/* Backrest Gold Crest Molding */}
        <RoundedBox args={[2.3, 0.08, 0.12]} radius={0.03} smoothness={4} position={[0, 1.28, -0.48]}>
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
      </group>

      {/* Accent Lumbar Pillows */}
      <group ref={pillowsRef}>
        {[-0.65, 0.65].map((px, pi) => (
          <group key={pi} position={[px, 0.68, 0.25]} rotation={[0.2, (pi === 0 ? 0.3 : -0.3), 0]}>
            <RoundedBox args={[0.36, 0.32, 0.12]} radius={0.06} smoothness={6}>
              <primitive object={materials.fabricMaterial} attach="material" />
            </RoundedBox>
          </group>
        ))}
      </group>
    </group>
  );
};

// C. Dining Table Suite (Imperial Pearl & Marble Dining Suite with Chairs)
const ProceduralDiningTable: React.FC<{
  materials: ReturnType<typeof useStudioMaterials>;
  exploded: boolean;
}> = ({ materials, exploded }) => {
  const topRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);
  const chairsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const lerpSpeed = delta * 6;
    const factor = exploded ? 1 : 0;

    if (topRef.current) {
      topRef.current.position.y = THREE.MathUtils.lerp(
        topRef.current.position.y,
        factor * 0.45,
        lerpSpeed
      );
    }
    if (baseRef.current) {
      baseRef.current.position.y = THREE.MathUtils.lerp(
        baseRef.current.position.y,
        -factor * 0.25,
        lerpSpeed
      );
    }
    if (chairsRef.current) {
      chairsRef.current.position.z = THREE.MathUtils.lerp(
        chairsRef.current.position.z,
        factor * 0.35,
        lerpSpeed
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Table Top (Polished Marble + Gold Inset Edge) */}
      <group ref={topRef} position={[0, 0.72, 0]}>
        <RoundedBox args={[2.4, 0.08, 1.2]} radius={0.03} smoothness={4}>
          <primitive object={materials.marbleMaterial} attach="material" />
        </RoundedBox>
        <RoundedBox args={[2.42, 0.02, 1.22]} radius={0.01} smoothness={2} position={[0, -0.04, 0]}>
          <primitive object={materials.brassMaterial} attach="material" />
        </RoundedBox>
        {/* Centerpiece Gold Tray */}
        <RoundedBox args={[0.5, 0.02, 0.3]} radius={0.01} smoothness={2} position={[0, 0.05, 0]}>
          <primitive object={materials.brassMaterial} attach="material" />
        </RoundedBox>
      </group>

      {/* Twin Carved Pedestal Bases with Trestle Stretcher */}
      <group ref={baseRef}>
        {[-0.65, 0.65].map((px, pi) => (
          <group key={pi} position={[px, 0.34, 0]}>
            {/* Fluted Column */}
            <Cylinder args={[0.14, 0.18, 0.6, 20]}>
              <primitive object={materials.woodMaterial} attach="material" />
            </Cylinder>
            {/* Brass Collar Rings */}
            <Cylinder args={[0.15, 0.15, 0.04, 20]} position={[0, 0.22, 0]}>
              <primitive object={materials.brassMaterial} attach="material" />
            </Cylinder>
            <Cylinder args={[0.19, 0.19, 0.04, 20]} position={[0, -0.24, 0]}>
              <primitive object={materials.brassMaterial} attach="material" />
            </Cylinder>
            {/* Pedestal Foot Cross */}
            <RoundedBox args={[0.7, 0.08, 0.7]} radius={0.03} smoothness={4} position={[0, -0.3, 0]}>
              <primitive object={materials.woodMaterial} attach="material" />
            </RoundedBox>
          </group>
        ))}
        {/* Connecting Carved Trestle Stretcher */}
        <RoundedBox args={[1.3, 0.06, 0.08]} radius={0.02} smoothness={3} position={[0, 0.18, 0]}>
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
      </group>

      {/* 4 Surrounding High-Back Chairs */}
      <group ref={chairsRef}>
        {[
          [-0.6, -0.85, 0],
          [0.6, -0.85, 0],
          [-0.6, 0.85, Math.PI],
          [0.6, 0.85, Math.PI],
        ].map(([cx, cz, crot], ci) => (
          <group key={ci} position={[cx, 0, cz]} rotation={[0, crot, 0]}>
            {/* Chair Base & Legs */}
            <RoundedBox args={[0.42, 0.06, 0.42]} radius={0.02} smoothness={3} position={[0, 0.4, 0]}>
              <primitive object={materials.woodMaterial} attach="material" />
            </RoundedBox>
            {/* Chair Legs */}
            {[
              [-0.17, -0.17],
              [0.17, -0.17],
              [-0.17, 0.17],
              [0.17, 0.17],
            ].map(([lx, lz], li) => (
              <Cylinder key={li} args={[0.018, 0.014, 0.38, 12]} position={[lx, 0.2, lz]}>
                <primitive object={materials.woodMaterial} attach="material" />
              </Cylinder>
            ))}
            {/* Cushion */}
            <RoundedBox args={[0.4, 0.08, 0.4]} radius={0.03} smoothness={4} position={[0, 0.46, 0]}>
              <primitive object={materials.fabricMaterial} attach="material" />
            </RoundedBox>
            {/* Backrest */}
            <RoundedBox args={[0.38, 0.48, 0.06]} radius={0.02} smoothness={4} position={[0, 0.72, -0.18]}>
              <primitive object={materials.fabricMaterial} attach="material" />
            </RoundedBox>
          </group>
        ))}
      </group>
    </group>
  );
};

// D. Bed (Royal Baroque 4-Poster Teak King Bed)
const ProceduralBed: React.FC<{
  materials: ReturnType<typeof useStudioMaterials>;
  exploded: boolean;
}> = ({ materials, exploded }) => {
  const canopyRef = useRef<THREE.Group>(null);
  const mattressRef = useRef<THREE.Group>(null);
  const headboardRef = useRef<THREE.Group>(null);
  const pillowsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const lerpSpeed = delta * 6;
    const factor = exploded ? 1 : 0;

    if (canopyRef.current) {
      canopyRef.current.position.y = THREE.MathUtils.lerp(
        canopyRef.current.position.y,
        factor * 0.5,
        lerpSpeed
      );
    }
    if (mattressRef.current) {
      mattressRef.current.position.y = THREE.MathUtils.lerp(
        mattressRef.current.position.y,
        factor * 0.3,
        lerpSpeed
      );
    }
    if (headboardRef.current) {
      headboardRef.current.position.z = THREE.MathUtils.lerp(
        headboardRef.current.position.z,
        -factor * 0.4,
        lerpSpeed
      );
    }
    if (pillowsRef.current) {
      pillowsRef.current.position.y = THREE.MathUtils.lerp(
        pillowsRef.current.position.y,
        factor * 0.55,
        lerpSpeed
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 4 Architectural Fluted Posts */}
      {[
        [-0.95, -1.05],
        [0.95, -1.05],
        [-0.95, 1.05],
        [0.95, 1.05],
      ].map(([px, pz], pi) => (
        <group key={pi} position={[px, 0.95, pz]}>
          <Cylinder args={[0.045, 0.045, 1.85, 16]}>
            <primitive object={materials.woodMaterial} attach="material" />
          </Cylinder>
          {/* Top Gold Finial Sphere */}
          <mesh position={[0, 0.96, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <primitive object={materials.brassMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Canopy Crown Rails */}
      <group ref={canopyRef} position={[0, 1.85, 0]}>
        <RoundedBox args={[1.98, 0.06, 0.06]} radius={0.01} smoothness={2} position={[0, 0, -1.05]}>
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
        <RoundedBox args={[1.98, 0.06, 0.06]} radius={0.01} smoothness={2} position={[0, 0, 1.05]}>
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
        <RoundedBox args={[0.06, 0.06, 2.16]} radius={0.01} smoothness={2} position={[-0.95, 0, 0]}>
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
        <RoundedBox args={[0.06, 0.06, 2.16]} radius={0.01} smoothness={2} position={[0.95, 0, 0]}>
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
      </group>

      {/* Bed Base Frame & Footboard */}
      <RoundedBox args={[1.9, 0.22, 2.1]} radius={0.04} smoothness={4} position={[0, 0.28, 0]}>
        <primitive object={materials.woodMaterial} attach="material" />
      </RoundedBox>
      <RoundedBox args={[1.92, 0.45, 0.1]} radius={0.04} smoothness={4} position={[0, 0.45, 1.05]}>
        <primitive object={materials.woodMaterial} attach="material" />
      </RoundedBox>

      {/* Luxury Pillow-Top Mattress & Fitted Sheet */}
      <group ref={mattressRef}>
        <RoundedBox args={[1.8, 0.32, 2.0]} radius={0.08} smoothness={6} position={[0, 0.52, 0]}>
          <primitive object={materials.creamMattressMaterial} attach="material" />
        </RoundedBox>
        {/* Luxury Gold Throw Runner */}
        <RoundedBox args={[1.82, 0.04, 0.6]} radius={0.02} smoothness={3} position={[0, 0.68, 0.65]}>
          <primitive object={materials.fabricMaterial} attach="material" />
        </RoundedBox>
      </group>

      {/* Tufted Headboard with Baroque Crest */}
      <group ref={headboardRef}>
        <RoundedBox
          args={[1.86, 0.95, 0.12]}
          radius={0.06}
          smoothness={6}
          position={[0, 0.92, -1.02]}
        >
          <primitive object={materials.fabricMaterial} attach="material" />
        </RoundedBox>
        <RoundedBox args={[1.92, 0.14, 0.14]} radius={0.04} smoothness={4} position={[0, 1.42, -1.02]}>
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
        {/* 24K Gold Headboard Emblem */}
        <mesh position={[0, 1.52, -1.0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <primitive object={materials.brassMaterial} attach="material" />
        </mesh>
      </group>

      {/* Sleeping Pillows */}
      <group ref={pillowsRef}>
        {[-0.45, 0.45].map((px, pi) => (
          <group key={pi} position={[px, 0.72, -0.65]} rotation={[-0.25, 0, 0]}>
            <RoundedBox args={[0.55, 0.18, 0.35]} radius={0.06} smoothness={6}>
              <primitive object={materials.fabricMaterial} attach="material" />
            </RoundedBox>
          </group>
        ))}
      </group>
    </group>
  );
};

// E. Executive Desk / Vitrine (Grand Palace Arched Vitrine & Teak Credenza)
const ProceduralVitrine: React.FC<{
  materials: ReturnType<typeof useStudioMaterials>;
  exploded: boolean;
}> = ({ materials, exploded }) => {
  const doorsRef = useRef<THREE.Group>(null);
  const shelvesRef = useRef<THREE.Group>(null);
  const crownRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const lerpSpeed = delta * 6;
    const factor = exploded ? 1 : 0;

    if (doorsRef.current) {
      doorsRef.current.position.z = THREE.MathUtils.lerp(
        doorsRef.current.position.z,
        factor * 0.4,
        lerpSpeed
      );
    }
    if (shelvesRef.current) {
      shelvesRef.current.position.y = THREE.MathUtils.lerp(
        shelvesRef.current.position.y,
        factor * 0.25,
        lerpSpeed
      );
    }
    if (crownRef.current) {
      crownRef.current.position.y = THREE.MathUtils.lerp(
        crownRef.current.position.y,
        factor * 0.45,
        lerpSpeed
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Lower Solid Teak Credenza */}
      <RoundedBox args={[1.8, 0.65, 0.75]} radius={0.04} smoothness={4} position={[0, 0.38, 0]}>
        <primitive object={materials.woodMaterial} attach="material" />
      </RoundedBox>
      {/* Brass Hardware Pulls */}
      {[-0.45, 0.45].map((hx, hi) => (
        <mesh key={hi} position={[hx, 0.42, 0.39]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} />
          <primitive object={materials.brassMaterial} attach="material" />
        </mesh>
      ))}

      {/* Upper Vitrine Body & Glass Doors */}
      <group position={[0, 1.25, -0.05]}>
        {/* Side Panels */}
        <RoundedBox args={[0.08, 1.1, 0.6]} radius={0.02} smoothness={3} position={[-0.86, 0, 0]}>
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
        <RoundedBox args={[0.08, 1.1, 0.6]} radius={0.02} smoothness={3} position={[0.86, 0, 0]}>
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
        <RoundedBox args={[1.8, 1.1, 0.06]} radius={0.02} smoothness={3} position={[0, 0, -0.27]}>
          <primitive object={materials.darkCoreMaterial} attach="material" />
        </RoundedBox>
      </group>

      {/* Interior Glass Shelves */}
      <group ref={shelvesRef} position={[0, 0, 0]}>
        {[0.95, 1.3, 1.65].map((sy, si) => (
          <group key={si} position={[0, sy, -0.05]}>
            <RoundedBox args={[1.65, 0.02, 0.5]} radius={0.005} smoothness={2}>
              <primitive object={materials.glassMaterial} attach="material" />
            </RoundedBox>
            {/* LED Ambient Glow Accent */}
            <pointLight position={[0, 0.05, 0]} intensity={0.2} color="#F59E0B" distance={1.2} />
          </group>
        ))}
      </group>

      {/* Arched Glass Doors */}
      <group ref={doorsRef} position={[0, 1.25, 0.26]}>
        {[-0.42, 0.42].map((dx, di) => (
          <group key={di} position={[dx, 0, 0]}>
            <RoundedBox args={[0.78, 1.05, 0.03]} radius={0.02} smoothness={3}>
              <primitive object={materials.glassMaterial} attach="material" />
            </RoundedBox>
            <RoundedBox args={[0.82, 0.04, 0.04]} radius={0.01} smoothness={2} position={[0, 0.52, 0]}>
              <primitive object={materials.woodMaterial} attach="material" />
            </RoundedBox>
          </group>
        ))}
      </group>

      {/* Top Neoclassical Pediment Crown */}
      <group ref={crownRef} position={[0, 1.88, -0.05]}>
        <RoundedBox args={[1.92, 0.14, 0.68]} radius={0.03} smoothness={4}>
          <primitive object={materials.woodMaterial} attach="material" />
        </RoundedBox>
        <RoundedBox args={[1.94, 0.03, 0.7]} radius={0.01} smoothness={2} position={[0, 0.08, 0]}>
          <primitive object={materials.brassMaterial} attach="material" />
        </RoundedBox>
      </group>
    </group>
  );
};

// --------------------------------------------------------------------------
// 3. Dynamic Archetype Switcher & Scaling Wrapper
// --------------------------------------------------------------------------
interface BespokeModelProps {
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

const BespokeModel: React.FC<BespokeModelProps> = ({
  modelType,
  woodHex,
  fabricHex,
  exploded,
  scaleDimensions,
}) => {
  const materials = useStudioMaterials(woodHex, fabricHex);

  const sx = scaleDimensions?.widthMultiplier ?? 1;
  const sy = scaleDimensions?.heightMultiplier ?? 1;
  const sz = scaleDimensions?.depthMultiplier ?? 1;

  const renderArchetype = () => {
    switch (modelType) {
      case 'sofa':
        return <ProceduralSofa materials={materials} exploded={exploded} />;
      case 'dining-table':
        return <ProceduralDiningTable materials={materials} exploded={exploded} />;
      case 'bed':
        return <ProceduralBed materials={materials} exploded={exploded} />;
      case 'executive-desk':
        return <ProceduralVitrine materials={materials} exploded={exploded} />;
      case 'armchair':
      default:
        return <ProceduralArmchair materials={materials} exploded={exploded} />;
    }
  };

  return (
    <group scale={[sx, sy, sz]}>
      {renderArchetype()}
    </group>
  );
};

// --------------------------------------------------------------------------
// 4. Camera Controller with Smooth Angle Transitions
// --------------------------------------------------------------------------
interface CameraControllerProps {
  viewPreset: 'perspective' | 'front' | 'top' | 'side' | 'macro';
}

const CameraController: React.FC<CameraControllerProps> = ({ viewPreset }) => {
  const { camera } = useThree();

  useEffect(() => {
    const duration = 900;
    const startPos = camera.position.clone();
    let targetPos = new THREE.Vector3(2.8, 2.0, 3.2);

    switch (viewPreset) {
      case 'front':
        targetPos = new THREE.Vector3(0, 0.8, 3.8);
        break;
      case 'top':
        targetPos = new THREE.Vector3(0, 4.4, 0.1);
        break;
      case 'side':
        targetPos = new THREE.Vector3(3.8, 0.8, 0);
        break;
      case 'macro':
        targetPos = new THREE.Vector3(1.3, 0.7, 1.4);
        break;
      case 'perspective':
      default:
        targetPos = new THREE.Vector3(2.8, 2.0, 3.2);
        break;
    }

    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out

      camera.position.lerpVectors(startPos, targetPos, ease);
      camera.lookAt(0, 0.5, 0);

      if (progress < 1.0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [viewPreset, camera]);

  return null;
};

// --------------------------------------------------------------------------
// 5. Main Exported FurnitureViewer3D Component
// --------------------------------------------------------------------------
export const FurnitureViewer3D: React.FC<FurnitureViewer3DProps> = ({
  modelType = 'armchair',
  selectedWood = 'chittagong-teak',
  selectedFabric = 'ivory-boucle',
  exploded = false,
  onToggleExploded,
  lightingMood = 'warm-studio',
  showControls = true,
  scaleDimensions,
  customDimensions,
  showDimensions: showDimensionsProp,
  onToggleDimensions,
  initialShowDimensions = false,
}) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeMood, setActiveMood] = useState<LightingMood>(lightingMood);
  const [viewPreset, setViewPreset] = useState<'perspective' | 'front' | 'top' | 'side' | 'macro'>('perspective');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dimensions state & unit management
  const [internalShowDimensions, setInternalShowDimensions] = useState(initialShowDimensions);
  const isDimensionsActive = showDimensionsProp !== undefined ? showDimensionsProp : internalShowDimensions;
  const [dimensionUnit, setDimensionUnit] = useState<DimensionUnit>('cm');

  const toggleDimensions = () => {
    if (onToggleDimensions) {
      onToggleDimensions();
    } else {
      setInternalShowDimensions((prev) => !prev);
    }
  };

  useEffect(() => {
    if (lightingMood) {
      setActiveMood(lightingMood);
    }
  }, [lightingMood]);

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

  const [isCanvasReady, setIsCanvasReady] = useState(false);

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
      className="relative w-full h-full bg-gradient-to-b from-[#0F0F0F] via-[#0A0A0A] to-[#050505] select-none group font-sans overflow-hidden"
    >
      {/* Lightweight SVG Skeleton Loader: visible during WebGL compiling & 3D asset hydration */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-700 ${
          isCanvasReady ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Studio3DViewportSkeleton />
      </div>

      {/* 3D Canvas Context */}
      <Canvas
        onCreated={() => setIsCanvasReady(true)}
        frameloop={isVisible ? 'always' : 'never'}
        dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1]}
        camera={{ position: [2.8, 2.0, 3.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: activeMood === 'dark-luxury' ? 0.85 : 1.2,
        }}
        className="w-full h-full"
      >
        <CameraController viewPreset={viewPreset} />

        {/* Ambient & Studio Directional Key Lights */}
        <ambientLight intensity={activeMood === 'dark-luxury' ? 0.35 : 0.65} />
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
        <pointLight position={[0, -0.2, 0]} intensity={0.4} color="#D4AF37" />

        {/* HDRI Studio Reflection Environment */}
        <Environment preset={envPreset as any} />

        <Suspense fallback={null}>
          <Center top={false} position={[0, -0.15, 0]}>
            <BespokeModel
              modelType={modelType}
              woodHex={woodHex}
              fabricHex={fabricHex}
              exploded={exploded}
              scaleDimensions={scaleDimensions}
            />
          </Center>

          {/* 3D Real-World Scale & Interactive Dimensions Overlay */}
          <group position={[0, -0.15, 0]}>
            <DimensionGuides3D
              modelType={modelType}
              scaleDimensions={scaleDimensions}
              customDimensions={customDimensions}
              unit={dimensionUnit}
              onUnitToggle={() => setDimensionUnit((prev) => (prev === 'cm' ? 'in' : 'cm'))}
              visible={isDimensionsActive}
            />
          </group>

          {/* Hyper-Realistic Soft Ground Contact Shadows */}
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.75}
            scale={10}
            blur={2.2}
            far={3.5}
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
          maxPolarAngle={Math.PI / 2 + 0.02}
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

          {/* Right: Explode / Turntable / Dimensions Action Buttons */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Dimensions Toggle Button */}
            <button
              onClick={toggleDimensions}
              className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-xl ${
                isDimensionsActive
                  ? 'bg-amber-500 text-black border-amber-500 ring-2 ring-amber-400/50 shadow-amber-500/20 font-extrabold'
                  : 'bg-black/80 text-gray-300 border-white/15 hover:text-white hover:border-amber-500/40'
              }`}
              title="Toggle Real-World Scale & Dimensions (cm / in)"
            >
              <Ruler className="w-3 h-3" />
              <span>Dimensions {isDimensionsActive ? `(${dimensionUnit})` : ''}</span>
            </button>

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

      {/* Real-World Dimensions Floating Architectural HUD Card */}
      {isDimensionsActive && (
        <DimensionsHUDCard
          modelType={modelType}
          scaleDimensions={scaleDimensions}
          customDimensions={customDimensions}
          unit={dimensionUnit}
          onUnitChange={setDimensionUnit}
          onClose={toggleDimensions}
        />
      )}

      {/* Interaction Hint */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[9px] uppercase tracking-widest text-gray-400 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Drag to Orbit • Scroll to Zoom • Right Click to Pan
      </div>
    </div>
  );
};
