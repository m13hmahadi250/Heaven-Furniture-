export type FurnitureCategory = 'all' | 'living' | 'bedroom' | 'dining' | 'office' | 'bespoke';

export type WoodType = 'chittagong-teak' | 'burma-teak' | 'solid-walnut' | 'mahogany' | 'white-oak';

export type FabricType = 'ivory-boucle' | 'emerald-velvet' | 'deep-teal-velvet' | 'cognac-leather' | 'charcoal-linen' | 'sand-chenille';

export interface WoodOption {
  id: WoodType;
  name: string;
  bengaliName: string;
  origin: string;
  colorHex: string;
  roughness: number;
  metalness: number;
  description: string;
  priceMultiplier: number;
}

export interface FabricOption {
  id: FabricType;
  name: string;
  colorHex: string;
  textureType: 'velvet' | 'leather' | 'boucle' | 'linen' | 'chenille';
  roughness: number;
  description: string;
  priceMultiplier: number;
}

export interface FurnitureModelConfig {
  modelType: 'armchair' | 'sofa' | 'dining-table' | 'bed' | 'executive-desk';
  name: string;
  subtitle: string;
  category: FurnitureCategory;
  basePriceBDT: number;
  wood: WoodType;
  fabric: FabricType;
  dimensions: {
    widthInches: number;
    depthInches: number;
    heightInches: number;
  };
  explodedView: boolean;
  lightingMood: 'warm-studio' | 'daylight' | 'golden-hour';
}

export interface CollectionItem {
  id: string;
  title: string;
  bengaliTitle?: string;
  category: FurnitureCategory;
  categoryLabel: string;
  dimensions: string;
  wood: string;
  finish: string;
  leadTime: string;
  basePriceBDT: number;
  description: string;
  imageUrl: string;
  features: string[];
  isFeatured?: boolean;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
  tag?: string;
}

export interface TrustPoint {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
}

export interface ConsultationFormData {
  name: string;
  phone: string;
  email?: string;
  roomType: string;
  preferredDate?: string;
  notes?: string;
  customDimensions?: string;
  selectedWood?: string;
  budget?: string;
}
