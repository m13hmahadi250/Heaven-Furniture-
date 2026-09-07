import React from 'react';
import { Html } from '@react-three/drei';
import { RotateCw, RotateCcw, Copy, Trash2, ArrowUp, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PlacedFurniture, CatalogItem, UnitSystem } from './types';

interface ActiveItemHaloGizmoProps {
  placed: PlacedFurniture;
  itemMeta: CatalogItem;
  isColliding: boolean;
  collisionReason?: string;
  unitSystem: UnitSystem;
  onRotate90: (clockwise: boolean) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAdjustElevation?: (delta: number) => void;
}

export const ActiveItemHaloGizmo: React.FC<ActiveItemHaloGizmoProps> = ({
  placed,
  itemMeta,
  isColliding,
  collisionReason,
  unitSystem,
  onRotate90,
  onDuplicate,
  onDelete,
  onAdjustElevation
}) => {
  const currentDeg = Math.round(((placed.rotationY * 180) / Math.PI) % 360);
  const normalizedDeg = currentDeg < 0 ? currentDeg + 360 : currentDeg;

  return (
    <Html
      position={[0, itemMeta.heightFt + 0.65, 0]}
      center
      distanceFactor={22}
      style={{ pointerEvents: 'auto', userSelect: 'none' }}
    >
      <div className="flex flex-col items-center gap-1.5 animate-fadeIn">
        {/* Status pill: Healthy clearance vs Collision alert */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md shadow-2xl border transition-all ${
            isColliding
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/80 shadow-rose-900/50 animate-pulse'
              : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/80 shadow-emerald-950/40'
          }`}
        >
          {isColliding ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span>{collisionReason || 'Overlap Detected'}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Clearance Verified</span>
            </>
          )}
        </div>

        {/* Floating Action Halo HUD */}
        <div className="flex items-center gap-1 p-1 bg-black/85 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl text-white">
          {/* Rotate 90° CCW */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRotate90(false);
            }}
            className="p-1.5 hover:bg-white/15 active:scale-95 rounded-xl text-zinc-300 hover:text-amber-400 transition-all"
            title="Rotate 90° Counter-Clockwise"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Current rotation degree badge */}
          <div className="px-1.5 text-[10px] font-mono font-bold text-amber-400">
            {normalizedDeg}°
          </div>

          {/* Rotate 90° CW */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRotate90(true);
            }}
            className="p-1.5 hover:bg-white/15 active:scale-95 rounded-xl text-zinc-300 hover:text-amber-400 transition-all"
            title="Rotate 90° Clockwise"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

          {/* Duplicate Item */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1.5 hover:bg-white/15 active:scale-95 rounded-xl text-zinc-300 hover:text-emerald-400 transition-all"
            title="Duplicate Piece"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete Item */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 hover:bg-rose-500/20 active:scale-95 rounded-xl text-zinc-300 hover:text-rose-400 transition-all"
            title="Remove from Floorplan"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Distance & Dimension tag */}
        <div className="text-[10px] text-zinc-400 bg-black/60 px-2 py-0.5 rounded-full border border-white/5 font-mono">
          {itemMeta.widthFt} × {itemMeta.depthFt} ft • Elev: {placed.yElevation || 0} ft
        </div>
      </div>
    </Html>
  );
};
