import { WoodOption, FabricOption, CollectionItem, Milestone, TrustPoint } from '../types';

export const BRAND_INFO = {
  name: "Heaven Furniture Mart",
  tagline: "Designed. Crafted. Customized.",
  category: "Luxury / Bespoke Furniture & Interior Styling",
  location: "Agrabad Access Road, Chattogram, Bangladesh",
  googleMapsUrl: "https://maps.google.com/?q=Agrabad+Access+Road+Chattogram+Bangladesh",
  foundedYear: "2020",
  founder: "Abul Kalam Bhuiyan",
  founderTitle: "Managing Director",
  phone: "+880 1960-481983",
  phoneRaw: "+8801960481983",
  whatsappUrl: "https://wa.me/8801960481983?text=" + encodeURIComponent("Hello Heaven Furniture Mart! I would like to inquire about bespoke luxury furniture and book a design consultation."),
  email: "heavenfurnituremart@gmail.com",
  socials: {
    facebook: "https://facebook.com/HeavenFurnitureMart",
    instagram: "https://instagram.com/heaven_furniture_ltd",
    youtube: "https://youtube.com/@HeavenFurnitureMart",
  },
  openingHours: "Saturday – Thursday: 10:00 AM – 9:00 PM | Friday: 3:00 PM – 9:00 PM",
  showroomFeatures: [
    "Over 6,000 sq ft Luxury Interior Experience Studio",
    "Private Bespoke Design Consultation Lounge",
    "Comprehensive Timber & Italian Fabric Swatch Gallery",
    "Valet Parking on Agrabad Access Road"
  ]
};

export const MD_QUOTE = {
  quote: "At Heaven Furniture Mart, we believe furniture is more than just function; it is a reflection of lifestyle, taste, and comfort. Every piece we create is designed to bring lasting elegance into the homes of our clients.",
  author: "Abul Kalam Bhuiyan",
  title: "Managing Director & Founder",
  experience: "Pioneering bespoke luxury craftsmanship in Chattogram since 2020"
};

export const WOOD_OPTIONS: WoodOption[] = [
  {
    id: 'chittagong-teak',
    name: 'Chittagong Teak (Segun)',
    bengaliName: 'চট্টগ্রাম সেগুন কাঠ',
    origin: 'Locally Seasoned Hill Tracts Teak',
    colorHex: '#8C572A',
    roughness: 0.35,
    metalness: 0.05,
    description: 'The golden standard of luxury furniture in Bangladesh. Seasoned for 60+ days, impervious to coastal humidity and termite attacks with a rich golden-honey grain.',
    priceMultiplier: 1.0,
  },
  {
    id: 'burma-teak',
    name: 'Burma Teak (Royal Segun)',
    bengaliName: 'বার্মা সেগুন কাঠ',
    origin: 'Imported Grade-A Prime Timber',
    colorHex: '#683F1C',
    roughness: 0.3,
    metalness: 0.05,
    description: 'Deep amber natural oils and dense linear grain that develops an exquisite heirloom patina over decades.',
    priceMultiplier: 1.25,
  },
  {
    id: 'solid-walnut',
    name: 'Smoked American Walnut',
    bengaliName: 'আমেরিকান আখরোট কাঠ',
    origin: 'Sustainably Harvested Hardwood',
    colorHex: '#3D2A20',
    roughness: 0.4,
    metalness: 0.02,
    description: 'Dark, chocolate-charcoal swirling grain prized by modern architects for minimalist luxury living spaces.',
    priceMultiplier: 1.35,
  },
  {
    id: 'mahogany',
    name: 'Royal Red Mahogany',
    bengaliName: 'মেহগনি কাঠ',
    origin: 'Selected Heartwood Timber',
    colorHex: '#582119',
    roughness: 0.38,
    metalness: 0.03,
    description: 'Rich reddish-brown warmth with fine grain, cured to a mirror-like satin lustre.',
    priceMultiplier: 0.85,
  },
  {
    id: 'white-oak',
    name: 'Nordic White Oak',
    bengaliName: 'সাদা ওক কাঠ',
    origin: 'Imported European Kiln-Dried',
    colorHex: '#BFA280',
    roughness: 0.45,
    metalness: 0.02,
    description: 'Light, organic neutral tone with visible cathedral rays, ideal for Scandinavian Japandi interiors.',
    priceMultiplier: 1.15,
  },
];

