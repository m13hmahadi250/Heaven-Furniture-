import React from 'react';
import { BRAND_INFO } from '../data/furnitureData';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  MoveDown
} from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onOpenConsultation: () => void;
  onExploreStudio: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const Hero: React.FC<HeroProps> = ({ onOpenConsultation, onExploreStudio }) => {
  const handleScrollDown = () => {
    const el = document.getElementById('section-craftsmanship');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="section-hero" className="relative text-[#F5F5F5] overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-28 border-b border-white/10 min-h-[85vh] flex items-center">
      {/* Dynamic luxury ambient spotlight glows */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-950/25 rounded-full blur-[140px] pointer-events-none" />

      {/* Watermark Background Typography */}
      <div className="absolute top-1/2 -right-16 -translate-y-1/2 select-none pointer-events-none text-[160px] lg:text-[240px] font-black uppercase text-white/[0.02] tracking-tighter leading-none whitespace-nowrap z-0">
        HEIRLOOM
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Brand Hero Pitch with Staggered Entrance */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 xl:col-span-8 space-y-7 lg:space-y-8 backdrop-blur-[2px] bg-black/20 p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/10 shadow-2xl drop-shadow-xl"
          >
            
            {/* Bold Eyebrow with hairline rule & live pulse */}
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <span className="w-12 h-[1.5px] bg-amber-500"></span>
              <span className="text-amber-500 uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Luxury & Bespoke Studio • Chattogram
              </span>
            </motion.div>

            {/* Giant Bold Typography Headline */}
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.92] uppercase text-white font-heading-bold">
              Furniture, <br />
              <span className="text-transparent text-stroke-white">Crafted</span> <br />
              <span className="text-amber-500">Around You.</span>
            </motion.h1>

            {/* Concise Brand Statement from Brief */}
            <motion.p variants={itemVariants} className="text-base sm:text-lg lg:text-xl text-gray-300 font-light leading-relaxed max-w-2xl">
              Chattogram’s premier bespoke interior studio. We design and craft tailored heirloom furniture—built around your exact floorplan, using seasoned Chittagong Teak.
            </motion.p>

            {/* The "Designed. Crafted. Customized." Pillars */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-xl">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">01 / Designed</span>
                <p className="text-xs sm:text-sm text-gray-400 font-light">To your floorplan</p>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-4">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">02 / Crafted</span>
                <p className="text-xs sm:text-sm text-gray-400 font-light">Chittagong Teak</p>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-4">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">03 / Custom</span>
                <p className="text-xs sm:text-sm text-gray-400 font-light">100% bespoke</p>
              </div>
            </motion.div>

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

            {/* Trust Points Mini Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-3 text-xs text-gray-400 border-t border-white/10 max-w-2xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Free In-Home Spatial Laser Mapping</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>White-Glove Delivery Across BD</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Agrabad Showroom Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Seasoned Timber 10-Yr Guarantee</span>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Subtle Scroll & 3D Interactive Indicator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-5 xl:col-span-4 hidden lg:flex flex-col items-end justify-end h-full pt-20"
          >
            <div className="bg-[#121212]/60 backdrop-blur-md border border-white/15 p-4 rounded-2xl max-w-[260px] text-right space-y-2">
              <div className="flex items-center justify-end gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive 3D Stage</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                Move your cursor to orbit the handcrafted armchair. Scroll down to explore precision joinery & dining suites.
              </p>
              <button
                onClick={handleScrollDown}
                className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-white hover:text-amber-400 transition-colors pt-1"
              >
                <span>Scroll to Explore</span>
                <MoveDown className="w-3 h-3 animate-bounce" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
