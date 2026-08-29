/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandIntro } from './components/BrandIntro';
import { BespokeStudio3D } from './components/BespokeStudio3D';
import { CollectionsSnapshot } from './components/CollectionsSnapshot';
import { BespokeHighlight } from './components/BespokeHighlight';
import { AiConsultantSection } from './components/AiConsultantSection';
import { WhyChooseHeaven } from './components/WhyChooseHeaven';
import { SocialProofAndQuote } from './components/SocialProofAndQuote';
import { ShowroomExperience } from './components/ShowroomExperience';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { ScrollDrivenCinematicCanvas, onLenisScrollUpdate } from './components/ThreeCanvas/ScrollDrivenCinematicCanvas';
import { RevealOnScroll } from './components/RevealOnScroll';
import { CollectionItem } from './types';
import { MessageCircle, Calendar, Sparkles } from 'lucide-react';
import { BRAND_INFO } from './data/furnitureData';

export default function App() {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<any>({});

  // 120Hz Butter-Smooth Momentum Scrolling Engine (Zero Input Lag)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.65,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.0,
    });

    lenis.on('scroll', (e: any) => {
      if (typeof e?.progress === 'number') {
        onLenisScrollUpdate(e.progress);
      }
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleOpenConsultation = (initialData: any = {}) => {
    setModalInitialData(initialData);
    setIsConsultationModalOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultationModalOpen(false);
  };

  const handleScrollToStudio = () => {
    const el = document.getElementById('section-studio') || document.getElementById('bespoke-3d-studio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCustomizeIn3D = (item: CollectionItem) => {
    handleScrollToStudio();
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#F5F5F5] font-sans antialiased selection:bg-[#F59E0B]/30 selection:text-white relative overflow-x-hidden">
      
      {/* Fixed Scroll-Driven 3D Background WebGL Canvas */}
      <ScrollDrivenCinematicCanvas />
      
      {/* Top Luxury Navigation */}
      <Navbar
        onOpenConsultation={() => handleOpenConsultation()}
        onNavigateToStudio={handleScrollToStudio}
      />

      {/* Main Content Flow */}
      <main className="flex-grow relative z-10">
        
        {/* 1. Hero Section with Live 3D Experience */}
        <Hero
          onOpenConsultation={() => handleOpenConsultation()}
          onExploreStudio={handleScrollToStudio}
        />

        {/* 2. Brand Introduction ("Designed. Crafted. Customized.") */}
        <RevealOnScroll threshold={0.08} rootMargin="0px 0px -40px 0px">
          <BrandIntro />
        </RevealOnScroll>

        {/* 3. Interactive 3D Bespoke Studio Configurator */}
        <RevealOnScroll threshold={0.06} rootMargin="0px 0px -40px 0px">
          <BespokeStudio3D
            onOpenConsultation={handleOpenConsultation}
          />
        </RevealOnScroll>

        {/* 4. Curated Collections Snapshot */}
        <RevealOnScroll threshold={0.06} rootMargin="0px 0px -40px 0px">
          <CollectionsSnapshot
            onOpenConsultation={handleOpenConsultation}
            onCustomizeIn3D={handleCustomizeIn3D}
          />
        </RevealOnScroll>

        {/* 5. The Bespoke Highlight (#1 Differentiator) */}
        <RevealOnScroll threshold={0.08} rootMargin="0px 0px -40px 0px">
          <BespokeHighlight
            onOpenConsultation={() => handleOpenConsultation()}
          />
        </RevealOnScroll>

        {/* 6. AI Interior Architecture & Timber Stylist (Gemini-powered) */}
        <RevealOnScroll threshold={0.08} rootMargin="0px 0px -40px 0px">
          <AiConsultantSection
            onOpenConsultation={handleOpenConsultation}
          />
        </RevealOnScroll>

        {/* 7. Why Choose Heaven (7 Core Trust Points) */}
        <RevealOnScroll threshold={0.08} rootMargin="0px 0px -40px 0px">
          <WhyChooseHeaven
            onOpenConsultation={() => handleOpenConsultation()}
          />
        </RevealOnScroll>

        {/* 8. Social Proof: MD Quote, Milestones Timeline & Testimonials */}
        <RevealOnScroll threshold={0.08} rootMargin="0px 0px -40px 0px">
          <SocialProofAndQuote
            onOpenConsultation={() => handleOpenConsultation()}
          />
        </RevealOnScroll>

        {/* 9. Agrabad Showroom Flagship Experience & Location */}
        <RevealOnScroll threshold={0.08} rootMargin="0px 0px -40px 0px">
          <ShowroomExperience
            onOpenConsultation={() => handleOpenConsultation()}
          />
        </RevealOnScroll>

      </main>

      {/* Luxury Editorial Footer */}
      <RevealOnScroll threshold={0.05} rootMargin="0px 0px -20px 0px">
        <Footer
          onOpenConsultation={() => handleOpenConsultation()}
        />
      </RevealOnScroll>

      {/* Sticky Bottom Floating Quick Actions on Mobile/Desktop */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <a
          href={BRAND_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#1A1A1A] hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 border border-white/20"
          title="Direct WhatsApp Chat with Master Craftsman"
        >
          <MessageCircle className="w-5 h-5 text-emerald-400 hover:text-white" />
        </a>

        <button
          onClick={() => handleOpenConsultation()}
          className="hidden sm:flex items-center gap-2 px-5 py-3 bg-white text-black hover:bg-amber-500 hover:text-black rounded-full shadow-2xl transition-all hover:scale-105 text-xs font-bold uppercase tracking-widest border border-white/20"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Consultation</span>
        </button>
      </div>

      {/* Free Design Consultation & Quote Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={handleCloseConsultation}
        initialData={modalInitialData}
      />

    </div>
  );
}
