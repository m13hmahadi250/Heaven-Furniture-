import React from 'react';
import { BRAND_INFO } from '../data/furnitureData';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ArrowUp,
  Award,
  ShieldCheck,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

interface FooterProps {
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsultation }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] text-[#F5F5F5] border-t border-white/10 pt-16 pb-12 relative overflow-hidden" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.2)] border border-amber-500/30 flex items-center justify-center bg-[#0E1B18] flex-shrink-0 group">
                <img
                  src="/favicon.svg"
                  alt="Heaven Furniture Mart Crest Logo"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight uppercase text-white font-heading-bold">
                  Heaven Furniture Mart
                </div>
                <span className="text-[10px] tracking-widest text-amber-500 uppercase font-bold">
                  Bespoke Architectural Living
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Chattogram's premier bespoke furniture studio. Handcrafted from seasoned Chittagong Teak, tailored to your exact floorplan, and customized to heirloom perfection.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={BRAND_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#121212] border border-white/10 hover:border-amber-500 text-gray-300 hover:text-amber-400 flex items-center justify-center transition-all"
                title="Follow on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={BRAND_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#121212] border border-white/10 hover:border-amber-500 text-gray-300 hover:text-amber-400 flex items-center justify-center transition-all"
                title="Follow on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={BRAND_INFO.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#121212] border border-white/10 hover:border-amber-500 text-gray-300 hover:text-amber-400 flex items-center justify-center transition-all"
                title="Watch on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading-bold">
              Studio Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <a href="#bespoke-3d-studio" className="hover:text-amber-400 transition-colors">
                  3D Custom Studio
                </a>
              </li>
              <li>
                <a href="#collections" className="hover:text-amber-400 transition-colors">
                  Curated Collections
                </a>
              </li>
              <li>
                <a href="#bespoke-highlight" className="hover:text-amber-400 transition-colors">
                  Bespoke Craftsmanship
                </a>
              </li>
              <li>
                <a href="#ai-stylist" className="hover:text-amber-400 transition-colors">
                  AI Space Stylist
                </a>
              </li>
              <li>
                <a href="#showroom-experience" className="hover:text-amber-400 transition-colors">
                  Agrabad Showroom
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details from Brief */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading-bold">
              Showroom & Contact
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{BRAND_INFO.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href={`tel:${BRAND_INFO.phoneRaw}`} className="hover:text-amber-400 text-gray-300 font-bold">
                  {BRAND_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-amber-400 text-gray-300">
                  {BRAND_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Sat – Thu: 10AM – 9PM | Fri: 3PM – 9PM</span>
              </li>
            </ul>
          </div>

          {/* Accreditations & CTA */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading-bold">
              Accreditations
            </h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="p-3 bg-[#121212] rounded-2xl border border-white/10 flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>BFIOA Nationwide Recognition (2026)</span>
              </div>
              <div className="p-3 bg-[#121212] rounded-2xl border border-white/10 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Chamber of Commerce Member (2025)</span>
              </div>
            </div>

            <button
              onClick={onOpenConsultation}
              className="w-full py-3.5 bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-xl"
            >
              Request Free Consultation
            </button>
          </div>

        </div>

        {/* Sub-footer Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} Heaven Furniture Mart. Founded by Abul Kalam Bhuiyan (2020). All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-gray-400 hover:text-amber-400 transition-colors uppercase font-bold text-[11px] tracking-wider"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
