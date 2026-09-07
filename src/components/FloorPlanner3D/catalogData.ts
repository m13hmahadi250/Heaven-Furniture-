import {
  CatalogItem,
  FloorFinishMeta,
  WallColorMeta,
  RoomPresetMeta
} from './types';

export const CATALOG_ITEMS: CatalogItem[] = [
  // LIVING ROOM
  {
    id: 'lounge-chair',
    name: 'Signature Velvet Lounge Chair',
    category: 'living',
    widthFt: 3.2,
    depthFt: 3.0,
    heightFt: 2.8,
    defaultTimber: 'Chittagong Teak',
    defaultFabric: 'Emerald Royal Velvet',
    basePriceBDT: 48000,
    description: 'Ergonomically contoured solid teak frame with deep emerald velvet cushioning and 24K gold leg caps.',
    modelType: 'lounge-chair',
    tags: ['Armchair', 'Accent', 'Velvet']
  },
  {
    id: 'tufted-sofa',
    name: 'Tufted 3-Seater Sovereign Sofa',
    category: 'living',
    widthFt: 7.5,
    depthFt: 3.2,
    heightFt: 2.9,
    defaultTimber: 'Seasoned Teak Plinth',
    defaultFabric: 'Warm Ivory Bouclé',
    basePriceBDT: 185000,
    description: 'Deep button-tufted backrest with high-resilience feather-foam core and continuous fluted timber base.',
    modelType: 'tufted-sofa',
    tags: ['Sofa', 'Living', 'Luxury']
  },
  {
    id: 'walnut-coffee-table',
    name: 'Sculpted Walnut & Marble Coffee Table',
    category: 'living',
    widthFt: 4.2,
    depthFt: 2.4,
    heightFt: 1.4,
    defaultTimber: 'Seasoned Walnut',
    defaultFabric: 'Polished Calacatta Inlay',
    basePriceBDT: 52000,
    description: 'Chamfered geometric oval timber table with flush marble insert and concealed soft-close drawer.',
    modelType: 'walnut-coffee-table',
    tags: ['Table', 'Centerpiece', 'Marble']
  },
  {
    id: 'tv-media-unit',
    name: 'Floating Architectural Media Console',
    category: 'living',
    widthFt: 6.8,
    depthFt: 1.4,
    heightFt: 1.6,
    defaultTimber: 'Chittagong Teak Louvers',
    basePriceBDT: 78000,
    description: 'Wall-mounted acoustic slatted louvers with concealed cable management and warm indirect LED shadow gap.',
    modelType: 'tv-media-unit',
    tags: ['Media', 'Wall Unit', 'Slats']
  },

  // BEDROOM
  {
    id: 'platform-bed',
    name: 'King Floating Platform Bed',
    category: 'bedroom',
    widthFt: 7.0,
    depthFt: 7.5,
    heightFt: 3.8,
    defaultTimber: 'Seasoned Teak Ledger',
    defaultFabric: 'Champagne Linen Upholstery',
    basePriceBDT: 245000,
    description: 'Cantilevered architectural floating platform with wrap-around upholstered headboard and integrated reading lamps.',
    modelType: 'platform-bed',
    tags: ['King Bed', 'Platform', 'Floating']
  },
  {
    id: 'minimal-wardrobe',
    name: 'Full-Height Teak Architectural Wardrobe',
    category: 'bedroom',
    widthFt: 4.8,
    depthFt: 2.0,
    heightFt: 7.2,
    defaultTimber: 'Chittagong Teak Fluting',
    basePriceBDT: 145000,
    description: 'Tall fluted wardrobe with integrated bronze finger-pulls, soft-closing Blum hardware, and internal valet lighting.',
    modelType: 'minimal-wardrobe',
    tags: ['Wardrobe', 'Storage', 'Fluted']
  },
  {
    id: 'floating-nightstand',
    name: 'Sculpted Floating Teak Nightstand',
    category: 'bedroom',
    widthFt: 2.0,
    depthFt: 1.4,
    heightFt: 1.2,
    defaultTimber: 'Solid Chittagong Teak',
    basePriceBDT: 26000,
    description: 'Wall-hung drawer unit with mitred waterfall edges and brushed satin brass handle.',
    modelType: 'floating-nightstand',
    tags: ['Nightstand', 'Bedside', 'Floating']
  },

  // DINING
  {
    id: 'teak-dining-table',
    name: 'Imperial 8-Seater Teak Dining Suite',
    category: 'dining',
    widthFt: 8.2,
    depthFt: 3.8,
    heightFt: 2.5,
    defaultTimber: 'Seasoned Chittagong Teak',
    defaultFabric: 'Italian Brocade Chairs',
    basePriceBDT: 265000,
    description: 'Massive monolithic teak top with bookmatched grain, sculptural trestle base, and 8 matching dining chairs.',
    modelType: 'teak-dining-table',
    tags: ['Dining Table', '8-Seater', 'Family']
  },

  // EXECUTIVE
  {
    id: 'executive-desk',
    name: 'Architect Executive Desk',
    category: 'executive',
    widthFt: 6.2,
    depthFt: 3.0,
    heightFt: 2.5,
    defaultTimber: 'Chittagong Teak & Saddle Leather',
    basePriceBDT: 135000,
    description: 'Commanding cantilevered desktop with inset genuine saddle leather writing blotter and lockable credenza.',
    modelType: 'executive-desk',
    tags: ['Executive', 'Desk', 'Office']
  },
  {
    id: 'ergonomic-workstation',
    name: 'Minimal Ergonomic Teak Workstation',
    category: 'executive',
    widthFt: 4.6,
    depthFt: 2.4,
    heightFt: 2.5,
    defaultTimber: 'Seasoned Oak / Teak',
    basePriceBDT: 58000,
    description: 'Slimline studio work desk with chamfered timber perimeter, matte black steel legs, and leather desk pad.',
    modelType: 'ergonomic-workstation',
    tags: ['Workstation', 'Study', 'Compact']
  },
  {
    id: 'high-bookshelf',
    name: 'Asymmetric Teak Library Bookshelf',
    category: 'executive',
    widthFt: 3.8,
    depthFt: 1.2,
    heightFt: 7.0,
    defaultTimber: 'Seasoned Chittagong Teak',
    basePriceBDT: 72000,
    description: 'Floor-to-ceiling rhythmic shelving unit with solid timber uprights and brass divider accents.',
    modelType: 'high-bookshelf',
    tags: ['Bookshelf', 'Library', 'Storage']
  }
];

