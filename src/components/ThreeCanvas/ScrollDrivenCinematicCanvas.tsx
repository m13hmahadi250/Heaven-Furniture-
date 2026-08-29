import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface ScrollDrivenCinematicCanvasProps {
  onSectionChange?: (sectionIndex: number) => void;
}

// --------------------------------------------------------------------------
// Passive Global Scroll State with Zero Layout Reading (120Hz Fast-path)
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
// Shared High-Performance Materials Factory (Optimized PBR Shaders)
// --------------------------------------------------------------------------
const usePbrMaterials = () => {
  return useMemo(() => {
    // 1. Seasoned Chittagong Teak with warm grain
    const teakWood = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4A2E1B'),
      roughness: 0.35,
      metalness: 0.05,
    });

    // 2. Deep American Walnut for library shelves & executive accents
    const walnutWood = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2C1D15'),
      roughness: 0.4,
      metalness: 0.04,
    });

    // 3. Royal Emerald Velvet (Signature Chair & Upholstery)
    const emeraldVelvet = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14483B'),
      roughness: 0.72,
      metalness: 0.05,
    });

    // 4. Dark Slate-Teal Wall Material with Neoclassical Matte Finish
    const darkTealWall = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0E1B19'),
      roughness: 0.88,
      metalness: 0.02,
    });

    // 5. Neoclassical Wall Moulding Trim
    const wallMoulding = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0B1513'),
      roughness: 0.8,
      metalness: 0.04,
    });

    // 6. Blonde Oak Hardwood Floor (matching reference image floor)
    const blondeOakFloor = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#BFA98A'),
      roughness: 0.45,
      metalness: 0.03,
    });

    // 7. Warm Cream Bouclé / Wool Rug
    const creamRug = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D8D1C3'),
      roughness: 0.95,
      metalness: 0.01,
    });

    // 8. PVD Champagne Brass Accents & Hardware
    const champagneBrass = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4AF37'),
      roughness: 0.22,
      metalness: 0.88,
    });

    // 9. Smoked Architectural Glass
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D0DFDE'),
      transparent: true,
      opacity: 0.42,
      roughness: 0.08,
      metalness: 0.2,
    });

    // 10. Ivory Bouclé Upholstery
    const ivoryBoucle = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E6E0D5'),
      roughness: 0.88,
      metalness: 0.01,
    });

    // 11. Polished Nero Marquina Marble
    const honedMarble = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#141618'),
      roughness: 0.2,
      metalness: 0.08,
    });

    return {
      teakWood,
      walnutWood,
      emeraldVelvet,
      darkTealWall,
      wallMoulding,
      blondeOakFloor,
      creamRug,
      champagneBrass,
      glassMaterial,
      ivoryBoucle,
      honedMarble,
    };
  }, []);
};

