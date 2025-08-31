import React, { createContext, useContext, useState, useEffect } from 'react';
import productEarrings from '@/assets/product-earrings.jpg';
import productRing from '@/assets/product-ring.jpg';
import productNecklace from '@/assets/product-necklace.jpg';
import productBangles from '@/assets/product-bangles.jpg';

export interface JewelryItem {
  id: number;
  name: string;
  collection: string;
  image: string;
  material: string;
  type: string;
  occasion: string;
  priceRange: string;
  priceMin: number;
  priceMax: number;
  isNew?: boolean;
  isFavorite?: boolean;
  featured?: boolean;
  popular?: boolean;
  sku: string;
  description: string;
}

export interface FilterState {
  search: string;
  materials: string[];
  types: string[];
  occasions: string[];
  collections: string[];
  priceRange: [number, number];
  sortBy: string;
  viewMode: 'grid' | 'large';
}

interface JewelryContextType {
  items: JewelryItem[];
  filteredItems: JewelryItem[];
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  resetFilters: () => void;
  isLoading: boolean;
}

const JewelryContext = createContext<JewelryContextType | undefined>(undefined);

const initialFilters: FilterState = {
  search: '',
  materials: [],
  types: [],
  occasions: [],
  collections: [],
  priceRange: [0, 200000],
  sortBy: 'featured',
  viewMode: 'grid'
};

// Comprehensive jewelry data
const jewelryData: JewelryItem[] = [
  {
    id: 1,
    name: "Royal Diamond Earrings",
    collection: "Rivaah",
    image: productEarrings,
    material: "Diamond",
    type: "Earrings",
    occasion: "Bridal",
    priceRange: "₹45,000 - ₹65,000",
    priceMin: 45000,
    priceMax: 65000,
    isNew: true,
    isFavorite: false,
    featured: true,
    popular: true,
    sku: "RDE001",
    description: "Exquisite diamond earrings crafted for your special day"
  },
  {
    id: 2,
    name: "Eternal Promise Ring",
    collection: "Rivaah",
    image: productRing,
    material: "Rose Gold",
    type: "Rings",
    occasion: "Bridal",
    priceRange: "₹85,000 - ₹1,20,000",
    priceMin: 85000,
    priceMax: 120000,
    isNew: false,
    isFavorite: true,
    featured: true,
    popular: false,
    sku: "EPR002",
    description: "A symbol of eternal love in rose gold"
  },
  {
    id: 3,
    name: "Classic Gold Necklace",
    collection: "GlamDays",
    image: productNecklace,
    material: "Gold",
    type: "Necklaces",
    occasion: "Daily Wear",
    priceRange: "₹35,000 - ₹55,000",
    priceMin: 35000,
    priceMax: 55000,
    isNew: false,
    isFavorite: false,
    featured: true,
    popular: true,
    sku: "CGN003",
    description: "Elegant gold necklace for everyday elegance"
  },
  {
    id: 4,
    name: "Traditional Gold Bangles",
    collection: "Signature Series",
    image: productBangles,
    material: "Gold",
    type: "Bangles",
    occasion: "Festive",
    priceRange: "₹25,000 - ₹45,000",
    priceMin: 25000,
    priceMax: 45000,
    isNew: true,
    isFavorite: true,
    featured: false,
    popular: true,
    sku: "TGB004",
    description: "Traditional bangles for festive occasions"
  },
  {
    id: 5,
    name: "Elegant Pearl Earrings",
    collection: "Modern Minimal",
    image: productEarrings,
    material: "Platinum",
    type: "Earrings",
    occasion: "Office",
    priceRange: "₹30,000 - ₹50,000",
    priceMin: 30000,
    priceMax: 50000,
    isNew: false,
    isFavorite: false,
    featured: false,
    popular: false,
    sku: "EPE005",
    description: "Sophisticated pearl earrings for professional elegance"
  },
  {
    id: 6,
    name: "Designer Diamond Ring",
    collection: "Signature Series",
    image: productRing,
    material: "Diamond",
    type: "Rings",
    occasion: "Gift Ideas",
    priceRange: "₹95,000 - ₹1,50,000",
    priceMin: 95000,
    priceMax: 150000,
    isNew: true,
    isFavorite: false,
    featured: true,
    popular: true,
    sku: "DDR006",
    description: "Stunning diamond ring perfect for special occasions"
  },
  {
    id: 7,
    name: "Vintage Gold Necklace",
    collection: "Rivaah",
    image: productNecklace,
    material: "Gold",
    type: "Necklaces",
    occasion: "Bridal",
    priceRange: "₹55,000 - ₹85,000",
    priceMin: 55000,
    priceMax: 85000,
    isNew: false,
    isFavorite: true,
    featured: false,
    popular: true,
    sku: "VGN007",
    description: "Vintage-inspired gold necklace for timeless beauty"
  },
  {
    id: 8,
    name: "Modern Silver Bracelet",
    collection: "Modern Minimal",
    image: productBangles,
    material: "Platinum",
    type: "Bracelets",
    occasion: "Daily Wear",
    priceRange: "₹15,000 - ₹25,000",
    priceMin: 15000,
    priceMax: 25000,
    isNew: true,
    isFavorite: false,
    featured: false,
    popular: false,
    sku: "MSB008",
    description: "Contemporary bracelet for modern lifestyle"
  },
  {
    id: 9,
    name: "Gemstone Earrings",
    collection: "GlamDays",
    image: productEarrings,
    material: "Gemstone",
    type: "Earrings",
    occasion: "Festive",
    priceRange: "₹40,000 - ₹60,000",
    priceMin: 40000,
    priceMax: 60000,
    isNew: false,
    isFavorite: true,
    featured: true,
    popular: true,
    sku: "GE009",
    description: "Vibrant gemstone earrings for festive celebrations"
  },
  {
    id: 10,
    name: "White Gold Band",
    collection: "Modern Minimal",
    image: productRing,
    material: "White Gold",
    type: "Rings",
    occasion: "Daily Wear",
    priceRange: "₹20,000 - ₹35,000",
    priceMin: 20000,
    priceMax: 35000,
    isNew: false,
    isFavorite: false,
    featured: false,
    popular: true,
    sku: "WGB010",
    description: "Simple and elegant white gold band"
  }
];

