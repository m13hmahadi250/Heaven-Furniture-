import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Ruler, Maximize2, Check, ArrowLeftRight, ArrowUpDown } from 'lucide-react';

export type DimensionUnit = 'cm' | 'in';

export interface ModelDimensions {
  w: number; // inches
  d: number; // inches
  h: number; // inches
}

export const DEFAULT_ARCHETYPE_DIMENSIONS: Record<string, ModelDimensions> = {
  armchair: { w: 38, d: 36, h: 36 },
  sofa: { w: 88, d: 38, h: 42 },
  'dining-table': { w: 108, d: 46, h: 31 },
  bed: { w: 84, d: 90, h: 78 },
  'executive-desk': { w: 78, d: 22, h: 88 },
};

// 3D Bounding Extents in Three.js Coordinates (unscaled)
export const MODEL_3D_BOUNDS: Record<
  string,
  { halfX: number; minZ: number; maxZ: number; maxY: number; minY: number }
> = {
  armchair: { halfX: 0.62, minZ: -0.58, maxZ: 0.58, maxY: 1.58, minY: 0 },
  sofa: { halfX: 1.38, minZ: -0.62, maxZ: 0.62, maxY: 1.45, minY: 0 },
  'dining-table': { halfX: 1.25, minZ: -0.75, maxZ: 0.75, maxY: 0.96, minY: 0 },
  bed: { halfX: 1.02, minZ: -1.12, maxZ: 1.12, maxY: 1.95, minY: 0 },
  'executive-desk': { halfX: 0.96, minZ: -0.44, maxZ: 0.44, maxY: 2.05, minY: 0 },
};

export const formatDimension = (valInches: number, unit: DimensionUnit): string => {
  if (unit === 'cm') {
    const cm = Math.round(valInches * 2.54 * 10) / 10;
    return `${cm} cm`;
  }
  return `${Number(valInches.toFixed(1))}"`;
};

export const formatSecondary = (valInches: number, unit: DimensionUnit): string => {
  if (unit === 'cm') {
    return `${Number(valInches.toFixed(1))}"`;
  }
  const cm = Math.round(valInches * 2.54 * 10) / 10;
  return `${cm} cm`;
};

// --------------------------------------------------------------------------
// 1. Sleek 3D Dimension Line with Terminal Ticks & Interactive Drei Html Badge
// --------------------------------------------------------------------------
interface DimensionLine3DProps {
  start: [number, number, number];
  end: [number, number, number];
  label: string;
  subLabel: string;
  axis: 'x' | 'y' | 'z';
  unit: DimensionUnit;
  onUnitToggle: () => void;
  accentColor?: string;
}

const DimensionLine3D: React.FC<DimensionLine3DProps> = ({
  start,
  end,
  label,
  subLabel,
  axis,
  unit,
  onUnitToggle,
  accentColor = '#F59E0B',
}) => {
  const p1 = useMemo(() => new THREE.Vector3(...start), [start]);
  const p2 = useMemo(() => new THREE.Vector3(...end), [end]);

  const length = useMemo(() => p1.distanceTo(p2), [p1, p2]);
  const midpoint = useMemo(() => {
    return new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  }, [p1, p2]);

  const orientation = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion();
    if (Math.abs(dir.y) > 0.999) {
      // vertical line along Y
      quat.set(0, 0, 0, 1);
    } else {
      quat.setFromUnitVectors(up, dir);
    }
    return quat;
  }, [p1, p2]);

  // Terminal tick offset
  const tickLength = 0.09;
  const tickRadius = 0.0035;
  const lineRadius = 0.0035;

  return (
    <group>
      {/* Main Dimension Rod */}
      <mesh position={midpoint} quaternion={orientation}>
        <cylinderGeometry args={[lineRadius, lineRadius, length, 8]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.65}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Start Terminal Tick */}
      <mesh
        position={p1}
        rotation={
          axis === 'x'
            ? [0, 0, 0]
            : axis === 'y'
            ? [0, 0, Math.PI / 2]
            : [0, 0, 0]
        }
      >
        <cylinderGeometry
          args={[
            tickRadius,
            tickRadius,
            tickLength,
            8,
          ]}
        />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* End Terminal Tick */}
      <mesh
        position={p2}
        rotation={
          axis === 'x'
            ? [0, 0, 0]
            : axis === 'y'
            ? [0, 0, Math.PI / 2]
            : [0, 0, 0]
        }
      >
        <cylinderGeometry
          args={[
            tickRadius,
            tickRadius,
            tickLength,
            8,
          ]}
        />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Interactive 3D Measurement Badge (Drei Html) */}
      <Html
        position={midpoint.toArray()}
        center
        distanceFactor={4.8}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'auto', userSelect: 'none' }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnitToggle();
          }}
          className="group/badge flex flex-col items-center px-2.5 py-1 rounded-lg bg-[#071311]/92 backdrop-blur-md border border-amber-500/60 shadow-[0_4px_16px_rgba(0,0,0,0.7)] hover:border-amber-400 hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
          title={`Click to switch to ${unit === 'cm' ? 'Inches' : 'Centimeters'}`}
        >
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono font-extrabold text-amber-400 group-hover/badge:text-white transition-colors">
              {label}
            </span>
            <span className="text-[9px] font-mono text-gray-400">
              ({subLabel})
            </span>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-wider text-amber-500/80 group-hover/badge:text-amber-300">
            {axis === 'x' ? '↔ Width' : axis === 'y' ? '↕ Height' : '⤢ Depth'} • Click for {unit === 'cm' ? 'in' : 'cm'}
          </span>
        </button>
      </Html>
    </group>
  );
};

