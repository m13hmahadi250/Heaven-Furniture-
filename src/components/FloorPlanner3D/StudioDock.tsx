import React, { useState } from 'react';
import {
  Sofa,
  Bed,
  UtensilsCrossed,
  Briefcase,
  Plus,
  Sliders,
  FileText,
  X,
  Send,
  Download,
  Trash2,
  Copy,
  RotateCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  DoorOpen,
  Maximize2,
  Sun,
  Sunset
} from 'lucide-react';
import {
  CatalogCategory,
  CatalogItem,
  FloorFinishId,
  PlacedFurniture,
  RoomConfig,
  RoomPresetId,
  UnitSystem,
  WallColorId,
  WallOpening,
  WallOpeningType,
  WallSide,
  LightingPreset
} from './types';
import {
  CATALOG_ITEMS,
  FLOOR_FINISHES,
  ROOM_PRESETS,
  WALL_COLORS
} from './catalogData';
import {
  calculateFurnitureFootprintSqFt,
  evaluateCollisions
} from './collisionUtils';
import { BRAND_INFO } from '../../data/furnitureData';

export type StudioTab = 'catalog' | 'architecture' | 'materials' | 'none';

interface StudioDockProps {
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  unitSystem: UnitSystem;
  roomConfig: RoomConfig;
  placedItems: PlacedFurniture[];
  onAddItem: (item: CatalogItem) => void;
  onSelectPreset: (presetId: RoomPresetId) => void;
  onUpdateDimensions: (widthFt: number, lengthFt: number, ceilingHeightFt: number) => void;
  onUpdateFinish: (floor: FloorFinishId, wall: WallColorId) => void;
  onToggleWindow: () => void;
  onAddOpening?: (type: WallOpeningType, wall: WallSide) => void;
  onUpdateOpening?: (id: string, updates: Partial<WallOpening>) => void;
  onDeleteOpening?: (id: string) => void;
  onDeleteItem: (instanceId: string) => void;
  onDuplicateItem: (instanceId: string) => void;
  onRotateItem90: (instanceId: string, clockwise: boolean) => void;
  onClearAll: () => void;
  onExportBlueprint: () => void;
  onOpenConsultation?: (initialData?: any) => void;
  onChangeLightingPreset?: (preset: LightingPreset) => void;
}

const CATEGORY_TABS: { id: CatalogCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'living', label: 'Living', icon: Sofa },
  { id: 'bedroom', label: 'Bedroom', icon: Bed },
  { id: 'dining', label: 'Dining', icon: UtensilsCrossed },
  { id: 'executive', label: 'Office', icon: Briefcase }
];