export const FABRIC_OPTIONS: FabricOption[] = [
  {
    id: 'ivory-boucle',
    name: 'Warm Ivory Bouclé',
    colorHex: '#EFE9DD',
    textureType: 'boucle',
    roughness: 0.85,
    description: 'High-pile textured luxury fabric offering cloud-like tactile comfort and high rub-count durability.',
    priceMultiplier: 1.0,
  },
  {
    id: 'emerald-velvet',
    name: 'Royal Emerald Velvet',
    colorHex: '#1B4332',
    textureType: 'velvet',
    roughness: 0.65,
    description: 'Heavyweight Italian velvet with deep light-shifting sheen, resistant to pilling and stains.',
    priceMultiplier: 1.15,
  },
  {
    id: 'deep-teal-velvet',
    name: 'Deep Teal Velvet',
    colorHex: '#0C3843',
    textureType: 'velvet',
    roughness: 0.65,
    description: 'Rich peacock ocean velvet with jewel-tone depth and anti-static soft weave.',
    priceMultiplier: 1.18,
  },
  {
    id: 'cognac-leather',
    name: 'Cognac Saddle Leather',
    colorHex: '#8B4513',
    textureType: 'leather',
    roughness: 0.25,
    description: 'Full-grain semi-aniline cowhide that softens and ages beautifully with character.',
    priceMultiplier: 1.4,
  },
  {
    id: 'charcoal-linen',
    name: 'Deep Charcoal Slate Linen',
    colorHex: '#252D32',
    textureType: 'linen',
    roughness: 0.75,
    description: 'Breathable, structured Belgian linen weave offering masculine modern elegance.',
    priceMultiplier: 0.95,
  },
  {
    id: 'sand-chenille',
    name: 'Natural Sand Chenille',
    colorHex: '#D2BBA0',
    textureType: 'chenille',
    roughness: 0.7,
    description: 'Silky micro-fiber yarn blend with water-repellent nanotech treatment for family living.',
    priceMultiplier: 1.05,
  },
];

export const TRUST_POINTS: TrustPoint[] = [
  {
    id: 'consultation',
    title: 'Free Design Consultation',
    shortDesc: '3D spatial planning and material sampling with our chief interior designer.',
    fullDesc: 'We visit your home in Chattogram or host you in our Agrabad design lounge. Our architects assess your room lighting, circulation, and lifestyle before sketching custom 3D layouts.',
    iconName: 'Compass'
  },
  {
    id: 'bespoke',
    title: 'Fully Bespoke — Not Mass-Produced',
    shortDesc: 'Every millimeter tailored to your exact floorplan, taste, and ergonomics.',
    fullDesc: 'Unlike flat-pack or warehouse mass imports, every single piece is custom-commissioned with personalized dimensions, wood species, and upholstery fabrics.',
    iconName: 'Scissors'
  },
  {
    id: 'craftsmanship',
    title: 'Premium Wood & Skilled Craftsmanship',
    shortDesc: 'Seasoned Chittagong Teak with time-tested mortise & tenon joinery.',
    fullDesc: 'Our master woodworkers bring decades of hereditary artisanal joinery skills. We hand-select kiln-dried timber and apply 7-stage hand-rubbed finishes.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'showroom',
    title: 'Large Physical Showroom in Agrabad',
    shortDesc: 'Touch the wood, feel the fabrics, and experience living scale in person.',
    fullDesc: 'Visit our flagship studio on Agrabad Access Road. Experience curated bedroom suites, formal dining settings, and lounge environments in real life.',
    iconName: 'Store'
  },
  {
    id: 'delivery',
    title: 'White-Glove Delivery & Installation',
    shortDesc: 'Direct to your room, assembled, leveled, and polished with zero hassle.',
    fullDesc: 'Our specialized logistics team handles door-to-room delivery anywhere in Chattogram, Dhaka, and nationwide with protective crating and full setup included.',
    iconName: 'Truck'
  },
  {
    id: 'payment',
    title: 'Easy Payment & Milestone Structure',
    shortDesc: 'Transparent phased milestones linked to workshop progress inspections.',
    fullDesc: 'Simple down-payment to initiate timber seasoning and crafting, with remaining balance settled upon your personal inspection and delivery approval.',
    iconName: 'CreditCard'
  },
  {
    id: 'homeowners',
    title: 'Trusted by 500+ Luxury Homeowners',
    shortDesc: 'Penthouses, duplexes, and prestigious residences across Bangladesh.',
    fullDesc: 'From Khulshi and Nasirabad to Dhanmondi and Gulshan, our bespoke creations anchor the finest residences in the country.',
    iconName: 'Users'
  }
];