export const FLOOR_FINISHES: FloorFinishMeta[] = [
  {
    id: 'teak-parquet',
    name: 'Chittagong Teak Parquet',
    subhead: 'Artisanal seasoned herringbone timber with warm satin sheen',
    colorHex: '#8C5A2B',
    specular: 0.35,
    roughness: 0.4
  },
  {
    id: 'italian-marble',
    name: 'Polished White Italian Marble',
    subhead: 'Calacatta gold veined slabs with high specular mirror reflection',
    colorHex: '#EDEDEB',
    specular: 0.9,
    roughness: 0.12
  },
  {
    id: 'warm-concrete',
    name: 'Warm Architectural Micro-Cement',
    subhead: 'Seamless modernist loft screed with velvety matte diffusion',
    colorHex: '#9E978F',
    specular: 0.18,
    roughness: 0.72
  }
];

export const WALL_COLORS: WallColorMeta[] = [
  {
    id: 'warm-ivory',
    name: 'Warm Ivory',
    colorHex: '#FAF7F0',
    ambientTint: '#FFFBF5'
  },
  {
    id: 'charcoal-teal',
    name: 'Charcoal Teal',
    colorHex: '#1C2828',
    ambientTint: '#223838'
  },
  {
    id: 'greige',
    name: 'Muted Greige',
    colorHex: '#D3CCC1',
    ambientTint: '#DFD8CE'
  },
  {
    id: 'studio-clay',
    name: 'Studio Terracotta Clay',
    colorHex: '#A36852',
    ambientTint: '#B5745E'
  }
];

