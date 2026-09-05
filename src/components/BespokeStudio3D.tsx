import React, { useState } from 'react';
import { FurnitureViewer3D } from './ThreeCanvas/FurnitureViewer3D';
import { WOOD_OPTIONS, FABRIC_OPTIONS, BRAND_INFO } from '../data/furnitureData';
import { WoodType, FabricType } from '../types';
import {
  Sparkles,
  Layers,
  Send,
  Calendar,
  Check,
  Info,
  Sliders,
  Compass,
  ArrowRight,
  Sun,
  ShieldCheck,
  Hammer,
  Ruler
} from 'lucide-react';

interface BespokeStudio3DProps {
  onOpenConsultation: (initialData?: any) => void;
}

type ModelType = 'armchair' | 'sofa' | 'dining-table' | 'bed' | 'executive-desk';

interface ArchetypeOption {
  id: ModelType;
  title: string;
  category: string;
  basePrice: number;
  defaultDimensions: { w: number; d: number; h: number };
  description: string;
  features: string[];
}

const ARCHETYPES: ArchetypeOption[] = [
  {
    id: 'armchair',
    title: 'Heritage Teak & Damask Armchair',
    category: 'Living Room',
    basePrice: 48000,
    defaultDimensions: { w: 38, d: 36, h: 36 },
    description: 'Sculpted solid Chittagong Segun arms with hand-carved floral crests, high-density pocketed coil comfort, and gold-trimmed ferrules.',
    features: ['Solid Chittagong Segun Frame', 'Italian Brocade / Velvet', 'Hand-Carved Relief Crest']
  },
  {
    id: 'sofa',
    title: 'Royal Sapphire & Gold Damask Sofa',
    category: 'Living Room',
    basePrice: 235000,
    defaultDimensions: { w: 88, d: 38, h: 42 },
    description: 'Aristocratic 3-seater luxury sofa with 24K gold leaf accented solid teak carvings and rich royal sapphire velvet embroidery.',
    features: ['24K Burnished Gold Leaf Carvings', 'Royal Sapphire Velvet & Damask', 'Orthopedic Lumbar Support']
  },
  {
    id: 'dining-table',
    title: 'Imperial Pearl & Marble Dining Suite (8 Seater)',
    category: 'Dining',
    basePrice: 245000,
    defaultDimensions: { w: 108, d: 46, h: 31 },
    description: 'Opulent 8-seater dining suite carved from seasoned Chittagong Teak with champagne-gold accents and Italian polished marble top.',
    features: ['Genuine Polished Marble Top', 'Hand-Carved Solid Teak Pedestals', 'Includes 8 Champagne Velvet Chairs']
  },
  {
    id: 'bed',
    title: 'Royal Baroque 4-Poster Teak King Bed',
    category: 'Bedroom',
    basePrice: 285000,
    defaultDimensions: { w: 84, d: 90, h: 78 },
    description: 'Palatial 4-poster king bed with towering solid teak pillars, 3D hand-carved floral crests, and diamond-tufted cyan sapphire velvet.',
    features: ['4 Architectural Teak Posts', '24K Gold Leaf Carved Crests', 'Tufted Cyan Velvet Headboard']
  },
  {
    id: 'executive-desk',
    title: 'Grand Palace Arched Display Vitrine',
    category: 'Storage & Vitrine',
    basePrice: 185000,
    defaultDimensions: { w: 78, d: 22, h: 88 },
    description: 'Multi-bay architectural display vitrine featuring Roman arched glass doors, integrated warm LED spotlights, and lower teak storage.',
    features: ['Beveled Glass Roman Arched Doors', 'Integrated LED Spotlights', 'Lockable Solid Teak Cabinetry']
  }
];

