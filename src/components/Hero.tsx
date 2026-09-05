import React from 'react';
import { BRAND_INFO } from '../data/furnitureData';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Bed,
  Armchair,
  Layers,
  Box,
  Crown
} from 'lucide-react';
import { motion } from 'motion/react';
import { CraftedAnimatedText } from './CraftedAnimatedText';

interface HeroProps {
  onOpenConsultation: () => void;
  onExploreStudio: () => void;
  activeModelIndex?: number;
  onSelectModel?: (index: number) => void;
}

const HEAVEN_SIGNATURE_MODELS = [
  {
    id: 'emerald-bed',
    title: 'Minimalist Bed Set',
    sub: 'Emerald Velvet & Walnut',
    icon: Bed,
  },
  {
    id: 'embroidery-sofa',
    title: 'Embroidered Sofa Set',
    sub: 'Silver-Grey Floral Rococo',
    icon: Armchair,
  },
  {
    id: 'luxury-showcase',
    title: 'Luxury Showcase',
    sub: 'Grand Arched Vitrine',
    icon: Layers,
  },
  {
    id: 'minimal-shoebox',
    title: 'Minimal Shoe Box',
    sub: 'Matte Black & Gold Console',
    icon: Box,
  },
  {
    id: 'royal-sapphire-sofa',
    title: 'Royal Sapphire Sofa',
    sub: '24K Gold Damask Suite',
    icon: Crown,
  },
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
  return (
    <section
      id="section-hero"
      className="relative text-[#F5F5F5] overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24 border-b border-white/10 min-h-[90vh] flex items-center"
    >
      {/* 1. Authentic Luxury Architectural Salon Background Photo Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
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
            'radial-gradient(ellipse at 72% 38%, rgba(245, 158, 11, 0.16) 0%, rgba(18, 34, 29, 0.45) 45%, rgba(4, 9, 8, 0.88) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040807]/92 via-[#040807]/65 to-[#040807]/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#040807]/60 via-transparent to-[#040807]/85 pointer-events-none" />

      {/* Dynamic luxury ambient spotlight glows */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-amber-500/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-950/30 rounded-full blur-[140px] pointer-events-none" />

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

              {/* Right Column: Interactive 3D Model Explorer, Pillars & Guarantees */}
              <div className="lg:col-span-5 xl:col-span-5 space-y-6 bg-white/[0.03] border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-sm">
                
                {/* Signature 5-Piece Interactive Model Selector */}
                <motion.div variants={itemVariants} className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="uppercase tracking-wider font-semibold text-amber-400/90 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Signature 3D Pieces:
                    </span>
                    <span className="text-[11px] text-gray-400 font-light">
                      Click to inspect
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {HEAVEN_SIGNATURE_MODELS.map((model, idx) => {
                      const Icon = model.icon;
                      const isActive = activeModelIndex === idx;
                      return (
                        <button
                          key={model.id}
                          onClick={() => onSelectModel && onSelectModel(idx)}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                            isActive
                              ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-lg shadow-amber-500/25 scale-[1.03]'
                              : 'bg-black/60 text-gray-300 border-white/15 hover:border-amber-500/50 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                          <span>{model.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* The "Designed. Crafted. Customized." Pillars */}
                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block">01 / Designed</span>
                    <p className="text-xs text-gray-400 font-light">To your floorplan</p>
                  </div>
                  <div className="space-y-1 border-l border-white/10 pl-3">
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block">02 / Crafted</span>
                    <p className="text-xs text-gray-400 font-light">Chittagong Teak</p>
                  </div>
                  <div className="space-y-1 border-l border-white/10 pl-3">
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block">03 / Custom</span>
                    <p className="text-xs text-gray-400 font-light">100% bespoke</p>
                  </div>
                </motion.div>

                {/* Trust Points Mini Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2.5 pt-3 text-xs text-gray-400 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>In-Home Laser Mapping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>White-Glove BD Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>Agrabad Studio Experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>10-Yr Timber Guarantee</span>
                  </div>
                </motion.div>

              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};


