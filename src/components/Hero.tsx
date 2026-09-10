import React, { useState, useEffect } from 'react';
import { BRAND_INFO } from '../data/furnitureData';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Bed,
  Armchair,
  Layers,
  Crown,
  Utensils,
  Briefcase,
  RotateCw,
  Ruler,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'motion/react';
import { CraftedAnimatedText } from './CraftedAnimatedText';
import { FurnitureViewer3D, LightingMood } from './ThreeCanvas/FurnitureViewer3D';
import { WoodType, FabricType } from '../types';

interface HeroProps {
  onOpenConsultation: () => void;
  onExploreStudio: () => void;
  activeModelIndex?: number;
  onSelectModel?: (index: number) => void;
}

interface HeroModelOption {
  id: 'sofa' | 'bed' | 'dining-table' | 'armchair' | 'executive-desk';
  title: string;
  category: string;
  price: string;
  dimensions: string;
  defaultWood: WoodType;
  defaultFabric: FabricType;
  icon: React.ComponentType<{ className?: string }>;
}

const HERO_SIGNATURE_PIECES: HeroModelOption[] = [
  {
    id: 'sofa',
    title: 'Royal Sapphire Sofa',
    category: 'Living Suite',
    price: '৳ 2,35,000',
    dimensions: '88"W × 38"D × 42"H',
    defaultWood: 'chittagong-teak',
    defaultFabric: 'emerald-velvet',
    icon: Crown,
  },
  {
    id: 'bed',
    title: 'Aurora Emerald Bed',
    category: 'Master Bedroom',
    price: '৳ 1,85,000',
    dimensions: '78"W × 84"D × 56"H',
    defaultWood: 'solid-walnut',
    defaultFabric: 'emerald-velvet',
    icon: Bed,
  },
  {
    id: 'dining-table',
    title: 'Imperial Dining Suite',
    category: 'Dining Room',
    price: '৳ 2,45,000',
    dimensions: '96"W × 44"D × 30"H',
    defaultWood: 'chittagong-teak',
    defaultFabric: 'ivory-boucle',
    icon: Utensils,
  },
  {
    id: 'armchair',
    title: 'Heritage Teak Armchair',
    category: 'Artisan Lounge',
    price: '৳ 48,000',
    dimensions: '38"W × 36"D × 36"H',
    defaultWood: 'burma-teak',
    defaultFabric: 'cognac-leather',
    icon: Armchair,
  },
  {
    id: 'executive-desk',
    title: 'Diplomatic Desk',
    category: 'Executive Office',
    price: '৳ 1,65,000',
    dimensions: '76"W × 38"D × 31"H',
    defaultWood: 'solid-walnut',
    defaultFabric: 'cognac-leather',
    icon: Briefcase,
  },
];

const WOOD_SWATCHES: { id: WoodType; name: string; hex: string }[] = [
  { id: 'chittagong-teak', name: 'Segun Teak', hex: '#8C572A' },
  { id: 'burma-teak', name: 'Burma Teak', hex: '#683F1C' },
  { id: 'solid-walnut', name: 'Smoked Walnut', hex: '#3D2A20' },
];

