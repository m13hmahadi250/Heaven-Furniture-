import React, { useState } from 'react';
import {
  FileText,
  ChevronUp,
  ChevronDown,
  Trash2,
  Send,
  Download,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { PlacedFurniture, RoomConfig, UnitSystem, CatalogItem } from './types';
import { CATALOG_ITEMS } from './catalogData';
import { evaluateCollisions, calculateFurnitureFootprintSqFt } from './collisionUtils';
import { BRAND_INFO } from '../../data/furnitureData';

interface BillOfMaterialsDrawerProps {
  placedItems: PlacedFurniture[];
  roomConfig: RoomConfig;
  unitSystem: UnitSystem;
  onDeleteItem: (instanceId: string) => void;
  onClearAll: () => void;
  onExportBlueprint: () => void;
}

export const BillOfMaterialsDrawer: React.FC<BillOfMaterialsDrawerProps> = ({
  placedItems,
  roomConfig,
  unitSystem,
  onDeleteItem,
  onClearAll,
  onExportBlueprint
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const catalogMap = new Map<string, CatalogItem>();
  CATALOG_ITEMS.forEach((it) => catalogMap.set(it.id, it));

  // Compute total price
  const totalPriceBDT = placedItems.reduce((sum, p) => {
    const meta = catalogMap.get(p.itemId);
    return sum + (meta ? meta.basePriceBDT : 0);
  }, 0);

  // Compute square footage & spatial utilization percentage
  const roomAreaSqFt = roomConfig.widthFt * roomConfig.lengthFt;
  const furnitureFootprintSqFt = calculateFurnitureFootprintSqFt(placedItems);
  const utilizationPercent = roomAreaSqFt > 0 ? Math.round((furnitureFootprintSqFt / roomAreaSqFt) * 100) : 0;

  // Collision detection
  const collisionResult = evaluateCollisions(placedItems, roomConfig);

  // WhatsApp Quote Formatter
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
• *Space Utilization*: ${utilizationPercent}% (${furnitureFootprintSqFt} sq ft footprint)
• *Flooring*: ${roomConfig.floorFinish}
• *Wall Finish*: ${roomConfig.wallColor}
• *Corner Panoramic Glazing*: ${roomConfig.hasCornerWindow ? 'Yes' : 'No'}

*PLACED FURNITURE MANIFEST (${placedItems.length} items)*:
${itemListStr || '  (No items placed)'}

---------------------------------------
*ESTIMATED STUDIO QUOTE*: ৳ ${totalPriceBDT.toLocaleString()}
Please confirm seasoned timber readiness and schedule a private showroom consultation or laser measurement appointment.`;

    const url = `https://wa.me/${BRAND_INFO.phoneRaw.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 lg:left-auto lg:right-6 lg:w-[420px] z-30 pointer-events-auto">
      <div className="backdrop-blur-xl bg-black/80 border border-white/15 text-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Header Bar / Quick Summary Strip */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white font-heading-bold">
                  Bespoke Bill of Materials
                </span>
                <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                  {placedItems.length} {placedItems.length === 1 ? 'piece' : 'pieces'}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                <span>৳ {totalPriceBDT.toLocaleString()}</span>
                <span>•</span>
                <span
                  className={
                    utilizationPercent > 35
                      ? 'text-rose-400 font-bold'
                      : 'text-emerald-400 font-bold'
                  }
                >
                  {utilizationPercent}% Room Density
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {collisionResult.hasCollisions ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/40 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                Overlap Alert
              </span>
            ) : (
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <CheckCircle2 className="w-3 h-3" />
                Clearance Valid
              </span>
            )}

            <button className="p-1 text-zinc-400 hover:text-white transition-colors">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Drawer Body */}
        {isExpanded && (
          <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/10 max-h-[360px] overflow-y-auto scrollbar-thin">
            
            {/* Space Utilization Gauge */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Floor Area Utilization:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {furnitureFootprintSqFt} sq ft / {roomAreaSqFt} sq ft ({utilizationPercent}%)
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    utilizationPercent > 35
                      ? 'bg-rose-500'
                      : utilizationPercent > 25
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, utilizationPercent)}%` }}
                />
              </div>
              <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                <span>Recommended circulation clearance: 20% – 32%</span>
                {utilizationPercent > 35 && (
                  <span className="text-rose-400 font-bold">High Density Notice</span>
                )}
              </div>
            </div>

            {/* Placed Items List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                <span>Item Manifest</span>
                {placedItems.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 text-[10px]"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Room</span>
                  </button>
                )}
              </div>

              {placedItems.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-xs">
                  No furniture placed yet. Select pieces from the catalog to add.
                </div>
              ) : (
                placedItems.map((p, idx) => {
                  const meta = catalogMap.get(p.itemId);
                  if (!meta) return null;
                  const isColliding = collisionResult.collidingInstances.has(p.instanceId);

                  return (
                    <div
                      key={p.instanceId}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                        isColliding
                          ? 'bg-rose-950/30 border-rose-500/50'
                          : 'bg-white/5 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-white truncate flex items-center gap-2">
                          <span>{meta.name}</span>
                          {isColliding && (
                            <span className="text-[9px] text-rose-400 uppercase font-bold">
                              Overlap
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {meta.widthFt} × {meta.depthFt} ft • {p.selectedTimber}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 flex items-center gap-2">
                        <div className="font-mono font-bold text-amber-400 text-xs">
                          ৳ {meta.basePriceBDT.toLocaleString()}
                        </div>
                        <button
                          onClick={() => onDeleteItem(p.instanceId)}
                          className="p-1 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Action Buttons: Blueprint Export & Direct WhatsApp Conversion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <button
                onClick={onExportBlueprint}
                className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Blueprint</span>
              </button>

              <button
                onClick={handleSendWhatsApp}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp Quote</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
