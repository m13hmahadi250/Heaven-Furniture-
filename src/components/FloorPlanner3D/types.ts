export type RoomPresetId = 'penthouse-living' | 'master-suite' | 'executive-study' | 'custom';
export type FloorFinishId = 'teak-parquet' | 'italian-marble' | 'warm-concrete';
export type WallColorId = 'warm-ivory' | 'charcoal-teal' | 'greige' | 'studio-clay';
export type UnitSystem = 'imperial' | 'metric';
export type CameraMode = 'perspective' | 'blueprint' | 'eye-level';
export type CatalogCategory = 'living' | 'bedroom' | 'dining' | 'executive';
export type LightingPreset = 'day' | 'evening' | 'gallery';

export type WallSide = 'back' | 'left' | 'right' | 'front';
export type WallOpeningType = 'window' | 'door';
export type WallOpeningStyle = 'casement' | 'panoramic' | 'teak-door' | 'french-door' | 'sliding-glass';

export interface WallOpening {
  id: string;
  type: WallOpeningType;
  wall: WallSide;
  positionRatio: number; // 0.05 to 0.95 (0.5 is centered along the wall)
  widthFt: number; // Width of opening in feet
  heightFt: number; // Height of opening in feet
  sillHeightFt: number; // Elevation from floor (0 for doors, 2-3 ft for windows)
  doorOpenAngle?: number; // Swing angle in degrees (0 = closed, 45 = ajar, 90 = open)
  style?: WallOpeningStyle;
  label?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: CatalogCategory;
  widthFt: number; // Dimension along local X (width)
  depthFt: number; // Dimension along local Z (depth)
  heightFt: number; // Dimension along local Y (height)
  defaultTimber: string;
  defaultFabric?: string;
  basePriceBDT: number;
  description: string;
  modelType:
    | 'lounge-chair'
    | 'tufted-sofa'
    | 'walnut-coffee-table'
    | 'tv-media-unit'
    | 'platform-bed'
    | 'minimal-wardrobe'
    | 'floating-nightstand'
    | 'teak-dining-table'
    | 'executive-desk'
    | 'ergonomic-workstation'
    | 'high-bookshelf';
  tags: string[];
}

export interface PlacedFurniture {
  instanceId: string;
  itemId: string;
  x: number; // Room local X in feet
  z: number; // Room local Z in feet
  yElevation: number; // Elevation in feet (default 0)
  rotationY: number; // Angle in radians
  selectedTimber: string;
  selectedFabric?: string;
  customLabel?: string;
}

export interface RoomConfig {
  presetId: RoomPresetId;
  lengthFt: number; // Dimension in Z
  widthFt: number; // Dimension in X
  ceilingHeightFt: number; // Dimension in Y
  floorFinish: FloorFinishId;
  wallColor: WallColorId;
  hasCornerWindow: boolean;
  outsideVista: 'skyline' | 'garden';
  wallVisibility?: 'full' | 'cutaway' | 'none';
  openings: WallOpening[];
  lightingPreset?: LightingPreset;
}

export interface FloorFinishMeta {
  id: FloorFinishId;
  name: string;
  subhead: string;
  colorHex: string;
  specular: number;
  roughness: number;
}

export interface WallColorMeta {
  id: WallColorId;
  name: string;
  colorHex: string;
  ambientTint: string;
}

export interface RoomPresetMeta {
  id: RoomPresetId;
  name: string;
  subtitle: string;
  lengthFt: number;
  widthFt: number;
  ceilingHeightFt: number;
  recommendedFinish: FloorFinishId;
  recommendedWall: WallColorId;
  defaultFurnitureIds: { itemId: string; x: number; z: number; rotationY: number }[];
  defaultOpenings?: WallOpening[];
}