const FABRIC_SWATCHES: { id: FabricType; name: string; hex: string }[] = [
  { id: 'emerald-velvet', name: 'Emerald Velvet', hex: '#1B4332' },
  { id: 'ivory-boucle', name: 'Ivory Bouclé', hex: '#EFE9DD' },
  { id: 'cognac-leather', name: 'Cognac Leather', hex: '#8B4513' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const Hero: React.FC<HeroProps> = ({
  onOpenConsultation,
  onExploreStudio,
  activeModelIndex = 0,
  onSelectModel,
}) => {
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(activeModelIndex);
  const currentPiece = HERO_SIGNATURE_PIECES[selectedPieceIndex] || HERO_SIGNATURE_PIECES[0];

  const [selectedWood, setSelectedWood] = useState<WoodType>(currentPiece.defaultWood);
  const [selectedFabric, setSelectedFabric] = useState<FabricType>(currentPiece.defaultFabric);
  const [isExploded, setIsExploded] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [lightingMood, setLightingMood] = useState<LightingMood>('warm-studio');

  // Sync when activeModelIndex prop updates
  useEffect(() => {
    if (typeof activeModelIndex === 'number' && activeModelIndex >= 0 && activeModelIndex < HERO_SIGNATURE_PIECES.length) {
      setSelectedPieceIndex(activeModelIndex);
      setSelectedWood(HERO_SIGNATURE_PIECES[activeModelIndex].defaultWood);
      setSelectedFabric(HERO_SIGNATURE_PIECES[activeModelIndex].defaultFabric);
    }
  }, [activeModelIndex]);

  const handleSelectPiece = (idx: number) => {
    setSelectedPieceIndex(idx);
    const piece = HERO_SIGNATURE_PIECES[idx];
    setSelectedWood(piece.defaultWood);
    setSelectedFabric(piece.defaultFabric);
    if (onSelectModel) {
      onSelectModel(idx);
    }
  };

  const toggleLighting = () => {
    setLightingMood((prev) => (prev === 'warm-studio' ? 'daylight' : prev === 'daylight' ? 'dark-luxury' : 'warm-studio'));
  };
  return (
    <section
      id="section-hero"
      className="relative text-[#F5F5F5] overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24 border-b border-white/10 min-h-[90vh] flex items-center"
    >
      {/* 1. Subtle Luxury Architectural Salon Background Ambience */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-10 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85')",
        }}
      />

      {/* 2. Warm Architectural Showroom Lighting & Vignettes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 72% 38%, rgba(245, 158, 11, 0.12) 0%, rgba(18, 34, 29, 0.25) 45%, rgba(4, 9, 8, 0.65) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040807]/80 via-[#040807]/35 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#040807]/50 via-transparent to-[#040807]/70 pointer-events-none" />

      {/* Dynamic luxury ambient spotlight glows with zero-cost radial gradients */}
      <div
        className="absolute top-0 right-1/4 w-[650px] h-[650px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6, 78, 59, 0.25) 0%, transparent 70%)' }}
      />

      {/* Watermark Background Typography */}
      <div className="absolute top-1/2 -right-16 -translate-y-1/2 select-none pointer-events-none text-[160px] lg:text-[240px] font-black uppercase text-white/[0.03] tracking-tighter leading-none whitespace-nowrap z-0">
        HEAVEN
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 w-full">
        <div className="w-full">
          
          {/* Main Brand Hero Pitch - Full Size to Fit Screen */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full min-h-[82vh] lg:min-h-[86vh] flex flex-col justify-center backdrop-blur-md bg-black/45 p-6 sm:p-10 lg:p-12 xl:p-14 rounded-3xl border border-white/15 shadow-2xl drop-shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
              
              {/* Left Column: Brand Headline, Statement & Primary Actions */}
              <div className="lg:col-span-7 xl:col-span-7 space-y-5 lg:space-y-6">
                
                {/* Bold Eyebrow with hairline rule & live pulse */}
                <motion.div variants={itemVariants} className="flex items-center gap-3">
                  <span className="w-12 h-[1.5px] bg-amber-500"></span>
                  <span className="text-amber-500 uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    Heaven Furniture Mart • Chattogram Bespoke Studio
                  </span>
                </motion.div>

                {/* Giant Bold Typography Headline */}
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.92] uppercase text-white font-heading-bold"
                >
                  Furniture, <br />
                  <CraftedAnimatedText /> <br />
                  <span className="text-amber-500">Around You.</span>
                </motion.h1>

                {/* Concise Brand Statement */}
                <motion.p
                  variants={itemVariants}
                  className="text-base sm:text-lg text-gray-300 font-light leading-relaxed max-w-2xl"
                >
                  Chattogram’s premier bespoke interior studio on Agrabad Access Road. Authentic seasoned Chittagong Teak, master hand-carved Rococo details, and bespoke upholstery tailored to your exact floorplan.
                </motion.p>

                {/* Primary Action Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <button
                    onClick={onOpenConsultation}
                    id="hero-request-quote-btn"
                    className="px-8 py-4 rounded-full bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-2 group"
                  >
                    <span>Request Bespoke Quote</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={onExploreStudio}
                    className="px-6 py-4 rounded-full bg-[#161616]/90 backdrop-blur-md border border-white/20 hover:border-amber-500 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-[#202020]"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>3D Configurator Studio</span>
                  </button>

                  <a
                    href={BRAND_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-4 rounded-full bg-[#121212]/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    title="Direct WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </motion.div>

              </div>

              {/* Right Column: Fully Interactive Working 3D Showcase & Bespoke Configurator Preview */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-5 xl:col-span-5 flex flex-col gap-4 bg-gradient-to-b from-[#151917]/95 via-[#0D100F]/95 to-[#070908]/98 border border-white/15 hover:border-amber-500/40 p-5 sm:p-6 rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-300 group"
              >
                {/* Top Golden Accent Rim Highlight */}
                <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

                {/* 1. Sleek Minimal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                        {currentPiece.category}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase font-heading-bold">
                      {currentPiece.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-medium">Bespoke</span>
                    <span className="text-base sm:text-lg font-black text-amber-400 tracking-tight font-heading-bold">
                      {currentPiece.price}
                    </span>
                  </div>
                </div>

                {/* 2. Interactive 3D WebGL Stage (Generous, Clean & Gallery-Grade) */}
                <div className="h-[320px] sm:h-[360px] rounded-2xl overflow-hidden shadow-inner bg-gradient-to-b from-[#080B0A] to-[#040605] border border-white/10 relative group/stage">
                  <FurnitureViewer3D
                    modelType={currentPiece.id}
                    selectedWood={selectedWood}
                    selectedFabric={selectedFabric}
                    exploded={isExploded}
                    onToggleExploded={() => setIsExploded(!isExploded)}
                    lightingMood={lightingMood}
                    showDimensions={showDimensions}
                    onToggleDimensions={() => setShowDimensions(!showDimensions)}
                    interactive={true}
                  />

                  {/* Top Left Floating 360° Drag Badge */}
                  <div className="absolute top-3 left-3 pointer-events-none bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 text-[10px] sm:text-[11px] text-zinc-200 shadow-md">
                    <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="font-medium">Drag 360°</span>
                  </div>

                  {/* Top Right Floating Stage Controls Capsule */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/65 backdrop-blur-md p-1 rounded-full border border-white/15 shadow-lg z-10">
                    <button
                      onClick={() => setIsExploded(!isExploded)}
                      title="Explode Joinery"
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                        isExploded
                          ? 'bg-amber-500 text-black shadow-sm font-extrabold'
                          : 'text-zinc-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span className="text-[9px] uppercase tracking-wider">Joinery</span>
                    </button>

                    <button
                      onClick={toggleLighting}
                      title="Toggle Lighting Mood"
                      className="p-1.5 rounded-full text-zinc-300 hover:text-amber-400 hover:bg-white/10 transition-all"
                    >
                      {lightingMood === 'warm-studio' ? (
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                      ) : lightingMood === 'daylight' ? (
                        <Sun className="w-3.5 h-3.5 text-sky-300" />
                      ) : (
                        <Moon className="w-3.5 h-3.5 text-indigo-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. Refined Material Swatches Dock (Clean & Unobtrusive) */}
                <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-2xl bg-black/45 backdrop-blur-md border border-white/10 text-xs">
                  {/* Timber Finishes */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Timber:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {WOOD_SWATCHES.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => setSelectedWood(w.id)}
                          title={w.name}
                          className={`w-6 h-6 rounded-full border transition-all ${
                            selectedWood === w.id
                              ? 'border-amber-400 ring-2 ring-amber-400/50 scale-110 shadow-sm'
                              : 'border-white/30 hover:scale-105 opacity-75 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: w.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="w-[1px] h-5 bg-white/15" />

                  {/* Fabric Upholstery */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Fabric:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {FABRIC_SWATCHES.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFabric(f.id)}
                          title={f.name}
                          className={`w-6 h-6 rounded-full border transition-all ${
                            selectedFabric === f.id
                              ? 'border-amber-400 ring-2 ring-amber-400/50 scale-110 shadow-sm'
                              : 'border-white/30 hover:scale-105 opacity-75 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: f.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Signature Model Switcher Ribbon */}
                <div className="grid grid-cols-5 gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/10">
                  {HERO_SIGNATURE_PIECES.map((piece, idx) => {
                    const Icon = piece.icon;
                    const isActive = selectedPieceIndex === idx;
                    return (
                      <button
                        key={piece.id}
                        onClick={() => handleSelectPiece(idx)}
                        className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center gap-1 transition-all ${
                          isActive
                            ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/25 scale-[1.02]'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                        <span className="text-[9px] sm:text-[10px] font-semibold leading-tight truncate max-w-full">
                          {piece.title.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 5. Attractive Primary Call-to-Action */}
                <button
                  onClick={onExploreStudio}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 active:scale-[0.99] group/btn"
                >
                  <Sparkles className="w-4 h-4 text-black group-hover/btn:rotate-12 transition-transform" />
                  <span>Open 3D Bespoke Studio</span>
                  <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {/* 6. Minimal Reassurance Footer */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400">
                  <span>100% Chittagong Teak</span>
                  <span className="text-zinc-600">•</span>
                  <span>10-Yr Guarantee</span>
                  <span className="text-zinc-600">•</span>
                  <button
                    onClick={onOpenConsultation}
                    className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 transition-colors"
                  >
                    Bespoke Consultation
                  </button>
                </div>
              </motion.div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};


