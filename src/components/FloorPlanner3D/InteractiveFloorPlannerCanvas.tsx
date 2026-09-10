import React, { Suspense, useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { RoomMesh } from './RoomMesh';
import { CameraRig } from './CameraRig';
import { ProceduralFurnitureMesh } from './ProceduralFurnitureMeshes';
import { ActiveItemHaloGizmo } from './ActiveItemHaloGizmo';
import { PlacedFurniture, RoomConfig, UnitSystem, CameraMode, CatalogItem, LightingPreset } from './types';
import { CATALOG_ITEMS } from './catalogData';
import { snapToGrid, evaluateCollisions } from './collisionUtils';

/**
 * Architectural Studio Lighting Rig supporting Day, Evening, and Gallery presets
 */
const StudioLightingRig: React.FC<{ preset: LightingPreset; roomConfig: RoomConfig }> = ({ preset, roomConfig }) => {
  const ceilingY = roomConfig.ceilingHeightFt;
  const halfW = roomConfig.widthFt / 2;
  const halfL = roomConfig.lengthFt / 2;

  if (preset === 'evening') {
    return (
      <group>
        {/* Soft intimate evening ambient with warm honey tint */}
        <ambientLight intensity={0.36} color="#FEF3C7" />

        {/* Low golden hour sun streaming through windows at a dramatic dusk angle */}
        <directionalLight
          position={[18, 9, -10]}
          intensity={1.25}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
          shadow-camera-near={1}
          shadow-camera-far={60}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          color="#FBA048"
        />

        {/* Interior ceiling downlight / chandelier pool: Warm 2700K incandescent glow */}
        <pointLight
          position={[0, ceilingY - 0.35, 0]}
          intensity={1.6}
          distance={30}
          decay={2}
          color="#FFEDD5"
          castShadow={false}
        />

        {/* Subtle accent warm wall sconce bounce */}
        <pointLight
          position={[-halfW * 0.7, ceilingY * 0.65, -halfL * 0.7]}
          intensity={0.7}
          distance={16}
          color="#F97316"
        />

        {/* Evening dusk sky hemisphere bounce */}
        <hemisphereLight
          args={['#A855F7', '#78350F', 0.28]}
        />
      </group>
    );
  }

  if (preset === 'gallery') {
    return (
      <group>
        {/* Minimal high-contrast exhibition ambient */}
        <ambientLight intensity={0.24} color="#F8FAFC" />

        {/* Focused Museum Gallery Key Track Spotlight */}
        <directionalLight
          position={[10, 24, 10]}
          intensity={1.55}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
          shadow-camera-near={1}
          shadow-camera-far={60}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          color="#FFFFFF"
        />

        {/* Cross-track counter spotlight to reveal fine timber grain & textile textures */}
        <directionalLight
          position={[-12, 20, -12]}
          intensity={0.95}
          color="#F1F5F9"
        />

        {/* Focused Overhead Showroom Track Downlight */}
        <pointLight
          position={[0, ceilingY - 0.2, 0]}
          intensity={1.1}
          distance={25}
          color="#FFFFFF"
        />

        {/* Crisp Specular Rim Light */}
        <pointLight
          position={[halfW * 0.8, ceilingY * 0.8, halfL * 0.8]}
          intensity={0.65}
          distance={20}
          color="#E2E8F0"
        />

        {/* Clean architectural cool hemisphere */}
        <hemisphereLight
          args={['#E2E8F0', '#0F172A', 0.25]}
        />
      </group>
    );
  }

  // Default: 'day' - Crisp natural sunbeams & airy sky bounce
  return (
    <group>
      {/* Crisp daylight ambient */}
      <ambientLight intensity={0.65} color="#FAF5EE" />

      {/* High sun angle simulating natural window daylight */}
      <directionalLight
        position={[16, 22, -12]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        color="#FFF7ED"
      />

      {/* Soft fill bounce light (sky reflection) */}
      <pointLight position={[-12, 10, 12]} intensity={0.35} color="#BAE6FD" />
      {/* Gentle ceiling bounce */}
      <pointLight position={[0, ceilingY - 0.5, 0]} intensity={0.35} color="#FEF3C7" />

      {/* Atmospheric sky hemisphere bounce */}
      <hemisphereLight
        args={['#E0F2FE', '#E4E4E7', 0.35]}
      />
    </group>
  );
};

interface FloorPlannerCanvasProps {
  roomConfig: RoomConfig;
  placedItems: PlacedFurniture[];
  selectedInstanceId: string | null;
  cameraMode: CameraMode;
  unitSystem: UnitSystem;
  autoRotate: boolean;
  onSelectItem: (instanceId: string | null) => void;
  onUpdateItemPosition: (instanceId: string, x: number, z: number) => void;
  onRotateItem90: (instanceId: string, clockwise: boolean) => void;
  onDuplicateItem: (instanceId: string) => void;
  onDeleteItem: (instanceId: string) => void;
  onDragEnd?: () => void;
  onCanvasReady?: (canvasElement: HTMLCanvasElement) => void;
}

/**
 * High-performance 3D ground-plane raycasting controller
 * Tracks pointer events on window for buttery-smooth drag without dropping frames
 */
const SpatialDragController: React.FC<{
  draggingInstanceId: string | null;
  roomConfig: RoomConfig;
  onUpdatePosition: (id: string, x: number, z: number) => void;
  onDragEnd: () => void;
}> = ({ draggingInstanceId, roomConfig, onUpdatePosition, onDragEnd }) => {
  const { camera, gl } = useThree();
  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const hitPoint = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    if (!draggingInstanceId) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
        // Magnetic snap to 0.5 ft
        const snappedX = snapToGrid(hitPoint.x, 0.5);
        const snappedZ = snapToGrid(hitPoint.z, 0.5);

        // Room perimeter clamping with comfortable inner clearance
        const halfW = roomConfig.widthFt / 2;
        const halfL = roomConfig.lengthFt / 2;
        const clampedX = Math.max(-halfW + 1, Math.min(halfW - 1, snappedX));
        const clampedZ = Math.max(-halfL + 1, Math.min(halfL - 1, snappedZ));

        onUpdatePosition(draggingInstanceId, clampedX, clampedZ);
      }
    };

    const handlePointerUp = () => {
      onDragEnd();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [
    draggingInstanceId,
    camera,
    gl.domElement,
    groundPlane,
    hitPoint,
    ndc,
    onDragEnd,
    onUpdatePosition,
    raycaster,
    roomConfig.lengthFt,
    roomConfig.widthFt
  ]);

  return null;
};

