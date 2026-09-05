import React, { useState } from 'react';
import { Sparkles, Bot, ArrowRight, CheckCircle2, Trees, RefreshCw, Send, Calendar } from 'lucide-react';
import { BRAND_INFO } from '../data/furnitureData';
import { getCachedApiResponse, setCachedApiResponse } from '../utils/assetCache';

interface AiConsultantSectionProps {
  onOpenConsultation: (initialData?: any) => void;
}

export const AiConsultantSection: React.FC<AiConsultantSectionProps> = ({ onOpenConsultation }) => {
  const [roomType, setRoomType] = useState('Living Room');
  const [dimensions, setDimensions] = useState('18 ft × 14 ft');
  const [stylePreference, setStylePreference] = useState('Warm Editorial Luxury');
  const [woodChoice, setWoodChoice] = useState('Chittagong Teak (Segun)');
  const [budgetRange, setBudgetRange] = useState('Premium Bespoke');
  const [specialNeeds, setSpecialNeeds] = useState('Coastal humidity resistance & pet-friendly fabrics');

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cacheKey = `ai_proposal_${roomType}_${dimensions}_${stylePreference}_${woodChoice}_${budgetRange}_${specialNeeds}`
      .toLowerCase()
      .replace(/\s+/g, '_');

    // Instant retrieval from client cache if available (0ms response)
    const cached = getCachedApiResponse<any>(cacheKey);
    if (cached) {
      setRecommendation(cached);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/ai-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType,
          dimensions,
          stylePreference,
          woodChoice,
          budgetRange,
          specialNeeds,
        }),
      });
      const data = await response.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
        setCachedApiResponse(cacheKey, data.recommendation);
      }
    } catch (err) {
      console.error('AI Consultant fetch failed:', err);
      // Fallback
      setRecommendation({
        conceptName: `The ${woodChoice.split(' ')[0]} Architectural ${roomType} Enclave`,
        designPhilosophy: `Engineered specifically for your ${dimensions} space with an emphasis on natural airflow and balanced negative space. Handcrafted from seasoned timber with zero warping guarantee.`,
        timberSpecification: `${woodChoice} cured for 60 days in our kiln facilities, sealed with hand-rubbed organic Danish oils.`,
        recommendedLayout: [
          'Floating focal sofa oriented towards primary window lighting',
          'Concealed cable routes and recessed plinth shadow gaps',
          'Ergonomic 105-degree backrest pitch for luxurious relaxation'
        ],
        estimatedPriceRangeBDT: '৳ 1,20,000 – ৳ 2,40,000',
        craftingTimeDays: '20 business days',
        nextStep: 'Bring this design proposal to our Agrabad Access Road showroom or book home measurement.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookWithAiProposal = () => {
    if (!recommendation) return;
    onOpenConsultation({
      roomType,
      selectedWood: woodChoice,
      customDimensions: dimensions,
      budget: recommendation.estimatedPriceRangeBDT,
      notes: `AI Proposal: ${recommendation.conceptName} | ${recommendation.designPhilosophy}`
    });
  };

  return (
    <section className="py-20 lg:py-28 bg-[#0A0A0A] text-[#F5F5F5] relative border-b border-white/10 overflow-hidden" id="ai-stylist">
      
      {/* Background Watermark Text */}
      <div className="absolute top-10 right-6 select-none pointer-events-none text-[140px] lg:text-[200px] font-black uppercase text-white/[0.015] tracking-tighter leading-none whitespace-nowrap z-0">
        AI STYLIST
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-3">
            <span className="w-10 h-[1px] bg-amber-500"></span>
            <span className="text-amber-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
              AI Interior Architecture Stylist
            </span>
            <span className="w-10 h-[1px] bg-amber-500"></span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] text-white font-heading-bold">
            Generate an Instant <br />
            <span className="text-wood-texture">Bespoke Room</span> <br />
            <span className="text-amber-500">Blueprint & Quote.</span>
          </h2>
          
          <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
            Specify your room dimensions, preferred Chittagong timber species, and design aesthetic. Our AI design engine synthesizes Heaven’s artisan joinery standards to generate tailored room recommendations in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Form */}
          <div className="lg:col-span-6 bg-[#121212] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <form onSubmit={handleGenerateProposal} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Room Type */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold uppercase tracking-widest block text-[11px]">
                    Room / Space Type
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl px-3 py-3 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Living Room">Living Room & Lounge</option>
                    <option value="Master Bedroom Suite">Master Bedroom Suite</option>
                    <option value="Formal Dining Enclave">Formal Dining Enclave</option>
                    <option value="Executive Study & Office">Executive Study & Office</option>
                    <option value="Full Duplex / Penthouse">Full Duplex / Penthouse</option>
                  </select>
                </div>

                {/* Dimensions */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold uppercase tracking-widest block text-[11px]">
                    Floorplan Dimensions
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 20ft × 16ft or 350 sq ft"
                    className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl px-3 py-3 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Wood Timber */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold uppercase tracking-widest block text-[11px]">
                    Timber Preference
                  </label>
                  <select
                    value={woodChoice}
                    onChange={(e) => setWoodChoice(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl px-3 py-3 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Chittagong Teak (Segun)">Chittagong Teak (Segun)</option>
                    <option value="Burma Royal Teak">Burma Royal Teak</option>
                    <option value="Smoked American Walnut">Smoked American Walnut</option>
                    <option value="Royal Red Mahogany">Royal Red Mahogany</option>
                    <option value="Nordic White Oak">Nordic White Oak</option>
                  </select>
                </div>

                {/* Style Preference */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold uppercase tracking-widest block text-[11px]">
                    Design Vibe
                  </label>
                  <select
                    value={stylePreference}
                    onChange={(e) => setStylePreference(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl px-3 py-3 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Warm Editorial Luxury">Warm Editorial Luxury</option>
                    <option value="Minimalist Japandi Teak">Minimalist Japandi Teak</option>
                    <option value="Mid-Century Modern Organic">Mid-Century Modern Organic</option>
                    <option value="Classical Heritage Grandeur">Classical Heritage Grandeur</option>
                  </select>
                </div>
              </div>

              {/* Special requirements */}
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold uppercase tracking-widest block text-[11px]">
                  Lifestyle & Special Considerations
                </label>
                <input
                  type="text"
                  value={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.value)}
                  placeholder="e.g. Hidden wiring, high humidity, pet-friendly bouclé"
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl px-3 py-3 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-xl flex items-center justify-center gap-2 mt-4 group"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Synthesizing Artisan Specs with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Bespoke Concept & Investment Estimate</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: AI Output Proposal Card */}
          <div className="lg:col-span-6 space-y-4">
            {recommendation ? (
              <div className="bg-[#121212] rounded-3xl p-6 sm:p-8 border border-amber-500 shadow-2xl space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">
                      Custom AI Blueprint
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-heading-bold">
                      {recommendation.conceptName}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
                    {recommendation.craftingTimeDays}
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold uppercase tracking-widest block mb-1">
                      Architectural Philosophy:
                    </span>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {recommendation.designPhilosophy}
                    </p>
                  </div>

                  <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Trees className="w-3.5 h-3.5" />
                      Timber & Finish Specification:
                    </span>
                    <p className="text-gray-300">
                      {recommendation.timberSpecification}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-400 font-bold uppercase tracking-widest block mb-1.5">
                      Recommended Layout Elements:
                    </span>
                    <ul className="space-y-2">
                      {recommendation.recommendedLayout?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Estimated Budget</span>
                      <div className="text-2xl font-black text-amber-400 font-heading-bold">
                        {recommendation.estimatedPriceRangeBDT}
                      </div>
                    </div>

                    <button
                      onClick={handleBookWithAiProposal}
                      className="px-6 py-3.5 bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest rounded-full flex items-center gap-2 transition-all shadow-xl"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Consultation</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#121212] rounded-3xl p-8 border border-white/10 text-center space-y-4 flex flex-col items-center justify-center min-h-[350px] shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] text-amber-500 flex items-center justify-center border border-white/10">
                  <Bot className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="text-lg font-bold uppercase tracking-tight text-white font-heading-bold">
                    Awaiting Your Room Specifications
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    Fill in the details on the left and click generate to receive an instant bespoke timber proposal and pricing estimate tailored for Chattogram residences.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
