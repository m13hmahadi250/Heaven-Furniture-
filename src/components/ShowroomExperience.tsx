import React from 'react';
import { BRAND_INFO } from '../data/furnitureData';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Car,
  Layers,
  Sparkles,
  ArrowUpRight,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface ShowroomExperienceProps {
  onOpenConsultation: () => void;
}

export const ShowroomExperience: React.FC<ShowroomExperienceProps> = ({ onOpenConsultation }) => {
  return (
    <section className="py-20 lg:py-28 text-[#F5F5F5] border-b border-white/10 relative overflow-hidden" id="section-showroom">
      
      {/* Background Watermark Text */}
      <div className="absolute top-10 left-6 select-none pointer-events-none text-[140px] lg:text-[200px] font-black uppercase text-white/[0.015] tracking-tighter leading-none whitespace-nowrap z-0">
        SHOWROOM
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-3">
            <span className="w-10 h-[1px] bg-amber-500"></span>
            <span className="text-amber-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
              Flagship Experience Studio
            </span>
            <span className="w-10 h-[1px] bg-amber-500"></span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] text-white font-heading-bold">
            Visit Our Agrabad Studio. <br />
            <span className="text-wood-texture">Feel the Seasoned</span> <br />
            <span className="text-amber-500">Timber in Person.</span>
          </h2>
          
          <p className="text-base text-gray-300 font-light leading-relaxed">
            Step into 6,000 square feet of curated luxury interiors on Agrabad Access Road. Touch raw and polished teak grains, test sofa cushion densities, and meet our principal designers over coffee.
          </p>
        </motion.div>

        {/* Showroom Cards & Map Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Studio Amenities & Visiting Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-[#121212] text-[#F5F5F5] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white font-heading-bold">
                    Heaven Flagship Studio
                  </h3>
                  <p className="text-xs text-amber-500 flex items-center gap-1.5 mt-1 font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    {BRAND_INFO.location}
                  </p>
                </div>

                <div className="px-3.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                  Open Today
                </div>
              </div>

              {/* Showroom Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BRAND_INFO.showroomFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-[#181818] p-4 rounded-2xl border border-white/5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Practical details */}
              <div className="space-y-3 pt-2 text-xs text-gray-300">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{BRAND_INFO.openingHours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-amber-500" />
                  <a href={`tel:${BRAND_INFO.phoneRaw}`} className="hover:text-amber-400 text-gray-200 font-bold">
                    {BRAND_INFO.phone} (Direct Design Line)
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-amber-400 text-gray-200">
                    {BRAND_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Directions Action */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
              <a
                href={BRAND_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl"
              >
                <span>Get Google Maps Directions</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-[#181818] text-emerald-400 border border-white/10 hover:border-emerald-500 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Showroom</span>
              </a>
            </div>

          </motion.div>

          {/* Right: Studio Imagery / Architectural Experience */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-5 flex flex-col justify-between gap-4"
          >
            <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0A0A0A]">
              <img
                src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80"
                alt="Heaven Furniture Mart Showroom Interior & Vitrine Showcase"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">
                    Agrabad Showroom Display
                  </span>
                  <div className="text-lg font-bold uppercase tracking-tight text-white font-heading-bold">
                    Private Client Consultation & Showcase
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] p-6 rounded-3xl border border-white/10 flex items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <h4 className="text-base font-bold uppercase tracking-tight text-white font-heading-bold">
                  Prefer an In-Home Visit?
                </h4>
                <p className="text-xs text-gray-400">
                  Our master artisan will bring timber swatches and take laser measurements at your home.
                </p>
              </div>

              <button
                onClick={onOpenConsultation}
                className="px-5 py-3 bg-white text-black hover:bg-amber-500 hover:text-black text-xs font-bold uppercase tracking-widest rounded-full whitespace-nowrap transition-all"
              >
                Book Home Visit
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