// --------------------------------------------------------------------------
// Architectural Luxury Room Background Environment (Matching User Image)
// --------------------------------------------------------------------------
const ArchitecturalLuxuryRoom: React.FC = () => {
  const materials = usePbrMaterials();

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Back Wall (Dark Slate Teal Neoclassical Paneled Wall) */}
      <mesh position={[0, 1.2, -4.5]}>
        <planeGeometry args={[26, 12]} />
        <primitive object={materials.darkTealWall} attach="material" />
      </mesh>

      {/* 2. Neoclassical Wainscot Moulding Panels on the Back Wall */}
      {[-7.2, -4.8, -2.4, 0, 2.4, 4.8, 7.2].map((x, i) => (
        <group key={`moulding-${i}`} position={[x, 1.3, -4.46]}>
          {/* Upper Tall Panel Box */}
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[1.9, 2.8, 0.03]} />
            <primitive object={materials.wallMoulding} attach="material" />
          </mesh>
          <mesh position={[0, 0.7, 0.012]}>
            <boxGeometry args={[1.7, 2.6, 0.02]} />
            <primitive object={materials.darkTealWall} attach="material" />
          </mesh>
          <mesh position={[0, 0.7, 0.02]}>
            <boxGeometry args={[1.52, 2.42, 0.015]} />
            <primitive object={materials.wallMoulding} attach="material" />
          </mesh>

          {/* Lower Wainscot Panel Box */}
          <mesh position={[0, -1.3, 0]}>
            <boxGeometry args={[1.9, 0.9, 0.03]} />
            <primitive object={materials.wallMoulding} attach="material" />
          </mesh>
          <mesh position={[0, -1.3, 0.012]}>
            <boxGeometry args={[1.7, 0.72, 0.02]} />
            <primitive object={materials.darkTealWall} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Horizontal Dado Rail & Baseboard Trim */}
      <mesh position={[0, -0.65, -4.43]}>
        <boxGeometry args={[26, 0.08, 0.06]} />
        <primitive object={materials.wallMoulding} attach="material" />
      </mesh>
      <mesh position={[0, -1.95, -4.43]}>
        <boxGeometry args={[26, 0.25, 0.08]} />
        <primitive object={materials.wallMoulding} attach="material" />
      </mesh>

      {/* Architectural Fluted Pilasters (Left & Right framing columns) */}
      {[-8.5, 8.5].map((px, idx) => (
        <group key={`pilaster-${idx}`} position={[px, 1.2, -4.3]}>
          <mesh>
            <boxGeometry args={[0.9, 12, 0.16]} />
            <primitive object={materials.wallMoulding} attach="material" />
          </mesh>
          {/* Fluting strips */}
          {[-0.3, -0.15, 0, 0.15, 0.3].map((fx, k) => (
            <mesh key={`flute-${k}`} position={[fx, 0, 0.09]}>
              <cylinderGeometry args={[0.025, 0.025, 11.5, 6]} />
              <primitive object={materials.darkTealWall} attach="material" />
            </mesh>
          ))}
        </group>
      ))}

      {/* 3. Warm Wall Sconces with Golden Radial Glows */}
      {[-2.4, 2.4].map((sx, idx) => (
        <group key={`sconce-${idx}`} position={[sx, 2.5, -4.38]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
            <primitive object={materials.champagneBrass} attach="material" />
          </mesh>
          <mesh position={[0, 0.12, 0.06]}>
            <cylinderGeometry args={[0.01, 0.01, 0.25, 6]} />
            <primitive object={materials.champagneBrass} attach="material" />
          </mesh>
          <mesh position={[0, 0.25, 0.08]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial
              color="#FFF1D0"
              emissive="#FFAA33"
              emissiveIntensity={2.5}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* 4. Built-in Warm Teak Bookcase / Library Wall (Right Background) */}
      <group position={[5.4, 0.6, -3.9]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 5.2, 0.65]} />
          <primitive object={materials.walnutWood} attach="material" />
        </mesh>
        <mesh position={[0, 0, -0.28]}>
          <planeGeometry args={[3.0, 5.0]} />
          <primitive object={materials.teakWood} attach="material" />
        </mesh>

        {/* Shelves */}
        {[-1.8, -0.9, 0, 0.9, 1.8].map((sy, idx) => (
          <group key={`shelf-${idx}`} position={[0, sy, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[3.05, 0.06, 0.6]} />
              <primitive object={materials.walnutWood} attach="material" />
            </mesh>
            <mesh position={[0, -0.035, 0.1]}>
              <boxGeometry args={[2.9, 0.01, 0.03]} />
              <meshBasicMaterial color="#FFB84D" />
            </mesh>
          </group>
        ))}

        {/* Books & Decorative Objects on Shelves */}
        <group position={[-0.8, 0.22, 0.05]}>
          {[-0.35, -0.25, -0.15, -0.05, 0.05, 0.15, 0.25, 0.35].map((bx, k) => (
            <mesh key={`bk1-${k}`} position={[bx, 0, 0]}>
              <boxGeometry args={[0.07, 0.36 + (k % 3) * 0.06, 0.32]} />
              <meshStandardMaterial
                color={
                  k % 4 === 0
                    ? '#E8DFD0'
                    : k % 4 === 1
                    ? '#1A332C'
                    : k % 4 === 2
                    ? '#633B22'
                    : '#2D2D2D'
                }
                roughness={0.6}
              />
            </mesh>
          ))}
        </group>
        <mesh position={[0.7, 0.22, 0.05]}>
          <cylinderGeometry args={[0.12, 0.08, 0.38, 10]} />
          <primitive object={materials.ivoryBoucle} attach="material" />
        </mesh>

        <group position={[0.3, 1.1, 0.05]}>
          <mesh position={[-0.6, -0.08, 0]}>
            <boxGeometry args={[0.42, 0.18, 0.3]} />
            <meshStandardMaterial color="#E8DFD0" roughness={0.5} />
          </mesh>
          {[-0.1, 0.02, 0.14, 0.26, 0.38].map((bx, k) => (
            <mesh key={`bk2-${k}`} position={[bx, 0, 0]}>
              <boxGeometry args={[0.08, 0.38 + (k % 2) * 0.04, 0.3]} />
              <meshStandardMaterial
                color={k % 2 === 0 ? '#4A2E1B' : '#DFBE7B'}
                roughness={0.5}
              />
            </mesh>
          ))}
        </group>
        <mesh position={[-0.85, 1.12, 0.05]}>
          <torusGeometry args={[0.14, 0.02, 6, 12]} />
          <primitive object={materials.champagneBrass} attach="material" />
        </mesh>
      </group>

      {/* 5. Sleek Low Brass & Glass Coffee Table (Background Middle-Right) */}
      <group position={[2.6, -0.82, -2.9]}>
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[1.7, 0.02, 0.85]} />
          <primitive object={materials.glassMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[1.68, 0.02, 0.83]} />
          <primitive object={materials.champagneBrass} attach="material" />
        </mesh>
        {[
          [-0.8, 0.16, -0.38],
          [0.8, 0.16, -0.38],
          [-0.8, 0.16, 0.38],
          [0.8, 0.16, 0.38],
        ].map((lp, idx) => (
          <mesh key={`tbl-leg-${idx}`} position={lp as [number, number, number]}>
            <cylinderGeometry args={[0.012, 0.012, 0.32, 6]} />
            <primitive object={materials.champagneBrass} attach="material" />
          </mesh>
        ))}
        <mesh position={[-0.35, 0.36, 0.05]}>
          <boxGeometry args={[0.38, 0.06, 0.28]} />
          <meshStandardMaterial color="#FAF7F2" roughness={0.4} />
        </mesh>
      </group>

      {/* 6. Blonde Oak Hardwood Flooring Plane */}
      <mesh position={[0, -1.95, -1.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 16]} />
        <primitive object={materials.blondeOakFloor} attach="material" />
      </mesh>

      {/* Floor Wood Plank Grid Lines */}
      {[-6, -4.5, -3, -1.5, 0, 1.5, 3, 4.5, 6].map((fx, idx) => (
        <mesh
          key={`floor-line-${idx}`}
          position={[fx, -1.94, -1.0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.015, 16]} />
          <meshBasicMaterial color="#947B5E" opacity={0.35} transparent />
        </mesh>
      ))}

      {/* 7. Warm Ivory / Cream Textured Area Rug */}
      <mesh position={[1.4, -1.93, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.8, 4.4]} />
        <primitive object={materials.creamRug} attach="material" />
      </mesh>
      <mesh position={[1.4, -1.925, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.25, 3.4, 4]} />
        <meshBasicMaterial color="#C5BCAD" opacity={0.5} transparent />
      </mesh>
    </group>
  );
};

// --------------------------------------------------------------------------
// Floating Luminous Stardust & Particle Wave Ribbon
// --------------------------------------------------------------------------
const LuminousStardustWave: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 3.5 - 1.0;
      positions[i * 3 + 2] = Math.random() * 3.5 - 3.2;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.2, -1.8]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#FFF8E7"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

// --------------------------------------------------------------------------
// 1. Hero Stage Model: Sculpted Emerald Velvet Armchair (Matching User Image)
// --------------------------------------------------------------------------
const SculptedEmeraldArmchairModel: React.FC = () => {
  const materials = usePbrMaterials();

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Lower Sculpted Teak Base Apron Frame */}
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[1.36, 0.08, 1.26]} />
        <primitive object={materials.teakWood} attach="material" />
      </mesh>

      {/* 2. Sculpted Organic Side Armrests & Legs */}
      {[-0.68, 0.68].map((sideX, idx) => (
        <group key={`chair-side-${idx}`} position={[sideX, 0, 0]}>
          <mesh position={[0, 0.18, 0.05]} rotation={[-0.08, 0, 0]}>
            <boxGeometry args={[0.09, 0.065, 1.24]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>

          <mesh position={[0, -0.48, 0.5]} rotation={[0.12, 0, idx === 0 ? -0.1 : 0.1]}>
            <cylinderGeometry args={[0.034, 0.02, 0.72, 8]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>

          <mesh position={[0, -0.48, -0.52]} rotation={[-0.22, 0, idx === 0 ? -0.1 : 0.1]}>
            <cylinderGeometry args={[0.036, 0.02, 0.74, 8]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>

          <mesh position={[0, -0.16, 0]} rotation={[0.42, 0, 0]}>
            <boxGeometry args={[0.07, 0.44, 0.07]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>

          <mesh position={[0, -0.82, 0.54]}>
            <cylinderGeometry args={[0.022, 0.019, 0.1, 8]} />
            <primitive object={materials.champagneBrass} attach="material" />
          </mesh>
          <mesh position={[0, -0.82, -0.58]}>
            <cylinderGeometry args={[0.022, 0.019, 0.1, 8]} />
            <primitive object={materials.champagneBrass} attach="material" />
          </mesh>
        </group>
      ))}

      {/* 3. Deep Ergonomic Emerald Velvet Seat Cushion with Piping */}
      <group position={[0, -0.22, 0.06]}>
        <mesh position={[0, 0, 0]}>
          <RoundedBox args={[1.28, 0.28, 1.2]} radius={0.06} smoothness={1}>
            <primitive object={materials.emeraldVelvet} attach="material" />
          </RoundedBox>
        </mesh>
        <mesh position={[0, 0.12, -0.02]}>
          <RoundedBox args={[1.22, 0.14, 1.14]} radius={0.05} smoothness={1}>
            <primitive object={materials.emeraldVelvet} attach="material" />
          </RoundedBox>
        </mesh>
      </group>

      {/* 4. High-Back Curved Cocoon Velvet Shell */}
      <group position={[0, 0.46, -0.46]} rotation={[-0.16, 0, 0]}>
        <mesh>
          <RoundedBox args={[1.26, 1.08, 0.26]} radius={0.08} smoothness={1}>
            <primitive object={materials.emeraldVelvet} attach="material" />
          </RoundedBox>
        </mesh>
        <mesh position={[0, 0, -0.12]}>
          <boxGeometry args={[1.32, 1.12, 0.05]} />
          <primitive object={materials.teakWood} attach="material" />
        </mesh>
      </group>

      {/* Soft Contact Shadow under the Chair */}
      <mesh position={[0, -0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial color="#050C0A" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

// --------------------------------------------------------------------------
// 2. Stage 1 Model: Handcrafted Teak Dining Suite
// --------------------------------------------------------------------------
const DiningTableSuiteModel: React.FC = () => {
  const materials = usePbrMaterials();

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.32, 0]}>
        <RoundedBox args={[2.8, 0.09, 1.4]} radius={0.02} smoothness={1}>
          <primitive object={materials.teakWood} attach="material" />
        </RoundedBox>
      </mesh>

      {[-0.85, 0.85].map((x, i) => (
        <group key={i} position={[x, -0.22, 0]}>
          <mesh position={[0, 0, -0.32]} rotation={[0.08, 0, 0]}>
            <boxGeometry args={[0.12, 0.85, 0.1]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.32]} rotation={[-0.08, 0, 0]}>
            <boxGeometry args={[0.12, 0.85, 0.1]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>
          <mesh position={[0, -0.42, 0]}>
            <boxGeometry args={[0.16, 0.08, 1.05]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>
        </group>
      ))}

      <mesh position={[0, -0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 1.7, 8]} />
        <primitive object={materials.champagneBrass} attach="material" />
      </mesh>

      <group position={[-1.6, -0.15, 0.1]} rotation={[0, 0.45, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.65, 0.09, 0.65]} />
          <primitive object={materials.ivoryBoucle} attach="material" />
        </mesh>
        <mesh position={[0, 0.42, -0.28]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.62, 0.4, 0.06]} />
          <primitive object={materials.teakWood} attach="material" />
        </mesh>
      </group>

      <group position={[1.6, -0.15, -0.1]} rotation={[0, -2.7, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.65, 0.09, 0.65]} />
          <primitive object={materials.emeraldVelvet} attach="material" />
        </mesh>
        <mesh position={[0, 0.42, -0.28]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.62, 0.4, 0.06]} />
          <primitive object={materials.teakWood} attach="material" />
        </mesh>
      </group>
    </group>
  );
};

// --------------------------------------------------------------------------
// 3. Stage 2 Model: Sleek Executive Workstation Desk
// --------------------------------------------------------------------------
const ExecutiveDeskModel: React.FC = () => {
  const materials = usePbrMaterials();

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.6, 0.08, 1.3]} />
        <primitive object={materials.walnutWood} attach="material" />
      </mesh>

      <group position={[-0.85, -0.05, 0]}>
        <mesh>
          <boxGeometry args={[0.65, 0.68, 1.15]} />
          <primitive object={materials.walnutWood} attach="material" />
        </mesh>
      </group>

      <group position={[0.95, -0.18, 0]}>
        <mesh position={[0, 0, -0.5]}>
          <boxGeometry args={[0.08, 0.96, 0.08]} />
          <primitive object={materials.walnutWood} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.5]}>
          <boxGeometry args={[0.08, 0.96, 0.08]} />
          <primitive object={materials.walnutWood} attach="material" />
        </mesh>
      </group>

      <group position={[0, 0.1, -0.7]} rotation={[0, 0.25, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.78, 0.1, 0.7]} />
          <primitive object={materials.emeraldVelvet} attach="material" />
        </mesh>
        <mesh position={[0, 0.5, -0.32]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.74, 0.85, 0.12]} />
          <primitive object={materials.emeraldVelvet} attach="material" />
        </mesh>
      </group>
    </group>
  );
};

