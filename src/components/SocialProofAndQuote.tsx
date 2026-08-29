import React from 'react';
import { MD_QUOTE, MILESTONES, REVIEWS, BRAND_INFO } from '../data/furnitureData';
import { Quote, Sparkles, Award, Star, CheckCircle, ArrowRight } from 'lucide-react';

interface SocialProofAndQuoteProps {
  onOpenConsultation: () => void;
}

export const SocialProofAndQuote: React.FC<SocialProofAndQuoteProps> = ({ onOpenConsultation }) => {
  return (
    <section className="py-20 lg:py-28 bg-[#0A0A0A] text-[#F5F5F5] border-b border-white/10 relative overflow-hidden" id="milestones-timeline">
      
      {/* Background Watermark Text */}
      <div className="absolute top-12 right-6 select-none pointer-events-none text-[140px] lg:text-[200px] font-black uppercase text-white/[0.015] tracking-tighter leading-none whitespace-nowrap z-0">
        LEGACY
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        
        {/* 1. Managing Director Spotlight Card with Exact Quote from Brief */}
        <div className="bg-[#121212] text-[#F5F5F5] rounded-3xl p-8 sm:p-12 lg:p-16 border border-white/15 shadow-2xl relative overflow-hidden">
          {/* Subtle amber glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left: MD Quote Icon & Monogram */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#1A1A1A] border border-amber-500/40 p-1 shadow-xl flex items-center justify-center">
                <div className="w-full h-full bg-[#0A0A0A] rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl text-amber-500 font-heading-bold">
                  AKB
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white font-heading-bold">
                  {MD_QUOTE.author}
                </h3>
                <p className="text-xs text-amber-500 font-bold tracking-widest uppercase">
                  {MD_QUOTE.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Heaven Furniture Mart • Est. {BRAND_INFO.foundedYear}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-white/10 text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Artisan Director</span>
              </div>
            </div>

            {/* Right: The Core Quote */}
            <div className="lg:col-span-8 space-y-6">
              <Quote className="w-12 h-12 text-amber-500/40" />
              
              <blockquote className="text-xl sm:text-2xl lg:text-3xl text-white font-light leading-relaxed italic">
                "{MD_QUOTE.quote}"
              </blockquote>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
                <span>Flagship Studio: Agrabad Access Road, Chattogram</span>
                <span className="text-amber-500 font-bold uppercase tracking-wider text-[11px]">BFIOA & Chamber of Commerce Member</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Brand Milestones Timeline (2020 - 2026) */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-3">
              <span className="w-10 h-[1px] bg-amber-500"></span>
              <span className="text-amber-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
                Our Journey of Distinction
              </span>
              <span className="w-10 h-[1px] bg-amber-500"></span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading-bold">
              Milestones of Excellence
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              From our founding in 2020 to nationwide recognition in 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
            {MILESTONES.map((m, idx) => (
              <div
                key={idx}
                className="bg-[#121212] p-6 rounded-3xl border border-white/10 hover:border-amber-500/50 transition-all space-y-3 flex flex-col justify-between shadow-xl group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-amber-500 font-heading-bold">
                      {m.year}
                    </span>
                    {m.tag && (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-amber-400 border border-white/10">
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-tight text-white leading-snug font-heading-bold">
                    {m.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                  Verified Milestone
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Verified Homeowner Testimonials in Chattogram */}
        <div className="space-y-8 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading-bold">
              Trusted by 500+ Luxury Homeowners
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Stories from residences in Nasirabad, Khulshi, Agrabad, and Dhaka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="bg-[#121212] p-6 rounded-3xl border border-white/10 hover:border-amber-500/40 transition-all space-y-4 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(r.rating)].map((_, starIdx) => (
                      <Star key={starIdx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    "{r.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="text-sm font-bold uppercase text-white font-heading-bold">
                    {r.name}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {r.location}
                  </div>
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                    {r.project}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
