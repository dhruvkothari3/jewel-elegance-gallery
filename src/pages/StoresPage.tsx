import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStores } from '@/hooks/useStores';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Phone, Clock, Navigation as NavigationIcon, Search } from 'lucide-react';

const StoresPage = () => {
  const { stores, loading } = useStores();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample stores for demonstration
  const sampleStores = [
    {
      id: 'mumbai-main',
      store_name: 'Elegance Mumbai - Main Branch',
      address: '123, Linking Road, Bandra West',
      city: 'Mumbai',
      phone: '+91 98765 43210',
      hours: 'Mon-Sat: 10 AM - 9 PM, Sun: 11 AM - 8 PM',
      map_link: 'https://maps.google.com/?q=Bandra+West+Mumbai',
      lat: 19.0596,
      lng: 72.8295
    },
    {
      id: 'delhi-cp',
      store_name: 'Elegance Delhi - Connaught Place',
      address: 'A-15, Connaught Place, Central Delhi',
      city: 'Delhi',
      phone: '+91 98765 43211',
      hours: 'Mon-Sat: 10 AM - 9 PM, Sun: 11 AM - 8 PM',
      map_link: 'https://maps.google.com/?q=Connaught+Place+Delhi',
      lat: 28.6315,
      lng: 77.2167
    },
    {
      id: 'bangalore-mg',
      store_name: 'Elegance Bangalore - MG Road',
      address: '456, MG Road, Near Brigade Road',
      city: 'Bangalore',
      phone: '+91 98765 43212',
      hours: 'Mon-Sat: 10 AM - 9 PM, Sun: 11 AM - 8 PM',
      map_link: 'https://maps.google.com/?q=MG+Road+Bangalore',
      lat: 12.9716,
      lng: 77.5946
    }
  ];

  const allStores = [...sampleStores, ...stores];

  const filteredStores = allStores.filter(store =>
    store.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
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
            <MapPin className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold">
              Our <span className="gradient-gold bg-clip-text text-transparent">Stores</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Visit our elegant showrooms to experience our jewelry collections in person. 
            Our expert consultants are ready to help you find the perfect piece.
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Input
              type="search"
              placeholder="Search by city or store name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {filteredStores.length} Store{filteredStores.length !== 1 ? 's' : ''} Found
          </h2>
          <Badge variant="secondary">
            {allStores.length} Total Locations
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStores.map((store) => (
            <Card key={store.id} className="hover:shadow-elegant transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="text-lg">{store.store_name}</span>
                  <Badge variant="outline" className="ml-2">
                    {store.city}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground text-sm">
                    {store.address}
                  </p>
                </div>
                
                {store.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <a 
                      href={`tel:${store.phone}`}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {store.phone}
                    </a>
                  </div>
                )}
                
                {store.hours && (
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">
                      {store.hours}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Link to={`/store/${store.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  
                  {store.map_link && (
                    <a 
                      href={store.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full">
                        <NavigationIcon className="mr-2 h-4 w-4" />
                        Directions
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Stores Found</h3>
            <p className="text-muted-foreground mb-8">
              {searchQuery 
                ? `No stores match your search for "${searchQuery}". Try a different search term.`
                : "We're expanding our store network. Check back soon for new locations."
              }
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoresPage;