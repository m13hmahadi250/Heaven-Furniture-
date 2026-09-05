import React, { useState } from 'react';
import { COLLECTIONS_DATA, BRAND_INFO } from '../data/furnitureData';
import { FurnitureCategory, CollectionItem } from '../types';
import { FurnitureViewer3D } from './ThreeCanvas/FurnitureViewer3D';
import { CollectionCardSkeleton } from './SkeletonLoaders';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowUpRight,
  Compass,
  ShieldCheck,
  Check,
  Clock,
  Box,
  Layers,
  X,
  Send,
  Calendar,
  Eye,
  MessageCircle,
  Maximize2,
  CheckCircle2
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

interface CollectionsSnapshotProps {
  onOpenConsultation: (initialData?: any) => void;
  onCustomizeIn3D: (item: CollectionItem) => void;
}

const ProductCardImageStage: React.FC<{
  item: CollectionItem;
  onOpenDetails: () => void;
  onOpen3D: () => void;
}> = ({ item, onOpenDetails, onOpen3D }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative h-68 sm:h-76 overflow-hidden bg-[#070C0B] cursor-pointer group"
      onClick={onOpenDetails}
    >
      {/* Lightweight SVG Skeleton Loader: active until image is fully hydrated */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <CollectionCardSkeleton />
      </div>

      <img
        src={item.imageUrl}
        alt={item.title}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`relative z-[1] w-full h-full object-cover group-hover:scale-108 transition-all duration-700 ${
          isLoaded ? 'opacity-95 group-hover:opacity-100' : 'opacity-0'
        }`}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';
          setIsLoaded(true);
        }}
      />

      {/* Category Pill */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3.5 py-1 bg-black/85 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
          {item.categoryLabel}
        </span>
      </div>

      {/* Top Right Quick Actions */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen3D();
          }}
          className="bg-amber-500 text-black px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-xl hover:scale-105 transition-all"
          title="Open 3D Turntable"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D View</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails();
          }}
          className="bg-black/75 hover:bg-white text-white hover:text-black p-2 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl"
          title="Enlarge Photo & Specifications"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lead time badge */}
      <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-gray-300 font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10 z-10">
        <Clock className="w-3 h-3 text-amber-500" />
        <span>{item.leadTime}</span>
      </div>
    </div>
  );
};

