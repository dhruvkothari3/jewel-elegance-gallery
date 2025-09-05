import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollections } from '@/hooks/useCollections';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Sparkles } from 'lucide-react';

const CollectionsPage = () => {
  const { collections, loading } = useCollections();

  // Sample collections data for demonstration
  const sampleCollections = [
    {
      id: 'bridal',
      name: 'Bridal Collection',
      description: 'Exquisite pieces for your special day',
      banner_image: '/src/assets/collection-bridal.jpg',
      handle: 'bridal',
      productCount: 24
    },
    {
      id: 'festive',
      name: 'Festive Elegance',
      description: 'Traditional designs with modern touches',
      banner_image: '/src/assets/hero-jewelry.jpg',
      handle: 'festive',
      productCount: 18
    },
    {
      id: 'daily-wear',
      name: 'Daily Wear',
      description: 'Comfortable luxury for everyday',
      banner_image: '/src/assets/product-earrings.jpg',
      handle: 'daily-wear',
      productCount: 32
    }
  ];

  const allCollections = [...sampleCollections, ...collections.map(c => ({
    ...c,
    productCount: Math.floor(Math.random() * 30) + 5 // Random count for demo
  }))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold">
              Our <span className="gradient-gold bg-clip-text text-transparent">Collections</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our curated collections, each telling a unique story of craftsmanship, 
            elegance, and timeless beauty. From bridal magnificence to everyday luxury.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allCollections.map((collection, index) => (
            <Card key={collection.id} className="group overflow-hidden hover:shadow-elegant transition-all duration-500 hover:scale-[1.02]">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={collection.banner_image || '/src/assets/hero-jewelry.jpg'}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-primary">
                    {collection.productCount} Items
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-primary transition-colors">
                  {collection.name}
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">
                  {collection.description}
                </p>
                
                <Link to={`/collection/${collection.handle || collection.id}`}>
                  <Button className="w-full group/btn">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {allCollections.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Collections Yet</h3>
            <p className="text-muted-foreground">
              Our collections are being curated. Check back soon for amazing jewelry collections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;