export const BespokeStudio3D: React.FC<BespokeStudio3DProps> = ({ onOpenConsultation }) => {
  const [selectedModel, setSelectedModel] = useState<ModelType>('armchair');
  const [selectedWood, setSelectedWood] = useState<WoodType>('chittagong-teak');
  const [selectedFabric, setSelectedFabric] = useState<FabricType>('ivory-boucle');
  const [isExploded, setIsExploded] = useState(false);
  const [lightingMood, setLightingMood] = useState<'warm-studio' | 'daylight' | 'golden-hour'>('warm-studio');
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');

  // Custom Dimensions adjustments
  const currentArchetype = ARCHETYPES.find((a) => a.id === selectedModel) || ARCHETYPES[0];
  const [widthAdjustment, setWidthAdjustment] = useState(0);
  const [depthAdjustment, setDepthAdjustment] = useState(0);
  const [heightAdjustment, setHeightAdjustment] = useState(0);
  const [showStudioDimensions, setShowStudioDimensions] = useState(false);

  const activeWood = WOOD_OPTIONS.find((w) => w.id === selectedWood) || WOOD_OPTIONS[0];
  const activeFabric = FABRIC_OPTIONS.find((f) => f.id === selectedFabric) || FABRIC_OPTIONS[0];

  // Dynamic custom price
  const basePrice = currentArchetype.basePrice;
  const dimensionMultiplier = 1 + (widthAdjustment * 0.008 + depthAdjustment * 0.008 + heightAdjustment * 0.006);
  const calculatedPriceBDT = Math.round(
    basePrice * activeWood.priceMultiplier * activeFabric.priceMultiplier * dimensionMultiplier
  );
  const calculatedPriceUSD = Math.round(calculatedPriceBDT / 120);

  const formattedWidth = currentArchetype.defaultDimensions.w + widthAdjustment;
  const formattedDepth = currentArchetype.defaultDimensions.d + depthAdjustment;
  const formattedHeight = currentArchetype.defaultDimensions.h + heightAdjustment;

  // Scale multipliers passed to 3D geometry
  const scaleDimensions = {
    widthMultiplier: 1 + widthAdjustment / currentArchetype.defaultDimensions.w,
    depthMultiplier: 1 + depthAdjustment / currentArchetype.defaultDimensions.d,
    heightMultiplier: 1 + heightAdjustment / currentArchetype.defaultDimensions.h,
  };

  const handleWhatsAppSend = () => {
    const text = `Hello Heaven Furniture Mart! I customized a bespoke 3D piece on your website:
• Model: ${currentArchetype.title}
• Timber: ${activeWood.name} (${activeWood.bengaliName})
• Fabric/Finish: ${activeFabric.name}
• Custom Dimensions: ${formattedWidth}" W × ${formattedDepth}" D × ${formattedHeight}" H
• Estimated Quote: ৳ ${calculatedPriceBDT.toLocaleString()}
Please confirm timber availability and scheduling for in-home spatial measurement.`;

    const url = `https://wa.me/${BRAND_INFO.phoneRaw.replace('+', '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleBookConsultation = () => {
    onOpenConsultation({
      roomType: currentArchetype.category,
      selectedWood: activeWood.name,
      customDimensions: `${formattedWidth}" W × ${formattedDepth}" D × ${formattedHeight}" H`,
      budget: `৳ ${calculatedPriceBDT.toLocaleString()}`,
      notes: `Customized 3D Model: ${currentArchetype.title} with ${activeFabric.name} and ${activeWood.name}.`
    });
  };

  return (
    <section className="py-20 lg:py-28 text-[#F5F5F5] relative border-b border-white/10" id="section-studio">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-950/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Background Watermark Text */}
      <div className="absolute top-20 right-4 select-none pointer-events-none text-[140px] lg:text-[200px] font-black uppercase text-white/[0.015] tracking-tighter leading-none whitespace-nowrap z-0">
        STUDIO 3D
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-10 h-[1.5px] bg-amber-500"></span>
              <span className="text-amber-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
                Interactive 3D Configurator
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.92] text-white font-heading-bold">
              Design & Configure <br />
              <span className="text-transparent text-stroke-white">Your Bespoke</span> <br />
              <span className="text-amber-500">Masterpiece.</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-light">
              Select any archetype below to load realistic PBR wood grains, Italian upholstery textures, live custom dimension scaling, and exploded joinery inspections.
            </p>
          </div>

          {/* Archetype Quick Selector Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ARCHETYPES.map((arch) => (
              <button
                key={arch.id}
                onClick={() => {
                  setSelectedModel(arch.id);
                  setWidthAdjustment(0);
                  setDepthAdjustment(0);
                  setHeightAdjustment(0);
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5 ${
                  selectedModel === arch.id
                    ? 'bg-amber-500 text-black shadow-lg ring-2 ring-amber-400/50'
                    : 'bg-[#141414] text-gray-300 hover:text-white border border-white/10 hover:border-amber-500/40'
                }`}
              >
                <span>{arch.title.split(' ')[0]} {arch.title.split(' ')[1] || ''}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main 3D Studio Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 3D Interactive WebGL Stage */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#121212] rounded-3xl p-3 sm:p-4 border border-white/10 shadow-2xl relative">
              
              {/* 3D Canvas Stage */}
              <div className="h-[440px] sm:h-[520px] rounded-2xl overflow-hidden shadow-inner bg-[#0A0A0A]">
                <FurnitureViewer3D
                  modelType={selectedModel}
                  selectedWood={selectedWood}
                  selectedFabric={selectedFabric}
                  exploded={isExploded}
                  onToggleExploded={() => setIsExploded(!isExploded)}
                  lightingMood={lightingMood}
                  scaleDimensions={scaleDimensions}
                  customDimensions={{ w: formattedWidth, d: formattedDepth, h: formattedHeight }}
                  showDimensions={showStudioDimensions}
                  onToggleDimensions={() => setShowStudioDimensions(!showStudioDimensions)}
                />
              </div>

              {/* Stage Bottom Features Bar */}
              <div className="mt-3 px-2 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-white font-bold uppercase tracking-wider text-[11px]">
                    {currentArchetype.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <button
                    onClick={() => setShowStudioDimensions(!showStudioDimensions)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all ${
                      showStudioDimensions
                        ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                        : 'bg-white/5 border-white/10 text-amber-400 hover:border-amber-500/40 hover:text-white'
                    }`}
                    title="Toggle Real-World Scale & Dimensions (cm / in)"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Dimensions Overlay</span>
                  </button>

                  <span className="hidden sm:inline">
                    Scaled: <strong className="text-amber-400 font-mono">{formattedWidth}" W × {formattedDepth}" D × {formattedHeight}" H</strong>
                    <span className="text-gray-500 ml-1">({Math.round(formattedWidth * 2.54)} × {Math.round(formattedDepth * 2.54)} × {Math.round(formattedHeight * 2.54)} cm)</span>
                  </span>
                </div>
              </div>

            </div>

            {/* Model Feature Highlights Card */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Hammer className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-white text-[11px] uppercase tracking-wider">
                    {currentArchetype.category} • Artisan Construction
                  </div>
                  <p className="text-gray-400 text-[11px] font-light">
                    {currentArchetype.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                {currentArchetype.features.map((f, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-300 font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Configurator Controls & Instant Quote */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#121212] rounded-3xl p-6 border border-white/10 space-y-6 shadow-xl">
              
              {/* 1. Timber Species Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                    <span>1. Select Timber Species</span>
                  </label>
                  <span className="text-xs text-amber-400 font-bold">
                    {activeWood.name} ({activeWood.bengaliName})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {WOOD_OPTIONS.map((wood) => {
                    const isSelected = selectedWood === wood.id;
                    return (
                      <button
                        key={wood.id}
                        onClick={() => setSelectedWood(wood.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-[#1A1A1A] border-amber-500 shadow-md ring-1 ring-amber-500/50'
                            : 'bg-[#0E0E0E] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex-shrink-0 border border-white/20 shadow-inner"
                          style={{ backgroundColor: wood.colorHex }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">
                            {wood.name.split(' (')[0]}
                          </div>
                          <div className="text-[10px] text-gray-400 truncate">
                            {wood.origin}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-400 bg-[#0E0E0E] p-2.5 rounded-xl border border-white/5">
                  <Info className="w-3 h-3 text-amber-500 inline mr-1" />
                  {activeWood.description}
                </p>
              </div>

              {/* 2. Upholstery & Fabric Selection */}
              <div className="space-y-3 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                    2. Select Upholstery & Finish
                  </label>
                  <span className="text-xs text-amber-400 font-bold">
                    {activeFabric.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FABRIC_OPTIONS.map((fabric) => {
                    const isSelected = selectedFabric === fabric.id;
                    return (
                      <button
                        key={fabric.id}
                        onClick={() => setSelectedFabric(fabric.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-[#1A1A1A] border-amber-500 ring-1 ring-amber-500/50'
                            : 'bg-[#0E0E0E] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0 border border-white/20 shadow-sm"
                          style={{ backgroundColor: fabric.colorHex }}
                        />
                        <span className="text-xs text-white font-medium truncate">
                          {fabric.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Dimension Customization Sliders (Updates 3D Real-Time) */}
              <div className="space-y-3 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-500" />
                    <span>3. Floorplan Scaling (Live 3D Update)</span>
                  </label>
                  <button
                    onClick={() => {
                      setWidthAdjustment(0);
                      setDepthAdjustment(0);
                      setHeightAdjustment(0);
                    }}
                    className="text-[10px] text-gray-400 hover:text-amber-400 underline uppercase tracking-wider"
                  >
                    Reset
                  </button>
                </div>

                {/* Width Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Width / Length:</span>
                    <span className="font-mono text-amber-400 font-bold">{formattedWidth}" ({Math.round(formattedWidth * 2.54)} cm)</span>
                  </div>
                  <input
                    type="range"
                    min={-12}
                    max={24}
                    value={widthAdjustment}
                    onChange={(e) => setWidthAdjustment(Number(e.target.value))}
                    className="w-full accent-amber-500 bg-[#0A0A0A] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Depth Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Depth / Clearance:</span>
                    <span className="font-mono text-amber-400 font-bold">{formattedDepth}" ({Math.round(formattedDepth * 2.54)} cm)</span>
                  </div>
                  <input
                    type="range"
                    min={-8}
                    max={14}
                    value={depthAdjustment}
                    onChange={(e) => setDepthAdjustment(Number(e.target.value))}
                    className="w-full accent-amber-500 bg-[#0A0A0A] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Height Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Height:</span>
                    <span className="font-mono text-amber-400 font-bold">{formattedHeight}" ({Math.round(formattedHeight * 2.54)} cm)</span>
                  </div>
                  <input
                    type="range"
                    min={-4}
                    max={8}
                    value={heightAdjustment}
                    onChange={(e) => setHeightAdjustment(Number(e.target.value))}
                    className="w-full accent-amber-500 bg-[#0A0A0A] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* 4. Instant Transparent Bespoke Quote Card */}
              <div className="bg-[#0A0A0A] rounded-2xl p-4 border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">
                      Estimated Bespoke Investment:
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 pt-0.5 tracking-tight font-heading-bold">
                      {currency === 'BDT' ? `৳ ${calculatedPriceBDT.toLocaleString()}` : `$ ${calculatedPriceUSD.toLocaleString()}`}
                    </div>
                  </div>

                  {/* Currency Toggle */}
                  <div className="flex items-center bg-[#181818] p-1 rounded-full border border-white/10 text-[11px]">
                    <button
                      onClick={() => setCurrency('BDT')}
                      className={`px-3 py-0.5 rounded-full ${currency === 'BDT' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400'}`}
                    >
                      BDT
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`px-3 py-0.5 rounded-full ${currency === 'USD' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400'}`}
                    >
                      USD
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 flex items-center justify-between border-t border-white/10 pt-2">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Delivery & White-Glove Installation Included</span>
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">10-Yr Guarantee</span>
                </div>
              </div>

              {/* 5. Direct Conversion Actions in Bold Pill Style */}
              <div className="space-y-3 pt-1">
                <button
                  onClick={handleBookConsultation}
                  className="w-full py-4 rounded-full bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  <Calendar className="w-4 h-4 text-black" />
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleWhatsAppSend}
                  className="w-full py-3.5 rounded-full bg-[#181818] text-emerald-400 border border-white/10 hover:border-emerald-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send 3D Config to WhatsApp</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