export const MILESTONES: Milestone[] = [
  {
    year: "2020",
    title: "Founded by Abul Kalam Bhuiyan",
    description: "Heaven Furniture Mart was established with a singular vision: bringing authentic bespoke interior craftsmanship to Chattogram's discerning homeowners.",
    tag: "Inception"
  },
  {
    year: "2021",
    title: "Opened the Agrabad Showroom",
    description: "Inaugurated our flagship multi-level design studio on Agrabad Access Road, welcoming clients to experience bespoke furniture in curated room environments.",
    tag: "Flagship Studio"
  },
  {
    year: "2024–2025",
    title: "Exhibited at the International Furniture Fair, Chattogram",
    description: "Showcased our signature Chittagong Teak architectural collections and received overwhelming praise from national architects and interior designers.",
    tag: "Industry Acclaim"
  },
  {
    year: "2025",
    title: "Chamber of Commerce Membership",
    description: "Officially inducted as a recognized member of the Chamber of Commerce, solidifying our reputation for ethical luxury manufacturing and trade.",
    tag: "Official Status"
  },
  {
    year: "2026",
    title: "Nationwide BFIOA Recognition",
    description: "Honored with prestigious recognition by the Bangladesh Furniture Industry Owners Association (BFIOA) for outstanding excellence in bespoke craftsmanship.",
    tag: "National Award"
  }
];