export const InteractiveFloorPlannerCanvas: React.FC<FloorPlannerCanvasProps> = ({
  roomConfig,
  placedItems,
  selectedInstanceId,
  cameraMode,
  unitSystem,
  autoRotate,
  onSelectItem,
  onUpdateItemPosition,
  onRotateItem90,
  onDuplicateItem,
  onDeleteItem,
  onDragEnd,
  onCanvasReady
}) => {
  const [draggingInstanceId, setDraggingInstanceId] = useState<string | null>(null);
  const [hoveredInstanceId, setHoveredInstanceId] = useState<string | null>(null);

  // Evaluate collisions in real-time
  const collisionState = evaluateCollisions(placedItems, roomConfig);

  // Map of catalog items
  const catalogMap = useMemo(() => {
    const map = new Map<string, CatalogItem>();
    CATALOG_ITEMS.forEach((it) => map.set(it.id, it));
    return map;
  }, []);

  const handleFinishDrag = useCallback(() => {
    setDraggingInstanceId(null);
    if (onDragEnd) {
      onDragEnd();
    }
  }, [onDragEnd]);

  return (
    <div
      className="w-full h-full relative select-none overflow-hidden touch-none"
      style={{ touchAction: 'none' }}
    >
      <Canvas
        shadows={{ enabled: true, type: THREE.PCFShadowMap }}
        className="w-full h-full block outline-none touch-none select-none cursor-grab active:cursor-grabbing transition-opacity duration-300"
        style={{
          width: '100%',
          height: '100%',
          touchAction: 'none',
          display: 'block',
          outline: 'none'
        }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
        camera={{ position: [16, 18, 22], fov: 42 }}
        onCreated={({ gl }) => {
          if (onCanvasReady) {
            onCanvasReady(gl.domElement);
          }
        }}
        onPointerDown={(e) => {
          // If clicked empty space, deselect
          if (e.target === e.currentTarget) {
            onSelectItem(null);
          }
        }}
      >
        <Suspense fallback={null}>
          {/* Dynamic 3D Studio Environment Background */}
          <color
            attach="background"
            args={[
              roomConfig.lightingPreset === 'evening'
                ? '#0B0E17'
                : roomConfig.lightingPreset === 'gallery'
                ? '#07080B'
                : '#141518'
            ]}
          />

          {/* CAMERA RIG WITH DUAL ORTHO / PERSPECTIVE / EYE-LEVEL MODES */}
          <CameraRig
            mode={cameraMode}
            roomConfig={roomConfig}
            autoRotate={autoRotate}
            enabled={!draggingInstanceId}
          />

          {/* SPATIAL DRAG CONTROLLER: ZERO JITTER, 60FPS GROUND RAYCAST */}
          <SpatialDragController
            draggingInstanceId={draggingInstanceId}
            roomConfig={roomConfig}
            onUpdatePosition={onUpdateItemPosition}
            onDragEnd={handleFinishDrag}
          />

          {/* STUDIO & AMBIENT LIGHTING RIG (DAY / EVENING / GALLERY) */}
          <StudioLightingRig
            preset={roomConfig.lightingPreset || 'day'}
            roomConfig={roomConfig}
          />

          {/* ROOM ENVELOPE: FLOOR, WALLS, WINDOW, MEASUREMENT LINES */}
          <RoomMesh
            config={roomConfig}
            cameraMode={cameraMode}
            unitSystem={unitSystem}
            onFloorPointerMove={() => {}}
            onFloorPointerDown={() => onSelectItem(null)}
          />

          {/* PLACED FURNITURE PIECES */}
          {placedItems.map((placed) => {
            const meta = catalogMap.get(placed.itemId);
            if (!meta) return null;

            const isSelected = placed.instanceId === selectedInstanceId;
            const isColliding = collisionState.collidingInstances.has(placed.instanceId);
            const isHovered = placed.instanceId === hoveredInstanceId;
            const collisionReason = collisionState.collisionMessages[placed.instanceId];

            return (
              <group
                key={placed.instanceId}
                position={[placed.x, placed.yElevation || 0, placed.z]}
                rotation={[0, placed.rotationY, 0]}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onSelectItem(placed.instanceId);
                  setDraggingInstanceId(placed.instanceId);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredInstanceId(placed.instanceId);
                }}
                onPointerOut={() => {
                  if (hoveredInstanceId === placed.instanceId) {
                    setHoveredInstanceId(null);
                  }
                }}
              >
                {/* High-Fidelity Procedural 3D Model */}
                <ProceduralFurnitureMesh
                  item={meta}
                  isSelected={isSelected}
                  isColliding={isColliding}
                  isHovered={isHovered}
                />

                {/* Floating Active Gizmo Halo with 90° spin, dup, del */}
                {isSelected && (
                  <ActiveItemHaloGizmo
                    placed={placed}
                    itemMeta={meta}
                    isColliding={isColliding}
                    collisionReason={collisionReason}
                    unitSystem={unitSystem}
                    onRotate90={(cw) => onRotateItem90(placed.instanceId, cw)}
                    onDuplicate={() => onDuplicateItem(placed.instanceId)}
                    onDelete={() => onDeleteItem(placed.instanceId)}
                  />
                )}
              </group>
            );
          })}

          {/* REALISTIC CONTACT SHADOWS ON FLOOR */}
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={
              roomConfig.lightingPreset === 'evening'
                ? 0.76
                : roomConfig.lightingPreset === 'gallery'
                ? 0.88
                : 0.68
            }
            scale={Math.max(roomConfig.widthFt, roomConfig.lengthFt) * 1.5}
            blur={roomConfig.lightingPreset === 'gallery' ? 1.6 : 2.4}
            far={12}
            resolution={512}
            color={
              roomConfig.lightingPreset === 'evening'
                ? '#241206'
                : roomConfig.lightingPreset === 'gallery'
                ? '#000000'
                : '#0F0C08'
            }
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