// --------------------------------------------------------------------------
// 4. Stage 3 Model: Minimalist King Bed
// --------------------------------------------------------------------------
const MasterBedSuiteModel: React.FC = () => {
  const materials = usePbrMaterials();

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[2.5, 0.22, 2.7]} />
        <primitive object={materials.teakWood} attach="material" />
      </mesh>

      <group position={[0, 0.45, -1.3]}>
        <mesh>
          <boxGeometry args={[2.7, 1.45, 0.2]} />
          <primitive object={materials.ivoryBoucle} attach="material" />
        </mesh>
      </group>

      <mesh position={[0, -0.12, 0.05]}>
        <boxGeometry args={[2.2, 0.36, 2.3]} />
        <primitive object={materials.ivoryBoucle} attach="material" />
      </mesh>
      <mesh position={[0, 0.02, 0.45]}>
        <boxGeometry args={[2.22, 0.16, 1.4]} />
        <primitive object={materials.emeraldVelvet} attach="material" />
      </mesh>
    </group>
  );
};

// --------------------------------------------------------------------------
// 5. Stage 4 Model: Architectural Showcase Podium & Golden Crest
// --------------------------------------------------------------------------
const ShowroomPodiumModel: React.FC = () => {
  const materials = usePbrMaterials();
  const crestRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (crestRef.current) {
      crestRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[1.5, 1.55, 0.18, 16]} />
        <primitive object={materials.honedMarble} attach="material" />
      </mesh>

      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[1.15, 1.2, 0.24, 16]} />
        <primitive object={materials.teakWood} attach="material" />
      </mesh>

      <group ref={crestRef} position={[0, 0.65, 0]}>
        <mesh>
          <torusGeometry args={[0.48, 0.022, 6, 16]} />
          <primitive object={materials.champagneBrass} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0.4, 0.4, 0.4]}>
          <octahedronGeometry args={[0.24, 0]} />
          <primitive object={materials.champagneBrass} attach="material" />
        </mesh>
      </group>
    </group>
  );
};

