import React, { useState } from 'react';
import {
  Sofa,
  Bed,
  UtensilsCrossed,
  Briefcase,
  Plus,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { CatalogCategory, CatalogItem, UnitSystem } from './types';
import { CATALOG_ITEMS } from './catalogData';

interface CatalogTrayProps {
  unitSystem: UnitSystem;
  onAddItem: (item: CatalogItem) => void;
}

const CATEGORY_TABS: { id: CatalogCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'living', label: 'Living', icon: Sofa },
  { id: 'bedroom', label: 'Bedroom', icon: Bed },
  { id: 'dining', label: 'Dining', icon: UtensilsCrossed },
  { id: 'executive', label: 'Executive', icon: Briefcase }
];

export const CatalogTray: React.FC<CatalogTrayProps> = ({ unitSystem, onAddItem }) => {
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>('living');
  const [isTrayOpen, setIsTrayOpen] = useState(true);

  const filteredItems = CATALOG_ITEMS.filter((it) => it.category === activeCategory);

  const formatDim = (ft: number) => {
    if (unitSystem === 'metric') {
      return `${(ft * 0.3048).toFixed(1)}m`;
    }
    return `${ft.toFixed(1)}ft`;
  };

  return (
    <div className="absolute top-20 left-4 sm:left-6 z-20 pointer-events-auto max-w-[340px] sm:max-w-[360px] w-full">
      <div className="backdrop-blur-xl bg-black/80 border border-white/15 text-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Tray Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white font-heading-bold">
              Heaven Furniture Catalog
            </h3>
          </div>
          <button
            onClick={() => setIsTrayOpen(!isTrayOpen)}
            className="text-[11px] text-zinc-400 hover:text-white uppercase font-bold tracking-wider transition-colors"
          >
            {isTrayOpen ? 'Minimize' : 'Open'}
          </button>
        </div>

        {isTrayOpen && (
          <div className="p-4 space-y-3">
            {/* Category Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 rounded-2xl border border-white/5">
              {CATEGORY_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition-all ${
                      isActive
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

            {/* Catalog Items Grid / List */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/40 rounded-2xl transition-all group flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {formatDim(item.widthFt)} W × {formatDim(item.depthFt)} D × {formatDim(item.heightFt)} H
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        ৳ {item.basePriceBDT.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-wider truncate max-w-[190px]">
                      {item.defaultTimber}
                    </span>
                    <button
                      onClick={() => onAddItem(item)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add to Room</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 pt-1 border-t border-white/5">
              <Info className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span>Pieces snap magnetically to a 0.5 ft floor grid.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
