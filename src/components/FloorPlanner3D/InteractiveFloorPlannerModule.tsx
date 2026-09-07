import React, { useState, useRef, useCallback } from 'react';
import { InteractiveFloorPlannerCanvas } from './InteractiveFloorPlannerCanvas';
import { FloorPlannerHUD } from './FloorPlannerHUD';
import { StudioDock, StudioTab } from './StudioDock';
import {
  RoomConfig,
  PlacedFurniture,
  CameraMode,
  UnitSystem,
  RoomPresetId,
  FloorFinishId,
  WallColorId,
  CatalogItem,
  WallOpening,
  WallOpeningType,
  WallSide
} from './types';
import { ROOM_PRESETS, CATALOG_ITEMS } from './catalogData';
import { snapToGrid, calculateFurnitureFootprintSqFt } from './collisionUtils';
import { BRAND_INFO } from '../../data/furnitureData';
import { Sofa, Sliders, FileText, Send } from 'lucide-react';

interface InteractiveFloorPlannerModuleProps {
  onOpenConsultation?: (initialData?: any) => void;
}

export const InteractiveFloorPlannerModule: React.FC<InteractiveFloorPlannerModuleProps> = ({
  onOpenConsultation
}) => {
  // 1. Initial State from Default Preset (Agrabad Penthouse Living)
  const initialPreset = ROOM_PRESETS[0];

  const [roomConfig, setRoomConfig] = useState<RoomConfig>({
    presetId: initialPreset.id,
    lengthFt: initialPreset.lengthFt,
    widthFt: initialPreset.widthFt,
    ceilingHeightFt: initialPreset.ceilingHeightFt,
    floorFinish: initialPreset.recommendedFinish,
    wallColor: initialPreset.recommendedWall,
    hasCornerWindow: true,
    outsideVista: 'garden',
    openings: initialPreset.defaultOpenings || []
  });

  const [placedItems, setPlacedItems] = useState<PlacedFurniture[]>(() =>
    initialPreset.defaultFurnitureIds.map((df, idx) => ({
      instanceId: `inst-${idx}-${df.itemId}`,
      itemId: df.itemId,
      x: df.x,
      z: df.z,
      yElevation: 0,
      rotationY: df.rotationY,
      selectedTimber: 'Chittagong Teak'
    }))
  );

  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>('perspective');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Active drawer tab in the unified Studio Dock (defaults to catalog, ZERO overlap)
  const [activeTab, setActiveTab] = useState<StudioTab>('catalog');

  // 2. Undo / Redo History Stack
  const historyRef = useRef<{ past: PlacedFurniture[][]; future: PlacedFurniture[][] }>({
    past: [],
    future: []
  });
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushHistory = useCallback((newItems: PlacedFurniture[]) => {
    historyRef.current.past.push(placedItems);
    historyRef.current.future = [];
    if (historyRef.current.past.length > 20) {
      historyRef.current.past.shift();
    }
    setCanUndo(true);
    setCanRedo(false);
  }, [placedItems]);

  const handleUndo = useCallback(() => {
    if (historyRef.current.past.length === 0) return;
    const previous = historyRef.current.past.pop();
    if (previous) {
      historyRef.current.future.push(placedItems);
      setPlacedItems(previous);
      setCanUndo(historyRef.current.past.length > 0);
      setCanRedo(true);
    }
  }, [placedItems]);

  const handleRedo = useCallback(() => {
    if (historyRef.current.future.length === 0) return;
    const next = historyRef.current.future.pop();
    if (next) {
      historyRef.current.past.push(placedItems);
      setPlacedItems(next);
      setCanUndo(true);
      setCanRedo(historyRef.current.future.length > 0);
    }
  }, [placedItems]);

  // 3. Preset Loading
  const handleSelectPreset = useCallback((presetId: RoomPresetId) => {
    const preset = ROOM_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setRoomConfig((prev) => ({
      ...prev,
      presetId,
      lengthFt: preset.lengthFt,
      widthFt: preset.widthFt,
      ceilingHeightFt: preset.ceilingHeightFt,
      floorFinish: preset.recommendedFinish,
      wallColor: preset.recommendedWall,
      openings: preset.defaultOpenings ? [...preset.defaultOpenings] : []
    }));

    const newPlaced = preset.defaultFurnitureIds.map((df, idx) => ({
      instanceId: `preset-${Date.now()}-${idx}-${df.itemId}`,
      itemId: df.itemId,
      x: df.x,
      z: df.z,
      yElevation: 0,
      rotationY: df.rotationY,
      selectedTimber: 'Chittagong Teak'
    }));

    pushHistory(newPlaced);
    setPlacedItems(newPlaced);
    setSelectedInstanceId(null);
  }, [pushHistory]);

  // 4. Dimension & Finishing updates
  const handleUpdateDimensions = useCallback((widthFt: number, lengthFt: number, ceilingHeightFt: number) => {
    setRoomConfig((prev) => ({
      ...prev,
      widthFt,
      lengthFt,
      ceilingHeightFt,
      presetId: 'custom'
    }));
  }, []);

  const handleUpdateFinish = useCallback((floor: FloorFinishId, wall: WallColorId) => {
    setRoomConfig((prev) => ({
      ...prev,
      floorFinish: floor,
      wallColor: wall
    }));
  }, []);

  const handleToggleWindow = useCallback(() => {
    setRoomConfig((prev) => ({
      ...prev,
      hasCornerWindow: !prev.hasCornerWindow
    }));
  }, []);

  // Wall Openings (Windows & Doors) Management
  const handleAddOpening = useCallback((type: WallOpeningType, wall: WallSide) => {
    const newId = `opening-${type}-${Date.now()}`;
    const newOpening: WallOpening = {
      id: newId,
      type,
      wall,
      positionRatio: 0.5,
      widthFt: type === 'window' ? 5.0 : 3.2,
      heightFt: type === 'window' ? 4.5 : 7.0,
      sillHeightFt: type === 'window' ? 2.2 : 0,
      doorOpenAngle: type === 'door' ? 45 : undefined,
      style: type === 'window' ? 'casement' : 'teak-door'
    };

    setRoomConfig((prev) => ({
      ...prev,
      openings: [...(prev.openings || []), newOpening]
    }));
  }, []);

  const handleUpdateOpening = useCallback((id: string, updates: Partial<WallOpening>) => {
    setRoomConfig((prev) => ({
      ...prev,
      openings: (prev.openings || []).map((op) => (op.id === id ? { ...op, ...updates } : op))
    }));
  }, []);

  const handleDeleteOpening = useCallback((id: string) => {
    setRoomConfig((prev) => ({
      ...prev,
      openings: (prev.openings || []).filter((op) => op.id !== id)
    }));
  }, []);

  // 5. Manipulation Actions
  const handleAddItem = useCallback((item: CatalogItem) => {
    const newInstanceId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    // Place near center with slight offset
    const offsetX = (Math.random() - 0.5) * 4;
    const offsetZ = (Math.random() - 0.5) * 4;

    const newPiece: PlacedFurniture = {
      instanceId: newInstanceId,
      itemId: item.id,
      x: snapToGrid(offsetX, 0.5),
      z: snapToGrid(offsetZ, 0.5),
      yElevation: 0,
      rotationY: 0,
      selectedTimber: item.defaultTimber,
      selectedFabric: item.defaultFabric
    };

    const nextList = [...placedItems, newPiece];
    pushHistory(nextList);
    setPlacedItems(nextList);
    setSelectedInstanceId(newInstanceId);
  }, [placedItems, pushHistory]);

  const handleUpdateItemPosition = useCallback((instanceId: string, x: number, z: number) => {
    setPlacedItems((prev) =>
      prev.map((item) => (item.instanceId === instanceId ? { ...item, x, z } : item))
    );
  }, []);

  const handleDragEnd = useCallback(() => {
    // Commit current positions to history on drag release
    pushHistory(placedItems);
  }, [placedItems, pushHistory]);

  const handleRotateItem90 = useCallback((instanceId: string, clockwise: boolean) => {
    const delta = clockwise ? Math.PI / 2 : -Math.PI / 2;
    setPlacedItems((prev) => {
      const next = prev.map((item) =>
        item.instanceId === instanceId
          ? { ...item, rotationY: item.rotationY + delta }
          : item
      );
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const handleDuplicateItem = useCallback((instanceId: string) => {
    const target = placedItems.find((p) => p.instanceId === instanceId);
    if (!target) return;

    const newInstanceId = `dup-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const cloned: PlacedFurniture = {
      ...target,
      instanceId: newInstanceId,
      x: snapToGrid(target.x + 1.5, 0.5),
      z: snapToGrid(target.z + 1.5, 0.5)
    };

    const next = [...placedItems, cloned];
    pushHistory(next);
    setPlacedItems(next);
    setSelectedInstanceId(newInstanceId);
  }, [placedItems, pushHistory]);

  const handleDeleteItem = useCallback((instanceId: string) => {
    const next = placedItems.filter((p) => p.instanceId !== instanceId);
    pushHistory(next);
    setPlacedItems(next);
    if (selectedInstanceId === instanceId) {
      setSelectedInstanceId(null);
    }
  }, [placedItems, selectedInstanceId, pushHistory]);

  const handleClearAll = useCallback(() => {
    pushHistory([]);
    setPlacedItems([]);
    setSelectedInstanceId(null);
  }, [pushHistory]);

  // 6. Screenshot & Blueprint Export
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);

  const handleExportBlueprint = useCallback(() => {
    const canvas = canvasElementRef.current;
    if (!canvas) {
      alert('Generating 3D Blueprint... Please try in a moment.');
      return;
    }

    try {
      const dataUrl = canvas.toDataURL('image/png');

      const offCanvas = document.createElement('canvas');
      offCanvas.width = canvas.width || 1920;
      offCanvas.height = canvas.height || 1080;
      const ctx = offCanvas.getContext('2d');

      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, offCanvas.width, offCanvas.height);

          // Top Header Bar
          ctx.fillStyle = 'rgba(10, 10, 10, 0.88)';
          ctx.fillRect(0, 0, offCanvas.width, 100);

          ctx.fillStyle = '#D4AF37';
          ctx.font = 'bold 26px sans-serif';
          ctx.fillText('HEAVEN FURNITURE MART — BESPOKE SPATIAL FLOORPLAN', 40, 48);

          ctx.fillStyle = '#E5E5E5';
          ctx.font = '15px monospace';
          const areaSqFt = roomConfig.widthFt * roomConfig.lengthFt;
          ctx.fillText(
            `Room: ${roomConfig.presetId.toUpperCase()} • ${roomConfig.widthFt} ft W × ${roomConfig.lengthFt} ft L × ${roomConfig.ceilingHeightFt} ft H (${areaSqFt} sq ft) • Flooring: ${roomConfig.floorFinish}`,
            40,
            80
          );

          // Bottom Signature Strip
          ctx.fillStyle = 'rgba(10, 10, 10, 0.85)';
          ctx.fillRect(0, offCanvas.height - 60, offCanvas.width, 60);

          ctx.fillStyle = '#A3A3A3';
          ctx.font = '14px sans-serif';
          ctx.fillText(
            `Flagship Studio: ${BRAND_INFO.location} • Hotline: ${BRAND_INFO.phone} • Designed with Heaven 3D Spatial Engine`,
            40,
            offCanvas.height - 24
          );

          // Trigger download
          const link = document.createElement('a');
          link.download = `Heaven-Floorplan-${roomConfig.presetId}-${Date.now()}.png`;
          link.href = offCanvas.toDataURL('image/png');
          link.click();
        };
        img.src = dataUrl;
      }
    } catch (e) {
      console.error('Error generating blueprint export:', e);
    }
  }, [roomConfig]);

  // Quick stats for bottom strip
  const catalogMap = new Map<string, CatalogItem>();
  CATALOG_ITEMS.forEach((it) => catalogMap.set(it.id, it));
  const totalPriceBDT = placedItems.reduce((sum, p) => {
    const meta = catalogMap.get(p.itemId);
    return sum + (meta ? meta.basePriceBDT : 0);
  }, 0);
  const roomAreaSqFt = roomConfig.widthFt * roomConfig.lengthFt;
  const footprint = calculateFurnitureFootprintSqFt(placedItems);
  const densityPercent = roomAreaSqFt > 0 ? Math.round((footprint / roomAreaSqFt) * 100) : 0;

  return (
    <div className="w-full relative bg-[#070707] rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[680px] sm:h-[760px] lg:h-[840px]">
      
      {/* 3D WEBGL INTERACTIVE CANVAS */}
      <InteractiveFloorPlannerCanvas
        roomConfig={roomConfig}
        placedItems={placedItems}
        selectedInstanceId={selectedInstanceId}
        cameraMode={cameraMode}
        unitSystem={unitSystem}
        autoRotate={autoRotate}
        onSelectItem={setSelectedInstanceId}
        onUpdateItemPosition={handleUpdateItemPosition}
        onRotateItem90={handleRotateItem90}
        onDuplicateItem={handleDuplicateItem}
        onDeleteItem={handleDeleteItem}
        onDragEnd={handleDragEnd}
        onCanvasReady={(el) => {
          canvasElementRef.current = el;
        }}
      />

      {/* TOP SLEEK NON-OVERLAPPING HUD */}
      <FloorPlannerHUD
        roomConfig={roomConfig}
        cameraMode={cameraMode}
        unitSystem={unitSystem}
        autoRotate={autoRotate}
        canUndo={canUndo}
        canRedo={canRedo}
        placedCount={placedItems.length}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSelectPreset={handleSelectPreset}
        onChangeCameraMode={setCameraMode}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        onToggleUnitSystem={() => setUnitSystem(unitSystem === 'imperial' ? 'metric' : 'imperial')}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExportBlueprint={handleExportBlueprint}
      />

      {/* UNIFIED STUDIO DOCK (CATALOG, ARCHITECTURE, BILL OF MATERIALS - ZERO OVERLAP) */}
      <StudioDock
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unitSystem={unitSystem}
        roomConfig={roomConfig}
        placedItems={placedItems}
        onAddItem={handleAddItem}
        onSelectPreset={handleSelectPreset}
        onUpdateDimensions={handleUpdateDimensions}
        onUpdateFinish={handleUpdateFinish}
        onToggleWindow={handleToggleWindow}
        onAddOpening={handleAddOpening}
        onUpdateOpening={handleUpdateOpening}
        onDeleteOpening={handleDeleteOpening}
        onDeleteItem={handleDeleteItem}
        onDuplicateItem={handleDuplicateItem}
        onRotateItem90={handleRotateItem90}
        onClearAll={handleClearAll}
        onExportBlueprint={handleExportBlueprint}
        onOpenConsultation={onOpenConsultation}
      />

      {/* FLOATING ACTION CAPSULE (APPEARS ON BOTTOM FOR FAST 1-CLICK ACCESS) */}
      {activeTab === 'none' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2 p-1.5 backdrop-blur-xl bg-black/85 border border-white/15 rounded-full shadow-2xl text-white animate-fadeIn">
          <button
            onClick={() => setActiveTab('catalog')}
            className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Sofa className="w-3.5 h-3.5" />
            <span>+ Add Furniture</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className="px-3 py-1.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Room Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className="px-3 py-1.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quote ({placedItems.length})</span>
          </button>

          <div className="h-4 w-[1px] bg-white/15 mx-1 hidden sm:block" />

          <div className="text-[11px] font-mono text-zinc-400 px-2 hidden sm:flex items-center gap-1.5">
            <span className={densityPercent > 35 ? 'text-rose-400' : 'text-emerald-400'}>
              {densityPercent}% Density
            </span>
            <span>•</span>
            <span className="text-amber-400 font-bold">
              ৳ {totalPriceBDT.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