// --------------------------------------------------------------------------
// 2. Floor Footprint Perimeter & Area Calculation (Clearance Planner)
// --------------------------------------------------------------------------
interface FloorFootprintProps {
  halfX: number;
  minZ: number;
  maxZ: number;
  realWidthInches: number;
  realDepthInches: number;
  unit: DimensionUnit;
  onUnitToggle: () => void;
}

const FloorFootprint3D: React.FC<FloorFootprintProps> = ({
  halfX,
  minZ,
  maxZ,
  realWidthInches,
  realDepthInches,
  unit,
  onUnitToggle,
}) => {
  const width3D = halfX * 2;
  const depth3D = maxZ - minZ;
  const centerZ = (minZ + maxZ) / 2;

  // Real-world area
  const areaSqFt = ((realWidthInches * realDepthInches) / 144).toFixed(1);
  const areaSqM = (((realWidthInches * 2.54) * (realDepthInches * 2.54)) / 10000).toFixed(2);

  const primaryArea = unit === 'cm' ? `${areaSqM} m²` : `${areaSqFt} sq ft`;
  const secondaryArea = unit === 'cm' ? `${areaSqFt} sq ft` : `${areaSqM} m²`;

  return (
    <group position={[0, 0.005, 0]}>
      {/* Floor Footprint Mesh Highlight */}
      <mesh position={[0, 0, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width3D, depth3D]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer Footprint Border Line using thin cylinders */}
      {/* Front */}
      <mesh position={[0, 0.001, maxZ]}>
        <boxGeometry args={[width3D, 0.004, 0.006]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.65} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.001, minZ]}>
        <boxGeometry args={[width3D, 0.004, 0.006]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.65} />
      </mesh>
      {/* Left */}
      <mesh position={[-halfX, 0.001, centerZ]}>
        <boxGeometry args={[0.006, 0.004, depth3D]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.65} />
      </mesh>
      {/* Right */}
      <mesh position={[halfX, 0.001, centerZ]}>
        <boxGeometry args={[0.006, 0.004, depth3D]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.65} />
      </mesh>

      {/* Floor Footprint Badge */}
      <Html
        position={[0, 0.02, centerZ]}
        center
        distanceFactor={5.2}
        zIndexRange={[90, 0]}
        style={{ pointerEvents: 'auto', userSelect: 'none' }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnitToggle();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#050E0C]/90 backdrop-blur-md border border-amber-500/40 text-[9px] font-mono text-amber-300 hover:border-amber-400 hover:bg-[#071714] shadow-lg transition-all whitespace-nowrap"
          title="Floor Footprint Area (Click to toggle units)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Floor Area: <strong className="text-white font-bold">{primaryArea}</strong> ({secondaryArea})</span>
        </button>
      </Html>
    </group>
  );
};

// --------------------------------------------------------------------------
// 3. Complete 3D Dimension Scene Guides (Rendered inside the Canvas)
// --------------------------------------------------------------------------
export interface DimensionGuides3DProps {
  modelType: string;
  scaleDimensions?: {
    widthMultiplier?: number;
    depthMultiplier?: number;
    heightMultiplier?: number;
  };
  customDimensions?: ModelDimensions;
  unit: DimensionUnit;
  onUnitToggle: () => void;
  visible?: boolean;
}