export const COLLECTIONS_DATA: CollectionItem[] = [
  // 1. Dining - Luxury Dining Table Set
  {
    id: 'imperial-dining-champagne',
    title: 'Imperial Pearl & Champagne Marble Dining Suite',
    bengaliTitle: 'ইম্পেরিয়াল মার্বেল ডাইনিং সেট (৮ আসন)',
    category: 'dining',
    categoryLabel: 'Dining Suite',
    dimensions: '108" L × 46" W × 31" H (8-Seater Custom Suite)',
    wood: 'Hand-Carved Seasoned Chittagong Teak & Pearl Champagne Marble',
    finish: 'Champagne Pearl Lacquer with Italian Polished Marble Top',
    leadTime: '20 - 25 Days',
    basePriceBDT: 245000,
    description: 'An opulent 8-seater dining centerpiece crafted from seasoned Chittagong Teak, adorned with ornate Baroque floral carvings, champagne-gold gilded accents, and a mirror-polished genuine marble top flanked by 8 ergonomic royal dining chairs.',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Genuine Italian pearl-finish marble slab',
      'Solid Chittagong Segun hand-carved pedestal base',
      '8 Royal high-back chairs in champagne velvet',
      'Stain & heat resistant nano-shield protective coating'
    ],
    isFeatured: true,
  },

  // 2. Bedroom - Luxury Bed
  {
    id: 'royal-gold-bed-cyan',
    title: 'Royal Baroque 4-Poster Teak King Bed',
    bengaliTitle: 'রয়্যাল গোল্ডেন খোদাইকৃত সায়ান ভেলভেট কিং বেড',
    category: 'bedroom',
    categoryLabel: 'Master Bedroom',
    dimensions: '84" W × 90" L × 78" H (Presidential King Size)',
    wood: 'Solid Chittagong Teak with 24K Leaf Gold Accents',
    finish: 'Antiqued Gold Leaf Gilding with Cyan Sapphire Velvet',
    leadTime: '25 - 30 Days',
    basePriceBDT: 285000,
    description: 'A palatial master bedroom statement featuring towering architectural posts, intricate 3D hand-carved floral crests, and deep diamond-tufted Italian cyan velvet upholstery with gold crystal buttons.',
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4b49?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Towering 4-poster architectural solid teak pillars',
      'Intricate master-carved Baroque crest & crown',
      'Diamond-tufted cyan Italian velvet headboard',
      'Reinforced solid hardwood acoustic sub-frame'
    ],
    isFeatured: true,
  },

  // 3. Living Room - Classic Living Sofa Set
  {
    id: 'classic-living-sofa-set',
    title: 'Heritage Grand Solid Teak Living Suite',
    bengaliTitle: 'হেরিটেজ গ্র্যান্ড সেগুন সোফা সেট (৩+২+১+১)',
    category: 'living',
    categoryLabel: 'Living Room',
    dimensions: '3-Seater (86" W), 2-Seater (66" W), 2× Armchairs (38" W)',
    wood: '100% Solid Kiln-Dried Chittagong Teak (Segun)',
    finish: 'Deep Amber Heritage Hand-Rubbed Satin Polish',
    leadTime: '18 - 24 Days',
    basePriceBDT: 195000,
    description: 'Timeless luxury living room ensemble featuring master woodworker relief carvings on solid Chittagong Segun crown crests and armrests, paired with durable textured beige damask upholstery and high-density pocketed coil comfort.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    features: [
      '100% seasoned Chittagong Segun frame and armrests',
      'Master hand-carved scrollwork & crown crests',
      'Includes 3-seater, 2-seater, and 2 individual armchairs',
      'High-resilience 40-density orthopedic cushioning'
    ],
    isFeatured: true,
  },

  // 4. Dining - Luxury Dining Set (Mahogany / Oxblood)
  {
    id: 'royal-mahogany-leather-dining',
    title: 'Sovereign Calacatta Marble & Oxblood Leather Dining Suite',
    bengaliTitle: 'সভেরেন মার্বেল ও লেদার ডাইনিং সেট (৮ আসন)',
    category: 'dining',
    categoryLabel: 'Dining Suite',
    dimensions: '96" L × 44" W × 30" H (8-Seater Configuration)',
    wood: 'Select Royal Red Mahogany & Chittagong Teak Substructure',
    finish: 'Warm Mahogany Gloss with Calacatta Gold Marble Slab',
    leadTime: '20 - 25 Days',
    basePriceBDT: 215000,
    description: 'Stately formal dining arrangement boasting an imported Calacatta Gold marble tabletop resting on dual hand-carved mahogany trestle pedestals, matched with 8 button-tufted oxblood top-grain leather dining chairs.',
    imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Imported Calacatta marble slab with bevelled bullnose edge',
      'Dual carved classical urn trestle pedestals',
      '8 Button-tufted oxblood leather chairs with brass studs',
      'Scratch, heat, and moisture proof nano-seal'
    ],
    isFeatured: true,
  },

  // 5. Bedroom - Minimalist / Contemporary Bed Set
  {
    id: 'emerald-velvet-luxury-bed',
    title: 'Emerald Monarch Channel-Tufted Velvet Bed',
    bengaliTitle: 'এমেরাল্ড মোনার্ক ভেলভেট কিং বেড',
    category: 'bedroom',
    categoryLabel: 'Master Bedroom',
    dimensions: '82" W × 88" L × 62" H (King Size)',
    wood: 'Chittagong Teak Substructure with PVD Gold Trim',
    finish: 'Italian Emerald Green Velvet with Brushed Gold Accents',
    leadTime: '15 - 20 Days',
    basePriceBDT: 165000,
    description: 'Contemporary architectural luxury featuring an oversized vertical channel-tufted emerald green velvet headboard flanked by warm ambient gold accents, heavy-duty internal teak platform, and matching plush perimeter rails.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Oversized vertical channel-tufted emerald velvet headboard',
      'Heavy-duty internal seasoned teak platform',
      'Integrated floating nightstand coordination',
      'Noise-free acoustic upholstered rail assembly'
    ],
    isFeatured: true,
  },

  // 6. Living Room - Silver Embroidered Royal Sofa
  {
    id: 'silver-embroidered-royal-sofa',
    title: 'Silver Imperial Floral Embroidered Velvet Sofa',
    bengaliTitle: 'সিলভার এম্পেরিয়াল ফ্লোরাল এমব্রয়ডারি সোফা',
    category: 'living',
    categoryLabel: 'Living Room',
    dimensions: '90" W × 38" D × 42" H (3-Seater Master Piece)',
    wood: 'Solid Chittagong Teak with Antique Silver Leaf Finish',
    finish: 'Silver Leaf Hand-Gilding with Floral Damask Brocade',
    leadTime: '20 - 25 Days',
    basePriceBDT: 175000,
    description: 'An imperial salon showpiece with intricate silver-gilded openwork wood carvings along the crown crest and cabriole legs, upholstered in lustrous floral embroidered silver-grey velvet with accent throw cushions.',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Silver leaf hand-gilded solid teak frame',
      'Embroidered floral damask velvet upholstery',
      'Scalloped apron with hand-carved floral rosettes',
      'Includes custom designer accent bolsters & throw pillows'
    ],
    isFeatured: false,
  },

  // 7. Storage / Display - Luxury Showcase
  {
    id: 'arched-luxury-vitrine-showcase',
    title: 'Grand Palace Arched Vitrine & Glass Display Cabinet',
    bengaliTitle: 'গ্র্যান্ড আর্চড গ্লাস শোকেস ক্যাবিনেট',
    category: 'bespoke',
    categoryLabel: 'Storage & Vitrine',
    dimensions: '78" W × 22" D × 88" H (Multi-Bay Royal Showcase)',
    wood: '100% Solid Chittagong Teak with Champagne Gold Trim',
    finish: 'Two-Tone Ivory Enamel & Warm Teak Accent with Warm Glass Shelves',
    leadTime: '22 - 28 Days',
    basePriceBDT: 185000,
    description: 'Palatial multi-section display vitrine with majestic Roman arched glass doors, integrated warm LED spotlights, beveled glass shelving for crystalware, and deep lower teak cabinetry for secure storage.',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Multi-tiered beveled tempered glass display shelves',
      'Architectural Roman arched double glass doors',
      'Integrated low-voltage warm LED spotlights',
      'Deep lower lockable solid teak cabinetry'
    ],
    isFeatured: true,
  },

  // 8. Storage / Console - Minimal Shoe Box
  {
    id: 'matte-black-shoe-console',
    title: 'Noir Luxe Entryway Shoe Credenza & Console',
    bengaliTitle: 'নোয়ার লাক্স এন্ট্রি শু ক্যাবিনেট ও কনসোল',
    category: 'bespoke',
    categoryLabel: 'Storage & Vitrine',
    dimensions: '56" W × 16" D × 42" H (Slimline Entryway Console)',
    wood: 'Kiln-Dried Hardwood with Matte Charcoal Finish & Gold Trim',
    finish: 'Matte Obsidian Charcoal with Brushed Brass Pulls',
    leadTime: '12 - 16 Days',
    basePriceBDT: 68000,
    description: 'A sleek, space-maximizing luxury entryway shoe credenza holding 24+ pairs of footwear in tiered ventilated slots, featuring a fluted drawer for keys, soft-close hardware, and a durable scratch-proof marble-look top surface.',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Concealed ventilated multi-tier shoe storage (24+ pairs)',
      'Upper organizer drawers for keys, watches, and care kits',
      'Heavy-duty soft-close dampers on all doors',
      'Brushed brass geometric legs and minimalist hardware'
    ],
    isFeatured: false,
  },

  // 9. Living Room - Luxury Embroidery Sofa Set
  {
    id: 'sapphire-gold-embroidery-sofa',
    title: 'Royal Sapphire & Gold Damask Luxury Sofa Suite',
    bengaliTitle: 'রয়্যাল সাফায়ার এমব্রয়ডারি লাক্সারি সোফা সেট',
    category: 'living',
    categoryLabel: 'Living Room',
    dimensions: '3-Seater (88" W), 2-Seater (68" W), Accent Chair (36" W)',
    wood: 'Solid Chittagong Teak with 24K Gold Leaf Carvings',
    finish: 'Burnished Gold Leaf with Royal Sapphire Embroidered Velvet',
    leadTime: '22 - 28 Days',
    basePriceBDT: 235000,
    description: 'An aristocratic living room masterpiece combining 24K gold leaf accented solid teak frame carvings with rich royal sapphire velvet and elaborate gold thread damask embroidery across the backrests and seats.',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    features: [
      '24K burnished gold leaf on relief-carved teak',
      'Royal sapphire velvet with gold metallic damask thread',
      'Deep tufted ergonomic lumbar support',
      'Multi-piece suite configuration (3+2+1)'
    ],
    isFeatured: true,
  }
];

export const REVIEWS = [
  {
    name: "Engr. Tanvir Ahmed",
    location: "Nasirabad Housing Society, Chattogram",
    project: "Living & Dining Custom Teak Fit-Out",
    rating: 5,
    comment: "Heaven Furniture Mart completely transformed our duplex. The quality of Chittagong Teak and the smoothness of the finish is unmatched by anything in Bangladesh. Mr. Abul Kalam Bhuiyan and his team delivered on time with impeccable manners."
  },
  {
    name: "Dr. Farzana Yasmin",
    location: "Khulshi R/A, Chattogram",
    project: "Master Bedroom Suite & Dressing Unit",
    rating: 5,
    comment: "The floating bed and acoustic slatted headboard feel like a 5-star presidential suite. Not having to settle for mass-produced factory dimensions was the best decision we made."
  },
  {
    name: "Mahbubur Rahman",
    location: "Agrabad Commercial Area, Chattogram",
    project: "Executive Office Suite & Boardroom Table",
    rating: 5,
    comment: "Visiting the Agrabad showroom convinced us immediately. You can smell the authentic seasoned wood and see the craftsmanship in the joinery. Exceptional delivery team."
  }
];