export const CollectionsSnapshot: React.FC<CollectionsSnapshotProps> = ({
  onOpenConsultation,
  onCustomizeIn3D
}) => {
  const [activeCategory, setActiveCategory] = useState<FurnitureCategory>('all');
  const [quickInspectItem, setQuickInspectItem] = useState<CollectionItem | null>(null);
  const [detailedModalItem, setDetailedModalItem] = useState<CollectionItem | null>(null);
  const [isExploded, setIsExploded] = useState(false);

  const categories: { id: FurnitureCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Creations', count: COLLECTIONS_DATA.length },
    { id: 'living', label: 'Living Suites', count: COLLECTIONS_DATA.filter((i) => i.category === 'living').length },
    { id: 'dining', label: 'Dining Suites', count: COLLECTIONS_DATA.filter((i) => i.category === 'dining').length },
    { id: 'bedroom', label: 'Royal Bedroom', count: COLLECTIONS_DATA.filter((i) => i.category === 'bedroom').length },
    { id: 'bespoke', label: 'Storage & Vitrine', count: COLLECTIONS_DATA.filter((i) => i.category === 'bespoke').length },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? COLLECTIONS_DATA
      : COLLECTIONS_DATA.filter((item) => item.category === activeCategory);

  const getModelTypeForItem = (item: CollectionItem): 'armchair' | 'sofa' | 'dining-table' | 'bed' | 'executive-desk' => {
    if (item.category === 'dining') return 'dining-table';
    if (item.category === 'bedroom') return 'bed';
    if (item.category === 'bespoke') return 'executive-desk';
    if (item.id === 'classic-living-sofa-set' || item.id === 'sapphire-gold-embroidery-sofa' || item.id === 'silver-embroidered-royal-sofa') {
      return 'sofa';
    }
    return 'armchair';
  };

  const getWhatsAppProductUrl = (item: CollectionItem) => {
    const text = `Hello Heaven Furniture Mart! I am interested in your bespoke piece: "${item.title}" (${item.categoryLabel}, Ref ৳${item.basePriceBDT.toLocaleString()}). I would like to inquire about custom dimensions and workshop availability.`;
    return `https://wa.me/8801960481983?text=${encodeURIComponent(text)}`;
  };

  return (
    <section className="py-20 lg:py-28 text-[#F5F5F5] border-b border-white/10 relative overflow-hidden" id="section-dining">
      
      {/* Background Watermark Text */}
      <div className="absolute top-12 left-6 select-none pointer-events-none text-[140px] lg:text-[200px] font-black uppercase text-white/[0.015] tracking-tighter leading-none whitespace-nowrap z-0">
        COLLECTIONS
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-10 h-[1.5px] bg-amber-500"></span>
              <span className="text-amber-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
                Authentic Heaven Collections
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.92] text-white font-heading-bold">
              Bespoke Suites, <br />
              <span className="text-wood-texture">Handcrafted</span> <br />
              <span className="text-amber-500">In Chattogram.</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-light">
              Featuring our authentic portfolio of hand-carved solid Chittagong Segun, genuine Italian marble, 24K gold leaf detailing, and custom upholstered luxury suites.
            </p>
          </div>

          {/* Category Tabs in Bold Pill Style */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-black shadow-lg scale-105'
                    : 'bg-[#141414] text-gray-300 hover:text-white border border-white/10 hover:border-amber-500/40'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeCategory === cat.id ? 'bg-black text-amber-400' : 'bg-white/10 text-gray-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Collections Grid - 9 Real Products */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-[#121212] rounded-3xl border border-white/10 overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col shadow-2xl hover:shadow-amber-500/10"
            >
              {/* Product Image Stage with Lightweight SVG Skeleton Loader */}
              <ProductCardImageStage
                item={item}
                onOpenDetails={() => setDetailedModalItem(item)}
                onOpen3D={() => setQuickInspectItem(item)}
              />

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => setDetailedModalItem(item)}
                      className="text-xl font-bold tracking-tight uppercase text-white leading-snug group-hover:text-amber-400 transition-colors font-heading-bold cursor-pointer"
                    >
                      {item.title}
                    </h3>
                  </div>

                  {item.bengaliTitle && (
                    <div className="text-xs text-amber-400 font-bold tracking-wide">
                      {item.bengaliTitle}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 font-light">
                    {item.description}
                  </p>
                </div>

                {/* Specs Box */}
                <div className="bg-[#0A0A0A] p-3.5 rounded-2xl space-y-2 text-xs border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Timber / Core:</span>
                    <span className="text-gray-300 font-bold truncate max-w-[170px] text-right">{item.wood.split('&')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Dimensions:</span>
                    <span className="font-mono text-[11px] text-gray-400">{item.dimensions.split(' (')[0]}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2 items-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Investment:</span>
                    <span className="text-base font-black text-amber-400 tracking-tight font-heading-bold">৳ {item.basePriceBDT.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() =>
                      onOpenConsultation({
                        roomType: item.categoryLabel,
                        notes: `Inquiry for Collection Piece: ${item.title} (Base ৳ ${item.basePriceBDT.toLocaleString()})`
                      })
                    }
                    className="flex-1 py-3 bg-white text-black hover:bg-amber-500 hover:text-black rounded-full text-xs font-bold uppercase tracking-widest transition-all text-center shadow-lg font-bold"
                  >
                    Custom Quote
                  </button>

                  <a
                    href={getWhatsAppProductUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#181818] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white rounded-full transition-all shadow-md"
                    title="Direct WhatsApp Inquiry"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setQuickInspectItem(item)}
                    className="p-3 bg-[#181818] text-amber-400 border border-white/10 hover:border-amber-500 hover:text-white rounded-full transition-all"
                    title="Inspect in 3D"
                  >
                    <Box className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onCustomizeIn3D(item)}
                    className="p-3 bg-[#181818] text-gray-300 border border-white/10 hover:border-amber-500 hover:text-white rounded-full transition-all"
                    title="Customize in 3D Studio"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Full Photo & Spec Detail Modal */}
      {detailedModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#0E0E0E] text-[#F5F5F5] rounded-3xl max-w-4xl w-full border border-white/15 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#141414]">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {detailedModalItem.categoryLabel}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black uppercase text-white font-heading-bold">
                    {detailedModalItem.title}
                  </h3>
                  {detailedModalItem.bengaliTitle && (
                    <p className="text-xs text-amber-400 font-bold">
                      {detailedModalItem.bengaliTitle}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setDetailedModalItem(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Large High-Res Image Showcase with Skeleton */}
                <div className="md:col-span-7 rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl max-h-[380px] min-h-[260px] flex items-center justify-center relative">
                  <CollectionCardSkeleton variant="modal" className="absolute inset-0 z-0" />
                  <img
                    src={detailedModalItem.imageUrl}
                    alt={detailedModalItem.title}
                    referrerPolicy="no-referrer"
                    className="relative z-[1] w-full h-full object-contain max-h-[380px]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                </div>

                {/* Specifications & Craft Details */}
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-[#141414] p-4 rounded-2xl border border-white/5 space-y-2.5 text-xs">
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Timber & Core</span>
                      <p className="text-white font-medium">{detailedModalItem.wood}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Finish & Polish</span>
                      <p className="text-white font-medium">{detailedModalItem.finish}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Dimensions</span>
                      <p className="text-amber-400 font-mono font-bold">{detailedModalItem.dimensions}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Handcrafting Lead Time</span>
                      <p className="text-gray-300">{detailedModalItem.leadTime}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block">Artisanal Highlights</span>
                    <div className="space-y-1.5">
                      {detailedModalItem.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Base Investment:</span>
                    <span className="text-2xl font-black text-amber-400 font-heading-bold">৳ {detailedModalItem.basePriceBDT.toLocaleString()}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-white/10 bg-[#141414] flex flex-wrap items-center justify-between gap-3">
              <a
                href={getWhatsAppProductUrl(detailedModalItem)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Master Craftsman</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const item = detailedModalItem;
                    setDetailedModalItem(null);
                    onCustomizeIn3D(item);
                  }}
                  className="px-5 py-3 bg-[#202020] text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center gap-2"
                >
                  <Box className="w-4 h-4" />
                  <span>3D Configurator</span>
                </button>

                <button
                  onClick={() => {
                    const item = detailedModalItem;
                    setDetailedModalItem(null);
                    onOpenConsultation({
                      roomType: item.categoryLabel,
                      notes: `Inquiry for ${item.title}`
                    });
                  }}
                  className="px-6 py-3 bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-xl flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book In-Home Consultation</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Quick 3D Inspection Modal */}
      {quickInspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#0E0E0E] text-[#F5F5F5] rounded-3xl max-w-4xl w-full border border-white/15 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#141414]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white font-heading-bold">
                    {quickInspectItem.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Interactive 3D Turntable • {quickInspectItem.wood}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExploded(!isExploded)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    isExploded ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isExploded ? 'Collapse' : 'Explode'}</span>
                </button>

                <button
                  onClick={() => setQuickInspectItem(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal 3D Canvas Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              <div className="h-[360px] sm:h-[440px] rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10 relative">
                <FurnitureViewer3D
                  modelType={getModelTypeForItem(quickInspectItem)}
                  selectedWood="chittagong-teak"
                  selectedFabric="ivory-boucle"
                  exploded={isExploded}
                  onToggleExploded={() => setIsExploded(!isExploded)}
                  lightingMood="warm-studio"
                  showHotspots={true}
                />
              </div>

              {/* Specs & Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs text-gray-400">
                    Base Investment: <strong className="text-amber-400 text-base font-black">৳ {quickInspectItem.basePriceBDT.toLocaleString()}</strong>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Dimensions: {quickInspectItem.dimensions} • {quickInspectItem.leadTime} Lead Time
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const item = quickInspectItem;
                      setQuickInspectItem(null);
                      onCustomizeIn3D(item);
                    }}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-[#181818] text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Full 3D Studio</span>
                  </button>

                  <button
                    onClick={() => {
                      const item = quickInspectItem;
                      setQuickInspectItem(null);
                      onOpenConsultation({
                        roomType: item.categoryLabel,
                        notes: `Consultation request for ${item.title}`
                      });
                    }}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Quote</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