export const DimensionGuides3D: React.FC<DimensionGuides3DProps> = ({
  modelType,
  scaleDimensions,
  customDimensions,
  unit,
  onUnitToggle,
  visible = true,
}) => {
  if (!visible) return null;

  const defaultDims = DEFAULT_ARCHETYPE_DIMENSIONS[modelType] || DEFAULT_ARCHETYPE_DIMENSIONS.armchair;
  const bounds = MODEL_3D_BOUNDS[modelType] || MODEL_3D_BOUNDS.armchair;

  const sx = scaleDimensions?.widthMultiplier ?? 1;
  const sy = scaleDimensions?.heightMultiplier ?? 1;
  const sz = scaleDimensions?.depthMultiplier ?? 1;

  // Real world dimensions (inches)
  const realWidthInches = (customDimensions?.w ?? defaultDims.w * sx);
  const realDepthInches = (customDimensions?.d ?? defaultDims.d * sz);
  const realHeightInches = (customDimensions?.h ?? defaultDims.h * sy);

  // Scaled 3D coordinates
  const halfX = bounds.halfX * sx;
  const maxY = bounds.maxY * sy;
  const minZ = bounds.minZ * sz;
  const maxZ = bounds.maxZ * sz;

  // Offsets for guide lines away from the model so they don't collide
  const xOffsetZ = maxZ + 0.18; // Front width line
  const zOffsetX = halfX + 0.18; // Side depth line
  const yOffsetX = -halfX - 0.18; // Left vertical height line
  const yOffsetZ = minZ;

  return (
    <group>
      {/* 1. Width Dimension Guide (Front, X-axis) */}
      <DimensionLine3D
        start={[-halfX, 0.08, xOffsetZ]}
        end={[halfX, 0.08, xOffsetZ]}
        label={formatDimension(realWidthInches, unit)}
        subLabel={formatSecondary(realWidthInches, unit)}
        axis="x"
        unit={unit}
        onUnitToggle={onUnitToggle}
      />

      {/* 2. Depth Dimension Guide (Right Side, Z-axis) */}
      <DimensionLine3D
        start={[zOffsetX, 0.08, minZ]}
        end={[zOffsetX, 0.08, maxZ]}
        label={formatDimension(realDepthInches, unit)}
        subLabel={formatSecondary(realDepthInches, unit)}
        axis="z"
        unit={unit}
        onUnitToggle={onUnitToggle}
      />

      {/* 3. Height Dimension Guide (Left Rear, Y-axis) */}
      <DimensionLine3D
        start={[yOffsetX, 0, yOffsetZ]}
        end={[yOffsetX, maxY, yOffsetZ]}
        label={formatDimension(realHeightInches, unit)}
        subLabel={formatSecondary(realHeightInches, unit)}
        axis="y"
        unit={unit}
        onUnitToggle={onUnitToggle}
      />

      {/* 4. Floor Footprint Area Projection */}
      <FloorFootprint3D
        halfX={halfX}
        minZ={minZ}
        maxZ={maxZ}
        realWidthInches={realWidthInches}
        realDepthInches={realDepthInches}
        unit={unit}
        onUnitToggle={onUnitToggle}
      />
    </group>
  );
};

// --------------------------------------------------------------------------
// 4. Interactive Floating 2D HUD Dimension Card Overlay
// --------------------------------------------------------------------------
export interface DimensionsHUDCardProps {
  modelType: string;
  scaleDimensions?: {
    widthMultiplier?: number;
    depthMultiplier?: number;
    heightMultiplier?: number;
  };
  customDimensions?: ModelDimensions;
  unit: DimensionUnit;
  onUnitChange: (unit: DimensionUnit) => void;
  onClose: () => void;
}

export const DimensionsHUDCard: React.FC<DimensionsHUDCardProps> = ({
  modelType,
  scaleDimensions,
  customDimensions,
  unit,
  onUnitChange,
  onClose,
}) => {
  const defaultDims = DEFAULT_ARCHETYPE_DIMENSIONS[modelType] || DEFAULT_ARCHETYPE_DIMENSIONS.armchair;

  const sx = scaleDimensions?.widthMultiplier ?? 1;
  const sy = scaleDimensions?.heightMultiplier ?? 1;
  const sz = scaleDimensions?.depthMultiplier ?? 1;

  const realWidthInches = (customDimensions?.w ?? defaultDims.w * sx);
  const realDepthInches = (customDimensions?.d ?? defaultDims.d * sz);
  const realHeightInches = (customDimensions?.h ?? defaultDims.h * sy);

  const widthPrimary = formatDimension(realWidthInches, unit);
  const widthSecondary = formatSecondary(realWidthInches, unit);

  const depthPrimary = formatDimension(realDepthInches, unit);
  const depthSecondary = formatSecondary(realDepthInches, unit);

  const heightPrimary = formatDimension(realHeightInches, unit);
  const heightSecondary = formatSecondary(realHeightInches, unit);

  const areaSqFt = ((realWidthInches * realDepthInches) / 144).toFixed(1);
  const areaSqM = (((realWidthInches * 2.54) * (realDepthInches * 2.54)) / 10000).toFixed(2);

  // Doorway clearance recommendation
  const minDoorwayInches = Math.min(realDepthInches, realHeightInches) - 4;
  const minDoorwayCm = Math.round(minDoorwayInches * 2.54);

  return (
    <div
      className="absolute top-16 left-4 max-w-[320px] sm:max-w-[340px] w-full bg-[#081210]/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl shadow-2xl p-4 text-white z-20 transition-all font-sans"
      style={{ animation: 'fadeIn 0.25s ease-out' }}
    >
      {/* Header with Unit Selector */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Ruler className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 font-heading-bold leading-tight">
              Scale & Dimensions
            </div>
            <div className="text-[9px] text-gray-400">1:1 Real-World Spatial Measurement</div>
          </div>
        </div>

        {/* Unit Selector Toggle Pill */}
        <div className="flex items-center bg-black/70 p-0.5 rounded-full border border-white/15 text-[10px] font-mono">
          <button
            onClick={() => onUnitChange('cm')}
            className={`px-2 py-0.5 rounded-full font-bold transition-all ${
              unit === 'cm'
                ? 'bg-amber-500 text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            cm
          </button>
          <button
            onClick={() => onUnitChange('in')}
            className={`px-2 py-0.5 rounded-full font-bold transition-all ${
              unit === 'in'
                ? 'bg-amber-500 text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            in
          </button>
        </div>
      </div>

      {/* Primary 3-Axis Measurement Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 py-3">
        {/* Width */}
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-center">
          <div className="text-[9px] uppercase tracking-wider text-gray-400 font-bold flex items-center justify-center gap-1">
            <ArrowLeftRight className="w-2.5 h-2.5 text-amber-400" />
            <span>Width</span>
          </div>
          <div className="text-xs sm:text-sm font-black text-amber-300 font-mono mt-0.5">
            {widthPrimary}
          </div>
          <div className="text-[9px] font-mono text-gray-500">
            {widthSecondary}
          </div>
        </div>

        {/* Depth */}
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-center">
          <div className="text-[9px] uppercase tracking-wider text-gray-400 font-bold flex items-center justify-center gap-1">
            <Maximize2 className="w-2.5 h-2.5 text-amber-400" />
            <span>Depth</span>
          </div>
          <div className="text-xs sm:text-sm font-black text-amber-300 font-mono mt-0.5">
            {depthPrimary}
          </div>
          <div className="text-[9px] font-mono text-gray-500">
            {depthSecondary}
          </div>
        </div>

        {/* Height */}
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-center">
          <div className="text-[9px] uppercase tracking-wider text-gray-400 font-bold flex items-center justify-center gap-1">
            <ArrowUpDown className="w-2.5 h-2.5 text-amber-400" />
            <span>Height</span>
          </div>
          <div className="text-xs sm:text-sm font-black text-amber-300 font-mono mt-0.5">
            {heightPrimary}
          </div>
          <div className="text-[9px] font-mono text-gray-500">
            {heightSecondary}
          </div>
        </div>
      </div>

      {/* Spatial Planning & Clearance Specs */}
      <div className="space-y-1.5 text-[10px] pt-1 border-t border-white/10">
        <div className="flex items-center justify-between text-gray-300">
          <span className="text-gray-400">Floor Footprint:</span>
          <span className="font-mono text-amber-400 font-bold">
            {unit === 'cm' ? `${areaSqM} m² (${areaSqFt} sq ft)` : `${areaSqFt} sq ft (${areaSqM} m²)`}
          </span>
        </div>

        <div className="flex items-center justify-between text-gray-300">
          <span className="text-gray-400">Doorway Clearance:</span>
          <span className="font-mono text-gray-200">
            Min. {unit === 'cm' ? `${minDoorwayCm} cm (${Math.round(minDoorwayInches)}")` : `${Math.round(minDoorwayInches)}" (${minDoorwayCm} cm)`}
          </span>
        </div>

        <div className="flex items-center justify-between text-gray-300">
          <span className="text-gray-400">Perimeter Clearance:</span>
          <span className="font-mono text-gray-200">
            {unit === 'cm' ? '75–90 cm walkway' : '30–36" walkway'}
          </span>
        </div>
      </div>

      {/* Footer Info & Quick Dismiss */}
      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-gray-400">
        <span>Click 3D badges to switch units</span>
        <button
          onClick={onClose}
          className="text-amber-400 hover:text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded hover:bg-white/10 transition-colors"
        >
          Hide Overlay
        </button>
      </div>
    </div>
  );
};
