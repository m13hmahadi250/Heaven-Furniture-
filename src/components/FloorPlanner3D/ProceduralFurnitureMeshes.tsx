import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CatalogItem } from './types';

interface ProceduralFurnitureProps {
  item: CatalogItem;
  isSelected?: boolean;
  isColliding?: boolean;
  isHovered?: boolean;
}

// Reusable PBR Materials
function useFurnitureMaterials(isColliding?: boolean, isSelected?: boolean) {
  return useMemo(() => {
    if (isColliding) {
      // Overlap alert: glowing translucent ruby / amber-red
      const alertMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#EF4444'),
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
        emissive: new THREE.Color('#991B1B'),
        emissiveIntensity: 0.4
      });
      return {
        wood: alertMat,
        fabric: alertMat,
        accent: alertMat,
        metal: alertMat,
        marble: alertMat
      };
    }

    // Standard high-end PBR materials
    const wood = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#7A4F26'), // Seasoned Chittagong Teak
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25
    });

    const darkWood = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#462E1A'), // Seasoned Walnut
      roughness: 0.4,
      metalness: 0.04,
      clearcoat: 0.3
    });

    const velvet = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#134E4A'), // Rich Emerald Teal
      roughness: 0.88,
      metalness: 0.02,
      sheen: 1.0,
      sheenColor: new THREE.Color('#2DD4BF'),
      sheenRoughness: 0.35
    });

    const ivoryFabric = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F5F2EB'), // Warm Ivory Bouclé
      roughness: 0.92,
      metalness: 0.01,
      sheen: 0.7,
      sheenColor: new THREE.Color('#FFFFFF')
    });

    const brass = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4AF37'), // 24K Champagne Brass
      roughness: 0.2,
      metalness: 0.92
    });

    const marble = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F0EDE6'), // Polished Calacatta
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1
    });

    const leather = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#3D2817'), // Saddle Leather
      roughness: 0.5,
      metalness: 0.1,
      clearcoat: 0.2
    });

    return { wood, darkWood, velvet, ivoryFabric, brass, marble, leather };
  }, [isColliding]);
}