// --------------------------------------------------------------------------
// Multi-Stage Orchestrator (120Hz Ultra-Smooth Interpolation & Zero CPU Garbage)
// --------------------------------------------------------------------------
interface StageRigProps {
  onSectionChange?: (sectionIndex: number) => void;
}

const MultiStageOrchestrator: React.FC<StageRigProps> = ({ onSectionChange }) => {
  const stage0Ref = useRef<THREE.Group>(null);
  const stage1Ref = useRef<THREE.Group>(null);
  const stage2Ref = useRef<THREE.Group>(null);
  const stage3Ref = useRef<THREE.Group>(null);
  const stage4Ref = useRef<THREE.Group>(null);

  const activeSectionRef = useRef(-1);

  useFrame((state, delta) => {
    // Ultra-smooth 120Hz Lerp without DOM layout querying
    const lerpSpeed = Math.min(delta * 8.0, 1.0);
    scrollState.progress = THREE.MathUtils.lerp(
      scrollState.progress,
      scrollState.targetProgress,
      lerpSpeed
    );
    const p = scrollState.progress;

    const currentSection = Math.min(Math.floor(p * 5), 4);
    if (activeSectionRef.current !== currentSection) {
      activeSectionRef.current = currentSection;
      if (onSectionChange) onSectionChange(currentSection);
    }

    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;
    const isMobile = state.size.width < 768;
    const baseX = isMobile ? 0 : 0.85;
    const floatOffset = Math.sin(state.clock.elapsedTime * 0.9) * 0.03;

    const updateStage = (
      stageIndex: number,
      stageRef: React.RefObject<THREE.Group | null>
    ) => {
      if (!stageRef.current) return;

      const stageCenter = stageIndex * 0.25;
      const dist = Math.abs(p - stageCenter);
      const isVisible = dist < 0.28;

      if (!isVisible) {
        if (stageRef.current.visible) stageRef.current.visible = false;
        return;
      }

      if (!stageRef.current.visible) stageRef.current.visible = true;

      const weight = Math.max(0, 1.0 - dist / 0.24);
      const smoothWeight = THREE.MathUtils.smoothstep(weight, 0, 1);

      const isExiting = p > stageCenter;
      const direction = isExiting ? -1 : 1;
      const glideOffset = (1 - smoothWeight) * 2.8 * direction;

      const baseZ = stageIndex === 0 ? -0.8 : -1.8;
      const targetScale = THREE.MathUtils.lerp(0.65, stageIndex === 0 ? 1.25 : 0.95, smoothWeight);

      stageRef.current.position.x = THREE.MathUtils.lerp(
        stageRef.current.position.x,
        baseX + glideOffset + pointerX * 0.08,
        lerpSpeed
      );
      stageRef.current.position.y = THREE.MathUtils.lerp(
        stageRef.current.position.y,
        (stageIndex === 0 ? -0.75 : -0.1) + floatOffset + (1 - smoothWeight) * -0.4 - pointerY * 0.04,
        lerpSpeed
      );
      stageRef.current.position.z = THREE.MathUtils.lerp(
        stageRef.current.position.z,
        baseZ,
        lerpSpeed
      );

      const curScale = stageRef.current.scale.x || 0.01;
      const nextScale = THREE.MathUtils.lerp(curScale, targetScale, lerpSpeed);
      stageRef.current.scale.set(nextScale, nextScale, nextScale);

      const baseRotY = (p - stageCenter) * 1.1 + (stageIndex === 0 ? -0.22 : stageIndex % 2 === 0 ? -0.35 : 0.35);
      stageRef.current.rotation.y = THREE.MathUtils.lerp(
        stageRef.current.rotation.y,
        baseRotY + pointerX * 0.12,
        lerpSpeed
      );
      stageRef.current.rotation.x = THREE.MathUtils.lerp(
        stageRef.current.rotation.x,
        0.03 - pointerY * 0.05,
        lerpSpeed
      );
    };

    updateStage(0, stage0Ref);
    updateStage(1, stage1Ref);
    updateStage(2, stage2Ref);
    updateStage(3, stage3Ref);
    updateStage(4, stage4Ref);
  });

  return (
    <group>
      <ArchitecturalLuxuryRoom />
      <LuminousStardustWave />

      <group ref={stage0Ref} position={[0.85, -0.75, -0.8]}>
        <SculptedEmeraldArmchairModel />
      </group>

      <group ref={stage1Ref} position={[0.85, -0.1, -1.8]}>
        <DiningTableSuiteModel />
      </group>

      <group ref={stage2Ref} position={[0.85, -0.1, -1.8]}>
        <ExecutiveDeskModel />
      </group>

      <group ref={stage3Ref} position={[0.85, -0.1, -1.8]}>
        <MasterBedSuiteModel />
      </group>

      <group ref={stage4Ref} position={[0.85, -0.1, -1.8]}>
        <ShowroomPodiumModel />
      </group>
    </group>
  );
};

// --------------------------------------------------------------------------
// Main Exported Component: Editorial Architectural 3D Background Canvas
// --------------------------------------------------------------------------
export const ScrollDrivenCinematicCanvas: React.FC<ScrollDrivenCinematicCanvasProps> = ({
  onSectionChange,
}) => {
  useEffect(() => {
    initScrollListener();
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 65% 35%, #132724 0%, #0A1715 45%, #050E0C 100%)',
        contain: 'strict',
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
      }}
    >
      <Canvas
        dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.25) : 1]}
        camera={{ position: [0, 0.15, 4.4], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.7} color="#FFF5EB" />

        <directionalLight
          position={[4.5, 7.5, 3.5]}
          intensity={1.3}
          color="#FFF7EE"
        />

        <directionalLight
          position={[-5, 3, 2]}
          intensity={0.35}
          color="#8CB9B0"
        />

        <directionalLight
          position={[0, 4.5, -3.5]}
          intensity={0.75}
          color="#F59E0B"
        />
        <pointLight position={[0.85, -0.4, -0.8]} intensity={0.35} color="#E8BE78" />

        <MultiStageOrchestrator onSectionChange={onSectionChange} />
      </Canvas>

      {/* Layer 1: Left-to-Right Subtle Atmospheric Vignette for Flawless Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050E0C]/90 via-[#050E0C]/45 to-transparent pointer-events-none" />

      {/* Layer 2: Top-and-Bottom Architectural Soft Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050E0C]/75 via-transparent to-[#050E0C]/90 pointer-events-none" />
    </div>
  );
};