export const StudioDock: React.FC<StudioDockProps> = ({
  activeTab,
  onSelectTab,
  unitSystem,
  roomConfig,
  placedItems,
  onAddItem,
  onSelectPreset,
  onUpdateDimensions,
  onUpdateFinish,
  onToggleWindow,
  onAddOpening,
  onUpdateOpening,
  onDeleteOpening,
  onDeleteItem,
  onDuplicateItem,
  onRotateItem90,
  onClearAll,
  onExportBlueprint,
  onOpenConsultation,
  onChangeLightingPreset
}) => {
  const [activeCatalogCategory, setActiveCatalogCategory] = useState<CatalogCategory>('living');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Catalog item lookup
  const catalogMap = new Map<string, CatalogItem>();
  CATALOG_ITEMS.forEach((it) => catalogMap.set(it.id, it));

  // Compute metrics
  const roomAreaSqFt = roomConfig.widthFt * roomConfig.lengthFt;
  const roomAreaM2 = (roomAreaSqFt * 0.092903).toFixed(1);
  const furnitureFootprintSqFt = calculateFurnitureFootprintSqFt(placedItems);
  const utilizationPercent = roomAreaSqFt > 0 ? Math.round((furnitureFootprintSqFt / roomAreaSqFt) * 100) : 0;

  const totalPriceBDT = placedItems.reduce((sum, p) => {
    const meta = catalogMap.get(p.itemId);
    return sum + (meta ? meta.basePriceBDT : 0);
  }, 0);

  const collisionResult = evaluateCollisions(placedItems, roomConfig);

  const formatDim = (ft: number) => {
    if (unitSystem === 'metric') {
      return `${(ft * 0.3048).toFixed(1)}m`;
    }
    return `${ft.toFixed(1)}ft`;
  };

  const filteredCatalog = CATALOG_ITEMS.filter((item) => {
    const matchesCategory = item.category === activeCatalogCategory;
    const matchesSearch =
      !catalogSearch ||
      item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.defaultTimber.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSendWhatsApp = () => {
    const itemListStr = placedItems
      .map((p, idx) => {
        const meta = catalogMap.get(p.itemId);
        return `  ${idx + 1}. ${meta?.name || 'Bespoke Item'} (${meta?.widthFt}×${meta?.depthFt} ft) - ${p.selectedTimber} [৳ ${(meta?.basePriceBDT || 0).toLocaleString()}]`;
      })
      .join('\n');

    const message = `*HEAVEN BESPOKE 3D ROOM PLAN & QUOTATION REQUEST*
---------------------------------------
• *Room Preset*: ${roomConfig.presetId.toUpperCase()}
• *Dimensions*: ${roomConfig.widthFt} ft (W) × ${roomConfig.lengthFt} ft (L) × ${roomConfig.ceilingHeightFt} ft (H)
• *Total Floor Area*: ${roomAreaSqFt} sq ft (${(roomAreaSqFt * 0.0929).toFixed(1)} m²)
• *Space Density*: ${utilizationPercent}% (${furnitureFootprintSqFt} sq ft footprint)
• *Flooring*: ${roomConfig.floorFinish}
• *Wall Finish*: ${roomConfig.wallColor}
• *Panoramic Window*: ${roomConfig.hasCornerWindow ? 'Yes' : 'No'}

*PLACED FURNITURE MANIFEST (${placedItems.length} items)*:
${itemListStr || '  (No items placed)'}

---------------------------------------
*ESTIMATED STUDIO QUOTE*: ৳ ${totalPriceBDT.toLocaleString()}
Please confirm seasoned timber readiness and schedule a private showroom consultation or laser measurement appointment.`;

    const url = `https://wa.me/${BRAND_INFO.phoneRaw.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (activeTab === 'none') {
    return null;
  }

  return (
    <div className="absolute top-16 bottom-16 left-3 sm:left-5 z-30 pointer-events-auto w-[350px] sm:w-[410px] max-w-[calc(100%-1.5rem)] flex flex-col animate-fadeIn">
      <div className="h-full flex flex-col backdrop-blur-2xl bg-black/90 border border-white/15 text-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* DOCK TOP TAB BAR: SWITCH BETWEEN CATALOG, ARCHITECTURE, AND BILL OF MATERIALS */}
        <div className="p-2 sm:p-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between gap-1 flex-shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onSelectTab('catalog')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sofa className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </button>

            <button
              onClick={() => onSelectTab('architecture')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Room Architecture</span>
            </button>

            <button
              onClick={() => onSelectTab('materials')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'materials'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Quote ({placedItems.length})</span>
            </button>
          </div>

          <button
            onClick={() => onSelectTab('none')}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB CONTENT AREA (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          
          {/* ========================================================= */}
          {/* TAB 1: FURNITURE CATALOG */}
          {/* ========================================================= */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white font-heading-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Bespoke Teak Collection
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Click any piece to instantly place it into your 3D room.
                </p>
              </div>

              {/* Category Filter Chips */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 rounded-2xl border border-white/10">
                {CATEGORY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeCatalogCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCatalogCategory(tab.id)}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-black shadow-md font-black'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Item Cards List */}
              <div className="space-y-2.5">
                {filteredCatalog.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onAddItem(item)}
                    className="group p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                          {item.name}
                        </span>
                        {item.tags && item.tags.length > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex-shrink-0">
                            {item.tags[0]}
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-zinc-400 flex items-center gap-2 font-mono">
                        <span>
                          {formatDim(item.widthFt)} × {formatDim(item.depthFt)} × {formatDim(item.heightFt)}
                        </span>
                        <span>•</span>
                        <span className="text-zinc-300 truncate">{item.defaultTimber}</span>
                      </div>

                      <div className="text-xs font-bold text-amber-500 font-mono">
                        ৳ {item.basePriceBDT.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddItem(item);
                      }}
                      className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 shadow-md shadow-amber-500/20"
                      title="Add to Floorplan"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ROOM ARCHITECTURE & FINISHES */}
          {/* ========================================================= */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white font-heading-bold">
                    Room Architecture & Materials
                  </h4>
                  <p className="text-[11px] text-zinc-400">Custom parametric scale and finishes</p>
                </div>
                <div className="text-xs font-mono text-amber-400 font-bold">
                  {roomAreaSqFt} sq ft ({roomAreaM2} m²)
                </div>
              </div>

              {/* Room Presets */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Curated Room Presets
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {ROOM_PRESETS.map((p) => {
                    const isSelected = roomConfig.presetId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => onSelectPreset(p.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500 text-amber-300'
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-zinc-300'
                        }`}
                      >
                        <div className="text-[11px] font-bold truncate">{p.name}</div>
                        <div className="text-[9px] font-mono text-zinc-400">
                          {p.widthFt}×{p.lengthFt} ft
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Parametric Dimension Sliders & Direct Numeric Inputs */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Room Width (X):</span>
                    <span className="font-mono text-amber-400 font-bold flex items-center gap-1">
                      <input
                        type="number"
                        min={8}
                        max={50}
                        step={0.5}
                        value={roomConfig.widthFt}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onUpdateDimensions(val, roomConfig.lengthFt, roomConfig.ceilingHeightFt);
                          }
                        }}
                        className="w-16 bg-black/60 border border-amber-500/40 hover:border-amber-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-md px-1.5 py-0.5 text-right font-mono text-xs text-amber-400 font-bold outline-none transition-all"
                      />
                      <span className="text-zinc-300 text-[11px]">ft</span>
                      {unitSystem === 'metric' && (
                        <span className="text-zinc-500 text-[10px] font-normal">
                          ({(roomConfig.widthFt * 0.3048).toFixed(1)}m)
                        </span>
                      )}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={40}
                    step={0.5}
                    value={roomConfig.widthFt}
                    onChange={(e) =>
                      onUpdateDimensions(Number(e.target.value), roomConfig.lengthFt, roomConfig.ceilingHeightFt)
                    }
                    className="w-full accent-amber-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Room Length (Z):</span>
                    <span className="font-mono text-amber-400 font-bold flex items-center gap-1">
                      <input
                        type="number"
                        min={8}
                        max={50}
                        step={0.5}
                        value={roomConfig.lengthFt}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onUpdateDimensions(roomConfig.widthFt, val, roomConfig.ceilingHeightFt);
                          }
                        }}
                        className="w-16 bg-black/60 border border-amber-500/40 hover:border-amber-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-md px-1.5 py-0.5 text-right font-mono text-xs text-amber-400 font-bold outline-none transition-all"
                      />
                      <span className="text-zinc-300 text-[11px]">ft</span>
                      {unitSystem === 'metric' && (
                        <span className="text-zinc-500 text-[10px] font-normal">
                          ({(roomConfig.lengthFt * 0.3048).toFixed(1)}m)
                        </span>
                      )}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={40}
                    step={0.5}
                    value={roomConfig.lengthFt}
                    onChange={(e) =>
                      onUpdateDimensions(roomConfig.widthFt, Number(e.target.value), roomConfig.ceilingHeightFt)
                    }
                    className="w-full accent-amber-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Ceiling Height:</span>
                    <span className="font-mono text-amber-400 font-bold flex items-center gap-1">
                      <input
                        type="number"
                        min={7}
                        max={20}
                        step={0.5}
                        value={roomConfig.ceilingHeightFt}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onUpdateDimensions(roomConfig.widthFt, roomConfig.lengthFt, val);
                          }
                        }}
                        className="w-16 bg-black/60 border border-amber-500/40 hover:border-amber-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-md px-1.5 py-0.5 text-right font-mono text-xs text-amber-400 font-bold outline-none transition-all"
                      />
                      <span className="text-zinc-300 text-[11px]">ft</span>
                      {unitSystem === 'metric' && (
                        <span className="text-zinc-500 text-[10px] font-normal">
                          ({(roomConfig.ceilingHeightFt * 0.3048).toFixed(1)}m)
                        </span>
                      )}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={7}
                    max={18}
                    step={0.5}
                    value={roomConfig.ceilingHeightFt}
                    onChange={(e) =>
                      onUpdateDimensions(roomConfig.widthFt, roomConfig.lengthFt, Number(e.target.value))
                    }
                    className="w-full accent-amber-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Flooring Finish */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Architectural Flooring Material
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FLOOR_FINISHES.map((f) => {
                    const isSelected = roomConfig.floorFinish === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => onUpdateFinish(f.id, roomConfig.wallColor)}
                        className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div
                          className="w-full h-5 rounded-md border border-white/20"
                          style={{ backgroundColor: f.colorHex }}
                        />
                        <span className="text-[10px] font-bold text-white truncate">{f.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wall Colors */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Wall Color Tint
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {WALL_COLORS.map((w) => {
                    const isSelected = roomConfig.wallColor === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => onUpdateFinish(roomConfig.floorFinish, w.id)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-white/20 shadow-inner"
                          style={{ backgroundColor: w.colorHex }}
                        />
                        <span className="text-[9px] font-bold text-white truncate">{w.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Architectural Windows & Doors on Any Wall */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                      Windows & Doors on Walls
                    </label>
                    <span className="text-[11px] text-zinc-400">
                      Add, resize, and position openings on any wall
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-400 font-bold">
                    {(roomConfig.openings || []).length} Openings
                  </span>
                </div>

                {/* Quick Add Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onAddOpening?.('window', 'back')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>+ Add Window</span>
                  </button>
                  <button
                    onClick={() => onAddOpening?.('door', 'left')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    <DoorOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>+ Add Door</span>
                  </button>
                </div>

                {/* List of Openings */}
                {(roomConfig.openings || []).length === 0 ? (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-zinc-400">
                    No windows or doors placed yet. Click above to add one to any wall.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {(roomConfig.openings || []).map((op, idx) => {
                      const isWindow = op.type === 'window';
                      const wallLength =
                        op.wall === 'back' || op.wall === 'front'
                          ? roomConfig.widthFt
                          : roomConfig.lengthFt;
                      const posFt = Number((op.positionRatio * wallLength).toFixed(1));

                      return (
                        <div
                          key={op.id}
                          className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-amber-500/30 transition-all space-y-2.5 text-xs"
                        >
                          {/* Top Header Row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`p-1.5 rounded-lg ${
                                  isWindow
                                    ? 'bg-sky-500/20 text-sky-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}
                              >
                                {isWindow ? (
                                  <Maximize2 className="w-3.5 h-3.5" />
                                ) : (
                                  <DoorOpen className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-white uppercase text-[11px] tracking-wide">
                                  {isWindow ? `Window ${idx + 1}` : `Door ${idx + 1}`}
                                </span>
                                <span className="text-[10px] text-zinc-400 ml-1.5">
                                  ({op.widthFt} × {op.heightFt} ft)
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => onDeleteOpening?.(op.id)}
                              className="p-1 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Opening"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Target Wall Selector */}
                          <div>
                            <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                              Wall Location:
                            </span>
                            <div className="grid grid-cols-4 gap-1">
                              {(['back', 'left', 'right', 'front'] as const).map((w) => {
                                const labels: Record<string, string> = {
                                  back: 'Back (N)',
                                  left: 'Left (W)',
                                  right: 'Right (E)',
                                  front: 'Front (S)'
                                };
                                const isCurWall = op.wall === w;
                                return (
                                  <button
                                    key={w}
                                    onClick={() => onUpdateOpening?.(op.id, { wall: w })}
                                    className={`py-1 px-1 rounded-lg text-[10px] font-bold transition-all truncate text-center ${
                                      isCurWall
                                        ? 'bg-amber-500 text-black shadow-sm'
                                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                                    }`}
                                  >
                                    {labels[w]}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Position Along Wall: Slider & Number Input */}
                          <div className="space-y-1 bg-white/5 p-2 rounded-lg">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-zinc-400 font-medium">Position on Wall</span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min={1}
                                  max={Math.max(1, wallLength - 1)}
                                  step={0.5}
                                  value={posFt}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (!isNaN(val)) {
                                      const ratio = Math.max(0.08, Math.min(0.92, val / wallLength));
                                      onUpdateOpening?.(op.id, { positionRatio: ratio });
                                    }
                                  }}
                                  className="w-14 bg-black/60 border border-amber-500/40 rounded px-1 text-right font-mono text-[11px] text-amber-400 font-bold outline-none"
                                />
                                <span className="text-zinc-400 text-[10px]">ft</span>
                              </div>
                            </div>
                            <input
                              type="range"
                              min={0.08}
                              max={0.92}
                              step={0.01}
                              value={op.positionRatio}
                              onChange={(e) =>
                                onUpdateOpening?.(op.id, { positionRatio: Number(e.target.value) })
                              }
                              className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                            />
                          </div>

                          {/* Width & Height: Dual Sliders and Numeric Inputs */}
                          <div className="grid grid-cols-2 gap-2">
                            {/* Width */}
                            <div className="space-y-1 bg-white/5 p-2 rounded-lg">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-zinc-400">Width</span>
                                <div className="flex items-center gap-0.5">
                                  <input
                                    type="number"
                                    min={1.5}
                                    max={Math.max(2, wallLength - 1)}
                                    step={0.5}
                                    value={op.widthFt}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      if (!isNaN(val) && val > 0) {
                                        onUpdateOpening?.(op.id, { widthFt: Math.min(wallLength - 0.5, val) });
                                      }
                                    }}
                                    className="w-12 bg-black/60 border border-amber-500/40 rounded px-1 text-right font-mono text-[11px] text-amber-400 font-bold outline-none"
                                  />
                                  <span className="text-zinc-400 text-[9px]">ft</span>
                                </div>
                              </div>
                              <input
                                type="range"
                                min={1.8}
                                max={Math.min(10, wallLength - 1)}
                                step={0.2}
                                value={op.widthFt}
                                onChange={(e) =>
                                  onUpdateOpening?.(op.id, { widthFt: Number(e.target.value) })
                                }
                                className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                              />
                            </div>

                            {/* Height */}
                            <div className="space-y-1 bg-white/5 p-2 rounded-lg">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-zinc-400">Height</span>
                                <div className="flex items-center gap-0.5">
                                  <input
                                    type="number"
                                    min={1.5}
                                    max={Math.max(2, roomConfig.ceilingHeightFt - 0.5)}
                                    step={0.5}
                                    value={op.heightFt}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      if (!isNaN(val) && val > 0) {
                                        onUpdateOpening?.(op.id, { heightFt: Math.min(roomConfig.ceilingHeightFt - 0.2, val) });
                                      }
                                    }}
                                    className="w-12 bg-black/60 border border-amber-500/40 rounded px-1 text-right font-mono text-[11px] text-amber-400 font-bold outline-none"
                                  />
                                  <span className="text-zinc-400 text-[9px]">ft</span>
                                </div>
                              </div>
                              <input
                                type="range"
                                min={2.0}
                                max={Math.min(8.5, roomConfig.ceilingHeightFt - 0.5)}
                                step={0.2}
                                value={op.heightFt}
                                onChange={(e) =>
                                  onUpdateOpening?.(op.id, { heightFt: Number(e.target.value) })
                                }
                                className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Sill Height for Window OR Door Swing Angle for Door */}
                          {isWindow ? (
                            <div className="space-y-1 bg-white/5 p-2 rounded-lg">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-zinc-400">Sill Height (Elevation)</span>
                                <div className="flex items-center gap-0.5">
                                  <input
                                    type="number"
                                    min={0.5}
                                    max={Math.max(1, roomConfig.ceilingHeightFt - op.heightFt - 0.2)}
                                    step={0.2}
                                    value={op.sillHeightFt ?? 2.2}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      if (!isNaN(val)) {
                                        onUpdateOpening?.(op.id, { sillHeightFt: val });
                                      }
                                    }}
                                    className="w-12 bg-black/60 border border-amber-500/40 rounded px-1 text-right font-mono text-[11px] text-amber-400 font-bold outline-none"
                                  />
                                  <span className="text-zinc-400 text-[9px]">ft</span>
                                </div>
                              </div>
                              <input
                                type="range"
                                min={0.5}
                                max={Math.max(0.8, roomConfig.ceilingHeightFt - op.heightFt - 0.2)}
                                step={0.1}
                                value={op.sillHeightFt ?? 2.2}
                                onChange={(e) =>
                                  onUpdateOpening?.(op.id, { sillHeightFt: Number(e.target.value) })
                                }
                                className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                              />
                            </div>
                          ) : (
                            <div className="space-y-1.5 bg-white/5 p-2 rounded-lg">
                              <span className="text-[10px] text-zinc-400 block font-medium">Door Swing Angle:</span>
                              <div className="grid grid-cols-4 gap-1">
                                {[
                                  { label: '0° Closed', angle: 0 },
                                  { label: '30° Ajar', angle: 30 },
                                  { label: '45° Open', angle: 45 },
                                  { label: '90° Wide', angle: 90 }
                                ].map((sw) => {
                                  const isSelected = (op.doorOpenAngle ?? 45) === sw.angle;
                                  return (
                                    <button
                                      key={sw.angle}
                                      onClick={() => onUpdateOpening?.(op.id, { doorOpenAngle: sw.angle })}
                                      className={`py-1 rounded text-[10px] font-bold transition-all ${
                                        isSelected
                                          ? 'bg-amber-500 text-black font-bold'
                                          : 'bg-black/40 text-zinc-400 hover:text-white'
                                      }`}
                                    >
                                      {sw.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Lighting Environment Selector */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                    Lighting Environment Preset
                  </label>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    {roomConfig.lightingPreset === 'evening'
                      ? 'Evening (2700K)'
                      : roomConfig.lightingPreset === 'gallery'
                      ? 'Gallery (High CRI)'
                      : 'Day (5500K)'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Day */}
                  <button
                    onClick={() => onChangeLightingPreset?.('day')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      (roomConfig.lightingPreset || 'day') === 'day'
                        ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white leading-tight">Daylight</div>
                      <div className="text-[9px] text-zinc-400 mt-0.5">Crisp Sunbeams</div>
                    </div>
                  </button>

                  {/* Evening */}
                  <button
                    onClick={() => onChangeLightingPreset?.('evening')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      roomConfig.lightingPreset === 'evening'
                        ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center text-orange-400">
                      <Sunset className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white leading-tight">Evening</div>
                      <div className="text-[9px] text-zinc-400 mt-0.5">Warm Dusk Glow</div>
                    </div>
                  </button>

                  {/* Gallery */}
                  <button
                    onClick={() => onChangeLightingPreset?.('gallery')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      roomConfig.lightingPreset === 'gallery'
                        ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-400/20 flex items-center justify-center text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white leading-tight">Gallery</div>
                      <div className="text-[9px] text-zinc-400 mt-0.5">Track Spotlights</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Corner Floor-to-Ceiling Window Toggle */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-bold text-white">Corner Panoramic Window</div>
                  <div className="text-[10px] text-zinc-400">Natural daylight shafts & vista</div>
                </div>
                <button
                  onClick={onToggleWindow}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                    roomConfig.hasCornerWindow ? 'bg-amber-500' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black transition-transform ${
                      roomConfig.hasCornerWindow ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: BILL OF MATERIALS & WHATSAPP QUOTE */}
          {/* ========================================================= */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white font-heading-bold">
                    Bespoke Bill of Materials
                  </h4>
                  <p className="text-[11px] text-zinc-400">Real-time room density and timber estimate</p>
                </div>
                <div className="text-xs font-mono text-amber-400 font-bold">
                  {placedItems.length} {placedItems.length === 1 ? 'piece' : 'pieces'}
                </div>
              </div>

              {/* Spatial Utilization Gauge */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium">Room Density:</span>
                  <span
                    className={`font-mono font-bold ${
                      utilizationPercent > 35 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {utilizationPercent}% ({furnitureFootprintSqFt} sq ft of {roomAreaSqFt} sq ft)
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      utilizationPercent > 35
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : 'bg-gradient-to-r from-emerald-500 to-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, utilizationPercent * 2.5)}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-400">
                  {utilizationPercent < 15
                    ? 'Spacious minimalist circulation. Ample room for movement.'
                    : utilizationPercent <= 30
                    ? 'Optimal luxury spatial balance between bespoke furniture and walkway.'
                    : 'Dense layout. Consider spacing out larger armchairs or beds.'}
                </p>
              </div>

              {/* Placed Furniture Items List */}
              <div className="space-y-2">
                {placedItems.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 text-xs border border-dashed border-white/10 rounded-2xl">
                    No furniture placed yet. Open the Catalog tab to add pieces.
                  </div>
                ) : (
                  placedItems.map((p, idx) => {
                    const meta = catalogMap.get(p.itemId);
                    if (!meta) return null;
                    return (
                      <div
                        key={p.instanceId}
                        className="p-2.5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">
                            {idx + 1}. {meta.name}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            {formatDim(meta.widthFt)} × {formatDim(meta.depthFt)} • {p.selectedTimber}
                          </div>
                          <div className="text-xs font-mono text-amber-500 font-bold">
                            ৳ {meta.basePriceBDT.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onRotateItem90(p.instanceId, true)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Rotate 90°"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDuplicateItem(p.instanceId)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(p.instanceId)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Total Price & Primary Actions */}
              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                    Total Estimated Quote
                  </span>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    ৳ {totalPriceBDT.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={handleSendWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-black font-black uppercase text-xs tracking-wider py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Quote to WhatsApp</span>
                  </button>

                  <button
                    onClick={onExportBlueprint}
                    className="w-full bg-white/10 hover:bg-white/15 text-white font-bold uppercase text-xs tracking-wider py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all border border-white/10"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Blueprint Image</span>
                  </button>

                  {placedItems.length > 0 && (
                    <button
                      onClick={onClearAll}
                      className="w-full text-zinc-500 hover:text-rose-400 text-[11px] font-bold uppercase tracking-wider py-1 text-center transition-colors"
                    >
                      Clear All Placed Furniture
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
