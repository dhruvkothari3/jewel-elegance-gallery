import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCollections } from '@/hooks/useCollections';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Filter, Grid3X3, Grid2X2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CollectionDetailPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { products, loading: productsLoading } = useProducts();
  const { collections, loading: collectionsLoading } = useCollections();
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // Sample collection data for predefined collections
  const sampleCollections = {
    'bridal': {
      id: 'bridal',
      name: 'Bridal Collection',
      description: 'Exquisite pieces crafted for your most special day. Each piece in our bridal collection embodies the beauty, elegance, and significance of your wedding celebration.',
      banner_image: '/src/assets/collection-bridal.jpg',
      handle: 'bridal'
    },
    'festive': {
      id: 'festive',
      name: 'Festive Elegance',
      description: 'Traditional designs with modern touches, perfect for celebrations and special occasions. Honor tradition while embracing contemporary style.',
      banner_image: '/src/assets/hero-jewelry.jpg',
      handle: 'festive'
    },
    'daily-wear': {
      id: 'daily-wear',
      name: 'Daily Wear',
      description: 'Comfortable luxury for everyday elegance. Sophisticated pieces that seamlessly blend with your daily routine.',
      banner_image: '/src/assets/product-earrings.jpg',
      handle: 'daily-wear'
    }
  };

  // Find the collection
  const dbCollection = collections.find(c => c.handle === handle || c.id === handle);
  const sampleCollection = handle ? sampleCollections[handle as keyof typeof sampleCollections] : null;
  const collection = dbCollection || sampleCollection;

  useEffect(() => {
    if (!collection || productsLoading) return;

    let filtered = products;

    // Filter by collection
    if (dbCollection) {
      // For database collections, filter by collection_id
      filtered = products.filter(product => product.collection_id === dbCollection.id);
    } else if (sampleCollection) {
      // For sample collections, filter by occasion or type
      switch (handle) {
        case 'bridal':
          filtered = products.filter(product => 
            product.occasion === 'bridal' || 
            product.type === 'ring' ||
            product.material === 'diamond'
          );
          break;
        case 'festive':
          filtered = products.filter(product => 
            product.occasion === 'festive' ||
            product.material === 'gold'
          );
          break;
        case 'daily-wear':
          filtered = products.filter(product => 
            product.occasion === 'daily-wear'
          );
          break;
        default:
          filtered = [];
      }
    }

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'type':
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
    }

    setFilteredProducts(filtered);
  }, [collection, products, sortBy, productsLoading, handle, dbCollection, sampleCollection]);

  if (collectionsLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Collection Not Found</h1>
          <p className="text-muted-foreground mb-8">The collection you're looking for doesn't exist.</p>
          <Link to="/collections">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-primary transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-foreground">{collection.name}</span>
        </nav>
      </div>

      {/* Collection Header */}
      <div className="relative h-64 md:h-80 mb-8">
        <img
          src={collection.banner_image || '/src/assets/hero-jewelry.jpg'}
          alt={collection.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
                {collection.name}
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                {collection.description}
              </p>
              <div className="mt-6">
                <Badge variant="secondary" className="bg-white/90 text-primary">
                  {filteredProducts.length} Products
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link to="/collections">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="type">By Type</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'large' ? 'default' : 'ghost'}
                size="sm" 
                onClick={() => setViewMode('large')}
                className="h-8 w-8 p-0"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                collection={collection.name}
                type={product.type}
                material={product.material}
                occasion={product.occasion || 'Special'}
                image={(product as any).image || product.images?.[0] || '/src/assets/product-ring.jpg'}
                priceRange="₹25,000 - ₹75,000"
                sku={product.sku}
                description={product.description || ''}
                isNew={product.new_arrival}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground mb-8">
              This collection doesn't have any products yet, or they don't match the current filters.
            </p>
            <Link to="/collections">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Explore Other Collections
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailPage;