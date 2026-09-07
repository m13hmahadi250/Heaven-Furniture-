import React from 'react';
import {
  Compass,
  Eye,
  Grid,
  Download,
  Sliders,
  Sofa,
  FileText,
  Undo2,
  Redo2,
  RotateCw
} from 'lucide-react';
import {
  RoomConfig,
  CameraMode,
  UnitSystem,
  RoomPresetId
} from './types';
import { ROOM_PRESETS } from './catalogData';
import { StudioTab } from './StudioDock';

interface FloorPlannerHUDProps {
  roomConfig: RoomConfig;
  cameraMode: CameraMode;
  unitSystem: UnitSystem;
  autoRotate: boolean;
  canUndo: boolean;
  canRedo: boolean;
  placedCount: number;
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  onSelectPreset: (presetId: RoomPresetId) => void;
  onChangeCameraMode: (mode: CameraMode) => void;
  onToggleAutoRotate: () => void;
  onToggleUnitSystem: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExportBlueprint: () => void;
}

export const FloorPlannerHUD: React.FC<FloorPlannerHUDProps> = ({
  roomConfig,
  cameraMode,
  unitSystem,
  autoRotate,
  canUndo,
  canRedo,
  placedCount,
  activeTab,
  onSelectTab,
  onSelectPreset,
  onChangeCameraMode,
  onToggleAutoRotate,
  onToggleUnitSystem,
  onUndo,
  onRedo,
  onExportBlueprint
}) => {
  const roomAreaSqFt = roomConfig.widthFt * roomConfig.lengthFt;

  const toggleTab = (tab: StudioTab) => {
    onSelectTab(activeTab === tab ? 'none' : tab);
  };

  return (
    <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-6 sm:right-6 z-20 pointer-events-none">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        
        {/* LEFT TOOLBAR: Studio Tabs & Presets */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap sm:flex-nowrap">
          {/* Main Studio Trigger Buttons (Catalog / Architecture / Quote) */}
          <div className="backdrop-blur-xl bg-black/85 border border-white/15 p-1 rounded-2xl flex items-center gap-1 shadow-2xl">
            <button
              onClick={() => toggleTab('catalog')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'catalog'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
              title="Browse & Add Furniture"
            >
              <Sofa className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </button>

            <button
              onClick={() => toggleTab('architecture')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'architecture'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
              title="Room Dimensions, Walls & Flooring"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-mono">
                {roomConfig.widthFt}×{roomConfig.lengthFt} ft
              </span>
              <span className="md:hidden">Room</span>
            </button>

            <button
              onClick={() => toggleTab('materials')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'materials'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
              title="View Manifest & Quotation"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold">
                {placedCount}
              </span>
            </button>
          </div>

          {/* Quick Preset Selector */}
          <div className="backdrop-blur-xl bg-black/85 border border-white/15 p-1 rounded-2xl hidden lg:flex items-center gap-1 shadow-2xl">
            {ROOM_PRESETS.slice(0, 3).map((p) => {
              const isSelected = roomConfig.presetId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPreset(p.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-white/15 text-amber-400 font-black'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT TOOLBAR: Camera View Modes, Undo/Redo & Blueprint Export */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {/* Camera View Mode Switcher */}
          <div className="backdrop-blur-xl bg-black/85 border border-white/15 p-1 rounded-2xl flex items-center gap-1 shadow-2xl">
            <button
              onClick={() => onChangeCameraMode('perspective')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                cameraMode === 'perspective'
                  ? 'bg-amber-500 text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="360° Perspective 3D Orbit"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3D</span>
            </button>

            <button
              onClick={() => onChangeCameraMode('blueprint')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                cameraMode === 'blueprint'
                  ? 'bg-amber-500 text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="2D Top-Down Blueprint View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">2D</span>
            </button>

            <button
              onClick={() => onChangeCameraMode('eye-level')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                cameraMode === 'eye-level'
                  ? 'bg-amber-500 text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="First-Person Human Eye Height (5.5 ft)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Walk</span>
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="backdrop-blur-xl bg-black/85 border border-white/15 p-1 rounded-2xl hidden md:flex items-center gap-1 shadow-2xl">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-1.5 rounded-xl transition-colors ${
                canUndo ? 'text-zinc-300 hover:text-white hover:bg-white/10' : 'text-zinc-600 cursor-not-allowed'
              }`}
              title="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-1.5 rounded-xl transition-colors ${
                canRedo ? 'text-zinc-300 hover:text-white hover:bg-white/10' : 'text-zinc-600 cursor-not-allowed'
              }`}
              title="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Unit Toggle (Imperial Feet vs Metric Meters) */}
          <button
            onClick={onToggleUnitSystem}
            className="backdrop-blur-xl bg-black/85 border border-white/15 px-2.5 py-1.5 rounded-2xl text-[11px] font-mono font-bold text-zinc-300 hover:text-amber-400 shadow-xl transition-all"
            title="Switch Units (Imperial Feet / Metric Meters)"
          >
            {unitSystem === 'imperial' ? 'FT' : 'M'}
          </button>

          {/* Export Blueprint Image */}
          <button
            onClick={onExportBlueprint}
            className="backdrop-blur-xl bg-amber-500 hover:bg-amber-400 text-black px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            title="Download Architectural Layout Blueprint"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Blueprint</span>
          </button>
        </div>
      </div>
    </div>
  );
};
