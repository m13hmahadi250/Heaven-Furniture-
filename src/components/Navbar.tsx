import React, { useState, useEffect } from 'react';
import { BRAND_INFO } from '../data/furnitureData';
import { Phone, MessageCircle, Sparkles, MapPin, Menu, X, Clock } from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
  onNavigateToStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation, onNavigateToStudio }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Notification Bar: Showroom Live Status */}
      <div className="bg-[#050505] text-[#F5F5F5] text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold text-[11px] uppercase tracking-wider text-amber-400">Agrabad Showroom Open Today</span>
            <span className="text-gray-400 text-[11px] hidden sm:inline">• 10:00 AM – 9:00 PM (Saturday – Thursday)</span>
          </div>
          <div className="flex items-center gap-4 text-gray-300 text-[11px]">
            <a
              href={`tel:${BRAND_INFO.phoneRaw}`}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-medium">{BRAND_INFO.phone}</span>
            </a>
            <span className="text-gray-700 hidden md:inline">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Agrabad Access Road, Chattogram
            </span>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <nav
        id="main-navbar"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-xl shadow-2xl py-3 border-b border-white/10 text-[#F5F5F5]'
            : 'bg-[#0A0A0A]/85 backdrop-blur-lg py-4 border-b border-white/10 text-[#F5F5F5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Bold Typographic Monogram */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="text-2xl sm:text-3xl font-black tracking-tighter uppercase flex items-center transition-all duration-300 group-hover:scale-[1.03]">
              <span className="animate-gold-shimmer">HEAVEN</span>
              <span className="text-amber-500 animate-pulse-glow ml-0.5">.</span>
            </div>
            <div className="hidden sm:block border-l border-white/20 pl-3">
              <span className="block text-[9px] uppercase tracking-[0.25em] font-bold text-amber-500">
                Bespoke Studio
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-gray-400">
                Chattogram
              </span>
            </div>
          </a>

          {/* Desktop Nav Links in Bold Minimalist Tracking */}
          <div className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-medium">
            <button
              onClick={() => {
                onNavigateToStudio();
                scrollToSection('bespoke-3d-studio');
              }}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              3D Custom
            </button>
            <button
              onClick={() => scrollToSection('collections')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Collections
            </button>
            <button
              onClick={() => scrollToSection('bespoke-highlight')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Bespoke
            </button>
            <button
              onClick={() => scrollToSection('why-heaven')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Why Heaven
            </button>
            <button
              onClick={() => scrollToSection('showroom-experience')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Showroom
            </button>
            <button
              onClick={() => scrollToSection('milestones-timeline')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Story
            </button>
          </div>

          {/* CTA Actions - Bold Pill Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={BRAND_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold bg-[#141414] text-emerald-400 border border-white/10 hover:border-emerald-500 transition-all shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold bg-white text-black hover:bg-amber-500 hover:text-black transition-all shadow-lg transform active:scale-95"
            >
              <span>Book Consult</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A0A0A] text-[#F5F5F5] border-b border-white/10 px-6 py-6 space-y-5 animate-fadeIn">
            <div className="flex flex-col space-y-4 font-bold text-xs uppercase tracking-widest">
              <button
                onClick={() => {
                  onNavigateToStudio();
                  scrollToSection('bespoke-3d-studio');
                }}
                className="flex items-center gap-2 text-amber-400 py-1 text-left"
              >
                <Sparkles className="w-4 h-4" />
                3D Interactive Custom Studio
              </button>
              <button
                onClick={() => scrollToSection('collections')}
                className="text-gray-300 hover:text-white py-1 text-left"
              >
                Curated Collections
              </button>
              <button
                onClick={() => scrollToSection('bespoke-highlight')}
                className="text-gray-300 hover:text-white py-1 text-left"
              >
                Bespoke Craftsmanship
              </button>
              <button
                onClick={() => scrollToSection('why-heaven')}
                className="text-gray-300 hover:text-white py-1 text-left"
              >
                Why Customers Choose Heaven
              </button>
              <button
                onClick={() => scrollToSection('showroom-experience')}
                className="text-gray-300 hover:text-white py-1 text-left"
              >
                Agrabad Showroom & Directions
              </button>
              <button
                onClick={() => scrollToSection('milestones-timeline')}
                className="text-gray-300 hover:text-white py-1 text-left"
              >
                Milestones (2020 – 2026)
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full py-3 bg-white text-black hover:bg-amber-500 font-bold rounded-full text-center text-xs uppercase tracking-widest shadow-md"
              >
                Request a Free Quote & Consultation
              </button>
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#181818] border border-white/15 text-emerald-400 font-bold rounded-full text-center text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Direct WhatsApp (+880 1960-481983)
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
