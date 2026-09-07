import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { RoomConfig, UnitSystem, CameraMode } from './types';
import { FLOOR_FINISHES, WALL_COLORS } from './catalogData';
import { WallWithOpenings } from './WallWithOpenings';

interface RoomMeshProps {
  config: RoomConfig;
  cameraMode: CameraMode;
  unitSystem: UnitSystem;
  onFloorPointerDown?: (e: any) => void;
  onFloorPointerMove?: (e: any) => void;
}

export const RoomMesh: React.FC<RoomMeshProps> = ({
  config,
  cameraMode,
  unitSystem,
  onFloorPointerDown,
  onFloorPointerMove
}) => {
  const { widthFt, lengthFt, ceilingHeightFt, floorFinish, wallColor, hasCornerWindow, outsideVista, openings = [] } = config;

  const currentFloorMeta = useMemo(
    () => FLOOR_FINISHES.find((f) => f.id === floorFinish) || FLOOR_FINISHES[0],
    [floorFinish]
  );
  const currentWallMeta = useMemo(
    () => WALL_COLORS.find((w) => w.id === wallColor) || WALL_COLORS[0],
    [wallColor]
  );

  // Materials
  const floorMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(currentFloorMeta.colorHex),
      roughness: currentFloorMeta.roughness,
      metalness: 0.05,
      clearcoat: currentFloorMeta.specular,
      clearcoatRoughness: 0.2
    });
  }, [currentFloorMeta]);

  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentWallMeta.colorHex),
      roughness: 0.85,
      metalness: 0.02
    });
  }, [currentWallMeta]);

  const windowFrameMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1F1E1D'),
      metalness: 0.85,
      roughness: 0.3
    });
  }, []);

  const timberMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8D5B28'),
      roughness: 0.45,
      metalness: 0.05
    });
  }, []);

  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E0F2FE'),
      transparent: true,
      opacity: 0.3,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.8,
      ior: 1.5
    });
  }, []);

  // Format dimensions
  const formatDim = (feet: number) => {
    if (unitSystem === 'metric') {
      return `${(feet * 0.3048).toFixed(1)} m`;
    }
    return `${feet.toFixed(1)} ft`;
  };

  const wallVisibility = config.wallVisibility || 'full';
  const halfW = widthFt / 2;
  const halfL = lengthFt / 2;
  const wallH = wallVisibility === 'cutaway' ? 2.5 : ceilingHeightFt;
  const hasFrontOpenings = openings.some((o) => o.wall === 'front');

  return (
    <group>
      {/* 1. MAIN FLOOR SLAB */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerDown={onFloorPointerDown}
        onPointerMove={onFloorPointerMove}
      >
        <planeGeometry args={[widthFt, lengthFt, 32, 32]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* 2. SUBTLE ARCHITECTURAL GRID OVERLAY (0.5 ft or 1 ft intervals) */}
      <gridHelper
        args={[Math.max(widthFt, lengthFt), Math.round(Math.max(widthFt, lengthFt) * 2), '#D4AF37', '#52525B']}
        position={[0, 0.005, 0]}
      >
        <lineBasicMaterial attach="material" color="#A1A1AA" transparent opacity={0.25} />
      </gridHelper>

      {/* 3. WALLS ARCHITECTURE WITH DYNAMIC WINDOWS & DOORS */}
      {wallVisibility !== 'none' && (
        <>
          {/* BACK WALL (North: Z = -halfL) */}
          <WallWithOpenings
            wallSide="back"
            totalLength={widthFt}
            wallH={wallH}
            wallMaterial={wallMaterial}
            glassMaterial={glassMaterial}
            frameMaterial={windowFrameMaterial}
            timberMaterial={timberMaterial}
            openings={openings}
            outsideVista={outsideVista}
            position={[0, 0, -halfL]}
            rotation={[0, 0, 0]}
            isCutaway={wallVisibility === 'cutaway'}
          />

          {/* LEFT WALL (West: X = -halfW) */}
          <WallWithOpenings
            wallSide="left"
            totalLength={lengthFt}
            wallH={wallH}
            wallMaterial={wallMaterial}
            glassMaterial={glassMaterial}
            frameMaterial={windowFrameMaterial}
            timberMaterial={timberMaterial}
            openings={openings}
            outsideVista={outsideVista}
            position={[-halfW, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            isCutaway={wallVisibility === 'cutaway'}
          />

          {/* RIGHT WALL (East: X = halfW) */}
          <WallWithOpenings
            wallSide="right"
            totalLength={lengthFt}
            wallH={wallH}
            wallMaterial={wallMaterial}
            glassMaterial={glassMaterial}
            frameMaterial={windowFrameMaterial}
            timberMaterial={timberMaterial}
            openings={openings}
            outsideVista={outsideVista}
            position={[halfW, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            isCutaway={wallVisibility === 'cutaway'}
          />

          {/* FRONT WALL (South: Z = halfL) - rendered if user adds window/door or in full visibility */}
          {(hasFrontOpenings || cameraMode === 'eye-level') && (
            <WallWithOpenings
              wallSide="front"
              totalLength={widthFt}
              wallH={wallH}
              wallMaterial={wallMaterial}
              glassMaterial={glassMaterial}
              frameMaterial={windowFrameMaterial}
              timberMaterial={timberMaterial}
              openings={openings}
              outsideVista={outsideVista}
              position={[0, 0, halfL]}
              rotation={[0, Math.PI, 0]}
              isCutaway={wallVisibility === 'cutaway'}
            />
          )}
        </>
      )}

      {/* OUTSIDE GARDEN / SKYLINE VISTA WHEN CORNER WINDOW IS ACTIVE */}
      {hasCornerWindow && (
        <group position={[halfW + 2.5, wallH * 0.45, -halfL - 2.5]} rotation={[0, -Math.PI / 4, 0]}>
          <mesh>
            <planeGeometry args={[14, 10]} />
            <meshBasicMaterial
              color={outsideVista === 'garden' ? '#A7F3D0' : '#BAE6FD'}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[-2, -1.5, 0.1]}>
            <boxGeometry args={[2.5, 4.5, 0.1]} />
            <meshBasicMaterial color="#064E3B" opacity={0.5} transparent />
          </mesh>
          <mesh position={[1.5, -2.0, 0.1]}>
            <boxGeometry args={[3.5, 3.5, 0.1]} />
            <meshBasicMaterial color="#047857" opacity={0.4} transparent />
          </mesh>
        </group>
      )}

      {/* 4. BLUEPRINT DIMENSION ANNOTATIONS (2D OR 3D HUD) */}
      {(cameraMode === 'blueprint' || cameraMode === 'perspective') && (
        <group position={[0, 0.06, 0]}>
          <Html position={[0, 0, halfL + 0.8]} center distanceFactor={24}>
            <div className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-amber-500/40 rounded-full text-[11px] font-mono font-bold text-amber-400 whitespace-nowrap shadow-xl pointer-events-none select-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Width: {formatDim(widthFt)}</span>
            </div>
          </Html>

          <Html position={[-halfW - 0.8, 0, 0]} center distanceFactor={24}>
            <div className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-amber-500/40 rounded-full text-[11px] font-mono font-bold text-amber-400 whitespace-nowrap shadow-xl pointer-events-none select-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Length: {formatDim(lengthFt)}</span>
            </div>
          </Html>

          <Html position={[halfW - 0.5, 0, halfL - 0.5]} center distanceFactor={24}>
            <div className="px-2 py-0.5 bg-zinc-900/90 border border-zinc-700 rounded text-[10px] font-mono text-zinc-300 pointer-events-none select-none">
              Ceiling: {formatDim(ceilingHeightFt)}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};
