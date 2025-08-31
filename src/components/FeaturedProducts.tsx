import { useState } from 'react';
import { Filter, Grid3X3, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from './ProductCard';
import productEarrings from '@/assets/product-earrings.jpg';
import productRing from '@/assets/product-ring.jpg';
import productNecklace from '@/assets/product-necklace.jpg';
import productBangles from '@/assets/product-bangles.jpg';

const FeaturedProducts = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [sortBy, setSortBy] = useState('featured');

  const products = [
    {
      id: 1,
      name: "Royal Diamond Earrings",
      collection: "Heritage Collection",
      image: productEarrings,
      material: "White Gold",
      occasion: "Festive",
      priceRange: "₹45,000 - ₹65,000",
      isNew: true,
      isFavorite: false
    },
    {
      id: 2,
      name: "Eternal Promise Ring",
      collection: "Bridal Collection",
      image: productRing,
      material: "Rose Gold",
      occasion: "Bridal",
      priceRange: "₹85,000 - ₹1,20,000",
      isNew: false,
      isFavorite: true
    },
    {
      id: 3,
      name: "Classic Gold Necklace",
      collection: "Daily Elegance",
      image: productNecklace,
      material: "Gold",
      occasion: "Daily Wear",
      priceRange: "₹35,000 - ₹55,000",
      isNew: false,
      isFavorite: false
    },
    {
      id: 4,
      name: "Traditional Gold Bangles",
      collection: "Heritage Collection",
      image: productBangles,
      material: "Gold",
      occasion: "Festive",
      priceRange: "₹25,000 - ₹45,000",
      isNew: true,
      isFavorite: true
    },
    {
      id: 5,
      name: "Elegant Pearl Earrings",
      collection: "Modern Collection",
      image: productEarrings,
      material: "Platinum",
      occasion: "Daily Wear",
      priceRange: "₹30,000 - ₹50,000",
      isNew: false,
      isFavorite: false
    },
    {
      id: 6,
      name: "Designer Diamond Ring",
      collection: "Premium Collection",
      image: productRing,
      material: "White Gold",
      occasion: "Anniversary",
      priceRange: "₹95,000 - ₹1,50,000",
      isNew: true,
      isFavorite: false
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Featured Jewelry
            </h2>
            <p className="text-xl text-muted-foreground">
              Handpicked pieces from our finest collections
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-4 mt-6 lg:mt-0">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <div className="flex border border-border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'large' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('large')}
                className="rounded-l-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-8 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-elegant px-12"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;