export const JewelryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items] = useState<JewelryItem[]>(jewelryData);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [filteredItems, setFilteredItems] = useState<JewelryItem[]>(items);
  const [isLoading, setIsLoading] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  useEffect(() => {
    setIsLoading(true);
    
    let filtered = [...items];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.material.toLowerCase().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower) ||
        item.collection.toLowerCase().includes(searchLower)
      );
    }

    // Material filter
    if (filters.materials.length > 0) {
      filtered = filtered.filter(item =>
        filters.materials.includes(item.material)
      );
    }

    // Type filter
    if (filters.types.length > 0) {
      filtered = filtered.filter(item =>
        filters.types.includes(item.type)
      );
    }

    // Occasion filter
    if (filters.occasions.length > 0) {
      filtered = filtered.filter(item =>
        filters.occasions.includes(item.occasion)
      );
    }

    // Collection filter
    if (filters.collections.length > 0) {
      filtered = filtered.filter(item =>
        filters.collections.includes(item.collection)
      );
    }

    // Price range filter
    filtered = filtered.filter(item =>
      item.priceMin >= filters.priceRange[0] && item.priceMax <= filters.priceRange[1]
    );

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.priceMin - b.priceMin);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.priceMax - a.priceMax);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredItems(filtered);
    setIsLoading(false);
  }, [filters, items]);

  return (
    <JewelryContext.Provider value={{
      items,
      filteredItems,
      filters,
      updateFilter,
      resetFilters,
      isLoading
    }}>
      {children}
    </JewelryContext.Provider>
  );
};

export const useJewelry = () => {
  const context = useContext(JewelryContext);
  if (context === undefined) {
    throw new Error('useJewelry must be used within a JewelryProvider');
  }
  return context;
};