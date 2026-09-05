import React from 'react';
import { TRUST_POINTS } from '../data/furnitureData';
import {
  Compass,
  Scissors,
  ShieldCheck,
  Store,
  Truck,
  CreditCard,
  Users,
  Sparkles,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

interface WhyChooseHeavenProps {
  onOpenConsultation: () => void;
}

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
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const WhyChooseHeaven: React.FC<WhyChooseHeavenProps> = ({ onOpenConsultation }) => {
  const iconMap: Record<string, React.ReactNode> = {
    Compass: <Compass className="w-5 h-5" />,
    Scissors: <Scissors className="w-5 h-5" />,
    ShieldCheck: <ShieldCheck className="w-5 h-5" />,
    Store: <Store className="w-5 h-5" />,
    Truck: <Truck className="w-5 h-5" />,
    CreditCard: <CreditCard className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
  };

  return (
    <section className="py-20 lg:py-28 bg-[#0A0A0A] text-[#F5F5F5] relative border-b border-white/10 overflow-hidden" id="why-heaven">
      
      {/* Background Watermark Text */}
      <div className="absolute top-12 left-6 select-none pointer-events-none text-[140px] lg:text-[200px] font-black uppercase text-white/[0.015] tracking-tighter leading-none whitespace-nowrap z-0">
        INTEGRITY
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-3">
            <span className="w-10 h-[1px] bg-amber-500"></span>
            <span className="text-amber-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
              Trust & Proven Distinction
            </span>
            <span className="w-10 h-[1px] bg-amber-500"></span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] text-white font-heading-bold">
            Why Discerning Homeowners <br />
            <span className="text-wood-texture">Choose Heaven</span> <br />
            <span className="text-amber-500">Furniture Mart.</span>
          </h2>
          
          <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed">
            Crafting luxury furniture in Bangladesh requires unyielding material integrity and personalized customer trust. Here is our unwavering promise to you.
          </p>
        </motion.div>

        {/* 7 Trust Points Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {TRUST_POINTS.map((point, index) => {
            const isLarge = index === 0 || index === 2;
            return (
              <motion.div
                key={point.id}
                variants={itemVariants}
                className={`bg-[#121212] p-8 rounded-3xl border border-white/10 hover:border-amber-500/50 transition-all group flex flex-col justify-between space-y-4 shadow-xl ${
                  isLarge ? 'md:col-span-2 lg:col-span-1 lg:row-span-1 bg-[#141414]' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] text-amber-400 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {iconMap[point.iconName] || <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <span className="text-2xl font-black text-white/20 tracking-tight group-hover:text-amber-500 transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-tight text-white leading-snug group-hover:text-amber-400 transition-colors font-heading-bold">
                    {point.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {point.fullDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Check className="w-3.5 h-3.5 text-amber-500" />
                  <span>{point.shortDesc}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 p-8 sm:p-10 rounded-3xl bg-[#121212] text-[#F5F5F5] border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl"
        >
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-heading-bold">
              Experience the Living Timber in Person
            </h4>
            <p className="text-xs text-gray-400">
              Visit our 6,000 sq ft flagship showroom on Agrabad Access Road, Chattogram.
            </p>
          </div>

          <button
            onClick={onOpenConsultation}
            className="px-8 py-4 bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest rounded-full whitespace-nowrap transition-all shadow-xl hover:scale-105"
          >
            Book Free In-Home Consultation
          </button>
        </motion.div>

      </div>
    </section>
  );
};