export const ROOM_PRESETS: RoomPresetMeta[] = [
  {
    id: 'penthouse-living',
    name: 'Agrabad Penthouse Living',
    subtitle: 'Expansive formal salon with panoramic corner glazing (20 × 16 ft)',
    lengthFt: 16,
    widthFt: 20,
    ceilingHeightFt: 10,
    recommendedFinish: 'teak-parquet',
    recommendedWall: 'warm-ivory',
    defaultFurnitureIds: [
      { itemId: 'tufted-sofa', x: 0, z: -2.5, rotationY: 0 },
      { itemId: 'walnut-coffee-table', x: 0, z: 1.0, rotationY: 0 },
      { itemId: 'lounge-chair', x: -4.8, z: 0.8, rotationY: Math.PI / 4 },
      { itemId: 'lounge-chair', x: 4.8, z: 0.8, rotationY: -Math.PI / 4 },
      { itemId: 'tv-media-unit', x: 0, z: 6.8, rotationY: Math.PI }
    ],
    defaultOpenings: [
      {
        id: 'opening-win-1',
        type: 'window',
        wall: 'back',
        positionRatio: 0.65,
        widthFt: 6.0,
        heightFt: 5.0,
        sillHeightFt: 2.2,
        style: 'casement'
      },
      {
        id: 'opening-door-1',
        type: 'door',
        wall: 'left',
        positionRatio: 0.25,
        widthFt: 3.2,
        heightFt: 7.0,
        sillHeightFt: 0,
        doorOpenAngle: 45,
        style: 'teak-door'
      }
    ]
  },
  {
    id: 'master-suite',
    name: 'Master Suite Sanctuary',
    subtitle: 'Private retreat with floating platform bed and wardrobe (16 × 14 ft)',
    lengthFt: 14,
    widthFt: 16,
    ceilingHeightFt: 9.5,
    recommendedFinish: 'italian-marble',
    recommendedWall: 'greige',
    defaultFurnitureIds: [
      { itemId: 'platform-bed', x: 0, z: -2.0, rotationY: 0 },
      { itemId: 'floating-nightstand', x: -4.6, z: -4.8, rotationY: 0 },
      { itemId: 'floating-nightstand', x: 4.6, z: -4.8, rotationY: 0 },
      { itemId: 'lounge-chair', x: 4.5, z: 3.5, rotationY: -Math.PI * 0.75 },
      { itemId: 'minimal-wardrobe', x: -5.5, z: 2.5, rotationY: Math.PI / 2 }
    ],
    defaultOpenings: [
      {
        id: 'opening-win-2',
        type: 'window',
        wall: 'back',
        positionRatio: 0.7,
        widthFt: 5.0,
        heightFt: 4.8,
        sillHeightFt: 2.2,
        style: 'casement'
      },
      {
        id: 'opening-door-2',
        type: 'door',
        wall: 'left',
        positionRatio: 0.2,
        widthFt: 3.2,
        heightFt: 7.0,
        sillHeightFt: 0,
        doorOpenAngle: 30,
        style: 'teak-door'
      }
    ]
  },
  {
    id: 'executive-study',
    name: 'Executive Study & Library',
    subtitle: 'Focused command office with library shelving (14 × 12 ft)',
    lengthFt: 12,
    widthFt: 14,
    ceilingHeightFt: 9,
    recommendedFinish: 'teak-parquet',
    recommendedWall: 'charcoal-teal',
    defaultFurnitureIds: [
      { itemId: 'executive-desk', x: 0, z: 0.5, rotationY: 0 },
      { itemId: 'high-bookshelf', x: 0, z: -4.8, rotationY: 0 },
      { itemId: 'lounge-chair', x: 3.8, z: 2.2, rotationY: -Math.PI * 0.7 }
    ],
    defaultOpenings: [
      {
        id: 'opening-win-3',
        type: 'window',
        wall: 'right',
        positionRatio: 0.5,
        widthFt: 5.5,
        heightFt: 4.8,
        sillHeightFt: 2.2,
        style: 'casement'
      },
      {
        id: 'opening-door-3',
        type: 'door',
        wall: 'left',
        positionRatio: 0.3,
        widthFt: 3.2,
        heightFt: 7.0,
        sillHeightFt: 0,
        doorOpenAngle: 40,
        style: 'teak-door'
      }
    ]
  },
  {
    id: 'custom',
    name: 'Custom Made-to-Measure',
    subtitle: 'Parametric room architect with custom dimensions',
    lengthFt: 15,
    widthFt: 18,
    ceilingHeightFt: 10,
    recommendedFinish: 'teak-parquet',
    recommendedWall: 'warm-ivory',
    defaultFurnitureIds: [
      { itemId: 'tufted-sofa', x: 0, z: -2.0, rotationY: 0 },
      { itemId: 'walnut-coffee-table', x: 0, z: 1.2, rotationY: 0 }
    ],
    defaultOpenings: [
      {
        id: 'opening-win-custom',
        type: 'window',
        wall: 'back',
        positionRatio: 0.6,
        widthFt: 5.0,
        heightFt: 4.5,
        sillHeightFt: 2.5,
        style: 'casement'
      },
      {
        id: 'opening-door-custom',
        type: 'door',
        wall: 'left',
        positionRatio: 0.25,
        widthFt: 3.2,
        heightFt: 7.0,
        sillHeightFt: 0,
        doorOpenAngle: 45,
        style: 'teak-door'
      }
    ]
  }
];
