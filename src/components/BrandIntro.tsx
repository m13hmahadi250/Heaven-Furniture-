import React from 'react';
import { BRAND_INFO } from '../data/furnitureData';
import { Sparkles, Compass, ShieldCheck, Hammer } from 'lucide-react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const BrandIntro: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 text-[#F5F5F5] relative overflow-hidden border-b border-white/10" id="section-craftsmanship">
      
      {/* Background Watermark Text */}
      <div className="absolute top-10 left-10 select-none pointer-events-none text-[120px] lg:text-[180px] font-black uppercase text-white/[0.015] tracking-tighter leading-none whitespace-nowrap z-0">
        ARCHITECTURAL
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Top Eyebrow */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center max-w-3xl mx-auto space-y-5"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3">
            <span className="w-10 h-[1px] bg-amber-500"></span>
            <span className="text-amber-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
              The Studio Philosophy
            </span>
            <span className="w-10 h-[1px] bg-amber-500"></span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] text-white font-heading-bold">
            Not an online shop. <br className="hidden sm:inline" />
            <span className="text-transparent text-stroke-white">A Luxury Bespoke</span> <br />
            <span className="text-amber-500">Interior Studio.</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-base sm:text-lg text-gray-300 font-light leading-relaxed pt-2">
            Heaven Furniture Mart is one of Chattogram's leading bespoke furniture brands. We design and craft custom furniture — sofas, beds, dining suites, executive office pieces — built around what you actually desire, never pulled off a factory shelf.
          </motion.p>
        </motion.div>

        {/* 3 Core Pillars: Designed. Crafted. Customized. */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16"
        >
          
          {/* 1. Designed */}
          <motion.div
            variants={cardVariants}
            className="bg-[#121212]/85 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-amber-500/50 transition-all group space-y-4 relative overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-white/10 text-amber-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-2xl font-black text-white/20">01</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight uppercase text-white font-heading-bold">
              Designed<span className="text-amber-500">.</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Every creation starts with architectural 3D spatial mapping. We measure your ceiling heights, doorway clearances, and natural sunlight to design harmonious proportions.
            </p>
            <div className="pt-2 text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-amber-500"></span>
              <span>Tailored Spatial Flow</span>
            </div>
          </motion.div>

          {/* 2. Crafted */}
          <motion.div
            variants={cardVariants}
            className="bg-[#121212]/85 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-amber-500/50 transition-all group space-y-4 relative overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-white/10 text-amber-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <Hammer className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-2xl font-black text-white/20">02</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight uppercase text-white font-heading-bold">
              Crafted<span className="text-amber-500">.</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hand-built by master woodworkers in our Chattogram workshops using 60-day seasoned Chittagong Teak and hereditary mortise-and-tenon structural joints.
            </p>
            <div className="pt-2 text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-amber-500"></span>
              <span>Heirloom Longevity</span>
            </div>
          </motion.div>

          {/* 3. Customized */}
          <motion.div
            variants={cardVariants}
            className="bg-[#121212]/85 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-amber-500/50 transition-all group space-y-4 relative overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-white/10 text-amber-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-2xl font-black text-white/20">03</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight uppercase text-white font-heading-bold">
              Customized<span className="text-amber-500">.</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              You choose the exact timber grain, Italian velvet or leather upholstery, custom wood stains, and brass trims. Truly bespoke to your lifestyle and taste.
            </p>
            <div className="pt-2 text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-amber-500"></span>
              <span>Zero Compromise</span>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};