export const ProceduralFurnitureMesh: React.FC<ProceduralFurnitureProps> = ({
  item,
  isSelected,
  isColliding,
  isHovered
}) => {
  const materials = useFurnitureMaterials(isColliding, isSelected);

  // Render individual piece geometries based on modelType
  return (
    <group>
      {/* 1. SIGNATURE VELVET LOUNGE CHAIR */}
      {item.modelType === 'lounge-chair' && (
        <group position={[0, 0, 0]}>
          {/* Solid teak curved seat frame */}
          <mesh position={[0, 0.55, 0]} material={materials.wood} castShadow receiveShadow>
            <boxGeometry args={[2.6, 0.25, 2.4]} />
          </mesh>
          {/* Emerald velvet seat cushion */}
          <mesh position={[0, 0.85, 0.05]} material={materials.velvet} castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.45, 2.3]} />
          </mesh>
          {/* Curved ergonomic backrest */}
          <mesh position={[0, 1.75, -1.0]} rotation={[0.08, 0, 0]} material={materials.velvet} castShadow receiveShadow>
            <boxGeometry args={[2.5, 1.6, 0.4]} />
          </mesh>
          {/* Lumbar roll pillow */}
          <mesh position={[0, 1.15, -0.8]} rotation={[0, 0, Math.PI / 2]} material={materials.ivoryFabric} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 2.0, 16]} />
          </mesh>
          {/* Solid teak armrests */}
          <mesh position={[-1.25, 1.2, 0]} material={materials.wood} castShadow>
            <boxGeometry args={[0.2, 0.15, 2.2]} />
          </mesh>
          <mesh position={[1.25, 1.2, 0]} material={materials.wood} castShadow>
            <boxGeometry args={[0.2, 0.15, 2.2]} />
          </mesh>
          {/* Armrest supports */}
          <mesh position={[-1.25, 0.8, 0.7]} material={materials.wood} castShadow>
            <boxGeometry args={[0.16, 0.7, 0.16]} />
          </mesh>
          <mesh position={[1.25, 0.8, 0.7]} material={materials.wood} castShadow>
            <boxGeometry args={[0.16, 0.7, 0.16]} />
          </mesh>
          {/* 4 Tapered Teak Legs with Brass Ferrules */}
          {[
            [-1.1, 0.26, -0.95],
            [1.1, 0.26, -0.95],
            [-1.1, 0.26, 0.95],
            [1.1, 0.26, 0.95]
          ].map((pos, idx) => (
            <group key={idx} position={pos as [number, number, number]}>
              <mesh material={materials.wood} castShadow>
                <cylinderGeometry args={[0.06, 0.08, 0.52, 12]} />
              </mesh>
              <mesh position={[0, -0.22, 0]} material={materials.brass}>
                <cylinderGeometry args={[0.062, 0.062, 0.08, 12]} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 2. TUFTED 3-SEATER SOFA */}
      {item.modelType === 'tufted-sofa' && (
        <group position={[0, 0, 0]}>
          {/* Fluted seasoned teak plinth base */}
          <mesh position={[0, 0.22, 0]} material={materials.wood} castShadow receiveShadow>
            <boxGeometry args={[7.4, 0.38, 3.1]} />
          </mesh>
          {/* Deep main seat deck */}
          <mesh position={[0, 0.65, 0.1]} material={materials.ivoryFabric} castShadow receiveShadow>
            <boxGeometry args={[7.2, 0.55, 2.8]} />
          </mesh>
          {/* 3 Seat Cushions */}
          {[-2.3, 0, 2.3].map((cx, idx) => (
            <mesh key={idx} position={[cx, 1.05, 0.15]} material={materials.ivoryFabric} castShadow receiveShadow>
              <boxGeometry args={[2.25, 0.38, 2.6]} />
            </mesh>
          ))}
          {/* High tufted backrest */}
          <mesh position={[0, 1.85, -1.25]} rotation={[0.06, 0, 0]} material={materials.ivoryFabric} castShadow receiveShadow>
            <boxGeometry args={[7.3, 1.7, 0.65]} />
          </mesh>
          {/* Two Rounded Armrests */}
          <mesh position={[-3.6, 1.45, 0.1]} material={materials.ivoryFabric} castShadow receiveShadow>
            <boxGeometry args={[0.55, 1.1, 3.0]} />
          </mesh>
          <mesh position={[3.6, 1.45, 0.1]} material={materials.ivoryFabric} castShadow receiveShadow>
            <boxGeometry args={[0.55, 1.1, 3.0]} />
          </mesh>
          {/* Bolster Accent Pillows */}
          <mesh position={[-3.1, 1.25, 0.2]} rotation={[0, 0, Math.PI / 2]} material={materials.velvet} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 1.4, 16]} />
          </mesh>
          <mesh position={[3.1, 1.25, 0.2]} rotation={[0, 0, Math.PI / 2]} material={materials.velvet} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 1.4, 16]} />
          </mesh>
          {/* Brass plinth reveal strip */}
          <mesh position={[0, 0.04, 0]} material={materials.brass}>
            <boxGeometry args={[7.45, 0.06, 3.15]} />
          </mesh>
        </group>
      )}

      {/* 3. WALNUT & MARBLE COFFEE TABLE */}
      {item.modelType === 'walnut-coffee-table' && (
        <group position={[0, 0, 0]}>
          {/* Solid Walnut Tabletop with Chamfer */}
          <mesh position={[0, 1.28, 0]} material={materials.darkWood} castShadow receiveShadow>
            <boxGeometry args={[4.2, 0.18, 2.4]} />
          </mesh>
          {/* Inset Calacatta Marble Centerpiece */}
          <mesh position={[0, 1.35, 0]} material={materials.marble} castShadow receiveShadow>
            <boxGeometry args={[2.6, 0.05, 1.5]} />
          </mesh>
          {/* Two Sculptural Fluted Teak Pedestal Legs */}
          <mesh position={[-1.3, 0.62, 0]} material={materials.wood} castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.65, 1.15, 24]} />
          </mesh>
          <mesh position={[1.3, 0.62, 0]} material={materials.wood} castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.65, 1.15, 24]} />
          </mesh>
          {/* Satin Brass Base Rings */}
          <mesh position={[-1.3, 0.06, 0]} material={materials.brass}>
            <cylinderGeometry args={[0.67, 0.67, 0.08, 24]} />
          </mesh>
          <mesh position={[1.3, 0.06, 0]} material={materials.brass}>
            <cylinderGeometry args={[0.67, 0.67, 0.08, 24]} />
          </mesh>
        </group>
      )}

      {/* 4. FLOATING TV MEDIA UNIT */}
      {item.modelType === 'tv-media-unit' && (
        <group position={[0, 0, 0]}>
          {/* Main Floating Teak Cabinet Box */}
          <mesh position={[0, 0.95, 0]} material={materials.wood} castShadow receiveShadow>
            <boxGeometry args={[6.8, 1.25, 1.4]} />
          </mesh>
          {/* Front Slatted Louvers */}
          <mesh position={[0, 0.95, 0.72]} material={materials.darkWood} castShadow>
            <boxGeometry args={[6.6, 1.1, 0.06]} />
          </mesh>
          {/* Subtle Warm Indirect LED Shadow Gap Underneath */}
          <mesh position={[0, 0.28, 0]} material={materials.brass}>
            <boxGeometry args={[6.2, 0.05, 1.1]} />
          </mesh>
          {/* Wall-mount shadow reveal */}
          <mesh position={[0, 0.95, -0.68]} material={materials.brass}>
            <boxGeometry args={[6.7, 1.2, 0.04]} />
          </mesh>
        </group>
      )}

      {/* 5. KING FLOATING PLATFORM BED */}
      {item.modelType === 'platform-bed' && (
        <group position={[0, 0, 0]}>
          {/* Cantilevered Teak Ledger Base (recessed for floating illusion) */}
          <mesh position={[0, 0.2, 0.1]} material={materials.darkWood} castShadow>
            <boxGeometry args={[5.8, 0.38, 6.2]} />
          </mesh>
          {/* Wide Outer Timber Ledger Platform */}
          <mesh position={[0, 0.5, 0.15]} material={materials.wood} castShadow receiveShadow>
            <boxGeometry args={[7.0, 0.28, 7.3]} />
          </mesh>
          {/* King Mattress with Ivory Linen */}
          <mesh position={[0, 1.0, 0.15]} material={materials.ivoryFabric} castShadow receiveShadow>
            <boxGeometry args={[6.2, 0.8, 6.6]} />
          </mesh>
          {/* Turned-down luxury duvet topper */}
          <mesh position={[0, 1.28, 0.6]} material={materials.ivoryFabric} castShadow receiveShadow>
            <boxGeometry args={[6.1, 0.25, 5.0]} />
          </mesh>
          {/* Folded emerald velvet bed runner */}
          <mesh position={[0, 1.34, 2.2]} material={materials.velvet} castShadow>
            <boxGeometry args={[6.2, 0.16, 1.4]} />
          </mesh>
          {/* 4 Sleeping Pillows (Back row) */}
          <mesh position={[-1.7, 1.55, -2.4]} rotation={[0.25, 0, 0]} material={materials.ivoryFabric} castShadow>
            <boxGeometry args={[1.7, 0.32, 1.1]} />
          </mesh>
          <mesh position={[1.7, 1.55, -2.4]} rotation={[0.25, 0, 0]} material={materials.ivoryFabric} castShadow>
            <boxGeometry args={[1.7, 0.32, 1.1]} />
          </mesh>
          {/* 2 Decorative Emerald Accent Cushions */}
          <mesh position={[-1.2, 1.6, -1.8]} rotation={[0.3, 0, 0]} material={materials.velvet} castShadow>
            <boxGeometry args={[1.1, 0.3, 0.8]} />
          </mesh>
          <mesh position={[1.2, 1.6, -1.8]} rotation={[0.3, 0, 0]} material={materials.velvet} castShadow>
            <boxGeometry args={[1.1, 0.3, 0.8]} />
          </mesh>
          {/* Deep Architectural Upholstered Headboard with Solid Teak Framing */}
          <mesh position={[0, 2.2, -3.55]} material={materials.ivoryFabric} castShadow receiveShadow>
            <boxGeometry args={[7.0, 3.2, 0.45]} />
          </mesh>
          {/* Solid Teak Headboard Crown & Border */}
          <mesh position={[0, 3.82, -3.55]} material={materials.wood} castShadow>
            <boxGeometry args={[7.2, 0.2, 0.55]} />
          </mesh>
        </group>
      )}

      {/* 6. MINIMAL WARDROBE */}
      {item.modelType === 'minimal-wardrobe' && (
        <group position={[0, 0, 0]}>
          {/* Main wardrobe carcass */}
          <mesh position={[0, 3.6, 0]} material={materials.wood} castShadow receiveShadow>
            <boxGeometry args={[4.8, 7.1, 2.0]} />
          </mesh>
          {/* Fluted door face paneling */}
          <mesh position={[0, 3.6, 1.02]} material={materials.darkWood} castShadow>
            <boxGeometry args={[4.65, 6.9, 0.06]} />
          </mesh>
          {/* Recessed vertical dark bronze handle bar */}
          <mesh position={[-0.1, 3.6, 1.06]} material={materials.brass}>
            <boxGeometry args={[0.06, 3.2, 0.04]} />
          </mesh>
          <mesh position={[0.1, 3.6, 1.06]} material={materials.brass}>
            <boxGeometry args={[0.06, 3.2, 0.04]} />
          </mesh>
          {/* Plinth reveal */}
          <mesh position={[0, 0.05, 0]} material={materials.brass}>
            <boxGeometry args={[4.75, 0.08, 1.95]} />
          </mesh>
        </group>
      )}

      {/* 7. FLOATING NIGHTSTAND */}
      {item.modelType === 'floating-nightstand' && (
        <group position={[0, 0, 0]}>
          {/* Floating Drawer Box */}
          <mesh position={[0, 0.7, 0]} material={materials.wood} castShadow receiveShadow>
            <boxGeometry args={[2.0, 1.1, 1.4]} />
          </mesh>
          {/* Calacatta marble top slab */}
          <mesh position={[0, 1.28, 0]} material={materials.marble} castShadow receiveShadow>
            <boxGeometry args={[2.02, 0.06, 1.42]} />
          </mesh>
          {/* Drawer Face & Brass Handle */}
          <mesh position={[0, 0.7, 0.71]} material={materials.darkWood}>
            <boxGeometry args={[1.85, 0.95, 0.04]} />
          </mesh>
          <mesh position={[0, 0.7, 0.75]} material={materials.brass}>
            <boxGeometry args={[0.4, 0.06, 0.04]} />
          </mesh>
        </group>
      )}

      {/* 8. TEAK DINING TABLE WITH CHAIRS */}
      {item.modelType === 'teak-dining-table' && (
        <group position={[0, 0, 0]}>
          {/* Massive Seasoned Chittagong Teak Top with Chamfer */}
          <mesh position={[0, 2.42, 0]} material={materials.wood} castShadow receiveShadow>
            <boxGeometry args={[8.2, 0.22, 3.8]} />
          </mesh>
          {/* Two Sculptural Trestle Pedestals */}
          <mesh position={[-2.4, 1.15, 0]} material={materials.wood} castShadow receiveShadow>
            <boxGeometry args={[0.4, 2.3, 2.8]} />
          </mesh>
          <mesh position={[2.4, 1.15, 0]} material={materials.wood} castShadow receiveShadow>
            <boxGeometry args={[0.4, 2.3, 2.8]} />
          </mesh>
          {/* Brass stretcher connecting rod */}
          <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.brass}>
            <cylinderGeometry args={[0.08, 0.08, 4.6, 16]} />
          </mesh>
          {/* Surrounding 6 Dining Chairs */}
          {[
            [-2.4, 0, -2.4, 0],
            [0, 0, -2.4, 0],
            [2.4, 0, -2.4, 0],
            [-2.4, 0, 2.4, Math.PI],
            [0, 0, 2.4, Math.PI],
            [2.4, 0, 2.4, Math.PI]
          ].map(([cx, cy, cz, crot], idx) => (
            <group key={idx} position={[cx, cy, cz]} rotation={[0, crot, 0]}>
              {/* Chair seat pad */}
              <mesh position={[0, 1.4, 0]} material={materials.ivoryFabric} castShadow>
                <boxGeometry args={[1.4, 0.18, 1.4]} />
              </mesh>
              {/* Chair backrest */}
              <mesh position={[0, 2.2, -0.65]} material={materials.wood} castShadow>
                <boxGeometry args={[1.4, 1.3, 0.12]} />
              </mesh>
              {/* 4 chair legs */}
              {[
                [-0.6, 0.68, -0.6],
                [0.6, 0.68, -0.6],
                [-0.6, 0.68, 0.6],
                [0.6, 0.68, 0.6]
              ].map((lpos, lidx) => (
                <mesh key={lidx} position={lpos as [number, number, number]} material={materials.wood} castShadow>
                  <cylinderGeometry args={[0.04, 0.05, 1.35, 10]} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}

      {/* 9. ARCHITECT EXECUTIVE DESK */}
      {item.modelType === 'executive-desk' && (
        <group position={[0, 0, 0]}>
          {/* Commanding Cantilevered Teak Desktop */}
          <mesh position={[0, 2.42, 0]} material={materials.wood} castShadow receiveShadow>
            <boxGeometry args={[6.2, 0.22, 3.0]} />
          </mesh>
          {/* Saddle Leather Inset Writing Blotter */}
          <mesh position={[0, 2.54, 0.1]} material={materials.leather} receiveShadow>
            <boxGeometry args={[3.2, 0.03, 1.8]} />
          </mesh>
          {/* Left Pedestal (3 drawers) */}
          <mesh position={[-2.3, 1.15, 0]} material={materials.darkWood} castShadow receiveShadow>
            <boxGeometry args={[1.3, 2.3, 2.7]} />
          </mesh>
          {/* Right Tapered Teak Gable Leg with Brass Base */}
          <mesh position={[2.7, 1.15, 0]} material={materials.wood} castShadow>
            <boxGeometry args={[0.25, 2.3, 2.7]} />
          </mesh>
          <mesh position={[2.7, 0.04, 0]} material={materials.brass}>
            <boxGeometry args={[0.3, 0.08, 2.75]} />
          </mesh>
          {/* Modesty Panel */}
          <mesh position={[0.2, 1.3, -1.25]} material={materials.wood} castShadow>
            <boxGeometry args={[4.2, 1.8, 0.08]} />
          </mesh>
        </group>
      )}

      {/* 10. MINIMAL ERGONOMIC WORKSTATION */}
      {item.modelType === 'ergonomic-workstation' && (
        <group position={[0, 0, 0]}>
          {/* Teak Tabletop with Chamfer */}
          <mesh position={[0, 2.42, 0]} material={materials.wood} castShadow receiveShadow>
            <boxGeometry args={[4.6, 0.16, 2.4]} />
          </mesh>
          {/* Leather desk pad */}
          <mesh position={[0, 2.51, 0.1]} material={materials.leather} receiveShadow>
            <boxGeometry args={[2.5, 0.02, 1.4]} />
          </mesh>
          {/* Matte Dark Trestle Legs */}
          <mesh position={[-2.0, 1.15, 0]} material={materials.darkWood} castShadow>
            <boxGeometry args={[0.15, 2.3, 2.2]} />
          </mesh>
          <mesh position={[2.0, 1.15, 0]} material={materials.darkWood} castShadow>
            <boxGeometry args={[0.15, 2.3, 2.2]} />
          </mesh>
          {/* Brass Footrest Stretcher */}
          <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.brass}>
            <cylinderGeometry args={[0.06, 0.06, 3.8, 12]} />
          </mesh>
        </group>
      )}

      {/* 11. HIGH BOOKSHELF */}
      {item.modelType === 'high-bookshelf' && (
        <group position={[0, 0, 0]}>
          {/* Outer Teak Frame */}
          <mesh position={[-1.85, 3.5, 0]} material={materials.wood} castShadow>
            <boxGeometry args={[0.12, 7.0, 1.2]} />
          </mesh>
          <mesh position={[1.85, 3.5, 0]} material={materials.wood} castShadow>
            <boxGeometry args={[0.12, 7.0, 1.2]} />
          </mesh>
          {/* 6 Horizontal Shelves */}
          {[0.1, 1.4, 2.8, 4.2, 5.6, 6.95].map((sy, idx) => (
            <mesh key={idx} position={[0, sy, 0]} material={materials.wood} castShadow receiveShadow>
              <boxGeometry args={[3.8, 0.14, 1.2]} />
            </mesh>
          ))}
          {/* Asymmetric Brass Dividers & Books */}
          <mesh position={[-0.6, 2.1, 0]} material={materials.brass}>
            <boxGeometry args={[0.06, 1.25, 1.15]} />
          </mesh>
          <mesh position={[0.7, 4.9, 0]} material={materials.brass}>
            <boxGeometry args={[0.06, 1.25, 1.15]} />
          </mesh>
          {/* Decorative books clusters */}
          <mesh position={[-1.2, 0.7, 0]} material={materials.leather} castShadow>
            <boxGeometry args={[0.6, 0.8, 0.9]} />
          </mesh>
          <mesh position={[1.1, 3.4, 0]} material={materials.marble} castShadow>
            <boxGeometry args={[0.45, 0.6, 0.45]} />
          </mesh>
        </group>
      )}

      {/* SELECTION HALO / GROUND FOOTPRINT GIZMO */}
      {isSelected && (
        <group position={[0, 0.02, 0]}>
          {/* Floor boundary highlight ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[Math.min(item.widthFt, item.depthFt) * 0.48, Math.max(item.widthFt, item.depthFt) * 0.58 + 0.3, 36]} />
            <meshBasicMaterial
              color={isColliding ? '#EF4444' : '#10B981'}
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Outer dotted/glow border */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[item.widthFt + 0.4, item.depthFt + 0.4]} />
            <meshBasicMaterial
              color={isColliding ? '#F87171' : '#34D399'}
              wireframe
              transparent
              opacity={0.65}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
