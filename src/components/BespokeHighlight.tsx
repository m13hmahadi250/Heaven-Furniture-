import React from 'react';
import { Sparkles, CheckCircle2, XCircle, Compass, Trees, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BespokeHighlightProps {
  onOpenConsultation: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const BespokeHighlight: React.FC<BespokeHighlightProps> = ({ onOpenConsultation }) => {
  const steps = [
    {
      number: "01",
      title: "Spatial Measurement & 3D Planning",
      desc: "Our design architects visit your residence in Chattogram/Dhaka to take laser floor measurements, evaluate light entry, and draft bespoke 3D CAD renders.",
      icon: Compass
    },
    {
      number: "02",
      title: "Wood Grain & Upholstery Selection",
      desc: "Touch seasoned Chittagong Teak logs, Burma Segun planks, Italian velvet, and full-grain saddle leathers in our Agrabad design lounge.",
      icon: Trees
    },
    {
      number: "03",
      title: "Hereditary Master Joinery",
      desc: "Our master artisans carve interlocking mortise-and-tenon joints with zero synthetic adhesives, applying 7 stages of hand-rubbed organic protective oils.",
      icon: ShieldCheck
    },
    {
      number: "04",
      title: "White-Glove Installation & Warranty",
      desc: "Delivered in climate-protective crates, positioned in your room, leveled, buffed, and backed with our signature 10-year structural warranty.",
      icon: Truck
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#0A0A0A] text-[#F5F5F5] relative overflow-hidden border-b border-white/10" id="bespoke-highlight">
      {/* Background Watermark Text */}
      <div className="absolute top-10 right-4 select-none pointer-events-none text-[140px] lg:text-[200px] font-black uppercase text-white/[0.015] tracking-tighter leading-none whitespace-nowrap z-0">
        BESPOKE
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3">
            <span className="w-10 h-[1px] bg-amber-500"></span>
            <span className="text-amber-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
              The Bespoke Benchmark
            </span>
            <span className="w-10 h-[1px] bg-amber-500"></span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] text-white font-heading-bold">
            Built for Your <br />
            <span className="text-transparent text-stroke-white">Exact Dimensions</span> <br />
            <span className="text-amber-500">& Architecture.</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-gray-300 text-base sm:text-lg font-light leading-relaxed">
            Most furniture stores sell factory inventory designed for mass warehouses. At Heaven Furniture Mart, no two residences share the same dimensions. We handcraft each piece to your exact floorplan, posture, and lifestyle.
          </motion.p>
        </motion.div>

        {/* The 4-Step Bespoke Journey */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-[#121212] p-7 rounded-3xl border border-white/10 hover:border-amber-500/50 transition-all space-y-4 group relative shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] text-amber-400 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="text-2xl font-black text-white/20 group-hover:text-amber-500 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold uppercase tracking-tight text-white leading-snug font-heading-bold">
                  {step.title}
                </h3>

                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contrast Table: Mass-Market vs Heaven Bespoke */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 bg-[#121212] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl"
        >
          <div className="text-center mb-10 space-y-2">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight uppercase text-white font-heading-bold">
              Why Chattogram Homeowners Never Choose Factory Furniture
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              A transparent comparison between standard retail showrooms and Heaven Bespoke Studio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Generic Showroom / Factory Furniture */}
            <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-rose-900/40 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-xs tracking-wider">
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>Standard Mass-Market Retailers</span>
              </div>
              
              <ul className="space-y-3 text-xs text-gray-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Fixed warehouse sizes that block walkways or leave awkward gaps</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Unseasoned softwoods that warp or crack in Bangladesh coastal humidity</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>MDF/particle board cores held together by staple guns and glue</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>No custom fabric or wood grain choices—what you see is all you get</span>
                </li>
              </ul>
            </div>

            {/* Heaven Furniture Mart Bespoke */}
            <div className="bg-[#181818] p-6 rounded-2xl border border-amber-500/80 space-y-4 shadow-lg ring-1 ring-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs tracking-wider">
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
                <span>Heaven Furniture Mart Bespoke Studio</span>
              </div>
              
              <ul className="space-y-3 text-xs text-gray-200">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>Custom scaled to the exact inch to maximize living room circulation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>60-day kiln seasoned Chittagong & Burma Teak impervious to humidity</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>Interlocking hereditary mortise-and-tenon solid wood joinery</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>Full personalization: hand-pick timber grains, fabrics, and brass inlays</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-10 text-center">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-xl inline-flex items-center gap-2"
            >
              <span>Start Your Bespoke Commission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
